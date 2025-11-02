(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))l(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const o of t.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&l(o)}).observe(document,{childList:!0,subtree:!0});function a(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function l(e){if(e.ep)return;e.ep=!0;const t=a(e);fetch(e.href,t)}})();const c=[{slug:"fish",title:"スクミー",description:"小さな魚を操り、障害物を避けながら海底を冒険するスイムアクション。",thumbnail:"/dev-sandbox/assets/fish-placeholder.svg",controls:"WASD / 矢印キーで移動"},{slug:"flappy",title:"フラッピー・フライト",description:"障害物をすり抜けながらリズムよく飛行するフラッピーバードライクなアクション。",thumbnail:"/dev-sandbox/assets/flappy-placeholder.svg",controls:"スペース / クリック / タップで羽ばたく"},{slug:"toilet",title:"トイレ脱出ゲーム",description:"制限時間内に清潔度を高め、神秘の扉を開けるリズムアクション。",thumbnail:"/dev-sandbox/assets/toilet-placeholder.svg",controls:"スペースキー連打"},{slug:"space",title:"スペースシューター",description:"波状攻撃に備え、宇宙を駆けるシューティング。敵を倒してハイスコアを狙おう。",thumbnail:"/dev-sandbox/assets/space-placeholder.svg",controls:"WASD / 矢印キーで移動、スペースでショット"},{slug:"suika",title:"すいかドロップ",description:"落としたフルーツ同士を合体させ、大きなスイカを育てるフィジカルパズル。",thumbnail:"/dev-sandbox/assets/suika-placeholder.svg",controls:"← → / A D 移動、Space / Enter / タップでドロップ"},{slug:"tetris",title:"テトリス",description:"テトリミノを積み上げ、ラインを揃えて消していくクラシックパズル。連続ラインで高得点を狙おう。",thumbnail:"/dev-sandbox/assets/tetris-placeholder.svg",controls:"← → 移動、↑ / X 右回転、Z 左回転、Space ハードドロップ"}],i=document.querySelector("#app");if(!i)throw new Error("#app コンテナが見つかりません");i.innerHTML=`
  <header>
    <h1>Web Games Collection</h1>
    <p>GitHub Pages で公開中のオリジナルゲームたち。好きなゲームを選んで遊んでみよう！</p>
  </header>
  <section class="grid" aria-label="ゲーム一覧"></section>
  <footer>
    <p>&copy; ${new Date().getFullYear()} Web Games Team</p>
  </footer>
`;const n=i.querySelector(".grid");if(!n)throw new Error("ゲーム一覧セクションが見つかりません");c.forEach(s=>{const r=document.createElement("article");r.className="card",r.innerHTML=`
    <img src="${s.thumbnail}" alt="${s.title} のサムネイル" loading="lazy" width="320" height="180" />
    <div class="card-content">
      <h2>${s.title}</h2>
      <p>${s.description}</p>
      <dl>
        <dt>操作方法</dt>
        <dd>${s.controls}</dd>
      </dl>
      <a class="play-button" href="/dev-sandbox/games/${s.slug}/" data-game="${s.slug}">
        プレイする
      </a>
    </div>
  `,n.appendChild(r)});
