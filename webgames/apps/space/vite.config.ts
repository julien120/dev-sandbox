import { fileURLToPath, URL } from 'node:url';
import { webcrypto } from 'node:crypto';
import { defineConfig } from 'vite';

if (
  typeof globalThis.crypto === 'undefined' ||
  typeof globalThis.crypto.getRandomValues !== 'function'
) {
  Object.defineProperty(globalThis, 'crypto', {
    value: webcrypto,
    configurable: true,
  });
}

export default defineConfig({
  base: '/dev-sandbox/',
  build: {
    outDir: 'dist/space',
    emptyOutDir: false,
  },
  resolve: {
    alias: {
      '@engine': fileURLToPath(new URL('../../packages/engine/src', import.meta.url)),
    },
  },
});
