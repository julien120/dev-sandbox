import './style.css';
import { loadEraData } from './utils/loadData';
import { EraCompare } from './components/EraCompare';
import { Legend } from './components/Legend';
import { Toolbar } from './components/Toolbar';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) {
  throw new Error('#app が見つかりません');
}

const data = loadEraData();

app.innerHTML = `
  <header>
    <p class="eyebrow">2020 → 2025 Precure Opening Themes</p>
    <h1>Precure Emotion Atlas</h1>
    <p>
      歴代 OP 歌詞に潜む感情語をネットワーク化し、時代ごとの構造変化を比較します。
      ノードは登場頻度、リンクは共起強度を表します。
    </p>
  </header>
  <section class="toolbar-section"></section>
  <section class="compare-section"></section>
  <aside class="legend-section"></aside>
  <section class="analysis-section">
    <h2>2023→2025 構造変化のメモ</h2>
    <ol>
      <li><strong>2023 ひろがるスカイ！</strong> — Hope / Courage / Adventure が互いに結び合い、上昇語が中心。未知への飛躍と挑戦が直線的に繋がる。</li>
      <li><strong>2024 わんだふるぷりきゅあ！</strong> — Wonder / Friendship / Empathy が主役。抱擁や甘えの語彙がリンクを増やし、共感とケアのループが形成される。</li>
      <li><strong>2025 キミとアイドルプリキュア</strong> — Hope と Future が再び突出し、Joy や Protection は補助的。ステージ用語と決意表現が未来志向のネットワークを作る。</li>
    </ol>
    <article class="analysis-report">
      <h3>考察レポート</h3>
      <p>
        2023年の「ひろがるスカイ！」では、ネットワークの中心に Hope と Courage、それに Adventure を絡めた三角形があり、代表フレーズも「天高く羽ばたいて」「イライラもキラキラにチェンジ」といった上昇語に偏っています。ノード値とリンク太さからも、ネガティブな単語は出現しても Hope と結合してすぐに転換されており、「不安やノイズを見つけても上に行く」というきれいなベクトルが観測されます。すなわち、ヒロインが世界の高みを目指すという作品テーマが、感情語の共起構造にもストレートに出ている状態です。
      </p>
      <p>
        2024年「わんだふるぷりきゅあ！」になると、Joy と Wonder が最大ノードである点は同じですが、それらが Friendhip/Empathy/Protection と密につながり、さらに Memory 方向にもリンクが伸びます。実際、歌詞の代表フレーズは「ぎゅっと抱きしめてくれるから」「みんな友達になる」など身体的・日常的なケアを反映しており、感情ネットワークも円環状にまとまっています。これは、「守られることで強くなる」あるいは「甘えが許される環境が力になる」といったテーマが、Hope のような抽象語よりも“抱きしめる／キズナ”の語で可視化されているためです。結果として、ノード中心がやや下方（Empathy・Protection）に移動し、全体が柔らかい色彩に変わっています。
      </p>
      <p>
        2025年「キミとアイドルプリキュア」では、「Light up」「ステージ開演」といったパフォーマンス用語と未来志向語が増え、Future と Hope のリンクが極端に太くなっています。一方で共感系ノードは大きく縮小し、Joy も Future の派生として扱われている印象です。この構造は「観客に光を届ける」という外向きベクトルが強調され、内向きのケアよりも“決意”と“演出”が前面に立っています。2023→2025 の三年間を並べると、①上昇と挑戦を描いた「翼ステージ」、②共感とケアを重視した「抱擁ステージ」、③未来を照らす「ショーステージ」という順で重心が変わり、プリキュアシリーズが毎年テーマを変えていることがネットワーク構造からも確認できます。2026年以降、もし共感系ノードが再度拡大するなら「守りと未来のハイブリッド構造」が見えてくるかもしれず、今回のツールはその兆しを早期に捉えるレーダーにもなります。
      </p>
    </article>
  </section>
`;

const toolbarEl = app.querySelector<HTMLDivElement>('.toolbar-section');
const compareEl = app.querySelector<HTMLDivElement>('.compare-section');
const legendEl = app.querySelector<HTMLDivElement>('.legend-section');

if (!toolbarEl || !compareEl || !legendEl) {
  throw new Error('初期レイアウトの生成に失敗しました');
}

const compare = new EraCompare(compareEl, data);
new Legend(legendEl);

new Toolbar(toolbarEl, {
  onSearch: (term) => compare.setSearchTerm(term),
  getExportTargets: () => compare.getExportTargets(),
});
