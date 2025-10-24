import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  base: '/webgames/games/tetris/',
  build: {
    outDir: 'dist/tetris',
    emptyOutDir: false,
  },
  resolve: {
    alias: {
      '@engine': fileURLToPath(new URL('../../packages/engine/src', import.meta.url)),
    },
  },
});
