import { defineConfig } from 'vite';

const basePath = '/dev-sandbox/tools/bubbles/';

export default defineConfig({
  base: basePath,
  build: {
    outDir: '../../dist/bubbles',
    emptyOutDir: false,
  },
});
