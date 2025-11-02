import './style.css';
import flappyThumbnail from '../../assets/flappy-placeholder.svg?url';
import spaceThumbnail from '../../assets/space-placeholder.svg?url';
import emotionThumbnail from '../../assets/emotion-placeholder.svg?url';
import suikaThumbnail from '../../assets/suika-placeholder.svg?url';
import tetrisThumbnail from '../../assets/tetris-placeholder.svg?url';
import gifmakerThumbnail from '../../assets/gifmaker-placeholder.svg?url';
import ramenThumbnail from '../../assets/ramen-placeholder.svg?url';
import vjThumbnail from '../../assets/vj-placeholder.svg?url';
import netliteracyThumbnail from '../../assets/netliteracy-placeholder.svg?url';
import styleforgeThumbnail from '../../assets/styleforge-placeholder.svg?url';
import ningenThumbnail from '../../assets/ningen-placeholder.svg?url';
import silhouetteThumbnail from '../../assets/silhouette-placeholder.svg?url';

type GameSummary = {
  slug: string;
  url: string;
  title: string;
  description: string;
  thumbnail: string;
  controls: string;
};

const games: GameSummary[] = [
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
  {
    slug: 'ramen',
    url: '/dev-sandbox/tools/ramen/',
    title: 'Rotate Ramen',
    description: '三次元のラーメンをドラッグで回し、角度を変えて眺めるビジュアルツール。',
    thumbnail: ramenThumbnail,
    controls: 'ドラッグで回転、ホイールでズーム、スペースでリセット',
  },
  {
    slug: 'vj',
    url: '/dev-sandbox/tools/vj/',
    title: 'Tone VJ Studio',
    description: 'Tone.js と 3D 演出で音と映像が連動するインタラクティブな VJ ツール。',
    thumbnail: vjThumbnail,
    controls: 'クリックで開始、マウス移動で音色とカメラ、クリックでアクセント、スペースでコード変更',
  },
  {
    slug: 'netliteracy',
    url: '/dev-sandbox/tools/netliteracy/',
    title: 'ネットリテラシー上級者の写真投稿',
    description: '写真の顔を自動で検知してぼかし、安心して共有できる画像を作成します。',
    thumbnail: netliteracyThumbnail,
    controls: '写真をドロップ → 顔をぼかす → 画像をダウンロード',
  },
  {
    slug: 'styleforge',
    url: '/dev-sandbox/tools/styleforge/',
    title: '文体スタイル変換ファクトリー',
    description: '文章をMeCabで解析し、選んだ文体に合わせてリライトするモダンなテキストツール。',
    thumbnail: styleforgeThumbnail,
    controls: '文章を入力 → 文体を選択 → 変換結果と形態素解析を確認',
  },
  {
    slug: 'ningen',
    url: '/dev-sandbox/tools/ningen/',
    title: '人間失格ワードクラウドラボ',
    description: '青空文庫「人間失格」をMeCabで解析し、頻出語からワードクラウドを生成・ダウンロードできます。',
    thumbnail: ningenThumbnail,
    controls: '「生成」ボタンでクラウド描画 → PNGを保存',
  },
  {
    slug: 'silhouette',
    url: '/dev-sandbox/tools/silhouette/',
    title: '週刊誌のサムネイル生成',
    description: 'MediaPipe Selfie Segmenter と Canvas 処理で人物を切り抜き、縦書きテキストを重ねて週刊誌風サムネを作成。',
    thumbnail: silhouetteThumbnail,
    controls: '画像アップロード → 色と文字を設定 → 生成＆ダウンロード',
  },
];

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
