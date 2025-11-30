import { defineConfig } from 'vite';

const basePath = '/dev-sandbox/tools/reviews/';

export default defineConfig({
  base: basePath,
  build: {
    outDir: '../../dist/reviews',
    emptyOutDir: false,
  },
});
