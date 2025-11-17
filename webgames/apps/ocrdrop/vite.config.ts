import { defineConfig } from 'vite';

const basePath = '/dev-sandbox/tools/ocrdrop/';

export default defineConfig({
  base: basePath,
  build: {
    outDir: '../../dist/ocrdrop',
    emptyOutDir: false,
  },
});
