import { copyFile, mkdir, readdir, stat } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createWriteStream } from 'node:fs';
import { get } from 'node:https';

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

const mediapipeBase = resolve(__dirname, '../public/mediapipe');
const mediapipeWasmTarget = join(mediapipeBase, 'wasm');
const modelTarget = join(mediapipeBase, 'pose_landmarker_lite.task');

const visionBundlePath = require.resolve('@mediapipe/tasks-vision');
const visionDir = dirname(visionBundlePath);
const mediapipeWasmSourceDir = join(visionDir, 'wasm');

const modelCandidates = [
  join(visionDir, 'pose_landmarker_lite.task'),
  join(visionDir, 'pose_landmarker_lite_float16.task'),
  join(visionDir, 'models', 'pose_landmarker_lite.task'),
];

const modelRemoteUrl =
  'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task';

const ensureDir = async (dir) => {
  await mkdir(dir, { recursive: true });
};

const copyAll = async (sourceDir, destinationDir) => {
  const entries = await readdir(sourceDir, { withFileTypes: true });
  await ensureDir(destinationDir);
  await Promise.all(
    entries.map(async (entry) => {
      const sourcePath = join(sourceDir, entry.name);
      const destinationPath = join(destinationDir, entry.name);
      if (entry.isDirectory()) {
        await copyAll(sourcePath, destinationPath);
      } else if (entry.isFile()) {
        await copyFile(sourcePath, destinationPath);
      }
    }),
  );
};

const downloadModel = async (url, destination) => {
  await ensureDir(dirname(destination));
  await new Promise((resolveDownload, rejectDownload) => {
    get(url, (response) => {
      if (response.statusCode && response.statusCode >= 400) {
        rejectDownload(new Error(`Failed to download model (${response.statusCode})`));
        return;
      }
      const stream = createWriteStream(destination);
      response.pipe(stream);
      stream.on('finish', () => {
        stream.close(resolveDownload);
      });
      stream.on('error', rejectDownload);
    }).on('error', rejectDownload);
  });
};

const ensureModel = async () => {
  for (const candidate of modelCandidates) {
    try {
      await copyFile(candidate, modelTarget);
      console.log(`[DVD] Copied pose model from ${candidate}`);
      return;
    } catch (error) {
      if (error?.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  try {
    await stat(modelTarget);
    console.log('[DVD] Pose model already present, skipping download');
    return;
  } catch {
    // continue
  }

  console.log(`[DVD] Downloading pose model from ${modelRemoteUrl}`);
  await downloadModel(modelRemoteUrl, modelTarget);
};

await ensureDir(mediapipeBase);
await ensureDir(mediapipeWasmTarget);
await copyAll(mediapipeWasmSourceDir, mediapipeWasmTarget);
await ensureModel();

console.log(`[DVD] MediaPipe assets prepared at ${mediapipeBase}`);
