import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import { createReadStream } from 'node:fs';
import { access } from 'node:fs/promises';
import { extname, resolve } from 'node:path';
const basePath = '/dev-sandbox/tools/gifmaker/';
const ffmpegDir = fileURLToPath(new URL('./public/ffmpeg', import.meta.url));
const normalizedFfmpegDir = ffmpegDir.endsWith('/') ? ffmpegDir : `${ffmpegDir}/`;
const assetPrefixes = [`${basePath}ffmpeg/`, '/ffmpeg/'];
const mimeTypes = {
    '.js': 'application/javascript',
    '.wasm': 'application/wasm',
};
const serveFfmpegAssets = () => ({
    name: 'gifmaker-serve-ffmpeg-assets',
    configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
            const url = req?.url;
            if (!url) {
                next();
                return;
            }
            const pathname = url.split('?', 1)[0];
            for (const prefix of assetPrefixes) {
                if (!pathname.startsWith(prefix)) {
                    continue;
                }
                const relativePath = pathname.slice(prefix.length);
                if (!relativePath) {
                    break;
                }
                const absolutePath = resolve(ffmpegDir, relativePath);
                if (!absolutePath.startsWith(normalizedFfmpegDir)) {
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
                res.setHeader('Content-Type', mimeTypes[ext] ?? 'application/octet-stream');
                res.setHeader('Cache-Control', 'no-cache');
                createReadStream(absolutePath).pipe(res);
                return;
            }
            next();
        });
    },
});
export default defineConfig({
    base: '/dev-sandbox/tools/gifmaker/',
    build: {
        outDir: '../../dist/gifmaker',
        emptyOutDir: false,
        assetsInlineLimit: 0,
    },
    optimizeDeps: {
        exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/core'],
    },
    plugins: [serveFfmpegAssets()],
    resolve: {
        alias: {
            '@engine': fileURLToPath(new URL('../../packages/engine/src', import.meta.url)),
        },
    },
});
