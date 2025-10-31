import { copyFile, mkdir, readdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

const mediapipeBase = resolve(__dirname, '../public/mediapipe');
const mediapipeWasmTarget = join(mediapipeBase, 'wasm');

const visionBundlePath = require.resolve('@mediapipe/tasks-vision');
const visionDir = dirname(visionBundlePath);
const mediapipeWasmSourceDir = join(visionDir, 'wasm');

const ortBase = resolve(__dirname, '../public/onnx');
const ortEntryPath = require.resolve('onnxruntime-web');
const ortDistDir = dirname(ortEntryPath);

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

await ensureDir(mediapipeBase);
await copyAll(mediapipeWasmSourceDir, mediapipeWasmTarget);

const ortFiles = [
  'ort-wasm-simd-threaded.wasm',
  'ort-wasm-simd-threaded.mjs',
  'ort-wasm-simd-threaded.jsep.wasm',
  'ort-wasm-simd-threaded.jsep.mjs',
];

await ensureDir(ortBase);
const availableOrtFiles = [];
for (const file of ortFiles) {
  const source = join(ortDistDir, file);
  try {
    await copyFile(source, join(ortBase, file));
    availableOrtFiles.push(file);
  } catch (error) {
    if (error?.code !== 'ENOENT') {
      throw error;
    }
  }
}

console.log(`[emotion] Copied MediaPipe assets to ${mediapipeBase}`);
console.log(`[emotion] Copied ONNX Runtime assets (${availableOrtFiles.length}) to ${ortBase}`);
