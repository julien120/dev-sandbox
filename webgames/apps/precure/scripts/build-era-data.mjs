import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const samplePath = resolve(__dirname, '../src/data/sample.md');
const outputPath = resolve(__dirname, '../src/data/precure-eras.ts');

const emotionDefs = [
  { id: 'Hope', labelJp: '希望', color: '#ff7fbf', seeds: ['希望', '光', '輝', '未来', '虹', '空', '照ら', '悟'] },
  { id: 'Courage', labelJp: '勇気', color: '#ffb347', seeds: ['勇気', '負けない', '立ち上が', 'スタンド', 'チャレンジ', 'がんば'] },
  { id: 'Joy', labelJp: '喜び', color: '#ffd966', seeds: ['笑顔', '楽しい', '嬉しい', 'ワクワク', 'Happy', 'ドキドキ', 'キラキラ'] },
  { id: 'Friendship', labelJp: '友情', color: '#7ed1ff', seeds: ['キミ', '仲間', '友達', 'つなが', '一緒', '君と', 'みんな'] },
  { id: 'Wonder', labelJp: '驚き', color: '#c492ff', seeds: ['わんだ', 'トキメキ', '光る', 'きらめ', '驚き', 'Spark'] },
  { id: 'Empathy', labelJp: '共感', color: '#9be0d4', seeds: ['抱きしめ', 'ハグ', '優し', '寄り添', 'ぎゅっと', 'やさし'] },
  { id: 'Protection', labelJp: '守り', color: '#f59f7d', seeds: ['守る', '支え', '大丈夫', '見捨て', '包み', '抱き'] },
  { id: 'Fear', labelJp: '不安', color: '#8f9bb3', seeds: ['不安', '揺れ', '涙', '怖', '寂し', 'ノイズ'] },
  { id: 'Future', labelJp: '未来', color: '#8febc6', seeds: ['未来', '明日', 'Change', '進化', 'Light up', '始まる'] },
  { id: 'Solidarity', labelJp: '連帯', color: '#6ed3ff', seeds: ['手を', 'つなが', '仲間', 'ともに', '一緒', '共に'] },
  { id: 'Memory', labelJp: '記憶', color: '#c7b8ff', seeds: ['思い出', '記憶', '心', '胸', '響く'] },
  { id: 'Adventure', labelJp: '冒険', color: '#ffa45b', seeds: ['冒険', '羽ばた', 'Fly', '駆け出', '高く', '旅'] }
];

const normalize = (text) => text.replace(/\s+/g, '');

const content = await readFile(samplePath, 'utf8');
const sections = [];
let current = null;
for (const rawLine of content.split(/\r?\n/)) {
  const line = rawLine.trim();
  if (line.startsWith('# ')) {
    if (current) sections.push(current);
    current = { title: line.replace(/^#\s*/, '').trim(), lines: [] };
  } else if (current) {
    current.lines.push(line);
  }
}
if (current) sections.push(current);

const eraData = sections
  .map((section) => {
    const yearMatch = section.title.match(/(20\d{2})/);
    const era = yearMatch ? yearMatch[1] : section.title;
    const label = section.title;
    const lines = section.lines.filter((line) => line.length > 0);
    const nodeTotals = new Map(emotionDefs.map((emotion) => [emotion.id, 0]));
    const phraseCandidates = new Map();
    const linkTotals = new Map();

    lines.forEach((line, lineIndex) => {
      const normalizedLine = normalize(line);
      const activeEmotions = [];
      emotionDefs.forEach((emotion) => {
        const score = emotion.seeds.reduce((acc, seed) => (
          normalizedLine.includes(seed.replace(/\s+/g, '')) ? acc + 1 : acc
        ), 0);
        if (score > 0) {
          const current = nodeTotals.get(emotion.id) ?? 0;
          nodeTotals.set(emotion.id, current + score);
          activeEmotions.push({ id: emotion.id, score, line, lineIndex });
          const existing = phraseCandidates.get(emotion.id);
          const lineScore = score * 20 - Math.abs(line.length - 18);
          if (!existing || lineScore > existing.lineScore) {
            phraseCandidates.set(emotion.id, { line, lineScore, order: lineIndex });
          }
        }
      });
      for (let i = 0; i < activeEmotions.length; i += 1) {
        for (let j = i + 1; j < activeEmotions.length; j += 1) {
          const [a, b] = [activeEmotions[i].id, activeEmotions[j].id].sort();
          const key = `${a}::${b}`;
          linkTotals.set(key, (linkTotals.get(key) ?? 0) + 1);
        }
      }
    });

    const nodesRaw = emotionDefs
      .map((emotion) => {
        const value = nodeTotals.get(emotion.id) ?? 0;
        if (value <= 0) return null;
        return {
          id: emotion.id,
          label: emotion.labelJp,
          rawValue: value,
          color: emotion.color,
          phrase: phraseCandidates.get(emotion.id)?.line ?? '',
        };
      })
      .filter(Boolean);

    if (nodesRaw.length === 0) {
      return null;
    }

    const maxValue = Math.max(...nodesRaw.map((node) => node.rawValue), 1);
    const nodes = nodesRaw.map((node) => ({
      id: node.id,
      label: node.label,
      value: Number(((node.rawValue / maxValue) * 100).toFixed(1)),
      color: node.color,
      phrase: node.phrase,
    }));

    const maxLink = Math.max(...linkTotals.values(), 1);
    const links = [...linkTotals.entries()].map(([key, weight]) => {
      const [source, target] = key.split('::');
      return {
        source,
        target,
        weight: Number((weight / maxLink).toFixed(2)),
      };
    });

    return {
      era,
      label,
      nodes,
      links,
    };
  })
  .filter(Boolean);

const fileContent = `import type { EraGraph } from '../types';\n\nexport const PRECURE_ERAS: EraGraph[] = ${JSON.stringify(
  eraData,
  null,
  2,
)};\n`;

await writeFile(outputPath, fileContent);
console.log(`Precure era data generated to ${outputPath}`);
