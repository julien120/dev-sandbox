import { defineConfig } from 'vite';

const basePath = '/dev-sandbox/tools/unko/';

export default defineConfig({
  base: basePath,
  build: {
    outDir: '../../dist/unko',
    emptyOutDir: false,
  },
});
