import './style.css';
import { FilesetResolver, ImageSegmenter, type ImageSegmenterResult } from '@mediapipe/tasks-vision';

type BackgroundMode = 'transparent' | 'solid';

interface GenerationConfig {
  silhouetteColor: string;
  backgroundMode: BackgroundMode;
  backgroundColor: string;
  text: string;
  fontSize: number;
  strokeWidth: number;
  outputWidth: number;
  outputHeight: number;
  textAnchorX: number;
  textAnchorY: number;
}

const appRoot = document.getElementById('app');

if (!appRoot) {
  throw new Error('#app が見つかりません');
}

appRoot.innerHTML = `
  <header>
    <h1>週刊誌のサムネイル生成</h1>
    <p>
      画像をアップロードし、MediaPipe Selfie Segmenter と Canvas 処理で人物を切り抜きシルエット化。縦書き文字を自由に配置して週刊誌風のサムネイルをブラウザだけで生成できます。
    </p>
  </header>
  <section class="controls">
    <fieldset>
      <legend>ベース画像</legend>
      <label>
        人物画像
        <input id="image-input" type="file" accept="image/png,image/jpeg,image/webp" />
      </label>
      <span id="image-status" class="status" data-state="pending">画像を選択してください。</span>
    </fieldset>
    <fieldset class="meta-grid">
      <label>
        シルエット色
        <input id="silhouette-color" type="color" value="#0E5AFF" />
      </label>
      <label>
        背景モード
        <select id="background-mode">
          <option value="transparent">透過</option>
          <option value="solid">単色</option>
        </select>
      </label>
      <label>
        背景色
        <input id="background-color" type="color" value="#FFFFFF" />
      </label>
      <label>
        出力幅(px)
        <input id="output-width" type="number" min="512" max="6000" step="10" value="2000" />
      </label>
      <label>
        出力高さ(px)
        <input id="output-height" type="number" min="512" max="6000" step="10" value="3000" />
      </label>
    </fieldset>
    <fieldset>
      <legend>縦書きテキスト</legend>
      <label>
        テキスト
        <textarea id="text-input" placeholder="大物俳優">大物俳優</textarea>
      </label>
      <div class="meta-grid">
        <label>
          フォントサイズ(px)
          <input id="font-size" type="number" min="60" max="600" step="10" value="280" />
        </label>
        <label>
          ストローク幅(px)
          <input id="stroke-width" type="number" min="0" max="40" step="1" value="8" />
        </label>
      </div>
    </fieldset>
    <div class="buttons">
      <button id="generate-button" disabled>生成する</button>
      <button id="download-button" disabled>PNGをダウンロード</button>
    </div>
    <span id="task-status" class="status" data-state="pending">MediaPipe の初期化を待っています…</span>
  </section>
  <section class="preview">
    <p class="preview-hint">プレビューをクリック / タップすると縦書き文字の位置を移動できます。</p>
    <canvas id="preview-canvas" width="2000" height="3000"></canvas>
  </section>
`;

const elements = {
  imageInput: document.getElementById('image-input') as HTMLInputElement,
  imageStatus: document.getElementById('image-status') as HTMLSpanElement,
  silhouetteColor: document.getElementById('silhouette-color') as HTMLInputElement,
  backgroundMode: document.getElementById('background-mode') as HTMLSelectElement,
  backgroundColor: document.getElementById('background-color') as HTMLInputElement,
  textInput: document.getElementById('text-input') as HTMLTextAreaElement,
  fontSize: document.getElementById('font-size') as HTMLInputElement,
  strokeWidth: document.getElementById('stroke-width') as HTMLInputElement,
  outputWidth: document.getElementById('output-width') as HTMLInputElement,
  outputHeight: document.getElementById('output-height') as HTMLInputElement,
  generateButton: document.getElementById('generate-button') as HTMLButtonElement,
  downloadButton: document.getElementById('download-button') as HTMLButtonElement,
  taskStatus: document.getElementById('task-status') as HTMLSpanElement,
  previewCanvas: document.getElementById('preview-canvas') as HTMLCanvasElement,
};

type SilhouetteData = {
  canvas: HTMLCanvasElement;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

const defaultConfig: GenerationConfig = {
  silhouetteColor: '#0E5AFF',
  backgroundMode: 'transparent',
  backgroundColor: '#FFFFFF',
  text: '大物俳優',
  fontSize: 280,
  strokeWidth: 8,
  outputWidth: 2000,
  outputHeight: 3000,
  textAnchorX: 0.5,
  textAnchorY: 0.5,
};

let currentConfig: GenerationConfig = { ...defaultConfig };
let loadedImage: HTMLImageElement | null = null;
let imageSegmenter: ImageSegmenter | null = null;
let lastBlobUrl: string | null = null;
let currentSilhouette: SilhouetteData | null = null;

const updateTaskStatus = (message: string, state: 'pending' | 'ready' | 'error' = 'pending') => {
  elements.taskStatus.textContent = message;
  elements.taskStatus.dataset.state = state;
};

const updateImageStatus = (message: string, state: 'pending' | 'ready' | 'error' = 'pending') => {
  elements.imageStatus.textContent = message;
  elements.imageStatus.dataset.state = state;
};

const parseConfig = (): GenerationConfig => {
  const backgroundMode = (elements.backgroundMode.value as BackgroundMode) ?? 'transparent';
  return {
    silhouetteColor: elements.silhouetteColor.value || defaultConfig.silhouetteColor,
    backgroundMode,
    backgroundColor: elements.backgroundColor.value || defaultConfig.backgroundColor,
    text: elements.textInput.value.trim() || defaultConfig.text,
    fontSize: clampNumber(Number(elements.fontSize.value), 40, 800, defaultConfig.fontSize),
    strokeWidth: clampNumber(Number(elements.strokeWidth.value), 0, 80, defaultConfig.strokeWidth),
    outputWidth: clampNumber(Number(elements.outputWidth.value), 512, 6000, defaultConfig.outputWidth),
    outputHeight: clampNumber(Number(elements.outputHeight.value), 512, 6000, defaultConfig.outputHeight),
    textAnchorX: clampNumber(currentConfig.textAnchorX ?? defaultConfig.textAnchorX, 0, 1, defaultConfig.textAnchorX),
    textAnchorY: clampNumber(currentConfig.textAnchorY ?? defaultConfig.textAnchorY, 0, 1, defaultConfig.textAnchorY),
  };
};

const clampNumber = (value: number, min: number, max: number, fallback: number) => {
  if (Number.isNaN(value)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, value));
};

const ensureSegmenter = async (): Promise<ImageSegmenter> => {
  if (imageSegmenter) {
    return imageSegmenter;
  }
  updateTaskStatus('MediaPipe を初期化しています…', 'pending');
  const baseUrl = `${import.meta.env.BASE_URL ?? '/'}mediapipe/`;
  const fileset = await FilesetResolver.forVisionTasks(`${baseUrl}wasm`);
  imageSegmenter = await ImageSegmenter.createFromModelPath(fileset, `${baseUrl}selfie_segmenter.tflite`);
  await imageSegmenter.setOptions({
    outputConfidenceMasks: true,
    outputCategoryMask: false,
  });
  updateTaskStatus('準備完了。画像を選択し「生成する」を押してください。', 'ready');
  elements.generateButton.disabled = !loadedImage;
  return imageSegmenter;
};

const loadImageFile = async (file: File): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('画像の読み込みに失敗しました'));
    reader.onload = () => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('画像の表示に失敗しました'));
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });

const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const normalized = hex.replace('#', '');
  const bigint = Number.parseInt(normalized.length === 3 ? normalized.repeat(2) : normalized, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
};

const SMOOTHING_RADIUS = 1;
const GAMMA = 0.75;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const smoothMask = (maskData: Float32Array, width: number, height: number): Float32Array => {
  const gammaCorrected = new Float32Array(maskData.length);
  for (let i = 0; i < maskData.length; i += 1) {
    gammaCorrected[i] = clamp01(maskData[i]) ** GAMMA;
  }

  if (SMOOTHING_RADIUS <= 0) {
    return gammaCorrected;
  }

  const smoothed = new Float32Array(maskData.length);
  const radius = SMOOTHING_RADIUS;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      let sum = 0;
      let count = 0;
      for (let offsetY = -radius; offsetY <= radius; offsetY += 1) {
        const ny = y + offsetY;
        if (ny < 0 || ny >= height) {
          continue;
        }
        const rowIndex = ny * width;
        for (let offsetX = -radius; offsetX <= radius; offsetX += 1) {
          const nx = x + offsetX;
          if (nx < 0 || nx >= width) {
            continue;
          }
          sum += gammaCorrected[rowIndex + nx];
          count += 1;
        }
      }
      smoothed[y * width + x] = count > 0 ? sum / count : gammaCorrected[y * width + x];
    }
  }
  return smoothed;
};

const computeMaskBounds = (maskData: Float32Array, width: number, height: number): SilhouetteData['bounds'] => {
  let minX = width;
  let maxX = -1;
  let minY = height;
  let maxY = -1;
  const threshold = 0.08;
  for (let y = 0; y < height; y += 1) {
    const rowIndex = y * width;
    for (let x = 0; x < width; x += 1) {
      const alpha = maskData[rowIndex + x];
      if (alpha > threshold) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX < minX || maxY < minY) {
    return { x: 0, y: 0, width: width || 1, height: height || 1 };
  }
  const pad = 6;
  const boundedMinX = Math.max(0, minX - pad);
  const boundedMinY = Math.max(0, minY - pad);
  const boundedMaxX = Math.min(width - 1, maxX + pad);
  const boundedMaxY = Math.min(height - 1, maxY + pad);
  return {
    x: boundedMinX,
    y: boundedMinY,
    width: Math.max(1, boundedMaxX - boundedMinX + 1),
    height: Math.max(1, boundedMaxY - boundedMinY + 1),
  };
};

const buildSilhouetteCanvas = (
  image: HTMLImageElement,
  maskResult: ImageSegmenterResult,
  config: GenerationConfig,
): SilhouetteData => {
  const mask = maskResult.confidenceMasks?.[0];
  if (!mask) {
    throw new Error('マスクを取得できませんでした');
  }

  const maskData = smoothMask(mask.getAsFloat32Array(), mask.width, mask.height);
  const { r, g, b } = hexToRgb(config.silhouetteColor);

  const maskCanvas = document.createElement('canvas');
  maskCanvas.width = mask.width;
  maskCanvas.height = mask.height;
  const maskCtx = maskCanvas.getContext('2d', { willReadFrequently: true });
  if (!maskCtx) {
    throw new Error('マスク描画用コンテキストの初期化に失敗しました');
  }
  const imageData = maskCtx.createImageData(mask.width, mask.height);
  const data = imageData.data;
  for (let i = 0; i < maskData.length; i += 1) {
    const alpha = Math.min(255, Math.max(0, Math.round(maskData[i] * 255)));
    const offset = i * 4;
    data[offset] = r;
    data[offset + 1] = g;
    data[offset + 2] = b;
    data[offset + 3] = alpha;
  }
  maskCtx.putImageData(imageData, 0, 0);
  const bounds = computeMaskBounds(maskData, mask.width, mask.height);
  return {
    canvas: maskCanvas,
    bounds,
  };
};

const drawVerticalText = (ctx: CanvasRenderingContext2D, config: GenerationConfig) => {
  const text = config.text.replace(/\r/g, '').trim();
  if (!text) {
    return;
  }

  const columns = text.split('\n').map((line) => [...line]);
  if (!columns.length) {
    return;
  }
  const letterSpacing = config.fontSize * 0.25;
  const columnSpacing = config.fontSize * 0.6;

  const columnHeights = columns.map((chars) => chars.length * config.fontSize + Math.max(0, chars.length - 1) * letterSpacing);
  const maxColumnHeight = Math.max(...columnHeights);
  const totalWidth = columns.length * config.fontSize + Math.max(0, columns.length - 1) * columnSpacing;
  const anchorX = config.outputWidth * clampNumber(config.textAnchorX, 0, 1, 0.5);
  const anchorY = config.outputHeight * clampNumber(config.textAnchorY, 0, 1, 0.5);
  const startX = anchorX + totalWidth / 2 - config.fontSize / 2;

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.font = `${config.fontSize}px 'Noto Serif JP', 'Noto Sans JP', sans-serif`;
  ctx.lineWidth = config.strokeWidth;
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.9)';
  ctx.fillStyle = '#f8fafc';

  columns.forEach((chars, columnIndex) => {
    const columnX = startX - columnIndex * (config.fontSize + columnSpacing);
    const columnHeight = columnHeights[columnIndex] ?? maxColumnHeight;
    const startY = anchorY - columnHeight / 2 + config.fontSize / 2;

    chars.forEach((char, charIndex) => {
      const y = startY + charIndex * (config.fontSize + letterSpacing);
      ctx.strokeText(char, columnX, y);
      ctx.fillText(char, columnX, y);
    });
  });

  ctx.restore();
};

const renderArtwork = async () => {
  if (!currentSilhouette) {
    return;
  }

  const outputCanvas = elements.previewCanvas;
  outputCanvas.width = currentConfig.outputWidth;
  outputCanvas.height = currentConfig.outputHeight;
  const ctx = outputCanvas.getContext('2d');
  if (!ctx) {
    throw new Error('出力用コンテキストの取得に失敗しました');
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  if (currentConfig.backgroundMode === 'transparent') {
    ctx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
  } else {
    ctx.fillStyle = currentConfig.backgroundColor;
    ctx.fillRect(0, 0, outputCanvas.width, outputCanvas.height);
  }

  const { canvas: silhouetteCanvas, bounds } = currentSilhouette;
  const sourceWidth = bounds.width;
  const sourceHeight = bounds.height;
  const baseScale = Math.min(currentConfig.outputWidth / sourceWidth, currentConfig.outputHeight / sourceHeight);
  const scale = baseScale * 0.92;
  const drawWidth = sourceWidth * scale;
  const drawHeight = sourceHeight * scale;
  const offsetX = (currentConfig.outputWidth - drawWidth) / 2;
  const offsetY = (currentConfig.outputHeight - drawHeight) / 2;

  ctx.save();
  ctx.filter = 'blur(1.4px)';
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(
    silhouetteCanvas,
    bounds.x,
    bounds.y,
    bounds.width,
    bounds.height,
    offsetX,
    offsetY,
    drawWidth,
    drawHeight,
  );
  ctx.restore();
  ctx.drawImage(
    silhouetteCanvas,
    bounds.x,
    bounds.y,
    bounds.width,
    bounds.height,
    offsetX,
    offsetY,
    drawWidth,
    drawHeight,
  );

  drawVerticalText(ctx, currentConfig);

  if (lastBlobUrl) {
    URL.revokeObjectURL(lastBlobUrl);
    lastBlobUrl = null;
  }
  elements.downloadButton.disabled = true;
  const blob = await new Promise<Blob | null>((resolve) => outputCanvas.toBlob(resolve, 'image/png'));
  if (blob) {
    lastBlobUrl = URL.createObjectURL(blob);
    elements.downloadButton.disabled = false;
  }
};

const generateArtwork = async () => {
  if (!loadedImage) {
    updateTaskStatus('画像を選択してください。', 'error');
    return;
  }

  currentConfig = parseConfig();
  elements.generateButton.disabled = true;
  updateTaskStatus('人物を解析中…', 'pending');

  try {
    const segmenter = await ensureSegmenter();
    const maskResult = segmenter.segment(loadedImage);
    currentSilhouette = buildSilhouetteCanvas(loadedImage, maskResult, currentConfig);
    await renderArtwork();
    updateTaskStatus('生成完了。必要に応じてダウンロードしてください。', 'ready');
  } catch (error) {
    console.error(error);
    updateTaskStatus('生成中にエラーが発生しました。コンソールを確認してください。', 'error');
  } finally {
    elements.generateButton.disabled = false;
  }
};

const downloadArtwork = () => {
  if (!lastBlobUrl) {
    return;
  }
  const anchor = document.createElement('a');
  anchor.href = lastBlobUrl;
  anchor.download = 'silhouette.png';
  anchor.click();
};

const handlePreviewPointer = (event: PointerEvent) => {
  if (!currentSilhouette) {
    return;
  }
  const rect = elements.previewCanvas.getBoundingClientRect();
  if (!rect.width || !rect.height) {
    return;
  }
  const normalizedX = clampNumber((event.clientX - rect.left) / rect.width, 0, 1, 0.5);
  const normalizedY = clampNumber((event.clientY - rect.top) / rect.height, 0, 1, 0.5);
  currentConfig = {
    ...currentConfig,
    textAnchorX: normalizedX,
    textAnchorY: normalizedY,
  };
  void renderArtwork().catch((error) => {
    console.error(error);
    updateTaskStatus('プレビューの更新に失敗しました。コンソールを確認してください。', 'error');
  });
};

const onModeChange = () => {
  const mode = elements.backgroundMode.value as BackgroundMode;
  if (mode === 'transparent') {
    elements.backgroundColor.disabled = true;
  } else {
    elements.backgroundColor.disabled = false;
  }
};

const onImageSelected = async () => {
  const file = elements.imageInput.files?.[0];
  if (!file) {
    elements.generateButton.disabled = true;
    loadedImage = null;
    updateImageStatus('画像を選択してください。', 'pending');
    return;
  }
  if (lastBlobUrl) {
    URL.revokeObjectURL(lastBlobUrl);
    lastBlobUrl = null;
  }
  currentSilhouette = null;
  elements.downloadButton.disabled = true;
  updateImageStatus('画像を読み込み中…', 'pending');
  try {
    loadedImage = await loadImageFile(file);
    elements.generateButton.disabled = !imageSegmenter;
    updateImageStatus(`${loadedImage.width}×${loadedImage.height} の画像を読み込みました。`, 'ready');
  } catch (error) {
    console.error(error);
    loadedImage = null;
    updateImageStatus('画像の読み込みに失敗しました。別のファイルをお試しください。', 'error');
    elements.generateButton.disabled = true;
  }
};

const registerEvents = () => {
  elements.imageInput.addEventListener('change', onImageSelected);
  elements.backgroundMode.addEventListener('change', () => {
    onModeChange();
    currentConfig = parseConfig();
    if (currentSilhouette) {
      void renderArtwork();
    }
  });
  [
    elements.silhouetteColor,
    elements.backgroundColor,
    elements.textInput,
    elements.fontSize,
    elements.strokeWidth,
    elements.outputWidth,
    elements.outputHeight,
  ].forEach((input) => {
    input.addEventListener('input', () => {
      currentConfig = parseConfig();
      if (currentSilhouette && input !== elements.silhouetteColor) {
        void renderArtwork();
      }
    });
  });
  elements.generateButton.addEventListener('click', () => {
    generateArtwork().catch((error) => {
      console.error(error);
      updateTaskStatus('生成中にエラーが発生しました。コンソールを確認してください。', 'error');
      elements.generateButton.disabled = false;
    });
  });
  elements.downloadButton.addEventListener('click', downloadArtwork);
  elements.previewCanvas.addEventListener('pointerdown', handlePreviewPointer);
};

registerEvents();
onModeChange();

// MediaPipe 初期化
void ensureSegmenter().catch((error) => {
  console.error(error);
  updateTaskStatus('MediaPipe の初期化に失敗しました。再読み込みしてください。', 'error');
});
