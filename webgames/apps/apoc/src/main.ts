import './style.css';
import { FilesetResolver, PoseLandmarker, type PoseLandmarkerResult } from '@mediapipe/tasks-vision';

const CORE_CONNECTIONS: [number, number][] = [
  [11, 12], // shoulders
  [11, 23],
  [12, 24],
  [23, 24],
  [23, 25],
  [24, 26],
];
const FACE_INDICES = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
const LETTERS = ['J', 'U', 'L', 'I', 'E', 'N'];

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('#app not found');
}

app.innerHTML = `
  <canvas id="wireCanvas"></canvas>
  <video id="camera" autoplay playsinline></video>
`;

const canvas = document.querySelector<HTMLCanvasElement>('#wireCanvas');
const ctx = canvas?.getContext('2d');
const video = document.querySelector<HTMLVideoElement>('#camera');
if (!canvas || !ctx || !video) {
  throw new Error('initial DOM lookup failed');
}

let poseLandmarker: PoseLandmarker | null = null;
let rafId: number | null = null;
let lastVideoTime = -1;

const WASM_ASSETS_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.21/wasm';
const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task';

const start = async () => {
  try {
    const filesetResolver = await FilesetResolver.forVisionTasks(WASM_ASSETS_URL);
    poseLandmarker = await PoseLandmarker.createFromOptions(filesetResolver, {
      baseOptions: {
        modelAssetPath: MODEL_URL,
        delegate: 'GPU',
      },
      runningMode: 'VIDEO',
      numPoses: 1,
    });

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 1280, height: 720 },
      audio: false,
    });
    video.srcObject = stream;
    await video.play();
    resizeCanvas();
    drawLoop();
  } catch (error) {
    console.error(error);
  }
};

const drawLoop = () => {
  if (!poseLandmarker) {
    rafId = requestAnimationFrame(drawLoop);
    return;
  }

  if (video.readyState >= 2) {
    if (video.currentTime !== lastVideoTime) {
      lastVideoTime = video.currentTime;
      const result = poseLandmarker.detectForVideo(video, performance.now());
      renderResult(result);
    }
  }
  rafId = requestAnimationFrame(drawLoop);
};

const renderResult = (result: PoseLandmarkerResult | undefined) => {
  const width = canvas.width;
  const height = canvas.height;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.fillRect(0, 0, width, height);

  if (!result?.landmarks?.length) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillRect(0, 0, width, height);
    return;
  }

  const points = result.landmarks[0];
  ctx.strokeStyle = '#f5f5f5';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.shadowBlur = 16;
  ctx.shadowColor = '#ffffff';

  drawTorsoColumns(points, width, height);

  ctx.shadowBlur = 0;
  drawFaceLabel(points[0]);
  drawTypography(points);
};

const drawTorsoColumns = (
  points: PoseLandmarkerResult['landmarks'][0],
  width: number,
  height: number,
) => {
  const shoulderLeft = points[11];
  const shoulderRight = points[12];
  const hipLeft = points[23];
  const hipRight = points[24];
  if (!shoulderLeft || !shoulderRight || !hipLeft || !hipRight) return;
  if (
    shoulderLeft.visibility < 0.65 ||
    shoulderRight.visibility < 0.65 ||
    hipLeft.visibility < 0.65 ||
    hipRight.visibility < 0.65
  ) {
    return;
  }

  const centerX = (1 - (shoulderLeft.x + shoulderRight.x) / 2) * width;
  const topY = ((shoulderLeft.y + shoulderRight.y) / 2) * height;
  const bottomY = ((hipLeft.y + hipRight.y) / 2) * height;

  ctx.beginPath();
  ctx.moveTo(centerX, topY);
  ctx.lineTo(centerX, bottomY);
  ctx.stroke();
};

const drawFaceLabel = (head?: PoseLandmarkerResult['landmarks'][0][0]) => {
  if (!head || head.visibility < 0.5) return;
  const width = canvas.width;
  const height = canvas.height;
  const x = (1 - head.x) * width;
  const y = head.y * height + 20;
  ctx.save();
  ctx.font = '700 200px "Noto Sans JP", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('顔', x, y);
  ctx.restore();
};

const drawTypography = (points: PoseLandmarkerResult['landmarks'][0]) => {
  const width = canvas.width;
  const height = canvas.height;
  const segments = [
    { indices: [13, 15], size: 48 }, // left arm
    { indices: [14, 16], size: 48 }, // right arm
  ];

  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  segments.forEach((segment, segIndex) => {
    const start = points?.[segment.indices[0]];
    const end = points?.[segment.indices[1]];
    if (!start || !end) return;
    if (start.visibility < 0.5 || end.visibility < 0.5) return;

    const placements = LETTERS.length;
    for (let i = 0; i < placements; i += 1) {
      const letter = LETTERS[(i + segIndex) % LETTERS.length];
      const t = placements === 1 ? 0 : i / (placements - 1);
      const px = start.x + (end.x - start.x) * t;
      const py = start.y + (end.y - start.y) * t;
      const x = (1 - px) * width;
      const y = py * height;
      const fontSize = segment.size * (0.45 + i * 0.03);
      ctx.globalAlpha = 0.85 - i * 0.07;
      ctx.font = `600 ${fontSize}px "Noto Sans JP", sans-serif`;
      ctx.fillText(letter, x, y);
      drawDot(x + 5, y + 14, segIndex + i * 0.3, false);
    }
  });

  ctx.restore();
};

const drawDot = (x: number, y: number, seed: number, jitter = true) => {
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.globalAlpha = 0.6;
  ctx.shadowColor = '#ffffff';
  ctx.shadowBlur = 5;
  ctx.beginPath();
  const dx = jitter ? Math.sin(performance.now() / 2200 + seed) * 5 : 0;
  const dy = jitter ? Math.cos(performance.now() / 2300 + seed) * 3 : 0;
  ctx.arc(x + dx, y + dy, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};

const resizeCanvas = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

window.addEventListener('resize', resizeCanvas);

start();

window.addEventListener('beforeunload', () => {
  if (rafId) cancelAnimationFrame(rafId);
  poseLandmarker?.close();
  const stream = video.srcObject as MediaStream | null;
  stream?.getTracks().forEach((track) => track.stop());
});
