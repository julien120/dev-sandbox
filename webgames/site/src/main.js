import './style.css';
import flappyThumbnail from '../../assets/flappy-placeholder.svg?url';
import spaceThumbnail from '../../assets/space-placeholder.svg?url';
import emotionThumbnail from '../../assets/emotion-placeholder.svg?url';
import suikaThumbnail from '../../assets/suika-placeholder.svg?url';
import tetrisThumbnail from '../../assets/tetris-placeholder.svg?url';
import gifmakerThumbnail from '../../assets/gifmaker-placeholder.svg?url';
const games = [
    {
        slug: 'flappy',
        url: '/dev-sandbox/games/flappy/',
        title: 'フラッピー・フライト',
        description: '障害物をすり抜けながらリズムよく飛行するフラッピーバードライクなアクション。',
        thumbnail: flappyThumbnail,
        controls: 'スペース / クリック / タップで羽ばたく',
    },
    {
        slug: 'space',
        url: '/dev-sandbox/games/space/',
        title: 'スペースシューター',
        description: '波状攻撃に備え、宇宙を駆けるシューティング。敵を倒してハイスコアを狙おう。',
        thumbnail: spaceThumbnail,
        controls: 'WASD / 矢印キーで移動、スペースでショット',
    },
    {
        slug: 'emotion',
        url: '/dev-sandbox/games/emotion/',
        title: 'えがおジャッジ',
        description: 'カメラに向かって表情を切り替え、指定された絵文字と同じ感情を素早く表現しよう。',
        thumbnail: emotionThumbnail,
        controls: 'カメラ許可必須・画面の指示に合わせて表情を切り替え',
    },
    {
        slug: 'suika',
        url: '/dev-sandbox/games/suika/',
        title: 'すいかドロップ',
        description: '落としたフルーツ同士を合体させ、大きなスイカを育てるフィジカルパズル。',
        thumbnail: suikaThumbnail,
        controls: '← → / A D 移動、Space / Enter / タップでドロップ',
    },
    {
        slug: 'tetris',
        url: '/dev-sandbox/games/tetris/',
        title: 'テトリス',
        description: 'テトリミノを積み上げ、ラインを揃えて消していくクラシックパズル。連続ラインで高得点を狙おう。',
        thumbnail: tetrisThumbnail,
        controls: '← → 移動、↑ / X 右回転、Z 左回転、Space ハードドロップ',
    },
    {
        slug: 'gifmaker',
        url: '/dev-sandbox/tools/gifmaker/',
        title: 'gifメイカー',
        description: '動画をドラッグ＆ドロップするだけで高画質GIFを手早く作れるブラウザツール。',
        thumbnail: gifmakerThumbnail,
        controls: '動画ファイルをドロップし、設定を調整して GIF を作成',
    },
];
const app = document.querySelector('#app');
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
const grid = app.querySelector('.grid');
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
