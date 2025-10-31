import { Game, Scene, type SceneContext, clamp, vec2 } from '@webgames/engine';
import { FaceLandmarker, FilesetResolver, type FaceLandmarkerResult } from '@mediapipe/tasks-vision';
import * as ort from 'onnxruntime-web';
import './style.css';

type ExpressionId = 'neutral' | 'joy' | 'surprise' | 'sad' | 'anger';

type ExpressionDefinition = {
  id: ExpressionId;
  emoji: string;
  label: string;
  description: string;
};

type ExpressionProbabilities = Record<ExpressionId, number>;

type EmotionPrediction = {
  id: ExpressionId | 'unknown';
  confidence: number;
  competitor: number;
  probabilities: ExpressionProbabilities;
};

const EXPRESSIONS: ExpressionDefinition[] = [
  { id: 'neutral', emoji: '😐', label: 'ニュートラル', description: '自然体でリラックス' },
  { id: 'joy', emoji: '😀', label: 'よろこび', description: '口角を上げてにっこり' },
  { id: 'surprise', emoji: '😲', label: 'おどろき', description: '目と口を大きく開く' },
  { id: 'sad', emoji: '😢', label: 'かなしい', description: '口角を下げてしょんぼり' },
  { id: 'anger', emoji: '😡', label: 'いかり', description: '眉を寄せてキリッと' },
];

const TARGET_EXPRESSIONS = EXPRESSIONS.filter((expression) => expression.id !== 'neutral');

const FER_LABELS = ['neutral', 'happiness', 'surprise', 'sadness', 'anger'];

const FER_TO_EXPRESSION: Record<ExpressionId, number> = {
  neutral: FER_LABELS.indexOf('neutral'),
  joy: FER_LABELS.indexOf('happiness'),
  surprise: FER_LABELS.indexOf('surprise'),
  sad: FER_LABELS.indexOf('sadness'),
  anger: FER_LABELS.indexOf('anger'),
};

const DETECTION_INTERVAL = 0.2;
const MATCH_FILL_SPEED = 0.55;
const MATCH_THRESHOLD = 0.18;
const MATCH_MARGIN = 0.04;
const INITIAL_TIME = 45;
const BONUS_TIME = 8;
const FACE_PADDING = 0.25;
const CONFIDENCE_THRESHOLD = 0.25;
const CROP_SIZE = 64;

const joinBasePath = (base: string, path: string): string => {
  const baseNormalized = base.replace(/\/+$/, '');
  const keepTrailing = path.endsWith('/');
  const pathNormalized = path.replace(/^\/+/, '').replace(/\/+$/, '');
  const joined = `${baseNormalized}/${pathNormalized}`;
  return keepTrailing ? `${joined}/` : joined;
};

const softmax = (values: Float32Array | number[]): number[] => {
  const source = Array.isArray(values) ? values : Array.from(values);
  let max = -Infinity;
  for (let i = 0; i < source.length; i += 1) {
    max = Math.max(max, source[i]);
  }

  const exps = source.map((value) => Math.exp(value - max));
  const sum = exps.reduce((acc, value) => acc + value, 0);
  const denominator = sum || 1;
  return exps.map((value) => value / denominator);
};

const createDomRect = (x: number, y: number, width: number, height: number): DOMRectReadOnly =>
  new DOMRectReadOnly(x, y, width, height);

class EmotionScene extends Scene {
  private video: HTMLVideoElement | null = null;
  private stream: MediaStream | null = null;
  private landmarker: FaceLandmarker | null = null;
  private onnxSession: ort.InferenceSession | null = null;
  private detectionTimer = 0;
  private detecting = false;

  private readonly cropCanvas: HTMLCanvasElement;
  private readonly cropCtx: CanvasRenderingContext2D | null;

  private timeLeft = INITIAL_TIME;
  private score = 0;
  private combo = 0;
  private bestCombo = 0;
  private matchProgress = 0;
  private target: ExpressionDefinition = EXPRESSIONS[0];
  private lastExpression: ExpressionId | 'unknown' = 'unknown';
  private lastConfidence = 0;
  private lastBestProbability = 0;
  private lastCompetitorProbability = 0;
  private lastProbabilities: ExpressionProbabilities = {
    neutral: 0,
    joy: 0,
    surprise: 0,
    sad: 0,
    anger: 0,
  };
  private lastBoundingBox: DOMRectReadOnly | null = null;
  private status: string | null = 'カメラとモデルを初期化しています...';
  private gameOver = false;
  private removeInputListener: (() => void) | null = null;

  constructor() {
    super();
    this.cropCanvas = document.createElement('canvas');
    this.cropCanvas.width = CROP_SIZE;
    this.cropCanvas.height = CROP_SIZE;
    this.cropCtx = this.cropCanvas.getContext('2d', { willReadFrequently: true });
  }

  async onEnter(context: SceneContext): Promise<void> {
    this.resetState();
    this.video = document.getElementById('camera-stream') as HTMLVideoElement | null;
    if (!this.video) {
      this.status = 'ビデオ要素が見つかりません。';
      const blankProbabilities = Object.fromEntries(
        EXPRESSIONS.map((expr) => [expr.id, 0]),
      ) as ExpressionProbabilities;
      blankProbabilities.neutral = 1;
      this.lastProbabilities = blankProbabilities;
      return;
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 },
        audio: false,
      });
      this.video.srcObject = this.stream;
      await this.video.play();
    } catch (error) {
      console.error(error);
      this.status = 'カメラの取得に失敗しました。権限を確認してください。';
      return;
    }

    try {
      await this.initializeModels();
    } catch (error) {
      console.error(error);
      this.status = '表情解析モジュールの初期化に失敗しました。ブラウザを再読み込みしてください。';
      return;
    }

    this.status = 'ターゲットの表情を真似てゲージを満たそう！';
    this.pickNextTarget();
    const input = context.input;
    this.removeInputListener = input.onInput((event) => this.handleInput(event));
  }

  onExit(): void {
    this.cleanupStream();
    this.removeInputListener?.();
    this.removeInputListener = null;
    this.landmarker?.close();
    this.landmarker = null;
    this.onnxSession?.release?.();
    this.onnxSession = null;
  }

  update(dt: number): void {
    if (this.gameOver) {
      return;
    }

    this.timeLeft = clamp(this.timeLeft - dt, 0, 999);
    if (this.timeLeft <= 0) {
      this.gameOver = true;
      this.status = '時間切れ！スペースかクリックで再スタート';
      return;
    }

    if (!this.landmarker || !this.onnxSession || !this.video || this.video.readyState < HTMLMediaElement.HAVE_ENOUGH_DATA) {
      return;
    }

    this.detectionTimer -= dt;
    if (this.detectionTimer <= 0 && !this.detecting) {
      this.detectionTimer = DETECTION_INTERVAL;
      void this.detectExpression();
    }
  }

  render(context: SceneContext): void {
    const renderer = context.renderer;
    const ctx = renderer.context;
    const canvas = renderer.canvas;

    ctx.save();
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    if (this.video && this.video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      ctx.save();
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(this.video, 0, 0, canvas.width, canvas.height);
      ctx.restore();
    }

    if (this.lastBoundingBox) {
      this.drawFaceOutline(ctx, canvas);
    }

    this.drawHud(ctx, canvas);
    this.drawStatus(ctx, canvas);
  }

  private async initializeModels(): Promise<void> {
    if (!this.video) {
      throw new Error('video not ready');
    }

    const baseUrl = import.meta.env.BASE_URL ?? '/';
    const mediapipeWasmBase = joinBasePath(baseUrl, 'mediapipe/wasm/');
    const faceModelPath = joinBasePath(baseUrl, 'mediapipe/face_landmarker.task');
    const fileset = await FilesetResolver.forVisionTasks(mediapipeWasmBase);

    this.landmarker = await FaceLandmarker.createFromOptions(fileset, {
      baseOptions: {
        modelAssetPath: faceModelPath,
      },
      runningMode: 'VIDEO',
      numFaces: 1,
      outputFaceBlendshapes: false,
      outputFacialTransformationMatrixes: false,
    });

    ort.env.wasm.wasmPaths = joinBasePath(baseUrl, 'onnx/');
    ort.env.wasm.simd = true;
    ort.env.wasm.numThreads = 1;
    ort.env.wasm.proxy = false;

    const modelUrl = joinBasePath(baseUrl, 'models/ferplus.onnx');
    const response = await fetch(modelUrl);
    if (!response.ok) {
      throw new Error(`モデルの取得に失敗しました (${response.status} ${response.statusText})`);
    }
    const modelBuffer = new Uint8Array(await response.arrayBuffer());

    this.onnxSession = await ort.InferenceSession.create(modelBuffer, {
      executionProviders: ['wasm'],
      graphOptimizationLevel: 'all',
    });
  }

  private resetState(): void {
    this.timeLeft = INITIAL_TIME;
    this.score = 0;
    this.combo = 0;
    this.bestCombo = 0;
    this.matchProgress = 0;
    this.target = TARGET_EXPRESSIONS[0];
    this.lastExpression = 'unknown';
    this.lastConfidence = 0;
    this.lastBestProbability = 0;
    this.lastCompetitorProbability = 0;
    this.lastProbabilities = {
      neutral: 0,
      joy: 0,
      surprise: 0,
      sad: 0,
      anger: 0,
    };
    this.lastBoundingBox = null;
    this.status = 'カメラとモデルを初期化しています...';
    this.gameOver = false;
    this.detectionTimer = 0;
  }

  private handleInput(event: KeyboardEvent | PointerEvent): void {
    if (event instanceof PointerEvent && event.type === 'pointerdown') {
      if (this.gameOver) {
        this.resetState();
        this.status = 'ターゲットの表情を真似てゲージを満たそう！';
        this.pickNextTarget();
      }
      return;
    }

    if (!(event instanceof KeyboardEvent) || event.type !== 'keydown') {
      return;
    }

    const key = event.key.toLowerCase();
    if (key === ' ' || key === 'enter') {
      if (this.gameOver) {
        this.resetState();
        this.status = 'ターゲットの表情を真似てゲージを満たそう！';
        this.pickNextTarget();
      }
    }
  }

  private async detectExpression(): Promise<void> {
    if (!this.landmarker || !this.onnxSession || !this.video || !this.cropCtx) {
      return;
    }

    this.detecting = true;
    try {
      const result = this.landmarker.detectForVideo(this.video, performance.now());
      if (!result || !result.faceLandmarks.length) {
        this.lastBoundingBox = null;
        this.lastExpression = 'unknown';
        this.lastConfidence = 0;
        this.lastProbabilities = Object.fromEntries(
          EXPRESSIONS.map((expr) => [expr.id, 0]),
        ) as ExpressionProbabilities;
        this.status = '顔を検出中...';
        return;
      }

      const boundingBox = this.computeBoundingBox(result, this.video);
      if (!boundingBox || boundingBox.width <= 0 || boundingBox.height <= 0) {
        return;
      }

      this.lastBoundingBox = boundingBox;
      const prediction = await this.predictEmotion(boundingBox);
      if (!prediction) {
        return;
      }

      const neutralProbability = prediction.probabilities.neutral ?? 0;
      const emotionRemainder = Math.max(1e-3, 1 - neutralProbability);
      const adjustedProbabilities = Object.fromEntries(
        EXPRESSIONS.map((expr) => {
          if (expr.id === 'neutral') {
            return [expr.id, neutralProbability];
          }
          const raw = prediction.probabilities[expr.id] ?? 0;
          return [expr.id, Math.min(raw / emotionRemainder, 1)];
        }),
      ) as ExpressionProbabilities;

      const nonNeutralOrder = TARGET_EXPRESSIONS
        .map((expr) => ({ id: expr.id, value: adjustedProbabilities[expr.id] ?? 0 }))
        .sort((a, b) => b.value - a.value);

      const topEntry = nonNeutralOrder[0] ?? { id: 'joy', value: 0 };
      const secondEntry = nonNeutralOrder[1] ?? { id: 'joy', value: 0 };

      this.status = null;
      this.lastExpression = topEntry.value >= CONFIDENCE_THRESHOLD ? topEntry.id : 'unknown';
      const targetProbability = adjustedProbabilities[this.target.id] ?? 0;
      this.lastConfidence = targetProbability;
      this.lastBestProbability = topEntry.value;
      this.lastCompetitorProbability = secondEntry.value;
      this.lastProbabilities = adjustedProbabilities;

      const competitorDiff = targetProbability - this.lastCompetitorProbability;

      if (targetProbability >= MATCH_THRESHOLD && competitorDiff >= MATCH_MARGIN) {
        const strength = Math.max(targetProbability - MATCH_THRESHOLD, 0.01);
        const increment = strength * MATCH_FILL_SPEED * DETECTION_INTERVAL;
        this.matchProgress = Math.min(1, this.matchProgress + increment);
      }

      if (this.matchProgress >= 0.999) {
        this.onSuccessMatch();
      }
    } catch (error) {
      console.error(error);
      this.status = '表情の解析中にエラーが発生しました。再読み込みしてください。';
    } finally {
      this.detecting = false;
    }
  }

  private computeBoundingBox(result: FaceLandmarkerResult, video: HTMLVideoElement): DOMRectReadOnly | null {
    const landmarks = result.faceLandmarks?.[0];
    if (!landmarks || landmarks.length === 0) {
      return null;
    }

    const videoWidth = video.videoWidth || video.width;
    const videoHeight = video.videoHeight || video.height;

    const xs = landmarks.map((point) => point.x);
    const ys = landmarks.map((point) => point.y);
    const normalized = Math.max(...xs) <= 1 && Math.max(...ys) <= 1;

    const toPixelX = (value: number) => (normalized ? value * videoWidth : value);
    const toPixelY = (value: number) => (normalized ? value * videoHeight : value);

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    let left = toPixelX(minX);
    let right = toPixelX(maxX);
    let top = toPixelY(minY);
    let bottom = toPixelY(maxY);

    const width = right - left;
    const height = bottom - top;
    const paddingX = width * FACE_PADDING;
    const paddingY = height * FACE_PADDING;

    left = clamp(left - paddingX, 0, videoWidth);
    top = clamp(top - paddingY, 0, videoHeight);
    right = clamp(right + paddingX, 0, videoWidth);
    bottom = clamp(bottom + paddingY, 0, videoHeight);

    return createDomRect(left, top, Math.max(1, right - left), Math.max(1, bottom - top));
  }

  private async predictEmotion(boundingBox: DOMRectReadOnly): Promise<EmotionPrediction | null> {
    if (!this.video || !this.cropCtx || !this.onnxSession) {
      return null;
    }

    this.cropCtx.drawImage(
      this.video,
      boundingBox.x,
      boundingBox.y,
      boundingBox.width,
      boundingBox.height,
      0,
      0,
      CROP_SIZE,
      CROP_SIZE,
    );

    const imageData = this.cropCtx.getImageData(0, 0, CROP_SIZE, CROP_SIZE);
    const data = imageData.data;
    const tensorData = new Float32Array(CROP_SIZE * CROP_SIZE);

    for (let index = 0; index < tensorData.length; index += 1) {
      const offset = index * 4;
      const r = data[offset];
      const g = data[offset + 1];
      const b = data[offset + 2];
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      tensorData[index] = gray;
    }

    const feeds: Record<string, ort.Tensor> = {};
    feeds[this.onnxSession.inputNames[0]] = new ort.Tensor('float32', tensorData, [1, 1, CROP_SIZE, CROP_SIZE]);
    const results = await this.onnxSession.run(feeds);
    const outputName = this.onnxSession.outputNames[0];
    const output = results[outputName];
    if (!output) {
      return null;
    }

    const logits = Array.from((output as ort.Tensor).data as Float32Array);
    const probabilitiesRaw = softmax(logits);

    const probabilities: ExpressionProbabilities = Object.fromEntries(
      EXPRESSIONS.map((expr) => {
        const index = FER_TO_EXPRESSION[expr.id];
        return [expr.id, probabilitiesRaw[index] ?? 0];
      }),
    ) as ExpressionProbabilities;

    const entries = (Object.entries(probabilities) as Array<[ExpressionId, number]>).filter(
      ([id]) => id !== 'neutral',
    ) as Array<[Exclude<ExpressionId, 'neutral'>, number]>;
    entries.sort((a, b) => b[1] - a[1]);
    const [bestId, bestScore] = entries[0];
    const competitorScore = entries.length > 1 ? entries[1][1] : 0;

    return {
      id: bestScore >= CONFIDENCE_THRESHOLD ? bestId : 'unknown',
      confidence: bestScore,
      competitor: competitorScore,
      probabilities,
    };
  }

  private onSuccessMatch(): void {
    this.score += 100 + this.combo * 20;
    this.combo += 1;
    this.bestCombo = Math.max(this.bestCombo, this.combo);
    this.timeLeft = clamp(this.timeLeft + BONUS_TIME, 0, 120);
    this.matchProgress = 0;
    this.status = `${this.target.label}クリア！ +${BONUS_TIME}秒`;
    this.pickNextTarget();
  }

  private pickNextTarget(): void {
    const nextCandidates = TARGET_EXPRESSIONS.filter((expression) => expression.id !== this.target.id);
    const randomIndex = Math.floor(Math.random() * nextCandidates.length);
    this.target = nextCandidates[randomIndex] ?? TARGET_EXPRESSIONS[0];
  }

  private drawFaceOutline(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
    if (!this.video || !this.lastBoundingBox) {
      return;
    }

    const bbox = this.lastBoundingBox;
    const scaleX = canvas.width / (this.video.videoWidth || this.video.width || canvas.width);
    const scaleY = canvas.height / (this.video.videoHeight || this.video.height || canvas.height);
    const x = canvas.width - (bbox.x + bbox.width) * scaleX;
    const y = bbox.y * scaleY;
    const width = bbox.width * scaleX;
    const height = bbox.height * scaleY;

    ctx.save();
    ctx.strokeStyle = 'rgba(96, 165, 250, 0.85)';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, width, height);
    ctx.restore();
  }

  private drawHud(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
    ctx.fillRect(20, 20, 200, 120);
    ctx.fillRect(canvas.width - 240, 20, 220, 260);

    ctx.fillStyle = '#f8fafc';
    ctx.font = '22px/1.3 "Noto Sans JP", system-ui, sans-serif';
    ctx.fillText(`ターゲット`, 32, 52);
    ctx.font = '64px/1 "Segoe UI Emoji", system-ui';
    ctx.fillText(this.target.emoji, 36, 120);
    ctx.font = '20px/1.2 "Noto Sans JP", system-ui, sans-serif';
    ctx.fillText(this.target.label, 100, 86);
    ctx.fillText(this.target.description, 32, 150);

    ctx.textAlign = 'right';
    ctx.font = '24px/1.4 "Noto Sans JP", system-ui, sans-serif';
    ctx.fillText(`スコア: ${this.score}`, canvas.width - 24, 52);
    ctx.fillText(`のこり時間: ${Math.ceil(this.timeLeft)}s`, canvas.width - 24, 84);
    ctx.fillText(`コンボ: ${this.combo} (ベスト ${this.bestCombo})`, canvas.width - 24, 116);
    const expressionLabel = this.lastExpression === 'unknown'
      ? '---'
      : EXPRESSIONS.find((expr) => expr.id === this.lastExpression)?.label ?? '---';
    ctx.fillText(`判定: ${expressionLabel}`, canvas.width - 24, 148);
    ctx.fillText(`ターゲット確率: ${(this.lastConfidence * 100).toFixed(1)}%`, canvas.width - 24, 180);
    ctx.fillText(`最大確率: ${(this.lastBestProbability * 100).toFixed(1)}%`, canvas.width - 24, 212);
    ctx.fillText(`次点確率: ${(this.lastCompetitorProbability * 100).toFixed(1)}%`, canvas.width - 24, 244);
    ctx.textAlign = 'left';

    const barWidth = canvas.width - 80;
    const barX = 40;
    const barY = canvas.height - 60;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
    ctx.fillRect(barX, barY, barWidth, 24);
    ctx.fillStyle = '#34d399';
    ctx.fillRect(barX, barY, barWidth * clamp(this.matchProgress, 0, 1), 24);
    ctx.strokeStyle = 'rgba(248, 250, 252, 0.8)';
    ctx.lineWidth = 2;
    ctx.strokeRect(barX, barY, barWidth, 24);
    ctx.fillStyle = '#f8fafc';
    ctx.font = '18px/1.2 "Noto Sans JP", system-ui, sans-serif';
    ctx.fillText('ターゲットと一致するとゲージが満タンになります', barX, barY - 8);

    ctx.font = '16px/1.2 "Noto Sans JP", system-ui, sans-serif';
    const probabilityEntries: Array<[ExpressionDefinition, number]> = EXPRESSIONS.map((expr) => [
      expr,
      this.lastProbabilities[expr.id],
    ]);
    probabilityEntries.sort((a, b) => b[1] - a[1]);
    const startY = canvas.height - 140;
    probabilityEntries.forEach(([expr, probability], index) => {
      ctx.fillStyle = expr.id === this.target.id ? '#facc15' : '#f8fafc';
      ctx.fillText(`${expr.label}: ${(probability * 100).toFixed(1)}%`, 32, startY + index * 20);
    });

    ctx.restore();
  }

  private drawStatus(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
    if (!this.status) {
      return;
    }
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
    ctx.fillRect(80, canvas.height / 2 - 60, canvas.width - 160, 120);
    ctx.fillStyle = '#f8fafc';
    ctx.textAlign = 'center';
    ctx.font = '26px/1.4 "Noto Sans JP", system-ui, sans-serif';
    const lines = this.status.split('\n');
    lines.forEach((line, index) => {
      ctx.fillText(line, canvas.width / 2, canvas.height / 2 - 10 + index * 30);
    });
    ctx.textAlign = 'left';
    ctx.restore();
  }

  private cleanupStream(): void {
    this.stream?.getTracks().forEach((track) => track.stop());
    this.stream = null;
    if (this.video) {
      this.video.srcObject = null;
      this.video = null;
    }
  }
}

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement | null;

if (!canvas) {
  throw new Error('ゲームキャンバスが見つかりません');
}

const game = new Game(canvas, { background: '#0f172a' });
game.renderer.resize(vec2(canvas.width, canvas.height));
game.setScene(new EmotionScene());
game.start();
