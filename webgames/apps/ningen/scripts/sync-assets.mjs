import { access, copyFile, mkdir } from 'node:fs/promises';
import { constants } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const publicDir = join(__dirname, '../public');
const targetDir = join(publicDir, 'mecab');

await mkdir(targetDir, { recursive: true });

const assets = ['libmecab.wasm', 'libmecab.data'];
const moduleDir = await resolveMecabLibDir();

await Promise.all(
  assets.map(async (asset) => {
    const source = join(moduleDir, asset);
    await ensureReadable(source);
    await copyFile(source, join(targetDir, asset));
  }),
);

console.log(`[ningen] Copied mecab assets (${assets.join(', ')}) to ${targetDir}`);

async function ensureReadable(path) {
  try {
    await access(path, constants.R_OK);
  } catch (error) {
    throw new Error(
      `[ningen] Asset not found or unreadable: ${path}. mecab-wasm が正しくインストールされているか確認してください。`,
      { cause: error },
    );
  }
}

async function resolveMecabLibDir() {
  try {
    const packageJsonPath = require.resolve('mecab-wasm/package.json');
    const packageDir = dirname(packageJsonPath);
    const libDir = join(packageDir, 'lib');
    await ensureReadable(libDir);
    return libDir;
  } catch (error) {
    throw new Error(
      '[ningen] mecab-wasm の lib ディレクトリを解決できませんでした。依存関係が正しくインストールされているか確認してください。',
      { cause: error },
    );
  }
}
