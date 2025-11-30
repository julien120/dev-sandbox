import { defineConfig } from 'vite';

const basePath = '/dev-sandbox/games/novelquiz/';

export default defineConfig({
  base: basePath,
  build: {
    outDir: '../../dist/novelquiz',
    emptyOutDir: false,
  },
});
