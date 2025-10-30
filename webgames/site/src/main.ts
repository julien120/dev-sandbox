import './style.css';

type GameSummary = {
  slug: string;
  title: string;
  description: string;
  thumbnail: string;
  controls: string;
};

const games: GameSummary[] = [
  {
    slug: 'fish',
    title: 'スクミー',
    description: '小さな魚を操り、障害物を避けながら海底を冒険するスイムアクション。',
    thumbnail: '/dev-sandbox/assets/fish-placeholder.svg',
    controls: 'WASD / 矢印キーで移動',
  },
  {
    slug: 'flappy',
    title: 'フラッピー・フライト',
    description: '障害物をすり抜けながらリズムよく飛行するフラッピーバードライクなアクション。',
    thumbnail: '/dev-sandbox/assets/flappy-placeholder.svg',
    controls: 'スペース / クリック / タップで羽ばたく',
  },
  {
    slug: 'toilet',
    title: 'トイレ脱出ゲーム',
    description: '制限時間内に清潔度を高め、神秘の扉を開けるリズムアクション。',
    thumbnail: '/dev-sandbox/assets/toilet-placeholder.svg',
    controls: 'スペースキー連打',
  },
  {
    slug: 'space',
    title: 'スペースシューター',
    description: '波状攻撃に備え、宇宙を駆けるシューティング。敵を倒してハイスコアを狙おう。',
    thumbnail: '/dev-sandbox/assets/space-placeholder.svg',
    controls: 'WASD / 矢印キーで移動、スペースでショット',
  },
  {
    slug: 'suika',
    title: 'すいかドロップ',
    description: '落としたフルーツ同士を合体させ、大きなスイカを育てるフィジカルパズル。',
    thumbnail: '/dev-sandbox/assets/suika-placeholder.svg',
    controls: '← → / A D 移動、Space / Enter / タップでドロップ',
  },
  {
    slug: 'tetris',
    title: 'テトリス',
    description: 'テトリミノを積み上げ、ラインを揃えて消していくクラシックパズル。連続ラインで高得点を狙おう。',
    thumbnail: '/dev-sandbox/assets/tetris-placeholder.svg',
    controls: '← → 移動、↑ / X 右回転、Z 左回転、Space ハードドロップ',
  },
];

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('#app コンテナが見つかりません');
}

app.innerHTML = `
  <header>
    <h1>Web Games Collection</h1>
    <p>GitHub Pages で公開中のオリジナルゲームたち。好きなゲームを選んで遊んでみよう！</p>
  </header>
  <section class="grid" aria-label="ゲーム一覧"></section>
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
      <a class="play-button" href="/dev-sandbox/games/${game.slug}/" data-game="${game.slug}">
        プレイする
      </a>
    </div>
  `;
  grid.appendChild(card);
});
