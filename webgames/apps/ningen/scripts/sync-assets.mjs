import { access, copyFile, mkdir, readdir } from 'node:fs/promises';
import { constants } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = resolve(__dirname, '../../..');
const directLibDir = join(projectRoot, 'node_modules', 'mecab-wasm', 'lib');
const publicDir = join(__dirname, '../public');
const targetDir = join(publicDir, 'mecab');

await mkdir(targetDir, { recursive: true });

const assets = ['libmecab.js', 'libmecab.wasm', 'libmecab.data'];
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
  if (await directoryExists(directLibDir)) {
    return directLibDir;
  }

  const nodeModulesRoots = [
    join(projectRoot, 'node_modules'),
    join(projectRoot, '..', 'node_modules'),
    join(projectRoot, 'apps', 'ningen', 'node_modules'),
    join(projectRoot, '..', '..', 'node_modules'),
  ];

  for (const root of nodeModulesRoots) {
    const resolved = await tryResolveFromNodeModules(root);
    if (resolved) {
      return resolved;
    }
  }

  throw new Error(
    '[ningen] mecab-wasm の lib ディレクトリを解決できませんでした。依存関係が正しくインストールされているか確認してください。',
  );
}

async function directoryExists(dir) {
  try {
    await access(dir, constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

async function tryResolveFromNodeModules(nodeModulesDir) {
  if (!(await directoryExists(nodeModulesDir))) {
    return null;
  }

  const entries = await readdir(nodeModulesDir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'mecab-wasm' && (entry.isDirectory() || entry.isSymbolicLink())) {
      const libDir = join(nodeModulesDir, entry.name, 'lib');
      if (await directoryExists(libDir)) {
        return libDir;
      }
    }

    if (entry.name.startsWith('@') && (entry.isDirectory() || entry.isSymbolicLink())) {
      const scopeDir = join(nodeModulesDir, entry.name);
      try {
        const scopedEntries = await readdir(scopeDir, { withFileTypes: true });
        for (const scoped of scopedEntries) {
          if (scoped.name === 'mecab-wasm' && (scoped.isDirectory() || scoped.isSymbolicLink())) {
            const libDir = join(scopeDir, scoped.name, 'lib');
            if (await directoryExists(libDir)) {
              return libDir;
            }
          }
        }
      } catch {
        // ignore scope read errors
      }
    }
  }

  return null;
}
