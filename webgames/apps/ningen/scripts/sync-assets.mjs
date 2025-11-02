import { copyFile, mkdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = resolve(__dirname, '../../..');
const moduleDir = resolve(projectRoot, 'node_modules/mecab-wasm/lib');
const publicDir = resolve(__dirname, '../public');
const targetDir = join(publicDir, 'mecab');

await mkdir(targetDir, { recursive: true });

const assets = ['libmecab.wasm', 'libmecab.data'];

await Promise.all(
  assets.map(async (asset) => {
    await copyFile(join(moduleDir, asset), join(targetDir, asset));
  }),
);

console.log(`[ningen] Copied mecab assets to ${targetDir}`);
