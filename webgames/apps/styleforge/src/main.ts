import './style.css';
import { Mecab, type MecabRawToken } from './mecab-client';

type Style = 'polite' | 'plain' | 'casual' | 'business';

type Token = {
  surface: string;
  base: string;
  pos: string;
  posDetail1: string;
  posDetail2: string;
  posDetail3: string;
  conjType: string;
  conjForm: string;
  reading: string;
  pronunciation: string;
  isPunctuation: boolean;
};

const STYLE_OPTIONS: Array<{ value: Style; label: string; description: string }> = [
  {
    value: 'polite',
    label: 'ですます調（フォーマル）',
    description: '丁寧な「です・ます」調に整えます。',
  },
  {
    value: 'plain',
    label: 'である調（論文・解説向け）',
    description: '常体（だ・である調）の文体に変換します。',
  },
  {
    value: 'casual',
    label: 'カジュアル（フレンドリー）',
    description: '砕けた親しみやすいトーンに寄せます。',
  },
  {
    value: 'business',
    label: 'ビジネスメール調',
    description: '敬語と丁寧語を強め、ビジネス向けの体裁に整えます。',
  },
];

const PUNCTUATION = new Set(['。', '！', '!', '？', '?', '、', '，', '．', '…', '‥', '〜', '~']);
const SENTENCE_BOUNDARY = new Set(['。', '！', '!', '？', '?', '…', '‥']);

const app = document.querySelector<HTMLElement>('#app');

if (!app) {
  throw new Error('#app が見つかりません');
}

app.innerHTML = `
  <section class="header">
    <h1>文体スタイル変換ファクトリー</h1>
    <p>
      任意の文章 <span aria-hidden="true">a</span> を選んだ文体 <span aria-hidden="true">b</span> に合わせてリライト（結果 <span aria-hidden="true">c</span>）し、
      MeCab による形態素解析の結果も合わせて確認できるブラウザツールです。
    </p>
  </section>

  <div class="status" id="engine-status" data-state="loading" role="status">MeCab エンジンを読み込み中です…</div>

  <section class="panel" aria-label="文体変換フォーム">
    <article class="card">
      <label for="source-text">入力テキスト（a）</label>
      <textarea id="source-text" placeholder="例：本日は新しい機能のご案内をいたします。何かご不明点があればお知らせください。"></textarea>
    </article>
    <article class="card">
      <label for="style-select">文体スタイル（b）</label>
      <select id="style-select">
        ${STYLE_OPTIONS.map(
          (option) =>
            `<option value="${option.value}">${option.label} — ${option.description}</option>`,
        ).join('')}
      </select>
      <button id="convert-button" type="button" disabled>文体変換する</button>
      <p class="status" id="helper-status">MeCab の準備が整うとボタンが有効になります。</p>
    </article>
    <article class="card output-card">
      <label for="output-text">出力結果（c）</label>
      <div id="output-text" class="output-text" aria-live="polite"></div>
    </article>
  </section>

  <section class="analysis" aria-live="polite">
    <div class="analysis-header">
      <h2>形態素解析（MeCab）</h2>
      <span id="analysis-count">トークン 0件</span>
    </div>
    <table>
      <thead>
        <tr>
          <th scope="col">表層</th>
          <th scope="col">品詞</th>
          <th scope="col">詳細</th>
          <th scope="col">基本形</th>
          <th scope="col">読み</th>
        </tr>
      </thead>
      <tbody id="analysis-body">
        <tr>
          <td colspan="5">MeCab の結果がここに表示されます。</td>
        </tr>
      </tbody>
    </table>
  </section>
`;

const statusEl = document.querySelector<HTMLElement>('#engine-status');
const helperStatusEl = document.querySelector<HTMLElement>('#helper-status');
const inputEl = document.querySelector<HTMLTextAreaElement>('#source-text');
const styleEl = document.querySelector<HTMLSelectElement>('#style-select');
const buttonEl = document.querySelector<HTMLButtonElement>('#convert-button');
const outputEl = document.querySelector<HTMLDivElement>('#output-text');
const analysisBodyEl = document.querySelector<HTMLTableSectionElement>('#analysis-body');
const analysisCountEl = document.querySelector<HTMLSpanElement>('#analysis-count');

if (!statusEl || !helperStatusEl || !inputEl || !styleEl || !buttonEl || !outputEl || !analysisBodyEl || !analysisCountEl) {
  throw new Error('必要なDOM要素の構築に失敗しました');
}

let mecabReady = false;
let mecabLoadError = false;
let mecabInitPromise: Promise<void> | null = null;

const ensureMecab = async () => {
  if (mecabReady || mecabLoadError) {
    return;
  }
  if (!mecabInitPromise) {
    mecabInitPromise = Mecab.waitReady();
  }
  try {
    await mecabInitPromise;
    mecabReady = true;
    statusEl.dataset.state = 'ready';
    statusEl.textContent = 'MeCab エンジンの準備が整いました。';
    helperStatusEl.textContent = 'テキストを入力して文体変換を実行してください。';
    updateButtonState();
  } catch (error) {
    mecabLoadError = true;
    statusEl.dataset.state = 'error';
    statusEl.textContent = 'MeCab の読み込みに失敗しました。ページを再読込してください。';
    helperStatusEl.textContent = 'エンジンを初期化できないため、変換を実行できません。';
    console.error(error);
  }
};

const updateButtonState = () => {
  const hasText = inputEl.value.trim().length > 0;
  buttonEl.disabled = !mecabReady || mecabLoadError || !hasText;
};

inputEl.addEventListener('input', () => {
  updateButtonState();
});

styleEl.addEventListener('change', () => {
  if (!buttonEl.disabled && inputEl.value.trim()) {
    void transformText();
  }
});

buttonEl.addEventListener('click', () => {
  void transformText();
});

const MAX_DISPLAY_TOKENS = 320;

const renderAnalysis = (tokens: Token[]) => {
  analysisCountEl.textContent = `トークン ${tokens.length}件`;
  if (!tokens.length) {
    analysisBodyEl.innerHTML = `<tr><td colspan="5">解析結果がありません。文章を入力し「文体変換する」を押してください。</td></tr>`;
    return;
  }

  const rows = tokens.slice(0, MAX_DISPLAY_TOKENS).map((token) => {
    const posDetails = [token.posDetail1, token.posDetail2, token.posDetail3].filter((detail) => detail && detail !== '*').join(' / ') || '—';
    const reading = token.reading && token.reading !== '*' ? token.reading : '—';
    const base = token.base && token.base !== '*' ? token.base : token.surface;
    return `<tr>
      <td>${escapeHtml(token.surface)}</td>
      <td>${escapeHtml(token.pos)}</td>
      <td>${escapeHtml(posDetails)}</td>
      <td>${escapeHtml(base)}</td>
      <td>${escapeHtml(reading)}</td>
    </tr>`;
  });

  if (tokens.length > MAX_DISPLAY_TOKENS) {
    rows.push(`<tr><td colspan="5">… 以降 ${tokens.length - MAX_DISPLAY_TOKENS} 件は省略しています。</td></tr>`);
  }

  analysisBodyEl.innerHTML = rows.join('');
};

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const buildTokens = (raw: MecabRawToken[]): Token[] =>
  raw.map((entry) => {
    const base = entry.dictionary_form && entry.dictionary_form !== '*' ? entry.dictionary_form : entry.word;
    return {
      surface: entry.word,
      base,
      pos: entry.pos,
      posDetail1: entry.pos_detail1,
      posDetail2: entry.pos_detail2,
      posDetail3: entry.pos_detail3,
      conjType: entry.conjugation2 || '',
      conjForm: entry.conjugation1 || '',
      reading: entry.reading || '',
      pronunciation: entry.pronunciation || '',
      isPunctuation: PUNCTUATION.has(entry.word),
    };
  });

const segmentSentences = (tokens: Token[]): Token[][] => {
  const sentences: Token[][] = [];
  let current: Token[] = [];
  tokens.forEach((token) => {
    current.push(token);
    if (SENTENCE_BOUNDARY.has(token.surface)) {
      sentences.push(current);
      current = [];
    }
  });
  if (current.length) {
    sentences.push(current);
  }
  return sentences;
};

const toMasuForm = (token: Token): string => {
  const base = token.base;
  if (!base || base === '*') {
    return token.surface;
  }
  if (base === 'する') {
    return 'します';
  }
  if (base === '為る') {
    return 'いたします';
  }
  if (base === 'くる' || base === '来る') {
    return 'きます';
  }
  if (token.conjType.includes('一段')) {
    return base.replace(/る$/u, 'ます');
  }
  if (token.conjType.includes('サ変')) {
    return base.replace(/する$/u, 'します');
  }

  const ending = base.slice(-1);
  const godanStem: Record<string, string> = {
    う: 'い',
    く: 'き',
    ぐ: 'ぎ',
    す: 'し',
    つ: 'ち',
    ぬ: 'に',
    ぶ: 'び',
    む: 'み',
    る: 'り',
  };

  if (ending in godanStem) {
    return `${base.slice(0, -1)}${godanStem[ending as keyof typeof godanStem]}ます`;
  }

  return `${base}ます`;
};

const findLastContentIndex = (tokens: Token[]): number => {
  for (let index = tokens.length - 1; index >= 0; index -= 1) {
    if (!tokens[index].isPunctuation && tokens[index].pos !== '記号') {
      return index;
    }
  }
  return -1;
};

const applyPolite = (sentence: Token[]): string => {
  const surfaces = sentence.map((token) => token.surface);
  sentence.forEach((token, index) => {
    if (token.pos === '助動詞' && token.base === 'だ') {
      surfaces[index] = 'です';
    }
    if (token.surface === 'である') {
      surfaces[index] = 'です';
    }
  });

  const lastIndex = findLastContentIndex(sentence);
  if (lastIndex >= 0) {
    const lastToken = sentence[lastIndex];
    if (lastToken.pos === '動詞') {
      surfaces[lastIndex] = toMasuForm(lastToken);
    } else if (lastToken.pos === '形容詞') {
      if (!surfaces[lastIndex].endsWith('です')) {
        const base = lastToken.base && lastToken.base !== '*' ? lastToken.base : lastToken.surface;
        surfaces[lastIndex] = base.replace(/い$/u, 'いです');
      }
    } else if (lastToken.pos.startsWith('名詞') || lastToken.pos === '代名詞') {
      const insertIndex = sentence.findIndex((token, idx) => idx > lastIndex && token.isPunctuation);
      const targetIndex = insertIndex === -1 ? sentence.length : insertIndex;
      surfaces.splice(targetIndex, 0, 'です');
    }
  }

  return surfaces.filter(Boolean).join('');
};

const applyPlain = (sentence: Token[]): string => {
  const surfaces = sentence.map((token) => token.surface);
  sentence.forEach((token, index) => {
    if (token.pos === '助動詞' && token.base === 'です') {
      surfaces[index] = 'だ';
    }
    if (token.pos === '助動詞' && token.base === 'ます') {
      const prevIndex = index - 1;
      if (prevIndex >= 0 && sentence[prevIndex].pos === '動詞') {
        const prevBase = sentence[prevIndex].base && sentence[prevIndex].base !== '*' ? sentence[prevIndex].base : sentence[prevIndex].surface;
        surfaces[prevIndex] = prevBase;
        surfaces[index] = '';
      } else {
        surfaces[index] = 'だ';
      }
    }
    if (token.surface === 'ございます') {
      surfaces[index] = 'ある';
    }
  });

  return surfaces.filter(Boolean).join('');
};

const applyCasual = (sentence: Token[]): string => {
  let text = applyPlain(sentence);
  text = text
    .replace(/でしょう/g, 'だろう')
    .replace(/ください/g, 'ちょうだい')
    .replace(/ます/g, 'る');

  const match = text.match(/[。！？!?]$/u);
  if (match) {
    const punct = match[0];
    text = `${text.slice(0, -punct.length)}だよ${punct}`;
  } else {
    text = `${text}だよ`;
  }
  return text.replace(/だだよ/g, 'だよ');
};

const applyBusiness = (sentence: Token[]): string => {
  let text = applyPolite(sentence);
  text = text
    .replace(/します/g, 'いたします')
    .replace(/しますので/g, 'いたしますので')
    .replace(/です/g, 'でございます')
    .replace(/ください/g, 'くださいますようお願いいたします');
  return text;
};

const transformTokens = (tokens: Token[], style: Style): string => {
  const sentences = segmentSentences(tokens);
  if (!sentences.length) {
    return '';
  }

  if (style === 'business') {
    const body = sentences.map((sentence) => applyBusiness(sentence)).join('');
    const trimmed = body.trimEnd();
    const needsPeriod = trimmed.length > 0 && !/[。！？!?]$/u.test(trimmed);
    const withPeriod = needsPeriod ? `${trimmed}。` : trimmed;
    const closing = '何卒よろしくお願いいたします。';
    return `${withPeriod}\n${closing}`;
  }

  const handler: Record<Exclude<Style, 'business'>, (sentence: Token[]) => string> = {
    polite: applyPolite,
    plain: applyPlain,
    casual: applyCasual,
  };

  return sentences.map((sentence) => handler[style as Exclude<Style, 'business'>](sentence)).join('');
};

const transformText = async () => {
  const text = inputEl.value.trim();
  if (!text) {
    outputEl.textContent = '';
    renderAnalysis([]);
    updateButtonState();
    return;
  }

  updateButtonState();
  buttonEl.disabled = true;
  const previousLabel = buttonEl.textContent;
  buttonEl.textContent = '変換中…';

  try {
    await ensureMecab();
    if (!mecabReady) {
      return;
    }
    const rawTokens = Mecab.query(text.replace(/\r\n/g, '\n'));
    const tokens = buildTokens(rawTokens);
    const style = styleEl.value as Style;
    const transformed = transformTokens(tokens, style);
    outputEl.textContent = transformed || '（出力できる内容がありませんでした）';
    renderAnalysis(tokens);
  } catch (error) {
    statusEl.dataset.state = 'error';
    statusEl.textContent = 'MeCab の解析中にエラーが発生しました。コンソールを確認してください。';
    helperStatusEl.textContent = 'もう一度変換するにはページを再読込してください。';
    mecabLoadError = true;
    outputEl.textContent = '';
    renderAnalysis([]);
    console.error(error);
  } finally {
    buttonEl.textContent = previousLabel;
    updateButtonState();
  }
};

void ensureMecab();

// デフォルトの入力例
inputEl.value = [
  '平素より大変お世話になっております。',
  '来週の勉強会について、資料の最終確認をお願いいたします。',
  'ご不明点があればお気軽にご連絡ください。',
].join('\n');
updateButtonState();
