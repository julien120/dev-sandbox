(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&a(i)}).observe(document,{childList:!0,subtree:!0});function e(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function a(r){if(r.ep)return;r.ep=!0;const n=e(r);fetch(r.href,n)}})();let d=null,C=null,O=null;const Y=()=>"/dev-sandbox/tools/styleforge/mecab/",z=async()=>{const s=Y(),e=await import(`${s}libmecab.js`);return(e.default??e)({locateFile:r=>r.endsWith(".wasm")?`${s}libmecab.wasm`:r.endsWith(".data")?`${s}libmecab.data`:r})},H=async()=>{if(!d&&(O||(O=z()),d=await O,C=d.ccall("mecab_new2","number",["string"],[""]),!C))throw new Error("MeCab インスタンスの初期化に失敗しました")};class j{static async waitReady(){await H()}static query(t){if(!d||!C)throw new Error("Mecab not ready");const e=t,a=Math.max(1024,e.length*128),r=d._malloc(a);try{const n=d.ccall("mecab_sparse_tostr3","number",["number","string","number","number","number"],[C,e,d.lengthBytesUTF8(e)+1,r,a]),i=d.UTF8ToString(n);if(!i)return[];const u=i.split(`
`),m=[];return u.forEach(y=>{if(!y.trim())return;const[M,o]=y.split("	");if(!M||!o)return;const l=o.split(",");m.push({word:M,pos:l[0]??"",pos_detail1:l[1]??"",pos_detail2:l[2]??"",pos_detail3:l[3]??"",conjugation1:l[4]??"",conjugation2:l[5]??"",dictionary_form:l[6]??"",reading:l[7]??"",pronunciation:l[8]??""})}),m}finally{d._free(r)}}}const A={polite:{label:"ですます調（フォーマル）",description:"丁寧な「です・ます」調に整えます。"},plain:{label:"である調（論文・解説向け）",description:"常体（だ・である調）の文体に変換します。"},casual:{label:"カジュアル（フレンドリー）",description:"砕けた親しみやすいトーンに寄せます。"},business:{label:"ビジネスメール調",description:"敬語と丁寧語を強め、ビジネス向けの体裁に整えます。"}},w=["business","polite","plain","casual"],K=new Set(["。","！","!","？","?","、","，","．","…","‥","〜","~"]),X=new Set(["。","！","!","？","?","…","‥"]),D=document.querySelector("#app");if(!D)throw new Error("#app が見つかりません");D.innerHTML=`
  <section class="header">
    <h1>文体スタイル変換ファクトリー</h1>
    <p>
      任意の文章 <span aria-hidden="true">a</span> を選んだ文体 <span aria-hidden="true">b</span> に合わせてリライト（結果 <span aria-hidden="true">c</span>）し、
      MeCab による形態素解析の結果も合わせて確認できるブラウザツールです。
    </p>
  </section>

  <div class="status" id="engine-status" data-state="loading" role="status">MeCab エンジンを読み込み中です…</div>

  <section class="panel" aria-label="文体変換フォーム">
    <article class="card">
      <label for="source-text">入力テキスト（a）</label>
      <textarea id="source-text" placeholder="例：本日は新しい機能のご案内をいたします。何かご不明点があればお知らせください。"></textarea>
    </article>
    <article class="card">
      <label for="style-text">目標文体の例文（b）</label>
      <textarea
        id="style-text"
        placeholder="例：平素より大変お世話になっております。明朝までにご確認いただけますと幸いです。何卒よろしくお願いいたします。"
      ></textarea>
      <p class="status" id="style-status" data-state="pending">例文から文体を推定します。</p>
      <button id="convert-button" type="button" disabled>文体変換する</button>
      <p class="status" id="helper-status">MeCab の準備が整うとボタンが有効になります。</p>
    </article>
    <article class="card output-card">
      <label for="output-text">出力結果（c）</label>
      <div id="output-text" class="output-text" aria-live="polite"></div>
    </article>
  </section>

  <section class="analysis" aria-live="polite">
    <div class="analysis-header">
      <h2>形態素解析（MeCab）</h2>
      <span id="analysis-count">トークン 0件</span>
    </div>
    <table>
      <thead>
        <tr>
          <th scope="col">表層</th>
          <th scope="col">品詞</th>
          <th scope="col">詳細</th>
          <th scope="col">基本形</th>
          <th scope="col">読み</th>
        </tr>
      </thead>
      <tbody id="analysis-body">
        <tr>
          <td colspan="5">MeCab の結果がここに表示されます。</td>
        </tr>
      </tbody>
    </table>
  </section>
`;const p=document.querySelector("#engine-status"),S=document.querySelector("#helper-status"),x=document.querySelector("#source-text"),h=document.querySelector("#style-text"),c=document.querySelector("#style-status"),f=document.querySelector("#convert-button"),E=document.querySelector("#output-text"),P=document.querySelector("#analysis-body"),I=document.querySelector("#analysis-count");if(!p||!S||!x||!h||!c||!f||!E||!P||!I)throw new Error("必要なDOM要素の構築に失敗しました");let v=!1,$=!1,T=null;const q=async()=>{if(!(v||$)){T||(T=j.waitReady());try{await T,v=!0,p.dataset.state="ready",p.textContent="MeCab エンジンの準備が整いました。",S.textContent="テキストを入力して文体変換を実行してください。",b()}catch(s){$=!0,p.dataset.state="error",p.textContent="MeCab の読み込みに失敗しました。ページを再読込してください。",S.textContent="エンジンを初期化できないため、変換を実行できません。",console.error(s)}}},b=()=>{const s=x.value.trim().length>0,t=h.value.trim().length>0;f.disabled=!v||$||!s||!t};x.addEventListener("input",()=>{b()});h.addEventListener("input",()=>{b(),W()});f.addEventListener("click",()=>{st()});const _=320,L=s=>{if(I.textContent=`トークン ${s.length}件`,!s.length){P.innerHTML='<tr><td colspan="5">解析結果がありません。文章を入力し「文体変換する」を押してください。</td></tr>';return}const t=s.slice(0,_).map(e=>{const a=[e.posDetail1,e.posDetail2,e.posDetail3].filter(i=>i&&i!=="*").join(" / ")||"—",r=e.reading&&e.reading!=="*"?e.reading:"—",n=e.base&&e.base!=="*"?e.base:e.surface;return`<tr>
      <td>${g(e.surface)}</td>
      <td>${g(e.pos)}</td>
      <td>${g(a)}</td>
      <td>${g(n)}</td>
      <td>${g(r)}</td>
    </tr>`});s.length>_&&t.push(`<tr><td colspan="5">… 以降 ${s.length-_} 件は省略しています。</td></tr>`),P.innerHTML=t.join("")},g=s=>s.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;"),B=s=>s.map(t=>{const e=t.dictionary_form&&t.dictionary_form!=="*"?t.dictionary_form:t.word;return{surface:t.word,base:e,pos:t.pos,posDetail1:t.pos_detail1,posDetail2:t.pos_detail2,posDetail3:t.pos_detail3,conjType:t.conjugation2||"",conjForm:t.conjugation1||"",reading:t.reading||"",pronunciation:t.pronunciation||"",isPunctuation:K.has(t.word)}}),G=s=>{const t=[];let e=[];return s.forEach(a=>{e.push(a),X.has(a.surface)&&(t.push(e),e=[])}),e.length&&t.push(e),t},J=s=>{const t=s.base;if(!t||t==="*")return s.surface;if(t==="する")return"します";if(t==="為る")return"いたします";if(t==="くる"||t==="来る")return"きます";if(s.conjType.includes("一段"))return t.replace(/る$/u,"ます");if(s.conjType.includes("サ変"))return t.replace(/する$/u,"します");const e=t.slice(-1),a={う:"い",く:"き",ぐ:"ぎ",す:"し",つ:"ち",ぬ:"に",ぶ:"び",む:"み",る:"り"};return e in a?`${t.slice(0,-1)}${a[e]}ます`:`${t}ます`},Q=s=>{for(let t=s.length-1;t>=0;t-=1)if(!s[t].isPunctuation&&s[t].pos!=="記号")return t;return-1},N=s=>{const t=s.map(a=>a.surface);s.forEach((a,r)=>{a.pos==="助動詞"&&a.base==="だ"&&(t[r]="です"),a.surface==="である"&&(t[r]="です")});const e=Q(s);if(e>=0){const a=s[e];if(a.pos==="動詞")t[e]=J(a);else if(a.pos==="形容詞"){if(!t[e].endsWith("です")){const r=a.base&&a.base!=="*"?a.base:a.surface;t[e]=r.replace(/い$/u,"いです")}}else if(a.pos.startsWith("名詞")||a.pos==="代名詞"){const r=s.findIndex((i,u)=>u>e&&i.isPunctuation),n=r===-1?s.length:r;t.splice(n,0,"です")}}return t.filter(Boolean).join("")},U=s=>{const t=s.map(e=>e.surface);return s.forEach((e,a)=>{if(e.pos==="助動詞"&&e.base==="です"&&(t[a]="だ"),e.pos==="助動詞"&&e.base==="ます"){const r=a-1;if(r>=0&&s[r].pos==="動詞"){const n=s[r].base&&s[r].base!=="*"?s[r].base:s[r].surface;t[r]=n,t[a]=""}else t[a]="だ"}e.surface==="ございます"&&(t[a]="ある")}),t.filter(Boolean).join("")},V=s=>{let t=U(s);t=t.replace(/でしょう/g,"だろう").replace(/ください/g,"ちょうだい").replace(/ます/g,"る");const e=t.match(/[。！？!?]$/u);if(e){const a=e[0];t=`${t.slice(0,-a.length)}だよ${a}`}else t=`${t}だよ`;return t.replace(/だだよ/g,"だよ")},Z=s=>{let t=N(s);return t=t.replace(/します/g,"いたします").replace(/しますので/g,"いたしますので").replace(/です/g,"でございます").replace(/ください/g,"くださいますようお願いいたします"),t},k=(s,t)=>{const e=G(s);if(!e.length)return"";if(t==="business"){const n=e.map(y=>Z(y)).join("").trimEnd();return`${n.length>0&&!/[。！？!?]$/u.test(n)?`${n}。`:n}
何卒よろしくお願いいたします。`}const a={polite:N,plain:U,casual:V};return e.map(r=>a[t](r)).join("")},tt={business:["お世話になっております","お世話になります","何卒","よろしくお願いいたします","ご確認ください","ご対応ください","ご査収","ご連絡ください","恐縮ですが","恐れ入りますが","敬具"],polite:["です","ます","でした","ください","おります"],plain:["である","だ。","だった","だろう","と思う"],casual:["だよ","だね","かな","ね！","ね？","よ！","笑","w"]},et=(s,t)=>{const e={polite:0,plain:0,casual:0,business:0},a=t.replace(/\s+/g,"");w.forEach(o=>{tt[o].forEach(l=>{a.includes(l)&&(e[o]+=o==="business"?6:3)})});let r=0,n=0,i=0,u=0;if(s.forEach((o,l)=>{o.pos==="動詞"&&(r+=1),o.surface.endsWith("ます")&&(n+=1,e.polite+=2,e.business+=1),o.surface==="です"&&(i+=1,e.polite+=2,e.business+=1),(o.surface==="でございます"||o.surface==="ございます")&&(e.business+=4),(o.surface==="だ"||o.base==="だ")&&(u+=1,e.plain+=2),o.surface==="である"&&(e.plain+=3),(o.surface==="よ"||o.surface==="ね")&&(l===s.length-1||s[l+1].isPunctuation?e.casual+=2:e.casual+=1)}),r>0){const o=n/r;o>.6?(e.polite+=4,e.business+=2):o<.2&&u/r>.1&&(e.plain+=3)}i>n&&i>0&&(e.polite+=1),(new RegExp("\\p{Emoji}","u").test(a)||/[！!？?]{2,}/u.test(a))&&(e.casual+=2);const m=Math.max(...w.map(o=>e[o]));return m<=0?{style:"polite",scores:e}:{style:w.filter(o=>e[o]===m)[0]??"polite",scores:e}},F=(s,t)=>{const e=[...w].sort((a,r)=>t[r]-t[a]).map(a=>`${A[a].label.split("（")[0]}: ${t[a]}`);return`推定: ${A[s].label}（${e.join(" / ")}）`},R=async s=>{const t=s.replace(/\r\n/g,`
`).trim();if(!t)throw new Error("例文が空です");await q();const e=j.query(t),a=B(e);if(!a.length)throw new Error("例文の解析に失敗しました");return{tokens:a,...et(a,t)}},W=async()=>{const s=h.value.trim();if(!s)return c.dataset.state="pending",c.textContent="例文から文体を推定します。",null;try{const{style:t,scores:e}=await R(s);return c.dataset.state="ready",c.textContent=F(t,e),t}catch(t){return c.dataset.state="error",c.textContent="文体の推定に失敗しました。例文を見直してください。",console.error(t),null}},st=async()=>{const s=x.value.trim();if(!s){E.textContent="",L([]),b();return}b(),f.disabled=!0;const t=f.textContent;f.textContent="変換中…";try{if(await q(),!v)return;const e=h.value.trim();if(!e){c.dataset.state="error",c.textContent="目標文体の例文を入力してください。";return}const{style:a,scores:r}=await R(e);c.dataset.state="ready",c.textContent=F(a,r);const n=j.query(s.replace(/\r\n/g,`
`)),i=B(n),u=k(i,a);E.textContent=u||"（出力できる内容がありませんでした）",L(i)}catch(e){p.dataset.state="error",p.textContent="MeCab の解析中にエラーが発生しました。コンソールを確認してください。",S.textContent="もう一度変換するにはページを再読込してください。",$=!0,E.textContent="",L([]),console.error(e)}finally{f.textContent=t,b()}};q();x.value=["平素より大変お世話になっております。","来週の勉強会について、資料の最終確認をお願いいたします。","ご不明点があればお気軽にご連絡ください。"].join(`
`);h.value=["平素より大変お世話になっております。","取り急ぎ、ご確認のほどよろしくお願いいたします。"].join(`
`);b();W();
