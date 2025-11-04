import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import { dirname, join } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const mecabPackageDir = dirname(require.resolve('mecab-wasm/package.json'));
const mecabLibDir = join(mecabPackageDir, 'lib');

export default defineConfig({
  base: '/dev-sandbox/tools/ningen/',
  build: {
    outDir: '../../dist/ningen',
    emptyOutDir: false,
  },
  resolve: {
    alias: {
      '@engine': fileURLToPath(new URL('../../packages/engine/src', import.meta.url)),
      'mecab-wasm/lib/mecab.js': join(mecabLibDir, 'mecab.js'),
      'mecab-wasm/lib/libmecab.js': join(mecabLibDir, 'libmecab.js'),
    },
  },
});
