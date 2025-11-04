import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import { access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { join } from 'node:path';

const resolveMecabPath = async (relativePath: string): Promise<string> => {
  const candidates = [
    new URL(`../../node_modules/${relativePath}`, import.meta.url),
    new URL(`../../../node_modules/${relativePath}`, import.meta.url),
    new URL(`../../../../node_modules/${relativePath}`, import.meta.url),
  ];

  for (const candidate of candidates) {
    try {
      const path = fileURLToPath(candidate);
      await access(path, constants.R_OK);
      return path;
    } catch {
      // try next candidate
    }
  }
  throw new Error(`[styleforge] mecab-wasm asset not found: ${relativePath}`);
};

export default defineConfig(async () => ({
  base: '/dev-sandbox/tools/styleforge/',
  build: {
    outDir: '../../dist/styleforge',
    emptyOutDir: false,
  },
  resolve: {
    alias: {
      '@engine': fileURLToPath(new URL('../../packages/engine/src', import.meta.url)),
      'mecab-wasm/lib/mecab.js': await resolveMecabPath('mecab-wasm/lib/mecab.js'),
      'mecab-wasm/lib/libmecab.js': await resolveMecabPath('mecab-wasm/lib/libmecab.js'),
      'mecab-wasm/lib/libmecab.wasm': await resolveMecabPath('mecab-wasm/lib/libmecab.wasm'),
      'mecab-wasm/lib/libmecab.data': await resolveMecabPath('mecab-wasm/lib/libmecab.data'),
    },
  },
}));
