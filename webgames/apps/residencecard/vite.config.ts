import { defineConfig } from 'vite';

const basePath = '/dev-sandbox/tools/residencecard/';

export default defineConfig({
  base: basePath,
  build: {
    outDir: '../../dist/residencecard',
    emptyOutDir: false,
  },
});
