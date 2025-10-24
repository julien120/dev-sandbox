import { defineConfig } from 'vite';

export default defineConfig({
  base: '/dev-sandbox/',
  build: {
    outDir: 'dist/site',
    emptyOutDir: false,
  },
});
