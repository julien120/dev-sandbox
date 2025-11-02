import { copyFile, mkdir, readdir, stat, writeFile, rename } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, '../public');
const mediapipeDir = join(publicDir, 'mediapipe');
const wasmTarget = join(mediapipeDir, 'wasm');
const faceDetectorShortTarget = join(mediapipeDir, 'face_detector_short_range.tflite');
const faceLandmarkerTarget = join(mediapipeDir, 'face_landmarker.task');
const FACE_DETECTOR_SHORT_URL =
  'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/latest/blaze_face_short_range.tflite';
const FACE_LANDMARKER_URL =
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task';

const repoRoot = resolve(__dirname, '../../../');
const visionPackagePath = resolve(repoRoot, 'node_modules/@mediapipe/tasks-vision');
const wasmSourceDir = join(visionPackagePath, 'wasm');

await mkdir(publicDir, { recursive: true });
await mkdir(mediapipeDir, { recursive: true });
await mkdir(wasmTarget, { recursive: true });

try {
  await stat(faceDetectorShortTarget);
} catch {
  try {
    await rename(join(mediapipeDir, 'face_detector.tflite'), faceDetectorShortTarget);
    console.log('[netliteracy] Renamed legacy face_detector.tflite to face_detector_short_range.tflite');
  } catch {
    // ignore if legacy file does not exist
  }
}

const wasmFiles = await readdir(wasmSourceDir);
await Promise.all(
  wasmFiles.map(async (file) => {
    await copyFile(join(wasmSourceDir, file), join(wasmTarget, file));
  }),
);

const ensureModel = async (targetPath, url, minBytes, label) => {
  let needsDownload = false;
  try {
    const stats = await stat(targetPath);
    if (stats.size < minBytes) {
      needsDownload = true;
    }
  } catch {
    needsDownload = true;
  }
  if (!needsDownload) {
    return;
  }
  console.log(`[netliteracy] Downloading ${label}...`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${label} download failed with status ${response.status} ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  await writeFile(targetPath, Buffer.from(arrayBuffer));
  console.log(`[netliteracy] Saved ${label} to ${targetPath}`);
};

const ensureFaceLandmarkerModel = async () => {
  let needsDownload = false;
  try {
    const stats = await stat(faceLandmarkerTarget);
    if (stats.size < 1_000_000) {
      needsDownload = true;
    }
  } catch {
    needsDownload = true;
  }
  if (!needsDownload) {
    return;
  }
  console.log('[netliteracy] Downloading Face Landmarker model (approx. 3.6 MB)...');
  const response = await fetch(FACE_LANDMARKER_URL);
  if (!response.ok) {
    throw new Error(
      `Face Landmarker model download failed with status ${response.status} ${response.statusText}`,
    );
  }
  const arrayBuffer = await response.arrayBuffer();
  await writeFile(faceLandmarkerTarget, Buffer.from(arrayBuffer));
  console.log(`[netliteracy] Saved Face Landmarker model to ${faceLandmarkerTarget}`);
};

await Promise.all([
  ensureModel(faceDetectorShortTarget, FACE_DETECTOR_SHORT_URL, 150_000, 'Face Detector (short range) model'),
  ensureFaceLandmarkerModel(),
]);

console.log(`[netliteracy] Copied MediaPipe assets to ${mediapipeDir}`);
