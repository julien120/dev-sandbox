import { FFmpeg } from '@ffmpeg/ffmpeg';
import './style.css';

const MAX_SIZE_BYTES = 10 * 1024 * 1024;
const MAX_FFMPEG_LOGS = 500;
const CORE_ASSET_BASE_PATH = `${import.meta.env.BASE_URL}ffmpeg/`;
const CORE_JS_URL = `${CORE_ASSET_BASE_PATH}ffmpeg-core.js`;
const CORE_WASM_URL = `${CORE_ASSET_BASE_PATH}ffmpeg-core.wasm`;
const CORE_WORKER_URL = `${CORE_ASSET_BASE_PATH}ffmpeg-core.worker.js`;

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

let ffmpegInstance: FFmpeg | null = null;
let ffmpegLoadingPromise: Promise<void> | null = null;
type FFmpegProgressEvent = {
  progress: number;
  time: number;
};
type FFmpegLogEvent = {
  type: string;
  message: string;
};

type FFmpegExecError = Error & {
  ffmpegLabel?: string;
  ffmpegArgs?: string[];
};

const ffmpegLogs: FFmpegLogEvent[] = [];
const pushFfmpegLog = (entry: FFmpegLogEvent): void => {
  ffmpegLogs.push({ type: entry.type, message: String(entry.message ?? '') });
  if (ffmpegLogs.length > MAX_FFMPEG_LOGS) {
    ffmpegLogs.splice(0, ffmpegLogs.length - MAX_FFMPEG_LOGS);
  }
};

const deriveFriendlyLogMessage = (logs: FFmpegLogEvent[]): string | null => {
  for (let index = logs.length - 1; index >= 0; index -= 1) {
    const entry = logs[index];
    if (entry.type !== 'stderr') {
      continue;
    }
    const content = entry.message?.trim();
    if (!content) {
      continue;
    }
    const normalized = content.toLowerCase();
    if (normalized.includes('error while opening input')) {
      return '動画の読み込みに失敗しました。対応していないコーデックまたはファイル破損の可能性があります。';
    }
    if (normalized.includes('no such filter')) {
      return '必要なフィルタが利用できません。ブラウザを更新するかアプリを再読み込みして再試行してください。';
    }
    if (normalized.includes('cannot find a matching stream')) {
      return '映像トラックが見つかりませんでした。別の動画ファイルでお試しください。';
    }
    if (normalized.includes('invalid argument')) {
      return 'FFmpeg のフィルタ指定に無効な値が含まれています。設定値を変更して再試行してください。';
    }
    if (normalized.includes("option 'diffusion' not found")) {
      return '使用中の FFmpeg では指定したディザ設定が利用できません。再変換を実行しました。';
    }
    if (normalized.includes('decoding for stream')) {
      return '動画のデコードに失敗しました。形式を変換してから再度お試しください。';
    }
    return `詳細: ${content}`;
  }
  return null;
};

let progressTickerId: number | null = null;
let progressDots = 0;

const startProgressTicker = (): void => {
  if (progressTickerId !== null) {
    return;
  }
  progressDots = 0;
  progressTickerId = window.setInterval(() => {
    progressDots = (progressDots + 1) % 4;
    const suffix = '.'.repeat(progressDots).padEnd(3, ' ');
    setStatus(`FFmpeg 変換中${suffix}`);
  }, 400);
};

const stopProgressTicker = (): void => {
  if (progressTickerId !== null) {
    window.clearInterval(progressTickerId);
    progressTickerId = null;
  }
};

const handleFFmpegProgress = ({ progress }: FFmpegProgressEvent): void => {
  const ratio = Number.isFinite(progress) ? progress : 0;
  stopProgressTicker();
  setStatus(`FFmpeg 変換中 ${(ratio * 100).toFixed(1)}%`);
};

const handleFFmpegLog = (event: FFmpegLogEvent): void => {
  pushFfmpegLog(event);
};

const resetFFmpeg = (): void => {
  if (!ffmpegInstance) {
    return;
  }
  try {
    ffmpegInstance.off('progress', handleFFmpegProgress);
    ffmpegInstance.off('log', handleFFmpegLog);
    ffmpegInstance.terminate();
  } catch (error) {
    console.warn('FFmpeg terminate error:', error);
  } finally {
    ffmpegInstance = null;
  }
};

const loadFFmpeg = async (): Promise<void> => {
  if (ffmpegInstance) {
    return;
  }
  if (ffmpegLoadingPromise) {
    await ffmpegLoadingPromise;
    return;
  }

  ffmpegLoadingPromise = (async () => {
    setStatus('FFmpeg モジュールを読み込んでいます...');
    const instance = new FFmpeg();
    instance.on('progress', handleFFmpegProgress);
    instance.on('log', handleFFmpegLog);
    (instance as unknown as { setLogger?: (callback: (payload: FFmpegLogEvent) => void) => void }).setLogger?.(
      ({ type, message }: FFmpegLogEvent) => {
        pushFfmpegLog({ type, message });
      },
    );
    console.info('[gifmaker] loading ffmpeg', {
      coreURL: CORE_JS_URL,
      wasmURL: CORE_WASM_URL,
    });
    const loadConfig: Parameters<FFmpeg['load']>[0] = {
      coreURL: CORE_JS_URL,
      wasmURL: CORE_WASM_URL,
    };
    loadConfig.workerURL = CORE_WORKER_URL;
    await instance.load(loadConfig);
    console.info('[gifmaker] ffmpeg loaded');
    ffmpegInstance = instance;
  })();

  try {
    await ffmpegLoadingPromise;
  } catch (error) {
    resetFFmpeg();
    throw error;
  } finally {
    ffmpegLoadingPromise = null;
  }
};

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

const toUint8Array = async (input: File | string | ArrayBuffer | ArrayBufferView): Promise<Uint8Array> => {
  if (input instanceof Uint8Array) {
    return input;
  }
  if (typeof input === 'string') {
    return new TextEncoder().encode(input);
  }
  if (input instanceof Blob) {
    const buffer = await input.arrayBuffer();
    return new Uint8Array(buffer);
  }
  if (input instanceof ArrayBuffer) {
    return new Uint8Array(input);
  }
  if (ArrayBuffer.isView(input)) {
    return new Uint8Array(input.buffer.slice(input.byteOffset, input.byteOffset + input.byteLength));
  }
  throw new Error('入力データを Uint8Array に変換できませんでした。');
};

const resetPreview = (): void => {
  controls.video.removeAttribute('src');
  controls.video.load();
  controls.convert.disabled = true;
  controls.download.setAttribute('aria-disabled', 'true');
  controls.download.removeAttribute('href');
  setStatus('動画ファイルを読み込んでください。');
};

const validateVideoFile = (file: File): boolean => {
  if (file.size > MAX_SIZE_BYTES) {
    const maxSizeMb = (MAX_SIZE_BYTES / (1024 * 1024)).toFixed(0);
    setStatus(`ファイルサイズが大きすぎます。${maxSizeMb}MB 以下の動画を選択してください。`, true);
    return false;
  }
  if (!file.type.startsWith('video/')) {
    setStatus('対応していないファイル形式です。動画ファイルを選択してください。', true);
    return false;
  }
  return true;
};

const handleFile = (file: File): void => {
  if (!validateVideoFile(file)) {
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


const createFilterPipeline = (fps: number, width: number, quality: number): string => {
  const ditherModes = [
    'none',
    'floyd_steinberg',
    'sierra2',
    'sierra2_4a',
    'bayer:bayer_scale=5',
    'bayer:bayer_scale=4',
    'bayer:bayer_scale=3',
    'bayer:bayer_scale=2',
  ];
  const idx = Math.min(ditherModes.length - 1, Math.max(0, Math.round(quality) - 1));
  const dither = ditherModes[idx];

  return [
    `scale=${width}:-1:flags=lanczos`,
    `fps=${fps}`,
    'format=rgba',
    'split[s0][s1]',
    '[s0]palettegen=stats_mode=full:reserve_transparent=0[p]',
    `[s1][p]paletteuse=new=1:dither=${dither}`,
  ].join(',');
};

const generateGif = async (file: File, options: ConversionOptions, signal: AbortSignal): Promise<Blob> => {
  await loadFFmpeg();
  const ffmpeg = ffmpegInstance;
  if (!ffmpeg) {
    throw new Error('FFmpeg の初期化に失敗しました。');
  }

  const minWidth = 160;
  const rawWidth = Math.max(minWidth, Math.round(options.width));
  const sanitizedWidth = rawWidth % 2 === 0 ? rawWidth : rawWidth + 1;
  const sanitizedFps = Math.max(1, Math.round(options.fps));
  const sanitizedQuality = Math.max(1, Math.round(options.quality));
  const inputName = `input-${Date.now()}.mp4`;
  const outputName = `output-${Date.now()}.gif`;

  let aborted = false;
  const abortHandler = (): void => {
    aborted = true;
    resetFFmpeg();
  };

  signal.addEventListener('abort', abortHandler, { once: true });

  try {
    startProgressTicker();
    setStatus('FFmpeg 変換中   ');
    ffmpegLogs.length = 0;
    const source = await toUint8Array(file);
    console.info('[gifmaker] writeFile', { inputName, byteLength: source.byteLength });
    await ffmpeg.writeFile(inputName, source);

    const runFfmpeg = async (label: string, args: string[]): Promise<void> => {
      console.log('[gifmaker] exec', { label, args });
      const logStart = ffmpegLogs.length;
      const exitCode = await ffmpeg.exec(args);
      if (exitCode !== 0) {
        const recentLogs = ffmpegLogs.slice(logStart);
        console.warn(`[gifmaker] ${label} logs`, recentLogs.length, recentLogs);
        const error: FFmpegExecError = new Error(`FFmpeg の実行に失敗しました (コード: ${exitCode})。`);
        error.ffmpegLabel = label;
        error.ffmpegArgs = args;
        throw error;
      }
    };

    const filter = createFilterPipeline(sanitizedFps, sanitizedWidth, sanitizedQuality);
    console.info('[gifmaker] filter', filter);
    const simpleFilter = `scale=${sanitizedWidth}:-1:flags=lanczos,fps=${sanitizedFps}`;
    const timestamp = Date.now();
    const probeOutputName = `probe-${timestamp}.gif`;
    const intermediateName = `tmp-${timestamp}.mp4`;

    const paletteArgs = ['-i', inputName, '-vf', filter, '-loop', '0', outputName];
    const simpleArgs = ['-i', inputName, '-vf', simpleFilter, '-loop', '0', outputName];
    const probeArgs = ['-i', inputName, '-t', '2', '-vf', simpleFilter, '-loop', '0', probeOutputName];
    const transcodeArgs = [
      '-i', inputName,
      '-vf', `${simpleFilter},format=yuv420p`,
      '-an',
      '-c:v', 'mpeg4',
      intermediateName,
    ];
    const paletteFromIntermediateArgs = ['-i', intermediateName, '-vf', filter, '-loop', '0', outputName];

    const cleanupTemp = async (path: string): Promise<void> => {
      try {
        await ffmpeg.deleteFile(path);
      } catch {
        // ignore
      }
    };

    try {
      await runFfmpeg('palette', paletteArgs);
    } catch (paletteError) {
      console.warn('[gifmaker] palette pipeline failed, trying simple pipeline', paletteError);
      try {
        await runFfmpeg('simple-probe', probeArgs);
        await cleanupTemp(probeOutputName);
        await runFfmpeg('simple', simpleArgs);
      } catch (simpleError) {
        await cleanupTemp(probeOutputName);
        console.warn('[gifmaker] simple pipeline failed, trying transcode fallback', simpleError);
        try {
          await runFfmpeg('transcode', transcodeArgs);
          await runFfmpeg('palette-from-transcode', paletteFromIntermediateArgs);
        } catch (transcodeError) {
          console.warn('[gifmaker] transcode fallback failed', transcodeError);
          throw transcodeError;
        } finally {
          await cleanupTemp(intermediateName);
        }
      }
    }

    const data = await ffmpeg.readFile(outputName);
    const binaryArray =
      data instanceof Uint8Array
        ? data
        : new TextEncoder().encode(typeof data === 'string' ? data : String(data));
    const normalizedArray = new Uint8Array(binaryArray.byteLength);
    normalizedArray.set(binaryArray);
    console.info('[gifmaker] readFile', { outputName, size: normalizedArray.byteLength });
    return new Blob([normalizedArray.buffer], { type: 'image/gif' });
  } catch (error) {
    if (aborted) {
      throw new Error('処理が中断されました。');
    }
    console.error('[gifmaker] ffmpeg error', error);
    console.warn('[gifmaker] ffmpeg logs', ffmpegLogs.length, ffmpegLogs);
    resetFFmpeg();
    throw error;
  } finally {
    stopProgressTicker();
    signal.removeEventListener('abort', abortHandler);
    if (ffmpeg.loaded) {
      try {
        await ffmpeg.deleteFile(inputName);
      } catch (error) {
        console.warn('Failed to remove input from FFmpeg FS', error);
      }
      try {
        await ffmpeg.deleteFile(outputName);
      } catch (error) {
        console.warn('Failed to remove output from FFmpeg FS', error);
      }
    }
  }
};

const autoEncodeWithLimit = async (
  file: File,
  options: ConversionOptions,
  signal: AbortSignal,
): Promise<{ blob: Blob; width: number; fps: number; iterations: number }> => {
  let width = Math.max(160, Math.round(options.width));
  let fps = Math.max(1, Math.round(options.fps));
  const quality = Math.max(1, Math.round(options.quality));
  let iterations = 0;
  let lastBlob: Blob | null = null;
  let lastError: unknown = null;

  const shrinkWidth = () => {
    if (width > 320) {
      width = Math.max(160, Math.floor(width * 0.85));
      return true;
    }
    return false;
  };

  const shrinkFps = () => {
    if (fps > 5) {
      fps = Math.max(5, fps - 2);
      return true;
    }
    return false;
  };

  while (width >= 160 && fps >= 5) {
    iterations += 1;
    setStatus(`変換中... (試行 ${iterations})`);

    let blob: Blob;
    try {
      blob = await generateGif(file, { width, fps, quality }, signal);
    } catch (error) {
      lastError = error;
      if (signal.aborted) {
        throw error;
      }

      const message = error instanceof Error ? error.message : String(error);
      const shouldRetry = message.includes('FFmpeg の実行に失敗しました') || message.includes('Aborted');
      const reduced = shouldRetry && (shrinkWidth() || shrinkFps());
      if (reduced) {
        console.warn('[gifmaker] retrying with reduced settings', { width, fps });
        await new Promise((resolve) => setTimeout(resolve, 0));
        continue;
      }
      throw error;
    }

    if (blob.size <= MAX_SIZE_BYTES) {
      return { blob, width, fps, iterations };
    }

    lastBlob = blob;
    if (shrinkWidth()) {
      continue;
    }
    if (shrinkFps()) {
      continue;
    }
    break;
  }

  if (lastBlob) {
    return { blob: lastBlob, width, fps, iterations };
  }

  if (lastError) {
    throw lastError instanceof Error ? lastError : new Error(String(lastError));
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
  const currentController = new AbortController();
  abortController = currentController;
  controls.convert.disabled = true;
  controls.download.setAttribute('aria-disabled', 'true');
  controls.download.removeAttribute('href');
  setStatus('変換を開始しました...');

  try {
    controls.video.pause();
    controls.video.currentTime = 0;
    await ensureVideoReady(controls.video);
    const options: ConversionOptions = {
      width: sanitizeNumberInput(controls.width.value, controls.video.videoWidth || 480, 160, 960),
      fps: sanitizeNumberInput(controls.fps.value, 12, 1, 60),
      quality: sanitizeNumberInput(controls.quality.value, 6, 1, 8),
    };
    const result = await autoEncodeWithLimit(currentFile, options, currentController.signal);
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
    let message = error instanceof Error ? error.message : '変換中にエラーが発生しました。';
    const hint = deriveFriendlyLogMessage(ffmpegLogs);
    if (hint) {
      message = `${message} ${hint}`;
    }
    setStatus(message, true);
  } finally {
    if (abortController === currentController) {
      abortController = null;
    }
    controls.convert.disabled = false;
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

const sanitizeNumberInput = (raw: string, fallback: number, min = 0, max = Number.POSITIVE_INFINITY): number => {
  const value = Number.parseFloat(raw);
  if (!Number.isFinite(value)) {
    return fallback;
  }
  return Math.min(Math.max(value, min), max);
};

resetPreview();
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
