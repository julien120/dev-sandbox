#!/usr/bin/env node
// MeCab WASM を使って txt コーパスから頻出語トップ40（2文字以上、助詞系除外）を算出し、
// src/data.ts へ貼り付けやすい JSON を出力するスクリプト。
// 使い方: node scripts/precompute-words.mjs public/corpus/ningen.txt ningen "人間失格" 太宰治 1948

import fs from 'fs';
import path from 'path';

const [, , corpusPath, id, title, author, yearStr] = process.argv;
if (!corpusPath || !id || !title || !author || !yearStr) {
  console.error('Usage: node scripts/precompute-words.mjs <corpus.txt> <id> <title> <author> <year>');
  process.exit(1);
}
const year = Number(yearStr);

// --- Minimal browser polyfill for mecab-wasm ---
const cwd = process.cwd();
const realProcess = globalThis.process;
const fakeLocation = { pathname: cwd + '/' };
const fakeWindow = { location: fakeLocation, encodeURIComponent: encodeURIComponent };
globalThis.process = undefined;
globalThis.window = fakeWindow;
globalThis.self = globalThis;
globalThis.document = { currentScript: { src: '' } };
globalThis.location = fakeLocation;
class SimpleXHR {
  constructor() { this.responseType = 'arraybuffer'; this.status = 0; }
  open(method, url) { this.method = method; this.url = url; }
  setRequestHeader() {}
  send() {
    try {
      const target = this.url.startsWith('file:') ? new URL(this.url) : path.isAbsolute(this.url) ? this.url : path.join(cwd, this.url);
      const data = fs.readFileSync(target instanceof URL ? target : target);
      this.status = 200;
      this.response = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
      this.onload && this.onload();
    } catch (err) {
      this.status = 404;
      this.onerror && this.onerror(err);
    }
  }
}
globalThis.XMLHttpRequest = SimpleXHR;

const mecabPath = path.join(cwd, 'node_modules', 'mecab-wasm', 'lib', 'mecab.js');
const { default: Mecab } = await import('file://' + mecabPath);
globalThis.process = realProcess;
await Mecab.waitReady();

const text = fs.readFileSync(corpusPath, 'utf8');
const tokens = Mecab.query(text);

const stopwords = new Set([
  'こと','もの','よう','ような','ように','ところ','それ','これ','あれ','の','ん','そして','しかし','ようだ','ため','ので','など','また','なに','何','自分','人間','私','僕','俺','君','さん','する','ある','いる','なる','できる','これら','それら','どこ','ここ','ほんと','ほんとう','感じ','時','中','前','後','胸','事','人','たち','年'
]);
const particleLike = new Set(['みたい','そう','さ','ほう','そして','しかし','だから','ので']);

const counts = new Map();
for (const t of tokens) {
  if (!t) continue;
  if (t.pos !== '名詞') continue;
  const base = t.dictionary_form && t.dictionary_form !== '*' ? t.dictionary_form : t.word;
  if (!base || stopwords.has(base)) continue;
  if ([...base].length < 2) continue;
  if (particleLike.has(base)) continue;
  counts.set(base, (counts.get(base) ?? 0) + 1);
}

const top = [...counts.entries()]
  .sort((a, b) => b[1] - a[1])
  .slice(0, 40)
  .map(([surface, count]) => ({ surface, count }));

const work = { id, title, author, year, words: top };

console.log('\n// data snippet for src/data.ts\n');
console.log(JSON.stringify(work, null, 2));

