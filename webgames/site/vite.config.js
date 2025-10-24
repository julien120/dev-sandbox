import { defineConfig } from 'vite';
export default defineConfig({
    base: '/webgames/',
    build: {
        outDir: 'dist/site',
        emptyOutDir: false,
    },
});
