(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))l(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const o of t.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&l(o)}).observe(document,{childList:!0,subtree:!0});function n(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function l(e){if(e.ep)return;e.ep=!0;const t=n(e);fetch(e.href,t)}})();const d=[{slug:"flappy",url:"/dev-sandbox/games/flappy/",title:"フラッピー・フライト",description:"障害物をすり抜けながらリズムよく飛行するフラッピーバードライクなアクション。",thumbnail:"/dev-sandbox/assets/flappy-placeholder.svg",controls:"スペース / クリック / タップで羽ばたく"},{slug:"space",url:"/dev-sandbox/games/space/",title:"スペースシューター",description:"波状攻撃に備え、宇宙を駆けるシューティング。敵を倒してハイスコアを狙おう。",thumbnail:"/dev-sandbox/assets/space-placeholder.svg",controls:"WASD / 矢印キーで移動、スペースでショット"},{slug:"emotion",url:"/dev-sandbox/games/emotion/",title:"えがおジャッジ",description:"カメラに向かって表情を切り替え、指定された絵文字と同じ感情を素早く表現しよう。",thumbnail:"/dev-sandbox/assets/emotion-placeholder.svg",controls:"カメラ許可必須・画面の指示に合わせて表情を切り替え"},{slug:"suika",url:"/dev-sandbox/games/suika/",title:"すいかドロップ",description:"落としたフルーツ同士を合体させ、大きなスイカを育てるフィジカルパズル。",thumbnail:"/dev-sandbox/assets/suika-placeholder.svg",controls:"← → / A D 移動、Space / Enter / タップでドロップ"},{slug:"tetris",url:"/dev-sandbox/games/tetris/",title:"テトリス",description:"テトリミノを積み上げ、ラインを揃えて消していくクラシックパズル。連続ラインで高得点を狙おう。",thumbnail:"/dev-sandbox/assets/tetris-placeholder.svg",controls:"← → 移動、↑ / X 右回転、Z 左回転、Space ハードドロップ"},{slug:"gifmaker",url:"/dev-sandbox/tools/gifmaker/",title:"gifメイカー",description:"動画をドラッグ＆ドロップするだけで高画質GIFを手早く作れるブラウザツール。",thumbnail:"/dev-sandbox/assets/gifmaker-placeholder.svg",controls:"動画ファイルをドロップし、設定を調整して GIF を作成"}],i=document.querySelector("#app");if(!i)throw new Error("#app コンテナが見つかりません");i.innerHTML=`
  <header>
    <h1>Web Games & Tools Collection</h1>
    <p>GitHub Pages で公開中のオリジナルゲームやブラウザツール。気になるコンテンツを選んで体験しよう！</p>
  </header>
  <section class="grid" aria-label="ゲーム一覧"></section>
  <footer>
    <p>&copy; ${new Date().getFullYear()} Web Games Team</p>
  </footer>
`;const a=i.querySelector(".grid");if(!a)throw new Error("ゲーム一覧セクションが見つかりません");d.forEach(s=>{const r=document.createElement("article");r.className="card",r.innerHTML=`
    <img src="${s.thumbnail}" alt="${s.title} のサムネイル" loading="lazy" width="320" height="180" />
    <div class="card-content">
      <h2>${s.title}</h2>
      <p>${s.description}</p>
      <dl>
        <dt>操作方法</dt>
        <dd>${s.controls}</dd>
      </dl>
      <a class="play-button" href="${s.url}" data-game="${s.slug}">
        プレイする
      </a>
    </div>
  `,a.appendChild(r)});
