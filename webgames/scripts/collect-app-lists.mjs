import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const catalogPath = resolve(__dirname, '../site/src/catalog.json');

const raw = await readFile(catalogPath, 'utf8');
const catalog = JSON.parse(raw);

const collect = (category) =>
  catalog
    .filter((entry) => entry.category === category)
    .map((entry) => entry.distDir)
    .filter((name) => typeof name === 'string' && name.length > 0);

const games = collect('game');
const tools = collect('tool');

if (games.length === 0) {
  throw new Error('catalog.json に game が定義されていません');
}

if (tools.length === 0) {
  throw new Error('catalog.json に tool が定義されていません');
}

console.log(`games=${games.join(' ')}`);
console.log(`tools=${tools.join(' ')}`);
