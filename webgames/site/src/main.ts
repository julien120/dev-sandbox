import './style.css';
import catalog from './catalog.json';
import flappyThumbnail from '../../assets/flappy-placeholder.svg?url';
import spaceThumbnail from '../../assets/space-placeholder.svg?url';
import emotionThumbnail from '../../assets/emotion-placeholder.svg?url';
import suikaThumbnail from '../../assets/suika-placeholder.svg?url';
import tetrisThumbnail from '../../assets/tetris-placeholder.svg?url';
import gifmakerThumbnail from '../../assets/gifmaker-placeholder.svg?url';
import dvdThumbnail from '../../assets/dvd-placeholder.svg?url';
import bubblesThumbnail from '../../assets/bubbles-placeholder.svg?url';
import precureThumbnail from '../../assets/precure-placeholder.svg?url';
import julienThumbnail from '../../assets/julien-placeholder.svg?url';
import apocThumbnail from '../../assets/apoc-placeholder.svg?url';
import unkoThumbnail from '../../assets/unko-placeholder.svg?url';
import ramenThumbnail from '../../assets/ramen-placeholder.svg?url';
import vjThumbnail from '../../assets/vj-placeholder.svg?url';
import netliteracyThumbnail from '../../assets/netliteracy-placeholder.svg?url';
import styleforgeThumbnail from '../../assets/styleforge-placeholder.svg?url';
import ningenThumbnail from '../../assets/ningen-placeholder.svg?url';
import silhouetteThumbnail from '../../assets/silhouette-placeholder.svg?url';

const thumbnailMap = {
  flappy: flappyThumbnail,
  space: spaceThumbnail,
  emotion: emotionThumbnail,
  suika: suikaThumbnail,
  tetris: tetrisThumbnail,
  gifmaker: gifmakerThumbnail,
  dvd: dvdThumbnail,
  bubbles: bubblesThumbnail,
  precure: precureThumbnail,
  julien: julienThumbnail,
  apoc: apocThumbnail,
  unko: unkoThumbnail,
  ramen: ramenThumbnail,
  vj: vjThumbnail,
  netliteracy: netliteracyThumbnail,
  styleforge: styleforgeThumbnail,
  ningen: ningenThumbnail,
  silhouette: silhouetteThumbnail,
} as const;

type ThumbnailKey = keyof typeof thumbnailMap;

type CatalogEntry = {
  slug: string;
  category: 'game' | 'tool';
  distDir: string;
  url: string;
  title: string;
  description: string;
  controls: string;
  thumbnailKey: ThumbnailKey;
};

type AppSummary = {
  slug: string;
  url: string;
  title: string;
  description: string;
  thumbnail: string;
  controls: string;
};

const games: AppSummary[] = (catalog as CatalogEntry[]).map((entry) => {
  const thumbnail = thumbnailMap[entry.thumbnailKey];
  if (!thumbnail) {
    throw new Error(`${entry.thumbnailKey} のサムネイルが未定義です`);
  }

  return {
    slug: entry.slug,
    url: entry.url,
    title: entry.title,
    description: entry.description,
    controls: entry.controls,
    thumbnail,
  };
});

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('#app コンテナが見つかりません');
}

app.innerHTML = `
  <header>
    <h1>Web Games & Tools Collection</h1>
    <p>GitHub Pages で公開中のオリジナルゲームやブラウザツール。気になるコンテンツを選んで体験しよう！</p>
  </header>
  <section class="grid" aria-label="ゲーム・ツール一覧"></section>
  <footer>
    <p>&copy; ${new Date().getFullYear()} Web Games Team</p>
  </footer>
`;

const grid = app.querySelector<HTMLElement>('.grid');

if (!grid) {
  throw new Error('ゲーム一覧セクションが見つかりません');
}

games.forEach((game) => {
  const card = document.createElement('article');
  card.className = 'card';
  card.innerHTML = `
    <img src="${game.thumbnail}" alt="${game.title} のサムネイル" loading="lazy" width="320" height="180" />
    <div class="card-content">
      <h2>${game.title}</h2>
      <p>${game.description}</p>
      <dl>
        <dt>操作方法</dt>
        <dd>${game.controls}</dd>
      </dl>
      <a class="play-button" href="${game.url}" data-game="${game.slug}">
        プレイする
      </a>
    </div>
  `;
  grid.appendChild(card);
});
