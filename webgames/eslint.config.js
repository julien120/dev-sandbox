// eslint.config.js
import { deserialize, serialize } from 'node:v8';
import js from '@eslint/js';
import globals from 'globals';
import ts from 'typescript-eslint';

if (typeof globalThis.structuredClone === 'undefined') {
  globalThis.structuredClone = (value) => deserialize(serialize(value));
}

if (typeof globalThis.AbortSignal !== 'undefined' && !globalThis.AbortSignal.prototype.throwIfAborted) {
  // Polyfill to align with WHATWG AbortSignal#throwIfAborted
  globalThis.AbortSignal.prototype.throwIfAborted = function throwIfAborted() {
    if (this.aborted) {
      throw this.reason ?? new Error('The operation was aborted');
    }
  };
}

export default [
  {
    ignores: [
      'dist/**',
      '_site/**',
      'apps/*/dist/**',
      'apps/*/public/**',
      'apps/*/node_modules/**',
      'packages/*/node_modules/**',
      'site/dist/**',
      'site/node_modules/**',
      'node_modules/**',
      '**/node_modules/**',
    ],
  },
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        structuredClone: 'readonly',
      },
    },
  },
  js.configs.recommended,
  ...ts.configs.recommended,
];
