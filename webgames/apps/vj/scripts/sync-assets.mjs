import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, '../public');

await mkdir(publicDir, { recursive: true });

console.log(`[vj] public assets directory ensured at ${publicDir}`);
