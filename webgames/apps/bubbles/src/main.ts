import './style.css';

const main = document.querySelector<HTMLDivElement>('#app');

if (!main) {
  throw new Error('#app not found');
}

const heroCopy = '今日、来たこと人に聞いています。\n最近面白かった映画は？';
const DEFAULT_SHEET_ID = '11JgSoPOSSSDd8j89quU6MhCfjrUQhoaTyaUB0rCYcWc';
const DEFAULT_SHEET_NAME = 'Sheet1';

main.innerHTML = `
  <main>
    <p class="hero-copy">${heroCopy}</p>
    <div class="info-bar" aria-live="polite">
      <span class="status-message">Google スプレッドシートを読み込み中…</span>
      <button type="button" data-refetch>最新の投稿をもう一度読む</button>
    </div>
    <section class="bubble-field" aria-label="投稿一覧" aria-live="polite"></section>
    <footer></footer>
  </main>
`;

const statusEl = main.querySelector<HTMLSpanElement>('.status-message');
const bubbleField = main.querySelector<HTMLElement>('.bubble-field');
const refetchButton = main.querySelector<HTMLButtonElement>('button[data-refetch]');

if (!statusEl || !bubbleField || !refetchButton) {
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
const REFRESH_INTERVAL_MS = 30_000;

const parseGviz = (payload: string): string[] => {
  const trimmed = payload
    .replace(/^.*setResponse\(/, '')
    .replace(/\);\s*$/, '');
  const data = JSON.parse(trimmed);
  const rows = data.table?.rows ?? [];
  const texts = rows
    .map((row: any) => row.c?.[0]?.v)
    .filter((value: unknown): value is string => typeof value === 'string' && value.trim().length > 0)
    .map((value) => value.trim());
  return texts;
};

const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;

const renderBubbles = (messages: string[]) => {
  bubbleField.innerHTML = '';
  if (messages.length === 0) {
    const empty = document.createElement('p');
    empty.textContent = 'まだ投稿がありません。シートの A 列にメッセージを入れてみてください。';
    bubbleField.appendChild(empty);
    return;
  }

  const bounds = bubbleField.getBoundingClientRect();
  const width = bounds.width || bubbleField.clientWidth || 600;
  const height = bounds.height || 480;

  messages.slice(0, 24).forEach((text, index) => {
    const node = document.createElement('div');
    node.className = 'bubble';
    node.textContent = text;

    const size = randomBetween(120, 260);
    const offsetX = randomBetween(size / 2, width - size / 2);
    const offsetY = randomBetween(size / 2, height - size / 2);
    const delay = randomBetween(0, 4);
    const duration = randomBetween(9, 16);
    const drift = randomBetween(-60, 60);

    node.style.setProperty('--float-delay', `${delay}s`);
    node.style.setProperty('--float-duration', `${duration}s`);
    node.style.setProperty('--offset-x', `${offsetX}px`);
    node.style.setProperty('--offset-y', `${offsetY}px`);
    node.style.setProperty('--drift', `${drift}px`);
    node.style.width = `${size}px`;
    node.style.height = `${size}px`;

    bubbleField.appendChild(node);

    requestAnimationFrame(() => {
      node.classList.add('ready');
    });
  });
};

const setStatus = (message: string) => {
  statusEl.textContent = message;
};

const fetchMessages = async () => {
  controller?.abort();
  controller = new AbortController();

  if (!hasSheetConfig) {
    setStatus('Sheet ID が未設定のためサンプル文を表示しています。?sheetId= で指定できます。');
    renderBubbles(fallbackMessages);
    return;
  }

  try {
    setStatus('読み込み中…');
    const response = await fetch(endpoint, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`fetch failed: ${response.status}`);
    }
    const body = await response.text();
    const messages = parseGviz(body);
    if (messages.length === 0) {
      setStatus('シートにテキストが見つからなかったためサンプル文を表示します。');
      renderBubbles(fallbackMessages);
      return;
    }
    renderBubbles(messages);
    const lastUpdated = new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
    setStatus(`最新の投稿を ${lastUpdated} に取得しました。`);
  } catch (error) {
    console.error('[bubbles] failed to fetch sheet', error);
    setStatus('読み込みに失敗しました。ネットワークとシート公開設定をご確認ください。');
    renderBubbles(fallbackMessages);
  }
};

refetchButton.addEventListener('click', () => {
  fetchMessages();
});

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
