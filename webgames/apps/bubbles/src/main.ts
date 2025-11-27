import './style.css';

const main = document.querySelector<HTMLDivElement>('#app');

if (!main) {
  throw new Error('#app not found');
}

const heroCopy = '今日、文フリに来た人に聞いています。\n最近面白かった映画は？';
const DEFAULT_SHEET_ID = '11JgSoPOSSSDd8j89quU6MhCfjrUQhoaTyaUB0rCYcWc';
const DEFAULT_SHEET_NAME = 'Sheet1';

main.innerHTML = `
  <main>
    <p class="hero-copy">${heroCopy}</p>
    <section class="bubble-field" aria-label="投稿一覧" aria-live="polite"></section>
  </main>
`;

const bubbleField = main.querySelector<HTMLElement>('.bubble-field');

if (!bubbleField) {
  throw new Error('initial layout failed');
}

const fallbackMessages = [
  '近所のミニシアターで観たインディーズ最高でした',
  'アニメ映画の光の描写が沁みた…',
  '泣きすぎてハンカチ２枚目投入',
  '友だちと語りたくなるエンディング',
  'ポップコーンを忘れて集中しすぎた',
  'エンドロール後の仕掛けに思わず拍手',
];

const params = new URLSearchParams(window.location.search);
const sheetId = params.get('sheetId') ?? import.meta.env.VITE_SHEET_ID ?? DEFAULT_SHEET_ID;
const sheetName = params.get('sheetName') ?? import.meta.env.VITE_SHEET_NAME ?? DEFAULT_SHEET_NAME;

const normalizedSheetId = sheetId.trim();
const hasSheetConfig = normalizedSheetId.length > 0;

const endpoint = hasSheetConfig
  ? `https://docs.google.com/spreadsheets/d/${normalizedSheetId}/gviz/tq?${new URLSearchParams({
      tqx: 'out:json',
      sheet: sheetName,
      tq: 'select A',
    }).toString()}`
  : '';

let controller: AbortController | null = null;
let refreshTimer: number | null = null;
const REFRESH_INTERVAL_MS = 120_000;

const parseGviz = (payload: string): string[] => {
  if (!payload.includes('setResponse')) {
    throw new Error('gviz payload was not recognized');
  }

  const trimmed = payload
    .replace(/^[\s\S]*?setResponse\(/, '')
    .replace(/\);\s*$/, '');
  const data = JSON.parse(trimmed);

  if (data.status === 'error') {
    const message = data.errors?.[0]?.detailed_message ?? data.errors?.[0]?.message;
    throw new Error(message ?? 'gviz returned an error response');
  }

  const rows = data.table?.rows ?? [];
  type GvizRow = { c?: [{ v?: unknown }] };
  const texts = (rows as GvizRow[])
    .map((row) => row.c?.[0]?.v)
    .filter((value: unknown): value is string => typeof value === 'string' && value.trim().length > 0)
    .map((value) => value.trim());
  return texts;
};

const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;

type BubbleEntry = {
  key: string;
  text: string;
};

const bubbleRegistry = new Map<string, HTMLDivElement>();
const emptyState = document.createElement('p');
emptyState.className = 'empty-state';
emptyState.textContent = 'まだ投稿がありません。シートの A 列にメッセージを入れてみてください。';

const createBubble = (text: string) => {
  const node = document.createElement('div');
  node.className = 'bubble';
  node.textContent = text;

  const width = window.innerWidth || bubbleField.clientWidth || 600;
  const height = window.innerHeight || bubbleField.clientHeight || 480;
  const margin = 80;
  const size = randomBetween(120, 260);
  const offsetX = randomBetween(margin, width - margin);
  const offsetY = randomBetween(margin, height - margin);
  const delay = randomBetween(0, 3);
  const duration = randomBetween(12, 22);
  const driftHorizontal = randomBetween(-60, 60);
  const bob = randomBetween(30, 90);

  node.style.setProperty('--float-delay', `${delay}s`);
  node.style.setProperty('--float-duration', `${duration}s`);
  node.style.setProperty('--drift-left', `${driftHorizontal}px`);
  node.style.setProperty('--drift-right', `${-driftHorizontal}px`);
  node.style.setProperty('--bob-up', `${-bob}px`);
  node.style.setProperty('--bob-down', `${bob * 0.4}px`);
  node.style.width = `${size}px`;
  node.style.height = `${size}px`;
  node.style.left = `${offsetX}px`;
  node.style.top = `${offsetY}px`;

  bubbleField.appendChild(node);
  requestAnimationFrame(() => {
    node.classList.add('ready');
  });
  return node;
};

const keyMessages = (messages: string[]): BubbleEntry[] => {
  const counts = new Map<string, number>();
  return messages.slice(0, 24).map((text) => {
    const normalized = text.trim();
    const current = counts.get(normalized) ?? 0;
    counts.set(normalized, current + 1);
    return {
      key: `${normalized}__${current}`,
      text: normalized,
    };
  });
};

const syncBubbles = (messages: string[]) => {
  const keyed = keyMessages(messages);

  if (keyed.length === 0) {
    bubbleRegistry.forEach((node, key) => {
      node.classList.add('fade-out');
      window.setTimeout(() => node.remove(), 800);
      bubbleRegistry.delete(key);
    });
    if (!bubbleField.contains(emptyState)) {
      bubbleField.appendChild(emptyState);
    }
    return;
  }

  if (bubbleField.contains(emptyState)) {
    emptyState.remove();
  }

  const targetKeys = new Set<string>();

  keyed.forEach(({ key, text }) => {
    targetKeys.add(key);
    if (!bubbleRegistry.has(key)) {
      const bubble = createBubble(text);
      bubble.dataset.key = key;
      bubbleRegistry.set(key, bubble);
    }
  });

  bubbleRegistry.forEach((node, key) => {
    if (!targetKeys.has(key)) {
      bubbleRegistry.delete(key);
      node.classList.add('fade-out');
      window.setTimeout(() => node.remove(), 900);
    }
  });
};

const fetchMessages = async () => {
  controller?.abort();
  controller = new AbortController();

  if (!hasSheetConfig) {
    syncBubbles(fallbackMessages);
    return;
  }

  try {
    const response = await fetch(endpoint, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`fetch failed: ${response.status}`);
    }
    const body = await response.text();
    const messages = parseGviz(body);
    if (messages.length === 0) {
      syncBubbles(fallbackMessages);
      return;
    }
    syncBubbles(messages);
  } catch (error) {
    console.error('[bubbles] failed to fetch sheet', error);
    syncBubbles(fallbackMessages);
  }
};

fetchMessages();

const startAutoRefresh = () => {
  if (refreshTimer) {
    window.clearInterval(refreshTimer);
  }
  refreshTimer = window.setInterval(() => {
    fetchMessages();
  }, REFRESH_INTERVAL_MS);
};

startAutoRefresh();
