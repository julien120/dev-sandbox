import './style.css';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) throw new Error('#app not found');

app.innerHTML = `
  <div class="container">
    <div class="header">
      <h1>OCR Drop</h1>
      <div class="mode-switch" role="group" aria-label="認識モード切替">
        <button class="mode-btn" data-mode="horizontal" aria-pressed="true">横書き</button>
        <button class="mode-btn" data-mode="vertical" aria-pressed="false">縦書き</button>
        <button class="mode-btn" data-mode="mixed" aria-pressed="false">混在</button>
      </div>
      <button id="copyBtn">コピー</button>
    </div>
    <div class="dropzone" id="dropzone">
      <div>
        <p>画像をドラッグ＆ドロップ
          <br />またはクリックして選択</p>
        <small>ブラウザ内で Tesseract.js を読み込み実行します（初回は数秒かかります）。</small>
      </div>
      <input type="file" id="fileInput" accept="image/*" hidden />
    </div>
    <div class="status" id="status">準備完了</div>
    <textarea id="output" placeholder="ここにOCR結果が表示されます"></textarea>
  </div>
`;

const dropzone = document.querySelector<HTMLDivElement>('#dropzone');
const fileInput = document.querySelector<HTMLInputElement>('#fileInput');
const output = document.querySelector<HTMLTextAreaElement>('#output');
const statusEl = document.querySelector<HTMLDivElement>('#status');
const copyBtn = document.querySelector<HTMLButtonElement>('#copyBtn');
const modeButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('.mode-btn'));

if (!dropzone || !fileInput || !output || !statusEl || !copyBtn) {
  throw new Error('initial element missing');
}

let tesseractPromise: Promise<typeof import('tesseract.js')> | null = null;
type OcrMode = 'horizontal' | 'vertical' | 'mixed';
let currentMode: OcrMode = 'horizontal';

const setStatus = (msg: string) => {
  statusEl.textContent = msg;
};

const handleFiles = async (files: FileList | null) => {
  if (!files?.length) return;
  const file = files[0];
  const url = URL.createObjectURL(file);
  renderPreview(url);
  setStatus(`OCR 実行中...（${modeLabel(currentMode)}）`);
  try {
    const text = await runOcr(file, currentMode);
    output.value = text;
    setStatus(`抽出完了: 約${text.trim().length}文字（${modeLabel(currentMode)}）`);
  } catch (error) {
    console.error(error);
    setStatus('OCR に失敗しました');
  } finally {
    URL.revokeObjectURL(url);
  }
};

const modeLabel = (mode: OcrMode) =>
  mode === 'horizontal' ? '横書き' : mode === 'vertical' ? '縦書き' : '混在';

const runOcr = async (file: File, mode: OcrMode): Promise<string> => {
  if (mode === 'horizontal') {
    return recognizeWith(file, 'jpn', '6'); // single uniform block
  }
  if (mode === 'vertical') {
    return recognizeWith(file, 'jpn_vert', '5'); // single vertical block
  }
  // mixed: 縦横それぞれで認識し結合
  const [vert, hori] = await Promise.all([
    recognizeWith(file, 'jpn_vert', '5'),
    recognizeWith(file, 'jpn', '6'),
  ]);
  return `${vert}\n-----\n${hori}`;
};

const recognizeWith = async (file: File, lang: string, psm: string) => {
  const tesseract = await loadTesseract();
  const createWorker =
    (tesseract as { createWorker?: unknown }).createWorker ??
    (tesseract as { default?: { createWorker?: unknown } }).default?.createWorker;
  if (typeof createWorker !== 'function') {
    throw new Error('createWorker not found in tesseract module');
  }
  const worker = await createWorker(lang);
  if (typeof worker.setParameters === 'function') {
    await worker.setParameters({ tessedit_pageseg_mode: psm });
  }
  const { data } = await worker.recognize(file);
  await worker.terminate();
  return data.text;
};

const loadTesseract = () => {
  if (!tesseractPromise) {
    tesseractPromise = import('https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.esm.min.js');
  }
  return tesseractPromise;
};

const renderPreview = (url: string) => {
  let preview = dropzone.querySelector<HTMLImageElement>('img.preview');
  if (!preview) {
    preview = document.createElement('img');
    preview.className = 'preview';
    dropzone.innerHTML = '';
    dropzone.appendChild(preview);
  }
  preview.src = url;
};

dropzone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropzone.classList.add('dragover');
});

 dropzone.addEventListener('dragleave', () => {
  dropzone.classList.remove('dragover');
});

dropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropzone.classList.remove('dragover');
  handleFiles(e.dataTransfer?.files ?? null);
});

dropzone.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => handleFiles(fileInput.files));

modeButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const selected = btn.dataset.mode as OcrMode | undefined;
    if (!selected) return;
    currentMode = selected;
    modeButtons.forEach((b) => b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'));
    setStatus(`モードを ${modeLabel(selected)} に切替えました`);
  });
});

copyBtn.addEventListener('click', async () => {
  if (!output.value) return;
  try {
    await navigator.clipboard.writeText(output.value);
    setStatus('コピーしました');
  } catch {
    setStatus('コピーに失敗しました');
  }
});
