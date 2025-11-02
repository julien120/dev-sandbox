import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  base: '/dev-sandbox/tools/styleforge/',
  build: {
    outDir: '../../dist/styleforge',
    emptyOutDir: false,
  },
  resolve: {
    alias: {
      '@engine': fileURLToPath(new URL('../../packages/engine/src', import.meta.url)),
      'mecab-wasm/lib/mecab.js': fileURLToPath(
        new URL('../../node_modules/mecab-wasm/lib/mecab.js', import.meta.url),
      ),
      'mecab-wasm/lib/libmecab.js': fileURLToPath(
        new URL('../../node_modules/mecab-wasm/lib/libmecab.js', import.meta.url),
      ),
    },
  },
});
