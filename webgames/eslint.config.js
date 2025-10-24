// eslint.config.js
import js from '@eslint/js';
import ts from 'typescript-eslint';

export default [
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    ignores: ['dist/**', 'node_modules/**'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
];
