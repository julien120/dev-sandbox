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
    thumbnail: '/webgames/assets/fish-placeholder.svg',
    controls: 'WASD / 矢印キーで移動',
  },
  {
    slug: 'toilet',
    title: 'トイレ脱出ゲーム',
    description: '制限時間内に清潔度を高め、神秘の扉を開けるリズムアクション。',
    thumbnail: '/webgames/assets/toilet-placeholder.svg',
    controls: 'スペースキー連打',
  },
  {
    slug: 'space',
    title: 'スペースシューター',
    description: '波状攻撃に備え、宇宙を駆けるシューティング。敵を倒してハイスコアを狙おう。',
    thumbnail: '/webgames/assets/space-placeholder.svg',
    controls: 'WASD / 矢印キーで移動、スペースでショット',
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
      <a class="play-button" href="/webgames/games/${game.slug}/" data-game="${game.slug}">
        プレイする
      </a>
    </div>
  `;
  grid.appendChild(card);
});
