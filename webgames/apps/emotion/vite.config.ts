import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  base: '/dev-sandbox/games/emotion/',
  build: {
    outDir: '../../dist/emotion',
    emptyOutDir: false,
  },
  resolve: {
    alias: {
      '@engine': fileURLToPath(new URL('../../packages/engine/src', import.meta.url)),
    },
  },
});
