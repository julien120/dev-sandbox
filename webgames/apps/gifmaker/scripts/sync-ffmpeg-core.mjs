import { access, copyFile, mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const ffmpegCoreEntry = require.resolve('@ffmpeg/core');
const ffmpegUmdDir = dirname(ffmpegCoreEntry);
const ffmpegDistDir = resolve(ffmpegUmdDir, '..');
const ffmpegEsmDir = resolve(ffmpegDistDir, 'esm');
const ffmpegFallbackDir = ffmpegUmdDir;
const __dirname = dirname(fileURLToPath(import.meta.url));
const publicFfmpegDir = resolve(__dirname, '../public/ffmpeg');

const ensureFile = async (dir, file) => {
  try {
    await access(resolve(dir, file));
    return true;
  } catch {
    return false;
  }
};

const coreSourceDir = (await ensureFile(ffmpegEsmDir, 'ffmpeg-core.js')) ? ffmpegEsmDir : ffmpegFallbackDir;
const coreFormat = coreSourceDir === ffmpegEsmDir ? 'esm' : 'umd';
const coreAssets = ['ffmpeg-core.js', 'ffmpeg-core.wasm'];

await mkdir(publicFfmpegDir, { recursive: true });

await Promise.all(
  coreAssets.map(async (asset) => {
    const source = resolve(coreSourceDir, asset);
    const destination = resolve(publicFfmpegDir, asset);
    await copyFile(source, destination);
  }),
);

const resolveOptionalPath = (specifier) => {
  try {
    return require.resolve(specifier);
  } catch {
    return null;
  }
};

const workerCandidates = [
  '@ffmpeg/core-mt/dist/umd/ffmpeg-core.worker.js',
  '@ffmpeg/core/dist/umd/ffmpeg-core.worker.js',
];

let workerCopied = false;

for (const candidate of workerCandidates) {
  const resolved = resolveOptionalPath(candidate);
  if (!resolved) {
    continue;
  }
  await copyFile(resolved, resolve(publicFfmpegDir, 'ffmpeg-core.worker.js'));
  workerCopied = true;
  break;
}

if (!workerCopied) {
  try {
    await access(resolve(publicFfmpegDir, 'ffmpeg-core.worker.js'));
    console.warn(
      '[gifmaker] @ffmpeg/core worker asset not supplied by package. Keeping existing local copy.',
    );
  } catch {
    console.warn(
      '[gifmaker] @ffmpeg/core worker asset not found. Please provide ffmpeg-core.worker.js manually if the runtime requires pthread support.',
    );
  }
}

console.log(
  `[gifmaker] @ffmpeg/core assets synced to ${publicFfmpegDir} (source format: ${coreFormat})`,
);
