import { defineConfig } from 'vite';

const basePath = '/dev-sandbox/tools/precure/';

export default defineConfig({
  base: basePath,
  build: {
    outDir: '../../dist/precure',
    emptyOutDir: false,
  },
});
