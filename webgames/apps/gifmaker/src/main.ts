import './style.css';
import { GIFEncoder } from './gifEncoder';

const MAX_SIZE_BYTES = 10 * 1024 * 1024;

type Controls = {
  width: HTMLInputElement;
  fps: HTMLInputElement;
  quality: HTMLInputElement;
  download: HTMLAnchorElement;
  convert: HTMLButtonElement;
  status: HTMLElement;
  video: HTMLVideoElement;
  canvas: HTMLCanvasElement;
};

type ConversionOptions = {
  width: number;
  fps: number;
  quality: number;
};

const controls: Controls = {
  width: document.getElementById('width-range') as HTMLInputElement,
  fps: document.getElementById('fps-range') as HTMLInputElement,
  quality: document.getElementById('quality-range') as HTMLInputElement,
  download: document.getElementById('download-link') as HTMLAnchorElement,
  convert: document.getElementById('convert-button') as HTMLButtonElement,
  status: document.getElementById('status') as HTMLElement,
  video: document.getElementById('preview-video') as HTMLVideoElement,
  canvas: document.getElementById('working-canvas') as HTMLCanvasElement,
};

const widthValue = document.getElementById('width-value') as HTMLElement;
const fpsValue = document.getElementById('fps-value') as HTMLElement;
const qualityValue = document.getElementById('quality-value') as HTMLElement;

const dropzone = document.getElementById('dropzone') as HTMLDivElement;
const fileInput = document.getElementById('file-input') as HTMLInputElement;

let currentFile: File | null = null;
let objectUrl: string | null = null;

const updateRangeLabels = (): void => {
  widthValue.textContent = `${controls.width.value}px`;
  fpsValue.textContent = `${controls.fps.value}fps`;
  qualityValue.textContent = `${controls.quality.value}/8`;
};

updateRangeLabels();

const setStatus = (text: string, isError = false): void => {
  controls.status.textContent = text;
  controls.status.dataset.state = isError ? 'error' : 'normal';
};

const resetPreview = (): void => {
  controls.video.removeAttribute('src');
  controls.video.load();
  controls.convert.disabled = true;
  controls.download.setAttribute('aria-disabled', 'true');
  controls.download.removeAttribute('href');
  setStatus('動画ファイルを読み込んでください。');
};

const handleFile = (file: File): void => {
  if (!file.type.startsWith('video/')) {
    setStatus('対応していないファイル形式です。動画ファイルを選択してください。', true);
    return;
  }
  currentFile = file;
  if (objectUrl) {
    URL.revokeObjectURL(objectUrl);
    objectUrl = null;
  }
  objectUrl = URL.createObjectURL(file);
  controls.video.src = objectUrl;
  controls.video.onloadedmetadata = () => {
    controls.video.currentTime = 0;
    controls.convert.disabled = false;
    const maxWidth = Math.min(960, Math.round(controls.video.videoWidth));
    controls.width.max = String(Math.max(160, maxWidth));
    controls.width.value = String(Math.min(maxWidth, Number(controls.width.value)));
    widthValue.textContent = `${controls.width.value}px`;
    setStatus('動画が読み込まれました。設定を調整して「GIF を作成」を押してください。');
  };
  controls.video.onerror = () => {
    setStatus('動画の読み込みに失敗しました。', true);
    resetPreview();
  };
};

const extractFileFromDataTransfer = (dt: DataTransfer | null): File | null => {
  if (!dt) {
    return null;
  }

  if (dt.files && dt.files.length > 0) {
    return dt.files[0] ?? null;
  }

  if (dt.items) {
    for (const item of Array.from(dt.items)) {
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (file) {
          return file;
        }
      }
    }
  }

  return null;
};

const handleDrop = (event: DragEvent): void => {
  event.preventDefault();
  dropzone.classList.remove('drag-over');
  const file = extractFileFromDataTransfer(event.dataTransfer ?? null);
  if (file) {
    handleFile(file);
  } else {
    setStatus('ファイルをドロップしてください。フォルダは利用できません。', true);
  }
};

const once = <T extends keyof HTMLVideoElementEventMap>(
  target: HTMLVideoElement,
  type: T,
): Promise<HTMLVideoElementEventMap[T]> => {
  return new Promise((resolve) => {
    const handler = (event: Event) => {
      target.removeEventListener(type, handler);
      resolve(event as HTMLVideoElementEventMap[T]);
    };
    target.addEventListener(type, handler, { once: true });
  });
};

const ensureVideoReady = async (video: HTMLVideoElement): Promise<void> => {
  if (video.readyState < HTMLMediaElement.HAVE_METADATA) {
    await once(video, 'loadedmetadata');
  }

  if (video.videoWidth === 0 || video.videoHeight === 0) {
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }

  if (video.videoWidth === 0 || video.videoHeight === 0) {
    throw new Error('動画のメタデータを取得できませんでした。別のファイルでお試しください。');
  }

  if (!Number.isFinite(video.duration) || video.duration <= 0) {
    throw new Error('動画の長さが不正です。');
  }
};

const generateGif = async (video: HTMLVideoElement, options: ConversionOptions, signal: AbortSignal): Promise<Blob> => {
  await ensureVideoReady(video);

  const targetWidth = Math.max(1, Math.round(options.width));
  const aspect = video.videoHeight / video.videoWidth;
  const targetHeight = Math.max(1, Math.round(targetWidth * aspect));
  controls.canvas.width = targetWidth;
  controls.canvas.height = targetHeight;
  const ctx = controls.canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas が利用できません。');
  }

  const encoder = new GIFEncoder(targetWidth, targetHeight);
  encoder.setRepeat(0);
  encoder.setDelay(Math.round(1000 / Math.max(1, options.fps)));
  encoder.setQuality(options.quality);
  encoder.start();

  const duration = video.duration;
  const sanitizedFps = Math.max(1, options.fps);
  const totalFrames = Math.max(1, Math.floor(duration * sanitizedFps));
  const displayDelay = Math.round(1000 / sanitizedFps);
  encoder.setDelay(displayDelay);

  let processedFrames = 0;
  for (let frame = 0; frame < totalFrames; frame += 1) {
    if (signal.aborted) {
      throw new Error('処理が中断されました。');
    }
    const currentTime = Math.min(duration, frame / sanitizedFps);
    await seekVideo(video, currentTime);
    ctx.drawImage(video, 0, 0, targetWidth, targetHeight);
    encoder.addFrame(ctx);
    setStatus(`フレームを処理中... (${frame + 1}/${totalFrames})`);
    await waitNextFrame();
    processedFrames += 1;
  }

  if (processedFrames === 0) {
    throw new Error('GIF に変換できるフレームが生成されませんでした。');
  }

  encoder.finish();
  const binary = encoder.stream().getData();
  const copied = new Uint8Array(binary.length);
  copied.set(binary);
  return new Blob([copied.buffer], { type: 'image/gif' });
};

const seekVideo = async (video: HTMLVideoElement, time: number): Promise<void> => {
  video.currentTime = time;
  await once(video, 'seeked').catch(() => {
    throw new Error('動画のシークに失敗しました。');
  });
};

const waitNextFrame = (): Promise<void> => {
  return new Promise((resolve) => {
    requestAnimationFrame(() => resolve());
  });
};

const autoEncodeWithLimit = async (
  video: HTMLVideoElement,
  options: ConversionOptions,
  signal: AbortSignal,
): Promise<{ blob: Blob; width: number; fps: number; iterations: number }> => {
  let width = options.width;
  let fps = options.fps;
  let iterations = 0;
  let lastBlob: Blob | null = null;
  while (width >= 160 && fps >= 5) {
    iterations += 1;
    setStatus(`変換中... (試行 ${iterations})`);
    const blob = await generateGif(video, { ...options, width, fps }, signal);
    if (blob.size <= MAX_SIZE_BYTES) {
      return { blob, width, fps, iterations };
    }
    lastBlob = blob;
    if (width > 320) {
      width = Math.floor(width * 0.85);
      continue;
    }
    fps = Math.max(5, fps - 2);
  }
  if (lastBlob) {
    return { blob: lastBlob, width, fps, iterations };
  }
  throw new Error('出力サイズを 10MB 以下に抑えられませんでした。設定を見直してください。');
};

let abortController: AbortController | null = null;

controls.convert.addEventListener('click', async () => {
  if (!currentFile || !objectUrl) {
    return;
  }
  if (abortController) {
    abortController.abort();
  }
  abortController = new AbortController();
  controls.convert.disabled = true;
  controls.download.setAttribute('aria-disabled', 'true');
  controls.download.removeAttribute('href');
  setStatus('変換を開始しました...');

  try {
    controls.video.pause();
    controls.video.currentTime = 0;
    const options: ConversionOptions = {
      width: Number.parseInt(controls.width.value, 10),
      fps: Number.parseInt(controls.fps.value, 10),
      quality: Number.parseInt(controls.quality.value, 10),
    };
    const result = await autoEncodeWithLimit(controls.video, options, abortController.signal);
    const url = URL.createObjectURL(result.blob);
    controls.download.href = url;
    controls.download.download = `${currentFile.name.replace(/\.[^.]+$/, '') || 'output'}.gif`;
    controls.download.setAttribute('aria-disabled', 'false');
    setStatus(
      result.blob.size <= MAX_SIZE_BYTES
        ? `変換が完了しました！ (${formatBytes(result.blob.size)})`
        : `変換は完了しましたが 10MB を超えています (${formatBytes(result.blob.size)})。解像度やフレームレートを下げて再試行してください。`,
      result.blob.size > MAX_SIZE_BYTES,
    );
  } catch (error) {
    console.error(error);
    setStatus(error instanceof Error ? error.message : '変換中にエラーが発生しました。', true);
  } finally {
    controls.convert.disabled = false;
    abortController = null;
  }
});

fileInput.addEventListener('change', (event) => {
  const target = event.target as HTMLInputElement;
  if (target.files?.length) {
    handleFile(target.files[0]);
  }
});

dropzone.addEventListener('dragover', (event) => {
  event.preventDefault();
  dropzone.classList.add('drag-over');
});

dropzone.addEventListener('dragleave', () => {
  dropzone.classList.remove('drag-over');
});

dropzone.addEventListener('drop', handleDrop);

controls.width.addEventListener('input', updateRangeLabels);
controls.fps.addEventListener('input', updateRangeLabels);
controls.quality.addEventListener('input', updateRangeLabels);

controls.download.addEventListener('click', () => {
  if (controls.download.getAttribute('aria-disabled') === 'true') {
      return;
  }
  setStatus('GIF をダウンロードしています...');
});

const formatBytes = (bytes: number): string => {
  if (bytes < 1024) {
    return `${bytes}B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)}KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
};

resetPreview();
