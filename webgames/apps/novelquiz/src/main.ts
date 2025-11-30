import './style.css';
import { DEFAULT_WORK, type FrequentWord, WORKS, type WorkMeta } from './data';

type Settings = {
  questionCount: number;
  timeLimitSec: number;
  wordCount: number;
  hintsEnabled: boolean;
};

type RoundResult = {
  status: 'correct' | 'timeout' | 'revealed';
  spentMs: number;
};

type GameState = {
  currentIndex: number;
  results: RoundResult[];
  status: 'idle' | 'playing' | 'revealed' | 'finished';
  startedAt: number;
  countdownMs: number;
  rafId: number | null;
  lastSpendMs: number;
  hintFlags: {
    half: boolean;
    quarter: boolean;
    last: boolean;
  };
  words: FrequentWord[];
  hints: string[];
  revealCount: number;
  renderedCount: number;
  workQueue: WorkMeta[];
  currentWork: WorkMeta;
};

let WORK = DEFAULT_WORK;

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('#app not found');
}

app.innerHTML = `
  <section id="intro-screen" class="screen active">
    <div class="hero intro">
      <div>
        <p class="eyebrow">これなんの小説？</p>
        <h1>頻出語だけでタイトルを当てろ</h1>
        <p class="lede">MeCab で事前解析した小説の頻出語をヒントに、制限時間内で作品名を当てるクイズです。</p>
        <div class="intro-actions">
          <button id="intro-to-settings" class="primary">設定へ進む</button>
        </div>
      </div>
    </div>
  </section>

  <section id="settings-screen" class="screen hidden">
    <header class="hero">
      <div>
        <p class="eyebrow">ステップ1</p>
        <h2>出題条件を決めてから開始</h2>
        <p class="lede">出題数・制限時間・ヒント語数を調整して、自分好みの難易度にカスタムできます。</p>
      </div>
      <div class="callout">
        <p class="callout-title">遊び方</p>
        <ol>
          <li>設定を決める</li>
          <li>頻出語を見ながらタイトルを入力</li>
          <li>時間切れなら答えを表示して次へ</li>
        </ol>
      </div>
    </header>

    <article class="panel" id="settings-panel">
      <div class="panel-header">
        <div>
          <p class="eyebrow">設定</p>
          <h3>出題と制限時間を選ぶ</h3>
        </div>
        <button type="button" class="link" id="use-default">推奨値に戻す</button>
      </div>
      <form id="settings-form" class="form-grid">
        <label class="field">
          <span>出題数</span>
          <input id="count-input" type="number" min="1" max="10" value="3" inputmode="numeric" />
          <small>現在は『${WORK.title}』1作品のみ。複数指定時は同じお題が繰り返されます。</small>
        </label>
        <label class="field">
          <span>制限時間（秒）</span>
          <input id="limit-input" type="number" min="10" max="120" step="5" value="45" inputmode="numeric" />
          <small>時間切れになると答えボタンがポップアップします。</small>
        </label>
          <label class="field">
            <span>頻出単語の数</span>
            <div class="slider-row">
              <input id="word-count-input" type="range" min="5" max="15" value="10" />
              <output id="word-count-label" for="word-count-input">10語</output>
            </div>
            <small>MeCab で事前集計したTOP30から切り出します。</small>
          </label>
          <label class="field field-inline">
            <span>ヒント表示</span>
            <div class="toggle-row">
              <input id="hint-toggle" type="checkbox" checked />
              <span>制限時間の進行に合わせて年代→著者→頭文字を表示</span>
            </div>
          </label>
          <div class="actions">
            <button type="button" id="settings-back" class="ghost">タイトルに戻る</button>
            <div class="spacer"></div>
            <button type="submit" class="primary" id="start-btn">クイズを開始</button>
            <button type="button" id="reset-btn" class="secondary">リセット</button>
        </div>
      </form>
    </article>
  </section>

  <section id="quiz-screen" class="screen hidden">
    <div class="layout">
      <article class="panel game" id="game-panel" aria-live="polite">
        <div class="game-head">
          <div class="progress-group">
            <p class="eyebrow">問題</p>
            <div class="progress-text" id="progress">準備中</div>
          </div>
          <div class="status-badge" id="status-pill">待機中</div>
        </div>

        <div class="hint-banner" id="hint-banner" aria-live="polite">
          <ul id="hint-list"></ul>
        </div>

        <div class="words" id="word-board" aria-label="頻出語リスト"></div>

        <div class="answer-card">
          <div class="answer-row">
            <label for="guess-input">この小説の題名</label>
            <div class="input-stack">
              <input id="guess-input" type="text" placeholder="小説タイトルを入力" autocomplete="off" />
              <button id="submit-btn" type="button" class="primary">答える</button>
            </div>
          </div>
          <p class="hint">ひらがな・カタカナ・漢字を区別せず評価します。</p>
        </div>

        <div class="cta-row">
          <button id="reveal-btn" type="button" class="ghost">答えを見る</button>
          <button id="next-btn" type="button" class="secondary">次のお題へ</button>
        </div>

      <div class="timer" aria-live="polite">
        <div class="bar"><div id="timer-fill"></div></div>
        <span id="timer-label">--秒</span>
      </div>

        <div id="answer-panel" class="answer-panel hidden">
          <p class="answer" id="answer-title">答え：『${WORK.title}』</p>
          <p class="feedback" id="answer-meta">${WORK.author} / ${WORK.year}年</p>
          <p id="feedback" class="feedback"></p>
        </div>

        <div id="timeout-pop" class="timeout hidden" role="alertdialog" aria-live="assertive">
          <p>時間切れ！ 先に答えを確認してから次に進みましょう。</p>
          <div class="pop-actions">
            <button id="pop-reveal" type="button" class="primary">答えを見る</button>
            <button id="pop-next" type="button" class="ghost">次のお題へ</button>
          </div>
        </div>
      </article>
    </div>
  </section>

  <section id="summary-screen" class="screen hidden">
    <article class="panel" id="summary">
      <div class="summary-header">
        <div>
          <p class="eyebrow">リザルト</p>
          <h2>お疲れさま！</h2>
          <p>正解数と平均解答時間を振り返って、次のチャレンジ設定を調整してください。</p>
        </div>
        <div class="summary-actions">
          <button id="summary-to-settings" class="secondary">設定に戻る</button>
          <button id="play-again" class="primary">同じ設定で再挑戦</button>
        </div>
      </div>
      <dl class="stats">
        <div>
          <dt>正解</dt>
          <dd id="stat-correct">-</dd>
        </div>
        <div>
          <dt>時間切れ</dt>
          <dd id="stat-timeout">-</dd>
        </div>
        <div>
          <dt>平均解答時間</dt>
          <dd id="stat-avg">-</dd>
        </div>
      </dl>
    </article>
  </section>
`;

const introScreen = document.querySelector<HTMLElement>('#intro-screen');
const settingsScreen = document.querySelector<HTMLElement>('#settings-screen');
const quizScreen = document.querySelector<HTMLElement>('#quiz-screen');
const summaryScreen = document.querySelector<HTMLElement>('#summary-screen');

const introToSettingsBtn = document.querySelector<HTMLButtonElement>('#intro-to-settings');
const settingsBackBtn = document.querySelector<HTMLButtonElement>('#settings-back');
const summaryToSettingsBtn = document.querySelector<HTMLButtonElement>('#summary-to-settings');

const settingsForm = document.querySelector<HTMLFormElement>('#settings-form');
const countInput = document.querySelector<HTMLInputElement>('#count-input');
const limitInput = document.querySelector<HTMLInputElement>('#limit-input');
const wordCountInput = document.querySelector<HTMLInputElement>('#word-count-input');
const wordCountLabel = document.querySelector<HTMLOutputElement>('#word-count-label');
const hintToggle = document.querySelector<HTMLInputElement>('#hint-toggle');
const startBtn = document.querySelector<HTMLButtonElement>('#start-btn');
const resetBtn = document.querySelector<HTMLButtonElement>('#reset-btn');
const useDefaultBtn = document.querySelector<HTMLButtonElement>('#use-default');
const guessInput = document.querySelector<HTMLInputElement>('#guess-input');
const submitBtn = document.querySelector<HTMLButtonElement>('#submit-btn');
const revealBtn = document.querySelector<HTMLButtonElement>('#reveal-btn');
const nextBtn = document.querySelector<HTMLButtonElement>('#next-btn');
const timerFill = document.querySelector<HTMLDivElement>('#timer-fill');
const timerLabel = document.querySelector<HTMLSpanElement>('#timer-label');
const hintBanner = document.querySelector<HTMLDivElement>('#hint-banner');
const hintList = document.querySelector<HTMLUListElement>('#hint-list');
const answerTitleEl = document.querySelector<HTMLParagraphElement>('#answer-title');
const answerMetaEl = document.querySelector<HTMLParagraphElement>('#answer-meta');
const progressLabel = document.querySelector<HTMLDivElement>('#progress');
const statusPill = document.querySelector<HTMLDivElement>('#status-pill');
const wordBoard = document.querySelector<HTMLDivElement>('#word-board');
const answerPanel = document.querySelector<HTMLDivElement>('#answer-panel');
const feedbackEl = document.querySelector<HTMLParagraphElement>('#feedback');
const timeoutPop = document.querySelector<HTMLDivElement>('#timeout-pop');
const popRevealBtn = document.querySelector<HTMLButtonElement>('#pop-reveal');
const popNextBtn = document.querySelector<HTMLButtonElement>('#pop-next');
const summarySection = document.querySelector<HTMLElement>('#summary');
const statCorrect = document.querySelector<HTMLElement>('#stat-correct');
const statTimeout = document.querySelector<HTMLElement>('#stat-timeout');
const statAvg = document.querySelector<HTMLElement>('#stat-avg');
const playAgainBtn = document.querySelector<HTMLButtonElement>('#play-again');

if (
  !settingsForm ||
  !countInput ||
  !limitInput ||
  !wordCountInput ||
  !wordCountLabel ||
  !hintToggle ||
  !startBtn ||
  !resetBtn ||
  !useDefaultBtn ||
  !guessInput ||
  !submitBtn ||
  !revealBtn ||
  !nextBtn ||
  !timerFill ||
  !timerLabel ||
  !hintBanner ||
  !hintList ||
  !answerTitleEl ||
  !answerMetaEl ||
  !progressLabel ||
  !statusPill ||
  !wordBoard ||
  !answerPanel ||
  !feedbackEl ||
  !timeoutPop ||
  !popRevealBtn ||
  !popNextBtn ||
  !introScreen ||
  !settingsScreen ||
  !quizScreen ||
  !summaryScreen ||
  !introToSettingsBtn ||
  !settingsBackBtn ||
  !summaryToSettingsBtn ||
  !summarySection ||
  !statCorrect ||
  !statTimeout ||
  !statAvg ||
  !playAgainBtn
) {
  throw new Error('必要な要素の初期化に失敗しました');
}

const DEFAULT_SETTINGS: Settings = {
  questionCount: 3,
  timeLimitSec: 45,
  wordCount: 10,
  hintsEnabled: true,
};

let settings: Settings = { ...DEFAULT_SETTINGS };
const state: GameState = {
  currentIndex: 0,
  results: [],
  status: 'idle',
  startedAt: 0,
  countdownMs: 0,
  rafId: null,
  lastSpendMs: 0,
  hintFlags: { half: false, quarter: false, last: false },
  words: [],
  hints: [],
  revealCount: 1,
  renderedCount: 0,
  workQueue: [DEFAULT_WORK],
  currentWork: DEFAULT_WORK,
};

type Screen = 'intro' | 'settings' | 'quiz' | 'summary';

function switchScreen(next: Screen) {
  const screens: Record<Screen, HTMLElement> = {
    intro: introScreen,
    settings: settingsScreen,
    quiz: quizScreen,
    summary: summaryScreen,
  } as const;

  (Object.values(screens) as HTMLElement[]).forEach((el) => {
    el.classList.add('hidden');
    el.classList.remove('active');
  });

  const target = screens[next];
  target.classList.remove('hidden');
  target.classList.add('active');
  document.body.dataset.screen = next;
}

// 今後出題を切り替える際のヘルパー（現状は最初の作品固定）
function setWorkById(id: string) {
  const found = WORKS.find((w) => w.id === id);
  if (found) {
    WORK = found;
  }
}

function buildWorkQueue(count: number): WorkMeta[] {
  const shuffled = [...WORKS];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

function clampSettings(): Settings {
  const parsed: Settings = {
    questionCount: clamp(Number(countInput.value), 1, Math.min(10, WORKS.length)),
    timeLimitSec: clamp(Number(limitInput.value), 10, 120),
    wordCount: clamp(Number(wordCountInput.value), 5, 15),
    hintsEnabled: hintToggle.checked,
  };
  countInput.value = String(parsed.questionCount);
  limitInput.value = String(parsed.timeLimitSec);
  wordCountInput.value = String(parsed.wordCount);
  wordCountLabel.textContent = `${parsed.wordCount}語`;
  hintToggle.checked = parsed.hintsEnabled;
  return parsed;
}

function clamp(value: number, min: number, max: number) {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, Math.round(value)));
}

function resetSettings() {
  settings = { ...DEFAULT_SETTINGS };
  countInput.value = String(settings.questionCount);
  limitInput.value = String(settings.timeLimitSec);
  wordCountInput.value = String(settings.wordCount);
  wordCountLabel.textContent = `${settings.wordCount}語`;
  hintToggle.checked = settings.hintsEnabled;
}

function clearTimer() {
  if (state.rafId !== null) {
    cancelAnimationFrame(state.rafId);
    state.rafId = null;
  }
}

function startGame() {
  clearTimer();
  settings = clampSettings();
  state.currentIndex = 0;
  state.results = [];
  state.status = 'playing';
  state.workQueue = buildWorkQueue(settings.questionCount);
  summarySection.classList.add('hidden');
  startRound();
}

function startRound() {
  clearTimer();
  state.status = 'playing';
  state.startedAt = performance.now();
  state.countdownMs = settings.timeLimitSec * 1000;
  state.lastSpendMs = 0;
  state.hintFlags = { half: false, quarter: false, last: false };
  const work = state.workQueue[state.currentIndex] ?? DEFAULT_WORK;
  WORK = work;
  state.currentWork = work;
  state.words = selectWords(work.words, Math.max(settings.wordCount, 40));
  state.hints = [];
  state.revealCount = settings.wordCount;
  state.renderedCount = 0;
  answerPanel.classList.add('hidden');
  feedbackEl.textContent = '';
  renderHints();
  guessInput.value = '';
  timeoutPop.classList.add('hidden');
  updateProgress();
  wordBoard.innerHTML = '';
  renderWords(state.revealCount);
  updateAnswerPanel(work);
  updateStatus('解答中');
  updateTimer(settings.timeLimitSec * 1000);
  guessInput.focus();
  tick();
}

function tick() {
  if (state.status !== 'playing') return;
  const now = performance.now();
  const elapsed = now - state.startedAt;
  const remain = Math.max(0, settings.timeLimitSec * 1000 - elapsed);
  state.countdownMs = remain;
  updateTimer(remain);
  maybeShowHint(remain);
  maybeRevealWords(elapsed);
  if (remain <= 0) {
    handleTimeout();
    return;
  }
  state.rafId = requestAnimationFrame(tick);
}

function updateTimer(remainMs: number) {
  const ratio = Math.max(0, Math.min(1, remainMs / (settings.timeLimitSec * 1000)));
  timerFill.style.transform = `scaleX(${ratio})`;
  timerLabel.textContent = `${Math.ceil(remainMs / 1000)}秒`; // up-round to be generous
}

function maybeShowHint(remainMs: number) {
  if (!settings.hintsEnabled) return;
  const halfMs = settings.timeLimitSec * 1000 * 0.5;
  const quarterMs = settings.timeLimitSec * 1000 * 0.25;

  if (!state.hintFlags.half && remainMs <= halfMs) {
    pushHint(`① 年代ヒント: ${state.currentWork.year}年の小説です。`);
    state.hintFlags.half = true;
  }
  if (!state.hintFlags.quarter && remainMs <= quarterMs) {
    pushHint(`② 著者ヒント: ${state.currentWork.author}。`);
    state.hintFlags.quarter = true;
  }
  if (!state.hintFlags.last && remainMs <= 8000) {
    const head = state.currentWork.title.slice(0, 1);
    pushHint(`③ 頭文字ヒント: タイトルの頭文字は「${head}」。`);
    state.hintFlags.last = true;
  }
}

function pushHint(text: string) {
  state.hints.push(text);
  renderHints();
}

function renderHints() {
  hintBanner.classList.toggle('hidden', state.hints.length === 0);
  hintList.innerHTML = state.hints.map((h) => `<li>${h}</li>`).join('');
}

function updateAnswerPanel(work: WorkMeta) {
  if (answerTitleEl) {
    answerTitleEl.textContent = `答え：『${work.title}』`;
  }
  if (answerMetaEl) {
    answerMetaEl.textContent = `${work.author} / ${work.year}年`;
  }
}

function renderWords(count = state.revealCount) {
  const target = Math.min(count, state.words.length);
  for (let i = state.renderedCount; i < target; i += 1) {
    const word = state.words[i];
    const div = document.createElement('div');
    div.className = 'word-chip';
    div.style.animationDelay = `${i * 30}ms`;
    div.innerHTML = `
      <span>${word.surface}</span>
      <small>${word.count}回</small>
    `;
    wordBoard.appendChild(div);
  }
  state.renderedCount = target;
}

function selectWords(words: FrequentWord[], take: number) {
  const particleLike = new Set(['みたい', 'そう', 'さ', 'ほう', 'そして', 'しかし', 'だから', 'ので']);
  const filtered = words.filter((w) => {
    if ([...w.surface].length < 2) return false;
    if (particleLike.has(w.surface)) return false;
    return true;
  });
  return filtered.slice(0, take);
}

function maybeRevealWords(elapsedMs: number) {
  const desired = Math.min(state.words.length, settings.wordCount + Math.floor(elapsedMs / 2000));
  if (desired !== state.revealCount) {
    state.revealCount = desired;
    renderWords(desired);
  }
}
function updateProgress() {
  const displayIndex = state.currentIndex + 1;
  progressLabel.textContent = `第 ${displayIndex} / ${settings.questionCount} 問`;
}

function updateStatus(text: string, tone: 'neutral' | 'success' | 'warn' = 'neutral') {
  statusPill.textContent = text;
  statusPill.dataset.tone = tone;
}

function normalizeAnswer(value: string) {
  return value
    .trim()
    .replace(/[\s\u3000]/g, '')
    .replace(/[「」『』]/g, '')
    .toLowerCase();
}

function checkAnswer() {
  if (state.status !== 'playing') return;
  const guess = normalizeAnswer(guessInput.value);
  if (!guess) return;
  const target = normalizeAnswer(state.currentWork.title);
  const reading = state.currentWork.reading ? normalizeAnswer(state.currentWork.reading) : null;
  const isCorrect = guess === target || (reading ? guess === reading : false);
  state.lastSpendMs = settings.timeLimitSec * 1000 - state.countdownMs;
  if (isCorrect) {
    reveal({ correct: true, reason: 'お見事！ 正解です。' });
  } else {
    updateStatus('もう一声…', 'warn');
    feedbackEl.textContent = 'まだヒントだけで粘ってみましょう。';
  }
}

function reveal(opts: { correct: boolean; reason: string }) {
  if (state.status === 'finished') return;
  clearTimer();
  state.status = 'revealed';
  answerPanel.classList.remove('hidden');
  feedbackEl.textContent = opts.reason;
  const result: RoundResult = {
    status: opts.correct ? 'correct' : 'revealed',
    spentMs: state.lastSpendMs || settings.timeLimitSec * 1000 - state.countdownMs,
  };
  pushResult(result);
  updateStatus(opts.correct ? '正解' : '解答表示', opts.correct ? 'success' : 'neutral');
  timeoutPop.classList.add('hidden');
}

function pushResult(result: RoundResult) {
  if (state.results.length > state.currentIndex) {
    state.results[state.currentIndex] = result;
  } else {
    state.results.push(result);
  }
}

function handleTimeout() {
  clearTimer();
  state.status = 'revealed';
  timeoutPop.classList.remove('hidden');
  updateStatus('時間切れ', 'warn');
  pushResult({ status: 'timeout', spentMs: settings.timeLimitSec * 1000 });
}

function goNext() {
  if (state.status !== 'revealed') {
    reveal({ correct: false, reason: '次に進む前に答えを確認しましょう。' });
    return;
  }
  state.currentIndex += 1;
  if (state.currentIndex >= settings.questionCount) {
    finishGame();
  } else {
    startRound();
  }
}

function finishGame() {
  clearTimer();
  state.status = 'finished';
  renderSummary();
  summarySection.classList.remove('hidden');
  switchScreen('summary');
  updateStatus('完走', 'success');
}

function renderSummary() {
  const correct = state.results.filter((r) => r.status === 'correct').length;
  const timeouts = state.results.filter((r) => r.status === 'timeout').length;
  const avg = state.results.length
    ? Math.round(
        state.results.reduce((sum, r) => sum + Math.min(r.spentMs, settings.timeLimitSec * 1000), 0) /
          state.results.length /
          1000,
      )
    : 0;
  statCorrect.textContent = `${correct} / ${settings.questionCount}`;
  statTimeout.textContent = `${timeouts} 問`;
  statAvg.textContent = `${avg} 秒`;
}

settingsForm.addEventListener('submit', (event) => {
  event.preventDefault();
  startGame();
  switchScreen('quiz');
});

resetBtn.addEventListener('click', () => {
  resetSettings();
});

introToSettingsBtn.addEventListener('click', () => switchScreen('settings'));
settingsBackBtn.addEventListener('click', () => switchScreen('intro'));
summaryToSettingsBtn.addEventListener('click', () => switchScreen('settings'));

useDefaultBtn.addEventListener('click', () => {
  resetSettings();
});

wordCountInput.addEventListener('input', () => {
  const value = clamp(Number(wordCountInput.value), 5, 15);
  wordCountLabel.textContent = `${value}語`;
});

submitBtn.addEventListener('click', () => checkAnswer());

guessInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    checkAnswer();
  }
});

revealBtn.addEventListener('click', () => {
  if (state.status === 'finished') return;
  reveal({ correct: false, reason: '答えを先に確認しました。' });
});

nextBtn.addEventListener('click', () => {
  goNext();
});

popRevealBtn.addEventListener('click', () => {
  reveal({ correct: false, reason: '時間切れのため答えを表示しました。' });
});

popNextBtn.addEventListener('click', () => {
  goNext();
});

playAgainBtn.addEventListener('click', () => {
  state.currentIndex = 0;
  state.results = [];
  state.status = 'idle';
  startGame();
  switchScreen('quiz');
});

resetSettings();
updateProgress();
updateStatus('待機中');
renderWords();
switchScreen('intro');
