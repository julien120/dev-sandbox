import './style.css';
import { forceCenter, forceCollide, forceLink, forceManyBody, forceSimulation } from 'd3-force';
import { Mecab, type MecabRawToken } from './mecab-client';

type WordStat = {
  surface: string;
  base: string;
  reading: string;
  count: number;
};

type PlacedWord = {
  stat: WordStat;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  color: string;
};

type NetworkNode = {
  id: string;
  label: string;
  reading: string;
  count: number;
  radius: number;
  color: string;
  x: number;
  y: number;
};

type NetworkLink = {
  source: string;
  target: string;
  weight: number;
};

const STOPWORDS = new Set([
  'こと',
  'もの',
  'よう',
  'ような',
  'ように',
  'ところ',
  'それ',
  'これ',
  'あれ',
  'の',
  'ん',
  'そして',
  'しかし',
  'ようだ',
  'ため',
  'ので',
  'など',
  'また',
  'なに',
  '何',
  '自分',
  '人間',
  '私',
  '僕',
  '俺',
  '君',
  'さん',
  'する',
  'こと',
  'ある',
  'いる',
  'なる',
  'できる',
  'これら',
  'それら',
  'どこ',
  'ここ',
  'よう',
  'ほんと',
  'ほんとう',
  '感じ',
  '時',
  '中',
  '前',
  '後',
  '胸',
  '事',
  '人',
  'たち',
  '年',
]);

const SENTENCE_BOUNDARY = new Set(['。', '！', '!', '？', '?', '…', '‥']);

const palette = [
  '#38bdf8',
  '#a855f7',
  '#f472b6',
  '#facc15',
  '#34d399',
  '#60a5fa',
  '#f97316',
  '#fb7185',
];

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('#app not found');
}

app.innerHTML = `
  <section class="header">
    <h1>人間失格ワードクラウドラボ</h1>
    <p>
      青空文庫版『人間失格』を MeCab で形態素解析し、名詞頻度からワードクラウドを生成します。閾値や上限語数を調整して語彙を可視化し、共起ネットワークでも語の関係性を確認しましょう。
    </p>
  </section>
  <div class="status" id="status" data-state="loading">データを解析しています…</div>
  <section class="panel">
    <article class="card">
      <label>解析概要</label>
      <ul id="summary" class="summary-list"></ul>
      <div class="controls">
        <label for="min-count">最小出現回数</label>
        <input id="min-count" type="number" min="1" max="20" value="3" />
        <label for="max-words">最大語数</label>
        <input id="max-words" type="number" min="20" max="200" value="120" />
      </div>
      <div class="controls">
        <button id="regenerate" type="button">ワードクラウドを再生成</button>
        <button id="download" type="button" disabled>PNGとしてダウンロード</button>
      </div>
    </article>
    <article class="card wordcloud-card">
      <h2>Word Cloud</h2>
      <canvas id="cloud-canvas" width="1000" height="600" aria-label="ワードクラウド"></canvas>
      <p class="status" id="cloud-status" data-state="pending">生成準備中です。</p>
      <div class="download-row">
        <span id="cloud-legend"></span>
      </div>
    </article>
    <article class="card network-card">
      <h2>共起ネットワーク</h2>
      <div class="controls">
        <label for="coocc-threshold">最小共起回数</label>
        <input id="coocc-threshold" type="number" min="1" max="30" value="3" />
        <label for="coocc-max-nodes">最大ノード数</label>
        <input id="coocc-max-nodes" type="number" min="10" max="80" value="45" />
      </div>
      <div class="controls">
        <button id="regenerate-network" type="button">共起ネットワークを再生成</button>
      </div>
      <canvas id="network-canvas" width="1000" height="600" aria-label="共起ネットワーク"></canvas>
      <p class="status" id="network-status" data-state="pending">生成準備中です。</p>
      <div class="download-row">
        <span id="network-legend"></span>
      </div>
    </article>
    <article class="card">
      <label>上位語リスト</label>
      <table>
        <thead>
          <tr>
            <th scope="col">語</th>
            <th scope="col">読み</th>
            <th scope="col">出現回数</th>
          </tr>
        </thead>
        <tbody id="ranking"></tbody>
      </table>
    </article>
  </section>
`;

const statusEl = document.querySelector<HTMLDivElement>('#status');
const cloudStatusEl = document.querySelector<HTMLDivElement>('#cloud-status');
const summaryEl = document.querySelector<HTMLUListElement>('#summary');
const rankingEl = document.querySelector<HTMLTableSectionElement>('#ranking');
const minCountEl = document.querySelector<HTMLInputElement>('#min-count');
const maxWordsEl = document.querySelector<HTMLInputElement>('#max-words');
const regenerateButton = document.querySelector<HTMLButtonElement>('#regenerate');
const downloadButton = document.querySelector<HTMLButtonElement>('#download');
const cloudCanvas = document.querySelector<HTMLCanvasElement>('#cloud-canvas');
const cloudLegendEl = document.querySelector<HTMLSpanElement>('#cloud-legend');
const networkCanvas = document.querySelector<HTMLCanvasElement>('#network-canvas');
const networkStatusEl = document.querySelector<HTMLDivElement>('#network-status');
const cooccThresholdEl = document.querySelector<HTMLInputElement>('#coocc-threshold');
const cooccMaxNodesEl = document.querySelector<HTMLInputElement>('#coocc-max-nodes');
const regenerateNetworkButton = document.querySelector<HTMLButtonElement>('#regenerate-network');
const networkLegendEl = document.querySelector<HTMLSpanElement>('#network-legend');

if (
  !statusEl ||
  !cloudStatusEl ||
  !summaryEl ||
  !rankingEl ||
  !minCountEl ||
  !maxWordsEl ||
  !regenerateButton ||
  !downloadButton ||
  !cloudCanvas ||
  !cloudLegendEl ||
  !networkCanvas ||
  !networkStatusEl ||
  !cooccThresholdEl ||
  !cooccMaxNodesEl ||
  !regenerateNetworkButton ||
  !networkLegendEl
) {
  throw new Error('必要なDOM要素が見つかりません');
}

type AnalysisResult = {
  rawTokens: MecabRawToken[];
  tokens: MecabRawToken[];
  stats: WordStat[];
  totalTokens: number;
  nounCount: number;
};

let analysis: AnalysisResult | null = null;
let placedWords: PlacedWord[] = [];
let networkNodes: NetworkNode[] = [];
let networkLinks: NetworkLink[] = [];

const fetchCorpus = async (): Promise<string> => {
  const url = `${import.meta.env.BASE_URL ?? '/'}corpus/ningen.txt`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`本文を取得できませんでした (${response.status})`);
  }
  return response.text();
};

const buildTokens = (raw: MecabRawToken[]): MecabRawToken[] =>
  raw.filter((token) => token.word && token.pos && token.pos !== '記号');

const buildStats = (tokens: MecabRawToken[]): WordStat[] => {
  const map = new Map<string, WordStat>();
  tokens.forEach((token) => {
    if (token.pos !== '名詞') {
      return;
    }
    if (token.pos_detail1 === '数' || token.pos_detail1 === '非自立' || token.pos_detail1 === '代名詞') {
      return;
    }
    const key = (token.dictionary_form && token.dictionary_form !== '*'
      ? token.dictionary_form
      : token.word
    ).trim();
    if (!key || STOPWORDS.has(key) || key.length <= 1) {
      return;
    }
    const entry = map.get(key);
    if (entry) {
      entry.count += 1;
      if (entry.surface.length < token.word.length) {
        entry.surface = token.word;
      }
    } else {
      map.set(key, {
        surface: token.word,
        base: key,
        reading:
          token.reading && token.reading !== '*'
            ? token.reading
            : token.word,
        count: 1,
      });
    }
  });

  return [...map.values()].sort((a, b) => b.count - a.count);
};

const analyseText = async () => {
  statusEl.dataset.state = 'loading';
  statusEl.textContent = '本文を読み込み、解析しています…';
  await Mecab.waitReady();
  const corpus = await fetchCorpus();
  const rawTokens = Mecab.query(corpus);
  const filteredTokens = buildTokens(rawTokens);
  const stats = buildStats(filteredTokens);
  analysis = {
    rawTokens,
    tokens: filteredTokens,
    stats,
    totalTokens: rawTokens.length,
    nounCount: stats.reduce((sum, item) => sum + item.count, 0),
  };
  statusEl.dataset.state = 'ready';
  statusEl.textContent = `解析完了：トークン ${analysis.totalTokens.toLocaleString()}件／抽出名詞 ${
    analysis.stats.length
  }語`;
  renderSummary();
  renderRanking();
};

const renderSummary = () => {
  if (!analysis) {
    return;
  }
  summaryEl.innerHTML = `
    <li>総トークン: ${analysis.totalTokens.toLocaleString()} 件</li>
    <li>抽出名詞: ${analysis.stats.length.toLocaleString()} 語</li>
    <li>名詞出現総数: ${analysis.nounCount.toLocaleString()} 回</li>
  `;
};

const renderRanking = () => {
  if (!analysis) {
    return;
  }
  const top = analysis.stats.slice(0, 20);
  rankingEl.innerHTML = top
    .map(
      (item) => `
        <tr>
          <td>${escapeHtml(item.base)}</td>
          <td>${escapeHtml(item.reading)}</td>
          <td>${item.count}</td>
        </tr>
      `,
    )
    .join('');
};

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const computeLayout = (words: WordStat[], minCount: number, maxCount: number): PlacedWord[] => {
  const placements: PlacedWord[] = [];
  const ctx = cloudCanvas.getContext('2d');
  if (!ctx) {
    return placements;
  }
  const width = cloudCanvas.width;
  const height = cloudCanvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const baseStep = 20;
  const padding = 8;

  const intersects = (box: { x: number; y: number; width: number; height: number }) =>
    placements.some((placed) => {
      const other = {
        x: placed.x - padding / 2,
        y: placed.y - padding / 2,
        width: placed.width + padding,
        height: placed.height + padding,
      };
      return !(
        box.x + box.width < other.x ||
        box.x > other.x + other.width ||
        box.y + box.height < other.y ||
        box.y > other.y + other.height
      );
    });

  words.forEach((word, index) => {
    const normalized = (word.count - minCount) / Math.max(1, maxCount - minCount);
    const fontSize = 18 + normalized * 46;
    ctx.font = `700 ${fontSize}px 'Noto Sans JP', 'Hiragino Kaku Gothic ProN', sans-serif`;
    const metrics = ctx.measureText(word.base);
    const textWidth = metrics.width;
    const textHeight = fontSize * 1.05;

    let angle = index * goldenAngle;
    let radius = baseStep * Math.sqrt(index + 1);
    let attempt = 0;
    let x = 0;
    let y = 0;
    let box: { x: number; y: number; width: number; height: number };

    do {
      const offsetX = radius * Math.cos(angle);
      const offsetY = radius * Math.sin(angle);
      x = centerX + offsetX - textWidth / 2;
      y = centerY + offsetY - textHeight / 2;

      box = { x, y, width: textWidth, height: textHeight };
      radius += baseStep * 0.3;
      angle += goldenAngle * 0.05;
      attempt += 1;
    } while (intersects(box) && attempt < 800);

    box.x = Math.min(Math.max(0, box.x), width - textWidth);
    box.y = Math.min(Math.max(0, box.y), height - textHeight);

    placements.push({
      stat: word,
      x: box.x,
      y: box.y,
      width: textWidth,
      height: textHeight,
      fontSize,
      color: palette[index % palette.length],
    });
  });

  return placements;
};

const drawWordCloud = (placements: PlacedWord[]) => {
  const ctx = cloudCanvas.getContext('2d');
  if (!ctx) {
    return;
  }
  ctx.clearRect(0, 0, cloudCanvas.width, cloudCanvas.height);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.fillRect(0, 0, cloudCanvas.width, cloudCanvas.height);

  ctx.textBaseline = 'top';
  placements
    .slice()
    .sort((a, b) => a.fontSize - b.fontSize)
    .forEach((item) => {
      ctx.font = `700 ${item.fontSize}px 'Noto Sans JP', 'Hiragino Kaku Gothic ProN', sans-serif`;
      const gradient = ctx.createLinearGradient(item.x, item.y, item.x, item.y + item.height);
      gradient.addColorStop(0, item.color);
      gradient.addColorStop(1, `${item.color}cc`);
      ctx.fillStyle = gradient;
      ctx.fillText(item.stat.base, item.x, item.y);
    });
};

const generateWordCloud = () => {
  if (!analysis) {
    return;
  }
  const minCount = Number.parseInt(minCountEl.value, 10) || 1;
  const maxWords = Number.parseInt(maxWordsEl.value, 10) || 120;
  const filtered = analysis.stats.filter((item) => item.count >= minCount).slice(0, maxWords);

  if (!filtered.length) {
    cloudStatusEl.dataset.state = 'error';
    cloudStatusEl.textContent = '指定条件を満たす語がありません。閾値を下げてください。';
    placedWords = [];
    downloadButton.disabled = true;
    return;
  }

  cloudStatusEl.dataset.state = 'loading';
  cloudStatusEl.textContent = `レイアウト計算中…（${filtered.length} 語）`;

  const maxCount = filtered[0]?.count ?? 1;
  const minInSet = filtered[filtered.length - 1]?.count ?? 1;
  placedWords = computeLayout(filtered, minInSet, maxCount);
  drawWordCloud(placedWords);
  cloudStatusEl.dataset.state = 'ready';
  cloudStatusEl.textContent = `生成済み：${filtered.length} 語`;
  cloudLegendEl.textContent = '';
  downloadButton.disabled = false;
};

const computeCooccurrencePairs = (
  rawTokens: MecabRawToken[],
  allowed: Set<string>,
): Map<string, number> => {
  const pairs = new Map<string, number>();
  let sentenceNouns: string[] = [];

  const flush = () => {
    if (!sentenceNouns.length) {
      return;
    }
    const uniques = [...new Set(sentenceNouns)];
    for (let i = 0; i < uniques.length; i += 1) {
      for (let j = i + 1; j < uniques.length; j += 1) {
        const a = uniques[i]!;
        const b = uniques[j]!;
        if (!allowed.has(a) || !allowed.has(b)) {
          continue;
        }
        const key = a < b ? `${a}__${b}` : `${b}__${a}`;
        pairs.set(key, (pairs.get(key) ?? 0) + 1);
      }
    }
    sentenceNouns = [];
  };

  rawTokens.forEach((token) => {
    if (token.pos === '名詞') {
      if (
        token.pos_detail1 === '数' ||
        token.pos_detail1 === '非自立' ||
        token.pos_detail1 === '代名詞'
      ) {
        return;
      }
      const base =
        token.dictionary_form && token.dictionary_form !== '*'
          ? token.dictionary_form
          : token.word;
      if (!base || STOPWORDS.has(base) || base.length <= 1) {
        return;
      }
      sentenceNouns.push(base);
      return;
    }
    if (token.pos === '記号' && SENTENCE_BOUNDARY.has(token.word)) {
      flush();
    }
  });

  flush();

  return pairs;
};

const generateCooccurrenceNetwork = () => {
  if (!analysis) {
    return;
  }
  const requestedMinPair = Number.parseInt(cooccThresholdEl.value, 10) || 3;
  const maxNodes = Number.parseInt(cooccMaxNodesEl.value, 10) || 45;

  networkStatusEl.dataset.state = 'loading';
  networkStatusEl.textContent = '共起ネットワークを構築しています…';

  const rankedNodes = analysis.stats.slice(0, maxNodes);
  const allowed = new Set(rankedNodes.map((stat) => stat.base));
  const pairCounts = computeCooccurrencePairs(analysis.rawTokens, allowed);
  const sortedPairs = [...pairCounts.entries()].sort((a, b) => b[1] - a[1]);

  let threshold = requestedMinPair;
  let links: NetworkLink[] = [];

  while (threshold >= 1) {
    links = sortedPairs
      .filter(([, weight]) => weight >= threshold)
      .map(([key, weight]) => {
        const [a, b] = key.split('__');
        return { source: a!, target: b!, weight };
      });
    if (links.length || threshold === 1) {
      break;
    }
    threshold -= 1;
  }

  if (!links.length) {
    networkStatusEl.dataset.state = 'error';
    networkStatusEl.textContent = '共起が見つかりませんでした。条件を見直してください。';
    networkNodes = [];
    networkLinks = [];
    drawCooccurrenceNetwork();
    return;
  }

  if (threshold !== requestedMinPair) {
    networkStatusEl.dataset.state = 'loading';
    networkStatusEl.textContent = `指定された最小共起回数では共起が見つかりませんでした。閾値 ${threshold} で生成しています。`;
  }

  const nodeMap = new Map<string, WordStat>();
  rankedNodes.forEach((stat) => nodeMap.set(stat.base, stat));

  const usedNodes = new Set<string>();
  links.forEach((link) => {
    usedNodes.add(link.source);
    usedNodes.add(link.target);
  });

  const selectedNodes = rankedNodes.filter((stat) => usedNodes.has(stat.base));
  const maxCount = selectedNodes[0]?.count ?? 1;

  const simulationNodes = selectedNodes.map((stat, index) => ({
    id: stat.base,
    label: stat.base,
    reading: stat.reading,
    count: stat.count,
    radius: 18 + (stat.count / maxCount) * 24,
    color: palette[index % palette.length],
  }));

  const simulationLinks = links.map((link) => ({
    source: link.source,
    target: link.target,
    weight: link.weight,
  }));

  const simulation = forceSimulation(simulationNodes as any)
    .force(
      'link',
      forceLink(simulationLinks)
        .id((d: any) => d.id)
        .distance((d) => 220 - Math.min(150, d.weight * 12))
        .strength(0.9),
    )
    .force('charge', forceManyBody().strength(-320))
    .force('center', forceCenter(networkCanvas.width / 2, networkCanvas.height / 2))
    .force('collide', forceCollide().radius((d: any) => d.radius + 16).strength(1));

  simulation.stop();
  for (let i = 0; i < 360; i += 1) {
    simulation.tick();
  }

  networkNodes = simulationNodes as NetworkNode[];
  networkLinks = simulationLinks.map((link: any) => ({
    source: typeof link.source === 'string' ? link.source : link.source.id,
    target: typeof link.target === 'string' ? link.target : link.target.id,
    weight: link.weight,
  }));
  drawCooccurrenceNetwork();
  networkStatusEl.dataset.state = 'ready';
  networkStatusEl.textContent = `生成済み：ノード ${networkNodes.length} 件／エッジ ${networkLinks.length} 本${
    threshold !== requestedMinPair ? `（閾値 ${threshold} へ自動調整）` : ''
  }`;
  networkLegendEl.textContent = '';
};

const drawCooccurrenceNetwork = () => {
  const ctx = networkCanvas.getContext('2d');
  if (!ctx) {
    return;
  }
  ctx.clearRect(0, 0, networkCanvas.width, networkCanvas.height);
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, networkCanvas.width, networkCanvas.height);

  if (!networkNodes.length) {
    return;
  }

  const maxWeight = networkLinks.reduce((m, link) => Math.max(m, link.weight), 1);
  ctx.lineCap = 'round';

  networkLinks.forEach((link) => {
    const source = networkNodes.find((node) => node.id === link.source);
    const target = networkNodes.find((node) => node.id === link.target);
    if (!source || !target) {
      return;
    }
    const thickness = 1 + (link.weight / maxWeight) * 4;
    const gradient = ctx.createLinearGradient(source.x, source.y, target.x, target.y);
    gradient.addColorStop(0, `${source.color}bb`);
    gradient.addColorStop(1, `${target.color}bb`);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = thickness;
    ctx.beginPath();
    ctx.moveTo(source.x, source.y);
    ctx.lineTo(target.x, target.y);
    ctx.stroke();
  });

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  networkNodes.forEach((node) => {
    const gradient = ctx.createRadialGradient(
      node.x,
      node.y,
      node.radius * 0.1,
      node.x,
      node.y,
      node.radius,
    );
    gradient.addColorStop(0, `${node.color}ff`);
    gradient.addColorStop(1, `${node.color}aa`);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0f172a';
    ctx.font = `600 ${Math.max(14, node.radius * 0.7)}px 'Noto Sans JP', 'Hiragino Kaku Gothic ProN', sans-serif`;
    ctx.fillText(node.label, node.x, node.y);
  });
};

const handleDownload = () => {
  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = cloudCanvas.width;
  exportCanvas.height = cloudCanvas.height;
  const exportCtx = exportCanvas.getContext('2d');
  const srcCtx = cloudCanvas.getContext('2d');
  if (!exportCtx || !srcCtx) {
    return;
  }
  exportCtx.fillStyle = '#ffffff';
  exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
  exportCtx.drawImage(cloudCanvas, 0, 0);

  exportCanvas.toBlob((blob) => {
    if (!blob) {
      return;
    }
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ningen-wordcloud.png';
    link.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
};

const handleCloudPointer = (event: MouseEvent) => {
  if (!placedWords.length) {
    cloudLegendEl.textContent = '';
    return;
  }
  const rect = cloudCanvas.getBoundingClientRect();
  const scaleX = cloudCanvas.width / rect.width;
  const scaleY = cloudCanvas.height / rect.height;
  const x = (event.clientX - rect.left) * scaleX;
  const y = (event.clientY - rect.top) * scaleY;
  const match = placedWords.find(
    (word) =>
      x >= word.x &&
      x <= word.x + word.width &&
      y >= word.y &&
      y <= word.y + word.height,
  );
  if (match) {
      cloudLegendEl.textContent = `${match.stat.base}（${match.stat.reading}）: ${match.stat.count} 回`;
  } else if (event.type === 'mousemove') {
    cloudLegendEl.textContent = '';
  }
};

const handleNetworkPointer = (event: MouseEvent) => {
  if (!networkNodes.length) {
    networkLegendEl.textContent = '';
    return;
  }
  const rect = networkCanvas.getBoundingClientRect();
  const scaleX = networkCanvas.width / rect.width;
  const scaleY = networkCanvas.height / rect.height;
  const x = (event.clientX - rect.left) * scaleX;
  const y = (event.clientY - rect.top) * scaleY;
  const match = networkNodes.find((node) => {
    const dx = x - node.x;
    const dy = y - node.y;
    return Math.sqrt(dx * dx + dy * dy) <= node.radius;
  });
  if (match) {
    const neighbors = networkLinks
      .filter((link) => link.source === match.id || link.target === match.id)
      .map((link) => (link.source === match.id ? link.target : link.source))
      .join('、');
    networkLegendEl.textContent = `${match.label}（${match.reading}）: ${match.count} 回 / 共起: ${
      neighbors || 'なし'
    }`;
  } else if (event.type === 'mousemove') {
    networkLegendEl.textContent = '';
  }
};

regenerateButton.addEventListener('click', generateWordCloud);
downloadButton.addEventListener('click', handleDownload);
cloudCanvas.addEventListener('mousemove', handleCloudPointer);
cloudCanvas.addEventListener('click', handleCloudPointer);
cloudCanvas.addEventListener('mouseleave', () => {
  cloudLegendEl.textContent = '';
});

regenerateNetworkButton.addEventListener('click', generateCooccurrenceNetwork);
networkCanvas.addEventListener('mousemove', handleNetworkPointer);
networkCanvas.addEventListener('click', handleNetworkPointer);
networkCanvas.addEventListener('mouseleave', () => {
  networkLegendEl.textContent = '';
});

Promise.resolve()
  .then(() => analyseText())
  .then(() => {
    generateWordCloud();
    generateCooccurrenceNetwork();
  })
  .catch((error) => {
    statusEl.dataset.state = 'error';
    statusEl.textContent = '初期化中にエラーが発生しました。コンソールをご確認ください。';
    console.error(error);
  });
