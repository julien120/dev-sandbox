import { access, copyFile, mkdir, readdir } from 'node:fs/promises';
import { constants } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = resolve(__dirname, '../../..');
const directLibDir = join(projectRoot, 'node_modules/mecab-wasm/lib');
const publicDir = resolve(__dirname, '../public');
const targetDir = join(publicDir, 'mecab');

await mkdir(targetDir, { recursive: true });

const assets = ['libmecab.wasm', 'libmecab.data'];

const directoryExists = async (dir) => {
  try {
    await access(dir, constants.R_OK);
    return true;
  } catch {
    return false;
  }
};

const resolveMecabLibDir = async () => {
  if (await directoryExists(directLibDir)) {
    return directLibDir;
  }

  const pnpmRoot = join(projectRoot, 'node_modules/.pnpm');
  try {
    const entries = await readdir(pnpmRoot, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue;
      }
      if (!entry.name.startsWith('mecab-wasm@')) {
        continue;
      }
      const candidate = join(pnpmRoot, entry.name, 'node_modules/mecab-wasm/lib');
      if (await directoryExists(candidate)) {
        return candidate;
      }
    }
  } catch {
    // ignore, fall through
  }

  throw new Error(
    '[styleforge] mecab-wasm の lib ディレクトリを検出できませんでした。依存関係が正しくインストールされているか確認してください。',
  );
};

const moduleDir = await resolveMecabLibDir();

await Promise.all(
  assets.map(async (asset) => {
    const source = join(moduleDir, asset);
    try {
      await access(source, constants.R_OK);
    } catch (error) {
      throw new Error(
        `[styleforge] Asset not found: ${source}. mecab-wasm が正しくインストールされているか確認してください。`,
        { cause: error },
      );
    }
    await copyFile(source, join(targetDir, asset));
  }),
);

console.log(
  `[styleforge] Copied mecab assets (${assets.join(', ')}) to ${targetDir}`,
);
