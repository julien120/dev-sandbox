import { defineConfig } from 'vite';
const basePath = '/dev-sandbox/tools/tierlist/';
export default defineConfig({
    base: basePath,
    build: {
        outDir: '../../dist/tierlist',
        emptyOutDir: false,
    },
});
