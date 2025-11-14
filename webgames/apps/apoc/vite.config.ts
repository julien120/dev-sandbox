import { defineConfig } from 'vite';

const basePath = '/dev-sandbox/tools/apoc/';

export default defineConfig({
  base: basePath,
  build: {
    outDir: '../../dist/apoc',
    emptyOutDir: false,
  },
});
