import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
export default defineConfig({
    base: '/dev-sandbox/games/flappy/',
    build: {
        outDir: '../../dist/flappy',
        emptyOutDir: false,
    },
    resolve: {
        alias: {
            '@engine': fileURLToPath(new URL('../../packages/engine/src', import.meta.url)),
        },
    },
});
