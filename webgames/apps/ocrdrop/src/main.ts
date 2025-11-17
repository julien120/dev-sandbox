import './style.css';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) throw new Error('#app not found');

app.innerHTML = `
  <div class="container">
    <div class="header">
      <h1>OCR Drop</h1>
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

if (!dropzone || !fileInput || !output || !statusEl || !copyBtn) {
  throw new Error('initial element missing');
}

let tesseractPromise: Promise<typeof import('tesseract.js')> | null = null;

const setStatus = (msg: string) => {
  statusEl.textContent = msg;
};

const handleFiles = async (files: FileList | null) => {
  if (!files?.length) return;
  const file = files[0];
  const url = URL.createObjectURL(file);
  renderPreview(url);
  setStatus('OCR 実行中...');
  try {
    const { createWorker } = await loadTesseract();
    const worker = await createWorker('jpn', 1, { logger: () => {} });
    const { data } = await worker.recognize(file);
    await worker.terminate();
    output.value = data.text;
    setStatus(`抽出完了: 約${data.text.trim().length}文字`);
  } catch (error) {
    console.error(error);
    setStatus('OCR に失敗しました');
  } finally {
    URL.revokeObjectURL(url);
  }
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

copyBtn.addEventListener('click', async () => {
  if (!output.value) return;
  try {
    await navigator.clipboard.writeText(output.value);
    setStatus('コピーしました');
  } catch {
    setStatus('コピーに失敗しました');
  }
});
