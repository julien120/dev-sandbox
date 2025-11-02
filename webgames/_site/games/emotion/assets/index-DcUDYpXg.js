var s4=Object.defineProperty;var o4=(e,t,r)=>t in e?s4(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var ae=(e,t,r)=>o4(e,typeof t!="symbol"?t+"":t,r);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const n of a)if(n.type==="childList")for(const s of n.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function r(a){const n={};return a.integrity&&(n.integrity=a.integrity),a.referrerPolicy&&(n.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?n.credentials="include":a.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(a){if(a.ep)return;a.ep=!0;const n=r(a);fetch(a.href,n)}})();class u4{constructor(){ae(this,"sounds",new Map);ae(this,"muted",!1)}load(t,r){if(this.sounds.has(t))return;const i=new Audio(r);i.preload="auto",this.sounds.set(t,i)}play(t,r={}){const i=this.sounds.get(t);if(!i||this.muted)return;const a=i.cloneNode(!0);a.loop=r.loop??!1,a.volume=r.volume??1,a.play()}setMuted(t){this.muted=t}isMuted(){return this.muted}}const js=1e3/60,l4=5;class d4{constructor(){ae(this,"lastTick",performance.now());ae(this,"accumulated",0);ae(this,"running",!1);ae(this,"subscribers",[]);ae(this,"rafId",0);ae(this,"loop",()=>{if(!this.running)return;const t=performance.now(),r=t-this.lastTick;this.lastTick=t,this.accumulated+=r;let i=0;for(;this.accumulated>=js&&i<l4;)this.accumulated-=js,this.subscribers.forEach(a=>a(js/1e3)),i+=1;this.rafId=requestAnimationFrame(this.loop)})}start(){this.running||(this.running=!0,this.lastTick=performance.now(),this.loop())}stop(){this.running=!1,cancelAnimationFrame(this.rafId)}subscribe(t){return this.subscribers.push(t),()=>{const r=this.subscribers.indexOf(t);r>=0&&this.subscribers.splice(r,1)}}}class h4{constructor(t=window){ae(this,"pressedKeys",new Set);ae(this,"pointerPosition",{x:0,y:0});ae(this,"listeners",[]);ae(this,"keyDownListener",t=>this.handleKeyDown(t));ae(this,"keyUpListener",t=>this.handleKeyUp(t));ae(this,"pointerListener",t=>this.handlePointer(t));ae(this,"handleKeyDown",t=>{this.pressedKeys.add(t.key.toLowerCase()),this.listeners.forEach(r=>r(t))});ae(this,"handleKeyUp",t=>{this.pressedKeys.delete(t.key.toLowerCase()),this.listeners.forEach(r=>r(t))});ae(this,"handlePointer",t=>{this.pointerPosition={x:t.clientX,y:t.clientY},this.listeners.forEach(r=>r(t))});this.target=t}attach(){this.addTargetListeners(this.target)}detach(){this.removeTargetListeners(this.target),this.pressedKeys.clear(),this.listeners=[]}addTargetListeners(t){if(t instanceof Window){t.addEventListener("keydown",this.keyDownListener,{passive:!0}),t.addEventListener("keyup",this.keyUpListener,{passive:!0}),t.addEventListener("pointerdown",this.pointerListener,{passive:!0}),t.addEventListener("pointerup",this.pointerListener,{passive:!0}),t.addEventListener("pointermove",this.pointerListener,{passive:!0});return}t.addEventListener("keydown",this.keyDownListener,{passive:!0}),t.addEventListener("keyup",this.keyUpListener,{passive:!0}),t.addEventListener("pointerdown",this.pointerListener,{passive:!0}),t.addEventListener("pointerup",this.pointerListener,{passive:!0}),t.addEventListener("pointermove",this.pointerListener,{passive:!0})}removeTargetListeners(t){if(t instanceof Window){t.removeEventListener("keydown",this.keyDownListener),t.removeEventListener("keyup",this.keyUpListener),t.removeEventListener("pointerdown",this.pointerListener),t.removeEventListener("pointerup",this.pointerListener),t.removeEventListener("pointermove",this.pointerListener);return}t.removeEventListener("keydown",this.keyDownListener),t.removeEventListener("keyup",this.keyUpListener),t.removeEventListener("pointerdown",this.pointerListener),t.removeEventListener("pointerup",this.pointerListener),t.removeEventListener("pointermove",this.pointerListener)}isKeyPressed(t){return this.pressedKeys.has(t.toLowerCase())}getPointerPosition(){return{...this.pointerPosition}}onInput(t){return this.listeners.push(t),()=>{this.listeners=this.listeners.filter(r=>r!==t)}}}class c4{constructor(t){ae(this,"context");ae(this,"canvas");const r=t.getContext("2d");if(!r)throw new Error("Renderer requires 2D canvas context");this.canvas=t,this.context=r,this.context.imageSmoothingEnabled=!0}clear(t="#000000"){const r=this.context;r.save(),r.fillStyle=t,r.fillRect(0,0,this.canvas.width,this.canvas.height),r.restore()}drawSprite(t,r,i){this.context.drawImage(t,r.x,r.y,i.x,i.y)}drawRect(t,r,i){const a=this.context;a.save(),a.fillStyle=i,a.fillRect(t.x,t.y,r.x,r.y),a.restore()}drawText(t,r,i={}){const a=this.context;a.save(),a.fillStyle=i.color??"#ffffff",a.font=i.font??"16px sans-serif",a.textBaseline="top",a.fillText(t,r.x,r.y),a.restore()}resize(t){this.canvas.width=t.x,this.canvas.height=t.y}}class p4{constructor(t,r={}){ae(this,"audio",new u4);ae(this,"input");ae(this,"renderer");ae(this,"ticker",new d4);ae(this,"currentScene",null);ae(this,"elapsedTime",0);ae(this,"options");ae(this,"update",t=>{var i,a;const r=this.createContext(t);this.options.background?this.renderer.clear(this.options.background):this.renderer.clear(),(i=this.currentScene)==null||i.update(t,r),(a=this.currentScene)==null||a.render(r),this.elapsedTime+=t});this.options=r,this.renderer=new c4(t),this.input=new h4(window),this.input.attach(),this.ticker.subscribe(this.update)}setScene(t){var r,i;(r=this.currentScene)!=null&&r.onExit&&this.currentScene.onExit(this.createContext()),this.currentScene=t,(i=this.currentScene)!=null&&i.onEnter&&this.currentScene.onEnter(this.createContext())}start(){this.elapsedTime=0,this.ticker.start()}stop(){this.ticker.stop()}dispose(){this.stop(),this.input.detach()}createContext(t=0){return{renderer:this.renderer,input:this.input,elapsedTime:this.elapsedTime+t}}}const f4=(e=0,t=0)=>({x:e,y:t}),ri=(e,t,r)=>Math.max(t,Math.min(r,e));class m4{}var mi=typeof self<"u"?self:{};function ii(){throw Error("Invalid UTF8")}function kc(e,t){return t=String.fromCharCode.apply(null,t),e==null?t:e+t}let ta,qs;const g4=typeof TextDecoder<"u";let y4;const _4=typeof TextEncoder<"u";function _2(e){if(_4)e=(y4||(y4=new TextEncoder)).encode(e);else{let r=0;const i=new Uint8Array(3*e.length);for(let a=0;a<e.length;a++){var t=e.charCodeAt(a);if(t<128)i[r++]=t;else{if(t<2048)i[r++]=t>>6|192;else{if(t>=55296&&t<=57343){if(t<=56319&&a<e.length){const n=e.charCodeAt(++a);if(n>=56320&&n<=57343){t=1024*(t-55296)+n-56320+65536,i[r++]=t>>18|240,i[r++]=t>>12&63|128,i[r++]=t>>6&63|128,i[r++]=63&t|128;continue}a--}t=65533}i[r++]=t>>12|224,i[r++]=t>>6&63|128}i[r++]=63&t|128}}e=r===i.length?i:i.subarray(0,r)}return e}var Mu,Aa;e:{for(var Sc=["CLOSURE_FLAGS"],Hs=mi,Ks=0;Ks<Sc.length;Ks++)if((Hs=Hs[Sc[Ks]])==null){Aa=null;break e}Aa=Hs}var Rn,Tc=Aa&&Aa[610401301];Mu=Tc!=null&&Tc;const Ec=mi.navigator;function ru(e){return!!Mu&&!!Rn&&Rn.brands.some(({brand:t})=>t&&t.indexOf(e)!=-1)}function Ut(e){var t;return(t=mi.navigator)&&(t=t.userAgent)||(t=""),t.indexOf(e)!=-1}function Wr(){return!!Mu&&!!Rn&&Rn.brands.length>0}function Xs(){return Wr()?ru("Chromium"):(Ut("Chrome")||Ut("CriOS"))&&!(!Wr()&&Ut("Edge"))||Ut("Silk")}function Bu(e){return Bu[" "](e),e}Rn=Ec&&Ec.userAgentData||null,Bu[" "]=function(){};var w4=!Wr()&&(Ut("Trident")||Ut("MSIE"));!Ut("Android")||Xs(),Xs(),Ut("Safari")&&(Xs()||!Wr()&&Ut("Coast")||!Wr()&&Ut("Opera")||!Wr()&&Ut("Edge")||(Wr()?ru("Microsoft Edge"):Ut("Edg/"))||Wr()&&ru("Opera"));var w2={},xn=null;function b4(e){const t=e.length;let r=3*t/4;r%3?r=Math.floor(r):"=.".indexOf(e[t-1])!=-1&&(r="=.".indexOf(e[t-2])!=-1?r-2:r-1);const i=new Uint8Array(r);let a=0;return function(n,s){function u(h){for(;l<n.length;){const p=n.charAt(l++),m=xn[p];if(m!=null)return m;if(!/^[\s\xa0]*$/.test(p))throw Error("Unknown base64 encoding at char: "+p)}return h}b2();let l=0;for(;;){const h=u(-1),p=u(0),m=u(64),g=u(64);if(g===64&&h===-1)break;s(h<<2|p>>4),m!=64&&(s(p<<4&240|m>>2),g!=64&&s(m<<6&192|g))}}(e,function(n){i[a++]=n}),a!==r?i.subarray(0,a):i}function b2(){if(!xn){xn={};var e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split(""),t=["+/=","+/","-_=","-_.","-_"];for(let r=0;r<5;r++){const i=e.concat(t[r].split(""));w2[r]=i;for(let a=0;a<i.length;a++){const n=i[a];xn[n]===void 0&&(xn[n]=a)}}}}var v2=typeof Uint8Array<"u",$2=!w4&&typeof btoa=="function";function Ic(e){if(!$2){var t;t===void 0&&(t=0),b2(),t=w2[t];var r=Array(Math.floor(e.length/3)),i=t[64]||"";let l=0,h=0;for(;l<e.length-2;l+=3){var a=e[l],n=e[l+1],s=e[l+2],u=t[a>>2];a=t[(3&a)<<4|n>>4],n=t[(15&n)<<2|s>>6],s=t[63&s],r[h++]=u+a+n+s}switch(u=0,s=i,e.length-l){case 2:s=t[(15&(u=e[l+1]))<<2]||i;case 1:e=e[l],r[h]=t[e>>2]+t[(3&e)<<4|u>>4]+s+i}return r.join("")}for(t="",r=0,i=e.length-10240;r<i;)t+=String.fromCharCode.apply(null,e.subarray(r,r+=10240));return t+=String.fromCharCode.apply(null,r?e.subarray(r):e),btoa(t)}const Cc=/[-_.]/g,v4={"-":"+",_:"/",".":"="};function $4(e){return v4[e]||""}function x2(e){if(!$2)return b4(e);Cc.test(e)&&(e=e.replace(Cc,$4)),e=atob(e);const t=new Uint8Array(e.length);for(let r=0;r<e.length;r++)t[r]=e.charCodeAt(r);return t}function Dn(e){return v2&&e!=null&&e instanceof Uint8Array}var Pi={};function gi(){return x4||(x4=new kr(null,Pi))}function Nu(e){k2(Pi);var t=e.g;return(t=t==null||Dn(t)?t:typeof t=="string"?x2(t):null)==null?t:e.g=t}var kr=class{h(){return new Uint8Array(Nu(this)||0)}constructor(t,r){if(k2(r),this.g=t,t!=null&&t.length===0)throw Error("ByteString should be constructed with non-empty values")}};let x4,k4;function k2(e){if(e!==Pi)throw Error("illegal external caller")}function S2(e,t){e.__closure__error__context__984382||(e.__closure__error__context__984382={}),e.__closure__error__context__984382.severity=t}function iu(e){return S2(e=Error(e),"warning"),e}var Xa=typeof Symbol=="function"&&typeof Symbol()=="symbol",S4=new Set;function Ln(e,t,r=!1,i=!1){return e=typeof Symbol=="function"&&typeof Symbol()=="symbol"?i&&Symbol.for&&e?Symbol.for(e):e!=null?Symbol(e):Symbol():t,r&&S4.add(e),e}var T4=Ln("jas",void 0,!0,!0),Ac=Ln(void 0,"0di"),Ys=Ln(void 0,"2ex"),hn=Ln(void 0,"1oa",!0),Di=Ln(void 0,Symbol(),!0);const re=Xa?T4:"Ga",T2={Ga:{value:0,configurable:!0,writable:!0,enumerable:!1}},E2=Object.defineProperties;function Ya(e,t){Xa||re in e||E2(e,T2),e[re]|=t}function Je(e,t){Xa||re in e||E2(e,T2),e[re]=t}function Xi(e){return Ya(e,34),e}function E4(e,t){Je(t,-30975&(0|e))}function nu(e,t){Je(t,-30941&(34|e))}function Pu(){return typeof BigInt=="function"}function _t(e){return Array.prototype.slice.call(e)}var Du,Un={},I2={};function zc(e){return!(!e||typeof e!="object"||e.Ia!==I2)}function Lu(e){return e!==null&&typeof e=="object"&&!Array.isArray(e)&&e.constructor===Object}function Uu(e,t){if(e!=null){if(typeof e=="string")e=e?new kr(e,Pi):gi();else if(e.constructor!==kr)if(Dn(e))e=e.length?new kr(new Uint8Array(e),Pi):gi();else{if(!t)throw Error();e=void 0}}return e}function za(e){return!(!Array.isArray(e)||e.length)&&!!(1&(0|e[re]))}const Oc=[];function Xr(e){if(2&e)throw Error()}Je(Oc,55),Du=Object.freeze(Oc);class Oa{constructor(t,r,i){this.l=0,this.g=t,this.h=r,this.m=i}next(){if(this.l<this.g.length){const t=this.g[this.l++];return{done:!1,value:this.h?this.h.call(this.m,t):t}}return{done:!0,value:void 0}}[Symbol.iterator](){return new Oa(this.g,this.h,this.m)}}function Fu(e){return Di?e[Di]:void 0}var I4=Object.freeze({});function Qa(e){return e.Qa=!0,e}var C4=Qa(e=>typeof e=="number"),Rc=Qa(e=>typeof e=="string"),A4=Qa(e=>typeof e=="boolean"),Za=typeof mi.BigInt=="function"&&typeof mi.BigInt(0)=="bigint",au=Qa(e=>Za?e>=O4&&e<=M4:e[0]==="-"?Mc(e,z4):Mc(e,R4));const z4=Number.MIN_SAFE_INTEGER.toString(),O4=Za?BigInt(Number.MIN_SAFE_INTEGER):void 0,R4=Number.MAX_SAFE_INTEGER.toString(),M4=Za?BigInt(Number.MAX_SAFE_INTEGER):void 0;function Mc(e,t){if(e.length>t.length)return!1;if(e.length<t.length||e===t)return!0;for(let r=0;r<e.length;r++){const i=e[r],a=t[r];if(i>a)return!1;if(i<a)return!0}}const B4=typeof Uint8Array.prototype.slice=="function";let C2,Me=0,He=0;function Bc(e){const t=e>>>0;Me=t,He=(e-t)/4294967296>>>0}function Li(e){if(e<0){Bc(-e);const[t,r]=ju(Me,He);Me=t>>>0,He=r>>>0}else Bc(e)}function Wu(e){const t=C2||(C2=new DataView(new ArrayBuffer(8)));t.setFloat32(0,+e,!0),He=0,Me=t.getUint32(0,!0)}function Vu(e,t){const r=4294967296*t+(e>>>0);return Number.isSafeInteger(r)?r:Mn(e,t)}function Gu(e,t){const r=2147483648&t;return r&&(t=~t>>>0,(e=1+~e>>>0)==0&&(t=t+1>>>0)),typeof(e=Vu(e,t))=="number"?r?-e:e:r?"-"+e:e}function Mn(e,t){if(e>>>=0,(t>>>=0)<=2097151)var r=""+(4294967296*t+e);else Pu()?r=""+(BigInt(t)<<BigInt(32)|BigInt(e)):(e=(16777215&e)+6777216*(r=16777215&(e>>>24|t<<8))+6710656*(t=t>>16&65535),r+=8147497*t,t*=2,e>=1e7&&(r+=e/1e7>>>0,e%=1e7),r>=1e7&&(t+=r/1e7>>>0,r%=1e7),r=t+Nc(r)+Nc(e));return r}function Nc(e){return e=String(e),"0000000".slice(e.length)+e}function Ja(e){if(e.length<16)Li(Number(e));else if(Pu())e=BigInt(e),Me=Number(e&BigInt(4294967295))>>>0,He=Number(e>>BigInt(32)&BigInt(4294967295));else{const t=+(e[0]==="-");He=Me=0;const r=e.length;for(let i=t,a=(r-t)%6+t;a<=r;i=a,a+=6){const n=Number(e.slice(i,a));He*=1e6,Me=1e6*Me+n,Me>=4294967296&&(He+=Math.trunc(Me/4294967296),He>>>=0,Me>>>=0)}if(t){const[i,a]=ju(Me,He);Me=i,He=a}}}function ju(e,t){return t=~t,e?e=1+~e:t+=1,[e,t]}const qu=typeof BigInt=="function"?BigInt.asIntN:void 0,N4=typeof BigInt=="function"?BigInt.asUintN:void 0,Oi=Number.isSafeInteger,es=Number.isFinite,Ra=Math.trunc;function Yr(e){return e==null||typeof e=="number"?e:e==="NaN"||e==="Infinity"||e==="-Infinity"?Number(e):void 0}function A2(e){return e==null||typeof e=="boolean"?e:typeof e=="number"?!!e:void 0}const P4=/^-?([1-9][0-9]*|0)(\.[0-9]+)?$/;function ts(e){switch(typeof e){case"bigint":return!0;case"number":return es(e);case"string":return P4.test(e);default:return!1}}function Yi(e){if(e==null)return e;if(typeof e=="string"&&e)e=+e;else if(typeof e!="number")return;return es(e)?0|e:void 0}function z2(e){if(e==null)return e;if(typeof e=="string"&&e)e=+e;else if(typeof e!="number")return;return es(e)?e>>>0:void 0}function Pc(e){if(e[0]==="-")return!1;const t=e.length;return t<20||t===20&&Number(e.substring(0,6))<184467}function Hu(e){return e=Ra(e),Oi(e)||(Li(e),e=Gu(Me,He)),e}function Ku(e){var t=Ra(Number(e));if(Oi(t))return String(t);if((t=e.indexOf("."))!==-1&&(e=e.substring(0,t)),t=e.length,!(e[0]==="-"?t<20||t===20&&Number(e.substring(0,7))>-922337:t<19||t===19&&Number(e.substring(0,6))<922337))if(Ja(e),e=Me,2147483648&(t=He))if(Pu())e=""+(BigInt(0|t)<<BigInt(32)|BigInt(e>>>0));else{const[r,i]=ju(e,t);e="-"+Mn(r,i)}else e=Mn(e,t);return e}function Ma(e){return e==null?e:typeof e=="bigint"?(au(e)?e=Number(e):(e=qu(64,e),e=au(e)?Number(e):String(e)),e):ts(e)?typeof e=="number"?Hu(e):Ku(e):void 0}function D4(e){if(e==null)return e;var t=typeof e;if(t==="bigint")return String(N4(64,e));if(ts(e)){if(t==="string")return t=Ra(Number(e)),Oi(t)&&t>=0?e=String(t):((t=e.indexOf("."))!==-1&&(e=e.substring(0,t)),Pc(e)||(Ja(e),e=Mn(Me,He))),e;if(t==="number")return(e=Ra(e))>=0&&Oi(e)?e:function(r){if(r<0){Li(r);var i=Mn(Me,He);return r=Number(i),Oi(r)?r:i}return Pc(i=String(r))?i:(Li(r),Vu(Me,He))}(e)}}function O2(e){if(typeof e!="string")throw Error();return e}function Qi(e){if(e!=null&&typeof e!="string")throw Error();return e}function Ui(e){return e==null||typeof e=="string"?e:void 0}function Xu(e,t,r,i){if(e!=null&&typeof e=="object"&&e.W===Un)return e;if(!Array.isArray(e))return r?2&i?((e=t[Ac])||(Xi((e=new t).u),e=t[Ac]=e),t=e):t=new t:t=void 0,t;let a=r=0|e[re];return a===0&&(a|=32&i),a|=2&i,a!==r&&Je(e,a),new t(e)}function L4(e,t,r){if(t)e:{if(!ts(t=e))throw iu("int64");switch(typeof t){case"string":t=Ku(t);break e;case"bigint":if(e=t=qu(64,t),Rc(e)){if(!/^\s*(?:-?[1-9]\d*|0)?\s*$/.test(e))throw Error(String(e))}else if(C4(e)&&!Number.isSafeInteger(e))throw Error(String(e));t=Za?BigInt(t):A4(t)?t?"1":"0":Rc(t)?t.trim()||"0":String(t);break e;default:t=Hu(t)}}else t=Ma(e);return typeof(r=(e=t)==null?r?0:void 0:e)=="string"&&Oi(t=+r)?t:r}const U4={};let F4=function(){try{return Bu(new class extends Map{constructor(){super()}}),!1}catch{return!0}}();class Qs{constructor(){this.g=new Map}get(t){return this.g.get(t)}set(t,r){return this.g.set(t,r),this.size=this.g.size,this}delete(t){return t=this.g.delete(t),this.size=this.g.size,t}clear(){this.g.clear(),this.size=this.g.size}has(t){return this.g.has(t)}entries(){return this.g.entries()}keys(){return this.g.keys()}values(){return this.g.values()}forEach(t,r){return this.g.forEach(t,r)}[Symbol.iterator](){return this.entries()}}const W4=F4?(Object.setPrototypeOf(Qs.prototype,Map.prototype),Object.defineProperties(Qs.prototype,{size:{value:0,configurable:!0,enumerable:!0,writable:!0}}),Qs):class extends Map{constructor(){super()}};function Dc(e){return e}function Zs(e){if(2&e.L)throw Error("Cannot mutate an immutable Map")}var Wt=class extends W4{constructor(t,r,i=Dc,a=Dc){super();let n=0|t[re];n|=64,Je(t,n),this.L=n,this.S=r,this.R=i,this.Y=this.S?V4:a;for(let s=0;s<t.length;s++){const u=t[s],l=i(u[0],!1,!0);let h=u[1];r?h===void 0&&(h=null):h=a(u[1],!1,!0,void 0,void 0,n),super.set(l,h)}}na(t=Lc){if(this.size!==0)return this.X(t)}X(t=Lc){const r=[],i=super.entries();for(var a;!(a=i.next()).done;)(a=a.value)[0]=t(a[0]),a[1]=t(a[1]),r.push(a);return r}clear(){Zs(this),super.clear()}delete(t){return Zs(this),super.delete(this.R(t,!0,!1))}entries(){var t=this.ma();return new Oa(t,G4,this)}keys(){return this.Ha()}values(){var t=this.ma();return new Oa(t,Wt.prototype.get,this)}forEach(t,r){super.forEach((i,a)=>{t.call(r,this.get(a),a,this)})}set(t,r){return Zs(this),(t=this.R(t,!0,!1))==null?this:r==null?(super.delete(t),this):super.set(t,this.Y(r,!0,!0,this.S,!1,this.L))}Na(t){const r=this.R(t[0],!1,!0);t=t[1],t=this.S?t===void 0?null:t:this.Y(t,!1,!0,void 0,!1,this.L),super.set(r,t)}has(t){return super.has(this.R(t,!1,!1))}get(t){t=this.R(t,!1,!1);const r=super.get(t);if(r!==void 0){var i=this.S;return i?((i=this.Y(r,!1,!0,i,this.ra,this.L))!==r&&super.set(t,i),i):r}}ma(){return Array.from(super.keys())}Ha(){return super.keys()}[Symbol.iterator](){return this.entries()}};function V4(e,t,r,i,a,n){return e=Xu(e,i,r,n),a&&(e=is(e)),e}function Lc(e){return e}function G4(e){return[e,this.get(e)]}let j4,R2,q4;function Uc(){return j4||(j4=new Wt(Xi([]),void 0,void 0,void 0,U4))}function Yu(e,t,r,i,a){if(e!=null){if(Array.isArray(e))e=za(e)?void 0:a&&2&(0|e[re])?e:Qu(e,t,r,i!==void 0,a);else if(Lu(e)){const n={};for(let s in e)n[s]=Yu(e[s],t,r,i,a);e=n}else e=t(e,i);return e}}function Qu(e,t,r,i,a){const n=i||r?0|e[re]:0,s=i?!!(32&n):void 0;i=_t(e);for(let u=0;u<i.length;u++)i[u]=Yu(i[u],t,r,s,a);return r&&((e=Fu(e))&&(i[Di]=_t(e)),r(n,i)),i}function H4(e){return Yu(e,M2,void 0,void 0,!1)}function M2(e){return e.W===Un?e.toJSON():e instanceof Wt?e.na(H4):function(t){switch(typeof t){case"number":return isFinite(t)?t:String(t);case"bigint":return au(t)?Number(t):String(t);case"boolean":return t?1:0;case"object":if(t)if(Array.isArray(t)){if(za(t))return}else{if(Dn(t))return Ic(t);if(t instanceof kr){const r=t.g;return r==null?"":typeof r=="string"?r:t.g=Ic(r)}if(t instanceof Wt)return t.na()}}return t}(e)}function B2(e){return Qu(e,M2,void 0,void 0,!1)}function Gr(e,t,r){return e=N2(e,t[0],t[1],r?1:2),t!==R2&&r&&Ya(e,16384),e}function N2(e,t,r,i){if(e==null){var a=96;r?(e=[r],a|=512):e=[],t&&(a=-33521665&a|(1023&t)<<15)}else{if(!Array.isArray(e))throw Error("narr");if(2048&(a=0|e[re]))throw Error("farr");if(64&a)return e;if(i===1||i===2||(a|=64),r&&(a|=512,r!==e[0]))throw Error("mid");e:{if(i=(r=e).length){const n=i-1;if(Lu(r[n])){if((t=n-(512&(a|=256)?0:-1))>=1024)throw Error("pvtlmt");a=-33521665&a|(1023&t)<<15;break e}}if(t){if((t=Math.max(t,i-(512&a?0:-1)))>1024)throw Error("spvt");a=-33521665&a|(1023&t)<<15}}}return Je(e,a),e}function su(e,t,r=nu){if(e!=null){if(v2&&e instanceof Uint8Array)return t?e:new Uint8Array(e);if(Array.isArray(e)){var i=0|e[re];return 2&i?e:(t&&(t=i===0||!!(32&i)&&!(64&i||!(16&i))),t?(Je(e,-12293&(34|i)),e):Qu(e,su,4&i?nu:r,!0,!0))}return e.W===Un?e=2&(i=0|(r=e.u)[re])?e:new e.constructor(rs(r,i,!0)):e instanceof Wt&&!(2&e.L)&&(r=Xi(e.X(su)),e=new Wt(r,e.S,e.R,e.Y)),e}}function rs(e,t,r){const i=r||2&t?nu:E4,a=!!(32&t);return e=function(n,s,u){const l=_t(n);var h=l.length;const p=256&s?l[h-1]:void 0;for(h+=p?-1:0,s=512&s?1:0;s<h;s++)l[s]=u(l[s]);if(p){s=l[s]={};for(const m in p)s[m]=u(p[m])}return(n=Fu(n))&&(l[Di]=_t(n)),l}(e,t,n=>su(n,a,i)),Ya(e,32|(r?2:0)),e}function is(e){const t=e.u,r=0|t[re];return 2&r?new e.constructor(rs(t,r,!1)):e}function Fi(e,t){return Cr(e=e.u,0|e[re],t)}function Cr(e,t,r,i){if(r===-1)return null;var a=r+(512&t?0:-1);const n=e.length-1;return a>=n&&256&t?e[n][r]:i&&256&t&&(t=e[n][r])!=null?(e[a]!=null&&Ys!=null&&((a=(e=k4??(k4={}))[Ys]||0)>=4||(e[Ys]=a+1,S2(e=Error(),"incident"),function(s){mi.setTimeout(()=>{throw s},0)}(e))),t):a<=n?e[a]:void 0}function Ne(e,t,r){const i=e.u;let a=0|i[re];return Xr(a),je(i,a,t,r),e}function je(e,t,r,i){const a=512&t?0:-1,n=r+a;var s=e.length-1;return n>=s&&256&t?(e[s][r]=i,t):n<=s?(e[n]=i,256&t&&r in(e=e[s])&&delete e[r],t):(i!==void 0&&(r>=(s=t>>15&1023||536870912)?i!=null&&(e[s+a]={[r]:i},Je(e,t|=256)):e[n]=i),t)}function $a(e,t){let r=0|(e=e.u)[re];const i=Cr(e,r,t),a=Yr(i);return a!=null&&a!==i&&je(e,r,t,a),a}function P2(e){let t=0|(e=e.u)[re];const r=Cr(e,t,1),i=Uu(r,!0);return i!=null&&i!==r&&je(e,t,1,i),i}function ci(){return I4===void 0?2:4}function pi(e,t,r,i,a){const n=e.u,s=2&(e=0|n[re])?1:i;a=!!a;let u=0|(i=Zu(n,e,t))[re];if(!(4&u)){4&u&&(i=_t(i),u=Sr(u,e),e=je(n,e,t,i));let l=0,h=0;for(;l<i.length;l++){const p=r(i[l]);p!=null&&(i[h++]=p)}h<l&&(i.length=h),u=Ju(u,e),r=-4097&(20|u),u=r&=-8193,Je(i,u),2&u&&Object.freeze(i)}return s===1||s===4&&32&u?xr(u)||(a=u,u|=2,u!==a&&Je(i,u),Object.freeze(i)):(s===2&&xr(u)&&(i=_t(i),u=Sr(u,e),u=jr(u,e,a),Je(i,u),e=je(n,e,t,i)),xr(u)||(t=u,u=jr(u,e,a),u!==t&&Je(i,u))),i}function Zu(e,t,r,i){return e=Cr(e,t,r,i),Array.isArray(e)?e:Du}function Ju(e,t){return e===0&&(e=Sr(e,t)),1|e}function xr(e){return!!(2&e)&&!!(4&e)||!!(2048&e)}function D2(e){e=_t(e);for(let t=0;t<e.length;t++){const r=e[t]=_t(e[t]);Array.isArray(r[1])&&(r[1]=Xi(r[1]))}return e}function ou(e,t,r,i){let a=0|(e=e.u)[re];Xr(a),je(e,a,t,(i==="0"?Number(r)===0:r===i)?void 0:r)}function Zi(e,t,r,i,a){Xr(t);var n=!(!(64&t)&&16384&t);const s=(a=Zu(e,t,r,a))!==Du;if(n||!s){let u=n=s?0|a[re]:0;(!s||2&u||xr(u)||4&u&&!(32&u))&&(a=_t(a),u=Sr(u,t),t=je(e,t,r,a)),u=-13&Ju(u,t),u=jr(i?-17&u:16|u,t,!0),u!==n&&Je(a,u)}return a}function Js(e,t){var r=E0;return tl(el(e=e.u),e,0|e[re],r)===t?t:-1}function el(e){if(Xa)return e[hn]??(e[hn]=new Map);if(hn in e)return e[hn];const t=new Map;return Object.defineProperty(e,hn,{value:t}),t}function L2(e,t,r,i){const a=el(e),n=tl(a,e,t,r);return n!==i&&(n&&(t=je(e,t,n)),a.set(r,i)),t}function tl(e,t,r,i){let a=e.get(i);if(a!=null)return a;a=0;for(let n=0;n<i.length;n++){const s=i[n];Cr(t,r,s)!=null&&(a!==0&&(r=je(t,r,a)),a=s)}return e.set(i,a),a}function rl(e,t,r,i){let a,n=0|e[re];if((i=Cr(e,n,r,i))!=null&&i.W===Un)return(t=is(i))!==i&&je(e,n,r,t),t.u;if(Array.isArray(i)){const s=0|i[re];a=2&s?Gr(rs(i,s,!1),t,!0):64&s?i:Gr(a,t,!0)}else a=Gr(void 0,t,!0);return a!==i&&je(e,n,r,a),a}function U2(e,t,r,i){let a=0|(e=e.u)[re];return(t=Xu(i=Cr(e,a,r,i),t,!1,a))!==i&&t!=null&&je(e,a,r,t),t}function ke(e,t,r,i=!1){if((t=U2(e,t,r,i))==null)return t;if(!(2&(i=0|(e=e.u)[re]))){const a=is(t);a!==t&&je(e,i,r,t=a)}return t}function F2(e,t,r,i,a,n,s){e=e.u;var u=!!(2&t);const l=u?1:a;n=!!n,s&&(s=!u);var h=0|(a=Zu(e,t,i))[re];if(!(u=!!(4&h))){var p=a,m=t;const g=!!(2&(h=Ju(h,t)));g&&(m|=2);let _=!g,w=!0,b=0,k=0;for(;b<p.length;b++){const $=Xu(p[b],r,!1,m);if($ instanceof r){if(!g){const v=!!(2&(0|$.u[re]));_&&(_=!v),w&&(w=v)}p[k++]=$}}k<b&&(p.length=k),h|=4,h=w?16|h:-17&h,Je(p,h=_?8|h:-9&h),g&&Object.freeze(p)}if(s&&!(8&h||!a.length&&(l===1||l===4&&32&h))){for(xr(h)&&(a=_t(a),h=Sr(h,t),t=je(e,t,i,a)),r=a,s=h,p=0;p<r.length;p++)(h=r[p])!==(m=is(h))&&(r[p]=m);s|=8,Je(r,s=r.length?-17&s:16|s),h=s}return l===1||l===4&&32&h?xr(h)||(t=h,(h|=!a.length||16&h&&(!u||32&h)?2:2048)!==t&&Je(a,h),Object.freeze(a)):(l===2&&xr(h)&&(Je(a=_t(a),h=jr(h=Sr(h,t),t,n)),t=je(e,t,i,a)),xr(h)||(i=h,(h=jr(h,t,n))!==i&&Je(a,h))),a}function Er(e,t,r){const i=0|e.u[re];return F2(e,i,t,r,ci(),!1,!(2&i))}function ie(e,t,r,i){return i==null&&(i=void 0),Ne(e,r,i)}function Cn(e,t,r,i){i==null&&(i=void 0);e:{let a=0|(e=e.u)[re];if(Xr(a),i==null){const n=el(e);if(tl(n,e,a,r)!==t)break e;n.set(r,0)}else a=L2(e,a,r,t);je(e,a,t,i)}}function Sr(e,t){return-2049&(e=32|(2&t?2|e:-3&e))}function jr(e,t,r){return 32&t&&r||(e&=-33),e}function Ba(e,t,r,i){const a=0|e.u[re];Xr(a),e=F2(e,a,r,t,2,!0),i=i??new r,e.push(i),e[re]=2&(0|i.u[re])?-9&e[re]:-17&e[re]}function Ft(e,t){return Yi(Fi(e,t))}function Vt(e,t){return Ui(Fi(e,t))}function Ye(e,t){return $a(e,t)??0}function Bn(e,t,r){if(r!=null&&typeof r!="boolean")throw e=typeof r,Error(`Expected boolean but got ${e!="object"?e:r?Array.isArray(r)?"array":e:"null"}: ${r}`);Ne(e,t,r)}function fr(e,t,r){if(r!=null){if(typeof r!="number"||!es(r))throw iu("int32");r|=0}Ne(e,t,r)}function J(e,t,r){if(r!=null&&typeof r!="number")throw Error(`Value of float/double field must be a number, found ${typeof r}: ${r}`);Ne(e,t,r)}function Na(e,t,r){{const s=e.u;let u=0|s[re];if(Xr(u),r==null)je(s,u,t);else{var i=e=0|r[re],a=xr(e),n=a||Object.isFrozen(r);for(a||(e=0),n||(r=_t(r),i=0,e=jr(e=Sr(e,u),u,!0),n=!1),e|=21,a=0;a<r.length;a++){const l=r[a],h=O2(l);Object.is(l,h)||(n&&(r=_t(r),i=0,e=jr(e=Sr(e,u),u,!0),n=!1),r[a]=h)}e!==i&&(n&&(r=_t(r),e=jr(e=Sr(e,u),u,!0)),Je(r,e)),je(s,u,t,r)}}}function ns(e,t,r){Xr(0|e.u[re]),pi(e,t,Ui,2,!0).push(O2(r))}function W2(e,t){return Error(`Invalid wire type: ${e} (at position ${t})`)}function il(){return Error("Failed to read varint, encoding is invalid.")}function V2(e,t){return Error(`Tried to read past the end of the data ${t} > ${e}`)}function nl(e){if(typeof e=="string")return{buffer:x2(e),N:!1};if(Array.isArray(e))return{buffer:new Uint8Array(e),N:!1};if(e.constructor===Uint8Array)return{buffer:e,N:!1};if(e.constructor===ArrayBuffer)return{buffer:new Uint8Array(e),N:!1};if(e.constructor===kr)return{buffer:Nu(e)||new Uint8Array(0),N:!0};if(e instanceof Uint8Array)return{buffer:new Uint8Array(e.buffer,e.byteOffset,e.byteLength),N:!1};throw Error("Type not convertible to a Uint8Array, expected a Uint8Array, an ArrayBuffer, a base64 encoded string, a ByteString or an Array of numbers")}function al(e,t){let r,i=0,a=0,n=0;const s=e.h;let u=e.g;do r=s[u++],i|=(127&r)<<n,n+=7;while(n<32&&128&r);for(n>32&&(a|=(127&r)>>4),n=3;n<32&&128&r;n+=7)r=s[u++],a|=(127&r)<<n;if(fi(e,u),r<128)return t(i>>>0,a>>>0);throw il()}function sl(e){let t=0,r=e.g;const i=r+10,a=e.h;for(;r<i;){const n=a[r++];if(t|=n,(128&n)==0)return fi(e,r),!!(127&t)}throw il()}function qr(e){const t=e.h;let r=e.g,i=t[r++],a=127&i;if(128&i&&(i=t[r++],a|=(127&i)<<7,128&i&&(i=t[r++],a|=(127&i)<<14,128&i&&(i=t[r++],a|=(127&i)<<21,128&i&&(i=t[r++],a|=i<<28,128&i&&128&t[r++]&&128&t[r++]&&128&t[r++]&&128&t[r++]&&128&t[r++])))))throw il();return fi(e,r),a}function Ir(e){return qr(e)>>>0}function uu(e){var t=e.h;const r=e.g,i=t[r],a=t[r+1],n=t[r+2];return t=t[r+3],fi(e,e.g+4),(i<<0|a<<8|n<<16|t<<24)>>>0}function lu(e){var t=uu(e);e=2*(t>>31)+1;const r=t>>>23&255;return t&=8388607,r==255?t?NaN:e*(1/0):r==0?1401298464324817e-60*e*t:e*Math.pow(2,r-150)*(t+8388608)}function K4(e){return qr(e)}function eo(e,t,{ba:r=!1}={}){e.ba=r,t&&(t=nl(t),e.h=t.buffer,e.m=t.N,e.j=0,e.l=e.h.length,e.g=e.j)}function fi(e,t){if(e.g=t,t>e.l)throw V2(e.l,t)}function G2(e,t){if(t<0)throw Error(`Tried to read a negative byte length: ${t}`);const r=e.g,i=r+t;if(i>e.l)throw V2(t,e.l-r);return e.g=i,r}function j2(e,t){if(t==0)return gi();var r=G2(e,t);return e.ba&&e.m?r=e.h.subarray(r,r+t):(e=e.h,r=r===(t=r+t)?new Uint8Array(0):B4?e.slice(r,t):new Uint8Array(e.subarray(r,t))),r.length==0?gi():new kr(r,Pi)}Wt.prototype.toJSON=void 0,Wt.prototype.Ia=I2;var Fc=[];function q2(e){var t=e.g;if(t.g==t.l)return!1;e.l=e.g.g;var r=Ir(e.g);if(t=r>>>3,!((r&=7)>=0&&r<=5))throw W2(r,e.l);if(t<1)throw Error(`Invalid field number: ${t} (at position ${e.l})`);return e.m=t,e.h=r,!0}function xa(e){switch(e.h){case 0:e.h!=0?xa(e):sl(e.g);break;case 1:fi(e=e.g,e.g+8);break;case 2:if(e.h!=2)xa(e);else{var t=Ir(e.g);fi(e=e.g,e.g+t)}break;case 5:fi(e=e.g,e.g+4);break;case 3:for(t=e.m;;){if(!q2(e))throw Error("Unmatched start-group tag: stream EOF");if(e.h==4){if(e.m!=t)throw Error("Unmatched end-group tag");break}xa(e)}break;default:throw W2(e.h,e.l)}}function Fn(e,t,r){const i=e.g.l,a=Ir(e.g),n=e.g.g+a;let s=n-i;if(s<=0&&(e.g.l=n,r(t,e,void 0,void 0,void 0),s=n-e.g.g),s)throw Error(`Message parsing ended unexpectedly. Expected to read ${a} bytes, instead read ${a-s} bytes, either the data ended unexpectedly or the message misreported its own length`);return e.g.g=n,e.g.l=i,t}function ol(e){var t=Ir(e.g),r=G2(e=e.g,t);if(e=e.h,g4){var i,a=e;(i=qs)||(i=qs=new TextDecoder("utf-8",{fatal:!0})),t=r+t,a=r===0&&t===a.length?a:a.subarray(r,t);try{var n=i.decode(a)}catch(u){if(ta===void 0){try{i.decode(new Uint8Array([128]))}catch{}try{i.decode(new Uint8Array([97])),ta=!0}catch{ta=!1}}throw!ta&&(qs=void 0),u}}else{t=(n=r)+t,r=[];let u,l=null;for(;n<t;){var s=e[n++];s<128?r.push(s):s<224?n>=t?ii():(u=e[n++],s<194||(192&u)!=128?(n--,ii()):r.push((31&s)<<6|63&u)):s<240?n>=t-1?ii():(u=e[n++],(192&u)!=128||s===224&&u<160||s===237&&u>=160||(192&(i=e[n++]))!=128?(n--,ii()):r.push((15&s)<<12|(63&u)<<6|63&i)):s<=244?n>=t-2?ii():(u=e[n++],(192&u)!=128||u-144+(s<<28)>>30||(192&(i=e[n++]))!=128||(192&(a=e[n++]))!=128?(n--,ii()):(s=(7&s)<<18|(63&u)<<12|(63&i)<<6|63&a,s-=65536,r.push(55296+(s>>10&1023),56320+(1023&s)))):ii(),r.length>=8192&&(l=kc(l,r),r.length=0)}n=kc(l,r)}return n}function H2(e){const t=Ir(e.g);return j2(e.g,t)}function as(e,t,r){var i=Ir(e.g);for(i=e.g.g+i;e.g.g<i;)r.push(t(e.g))}var ra=[];function X4(e){return e}let Ri;function er(e,t,r){t.g?t.m(e,t.g,t.h,r):t.m(e,t.h,r)}var Q=class{constructor(t,r){this.u=N2(t,r)}toJSON(){const t=!Ri;try{return t&&(Ri=B2),K2(this)}finally{t&&(Ri=void 0)}}l(){var t=zv;return t.g?t.l(this,t.g,t.h,!0):t.l(this,t.h,t.defaultValue,!0)}clone(){const t=this.u;return new this.constructor(rs(t,0|t[re],!1))}N(){return!!(2&(0|this.u[re]))}};function K2(e){var t=e.u;{t=(e=Ri(t))!==t;let h=e.length;if(h){var r=e[h-1],i=Lu(r);i?h--:r=void 0;var a=e;if(i){e:{var n,s=r,u=!1;if(s)for(let p in s)isNaN(+p)?(n??(n={}))[p]=s[p]:(i=s[p],Array.isArray(i)&&(za(i)||zc(i)&&i.size===0)&&(i=null),i==null&&(u=!0),i!=null&&((n??(n={}))[p]=i));if(u||(n=s),n)for(let p in n){u=n;break e}u=null}s=u==null?r!=null:u!==r}for(;h>0&&((n=a[h-1])==null||za(n)||zc(n)&&n.size===0);h--)var l=!0;(a!==e||s||l)&&(t?(l||s||u)&&(a.length=h):a=Array.prototype.slice.call(a,0,h),u&&a.push(u)),l=a}else l=e}return l}function Wc(e){return e?/^\d+$/.test(e)?(Ja(e),new du(Me,He)):null:Y4||(Y4=new du(0,0))}Q.prototype.W=Un,Q.prototype.toString=function(){try{return Ri=X4,K2(this).toString()}finally{Ri=void 0}};var du=class{constructor(t,r){this.h=t>>>0,this.g=r>>>0}};let Y4;function Vc(e){return e?/^-?\d+$/.test(e)?(Ja(e),new hu(Me,He)):null:Q4||(Q4=new hu(0,0))}var hu=class{constructor(t,r){this.h=t>>>0,this.g=r>>>0}};let Q4;function Mi(e,t,r){for(;r>0||t>127;)e.g.push(127&t|128),t=(t>>>7|r<<25)>>>0,r>>>=7;e.g.push(t)}function Ji(e,t){for(;t>127;)e.g.push(127&t|128),t>>>=7;e.g.push(t)}function ss(e,t){if(t>=0)Ji(e,t);else{for(let r=0;r<9;r++)e.g.push(127&t|128),t>>=7;e.g.push(1)}}function Nn(e,t){e.g.push(t>>>0&255),e.g.push(t>>>8&255),e.g.push(t>>>16&255),e.g.push(t>>>24&255)}function Wi(e,t){t.length!==0&&(e.l.push(t),e.h+=t.length)}function At(e,t,r){Ji(e.g,8*t+r)}function ul(e,t){return At(e,t,2),t=e.g.end(),Wi(e,t),t.push(e.h),t}function ll(e,t){var r=t.pop();for(r=e.h+e.g.length()-r;r>127;)t.push(127&r|128),r>>>=7,e.h++;t.push(r),e.h++}function os(e,t,r){At(e,t,2),Ji(e.g,r.length),Wi(e,e.g.end()),Wi(e,r)}function Pa(e,t,r,i){r!=null&&(t=ul(e,t),i(r,e),ll(e,t))}function tr(){const e=class{constructor(){throw Error()}};return Object.setPrototypeOf(e,e.prototype),e}var dl=tr(),X2=tr(),hl=tr(),cl=tr(),Y2=tr(),Q2=tr(),pl=tr(),Z2=tr(),J2=tr(),en=class{constructor(t,r,i){this.g=t,this.h=r,t=dl,this.l=!!t&&i===t||!1}};function us(e,t){return new en(e,t,dl)}function e0(e,t,r,i,a){Pa(e,r,n0(t,i),a)}const Z4=us(function(e,t,r,i,a){return e.h===2&&(Fn(e,rl(t,i,r),a),!0)},e0),J4=us(function(e,t,r,i,a){return e.h===2&&(Fn(e,rl(t,i,r,!0),a),!0)},e0);var ls=Symbol(),fl=Symbol(),Gc=Symbol(),jc=Symbol();let t0,r0;function bi(e,t,r,i){var a=i[e];if(a)return a;(a={}).Pa=i,a.V=function(m){switch(typeof m){case"boolean":return R2||(R2=[0,void 0,!0]);case"number":return m>0?void 0:m===0?q4||(q4=[0,void 0]):[-m,void 0];case"string":return[0,m];case"object":return m}}(i[0]);var n=i[1];let s=1;n&&n.constructor===Object&&(a.ga=n,typeof(n=i[++s])=="function"&&(a.la=!0,t0??(t0=n),r0??(r0=i[s+1]),n=i[s+=2]));const u={};for(;n&&Array.isArray(n)&&n.length&&typeof n[0]=="number"&&n[0]>0;){for(var l=0;l<n.length;l++)u[n[l]]=n;n=i[++s]}for(l=1;n!==void 0;){let m;typeof n=="number"&&(l+=n,n=i[++s]);var h=void 0;if(n instanceof en?m=n:(m=Z4,s--),m==null?void 0:m.l){n=i[++s],h=i;var p=s;typeof n=="function"&&(n=n(),h[p]=n),h=n}for(p=l+1,typeof(n=i[++s])=="number"&&n<0&&(p-=n,n=i[++s]);l<p;l++){const g=u[l];h?r(a,l,m,h,g):t(a,l,m,g)}}return i[e]=a}function i0(e){return Array.isArray(e)?e[0]instanceof en?e:[J4,e]:[e,void 0]}function n0(e,t){return e instanceof Q?e.u:Array.isArray(e)?Gr(e,t,!1):void 0}function ml(e,t,r,i){const a=r.g;e[t]=i?(n,s,u)=>a(n,s,u,i):a}function gl(e,t,r,i,a){const n=r.g;let s,u;e[t]=(l,h,p)=>n(l,h,p,u||(u=bi(fl,ml,gl,i).V),s||(s=yl(i)),a)}function yl(e){let t=e[Gc];if(t!=null)return t;const r=bi(fl,ml,gl,e);return t=r.la?(i,a)=>t0(i,a,r):(i,a)=>{const n=0|i[re];for(;q2(a)&&a.h!=4;){var s=a.m,u=r[s];if(u==null){var l=r.ga;l&&(l=l[s])&&(l=ev(l))!=null&&(u=r[s]=l)}u!=null&&u(a,i,s)||(s=(u=a).l,xa(u),u.fa?u=void 0:(l=u.g.g-s,u.g.g=s,u=j2(u.g,l)),s=i,u&&((l=s[Di])?l.push(u):s[Di]=[u]))}return 16384&n&&Xi(i),!0},e[Gc]=t}function ev(e){const t=(e=i0(e))[0].g;if(e=e[1]){const r=yl(e),i=bi(fl,ml,gl,e).V;return(a,n,s)=>t(a,n,s,i,r)}return t}function ds(e,t,r){e[t]=r.h}function hs(e,t,r,i){let a,n;const s=r.h;e[t]=(u,l,h)=>s(u,l,h,n||(n=bi(ls,ds,hs,i).V),a||(a=a0(i)))}function a0(e){let t=e[jc];if(!t){const r=bi(ls,ds,hs,e);t=(i,a)=>s0(i,a,r),e[jc]=t}return t}function s0(e,t,r){for(var i=0|e[re],a=512&i?0:-1,n=e.length,s=512&i?1:0,u=n+(256&i?-1:0);s<u;s++){const l=e[s];if(l==null)continue;const h=s-a,p=qc(r,h);p&&p(t,l,h)}if(256&i){i=e[n-1];for(const l in i)a=+l,Number.isNaN(a)||(n=i[a])!=null&&(u=qc(r,a))&&u(t,n,a)}if(e=Fu(e))for(Wi(t,t.g.end()),r=0;r<e.length;r++)Wi(t,Nu(e[r])||new Uint8Array(0))}function qc(e,t){var r=e[t];if(r)return r;if((r=e.ga)&&(r=r[t])){var i=(r=i0(r))[0].h;if(r=r[1]){const a=a0(r),n=bi(ls,ds,hs,r).V;r=e.la?r0(n,a):(s,u,l)=>i(s,u,l,n,a)}else r=i;return e[t]=r}}function tn(e,t){if(Array.isArray(t)){var r=0|t[re];if(4&r)return t;for(var i=0,a=0;i<t.length;i++){const n=e(t[i]);n!=null&&(t[a++]=n)}return a<i&&(t.length=a),Je(t,-12289&(5|r)),2&r&&Object.freeze(t),t}}function pt(e,t,r){return new en(e,t,r)}function rn(e,t,r){return new en(e,t,r)}function ft(e,t,r){je(e,0|e[re],t,r)}var tv=us(function(e,t,r,i,a){return e.h===2&&(e=Fn(e,Gr([void 0,void 0],i,!0),a),Xr(i=0|t[re]),(a=Cr(t,i,r))instanceof Wt?2&a.L?((a=a.X()).push(e),je(t,i,r,a)):a.Na(e):Array.isArray(a)?(2&(0|a[re])&&je(t,i,r,a=D2(a)),a.push(e)):je(t,i,r,[e]),!0)},function(e,t,r,i,a){if(t instanceof Wt)t.forEach((n,s)=>{Pa(e,r,Gr([s,n],i,!1),a)});else if(Array.isArray(t))for(let n=0;n<t.length;n++){const s=t[n];Array.isArray(s)&&Pa(e,r,Gr(s,i,!1),a)}});function o0(e,t,r){if(t=function(i){if(i==null)return i;const a=typeof i;if(a==="bigint")return String(qu(64,i));if(ts(i)){if(a==="string")return Ku(i);if(a==="number")return Hu(i)}}(t),t!=null&&(typeof t=="string"&&Vc(t),t!=null))switch(At(e,r,0),typeof t){case"number":e=e.g,Li(t),Mi(e,Me,He);break;case"bigint":r=BigInt.asUintN(64,t),r=new hu(Number(r&BigInt(4294967295)),Number(r>>BigInt(32))),Mi(e.g,r.h,r.g);break;default:r=Vc(t),Mi(e.g,r.h,r.g)}}function u0(e,t,r){(t=Yi(t))!=null&&t!=null&&(At(e,r,0),ss(e.g,t))}function l0(e,t,r){(t=A2(t))!=null&&(At(e,r,0),e.g.g.push(t?1:0))}function d0(e,t,r){(t=Ui(t))!=null&&os(e,r,_2(t))}function h0(e,t,r,i,a){Pa(e,r,n0(t,i),a)}function c0(e,t,r){(t=t==null||typeof t=="string"||Dn(t)||t instanceof kr?t:void 0)!=null&&os(e,r,nl(t).buffer)}function p0(e,t,r){return(e.h===5||e.h===2)&&(t=Zi(t,0|t[re],r,!1,!1),e.h==2?as(e,lu,t):t.push(lu(e.g)),!0)}var vr=pt(function(e,t,r){if(e.h!==1)return!1;var i=e.g;e=uu(i);const a=uu(i);i=2*(a>>31)+1;const n=a>>>20&2047;return e=4294967296*(1048575&a)+e,ft(t,r,n==2047?e?NaN:i*(1/0):n==0?5e-324*i*e:i*Math.pow(2,n-1075)*(e+4503599627370496)),!0},function(e,t,r){(t=Yr(t))!=null&&(At(e,r,1),e=e.g,(r=C2||(C2=new DataView(new ArrayBuffer(8)))).setFloat64(0,+t,!0),Me=r.getUint32(0,!0),He=r.getUint32(4,!0),Nn(e,Me),Nn(e,He))},tr()),et=pt(function(e,t,r){return e.h===5&&(ft(t,r,lu(e.g)),!0)},function(e,t,r){(t=Yr(t))!=null&&(At(e,r,5),e=e.g,Wu(t),Nn(e,Me))},pl),rv=rn(p0,function(e,t,r){if((t=tn(Yr,t))!=null)for(let s=0;s<t.length;s++){var i=e,a=r,n=t[s];n!=null&&(At(i,a,5),i=i.g,Wu(n),Nn(i,Me))}},pl),_l=rn(p0,function(e,t,r){if((t=tn(Yr,t))!=null&&t.length){At(e,r,2),Ji(e.g,4*t.length);for(let i=0;i<t.length;i++)r=e.g,Wu(t[i]),Nn(r,Me)}},pl),Hr=pt(function(e,t,r){return e.h===0&&(ft(t,r,al(e.g,Gu)),!0)},o0,Q2),to=pt(function(e,t,r){return e.h===0&&(ft(t,r,(e=al(e.g,Gu))===0?void 0:e),!0)},o0,Q2),iv=pt(function(e,t,r){return e.h===0&&(ft(t,r,al(e.g,Vu)),!0)},function(e,t,r){if((t=D4(t))!=null&&(typeof t=="string"&&Wc(t),t!=null))switch(At(e,r,0),typeof t){case"number":e=e.g,Li(t),Mi(e,Me,He);break;case"bigint":r=BigInt.asUintN(64,t),r=new du(Number(r&BigInt(4294967295)),Number(r>>BigInt(32))),Mi(e.g,r.h,r.g);break;default:r=Wc(t),Mi(e.g,r.h,r.g)}},tr()),Ke=pt(function(e,t,r){return e.h===0&&(ft(t,r,qr(e.g)),!0)},u0,cl),cs=rn(function(e,t,r){return(e.h===0||e.h===2)&&(t=Zi(t,0|t[re],r,!1,!1),e.h==2?as(e,qr,t):t.push(qr(e.g)),!0)},function(e,t,r){if((t=tn(Yi,t))!=null&&t.length){r=ul(e,r);for(let i=0;i<t.length;i++)ss(e.g,t[i]);ll(e,r)}},cl),Ci=pt(function(e,t,r){return e.h===0&&(ft(t,r,(e=qr(e.g))===0?void 0:e),!0)},u0,cl),Fe=pt(function(e,t,r){return e.h===0&&(ft(t,r,sl(e.g)),!0)},l0,X2),Bi=pt(function(e,t,r){return e.h===0&&(ft(t,r,(e=sl(e.g))===!1?void 0:e),!0)},l0,X2),dt=rn(function(e,t,r){return e.h===2&&(e=ol(e),Zi(t,0|t[re],r,!1).push(e),!0)},function(e,t,r){if((t=tn(Ui,t))!=null)for(let s=0;s<t.length;s++){var i=e,a=r,n=t[s];n!=null&&os(i,a,_2(n))}},hl),Vr=pt(function(e,t,r){return e.h===2&&(ft(t,r,(e=ol(e))===""?void 0:e),!0)},d0,hl),Ae=pt(function(e,t,r){return e.h===2&&(ft(t,r,ol(e)),!0)},d0,hl),it=function(e,t,r=dl){return new en(e,t,r)}(function(e,t,r,i,a){return e.h===2&&(i=Gr(void 0,i,!0),Zi(t,0|t[re],r,!0).push(i),Fn(e,i,a),!0)},function(e,t,r,i,a){if(Array.isArray(t))for(let n=0;n<t.length;n++)h0(e,t[n],r,i,a)}),Oe=us(function(e,t,r,i,a,n){return e.h===2&&(L2(t,0|t[re],n,r),Fn(e,t=rl(t,i,r),a),!0)},h0),f0=pt(function(e,t,r){return e.h===2&&(ft(t,r,H2(e)),!0)},c0,Z2),nv=rn(function(e,t,r){return(e.h===0||e.h===2)&&(t=Zi(t,0|t[re],r,!1,!1),e.h==2?as(e,Ir,t):t.push(Ir(e.g)),!0)},function(e,t,r){if((t=tn(z2,t))!=null)for(let s=0;s<t.length;s++){var i=e,a=r,n=t[s];n!=null&&(At(i,a,0),Ji(i.g,n))}},Y2),av=pt(function(e,t,r){return e.h===0&&(ft(t,r,(e=Ir(e.g))===0?void 0:e),!0)},function(e,t,r){(t=z2(t))!=null&&t!=null&&(At(e,r,0),Ji(e.g,t))},Y2),Gt=pt(function(e,t,r){return e.h===0&&(ft(t,r,qr(e.g)),!0)},function(e,t,r){(t=Yi(t))!=null&&(t=parseInt(t,10),At(e,r,0),ss(e.g,t))},J2);class sv{constructor(t,r){this.h=t,this.g=r,this.l=ke,this.m=ie,this.defaultValue=void 0}}function rr(e,t){return new sv(e,t)}function Qr(e,t){return(r,i)=>{if(ra.length){const n=ra.pop();n.o(i),eo(n.g,r,i),r=n}else r=new class{constructor(n,s){if(Fc.length){const u=Fc.pop();eo(u,n,s),n=u}else n=new class{constructor(u,l){this.h=null,this.m=!1,this.g=this.l=this.j=0,eo(this,u,l)}clear(){this.h=null,this.m=!1,this.g=this.l=this.j=0,this.ba=!1}}(n,s);this.g=n,this.l=this.g.g,this.h=this.m=-1,this.o(s)}o({fa:n=!1}={}){this.fa=n}}(r,i);try{const n=new e,s=n.u;yl(t)(s,r);var a=n}finally{r.g.clear(),r.m=-1,r.h=-1,ra.length<100&&ra.push(r)}return a}}function ps(e){return function(){const t=new class{constructor(){this.l=[],this.h=0,this.g=new class{constructor(){this.g=[]}length(){return this.g.length}end(){const s=this.g;return this.g=[],s}}}};s0(this.u,t,bi(ls,ds,hs,e)),Wi(t,t.g.end());const r=new Uint8Array(t.h),i=t.l,a=i.length;let n=0;for(let s=0;s<a;s++){const u=i[s];r.set(u,n),n+=u.length}return t.l=[r],r}}var Hc=class extends Q{constructor(e){super(e)}},Kc=[0,Vr,pt(function(e,t,r){return e.h===2&&(ft(t,r,(e=H2(e))===gi()?void 0:e),!0)},function(e,t,r){if(t!=null){if(t instanceof Q){const i=t.Ra;return void(i&&(t=i(t),t!=null&&os(e,r,nl(t).buffer)))}if(Array.isArray(t))return}c0(e,t,r)},Z2)];let ro,Xc=globalThis.trustedTypes;function Yc(e){ro===void 0&&(ro=function(){let r=null;if(!Xc)return r;try{const i=a=>a;r=Xc.createPolicy("goog#html",{createHTML:i,createScript:i,createScriptURL:i})}catch{}return r}());var t=ro;return new class{constructor(r){this.g=r}toString(){return this.g+""}}(t?t.createScriptURL(e):e)}function ov(e,...t){if(t.length===0)return Yc(e[0]);let r=e[0];for(let i=0;i<t.length;i++)r+=encodeURIComponent(t[i])+e[i+1];return Yc(r)}var m0=[0,Ke,Gt,Fe,-1,cs,Gt,-1],uv=class extends Q{constructor(e){super(e)}},g0=[0,Fe,Ae,Fe,Gt,-1,rn(function(e,t,r){return(e.h===0||e.h===2)&&(t=Zi(t,0|t[re],r,!1,!1),e.h==2?as(e,K4,t):t.push(qr(e.g)),!0)},function(e,t,r){if((t=tn(Yi,t))!=null&&t.length){r=ul(e,r);for(let i=0;i<t.length;i++)ss(e.g,t[i]);ll(e,r)}},J2),Ae,-1,[0,Fe,-1],Gt,Fe,-1],y0=[0,Ae,-2],Qc=class extends Q{constructor(e){super(e)}},_0=[0],w0=[0,Ke,Fe,1,Fe,-3],Ct=class extends Q{constructor(e){super(e,2)}},tt={};tt[336783863]=[0,Ae,Fe,-1,Ke,[0,[1,2,3,4,5,6,7,8],Oe,_0,Oe,g0,Oe,y0,Oe,w0,Oe,m0,Oe,[0,Ae,-2],Oe,[0,Ae,Gt],Oe,[0,Gt,Ae]],[0,Ae],Fe,[0,[1,3],[2,4],Oe,[0,cs],-1,Oe,[0,dt],-1,it,[0,Ae,-1]],Ae];var Zc=[0,to,-1,Bi,-3,to,cs,Vr,Ci,to,-1,Bi,Ci,Bi,-2,Vr];function zt(e,t){ou(e,2,Qi(t),"")}function Pe(e,t){ns(e,3,t)}function be(e,t){ns(e,4,t)}var ct=class extends Q{constructor(e){super(e,500)}o(e){return ie(this,0,7,e)}},An=[-1,{}],Jc=[0,Ae,1,An],ep=[0,Ae,dt,An];function Ot(e,t){Ba(e,1,ct,t)}function Le(e,t){ns(e,10,t)}function Se(e,t){ns(e,15,t)}var bt=class extends Q{constructor(e){super(e,500)}o(e){return ie(this,0,1001,e)}},b0=[-500,it,[-500,Vr,-1,dt,-3,[-2,tt,Fe],it,Kc,Ci,-1,Jc,ep,it,[0,Vr,Bi],Vr,Zc,Ci,dt,987,dt],4,it,[-500,Ae,-1,[-1,{}],998,Ae],it,[-500,Ae,dt,-1,[-2,{},Fe],997,dt,-1],Ci,it,[-500,Ae,dt,An,998,dt],dt,Ci,Jc,ep,it,[0,Vr,-1,An],dt,-2,Zc,Vr,-1,Bi,[0,Bi,av],978,An,it,Kc];bt.prototype.g=ps(b0);var lv=Qr(bt,b0),dv=class extends Q{constructor(e){super(e)}},v0=class extends Q{constructor(t){super(t)}g(){return Er(this,dv,1)}},$0=[0,it,[0,Ke,et,Ae,-1]],fs=Qr(v0,$0),hv=class extends Q{constructor(t){super(t)}},cv=class extends Q{constructor(t){super(t)}},io=class extends Q{constructor(t){super(t)}h(){return ke(this,hv,2)}g(){return Er(this,cv,5)}},x0=Qr(class extends Q{constructor(e){super(e)}},[0,dt,cs,_l,[0,Gt,[0,Ke,-3],[0,et,-3],[0,Ke,-1,[0,it,[0,Ke,-2]]],it,[0,et,-1,Ae,et]],Ae,-1,Hr,it,[0,Ke,et],dt,Hr]),k0=class extends Q{constructor(t){super(t)}},Ni=Qr(class extends Q{constructor(e){super(e)}},[0,it,[0,et,-4]]),S0=class extends Q{constructor(t){super(t)}},Wn=Qr(class extends Q{constructor(e){super(e)}},[0,it,[0,et,-4]]),pv=class extends Q{constructor(t){super(t)}},fv=[0,Ke,-1,_l,Gt],T0=class extends Q{constructor(t){super(t)}};T0.prototype.g=ps([0,et,-4,Hr]);var mv=class extends Q{constructor(t){super(t)}},gv=Qr(class extends Q{constructor(e){super(e)}},[0,it,[0,1,Ke,Ae,$0],Hr]),tp=class extends Q{constructor(t){super(t)}},yv=class extends Q{constructor(t){super(t)}oa(){const t=P2(this);return t??gi()}},_v=class extends Q{constructor(t){super(t)}},E0=[1,2],wv=Qr(class extends Q{constructor(e){super(e)}},[0,it,[0,E0,Oe,[0,_l],Oe,[0,f0],Ke,Ae],Hr]),wl=class extends Q{constructor(t){super(t)}},I0=[0,Ae,Ke,et,dt,-1],rp=class extends Q{constructor(t){super(t)}},bv=[0,Fe,-1],ip=class extends Q{constructor(t){super(t)}},ka=[1,2,3,4,5],Da=class extends Q{constructor(t){super(t)}g(){return P2(this)!=null}h(){return Vt(this,2)!=null}},Ve=class extends Q{constructor(t){super(t)}g(){return A2(Fi(this,2))??!1}},C0=[0,f0,Ae,[0,Ke,Hr,-1],[0,iv,Hr]],Qe=[0,C0,Fe,[0,ka,Oe,w0,Oe,g0,Oe,m0,Oe,_0,Oe,y0],Gt],ms=class extends Q{constructor(t){super(t)}},bl=[0,Qe,et,-1,Ke],vv=rr(502141897,ms);tt[502141897]=bl;var $v=Qr(class extends Q{constructor(e){super(e)}},[0,[0,Gt,-1,rv,nv],fv]),A0=class extends Q{constructor(t){super(t)}},z0=class extends Q{constructor(t){super(t)}},vl=[0,Qe,et,[0,Qe],Fe],O0=[0,Qe,bl,vl,et,[0,[0,C0]]],xv=rr(508968150,z0);tt[508968150]=O0,tt[508968149]=vl;var R0=class extends Q{constructor(t){super(t)}},kv=rr(513916220,R0);tt[513916220]=[0,Qe,O0,Ke];var Si=class extends Q{constructor(t){super(t)}h(){return ke(this,wl,2)}g(){Ne(this,2)}},M0=[0,Qe,I0];tt[478825465]=M0;var Sv=class extends Q{constructor(t){super(t)}},B0=class extends Q{constructor(t){super(t)}},$l=class extends Q{constructor(t){super(t)}},xl=class extends Q{constructor(t){super(t)}},N0=class extends Q{constructor(t){super(t)}},np=[0,Qe,[0,Qe],M0,-1],P0=[0,Qe,et,Ke],kl=[0,Qe,et],D0=[0,Qe,P0,kl,et],Tv=rr(479097054,N0);tt[479097054]=[0,Qe,D0,np],tt[463370452]=np,tt[464864288]=P0;var Ev=rr(462713202,xl);tt[462713202]=D0,tt[474472470]=kl;var Iv=class extends Q{constructor(t){super(t)}},L0=class extends Q{constructor(t){super(t)}},U0=class extends Q{constructor(t){super(t)}},F0=class extends Q{constructor(t){super(t)}},Sl=[0,Qe,et,-1,Ke],cu=[0,Qe,et,Fe];F0.prototype.g=ps([0,Qe,kl,[0,Qe],bl,vl,Sl,cu]);var W0=class extends Q{constructor(t){super(t)}},Cv=rr(456383383,W0);tt[456383383]=[0,Qe,I0];var V0=class extends Q{constructor(t){super(t)}},Av=rr(476348187,V0);tt[476348187]=[0,Qe,bv];var G0=class extends Q{constructor(t){super(t)}},ap=class extends Q{constructor(t){super(t)}},j0=[0,Gt,-1],zv=rr(458105876,class extends Q{constructor(e){super(e)}g(){var e=this.u;const t=0|e[re],r=2&t;return e=function(i,a,n){var s=ap;const u=2&a;let l=!1;if(n==null){if(u)return Uc();n=[]}else if(n.constructor===Wt){if(!(2&n.L)||u)return n;n=n.X()}else Array.isArray(n)?l=!!(2&(0|n[re])):n=[];if(u){if(!n.length)return Uc();l||(l=!0,Xi(n))}else l&&(l=!1,n=D2(n));return l||(64&(0|n[re])?n[re]&=-33:32&a&&Ya(n,32)),je(i,a,2,s=new Wt(n,s,L4,void 0)),s}(e,t,Cr(e,t,2)),!r&&ap&&(e.ra=!0),e}});tt[458105876]=[0,j0,tv,[!0,Hr,[0,Ae,-1,dt]]];var Tl=class extends Q{constructor(t){super(t)}},q0=rr(458105758,Tl);tt[458105758]=[0,Qe,Ae,j0];var H0=class extends Q{constructor(t){super(t)}},Ov=rr(443442058,H0);tt[443442058]=[0,Qe,Ae,Ke,et,dt,-1,Fe,et],tt[514774813]=Sl;var K0=class extends Q{constructor(t){super(t)}},Rv=rr(516587230,K0);function pu(e,t){return t=t?t.clone():new wl,e.displayNamesLocale!==void 0?Ne(t,1,Qi(e.displayNamesLocale)):e.displayNamesLocale===void 0&&Ne(t,1),e.maxResults!==void 0?fr(t,2,e.maxResults):"maxResults"in e&&Ne(t,2),e.scoreThreshold!==void 0?J(t,3,e.scoreThreshold):"scoreThreshold"in e&&Ne(t,3),e.categoryAllowlist!==void 0?Na(t,4,e.categoryAllowlist):"categoryAllowlist"in e&&Ne(t,4),e.categoryDenylist!==void 0?Na(t,5,e.categoryDenylist):"categoryDenylist"in e&&Ne(t,5),t}function El(e,t=-1,r=""){return{categories:e.map(i=>({index:Ft(i,1)??0??-1,score:Ye(i,2)??0,categoryName:Vt(i,3)??""??"",displayName:Vt(i,4)??""??""})),headIndex:t,headName:r}}function X0(e){var s,u;var t=pi(e,3,Yr,ci()),r=pi(e,2,Yi,ci()),i=pi(e,1,Ui,ci()),a=pi(e,9,Ui,ci());const n={categories:[],keypoints:[]};for(let l=0;l<t.length;l++)n.categories.push({score:t[l],index:r[l]??-1,categoryName:i[l]??"",displayName:a[l]??""});if((t=(s=ke(e,io,4))==null?void 0:s.h())&&(n.boundingBox={originX:Ft(t,1)??0,originY:Ft(t,2)??0,width:Ft(t,3)??0,height:Ft(t,4)??0,angle:0}),(u=ke(e,io,4))==null?void 0:u.g().length)for(const l of ke(e,io,4).g())n.keypoints.push({x:$a(l,1)??0,y:$a(l,2)??0,score:$a(l,4)??0,label:Vt(l,3)??""});return n}function gs(e){const t=[];for(const r of Er(e,S0,1))t.push({x:Ye(r,1)??0,y:Ye(r,2)??0,z:Ye(r,3)??0,visibility:Ye(r,4)??0});return t}function zn(e){const t=[];for(const r of Er(e,k0,1))t.push({x:Ye(r,1)??0,y:Ye(r,2)??0,z:Ye(r,3)??0,visibility:Ye(r,4)??0});return t}function sp(e){return Array.from(e,t=>t>127?t-256:t)}function op(e,t){if(e.length!==t.length)throw Error(`Cannot compute cosine similarity between embeddings of different sizes (${e.length} vs. ${t.length}).`);let r=0,i=0,a=0;for(let n=0;n<e.length;n++)r+=e[n]*t[n],i+=e[n]*e[n],a+=t[n]*t[n];if(i<=0||a<=0)throw Error("Cannot compute cosine similarity on embedding with 0 norm.");return r/Math.sqrt(i*a)}let ia;tt[516587230]=[0,Qe,Sl,cu,et],tt[518928384]=cu;const Mv=new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,10,1,8,0,65,0,253,15,253,98,11]);async function Y0(){if(ia===void 0)try{await WebAssembly.instantiate(Mv),ia=!0}catch{ia=!1}return ia}async function cn(e,t=ov``){const r=await Y0()?"wasm_internal":"wasm_nosimd_internal";return{wasmLoaderPath:`${t}/${e}_${r}.js`,wasmBinaryPath:`${t}/${e}_${r}.wasm`}}var ui=class{};function Q0(){var e=navigator;return typeof OffscreenCanvas<"u"&&(!function(t=navigator){return(t=t.userAgent).includes("Safari")&&!t.includes("Chrome")}(e)||!!((e=e.userAgent.match(/Version\/([\d]+).*Safari/))&&e.length>=1&&Number(e[1])>=17))}async function up(e){if(typeof importScripts!="function"){const t=document.createElement("script");return t.src=e.toString(),t.crossOrigin="anonymous",new Promise((r,i)=>{t.addEventListener("load",()=>{r()},!1),t.addEventListener("error",a=>{i(a)},!1),document.body.appendChild(t)})}importScripts(e.toString())}function Z0(e){return e.videoWidth!==void 0?[e.videoWidth,e.videoHeight]:e.naturalWidth!==void 0?[e.naturalWidth,e.naturalHeight]:e.displayWidth!==void 0?[e.displayWidth,e.displayHeight]:[e.width,e.height]}function te(e,t,r){e.m||console.error("No wasm multistream support detected: ensure dependency inclusion of :gl_graph_runner_internal_multi_input target"),r(t=e.i.stringToNewUTF8(t)),e.i._free(t)}function lp(e,t,r){if(!e.i.canvas)throw Error("No OpenGL canvas configured.");if(r?e.i._bindTextureToStream(r):e.i._bindTextureToCanvas(),!(r=e.i.canvas.getContext("webgl2")||e.i.canvas.getContext("webgl")))throw Error("Failed to obtain WebGL context from the provided canvas. `getContext()` should only be invoked with `webgl` or `webgl2`.");e.i.gpuOriginForWebTexturesIsBottomLeft&&r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,!0),r.texImage2D(r.TEXTURE_2D,0,r.RGBA,r.RGBA,r.UNSIGNED_BYTE,t),e.i.gpuOriginForWebTexturesIsBottomLeft&&r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,!1);const[i,a]=Z0(t);return!e.l||i===e.i.canvas.width&&a===e.i.canvas.height||(e.i.canvas.width=i,e.i.canvas.height=a),[i,a]}function dp(e,t,r){e.m||console.error("No wasm multistream support detected: ensure dependency inclusion of :gl_graph_runner_internal_multi_input target");const i=new Uint32Array(t.length);for(let a=0;a<t.length;a++)i[a]=e.i.stringToNewUTF8(t[a]);t=e.i._malloc(4*i.length),e.i.HEAPU32.set(i,t>>2),r(t);for(const a of i)e.i._free(a);e.i._free(t)}function ur(e,t,r){e.i.simpleListeners=e.i.simpleListeners||{},e.i.simpleListeners[t]=r}function Pr(e,t,r){let i=[];e.i.simpleListeners=e.i.simpleListeners||{},e.i.simpleListeners[t]=(a,n,s)=>{n?(r(i,s),i=[]):i.push(a)}}ui.forVisionTasks=function(e){return cn("vision",e)},ui.forTextTasks=function(e){return cn("text",e)},ui.forGenAiExperimentalTasks=function(e){return cn("genai_experimental",e)},ui.forGenAiTasks=function(e){return cn("genai",e)},ui.forAudioTasks=function(e){return cn("audio",e)},ui.isSimdSupported=function(){return Y0()};async function Bv(e,t,r,i){return e=await(async(a,n,s,u,l)=>{if(n&&await up(n),!self.ModuleFactory||s&&(await up(s),!self.ModuleFactory))throw Error("ModuleFactory not set.");return self.Module&&l&&((n=self.Module).locateFile=l.locateFile,l.mainScriptUrlOrBlob&&(n.mainScriptUrlOrBlob=l.mainScriptUrlOrBlob)),l=await self.ModuleFactory(self.Module||l),self.ModuleFactory=self.Module=void 0,new a(l,u)})(e,r.wasmLoaderPath,r.assetLoaderPath,t,{locateFile:a=>a.endsWith(".wasm")?r.wasmBinaryPath.toString():r.assetBinaryPath&&a.endsWith(".data")?r.assetBinaryPath.toString():a}),await e.o(i),e}function no(e,t){const r=ke(e.baseOptions,Da,1)||new Da;typeof t=="string"?(Ne(r,2,Qi(t)),Ne(r,1)):t instanceof Uint8Array&&(Ne(r,1,Uu(t,!1)),Ne(r,2)),ie(e.baseOptions,0,1,r)}function hp(e){try{const t=e.G.length;if(t===1)throw Error(e.G[0].message);if(t>1)throw Error("Encountered multiple errors: "+e.G.map(r=>r.message).join(", "))}finally{e.G=[]}}function H(e,t){e.B=Math.max(e.B,t)}function ys(e,t){e.A=new ct,zt(e.A,"PassThroughCalculator"),Pe(e.A,"free_memory"),be(e.A,"free_memory_unused_out"),Le(t,"free_memory"),Ot(t,e.A)}function Vi(e,t){Pe(e.A,t),be(e.A,t+"_unused_out")}function _s(e){e.g.addBoolToStream(!0,"free_memory",e.B)}var Sa=class{constructor(t){this.g=t,this.G=[],this.B=0,this.g.setAutoRenderToScreen(!1)}l(t,r=!0){var i,a,n,s,u,l;if(r){const h=t.baseOptions||{};if((i=t.baseOptions)!=null&&i.modelAssetBuffer&&((a=t.baseOptions)!=null&&a.modelAssetPath))throw Error("Cannot set both baseOptions.modelAssetPath and baseOptions.modelAssetBuffer");if(!((n=ke(this.baseOptions,Da,1))!=null&&n.g()||(s=ke(this.baseOptions,Da,1))!=null&&s.h()||(u=t.baseOptions)!=null&&u.modelAssetBuffer||(l=t.baseOptions)!=null&&l.modelAssetPath))throw Error("Either baseOptions.modelAssetPath or baseOptions.modelAssetBuffer must be set");if(function(p,m){let g=ke(p.baseOptions,ip,3);if(!g){var _=g=new ip,w=new Qc;Cn(_,4,ka,w)}"delegate"in m&&(m.delegate==="GPU"?(m=g,_=new uv,Cn(m,2,ka,_)):(m=g,_=new Qc,Cn(m,4,ka,_))),ie(p.baseOptions,0,3,g)}(this,h),h.modelAssetPath)return fetch(h.modelAssetPath.toString()).then(p=>{if(p.ok)return p.arrayBuffer();throw Error(`Failed to fetch model: ${h.modelAssetPath} (${p.status})`)}).then(p=>{try{this.g.i.FS_unlink("/model.dat")}catch{}this.g.i.FS_createDataFile("/","model.dat",new Uint8Array(p),!0,!1,!1),no(this,"/model.dat"),this.m(),this.I()});if(h.modelAssetBuffer instanceof Uint8Array)no(this,h.modelAssetBuffer);else if(h.modelAssetBuffer)return async function(p){const m=[];for(var g=0;;){const{done:_,value:w}=await p.read();if(_)break;m.push(w),g+=w.length}if(m.length===0)return new Uint8Array(0);if(m.length===1)return m[0];p=new Uint8Array(g),g=0;for(const _ of m)p.set(_,g),g+=_.length;return p}(h.modelAssetBuffer).then(p=>{no(this,p),this.m(),this.I()})}return this.m(),this.I(),Promise.resolve()}I(){}da(){let t;if(this.g.da(r=>{t=lv(r)}),!t)throw Error("Failed to retrieve CalculatorGraphConfig");return t}setGraph(t,r){this.g.attachErrorListener((i,a)=>{this.G.push(Error(a))}),this.g.La(),this.g.setGraph(t,r),this.A=void 0,hp(this)}finishProcessing(){this.g.finishProcessing(),hp(this)}close(){this.A=void 0,this.g.closeGraph()}};function Tr(e,t){if(!e)throw Error(`Unable to obtain required WebGL resource: ${t}`);return e}Sa.prototype.close=Sa.prototype.close,function(e,t){e=e.split(".");var r,i=mi;for((e[0]in i)||i.execScript===void 0||i.execScript("var "+e[0]);e.length&&(r=e.shift());)e.length||t===void 0?i=i[r]&&i[r]!==Object.prototype[r]?i[r]:i[r]={}:i[r]=t}("TaskRunner",Sa);class Nv{constructor(t,r,i,a){this.g=t,this.h=r,this.m=i,this.l=a}bind(){this.g.bindVertexArray(this.h)}close(){this.g.deleteVertexArray(this.h),this.g.deleteBuffer(this.m),this.g.deleteBuffer(this.l)}}function cp(e,t,r){const i=e.g;if(r=Tr(i.createShader(r),"Failed to create WebGL shader"),i.shaderSource(r,t),i.compileShader(r),!i.getShaderParameter(r,i.COMPILE_STATUS))throw Error(`Could not compile WebGL shader: ${i.getShaderInfoLog(r)}`);return i.attachShader(e.h,r),r}function pp(e,t){const r=e.g,i=Tr(r.createVertexArray(),"Failed to create vertex array");r.bindVertexArray(i);const a=Tr(r.createBuffer(),"Failed to create buffer");r.bindBuffer(r.ARRAY_BUFFER,a),r.enableVertexAttribArray(e.O),r.vertexAttribPointer(e.O,2,r.FLOAT,!1,0,0),r.bufferData(r.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),r.STATIC_DRAW);const n=Tr(r.createBuffer(),"Failed to create buffer");return r.bindBuffer(r.ARRAY_BUFFER,n),r.enableVertexAttribArray(e.I),r.vertexAttribPointer(e.I,2,r.FLOAT,!1,0,0),r.bufferData(r.ARRAY_BUFFER,new Float32Array(t?[0,1,0,0,1,0,1,1]:[0,0,0,1,1,1,1,0]),r.STATIC_DRAW),r.bindBuffer(r.ARRAY_BUFFER,null),r.bindVertexArray(null),new Nv(r,i,a,n)}function Il(e,t){if(e.g){if(t!==e.g)throw Error("Cannot change GL context once initialized")}else e.g=t}function Cl(e,t,r,i){return Il(e,t),e.h||(e.m(),e.C()),r?(e.s||(e.s=pp(e,!0)),r=e.s):(e.v||(e.v=pp(e,!1)),r=e.v),t.useProgram(e.h),r.bind(),e.l(),e=i(),r.g.bindVertexArray(null),e}function ws(e,t,r){return Il(e,t),e=Tr(t.createTexture(),"Failed to create texture"),t.bindTexture(t.TEXTURE_2D,e),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,r??t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,r??t.LINEAR),t.bindTexture(t.TEXTURE_2D,null),e}function bs(e,t,r){Il(e,t),e.A||(e.A=Tr(t.createFramebuffer(),"Failed to create framebuffe.")),t.bindFramebuffer(t.FRAMEBUFFER,e.A),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,r,0)}function Al(e){var t;(t=e.g)==null||t.bindFramebuffer(e.g.FRAMEBUFFER,null)}var zl=class{G(){return`
  precision mediump float;
  varying vec2 vTex;
  uniform sampler2D inputTexture;
  void main() {
    gl_FragColor = texture2D(inputTexture, vTex);
  }
 `}m(){const e=this.g;if(this.h=Tr(e.createProgram(),"Failed to create WebGL program"),this.aa=cp(this,`
  attribute vec2 aVertex;
  attribute vec2 aTex;
  varying vec2 vTex;
  void main(void) {
    gl_Position = vec4(aVertex, 0.0, 1.0);
    vTex = aTex;
  }`,e.VERTEX_SHADER),this.Z=cp(this,this.G(),e.FRAGMENT_SHADER),e.linkProgram(this.h),!e.getProgramParameter(this.h,e.LINK_STATUS))throw Error(`Error during program linking: ${e.getProgramInfoLog(this.h)}`);this.O=e.getAttribLocation(this.h,"aVertex"),this.I=e.getAttribLocation(this.h,"aTex")}C(){}l(){}close(){if(this.h){const e=this.g;e.deleteProgram(this.h),e.deleteShader(this.aa),e.deleteShader(this.Z)}this.A&&this.g.deleteFramebuffer(this.A),this.v&&this.v.close(),this.s&&this.s.close()}};function $r(e,t){switch(t){case 0:return e.g.find(r=>r instanceof Uint8Array);case 1:return e.g.find(r=>r instanceof Float32Array);case 2:return e.g.find(r=>typeof WebGLTexture<"u"&&r instanceof WebGLTexture);default:throw Error(`Type is not supported: ${t}`)}}function fu(e){var t=$r(e,1);if(!t){if(t=$r(e,0))t=new Float32Array(t).map(i=>i/255);else{t=new Float32Array(e.width*e.height);const i=Gi(e);var r=Ol(e);if(bs(r,i,J0(e)),"iPad Simulator;iPhone Simulator;iPod Simulator;iPad;iPhone;iPod".split(";").includes(navigator.platform)||navigator.userAgent.includes("Mac")&&"document"in self&&"ontouchend"in self.document){r=new Float32Array(e.width*e.height*4),i.readPixels(0,0,e.width,e.height,i.RGBA,i.FLOAT,r);for(let a=0,n=0;a<t.length;++a,n+=4)t[a]=r[n]}else i.readPixels(0,0,e.width,e.height,i.RED,i.FLOAT,t)}e.g.push(t)}return t}function J0(e){let t=$r(e,2);if(!t){const r=Gi(e);t=tg(e);const i=fu(e),a=eg(e);r.texImage2D(r.TEXTURE_2D,0,a,e.width,e.height,0,r.RED,r.FLOAT,i),mu(e)}return t}function Gi(e){if(!e.canvas)throw Error("Conversion to different image formats require that a canvas is passed when initializing the image.");return e.h||(e.h=Tr(e.canvas.getContext("webgl2"),"You cannot use a canvas that is already bound to a different type of rendering context.")),e.h}function eg(e){if(e=Gi(e),!na)if(e.getExtension("EXT_color_buffer_float")&&e.getExtension("OES_texture_float_linear")&&e.getExtension("EXT_float_blend"))na=e.R32F;else{if(!e.getExtension("EXT_color_buffer_half_float"))throw Error("GPU does not fully support 4-channel float32 or float16 formats");na=e.R16F}return na}function Ol(e){return e.l||(e.l=new zl),e.l}function tg(e){const t=Gi(e);t.viewport(0,0,e.width,e.height),t.activeTexture(t.TEXTURE0);let r=$r(e,2);return r||(r=ws(Ol(e),t,e.m?t.LINEAR:t.NEAREST),e.g.push(r),e.j=!0),t.bindTexture(t.TEXTURE_2D,r),r}function mu(e){e.h.bindTexture(e.h.TEXTURE_2D,null)}var na,at=class{constructor(e,t,r,i,a,n,s){this.g=e,this.m=t,this.j=r,this.canvas=i,this.l=a,this.width=n,this.height=s,this.j&&--fp===0&&console.error("You seem to be creating MPMask instances without invoking .close(). This leaks resources.")}Fa(){return!!$r(this,0)}ja(){return!!$r(this,1)}P(){return!!$r(this,2)}ia(){return(t=$r(e=this,0))||(t=fu(e),t=new Uint8Array(t.map(r=>255*r)),e.g.push(t)),t;var e,t}ha(){return fu(this)}M(){return J0(this)}clone(){const e=[];for(const t of this.g){let r;if(t instanceof Uint8Array)r=new Uint8Array(t);else if(t instanceof Float32Array)r=new Float32Array(t);else{if(!(t instanceof WebGLTexture))throw Error(`Type is not supported: ${t}`);{const i=Gi(this),a=Ol(this);i.activeTexture(i.TEXTURE1),r=ws(a,i,this.m?i.LINEAR:i.NEAREST),i.bindTexture(i.TEXTURE_2D,r);const n=eg(this);i.texImage2D(i.TEXTURE_2D,0,n,this.width,this.height,0,i.RED,i.FLOAT,null),i.bindTexture(i.TEXTURE_2D,null),bs(a,i,r),Cl(a,i,!1,()=>{tg(this),i.clearColor(0,0,0,0),i.clear(i.COLOR_BUFFER_BIT),i.drawArrays(i.TRIANGLE_FAN,0,4),mu(this)}),Al(a),mu(this)}}e.push(r)}return new at(e,this.m,this.P(),this.canvas,this.l,this.width,this.height)}close(){this.j&&Gi(this).deleteTexture($r(this,2)),fp=-1}};at.prototype.close=at.prototype.close,at.prototype.clone=at.prototype.clone,at.prototype.getAsWebGLTexture=at.prototype.M,at.prototype.getAsFloat32Array=at.prototype.ha,at.prototype.getAsUint8Array=at.prototype.ia,at.prototype.hasWebGLTexture=at.prototype.P,at.prototype.hasFloat32Array=at.prototype.ja,at.prototype.hasUint8Array=at.prototype.Fa;var fp=250;function pr(e,t){switch(t){case 0:return e.g.find(r=>r instanceof ImageData);case 1:return e.g.find(r=>typeof ImageBitmap<"u"&&r instanceof ImageBitmap);case 2:return e.g.find(r=>typeof WebGLTexture<"u"&&r instanceof WebGLTexture);default:throw Error(`Type is not supported: ${t}`)}}function rg(e){var t=pr(e,0);if(!t){t=ji(e);const r=vs(e),i=new Uint8Array(e.width*e.height*4);bs(r,t,Ta(e)),t.readPixels(0,0,e.width,e.height,t.RGBA,t.UNSIGNED_BYTE,i),Al(r),t=new ImageData(new Uint8ClampedArray(i.buffer),e.width,e.height),e.g.push(t)}return t}function Ta(e){let t=pr(e,2);if(!t){const r=ji(e);t=Ea(e);const i=pr(e,1)||rg(e);r.texImage2D(r.TEXTURE_2D,0,r.RGBA,r.RGBA,r.UNSIGNED_BYTE,i),kn(e)}return t}function ji(e){if(!e.canvas)throw Error("Conversion to different image formats require that a canvas is passed when initializing the image.");return e.h||(e.h=Tr(e.canvas.getContext("webgl2"),"You cannot use a canvas that is already bound to a different type of rendering context.")),e.h}function vs(e){return e.l||(e.l=new zl),e.l}function Ea(e){const t=ji(e);t.viewport(0,0,e.width,e.height),t.activeTexture(t.TEXTURE0);let r=pr(e,2);return r||(r=ws(vs(e),t),e.g.push(r),e.m=!0),t.bindTexture(t.TEXTURE_2D,r),r}function kn(e){e.h.bindTexture(e.h.TEXTURE_2D,null)}function mp(e){const t=ji(e);return Cl(vs(e),t,!0,()=>function(r,i){const a=r.canvas;if(a.width===r.width&&a.height===r.height)return i();const n=a.width,s=a.height;return a.width=r.width,a.height=r.height,r=i(),a.width=n,a.height=s,r}(e,()=>{if(t.bindFramebuffer(t.FRAMEBUFFER,null),t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT),t.drawArrays(t.TRIANGLE_FAN,0,4),!(e.canvas instanceof OffscreenCanvas))throw Error("Conversion to ImageBitmap requires that the MediaPipe Tasks is initialized with an OffscreenCanvas");return e.canvas.transferToImageBitmap()}))}var st=class{constructor(e,t,r,i,a,n,s){this.g=e,this.j=t,this.m=r,this.canvas=i,this.l=a,this.width=n,this.height=s,(this.j||this.m)&&--gp===0&&console.error("You seem to be creating MPImage instances without invoking .close(). This leaks resources.")}Ea(){return!!pr(this,0)}ka(){return!!pr(this,1)}P(){return!!pr(this,2)}Ca(){return rg(this)}Ba(){var e=pr(this,1);return e||(Ta(this),Ea(this),e=mp(this),kn(this),this.g.push(e),this.j=!0),e}M(){return Ta(this)}clone(){const e=[];for(const t of this.g){let r;if(t instanceof ImageData)r=new ImageData(t.data,this.width,this.height);else if(t instanceof WebGLTexture){const i=ji(this),a=vs(this);i.activeTexture(i.TEXTURE1),r=ws(a,i),i.bindTexture(i.TEXTURE_2D,r),i.texImage2D(i.TEXTURE_2D,0,i.RGBA,this.width,this.height,0,i.RGBA,i.UNSIGNED_BYTE,null),i.bindTexture(i.TEXTURE_2D,null),bs(a,i,r),Cl(a,i,!1,()=>{Ea(this),i.clearColor(0,0,0,0),i.clear(i.COLOR_BUFFER_BIT),i.drawArrays(i.TRIANGLE_FAN,0,4),kn(this)}),Al(a),kn(this)}else{if(!(t instanceof ImageBitmap))throw Error(`Type is not supported: ${t}`);Ta(this),Ea(this),r=mp(this),kn(this)}e.push(r)}return new st(e,this.ka(),this.P(),this.canvas,this.l,this.width,this.height)}close(){this.j&&pr(this,1).close(),this.m&&ji(this).deleteTexture(pr(this,2)),gp=-1}};st.prototype.close=st.prototype.close,st.prototype.clone=st.prototype.clone,st.prototype.getAsWebGLTexture=st.prototype.M,st.prototype.getAsImageBitmap=st.prototype.Ba,st.prototype.getAsImageData=st.prototype.Ca,st.prototype.hasWebGLTexture=st.prototype.P,st.prototype.hasImageBitmap=st.prototype.ka,st.prototype.hasImageData=st.prototype.Ea;var gp=250;function ir(...e){return e.map(([t,r])=>({start:t,end:r}))}const Pv=function(e){return class extends e{La(){this.i._registerModelResourcesGraphService()}}}((yp=class{constructor(e,t){this.l=!0,this.i=e,this.g=null,this.h=0,this.m=typeof this.i._addIntToInputStream=="function",t!==void 0?this.i.canvas=t:Q0()?this.i.canvas=new OffscreenCanvas(1,1):(console.warn("OffscreenCanvas not supported and GraphRunner constructor glCanvas parameter is undefined. Creating backup canvas."),this.i.canvas=document.createElement("canvas"))}async initializeGraph(e){const t=await(await fetch(e)).arrayBuffer();e=!(e.endsWith(".pbtxt")||e.endsWith(".textproto")),this.setGraph(new Uint8Array(t),e)}setGraphFromString(e){this.setGraph(new TextEncoder().encode(e),!1)}setGraph(e,t){const r=e.length,i=this.i._malloc(r);this.i.HEAPU8.set(e,i),t?this.i._changeBinaryGraph(r,i):this.i._changeTextGraph(r,i),this.i._free(i)}configureAudio(e,t,r,i,a){this.i._configureAudio||console.warn('Attempting to use configureAudio without support for input audio. Is build dep ":gl_graph_runner_audio" missing?'),te(this,i||"input_audio",n=>{te(this,a=a||"audio_header",s=>{this.i._configureAudio(n,s,e,t??0,r)})})}setAutoResizeCanvas(e){this.l=e}setAutoRenderToScreen(e){this.i._setAutoRenderToScreen(e)}setGpuBufferVerticalFlip(e){this.i.gpuOriginForWebTexturesIsBottomLeft=e}da(e){ur(this,"__graph_config__",t=>{e(t)}),te(this,"__graph_config__",t=>{this.i._getGraphConfig(t,void 0)}),delete this.i.simpleListeners.__graph_config__}attachErrorListener(e){this.i.errorListener=e}attachEmptyPacketListener(e,t){this.i.emptyPacketListeners=this.i.emptyPacketListeners||{},this.i.emptyPacketListeners[e]=t}addAudioToStream(e,t,r){this.addAudioToStreamWithShape(e,0,0,t,r)}addAudioToStreamWithShape(e,t,r,i,a){const n=4*e.length;this.h!==n&&(this.g&&this.i._free(this.g),this.g=this.i._malloc(n),this.h=n),this.i.HEAPF32.set(e,this.g/4),te(this,i,s=>{this.i._addAudioToInputStream(this.g,t,r,s,a)})}addGpuBufferToStream(e,t,r){te(this,t,i=>{const[a,n]=lp(this,e,i);this.i._addBoundTextureToStream(i,a,n,r)})}addBoolToStream(e,t,r){te(this,t,i=>{this.i._addBoolToInputStream(e,i,r)})}addDoubleToStream(e,t,r){te(this,t,i=>{this.i._addDoubleToInputStream(e,i,r)})}addFloatToStream(e,t,r){te(this,t,i=>{this.i._addFloatToInputStream(e,i,r)})}addIntToStream(e,t,r){te(this,t,i=>{this.i._addIntToInputStream(e,i,r)})}addUintToStream(e,t,r){te(this,t,i=>{this.i._addUintToInputStream(e,i,r)})}addStringToStream(e,t,r){te(this,t,i=>{te(this,e,a=>{this.i._addStringToInputStream(a,i,r)})})}addStringRecordToStream(e,t,r){te(this,t,i=>{dp(this,Object.keys(e),a=>{dp(this,Object.values(e),n=>{this.i._addFlatHashMapToInputStream(a,n,Object.keys(e).length,i,r)})})})}addProtoToStream(e,t,r,i){te(this,r,a=>{te(this,t,n=>{const s=this.i._malloc(e.length);this.i.HEAPU8.set(e,s),this.i._addProtoToInputStream(s,e.length,n,a,i),this.i._free(s)})})}addEmptyPacketToStream(e,t){te(this,e,r=>{this.i._addEmptyPacketToInputStream(r,t)})}addBoolVectorToStream(e,t,r){te(this,t,i=>{const a=this.i._allocateBoolVector(e.length);if(!a)throw Error("Unable to allocate new bool vector on heap.");for(const n of e)this.i._addBoolVectorEntry(a,n);this.i._addBoolVectorToInputStream(a,i,r)})}addDoubleVectorToStream(e,t,r){te(this,t,i=>{const a=this.i._allocateDoubleVector(e.length);if(!a)throw Error("Unable to allocate new double vector on heap.");for(const n of e)this.i._addDoubleVectorEntry(a,n);this.i._addDoubleVectorToInputStream(a,i,r)})}addFloatVectorToStream(e,t,r){te(this,t,i=>{const a=this.i._allocateFloatVector(e.length);if(!a)throw Error("Unable to allocate new float vector on heap.");for(const n of e)this.i._addFloatVectorEntry(a,n);this.i._addFloatVectorToInputStream(a,i,r)})}addIntVectorToStream(e,t,r){te(this,t,i=>{const a=this.i._allocateIntVector(e.length);if(!a)throw Error("Unable to allocate new int vector on heap.");for(const n of e)this.i._addIntVectorEntry(a,n);this.i._addIntVectorToInputStream(a,i,r)})}addUintVectorToStream(e,t,r){te(this,t,i=>{const a=this.i._allocateUintVector(e.length);if(!a)throw Error("Unable to allocate new unsigned int vector on heap.");for(const n of e)this.i._addUintVectorEntry(a,n);this.i._addUintVectorToInputStream(a,i,r)})}addStringVectorToStream(e,t,r){te(this,t,i=>{const a=this.i._allocateStringVector(e.length);if(!a)throw Error("Unable to allocate new string vector on heap.");for(const n of e)te(this,n,s=>{this.i._addStringVectorEntry(a,s)});this.i._addStringVectorToInputStream(a,i,r)})}addBoolToInputSidePacket(e,t){te(this,t,r=>{this.i._addBoolToInputSidePacket(e,r)})}addDoubleToInputSidePacket(e,t){te(this,t,r=>{this.i._addDoubleToInputSidePacket(e,r)})}addFloatToInputSidePacket(e,t){te(this,t,r=>{this.i._addFloatToInputSidePacket(e,r)})}addIntToInputSidePacket(e,t){te(this,t,r=>{this.i._addIntToInputSidePacket(e,r)})}addUintToInputSidePacket(e,t){te(this,t,r=>{this.i._addUintToInputSidePacket(e,r)})}addStringToInputSidePacket(e,t){te(this,t,r=>{te(this,e,i=>{this.i._addStringToInputSidePacket(i,r)})})}addProtoToInputSidePacket(e,t,r){te(this,r,i=>{te(this,t,a=>{const n=this.i._malloc(e.length);this.i.HEAPU8.set(e,n),this.i._addProtoToInputSidePacket(n,e.length,a,i),this.i._free(n)})})}addBoolVectorToInputSidePacket(e,t){te(this,t,r=>{const i=this.i._allocateBoolVector(e.length);if(!i)throw Error("Unable to allocate new bool vector on heap.");for(const a of e)this.i._addBoolVectorEntry(i,a);this.i._addBoolVectorToInputSidePacket(i,r)})}addDoubleVectorToInputSidePacket(e,t){te(this,t,r=>{const i=this.i._allocateDoubleVector(e.length);if(!i)throw Error("Unable to allocate new double vector on heap.");for(const a of e)this.i._addDoubleVectorEntry(i,a);this.i._addDoubleVectorToInputSidePacket(i,r)})}addFloatVectorToInputSidePacket(e,t){te(this,t,r=>{const i=this.i._allocateFloatVector(e.length);if(!i)throw Error("Unable to allocate new float vector on heap.");for(const a of e)this.i._addFloatVectorEntry(i,a);this.i._addFloatVectorToInputSidePacket(i,r)})}addIntVectorToInputSidePacket(e,t){te(this,t,r=>{const i=this.i._allocateIntVector(e.length);if(!i)throw Error("Unable to allocate new int vector on heap.");for(const a of e)this.i._addIntVectorEntry(i,a);this.i._addIntVectorToInputSidePacket(i,r)})}addUintVectorToInputSidePacket(e,t){te(this,t,r=>{const i=this.i._allocateUintVector(e.length);if(!i)throw Error("Unable to allocate new unsigned int vector on heap.");for(const a of e)this.i._addUintVectorEntry(i,a);this.i._addUintVectorToInputSidePacket(i,r)})}addStringVectorToInputSidePacket(e,t){te(this,t,r=>{const i=this.i._allocateStringVector(e.length);if(!i)throw Error("Unable to allocate new string vector on heap.");for(const a of e)te(this,a,n=>{this.i._addStringVectorEntry(i,n)});this.i._addStringVectorToInputSidePacket(i,r)})}attachBoolListener(e,t){ur(this,e,t),te(this,e,r=>{this.i._attachBoolListener(r)})}attachBoolVectorListener(e,t){Pr(this,e,t),te(this,e,r=>{this.i._attachBoolVectorListener(r)})}attachIntListener(e,t){ur(this,e,t),te(this,e,r=>{this.i._attachIntListener(r)})}attachIntVectorListener(e,t){Pr(this,e,t),te(this,e,r=>{this.i._attachIntVectorListener(r)})}attachUintListener(e,t){ur(this,e,t),te(this,e,r=>{this.i._attachUintListener(r)})}attachUintVectorListener(e,t){Pr(this,e,t),te(this,e,r=>{this.i._attachUintVectorListener(r)})}attachDoubleListener(e,t){ur(this,e,t),te(this,e,r=>{this.i._attachDoubleListener(r)})}attachDoubleVectorListener(e,t){Pr(this,e,t),te(this,e,r=>{this.i._attachDoubleVectorListener(r)})}attachFloatListener(e,t){ur(this,e,t),te(this,e,r=>{this.i._attachFloatListener(r)})}attachFloatVectorListener(e,t){Pr(this,e,t),te(this,e,r=>{this.i._attachFloatVectorListener(r)})}attachStringListener(e,t){ur(this,e,t),te(this,e,r=>{this.i._attachStringListener(r)})}attachStringVectorListener(e,t){Pr(this,e,t),te(this,e,r=>{this.i._attachStringVectorListener(r)})}attachProtoListener(e,t,r){ur(this,e,t),te(this,e,i=>{this.i._attachProtoListener(i,r||!1)})}attachProtoVectorListener(e,t,r){Pr(this,e,t),te(this,e,i=>{this.i._attachProtoVectorListener(i,r||!1)})}attachAudioListener(e,t,r){this.i._attachAudioListener||console.warn('Attempting to use attachAudioListener without support for output audio. Is build dep ":gl_graph_runner_audio_out" missing?'),ur(this,e,(i,a)=>{i=new Float32Array(i.buffer,i.byteOffset,i.length/4),t(i,a)}),te(this,e,i=>{this.i._attachAudioListener(i,r||!1)})}finishProcessing(){this.i._waitUntilIdle()}closeGraph(){this.i._closeGraph(),this.i.simpleListeners=void 0,this.i.emptyPacketListeners=void 0}},class extends yp{get ea(){return this.i}qa(e,t,r){te(this,t,i=>{const[a,n]=lp(this,e,i);this.ea._addBoundTextureAsImageToStream(i,a,n,r)})}U(e,t){ur(this,e,t),te(this,e,r=>{this.ea._attachImageListener(r)})}ca(e,t){Pr(this,e,t),te(this,e,r=>{this.ea._attachImageVectorListener(r)})}}));var yp,jt=class extends Pv{};async function we(e,t,r){return async function(i,a,n,s){return Bv(i,a,n,s)}(e,r.canvas??(Q0()?void 0:document.createElement("canvas")),t,r)}function ig(e,t,r,i){if(e.T){const n=new T0;if(r!=null&&r.regionOfInterest){if(!e.pa)throw Error("This task doesn't support region-of-interest.");var a=r.regionOfInterest;if(a.left>=a.right||a.top>=a.bottom)throw Error("Expected RectF with left < right and top < bottom.");if(a.left<0||a.top<0||a.right>1||a.bottom>1)throw Error("Expected RectF values to be in [0,1].");J(n,1,(a.left+a.right)/2),J(n,2,(a.top+a.bottom)/2),J(n,4,a.right-a.left),J(n,3,a.bottom-a.top)}else J(n,1,.5),J(n,2,.5),J(n,4,1),J(n,3,1);if(r!=null&&r.rotationDegrees){if((r==null?void 0:r.rotationDegrees)%90!=0)throw Error("Expected rotation to be a multiple of 90°.");if(J(n,5,-Math.PI*r.rotationDegrees/180),(r==null?void 0:r.rotationDegrees)%180!=0){const[s,u]=Z0(t);r=Ye(n,3)*u/s,a=Ye(n,4)*s/u,J(n,4,r),J(n,3,a)}}e.g.addProtoToStream(n.g(),"mediapipe.NormalizedRect",e.T,i)}e.g.qa(t,e.aa,i??performance.now()),e.finishProcessing()}function qt(e,t,r){var i;if((i=e.baseOptions)!=null&&i.g())throw Error("Task is not initialized with image mode. 'runningMode' must be set to 'IMAGE'.");ig(e,t,r,e.B+1)}function gr(e,t,r,i){var a;if(!((a=e.baseOptions)!=null&&a.g()))throw Error("Task is not initialized with video mode. 'runningMode' must be set to 'VIDEO'.");ig(e,t,r,i)}function qi(e,t,r,i){var a=t.data;const n=t.width,s=n*(t=t.height);if((a instanceof Uint8Array||a instanceof Float32Array)&&a.length!==s)throw Error("Unsupported channel count: "+a.length/s);return e=new at([a],r,!1,e.g.i.canvas,e.O,n,t),i?e.clone():e}var wt=class extends Sa{constructor(t,r,i,a){super(t),this.g=t,this.aa=r,this.T=i,this.pa=a,this.O=new zl}l(t,r=!0){if("runningMode"in t&&Bn(this.baseOptions,2,!!t.runningMode&&t.runningMode!=="IMAGE"),t.canvas!==void 0&&this.g.i.canvas!==t.canvas)throw Error("You must create a new task to reset the canvas.");return super.l(t,r)}close(){this.O.close(),super.close()}};wt.prototype.close=wt.prototype.close;var Nt=class extends wt{constructor(e,t){super(new jt(e,t),"image_in","norm_rect_in",!1),this.j={detections:[]},ie(e=this.h=new ms,0,1,t=new Ve),J(this.h,2,.5),J(this.h,3,.3)}get baseOptions(){return ke(this.h,Ve,1)}set baseOptions(e){ie(this.h,0,1,e)}o(e){return"minDetectionConfidence"in e&&J(this.h,2,e.minDetectionConfidence??.5),"minSuppressionThreshold"in e&&J(this.h,3,e.minSuppressionThreshold??.3),this.l(e)}D(e,t){return this.j={detections:[]},qt(this,e,t),this.j}F(e,t,r){return this.j={detections:[]},gr(this,e,r,t),this.j}m(){var e=new bt;Le(e,"image_in"),Le(e,"norm_rect_in"),Se(e,"detections");const t=new Ct;er(t,vv,this.h);const r=new ct;zt(r,"mediapipe.tasks.vision.face_detector.FaceDetectorGraph"),Pe(r,"IMAGE:image_in"),Pe(r,"NORM_RECT:norm_rect_in"),be(r,"DETECTIONS:detections"),r.o(t),Ot(e,r),this.g.attachProtoVectorListener("detections",(i,a)=>{for(const n of i)i=x0(n),this.j.detections.push(X0(i));H(this,a)}),this.g.attachEmptyPacketListener("detections",i=>{H(this,i)}),e=e.g(),this.setGraph(new Uint8Array(e),!0)}};Nt.prototype.detectForVideo=Nt.prototype.F,Nt.prototype.detect=Nt.prototype.D,Nt.prototype.setOptions=Nt.prototype.o,Nt.createFromModelPath=async function(e,t){return we(Nt,e,{baseOptions:{modelAssetPath:t}})},Nt.createFromModelBuffer=function(e,t){return we(Nt,e,{baseOptions:{modelAssetBuffer:t}})},Nt.createFromOptions=function(e,t){return we(Nt,e,t)};var Rl=ir([61,146],[146,91],[91,181],[181,84],[84,17],[17,314],[314,405],[405,321],[321,375],[375,291],[61,185],[185,40],[40,39],[39,37],[37,0],[0,267],[267,269],[269,270],[270,409],[409,291],[78,95],[95,88],[88,178],[178,87],[87,14],[14,317],[317,402],[402,318],[318,324],[324,308],[78,191],[191,80],[80,81],[81,82],[82,13],[13,312],[312,311],[311,310],[310,415],[415,308]),Ml=ir([263,249],[249,390],[390,373],[373,374],[374,380],[380,381],[381,382],[382,362],[263,466],[466,388],[388,387],[387,386],[386,385],[385,384],[384,398],[398,362]),Bl=ir([276,283],[283,282],[282,295],[295,285],[300,293],[293,334],[334,296],[296,336]),ng=ir([474,475],[475,476],[476,477],[477,474]),Nl=ir([33,7],[7,163],[163,144],[144,145],[145,153],[153,154],[154,155],[155,133],[33,246],[246,161],[161,160],[160,159],[159,158],[158,157],[157,173],[173,133]),Pl=ir([46,53],[53,52],[52,65],[65,55],[70,63],[63,105],[105,66],[66,107]),ag=ir([469,470],[470,471],[471,472],[472,469]),Dl=ir([10,338],[338,297],[297,332],[332,284],[284,251],[251,389],[389,356],[356,454],[454,323],[323,361],[361,288],[288,397],[397,365],[365,379],[379,378],[378,400],[400,377],[377,152],[152,148],[148,176],[176,149],[149,150],[150,136],[136,172],[172,58],[58,132],[132,93],[93,234],[234,127],[127,162],[162,21],[21,54],[54,103],[103,67],[67,109],[109,10]),sg=[...Rl,...Ml,...Bl,...Nl,...Pl,...Dl],og=ir([127,34],[34,139],[139,127],[11,0],[0,37],[37,11],[232,231],[231,120],[120,232],[72,37],[37,39],[39,72],[128,121],[121,47],[47,128],[232,121],[121,128],[128,232],[104,69],[69,67],[67,104],[175,171],[171,148],[148,175],[118,50],[50,101],[101,118],[73,39],[39,40],[40,73],[9,151],[151,108],[108,9],[48,115],[115,131],[131,48],[194,204],[204,211],[211,194],[74,40],[40,185],[185,74],[80,42],[42,183],[183,80],[40,92],[92,186],[186,40],[230,229],[229,118],[118,230],[202,212],[212,214],[214,202],[83,18],[18,17],[17,83],[76,61],[61,146],[146,76],[160,29],[29,30],[30,160],[56,157],[157,173],[173,56],[106,204],[204,194],[194,106],[135,214],[214,192],[192,135],[203,165],[165,98],[98,203],[21,71],[71,68],[68,21],[51,45],[45,4],[4,51],[144,24],[24,23],[23,144],[77,146],[146,91],[91,77],[205,50],[50,187],[187,205],[201,200],[200,18],[18,201],[91,106],[106,182],[182,91],[90,91],[91,181],[181,90],[85,84],[84,17],[17,85],[206,203],[203,36],[36,206],[148,171],[171,140],[140,148],[92,40],[40,39],[39,92],[193,189],[189,244],[244,193],[159,158],[158,28],[28,159],[247,246],[246,161],[161,247],[236,3],[3,196],[196,236],[54,68],[68,104],[104,54],[193,168],[168,8],[8,193],[117,228],[228,31],[31,117],[189,193],[193,55],[55,189],[98,97],[97,99],[99,98],[126,47],[47,100],[100,126],[166,79],[79,218],[218,166],[155,154],[154,26],[26,155],[209,49],[49,131],[131,209],[135,136],[136,150],[150,135],[47,126],[126,217],[217,47],[223,52],[52,53],[53,223],[45,51],[51,134],[134,45],[211,170],[170,140],[140,211],[67,69],[69,108],[108,67],[43,106],[106,91],[91,43],[230,119],[119,120],[120,230],[226,130],[130,247],[247,226],[63,53],[53,52],[52,63],[238,20],[20,242],[242,238],[46,70],[70,156],[156,46],[78,62],[62,96],[96,78],[46,53],[53,63],[63,46],[143,34],[34,227],[227,143],[123,117],[117,111],[111,123],[44,125],[125,19],[19,44],[236,134],[134,51],[51,236],[216,206],[206,205],[205,216],[154,153],[153,22],[22,154],[39,37],[37,167],[167,39],[200,201],[201,208],[208,200],[36,142],[142,100],[100,36],[57,212],[212,202],[202,57],[20,60],[60,99],[99,20],[28,158],[158,157],[157,28],[35,226],[226,113],[113,35],[160,159],[159,27],[27,160],[204,202],[202,210],[210,204],[113,225],[225,46],[46,113],[43,202],[202,204],[204,43],[62,76],[76,77],[77,62],[137,123],[123,116],[116,137],[41,38],[38,72],[72,41],[203,129],[129,142],[142,203],[64,98],[98,240],[240,64],[49,102],[102,64],[64,49],[41,73],[73,74],[74,41],[212,216],[216,207],[207,212],[42,74],[74,184],[184,42],[169,170],[170,211],[211,169],[170,149],[149,176],[176,170],[105,66],[66,69],[69,105],[122,6],[6,168],[168,122],[123,147],[147,187],[187,123],[96,77],[77,90],[90,96],[65,55],[55,107],[107,65],[89,90],[90,180],[180,89],[101,100],[100,120],[120,101],[63,105],[105,104],[104,63],[93,137],[137,227],[227,93],[15,86],[86,85],[85,15],[129,102],[102,49],[49,129],[14,87],[87,86],[86,14],[55,8],[8,9],[9,55],[100,47],[47,121],[121,100],[145,23],[23,22],[22,145],[88,89],[89,179],[179,88],[6,122],[122,196],[196,6],[88,95],[95,96],[96,88],[138,172],[172,136],[136,138],[215,58],[58,172],[172,215],[115,48],[48,219],[219,115],[42,80],[80,81],[81,42],[195,3],[3,51],[51,195],[43,146],[146,61],[61,43],[171,175],[175,199],[199,171],[81,82],[82,38],[38,81],[53,46],[46,225],[225,53],[144,163],[163,110],[110,144],[52,65],[65,66],[66,52],[229,228],[228,117],[117,229],[34,127],[127,234],[234,34],[107,108],[108,69],[69,107],[109,108],[108,151],[151,109],[48,64],[64,235],[235,48],[62,78],[78,191],[191,62],[129,209],[209,126],[126,129],[111,35],[35,143],[143,111],[117,123],[123,50],[50,117],[222,65],[65,52],[52,222],[19,125],[125,141],[141,19],[221,55],[55,65],[65,221],[3,195],[195,197],[197,3],[25,7],[7,33],[33,25],[220,237],[237,44],[44,220],[70,71],[71,139],[139,70],[122,193],[193,245],[245,122],[247,130],[130,33],[33,247],[71,21],[21,162],[162,71],[170,169],[169,150],[150,170],[188,174],[174,196],[196,188],[216,186],[186,92],[92,216],[2,97],[97,167],[167,2],[141,125],[125,241],[241,141],[164,167],[167,37],[37,164],[72,38],[38,12],[12,72],[38,82],[82,13],[13,38],[63,68],[68,71],[71,63],[226,35],[35,111],[111,226],[101,50],[50,205],[205,101],[206,92],[92,165],[165,206],[209,198],[198,217],[217,209],[165,167],[167,97],[97,165],[220,115],[115,218],[218,220],[133,112],[112,243],[243,133],[239,238],[238,241],[241,239],[214,135],[135,169],[169,214],[190,173],[173,133],[133,190],[171,208],[208,32],[32,171],[125,44],[44,237],[237,125],[86,87],[87,178],[178,86],[85,86],[86,179],[179,85],[84,85],[85,180],[180,84],[83,84],[84,181],[181,83],[201,83],[83,182],[182,201],[137,93],[93,132],[132,137],[76,62],[62,183],[183,76],[61,76],[76,184],[184,61],[57,61],[61,185],[185,57],[212,57],[57,186],[186,212],[214,207],[207,187],[187,214],[34,143],[143,156],[156,34],[79,239],[239,237],[237,79],[123,137],[137,177],[177,123],[44,1],[1,4],[4,44],[201,194],[194,32],[32,201],[64,102],[102,129],[129,64],[213,215],[215,138],[138,213],[59,166],[166,219],[219,59],[242,99],[99,97],[97,242],[2,94],[94,141],[141,2],[75,59],[59,235],[235,75],[24,110],[110,228],[228,24],[25,130],[130,226],[226,25],[23,24],[24,229],[229,23],[22,23],[23,230],[230,22],[26,22],[22,231],[231,26],[112,26],[26,232],[232,112],[189,190],[190,243],[243,189],[221,56],[56,190],[190,221],[28,56],[56,221],[221,28],[27,28],[28,222],[222,27],[29,27],[27,223],[223,29],[30,29],[29,224],[224,30],[247,30],[30,225],[225,247],[238,79],[79,20],[20,238],[166,59],[59,75],[75,166],[60,75],[75,240],[240,60],[147,177],[177,215],[215,147],[20,79],[79,166],[166,20],[187,147],[147,213],[213,187],[112,233],[233,244],[244,112],[233,128],[128,245],[245,233],[128,114],[114,188],[188,128],[114,217],[217,174],[174,114],[131,115],[115,220],[220,131],[217,198],[198,236],[236,217],[198,131],[131,134],[134,198],[177,132],[132,58],[58,177],[143,35],[35,124],[124,143],[110,163],[163,7],[7,110],[228,110],[110,25],[25,228],[356,389],[389,368],[368,356],[11,302],[302,267],[267,11],[452,350],[350,349],[349,452],[302,303],[303,269],[269,302],[357,343],[343,277],[277,357],[452,453],[453,357],[357,452],[333,332],[332,297],[297,333],[175,152],[152,377],[377,175],[347,348],[348,330],[330,347],[303,304],[304,270],[270,303],[9,336],[336,337],[337,9],[278,279],[279,360],[360,278],[418,262],[262,431],[431,418],[304,408],[408,409],[409,304],[310,415],[415,407],[407,310],[270,409],[409,410],[410,270],[450,348],[348,347],[347,450],[422,430],[430,434],[434,422],[313,314],[314,17],[17,313],[306,307],[307,375],[375,306],[387,388],[388,260],[260,387],[286,414],[414,398],[398,286],[335,406],[406,418],[418,335],[364,367],[367,416],[416,364],[423,358],[358,327],[327,423],[251,284],[284,298],[298,251],[281,5],[5,4],[4,281],[373,374],[374,253],[253,373],[307,320],[320,321],[321,307],[425,427],[427,411],[411,425],[421,313],[313,18],[18,421],[321,405],[405,406],[406,321],[320,404],[404,405],[405,320],[315,16],[16,17],[17,315],[426,425],[425,266],[266,426],[377,400],[400,369],[369,377],[322,391],[391,269],[269,322],[417,465],[465,464],[464,417],[386,257],[257,258],[258,386],[466,260],[260,388],[388,466],[456,399],[399,419],[419,456],[284,332],[332,333],[333,284],[417,285],[285,8],[8,417],[346,340],[340,261],[261,346],[413,441],[441,285],[285,413],[327,460],[460,328],[328,327],[355,371],[371,329],[329,355],[392,439],[439,438],[438,392],[382,341],[341,256],[256,382],[429,420],[420,360],[360,429],[364,394],[394,379],[379,364],[277,343],[343,437],[437,277],[443,444],[444,283],[283,443],[275,440],[440,363],[363,275],[431,262],[262,369],[369,431],[297,338],[338,337],[337,297],[273,375],[375,321],[321,273],[450,451],[451,349],[349,450],[446,342],[342,467],[467,446],[293,334],[334,282],[282,293],[458,461],[461,462],[462,458],[276,353],[353,383],[383,276],[308,324],[324,325],[325,308],[276,300],[300,293],[293,276],[372,345],[345,447],[447,372],[352,345],[345,340],[340,352],[274,1],[1,19],[19,274],[456,248],[248,281],[281,456],[436,427],[427,425],[425,436],[381,256],[256,252],[252,381],[269,391],[391,393],[393,269],[200,199],[199,428],[428,200],[266,330],[330,329],[329,266],[287,273],[273,422],[422,287],[250,462],[462,328],[328,250],[258,286],[286,384],[384,258],[265,353],[353,342],[342,265],[387,259],[259,257],[257,387],[424,431],[431,430],[430,424],[342,353],[353,276],[276,342],[273,335],[335,424],[424,273],[292,325],[325,307],[307,292],[366,447],[447,345],[345,366],[271,303],[303,302],[302,271],[423,266],[266,371],[371,423],[294,455],[455,460],[460,294],[279,278],[278,294],[294,279],[271,272],[272,304],[304,271],[432,434],[434,427],[427,432],[272,407],[407,408],[408,272],[394,430],[430,431],[431,394],[395,369],[369,400],[400,395],[334,333],[333,299],[299,334],[351,417],[417,168],[168,351],[352,280],[280,411],[411,352],[325,319],[319,320],[320,325],[295,296],[296,336],[336,295],[319,403],[403,404],[404,319],[330,348],[348,349],[349,330],[293,298],[298,333],[333,293],[323,454],[454,447],[447,323],[15,16],[16,315],[315,15],[358,429],[429,279],[279,358],[14,15],[15,316],[316,14],[285,336],[336,9],[9,285],[329,349],[349,350],[350,329],[374,380],[380,252],[252,374],[318,402],[402,403],[403,318],[6,197],[197,419],[419,6],[318,319],[319,325],[325,318],[367,364],[364,365],[365,367],[435,367],[367,397],[397,435],[344,438],[438,439],[439,344],[272,271],[271,311],[311,272],[195,5],[5,281],[281,195],[273,287],[287,291],[291,273],[396,428],[428,199],[199,396],[311,271],[271,268],[268,311],[283,444],[444,445],[445,283],[373,254],[254,339],[339,373],[282,334],[334,296],[296,282],[449,347],[347,346],[346,449],[264,447],[447,454],[454,264],[336,296],[296,299],[299,336],[338,10],[10,151],[151,338],[278,439],[439,455],[455,278],[292,407],[407,415],[415,292],[358,371],[371,355],[355,358],[340,345],[345,372],[372,340],[346,347],[347,280],[280,346],[442,443],[443,282],[282,442],[19,94],[94,370],[370,19],[441,442],[442,295],[295,441],[248,419],[419,197],[197,248],[263,255],[255,359],[359,263],[440,275],[275,274],[274,440],[300,383],[383,368],[368,300],[351,412],[412,465],[465,351],[263,467],[467,466],[466,263],[301,368],[368,389],[389,301],[395,378],[378,379],[379,395],[412,351],[351,419],[419,412],[436,426],[426,322],[322,436],[2,164],[164,393],[393,2],[370,462],[462,461],[461,370],[164,0],[0,267],[267,164],[302,11],[11,12],[12,302],[268,12],[12,13],[13,268],[293,300],[300,301],[301,293],[446,261],[261,340],[340,446],[330,266],[266,425],[425,330],[426,423],[423,391],[391,426],[429,355],[355,437],[437,429],[391,327],[327,326],[326,391],[440,457],[457,438],[438,440],[341,382],[382,362],[362,341],[459,457],[457,461],[461,459],[434,430],[430,394],[394,434],[414,463],[463,362],[362,414],[396,369],[369,262],[262,396],[354,461],[461,457],[457,354],[316,403],[403,402],[402,316],[315,404],[404,403],[403,315],[314,405],[405,404],[404,314],[313,406],[406,405],[405,313],[421,418],[418,406],[406,421],[366,401],[401,361],[361,366],[306,408],[408,407],[407,306],[291,409],[409,408],[408,291],[287,410],[410,409],[409,287],[432,436],[436,410],[410,432],[434,416],[416,411],[411,434],[264,368],[368,383],[383,264],[309,438],[438,457],[457,309],[352,376],[376,401],[401,352],[274,275],[275,4],[4,274],[421,428],[428,262],[262,421],[294,327],[327,358],[358,294],[433,416],[416,367],[367,433],[289,455],[455,439],[439,289],[462,370],[370,326],[326,462],[2,326],[326,370],[370,2],[305,460],[460,455],[455,305],[254,449],[449,448],[448,254],[255,261],[261,446],[446,255],[253,450],[450,449],[449,253],[252,451],[451,450],[450,252],[256,452],[452,451],[451,256],[341,453],[453,452],[452,341],[413,464],[464,463],[463,413],[441,413],[413,414],[414,441],[258,442],[442,441],[441,258],[257,443],[443,442],[442,257],[259,444],[444,443],[443,259],[260,445],[445,444],[444,260],[467,342],[342,445],[445,467],[459,458],[458,250],[250,459],[289,392],[392,290],[290,289],[290,328],[328,460],[460,290],[376,433],[433,435],[435,376],[250,290],[290,392],[392,250],[411,416],[416,433],[433,411],[341,463],[463,464],[464,341],[453,464],[464,465],[465,453],[357,465],[465,412],[412,357],[343,412],[412,399],[399,343],[360,363],[363,440],[440,360],[437,399],[399,456],[456,437],[420,456],[456,363],[363,420],[401,435],[435,288],[288,401],[372,383],[383,353],[353,372],[339,255],[255,249],[249,339],[448,261],[261,255],[255,448],[133,243],[243,190],[190,133],[133,155],[155,112],[112,133],[33,246],[246,247],[247,33],[33,130],[130,25],[25,33],[398,384],[384,286],[286,398],[362,398],[398,414],[414,362],[362,463],[463,341],[341,362],[263,359],[359,467],[467,263],[263,249],[249,255],[255,263],[466,467],[467,260],[260,466],[75,60],[60,166],[166,75],[238,239],[239,79],[79,238],[162,127],[127,139],[139,162],[72,11],[11,37],[37,72],[121,232],[232,120],[120,121],[73,72],[72,39],[39,73],[114,128],[128,47],[47,114],[233,232],[232,128],[128,233],[103,104],[104,67],[67,103],[152,175],[175,148],[148,152],[119,118],[118,101],[101,119],[74,73],[73,40],[40,74],[107,9],[9,108],[108,107],[49,48],[48,131],[131,49],[32,194],[194,211],[211,32],[184,74],[74,185],[185,184],[191,80],[80,183],[183,191],[185,40],[40,186],[186,185],[119,230],[230,118],[118,119],[210,202],[202,214],[214,210],[84,83],[83,17],[17,84],[77,76],[76,146],[146,77],[161,160],[160,30],[30,161],[190,56],[56,173],[173,190],[182,106],[106,194],[194,182],[138,135],[135,192],[192,138],[129,203],[203,98],[98,129],[54,21],[21,68],[68,54],[5,51],[51,4],[4,5],[145,144],[144,23],[23,145],[90,77],[77,91],[91,90],[207,205],[205,187],[187,207],[83,201],[201,18],[18,83],[181,91],[91,182],[182,181],[180,90],[90,181],[181,180],[16,85],[85,17],[17,16],[205,206],[206,36],[36,205],[176,148],[148,140],[140,176],[165,92],[92,39],[39,165],[245,193],[193,244],[244,245],[27,159],[159,28],[28,27],[30,247],[247,161],[161,30],[174,236],[236,196],[196,174],[103,54],[54,104],[104,103],[55,193],[193,8],[8,55],[111,117],[117,31],[31,111],[221,189],[189,55],[55,221],[240,98],[98,99],[99,240],[142,126],[126,100],[100,142],[219,166],[166,218],[218,219],[112,155],[155,26],[26,112],[198,209],[209,131],[131,198],[169,135],[135,150],[150,169],[114,47],[47,217],[217,114],[224,223],[223,53],[53,224],[220,45],[45,134],[134,220],[32,211],[211,140],[140,32],[109,67],[67,108],[108,109],[146,43],[43,91],[91,146],[231,230],[230,120],[120,231],[113,226],[226,247],[247,113],[105,63],[63,52],[52,105],[241,238],[238,242],[242,241],[124,46],[46,156],[156,124],[95,78],[78,96],[96,95],[70,46],[46,63],[63,70],[116,143],[143,227],[227,116],[116,123],[123,111],[111,116],[1,44],[44,19],[19,1],[3,236],[236,51],[51,3],[207,216],[216,205],[205,207],[26,154],[154,22],[22,26],[165,39],[39,167],[167,165],[199,200],[200,208],[208,199],[101,36],[36,100],[100,101],[43,57],[57,202],[202,43],[242,20],[20,99],[99,242],[56,28],[28,157],[157,56],[124,35],[35,113],[113,124],[29,160],[160,27],[27,29],[211,204],[204,210],[210,211],[124,113],[113,46],[46,124],[106,43],[43,204],[204,106],[96,62],[62,77],[77,96],[227,137],[137,116],[116,227],[73,41],[41,72],[72,73],[36,203],[203,142],[142,36],[235,64],[64,240],[240,235],[48,49],[49,64],[64,48],[42,41],[41,74],[74,42],[214,212],[212,207],[207,214],[183,42],[42,184],[184,183],[210,169],[169,211],[211,210],[140,170],[170,176],[176,140],[104,105],[105,69],[69,104],[193,122],[122,168],[168,193],[50,123],[123,187],[187,50],[89,96],[96,90],[90,89],[66,65],[65,107],[107,66],[179,89],[89,180],[180,179],[119,101],[101,120],[120,119],[68,63],[63,104],[104,68],[234,93],[93,227],[227,234],[16,15],[15,85],[85,16],[209,129],[129,49],[49,209],[15,14],[14,86],[86,15],[107,55],[55,9],[9,107],[120,100],[100,121],[121,120],[153,145],[145,22],[22,153],[178,88],[88,179],[179,178],[197,6],[6,196],[196,197],[89,88],[88,96],[96,89],[135,138],[138,136],[136,135],[138,215],[215,172],[172,138],[218,115],[115,219],[219,218],[41,42],[42,81],[81,41],[5,195],[195,51],[51,5],[57,43],[43,61],[61,57],[208,171],[171,199],[199,208],[41,81],[81,38],[38,41],[224,53],[53,225],[225,224],[24,144],[144,110],[110,24],[105,52],[52,66],[66,105],[118,229],[229,117],[117,118],[227,34],[34,234],[234,227],[66,107],[107,69],[69,66],[10,109],[109,151],[151,10],[219,48],[48,235],[235,219],[183,62],[62,191],[191,183],[142,129],[129,126],[126,142],[116,111],[111,143],[143,116],[118,117],[117,50],[50,118],[223,222],[222,52],[52,223],[94,19],[19,141],[141,94],[222,221],[221,65],[65,222],[196,3],[3,197],[197,196],[45,220],[220,44],[44,45],[156,70],[70,139],[139,156],[188,122],[122,245],[245,188],[139,71],[71,162],[162,139],[149,170],[170,150],[150,149],[122,188],[188,196],[196,122],[206,216],[216,92],[92,206],[164,2],[2,167],[167,164],[242,141],[141,241],[241,242],[0,164],[164,37],[37,0],[11,72],[72,12],[12,11],[12,38],[38,13],[13,12],[70,63],[63,71],[71,70],[31,226],[226,111],[111,31],[36,101],[101,205],[205,36],[203,206],[206,165],[165,203],[126,209],[209,217],[217,126],[98,165],[165,97],[97,98],[237,220],[220,218],[218,237],[237,239],[239,241],[241,237],[210,214],[214,169],[169,210],[140,171],[171,32],[32,140],[241,125],[125,237],[237,241],[179,86],[86,178],[178,179],[180,85],[85,179],[179,180],[181,84],[84,180],[180,181],[182,83],[83,181],[181,182],[194,201],[201,182],[182,194],[177,137],[137,132],[132,177],[184,76],[76,183],[183,184],[185,61],[61,184],[184,185],[186,57],[57,185],[185,186],[216,212],[212,186],[186,216],[192,214],[214,187],[187,192],[139,34],[34,156],[156,139],[218,79],[79,237],[237,218],[147,123],[123,177],[177,147],[45,44],[44,4],[4,45],[208,201],[201,32],[32,208],[98,64],[64,129],[129,98],[192,213],[213,138],[138,192],[235,59],[59,219],[219,235],[141,242],[242,97],[97,141],[97,2],[2,141],[141,97],[240,75],[75,235],[235,240],[229,24],[24,228],[228,229],[31,25],[25,226],[226,31],[230,23],[23,229],[229,230],[231,22],[22,230],[230,231],[232,26],[26,231],[231,232],[233,112],[112,232],[232,233],[244,189],[189,243],[243,244],[189,221],[221,190],[190,189],[222,28],[28,221],[221,222],[223,27],[27,222],[222,223],[224,29],[29,223],[223,224],[225,30],[30,224],[224,225],[113,247],[247,225],[225,113],[99,60],[60,240],[240,99],[213,147],[147,215],[215,213],[60,20],[20,166],[166,60],[192,187],[187,213],[213,192],[243,112],[112,244],[244,243],[244,233],[233,245],[245,244],[245,128],[128,188],[188,245],[188,114],[114,174],[174,188],[134,131],[131,220],[220,134],[174,217],[217,236],[236,174],[236,198],[198,134],[134,236],[215,177],[177,58],[58,215],[156,143],[143,124],[124,156],[25,110],[110,7],[7,25],[31,228],[228,25],[25,31],[264,356],[356,368],[368,264],[0,11],[11,267],[267,0],[451,452],[452,349],[349,451],[267,302],[302,269],[269,267],[350,357],[357,277],[277,350],[350,452],[452,357],[357,350],[299,333],[333,297],[297,299],[396,175],[175,377],[377,396],[280,347],[347,330],[330,280],[269,303],[303,270],[270,269],[151,9],[9,337],[337,151],[344,278],[278,360],[360,344],[424,418],[418,431],[431,424],[270,304],[304,409],[409,270],[272,310],[310,407],[407,272],[322,270],[270,410],[410,322],[449,450],[450,347],[347,449],[432,422],[422,434],[434,432],[18,313],[313,17],[17,18],[291,306],[306,375],[375,291],[259,387],[387,260],[260,259],[424,335],[335,418],[418,424],[434,364],[364,416],[416,434],[391,423],[423,327],[327,391],[301,251],[251,298],[298,301],[275,281],[281,4],[4,275],[254,373],[373,253],[253,254],[375,307],[307,321],[321,375],[280,425],[425,411],[411,280],[200,421],[421,18],[18,200],[335,321],[321,406],[406,335],[321,320],[320,405],[405,321],[314,315],[315,17],[17,314],[423,426],[426,266],[266,423],[396,377],[377,369],[369,396],[270,322],[322,269],[269,270],[413,417],[417,464],[464,413],[385,386],[386,258],[258,385],[248,456],[456,419],[419,248],[298,284],[284,333],[333,298],[168,417],[417,8],[8,168],[448,346],[346,261],[261,448],[417,413],[413,285],[285,417],[326,327],[327,328],[328,326],[277,355],[355,329],[329,277],[309,392],[392,438],[438,309],[381,382],[382,256],[256,381],[279,429],[429,360],[360,279],[365,364],[364,379],[379,365],[355,277],[277,437],[437,355],[282,443],[443,283],[283,282],[281,275],[275,363],[363,281],[395,431],[431,369],[369,395],[299,297],[297,337],[337,299],[335,273],[273,321],[321,335],[348,450],[450,349],[349,348],[359,446],[446,467],[467,359],[283,293],[293,282],[282,283],[250,458],[458,462],[462,250],[300,276],[276,383],[383,300],[292,308],[308,325],[325,292],[283,276],[276,293],[293,283],[264,372],[372,447],[447,264],[346,352],[352,340],[340,346],[354,274],[274,19],[19,354],[363,456],[456,281],[281,363],[426,436],[436,425],[425,426],[380,381],[381,252],[252,380],[267,269],[269,393],[393,267],[421,200],[200,428],[428,421],[371,266],[266,329],[329,371],[432,287],[287,422],[422,432],[290,250],[250,328],[328,290],[385,258],[258,384],[384,385],[446,265],[265,342],[342,446],[386,387],[387,257],[257,386],[422,424],[424,430],[430,422],[445,342],[342,276],[276,445],[422,273],[273,424],[424,422],[306,292],[292,307],[307,306],[352,366],[366,345],[345,352],[268,271],[271,302],[302,268],[358,423],[423,371],[371,358],[327,294],[294,460],[460,327],[331,279],[279,294],[294,331],[303,271],[271,304],[304,303],[436,432],[432,427],[427,436],[304,272],[272,408],[408,304],[395,394],[394,431],[431,395],[378,395],[395,400],[400,378],[296,334],[334,299],[299,296],[6,351],[351,168],[168,6],[376,352],[352,411],[411,376],[307,325],[325,320],[320,307],[285,295],[295,336],[336,285],[320,319],[319,404],[404,320],[329,330],[330,349],[349,329],[334,293],[293,333],[333,334],[366,323],[323,447],[447,366],[316,15],[15,315],[315,316],[331,358],[358,279],[279,331],[317,14],[14,316],[316,317],[8,285],[285,9],[9,8],[277,329],[329,350],[350,277],[253,374],[374,252],[252,253],[319,318],[318,403],[403,319],[351,6],[6,419],[419,351],[324,318],[318,325],[325,324],[397,367],[367,365],[365,397],[288,435],[435,397],[397,288],[278,344],[344,439],[439,278],[310,272],[272,311],[311,310],[248,195],[195,281],[281,248],[375,273],[273,291],[291,375],[175,396],[396,199],[199,175],[312,311],[311,268],[268,312],[276,283],[283,445],[445,276],[390,373],[373,339],[339,390],[295,282],[282,296],[296,295],[448,449],[449,346],[346,448],[356,264],[264,454],[454,356],[337,336],[336,299],[299,337],[337,338],[338,151],[151,337],[294,278],[278,455],[455,294],[308,292],[292,415],[415,308],[429,358],[358,355],[355,429],[265,340],[340,372],[372,265],[352,346],[346,280],[280,352],[295,442],[442,282],[282,295],[354,19],[19,370],[370,354],[285,441],[441,295],[295,285],[195,248],[248,197],[197,195],[457,440],[440,274],[274,457],[301,300],[300,368],[368,301],[417,351],[351,465],[465,417],[251,301],[301,389],[389,251],[394,395],[395,379],[379,394],[399,412],[412,419],[419,399],[410,436],[436,322],[322,410],[326,2],[2,393],[393,326],[354,370],[370,461],[461,354],[393,164],[164,267],[267,393],[268,302],[302,12],[12,268],[312,268],[268,13],[13,312],[298,293],[293,301],[301,298],[265,446],[446,340],[340,265],[280,330],[330,425],[425,280],[322,426],[426,391],[391,322],[420,429],[429,437],[437,420],[393,391],[391,326],[326,393],[344,440],[440,438],[438,344],[458,459],[459,461],[461,458],[364,434],[434,394],[394,364],[428,396],[396,262],[262,428],[274,354],[354,457],[457,274],[317,316],[316,402],[402,317],[316,315],[315,403],[403,316],[315,314],[314,404],[404,315],[314,313],[313,405],[405,314],[313,421],[421,406],[406,313],[323,366],[366,361],[361,323],[292,306],[306,407],[407,292],[306,291],[291,408],[408,306],[291,287],[287,409],[409,291],[287,432],[432,410],[410,287],[427,434],[434,411],[411,427],[372,264],[264,383],[383,372],[459,309],[309,457],[457,459],[366,352],[352,401],[401,366],[1,274],[274,4],[4,1],[418,421],[421,262],[262,418],[331,294],[294,358],[358,331],[435,433],[433,367],[367,435],[392,289],[289,439],[439,392],[328,462],[462,326],[326,328],[94,2],[2,370],[370,94],[289,305],[305,455],[455,289],[339,254],[254,448],[448,339],[359,255],[255,446],[446,359],[254,253],[253,449],[449,254],[253,252],[252,450],[450,253],[252,256],[256,451],[451,252],[256,341],[341,452],[452,256],[414,413],[413,463],[463,414],[286,441],[441,414],[414,286],[286,258],[258,441],[441,286],[258,257],[257,442],[442,258],[257,259],[259,443],[443,257],[259,260],[260,444],[444,259],[260,467],[467,445],[445,260],[309,459],[459,250],[250,309],[305,289],[289,290],[290,305],[305,290],[290,460],[460,305],[401,376],[376,435],[435,401],[309,250],[250,392],[392,309],[376,411],[411,433],[433,376],[453,341],[341,464],[464,453],[357,453],[453,465],[465,357],[343,357],[357,412],[412,343],[437,343],[343,399],[399,437],[344,360],[360,440],[440,344],[420,437],[437,456],[456,420],[360,420],[420,363],[363,360],[361,401],[401,288],[288,361],[265,372],[372,353],[353,265],[390,339],[339,249],[249,390],[339,448],[448,255],[255,339]);function _p(e){e.j={faceLandmarks:[],faceBlendshapes:[],facialTransformationMatrixes:[]}}var Ge=class extends wt{constructor(t,r){super(new jt(t,r),"image_in","norm_rect",!1),this.j={faceLandmarks:[],faceBlendshapes:[],facialTransformationMatrixes:[]},this.outputFacialTransformationMatrixes=this.outputFaceBlendshapes=!1,ie(t=this.h=new z0,0,1,r=new Ve),this.v=new A0,ie(this.h,0,3,this.v),this.s=new ms,ie(this.h,0,2,this.s),fr(this.s,4,1),J(this.s,2,.5),J(this.v,2,.5),J(this.h,4,.5)}get baseOptions(){return ke(this.h,Ve,1)}set baseOptions(t){ie(this.h,0,1,t)}o(t){return"numFaces"in t&&fr(this.s,4,t.numFaces??1),"minFaceDetectionConfidence"in t&&J(this.s,2,t.minFaceDetectionConfidence??.5),"minTrackingConfidence"in t&&J(this.h,4,t.minTrackingConfidence??.5),"minFacePresenceConfidence"in t&&J(this.v,2,t.minFacePresenceConfidence??.5),"outputFaceBlendshapes"in t&&(this.outputFaceBlendshapes=!!t.outputFaceBlendshapes),"outputFacialTransformationMatrixes"in t&&(this.outputFacialTransformationMatrixes=!!t.outputFacialTransformationMatrixes),this.l(t)}D(t,r){return _p(this),qt(this,t,r),this.j}F(t,r,i){return _p(this),gr(this,t,i,r),this.j}m(){var t=new bt;Le(t,"image_in"),Le(t,"norm_rect"),Se(t,"face_landmarks");const r=new Ct;er(r,xv,this.h);const i=new ct;zt(i,"mediapipe.tasks.vision.face_landmarker.FaceLandmarkerGraph"),Pe(i,"IMAGE:image_in"),Pe(i,"NORM_RECT:norm_rect"),be(i,"NORM_LANDMARKS:face_landmarks"),i.o(r),Ot(t,i),this.g.attachProtoVectorListener("face_landmarks",(a,n)=>{for(const s of a)a=Wn(s),this.j.faceLandmarks.push(gs(a));H(this,n)}),this.g.attachEmptyPacketListener("face_landmarks",a=>{H(this,a)}),this.outputFaceBlendshapes&&(Se(t,"blendshapes"),be(i,"BLENDSHAPES:blendshapes"),this.g.attachProtoVectorListener("blendshapes",(a,n)=>{if(this.outputFaceBlendshapes)for(const s of a)a=fs(s),this.j.faceBlendshapes.push(El(a.g()??[]));H(this,n)}),this.g.attachEmptyPacketListener("blendshapes",a=>{H(this,a)})),this.outputFacialTransformationMatrixes&&(Se(t,"face_geometry"),be(i,"FACE_GEOMETRY:face_geometry"),this.g.attachProtoVectorListener("face_geometry",(a,n)=>{if(this.outputFacialTransformationMatrixes)for(const s of a)(a=ke($v(s),pv,2))&&this.j.facialTransformationMatrixes.push({rows:Ft(a,1)??0??0,columns:Ft(a,2)??0??0,data:pi(a,3,Yr,ci()).slice()??[]});H(this,n)}),this.g.attachEmptyPacketListener("face_geometry",a=>{H(this,a)})),t=t.g(),this.setGraph(new Uint8Array(t),!0)}};Ge.prototype.detectForVideo=Ge.prototype.F,Ge.prototype.detect=Ge.prototype.D,Ge.prototype.setOptions=Ge.prototype.o,Ge.createFromModelPath=function(e,t){return we(Ge,e,{baseOptions:{modelAssetPath:t}})},Ge.createFromModelBuffer=function(e,t){return we(Ge,e,{baseOptions:{modelAssetBuffer:t}})},Ge.createFromOptions=function(e,t){return we(Ge,e,t)},Ge.FACE_LANDMARKS_LIPS=Rl,Ge.FACE_LANDMARKS_LEFT_EYE=Ml,Ge.FACE_LANDMARKS_LEFT_EYEBROW=Bl,Ge.FACE_LANDMARKS_LEFT_IRIS=ng,Ge.FACE_LANDMARKS_RIGHT_EYE=Nl,Ge.FACE_LANDMARKS_RIGHT_EYEBROW=Pl,Ge.FACE_LANDMARKS_RIGHT_IRIS=ag,Ge.FACE_LANDMARKS_FACE_OVAL=Dl,Ge.FACE_LANDMARKS_CONTOURS=sg,Ge.FACE_LANDMARKS_TESSELATION=og;var lr=class extends wt{constructor(t,r){super(new jt(t,r),"image_in","norm_rect",!0),ie(t=this.j=new R0,0,1,r=new Ve)}get baseOptions(){return ke(this.j,Ve,1)}set baseOptions(t){ie(this.j,0,1,t)}o(t){return super.l(t)}Oa(t,r,i){const a=typeof r!="function"?r:{};if(this.h=typeof r=="function"?r:i,qt(this,t,a??{}),!this.h)return this.s}m(){var t=new bt;Le(t,"image_in"),Le(t,"norm_rect"),Se(t,"stylized_image");const r=new Ct;er(r,kv,this.j);const i=new ct;zt(i,"mediapipe.tasks.vision.face_stylizer.FaceStylizerGraph"),Pe(i,"IMAGE:image_in"),Pe(i,"NORM_RECT:norm_rect"),be(i,"STYLIZED_IMAGE:stylized_image"),i.o(r),Ot(t,i),this.g.U("stylized_image",(a,n)=>{var s=!this.h,u=a.data,l=a.width;const h=l*(a=a.height);if(u instanceof Uint8Array)if(u.length===3*h){const p=new Uint8ClampedArray(4*h);for(let m=0;m<h;++m)p[4*m]=u[3*m],p[4*m+1]=u[3*m+1],p[4*m+2]=u[3*m+2],p[4*m+3]=255;u=new ImageData(p,l,a)}else{if(u.length!==4*h)throw Error("Unsupported channel count: "+u.length/h);u=new ImageData(new Uint8ClampedArray(u.buffer,u.byteOffset,u.length),l,a)}else if(!(u instanceof WebGLTexture))throw Error(`Unsupported format: ${u.constructor.name}`);l=new st([u],!1,!1,this.g.i.canvas,this.O,l,a),this.s=s=s?l.clone():l,this.h&&this.h(s),H(this,n)}),this.g.attachEmptyPacketListener("stylized_image",a=>{this.s=null,this.h&&this.h(null),H(this,a)}),t=t.g(),this.setGraph(new Uint8Array(t),!0)}};lr.prototype.stylize=lr.prototype.Oa,lr.prototype.setOptions=lr.prototype.o,lr.createFromModelPath=function(e,t){return we(lr,e,{baseOptions:{modelAssetPath:t}})},lr.createFromModelBuffer=function(e,t){return we(lr,e,{baseOptions:{modelAssetBuffer:t}})},lr.createFromOptions=function(e,t){return we(lr,e,t)};var Ll=ir([0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],[13,17],[0,17],[17,18],[18,19],[19,20]);function wp(e){e.gestures=[],e.landmarks=[],e.worldLandmarks=[],e.handedness=[]}function bp(e){return e.gestures.length===0?{gestures:[],landmarks:[],worldLandmarks:[],handedness:[],handednesses:[]}:{gestures:e.gestures,landmarks:e.landmarks,worldLandmarks:e.worldLandmarks,handedness:e.handedness,handednesses:e.handedness}}function vp(e,t=!0){const r=[];for(const a of e){var i=fs(a);e=[];for(const n of i.g())i=t&&Ft(n,1)!=null?Ft(n,1)??0:-1,e.push({score:Ye(n,2)??0,index:i,categoryName:Vt(n,3)??""??"",displayName:Vt(n,4)??""??""});r.push(e)}return r}var $t=class extends wt{constructor(t,r){super(new jt(t,r),"image_in","norm_rect",!1),this.gestures=[],this.landmarks=[],this.worldLandmarks=[],this.handedness=[],ie(t=this.j=new N0,0,1,r=new Ve),this.s=new xl,ie(this.j,0,2,this.s),this.C=new $l,ie(this.s,0,3,this.C),this.v=new B0,ie(this.s,0,2,this.v),this.h=new Sv,ie(this.j,0,3,this.h),J(this.v,2,.5),J(this.s,4,.5),J(this.C,2,.5)}get baseOptions(){return ke(this.j,Ve,1)}set baseOptions(t){ie(this.j,0,1,t)}o(t){var n,s,u,l;if(fr(this.v,3,t.numHands??1),"minHandDetectionConfidence"in t&&J(this.v,2,t.minHandDetectionConfidence??.5),"minTrackingConfidence"in t&&J(this.s,4,t.minTrackingConfidence??.5),"minHandPresenceConfidence"in t&&J(this.C,2,t.minHandPresenceConfidence??.5),t.cannedGesturesClassifierOptions){var r=new Si,i=r,a=pu(t.cannedGesturesClassifierOptions,(n=ke(this.h,Si,3))==null?void 0:n.h());ie(i,0,2,a),ie(this.h,0,3,r)}else t.cannedGesturesClassifierOptions===void 0&&((s=ke(this.h,Si,3))==null||s.g());return t.customGesturesClassifierOptions?(ie(i=r=new Si,0,2,a=pu(t.customGesturesClassifierOptions,(u=ke(this.h,Si,4))==null?void 0:u.h())),ie(this.h,0,4,r)):t.customGesturesClassifierOptions===void 0&&((l=ke(this.h,Si,4))==null||l.g()),this.l(t)}Ja(t,r){return wp(this),qt(this,t,r),bp(this)}Ka(t,r,i){return wp(this),gr(this,t,i,r),bp(this)}m(){var t=new bt;Le(t,"image_in"),Le(t,"norm_rect"),Se(t,"hand_gestures"),Se(t,"hand_landmarks"),Se(t,"world_hand_landmarks"),Se(t,"handedness");const r=new Ct;er(r,Tv,this.j);const i=new ct;zt(i,"mediapipe.tasks.vision.gesture_recognizer.GestureRecognizerGraph"),Pe(i,"IMAGE:image_in"),Pe(i,"NORM_RECT:norm_rect"),be(i,"HAND_GESTURES:hand_gestures"),be(i,"LANDMARKS:hand_landmarks"),be(i,"WORLD_LANDMARKS:world_hand_landmarks"),be(i,"HANDEDNESS:handedness"),i.o(r),Ot(t,i),this.g.attachProtoVectorListener("hand_landmarks",(a,n)=>{for(const s of a){a=Wn(s);const u=[];for(const l of Er(a,S0,1))u.push({x:Ye(l,1)??0,y:Ye(l,2)??0,z:Ye(l,3)??0,visibility:Ye(l,4)??0});this.landmarks.push(u)}H(this,n)}),this.g.attachEmptyPacketListener("hand_landmarks",a=>{H(this,a)}),this.g.attachProtoVectorListener("world_hand_landmarks",(a,n)=>{for(const s of a){a=Ni(s);const u=[];for(const l of Er(a,k0,1))u.push({x:Ye(l,1)??0,y:Ye(l,2)??0,z:Ye(l,3)??0,visibility:Ye(l,4)??0});this.worldLandmarks.push(u)}H(this,n)}),this.g.attachEmptyPacketListener("world_hand_landmarks",a=>{H(this,a)}),this.g.attachProtoVectorListener("hand_gestures",(a,n)=>{this.gestures.push(...vp(a,!1)),H(this,n)}),this.g.attachEmptyPacketListener("hand_gestures",a=>{H(this,a)}),this.g.attachProtoVectorListener("handedness",(a,n)=>{this.handedness.push(...vp(a)),H(this,n)}),this.g.attachEmptyPacketListener("handedness",a=>{H(this,a)}),t=t.g(),this.setGraph(new Uint8Array(t),!0)}};function $p(e){return{landmarks:e.landmarks,worldLandmarks:e.worldLandmarks,handednesses:e.handedness,handedness:e.handedness}}$t.prototype.recognizeForVideo=$t.prototype.Ka,$t.prototype.recognize=$t.prototype.Ja,$t.prototype.setOptions=$t.prototype.o,$t.createFromModelPath=function(e,t){return we($t,e,{baseOptions:{modelAssetPath:t}})},$t.createFromModelBuffer=function(e,t){return we($t,e,{baseOptions:{modelAssetBuffer:t}})},$t.createFromOptions=function(e,t){return we($t,e,t)},$t.HAND_CONNECTIONS=Ll;var xt=class extends wt{constructor(t,r){super(new jt(t,r),"image_in","norm_rect",!1),this.landmarks=[],this.worldLandmarks=[],this.handedness=[],ie(t=this.h=new xl,0,1,r=new Ve),this.s=new $l,ie(this.h,0,3,this.s),this.j=new B0,ie(this.h,0,2,this.j),fr(this.j,3,1),J(this.j,2,.5),J(this.s,2,.5),J(this.h,4,.5)}get baseOptions(){return ke(this.h,Ve,1)}set baseOptions(t){ie(this.h,0,1,t)}o(t){return"numHands"in t&&fr(this.j,3,t.numHands??1),"minHandDetectionConfidence"in t&&J(this.j,2,t.minHandDetectionConfidence??.5),"minTrackingConfidence"in t&&J(this.h,4,t.minTrackingConfidence??.5),"minHandPresenceConfidence"in t&&J(this.s,2,t.minHandPresenceConfidence??.5),this.l(t)}D(t,r){return this.landmarks=[],this.worldLandmarks=[],this.handedness=[],qt(this,t,r),$p(this)}F(t,r,i){return this.landmarks=[],this.worldLandmarks=[],this.handedness=[],gr(this,t,i,r),$p(this)}m(){var t=new bt;Le(t,"image_in"),Le(t,"norm_rect"),Se(t,"hand_landmarks"),Se(t,"world_hand_landmarks"),Se(t,"handedness");const r=new Ct;er(r,Ev,this.h);const i=new ct;zt(i,"mediapipe.tasks.vision.hand_landmarker.HandLandmarkerGraph"),Pe(i,"IMAGE:image_in"),Pe(i,"NORM_RECT:norm_rect"),be(i,"LANDMARKS:hand_landmarks"),be(i,"WORLD_LANDMARKS:world_hand_landmarks"),be(i,"HANDEDNESS:handedness"),i.o(r),Ot(t,i),this.g.attachProtoVectorListener("hand_landmarks",(a,n)=>{for(const s of a)a=Wn(s),this.landmarks.push(gs(a));H(this,n)}),this.g.attachEmptyPacketListener("hand_landmarks",a=>{H(this,a)}),this.g.attachProtoVectorListener("world_hand_landmarks",(a,n)=>{for(const s of a)a=Ni(s),this.worldLandmarks.push(zn(a));H(this,n)}),this.g.attachEmptyPacketListener("world_hand_landmarks",a=>{H(this,a)}),this.g.attachProtoVectorListener("handedness",(a,n)=>{var s=this.handedness,u=s.push;const l=[];for(const h of a){a=fs(h);const p=[];for(const m of a.g())p.push({score:Ye(m,2)??0,index:Ft(m,1)??0??-1,categoryName:Vt(m,3)??""??"",displayName:Vt(m,4)??""??""});l.push(p)}u.call(s,...l),H(this,n)}),this.g.attachEmptyPacketListener("handedness",a=>{H(this,a)}),t=t.g(),this.setGraph(new Uint8Array(t),!0)}};xt.prototype.detectForVideo=xt.prototype.F,xt.prototype.detect=xt.prototype.D,xt.prototype.setOptions=xt.prototype.o,xt.createFromModelPath=function(e,t){return we(xt,e,{baseOptions:{modelAssetPath:t}})},xt.createFromModelBuffer=function(e,t){return we(xt,e,{baseOptions:{modelAssetBuffer:t}})},xt.createFromOptions=function(e,t){return we(xt,e,t)},xt.HAND_CONNECTIONS=Ll;var ug=ir([0,1],[1,2],[2,3],[3,7],[0,4],[4,5],[5,6],[6,8],[9,10],[11,12],[11,13],[13,15],[15,17],[15,19],[15,21],[17,19],[12,14],[14,16],[16,18],[16,20],[16,22],[18,20],[11,23],[12,24],[23,24],[23,25],[24,26],[25,27],[26,28],[27,29],[28,30],[29,31],[30,32],[27,31],[28,32]);function xp(e){e.h={faceLandmarks:[],faceBlendshapes:[],poseLandmarks:[],poseWorldLandmarks:[],poseSegmentationMasks:[],leftHandLandmarks:[],leftHandWorldLandmarks:[],rightHandLandmarks:[],rightHandWorldLandmarks:[]}}function kp(e){try{if(!e.C)return e.h;e.C(e.h)}finally{_s(e)}}function aa(e,t){e=Wn(e),t.push(gs(e))}var Ue=class extends wt{constructor(t,r){super(new jt(t,r),"input_frames_image",null,!1),this.h={faceLandmarks:[],faceBlendshapes:[],poseLandmarks:[],poseWorldLandmarks:[],poseSegmentationMasks:[],leftHandLandmarks:[],leftHandWorldLandmarks:[],rightHandLandmarks:[],rightHandWorldLandmarks:[]},this.outputPoseSegmentationMasks=this.outputFaceBlendshapes=!1,ie(t=this.j=new F0,0,1,r=new Ve),this.J=new $l,ie(this.j,0,2,this.J),this.Z=new Iv,ie(this.j,0,3,this.Z),this.s=new ms,ie(this.j,0,4,this.s),this.H=new A0,ie(this.j,0,5,this.H),this.v=new L0,ie(this.j,0,6,this.v),this.K=new U0,ie(this.j,0,7,this.K),J(this.s,2,.5),J(this.s,3,.3),J(this.H,2,.5),J(this.v,2,.5),J(this.v,3,.3),J(this.K,2,.5),J(this.J,2,.5)}get baseOptions(){return ke(this.j,Ve,1)}set baseOptions(t){ie(this.j,0,1,t)}o(t){return"minFaceDetectionConfidence"in t&&J(this.s,2,t.minFaceDetectionConfidence??.5),"minFaceSuppressionThreshold"in t&&J(this.s,3,t.minFaceSuppressionThreshold??.3),"minFacePresenceConfidence"in t&&J(this.H,2,t.minFacePresenceConfidence??.5),"outputFaceBlendshapes"in t&&(this.outputFaceBlendshapes=!!t.outputFaceBlendshapes),"minPoseDetectionConfidence"in t&&J(this.v,2,t.minPoseDetectionConfidence??.5),"minPoseSuppressionThreshold"in t&&J(this.v,3,t.minPoseSuppressionThreshold??.3),"minPosePresenceConfidence"in t&&J(this.K,2,t.minPosePresenceConfidence??.5),"outputPoseSegmentationMasks"in t&&(this.outputPoseSegmentationMasks=!!t.outputPoseSegmentationMasks),"minHandLandmarksConfidence"in t&&J(this.J,2,t.minHandLandmarksConfidence??.5),this.l(t)}D(t,r,i){const a=typeof r!="function"?r:{};return this.C=typeof r=="function"?r:i,xp(this),qt(this,t,a),kp(this)}F(t,r,i,a){const n=typeof i!="function"?i:{};return this.C=typeof i=="function"?i:a,xp(this),gr(this,t,n,r),kp(this)}m(){var t=new bt;Le(t,"input_frames_image"),Se(t,"pose_landmarks"),Se(t,"pose_world_landmarks"),Se(t,"face_landmarks"),Se(t,"left_hand_landmarks"),Se(t,"left_hand_world_landmarks"),Se(t,"right_hand_landmarks"),Se(t,"right_hand_world_landmarks");const r=new Ct,i=new Hc;ou(i,1,Qi("type.googleapis.com/mediapipe.tasks.vision.holistic_landmarker.proto.HolisticLandmarkerGraphOptions"),""),function(n,s){if(s!=null)if(Array.isArray(s))Ne(n,2,B2(s));else{if(!(typeof s=="string"||s instanceof kr||Dn(s)))throw Error("invalid value in Any.value field: "+s+" expected a ByteString, a base64 encoded string, a Uint8Array or a jspb array");ou(n,2,Uu(s,!1),gi())}}(i,this.j.g());const a=new ct;zt(a,"mediapipe.tasks.vision.holistic_landmarker.HolisticLandmarkerGraph"),Ba(a,8,Hc,i),Pe(a,"IMAGE:input_frames_image"),be(a,"POSE_LANDMARKS:pose_landmarks"),be(a,"POSE_WORLD_LANDMARKS:pose_world_landmarks"),be(a,"FACE_LANDMARKS:face_landmarks"),be(a,"LEFT_HAND_LANDMARKS:left_hand_landmarks"),be(a,"LEFT_HAND_WORLD_LANDMARKS:left_hand_world_landmarks"),be(a,"RIGHT_HAND_LANDMARKS:right_hand_landmarks"),be(a,"RIGHT_HAND_WORLD_LANDMARKS:right_hand_world_landmarks"),a.o(r),Ot(t,a),ys(this,t),this.g.attachProtoListener("pose_landmarks",(n,s)=>{aa(n,this.h.poseLandmarks),H(this,s)}),this.g.attachEmptyPacketListener("pose_landmarks",n=>{H(this,n)}),this.g.attachProtoListener("pose_world_landmarks",(n,s)=>{var u=this.h.poseWorldLandmarks;n=Ni(n),u.push(zn(n)),H(this,s)}),this.g.attachEmptyPacketListener("pose_world_landmarks",n=>{H(this,n)}),this.outputPoseSegmentationMasks&&(be(a,"POSE_SEGMENTATION_MASK:pose_segmentation_mask"),Vi(this,"pose_segmentation_mask"),this.g.U("pose_segmentation_mask",(n,s)=>{this.h.poseSegmentationMasks=[qi(this,n,!0,!this.C)],H(this,s)}),this.g.attachEmptyPacketListener("pose_segmentation_mask",n=>{this.h.poseSegmentationMasks=[],H(this,n)})),this.g.attachProtoListener("face_landmarks",(n,s)=>{aa(n,this.h.faceLandmarks),H(this,s)}),this.g.attachEmptyPacketListener("face_landmarks",n=>{H(this,n)}),this.outputFaceBlendshapes&&(Se(t,"extra_blendshapes"),be(a,"FACE_BLENDSHAPES:extra_blendshapes"),this.g.attachProtoListener("extra_blendshapes",(n,s)=>{var u=this.h.faceBlendshapes;this.outputFaceBlendshapes&&(n=fs(n),u.push(El(n.g()??[]))),H(this,s)}),this.g.attachEmptyPacketListener("extra_blendshapes",n=>{H(this,n)})),this.g.attachProtoListener("left_hand_landmarks",(n,s)=>{aa(n,this.h.leftHandLandmarks),H(this,s)}),this.g.attachEmptyPacketListener("left_hand_landmarks",n=>{H(this,n)}),this.g.attachProtoListener("left_hand_world_landmarks",(n,s)=>{var u=this.h.leftHandWorldLandmarks;n=Ni(n),u.push(zn(n)),H(this,s)}),this.g.attachEmptyPacketListener("left_hand_world_landmarks",n=>{H(this,n)}),this.g.attachProtoListener("right_hand_landmarks",(n,s)=>{aa(n,this.h.rightHandLandmarks),H(this,s)}),this.g.attachEmptyPacketListener("right_hand_landmarks",n=>{H(this,n)}),this.g.attachProtoListener("right_hand_world_landmarks",(n,s)=>{var u=this.h.rightHandWorldLandmarks;n=Ni(n),u.push(zn(n)),H(this,s)}),this.g.attachEmptyPacketListener("right_hand_world_landmarks",n=>{H(this,n)}),t=t.g(),this.setGraph(new Uint8Array(t),!0)}};Ue.prototype.detectForVideo=Ue.prototype.F,Ue.prototype.detect=Ue.prototype.D,Ue.prototype.setOptions=Ue.prototype.o,Ue.createFromModelPath=function(e,t){return we(Ue,e,{baseOptions:{modelAssetPath:t}})},Ue.createFromModelBuffer=function(e,t){return we(Ue,e,{baseOptions:{modelAssetBuffer:t}})},Ue.createFromOptions=function(e,t){return we(Ue,e,t)},Ue.HAND_CONNECTIONS=Ll,Ue.POSE_CONNECTIONS=ug,Ue.FACE_LANDMARKS_LIPS=Rl,Ue.FACE_LANDMARKS_LEFT_EYE=Ml,Ue.FACE_LANDMARKS_LEFT_EYEBROW=Bl,Ue.FACE_LANDMARKS_LEFT_IRIS=ng,Ue.FACE_LANDMARKS_RIGHT_EYE=Nl,Ue.FACE_LANDMARKS_RIGHT_EYEBROW=Pl,Ue.FACE_LANDMARKS_RIGHT_IRIS=ag,Ue.FACE_LANDMARKS_FACE_OVAL=Dl,Ue.FACE_LANDMARKS_CONTOURS=sg,Ue.FACE_LANDMARKS_TESSELATION=og;var Pt=class extends wt{constructor(t,r){super(new jt(t,r),"input_image","norm_rect",!0),this.j={classifications:[]},ie(t=this.h=new W0,0,1,r=new Ve)}get baseOptions(){return ke(this.h,Ve,1)}set baseOptions(t){ie(this.h,0,1,t)}o(t){return ie(this.h,0,2,pu(t,ke(this.h,wl,2))),this.l(t)}sa(t,r){return this.j={classifications:[]},qt(this,t,r),this.j}ta(t,r,i){return this.j={classifications:[]},gr(this,t,i,r),this.j}m(){var t=new bt;Le(t,"input_image"),Le(t,"norm_rect"),Se(t,"classifications");const r=new Ct;er(r,Cv,this.h);const i=new ct;zt(i,"mediapipe.tasks.vision.image_classifier.ImageClassifierGraph"),Pe(i,"IMAGE:input_image"),Pe(i,"NORM_RECT:norm_rect"),be(i,"CLASSIFICATIONS:classifications"),i.o(r),Ot(t,i),this.g.attachProtoListener("classifications",(a,n)=>{this.j=function(s){const u={classifications:Er(s,mv,1).map(l=>{var h;return El(((h=ke(l,v0,4))==null?void 0:h.g())??[],Ft(l,2)??0,Vt(l,3)??"")})};return Ma(Fi(s,2))!=null&&(u.timestampMs=Ma(Fi(s,2))??0),u}(gv(a)),H(this,n)}),this.g.attachEmptyPacketListener("classifications",a=>{H(this,a)}),t=t.g(),this.setGraph(new Uint8Array(t),!0)}};Pt.prototype.classifyForVideo=Pt.prototype.ta,Pt.prototype.classify=Pt.prototype.sa,Pt.prototype.setOptions=Pt.prototype.o,Pt.createFromModelPath=function(e,t){return we(Pt,e,{baseOptions:{modelAssetPath:t}})},Pt.createFromModelBuffer=function(e,t){return we(Pt,e,{baseOptions:{modelAssetBuffer:t}})},Pt.createFromOptions=function(e,t){return we(Pt,e,t)};var kt=class extends wt{constructor(t,r){super(new jt(t,r),"image_in","norm_rect",!0),this.h=new V0,this.embeddings={embeddings:[]},ie(t=this.h,0,1,r=new Ve)}get baseOptions(){return ke(this.h,Ve,1)}set baseOptions(t){ie(this.h,0,1,t)}o(t){var r=this.h,i=ke(this.h,rp,2);return i=i?i.clone():new rp,t.l2Normalize!==void 0?Bn(i,1,t.l2Normalize):"l2Normalize"in t&&Ne(i,1),t.quantize!==void 0?Bn(i,2,t.quantize):"quantize"in t&&Ne(i,2),ie(r,0,2,i),this.l(t)}za(t,r){return qt(this,t,r),this.embeddings}Aa(t,r,i){return gr(this,t,i,r),this.embeddings}m(){var t=new bt;Le(t,"image_in"),Le(t,"norm_rect"),Se(t,"embeddings_out");const r=new Ct;er(r,Av,this.h);const i=new ct;zt(i,"mediapipe.tasks.vision.image_embedder.ImageEmbedderGraph"),Pe(i,"IMAGE:image_in"),Pe(i,"NORM_RECT:norm_rect"),be(i,"EMBEDDINGS:embeddings_out"),i.o(r),Ot(t,i),this.g.attachProtoListener("embeddings_out",(a,n)=>{a=wv(a),this.embeddings=function(s){return{embeddings:Er(s,_v,1).map(u=>{var h,p;const l={headIndex:Ft(u,3)??0??-1,headName:Vt(u,4)??""??""};if(U2(u,tp,Js(u,1))!==void 0)u=pi(u=ke(u,tp,Js(u,1)),1,Yr,ci()),l.floatEmbedding=u.slice();else{const m=new Uint8Array(0);l.quantizedEmbedding=((p=(h=ke(u,yv,Js(u,2)))==null?void 0:h.oa())==null?void 0:p.h())??m}return l}),timestampMs:Ma(Fi(s,2))??0}}(a),H(this,n)}),this.g.attachEmptyPacketListener("embeddings_out",a=>{H(this,a)}),t=t.g(),this.setGraph(new Uint8Array(t),!0)}};kt.cosineSimilarity=function(e,t){if(e.floatEmbedding&&t.floatEmbedding)e=op(e.floatEmbedding,t.floatEmbedding);else{if(!e.quantizedEmbedding||!t.quantizedEmbedding)throw Error("Cannot compute cosine similarity between quantized and float embeddings.");e=op(sp(e.quantizedEmbedding),sp(t.quantizedEmbedding))}return e},kt.prototype.embedForVideo=kt.prototype.Aa,kt.prototype.embed=kt.prototype.za,kt.prototype.setOptions=kt.prototype.o,kt.createFromModelPath=function(e,t){return we(kt,e,{baseOptions:{modelAssetPath:t}})},kt.createFromModelBuffer=function(e,t){return we(kt,e,{baseOptions:{modelAssetBuffer:t}})},kt.createFromOptions=function(e,t){return we(kt,e,t)};var gu=class{constructor(t,r,i){this.confidenceMasks=t,this.categoryMask=r,this.qualityScores=i}close(){var t,r;(t=this.confidenceMasks)==null||t.forEach(i=>{i.close()}),(r=this.categoryMask)==null||r.close()}};function Sp(e){e.categoryMask=void 0,e.confidenceMasks=void 0,e.qualityScores=void 0}function Tp(e){try{const t=new gu(e.confidenceMasks,e.categoryMask,e.qualityScores);if(!e.j)return t;e.j(t)}finally{_s(e)}}gu.prototype.close=gu.prototype.close;var gt=class extends wt{constructor(t,r){super(new jt(t,r),"image_in","norm_rect",!1),this.s=[],this.outputCategoryMask=!1,this.outputConfidenceMasks=!0,this.h=new Tl,this.v=new G0,ie(this.h,0,3,this.v),ie(t=this.h,0,1,r=new Ve)}get baseOptions(){return ke(this.h,Ve,1)}set baseOptions(t){ie(this.h,0,1,t)}o(t){return t.displayNamesLocale!==void 0?Ne(this.h,2,Qi(t.displayNamesLocale)):"displayNamesLocale"in t&&Ne(this.h,2),"outputCategoryMask"in t&&(this.outputCategoryMask=t.outputCategoryMask??!1),"outputConfidenceMasks"in t&&(this.outputConfidenceMasks=t.outputConfidenceMasks??!0),super.l(t)}I(){(function(t){var i,a;const r=Er(t.da(),ct,1).filter(n=>(Vt(n,1)??"").includes("mediapipe.tasks.TensorsToSegmentationCalculator"));if(t.s=[],r.length>1)throw Error("The graph has more than one mediapipe.tasks.TensorsToSegmentationCalculator.");r.length===1&&(((a=(i=ke(r[0],Ct,7))==null?void 0:i.l())==null?void 0:a.g())??new Map).forEach((n,s)=>{t.s[Number(s)]=Vt(n,1)??""})})(this)}segment(t,r,i){const a=typeof r!="function"?r:{};return this.j=typeof r=="function"?r:i,Sp(this),qt(this,t,a),Tp(this)}Ma(t,r,i,a){const n=typeof i!="function"?i:{};return this.j=typeof i=="function"?i:a,Sp(this),gr(this,t,n,r),Tp(this)}Da(){return this.s}m(){var t=new bt;Le(t,"image_in"),Le(t,"norm_rect");const r=new Ct;er(r,q0,this.h);const i=new ct;zt(i,"mediapipe.tasks.vision.image_segmenter.ImageSegmenterGraph"),Pe(i,"IMAGE:image_in"),Pe(i,"NORM_RECT:norm_rect"),i.o(r),Ot(t,i),ys(this,t),this.outputConfidenceMasks&&(Se(t,"confidence_masks"),be(i,"CONFIDENCE_MASKS:confidence_masks"),Vi(this,"confidence_masks"),this.g.ca("confidence_masks",(a,n)=>{this.confidenceMasks=a.map(s=>qi(this,s,!0,!this.j)),H(this,n)}),this.g.attachEmptyPacketListener("confidence_masks",a=>{this.confidenceMasks=[],H(this,a)})),this.outputCategoryMask&&(Se(t,"category_mask"),be(i,"CATEGORY_MASK:category_mask"),Vi(this,"category_mask"),this.g.U("category_mask",(a,n)=>{this.categoryMask=qi(this,a,!1,!this.j),H(this,n)}),this.g.attachEmptyPacketListener("category_mask",a=>{this.categoryMask=void 0,H(this,a)})),Se(t,"quality_scores"),be(i,"QUALITY_SCORES:quality_scores"),this.g.attachFloatVectorListener("quality_scores",(a,n)=>{this.qualityScores=a,H(this,n)}),this.g.attachEmptyPacketListener("quality_scores",a=>{this.categoryMask=void 0,H(this,a)}),t=t.g(),this.setGraph(new Uint8Array(t),!0)}};gt.prototype.getLabels=gt.prototype.Da,gt.prototype.segmentForVideo=gt.prototype.Ma,gt.prototype.segment=gt.prototype.segment,gt.prototype.setOptions=gt.prototype.o,gt.createFromModelPath=function(e,t){return we(gt,e,{baseOptions:{modelAssetPath:t}})},gt.createFromModelBuffer=function(e,t){return we(gt,e,{baseOptions:{modelAssetBuffer:t}})},gt.createFromOptions=function(e,t){return we(gt,e,t)};var yu=class{constructor(t,r,i){this.confidenceMasks=t,this.categoryMask=r,this.qualityScores=i}close(){var t,r;(t=this.confidenceMasks)==null||t.forEach(i=>{i.close()}),(r=this.categoryMask)==null||r.close()}};yu.prototype.close=yu.prototype.close;var Dv=class extends Q{constructor(t){super(t)}},Ti=[0,Ke,-2],La=[0,vr,-3,Fe,vr,-1],Ep=[0,La],Ip=[0,La,Ke,-1],ao=class extends Q{constructor(t){super(t)}},Cp=[0,vr,-1,Fe],Lv=class extends Q{constructor(t){super(t)}},Ap=class extends Q{constructor(t){super(t)}},_u=[1,2,3,4,5,6,7,8,9,10,14,15],lg=class extends Q{constructor(t){super(t)}};lg.prototype.g=ps([0,it,[0,_u,Oe,La,Oe,[0,La,Ti],Oe,Ep,Oe,[0,Ep,Ti],Oe,Cp,Oe,[0,vr,-3,Fe,Gt],Oe,[0,vr,-3,Fe],Oe,[0,Ae,vr,-2,Fe,Ke,Fe,-1,2,vr,Ti],Oe,Ip,Oe,[0,Ip,Ti],vr,Ti,Ae,Oe,[0,vr,-3,Fe,Ti,-1],Oe,[0,it,Cp]],Ae,[0,Ae,Ke,-1,Fe]]);var dr=class extends wt{constructor(t,r){super(new jt(t,r),"image_in","norm_rect_in",!1),this.outputCategoryMask=!1,this.outputConfidenceMasks=!0,this.h=new Tl,this.s=new G0,ie(this.h,0,3,this.s),ie(t=this.h,0,1,r=new Ve)}get baseOptions(){return ke(this.h,Ve,1)}set baseOptions(t){ie(this.h,0,1,t)}o(t){return"outputCategoryMask"in t&&(this.outputCategoryMask=t.outputCategoryMask??!1),"outputConfidenceMasks"in t&&(this.outputConfidenceMasks=t.outputConfidenceMasks??!0),super.l(t)}segment(t,r,i,a){const n=typeof i!="function"?i:{};this.j=typeof i=="function"?i:a,this.qualityScores=this.categoryMask=this.confidenceMasks=void 0,i=this.B+1,a=new lg;const s=new Ap;var u=new Dv;if(fr(u,1,255),ie(s,0,12,u),r.keypoint&&r.scribble)throw Error("Cannot provide both keypoint and scribble.");if(r.keypoint){var l=new ao;Bn(l,3,!0),J(l,1,r.keypoint.x),J(l,2,r.keypoint.y),Cn(s,5,_u,l)}else{if(!r.scribble)throw Error("Must provide either a keypoint or a scribble.");for(l of(u=new Lv,r.scribble))Bn(r=new ao,3,!0),J(r,1,l.x),J(r,2,l.y),Ba(u,1,ao,r);Cn(s,15,_u,u)}Ba(a,1,Ap,s),this.g.addProtoToStream(a.g(),"drishti.RenderData","roi_in",i),qt(this,t,n);e:{try{const p=new yu(this.confidenceMasks,this.categoryMask,this.qualityScores);if(!this.j){var h=p;break e}this.j(p)}finally{_s(this)}h=void 0}return h}m(){var t=new bt;Le(t,"image_in"),Le(t,"roi_in"),Le(t,"norm_rect_in");const r=new Ct;er(r,q0,this.h);const i=new ct;zt(i,"mediapipe.tasks.vision.interactive_segmenter.InteractiveSegmenterGraph"),Pe(i,"IMAGE:image_in"),Pe(i,"ROI:roi_in"),Pe(i,"NORM_RECT:norm_rect_in"),i.o(r),Ot(t,i),ys(this,t),this.outputConfidenceMasks&&(Se(t,"confidence_masks"),be(i,"CONFIDENCE_MASKS:confidence_masks"),Vi(this,"confidence_masks"),this.g.ca("confidence_masks",(a,n)=>{this.confidenceMasks=a.map(s=>qi(this,s,!0,!this.j)),H(this,n)}),this.g.attachEmptyPacketListener("confidence_masks",a=>{this.confidenceMasks=[],H(this,a)})),this.outputCategoryMask&&(Se(t,"category_mask"),be(i,"CATEGORY_MASK:category_mask"),Vi(this,"category_mask"),this.g.U("category_mask",(a,n)=>{this.categoryMask=qi(this,a,!1,!this.j),H(this,n)}),this.g.attachEmptyPacketListener("category_mask",a=>{this.categoryMask=void 0,H(this,a)})),Se(t,"quality_scores"),be(i,"QUALITY_SCORES:quality_scores"),this.g.attachFloatVectorListener("quality_scores",(a,n)=>{this.qualityScores=a,H(this,n)}),this.g.attachEmptyPacketListener("quality_scores",a=>{this.categoryMask=void 0,H(this,a)}),t=t.g(),this.setGraph(new Uint8Array(t),!0)}};dr.prototype.segment=dr.prototype.segment,dr.prototype.setOptions=dr.prototype.o,dr.createFromModelPath=function(e,t){return we(dr,e,{baseOptions:{modelAssetPath:t}})},dr.createFromModelBuffer=function(e,t){return we(dr,e,{baseOptions:{modelAssetBuffer:t}})},dr.createFromOptions=function(e,t){return we(dr,e,t)};var Dt=class extends wt{constructor(t,r){super(new jt(t,r),"input_frame_gpu","norm_rect",!1),this.j={detections:[]},ie(t=this.h=new H0,0,1,r=new Ve)}get baseOptions(){return ke(this.h,Ve,1)}set baseOptions(t){ie(this.h,0,1,t)}o(t){return t.displayNamesLocale!==void 0?Ne(this.h,2,Qi(t.displayNamesLocale)):"displayNamesLocale"in t&&Ne(this.h,2),t.maxResults!==void 0?fr(this.h,3,t.maxResults):"maxResults"in t&&Ne(this.h,3),t.scoreThreshold!==void 0?J(this.h,4,t.scoreThreshold):"scoreThreshold"in t&&Ne(this.h,4),t.categoryAllowlist!==void 0?Na(this.h,5,t.categoryAllowlist):"categoryAllowlist"in t&&Ne(this.h,5),t.categoryDenylist!==void 0?Na(this.h,6,t.categoryDenylist):"categoryDenylist"in t&&Ne(this.h,6),this.l(t)}D(t,r){return this.j={detections:[]},qt(this,t,r),this.j}F(t,r,i){return this.j={detections:[]},gr(this,t,i,r),this.j}m(){var t=new bt;Le(t,"input_frame_gpu"),Le(t,"norm_rect"),Se(t,"detections");const r=new Ct;er(r,Ov,this.h);const i=new ct;zt(i,"mediapipe.tasks.vision.ObjectDetectorGraph"),Pe(i,"IMAGE:input_frame_gpu"),Pe(i,"NORM_RECT:norm_rect"),be(i,"DETECTIONS:detections"),i.o(r),Ot(t,i),this.g.attachProtoVectorListener("detections",(a,n)=>{for(const s of a)a=x0(s),this.j.detections.push(X0(a));H(this,n)}),this.g.attachEmptyPacketListener("detections",a=>{H(this,a)}),t=t.g(),this.setGraph(new Uint8Array(t),!0)}};Dt.prototype.detectForVideo=Dt.prototype.F,Dt.prototype.detect=Dt.prototype.D,Dt.prototype.setOptions=Dt.prototype.o,Dt.createFromModelPath=async function(e,t){return we(Dt,e,{baseOptions:{modelAssetPath:t}})},Dt.createFromModelBuffer=function(e,t){return we(Dt,e,{baseOptions:{modelAssetBuffer:t}})},Dt.createFromOptions=function(e,t){return we(Dt,e,t)};var wu=class{constructor(t,r,i){this.landmarks=t,this.worldLandmarks=r,this.segmentationMasks=i}close(){var t;(t=this.segmentationMasks)==null||t.forEach(r=>{r.close()})}};function zp(e){e.landmarks=[],e.worldLandmarks=[],e.segmentationMasks=void 0}function Op(e){try{const t=new wu(e.landmarks,e.worldLandmarks,e.segmentationMasks);if(!e.s)return t;e.s(t)}finally{_s(e)}}wu.prototype.close=wu.prototype.close;var St=class extends wt{constructor(t,r){super(new jt(t,r),"image_in","norm_rect",!1),this.landmarks=[],this.worldLandmarks=[],this.outputSegmentationMasks=!1,ie(t=this.h=new K0,0,1,r=new Ve),this.v=new U0,ie(this.h,0,3,this.v),this.j=new L0,ie(this.h,0,2,this.j),fr(this.j,4,1),J(this.j,2,.5),J(this.v,2,.5),J(this.h,4,.5)}get baseOptions(){return ke(this.h,Ve,1)}set baseOptions(t){ie(this.h,0,1,t)}o(t){return"numPoses"in t&&fr(this.j,4,t.numPoses??1),"minPoseDetectionConfidence"in t&&J(this.j,2,t.minPoseDetectionConfidence??.5),"minTrackingConfidence"in t&&J(this.h,4,t.minTrackingConfidence??.5),"minPosePresenceConfidence"in t&&J(this.v,2,t.minPosePresenceConfidence??.5),"outputSegmentationMasks"in t&&(this.outputSegmentationMasks=t.outputSegmentationMasks??!1),this.l(t)}D(t,r,i){const a=typeof r!="function"?r:{};return this.s=typeof r=="function"?r:i,zp(this),qt(this,t,a),Op(this)}F(t,r,i,a){const n=typeof i!="function"?i:{};return this.s=typeof i=="function"?i:a,zp(this),gr(this,t,n,r),Op(this)}m(){var t=new bt;Le(t,"image_in"),Le(t,"norm_rect"),Se(t,"normalized_landmarks"),Se(t,"world_landmarks"),Se(t,"segmentation_masks");const r=new Ct;er(r,Rv,this.h);const i=new ct;zt(i,"mediapipe.tasks.vision.pose_landmarker.PoseLandmarkerGraph"),Pe(i,"IMAGE:image_in"),Pe(i,"NORM_RECT:norm_rect"),be(i,"NORM_LANDMARKS:normalized_landmarks"),be(i,"WORLD_LANDMARKS:world_landmarks"),i.o(r),Ot(t,i),ys(this,t),this.g.attachProtoVectorListener("normalized_landmarks",(a,n)=>{this.landmarks=[];for(const s of a)a=Wn(s),this.landmarks.push(gs(a));H(this,n)}),this.g.attachEmptyPacketListener("normalized_landmarks",a=>{this.landmarks=[],H(this,a)}),this.g.attachProtoVectorListener("world_landmarks",(a,n)=>{this.worldLandmarks=[];for(const s of a)a=Ni(s),this.worldLandmarks.push(zn(a));H(this,n)}),this.g.attachEmptyPacketListener("world_landmarks",a=>{this.worldLandmarks=[],H(this,a)}),this.outputSegmentationMasks&&(be(i,"SEGMENTATION_MASK:segmentation_masks"),Vi(this,"segmentation_masks"),this.g.ca("segmentation_masks",(a,n)=>{this.segmentationMasks=a.map(s=>qi(this,s,!0,!this.s)),H(this,n)}),this.g.attachEmptyPacketListener("segmentation_masks",a=>{this.segmentationMasks=[],H(this,a)})),t=t.g(),this.setGraph(new Uint8Array(t),!0)}};St.prototype.detectForVideo=St.prototype.F,St.prototype.detect=St.prototype.D,St.prototype.setOptions=St.prototype.o,St.createFromModelPath=function(e,t){return we(St,e,{baseOptions:{modelAssetPath:t}})},St.createFromModelBuffer=function(e,t){return we(St,e,{baseOptions:{modelAssetBuffer:t}})},St.createFromOptions=function(e,t){return we(St,e,t)},St.POSE_CONNECTIONS=ug;/*!
 * ONNX Runtime Web v1.21.0
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */var Ul=Object.defineProperty,Uv=Object.getOwnPropertyDescriptor,Fv=Object.getOwnPropertyNames,Wv=Object.prototype.hasOwnProperty,Vv=(e=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(e,{get:(t,r)=>(typeof require<"u"?require:t)[r]}):e)(function(e){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+e+'" is not supported')}),F=(e,t)=>()=>(e&&(t=e(e=0)),t),Vn=(e,t)=>{for(var r in t)Ul(e,r,{get:t[r],enumerable:!0})},Gv=(e,t,r,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let a of Fv(t))!Wv.call(e,a)&&a!==r&&Ul(e,a,{get:()=>t[a],enumerable:!(i=Uv(t,a))||i.enumerable});return e},Ua=e=>Gv(Ul({},"__esModule",{value:!0}),e),pn,Dr,Ai,Rp,dg,hg=F(()=>{pn=new Map,Dr=[],Ai=(e,t,r)=>{if(t&&typeof t.init=="function"&&typeof t.createInferenceSessionHandler=="function"){let i=pn.get(e);if(i===void 0)pn.set(e,{backend:t,priority:r});else{if(i.priority>r)return;if(i.priority===r&&i.backend!==t)throw new Error(`cannot register backend "${e}" using priority ${r}`)}if(r>=0){let a=Dr.indexOf(e);a!==-1&&Dr.splice(a,1);for(let n=0;n<Dr.length;n++)if(pn.get(Dr[n]).priority<=r){Dr.splice(n,0,e);return}Dr.push(e)}return}throw new TypeError("not a valid backend")},Rp=async e=>{let t=pn.get(e);if(!t)return"backend not found.";if(t.initialized)return t.backend;if(t.aborted)return t.error;{let r=!!t.initPromise;try{return r||(t.initPromise=t.backend.init(e)),await t.initPromise,t.initialized=!0,t.backend}catch(i){return r||(t.error=`${i}`,t.aborted=!0),t.error}finally{delete t.initPromise}}},dg=async e=>{let t=e.executionProviders||[],r=t.map(l=>typeof l=="string"?l:l.name),i=r.length===0?Dr:r,a,n=[],s=new Set;for(let l of i){let h=await Rp(l);typeof h=="string"?n.push({name:l,err:h}):(a||(a=h),a===h&&s.add(l))}if(!a)throw new Error(`no available backend found. ERR: ${n.map(l=>`[${l.name}] ${l.err}`).join(", ")}`);for(let{name:l,err:h}of n)r.includes(l)&&console.warn(`removing requested execution provider "${l}" from session options because it is not available: ${h}`);let u=t.filter(l=>s.has(typeof l=="string"?l:l.name));return[a,new Proxy(e,{get:(l,h)=>h==="executionProviders"?u:Reflect.get(l,h)})]}}),jv=F(()=>{hg()}),cg,qv=F(()=>{cg="1.21.0"}),so,Lt,pg=F(()=>{qv(),so="warning",Lt={wasm:{},webgl:{},webgpu:{},versions:{common:cg},set logLevel(e){if(e!==void 0){if(typeof e!="string"||["verbose","info","warning","error","fatal"].indexOf(e)===-1)throw new Error(`Unsupported logging level: ${e}`);so=e}},get logLevel(){return so}},Object.defineProperty(Lt,"logLevel",{enumerable:!0})}),ze,Hv=F(()=>{pg(),ze=Lt}),fg,mg,Kv=F(()=>{fg=(e,t)=>{let r=typeof document<"u"?document.createElement("canvas"):new OffscreenCanvas(1,1);r.width=e.dims[3],r.height=e.dims[2];let i=r.getContext("2d");if(i!=null){let a,n;(t==null?void 0:t.tensorLayout)!==void 0&&t.tensorLayout==="NHWC"?(a=e.dims[2],n=e.dims[3]):(a=e.dims[3],n=e.dims[2]);let s=(t==null?void 0:t.format)!==void 0?t.format:"RGB",u=t==null?void 0:t.norm,l,h;u===void 0||u.mean===void 0?l=[255,255,255,255]:typeof u.mean=="number"?l=[u.mean,u.mean,u.mean,u.mean]:(l=[u.mean[0],u.mean[1],u.mean[2],0],u.mean[3]!==void 0&&(l[3]=u.mean[3])),u===void 0||u.bias===void 0?h=[0,0,0,0]:typeof u.bias=="number"?h=[u.bias,u.bias,u.bias,u.bias]:(h=[u.bias[0],u.bias[1],u.bias[2],0],u.bias[3]!==void 0&&(h[3]=u.bias[3]));let p=n*a,m=0,g=p,_=p*2,w=-1;s==="RGBA"?(m=0,g=p,_=p*2,w=p*3):s==="RGB"?(m=0,g=p,_=p*2):s==="RBG"&&(m=0,_=p,g=p*2);for(let b=0;b<n;b++)for(let k=0;k<a;k++){let $=(e.data[m++]-h[0])*l[0],v=(e.data[g++]-h[1])*l[1],T=(e.data[_++]-h[2])*l[2],S=w===-1?255:(e.data[w++]-h[3])*l[3];i.fillStyle="rgba("+$+","+v+","+T+","+S+")",i.fillRect(k,b,1,1)}if("toDataURL"in r)return r.toDataURL();throw new Error("toDataURL is not supported")}else throw new Error("Can not access image data")},mg=(e,t)=>{let r=typeof document<"u"?document.createElement("canvas").getContext("2d"):new OffscreenCanvas(1,1).getContext("2d"),i;if(r!=null){let a,n,s;(t==null?void 0:t.tensorLayout)!==void 0&&t.tensorLayout==="NHWC"?(a=e.dims[2],n=e.dims[1],s=e.dims[3]):(a=e.dims[3],n=e.dims[2],s=e.dims[1]);let u=t!==void 0&&t.format!==void 0?t.format:"RGB",l=t==null?void 0:t.norm,h,p;l===void 0||l.mean===void 0?h=[255,255,255,255]:typeof l.mean=="number"?h=[l.mean,l.mean,l.mean,l.mean]:(h=[l.mean[0],l.mean[1],l.mean[2],255],l.mean[3]!==void 0&&(h[3]=l.mean[3])),l===void 0||l.bias===void 0?p=[0,0,0,0]:typeof l.bias=="number"?p=[l.bias,l.bias,l.bias,l.bias]:(p=[l.bias[0],l.bias[1],l.bias[2],0],l.bias[3]!==void 0&&(p[3]=l.bias[3]));let m=n*a;if(t!==void 0&&(t.format!==void 0&&s===4&&t.format!=="RGBA"||s===3&&t.format!=="RGB"&&t.format!=="BGR"))throw new Error("Tensor format doesn't match input tensor dims");let g=4,_=0,w=1,b=2,k=3,$=0,v=m,T=m*2,S=-1;u==="RGBA"?($=0,v=m,T=m*2,S=m*3):u==="RGB"?($=0,v=m,T=m*2):u==="RBG"&&($=0,T=m,v=m*2),i=r.createImageData(a,n);for(let E=0;E<n*a;_+=g,w+=g,b+=g,k+=g,E++)i.data[_]=(e.data[$++]-p[0])*h[0],i.data[w]=(e.data[v++]-p[1])*h[1],i.data[b]=(e.data[T++]-p[2])*h[2],i.data[k]=S===-1?255:(e.data[S++]-p[3])*h[3]}else throw new Error("Can not access image data");return i}}),sa,gg,yg,_g,wg,bg,Xv=F(()=>{Fl(),sa=(e,t)=>{if(e===void 0)throw new Error("Image buffer must be defined");if(t.height===void 0||t.width===void 0)throw new Error("Image height and width must be defined");if(t.tensorLayout==="NHWC")throw new Error("NHWC Tensor layout is not supported yet");let{height:r,width:i}=t,a=t.norm??{mean:255,bias:0},n,s;typeof a.mean=="number"?n=[a.mean,a.mean,a.mean,a.mean]:n=[a.mean[0],a.mean[1],a.mean[2],a.mean[3]??255],typeof a.bias=="number"?s=[a.bias,a.bias,a.bias,a.bias]:s=[a.bias[0],a.bias[1],a.bias[2],a.bias[3]??0];let u=t.format!==void 0?t.format:"RGBA",l=t.tensorFormat!==void 0&&t.tensorFormat!==void 0?t.tensorFormat:"RGB",h=r*i,p=l==="RGBA"?new Float32Array(h*4):new Float32Array(h*3),m=4,g=0,_=1,w=2,b=3,k=0,$=h,v=h*2,T=-1;u==="RGB"&&(m=3,g=0,_=1,w=2,b=-1),l==="RGBA"?T=h*3:l==="RBG"?(k=0,v=h,$=h*2):l==="BGR"&&(v=0,$=h,k=h*2);for(let S=0;S<h;S++,g+=m,w+=m,_+=m,b+=m)p[k++]=(e[g]+s[0])/n[0],p[$++]=(e[_]+s[1])/n[1],p[v++]=(e[w]+s[2])/n[2],T!==-1&&b!==-1&&(p[T++]=(e[b]+s[3])/n[3]);return l==="RGBA"?new Et("float32",p,[1,4,r,i]):new Et("float32",p,[1,3,r,i])},gg=async(e,t)=>{let r=typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement,i=typeof ImageData<"u"&&e instanceof ImageData,a=typeof ImageBitmap<"u"&&e instanceof ImageBitmap,n=typeof e=="string",s,u=t??{},l=()=>{if(typeof document<"u")return document.createElement("canvas");if(typeof OffscreenCanvas<"u")return new OffscreenCanvas(1,1);throw new Error("Canvas is not supported")},h=p=>typeof HTMLCanvasElement<"u"&&p instanceof HTMLCanvasElement||p instanceof OffscreenCanvas?p.getContext("2d"):null;if(r){let p=l();p.width=e.width,p.height=e.height;let m=h(p);if(m!=null){let g=e.height,_=e.width;if(t!==void 0&&t.resizedHeight!==void 0&&t.resizedWidth!==void 0&&(g=t.resizedHeight,_=t.resizedWidth),t!==void 0){if(u=t,t.tensorFormat!==void 0)throw new Error("Image input config format must be RGBA for HTMLImageElement");u.tensorFormat="RGBA",u.height=g,u.width=_}else u.tensorFormat="RGBA",u.height=g,u.width=_;m.drawImage(e,0,0),s=m.getImageData(0,0,_,g).data}else throw new Error("Can not access image data")}else if(i){let p,m;if(t!==void 0&&t.resizedWidth!==void 0&&t.resizedHeight!==void 0?(p=t.resizedHeight,m=t.resizedWidth):(p=e.height,m=e.width),t!==void 0&&(u=t),u.format="RGBA",u.height=p,u.width=m,t!==void 0){let g=l();g.width=m,g.height=p;let _=h(g);if(_!=null)_.putImageData(e,0,0),s=_.getImageData(0,0,m,p).data;else throw new Error("Can not access image data")}else s=e.data}else if(a){if(t===void 0)throw new Error("Please provide image config with format for Imagebitmap");let p=l();p.width=e.width,p.height=e.height;let m=h(p);if(m!=null){let g=e.height,_=e.width;return m.drawImage(e,0,0,_,g),s=m.getImageData(0,0,_,g).data,u.height=g,u.width=_,sa(s,u)}else throw new Error("Can not access image data")}else{if(n)return new Promise((p,m)=>{let g=l(),_=h(g);if(!e||!_)return m();let w=new Image;w.crossOrigin="Anonymous",w.src=e,w.onload=()=>{g.width=w.width,g.height=w.height,_.drawImage(w,0,0,g.width,g.height);let b=_.getImageData(0,0,g.width,g.height);u.height=g.height,u.width=g.width,p(sa(b.data,u))}});throw new Error("Input data provided is not supported - aborted tensor creation")}if(s!==void 0)return sa(s,u);throw new Error("Input data provided is not supported - aborted tensor creation")},yg=(e,t)=>{let{width:r,height:i,download:a,dispose:n}=t,s=[1,i,r,4];return new Et({location:"texture",type:"float32",texture:e,dims:s,download:a,dispose:n})},_g=(e,t)=>{let{dataType:r,dims:i,download:a,dispose:n}=t;return new Et({location:"gpu-buffer",type:r??"float32",gpuBuffer:e,dims:i,download:a,dispose:n})},wg=(e,t)=>{let{dataType:r,dims:i,download:a,dispose:n}=t;return new Et({location:"ml-tensor",type:r??"float32",mlTensor:e,dims:i,download:a,dispose:n})},bg=(e,t,r)=>new Et({location:"cpu-pinned",type:e,data:t,dims:r??[t.length]})}),li,Sn,oo,vg,Yv=F(()=>{li=new Map([["float32",Float32Array],["uint8",Uint8Array],["int8",Int8Array],["uint16",Uint16Array],["int16",Int16Array],["int32",Int32Array],["bool",Uint8Array],["float64",Float64Array],["uint32",Uint32Array],["int4",Uint8Array],["uint4",Uint8Array]]),Sn=new Map([[Float32Array,"float32"],[Uint8Array,"uint8"],[Int8Array,"int8"],[Uint16Array,"uint16"],[Int16Array,"int16"],[Int32Array,"int32"],[Float64Array,"float64"],[Uint32Array,"uint32"]]),oo=!1,vg=()=>{if(!oo){oo=!0;let e=typeof BigInt64Array<"u"&&BigInt64Array.from,t=typeof BigUint64Array<"u"&&BigUint64Array.from,r=globalThis.Float16Array,i=typeof r<"u"&&r.from;e&&(li.set("int64",BigInt64Array),Sn.set(BigInt64Array,"int64")),t&&(li.set("uint64",BigUint64Array),Sn.set(BigUint64Array,"uint64")),i?(li.set("float16",r),Sn.set(r,"float16")):li.set("float16",Uint16Array)}}}),$g,xg,Qv=F(()=>{Fl(),$g=e=>{let t=1;for(let r=0;r<e.length;r++){let i=e[r];if(typeof i!="number"||!Number.isSafeInteger(i))throw new TypeError(`dims[${r}] must be an integer, got: ${i}`);if(i<0)throw new RangeError(`dims[${r}] must be a non-negative integer, got: ${i}`);t*=i}return t},xg=(e,t)=>{switch(e.location){case"cpu":return new Et(e.type,e.data,t);case"cpu-pinned":return new Et({location:"cpu-pinned",data:e.data,type:e.type,dims:t});case"texture":return new Et({location:"texture",texture:e.texture,type:e.type,dims:t});case"gpu-buffer":return new Et({location:"gpu-buffer",gpuBuffer:e.gpuBuffer,type:e.type,dims:t});case"ml-tensor":return new Et({location:"ml-tensor",mlTensor:e.mlTensor,type:e.type,dims:t});default:throw new Error(`tensorReshape: tensor location ${e.location} is not supported`)}}}),Et,Fl=F(()=>{Kv(),Xv(),Yv(),Qv(),Et=class{constructor(e,t,r){vg();let i,a;if(typeof e=="object"&&"location"in e)switch(this.dataLocation=e.location,i=e.type,a=e.dims,e.location){case"cpu-pinned":{let s=li.get(i);if(!s)throw new TypeError(`unsupported type "${i}" to create tensor from pinned buffer`);if(!(e.data instanceof s))throw new TypeError(`buffer should be of type ${s.name}`);this.cpuData=e.data;break}case"texture":{if(i!=="float32")throw new TypeError(`unsupported type "${i}" to create tensor from texture`);this.gpuTextureData=e.texture,this.downloader=e.download,this.disposer=e.dispose;break}case"gpu-buffer":{if(i!=="float32"&&i!=="float16"&&i!=="int32"&&i!=="int64"&&i!=="uint32"&&i!=="uint8"&&i!=="bool"&&i!=="uint4"&&i!=="int4")throw new TypeError(`unsupported type "${i}" to create tensor from gpu buffer`);this.gpuBufferData=e.gpuBuffer,this.downloader=e.download,this.disposer=e.dispose;break}case"ml-tensor":{if(i!=="float32"&&i!=="float16"&&i!=="int32"&&i!=="int64"&&i!=="uint32"&&i!=="uint64"&&i!=="int8"&&i!=="uint8"&&i!=="bool"&&i!=="uint4"&&i!=="int4")throw new TypeError(`unsupported type "${i}" to create tensor from MLTensor`);this.mlTensorData=e.mlTensor,this.downloader=e.download,this.disposer=e.dispose;break}default:throw new Error(`Tensor constructor: unsupported location '${this.dataLocation}'`)}else{let s,u;if(typeof e=="string")if(i=e,u=r,e==="string"){if(!Array.isArray(t))throw new TypeError("A string tensor's data must be a string array.");s=t}else{let l=li.get(e);if(l===void 0)throw new TypeError(`Unsupported tensor type: ${e}.`);if(Array.isArray(t)){if(e==="float16"&&l===Uint16Array||e==="uint4"||e==="int4")throw new TypeError(`Creating a ${e} tensor from number array is not supported. Please use ${l.name} as data.`);e==="uint64"||e==="int64"?s=l.from(t,BigInt):s=l.from(t)}else if(t instanceof l)s=t;else if(t instanceof Uint8ClampedArray)if(e==="uint8")s=Uint8Array.from(t);else throw new TypeError("A Uint8ClampedArray tensor's data must be type of uint8");else if(e==="float16"&&t instanceof Uint16Array&&l!==Uint16Array)s=new globalThis.Float16Array(t.buffer,t.byteOffset,t.length);else throw new TypeError(`A ${i} tensor's data must be type of ${l}`)}else if(u=t,Array.isArray(e)){if(e.length===0)throw new TypeError("Tensor type cannot be inferred from an empty array.");let l=typeof e[0];if(l==="string")i="string",s=e;else if(l==="boolean")i="bool",s=Uint8Array.from(e);else throw new TypeError(`Invalid element type of data array: ${l}.`)}else if(e instanceof Uint8ClampedArray)i="uint8",s=Uint8Array.from(e);else{let l=Sn.get(e.constructor);if(l===void 0)throw new TypeError(`Unsupported type for tensor data: ${e.constructor}.`);i=l,s=e}if(u===void 0)u=[s.length];else if(!Array.isArray(u))throw new TypeError("A tensor's dims must be a number array");a=u,this.cpuData=s,this.dataLocation="cpu"}let n=$g(a);if(this.cpuData&&n!==this.cpuData.length&&!((i==="uint4"||i==="int4")&&Math.ceil(n/2)===this.cpuData.length))throw new Error(`Tensor's size(${n}) does not match data length(${this.cpuData.length}).`);this.type=i,this.dims=a,this.size=n}static async fromImage(e,t){return gg(e,t)}static fromTexture(e,t){return yg(e,t)}static fromGpuBuffer(e,t){return _g(e,t)}static fromMLTensor(e,t){return wg(e,t)}static fromPinnedBuffer(e,t,r){return bg(e,t,r)}toDataURL(e){return fg(this,e)}toImageData(e){return mg(this,e)}get data(){if(this.ensureValid(),!this.cpuData)throw new Error("The data is not on CPU. Use `getData()` to download GPU data to CPU, or use `texture` or `gpuBuffer` property to access the GPU data directly.");return this.cpuData}get location(){return this.dataLocation}get texture(){if(this.ensureValid(),!this.gpuTextureData)throw new Error("The data is not stored as a WebGL texture.");return this.gpuTextureData}get gpuBuffer(){if(this.ensureValid(),!this.gpuBufferData)throw new Error("The data is not stored as a WebGPU buffer.");return this.gpuBufferData}get mlTensor(){if(this.ensureValid(),!this.mlTensorData)throw new Error("The data is not stored as a WebNN MLTensor.");return this.mlTensorData}async getData(e){switch(this.ensureValid(),this.dataLocation){case"cpu":case"cpu-pinned":return this.data;case"texture":case"gpu-buffer":case"ml-tensor":{if(!this.downloader)throw new Error("The current tensor is not created with a specified data downloader.");if(this.isDownloading)throw new Error("The current tensor is being downloaded.");try{this.isDownloading=!0;let t=await this.downloader();return this.downloader=void 0,this.dataLocation="cpu",this.cpuData=t,e&&this.disposer&&(this.disposer(),this.disposer=void 0),t}finally{this.isDownloading=!1}}default:throw new Error(`cannot get data from location: ${this.dataLocation}`)}}dispose(){if(this.isDownloading)throw new Error("The current tensor is being downloaded.");this.disposer&&(this.disposer(),this.disposer=void 0),this.cpuData=void 0,this.gpuTextureData=void 0,this.gpuBufferData=void 0,this.mlTensorData=void 0,this.downloader=void 0,this.isDownloading=void 0,this.dataLocation="none"}ensureValid(){if(this.dataLocation==="none")throw new Error("The tensor is disposed.")}reshape(e){if(this.ensureValid(),this.downloader||this.disposer)throw new Error("Cannot reshape a tensor that owns GPU resource.");return xg(this,e)}}}),Zt,kg=F(()=>{Fl(),Zt=Et}),Fa,uo,mr,Jt,Sg=F(()=>{pg(),Fa=(e,t)=>{(typeof Lt.trace>"u"?!Lt.wasm.trace:!Lt.trace)||console.timeStamp(`${e}::ORT::${t}`)},uo=(e,t)=>{var a;let r=((a=new Error().stack)==null?void 0:a.split(/\r\n|\r|\n/g))||[],i=!1;for(let n=0;n<r.length;n++){if(i&&!r[n].includes("TRACE_FUNC")){let s=`FUNC_${e}::${r[n].trim().split(" ")[1]}`;t&&(s+=`::${t}`),Fa("CPU",s);return}r[n].includes("TRACE_FUNC")&&(i=!0)}},mr=e=>{(typeof Lt.trace>"u"?!Lt.wasm.trace:!Lt.trace)||uo("BEGIN",e)},Jt=e=>{(typeof Lt.trace>"u"?!Lt.wasm.trace:!Lt.trace)||uo("END",e)}}),Tg,Zv=F(()=>{hg(),kg(),Sg(),Tg=class Eg{constructor(t){this.handler=t}async run(t,r,i){mr();let a={},n={};if(typeof t!="object"||t===null||t instanceof Zt||Array.isArray(t))throw new TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.");let s=!0;if(typeof r=="object"){if(r===null)throw new TypeError("Unexpected argument[1]: cannot be null.");if(r instanceof Zt)throw new TypeError("'fetches' cannot be a Tensor");if(Array.isArray(r)){if(r.length===0)throw new TypeError("'fetches' cannot be an empty array.");s=!1;for(let h of r){if(typeof h!="string")throw new TypeError("'fetches' must be a string array or an object.");if(this.outputNames.indexOf(h)===-1)throw new RangeError(`'fetches' contains invalid output name: ${h}.`);a[h]=null}if(typeof i=="object"&&i!==null)n=i;else if(typeof i<"u")throw new TypeError("'options' must be an object.")}else{let h=!1,p=Object.getOwnPropertyNames(r);for(let m of this.outputNames)if(p.indexOf(m)!==-1){let g=r[m];(g===null||g instanceof Zt)&&(h=!0,s=!1,a[m]=g)}if(h){if(typeof i=="object"&&i!==null)n=i;else if(typeof i<"u")throw new TypeError("'options' must be an object.")}else n=r}}else if(typeof r<"u")throw new TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");for(let h of this.inputNames)if(typeof t[h]>"u")throw new Error(`input '${h}' is missing in 'feeds'.`);if(s)for(let h of this.outputNames)a[h]=null;let u=await this.handler.run(t,a,n),l={};for(let h in u)if(Object.hasOwnProperty.call(u,h)){let p=u[h];p instanceof Zt?l[h]=p:l[h]=new Zt(p.type,p.data,p.dims)}return Jt(),l}async release(){return this.handler.dispose()}static async create(t,r,i,a){mr();let n,s={};if(typeof t=="string"){if(n=t,typeof r=="object"&&r!==null)s=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof Uint8Array){if(n=t,typeof r=="object"&&r!==null)s=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof ArrayBuffer||typeof SharedArrayBuffer<"u"&&t instanceof SharedArrayBuffer){let p=t,m=0,g=t.byteLength;if(typeof r=="object"&&r!==null)s=r;else if(typeof r=="number"){if(m=r,!Number.isSafeInteger(m))throw new RangeError("'byteOffset' must be an integer.");if(m<0||m>=p.byteLength)throw new RangeError(`'byteOffset' is out of range [0, ${p.byteLength}).`);if(g=t.byteLength-m,typeof i=="number"){if(g=i,!Number.isSafeInteger(g))throw new RangeError("'byteLength' must be an integer.");if(g<=0||m+g>p.byteLength)throw new RangeError(`'byteLength' is out of range (0, ${p.byteLength-m}].`);if(typeof a=="object"&&a!==null)s=a;else if(typeof a<"u")throw new TypeError("'options' must be an object.")}else if(typeof i<"u")throw new TypeError("'byteLength' must be a number.")}else if(typeof r<"u")throw new TypeError("'options' must be an object.");n=new Uint8Array(p,m,g)}else throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");let[u,l]=await dg(s),h=await u.createInferenceSessionHandler(n,l);return Jt(),new Eg(h)}startProfiling(){this.handler.startProfiling()}endProfiling(){this.handler.endProfiling()}get inputNames(){return this.handler.inputNames}get outputNames(){return this.handler.outputNames}}}),Wl,Jv=F(()=>{Zv(),Wl=Tg}),e$=F(()=>{}),t$=F(()=>{}),r$=F(()=>{}),i$=F(()=>{}),n$={};Vn(n$,{InferenceSession:()=>Wl,TRACE:()=>Fa,TRACE_FUNC_BEGIN:()=>mr,TRACE_FUNC_END:()=>Jt,Tensor:()=>Zt,env:()=>ze,registerBackend:()=>Ai});var nr=F(()=>{jv(),Hv(),Jv(),kg(),e$(),t$(),Sg(),r$(),i$()}),Vl=F(()=>{}),Ig={};Vn(Ig,{default:()=>Cg});var lo,ho,Cg,a$=F(()=>{var e;O_(),vi(),Gl(),lo="ort-wasm-proxy-worker",ho=((e=globalThis.self)==null?void 0:e.name)===lo,ho&&(self.onmessage=t=>{let{type:r,in:i}=t.data;try{switch(r){case"init-wasm":jl(i.wasm).then(()=>{ld(i).then(()=>{postMessage({type:r})},a=>{postMessage({type:r,err:a})})},a=>{postMessage({type:r,err:a})});break;case"init-ep":{let{epName:a,env:n}=i;dd(n,a).then(()=>{postMessage({type:r})},s=>{postMessage({type:r,err:s})});break}case"copy-from":{let{buffer:a}=i,n=Ha(a);postMessage({type:r,out:n});break}case"create":{let{model:a,options:n}=i;hd(a,n).then(s=>{postMessage({type:r,out:s})},s=>{postMessage({type:r,err:s})});break}case"release":cd(i),postMessage({type:r});break;case"run":{let{sessionId:a,inputIndices:n,inputs:s,outputIndices:u,options:l}=i;pd(a,n,s,u,new Array(u.length).fill(null),l).then(h=>{h.some(p=>p[3]!=="cpu")?postMessage({type:r,err:"Proxy does not support non-cpu tensor location."}):postMessage({type:r,out:h},md([...s,...h]))},h=>{postMessage({type:r,err:h})});break}case"end-profiling":fd(i),postMessage({type:r});break;default:}}catch(a){postMessage({type:r,err:a})}}),Cg=ho?null:t=>new Worker(t??Tt,{type:"module",name:lo})}),Ag={};Vn(Ag,{default:()=>zg});var co,po,zg,Mp,s$=F(()=>{var e,t;po=(co=import.meta.url,async function(r={}){var xc;var i,a,n=r,s=new Promise((o,d)=>{i=o,a=d}),u=typeof window=="object",l=typeof WorkerGlobalScope<"u",h=l&&((xc=self.name)==null?void 0:xc.startsWith("em-pthread"));n.mountExternalData=(o,d)=>{o.startsWith("./")&&(o=o.substring(2)),(n.Bd||(n.Bd=new Map)).set(o,d)},n.unmountExternalData=()=>{delete n.Bd};var p=globalThis.SharedArrayBuffer??new WebAssembly.Memory({initial:0,maximum:0,shared:!0}).buffer.constructor;let m=()=>{let o=(c,f,y)=>(...x)=>{let I=sr,z=f==null?void 0:f();x=c(...x);let R=f==null?void 0:f();return z!==R&&(c=R,y(z),f=y=null),sr!=I?new Promise((U,j)=>{Ps={resolve:U,reject:j}}):x},d=c=>async(...f)=>{var y;try{if(n.Cd)throw Error("Session already started");let x=n.Cd={be:f[0],errors:[]},I=await c(...f);if(n.Cd!==x)throw Error("Session mismatch");(y=n.Dd)==null||y.flush();let z=x.errors;if(0<z.length){let R=await Promise.all(z);if(R=R.filter(U=>U),0<R.length)throw Error(R.join(`
`))}return I}finally{n.Cd=null}};n._OrtCreateSession=o(n._OrtCreateSession,()=>n._OrtCreateSession,c=>n._OrtCreateSession=c),n._OrtRun=d(o(n._OrtRun,()=>n._OrtRun,c=>n._OrtRun=c)),n._OrtRunWithBinding=d(o(n._OrtRunWithBinding,()=>n._OrtRunWithBinding,c=>n._OrtRunWithBinding=c)),n._OrtBindInput=o(n._OrtBindInput,()=>n._OrtBindInput,c=>n._OrtBindInput=c),m=void 0};n.jsepInit=(o,d)=>{if(m==null||m(),o==="webgpu"){[n.Dd,n.Rd,n.Vd,n.Hd,n.Ud,n.hc,n.Wd,n.Zd,n.Sd,n.Td,n.Xd]=d;let c=n.Dd;n.jsepRegisterBuffer=(f,y,x,I)=>c.registerBuffer(f,y,x,I),n.jsepGetBuffer=f=>c.getBuffer(f),n.jsepCreateDownloader=(f,y,x)=>c.createDownloader(f,y,x),n.jsepOnCreateSession=f=>{c.onCreateSession(f)},n.jsepOnReleaseSession=f=>{c.onReleaseSession(f)},n.jsepOnRunStart=f=>c.onRunStart(f),n.$d=(f,y)=>{c.upload(f,y)}}else if(o==="webnn"){[n.Dd,n.Yd,n.Id,n.jsepEnsureTensor,n.Jd,n.jsepDownloadTensor]=d,n.jsepReleaseTensorId=n.Id,n.jsepUploadTensor=n.Jd;let c=n.Dd;n.jsepOnRunStart=f=>c.onRunStart(f),n.jsepOnRunEnd=c.onRunEnd.bind(c),n.jsepRegisterMLContext=(f,y)=>{c.registerMLContext(f,y)},n.jsepOnReleaseSession=f=>{c.onReleaseSession(f)},n.jsepCreateMLTensorDownloader=(f,y)=>c.createMLTensorDownloader(f,y),n.jsepRegisterMLTensor=(f,y,x,I)=>c.registerMLTensor(f,y,x,I),n.jsepCreateMLContext=f=>c.createMLContext(f),n.jsepRegisterMLConstant=(f,y,x,I,z)=>c.registerMLConstant(f,y,x,I,z,n.Bd),n.jsepRegisterGraphInput=c.registerGraphInput.bind(c),n.jsepIsGraphInput=c.isGraphInput.bind(c),n.jsepCreateTemporaryTensor=c.createTemporaryTensor.bind(c)}};var g,_,w=Object.assign({},n),b=(o,d)=>{throw d},k="";(u||l)&&(l?k=self.location.href:typeof document<"u"&&document.currentScript&&(k=document.currentScript.src),co&&(k=co),k=k.startsWith("blob:")?"":k.slice(0,k.replace(/[?#].*/,"").lastIndexOf("/")+1),l&&(_=o=>{var d=new XMLHttpRequest;return d.open("GET",o,!1),d.responseType="arraybuffer",d.send(null),new Uint8Array(d.response)}),g=async o=>{if(Ee(o))return new Promise((c,f)=>{var y=new XMLHttpRequest;y.open("GET",o,!0),y.responseType="arraybuffer",y.onload=()=>{y.status==200||y.status==0&&y.response?c(y.response):f(y.status)},y.onerror=f,y.send(null)});var d=await fetch(o,{credentials:"same-origin"});if(d.ok)return d.arrayBuffer();throw Error(d.status+" : "+d.url)});var $=console.log.bind(console),v=console.error.bind(console),T=$,S=v;Object.assign(n,w),w=null;var E,C,A,M,D,G,oe,he,Z,ue,ne,V,ye,Te=n.wasmBinary,q=!1,Ee=o=>o.startsWith("file://");function N(){return E.buffer!=M.buffer&&Ie(),M}function W(){return E.buffer!=M.buffer&&Ie(),D}function ge(){return E.buffer!=M.buffer&&Ie(),G}function Be(){return E.buffer!=M.buffer&&Ie(),oe}function P(){return E.buffer!=M.buffer&&Ie(),he}function ve(){return E.buffer!=M.buffer&&Ie(),Z}function Rt(){return E.buffer!=M.buffer&&Ie(),ue}function mt(){return E.buffer!=M.buffer&&Ie(),ye}if(h){let o=function(d){try{var c=d.data,f=c.yd;if(f==="load"){let y=[];self.onmessage=x=>y.push(x),self.startWorker=()=>{postMessage({yd:"loaded"});for(let x of y)o(x);self.onmessage=o};for(let x of c.Od)n[x]&&!n[x].proxy||(n[x]=(...I)=>{postMessage({yd:"callHandler",Nd:x,args:I})},x=="print"&&(T=n[x]),x=="printErr"&&(S=n[x]));E=c.he,Ie(),Jr(c.ie)}else if(f==="run"){q_(c.xd),Fs(c.xd,0,0,1,0,0),kd(),Bs(c.xd),Ze||(_h(),Ze=!0);try{H_(c.de,c.Fd)}catch(y){if(y!="unwind")throw y}}else c.target!=="setimmediate"&&(f==="checkMailbox"?Ze&&jn():f&&(S(`worker: received unknown command ${f}`),S(c)))}catch(y){throw wh(),y}};var Jr,Ze=!1;S=function(...d){d=d.join(" "),console.error(d)},self.alert=function(...d){postMessage({yd:"alert",text:d.join(" "),fe:Jn()})},self.onunhandledrejection=d=>{throw d.reason||d},self.onmessage=o}function Ie(){var o=E.buffer;n.HEAP8=M=new Int8Array(o),n.HEAP16=G=new Int16Array(o),n.HEAPU8=D=new Uint8Array(o),n.HEAPU16=oe=new Uint16Array(o),n.HEAP32=he=new Int32Array(o),n.HEAPU32=Z=new Uint32Array(o),n.HEAPF32=ue=new Float32Array(o),n.HEAPF64=ye=new Float64Array(o),n.HEAP64=ne=new BigInt64Array(o),n.HEAPU64=V=new BigUint64Array(o)}function zr(){h?startWorker(n):L.Bb()}h||(E=new WebAssembly.Memory({initial:256,maximum:65536,shared:!0}),Ie());var nn,ei=0,an=null;function yd(){if(--ei==0&&an){var o=an;an=null,o()}}function yr(o){throw S(o="Aborted("+o+")"),q=!0,o=new WebAssembly.RuntimeError(o+". Build with -sASSERTIONS for more info."),a(o),o}function _d(){return{a:{Ta:j_,Va:G_,W:K_,la:X_,b:Q_,u:Z_,R:J_,Za:ew,d:tw,pb:Id,g:Y_,T:zd,Ga:Od,lb:Md,nb:Bd,Ha:Nd,Ea:Pd,wb:Dd,Da:Ld,pa:Ud,mb:Fd,jb:Wd,Fa:Vd,kb:Gd,Ma:rw,za:iw,eb:nw,cb:sw,ya:uw,V:lw,N:dw,db:hw,ma:_w,fb:ww,zb:bw,hb:vw,qb:$w,ab:xw,Aa:kw,yb:Bs,Ja:Sw,S:Tw,Wa:Ew,$:Aw,G:zw,E:Rw,m:Os,H:Mw,B:Pw,X:Dw,J:Lw,v:Uw,O:Fw,D:Ww,t:Vw,A:Gw,z:jw,w:qw,r:Hw,tb:Kw,ub:Xw,vb:Yw,rb:nh,sb:ah,bb:sh,Oa:Zw,La:eb,y:tb,ja:rb,Ba:ib,Ka:Jw,qa:nb,Ia:ab,ib:sb,U:Qw,fa:ob,Sa:ub,gb:lb,Qa:db,Pa:hb,Ab:dh,Ca:hh,ob:Ts,aa:ch,oa:ph,xb:fh,na:mh,$a:Db,ia:Qb,sa:r4,ga:Nb,da:Gb,ua:e4,p:Mb,e:_b,c:gb,ea:Wb,f:wb,n:vb,k:Ab,Y:xb,ka:zb,j:Bb,wa:Fb,Ra:a4,ca:Xb,Ua:n4,P:Vb,K:Sb,_:Kb,Q:Pb,Z:Zb,x:kb,l:yb,va:Hb,i:mb,h:$b,ra:i4,ta:t4,o:bb,q:Tb,s:Ib,I:Cb,C:Rb,L:Ob,xa:Ub,_a:Lb,F:Yb,Ya:jb,ba:Jb,M:Eb,Xa:qb,ha:pb,a:E,Na:Ss}}}var $s={1319426:()=>typeof wasmOffsetConverter<"u",1319483:(o,d,c,f,y)=>{if(n===void 0||!n.Bd)return 1;if((o=Xe(Number(o>>>0))).startsWith("./")&&(o=o.substring(2)),!(o=n.Bd.get(o)))return 2;if(d=Number(d>>>0),c=Number(c>>>0),f=Number(f>>>0),d+c>o.byteLength)return 3;try{let x=o.subarray(d,d+c);switch(y){case 0:W().set(x,f>>>0);break;case 1:n.$d(f,x);break;default:return 4}return 0}catch{return 4}},1320198:(o,d,c)=>{n.Jd(o,W().subarray(d>>>0,d+c>>>0))},1320261:()=>n.Yd(),1320302:o=>{n.Id(o)},1320338:()=>{n.Sd()},1320369:()=>{n.Td()},1320398:()=>{n.Xd()},1320423:o=>n.Rd(o),1320456:o=>n.Vd(o),1320488:(o,d,c)=>{n.Hd(Number(o),Number(d),Number(c),!0)},1320551:(o,d,c)=>{n.Hd(Number(o),Number(d),Number(c))},1320608:o=>{n.hc("Abs",o,void 0)},1320659:o=>{n.hc("Neg",o,void 0)},1320710:o=>{n.hc("Floor",o,void 0)},1320763:o=>{n.hc("Ceil",o,void 0)},1320815:o=>{n.hc("Reciprocal",o,void 0)},1320873:o=>{n.hc("Sqrt",o,void 0)},1320925:o=>{n.hc("Exp",o,void 0)},1320976:o=>{n.hc("Erf",o,void 0)},1321027:o=>{n.hc("Sigmoid",o,void 0)},1321082:(o,d,c)=>{n.hc("HardSigmoid",o,{alpha:d,beta:c})},1321161:o=>{n.hc("Log",o,void 0)},1321212:o=>{n.hc("Sin",o,void 0)},1321263:o=>{n.hc("Cos",o,void 0)},1321314:o=>{n.hc("Tan",o,void 0)},1321365:o=>{n.hc("Asin",o,void 0)},1321417:o=>{n.hc("Acos",o,void 0)},1321469:o=>{n.hc("Atan",o,void 0)},1321521:o=>{n.hc("Sinh",o,void 0)},1321573:o=>{n.hc("Cosh",o,void 0)},1321625:o=>{n.hc("Asinh",o,void 0)},1321678:o=>{n.hc("Acosh",o,void 0)},1321731:o=>{n.hc("Atanh",o,void 0)},1321784:o=>{n.hc("Tanh",o,void 0)},1321836:o=>{n.hc("Not",o,void 0)},1321887:(o,d,c)=>{n.hc("Clip",o,{min:d,max:c})},1321956:o=>{n.hc("Clip",o,void 0)},1322008:(o,d)=>{n.hc("Elu",o,{alpha:d})},1322066:o=>{n.hc("Gelu",o,void 0)},1322118:o=>{n.hc("Relu",o,void 0)},1322170:(o,d)=>{n.hc("LeakyRelu",o,{alpha:d})},1322234:(o,d)=>{n.hc("ThresholdedRelu",o,{alpha:d})},1322304:(o,d)=>{n.hc("Cast",o,{to:d})},1322362:o=>{n.hc("Add",o,void 0)},1322413:o=>{n.hc("Sub",o,void 0)},1322464:o=>{n.hc("Mul",o,void 0)},1322515:o=>{n.hc("Div",o,void 0)},1322566:o=>{n.hc("Pow",o,void 0)},1322617:o=>{n.hc("Equal",o,void 0)},1322670:o=>{n.hc("Greater",o,void 0)},1322725:o=>{n.hc("GreaterOrEqual",o,void 0)},1322787:o=>{n.hc("Less",o,void 0)},1322839:o=>{n.hc("LessOrEqual",o,void 0)},1322898:(o,d,c,f,y)=>{n.hc("ReduceMean",o,{keepDims:!!d,noopWithEmptyAxes:!!c,axes:f?Array.from(P().subarray(Number(f)>>>0,Number(y)>>>0)):[]})},1323073:(o,d,c,f,y)=>{n.hc("ReduceMax",o,{keepDims:!!d,noopWithEmptyAxes:!!c,axes:f?Array.from(P().subarray(Number(f)>>>0,Number(y)>>>0)):[]})},1323247:(o,d,c,f,y)=>{n.hc("ReduceMin",o,{keepDims:!!d,noopWithEmptyAxes:!!c,axes:f?Array.from(P().subarray(Number(f)>>>0,Number(y)>>>0)):[]})},1323421:(o,d,c,f,y)=>{n.hc("ReduceProd",o,{keepDims:!!d,noopWithEmptyAxes:!!c,axes:f?Array.from(P().subarray(Number(f)>>>0,Number(y)>>>0)):[]})},1323596:(o,d,c,f,y)=>{n.hc("ReduceSum",o,{keepDims:!!d,noopWithEmptyAxes:!!c,axes:f?Array.from(P().subarray(Number(f)>>>0,Number(y)>>>0)):[]})},1323770:(o,d,c,f,y)=>{n.hc("ReduceL1",o,{keepDims:!!d,noopWithEmptyAxes:!!c,axes:f?Array.from(P().subarray(Number(f)>>>0,Number(y)>>>0)):[]})},1323943:(o,d,c,f,y)=>{n.hc("ReduceL2",o,{keepDims:!!d,noopWithEmptyAxes:!!c,axes:f?Array.from(P().subarray(Number(f)>>>0,Number(y)>>>0)):[]})},1324116:(o,d,c,f,y)=>{n.hc("ReduceLogSum",o,{keepDims:!!d,noopWithEmptyAxes:!!c,axes:f?Array.from(P().subarray(Number(f)>>>0,Number(y)>>>0)):[]})},1324293:(o,d,c,f,y)=>{n.hc("ReduceSumSquare",o,{keepDims:!!d,noopWithEmptyAxes:!!c,axes:f?Array.from(P().subarray(Number(f)>>>0,Number(y)>>>0)):[]})},1324473:(o,d,c,f,y)=>{n.hc("ReduceLogSumExp",o,{keepDims:!!d,noopWithEmptyAxes:!!c,axes:f?Array.from(P().subarray(Number(f)>>>0,Number(y)>>>0)):[]})},1324653:o=>{n.hc("Where",o,void 0)},1324706:(o,d,c)=>{n.hc("Transpose",o,{perm:d?Array.from(P().subarray(Number(d)>>>0,Number(c)>>>0)):[]})},1324830:(o,d,c,f)=>{n.hc("DepthToSpace",o,{blocksize:d,mode:Xe(c),format:f?"NHWC":"NCHW"})},1324963:(o,d,c,f)=>{n.hc("DepthToSpace",o,{blocksize:d,mode:Xe(c),format:f?"NHWC":"NCHW"})},1325096:(o,d,c,f,y,x,I,z,R,U,j,ee,pe,Re,Bt)=>{n.hc("ConvTranspose",o,{format:R?"NHWC":"NCHW",autoPad:d,dilations:[c],group:f,kernelShape:[y],pads:[x,I],strides:[z],wIsConst:()=>!!N()[U>>>0],outputPadding:j?Array.from(P().subarray(Number(j)>>>0,Number(ee)>>>0)):[],outputShape:pe?Array.from(P().subarray(Number(pe)>>>0,Number(Re)>>>0)):[],activation:Xe(Bt)})},1325529:(o,d,c,f,y,x,I,z,R,U,j,ee,pe,Re)=>{n.hc("ConvTranspose",o,{format:z?"NHWC":"NCHW",autoPad:d,dilations:Array.from(P().subarray(Number(c)>>>0,2+(Number(c)>>>0)>>>0)),group:f,kernelShape:Array.from(P().subarray(Number(y)>>>0,2+(Number(y)>>>0)>>>0)),pads:Array.from(P().subarray(Number(x)>>>0,4+(Number(x)>>>0)>>>0)),strides:Array.from(P().subarray(Number(I)>>>0,2+(Number(I)>>>0)>>>0)),wIsConst:()=>!!N()[R>>>0],outputPadding:U?Array.from(P().subarray(Number(U)>>>0,Number(j)>>>0)):[],outputShape:ee?Array.from(P().subarray(Number(ee)>>>0,Number(pe)>>>0)):[],activation:Xe(Re)})},1326190:(o,d,c,f,y,x,I,z,R,U,j,ee,pe,Re,Bt)=>{n.hc("ConvTranspose",o,{format:R?"NHWC":"NCHW",autoPad:d,dilations:[c],group:f,kernelShape:[y],pads:[x,I],strides:[z],wIsConst:()=>!!N()[U>>>0],outputPadding:j?Array.from(P().subarray(Number(j)>>>0,Number(ee)>>>0)):[],outputShape:pe?Array.from(P().subarray(Number(pe)>>>0,Number(Re)>>>0)):[],activation:Xe(Bt)})},1326623:(o,d,c,f,y,x,I,z,R,U,j,ee,pe,Re)=>{n.hc("ConvTranspose",o,{format:z?"NHWC":"NCHW",autoPad:d,dilations:Array.from(P().subarray(Number(c)>>>0,2+(Number(c)>>>0)>>>0)),group:f,kernelShape:Array.from(P().subarray(Number(y)>>>0,2+(Number(y)>>>0)>>>0)),pads:Array.from(P().subarray(Number(x)>>>0,4+(Number(x)>>>0)>>>0)),strides:Array.from(P().subarray(Number(I)>>>0,2+(Number(I)>>>0)>>>0)),wIsConst:()=>!!N()[R>>>0],outputPadding:U?Array.from(P().subarray(Number(U)>>>0,Number(j)>>>0)):[],outputShape:ee?Array.from(P().subarray(Number(ee)>>>0,Number(pe)>>>0)):[],activation:Xe(Re)})},1327284:(o,d)=>{n.hc("GlobalAveragePool",o,{format:d?"NHWC":"NCHW"})},1327375:(o,d,c,f,y,x,I,z,R,U,j,ee,pe,Re)=>{n.hc("AveragePool",o,{format:Re?"NHWC":"NCHW",auto_pad:d,ceil_mode:c,count_include_pad:f,storage_order:y,dilations:x?Array.from(P().subarray(Number(x)>>>0,Number(I)>>>0)):[],kernel_shape:z?Array.from(P().subarray(Number(z)>>>0,Number(R)>>>0)):[],pads:U?Array.from(P().subarray(Number(U)>>>0,Number(j)>>>0)):[],strides:ee?Array.from(P().subarray(Number(ee)>>>0,Number(pe)>>>0)):[]})},1327854:(o,d)=>{n.hc("GlobalAveragePool",o,{format:d?"NHWC":"NCHW"})},1327945:(o,d,c,f,y,x,I,z,R,U,j,ee,pe,Re)=>{n.hc("AveragePool",o,{format:Re?"NHWC":"NCHW",auto_pad:d,ceil_mode:c,count_include_pad:f,storage_order:y,dilations:x?Array.from(P().subarray(Number(x)>>>0,Number(I)>>>0)):[],kernel_shape:z?Array.from(P().subarray(Number(z)>>>0,Number(R)>>>0)):[],pads:U?Array.from(P().subarray(Number(U)>>>0,Number(j)>>>0)):[],strides:ee?Array.from(P().subarray(Number(ee)>>>0,Number(pe)>>>0)):[]})},1328424:(o,d)=>{n.hc("GlobalMaxPool",o,{format:d?"NHWC":"NCHW"})},1328511:(o,d,c,f,y,x,I,z,R,U,j,ee,pe,Re)=>{n.hc("MaxPool",o,{format:Re?"NHWC":"NCHW",auto_pad:d,ceil_mode:c,count_include_pad:f,storage_order:y,dilations:x?Array.from(P().subarray(Number(x)>>>0,Number(I)>>>0)):[],kernel_shape:z?Array.from(P().subarray(Number(z)>>>0,Number(R)>>>0)):[],pads:U?Array.from(P().subarray(Number(U)>>>0,Number(j)>>>0)):[],strides:ee?Array.from(P().subarray(Number(ee)>>>0,Number(pe)>>>0)):[]})},1328986:(o,d)=>{n.hc("GlobalMaxPool",o,{format:d?"NHWC":"NCHW"})},1329073:(o,d,c,f,y,x,I,z,R,U,j,ee,pe,Re)=>{n.hc("MaxPool",o,{format:Re?"NHWC":"NCHW",auto_pad:d,ceil_mode:c,count_include_pad:f,storage_order:y,dilations:x?Array.from(P().subarray(Number(x)>>>0,Number(I)>>>0)):[],kernel_shape:z?Array.from(P().subarray(Number(z)>>>0,Number(R)>>>0)):[],pads:U?Array.from(P().subarray(Number(U)>>>0,Number(j)>>>0)):[],strides:ee?Array.from(P().subarray(Number(ee)>>>0,Number(pe)>>>0)):[]})},1329548:(o,d,c,f,y)=>{n.hc("Gemm",o,{alpha:d,beta:c,transA:f,transB:y})},1329652:o=>{n.hc("MatMul",o,void 0)},1329706:(o,d,c,f)=>{n.hc("ArgMax",o,{keepDims:!!d,selectLastIndex:!!c,axis:f})},1329814:(o,d,c,f)=>{n.hc("ArgMin",o,{keepDims:!!d,selectLastIndex:!!c,axis:f})},1329922:(o,d)=>{n.hc("Softmax",o,{axis:d})},1329985:(o,d)=>{n.hc("Concat",o,{axis:d})},1330045:(o,d,c,f,y)=>{n.hc("Split",o,{axis:d,numOutputs:c,splitSizes:f?Array.from(P().subarray(Number(f)>>>0,Number(y)>>>0)):[]})},1330201:o=>{n.hc("Expand",o,void 0)},1330255:(o,d)=>{n.hc("Gather",o,{axis:Number(d)})},1330326:(o,d)=>{n.hc("GatherElements",o,{axis:Number(d)})},1330405:(o,d)=>{n.hc("GatherND",o,{batch_dims:Number(d)})},1330484:(o,d,c,f,y,x,I,z,R,U,j)=>{n.hc("Resize",o,{antialias:d,axes:c?Array.from(P().subarray(Number(c)>>>0,Number(f)>>>0)):[],coordinateTransformMode:Xe(y),cubicCoeffA:x,excludeOutside:I,extrapolationValue:z,keepAspectRatioPolicy:Xe(R),mode:Xe(U),nearestMode:Xe(j)})},1330846:(o,d,c,f,y,x,I)=>{n.hc("Slice",o,{starts:d?Array.from(P().subarray(Number(d)>>>0,Number(c)>>>0)):[],ends:f?Array.from(P().subarray(Number(f)>>>0,Number(y)>>>0)):[],axes:x?Array.from(P().subarray(Number(x)>>>0,Number(I)>>>0)):[]})},1331110:o=>{n.hc("Tile",o,void 0)},1331162:(o,d,c)=>{n.hc("InstanceNormalization",o,{epsilon:d,format:c?"NHWC":"NCHW"})},1331276:(o,d,c)=>{n.hc("InstanceNormalization",o,{epsilon:d,format:c?"NHWC":"NCHW"})},1331390:o=>{n.hc("Range",o,void 0)},1331443:(o,d)=>{n.hc("Einsum",o,{equation:Xe(d)})},1331524:(o,d,c,f,y)=>{n.hc("Pad",o,{mode:d,value:c,pads:f?Array.from(P().subarray(Number(f)>>>0,Number(y)>>>0)):[]})},1331667:(o,d,c,f,y,x)=>{n.hc("BatchNormalization",o,{epsilon:d,momentum:c,spatial:!!y,trainingMode:!!f,format:x?"NHWC":"NCHW"})},1331836:(o,d,c,f,y,x)=>{n.hc("BatchNormalization",o,{epsilon:d,momentum:c,spatial:!!y,trainingMode:!!f,format:x?"NHWC":"NCHW"})},1332005:(o,d,c)=>{n.hc("CumSum",o,{exclusive:Number(d),reverse:Number(c)})},1332102:(o,d,c)=>{n.hc("DequantizeLinear",o,{axis:d,blockSize:c})},1332192:(o,d,c,f,y)=>{n.hc("GridSample",o,{align_corners:d,mode:Xe(c),padding_mode:Xe(f),format:y?"NHWC":"NCHW"})},1332362:(o,d,c,f,y)=>{n.hc("GridSample",o,{align_corners:d,mode:Xe(c),padding_mode:Xe(f),format:y?"NHWC":"NCHW"})},1332532:(o,d)=>{n.hc("ScatterND",o,{reduction:Xe(d)})},1332617:(o,d,c,f,y,x,I,z,R)=>{n.hc("Attention",o,{numHeads:d,isUnidirectional:c,maskFilterValue:f,scale:y,doRotary:x,qkvHiddenSizes:I?Array.from(P().subarray(Number(z)>>>0,Number(z)+I>>>0)):[],pastPresentShareBuffer:!!R})},1332889:o=>{n.hc("BiasAdd",o,void 0)},1332944:o=>{n.hc("BiasSplitGelu",o,void 0)},1333005:o=>{n.hc("FastGelu",o,void 0)},1333061:(o,d,c,f,y,x,I,z,R,U,j,ee,pe,Re,Bt,dn)=>{n.hc("Conv",o,{format:ee?"NHWC":"NCHW",auto_pad:d,dilations:c?Array.from(P().subarray(Number(c)>>>0,Number(f)>>>0)):[],group:y,kernel_shape:x?Array.from(P().subarray(Number(x)>>>0,Number(I)>>>0)):[],pads:z?Array.from(P().subarray(Number(z)>>>0,Number(R)>>>0)):[],strides:U?Array.from(P().subarray(Number(U)>>>0,Number(j)>>>0)):[],w_is_const:()=>!!N()[Number(pe)>>>0],activation:Xe(Re),activation_params:Bt?Array.from(Rt().subarray(Number(Bt)>>>0,Number(dn)>>>0)):[]})},1333645:o=>{n.hc("Gelu",o,void 0)},1333697:(o,d,c,f,y,x,I,z,R)=>{n.hc("GroupQueryAttention",o,{numHeads:d,kvNumHeads:c,scale:f,softcap:y,doRotary:x,rotaryInterleaved:I,smoothSoftmax:z,localWindowSize:R})},1333914:(o,d,c,f)=>{n.hc("LayerNormalization",o,{axis:d,epsilon:c,simplified:!!f})},1334025:(o,d,c,f)=>{n.hc("LayerNormalization",o,{axis:d,epsilon:c,simplified:!!f})},1334136:(o,d,c,f,y,x)=>{n.hc("MatMulNBits",o,{k:d,n:c,accuracyLevel:f,bits:y,blockSize:x})},1334263:(o,d,c,f,y,x)=>{n.hc("MultiHeadAttention",o,{numHeads:d,isUnidirectional:c,maskFilterValue:f,scale:y,doRotary:x})},1334422:(o,d)=>{n.hc("QuickGelu",o,{alpha:d})},1334486:(o,d,c,f,y)=>{n.hc("RotaryEmbedding",o,{interleaved:!!d,numHeads:c,rotaryEmbeddingDim:f,scale:y})},1334625:(o,d,c)=>{n.hc("SkipLayerNormalization",o,{epsilon:d,simplified:!!c})},1334727:(o,d,c)=>{n.hc("SkipLayerNormalization",o,{epsilon:d,simplified:!!c})},1334829:(o,d,c,f)=>{n.hc("GatherBlockQuantized",o,{gatherAxis:d,quantizeAxis:c,blockSize:f})},1334950:o=>{n.Wd(o)},1334984:(o,d)=>n.Zd(Number(o),Number(d),n.Cd.be,n.Cd.errors)};function G_(o,d,c){return Zd(async()=>{await n.Ud(Number(o),Number(d),Number(c))})}function j_(){return typeof wasmOffsetConverter<"u"}class xs{constructor(d){ae(this,"name","ExitStatus");this.message=`Program terminated with exit(${d})`,this.status=d}}var wd=o=>{o.terminate(),o.onmessage=()=>{}},ks=[],bd=o=>{Rr.length==0&&(Td(),Sd(Rr[0]));var d=Rr.pop();if(!d)return 6;sn.push(d),ti[o.xd]=d,d.xd=o.xd;var c={yd:"run",de:o.ce,Fd:o.Fd,xd:o.xd};return d.postMessage(c,o.Ld),0},Or=0,De=(o,d,...c)=>{for(var f=2*c.length,y=de(),x=Vs(8*f),I=x>>>3,z=0;z<c.length;z++){var R=c[z];typeof R=="bigint"?(ne[I+2*z]=1n,ne[I+2*z+1]=R):(ne[I+2*z]=0n,mt()[I+2*z+1>>>0]=R)}return o=bh(o,0,f,x,d),le(y),o};function Ss(o){if(h)return De(0,1,o);if(A=o,!(0<Or)){for(var d of sn)wd(d);for(d of Rr)wd(d);Rr=[],sn=[],ti={},q=!0}b(0,new xs(o))}function vd(o){if(h)return De(1,0,o);Ts(o)}var Ts=o=>{if(A=o,h)throw vd(o),"unwind";Ss(o)},Rr=[],sn=[],$d=[],ti={},xd=o=>{var d=o.xd;delete ti[d],Rr.push(o),sn.splice(sn.indexOf(o),1),o.xd=0,vh(d)};function kd(){$d.forEach(o=>o())}var Sd=o=>new Promise(d=>{o.onmessage=y=>{var x=(y=y.data).yd;if(y.Ed&&y.Ed!=Jn()){var I=ti[y.Ed];I?I.postMessage(y,y.Ld):S(`Internal error! Worker sent a message "${x}" to target pthread ${y.Ed}, but that thread no longer exists!`)}else x==="checkMailbox"?jn():x==="spawnThread"?bd(y):x==="cleanupThread"?xd(ti[y.ee]):x==="loaded"?(o.loaded=!0,d(o)):x==="alert"?alert(`Thread ${y.fe}: ${y.text}`):y.target==="setimmediate"?o.postMessage(y):x==="callHandler"?n[y.Nd](...y.args):x&&S(`worker sent an unknown command ${x}`)},o.onerror=y=>{throw S(`worker sent an error! ${y.filename}:${y.lineno}: ${y.message}`),y};var c,f=[];for(c of[])n.propertyIsEnumerable(c)&&f.push(c);o.postMessage({yd:"load",Od:f,he:E,ie:C})});function Td(){var o=new Worker(import.meta.url.startsWith("file:")?new URL("/dev-sandbox/games/emotion/assets/ort.bundle.min-OfoG_cy9.mjs",import.meta.url):new URL(import.meta.url),{type:"module",workerData:"em-pthread",name:"em-pthread"});Rr.push(o)}var q_=o=>{Ie();var d=ve()[o+52>>>2>>>0];o=ve()[o+56>>>2>>>0],kh(d,d-o),le(d)},H_=(o,d)=>{Or=0,o=Gs(o,d),0<Or?A=o:Ws(o)},Gn=[];function K_(o){var d=new Es(o>>>=0);if(N()[d.wd+12>>>0]==0){var c=1;N()[d.wd+12>>>0]=c}return c=0,N()[d.wd+13>>>0]=c,Gn.push(d),Th(o),Ih(o)}var xi=0,X_=()=>{ce(0,0);var o=Gn.pop();Sh(o.Gd),xi=0};class Es{constructor(d){this.Gd=d,this.wd=d-24}}function Y_(o){throw xi||(xi=o>>>0),xi}var Is=o=>{var d=xi;if(!d)return ln(0),0;var c=new Es(d);ve()[c.wd+16>>>2>>>0]=d;var f=ve()[c.wd+4>>>2>>>0];if(!f)return ln(0),d;for(var y of o){if(y===0||y===f)break;if(Eh(y,f,c.wd+16))return ln(y),d}return ln(f),d};function Q_(){return Is([])}function Z_(o){return Is([o>>>0])}function J_(o,d){return Is([o>>>0,d>>>0])}var ew=()=>{var o=Gn.pop();o||yr("no exception to throw");var d=o.Gd;if(N()[o.wd+13>>>0]==0){Gn.push(o);var c=1;N()[o.wd+13>>>0]=c,c=0,N()[o.wd+12>>>0]=c}throw xi=d};function tw(o,d,c){var f=new Es(o>>>=0);throw d>>>=0,c>>>=0,ve()[f.wd+16>>>2>>>0]=0,ve()[f.wd+4>>>2>>>0]=d,ve()[f.wd+8>>>2>>>0]=c,xi=o}function Ed(o,d,c,f){return h?De(2,1,o,d,c,f):Id(o,d,c,f)}function Id(o,d,c,f){if(o>>>=0,c>>>=0,f>>>=0,p===void 0)return 6;var y=[];return h&&y.length===0?Ed(o,d>>>=0,c,f):(o={ce:c,xd:o,Fd:f,Ld:y},h?(o.yd="spawnThread",postMessage(o,y),0):bd(o))}var Cd=typeof TextDecoder<"u"?new TextDecoder:void 0,Ad=(o,d=0,c=NaN)=>{var f=(d>>>=0)+c;for(c=d;o[c]&&!(c>=f);)++c;if(16<c-d&&o.buffer&&Cd)return Cd.decode(o.buffer instanceof ArrayBuffer?o.subarray(d,c):o.slice(d,c));for(f="";d<c;){var y=o[d++];if(128&y){var x=63&o[d++];if((224&y)==192)f+=String.fromCharCode((31&y)<<6|x);else{var I=63&o[d++];65536>(y=(240&y)==224?(15&y)<<12|x<<6|I:(7&y)<<18|x<<12|I<<6|63&o[d++])?f+=String.fromCharCode(y):(y-=65536,f+=String.fromCharCode(55296|y>>10,56320|1023&y))}}else f+=String.fromCharCode(y)}return f},Xe=(o,d)=>(o>>>=0)?Ad(W(),o,d):"";function zd(o,d,c){return h?De(3,1,o,d,c):0}function Od(o,d){if(h)return De(4,1,o,d)}var Rd=o=>{for(var d=0,c=0;c<o.length;++c){var f=o.charCodeAt(c);127>=f?d++:2047>=f?d+=2:55296<=f&&57343>=f?(d+=4,++c):d+=3}return d},ki=(o,d,c)=>{var f=W();if(d>>>=0,0<c){var y=d;c=d+c-1;for(var x=0;x<o.length;++x){var I=o.charCodeAt(x);if(55296<=I&&57343>=I&&(I=65536+((1023&I)<<10)|1023&o.charCodeAt(++x)),127>=I){if(d>=c)break;f[d++>>>0]=I}else{if(2047>=I){if(d+1>=c)break;f[d++>>>0]=192|I>>6}else{if(65535>=I){if(d+2>=c)break;f[d++>>>0]=224|I>>12}else{if(d+3>=c)break;f[d++>>>0]=240|I>>18,f[d++>>>0]=128|I>>12&63}f[d++>>>0]=128|I>>6&63}f[d++>>>0]=128|63&I}}f[d>>>0]=0,o=d-y}else o=0;return o};function Md(o,d){if(h)return De(5,1,o,d)}function Bd(o,d,c){if(h)return De(6,1,o,d,c)}function Nd(o,d,c){return h?De(7,1,o,d,c):0}function Pd(o,d){if(h)return De(8,1,o,d)}function Dd(o,d,c){if(h)return De(9,1,o,d,c)}function Ld(o,d,c,f){if(h)return De(10,1,o,d,c,f)}function Ud(o,d,c,f){if(h)return De(11,1,o,d,c,f)}function Fd(o,d,c,f){if(h)return De(12,1,o,d,c,f)}function Wd(o){if(h)return De(13,1,o)}function Vd(o,d){if(h)return De(14,1,o,d)}function Gd(o,d,c){if(h)return De(15,1,o,d,c)}var jd,Mr,rw=()=>yr(""),ar=o=>{for(var d="";W()[o>>>0];)d+=jd[W()[o++>>>0]];return d},Cs={},As={};function _r(o,d,c={}){return function(f,y,x={}){var I=y.name;if(!f)throw new Mr(`type "${I}" must have a positive integer typeid pointer`);if(As.hasOwnProperty(f)){if(x.Pd)return;throw new Mr(`Cannot register type '${I}' twice`)}As[f]=y,Cs.hasOwnProperty(f)&&(y=Cs[f],delete Cs[f],y.forEach(z=>z()))}(o,d,c)}var qd=(o,d,c)=>{switch(d){case 1:return c?f=>N()[f>>>0]:f=>W()[f>>>0];case 2:return c?f=>ge()[f>>>1>>>0]:f=>Be()[f>>>1>>>0];case 4:return c?f=>P()[f>>>2>>>0]:f=>ve()[f>>>2>>>0];case 8:return c?f=>ne[f>>>3]:f=>V[f>>>3];default:throw new TypeError(`invalid integer width (${d}): ${o}`)}};function iw(o,d,c){c>>>=0,_r(o>>>=0,{name:d=ar(d>>>0),fromWireType:f=>f,toWireType:function(f,y){if(typeof y!="bigint"&&typeof y!="number")throw y=y===null?"null":(f=typeof y)=="object"||f==="array"||f==="function"?y.toString():""+y,new TypeError(`Cannot convert "${y}" to ${this.name}`);return typeof y=="number"&&(y=BigInt(y)),y},zd:Br,readValueFromPointer:qd(d,c,d.indexOf("u")==-1),Ad:null})}var Br=8;function nw(o,d,c,f){_r(o>>>=0,{name:d=ar(d>>>0),fromWireType:function(y){return!!y},toWireType:function(y,x){return x?c:f},zd:Br,readValueFromPointer:function(y){return this.fromWireType(W()[y>>>0])},Ad:null})}var zs=[],wr=[];function Os(o){9<(o>>>=0)&&--wr[o+1]==0&&(wr[o]=void 0,zs.push(o))}var vt=o=>{if(!o)throw new Mr("Cannot use deleted val. handle = "+o);return wr[o]},Mt=o=>{switch(o){case void 0:return 2;case null:return 4;case!0:return 6;case!1:return 8;default:let d=zs.pop()||wr.length;return wr[d]=o,wr[d+1]=1,d}};function Rs(o){return this.fromWireType(ve()[o>>>2>>>0])}var aw={name:"emscripten::val",fromWireType:o=>{var d=vt(o);return Os(o),d},toWireType:(o,d)=>Mt(d),zd:Br,readValueFromPointer:Rs,Ad:null};function sw(o){return _r(o>>>0,aw)}var ow=(o,d)=>{switch(d){case 4:return function(c){return this.fromWireType(Rt()[c>>>2>>>0])};case 8:return function(c){return this.fromWireType(mt()[c>>>3>>>0])};default:throw new TypeError(`invalid float width (${d}): ${o}`)}};function uw(o,d,c){c>>>=0,_r(o>>>=0,{name:d=ar(d>>>0),fromWireType:f=>f,toWireType:(f,y)=>y,zd:Br,readValueFromPointer:ow(d,c),Ad:null})}function lw(o,d,c,f,y){if(o>>>=0,c>>>=0,d=ar(d>>>0),y===-1&&(y=4294967295),y=z=>z,f===0){var x=32-8*c;y=z=>z<<x>>>x}var I=d.includes("unsigned")?function(z,R){return R>>>0}:function(z,R){return R};_r(o,{name:d,fromWireType:y,toWireType:I,zd:Br,readValueFromPointer:qd(d,c,f!==0),Ad:null})}function dw(o,d,c){function f(x){var I=ve()[x>>>2>>>0];return x=ve()[x+4>>>2>>>0],new y(N().buffer,x,I)}var y=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array,BigInt64Array,BigUint64Array][d];_r(o>>>=0,{name:c=ar(c>>>0),fromWireType:f,zd:Br,readValueFromPointer:f},{Pd:!0})}function hw(o,d){_r(o>>>=0,{name:d=ar(d>>>0),fromWireType:function(c){for(var f,y=ve()[c>>>2>>>0],x=c+4,I=x,z=0;z<=y;++z){var R=x+z;z!=y&&W()[R>>>0]!=0||(I=Xe(I,R-I),f===void 0?f=I:(f+="\0",f+=I),I=R+1)}return or(c),f},toWireType:function(c,f){f instanceof ArrayBuffer&&(f=new Uint8Array(f));var y=typeof f=="string";if(!(y||f instanceof Uint8Array||f instanceof Uint8ClampedArray||f instanceof Int8Array))throw new Mr("Cannot pass non-string to std::string");var x=y?Rd(f):f.length,I=ea(4+x+1),z=I+4;if(ve()[I>>>2>>>0]=x,y)ki(f,z,x+1);else if(y)for(y=0;y<x;++y){var R=f.charCodeAt(y);if(255<R)throw or(I),new Mr("String has UTF-16 code units that do not fit in 8 bits");W()[z+y>>>0]=R}else for(y=0;y<x;++y)W()[z+y>>>0]=f[y];return c!==null&&c.push(or,I),I},zd:Br,readValueFromPointer:Rs,Ad(c){or(c)}})}var Hd=typeof TextDecoder<"u"?new TextDecoder("utf-16le"):void 0,cw=(o,d)=>{for(var c=o>>1,f=c+d/2;!(c>=f)&&Be()[c>>>0];)++c;if(32<(c<<=1)-o&&Hd)return Hd.decode(W().slice(o,c));for(c="",f=0;!(f>=d/2);++f){var y=ge()[o+2*f>>>1>>>0];if(y==0)break;c+=String.fromCharCode(y)}return c},pw=(o,d,c)=>{if(c??(c=2147483647),2>c)return 0;var f=d;c=(c-=2)<2*o.length?c/2:o.length;for(var y=0;y<c;++y){var x=o.charCodeAt(y);ge()[d>>>1>>>0]=x,d+=2}return ge()[d>>>1>>>0]=0,d-f},fw=o=>2*o.length,mw=(o,d)=>{for(var c=0,f="";!(c>=d/4);){var y=P()[o+4*c>>>2>>>0];if(y==0)break;++c,65536<=y?(y-=65536,f+=String.fromCharCode(55296|y>>10,56320|1023&y)):f+=String.fromCharCode(y)}return f},gw=(o,d,c)=>{if(d>>>=0,c??(c=2147483647),4>c)return 0;var f=d;c=f+c-4;for(var y=0;y<o.length;++y){var x=o.charCodeAt(y);if(55296<=x&&57343>=x&&(x=65536+((1023&x)<<10)|1023&o.charCodeAt(++y)),P()[d>>>2>>>0]=x,(d+=4)+4>c)break}return P()[d>>>2>>>0]=0,d-f},yw=o=>{for(var d=0,c=0;c<o.length;++c){var f=o.charCodeAt(c);55296<=f&&57343>=f&&++c,d+=4}return d};function _w(o,d,c){if(o>>>=0,d>>>=0,c=ar(c>>>=0),d===2)var f=cw,y=pw,x=fw,I=z=>Be()[z>>>1>>>0];else d===4&&(f=mw,y=gw,x=yw,I=z=>ve()[z>>>2>>>0]);_r(o,{name:c,fromWireType:z=>{for(var R,U=ve()[z>>>2>>>0],j=z+4,ee=0;ee<=U;++ee){var pe=z+4+ee*d;ee!=U&&I(pe)!=0||(j=f(j,pe-j),R===void 0?R=j:(R+="\0",R+=j),j=pe+d)}return or(z),R},toWireType:(z,R)=>{if(typeof R!="string")throw new Mr(`Cannot pass non-string to C++ string type ${c}`);var U=x(R),j=ea(4+U+d);return ve()[j>>>2>>>0]=U/d,y(R,j+4,U+d),z!==null&&z.push(or,j),j},zd:Br,readValueFromPointer:Rs,Ad(z){or(z)}})}function ww(o,d){_r(o>>>=0,{Qd:!0,name:d=ar(d>>>0),zd:0,fromWireType:()=>{},toWireType:()=>{}})}function bw(o){Fs(o>>>0,!l,1,!u,131072,!1),kd()}var Ms=o=>{if(!q)try{if(o(),!(0<Or))try{h?Ws(A):Ts(A)}catch(d){d instanceof xs||d=="unwind"||b(0,d)}}catch(d){d instanceof xs||d=="unwind"||b(0,d)}};function Bs(o){o>>>=0,typeof Atomics.ge=="function"&&(Atomics.ge(P(),o>>>2,o).value.then(jn),o+=128,Atomics.store(P(),o>>>2,1))}var jn=()=>{var o=Jn();o&&(Bs(o),Ms(xh))};function vw(o,d){(o>>>=0)==d>>>0?setTimeout(jn):h?postMessage({Ed:o,yd:"checkMailbox"}):(o=ti[o])&&o.postMessage({yd:"checkMailbox"})}var Ns=[];function $w(o,d,c,f,y){for(d>>>=0,f/=2,Ns.length=f,c=y>>>0>>>3,y=0;y<f;y++)Ns[y]=ne[c+2*y]?ne[c+2*y+1]:mt()[c+2*y+1>>>0];return(d?$s[d]:fb[o])(...Ns)}var xw=()=>{Or=0};function kw(o){o>>>=0,h?postMessage({yd:"cleanupThread",ee:o}):xd(ti[o])}function Sw(o){}var qn=(o,d)=>{var c=As[o];if(c===void 0)throw o=yh(o),c=ar(o),or(o),new Mr(`${d} has unknown type ${c}`);return c},Kd=(o,d,c)=>{var f=[];return o=o.toWireType(f,c),f.length&&(ve()[d>>>2>>>0]=Mt(f)),o};function Tw(o,d,c){return d>>>=0,c>>>=0,o=vt(o>>>0),d=qn(d,"emval::as"),Kd(d,c,o)}function Ew(o,d){return d>>>=0,o=vt(o>>>0),(d=qn(d,"emval::as")).toWireType(null,o)}var Hn=o=>{try{o()}catch(d){yr(d)}},Nr=0,sr=null,Xd=0,Kn=[],Yd={},Qd={},Iw=0,Ps=null,Cw=[];function Zd(o){return function(d){if(!q){if(Nr===0){var c=!1,f=!1;d((y=0)=>{if(!q&&(Xd=y,c=!0,f)){Nr=2,Hn(()=>vc(sr)),typeof MainLoop<"u"&&MainLoop.Md&&MainLoop.resume(),y=!1;try{var x=function(){var R=P()[sr+8>>>2>>>0];return R=L[Qd[R]],--Or,R()}()}catch(R){x=R,y=!0}var I=!1;if(!sr){var z=Ps;z&&(Ps=null,(y?z.reject:z.resolve)(x),I=!0)}if(y&&!I)throw x}}),f=!0,c||(Nr=1,sr=function(){var y=ea(65548),x=y+12;ve()[y>>>2>>>0]=x,ve()[y+4>>>2>>>0]=x+65536,x=Kn[0];var I=Yd[x];return I===void 0&&(I=Iw++,Yd[x]=I,Qd[I]=x),x=I,P()[y+8>>>2>>>0]=x,y}(),typeof MainLoop<"u"&&MainLoop.Md&&MainLoop.pause(),Hn(()=>wc(sr)))}else Nr===2?(Nr=0,Hn($c),or(sr),sr=null,Cw.forEach(Ms)):yr(`invalid state: ${Nr}`);return Xd}}(d=>{o().then(d)})}function Aw(o){return o>>>=0,Zd(async()=>{var d=await vt(o);return Mt(d)})}var Xn=[];function zw(o,d,c,f){return c>>>=0,f>>>=0,(o=Xn[o>>>0])(null,d=vt(d>>>0),c,f)}var Ow={},Yn=o=>{var d=Ow[o];return d===void 0?ar(o):d};function Rw(o,d,c,f,y){return c>>>=0,f>>>=0,y>>>=0,(o=Xn[o>>>0])(d=vt(d>>>0),d[c=Yn(c)],f,y)}var Jd=()=>typeof globalThis=="object"?globalThis:Function("return this")();function Mw(o){return(o>>>=0)==0?Mt(Jd()):(o=Yn(o),Mt(Jd()[o]))}var Bw=o=>{var d=Xn.length;return Xn.push(o),d},Nw=(o,d)=>{for(var c=Array(o),f=0;f<o;++f)c[f]=qn(ve()[d+4*f>>>2>>>0],"parameter "+f);return c},eh=(o,d)=>Object.defineProperty(d,"name",{value:o});function Pw(o,d,c){var f=(d=Nw(o,d>>>0)).shift();o--;var y=`return function (obj, func, destructorsRef, args) {
`,x=0,I=[];c===0&&I.push("obj");for(var z=["retType"],R=[f],U=0;U<o;++U)I.push("arg"+U),z.push("argType"+U),R.push(d[U]),y+=`  var arg${U} = argType${U}.readValueFromPointer(args${x?"+"+x:""});
`,x+=d[U].zd;return y+=`  var rv = ${c===1?"new func":"func.call"}(${I.join(", ")});
`,f.Qd||(z.push("emval_returnValue"),R.push(Kd),y+=`  return emval_returnValue(retType, destructorsRef, rv);
`),z.push(y+`};
`),o=function(j){var ee=Function;if(!(ee instanceof Function))throw new TypeError(`new_ called with constructor type ${typeof ee} which is not a function`);var pe=eh(ee.name||"unknownFunctionName",function(){});return pe.prototype=ee.prototype,pe=new pe,(j=ee.apply(pe,j))instanceof Object?j:pe}(z)(...R),c=`methodCaller<(${d.map(j=>j.name).join(", ")}) => ${f.name}>`,Bw(eh(c,o))}function Dw(o){return o=Yn(o>>>0),Mt(n[o])}function Lw(o,d){return d>>>=0,o=vt(o>>>0),d=vt(d),Mt(o[d])}function Uw(o){9<(o>>>=0)&&(wr[o+1]+=1)}function Fw(){return Mt([])}function Ww(o){o=vt(o>>>0);for(var d=Array(o.length),c=0;c<o.length;c++)d[c]=o[c];return Mt(d)}function Vw(o){return Mt(Yn(o>>>0))}function Gw(){return Mt({})}function jw(o){for(var d=vt(o>>>=0);d.length;){var c=d.pop();d.pop()(c)}Os(o)}function qw(o,d,c){d>>>=0,c>>>=0,o=vt(o>>>0),d=vt(d),c=vt(c),o[d]=c}function Hw(o,d){return d>>>=0,o=(o=qn(o>>>0,"_emval_take_value")).readValueFromPointer(d),Mt(o)}function Kw(o,d){o=-9007199254740992>o||9007199254740992<o?NaN:Number(o),d>>>=0,o=new Date(1e3*o),P()[d>>>2>>>0]=o.getUTCSeconds(),P()[d+4>>>2>>>0]=o.getUTCMinutes(),P()[d+8>>>2>>>0]=o.getUTCHours(),P()[d+12>>>2>>>0]=o.getUTCDate(),P()[d+16>>>2>>>0]=o.getUTCMonth(),P()[d+20>>>2>>>0]=o.getUTCFullYear()-1900,P()[d+24>>>2>>>0]=o.getUTCDay(),o=(o.getTime()-Date.UTC(o.getUTCFullYear(),0,1,0,0,0,0))/864e5|0,P()[d+28>>>2>>>0]=o}var th=o=>o%4==0&&(o%100!=0||o%400==0),rh=[0,31,60,91,121,152,182,213,244,274,305,335],ih=[0,31,59,90,120,151,181,212,243,273,304,334];function Xw(o,d){o=-9007199254740992>o||9007199254740992<o?NaN:Number(o),d>>>=0,o=new Date(1e3*o),P()[d>>>2>>>0]=o.getSeconds(),P()[d+4>>>2>>>0]=o.getMinutes(),P()[d+8>>>2>>>0]=o.getHours(),P()[d+12>>>2>>>0]=o.getDate(),P()[d+16>>>2>>>0]=o.getMonth(),P()[d+20>>>2>>>0]=o.getFullYear()-1900,P()[d+24>>>2>>>0]=o.getDay();var c=(th(o.getFullYear())?rh:ih)[o.getMonth()]+o.getDate()-1|0;P()[d+28>>>2>>>0]=c,P()[d+36>>>2>>>0]=-60*o.getTimezoneOffset(),c=new Date(o.getFullYear(),6,1).getTimezoneOffset();var f=new Date(o.getFullYear(),0,1).getTimezoneOffset();o=0|(c!=f&&o.getTimezoneOffset()==Math.min(f,c)),P()[d+32>>>2>>>0]=o}function Yw(o){o>>>=0;var d=new Date(P()[o+20>>>2>>>0]+1900,P()[o+16>>>2>>>0],P()[o+12>>>2>>>0],P()[o+8>>>2>>>0],P()[o+4>>>2>>>0],P()[o>>>2>>>0],0),c=P()[o+32>>>2>>>0],f=d.getTimezoneOffset(),y=new Date(d.getFullYear(),6,1).getTimezoneOffset(),x=new Date(d.getFullYear(),0,1).getTimezoneOffset(),I=Math.min(x,y);return 0>c?P()[o+32>>>2>>>0]=+(y!=x&&I==f):0<c!=(I==f)&&(y=Math.max(x,y),d.setTime(d.getTime()+6e4*((0<c?I:y)-f))),P()[o+24>>>2>>>0]=d.getDay(),c=(th(d.getFullYear())?rh:ih)[d.getMonth()]+d.getDate()-1|0,P()[o+28>>>2>>>0]=c,P()[o>>>2>>>0]=d.getSeconds(),P()[o+4>>>2>>>0]=d.getMinutes(),P()[o+8>>>2>>>0]=d.getHours(),P()[o+12>>>2>>>0]=d.getDate(),P()[o+16>>>2>>>0]=d.getMonth(),P()[o+20>>>2>>>0]=d.getYear(),o=d.getTime(),BigInt(isNaN(o)?-1:o/1e3)}function nh(o,d,c,f,y,x,I){return h?De(16,1,o,d,c,f,y,x,I):-52}function ah(o,d,c,f,y,x){if(h)return De(17,1,o,d,c,f,y,x)}var on={},Qw=()=>performance.timeOrigin+performance.now();function sh(o,d){if(h)return De(18,1,o,d);if(on[o]&&(clearTimeout(on[o].id),delete on[o]),!d)return 0;var c=setTimeout(()=>{delete on[o],Ms(()=>$h(o,performance.timeOrigin+performance.now()))},d);return on[o]={id:c,ke:d},0}function Zw(o,d,c,f){o>>>=0,d>>>=0,c>>>=0,f>>>=0;var y=new Date().getFullYear(),x=new Date(y,0,1).getTimezoneOffset();y=new Date(y,6,1).getTimezoneOffset();var I=Math.max(x,y);ve()[o>>>2>>>0]=60*I,P()[d>>>2>>>0]=+(x!=y),o=(d=z=>{var R=Math.abs(z);return`UTC${0<=z?"-":"+"}${String(Math.floor(R/60)).padStart(2,"0")}${String(R%60).padStart(2,"0")}`})(x),d=d(y),y<x?(ki(o,c,17),ki(d,f,17)):(ki(o,f,17),ki(d,c,17))}var Jw=()=>Date.now();function eb(o,d,c){return 0<=o&&3>=o?(o===0?o=Date.now():o=performance.timeOrigin+performance.now(),ne[c>>>0>>>3]=BigInt(Math.round(1e6*o)),0):28}var Ds=[],oh=(o,d)=>{Ds.length=0;for(var c;c=W()[o++>>>0];){var f=c!=105;d+=(f&=c!=112)&&d%8?4:0,Ds.push(c==112?ve()[d>>>2>>>0]:c==106?ne[d>>>3]:c==105?P()[d>>>2>>>0]:mt()[d>>>3>>>0]),d+=f?8:4}return Ds};function tb(o,d,c){return o>>>=0,d=oh(d>>>0,c>>>0),$s[o](...d)}function rb(o,d,c){return o>>>=0,d=oh(d>>>0,c>>>0),$s[o](...d)}var ib=()=>{};function nb(o,d){return S(Xe(o>>>0,d>>>0))}var ab=()=>{throw Or+=1,"unwind"};function sb(){return 4294901760}var ob=()=>navigator.hardwareConcurrency;function ub(){return yr("Cannot use emscripten_pc_get_function without -sUSE_OFFSET_CONVERTER"),0}function lb(o){o>>>=0;var d=W().length;if(o<=d||4294901760<o)return!1;for(var c=1;4>=c;c*=2){var f=d*(1+.2/c);f=Math.min(f,o+100663296);e:{f=(Math.min(4294901760,65536*Math.ceil(Math.max(o,f)/65536))-E.buffer.byteLength+65535)/65536|0;try{E.grow(f),Ie();var y=1;break e}catch{}y=void 0}if(y)return!0}return!1}var Qn=()=>(yr("Cannot use convertFrameToPC (needed by __builtin_return_address) without -sUSE_OFFSET_CONVERTER"),0),un={},uh=o=>{o.forEach(d=>{Qn()})};function db(){var o=Error().stack.toString().split(`
`);return o[0]=="Error"&&o.shift(),uh(o),un.Kd=Qn(),un.ae=o,un.Kd}function hb(o,d,c){if(o>>>=0,d>>>=0,un.Kd==o)var f=un.ae;else(f=Error().stack.toString().split(`
`))[0]=="Error"&&f.shift(),uh(f);for(var y=3;f[y]&&Qn()!=o;)++y;for(o=0;o<c&&f[o+y];++o)P()[d+4*o>>>2>>>0]=Qn();return o}var Ls,Us={},lh=()=>{if(!Ls){var o,d={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:(typeof navigator=="object"&&navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8",_:"./this.program"};for(o in Us)Us[o]===void 0?delete d[o]:d[o]=Us[o];var c=[];for(o in d)c.push(`${o}=${d[o]}`);Ls=c}return Ls};function dh(o,d){if(h)return De(19,1,o,d);o>>>=0,d>>>=0;var c=0;return lh().forEach((f,y)=>{var x=d+c;for(y=ve()[o+4*y>>>2>>>0]=x,x=0;x<f.length;++x)N()[y++>>>0]=f.charCodeAt(x);N()[y>>>0]=0,c+=f.length+1}),0}function hh(o,d){if(h)return De(20,1,o,d);o>>>=0,d>>>=0;var c=lh();ve()[o>>>2>>>0]=c.length;var f=0;return c.forEach(y=>f+=y.length+1),ve()[d>>>2>>>0]=f,0}function ch(o){return h?De(21,1,o):52}function ph(o,d,c,f){return h?De(22,1,o,d,c,f):52}function fh(o,d,c,f){return h?De(23,1,o,d,c,f):70}var cb=[null,[],[]];function mh(o,d,c,f){if(h)return De(24,1,o,d,c,f);d>>>=0,c>>>=0,f>>>=0;for(var y=0,x=0;x<c;x++){var I=ve()[d>>>2>>>0],z=ve()[d+4>>>2>>>0];d+=8;for(var R=0;R<z;R++){var U=W()[I+R>>>0],j=cb[o];U===0||U===10?((o===1?T:S)(Ad(j)),j.length=0):j.push(U)}y+=z}return ve()[f>>>2>>>0]=y,0}function pb(o){return o>>>0}h||function(){for(var o=n.numThreads-1;o--;)Td();ks.unshift(()=>{ei++,function(d){h?d():Promise.all(Rr.map(Sd)).then(d)}(()=>yd())})}();for(var gh=Array(256),Zn=0;256>Zn;++Zn)gh[Zn]=String.fromCharCode(Zn);jd=gh,Mr=n.BindingError=class extends Error{constructor(o){super(o),this.name="BindingError"}},n.InternalError=class extends Error{constructor(o){super(o),this.name="InternalError"}},wr.push(0,1,void 0,1,null,1,!0,1,!1,1),n.count_emval_handles=()=>wr.length/2-5-zs.length;var L,fb=[Ss,vd,Ed,zd,Od,Md,Bd,Nd,Pd,Dd,Ld,Ud,Fd,Wd,Vd,Gd,nh,ah,sh,dh,hh,ch,ph,fh,mh];(async function(){function o(f,y){return L=f.exports,L=function(){var x=L,I={};for(let[z,R]of Object.entries(x))I[z]=typeof R=="function"?(...U)=>{Kn.push(z);try{return R(...U)}finally{q||(Kn.pop(),sr&&Nr===1&&Kn.length===0&&(Nr=0,Or+=1,Hn(bc),typeof Fibers<"u"&&Fibers.le()))}}:R;return I}(),L=function(){var x=L,I=R=>U=>R(U)>>>0,z=R=>()=>R()>>>0;return(x=Object.assign({},x)).Cb=I(x.Cb),x.fc=z(x.fc),x.ic=I(x.ic),x.vc=I(x.vc),x.wc=z(x.wc),x.Ac=I(x.Ac),x}(),$d.push(L.jc),C=y,yd(),L}ei++;var d=_d();if(n.instantiateWasm)return new Promise(f=>{n.instantiateWasm(d,(y,x)=>{o(y,x),f(y.exports)})});if(h)return new Promise(f=>{Jr=y=>{var x=new WebAssembly.Instance(y,_d());f(o(x,y))}});nn??(nn=n.locateFile?n.locateFile?n.locateFile("ort-wasm-simd-threaded.jsep.wasm",k):k+"ort-wasm-simd-threaded.jsep.wasm":new URL("/dev-sandbox/games/emotion/assets/ort-wasm-simd-threaded.jsep-D5Jk56-t.wasm",import.meta.url).href);try{var c=await async function(f){var y=nn;if(!Te&&typeof WebAssembly.instantiateStreaming=="function"&&!Ee(y))try{var x=fetch(y,{credentials:"same-origin"});return await WebAssembly.instantiateStreaming(x,f)}catch(I){S(`wasm streaming compile failed: ${I}`),S("falling back to ArrayBuffer instantiation")}return async function(I,z){try{var R=await async function(U){if(!Te)try{var j=await g(U);return new Uint8Array(j)}catch{}if(U==nn&&Te)U=new Uint8Array(Te);else{if(!_)throw"both async and sync fetching of the wasm failed";U=_(U)}return U}(I);return await WebAssembly.instantiate(R,z)}catch(U){S(`failed to asynchronously prepare wasm: ${U}`),yr(U)}}(y,f)}(d);return o(c.instance,c.module)}catch(f){return a(f),Promise.reject(f)}})();var yh=o=>(yh=L.Cb)(o),_h=()=>(_h=L.Db)();n._OrtInit=(o,d)=>(n._OrtInit=L.Eb)(o,d),n._OrtGetLastError=(o,d)=>(n._OrtGetLastError=L.Fb)(o,d),n._OrtCreateSessionOptions=(o,d,c,f,y,x,I,z,R,U)=>(n._OrtCreateSessionOptions=L.Gb)(o,d,c,f,y,x,I,z,R,U),n._OrtAppendExecutionProvider=(o,d)=>(n._OrtAppendExecutionProvider=L.Hb)(o,d),n._OrtAddFreeDimensionOverride=(o,d,c)=>(n._OrtAddFreeDimensionOverride=L.Ib)(o,d,c),n._OrtAddSessionConfigEntry=(o,d,c)=>(n._OrtAddSessionConfigEntry=L.Jb)(o,d,c),n._OrtReleaseSessionOptions=o=>(n._OrtReleaseSessionOptions=L.Kb)(o),n._OrtCreateSession=(o,d,c)=>(n._OrtCreateSession=L.Lb)(o,d,c),n._OrtReleaseSession=o=>(n._OrtReleaseSession=L.Mb)(o),n._OrtGetInputOutputCount=(o,d,c)=>(n._OrtGetInputOutputCount=L.Nb)(o,d,c),n._OrtGetInputName=(o,d)=>(n._OrtGetInputName=L.Ob)(o,d),n._OrtGetOutputName=(o,d)=>(n._OrtGetOutputName=L.Pb)(o,d),n._OrtFree=o=>(n._OrtFree=L.Qb)(o),n._OrtCreateTensor=(o,d,c,f,y,x)=>(n._OrtCreateTensor=L.Rb)(o,d,c,f,y,x),n._OrtGetTensorData=(o,d,c,f,y)=>(n._OrtGetTensorData=L.Sb)(o,d,c,f,y),n._OrtReleaseTensor=o=>(n._OrtReleaseTensor=L.Tb)(o),n._OrtCreateRunOptions=(o,d,c,f)=>(n._OrtCreateRunOptions=L.Ub)(o,d,c,f),n._OrtAddRunConfigEntry=(o,d,c)=>(n._OrtAddRunConfigEntry=L.Vb)(o,d,c),n._OrtReleaseRunOptions=o=>(n._OrtReleaseRunOptions=L.Wb)(o),n._OrtCreateBinding=o=>(n._OrtCreateBinding=L.Xb)(o),n._OrtBindInput=(o,d,c)=>(n._OrtBindInput=L.Yb)(o,d,c),n._OrtBindOutput=(o,d,c,f)=>(n._OrtBindOutput=L.Zb)(o,d,c,f),n._OrtClearBoundOutputs=o=>(n._OrtClearBoundOutputs=L._b)(o),n._OrtReleaseBinding=o=>(n._OrtReleaseBinding=L.$b)(o),n._OrtRunWithBinding=(o,d,c,f,y)=>(n._OrtRunWithBinding=L.ac)(o,d,c,f,y),n._OrtRun=(o,d,c,f,y,x,I,z)=>(n._OrtRun=L.bc)(o,d,c,f,y,x,I,z),n._OrtEndProfiling=o=>(n._OrtEndProfiling=L.cc)(o),n._JsepOutput=(o,d,c)=>(n._JsepOutput=L.dc)(o,d,c),n._JsepGetNodeName=o=>(n._JsepGetNodeName=L.ec)(o);var Jn=()=>(Jn=L.fc)(),or=n._free=o=>(or=n._free=L.gc)(o),ea=n._malloc=o=>(ea=n._malloc=L.ic)(o),Fs=(o,d,c,f,y,x)=>(Fs=L.kc)(o,d,c,f,y,x),wh=()=>(wh=L.lc)(),bh=(o,d,c,f,y)=>(bh=L.mc)(o,d,c,f,y),vh=o=>(vh=L.nc)(o),Ws=o=>(Ws=L.oc)(o),$h=(o,d)=>($h=L.pc)(o,d),xh=()=>(xh=L.qc)(),ce=(o,d)=>(ce=L.rc)(o,d),ln=o=>(ln=L.sc)(o),kh=(o,d)=>(kh=L.tc)(o,d),le=o=>(le=L.uc)(o),Vs=o=>(Vs=L.vc)(o),de=()=>(de=L.wc)(),Sh=o=>(Sh=L.xc)(o),Th=o=>(Th=L.yc)(o),Eh=(o,d,c)=>(Eh=L.zc)(o,d,c),Ih=o=>(Ih=L.Ac)(o),Ch=n.dynCall_iii=(o,d,c)=>(Ch=n.dynCall_iii=L.Bc)(o,d,c),Ah=n.dynCall_vi=(o,d)=>(Ah=n.dynCall_vi=L.Cc)(o,d),Gs=n.dynCall_ii=(o,d)=>(Gs=n.dynCall_ii=L.Dc)(o,d),zh=n.dynCall_vii=(o,d,c)=>(zh=n.dynCall_vii=L.Ec)(o,d,c),Oh=n.dynCall_iiii=(o,d,c,f)=>(Oh=n.dynCall_iiii=L.Fc)(o,d,c,f),Rh=n.dynCall_viii=(o,d,c,f)=>(Rh=n.dynCall_viii=L.Gc)(o,d,c,f),Mh=n.dynCall_iiiii=(o,d,c,f,y)=>(Mh=n.dynCall_iiiii=L.Hc)(o,d,c,f,y),Bh=n.dynCall_viiii=(o,d,c,f,y)=>(Bh=n.dynCall_viiii=L.Ic)(o,d,c,f,y),Nh=n.dynCall_viiiiii=(o,d,c,f,y,x,I)=>(Nh=n.dynCall_viiiiii=L.Jc)(o,d,c,f,y,x,I),Ph=n.dynCall_viiiiiii=(o,d,c,f,y,x,I,z)=>(Ph=n.dynCall_viiiiiii=L.Kc)(o,d,c,f,y,x,I,z),Dh=n.dynCall_ji=(o,d)=>(Dh=n.dynCall_ji=L.Lc)(o,d),Lh=n.dynCall_v=o=>(Lh=n.dynCall_v=L.Mc)(o),Uh=n.dynCall_viiiii=(o,d,c,f,y,x)=>(Uh=n.dynCall_viiiii=L.Nc)(o,d,c,f,y,x),Fh=n.dynCall_i=o=>(Fh=n.dynCall_i=L.Oc)(o),Wh=n.dynCall_fii=(o,d,c)=>(Wh=n.dynCall_fii=L.Pc)(o,d,c),Vh=n.dynCall_viiiiiiii=(o,d,c,f,y,x,I,z,R)=>(Vh=n.dynCall_viiiiiiii=L.Qc)(o,d,c,f,y,x,I,z,R),Gh=n.dynCall_viiiiiiiiii=(o,d,c,f,y,x,I,z,R,U,j)=>(Gh=n.dynCall_viiiiiiiiii=L.Rc)(o,d,c,f,y,x,I,z,R,U,j),jh=n.dynCall_jiii=(o,d,c,f)=>(jh=n.dynCall_jiii=L.Sc)(o,d,c,f),qh=n.dynCall_dii=(o,d,c)=>(qh=n.dynCall_dii=L.Tc)(o,d,c),Hh=n.dynCall_viiiiiiiii=(o,d,c,f,y,x,I,z,R,U)=>(Hh=n.dynCall_viiiiiiiii=L.Uc)(o,d,c,f,y,x,I,z,R,U),Kh=n.dynCall_viiiiiiiiiii=(o,d,c,f,y,x,I,z,R,U,j,ee)=>(Kh=n.dynCall_viiiiiiiiiii=L.Vc)(o,d,c,f,y,x,I,z,R,U,j,ee),Xh=n.dynCall_iiiiii=(o,d,c,f,y,x)=>(Xh=n.dynCall_iiiiii=L.Wc)(o,d,c,f,y,x),Yh=n.dynCall_iij=(o,d,c)=>(Yh=n.dynCall_iij=L.Xc)(o,d,c),Qh=n.dynCall_iiiiiiiiii=(o,d,c,f,y,x,I,z,R,U)=>(Qh=n.dynCall_iiiiiiiiii=L.Yc)(o,d,c,f,y,x,I,z,R,U),Zh=n.dynCall_iiiiiiiiiii=(o,d,c,f,y,x,I,z,R,U,j)=>(Zh=n.dynCall_iiiiiiiiiii=L.Zc)(o,d,c,f,y,x,I,z,R,U,j),Jh=n.dynCall_vij=(o,d,c)=>(Jh=n.dynCall_vij=L._c)(o,d,c),ec=n.dynCall_iiif=(o,d,c,f)=>(ec=n.dynCall_iiif=L.$c)(o,d,c,f),tc=n.dynCall_iiij=(o,d,c,f)=>(tc=n.dynCall_iiij=L.ad)(o,d,c,f),rc=n.dynCall_fiii=(o,d,c,f)=>(rc=n.dynCall_fiii=L.bd)(o,d,c,f),ic=n.dynCall_viiiiiiiiiiiii=(o,d,c,f,y,x,I,z,R,U,j,ee,pe,Re)=>(ic=n.dynCall_viiiiiiiiiiiii=L.cd)(o,d,c,f,y,x,I,z,R,U,j,ee,pe,Re),nc=n.dynCall_vjiii=(o,d,c,f,y)=>(nc=n.dynCall_vjiii=L.dd)(o,d,c,f,y),ac=n.dynCall_vif=(o,d,c)=>(ac=n.dynCall_vif=L.ed)(o,d,c),sc=n.dynCall_iiiiiii=(o,d,c,f,y,x,I)=>(sc=n.dynCall_iiiiiii=L.fd)(o,d,c,f,y,x,I),oc=n.dynCall_iiiij=(o,d,c,f,y)=>(oc=n.dynCall_iiiij=L.gd)(o,d,c,f,y),uc=n.dynCall_iiiiiiii=(o,d,c,f,y,x,I,z)=>(uc=n.dynCall_iiiiiiii=L.hd)(o,d,c,f,y,x,I,z),lc=n.dynCall_viiiiiiiiiiii=(o,d,c,f,y,x,I,z,R,U,j,ee,pe)=>(lc=n.dynCall_viiiiiiiiiiii=L.id)(o,d,c,f,y,x,I,z,R,U,j,ee,pe),dc=n.dynCall_diii=(o,d,c,f)=>(dc=n.dynCall_diii=L.jd)(o,d,c,f),hc=n.dynCall_jiiii=(o,d,c,f,y)=>(hc=n.dynCall_jiiii=L.kd)(o,d,c,f,y),cc=n.dynCall_viiij=(o,d,c,f,y)=>(cc=n.dynCall_viiij=L.ld)(o,d,c,f,y),pc=n.dynCall_fiiii=(o,d,c,f,y)=>(pc=n.dynCall_fiiii=L.md)(o,d,c,f,y),fc=n.dynCall_viiif=(o,d,c,f,y)=>(fc=n.dynCall_viiif=L.nd)(o,d,c,f,y),mc=n.dynCall_diiii=(o,d,c,f,y)=>(mc=n.dynCall_diiii=L.od)(o,d,c,f,y),gc=n.dynCall_viiid=(o,d,c,f,y)=>(gc=n.dynCall_viiid=L.pd)(o,d,c,f,y),yc=n.dynCall_iiiijii=(o,d,c,f,y,x,I)=>(yc=n.dynCall_iiiijii=L.qd)(o,d,c,f,y,x,I),_c=n.dynCall_iiiiiij=(o,d,c,f,y,x,I)=>(_c=n.dynCall_iiiiiij=L.rd)(o,d,c,f,y,x,I),wc=o=>(wc=L.sd)(o),bc=()=>(bc=L.td)(),vc=o=>(vc=L.ud)(o),$c=()=>($c=L.vd)();function mb(o,d,c){var f=de();try{zh(o,d,c)}catch(y){if(le(f),y!==y+0)throw y;ce(1,0)}}function gb(o,d,c){var f=de();try{return Ch(o,d,c)}catch(y){if(le(f),y!==y+0)throw y;ce(1,0)}}function yb(o,d){var c=de();try{Ah(o,d)}catch(f){if(le(c),f!==f+0)throw f;ce(1,0)}}function _b(o,d){var c=de();try{return Gs(o,d)}catch(f){if(le(c),f!==f+0)throw f;ce(1,0)}}function wb(o,d,c,f){var y=de();try{return Oh(o,d,c,f)}catch(x){if(le(y),x!==x+0)throw x;ce(1,0)}}function bb(o,d,c,f,y){var x=de();try{Bh(o,d,c,f,y)}catch(I){if(le(x),I!==I+0)throw I;ce(1,0)}}function vb(o,d,c,f,y){var x=de();try{return Mh(o,d,c,f,y)}catch(I){if(le(x),I!==I+0)throw I;ce(1,0)}}function $b(o,d,c,f){var y=de();try{Rh(o,d,c,f)}catch(x){if(le(y),x!==x+0)throw x;ce(1,0)}}function xb(o,d,c,f,y,x,I){var z=de();try{return sc(o,d,c,f,y,x,I)}catch(R){if(le(z),R!==R+0)throw R;ce(1,0)}}function kb(o){var d=de();try{Lh(o)}catch(c){if(le(d),c!==c+0)throw c;ce(1,0)}}function Sb(o,d,c){var f=de();try{return Yh(o,d,c)}catch(y){if(le(f),y!==y+0)throw y;ce(1,0)}}function Tb(o,d,c,f,y,x){var I=de();try{Uh(o,d,c,f,y,x)}catch(z){if(le(I),z!==z+0)throw z;ce(1,0)}}function Eb(o,d,c){var f=de();try{Jh(o,d,c)}catch(y){if(le(f),y!==y+0)throw y;ce(1,0)}}function Ib(o,d,c,f,y,x,I){var z=de();try{Nh(o,d,c,f,y,x,I)}catch(R){if(le(z),R!==R+0)throw R;ce(1,0)}}function Cb(o,d,c,f,y,x,I,z){var R=de();try{Ph(o,d,c,f,y,x,I,z)}catch(U){if(le(R),U!==U+0)throw U;ce(1,0)}}function Ab(o,d,c,f,y,x){var I=de();try{return Xh(o,d,c,f,y,x)}catch(z){if(le(I),z!==z+0)throw z;ce(1,0)}}function zb(o,d,c,f,y,x,I,z){var R=de();try{return uc(o,d,c,f,y,x,I,z)}catch(U){if(le(R),U!==U+0)throw U;ce(1,0)}}function Ob(o,d,c,f,y,x,I,z,R,U){var j=de();try{Hh(o,d,c,f,y,x,I,z,R,U)}catch(ee){if(le(j),ee!==ee+0)throw ee;ce(1,0)}}function Rb(o,d,c,f,y,x,I,z,R){var U=de();try{Vh(o,d,c,f,y,x,I,z,R)}catch(j){if(le(U),j!==j+0)throw j;ce(1,0)}}function Mb(o){var d=de();try{return Fh(o)}catch(c){if(le(d),c!==c+0)throw c;ce(1,0)}}function Bb(o,d,c,f,y,x,I,z,R,U){var j=de();try{return Qh(o,d,c,f,y,x,I,z,R,U)}catch(ee){if(le(j),ee!==ee+0)throw ee;ce(1,0)}}function Nb(o,d,c){var f=de();try{return Wh(o,d,c)}catch(y){if(le(f),y!==y+0)throw y;ce(1,0)}}function Pb(o,d,c,f){var y=de();try{return jh(o,d,c,f)}catch(x){if(le(y),x!==x+0)throw x;return ce(1,0),0n}}function Db(o,d,c){var f=de();try{return qh(o,d,c)}catch(y){if(le(f),y!==y+0)throw y;ce(1,0)}}function Lb(o,d,c,f,y,x,I,z,R,U,j,ee){var pe=de();try{Kh(o,d,c,f,y,x,I,z,R,U,j,ee)}catch(Re){if(le(pe),Re!==Re+0)throw Re;ce(1,0)}}function Ub(o,d,c,f,y,x,I,z,R,U,j){var ee=de();try{Gh(o,d,c,f,y,x,I,z,R,U,j)}catch(pe){if(le(ee),pe!==pe+0)throw pe;ce(1,0)}}function Fb(o,d,c,f,y,x,I,z,R,U,j){var ee=de();try{return Zh(o,d,c,f,y,x,I,z,R,U,j)}catch(pe){if(le(ee),pe!==pe+0)throw pe;ce(1,0)}}function Wb(o,d,c,f){var y=de();try{return ec(o,d,c,f)}catch(x){if(le(y),x!==x+0)throw x;ce(1,0)}}function Vb(o,d,c,f){var y=de();try{return tc(o,d,c,f)}catch(x){if(le(y),x!==x+0)throw x;ce(1,0)}}function Gb(o,d,c,f){var y=de();try{return rc(o,d,c,f)}catch(x){if(le(y),x!==x+0)throw x;ce(1,0)}}function jb(o,d,c,f,y,x,I,z,R,U,j,ee,pe,Re){var Bt=de();try{ic(o,d,c,f,y,x,I,z,R,U,j,ee,pe,Re)}catch(dn){if(le(Bt),dn!==dn+0)throw dn;ce(1,0)}}function qb(o,d,c,f,y){var x=de();try{nc(o,d,c,f,y)}catch(I){if(le(x),I!==I+0)throw I;ce(1,0)}}function Hb(o,d,c){var f=de();try{ac(o,d,c)}catch(y){if(le(f),y!==y+0)throw y;ce(1,0)}}function Kb(o,d){var c=de();try{return Dh(o,d)}catch(f){if(le(c),f!==f+0)throw f;return ce(1,0),0n}}function Xb(o,d,c,f,y){var x=de();try{return oc(o,d,c,f,y)}catch(I){if(le(x),I!==I+0)throw I;ce(1,0)}}function Yb(o,d,c,f,y,x,I,z,R,U,j,ee,pe){var Re=de();try{lc(o,d,c,f,y,x,I,z,R,U,j,ee,pe)}catch(Bt){if(le(Re),Bt!==Bt+0)throw Bt;ce(1,0)}}function Qb(o,d,c,f){var y=de();try{return dc(o,d,c,f)}catch(x){if(le(y),x!==x+0)throw x;ce(1,0)}}function Zb(o,d,c,f,y){var x=de();try{return hc(o,d,c,f,y)}catch(I){if(le(x),I!==I+0)throw I;return ce(1,0),0n}}function Jb(o,d,c,f,y){var x=de();try{cc(o,d,c,f,y)}catch(I){if(le(x),I!==I+0)throw I;ce(1,0)}}function e4(o,d,c,f,y){var x=de();try{return pc(o,d,c,f,y)}catch(I){if(le(x),I!==I+0)throw I;ce(1,0)}}function t4(o,d,c,f,y){var x=de();try{fc(o,d,c,f,y)}catch(I){if(le(x),I!==I+0)throw I;ce(1,0)}}function r4(o,d,c,f,y){var x=de();try{return mc(o,d,c,f,y)}catch(I){if(le(x),I!==I+0)throw I;ce(1,0)}}function i4(o,d,c,f,y){var x=de();try{gc(o,d,c,f,y)}catch(I){if(le(x),I!==I+0)throw I;ce(1,0)}}function n4(o,d,c,f,y,x,I){var z=de();try{return yc(o,d,c,f,y,x,I)}catch(R){if(le(z),R!==R+0)throw R;ce(1,0)}}function a4(o,d,c,f,y,x,I){var z=de();try{return _c(o,d,c,f,y,x,I)}catch(R){if(le(z),R!==R+0)throw R;ce(1,0)}}return n.stackSave=()=>de(),n.stackRestore=o=>le(o),n.stackAlloc=o=>Vs(o),n.setValue=function(o,d,c="i8"){switch(c.endsWith("*")&&(c="*"),c){case"i1":case"i8":N()[o>>>0]=d;break;case"i16":ge()[o>>>1>>>0]=d;break;case"i32":P()[o>>>2>>>0]=d;break;case"i64":ne[o>>>3]=BigInt(d);break;case"float":Rt()[o>>>2>>>0]=d;break;case"double":mt()[o>>>3>>>0]=d;break;case"*":ve()[o>>>2>>>0]=d;break;default:yr(`invalid type for setValue: ${c}`)}},n.getValue=function(o,d="i8"){switch(d.endsWith("*")&&(d="*"),d){case"i1":case"i8":return N()[o>>>0];case"i16":return ge()[o>>>1>>>0];case"i32":return P()[o>>>2>>>0];case"i64":return ne[o>>>3];case"float":return Rt()[o>>>2>>>0];case"double":return mt()[o>>>3>>>0];case"*":return ve()[o>>>2>>>0];default:yr(`invalid type for getValue: ${d}`)}},n.UTF8ToString=Xe,n.stringToUTF8=ki,n.lengthBytesUTF8=Rd,function o(){if(0<ei)an=o;else if(h)i(n),zr();else{for(;0<ks.length;)ks.shift()(n);0<ei?an=o:(n.calledRun=!0,q||(zr(),i(n)))}}(),n.PTR_SIZE=4,s}),zg=po,Mp=(t=(e=globalThis.self)==null?void 0:e.name)==null?void 0:t.startsWith("em-pthread"),Mp&&po()}),fo,Bp,Tt,Og,oa,Np,Pp,mo,Dp,go,Rg,yo,Mg,Gl=F(()=>{Vl(),fo=typeof location>"u"?void 0:location.origin,Bp=()=>{var e;return(e=import.meta.url)!=null&&e.startsWith("file:")?new URL(new URL("/dev-sandbox/games/emotion/assets/ort.bundle.min-OfoG_cy9.mjs",import.meta.url).href,fo).href:import.meta.url},Tt=Bp(),Og=()=>{if(Tt&&!Tt.startsWith("blob:"))return Tt.substring(0,Tt.lastIndexOf("/")+1)},oa=(e,t)=>{try{let r=t??Tt;return(r?new URL(e,r):new URL(e)).origin===fo}catch{return!1}},Np=(e,t)=>{let r=t??Tt;try{return(r?new URL(e,r):new URL(e)).href}catch{return}},Pp=(e,t)=>`${t??"./"}${e}`,mo=async e=>{let t=await(await fetch(e,{credentials:"same-origin"})).blob();return URL.createObjectURL(t)},Dp=async e=>(await import(e)).default,go=(a$(),Ua(Ig)).default,Rg=async()=>{if(!Tt)throw new Error("Failed to load proxy worker: cannot determine the script source URL.");if(oa(Tt))return[void 0,go()];let e=await mo(Tt);return[e,go(e)]},yo=(s$(),Ua(Ag)).default,Mg=async(e,t,r)=>{if(!e&&!t&&yo&&Tt&&oa(Tt))return[void 0,yo];{let i="ort-wasm-simd-threaded.jsep.mjs",a=e??Np(i,t),n=r&&a&&!oa(a,t),s=n?await mo(a):a??Pp(i,t);return[n?s:void 0,await Dp(s)]}}}),_o,ua,fn,wo,Lp,Up,jl,rt,vi=F(()=>{Gl(),ua=!1,fn=!1,wo=!1,Lp=()=>{if(typeof SharedArrayBuffer>"u")return!1;try{return typeof MessageChannel<"u"&&new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)),WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,4,1,3,1,1,10,11,1,9,0,65,0,254,16,2,0,26,11]))}catch{return!1}},Up=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,30,1,28,0,65,0,253,15,253,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,253,186,1,26,11]))}catch{return!1}},jl=async e=>{if(ua)return Promise.resolve();if(fn)throw new Error("multiple calls to 'initializeWebAssembly()' detected.");if(wo)throw new Error("previous call to 'initializeWebAssembly()' failed.");fn=!0;let t=e.initTimeout,r=e.numThreads;if(!Up())throw new Error("WebAssembly SIMD is not supported in the current environment.");let i=Lp();r>1&&!i&&(typeof self<"u"&&!self.crossOriginIsolated&&console.warn("env.wasm.numThreads is set to "+r+", but this will not work unless you enable crossOriginIsolated mode. See https://web.dev/cross-origin-isolation-guide/ for more info."),console.warn("WebAssembly multi-threading is not supported in the current environment. Falling back to single-threading."),e.numThreads=r=1);let a=e.wasmPaths,n=typeof a=="string"?a:void 0,s=a==null?void 0:a.mjs,u=(s==null?void 0:s.href)??s,l=a==null?void 0:a.wasm,h=(l==null?void 0:l.href)??l,p=e.wasmBinary,[m,g]=await Mg(u,n,r>1),_=!1,w=[];if(t>0&&w.push(new Promise(b=>{setTimeout(()=>{_=!0,b()},t)})),w.push(new Promise((b,k)=>{let $={numThreads:r};if(p)$.wasmBinary=p;else if(h||n)$.locateFile=v=>h??n+v;else if(u&&u.indexOf("blob:")!==0)$.locateFile=v=>new URL(v,u).href;else if(m){let v=Og();v&&($.locateFile=T=>v+T)}g($).then(v=>{fn=!1,ua=!0,_o=v,b(),m&&URL.revokeObjectURL(m)},v=>{fn=!1,wo=!0,k(v)})})),await Promise.race(w),_)throw new Error(`WebAssembly backend initializing failed due to timeout: ${t}ms`)},rt=()=>{if(ua&&_o)return _o;throw new Error("WebAssembly is not initialized yet.")}}),ut,Wa,xe,ql=F(()=>{vi(),ut=(e,t)=>{let r=rt(),i=r.lengthBytesUTF8(e)+1,a=r._malloc(i);return r.stringToUTF8(e,a,i),t.push(a),a},Wa=(e,t,r,i)=>{if(typeof e=="object"&&e!==null){if(r.has(e))throw new Error("Circular reference in options");r.add(e)}Object.entries(e).forEach(([a,n])=>{let s=t?t+a:a;if(typeof n=="object")Wa(n,s+".",r,i);else if(typeof n=="string"||typeof n=="number")i(s,n.toString());else if(typeof n=="boolean")i(s,n?"1":"0");else throw new Error(`Can't handle extra config type: ${typeof n}`)})},xe=e=>{let t=rt(),r=t.stackSave();try{let i=t.PTR_SIZE,a=t.stackAlloc(2*i);t._OrtGetLastError(a,a+i);let n=Number(t.getValue(a,i===4?"i32":"i64")),s=t.getValue(a+i,"*"),u=s?t.UTF8ToString(s):"";throw new Error(`${e} ERROR_CODE: ${n}, ERROR_MESSAGE: ${u}`)}finally{t.stackRestore(r)}}}),Bg,o$=F(()=>{vi(),ql(),Bg=e=>{let t=rt(),r=0,i=[],a=e||{};try{if((e==null?void 0:e.logSeverityLevel)===void 0)a.logSeverityLevel=2;else if(typeof e.logSeverityLevel!="number"||!Number.isInteger(e.logSeverityLevel)||e.logSeverityLevel<0||e.logSeverityLevel>4)throw new Error(`log serverity level is not valid: ${e.logSeverityLevel}`);if((e==null?void 0:e.logVerbosityLevel)===void 0)a.logVerbosityLevel=0;else if(typeof e.logVerbosityLevel!="number"||!Number.isInteger(e.logVerbosityLevel))throw new Error(`log verbosity level is not valid: ${e.logVerbosityLevel}`);(e==null?void 0:e.terminate)===void 0&&(a.terminate=!1);let n=0;return(e==null?void 0:e.tag)!==void 0&&(n=ut(e.tag,i)),r=t._OrtCreateRunOptions(a.logSeverityLevel,a.logVerbosityLevel,!!a.terminate,n),r===0&&xe("Can't create run options."),(e==null?void 0:e.extra)!==void 0&&Wa(e.extra,"",new WeakSet,(s,u)=>{let l=ut(s,i),h=ut(u,i);t._OrtAddRunConfigEntry(r,l,h)!==0&&xe(`Can't set a run config entry: ${s} - ${u}.`)}),[r,i]}catch(n){throw r!==0&&t._OrtReleaseRunOptions(r),i.forEach(s=>t._free(s)),n}}}),Fp,Wp,Vp,Gp,Ng,u$=F(()=>{vi(),ql(),Fp=e=>{switch(e){case"disabled":return 0;case"basic":return 1;case"extended":return 2;case"all":return 99;default:throw new Error(`unsupported graph optimization level: ${e}`)}},Wp=e=>{switch(e){case"sequential":return 0;case"parallel":return 1;default:throw new Error(`unsupported execution mode: ${e}`)}},Vp=e=>{e.extra||(e.extra={}),e.extra.session||(e.extra.session={});let t=e.extra.session;t.use_ort_model_bytes_directly||(t.use_ort_model_bytes_directly="1"),e.executionProviders&&e.executionProviders.some(r=>(typeof r=="string"?r:r.name)==="webgpu")&&(e.enableMemPattern=!1)},Gp=(e,t,r)=>{for(let i of t){let a=typeof i=="string"?i:i.name;switch(a){case"webnn":if(a="WEBNN",typeof i!="string"){let s=i==null?void 0:i.deviceType;if(s){let u=ut("deviceType",r),l=ut(s,r);rt()._OrtAddSessionConfigEntry(e,u,l)!==0&&xe(`Can't set a session config entry: 'deviceType' - ${s}.`)}}break;case"webgpu":if(a="JS",typeof i!="string"){let s=i;if(s!=null&&s.preferredLayout){if(s.preferredLayout!=="NCHW"&&s.preferredLayout!=="NHWC")throw new Error(`preferredLayout must be either 'NCHW' or 'NHWC': ${s.preferredLayout}`);let u=ut("preferredLayout",r),l=ut(s.preferredLayout,r);rt()._OrtAddSessionConfigEntry(e,u,l)!==0&&xe(`Can't set a session config entry: 'preferredLayout' - ${s.preferredLayout}.`)}}break;case"wasm":case"cpu":continue;default:throw new Error(`not supported execution provider: ${a}`)}let n=ut(a,r);rt()._OrtAppendExecutionProvider(e,n)!==0&&xe(`Can't append execution provider: ${a}.`)}},Ng=e=>{let t=rt(),r=0,i=[],a=e||{};Vp(a);try{let n=Fp(a.graphOptimizationLevel??"all"),s=Wp(a.executionMode??"sequential"),u=typeof a.logId=="string"?ut(a.logId,i):0,l=a.logSeverityLevel??2;if(!Number.isInteger(l)||l<0||l>4)throw new Error(`log serverity level is not valid: ${l}`);let h=a.logVerbosityLevel??0;if(!Number.isInteger(h)||h<0||h>4)throw new Error(`log verbosity level is not valid: ${h}`);let p=typeof a.optimizedModelFilePath=="string"?ut(a.optimizedModelFilePath,i):0;if(r=t._OrtCreateSessionOptions(n,!!a.enableCpuMemArena,!!a.enableMemPattern,s,!!a.enableProfiling,0,u,l,h,p),r===0&&xe("Can't create session options."),a.executionProviders&&Gp(r,a.executionProviders,i),a.enableGraphCapture!==void 0){if(typeof a.enableGraphCapture!="boolean")throw new Error(`enableGraphCapture must be a boolean value: ${a.enableGraphCapture}`);let m=ut("enableGraphCapture",i),g=ut(a.enableGraphCapture.toString(),i);t._OrtAddSessionConfigEntry(r,m,g)!==0&&xe(`Can't set a session config entry: 'enableGraphCapture' - ${a.enableGraphCapture}.`)}if(a.freeDimensionOverrides)for(let[m,g]of Object.entries(a.freeDimensionOverrides)){if(typeof m!="string")throw new Error(`free dimension override name must be a string: ${m}`);if(typeof g!="number"||!Number.isInteger(g)||g<0)throw new Error(`free dimension override value must be a non-negative integer: ${g}`);let _=ut(m,i);t._OrtAddFreeDimensionOverride(r,_,g)!==0&&xe(`Can't set a free dimension override: ${m} - ${g}.`)}return a.extra!==void 0&&Wa(a.extra,"",new WeakSet,(m,g)=>{let _=ut(m,i),w=ut(g,i);t._OrtAddSessionConfigEntry(r,_,w)!==0&&xe(`Can't set a session config entry: ${m} - ${g}.`)}),[r,i]}catch(n){throw r!==0&&t._OrtReleaseSessionOptions(r)!==0&&xe("Can't release session options."),i.forEach(s=>t._free(s)),n}}}),Ii,di,hi,Hl,Va,Kl,Xl,bu,se=F(()=>{Ii=e=>{switch(e){case"int8":return 3;case"uint8":return 2;case"bool":return 9;case"int16":return 5;case"uint16":return 4;case"int32":return 6;case"uint32":return 12;case"float16":return 10;case"float32":return 1;case"float64":return 11;case"string":return 8;case"int64":return 7;case"uint64":return 13;case"int4":return 22;case"uint4":return 21;default:throw new Error(`unsupported data type: ${e}`)}},di=e=>{switch(e){case 3:return"int8";case 2:return"uint8";case 9:return"bool";case 5:return"int16";case 4:return"uint16";case 6:return"int32";case 12:return"uint32";case 10:return"float16";case 1:return"float32";case 11:return"float64";case 8:return"string";case 7:return"int64";case 13:return"uint64";case 22:return"int4";case 21:return"uint4";default:throw new Error(`unsupported data type: ${e}`)}},hi=(e,t)=>{let r=[-1,4,1,1,2,2,4,8,-1,1,2,8,4,8,-1,-1,-1,-1,-1,-1,-1,.5,.5][e],i=typeof t=="number"?t:t.reduce((a,n)=>a*n,1);return r>0?Math.ceil(i*r):void 0},Hl=e=>{switch(e){case"float16":return typeof Float16Array<"u"&&Float16Array.from?Float16Array:Uint16Array;case"float32":return Float32Array;case"uint8":return Uint8Array;case"int8":return Int8Array;case"uint16":return Uint16Array;case"int16":return Int16Array;case"int32":return Int32Array;case"bool":return Uint8Array;case"float64":return Float64Array;case"uint32":return Uint32Array;case"int64":return BigInt64Array;case"uint64":return BigUint64Array;default:throw new Error(`unsupported type: ${e}`)}},Va=e=>{switch(e){case"verbose":return 0;case"info":return 1;case"warning":return 2;case"error":return 3;case"fatal":return 4;default:throw new Error(`unsupported logging level: ${e}`)}},Kl=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",Xl=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint64"||e==="int8"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",bu=e=>{switch(e){case"none":return 0;case"cpu":return 1;case"cpu-pinned":return 2;case"texture":return 3;case"gpu-buffer":return 4;case"ml-tensor":return 5;default:throw new Error(`unsupported data location: ${e}`)}}}),Yl,Pg=F(()=>{Vl(),Yl=async e=>{if(typeof e=="string"){let t=await fetch(e);if(!t.ok)throw new Error(`failed to load external data file: ${e}`);let r=t.headers.get("Content-Length"),i=r?parseInt(r,10):0;if(i<1073741824)return new Uint8Array(await t.arrayBuffer());{if(!t.body)throw new Error(`failed to load external data file: ${e}, no response body.`);let a=t.body.getReader(),n;try{n=new ArrayBuffer(i)}catch(u){if(u instanceof RangeError){let l=Math.ceil(i/65536);n=new WebAssembly.Memory({initial:l,maximum:l}).buffer}else throw u}let s=0;for(;;){let{done:u,value:l}=await a.read();if(u)break;let h=l.byteLength;new Uint8Array(n,s,h).set(l),s+=h}return new Uint8Array(n,0,i)}}else return e instanceof Blob?new Uint8Array(await e.arrayBuffer()):e instanceof Uint8Array?e:new Uint8Array(e)}}),jp,qp,Hp,Kp,Ql,Xp,_e,Ar=F(()=>{se(),jp=["V","I","W","E","F"],qp=(e,t)=>{console.log(`[${jp[e]},${new Date().toISOString()}]${t}`)},Ql=(e,t)=>{Hp=e,Kp=t},Xp=(e,t)=>{let r=Va(e),i=Va(Hp);r>=i&&qp(r,typeof t=="function"?t():t)},_e=(...e)=>{Kp&&Xp(...e)}}),Zl,Dg=F(()=>{se(),Zl=(e,t)=>new(Hl(t))(e)}),Jl=F(()=>{}),bo,la,da,Yp,Qp,vo,vu,Zp,Lg,l$=F(()=>{Ar(),Jl(),bo=new Map([[64,250],[128,200],[256,200],[512,200],[2048,230],[4096,200],[8192,50],[16384,50],[32768,50],[65536,50],[131072,50],[262144,50],[524288,50],[1048576,50],[2097152,30],[4194304,20],[8388608,10],[12582912,10],[16777216,10],[26214400,15],[33554432,22],[44236800,2],[58982400,6],[67108864,6],[134217728,6],[167772160,6]]),la=[],da=e=>Math.ceil(Number(e)/16)*16,Yp=e=>{for(let t=0;t<la.length;t++){let r=la[t];if(e<=r)return r}return Math.ceil(e/16)*16},Qp=1,vo=()=>Qp++,vu=async(e,t,r,i)=>{let a=da(r),n=e.device.createBuffer({size:a,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});try{let s=e.getCommandEncoder();e.endComputePass(),s.copyBufferToBuffer(t,0,n,0,a),e.flush(),await n.mapAsync(GPUMapMode.READ);let u=n.getMappedRange();if(i){let l=i();return l.set(new Uint8Array(u,0,r)),l}else return new Uint8Array(u.slice(0,r))}finally{n.destroy()}},Zp=class{constructor(e){this.backend=e,this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.buffersPending=[],this.capturedPendingBuffers=new Map;for(let[t]of bo)la.push(t),this.freeBuffers.set(t,[]),this.freeUniformBuffers.set(t,[]);this.sessionCount=0}upload(e,t){let r=t.buffer,i=t.byteOffset,a=t.byteLength,n=da(a),s=this.storageCache.get(e);if(!s)throw new Error("gpu data for uploading does not exist");if(Number(s.originalSize)!==a)throw new Error(`inconsistent data size. gpu data size=${s.originalSize}, data size=${a}`);let u=this.backend.device.createBuffer({mappedAtCreation:!0,size:n,usage:GPUBufferUsage.MAP_WRITE|GPUBufferUsage.COPY_SRC}),l=u.getMappedRange();new Uint8Array(l).set(new Uint8Array(r,i,a)),u.unmap();let h=this.backend.device.createCommandEncoder();h.copyBufferToBuffer(u,0,s.gpuData.buffer,0,n),this.backend.device.queue.submit([h.finish()]),u.destroy(),_e("verbose",()=>`[WebGPU] GpuDataManager.upload(id=${e})`)}memcpy(e,t){let r=this.storageCache.get(e);if(!r)throw new Error("source gpu data for memcpy does not exist");let i=this.storageCache.get(t);if(!i)throw new Error("destination gpu data for memcpy does not exist");if(r.originalSize!==i.originalSize)throw new Error("inconsistent source and destination gpu data size");let a=da(r.originalSize),n=this.backend.getCommandEncoder();this.backend.endComputePass(),n.copyBufferToBuffer(r.gpuData.buffer,0,i.gpuData.buffer,0,a)}registerExternalBuffer(e,t,r){let i;if(r){if(i=r[0],e===r[1])return _e("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${i}, buffer is the same, skip.`),i;if(this.backend.capturedCommandList.has(this.backend.currentSessionId))throw new Error(`Registering a different external buffer under graph capture mode is not supported yet.
             Please use the previous external buffer!`)}else i=vo();return this.storageCache.set(i,{gpuData:{id:i,type:0,buffer:e},originalSize:t}),_e("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${i}, registered.`),i}unregisterExternalBuffer(e){e!==void 0&&(this.storageCache.delete(e),_e("verbose",()=>`[WebGPU] GpuDataManager.unregisterExternalBuffer() => id=${e}`))}create(e,t=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST){let r=Yp(e),i,a=(t&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE,n=(t&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM;if(a||n){let u=(a?this.freeBuffers:this.freeUniformBuffers).get(r);u?u.length>0?i=u.pop():i=this.backend.device.createBuffer({size:r,usage:t}):i=this.backend.device.createBuffer({size:r,usage:t})}else i=this.backend.device.createBuffer({size:r,usage:t});let s={id:vo(),type:0,buffer:i};return this.storageCache.set(s.id,{gpuData:s,originalSize:Number(e)}),_e("verbose",()=>`[WebGPU] GpuDataManager.create(size=${e}) => id=${s.id}`),s}get(e){var t;return(t=this.storageCache.get(e))==null?void 0:t.gpuData}release(e){let t=typeof e=="bigint"?Number(e):e,r=this.storageCache.get(t);if(!r){if(this.storageCache.size===0)return 0;throw new Error("releasing data does not exist")}return _e("verbose",()=>`[WebGPU] GpuDataManager.release(id=${t}), gpuDataId=${r.gpuData.id}`),this.storageCache.delete(t),this.buffersPending.push(r.gpuData.buffer),r.originalSize}async download(e,t){let r=this.storageCache.get(Number(e));if(!r)throw new Error("data does not exist");await vu(this.backend,r.gpuData.buffer,r.originalSize,t)}refreshPendingBuffers(){if(this.buffersPending.length!==0)if(this.backend.sessionStatus==="default"){for(let e of this.buffersPending){let t=bo.get(e.size);if((e.usage&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE){let r=this.freeBuffers.get(e.size)||[];t===void 0||r.length>=t?e.destroy():r.push(e)}else if((e.usage&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM){let r=this.freeUniformBuffers.get(e.size)||[];t===void 0||r.length>=t?e.destroy():r.push(e)}else e.destroy()}this.buffersPending=[]}else{let e=this.capturedPendingBuffers.get(this.backend.currentSessionId);e||(e=[],this.capturedPendingBuffers.set(this.backend.currentSessionId,e));for(let t of this.buffersPending)e.push(t);this.buffersPending=[]}}dispose(){this.freeBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.freeUniformBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache.forEach(e=>{e.gpuData.buffer.destroy()}),this.capturedPendingBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.capturedPendingBuffers=new Map}onCreateSession(){this.sessionCount+=1}onReleaseSession(e){let t=this.capturedPendingBuffers.get(e);t&&(t.forEach(r=>{r.destroy()}),this.capturedPendingBuffers.delete(e)),this.sessionCount-=1,this.sessionCount===0&&(_e("warning",()=>"[WebGPU] Clearing webgpu buffer cache"),this.storageCache.forEach(r=>{r.gpuData.buffer.destroy()}),this.storageCache=new Map)}},Lg=(...e)=>new Zp(...e)}),Jp,Ce,qe=F(()=>{Jp=class{constructor(e){Object.assign(this,e)}get cacheKey(){return this.key||(this.key=Object.getOwnPropertyNames(this).sort().map(e=>`${this[e]}`).join(";")),this.key}},Ce=e=>new Jp(e)}),ef,Hi,O,Ga,Ug,Fg,Wg,fe=F(()=>{ef=class{static calcMatMulShape(e,t){return e[1]!==t[0]?void 0:[e[0],t[1]]}},Hi=class{static calcShape(e,t,r=!1){let i=e.length,a=t.length;if(i===0)return t;if(a===0)return e;let n=Math.max(e.length,t.length),s=new Array(n);if(r){if(i<2||a<2)return;let u=ef.calcMatMulShape([e[i-2],e[i-1]],[t[a-2],t[a-1]]);if(u===void 0)return;[s[n-2],s[n-1]]=u}for(let u=r?3:1;u<=n;u++){let l=i-u<0?1:e[i-u],h=a-u<0?1:t[a-u];if(l!==h&&l>1&&h>1)return;let p=Math.max(l,h);if(l&&h)s[n-u]=Math.max(l,h);else{if(p>1)return;s[n-u]=0}}return s}static isValidBroadcast(e,t){let r=e.length,i=t.length;if(r>i)return!1;for(let a=1;a<=r;a++)if(e[r-a]!==1&&e[r-a]!==t[i-a])return!1;return!0}},O=class Ia{static size(t){return Ia.getSizeFromDimensionRange(t,0,t.length)}static convertShape(t,r=4){let i=t.length;if(i===0)return[];let a=new Array(i),n=i-1;for(;n>=0;){if(t[n]%r===0){a[n]=t[n]/r;break}if(r%t[n]!==0)throw new Error("cannot convert shape");a[n]=1,r/=t[n],n--}for(n--;n>=0;n--)a[n]=t[n];return a}static sizeFromDimension(t,r){if(r<0||r>t.length)throw new Error(`invalid dimension of ${r} for sizeFromDimension as Tensor has ${t.length} dimensions.`);return Ia.getSizeFromDimensionRange(t,r,t.length)}static sizeToDimension(t,r){if(r<0||r>t.length)throw new Error(`invalid dimension of ${r} for sizeToDimension as Tensor has ${t.length} dimensions.`);return Ia.getSizeFromDimensionRange(t,0,r)}static getSizeFromDimensionRange(t,r,i){let a=1;for(let n=r;n<i;n++){if(t[n]<0)throw new Error("cannot get valid size from specified dimension range. Most likely the range contains negative values in them.");a*=Number(t[n])}return a}static computeStrides(t){let r=t.length;if(r===0)return[];if(r===1)return[1];let i=new Array(r);i[r-1]=1,i[r-2]=t[r-1];for(let a=r-3;a>=0;--a)i[a]=i[a+1]*t[a+1];return i}static normalizeAxis(t,r){if(t<-r&&t>=r)throw new Error("unsupported axis for this operation.");return t<0?t+r:t}static normalizeAxes(t,r){return t.map(i=>this.normalizeAxis(i,r??t.length))}static sortBasedOnPerm(t,r){return r?r.map(i=>t[i]):t.slice().reverse()}static padShape(t,r){let i=t.length;return t.map((a,n)=>a+r[n]+r[n+i])}static areEqual(t,r){return t.length!==r.length?!1:t.every((i,a)=>i===r[a])}},Ga=class Tn{static adjustPoolAttributes(t,r,i,a,n,s){if(!t&&i.length!==r.length-2)throw new Error("length of specified kernel shapes should be 2 less than length of input dimensions");if(t)for(let u=0;u<r.length-2;u++)u>=i.length?i.push(r[u+2]):i[u]=r[u+2];for(let u=0;u<i.length;u++)if(u<a.length){if(a[u]<0)throw new Error("strides should be greater than or equal to 1")}else a.push(1);for(let u=0;u<i.length;u++)if(u<n.length){if(n[u]<0)throw new Error("dilations should be greater than or equal to 1")}else n.push(1);for(let u=0;u<i.length*2;u++)if(u<s.length){if(s[u]<0)throw new Error("pad should be greater than or equal to 1")}else s.push(0);for(let u=0;u<i.length;u++){if(i[u]<=0)throw new Error("kernel shapes need to be greater than 0");if(s[u]>=i[u]||s[u+i.length]>=i[u])throw new Error("pads should be smaller than kernel")}}static adjustPadsBasedOnAutoPad(t,r,i,a,n,s,u){if(u){if(n.length!==2*(t.length-2))throw new Error("length of pads should be twice the length of data dimensions");if(r.length!==t.length-2)throw new Error("length of strides should be the length of data dimensions");if(a.length!==t.length-2)throw new Error("length of kernel shapes should be the length of data dimensions");for(let l=0;l<t.length-2;l++)Tn.adjustPadAndReturnShape(t[l+(s?1:2)],r[l],i[l],a[l],n,l,l+t.length-2,u)}}static computePoolOutputShape(t,r,i,a,n,s,u){if(r.length<=0)throw new Error("input shape must be of size greater than 0");let l=[r[0],r[1]];return Tn.computeShapeHelper(t,r,l,i,a,n,s,u),l}static computeConvOutputShape(t,r,i,a,n,s,u){if(t.length<=0||r.length<=0)throw new Error("invalid input tensor dims or invalid filter tensor dims");let l=[t[0],r[0]];return Tn.computeShapeHelper(!1,t,l,i,a,n,s,u),l}static computeShapeHelper(t,r,i,a,n,s,u,l){if(t)for(let h=0;h<r.length-2;h++)i.push(1);else for(let h=0;h<r.length-2;h++)i.push(Tn.adjustPadAndReturnShape(r[h+2],a[h],n[h],s[h],u,h,h+r.length-2,l))}static adjustPadAndReturnShape(t,r,i,a,n,s,u,l){let h=i*(a-1)+1;if(l&&l!=="NOTSET")switch(l){case"VALID":return n[s]=0,n[u]=0,Math.floor((t-h)/r+1);case"SAME_LOWER":case"SAME_UPPER":if(i!==1)throw new Error("Dilation not supported for SAME_UPPER or SAME_LOWER");{let p=((t+r-1)/r-1)*r+a-t;return n[s]=Math.floor(l==="SAME_LOWER"?(p+1)/2:p/2),n[u]=p-n[s],Math.floor((t+p-a)/r+1)}default:throw new Error("Unsupported AutoPad type")}else return Math.floor((t+n[s]+n[u]-h)/r+1)}},Ug=class{static getShapeOfGemmResult(e,t,r,i,a){if(e.length!==2||r.length!==2)throw new Error("shape need to be of size 2");let n,s,u;t?(n=e[1],s=e[0]):(n=e[0],s=e[1]);let l=-1;if(i?(u=r[0],l=1):(u=r[1],l=0),r[l]!==s)throw new Error("dimension mismatch");if(n<=0||u<=0||s<=0)throw new Error("invalid shape specified");if(a&&!Hi.isValidBroadcast(a,[n,u]))throw new Error("gemm: invalid bias shape for broadcast");return[n,u,s]}},Fg=-34028234663852886e22,Wg=34028234663852886e22}),Ki,ha,nt,lt,Y,We,$u,zi,Kr,X,mn,B,K,Vg,ed,tf,Gg,me=F(()=>{se(),fe(),Ki=64,ha=(e,t)=>{if(t===3)throw new Error("vec3 has same alignment as vec4, use vec4 instead");switch(Number(e)){case 10:return t>1?`vec${t}<f16>`:"f16";case 1:return t>1?`vec${t}<f32>`:"f32";case 6:return t>1?`vec${t}<i32>`:"i32";case 12:return t>1?`vec${t}<u32>`:"u32";case 7:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","i32"];case 13:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","u32"];case 9:if(t!==4)throw new Error("bool must be vec4");return["u32","vec4<bool>"];case 22:return"i32";case 21:return"u32";default:throw new Error(`Unknown data type: ${e}`)}},nt=(e,t=1)=>{let r=ha(e,t);return typeof r=="string"?r:r[0]},lt=(e,t=1)=>{let r=ha(e,t);return typeof r=="string"?r:r[1]},Y=(...e)=>{let t=[];return e.forEach(r=>{r.length!==0&&t.push({type:12,data:r},{type:12,data:O.computeStrides(r)})}),t},We=e=>e%4===0?4:e%2===0?2:1,$u=(e="f32",t,r="0")=>!t||t===1?`${e}(${r})`:`vec${t}<${e}>(${r})`,zi=(e,t,r)=>e==="f32"?r:t===1?`f32(${r})`:`vec${t}<f32>(${r})`,Kr=(e,t)=>t===4?`(${e}.x + ${e}.y + ${e}.z + ${e}.w)`:t===2?`(${e}.x + ${e}.y)`:t===3?`(${e}.x + ${e}.y + ${e}.z)`:e,X=(e,t,r,i)=>e.startsWith("uniforms.")&&r>4?typeof t=="string"?i==="f16"?`${e}[(${t}) / 8][(${t}) % 8 / 4][(${t}) % 8 % 4]`:`${e}[(${t}) / 4][(${t}) % 4]`:i==="f16"?`${e}[${Math.floor(t/8)}][${Math.floor(t%8/4)}][${t%8%4}]`:`${e}[${Math.floor(t/4)}][${t%4}]`:r>1?`${e}[${t}]`:e,mn=(e,t,r,i,a)=>{let n=typeof r=="number",s=n?r:r.length,u=[...new Array(s).keys()],l=s<2?"u32":s<=4?`vec${s}<u32>`:`array<u32, ${s}>`,h=ha(t,a),p=typeof h=="string"?h:h[1],m=typeof h=="string"?h:h[0],g={indices:l,value:p,storage:m,tensor:t},_=N=>typeof N=="string"?N:`${N}u`,w={offsetToIndices:!1,indicesToOffset:!1,broadcastedIndicesToOffset:!1,set:!1,setByIndices:!1,get:!1,getByIndices:!1},b=n?"uniforms.":"",k=`${b}${e}_shape`,$=`${b}${e}_strides`,v="";for(let N=0;N<s-1;N++)v+=`
    let dim${N} = current / ${X($,N,s)};
    let rest${N} = current % ${X($,N,s)};
    indices[${N}] = dim${N};
    current = rest${N};
    `;v+=`indices[${s-1}] = current;`;let T=s<2?"":`
  fn o2i_${e}(offset: u32) -> ${g.indices} {
    var indices: ${g.indices};
    var current = offset;
    ${v}
    return indices;
  }`,S=N=>(w.offsetToIndices=!0,s<2?N:`o2i_${e}(${N})`),E=[];if(s>=2)for(let N=s-1;N>=0;N--)E.push(`${X($,N,s)} * (indices[${N}])`);let C=s<2?"":`
  fn i2o_${e}(indices: ${g.indices}) -> u32 {
    return ${E.join("+")};
  }`,A=N=>(w.indicesToOffset=!0,s<2?N:`i2o_${e}(${N})`),M=(...N)=>s===0?"0u":`${g.indices}(${N.map(_).join(",")})`,D=(N,W)=>s<2?`${N}`:`${X(N,W,s)}`,G=(N,W,ge)=>s<2?`${N}=${ge};`:`${X(N,W,s)}=${ge};`,oe={},he=(N,W)=>{w.broadcastedIndicesToOffset=!0;let ge=`${W.name}broadcastedIndicesTo${e}Offset`;if(ge in oe)return`${ge}(${N})`;let Be=[];for(let P=s-1;P>=0;P--){let ve=W.indicesGet("outputIndices",P+W.rank-s);Be.push(`${D($,P)} * (${ve} % ${D(k,P)})`)}return oe[ge]=`fn ${ge}(outputIndices: ${W.type.indices}) -> u32 {
             return ${Be.length>0?Be.join("+"):"0u"};
           }`,`${ge}(${N})`},Z=(N,W)=>(()=>{if(g.storage===g.value)return`${e}[${N}]=${W};`;if(g.storage==="vec2<u32>"&&g.value==="i32")return`${e}[${N}]=vec2<u32>(u32(${W}), select(0u, 0xFFFFFFFFu, ${W} < 0));`;if(g.storage==="vec2<u32>"&&g.value==="u32")return`${e}[${N}]=vec2<u32>(u32(${W}), 0u);`;if(g.storage==="u32"&&g.value==="vec4<bool>")return`${e}[${N}]=dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(${W}));`;throw new Error(`not supported combination of storage type ${g.storage} and value type ${g.value} yet`)})(),ue=N=>(()=>{if(g.storage===g.value)return`${e}[${N}]`;if(g.storage==="vec2<u32>"&&g.value==="i32")return`i32(${e}[${N}].x)`;if(g.storage==="vec2<u32>"&&g.value==="u32")return`u32(${e}[${N}].x)`;if(g.storage==="u32"&&g.value==="vec4<bool>")return`vec4<bool>(bool(${e}[${N}] & 0xFFu), bool(${e}[${N}] & 0xFF00u), bool(${e}[${N}] & 0xFF0000u), bool(${e}[${N}] & 0xFF000000u))`;throw new Error(`not supported combination of storage type ${g.storage} and value type ${g.value} yet`)})(),ne=s<2?"":`
  fn get_${e}ByIndices(indices: ${g.indices}) -> ${p} {
    return ${ue(`i2o_${e}(indices)`)};
  }`,V=s<2?"":(()=>{let N=u.map(ge=>`d${ge}: u32`).join(", "),W=u.map(ge=>`d${ge}`).join(", ");return`
  fn get_${e}(${N}) -> ${p} {
    return get_${e}ByIndices(${M(W)});
  }`})(),ye=(...N)=>{if(N.length!==s)throw new Error(`indices length must be ${s}`);let W=N.map(_).join(",");return s===0?ue("0u"):s===1?ue(W[0]):(w.get=!0,w.getByIndices=!0,w.indicesToOffset=!0,`get_${e}(${W})`)},Te=N=>s<2?ue(N):(w.getByIndices=!0,w.indicesToOffset=!0,`get_${e}ByIndices(${N})`),q=s<2?"":`
  fn set_${e}ByIndices(indices: ${g.indices}, value: ${p}) {
    ${Z(`i2o_${e}(indices)`,"value")}
  }`,Ee=s<2?"":(()=>{let N=u.map(ge=>`d${ge}: u32`).join(", "),W=u.map(ge=>`d${ge}`).join(", ");return`
  fn set_${e}(${N}, value: ${p}) {
    set_${e}ByIndices(${M(W)}, value);
  }`})();return{impl:()=>{let N=[],W=!1;return w.offsetToIndices&&(N.push(T),W=!0),w.indicesToOffset&&(N.push(C),W=!0),w.broadcastedIndicesToOffset&&(Object.values(oe).forEach(ge=>N.push(ge)),W=!0),w.set&&(N.push(Ee),W=!0),w.setByIndices&&(N.push(q),W=!0),w.get&&(N.push(V),W=!0),w.getByIndices&&(N.push(ne),W=!0),!n&&W&&N.unshift(`const ${k} = ${g.indices}(${r.join(",")});`,`const ${$} = ${g.indices}(${O.computeStrides(r).join(",")});`),N.join(`
`)},type:g,offsetToIndices:S,indicesToOffset:A,broadcastedIndicesToOffset:he,indices:M,indicesGet:D,indicesSet:G,set:(...N)=>{if(N.length!==s+1)throw new Error(`indices length must be ${s}`);let W=N[s];if(typeof W!="string")throw new Error("value must be string");let ge=N.slice(0,s).map(_).join(",");return s===0?Z("0u",W):s===1?Z(ge[0],W):(w.set=!0,w.setByIndices=!0,w.indicesToOffset=!0,`set_${e}(${ge}, ${W})`)},setByOffset:Z,setByIndices:(N,W)=>s<2?Z(N,W):(w.setByIndices=!0,w.indicesToOffset=!0,`set_${e}ByIndices(${N}, ${W});`),get:ye,getByOffset:ue,getByIndices:Te,usage:i,name:e,strides:$,shape:k,rank:s}},B=(e,t,r,i=1)=>mn(e,t,r,"input",i),K=(e,t,r,i=1)=>mn(e,t,r,"output",i),Vg=(e,t,r)=>mn(e,t,r,"atomicOutput",1),ed=(e,t,r,i=1)=>mn(e,t,r,"internal",i),tf=class{constructor(e,t){this.normalizedDispatchGroup=e,this.limits=t,this.internalVariables=[],this.variables=[],this.uniforms=[],this.variableIndex=0}guardAgainstOutOfBoundsWorkgroupSizes(e){return`if (global_idx >= ${typeof e=="number"?`${e}u`:e}) { return; }`}mainStart(e=Ki){let t=typeof e=="number"?e:e[0],r=typeof e=="number"?1:e[1],i=typeof e=="number"?1:e[2];if(t>this.limits.maxComputeWorkgroupSizeX||r>this.limits.maxComputeWorkgroupSizeY||i>this.limits.maxComputeWorkgroupSizeZ)throw new Error(`workgroup size [${t}, ${r}, ${i}] exceeds the maximum workgroup size [${this.limits.maxComputeWorkgroupSizeX}, ${this.limits.maxComputeWorkgroupSizeY}, ${this.limits.maxComputeWorkgroupSizeZ}].`);if(t*r*i>this.limits.maxComputeInvocationsPerWorkgroup)throw new Error(`workgroup size [${t}, ${r}, ${i}] exceeds the maximum workgroup invocations ${this.limits.maxComputeInvocationsPerWorkgroup}.`);let a=this.normalizedDispatchGroup[1]===1&&this.normalizedDispatchGroup[2]===1,n=a?`@builtin(global_invocation_id) global_id : vec3<u32>,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(local_invocation_id) local_id : vec3<u32>`:`@builtin(global_invocation_id) global_id : vec3<u32>,
                                             @builtin(local_invocation_id) local_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(num_workgroups) num_workgroups : vec3<u32>`,s=a?`let global_idx = global_id.x;
         let workgroup_index = workgroup_id.x;`:`let workgroup_index = workgroup_id.z * num_workgroups[0] * num_workgroups[1] +
             workgroup_id.y * num_workgroups[0] + workgroup_id.x;
         let global_idx = workgroup_index * ${t*r*i}u + local_idx;`;return`@compute @workgroup_size(${t}, ${r}, ${i})
  fn main(${n}) {
    ${s}
  `}appendVariableUniforms(e){e.rank!==0&&(e.shape.startsWith("uniforms.")&&this.uniforms.push({name:e.shape.replace("uniforms.",""),type:"u32",length:e.rank}),e.strides.startsWith("uniforms.")&&this.uniforms.push({name:e.strides.replace("uniforms.",""),type:"u32",length:e.rank}))}declareVariable(e,t){if(e.usage==="internal")throw new Error("cannot use internal variable with declareVariable(). use registerInternalVariables() instead.");this.variables.push(e),this.appendVariableUniforms(e);let r=e.usage==="input"?"read":"read_write",i=e.usage==="atomicOutput"?"atomic<i32>":e.type.storage;return`@group(0) @binding(${t}) var<storage, ${r}> ${e.name}: array<${i}>;`}declareVariables(...e){return e.map(t=>this.declareVariable(t,this.variableIndex++)).join(`
`)}registerInternalVariable(e){if(e.usage!=="internal")throw new Error("cannot use input or output variable with registerInternalVariable(). use declareVariables() instead.");this.internalVariables.push(e),this.appendVariableUniforms(e)}registerInternalVariables(...e){return e.forEach(t=>this.registerInternalVariable(t)),this}registerUniform(e,t,r=1){return this.uniforms.push({name:e,type:t,length:r}),this}registerUniforms(e){return this.uniforms=this.uniforms.concat(e),this}uniformDeclaration(){if(this.uniforms.length===0)return"";let e=[];for(let{name:t,type:r,length:i}of this.uniforms)if(i&&i>4)r==="f16"?e.push(`@align(16) ${t}:array<mat2x4<${r}>, ${Math.ceil(i/8)}>`):e.push(`${t}:array<vec4<${r}>, ${Math.ceil(i/4)}>`);else{let a=i==null||i===1?r:`vec${i}<${r}>`;e.push(`${t}:${a}`)}return`
      struct Uniforms { ${e.join(", ")} };
      @group(0) @binding(${this.variableIndex}) var<uniform> uniforms: Uniforms;`}get additionalImplementations(){return this.uniformDeclaration()+this.variables.map(e=>e.impl()).join(`
`)+this.internalVariables.map(e=>e.impl()).join(`
`)}get variablesInfo(){if(this.uniforms.length===0)return;let e=t=>[12,10,1,6][["u32","f16","f32","i32"].indexOf(t)];return this.uniforms.map(t=>[e(t.type),t.length??1])}},Gg=(e,t)=>new tf(e,t)}),rf,$o,nf,af,sf,of,It,jg,qg,Zr=F(()=>{se(),fe(),qe(),me(),rf=(e,t)=>{if(!e||e.length!==1)throw new Error("Transpose requires 1 input.");if(t.length!==0&&t.length!==e[0].dims.length)throw new Error(`perm size ${t.length} does not match input rank ${e[0].dims.length}`)},$o=(e,t)=>t.length!==0?t:[...new Array(e).keys()].reverse(),nf=(e,t)=>O.sortBasedOnPerm(e,$o(e.length,t)),af=(e,t,r,i)=>{let a=`fn perm(i: ${i.type.indices}) -> ${r.type.indices} {
    var a: ${r.type.indices};`;for(let n=0;n<t;++n)a+=`a[${e[n]}]=i[${n}];`;return a+="return a;}"},sf=(e,t)=>{let r=[],i=[];for(let a=0;a<e.length;++a)e[a]!==1&&r.push(e[a]),e[t[a]]!==1&&i.push(t[a]);return{newShape:r,newPerm:i}},of=(e,t)=>{let r=0;for(let i=0;i<e.length;++i)if(t[e[i]]!==1){if(e[i]<r)return!1;r=e[i]}return!0},It=(e,t)=>{let r=e.dataType,i=e.dims.length,a=$o(i,t),n=nf(e.dims,a),s=e.dims,u=n,l=i<2||of(a,e.dims),h;if(l)return h=w=>{let b=B("input",r,s,4),k=K("output",r,u,4);return`
  ${w.registerUniform("output_size","u32").declareVariables(b,k)}
  ${w.mainStart()}
    ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    output[global_idx] = input[global_idx];
  }`},{name:"TransposeCopy",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let w=O.size(n);return{outputs:[{dims:n,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(w/64/4)},programUniforms:[{type:12,data:Math.ceil(w/4)}]}},getShaderSource:h};let{newShape:p,newPerm:m}=sf(e.dims,a),g=O.areEqual(m,[2,3,1]),_=O.areEqual(m,[3,1,2]);if(p.length===2||g||_){s=g?[p[0],p[1]*p[2]]:_?[p[0]*p[1],p[2]]:p,u=[s[1],s[0]];let w=16;return h=b=>{let k=B("a",r,s.length),$=K("output",r,u.length);return`
  ${b.registerUniform("output_size","u32").declareVariables(k,$)}
  var<workgroup> tile : array<array<${$.type.value}, ${w+1}>, ${w}>;
  ${b.mainStart([w,w,1])}
    let stride = (uniforms.output_shape[1] - 1) / ${w} + 1;
    let workgroup_id_x = workgroup_index % stride;
    let workgroup_id_y = workgroup_index / stride;
    let input_col = workgroup_id_y * ${w}u + local_id.x;
    let input_row = workgroup_id_x * ${w}u + local_id.y;
    if (input_row < uniforms.a_shape[0] && input_col < uniforms.a_shape[1]) {
      tile[local_id.y][local_id.x] = ${k.getByIndices(`${k.type.indices}(input_row, input_col)`)};
    }
    workgroupBarrier();

    let output_col = workgroup_id_x * ${w}u + local_id.x;
    let output_row = workgroup_id_y * ${w}u + local_id.y;
    if (output_row < uniforms.output_shape[0] && output_col < uniforms.output_shape[1]) {
      ${$.setByIndices(`${$.type.indices}(output_row, output_col)`,"tile[local_id.x][local_id.y]")}
    }
  }`},{name:"TransposeShared",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let b=O.size(n);return{outputs:[{dims:n,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(u[1]/w),y:Math.ceil(u[0]/w)},programUniforms:[{type:12,data:b},...Y(s,u)]}},getShaderSource:h}}return h=w=>{let b=B("a",r,s.length),k=K("output",r,u.length);return`
  ${w.registerUniform("output_size","u32").declareVariables(b,k)}

  ${af(a,i,b,k)}

  ${w.mainStart()}
    ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${k.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${k.setByOffset("global_idx",b.getByIndices("aIndices"))}
  }`},{name:"Transpose",shaderCache:{hint:`${t}`,inputDependencies:["rank"]},getRunData:()=>{let w=O.size(n);return{outputs:[{dims:n,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(w/64)},programUniforms:[{type:12,data:w},...Y(s,u)]}},getShaderSource:h}},jg=(e,t)=>{rf(e.inputs,t.perm),e.compute(It(e.inputs[0],t.perm))},qg=e=>Ce({perm:e.perm})}),uf,lf,df,hf,cf,pf,ff,mf,gf,yf,Ht,Hg,Kg,Xg,Yg,Qg,Zg,Jg,e3,t3,r3,d$=F(()=>{se(),fe(),me(),td(),Zr(),uf={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate * candidate",logSumExp:"bestValue + exp(candidate)",l1:"bestValue + abs(candidate)",l2:"bestValue + candidate * candidate",logSum:"bestValue + candidate"},lf={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate",logSumExp:"bestValue + candidate",l1:"bestValue + candidate",l2:"bestValue + candidate",logSum:"bestValue + candidate"},df={max:"_A[offset]",min:"_A[offset]",mean:"0",sum:"0",prod:"1",sumSquare:"0",logSumExp:"0",l1:"0",l2:"0",logSum:"0"},hf={max:"bestValue",min:"bestValue",sum:"bestValue",prod:"bestValue",sumSquare:"bestValue",logSumExp:"log(bestValue)",l1:"bestValue",l2:"sqrt(bestValue)",logSum:"log(bestValue)"},cf=(e,t)=>{let r=[];for(let i=t-e;i<t;++i)r.push(i);return r},pf=(e,t)=>{let r=[],i=e.length;for(let n=0;n<i;n++)t.indexOf(n)===-1&&r.push(e[n]);let a=t.map(n=>e[n]);return[r,a]},ff=(e,t)=>{let r=e.length+t.length,i=[],a=0;for(let n=0;n<r;n++)t.indexOf(n)===-1?i.push(e[a++]):i.push(1);return i},mf=(e,t)=>{for(let r=0;r<e.length;++r)if(e[e.length-r-1]!==t-1-r)return!1;return!0},gf=(e,t)=>{let r=[];if(!mf(e,t)){for(let i=0;i<t;++i)e.indexOf(i)===-1&&r.push(i);e.forEach(i=>r.push(i))}return r},yf=(e,t,r,i,a,n,s)=>{let u=r[0].dims,l=O.size(n),h=O.size(s),p=B("_A",r[0].dataType,u),m=K("output",a,n),g=64;l===1&&(g=256);let _=`
          var<workgroup> aBestValues : array<f32, ${g}>;
       `,w=b=>`
        ${b.registerUniform("reduceSize","u32").declareVariables(p,m)}
        ${_}
        fn DIV_CEIL(a : u32, b : u32) -> u32 {
          return ((a - 1u) / b + 1u);
         }
         ${b.mainStart(g)}

          let outputIndex = global_idx / ${g};
          let offset = outputIndex * uniforms.reduceSize;

          var bestValue = f32(${df[i]});
          let Length = uniforms.reduceSize;
          for (var k = local_idx; k < Length; k = k + ${g}) {
           let candidate = f32(${p.getByOffset("offset + k")});
           bestValue = ${uf[i]};
          }
          aBestValues[local_idx] = bestValue;
          workgroupBarrier();

         var reduceSize = min(Length, ${g}u);
         for (var currentSize = reduceSize / 2u; reduceSize > 1u;
             currentSize = reduceSize / 2u) {
           let interval = DIV_CEIL(reduceSize, 2u);
           if (local_idx < currentSize) {
            let candidate = aBestValues[local_idx + interval];
            bestValue = ${lf[i]};
            aBestValues[local_idx] = bestValue;
           }
           reduceSize = interval;
           workgroupBarrier();
         }

         if (local_idx == 0u) {
          ${m.setByOffset("outputIndex",`${i==="mean"?`${m.type.storage}(bestValue / f32(uniforms.reduceSize))`:`${m.type.storage}(${hf[i]})`}`)};
         }
        }`;return{name:e,shaderCache:{hint:`${t};${g}`,inputDependencies:["type"]},getShaderSource:w,getRunData:()=>({outputs:[{dims:n,dataType:a}],dispatchGroup:{x:l},programUniforms:[{type:12,data:h}]})}},Ht=(e,t,r,i)=>{let a=e.inputs.length===1?r:xu(e.inputs,r),n=a.axes;n.length===0&&!a.noopWithEmptyAxes&&(n=e.inputs[0].dims.map((_,w)=>w));let s=O.normalizeAxes(n,e.inputs[0].dims.length),u=s,l=e.inputs[0],h=gf(u,e.inputs[0].dims.length);h.length>0&&(l=e.compute(It(e.inputs[0],h),{inputs:[0],outputs:[-1]})[0],u=cf(u.length,l.dims.length));let[p,m]=pf(l.dims,u),g=p;a.keepDims&&(g=ff(p,s)),e.compute(yf(t,a.cacheKey,[l],i,e.inputs[0].dataType,g,m),{inputs:[l]})},Hg=(e,t)=>{Ht(e,"ReduceMeanShared",t,"mean")},Kg=(e,t)=>{Ht(e,"ReduceL1Shared",t,"l1")},Xg=(e,t)=>{Ht(e,"ReduceL2Shared",t,"l2")},Yg=(e,t)=>{Ht(e,"ReduceLogSumExpShared",t,"logSumExp")},Qg=(e,t)=>{Ht(e,"ReduceMaxShared",t,"max")},Zg=(e,t)=>{Ht(e,"ReduceMinShared",t,"min")},Jg=(e,t)=>{Ht(e,"ReduceProdShared",t,"prod")},e3=(e,t)=>{Ht(e,"ReduceSumShared",t,"sum")},t3=(e,t)=>{Ht(e,"ReduceSumSquareShared",t,"sumSquare")},r3=(e,t)=>{Ht(e,"ReduceLogSumShared",t,"logSum")}}),Kt,_f,ja,xu,Xt,wf,bf,vf,$f,xf,kf,Sf,Tf,Ef,If,Yt,i3,n3,a3,s3,o3,u3,l3,d3,h3,c3,td=F(()=>{se(),fe(),qe(),me(),d$(),Kt=e=>{if(!e||e.length===0||e.length>2)throw new Error("Reduce op requires 1 or 2 inputs.");if(e.length===2&&e[1].dims.length!==1)throw new Error("Invalid axes input dims.")},_f=e=>["","",`var value = ${e.getByIndices("input_indices")};`,""],ja=(e,t,r,i,a,n,s=!1,u=!1)=>{let l=[],h=r[0].dims,p=h.length,m=O.normalizeAxes(a,p),g=!u&&m.length===0;h.forEach((b,k)=>{g||m.indexOf(k)>=0?s&&l.push(1):l.push(b)});let _=l.length,w=O.size(l);return{name:e,shaderCache:t,getShaderSource:b=>{let k=[],$=B("_A",r[0].dataType,p),v=K("output",n,_),T=i($,v,m),S=T[2];for(let E=0,C=0;E<p;E++)g||m.indexOf(E)>=0?(s&&C++,S=`for(var j${E}: u32 = 0; j${E} < ${h[E]}; j${E}++) {
                  ${T[2].includes("last_index")?`let last_index = j${E};`:""}
                  ${$.indicesSet("input_indices",E,`j${E}`)}
                  ${S}
                }`):(k.push(`${$.indicesSet("input_indices",E,v.indicesGet("output_indices",C))};`),C++);return`

        ${b.registerUniform("output_size","u32").declareVariables($,v)}

        ${b.mainStart()}
          ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          var input_indices: ${$.type.indices};
          let output_indices = ${v.offsetToIndices("global_idx")};

          ${k.join(`
`)}
          ${T[0]}       // init ops for reduce max/min
          ${T[1]}
          ${S}
          ${T[3]}
          ${T.length===4?v.setByOffset("global_idx","value"):T.slice(4).join(`
`)}
        }`},getRunData:()=>({outputs:[{dims:l,dataType:n}],dispatchGroup:{x:Math.ceil(w/64)},programUniforms:[{type:12,data:w},...Y(h,l)]})}},xu=(e,t)=>{let r=[];return e[1].dims[0]>0&&e[1].getBigInt64Array().forEach(i=>r.push(Number(i))),Ce({axes:r,keepDims:t.keepDims,noopWithEmptyAxes:t.noopWithEmptyAxes})},Xt=(e,t,r,i)=>{let a=e.inputs,n=a.length===1?r:xu(a,r);e.compute(ja(t,{hint:n.cacheKey,inputDependencies:["rank"]},[a[0]],n.noopWithEmptyAxes&&n.axes.length===0?_f:i,n.axes,a[0].dataType,n.keepDims,n.noopWithEmptyAxes),{inputs:[0]})},wf=(e,t)=>{Kt(e.inputs),Xt(e,"ReduceLogSum",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += ${r.getByIndices("input_indices")};`,"value = log(value);"])},bf=(e,t)=>{Kt(e.inputs),Xt(e,"ReduceL1",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += abs(${r.getByIndices("input_indices")});`,""])},vf=(e,t)=>{Kt(e.inputs),Xt(e,"ReduceL2",t,(r,i)=>[`var t = ${i.type.value}(0); var value = ${i.type.value}(0);`,"",`t = ${r.getByIndices("input_indices")}; value += (t * t);`,"value = sqrt(value);"])},$f=(e,t)=>{Kt(e.inputs),Xt(e,"ReduceLogSumExp",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += exp(${r.getByIndices("input_indices")});`,"value = log(value);"])},xf=(e,t)=>{Kt(e.inputs),Xt(e,"ReduceMax",t,(r,i,a)=>{let n=[];for(let s=0;s<r.rank;s++)(a.indexOf(s)>=0||a.length===0)&&n.push(r.indicesSet("input_indices",s,0));return[`${n.join(`
`)}`,`var value = ${r.getByIndices("input_indices")};`,`value = max(value, ${r.getByIndices("input_indices")});`,""]})},kf=(e,t)=>{Kt(e.inputs),Xt(e,"ReduceMean",t,(r,i,a)=>{let n=1;for(let s=0;s<r.rank;s++)(a.indexOf(s)>=0||a.length===0)&&(n*=e.inputs[0].dims[s]);return["var sum = f32(0);","",`sum += f32(${r.getByIndices("input_indices")});`,`let value = ${i.type.value}(sum / ${n});`]})},Sf=(e,t)=>{Kt(e.inputs),Xt(e,"ReduceMin",t,(r,i,a)=>{let n=[];for(let s=0;s<r.rank;s++)(a.indexOf(s)>=0||a.length===0)&&n.push(`input_indices[${s}] = 0;`);return[`${n.join(`
`)}`,`var value = ${r.getByIndices("input_indices")};`,`value = min(value, ${r.getByIndices("input_indices")});`,""]})},Tf=(e,t)=>{Kt(e.inputs),Xt(e,"ReduceProd",t,(r,i)=>[`var value = ${i.type.storage}(1);`,"",`value *= ${r.getByIndices("input_indices")};`,""])},Ef=(e,t)=>{Kt(e.inputs),Xt(e,"ReduceSum",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += ${r.getByIndices("input_indices")};`,""])},If=(e,t)=>{Kt(e.inputs),Xt(e,"ReduceSumSquare",t,(r,i)=>[`var t = ${i.type.value}(0); var value = ${i.type.value}(0);`,"",`t = ${r.getByIndices("input_indices")}; value += t * t;`,""])},Yt=(e,t,r)=>{if(t.length===0)return r;let i=1,a=1;for(let n=0;n<t.length;n++)t.indexOf(n)===-1?i*=e[n]:a*=e[n];return a<32&&i>1024},i3=(e,t)=>{Yt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?kf(e,t):Hg(e,t)},n3=(e,t)=>{Yt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?bf(e,t):Kg(e,t)},a3=(e,t)=>{Yt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?vf(e,t):Xg(e,t)},s3=(e,t)=>{Yt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?$f(e,t):Yg(e,t)},o3=(e,t)=>{Yt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?xf(e,t):Qg(e,t)},u3=(e,t)=>{Yt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Sf(e,t):Zg(e,t)},l3=(e,t)=>{Yt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Tf(e,t):Jg(e,t)},d3=(e,t)=>{Yt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Ef(e,t):e3(e,t)},h3=(e,t)=>{Yt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?If(e,t):t3(e,t)},c3=(e,t)=>{Yt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?wf(e,t):r3(e,t)}}),xo,p3,f3,ku,h$=F(()=>{se(),qe(),td(),xo=e=>{if(!e||e.length===0||e.length>2)throw new Error("ArgMinMaxOp op requires 1 or 2 inputs.");if(e[0].dataType!==1)throw new Error("Invalid input type.")},p3=(e,t)=>{xo(e.inputs);let r=(i,a,n)=>{let s=[];for(let u=0;u<i.rank;u++)(n.indexOf(u)>=0||n.length===0)&&s.push(`input_indices[${u}] = 0;`);return[`${s.join(`
`)}`,`var value = ${i.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${i.getByIndices("input_indices")} ${t.selectLastIndex>0?"<=":"<"} value) {
         value = ${i.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",a.setByOffset("global_idx","best_index")]};e.compute(ja("ArgMin",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],r,[t.axis],7,t.keepDims),{inputs:[0]})},f3=(e,t)=>{xo(e.inputs);let r=(i,a,n)=>{let s=[];for(let u=0;u<i.rank;u++)(n.indexOf(u)>=0||n.length===0)&&s.push(`input_indices[${u}] = 0;`);return[`${s.join(`
`)}`,`var value = ${i.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${i.getByIndices("input_indices")} ${t.selectLastIndex>0?">=":">"} value) {
         value = ${i.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",a.setByOffset("global_idx","best_index")]};e.compute(ja("argMax",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],r,[t.axis],7,t.keepDims),{inputs:[0]})},ku=e=>Ce(e)}),Cf,ca,Af,zf,Of,Pn,Rf,m3,rd=F(()=>{se(),fe(),Jl(),me(),Cf=(e,t)=>{let r=e[0],i=e[1],a=e[2],n=e[3],s=e[4],u=e[5];if(s&&u)throw new Error("Attention cannot have both past and attention_bias");if(r.dims.length!==3)throw new Error('Input "input" must have 3 dimensions');let l=r.dims[0],h=r.dims[1],p=r.dims[2];if(a.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimensions');if(i.dims.length!==2)throw new Error('Input "weights" is expected to have 2 dimensions');if(i.dims[0]!==p)throw new Error("Input 1 dimension 0 should have same length as dimension 2 of input 0");if(a.dims[0]!==i.dims[1])throw new Error('Input "bias" dimension 0 should have same length as dimension 1 of input "weights"');let m=a.dims[0]/3,g=m,_=g;if(t.qkvHiddenSizes.length>0){if(t.qkvHiddenSizes.length!==3)throw new Error("qkv_hidden_sizes attribute should have 3 elements");for(let T of t.qkvHiddenSizes)if(T%t.numHeads!==0)throw new Error("qkv_hidden_sizes should be divisible by num_heads");m=t.qkvHiddenSizes[0],g=t.qkvHiddenSizes[1],_=t.qkvHiddenSizes[2]}let w=h;if(m!==g)throw new Error("qkv_hidden_sizes first element should be same as the second");if(a.dims[0]!==m+g+_)throw new Error('Input "bias" dimension 0 should have same length as sum of Q/K/V hidden sizes');let b=0;if(s){if(g!==_)throw new Error('Input "past" expect k_hidden_size == v_hidden_size');if(s.dims.length!==5)throw new Error('Input "past" must have 5 dimensions');if(s.dims[0]!==2)throw new Error('Input "past" first dimension must be 2');if(s.dims[1]!==l)throw new Error('Input "past" second dimension must be batch_size');if(s.dims[2]!==t.numHeads)throw new Error('Input "past" third dimension must be num_heads');if(s.dims[4]!==g/t.numHeads)throw new Error('Input "past" fifth dimension must be k_hidden_size / num_heads');t.pastPresentShareBuffer||(b=s.dims[3])}let k=w+b,$=-1,v=0;if(n)throw new Error("Mask not supported");if(s)throw new Error("past is not supported");if(u){if(u.dims.length!==4)throw new Error('Input "attention_bias" must have 4 dimensions');if(u.dims[0]!==l||u.dims[1]!==t.numHeads||u.dims[2]!==h||u.dims[3]!==k)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:l,sequenceLength:h,pastSequenceLength:b,kvSequenceLength:w,totalSequenceLength:k,maxSequenceLength:$,inputHiddenSize:p,hiddenSize:m,vHiddenSize:_,headSize:Math.floor(m/t.numHeads),vHeadSize:Math.floor(_/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:v,scale:t.scale,broadcastResPosBias:!1,passPastInKv:!1,qkvFormat:1}},ca=(e,t,r)=>t&&e?`
      let total_sequence_length_input = u32(${t.getByOffset("0")});
      let present_sequence_length = max(total_sequence_length_input, uniforms.past_sequence_length);
      let is_subsequent_prompt: bool = sequence_length > 1 && sequence_length != total_sequence_length_input;
      let is_first_prompt: bool = is_subsequent_prompt == false && sequence_length == total_sequence_length_input;
      total_sequence_length = u32(${e==null?void 0:e.getByOffset("batchIdx")}) + 1;
      var past_sequence_length: u32 = 0;
      if (is_first_prompt == false) {
        past_sequence_length = total_sequence_length - sequence_length;
      }
       `:`
    ${r?"let past_sequence_length = uniforms.past_sequence_length":""};
    let present_sequence_length = total_sequence_length;
    `,Af=(e,t,r,i,a,n,s,u)=>{let l=We(s?1:n),h=64,p=n/l;p<h&&(h=32);let m=Math.ceil(n/l/h),g=[{type:12,data:t},{type:12,data:r},{type:12,data:i},{type:12,data:a},{type:12,data:p},{type:12,data:m}],_=nt(e.dataType,l),w=lt(1,l),b=["type"];s&&b.push("type"),u&&b.push("type");let k=$=>{let v=K("x",e.dataType,e.dims,l),T=[v],S=s?B("seq_lens",s.dataType,s.dims):void 0;S&&T.push(S);let E=u?B("total_sequence_length_input",u.dataType,u.dims):void 0;E&&T.push(E);let C=lt(e.dataType),A=[{name:"batch_size",type:"u32"},{name:"num_heads",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"sequence_length",type:"u32"},{name:"total_sequence_length",type:"u32"},{name:"elements_per_thread",type:"u32"}];return`
  var<workgroup> thread_max: array<f32, ${h}>;
  var<workgroup> thread_sum: array<f32, ${h}>;
  ${$.registerUniforms(A).declareVariables(...T)}
  ${$.mainStart([h,1,1])}
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let sequence_length = uniforms.sequence_length;
    var total_sequence_length = uniforms.total_sequence_length;
    ${ca(S,E,!1)}
    let local_offset = local_idx * uniforms.elements_per_thread;
    let offset = (global_idx / ${h}) * uniforms.total_sequence_length + local_offset;
    let seq_causal_length = ${s?"u32(past_sequence_length + workgroup_id.y + 1)":"total_sequence_length"};
    var thread_max_vector = ${w}(-3.402823e+38f);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      thread_max_vector = max(${w}(x[offset + i]), thread_max_vector);
    }
    thread_max[local_idx] = ${(()=>{switch(l){case 1:return"thread_max_vector";case 2:return"max(thread_max_vector.x, thread_max_vector.y)";case 4:return"max(max(thread_max_vector.x, thread_max_vector.y), max(thread_max_vector.z, thread_max_vector.w))";default:throw new Error(`Unsupported components: ${l}`)}})()};
    workgroupBarrier();

    var max_value =  f32(-3.402823e+38f);
    for (var i = 0u; i < ${h}; i++) {
      max_value = max(thread_max[i], max_value);
    }

    var sum_vector = ${w}(0);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      sum_vector += exp(${w}(x[offset + i]) - max_value);
    }
    thread_sum[local_idx] = ${(()=>{switch(l){case 1:return"sum_vector";case 2:return"sum_vector.x + sum_vector.y";case 4:return"sum_vector.x + sum_vector.y + sum_vector.z + sum_vector.w";default:throw new Error(`Unsupported components: ${l}`)}})()};
    workgroupBarrier();

    var sum: f32 = 0;
    for (var i = 0u; i < ${h}; i++) {
      sum += thread_sum[i];
    }

    if (sum == 0) {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        x[offset + i] = ${v.type.value}(${C}(1.0) / ${C}(seq_causal_length));
      }
    } else {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        var f32input = ${w}(x[offset + i]);
        x[offset + i] = ${v.type.value}(exp(f32input - max_value) / sum);
      }
    }
      ${s?`
        for (var total_seq_id: u32 = seq_causal_length; total_seq_id + local_offset < uniforms.total_sequence_length; total_seq_id++) {
          x[offset + total_seq_id] = ${v.type.value}(${C}(0));
        }`:""};
  }`};return{name:"AttentionProbsSoftmax",shaderCache:{hint:`${h};${_};${l}`,inputDependencies:b},getShaderSource:k,getRunData:()=>({outputs:[],dispatchGroup:{x:Math.ceil(n/h),y:a,z:t*r},programUniforms:g})}},zf=(e,t,r,i,a,n,s,u,l)=>{let h=s+n.kvSequenceLength,p=[n.batchSize,n.numHeads,n.sequenceLength,h],m=e>1&&i,g=n.kvNumHeads?n.kvNumHeads:n.numHeads,_=m?[n.batchSize,g,h,n.headSize]:void 0,w=n.nReps?n.nReps:1,b=n.scale===0?1/Math.sqrt(n.headSize):n.scale,k=We(n.headSize),$=n.headSize/k,v=12,T={x:Math.ceil(h/v),y:Math.ceil(n.sequenceLength/v),z:n.batchSize*n.numHeads},S=[{type:12,data:n.sequenceLength},{type:12,data:$},{type:12,data:h},{type:12,data:n.numHeads},{type:12,data:n.headSize},{type:1,data:b},{type:12,data:s},{type:12,data:n.kvSequenceLength},{type:12,data:w}],E=m&&i&&O.size(i.dims)>0,C=["type","type"];E&&C.push("type"),a&&C.push("type"),u&&C.push("type"),l&&C.push("type");let A=[{dims:p,dataType:t.dataType,gpuDataType:0}];m&&A.push({dims:_,dataType:t.dataType,gpuDataType:0});let M=D=>{let G=B("q",t.dataType,t.dims,k),oe=B("key",r.dataType,r.dims,k),he=[G,oe];if(E){let q=B("past_key",i.dataType,i.dims,k);he.push(q)}a&&he.push(B("attention_bias",a.dataType,a.dims));let Z=u?B("seq_lens",u.dataType,u.dims):void 0;Z&&he.push(Z);let ue=l?B("total_sequence_length_input",l.dataType,l.dims):void 0;ue&&he.push(ue);let ne=K("output",t.dataType,p),V=[ne];m&&V.push(K("present_key",t.dataType,_,k));let ye=lt(1,k),Te=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"alpha",type:"f32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${v}u;

  var<workgroup> tileQ: array<${G.type.storage}, ${v*v}>;
  var<workgroup> tileK: array<${G.type.storage}, ${v*v}>;
  ${D.registerUniforms(Te).declareVariables(...he,...V)}
  ${D.mainStart([v,v,1])}
    // x holds the N and y holds the M
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let kvHeadIdx = ${w===1?"headIdx":"headIdx / uniforms.n_reps"};
    let kv_num_heads = ${w===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let m = workgroup_id.y * TILE_SIZE;
    let n = workgroup_id.x * TILE_SIZE;
    let sequence_length = uniforms.M;
    var total_sequence_length = uniforms.N;
    ${ca(Z,ue,!0)}
    let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx;
    let qOffset = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
    ${E&&m?"let pastKeyOffset = absKvHeadIdx * uniforms.past_sequence_length * uniforms.K;":""};
    let kOffset = absKvHeadIdx * uniforms.kv_sequence_length * uniforms.K;
    ${m?"let presentKeyOffset = absKvHeadIdx * uniforms.N * uniforms.K;":""}
    var value = ${ye}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (global_id.y < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = q[qOffset + local_id.y * uniforms.K + w + local_id.x];
      }
      if (n + local_id.y < uniforms.N && w + local_id.x < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
      ${E&&m?`
              if (n + local_id.y < past_sequence_length) {
                tileK[idx] = past_key[pastKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
              } else if (n + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
                tileK[idx] = key[kOffset + (n + local_id.y - past_sequence_length) * uniforms.K + w + local_id.x];
              }`:`
          if (n + local_id.y < uniforms.kv_sequence_length) {
            tileK[idx] = key[kOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
          }`}
      ${m?`if (n + local_id.y < present_sequence_length) {
        present_key[presentKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x] = tileK[idx];
      }`:""}
      }
      workgroupBarrier();

      for (var k: u32 = 0u; k < TILE_SIZE && w+k < uniforms.K; k++) {
          value += ${ye}(tileQ[TILE_SIZE * local_id.y + k] * tileK[TILE_SIZE * local_id.x + k]);
      }

      workgroupBarrier();
    }

    if (global_id.y < uniforms.M && global_id.x < total_sequence_length) {
      let headOffset = workgroup_id.z * uniforms.M * uniforms.N;
      let outputIdx = headOffset + global_id.y * uniforms.N + global_id.x;
      var sum: f32 = ${(()=>{switch(k){case 1:return"value";case 2:return"value.x + value.y";case 4:return"value.x + value.y + value.z + value.w";default:throw new Error(`Unsupported components: ${k}`)}})()};
        output[outputIdx] = ${ne.type.value} (sum * uniforms.alpha) + ${a?"attention_bias[outputIdx]":"0.0"};
    }
  }`};return{name:"AttentionProbs",shaderCache:{hint:`${k};${a!==void 0};${i!==void 0};${e}`,inputDependencies:C},getRunData:()=>({outputs:A,dispatchGroup:T,programUniforms:S}),getShaderSource:M}},Of=(e,t,r,i,a,n,s=void 0,u=void 0)=>{let l=n+a.kvSequenceLength,h=a.nReps?a.nReps:1,p=a.vHiddenSize*h,m=e>1&&i,g=a.kvNumHeads?a.kvNumHeads:a.numHeads,_=m?[a.batchSize,g,l,a.headSize]:void 0,w=[a.batchSize,a.sequenceLength,p],b=12,k={x:Math.ceil(a.vHeadSize/b),y:Math.ceil(a.sequenceLength/b),z:a.batchSize*a.numHeads},$=[{type:12,data:a.sequenceLength},{type:12,data:l},{type:12,data:a.vHeadSize},{type:12,data:a.numHeads},{type:12,data:a.headSize},{type:12,data:p},{type:12,data:n},{type:12,data:a.kvSequenceLength},{type:12,data:h}],v=m&&i&&O.size(i.dims)>0,T=["type","type"];v&&T.push("type"),s&&T.push("type"),u&&T.push("type");let S=[{dims:w,dataType:t.dataType,gpuDataType:0}];m&&S.push({dims:_,dataType:t.dataType,gpuDataType:0});let E=C=>{let A=B("probs",t.dataType,t.dims),M=B("v",r.dataType,r.dims),D=[A,M];v&&D.push(B("past_value",i.dataType,i.dims));let G=s?B("seq_lens",s.dataType,s.dims):void 0;s&&D.push(G);let oe=u?B("total_sequence_length_input",u.dataType,u.dims):void 0;u&&D.push(oe);let he=[K("output",t.dataType,w)];m&&he.push(K("present_value",t.dataType,_));let Z=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"v_hidden_size",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${b}u;
  var<workgroup> tileQ: array<${A.type.value}, ${b*b}>;
  var<workgroup> tileV: array<${A.type.value}, ${b*b}>;
  ${C.registerUniforms(Z).declareVariables(...D,...he)}
  ${C.mainStart([b,b,1])}
   let headIdx = workgroup_id.z % uniforms.num_heads;
   let batchIdx = workgroup_id.z / uniforms.num_heads;
   let kvHeadIdx = ${h===1?"headIdx":"headIdx / uniforms.n_reps"};
   let kv_num_heads = ${h===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
   let m = global_id.y;
   let n = global_id.x;
   let sequence_length = uniforms.M;
   var total_sequence_length = uniforms.K;
   ${ca(G,oe,!0)}
   let offsetA = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
   let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx; // kvHeadIdx is relative to the batch
   ${v&&m?"let pastValueOffset = absKvHeadIdx * uniforms.N * uniforms.past_sequence_length + n;":""};
   let vOffset = absKvHeadIdx * uniforms.N * uniforms.kv_sequence_length + n;
   ${m?"let presentValueOffset = absKvHeadIdx * uniforms.N * uniforms.K + n;":""}
   var value = ${A.type.storage}(0);
   for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = probs[offsetA + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
        ${v&&m?`
        if (w + local_id.y < past_sequence_length) {
          tileV[idx] = past_value[pastValueOffset + (w + local_id.y) * uniforms.N];
        } else if (w + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
          tileV[idx] = v[vOffset + (w + local_id.y - past_sequence_length) * uniforms.N];
        }
      `:`
            if (w + local_id.y < uniforms.kv_sequence_length) {
              tileV[idx] = v[vOffset + (w + local_id.y) * uniforms.N];
            }`}
        ${m?`
            if (w + local_id.y < present_sequence_length) {
          present_value[presentValueOffset + (w + local_id.y) * uniforms.N] = tileV[idx];
        }`:""}
      }
     workgroupBarrier();
     for (var k: u32 = 0u; k < TILE_SIZE && w+k < total_sequence_length; k++) {
       value += tileQ[TILE_SIZE * local_id.y + k] * tileV[TILE_SIZE * k + local_id.x];
     }
     workgroupBarrier();
   }

   // we need to transpose output from BNSH_v to BSND_v
   if (m < uniforms.M && n < uniforms.N) {
     let outputIdx = batchIdx * uniforms.M * uniforms.v_hidden_size + m * uniforms.v_hidden_size
       + headIdx * uniforms.N + n;
     output[outputIdx] = value;
   }
  }`};return{name:"AttentionScore",shaderCache:{hint:`${i!==void 0};${e}`,inputDependencies:T},getRunData:()=>({outputs:S,dispatchGroup:k,programUniforms:$}),getShaderSource:E}},Pn=(e,t,r,i,a,n,s,u,l,h,p=void 0,m=void 0)=>{let g=Math.min(e.outputCount,1+(s?1:0)+(u?1:0)),_=g>1?h.pastSequenceLength:0,w=_+h.kvSequenceLength,b=l&&O.size(l.dims)>0?l:void 0,k=[t,r];g>1&&s&&O.size(s.dims)>0&&k.push(s),b&&k.push(b),p&&k.push(p),m&&k.push(m);let $=e.compute(zf(g,t,r,s,b,h,_,p,m),{inputs:k,outputs:g>1?[-1,1]:[-1]})[0];e.compute(Af($,h.batchSize,h.numHeads,_,h.sequenceLength,w,p,m),{inputs:p&&m?[$,p,m]:[$],outputs:[]});let v=[$,i];g>1&&u&&O.size(u.dims)>0&&v.push(u),p&&v.push(p),m&&v.push(m),e.compute(Of(g,$,i,u,h,_,p,m),{inputs:v,outputs:g>1?[0,2]:[0]})},Rf=(e,t)=>{let r=[t.batchSize,t.numHeads,t.sequenceLength,t.headSize],i=t.sequenceLength,a=t.inputHiddenSize,n=t.headSize,s=12,u={x:Math.ceil(t.headSize/s),y:Math.ceil(t.sequenceLength/s),z:t.batchSize*t.numHeads},l=[e.inputs[0],e.inputs[1],e.inputs[2]],h=[{type:12,data:i},{type:12,data:a},{type:12,data:n},{type:12,data:t.numHeads},{type:12,data:t.headSize},{type:12,data:t.hiddenSize},{type:12,data:t.hiddenSize+t.hiddenSize+t.vHiddenSize}],p=m=>{let g=K("output_q",l[0].dataType,r),_=K("output_k",l[0].dataType,r),w=K("output_v",l[0].dataType,r),b=B("input",l[0].dataType,l[0].dims),k=B("weight",l[1].dataType,l[1].dims),$=B("bias",l[2].dataType,l[2].dims),v=b.type.storage,T=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"hidden_size",type:"u32"},{name:"ldb",type:"u32"}];return`
  const TILE_SIZE = ${s}u;
  var<workgroup> tileInput: array<${v}, ${s*s}>;
  var<workgroup> tileWeightQ: array<${v}, ${s*s}>;
  var<workgroup> tileWeightK: array<${v}, ${s*s}>;
  var<workgroup> tileWeightV: array<${v}, ${s*s}>;
  ${m.registerUniforms(T).declareVariables(b,k,$,g,_,w)}
  ${m.mainStart([s,s,1])}
    let batchIndex = workgroup_id.z / uniforms.num_heads;
    let headNumber = workgroup_id.z % uniforms.num_heads;
    let m = global_id.y;
    let n = global_id.x;

    let inputOffset = batchIndex * (uniforms.M * uniforms.K) + m * uniforms.K;
    let biasOffsetQ = headNumber * uniforms.head_size;
    let biasOffsetK = uniforms.hidden_size + biasOffsetQ;
    let biasOffsetV = uniforms.hidden_size + biasOffsetK;

    var valueQ = ${v}(0);
    var valueK = ${v}(0);
    var valueV = ${v}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileInput[TILE_SIZE * local_id.y + local_id.x] = input[inputOffset + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        let offset = n + (w + local_id.y) * uniforms.ldb;
        tileWeightQ[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetQ + offset];
        tileWeightK[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetK + offset];
        tileWeightV[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetV + offset];
      }
      workgroupBarrier();
      for (var k: u32 = 0u; k<TILE_SIZE && w+k < uniforms.K; k++) {
        let inputTileOffset = TILE_SIZE * local_id.y + k;
        let weightTileOffset = TILE_SIZE * k + local_id.x;
        valueQ += tileInput[inputTileOffset] * tileWeightQ[weightTileOffset];
        valueK += tileInput[inputTileOffset] * tileWeightK[weightTileOffset];
        valueV += tileInput[inputTileOffset] * tileWeightV[weightTileOffset];
      }

      workgroupBarrier();
    }

    let headOffset = (m * uniforms.N + n) % uniforms.head_size;
    valueQ += bias[headOffset + biasOffsetQ];
    valueK += bias[headOffset + biasOffsetK];
    valueV += bias[headOffset + biasOffsetV];

    let offset = workgroup_id.z * uniforms.M * uniforms.N;
    if (m < uniforms.M && n < uniforms.N) {
      let outputIdx = offset + m * uniforms.N + n;
      output_q[outputIdx] = valueQ;
      output_k[outputIdx] = valueK;
      output_v[outputIdx] = valueV;
    }
  }`};return e.compute({name:"AttentionPrepare",shaderCache:{inputDependencies:["type","type","type"]},getRunData:()=>({outputs:[{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0}],dispatchGroup:u,programUniforms:h}),getShaderSource:p},{inputs:l,outputs:[-1,-1,-1]})},m3=(e,t)=>{let r=Cf(e.inputs,t),[i,a,n]=Rf(e,r);return Pn(e,i,a,n,e.inputs[4],void 0,void 0,void 0,e.inputs[5],r)}}),Mf,Bf,Nf,g3,c$=F(()=>{nr(),se(),fe(),qe(),me(),Mf=(e,t)=>{if(!e||e.length!==5)throw new Error("BatchNormalization requires 5 inputs");let r=(i,a,n)=>{let s=a.length;if(s!==i.length)throw new Error(`${n}: num dimensions != ${s}`);a.forEach((u,l)=>{if(u!==i[l])throw new Error(`${n}: dim[${l}] do not match`)})};if(e[0].dims.length>1){let i=t.format==="NHWC"?t.spatial?e[0].dims.slice(-1):e[0].dims.slice(-1).concat(e[0].dims.slice(1,e[0].dims.length-1)):e[0].dims.slice(1,t.spatial?2:void 0);r(e[1].dims,i,"Invalid input scale"),r(e[2].dims,i,"Invalid input B"),r(e[3].dims,i,"Invalid input mean"),r(e[4].dims,i,"Invalid input var")}else r(e[1].dims,[1],"Invalid input scale"),r(e[2].dims,[1],"Invalid input B"),r(e[3].dims,[1],"Invalid input mean"),r(e[4].dims,[1],"Invalid input var")},Bf=(e,t)=>{let{epsilon:r,spatial:i,format:a}=t,n=e[0].dims,s=i?We(n[n.length-1]):1,u=a==="NHWC"&&n.length>1?s:1,l=O.size(n)/s,h=i,p=h?n.length:n,m=B("x",e[0].dataType,e[0].dims,s),g=B("scale",e[1].dataType,e[1].dims,u),_=B("bias",e[2].dataType,e[2].dims,u),w=B("inputMean",e[3].dataType,e[3].dims,u),b=B("inputVar",e[4].dataType,e[4].dims,u),k=K("y",e[0].dataType,p,s),$=()=>{let T="";if(i)T=`let cOffset = ${n.length===1?"0u":a==="NHWC"?`outputIndices[${n.length-1}] / ${s}`:"outputIndices[1]"};`;else if(a==="NCHW")T=`
            ${k.indicesSet("outputIndices","0","0")}
            let cOffset = ${k.indicesToOffset("outputIndices")};`;else{T=`var cIndices = ${g.type.indices}(0);
                       cIndices[0] = outputIndices[${n.length-1}];`;for(let S=1;S<g.rank;S++)T+=`cIndices[${S}] = outputIndices[${S}];`;T+=`let cOffset = ${g.indicesToOffset("cIndices")};`}return T},v=T=>`
  const epsilon = ${r};
  ${T.registerUniform("outputSize","u32").declareVariables(m,g,_,w,b,k)}
  ${T.mainStart()}
  ${T.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
    var outputIndices = ${k.offsetToIndices(`global_idx * ${s}`)};
    ${$()}
    let scale = ${g.getByOffset("cOffset")};
    let bias = ${_.getByOffset("cOffset")};
    let inputMean = ${w.getByOffset("cOffset")};
    let inputVar = ${b.getByOffset("cOffset")};
    let x = ${m.getByOffset("global_idx")};
    let value = (x - inputMean) * inverseSqrt(inputVar + epsilon) * scale + bias;
    ${k.setByOffset("global_idx","value")}
  }`;return{name:"BatchNormalization",shaderCache:{hint:`${t.epsilon}_${t.format}_${i}_${s}`,inputDependencies:h?["rank","type","type","type","type"]:void 0},getShaderSource:v,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:h?[{type:12,data:l},...Y(n)]:[{type:12,data:l}]})}},Nf=e=>Ce(e),g3=(e,t)=>{let{inputs:r,outputCount:i}=e,a=Nf({...t,outputCount:i});if(ze.webgpu.validateInputContent&&Mf(r,a),t.trainingMode)throw new Error("BatchNormalization trainingMode is not supported yet.");e.compute(Bf(r,a))}}),Pf,Df,y3,p$=F(()=>{fe(),me(),Pf=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![320,640,1280].includes(e[0].dims[2]))throw new Error("number of channels should be 320, 640 or 1280");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},Df=e=>{let t=e[0].dims,r=e[0].dims[2],i=O.size(t)/4,a=e[0].dataType,n=B("input",a,t,4),s=B("bias",a,[r],4),u=B("residual",a,t,4),l=K("output",a,t,4);return{name:"BiasAdd",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(i/64)}}),getShaderSource:h=>`
  const channels = ${r}u / 4;
  ${h.declareVariables(n,s,u,l)}

  ${h.mainStart()}
    ${h.guardAgainstOutOfBoundsWorkgroupSizes(i)}
    let value = ${n.getByOffset("global_idx")}
      + ${s.getByOffset("global_idx % channels")} + ${u.getByOffset("global_idx")};
    ${l.setByOffset("global_idx","value")}
  }`}},y3=e=>{Pf(e.inputs),e.compute(Df(e.inputs))}}),Lf,$e,_3,w3,b3,v3,$3,x3,k3,S3,T3,Uf,E3,I3,C3,A3,En,z3,Ca,O3,R3,M3,B3,N3,P3,D3,L3,U3,F3,W3,V3,G3,j3,q3,H3,ko,K3,Su,Tu,X3,Y3,Q3,Ff,Wf,Z3,id=F(()=>{se(),fe(),qe(),me(),Lf=(e,t,r,i,a,n,s)=>{let u=Math.ceil(t/4),l="";typeof a=="string"?l=`${a}(a)`:l=a("a");let h=B("inputData",r,[u],4),p=K("outputData",i,[u],4),m=[{name:"vec_size",type:"u32"}];return s&&m.push(...s),`
      ${e.registerUniforms(m).declareVariables(h,p)}

  ${n??""}

  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}

    let a = ${h.getByOffset("global_idx")};
    ${p.setByOffset("global_idx",l)}
  }`},$e=(e,t,r,i,a,n=e.dataType,s,u)=>{let l=[{type:12,data:Math.ceil(O.size(e.dims)/4)}];return s&&l.push(...s),{name:t,shaderCache:{hint:a,inputDependencies:["type"]},getShaderSource:h=>Lf(h,O.size(e.dims),e.dataType,n,r,i,u),getRunData:h=>({outputs:[{dims:e.dims,dataType:n}],dispatchGroup:{x:Math.ceil(O.size(h[0].dims)/64/4)},programUniforms:l})}},_3=e=>{e.compute($e(e.inputs[0],"Abs","abs"))},w3=e=>{e.compute($e(e.inputs[0],"Acos","acos"))},b3=e=>{e.compute($e(e.inputs[0],"Acosh","acosh"))},v3=e=>{e.compute($e(e.inputs[0],"Asin","asin"))},$3=e=>{e.compute($e(e.inputs[0],"Asinh","asinh"))},x3=e=>{e.compute($e(e.inputs[0],"Atan","atan"))},k3=e=>{e.compute($e(e.inputs[0],"Atanh","atanh"))},S3=e=>Ce(e),T3=(e,t)=>{let r;switch(t.to){case 10:r="vec4<f16>";break;case 1:r="vec4<f32>";break;case 12:r="vec4<u32>";break;case 6:r="vec4<i32>";break;case 9:r="vec4<bool>";break;default:throw new RangeError(`not supported type (specified in attribute 'to' from 'Cast' operator): ${t.to}`)}e.compute($e(e.inputs[0],"Cast",r,void 0,t.cacheKey,t.to))},Uf=e=>{let t,r,i=e.length>=2&&e[1].data!==0,a=e.length>=3&&e[2].data!==0;switch(e[0].dataType){case 1:t=i?e[1].getFloat32Array()[0]:-34028234663852886e22,r=a?e[2].getFloat32Array()[0]:34028234663852886e22;break;case 10:t=i?e[1].getUint16Array()[0]:64511,r=a?e[2].getUint16Array()[0]:31743;break;default:throw new Error("Unsupport data type")}return Ce({min:t,max:r})},E3=(e,t)=>{let r=t||Uf(e.inputs),i=lt(e.inputs[0].dataType);e.compute($e(e.inputs[0],"Clip",a=>`clamp(${a}, vec4<${i}>(uniforms.min), vec4<${i}>(uniforms.max))`,void 0,r.cacheKey,void 0,[{type:e.inputs[0].dataType,data:r.min},{type:e.inputs[0].dataType,data:r.max}],[{name:"min",type:i},{name:"max",type:i}]),{inputs:[0]})},I3=e=>{e.compute($e(e.inputs[0],"Ceil","ceil"))},C3=e=>{e.compute($e(e.inputs[0],"Cos","cos"))},A3=e=>{e.compute($e(e.inputs[0],"Cosh","cosh"))},En=e=>Ce(e),z3=(e,t)=>{let r=lt(e.inputs[0].dataType);e.compute($e(e.inputs[0],"Elu",i=>`elu_vf32(${i})`,`
  const elu_alpha_ = ${r}(${t.alpha});

  fn elu_f32(a: ${r}) -> ${r} {
  return select((exp(a) - 1.0) * elu_alpha_, a, a >= 0.0);
  }

  fn elu_vf32(v: vec4<${r}>) -> vec4<${r}> {
  return vec4(elu_f32(v.x), elu_f32(v.y), elu_f32(v.z), elu_f32(v.w));
  }`,t.cacheKey))},Ca=(e="f32")=>`
const r0: ${e} = 0.3275911;
const r1: ${e} = 0.254829592;
const r2: ${e} = -0.284496736;
const r3: ${e} = 1.421413741;
const r4: ${e} = -1.453152027;
const r5: ${e} = 1.061405429;

fn erf_vf32(v: vec4<${e}>) -> vec4<${e}> {
  let absv = abs(v);
  let x = 1.0 / (1.0 + r0 * absv);
  return sign(v) * (1.0 - ((((r5 * x + r4) * x + r3) * x + r2) * x + r1) * x * exp(-absv * absv));
}`,O3=e=>{let t=lt(e.inputs[0].dataType);e.compute($e(e.inputs[0],"Erf",r=>`erf_vf32(${r})`,Ca(t)))},R3=e=>{e.compute($e(e.inputs[0],"Exp","exp"))},M3=e=>{e.compute($e(e.inputs[0],"Floor","floor"))},B3=e=>{let t=lt(e.inputs[0].dataType);e.compute($e(e.inputs[0],"Gelu",r=>`0.5 * ${r} * (1.0 + erf_vf32(${r} * 0.7071067811865475))`,Ca(t)))},N3=(e,t)=>{let r=lt(e.inputs[0].dataType);e.compute($e(e.inputs[0],"LeakyRelu",i=>`select(leaky_relu_alpha_ * ${i}, ${i}, ${i} >= vec4<${r}>(0.0))`,`const leaky_relu_alpha_ = ${r}(${t.alpha});`,t.cacheKey))},P3=e=>{e.compute($e(e.inputs[0],"Not",t=>`!${t}`))},D3=e=>{e.compute($e(e.inputs[0],"Neg",t=>`-${t}`))},L3=e=>{e.compute($e(e.inputs[0],"Reciprocal",t=>`1.0/${t}`))},U3=e=>{let t=lt(e.inputs[0].dataType);e.compute($e(e.inputs[0],"Relu",r=>`select(vec4<${t}>(0.0), ${r}, ${r} > vec4<${t}>(0.0))`))},F3=e=>{e.compute($e(e.inputs[0],"Sigmoid",t=>`(1.0 / (1.0 + exp(-${t})))`))},W3=e=>Ce(e),V3=(e,t)=>{let r=lt(e.inputs[0].dataType);e.compute($e(e.inputs[0],"HardSigmoid",i=>`max(vec4<${r}>(0.0), min(vec4<${r}>(1.0), ${t.alpha} * ${i} + vec4<${r}>(${t.beta})))`,void 0,t.cacheKey))},G3=e=>{e.compute($e(e.inputs[0],"Sin","sin"))},j3=e=>{e.compute($e(e.inputs[0],"Sinh","sinh"))},q3=e=>{e.compute($e(e.inputs[0],"Sqrt","sqrt"))},H3=e=>{e.compute($e(e.inputs[0],"Tan","tan"))},ko=e=>`sign(${e}) * (1 - exp(-2 * abs(${e}))) / (1 + exp(-2 * abs(${e})))`,K3=e=>{e.compute($e(e.inputs[0],"Tanh",ko))},Su=(e="f32")=>`
const fast_gelu_a: ${e} = 0.5;
const fast_gelu_b: ${e} = 0.7978845608028654;
const fast_gelu_c: ${e} = 0.035677408136300125;

fn tanh_v(v: vec4<${e}>) -> vec4<${e}> {
  return ${ko("v")};
}
`,Tu=e=>`(fast_gelu_a + fast_gelu_a * tanh_v(${e} * (fast_gelu_c * ${e} * ${e} + fast_gelu_b))) * ${e}`,X3=e=>{let t=lt(e.inputs[0].dataType);e.compute($e(e.inputs[0],"FastGelu",Tu,Su(t),void 0,e.inputs[0].dataType))},Y3=(e,t)=>{let r=lt(e.inputs[0].dataType);return e.compute($e(e.inputs[0],"ThresholdedRelu",i=>`select(vec4<${r}>(0.0), ${i}, ${i} > thresholded_relu_alpha_)`,`const thresholded_relu_alpha_ = vec4<${r}>(${t.alpha});`,t.cacheKey)),0},Q3=e=>{e.compute($e(e.inputs[0],"Log","log"))},Ff=(e,t)=>`
const alpha = vec4<${e}>(${t});
const one = ${e}(1.0);
const zero = ${e}(0.0);

fn quick_gelu_impl(x: vec4<${e}>) -> vec4<${e}> {
  let v = x *alpha;
  var x1 : vec4<${e}>;
  for (var i = 0; i < 4; i = i + 1) {
    if (v[i] >= zero) {
      x1[i] = one / (one + exp(-v[i]));
    } else {
      x1[i] = one - one / (one + exp(v[i]));
    }
  }
  return x * x1;
}
`,Wf=e=>`quick_gelu_impl(${e})`,Z3=(e,t)=>{let r=lt(e.inputs[0].dataType);e.compute($e(e.inputs[0],"QuickGelu",Wf,Ff(r,t.alpha),t.cacheKey,e.inputs[0].dataType))}}),Vf,Gf,J3,f$=F(()=>{fe(),me(),id(),Vf=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![2560,5120,10240].includes(e[0].dims[2]))throw new Error("hidden state should be 2560, 5120 or 10240");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},Gf=e=>{let t=e[0].dims.slice();t[2]=t[2]/2;let r=B("input",e[0].dataType,e[0].dims,4),i=B("bias",e[0].dataType,[e[0].dims[2]],4),a=K("output",e[0].dataType,t,4),n=O.size(t)/4,s=nt(e[0].dataType);return{name:"BiasSplitGelu",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(n/64)}}),getShaderSource:u=>`
  const M_SQRT2 = sqrt(2.0);
  const halfChannels = ${e[0].dims[2]/4/2}u;

  ${u.declareVariables(r,i,a)}

  ${Ca(s)}

  ${u.mainStart()}
    ${u.guardAgainstOutOfBoundsWorkgroupSizes(n)}
    let biasIdx = global_idx % halfChannels;
    let batchIndex = global_idx / halfChannels;
    let inputOffset = biasIdx + batchIndex * halfChannels * 2;
    let valueLeft = input[inputOffset] + bias[biasIdx];
    let valueRight = input[inputOffset + halfChannels] + bias[biasIdx + halfChannels];
    let geluRight = valueRight * 0.5 * (erf_vf32(valueRight / M_SQRT2) + 1);

    ${a.setByOffset("global_idx","valueLeft * geluRight")}
  }`}},J3=e=>{Vf(e.inputs),e.compute(Gf(e.inputs))}}),jf,qf,Qt,ey,ty,ry,iy,ny,ay,sy,oy,uy,ly,m$=F(()=>{se(),fe(),me(),jf=(e,t,r,i,a,n,s,u,l,h,p,m)=>{let g,_;typeof u=="string"?g=_=(v,T)=>`${u}((${v}),(${T}))`:typeof u=="function"?g=_=u:(g=u.scalar,_=u.vector);let w=K("outputData",p,i.length,4),b=B("aData",l,t.length,4),k=B("bData",h,r.length,4),$;if(a)if(n){let v=O.size(t)===1,T=O.size(r)===1,S=t.length>0&&t[t.length-1]%4===0,E=r.length>0&&r[r.length-1]%4===0;v||T?$=w.setByOffset("global_idx",_(v?`${b.type.value}(${b.getByOffset("0")}.x)`:b.getByOffset("global_idx"),T?`${k.type.value}(${k.getByOffset("0")}.x)`:k.getByOffset("global_idx"))):$=`
            let outputIndices = ${w.offsetToIndices("global_idx * 4u")};
            let offsetA = ${b.broadcastedIndicesToOffset("outputIndices",w)};
            let offsetB = ${k.broadcastedIndicesToOffset("outputIndices",w)};
            ${w.setByOffset("global_idx",_(s||S?b.getByOffset("offsetA / 4u"):`${b.type.value}(${b.getByOffset("offsetA / 4u")}[offsetA % 4u])`,s||E?k.getByOffset("offsetB / 4u"):`${k.type.value}(${k.getByOffset("offsetB / 4u")}[offsetB % 4u])`))}
          `}else $=w.setByOffset("global_idx",_(b.getByOffset("global_idx"),k.getByOffset("global_idx")));else{if(!n)throw new Error("no necessary to use scalar implementation for element-wise binary op implementation.");let v=(T,S,E="")=>{let C=`aData[indexA${S}][componentA${S}]`,A=`bData[indexB${S}][componentB${S}]`;return`
            let outputIndices${S} = ${w.offsetToIndices(`global_idx * 4u + ${S}u`)};
            let offsetA${S} = ${b.broadcastedIndicesToOffset(`outputIndices${S}`,w)};
            let offsetB${S} = ${k.broadcastedIndicesToOffset(`outputIndices${S}`,w)};
            let indexA${S} = offsetA${S} / 4u;
            let indexB${S} = offsetB${S} / 4u;
            let componentA${S} = offsetA${S} % 4u;
            let componentB${S} = offsetB${S} % 4u;
            ${T}[${S}] = ${E}(${g(C,A)});
          `};p===9?$=`
            var data = vec4<u32>(0);
            ${v("data",0,"u32")}
            ${v("data",1,"u32")}
            ${v("data",2,"u32")}
            ${v("data",3,"u32")}
            outputData[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:$=`
            ${v("outputData[global_idx]",0)}
            ${v("outputData[global_idx]",1)}
            ${v("outputData[global_idx]",2)}
            ${v("outputData[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables(b,k,w)}

        ${m??""}

        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${$}
      }`},qf=(e,t,r,i,a,n,s=r.dataType)=>{let u=r.dims.map(b=>Number(b)??1),l=i.dims.map(b=>Number(b)??1),h=!O.areEqual(u,l),p=u,m=O.size(u),g=!1,_=!1,w=[h];if(h){let b=Hi.calcShape(u,l,!1);if(!b)throw new Error("Can't perform binary op on the given tensors");p=b.slice(),m=O.size(p);let k=O.size(u)===1,$=O.size(l)===1,v=u.length>0&&u[u.length-1]%4===0,T=l.length>0&&l[l.length-1]%4===0;w.push(k),w.push($),w.push(v),w.push(T);let S=1;for(let E=1;E<p.length;E++){let C=u[u.length-E],A=l[l.length-E];if(C===A)S*=C;else break}S%4===0?(_=!0,g=!0):(k||$||v||T)&&(g=!0)}else g=!0;return w.push(g),{name:e,shaderCache:{hint:t+w.map(b=>b.toString()).join("_"),inputDependencies:["rank","rank"]},getShaderSource:b=>jf(b,u,l,p,g,h,_,a,r.dataType,i.dataType,s,n),getRunData:()=>({outputs:[{dims:p,dataType:s}],dispatchGroup:{x:Math.ceil(m/64/4)},programUniforms:[{type:12,data:Math.ceil(O.size(p)/4)},...Y(u,l,p)]})}},Qt=(e,t,r,i,a,n)=>{e.compute(qf(t,a??"",e.inputs[0],e.inputs[1],r,i,n))},ey=e=>{Qt(e,"Add",(t,r)=>`${t}+${r}`)},ty=e=>{Qt(e,"Div",(t,r)=>`${t}/${r}`)},ry=e=>{Qt(e,"Equal",{scalar:(t,r)=>`u32(${t}==${r})`,vector:(t,r)=>`vec4<u32>(${t}==${r})`},void 0,void 0,9)},iy=e=>{Qt(e,"Mul",(t,r)=>`${t}*${r}`)},ny=e=>{let t=B("input",e.inputs[0].dataType,e.inputs[0].dims).type.value;Qt(e,"Pow",{scalar:(r,i)=>`pow_custom(${r},${i})`,vector:(r,i)=>`pow_vector_custom(${r},${i})`},`
    fn pow_custom(a : ${t}, b : ${t}) -> ${t} {
      if (b == ${t}(0.0)) {
        return ${t}(1.0);
      } else if (a < ${t}(0.0) && f32(b) != floor(f32(b))) {
        return ${t}(pow(f32(a), f32(b))); // NaN
      }
      return select(sign(a), ${t}(1.0), round(f32(abs(b) % ${t}(2.0))) != 1.0) * ${t}(${t==="i32"?"round":""}(pow(f32(abs(a)), f32(b))));
    }
    fn pow_vector_custom(a : vec4<${t}>, b : vec4<${t}>) -> vec4<${t}> {
      // TODO: implement vectorized pow
      return vec4<${t}>(pow_custom(a.x, b.x), pow_custom(a.y, b.y), pow_custom(a.z, b.z), pow_custom(a.w, b.w));
    }
      `)},ay=e=>{Qt(e,"Sub",(t,r)=>`${t}-${r}`)},sy=e=>{Qt(e,"Greater",{scalar:(t,r)=>`u32(${t}>${r})`,vector:(t,r)=>`vec4<u32>(${t}>${r})`},void 0,void 0,9)},oy=e=>{Qt(e,"Less",{scalar:(t,r)=>`u32(${t}<${r})`,vector:(t,r)=>`vec4<u32>(${t}<${r})`},void 0,void 0,9)},uy=e=>{Qt(e,"GreaterOrEqual",{scalar:(t,r)=>`u32(${t}>=${r})`,vector:(t,r)=>`vec4<u32>(${t}>=${r})`},void 0,void 0,9)},ly=e=>{Qt(e,"LessOrEqual",{scalar:(t,r)=>`u32(${t}<=${r})`,vector:(t,r)=>`vec4<u32>(${t}<=${r})`},void 0,void 0,9)}}),Hf,Kf,Xf,Yf,dy,hy,g$=F(()=>{se(),fe(),qe(),me(),Hf=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");let r=0,i=e[r],a=i.dataType,n=i.dims.length;e.forEach((s,u)=>{if(u!==r){if(s.dataType!==a)throw new Error("input tensors should be one type");if(s.dims.length!==n)throw new Error("input tensors should have the same shape");s.dims.forEach((l,h)=>{if(h!==t&&l!==i.dims[h])throw new Error("non concat dimensions must match")})}})},Kf=(e,t)=>`
  fn calculateInputIndex(index: u32) -> u32 {
    let sizeInConcatAxis = array<u32, ${e}u>(${t});
    for (var i: u32 = 0u; i < ${e}; i += 1u ) {
      if (index < sizeInConcatAxis[i]) {
        return i;
      }
    }
    return ${e}u;
  }`,Xf=(e,t)=>{let r=e.length,i=[];for(let a=0;a<r;++a){let n=t.setByOffset("global_idx",e[a].getByIndices("indices"));r===1?i.push(n):a===0?i.push(`if (inputIndex == ${a}u) { ${n} }`):a===r-1?i.push(`else { ${n} }`):i.push(`else if (inputIndex == ${a}) { ${n} }`)}return i.join(`
`)},Yf=(e,t,r,i)=>{let a=O.size(r),n=new Array(e.length),s=new Array(e.length),u=0,l=[],h=[],p=[{type:12,data:a}];for(let b=0;b<e.length;++b)u+=e[b].dims[t],n[b]=u,h.push(e[b].dims.length),s[b]=B(`input${b}`,i,h[b]),l.push("rank"),p.push({type:12,data:n[b]});for(let b=0;b<e.length;++b)p.push(...Y(e[b].dims));p.push(...Y(r));let m=K("output",i,r.length),g=m.indicesGet("indices",t),_=Array.from(Array(n.length).keys()).map(b=>`uniforms.sizeInConcatAxis${b}`).join(","),w=b=>`

  ${(()=>{b.registerUniform("outputSize","u32");for(let k=0;k<e.length;k++)b.registerUniform(`sizeInConcatAxis${k}`,"u32");return b.declareVariables(...s,m)})()}

  ${Kf(n.length,_)}

  ${b.mainStart()}
    ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

    var indices = ${m.offsetToIndices("global_idx")};

    let inputIndex = calculateInputIndex(${g});
    if (inputIndex != 0u) {
      let sizeInConcatAxis = array<u32, ${n.length}u>(${_});
      ${g} -= sizeInConcatAxis[inputIndex - 1u];
    }

    ${Xf(s,m)}
  }`;return{name:"Concat",shaderCache:{hint:`${t}`,inputDependencies:l},getRunData:()=>({outputs:[{dims:r,dataType:i}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:p}),getShaderSource:w}},dy=(e,t)=>{let r=e.inputs,i=r[0].dims,a=O.normalizeAxis(t.axis,i.length);Hf(r,a);let n=i.slice();n[a]=r.reduce((u,l)=>u+(l.dims.length>a?l.dims[a]:0),0);let s=r.filter(u=>O.size(u.dims)>0);e.compute(Yf(s,a,n,r[0].dataType),{inputs:s})},hy=e=>Ce({axis:e.axis})}),yi,_i,wi,nd,$i=F(()=>{se(),fe(),yi=(e,t,r="f32")=>{switch(e.activation){case"Relu":return`value = max(value, ${t}(0.0));`;case"Sigmoid":return`value = (${t}(1.0) / (${t}(1.0) + exp(-value)));`;case"Clip":return`value = clamp(value, ${t}(${r}(uniforms.clip_min)), ${t}(${r}(uniforms.clip_max)));`;case"HardSigmoid":return`value = max(${t}(0.0), min(${t}(1.0), ${r}(uniforms.alpha) * value + ${r}(uniforms.beta)));`;case"LeakyRelu":return`value = select(${r}(uniforms.alpha) * value, value, value >= ${t}(0.0));`;case"Tanh":return`let e2x = exp(-2.0 * abs(value));
              value = sign(value) * (1.0 - e2x) / (1.0 + e2x);
        `;case"":return"";default:throw new Error(`Unsupported activation ${e.activation}`)}},_i=(e,t)=>{e.activation==="Clip"?t.push({type:1,data:e.clipMax},{type:1,data:e.clipMin}):e.activation==="HardSigmoid"?t.push({type:1,data:e.alpha},{type:1,data:e.beta}):e.activation==="LeakyRelu"&&t.push({type:1,data:e.alpha})},wi=(e,t)=>{e.activation==="Clip"?t.push({name:"clip_max",type:"f32"},{name:"clip_min",type:"f32"}):e.activation==="HardSigmoid"?t.push({name:"alpha",type:"f32"},{name:"beta",type:"f32"}):e.activation==="LeakyRelu"&&t.push({name:"alpha",type:"f32"})},nd=e=>{let t=(e==null?void 0:e.activation)||"";if(t==="HardSigmoid"){let[r,i]=(e==null?void 0:e.activation_params)||[.2,.5];return{activation:t,alpha:r,beta:i}}else if(t==="Clip"){let[r,i]=(e==null?void 0:e.activation_params)||[Fg,Wg];return{activation:t,clipMax:i,clipMin:r}}else if(t==="LeakyRelu"){let[r]=(e==null?void 0:e.activation_params)||[.01];return{activation:t,alpha:r}}return{activation:t}}}),ot,cy,ad=F(()=>{ot=(e,t)=>{switch(e){case 1:return t;case 2:return`vec2<${t}>`;case 3:return`vec3<${t}>`;case 4:return`vec4<${t}>`;default:throw new Error(`${e}-component is not supported.`)}},cy=e=>`
      ${e?"value = value + getBiasByOutputCoords(coords);":""}
      `}),py,y$=F(()=>{py=e=>`
fn getIndexFromCoords4D(coords : vec4<i32>, shape : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
      shape.y * shape.z * shape.w, shape.z * shape.w, shape.w, 1));
}
fn getOutputIndexFromCoords(coords : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
    i32(${e}.x), i32(${e}.y), i32(${e}.z), 1));
}
`}),On,sd,od=F(()=>{se(),fe(),me(),$i(),On=(e,t,r,i,a)=>{let n=i-r;return`
      ${Array.from({length:r}).map((s,u)=>`
      if (${X(t.shape,u,t.rank)} != 1) {
        ${t.indicesSet(e,u,X(a,u+n,i))}
      } else {
        ${t.indicesSet(e,u,0)}
      }`).join("")}
`},sd=(e,t,r,i,a=!1,n)=>{let s=e[0].dims,u=e[1].dims,l=s[s.length-2],h=u[u.length-1],p=s[s.length-1],m=We(h),g=We(p),_=We(l),w=O.size(r)/m/_,b=e.length>2,k=i?i.slice(0,-2):r.slice(0,-2),$=[O.size(k),l,h],v=[{type:12,data:w},{type:12,data:l},{type:12,data:h},{type:12,data:p}];_i(t,v),v.push(...Y(k,s,u)),b&&v.push(...Y(e[2].dims)),v.push(...Y($));let T=S=>{let E=ed("batch_dims",e[0].dataType,k.length),C=B("a",e[0].dataType,s.length,g),A=B("b",e[1].dataType,u.length,m),M=K("output",e[0].dataType,$.length,m),D=nt(M.type.tensor),G=yi(t,M.type.value,D),oe=[C,A],he="";if(b){let ne=a?m:1;oe.push(B("bias",e[2].dataType,e[2].dims.length,ne)),he=`${a?`value += bias[col / ${ne}];`:`value += ${M.type.value}(bias[row + i]);`}`}let Z=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"}];wi(t,Z);let ue=()=>{let ne=`var a_data: ${C.type.value};`;for(let V=0;V<g;V++)ne+=`
              let b_data${V} = b[(b_offset + (k + ${V}) * uniforms.N + col) / ${m}];`;for(let V=0;V<_;V++){ne+=`a_data = a[(a_offset + (row + ${V}) * uniforms.K + k) / ${g}];`;for(let ye=0;ye<g;ye++)ne+=`
            values[${V}] = fma(${A.type.value}(a_data${g===1?"":`[${ye}]`}), b_data${ye}, values[${V}]);
`}return ne};return`
  ${S.registerUniforms(Z).registerInternalVariables(E).declareVariables(...oe,M)}
  ${S.mainStart()}
    ${S.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let col = (global_idx % (uniforms.N / ${m})) * ${m};
    var index1 = global_idx / (uniforms.N / ${m});
    let stride1 = uniforms.M / ${_};
    let row = (index1 % stride1) * ${_};
    let batch = index1 / stride1;

    ${r.length===2?"":`let batch_indices = ${E.offsetToIndices("batch")};`}

    var a_indices: ${C.type.indices};
    ${On("a_indices",C,C.rank-2,E.rank,"batch_indices")}
    ${C.indicesSet("a_indices",C.rank-2,0)}
    ${C.indicesSet("a_indices",C.rank-1,0)}
    let a_offset = ${C.indicesToOffset("a_indices")};

    var b_indices: ${A.type.indices};
    ${On("b_indices",A,A.rank-2,E.rank,"batch_indices")}
    ${A.indicesSet("b_indices",A.rank-2,0)}
    ${A.indicesSet("b_indices",A.rank-1,0)}
    let b_offset = ${A.indicesToOffset("b_indices")};
    var values: array<${M.type.value}, ${_}>;
    for (var k: u32 = 0u; k < uniforms.K; k = k + ${g}) {
      ${ue()}
    }
    for (var i = 0u; i < ${_}u; i++) {
      var value = values[i];
      ${he}
      ${G}
      let cur_indices = ${M.type.indices}(batch, row + i, col);
      let offset = ${M.indicesToOffset("cur_indices")};
      ${M.setByOffset(`offset / ${m}`,"value")};
    }
  }
  `};return{name:"MatMulNaive",shaderCache:{hint:`${t.activation};${m};${g};${_};${a}`,inputDependencies:b?["rank","rank","rank"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:n?n(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(w/64)},programUniforms:v}),getShaderSource:T}}}),Qf,Zf,Eu,So,Jf,Iu,em,qa,ud=F(()=>{se(),fe(),me(),$i(),od(),ad(),Qf=(e,t)=>e?`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          kStart + inputRow,
          globalRowStart / innerElementSize + inputCol${t?", batchIndices":""});
        `:`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          globalRow + innerRow,
          kStart / innerElementSize + inputCol${t?", batchIndices":""});
        `,Zf=(e,t)=>e?`
        let ACached0 = mm_Asub[k * innerElementSize][localRow];
        let ACached1 = mm_Asub[k * innerElementSize + 1][localRow];
        let ACached2 = mm_Asub[k * innerElementSize + 2][localRow];
        ${t===3?"":"let ACached3 = mm_Asub[k * innerElementSize + 3][localRow];"}
        for (var i = 0; i < rowPerThread; i = i + 1) {
          acc[i] = BCached0 * ACached0[i] + acc[i];
          acc[i] = BCached1 * ACached1[i] + acc[i];
          acc[i] = BCached2 * ACached2[i] + acc[i];
          ${t===3?"":"acc[i] = BCached3 * ACached3[i] + acc[i];"}
        }`:`
        for (var i = 0; i < rowPerThread; i = i + 1) {
          let ACached = mm_Asub[tileRow + i][k];
          acc[i] = BCached0 * ACached.x + acc[i];
          acc[i] = BCached1 * ACached.y + acc[i];
          acc[i] = BCached2 * ACached.z + acc[i];
          ${t===3?"":"acc[i] = BCached3 * ACached.w + acc[i];"}
        }`,Eu=(e,t,r="f32",i,a=!1,n=32,s=!1,u=32)=>{let l=t[1]*e[1],h=t[0]*e[0],p=a?l:n,m=a?n:l,g=p/t[0],_=n/t[1];if(!((a&&g===4&&e[1]===4||!a&&(g===3||g===4))&&p%t[0]===0&&n%t[1]===0&&e[0]===4))throw new Error(`If transposeA ${a} is true, innerElementSize ${g} and workPerThread[1] ${e[1]} must be 4.
      Otherwise, innerElementSize ${g} must be 3 or 4.
  tileAWidth ${p} must be divisible by workgroupSize[0]${t[0]}. tileInner ${n} must be divisible by workgroupSize[1] ${t[1]}. colPerThread ${e[0]} must be 4.`);return`
var<workgroup> mm_Asub: array<array<vec${g}<${r}>, ${p/g}>, ${m}>;
var<workgroup> mm_Bsub: array<array<vec4<${r}>, ${h/e[0]}>, ${n}>;

const rowPerThread = ${e[1]};
const colPerThread = ${e[0]};
const innerElementSize = ${g};
const tileInner = ${n};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
  let localRow = i32(localId.y);
  let tileRow = localRow * rowPerThread;
  let tileCol = i32(localId.x);

  let globalRow =i32(globalId.y) * rowPerThread;
  let globalCol = i32(globalId.x);
  let batch = ${s?"0":"i32(globalId.z)"};
  ${i?`let batchIndices = ${i.offsetToIndices("u32(batch)")};`:""}
  let globalRowStart = i32(workgroupId.y) * ${l};

  let num_tiles = ${s?`${Math.ceil(u/n)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
  var kStart = ${s?`i32(globalId.z) * ${u}`:"0"};

  var acc: array<vec4<${r}>, rowPerThread>;

  // Loop over shared dimension.
  let tileRowB = localRow * ${_};
  for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let inputRow = tileRow + innerRow;
          let inputCol = tileCol;
          ${Qf(a,i)}
      }

      // Load one tile of B into local memory.
      for (var innerRow = 0; innerRow < ${_}; innerRow = innerRow + 1) {
          let inputRow = tileRowB + innerRow;
          let inputCol = tileCol;
          mm_Bsub[inputRow][inputCol] = mm_readB(batch, kStart + inputRow, globalCol${i?", batchIndices":""});
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      for (var k = 0; k < tileInner / innerElementSize; k = k + 1) {
          let BCached0 = mm_Bsub[k * innerElementSize][tileCol];
          let BCached1 = mm_Bsub[k * innerElementSize + 1][tileCol];
          let BCached2 = mm_Bsub[k * innerElementSize + 2][tileCol];
          ${g===3?"":"let BCached3 = mm_Bsub[k * innerElementSize + 3][tileCol];"}

          ${Zf(a,g)}
      }

      workgroupBarrier();
  }

  for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      mm_write(batch, globalRow + innerRow, globalCol, acc[innerRow]);
  }
}`},So=(e,t)=>e?`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              kStart + inputRow,
              globalRowStart + inputCol${t?", batchIndices":""});
            `:`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              globalRowStart + inputRow,
              kStart + inputCol${t?", batchIndices":""});
            `,Jf=e=>e?"let ACached = mm_Asub[k][tileRow + innerRow];":"let ACached = mm_Asub[tileRow + innerRow][k];",Iu=(e,t,r="f32",i,a=!1,n=32,s=!1,u=32,l=!1)=>{let h=e[1]*t[1],p=e[0]*t[0],m=a?h:n,g=a?n:h;if(!(g%t[1]===0&&m%t[0]===0&&n%t[1]===0))throw new Error(`tileAHight ${g} must be divisible by workgroupSize[1]${t[1]}, tileAWidth ${m} must be divisible by workgroupSize[0]${t[0]}, tileInner ${n} must be divisible by workgroupSize[1]${t[1]}`);let _=g/t[1],w=m/t[0],b=n/t[1],k=l?`
    let localRow = i32(localId.y);
    let localCol = i32(localId.x);
    let globalRowStart = i32(workgroupId.y) * ${h};
    let globalColStart = i32(workgroupId.x) * ${p};

    // Loop over shared dimension.
    for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var inputRow = localRow; inputRow < ${g}; inputRow = inputRow + ${t[1]}) {
        for (var inputCol = localCol; inputCol < ${m}; inputCol = inputCol + ${t[0]}) {
          ${So(a,i)}
        }
      }
      // Load one tile of B into local memory.
      for (var inputRow = localRow; inputRow < ${n}; inputRow = inputRow + ${t[1]}) {
            for (var inputCol = localCol; inputCol < ${p}; inputCol = inputCol + ${t[0]}) {
          mm_Bsub[inputRow][inputCol] = mm_readB(batch,
            kStart + inputRow,
            globalColStart + inputCol${i?", batchIndices":""});
        }
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      var BCached : array<${r}, colPerThread>;
      for (var k = 0; k < tileInner; k = k + 1) {
        for (var inner = 0; inner < colPerThread; inner = inner + 1) {
          BCached[inner] = mm_Bsub[k][localCol + inner * ${t[0]}];
        }
        for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let ACached = ${a?`mm_Asub[k][localRow + innerRow * ${t[1]}];`:`mm_Asub[localRow + innerRow * ${t[1]}][k];`}
          for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
            acc[innerRow][innerCol] = acc[innerRow][innerCol] +
                ACached * BCached[innerCol];
          }
        }
      }
      workgroupBarrier();
    }
    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      let gRow = globalRowStart + localRow + innerRow * ${t[1]};
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        let gCol = globalColStart + localCol + innerCol * ${t[0]};
        mm_write(batch, gRow, gCol, acc[innerRow][innerCol]);
      }
    }
    `:`
let tileRow = i32(localId.y) * rowPerThread;
let tileCol = i32(localId.x) * colPerThread;

let globalRow = i32(globalId.y) * rowPerThread;
let globalCol = i32(globalId.x) * colPerThread;
let globalRowStart = i32(workgroupId.y) * ${h};

let tileRowA = i32(localId.y) * ${_};
let tileColA = i32(localId.x) * ${w};
let tileRowB = i32(localId.y) * ${b};
// Loop over shared dimension.
for (var t = 0; t < num_tiles; t = t + 1) {
  // Load one tile of A into local memory.
  for (var innerRow = 0; innerRow < ${_}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < ${w}; innerCol = innerCol + 1) {
      let inputRow = tileRowA + innerRow;
      let inputCol = tileColA + innerCol;
      ${So(a,i)}
    }
  }

  // Load one tile of B into local memory.
  for (var innerRow = 0; innerRow < ${b}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
      let inputRow = tileRowB + innerRow;
      let inputCol = tileCol + innerCol;
      mm_Bsub[inputRow][inputCol] = mm_readB(batch,
        kStart + inputRow,
        globalCol + innerCol${i?", batchIndices":""});
    }
  }
  kStart = kStart + tileInner;
  workgroupBarrier();

  // Compute acc values for a single thread.
  var BCached : array<${r}, colPerThread>;
  for (var k = 0; k < tileInner; k = k + 1) {
    for (var inner = 0; inner < colPerThread; inner = inner + 1) {
      BCached[inner] = mm_Bsub[k][tileCol + inner];
    }

    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      ${Jf(a)}
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        acc[innerRow][innerCol] = acc[innerRow][innerCol] + ACached * BCached[innerCol];
      }
    }
  }

  workgroupBarrier();
}

for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
  for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
    mm_write(batch, globalRow + innerRow, globalCol + innerCol,
        acc[innerRow][innerCol]);
  }
}
`;return`
  var<workgroup> mm_Asub : array<array<${r}, ${m}>, ${g}>;
  var<workgroup> mm_Bsub : array<array<${r}, ${p}>, ${n}>;
  const rowPerThread = ${e[1]};
  const colPerThread = ${e[0]};
  const tileInner = ${n};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
    let batch = ${s?"0":"i32(globalId.z)"};
    ${i?`let batchIndices = ${i.offsetToIndices("u32(batch)")};`:""}
    let num_tiles = ${s?`${Math.ceil(u/n)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
    var kStart = ${s?`i32(globalId.z) * ${u}`:"0"};

    var acc : array<array<${r}, colPerThread>, rowPerThread>;
    ${k}
  }
`},em=(e,t,r,i,a=!1)=>{let[n,s,u,l]=i,h=nt(i[0].type.tensor);return`
    fn mm_readA(batch: i32, row: i32, colIn: i32, batchIndices: ${n.type.indices}) -> ${ot(e,h)} {
      var value = ${ot(e,h)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_a_outer && col < uniforms.dim_inner)
      {
        var aIndices: ${s.type.indices};
        ${On("aIndices",s,s.rank-2,n.rank,"batchIndices")}
        ${s.indicesSet("aIndices",s.rank-2,"u32(row)")}
        ${s.indicesSet("aIndices",s.rank-1,"u32(colIn)")}
        value = ${s.getByIndices("aIndices")};
      }
      return value;
    }

    fn mm_readB(batch: i32, row: i32, colIn: i32, batchIndices: ${n.type.indices}) -> ${ot(e,h)} {
      var value = ${ot(e,h)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_inner && col < uniforms.dim_b_outer)
      {
        var bIndices: ${u.type.indices};
        ${On("bIndices",u,u.rank-2,n.rank,"batchIndices")}
        ${u.indicesSet("bIndices",u.rank-2,"u32(row)")}
        ${u.indicesSet("bIndices",u.rank-1,"u32(colIn)")}
        value = ${u.getByIndices("bIndices")};
      }
      return value;
    }

    fn mm_write(batch: i32, row: i32, colIn: i32, valueIn: ${ot(e,h)}) {
      let col = colIn * ${e};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer) {
        var value = valueIn;
        let coords = vec3<i32>(batch, row, colIn);
        ${t?`value = value + ${a?"bias[colIn]":`${ot(e,h)}(bias[row])`};`:""}
        ${r}
        ${l.setByIndices("vec3<u32>(coords)","value")}
      }
    }
    `},qa=(e,t,r,i,a=!1,n)=>{let s=e[0].dims,u=e[1].dims,l=s.slice(0,-2),h=u.slice(0,-2),p=i?i.slice(0,-2):r.slice(0,-2),m=O.size(p),g=s[s.length-2],_=s[s.length-1],w=u[u.length-1],b=_%4===0&&w%4===0,k=g<=8?[4,1,1]:[4,4,1],$=[8,8,1],v=[Math.ceil(w/$[0]/k[0]),Math.ceil(g/$[1]/k[1]),Math.ceil(m/$[2]/k[2])],T=b?4:1,S=[...l,g,_/T],E=S.length,C=[...h,_,w/T],A=C.length,M=[m,g,w/T],D=[{type:6,data:g},{type:6,data:w},{type:6,data:_}];_i(t,D),D.push(...Y(p,S,C));let G=["rank","rank"],oe=e.length>2;oe&&(D.push(...Y(e[2].dims)),G.push("rank")),D.push(...Y(M));let he=Z=>{let ue=p.length,ne=ed("batchDims",e[0].dataType,ue,1),V=nt(e[0].dataType),ye=B("a",e[0].dataType,E,T),Te=B("b",e[1].dataType,A,T),q=K("result",e[0].dataType,M.length,T),Ee=[ye,Te];if(oe){let P=a?T:1;Ee.push(B("bias",e[2].dataType,e[2].dims.length,P))}let N=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"}];wi(t,N);let W=nt(q.type.tensor),ge=yi(t,q.type.value,W),Be=em(T,oe,ge,[ne,ye,Te,q],a);return`
  ${Z.registerUniforms(N).registerInternalVariables(ne).declareVariables(...Ee,q)}
  ${Be}
  ${b?Eu(k,$,V,ne):Iu(k,$,V,ne)}
                   `};return{name:"MatMul",shaderCache:{hint:`${k};${t.activation};${b};${a}`,inputDependencies:G},getRunData:()=>({outputs:[{dims:n?n(r):r,dataType:e[0].dataType}],dispatchGroup:{x:v[0],y:v[1],z:v[2]},programUniforms:D}),getShaderSource:he}}}),tm,fy,_$=F(()=>{se(),Ar(),me(),$i(),ad(),y$(),ud(),tm=(e,t,r,i,a=!1,n,s=4,u=4,l=4,h="f32")=>{let p=D=>{switch(D){case 1:return"resData = x[xIndex];";case 3:return`resData = vec3<${h}>(x[xIndex], x[xIndex + 1], x[xIndex + 2]);`;case 4:return"resData = x[xIndex / 4];";default:throw new Error(`innerElementSize ${D} is not supported.`)}},m=D=>{switch(D){case 1:return"return w[row * i32(uniforms.w_shape[3]) + colIn];";case 4:return"return w[row * i32(uniforms.w_shape[3]) / 4 + colIn];";default:throw new Error(`innerElementSize ${D} is not supported.`)}},g=e?`
    let coord = vec4<i32>(batch, xRow, xCol, xCh);
    `:`
    let coord = vec4<i32>(batch, xCh, xRow, xCol);
    `,_=e?`
    let coords = vec4<i32>(
      batch,
      row / outWidth,
      row % outWidth,
      col);
    `:`
    let coords = vec4<i32>(
      batch,
      row,
      col / outWidth,
      col % outWidth);
    `,w=e?"i32(uniforms.x_shape[1])":"i32(uniforms.x_shape[2])",b=e?"i32(uniforms.x_shape[2])":"i32(uniforms.x_shape[3])",k=e?"row":"col",$=e?"col":"row",v=`
    let inChannels = i32(uniforms.w_shape[2]);
    let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
    let outRow = ${k} / outWidth;
    let outCol = ${k} % outWidth;

    let WRow = ${$} / (i32(uniforms.w_shape[1]) * inChannels);
    let WCol = ${$} / inChannels % i32(uniforms.w_shape[1]);
    let xRow = outRow * uniforms.stride[0] + uniforms.dilation[0] * WRow - uniforms.pad[0];
    let xCol = outCol * uniforms.stride[1] + uniforms.dilation[1] * WCol - uniforms.pad[1];
    let xCh = ${$} % inChannels;
    var resData = ${ot(s,h)}(0.0);
    // The bounds checking is always needed since we use it to pad zero for
    // the 'same' padding type.
    if (xRow >= 0 && xRow < ${w} && xCol >= 0 && xCol < ${b}) {
      ${g}
      let xIndex = getIndexFromCoords4D(coord, vec4<i32>(uniforms.x_shape));
      ${p(s)}
    }
    return resData;`,T=e?t&&i?`
    let col = colIn * ${s};
    ${v}`:`
    let col = colIn * ${s};
    if (row < uniforms.dim_a_outer && col < uniforms.dim_inner) {
      ${v}
    }
    return ${ot(s,h)}(0.0);`:i&&r?`
    let col = colIn * ${s};
    ${v}`:`
    let col = colIn * ${s};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${v}
    }
    return ${ot(s,h)}(0.0);`,S=e?i&&r?m(u):`
    let col = colIn * ${u};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${m(u)}
    }
    return ${ot(u,h)}(0.0);`:`
    let col = colIn * ${u};
    if (row < uniforms.dim_inner && col < uniforms.dim_a_outer) {
      ${m(u)}
    }
    return ${ot(u,h)}(0.0);`,E=ot(l,h),C=ot(e?s:u,h),A=ot(e?u:s,h),M=yi(n,E,h);return`
    fn mm_readA(batch: i32, row : i32, colIn : i32) -> ${C} {
      ${e?T:S}
    }

    fn mm_readB(batch: i32, row : i32, colIn : i32) -> ${A} {
      ${e?S:T}
    }

    fn mm_write(batch: i32, row : i32, colIn : i32, valueIn : ${E}) {
      let col = colIn * ${l};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer)
      {
      var value = valueIn;
      let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
      ${_}
      ${cy(a)}
      ${M}
      setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], value);
      }
    }`},fy=(e,t,r,i,a,n,s,u,l)=>{let h=t.format==="NHWC",p=h?e[0].dims[3]:e[0].dims[1],m=r[0],g=h?r[2]:r[3],_=h?r[1]:r[2],w=h?r[3]:r[1],b=h&&(p%4===0||p%3===0)&&w%4===0,k=h?w:g*_,$=h?g*_:w,v=[8,8,1],T=i<=8?[4,1,1]:[4,4,1],S=[Math.ceil(k/v[0]/T[0]),Math.ceil($/v[1]/T[1]),Math.ceil(m/v[2]/T[2])];_e("verbose",()=>`[conv2d_mm_webgpu] dispatch = ${S}`);let E=b?h&&p%4!==0?3:4:1,C=v[1]*T[1],A=v[0]*T[0],M=Math.max(v[0]*E,v[1]),D=i%C===0,G=a%A===0,oe=n%M===0,he=b?[E,4,4]:[1,1,1],Z=[{type:6,data:i},{type:6,data:a},{type:6,data:n},{type:6,data:[t.pads[0],t.pads[1]]},{type:6,data:t.strides},{type:6,data:t.dilations}];_i(t,Z),Z.push(...Y(e[0].dims,e[1].dims));let ue=["rank","rank"];s&&(Z.push(...Y(e[2].dims)),ue.push("rank")),Z.push(...Y(r));let ne=V=>{let ye=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"},{name:"pad",type:"i32",length:2},{name:"stride",type:"i32",length:2},{name:"dilation",type:"i32",length:2}];wi(t,ye);let Te=b?4:1,q=nt(e[0].dataType),Ee=`
      fn setOutputAtIndex(flatIndex : i32, value : ${b?`vec4<${q}>`:q}) {
        result[flatIndex] = ${b?`vec4<${q}>`:q}(value);
      }
      fn setOutputAtCoords(d0 : i32, d1 : i32, d2 : i32, d3 : i32, value : ${b?`vec4<${q}>`:q}) {
        let flatIndex = getOutputIndexFromCoords(vec4<i32>(d0, d1, d2, d3));
        setOutputAtIndex(flatIndex ${b?"/ 4":""}, value);
      }`,N=B("x",e[0].dataType,e[0].dims.length,E===3?1:E),W=B("w",e[1].dataType,e[1].dims.length,Te),ge=[N,W],Be=K("result",e[0].dataType,r.length,Te);if(s){let P=B("bias",e[2].dataType,e[2].dims.length,Te);ge.push(P),Ee+=`
        fn getBiasByOutputCoords(coords : vec4<i32>) -> ${b?`vec4<${q}>`:q} {
          return bias[coords.${h?"w":"y"}${b?"/ 4":""}];
        }`}return`
        ${py("uniforms.result_strides")}
        //struct Uniforms { xShape : vec4<i32>, wShape : vec4<i32>, outShape : vec4<i32>,
        //  outShapeStrides: vec3<i32>, filterDims : vec2<i32>, pad : vec2<i32>, stride : vec2<i32>,
        //  dilation : vec2<i32>, dimAOuter : i32, dimBOuter : i32, dimInner : i32 };
        ${V.registerUniforms(ye).declareVariables(...ge,Be)}
        ${Ee}
        ${tm(h,D,G,oe,s,t,he[0],he[1],he[2],q)}
        ${b?Eu(T,v,q,void 0,!h,M):Iu(T,v,q,void 0,!h,M,!1,void 0,u)}`};return{name:"Conv2DMatMul",shaderCache:{hint:`${t.cacheKey};${E};${b};${D};${G};${oe};${C};${A};${M}`,inputDependencies:ue},getRunData:()=>({outputs:[{dims:l?l(r):r,dataType:e[0].dataType}],dispatchGroup:{x:S[0],y:S[1],z:S[2]},programUniforms:Z}),getShaderSource:ne}}}),rm,To,gn,im,Eo,nm,my,gy,w$=F(()=>{se(),Ar(),fe(),me(),$i(),ad(),rm=e=>{let t=1;for(let r=0;r<e.length;r++)t*=e[r];return t},To=e=>typeof e=="number"?[e,e,e]:e,gn=(e,t)=>t<=1?e:e+(e-1)*(t-1),im=(e,t,r,i=1)=>{let a=gn(t,i);return Math.floor((e[0]*(r-1)-r+a)/2)},Eo=(e,t,r,i,a)=>{a==null&&(a=im(e,t[0],i[0]));let n=[0,0,0,r];for(let s=0;s<3;s++)e[s]+2*a>=t[s]&&(n[s]=Math.trunc((e[s]-t[s]+2*a)/i[s]+1));return n},nm=(e,t,r,i,a,n,s,u,l,h)=>{let p,m,g,_;if(e==="VALID"&&(e=0),typeof e=="number"){p={top:e,bottom:e,left:e,right:e,front:e,back:e};let w=Eo([t,r,i,1],[u,l,h],1,[a,n,s],e);m=w[0],g=w[1],_=w[2]}else if(Array.isArray(e)){if(!e.every((b,k,$)=>b===$[0]))throw Error(`Unsupported padding parameter: ${e}`);p={top:e[0],bottom:e[1],left:e[2],right:e[3],front:e[4],back:e[5]};let w=Eo([t,r,i,1],[u,l,h],1,[a,n,s],e[0]);m=w[0],g=w[1],_=w[2]}else if(e==="SAME_UPPER"){m=Math.ceil(t/a),g=Math.ceil(r/n),_=Math.ceil(i/s);let w=(m-1)*a+u-t,b=(g-1)*n+l-r,k=(_-1)*s+h-i,$=Math.floor(w/2),v=w-$,T=Math.floor(b/2),S=b-T,E=Math.floor(k/2),C=k-E;p={top:T,bottom:S,left:E,right:C,front:$,back:v}}else throw Error(`Unknown padding parameter: ${e}`);return{padInfo:p,outDepth:m,outHeight:g,outWidth:_}},my=(e,t,r,i,a,n=!1,s="channelsLast")=>{let u,l,h,p,m;if(s==="channelsLast")[u,l,h,p,m]=e;else if(s==="channelsFirst")[u,m,l,h,p]=e;else throw new Error(`Unknown dataFormat ${s}`);let[g,,_,w,b]=t,[k,$,v]=To(r),[T,S,E]=To(i),C=gn(_,T),A=gn(w,S),M=gn(b,E),{padInfo:D,outDepth:G,outHeight:oe,outWidth:he}=nm(a,l,h,p,k,$,v,C,A,M),Z=n?g*m:g,ue=[0,0,0,0,0];return s==="channelsFirst"?ue=[u,Z,G,oe,he]:s==="channelsLast"&&(ue=[u,G,oe,he,Z]),{batchSize:u,dataFormat:s,inDepth:l,inHeight:h,inWidth:p,inChannels:m,outDepth:G,outHeight:oe,outWidth:he,outChannels:Z,padInfo:D,strideDepth:k,strideHeight:$,strideWidth:v,filterDepth:_,filterHeight:w,filterWidth:b,effectiveFilterDepth:C,effectiveFilterHeight:A,effectiveFilterWidth:M,dilationDepth:T,dilationHeight:S,dilationWidth:E,inShape:e,outShape:ue,filterShape:t}},gy=(e,t,r,i,a,n)=>{let s=n==="channelsLast";s?e[0].dims[3]:e[0].dims[1];let u=[64,1,1],l={x:r.map((k,$)=>$)},h=[Math.ceil(rm(l.x.map(k=>r[k]))/u[0]),1,1];_e("verbose",()=>`[conv3d_naive_webgpu] dispatch = ${h}`);let p=1,m=O.size(r),g=[{type:12,data:m},{type:12,data:i},{type:12,data:a},{type:12,data:t.strides},{type:12,data:t.dilations}];_i(t,g),g.push(...Y(e[0].dims,e[1].dims));let _=["rank","rank"],w=e.length===3;w&&(g.push(...Y(e[2].dims)),_.push("rank")),g.push(...Y(r));let b=k=>{let $=[{name:"output_size",type:"u32"},{name:"filter_dims",type:"u32",length:i.length},{name:"pads",type:"u32",length:a.length},{name:"strides",type:"u32",length:t.strides.length},{name:"dilations",type:"u32",length:t.dilations.length}];wi(t,$);let v=1,T=nt(e[0].dataType),S=B("x",e[0].dataType,e[0].dims.length,p),E=B("W",e[1].dataType,e[1].dims.length,v),C=[S,E],A=K("result",e[0].dataType,r.length,v),M="";if(w){let oe=B("bias",e[2].dataType,e[2].dims.length,v);C.push(oe),M+=`
        fn getBiasByOutputCoords(coords : array<u32, 5>) -> ${T} {
          return bias[${s?X("coords",4,5):X("coords",1,5)}];
        }`}let D=ot(p,T),G=yi(t,D,T);return`
            ${M}
            fn getX(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> f32 {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${S.getByIndices("aIndices")};
            }
            fn getW(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> f32 {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${E.getByIndices("aIndices")};
            }
          ${k.registerUniforms($).declareVariables(...C,A)}
          ${k.mainStart()}
          ${k.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
              let coords = ${A.offsetToIndices("global_idx")};
              let batch = ${X("coords",0,S.rank)};
              let d2 = ${s?X("coords",S.rank-1,S.rank):X("coords",1,S.rank)};
              let xFRCCorner = vec3<u32>(${s?X("coords",1,S.rank):X("coords",2,S.rank)},
              ${s?X("coords",2,S.rank):X("coords",3,S.rank)},
              ${s?X("coords",3,S.rank):X("coords",4,S.rank)}) * uniforms.strides - uniforms.pads;
              let xFCorner = xFRCCorner.x;
              let xRCorner = xFRCCorner.y;
              let xCCorner = xFRCCorner.z;
              let xShapeY = ${s?X("uniforms.x_shape",1,S.rank):X("uniforms.x_shape",2,S.rank)};
              let xShapeZ = ${s?X("uniforms.x_shape",2,S.rank):X("uniforms.x_shape",3,S.rank)};
              let xShapeW = ${s?X("uniforms.x_shape",3,S.rank):X("uniforms.x_shape",4,S.rank)};
              let xShapeU = ${s?X("uniforms.x_shape",4,S.rank):X("uniforms.x_shape",1,S.rank)};
              let inputDepthNearestVec4 = (xShapeU / 4) * 4;
              let inputDepthVec4Remainder = xShapeU % 4;

              var value = 0.0;
              for (var wF = 0u; wF < uniforms.filter_dims[0]; wF++) {
                let xF = xFCorner + wF * uniforms.dilations[0];
                if (xF < 0 || xF >= xShapeY) {
                  continue;
                }

                for (var wR = 0u; wR < uniforms.filter_dims[1]; wR++) {
                  let xR = xRCorner + wR * uniforms.dilations[1];
                  if (xR < 0 || xR >= xShapeZ) {
                    continue;
                  }

                  for (var wC = 0u; wC < uniforms.filter_dims[2]; wC++) {
                    let xC = xCCorner + wC * uniforms.dilations[2];
                    if (xC < 0 || xC >= xShapeW) {
                      continue;
                    }

                    for (var d1 = 0u; d1 < inputDepthNearestVec4; d1 += 4) {
                      ${s?`let xValues = vec4<f32>(
                               getX(batch, xF, xR, xC, d1),
                               getX(batch, xF, xR, xC, d1 + 1),
                               getX(batch, xF, xR, xC, d1 + 2),
                               getX(batch, xF, xR, xC, d1 + 3));
                            `:`let xValues = vec4<f32>(
                               getX(batch, d1, xF, xR, xC),
                               getX(batch, d1 + 1, xF, xR, xC),
                               getX(batch, d1 + 2, xF, xR, xC),
                               getX(batch, d1 + 3, xF, xR, xC));
                            `}
                            let wValues = vec4<f32>(
                              getW(d2, d1, wF, wR, wC),
                              getW(d2, d1 + 1, wF, wR, wC),
                              getW(d2, d1 + 2, wF, wR, wC),
                              getW(d2, d1 + 3, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                    if (inputDepthVec4Remainder == 1) {
                        ${s?`value += getX(batch, xF, xR, xC, inputDepthNearestVec4)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`:`value += getX(batch, inputDepthNearestVec4, xF, xR, xC)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`}
                    } else if (inputDepthVec4Remainder == 2) {
                      ${s?`let xValues = vec2<f32>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1));
                      `:`let xValues = vec2<f32>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC));
                    `}
                    let wValues = vec2<f32>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC));
                      value += dot(xValues, wValues);
                    } else if (inputDepthVec4Remainder == 3) {
                      ${s?`let xValues = vec3<f32>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 2));
                      `:`let xValues = vec3<f32>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 2, xF, xR, xC));
                    `}
                    let wValues = vec3<f32>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 2, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                  }
                }
              }
              ${w?"value = value + getBiasByOutputCoords(coords)":""};
              ${G}
              result[global_idx] = f32(value);
          }`};return{name:"Conv3DNaive",shaderCache:{hint:`${t.cacheKey};${s};${p};${w}`,inputDependencies:_},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:h[0],y:h[1],z:h[2]},programUniforms:g}),getShaderSource:b}}}),yy,_y,b$=F(()=>{se(),fe(),me(),$i(),yy=(e,t,r,i)=>{let a=e.length>2,n=a?"value += b[output_channel];":"",s=e[0].dims,u=e[1].dims,l=t.format==="NHWC",h=l?r[3]:r[1],p=h/t.group,m=l&&p>=4?We(h):1,g=O.size(r)/m,_=[{type:12,data:g},{type:12,data:t.dilations},{type:12,data:[t.strides[0],t.strides[1]]},{type:12,data:[t.pads[0],t.pads[1]]},{type:12,data:p}];_i(t,_),_.push(...Y(s,[u[0],u[1],u[2],u[3]/m]));let w=a?["rank","rank","rank"]:["rank","rank"];_.push(...Y([r[0],r[1],r[2],r[3]/m]));let b=k=>{let $=K("output",e[0].dataType,r.length,m),v=nt($.type.tensor),T=yi(t,$.type.value,v),S=B("x",e[0].dataType,s.length),E=B("w",e[1].dataType,u.length,m),C=[S,E];a&&C.push(B("b",e[2].dataType,e[2].dims,m));let A=[{name:"output_size",type:"u32"},{name:"dilations",type:"u32",length:t.dilations.length},{name:"strides",type:"u32",length:2},{name:"pads",type:"u32",length:2},{name:"output_channels_per_group",type:"u32"}];wi(t,A);let M=l?`
      for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[0]; wHeight++) {
        let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

        if (xHeight < 0u || xHeight >= uniforms.x_shape[1]) {
          continue;
        }

        for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[1]; wWidth++) {
          let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
          if (xWidth < 0u || xWidth >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[2]; wInChannel++) {
            let input_channel = in_channel_offset + wInChannel;
            let xVal = ${S.get("batch","xHeight","xWidth","input_channel")};
            let wVal = ${E.get("wHeight","wWidth","wInChannel","output_channel")};
            value += xVal * wVal;
          }
        }
      }
      `:`
      for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[1]; wInChannel++) {
        let input_channel = in_channel_offset + wInChannel;
        for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[2]; wHeight++) {
          let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

          if (xHeight < 0u || xHeight >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[3]; wWidth++) {
            let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
            if (xWidth < 0u || xWidth >= uniforms.x_shape[3]) {
              continue;
            }

            let xVal = ${S.get("batch","input_channel","xHeight","xWidth")};
            let wVal = ${E.get("output_channel","wInChannel","wHeight","wWidth")};
            value += xVal * wVal;
          }
        }
      }
      `;return`
  ${k.registerUniforms(A).declareVariables(...C,$)}

  ${k.mainStart()}
    ${k.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let outputIndices = ${$.offsetToIndices("global_idx")};
    let batch: u32 = outputIndices[0];
    let output_channel: u32 = outputIndices[${l?3:1}];
    let xRCCorner: vec2<u32> = vec2<u32>(outputIndices[${l?1:2}], outputIndices[${l?2:3}]) * uniforms.strides - uniforms.pads;
    let group_id: u32 = output_channel * ${m} / uniforms.output_channels_per_group;
    var in_channel_offset = group_id * uniforms.w_shape[${l?2:1}];

    var value: ${$.type.value} = ${$.type.value}(0);
    ${M}
    ${n}
    ${T}
    ${$.setByOffset("global_idx","value")}
  }`};return{name:"GroupedConv",shaderCache:{hint:`${t.cacheKey}_${m}`,inputDependencies:w},getRunData:()=>({outputs:[{dims:i?i(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(g/64)},programUniforms:_}),getShaderSource:b}},_y=(e,t,r,i)=>{let a=e.length>2,n=We(r[3]),s=We(r[2]),u=O.size(r)/n/s,l=[e[0].dims[0],e[0].dims[1],e[0].dims[2],e[0].dims[3]/n],h=[e[1].dims[0],e[1].dims[1],e[1].dims[2],e[1].dims[3]/n],p=[r[0],r[1],r[2],r[3]/n],m=[{type:12,data:u},{type:6,data:[t.strides[0],t.strides[1]]},{type:6,data:[t.pads[0],t.pads[1]]}];_i(t,m),m.push(...Y(l,h,p));let g=(s-1)*t.strides[1]+h[1],_=w=>{let b=K("output",e[0].dataType,p.length,n),k=nt(b.type.tensor),$=yi(t,b.type.value,k),v=B("x",e[0].dataType,l.length,n),T=B("w",e[1].dataType,h.length,n),S=[v,T];a&&S.push(B("b",e[2].dataType,e[2].dims,n));let E=a?"value += b[output_channel];":"",C=[{name:"output_size",type:"u32"},{name:"strides",type:"i32",length:2},{name:"pads",type:"i32",length:2}];return wi(t,C),`
  ${w.registerUniforms(C).declareVariables(...S,b)}
  ${w.mainStart()}
    ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let width0 = uniforms.output_shape[3];
    let output_channel = global_idx % width0;
    var index1 = global_idx / width0;
    let width1 = uniforms.output_shape[2] / ${s}u;
    let col = (index1 % width1) * ${s}u;
    index1 = index1 / width1;
    let row = index1 % uniforms.output_shape[1];
    let batch = index1 / uniforms.output_shape[1];

    let x_corner = vec2<i32>(i32(row), i32(col)) * uniforms.strides - uniforms.pads;

    var x_vals: array<${v.type.value}, ${g}>;
    var values: array<${b.type.value}, ${s}>;
    let input_channel = output_channel;
    // Use constant instead of uniform can give better performance for w's height/width.
    for (var w_height: u32 = 0u; w_height < ${h[0]}; w_height++) {
      let x_height = x_corner.x + i32(w_height);
      if (x_height >= 0 && u32(x_height) < uniforms.x_shape[1]) {
        for (var i = 0; i < ${g}; i++) {
          let x_width = x_corner.y + i;
          if (x_width >= 0 && u32(x_width) < uniforms.x_shape[2]) {
            x_vals[i] = ${v.get("batch","u32(x_height)","u32(x_width)","input_channel")};
          } else {
            x_vals[i] = ${v.type.value}(0);
          }
        }
        for (var w_width: u32 = 0u; w_width < ${h[1]}; w_width++) {
          let w_val = ${T.get("w_height","w_width","0","output_channel")};
          for (var i = 0u; i < ${s}u; i++) {
            values[i] = fma(x_vals[i * u32(uniforms.strides[1]) + w_width], w_val, values[i]);
          }
        }
      }
    }

    for (var i = 0u; i < ${s}u; i++) {
      var value = values[i];
      ${E}
      ${$}
      ${b.set("batch","row","col + i","output_channel","value")};
    }
  }`};return{name:"GroupedConv-Vectorize",shaderCache:{hint:`${t.cacheKey};${n};${s};${g};${h[0]};${h[1]}`,inputDependencies:a?["rank","rank","type"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:i?i(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:m}),getShaderSource:_}}}),am,pa,sm,fa,Cu,Io,om,um,Au,v$=F(()=>{fe(),_$(),w$(),ud(),b$(),$i(),od(),Zr(),am=(e,t,r,i,a,n)=>{let s=e[0],u=e.slice(n?1:2,n?3:4),l=u.length,h=t[0],p=t.slice(2).map((g,_)=>g+(g-1)*(r[_]-1)),m=u.map((g,_)=>g+i[_]+i[_+l]).map((g,_)=>Math.floor((g-p[_]+a[_])/a[_]));return m.splice(0,0,s),m.splice(n?3:1,0,h),m},pa=[2,3,1,0],sm=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length>5)throw new Error("greater than 5D is not supported");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let r=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],i=e[1].dims[1]*t.group;if(r!==i)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");if(e.length===3&&(e[2].dims.length!==1||e[1].dims[0]!==e[2].dims[0]))throw new Error("invalid bias");let a=e[0].dims.length-2;if(t.dilations.length!==a)throw new Error(`dilations should be ${a}D`);if(t.strides.length!==a)throw new Error(`strides should be ${a}D`);if(t.pads.length!==a*2)throw new Error(`pads should be ${a*2}D`);if(t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape")},fa=(e,t)=>{let r=e.kernelShape.slice();r.length<t[1].dims.length-2&&r.push(...Array(t[1].dims.length-2-r.length).fill(0));for(let n=2;n<t[1].dims.length;++n)r[n-2]===0&&(r[n-2]=t[1].dims[n]);let i=e.pads.slice();Ga.adjustPadsBasedOnAutoPad(t[0].dims,e.strides,e.dilations,r,i,e.format==="NHWC",e.autoPad);let a=Object.assign({},e);return Object.assign(a,{kernelShape:r,pads:i}),a},Cu=e=>{let t=nd(e),r=e.format,i=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],a=e.dilations,n=e.group,s=e.kernel_shape,u=e.pads,l=e.strides,h=e.w_is_const();return{autoPad:i,format:r,dilations:a,group:n,kernelShape:s,pads:u,strides:l,wIsConst:h,...t,cacheKey:`${e.format};${t.activation};`}},Io=(e,t,r,i)=>{let a=r.format==="NHWC",n=am(t[0].dims,t[1].dims,r.dilations,r.pads,r.strides,a);if(r.group!==1){let C=[t[0]];if(a){let A=e.kernelCustomData.wT??e.compute(It(t[1],pa),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=A),C.push(A)}else C.push(t[1]);t.length===3&&C.push(t[2]),!e.adapterInfo.isArchitecture("ampere")&&a&&t[1].dims[0]===r.group&&t[1].dims[1]===1&&r.dilations[0]===1&&r.dilations[1]===1?e.compute(_y(C,r,n,i),{inputs:C}):e.compute(yy(C,r,n,i),{inputs:C});return}let s=t.length===3,u=t[0].dims[a?1:2],l=t[0].dims[a?2:3],h=t[0].dims[a?3:1],p=t[1].dims[2],m=t[1].dims[3],g=n[a?1:2],_=n[a?2:3],w=n[a?3:1],b=a&&p===u&&m===l&&r.pads[0]===0&&r.pads[1]===0;if(b||p===1&&m===1&&r.dilations[0]===1&&r.dilations[1]===1&&r.strides[0]===1&&r.strides[1]===1&&r.pads[0]===0&&r.pads[1]===0){let C=n[0],A,M,D,G=[];if(a){let Z=e.kernelCustomData.wT??e.compute(It(t[1],pa),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];if(r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=Z),b){let ue=u*l*h;A=t[0].reshape([1,C,ue]),M=Z.reshape([1,ue,w]),D=[1,C,w]}else A=t[0].reshape([C,u*l,h]),M=Z.reshape([1,h,w]),D=[C,g*_,w];G.push(A),G.push(M)}else A=t[0].reshape([C,h,u*l]),M=t[1].reshape([1,w,h]),D=[C,w,g*_],G.push(M),G.push(A);s&&G.push(t[2]);let oe=D[2],he=G[0].dims[G[0].dims.length-1];oe<8&&he<8?e.compute(sd(G,r,n,D,a,i),{inputs:G}):e.compute(qa(G,r,n,D,a,i),{inputs:G});return}let k=!0,$=e.kernelCustomData.wT??e.compute(It(t[1],pa),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=$);let v=[t[0],$];s&&v.push(t[2]);let T=a?g*_:w,S=a?w:g*_,E=p*m*h;e.compute(fy(v,r,n,T,S,E,s,k,i),{inputs:v})},om=(e,t)=>{let r=t.format==="NHWC",i=[e.inputs[0].reshape(r?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&i.push(e.inputs[2]);let a=[0,t.pads[0],0,t.pads[1]],n=[1].concat(t.strides),s=[1].concat(t.dilations),u=[1].concat(t.kernelShape),l=fa({...t,pads:a,strides:n,dilations:s,kernelShape:u},i);Io(e,i,l,h=>r?[h[0],h[2],h[3]]:[h[0],h[1],h[3]])},um=(e,t,r)=>{let i=r.format==="NHWC"?"channelsLast":"channelsFirst",a=fa(r,t),n=r.autoPad==="NOTSET"?r.pads:r.autoPad,s=my(t[0].dims,t[1].dims,r.strides,r.dilations,n,!1,i);e.compute(gy(t,a,s.outShape,[s.filterDepth,s.filterHeight,s.filterWidth],[s.padInfo.front,s.padInfo.top,s.padInfo.left],i))},Au=(e,t)=>{if(sm(e.inputs,t),e.inputs[0].dims.length===3)om(e,t);else if(e.inputs[0].dims.length===5)um(e,e.inputs,t);else{let r=fa(t,e.inputs);Io(e,e.inputs,r)}}}),wy,$$=F(()=>{se(),Ar(),fe(),me(),wy=(e,t,r)=>{let i=e.length>2,a=t.outputShape,n=t.format==="NHWC",s=t.group,u=e[1].dims,l=u[2]/s,h=u[3],p=n?We(l):1,m=n?We(h):1,g=n?h===1?p:m:1,_=O.size(a)/m,w=[Math.ceil(_/64),1,1];_e("verbose",()=>`[conv2d_backprop_webgpu] dispatch = ${w}`);let b=["rank","rank"],k=[t.strides[0],t.strides[1]],$=[t.kernelShape[n?1:2],t.kernelShape[n?2:3]],v=[t.dilations[0],t.dilations[1]],T=[$[0]+(t.dilations[0]<=1?0:(t.kernelShape[n?1:2]-1)*(t.dilations[0]-1)),$[1]+(t.dilations[1]<=1?0:(t.kernelShape[n?2:3]-1)*(t.dilations[1]-1))],S=[T[0]-1-Math.floor((t.pads[0]+t.pads[2])/2),T[1]-1-Math.floor((t.pads[1]+t.pads[3])/2)],E=[{type:12,data:_},{type:12,data:k},{type:12,data:$},{type:12,data:v},{type:12,data:T},{type:6,data:S},{type:12,data:l},{type:12,data:h},...Y(e[0].dims,e[1].dims)];i&&(E.push(...Y(e[2].dims)),b.push("rank")),E.push(...Y(a));let C=A=>{let M=[{name:"output_size",type:"u32"},{name:"strides",type:"u32",length:k.length},{name:"filter_dims",type:"u32",length:$.length},{name:"dilations",type:"u32",length:$.length},{name:"effective_filter_dims",type:"u32",length:T.length},{name:"pads",type:"i32",length:S.length},{name:"input_channels_per_group",type:"u32"},{name:"output_channels_per_group",type:"u32"}],D=nt(e[0].dataType),G=n?1:2,oe=n?2:3,he=n?3:1,Z=B("W",e[1].dataType,e[1].dims.length,g),ue=B("Dy",e[0].dataType,e[0].dims.length,p),ne=[ue,Z];i&&ne.push(B("bias",e[2].dataType,[a[he]].length,m));let V=K("result",e[0].dataType,a.length,m),ye=()=>{let q="";if(p===1)q+=`
        let w_offset = ${Z.indicesToOffset(`${Z.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel, wOutChannel)`)};
        let wValue = ${Z.getByOffset(`w_offset / ${g}`)};
        dotProd = dotProd + xValue * wValue;`;else if(h===1)q+=`
          let wValue = ${Z.getByOffset(`${Z.indicesToOffset(`${Z.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel, wOutChannel)`)} / ${g}`)};
          dotProd = dotProd + dot(xValue, wValue);`;else for(let Ee=0;Ee<p;Ee++)q+=`
            let wValue${Ee} = ${Z.getByOffset(`${Z.indicesToOffset(`${Z.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel + ${Ee}, wOutChannel)`)} / ${g}`)};
            dotProd = dotProd + xValue[${Ee}] * wValue${Ee};`;return q},Te=`
            let outputIndices = ${V.offsetToIndices(`global_idx * ${m}`)};
            let batch = ${V.indicesGet("outputIndices",0)};
            let d1 = ${V.indicesGet("outputIndices",he)};
            let r = ${V.indicesGet("outputIndices",G)};
            let c = ${V.indicesGet("outputIndices",oe)};
            let dyCorner = vec2<i32>(i32(r), i32(c)) - uniforms.pads;
            let dyRCorner = dyCorner.x;
            let dyCCorner = dyCorner.y;
            let groupId = d1 / uniforms.output_channels_per_group;
            let wOutChannel = d1 - groupId * uniforms.output_channels_per_group;
            // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
            // ? = to be determined. : = across all values in that axis.
            var dotProd = ${V.type.value}(0.0);
            var wR: u32 = 0;
            if (uniforms.dilations.x == 1) {
              // Minimum wR >= 0 that satisfies (dyRCorner + wR) % (uniforms.strides.x) == 0
              wR = u32(((dyRCorner + i32(uniforms.strides.x) - 1) / i32(uniforms.strides.x)) * i32(uniforms.strides.x) - dyRCorner);
            }
            for (; wR < uniforms.effective_filter_dims.x; wR = wR + 1) {
              if (wR % uniforms.dilations.x != 0) {
                continue;
              }
              let dyR = (${D}(dyRCorner) + ${D}(wR)) / ${D}(uniforms.strides[0]);
              let wRPerm = uniforms.filter_dims.x - 1 - wR / uniforms.dilations.x;
              if (dyR < 0.0 || dyR >= ${D}(uniforms.Dy_shape[${G}]) || fract(dyR) > 0.0 ||
                  wRPerm < 0) {
                continue;
              }
              let idyR: u32 = u32(dyR);
              var wC: u32 = 0;
              if (uniforms.dilations.y == 1) {
                // Minimum wC >= 0 that satisfies (dyCCorner + wC) % (uniforms.strides.y) == 0
                wC = u32(((dyCCorner + i32(uniforms.strides.y) - 1) / i32(uniforms.strides.y)) * i32(uniforms.strides.y) - dyCCorner);
              }

              for (; wC < uniforms.effective_filter_dims.y; wC = wC + 1) {
                if (wC % uniforms.dilations.y != 0) {
                  continue;
                }
                let dyC = (${D}(dyCCorner) + ${D}(wC)) / ${D}(uniforms.strides.y);
                let wCPerm = uniforms.filter_dims.y - 1 - wC / uniforms.dilations.y;
                if (dyC < 0.0 || dyC >= ${D}(uniforms.Dy_shape[${oe}]) ||
                    fract(dyC) > 0.0 || wCPerm < 0) {
                  continue;
                }
                let idyC: u32 = u32(dyC);
                var inputChannel = groupId * uniforms.input_channels_per_group;
                for (var d2: u32 = 0; d2 < uniforms.input_channels_per_group; d2 = d2 + ${p}) {
                  let xValue = ${n?ue.getByOffset(`${ue.indicesToOffset(`${ue.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${p}`):ue.get("batch","inputChannel","idyR","idyC")};
                  ${ye()}
                  inputChannel = inputChannel + ${p};
                }
                wC = wC + uniforms.strides.y - 1;
              }
              wR = wR + uniforms.strides[0] - 1;
            }
            let value = dotProd${i?` + bias[d1 / ${m}]`:""};
            ${V.setByOffset("global_idx","value")};
          `;return`
    ${A.registerUniforms(M).declareVariables(...ne,V)}
      ${A.mainStart()}
      ${A.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")};
    ${Te}}`};return{name:"ConvTranspose2D",shaderCache:{hint:`${t.cacheKey};${p}${g}${m}${h===1}`,inputDependencies:b},getRunData:()=>({dispatchGroup:{x:w[0],y:w[1],z:w[2]},outputs:[{dims:r?r(a):a,dataType:e[0].dataType}],programUniforms:E}),getShaderSource:C}}}),lm,dm,hm,Co,by,cm,Ao,pm,vy,x$=F(()=>{$$(),$i(),Zr(),lm=(e,t,r,i,a,n)=>(e-1)*t+r+(i-1)*a+1-n,dm=(e,t,r,i,a)=>{let n=Math.floor(e/2);t==="SAME_UPPER"?(r[i]=n,r[a]=e-n):t==="SAME_LOWER"&&(r[i]=e-n,r[a]=n)},hm=(e,t,r,i,a,n,s,u,l,h)=>{let p=e.length-2,m=h.length===0;l.length<p&&l.push(...Array(p-l.length).fill(0));let g=e[0],_=t[u?3:1]*a;for(let w=0,b=e.length-p-(u?1:0);w<p;++w,++b){let k=e[b],$=m?k*s[w]:h[w],v=lm(k,s[w],n[w],t[b],r[w],$);dm(v,i,n,w,w+p),m&&h.push(s[w]*(k-1)+l[w]+(t[b]-1)*r[w]+1-n[w]-n[w+p])}h.splice(0,0,g),h.splice(u?3:1,0,_)},Co=(e,t)=>{let r=e.kernelShape.slice();if(e.kernelShape.length===0||e.kernelShape.reduce((m,g)=>m*g,1)===0){r.length=0;for(let m=2;m<t[1].dims.length;++m)r.push(t[1].dims[m])}let i=e.format==="NHWC";r.splice(0,0,t[1].dims[0]),r.splice(i?3:1,0,t[1].dims[1]);let a=e.pads.slice(),n=e.outputShape.slice(),s=e.outputPadding.slice(),u=t[0].dims,l=e.dilations.slice();if(l.reduce((m,g)=>m+g,0)===0){let m=t[0].dims.length-2;l=new Array(m).fill(1)}let h=e.strides.slice();if(h.reduce((m,g)=>m+g,0)===0){let m=t[0].dims.length-2;h=new Array(m).fill(1)}hm(u,r,l,e.autoPad,e.group,a,h,i,s,n);let p=Object.assign({},e);return Object.assign(p,{kernelShape:r,pads:a,outputPadding:s,outputShape:n,dilations:l,strides:h}),p},by=e=>{let t=nd(e),r=e.format,i=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][typeof e.autoPad>"u"?0:e.autoPad],a=e.dilations,n=e.group,s=e.kernelShape,u=e.pads,l=e.strides,h=e.wIsConst(),p=e.outputPadding,m=e.outputShape;return{autoPad:i,format:r,dilations:a,group:n,kernelShape:s,outputPadding:p,outputShape:m,pads:u,strides:l,wIsConst:h,...t,cacheKey:`${e.format};${t.activation};`}},cm=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length!==4&&e[0].dims.length!==3)throw new Error("currently only support 2-dimensional conv");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let r=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],i=e[1].dims[0];if(r!==i)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");let a=e[1].dims[1]*t.group;if(e.length===3&&(e[2].dims.length!==1||e[2].dims[0]!==a))throw new Error("invalid bias");let n=e[0].dims.length-2;if(t.dilations.reduce((s,u)=>s+u,0)>0&&t.dilations.length!==n)throw new Error(`dilations should be ${n}D`);if(t.strides.reduce((s,u)=>s+u,0)>0&&t.strides.length!==n)throw new Error(`strides should be ${n}D`);if(t.pads.reduce((s,u)=>s+u,0)>0&&t.pads.length!==n*2)throw new Error(`pads should be ${n*2}D`);if(t.outputPadding.length!==n&&t.outputPadding.length!==0)throw new Error(`output_padding should be ${n}D`);if(t.kernelShape.reduce((s,u)=>s+u,0)>0&&t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape");if(t.outputShape.length!==0&&t.outputShape.length!==e[0].dims.length-2)throw new Error("invalid output shape")},Ao=(e,t,r,i)=>{let a=e.kernelCustomData.wT??e.compute(It(t[1],[2,3,0,1]),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=a);let n=[t[0],a];t.length===3&&n.push(t[2]),e.compute(wy(n,r,i),{inputs:n})},pm=(e,t)=>{let r=t.format==="NHWC",i=[e.inputs[0].reshape(r?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&i.push(e.inputs[2]);let a=t.kernelShape;(a.length===0||a[0]===0)&&(a=[e.inputs[1].dims[2]]);let n=t.dilations;(n.length===0||n[0]===0)&&(n=[1]);let s=t.strides;(s.length===0||s[0]===0)&&(s=[1]);let u=t.pads;u.length===0&&(u=[0,0]),u=[0,u[0],0,u[1]],s=[1].concat(s),n=[1].concat(n),a=[1].concat(a);let l=t.outputPadding;l=[0].concat(l);let h=Co({...t,pads:u,strides:s,dilations:n,kernelShape:a,outputPadding:l},i);Ao(e,i,h,p=>r?[p[0],p[2],p[3]]:[p[0],p[1],p[3]])},vy=(e,t)=>{if(cm(e.inputs,t),e.inputs[0].dims.length===3)pm(e,t);else{let r=Co(t,e.inputs);Ao(e,e.inputs,r)}}}),fm,$y,xy,k$=F(()=>{se(),fe(),qe(),me(),fm=(e,t,r,i)=>{let a=O.size(t),n=t.length,s=B("input",e,n),u=K("output",e,n),l=r.dataType===6?r.getInt32Array()[0]:Number(r.getBigInt64Array()[0]),h=O.normalizeAxis(l,n),p=m=>{let g=` i32(${s.indicesGet("inputIndices","uniforms.axis")}) `,_=X("uniforms.input_shape","uniforms.axis",n),w=i.reverse?g+(i.exclusive?" + 1":""):"0",b=i.reverse?_:g+(i.exclusive?"":" + 1");return`
                ${m.registerUniform("outputSize","u32").registerUniform("axis","u32").declareVariables(s,u)}
                ${m.mainStart()}
                  ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
                  var inputIndices = ${u.offsetToIndices("global_idx")};
                  var sum = ${u.type.value}(0);
                  let first : i32 = ${w};
                  let last : i32 = ${b};
                  for (var i : i32 = first; i < last; i++) {
                    ${s.indicesSet("inputIndices","uniforms.axis","u32(i)")};
                    sum = sum + ${s.getByIndices("inputIndices")};
                  }
                  ${u.setByOffset("global_idx","sum")};
                }`};return{name:"CumSum",shaderCache:{hint:i.cacheKey,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:t,dataType:e}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:[{type:12,data:a},{type:12,data:h},...Y(t,t)]}),getShaderSource:p}},$y=(e,t)=>{let r=e.inputs[0].dims,i=e.inputs[0].dataType,a=e.inputs[1];e.compute(fm(i,r,a,t),{inputs:[0]})},xy=e=>{let t=e.exclusive===1,r=e.reverse===1;return Ce({exclusive:t,reverse:r})}}),mm,gm,ym,ky,Sy,S$=F(()=>{se(),fe(),qe(),me(),mm=e=>{if(!e||e.length!==1)throw new Error("DepthToSpace requires 1 input.");if(e[0].dims.length!==4)throw new Error("DepthToSpace requires 4D input.")},gm=(e,t,r,i)=>{let a=[];a.push(`fn perm(i: ${i.type.indices}) -> ${r.type.indices} {
    var a: ${r.type.indices};`);for(let n=0;n<t;++n)a.push(r.indicesSet("a",e[n],`i[${n}]`));return a.push("return a;}"),a.join(`
`)},ym=(e,t)=>{let r,i,a,n,s,u,l=t.format==="NHWC",h=t.blocksize,p=t.mode==="DCR";l?([r,i,a,n]=e.dims,s=p?[r,i,a,h,h,n/h**2]:[r,i,a,n/h**2,h,h],u=p?[0,1,3,2,4,5]:[0,1,4,2,5,3]):([r,i,a,n]=[e.dims[0],e.dims[2],e.dims[3],e.dims[1]],s=p?[r,h,h,n/h**2,i,a]:[r,n/h**2,h,h,i,a],u=p?[0,3,4,1,5,2]:[0,1,4,2,5,3]);let m=e.reshape(s),g=m.dims.length,_=e.dataType,w=B("a",_,g),b=K("output",_,g),k=$=>`
  ${$.registerUniform("output_size","u32").declareVariables(w,b)}

  ${gm(u,g,w,b)}

  ${$.mainStart()}
    ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${b.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${b.setByOffset("global_idx",w.getByIndices("aIndices"))}
  }`;return{name:"DepthToSpace",shaderCache:{hint:`${e.dims};${t.blocksize};${t.mode}`,inputDependencies:["rank"]},getRunData:$=>{let v=l?[r,i*h,a*h,n/h**2]:[r,n/h**2,i*h,a*h],T=O.size(v),S=m.dims,E=O.sortBasedOnPerm(S,u);return{outputs:[{dims:v,dataType:$[0].dataType}],dispatchGroup:{x:Math.ceil(T/64)},programUniforms:[{type:12,data:T},...Y(S,E)]}},getShaderSource:k}},ky=(e,t)=>{mm(e.inputs),e.compute(ym(e.inputs[0],t))},Sy=e=>Ce({blocksize:e.blocksize,mode:e.mode,format:e.format})}),ma,yn,zo,_m,wm,bm,vm,Oo,$m,Ty,Ey,T$=F(()=>{se(),fe(),qe(),me(),ma="[a-zA-Z]|\\.\\.\\.",yn="("+ma+")+",zo="^"+yn+"$",_m="("+yn+",)*"+yn,wm="^"+_m+"$",bm=class{constructor(e=-1){this.symbolToIndices=new Map,this.inputIndex=e}addSymbol(e,t){let r=this.symbolToIndices.get(e);r===void 0?r=[t]:r.push(t),this.symbolToIndices.set(e,r)}},vm=class{constructor(e,t){var a;this.equation=t,this.hasEllipsis=!1,this.symbolToInfo=new Map,this.lhs=new Array,this.outputDims=[];let[r,i]=t.includes("->")?t.split("->",2):[t,""];if(!r.match(RegExp(wm)))throw new Error("Invalid LHS term");if(r.split(",").forEach((n,s)=>{let u=e[s].dims.slice();if(!n.match(RegExp(zo)))throw new Error("Invalid LHS term");let l=this.processTerm(n,!0,u,s);this.lhs.push(l)}),i==="")i+=[...this.symbolToInfo.entries()].filter(([n,s])=>s.count===1||n==="...").map(([n])=>n).join("");else if(!i.match(RegExp(yn)))throw new Error("Invalid RHS");(a=i.match(RegExp(ma,"g")))==null||a.forEach(n=>{if(n==="...")this.outputDims=this.outputDims.concat(this.ellipsisDims);else{let s=this.symbolToInfo.get(n);if(s===void 0)throw new Error("Invalid RHS symbol");this.outputDims.push(s.dimValue)}}),this.rhs=this.processTerm(i,!1,this.outputDims)}addSymbol(e,t,r){let i=this.symbolToInfo.get(e);if(i!==void 0){if(i.dimValue!==t&&i.count!==1)throw new Error("Dimension mismatch");i.count++,i.inputIndices.push(r)}else i={count:1,dimValue:t,inputIndices:[r]};this.symbolToInfo.set(e,i)}processTerm(e,t,r,i=-1){let a=r.length,n=!1,s=[],u=0;if(!e.match(RegExp(zo))&&!t&&e!=="")throw new Error("Invalid LHS term");let l=e.match(RegExp(ma,"g")),h=new bm(i);return l==null||l.forEach((p,m)=>{if(p==="..."){if(n)throw new Error("Only one ellipsis is allowed per input term");n=!0;let g=a-l.length+1;if(g<0)throw new Error("Ellipsis out of bounds");if(s=r.slice(u,u+g),this.hasEllipsis){if(this.ellipsisDims.length!==s.length||this.ellipsisDims.toString()!==s.toString())throw new Error("Ellipsis dimensions mismatch")}else if(t)this.hasEllipsis=!0,this.ellipsisDims=s;else throw new Error("Ellipsis must be specified in the LHS");for(let _=0;_<s.length;_++){let w=String.fromCharCode(48+_);h.addSymbol(w,m+_),this.addSymbol(w,r[u++],i)}}else h.addSymbol(p,m+(this.hasEllipsis?this.ellipsisDims.length-1:0)),this.addSymbol(p,r[u++],i)}),h}},Oo=e=>e+"_max",$m=(e,t,r,i)=>{let a=e.map(h=>h.length).map((h,p)=>B(`input${p}`,t,h)),n=O.size(i),s=K("output",t,i.length),u=[...r.symbolToInfo.keys()].filter(h=>!r.rhs.symbolToIndices.has(h)),l=h=>{let p=[],m="var prod = 1.0;",g="var sum = 0.0;",_="sum += prod;",w=[],b=[],k=[],$=[],v=r.symbolToInfo.size===r.rhs.symbolToIndices.size;r.symbolToInfo.forEach((S,E)=>{var C;if(r.rhs.symbolToIndices.has(E)){let A=(C=r.rhs.symbolToIndices.get(E))==null?void 0:C[0];A!==void 0&&r.lhs.forEach((M,D)=>{if(S.inputIndices.includes(D)){let G=M.symbolToIndices.get(E);if(G===void 0)throw new Error("Invalid symbol error");G.forEach(oe=>{p.push(`${a[D].indicesSet(`input${D}Indices`,oe,s.indicesGet("outputIndices",A))}`)})}})}else r.lhs.forEach((A,M)=>{if(S.inputIndices.includes(M)){let D=A.symbolToIndices.get(E);if(D===void 0)throw new Error("Invalid symbol error");D.forEach(G=>{w.push(`${a[M].indicesSet(`input${M}Indices`,G,`${E}`)}`)}),$.push(`prod *= ${a[M].getByIndices(`input${M}Indices`)};`)}}),b.push(`for(var ${E}: u32 = 0; ${E} < uniforms.${Oo(E)}; ${E}++) {`),k.push("}")});let T=v?[...p,`let sum = ${a.map((S,E)=>S.getByIndices(`input${E}Indices`)).join(" * ")};`]:[...p,g,...b,...w,m,...$,_,...k];return`
            ${h.registerUniforms(u.map(S=>({name:`${Oo(S)}`,type:"u32"}))).registerUniform("outputSize","u32").declareVariables(...a,s)}

            ${h.mainStart()}
            ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
            var outputIndices = ${s.offsetToIndices("global_idx")};
            ${a.map((S,E)=>`var input${E}Indices: ${a[E].type.indices};`).join(`
`)}
            ${T.join(`
`)};
            ${s.setByOffset("global_idx","sum")};
          }`};return{name:"Einsum",shaderCache:{hint:r.equation,inputDependencies:e.map(()=>"rank")},getRunData:()=>{let h=u.filter(m=>r.symbolToInfo.has(m)).map(m=>{var g;return{type:12,data:((g=r.symbolToInfo.get(m))==null?void 0:g.dimValue)||0}});h.push({type:12,data:n});let p=e.map((m,g)=>[...Y(m)]).reduce((m,g)=>m.concat(g),h);return p.push(...Y(i)),{outputs:[{dims:i,dataType:t}],dispatchGroup:{x:Math.ceil(n/64)},programUniforms:p}},getShaderSource:l}},Ty=(e,t)=>{let r=new vm(e.inputs,t.equation),i=r.outputDims,a=e.inputs.map((n,s)=>n.dims);e.compute($m(a,e.inputs[0].dataType,r,i))},Ey=e=>{let t=e.equation.replace(/\s+/g,"");return Ce({equation:t})}}),xm,Ro,km,Sm,Iy,E$=F(()=>{se(),fe(),me(),xm=e=>{if(!e||e.length!==2)throw new Error("Expand requires 2 input.");let t=e[0].dims,r=Array.from(e[1].getBigInt64Array(),Number),i=r.length<t.length?0:r.length-t.length,a=t.length<r.length?0:t.length-r.length;for(;i<r.length&&a<t.length;++i,++a)if(r[i]!==t[a]&&r[i]!==1&&t[a]!==1)throw new Error("Expand requires shape to be broadcastable to input")},Ro=(e,t)=>{let r=e.length-t.length,i=[];for(let a=0;a<r;++a)i.push(e[a]);for(let a=0;a<t.length;++a)i.push(t[a]===1?e[a+r]:t[a]);return i},km=(e,t)=>e.length>t.length?Ro(e,t):Ro(t,e),Sm=e=>{let t=e[0].dims,r=Array.from(e[1].getBigInt64Array(),Number),i=km(t,r),a=e[0].dataType,n=a===9||O.size(t)===1,s=a===9||t.length>0&&t[t.length-1]%4===0?4:1,u=n||i.length>0&&i[i.length-1]%4===0?4:1,l=Math.ceil(O.size(i)/u),h=m=>{let g=B("input",a,t.length,s),_=K("output",a,i.length,u),w;if(a===9){let b=(k,$,v="")=>`
          let outputIndices${$} = ${_.offsetToIndices(`outputOffset + ${$}u`)};
          let offset${$} = ${g.broadcastedIndicesToOffset(`outputIndices${$}`,_)};
          let index${$} = offset${$} / 4u;
          let component${$} = offset${$} % 4u;
          ${k}[${$}] = ${v}(${g.getByOffset(`index${$}`)}[component${$}]);
        `;w=`
        let outputOffset = global_idx * ${u};
        var data = vec4<u32>(0);
        ${b("data",0,"u32")}
        ${b("data",1,"u32")}
        ${b("data",2,"u32")}
        ${b("data",3,"u32")}
        ${_.setByOffset("global_idx","data")}
      }`}else w=`
        let outputIndices = ${_.offsetToIndices(`global_idx * ${u}`)};
        let inputOffset = ${g.broadcastedIndicesToOffset("outputIndices",_)};
        let data = ${_.type.value}(${g.getByOffset(`inputOffset / ${s}`)});
        ${_.setByOffset("global_idx","data")}
      }`;return`
    ${m.registerUniform("vec_size","u32").declareVariables(g,_)}
    ${m.mainStart()}
    ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
    ${w}`},p=[{type:12,data:l},...Y(t,i)];return{name:"Expand",shaderCache:{hint:`${i.length};${s}${u}`,inputDependencies:["rank"]},getShaderSource:h,getRunData:()=>({outputs:[{dims:i,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:p})}},Iy=e=>{xm(e.inputs),e.compute(Sm(e.inputs),{inputs:[0]})}}),Tm,Cy,I$=F(()=>{se(),fe(),me(),id(),Tm=e=>{let t=e[0].dataType,r=O.size(e[0].dims),i=O.size(e[1].dims),a=i%4===0,n=s=>{let u=B("x",t,[1],4),l=B("bias",t,[1],4),h=K("y",t,[1],4),p=[{name:"output_vec_size",type:"u32"},{name:"bias_size",type:"u32"}],m=_=>`
      let bias${_}_offset: u32 = (global_idx * 4 + ${_}) % uniforms.bias_size;
      let bias${_} = ${l.getByOffset(`bias${_}_offset / 4`)}[bias${_}_offset % 4];`,g=a?`
      let bias = ${l.getByOffset("global_idx % (uniforms.bias_size / 4)")};`:`${m(0)}${m(1)}${m(2)}${m(3)}
      let bias = ${u.type.value}(bias0, bias1, bias2, bias3);`;return`${s.registerUniforms(p).declareVariables(u,l,h)}

    ${Su(lt(t))}

    ${s.mainStart(Ki)}
      ${s.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_vec_size")}

      let x = ${u.getByOffset("global_idx")};
      ${g}
      let x_in = x + bias;
      ${h.setByOffset("global_idx",Tu("x_in"))}
    }`};return{name:"FastGeluWithBias",shaderCache:{hint:`${a}`,inputDependencies:["type","type"]},getShaderSource:n,getRunData:s=>({outputs:[{dims:s[0].dims,dataType:s[0].dataType}],programUniforms:[{type:12,data:Math.ceil(r/4)},{type:12,data:i}],dispatchGroup:{x:Math.ceil(r/Ki/4)}})}},Cy=e=>{e.inputs.length<2||O.size(e.inputs[1].dims)===0?X3(e):e.compute(Tm(e.inputs))}}),Em,Im,Ay,zy,C$=F(()=>{se(),fe(),qe(),me(),Em=e=>{if(!e||e.length!==2)throw new Error("Gather requires 2 inputs.")},Im=(e,t)=>{let r=e[0].dims,i=e[1].dims,a=r.length,n=O.normalizeAxis(t.axis,a),s=r.slice(0);s.splice(n,1,...i);let u=r[n],l=e[0].dataType===9?4:1,h=Math.ceil(O.size(s)/l),p=[{type:12,data:h},{type:6,data:u},{type:12,data:n},...Y(e[0].dims,e[1].dims,s)],m=g=>{let _=B("data",e[0].dataType,e[0].dims.length,l),w=B("inputIndices",e[1].dataType,e[1].dims.length),b=K("output",e[0].dataType,s.length,l),k=v=>{let T=i.length,S=`var indicesIndices${v}  = ${w.type.indices}(0);`;for(let E=0;E<T;E++)S+=`${T>1?`indicesIndices${v}[${E}]`:`indicesIndices${v}`} = ${s.length>1?`outputIndices${v}[uniforms.axis + ${E}]`:`outputIndices${v}`};`;S+=`
          var idx${v} = ${w.getByIndices(`indicesIndices${v}`)};
          if (idx${v} < 0) {
            idx${v} = idx${v} + uniforms.axisDimLimit;
          }
          var dataIndices${v} : ${_.type.indices};
        `;for(let E=0,C=0;E<a;E++)E===n?(S+=`${a>1?`dataIndices${v}[${E}]`:`dataIndices${v}`} = u32(idx${v});`,C+=T):(S+=`${a>1?`dataIndices${v}[${E}]`:`dataIndices${v}`} = ${s.length>1?`outputIndices${v}[${C}]`:`outputIndices${v}`};`,C++);return S},$;if(e[0].dataType===9){let v=(T,S,E="")=>`
          let outputIndices${S} = ${b.offsetToIndices(`outputOffset + ${S}u`)};
          ${k(S)};
          let offset${S} = ${_.indicesToOffset(`dataIndices${S}`)};
          let index${S} = offset${S} / 4u;
          let component${S} = offset${S} % 4u;
          ${T}[${S}] = ${E}(${_.getByOffset(`index${S}`)}[component${S}]);
        `;$=`
        let outputOffset = global_idx * ${l};
        var value = vec4<u32>(0);
        ${v("value",0,"u32")}
        ${v("value",1,"u32")}
        ${v("value",2,"u32")}
        ${v("value",3,"u32")}
        ${b.setByOffset("global_idx","value")}
      `}else $=`
      let outputIndices = ${b.offsetToIndices("global_idx")};
      ${k("")};
      let value = ${_.getByIndices("dataIndices")};
      ${b.setByOffset("global_idx","value")};
      `;return`
      ${g.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(_,w,b)}
      ${g.mainStart()}
        ${g.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        ${$}
      }`};return{name:"Gather",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:s,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:p}),getShaderSource:m}},Ay=e=>Ce({axis:e.axis}),zy=(e,t)=>{let r=e.inputs;Em(r),e.compute(Im(e.inputs,t))}}),Cm,Oy,Ry,A$=F(()=>{se(),fe(),me(),Cm=(e,t,r,i,a,n,s,u,l)=>{let h=[{type:12,data:n},{type:12,data:i},{type:12,data:a},{type:12,data:r},{type:12,data:s},{type:12,data:u},{type:12,data:l}],p=[n];h.push(...Y(t.dims,p));let m=g=>{let _=B("indices_data",t.dataType,t.dims.length),w=K("input_slice_offsets_data",12,1,1),b=[_,w],k=[{name:"output_size",type:"u32"},{name:"batch_dims",type:"u32"},{name:"input_dims",type:"u32",length:a.length},{name:"sizes_from_slice_dims_data",type:"u32",length:r.length},{name:"num_slices_per_batch",type:"u32"},{name:"input_batch_stride",type:"u32"},{name:"num_slice_dims",type:"u32"}];return`
  ${g.registerUniforms(k).declareVariables(...b)}
  ${g.mainStart()}
    ${g.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let batch_idx = global_idx / uniforms.num_slices_per_batch;
    let base_offset = batch_idx * uniforms.input_batch_stride;

    let slice_indices_base_offset = global_idx * uniforms.num_slice_dims;
    var relative_slice_offset = 0;
    for (var dim_idx = 0u; dim_idx < uniforms.num_slice_dims; dim_idx ++) {
      var index = i32(indices_data[dim_idx + slice_indices_base_offset].x);
      let input_dim_idx = uniforms.batch_dims + dim_idx;
      if (index < 0) {
        ${a.length===1?"index += i32(uniforms.input_dims);":"index += i32(uniforms.input_dims[input_dim_idx]);"}
      }
      ${r.length===1?"relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data);":"relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data[dim_idx]);"}
    }

    input_slice_offsets_data[global_idx] =  base_offset + u32(relative_slice_offset);
  }`};return e.compute({name:"computeSliceOffsets",shaderCache:{hint:`${a.length}_${r.length}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:p,dataType:e.inputs[1].dataType}],dispatchGroup:{x:Math.ceil(n/64)},programUniforms:h}),getShaderSource:m},{inputs:[t],outputs:[-1]})[0]},Oy=(e,t)=>{let r=e.inputs,i=r[0].dims,a=r[0].dataType,n=r[1].dims,s=n[n.length-1],u=O.sizeToDimension(n,n.length-1),l=O.sizeFromDimension(i,t.batchDims+s),h=O.sizeToDimension(i,t.batchDims),p=O.sizeFromDimension(i,t.batchDims),m=u/h,g=new Array(s),_=l;for(let S=0;S<s;++S)g[s-1-S]=_,_*=i[t.batchDims+s-1-S];let w=Cm(e,r[1],g,t.batchDims,i,u,m,p,s),b=t.batchDims+s;if(b>i.length)throw new Error("last dimension of indices must not be larger than rank of input tensor");let k=n.slice(0,-1).concat(i.slice(b)),$=O.size(k),v=[{type:12,data:$},{type:12,data:l},...Y(r[0].dims,w.dims,k)],T=S=>{let E=B("data",r[0].dataType,r[0].dims.length),C=B("slice_offsets",12,w.dims.length),A=K("output",r[0].dataType,k.length);return`
          ${S.registerUniform("output_size","u32").registerUniform("slice_size","u32").declareVariables(E,C,A)}
            ${S.mainStart()}
            ${S.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let slice_offset = slice_offsets[global_idx / uniforms.slice_size];
          output[global_idx] = data[u32(slice_offset) + global_idx % uniforms.slice_size];
        }`};e.compute({name:"GatherND",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:k,dataType:a}],dispatchGroup:{x:Math.ceil($/64)},programUniforms:v}),getShaderSource:T},{inputs:[r[0],w]})},Ry=e=>({batchDims:e.batch_dims,cacheKey:""})}),Am,zm,My,By,z$=F(()=>{se(),fe(),qe(),me(),Am=(e,t)=>{if(e.length<3||e.length>4)throw new Error("GatherBlockQuantized requires 3 or 4 inputs.");let r=O.normalizeAxis(t.quantizeAxis,e[0].dims.length),i=t.blockSize,a=e[0],n=e[2],s=e.length===4?e[3]:void 0;if(n.dims.length!==a.dims.length||!a.dims.map((u,l)=>l===r?Math.ceil(u/i)===n.dims[l]:u===n.dims[l]).reduce((u,l)=>u&&l,!0))throw new Error("Scales must have the same rank as the input tensor and the dims should match except on gatherAxis.");if(s){if(s.dataType!==a.dataType)throw new Error("Zero point must have the same data type as the input tensor.");if(s.dims.length!==n.dims.length||!s.dims.map((u,l)=>u===n.dims[l]).reduce((u,l)=>u&&l,!0))throw new Error("Zero point must have the same rank as the input tensor and the dims should match except on quantizeAxis.")}},zm=(e,t)=>{let r=e[0].dims,i=e[1].dims,a=r.length,n=O.normalizeAxis(t.gatherAxis,a),s=O.normalizeAxis(t.quantizeAxis,a),u=r.slice(0);u.splice(n,1,...i);let l=O.size(u),h=e[2].dataType,p=e[0].dataType===22,m=[{type:12,data:l},{type:12,data:s},{type:12,data:n},{type:12,data:t.blockSize},...Y(...e.map((_,w)=>_.dims),u)],g=_=>{let w=B("data",e[0].dataType,e[0].dims.length),b=B("inputIndices",e[1].dataType,e[1].dims.length),k=B("scales",e[2].dataType,e[2].dims.length),$=e.length>3?B("zeroPoint",e[3].dataType,e[3].dims.length):void 0,v=K("output",h,u.length),T=[w,b,k];$&&T.push($);let S=[{name:"output_size",type:"u32"},{name:"quantize_axis",type:"u32"},{name:"gather_axis",type:"u32"},{name:"block_size",type:"u32"}];return`
        ${_.registerUniforms(S).declareVariables(...T,v)}
        ${_.mainStart()}
        let output_indices = ${v.offsetToIndices("global_idx")};
        var indices_indices = ${b.type.indices}(0);
        ${i.length>1?`
          for (var i: u32 = 0; i < ${i.length}; i++) {
            let index = ${v.indicesGet("output_indices","uniforms.gather_axis + i")};
            ${b.indicesSet("indices_indices","i","index")};
          }`:`indices_indices = ${v.indicesGet("output_indices","uniforms.gather_axis")};`};
        var data_indices = ${w.type.indices}(0);
        for (var i: u32 = 0; i < uniforms.gather_axis; i++) {
          let index = ${v.indicesGet("output_indices","i")};
          ${w.indicesSet("data_indices","i","index")};
        }
        var index_from_indices = ${b.getByIndices("indices_indices")};
        if (index_from_indices < 0) {
          index_from_indices += ${r[n]};
        }
        ${w.indicesSet("data_indices","uniforms.gather_axis","u32(index_from_indices)")};
        for (var i = uniforms.gather_axis + 1; i < ${u.length}; i++) {
          let index = ${v.indicesGet("output_indices",`i + ${i.length} - 1`)};
          ${w.indicesSet("data_indices","i","index")};
        }
        let data_offset = ${w.indicesToOffset("data_indices")};
        let data_index = data_offset % 8;
        // Convert 4-bit packed data to 8-bit packed data.
        let packed_4bit_quantized_data = ${w.getByOffset("data_offset / 8")};
        let packed_8bit_quantized_data = (packed_4bit_quantized_data >> (4 * (data_index % 2))) & 0x0f0f0f0f;
        let quantized_data_vec = ${p?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_quantized_data));
        let quantized_data = quantized_data_vec[data_index / 2];
        var scale_indices = data_indices;
        let quantize_axis_index = ${k.indicesGet("data_indices","uniforms.quantize_axis")} / uniforms.block_size;
        ${k.indicesSet("scale_indices","uniforms.quantize_axis","quantize_axis_index")};
        var scale = ${k.getByIndices("scale_indices")};
        ${$?`
              let zero_point_indices = scale_indices;
              let zero_point_offset = ${$.indicesToOffset("zero_point_indices")};
              let zero_point_index = zero_point_offset % 8;
              let packed_4bit_zero_points = ${$.getByOffset("zero_point_offset / 8")};
              let packed_8bit_zero_points = (packed_4bit_zero_points >> (4 * (zero_point_index % 2))) & 0x0f0f0f0f;
              let zero_point_vec = ${p?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_zero_points));
              let zero_point = zero_point_vec[zero_point_index / 2];`:"var zero_point = 0"};
        let dequantized_data = ${lt(h)}(quantized_data - zero_point) * scale;
        ${v.setByOffset("global_idx","dequantized_data")};
    }`};return{name:"GatherBlockQuantized",shaderCache:{hint:`${t.cacheKey};${e.filter((_,w)=>w!==1).map(_=>_.dims.join("_")).join(";")}`,inputDependencies:Array.from({length:e.length},(_,w)=>"rank")},getRunData:()=>({outputs:[{dims:u,dataType:h}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:m}),getShaderSource:g}},My=(e,t)=>{let r=e.inputs;Am(r,t),e.compute(zm(e.inputs,t))},By=e=>Ce({blockSize:e.blockSize,gatherAxis:e.gatherAxis,quantizeAxis:e.quantizeAxis})}),Om,Rm,Ny,Py,O$=F(()=>{se(),fe(),qe(),me(),Om=e=>{if(!e||e.length!==2)throw new Error("GatherElements requires 2 inputs.");if(e[0].dims.length<1)throw new Error("GatherElements requires that the data input be rank >= 1.");if(e[0].dims.length!==e[1].dims.length)throw new Error(`GatherElements requires that the data input and
                     indices input tensors be of same rank.`)},Rm=(e,t)=>{let r=e[0].dims,i=e[0].dataType,a=r.length,n=e[1].dims,s=e[1].dataType,u=O.normalizeAxis(t.axis,a),l=r[u],h=n.slice(0),p=O.size(h),m=B("input",i,a),g=B("indicesInput",s,n.length),_=K("output",i,h.length),w=[{type:12,data:p},{type:6,data:l},{type:12,data:u}];return w.push(...Y(r,n,h)),{name:"GatherElements",shaderCache:{inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:h,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(p/64)},programUniforms:w}),getShaderSource:b=>`
      ${b.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(m,g,_)}
      ${b.mainStart()}
      ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

      let outputIndices = ${_.offsetToIndices("global_idx")};

      var idx = ${g.getByOffset("global_idx")};
      if (idx < 0) {
        idx = idx + uniforms.axisDimLimit;
      }
      var inputIndices = ${m.type.indices}(outputIndices);
      ${m.indicesSet("inputIndices","uniforms.axis","u32(idx)")};
      let value = ${m.getByIndices("inputIndices")};

      ${_.setByOffset("global_idx","value")};
  }`}},Ny=e=>Ce({axis:e.axis}),Py=(e,t)=>{let r=e.inputs;Om(r),e.compute(Rm(e.inputs,t))}}),Mm,Bm,Dy,Ly,R$=F(()=>{se(),fe(),me(),Mm=e=>{if(!e)throw new Error("Input is missing");if(e.length<2||e.length>3)throw new Error("Invaid input number.");if(e.length===3&&e[2].dims.length>2)throw new Error("Invalid input shape of C");if(e[0].dataType!==e[1].dataType||e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("Input types are mismatched")},Bm=(e,t)=>{let r=e[0].dims.slice(),i=e[1].dims.slice(),[a,n,s]=Ug.getShapeOfGemmResult(r,t.transA,i,t.transB,e.length===3?e[2].dims:void 0),u=[a,n];if(!u)throw new Error("Can't use gemm on the given tensors");let l=16,h=Math.ceil(n/l),p=Math.ceil(a/l),m=!0,g=O.size(u),_=[{type:12,data:m?h:g},{type:12,data:a},{type:12,data:n},{type:12,data:s},{type:1,data:t.alpha},{type:1,data:t.beta}],w=["type","type"];e.length===3&&(_.push(...Y(e[2].dims)),w.push("rank")),_.push(...Y(u));let b=$=>{let v="";t.transA&&t.transB?v="value += a[k * uniforms.M + m] * b[n * uniforms.K + k];":t.transA&&!t.transB?v="value += a[k * uniforms.M + m] * b[k * uniforms.N + n];":!t.transA&&t.transB?v="value += a[m * uniforms.K + k] * b[n * uniforms.K + k];":!t.transA&&!t.transB&&(v="value += a[m * uniforms.K + k] * b[k * uniforms.N + n];");let T=t.alpha===1?"":"value *= uniforms.alpha;",S=B("a",e[0].dataType,e[0].dims),E=B("b",e[1].dataType,e[1].dims),C=S.type.value,A=null,M=[S,E];e.length===3&&(A=B("c",e[2].dataType,e[2].dims.length),M.push(A));let D=K("output",e[0].dataType,u.length);M.push(D);let G=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}];return`
  ${$.registerUniforms(G).declareVariables(...M)}

  ${$.mainStart()}
    ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let m = global_idx / uniforms.N;
    let n = global_idx % uniforms.N;

    var value = ${C}(0);
    for (var k: u32 = 0u; k < uniforms.K; k++) {
      ${v}
    }

    ${T}
    ${A!=null?`let cOffset = ${A.broadcastedIndicesToOffset("vec2(m, n)",D)}; value += ${C}(uniforms.beta) * ${A.getByOffset("cOffset")};`:""}
    output[global_idx] = value;
  }`},k=$=>{let v=B("a",e[0].dataType,e[0].dims),T=B("b",e[1].dataType,e[1].dims),S=null,E=[v,T];e.length===3&&(S=B("c",e[2].dataType,e[2].dims.length),E.push(S));let C=K("output",e[0].dataType,u.length);E.push(C);let A=[{name:"num_tile_n",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}],M="",D="";t.transA&&t.transB?(D=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${v.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${T.type.value}(0);
      }
      `,M="value += tile_a[k][local_id.y] * tile_b[local_id.x][k];"):t.transA&&!t.transB?(D=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${v.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${T.type.value}(0);
      }
      `,M="value += tile_a[k][local_id.y] * tile_b[k][local_id.x];"):!t.transA&&t.transB?(D=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${v.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${T.type.value}(0);
      }
      `,M="value += tile_a[local_id.y][k] * tile_b[local_id.x][k];"):!t.transA&&!t.transB&&(D=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${v.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${T.type.value}(0);
      }
      `,M="value += tile_a[local_id.y][k] * tile_b[k][local_id.x];");let G=t.alpha===1?"":"value *= uniforms.alpha;";return`
  ${$.registerUniforms(A).declareVariables(...E)}
  var<workgroup> tile_a: array<array<${v.type.storage}, ${l}>, ${l}>;
  var<workgroup> tile_b: array<array<${T.type.storage}, ${l}>, ${l}>;
  ${$.mainStart([l,l,1])}
    let tile_col_start = (workgroup_index % uniforms.num_tile_n) * ${l};
    let tile_row_start = (workgroup_index / uniforms.num_tile_n) * ${l};
    let num_tiles = (uniforms.K - 1) / ${l} + 1;
    var k_start = 0u;
    var value = ${C.type.value}(0);
    for (var t: u32 = 0u; t < num_tiles; t++) {
      ${D}
      k_start = k_start + ${l};
      workgroupBarrier();

      for (var k: u32 = 0u; k < ${l}; k++) {
        ${M}
      }
      workgroupBarrier();
    }

    ${G}
    let m = tile_row_start + local_id.y;
    let n = tile_col_start + local_id.x;
    ${S!=null?`let cOffset = ${S.broadcastedIndicesToOffset("vec2(m, n)",C)}; value += ${C.type.value}(uniforms.beta) * ${S.getByOffset("cOffset")};`:""}
    if (m < uniforms.M && n < uniforms.N) {
      output[m * uniforms.N + n] = value;
    }
  }`};return m?{name:"GemmShared",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:w},getRunData:()=>({outputs:[{dims:u,dataType:e[0].dataType}],dispatchGroup:{x:h*p},programUniforms:_}),getShaderSource:k}:{name:"Gemm",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:w},getRunData:()=>({outputs:[{dims:u,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(g/64)},programUniforms:_}),getShaderSource:b}},Dy=e=>{let t=e.transA,r=e.transB,i=e.alpha,a=e.beta;return{transA:t,transB:r,alpha:i,beta:a,cacheKey:`${e.transA};${e.transB};${e.alpha===1}`}},Ly=(e,t)=>{Mm(e.inputs),e.compute(Bm(e.inputs,t))}}),hr,br,ni,ai,Nm,Pm,Dm,Lm,Um,Fm,Wm,Vm,Uy,Fy,M$=F(()=>{se(),fe(),qe(),me(),[hr,br,ni,ai]=[0,1,2,3],Nm=e=>{if(e[0].dims.length!==4)throw new Error("only 4-D tensor is supported.");if(e[0].dims.length!==e[1].dims.length)throw new Error("input dimensions must be equal to grid dimensions");if(e[0].dims.length-2!==e[1].dims[e[1].dims.length-1])throw new Error(`last dimension of grid must be equal to ${e[0].dims.length-2}`);if(e[0].dims[0]!==e[1].dims[0])throw new Error("grid batch size must match input batch size")},Pm=`
  fn gs_get_cubic_coeffs(x: f32) -> vec4<f32> {
    let cubic_alpha = -0.75f;
    let x_abs = abs(x);
    var coeffs: vec4<f32>;
    coeffs[0] = (((cubic_alpha * (x_abs + 1) - 5 * cubic_alpha) * (x_abs + 1) + 8 * cubic_alpha) * (x_abs + 1) - 4 * cubic_alpha);
    coeffs[1] = (((cubic_alpha + 2) * x_abs - (cubic_alpha + 3)) * x_abs * x_abs + 1);
    coeffs[2] = (((cubic_alpha + 2) * (1 - x_abs) - (cubic_alpha + 3)) * (1 - x_abs) * (1 - x_abs) + 1);
    coeffs[3] = (((cubic_alpha * (2 - x_abs) - 5 * cubic_alpha) * (2 - x_abs) + 8 * cubic_alpha) * (2 - x_abs) - 4 * cubic_alpha);
    return coeffs;
  }
`,Dm=e=>`
  fn gs_bicubic_interpolate(p: mat4x4<${e}>, x: f32, y: f32) -> ${e} {
    var v: vec4<f32>;
    var coeffs = gs_get_cubic_coeffs(x);
    for (var i = 0; i < 4; i++) {
      v[i] = coeffs[0] * p[i][0] + coeffs[1] * p[i][1] + coeffs[2] * p[i][2] + coeffs[3] * p[i][3];
    }
    coeffs = gs_get_cubic_coeffs(y);
    let pixel = ${e}(coeffs[0] * v[0] + coeffs[1] * v[1] + coeffs[2] * v[2] + coeffs[3] * v[3]);
    return pixel;
  }
`,Lm=e=>`
  fn gs_denormalize(n: f32, length: i32) -> f32 {
    ${e.alignCorners===0?`
    // alignCorners: false => [-1, 1] to [-0.5, length - 0.5]
    return ((n + 1.0) * f32(length) - 1.0) / 2.0;
    `:`
    // alignCorners: true => [-1, 1] to [0, length - 1]
    return (n + 1.0) / 2.0 * (f32(length - 1));
    `}
  }
`,Um=e=>`
  ${e.paddingMode==="reflection"?`
      fn gs_reflect(x: i32, x_min: f32, x_max: f32) -> u32 {
        var dx = 0.0;
        var fx = f32(x);
        let range = x_max - x_min;
        if (fx < x_min) {
          dx = x_min - fx;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_min + r;
          } else {
            fx = x_max - r;
          }
        } else if (fx > x_max) {
          dx = fx - x_max;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_max - r;
          } else {
            fx = x_min + r;
          }
        }
        return u32(fx);
      }`:""}
`,Fm=(e,t,r)=>`
  fn pixel_at_grid(r: i32, c: i32, H: i32, W: i32, batch: u32, channel: u32, border: vec4<f32>) -> ${t} {
     var pixel = ${t}(0);
     var indices = vec4<u32>(0);
     indices[${hr}] = batch;
     indices[${br}] = channel;`+(()=>{switch(r.paddingMode){case"zeros":return`
          if (r >= 0 && r < H && c >=0 && c < W) {
            indices[${ni}] = u32(r);
            indices[${ai}] = u32(c);
          }
        `;case"border":return`
          indices[${ni}] = u32(clamp(r, 0, H - 1));
          indices[${ai}] = u32(clamp(c, 0, W - 1));
        `;case"reflection":return`
          indices[${ni}] = gs_reflect(r, border[1], border[3]);
          indices[${ai}] = gs_reflect(c, border[0], border[2]);
        `;default:throw new Error(`padding mode ${r.paddingMode} is not supported`)}})()+`
    return ${e.getByIndices("indices")};
  }
`,Wm=(e,t,r)=>(()=>{switch(r.mode){case"nearest":return`
          let result = pixel_at_grid(i32(round(y)), i32(round(x)), H_in, W_in, indices[${hr}], indices[${br}], border);
        `;case"bilinear":return`
          let x1 = i32(floor(x));
          let y1 = i32(floor(y));
          let x2 = x1 + 1;
          let y2 = y1 + 1;

          let p11 = pixel_at_grid(y1, x1, H_in, W_in, indices[${hr}], indices[${br}], border);
          let p12 = pixel_at_grid(y1, x2, H_in, W_in, indices[${hr}], indices[${br}], border);
          let p21 = pixel_at_grid(y2, x1, H_in, W_in, indices[${hr}], indices[${br}], border);
          let p22 = pixel_at_grid(y2, x2, H_in, W_in, indices[${hr}], indices[${br}], border);

          let dx2 = ${t}(f32(x2) - x);
          let dx1 = ${t}(x - f32(x1));
          let dy2 = ${t}(f32(y2) - y);
          let dy1 = ${t}(y - f32(y1));
          let result = dy2 * (dx2 * p11 + dx1 * p12) + dy1 * (dx2 * p21 + dx1 * p22);
        `;case"bicubic":return`
          let x0 = i32(floor(x)) - 1;
          let y0 = i32(floor(y)) - 1;
          var p: mat4x4<${t}>;
          for (var h = 0; h < 4; h++) {
            for (var w = 0; w < 4; w++) {
              p[h][w] = pixel_at_grid(h + y0, w + x0, H_in, W_in, indices[${hr}], indices[${br}], border);
            }
          }

          let dx = x - f32(x0 + 1);
          let dy = y - f32(y0 + 1);
          let result = gs_bicubic_interpolate(p, dx, dy);
        `;default:throw new Error(`mode ${r.mode} is not supported`)}})()+`${e.setByOffset("global_idx","result")}`,Vm=(e,t)=>{let r=B("x",e[0].dataType,e[0].dims.length),i=[e[1].dims[0],e[1].dims[1],e[1].dims[2]],a=B("grid",e[1].dataType,i.length,2),n=[e[0].dims[0],e[0].dims[1],e[1].dims[1],e[1].dims[2]];t.format==="NHWC"&&(n=[e[0].dims[0],e[1].dims[1],e[1].dims[2],e[0].dims[3]],[hr,br,ni,ai]=[0,3,1,2]);let s=K("output",e[0].dataType,n.length),u=r.type.value,l=O.size(n),h=[{type:12,data:l},...Y(e[0].dims,i,n)],p=m=>`
  ${m.registerUniform("output_size","u32").declareVariables(r,a,s)}
  ${Pm}
  ${Dm(u)}
  ${Lm(t)}
  ${Um(t)}
  ${Fm(r,u,t)}

  ${m.mainStart()}
    ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let H_in = i32(uniforms.x_shape[${ni}]);
      let W_in = i32(uniforms.x_shape[${ai}]);

      ${t.alignCorners===0?`
      let x_min = -0.5;
      let x_max = f32(W_in) - 0.5;
      let y_min = -0.5;
      let y_max = f32(H_in) - 0.5;
      `:`
      let x_min = 0.0;
      let x_max = f32(W_in) - 1.0;
      let y_min = 0.0;
      let y_max = f32(H_in) - 1.0;
      `};
      let border = vec4<f32>(x_min, y_min, x_max, y_max);

      let indices = ${s.offsetToIndices("global_idx")};
      var grid_indices = vec3<u32>(indices[${hr}], indices[${ni}], indices[${ai}]);
      let nxy = ${a.getByIndices("grid_indices")};
      var x = gs_denormalize(f32(nxy[0]), W_in);
      var y = gs_denormalize(f32(nxy[1]), H_in);

      ${Wm(s,u,t)}
  }`;return{name:"GridSample",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:["type","type"]},getRunData:m=>{let g=O.size(n);return{outputs:[{dims:n,dataType:m[0].dataType}],dispatchGroup:{x:Math.ceil(g/64)},programUniforms:h}},getShaderSource:p}},Uy=(e,t)=>{Nm(e.inputs),e.compute(Vm(e.inputs,t))},Fy=e=>Ce({alignCorners:e.align_corners,mode:e.mode,paddingMode:e.padding_mode,format:e.format})}),ht,Gm,Wy,Mo,jm,In,Vy,Gy=F(()=>{se(),fe(),qe(),Jl(),rd(),me(),Zr(),ht=(e,t)=>e.length>t&&e[t].dims.length>0?e[t]:void 0,Gm=(e,t)=>{let r=e[0],i=ht(e,1),a=ht(e,2),n=ht(e,3),s=ht(e,4),u=ht(e,5),l=ht(e,6),h=ht(e,7);if(r.dims.length!==3&&r.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let p=r.dims[0],m=r.dims[1],g=r.dims.length===3?r.dims[2]:t.numHeads*r.dims[4],_=m,w=0,b=0,k=Math.floor(g/t.numHeads);if(l&&h&&O.size(l.dims)&&O.size(h.dims)){if(l.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(l.dims[0]!==p||l.dims[1]!==t.numHeads||l.dims[3]!==k)throw new Error('Input "past_key" shape (batch_size, num_heads, past_sequence_length, head_size)');if(h.dims[0]!==p||h.dims[1]!==t.numHeads||h.dims[3]!==k)throw new Error('Input "past_value" shape (batch_size, num_heads, past_sequence_length, head_size)');if(l.dims[2]!==h.dims[2])throw new Error('Input "past_key" and "past_value" shall have same dim 2 (past_sequence_length)');if(h.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');w=l.dims[2],b=l.dims[2]}else if(l&&O.size(l.dims)||h&&O.size(h.dims))throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let $;if(i&&O.size(i.dims)>0){if(r.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(i.dims.length<3||i.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(r.dims[0]!==i.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(i.dims.length===3){if(i.dims[2]!==r.dims[2])throw new Error('Input "query" and "key" shall have same dim 2 (hidden_size)');$=2,_=i.dims[1]}else if(i.dims.length===5){if(i.dims[2]!==t.numHeads||i.dims[3]!==2||i.dims[4]!==k)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(a)throw new Error('Expect "value" be none when "key" has packed kv format.');$=5,_=i.dims[1]}else{if(i.dims[1]!==t.numHeads||i.dims[3]!==k)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');$=0,_=i.dims[2]}}else{if(r.dims.length!==5)throw new Error('Input "query" is expected to have 5 dimensions when key is empty');if(r.dims[2]!==t.numHeads||r.dims[3]!==3)throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');$=3}if(n&&O.size(n.dims)>0){if(n.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimension');if(i&&i.dims.length===5&&i.dims[3]===2)throw new Error("bias is not allowed for packed kv.")}let v=w+_,T=0;if(s&&O.size(s.dims)>0){T=8;let A=s.dims;throw A.length===1?A[0]===p?T=1:A[0]===3*p+2&&(T=3):A.length===2&&A[0]===p&&A[1]===v&&(T=5),T===8?new Error('Input "key_padding_mask" shape shall be (batch_size) or (batch_size, total_sequence_length)'):new Error("Mask not supported")}let S=!1,E=g;if(a&&O.size(a.dims)>0){if(a.dims.length!==3&&a.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(r.dims[0]!==a.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(a.dims.length===3){if(_!==a.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');E=a.dims[2]}else{if(_!==a.dims[2])throw new Error('Input "key" and "value" shall have the same dim 2 (kv_sequence_length)');E=a.dims[1]*a.dims[3],S=!0}}let C=!1;if(s&&O.size(s.dims)>0)throw new Error("Key padding mask is not supported");if(u&&O.size(u.dims)>0){if(u.dims.length!==4)throw new Error('Input "attention_bias" is expected to have 4 dimensions');if(u.dims[0]!==p||u.dims[1]!==t.numHeads||u.dims[2]!==m||u.dims[3]!==v)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:p,sequenceLength:m,pastSequenceLength:w,kvSequenceLength:_,totalSequenceLength:v,maxSequenceLength:b,inputHiddenSize:0,hiddenSize:g,vHiddenSize:E,headSize:k,vHeadSize:Math.floor(E/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:T,scale:t.scale,broadcastResPosBias:C,passPastInKv:S,qkvFormat:$}},Wy=e=>Ce({...e}),Mo=Ce({perm:[0,2,1,3]}),jm=(e,t,r,i,a,n,s)=>{let u=[i,a,n],l=O.size(u),h=[{type:12,data:l},{type:12,data:s},{type:12,data:n}],p=m=>{let g=K("qkv_with_bias",t.dataType,u),_=B("qkv",t.dataType,u),w=B("bias",r.dataType,u),b=[{name:"output_size",type:"u32"},{name:"bias_offset",type:"u32"},{name:"hidden_size",type:"u32"}];return`
  ${m.registerUniforms(b).declareVariables(_,w,g)}
  ${m.mainStart()}
    ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let bias_offset_idx = (global_idx % uniforms.hidden_size) + uniforms.bias_offset;

    qkv_with_bias[global_idx] = qkv[global_idx] + bias[bias_offset_idx];
  }`};return e.compute({name:"MultiHeadAttentionAddBias",shaderCache:{inputDependencies:["type","type"]},getRunData:()=>({outputs:[{dims:u,dataType:t.dataType,gpuDataType:0}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:h}),getShaderSource:p},{inputs:[t,r],outputs:[-1]})[0]},In=(e,t,r,i,a,n,s,u)=>{let l=n;if(s&&O.size(s.dims)>0){if(i===1)throw new Error("AddBiasReshape is not implemented. Please export your model with packed QKV or KV");return l=jm(e,n,s,t,i,r*a,u),l=l.reshape([t,i,r,a]),r===1||i===1?l:e.compute(It(l,Mo.perm),{inputs:[l],outputs:[-1]})[0]}else return n.dims.length===3&&(l=n.reshape([t,i,r,a])),r===1||i===1?l:e.compute(It(l,Mo.perm),{inputs:[l],outputs:[-1]})[0]},Vy=(e,t)=>{let r=Gm(e.inputs,t),i=e.inputs[0],a=ht(e.inputs,1),n=ht(e.inputs,2),s=ht(e.inputs,3),u=ht(e.inputs,4),l=ht(e.inputs,5),h=ht(e.inputs,6),p=ht(e.inputs,7);if(i.dims.length===5)throw new Error("Packed QKV is not implemented");if((a==null?void 0:a.dims.length)===5)throw new Error("Packed KV is not implemented");let m=a&&n&&a.dims.length===4&&n.dims.length===4,g=In(e,r.batchSize,r.numHeads,r.sequenceLength,r.headSize,i,s,0);if(m)return Pn(e,g,a,n,u,void 0,h,p,l,r);if(!a||!n)throw new Error("key and value must be provided");let _=In(e,r.batchSize,r.numHeads,r.kvSequenceLength,r.headSize,a,s,r.hiddenSize),w=In(e,r.batchSize,r.numHeads,r.kvSequenceLength,r.vHeadSize,n,s,2*r.hiddenSize);Pn(e,g,_,w,u,void 0,h,p,l,r)}}),qm,Hm,Km,Xm,zu,jy,qy,Hy=F(()=>{se(),fe(),qe(),me(),qm=e=>{if(!e||e.length<1)throw new Error("too few inputs")},Hm=(e,t)=>{let r=[],i=t.numOutputs;return e[1].dims[0]>0&&(e[1].getBigInt64Array().forEach(a=>r.push(Number(a))),i=r.length),Ce({numOutputs:i,axis:t.axis,splitSizes:r})},Km=e=>`
fn calculateOutputIndex(index: u32) -> u32 {
    for (var i: u32 = 0u; i < ${e}u; i += 1u ) {
    if (index < ${X("uniforms.size_in_split_axis","i",e)}) {
        return i;
    }
    }
    return ${e}u;
}`,Xm=e=>{let t=e.length,r=[];for(let i=0;i<t;++i){let a=e[i].setByIndices("indices","input[global_idx]");t===1?r.push(a):i===0?r.push(`if (output_number == ${i}u) { ${a} }`):i===t-1?r.push(`else { ${a} }`):r.push(`else if (output_number == ${i}) { ${a} }`)}return`
      fn writeBufferData(output_number: u32, indices: ${e[0].type.indices}, global_idx: u32) {
        ${r.join(`
`)}
      }`},zu=(e,t)=>{let r=e[0].dims,i=O.size(r),a=e[0].dataType,n=O.normalizeAxis(t.axis,r.length),s=new Array(t.numOutputs),u=B("input",a,r.length),l=new Array(t.numOutputs),h=[],p=[],m=0,g=[{type:12,data:i}];for(let w=0;w<t.numOutputs;w++){m+=t.splitSizes[w],l[w]=m;let b=r.slice();b[n]=t.splitSizes[w],p.push(b),s[w]=K(`output${w}`,a,b.length),h.push({dims:p[w],dataType:e[0].dataType})}g.push({type:12,data:l},...Y(r,...p));let _=w=>`
  ${w.registerUniform("input_size","u32").registerUniform("size_in_split_axis","u32",l.length).declareVariables(u,...s)}
  ${Km(l.length)}
  ${Xm(s)}

  ${w.mainStart()}
    ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.input_size")}

    var indices = ${u.offsetToIndices("global_idx")};
    var index = ${u.indicesGet("indices",n)};
    let output_number = calculateOutputIndex(index);
    if (output_number != 0) {
      index -= ${X("uniforms.size_in_split_axis","output_number - 1u",l.length)};
      ${u.indicesSet("indices",n,"index")};
    }
    writeBufferData(output_number, indices, global_idx);
  }`;return{name:"Split",shaderCache:{hint:t.cacheKey,inputDependencies:["rank"]},getShaderSource:_,getRunData:()=>({outputs:h,dispatchGroup:{x:Math.ceil(i/64)},programUniforms:g})}},jy=(e,t)=>{qm(e.inputs);let r=e.inputs.length===1?t:Hm(e.inputs,t);e.compute(zu(e.inputs,r),{inputs:[0]})},qy=e=>{let t=e.axis,r=e.splitSizes,i=e.numOutputs<0?r.length:e.numOutputs;if(i!==r.length)throw new Error("numOutputs and splitSizes lengh must be equal");return Ce({axis:t,numOutputs:i,splitSizes:r})}}),Ym,Qm,Bo,Ky,B$=F(()=>{qe(),rd(),Gy(),Hy(),Zr(),Ym=(e,t)=>{if(t.doRotary)throw new Error("GroupQuerryAttention do_rotary attribute is not supported");if(t.doRotary&&e.length<=7)throw new Error("cos_cache and sin_cache inputs are required if do_rotary is specified");let r=e[0],i=e[1],a=e[2],n=e[3],s=e[4];if(t.localWindowSize!==-1)throw new Error("Local attention is not supported");if(t.softcap!==0)throw new Error("Softcap is not supported");if(t.rotaryInterleaved!==0)throw new Error("Rotary interleaved is not supported");if(t.smoothSoftmax)throw new Error("Smooth softmax is not supported");if(r.dims.length!==3&&r.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let u=!1,l=r.dims[0],h=r.dims[1],p=r.dims.length===3?u?r.dims[2]/3:r.dims[2]:t.numHeads*r.dims[4],m=h,g=0,_=!i||i.dims.length===0,w=Math.floor(_?p/(t.numHeads+2*t.kvNumHeads):p/t.numHeads);_&&(p=w*t.numHeads);let b=n&&n.dims.length!==0,k=s&&s.dims.length!==0;if(b&&n.dims.length===4&&n.dims[0]===l&&n.dims[1]!==t.kvNumHeads&&n.dims[2]===t.kvNumHeads&&n.dims[3]===w)throw new Error("BSNH pastKey/pastValue is not supported");if(b&&k){if(n.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(s.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');g=n.dims[2]}else if(b||k)throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let $=1;if(i&&i.dims.length>0){if(r.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(i.dims.length<3||i.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(r.dims[0]!==i.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(i.dims.length===3){if(r.dims[2]%i.dims[2]!==0)throw new Error('Dimension 2 of "query" should be a multiple of "key"');m=i.dims[1]}else if(i.dims.length===5){if(i.dims[2]!==t.numHeads||i.dims[3]!==2||i.dims[4]!==w)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(a)throw new Error('Expect "value" be none when "key" has packed kv format.');m=i.dims[1]}else{if(i.dims[1]!==t.numHeads||i.dims[3]!==w)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');m=i.dims[2]}}else{if(r.dims.length!==3&&r.dims.length!==5)throw new Error('Input "query" is expected to have 3 or 5 dimensions when key is empty');if(r.dims.length===5&&(r.dims[2]!==t.numHeads||r.dims[3]!==3))throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');$=3}let v=0,T=!1,S=t.kvNumHeads?w*t.kvNumHeads:p;if(a&&a.dims.length>0){if(a.dims.length!==3&&a.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(r.dims[0]!==a.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(a.dims.length===3){if(m!==a.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');S=a.dims[2]}else{if(m!==a.dims[2])throw new Error('Input "past_key" and "past_value" shall have the same dim 2 (kv_sequence_length)');S=a.dims[1]*a.dims[3],T=!0}}let E=e.length>4?e[5]:void 0;if(E&&E.dims.length!==1&&E.dims[0]!==l)throw new Error('Input "seqlens" is expected to have 1 dimension and the same dim 0 as batch_size');return{batchSize:l,sequenceLength:h,pastSequenceLength:g,kvSequenceLength:m,totalSequenceLength:-1,maxSequenceLength:-1,inputHiddenSize:0,hiddenSize:p,vHiddenSize:S,headSize:w,vHeadSize:Math.floor(S/t.kvNumHeads),numHeads:t.numHeads,kvNumHeads:t.kvNumHeads,nReps:t.numHeads/t.kvNumHeads,pastPresentShareBuffer:!1,maskType:v,scale:t.scale,broadcastResPosBias:!1,passPastInKv:T,qkvFormat:$}},Qm=Ce({perm:[0,2,1,3]}),Bo=(e,t,r)=>{let i=t,a=r.kvNumHeads;return t.dims.length===3&&r.kvSequenceLength!==0&&(i=t.reshape([r.batchSize,r.kvSequenceLength,a,r.headSize]),i=e.compute(It(i,Qm.perm),{inputs:[i],outputs:[-1]})[0]),i},Ky=(e,t)=>{var k;let r=Ym(e.inputs,t);if(e.inputs[0].dims.length===5)throw new Error("Packed QKV is not implemented");if(((k=e.inputs[1])==null?void 0:k.dims.length)===5)throw new Error("Packed KV is not implemented");let i=e.inputs[0],a=e.inputs[1]&&e.inputs[1].dims.length>0?e.inputs[1]:void 0,n=e.inputs[2]&&e.inputs[2].dims.length>0?e.inputs[2]:void 0,s=e.inputs[3]&&e.inputs[3].dims.length!==0?e.inputs[3]:void 0,u=e.inputs[4]&&e.inputs[4].dims.length!==0?e.inputs[4]:void 0,l=e.inputs.length>4?e.inputs[5]:void 0,h=e.inputs.length>5?e.inputs[6]:void 0,p=r.kvNumHeads?r.kvNumHeads:r.numHeads,m=Ce({axis:2,numOutputs:3,splitSizes:[r.numHeads*r.headSize,p*r.headSize,p*r.headSize]}),[g,_,w]=!a&&!n?e.compute(zu([i],m),{inputs:[i],outputs:[-1,-1,-1]}):[i,a,n],b=In(e,r.batchSize,r.numHeads,r.sequenceLength,r.headSize,g,void 0,0);Pn(e,b,Bo(e,_,r),Bo(e,w,r),void 0,void 0,s,u,void 0,r,l,h)}}),No,Zm,Jm,Xy,N$=F(()=>{se(),fe(),Zr(),me(),No=(e,t,r,i,a,n,s,u)=>{let l=We(n),h=l===1?"f32":`vec${l}f`,p=l===1?"vec2f":`mat2x${l}f`,m=a*s,g=64;m===1&&(g=256);let _=[a,s,n/l],w=[a,s,2],b=["rank","type","type"],k=[];k.push(...Y(_,w));let $=v=>{let T=B("x",t.dataType,3,l),S=B("scale",r.dataType,r.dims),E=B("bias",i.dataType,i.dims),C=K("output",1,3,2),A=[T,S,E,C];return`
  var<workgroup> workgroup_shared : array<${p}, ${g}>;
  const workgroup_size = ${g}u;
  ${v.declareVariables(...A)}
  ${v.mainStart(g)}
    let batch = workgroup_index / uniforms.x_shape[1];
    let channel = workgroup_index % uniforms.x_shape[1];
    let hight = uniforms.x_shape[2];
    // initialize workgroup memory
    var sum = ${h}(0);
    var squared_sum = ${h}(0);
    for (var h = local_idx; h < hight; h += workgroup_size) {
      let value = ${h}(${T.get("batch","channel","h")});
      sum += value;
      squared_sum += value * value;
    }
    workgroup_shared[local_idx] = ${p}(sum, squared_sum);
    workgroupBarrier();

    for (var currSize = workgroup_size >> 1;  currSize > 0; currSize = currSize >> 1) {
      if (local_idx < currSize) {
        workgroup_shared[local_idx] = workgroup_shared[local_idx] + workgroup_shared[local_idx + currSize];
      }
      workgroupBarrier();
    }
    if (local_idx == 0) {
      let sum_final = ${Kr("workgroup_shared[0][0]",l)} / f32(hight * ${l});
      let squared_sum_final = ${Kr("workgroup_shared[0][1]",l)} / f32(hight * ${l});

      let inv_std_dev = inverseSqrt(squared_sum_final - sum_final * sum_final + f32(${u}));
      let channel_scale = inv_std_dev * f32(scale[channel]);
      let channel_shift = f32(bias[channel]) - sum_final * channel_scale;
      output[workgroup_index] = vec2f(channel_scale, channel_shift);
    }
  }`};return e.compute({name:"InstanceNormComputeChannelScaleShift",shaderCache:{hint:`${l};${u};${g}`,inputDependencies:b},getRunData:()=>({outputs:[{dims:w,dataType:1}],dispatchGroup:{x:m},programUniforms:k}),getShaderSource:$},{inputs:[t,r,i],outputs:[-1]})[0]},Zm=(e,t,r)=>{let i=t[0].dims,a=i,n=2,s=i[0],u=i[1],l=O.sizeFromDimension(i,n),h=We(l),p=O.size(a)/h,m=No(e,t[0],t[1],t[2],s,l,u,r.epsilon),g=[s,u,l/h],_=[s,u],w=["type","none"],b=k=>{let $=B("x",t[0].dataType,g.length,h),v=B("scale_shift",1,_.length,2),T=K("output",t[0].dataType,g.length,h),S=[$,v,T];return`
  ${k.registerUniform("output_size","u32").declareVariables(...S)}
  ${k.mainStart()}
  ${k.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let outputIndices = ${T.offsetToIndices("global_idx")};
      let batch = outputIndices[0];
      let channel = outputIndices[1];
      let scale_shift = ${v.getByIndices("vec2<u32>(batch, channel)")};
      let value = ${$.getByOffset("global_idx")} * ${T.type.value}(scale_shift.x) + ${T.type.value}(scale_shift.y);
      ${T.setByOffset("global_idx","value")};
  }`};e.compute({name:"InstanceNormalization",shaderCache:{hint:`${h}`,inputDependencies:w},getRunData:()=>({outputs:[{dims:a,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(p/64)},programUniforms:[{type:12,data:p},...Y(g,_,g)]}),getShaderSource:b},{inputs:[t[0],m]})},Jm=(e,t,r)=>{let i=t[0].dims,a=i,n=i[0],s=i[i.length-1],u=O.sizeFromDimension(i,1)/s,l=We(s),h=O.size(a)/l,p=[{type:12,data:u},{type:12,data:Math.floor(s/l)}],m=["type","type"],g=!1,_=[0,i.length-1];for(let $=0;$<i.length-2;$++)g=g||i[$+1]!==1,_.push($+1);g=g&&i[i.length-1]!==1;let w=g?e.compute(It(e.inputs[0],_),{inputs:[e.inputs[0]],outputs:[-1]})[0]:e.inputs[0].reshape(Array.from({length:i.length},($,v)=>i[_[v]])),b=No(e,w,t[1],t[2],n,u,s,r.epsilon),k=$=>{let v=nt(t[0].dataType),T=l===1?"vec2f":`mat${l}x2f`,S=A=>{let M=A===0?"x":"y",D=l===1?"f32":`vec${l}f`;switch(l){case 1:return`${v}(${D}(scale.${M}))`;case 2:return`vec2<${v}>(${D}(scale[0].${M}, scale[1].${M}))`;case 4:return`vec4<${v}>(${D}(scale[0].${M}, scale[1].${M}, scale[2].${M}, scale[3].${M}))`;default:throw new Error(`Not supported compoents ${l}`)}},E=B("input",t[0].dataType,t[0].dims,l),C=K("output",t[0].dataType,a,l);return`
  @group(0) @binding(0) var<storage, read> input : array<${E.type.storage}>;
  @group(0) @binding(1) var<storage, read> scale_input : array<${T}>;
  @group(0) @binding(2) var<storage, read_write> output : array<${C.type.storage}>;
  struct Uniforms {H: u32, C : u32};
  @group(0) @binding(3) var<uniform> uniforms: Uniforms;

  ${$.mainStart()}
    let current_image_number = global_idx / (uniforms.C * uniforms.H);
    let current_channel_number = global_idx % uniforms.C;

    let scale_offset = current_image_number * uniforms.C + current_channel_number;
    let scale = scale_input[scale_offset];
    output[global_idx] = fma(input[global_idx], ${S(0)}, ${S(1)});
  }`};e.compute({name:"InstanceNormalizationNHWC",shaderCache:{hint:`${l}`,inputDependencies:m},getRunData:()=>({outputs:[{dims:a,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:p}),getShaderSource:k},{inputs:[t[0],b]})},Xy=(e,t)=>{t.format==="NHWC"?Jm(e,e.inputs,t):Zm(e,e.inputs,t)}}),e1,t1,Yy,P$=F(()=>{se(),fe(),me(),e1=e=>{if(!e||e.length<2)throw new Error("layerNorm requires at least 2 inputs.")},t1=(e,t,r)=>{let i=t.simplified,a=e[0].dims,n=e[1],s=!i&&e[2],u=a,l=O.normalizeAxis(t.axis,a.length),h=O.sizeToDimension(a,l),p=O.sizeFromDimension(a,l),m=O.size(n.dims),g=s?O.size(s.dims):0;if(m!==p||s&&g!==p)throw new Error(`Size of X.shape()[axis:] == ${p}.
       Size of scale and bias (if provided) must match this.
       Got scale size of ${m} and bias size of ${g}`);let _=[];for(let E=0;E<a.length;++E)E<l?_.push(a[E]):_.push(1);let w=We(p),b=["type","type"],k=[{type:12,data:h},{type:1,data:p},{type:12,data:Math.floor(p/w)},{type:1,data:t.epsilon}];s&&b.push("type");let $=r>1,v=r>2,T=E=>{let C=nt(e[0].dataType),A=[B("x",e[0].dataType,e[0].dims,w),B("scale",n.dataType,n.dims,w)];s&&A.push(B("bias",s.dataType,s.dims,w)),A.push(K("output",e[0].dataType,u,w)),$&&A.push(K("mean_data_output",1,_)),v&&A.push(K("inv_std_output",1,_));let M=[{name:"norm_count",type:"u32"},{name:"norm_size",type:"f32"},{name:"norm_size_vectorized",type:"u32"},{name:"epsilon",type:"f32"}];return`
  ${E.registerUniforms(M).declareVariables(...A)}
  ${E.mainStart()}
    ${E.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.norm_count")}
    let offset = global_idx * uniforms.norm_size_vectorized;
    var mean_vector = ${$u("f32",w)};
    var mean_square_vector = ${$u("f32",w)};

    for (var h: u32 = 0u; h < uniforms.norm_size_vectorized; h++) {
      let value = ${zi(C,w,"x[h + offset]")};
      mean_vector += value;
      mean_square_vector += value * value;
    }
    let mean = ${Kr("mean_vector",w)} / uniforms.norm_size;
    let inv_std_dev = inverseSqrt(${Kr("mean_square_vector",w)} / uniforms.norm_size ${i?"":"- mean * mean"} + uniforms.epsilon);

    for (var j: u32 = 0; j < uniforms.norm_size_vectorized; j++) {
      let f32input = ${zi(C,w,"x[j + offset]")};
      let f32scale = ${zi(C,w,"scale[j]")};
      output[j + offset] = ${A[0].type.value}((f32input ${i?"":"- mean"}) * inv_std_dev * f32scale
        ${s?`+ ${zi(C,w,"bias[j]")}`:""}
      );
    }

    ${$?"mean_data_output[global_idx] = mean":""};
    ${v?"inv_std_output[global_idx] = inv_std_dev":""};
  }`},S=[{dims:u,dataType:e[0].dataType}];return $&&S.push({dims:_,dataType:1}),v&&S.push({dims:_,dataType:1}),{name:"LayerNormalization",shaderCache:{hint:`${w};${r};${i}`,inputDependencies:b},getRunData:()=>({outputs:S,dispatchGroup:{x:Math.ceil(h/64)},programUniforms:k}),getShaderSource:T}},Yy=(e,t)=>{e1(e.inputs),e.compute(t1(e.inputs,t,e.outputCount))}}),r1,Qy,D$=F(()=>{fe(),od(),ud(),r1=e=>{if(!e||e.length!==2)throw new Error("MatMul requires 2 inputs.");if(e[0].dims[e[0].dims.length-1]!==e[1].dims[e[1].dims.length-2])throw new Error("shared dimension does not match.")},Qy=e=>{r1(e.inputs);let t=Hi.calcShape(e.inputs[0].dims,e.inputs[1].dims,!0);if(!t)throw new Error("Can't use matmul on the given tensors");let r=t[t.length-1],i=e.inputs[0].dims[e.inputs[0].dims.length-1];if(r<8&&i<8)e.compute(sd(e.inputs,{activation:""},t));else{let a=t[t.length-2],n=O.size(e.inputs[0].dims.slice(0,-2)),s=O.size(e.inputs[1].dims.slice(0,-2));if(n!==1&&a===1&&s===1){let u=e.inputs[0].reshape([1,n,i]),l=e.inputs[1].reshape([1,i,r]),h=[1,n,r],p=[u,l];e.compute(qa(p,{activation:""},t,h),{inputs:p})}else e.compute(qa(e.inputs,{activation:""},t))}}}),i1,n1,a1,Zy,Jy,L$=F(()=>{se(),fe(),qe(),me(),i1=(e,t)=>{if(e.length<3||e.length>4)throw new Error("MatMulNBits requires 3 or 4 inputs");let r=e[0],i=r.dims.length;if(r.dims[i-1]!==t.k)throw new Error("The last dim of input shape does not match the k value");let a=Math.floor((t.k+t.blockSize-1)/t.blockSize),n=t.blockSize/8*t.bits,s=e[1];if(!O.areEqual(s.dims,[t.n,a,n]))throw new Error("The second inputs must be 3D tensor with shape N X nBlocksPerCol X blobSize");let u=e[2].dims;if(O.size(u)!==t.n*a)throw new Error("scales input size error.");if(e.length===4){let l=e[3].dims,h=t.bits>4?t.n*a:t.n*Math.floor((a+1)/2);if(O.size(l)!==h)throw new Error("zeroPoints input size error.")}},n1=(e,t)=>{let r=e[0].dims,i=r.length,a=r[i-2],n=t.k,s=t.n,u=r.slice(0,i-2),l=O.size(u),h=e[1].dims[2]/4,p=e[0].dataType,m=We(t.k),g=We(h),_=We(s),w=u.concat([a,s]),b=a>1&&s/_%2===0?2:1,k=O.size(w)/_/b,$=64,v=[],T=[l,a,n/m],S=O.convertShape(e[1].dims).slice();S.splice(-1,1,h/g),v.push(...Y(T)),v.push(...Y(S)),v.push(...Y(e[2].dims)),e.length===4&&v.push(...Y(O.convertShape(e[3].dims)));let E=[l,a,s/_];v.push(...Y(E));let C=A=>{let M=T.length,D=B("a",e[0].dataType,M,m),G=B("b",12,S.length,g),oe=B("scales",e[2].dataType,e[2].dims.length),he=[D,G,oe],Z=e.length===4?B("zero_points",12,e[3].dims.length):void 0;Z&&he.push(Z);let ue=E.length,ne=K("output",e[0].dataType,ue,_),V=nt(e[0].dataType),ye=(()=>{switch(m){case 1:return`array<${V}, 8>`;case 2:return`mat4x2<${V}>`;case 4:return`mat2x4<${V}>`;default:throw new Error(`${m}-component is not supported.`)}})(),Te=()=>{let N=`
          // reuse a data
            var input_offset = ${D.indicesToOffset(`${D.type.indices}(batch, row, word_offset)`)};
            var a_data: ${ye};
            for (var j: u32 = 0; j < ${8/m}; j++) {
              a_data[j] = ${D.getByOffset("input_offset")};
              input_offset++;
            }
          `;for(let W=0;W<_*b;W++)N+=`
            b_value = ${g===1?`b${W}_data`:`b${W}_data[i]`};
            b_value_lower = unpack4xU8(b_value & b_mask);
            b_value_upper = unpack4xU8((b_value >> 4) & b_mask);
            b_quantized_values = ${ye}(${Array.from({length:4},(ge,Be)=>`${V}(b_value_lower[${Be}]), ${V}(b_value_upper[${Be}])`).join(", ")});
            b_dequantized_values = ${m===1?`${ye}(${Array.from({length:8},(ge,Be)=>`(b_quantized_values[${Be}] - ${Z?`zero_point${W}`:"zero_point"}) * scale${W}`).join(", ")});`:`(b_quantized_values - ${ye}(${Array(8).fill(`${Z?`zero_point${W}`:"zero_point"}`).join(",")})) * scale${W};`};
            workgroup_shared[local_id.x * ${b} + ${Math.floor(W/_)}]${_>1?`[${W%_}]`:""} += ${Array.from({length:8/m},(ge,Be)=>`${m===1?`a_data[${Be}] * b_dequantized_values[${Be}]`:`dot(a_data[${Be}], b_dequantized_values[${Be}])`}`).join(" + ")};
          `;return N},q=()=>{let N=`
            var col_index = col * ${_};
            ${Z?`
            let zero_point_bytes_per_col = (nBlocksPerCol + 1) / 2;
            var zero_point_byte_count: u32;
            var zero_point_word_index: u32;
            var zero_point_byte_offset: u32;
            let zero_point_nibble_offset: u32 = block & 0x1u;
            var zero_point_bits_offset: u32;
            var zero_point_word: u32;`:`
            // The default zero point is 8 for unsigned 4-bit quantization.
            let zero_point = ${V}(8);`}
            `;for(let W=0;W<_*b;W++)N+=`
            let scale${W} = ${oe.getByOffset("col_index * nBlocksPerCol + block")};
            ${Z?`
            zero_point_byte_count = col_index * zero_point_bytes_per_col + (block >> 0x1u);
            zero_point_word_index = zero_point_byte_count >> 0x2u;
            zero_point_byte_offset = zero_point_byte_count & 0x3u;
            zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_nibble_offset << 2);
            zero_point_word = ${Z.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point${W} = ${V}((zero_point_word) & 0xFu);`:""}
            col_index += 1;`;return N},Ee=()=>{let N=`col_index = col * ${_};`;for(let W=0;W<_*b;W++)N+=`
            let b${W}_data = ${G.getByIndices(`${G.type.indices}(col_index, block, word)`)};
            col_index += 1;`;return N+=`
            var b_value: u32;
            let b_mask: u32 = 0x0F0F0F0Fu;
            var b_value_lower: vec4<u32>;
            var b_value_upper: vec4<u32>;
            var b_quantized_values: ${ye};
            var b_dequantized_values: ${ye};`,N};return`
        var<workgroup> workgroup_shared: array<${ne.type.value}, ${b*$}>;
        ${A.declareVariables(...he,ne)}
        ${A.mainStart([$,1,1])}
          let output_indices = ${ne.offsetToIndices(`(global_idx / ${$}) * ${b}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let nBlocksPerCol = uniforms.b_shape[1];

          for (var block = local_id.x; block < nBlocksPerCol; block += ${$}) {
            //process one block
            var word_offset: u32 = block * ${t.blockSize/m};
            ${q()}
            for (var word: u32 = 0; word < ${h}; word += ${g}) {
              ${Ee()}
              for (var i: u32 = 0; i < ${g}; i++) {
                ${Te()}
                word_offset += ${8/m};
              }
            }
          }
          workgroupBarrier();

          if (local_id.x < ${b}) {
            var output_value: ${ne.type.value} = ${ne.type.value}(0);
            var workgroup_shared_offset: u32 = local_id.x;
            for (var b: u32 = 0u; b < ${$}u; b++) {
              output_value += workgroup_shared[workgroup_shared_offset];
              workgroup_shared_offset += ${b};
            }
            ${ne.setByIndices(`${ne.type.indices}(batch, row, col + local_id.x)`,"output_value")};
          }
        }`};return{name:"MatMulNBits",shaderCache:{hint:`${t.blockSize};${t.bits};${m};${g};${_};${b};${$}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:w,dataType:p}],dispatchGroup:{x:k},programUniforms:v}),getShaderSource:C}},a1=(e,t)=>{let r=e[0].dims,i=r.length,a=r[i-2],n=t.k,s=t.n,u=r.slice(0,i-2),l=O.size(u),h=e[1].dims[2]/4,p=e[0].dataType,m=We(t.k),g=We(h),_=u.concat([a,s]),w=128,b=s%8===0?8:s%4===0?4:1,k=w/b,$=k*g*8,v=$/m,T=$/t.blockSize,S=O.size(_)/b,E=[],C=[l,a,n/m],A=O.convertShape(e[1].dims).slice();A.splice(-1,1,h/g),E.push(...Y(C)),E.push(...Y(A)),E.push(...Y(e[2].dims)),e.length===4&&E.push(...Y(O.convertShape(e[3].dims)));let M=[l,a,s];E.push(...Y(M));let D=G=>{let oe=C.length,he=B("a",e[0].dataType,oe,m),Z=B("b",12,A.length,g),ue=B("scales",e[2].dataType,e[2].dims.length),ne=[he,Z,ue],V=e.length===4?B("zero_points",12,e[3].dims.length):void 0;V&&ne.push(V);let ye=M.length,Te=K("output",e[0].dataType,ye),q=nt(e[0].dataType),Ee=()=>{switch(m){case 1:return`
          let a_data0 = vec4<${q}>(sub_a[word_offset], sub_a[word_offset + 1], sub_a[word_offset + 2], sub_a[word_offset + 3]);
          let a_data1 = vec4<${q}>(sub_a[word_offset + 4], sub_a[word_offset + 5], sub_a[word_offset + 6], sub_a[word_offset + 7]);`;case 2:return`
          let a_data0 = vec4<${q}>(sub_a[word_offset], sub_a[word_offset + 1]);
          let a_data1 = vec4<${q}>(sub_a[word_offset + 2], sub_a[word_offset + 3]);`;case 4:return`
          let a_data0 = sub_a[word_offset];
          let a_data1 = sub_a[word_offset + 1];`;default:throw new Error(`${m}-component is not supported.`)}};return`
        var<workgroup> sub_a: array<${he.type.value}, ${v}>;
        var<workgroup> inter_results: array<array<${Te.type.value}, ${k}>, ${b}>;
        ${G.declareVariables(...ne,Te)}
        ${G.mainStart([k,b,1])}
          let output_indices = ${Te.offsetToIndices(`workgroup_index * ${b}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let n_blocks_per_col = uniforms.b_shape[1];
          let num_tiles =  (n_blocks_per_col - 1) / ${T} + 1;

          // Loop over shared dimension.
          for (var tile: u32 = 0; tile < num_tiles; tile += 1) {
            let a_col_start = tile * ${v};
            // load one tile A data into shared memory.
            for (var a_offset = local_idx; a_offset < ${v}; a_offset += ${w})
            {
              let a_col = a_col_start + a_offset;
              if (a_col < uniforms.a_shape[2])
              {
                sub_a[a_offset] = ${he.getByIndices(`${he.type.indices}(batch, row, a_col)`)};
              } else {
                sub_a[a_offset] = ${he.type.value}(0);
              }
            }
            workgroupBarrier();

            // each thread process one block
            let b_row = col + local_id.y;
            let block = tile * ${T} + local_id.x;
            ${V?`
            let zero_point_bytes_per_col = (n_blocks_per_col + 1) / 2;
            let zero_point_byte_count = b_row * zero_point_bytes_per_col + (block >> 0x1u);
            let zero_point_word_index = zero_point_byte_count >> 0x2u;
            let zero_point_byte_offset = zero_point_byte_count & 0x3u;
            let zero_point_nibble_offset: u32 = block & 0x1u;
            let zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_nibble_offset << 2);
            let zero_point_word = ${V.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point = ${q}((zero_point_word) & 0xFu);`:`
            // The default zero point is 8 for unsigned 4-bit quantization.
            let zero_point = ${q}(8);`}
            let scale = ${ue.getByOffset("b_row * n_blocks_per_col + block")};
            let b_data = ${Z.getByIndices(`${Z.type.indices}(b_row, block, 0)`)};
            var word_offset = local_id.x * ${t.blockSize/m};
            for (var i: u32 = 0; i < ${g}; i++) {
              ${Ee()}
              let b_value = ${g===1?"b_data":"b_data[i]"};
              let b_value_lower = unpack4xU8(b_value & 0x0F0F0F0Fu);
              let b_value_upper = unpack4xU8((b_value >> 4) & 0x0F0F0F0Fu);
              let b_quantized_values = mat2x4<${q}>(${Array.from({length:4},(N,W)=>`${q}(b_value_lower[${W}]), ${q}(b_value_upper[${W}])`).join(", ")});
              let b_dequantized_values = (b_quantized_values - mat2x4<${q}>(${Array(8).fill("zero_point").join(",")})) * scale;
              inter_results[local_id.y][local_id.x] += ${Array.from({length:2},(N,W)=>`${`dot(a_data${W}, b_dequantized_values[${W}])`}`).join(" + ")};
              word_offset += ${8/m};
            }
            workgroupBarrier();
          }

          if (local_idx < ${b}) {
            var output_value: ${Te.type.value} = ${Te.type.value}(0);
            for (var b = 0u; b < ${k}; b++) {
              output_value += inter_results[local_idx][b];
            }
            if (col + local_idx < uniforms.output_shape[2])
            {
              ${Te.setByIndices(`${Te.type.indices}(batch, row, col + local_idx)`,"output_value")}
            }
          }
        }`};return{name:"BlockwiseMatMulNBits32",shaderCache:{hint:`${t.blockSize};${m};${g};${k};${b}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:_,dataType:p}],dispatchGroup:{x:S},programUniforms:E}),getShaderSource:D}},Zy=(e,t)=>{i1(e.inputs,t),t.blockSize===32&&e.adapterInfo.isVendor("intel")&&e.adapterInfo.isArchitecture("gen-12lp")?e.compute(a1(e.inputs,t)):e.compute(n1(e.inputs,t))},Jy=e=>Ce(e)}),s1,o1,u1,l1,d1,h1,c1,p1,e_,U$=F(()=>{se(),fe(),me(),s1=e=>{if(!e||e.length<1)throw new Error("Too few inputs");if(e[0].dataType!==1&&e[0].dataType!==10)throw new Error("Input type must be float or float16.");if(e.length>=2){let t=e[0].dims.length*2===e[1].dims[0];if(e.length===4&&(t=e[3].dims[0]*2===e[1].dims[0]),!t)throw new Error("The pads should be a 1D tensor of shape [2 * input_rank] or [2 * num_axes].")}},o1=(e,t,r)=>{let i="";for(let a=t-1;a>=0;--a)i+=`
            k = i32(${e.indicesGet("indices",a)}) - ${X("uniforms.pads",a,r)};
            if (k < 0) {
              break;
            }
            if (k >= i32(${X("uniforms.x_shape",a,t)})) {
              break;
            }
            offset += k * i32(${X("uniforms.x_strides",a,t)});
        `;return`
          value = ${e.type.value}(uniforms.constant_value);
          for (var i = 0; i < 1; i++) {
            var offset = 0;
            var k = 0;
            ${i}
            value = x[offset];
          }
      `},u1=(e,t,r)=>{let i="";for(let a=t-1;a>=0;--a)i+=`
                k = i32(${e.indicesGet("indices",a)}) - ${X("uniforms.pads",a,r)};
                if (k < 0) {
                  k = -k;
                }
                {
                  let _2n_1 = 2 * (i32(${X("uniforms.x_shape",a,t)}) - 1);
                  k = k % _2n_1;
                  if(k >= i32(${X("uniforms.x_shape",a,t)})) {
                    k = _2n_1 - k;
                  }
                }
                offset += k * i32(${X("uniforms.x_strides",a,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${i}
              value = x[offset];
          `},l1=(e,t,r)=>{let i="";for(let a=t-1;a>=0;--a)i+=`
                k = i32(${e.indicesGet("indices",a)}) - ${X("uniforms.pads",a,r)};
                if (k < 0) {
                  k = 0;
                }
                if (k >= i32(${X("uniforms.x_shape",a,t)})) {
                  k = i32(${X("uniforms.x_shape",a,t)}) - 1;
                }
                offset += k * i32(${X("uniforms.x_strides",a,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${i}
              value = x[offset];
          `},d1=(e,t,r)=>{let i="";for(let a=t-1;a>=0;--a)i+=`
                k = i32(${e.indicesGet("indices",a)}) - ${X("uniforms.pads",a,r)};
                if (k < 0)  {
                  k += i32(${X("uniforms.x_shape",a,t)}]);
                }
                if (k >= i32(${X("uniforms.x_shape",a,t)})) {
                  k -= i32(${X("uniforms.x_shape",a,t)});
                }
                offset += k * i32(${X("uniforms.x_strides",a,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${i}
              value = x[offset];
          `},h1=(e,t,r)=>{switch(r.mode){case 0:return o1(e,t,r.pads.length);case 1:return u1(e,t,r.pads.length);case 2:return l1(e,t,r.pads.length);case 3:return d1(e,t,r.pads.length);default:throw new Error("Invalid mode")}},c1=(e,t)=>{let r=O.padShape(e[0].dims.slice(),t.pads),i=e[0].dims,a=O.size(r),n=[{type:12,data:a},{type:6,data:t.pads}],s=e.length>=3&&e[2].data;t.mode===0&&n.push({type:s?e[2].dataType:1,data:t.value}),n.push(...Y(e[0].dims,r));let u=["rank"],l=h=>{let p=K("output",e[0].dataType,r.length),m=B("x",e[0].dataType,i.length),g=m.type.value,_=h1(p,i.length,t),w=[{name:"output_size",type:"u32"},{name:"pads",type:"i32",length:t.pads.length}];return t.mode===0&&w.push({name:"constant_value",type:s?g:"f32"}),`
            ${h.registerUniforms(w).declareVariables(m,p)}
            ${h.mainStart()}
            ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

            let indices = ${p.offsetToIndices("global_idx")};

            var value = ${g}(0);
            ${_}
            output[global_idx] = value;
        }`};return{name:"Pad",shaderCache:{hint:`${t.mode}${s}`,inputDependencies:u},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(O.size(r)/64)},programUniforms:n}),getShaderSource:l}},p1=(e,t)=>{if(e.length>1){let r=e[1].getBigInt64Array(),i=e.length>=3&&e[2].data?e[2].dataType===10?e[2].getUint16Array()[0]:e[2].getFloat32Array()[0]:0,a=e[0].dims.length,n=new Int32Array(2*a).fill(0);if(e.length>=4){let u=e[3].getBigInt64Array();for(let l=0;l<u.length;l++)n[Number(u[l])]=Number(r[l]),n[Number(u[l])+a]=Number(r[l+u.length])}else r.forEach((u,l)=>n[Number(l)]=Number(u));let s=[];return n.forEach(u=>s.push(u)),{mode:t.mode,value:i,pads:s}}else return t},e_=(e,t)=>{s1(e.inputs);let r=p1(e.inputs,t);e.compute(c1(e.inputs,r),{inputs:[0]})}}),_n,Po,Do,Lo,Uo,f1,m1,Fo,Wo,t_,r_,Vo,i_,n_,Go,a_,s_,o_,u_,F$=F(()=>{nr(),se(),fe(),me(),_n=e=>{if(ze.webgpu.validateInputContent&&(!e||e.length!==1))throw new Error("Pool ops requires 1 input.")},Po=(e,t,r)=>{let i=t.format==="NHWC",a=e.dims.slice();i&&a.splice(1,0,a.pop());let n=Object.hasOwnProperty.call(t,"dilations"),s=t.kernelShape.slice(),u=t.strides.slice(),l=n?t.dilations.slice():[],h=t.pads.slice();Ga.adjustPoolAttributes(r,a,s,u,l,h);let p=Ga.computePoolOutputShape(r,a,u,l,s,h,t.autoPad),m=Object.assign({},t);n?Object.assign(m,{kernelShape:s,strides:u,pads:h,dilations:l,cacheKey:t.cacheKey}):Object.assign(m,{kernelShape:s,strides:u,pads:h,cacheKey:t.cacheKey});let g=p.slice();return g.push(g.splice(1,1)[0]),[m,i?g:p]},Do=(e,t)=>{let r=t.format==="NHWC",i=O.size(e),a=O.size(t.kernelShape),n=[{type:12,data:i},{type:12,data:a}],s=[{name:"outputSize",type:"u32"},{name:"kernelSize",type:"u32"}];if(t.kernelShape.length<=2){let u=t.kernelShape[t.kernelShape.length-1],l=t.strides[t.strides.length-1],h=t.pads[t.pads.length/2-1],p=t.pads[t.pads.length-1],m=!!(h+p);n.push({type:12,data:u},{type:12,data:l},{type:12,data:h},{type:12,data:p}),s.push({name:"kw",type:"u32"},{name:"sw",type:"u32"},{name:"pwStart",type:"u32"},{name:"pwEnd",type:"u32"});let g=!1;if(t.kernelShape.length===2){let _=t.kernelShape[t.kernelShape.length-2],w=t.strides[t.strides.length-2],b=t.pads[t.pads.length/2-2],k=t.pads[t.pads.length-2];g=!!(b+k),n.push({type:12,data:_},{type:12,data:w},{type:12,data:b},{type:12,data:k}),s.push({name:"kh",type:"u32"},{name:"sh",type:"u32"},{name:"phStart",type:"u32"},{name:"phEnd",type:"u32"})}return[n,s,!0,m,g]}else{if(r)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let u=O.computeStrides(t.kernelShape);n.push({type:12,data:u},{type:12,data:t.pads},{type:12,data:t.strides}),s.push({name:"kernelStrides",type:"u32",length:u.length},{name:"pads",type:"u32",length:t.pads.length},{name:"strides",type:"u32",length:t.strides.length});let l=t.pads.reduce((h,p)=>h+p);return[n,s,!!l,!1,!1]}},Lo=(e,t,r,i,a,n,s,u,l,h,p,m)=>{let g=a.format==="NHWC",_=t.type.value,w=K("output",t.type.tensor,i);if(a.kernelShape.length<=2){let b="",k="",$="",v=r-(g?2:1);if(p?b=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${v}] = indices[${v}] * uniforms.sw - uniforms.pwStart + i;
                  if (xIndices[${v}] < 0 || xIndices[${v}]
                      >= uniforms.x_shape[${v}]) {
                    pad++;
                    continue;
                  }
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${n}
                }`:b=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${v}] = indices[${v}] * uniforms.sw - uniforms.pwStart + i;
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${n}
                }`,a.kernelShape.length===2){let T=r-(g?3:2);m?k=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${T}] = indices[${T}] * uniforms.sh - uniforms.phStart + j;
                  if (xIndices[${T}] < 0 || xIndices[${T}] >= uniforms.x_shape[${T}]) {
                    pad += i32(uniforms.kw);
                    continue;
                  }
              `:k=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${T}] = indices[${T}] * uniforms.sh - uniforms.phStart + j;
                `,$=`
              }
            `}return`
            ${e.registerUniforms(l).declareVariables(t,w)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

              let indices = ${w.offsetToIndices("global_idx")};
              var xIndices = ${w.offsetToIndices("global_idx")};

              var value = ${_}(${u});
              var pad = 0;
              ${k}
              ${b}
              ${$}
              ${s}

              output[global_idx] = value;
            }`}else{if(g)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let b=a.kernelShape.length,k=a.pads.length,$="";return h?$=`
                if (xIndices[j] >= uniforms.x_shape[j]) {
                  pad++;
                  isPad = true;
                  break;
                }
              }
              if (!isPad) {
                let x_val = x[${t.indicesToOffset("xIndices")}];
                ${n}
              }`:$=`
              }
              let x_val = x[${t.indicesToOffset("xIndices")}];
              ${n}
            `,`
            ${e.registerUniforms(l).declareVariables(t,w)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
              let indices = ${w.offsetToIndices("global_idx")};
              var xIndices = ${w.offsetToIndices("global_idx")};

              var offsets: array<u32, ${b}>;

              var value = ${_}(${u});
              var pad = 0;
              var isPad = false;

              for (var i: u32 = 0u; i < uniforms.kernelSize; i++) {
                var offset = i;
                for (var j = 0u; j < ${b-1}u; j++) {
                  offsets[j] = offset / ${X("uniforms.kernelStrides","j",b)};
                  offset -= offsets[j] * ${X("uniforms.kernelStrides","j",b)};
                }
                offsets[${b-1}] = offset;

                isPad = false;
                for (var j = ${r-b}u; j < ${r}u; j++) {
                  xIndices[j] = indices[j] * ${X("uniforms.strides",`j - ${r-b}u`,b)}
                    + offsets[j - ${r-b}u] - ${X("uniforms.pads","j - 2u",k)};
                  ${$}
              }
              ${s}

              output[global_idx] = value;
            }`}},Uo=e=>`${e.format};${e.ceilMode};${e.autoPad};${e.kernelShape.length}`,f1=e=>`${Uo(e)};${e.countIncludePad}`,m1=e=>`${Uo(e)};${e.storageOrder};${e.dilations}`,Fo=e=>({format:e.format,autoPad:["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],ceilMode:e.ceil_mode,kernelShape:e.kernel_shape,strides:e.strides,pads:e.pads}),Wo=(e,t,r,i)=>{let[a,n]=Po(t,i,r),s=B("x",t.dataType,t.dims.length),u=s.type.value,l="value += x_val;",h="";a.countIncludePad?h+=`value /= ${u}(uniforms.kernelSize);`:h+=`value /= ${u}(i32(uniforms.kernelSize) - pad);`;let[p,m,g,_,w]=Do(n,a);p.push(...Y(t.dims,n));let b=["rank"];return{name:e,shaderCache:{hint:`${i.cacheKey};${g};${_};${w}`,inputDependencies:b},getRunData:()=>({outputs:[{dims:n,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(O.size(n)/64)},programUniforms:p}),getShaderSource:k=>Lo(k,s,t.dims.length,n.length,a,l,h,0,m,g,_,w)}},t_=e=>{let t=e.count_include_pad!==0,r=Fo(e);if(r.ceilMode!==0)throw new Error("using ceil() in shape computation is not yet supported for AveragePool");let i={countIncludePad:t,...r,cacheKey:""};return{...i,cacheKey:f1(i)}},r_=(e,t)=>{_n(e.inputs),e.compute(Wo("AveragePool",e.inputs[0],!1,t))},Vo={autoPad:"",ceilMode:0,countIncludePad:!1,kernelShape:[],strides:[],pads:[],storageOrder:0,dilations:[]},i_=e=>{let t=e.format;return{format:t,...Vo,cacheKey:t}},n_=(e,t)=>{_n(e.inputs),e.compute(Wo("GlobalAveragePool",e.inputs[0],!0,t))},Go=(e,t,r,i)=>{let[a,n]=Po(t,i,r),s=`
      value = max(x_val, value);
    `,u="",l=B("x",t.dataType,t.dims.length),h=["rank"],[p,m,g,_,w]=Do(n,a);return p.push(...Y(t.dims,n)),{name:e,shaderCache:{hint:`${i.cacheKey};${g};${_};${w}`,inputDependencies:h},getRunData:()=>({outputs:[{dims:n,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(O.size(n)/64)},programUniforms:p}),getShaderSource:b=>Lo(b,l,t.dims.length,n.length,a,s,u,t.dataType===10?-65504:-1e5,m,g,_,w)}},a_=(e,t)=>{_n(e.inputs),e.compute(Go("MaxPool",e.inputs[0],!1,t))},s_=e=>{let t=e.storage_order,r=e.dilations,i=Fo(e);if(t!==0)throw new Error("column major storage order is not yet supported for MaxPool");if(i.ceilMode!==0)throw new Error("using ceil() in shape computation is not yet supported for MaxPool");let a={storageOrder:t,dilations:r,...i,cacheKey:""};return{...a,cacheKey:m1(a)}},o_=e=>{let t=e.format;return{format:t,...Vo,cacheKey:t}},u_=(e,t)=>{_n(e.inputs),e.compute(Go("GlobalMaxPool",e.inputs[0],!0,t))}}),g1,y1,l_,d_,W$=F(()=>{se(),fe(),qe(),me(),g1=(e,t)=>{if(e.length<2||e.length>3)throw new Error("DequantizeLinear requires 2 or 3 inputs.");if(e.length===3&&e[1].dims===e[2].dims)throw new Error("x-scale and x-zero-point must have the same shape.");if(e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[0].dataType===6&&e.length>2)throw new Error("In the case of dequantizing int32 there is no zero point.");if(e[1].dims.length!==0&&e[1].dims.length!==1&&e[1].dims.length!==e[0].dims.length)throw new Error("scale input must be a scalar, a 1D tensor, or have the same rank as the input tensor.");if(e.length>2){if(e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[1].dims.length!==e[2].dims.length)throw new Error("scale and zero-point inputs must have the same rank.");if(!e[1].dims.map((r,i)=>r===e[2].dims[i]).reduce((r,i)=>r&&i,!0))throw new Error("scale and zero-point inputs must have the same shape.")}if(t.blockSize>0){if(e[1].dims.length===0||e[1].dims.length===1&&e[1].dims[0]===1)throw new Error("blockSize must be set only for block quantization.");if(!e[1].dims.map((a,n)=>n===t.axis||a===e[0].dims[n]).reduce((a,n)=>a&&n,!0))throw new Error("For block qunatization, scale input shape to match the input shape except for the axis");if(e[1].dims.length!==e[0].dims.length)throw new Error("For block qunatization the scale input rank must be the same as the x rank.");let r=e[0].dims[t.axis],i=e[1].dims[t.axis];if(t.blockSize<Math.ceil(r/i)||t.blockSize>Math.ceil(r/(i-1)-1))throw new Error("blockSize must be with in the range [ceil(dI / Si), ceil(dI / (Si - 1) - 1)].")}},y1=(e,t)=>{let r=O.normalizeAxis(t.axis,e[0].dims.length),i=e[0].dataType,a=i===3,n=e[0].dims,s=e[1].dataType,u=O.size(n),l=i===3||i===2,h=l?[Math.ceil(O.size(e[0].dims)/4)]:e[0].dims,p=e[1].dims,m=e.length>2?e[2]:void 0,g=m?l?[Math.ceil(O.size(m.dims)/4)]:m.dims:void 0,_=p.length===0||p.length===1&&p[0]===1,w=_===!1&&p.length===1,b=We(u),k=_&&(!l||b===4),$=k?b:1,v=k&&!l?b:1,T=B("input",l?12:i,h.length,v),S=B("scale",s,p.length),E=m?B("zero_point",l?12:i,g.length):void 0,C=K("output",s,n.length,$),A=[T,S];E&&A.push(E);let M=[h,p];m&&M.push(g);let D=[{type:12,data:u/$},{type:12,data:r},{type:12,data:t.blockSize},...Y(...M,n)],G=oe=>{let he=[{name:"output_size",type:"u32"},{name:"axis",type:"u32"},{name:"block_size",type:"u32"}];return`
      ${oe.registerUniforms(he).declareVariables(...A,C)}
      ${oe.mainStart()}
          ${oe.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let output_indices = ${C.offsetToIndices("global_idx")};

          // Set input x
          ${l?`
            let input = ${T.getByOffset("global_idx / 4")};
            let x_vec = ${a?"unpack4xI8(input)":"unpack4xU8(input)"};
            let x_value = ${$===1?"x_vec[global_idx % 4]":"x_vec"};`:`let x_value = ${T.getByOffset("global_idx")};`};

          // Set scale input
          ${_?`let scale_value= ${S.getByOffset("0")}`:w?`
            let scale_index = ${C.indicesGet("output_indices","uniforms.axis")};
            let scale_value= ${S.getByOffset("scale_index")};`:`
            var scale_indices: ${S.type.indices} = output_indices;
            let index = ${S.indicesGet("scale_indices","uniforms.axis")} / uniforms.block_size;
            ${S.indicesSet("scale_indices","uniforms.axis","index")};
            let scale_value= ${S.getByIndices("scale_indices")};`};

          // Set zero-point input
          ${E?_?l?`
                let zero_point_input = ${E.getByOffset("0")};
                let zero_point_vec =  ${a?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value= zero_point_vec[0]`:`let zero_point_value = ${E.getByOffset("0")}`:w?l?`
                let zero_point_index = ${C.indicesGet("output_indices","uniforms.axis")};
                let zero_point_input = ${E.getByOffset("zero_point_index / 4")};
                let zero_point_vec =  ${a?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_index % 4]`:`
                let zero_point_index = ${C.indicesGet("output_indices","uniforms.axis")};
                let zero_point_value = ${E.getByOffset("zero_point_index")};`:l?`
                let zero_point_offset = ${S.indicesToOffset("scale_indices")};
                let zero_point_input = ${E.getByOffset("zero_point_offset / 4")};
                let zero_point_vec = ${a?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_offset % 4];`:`let zero_point_value = ${E.getByIndices("scale_indices")};`:`let zero_point_value = ${l?a?"i32":"u32":T.type.value}(0);`};
      // Compute and write output
      ${C.setByOffset("global_idx",`${C.type.value}(x_value - zero_point_value) * scale_value`)};
      }`};return{name:"DequantizeLinear",shaderCache:{hint:t.cacheKey,inputDependencies:E?["rank","rank","rank"]:["rank","rank"]},getShaderSource:G,getRunData:()=>({outputs:[{dims:n,dataType:s}],dispatchGroup:{x:Math.ceil(u/$/64),y:1,z:1},programUniforms:D})}},l_=(e,t)=>{g1(e.inputs,t),e.compute(y1(e.inputs,t))},d_=e=>Ce({axis:e.axis,blockSize:e.blockSize})}),_1,w1,h_,V$=F(()=>{nr(),se(),me(),_1=(e,t,r)=>{let i=e===t,a=e<t&&r<0,n=e>t&&r>0;if(i||a||n)throw new Error("Range these inputs' contents are invalid.")},w1=(e,t,r,i)=>{let a=Math.abs(Math.ceil((t-e)/r)),n=[a],s=a,u=[{type:12,data:s},{type:i,data:e},{type:i,data:r},...Y(n)],l=h=>{let p=K("output",i,n.length),m=p.type.value,g=[{name:"outputSize",type:"u32"},{name:"start",type:m},{name:"delta",type:m}];return`
        ${h.registerUniforms(g).declareVariables(p)}
        ${h.mainStart()}
        ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        output[global_idx] = uniforms.start + ${m}(global_idx) * uniforms.delta;
      }`};return{name:"Range",shaderCache:{hint:`${i}`},getShaderSource:l,getRunData:()=>({outputs:[{dims:n,dataType:i}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:u})}},h_=e=>{let t=0,r=0,i=0;e.inputs[0].dataType===6?(t=e.inputs[0].getInt32Array()[0],r=e.inputs[1].getInt32Array()[0],i=e.inputs[2].getInt32Array()[0]):e.inputs[0].dataType===1&&(t=e.inputs[0].getFloat32Array()[0],r=e.inputs[1].getFloat32Array()[0],i=e.inputs[2].getFloat32Array()[0]),ze.webgpu.validateInputContent&&_1(t,r,i),e.compute(w1(t,r,i,e.inputs[0].dataType),{inputs:[]})}}),b1,v1,c_,p_,G$=F(()=>{se(),fe(),qe(),me(),b1=(e,t,r,i)=>{if(e!=="none"&&i!=="i32"&&i!=="u32"&&i!=="f32")throw new Error(`Input ${i} is not supported with reduction ${e}.`);let a=`{
                var oldValue = 0;
                loop {
                  let newValueF32 =`,n=`;
                  let newValue = bitcast<i32>(newValueF32);
                  let res = atomicCompareExchangeWeak(&${t}, oldValue, newValue);
                  if res.exchanged {
                    break;
                  }
                  oldValue = res.old_value;
                }
              }`;switch(e){case"none":return`${t}=${r};`;case"add":return i==="i32"||i==="u32"?`atomicAdd(&${t}, bitcast<${i}>(${r}));`:`
              ${a}bitcast<${i}>(oldValue) + (${r})${n}`;case"max":return i==="i32"||i==="u32"?`atomicMax(&${t}, bitcast<${i}>(${r}));`:`
                ${a}max(bitcast<f32>(oldValue), (${r}))${n}`;case"min":return i==="i32"||i==="u32"?`atomicMin(&${t}, bitcast<${i}>(${r}));`:`${a}min(bitcast<${i}>(oldValue), (${r}))${n}`;case"mul":return`${a}(bitcast<${i}>(oldValue) * (${r}))${n}`;default:throw new Error(`Reduction ${e} is not supported.`)}},v1=(e,t)=>{let r=e[0].dims,i=e[1].dims,a=r,n=1,s=Math.ceil(O.size(i)/n),u=i[i.length-1],l=O.sizeFromDimension(r,u),h=[{type:12,data:s},{type:12,data:u},{type:12,data:l},...Y(e[1].dims,e[2].dims,a)],p=m=>{let g=B("indices",e[1].dataType,e[1].dims.length),_=B("updates",e[2].dataType,e[2].dims.length,n),w=t.reduction!=="none"&&t.reduction!==""?Vg("output",e[0].dataType,a.length):K("output",e[0].dataType,a.length,n);return`
      ${m.registerUniform("output_size","u32").registerUniform("last_index_dimension","u32").registerUniform("num_updates_elements","u32").declareVariables(g,_,w)}
      ${m.mainStart()}
        ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
  var hasDuplicates = false;
  if (${t.reduction==="none"}) {
    let n = ${O.size(i)};
    for (var i = 0; i < n; i = i + 1) {
      for (var j = i + 1; j < n; j = j + 1) {
        var index_i = i32(indices[i].x);
        var index_j = i32(indices[j].x);
        if (index_i == index_j) {
          hasDuplicates = true;
          break;
        }
      }
      if (hasDuplicates) {
        break;
      }
    }
  }

  var data_offset = 0u;
  var indices_start = uniforms.last_index_dimension * global_idx;
  if (${t.reduction==="none"} && hasDuplicates) {
    if (global_idx != 0u) {
      return;
    }
    indices_start = 0u;
  }
  let indices_end = indices_start + uniforms.last_index_dimension;
  for (var i = indices_start; i < indices_end; i++) {
    var index = i32(indices[i].x);
    ${e[0].dims.length===1?`
    let element_count_dim = uniforms.output_strides;
    let dim_value = uniforms.output_shape;`:`
    let element_count_dim = uniforms.output_strides[i - indices_start];
    let dim_value = uniforms.output_shape[i - indices_start + uniforms.last_index_dimension];`}
    if (index >= 0) {
      if (index >= i32(dim_value)) {
        index = i32(dim_value - 1);
      }
    } else {
      if (index < -i32(dim_value)) {
        index = 0;
      } else {
        index += i32(dim_value);
      }
    }
    data_offset += u32((u32(index) * element_count_dim));
  }

  for (var i = 0u; i < uniforms.num_updates_elements; i++) {
    let value = updates[uniforms.num_updates_elements * global_idx + i];
    ${b1(t.reduction,"output[data_offset + i]","value",w.type.value)}
  }

      }`};return{name:"ScatterND",shaderCache:{hint:`${t.cacheKey}_${t.reduction}`,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:a,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:h}),getShaderSource:p}},c_=e=>Ce({reduction:e.reduction}),p_=(e,t)=>{e.compute(v1(e.inputs,t),{inputs:[e.inputs[1],e.inputs[2]],outputs:[]})}}),$1,x1,k1,jo,S1,T1,E1,I1,C1,A1,z1,O1,qo,R1,M1,B1,N1,P1,f_,m_,j$=F(()=>{se(),fe(),qe(),me(),$1=(e,t)=>{if(e.every(r=>r>0||(()=>{throw new Error("Resize requires scales input values to be positive")})),e.length>0){if(t.mode==="linear"){if(!(e.length===2||e.length===3||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1||e.length===5&&e[0]===1&&e[1]===1))throw new Error(`For linear mode, Resize requires scales to be 2D, 3D, 4D with either two outermost or one innermost and
            one outermost scale values equal to 1, or 5D with two outermost scale values equal to 1`)}else if(t.mode==="cubic"&&!(e.length===2||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1))throw new Error("Resize requires scales input size to be 2 or 4 for cubic mode")}},x1=(e,t,r)=>{t.every(a=>a>=0&&a<r||(()=>{throw new Error("Resize requires axes input values to be positive and less than rank")}));let i=new Array(r).fill(1);return t.forEach((a,n)=>i[a]=e[n]),i},k1=(e,t,r,i,a,n)=>{let[s,u,l]=r>10?[1,2,3]:[-1,e.length>1?1:-1,-1],h=e[0].dims.length;if(s>0&&e.length>s&&e[s].dims.length>0)e[s].getFloat32Array().forEach(p=>n.push(p));else if(t.coordinateTransformMode==="tf_crop_and_resize")throw new Error("Resize requires RoI input to be specified when coordinateTransformMode is tfCropAndResize");if(u>0&&e.length>u&&e[u].dims.length===1&&e[u].dims[0]>0){if(e[u].getFloat32Array().forEach(p=>i.push(p)),i.length!==0&&i.length!==h&&r>=18&&i.length!==t.axes.length)throw new Error("Resize requires scales input size to be same as input rank or axes size for opset 18 and up");$1(i,t),t.axes.length>0&&x1(i,t.axes,h).forEach((p,m)=>i[m]=p)}if(l>0&&e.length>l&&e[l].dims.length===1&&e[l].dims[0]>0&&(e[l].getBigInt64Array().forEach(p=>a.push(Number(p))),a.length!==0&&a.length!==h&&r>=18&&a.length!==t.axes.length))throw new Error("Resize requires sizes input size to be same as input rank or axes size for opset 18 and up");if(t.axes.length>0){if(i.length!==0&&i.length!==t.axes.length)throw new Error('Resize requires "scales" input size to be of axes rank when axes attributes is specified');if(a.length!==0&&a.length!==t.axes.length)throw new Error('Resize requires "sizes" input size to be of rank axes rank when axes attributes is specified')}if(typeof i<"u"&&typeof a<"u"&&i.length>0&&a.length>h)throw new Error("Resize requires only of scales or sizes to be specified")},jo=(e,t,r,i)=>`
  // The whole part and the fractional part are calculated separately due to inaccuracy of floating
  // point division. As an example, f32(21) / f32(7) may evaluate to 2.99... instead of 3, causing an
  // offset-by-one error later in floor().
  let big = (${e}) * (${t});
  let whole = ${i}(big / (${r}));
  let fract = ${i}(big % (${r})) / ${i}(${r});
  return whole + fract;
`,S1=(e,t)=>`fn getOriginalCoordinateFromResizedCoordinate(xResized: u32, xScale: f32, lengthResized: u32,
     lengthOriginal: u32, roiStart: f32, roiEnd: f32) -> ${t} { `+(()=>{switch(e){case"asymmetric":return`
          if (xScale < 1.0 || floor(xScale) != xScale) {
            return ${t}(xResized) / ${t}(xScale);
          } else {
            ${jo("xResized","lengthOriginal","lengthResized",t)}
          }
        `;case"pytorch_half_pixel":return`if (lengthResized > 1) {
                    return (${t}(xResized) + 0.5) / ${t}(xScale) - 0.5;
                  } else {
                    return 0.0;
                  }`;case"tf_half_pixel_for_nn":return`return (${t}(xResized) + 0.5) / ${t}(xScale);`;case"align_corners":return`if (lengthResized == 1) {
                    return 0.0;
                  } else {
                    ${jo("xResized","lengthOriginal - 1","lengthResized - 1",t)}
                  }`;case"tf_crop_and_resize":return`if (lengthResized > 1) {
                    return ${t}(roiStart) * ${t}(lengthOriginal - 1) +
                        (${t}(xResized) * ${t}(roiEnd - roiStart) * ${t}(lengthOriginal - 1)) /
                        ${t}(lengthResized - 1);
                  } else {
                    return 0.5 * ${t}(roiStart + roiEnd) * ${t}(lengthOriginal - 1);
                  }`;case"half_pixel_symmetric":return`const outputWidth = ${t}xScale * ${t}(lengthResized);
                  const adjustment = ${t}(lengthResized) / outputWidth;
                  const center = ${t}(lengthOriginal) / 2;
                  const offset = center * (1 - adjustment);
                  return offset + ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;case"half_pixel":return`return ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;default:throw new Error(`Coordinate transform mode ${e} is not supported`)}})()+"}",T1=(e,t,r)=>`fn getNearestPixelFromOriginal(xOriginal: ${r}, isDownSample: bool) -> ${r} {`+(()=>{switch(e){case"round_prefer_ceil":return"if (fract(xOriginal) == 0.5) {             return ceil(xOriginal);           } else {             return round(xOriginal);           }";case"floor":return"return floor(xOriginal);";case"ceil":return"return ceil(xOriginal);";case"round_prefer_floor":return"if (fract(xOriginal) == 0.5) {                     return floor(xOriginal);                   } else {                     return round(xOriginal);                   }";case"simple":default:if(t<11)return"if (isDownSample)                     {                       return ceil(xOriginal);                     } else {                       return xOriginal;                     }";throw new Error(`Nearest mode ${e} is not supported`)}})()+"}",E1=(e,t,r)=>{let i=new Array(r).fill(0).concat(new Array(r).fill(1)),a=e.length===0?i:e.slice();return t.length>0?(t.forEach((n,s)=>{i[n]=a[s],i[s+r]=a[t.length+s]}),i):a},I1=(e,t,r,i)=>{let a=[];if(r.length>0)if(i.length>0){if(e.forEach(n=>a.push(n)),Math.max(...i)>e.length)throw new Error("axes is out of bound");i.forEach((n,s)=>a[n]=r[s])}else r.forEach(n=>a.push(n));else{if(t.length===0)throw new Error("Resize requires either scales or sizes.");a=e.map((n,s)=>Math.round(n*t[s]))}return a},C1=(e,t,r)=>{let i=(()=>{switch(r.keepAspectRatioPolicy){case"not_larger":return r.axes.length>0?Math.min(...r.axes.map(n=>t[n]),Number.MAX_VALUE):Math.min(...t,Number.MAX_VALUE);case"not_smaller":return r.axes.length>0?Math.max(...r.axes.map(n=>t[n]),Number.MIN_VALUE):Math.max(...t,Number.MIN_VALUE);default:throw new Error(`Keep aspect ratio policy ${r.keepAspectRatioPolicy} is not supported`)}})();t.fill(1,0,t.length);let a=e.slice();return r.axes.length>0?(r.axes.forEach(n=>t[n]=i),r.axes.forEach(n=>a[n]=Math.round(e[n]*t[n]))):(t.fill(i,0,t.length),a.forEach((n,s)=>a[s]=Math.round(n*t[s]))),a},A1=(e,t,r,i,a)=>`
    fn calculateOriginalIndicesFromOutputIndices(output_indices: ${e.type.indices}) -> array<${e.type.value}, ${r.length}> {
      var original_indices: array<${e.type.value}, ${r.length}>;
      for (var i:u32 = 0; i < ${r.length}; i++) {
        var output_index = ${e.indicesGet("output_indices","i")};
        var scale = ${X("uniforms.scales","i",i)};
        var roi_low = ${X("uniforms.roi","i",a)};
        var roi_hi = ${X("uniforms.roi",`i + ${t.length}`,a)};
        if (scale == 1.0) {
          original_indices[i] = ${e.type.value}(output_index);
        } else {
          var input_shape_i = ${X("uniforms.input_shape","i",t.length)};
          var output_shape_i = ${X("uniforms.output_shape","i",r.length)};
          original_indices[i] = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                           input_shape_i, roi_low, roi_hi);
        }
      }
      return original_indices;
    }`,z1=(e,t,r,i,a,n,s)=>`
    fn calculateInputIndicesFromOutputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
      var input_indices: ${e.type.indices};
      for (var i:u32 = 0; i < ${i.length}; i++) {
        var output_index = ${t.indicesGet("output_indices","i")};
        var input_index: u32;
        var scale = ${X("uniforms.scales","i",a)};
        if (scale == 1.0) {
          input_index = output_index;
        } else {
          var roi_low = ${X("uniforms.roi","i",n)};
          var roi_hi = ${X("uniforms.roi",`i + ${r.length}`,n)};
          var input_shape_i = ${X("uniforms.input_shape","i",r.length)};
          var output_shape_i = ${X("uniforms.output_shape","i",i.length)};
          var original_idx = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                        input_shape_i, roi_low, roi_hi);
          if (!${s} || (original_idx >= 0 && original_idx < ${t.type.value}(input_shape_i))) {
            if (original_idx < 0) {
              input_index = 0;
            } else if (original_idx > ${t.type.value}(input_shape_i - 1)) {
              input_index = input_shape_i - 1;
            } else {
              input_index = u32(getNearestPixelFromOriginal(original_idx, scale < 1));
            }
          } else {
            input_index = u32(original_idx);
          }
        }
        ${e.indicesSet("input_indices","i","input_index")}
      }
      return input_indices;
    }`,O1=(e,t)=>`
    fn checkInputIndices(input_indices: ${e.type.indices}) -> bool {
      for (var i:u32 = 0; i < ${t.length}; i++) {
        var input_index = ${e.indicesGet("input_indices","i")};
        if (input_index < 0 || input_index >= ${X("uniforms.input_shape","i",t.length)}) {
          return false;
        }
      }
      return true;
    }`,qo=(e,t,r,i)=>e.rank>i?`
    ${e.indicesSet("input_indices",t,"channel")};
    ${e.indicesSet("input_indices",r,"batch")};
`:"",R1=(e,t,r,i,a)=>{let[n,s,u,l]=r.length===2?[-1,0,1,-1]:[0,2,3,1],h=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, row: u32, col: u32) -> ${h} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",s,`max(0, min(row, ${r[s]} - 1))`)};
      ${e.indicesSet("input_indices",u,`max(0, min(col, ${r[u]} - 1))`)};
      ${qo(e,l,n,2)}
      return ${e.getByIndices("input_indices")};
    }

    fn bilinearInterpolation(output_indices: ${t.type.indices}) -> ${h} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var row:${h} = originalIndices[${s}];
      var col:${h} = originalIndices[${u}];
      ${i?`if (row < 0 || row > (${r[s]} - 1) || col < 0 || col > (${r[u]} - 1)) {
        return ${a};
      }`:""};
      row = max(0, min(row, ${r[s]} - 1));
      col = max(0, min(col, ${r[u]} - 1));
      var row1: u32 = u32(row);
      var col1: u32 = u32(col);
      var row2: u32 = u32(row + 1);
      var col2: u32 = u32(col + 1);
      var channel: u32 = ${r.length>2?`u32(originalIndices[${l}])`:"0"};
      var batch: u32 =  ${r.length>2?`u32(originalIndices[${n}])`:"0"};
      var x11: ${h} = getInputValue(batch, channel, row1, col1);
      var x12: ${h} = getInputValue(batch, channel, row1, col2);
      var x21: ${h} = getInputValue(batch, channel, row2, col1);
      var x22: ${h} = getInputValue(batch, channel, row2, col2);
      var dx1: ${h} = abs(row - ${h}(row1));
      var dx2: ${h} = abs(${h}(row2) - row);
      var dy1: ${h} = abs(col - ${h}(col1));
      var dy2: ${h} = abs(${h}(col2) - col);
      if (row1 == row2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (col1 == col2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      return (x11 * dx2 * dy2 + x12 * dx2 * dy1 + x21 * dx1 * dy2 + x22 * dx1 * dy1);
    }`},M1=(e,t,r,i,a,n,s,u,l,h)=>{let p=r.length===2,[m,g]=p?[0,1]:[2,3],_=e.type.value,w=b=>{let k=b===m?"row":"col";return`
      fn ${k}CubicInterpolation(input_indices: ${e.type.indices}, output_indices: ${t.type.indices}) -> ${_} {
        var output_index = ${t.indicesGet("output_indices",b)};
        var originalIdx: ${_} = getOriginalCoordinateFromResizedCoordinate(output_index, ${a[b]},
        ${i[b]}, ${r[b]}, ${n[b]}, ${n[b]} + ${r.length});
        var fractOriginalIdx: ${_} = originalIdx - floor(originalIdx);
        var coefs = getCubicInterpolationCoefs(fractOriginalIdx);

        if (${u} && (originalIdx < 0 || originalIdx > (${r[b]} - 1))) {
          return ${l};
        }
        var data: array<${_}, 4> = array<${_}, 4>(0.0, 0.0, 0.0, 0.0);
        for (var i: i32 = -1; i < 3; i++) {
          var ${k}: ${_} = originalIdx + ${_}(i);
          if (${k} < 0 || ${k} >= ${r[b]}) {
            ${h?`coefs[i + 1] = 0.0;
                        continue;`:u?`return ${l};`:`${k} = max(0, min(${k}, ${r[b]} - 1));`};
          }
        var input_indices_copy: ${e.type.indices} = input_indices;
          ${e.indicesSet("input_indices_copy",b,`u32(${k})`)};
          data[i + 1] = ${b===m?e.getByIndices("input_indices_copy"):"rowCubicInterpolation(input_indices_copy, output_indices)"};
        }
        return cubicInterpolation1D(data, coefs);
      }`};return`
    ${w(m)};
    ${w(g)};
  fn getCubicInterpolationCoefs(s: ${_}) -> array<${_}, 4> {
    var absS = abs(s);
    var coeffs: array<${_}, 4> = array<${_}, 4>(0.0, 0.0, 0.0, 0.0);
    var oneMinusAbsS: ${_} = 1.0 - absS;
    var twoMinusAbsS: ${_} = 2.0 - absS;
    var onePlusAbsS: ${_} = 1.0 + absS;
    coeffs[0] = ((${s} * onePlusAbsS - 5 * ${s}) * onePlusAbsS + 8 * ${s}) * onePlusAbsS - 4 * ${s};
    coeffs[1] = ((${s} + 2) * absS - (${s} + 3)) * absS * absS + 1;
    coeffs[2] = ((${s} + 2) * oneMinusAbsS - (${s} + 3)) * oneMinusAbsS * oneMinusAbsS + 1;
    coeffs[3] = ((${s} * twoMinusAbsS - 5 * ${s}) * twoMinusAbsS + 8 * ${s}) * twoMinusAbsS - 4 * ${s};
    return coeffs;
  }

  fn cubicInterpolation1D(x: array<${_}, 4>, coefs: array<${_}, 4>) -> ${_} {
    var coefsSum: ${_} = coefs[0] + coefs[1] + coefs[2] + coefs[3];
    return (x[0] * coefs[0] + x[1] * coefs[1]+ x[2] * coefs[2]+ x[3] * coefs[3]) / coefsSum;
  }

  fn bicubicInterpolation(output_indices: ${t.type.indices}) -> ${_} {
    var input_indices: ${e.type.indices} = output_indices;
    return colCubicInterpolation(input_indices, output_indices);
  }
    `},B1=(e,t,r,i,a)=>{let[n,s,u,l,h]=r.length===3?[-1,0,1,2,-1]:[0,2,3,4,1],p=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, depth:u32, height: u32, width: u32) -> ${p} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",s,`max(0, min(depth, ${r[s]} - 1))`)};
      ${e.indicesSet("input_indices",u,`max(0, min(height, ${r[u]} - 1))`)};
      ${e.indicesSet("input_indices",l,`max(0, min(width, ${r[l]} - 1))`)};
      ${qo(e,h,n,3)}
      return ${e.getByIndices("input_indices")};
    }

    fn trilinearInterpolation(output_indices: ${t.type.indices}) -> ${p} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var depth:${p} = originalIndices[${s}];
      var height:${p} = originalIndices[${u}];
      var width:${p} = originalIndices[${l}];
      ${i?`if (depth < 0 || depth > (${r[s]} - 1) || height < 0 || height > (${r[u]} - 1) || width < 0 || (width > ${r[l]} - 1)) {
      return ${a};
        }`:""};

    depth = max(0, min(depth, ${r[s]} - 1));
      height = max(0, min(height, ${r[u]} - 1));
      width = max(0, min(width, ${r[l]} - 1));
      var depth1: u32 = u32(depth);
      var height1: u32 = u32(height);
      var width1: u32 = u32(width);
      var depth2: u32 = u32(depth + 1);
      var height2: u32 = u32(height + 1);
      var width2: u32 = u32(width + 1);
      var channel: u32 = ${r.length>3?`u32(originalIndices[${h}])`:"0"};
      var batch: u32 =  ${r.length>3?`u32(originalIndices[${n}])`:"0"};

      var x111: ${p} = getInputValue(batch, channel, depth1, height1, width1);
      var x112: ${p} = getInputValue(batch, channel, depth1, height1, width2);
      var x121: ${p} = getInputValue(batch, channel, depth1, height2, width1);
      var x122: ${p} = getInputValue(batch, channel, depth1, height2, width2);
      var x211: ${p} = getInputValue(batch, channel, depth2, height1, width1);
      var x212: ${p} = getInputValue(batch, channel, depth2, height1, width2);
      var x221: ${p} = getInputValue(batch, channel, depth2, height2, width1);
      var x222: ${p} = getInputValue(batch, channel, depth2, height2, width2);
      var dx1: ${p} = abs(depth - ${p}(depth1));
      var dx2: ${p} = abs(${p}(depth2) - depth);
      var dy1: ${p} = abs(height - ${p}(height1));
      var dy2: ${p} = abs(${p}(height2) - height);
      var dz1: ${p} = abs(width - ${p}(width1));
      var dz2: ${p} = abs(${p}(width2) - width);
      if (depth1 == depth2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (height1 == height2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      if (width1 == width2) {
        dz1 = 0.5;
        dz2 = 0.5;
      }
      return (x111 * dx2 * dy2 * dz2 + x112 * dx2 * dy2 * dz1 + x121 * dx2 * dy1 *dz2 + x122 * dx2 * dy1 * dz1 +
              x211 * dx1 * dy2 * dz2 + x212 * dx1 * dy2 * dz1 + x221 * dx1 * dy1 *dz2 + x222 * dx1 * dy1 * dz1);
    }`},N1=(e,t,r,i,a,n)=>{let s=e.dims,u=E1(n,t.axes,s.length),l=I1(s,i,a,t.axes),h=i.slice();i.length===0&&(h=s.map((v,T)=>v===0?1:l[T]/v),t.keepAspectRatioPolicy!=="stretch"&&(l=C1(s,h,t)));let p=K("output",e.dataType,l.length),m=B("input",e.dataType,s.length),g=O.size(l),_=s.length===l.length&&s.every((v,T)=>v===l[T]),w=t.coordinateTransformMode==="tf_crop_and_resize",b=t.extrapolationValue,k=m.type.value,$=v=>`
      ${_?"":`
      ${S1(t.coordinateTransformMode,k)};
      ${(()=>{switch(t.mode){case"nearest":return`
              ${O1(m,s)};
              ${T1(t.nearestMode,r,k)};
              ${z1(m,p,s,l,h.length,u.length,w)};
              `;case"linear":return`
              ${A1(p,s,l,h.length,u.length)};
              ${(()=>{if(s.length===2||s.length===4)return`${R1(m,p,s,w,b)}`;if(s.length===3||s.length===5)return`${B1(m,p,s,w,b)}`;throw Error("Linear mode only supports input dims 2, 3, 4 and 5 are supported in linear mode.")})()};
            `;case"cubic":return`
            ${(()=>{if(s.length===2||s.length===4)return`${M1(m,p,s,l,h,u,t.cubicCoeffA,w,t.extrapolationValue,t.excludeOutside)}`;throw Error("Cubic mode only supports input dims 2 and 4 are supported in linear mode.")})()};
            `;default:throw Error("Invalid resize mode")}})()};
      `}
      ${v.registerUniform("output_size","u32").registerUniform("scales","f32",h.length).registerUniform("roi","f32",u.length).declareVariables(m,p)}
      ${v.mainStart()}
        ${v.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
        ${_?"output[global_idx] = input[global_idx];":`
        let output_indices = ${p.offsetToIndices("global_idx")};
        var input_indices: ${m.type.indices};
        ${(()=>{switch(t.mode){case"nearest":return`input_indices = calculateInputIndicesFromOutputIndices(output_indices);
                if (checkInputIndices(input_indices)) {
                  output[global_idx] = ${m.getByIndices("input_indices")};
                } else {
                  output[global_idx] = ${t.extrapolationValue};
                }`;case"linear":return`output[global_idx] = ${s.length===2||s.length===4?"bilinearInterpolation":"trilinearInterpolation"}(output_indices);`;case"cubic":return"output[global_idx] = bicubicInterpolation(output_indices);";default:throw Error(`Unsupported resize mode: ${t.mode}`)}})()};
`}
      }`;return{name:"Resize",shaderCache:{hint:`${t.cacheKey}|${r}|${h.length>0?t.mode==="cubic"?h:h.length:""}|${a.length>0?a:""}|${u.length>0?u:""}|${_}|${t.mode==="nearest"?s.length:s}`,inputDependencies:["rank"]},getShaderSource:$,getRunData:()=>({outputs:[{dims:l,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(g/64)},programUniforms:[{type:12,data:g},{type:1,data:h},{type:1,data:u},...Y(s,l)]})}},P1=e=>{let t=e.customDataBuffer;return new Uint32Array(t,t.byteOffset,1)[0]},f_=(e,t)=>{let r=[],i=[],a=[],n=P1(e);if(t.antialias!==0)throw Error("Only default value (0) for Antialias attribute is supported");k1(e.inputs,t,n,r,i,a),e.compute(N1(e.inputs[0],t,n,r,i,a),{inputs:[0]})},m_=e=>{let t=e.antialias,r=e.axes,i=e.coordinateTransformMode,a=e.cubicCoeffA,n=e.excludeOutside!==0,s=e.extrapolationValue,u=e.keepAspectRatioPolicy,l=e.mode,h=e.nearestMode===""?"simple":e.nearestMode;return Ce({antialias:t,axes:r,coordinateTransformMode:i,cubicCoeffA:a,excludeOutside:n,extrapolationValue:s,keepAspectRatioPolicy:u,mode:l,nearestMode:h})}}),D1,L1,g_,q$=F(()=>{se(),fe(),qe(),me(),D1=(e,t)=>{let[r,i,a,n]=e,{numHeads:s,rotaryEmbeddingDim:u}=t;if(r.dims.length!==3&&r.dims.length!==4)throw new Error(`Input 'x' is expected to have 3 or 4 dimensions, got ${r.dims.length}`);if(!O.areEqual(i.dims,[])&&!O.areEqual(i.dims,[1])&&i.dims.length!==2)throw new Error(`Input 'position_ids' is expected to have 0, 1, or 2 dimensions, got ${i.dims.length}`);if(a.dims.length!==2)throw new Error(`Input 'cos_cache' is expected to have 2 dimensions, got ${a.dims.length}`);if(n.dims.length!==2)throw new Error(`Input 'sin_cache' is expected to have 2 dimensions, got ${n.dims.length}`);if(!O.areEqual(a.dims,n.dims))throw new Error("Inputs 'cos_cache' and 'sin_cache' are expected to have the same shape");if(u>0&&s===0)throw new Error("num_heads must be provided if rotary_embedding_dim is specified");let l=r.dims[0],h=r.dims[r.dims.length-2],p=a.dims[0],m=O.sizeFromDimension(r.dims,1)/h,g=u===0?a.dims[1]*2:m/s;if(u>g)throw new Error("rotary_embedding_dim must be less than or equal to head_size");if(i.dims.length===2){if(l!==i.dims[0])throw new Error(`Input 'position_ids' dimension 0 should be of size batch_size, got ${i.dims[0]}`);if(h!==i.dims[1])throw new Error(`Input 'position_ids' dimension 1 should be of size sequence_length, got ${i.dims[1]}`)}if(g/2!==a.dims[1]&&u/2!==a.dims[1])throw new Error(`Input 'cos_cache' dimension 1 should be same as head_size / 2 or rotary_embedding_dim / 2, got ${a.dims[1]}`);if(h>p)throw new Error("Updating cos_cache and sin_cache in RotaryEmbedding is not currently supported")},L1=(e,t)=>{let{interleaved:r,numHeads:i,rotaryEmbeddingDim:a,scale:n}=t,s=e[0].dims[0],u=O.sizeFromDimension(e[0].dims,1),l=e[0].dims[e[0].dims.length-2],h=u/l,p=e[2].dims[1],m=a===0?p*2:h/i,g=new Array(s,l,h/m,m-p),_=O.computeStrides(g),w=[{type:1,data:n},{type:12,data:g},{type:12,data:_},...e[0].dims.length===3?new Array({type:12,data:[u,h,m,1]}):[],...e[0].dims.length===4?new Array({type:12,data:[u,m,l*m,1]}):[],...Y(e[0].dims,e[1].dims,e[2].dims,e[3].dims,e[0].dims)],b=k=>{let $=B("input",e[0].dataType,e[0].dims.length),v=B("position_ids",e[1].dataType,e[1].dims.length),T=B("cos_cache",e[2].dataType,e[2].dims.length),S=B("sin_cache",e[3].dataType,e[3].dims.length),E=K("output",e[0].dataType,e[0].dims.length);return k.registerUniforms([{name:"scale",type:"f32"},{name:"global_shape",type:"u32",length:g.length},{name:"global_strides",type:"u32",length:_.length},{name:"input_output_strides",type:"u32",length:_.length}]),`
        ${k.declareVariables($,v,T,S,E)}

        ${k.mainStart(Ki)}
          let half_rotary_emb_dim = uniforms.${T.name}_shape[1];
          let bsnh = global_idx / uniforms.global_strides % uniforms.global_shape;
          let size = uniforms.global_shape[0] * uniforms.global_strides[0];
          ${k.guardAgainstOutOfBoundsWorkgroupSizes("size")}

          if (bsnh[3] < half_rotary_emb_dim) {
            let position_ids_idx =
                ${v.broadcastedIndicesToOffset("bsnh.xy",K("",v.type.tensor,2))};
            let position_id =
                u32(${v.getByOffset("position_ids_idx")}) + select(0, bsnh[1], position_ids_idx == 0);
            let i = dot(bsnh, uniforms.input_output_strides) + select(0, bsnh[3], ${r});
            let j = i + select(half_rotary_emb_dim, 1, ${r});
            let re = ${$.getByOffset("i")} * ${T.get("position_id","bsnh[3]")} -
                ${$.getByOffset("j")} * ${S.get("position_id","bsnh[3]")};
            ${E.setByOffset("i","re")}
            let im = ${$.getByOffset("i")} * ${S.get("position_id","bsnh[3]")} +
                ${$.getByOffset("j")} * ${T.get("position_id","bsnh[3]")};
            ${E.setByOffset("j","im")}
          } else {
            let k = dot(bsnh, uniforms.input_output_strides) + half_rotary_emb_dim;
            ${E.setByOffset("k",$.getByOffset("k"))}
          }
        }`};return{name:"RotaryEmbedding",shaderCache:{hint:Ce({interleaved:r}).cacheKey,inputDependencies:["rank","rank","rank","rank"]},getShaderSource:b,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(O.size(g)/Ki)},programUniforms:w})}},g_=(e,t)=>{D1(e.inputs,t),e.compute(L1(e.inputs,t))}}),U1,F1,y_,H$=F(()=>{se(),fe(),me(),U1=e=>{if(!e||e.length<3)throw new Error("layerNorm requires at least 3 inputs.");let t=e[0],r=e[1],i=e[2];if(t.dataType!==r.dataType||t.dataType!==i.dataType)throw new Error("All inputs must have the same data type");if(t.dims.length!==3&&t.dims.length!==2)throw new Error("Input must be 2D or 3D");if(r.dims.length!==3&&r.dims.length!==2)throw new Error("Skip must be 2D or 3D");let a=t.dims[t.dims.length-1],n=t.dims[t.dims.length-2];if(r.dims[r.dims.length-1]!==a)throw new Error("Skip must have the same hidden size as input");if(r.dims[r.dims.length-2]!==n)throw new Error("Skip must have the same sequence length as input");if(i.dims.length!==1)throw new Error("Gamma must be 1D");if(i.dims[i.dims.length-1]!==a)throw new Error("Gamma must have the same hidden size as input");if(e.length>3){let s=e[3];if(s.dims.length!==1)throw new Error("Beta must be 1D");if(s.dims[s.dims.length-1]!==a)throw new Error("Beta must have the same hidden size as input")}if(e.length>4){let s=e[4];if(s.dims.length!==1)throw new Error("Bias must be 1D");if(s.dims[s.dims.length-1]!==a)throw new Error("Bias must have the same hidden size as input")}},F1=(e,t,r,i)=>{let a=t.simplified,n=e[0].dims,s=O.size(n),u=n,l=s,h=n.slice(-1)[0],p=i?n.slice(0,-1).concat(1):[],m=!a&&e.length>3,g=e.length>4,_=i&&r>1,w=i&&r>2,b=r>3,k=64,$=We(h),v=[{type:12,data:l},{type:12,data:$},{type:12,data:h},{type:1,data:t.epsilon}],T=E=>{let C=[{name:"output_size",type:"u32"},{name:"components",type:"u32"},{name:"hidden_size",type:"u32"},{name:"epsilon",type:"f32"}],A=[B("x",e[0].dataType,e[0].dims,$),B("skip",e[1].dataType,e[1].dims,$),B("gamma",e[2].dataType,e[2].dims,$)];m&&A.push(B("beta",e[3].dataType,e[3].dims,$)),g&&A.push(B("bias",e[4].dataType,e[4].dims,$)),A.push(K("output",e[0].dataType,u,$)),_&&A.push(K("mean_output",1,p)),w&&A.push(K("inv_std_output",1,p)),b&&A.push(K("input_skip_bias_sum",e[0].dataType,u,$));let M=nt(e[0].dataType),D=nt(1,$);return`

      ${E.registerUniforms(C).declareVariables(...A)}
      var<workgroup> sum_shared : array<${D}, ${k}>;
      var<workgroup> sum_squared_shared : array<${D}, ${k}>;

      ${E.mainStart([k,1,1])}
        let ix = local_id.x;
        let iy = global_id.x / ${k};

        let hidden_size_vectorized: u32 = uniforms.hidden_size / uniforms.components;
        var stride = hidden_size_vectorized / ${k};
        let offset = ix * stride + iy * hidden_size_vectorized;
        let offset1d = stride * ix;
        if (ix == ${k-1}) {
          stride = hidden_size_vectorized - stride * ix;
        }
        for (var i: u32 = 0; i < stride; i++) {
          let skip_value = skip[offset + i];
          let bias_value = ${g?"bias[offset1d + i]":M+"(0.0)"};
          let input_value = x[offset + i];
          let value = input_value + skip_value + bias_value;
          ${b?"input_skip_bias_sum[offset + i] = value;":""}
          output[offset + i] = value;
          let f32_value = ${zi(M,$,"value")};
          sum_shared[ix] += f32_value;
          sum_squared_shared[ix] += f32_value * f32_value;
        }
        workgroupBarrier();

        var reduce_size : u32 = ${k};
        for (var curr_size = reduce_size >> 1;  curr_size > 0; curr_size = reduce_size >> 1) {
          reduce_size = curr_size + (reduce_size & 1);
          if (ix < curr_size) {
            sum_shared[ix] += sum_shared[ix + reduce_size];
            sum_squared_shared[ix] += sum_squared_shared[ix + reduce_size];
          }
          workgroupBarrier();
        }

        let sum = sum_shared[0];
        let square_sum = sum_squared_shared[0];
        let mean = ${Kr("sum",$)} / f32(uniforms.hidden_size);
        let inv_std_dev = inverseSqrt(${Kr("square_sum",$)} / f32(uniforms.hidden_size) ${a?"":"- mean * mean"} + uniforms.epsilon);
        ${_?"mean_output[global_idx] = mean;":""}
        ${w?"inv_std_output[global_idx] = inv_std_dev;":""}

        for (var i: u32 = 0; i < stride; i++) {
          output[offset + i] = (output[offset + i] ${a?"":`- ${M}(mean)`}) *
            ${M}(inv_std_dev) * gamma[offset1d + i]
            ${m?"+ beta[offset1d + i]":""};
        }
      }`},S=[{dims:u,dataType:e[0].dataType}];return r>1&&S.push({dims:p,dataType:1}),r>2&&S.push({dims:p,dataType:1}),r>3&&S.push({dims:n,dataType:e[0].dataType}),{name:"SkipLayerNormalization",shaderCache:{hint:`${$};${_};${w};${b}`,inputDependencies:e.map((E,C)=>"type")},getShaderSource:T,getRunData:()=>({outputs:S,dispatchGroup:{x:Math.ceil(l/h)},programUniforms:v})}},y_=(e,t)=>{U1(e.inputs);let r=[0];e.outputCount>1&&r.push(-3),e.outputCount>2&&r.push(-3),e.outputCount>3&&r.push(3),e.compute(F1(e.inputs,t,e.outputCount,!1),{outputs:r})}}),W1,wn,V1,Ho,G1,j1,__,w_,K$=F(()=>{se(),fe(),qe(),me(),W1=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");if(t.axes.length!==0){if(t.axes.length!==t.starts.length||t.axes.length!==t.ends.length)throw new Error("axes, starts and ends must have the same length")}else if(t.starts.length!==t.ends.length)throw new Error("starts and ends must have the same length");e.slice(1).forEach((r,i)=>{if(e[i+1].dataType!==6&&e[i+1].dataType!==7)throw new Error(`Input ${i} must be an array of int32 or int64`)})},wn=(e,t)=>{let r=[];if(e.length>t)if(e[t].dataType===7)e[t].getBigInt64Array().forEach(i=>r.push(Number(i)));else if(e[t].dataType===6)e[t].getInt32Array().forEach(i=>r.push(Number(i)));else throw new Error(`Input ${t} must be an array of int32 or int64`);return r},V1=(e,t)=>{if(e.length>1){let r=wn(e,1),i=wn(e,2),a=wn(e,3);return a.length===0&&(a=[...Array(e[0].dims.length).keys()]),Ce({starts:r,ends:i,axes:a})}else return t},Ho=(e,t,r,i,a)=>{let n=e;return e<0&&(n+=r[i[t]]),a[t]<0?Math.max(0,Math.min(n,r[i[t]]-1)):Math.max(0,Math.min(n,r[i[t]]))},G1=(e,t,r)=>`fn calculateInputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
          var input_indices: ${e.type.indices};
          var carry = 0u;
          for (var i = ${r.length}; i >= 0; i--) {
            let input_shape_i = ${X("uniforms.input_shape","i",r.length)};
            let steps_i = ${X("uniforms.steps","i",r.length)};
            let signs_i = ${X("uniforms.signs","i",r.length)};
            let starts_i = ${X("uniforms.starts","i",r.length)};
            var output_index = ${t.indicesGet("output_indices","i")};
            var input_index = output_index * steps_i + starts_i + carry;
            carry = input_index / input_shape_i;
            input_index = input_index % input_shape_i;
            if (signs_i < 0) {
              input_index = input_shape_i - input_index - 1u + starts_i;
            }
            ${e.indicesSet("input_indices","i","input_index")};
          }
          return input_indices;
      }`,j1=(e,t)=>{let r=e[0].dims,i=O.size(r),a=t.axes.length>0?O.normalizeAxes(t.axes,r.length):[...Array(r.length).keys()],n=wn(e,4);n.forEach($=>$!==0||(()=>{throw new Error("step cannot be 0")})),n.length===0&&(n=Array(a.length).fill(1));let s=t.starts.map(($,v)=>Ho($,v,r,a,n)),u=t.ends.map(($,v)=>Ho($,v,r,a,n));if(a.length!==s.length||a.length!==u.length)throw new Error("start, ends and axes should have the same number of elements");if(a.length!==r.length)for(let $=0;$<r.length;++$)a.includes($)||(s.splice($,0,0),u.splice($,0,r[$]),n.splice($,0,1));let l=n.map($=>Math.sign($));n.forEach(($,v,T)=>{if($<0){let S=(u[v]-s[v])/$,E=s[v],C=E+S*n[v];s[v]=C,u[v]=E,T[v]=-$}});let h=r.slice(0);a.forEach(($,v)=>{h[$]=Math.ceil((u[$]-s[$])/n[$])});let p={dims:h,dataType:e[0].dataType},m=K("output",e[0].dataType,h.length),g=B("input",e[0].dataType,e[0].dims.length),_=O.size(h),w=[{name:"outputSize",type:"u32"},{name:"starts",type:"u32",length:s.length},{name:"signs",type:"i32",length:l.length},{name:"steps",type:"u32",length:n.length}],b=[{type:12,data:_},{type:12,data:s},{type:6,data:l},{type:12,data:n},...Y(e[0].dims,h)],k=$=>`
      ${$.registerUniforms(w).declareVariables(g,m)}
        ${G1(g,m,r)}
        ${$.mainStart()}
          ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
          let output_indices = ${m.offsetToIndices("global_idx")};
          let input_indices = calculateInputIndices(output_indices);
          ${m.setByOffset("global_idx",g.getByIndices("input_indices"))}
      }`;return{name:"Slice",shaderCache:{hint:`${l.length}_${s.length}_${n.length}`,inputDependencies:["rank"]},getShaderSource:k,getRunData:()=>({outputs:[p],dispatchGroup:{x:Math.ceil(i/64)},programUniforms:b})}},__=(e,t)=>{W1(e.inputs,t);let r=V1(e.inputs,t);e.compute(j1(e.inputs,r),{inputs:[0]})},w_=e=>{let t=e.starts,r=e.ends,i=e.axes;return Ce({starts:t,ends:r,axes:i})}}),q1,H1,b_,v_,X$=F(()=>{se(),fe(),qe(),Zr(),me(),q1=e=>{if(!e||e.length!==1)throw new Error("Softmax op requires 1 input.")},H1=(e,t)=>{let r=e.inputs[0],i=r.dims,a=O.size(i),n=i.length,s=O.normalizeAxis(t.axis,n),u=s<i.length-1,l,h=[];u?(h=Array.from({length:n},(A,M)=>M),h[s]=n-1,h[n-1]=s,l=e.compute(It(r,h),{inputs:[r],outputs:[-1]})[0]):l=r;let p=l.dims,m=p[n-1],g=a/m,_=We(m),w=m/_,b=64;g===1&&(b=256);let k=(A,M)=>M===4?`max(max(${A}.x, ${A}.y), max(${A}.z, ${A}.w))`:M===2?`max(${A}.x, ${A}.y)`:M===3?`max(max(${A}.x, ${A}.y), ${A}.z)`:A,$=B("x",l.dataType,l.dims,_),v=K("result",l.dataType,l.dims,_),T=$.type.value,S=nt(l.dataType)==="f32"?`var threadMax = ${T}(-3.402823e+38f);`:`var threadMax = ${T}(-65504.0h);`,E=A=>`
      var<workgroup> rowMaxShared : ${T};
      var<workgroup> rowSumShared : ${T};
      var<workgroup> threadShared : array<${T}, ${b}>;

      fn getValue(row: i32, col: i32, row_stride: i32) -> ${T} {
        let index = row * row_stride + col;
        return x[index];
      }

      fn setValue(row: i32, col: i32, row_stride: i32, value: ${T}) {
        let index = row * row_stride + col;
        result[index] = value;
      }
      ${A.registerUniform("packedCols","i32").declareVariables($,v)}
      ${A.mainStart(b)}
        let gindex = i32(global_idx);
        let lindex = i32(local_idx);
        const wg = ${b};
        let row = gindex / wg;
        let cols = uniforms.packedCols;
        let row_stride : i32 = uniforms.packedCols;

        // find the rows max
        ${S}
        for (var col = lindex; col < cols; col += wg) {
          let value = getValue(row, col, row_stride);
          threadMax = max(threadMax, value);
        }
        if (lindex < cols) {
          threadShared[lindex] = threadMax;
        }
        workgroupBarrier();

        var reduceSize = min(cols, wg);
        for (var currSize = reduceSize >> 1;  currSize > 0; currSize = reduceSize >> 1) {
          reduceSize = currSize + (reduceSize & 1);
          if (lindex < currSize) {
            threadShared[lindex] = max(threadShared[lindex], threadShared[lindex + reduceSize]);
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowMaxShared = ${T}(${k("threadShared[0]",_)});
        }
        workgroupBarrier();

        // find the rows sum
        var threadSum = ${T}(0.0);
        for (var col = lindex; col < cols; col += wg) {
          let subExp = exp(getValue(row, col, row_stride) - rowMaxShared);
          threadSum += subExp;
        }
        threadShared[lindex] = threadSum;
        workgroupBarrier();

        for (var currSize = wg >> 1;  currSize > 0; currSize = currSize >> 1) {
          if (lindex < currSize) {
            threadShared[lindex] = threadShared[lindex] + threadShared[lindex + currSize];
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowSumShared = ${T}(${Kr("threadShared[0]",_)});
        }
        workgroupBarrier();

        // calculate final value for each element in the row
        for (var col = lindex; col < cols; col += wg) {
          let value = exp(getValue(row, col, row_stride) - rowMaxShared) / rowSumShared;
          setValue(row, col, row_stride, value);
        }
      }`,C=e.compute({name:"Softmax",shaderCache:{hint:`${_};${b}`,inputDependencies:["type"]},getRunData:()=>({outputs:[{dims:p,dataType:l.dataType}],dispatchGroup:{x:g},programUniforms:[{type:6,data:w}]}),getShaderSource:E},{inputs:[l],outputs:[u?-1:0]})[0];u&&e.compute(It(C,h),{inputs:[C]})},b_=(e,t)=>{q1(e.inputs),H1(e,t)},v_=e=>Ce({axis:e.axis})}),Ko,K1,X1,Y1,$_,Y$=F(()=>{se(),fe(),me(),Ko=e=>Array.from(e.getBigInt64Array(),Number),K1=e=>{if(!e||e.length!==2)throw new Error("Tile requires 2 inputs.");if(e[0].dataType!==1&&e[0].dataType!==10&&e[0].dataType!==6&&e[0].dataType!==12)throw new Error("Tile only support float, float16, int32, and uint32 data types");if(e[1].dataType!==7)throw new Error("Tile `repeats` input should be of int64 data type");if(e[1].dims.length!==1)throw new Error("Tile `repeats` input should be 1-D");if(Ko(e[1]).length!==e[0].dims.length)throw new Error("Tile `repeats` input should have same number of elements as rank of input data tensor")},X1=(e,t)=>{let r=[];for(let i=0;i<e.length;++i)r.push(e[i]*t[i]);return r},Y1=(e,t)=>{let r=e[0].dims,i=t??Ko(e[1]),a=X1(r,i),n=O.size(a),s=e[0].dataType,u=B("input",s,r.length),l=K("output",s,a.length),h=p=>`
      const inputShape = ${u.indices(...r)};
      ${p.registerUniform("output_size","u32").declareVariables(u,l)}
      ${p.mainStart()}
      ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let output_indices = ${l.offsetToIndices("global_idx")};
      var input_indices: ${u.type.indices};
      for (var i = 0; i < ${r.length}; i++) {
        let input_dim_i = ${u.indicesGet("uniforms.input_shape","i")};
        let input_dim_value = ${l.indicesGet("output_indices","i")}  % input_dim_i;

        ${u.indicesSet("input_indices","i","input_dim_value")}
      }
      ${l.setByOffset("global_idx",u.getByIndices("input_indices"))}
    }`;return{name:"Tile",shaderCache:{hint:`${i}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:a,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(n/64)},programUniforms:[{type:12,data:n},...Y(e[0].dims,a)]}),getShaderSource:h}},$_=e=>{K1(e.inputs),e.compute(Y1(e.inputs),{inputs:[0]})}}),Q1,Z1,x_,Q$=F(()=>{se(),fe(),me(),Q1=(e,t,r,i,a)=>{let n=K("output_data",a,r.length,4),s=B("a_data",t[1].dataType,t[1].dims.length,4),u=B("b_data",t[2].dataType,t[2].dims.length,4),l=B("c_data",t[0].dataType,t[0].dims.length,4),h,p=(m,g,_)=>`select(${g}, ${m}, ${_})`;if(!i)h=n.setByOffset("global_idx",p(s.getByOffset("global_idx"),u.getByOffset("global_idx"),l.getByOffset("global_idx")));else{let m=(g,_,w="")=>{let b=`a_data[index_a${_}][component_a${_}]`,k=`b_data[index_b${_}][component_b${_}]`,$=`bool(c_data[index_c${_}] & (0xffu << (component_c${_} * 8)))`;return`
            let output_indices${_} = ${n.offsetToIndices(`global_idx * 4u + ${_}u`)};
            let offset_a${_} = ${s.broadcastedIndicesToOffset(`output_indices${_}`,n)};
            let offset_b${_} = ${u.broadcastedIndicesToOffset(`output_indices${_}`,n)};
            let offset_c${_} = ${l.broadcastedIndicesToOffset(`output_indices${_}`,n)};
            let index_a${_} = offset_a${_} / 4u;
            let index_b${_} = offset_b${_} / 4u;
            let index_c${_} = offset_c${_} / 4u;
            let component_a${_} = offset_a${_} % 4u;
            let component_b${_} = offset_b${_} % 4u;
            let component_c${_} = offset_c${_} % 4u;
            ${g}[${_}] = ${w}(${p(b,k,$)});
          `};a===9?h=`
            var data = vec4<u32>(0);
            ${m("data",0,"u32")}
            ${m("data",1,"u32")}
            ${m("data",2,"u32")}
            ${m("data",3,"u32")}
            output_data[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:h=`
            ${m("output_data[global_idx]",0)}
            ${m("output_data[global_idx]",1)}
            ${m("output_data[global_idx]",2)}
            ${m("output_data[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables(l,s,u,n)}
        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${h}
      }`},Z1=e=>{let t=e[1].dims,r=e[2].dims,i=e[0].dims,a=e[1].dataType,n=!(O.areEqual(t,r)&&O.areEqual(r,i)),s=t,u=O.size(t);if(n){let h=Hi.calcShape(Hi.calcShape(t,r,!1),i,!1);if(!h)throw new Error("Can't perform where op on the given tensors");s=h,u=O.size(s)}let l=Math.ceil(u/4);return{name:"Where",shaderCache:{inputDependencies:["rank","rank","rank"]},getShaderSource:h=>Q1(h,e,s,n,a),getRunData:()=>({outputs:[{dims:s,dataType:a}],dispatchGroup:{x:Math.ceil(u/64/4)},programUniforms:[{type:12,data:l},...Y(i,t,r,s)]})}},x_=e=>{e.compute(Z1(e.inputs))}}),k_,Z$=F(()=>{h$(),rd(),c$(),p$(),f$(),m$(),g$(),v$(),x$(),k$(),S$(),T$(),E$(),I$(),C$(),A$(),z$(),O$(),R$(),M$(),B$(),N$(),P$(),D$(),L$(),Gy(),U$(),F$(),W$(),V$(),G$(),td(),j$(),q$(),H$(),K$(),X$(),Hy(),Y$(),Zr(),id(),Q$(),k_=new Map([["Abs",[_3]],["Acos",[w3]],["Acosh",[b3]],["Add",[ey]],["ArgMax",[f3,ku]],["ArgMin",[p3,ku]],["Asin",[v3]],["Asinh",[$3]],["Atan",[x3]],["Atanh",[k3]],["Attention",[m3]],["AveragePool",[r_,t_]],["BatchNormalization",[g3]],["BiasAdd",[y3]],["BiasSplitGelu",[J3]],["Cast",[T3,S3]],["Ceil",[I3]],["Clip",[E3]],["Concat",[dy,hy]],["Conv",[Au,Cu]],["ConvTranspose",[vy,by]],["Cos",[C3]],["Cosh",[A3]],["CumSum",[$y,xy]],["DepthToSpace",[ky,Sy]],["DequantizeLinear",[l_,d_]],["Div",[ty]],["Einsum",[Ty,Ey]],["Elu",[z3,En]],["Equal",[ry]],["Erf",[O3]],["Exp",[R3]],["Expand",[Iy]],["FastGelu",[Cy]],["Floor",[M3]],["FusedConv",[Au,Cu]],["Gather",[zy,Ay]],["GatherElements",[Py,Ny]],["GatherBlockQuantized",[My,By]],["GatherND",[Oy,Ry]],["Gelu",[B3]],["Gemm",[Ly,Dy]],["GlobalAveragePool",[n_,i_]],["GlobalMaxPool",[u_,o_]],["Greater",[sy]],["GreaterOrEqual",[uy]],["GridSample",[Uy,Fy]],["GroupQueryAttention",[Ky]],["HardSigmoid",[V3,W3]],["InstanceNormalization",[Xy]],["LayerNormalization",[Yy]],["LeakyRelu",[N3,En]],["Less",[oy]],["LessOrEqual",[ly]],["Log",[Q3]],["MatMul",[Qy]],["MatMulNBits",[Zy,Jy]],["MaxPool",[a_,s_]],["Mul",[iy]],["MultiHeadAttention",[Vy,Wy]],["Neg",[D3]],["Not",[P3]],["Pad",[e_]],["Pow",[ny]],["QuickGelu",[Z3,En]],["Range",[h_]],["Reciprocal",[L3]],["ReduceMin",[u3]],["ReduceMean",[i3]],["ReduceMax",[o3]],["ReduceSum",[d3]],["ReduceProd",[l3]],["ReduceL1",[n3]],["ReduceL2",[a3]],["ReduceLogSum",[c3]],["ReduceLogSumExp",[s3]],["ReduceSumSquare",[h3]],["Relu",[U3]],["Resize",[f_,m_]],["RotaryEmbedding",[g_]],["ScatterND",[p_,c_]],["Sigmoid",[F3]],["Sin",[G3]],["Sinh",[j3]],["Slice",[__,w_]],["SkipLayerNormalization",[y_]],["Split",[jy,qy]],["Sqrt",[q3]],["Softmax",[b_,v_]],["Sub",[ay]],["Tan",[H3]],["Tanh",[K3]],["ThresholdedRelu",[Y3,En]],["Tile",[$_]],["Transpose",[jg,qg]],["Where",[x_]]])}),S_,J$=F(()=>{nr(),Ar(),me(),S_=class{constructor(e){this.backend=e,this.repo=new Map,this.attributesBound=!1}getArtifact(e){return this.repo.get(e)}setArtifact(e,t){this.repo.set(e,t)}run(e,t,r,i,a){mr(e.programInfo.name);let n=this.backend.device,s=this.backend.getComputePassEncoder();this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2);let u=[];for(let h of t)u.push({binding:u.length,resource:{buffer:h.buffer}});for(let h of r)u.push({binding:u.length,resource:{buffer:h.buffer}});a&&u.push({binding:u.length,resource:a});let l=n.createBindGroup({layout:e.computePipeline.getBindGroupLayout(0),entries:u,label:e.programInfo.name});if(this.backend.sessionStatus==="capturing"){let h={kernelId:this.backend.currentKernelId,computePipeline:e.computePipeline,bindGroup:l,dispatchGroup:i};this.backend.capturedCommandList.get(this.backend.currentSessionId).push(h)}s.setPipeline(e.computePipeline),s.setBindGroup(0,l),s.dispatchWorkgroups(...i),this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2+1),this.backend.pendingDispatchNumber++,(this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber||this.backend.queryType==="at-passes")&&this.backend.endComputePass(),this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber&&this.backend.flush(),Jt(e.programInfo.name)}dispose(){}build(e,t){mr(e.name);let r=this.backend.device,i=[];[{feature:"shader-f16",extension:"f16"},{feature:"subgroups",extension:"subgroups"},{feature:"subgroups-f16",extension:"subgroups_f16"}].forEach(h=>{r.features.has(h.feature)&&i.push(`enable ${h.extension};`)});let a=Gg(t,this.backend.device.limits),n=e.getShaderSource(a),s=`${i.join(`
`)}
${a.additionalImplementations}
${n}`,u=r.createShaderModule({code:s,label:e.name});_e("verbose",()=>`[WebGPU] ${e.name} shader code: ${s}`);let l=r.createComputePipeline({compute:{module:u,entryPoint:"main"},layout:"auto",label:e.name});return Jt(e.name),{programInfo:e,computePipeline:l,uniformVariablesInfo:a.variablesInfo}}normalizeDispatchGroupSize(e){let t=typeof e=="number"?e:e.x,r=typeof e=="number"?1:e.y||1,i=typeof e=="number"?1:e.z||1,a=this.backend.device.limits.maxComputeWorkgroupsPerDimension;if(t<=a&&r<=a&&i<=a)return[t,r,i];let n=t*r*i,s=Math.ceil(Math.sqrt(n));if(s>a){if(s=Math.ceil(Math.cbrt(n)),s>a)throw new Error("Total dispatch size exceeds WebGPU maximum.");return[s,s,s]}else return[s,s,1]}}}),J1,e2,t2,r2,T_,ex=F(()=>{nr(),se(),Ar(),Dg(),l$(),Z$(),J$(),J1=(e,t)=>{if(t.length!==e.length)throw new Error(`inputDependencies length ${t.length} is not equal to inputTensors length ${e.length}.`);let r=[];for(let i=0;i<e.length;++i){let a=e[i].dataType;switch(t[i]){case"none":{r.push("");break}case"type":{r.push(`${a}`);break}case"rank":{let n=e[i].dims.length;r.push(`${a};${n}`);break}case"dims":{let n=e[i].dims.join(",");r.push(`${a};${n}`);break}default:throw new Error(`unsupported input dependency: ${t[i]}`)}}return r.join("|")},e2=(e,t,r)=>{var a,n;let i=e.name;return(a=e.shaderCache)!=null&&a.hint&&(i+="["+e.shaderCache.hint+"]"),i+=":"+r+`:${J1(t,((n=e.shaderCache)==null?void 0:n.inputDependencies)??new Array(t.length).fill("dims"))}`,i},t2=class{constructor(e){e&&(this.architecture=e.architecture,this.vendor=e.vendor)}isArchitecture(e){return this.architecture===e}isVendor(e){return this.vendor===e}},r2=class{constructor(e){this.subgroupsSupported=e.features.has("subgroups"),this.subgroupsF16Supported=e.features.has("subgroups");let t=e.limits;!this.subgroupsSupported||!t.minSubgroupSize||!t.maxSubgroupSize?this.subgroupSizeRange=void 0:this.subgroupSizeRange=[t.minSubgroupSize,t.maxSubgroupSize]}},T_=class{constructor(){this.currentSessionId=null,this.currentKernelId=null,this.commandEncoder=null,this.computePassEncoder=null,this.maxDispatchNumber=16,this.pendingDispatchNumber=0,this.pendingKernels=[],this.pendingQueries=new Map,this.sessionStatus="default",this.capturedCommandList=new Map,this.capturedPendingKernels=new Map,this.sessionExternalDataMapping=new Map}get currentKernelCustomData(){if(this.currentKernelId===null)throw new Error("currentKernelCustomData(): currentKernelId is null. (should not happen)");let e=this.kernelCustomData.get(this.currentKernelId);return e||(e={},this.kernelCustomData.set(this.currentKernelId,e)),e}async initialize(e,t){this.env=e;let r=[],i={requiredLimits:{maxComputeWorkgroupStorageSize:t.limits.maxComputeWorkgroupStorageSize,maxComputeWorkgroupsPerDimension:t.limits.maxComputeWorkgroupsPerDimension,maxStorageBufferBindingSize:t.limits.maxStorageBufferBindingSize,maxBufferSize:t.limits.maxBufferSize,maxComputeInvocationsPerWorkgroup:t.limits.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupSizeX:t.limits.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.limits.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:t.limits.maxComputeWorkgroupSizeZ},requiredFeatures:r},a=n=>t.features.has(n)&&r.push(n)&&!0;a("chromium-experimental-timestamp-query-inside-passes")||a("timestamp-query"),a("shader-f16"),a("subgroups")&&a("subgroups-f16"),this.device=await t.requestDevice(i),this.deviceInfo=new r2(this.device),this.adapterInfo=new t2(t.info||await t.requestAdapterInfo()),this.gpuDataManager=Lg(this),this.programManager=new S_(this),this.kernels=new Map,this.kernelPersistentData=new Map,this.kernelCustomData=new Map,Ql(e.logLevel,!!e.debug),this.device.onuncapturederror=n=>{n.error instanceof GPUValidationError&&console.error(`An uncaught WebGPU validation error was raised: ${n.error.message}`)},Object.defineProperty(this.env.webgpu,"device",{value:this.device,writable:!1,enumerable:!0,configurable:!1}),Object.defineProperty(this.env.webgpu,"adapter",{value:t,writable:!1,enumerable:!0,configurable:!1}),this.setQueryType()}dispose(){typeof this.querySet<"u"&&this.querySet.destroy(),this.gpuDataManager.dispose()}getCommandEncoder(){return this.commandEncoder||(this.commandEncoder=this.device.createCommandEncoder()),this.commandEncoder}getComputePassEncoder(){if(!this.computePassEncoder){let e=this.getCommandEncoder(),t={};this.queryType==="at-passes"&&(t.timestampWrites={querySet:this.querySet,beginningOfPassWriteIndex:this.pendingDispatchNumber*2,endOfPassWriteIndex:this.pendingDispatchNumber*2+1}),this.computePassEncoder=e.beginComputePass(t)}return this.computePassEncoder}endComputePass(){this.computePassEncoder&&(this.computePassEncoder.end(),this.computePassEncoder=null)}flush(){if(!this.commandEncoder)return;mr(),this.endComputePass();let e;this.queryType!=="none"&&(this.commandEncoder.resolveQuerySet(this.querySet,0,this.pendingDispatchNumber*2,this.queryResolveBuffer,0),e=this.device.createBuffer({size:this.pendingDispatchNumber*2*8,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),this.pendingQueries.set(e,this.pendingKernels),this.pendingKernels=[],this.commandEncoder.copyBufferToBuffer(this.queryResolveBuffer,0,e,0,this.pendingDispatchNumber*2*8)),this.device.queue.submit([this.commandEncoder.finish()]),this.gpuDataManager.refreshPendingBuffers(),this.commandEncoder=null,this.pendingDispatchNumber=0,this.queryType!=="none"&&e.mapAsync(GPUMapMode.READ).then(()=>{var i;let t=new BigUint64Array(e.getMappedRange()),r=this.pendingQueries.get(e);for(let a=0;a<t.length/2;a++){let n=r[a],s=n.kernelId,u=this.kernels.get(s),l=u.kernelType,h=u.kernelName,p=n.programName,m=n.inputTensorViews,g=n.outputTensorViews,_=t[a*2],w=t[a*2+1];typeof this.queryTimeBase>"u"&&(this.queryTimeBase=_);let b=Number(_-this.queryTimeBase),k=Number(w-this.queryTimeBase);if(!Number.isSafeInteger(b)||!Number.isSafeInteger(k))throw new RangeError("incorrect timestamp range");if((i=this.env.webgpu.profiling)!=null&&i.ondata)this.env.webgpu.profiling.ondata({version:1,inputsMetadata:m.map($=>({dims:$.dims,dataType:di($.dataType)})),outputsMetadata:g.map($=>({dims:$.dims,dataType:di($.dataType)})),kernelId:s,kernelType:l,kernelName:h,programName:p,startTime:b,endTime:k});else{let $="";m.forEach((T,S)=>{$+=`input[${S}]: [${T.dims}] | ${di(T.dataType)}, `});let v="";g.forEach((T,S)=>{v+=`output[${S}]: [${T.dims}] | ${di(T.dataType)}, `}),console.log(`[profiling] kernel "${s}|${l}|${h}|${p}" ${$}${v}execution time: ${k-b} ns`)}Fa("GPU",`${p}::${_}::${w}`)}e.unmap(),this.pendingQueries.delete(e)}),Jt()}run(e,t,r,i,a,n){mr(e.name);let s=[];for(let v=0;v<t.length;++v){let T=t[v].data;if(T===0)continue;let S=this.gpuDataManager.get(T);if(!S)throw new Error(`no GPU data for input: ${T}`);s.push(S)}let{outputs:u,dispatchGroup:l,programUniforms:h}=e.getRunData(t),p=r.length===0?u.map((v,T)=>T):r;if(p.length!==u.length)throw new Error(`Output size ${p.length} must be equal to ${u.length}.`);let m=[],g=[];for(let v=0;v<u.length;++v){if(!Number.isInteger(p[v])||p[v]<-3||p[v]>=n)throw new Error(`Invalid output index: ${p[v]}`);if(p[v]===-3)continue;let T=p[v]===-1,S=p[v]===-2,E=T||S?a(u[v].dataType,u[v].dims):i(p[v],u[v].dataType,u[v].dims);if(m.push(E),E.data===0)continue;let C=this.gpuDataManager.get(E.data);if(!C)throw new Error(`no GPU data for output: ${E.data}`);if(T&&this.temporaryData.push(C),S){let A=this.kernelPersistentData.get(this.currentKernelId);A||(A=[],this.kernelPersistentData.set(this.currentKernelId,A)),A.push(C)}g.push(C)}if(s.length!==t.length||g.length!==m.length){if(g.length===0)return Jt(e.name),m;throw new Error(`Program ${e.name} has zero-sized tensor(s) in inputs or outputs. This is not supported now.`)}let _;if(h){let v=0,T=[];h.forEach(A=>{let M=typeof A.data=="number"?[A.data]:A.data;if(M.length===0)return;let D=A.type===10?2:4,G,oe;A.type===10?(oe=M.length>4?16:M.length>2?8:M.length*D,G=M.length>4?16:D*M.length):(oe=M.length<=2?M.length*D:16,G=16),v=Math.ceil(v/oe)*oe,T.push(v);let he=A.type===10?8:4;v+=M.length>4?Math.ceil(M.length/he)*G:M.length*D});let S=16;v=Math.ceil(v/S)*S;let E=new ArrayBuffer(v);h.forEach((A,M)=>{let D=T[M],G=typeof A.data=="number"?[A.data]:A.data;if(A.type===6)new Int32Array(E,D,G.length).set(G);else if(A.type===12)new Uint32Array(E,D,G.length).set(G);else if(A.type===10)new Uint16Array(E,D,G.length).set(G);else if(A.type===1)new Float32Array(E,D,G.length).set(G);else throw new Error(`Unsupported uniform type: ${di(A.type)}`)});let C=this.gpuDataManager.create(v,GPUBufferUsage.COPY_DST|GPUBufferUsage.UNIFORM);this.device.queue.writeBuffer(C.buffer,0,E,0,v),this.gpuDataManager.release(C.id),_={offset:0,size:v,buffer:C.buffer}}let w=this.programManager.normalizeDispatchGroupSize(l),b=w[1]===1&&w[2]===1,k=e2(e,t,b),$=this.programManager.getArtifact(k);if($||($=this.programManager.build(e,w),this.programManager.setArtifact(k,$),_e("info",()=>`[artifact] key: ${k}, programName: ${e.name}`)),h&&$.uniformVariablesInfo){if(h.length!==$.uniformVariablesInfo.length)throw new Error(`Uniform variables count mismatch: expect ${$.uniformVariablesInfo.length}, got ${h.length} in program "${$.programInfo.name}".`);for(let v=0;v<h.length;v++){let T=h[v],S=T.type,E=typeof T.data=="number"?1:T.data.length,[C,A]=$.uniformVariablesInfo[v];if(S!==C||E!==A)throw new Error(`Uniform variable ${v} mismatch: expect type ${C} with size ${A}, got type ${S} with size ${E} in program "${$.programInfo.name}".`)}}if(_e("info",()=>`[ProgramManager] run "${e.name}" (key=${k}) with ${w[0]}x${w[1]}x${w[2]}`),this.queryType!=="none"||this.sessionStatus==="capturing"){let v={kernelId:this.currentKernelId,programName:$.programInfo.name,inputTensorViews:t,outputTensorViews:m};this.pendingKernels.push(v),this.sessionStatus==="capturing"&&this.capturedPendingKernels.get(this.currentSessionId).push(v)}return this.programManager.run($,s,g,w,_),Jt(e.name),m}upload(e,t){this.gpuDataManager.upload(e,t)}memcpy(e,t){this.gpuDataManager.memcpy(e,t)}async download(e,t){await this.gpuDataManager.download(e,t)}alloc(e){return this.gpuDataManager.create(e).id}free(e){return this.gpuDataManager.release(e)}createKernel(e,t,r,i){let a=k_.get(e);if(!a)throw new Error(`kernel not implemented: ${e}`);let n={kernelType:e,kernelName:i,kernelEntry:a[0],attributes:[a[1],r]};this.kernels.set(t,n)}releaseKernel(e){let t=this.kernelPersistentData.get(e);if(t){for(let r of t)this.gpuDataManager.release(r.id);this.kernelPersistentData.delete(e)}this.kernelCustomData.delete(e),this.kernels.delete(e)}computeKernel(e,t,r){let i=this.kernels.get(e);if(!i)throw new Error(`kernel not created: ${e}`);let a=i.kernelType,n=i.kernelName,s=i.kernelEntry,u=i.attributes;if(this.currentKernelId!==null)throw new Error(`kernel "[${a}] ${n}" is not allowed to be called recursively`);this.currentKernelId=e,u[0]&&(u[1]=u[0](u[1]),u[0]=void 0),_e("info",()=>`[WebGPU] Start to run kernel "[${a}] ${n}"...`);let l=this.env.debug;this.temporaryData=[];try{return l&&this.device.pushErrorScope("validation"),s(t,u[1]),0}catch(h){return r.push(Promise.resolve(`[WebGPU] Kernel "[${a}] ${n}" failed. ${h}`)),1}finally{l&&r.push(this.device.popErrorScope().then(h=>h?`GPU validation error for kernel "[${a}] ${n}": ${h.message}`:null));for(let h of this.temporaryData)this.gpuDataManager.release(h.id);this.temporaryData=[],this.currentKernelId=null}}registerBuffer(e,t,r,i){let a=this.sessionExternalDataMapping.get(e);a||(a=new Map,this.sessionExternalDataMapping.set(e,a));let n=a.get(t),s=this.gpuDataManager.registerExternalBuffer(r,i,n);return a.set(t,[s,r]),s}unregisterBuffers(e){let t=this.sessionExternalDataMapping.get(e);t&&(t.forEach(r=>this.gpuDataManager.unregisterExternalBuffer(r[0])),this.sessionExternalDataMapping.delete(e))}getBuffer(e){let t=this.gpuDataManager.get(e);if(!t)throw new Error(`no GPU data for buffer: ${e}`);return t.buffer}createDownloader(e,t,r){return async()=>{let i=await vu(this,e,t);return Zl(i.buffer,r)}}writeTimestamp(e){this.queryType==="inside-passes"&&this.computePassEncoder.writeTimestamp(this.querySet,e)}setQueryType(){var e;this.queryType="none",(((e=this.env.webgpu.profiling)==null?void 0:e.mode)==="default"||(typeof this.env.trace>"u"?this.env.wasm.trace:this.env.trace))&&(this.device.features.has("chromium-experimental-timestamp-query-inside-passes")?this.queryType="inside-passes":this.device.features.has("timestamp-query")&&(this.queryType="at-passes"),this.queryType!=="none"&&typeof this.querySet>"u"&&(this.querySet=this.device.createQuerySet({type:"timestamp",count:this.maxDispatchNumber*2}),this.queryResolveBuffer=this.device.createBuffer({size:this.maxDispatchNumber*2*8,usage:GPUBufferUsage.COPY_SRC|GPUBufferUsage.QUERY_RESOLVE})))}captureBegin(){_e("info","captureBegin"),this.capturedCommandList.get(this.currentSessionId)||this.capturedCommandList.set(this.currentSessionId,[]),this.capturedPendingKernels.get(this.currentSessionId)||this.capturedPendingKernels.set(this.currentSessionId,[]),this.flush(),this.sessionStatus="capturing"}captureEnd(){_e("info","captureEnd"),this.flush(),this.sessionStatus="default"}replay(){_e("info","replay"),this.sessionStatus="replaying";let e=this.capturedCommandList.get(this.currentSessionId),t=this.capturedPendingKernels.get(this.currentSessionId),r=e.length;this.pendingKernels=[];for(let i=0;i<r;i++){let a=this.getComputePassEncoder(),n=e[i];this.writeTimestamp(this.pendingDispatchNumber*2),a.setPipeline(n.computePipeline),a.setBindGroup(0,n.bindGroup),a.dispatchWorkgroups(...n.dispatchGroup),this.writeTimestamp(this.pendingDispatchNumber*2+1),this.pendingDispatchNumber++,this.queryType!=="none"&&this.pendingKernels.push(t[i]),(this.pendingDispatchNumber>=this.maxDispatchNumber||this.queryType==="at-passes")&&this.endComputePass(),this.pendingDispatchNumber>=this.maxDispatchNumber&&this.flush()}this.flush(),this.sessionStatus="default"}onCreateSession(){this.gpuDataManager.onCreateSession()}onReleaseSession(e){this.unregisterBuffers(e),this.capturedCommandList.has(e)&&this.capturedCommandList.delete(e),this.capturedPendingKernels.has(e)&&this.capturedPendingKernels.delete(e),this.gpuDataManager.onReleaseSession(e)}onRunStart(e){this.currentSessionId=e,this.setQueryType()}}}),i2,Xo,n2,Yo,Qo,Zo,a2,E_,tx=F(()=>{Ar(),i2=1,Xo=()=>i2++,n2=new Map([["float32",32],["float16",16],["int32",32],["uint32",32],["int64",64],["uint64",64],["int8",8],["uint8",8],["int4",4],["uint4",4]]),Yo=(e,t)=>{let r=n2.get(e);if(!r)throw new Error("Unsupported data type.");return t.length>0?Math.ceil(t.reduce((i,a)=>i*a)*r/8):0},Qo=class{constructor(e){this.sessionId=e.sessionId,this.mlContext=e.context,this.mlTensor=e.tensor,this.dataType=e.dataType,this.tensorShape=e.shape}get tensor(){return this.mlTensor}get type(){return this.dataType}get shape(){return this.tensorShape}get byteLength(){return Yo(this.dataType,this.tensorShape)}destroy(){_e("verbose",()=>"[WebNN] TensorWrapper.destroy"),this.mlTensor.destroy()}write(e){this.mlContext.writeTensor(this.mlTensor,e)}async read(e){return e?this.mlContext.readTensor(this.mlTensor,e):this.mlContext.readTensor(this.mlTensor)}canReuseTensor(e,t,r){return this.mlContext===e&&this.dataType===t&&this.tensorShape.length===r.length&&this.tensorShape.every((i,a)=>i===r[a])}},Zo=class{constructor(e,t){this.tensorManager=e,this.wrapper=t}get tensorWrapper(){return this.wrapper}releaseTensor(){this.tensorWrapper&&(this.tensorManager.releaseTensor(this.tensorWrapper),this.wrapper=void 0)}async ensureTensor(e,t,r,i){let a=this.tensorManager.getMLContext(e);if(this.wrapper){if(this.wrapper.canReuseTensor(a,t,r))return this.wrapper.tensor;if(i){if(this.wrapper.byteLength!==Yo(t,r))throw new Error("Unable to copy data to tensor with different size.");this.activeUpload=new Uint8Array(await this.wrapper.read())}this.tensorManager.releaseTensor(this.wrapper)}let n=typeof MLTensorUsage>"u"?void 0:MLTensorUsage.READ|MLTensorUsage.WRITE;return this.wrapper=await this.tensorManager.getCachedTensor(e,t,r,n,!0,!0),i&&this.activeUpload&&(this.wrapper.write(this.activeUpload),this.activeUpload=void 0),this.wrapper.tensor}upload(e){if(this.wrapper)if(e.byteLength===this.wrapper.byteLength){this.wrapper.write(e);return}else _e("verbose",()=>"Data size does not match tensor size. Releasing tensor."),this.releaseTensor();this.activeUpload?this.activeUpload.set(e):this.activeUpload=new Uint8Array(e)}async download(e){if(this.activeUpload)if(e){e instanceof ArrayBuffer?new Uint8Array(e).set(this.activeUpload):new Uint8Array(e.buffer,e.byteOffset,e.byteLength).set(this.activeUpload);return}else return this.activeUpload.buffer;if(!this.wrapper)throw new Error("Tensor has not been created.");return e?this.wrapper.read(e):this.wrapper.read()}},a2=class{constructor(e){this.backend=e,this.tensorTrackersById=new Map,this.freeTensors=[],this.externalTensors=new Set}getMLContext(e){let t=this.backend.getMLContext(e);if(!t)throw new Error("MLContext not found for session.");return t}reserveTensorId(){let e=Xo();return this.tensorTrackersById.set(e,new Zo(this)),e}releaseTensorId(e){let t=this.tensorTrackersById.get(e);t&&(this.tensorTrackersById.delete(e),t.tensorWrapper&&this.releaseTensor(t.tensorWrapper))}async ensureTensor(e,t,r,i,a){_e("verbose",()=>`[WebNN] TensorManager.ensureTensor {tensorId: ${t}, dataType: ${r}, shape: ${i}, copyOld: ${a}}`);let n=this.tensorTrackersById.get(t);if(!n)throw new Error("Tensor not found.");return n.ensureTensor(e,r,i,a)}upload(e,t){let r=this.tensorTrackersById.get(e);if(!r)throw new Error("Tensor not found.");r.upload(t)}async download(e,t){_e("verbose",()=>`[WebNN] TensorManager.download {tensorId: ${e}, dstBuffer: ${t==null?void 0:t.byteLength}}`);let r=this.tensorTrackersById.get(e);if(!r)throw new Error("Tensor not found.");return r.download(t)}releaseTensorsForSession(e){for(let t of this.freeTensors)t.sessionId===e&&t.destroy();this.freeTensors=this.freeTensors.filter(t=>t.sessionId!==e)}registerTensor(e,t,r,i){let a=this.getMLContext(e),n=Xo(),s=new Qo({sessionId:e,context:a,tensor:t,dataType:r,shape:i});return this.tensorTrackersById.set(n,new Zo(this,s)),this.externalTensors.add(s),n}async getCachedTensor(e,t,r,i,a,n){let s=this.getMLContext(e);for(let[l,h]of this.freeTensors.entries())if(h.canReuseTensor(s,t,r)){_e("verbose",()=>`[WebNN] Reusing tensor {dataType: ${t}, shape: ${r}}`);let p=this.freeTensors.splice(l,1)[0];return p.sessionId=e,p}_e("verbose",()=>`[WebNN] MLContext.createTensor {dataType: ${t}, shape: ${r}}`);let u=await s.createTensor({dataType:t,shape:r,dimensions:r,usage:i,writable:a,readable:n});return new Qo({sessionId:e,context:s,tensor:u,dataType:t,shape:r})}releaseTensor(e){this.externalTensors.has(e)&&this.externalTensors.delete(e),this.freeTensors.push(e)}},E_=(...e)=>new a2(...e)}),ga,s2,I_,rx=F(()=>{se(),vi(),Dg(),tx(),Ar(),ga=new Map([[1,"float32"],[10,"float16"],[6,"int32"],[12,"uint32"],[7,"int64"],[13,"uint64"],[22,"int4"],[21,"uint4"],[3,"int8"],[2,"uint8"],[9,"uint8"]]),s2=(e,t)=>{if(e===t)return!0;if(e===void 0||t===void 0)return!1;let r=Object.keys(e).sort(),i=Object.keys(t).sort();return r.length===i.length&&r.every((a,n)=>a===i[n]&&e[a]===t[a])},I_=class{constructor(e){this.tensorManager=E_(this),this.mlContextBySessionId=new Map,this.sessionIdsByMLContext=new Map,this.mlContextCache=[],this.sessionGraphInputs=new Map,this.temporaryGraphInputs=[],this.temporarySessionTensorIds=new Map,Ql(e.logLevel,!!e.debug)}get currentSessionId(){if(this.activeSessionId===void 0)throw new Error("No active session");return this.activeSessionId}onRunStart(e){_e("verbose",()=>`[WebNN] onRunStart {sessionId: ${e}}`),this.activeSessionId=e}onRunEnd(e){_e("verbose",()=>`[WebNN] onRunEnd {sessionId: ${e}}`);let t=this.temporarySessionTensorIds.get(e);if(t){for(let r of t)_e("verbose",()=>`[WebNN] releasing temporary tensor {tensorId: ${r}}`),this.tensorManager.releaseTensorId(r);this.temporarySessionTensorIds.delete(e),this.activeSessionId=void 0}}async createMLContext(e){if(e instanceof GPUDevice){let r=this.mlContextCache.findIndex(i=>i.gpuDevice===e);if(r!==-1)return this.mlContextCache[r].mlContext;{let i=await navigator.ml.createContext(e);return this.mlContextCache.push({gpuDevice:e,mlContext:i}),i}}else if(e===void 0){let r=this.mlContextCache.findIndex(i=>i.options===void 0&&i.gpuDevice===void 0);if(r!==-1)return this.mlContextCache[r].mlContext;{let i=await navigator.ml.createContext();return this.mlContextCache.push({mlContext:i}),i}}let t=this.mlContextCache.findIndex(r=>s2(r.options,e));if(t!==-1)return this.mlContextCache[t].mlContext;{let r=await navigator.ml.createContext(e);return this.mlContextCache.push({options:e,mlContext:r}),r}}registerMLContext(e,t){this.mlContextBySessionId.set(e,t);let r=this.sessionIdsByMLContext.get(t);r||(r=new Set,this.sessionIdsByMLContext.set(t,r)),r.add(e),this.temporaryGraphInputs.length>0&&(this.sessionGraphInputs.set(e,this.temporaryGraphInputs),this.temporaryGraphInputs=[])}onReleaseSession(e){this.sessionGraphInputs.delete(e);let t=this.mlContextBySessionId.get(e);if(!t)return;this.tensorManager.releaseTensorsForSession(e),this.mlContextBySessionId.delete(e);let r=this.sessionIdsByMLContext.get(t);if(r.delete(e),r.size===0){this.sessionIdsByMLContext.delete(t);let i=this.mlContextCache.findIndex(a=>a.mlContext===t);i!==-1&&this.mlContextCache.splice(i,1)}}getMLContext(e){return this.mlContextBySessionId.get(e)}reserveTensorId(){return this.tensorManager.reserveTensorId()}releaseTensorId(e){_e("verbose",()=>`[WebNN] releaseTensorId {tensorId: ${e}}`),this.tensorManager.releaseTensorId(e)}async ensureTensor(e,t,r,i,a){let n=ga.get(r);if(!n)throw new Error(`Unsupported ONNX data type: ${r}`);return this.tensorManager.ensureTensor(e??this.currentSessionId,t,n,i,a)}async createTemporaryTensor(e,t,r){_e("verbose",()=>`[WebNN] createTemporaryTensor {onnxDataType: ${t}, shape: ${r}}`);let i=ga.get(t);if(!i)throw new Error(`Unsupported ONNX data type: ${t}`);let a=this.tensorManager.reserveTensorId();await this.tensorManager.ensureTensor(e,a,i,r,!1);let n=this.temporarySessionTensorIds.get(e);return n?n.push(a):this.temporarySessionTensorIds.set(e,[a]),a}uploadTensor(e,t){if(!rt().shouldTransferToMLTensor)throw new Error("Trying to upload to a MLTensor while shouldTransferToMLTensor is false");_e("verbose",()=>`[WebNN] uploadTensor {tensorId: ${e}, data: ${t.byteLength}}`),this.tensorManager.upload(e,t)}async downloadTensor(e,t){return this.tensorManager.download(e,t)}createMLTensorDownloader(e,t){return async()=>{let r=await this.tensorManager.download(e);return Zl(r,t)}}registerMLTensor(e,t,r,i){let a=ga.get(r);if(!a)throw new Error(`Unsupported ONNX data type: ${r}`);let n=this.tensorManager.registerTensor(e,t,a,i);return _e("verbose",()=>`[WebNN] registerMLTensor {tensor: ${t}, dataType: ${a}, dimensions: ${i}} -> {tensorId: ${n}}`),n}registerMLConstant(e,t,r,i,a,n){if(!n)throw new Error("External mounted files are not available.");let s=e;e.startsWith("./")&&(s=e.substring(2));let u=n.get(s);if(!u)throw new Error(`File with name ${s} not found in preloaded files.`);if(t+r>u.byteLength)throw new Error("Out of bounds: data offset and length exceed the external file data size.");let l=u.slice(t,t+r).buffer,h;switch(a.dataType){case"float32":h=new Float32Array(l);break;case"float16":h=new Uint16Array(l);break;case"int32":h=new Int32Array(l);break;case"uint32":h=new Uint32Array(l);break;case"int64":h=new BigInt64Array(l);break;case"uint64":h=new BigUint64Array(l);break;case"int8":h=new Int8Array(l);break;case"int4":case"uint4":case"uint8":h=new Uint8Array(l);break;default:throw new Error(`Unsupported data type: ${a.dataType} in creating WebNN Constant from external data.`)}return _e("verbose",()=>`[WebNN] registerMLConstant {dataType: ${a.dataType}, shape: ${a.shape}}}`),i.constant(a,h)}registerGraphInput(e){this.temporaryGraphInputs.push(e)}isGraphInput(e,t){let r=this.sessionGraphInputs.get(e);return r?r.includes(t):!1}flush(){}}}),C_={};Vn(C_,{init:()=>A_});var ya,o2,A_,ix=F(()=>{se(),ex(),Ar(),fe(),rx(),ya=class z_{constructor(t,r,i,a){this.module=t,this.dataType=r,this.data=i,this.dims=a}getFloat32Array(){if(this.dataType!==1)throw new Error("Invalid data type");let t=O.size(this.dims);return t===0?new Float32Array:new Float32Array(this.module.HEAP8.buffer,this.data,t)}getBigInt64Array(){if(this.dataType!==7)throw new Error("Invalid data type");let t=O.size(this.dims);return t===0?new BigInt64Array:new BigInt64Array(this.module.HEAP8.buffer,this.data,t)}getInt32Array(){if(this.dataType!==6)throw new Error("Invalid data type");let t=O.size(this.dims);return t===0?new Int32Array:new Int32Array(this.module.HEAP8.buffer,this.data,t)}getUint16Array(){if(this.dataType!==10&&this.dataType!==4)throw new Error("Invalid data type");let t=O.size(this.dims);return t===0?new Uint16Array:new Uint16Array(this.module.HEAP8.buffer,this.data,t)}reshape(t){if(O.size(t)!==O.size(this.dims))throw new Error("Invalid new shape");return new z_(this.module,this.dataType,this.data,t)}},o2=class{constructor(e,t,r){this.module=e,this.backend=t,this.customDataOffset=0,this.customDataSize=0,this.adapterInfo=t.adapterInfo,this.deviceInfo=t.deviceInfo;let i=e.PTR_SIZE,a=r/e.PTR_SIZE,n=i===4?"i32":"i64";this.opKernelContext=Number(e.getValue(i*a++,n));let s=Number(e.getValue(i*a++,n));this.outputCount=Number(e.getValue(i*a++,n)),this.customDataOffset=Number(e.getValue(i*a++,"*")),this.customDataSize=Number(e.getValue(i*a++,n));let u=[];for(let l=0;l<s;l++){let h=Number(e.getValue(i*a++,n)),p=Number(e.getValue(i*a++,"*")),m=Number(e.getValue(i*a++,n)),g=[];for(let _=0;_<m;_++)g.push(Number(e.getValue(i*a++,n)));u.push(new ya(e,h,p,g))}this.inputs=u}get kernelCustomData(){return this.backend.currentKernelCustomData}get customDataBuffer(){return this.module.HEAPU8.subarray(this.customDataOffset,this.customDataOffset+this.customDataSize)}compute(e,t){var s;let r=((s=t==null?void 0:t.inputs)==null?void 0:s.map(u=>typeof u=="number"?this.inputs[u]:u))??this.inputs,i=(t==null?void 0:t.outputs)??[],a=(u,l,h)=>new ya(this.module,l,this.output(u,h),h),n=(u,l)=>{let h=hi(u,l);if(!h)throw new Error(`Unsupported data type: ${u}`);let p=h>0?this.backend.gpuDataManager.create(h).id:0;return new ya(this.module,u,p,l)};return this.backend.run(e,r,i,a,n,this.outputCount)}output(e,t){let r=this.module.stackSave();try{let i=this.module.PTR_SIZE,a=i===4?"i32":"i64",n=this.module.stackAlloc((1+t.length)*i);this.module.setValue(n,t.length,a);for(let s=0;s<t.length;s++)this.module.setValue(n+i*(s+1),t[s],a);return this.module._JsepOutput(this.opKernelContext,e,n)}catch(i){throw new Error(`Failed to generate kernel's output[${e}] with dims [${t}]. If you are running with pre-allocated output, please make sure the output type/dims are correct. Error: ${i}`)}finally{this.module.stackRestore(r)}}},A_=async(e,t,r,i)=>{let a=t.jsepInit;if(!a)throw new Error("Failed to initialize JSEP. The WebAssembly module is not built with JSEP support.");if(e==="webgpu"){let n=new T_;await n.initialize(r,i),a("webgpu",[n,s=>n.alloc(Number(s)),s=>n.free(s),(s,u,l,h=!1)=>{if(h)_e("verbose",()=>`[WebGPU] jsepCopyGpuToGpu: src=${Number(s)}, dst=${Number(u)}, size=${Number(l)}`),n.memcpy(Number(s),Number(u));else{_e("verbose",()=>`[WebGPU] jsepCopyCpuToGpu: dataOffset=${Number(s)}, gpuDataId=${Number(u)}, size=${Number(l)}`);let p=t.HEAPU8.subarray(Number(s>>>0),Number(s>>>0)+Number(l));n.upload(Number(u),p)}},async(s,u,l)=>{_e("verbose",()=>`[WebGPU] jsepCopyGpuToCpu: gpuDataId=${s}, dataOffset=${u}, size=${l}`),await n.download(Number(s),()=>t.HEAPU8.subarray(Number(u)>>>0,Number(u+l)>>>0))},(s,u,l)=>n.createKernel(s,Number(u),l,t.UTF8ToString(t._JsepGetNodeName(Number(u)))),s=>n.releaseKernel(s),(s,u,l,h)=>{_e("verbose",()=>`[WebGPU] jsepRun: sessionHandle=${l}, kernel=${s}, contextDataOffset=${u}`);let p=new o2(t,n,Number(u));return n.computeKernel(Number(s),p,h)},()=>n.captureBegin(),()=>n.captureEnd(),()=>n.replay()])}else{let n=new I_(r);a("webnn",[n,()=>n.reserveTensorId(),s=>n.releaseTensorId(s),async(s,u,l,h,p)=>n.ensureTensor(s,u,l,h,p),(s,u)=>{n.uploadTensor(s,u)},async(s,u)=>n.downloadTensor(s,u)])}}}),u2,ld,dd,Lr,l2,Ha,hd,cd,Jo,pd,fd,md,O_=F(()=>{o$(),u$(),se(),vi(),ql(),Pg(),u2=(e,t)=>{rt()._OrtInit(e,t)!==0&&xe("Can't initialize onnxruntime.")},ld=async e=>{u2(e.wasm.numThreads,Va(e.logLevel))},dd=async(e,t)=>{{let r=(ix(),Ua(C_)).init;if(t==="webgpu"){if(typeof navigator>"u"||!navigator.gpu)throw new Error("WebGPU is not supported in current environment");let i=e.webgpu.adapter;if(i){if(typeof i.limits!="object"||typeof i.features!="object"||typeof i.requestDevice!="function")throw new Error("Invalid GPU adapter set in `env.webgpu.adapter`. It must be a GPUAdapter object.")}else{let a=e.webgpu.powerPreference;if(a!==void 0&&a!=="low-power"&&a!=="high-performance")throw new Error(`Invalid powerPreference setting: "${a}"`);let n=e.webgpu.forceFallbackAdapter;if(n!==void 0&&typeof n!="boolean")throw new Error(`Invalid forceFallbackAdapter setting: "${n}"`);if(i=await navigator.gpu.requestAdapter({powerPreference:a,forceFallbackAdapter:n}),!i)throw new Error('Failed to get GPU adapter. You may need to enable flag "--enable-unsafe-webgpu" if you are using Chrome.')}await r("webgpu",rt(),e,i)}if(t==="webnn"){if(typeof navigator>"u"||!navigator.ml)throw new Error("WebNN is not supported in current environment");await r("webnn",rt(),e)}}},Lr=new Map,l2=e=>{let t=rt(),r=t.stackSave();try{let i=t.PTR_SIZE,a=t.stackAlloc(2*i);t._OrtGetInputOutputCount(e,a,a+i)!==0&&xe("Can't get session input/output count.");let n=i===4?"i32":"i64";return[Number(t.getValue(a,n)),Number(t.getValue(a+i,n))]}finally{t.stackRestore(r)}},Ha=e=>{let t=rt(),r=t._malloc(e.byteLength);if(r===0)throw new Error(`Can't create a session. failed to allocate a buffer of size ${e.byteLength}.`);return t.HEAPU8.set(e,r),[r,e.byteLength]},hd=async(e,t)=>{var m,g,_;let r,i,a=rt();Array.isArray(e)?[r,i]=e:e.buffer===a.HEAPU8.buffer?[r,i]=[e.byteOffset,e.byteLength]:[r,i]=Ha(e);let n=0,s=0,u=0,l=[],h=[],p=[];try{if([s,l]=Ng(t),(t==null?void 0:t.externalData)&&a.mountExternalData){let E=[];for(let C of t.externalData){let A=typeof C=="string"?C:C.path;E.push(Yl(typeof C=="string"?C:C.data).then(M=>{a.mountExternalData(A,M)}))}await Promise.all(E)}for(let E of(t==null?void 0:t.executionProviders)??[])if((typeof E=="string"?E:E.name)==="webnn"){if(a.shouldTransferToMLTensor=!1,typeof E!="string"){let C=E,A=C==null?void 0:C.context,M=C==null?void 0:C.gpuDevice,D=C==null?void 0:C.deviceType,G=C==null?void 0:C.powerPreference;A?a.currentContext=A:M?a.currentContext=await a.jsepCreateMLContext(M):a.currentContext=await a.jsepCreateMLContext({deviceType:D,powerPreference:G})}else a.currentContext=await a.jsepCreateMLContext();break}n=await a._OrtCreateSession(r,i,s),n===0&&xe("Can't create a session."),(m=a.jsepOnCreateSession)==null||m.call(a),a.currentContext&&(a.jsepRegisterMLContext(n,a.currentContext),a.currentContext=void 0,a.shouldTransferToMLTensor=!0);let[w,b]=l2(n),k=!!(t!=null&&t.enableGraphCapture),$=[],v=[],T=[];for(let E=0;E<w;E++){let C=a._OrtGetInputName(n,E);C===0&&xe("Can't get an input name."),h.push(C),$.push(a.UTF8ToString(C))}for(let E=0;E<b;E++){let C=a._OrtGetOutputName(n,E);C===0&&xe("Can't get an output name."),p.push(C);let A=a.UTF8ToString(C);v.push(A);{if(k&&(t==null?void 0:t.preferredOutputLocation)===void 0){T.push("gpu-buffer");continue}let M=typeof(t==null?void 0:t.preferredOutputLocation)=="string"?t.preferredOutputLocation:((g=t==null?void 0:t.preferredOutputLocation)==null?void 0:g[A])??"cpu";if(M!=="cpu"&&M!=="cpu-pinned"&&M!=="gpu-buffer"&&M!=="ml-tensor")throw new Error(`Not supported preferred output location: ${M}.`);if(k&&M!=="gpu-buffer")throw new Error(`Not supported preferred output location: ${M}. Only 'gpu-buffer' location is supported when enableGraphCapture is true.`);T.push(M)}}let S=null;return T.some(E=>E==="gpu-buffer"||E==="ml-tensor")&&(u=a._OrtCreateBinding(n),u===0&&xe("Can't create IO binding."),S={handle:u,outputPreferredLocations:T,outputPreferredLocationsEncoded:T.map(E=>bu(E))}),Lr.set(n,[n,h,p,S,k,!1]),[n,$,v]}catch(w){throw h.forEach(b=>a._OrtFree(b)),p.forEach(b=>a._OrtFree(b)),u!==0&&a._OrtReleaseBinding(u)!==0&&xe("Can't release IO binding."),n!==0&&a._OrtReleaseSession(n)!==0&&xe("Can't release session."),w}finally{a._free(r),s!==0&&a._OrtReleaseSessionOptions(s)!==0&&xe("Can't release session options."),l.forEach(w=>a._free(w)),(_=a.unmountExternalData)==null||_.call(a)}},cd=e=>{var l;let t=rt(),r=Lr.get(e);if(!r)throw new Error(`cannot release session. invalid session id: ${e}`);let[i,a,n,s,u]=r;s&&(u&&t._OrtClearBoundOutputs(s.handle)!==0&&xe("Can't clear bound outputs."),t._OrtReleaseBinding(s.handle)!==0&&xe("Can't release IO binding.")),(l=t.jsepOnReleaseSession)==null||l.call(t,e),a.forEach(h=>t._OrtFree(h)),n.forEach(h=>t._OrtFree(h)),t._OrtReleaseSession(i)!==0&&xe("Can't release session."),Lr.delete(e)},Jo=async(e,t,r,i,a,n=!1)=>{if(!e){t.push(0);return}let s=rt(),u=s.PTR_SIZE,l=e[0],h=e[1],p=e[3],m=p,g,_;if(l==="string"&&(p==="gpu-buffer"||p==="ml-tensor"))throw new Error("String tensor is not supported on GPU.");if(n&&p!=="gpu-buffer")throw new Error(`External buffer must be provided for input/output index ${a} when enableGraphCapture is true.`);if(p==="gpu-buffer"){let k=e[2].gpuBuffer;_=hi(Ii(l),h);let $=s.jsepRegisterBuffer;if(!$)throw new Error('Tensor location "gpu-buffer" is not supported without using WebGPU.');g=$(i,a,k,_)}else if(p==="ml-tensor"){let k=e[2].mlTensor;_=hi(Ii(l),h);let $=s.jsepRegisterMLTensor;if(!$)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');g=$(i,k,Ii(l),h)}else{let k=e[2];if(Array.isArray(k)){_=u*k.length,g=s._malloc(_),r.push(g);for(let $=0;$<k.length;$++){if(typeof k[$]!="string")throw new TypeError(`tensor data at index ${$} is not a string`);s.setValue(g+$*u,ut(k[$],r),"*")}}else{let $=s.jsepIsGraphInput;if(l!=="string"&&$){let v=s._OrtGetInputName(i,a),T=s.UTF8ToString(v);if($(i,T)){let S=Ii(l);_=hi(S,h),m="ml-tensor";let E=s.jsepCreateTemporaryTensor,C=s.jsepUploadTensor;if(!E||!C)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');let A=await E(i,S,h);C(A,new Uint8Array(k.buffer,k.byteOffset,k.byteLength)),g=A}else _=k.byteLength,g=s._malloc(_),r.push(g),s.HEAPU8.set(new Uint8Array(k.buffer,k.byteOffset,_),g)}else _=k.byteLength,g=s._malloc(_),r.push(g),s.HEAPU8.set(new Uint8Array(k.buffer,k.byteOffset,_),g)}}let w=s.stackSave(),b=s.stackAlloc(4*h.length);try{h.forEach(($,v)=>s.setValue(b+v*u,$,u===4?"i32":"i64"));let k=s._OrtCreateTensor(Ii(l),g,_,b,h.length,bu(m));k===0&&xe(`Can't create tensor for input/output. session=${i}, index=${a}.`),t.push(k)}finally{s.stackRestore(w)}},pd=async(e,t,r,i,a,n)=>{var oe,he,Z;let s=rt(),u=s.PTR_SIZE,l=Lr.get(e);if(!l)throw new Error(`cannot run inference. invalid session id: ${e}`);let h=l[0],p=l[1],m=l[2],g=l[3],_=l[4],w=l[5],b=t.length,k=i.length,$=0,v=[],T=[],S=[],E=[],C=s.stackSave(),A=s.stackAlloc(b*u),M=s.stackAlloc(b*u),D=s.stackAlloc(k*u),G=s.stackAlloc(k*u);try{[$,v]=Bg(n);for(let V=0;V<b;V++)await Jo(r[V],T,E,e,t[V],_);for(let V=0;V<k;V++)await Jo(a[V],S,E,e,b+i[V],_);for(let V=0;V<b;V++)s.setValue(A+V*u,T[V],"*"),s.setValue(M+V*u,p[t[V]],"*");for(let V=0;V<k;V++)s.setValue(D+V*u,S[V],"*"),s.setValue(G+V*u,m[i[V]],"*");if(g&&!w){let{handle:V,outputPreferredLocations:ye,outputPreferredLocationsEncoded:Te}=g;if(p.length!==b)throw new Error(`input count from feeds (${b}) is expected to be always equal to model's input count (${p.length}).`);for(let q=0;q<b;q++){let Ee=t[q];await s._OrtBindInput(V,p[Ee],T[q])!==0&&xe(`Can't bind input[${q}] for session=${e}.`)}for(let q=0;q<k;q++){let Ee=i[q];(oe=a[q])!=null&&oe[3]?s._OrtBindOutput(V,m[Ee],S[q],0)!==0&&xe(`Can't bind pre-allocated output[${q}] for session=${e}.`):s._OrtBindOutput(V,m[Ee],0,Te[Ee])!==0&&xe(`Can't bind output[${q}] to ${ye[q]} for session=${e}.`)}Lr.set(e,[h,p,m,g,_,!0])}(he=s.jsepOnRunStart)==null||he.call(s,h);let ue;g?ue=await s._OrtRunWithBinding(h,g.handle,k,D,$):ue=await s._OrtRun(h,M,A,b,G,k,D,$),ue!==0&&xe("failed to call OrtRun().");let ne=[];for(let V=0;V<k;V++){let ye=Number(s.getValue(D+V*u,"*"));if(ye===S[V]){ne.push(a[V]);continue}let Te=s.stackSave(),q=s.stackAlloc(4*u),Ee=!1,N,W=0;try{s._OrtGetTensorData(ye,q,q+u,q+2*u,q+3*u)!==0&&xe(`Can't access output tensor data on index ${V}.`);let ge=u===4?"i32":"i64",Be=Number(s.getValue(q,ge));W=s.getValue(q+u,"*");let P=s.getValue(q+u*2,"*"),ve=Number(s.getValue(q+u*3,ge)),Rt=[];for(let Ze=0;Ze<ve;Ze++)Rt.push(Number(s.getValue(P+Ze*u,ge)));s._OrtFree(P)!==0&&xe("Can't free memory for tensor dims.");let mt=Rt.reduce((Ze,Ie)=>Ze*Ie,1);N=di(Be);let Jr=g==null?void 0:g.outputPreferredLocations[i[V]];if(N==="string"){if(Jr==="gpu-buffer"||Jr==="ml-tensor")throw new Error("String tensor is not supported on GPU.");let Ze=[];for(let Ie=0;Ie<mt;Ie++){let zr=s.getValue(W+Ie*u,"*"),nn=s.getValue(W+(Ie+1)*u,"*"),ei=Ie===mt-1?void 0:nn-zr;Ze.push(s.UTF8ToString(zr,ei))}ne.push([N,Rt,Ze,"cpu"])}else if(Jr==="gpu-buffer"&&mt>0){let Ze=s.jsepGetBuffer;if(!Ze)throw new Error('preferredLocation "gpu-buffer" is not supported without using WebGPU.');let Ie=Ze(W),zr=hi(Be,mt);if(zr===void 0||!Kl(N))throw new Error(`Unsupported data type: ${N}`);Ee=!0,ne.push([N,Rt,{gpuBuffer:Ie,download:s.jsepCreateDownloader(Ie,zr,N),dispose:()=>{s._OrtReleaseTensor(ye)!==0&&xe("Can't release tensor.")}},"gpu-buffer"])}else if(Jr==="ml-tensor"&&mt>0){let Ze=s.jsepEnsureTensor;if(!Ze)throw new Error('preferredLocation "ml-tensor" is not supported without using WebNN.');if(hi(Be,mt)===void 0||!Xl(N))throw new Error(`Unsupported data type: ${N}`);let Ie=await Ze(e,W,Be,Rt,!1);Ee=!0,ne.push([N,Rt,{mlTensor:Ie,download:s.jsepCreateMLTensorDownloader(W,N),dispose:()=>{s.jsepReleaseTensorId(W),s._OrtReleaseTensor(ye)}},"ml-tensor"])}else{let Ze=Hl(N),Ie=new Ze(mt);new Uint8Array(Ie.buffer,Ie.byteOffset,Ie.byteLength).set(s.HEAPU8.subarray(W,W+Ie.byteLength)),ne.push([N,Rt,Ie,"cpu"])}}finally{s.stackRestore(Te),N==="string"&&W&&s._free(W),Ee||s._OrtReleaseTensor(ye),(Z=s.jsepOnRunEnd)==null||Z.call(s,h)}}return g&&!_&&(s._OrtClearBoundOutputs(g.handle)!==0&&xe("Can't clear bound outputs."),Lr.set(e,[h,p,m,g,_,!1])),ne}finally{s.stackRestore(C),T.forEach(ue=>s._OrtReleaseTensor(ue)),S.forEach(ue=>s._OrtReleaseTensor(ue)),E.forEach(ue=>s._free(ue)),$!==0&&s._OrtReleaseRunOptions($),v.forEach(ue=>s._free(ue))}},fd=e=>{let t=rt(),r=Lr.get(e);if(!r)throw new Error("invalid session id");let i=r[0],a=t._OrtEndProfiling(i);a===0&&xe("Can't get an profile file name."),t._OrtFree(a)},md=e=>{let t=[];for(let r of e){let i=r[2];!Array.isArray(i)&&"buffer"in i&&t.push(i.buffer)}return t}}),Ur,yt,Ei,bn,vn,_a,eu,wa,si,oi,d2,R_,M_,B_,N_,P_,D_,L_,U_=F(()=>{nr(),O_(),vi(),Gl(),Ur=()=>!!ze.wasm.proxy&&typeof document<"u",Ei=!1,bn=!1,vn=!1,wa=new Map,si=(e,t)=>{let r=wa.get(e);r?r.push(t):wa.set(e,[t])},oi=()=>{if(Ei||!bn||vn||!yt)throw new Error("worker not ready")},d2=e=>{switch(e.data.type){case"init-wasm":Ei=!1,e.data.err?(vn=!0,eu[1](e.data.err)):(bn=!0,eu[0]()),_a&&(URL.revokeObjectURL(_a),_a=void 0);break;case"init-ep":case"copy-from":case"create":case"release":case"run":case"end-profiling":{let t=wa.get(e.data.type);e.data.err?t.shift()[1](e.data.err):t.shift()[0](e.data.out);break}}},R_=async()=>{if(!bn){if(Ei)throw new Error("multiple calls to 'initWasm()' detected.");if(vn)throw new Error("previous call to 'initWasm()' failed.");if(Ei=!0,Ur())return new Promise((e,t)=>{yt==null||yt.terminate(),Rg().then(([r,i])=>{var a;try{yt=i,yt.onerror=s=>t(s),yt.onmessage=d2,eu=[e,t];let n={type:"init-wasm",in:ze};!n.in.wasm.wasmPaths&&(r||(a=import.meta.url)!=null&&a.startsWith("file:"))&&(n.in.wasm.wasmPaths={wasm:new URL("/dev-sandbox/games/emotion/assets/ort-wasm-simd-threaded.jsep-D5Jk56-t.wasm",import.meta.url).href}),yt.postMessage(n),_a=r}catch(n){t(n)}},t)});try{await jl(ze.wasm),await ld(ze),bn=!0}catch(e){throw vn=!0,e}finally{Ei=!1}}},M_=async e=>{if(Ur())return oi(),new Promise((t,r)=>{si("init-ep",[t,r]);let i={type:"init-ep",in:{epName:e,env:ze}};yt.postMessage(i)});await dd(ze,e)},B_=async e=>Ur()?(oi(),new Promise((t,r)=>{si("copy-from",[t,r]);let i={type:"copy-from",in:{buffer:e}};yt.postMessage(i,[e.buffer])})):Ha(e),N_=async(e,t)=>{if(Ur()){if(t!=null&&t.preferredOutputLocation)throw new Error('session option "preferredOutputLocation" is not supported for proxy.');return oi(),new Promise((r,i)=>{si("create",[r,i]);let a={type:"create",in:{model:e,options:{...t}}},n=[];e instanceof Uint8Array&&n.push(e.buffer),yt.postMessage(a,n)})}else return hd(e,t)},P_=async e=>{if(Ur())return oi(),new Promise((t,r)=>{si("release",[t,r]);let i={type:"release",in:e};yt.postMessage(i)});cd(e)},D_=async(e,t,r,i,a,n)=>{if(Ur()){if(r.some(s=>s[3]!=="cpu"))throw new Error("input tensor on GPU is not supported for proxy.");if(a.some(s=>s))throw new Error("pre-allocated output tensor is not supported for proxy.");return oi(),new Promise((s,u)=>{si("run",[s,u]);let l=r,h={type:"run",in:{sessionId:e,inputIndices:t,inputs:l,outputIndices:i,options:n}};yt.postMessage(h,md(l))})}else return pd(e,t,r,i,a,n)},L_=async e=>{if(Ur())return oi(),new Promise((t,r)=>{si("end-profiling",[t,r]);let i={type:"end-profiling",in:e};yt.postMessage(i)});fd(e)}}),tu,h2,F_,nx=F(()=>{nr(),U_(),se(),Vl(),Pg(),tu=(e,t)=>{switch(e.location){case"cpu":return[e.type,e.dims,e.data,"cpu"];case"gpu-buffer":return[e.type,e.dims,{gpuBuffer:e.gpuBuffer},"gpu-buffer"];case"ml-tensor":return[e.type,e.dims,{mlTensor:e.mlTensor},"ml-tensor"];default:throw new Error(`invalid data location: ${e.location} for ${t()}`)}},h2=e=>{switch(e[3]){case"cpu":return new Zt(e[0],e[2],e[1]);case"gpu-buffer":{let t=e[0];if(!Kl(t))throw new Error(`not supported data type: ${t} for deserializing GPU tensor`);let{gpuBuffer:r,download:i,dispose:a}=e[2];return Zt.fromGpuBuffer(r,{dataType:t,dims:e[1],download:i,dispose:a})}case"ml-tensor":{let t=e[0];if(!Xl(t))throw new Error(`not supported data type: ${t} for deserializing MLTensor tensor`);let{mlTensor:r,download:i,dispose:a}=e[2];return Zt.fromMLTensor(r,{dataType:t,dims:e[1],download:i,dispose:a})}default:throw new Error(`invalid data location: ${e[3]}`)}},F_=class{async fetchModelAndCopyToWasmMemory(e){return B_(await Yl(e))}async loadModel(e,t){mr();let r;typeof e=="string"?r=await this.fetchModelAndCopyToWasmMemory(e):r=e,[this.sessionId,this.inputNames,this.outputNames]=await N_(r,t),Jt()}async dispose(){return P_(this.sessionId)}async run(e,t,r){mr();let i=[],a=[];Object.entries(e).forEach(m=>{let g=m[0],_=m[1],w=this.inputNames.indexOf(g);if(w===-1)throw new Error(`invalid input '${g}'`);i.push(_),a.push(w)});let n=[],s=[];Object.entries(t).forEach(m=>{let g=m[0],_=m[1],w=this.outputNames.indexOf(g);if(w===-1)throw new Error(`invalid output '${g}'`);n.push(_),s.push(w)});let u=i.map((m,g)=>tu(m,()=>`input "${this.inputNames[a[g]]}"`)),l=n.map((m,g)=>m?tu(m,()=>`output "${this.outputNames[s[g]]}"`):null),h=await D_(this.sessionId,a,u,s,l,r),p={};for(let m=0;m<h.length;m++)p[this.outputNames[s[m]]]=n[m]??h2(h[m]);return Jt(),p}startProfiling(){}endProfiling(){L_(this.sessionId)}}}),W_={};Vn(W_,{OnnxruntimeWebAssemblyBackend:()=>Ru,initializeFlags:()=>Ou,wasmBackend:()=>V_});var Ou,Ru,V_,ax=F(()=>{nr(),U_(),nx(),Ou=()=>{if((typeof ze.wasm.initTimeout!="number"||ze.wasm.initTimeout<0)&&(ze.wasm.initTimeout=0),ze.wasm.simd===!1&&console.warn('Deprecated property "env.wasm.simd" is set to false. non-SIMD build is no longer provided, and this setting will be ignored.'),typeof ze.wasm.proxy!="boolean"&&(ze.wasm.proxy=!1),typeof ze.wasm.trace!="boolean"&&(ze.wasm.trace=!1),typeof ze.wasm.numThreads!="number"||!Number.isInteger(ze.wasm.numThreads)||ze.wasm.numThreads<=0)if(typeof self<"u"&&!self.crossOriginIsolated)ze.wasm.numThreads=1;else{let e=typeof navigator>"u"?Vv("node:os").cpus().length:navigator.hardwareConcurrency;ze.wasm.numThreads=Math.min(4,Math.ceil((e||1)/2))}},Ru=class{async init(e){Ou(),await R_(),await M_(e)}async createInferenceSessionHandler(e,t){let r=new F_;return await r.loadModel(e,t),Promise.resolve(r)}},V_=new Ru});nr();nr();nr();var sx="1.21.0";{let e=(ax(),Ua(W_)).wasmBackend;Ai("webgpu",e,5),Ai("webnn",e,5),Ai("cpu",e,10),Ai("wasm",e,10)}Object.defineProperty(ze.versions,"web",{value:sx,enumerable:!0});/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*//**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 *//**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Fr=[{id:"neutral",emoji:"😐",label:"ニュートラル",description:"自然体でリラックス"},{id:"joy",emoji:"😀",label:"よろこび",description:"口角を上げてにっこり"},{id:"surprise",emoji:"😲",label:"おどろき",description:"目と口を大きく開く"},{id:"sad",emoji:"😢",label:"かなしい",description:"口角を下げてしょんぼり"},{id:"anger",emoji:"😡",label:"いかり",description:"眉を寄せてキリッと"}],ba=Fr.filter(e=>e.id!=="neutral"),$n=["neutral","happiness","surprise","sadness","anger"],ox={neutral:$n.indexOf("neutral"),joy:$n.indexOf("happiness"),surprise:$n.indexOf("surprise"),sad:$n.indexOf("sadness"),anger:$n.indexOf("anger")},c2=.2,ux=.55,p2=.18,lx=.04,f2=45,m2=8,g2=.25,y2=.25,cr=64,va=(e,t)=>{const r=e.replace(/\/+$/,""),i=t.endsWith("/"),a=t.replace(/^\/+/,"").replace(/\/+$/,""),n=`${r}/${a}`;return i?`${n}/`:n},dx=e=>{const t=Array.isArray(e)?e:Array.from(e);let r=-1/0;for(let s=0;s<t.length;s+=1)r=Math.max(r,t[s]);const i=t.map(s=>Math.exp(s-r)),n=i.reduce((s,u)=>s+u,0)||1;return i.map(s=>s/n)},hx=(e,t,r,i)=>new DOMRectReadOnly(e,t,r,i);class cx extends m4{constructor(){super();ae(this,"video",null);ae(this,"stream",null);ae(this,"landmarker",null);ae(this,"onnxSession",null);ae(this,"detectionTimer",0);ae(this,"detecting",!1);ae(this,"cropCanvas");ae(this,"cropCtx");ae(this,"timeLeft",f2);ae(this,"score",0);ae(this,"combo",0);ae(this,"bestCombo",0);ae(this,"matchProgress",0);ae(this,"target",Fr[0]);ae(this,"lastExpression","unknown");ae(this,"lastConfidence",0);ae(this,"lastBestProbability",0);ae(this,"lastCompetitorProbability",0);ae(this,"lastProbabilities",{neutral:0,joy:0,surprise:0,sad:0,anger:0});ae(this,"lastBoundingBox",null);ae(this,"status","カメラとモデルを初期化しています...");ae(this,"gameOver",!1);ae(this,"removeInputListener",null);this.cropCanvas=document.createElement("canvas"),this.cropCanvas.width=cr,this.cropCanvas.height=cr,this.cropCtx=this.cropCanvas.getContext("2d",{willReadFrequently:!0})}async onEnter(r){if(this.resetState(),this.video=document.getElementById("camera-stream"),!this.video){this.status="ビデオ要素が見つかりません。";const a=Object.fromEntries(Fr.map(n=>[n.id,0]));a.neutral=1,this.lastProbabilities=a;return}try{this.stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"user",width:640,height:480},audio:!1}),this.video.srcObject=this.stream,await this.video.play()}catch(a){console.error(a),this.status="カメラの取得に失敗しました。権限を確認してください。";return}try{await this.initializeModels()}catch(a){console.error(a),this.status="表情解析モジュールの初期化に失敗しました。ブラウザを再読み込みしてください。";return}this.status="ターゲットの表情を真似てゲージを満たそう！",this.pickNextTarget();const i=r.input;this.removeInputListener=i.onInput(a=>this.handleInput(a))}onExit(){var r,i,a,n;this.cleanupStream(),(r=this.removeInputListener)==null||r.call(this),this.removeInputListener=null,(i=this.landmarker)==null||i.close(),this.landmarker=null,(n=(a=this.onnxSession)==null?void 0:a.release)==null||n.call(a),this.onnxSession=null}update(r){if(!this.gameOver){if(this.timeLeft=ri(this.timeLeft-r,0,999),this.timeLeft<=0){this.gameOver=!0,this.status="時間切れ！スペースかクリックで再スタート";return}!this.landmarker||!this.onnxSession||!this.video||this.video.readyState<HTMLMediaElement.HAVE_ENOUGH_DATA||(this.detectionTimer-=r,this.detectionTimer<=0&&!this.detecting&&(this.detectionTimer=c2,this.detectExpression()))}}render(r){const i=r.renderer,a=i.context,n=i.canvas;a.save(),a.fillStyle="#0f172a",a.fillRect(0,0,n.width,n.height),a.restore(),this.video&&this.video.readyState>=HTMLMediaElement.HAVE_CURRENT_DATA&&(a.save(),a.translate(n.width,0),a.scale(-1,1),a.drawImage(this.video,0,0,n.width,n.height),a.restore()),this.lastBoundingBox&&this.drawFaceOutline(a,n),this.drawHud(a,n),this.drawStatus(a,n)}async initializeModels(){if(!this.video)throw new Error("video not ready");const r="/dev-sandbox/games/emotion/",i=va(r,"mediapipe/wasm/"),a=va(r,"mediapipe/face_landmarker.task"),n=await ui.forVisionTasks(i);this.landmarker=await Ge.createFromOptions(n,{baseOptions:{modelAssetPath:a},runningMode:"VIDEO",numFaces:1,outputFaceBlendshapes:!1,outputFacialTransformationMatrixes:!1}),ze.wasm.wasmPaths=va(r,"onnx/"),ze.wasm.simd=!0,ze.wasm.numThreads=1,ze.wasm.proxy=!1;const s=va(r,"models/ferplus.onnx"),u=await fetch(s);if(!u.ok)throw new Error(`モデルの取得に失敗しました (${u.status} ${u.statusText})`);const l=new Uint8Array(await u.arrayBuffer());this.onnxSession=await Wl.create(l,{executionProviders:["wasm"],graphOptimizationLevel:"all"})}resetState(){this.timeLeft=f2,this.score=0,this.combo=0,this.bestCombo=0,this.matchProgress=0,this.target=ba[0],this.lastExpression="unknown",this.lastConfidence=0,this.lastBestProbability=0,this.lastCompetitorProbability=0,this.lastProbabilities={neutral:0,joy:0,surprise:0,sad:0,anger:0},this.lastBoundingBox=null,this.status="カメラとモデルを初期化しています...",this.gameOver=!1,this.detectionTimer=0}handleInput(r){if(r instanceof PointerEvent&&r.type==="pointerdown"){this.gameOver&&(this.resetState(),this.status="ターゲットの表情を真似てゲージを満たそう！",this.pickNextTarget());return}if(!(r instanceof KeyboardEvent)||r.type!=="keydown")return;const i=r.key.toLowerCase();(i===" "||i==="enter")&&this.gameOver&&(this.resetState(),this.status="ターゲットの表情を真似てゲージを満たそう！",this.pickNextTarget())}async detectExpression(){if(!(!this.landmarker||!this.onnxSession||!this.video||!this.cropCtx)){this.detecting=!0;try{const r=this.landmarker.detectForVideo(this.video,performance.now());if(!r||!r.faceLandmarks.length){this.lastBoundingBox=null,this.lastExpression="unknown",this.lastConfidence=0,this.lastProbabilities=Object.fromEntries(Fr.map(_=>[_.id,0])),this.status="顔を検出中...";return}const i=this.computeBoundingBox(r,this.video);if(!i||i.width<=0||i.height<=0)return;this.lastBoundingBox=i;const a=await this.predictEmotion(i);if(!a)return;const n=a.probabilities.neutral??0,s=Math.max(.001,1-n),u=Object.fromEntries(Fr.map(_=>{if(_.id==="neutral")return[_.id,n];const w=a.probabilities[_.id]??0;return[_.id,Math.min(w/s,1)]})),l=ba.map(_=>({id:_.id,value:u[_.id]??0})).sort((_,w)=>w.value-_.value),h=l[0]??{id:"joy",value:0},p=l[1]??{id:"joy",value:0};this.status=null,this.lastExpression=h.value>=y2?h.id:"unknown";const m=u[this.target.id]??0;this.lastConfidence=m,this.lastBestProbability=h.value,this.lastCompetitorProbability=p.value,this.lastProbabilities=u;const g=m-this.lastCompetitorProbability;if(m>=p2&&g>=lx){const w=Math.max(m-p2,.01)*ux*c2;this.matchProgress=Math.min(1,this.matchProgress+w)}this.matchProgress>=.999&&this.onSuccessMatch()}catch(r){console.error(r),this.status="表情の解析中にエラーが発生しました。再読み込みしてください。"}finally{this.detecting=!1}}}computeBoundingBox(r,i){var M;const a=(M=r.faceLandmarks)==null?void 0:M[0];if(!a||a.length===0)return null;const n=i.videoWidth||i.width,s=i.videoHeight||i.height,u=a.map(D=>D.x),l=a.map(D=>D.y),h=Math.max(...u)<=1&&Math.max(...l)<=1,p=D=>h?D*n:D,m=D=>h?D*s:D,g=Math.min(...u),_=Math.max(...u),w=Math.min(...l),b=Math.max(...l);let k=p(g),$=p(_),v=m(w),T=m(b);const S=$-k,E=T-v,C=S*g2,A=E*g2;return k=ri(k-C,0,n),v=ri(v-A,0,s),$=ri($+C,0,n),T=ri(T+A,0,s),hx(k,v,Math.max(1,$-k),Math.max(1,T-v))}async predictEmotion(r){if(!this.video||!this.cropCtx||!this.onnxSession)return null;this.cropCtx.drawImage(this.video,r.x,r.y,r.width,r.height,0,0,cr,cr);const a=this.cropCtx.getImageData(0,0,cr,cr).data,n=new Float32Array(cr*cr);for(let $=0;$<n.length;$+=1){const v=$*4,T=a[v],S=a[v+1],E=a[v+2],C=.299*T+.587*S+.114*E;n[$]=C}const s={};s[this.onnxSession.inputNames[0]]=new Zt("float32",n,[1,1,cr,cr]);const u=await this.onnxSession.run(s),l=this.onnxSession.outputNames[0],h=u[l];if(!h)return null;const p=Array.from(h.data),m=dx(p),g=Object.fromEntries(Fr.map($=>{const v=ox[$.id];return[$.id,m[v]??0]})),_=Object.entries(g).filter(([$])=>$!=="neutral");_.sort(($,v)=>v[1]-$[1]);const[w,b]=_[0],k=_.length>1?_[1][1]:0;return{id:b>=y2?w:"unknown",confidence:b,competitor:k,probabilities:g}}onSuccessMatch(){this.score+=100+this.combo*20,this.combo+=1,this.bestCombo=Math.max(this.bestCombo,this.combo),this.timeLeft=ri(this.timeLeft+m2,0,120),this.matchProgress=0,this.status=`${this.target.label}クリア！ +${m2}秒`,this.pickNextTarget()}pickNextTarget(){const r=ba.filter(a=>a.id!==this.target.id),i=Math.floor(Math.random()*r.length);this.target=r[i]??ba[0]}drawFaceOutline(r,i){if(!this.video||!this.lastBoundingBox)return;const a=this.lastBoundingBox,n=i.width/(this.video.videoWidth||this.video.width||i.width),s=i.height/(this.video.videoHeight||this.video.height||i.height),u=i.width-(a.x+a.width)*n,l=a.y*s,h=a.width*n,p=a.height*s;r.save(),r.strokeStyle="rgba(96, 165, 250, 0.85)",r.lineWidth=3,r.strokeRect(u,l,h,p),r.restore()}drawHud(r,i){var p;r.save(),r.fillStyle="rgba(15, 23, 42, 0.6)",r.fillRect(20,20,200,120),r.fillRect(i.width-240,20,220,260),r.fillStyle="#f8fafc",r.font='22px/1.3 "Noto Sans JP", system-ui, sans-serif',r.fillText("ターゲット",32,52),r.font='64px/1 "Segoe UI Emoji", system-ui',r.fillText(this.target.emoji,36,120),r.font='20px/1.2 "Noto Sans JP", system-ui, sans-serif',r.fillText(this.target.label,100,86),r.fillText(this.target.description,32,150),r.textAlign="right",r.font='24px/1.4 "Noto Sans JP", system-ui, sans-serif',r.fillText(`スコア: ${this.score}`,i.width-24,52),r.fillText(`のこり時間: ${Math.ceil(this.timeLeft)}s`,i.width-24,84),r.fillText(`コンボ: ${this.combo} (ベスト ${this.bestCombo})`,i.width-24,116);const a=this.lastExpression==="unknown"?"---":((p=Fr.find(m=>m.id===this.lastExpression))==null?void 0:p.label)??"---";r.fillText(`判定: ${a}`,i.width-24,148),r.fillText(`ターゲット確率: ${(this.lastConfidence*100).toFixed(1)}%`,i.width-24,180),r.fillText(`最大確率: ${(this.lastBestProbability*100).toFixed(1)}%`,i.width-24,212),r.fillText(`次点確率: ${(this.lastCompetitorProbability*100).toFixed(1)}%`,i.width-24,244),r.textAlign="left";const n=i.width-80,s=40,u=i.height-60;r.fillStyle="rgba(15, 23, 42, 0.6)",r.fillRect(s,u,n,24),r.fillStyle="#34d399",r.fillRect(s,u,n*ri(this.matchProgress,0,1),24),r.strokeStyle="rgba(248, 250, 252, 0.8)",r.lineWidth=2,r.strokeRect(s,u,n,24),r.fillStyle="#f8fafc",r.font='18px/1.2 "Noto Sans JP", system-ui, sans-serif',r.fillText("ターゲットと一致するとゲージが満タンになります",s,u-8),r.font='16px/1.2 "Noto Sans JP", system-ui, sans-serif';const l=Fr.map(m=>[m,this.lastProbabilities[m.id]]);l.sort((m,g)=>g[1]-m[1]);const h=i.height-140;l.forEach(([m,g],_)=>{r.fillStyle=m.id===this.target.id?"#facc15":"#f8fafc",r.fillText(`${m.label}: ${(g*100).toFixed(1)}%`,32,h+_*20)}),r.restore()}drawStatus(r,i){if(!this.status)return;r.save(),r.fillStyle="rgba(15, 23, 42, 0.7)",r.fillRect(80,i.height/2-60,i.width-160,120),r.fillStyle="#f8fafc",r.textAlign="center",r.font='26px/1.4 "Noto Sans JP", system-ui, sans-serif',this.status.split(`
`).forEach((n,s)=>{r.fillText(n,i.width/2,i.height/2-10+s*30)}),r.textAlign="left",r.restore()}cleanupStream(){var r;(r=this.stream)==null||r.getTracks().forEach(i=>i.stop()),this.stream=null,this.video&&(this.video.srcObject=null,this.video=null)}}const Ka=document.getElementById("game-canvas");if(!Ka)throw new Error("ゲームキャンバスが見つかりません");const gd=new p4(Ka,{background:"#0f172a"});gd.renderer.resize(f4(Ka.width,Ka.height));gd.setScene(new cx);gd.start();
