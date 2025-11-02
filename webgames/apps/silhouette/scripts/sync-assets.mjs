import { copyFile, mkdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createWriteStream } from 'node:fs';
import { get } from 'node:https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = resolve(__dirname, '../../..');
const visionDir = resolve(projectRoot, 'node_modules/@mediapipe/tasks-vision');
const wasmSourceDir = join(visionDir, 'wasm');
const publicDir = resolve(__dirname, '../public');
const mediapipeDir = join(publicDir, 'mediapipe');
const wasmTarget = join(mediapipeDir, 'wasm');
const modelTarget = join(mediapipeDir, 'selfie_segmenter.tflite');

await mkdir(mediapipeDir, { recursive: true });
await mkdir(wasmTarget, { recursive: true });

const wasmFiles = await (await import('node:fs/promises')).readdir(wasmSourceDir);
await Promise.all(
  wasmFiles.map(async (file) => {
    await copyFile(join(wasmSourceDir, file), join(wasmTarget, file));
  }),
);

const ensureModel = async () => {
  try {
    const stat = await (await import('node:fs/promises')).stat(modelTarget);
    if (stat.size > 1024) {
      return;
    }
  } catch {
    // need download
  }

  const url = 'https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/1/selfie_segmenter.tflite';
  await new Promise((resolvePromise, rejectPromise) => {
    const fileStream = createWriteStream(modelTarget);
    const cleanupPartial = async () => {
      try {
        fileStream.destroy();
      } catch {
        // noop
      }
      try {
        await (await import('node:fs/promises')).unlink(modelTarget);
      } catch {
        // ignore
      }
    };
    get(url, (response) => {
      if (response.statusCode !== 200) {
        cleanupPartial()
          .catch(() => {
            // ignore cleanup error
          })
          .finally(() => {
            rejectPromise(new Error(`Failed to download model: ${response.statusCode}`));
          });
        return;
      }
      response.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close(resolvePromise);
      });
    }).on('error', (error) => {
      cleanupPartial()
        .catch(() => {
          // ignore cleanup error
        })
        .finally(() => {
          rejectPromise(error);
        });
    });
  });
  console.log('[silhouette] Downloaded selfie_segmenter.tflite');
};

await ensureModel();
console.log(`[silhouette] Copied MediaPipe assets to ${mediapipeDir}`);
