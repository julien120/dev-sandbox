import { defineConfig } from 'vite';

const basePath = '/dev-sandbox/tools/julien/';

export default defineConfig({
  base: basePath,
  build: {
    outDir: '../../dist/julien',
    emptyOutDir: false,
  },
});
