import './style.css';
import {
  FaceDetector,
  FaceLandmarker,
  FilesetResolver,
  type FaceDetectorResult,
  type FaceLandmarkerResult,
} from '@mediapipe/tasks-vision';

const dropzone = document.getElementById('dropzone') as HTMLLabelElement | null;
const fileInput = document.getElementById('file-input') as HTMLInputElement | null;
const statusEl = document.getElementById('status') as HTMLElement | null;
const detectButton = document.getElementById('detect-button') as HTMLButtonElement | null;
const downloadButton = document.getElementById('download-button') as HTMLButtonElement | null;
const previewCanvas = document.getElementById('preview-canvas') as HTMLCanvasElement | null;

if (!dropzone || !fileInput || !statusEl || !detectButton || !downloadButton || !previewCanvas) {
  throw new Error('初期化エラー: 必要なDOM要素が見つかりません');
}

const ctx = previewCanvas.getContext('2d', { willReadFrequently: true });
if (!ctx) {
  throw new Error('CanvasRenderingContext2D を取得できませんでした');
}

let loadedImage: HTMLImageElement | null = null;
let originalWidth = 0;
let originalHeight = 0;
let lastDetections: DOMRect[] = [];
let faceDetector: FaceDetector | null = null;
let faceLandmarker: FaceLandmarker | null = null;
let detectionBase: HTMLImageElement | HTMLCanvasElement | null = null;
let detectionBaseWidth = 0;
let detectionBaseHeight = 0;
let detectionBaseToOriginalX = 1;
let detectionBaseToOriginalY = 1;
let scaledCanvas: HTMLCanvasElement | null = null;
let downscaleCanvas: HTMLCanvasElement | null = null;
const detectionScales = [0.5, 0.75, 1, 1.5, 2];

const formatStatus = (message: string) => {
  statusEl.textContent = message;
};

const computeBoundingBoxes = (result: FaceDetectorResult, scale = 1): DOMRect[] => {
  if (!result.detections.length) {
    return [];
  }
  if (!detectionBaseWidth || !detectionBaseHeight) {
    return [];
  }
  const invScale = scale === 0 ? 1 : 1 / scale;
  return result.detections
    .map((detection) => detection.boundingBox ?? null)
    .filter((bbox): bbox is NonNullable<typeof bbox> => bbox !== null)
    .map((bbox) => {
      const baseWidth = bbox.width * invScale;
      const baseHeight = bbox.height * invScale;
      const paddingX = Math.max(0, baseWidth * 0.2);
      const paddingY = Math.max(0, baseHeight * 0.3);
      const baseX = Math.max(0, bbox.originX * invScale - paddingX);
      const baseY = Math.max(0, bbox.originY * invScale - paddingY);
      const clampedBaseWidth = Math.min(
        detectionBaseWidth - baseX,
        baseWidth + paddingX * 2,
      );
      const clampedBaseHeight = Math.min(
        detectionBaseHeight - baseY,
        baseHeight + paddingY * 2,
      );
      if (clampedBaseWidth <= 0 || clampedBaseHeight <= 0) {
        return null;
      }
      const x = Math.max(0, baseX * detectionBaseToOriginalX);
      const y = Math.max(0, baseY * detectionBaseToOriginalY);
      const width = Math.min(
        originalWidth - x,
        clampedBaseWidth * detectionBaseToOriginalX,
      );
      const height = Math.min(
        originalHeight - y,
        clampedBaseHeight * detectionBaseToOriginalY,
      );
      if (width <= 0 || height <= 0) {
        return null;
      }
      return new DOMRect(x, y, width, height);
    })
    .filter((rect): rect is DOMRect => rect !== null);
};

const getScaledSource = (scale: number): HTMLImageElement | HTMLCanvasElement | null => {
  if (!detectionBase || !detectionBaseWidth || !detectionBaseHeight) {
    return null;
  }
  if (scale === 1) {
    return detectionBase;
  }
  if (!scaledCanvas) {
    scaledCanvas = document.createElement('canvas');
  }
  const targetWidth = Math.max(1, Math.round(detectionBaseWidth * scale));
  const targetHeight = Math.max(1, Math.round(detectionBaseHeight * scale));
  scaledCanvas.width = targetWidth;
  scaledCanvas.height = targetHeight;
  const bufferCtx = scaledCanvas.getContext('2d');
  if (!bufferCtx) {
    return null;
  }
  bufferCtx.clearRect(0, 0, targetWidth, targetHeight);
  bufferCtx.drawImage(
    detectionBase,
    0,
    0,
    detectionBaseWidth,
    detectionBaseHeight,
    0,
    0,
    targetWidth,
    targetHeight,
  );
  return scaledCanvas;
};

const iou = (a: DOMRect, b: DOMRect) => {
  const x1 = Math.max(a.x, b.x);
  const y1 = Math.max(a.y, b.y);
  const x2 = Math.min(a.x + a.width, b.x + b.width);
  const y2 = Math.min(a.y + a.height, b.y + b.height);
  if (x2 <= x1 || y2 <= y1) {
    return 0;
  }
  const intersection = (x2 - x1) * (y2 - y1);
  const areaA = a.width * a.height;
  const areaB = b.width * b.height;
  const union = areaA + areaB - intersection;
  return union === 0 ? 0 : intersection / union;
};

const mergeDetections = (primary: DOMRect[], secondary: DOMRect[]) => {
  const merged = [...primary];
  secondary.forEach((candidate) => {
    const hasOverlap = merged.some((rect) => iou(rect, candidate) > 0.35);
    if (!hasOverlap) {
      merged.push(candidate);
    }
  });
  return merged;
};

const detectMultiScale = (detector: FaceDetector): DOMRect[] => {
  if (!detectionBase) {
    return [];
  }
  return detectionScales.reduce<DOMRect[]>((acc, scale) => {
    const source = getScaledSource(scale);
    if (!source) {
      return acc;
    }
    const result = detector.detect(source);
    const boxes = computeBoundingBoxes(result, scale);
    return mergeDetections(acc, boxes);
  }, []);
};

const computeBoundingBoxesFromLandmarks = (result: FaceLandmarkerResult): DOMRect[] => {
  if (!result.faceLandmarks.length) {
    return [];
  }
  return result.faceLandmarks.map((landmarks) => {
    let minX = Number.POSITIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;
    let maxX = Number.NEGATIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;
    landmarks.forEach((point) => {
      const x = point.x * originalWidth;
      const y = point.y * originalHeight;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    });
    const paddingX = Math.max(0, (maxX - minX) * 0.3);
    const paddingY = Math.max(0, (maxY - minY) * 0.4);
    const x = Math.max(0, minX - paddingX);
    const y = Math.max(0, minY - paddingY);
    const width = Math.min(originalWidth - x, maxX - minX + paddingX * 2);
    const height = Math.min(originalHeight - y, maxY - minY + paddingY * 2);
    return new DOMRect(x, y, width, height);
  });
};

const ensureFaceDetector = async (): Promise<FaceDetector> => {
  if (faceDetector) {
    return faceDetector;
  }
  const baseUrl = import.meta.env.BASE_URL ?? '/';
  const wasmBase = `${baseUrl}mediapipe/`;
  const fileset = await FilesetResolver.forVisionTasks(`${wasmBase}wasm`);
  faceDetector = await FaceDetector.createFromModelPath(
    fileset,
    `${wasmBase}face_detector_short_range.tflite`,
  );
  await faceDetector.setOptions({
    runningMode: 'IMAGE',
    minDetectionConfidence: 0.25,
    minSuppressionThreshold: 0.05,
  });
  return faceDetector;
};

const ensureFaceLandmarker = async (): Promise<FaceLandmarker> => {
  if (faceLandmarker) {
    return faceLandmarker;
  }
  const baseUrl = import.meta.env.BASE_URL ?? '/';
  const wasmBase = `${baseUrl}mediapipe/`;
  const fileset = await FilesetResolver.forVisionTasks(`${wasmBase}wasm`);
  faceLandmarker = await FaceLandmarker.createFromModelPath(
    fileset,
    `${wasmBase}face_landmarker.task`,
  );
  await faceLandmarker.setOptions({
    runningMode: 'IMAGE',
    numFaces: 12,
  });
  return faceLandmarker;
};

const resetCanvas = () => {
  ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
  lastDetections = [];
  downloadButton.disabled = true;
};

const loadImageToCanvas = async (file: File) => {
  resetCanvas();
  loadedImage = null;

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('画像の読み込みに失敗しました')); 
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });

  const image = new Image();
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error('画像の表示に失敗しました'));
    image.src = dataUrl;
  });

  originalWidth = image.naturalWidth;
  originalHeight = image.naturalHeight;
  loadedImage = image;
  detectionBase = null;
  detectionBaseWidth = 0;
  detectionBaseHeight = 0;
  detectionBaseToOriginalX = 1;
  detectionBaseToOriginalY = 1;

  const maxDimension = 1500;
  const longestSide = Math.max(originalWidth, originalHeight);
  if (longestSide > maxDimension) {
    if (!downscaleCanvas) {
      downscaleCanvas = document.createElement('canvas');
    }
    const scale = maxDimension / longestSide;
    const targetWidth = Math.max(1, Math.round(originalWidth * scale));
    const targetHeight = Math.max(1, Math.round(originalHeight * scale));
    downscaleCanvas.width = targetWidth;
    downscaleCanvas.height = targetHeight;
    const downscaleCtx = downscaleCanvas.getContext('2d', { willReadFrequently: true });
    if (!downscaleCtx) {
      throw new Error('ダウンサンプル用コンテキストを確保できませんでした');
    }
    downscaleCtx.clearRect(0, 0, targetWidth, targetHeight);
    downscaleCtx.drawImage(image, 0, 0, targetWidth, targetHeight);
    detectionBase = downscaleCanvas;
    detectionBaseWidth = targetWidth;
    detectionBaseHeight = targetHeight;
    detectionBaseToOriginalX = originalWidth / targetWidth;
    detectionBaseToOriginalY = originalHeight / targetHeight;
  } else {
    detectionBase = image;
    detectionBaseWidth = originalWidth;
    detectionBaseHeight = originalHeight;
    detectionBaseToOriginalX = 1;
    detectionBaseToOriginalY = 1;
  }

  previewCanvas.width = originalWidth;
  previewCanvas.height = originalHeight;

  ctx.drawImage(image, 0, 0, originalWidth, originalHeight);
  formatStatus(`画像を読み込みました（${originalWidth}×${originalHeight}）。「顔をぼかす」を押してください。`);
  detectButton.disabled = false;
};

const handleFile = async (file: File | null) => {
  if (!file) {
    formatStatus('有効なファイルが選択されていません。');
    return;
  }
  if (!file.type.startsWith('image/')) {
    formatStatus('画像ファイルを選択してください。');
    return;
  }
  detectButton.disabled = true;
  downloadButton.disabled = true;
  formatStatus('画像を読み込んでいます...');
  try {
    await loadImageToCanvas(file);
  } catch (error) {
    console.error(error);
    formatStatus(error instanceof Error ? error.message : '画像の読み込みに失敗しました。');
  }
};

dropzone.addEventListener('dragover', (event) => {
  event.preventDefault();
  dropzone.classList.add('dragging');
});

dropzone.addEventListener('dragleave', () => {
  dropzone.classList.remove('dragging');
});

dropzone.addEventListener('drop', (event) => {
  event.preventDefault();
  dropzone.classList.remove('dragging');
  const file = event.dataTransfer?.files?.[0];
  void handleFile(file ?? null);
});

fileInput.addEventListener('change', () => {
  const file = fileInput.files?.[0] ?? null;
  void handleFile(file);
});

const applyBlurToDetections = () => {
  if (!loadedImage) {
    return;
  }
  ctx.drawImage(loadedImage, 0, 0, originalWidth, originalHeight);
  lastDetections.forEach((rect) => {
    const centerX = rect.x + rect.width / 2;
    const centerY = rect.y + rect.height / 2;
    const radius = Math.max(rect.width, rect.height) * 0.7;

    const sourceCanvas = document.createElement('canvas');
    sourceCanvas.width = originalWidth;
    sourceCanvas.height = originalHeight;
    const sourceCtx = sourceCanvas.getContext('2d');
    if (!sourceCtx) {
      return;
    }
    sourceCtx.drawImage(loadedImage, 0, 0, originalWidth, originalHeight);
    sourceCtx.globalCompositeOperation = 'destination-in';
    sourceCtx.beginPath();
    sourceCtx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    sourceCtx.fill();

    ctx.save();
    ctx.filter = 'blur(42px)';
    ctx.drawImage(sourceCanvas, 0, 0);
    ctx.restore();
  });
};

const detectFaces = async () => {
  if (!loadedImage) {
    formatStatus('先に画像を選択してください。');
    return;
  }

  formatStatus('顔を検出しています...');
  detectButton.disabled = true;
  downloadButton.disabled = true;

  try {
    const detector = await ensureFaceDetector();
    const detectorBoxes = detectMultiScale(detector);

    let mergedBoxes = detectorBoxes;
    if (mergedBoxes.length < 1) {
      const landmarker = await ensureFaceLandmarker();
      const landmarkResult = landmarker.detect(loadedImage);
      const landmarkBoxes = computeBoundingBoxesFromLandmarks(landmarkResult);
      mergedBoxes = mergeDetections(detectorBoxes, landmarkBoxes);
    } else if (mergedBoxes.length < 3) {
      // 少数検出時はLandmarkerで補完して見落としを減らす
      const landmarker = await ensureFaceLandmarker();
      const landmarkResult = landmarker.detect(loadedImage);
      const landmarkBoxes = computeBoundingBoxesFromLandmarks(landmarkResult);
      mergedBoxes = mergeDetections(detectorBoxes, landmarkBoxes);
    }

    lastDetections = mergedBoxes;
    if (!lastDetections.length) {
      applyBlurToDetections();
      formatStatus('顔は見つかりませんでした。');
      detectButton.disabled = false;
      return;
    }

    applyBlurToDetections();
    formatStatus(`${lastDetections.length} 件の顔をぼかしました。`);
    downloadButton.disabled = false;
  } catch (error) {
    console.error(error);
    formatStatus('顔の検出中にエラーが発生しました。最新の Chrome / Edge でお試しください。');
  } finally {
    detectButton.disabled = false;
  }
};

detectButton.addEventListener('click', () => {
  void detectFaces();
});

downloadButton.addEventListener('click', async () => {
  if (downloadButton.disabled) {
    return;
  }
  const blob = await new Promise<Blob | null>((resolve) => previewCanvas.toBlob(resolve, 'image/png'));
  if (!blob) {
    formatStatus('画像を生成できませんでした。');
    return;
  }
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'blurred-photo.png';
  link.click();
  URL.revokeObjectURL(url);
});

formatStatus('写真を選択してください。');
