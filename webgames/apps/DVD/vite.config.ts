import { defineConfig, type Plugin } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import { createReadStream } from 'node:fs';
import { access } from 'node:fs/promises';
import { extname, resolve } from 'node:path';

const basePath = '/dev-sandbox/tools/DVD/';
const publicDir = fileURLToPath(new URL('./public', import.meta.url));

type StaticRoute = {
  prefix: string;
  directory: string;
};

const staticRoutes: StaticRoute[] = [
  { prefix: `${basePath}mediapipe/`, directory: 'mediapipe' },
  { prefix: `/mediapipe/`, directory: 'mediapipe' },
];

const mimeTypes: Record<string, string> = {
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.wasm': 'application/wasm',
  '.task': 'application/octet-stream',
};

const serveStaticAssets = (): Plugin => ({
  name: 'dvd-serve-static-assets',
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
        } catch {
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
  base: basePath,
  build: {
    outDir: '../../dist/DVD',
    emptyOutDir: false,
  },
  resolve: {
    alias: {
      '@engine': fileURLToPath(new URL('../../packages/engine/src', import.meta.url)),
      '@dvd': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [serveStaticAssets()],
});
