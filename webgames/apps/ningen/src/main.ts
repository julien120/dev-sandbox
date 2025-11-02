import './style.css';
import { Mecab, type MecabRawToken } from './mecab-client';

type WordStat = {
  surface: string;
  base: string;
  reading: string;
  count: number;
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
  'なる',
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

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('#app not found');
}

app.innerHTML = `
  <section class="header">
    <h1>人間失格ワードクラウドラボ</h1>
    <p>
      青空文庫版『人間失格』を MeCab で形態素解析し、名詞頻度からワードクラウドを生成します。重要度の閾値や上限語数を調整して、太宰治の語彙の揺らぎを可視化しましょう。
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
        <span id="legend"></span>
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
const canvas = document.querySelector<HTMLCanvasElement>('#cloud-canvas');
const legendEl = document.querySelector<HTMLSpanElement>('#legend');

if (
  !statusEl ||
  !cloudStatusEl ||
  !summaryEl ||
  !rankingEl ||
  !minCountEl ||
  !maxWordsEl ||
  !regenerateButton ||
  !downloadButton ||
  !canvas ||
  !legendEl
) {
  throw new Error('必要なDOM要素が見つかりません');
}

type AnalysisResult = {
  tokens: MecabRawToken[];
  stats: WordStat[];
  totalTokens: number;
  nounCount: number;
};

let analysis: AnalysisResult | null = null;

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
    if (!key || STOPWORDS.has(key)) {
      return;
    }
    if (key.length <= 1) {
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

const palette = [
  '#38bdf8',
  '#a855f7',
  '#f472b6',
  '#facc15',
  '#34d399',
  '#60a5fa',
  '#f97316',
  '#f87171',
];

type PlacedWord = {
  stat: WordStat;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  color: string;
};

let placedWords: PlacedWord[] = [];

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
  const minCountInSet = filtered[filtered.length - 1]?.count ?? 1;

  placedWords = computeLayout(filtered, minCountInSet, maxCount);
  drawWordCloud(placedWords);
  cloudStatusEl.dataset.state = 'ready';
  cloudStatusEl.textContent = `生成済み：${filtered.length} 語`;
  legendEl.textContent = '';
  downloadButton.disabled = false;
};

const computeLayout = (words: WordStat[], minCount: number, maxCount: number): PlacedWord[] => {
  const placements: PlacedWord[] = [];
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return placements;
  }
  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const baseStep = 20;
  const padding = 8;

  const toBox = (x: number, y: number, w: number, h: number) => ({
    x,
    y,
    width: w,
    height: h,
  });

  const intersects = (box: ReturnType<typeof toBox>) =>
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
    let box;

    do {
      const offsetX = radius * Math.cos(angle);
      const offsetY = radius * Math.sin(angle);
      x = centerX + offsetX - textWidth / 2;
      y = centerY + offsetY - textHeight / 2;

      box = toBox(x, y, textWidth, textHeight);
      radius += baseStep * 0.3;
      angle += goldenAngle * 0.05;
      attempt += 1;
    } while (intersects(box!) && attempt < 800);

    // Clamp to canvas bounds
    box!.x = Math.min(Math.max(0, box!.x), width - textWidth);
    box!.y = Math.min(Math.max(0, box!.y), height - textHeight);

    placements.push({
      stat: word,
      x: box!.x,
      y: box!.y,
      width: textWidth,
      height: textHeight,
      fontSize,
      color: palette[index % palette.length],
    });
  });

  return placements;
};

const drawWordCloud = (placements: PlacedWord[]) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
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

  ctx.restore();
};

const handleDownload = () => {
  canvas.toBlob((blob) => {
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

regenerateButton.addEventListener('click', generateWordCloud);
downloadButton.addEventListener('click', handleDownload);

const handleCanvasPointer = (event: MouseEvent) => {
  if (!placedWords.length) {
    legendEl.textContent = '';
    return;
  }
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const x = (event.clientX - rect.left) * scaleX;
  const y = (event.clientY - rect.top) * scaleY;
  const match = placedWords.find(
    (word) => x >= word.x && x <= word.x + word.width && y >= word.y && y <= word.y + word.height,
  );
  if (match) {
    legendEl.textContent = `${match.stat.base}（${match.stat.reading}）: ${match.stat.count} 回`;
  } else if (event.type === 'mousemove') {
    legendEl.textContent = '';
  }
};

canvas.addEventListener('mousemove', handleCanvasPointer);
canvas.addEventListener('click', handleCanvasPointer);
canvas.addEventListener('mouseleave', () => {
  legendEl.textContent = '';
});

Promise.resolve()
  .then(() => analyseText())
  .then(() => generateWordCloud())
  .catch((error) => {
    statusEl.dataset.state = 'error';
    statusEl.textContent = '初期化中にエラーが発生しました。コンソールをご確認ください。';
    console.error(error);
  });
