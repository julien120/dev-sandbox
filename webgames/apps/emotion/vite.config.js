import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import { createReadStream } from 'node:fs';
import { access } from 'node:fs/promises';
import { extname, resolve } from 'node:path';
const basePath = '/dev-sandbox/games/emotion/';
const publicDir = fileURLToPath(new URL('./public', import.meta.url));
const staticRoutes = [
    { prefix: `${basePath}onnx/`, directory: 'onnx' },
    { prefix: `${basePath}mediapipe/`, directory: 'mediapipe' },
    { prefix: `/onnx/`, directory: 'onnx' },
    { prefix: `/mediapipe/`, directory: 'mediapipe' },
];
const mimeTypes = {
    '.js': 'application/javascript',
    '.mjs': 'application/javascript',
    '.wasm': 'application/wasm',
    '.task': 'application/octet-stream',
};
const serveStaticAssets = () => ({
    name: 'emotion-serve-static-assets',
    configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
            const url = req?.url;
            if (!url) {
                next();
                return;
            }
            const pathname = url.split('?', 1)[0];
            for (const route of staticRoutes) {
                if (!pathname.startsWith(route.prefix)) {
                    continue;
                }
                const relativePath = pathname.slice(route.prefix.length);
                if (!relativePath) {
                    break;
                }
                const targetDir = resolve(publicDir, route.directory);
                const absolutePath = resolve(targetDir, relativePath);
                if (!absolutePath.startsWith(targetDir)) {
                    next();
                    return;
                }
                try {
                    await access(absolutePath);
                }
                catch {
                    continue;
                }
                const ext = extname(absolutePath);
                const contentType = mimeTypes[ext] ?? 'application/octet-stream';
                res.setHeader('Content-Type', contentType);
                res.setHeader('Cache-Control', 'no-cache');
                createReadStream(absolutePath).pipe(res);
                return;
            }
            next();
        });
    },
});
export default defineConfig({
    base: '/dev-sandbox/games/emotion/',
    build: {
        outDir: '../../dist/emotion',
        emptyOutDir: false,
    },
    resolve: {
        alias: {
            '@engine': fileURLToPath(new URL('../../packages/engine/src', import.meta.url)),
        },
    },
    plugins: [serveStaticAssets()],
});
