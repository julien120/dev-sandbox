var Tb=Object.defineProperty;var kb=(e,t,r)=>t in e?Tb(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var de=(e,t,r)=>kb(e,typeof t!="symbol"?t+"":t,r);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const n of a)if(n.type==="childList")for(const s of n.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function r(a){const n={};return a.integrity&&(n.integrity=a.integrity),a.referrerPolicy&&(n.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?n.credentials="include":a.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(a){if(a.ep)return;a.ep=!0;const n=r(a);fetch(a.href,n)}})();class Eb{constructor(){de(this,"sounds",new Map);de(this,"muted",!1)}load(t,r){if(this.sounds.has(t))return;const i=new Audio(r);i.preload="auto",this.sounds.set(t,i)}play(t,r={}){const i=this.sounds.get(t);if(!i||this.muted)return;const a=i.cloneNode(!0);a.loop=r.loop??!1,a.volume=r.volume??1,a.play()}setMuted(t){this.muted=t}isMuted(){return this.muted}}const Zs=1e3/60,Sb=5;class Cb{constructor(){de(this,"lastTick",performance.now());de(this,"accumulated",0);de(this,"running",!1);de(this,"subscribers",[]);de(this,"rafId",0);de(this,"loop",()=>{if(!this.running)return;const t=performance.now(),r=t-this.lastTick;this.lastTick=t,this.accumulated+=r;let i=0;for(;this.accumulated>=Zs&&i<Sb;)this.accumulated-=Zs,this.subscribers.forEach(a=>a(Zs/1e3)),i+=1;this.rafId=requestAnimationFrame(this.loop)})}start(){this.running||(this.running=!0,this.lastTick=performance.now(),this.loop())}stop(){this.running=!1,cancelAnimationFrame(this.rafId)}subscribe(t){return this.subscribers.push(t),()=>{const r=this.subscribers.indexOf(t);r>=0&&this.subscribers.splice(r,1)}}}class Ab{constructor(t=window){de(this,"pressedKeys",new Set);de(this,"pointerPosition",{x:0,y:0});de(this,"listeners",[]);de(this,"keyDownListener",t=>this.handleKeyDown(t));de(this,"keyUpListener",t=>this.handleKeyUp(t));de(this,"pointerListener",t=>this.handlePointer(t));de(this,"handleKeyDown",t=>{this.pressedKeys.add(t.key.toLowerCase()),this.listeners.forEach(r=>r(t))});de(this,"handleKeyUp",t=>{this.pressedKeys.delete(t.key.toLowerCase()),this.listeners.forEach(r=>r(t))});de(this,"handlePointer",t=>{this.pointerPosition={x:t.clientX,y:t.clientY},this.listeners.forEach(r=>r(t))});this.target=t}attach(){this.addTargetListeners(this.target)}detach(){this.removeTargetListeners(this.target),this.pressedKeys.clear(),this.listeners=[]}addTargetListeners(t){if(t instanceof Window){t.addEventListener("keydown",this.keyDownListener,{passive:!0}),t.addEventListener("keyup",this.keyUpListener,{passive:!0}),t.addEventListener("pointerdown",this.pointerListener,{passive:!0}),t.addEventListener("pointerup",this.pointerListener,{passive:!0}),t.addEventListener("pointermove",this.pointerListener,{passive:!0});return}t.addEventListener("keydown",this.keyDownListener,{passive:!0}),t.addEventListener("keyup",this.keyUpListener,{passive:!0}),t.addEventListener("pointerdown",this.pointerListener,{passive:!0}),t.addEventListener("pointerup",this.pointerListener,{passive:!0}),t.addEventListener("pointermove",this.pointerListener,{passive:!0})}removeTargetListeners(t){if(t instanceof Window){t.removeEventListener("keydown",this.keyDownListener),t.removeEventListener("keyup",this.keyUpListener),t.removeEventListener("pointerdown",this.pointerListener),t.removeEventListener("pointerup",this.pointerListener),t.removeEventListener("pointermove",this.pointerListener);return}t.removeEventListener("keydown",this.keyDownListener),t.removeEventListener("keyup",this.keyUpListener),t.removeEventListener("pointerdown",this.pointerListener),t.removeEventListener("pointerup",this.pointerListener),t.removeEventListener("pointermove",this.pointerListener)}isKeyPressed(t){return this.pressedKeys.has(t.toLowerCase())}getPointerPosition(){return{...this.pointerPosition}}onInput(t){return this.listeners.push(t),()=>{this.listeners=this.listeners.filter(r=>r!==t)}}}class Ib{constructor(t){de(this,"context");de(this,"canvas");const r=t.getContext("2d");if(!r)throw new Error("Renderer requires 2D canvas context");this.canvas=t,this.context=r,this.context.imageSmoothingEnabled=!0}clear(t="#000000"){const r=this.context;r.save(),r.fillStyle=t,r.fillRect(0,0,this.canvas.width,this.canvas.height),r.restore()}drawSprite(t,r,i){this.context.drawImage(t,r.x,r.y,i.x,i.y)}drawRect(t,r,i){const a=this.context;a.save(),a.fillStyle=i,a.fillRect(t.x,t.y,r.x,r.y),a.restore()}drawText(t,r,i={}){const a=this.context;a.save(),a.fillStyle=i.color??"#ffffff",a.font=i.font??"16px sans-serif",a.textBaseline="top",a.fillText(t,r.x,r.y),a.restore()}resize(t){this.canvas.width=t.x,this.canvas.height=t.y}}class zb{constructor(t,r={}){de(this,"audio",new Eb);de(this,"input");de(this,"renderer");de(this,"ticker",new Cb);de(this,"currentScene",null);de(this,"elapsedTime",0);de(this,"options");de(this,"update",t=>{var i,a;const r=this.createContext(t);this.options.background?this.renderer.clear(this.options.background):this.renderer.clear(),(i=this.currentScene)==null||i.update(t,r),(a=this.currentScene)==null||a.render(r),this.elapsedTime+=t});this.options=r,this.renderer=new Ib(t),this.input=new Ab(window),this.input.attach(),this.ticker.subscribe(this.update)}setScene(t){var r,i;(r=this.currentScene)!=null&&r.onExit&&this.currentScene.onExit(this.createContext()),this.currentScene=t,(i=this.currentScene)!=null&&i.onEnter&&this.currentScene.onEnter(this.createContext())}start(){this.elapsedTime=0,this.ticker.start()}stop(){this.ticker.stop()}dispose(){this.stop(),this.input.detach()}createContext(t=0){return{renderer:this.renderer,input:this.input,elapsedTime:this.elapsedTime+t}}}const Ob=(e=0,t=0)=>({x:e,y:t}),ai=(e,t,r)=>Math.max(t,Math.min(r,e));class Rb{}var wi=typeof self<"u"?self:{};function si(){throw Error("Invalid UTF8")}function Pc(e,t){return t=String.fromCharCode.apply(null,t),e==null?t:e+t}let na,Qs;const Mb=typeof TextDecoder<"u";let Bb;const Nb=typeof TextEncoder<"u";function I1(e){if(Nb)e=(Bb||(Bb=new TextEncoder)).encode(e);else{let r=0;const i=new Uint8Array(3*e.length);for(let a=0;a<e.length;a++){var t=e.charCodeAt(a);if(t<128)i[r++]=t;else{if(t<2048)i[r++]=t>>6|192;else{if(t>=55296&&t<=57343){if(t<=56319&&a<e.length){const n=e.charCodeAt(++a);if(n>=56320&&n<=57343){t=1024*(t-55296)+n-56320+65536,i[r++]=t>>18|240,i[r++]=t>>12&63|128,i[r++]=t>>6&63|128,i[r++]=63&t|128;continue}a--}t=65533}i[r++]=t>>12|224,i[r++]=t>>6&63|128}i[r++]=63&t|128}}e=r===i.length?i:i.subarray(0,r)}return e}var Gu,Ma;e:{for(var Lc=["CLOSURE_FLAGS"],Js=wi,eo=0;eo<Lc.length;eo++)if((Js=Js[Lc[eo]])==null){Ma=null;break e}Ma=Js}var Dn,Uc=Ma&&Ma[610401301];Gu=Uc!=null&&Uc;const Fc=wi.navigator;function du(e){return!!Gu&&!!Dn&&Dn.brands.some(({brand:t})=>t&&t.indexOf(e)!=-1)}function Lt(e){var t;return(t=wi.navigator)&&(t=t.userAgent)||(t=""),t.indexOf(e)!=-1}function Wr(){return!!Gu&&!!Dn&&Dn.brands.length>0}function to(){return Wr()?du("Chromium"):(Lt("Chrome")||Lt("CriOS"))&&!(!Wr()&&Lt("Edge"))||Lt("Silk")}function ju(e){return ju[" "](e),e}Dn=Fc&&Fc.userAgentData||null,ju[" "]=function(){};var Db=!Wr()&&(Lt("Trident")||Lt("MSIE"));!Lt("Android")||to(),to(),Lt("Safari")&&(to()||!Wr()&&Lt("Coast")||!Wr()&&Lt("Opera")||!Wr()&&Lt("Edge")||(Wr()?du("Microsoft Edge"):Lt("Edg/"))||Wr()&&du("Opera"));var z1={},Sn=null;function Pb(e){const t=e.length;let r=3*t/4;r%3?r=Math.floor(r):"=.".indexOf(e[t-1])!=-1&&(r="=.".indexOf(e[t-2])!=-1?r-2:r-1);const i=new Uint8Array(r);let a=0;return function(n,s){function u(d){for(;l<n.length;){const h=n.charAt(l++),f=Sn[h];if(f!=null)return f;if(!/^[\s\xa0]*$/.test(h))throw Error("Unknown base64 encoding at char: "+h)}return d}O1();let l=0;for(;;){const d=u(-1),h=u(0),f=u(64),g=u(64);if(g===64&&d===-1)break;s(d<<2|h>>4),f!=64&&(s(h<<4&240|f>>2),g!=64&&s(f<<6&192|g))}}(e,function(n){i[a++]=n}),a!==r?i.subarray(0,a):i}function O1(){if(!Sn){Sn={};var e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split(""),t=["+/=","+/","-_=","-_.","-_"];for(let r=0;r<5;r++){const i=e.concat(t[r].split(""));z1[r]=i;for(let a=0;a<i.length;a++){const n=i[a];Sn[n]===void 0&&(Sn[n]=a)}}}}var R1=typeof Uint8Array<"u",M1=!Db&&typeof btoa=="function";function Vc(e){if(!M1){var t;t===void 0&&(t=0),O1(),t=z1[t];var r=Array(Math.floor(e.length/3)),i=t[64]||"";let l=0,d=0;for(;l<e.length-2;l+=3){var a=e[l],n=e[l+1],s=e[l+2],u=t[a>>2];a=t[(3&a)<<4|n>>4],n=t[(15&n)<<2|s>>6],s=t[63&s],r[d++]=u+a+n+s}switch(u=0,s=i,e.length-l){case 2:s=t[(15&(u=e[l+1]))<<2]||i;case 1:e=e[l],r[d]=t[e>>2]+t[(3&e)<<4|u>>4]+s+i}return r.join("")}for(t="",r=0,i=e.length-10240;r<i;)t+=String.fromCharCode.apply(null,e.subarray(r,r+=10240));return t+=String.fromCharCode.apply(null,r?e.subarray(r):e),btoa(t)}const Wc=/[-_.]/g,Lb={"-":"+",_:"/",".":"="};function Ub(e){return Lb[e]||""}function B1(e){if(!M1)return Pb(e);Wc.test(e)&&(e=e.replace(Wc,Ub)),e=atob(e);const t=new Uint8Array(e.length);for(let r=0;r<e.length;r++)t[r]=e.charCodeAt(r);return t}function Wn(e){return R1&&e!=null&&e instanceof Uint8Array}var Fi={};function vi(){return Fb||(Fb=new Sr(null,Fi))}function qu(e){N1(Fi);var t=e.g;return(t=t==null||Wn(t)?t:typeof t=="string"?B1(t):null)==null?t:e.g=t}var Sr=class{h(){return new Uint8Array(qu(this)||0)}constructor(t,r){if(N1(r),this.g=t,t!=null&&t.length===0)throw Error("ByteString should be constructed with non-empty values")}};let Fb,Vb;function N1(e){if(e!==Fi)throw Error("illegal external caller")}function D1(e,t){e.__closure__error__context__984382||(e.__closure__error__context__984382={}),e.__closure__error__context__984382.severity=t}function cu(e){return D1(e=Error(e),"warning"),e}var Ja=typeof Symbol=="function"&&typeof Symbol()=="symbol",Wb=new Set;function Gn(e,t,r=!1,i=!1){return e=typeof Symbol=="function"&&typeof Symbol()=="symbol"?i&&Symbol.for&&e?Symbol.for(e):e!=null?Symbol(e):Symbol():t,r&&Wb.add(e),e}var Gb=Gn("jas",void 0,!0,!0),Gc=Gn(void 0,"0di"),ro=Gn(void 0,"2ex"),pn=Gn(void 0,"1oa",!0),Vi=Gn(void 0,Symbol(),!0);const ae=Ja?Gb:"Ga",P1={Ga:{value:0,configurable:!0,writable:!0,enumerable:!1}},L1=Object.defineProperties;function es(e,t){Ja||ae in e||L1(e,P1),e[ae]|=t}function Je(e,t){Ja||ae in e||L1(e,P1),e[ae]=t}function Ji(e){return es(e,34),e}function jb(e,t){Je(t,-30975&(0|e))}function hu(e,t){Je(t,-30941&(34|e))}function Hu(){return typeof BigInt=="function"}function _t(e){return Array.prototype.slice.call(e)}var Ku,jn={},U1={};function jc(e){return!(!e||typeof e!="object"||e.Ia!==U1)}function Xu(e){return e!==null&&typeof e=="object"&&!Array.isArray(e)&&e.constructor===Object}function Yu(e,t){if(e!=null){if(typeof e=="string")e=e?new Sr(e,Fi):vi();else if(e.constructor!==Sr)if(Wn(e))e=e.length?new Sr(new Uint8Array(e),Fi):vi();else{if(!t)throw Error();e=void 0}}return e}function Ba(e){return!(!Array.isArray(e)||e.length)&&!!(1&(0|e[ae]))}const qc=[];function Yr(e){if(2&e)throw Error()}Je(qc,55),Ku=Object.freeze(qc);class Na{constructor(t,r,i){this.l=0,this.g=t,this.h=r,this.m=i}next(){if(this.l<this.g.length){const t=this.g[this.l++];return{done:!1,value:this.h?this.h.call(this.m,t):t}}return{done:!0,value:void 0}}[Symbol.iterator](){return new Na(this.g,this.h,this.m)}}function Zu(e){return Vi?e[Vi]:void 0}var qb=Object.freeze({});function ts(e){return e.Qa=!0,e}var Hb=ts(e=>typeof e=="number"),Hc=ts(e=>typeof e=="string"),Kb=ts(e=>typeof e=="boolean"),rs=typeof wi.BigInt=="function"&&typeof wi.BigInt(0)=="bigint",pu=ts(e=>rs?e>=Yb&&e<=Qb:e[0]==="-"?Kc(e,Xb):Kc(e,Zb));const Xb=Number.MIN_SAFE_INTEGER.toString(),Yb=rs?BigInt(Number.MIN_SAFE_INTEGER):void 0,Zb=Number.MAX_SAFE_INTEGER.toString(),Qb=rs?BigInt(Number.MAX_SAFE_INTEGER):void 0;function Kc(e,t){if(e.length>t.length)return!1;if(e.length<t.length||e===t)return!0;for(let r=0;r<e.length;r++){const i=e[r],a=t[r];if(i>a)return!1;if(i<a)return!0}}const Jb=typeof Uint8Array.prototype.slice=="function";let F1,Re=0,qe=0;function Xc(e){const t=e>>>0;Re=t,qe=(e-t)/4294967296>>>0}function Wi(e){if(e<0){Xc(-e);const[t,r]=tl(Re,qe);Re=t>>>0,qe=r>>>0}else Xc(e)}function Qu(e){const t=F1||(F1=new DataView(new ArrayBuffer(8)));t.setFloat32(0,+e,!0),qe=0,Re=t.getUint32(0,!0)}function Ju(e,t){const r=4294967296*t+(e>>>0);return Number.isSafeInteger(r)?r:Pn(e,t)}function el(e,t){const r=2147483648&t;return r&&(t=~t>>>0,(e=1+~e>>>0)==0&&(t=t+1>>>0)),typeof(e=Ju(e,t))=="number"?r?-e:e:r?"-"+e:e}function Pn(e,t){if(e>>>=0,(t>>>=0)<=2097151)var r=""+(4294967296*t+e);else Hu()?r=""+(BigInt(t)<<BigInt(32)|BigInt(e)):(e=(16777215&e)+6777216*(r=16777215&(e>>>24|t<<8))+6710656*(t=t>>16&65535),r+=8147497*t,t*=2,e>=1e7&&(r+=e/1e7>>>0,e%=1e7),r>=1e7&&(t+=r/1e7>>>0,r%=1e7),r=t+Yc(r)+Yc(e));return r}function Yc(e){return e=String(e),"0000000".slice(e.length)+e}function is(e){if(e.length<16)Wi(Number(e));else if(Hu())e=BigInt(e),Re=Number(e&BigInt(4294967295))>>>0,qe=Number(e>>BigInt(32)&BigInt(4294967295));else{const t=+(e[0]==="-");qe=Re=0;const r=e.length;for(let i=t,a=(r-t)%6+t;a<=r;i=a,a+=6){const n=Number(e.slice(i,a));qe*=1e6,Re=1e6*Re+n,Re>=4294967296&&(qe+=Math.trunc(Re/4294967296),qe>>>=0,Re>>>=0)}if(t){const[i,a]=tl(Re,qe);Re=i,qe=a}}}function tl(e,t){return t=~t,e?e=1+~e:t+=1,[e,t]}const rl=typeof BigInt=="function"?BigInt.asIntN:void 0,ew=typeof BigInt=="function"?BigInt.asUintN:void 0,Ni=Number.isSafeInteger,ns=Number.isFinite,Da=Math.trunc;function Zr(e){return e==null||typeof e=="number"?e:e==="NaN"||e==="Infinity"||e==="-Infinity"?Number(e):void 0}function V1(e){return e==null||typeof e=="boolean"?e:typeof e=="number"?!!e:void 0}const tw=/^-?([1-9][0-9]*|0)(\.[0-9]+)?$/;function as(e){switch(typeof e){case"bigint":return!0;case"number":return ns(e);case"string":return tw.test(e);default:return!1}}function en(e){if(e==null)return e;if(typeof e=="string"&&e)e=+e;else if(typeof e!="number")return;return ns(e)?0|e:void 0}function W1(e){if(e==null)return e;if(typeof e=="string"&&e)e=+e;else if(typeof e!="number")return;return ns(e)?e>>>0:void 0}function Zc(e){if(e[0]==="-")return!1;const t=e.length;return t<20||t===20&&Number(e.substring(0,6))<184467}function il(e){return e=Da(e),Ni(e)||(Wi(e),e=el(Re,qe)),e}function nl(e){var t=Da(Number(e));if(Ni(t))return String(t);if((t=e.indexOf("."))!==-1&&(e=e.substring(0,t)),t=e.length,!(e[0]==="-"?t<20||t===20&&Number(e.substring(0,7))>-922337:t<19||t===19&&Number(e.substring(0,6))<922337))if(is(e),e=Re,2147483648&(t=qe))if(Hu())e=""+(BigInt(0|t)<<BigInt(32)|BigInt(e>>>0));else{const[r,i]=tl(e,t);e="-"+Pn(r,i)}else e=Pn(e,t);return e}function Pa(e){return e==null?e:typeof e=="bigint"?(pu(e)?e=Number(e):(e=rl(64,e),e=pu(e)?Number(e):String(e)),e):as(e)?typeof e=="number"?il(e):nl(e):void 0}function rw(e){if(e==null)return e;var t=typeof e;if(t==="bigint")return String(ew(64,e));if(as(e)){if(t==="string")return t=Da(Number(e)),Ni(t)&&t>=0?e=String(t):((t=e.indexOf("."))!==-1&&(e=e.substring(0,t)),Zc(e)||(is(e),e=Pn(Re,qe))),e;if(t==="number")return(e=Da(e))>=0&&Ni(e)?e:function(r){if(r<0){Wi(r);var i=Pn(Re,qe);return r=Number(i),Ni(r)?r:i}return Zc(i=String(r))?i:(Wi(r),Ju(Re,qe))}(e)}}function G1(e){if(typeof e!="string")throw Error();return e}function tn(e){if(e!=null&&typeof e!="string")throw Error();return e}function Gi(e){return e==null||typeof e=="string"?e:void 0}function al(e,t,r,i){if(e!=null&&typeof e=="object"&&e.W===jn)return e;if(!Array.isArray(e))return r?2&i?((e=t[Gc])||(Ji((e=new t).u),e=t[Gc]=e),t=e):t=new t:t=void 0,t;let a=r=0|e[ae];return a===0&&(a|=32&i),a|=2&i,a!==r&&Je(e,a),new t(e)}function iw(e,t,r){if(t)e:{if(!as(t=e))throw cu("int64");switch(typeof t){case"string":t=nl(t);break e;case"bigint":if(e=t=rl(64,t),Hc(e)){if(!/^\s*(?:-?[1-9]\d*|0)?\s*$/.test(e))throw Error(String(e))}else if(Hb(e)&&!Number.isSafeInteger(e))throw Error(String(e));t=rs?BigInt(t):Kb(t)?t?"1":"0":Hc(t)?t.trim()||"0":String(t);break e;default:t=il(t)}}else t=Pa(e);return typeof(r=(e=t)==null?r?0:void 0:e)=="string"&&Ni(t=+r)?t:r}const nw={};let aw=function(){try{return ju(new class extends Map{constructor(){super()}}),!1}catch{return!0}}();class io{constructor(){this.g=new Map}get(t){return this.g.get(t)}set(t,r){return this.g.set(t,r),this.size=this.g.size,this}delete(t){return t=this.g.delete(t),this.size=this.g.size,t}clear(){this.g.clear(),this.size=this.g.size}has(t){return this.g.has(t)}entries(){return this.g.entries()}keys(){return this.g.keys()}values(){return this.g.values()}forEach(t,r){return this.g.forEach(t,r)}[Symbol.iterator](){return this.entries()}}const sw=aw?(Object.setPrototypeOf(io.prototype,Map.prototype),Object.defineProperties(io.prototype,{size:{value:0,configurable:!0,enumerable:!0,writable:!0}}),io):class extends Map{constructor(){super()}};function Qc(e){return e}function no(e){if(2&e.L)throw Error("Cannot mutate an immutable Map")}var Ft=class extends sw{constructor(t,r,i=Qc,a=Qc){super();let n=0|t[ae];n|=64,Je(t,n),this.L=n,this.S=r,this.R=i,this.Y=this.S?ow:a;for(let s=0;s<t.length;s++){const u=t[s],l=i(u[0],!1,!0);let d=u[1];r?d===void 0&&(d=null):d=a(u[1],!1,!0,void 0,void 0,n),super.set(l,d)}}na(t=Jc){if(this.size!==0)return this.X(t)}X(t=Jc){const r=[],i=super.entries();for(var a;!(a=i.next()).done;)(a=a.value)[0]=t(a[0]),a[1]=t(a[1]),r.push(a);return r}clear(){no(this),super.clear()}delete(t){return no(this),super.delete(this.R(t,!0,!1))}entries(){var t=this.ma();return new Na(t,uw,this)}keys(){return this.Ha()}values(){var t=this.ma();return new Na(t,Ft.prototype.get,this)}forEach(t,r){super.forEach((i,a)=>{t.call(r,this.get(a),a,this)})}set(t,r){return no(this),(t=this.R(t,!0,!1))==null?this:r==null?(super.delete(t),this):super.set(t,this.Y(r,!0,!0,this.S,!1,this.L))}Na(t){const r=this.R(t[0],!1,!0);t=t[1],t=this.S?t===void 0?null:t:this.Y(t,!1,!0,void 0,!1,this.L),super.set(r,t)}has(t){return super.has(this.R(t,!1,!1))}get(t){t=this.R(t,!1,!1);const r=super.get(t);if(r!==void 0){var i=this.S;return i?((i=this.Y(r,!1,!0,i,this.ra,this.L))!==r&&super.set(t,i),i):r}}ma(){return Array.from(super.keys())}Ha(){return super.keys()}[Symbol.iterator](){return this.entries()}};function ow(e,t,r,i,a,n){return e=al(e,i,r,n),a&&(e=os(e)),e}function Jc(e){return e}function uw(e){return[e,this.get(e)]}let lw,j1,dw;function eh(){return lw||(lw=new Ft(Ji([]),void 0,void 0,void 0,nw))}function sl(e,t,r,i,a){if(e!=null){if(Array.isArray(e))e=Ba(e)?void 0:a&&2&(0|e[ae])?e:ol(e,t,r,i!==void 0,a);else if(Xu(e)){const n={};for(let s in e)n[s]=sl(e[s],t,r,i,a);e=n}else e=t(e,i);return e}}function ol(e,t,r,i,a){const n=i||r?0|e[ae]:0,s=i?!!(32&n):void 0;i=_t(e);for(let u=0;u<i.length;u++)i[u]=sl(i[u],t,r,s,a);return r&&((e=Zu(e))&&(i[Vi]=_t(e)),r(n,i)),i}function cw(e){return sl(e,q1,void 0,void 0,!1)}function q1(e){return e.W===jn?e.toJSON():e instanceof Ft?e.na(cw):function(t){switch(typeof t){case"number":return isFinite(t)?t:String(t);case"bigint":return pu(t)?Number(t):String(t);case"boolean":return t?1:0;case"object":if(t)if(Array.isArray(t)){if(Ba(t))return}else{if(Wn(t))return Vc(t);if(t instanceof Sr){const r=t.g;return r==null?"":typeof r=="string"?r:t.g=Vc(r)}if(t instanceof Ft)return t.na()}}return t}(e)}function H1(e){return ol(e,q1,void 0,void 0,!1)}function jr(e,t,r){return e=K1(e,t[0],t[1],r?1:2),t!==j1&&r&&es(e,16384),e}function K1(e,t,r,i){if(e==null){var a=96;r?(e=[r],a|=512):e=[],t&&(a=-33521665&a|(1023&t)<<15)}else{if(!Array.isArray(e))throw Error("narr");if(2048&(a=0|e[ae]))throw Error("farr");if(64&a)return e;if(i===1||i===2||(a|=64),r&&(a|=512,r!==e[0]))throw Error("mid");e:{if(i=(r=e).length){const n=i-1;if(Xu(r[n])){if((t=n-(512&(a|=256)?0:-1))>=1024)throw Error("pvtlmt");a=-33521665&a|(1023&t)<<15;break e}}if(t){if((t=Math.max(t,i-(512&a?0:-1)))>1024)throw Error("spvt");a=-33521665&a|(1023&t)<<15}}}return Je(e,a),e}function fu(e,t,r=hu){if(e!=null){if(R1&&e instanceof Uint8Array)return t?e:new Uint8Array(e);if(Array.isArray(e)){var i=0|e[ae];return 2&i?e:(t&&(t=i===0||!!(32&i)&&!(64&i||!(16&i))),t?(Je(e,-12293&(34|i)),e):ol(e,fu,4&i?hu:r,!0,!0))}return e.W===jn?e=2&(i=0|(r=e.u)[ae])?e:new e.constructor(ss(r,i,!0)):e instanceof Ft&&!(2&e.L)&&(r=Ji(e.X(fu)),e=new Ft(r,e.S,e.R,e.Y)),e}}function ss(e,t,r){const i=r||2&t?hu:jb,a=!!(32&t);return e=function(n,s,u){const l=_t(n);var d=l.length;const h=256&s?l[d-1]:void 0;for(d+=h?-1:0,s=512&s?1:0;s<d;s++)l[s]=u(l[s]);if(h){s=l[s]={};for(const f in h)s[f]=u(h[f])}return(n=Zu(n))&&(l[Vi]=_t(n)),l}(e,t,n=>fu(n,a,i)),es(e,32|(r?2:0)),e}function os(e){const t=e.u,r=0|t[ae];return 2&r?new e.constructor(ss(t,r,!1)):e}function ji(e,t){return Or(e=e.u,0|e[ae],t)}function Or(e,t,r,i){if(r===-1)return null;var a=r+(512&t?0:-1);const n=e.length-1;return a>=n&&256&t?e[n][r]:i&&256&t&&(t=e[n][r])!=null?(e[a]!=null&&ro!=null&&((a=(e=Vb??(Vb={}))[ro]||0)>=4||(e[ro]=a+1,D1(e=Error(),"incident"),function(s){wi.setTimeout(()=>{throw s},0)}(e))),t):a<=n?e[a]:void 0}function Me(e,t,r){const i=e.u;let a=0|i[ae];return Yr(a),Ge(i,a,t,r),e}function Ge(e,t,r,i){const a=512&t?0:-1,n=r+a;var s=e.length-1;return n>=s&&256&t?(e[s][r]=i,t):n<=s?(e[n]=i,256&t&&r in(e=e[s])&&delete e[r],t):(i!==void 0&&(r>=(s=t>>15&1023||536870912)?i!=null&&(e[s+a]={[r]:i},Je(e,t|=256)):e[n]=i),t)}function Ea(e,t){let r=0|(e=e.u)[ae];const i=Or(e,r,t),a=Zr(i);return a!=null&&a!==i&&Ge(e,r,t,a),a}function X1(e){let t=0|(e=e.u)[ae];const r=Or(e,t,1),i=Yu(r,!0);return i!=null&&i!==r&&Ge(e,t,1,i),i}function mi(){return qb===void 0?2:4}function gi(e,t,r,i,a){const n=e.u,s=2&(e=0|n[ae])?1:i;a=!!a;let u=0|(i=ul(n,e,t))[ae];if(!(4&u)){4&u&&(i=_t(i),u=Cr(u,e),e=Ge(n,e,t,i));let l=0,d=0;for(;l<i.length;l++){const h=r(i[l]);h!=null&&(i[d++]=h)}d<l&&(i.length=d),u=ll(u,e),r=-4097&(20|u),u=r&=-8193,Je(i,u),2&u&&Object.freeze(i)}return s===1||s===4&&32&u?Er(u)||(a=u,u|=2,u!==a&&Je(i,u),Object.freeze(i)):(s===2&&Er(u)&&(i=_t(i),u=Cr(u,e),u=qr(u,e,a),Je(i,u),e=Ge(n,e,t,i)),Er(u)||(t=u,u=qr(u,e,a),u!==t&&Je(i,u))),i}function ul(e,t,r,i){return e=Or(e,t,r,i),Array.isArray(e)?e:Ku}function ll(e,t){return e===0&&(e=Cr(e,t)),1|e}function Er(e){return!!(2&e)&&!!(4&e)||!!(2048&e)}function Y1(e){e=_t(e);for(let t=0;t<e.length;t++){const r=e[t]=_t(e[t]);Array.isArray(r[1])&&(r[1]=Ji(r[1]))}return e}function mu(e,t,r,i){let a=0|(e=e.u)[ae];Yr(a),Ge(e,a,t,(i==="0"?Number(r)===0:r===i)?void 0:r)}function rn(e,t,r,i,a){Yr(t);var n=!(!(64&t)&&16384&t);const s=(a=ul(e,t,r,a))!==Ku;if(n||!s){let u=n=s?0|a[ae]:0;(!s||2&u||Er(u)||4&u&&!(32&u))&&(a=_t(a),u=Cr(u,t),t=Ge(e,t,r,a)),u=-13&ll(u,t),u=qr(i?-17&u:16|u,t,!0),u!==n&&Je(a,u)}return a}function ao(e,t){var r=L2;return cl(dl(e=e.u),e,0|e[ae],r)===t?t:-1}function dl(e){if(Ja)return e[pn]??(e[pn]=new Map);if(pn in e)return e[pn];const t=new Map;return Object.defineProperty(e,pn,{value:t}),t}function Z1(e,t,r,i){const a=dl(e),n=cl(a,e,t,r);return n!==i&&(n&&(t=Ge(e,t,n)),a.set(r,i)),t}function cl(e,t,r,i){let a=e.get(i);if(a!=null)return a;a=0;for(let n=0;n<i.length;n++){const s=i[n];Or(t,r,s)!=null&&(a!==0&&(r=Ge(t,r,a)),a=s)}return e.set(i,a),a}function hl(e,t,r,i){let a,n=0|e[ae];if((i=Or(e,n,r,i))!=null&&i.W===jn)return(t=os(i))!==i&&Ge(e,n,r,t),t.u;if(Array.isArray(i)){const s=0|i[ae];a=2&s?jr(ss(i,s,!1),t,!0):64&s?i:jr(a,t,!0)}else a=jr(void 0,t,!0);return a!==i&&Ge(e,n,r,a),a}function Q1(e,t,r,i){let a=0|(e=e.u)[ae];return(t=al(i=Or(e,a,r,i),t,!1,a))!==i&&t!=null&&Ge(e,a,r,t),t}function $e(e,t,r,i=!1){if((t=Q1(e,t,r,i))==null)return t;if(!(2&(i=0|(e=e.u)[ae]))){const a=os(t);a!==t&&Ge(e,i,r,t=a)}return t}function J1(e,t,r,i,a,n,s){e=e.u;var u=!!(2&t);const l=u?1:a;n=!!n,s&&(s=!u);var d=0|(a=ul(e,t,i))[ae];if(!(u=!!(4&d))){var h=a,f=t;const g=!!(2&(d=ll(d,t)));g&&(f|=2);let y=!g,_=!0,w=0,x=0;for(;w<h.length;w++){const $=al(h[w],r,!1,f);if($ instanceof r){if(!g){const v=!!(2&(0|$.u[ae]));y&&(y=!v),_&&(_=v)}h[x++]=$}}x<w&&(h.length=x),d|=4,d=_?16|d:-17&d,Je(h,d=y?8|d:-9&d),g&&Object.freeze(h)}if(s&&!(8&d||!a.length&&(l===1||l===4&&32&d))){for(Er(d)&&(a=_t(a),d=Cr(d,t),t=Ge(e,t,i,a)),r=a,s=d,h=0;h<r.length;h++)(d=r[h])!==(f=os(d))&&(r[h]=f);s|=8,Je(r,s=r.length?-17&s:16|s),d=s}return l===1||l===4&&32&d?Er(d)||(t=d,(d|=!a.length||16&d&&(!u||32&d)?2:2048)!==t&&Je(a,d),Object.freeze(a)):(l===2&&Er(d)&&(Je(a=_t(a),d=qr(d=Cr(d,t),t,n)),t=Ge(e,t,i,a)),Er(d)||(i=d,(d=qr(d,t,n))!==i&&Je(a,d))),a}function Ir(e,t,r){const i=0|e.u[ae];return J1(e,i,t,r,mi(),!1,!(2&i))}function ue(e,t,r,i){return i==null&&(i=void 0),Me(e,r,i)}function Rn(e,t,r,i){i==null&&(i=void 0);e:{let a=0|(e=e.u)[ae];if(Yr(a),i==null){const n=dl(e);if(cl(n,e,a,r)!==t)break e;n.set(r,0)}else a=Z1(e,a,r,t);Ge(e,a,t,i)}}function Cr(e,t){return-2049&(e=32|(2&t?2|e:-3&e))}function qr(e,t,r){return 32&t&&r||(e&=-33),e}function La(e,t,r,i){const a=0|e.u[ae];Yr(a),e=J1(e,a,r,t,2,!0),i=i??new r,e.push(i),e[ae]=2&(0|i.u[ae])?-9&e[ae]:-17&e[ae]}function Ut(e,t){return en(ji(e,t))}function Vt(e,t){return Gi(ji(e,t))}function Xe(e,t){return Ea(e,t)??0}function Ln(e,t,r){if(r!=null&&typeof r!="boolean")throw e=typeof r,Error(`Expected boolean but got ${e!="object"?e:r?Array.isArray(r)?"array":e:"null"}: ${r}`);Me(e,t,r)}function fr(e,t,r){if(r!=null){if(typeof r!="number"||!ns(r))throw cu("int32");r|=0}Me(e,t,r)}function re(e,t,r){if(r!=null&&typeof r!="number")throw Error(`Value of float/double field must be a number, found ${typeof r}: ${r}`);Me(e,t,r)}function Ua(e,t,r){{const s=e.u;let u=0|s[ae];if(Yr(u),r==null)Ge(s,u,t);else{var i=e=0|r[ae],a=Er(e),n=a||Object.isFrozen(r);for(a||(e=0),n||(r=_t(r),i=0,e=qr(e=Cr(e,u),u,!0),n=!1),e|=21,a=0;a<r.length;a++){const l=r[a],d=G1(l);Object.is(l,d)||(n&&(r=_t(r),i=0,e=qr(e=Cr(e,u),u,!0),n=!1),r[a]=d)}e!==i&&(n&&(r=_t(r),e=qr(e=Cr(e,u),u,!0)),Je(r,e)),Ge(s,u,t,r)}}}function us(e,t,r){Yr(0|e.u[ae]),gi(e,t,Gi,2,!0).push(G1(r))}function e2(e,t){return Error(`Invalid wire type: ${e} (at position ${t})`)}function pl(){return Error("Failed to read varint, encoding is invalid.")}function t2(e,t){return Error(`Tried to read past the end of the data ${t} > ${e}`)}function fl(e){if(typeof e=="string")return{buffer:B1(e),N:!1};if(Array.isArray(e))return{buffer:new Uint8Array(e),N:!1};if(e.constructor===Uint8Array)return{buffer:e,N:!1};if(e.constructor===ArrayBuffer)return{buffer:new Uint8Array(e),N:!1};if(e.constructor===Sr)return{buffer:qu(e)||new Uint8Array(0),N:!0};if(e instanceof Uint8Array)return{buffer:new Uint8Array(e.buffer,e.byteOffset,e.byteLength),N:!1};throw Error("Type not convertible to a Uint8Array, expected a Uint8Array, an ArrayBuffer, a base64 encoded string, a ByteString or an Array of numbers")}function ml(e,t){let r,i=0,a=0,n=0;const s=e.h;let u=e.g;do r=s[u++],i|=(127&r)<<n,n+=7;while(n<32&&128&r);for(n>32&&(a|=(127&r)>>4),n=3;n<32&&128&r;n+=7)r=s[u++],a|=(127&r)<<n;if(yi(e,u),r<128)return t(i>>>0,a>>>0);throw pl()}function gl(e){let t=0,r=e.g;const i=r+10,a=e.h;for(;r<i;){const n=a[r++];if(t|=n,(128&n)==0)return yi(e,r),!!(127&t)}throw pl()}function Hr(e){const t=e.h;let r=e.g,i=t[r++],a=127&i;if(128&i&&(i=t[r++],a|=(127&i)<<7,128&i&&(i=t[r++],a|=(127&i)<<14,128&i&&(i=t[r++],a|=(127&i)<<21,128&i&&(i=t[r++],a|=i<<28,128&i&&128&t[r++]&&128&t[r++]&&128&t[r++]&&128&t[r++]&&128&t[r++])))))throw pl();return yi(e,r),a}function zr(e){return Hr(e)>>>0}function gu(e){var t=e.h;const r=e.g,i=t[r],a=t[r+1],n=t[r+2];return t=t[r+3],yi(e,e.g+4),(i<<0|a<<8|n<<16|t<<24)>>>0}function yu(e){var t=gu(e);e=2*(t>>31)+1;const r=t>>>23&255;return t&=8388607,r==255?t?NaN:e*(1/0):r==0?1401298464324817e-60*e*t:e*Math.pow(2,r-150)*(t+8388608)}function hw(e){return Hr(e)}function so(e,t,{ba:r=!1}={}){e.ba=r,t&&(t=fl(t),e.h=t.buffer,e.m=t.N,e.j=0,e.l=e.h.length,e.g=e.j)}function yi(e,t){if(e.g=t,t>e.l)throw t2(e.l,t)}function r2(e,t){if(t<0)throw Error(`Tried to read a negative byte length: ${t}`);const r=e.g,i=r+t;if(i>e.l)throw t2(t,e.l-r);return e.g=i,r}function i2(e,t){if(t==0)return vi();var r=r2(e,t);return e.ba&&e.m?r=e.h.subarray(r,r+t):(e=e.h,r=r===(t=r+t)?new Uint8Array(0):Jb?e.slice(r,t):new Uint8Array(e.subarray(r,t))),r.length==0?vi():new Sr(r,Fi)}Ft.prototype.toJSON=void 0,Ft.prototype.Ia=U1;var th=[];function n2(e){var t=e.g;if(t.g==t.l)return!1;e.l=e.g.g;var r=zr(e.g);if(t=r>>>3,!((r&=7)>=0&&r<=5))throw e2(r,e.l);if(t<1)throw Error(`Invalid field number: ${t} (at position ${e.l})`);return e.m=t,e.h=r,!0}function Sa(e){switch(e.h){case 0:e.h!=0?Sa(e):gl(e.g);break;case 1:yi(e=e.g,e.g+8);break;case 2:if(e.h!=2)Sa(e);else{var t=zr(e.g);yi(e=e.g,e.g+t)}break;case 5:yi(e=e.g,e.g+4);break;case 3:for(t=e.m;;){if(!n2(e))throw Error("Unmatched start-group tag: stream EOF");if(e.h==4){if(e.m!=t)throw Error("Unmatched end-group tag");break}Sa(e)}break;default:throw e2(e.h,e.l)}}function qn(e,t,r){const i=e.g.l,a=zr(e.g),n=e.g.g+a;let s=n-i;if(s<=0&&(e.g.l=n,r(t,e,void 0,void 0,void 0),s=n-e.g.g),s)throw Error(`Message parsing ended unexpectedly. Expected to read ${a} bytes, instead read ${a-s} bytes, either the data ended unexpectedly or the message misreported its own length`);return e.g.g=n,e.g.l=i,t}function yl(e){var t=zr(e.g),r=r2(e=e.g,t);if(e=e.h,Mb){var i,a=e;(i=Qs)||(i=Qs=new TextDecoder("utf-8",{fatal:!0})),t=r+t,a=r===0&&t===a.length?a:a.subarray(r,t);try{var n=i.decode(a)}catch(u){if(na===void 0){try{i.decode(new Uint8Array([128]))}catch{}try{i.decode(new Uint8Array([97])),na=!0}catch{na=!1}}throw!na&&(Qs=void 0),u}}else{t=(n=r)+t,r=[];let u,l=null;for(;n<t;){var s=e[n++];s<128?r.push(s):s<224?n>=t?si():(u=e[n++],s<194||(192&u)!=128?(n--,si()):r.push((31&s)<<6|63&u)):s<240?n>=t-1?si():(u=e[n++],(192&u)!=128||s===224&&u<160||s===237&&u>=160||(192&(i=e[n++]))!=128?(n--,si()):r.push((15&s)<<12|(63&u)<<6|63&i)):s<=244?n>=t-2?si():(u=e[n++],(192&u)!=128||u-144+(s<<28)>>30||(192&(i=e[n++]))!=128||(192&(a=e[n++]))!=128?(n--,si()):(s=(7&s)<<18|(63&u)<<12|(63&i)<<6|63&a,s-=65536,r.push(55296+(s>>10&1023),56320+(1023&s)))):si(),r.length>=8192&&(l=Pc(l,r),r.length=0)}n=Pc(l,r)}return n}function a2(e){const t=zr(e.g);return i2(e.g,t)}function ls(e,t,r){var i=zr(e.g);for(i=e.g.g+i;e.g.g<i;)r.push(t(e.g))}var aa=[];function pw(e){return e}let Di;function tr(e,t,r){t.g?t.m(e,t.g,t.h,r):t.m(e,t.h,r)}var te=class{constructor(t,r){this.u=K1(t,r)}toJSON(){const t=!Di;try{return t&&(Di=H1),s2(this)}finally{t&&(Di=void 0)}}l(){var t=Xw;return t.g?t.l(this,t.g,t.h,!0):t.l(this,t.h,t.defaultValue,!0)}clone(){const t=this.u;return new this.constructor(ss(t,0|t[ae],!1))}N(){return!!(2&(0|this.u[ae]))}};function s2(e){var t=e.u;{t=(e=Di(t))!==t;let d=e.length;if(d){var r=e[d-1],i=Xu(r);i?d--:r=void 0;var a=e;if(i){e:{var n,s=r,u=!1;if(s)for(let h in s)isNaN(+h)?(n??(n={}))[h]=s[h]:(i=s[h],Array.isArray(i)&&(Ba(i)||jc(i)&&i.size===0)&&(i=null),i==null&&(u=!0),i!=null&&((n??(n={}))[h]=i));if(u||(n=s),n)for(let h in n){u=n;break e}u=null}s=u==null?r!=null:u!==r}for(;d>0&&((n=a[d-1])==null||Ba(n)||jc(n)&&n.size===0);d--)var l=!0;(a!==e||s||l)&&(t?(l||s||u)&&(a.length=d):a=Array.prototype.slice.call(a,0,d),u&&a.push(u)),l=a}else l=e}return l}function rh(e){return e?/^\d+$/.test(e)?(is(e),new _u(Re,qe)):null:fw||(fw=new _u(0,0))}te.prototype.W=jn,te.prototype.toString=function(){try{return Di=pw,s2(this).toString()}finally{Di=void 0}};var _u=class{constructor(t,r){this.h=t>>>0,this.g=r>>>0}};let fw;function ih(e){return e?/^-?\d+$/.test(e)?(is(e),new bu(Re,qe)):null:mw||(mw=new bu(0,0))}var bu=class{constructor(t,r){this.h=t>>>0,this.g=r>>>0}};let mw;function Pi(e,t,r){for(;r>0||t>127;)e.g.push(127&t|128),t=(t>>>7|r<<25)>>>0,r>>>=7;e.g.push(t)}function nn(e,t){for(;t>127;)e.g.push(127&t|128),t>>>=7;e.g.push(t)}function ds(e,t){if(t>=0)nn(e,t);else{for(let r=0;r<9;r++)e.g.push(127&t|128),t>>=7;e.g.push(1)}}function Un(e,t){e.g.push(t>>>0&255),e.g.push(t>>>8&255),e.g.push(t>>>16&255),e.g.push(t>>>24&255)}function qi(e,t){t.length!==0&&(e.l.push(t),e.h+=t.length)}function Ot(e,t,r){nn(e.g,8*t+r)}function _l(e,t){return Ot(e,t,2),t=e.g.end(),qi(e,t),t.push(e.h),t}function bl(e,t){var r=t.pop();for(r=e.h+e.g.length()-r;r>127;)t.push(127&r|128),r>>>=7,e.h++;t.push(r),e.h++}function cs(e,t,r){Ot(e,t,2),nn(e.g,r.length),qi(e,e.g.end()),qi(e,r)}function Fa(e,t,r,i){r!=null&&(t=_l(e,t),i(r,e),bl(e,t))}function rr(){const e=class{constructor(){throw Error()}};return Object.setPrototypeOf(e,e.prototype),e}var wl=rr(),o2=rr(),vl=rr(),$l=rr(),u2=rr(),l2=rr(),xl=rr(),d2=rr(),c2=rr(),an=class{constructor(e,t,r){this.g=e,this.h=t,e=wl,this.l=!!e&&r===e||!1}};function hs(e,t){return new an(e,t,wl)}function h2(e,t,r,i,a){Fa(e,r,g2(t,i),a)}const gw=hs(function(e,t,r,i,a){return e.h===2&&(qn(e,hl(t,i,r),a),!0)},h2),yw=hs(function(e,t,r,i,a){return e.h===2&&(qn(e,hl(t,i,r,!0),a),!0)},h2);var ps=Symbol(),Tl=Symbol(),nh=Symbol(),ah=Symbol();let p2,f2;function ki(e,t,r,i){var a=i[e];if(a)return a;(a={}).Pa=i,a.V=function(f){switch(typeof f){case"boolean":return j1||(j1=[0,void 0,!0]);case"number":return f>0?void 0:f===0?dw||(dw=[0,void 0]):[-f,void 0];case"string":return[0,f];case"object":return f}}(i[0]);var n=i[1];let s=1;n&&n.constructor===Object&&(a.ga=n,typeof(n=i[++s])=="function"&&(a.la=!0,p2??(p2=n),f2??(f2=i[s+1]),n=i[s+=2]));const u={};for(;n&&Array.isArray(n)&&n.length&&typeof n[0]=="number"&&n[0]>0;){for(var l=0;l<n.length;l++)u[n[l]]=n;n=i[++s]}for(l=1;n!==void 0;){let f;typeof n=="number"&&(l+=n,n=i[++s]);var d=void 0;if(n instanceof an?f=n:(f=gw,s--),f==null?void 0:f.l){n=i[++s],d=i;var h=s;typeof n=="function"&&(n=n(),d[h]=n),d=n}for(h=l+1,typeof(n=i[++s])=="number"&&n<0&&(h-=n,n=i[++s]);l<h;l++){const g=u[l];d?r(a,l,f,d,g):t(a,l,f,g)}}return i[e]=a}function m2(e){return Array.isArray(e)?e[0]instanceof an?e:[yw,e]:[e,void 0]}function g2(e,t){return e instanceof te?e.u:Array.isArray(e)?jr(e,t,!1):void 0}function kl(e,t,r,i){const a=r.g;e[t]=i?(n,s,u)=>a(n,s,u,i):a}function El(e,t,r,i,a){const n=r.g;let s,u;e[t]=(l,d,h)=>n(l,d,h,u||(u=ki(Tl,kl,El,i).V),s||(s=Sl(i)),a)}function Sl(e){let t=e[nh];if(t!=null)return t;const r=ki(Tl,kl,El,e);return t=r.la?(i,a)=>p2(i,a,r):(i,a)=>{const n=0|i[ae];for(;n2(a)&&a.h!=4;){var s=a.m,u=r[s];if(u==null){var l=r.ga;l&&(l=l[s])&&(l=_w(l))!=null&&(u=r[s]=l)}u!=null&&u(a,i,s)||(s=(u=a).l,Sa(u),u.fa?u=void 0:(l=u.g.g-s,u.g.g=s,u=i2(u.g,l)),s=i,u&&((l=s[Vi])?l.push(u):s[Vi]=[u]))}return 16384&n&&Ji(i),!0},e[nh]=t}function _w(e){const t=(e=m2(e))[0].g;if(e=e[1]){const r=Sl(e),i=ki(Tl,kl,El,e).V;return(a,n,s)=>t(a,n,s,i,r)}return t}function fs(e,t,r){e[t]=r.h}function ms(e,t,r,i){let a,n;const s=r.h;e[t]=(u,l,d)=>s(u,l,d,n||(n=ki(ps,fs,ms,i).V),a||(a=y2(i)))}function y2(e){let t=e[ah];if(!t){const r=ki(ps,fs,ms,e);t=(i,a)=>_2(i,a,r),e[ah]=t}return t}function _2(e,t,r){for(var i=0|e[ae],a=512&i?0:-1,n=e.length,s=512&i?1:0,u=n+(256&i?-1:0);s<u;s++){const l=e[s];if(l==null)continue;const d=s-a,h=sh(r,d);h&&h(t,l,d)}if(256&i){i=e[n-1];for(const l in i)a=+l,Number.isNaN(a)||(n=i[a])!=null&&(u=sh(r,a))&&u(t,n,a)}if(e=Zu(e))for(qi(t,t.g.end()),r=0;r<e.length;r++)qi(t,qu(e[r])||new Uint8Array(0))}function sh(e,t){var r=e[t];if(r)return r;if((r=e.ga)&&(r=r[t])){var i=(r=m2(r))[0].h;if(r=r[1]){const a=y2(r),n=ki(ps,fs,ms,r).V;r=e.la?f2(n,a):(s,u,l)=>i(s,u,l,n,a)}else r=i;return e[t]=r}}function sn(e,t){if(Array.isArray(t)){var r=0|t[ae];if(4&r)return t;for(var i=0,a=0;i<t.length;i++){const n=e(t[i]);n!=null&&(t[a++]=n)}return a<i&&(t.length=a),Je(t,-12289&(5|r)),2&r&&Object.freeze(t),t}}function ft(e,t,r){return new an(e,t,r)}function on(e,t,r){return new an(e,t,r)}function mt(e,t,r){Ge(e,0|e[ae],t,r)}var bw=hs(function(e,t,r,i,a){return e.h===2&&(e=qn(e,jr([void 0,void 0],i,!0),a),Yr(i=0|t[ae]),(a=Or(t,i,r))instanceof Ft?2&a.L?((a=a.X()).push(e),Ge(t,i,r,a)):a.Na(e):Array.isArray(a)?(2&(0|a[ae])&&Ge(t,i,r,a=Y1(a)),a.push(e)):Ge(t,i,r,[e]),!0)},function(e,t,r,i,a){if(t instanceof Ft)t.forEach((n,s)=>{Fa(e,r,jr([s,n],i,!1),a)});else if(Array.isArray(t))for(let n=0;n<t.length;n++){const s=t[n];Array.isArray(s)&&Fa(e,r,jr(s,i,!1),a)}});function b2(e,t,r){if(t=function(i){if(i==null)return i;const a=typeof i;if(a==="bigint")return String(rl(64,i));if(as(i)){if(a==="string")return nl(i);if(a==="number")return il(i)}}(t),t!=null&&(typeof t=="string"&&ih(t),t!=null))switch(Ot(e,r,0),typeof t){case"number":e=e.g,Wi(t),Pi(e,Re,qe);break;case"bigint":r=BigInt.asUintN(64,t),r=new bu(Number(r&BigInt(4294967295)),Number(r>>BigInt(32))),Pi(e.g,r.h,r.g);break;default:r=ih(t),Pi(e.g,r.h,r.g)}}function w2(e,t,r){(t=en(t))!=null&&t!=null&&(Ot(e,r,0),ds(e.g,t))}function v2(e,t,r){(t=V1(t))!=null&&(Ot(e,r,0),e.g.g.push(t?1:0))}function $2(e,t,r){(t=Gi(t))!=null&&cs(e,r,I1(t))}function x2(e,t,r,i,a){Fa(e,r,g2(t,i),a)}function T2(e,t,r){(t=t==null||typeof t=="string"||Wn(t)||t instanceof Sr?t:void 0)!=null&&cs(e,r,fl(t).buffer)}function k2(e,t,r){return(e.h===5||e.h===2)&&(t=rn(t,0|t[ae],r,!1,!1),e.h==2?ls(e,yu,t):t.push(yu(e.g)),!0)}var xr=ft(function(e,t,r){if(e.h!==1)return!1;var i=e.g;e=gu(i);const a=gu(i);i=2*(a>>31)+1;const n=a>>>20&2047;return e=4294967296*(1048575&a)+e,mt(t,r,n==2047?e?NaN:i*(1/0):n==0?5e-324*i*e:i*Math.pow(2,n-1075)*(e+4503599627370496)),!0},function(e,t,r){(t=Zr(t))!=null&&(Ot(e,r,1),e=e.g,(r=F1||(F1=new DataView(new ArrayBuffer(8)))).setFloat64(0,+t,!0),Re=r.getUint32(0,!0),qe=r.getUint32(4,!0),Un(e,Re),Un(e,qe))},rr()),et=ft(function(e,t,r){return e.h===5&&(mt(t,r,yu(e.g)),!0)},function(e,t,r){(t=Zr(t))!=null&&(Ot(e,r,5),e=e.g,Qu(t),Un(e,Re))},xl),ww=on(k2,function(e,t,r){if((t=sn(Zr,t))!=null)for(let s=0;s<t.length;s++){var i=e,a=r,n=t[s];n!=null&&(Ot(i,a,5),i=i.g,Qu(n),Un(i,Re))}},xl),Cl=on(k2,function(e,t,r){if((t=sn(Zr,t))!=null&&t.length){Ot(e,r,2),nn(e.g,4*t.length);for(let i=0;i<t.length;i++)r=e.g,Qu(t[i]),Un(r,Re)}},xl),Kr=ft(function(e,t,r){return e.h===0&&(mt(t,r,ml(e.g,el)),!0)},b2,l2),oo=ft(function(e,t,r){return e.h===0&&(mt(t,r,(e=ml(e.g,el))===0?void 0:e),!0)},b2,l2),vw=ft(function(e,t,r){return e.h===0&&(mt(t,r,ml(e.g,Ju)),!0)},function(e,t,r){if((t=rw(t))!=null&&(typeof t=="string"&&rh(t),t!=null))switch(Ot(e,r,0),typeof t){case"number":e=e.g,Wi(t),Pi(e,Re,qe);break;case"bigint":r=BigInt.asUintN(64,t),r=new _u(Number(r&BigInt(4294967295)),Number(r>>BigInt(32))),Pi(e.g,r.h,r.g);break;default:r=rh(t),Pi(e.g,r.h,r.g)}},rr()),He=ft(function(e,t,r){return e.h===0&&(mt(t,r,Hr(e.g)),!0)},w2,$l),gs=on(function(e,t,r){return(e.h===0||e.h===2)&&(t=rn(t,0|t[ae],r,!1,!1),e.h==2?ls(e,Hr,t):t.push(Hr(e.g)),!0)},function(e,t,r){if((t=sn(en,t))!=null&&t.length){r=_l(e,r);for(let i=0;i<t.length;i++)ds(e.g,t[i]);bl(e,r)}},$l),Ri=ft(function(e,t,r){return e.h===0&&(mt(t,r,(e=Hr(e.g))===0?void 0:e),!0)},w2,$l),Ue=ft(function(e,t,r){return e.h===0&&(mt(t,r,gl(e.g)),!0)},v2,o2),Li=ft(function(e,t,r){return e.h===0&&(mt(t,r,(e=gl(e.g))===!1?void 0:e),!0)},v2,o2),lt=on(function(e,t,r){return e.h===2&&(e=yl(e),rn(t,0|t[ae],r,!1).push(e),!0)},function(e,t,r){if((t=sn(Gi,t))!=null)for(let s=0;s<t.length;s++){var i=e,a=r,n=t[s];n!=null&&cs(i,a,I1(n))}},vl),Gr=ft(function(e,t,r){return e.h===2&&(mt(t,r,(e=yl(e))===""?void 0:e),!0)},$2,vl),Ie=ft(function(e,t,r){return e.h===2&&(mt(t,r,yl(e)),!0)},$2,vl),rt=function(e,t,r=wl){return new an(e,t,r)}(function(e,t,r,i,a){return e.h===2&&(i=jr(void 0,i,!0),rn(t,0|t[ae],r,!0).push(i),qn(e,i,a),!0)},function(e,t,r,i,a){if(Array.isArray(t))for(let n=0;n<t.length;n++)x2(e,t[n],r,i,a)}),ze=hs(function(e,t,r,i,a,n){return e.h===2&&(Z1(t,0|t[ae],n,r),qn(e,t=hl(t,i,r),a),!0)},x2),E2=ft(function(e,t,r){return e.h===2&&(mt(t,r,a2(e)),!0)},T2,d2),$w=on(function(e,t,r){return(e.h===0||e.h===2)&&(t=rn(t,0|t[ae],r,!1,!1),e.h==2?ls(e,zr,t):t.push(zr(e.g)),!0)},function(e,t,r){if((t=sn(W1,t))!=null)for(let s=0;s<t.length;s++){var i=e,a=r,n=t[s];n!=null&&(Ot(i,a,0),nn(i.g,n))}},u2),xw=ft(function(e,t,r){return e.h===0&&(mt(t,r,(e=zr(e.g))===0?void 0:e),!0)},function(e,t,r){(t=W1(t))!=null&&t!=null&&(Ot(e,r,0),nn(e.g,t))},u2),Wt=ft(function(e,t,r){return e.h===0&&(mt(t,r,Hr(e.g)),!0)},function(e,t,r){(t=en(t))!=null&&(t=parseInt(t,10),Ot(e,r,0),ds(e.g,t))},c2);class Tw{constructor(t,r){this.h=t,this.g=r,this.l=$e,this.m=ue,this.defaultValue=void 0}}function ir(e,t){return new Tw(e,t)}function Qr(e,t){return(r,i)=>{if(aa.length){const n=aa.pop();n.o(i),so(n.g,r,i),r=n}else r=new class{constructor(n,s){if(th.length){const u=th.pop();so(u,n,s),n=u}else n=new class{constructor(u,l){this.h=null,this.m=!1,this.g=this.l=this.j=0,so(this,u,l)}clear(){this.h=null,this.m=!1,this.g=this.l=this.j=0,this.ba=!1}}(n,s);this.g=n,this.l=this.g.g,this.h=this.m=-1,this.o(s)}o({fa:n=!1}={}){this.fa=n}}(r,i);try{const n=new e,s=n.u;Sl(t)(s,r);var a=n}finally{r.g.clear(),r.m=-1,r.h=-1,aa.length<100&&aa.push(r)}return a}}function ys(e){return function(){const t=new class{constructor(){this.l=[],this.h=0,this.g=new class{constructor(){this.g=[]}length(){return this.g.length}end(){const s=this.g;return this.g=[],s}}}};_2(this.u,t,ki(ps,fs,ms,e)),qi(t,t.g.end());const r=new Uint8Array(t.h),i=t.l,a=i.length;let n=0;for(let s=0;s<a;s++){const u=i[s];r.set(u,n),n+=u.length}return t.l=[r],r}}var oh=class extends te{constructor(e){super(e)}},uh=[0,Gr,ft(function(e,t,r){return e.h===2&&(mt(t,r,(e=a2(e))===vi()?void 0:e),!0)},function(e,t,r){if(t!=null){if(t instanceof te){const i=t.Ra;return void(i&&(t=i(t),t!=null&&cs(e,r,fl(t).buffer)))}if(Array.isArray(t))return}T2(e,t,r)},d2)];let uo,lh=globalThis.trustedTypes;function dh(e){uo===void 0&&(uo=function(){let r=null;if(!lh)return r;try{const i=a=>a;r=lh.createPolicy("goog#html",{createHTML:i,createScript:i,createScriptURL:i})}catch{}return r}());var t=uo;return new class{constructor(r){this.g=r}toString(){return this.g+""}}(t?t.createScriptURL(e):e)}function kw(e,...t){if(t.length===0)return dh(e[0]);let r=e[0];for(let i=0;i<t.length;i++)r+=encodeURIComponent(t[i])+e[i+1];return dh(r)}var S2=[0,He,Wt,Ue,-1,gs,Wt,-1],Ew=class extends te{constructor(e){super(e)}},C2=[0,Ue,Ie,Ue,Wt,-1,on(function(e,t,r){return(e.h===0||e.h===2)&&(t=rn(t,0|t[ae],r,!1,!1),e.h==2?ls(e,hw,t):t.push(Hr(e.g)),!0)},function(e,t,r){if((t=sn(en,t))!=null&&t.length){r=_l(e,r);for(let i=0;i<t.length;i++)ds(e.g,t[i]);bl(e,r)}},c2),Ie,-1,[0,Ue,-1],Wt,Ue,-1],A2=[0,Ie,-2],ch=class extends te{constructor(e){super(e)}},I2=[0],z2=[0,He,Ue,1,Ue,-3],zt=class extends te{constructor(e){super(e,2)}},tt={};tt[336783863]=[0,Ie,Ue,-1,He,[0,[1,2,3,4,5,6,7,8],ze,I2,ze,C2,ze,A2,ze,z2,ze,S2,ze,[0,Ie,-2],ze,[0,Ie,Wt],ze,[0,Wt,Ie]],[0,Ie],Ue,[0,[1,3],[2,4],ze,[0,gs],-1,ze,[0,lt],-1,rt,[0,Ie,-1]],Ie];var hh=[0,oo,-1,Li,-3,oo,gs,Gr,Ri,oo,-1,Li,Ri,Li,-2,Gr];function Rt(e,t){mu(e,2,tn(t),"")}function Be(e,t){us(e,3,t)}function be(e,t){us(e,4,t)}var pt=class extends te{constructor(t){super(t,500)}o(t){return ue(this,0,7,t)}},Mn=[-1,{}],ph=[0,Ie,1,Mn],fh=[0,Ie,lt,Mn];function Mt(e,t){La(e,1,pt,t)}function De(e,t){us(e,10,t)}function Te(e,t){us(e,15,t)}var wt=class extends te{constructor(e){super(e,500)}o(e){return ue(this,0,1001,e)}},O2=[-500,rt,[-500,Gr,-1,lt,-3,[-2,tt,Ue],rt,uh,Ri,-1,ph,fh,rt,[0,Gr,Li],Gr,hh,Ri,lt,987,lt],4,rt,[-500,Ie,-1,[-1,{}],998,Ie],rt,[-500,Ie,lt,-1,[-2,{},Ue],997,lt,-1],Ri,rt,[-500,Ie,lt,Mn,998,lt],lt,Ri,ph,fh,rt,[0,Gr,-1,Mn],lt,-2,hh,Gr,-1,Li,[0,Li,xw],978,Mn,rt,uh];wt.prototype.g=ys(O2);var Sw=Qr(wt,O2),Cw=class extends te{constructor(t){super(t)}},R2=class extends te{constructor(t){super(t)}g(){return Ir(this,Cw,1)}},M2=[0,rt,[0,He,et,Ie,-1]],_s=Qr(R2,M2),Aw=class extends te{constructor(t){super(t)}},Iw=class extends te{constructor(t){super(t)}},lo=class extends te{constructor(t){super(t)}h(){return $e(this,Aw,2)}g(){return Ir(this,Iw,5)}},B2=Qr(class extends te{constructor(e){super(e)}},[0,lt,gs,Cl,[0,Wt,[0,He,-3],[0,et,-3],[0,He,-1,[0,rt,[0,He,-2]]],rt,[0,et,-1,Ie,et]],Ie,-1,Kr,rt,[0,He,et],lt,Kr]),N2=class extends te{constructor(t){super(t)}},Ui=Qr(class extends te{constructor(e){super(e)}},[0,rt,[0,et,-4]]),D2=class extends te{constructor(t){super(t)}},Hn=Qr(class extends te{constructor(e){super(e)}},[0,rt,[0,et,-4]]),zw=class extends te{constructor(t){super(t)}},Ow=[0,He,-1,Cl,Wt],P2=class extends te{constructor(t){super(t)}};P2.prototype.g=ys([0,et,-4,Kr]);var Rw=class extends te{constructor(t){super(t)}},Mw=Qr(class extends te{constructor(e){super(e)}},[0,rt,[0,1,He,Ie,M2],Kr]),mh=class extends te{constructor(t){super(t)}},Bw=class extends te{constructor(t){super(t)}oa(){const t=X1(this);return t??vi()}},Nw=class extends te{constructor(t){super(t)}},L2=[1,2],Dw=Qr(class extends te{constructor(e){super(e)}},[0,rt,[0,L2,ze,[0,Cl],ze,[0,E2],He,Ie],Kr]),Al=class extends te{constructor(t){super(t)}},U2=[0,Ie,He,et,lt,-1],gh=class extends te{constructor(t){super(t)}},Pw=[0,Ue,-1],yh=class extends te{constructor(t){super(t)}},Ca=[1,2,3,4,5],Va=class extends te{constructor(t){super(t)}g(){return X1(this)!=null}h(){return Vt(this,2)!=null}},Ve=class extends te{constructor(t){super(t)}g(){return V1(ji(this,2))??!1}},F2=[0,E2,Ie,[0,He,Kr,-1],[0,vw,Kr]],Ye=[0,F2,Ue,[0,Ca,ze,z2,ze,C2,ze,S2,ze,I2,ze,A2],Wt],bs=class extends te{constructor(t){super(t)}},Il=[0,Ye,et,-1,He],Lw=ir(502141897,bs);tt[502141897]=Il;var Uw=Qr(class extends te{constructor(e){super(e)}},[0,[0,Wt,-1,ww,$w],Ow]),V2=class extends te{constructor(t){super(t)}},W2=class extends te{constructor(t){super(t)}},zl=[0,Ye,et,[0,Ye],Ue],G2=[0,Ye,Il,zl,et,[0,[0,F2]]],Fw=ir(508968150,W2);tt[508968150]=G2,tt[508968149]=zl;var j2=class extends te{constructor(t){super(t)}},Vw=ir(513916220,j2);tt[513916220]=[0,Ye,G2,He];var Ai=class extends te{constructor(t){super(t)}h(){return $e(this,Al,2)}g(){Me(this,2)}},q2=[0,Ye,U2];tt[478825465]=q2;var Ww=class extends te{constructor(t){super(t)}},H2=class extends te{constructor(t){super(t)}},Ol=class extends te{constructor(t){super(t)}},Rl=class extends te{constructor(t){super(t)}},K2=class extends te{constructor(t){super(t)}},_h=[0,Ye,[0,Ye],q2,-1],X2=[0,Ye,et,He],Ml=[0,Ye,et],Y2=[0,Ye,X2,Ml,et],Gw=ir(479097054,K2);tt[479097054]=[0,Ye,Y2,_h],tt[463370452]=_h,tt[464864288]=X2;var jw=ir(462713202,Rl);tt[462713202]=Y2,tt[474472470]=Ml;var qw=class extends te{constructor(t){super(t)}},Z2=class extends te{constructor(t){super(t)}},Q2=class extends te{constructor(t){super(t)}},J2=class extends te{constructor(t){super(t)}},Bl=[0,Ye,et,-1,He],wu=[0,Ye,et,Ue];J2.prototype.g=ys([0,Ye,Ml,[0,Ye],Il,zl,Bl,wu]);var eg=class extends te{constructor(t){super(t)}},Hw=ir(456383383,eg);tt[456383383]=[0,Ye,U2];var tg=class extends te{constructor(t){super(t)}},Kw=ir(476348187,tg);tt[476348187]=[0,Ye,Pw];var rg=class extends te{constructor(t){super(t)}},bh=class extends te{constructor(t){super(t)}},ig=[0,Wt,-1],Xw=ir(458105876,class extends te{constructor(e){super(e)}g(){var e=this.u;const t=0|e[ae],r=2&t;return e=function(i,a,n){var s=bh;const u=2&a;let l=!1;if(n==null){if(u)return eh();n=[]}else if(n.constructor===Ft){if(!(2&n.L)||u)return n;n=n.X()}else Array.isArray(n)?l=!!(2&(0|n[ae])):n=[];if(u){if(!n.length)return eh();l||(l=!0,Ji(n))}else l&&(l=!1,n=Y1(n));return l||(64&(0|n[ae])?n[ae]&=-33:32&a&&es(n,32)),Ge(i,a,2,s=new Ft(n,s,iw,void 0)),s}(e,t,Or(e,t,2)),!r&&bh&&(e.ra=!0),e}});tt[458105876]=[0,ig,bw,[!0,Kr,[0,Ie,-1,lt]]];var Nl=class extends te{constructor(t){super(t)}},ng=ir(458105758,Nl);tt[458105758]=[0,Ye,Ie,ig];var ag=class extends te{constructor(t){super(t)}},Yw=ir(443442058,ag);tt[443442058]=[0,Ye,Ie,He,et,lt,-1,Ue,et],tt[514774813]=Bl;var sg=class extends te{constructor(t){super(t)}},Zw=ir(516587230,sg);function vu(e,t){return t=t?t.clone():new Al,e.displayNamesLocale!==void 0?Me(t,1,tn(e.displayNamesLocale)):e.displayNamesLocale===void 0&&Me(t,1),e.maxResults!==void 0?fr(t,2,e.maxResults):"maxResults"in e&&Me(t,2),e.scoreThreshold!==void 0?re(t,3,e.scoreThreshold):"scoreThreshold"in e&&Me(t,3),e.categoryAllowlist!==void 0?Ua(t,4,e.categoryAllowlist):"categoryAllowlist"in e&&Me(t,4),e.categoryDenylist!==void 0?Ua(t,5,e.categoryDenylist):"categoryDenylist"in e&&Me(t,5),t}function Dl(e,t=-1,r=""){return{categories:e.map(i=>({index:Ut(i,1)??0??-1,score:Xe(i,2)??0,categoryName:Vt(i,3)??""??"",displayName:Vt(i,4)??""??""})),headIndex:t,headName:r}}function og(e){var s,u;var t=gi(e,3,Zr,mi()),r=gi(e,2,en,mi()),i=gi(e,1,Gi,mi()),a=gi(e,9,Gi,mi());const n={categories:[],keypoints:[]};for(let l=0;l<t.length;l++)n.categories.push({score:t[l],index:r[l]??-1,categoryName:i[l]??"",displayName:a[l]??""});if((t=(s=$e(e,lo,4))==null?void 0:s.h())&&(n.boundingBox={originX:Ut(t,1)??0,originY:Ut(t,2)??0,width:Ut(t,3)??0,height:Ut(t,4)??0,angle:0}),(u=$e(e,lo,4))==null?void 0:u.g().length)for(const l of $e(e,lo,4).g())n.keypoints.push({x:Ea(l,1)??0,y:Ea(l,2)??0,score:Ea(l,4)??0,label:Vt(l,3)??""});return n}function ws(e){const t=[];for(const r of Ir(e,D2,1))t.push({x:Xe(r,1)??0,y:Xe(r,2)??0,z:Xe(r,3)??0,visibility:Xe(r,4)??0});return t}function Bn(e){const t=[];for(const r of Ir(e,N2,1))t.push({x:Xe(r,1)??0,y:Xe(r,2)??0,z:Xe(r,3)??0,visibility:Xe(r,4)??0});return t}function wh(e){return Array.from(e,t=>t>127?t-256:t)}function vh(e,t){if(e.length!==t.length)throw Error(`Cannot compute cosine similarity between embeddings of different sizes (${e.length} vs. ${t.length}).`);let r=0,i=0,a=0;for(let n=0;n<e.length;n++)r+=e[n]*t[n],i+=e[n]*e[n],a+=t[n]*t[n];if(i<=0||a<=0)throw Error("Cannot compute cosine similarity on embedding with 0 norm.");return r/Math.sqrt(i*a)}let sa;tt[516587230]=[0,Ye,Bl,wu,et],tt[518928384]=wu;const Qw=new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,10,1,8,0,65,0,253,15,253,98,11]);async function ug(){if(sa===void 0)try{await WebAssembly.instantiate(Qw),sa=!0}catch{sa=!1}return sa}async function fn(e,t=kw``){const r=await ug()?"wasm_internal":"wasm_nosimd_internal";return{wasmLoaderPath:`${t}/${e}_${r}.js`,wasmBinaryPath:`${t}/${e}_${r}.wasm`}}var ci=class{};function lg(){var e=navigator;return typeof OffscreenCanvas<"u"&&(!function(t=navigator){return(t=t.userAgent).includes("Safari")&&!t.includes("Chrome")}(e)||!!((e=e.userAgent.match(/Version\/([\d]+).*Safari/))&&e.length>=1&&Number(e[1])>=17))}async function $h(e){if(typeof importScripts!="function"){const t=document.createElement("script");return t.src=e.toString(),t.crossOrigin="anonymous",new Promise((r,i)=>{t.addEventListener("load",()=>{r()},!1),t.addEventListener("error",a=>{i(a)},!1),document.body.appendChild(t)})}importScripts(e.toString())}function dg(e){return e.videoWidth!==void 0?[e.videoWidth,e.videoHeight]:e.naturalWidth!==void 0?[e.naturalWidth,e.naturalHeight]:e.displayWidth!==void 0?[e.displayWidth,e.displayHeight]:[e.width,e.height]}function ne(e,t,r){e.m||console.error("No wasm multistream support detected: ensure dependency inclusion of :gl_graph_runner_internal_multi_input target"),r(t=e.i.stringToNewUTF8(t)),e.i._free(t)}function xh(e,t,r){if(!e.i.canvas)throw Error("No OpenGL canvas configured.");if(r?e.i._bindTextureToStream(r):e.i._bindTextureToCanvas(),!(r=e.i.canvas.getContext("webgl2")||e.i.canvas.getContext("webgl")))throw Error("Failed to obtain WebGL context from the provided canvas. `getContext()` should only be invoked with `webgl` or `webgl2`.");e.i.gpuOriginForWebTexturesIsBottomLeft&&r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,!0),r.texImage2D(r.TEXTURE_2D,0,r.RGBA,r.RGBA,r.UNSIGNED_BYTE,t),e.i.gpuOriginForWebTexturesIsBottomLeft&&r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,!1);const[i,a]=dg(t);return!e.l||i===e.i.canvas.width&&a===e.i.canvas.height||(e.i.canvas.width=i,e.i.canvas.height=a),[i,a]}function Th(e,t,r){e.m||console.error("No wasm multistream support detected: ensure dependency inclusion of :gl_graph_runner_internal_multi_input target");const i=new Uint32Array(t.length);for(let a=0;a<t.length;a++)i[a]=e.i.stringToNewUTF8(t[a]);t=e.i._malloc(4*i.length),e.i.HEAPU32.set(i,t>>2),r(t);for(const a of i)e.i._free(a);e.i._free(t)}function ur(e,t,r){e.i.simpleListeners=e.i.simpleListeners||{},e.i.simpleListeners[t]=r}function Lr(e,t,r){let i=[];e.i.simpleListeners=e.i.simpleListeners||{},e.i.simpleListeners[t]=(a,n,s)=>{n?(r(i,s),i=[]):i.push(a)}}ci.forVisionTasks=function(e){return fn("vision",e)},ci.forTextTasks=function(e){return fn("text",e)},ci.forGenAiExperimentalTasks=function(e){return fn("genai_experimental",e)},ci.forGenAiTasks=function(e){return fn("genai",e)},ci.forAudioTasks=function(e){return fn("audio",e)},ci.isSimdSupported=function(){return ug()};async function Jw(e,t,r,i){return e=await(async(a,n,s,u,l)=>{if(n&&await $h(n),!self.ModuleFactory||s&&(await $h(s),!self.ModuleFactory))throw Error("ModuleFactory not set.");return self.Module&&l&&((n=self.Module).locateFile=l.locateFile,l.mainScriptUrlOrBlob&&(n.mainScriptUrlOrBlob=l.mainScriptUrlOrBlob)),l=await self.ModuleFactory(self.Module||l),self.ModuleFactory=self.Module=void 0,new a(l,u)})(e,r.wasmLoaderPath,r.assetLoaderPath,t,{locateFile:a=>a.endsWith(".wasm")?r.wasmBinaryPath.toString():r.assetBinaryPath&&a.endsWith(".data")?r.assetBinaryPath.toString():a}),await e.o(i),e}function co(e,t){const r=$e(e.baseOptions,Va,1)||new Va;typeof t=="string"?(Me(r,2,tn(t)),Me(r,1)):t instanceof Uint8Array&&(Me(r,1,Yu(t,!1)),Me(r,2)),ue(e.baseOptions,0,1,r)}function kh(e){try{const t=e.G.length;if(t===1)throw Error(e.G[0].message);if(t>1)throw Error("Encountered multiple errors: "+e.G.map(r=>r.message).join(", "))}finally{e.G=[]}}function X(e,t){e.B=Math.max(e.B,t)}function vs(e,t){e.A=new pt,Rt(e.A,"PassThroughCalculator"),Be(e.A,"free_memory"),be(e.A,"free_memory_unused_out"),De(t,"free_memory"),Mt(t,e.A)}function Hi(e,t){Be(e.A,t),be(e.A,t+"_unused_out")}function $s(e){e.g.addBoolToStream(!0,"free_memory",e.B)}var Aa=class{constructor(t){this.g=t,this.G=[],this.B=0,this.g.setAutoRenderToScreen(!1)}l(t,r=!0){var i,a,n,s,u,l;if(r){const d=t.baseOptions||{};if((i=t.baseOptions)!=null&&i.modelAssetBuffer&&((a=t.baseOptions)!=null&&a.modelAssetPath))throw Error("Cannot set both baseOptions.modelAssetPath and baseOptions.modelAssetBuffer");if(!((n=$e(this.baseOptions,Va,1))!=null&&n.g()||(s=$e(this.baseOptions,Va,1))!=null&&s.h()||(u=t.baseOptions)!=null&&u.modelAssetBuffer||(l=t.baseOptions)!=null&&l.modelAssetPath))throw Error("Either baseOptions.modelAssetPath or baseOptions.modelAssetBuffer must be set");if(function(h,f){let g=$e(h.baseOptions,yh,3);if(!g){var y=g=new yh,_=new ch;Rn(y,4,Ca,_)}"delegate"in f&&(f.delegate==="GPU"?(f=g,y=new Ew,Rn(f,2,Ca,y)):(f=g,y=new ch,Rn(f,4,Ca,y))),ue(h.baseOptions,0,3,g)}(this,d),d.modelAssetPath)return fetch(d.modelAssetPath.toString()).then(h=>{if(h.ok)return h.arrayBuffer();throw Error(`Failed to fetch model: ${d.modelAssetPath} (${h.status})`)}).then(h=>{try{this.g.i.FS_unlink("/model.dat")}catch{}this.g.i.FS_createDataFile("/","model.dat",new Uint8Array(h),!0,!1,!1),co(this,"/model.dat"),this.m(),this.I()});if(d.modelAssetBuffer instanceof Uint8Array)co(this,d.modelAssetBuffer);else if(d.modelAssetBuffer)return async function(h){const f=[];for(var g=0;;){const{done:y,value:_}=await h.read();if(y)break;f.push(_),g+=_.length}if(f.length===0)return new Uint8Array(0);if(f.length===1)return f[0];h=new Uint8Array(g),g=0;for(const y of f)h.set(y,g),g+=y.length;return h}(d.modelAssetBuffer).then(h=>{co(this,h),this.m(),this.I()})}return this.m(),this.I(),Promise.resolve()}I(){}da(){let t;if(this.g.da(r=>{t=Sw(r)}),!t)throw Error("Failed to retrieve CalculatorGraphConfig");return t}setGraph(t,r){this.g.attachErrorListener((i,a)=>{this.G.push(Error(a))}),this.g.La(),this.g.setGraph(t,r),this.A=void 0,kh(this)}finishProcessing(){this.g.finishProcessing(),kh(this)}close(){this.A=void 0,this.g.closeGraph()}};function Ar(e,t){if(!e)throw Error(`Unable to obtain required WebGL resource: ${t}`);return e}Aa.prototype.close=Aa.prototype.close,function(e,t){e=e.split(".");var r,i=wi;for((e[0]in i)||i.execScript===void 0||i.execScript("var "+e[0]);e.length&&(r=e.shift());)e.length||t===void 0?i=i[r]&&i[r]!==Object.prototype[r]?i[r]:i[r]={}:i[r]=t}("TaskRunner",Aa);class e4{constructor(t,r,i,a){this.g=t,this.h=r,this.m=i,this.l=a}bind(){this.g.bindVertexArray(this.h)}close(){this.g.deleteVertexArray(this.h),this.g.deleteBuffer(this.m),this.g.deleteBuffer(this.l)}}function Eh(e,t,r){const i=e.g;if(r=Ar(i.createShader(r),"Failed to create WebGL shader"),i.shaderSource(r,t),i.compileShader(r),!i.getShaderParameter(r,i.COMPILE_STATUS))throw Error(`Could not compile WebGL shader: ${i.getShaderInfoLog(r)}`);return i.attachShader(e.h,r),r}function Sh(e,t){const r=e.g,i=Ar(r.createVertexArray(),"Failed to create vertex array");r.bindVertexArray(i);const a=Ar(r.createBuffer(),"Failed to create buffer");r.bindBuffer(r.ARRAY_BUFFER,a),r.enableVertexAttribArray(e.O),r.vertexAttribPointer(e.O,2,r.FLOAT,!1,0,0),r.bufferData(r.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),r.STATIC_DRAW);const n=Ar(r.createBuffer(),"Failed to create buffer");return r.bindBuffer(r.ARRAY_BUFFER,n),r.enableVertexAttribArray(e.I),r.vertexAttribPointer(e.I,2,r.FLOAT,!1,0,0),r.bufferData(r.ARRAY_BUFFER,new Float32Array(t?[0,1,0,0,1,0,1,1]:[0,0,0,1,1,1,1,0]),r.STATIC_DRAW),r.bindBuffer(r.ARRAY_BUFFER,null),r.bindVertexArray(null),new e4(r,i,a,n)}function Pl(e,t){if(e.g){if(t!==e.g)throw Error("Cannot change GL context once initialized")}else e.g=t}function Ll(e,t,r,i){return Pl(e,t),e.h||(e.m(),e.C()),r?(e.s||(e.s=Sh(e,!0)),r=e.s):(e.v||(e.v=Sh(e,!1)),r=e.v),t.useProgram(e.h),r.bind(),e.l(),e=i(),r.g.bindVertexArray(null),e}function xs(e,t,r){return Pl(e,t),e=Ar(t.createTexture(),"Failed to create texture"),t.bindTexture(t.TEXTURE_2D,e),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,r??t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,r??t.LINEAR),t.bindTexture(t.TEXTURE_2D,null),e}function Ts(e,t,r){Pl(e,t),e.A||(e.A=Ar(t.createFramebuffer(),"Failed to create framebuffe.")),t.bindFramebuffer(t.FRAMEBUFFER,e.A),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,r,0)}function Ul(e){var t;(t=e.g)==null||t.bindFramebuffer(e.g.FRAMEBUFFER,null)}var Fl=class{G(){return`
  precision mediump float;
  varying vec2 vTex;
  uniform sampler2D inputTexture;
  void main() {
    gl_FragColor = texture2D(inputTexture, vTex);
  }
 `}m(){const t=this.g;if(this.h=Ar(t.createProgram(),"Failed to create WebGL program"),this.aa=Eh(this,`
  attribute vec2 aVertex;
  attribute vec2 aTex;
  varying vec2 vTex;
  void main(void) {
    gl_Position = vec4(aVertex, 0.0, 1.0);
    vTex = aTex;
  }`,t.VERTEX_SHADER),this.Z=Eh(this,this.G(),t.FRAGMENT_SHADER),t.linkProgram(this.h),!t.getProgramParameter(this.h,t.LINK_STATUS))throw Error(`Error during program linking: ${t.getProgramInfoLog(this.h)}`);this.O=t.getAttribLocation(this.h,"aVertex"),this.I=t.getAttribLocation(this.h,"aTex")}C(){}l(){}close(){if(this.h){const t=this.g;t.deleteProgram(this.h),t.deleteShader(this.aa),t.deleteShader(this.Z)}this.A&&this.g.deleteFramebuffer(this.A),this.v&&this.v.close(),this.s&&this.s.close()}};function Tr(e,t){switch(t){case 0:return e.g.find(r=>r instanceof Uint8Array);case 1:return e.g.find(r=>r instanceof Float32Array);case 2:return e.g.find(r=>typeof WebGLTexture<"u"&&r instanceof WebGLTexture);default:throw Error(`Type is not supported: ${t}`)}}function $u(e){var t=Tr(e,1);if(!t){if(t=Tr(e,0))t=new Float32Array(t).map(i=>i/255);else{t=new Float32Array(e.width*e.height);const i=Ki(e);var r=Vl(e);if(Ts(r,i,cg(e)),"iPad Simulator;iPhone Simulator;iPod Simulator;iPad;iPhone;iPod".split(";").includes(navigator.platform)||navigator.userAgent.includes("Mac")&&"document"in self&&"ontouchend"in self.document){r=new Float32Array(e.width*e.height*4),i.readPixels(0,0,e.width,e.height,i.RGBA,i.FLOAT,r);for(let a=0,n=0;a<t.length;++a,n+=4)t[a]=r[n]}else i.readPixels(0,0,e.width,e.height,i.RED,i.FLOAT,t)}e.g.push(t)}return t}function cg(e){let t=Tr(e,2);if(!t){const r=Ki(e);t=pg(e);const i=$u(e),a=hg(e);r.texImage2D(r.TEXTURE_2D,0,a,e.width,e.height,0,r.RED,r.FLOAT,i),xu(e)}return t}function Ki(e){if(!e.canvas)throw Error("Conversion to different image formats require that a canvas is passed when initializing the image.");return e.h||(e.h=Ar(e.canvas.getContext("webgl2"),"You cannot use a canvas that is already bound to a different type of rendering context.")),e.h}function hg(e){if(e=Ki(e),!oa)if(e.getExtension("EXT_color_buffer_float")&&e.getExtension("OES_texture_float_linear")&&e.getExtension("EXT_float_blend"))oa=e.R32F;else{if(!e.getExtension("EXT_color_buffer_half_float"))throw Error("GPU does not fully support 4-channel float32 or float16 formats");oa=e.R16F}return oa}function Vl(e){return e.l||(e.l=new Fl),e.l}function pg(e){const t=Ki(e);t.viewport(0,0,e.width,e.height),t.activeTexture(t.TEXTURE0);let r=Tr(e,2);return r||(r=xs(Vl(e),t,e.m?t.LINEAR:t.NEAREST),e.g.push(r),e.j=!0),t.bindTexture(t.TEXTURE_2D,r),r}function xu(e){e.h.bindTexture(e.h.TEXTURE_2D,null)}var oa,nt=class{constructor(t,r,i,a,n,s,u){this.g=t,this.m=r,this.j=i,this.canvas=a,this.l=n,this.width=s,this.height=u,this.j&&--Ch===0&&console.error("You seem to be creating MPMask instances without invoking .close(). This leaks resources.")}Fa(){return!!Tr(this,0)}ja(){return!!Tr(this,1)}P(){return!!Tr(this,2)}ia(){return(r=Tr(t=this,0))||(r=$u(t),r=new Uint8Array(r.map(i=>255*i)),t.g.push(r)),r;var t,r}ha(){return $u(this)}M(){return cg(this)}clone(){const t=[];for(const r of this.g){let i;if(r instanceof Uint8Array)i=new Uint8Array(r);else if(r instanceof Float32Array)i=new Float32Array(r);else{if(!(r instanceof WebGLTexture))throw Error(`Type is not supported: ${r}`);{const a=Ki(this),n=Vl(this);a.activeTexture(a.TEXTURE1),i=xs(n,a,this.m?a.LINEAR:a.NEAREST),a.bindTexture(a.TEXTURE_2D,i);const s=hg(this);a.texImage2D(a.TEXTURE_2D,0,s,this.width,this.height,0,a.RED,a.FLOAT,null),a.bindTexture(a.TEXTURE_2D,null),Ts(n,a,i),Ll(n,a,!1,()=>{pg(this),a.clearColor(0,0,0,0),a.clear(a.COLOR_BUFFER_BIT),a.drawArrays(a.TRIANGLE_FAN,0,4),xu(this)}),Ul(n),xu(this)}}t.push(i)}return new nt(t,this.m,this.P(),this.canvas,this.l,this.width,this.height)}close(){this.j&&Ki(this).deleteTexture(Tr(this,2)),Ch=-1}};nt.prototype.close=nt.prototype.close,nt.prototype.clone=nt.prototype.clone,nt.prototype.getAsWebGLTexture=nt.prototype.M,nt.prototype.getAsFloat32Array=nt.prototype.ha,nt.prototype.getAsUint8Array=nt.prototype.ia,nt.prototype.hasWebGLTexture=nt.prototype.P,nt.prototype.hasFloat32Array=nt.prototype.ja,nt.prototype.hasUint8Array=nt.prototype.Fa;var Ch=250;function pr(e,t){switch(t){case 0:return e.g.find(r=>r instanceof ImageData);case 1:return e.g.find(r=>typeof ImageBitmap<"u"&&r instanceof ImageBitmap);case 2:return e.g.find(r=>typeof WebGLTexture<"u"&&r instanceof WebGLTexture);default:throw Error(`Type is not supported: ${t}`)}}function fg(e){var t=pr(e,0);if(!t){t=Xi(e);const r=ks(e),i=new Uint8Array(e.width*e.height*4);Ts(r,t,Ia(e)),t.readPixels(0,0,e.width,e.height,t.RGBA,t.UNSIGNED_BYTE,i),Ul(r),t=new ImageData(new Uint8ClampedArray(i.buffer),e.width,e.height),e.g.push(t)}return t}function Ia(e){let t=pr(e,2);if(!t){const r=Xi(e);t=za(e);const i=pr(e,1)||fg(e);r.texImage2D(r.TEXTURE_2D,0,r.RGBA,r.RGBA,r.UNSIGNED_BYTE,i),Cn(e)}return t}function Xi(e){if(!e.canvas)throw Error("Conversion to different image formats require that a canvas is passed when initializing the image.");return e.h||(e.h=Ar(e.canvas.getContext("webgl2"),"You cannot use a canvas that is already bound to a different type of rendering context.")),e.h}function ks(e){return e.l||(e.l=new Fl),e.l}function za(e){const t=Xi(e);t.viewport(0,0,e.width,e.height),t.activeTexture(t.TEXTURE0);let r=pr(e,2);return r||(r=xs(ks(e),t),e.g.push(r),e.m=!0),t.bindTexture(t.TEXTURE_2D,r),r}function Cn(e){e.h.bindTexture(e.h.TEXTURE_2D,null)}function Ah(e){const t=Xi(e);return Ll(ks(e),t,!0,()=>function(r,i){const a=r.canvas;if(a.width===r.width&&a.height===r.height)return i();const n=a.width,s=a.height;return a.width=r.width,a.height=r.height,r=i(),a.width=n,a.height=s,r}(e,()=>{if(t.bindFramebuffer(t.FRAMEBUFFER,null),t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT),t.drawArrays(t.TRIANGLE_FAN,0,4),!(e.canvas instanceof OffscreenCanvas))throw Error("Conversion to ImageBitmap requires that the MediaPipe Tasks is initialized with an OffscreenCanvas");return e.canvas.transferToImageBitmap()}))}var at=class{constructor(t,r,i,a,n,s,u){this.g=t,this.j=r,this.m=i,this.canvas=a,this.l=n,this.width=s,this.height=u,(this.j||this.m)&&--Ih===0&&console.error("You seem to be creating MPImage instances without invoking .close(). This leaks resources.")}Ea(){return!!pr(this,0)}ka(){return!!pr(this,1)}P(){return!!pr(this,2)}Ca(){return fg(this)}Ba(){var t=pr(this,1);return t||(Ia(this),za(this),t=Ah(this),Cn(this),this.g.push(t),this.j=!0),t}M(){return Ia(this)}clone(){const t=[];for(const r of this.g){let i;if(r instanceof ImageData)i=new ImageData(r.data,this.width,this.height);else if(r instanceof WebGLTexture){const a=Xi(this),n=ks(this);a.activeTexture(a.TEXTURE1),i=xs(n,a),a.bindTexture(a.TEXTURE_2D,i),a.texImage2D(a.TEXTURE_2D,0,a.RGBA,this.width,this.height,0,a.RGBA,a.UNSIGNED_BYTE,null),a.bindTexture(a.TEXTURE_2D,null),Ts(n,a,i),Ll(n,a,!1,()=>{za(this),a.clearColor(0,0,0,0),a.clear(a.COLOR_BUFFER_BIT),a.drawArrays(a.TRIANGLE_FAN,0,4),Cn(this)}),Ul(n),Cn(this)}else{if(!(r instanceof ImageBitmap))throw Error(`Type is not supported: ${r}`);Ia(this),za(this),i=Ah(this),Cn(this)}t.push(i)}return new at(t,this.ka(),this.P(),this.canvas,this.l,this.width,this.height)}close(){this.j&&pr(this,1).close(),this.m&&Xi(this).deleteTexture(pr(this,2)),Ih=-1}};at.prototype.close=at.prototype.close,at.prototype.clone=at.prototype.clone,at.prototype.getAsWebGLTexture=at.prototype.M,at.prototype.getAsImageBitmap=at.prototype.Ba,at.prototype.getAsImageData=at.prototype.Ca,at.prototype.hasWebGLTexture=at.prototype.P,at.prototype.hasImageBitmap=at.prototype.ka,at.prototype.hasImageData=at.prototype.Ea;var Ih=250;function nr(...e){return e.map(([t,r])=>({start:t,end:r}))}const t4=function(e){return class extends e{La(){this.i._registerModelResourcesGraphService()}}}((zh=class{constructor(e,t){this.l=!0,this.i=e,this.g=null,this.h=0,this.m=typeof this.i._addIntToInputStream=="function",t!==void 0?this.i.canvas=t:lg()?this.i.canvas=new OffscreenCanvas(1,1):(console.warn("OffscreenCanvas not supported and GraphRunner constructor glCanvas parameter is undefined. Creating backup canvas."),this.i.canvas=document.createElement("canvas"))}async initializeGraph(e){const t=await(await fetch(e)).arrayBuffer();e=!(e.endsWith(".pbtxt")||e.endsWith(".textproto")),this.setGraph(new Uint8Array(t),e)}setGraphFromString(e){this.setGraph(new TextEncoder().encode(e),!1)}setGraph(e,t){const r=e.length,i=this.i._malloc(r);this.i.HEAPU8.set(e,i),t?this.i._changeBinaryGraph(r,i):this.i._changeTextGraph(r,i),this.i._free(i)}configureAudio(e,t,r,i,a){this.i._configureAudio||console.warn('Attempting to use configureAudio without support for input audio. Is build dep ":gl_graph_runner_audio" missing?'),ne(this,i||"input_audio",n=>{ne(this,a=a||"audio_header",s=>{this.i._configureAudio(n,s,e,t??0,r)})})}setAutoResizeCanvas(e){this.l=e}setAutoRenderToScreen(e){this.i._setAutoRenderToScreen(e)}setGpuBufferVerticalFlip(e){this.i.gpuOriginForWebTexturesIsBottomLeft=e}da(e){ur(this,"__graph_config__",t=>{e(t)}),ne(this,"__graph_config__",t=>{this.i._getGraphConfig(t,void 0)}),delete this.i.simpleListeners.__graph_config__}attachErrorListener(e){this.i.errorListener=e}attachEmptyPacketListener(e,t){this.i.emptyPacketListeners=this.i.emptyPacketListeners||{},this.i.emptyPacketListeners[e]=t}addAudioToStream(e,t,r){this.addAudioToStreamWithShape(e,0,0,t,r)}addAudioToStreamWithShape(e,t,r,i,a){const n=4*e.length;this.h!==n&&(this.g&&this.i._free(this.g),this.g=this.i._malloc(n),this.h=n),this.i.HEAPF32.set(e,this.g/4),ne(this,i,s=>{this.i._addAudioToInputStream(this.g,t,r,s,a)})}addGpuBufferToStream(e,t,r){ne(this,t,i=>{const[a,n]=xh(this,e,i);this.i._addBoundTextureToStream(i,a,n,r)})}addBoolToStream(e,t,r){ne(this,t,i=>{this.i._addBoolToInputStream(e,i,r)})}addDoubleToStream(e,t,r){ne(this,t,i=>{this.i._addDoubleToInputStream(e,i,r)})}addFloatToStream(e,t,r){ne(this,t,i=>{this.i._addFloatToInputStream(e,i,r)})}addIntToStream(e,t,r){ne(this,t,i=>{this.i._addIntToInputStream(e,i,r)})}addUintToStream(e,t,r){ne(this,t,i=>{this.i._addUintToInputStream(e,i,r)})}addStringToStream(e,t,r){ne(this,t,i=>{ne(this,e,a=>{this.i._addStringToInputStream(a,i,r)})})}addStringRecordToStream(e,t,r){ne(this,t,i=>{Th(this,Object.keys(e),a=>{Th(this,Object.values(e),n=>{this.i._addFlatHashMapToInputStream(a,n,Object.keys(e).length,i,r)})})})}addProtoToStream(e,t,r,i){ne(this,r,a=>{ne(this,t,n=>{const s=this.i._malloc(e.length);this.i.HEAPU8.set(e,s),this.i._addProtoToInputStream(s,e.length,n,a,i),this.i._free(s)})})}addEmptyPacketToStream(e,t){ne(this,e,r=>{this.i._addEmptyPacketToInputStream(r,t)})}addBoolVectorToStream(e,t,r){ne(this,t,i=>{const a=this.i._allocateBoolVector(e.length);if(!a)throw Error("Unable to allocate new bool vector on heap.");for(const n of e)this.i._addBoolVectorEntry(a,n);this.i._addBoolVectorToInputStream(a,i,r)})}addDoubleVectorToStream(e,t,r){ne(this,t,i=>{const a=this.i._allocateDoubleVector(e.length);if(!a)throw Error("Unable to allocate new double vector on heap.");for(const n of e)this.i._addDoubleVectorEntry(a,n);this.i._addDoubleVectorToInputStream(a,i,r)})}addFloatVectorToStream(e,t,r){ne(this,t,i=>{const a=this.i._allocateFloatVector(e.length);if(!a)throw Error("Unable to allocate new float vector on heap.");for(const n of e)this.i._addFloatVectorEntry(a,n);this.i._addFloatVectorToInputStream(a,i,r)})}addIntVectorToStream(e,t,r){ne(this,t,i=>{const a=this.i._allocateIntVector(e.length);if(!a)throw Error("Unable to allocate new int vector on heap.");for(const n of e)this.i._addIntVectorEntry(a,n);this.i._addIntVectorToInputStream(a,i,r)})}addUintVectorToStream(e,t,r){ne(this,t,i=>{const a=this.i._allocateUintVector(e.length);if(!a)throw Error("Unable to allocate new unsigned int vector on heap.");for(const n of e)this.i._addUintVectorEntry(a,n);this.i._addUintVectorToInputStream(a,i,r)})}addStringVectorToStream(e,t,r){ne(this,t,i=>{const a=this.i._allocateStringVector(e.length);if(!a)throw Error("Unable to allocate new string vector on heap.");for(const n of e)ne(this,n,s=>{this.i._addStringVectorEntry(a,s)});this.i._addStringVectorToInputStream(a,i,r)})}addBoolToInputSidePacket(e,t){ne(this,t,r=>{this.i._addBoolToInputSidePacket(e,r)})}addDoubleToInputSidePacket(e,t){ne(this,t,r=>{this.i._addDoubleToInputSidePacket(e,r)})}addFloatToInputSidePacket(e,t){ne(this,t,r=>{this.i._addFloatToInputSidePacket(e,r)})}addIntToInputSidePacket(e,t){ne(this,t,r=>{this.i._addIntToInputSidePacket(e,r)})}addUintToInputSidePacket(e,t){ne(this,t,r=>{this.i._addUintToInputSidePacket(e,r)})}addStringToInputSidePacket(e,t){ne(this,t,r=>{ne(this,e,i=>{this.i._addStringToInputSidePacket(i,r)})})}addProtoToInputSidePacket(e,t,r){ne(this,r,i=>{ne(this,t,a=>{const n=this.i._malloc(e.length);this.i.HEAPU8.set(e,n),this.i._addProtoToInputSidePacket(n,e.length,a,i),this.i._free(n)})})}addBoolVectorToInputSidePacket(e,t){ne(this,t,r=>{const i=this.i._allocateBoolVector(e.length);if(!i)throw Error("Unable to allocate new bool vector on heap.");for(const a of e)this.i._addBoolVectorEntry(i,a);this.i._addBoolVectorToInputSidePacket(i,r)})}addDoubleVectorToInputSidePacket(e,t){ne(this,t,r=>{const i=this.i._allocateDoubleVector(e.length);if(!i)throw Error("Unable to allocate new double vector on heap.");for(const a of e)this.i._addDoubleVectorEntry(i,a);this.i._addDoubleVectorToInputSidePacket(i,r)})}addFloatVectorToInputSidePacket(e,t){ne(this,t,r=>{const i=this.i._allocateFloatVector(e.length);if(!i)throw Error("Unable to allocate new float vector on heap.");for(const a of e)this.i._addFloatVectorEntry(i,a);this.i._addFloatVectorToInputSidePacket(i,r)})}addIntVectorToInputSidePacket(e,t){ne(this,t,r=>{const i=this.i._allocateIntVector(e.length);if(!i)throw Error("Unable to allocate new int vector on heap.");for(const a of e)this.i._addIntVectorEntry(i,a);this.i._addIntVectorToInputSidePacket(i,r)})}addUintVectorToInputSidePacket(e,t){ne(this,t,r=>{const i=this.i._allocateUintVector(e.length);if(!i)throw Error("Unable to allocate new unsigned int vector on heap.");for(const a of e)this.i._addUintVectorEntry(i,a);this.i._addUintVectorToInputSidePacket(i,r)})}addStringVectorToInputSidePacket(e,t){ne(this,t,r=>{const i=this.i._allocateStringVector(e.length);if(!i)throw Error("Unable to allocate new string vector on heap.");for(const a of e)ne(this,a,n=>{this.i._addStringVectorEntry(i,n)});this.i._addStringVectorToInputSidePacket(i,r)})}attachBoolListener(e,t){ur(this,e,t),ne(this,e,r=>{this.i._attachBoolListener(r)})}attachBoolVectorListener(e,t){Lr(this,e,t),ne(this,e,r=>{this.i._attachBoolVectorListener(r)})}attachIntListener(e,t){ur(this,e,t),ne(this,e,r=>{this.i._attachIntListener(r)})}attachIntVectorListener(e,t){Lr(this,e,t),ne(this,e,r=>{this.i._attachIntVectorListener(r)})}attachUintListener(e,t){ur(this,e,t),ne(this,e,r=>{this.i._attachUintListener(r)})}attachUintVectorListener(e,t){Lr(this,e,t),ne(this,e,r=>{this.i._attachUintVectorListener(r)})}attachDoubleListener(e,t){ur(this,e,t),ne(this,e,r=>{this.i._attachDoubleListener(r)})}attachDoubleVectorListener(e,t){Lr(this,e,t),ne(this,e,r=>{this.i._attachDoubleVectorListener(r)})}attachFloatListener(e,t){ur(this,e,t),ne(this,e,r=>{this.i._attachFloatListener(r)})}attachFloatVectorListener(e,t){Lr(this,e,t),ne(this,e,r=>{this.i._attachFloatVectorListener(r)})}attachStringListener(e,t){ur(this,e,t),ne(this,e,r=>{this.i._attachStringListener(r)})}attachStringVectorListener(e,t){Lr(this,e,t),ne(this,e,r=>{this.i._attachStringVectorListener(r)})}attachProtoListener(e,t,r){ur(this,e,t),ne(this,e,i=>{this.i._attachProtoListener(i,r||!1)})}attachProtoVectorListener(e,t,r){Lr(this,e,t),ne(this,e,i=>{this.i._attachProtoVectorListener(i,r||!1)})}attachAudioListener(e,t,r){this.i._attachAudioListener||console.warn('Attempting to use attachAudioListener without support for output audio. Is build dep ":gl_graph_runner_audio_out" missing?'),ur(this,e,(i,a)=>{i=new Float32Array(i.buffer,i.byteOffset,i.length/4),t(i,a)}),ne(this,e,i=>{this.i._attachAudioListener(i,r||!1)})}finishProcessing(){this.i._waitUntilIdle()}closeGraph(){this.i._closeGraph(),this.i.simpleListeners=void 0,this.i.emptyPacketListeners=void 0}},class extends zh{get ea(){return this.i}qa(e,t,r){ne(this,t,i=>{const[a,n]=xh(this,e,i);this.ea._addBoundTextureAsImageToStream(i,a,n,r)})}U(e,t){ur(this,e,t),ne(this,e,r=>{this.ea._attachImageListener(r)})}ca(e,t){Lr(this,e,t),ne(this,e,r=>{this.ea._attachImageVectorListener(r)})}}));var zh,Gt=class extends t4{};async function _e(e,t,r){return async function(i,a,n,s){return Jw(i,a,n,s)}(e,r.canvas??(lg()?void 0:document.createElement("canvas")),t,r)}function mg(e,t,r,i){if(e.T){const n=new P2;if(r!=null&&r.regionOfInterest){if(!e.pa)throw Error("This task doesn't support region-of-interest.");var a=r.regionOfInterest;if(a.left>=a.right||a.top>=a.bottom)throw Error("Expected RectF with left < right and top < bottom.");if(a.left<0||a.top<0||a.right>1||a.bottom>1)throw Error("Expected RectF values to be in [0,1].");re(n,1,(a.left+a.right)/2),re(n,2,(a.top+a.bottom)/2),re(n,4,a.right-a.left),re(n,3,a.bottom-a.top)}else re(n,1,.5),re(n,2,.5),re(n,4,1),re(n,3,1);if(r!=null&&r.rotationDegrees){if((r==null?void 0:r.rotationDegrees)%90!=0)throw Error("Expected rotation to be a multiple of 90°.");if(re(n,5,-Math.PI*r.rotationDegrees/180),(r==null?void 0:r.rotationDegrees)%180!=0){const[s,u]=dg(t);r=Xe(n,3)*u/s,a=Xe(n,4)*s/u,re(n,4,r),re(n,3,a)}}e.g.addProtoToStream(n.g(),"mediapipe.NormalizedRect",e.T,i)}e.g.qa(t,e.aa,i??performance.now()),e.finishProcessing()}function jt(e,t,r){var i;if((i=e.baseOptions)!=null&&i.g())throw Error("Task is not initialized with image mode. 'runningMode' must be set to 'IMAGE'.");mg(e,t,r,e.B+1)}function gr(e,t,r,i){var a;if(!((a=e.baseOptions)!=null&&a.g()))throw Error("Task is not initialized with video mode. 'runningMode' must be set to 'VIDEO'.");mg(e,t,r,i)}function Yi(e,t,r,i){var a=t.data;const n=t.width,s=n*(t=t.height);if((a instanceof Uint8Array||a instanceof Float32Array)&&a.length!==s)throw Error("Unsupported channel count: "+a.length/s);return e=new nt([a],r,!1,e.g.i.canvas,e.O,n,t),i?e.clone():e}var bt=class extends Aa{constructor(t,r,i,a){super(t),this.g=t,this.aa=r,this.T=i,this.pa=a,this.O=new Fl}l(t,r=!0){if("runningMode"in t&&Ln(this.baseOptions,2,!!t.runningMode&&t.runningMode!=="IMAGE"),t.canvas!==void 0&&this.g.i.canvas!==t.canvas)throw Error("You must create a new task to reset the canvas.");return super.l(t,r)}close(){this.O.close(),super.close()}};bt.prototype.close=bt.prototype.close;var Nt=class extends bt{constructor(t,r){super(new Gt(t,r),"image_in","norm_rect_in",!1),this.j={detections:[]},ue(t=this.h=new bs,0,1,r=new Ve),re(this.h,2,.5),re(this.h,3,.3)}get baseOptions(){return $e(this.h,Ve,1)}set baseOptions(t){ue(this.h,0,1,t)}o(t){return"minDetectionConfidence"in t&&re(this.h,2,t.minDetectionConfidence??.5),"minSuppressionThreshold"in t&&re(this.h,3,t.minSuppressionThreshold??.3),this.l(t)}D(t,r){return this.j={detections:[]},jt(this,t,r),this.j}F(t,r,i){return this.j={detections:[]},gr(this,t,i,r),this.j}m(){var t=new wt;De(t,"image_in"),De(t,"norm_rect_in"),Te(t,"detections");const r=new zt;tr(r,Lw,this.h);const i=new pt;Rt(i,"mediapipe.tasks.vision.face_detector.FaceDetectorGraph"),Be(i,"IMAGE:image_in"),Be(i,"NORM_RECT:norm_rect_in"),be(i,"DETECTIONS:detections"),i.o(r),Mt(t,i),this.g.attachProtoVectorListener("detections",(a,n)=>{for(const s of a)a=B2(s),this.j.detections.push(og(a));X(this,n)}),this.g.attachEmptyPacketListener("detections",a=>{X(this,a)}),t=t.g(),this.setGraph(new Uint8Array(t),!0)}};Nt.prototype.detectForVideo=Nt.prototype.F,Nt.prototype.detect=Nt.prototype.D,Nt.prototype.setOptions=Nt.prototype.o,Nt.createFromModelPath=async function(e,t){return _e(Nt,e,{baseOptions:{modelAssetPath:t}})},Nt.createFromModelBuffer=function(e,t){return _e(Nt,e,{baseOptions:{modelAssetBuffer:t}})},Nt.createFromOptions=function(e,t){return _e(Nt,e,t)};var Wl=nr([61,146],[146,91],[91,181],[181,84],[84,17],[17,314],[314,405],[405,321],[321,375],[375,291],[61,185],[185,40],[40,39],[39,37],[37,0],[0,267],[267,269],[269,270],[270,409],[409,291],[78,95],[95,88],[88,178],[178,87],[87,14],[14,317],[317,402],[402,318],[318,324],[324,308],[78,191],[191,80],[80,81],[81,82],[82,13],[13,312],[312,311],[311,310],[310,415],[415,308]),Gl=nr([263,249],[249,390],[390,373],[373,374],[374,380],[380,381],[381,382],[382,362],[263,466],[466,388],[388,387],[387,386],[386,385],[385,384],[384,398],[398,362]),jl=nr([276,283],[283,282],[282,295],[295,285],[300,293],[293,334],[334,296],[296,336]),gg=nr([474,475],[475,476],[476,477],[477,474]),ql=nr([33,7],[7,163],[163,144],[144,145],[145,153],[153,154],[154,155],[155,133],[33,246],[246,161],[161,160],[160,159],[159,158],[158,157],[157,173],[173,133]),Hl=nr([46,53],[53,52],[52,65],[65,55],[70,63],[63,105],[105,66],[66,107]),yg=nr([469,470],[470,471],[471,472],[472,469]),Kl=nr([10,338],[338,297],[297,332],[332,284],[284,251],[251,389],[389,356],[356,454],[454,323],[323,361],[361,288],[288,397],[397,365],[365,379],[379,378],[378,400],[400,377],[377,152],[152,148],[148,176],[176,149],[149,150],[150,136],[136,172],[172,58],[58,132],[132,93],[93,234],[234,127],[127,162],[162,21],[21,54],[54,103],[103,67],[67,109],[109,10]),_g=[...Wl,...Gl,...jl,...ql,...Hl,...Kl],bg=nr([127,34],[34,139],[139,127],[11,0],[0,37],[37,11],[232,231],[231,120],[120,232],[72,37],[37,39],[39,72],[128,121],[121,47],[47,128],[232,121],[121,128],[128,232],[104,69],[69,67],[67,104],[175,171],[171,148],[148,175],[118,50],[50,101],[101,118],[73,39],[39,40],[40,73],[9,151],[151,108],[108,9],[48,115],[115,131],[131,48],[194,204],[204,211],[211,194],[74,40],[40,185],[185,74],[80,42],[42,183],[183,80],[40,92],[92,186],[186,40],[230,229],[229,118],[118,230],[202,212],[212,214],[214,202],[83,18],[18,17],[17,83],[76,61],[61,146],[146,76],[160,29],[29,30],[30,160],[56,157],[157,173],[173,56],[106,204],[204,194],[194,106],[135,214],[214,192],[192,135],[203,165],[165,98],[98,203],[21,71],[71,68],[68,21],[51,45],[45,4],[4,51],[144,24],[24,23],[23,144],[77,146],[146,91],[91,77],[205,50],[50,187],[187,205],[201,200],[200,18],[18,201],[91,106],[106,182],[182,91],[90,91],[91,181],[181,90],[85,84],[84,17],[17,85],[206,203],[203,36],[36,206],[148,171],[171,140],[140,148],[92,40],[40,39],[39,92],[193,189],[189,244],[244,193],[159,158],[158,28],[28,159],[247,246],[246,161],[161,247],[236,3],[3,196],[196,236],[54,68],[68,104],[104,54],[193,168],[168,8],[8,193],[117,228],[228,31],[31,117],[189,193],[193,55],[55,189],[98,97],[97,99],[99,98],[126,47],[47,100],[100,126],[166,79],[79,218],[218,166],[155,154],[154,26],[26,155],[209,49],[49,131],[131,209],[135,136],[136,150],[150,135],[47,126],[126,217],[217,47],[223,52],[52,53],[53,223],[45,51],[51,134],[134,45],[211,170],[170,140],[140,211],[67,69],[69,108],[108,67],[43,106],[106,91],[91,43],[230,119],[119,120],[120,230],[226,130],[130,247],[247,226],[63,53],[53,52],[52,63],[238,20],[20,242],[242,238],[46,70],[70,156],[156,46],[78,62],[62,96],[96,78],[46,53],[53,63],[63,46],[143,34],[34,227],[227,143],[123,117],[117,111],[111,123],[44,125],[125,19],[19,44],[236,134],[134,51],[51,236],[216,206],[206,205],[205,216],[154,153],[153,22],[22,154],[39,37],[37,167],[167,39],[200,201],[201,208],[208,200],[36,142],[142,100],[100,36],[57,212],[212,202],[202,57],[20,60],[60,99],[99,20],[28,158],[158,157],[157,28],[35,226],[226,113],[113,35],[160,159],[159,27],[27,160],[204,202],[202,210],[210,204],[113,225],[225,46],[46,113],[43,202],[202,204],[204,43],[62,76],[76,77],[77,62],[137,123],[123,116],[116,137],[41,38],[38,72],[72,41],[203,129],[129,142],[142,203],[64,98],[98,240],[240,64],[49,102],[102,64],[64,49],[41,73],[73,74],[74,41],[212,216],[216,207],[207,212],[42,74],[74,184],[184,42],[169,170],[170,211],[211,169],[170,149],[149,176],[176,170],[105,66],[66,69],[69,105],[122,6],[6,168],[168,122],[123,147],[147,187],[187,123],[96,77],[77,90],[90,96],[65,55],[55,107],[107,65],[89,90],[90,180],[180,89],[101,100],[100,120],[120,101],[63,105],[105,104],[104,63],[93,137],[137,227],[227,93],[15,86],[86,85],[85,15],[129,102],[102,49],[49,129],[14,87],[87,86],[86,14],[55,8],[8,9],[9,55],[100,47],[47,121],[121,100],[145,23],[23,22],[22,145],[88,89],[89,179],[179,88],[6,122],[122,196],[196,6],[88,95],[95,96],[96,88],[138,172],[172,136],[136,138],[215,58],[58,172],[172,215],[115,48],[48,219],[219,115],[42,80],[80,81],[81,42],[195,3],[3,51],[51,195],[43,146],[146,61],[61,43],[171,175],[175,199],[199,171],[81,82],[82,38],[38,81],[53,46],[46,225],[225,53],[144,163],[163,110],[110,144],[52,65],[65,66],[66,52],[229,228],[228,117],[117,229],[34,127],[127,234],[234,34],[107,108],[108,69],[69,107],[109,108],[108,151],[151,109],[48,64],[64,235],[235,48],[62,78],[78,191],[191,62],[129,209],[209,126],[126,129],[111,35],[35,143],[143,111],[117,123],[123,50],[50,117],[222,65],[65,52],[52,222],[19,125],[125,141],[141,19],[221,55],[55,65],[65,221],[3,195],[195,197],[197,3],[25,7],[7,33],[33,25],[220,237],[237,44],[44,220],[70,71],[71,139],[139,70],[122,193],[193,245],[245,122],[247,130],[130,33],[33,247],[71,21],[21,162],[162,71],[170,169],[169,150],[150,170],[188,174],[174,196],[196,188],[216,186],[186,92],[92,216],[2,97],[97,167],[167,2],[141,125],[125,241],[241,141],[164,167],[167,37],[37,164],[72,38],[38,12],[12,72],[38,82],[82,13],[13,38],[63,68],[68,71],[71,63],[226,35],[35,111],[111,226],[101,50],[50,205],[205,101],[206,92],[92,165],[165,206],[209,198],[198,217],[217,209],[165,167],[167,97],[97,165],[220,115],[115,218],[218,220],[133,112],[112,243],[243,133],[239,238],[238,241],[241,239],[214,135],[135,169],[169,214],[190,173],[173,133],[133,190],[171,208],[208,32],[32,171],[125,44],[44,237],[237,125],[86,87],[87,178],[178,86],[85,86],[86,179],[179,85],[84,85],[85,180],[180,84],[83,84],[84,181],[181,83],[201,83],[83,182],[182,201],[137,93],[93,132],[132,137],[76,62],[62,183],[183,76],[61,76],[76,184],[184,61],[57,61],[61,185],[185,57],[212,57],[57,186],[186,212],[214,207],[207,187],[187,214],[34,143],[143,156],[156,34],[79,239],[239,237],[237,79],[123,137],[137,177],[177,123],[44,1],[1,4],[4,44],[201,194],[194,32],[32,201],[64,102],[102,129],[129,64],[213,215],[215,138],[138,213],[59,166],[166,219],[219,59],[242,99],[99,97],[97,242],[2,94],[94,141],[141,2],[75,59],[59,235],[235,75],[24,110],[110,228],[228,24],[25,130],[130,226],[226,25],[23,24],[24,229],[229,23],[22,23],[23,230],[230,22],[26,22],[22,231],[231,26],[112,26],[26,232],[232,112],[189,190],[190,243],[243,189],[221,56],[56,190],[190,221],[28,56],[56,221],[221,28],[27,28],[28,222],[222,27],[29,27],[27,223],[223,29],[30,29],[29,224],[224,30],[247,30],[30,225],[225,247],[238,79],[79,20],[20,238],[166,59],[59,75],[75,166],[60,75],[75,240],[240,60],[147,177],[177,215],[215,147],[20,79],[79,166],[166,20],[187,147],[147,213],[213,187],[112,233],[233,244],[244,112],[233,128],[128,245],[245,233],[128,114],[114,188],[188,128],[114,217],[217,174],[174,114],[131,115],[115,220],[220,131],[217,198],[198,236],[236,217],[198,131],[131,134],[134,198],[177,132],[132,58],[58,177],[143,35],[35,124],[124,143],[110,163],[163,7],[7,110],[228,110],[110,25],[25,228],[356,389],[389,368],[368,356],[11,302],[302,267],[267,11],[452,350],[350,349],[349,452],[302,303],[303,269],[269,302],[357,343],[343,277],[277,357],[452,453],[453,357],[357,452],[333,332],[332,297],[297,333],[175,152],[152,377],[377,175],[347,348],[348,330],[330,347],[303,304],[304,270],[270,303],[9,336],[336,337],[337,9],[278,279],[279,360],[360,278],[418,262],[262,431],[431,418],[304,408],[408,409],[409,304],[310,415],[415,407],[407,310],[270,409],[409,410],[410,270],[450,348],[348,347],[347,450],[422,430],[430,434],[434,422],[313,314],[314,17],[17,313],[306,307],[307,375],[375,306],[387,388],[388,260],[260,387],[286,414],[414,398],[398,286],[335,406],[406,418],[418,335],[364,367],[367,416],[416,364],[423,358],[358,327],[327,423],[251,284],[284,298],[298,251],[281,5],[5,4],[4,281],[373,374],[374,253],[253,373],[307,320],[320,321],[321,307],[425,427],[427,411],[411,425],[421,313],[313,18],[18,421],[321,405],[405,406],[406,321],[320,404],[404,405],[405,320],[315,16],[16,17],[17,315],[426,425],[425,266],[266,426],[377,400],[400,369],[369,377],[322,391],[391,269],[269,322],[417,465],[465,464],[464,417],[386,257],[257,258],[258,386],[466,260],[260,388],[388,466],[456,399],[399,419],[419,456],[284,332],[332,333],[333,284],[417,285],[285,8],[8,417],[346,340],[340,261],[261,346],[413,441],[441,285],[285,413],[327,460],[460,328],[328,327],[355,371],[371,329],[329,355],[392,439],[439,438],[438,392],[382,341],[341,256],[256,382],[429,420],[420,360],[360,429],[364,394],[394,379],[379,364],[277,343],[343,437],[437,277],[443,444],[444,283],[283,443],[275,440],[440,363],[363,275],[431,262],[262,369],[369,431],[297,338],[338,337],[337,297],[273,375],[375,321],[321,273],[450,451],[451,349],[349,450],[446,342],[342,467],[467,446],[293,334],[334,282],[282,293],[458,461],[461,462],[462,458],[276,353],[353,383],[383,276],[308,324],[324,325],[325,308],[276,300],[300,293],[293,276],[372,345],[345,447],[447,372],[352,345],[345,340],[340,352],[274,1],[1,19],[19,274],[456,248],[248,281],[281,456],[436,427],[427,425],[425,436],[381,256],[256,252],[252,381],[269,391],[391,393],[393,269],[200,199],[199,428],[428,200],[266,330],[330,329],[329,266],[287,273],[273,422],[422,287],[250,462],[462,328],[328,250],[258,286],[286,384],[384,258],[265,353],[353,342],[342,265],[387,259],[259,257],[257,387],[424,431],[431,430],[430,424],[342,353],[353,276],[276,342],[273,335],[335,424],[424,273],[292,325],[325,307],[307,292],[366,447],[447,345],[345,366],[271,303],[303,302],[302,271],[423,266],[266,371],[371,423],[294,455],[455,460],[460,294],[279,278],[278,294],[294,279],[271,272],[272,304],[304,271],[432,434],[434,427],[427,432],[272,407],[407,408],[408,272],[394,430],[430,431],[431,394],[395,369],[369,400],[400,395],[334,333],[333,299],[299,334],[351,417],[417,168],[168,351],[352,280],[280,411],[411,352],[325,319],[319,320],[320,325],[295,296],[296,336],[336,295],[319,403],[403,404],[404,319],[330,348],[348,349],[349,330],[293,298],[298,333],[333,293],[323,454],[454,447],[447,323],[15,16],[16,315],[315,15],[358,429],[429,279],[279,358],[14,15],[15,316],[316,14],[285,336],[336,9],[9,285],[329,349],[349,350],[350,329],[374,380],[380,252],[252,374],[318,402],[402,403],[403,318],[6,197],[197,419],[419,6],[318,319],[319,325],[325,318],[367,364],[364,365],[365,367],[435,367],[367,397],[397,435],[344,438],[438,439],[439,344],[272,271],[271,311],[311,272],[195,5],[5,281],[281,195],[273,287],[287,291],[291,273],[396,428],[428,199],[199,396],[311,271],[271,268],[268,311],[283,444],[444,445],[445,283],[373,254],[254,339],[339,373],[282,334],[334,296],[296,282],[449,347],[347,346],[346,449],[264,447],[447,454],[454,264],[336,296],[296,299],[299,336],[338,10],[10,151],[151,338],[278,439],[439,455],[455,278],[292,407],[407,415],[415,292],[358,371],[371,355],[355,358],[340,345],[345,372],[372,340],[346,347],[347,280],[280,346],[442,443],[443,282],[282,442],[19,94],[94,370],[370,19],[441,442],[442,295],[295,441],[248,419],[419,197],[197,248],[263,255],[255,359],[359,263],[440,275],[275,274],[274,440],[300,383],[383,368],[368,300],[351,412],[412,465],[465,351],[263,467],[467,466],[466,263],[301,368],[368,389],[389,301],[395,378],[378,379],[379,395],[412,351],[351,419],[419,412],[436,426],[426,322],[322,436],[2,164],[164,393],[393,2],[370,462],[462,461],[461,370],[164,0],[0,267],[267,164],[302,11],[11,12],[12,302],[268,12],[12,13],[13,268],[293,300],[300,301],[301,293],[446,261],[261,340],[340,446],[330,266],[266,425],[425,330],[426,423],[423,391],[391,426],[429,355],[355,437],[437,429],[391,327],[327,326],[326,391],[440,457],[457,438],[438,440],[341,382],[382,362],[362,341],[459,457],[457,461],[461,459],[434,430],[430,394],[394,434],[414,463],[463,362],[362,414],[396,369],[369,262],[262,396],[354,461],[461,457],[457,354],[316,403],[403,402],[402,316],[315,404],[404,403],[403,315],[314,405],[405,404],[404,314],[313,406],[406,405],[405,313],[421,418],[418,406],[406,421],[366,401],[401,361],[361,366],[306,408],[408,407],[407,306],[291,409],[409,408],[408,291],[287,410],[410,409],[409,287],[432,436],[436,410],[410,432],[434,416],[416,411],[411,434],[264,368],[368,383],[383,264],[309,438],[438,457],[457,309],[352,376],[376,401],[401,352],[274,275],[275,4],[4,274],[421,428],[428,262],[262,421],[294,327],[327,358],[358,294],[433,416],[416,367],[367,433],[289,455],[455,439],[439,289],[462,370],[370,326],[326,462],[2,326],[326,370],[370,2],[305,460],[460,455],[455,305],[254,449],[449,448],[448,254],[255,261],[261,446],[446,255],[253,450],[450,449],[449,253],[252,451],[451,450],[450,252],[256,452],[452,451],[451,256],[341,453],[453,452],[452,341],[413,464],[464,463],[463,413],[441,413],[413,414],[414,441],[258,442],[442,441],[441,258],[257,443],[443,442],[442,257],[259,444],[444,443],[443,259],[260,445],[445,444],[444,260],[467,342],[342,445],[445,467],[459,458],[458,250],[250,459],[289,392],[392,290],[290,289],[290,328],[328,460],[460,290],[376,433],[433,435],[435,376],[250,290],[290,392],[392,250],[411,416],[416,433],[433,411],[341,463],[463,464],[464,341],[453,464],[464,465],[465,453],[357,465],[465,412],[412,357],[343,412],[412,399],[399,343],[360,363],[363,440],[440,360],[437,399],[399,456],[456,437],[420,456],[456,363],[363,420],[401,435],[435,288],[288,401],[372,383],[383,353],[353,372],[339,255],[255,249],[249,339],[448,261],[261,255],[255,448],[133,243],[243,190],[190,133],[133,155],[155,112],[112,133],[33,246],[246,247],[247,33],[33,130],[130,25],[25,33],[398,384],[384,286],[286,398],[362,398],[398,414],[414,362],[362,463],[463,341],[341,362],[263,359],[359,467],[467,263],[263,249],[249,255],[255,263],[466,467],[467,260],[260,466],[75,60],[60,166],[166,75],[238,239],[239,79],[79,238],[162,127],[127,139],[139,162],[72,11],[11,37],[37,72],[121,232],[232,120],[120,121],[73,72],[72,39],[39,73],[114,128],[128,47],[47,114],[233,232],[232,128],[128,233],[103,104],[104,67],[67,103],[152,175],[175,148],[148,152],[119,118],[118,101],[101,119],[74,73],[73,40],[40,74],[107,9],[9,108],[108,107],[49,48],[48,131],[131,49],[32,194],[194,211],[211,32],[184,74],[74,185],[185,184],[191,80],[80,183],[183,191],[185,40],[40,186],[186,185],[119,230],[230,118],[118,119],[210,202],[202,214],[214,210],[84,83],[83,17],[17,84],[77,76],[76,146],[146,77],[161,160],[160,30],[30,161],[190,56],[56,173],[173,190],[182,106],[106,194],[194,182],[138,135],[135,192],[192,138],[129,203],[203,98],[98,129],[54,21],[21,68],[68,54],[5,51],[51,4],[4,5],[145,144],[144,23],[23,145],[90,77],[77,91],[91,90],[207,205],[205,187],[187,207],[83,201],[201,18],[18,83],[181,91],[91,182],[182,181],[180,90],[90,181],[181,180],[16,85],[85,17],[17,16],[205,206],[206,36],[36,205],[176,148],[148,140],[140,176],[165,92],[92,39],[39,165],[245,193],[193,244],[244,245],[27,159],[159,28],[28,27],[30,247],[247,161],[161,30],[174,236],[236,196],[196,174],[103,54],[54,104],[104,103],[55,193],[193,8],[8,55],[111,117],[117,31],[31,111],[221,189],[189,55],[55,221],[240,98],[98,99],[99,240],[142,126],[126,100],[100,142],[219,166],[166,218],[218,219],[112,155],[155,26],[26,112],[198,209],[209,131],[131,198],[169,135],[135,150],[150,169],[114,47],[47,217],[217,114],[224,223],[223,53],[53,224],[220,45],[45,134],[134,220],[32,211],[211,140],[140,32],[109,67],[67,108],[108,109],[146,43],[43,91],[91,146],[231,230],[230,120],[120,231],[113,226],[226,247],[247,113],[105,63],[63,52],[52,105],[241,238],[238,242],[242,241],[124,46],[46,156],[156,124],[95,78],[78,96],[96,95],[70,46],[46,63],[63,70],[116,143],[143,227],[227,116],[116,123],[123,111],[111,116],[1,44],[44,19],[19,1],[3,236],[236,51],[51,3],[207,216],[216,205],[205,207],[26,154],[154,22],[22,26],[165,39],[39,167],[167,165],[199,200],[200,208],[208,199],[101,36],[36,100],[100,101],[43,57],[57,202],[202,43],[242,20],[20,99],[99,242],[56,28],[28,157],[157,56],[124,35],[35,113],[113,124],[29,160],[160,27],[27,29],[211,204],[204,210],[210,211],[124,113],[113,46],[46,124],[106,43],[43,204],[204,106],[96,62],[62,77],[77,96],[227,137],[137,116],[116,227],[73,41],[41,72],[72,73],[36,203],[203,142],[142,36],[235,64],[64,240],[240,235],[48,49],[49,64],[64,48],[42,41],[41,74],[74,42],[214,212],[212,207],[207,214],[183,42],[42,184],[184,183],[210,169],[169,211],[211,210],[140,170],[170,176],[176,140],[104,105],[105,69],[69,104],[193,122],[122,168],[168,193],[50,123],[123,187],[187,50],[89,96],[96,90],[90,89],[66,65],[65,107],[107,66],[179,89],[89,180],[180,179],[119,101],[101,120],[120,119],[68,63],[63,104],[104,68],[234,93],[93,227],[227,234],[16,15],[15,85],[85,16],[209,129],[129,49],[49,209],[15,14],[14,86],[86,15],[107,55],[55,9],[9,107],[120,100],[100,121],[121,120],[153,145],[145,22],[22,153],[178,88],[88,179],[179,178],[197,6],[6,196],[196,197],[89,88],[88,96],[96,89],[135,138],[138,136],[136,135],[138,215],[215,172],[172,138],[218,115],[115,219],[219,218],[41,42],[42,81],[81,41],[5,195],[195,51],[51,5],[57,43],[43,61],[61,57],[208,171],[171,199],[199,208],[41,81],[81,38],[38,41],[224,53],[53,225],[225,224],[24,144],[144,110],[110,24],[105,52],[52,66],[66,105],[118,229],[229,117],[117,118],[227,34],[34,234],[234,227],[66,107],[107,69],[69,66],[10,109],[109,151],[151,10],[219,48],[48,235],[235,219],[183,62],[62,191],[191,183],[142,129],[129,126],[126,142],[116,111],[111,143],[143,116],[118,117],[117,50],[50,118],[223,222],[222,52],[52,223],[94,19],[19,141],[141,94],[222,221],[221,65],[65,222],[196,3],[3,197],[197,196],[45,220],[220,44],[44,45],[156,70],[70,139],[139,156],[188,122],[122,245],[245,188],[139,71],[71,162],[162,139],[149,170],[170,150],[150,149],[122,188],[188,196],[196,122],[206,216],[216,92],[92,206],[164,2],[2,167],[167,164],[242,141],[141,241],[241,242],[0,164],[164,37],[37,0],[11,72],[72,12],[12,11],[12,38],[38,13],[13,12],[70,63],[63,71],[71,70],[31,226],[226,111],[111,31],[36,101],[101,205],[205,36],[203,206],[206,165],[165,203],[126,209],[209,217],[217,126],[98,165],[165,97],[97,98],[237,220],[220,218],[218,237],[237,239],[239,241],[241,237],[210,214],[214,169],[169,210],[140,171],[171,32],[32,140],[241,125],[125,237],[237,241],[179,86],[86,178],[178,179],[180,85],[85,179],[179,180],[181,84],[84,180],[180,181],[182,83],[83,181],[181,182],[194,201],[201,182],[182,194],[177,137],[137,132],[132,177],[184,76],[76,183],[183,184],[185,61],[61,184],[184,185],[186,57],[57,185],[185,186],[216,212],[212,186],[186,216],[192,214],[214,187],[187,192],[139,34],[34,156],[156,139],[218,79],[79,237],[237,218],[147,123],[123,177],[177,147],[45,44],[44,4],[4,45],[208,201],[201,32],[32,208],[98,64],[64,129],[129,98],[192,213],[213,138],[138,192],[235,59],[59,219],[219,235],[141,242],[242,97],[97,141],[97,2],[2,141],[141,97],[240,75],[75,235],[235,240],[229,24],[24,228],[228,229],[31,25],[25,226],[226,31],[230,23],[23,229],[229,230],[231,22],[22,230],[230,231],[232,26],[26,231],[231,232],[233,112],[112,232],[232,233],[244,189],[189,243],[243,244],[189,221],[221,190],[190,189],[222,28],[28,221],[221,222],[223,27],[27,222],[222,223],[224,29],[29,223],[223,224],[225,30],[30,224],[224,225],[113,247],[247,225],[225,113],[99,60],[60,240],[240,99],[213,147],[147,215],[215,213],[60,20],[20,166],[166,60],[192,187],[187,213],[213,192],[243,112],[112,244],[244,243],[244,233],[233,245],[245,244],[245,128],[128,188],[188,245],[188,114],[114,174],[174,188],[134,131],[131,220],[220,134],[174,217],[217,236],[236,174],[236,198],[198,134],[134,236],[215,177],[177,58],[58,215],[156,143],[143,124],[124,156],[25,110],[110,7],[7,25],[31,228],[228,25],[25,31],[264,356],[356,368],[368,264],[0,11],[11,267],[267,0],[451,452],[452,349],[349,451],[267,302],[302,269],[269,267],[350,357],[357,277],[277,350],[350,452],[452,357],[357,350],[299,333],[333,297],[297,299],[396,175],[175,377],[377,396],[280,347],[347,330],[330,280],[269,303],[303,270],[270,269],[151,9],[9,337],[337,151],[344,278],[278,360],[360,344],[424,418],[418,431],[431,424],[270,304],[304,409],[409,270],[272,310],[310,407],[407,272],[322,270],[270,410],[410,322],[449,450],[450,347],[347,449],[432,422],[422,434],[434,432],[18,313],[313,17],[17,18],[291,306],[306,375],[375,291],[259,387],[387,260],[260,259],[424,335],[335,418],[418,424],[434,364],[364,416],[416,434],[391,423],[423,327],[327,391],[301,251],[251,298],[298,301],[275,281],[281,4],[4,275],[254,373],[373,253],[253,254],[375,307],[307,321],[321,375],[280,425],[425,411],[411,280],[200,421],[421,18],[18,200],[335,321],[321,406],[406,335],[321,320],[320,405],[405,321],[314,315],[315,17],[17,314],[423,426],[426,266],[266,423],[396,377],[377,369],[369,396],[270,322],[322,269],[269,270],[413,417],[417,464],[464,413],[385,386],[386,258],[258,385],[248,456],[456,419],[419,248],[298,284],[284,333],[333,298],[168,417],[417,8],[8,168],[448,346],[346,261],[261,448],[417,413],[413,285],[285,417],[326,327],[327,328],[328,326],[277,355],[355,329],[329,277],[309,392],[392,438],[438,309],[381,382],[382,256],[256,381],[279,429],[429,360],[360,279],[365,364],[364,379],[379,365],[355,277],[277,437],[437,355],[282,443],[443,283],[283,282],[281,275],[275,363],[363,281],[395,431],[431,369],[369,395],[299,297],[297,337],[337,299],[335,273],[273,321],[321,335],[348,450],[450,349],[349,348],[359,446],[446,467],[467,359],[283,293],[293,282],[282,283],[250,458],[458,462],[462,250],[300,276],[276,383],[383,300],[292,308],[308,325],[325,292],[283,276],[276,293],[293,283],[264,372],[372,447],[447,264],[346,352],[352,340],[340,346],[354,274],[274,19],[19,354],[363,456],[456,281],[281,363],[426,436],[436,425],[425,426],[380,381],[381,252],[252,380],[267,269],[269,393],[393,267],[421,200],[200,428],[428,421],[371,266],[266,329],[329,371],[432,287],[287,422],[422,432],[290,250],[250,328],[328,290],[385,258],[258,384],[384,385],[446,265],[265,342],[342,446],[386,387],[387,257],[257,386],[422,424],[424,430],[430,422],[445,342],[342,276],[276,445],[422,273],[273,424],[424,422],[306,292],[292,307],[307,306],[352,366],[366,345],[345,352],[268,271],[271,302],[302,268],[358,423],[423,371],[371,358],[327,294],[294,460],[460,327],[331,279],[279,294],[294,331],[303,271],[271,304],[304,303],[436,432],[432,427],[427,436],[304,272],[272,408],[408,304],[395,394],[394,431],[431,395],[378,395],[395,400],[400,378],[296,334],[334,299],[299,296],[6,351],[351,168],[168,6],[376,352],[352,411],[411,376],[307,325],[325,320],[320,307],[285,295],[295,336],[336,285],[320,319],[319,404],[404,320],[329,330],[330,349],[349,329],[334,293],[293,333],[333,334],[366,323],[323,447],[447,366],[316,15],[15,315],[315,316],[331,358],[358,279],[279,331],[317,14],[14,316],[316,317],[8,285],[285,9],[9,8],[277,329],[329,350],[350,277],[253,374],[374,252],[252,253],[319,318],[318,403],[403,319],[351,6],[6,419],[419,351],[324,318],[318,325],[325,324],[397,367],[367,365],[365,397],[288,435],[435,397],[397,288],[278,344],[344,439],[439,278],[310,272],[272,311],[311,310],[248,195],[195,281],[281,248],[375,273],[273,291],[291,375],[175,396],[396,199],[199,175],[312,311],[311,268],[268,312],[276,283],[283,445],[445,276],[390,373],[373,339],[339,390],[295,282],[282,296],[296,295],[448,449],[449,346],[346,448],[356,264],[264,454],[454,356],[337,336],[336,299],[299,337],[337,338],[338,151],[151,337],[294,278],[278,455],[455,294],[308,292],[292,415],[415,308],[429,358],[358,355],[355,429],[265,340],[340,372],[372,265],[352,346],[346,280],[280,352],[295,442],[442,282],[282,295],[354,19],[19,370],[370,354],[285,441],[441,295],[295,285],[195,248],[248,197],[197,195],[457,440],[440,274],[274,457],[301,300],[300,368],[368,301],[417,351],[351,465],[465,417],[251,301],[301,389],[389,251],[394,395],[395,379],[379,394],[399,412],[412,419],[419,399],[410,436],[436,322],[322,410],[326,2],[2,393],[393,326],[354,370],[370,461],[461,354],[393,164],[164,267],[267,393],[268,302],[302,12],[12,268],[312,268],[268,13],[13,312],[298,293],[293,301],[301,298],[265,446],[446,340],[340,265],[280,330],[330,425],[425,280],[322,426],[426,391],[391,322],[420,429],[429,437],[437,420],[393,391],[391,326],[326,393],[344,440],[440,438],[438,344],[458,459],[459,461],[461,458],[364,434],[434,394],[394,364],[428,396],[396,262],[262,428],[274,354],[354,457],[457,274],[317,316],[316,402],[402,317],[316,315],[315,403],[403,316],[315,314],[314,404],[404,315],[314,313],[313,405],[405,314],[313,421],[421,406],[406,313],[323,366],[366,361],[361,323],[292,306],[306,407],[407,292],[306,291],[291,408],[408,306],[291,287],[287,409],[409,291],[287,432],[432,410],[410,287],[427,434],[434,411],[411,427],[372,264],[264,383],[383,372],[459,309],[309,457],[457,459],[366,352],[352,401],[401,366],[1,274],[274,4],[4,1],[418,421],[421,262],[262,418],[331,294],[294,358],[358,331],[435,433],[433,367],[367,435],[392,289],[289,439],[439,392],[328,462],[462,326],[326,328],[94,2],[2,370],[370,94],[289,305],[305,455],[455,289],[339,254],[254,448],[448,339],[359,255],[255,446],[446,359],[254,253],[253,449],[449,254],[253,252],[252,450],[450,253],[252,256],[256,451],[451,252],[256,341],[341,452],[452,256],[414,413],[413,463],[463,414],[286,441],[441,414],[414,286],[286,258],[258,441],[441,286],[258,257],[257,442],[442,258],[257,259],[259,443],[443,257],[259,260],[260,444],[444,259],[260,467],[467,445],[445,260],[309,459],[459,250],[250,309],[305,289],[289,290],[290,305],[305,290],[290,460],[460,305],[401,376],[376,435],[435,401],[309,250],[250,392],[392,309],[376,411],[411,433],[433,376],[453,341],[341,464],[464,453],[357,453],[453,465],[465,357],[343,357],[357,412],[412,343],[437,343],[343,399],[399,437],[344,360],[360,440],[440,344],[420,437],[437,456],[456,420],[360,420],[420,363],[363,360],[361,401],[401,288],[288,361],[265,372],[372,353],[353,265],[390,339],[339,249],[249,390],[339,448],[448,255],[255,339]);function Oh(e){e.j={faceLandmarks:[],faceBlendshapes:[],facialTransformationMatrixes:[]}}var We=class extends bt{constructor(t,r){super(new Gt(t,r),"image_in","norm_rect",!1),this.j={faceLandmarks:[],faceBlendshapes:[],facialTransformationMatrixes:[]},this.outputFacialTransformationMatrixes=this.outputFaceBlendshapes=!1,ue(t=this.h=new W2,0,1,r=new Ve),this.v=new V2,ue(this.h,0,3,this.v),this.s=new bs,ue(this.h,0,2,this.s),fr(this.s,4,1),re(this.s,2,.5),re(this.v,2,.5),re(this.h,4,.5)}get baseOptions(){return $e(this.h,Ve,1)}set baseOptions(t){ue(this.h,0,1,t)}o(t){return"numFaces"in t&&fr(this.s,4,t.numFaces??1),"minFaceDetectionConfidence"in t&&re(this.s,2,t.minFaceDetectionConfidence??.5),"minTrackingConfidence"in t&&re(this.h,4,t.minTrackingConfidence??.5),"minFacePresenceConfidence"in t&&re(this.v,2,t.minFacePresenceConfidence??.5),"outputFaceBlendshapes"in t&&(this.outputFaceBlendshapes=!!t.outputFaceBlendshapes),"outputFacialTransformationMatrixes"in t&&(this.outputFacialTransformationMatrixes=!!t.outputFacialTransformationMatrixes),this.l(t)}D(t,r){return Oh(this),jt(this,t,r),this.j}F(t,r,i){return Oh(this),gr(this,t,i,r),this.j}m(){var t=new wt;De(t,"image_in"),De(t,"norm_rect"),Te(t,"face_landmarks");const r=new zt;tr(r,Fw,this.h);const i=new pt;Rt(i,"mediapipe.tasks.vision.face_landmarker.FaceLandmarkerGraph"),Be(i,"IMAGE:image_in"),Be(i,"NORM_RECT:norm_rect"),be(i,"NORM_LANDMARKS:face_landmarks"),i.o(r),Mt(t,i),this.g.attachProtoVectorListener("face_landmarks",(a,n)=>{for(const s of a)a=Hn(s),this.j.faceLandmarks.push(ws(a));X(this,n)}),this.g.attachEmptyPacketListener("face_landmarks",a=>{X(this,a)}),this.outputFaceBlendshapes&&(Te(t,"blendshapes"),be(i,"BLENDSHAPES:blendshapes"),this.g.attachProtoVectorListener("blendshapes",(a,n)=>{if(this.outputFaceBlendshapes)for(const s of a)a=_s(s),this.j.faceBlendshapes.push(Dl(a.g()??[]));X(this,n)}),this.g.attachEmptyPacketListener("blendshapes",a=>{X(this,a)})),this.outputFacialTransformationMatrixes&&(Te(t,"face_geometry"),be(i,"FACE_GEOMETRY:face_geometry"),this.g.attachProtoVectorListener("face_geometry",(a,n)=>{if(this.outputFacialTransformationMatrixes)for(const s of a)(a=$e(Uw(s),zw,2))&&this.j.facialTransformationMatrixes.push({rows:Ut(a,1)??0??0,columns:Ut(a,2)??0??0,data:gi(a,3,Zr,mi()).slice()??[]});X(this,n)}),this.g.attachEmptyPacketListener("face_geometry",a=>{X(this,a)})),t=t.g(),this.setGraph(new Uint8Array(t),!0)}};We.prototype.detectForVideo=We.prototype.F,We.prototype.detect=We.prototype.D,We.prototype.setOptions=We.prototype.o,We.createFromModelPath=function(e,t){return _e(We,e,{baseOptions:{modelAssetPath:t}})},We.createFromModelBuffer=function(e,t){return _e(We,e,{baseOptions:{modelAssetBuffer:t}})},We.createFromOptions=function(e,t){return _e(We,e,t)},We.FACE_LANDMARKS_LIPS=Wl,We.FACE_LANDMARKS_LEFT_EYE=Gl,We.FACE_LANDMARKS_LEFT_EYEBROW=jl,We.FACE_LANDMARKS_LEFT_IRIS=gg,We.FACE_LANDMARKS_RIGHT_EYE=ql,We.FACE_LANDMARKS_RIGHT_EYEBROW=Hl,We.FACE_LANDMARKS_RIGHT_IRIS=yg,We.FACE_LANDMARKS_FACE_OVAL=Kl,We.FACE_LANDMARKS_CONTOURS=_g,We.FACE_LANDMARKS_TESSELATION=bg;var lr=class extends bt{constructor(t,r){super(new Gt(t,r),"image_in","norm_rect",!0),ue(t=this.j=new j2,0,1,r=new Ve)}get baseOptions(){return $e(this.j,Ve,1)}set baseOptions(t){ue(this.j,0,1,t)}o(t){return super.l(t)}Oa(t,r,i){const a=typeof r!="function"?r:{};if(this.h=typeof r=="function"?r:i,jt(this,t,a??{}),!this.h)return this.s}m(){var t=new wt;De(t,"image_in"),De(t,"norm_rect"),Te(t,"stylized_image");const r=new zt;tr(r,Vw,this.j);const i=new pt;Rt(i,"mediapipe.tasks.vision.face_stylizer.FaceStylizerGraph"),Be(i,"IMAGE:image_in"),Be(i,"NORM_RECT:norm_rect"),be(i,"STYLIZED_IMAGE:stylized_image"),i.o(r),Mt(t,i),this.g.U("stylized_image",(a,n)=>{var s=!this.h,u=a.data,l=a.width;const d=l*(a=a.height);if(u instanceof Uint8Array)if(u.length===3*d){const h=new Uint8ClampedArray(4*d);for(let f=0;f<d;++f)h[4*f]=u[3*f],h[4*f+1]=u[3*f+1],h[4*f+2]=u[3*f+2],h[4*f+3]=255;u=new ImageData(h,l,a)}else{if(u.length!==4*d)throw Error("Unsupported channel count: "+u.length/d);u=new ImageData(new Uint8ClampedArray(u.buffer,u.byteOffset,u.length),l,a)}else if(!(u instanceof WebGLTexture))throw Error(`Unsupported format: ${u.constructor.name}`);l=new at([u],!1,!1,this.g.i.canvas,this.O,l,a),this.s=s=s?l.clone():l,this.h&&this.h(s),X(this,n)}),this.g.attachEmptyPacketListener("stylized_image",a=>{this.s=null,this.h&&this.h(null),X(this,a)}),t=t.g(),this.setGraph(new Uint8Array(t),!0)}};lr.prototype.stylize=lr.prototype.Oa,lr.prototype.setOptions=lr.prototype.o,lr.createFromModelPath=function(e,t){return _e(lr,e,{baseOptions:{modelAssetPath:t}})},lr.createFromModelBuffer=function(e,t){return _e(lr,e,{baseOptions:{modelAssetBuffer:t}})},lr.createFromOptions=function(e,t){return _e(lr,e,t)};var Xl=nr([0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],[13,17],[0,17],[17,18],[18,19],[19,20]);function Rh(e){e.gestures=[],e.landmarks=[],e.worldLandmarks=[],e.handedness=[]}function Mh(e){return e.gestures.length===0?{gestures:[],landmarks:[],worldLandmarks:[],handedness:[],handednesses:[]}:{gestures:e.gestures,landmarks:e.landmarks,worldLandmarks:e.worldLandmarks,handedness:e.handedness,handednesses:e.handedness}}function Bh(e,t=!0){const r=[];for(const a of e){var i=_s(a);e=[];for(const n of i.g())i=t&&Ut(n,1)!=null?Ut(n,1)??0:-1,e.push({score:Xe(n,2)??0,index:i,categoryName:Vt(n,3)??""??"",displayName:Vt(n,4)??""??""});r.push(e)}return r}var Tt=class extends bt{constructor(t,r){super(new Gt(t,r),"image_in","norm_rect",!1),this.gestures=[],this.landmarks=[],this.worldLandmarks=[],this.handedness=[],ue(t=this.j=new K2,0,1,r=new Ve),this.s=new Rl,ue(this.j,0,2,this.s),this.C=new Ol,ue(this.s,0,3,this.C),this.v=new H2,ue(this.s,0,2,this.v),this.h=new Ww,ue(this.j,0,3,this.h),re(this.v,2,.5),re(this.s,4,.5),re(this.C,2,.5)}get baseOptions(){return $e(this.j,Ve,1)}set baseOptions(t){ue(this.j,0,1,t)}o(t){var n,s,u,l;if(fr(this.v,3,t.numHands??1),"minHandDetectionConfidence"in t&&re(this.v,2,t.minHandDetectionConfidence??.5),"minTrackingConfidence"in t&&re(this.s,4,t.minTrackingConfidence??.5),"minHandPresenceConfidence"in t&&re(this.C,2,t.minHandPresenceConfidence??.5),t.cannedGesturesClassifierOptions){var r=new Ai,i=r,a=vu(t.cannedGesturesClassifierOptions,(n=$e(this.h,Ai,3))==null?void 0:n.h());ue(i,0,2,a),ue(this.h,0,3,r)}else t.cannedGesturesClassifierOptions===void 0&&((s=$e(this.h,Ai,3))==null||s.g());return t.customGesturesClassifierOptions?(ue(i=r=new Ai,0,2,a=vu(t.customGesturesClassifierOptions,(u=$e(this.h,Ai,4))==null?void 0:u.h())),ue(this.h,0,4,r)):t.customGesturesClassifierOptions===void 0&&((l=$e(this.h,Ai,4))==null||l.g()),this.l(t)}Ja(t,r){return Rh(this),jt(this,t,r),Mh(this)}Ka(t,r,i){return Rh(this),gr(this,t,i,r),Mh(this)}m(){var t=new wt;De(t,"image_in"),De(t,"norm_rect"),Te(t,"hand_gestures"),Te(t,"hand_landmarks"),Te(t,"world_hand_landmarks"),Te(t,"handedness");const r=new zt;tr(r,Gw,this.j);const i=new pt;Rt(i,"mediapipe.tasks.vision.gesture_recognizer.GestureRecognizerGraph"),Be(i,"IMAGE:image_in"),Be(i,"NORM_RECT:norm_rect"),be(i,"HAND_GESTURES:hand_gestures"),be(i,"LANDMARKS:hand_landmarks"),be(i,"WORLD_LANDMARKS:world_hand_landmarks"),be(i,"HANDEDNESS:handedness"),i.o(r),Mt(t,i),this.g.attachProtoVectorListener("hand_landmarks",(a,n)=>{for(const s of a){a=Hn(s);const u=[];for(const l of Ir(a,D2,1))u.push({x:Xe(l,1)??0,y:Xe(l,2)??0,z:Xe(l,3)??0,visibility:Xe(l,4)??0});this.landmarks.push(u)}X(this,n)}),this.g.attachEmptyPacketListener("hand_landmarks",a=>{X(this,a)}),this.g.attachProtoVectorListener("world_hand_landmarks",(a,n)=>{for(const s of a){a=Ui(s);const u=[];for(const l of Ir(a,N2,1))u.push({x:Xe(l,1)??0,y:Xe(l,2)??0,z:Xe(l,3)??0,visibility:Xe(l,4)??0});this.worldLandmarks.push(u)}X(this,n)}),this.g.attachEmptyPacketListener("world_hand_landmarks",a=>{X(this,a)}),this.g.attachProtoVectorListener("hand_gestures",(a,n)=>{this.gestures.push(...Bh(a,!1)),X(this,n)}),this.g.attachEmptyPacketListener("hand_gestures",a=>{X(this,a)}),this.g.attachProtoVectorListener("handedness",(a,n)=>{this.handedness.push(...Bh(a)),X(this,n)}),this.g.attachEmptyPacketListener("handedness",a=>{X(this,a)}),t=t.g(),this.setGraph(new Uint8Array(t),!0)}};function Nh(e){return{landmarks:e.landmarks,worldLandmarks:e.worldLandmarks,handednesses:e.handedness,handedness:e.handedness}}Tt.prototype.recognizeForVideo=Tt.prototype.Ka,Tt.prototype.recognize=Tt.prototype.Ja,Tt.prototype.setOptions=Tt.prototype.o,Tt.createFromModelPath=function(e,t){return _e(Tt,e,{baseOptions:{modelAssetPath:t}})},Tt.createFromModelBuffer=function(e,t){return _e(Tt,e,{baseOptions:{modelAssetBuffer:t}})},Tt.createFromOptions=function(e,t){return _e(Tt,e,t)},Tt.HAND_CONNECTIONS=Xl;var kt=class extends bt{constructor(t,r){super(new Gt(t,r),"image_in","norm_rect",!1),this.landmarks=[],this.worldLandmarks=[],this.handedness=[],ue(t=this.h=new Rl,0,1,r=new Ve),this.s=new Ol,ue(this.h,0,3,this.s),this.j=new H2,ue(this.h,0,2,this.j),fr(this.j,3,1),re(this.j,2,.5),re(this.s,2,.5),re(this.h,4,.5)}get baseOptions(){return $e(this.h,Ve,1)}set baseOptions(t){ue(this.h,0,1,t)}o(t){return"numHands"in t&&fr(this.j,3,t.numHands??1),"minHandDetectionConfidence"in t&&re(this.j,2,t.minHandDetectionConfidence??.5),"minTrackingConfidence"in t&&re(this.h,4,t.minTrackingConfidence??.5),"minHandPresenceConfidence"in t&&re(this.s,2,t.minHandPresenceConfidence??.5),this.l(t)}D(t,r){return this.landmarks=[],this.worldLandmarks=[],this.handedness=[],jt(this,t,r),Nh(this)}F(t,r,i){return this.landmarks=[],this.worldLandmarks=[],this.handedness=[],gr(this,t,i,r),Nh(this)}m(){var t=new wt;De(t,"image_in"),De(t,"norm_rect"),Te(t,"hand_landmarks"),Te(t,"world_hand_landmarks"),Te(t,"handedness");const r=new zt;tr(r,jw,this.h);const i=new pt;Rt(i,"mediapipe.tasks.vision.hand_landmarker.HandLandmarkerGraph"),Be(i,"IMAGE:image_in"),Be(i,"NORM_RECT:norm_rect"),be(i,"LANDMARKS:hand_landmarks"),be(i,"WORLD_LANDMARKS:world_hand_landmarks"),be(i,"HANDEDNESS:handedness"),i.o(r),Mt(t,i),this.g.attachProtoVectorListener("hand_landmarks",(a,n)=>{for(const s of a)a=Hn(s),this.landmarks.push(ws(a));X(this,n)}),this.g.attachEmptyPacketListener("hand_landmarks",a=>{X(this,a)}),this.g.attachProtoVectorListener("world_hand_landmarks",(a,n)=>{for(const s of a)a=Ui(s),this.worldLandmarks.push(Bn(a));X(this,n)}),this.g.attachEmptyPacketListener("world_hand_landmarks",a=>{X(this,a)}),this.g.attachProtoVectorListener("handedness",(a,n)=>{var s=this.handedness,u=s.push;const l=[];for(const d of a){a=_s(d);const h=[];for(const f of a.g())h.push({score:Xe(f,2)??0,index:Ut(f,1)??0??-1,categoryName:Vt(f,3)??""??"",displayName:Vt(f,4)??""??""});l.push(h)}u.call(s,...l),X(this,n)}),this.g.attachEmptyPacketListener("handedness",a=>{X(this,a)}),t=t.g(),this.setGraph(new Uint8Array(t),!0)}};kt.prototype.detectForVideo=kt.prototype.F,kt.prototype.detect=kt.prototype.D,kt.prototype.setOptions=kt.prototype.o,kt.createFromModelPath=function(e,t){return _e(kt,e,{baseOptions:{modelAssetPath:t}})},kt.createFromModelBuffer=function(e,t){return _e(kt,e,{baseOptions:{modelAssetBuffer:t}})},kt.createFromOptions=function(e,t){return _e(kt,e,t)},kt.HAND_CONNECTIONS=Xl;var wg=nr([0,1],[1,2],[2,3],[3,7],[0,4],[4,5],[5,6],[6,8],[9,10],[11,12],[11,13],[13,15],[15,17],[15,19],[15,21],[17,19],[12,14],[14,16],[16,18],[16,20],[16,22],[18,20],[11,23],[12,24],[23,24],[23,25],[24,26],[25,27],[26,28],[27,29],[28,30],[29,31],[30,32],[27,31],[28,32]);function Dh(e){e.h={faceLandmarks:[],faceBlendshapes:[],poseLandmarks:[],poseWorldLandmarks:[],poseSegmentationMasks:[],leftHandLandmarks:[],leftHandWorldLandmarks:[],rightHandLandmarks:[],rightHandWorldLandmarks:[]}}function Ph(e){try{if(!e.C)return e.h;e.C(e.h)}finally{$s(e)}}function ua(e,t){e=Hn(e),t.push(ws(e))}var Le=class extends bt{constructor(e,t){super(new Gt(e,t),"input_frames_image",null,!1),this.h={faceLandmarks:[],faceBlendshapes:[],poseLandmarks:[],poseWorldLandmarks:[],poseSegmentationMasks:[],leftHandLandmarks:[],leftHandWorldLandmarks:[],rightHandLandmarks:[],rightHandWorldLandmarks:[]},this.outputPoseSegmentationMasks=this.outputFaceBlendshapes=!1,ue(e=this.j=new J2,0,1,t=new Ve),this.J=new Ol,ue(this.j,0,2,this.J),this.Z=new qw,ue(this.j,0,3,this.Z),this.s=new bs,ue(this.j,0,4,this.s),this.H=new V2,ue(this.j,0,5,this.H),this.v=new Z2,ue(this.j,0,6,this.v),this.K=new Q2,ue(this.j,0,7,this.K),re(this.s,2,.5),re(this.s,3,.3),re(this.H,2,.5),re(this.v,2,.5),re(this.v,3,.3),re(this.K,2,.5),re(this.J,2,.5)}get baseOptions(){return $e(this.j,Ve,1)}set baseOptions(e){ue(this.j,0,1,e)}o(e){return"minFaceDetectionConfidence"in e&&re(this.s,2,e.minFaceDetectionConfidence??.5),"minFaceSuppressionThreshold"in e&&re(this.s,3,e.minFaceSuppressionThreshold??.3),"minFacePresenceConfidence"in e&&re(this.H,2,e.minFacePresenceConfidence??.5),"outputFaceBlendshapes"in e&&(this.outputFaceBlendshapes=!!e.outputFaceBlendshapes),"minPoseDetectionConfidence"in e&&re(this.v,2,e.minPoseDetectionConfidence??.5),"minPoseSuppressionThreshold"in e&&re(this.v,3,e.minPoseSuppressionThreshold??.3),"minPosePresenceConfidence"in e&&re(this.K,2,e.minPosePresenceConfidence??.5),"outputPoseSegmentationMasks"in e&&(this.outputPoseSegmentationMasks=!!e.outputPoseSegmentationMasks),"minHandLandmarksConfidence"in e&&re(this.J,2,e.minHandLandmarksConfidence??.5),this.l(e)}D(e,t,r){const i=typeof t!="function"?t:{};return this.C=typeof t=="function"?t:r,Dh(this),jt(this,e,i),Ph(this)}F(e,t,r,i){const a=typeof r!="function"?r:{};return this.C=typeof r=="function"?r:i,Dh(this),gr(this,e,a,t),Ph(this)}m(){var e=new wt;De(e,"input_frames_image"),Te(e,"pose_landmarks"),Te(e,"pose_world_landmarks"),Te(e,"face_landmarks"),Te(e,"left_hand_landmarks"),Te(e,"left_hand_world_landmarks"),Te(e,"right_hand_landmarks"),Te(e,"right_hand_world_landmarks");const t=new zt,r=new oh;mu(r,1,tn("type.googleapis.com/mediapipe.tasks.vision.holistic_landmarker.proto.HolisticLandmarkerGraphOptions"),""),function(a,n){if(n!=null)if(Array.isArray(n))Me(a,2,H1(n));else{if(!(typeof n=="string"||n instanceof Sr||Wn(n)))throw Error("invalid value in Any.value field: "+n+" expected a ByteString, a base64 encoded string, a Uint8Array or a jspb array");mu(a,2,Yu(n,!1),vi())}}(r,this.j.g());const i=new pt;Rt(i,"mediapipe.tasks.vision.holistic_landmarker.HolisticLandmarkerGraph"),La(i,8,oh,r),Be(i,"IMAGE:input_frames_image"),be(i,"POSE_LANDMARKS:pose_landmarks"),be(i,"POSE_WORLD_LANDMARKS:pose_world_landmarks"),be(i,"FACE_LANDMARKS:face_landmarks"),be(i,"LEFT_HAND_LANDMARKS:left_hand_landmarks"),be(i,"LEFT_HAND_WORLD_LANDMARKS:left_hand_world_landmarks"),be(i,"RIGHT_HAND_LANDMARKS:right_hand_landmarks"),be(i,"RIGHT_HAND_WORLD_LANDMARKS:right_hand_world_landmarks"),i.o(t),Mt(e,i),vs(this,e),this.g.attachProtoListener("pose_landmarks",(a,n)=>{ua(a,this.h.poseLandmarks),X(this,n)}),this.g.attachEmptyPacketListener("pose_landmarks",a=>{X(this,a)}),this.g.attachProtoListener("pose_world_landmarks",(a,n)=>{var s=this.h.poseWorldLandmarks;a=Ui(a),s.push(Bn(a)),X(this,n)}),this.g.attachEmptyPacketListener("pose_world_landmarks",a=>{X(this,a)}),this.outputPoseSegmentationMasks&&(be(i,"POSE_SEGMENTATION_MASK:pose_segmentation_mask"),Hi(this,"pose_segmentation_mask"),this.g.U("pose_segmentation_mask",(a,n)=>{this.h.poseSegmentationMasks=[Yi(this,a,!0,!this.C)],X(this,n)}),this.g.attachEmptyPacketListener("pose_segmentation_mask",a=>{this.h.poseSegmentationMasks=[],X(this,a)})),this.g.attachProtoListener("face_landmarks",(a,n)=>{ua(a,this.h.faceLandmarks),X(this,n)}),this.g.attachEmptyPacketListener("face_landmarks",a=>{X(this,a)}),this.outputFaceBlendshapes&&(Te(e,"extra_blendshapes"),be(i,"FACE_BLENDSHAPES:extra_blendshapes"),this.g.attachProtoListener("extra_blendshapes",(a,n)=>{var s=this.h.faceBlendshapes;this.outputFaceBlendshapes&&(a=_s(a),s.push(Dl(a.g()??[]))),X(this,n)}),this.g.attachEmptyPacketListener("extra_blendshapes",a=>{X(this,a)})),this.g.attachProtoListener("left_hand_landmarks",(a,n)=>{ua(a,this.h.leftHandLandmarks),X(this,n)}),this.g.attachEmptyPacketListener("left_hand_landmarks",a=>{X(this,a)}),this.g.attachProtoListener("left_hand_world_landmarks",(a,n)=>{var s=this.h.leftHandWorldLandmarks;a=Ui(a),s.push(Bn(a)),X(this,n)}),this.g.attachEmptyPacketListener("left_hand_world_landmarks",a=>{X(this,a)}),this.g.attachProtoListener("right_hand_landmarks",(a,n)=>{ua(a,this.h.rightHandLandmarks),X(this,n)}),this.g.attachEmptyPacketListener("right_hand_landmarks",a=>{X(this,a)}),this.g.attachProtoListener("right_hand_world_landmarks",(a,n)=>{var s=this.h.rightHandWorldLandmarks;a=Ui(a),s.push(Bn(a)),X(this,n)}),this.g.attachEmptyPacketListener("right_hand_world_landmarks",a=>{X(this,a)}),e=e.g(),this.setGraph(new Uint8Array(e),!0)}};Le.prototype.detectForVideo=Le.prototype.F,Le.prototype.detect=Le.prototype.D,Le.prototype.setOptions=Le.prototype.o,Le.createFromModelPath=function(e,t){return _e(Le,e,{baseOptions:{modelAssetPath:t}})},Le.createFromModelBuffer=function(e,t){return _e(Le,e,{baseOptions:{modelAssetBuffer:t}})},Le.createFromOptions=function(e,t){return _e(Le,e,t)},Le.HAND_CONNECTIONS=Xl,Le.POSE_CONNECTIONS=wg,Le.FACE_LANDMARKS_LIPS=Wl,Le.FACE_LANDMARKS_LEFT_EYE=Gl,Le.FACE_LANDMARKS_LEFT_EYEBROW=jl,Le.FACE_LANDMARKS_LEFT_IRIS=gg,Le.FACE_LANDMARKS_RIGHT_EYE=ql,Le.FACE_LANDMARKS_RIGHT_EYEBROW=Hl,Le.FACE_LANDMARKS_RIGHT_IRIS=yg,Le.FACE_LANDMARKS_FACE_OVAL=Kl,Le.FACE_LANDMARKS_CONTOURS=_g,Le.FACE_LANDMARKS_TESSELATION=bg;var Dt=class extends bt{constructor(t,r){super(new Gt(t,r),"input_image","norm_rect",!0),this.j={classifications:[]},ue(t=this.h=new eg,0,1,r=new Ve)}get baseOptions(){return $e(this.h,Ve,1)}set baseOptions(t){ue(this.h,0,1,t)}o(t){return ue(this.h,0,2,vu(t,$e(this.h,Al,2))),this.l(t)}sa(t,r){return this.j={classifications:[]},jt(this,t,r),this.j}ta(t,r,i){return this.j={classifications:[]},gr(this,t,i,r),this.j}m(){var t=new wt;De(t,"input_image"),De(t,"norm_rect"),Te(t,"classifications");const r=new zt;tr(r,Hw,this.h);const i=new pt;Rt(i,"mediapipe.tasks.vision.image_classifier.ImageClassifierGraph"),Be(i,"IMAGE:input_image"),Be(i,"NORM_RECT:norm_rect"),be(i,"CLASSIFICATIONS:classifications"),i.o(r),Mt(t,i),this.g.attachProtoListener("classifications",(a,n)=>{this.j=function(s){const u={classifications:Ir(s,Rw,1).map(l=>{var d;return Dl(((d=$e(l,R2,4))==null?void 0:d.g())??[],Ut(l,2)??0,Vt(l,3)??"")})};return Pa(ji(s,2))!=null&&(u.timestampMs=Pa(ji(s,2))??0),u}(Mw(a)),X(this,n)}),this.g.attachEmptyPacketListener("classifications",a=>{X(this,a)}),t=t.g(),this.setGraph(new Uint8Array(t),!0)}};Dt.prototype.classifyForVideo=Dt.prototype.ta,Dt.prototype.classify=Dt.prototype.sa,Dt.prototype.setOptions=Dt.prototype.o,Dt.createFromModelPath=function(e,t){return _e(Dt,e,{baseOptions:{modelAssetPath:t}})},Dt.createFromModelBuffer=function(e,t){return _e(Dt,e,{baseOptions:{modelAssetBuffer:t}})},Dt.createFromOptions=function(e,t){return _e(Dt,e,t)};var Et=class extends bt{constructor(e,t){super(new Gt(e,t),"image_in","norm_rect",!0),this.h=new tg,this.embeddings={embeddings:[]},ue(e=this.h,0,1,t=new Ve)}get baseOptions(){return $e(this.h,Ve,1)}set baseOptions(e){ue(this.h,0,1,e)}o(e){var t=this.h,r=$e(this.h,gh,2);return r=r?r.clone():new gh,e.l2Normalize!==void 0?Ln(r,1,e.l2Normalize):"l2Normalize"in e&&Me(r,1),e.quantize!==void 0?Ln(r,2,e.quantize):"quantize"in e&&Me(r,2),ue(t,0,2,r),this.l(e)}za(e,t){return jt(this,e,t),this.embeddings}Aa(e,t,r){return gr(this,e,r,t),this.embeddings}m(){var e=new wt;De(e,"image_in"),De(e,"norm_rect"),Te(e,"embeddings_out");const t=new zt;tr(t,Kw,this.h);const r=new pt;Rt(r,"mediapipe.tasks.vision.image_embedder.ImageEmbedderGraph"),Be(r,"IMAGE:image_in"),Be(r,"NORM_RECT:norm_rect"),be(r,"EMBEDDINGS:embeddings_out"),r.o(t),Mt(e,r),this.g.attachProtoListener("embeddings_out",(i,a)=>{i=Dw(i),this.embeddings=function(n){return{embeddings:Ir(n,Nw,1).map(s=>{var l,d;const u={headIndex:Ut(s,3)??0??-1,headName:Vt(s,4)??""??""};if(Q1(s,mh,ao(s,1))!==void 0)s=gi(s=$e(s,mh,ao(s,1)),1,Zr,mi()),u.floatEmbedding=s.slice();else{const h=new Uint8Array(0);u.quantizedEmbedding=((d=(l=$e(s,Bw,ao(s,2)))==null?void 0:l.oa())==null?void 0:d.h())??h}return u}),timestampMs:Pa(ji(n,2))??0}}(i),X(this,a)}),this.g.attachEmptyPacketListener("embeddings_out",i=>{X(this,i)}),e=e.g(),this.setGraph(new Uint8Array(e),!0)}};Et.cosineSimilarity=function(e,t){if(e.floatEmbedding&&t.floatEmbedding)e=vh(e.floatEmbedding,t.floatEmbedding);else{if(!e.quantizedEmbedding||!t.quantizedEmbedding)throw Error("Cannot compute cosine similarity between quantized and float embeddings.");e=vh(wh(e.quantizedEmbedding),wh(t.quantizedEmbedding))}return e},Et.prototype.embedForVideo=Et.prototype.Aa,Et.prototype.embed=Et.prototype.za,Et.prototype.setOptions=Et.prototype.o,Et.createFromModelPath=function(e,t){return _e(Et,e,{baseOptions:{modelAssetPath:t}})},Et.createFromModelBuffer=function(e,t){return _e(Et,e,{baseOptions:{modelAssetBuffer:t}})},Et.createFromOptions=function(e,t){return _e(Et,e,t)};var Tu=class{constructor(e,t,r){this.confidenceMasks=e,this.categoryMask=t,this.qualityScores=r}close(){var e,t;(e=this.confidenceMasks)==null||e.forEach(r=>{r.close()}),(t=this.categoryMask)==null||t.close()}};function Lh(e){e.categoryMask=void 0,e.confidenceMasks=void 0,e.qualityScores=void 0}function Uh(e){try{const t=new Tu(e.confidenceMasks,e.categoryMask,e.qualityScores);if(!e.j)return t;e.j(t)}finally{$s(e)}}Tu.prototype.close=Tu.prototype.close;var gt=class extends bt{constructor(e,t){super(new Gt(e,t),"image_in","norm_rect",!1),this.s=[],this.outputCategoryMask=!1,this.outputConfidenceMasks=!0,this.h=new Nl,this.v=new rg,ue(this.h,0,3,this.v),ue(e=this.h,0,1,t=new Ve)}get baseOptions(){return $e(this.h,Ve,1)}set baseOptions(e){ue(this.h,0,1,e)}o(e){return e.displayNamesLocale!==void 0?Me(this.h,2,tn(e.displayNamesLocale)):"displayNamesLocale"in e&&Me(this.h,2),"outputCategoryMask"in e&&(this.outputCategoryMask=e.outputCategoryMask??!1),"outputConfidenceMasks"in e&&(this.outputConfidenceMasks=e.outputConfidenceMasks??!0),super.l(e)}I(){(function(e){var r,i;const t=Ir(e.da(),pt,1).filter(a=>(Vt(a,1)??"").includes("mediapipe.tasks.TensorsToSegmentationCalculator"));if(e.s=[],t.length>1)throw Error("The graph has more than one mediapipe.tasks.TensorsToSegmentationCalculator.");t.length===1&&(((i=(r=$e(t[0],zt,7))==null?void 0:r.l())==null?void 0:i.g())??new Map).forEach((a,n)=>{e.s[Number(n)]=Vt(a,1)??""})})(this)}segment(e,t,r){const i=typeof t!="function"?t:{};return this.j=typeof t=="function"?t:r,Lh(this),jt(this,e,i),Uh(this)}Ma(e,t,r,i){const a=typeof r!="function"?r:{};return this.j=typeof r=="function"?r:i,Lh(this),gr(this,e,a,t),Uh(this)}Da(){return this.s}m(){var e=new wt;De(e,"image_in"),De(e,"norm_rect");const t=new zt;tr(t,ng,this.h);const r=new pt;Rt(r,"mediapipe.tasks.vision.image_segmenter.ImageSegmenterGraph"),Be(r,"IMAGE:image_in"),Be(r,"NORM_RECT:norm_rect"),r.o(t),Mt(e,r),vs(this,e),this.outputConfidenceMasks&&(Te(e,"confidence_masks"),be(r,"CONFIDENCE_MASKS:confidence_masks"),Hi(this,"confidence_masks"),this.g.ca("confidence_masks",(i,a)=>{this.confidenceMasks=i.map(n=>Yi(this,n,!0,!this.j)),X(this,a)}),this.g.attachEmptyPacketListener("confidence_masks",i=>{this.confidenceMasks=[],X(this,i)})),this.outputCategoryMask&&(Te(e,"category_mask"),be(r,"CATEGORY_MASK:category_mask"),Hi(this,"category_mask"),this.g.U("category_mask",(i,a)=>{this.categoryMask=Yi(this,i,!1,!this.j),X(this,a)}),this.g.attachEmptyPacketListener("category_mask",i=>{this.categoryMask=void 0,X(this,i)})),Te(e,"quality_scores"),be(r,"QUALITY_SCORES:quality_scores"),this.g.attachFloatVectorListener("quality_scores",(i,a)=>{this.qualityScores=i,X(this,a)}),this.g.attachEmptyPacketListener("quality_scores",i=>{this.categoryMask=void 0,X(this,i)}),e=e.g(),this.setGraph(new Uint8Array(e),!0)}};gt.prototype.getLabels=gt.prototype.Da,gt.prototype.segmentForVideo=gt.prototype.Ma,gt.prototype.segment=gt.prototype.segment,gt.prototype.setOptions=gt.prototype.o,gt.createFromModelPath=function(e,t){return _e(gt,e,{baseOptions:{modelAssetPath:t}})},gt.createFromModelBuffer=function(e,t){return _e(gt,e,{baseOptions:{modelAssetBuffer:t}})},gt.createFromOptions=function(e,t){return _e(gt,e,t)};var ku=class{constructor(e,t,r){this.confidenceMasks=e,this.categoryMask=t,this.qualityScores=r}close(){var e,t;(e=this.confidenceMasks)==null||e.forEach(r=>{r.close()}),(t=this.categoryMask)==null||t.close()}};ku.prototype.close=ku.prototype.close;var r4=class extends te{constructor(e){super(e)}},Ii=[0,He,-2],Wa=[0,xr,-3,Ue,xr,-1],Fh=[0,Wa],Vh=[0,Wa,He,-1],ho=class extends te{constructor(e){super(e)}},Wh=[0,xr,-1,Ue],i4=class extends te{constructor(e){super(e)}},Gh=class extends te{constructor(e){super(e)}},Eu=[1,2,3,4,5,6,7,8,9,10,14,15],vg=class extends te{constructor(e){super(e)}};vg.prototype.g=ys([0,rt,[0,Eu,ze,Wa,ze,[0,Wa,Ii],ze,Fh,ze,[0,Fh,Ii],ze,Wh,ze,[0,xr,-3,Ue,Wt],ze,[0,xr,-3,Ue],ze,[0,Ie,xr,-2,Ue,He,Ue,-1,2,xr,Ii],ze,Vh,ze,[0,Vh,Ii],xr,Ii,Ie,ze,[0,xr,-3,Ue,Ii,-1],ze,[0,rt,Wh]],Ie,[0,Ie,He,-1,Ue]]);var dr=class extends bt{constructor(e,t){super(new Gt(e,t),"image_in","norm_rect_in",!1),this.outputCategoryMask=!1,this.outputConfidenceMasks=!0,this.h=new Nl,this.s=new rg,ue(this.h,0,3,this.s),ue(e=this.h,0,1,t=new Ve)}get baseOptions(){return $e(this.h,Ve,1)}set baseOptions(e){ue(this.h,0,1,e)}o(e){return"outputCategoryMask"in e&&(this.outputCategoryMask=e.outputCategoryMask??!1),"outputConfidenceMasks"in e&&(this.outputConfidenceMasks=e.outputConfidenceMasks??!0),super.l(e)}segment(e,t,r,i){const a=typeof r!="function"?r:{};this.j=typeof r=="function"?r:i,this.qualityScores=this.categoryMask=this.confidenceMasks=void 0,r=this.B+1,i=new vg;const n=new Gh;var s=new r4;if(fr(s,1,255),ue(n,0,12,s),t.keypoint&&t.scribble)throw Error("Cannot provide both keypoint and scribble.");if(t.keypoint){var u=new ho;Ln(u,3,!0),re(u,1,t.keypoint.x),re(u,2,t.keypoint.y),Rn(n,5,Eu,u)}else{if(!t.scribble)throw Error("Must provide either a keypoint or a scribble.");for(u of(s=new i4,t.scribble))Ln(t=new ho,3,!0),re(t,1,u.x),re(t,2,u.y),La(s,1,ho,t);Rn(n,15,Eu,s)}La(i,1,Gh,n),this.g.addProtoToStream(i.g(),"drishti.RenderData","roi_in",r),jt(this,e,a);e:{try{const d=new ku(this.confidenceMasks,this.categoryMask,this.qualityScores);if(!this.j){var l=d;break e}this.j(d)}finally{$s(this)}l=void 0}return l}m(){var e=new wt;De(e,"image_in"),De(e,"roi_in"),De(e,"norm_rect_in");const t=new zt;tr(t,ng,this.h);const r=new pt;Rt(r,"mediapipe.tasks.vision.interactive_segmenter.InteractiveSegmenterGraph"),Be(r,"IMAGE:image_in"),Be(r,"ROI:roi_in"),Be(r,"NORM_RECT:norm_rect_in"),r.o(t),Mt(e,r),vs(this,e),this.outputConfidenceMasks&&(Te(e,"confidence_masks"),be(r,"CONFIDENCE_MASKS:confidence_masks"),Hi(this,"confidence_masks"),this.g.ca("confidence_masks",(i,a)=>{this.confidenceMasks=i.map(n=>Yi(this,n,!0,!this.j)),X(this,a)}),this.g.attachEmptyPacketListener("confidence_masks",i=>{this.confidenceMasks=[],X(this,i)})),this.outputCategoryMask&&(Te(e,"category_mask"),be(r,"CATEGORY_MASK:category_mask"),Hi(this,"category_mask"),this.g.U("category_mask",(i,a)=>{this.categoryMask=Yi(this,i,!1,!this.j),X(this,a)}),this.g.attachEmptyPacketListener("category_mask",i=>{this.categoryMask=void 0,X(this,i)})),Te(e,"quality_scores"),be(r,"QUALITY_SCORES:quality_scores"),this.g.attachFloatVectorListener("quality_scores",(i,a)=>{this.qualityScores=i,X(this,a)}),this.g.attachEmptyPacketListener("quality_scores",i=>{this.categoryMask=void 0,X(this,i)}),e=e.g(),this.setGraph(new Uint8Array(e),!0)}};dr.prototype.segment=dr.prototype.segment,dr.prototype.setOptions=dr.prototype.o,dr.createFromModelPath=function(e,t){return _e(dr,e,{baseOptions:{modelAssetPath:t}})},dr.createFromModelBuffer=function(e,t){return _e(dr,e,{baseOptions:{modelAssetBuffer:t}})},dr.createFromOptions=function(e,t){return _e(dr,e,t)};var Pt=class extends bt{constructor(e,t){super(new Gt(e,t),"input_frame_gpu","norm_rect",!1),this.j={detections:[]},ue(e=this.h=new ag,0,1,t=new Ve)}get baseOptions(){return $e(this.h,Ve,1)}set baseOptions(e){ue(this.h,0,1,e)}o(e){return e.displayNamesLocale!==void 0?Me(this.h,2,tn(e.displayNamesLocale)):"displayNamesLocale"in e&&Me(this.h,2),e.maxResults!==void 0?fr(this.h,3,e.maxResults):"maxResults"in e&&Me(this.h,3),e.scoreThreshold!==void 0?re(this.h,4,e.scoreThreshold):"scoreThreshold"in e&&Me(this.h,4),e.categoryAllowlist!==void 0?Ua(this.h,5,e.categoryAllowlist):"categoryAllowlist"in e&&Me(this.h,5),e.categoryDenylist!==void 0?Ua(this.h,6,e.categoryDenylist):"categoryDenylist"in e&&Me(this.h,6),this.l(e)}D(e,t){return this.j={detections:[]},jt(this,e,t),this.j}F(e,t,r){return this.j={detections:[]},gr(this,e,r,t),this.j}m(){var e=new wt;De(e,"input_frame_gpu"),De(e,"norm_rect"),Te(e,"detections");const t=new zt;tr(t,Yw,this.h);const r=new pt;Rt(r,"mediapipe.tasks.vision.ObjectDetectorGraph"),Be(r,"IMAGE:input_frame_gpu"),Be(r,"NORM_RECT:norm_rect"),be(r,"DETECTIONS:detections"),r.o(t),Mt(e,r),this.g.attachProtoVectorListener("detections",(i,a)=>{for(const n of i)i=B2(n),this.j.detections.push(og(i));X(this,a)}),this.g.attachEmptyPacketListener("detections",i=>{X(this,i)}),e=e.g(),this.setGraph(new Uint8Array(e),!0)}};Pt.prototype.detectForVideo=Pt.prototype.F,Pt.prototype.detect=Pt.prototype.D,Pt.prototype.setOptions=Pt.prototype.o,Pt.createFromModelPath=async function(e,t){return _e(Pt,e,{baseOptions:{modelAssetPath:t}})},Pt.createFromModelBuffer=function(e,t){return _e(Pt,e,{baseOptions:{modelAssetBuffer:t}})},Pt.createFromOptions=function(e,t){return _e(Pt,e,t)};var Su=class{constructor(e,t,r){this.landmarks=e,this.worldLandmarks=t,this.segmentationMasks=r}close(){var e;(e=this.segmentationMasks)==null||e.forEach(t=>{t.close()})}};function jh(e){e.landmarks=[],e.worldLandmarks=[],e.segmentationMasks=void 0}function qh(e){try{const t=new Su(e.landmarks,e.worldLandmarks,e.segmentationMasks);if(!e.s)return t;e.s(t)}finally{$s(e)}}Su.prototype.close=Su.prototype.close;var St=class extends bt{constructor(e,t){super(new Gt(e,t),"image_in","norm_rect",!1),this.landmarks=[],this.worldLandmarks=[],this.outputSegmentationMasks=!1,ue(e=this.h=new sg,0,1,t=new Ve),this.v=new Q2,ue(this.h,0,3,this.v),this.j=new Z2,ue(this.h,0,2,this.j),fr(this.j,4,1),re(this.j,2,.5),re(this.v,2,.5),re(this.h,4,.5)}get baseOptions(){return $e(this.h,Ve,1)}set baseOptions(e){ue(this.h,0,1,e)}o(e){return"numPoses"in e&&fr(this.j,4,e.numPoses??1),"minPoseDetectionConfidence"in e&&re(this.j,2,e.minPoseDetectionConfidence??.5),"minTrackingConfidence"in e&&re(this.h,4,e.minTrackingConfidence??.5),"minPosePresenceConfidence"in e&&re(this.v,2,e.minPosePresenceConfidence??.5),"outputSegmentationMasks"in e&&(this.outputSegmentationMasks=e.outputSegmentationMasks??!1),this.l(e)}D(e,t,r){const i=typeof t!="function"?t:{};return this.s=typeof t=="function"?t:r,jh(this),jt(this,e,i),qh(this)}F(e,t,r,i){const a=typeof r!="function"?r:{};return this.s=typeof r=="function"?r:i,jh(this),gr(this,e,a,t),qh(this)}m(){var e=new wt;De(e,"image_in"),De(e,"norm_rect"),Te(e,"normalized_landmarks"),Te(e,"world_landmarks"),Te(e,"segmentation_masks");const t=new zt;tr(t,Zw,this.h);const r=new pt;Rt(r,"mediapipe.tasks.vision.pose_landmarker.PoseLandmarkerGraph"),Be(r,"IMAGE:image_in"),Be(r,"NORM_RECT:norm_rect"),be(r,"NORM_LANDMARKS:normalized_landmarks"),be(r,"WORLD_LANDMARKS:world_landmarks"),r.o(t),Mt(e,r),vs(this,e),this.g.attachProtoVectorListener("normalized_landmarks",(i,a)=>{this.landmarks=[];for(const n of i)i=Hn(n),this.landmarks.push(ws(i));X(this,a)}),this.g.attachEmptyPacketListener("normalized_landmarks",i=>{this.landmarks=[],X(this,i)}),this.g.attachProtoVectorListener("world_landmarks",(i,a)=>{this.worldLandmarks=[];for(const n of i)i=Ui(n),this.worldLandmarks.push(Bn(i));X(this,a)}),this.g.attachEmptyPacketListener("world_landmarks",i=>{this.worldLandmarks=[],X(this,i)}),this.outputSegmentationMasks&&(be(r,"SEGMENTATION_MASK:segmentation_masks"),Hi(this,"segmentation_masks"),this.g.ca("segmentation_masks",(i,a)=>{this.segmentationMasks=i.map(n=>Yi(this,n,!0,!this.s)),X(this,a)}),this.g.attachEmptyPacketListener("segmentation_masks",i=>{this.segmentationMasks=[],X(this,i)})),e=e.g(),this.setGraph(new Uint8Array(e),!0)}};St.prototype.detectForVideo=St.prototype.F,St.prototype.detect=St.prototype.D,St.prototype.setOptions=St.prototype.o,St.createFromModelPath=function(e,t){return _e(St,e,{baseOptions:{modelAssetPath:t}})},St.createFromModelBuffer=function(e,t){return _e(St,e,{baseOptions:{modelAssetBuffer:t}})},St.createFromOptions=function(e,t){return _e(St,e,t)},St.POSE_CONNECTIONS=wg;/*!
 * ONNX Runtime Web v1.23.0
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */var Yl=Object.defineProperty,n4=Object.getOwnPropertyDescriptor,a4=Object.getOwnPropertyNames,s4=Object.prototype.hasOwnProperty,o4=(e=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(e,{get:(t,r)=>(typeof require<"u"?require:t)[r]}):e)(function(e){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+e+'" is not supported')}),U=(e,t)=>()=>(e&&(t=e(e=0)),t),un=(e,t)=>{for(var r in t)Yl(e,r,{get:t[r],enumerable:!0})},u4=(e,t,r,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let a of a4(t))!s4.call(e,a)&&a!==r&&Yl(e,a,{get:()=>t[a],enumerable:!(i=n4(t,a))||i.enumerable});return e},Fn=e=>u4(Yl({},"__esModule",{value:!0}),e),mn,Ur,Mi,Hh,$g,xg=U(()=>{mn=new Map,Ur=[],Mi=(e,t,r)=>{if(t&&typeof t.init=="function"&&typeof t.createInferenceSessionHandler=="function"){let i=mn.get(e);if(i===void 0)mn.set(e,{backend:t,priority:r});else{if(i.priority>r)return;if(i.priority===r&&i.backend!==t)throw new Error(`cannot register backend "${e}" using priority ${r}`)}if(r>=0){let a=Ur.indexOf(e);a!==-1&&Ur.splice(a,1);for(let n=0;n<Ur.length;n++)if(mn.get(Ur[n]).priority<=r){Ur.splice(n,0,e);return}Ur.push(e)}return}throw new TypeError("not a valid backend")},Hh=async e=>{let t=mn.get(e);if(!t)return"backend not found.";if(t.initialized)return t.backend;if(t.aborted)return t.error;{let r=!!t.initPromise;try{return r||(t.initPromise=t.backend.init(e)),await t.initPromise,t.initialized=!0,t.backend}catch(i){return r||(t.error=`${i}`,t.aborted=!0),t.error}finally{delete t.initPromise}}},$g=async e=>{let t=e.executionProviders||[],r=t.map(l=>typeof l=="string"?l:l.name),i=r.length===0?Ur:r,a,n=[],s=new Set;for(let l of i){let d=await Hh(l);typeof d=="string"?n.push({name:l,err:d}):(a||(a=d),a===d&&s.add(l))}if(!a)throw new Error(`no available backend found. ERR: ${n.map(l=>`[${l.name}] ${l.err}`).join(", ")}`);for(let{name:l,err:d}of n)r.includes(l)&&console.warn(`removing requested execution provider "${l}" from session options because it is not available: ${d}`);let u=t.filter(l=>s.has(typeof l=="string"?l:l.name));return[a,new Proxy(e,{get:(l,d)=>d==="executionProviders"?u:Reflect.get(l,d)})]}}),l4=U(()=>{xg()}),Tg,d4=U(()=>{Tg="1.23.0"}),po,st,kg=U(()=>{d4(),po="warning",st={wasm:{},webgl:{},webgpu:{},versions:{common:Tg},set logLevel(e){if(e!==void 0){if(typeof e!="string"||["verbose","info","warning","error","fatal"].indexOf(e)===-1)throw new Error(`Unsupported logging level: ${e}`);po=e}},get logLevel(){return po}},Object.defineProperty(st,"logLevel",{enumerable:!0})}),Ae,c4=U(()=>{kg(),Ae=st}),Eg,Sg,h4=U(()=>{Eg=(e,t)=>{let r=typeof document<"u"?document.createElement("canvas"):new OffscreenCanvas(1,1);r.width=e.dims[3],r.height=e.dims[2];let i=r.getContext("2d");if(i!=null){let a,n;(t==null?void 0:t.tensorLayout)!==void 0&&t.tensorLayout==="NHWC"?(a=e.dims[2],n=e.dims[3]):(a=e.dims[3],n=e.dims[2]);let s=(t==null?void 0:t.format)!==void 0?t.format:"RGB",u=t==null?void 0:t.norm,l,d;u===void 0||u.mean===void 0?l=[255,255,255,255]:typeof u.mean=="number"?l=[u.mean,u.mean,u.mean,u.mean]:(l=[u.mean[0],u.mean[1],u.mean[2],0],u.mean[3]!==void 0&&(l[3]=u.mean[3])),u===void 0||u.bias===void 0?d=[0,0,0,0]:typeof u.bias=="number"?d=[u.bias,u.bias,u.bias,u.bias]:(d=[u.bias[0],u.bias[1],u.bias[2],0],u.bias[3]!==void 0&&(d[3]=u.bias[3]));let h=n*a,f=0,g=h,y=h*2,_=-1;s==="RGBA"?(f=0,g=h,y=h*2,_=h*3):s==="RGB"?(f=0,g=h,y=h*2):s==="RBG"&&(f=0,y=h,g=h*2);for(let w=0;w<n;w++)for(let x=0;x<a;x++){let $=(e.data[f++]-d[0])*l[0],v=(e.data[g++]-d[1])*l[1],k=(e.data[y++]-d[2])*l[2],E=_===-1?255:(e.data[_++]-d[3])*l[3];i.fillStyle="rgba("+$+","+v+","+k+","+E+")",i.fillRect(x,w,1,1)}if("toDataURL"in r)return r.toDataURL();throw new Error("toDataURL is not supported")}else throw new Error("Can not access image data")},Sg=(e,t)=>{let r=typeof document<"u"?document.createElement("canvas").getContext("2d"):new OffscreenCanvas(1,1).getContext("2d"),i;if(r!=null){let a,n,s;(t==null?void 0:t.tensorLayout)!==void 0&&t.tensorLayout==="NHWC"?(a=e.dims[2],n=e.dims[1],s=e.dims[3]):(a=e.dims[3],n=e.dims[2],s=e.dims[1]);let u=t!==void 0&&t.format!==void 0?t.format:"RGB",l=t==null?void 0:t.norm,d,h;l===void 0||l.mean===void 0?d=[255,255,255,255]:typeof l.mean=="number"?d=[l.mean,l.mean,l.mean,l.mean]:(d=[l.mean[0],l.mean[1],l.mean[2],255],l.mean[3]!==void 0&&(d[3]=l.mean[3])),l===void 0||l.bias===void 0?h=[0,0,0,0]:typeof l.bias=="number"?h=[l.bias,l.bias,l.bias,l.bias]:(h=[l.bias[0],l.bias[1],l.bias[2],0],l.bias[3]!==void 0&&(h[3]=l.bias[3]));let f=n*a;if(t!==void 0&&(t.format!==void 0&&s===4&&t.format!=="RGBA"||s===3&&t.format!=="RGB"&&t.format!=="BGR"))throw new Error("Tensor format doesn't match input tensor dims");let g=4,y=0,_=1,w=2,x=3,$=0,v=f,k=f*2,E=-1;u==="RGBA"?($=0,v=f,k=f*2,E=f*3):u==="RGB"?($=0,v=f,k=f*2):u==="RBG"&&($=0,k=f,v=f*2),i=r.createImageData(a,n);for(let S=0;S<n*a;y+=g,_+=g,w+=g,x+=g,S++)i.data[y]=(e.data[$++]-h[0])*d[0],i.data[_]=(e.data[v++]-h[1])*d[1],i.data[w]=(e.data[k++]-h[2])*d[2],i.data[x]=E===-1?255:(e.data[E++]-h[3])*d[3]}else throw new Error("Can not access image data");return i}}),la,Cg,Ag,Ig,zg,Og,p4=U(()=>{Zl(),la=(e,t)=>{if(e===void 0)throw new Error("Image buffer must be defined");if(t.height===void 0||t.width===void 0)throw new Error("Image height and width must be defined");if(t.tensorLayout==="NHWC")throw new Error("NHWC Tensor layout is not supported yet");let{height:r,width:i}=t,a=t.norm??{mean:255,bias:0},n,s;typeof a.mean=="number"?n=[a.mean,a.mean,a.mean,a.mean]:n=[a.mean[0],a.mean[1],a.mean[2],a.mean[3]??255],typeof a.bias=="number"?s=[a.bias,a.bias,a.bias,a.bias]:s=[a.bias[0],a.bias[1],a.bias[2],a.bias[3]??0];let u=t.format!==void 0?t.format:"RGBA",l=t.tensorFormat!==void 0&&t.tensorFormat!==void 0?t.tensorFormat:"RGB",d=r*i,h=l==="RGBA"?new Float32Array(d*4):new Float32Array(d*3),f=4,g=0,y=1,_=2,w=3,x=0,$=d,v=d*2,k=-1;u==="RGB"&&(f=3,g=0,y=1,_=2,w=-1),l==="RGBA"?k=d*3:l==="RBG"?(x=0,v=d,$=d*2):l==="BGR"&&(v=0,$=d,x=d*2);for(let E=0;E<d;E++,g+=f,_+=f,y+=f,w+=f)h[x++]=(e[g]+s[0])/n[0],h[$++]=(e[y]+s[1])/n[1],h[v++]=(e[_]+s[2])/n[2],k!==-1&&w!==-1&&(h[k++]=(e[w]+s[3])/n[3]);return l==="RGBA"?new At("float32",h,[1,4,r,i]):new At("float32",h,[1,3,r,i])},Cg=async(e,t)=>{let r=typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement,i=typeof ImageData<"u"&&e instanceof ImageData,a=typeof ImageBitmap<"u"&&e instanceof ImageBitmap,n=typeof e=="string",s,u=t??{},l=()=>{if(typeof document<"u")return document.createElement("canvas");if(typeof OffscreenCanvas<"u")return new OffscreenCanvas(1,1);throw new Error("Canvas is not supported")},d=h=>typeof HTMLCanvasElement<"u"&&h instanceof HTMLCanvasElement||h instanceof OffscreenCanvas?h.getContext("2d"):null;if(r){let h=l();h.width=e.width,h.height=e.height;let f=d(h);if(f!=null){let g=e.height,y=e.width;if(t!==void 0&&t.resizedHeight!==void 0&&t.resizedWidth!==void 0&&(g=t.resizedHeight,y=t.resizedWidth),t!==void 0){if(u=t,t.tensorFormat!==void 0)throw new Error("Image input config format must be RGBA for HTMLImageElement");u.tensorFormat="RGBA",u.height=g,u.width=y}else u.tensorFormat="RGBA",u.height=g,u.width=y;f.drawImage(e,0,0),s=f.getImageData(0,0,y,g).data}else throw new Error("Can not access image data")}else if(i){let h,f;if(t!==void 0&&t.resizedWidth!==void 0&&t.resizedHeight!==void 0?(h=t.resizedHeight,f=t.resizedWidth):(h=e.height,f=e.width),t!==void 0&&(u=t),u.format="RGBA",u.height=h,u.width=f,t!==void 0){let g=l();g.width=f,g.height=h;let y=d(g);if(y!=null)y.putImageData(e,0,0),s=y.getImageData(0,0,f,h).data;else throw new Error("Can not access image data")}else s=e.data}else if(a){if(t===void 0)throw new Error("Please provide image config with format for Imagebitmap");let h=l();h.width=e.width,h.height=e.height;let f=d(h);if(f!=null){let g=e.height,y=e.width;return f.drawImage(e,0,0,y,g),s=f.getImageData(0,0,y,g).data,u.height=g,u.width=y,la(s,u)}else throw new Error("Can not access image data")}else{if(n)return new Promise((h,f)=>{let g=l(),y=d(g);if(!e||!y)return f();let _=new Image;_.crossOrigin="Anonymous",_.src=e,_.onload=()=>{g.width=_.width,g.height=_.height,y.drawImage(_,0,0,g.width,g.height);let w=y.getImageData(0,0,g.width,g.height);u.height=g.height,u.width=g.width,h(la(w.data,u))}});throw new Error("Input data provided is not supported - aborted tensor creation")}if(s!==void 0)return la(s,u);throw new Error("Input data provided is not supported - aborted tensor creation")},Ag=(e,t)=>{let{width:r,height:i,download:a,dispose:n}=t,s=[1,i,r,4];return new At({location:"texture",type:"float32",texture:e,dims:s,download:a,dispose:n})},Ig=(e,t)=>{let{dataType:r,dims:i,download:a,dispose:n}=t;return new At({location:"gpu-buffer",type:r??"float32",gpuBuffer:e,dims:i,download:a,dispose:n})},zg=(e,t)=>{let{dataType:r,dims:i,download:a,dispose:n}=t;return new At({location:"ml-tensor",type:r??"float32",mlTensor:e,dims:i,download:a,dispose:n})},Og=(e,t,r)=>new At({location:"cpu-pinned",type:e,data:t,dims:r??[t.length]})}),hi,An,fo,Rg,f4=U(()=>{hi=new Map([["float32",Float32Array],["uint8",Uint8Array],["int8",Int8Array],["uint16",Uint16Array],["int16",Int16Array],["int32",Int32Array],["bool",Uint8Array],["float64",Float64Array],["uint32",Uint32Array],["int4",Uint8Array],["uint4",Uint8Array]]),An=new Map([[Float32Array,"float32"],[Uint8Array,"uint8"],[Int8Array,"int8"],[Uint16Array,"uint16"],[Int16Array,"int16"],[Int32Array,"int32"],[Float64Array,"float64"],[Uint32Array,"uint32"]]),fo=!1,Rg=()=>{if(!fo){fo=!0;let e=typeof BigInt64Array<"u"&&BigInt64Array.from,t=typeof BigUint64Array<"u"&&BigUint64Array.from,r=globalThis.Float16Array,i=typeof r<"u"&&r.from;e&&(hi.set("int64",BigInt64Array),An.set(BigInt64Array,"int64")),t&&(hi.set("uint64",BigUint64Array),An.set(BigUint64Array,"uint64")),i?(hi.set("float16",r),An.set(r,"float16")):hi.set("float16",Uint16Array)}}}),Mg,Bg,m4=U(()=>{Zl(),Mg=e=>{let t=1;for(let r=0;r<e.length;r++){let i=e[r];if(typeof i!="number"||!Number.isSafeInteger(i))throw new TypeError(`dims[${r}] must be an integer, got: ${i}`);if(i<0)throw new RangeError(`dims[${r}] must be a non-negative integer, got: ${i}`);t*=i}return t},Bg=(e,t)=>{switch(e.location){case"cpu":return new At(e.type,e.data,t);case"cpu-pinned":return new At({location:"cpu-pinned",data:e.data,type:e.type,dims:t});case"texture":return new At({location:"texture",texture:e.texture,type:e.type,dims:t});case"gpu-buffer":return new At({location:"gpu-buffer",gpuBuffer:e.gpuBuffer,type:e.type,dims:t});case"ml-tensor":return new At({location:"ml-tensor",mlTensor:e.mlTensor,type:e.type,dims:t});default:throw new Error(`tensorReshape: tensor location ${e.location} is not supported`)}}}),At,Zl=U(()=>{h4(),p4(),f4(),m4(),At=class{constructor(e,t,r){Rg();let i,a;if(typeof e=="object"&&"location"in e)switch(this.dataLocation=e.location,i=e.type,a=e.dims,e.location){case"cpu-pinned":{let s=hi.get(i);if(!s)throw new TypeError(`unsupported type "${i}" to create tensor from pinned buffer`);if(!(e.data instanceof s))throw new TypeError(`buffer should be of type ${s.name}`);this.cpuData=e.data;break}case"texture":{if(i!=="float32")throw new TypeError(`unsupported type "${i}" to create tensor from texture`);this.gpuTextureData=e.texture,this.downloader=e.download,this.disposer=e.dispose;break}case"gpu-buffer":{if(i!=="float32"&&i!=="float16"&&i!=="int32"&&i!=="int64"&&i!=="uint32"&&i!=="uint8"&&i!=="bool"&&i!=="uint4"&&i!=="int4")throw new TypeError(`unsupported type "${i}" to create tensor from gpu buffer`);this.gpuBufferData=e.gpuBuffer,this.downloader=e.download,this.disposer=e.dispose;break}case"ml-tensor":{if(i!=="float32"&&i!=="float16"&&i!=="int32"&&i!=="int64"&&i!=="uint32"&&i!=="uint64"&&i!=="int8"&&i!=="uint8"&&i!=="bool"&&i!=="uint4"&&i!=="int4")throw new TypeError(`unsupported type "${i}" to create tensor from MLTensor`);this.mlTensorData=e.mlTensor,this.downloader=e.download,this.disposer=e.dispose;break}default:throw new Error(`Tensor constructor: unsupported location '${this.dataLocation}'`)}else{let s,u;if(typeof e=="string")if(i=e,u=r,e==="string"){if(!Array.isArray(t))throw new TypeError("A string tensor's data must be a string array.");s=t}else{let l=hi.get(e);if(l===void 0)throw new TypeError(`Unsupported tensor type: ${e}.`);if(Array.isArray(t)){if(e==="float16"&&l===Uint16Array||e==="uint4"||e==="int4")throw new TypeError(`Creating a ${e} tensor from number array is not supported. Please use ${l.name} as data.`);e==="uint64"||e==="int64"?s=l.from(t,BigInt):s=l.from(t)}else if(t instanceof l)s=t;else if(t instanceof Uint8ClampedArray)if(e==="uint8")s=Uint8Array.from(t);else throw new TypeError("A Uint8ClampedArray tensor's data must be type of uint8");else if(e==="float16"&&t instanceof Uint16Array&&l!==Uint16Array)s=new globalThis.Float16Array(t.buffer,t.byteOffset,t.length);else throw new TypeError(`A ${i} tensor's data must be type of ${l}`)}else if(u=t,Array.isArray(e)){if(e.length===0)throw new TypeError("Tensor type cannot be inferred from an empty array.");let l=typeof e[0];if(l==="string")i="string",s=e;else if(l==="boolean")i="bool",s=Uint8Array.from(e);else throw new TypeError(`Invalid element type of data array: ${l}.`)}else if(e instanceof Uint8ClampedArray)i="uint8",s=Uint8Array.from(e);else{let l=An.get(e.constructor);if(l===void 0)throw new TypeError(`Unsupported type for tensor data: ${e.constructor}.`);i=l,s=e}if(u===void 0)u=[s.length];else if(!Array.isArray(u))throw new TypeError("A tensor's dims must be a number array");a=u,this.cpuData=s,this.dataLocation="cpu"}let n=Mg(a);if(this.cpuData&&n!==this.cpuData.length&&!((i==="uint4"||i==="int4")&&Math.ceil(n/2)===this.cpuData.length))throw new Error(`Tensor's size(${n}) does not match data length(${this.cpuData.length}).`);this.type=i,this.dims=a,this.size=n}static async fromImage(e,t){return Cg(e,t)}static fromTexture(e,t){return Ag(e,t)}static fromGpuBuffer(e,t){return Ig(e,t)}static fromMLTensor(e,t){return zg(e,t)}static fromPinnedBuffer(e,t,r){return Og(e,t,r)}toDataURL(e){return Eg(this,e)}toImageData(e){return Sg(this,e)}get data(){if(this.ensureValid(),!this.cpuData)throw new Error("The data is not on CPU. Use `getData()` to download GPU data to CPU, or use `texture` or `gpuBuffer` property to access the GPU data directly.");return this.cpuData}get location(){return this.dataLocation}get texture(){if(this.ensureValid(),!this.gpuTextureData)throw new Error("The data is not stored as a WebGL texture.");return this.gpuTextureData}get gpuBuffer(){if(this.ensureValid(),!this.gpuBufferData)throw new Error("The data is not stored as a WebGPU buffer.");return this.gpuBufferData}get mlTensor(){if(this.ensureValid(),!this.mlTensorData)throw new Error("The data is not stored as a WebNN MLTensor.");return this.mlTensorData}async getData(e){switch(this.ensureValid(),this.dataLocation){case"cpu":case"cpu-pinned":return this.data;case"texture":case"gpu-buffer":case"ml-tensor":{if(!this.downloader)throw new Error("The current tensor is not created with a specified data downloader.");if(this.isDownloading)throw new Error("The current tensor is being downloaded.");try{this.isDownloading=!0;let t=await this.downloader();return this.downloader=void 0,this.dataLocation="cpu",this.cpuData=t,e&&this.disposer&&(this.disposer(),this.disposer=void 0),t}finally{this.isDownloading=!1}}default:throw new Error(`cannot get data from location: ${this.dataLocation}`)}}dispose(){if(this.isDownloading)throw new Error("The current tensor is being downloaded.");this.disposer&&(this.disposer(),this.disposer=void 0),this.cpuData=void 0,this.gpuTextureData=void 0,this.gpuBufferData=void 0,this.mlTensorData=void 0,this.downloader=void 0,this.isDownloading=void 0,this.dataLocation="none"}ensureValid(){if(this.dataLocation==="none")throw new Error("The tensor is disposed.")}reshape(e){if(this.ensureValid(),this.downloader||this.disposer)throw new Error("Cannot reshape a tensor that owns GPU resource.");return Bg(this,e)}}}),Jt,Ng=U(()=>{Zl(),Jt=At}),Ga,mo,mr,er,_i,bi,Dg=U(()=>{kg(),Ga=(e,t)=>{(typeof st.trace>"u"?!st.wasm.trace:!st.trace)||console.timeStamp(`${e}::ORT::${t}`)},mo=(e,t)=>{var a;let r=((a=new Error().stack)==null?void 0:a.split(/\r\n|\r|\n/g))||[],i=!1;for(let n=0;n<r.length;n++){if(i&&!r[n].includes("TRACE_FUNC")){let s=`FUNC_${e}::${r[n].trim().split(" ")[1]}`;t&&(s+=`::${t}`),Ga("CPU",s);return}r[n].includes("TRACE_FUNC")&&(i=!0)}},mr=e=>{(typeof st.trace>"u"?!st.wasm.trace:!st.trace)||mo("BEGIN",e)},er=e=>{(typeof st.trace>"u"?!st.wasm.trace:!st.trace)||mo("END",e)},_i=e=>{(typeof st.trace>"u"?!st.wasm.trace:!st.trace)||console.time(`ORT::${e}`)},bi=e=>{(typeof st.trace>"u"?!st.wasm.trace:!st.trace)||console.timeEnd(`ORT::${e}`)}}),Pg,g4=U(()=>{xg(),Ng(),Dg(),Pg=class Lg{constructor(t){this.handler=t}async run(t,r,i){mr(),_i("InferenceSession.run");let a={},n={};if(typeof t!="object"||t===null||t instanceof Jt||Array.isArray(t))throw new TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.");let s=!0;if(typeof r=="object"){if(r===null)throw new TypeError("Unexpected argument[1]: cannot be null.");if(r instanceof Jt)throw new TypeError("'fetches' cannot be a Tensor");if(Array.isArray(r)){if(r.length===0)throw new TypeError("'fetches' cannot be an empty array.");s=!1;for(let d of r){if(typeof d!="string")throw new TypeError("'fetches' must be a string array or an object.");if(this.outputNames.indexOf(d)===-1)throw new RangeError(`'fetches' contains invalid output name: ${d}.`);a[d]=null}if(typeof i=="object"&&i!==null)n=i;else if(typeof i<"u")throw new TypeError("'options' must be an object.")}else{let d=!1,h=Object.getOwnPropertyNames(r);for(let f of this.outputNames)if(h.indexOf(f)!==-1){let g=r[f];(g===null||g instanceof Jt)&&(d=!0,s=!1,a[f]=g)}if(d){if(typeof i=="object"&&i!==null)n=i;else if(typeof i<"u")throw new TypeError("'options' must be an object.")}else n=r}}else if(typeof r<"u")throw new TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");for(let d of this.inputNames)if(typeof t[d]>"u")throw new Error(`input '${d}' is missing in 'feeds'.`);if(s)for(let d of this.outputNames)a[d]=null;let u=await this.handler.run(t,a,n),l={};for(let d in u)if(Object.hasOwnProperty.call(u,d)){let h=u[d];h instanceof Jt?l[d]=h:l[d]=new Jt(h.type,h.data,h.dims)}return bi("InferenceSession.run"),er(),l}async release(){return this.handler.dispose()}static async create(t,r,i,a){mr(),_i("InferenceSession.create");let n,s={};if(typeof t=="string"){if(n=t,typeof r=="object"&&r!==null)s=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof Uint8Array){if(n=t,typeof r=="object"&&r!==null)s=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof ArrayBuffer||typeof SharedArrayBuffer<"u"&&t instanceof SharedArrayBuffer){let h=t,f=0,g=t.byteLength;if(typeof r=="object"&&r!==null)s=r;else if(typeof r=="number"){if(f=r,!Number.isSafeInteger(f))throw new RangeError("'byteOffset' must be an integer.");if(f<0||f>=h.byteLength)throw new RangeError(`'byteOffset' is out of range [0, ${h.byteLength}).`);if(g=t.byteLength-f,typeof i=="number"){if(g=i,!Number.isSafeInteger(g))throw new RangeError("'byteLength' must be an integer.");if(g<=0||f+g>h.byteLength)throw new RangeError(`'byteLength' is out of range (0, ${h.byteLength-f}].`);if(typeof a=="object"&&a!==null)s=a;else if(typeof a<"u")throw new TypeError("'options' must be an object.")}else if(typeof i<"u")throw new TypeError("'byteLength' must be a number.")}else if(typeof r<"u")throw new TypeError("'options' must be an object.");n=new Uint8Array(h,f,g)}else throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");let[u,l]=await $g(s),d=await u.createInferenceSessionHandler(n,l);return bi("InferenceSession.create"),er(),new Lg(d)}startProfiling(){this.handler.startProfiling()}endProfiling(){this.handler.endProfiling()}get inputNames(){return this.handler.inputNames}get outputNames(){return this.handler.outputNames}get inputMetadata(){return this.handler.inputMetadata}get outputMetadata(){return this.handler.outputMetadata}}}),Ql,y4=U(()=>{g4(),Ql=Pg}),_4=U(()=>{}),b4=U(()=>{}),w4=U(()=>{}),v4=U(()=>{}),$4={};un($4,{InferenceSession:()=>Ql,TRACE:()=>Ga,TRACE_EVENT_BEGIN:()=>_i,TRACE_EVENT_END:()=>bi,TRACE_FUNC_BEGIN:()=>mr,TRACE_FUNC_END:()=>er,Tensor:()=>Jt,env:()=>Ae,registerBackend:()=>Mi});var qt=U(()=>{l4(),c4(),y4(),Ng(),_4(),b4(),Dg(),w4(),v4()}),Jl=U(()=>{}),Ug={};un(Ug,{default:()=>Fg});var go,yo,Fg,x4=U(()=>{var e;qy(),Ei(),ed(),go="ort-wasm-proxy-worker",yo=((e=globalThis.self)==null?void 0:e.name)===go,yo&&(self.onmessage=t=>{let{type:r,in:i}=t.data;try{switch(r){case"init-wasm":td(i.wasm).then(()=>{_d(i).then(()=>{postMessage({type:r})},a=>{postMessage({type:r,err:a})})},a=>{postMessage({type:r,err:a})});break;case"init-ep":{let{epName:a,env:n}=i;bd(n,a).then(()=>{postMessage({type:r})},s=>{postMessage({type:r,err:s})});break}case"copy-from":{let{buffer:a}=i,n=Za(a);postMessage({type:r,out:n});break}case"create":{let{model:a,options:n}=i;wd(a,n).then(s=>{postMessage({type:r,out:s})},s=>{postMessage({type:r,err:s})});break}case"release":vd(i),postMessage({type:r});break;case"run":{let{sessionId:a,inputIndices:n,inputs:s,outputIndices:u,options:l}=i;$d(a,n,s,u,new Array(u.length).fill(null),l).then(d=>{d.some(h=>h[3]!=="cpu")?postMessage({type:r,err:"Proxy does not support non-cpu tensor location."}):postMessage({type:r,out:d},Td([...s,...d]))},d=>{postMessage({type:r,err:d})});break}case"end-profiling":xd(i),postMessage({type:r});break;default:}}catch(a){postMessage({type:r,err:a})}}),Fg=yo?null:t=>new Worker(t??Ct,{type:"module",name:go})}),Vg={};un(Vg,{default:()=>Wg});var _o,Wg,Kh,T4=U(()=>{var e,t;_o=async function(r={}){var Dc;var i,a,n=r,s=new Promise((o,c)=>{i=o,a=c}),u=typeof window=="object",l=typeof WorkerGlobalScope<"u",d=l&&((Dc=self.name)==null?void 0:Dc.startsWith("em-pthread"));n.mountExternalData=(o,c)=>{o.startsWith("./")&&(o=o.substring(2)),(n.Fb||(n.Fb=new Map)).set(o,c)},n.unmountExternalData=()=>{delete n.Fb};var h=globalThis.SharedArrayBuffer??new WebAssembly.Memory({initial:0,maximum:0,qc:!0}).buffer.constructor;let f=o=>async(...c)=>{var p;try{if(n.Gb)throw Error("Session already started");let m=n.Gb={ec:c[0],errors:[]},b=await o(...c);if(n.Gb!==m)throw Error("Session mismatch");(p=n.Kb)==null||p.flush();let T=m.errors;if(0<T.length){let C=await Promise.all(T);if(C=C.filter(O=>O),0<C.length)throw Error(C.join(`
`))}return b}finally{n.Gb=null}};n.jsepInit=(o,c)=>{if(o==="webgpu"){[n.Kb,n.Vb,n.Zb,n.Lb,n.Yb,n.Ab,n.$b,n.bc,n.Wb,n.Xb,n.ac]=c;let p=n.Kb;n.jsepRegisterBuffer=(m,b,T,C)=>p.registerBuffer(m,b,T,C),n.jsepGetBuffer=m=>p.getBuffer(m),n.jsepCreateDownloader=(m,b,T)=>p.createDownloader(m,b,T),n.jsepOnCreateSession=m=>{p.onCreateSession(m)},n.jsepOnReleaseSession=m=>{p.onReleaseSession(m)},n.jsepOnRunStart=m=>p.onRunStart(m),n.cc=(m,b)=>{p.upload(m,b)}}else if(o==="webnn"){let p=c[0];[n.oc,n.Ob,n.webnnEnsureTensor,n.Pb,n.webnnDownloadTensor,n.nc,n.webnnEnableTraceEvent]=c.slice(1),n.webnnReleaseTensorId=n.Ob,n.webnnUploadTensor=n.Pb,n.webnnRegisterMLContext=n.nc,n.webnnOnRunStart=m=>p.onRunStart(m),n.webnnOnRunEnd=p.onRunEnd.bind(p),n.webnnOnReleaseSession=m=>{p.onReleaseSession(m)},n.webnnCreateMLTensorDownloader=(m,b)=>p.createMLTensorDownloader(m,b),n.webnnRegisterMLTensor=(m,b,T,C)=>p.registerMLTensor(m,b,T,C),n.webnnCreateMLContext=m=>p.createMLContext(m),n.webnnRegisterMLConstant=(m,b,T,C,O,P)=>p.registerMLConstant(m,b,T,C,O,n.Fb,P),n.webnnRegisterGraphInput=p.registerGraphInput.bind(p),n.webnnIsGraphInput=p.isGraphInput.bind(p),n.webnnRegisterGraphOutput=p.registerGraphOutput.bind(p),n.webnnIsGraphOutput=p.isGraphOutput.bind(p),n.webnnCreateTemporaryTensor=p.createTemporaryTensor.bind(p),n.webnnIsGraphInputOutputTypeSupported=p.isGraphInputOutputTypeSupported.bind(p)}};let g=()=>{let o=(c,p,m)=>(...b)=>{let T=or,C=p==null?void 0:p();b=c(...b);let O=p==null?void 0:p();return C!==O&&(c=O,m(C),p=m=null),or!=T?new Promise((P,F)=>{Us={resolve:P,reject:F}}):b};(()=>{for(let c of["_OrtAppendExecutionProvider","_OrtCreateSession","_OrtRun","_OrtRunWithBinding","_OrtBindInput"])n[c]=o(n[c],()=>n[c],p=>n[c]=p)})(),f!==void 0&&(n._OrtRun=f(n._OrtRun),n._OrtRunWithBinding=f(n._OrtRunWithBinding)),g=void 0};n.asyncInit=()=>{g==null||g()};var y,_,w=(o,c)=>{throw c},x=import.meta.url,$="";if(u||l){try{$=new URL(".",x).href}catch{}l&&(_=o=>{var c=new XMLHttpRequest;return c.open("GET",o,!1),c.responseType="arraybuffer",c.send(null),new Uint8Array(c.response)}),y=async o=>{if(W(o))return new Promise((p,m)=>{var b=new XMLHttpRequest;b.open("GET",o,!0),b.responseType="arraybuffer",b.onload=()=>{b.status==200||b.status==0&&b.response?p(b.response):m(b.status)},b.onerror=m,b.send(null)});var c=await fetch(o,{credentials:"same-origin"});if(c.ok)return c.arrayBuffer();throw Error(c.status+" : "+c.url)}}var v,k,E,S,A,I,z,M,V,ee,q,G,ge,ce,Y,pe=console.log.bind(console),Z=console.error.bind(console),se=pe,Se=Z,D=!1,W=o=>o.startsWith("file://");function j(){return k.buffer!=A.buffer&&ke(),A}function ie(){return k.buffer!=A.buffer&&ke(),I}function Ze(){return k.buffer!=A.buffer&&ke(),z}function ar(){return k.buffer!=A.buffer&&ke(),M}function L(){return k.buffer!=A.buffer&&ke(),V}function Ce(){return k.buffer!=A.buffer&&ke(),ee}function vt(){return k.buffer!=A.buffer&&ke(),q}function dt(){return k.buffer!=A.buffer&&ke(),ce}if(d){let o=function(c){try{var p=c.data,m=p.Db;if(m==="load"){let b=[];self.onmessage=T=>b.push(T),self.startWorker=()=>{postMessage({Db:"loaded"});for(let T of b)o(T);self.onmessage=o};for(let T of p.Sb)n[T]&&!n[T].proxy||(n[T]=(...C)=>{postMessage({Db:"callHandler",Rb:T,args:C})},T=="print"&&(se=n[T]),T=="printErr"&&(Se=n[T]));k=p.kc,ke(),Y(p.lc)}else if(m==="run"){n_(p.Bb),qs(p.Bb,0,0,1,0,0),Rd(),Ps(p.Bb),yr||(kc(),yr=!0);try{a_(p.hc,p.Jb)}catch(b){if(b!="unwind")throw b}}else p.target!=="setimmediate"&&(m==="checkMailbox"?yr&&Kn():m&&(Se(`worker: received unknown command ${m}`),Se(p)))}catch(b){throw Ec(),b}};var yr=!1;self.onunhandledrejection=c=>{throw c.reason||c},self.onmessage=o}function ke(){var o=k.buffer;n.HEAP8=A=new Int8Array(o),z=new Int16Array(o),n.HEAPU8=I=new Uint8Array(o),M=new Uint16Array(o),n.HEAP32=V=new Int32Array(o),n.HEAPU32=ee=new Uint32Array(o),q=new Float32Array(o),ce=new Float64Array(o),G=new BigInt64Array(o),ge=new BigUint64Array(o)}function Pe(){d?startWorker(n):B.Da()}var $t,ei=0,ti=null;function Ed(){if(--ei==0&&ti){var o=ti;ti=null,o()}}function Mr(o){throw Se(o="Aborted("+o+")"),D=!0,o=new WebAssembly.RuntimeError(o+". Build with -sASSERTIONS for more info."),a(o),o}function Sd(){return{a:{L:$b,Aa:vb,b:o_,$:Dd,A:Ud,pa:Fd,X:Vd,Z:Wd,qa:Gd,na:jd,ga:qd,ma:Hd,J:Kd,Y:Xd,V:Yd,oa:Zd,W:Qd,va:u_,E:l_,Q:d_,O:h_,D:f_,v:m_,s:g_,P:y_,z:T_,R:k_,ja:E_,T:S_,aa:C_,M:A_,F:I_,ia:Ps,sa:z_,r:O_,Ca:R_,w:N_,o:D_,m:L_,c:Ms,Ba:U_,n:F_,j:G_,u:j_,p:q_,f:H_,t:K_,l:X_,e:Y_,k:Z_,h:Q_,g:J_,d:eb,da:tb,ea:rb,fa:ib,ba:cc,ca:hc,N:pc,xa:ab,ua:ob,i:ub,C:lb,G:db,ta:sb,x:cb,ra:hb,U:pb,q:nb,y:fb,K:mb,S:gb,za:yb,ya:_b,ka:yc,la:_c,_:Is,B:bc,I:wc,ha:vc,H:$c,a:k,wa:As}}}class Ss{constructor(c){de(this,"name","ExitStatus");this.message=`Program terminated with exit(${c})`,this.status=c}}var Cd=o=>{o.terminate(),o.onmessage=()=>{}},Cs=[],Ad=o=>{Nr.length==0&&(Bd(),Md(Nr[0]));var c=Nr.pop();if(!c)return 6;ln.push(c),ri[o.Bb]=c,c.Bb=o.Bb;var p={Db:"run",hc:o.fc,Jb:o.Jb,Bb:o.Bb};return c.postMessage(p,o.Nb),0},Br=0,Ne=(o,c,...p)=>{for(var m=2*p.length,b=Xs(),T=Ks(8*m),C=T>>>3,O=0;O<p.length;O++){var P=p[O];typeof P=="bigint"?(G[C+2*O]=1n,G[C+2*O+1]=P):(G[C+2*O]=0n,dt()[C+2*O+1>>>0]=P)}return o=Sc(o,0,m,T,c),ia(b),o};function As(o){if(d)return Ne(0,1,o);if(S=o,!(0<Br)){for(var c of ln)Cd(c);for(c of Nr)Cd(c);Nr=[],ln=[],ri={},D=!0}w(0,new Ss(o))}function Id(o){if(d)return Ne(1,0,o);Is(o)}var Is=o=>{if(S=o,d)throw Id(o),"unwind";As(o)},Nr=[],ln=[],zd=[],ri={},Od=o=>{var c=o.Bb;delete ri[c],Nr.push(o),ln.splice(ln.indexOf(o),1),o.Bb=0,Cc(c)};function Rd(){zd.forEach(o=>o())}var Md=o=>new Promise(c=>{o.onmessage=b=>{var T=(b=b.data).Db;if(b.Hb&&b.Hb!=js()){var C=ri[b.Hb];C?C.postMessage(b,b.Nb):Se(`Internal error! Worker sent a message "${T}" to target pthread ${b.Hb}, but that thread no longer exists!`)}else T==="checkMailbox"?Kn():T==="spawnThread"?Ad(b):T==="cleanupThread"?Od(ri[b.ic]):T==="loaded"?(o.loaded=!0,c(o)):b.target==="setimmediate"?o.postMessage(b):T==="callHandler"?n[b.Rb](...b.args):T&&Se(`worker sent an unknown command ${T}`)},o.onerror=b=>{throw Se(`worker sent an error! ${b.filename}:${b.lineno}: ${b.message}`),b};var p,m=[];for(p of[])n.propertyIsEnumerable(p)&&m.push(p);o.postMessage({Db:"load",Sb:m,kc:k,lc:E})});function Bd(){var o=new Worker((()=>{let c=URL;return import.meta.url>"file:"&&import.meta.url<"file;"?new c("ort.bundle.min.mjs",import.meta.url):new URL(import.meta.url)})(),{type:"module",workerData:"em-pthread",name:"em-pthread"});Nr.push(o)}var n_=o=>{ke();var c=Ce()[o+52>>>2>>>0];o=Ce()[o+56>>>2>>>0],zc(c,c-o),ia(c)},a_=(o,c)=>{Br=0,o=Oc(o,c),0<Br?S=o:Hs(o)};class s_{constructor(c){this.Ib=c-24}}function o_(o,c,p){var m=new s_(o>>>=0);throw c>>>=0,p>>>=0,Ce()[m.Ib+16>>>2>>>0]=0,Ce()[m.Ib+4>>>2>>>0]=c,Ce()[m.Ib+8>>>2>>>0]=p,o}function Nd(o,c,p,m){return d?Ne(2,1,o,c,p,m):Dd(o,c,p,m)}function Dd(o,c,p,m){if(o>>>=0,p>>>=0,m>>>=0,h===void 0)return 6;var b=[];return d&&b.length===0?Nd(o,c>>>=0,p,m):(o={fc:p,Bb:o,Jb:m,Nb:b},d?(o.Db="spawnThread",postMessage(o,b),0):Ad(o))}var Pd=typeof TextDecoder<"u"?new TextDecoder:void 0,Ld=(o,c=0,p=NaN)=>{var m=(c>>>=0)+p;for(p=c;o[p]&&!(p>=m);)++p;if(16<p-c&&o.buffer&&Pd)return Pd.decode(o.buffer instanceof ArrayBuffer?o.subarray(c,p):o.slice(c,p));for(m="";c<p;){var b=o[c++];if(128&b){var T=63&o[c++];if((224&b)==192)m+=String.fromCharCode((31&b)<<6|T);else{var C=63&o[c++];65536>(b=(240&b)==224?(15&b)<<12|T<<6|C:(7&b)<<18|T<<12|C<<6|63&o[c++])?m+=String.fromCharCode(b):(b-=65536,m+=String.fromCharCode(55296|b>>10,56320|1023&b))}}else m+=String.fromCharCode(b)}return m},Ke=(o,c)=>(o>>>=0)?Ld(ie(),o,c):"";function Ud(o,c,p){return d?Ne(3,1,o,c,p):0}function Fd(o,c){if(d)return Ne(4,1,o,c)}function Vd(o,c){if(d)return Ne(5,1,o,c)}function Wd(o,c,p){if(d)return Ne(6,1,o,c,p)}function Gd(o,c,p){return d?Ne(7,1,o,c,p):0}function jd(o,c){if(d)return Ne(8,1,o,c)}function qd(o,c,p){if(d)return Ne(9,1,o,c,p)}function Hd(o,c,p,m){if(d)return Ne(10,1,o,c,p,m)}function Kd(o,c,p,m){if(d)return Ne(11,1,o,c,p,m)}function Xd(o,c,p,m){if(d)return Ne(12,1,o,c,p,m)}function Yd(o){if(d)return Ne(13,1,o)}function Zd(o,c){if(d)return Ne(14,1,o,c)}function Qd(o,c,p){if(d)return Ne(15,1,o,c,p)}var Jd,u_=()=>Mr(""),sr=o=>{for(var c="";ie()[o>>>0];)c+=Jd[ie()[o++>>>0]];return c},zs={},Os={},Ci=n.BindingError=class extends Error{constructor(o){super(o),this.name="BindingError"}};function _r(o,c,p={}){return function(m,b,T={}){var C=b.name;if(!m)throw new Ci(`type "${C}" must have a positive integer typeid pointer`);if(Os.hasOwnProperty(m)){if(T.Tb)return;throw new Ci(`Cannot register type '${C}' twice`)}Os[m]=b,zs.hasOwnProperty(m)&&(b=zs[m],delete zs[m],b.forEach(O=>O()))}(o,c,p)}var ec=(o,c,p)=>{switch(c){case 1:return p?m=>j()[m>>>0]:m=>ie()[m>>>0];case 2:return p?m=>Ze()[m>>>1>>>0]:m=>ar()[m>>>1>>>0];case 4:return p?m=>L()[m>>>2>>>0]:m=>Ce()[m>>>2>>>0];case 8:return p?m=>G[m>>>3]:m=>ge[m>>>3];default:throw new TypeError(`invalid integer width (${c}): ${o}`)}};function l_(o,c,p){p>>>=0,_r(o>>>=0,{name:c=sr(c>>>0),fromWireType:m=>m,toWireType:function(m,b){if(typeof b!="bigint"&&typeof b!="number")throw b=b===null?"null":(m=typeof b)=="object"||m==="array"||m==="function"?b.toString():""+b,new TypeError(`Cannot convert "${b}" to ${this.name}`);return typeof b=="number"&&(b=BigInt(b)),b},Cb:Dr,readValueFromPointer:ec(c,p,c.indexOf("u")==-1),Eb:null})}var Dr=8;function d_(o,c,p,m){_r(o>>>=0,{name:c=sr(c>>>0),fromWireType:function(b){return!!b},toWireType:function(b,T){return T?p:m},Cb:Dr,readValueFromPointer:function(b){return this.fromWireType(ie()[b>>>0])},Eb:null})}var Rs=[],br=[];function Ms(o){9<(o>>>=0)&&--br[o+1]==0&&(br[o]=void 0,Rs.push(o))}var ct=o=>{if(!o)throw new Ci(`Cannot use deleted val. handle = ${o}`);return br[o]},Bt=o=>{switch(o){case void 0:return 2;case null:return 4;case!0:return 6;case!1:return 8;default:let c=Rs.pop()||br.length;return br[c]=o,br[c+1]=1,c}};function Bs(o){return this.fromWireType(Ce()[o>>>2>>>0])}var c_={name:"emscripten::val",fromWireType:o=>{var c=ct(o);return Ms(o),c},toWireType:(o,c)=>Bt(c),Cb:Dr,readValueFromPointer:Bs,Eb:null};function h_(o){return _r(o>>>0,c_)}var p_=(o,c)=>{switch(c){case 4:return function(p){return this.fromWireType(vt()[p>>>2>>>0])};case 8:return function(p){return this.fromWireType(dt()[p>>>3>>>0])};default:throw new TypeError(`invalid float width (${c}): ${o}`)}};function f_(o,c,p){p>>>=0,_r(o>>>=0,{name:c=sr(c>>>0),fromWireType:m=>m,toWireType:(m,b)=>b,Cb:Dr,readValueFromPointer:p_(c,p),Eb:null})}function m_(o,c,p,m,b){if(o>>>=0,p>>>=0,c=sr(c>>>0),b===-1&&(b=4294967295),b=O=>O,m===0){var T=32-8*p;b=O=>O<<T>>>T}var C=c.includes("unsigned")?function(O,P){return P>>>0}:function(O,P){return P};_r(o,{name:c,fromWireType:b,toWireType:C,Cb:Dr,readValueFromPointer:ec(c,p,m!==0),Eb:null})}function g_(o,c,p){function m(T){var C=Ce()[T>>>2>>>0];return T=Ce()[T+4>>>2>>>0],new b(j().buffer,T,C)}var b=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array,BigInt64Array,BigUint64Array][c];_r(o>>>=0,{name:p=sr(p>>>0),fromWireType:m,Cb:Dr,readValueFromPointer:m},{Tb:!0})}var ii=(o,c,p)=>{var m=ie();if(c>>>=0,0<p){var b=c;p=c+p-1;for(var T=0;T<o.length;++T){var C=o.charCodeAt(T);if(55296<=C&&57343>=C&&(C=65536+((1023&C)<<10)|1023&o.charCodeAt(++T)),127>=C){if(c>=p)break;m[c++>>>0]=C}else{if(2047>=C){if(c+1>=p)break;m[c++>>>0]=192|C>>6}else{if(65535>=C){if(c+2>=p)break;m[c++>>>0]=224|C>>12}else{if(c+3>=p)break;m[c++>>>0]=240|C>>18,m[c++>>>0]=128|C>>12&63}m[c++>>>0]=128|C>>6&63}m[c++>>>0]=128|63&C}}m[c>>>0]=0,o=c-b}else o=0;return o},Ns=o=>{for(var c=0,p=0;p<o.length;++p){var m=o.charCodeAt(p);127>=m?c++:2047>=m?c+=2:55296<=m&&57343>=m?(c+=4,++p):c+=3}return c};function y_(o,c){_r(o>>>=0,{name:c=sr(c>>>0),fromWireType:function(p){for(var m,b=Ce()[p>>>2>>>0],T=p+4,C=T,O=0;O<=b;++O){var P=T+O;O!=b&&ie()[P>>>0]!=0||(C=Ke(C,P-C),m===void 0?m=C:(m+="\0",m+=C),C=P+1)}return wr(p),m},toWireType:function(p,m){m instanceof ArrayBuffer&&(m=new Uint8Array(m));var b=typeof m=="string";if(!(b||ArrayBuffer.isView(m)&&m.BYTES_PER_ELEMENT==1))throw new Ci("Cannot pass non-string to std::string");var T=b?Ns(m):m.length,C=ra(4+T+1),O=C+4;return Ce()[C>>>2>>>0]=T,b?ii(m,O,T+1):ie().set(m,O>>>0),p!==null&&p.push(wr,C),C},Cb:Dr,readValueFromPointer:Bs,Eb(p){wr(p)}})}var tc=typeof TextDecoder<"u"?new TextDecoder("utf-16le"):void 0,__=(o,c)=>{for(var p=o>>1,m=p+c/2;!(p>=m)&&ar()[p>>>0];)++p;if(32<(p<<=1)-o&&tc)return tc.decode(ie().slice(o,p));for(p="",m=0;!(m>=c/2);++m){var b=Ze()[o+2*m>>>1>>>0];if(b==0)break;p+=String.fromCharCode(b)}return p},b_=(o,c,p)=>{if(p??(p=2147483647),2>p)return 0;var m=c;p=(p-=2)<2*o.length?p/2:o.length;for(var b=0;b<p;++b){var T=o.charCodeAt(b);Ze()[c>>>1>>>0]=T,c+=2}return Ze()[c>>>1>>>0]=0,c-m},w_=o=>2*o.length,v_=(o,c)=>{for(var p=0,m="";!(p>=c/4);){var b=L()[o+4*p>>>2>>>0];if(b==0)break;++p,65536<=b?(b-=65536,m+=String.fromCharCode(55296|b>>10,56320|1023&b)):m+=String.fromCharCode(b)}return m},$_=(o,c,p)=>{if(c>>>=0,p??(p=2147483647),4>p)return 0;var m=c;p=m+p-4;for(var b=0;b<o.length;++b){var T=o.charCodeAt(b);if(55296<=T&&57343>=T&&(T=65536+((1023&T)<<10)|1023&o.charCodeAt(++b)),L()[c>>>2>>>0]=T,(c+=4)+4>p)break}return L()[c>>>2>>>0]=0,c-m},x_=o=>{for(var c=0,p=0;p<o.length;++p){var m=o.charCodeAt(p);55296<=m&&57343>=m&&++p,c+=4}return c};function T_(o,c,p){if(o>>>=0,c>>>=0,p=sr(p>>>=0),c===2)var m=__,b=b_,T=w_,C=O=>ar()[O>>>1>>>0];else c===4&&(m=v_,b=$_,T=x_,C=O=>Ce()[O>>>2>>>0]);_r(o,{name:p,fromWireType:O=>{for(var P,F=Ce()[O>>>2>>>0],H=O+4,oe=0;oe<=F;++oe){var me=O+4+oe*c;oe!=F&&C(me)!=0||(H=m(H,me-H),P===void 0?P=H:(P+="\0",P+=H),H=me+c)}return wr(O),P},toWireType:(O,P)=>{if(typeof P!="string")throw new Ci(`Cannot pass non-string to C++ string type ${p}`);var F=T(P),H=ra(4+F+c);return Ce()[H>>>2>>>0]=F/c,b(P,H+4,F+c),O!==null&&O.push(wr,H),H},Cb:Dr,readValueFromPointer:Bs,Eb(O){wr(O)}})}function k_(o,c){_r(o>>>=0,{Ub:!0,name:c=sr(c>>>0),Cb:0,fromWireType:()=>{},toWireType:()=>{}})}function E_(o){qs(o>>>0,!l,1,!u,131072,!1),Rd()}var Ds=o=>{if(!D)try{if(o(),!(0<Br))try{d?Hs(S):Is(S)}catch(c){c instanceof Ss||c=="unwind"||w(0,c)}}catch(c){c instanceof Ss||c=="unwind"||w(0,c)}};function Ps(o){o>>>=0,typeof Atomics.jc=="function"&&(Atomics.jc(L(),o>>>2,o).value.then(Kn),o+=128,Atomics.store(L(),o>>>2,1))}var Kn=()=>{var o=js();o&&(Ps(o),Ds(Ic))};function S_(o,c){(o>>>=0)==c>>>0?setTimeout(Kn):d?postMessage({Hb:o,Db:"checkMailbox"}):(o=ri[o])&&o.postMessage({Db:"checkMailbox"})}var Ls=[];function C_(o,c,p,m,b){for(c>>>=0,m/=2,Ls.length=m,p=b>>>0>>>3,b=0;b<m;b++)Ls[b]=G[p+2*b]?G[p+2*b+1]:dt()[p+2*b+1>>>0];return(c?Gs[c]:wb[o])(...Ls)}var A_=()=>{Br=0};function I_(o){o>>>=0,d?postMessage({Db:"cleanupThread",ic:o}):Od(ri[o])}function z_(o){}var Xn=(o,c)=>{var p=Os[o];if(p===void 0)throw o=Tc(o),p=sr(o),wr(o),new Ci(`${c} has unknown type ${p}`);return p},rc=(o,c,p)=>{var m=[];return o=o.toWireType(m,p),m.length&&(Ce()[c>>>2>>>0]=Bt(m)),o};function O_(o,c,p){return c>>>=0,p>>>=0,o=ct(o>>>0),c=Xn(c,"emval::as"),rc(c,p,o)}function R_(o,c){return c>>>=0,o=ct(o>>>0),(c=Xn(c,"emval::as")).toWireType(null,o)}var Yn=o=>{try{o()}catch(c){Mr(c)}},Pr=0,or=null,ic=0,Zn=[],nc={},ac={},M_=0,Us=null,B_=[];function sc(o){return function(c){if(!D){if(Pr===0){var p=!1,m=!1;c((b=0)=>{if(!D&&(ic=b,p=!0,m)){Pr=2,Yn(()=>Bc(or)),typeof MainLoop<"u"&&MainLoop.Qb&&MainLoop.resume(),b=!1;try{var T=function(){var P=L()[or+8>>>2>>>0];return P=B[ac[P]],--Br,P()}()}catch(P){T=P,b=!0}var C=!1;if(!or){var O=Us;O&&(Us=null,(b?O.reject:O.resolve)(T),C=!0)}if(b&&!C)throw T}}),m=!0,p||(Pr=1,or=function(){var b=ra(65548),T=b+12;Ce()[b>>>2>>>0]=T,Ce()[b+4>>>2>>>0]=T+65536,T=Zn[0];var C=nc[T];return C===void 0&&(C=M_++,nc[T]=C,ac[C]=T),T=C,L()[b+8>>>2>>>0]=T,b}(),typeof MainLoop<"u"&&MainLoop.Qb&&MainLoop.pause(),Yn(()=>Rc(or)))}else Pr===2?(Pr=0,Yn(Nc),wr(or),or=null,B_.forEach(Ds)):Mr(`invalid state: ${Pr}`);return ic}}(c=>{o().then(c)})}function N_(o){return o>>>=0,sc(async()=>{var c=await ct(o);return Bt(c)})}var Qn=[];function D_(o,c,p,m){return p>>>=0,m>>>=0,(o=Qn[o>>>0])(null,c=ct(c>>>0),p,m)}var P_={},Jn=o=>{var c=P_[o];return c===void 0?sr(o):c};function L_(o,c,p,m,b){return p>>>=0,m>>>=0,b>>>=0,(o=Qn[o>>>0])(c=ct(c>>>0),c[p=Jn(p)],m,b)}function U_(o,c){return c>>>=0,(o=ct(o>>>0))==ct(c)}var oc=()=>typeof globalThis=="object"?globalThis:Function("return this")();function F_(o){return(o>>>=0)==0?Bt(oc()):(o=Jn(o),Bt(oc()[o]))}var V_=o=>{var c=Qn.length;return Qn.push(o),c},W_=(o,c)=>{for(var p=Array(o),m=0;m<o;++m)p[m]=Xn(Ce()[c+4*m>>>2>>>0],`parameter ${m}`);return p};function G_(o,c,p){var m=(c=W_(o,c>>>0)).shift();o--;var b=`return function (obj, func, destructorsRef, args) {
`,T=0,C=[];p===0&&C.push("obj");for(var O=["retType"],P=[m],F=0;F<o;++F)C.push(`arg${F}`),O.push(`argType${F}`),P.push(c[F]),b+=`  var arg${F} = argType${F}.readValueFromPointer(args${T?"+"+T:""});
`,T+=c[F].Cb;return b+=`  var rv = ${p===1?"new func":"func.call"}(${C.join(", ")});
`,m.Ub||(O.push("emval_returnValue"),P.push(rc),b+=`  return emval_returnValue(retType, destructorsRef, rv);
`),o=new Function(...O,b+`};
`)(...P),p=`methodCaller<(${c.map(H=>H.name).join(", ")}) => ${m.name}>`,V_(Object.defineProperty(o,"name",{value:p}))}function j_(o){return o=Jn(o>>>0),Bt(n[o])}function q_(o,c){return c>>>=0,o=ct(o>>>0),c=ct(c),Bt(o[c])}function H_(o){9<(o>>>=0)&&(br[o+1]+=1)}function K_(){return Bt([])}function X_(o){o=ct(o>>>0);for(var c=Array(o.length),p=0;p<o.length;p++)c[p]=o[p];return Bt(c)}function Y_(o){return Bt(Jn(o>>>0))}function Z_(){return Bt({})}function Q_(o){for(var c=ct(o>>>=0);c.length;){var p=c.pop();c.pop()(p)}Ms(o)}function J_(o,c,p){c>>>=0,p>>>=0,o=ct(o>>>0),c=ct(c),p=ct(p),o[c]=p}function eb(o,c){return c>>>=0,o=(o=Xn(o>>>0,"_emval_take_value")).readValueFromPointer(c),Bt(o)}function tb(o,c){o=-9007199254740992>o||9007199254740992<o?NaN:Number(o),c>>>=0,o=new Date(1e3*o),L()[c>>>2>>>0]=o.getUTCSeconds(),L()[c+4>>>2>>>0]=o.getUTCMinutes(),L()[c+8>>>2>>>0]=o.getUTCHours(),L()[c+12>>>2>>>0]=o.getUTCDate(),L()[c+16>>>2>>>0]=o.getUTCMonth(),L()[c+20>>>2>>>0]=o.getUTCFullYear()-1900,L()[c+24>>>2>>>0]=o.getUTCDay(),o=(o.getTime()-Date.UTC(o.getUTCFullYear(),0,1,0,0,0,0))/864e5|0,L()[c+28>>>2>>>0]=o}var uc=o=>o%4==0&&(o%100!=0||o%400==0),lc=[0,31,60,91,121,152,182,213,244,274,305,335],dc=[0,31,59,90,120,151,181,212,243,273,304,334];function rb(o,c){o=-9007199254740992>o||9007199254740992<o?NaN:Number(o),c>>>=0,o=new Date(1e3*o),L()[c>>>2>>>0]=o.getSeconds(),L()[c+4>>>2>>>0]=o.getMinutes(),L()[c+8>>>2>>>0]=o.getHours(),L()[c+12>>>2>>>0]=o.getDate(),L()[c+16>>>2>>>0]=o.getMonth(),L()[c+20>>>2>>>0]=o.getFullYear()-1900,L()[c+24>>>2>>>0]=o.getDay();var p=(uc(o.getFullYear())?lc:dc)[o.getMonth()]+o.getDate()-1|0;L()[c+28>>>2>>>0]=p,L()[c+36>>>2>>>0]=-60*o.getTimezoneOffset(),p=new Date(o.getFullYear(),6,1).getTimezoneOffset();var m=new Date(o.getFullYear(),0,1).getTimezoneOffset();o=0|(p!=m&&o.getTimezoneOffset()==Math.min(m,p)),L()[c+32>>>2>>>0]=o}function ib(o){o>>>=0;var c=new Date(L()[o+20>>>2>>>0]+1900,L()[o+16>>>2>>>0],L()[o+12>>>2>>>0],L()[o+8>>>2>>>0],L()[o+4>>>2>>>0],L()[o>>>2>>>0],0),p=L()[o+32>>>2>>>0],m=c.getTimezoneOffset(),b=new Date(c.getFullYear(),6,1).getTimezoneOffset(),T=new Date(c.getFullYear(),0,1).getTimezoneOffset(),C=Math.min(T,b);return 0>p?L()[o+32>>>2>>>0]=+(b!=T&&C==m):0<p!=(C==m)&&(b=Math.max(T,b),c.setTime(c.getTime()+6e4*((0<p?C:b)-m))),L()[o+24>>>2>>>0]=c.getDay(),p=(uc(c.getFullYear())?lc:dc)[c.getMonth()]+c.getDate()-1|0,L()[o+28>>>2>>>0]=p,L()[o>>>2>>>0]=c.getSeconds(),L()[o+4>>>2>>>0]=c.getMinutes(),L()[o+8>>>2>>>0]=c.getHours(),L()[o+12>>>2>>>0]=c.getDate(),L()[o+16>>>2>>>0]=c.getMonth(),L()[o+20>>>2>>>0]=c.getYear(),o=c.getTime(),BigInt(isNaN(o)?-1:o/1e3)}function cc(o,c,p,m,b,T,C){return d?Ne(16,1,o,c,p,m,b,T,C):-52}function hc(o,c,p,m,b,T){if(d)return Ne(17,1,o,c,p,m,b,T)}var dn={},nb=()=>performance.timeOrigin+performance.now();function pc(o,c){if(d)return Ne(18,1,o,c);if(dn[o]&&(clearTimeout(dn[o].id),delete dn[o]),!c)return 0;var p=setTimeout(()=>{delete dn[o],Ds(()=>Ac(o,performance.timeOrigin+performance.now()))},c);return dn[o]={id:p,rc:c},0}function ab(o,c,p,m){o>>>=0,c>>>=0,p>>>=0,m>>>=0;var b=new Date().getFullYear(),T=new Date(b,0,1).getTimezoneOffset();b=new Date(b,6,1).getTimezoneOffset();var C=Math.max(T,b);Ce()[o>>>2>>>0]=60*C,L()[c>>>2>>>0]=+(T!=b),o=(c=O=>{var P=Math.abs(O);return`UTC${0<=O?"-":"+"}${String(Math.floor(P/60)).padStart(2,"0")}${String(P%60).padStart(2,"0")}`})(T),c=c(b),b<T?(ii(o,p,17),ii(c,m,17)):(ii(o,m,17),ii(c,p,17))}var sb=()=>Date.now();function ob(o,c,p){return 0<=o&&3>=o?(o===0?o=Date.now():o=performance.timeOrigin+performance.now(),G[p>>>0>>>3]=BigInt(Math.round(1e6*o)),0):28}var Fs=[],fc=(o,c)=>{Fs.length=0;for(var p;p=ie()[o++>>>0];){var m=p!=105;c+=(m&=p!=112)&&c%8?4:0,Fs.push(p==112?Ce()[c>>>2>>>0]:p==106?G[c>>>3]:p==105?L()[c>>>2>>>0]:dt()[c>>>3>>>0]),c+=m?8:4}return Fs};function ub(o,c,p){return o>>>=0,c=fc(c>>>0,p>>>0),Gs[o](...c)}function lb(o,c,p){return o>>>=0,c=fc(c>>>0,p>>>0),Gs[o](...c)}var db=()=>{};function cb(o,c){return Se(Ke(o>>>0,c>>>0))}var hb=()=>{throw Br+=1,"unwind"};function pb(){return 4294901760}var fb=()=>navigator.hardwareConcurrency;function mb(){return Mr("Cannot use emscripten_pc_get_function without -sUSE_OFFSET_CONVERTER"),0}function gb(o){o>>>=0;var c=ie().length;if(o<=c||4294901760<o)return!1;for(var p=1;4>=p;p*=2){var m=c*(1+.2/p);m=Math.min(m,o+100663296);e:{m=(Math.min(4294901760,65536*Math.ceil(Math.max(o,m)/65536))-k.buffer.byteLength+65535)/65536|0;try{k.grow(m),ke();var b=1;break e}catch{}b=void 0}if(b)return!0}return!1}var ea=()=>(Mr("Cannot use convertFrameToPC (needed by __builtin_return_address) without -sUSE_OFFSET_CONVERTER"),0),cn={},mc=o=>{o.forEach(c=>{ea()})};function yb(){var o=Error().stack.toString().split(`
`);return o[0]=="Error"&&o.shift(),mc(o),cn.Mb=ea(),cn.dc=o,cn.Mb}function _b(o,c,p){if(o>>>=0,c>>>=0,cn.Mb==o)var m=cn.dc;else(m=Error().stack.toString().split(`
`))[0]=="Error"&&m.shift(),mc(m);for(var b=3;m[b]&&ea()!=o;)++b;for(o=0;o<p&&m[o+b];++o)L()[c+4*o>>>2>>>0]=ea();return o}var Vs,Ws={},gc=()=>{if(!Vs){var o,c={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:(typeof navigator=="object"&&navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8",_:"./this.program"};for(o in Ws)Ws[o]===void 0?delete c[o]:c[o]=Ws[o];var p=[];for(o in c)p.push(`${o}=${c[o]}`);Vs=p}return Vs};function yc(o,c){if(d)return Ne(19,1,o,c);o>>>=0,c>>>=0;var p,m=0,b=0;for(p of gc()){var T=c+m;Ce()[o+b>>>2>>>0]=T,m+=ii(p,T,1/0)+1,b+=4}return 0}function _c(o,c){if(d)return Ne(20,1,o,c);o>>>=0,c>>>=0;var p=gc();for(var m of(Ce()[o>>>2>>>0]=p.length,o=0,p))o+=Ns(m)+1;return Ce()[c>>>2>>>0]=o,0}function bc(o){return d?Ne(21,1,o):52}function wc(o,c,p,m){return d?Ne(22,1,o,c,p,m):52}function vc(o,c,p,m){return d?Ne(23,1,o,c,p,m):70}var bb=[null,[],[]];function $c(o,c,p,m){if(d)return Ne(24,1,o,c,p,m);c>>>=0,p>>>=0,m>>>=0;for(var b=0,T=0;T<p;T++){var C=Ce()[c>>>2>>>0],O=Ce()[c+4>>>2>>>0];c+=8;for(var P=0;P<O;P++){var F=o,H=ie()[C+P>>>0],oe=bb[F];H===0||H===10?((F===1?se:Se)(Ld(oe)),oe.length=0):oe.push(H)}b+=O}return Ce()[m>>>2>>>0]=b,0}d||function(){for(var o=n.numThreads-1;o--;)Bd();Cs.push(()=>{ei++,function(c){d?c():Promise.all(Nr.map(Md)).then(c)}(()=>Ed())})}();for(var xc=Array(256),ta=0;256>ta;++ta)xc[ta]=String.fromCharCode(ta);Jd=xc,br.push(0,1,void 0,1,null,1,!0,1,!1,1),n.count_emval_handles=()=>br.length/2-5-Rs.length,d||(k=new WebAssembly.Memory({initial:256,maximum:65536,shared:!0}),ke()),n.wasmBinary&&(v=n.wasmBinary),n.stackSave=()=>Xs(),n.stackRestore=o=>ia(o),n.stackAlloc=o=>Ks(o),n.setValue=function(o,c,p="i8"){switch(p.endsWith("*")&&(p="*"),p){case"i1":case"i8":j()[o>>>0]=c;break;case"i16":Ze()[o>>>1>>>0]=c;break;case"i32":L()[o>>>2>>>0]=c;break;case"i64":G[o>>>3]=BigInt(c);break;case"float":vt()[o>>>2>>>0]=c;break;case"double":dt()[o>>>3>>>0]=c;break;case"*":Ce()[o>>>2>>>0]=c;break;default:Mr(`invalid type for setValue: ${p}`)}},n.getValue=function(o,c="i8"){switch(c.endsWith("*")&&(c="*"),c){case"i1":case"i8":return j()[o>>>0];case"i16":return Ze()[o>>>1>>>0];case"i32":return L()[o>>>2>>>0];case"i64":return G[o>>>3];case"float":return vt()[o>>>2>>>0];case"double":return dt()[o>>>3>>>0];case"*":return Ce()[o>>>2>>>0];default:Mr(`invalid type for getValue: ${c}`)}},n.UTF8ToString=Ke,n.stringToUTF8=ii,n.lengthBytesUTF8=Ns;var wb=[As,Id,Nd,Ud,Fd,Vd,Wd,Gd,jd,qd,Hd,Kd,Xd,Yd,Zd,Qd,cc,hc,pc,yc,_c,bc,wc,vc,$c],Gs={892060:(o,c,p,m,b)=>{if(n===void 0||!n.Fb)return 1;if((o=Ke(Number(o>>>0))).startsWith("./")&&(o=o.substring(2)),!(o=n.Fb.get(o)))return 2;if(c=Number(c>>>0),p=Number(p>>>0),m=Number(m>>>0),c+p>o.byteLength)return 3;try{let T=o.subarray(c,c+p);switch(b){case 0:ie().set(T,m>>>0);break;case 1:n.mc?n.mc(m,T):n.cc(m,T);break;default:return 4}return 0}catch{return 4}},892884:(o,c,p)=>{n.Pb(o,ie().subarray(c>>>0,c+p>>>0))},892948:()=>n.oc(),892990:o=>{n.Ob(o)},893027:()=>{n.Wb()},893058:()=>{n.Xb()},893087:()=>{n.ac()},893112:o=>n.Vb(o),893145:o=>n.Zb(o),893177:(o,c,p)=>{n.Lb(Number(o),Number(c),Number(p),!0)},893240:(o,c,p)=>{n.Lb(Number(o),Number(c),Number(p))},893297:()=>typeof wasmOffsetConverter<"u",893354:o=>{n.Ab("Abs",o,void 0)},893405:o=>{n.Ab("Neg",o,void 0)},893456:o=>{n.Ab("Floor",o,void 0)},893509:o=>{n.Ab("Ceil",o,void 0)},893561:o=>{n.Ab("Reciprocal",o,void 0)},893619:o=>{n.Ab("Sqrt",o,void 0)},893671:o=>{n.Ab("Exp",o,void 0)},893722:o=>{n.Ab("Erf",o,void 0)},893773:o=>{n.Ab("Sigmoid",o,void 0)},893828:(o,c,p)=>{n.Ab("HardSigmoid",o,{alpha:c,beta:p})},893907:o=>{n.Ab("Log",o,void 0)},893958:o=>{n.Ab("Sin",o,void 0)},894009:o=>{n.Ab("Cos",o,void 0)},894060:o=>{n.Ab("Tan",o,void 0)},894111:o=>{n.Ab("Asin",o,void 0)},894163:o=>{n.Ab("Acos",o,void 0)},894215:o=>{n.Ab("Atan",o,void 0)},894267:o=>{n.Ab("Sinh",o,void 0)},894319:o=>{n.Ab("Cosh",o,void 0)},894371:o=>{n.Ab("Asinh",o,void 0)},894424:o=>{n.Ab("Acosh",o,void 0)},894477:o=>{n.Ab("Atanh",o,void 0)},894530:o=>{n.Ab("Tanh",o,void 0)},894582:o=>{n.Ab("Not",o,void 0)},894633:(o,c,p)=>{n.Ab("Clip",o,{min:c,max:p})},894702:o=>{n.Ab("Clip",o,void 0)},894754:(o,c)=>{n.Ab("Elu",o,{alpha:c})},894812:o=>{n.Ab("Gelu",o,void 0)},894864:o=>{n.Ab("Relu",o,void 0)},894916:(o,c)=>{n.Ab("LeakyRelu",o,{alpha:c})},894980:(o,c)=>{n.Ab("ThresholdedRelu",o,{alpha:c})},895050:(o,c)=>{n.Ab("Cast",o,{to:c})},895108:o=>{n.Ab("Add",o,void 0)},895159:o=>{n.Ab("Sub",o,void 0)},895210:o=>{n.Ab("Mul",o,void 0)},895261:o=>{n.Ab("Div",o,void 0)},895312:o=>{n.Ab("Pow",o,void 0)},895363:o=>{n.Ab("Equal",o,void 0)},895416:o=>{n.Ab("Greater",o,void 0)},895471:o=>{n.Ab("GreaterOrEqual",o,void 0)},895533:o=>{n.Ab("Less",o,void 0)},895585:o=>{n.Ab("LessOrEqual",o,void 0)},895644:(o,c,p,m,b)=>{n.Ab("ReduceMean",o,{keepDims:!!c,noopWithEmptyAxes:!!p,axes:m?Array.from(L().subarray(Number(m)>>>0,Number(b)>>>0)):[]})},895819:(o,c,p,m,b)=>{n.Ab("ReduceMax",o,{keepDims:!!c,noopWithEmptyAxes:!!p,axes:m?Array.from(L().subarray(Number(m)>>>0,Number(b)>>>0)):[]})},895993:(o,c,p,m,b)=>{n.Ab("ReduceMin",o,{keepDims:!!c,noopWithEmptyAxes:!!p,axes:m?Array.from(L().subarray(Number(m)>>>0,Number(b)>>>0)):[]})},896167:(o,c,p,m,b)=>{n.Ab("ReduceProd",o,{keepDims:!!c,noopWithEmptyAxes:!!p,axes:m?Array.from(L().subarray(Number(m)>>>0,Number(b)>>>0)):[]})},896342:(o,c,p,m,b)=>{n.Ab("ReduceSum",o,{keepDims:!!c,noopWithEmptyAxes:!!p,axes:m?Array.from(L().subarray(Number(m)>>>0,Number(b)>>>0)):[]})},896516:(o,c,p,m,b)=>{n.Ab("ReduceL1",o,{keepDims:!!c,noopWithEmptyAxes:!!p,axes:m?Array.from(L().subarray(Number(m)>>>0,Number(b)>>>0)):[]})},896689:(o,c,p,m,b)=>{n.Ab("ReduceL2",o,{keepDims:!!c,noopWithEmptyAxes:!!p,axes:m?Array.from(L().subarray(Number(m)>>>0,Number(b)>>>0)):[]})},896862:(o,c,p,m,b)=>{n.Ab("ReduceLogSum",o,{keepDims:!!c,noopWithEmptyAxes:!!p,axes:m?Array.from(L().subarray(Number(m)>>>0,Number(b)>>>0)):[]})},897039:(o,c,p,m,b)=>{n.Ab("ReduceSumSquare",o,{keepDims:!!c,noopWithEmptyAxes:!!p,axes:m?Array.from(L().subarray(Number(m)>>>0,Number(b)>>>0)):[]})},897219:(o,c,p,m,b)=>{n.Ab("ReduceLogSumExp",o,{keepDims:!!c,noopWithEmptyAxes:!!p,axes:m?Array.from(L().subarray(Number(m)>>>0,Number(b)>>>0)):[]})},897399:o=>{n.Ab("Where",o,void 0)},897452:(o,c,p)=>{n.Ab("Transpose",o,{perm:c?Array.from(L().subarray(Number(c)>>>0,Number(p)>>>0)):[]})},897576:(o,c,p,m)=>{n.Ab("DepthToSpace",o,{blocksize:c,mode:Ke(p),format:m?"NHWC":"NCHW"})},897709:(o,c,p,m)=>{n.Ab("DepthToSpace",o,{blocksize:c,mode:Ke(p),format:m?"NHWC":"NCHW"})},897842:(o,c,p,m,b,T,C,O,P,F,H,oe,me,ve,Qe)=>{n.Ab("ConvTranspose",o,{format:P?"NHWC":"NCHW",autoPad:c,dilations:[p],group:m,kernelShape:[b],pads:[T,C],strides:[O],wIsConst:()=>!!j()[F>>>0],outputPadding:H?Array.from(L().subarray(Number(H)>>>0,Number(oe)>>>0)):[],outputShape:me?Array.from(L().subarray(Number(me)>>>0,Number(ve)>>>0)):[],activation:Ke(Qe)})},898275:(o,c,p,m,b,T,C,O,P,F,H,oe,me,ve)=>{n.Ab("ConvTranspose",o,{format:O?"NHWC":"NCHW",autoPad:c,dilations:Array.from(L().subarray(Number(p)>>>0,2+(Number(p)>>>0)>>>0)),group:m,kernelShape:Array.from(L().subarray(Number(b)>>>0,2+(Number(b)>>>0)>>>0)),pads:Array.from(L().subarray(Number(T)>>>0,4+(Number(T)>>>0)>>>0)),strides:Array.from(L().subarray(Number(C)>>>0,2+(Number(C)>>>0)>>>0)),wIsConst:()=>!!j()[P>>>0],outputPadding:F?Array.from(L().subarray(Number(F)>>>0,Number(H)>>>0)):[],outputShape:oe?Array.from(L().subarray(Number(oe)>>>0,Number(me)>>>0)):[],activation:Ke(ve)})},898936:(o,c,p,m,b,T,C,O,P,F,H,oe,me,ve,Qe)=>{n.Ab("ConvTranspose",o,{format:P?"NHWC":"NCHW",autoPad:c,dilations:[p],group:m,kernelShape:[b],pads:[T,C],strides:[O],wIsConst:()=>!!j()[F>>>0],outputPadding:H?Array.from(L().subarray(Number(H)>>>0,Number(oe)>>>0)):[],outputShape:me?Array.from(L().subarray(Number(me)>>>0,Number(ve)>>>0)):[],activation:Ke(Qe)})},899369:(o,c,p,m,b,T,C,O,P,F,H,oe,me,ve)=>{n.Ab("ConvTranspose",o,{format:O?"NHWC":"NCHW",autoPad:c,dilations:Array.from(L().subarray(Number(p)>>>0,2+(Number(p)>>>0)>>>0)),group:m,kernelShape:Array.from(L().subarray(Number(b)>>>0,2+(Number(b)>>>0)>>>0)),pads:Array.from(L().subarray(Number(T)>>>0,4+(Number(T)>>>0)>>>0)),strides:Array.from(L().subarray(Number(C)>>>0,2+(Number(C)>>>0)>>>0)),wIsConst:()=>!!j()[P>>>0],outputPadding:F?Array.from(L().subarray(Number(F)>>>0,Number(H)>>>0)):[],outputShape:oe?Array.from(L().subarray(Number(oe)>>>0,Number(me)>>>0)):[],activation:Ke(ve)})},900030:(o,c)=>{n.Ab("GlobalAveragePool",o,{format:c?"NHWC":"NCHW"})},900121:(o,c,p,m,b,T,C,O,P,F,H,oe,me,ve)=>{n.Ab("AveragePool",o,{format:ve?"NHWC":"NCHW",auto_pad:c,ceil_mode:p,count_include_pad:m,storage_order:b,dilations:T?Array.from(L().subarray(Number(T)>>>0,Number(C)>>>0)):[],kernel_shape:O?Array.from(L().subarray(Number(O)>>>0,Number(P)>>>0)):[],pads:F?Array.from(L().subarray(Number(F)>>>0,Number(H)>>>0)):[],strides:oe?Array.from(L().subarray(Number(oe)>>>0,Number(me)>>>0)):[]})},900600:(o,c)=>{n.Ab("GlobalAveragePool",o,{format:c?"NHWC":"NCHW"})},900691:(o,c,p,m,b,T,C,O,P,F,H,oe,me,ve)=>{n.Ab("AveragePool",o,{format:ve?"NHWC":"NCHW",auto_pad:c,ceil_mode:p,count_include_pad:m,storage_order:b,dilations:T?Array.from(L().subarray(Number(T)>>>0,Number(C)>>>0)):[],kernel_shape:O?Array.from(L().subarray(Number(O)>>>0,Number(P)>>>0)):[],pads:F?Array.from(L().subarray(Number(F)>>>0,Number(H)>>>0)):[],strides:oe?Array.from(L().subarray(Number(oe)>>>0,Number(me)>>>0)):[]})},901170:(o,c)=>{n.Ab("GlobalMaxPool",o,{format:c?"NHWC":"NCHW"})},901257:(o,c,p,m,b,T,C,O,P,F,H,oe,me,ve)=>{n.Ab("MaxPool",o,{format:ve?"NHWC":"NCHW",auto_pad:c,ceil_mode:p,count_include_pad:m,storage_order:b,dilations:T?Array.from(L().subarray(Number(T)>>>0,Number(C)>>>0)):[],kernel_shape:O?Array.from(L().subarray(Number(O)>>>0,Number(P)>>>0)):[],pads:F?Array.from(L().subarray(Number(F)>>>0,Number(H)>>>0)):[],strides:oe?Array.from(L().subarray(Number(oe)>>>0,Number(me)>>>0)):[]})},901732:(o,c)=>{n.Ab("GlobalMaxPool",o,{format:c?"NHWC":"NCHW"})},901819:(o,c,p,m,b,T,C,O,P,F,H,oe,me,ve)=>{n.Ab("MaxPool",o,{format:ve?"NHWC":"NCHW",auto_pad:c,ceil_mode:p,count_include_pad:m,storage_order:b,dilations:T?Array.from(L().subarray(Number(T)>>>0,Number(C)>>>0)):[],kernel_shape:O?Array.from(L().subarray(Number(O)>>>0,Number(P)>>>0)):[],pads:F?Array.from(L().subarray(Number(F)>>>0,Number(H)>>>0)):[],strides:oe?Array.from(L().subarray(Number(oe)>>>0,Number(me)>>>0)):[]})},902294:(o,c,p,m,b)=>{n.Ab("Gemm",o,{alpha:c,beta:p,transA:m,transB:b})},902398:o=>{n.Ab("MatMul",o,void 0)},902452:(o,c,p,m)=>{n.Ab("ArgMax",o,{keepDims:!!c,selectLastIndex:!!p,axis:m})},902560:(o,c,p,m)=>{n.Ab("ArgMin",o,{keepDims:!!c,selectLastIndex:!!p,axis:m})},902668:(o,c)=>{n.Ab("Softmax",o,{axis:c})},902731:(o,c)=>{n.Ab("Concat",o,{axis:c})},902791:(o,c,p,m,b)=>{n.Ab("Split",o,{axis:c,numOutputs:p,splitSizes:m?Array.from(L().subarray(Number(m)>>>0,Number(b)>>>0)):[]})},902947:o=>{n.Ab("Expand",o,void 0)},903001:(o,c)=>{n.Ab("Gather",o,{axis:Number(c)})},903072:(o,c)=>{n.Ab("GatherElements",o,{axis:Number(c)})},903151:(o,c)=>{n.Ab("GatherND",o,{batch_dims:Number(c)})},903230:(o,c,p,m,b,T,C,O,P,F,H)=>{n.Ab("Resize",o,{antialias:c,axes:p?Array.from(L().subarray(Number(p)>>>0,Number(m)>>>0)):[],coordinateTransformMode:Ke(b),cubicCoeffA:T,excludeOutside:C,extrapolationValue:O,keepAspectRatioPolicy:Ke(P),mode:Ke(F),nearestMode:Ke(H)})},903592:(o,c,p,m,b,T,C)=>{n.Ab("Slice",o,{starts:c?Array.from(L().subarray(Number(c)>>>0,Number(p)>>>0)):[],ends:m?Array.from(L().subarray(Number(m)>>>0,Number(b)>>>0)):[],axes:T?Array.from(L().subarray(Number(T)>>>0,Number(C)>>>0)):[]})},903856:o=>{n.Ab("Tile",o,void 0)},903908:(o,c,p)=>{n.Ab("InstanceNormalization",o,{epsilon:c,format:p?"NHWC":"NCHW"})},904022:(o,c,p)=>{n.Ab("InstanceNormalization",o,{epsilon:c,format:p?"NHWC":"NCHW"})},904136:o=>{n.Ab("Range",o,void 0)},904189:(o,c)=>{n.Ab("Einsum",o,{equation:Ke(c)})},904270:(o,c,p,m,b)=>{n.Ab("Pad",o,{mode:c,value:p,pads:m?Array.from(L().subarray(Number(m)>>>0,Number(b)>>>0)):[]})},904413:(o,c,p,m,b,T)=>{n.Ab("BatchNormalization",o,{epsilon:c,momentum:p,spatial:!!b,trainingMode:!!m,format:T?"NHWC":"NCHW"})},904582:(o,c,p,m,b,T)=>{n.Ab("BatchNormalization",o,{epsilon:c,momentum:p,spatial:!!b,trainingMode:!!m,format:T?"NHWC":"NCHW"})},904751:(o,c,p)=>{n.Ab("CumSum",o,{exclusive:Number(c),reverse:Number(p)})},904848:(o,c,p)=>{n.Ab("DequantizeLinear",o,{axis:c,blockSize:p})},904938:(o,c,p,m,b)=>{n.Ab("GridSample",o,{align_corners:c,mode:Ke(p),padding_mode:Ke(m),format:b?"NHWC":"NCHW"})},905108:(o,c,p,m,b)=>{n.Ab("GridSample",o,{align_corners:c,mode:Ke(p),padding_mode:Ke(m),format:b?"NHWC":"NCHW"})},905278:(o,c)=>{n.Ab("ScatterND",o,{reduction:Ke(c)})},905363:(o,c,p,m,b,T,C,O,P)=>{n.Ab("Attention",o,{numHeads:c,isUnidirectional:p,maskFilterValue:m,scale:b,doRotary:T,qkvHiddenSizes:C?Array.from(L().subarray(Number(O)>>>0,Number(O)+C>>>0)):[],pastPresentShareBuffer:!!P})},905635:o=>{n.Ab("BiasAdd",o,void 0)},905690:o=>{n.Ab("BiasSplitGelu",o,void 0)},905751:o=>{n.Ab("FastGelu",o,void 0)},905807:(o,c,p,m,b,T,C,O,P,F,H,oe,me,ve,Qe,xt)=>{n.Ab("Conv",o,{format:oe?"NHWC":"NCHW",auto_pad:c,dilations:p?Array.from(L().subarray(Number(p)>>>0,Number(m)>>>0)):[],group:b,kernel_shape:T?Array.from(L().subarray(Number(T)>>>0,Number(C)>>>0)):[],pads:O?Array.from(L().subarray(Number(O)>>>0,Number(P)>>>0)):[],strides:F?Array.from(L().subarray(Number(F)>>>0,Number(H)>>>0)):[],w_is_const:()=>!!j()[Number(me)>>>0],activation:Ke(ve),activation_params:Qe?Array.from(vt().subarray(Number(Qe)>>>0,Number(xt)>>>0)):[]})},906391:o=>{n.Ab("Gelu",o,void 0)},906443:(o,c,p,m,b,T,C,O,P)=>{n.Ab("GroupQueryAttention",o,{numHeads:c,kvNumHeads:p,scale:m,softcap:b,doRotary:T,rotaryInterleaved:C,smoothSoftmax:O,localWindowSize:P})},906660:(o,c,p,m)=>{n.Ab("LayerNormalization",o,{axis:c,epsilon:p,simplified:!!m})},906771:(o,c,p,m)=>{n.Ab("LayerNormalization",o,{axis:c,epsilon:p,simplified:!!m})},906882:(o,c,p,m,b,T)=>{n.Ab("MatMulNBits",o,{k:c,n:p,accuracyLevel:m,bits:b,blockSize:T})},907009:(o,c,p,m,b,T)=>{n.Ab("MultiHeadAttention",o,{numHeads:c,isUnidirectional:p,maskFilterValue:m,scale:b,doRotary:T})},907168:(o,c)=>{n.Ab("QuickGelu",o,{alpha:c})},907232:(o,c,p,m,b)=>{n.Ab("RotaryEmbedding",o,{interleaved:!!c,numHeads:p,rotaryEmbeddingDim:m,scale:b})},907371:(o,c,p)=>{n.Ab("SkipLayerNormalization",o,{epsilon:c,simplified:!!p})},907473:(o,c,p)=>{n.Ab("SkipLayerNormalization",o,{epsilon:c,simplified:!!p})},907575:(o,c,p,m)=>{n.Ab("GatherBlockQuantized",o,{gatherAxis:c,quantizeAxis:p,blockSize:m})},907696:o=>{n.$b(o)},907730:(o,c)=>n.bc(Number(o),Number(c),n.Gb.ec,n.Gb.errors)};function vb(o,c,p){return sc(async()=>{await n.Yb(Number(o),Number(c),Number(p))})}function $b(){return typeof wasmOffsetConverter<"u"}var B=await async function(){function o(m,b){return B=m.exports,B=function(){var T=B,C={};for(let[O,P]of Object.entries(T))C[O]=typeof P=="function"?(...F)=>{Zn.push(O);try{return P(...F)}finally{D||(Zn.pop(),or&&Pr===1&&Zn.length===0&&(Pr=0,Br+=1,Yn(Mc),typeof Fibers<"u"&&Fibers.sc()))}}:P;return C}(),B=function(){var T=B,C=P=>F=>P(F)>>>0,O=P=>()=>P()>>>0;return(T=Object.assign({},T)).Ea=C(T.Ea),T.gb=O(T.gb),T.ib=C(T.ib),T.tb=C(T.tb),T.ub=O(T.ub),T.__cxa_get_exception_ptr=C(T.__cxa_get_exception_ptr),T}(),zd.push(B.jb),E=b,Ed(),B}ei++;var c=Sd();if(n.instantiateWasm)return new Promise(m=>{n.instantiateWasm(c,(b,T)=>{m(o(b,T))})});if(d)return new Promise(m=>{Y=b=>{var T=new WebAssembly.Instance(b,Sd());m(o(T,b))}});$t??($t=n.locateFile?n.locateFile?n.locateFile("ort-wasm-simd-threaded.jsep.wasm",$):$+"ort-wasm-simd-threaded.jsep.wasm":new URL("/dev-sandbox/games/emotion/assets/ort-wasm-simd-threaded.jsep-CLmJQkb_.wasm",import.meta.url).href);try{var p=await async function(m){var b=$t;if(!v&&typeof WebAssembly.instantiateStreaming=="function"&&!W(b))try{var T=fetch(b,{credentials:"same-origin"});return await WebAssembly.instantiateStreaming(T,m)}catch(C){Se(`wasm streaming compile failed: ${C}`),Se("falling back to ArrayBuffer instantiation")}return async function(C,O){try{var P=await async function(F){if(!v)try{var H=await y(F);return new Uint8Array(H)}catch{}if(F==$t&&v)F=new Uint8Array(v);else{if(!_)throw"both async and sync fetching of the wasm failed";F=_(F)}return F}(C);return await WebAssembly.instantiate(P,O)}catch(F){Se(`failed to asynchronously prepare wasm: ${F}`),Mr(F)}}(b,m)}(c);return o(p.instance,p.module)}catch(m){return a(m),Promise.reject(m)}}(),Tc=o=>(Tc=B.Ea)(o),kc=()=>(kc=B.Fa)();n._OrtInit=(o,c)=>(n._OrtInit=B.Ga)(o,c),n._OrtGetLastError=(o,c)=>(n._OrtGetLastError=B.Ha)(o,c),n._OrtCreateSessionOptions=(o,c,p,m,b,T,C,O,P,F)=>(n._OrtCreateSessionOptions=B.Ia)(o,c,p,m,b,T,C,O,P,F),n._OrtAppendExecutionProvider=(o,c,p,m,b)=>(n._OrtAppendExecutionProvider=B.Ja)(o,c,p,m,b),n._OrtAddFreeDimensionOverride=(o,c,p)=>(n._OrtAddFreeDimensionOverride=B.Ka)(o,c,p),n._OrtAddSessionConfigEntry=(o,c,p)=>(n._OrtAddSessionConfigEntry=B.La)(o,c,p),n._OrtReleaseSessionOptions=o=>(n._OrtReleaseSessionOptions=B.Ma)(o),n._OrtCreateSession=(o,c,p)=>(n._OrtCreateSession=B.Na)(o,c,p),n._OrtReleaseSession=o=>(n._OrtReleaseSession=B.Oa)(o),n._OrtGetInputOutputCount=(o,c,p)=>(n._OrtGetInputOutputCount=B.Pa)(o,c,p),n._OrtGetInputOutputMetadata=(o,c,p,m)=>(n._OrtGetInputOutputMetadata=B.Qa)(o,c,p,m),n._OrtFree=o=>(n._OrtFree=B.Ra)(o),n._OrtCreateTensor=(o,c,p,m,b,T)=>(n._OrtCreateTensor=B.Sa)(o,c,p,m,b,T),n._OrtGetTensorData=(o,c,p,m,b)=>(n._OrtGetTensorData=B.Ta)(o,c,p,m,b),n._OrtReleaseTensor=o=>(n._OrtReleaseTensor=B.Ua)(o),n._OrtCreateRunOptions=(o,c,p,m)=>(n._OrtCreateRunOptions=B.Va)(o,c,p,m),n._OrtAddRunConfigEntry=(o,c,p)=>(n._OrtAddRunConfigEntry=B.Wa)(o,c,p),n._OrtReleaseRunOptions=o=>(n._OrtReleaseRunOptions=B.Xa)(o),n._OrtCreateBinding=o=>(n._OrtCreateBinding=B.Ya)(o),n._OrtBindInput=(o,c,p)=>(n._OrtBindInput=B.Za)(o,c,p),n._OrtBindOutput=(o,c,p,m)=>(n._OrtBindOutput=B._a)(o,c,p,m),n._OrtClearBoundOutputs=o=>(n._OrtClearBoundOutputs=B.$a)(o),n._OrtReleaseBinding=o=>(n._OrtReleaseBinding=B.ab)(o),n._OrtRunWithBinding=(o,c,p,m,b)=>(n._OrtRunWithBinding=B.bb)(o,c,p,m,b),n._OrtRun=(o,c,p,m,b,T,C,O)=>(n._OrtRun=B.cb)(o,c,p,m,b,T,C,O),n._OrtEndProfiling=o=>(n._OrtEndProfiling=B.db)(o),n._JsepOutput=(o,c,p)=>(n._JsepOutput=B.eb)(o,c,p),n._JsepGetNodeName=o=>(n._JsepGetNodeName=B.fb)(o);var js=()=>(js=B.gb)(),wr=n._free=o=>(wr=n._free=B.hb)(o),ra=n._malloc=o=>(ra=n._malloc=B.ib)(o),qs=(o,c,p,m,b,T)=>(qs=B.kb)(o,c,p,m,b,T),Ec=()=>(Ec=B.lb)(),Sc=(o,c,p,m,b)=>(Sc=B.mb)(o,c,p,m,b),Cc=o=>(Cc=B.nb)(o),Hs=o=>(Hs=B.ob)(o),Ac=(o,c)=>(Ac=B.pb)(o,c),Ic=()=>(Ic=B.qb)(),zc=(o,c)=>(zc=B.rb)(o,c),ia=o=>(ia=B.sb)(o),Ks=o=>(Ks=B.tb)(o),Xs=()=>(Xs=B.ub)(),Oc=n.dynCall_ii=(o,c)=>(Oc=n.dynCall_ii=B.vb)(o,c);n.dynCall_vii=(o,c,p)=>(n.dynCall_vii=B.dynCall_vii)(o,c,p),n.dynCall_iiiii=(o,c,p,m,b)=>(n.dynCall_iiiii=B.dynCall_iiiii)(o,c,p,m,b),n.dynCall_iii=(o,c,p)=>(n.dynCall_iii=B.dynCall_iii)(o,c,p),n.dynCall_iiiiii=(o,c,p,m,b,T)=>(n.dynCall_iiiiii=B.dynCall_iiiiii)(o,c,p,m,b,T),n.dynCall_iiiiiiii=(o,c,p,m,b,T,C,O)=>(n.dynCall_iiiiiiii=B.dynCall_iiiiiiii)(o,c,p,m,b,T,C,O),n.dynCall_iiiiiii=(o,c,p,m,b,T,C)=>(n.dynCall_iiiiiii=B.dynCall_iiiiiii)(o,c,p,m,b,T,C),n.dynCall_vi=(o,c)=>(n.dynCall_vi=B.dynCall_vi)(o,c),n.dynCall_iiii=(o,c,p,m)=>(n.dynCall_iiii=B.dynCall_iiii)(o,c,p,m),n.dynCall_i=o=>(n.dynCall_i=B.dynCall_i)(o),n.dynCall_viiiiiiii=(o,c,p,m,b,T,C,O,P)=>(n.dynCall_viiiiiiii=B.dynCall_viiiiiiii)(o,c,p,m,b,T,C,O,P),n.dynCall_viii=(o,c,p,m)=>(n.dynCall_viii=B.dynCall_viii)(o,c,p,m),n.dynCall_viijj=(o,c,p,m,b)=>(n.dynCall_viijj=B.dynCall_viijj)(o,c,p,m,b),n.dynCall_viiiiii=(o,c,p,m,b,T,C)=>(n.dynCall_viiiiii=B.dynCall_viiiiii)(o,c,p,m,b,T,C),n.dynCall_viiii=(o,c,p,m,b)=>(n.dynCall_viiii=B.dynCall_viiii)(o,c,p,m,b),n.dynCall_viiiii=(o,c,p,m,b,T)=>(n.dynCall_viiiii=B.dynCall_viiiii)(o,c,p,m,b,T),n.dynCall_vfiii=(o,c,p,m,b)=>(n.dynCall_vfiii=B.dynCall_vfiii)(o,c,p,m,b),n.dynCall_viiiiff=(o,c,p,m,b,T,C)=>(n.dynCall_viiiiff=B.dynCall_viiiiff)(o,c,p,m,b,T,C),n.dynCall_viiiiiff=(o,c,p,m,b,T,C,O)=>(n.dynCall_viiiiiff=B.dynCall_viiiiiff)(o,c,p,m,b,T,C,O),n.dynCall_ffff=(o,c,p,m)=>(n.dynCall_ffff=B.dynCall_ffff)(o,c,p,m),n.dynCall_viiff=(o,c,p,m,b)=>(n.dynCall_viiff=B.dynCall_viiff)(o,c,p,m,b),n.dynCall_fffffff=(o,c,p,m,b,T,C)=>(n.dynCall_fffffff=B.dynCall_fffffff)(o,c,p,m,b,T,C),n.dynCall_jjjjjjj=(o,c,p,m,b,T,C)=>(n.dynCall_jjjjjjj=B.dynCall_jjjjjjj)(o,c,p,m,b,T,C),n.dynCall_jjjjjj=(o,c,p,m,b,T)=>(n.dynCall_jjjjjj=B.dynCall_jjjjjj)(o,c,p,m,b,T),n.dynCall_iijjii=(o,c,p,m,b,T)=>(n.dynCall_iijjii=B.dynCall_iijjii)(o,c,p,m,b,T),n.dynCall_viiiiiiiiiiiii=(o,c,p,m,b,T,C,O,P,F,H,oe,me,ve)=>(n.dynCall_viiiiiiiiiiiii=B.dynCall_viiiiiiiiiiiii)(o,c,p,m,b,T,C,O,P,F,H,oe,me,ve),n.dynCall_viiiiiiiiii=(o,c,p,m,b,T,C,O,P,F,H)=>(n.dynCall_viiiiiiiiii=B.dynCall_viiiiiiiiii)(o,c,p,m,b,T,C,O,P,F,H),n.dynCall_viiiiiiiiiii=(o,c,p,m,b,T,C,O,P,F,H,oe)=>(n.dynCall_viiiiiiiiiii=B.dynCall_viiiiiiiiiii)(o,c,p,m,b,T,C,O,P,F,H,oe),n.dynCall_viiiiiiiiiiii=(o,c,p,m,b,T,C,O,P,F,H,oe,me)=>(n.dynCall_viiiiiiiiiiii=B.dynCall_viiiiiiiiiiii)(o,c,p,m,b,T,C,O,P,F,H,oe,me),n.dynCall_viiiiiiiiiiiiiiiiii=(o,c,p,m,b,T,C,O,P,F,H,oe,me,ve,Qe,xt,vr,ni,hn)=>(n.dynCall_viiiiiiiiiiiiiiiiii=B.dynCall_viiiiiiiiiiiiiiiiii)(o,c,p,m,b,T,C,O,P,F,H,oe,me,ve,Qe,xt,vr,ni,hn),n.dynCall_viiiiiiiii=(o,c,p,m,b,T,C,O,P,F)=>(n.dynCall_viiiiiiiii=B.dynCall_viiiiiiiii)(o,c,p,m,b,T,C,O,P,F),n.dynCall_viiiiiiiiiiiiiiiiiii=(o,c,p,m,b,T,C,O,P,F,H,oe,me,ve,Qe,xt,vr,ni,hn,Ys)=>(n.dynCall_viiiiiiiiiiiiiiiiiii=B.dynCall_viiiiiiiiiiiiiiiiiii)(o,c,p,m,b,T,C,O,P,F,H,oe,me,ve,Qe,xt,vr,ni,hn,Ys),n.dynCall_viiiiiii=(o,c,p,m,b,T,C,O)=>(n.dynCall_viiiiiii=B.dynCall_viiiiiii)(o,c,p,m,b,T,C,O),n.dynCall_viiiiiiiiiiiiiii=(o,c,p,m,b,T,C,O,P,F,H,oe,me,ve,Qe,xt)=>(n.dynCall_viiiiiiiiiiiiiii=B.dynCall_viiiiiiiiiiiiiii)(o,c,p,m,b,T,C,O,P,F,H,oe,me,ve,Qe,xt),n.dynCall_jiji=(o,c,p,m)=>(n.dynCall_jiji=B.dynCall_jiji)(o,c,p,m),n.dynCall_v=o=>(n.dynCall_v=B.dynCall_v)(o),n.dynCall_iidiiii=(o,c,p,m,b,T,C)=>(n.dynCall_iidiiii=B.dynCall_iidiiii)(o,c,p,m,b,T,C),n.dynCall_iiiiiiiii=(o,c,p,m,b,T,C,O,P)=>(n.dynCall_iiiiiiiii=B.dynCall_iiiiiiiii)(o,c,p,m,b,T,C,O,P),n.dynCall_iiij=(o,c,p,m)=>(n.dynCall_iiij=B.dynCall_iiij)(o,c,p,m),n.dynCall_iiiiiiiiii=(o,c,p,m,b,T,C,O,P,F)=>(n.dynCall_iiiiiiiiii=B.dynCall_iiiiiiiiii)(o,c,p,m,b,T,C,O,P,F),n.dynCall_iiiiiiiiiiiii=(o,c,p,m,b,T,C,O,P,F,H,oe,me)=>(n.dynCall_iiiiiiiiiiiii=B.dynCall_iiiiiiiiiiiii)(o,c,p,m,b,T,C,O,P,F,H,oe,me),n.dynCall_iiiiiiiiiii=(o,c,p,m,b,T,C,O,P,F,H)=>(n.dynCall_iiiiiiiiiii=B.dynCall_iiiiiiiiiii)(o,c,p,m,b,T,C,O,P,F,H),n.dynCall_ji=(o,c)=>(n.dynCall_ji=B.dynCall_ji)(o,c),n.dynCall_iijii=(o,c,p,m,b)=>(n.dynCall_iijii=B.dynCall_iijii)(o,c,p,m,b),n.dynCall_vij=(o,c,p)=>(n.dynCall_vij=B.dynCall_vij)(o,c,p),n.dynCall_viiijii=(o,c,p,m,b,T,C)=>(n.dynCall_viiijii=B.dynCall_viiijii)(o,c,p,m,b,T,C),n.dynCall_viijiiiiiiiiiiiiii=(o,c,p,m,b,T,C,O,P,F,H,oe,me,ve,Qe,xt,vr,ni)=>(n.dynCall_viijiiiiiiiiiiiiii=B.dynCall_viijiiiiiiiiiiiiii)(o,c,p,m,b,T,C,O,P,F,H,oe,me,ve,Qe,xt,vr,ni),n.dynCall_viiiji=(o,c,p,m,b,T)=>(n.dynCall_viiiji=B.dynCall_viiiji)(o,c,p,m,b,T),n.dynCall_fiii=(o,c,p,m)=>(n.dynCall_fiii=B.dynCall_fiii)(o,c,p,m),n.dynCall_viijii=(o,c,p,m,b,T)=>(n.dynCall_viijii=B.dynCall_viijii)(o,c,p,m,b,T),n.dynCall_viij=(o,c,p,m)=>(n.dynCall_viij=B.dynCall_viij)(o,c,p,m),n.dynCall_jiij=(o,c,p,m)=>(n.dynCall_jiij=B.dynCall_jiij)(o,c,p,m),n.dynCall_fi=(o,c)=>(n.dynCall_fi=B.dynCall_fi)(o,c),n.dynCall_fii=(o,c,p)=>(n.dynCall_fii=B.dynCall_fii)(o,c,p),n.dynCall_jii=(o,c,p)=>(n.dynCall_jii=B.dynCall_jii)(o,c,p),n.dynCall_dii=(o,c,p)=>(n.dynCall_dii=B.dynCall_dii)(o,c,p),n.dynCall_fiiii=(o,c,p,m,b)=>(n.dynCall_fiiii=B.dynCall_fiiii)(o,c,p,m,b),n.dynCall_fif=(o,c,p)=>(n.dynCall_fif=B.dynCall_fif)(o,c,p),n.dynCall_jfi=(o,c,p)=>(n.dynCall_jfi=B.dynCall_jfi)(o,c,p),n.dynCall_viiiiiiiiiiiiii=(o,c,p,m,b,T,C,O,P,F,H,oe,me,ve,Qe)=>(n.dynCall_viiiiiiiiiiiiii=B.dynCall_viiiiiiiiiiiiii)(o,c,p,m,b,T,C,O,P,F,H,oe,me,ve,Qe),n.dynCall_viiiiiiiiiiiiiiiiiiii=(o,c,p,m,b,T,C,O,P,F,H,oe,me,ve,Qe,xt,vr,ni,hn,Ys,xb)=>(n.dynCall_viiiiiiiiiiiiiiiiiiii=B.dynCall_viiiiiiiiiiiiiiiiiiii)(o,c,p,m,b,T,C,O,P,F,H,oe,me,ve,Qe,xt,vr,ni,hn,Ys,xb),n.dynCall_viiiiiiiiiiiiiiii=(o,c,p,m,b,T,C,O,P,F,H,oe,me,ve,Qe,xt,vr)=>(n.dynCall_viiiiiiiiiiiiiiii=B.dynCall_viiiiiiiiiiiiiiii)(o,c,p,m,b,T,C,O,P,F,H,oe,me,ve,Qe,xt,vr),n.dynCall_iif=(o,c,p)=>(n.dynCall_iif=B.dynCall_iif)(o,c,p),n.dynCall_jiiii=(o,c,p,m,b)=>(n.dynCall_jiiii=B.dynCall_jiiii)(o,c,p,m,b),n.dynCall_jiii=(o,c,p,m)=>(n.dynCall_jiii=B.dynCall_jiii)(o,c,p,m),n.dynCall_viif=(o,c,p,m)=>(n.dynCall_viif=B.dynCall_viif)(o,c,p,m),n.dynCall_viiij=(o,c,p,m,b)=>(n.dynCall_viiij=B.dynCall_viiij)(o,c,p,m,b),n.dynCall_viiiijii=(o,c,p,m,b,T,C,O)=>(n.dynCall_viiiijii=B.dynCall_viiiijii)(o,c,p,m,b,T,C,O),n.dynCall_iiiiij=(o,c,p,m,b,T)=>(n.dynCall_iiiiij=B.dynCall_iiiiij)(o,c,p,m,b,T),n.dynCall_iiiiid=(o,c,p,m,b,T)=>(n.dynCall_iiiiid=B.dynCall_iiiiid)(o,c,p,m,b,T),n.dynCall_iiiiijj=(o,c,p,m,b,T,C)=>(n.dynCall_iiiiijj=B.dynCall_iiiiijj)(o,c,p,m,b,T,C),n.dynCall_iiiiiijj=(o,c,p,m,b,T,C,O)=>(n.dynCall_iiiiiijj=B.dynCall_iiiiiijj)(o,c,p,m,b,T,C,O);var Rc=o=>(Rc=B.wb)(o),Mc=()=>(Mc=B.xb)(),Bc=o=>(Bc=B.yb)(o),Nc=()=>(Nc=B.zb)();return function o(){if(0<ei)ti=o;else if(d)i(n),Pe();else{for(;0<Cs.length;)Cs.shift()(n);0<ei?ti=o:(n.calledRun=!0,D||(Pe(),i(n)))}}(),n.PTR_SIZE=4,s},Wg=_o,Kh=(t=(e=globalThis.self)==null?void 0:e.name)==null?void 0:t.startsWith("em-pthread"),Kh&&_o()}),bo,Cu,Xh,Ct,Gg,da,Yh,Zh,wo,Qh,vo,jg,$o,qg,ed=U(()=>{Jl(),bo=typeof location>"u"?void 0:location.origin,Cu=import.meta.url>"file:"&&import.meta.url<"file;",Xh=()=>{{if(Cu){let e=URL;return new URL(new e("ort.bundle.min.mjs",import.meta.url).href,bo).href}return import.meta.url}},Ct=Xh(),Gg=()=>{if(Ct&&!Ct.startsWith("blob:"))return Ct.substring(0,Ct.lastIndexOf("/")+1)},da=(e,t)=>{try{let r=t??Ct;return(r?new URL(e,r):new URL(e)).origin===bo}catch{return!1}},Yh=(e,t)=>{let r=t??Ct;try{return(r?new URL(e,r):new URL(e)).href}catch{return}},Zh=(e,t)=>`${t??"./"}${e}`,wo=async e=>{let t=await(await fetch(e,{credentials:"same-origin"})).blob();return URL.createObjectURL(t)},Qh=async e=>(await import(e)).default,vo=(x4(),Fn(Ug)).default,jg=async()=>{if(!Ct)throw new Error("Failed to load proxy worker: cannot determine the script source URL.");if(da(Ct))return[void 0,vo()];let e=await wo(Ct);return[e,vo(e)]},$o=(T4(),Fn(Vg)).default,qg=async(e,t,r,i)=>{let a=$o&&!(e||t);if(a)if(Ct)a=da(Ct);else if(i&&!r)a=!0;else throw new Error("cannot determine the script source URL.");if(a)return[void 0,$o];{let n="ort-wasm-simd-threaded.jsep.mjs",s=e??Yh(n,t),u=r&&s&&!da(s,t),l=u?await wo(s):s??Zh(n,t);return[u?l:void 0,await Qh(l)]}}}),xo,ca,gn,To,Jh,ep,tp,td,Oe,Ei=U(()=>{ed(),ca=!1,gn=!1,To=!1,Jh=()=>{if(typeof SharedArrayBuffer>"u")return!1;try{return typeof MessageChannel<"u"&&new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)),WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,4,1,3,1,1,10,11,1,9,0,65,0,254,16,2,0,26,11]))}catch{return!1}},ep=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,30,1,28,0,65,0,253,15,253,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,253,186,1,26,11]))}catch{return!1}},tp=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,19,1,17,0,65,1,253,15,65,2,253,15,65,3,253,15,253,147,2,11]))}catch{return!1}},td=async e=>{if(ca)return Promise.resolve();if(gn)throw new Error("multiple calls to 'initializeWebAssembly()' detected.");if(To)throw new Error("previous call to 'initializeWebAssembly()' failed.");gn=!0;let t=e.initTimeout,r=e.numThreads;if(e.simd!==!1){if(e.simd==="relaxed"){if(!tp())throw new Error("Relaxed WebAssembly SIMD is not supported in the current environment.")}else if(!ep())throw new Error("WebAssembly SIMD is not supported in the current environment.")}let i=Jh();r>1&&!i&&(typeof self<"u"&&!self.crossOriginIsolated&&console.warn("env.wasm.numThreads is set to "+r+", but this will not work unless you enable crossOriginIsolated mode. See https://web.dev/cross-origin-isolation-guide/ for more info."),console.warn("WebAssembly multi-threading is not supported in the current environment. Falling back to single-threading."),e.numThreads=r=1);let a=e.wasmPaths,n=typeof a=="string"?a:void 0,s=a==null?void 0:a.mjs,u=(s==null?void 0:s.href)??s,l=a==null?void 0:a.wasm,d=(l==null?void 0:l.href)??l,h=e.wasmBinary,[f,g]=await qg(u,n,r>1,!!h||!!d),y=!1,_=[];if(t>0&&_.push(new Promise(w=>{setTimeout(()=>{y=!0,w()},t)})),_.push(new Promise((w,x)=>{let $={numThreads:r};if(h)$.wasmBinary=h;else if(d||n)$.locateFile=v=>d??n+v;else if(u&&u.indexOf("blob:")!==0)$.locateFile=v=>new URL(v,u).href;else if(f){let v=Gg();v&&($.locateFile=k=>v+k)}g($).then(v=>{gn=!1,ca=!0,xo=v,w(),f&&URL.revokeObjectURL(f)},v=>{gn=!1,To=!0,x(v)})})),await Promise.race(_),y)throw new Error(`WebAssembly backend initializing failed due to timeout: ${t}ms`)},Oe=()=>{if(ca&&xo)return xo;throw new Error("WebAssembly is not initialized yet.")}}),Qt,ja,Ee,rd=U(()=>{Ei(),Qt=(e,t)=>{let r=Oe(),i=r.lengthBytesUTF8(e)+1,a=r._malloc(i);return r.stringToUTF8(e,a,i),t.push(a),a},ja=(e,t,r,i)=>{if(typeof e=="object"&&e!==null){if(r.has(e))throw new Error("Circular reference in options");r.add(e)}Object.entries(e).forEach(([a,n])=>{let s=t?t+a:a;if(typeof n=="object")ja(n,s+".",r,i);else if(typeof n=="string"||typeof n=="number")i(s,n.toString());else if(typeof n=="boolean")i(s,n?"1":"0");else throw new Error(`Can't handle extra config type: ${typeof n}`)})},Ee=e=>{let t=Oe(),r=t.stackSave();try{let i=t.PTR_SIZE,a=t.stackAlloc(2*i);t._OrtGetLastError(a,a+i);let n=Number(t.getValue(a,i===4?"i32":"i64")),s=t.getValue(a+i,"*"),u=s?t.UTF8ToString(s):"";throw new Error(`${e} ERROR_CODE: ${n}, ERROR_MESSAGE: ${u}`)}finally{t.stackRestore(r)}}}),Hg,k4=U(()=>{Ei(),rd(),Hg=e=>{let t=Oe(),r=0,i=[],a=e||{};try{if((e==null?void 0:e.logSeverityLevel)===void 0)a.logSeverityLevel=2;else if(typeof e.logSeverityLevel!="number"||!Number.isInteger(e.logSeverityLevel)||e.logSeverityLevel<0||e.logSeverityLevel>4)throw new Error(`log severity level is not valid: ${e.logSeverityLevel}`);if((e==null?void 0:e.logVerbosityLevel)===void 0)a.logVerbosityLevel=0;else if(typeof e.logVerbosityLevel!="number"||!Number.isInteger(e.logVerbosityLevel))throw new Error(`log verbosity level is not valid: ${e.logVerbosityLevel}`);(e==null?void 0:e.terminate)===void 0&&(a.terminate=!1);let n=0;return(e==null?void 0:e.tag)!==void 0&&(n=Qt(e.tag,i)),r=t._OrtCreateRunOptions(a.logSeverityLevel,a.logVerbosityLevel,!!a.terminate,n),r===0&&Ee("Can't create run options."),(e==null?void 0:e.extra)!==void 0&&ja(e.extra,"",new WeakSet,(s,u)=>{let l=Qt(s,i),d=Qt(u,i);t._OrtAddRunConfigEntry(r,l,d)!==0&&Ee(`Can't set a run config entry: ${s} - ${u}.`)}),[r,i]}catch(n){throw r!==0&&t._OrtReleaseRunOptions(r),i.forEach(s=>t._free(s)),n}}}),rp,ip,np,yn,ap,Kg,E4=U(()=>{Ei(),rd(),rp=e=>{switch(e){case"disabled":return 0;case"basic":return 1;case"extended":return 2;case"layout":return 3;case"all":return 99;default:throw new Error(`unsupported graph optimization level: ${e}`)}},ip=e=>{switch(e){case"sequential":return 0;case"parallel":return 1;default:throw new Error(`unsupported execution mode: ${e}`)}},np=e=>{e.extra||(e.extra={}),e.extra.session||(e.extra.session={});let t=e.extra.session;t.use_ort_model_bytes_directly||(t.use_ort_model_bytes_directly="1"),e.executionProviders&&e.executionProviders.some(r=>(typeof r=="string"?r:r.name)==="webgpu")&&(e.enableMemPattern=!1)},yn=(e,t,r,i)=>{let a=Qt(t,i),n=Qt(r,i);Oe()._OrtAddSessionConfigEntry(e,a,n)!==0&&Ee(`Can't set a session config entry: ${t} - ${r}.`)},ap=async(e,t,r)=>{for(let i of t){let a=typeof i=="string"?i:i.name,n=[];switch(a){case"webnn":if(a="WEBNN",typeof i!="string"){let h=i==null?void 0:i.deviceType;h&&yn(e,"deviceType",h,r)}break;case"webgpu":if(a="JS",typeof i!="string"){let h=i;if(h!=null&&h.preferredLayout){if(h.preferredLayout!=="NCHW"&&h.preferredLayout!=="NHWC")throw new Error(`preferredLayout must be either 'NCHW' or 'NHWC': ${h.preferredLayout}`);yn(e,"preferredLayout",h.preferredLayout,r)}}break;case"wasm":case"cpu":continue;default:throw new Error(`not supported execution provider: ${a}`)}let s=Qt(a,r),u=n.length,l=0,d=0;if(u>0){l=Oe()._malloc(u*Oe().PTR_SIZE),r.push(l),d=Oe()._malloc(u*Oe().PTR_SIZE),r.push(d);for(let h=0;h<u;h++)Oe().setValue(l+h*Oe().PTR_SIZE,n[h][0],"*"),Oe().setValue(d+h*Oe().PTR_SIZE,n[h][1],"*")}await Oe()._OrtAppendExecutionProvider(e,s,l,d,u)!==0&&Ee(`Can't append execution provider: ${a}.`)}},Kg=async e=>{let t=Oe(),r=0,i=[],a=e||{};np(a);try{let n=rp(a.graphOptimizationLevel??"all"),s=ip(a.executionMode??"sequential"),u=typeof a.logId=="string"?Qt(a.logId,i):0,l=a.logSeverityLevel??2;if(!Number.isInteger(l)||l<0||l>4)throw new Error(`log severity level is not valid: ${l}`);let d=a.logVerbosityLevel??0;if(!Number.isInteger(d)||d<0||d>4)throw new Error(`log verbosity level is not valid: ${d}`);let h=typeof a.optimizedModelFilePath=="string"?Qt(a.optimizedModelFilePath,i):0;if(r=t._OrtCreateSessionOptions(n,!!a.enableCpuMemArena,!!a.enableMemPattern,s,!!a.enableProfiling,0,u,l,d,h),r===0&&Ee("Can't create session options."),a.executionProviders&&await ap(r,a.executionProviders,i),a.enableGraphCapture!==void 0){if(typeof a.enableGraphCapture!="boolean")throw new Error(`enableGraphCapture must be a boolean value: ${a.enableGraphCapture}`);yn(r,"enableGraphCapture",a.enableGraphCapture.toString(),i)}if(a.freeDimensionOverrides)for(let[f,g]of Object.entries(a.freeDimensionOverrides)){if(typeof f!="string")throw new Error(`free dimension override name must be a string: ${f}`);if(typeof g!="number"||!Number.isInteger(g)||g<0)throw new Error(`free dimension override value must be a non-negative integer: ${g}`);let y=Qt(f,i);t._OrtAddFreeDimensionOverride(r,y,g)!==0&&Ee(`Can't set a free dimension override: ${f} - ${g}.`)}return a.extra!==void 0&&ja(a.extra,"",new WeakSet,(f,g)=>{yn(r,f,g,i)}),[r,i]}catch(n){throw r!==0&&t._OrtReleaseSessionOptions(r)!==0&&Ee("Can't release session options."),i.forEach(s=>t._free(s)),n}}}),pi,kr,fi,Es,qa,id,nd,Au,le=U(()=>{pi=e=>{switch(e){case"int8":return 3;case"uint8":return 2;case"bool":return 9;case"int16":return 5;case"uint16":return 4;case"int32":return 6;case"uint32":return 12;case"float16":return 10;case"float32":return 1;case"float64":return 11;case"string":return 8;case"int64":return 7;case"uint64":return 13;case"int4":return 22;case"uint4":return 21;default:throw new Error(`unsupported data type: ${e}`)}},kr=e=>{switch(e){case 3:return"int8";case 2:return"uint8";case 9:return"bool";case 5:return"int16";case 4:return"uint16";case 6:return"int32";case 12:return"uint32";case 10:return"float16";case 1:return"float32";case 11:return"float64";case 8:return"string";case 7:return"int64";case 13:return"uint64";case 22:return"int4";case 21:return"uint4";default:throw new Error(`unsupported data type: ${e}`)}},fi=(e,t)=>{let r=[-1,4,1,1,2,2,4,8,-1,1,2,8,4,8,-1,-1,-1,-1,-1,-1,-1,.5,.5][e],i=typeof t=="number"?t:t.reduce((a,n)=>a*n,1);return r>0?Math.ceil(i*r):void 0},Es=e=>{switch(e){case"float16":return typeof Float16Array<"u"&&Float16Array.from?Float16Array:Uint16Array;case"float32":return Float32Array;case"uint8":return Uint8Array;case"int8":return Int8Array;case"uint16":return Uint16Array;case"int16":return Int16Array;case"int32":return Int32Array;case"bool":return Uint8Array;case"float64":return Float64Array;case"uint32":return Uint32Array;case"int64":return BigInt64Array;case"uint64":return BigUint64Array;default:throw new Error(`unsupported type: ${e}`)}},qa=e=>{switch(e){case"verbose":return 0;case"info":return 1;case"warning":return 2;case"error":return 3;case"fatal":return 4;default:throw new Error(`unsupported logging level: ${e}`)}},id=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",nd=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint64"||e==="int8"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",Au=e=>{switch(e){case"none":return 0;case"cpu":return 1;case"cpu-pinned":return 2;case"texture":return 3;case"gpu-buffer":return 4;case"ml-tensor":return 5;default:throw new Error(`unsupported data location: ${e}`)}}}),ad,Xg=U(()=>{Jl(),ad=async e=>{if(typeof e=="string"){let t=await fetch(e);if(!t.ok)throw new Error(`failed to load external data file: ${e}`);let r=t.headers.get("Content-Length"),i=r?parseInt(r,10):0;if(i<1073741824)return new Uint8Array(await t.arrayBuffer());{if(!t.body)throw new Error(`failed to load external data file: ${e}, no response body.`);let a=t.body.getReader(),n;try{n=new ArrayBuffer(i)}catch(u){if(u instanceof RangeError){let l=Math.ceil(i/65536);n=new WebAssembly.Memory({initial:l,maximum:l}).buffer}else throw u}let s=0;for(;;){let{done:u,value:l}=await a.read();if(u)break;let d=l.byteLength;new Uint8Array(n,s,d).set(l),s+=d}return new Uint8Array(n,0,i)}}else return e instanceof Blob?new Uint8Array(await e.arrayBuffer()):e instanceof Uint8Array?e:new Uint8Array(e)}}),sp,op,up,lp,sd,dp,ye,Rr=U(()=>{le(),sp=["V","I","W","E","F"],op=(e,t)=>{console.log(`[${sp[e]},${new Date().toISOString()}]${t}`)},sd=(e,t)=>{up=e,lp=t},dp=(e,t)=>{let r=qa(e),i=qa(up);r>=i&&op(r,typeof t=="function"?t():t)},ye=(...e)=>{lp&&dp(...e)}}),cp,Zi,R,Ha,Yg,Zg,Qg,he=U(()=>{cp=class{static calcMatMulShape(e,t){return e[1]!==t[0]?void 0:[e[0],t[1]]}},Zi=class{static calcShape(e,t,r=!1){let i=e.length,a=t.length;if(i===0)return t;if(a===0)return e;let n=Math.max(e.length,t.length),s=new Array(n);if(r){if(i<2||a<2)return;let u=cp.calcMatMulShape([e[i-2],e[i-1]],[t[a-2],t[a-1]]);if(u===void 0)return;[s[n-2],s[n-1]]=u}for(let u=r?3:1;u<=n;u++){let l=i-u<0?1:e[i-u],d=a-u<0?1:t[a-u];if(l!==d&&l>1&&d>1)return;let h=Math.max(l,d);if(l&&d)s[n-u]=Math.max(l,d);else{if(h>1)return;s[n-u]=0}}return s}static isValidBroadcast(e,t){let r=e.length,i=t.length;if(r>i)return!1;for(let a=1;a<=r;a++)if(e[r-a]!==1&&e[r-a]!==t[i-a])return!1;return!0}},R=class Oa{static size(t){return Oa.getSizeFromDimensionRange(t,0,t.length)}static convertShape(t,r=4){let i=t.length;if(i===0)return[];let a=new Array(i),n=i-1;for(;n>=0;){if(t[n]%r===0){a[n]=t[n]/r;break}if(r%t[n]!==0)throw new Error("cannot convert shape");a[n]=1,r/=t[n],n--}for(n--;n>=0;n--)a[n]=t[n];return a}static sizeFromDimension(t,r){if(r<0||r>t.length)throw new Error(`invalid dimension of ${r} for sizeFromDimension as Tensor has ${t.length} dimensions.`);return Oa.getSizeFromDimensionRange(t,r,t.length)}static sizeToDimension(t,r){if(r<0||r>t.length)throw new Error(`invalid dimension of ${r} for sizeToDimension as Tensor has ${t.length} dimensions.`);return Oa.getSizeFromDimensionRange(t,0,r)}static getSizeFromDimensionRange(t,r,i){let a=1;for(let n=r;n<i;n++){if(t[n]<0)throw new Error("cannot get valid size from specified dimension range. Most likely the range contains negative values in them.");a*=Number(t[n])}return a}static computeStrides(t){let r=t.length;if(r===0)return[];if(r===1)return[1];let i=new Array(r);i[r-1]=1,i[r-2]=t[r-1];for(let a=r-3;a>=0;--a)i[a]=i[a+1]*t[a+1];return i}static normalizeAxis(t,r){if(t<-r&&t>=r)throw new Error("unsupported axis for this operation.");return t<0?t+r:t}static normalizeAxes(t,r){return t.map(i=>this.normalizeAxis(i,r??t.length))}static sortBasedOnPerm(t,r){return r?r.map(i=>t[i]):t.slice().reverse()}static padShape(t,r){let i=t.length;return t.map((a,n)=>a+r[n]+r[n+i])}static areEqual(t,r){return t.length!==r.length?!1:t.every((i,a)=>i===r[a])}},Ha=class In{static adjustPoolAttributes(t,r,i,a,n,s){if(!t&&i.length!==r.length-2)throw new Error("length of specified kernel shapes should be 2 less than length of input dimensions");if(t)for(let u=0;u<r.length-2;u++)u>=i.length?i.push(r[u+2]):i[u]=r[u+2];for(let u=0;u<i.length;u++)if(u<a.length){if(a[u]<0)throw new Error("strides should be greater than or equal to 1")}else a.push(1);for(let u=0;u<i.length;u++)if(u<n.length){if(n[u]<0)throw new Error("dilations should be greater than or equal to 1")}else n.push(1);for(let u=0;u<i.length*2;u++)if(u<s.length){if(s[u]<0)throw new Error("pad should be greater than or equal to 1")}else s.push(0);for(let u=0;u<i.length;u++){if(i[u]<=0)throw new Error("kernel shapes need to be greater than 0");if(s[u]>=i[u]||s[u+i.length]>=i[u])throw new Error("pads should be smaller than kernel")}}static adjustPadsBasedOnAutoPad(t,r,i,a,n,s,u){if(u){if(n.length!==2*(t.length-2))throw new Error("length of pads should be twice the length of data dimensions");if(r.length!==t.length-2)throw new Error("length of strides should be the length of data dimensions");if(a.length!==t.length-2)throw new Error("length of kernel shapes should be the length of data dimensions");for(let l=0;l<t.length-2;l++)In.adjustPadAndReturnShape(t[l+(s?1:2)],r[l],i[l],a[l],n,l,l+t.length-2,u)}}static computePoolOutputShape(t,r,i,a,n,s,u){if(r.length<=0)throw new Error("input shape must be of size greater than 0");let l=[r[0],r[1]];return In.computeShapeHelper(t,r,l,i,a,n,s,u),l}static computeConvOutputShape(t,r,i,a,n,s,u){if(t.length<=0||r.length<=0)throw new Error("invalid input tensor dims or invalid filter tensor dims");let l=[t[0],r[0]];return In.computeShapeHelper(!1,t,l,i,a,n,s,u),l}static computeShapeHelper(t,r,i,a,n,s,u,l){if(t)for(let d=0;d<r.length-2;d++)i.push(1);else for(let d=0;d<r.length-2;d++)i.push(In.adjustPadAndReturnShape(r[d+2],a[d],n[d],s[d],u,d,d+r.length-2,l))}static adjustPadAndReturnShape(t,r,i,a,n,s,u,l){let d=i*(a-1)+1;if(l&&l!=="NOTSET")switch(l){case"VALID":return n[s]=0,n[u]=0,Math.floor((t-d)/r+1);case"SAME_LOWER":case"SAME_UPPER":if(i!==1)throw new Error("Dilation not supported for SAME_UPPER or SAME_LOWER");{let h=((t+r-1)/r-1)*r+a-t;return n[s]=Math.floor(l==="SAME_LOWER"?(h+1)/2:h/2),n[u]=h-n[s],Math.floor((t+h-a)/r+1)}default:throw new Error("Unsupported AutoPad type")}else return Math.floor((t+n[s]+n[u]-d)/r+1)}},Yg=class{static getShapeOfGemmResult(e,t,r,i,a){if(e.length!==2||r.length!==2)throw new Error("shape need to be of size 2");let n,s,u;t?(n=e[1],s=e[0]):(n=e[0],s=e[1]);let l=-1;if(i?(u=r[0],l=1):(u=r[1],l=0),r[l]!==s)throw new Error("dimension mismatch");if(n<=0||u<=0||s<=0)throw new Error("invalid shape specified");if(a&&!Zi.isValidBroadcast(a,[n,u]))throw new Error("gemm: invalid bias shape for broadcast");return[n,u,s]}},Zg=-34028234663852886e22,Qg=34028234663852886e22}),od,Jg=U(()=>{le(),od=(e,t)=>new(Es(t))(e)}),ko,Iu,Eo,hp,So,pp,Co,Ao,Io,fp,e0,S4=U(()=>{le(),Rr(),ko=new Map([["float32",32],["float16",16],["int32",32],["uint32",32],["int64",64],["uint64",64],["int8",8],["uint8",8],["int4",4],["uint4",4]]),Iu=(e,t)=>{if(t==="int32")return e;let r=ko.get(t);if(!r)throw new Error(`WebNN backend does not support data type: ${t}`);let i=r/8;if(e.byteLength%i!==0)throw new Error(`Invalid Uint8Array length - must be a multiple of ${i}.`);let a=e.byteLength/i,n=new(Es(t))(e.buffer,e.byteOffset,a);switch(t){case"int64":case"uint64":{let s=new Int32Array(a);for(let u=0;u<a;u++){let l=n[u];if(l>2147483647n||l<-2147483648n)throw new Error("Can not convert int64 data to int32 - value out of range.");s[u]=Number(l)}return new Uint8Array(s.buffer)}case"int8":case"uint8":case"uint32":{if(t==="uint32"&&n.some(u=>u>2147483647))throw new Error("Can not convert uint32 data to int32 - value out of range.");let s=Int32Array.from(n,Number);return new Uint8Array(s.buffer)}default:throw new Error(`Unsupported data conversion from ${t} to 'int32'`)}},Eo=(e,t)=>{if(t==="int32")return e;if(e.byteLength%4!==0)throw new Error("Invalid Uint8Array length - must be a multiple of 4 (int32).");let r=e.byteLength/4,i=new Int32Array(e.buffer,e.byteOffset,r);switch(t){case"int64":{let a=BigInt64Array.from(i,BigInt);return new Uint8Array(a.buffer)}case"uint64":{if(i.some(n=>n<0))throw new Error("Can not convert int32 data to uin64 - negative value found.");let a=BigUint64Array.from(i,BigInt);return new Uint8Array(a.buffer)}case"int8":{if(i.some(n=>n<-128||n>127))throw new Error("Can not convert int32 data to int8 - value out of range.");let a=Int8Array.from(i,Number);return new Uint8Array(a.buffer)}case"uint8":{if(i.some(a=>a<0||a>255))throw new Error("Can not convert int32 data to uint8 - value out of range.");return Uint8Array.from(i,Number)}case"uint32":{if(i.some(n=>n<0))throw new Error("Can not convert int32 data to uint32 - negative value found.");let a=Uint32Array.from(i,Number);return new Uint8Array(a.buffer)}default:throw new Error(`Unsupported data conversion from 'int32' to ${t}`)}},hp=1,So=()=>hp++,pp=new Map([["int8","int32"],["uint8","int32"],["uint32","int32"],["int64","int32"]]),Co=(e,t)=>{let r=ko.get(e);if(!r)throw new Error(`WebNN backend does not support data type: ${e}`);return t.length>0?Math.ceil(t.reduce((i,a)=>i*a)*r/8):0},Ao=class{constructor(e){this.isDataConverted=!1;let{sessionId:t,context:r,tensor:i,dataType:a,shape:n,fallbackDataType:s}=e;this.sessionId=t,this.mlContext=r,this.mlTensor=i,this.dataType=a,this.tensorShape=n,this.fallbackDataType=s}get tensor(){return this.mlTensor}get type(){return this.dataType}get fallbackType(){return this.fallbackDataType}get shape(){return this.tensorShape}get byteLength(){return Co(this.dataType,this.tensorShape)}destroy(){ye("verbose",()=>"[WebNN] TensorWrapper.destroy"),this.mlTensor.destroy()}write(e){this.mlContext.writeTensor(this.mlTensor,e)}async read(e){if(this.fallbackDataType){let t=await this.mlContext.readTensor(this.mlTensor),r=Eo(new Uint8Array(t),this.dataType);if(e){(e instanceof ArrayBuffer?new Uint8Array(e):new Uint8Array(e.buffer,e.byteOffset,e.byteLength)).set(r);return}else return r.buffer}else return e?this.mlContext.readTensor(this.mlTensor,e):this.mlContext.readTensor(this.mlTensor)}canReuseTensor(e,t,r){return this.mlContext===e&&this.dataType===t&&this.tensorShape.length===r.length&&this.tensorShape.every((i,a)=>i===r[a])}setIsDataConverted(e){this.isDataConverted=e}},Io=class{constructor(e,t){this.tensorManager=e,this.wrapper=t}get tensorWrapper(){return this.wrapper}releaseTensor(){this.tensorWrapper&&(this.tensorManager.releaseTensor(this.tensorWrapper),this.wrapper=void 0)}async ensureTensor(e,t,r,i){let a=this.tensorManager.getMLContext(e),n;if(!a.opSupportLimits().input.dataTypes.includes(t)){if(n=pp.get(t),!n||!a.opSupportLimits().input.dataTypes.includes(n))throw new Error(`WebNN backend does not support data type: ${t}`);ye("verbose",()=>`[WebNN] TensorIdTracker.ensureTensor: fallback dataType from ${t} to ${n}`)}if(this.wrapper){if(this.wrapper.canReuseTensor(a,t,r))return this.wrapper.tensor;if(i){if(this.wrapper.byteLength!==Co(t,r))throw new Error("Unable to copy data to tensor with different size.");this.activeUpload=new Uint8Array(await this.wrapper.read())}this.tensorManager.releaseTensor(this.wrapper)}let s=typeof MLTensorUsage>"u"?void 0:MLTensorUsage.READ|MLTensorUsage.WRITE;return this.wrapper=await this.tensorManager.getCachedTensor(e,t,r,s,!0,!0,n),i&&this.activeUpload&&(this.wrapper.write(this.activeUpload),this.activeUpload=void 0),this.wrapper.tensor}upload(e){let t=e;if(this.wrapper){if(this.wrapper.fallbackType)if(this.wrapper.fallbackType==="int32")t=Iu(e,this.wrapper.type),this.wrapper.setIsDataConverted(!0);else throw new Error(`Unsupported fallback data type: ${this.wrapper.fallbackType}`);if(e.byteLength===this.wrapper.byteLength){this.wrapper.write(t);return}else ye("verbose",()=>"Data size does not match tensor size. Releasing tensor."),this.releaseTensor()}this.activeUpload?this.activeUpload.set(t):this.activeUpload=new Uint8Array(t)}async download(e){var t,r;if(this.activeUpload){let i=(t=this.wrapper)!=null&&t.isDataConverted?Eo(this.activeUpload,(r=this.wrapper)==null?void 0:r.type):this.activeUpload;if(e){e instanceof ArrayBuffer?new Uint8Array(e).set(i):new Uint8Array(e.buffer,e.byteOffset,e.byteLength).set(i);return}else return i.buffer}if(!this.wrapper)throw new Error("Tensor has not been created.");return e?this.wrapper.read(e):this.wrapper.read()}},fp=class{constructor(e){this.backend=e,this.tensorTrackersById=new Map,this.freeTensors=[],this.externalTensors=new Set}getMLContext(e){let t=this.backend.getMLContext(e);if(!t)throw new Error("MLContext not found for session.");return t}reserveTensorId(){let e=So();return this.tensorTrackersById.set(e,new Io(this)),e}releaseTensorId(e){let t=this.tensorTrackersById.get(e);t&&(this.tensorTrackersById.delete(e),t.tensorWrapper&&this.releaseTensor(t.tensorWrapper))}async ensureTensor(e,t,r,i,a){ye("verbose",()=>`[WebNN] TensorManager.ensureTensor {tensorId: ${t}, dataType: ${r}, shape: ${i}, copyOld: ${a}}`);let n=this.tensorTrackersById.get(t);if(!n)throw new Error("Tensor not found.");return n.ensureTensor(e,r,i,a)}upload(e,t){let r=this.tensorTrackersById.get(e);if(!r)throw new Error("Tensor not found.");r.upload(t)}async download(e,t){ye("verbose",()=>`[WebNN] TensorManager.download {tensorId: ${e}, dstBuffer: ${t==null?void 0:t.byteLength}}`);let r=this.tensorTrackersById.get(e);if(!r)throw new Error("Tensor not found.");return r.download(t)}releaseTensorsForSession(e){for(let t of this.freeTensors)t.sessionId===e&&t.destroy();this.freeTensors=this.freeTensors.filter(t=>t.sessionId!==e)}registerTensor(e,t,r,i){let a=this.getMLContext(e),n=So(),s=new Ao({sessionId:e,context:a,tensor:t,dataType:r,shape:i});return this.tensorTrackersById.set(n,new Io(this,s)),this.externalTensors.add(s),n}async getCachedTensor(e,t,r,i,a,n,s){let u=this.getMLContext(e);for(let[d,h]of this.freeTensors.entries())if(h.canReuseTensor(u,t,r)){ye("verbose",()=>`[WebNN] Reusing tensor {dataType: ${t}, ${s?`fallbackDataType: ${s},`:""} shape: ${r}`);let f=this.freeTensors.splice(d,1)[0];return f.sessionId=e,f}ye("verbose",()=>`[WebNN] MLContext.createTensor {dataType: ${t}, ${s?`fallbackDataType: ${s},`:""} shape: ${r}}`);let l=await u.createTensor({dataType:s??t,shape:r,dimensions:r,usage:i,writable:a,readable:n});return new Ao({sessionId:e,context:u,tensor:l,dataType:t,shape:r,fallbackDataType:s})}releaseTensor(e){this.externalTensors.has(e)&&this.externalTensors.delete(e),this.freeTensors.push(e)}},e0=(...e)=>new fp(...e)}),_n,mp,t0,C4=U(()=>{le(),Ei(),Jg(),S4(),Rr(),_n=new Map([[1,"float32"],[10,"float16"],[6,"int32"],[12,"uint32"],[7,"int64"],[13,"uint64"],[22,"int4"],[21,"uint4"],[3,"int8"],[2,"uint8"],[9,"uint8"]]),mp=(e,t)=>{if(e===t)return!0;if(e===void 0||t===void 0)return!1;let r=Object.keys(e).sort(),i=Object.keys(t).sort();return r.length===i.length&&r.every((a,n)=>a===i[n]&&e[a]===t[a])},t0=class{constructor(e){this.tensorManager=e0(this),this.mlContextBySessionId=new Map,this.sessionIdsByMLContext=new Map,this.mlContextCache=[],this.sessionGraphInputs=new Map,this.sessionGraphOutputs=new Map,this.temporaryGraphInputs=[],this.temporaryGraphOutputs=[],this.temporarySessionTensorIds=new Map,sd(e.logLevel,!!e.debug)}get currentSessionId(){if(this.activeSessionId===void 0)throw new Error("No active session");return this.activeSessionId}onRunStart(e){ye("verbose",()=>`[WebNN] onRunStart {sessionId: ${e}}`),this.activeSessionId=e}onRunEnd(e){ye("verbose",()=>`[WebNN] onRunEnd {sessionId: ${e}}`);let t=this.temporarySessionTensorIds.get(e);if(t){for(let r of t)ye("verbose",()=>`[WebNN] releasing temporary tensor {tensorId: ${r}}`),this.tensorManager.releaseTensorId(r);this.temporarySessionTensorIds.delete(e),this.activeSessionId=void 0}}async createMLContext(e){if(e instanceof GPUDevice){let r=this.mlContextCache.findIndex(i=>i.gpuDevice===e);if(r!==-1)return this.mlContextCache[r].mlContext;{let i=await navigator.ml.createContext(e);return this.mlContextCache.push({gpuDevice:e,mlContext:i}),i}}else if(e===void 0){let r=this.mlContextCache.findIndex(i=>i.options===void 0&&i.gpuDevice===void 0);if(r!==-1)return this.mlContextCache[r].mlContext;{let i=await navigator.ml.createContext();return this.mlContextCache.push({mlContext:i}),i}}let t=this.mlContextCache.findIndex(r=>mp(r.options,e));if(t!==-1)return this.mlContextCache[t].mlContext;{let r=await navigator.ml.createContext(e);return this.mlContextCache.push({options:e,mlContext:r}),r}}registerMLContext(e,t){this.mlContextBySessionId.set(e,t);let r=this.sessionIdsByMLContext.get(t);r||(r=new Set,this.sessionIdsByMLContext.set(t,r)),r.add(e),this.temporaryGraphInputs.length>0&&(this.sessionGraphInputs.set(e,this.temporaryGraphInputs),this.temporaryGraphInputs=[]),this.temporaryGraphOutputs.length>0&&(this.sessionGraphOutputs.set(e,this.temporaryGraphOutputs),this.temporaryGraphOutputs=[])}onReleaseSession(e){this.sessionGraphInputs.delete(e),this.sessionGraphOutputs.delete(e);let t=this.mlContextBySessionId.get(e);if(!t)return;this.tensorManager.releaseTensorsForSession(e),this.mlContextBySessionId.delete(e);let r=this.sessionIdsByMLContext.get(t);if(r.delete(e),r.size===0){this.sessionIdsByMLContext.delete(t);let i=this.mlContextCache.findIndex(a=>a.mlContext===t);i!==-1&&this.mlContextCache.splice(i,1)}}getMLContext(e){return this.mlContextBySessionId.get(e)}reserveTensorId(){return this.tensorManager.reserveTensorId()}releaseTensorId(e){ye("verbose",()=>`[WebNN] releaseTensorId {tensorId: ${e}}`),this.tensorManager.releaseTensorId(e)}async ensureTensor(e,t,r,i,a){let n=_n.get(r);if(!n)throw new Error(`Unsupported ONNX data type: ${r}`);return this.tensorManager.ensureTensor(e??this.currentSessionId,t,n,i,a)}async createTemporaryTensor(e,t,r){ye("verbose",()=>`[WebNN] createTemporaryTensor {onnxDataType: ${t}, shape: ${r}}`);let i=_n.get(t);if(!i)throw new Error(`Unsupported ONNX data type: ${t}`);let a=this.tensorManager.reserveTensorId();await this.tensorManager.ensureTensor(e,a,i,r,!1);let n=this.temporarySessionTensorIds.get(e);return n?n.push(a):this.temporarySessionTensorIds.set(e,[a]),a}uploadTensor(e,t){if(!Oe().shouldTransferToMLTensor)throw new Error("Trying to upload to a MLTensor while shouldTransferToMLTensor is false");ye("verbose",()=>`[WebNN] uploadTensor {tensorId: ${e}, data: ${t.byteLength}}`),this.tensorManager.upload(e,t)}async downloadTensor(e,t){return this.tensorManager.download(e,t)}createMLTensorDownloader(e,t){return async()=>{let r=await this.tensorManager.download(e);return od(r,t)}}registerMLTensor(e,t,r,i){let a=_n.get(r);if(!a)throw new Error(`Unsupported ONNX data type: ${r}`);let n=this.tensorManager.registerTensor(e,t,a,i);return ye("verbose",()=>`[WebNN] registerMLTensor {tensor: ${t}, dataType: ${a}, dimensions: ${i}} -> {tensorId: ${n}}`),n}registerMLConstant(e,t,r,i,a,n,s=!1){if(!n)throw new Error("External mounted files are not available.");let u=e;e.startsWith("./")&&(u=e.substring(2));let l=n.get(u);if(!l)throw new Error(`File with name ${u} not found in preloaded files.`);if(t+r>l.byteLength)throw new Error("Out of bounds: data offset and length exceed the external file data size.");let d=l.slice(t,t+r).buffer,h;switch(a.dataType){case"float32":h=new Float32Array(d);break;case"float16":h=typeof Float16Array<"u"&&Float16Array.from?new Float16Array(d):new Uint16Array(d);break;case"int32":h=new Int32Array(d);break;case"uint32":h=new Uint32Array(d);break;case"int64":if(s){let f=Iu(new Uint8Array(d),"int64");h=new Int32Array(f.buffer),a.dataType="int32"}else h=new BigInt64Array(d);break;case"uint64":h=new BigUint64Array(d);break;case"int8":h=new Int8Array(d);break;case"int4":case"uint4":case"uint8":h=new Uint8Array(d);break;default:throw new Error(`Unsupported data type: ${a.dataType} in creating WebNN Constant from external data.`)}return ye("verbose",()=>`[WebNN] registerMLConstant {dataType: ${a.dataType}, shape: ${a.shape}}} ${s?"(Note: it was int64 data type and registered to int32 as workaround)":""}`),i.constant(a,h)}registerGraphInput(e){this.temporaryGraphInputs.push(e)}registerGraphOutput(e){this.temporaryGraphOutputs.push(e)}isGraphInput(e,t){let r=this.sessionGraphInputs.get(e);return r?r.includes(t):!1}isGraphOutput(e,t){let r=this.sessionGraphOutputs.get(e);return r?r.includes(t):!1}isGraphInputOutputTypeSupported(e,t,r=!0){let i=this.mlContextBySessionId.get(e),a=_n.get(pi(t));return typeof a>"u"?!1:r?!!(i!=null&&i.opSupportLimits().input.dataTypes.includes(a)):!!(i!=null&&i.opSupportLimits().output.dataTypes.includes(a))}flush(){}}}),ud=U(()=>{}),zo,ha,pa,gp,yp,Oo,zu,_p,r0,A4=U(()=>{Rr(),ud(),zo=new Map([[64,250],[128,200],[256,200],[512,200],[2048,230],[4096,200],[8192,50],[16384,50],[32768,50],[65536,50],[131072,50],[262144,50],[524288,50],[1048576,50],[2097152,30],[4194304,20],[8388608,10],[12582912,10],[16777216,10],[26214400,15],[33554432,22],[44236800,2],[58982400,6],[67108864,6],[134217728,6],[167772160,6]]),ha=[],pa=e=>Math.ceil(Number(e)/16)*16,gp=e=>{for(let t=0;t<ha.length;t++){let r=ha[t];if(e<=r)return r}return Math.ceil(e/16)*16},yp=1,Oo=()=>yp++,zu=async(e,t,r,i)=>{let a=pa(r),n=e.device.createBuffer({size:a,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});try{let s=e.getCommandEncoder();e.endComputePass(),s.copyBufferToBuffer(t,0,n,0,a),e.flush(),await n.mapAsync(GPUMapMode.READ);let u=n.getMappedRange();if(i){let l=i();return l.set(new Uint8Array(u,0,r)),l}else return new Uint8Array(u.slice(0,r))}finally{n.destroy()}},_p=class{constructor(e){this.backend=e,this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.buffersPending=[],this.capturedPendingBuffers=new Map;for(let[t]of zo)ha.push(t),this.freeBuffers.set(t,[]),this.freeUniformBuffers.set(t,[]);this.sessionCount=0}upload(e,t){let r=t.buffer,i=t.byteOffset,a=t.byteLength,n=pa(a),s=this.storageCache.get(e);if(!s)throw new Error("gpu data for uploading does not exist");if(Number(s.originalSize)!==a)throw new Error(`inconsistent data size. gpu data size=${s.originalSize}, data size=${a}`);let u=this.backend.device.createBuffer({mappedAtCreation:!0,size:n,usage:GPUBufferUsage.MAP_WRITE|GPUBufferUsage.COPY_SRC}),l=u.getMappedRange();new Uint8Array(l).set(new Uint8Array(r,i,a)),u.unmap();let d=this.backend.device.createCommandEncoder();d.copyBufferToBuffer(u,0,s.gpuData.buffer,0,n),this.backend.device.queue.submit([d.finish()]),u.destroy(),ye("verbose",()=>`[WebGPU] GpuDataManager.upload(id=${e})`)}memcpy(e,t){let r=this.storageCache.get(e);if(!r)throw new Error("source gpu data for memcpy does not exist");let i=this.storageCache.get(t);if(!i)throw new Error("destination gpu data for memcpy does not exist");if(r.originalSize!==i.originalSize)throw new Error("inconsistent source and destination gpu data size");let a=pa(r.originalSize),n=this.backend.getCommandEncoder();this.backend.endComputePass(),n.copyBufferToBuffer(r.gpuData.buffer,0,i.gpuData.buffer,0,a)}registerExternalBuffer(e,t,r){let i;if(r){if(i=r[0],e===r[1])return ye("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${i}, buffer is the same, skip.`),i;if(this.backend.capturedCommandList.has(this.backend.currentSessionId))throw new Error(`Registering a different external buffer under graph capture mode is not supported yet.
             Please use the previous external buffer!`)}else i=Oo();return this.storageCache.set(i,{gpuData:{id:i,type:0,buffer:e},originalSize:t}),ye("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${i}, registered.`),i}unregisterExternalBuffer(e){e!==void 0&&(this.storageCache.delete(e),ye("verbose",()=>`[WebGPU] GpuDataManager.unregisterExternalBuffer() => id=${e}`))}create(e,t=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST){let r=gp(e),i,a=(t&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE,n=(t&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM;if(a||n){let u=(a?this.freeBuffers:this.freeUniformBuffers).get(r);u?u.length>0?i=u.pop():i=this.backend.device.createBuffer({size:r,usage:t}):i=this.backend.device.createBuffer({size:r,usage:t})}else i=this.backend.device.createBuffer({size:r,usage:t});let s={id:Oo(),type:0,buffer:i};return this.storageCache.set(s.id,{gpuData:s,originalSize:Number(e)}),ye("verbose",()=>`[WebGPU] GpuDataManager.create(size=${e}) => id=${s.id}`),s}get(e){var t;return(t=this.storageCache.get(e))==null?void 0:t.gpuData}release(e){let t=typeof e=="bigint"?Number(e):e,r=this.storageCache.get(t);if(!r){if(this.storageCache.size===0)return 0;throw new Error("releasing data does not exist")}return ye("verbose",()=>`[WebGPU] GpuDataManager.release(id=${t}), gpuDataId=${r.gpuData.id}`),this.storageCache.delete(t),this.buffersPending.push(r.gpuData.buffer),r.originalSize}async download(e,t){let r=this.storageCache.get(Number(e));if(!r)throw new Error("data does not exist");await zu(this.backend,r.gpuData.buffer,r.originalSize,t)}refreshPendingBuffers(){if(this.buffersPending.length!==0)if(this.backend.sessionStatus==="default"){for(let e of this.buffersPending){let t=zo.get(e.size);if((e.usage&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE){let r=this.freeBuffers.get(e.size)||[];t===void 0||r.length>=t?e.destroy():r.push(e)}else if((e.usage&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM){let r=this.freeUniformBuffers.get(e.size)||[];t===void 0||r.length>=t?e.destroy():r.push(e)}else e.destroy()}this.buffersPending=[]}else{let e=this.capturedPendingBuffers.get(this.backend.currentSessionId);e||(e=[],this.capturedPendingBuffers.set(this.backend.currentSessionId,e));for(let t of this.buffersPending)e.push(t);this.buffersPending=[]}}dispose(){this.freeBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.freeUniformBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache.forEach(e=>{e.gpuData.buffer.destroy()}),this.capturedPendingBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.capturedPendingBuffers=new Map}onCreateSession(){this.sessionCount+=1}onReleaseSession(e){let t=this.capturedPendingBuffers.get(e);t&&(t.forEach(r=>{r.destroy()}),this.capturedPendingBuffers.delete(e)),this.sessionCount-=1,this.sessionCount===0&&(ye("warning",()=>"[WebGPU] Clearing webgpu buffer cache"),this.storageCache.forEach(r=>{r.gpuData.buffer.destroy()}),this.storageCache=new Map)}},r0=(...e)=>new _p(...e)}),bp,xe,je=U(()=>{bp=class{constructor(e){Object.assign(this,e)}get cacheKey(){return this.key||(this.key=Object.getOwnPropertyNames(this).sort().map(e=>`${this[e]}`).join(";")),this.key}},xe=e=>new bp(e)}),Qi,fa,it,ut,J,Fe,Ou,Bi,Xr,Q,bn,N,K,i0,ld,wp,n0,fe=U(()=>{le(),he(),Qi=64,fa=(e,t)=>{if(t===3)throw new Error("vec3 has same alignment as vec4, use vec4 instead");switch(Number(e)){case 10:return t>1?`vec${t}<f16>`:"f16";case 1:return t>1?`vec${t}<f32>`:"f32";case 6:return t>1?`vec${t}<i32>`:"i32";case 12:return t>1?`vec${t}<u32>`:"u32";case 7:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","i32"];case 13:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","u32"];case 9:if(t!==4)throw new Error("bool must be vec4");return["u32","vec4<bool>"];case 22:return"i32";case 21:return"u32";default:throw new Error(`Unknown data type: ${e}`)}},it=(e,t=1)=>{let r=fa(e,t);return typeof r=="string"?r:r[0]},ut=(e,t=1)=>{let r=fa(e,t);return typeof r=="string"?r:r[1]},J=(...e)=>{let t=[];return e.forEach(r=>{r.length!==0&&t.push({type:12,data:r},{type:12,data:R.computeStrides(r)})}),t},Fe=e=>e%4===0?4:e%2===0?2:1,Ou=(e="f32",t,r="0")=>!t||t===1?`${e}(${r})`:`vec${t}<${e}>(${r})`,Bi=(e,t,r)=>e==="f32"?r:t===1?`f32(${r})`:`vec${t}<f32>(${r})`,Xr=(e,t)=>t===4?`(${e}.x + ${e}.y + ${e}.z + ${e}.w)`:t===2?`(${e}.x + ${e}.y)`:t===3?`(${e}.x + ${e}.y + ${e}.z)`:e,Q=(e,t,r,i)=>e.startsWith("uniforms.")&&r>4?typeof t=="string"?i==="f16"?`${e}[(${t}) / 8][(${t}) % 8 / 4][(${t}) % 8 % 4]`:`${e}[(${t}) / 4][(${t}) % 4]`:i==="f16"?`${e}[${Math.floor(t/8)}][${Math.floor(t%8/4)}][${t%8%4}]`:`${e}[${Math.floor(t/4)}][${t%4}]`:r>1?`${e}[${t}]`:e,bn=(e,t,r,i,a)=>{let n=typeof r=="number",s=n?r:r.length,u=[...new Array(s).keys()],l=s<2?"u32":s<=4?`vec${s}<u32>`:`array<u32, ${s}>`,d=fa(t,a),h=typeof d=="string"?d:d[1],f=typeof d=="string"?d:d[0],g={indices:l,value:h,storage:f,tensor:t},y=D=>typeof D=="string"?D:`${D}u`,_={offsetToIndices:!1,indicesToOffset:!1,broadcastedIndicesToOffset:!1,set:!1,setByIndices:!1,get:!1,getByIndices:!1},w=n?"uniforms.":"",x=`${w}${e}_shape`,$=`${w}${e}_strides`,v="";for(let D=0;D<s-1;D++)v+=`
    let dim${D} = current / ${Q($,D,s)};
    let rest${D} = current % ${Q($,D,s)};
    indices[${D}] = dim${D};
    current = rest${D};
    `;v+=`indices[${s-1}] = current;`;let k=s<2?"":`
  fn o2i_${e}(offset: u32) -> ${g.indices} {
    var indices: ${g.indices};
    var current = offset;
    ${v}
    return indices;
  }`,E=D=>(_.offsetToIndices=!0,s<2?D:`o2i_${e}(${D})`),S=[];if(s>=2)for(let D=s-1;D>=0;D--)S.push(`${Q($,D,s)} * (indices[${D}])`);let A=s<2?"":`
  fn i2o_${e}(indices: ${g.indices}) -> u32 {
    return ${S.join("+")};
  }`,I=D=>(_.indicesToOffset=!0,s<2?D:`i2o_${e}(${D})`),z=(...D)=>s===0?"0u":`${g.indices}(${D.map(y).join(",")})`,M=(D,W)=>s<2?`${D}`:`${Q(D,W,s)}`,V=(D,W,j)=>s<2?`${D}=${j};`:`${Q(D,W,s)}=${j};`,ee={},q=(D,W)=>{_.broadcastedIndicesToOffset=!0;let j=`${W.name}broadcastedIndicesTo${e}Offset`;if(j in ee)return`${j}(${D})`;let ie=[];for(let Ze=s-1;Ze>=0;Ze--){let ar=W.indicesGet("outputIndices",Ze+W.rank-s);ie.push(`${M($,Ze)} * (${ar} % ${M(x,Ze)})`)}return ee[j]=`fn ${j}(outputIndices: ${W.type.indices}) -> u32 {
             return ${ie.length>0?ie.join("+"):"0u"};
           }`,`${j}(${D})`},G=(D,W)=>(()=>{if(g.storage===g.value)return`${e}[${D}]=${W};`;if(g.storage==="vec2<u32>"&&g.value==="i32")return`${e}[${D}]=vec2<u32>(u32(${W}), select(0u, 0xFFFFFFFFu, ${W} < 0));`;if(g.storage==="vec2<u32>"&&g.value==="u32")return`${e}[${D}]=vec2<u32>(u32(${W}), 0u);`;if(g.storage==="u32"&&g.value==="vec4<bool>")return`${e}[${D}]=dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(${W}));`;throw new Error(`not supported combination of storage type ${g.storage} and value type ${g.value} yet`)})(),ge=D=>(()=>{if(g.storage===g.value)return`${e}[${D}]`;if(g.storage==="vec2<u32>"&&g.value==="i32")return`i32(${e}[${D}].x)`;if(g.storage==="vec2<u32>"&&g.value==="u32")return`u32(${e}[${D}].x)`;if(g.storage==="u32"&&g.value==="vec4<bool>")return`vec4<bool>(bool(${e}[${D}] & 0xFFu), bool(${e}[${D}] & 0xFF00u), bool(${e}[${D}] & 0xFF0000u), bool(${e}[${D}] & 0xFF000000u))`;throw new Error(`not supported combination of storage type ${g.storage} and value type ${g.value} yet`)})(),ce=s<2?"":`
  fn get_${e}ByIndices(indices: ${g.indices}) -> ${h} {
    return ${ge(`i2o_${e}(indices)`)};
  }`,Y=s<2?"":(()=>{let D=u.map(j=>`d${j}: u32`).join(", "),W=u.map(j=>`d${j}`).join(", ");return`
  fn get_${e}(${D}) -> ${h} {
    return get_${e}ByIndices(${z(W)});
  }`})(),pe=(...D)=>{if(D.length!==s)throw new Error(`indices length must be ${s}`);let W=D.map(y).join(",");return s===0?ge("0u"):s===1?ge(W[0]):(_.get=!0,_.getByIndices=!0,_.indicesToOffset=!0,`get_${e}(${W})`)},Z=D=>s<2?ge(D):(_.getByIndices=!0,_.indicesToOffset=!0,`get_${e}ByIndices(${D})`),se=s<2?"":`
  fn set_${e}ByIndices(indices: ${g.indices}, value: ${h}) {
    ${G(`i2o_${e}(indices)`,"value")}
  }`,Se=s<2?"":(()=>{let D=u.map(j=>`d${j}: u32`).join(", "),W=u.map(j=>`d${j}`).join(", ");return`
  fn set_${e}(${D}, value: ${h}) {
    set_${e}ByIndices(${z(W)}, value);
  }`})();return{impl:()=>{let D=[],W=!1;return _.offsetToIndices&&(D.push(k),W=!0),_.indicesToOffset&&(D.push(A),W=!0),_.broadcastedIndicesToOffset&&(Object.values(ee).forEach(j=>D.push(j)),W=!0),_.set&&(D.push(Se),W=!0),_.setByIndices&&(D.push(se),W=!0),_.get&&(D.push(Y),W=!0),_.getByIndices&&(D.push(ce),W=!0),!n&&W&&D.unshift(`const ${x} = ${g.indices}(${r.join(",")});`,`const ${$} = ${g.indices}(${R.computeStrides(r).join(",")});`),D.join(`
`)},type:g,offsetToIndices:E,indicesToOffset:I,broadcastedIndicesToOffset:q,indices:z,indicesGet:M,indicesSet:V,set:(...D)=>{if(D.length!==s+1)throw new Error(`indices length must be ${s}`);let W=D[s];if(typeof W!="string")throw new Error("value must be string");let j=D.slice(0,s).map(y).join(",");return s===0?G("0u",W):s===1?G(j[0],W):(_.set=!0,_.setByIndices=!0,_.indicesToOffset=!0,`set_${e}(${j}, ${W})`)},setByOffset:G,setByIndices:(D,W)=>s<2?G(D,W):(_.setByIndices=!0,_.indicesToOffset=!0,`set_${e}ByIndices(${D}, ${W});`),get:pe,getByOffset:ge,getByIndices:Z,usage:i,name:e,strides:$,shape:x,rank:s}},N=(e,t,r,i=1)=>bn(e,t,r,"input",i),K=(e,t,r,i=1)=>bn(e,t,r,"output",i),i0=(e,t,r)=>bn(e,t,r,"atomicOutput",1),ld=(e,t,r,i=1)=>bn(e,t,r,"internal",i),wp=class{constructor(e,t){this.normalizedDispatchGroup=e,this.limits=t,this.internalVariables=[],this.variables=[],this.uniforms=[],this.variableIndex=0}guardAgainstOutOfBoundsWorkgroupSizes(e){return`if (global_idx >= ${typeof e=="number"?`${e}u`:e}) { return; }`}mainStart(e=Qi){let t=typeof e=="number"?e:e[0],r=typeof e=="number"?1:e[1],i=typeof e=="number"?1:e[2];if(t>this.limits.maxComputeWorkgroupSizeX||r>this.limits.maxComputeWorkgroupSizeY||i>this.limits.maxComputeWorkgroupSizeZ)throw new Error(`workgroup size [${t}, ${r}, ${i}] exceeds the maximum workgroup size [${this.limits.maxComputeWorkgroupSizeX}, ${this.limits.maxComputeWorkgroupSizeY}, ${this.limits.maxComputeWorkgroupSizeZ}].`);if(t*r*i>this.limits.maxComputeInvocationsPerWorkgroup)throw new Error(`workgroup size [${t}, ${r}, ${i}] exceeds the maximum workgroup invocations ${this.limits.maxComputeInvocationsPerWorkgroup}.`);let a=this.normalizedDispatchGroup[1]===1&&this.normalizedDispatchGroup[2]===1,n=a?`@builtin(global_invocation_id) global_id : vec3<u32>,
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
`)}get variablesInfo(){if(this.uniforms.length===0)return;let e=t=>[12,10,1,6][["u32","f16","f32","i32"].indexOf(t)];return this.uniforms.map(t=>[e(t.type),t.length??1])}},n0=(e,t)=>new wp(e,t)}),vp,Ro,$p,xp,Tp,kp,It,a0,s0,Jr=U(()=>{le(),he(),je(),fe(),vp=(e,t)=>{if(!e||e.length!==1)throw new Error("Transpose requires 1 input.");if(t.length!==0&&t.length!==e[0].dims.length)throw new Error(`perm size ${t.length} does not match input rank ${e[0].dims.length}`)},Ro=(e,t)=>t.length!==0?t:[...new Array(e).keys()].reverse(),$p=(e,t)=>R.sortBasedOnPerm(e,Ro(e.length,t)),xp=(e,t,r,i)=>{let a=`fn perm(i: ${i.type.indices}) -> ${r.type.indices} {
    var a: ${r.type.indices};`;for(let n=0;n<t;++n)a+=`a[${e[n]}]=i[${n}];`;return a+="return a;}"},Tp=(e,t)=>{let r=[],i=[];for(let a=0;a<e.length;++a)e[a]!==1&&r.push(e[a]),e[t[a]]!==1&&i.push(t[a]);return{newShape:r,newPerm:i}},kp=(e,t)=>{let r=0;for(let i=0;i<e.length;++i)if(t[e[i]]!==1){if(e[i]<r)return!1;r=e[i]}return!0},It=(e,t)=>{let r=e.dataType,i=e.dims.length,a=Ro(i,t),n=$p(e.dims,a),s=e.dims,u=n,l=i<2||kp(a,e.dims),d;if(l)return d=_=>{let w=N("input",r,s,4),x=K("output",r,u,4);return`
  ${_.registerUniform("output_size","u32").declareVariables(w,x)}
  ${_.mainStart()}
    ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    output[global_idx] = input[global_idx];
  }`},{name:"TransposeCopy",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let _=R.size(n);return{outputs:[{dims:n,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(_/64/4)},programUniforms:[{type:12,data:Math.ceil(_/4)}]}},getShaderSource:d};let{newShape:h,newPerm:f}=Tp(e.dims,a),g=R.areEqual(f,[2,3,1]),y=R.areEqual(f,[3,1,2]);if(h.length===2||g||y){s=g?[h[0],h[1]*h[2]]:y?[h[0]*h[1],h[2]]:h,u=[s[1],s[0]];let _=16;return d=w=>{let x=N("a",r,s.length),$=K("output",r,u.length);return`
  ${w.registerUniform("output_size","u32").declareVariables(x,$)}
  var<workgroup> tile : array<array<${$.type.value}, ${_+1}>, ${_}>;
  ${w.mainStart([_,_,1])}
    let stride = (uniforms.output_shape[1] - 1) / ${_} + 1;
    let workgroup_id_x = workgroup_index % stride;
    let workgroup_id_y = workgroup_index / stride;
    let input_col = workgroup_id_y * ${_}u + local_id.x;
    let input_row = workgroup_id_x * ${_}u + local_id.y;
    if (input_row < uniforms.a_shape[0] && input_col < uniforms.a_shape[1]) {
      tile[local_id.y][local_id.x] = ${x.getByIndices(`${x.type.indices}(input_row, input_col)`)};
    }
    workgroupBarrier();

    let output_col = workgroup_id_x * ${_}u + local_id.x;
    let output_row = workgroup_id_y * ${_}u + local_id.y;
    if (output_row < uniforms.output_shape[0] && output_col < uniforms.output_shape[1]) {
      ${$.setByIndices(`${$.type.indices}(output_row, output_col)`,"tile[local_id.x][local_id.y]")}
    }
  }`},{name:"TransposeShared",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let w=R.size(n);return{outputs:[{dims:n,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(u[1]/_),y:Math.ceil(u[0]/_)},programUniforms:[{type:12,data:w},...J(s,u)]}},getShaderSource:d}}return d=_=>{let w=N("a",r,s.length),x=K("output",r,u.length);return`
  ${_.registerUniform("output_size","u32").declareVariables(w,x)}

  ${xp(a,i,w,x)}

  ${_.mainStart()}
    ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${x.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${x.setByOffset("global_idx",w.getByIndices("aIndices"))}
  }`},{name:"Transpose",shaderCache:{hint:`${t}`,inputDependencies:["rank"]},getRunData:()=>{let _=R.size(n);return{outputs:[{dims:n,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(_/64)},programUniforms:[{type:12,data:_},...J(s,u)]}},getShaderSource:d}},a0=(e,t)=>{vp(e.inputs,t.perm),e.compute(It(e.inputs[0],t.perm))},s0=e=>xe({perm:e.perm})}),Ep,Sp,Cp,Ap,Ip,zp,Op,Rp,Mp,Bp,Ht,o0,u0,l0,d0,c0,h0,p0,f0,m0,g0,I4=U(()=>{le(),he(),fe(),dd(),Jr(),Ep={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate * candidate",logSumExp:"bestValue + exp(candidate)",l1:"bestValue + abs(candidate)",l2:"bestValue + candidate * candidate",logSum:"bestValue + candidate"},Sp={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate",logSumExp:"bestValue + candidate",l1:"bestValue + candidate",l2:"bestValue + candidate",logSum:"bestValue + candidate"},Cp={max:"_A[offset]",min:"_A[offset]",mean:"0",sum:"0",prod:"1",sumSquare:"0",logSumExp:"0",l1:"0",l2:"0",logSum:"0"},Ap={max:"bestValue",min:"bestValue",sum:"bestValue",prod:"bestValue",sumSquare:"bestValue",logSumExp:"log(bestValue)",l1:"bestValue",l2:"sqrt(bestValue)",logSum:"log(bestValue)"},Ip=(e,t)=>{let r=[];for(let i=t-e;i<t;++i)r.push(i);return r},zp=(e,t)=>{let r=[],i=e.length;for(let n=0;n<i;n++)t.indexOf(n)===-1&&r.push(e[n]);let a=t.map(n=>e[n]);return[r,a]},Op=(e,t)=>{let r=e.length+t.length,i=[],a=0;for(let n=0;n<r;n++)t.indexOf(n)===-1?i.push(e[a++]):i.push(1);return i},Rp=(e,t)=>{for(let r=0;r<e.length;++r)if(e[e.length-r-1]!==t-1-r)return!1;return!0},Mp=(e,t)=>{let r=[];if(!Rp(e,t)){for(let i=0;i<t;++i)e.indexOf(i)===-1&&r.push(i);e.forEach(i=>r.push(i))}return r},Bp=(e,t,r,i,a,n,s)=>{let u=r[0].dims,l=R.size(n),d=R.size(s),h=N("_A",r[0].dataType,u),f=K("output",a,n),g=64;l===1&&(g=256);let y=`
          var<workgroup> aBestValues : array<f32, ${g}>;
       `,_=w=>`
        ${w.registerUniform("reduceSize","u32").declareVariables(h,f)}
        ${y}
        fn DIV_CEIL(a : u32, b : u32) -> u32 {
          return ((a - 1u) / b + 1u);
         }
         ${w.mainStart(g)}

          let outputIndex = global_idx / ${g};
          let offset = outputIndex * uniforms.reduceSize;

          var bestValue = f32(${Cp[i]});
          let Length = uniforms.reduceSize;
          for (var k = local_idx; k < Length; k = k + ${g}) {
           let candidate = f32(${h.getByOffset("offset + k")});
           bestValue = ${Ep[i]};
          }
          aBestValues[local_idx] = bestValue;
          workgroupBarrier();

         var reduceSize = min(Length, ${g}u);
         for (var currentSize = reduceSize / 2u; reduceSize > 1u;
             currentSize = reduceSize / 2u) {
           let interval = DIV_CEIL(reduceSize, 2u);
           if (local_idx < currentSize) {
            let candidate = aBestValues[local_idx + interval];
            bestValue = ${Sp[i]};
            aBestValues[local_idx] = bestValue;
           }
           reduceSize = interval;
           workgroupBarrier();
         }

         if (local_idx == 0u) {
          ${f.setByOffset("outputIndex",`${i==="mean"?`${f.type.storage}(bestValue / f32(uniforms.reduceSize))`:`${f.type.storage}(${Ap[i]})`}`)};
         }
        }`;return{name:e,shaderCache:{hint:`${t};${g}`,inputDependencies:["type"]},getShaderSource:_,getRunData:()=>({outputs:[{dims:n,dataType:a}],dispatchGroup:{x:l},programUniforms:[{type:12,data:d}]})}},Ht=(e,t,r,i)=>{let a=e.inputs.length===1?r:Ru(e.inputs,r),n=a.axes;n.length===0&&!a.noopWithEmptyAxes&&(n=e.inputs[0].dims.map((y,_)=>_));let s=R.normalizeAxes(n,e.inputs[0].dims.length),u=s,l=e.inputs[0],d=Mp(u,e.inputs[0].dims.length);d.length>0&&(l=e.compute(It(e.inputs[0],d),{inputs:[0],outputs:[-1]})[0],u=Ip(u.length,l.dims.length));let[h,f]=zp(l.dims,u),g=h;a.keepDims&&(g=Op(h,s)),e.compute(Bp(t,a.cacheKey,[l],i,e.inputs[0].dataType,g,f),{inputs:[l]})},o0=(e,t)=>{Ht(e,"ReduceMeanShared",t,"mean")},u0=(e,t)=>{Ht(e,"ReduceL1Shared",t,"l1")},l0=(e,t)=>{Ht(e,"ReduceL2Shared",t,"l2")},d0=(e,t)=>{Ht(e,"ReduceLogSumExpShared",t,"logSumExp")},c0=(e,t)=>{Ht(e,"ReduceMaxShared",t,"max")},h0=(e,t)=>{Ht(e,"ReduceMinShared",t,"min")},p0=(e,t)=>{Ht(e,"ReduceProdShared",t,"prod")},f0=(e,t)=>{Ht(e,"ReduceSumShared",t,"sum")},m0=(e,t)=>{Ht(e,"ReduceSumSquareShared",t,"sumSquare")},g0=(e,t)=>{Ht(e,"ReduceLogSumShared",t,"logSum")}}),Kt,Np,Ka,Ru,Xt,Dp,Pp,Lp,Up,Fp,Vp,Wp,Gp,jp,qp,Yt,y0,_0,b0,w0,v0,$0,x0,T0,k0,E0,dd=U(()=>{le(),he(),je(),fe(),I4(),Kt=e=>{if(!e||e.length===0||e.length>2)throw new Error("Reduce op requires 1 or 2 inputs.");if(e.length===2&&e[1].dims.length!==1)throw new Error("Invalid axes input dims.")},Np=e=>["","",`var value = ${e.getByIndices("input_indices")};`,""],Ka=(e,t,r,i,a,n,s=!1,u=!1)=>{let l=[],d=r[0].dims,h=d.length,f=R.normalizeAxes(a,h),g=!u&&f.length===0;d.forEach((w,x)=>{g||f.indexOf(x)>=0?s&&l.push(1):l.push(w)});let y=l.length,_=R.size(l);return{name:e,shaderCache:t,getShaderSource:w=>{let x=[],$=N("_A",r[0].dataType,h),v=K("output",n,y),k=i($,v,f),E=k[2];for(let S=0,A=0;S<h;S++)g||f.indexOf(S)>=0?(s&&A++,E=`for(var j${S}: u32 = 0; j${S} < ${d[S]}; j${S}++) {
                  ${k[2].includes("last_index")?`let last_index = j${S};`:""}
                  ${$.indicesSet("input_indices",S,`j${S}`)}
                  ${E}
                }`):(x.push(`${$.indicesSet("input_indices",S,v.indicesGet("output_indices",A))};`),A++);return`

        ${w.registerUniform("output_size","u32").declareVariables($,v)}

        ${w.mainStart()}
          ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          var input_indices: ${$.type.indices};
          let output_indices = ${v.offsetToIndices("global_idx")};

          ${x.join(`
`)}
          ${k[0]}       // init ops for reduce max/min
          ${k[1]}
          ${E}
          ${k[3]}
          ${k.length===4?v.setByOffset("global_idx","value"):k.slice(4).join(`
`)}
        }`},getRunData:()=>({outputs:[{dims:l,dataType:n}],dispatchGroup:{x:Math.ceil(_/64)},programUniforms:[{type:12,data:_},...J(d,l)]})}},Ru=(e,t)=>{let r=[];return e[1].dims[0]>0&&e[1].getBigInt64Array().forEach(i=>r.push(Number(i))),xe({axes:r,keepDims:t.keepDims,noopWithEmptyAxes:t.noopWithEmptyAxes})},Xt=(e,t,r,i)=>{let a=e.inputs,n=a.length===1?r:Ru(a,r);e.compute(Ka(t,{hint:n.cacheKey,inputDependencies:["rank"]},[a[0]],n.noopWithEmptyAxes&&n.axes.length===0?Np:i,n.axes,a[0].dataType,n.keepDims,n.noopWithEmptyAxes),{inputs:[0]})},Dp=(e,t)=>{Kt(e.inputs),Xt(e,"ReduceLogSum",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += ${r.getByIndices("input_indices")};`,"value = log(value);"])},Pp=(e,t)=>{Kt(e.inputs),Xt(e,"ReduceL1",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += abs(${r.getByIndices("input_indices")});`,""])},Lp=(e,t)=>{Kt(e.inputs),Xt(e,"ReduceL2",t,(r,i)=>[`var t = ${i.type.value}(0); var value = ${i.type.value}(0);`,"",`t = ${r.getByIndices("input_indices")}; value += (t * t);`,"value = sqrt(value);"])},Up=(e,t)=>{Kt(e.inputs),Xt(e,"ReduceLogSumExp",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += exp(${r.getByIndices("input_indices")});`,"value = log(value);"])},Fp=(e,t)=>{Kt(e.inputs),Xt(e,"ReduceMax",t,(r,i,a)=>{let n=[];for(let s=0;s<r.rank;s++)(a.indexOf(s)>=0||a.length===0)&&n.push(r.indicesSet("input_indices",s,0));return[`${n.join(`
`)}`,`var value = ${r.getByIndices("input_indices")};`,`value = max(value, ${r.getByIndices("input_indices")});`,""]})},Vp=(e,t)=>{Kt(e.inputs),Xt(e,"ReduceMean",t,(r,i,a)=>{let n=1;for(let s=0;s<r.rank;s++)(a.indexOf(s)>=0||a.length===0)&&(n*=e.inputs[0].dims[s]);return["var sum = f32(0);","",`sum += f32(${r.getByIndices("input_indices")});`,`let value = ${i.type.value}(sum / ${n});`]})},Wp=(e,t)=>{Kt(e.inputs),Xt(e,"ReduceMin",t,(r,i,a)=>{let n=[];for(let s=0;s<r.rank;s++)(a.indexOf(s)>=0||a.length===0)&&n.push(`input_indices[${s}] = 0;`);return[`${n.join(`
`)}`,`var value = ${r.getByIndices("input_indices")};`,`value = min(value, ${r.getByIndices("input_indices")});`,""]})},Gp=(e,t)=>{Kt(e.inputs),Xt(e,"ReduceProd",t,(r,i)=>[`var value = ${i.type.storage}(1);`,"",`value *= ${r.getByIndices("input_indices")};`,""])},jp=(e,t)=>{Kt(e.inputs),Xt(e,"ReduceSum",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += ${r.getByIndices("input_indices")};`,""])},qp=(e,t)=>{Kt(e.inputs),Xt(e,"ReduceSumSquare",t,(r,i)=>[`var t = ${i.type.value}(0); var value = ${i.type.value}(0);`,"",`t = ${r.getByIndices("input_indices")}; value += t * t;`,""])},Yt=(e,t,r)=>{if(t.length===0)return r;let i=1,a=1;for(let n=0;n<t.length;n++)t.indexOf(n)===-1?i*=e[n]:a*=e[n];return a<32&&i>1024},y0=(e,t)=>{Yt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Vp(e,t):o0(e,t)},_0=(e,t)=>{Yt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Pp(e,t):u0(e,t)},b0=(e,t)=>{Yt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Lp(e,t):l0(e,t)},w0=(e,t)=>{Yt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Up(e,t):d0(e,t)},v0=(e,t)=>{Yt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Fp(e,t):c0(e,t)},$0=(e,t)=>{Yt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Wp(e,t):h0(e,t)},x0=(e,t)=>{Yt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Gp(e,t):p0(e,t)},T0=(e,t)=>{Yt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?jp(e,t):f0(e,t)},k0=(e,t)=>{Yt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?qp(e,t):m0(e,t)},E0=(e,t)=>{Yt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Dp(e,t):g0(e,t)}}),Mo,S0,C0,Mu,z4=U(()=>{le(),je(),dd(),Mo=e=>{if(!e||e.length===0||e.length>2)throw new Error("ArgMinMaxOp op requires 1 or 2 inputs.");if(e[0].dataType!==1)throw new Error("Invalid input type.")},S0=(e,t)=>{Mo(e.inputs);let r=(i,a,n)=>{let s=[];for(let u=0;u<i.rank;u++)(n.indexOf(u)>=0||n.length===0)&&s.push(`input_indices[${u}] = 0;`);return[`${s.join(`
`)}`,`var value = ${i.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${i.getByIndices("input_indices")} ${t.selectLastIndex>0?"<=":"<"} value) {
         value = ${i.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",a.setByOffset("global_idx","best_index")]};e.compute(Ka("ArgMin",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],r,[t.axis],7,t.keepDims),{inputs:[0]})},C0=(e,t)=>{Mo(e.inputs);let r=(i,a,n)=>{let s=[];for(let u=0;u<i.rank;u++)(n.indexOf(u)>=0||n.length===0)&&s.push(`input_indices[${u}] = 0;`);return[`${s.join(`
`)}`,`var value = ${i.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${i.getByIndices("input_indices")} ${t.selectLastIndex>0?">=":">"} value) {
         value = ${i.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",a.setByOffset("global_idx","best_index")]};e.compute(Ka("argMax",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],r,[t.axis],7,t.keepDims),{inputs:[0]})},Mu=e=>xe(e)}),Hp,ma,Kp,Xp,Yp,Vn,Zp,A0,cd=U(()=>{le(),he(),ud(),fe(),Hp=(e,t)=>{let r=e[0],i=e[1],a=e[2],n=e[3],s=e[4],u=e[5];if(s&&u)throw new Error("Attention cannot have both past and attention_bias");if(r.dims.length!==3)throw new Error('Input "input" must have 3 dimensions');let l=r.dims[0],d=r.dims[1],h=r.dims[2];if(a.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimensions');if(i.dims.length!==2)throw new Error('Input "weights" is expected to have 2 dimensions');if(i.dims[0]!==h)throw new Error("Input 1 dimension 0 should have same length as dimension 2 of input 0");if(a.dims[0]!==i.dims[1])throw new Error('Input "bias" dimension 0 should have same length as dimension 1 of input "weights"');let f=a.dims[0]/3,g=f,y=g;if(t.qkvHiddenSizes.length>0){if(t.qkvHiddenSizes.length!==3)throw new Error("qkv_hidden_sizes attribute should have 3 elements");for(let k of t.qkvHiddenSizes)if(k%t.numHeads!==0)throw new Error("qkv_hidden_sizes should be divisible by num_heads");f=t.qkvHiddenSizes[0],g=t.qkvHiddenSizes[1],y=t.qkvHiddenSizes[2]}let _=d;if(f!==g)throw new Error("qkv_hidden_sizes first element should be same as the second");if(a.dims[0]!==f+g+y)throw new Error('Input "bias" dimension 0 should have same length as sum of Q/K/V hidden sizes');let w=0;if(s){if(g!==y)throw new Error('Input "past" expect k_hidden_size == v_hidden_size');if(s.dims.length!==5)throw new Error('Input "past" must have 5 dimensions');if(s.dims[0]!==2)throw new Error('Input "past" first dimension must be 2');if(s.dims[1]!==l)throw new Error('Input "past" second dimension must be batch_size');if(s.dims[2]!==t.numHeads)throw new Error('Input "past" third dimension must be num_heads');if(s.dims[4]!==g/t.numHeads)throw new Error('Input "past" fifth dimension must be k_hidden_size / num_heads');t.pastPresentShareBuffer||(w=s.dims[3])}let x=_+w,$=-1,v=0;if(n)throw new Error("Mask not supported");if(s)throw new Error("past is not supported");if(u){if(u.dims.length!==4)throw new Error('Input "attention_bias" must have 4 dimensions');if(u.dims[0]!==l||u.dims[1]!==t.numHeads||u.dims[2]!==d||u.dims[3]!==x)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:l,sequenceLength:d,pastSequenceLength:w,kvSequenceLength:_,totalSequenceLength:x,maxSequenceLength:$,inputHiddenSize:h,hiddenSize:f,vHiddenSize:y,headSize:Math.floor(f/t.numHeads),vHeadSize:Math.floor(y/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:v,scale:t.scale,broadcastResPosBias:!1,passPastInKv:!1,qkvFormat:1}},ma=(e,t,r)=>t&&e?`
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
    `,Kp=(e,t,r,i,a,n,s,u)=>{let l=Fe(s?1:n),d=64,h=n/l;h<d&&(d=32);let f=Math.ceil(n/l/d),g=[{type:12,data:t},{type:12,data:r},{type:12,data:i},{type:12,data:a},{type:12,data:h},{type:12,data:f}],y=it(e.dataType,l),_=ut(1,l),w=["type"];s&&w.push("type"),u&&w.push("type");let x=$=>{let v=K("x",e.dataType,e.dims,l),k=[v],E=s?N("seq_lens",s.dataType,s.dims):void 0;E&&k.push(E);let S=u?N("total_sequence_length_input",u.dataType,u.dims):void 0;S&&k.push(S);let A=ut(e.dataType),I=[{name:"batch_size",type:"u32"},{name:"num_heads",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"sequence_length",type:"u32"},{name:"total_sequence_length",type:"u32"},{name:"elements_per_thread",type:"u32"}];return`
  var<workgroup> thread_max: array<f32, ${d}>;
  var<workgroup> thread_sum: array<f32, ${d}>;
  ${$.registerUniforms(I).declareVariables(...k)}
  ${$.mainStart([d,1,1])}
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let sequence_length = uniforms.sequence_length;
    var total_sequence_length = uniforms.total_sequence_length;
    ${ma(E,S,!1)}
    let local_offset = local_idx * uniforms.elements_per_thread;
    let offset = (global_idx / ${d}) * uniforms.total_sequence_length + local_offset;
    let seq_causal_length = ${s?"u32(past_sequence_length + workgroup_id.y + 1)":"total_sequence_length"};
    var thread_max_vector = ${_}(-3.402823e+38f);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      thread_max_vector = max(${_}(x[offset + i]), thread_max_vector);
    }
    thread_max[local_idx] = ${(()=>{switch(l){case 1:return"thread_max_vector";case 2:return"max(thread_max_vector.x, thread_max_vector.y)";case 4:return"max(max(thread_max_vector.x, thread_max_vector.y), max(thread_max_vector.z, thread_max_vector.w))";default:throw new Error(`Unsupported components: ${l}`)}})()};
    workgroupBarrier();

    var max_value =  f32(-3.402823e+38f);
    for (var i = 0u; i < ${d}; i++) {
      max_value = max(thread_max[i], max_value);
    }

    var sum_vector = ${_}(0);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      sum_vector += exp(${_}(x[offset + i]) - max_value);
    }
    thread_sum[local_idx] = ${(()=>{switch(l){case 1:return"sum_vector";case 2:return"sum_vector.x + sum_vector.y";case 4:return"sum_vector.x + sum_vector.y + sum_vector.z + sum_vector.w";default:throw new Error(`Unsupported components: ${l}`)}})()};
    workgroupBarrier();

    var sum: f32 = 0;
    for (var i = 0u; i < ${d}; i++) {
      sum += thread_sum[i];
    }

    if (sum == 0) {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        x[offset + i] = ${v.type.value}(${A}(1.0) / ${A}(seq_causal_length));
      }
    } else {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        var f32input = ${_}(x[offset + i]);
        x[offset + i] = ${v.type.value}(exp(f32input - max_value) / sum);
      }
    }
      ${s?`
        for (var total_seq_id: u32 = seq_causal_length; total_seq_id + local_offset < uniforms.total_sequence_length; total_seq_id++) {
          x[offset + total_seq_id] = ${v.type.value}(${A}(0));
        }`:""};
  }`};return{name:"AttentionProbsSoftmax",shaderCache:{hint:`${d};${y};${l}`,inputDependencies:w},getShaderSource:x,getRunData:()=>({outputs:[],dispatchGroup:{x:1,y:a,z:t*r},programUniforms:g})}},Xp=(e,t,r,i,a,n,s,u,l)=>{let d=s+n.kvSequenceLength,h=[n.batchSize,n.numHeads,n.sequenceLength,d],f=e>1&&i,g=n.kvNumHeads?n.kvNumHeads:n.numHeads,y=f?[n.batchSize,g,d,n.headSize]:void 0,_=n.nReps?n.nReps:1,w=n.scale===0?1/Math.sqrt(n.headSize):n.scale,x=Fe(n.headSize),$=n.headSize/x,v=12,k={x:Math.ceil(d/v),y:Math.ceil(n.sequenceLength/v),z:n.batchSize*n.numHeads},E=[{type:12,data:n.sequenceLength},{type:12,data:$},{type:12,data:d},{type:12,data:n.numHeads},{type:12,data:n.headSize},{type:1,data:w},{type:12,data:s},{type:12,data:n.kvSequenceLength},{type:12,data:_}],S=f&&i&&R.size(i.dims)>0,A=["type","type"];S&&A.push("type"),a&&A.push("type"),u&&A.push("type"),l&&A.push("type");let I=[{dims:h,dataType:t.dataType,gpuDataType:0}];f&&I.push({dims:y,dataType:t.dataType,gpuDataType:0});let z=M=>{let V=N("q",t.dataType,t.dims,x),ee=N("key",r.dataType,r.dims,x),q=[V,ee];if(S){let se=N("past_key",i.dataType,i.dims,x);q.push(se)}a&&q.push(N("attention_bias",a.dataType,a.dims));let G=u?N("seq_lens",u.dataType,u.dims):void 0;G&&q.push(G);let ge=l?N("total_sequence_length_input",l.dataType,l.dims):void 0;ge&&q.push(ge);let ce=K("output",t.dataType,h),Y=[ce];f&&Y.push(K("present_key",t.dataType,y,x));let pe=ut(1,x),Z=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"alpha",type:"f32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${v}u;

  var<workgroup> tileQ: array<${V.type.storage}, ${v*v}>;
  var<workgroup> tileK: array<${V.type.storage}, ${v*v}>;
  ${M.registerUniforms(Z).declareVariables(...q,...Y)}
  ${M.mainStart([v,v,1])}
    // x holds the N and y holds the M
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let kvHeadIdx = ${_===1?"headIdx":"headIdx / uniforms.n_reps"};
    let kv_num_heads = ${_===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let m = workgroup_id.y * TILE_SIZE;
    let n = workgroup_id.x * TILE_SIZE;
    let sequence_length = uniforms.M;
    var total_sequence_length = uniforms.N;
    ${ma(G,ge,!0)}
    let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx;
    let qOffset = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
    ${S&&f?"let pastKeyOffset = absKvHeadIdx * uniforms.past_sequence_length * uniforms.K;":""};
    let kOffset = absKvHeadIdx * uniforms.kv_sequence_length * uniforms.K;
    ${f?"let presentKeyOffset = absKvHeadIdx * uniforms.N * uniforms.K;":""}
    var value = ${pe}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (global_id.y < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = q[qOffset + local_id.y * uniforms.K + w + local_id.x];
      }
      if (n + local_id.y < uniforms.N && w + local_id.x < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
      ${S&&f?`
              if (n + local_id.y < past_sequence_length) {
                tileK[idx] = past_key[pastKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
              } else if (n + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
                tileK[idx] = key[kOffset + (n + local_id.y - past_sequence_length) * uniforms.K + w + local_id.x];
              }`:`
          if (n + local_id.y < uniforms.kv_sequence_length) {
            tileK[idx] = key[kOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
          }`}
      ${f?`if (n + local_id.y < present_sequence_length) {
        present_key[presentKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x] = tileK[idx];
      }`:""}
      }
      workgroupBarrier();

      for (var k: u32 = 0u; k < TILE_SIZE && w+k < uniforms.K; k++) {
          value += ${pe}(tileQ[TILE_SIZE * local_id.y + k] * tileK[TILE_SIZE * local_id.x + k]);
      }

      workgroupBarrier();
    }

    if (global_id.y < uniforms.M && global_id.x < total_sequence_length) {
      let headOffset = workgroup_id.z * uniforms.M * uniforms.N;
      let outputIdx = headOffset + global_id.y * uniforms.N + global_id.x;
      var sum: f32 = ${(()=>{switch(x){case 1:return"value";case 2:return"value.x + value.y";case 4:return"value.x + value.y + value.z + value.w";default:throw new Error(`Unsupported components: ${x}`)}})()};
        output[outputIdx] = ${ce.type.value} (sum * uniforms.alpha) + ${a?"attention_bias[outputIdx]":"0.0"};
    }
  }`};return{name:"AttentionProbs",shaderCache:{hint:`${x};${a!==void 0};${i!==void 0};${e}`,inputDependencies:A},getRunData:()=>({outputs:I,dispatchGroup:k,programUniforms:E}),getShaderSource:z}},Yp=(e,t,r,i,a,n,s=void 0,u=void 0)=>{let l=n+a.kvSequenceLength,d=a.nReps?a.nReps:1,h=a.vHiddenSize*d,f=e>1&&i,g=a.kvNumHeads?a.kvNumHeads:a.numHeads,y=f?[a.batchSize,g,l,a.headSize]:void 0,_=[a.batchSize,a.sequenceLength,h],w=12,x={x:Math.ceil(a.vHeadSize/w),y:Math.ceil(a.sequenceLength/w),z:a.batchSize*a.numHeads},$=[{type:12,data:a.sequenceLength},{type:12,data:l},{type:12,data:a.vHeadSize},{type:12,data:a.numHeads},{type:12,data:a.headSize},{type:12,data:h},{type:12,data:n},{type:12,data:a.kvSequenceLength},{type:12,data:d}],v=f&&i&&R.size(i.dims)>0,k=["type","type"];v&&k.push("type"),s&&k.push("type"),u&&k.push("type");let E=[{dims:_,dataType:t.dataType,gpuDataType:0}];f&&E.push({dims:y,dataType:t.dataType,gpuDataType:0});let S=A=>{let I=N("probs",t.dataType,t.dims),z=N("v",r.dataType,r.dims),M=[I,z];v&&M.push(N("past_value",i.dataType,i.dims));let V=s?N("seq_lens",s.dataType,s.dims):void 0;s&&M.push(V);let ee=u?N("total_sequence_length_input",u.dataType,u.dims):void 0;u&&M.push(ee);let q=[K("output",t.dataType,_)];f&&q.push(K("present_value",t.dataType,y));let G=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"v_hidden_size",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${w}u;
  var<workgroup> tileQ: array<${I.type.value}, ${w*w}>;
  var<workgroup> tileV: array<${I.type.value}, ${w*w}>;
  ${A.registerUniforms(G).declareVariables(...M,...q)}
  ${A.mainStart([w,w,1])}
   let headIdx = workgroup_id.z % uniforms.num_heads;
   let batchIdx = workgroup_id.z / uniforms.num_heads;
   let kvHeadIdx = ${d===1?"headIdx":"headIdx / uniforms.n_reps"};
   let kv_num_heads = ${d===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
   let m = global_id.y;
   let n = global_id.x;
   let sequence_length = uniforms.M;
   var total_sequence_length = uniforms.K;
   ${ma(V,ee,!0)}
   let offsetA = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
   let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx; // kvHeadIdx is relative to the batch
   ${v&&f?"let pastValueOffset = absKvHeadIdx * uniforms.N * uniforms.past_sequence_length + n;":""};
   let vOffset = absKvHeadIdx * uniforms.N * uniforms.kv_sequence_length + n;
   ${f?"let presentValueOffset = absKvHeadIdx * uniforms.N * uniforms.K + n;":""}
   var value = ${I.type.storage}(0);
   for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = probs[offsetA + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
        ${v&&f?`
        if (w + local_id.y < past_sequence_length) {
          tileV[idx] = past_value[pastValueOffset + (w + local_id.y) * uniforms.N];
        } else if (w + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
          tileV[idx] = v[vOffset + (w + local_id.y - past_sequence_length) * uniforms.N];
        }
      `:`
            if (w + local_id.y < uniforms.kv_sequence_length) {
              tileV[idx] = v[vOffset + (w + local_id.y) * uniforms.N];
            }`}
        ${f?`
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
  }`};return{name:"AttentionScore",shaderCache:{hint:`${i!==void 0};${e}`,inputDependencies:k},getRunData:()=>({outputs:E,dispatchGroup:x,programUniforms:$}),getShaderSource:S}},Vn=(e,t,r,i,a,n,s,u,l,d,h=void 0,f=void 0)=>{let g=Math.min(e.outputCount,1+(s?1:0)+(u?1:0)),y=g>1?d.pastSequenceLength:0,_=y+d.kvSequenceLength,w=l&&R.size(l.dims)>0?l:void 0,x=[t,r];g>1&&s&&R.size(s.dims)>0&&x.push(s),w&&x.push(w),h&&x.push(h),f&&x.push(f);let $=e.compute(Xp(g,t,r,s,w,d,y,h,f),{inputs:x,outputs:g>1?[-1,1]:[-1]})[0];e.compute(Kp($,d.batchSize,d.numHeads,y,d.sequenceLength,_,h,f),{inputs:h&&f?[$,h,f]:[$],outputs:[]});let v=[$,i];g>1&&u&&R.size(u.dims)>0&&v.push(u),h&&v.push(h),f&&v.push(f),e.compute(Yp(g,$,i,u,d,y,h,f),{inputs:v,outputs:g>1?[0,2]:[0]})},Zp=(e,t)=>{let r=[t.batchSize,t.numHeads,t.sequenceLength,t.headSize],i=t.sequenceLength,a=t.inputHiddenSize,n=t.headSize,s=12,u={x:Math.ceil(t.headSize/s),y:Math.ceil(t.sequenceLength/s),z:t.batchSize*t.numHeads},l=[e.inputs[0],e.inputs[1],e.inputs[2]],d=[{type:12,data:i},{type:12,data:a},{type:12,data:n},{type:12,data:t.numHeads},{type:12,data:t.headSize},{type:12,data:t.hiddenSize},{type:12,data:t.hiddenSize+t.hiddenSize+t.vHiddenSize}],h=f=>{let g=K("output_q",l[0].dataType,r),y=K("output_k",l[0].dataType,r),_=K("output_v",l[0].dataType,r),w=N("input",l[0].dataType,l[0].dims),x=N("weight",l[1].dataType,l[1].dims),$=N("bias",l[2].dataType,l[2].dims),v=w.type.storage,k=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"hidden_size",type:"u32"},{name:"ldb",type:"u32"}];return`
  const TILE_SIZE = ${s}u;
  var<workgroup> tileInput: array<${v}, ${s*s}>;
  var<workgroup> tileWeightQ: array<${v}, ${s*s}>;
  var<workgroup> tileWeightK: array<${v}, ${s*s}>;
  var<workgroup> tileWeightV: array<${v}, ${s*s}>;
  ${f.registerUniforms(k).declareVariables(w,x,$,g,y,_)}
  ${f.mainStart([s,s,1])}
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
  }`};return e.compute({name:"AttentionPrepare",shaderCache:{inputDependencies:["type","type","type"]},getRunData:()=>({outputs:[{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0}],dispatchGroup:u,programUniforms:d}),getShaderSource:h},{inputs:l,outputs:[-1,-1,-1]})},A0=(e,t)=>{let r=Hp(e.inputs,t),[i,a,n]=Zp(e,r);return Vn(e,i,a,n,e.inputs[4],void 0,void 0,void 0,e.inputs[5],r)}}),Qp,Jp,ef,I0,O4=U(()=>{qt(),le(),he(),je(),fe(),Qp=(e,t)=>{if(!e||e.length!==5)throw new Error("BatchNormalization requires 5 inputs");let r=(i,a,n)=>{let s=a.length;if(s!==i.length)throw new Error(`${n}: num dimensions != ${s}`);a.forEach((u,l)=>{if(u!==i[l])throw new Error(`${n}: dim[${l}] do not match`)})};if(e[0].dims.length>1){let i=t.format==="NHWC"?t.spatial?e[0].dims.slice(-1):e[0].dims.slice(-1).concat(e[0].dims.slice(1,e[0].dims.length-1)):e[0].dims.slice(1,t.spatial?2:void 0);r(e[1].dims,i,"Invalid input scale"),r(e[2].dims,i,"Invalid input B"),r(e[3].dims,i,"Invalid input mean"),r(e[4].dims,i,"Invalid input var")}else r(e[1].dims,[1],"Invalid input scale"),r(e[2].dims,[1],"Invalid input B"),r(e[3].dims,[1],"Invalid input mean"),r(e[4].dims,[1],"Invalid input var")},Jp=(e,t)=>{let{epsilon:r,spatial:i,format:a}=t,n=e[0].dims,s=i?Fe(n[n.length-1]):1,u=a==="NHWC"&&n.length>1?s:1,l=R.size(n)/s,d=i,h=d?n.length:n,f=N("x",e[0].dataType,e[0].dims,s),g=N("scale",e[1].dataType,e[1].dims,u),y=N("bias",e[2].dataType,e[2].dims,u),_=N("inputMean",e[3].dataType,e[3].dims,u),w=N("inputVar",e[4].dataType,e[4].dims,u),x=K("y",e[0].dataType,h,s),$=()=>{let k="";if(i)k=`let cOffset = ${n.length===1?"0u":a==="NHWC"?`outputIndices[${n.length-1}] / ${s}`:"outputIndices[1]"};`;else if(a==="NCHW")k=`
            ${x.indicesSet("outputIndices","0","0")}
            let cOffset = ${x.indicesToOffset("outputIndices")};`;else{k=`var cIndices = ${g.type.indices}(0);
                       cIndices[0] = outputIndices[${n.length-1}];`;for(let E=1;E<g.rank;E++)k+=`cIndices[${E}] = outputIndices[${E}];`;k+=`let cOffset = ${g.indicesToOffset("cIndices")};`}return k},v=k=>`
  const epsilon = ${r};
  ${k.registerUniform("outputSize","u32").declareVariables(f,g,y,_,w,x)}
  ${k.mainStart()}
  ${k.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
    var outputIndices = ${x.offsetToIndices(`global_idx * ${s}`)};
    ${$()}
    let scale = ${g.getByOffset("cOffset")};
    let bias = ${y.getByOffset("cOffset")};
    let inputMean = ${_.getByOffset("cOffset")};
    let inputVar = ${w.getByOffset("cOffset")};
    let x = ${f.getByOffset("global_idx")};
    let value = (x - inputMean) * inverseSqrt(inputVar + epsilon) * scale + bias;
    ${x.setByOffset("global_idx","value")}
  }`;return{name:"BatchNormalization",shaderCache:{hint:`${t.epsilon}_${t.format}_${i}_${s}`,inputDependencies:d?["rank","type","type","type","type"]:void 0},getShaderSource:v,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:d?[{type:12,data:l},...J(n)]:[{type:12,data:l}]})}},ef=e=>xe(e),I0=(e,t)=>{let{inputs:r,outputCount:i}=e,a=ef({...t,outputCount:i});if(Ae.webgpu.validateInputContent&&Qp(r,a),t.trainingMode)throw new Error("BatchNormalization trainingMode is not supported yet.");e.compute(Jp(r,a))}}),tf,rf,z0,R4=U(()=>{he(),fe(),tf=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![320,640,1280].includes(e[0].dims[2]))throw new Error("number of channels should be 320, 640 or 1280");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},rf=e=>{let t=e[0].dims,r=e[0].dims[2],i=R.size(t)/4,a=e[0].dataType,n=N("input",a,t,4),s=N("bias",a,[r],4),u=N("residual",a,t,4),l=K("output",a,t,4);return{name:"BiasAdd",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(i/64)}}),getShaderSource:d=>`
  const channels = ${r}u / 4;
  ${d.declareVariables(n,s,u,l)}

  ${d.mainStart()}
    ${d.guardAgainstOutOfBoundsWorkgroupSizes(i)}
    let value = ${n.getByOffset("global_idx")}
      + ${s.getByOffset("global_idx % channels")} + ${u.getByOffset("global_idx")};
    ${l.setByOffset("global_idx","value")}
  }`}},z0=e=>{tf(e.inputs),e.compute(rf(e.inputs))}}),nf,we,O0,R0,M0,B0,N0,D0,P0,L0,U0,af,F0,V0,W0,G0,zn,j0,Ra,q0,H0,K0,X0,Y0,Z0,Q0,J0,e3,t3,r3,i3,n3,a3,s3,o3,Bo,u3,Bu,Nu,l3,d3,c3,sf,of,h3,hd=U(()=>{le(),he(),je(),fe(),nf=(e,t,r,i,a,n,s)=>{let u=Math.ceil(t/4),l="";typeof a=="string"?l=`${a}(a)`:l=a("a");let d=N("inputData",r,[u],4),h=K("outputData",i,[u],4),f=[{name:"vec_size",type:"u32"}];return s&&f.push(...s),`
      ${e.registerUniforms(f).declareVariables(d,h)}

  ${n??""}

  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}

    let a = ${d.getByOffset("global_idx")};
    ${h.setByOffset("global_idx",l)}
  }`},we=(e,t,r,i,a,n=e.dataType,s,u)=>{let l=[{type:12,data:Math.ceil(R.size(e.dims)/4)}];return s&&l.push(...s),{name:t,shaderCache:{hint:a,inputDependencies:["type"]},getShaderSource:d=>nf(d,R.size(e.dims),e.dataType,n,r,i,u),getRunData:d=>({outputs:[{dims:e.dims,dataType:n}],dispatchGroup:{x:Math.ceil(R.size(d[0].dims)/64/4)},programUniforms:l})}},O0=e=>{e.compute(we(e.inputs[0],"Abs","abs"))},R0=e=>{e.compute(we(e.inputs[0],"Acos","acos"))},M0=e=>{e.compute(we(e.inputs[0],"Acosh","acosh"))},B0=e=>{e.compute(we(e.inputs[0],"Asin","asin"))},N0=e=>{e.compute(we(e.inputs[0],"Asinh","asinh"))},D0=e=>{e.compute(we(e.inputs[0],"Atan","atan"))},P0=e=>{e.compute(we(e.inputs[0],"Atanh","atanh"))},L0=e=>xe(e),U0=(e,t)=>{let r;switch(t.to){case 10:r="vec4<f16>";break;case 1:r="vec4<f32>";break;case 12:r="vec4<u32>";break;case 6:r="vec4<i32>";break;case 9:r="vec4<bool>";break;default:throw new RangeError(`not supported type (specified in attribute 'to' from 'Cast' operator): ${t.to}`)}e.compute(we(e.inputs[0],"Cast",r,void 0,t.cacheKey,t.to))},af=e=>{let t,r,i=e.length>=2&&e[1].data!==0,a=e.length>=3&&e[2].data!==0;switch(e[0].dataType){case 1:t=i?e[1].getFloat32Array()[0]:-34028234663852886e22,r=a?e[2].getFloat32Array()[0]:34028234663852886e22;break;case 10:t=i?e[1].getUint16Array()[0]:64511,r=a?e[2].getUint16Array()[0]:31743;break;default:throw new Error("Unsupport data type")}return xe({min:t,max:r})},F0=(e,t)=>{let r=t||af(e.inputs),i=ut(e.inputs[0].dataType);e.compute(we(e.inputs[0],"Clip",a=>`clamp(${a}, vec4<${i}>(uniforms.min), vec4<${i}>(uniforms.max))`,void 0,r.cacheKey,void 0,[{type:e.inputs[0].dataType,data:r.min},{type:e.inputs[0].dataType,data:r.max}],[{name:"min",type:i},{name:"max",type:i}]),{inputs:[0]})},V0=e=>{e.compute(we(e.inputs[0],"Ceil","ceil"))},W0=e=>{e.compute(we(e.inputs[0],"Cos","cos"))},G0=e=>{e.compute(we(e.inputs[0],"Cosh","cosh"))},zn=e=>xe(e),j0=(e,t)=>{let r=ut(e.inputs[0].dataType);e.compute(we(e.inputs[0],"Elu",i=>`elu_vf32(${i})`,`
  const elu_alpha_ = ${r}(${t.alpha});

  fn elu_f32(a: ${r}) -> ${r} {
  return select((exp(a) - 1.0) * elu_alpha_, a, a >= 0.0);
  }

  fn elu_vf32(v: vec4<${r}>) -> vec4<${r}> {
  return vec4(elu_f32(v.x), elu_f32(v.y), elu_f32(v.z), elu_f32(v.w));
  }`,t.cacheKey))},Ra=(e="f32")=>`
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
}`,q0=e=>{let t=ut(e.inputs[0].dataType);e.compute(we(e.inputs[0],"Erf",r=>`erf_vf32(${r})`,Ra(t)))},H0=e=>{e.compute(we(e.inputs[0],"Exp","exp"))},K0=e=>{e.compute(we(e.inputs[0],"Floor","floor"))},X0=e=>{let t=ut(e.inputs[0].dataType);e.compute(we(e.inputs[0],"Gelu",r=>`0.5 * ${r} * (1.0 + erf_vf32(${r} * 0.7071067811865475))`,Ra(t)))},Y0=(e,t)=>{let r=ut(e.inputs[0].dataType);e.compute(we(e.inputs[0],"LeakyRelu",i=>`select(leaky_relu_alpha_ * ${i}, ${i}, ${i} >= vec4<${r}>(0.0))`,`const leaky_relu_alpha_ = ${r}(${t.alpha});`,t.cacheKey))},Z0=e=>{e.compute(we(e.inputs[0],"Not",t=>`!${t}`))},Q0=e=>{e.compute(we(e.inputs[0],"Neg",t=>`-${t}`))},J0=e=>{e.compute(we(e.inputs[0],"Reciprocal",t=>`1.0/${t}`))},e3=e=>{let t=ut(e.inputs[0].dataType);e.compute(we(e.inputs[0],"Relu",r=>`select(vec4<${t}>(0.0), ${r}, ${r} > vec4<${t}>(0.0))`))},t3=e=>{e.compute(we(e.inputs[0],"Sigmoid",t=>`(1.0 / (1.0 + exp(-${t})))`))},r3=e=>xe(e),i3=(e,t)=>{let r=ut(e.inputs[0].dataType);e.compute(we(e.inputs[0],"HardSigmoid",i=>`max(vec4<${r}>(0.0), min(vec4<${r}>(1.0), ${t.alpha} * ${i} + vec4<${r}>(${t.beta})))`,void 0,t.cacheKey))},n3=e=>{e.compute(we(e.inputs[0],"Sin","sin"))},a3=e=>{e.compute(we(e.inputs[0],"Sinh","sinh"))},s3=e=>{e.compute(we(e.inputs[0],"Sqrt","sqrt"))},o3=e=>{e.compute(we(e.inputs[0],"Tan","tan"))},Bo=e=>`sign(${e}) * (1 - exp(-2 * abs(${e}))) / (1 + exp(-2 * abs(${e})))`,u3=e=>{e.compute(we(e.inputs[0],"Tanh",Bo))},Bu=(e="f32")=>`
const fast_gelu_a: ${e} = 0.5;
const fast_gelu_b: ${e} = 0.7978845608028654;
const fast_gelu_c: ${e} = 0.035677408136300125;

fn tanh_v(v: vec4<${e}>) -> vec4<${e}> {
  return ${Bo("v")};
}
`,Nu=e=>`(fast_gelu_a + fast_gelu_a * tanh_v(${e} * (fast_gelu_c * ${e} * ${e} + fast_gelu_b))) * ${e}`,l3=e=>{let t=ut(e.inputs[0].dataType);e.compute(we(e.inputs[0],"FastGelu",Nu,Bu(t),void 0,e.inputs[0].dataType))},d3=(e,t)=>{let r=ut(e.inputs[0].dataType);return e.compute(we(e.inputs[0],"ThresholdedRelu",i=>`select(vec4<${r}>(0.0), ${i}, ${i} > thresholded_relu_alpha_)`,`const thresholded_relu_alpha_ = vec4<${r}>(${t.alpha});`,t.cacheKey)),0},c3=e=>{e.compute(we(e.inputs[0],"Log","log"))},sf=(e,t)=>`
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
`,of=e=>`quick_gelu_impl(${e})`,h3=(e,t)=>{let r=ut(e.inputs[0].dataType);e.compute(we(e.inputs[0],"QuickGelu",of,sf(r,t.alpha),t.cacheKey,e.inputs[0].dataType))}}),uf,lf,p3,M4=U(()=>{he(),fe(),hd(),uf=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![2560,5120,10240].includes(e[0].dims[2]))throw new Error("hidden state should be 2560, 5120 or 10240");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},lf=e=>{let t=e[0].dims.slice();t[2]=t[2]/2;let r=N("input",e[0].dataType,e[0].dims,4),i=N("bias",e[0].dataType,[e[0].dims[2]],4),a=K("output",e[0].dataType,t,4),n=R.size(t)/4,s=it(e[0].dataType);return{name:"BiasSplitGelu",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(n/64)}}),getShaderSource:u=>`
  const M_SQRT2 = sqrt(2.0);
  const halfChannels = ${e[0].dims[2]/4/2}u;

  ${u.declareVariables(r,i,a)}

  ${Ra(s)}

  ${u.mainStart()}
    ${u.guardAgainstOutOfBoundsWorkgroupSizes(n)}
    let biasIdx = global_idx % halfChannels;
    let batchIndex = global_idx / halfChannels;
    let inputOffset = biasIdx + batchIndex * halfChannels * 2;
    let valueLeft = input[inputOffset] + bias[biasIdx];
    let valueRight = input[inputOffset + halfChannels] + bias[biasIdx + halfChannels];
    let geluRight = valueRight * 0.5 * (erf_vf32(valueRight / M_SQRT2) + 1);

    ${a.setByOffset("global_idx","valueLeft * geluRight")}
  }`}},p3=e=>{uf(e.inputs),e.compute(lf(e.inputs))}}),df,cf,Zt,f3,m3,g3,y3,_3,b3,w3,v3,$3,x3,B4=U(()=>{le(),he(),fe(),df=(e,t,r,i,a,n,s,u,l,d,h,f)=>{let g,y;typeof u=="string"?g=y=(v,k)=>`${u}((${v}),(${k}))`:typeof u=="function"?g=y=u:(g=u.scalar,y=u.vector);let _=K("outputData",h,i.length,4),w=N("aData",l,t.length,4),x=N("bData",d,r.length,4),$;if(a)if(n){let v=R.size(t)===1,k=R.size(r)===1,E=t.length>0&&t[t.length-1]%4===0,S=r.length>0&&r[r.length-1]%4===0;v||k?$=_.setByOffset("global_idx",y(v?`${w.type.value}(${w.getByOffset("0")}.x)`:w.getByOffset("global_idx"),k?`${x.type.value}(${x.getByOffset("0")}.x)`:x.getByOffset("global_idx"))):$=`
            let outputIndices = ${_.offsetToIndices("global_idx * 4u")};
            let offsetA = ${w.broadcastedIndicesToOffset("outputIndices",_)};
            let offsetB = ${x.broadcastedIndicesToOffset("outputIndices",_)};
            ${_.setByOffset("global_idx",y(s||E?w.getByOffset("offsetA / 4u"):`${w.type.value}(${w.getByOffset("offsetA / 4u")}[offsetA % 4u])`,s||S?x.getByOffset("offsetB / 4u"):`${x.type.value}(${x.getByOffset("offsetB / 4u")}[offsetB % 4u])`))}
          `}else $=_.setByOffset("global_idx",y(w.getByOffset("global_idx"),x.getByOffset("global_idx")));else{if(!n)throw new Error("no necessary to use scalar implementation for element-wise binary op implementation.");let v=(k,E,S="")=>{let A=`aData[indexA${E}][componentA${E}]`,I=`bData[indexB${E}][componentB${E}]`;return`
            let outputIndices${E} = ${_.offsetToIndices(`global_idx * 4u + ${E}u`)};
            let offsetA${E} = ${w.broadcastedIndicesToOffset(`outputIndices${E}`,_)};
            let offsetB${E} = ${x.broadcastedIndicesToOffset(`outputIndices${E}`,_)};
            let indexA${E} = offsetA${E} / 4u;
            let indexB${E} = offsetB${E} / 4u;
            let componentA${E} = offsetA${E} % 4u;
            let componentB${E} = offsetB${E} % 4u;
            ${k}[${E}] = ${S}(${g(A,I)});
          `};h===9?$=`
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
        ${e.registerUniform("vec_size","u32").declareVariables(w,x,_)}

        ${f??""}

        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${$}
      }`},cf=(e,t,r,i,a,n,s=r.dataType)=>{let u=r.dims.map(w=>Number(w)??1),l=i.dims.map(w=>Number(w)??1),d=!R.areEqual(u,l),h=u,f=R.size(u),g=!1,y=!1,_=[d];if(d){let w=Zi.calcShape(u,l,!1);if(!w)throw new Error("Can't perform binary op on the given tensors");h=w.slice(),f=R.size(h);let x=R.size(u)===1,$=R.size(l)===1,v=u.length>0&&u[u.length-1]%4===0,k=l.length>0&&l[l.length-1]%4===0;_.push(x),_.push($),_.push(v),_.push(k);let E=1;for(let S=1;S<h.length;S++){let A=u[u.length-S],I=l[l.length-S];if(A===I)E*=A;else break}E%4===0?(y=!0,g=!0):(x||$||v||k)&&(g=!0)}else g=!0;return _.push(g),{name:e,shaderCache:{hint:t+_.map(w=>w.toString()).join("_"),inputDependencies:["rank","rank"]},getShaderSource:w=>df(w,u,l,h,g,d,y,a,r.dataType,i.dataType,s,n),getRunData:()=>({outputs:[{dims:h,dataType:s}],dispatchGroup:{x:Math.ceil(f/64/4)},programUniforms:[{type:12,data:Math.ceil(R.size(h)/4)},...J(u,l,h)]})}},Zt=(e,t,r,i,a,n)=>{e.compute(cf(t,a??"",e.inputs[0],e.inputs[1],r,i,n))},f3=e=>{Zt(e,"Add",(t,r)=>`${t}+${r}`)},m3=e=>{Zt(e,"Div",(t,r)=>`${t}/${r}`)},g3=e=>{Zt(e,"Equal",{scalar:(t,r)=>`u32(${t}==${r})`,vector:(t,r)=>`vec4<u32>(${t}==${r})`},void 0,void 0,9)},y3=e=>{Zt(e,"Mul",(t,r)=>`${t}*${r}`)},_3=e=>{let t=N("input",e.inputs[0].dataType,e.inputs[0].dims).type.value;Zt(e,"Pow",{scalar:(r,i)=>`pow_custom(${r},${i})`,vector:(r,i)=>`pow_vector_custom(${r},${i})`},`
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
      `)},b3=e=>{Zt(e,"Sub",(t,r)=>`${t}-${r}`)},w3=e=>{Zt(e,"Greater",{scalar:(t,r)=>`u32(${t}>${r})`,vector:(t,r)=>`vec4<u32>(${t}>${r})`},void 0,void 0,9)},v3=e=>{Zt(e,"Less",{scalar:(t,r)=>`u32(${t}<${r})`,vector:(t,r)=>`vec4<u32>(${t}<${r})`},void 0,void 0,9)},$3=e=>{Zt(e,"GreaterOrEqual",{scalar:(t,r)=>`u32(${t}>=${r})`,vector:(t,r)=>`vec4<u32>(${t}>=${r})`},void 0,void 0,9)},x3=e=>{Zt(e,"LessOrEqual",{scalar:(t,r)=>`u32(${t}<=${r})`,vector:(t,r)=>`vec4<u32>(${t}<=${r})`},void 0,void 0,9)}}),hf,pf,ff,mf,T3,k3,N4=U(()=>{le(),he(),je(),fe(),hf=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");let r=0,i=e[r],a=i.dataType,n=i.dims.length;e.forEach((s,u)=>{if(u!==r){if(s.dataType!==a)throw new Error("input tensors should be one type");if(s.dims.length!==n)throw new Error("input tensors should have the same shape");s.dims.forEach((l,d)=>{if(d!==t&&l!==i.dims[d])throw new Error("non concat dimensions must match")})}})},pf=(e,t)=>`
  fn calculateInputIndex(index: u32) -> u32 {
    let sizeInConcatAxis = array<u32, ${e}u>(${t});
    for (var i: u32 = 0u; i < ${e}; i += 1u ) {
      if (index < sizeInConcatAxis[i]) {
        return i;
      }
    }
    return ${e}u;
  }`,ff=(e,t)=>{let r=e.length,i=[];for(let a=0;a<r;++a){let n=t.setByOffset("global_idx",e[a].getByIndices("indices"));r===1?i.push(n):a===0?i.push(`if (inputIndex == ${a}u) { ${n} }`):a===r-1?i.push(`else { ${n} }`):i.push(`else if (inputIndex == ${a}) { ${n} }`)}return i.join(`
`)},mf=(e,t,r,i)=>{let a=R.size(r),n=new Array(e.length),s=new Array(e.length),u=0,l=[],d=[],h=[{type:12,data:a}];for(let w=0;w<e.length;++w)u+=e[w].dims[t],n[w]=u,d.push(e[w].dims.length),s[w]=N(`input${w}`,i,d[w]),l.push("rank"),h.push({type:12,data:n[w]});for(let w=0;w<e.length;++w)h.push(...J(e[w].dims));h.push(...J(r));let f=K("output",i,r.length),g=f.indicesGet("indices",t),y=Array.from(Array(n.length).keys()).map(w=>`uniforms.sizeInConcatAxis${w}`).join(","),_=w=>`

  ${(()=>{w.registerUniform("outputSize","u32");for(let x=0;x<e.length;x++)w.registerUniform(`sizeInConcatAxis${x}`,"u32");return w.declareVariables(...s,f)})()}

  ${pf(n.length,y)}

  ${w.mainStart()}
    ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

    var indices = ${f.offsetToIndices("global_idx")};

    let inputIndex = calculateInputIndex(${g});
    if (inputIndex != 0u) {
      let sizeInConcatAxis = array<u32, ${n.length}u>(${y});
      ${g} -= sizeInConcatAxis[inputIndex - 1u];
    }

    ${ff(s,f)}
  }`;return{name:"Concat",shaderCache:{hint:`${t}`,inputDependencies:l},getRunData:()=>({outputs:[{dims:r,dataType:i}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:h}),getShaderSource:_}},T3=(e,t)=>{let r=e.inputs,i=r[0].dims,a=R.normalizeAxis(t.axis,i.length);hf(r,a);let n=i.slice();n[a]=r.reduce((u,l)=>u+(l.dims.length>a?l.dims[a]:0),0);let s=r.filter(u=>R.size(u.dims)>0);e.compute(mf(s,a,n,r[0].dataType),{inputs:s})},k3=e=>xe({axis:e.axis})}),$i,xi,Ti,pd,Si=U(()=>{le(),he(),$i=(e,t,r="f32")=>{switch(e.activation){case"Relu":return`value = max(value, ${t}(0.0));`;case"Sigmoid":return`value = (${t}(1.0) / (${t}(1.0) + exp(-value)));`;case"Clip":return`value = clamp(value, ${t}(${r}(uniforms.clip_min)), ${t}(${r}(uniforms.clip_max)));`;case"HardSigmoid":return`value = max(${t}(0.0), min(${t}(1.0), ${r}(uniforms.alpha) * value + ${r}(uniforms.beta)));`;case"LeakyRelu":return`value = select(${r}(uniforms.alpha) * value, value, value >= ${t}(0.0));`;case"Tanh":return`let e2x = exp(-2.0 * abs(value));
              value = sign(value) * (1.0 - e2x) / (1.0 + e2x);
        `;case"":return"";default:throw new Error(`Unsupported activation ${e.activation}`)}},xi=(e,t)=>{e.activation==="Clip"?t.push({type:1,data:e.clipMax},{type:1,data:e.clipMin}):e.activation==="HardSigmoid"?t.push({type:1,data:e.alpha},{type:1,data:e.beta}):e.activation==="LeakyRelu"&&t.push({type:1,data:e.alpha})},Ti=(e,t)=>{e.activation==="Clip"?t.push({name:"clip_max",type:"f32"},{name:"clip_min",type:"f32"}):e.activation==="HardSigmoid"?t.push({name:"alpha",type:"f32"},{name:"beta",type:"f32"}):e.activation==="LeakyRelu"&&t.push({name:"alpha",type:"f32"})},pd=e=>{let t=(e==null?void 0:e.activation)||"";if(t==="HardSigmoid"){let[r,i]=(e==null?void 0:e.activation_params)||[.2,.5];return{activation:t,alpha:r,beta:i}}else if(t==="Clip"){let[r,i]=(e==null?void 0:e.activation_params)||[Zg,Qg];return{activation:t,clipMax:i,clipMin:r}}else if(t==="LeakyRelu"){let[r]=(e==null?void 0:e.activation_params)||[.01];return{activation:t,alpha:r}}return{activation:t}}}),ot,E3,fd=U(()=>{ot=(e,t)=>{switch(e){case 1:return t;case 2:return`vec2<${t}>`;case 3:return`vec3<${t}>`;case 4:return`vec4<${t}>`;default:throw new Error(`${e}-component is not supported.`)}},E3=e=>`
      ${e?"value = value + getBiasByOutputCoords(coords);":""}
      `}),S3,D4=U(()=>{S3=e=>`
fn getIndexFromCoords4D(coords : vec4<i32>, shape : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
      shape.y * shape.z * shape.w, shape.z * shape.w, shape.w, 1));
}
fn getOutputIndexFromCoords(coords : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
    i32(${e}.x), i32(${e}.y), i32(${e}.z), 1));
}
`}),Nn,md,gd=U(()=>{le(),he(),fe(),Si(),Nn=(e,t,r,i,a)=>{let n=i-r;return`
      ${Array.from({length:r}).map((s,u)=>`
      if (${Q(t.shape,u,t.rank)} != 1) {
        ${t.indicesSet(e,u,Q(a,u+n,i))}
      } else {
        ${t.indicesSet(e,u,0)}
      }`).join("")}
`},md=(e,t,r,i,a=!1,n)=>{let s=e[0].dims,u=e[1].dims,l=s[s.length-2],d=u[u.length-1],h=s[s.length-1],f=Fe(d),g=Fe(h),y=Fe(l),_=R.size(r)/f/y,w=e.length>2,x=i?i.slice(0,-2):r.slice(0,-2),$=[R.size(x),l,d],v=[{type:12,data:_},{type:12,data:l},{type:12,data:d},{type:12,data:h}];xi(t,v),v.push(...J(x,s,u)),w&&v.push(...J(e[2].dims)),v.push(...J($));let k=E=>{let S=ld("batch_dims",e[0].dataType,x.length),A=N("a",e[0].dataType,s.length,g),I=N("b",e[1].dataType,u.length,f),z=K("output",e[0].dataType,$.length,f),M=it(z.type.tensor),V=$i(t,z.type.value,M),ee=[A,I],q="";if(w){let ce=a?f:1;ee.push(N("bias",e[2].dataType,e[2].dims.length,ce)),q=`${a?`value += bias[col / ${ce}];`:`value += ${z.type.value}(bias[row + i]);`}`}let G=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"}];Ti(t,G);let ge=()=>{let ce=`var a_data: ${A.type.value};`;for(let Y=0;Y<g;Y++)ce+=`
              let b_data${Y} = b[(b_offset + (k + ${Y}) * uniforms.N + col) / ${f}];`;for(let Y=0;Y<y;Y++){ce+=`a_data = a[(a_offset + (row + ${Y}) * uniforms.K + k) / ${g}];`;for(let pe=0;pe<g;pe++)ce+=`
            values[${Y}] = fma(${I.type.value}(a_data${g===1?"":`[${pe}]`}), b_data${pe}, values[${Y}]);
`}return ce};return`
  ${E.registerUniforms(G).registerInternalVariables(S).declareVariables(...ee,z)}
  ${E.mainStart()}
    ${E.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let col = (global_idx % (uniforms.N / ${f})) * ${f};
    var index1 = global_idx / (uniforms.N / ${f});
    let stride1 = uniforms.M / ${y};
    let row = (index1 % stride1) * ${y};
    let batch = index1 / stride1;

    ${r.length===2?"":`let batch_indices = ${S.offsetToIndices("batch")};`}

    var a_indices: ${A.type.indices};
    ${Nn("a_indices",A,A.rank-2,S.rank,"batch_indices")}
    ${A.indicesSet("a_indices",A.rank-2,0)}
    ${A.indicesSet("a_indices",A.rank-1,0)}
    let a_offset = ${A.indicesToOffset("a_indices")};

    var b_indices: ${I.type.indices};
    ${Nn("b_indices",I,I.rank-2,S.rank,"batch_indices")}
    ${I.indicesSet("b_indices",I.rank-2,0)}
    ${I.indicesSet("b_indices",I.rank-1,0)}
    let b_offset = ${I.indicesToOffset("b_indices")};
    var values: array<${z.type.value}, ${y}>;
    for (var k: u32 = 0u; k < uniforms.K; k = k + ${g}) {
      ${ge()}
    }
    for (var i = 0u; i < ${y}u; i++) {
      var value = values[i];
      ${q}
      ${V}
      let cur_indices = ${z.type.indices}(batch, row + i, col);
      let offset = ${z.indicesToOffset("cur_indices")};
      ${z.setByOffset(`offset / ${f}`,"value")};
    }
  }
  `};return{name:"MatMulNaive",shaderCache:{hint:`${t.activation};${f};${g};${y};${a}`,inputDependencies:w?["rank","rank","rank"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:n?n(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(_/64)},programUniforms:v}),getShaderSource:k}}}),gf,yf,Du,No,_f,Pu,bf,Xa,yd=U(()=>{le(),he(),fe(),Si(),gd(),fd(),gf=(e,t)=>e?`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          kStart + inputRow,
          globalRowStart / innerElementSize + inputCol${t?", batchIndices":""});
        `:`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          globalRow + innerRow,
          kStart / innerElementSize + inputCol${t?", batchIndices":""});
        `,yf=(e,t)=>e?`
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
        }`,Du=(e,t,r="f32",i,a=!1,n=32,s=!1,u=32)=>{let l=t[1]*e[1],d=t[0]*e[0],h=a?l:n,f=a?n:l,g=h/t[0],y=n/t[1];if(!((a&&g===4&&e[1]===4||!a&&(g===3||g===4))&&h%t[0]===0&&n%t[1]===0&&e[0]===4))throw new Error(`If transposeA ${a} is true, innerElementSize ${g} and workPerThread[1] ${e[1]} must be 4.
      Otherwise, innerElementSize ${g} must be 3 or 4.
  tileAWidth ${h} must be divisible by workgroupSize[0]${t[0]}. tileInner ${n} must be divisible by workgroupSize[1] ${t[1]}. colPerThread ${e[0]} must be 4.`);return`
var<workgroup> mm_Asub: array<array<vec${g}<${r}>, ${h/g}>, ${f}>;
var<workgroup> mm_Bsub: array<array<vec4<${r}>, ${d/e[0]}>, ${n}>;

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
  let tileRowB = localRow * ${y};
  for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let inputRow = tileRow + innerRow;
          let inputCol = tileCol;
          ${gf(a,i)}
      }

      // Load one tile of B into local memory.
      for (var innerRow = 0; innerRow < ${y}; innerRow = innerRow + 1) {
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

          ${yf(a,g)}
      }

      workgroupBarrier();
  }

  for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      mm_write(batch, globalRow + innerRow, globalCol, acc[innerRow]);
  }
}`},No=(e,t)=>e?`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              kStart + inputRow,
              globalRowStart + inputCol${t?", batchIndices":""});
            `:`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              globalRowStart + inputRow,
              kStart + inputCol${t?", batchIndices":""});
            `,_f=e=>e?"let ACached = mm_Asub[k][tileRow + innerRow];":"let ACached = mm_Asub[tileRow + innerRow][k];",Pu=(e,t,r="f32",i,a=!1,n=32,s=!1,u=32,l=!1)=>{let d=e[1]*t[1],h=e[0]*t[0],f=a?d:n,g=a?n:d;if(!(g%t[1]===0&&f%t[0]===0&&n%t[1]===0))throw new Error(`tileAHight ${g} must be divisible by workgroupSize[1]${t[1]}, tileAWidth ${f} must be divisible by workgroupSize[0]${t[0]}, tileInner ${n} must be divisible by workgroupSize[1]${t[1]}`);let y=g/t[1],_=f/t[0],w=n/t[1],x=l?`
    let localRow = i32(localId.y);
    let localCol = i32(localId.x);
    let globalRowStart = i32(workgroupId.y) * ${d};
    let globalColStart = i32(workgroupId.x) * ${h};

    // Loop over shared dimension.
    for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var inputRow = localRow; inputRow < ${g}; inputRow = inputRow + ${t[1]}) {
        for (var inputCol = localCol; inputCol < ${f}; inputCol = inputCol + ${t[0]}) {
          ${No(a,i)}
        }
      }
      // Load one tile of B into local memory.
      for (var inputRow = localRow; inputRow < ${n}; inputRow = inputRow + ${t[1]}) {
            for (var inputCol = localCol; inputCol < ${h}; inputCol = inputCol + ${t[0]}) {
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
let globalRowStart = i32(workgroupId.y) * ${d};

let tileRowA = i32(localId.y) * ${y};
let tileColA = i32(localId.x) * ${_};
let tileRowB = i32(localId.y) * ${w};
// Loop over shared dimension.
for (var t = 0; t < num_tiles; t = t + 1) {
  // Load one tile of A into local memory.
  for (var innerRow = 0; innerRow < ${y}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < ${_}; innerCol = innerCol + 1) {
      let inputRow = tileRowA + innerRow;
      let inputCol = tileColA + innerCol;
      ${No(a,i)}
    }
  }

  // Load one tile of B into local memory.
  for (var innerRow = 0; innerRow < ${w}; innerRow = innerRow + 1) {
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
      ${_f(a)}
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
  var<workgroup> mm_Asub : array<array<${r}, ${f}>, ${g}>;
  var<workgroup> mm_Bsub : array<array<${r}, ${h}>, ${n}>;
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
    ${x}
  }
`},bf=(e,t,r,i,a=!1)=>{let[n,s,u,l]=i,d=it(i[0].type.tensor);return`
    fn mm_readA(batch: i32, row: i32, colIn: i32, batchIndices: ${n.type.indices}) -> ${ot(e,d)} {
      var value = ${ot(e,d)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_a_outer && col < uniforms.dim_inner)
      {
        var aIndices: ${s.type.indices};
        ${Nn("aIndices",s,s.rank-2,n.rank,"batchIndices")}
        ${s.indicesSet("aIndices",s.rank-2,"u32(row)")}
        ${s.indicesSet("aIndices",s.rank-1,"u32(colIn)")}
        value = ${s.getByIndices("aIndices")};
      }
      return value;
    }

    fn mm_readB(batch: i32, row: i32, colIn: i32, batchIndices: ${n.type.indices}) -> ${ot(e,d)} {
      var value = ${ot(e,d)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_inner && col < uniforms.dim_b_outer)
      {
        var bIndices: ${u.type.indices};
        ${Nn("bIndices",u,u.rank-2,n.rank,"batchIndices")}
        ${u.indicesSet("bIndices",u.rank-2,"u32(row)")}
        ${u.indicesSet("bIndices",u.rank-1,"u32(colIn)")}
        value = ${u.getByIndices("bIndices")};
      }
      return value;
    }

    fn mm_write(batch: i32, row: i32, colIn: i32, valueIn: ${ot(e,d)}) {
      let col = colIn * ${e};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer) {
        var value = valueIn;
        let coords = vec3<i32>(batch, row, colIn);
        ${t?`value = value + ${a?"bias[colIn]":`${ot(e,d)}(bias[row])`};`:""}
        ${r}
        ${l.setByIndices("vec3<u32>(coords)","value")}
      }
    }
    `},Xa=(e,t,r,i,a=!1,n)=>{let s=e[0].dims,u=e[1].dims,l=s.slice(0,-2),d=u.slice(0,-2),h=i?i.slice(0,-2):r.slice(0,-2),f=R.size(h),g=s[s.length-2],y=s[s.length-1],_=u[u.length-1],w=y%4===0&&_%4===0,x=g<=8?[4,1,1]:[4,4,1],$=[8,8,1],v=[Math.ceil(_/$[0]/x[0]),Math.ceil(g/$[1]/x[1]),Math.ceil(f/$[2]/x[2])],k=w?4:1,E=[...l,g,y/k],S=E.length,A=[...d,y,_/k],I=A.length,z=[f,g,_/k],M=[{type:6,data:g},{type:6,data:_},{type:6,data:y}];xi(t,M),M.push(...J(h,E,A));let V=["rank","rank"],ee=e.length>2;ee&&(M.push(...J(e[2].dims)),V.push("rank")),M.push(...J(z));let q=G=>{let ge=h.length,ce=ld("batchDims",e[0].dataType,ge,1),Y=it(e[0].dataType),pe=N("a",e[0].dataType,S,k),Z=N("b",e[1].dataType,I,k),se=K("result",e[0].dataType,z.length,k),Se=[pe,Z];if(ee){let Ze=a?k:1;Se.push(N("bias",e[2].dataType,e[2].dims.length,Ze))}let D=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"}];Ti(t,D);let W=it(se.type.tensor),j=$i(t,se.type.value,W),ie=bf(k,ee,j,[ce,pe,Z,se],a);return`
  ${G.registerUniforms(D).registerInternalVariables(ce).declareVariables(...Se,se)}
  ${ie}
  ${w?Du(x,$,Y,ce):Pu(x,$,Y,ce)}
                   `};return{name:"MatMul",shaderCache:{hint:`${x};${t.activation};${w};${a}`,inputDependencies:V},getRunData:()=>({outputs:[{dims:n?n(r):r,dataType:e[0].dataType}],dispatchGroup:{x:v[0],y:v[1],z:v[2]},programUniforms:M}),getShaderSource:q}}}),wf,C3,P4=U(()=>{le(),Rr(),fe(),Si(),fd(),D4(),yd(),wf=(e,t,r,i,a=!1,n,s=4,u=4,l=4,d="f32")=>{let h=M=>{switch(M){case 1:return"resData = x[xIndex];";case 3:return`resData = vec3<${d}>(x[xIndex], x[xIndex + 1], x[xIndex + 2]);`;case 4:return"resData = x[xIndex / 4];";default:throw new Error(`innerElementSize ${M} is not supported.`)}},f=M=>{switch(M){case 1:return"return w[row * i32(uniforms.w_shape[3]) + colIn];";case 4:return"return w[row * i32(uniforms.w_shape[3]) / 4 + colIn];";default:throw new Error(`innerElementSize ${M} is not supported.`)}},g=e?`
    let coord = vec4<i32>(batch, xRow, xCol, xCh);
    `:`
    let coord = vec4<i32>(batch, xCh, xRow, xCol);
    `,y=e?`
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
    `,_=e?"i32(uniforms.x_shape[1])":"i32(uniforms.x_shape[2])",w=e?"i32(uniforms.x_shape[2])":"i32(uniforms.x_shape[3])",x=e?"row":"col",$=e?"col":"row",v=`
    let inChannels = i32(uniforms.w_shape[2]);
    let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
    let outRow = ${x} / outWidth;
    let outCol = ${x} % outWidth;

    let WRow = ${$} / (i32(uniforms.w_shape[1]) * inChannels);
    let WCol = ${$} / inChannels % i32(uniforms.w_shape[1]);
    let xRow = outRow * uniforms.stride[0] + uniforms.dilation[0] * WRow - uniforms.pad[0];
    let xCol = outCol * uniforms.stride[1] + uniforms.dilation[1] * WCol - uniforms.pad[1];
    let xCh = ${$} % inChannels;
    var resData = ${ot(s,d)}(0.0);
    // The bounds checking is always needed since we use it to pad zero for
    // the 'same' padding type.
    if (xRow >= 0 && xRow < ${_} && xCol >= 0 && xCol < ${w}) {
      ${g}
      let xIndex = getIndexFromCoords4D(coord, vec4<i32>(uniforms.x_shape));
      ${h(s)}
    }
    return resData;`,k=e?t&&i?`
    let col = colIn * ${s};
    ${v}`:`
    let col = colIn * ${s};
    if (row < uniforms.dim_a_outer && col < uniforms.dim_inner) {
      ${v}
    }
    return ${ot(s,d)}(0.0);`:i&&r?`
    let col = colIn * ${s};
    ${v}`:`
    let col = colIn * ${s};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${v}
    }
    return ${ot(s,d)}(0.0);`,E=e?i&&r?f(u):`
    let col = colIn * ${u};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${f(u)}
    }
    return ${ot(u,d)}(0.0);`:`
    let col = colIn * ${u};
    if (row < uniforms.dim_inner && col < uniforms.dim_a_outer) {
      ${f(u)}
    }
    return ${ot(u,d)}(0.0);`,S=ot(l,d),A=ot(e?s:u,d),I=ot(e?u:s,d),z=$i(n,S,d);return`
    fn mm_readA(batch: i32, row : i32, colIn : i32) -> ${A} {
      ${e?k:E}
    }

    fn mm_readB(batch: i32, row : i32, colIn : i32) -> ${I} {
      ${e?E:k}
    }

    fn mm_write(batch: i32, row : i32, colIn : i32, valueIn : ${S}) {
      let col = colIn * ${l};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer)
      {
      var value = valueIn;
      let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
      ${y}
      ${E3(a)}
      ${z}
      setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], value);
      }
    }`},C3=(e,t,r,i,a,n,s,u,l)=>{let d=t.format==="NHWC",h=d?e[0].dims[3]:e[0].dims[1],f=r[0],g=d?r[2]:r[3],y=d?r[1]:r[2],_=d?r[3]:r[1],w=d&&(h%4===0||h%3===0)&&_%4===0,x=d?_:g*y,$=d?g*y:_,v=[8,8,1],k=i<=8?[4,1,1]:[4,4,1],E=[Math.ceil(x/v[0]/k[0]),Math.ceil($/v[1]/k[1]),Math.ceil(f/v[2]/k[2])];ye("verbose",()=>`[conv2d_mm_webgpu] dispatch = ${E}`);let S=w?d&&h%4!==0?3:4:1,A=v[1]*k[1],I=v[0]*k[0],z=Math.max(v[0]*S,v[1]),M=i%A===0,V=a%I===0,ee=n%z===0,q=w?[S,4,4]:[1,1,1],G=[{type:6,data:i},{type:6,data:a},{type:6,data:n},{type:6,data:[t.pads[0],t.pads[1]]},{type:6,data:t.strides},{type:6,data:t.dilations}];xi(t,G),G.push(...J(e[0].dims,e[1].dims));let ge=["rank","rank"];s&&(G.push(...J(e[2].dims)),ge.push("rank")),G.push(...J(r));let ce=Y=>{let pe=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"},{name:"pad",type:"i32",length:2},{name:"stride",type:"i32",length:2},{name:"dilation",type:"i32",length:2}];Ti(t,pe);let Z=w?4:1,se=it(e[0].dataType),Se=`
      fn setOutputAtIndex(flatIndex : i32, value : ${w?`vec4<${se}>`:se}) {
        result[flatIndex] = ${w?`vec4<${se}>`:se}(value);
      }
      fn setOutputAtCoords(d0 : i32, d1 : i32, d2 : i32, d3 : i32, value : ${w?`vec4<${se}>`:se}) {
        let flatIndex = getOutputIndexFromCoords(vec4<i32>(d0, d1, d2, d3));
        setOutputAtIndex(flatIndex ${w?"/ 4":""}, value);
      }`,D=N("x",e[0].dataType,e[0].dims.length,S===3?1:S),W=N("w",e[1].dataType,e[1].dims.length,Z),j=[D,W],ie=K("result",e[0].dataType,r.length,Z);if(s){let Ze=N("bias",e[2].dataType,e[2].dims.length,Z);j.push(Ze),Se+=`
        fn getBiasByOutputCoords(coords : vec4<i32>) -> ${w?`vec4<${se}>`:se} {
          return bias[coords.${d?"w":"y"}${w?"/ 4":""}];
        }`}return`
        ${S3("uniforms.result_strides")}
        //struct Uniforms { xShape : vec4<i32>, wShape : vec4<i32>, outShape : vec4<i32>,
        //  outShapeStrides: vec3<i32>, filterDims : vec2<i32>, pad : vec2<i32>, stride : vec2<i32>,
        //  dilation : vec2<i32>, dimAOuter : i32, dimBOuter : i32, dimInner : i32 };
        ${Y.registerUniforms(pe).declareVariables(...j,ie)}
        ${Se}
        ${wf(d,M,V,ee,s,t,q[0],q[1],q[2],se)}
        ${w?Du(k,v,se,void 0,!d,z):Pu(k,v,se,void 0,!d,z,!1,void 0,u)}`};return{name:"Conv2DMatMul",shaderCache:{hint:`${t.cacheKey};${S};${w};${M};${V};${ee};${A};${I};${z}`,inputDependencies:ge},getRunData:()=>({outputs:[{dims:l?l(r):r,dataType:e[0].dataType}],dispatchGroup:{x:E[0],y:E[1],z:E[2]},programUniforms:G}),getShaderSource:ce}}}),vf,Do,wn,$f,Po,xf,A3,I3,L4=U(()=>{le(),Rr(),he(),fe(),Si(),fd(),vf=e=>{let t=1;for(let r=0;r<e.length;r++)t*=e[r];return t},Do=e=>typeof e=="number"?[e,e,e]:e,wn=(e,t)=>t<=1?e:e+(e-1)*(t-1),$f=(e,t,r,i=1)=>{let a=wn(t,i);return Math.floor((e[0]*(r-1)-r+a)/2)},Po=(e,t,r,i,a)=>{a==null&&(a=$f(e,t[0],i[0]));let n=[0,0,0,r];for(let s=0;s<3;s++)e[s]+2*a>=t[s]&&(n[s]=Math.trunc((e[s]-t[s]+2*a)/i[s]+1));return n},xf=(e,t,r,i,a,n,s,u,l,d)=>{let h,f,g,y;if(e==="VALID"&&(e=0),typeof e=="number"){h={top:e,bottom:e,left:e,right:e,front:e,back:e};let _=Po([t,r,i,1],[u,l,d],1,[a,n,s],e);f=_[0],g=_[1],y=_[2]}else if(Array.isArray(e)){if(!e.every((w,x,$)=>w===$[0]))throw Error(`Unsupported padding parameter: ${e}`);h={top:e[0],bottom:e[1],left:e[2],right:e[3],front:e[4],back:e[5]};let _=Po([t,r,i,1],[u,l,d],1,[a,n,s],e[0]);f=_[0],g=_[1],y=_[2]}else if(e==="SAME_UPPER"){f=Math.ceil(t/a),g=Math.ceil(r/n),y=Math.ceil(i/s);let _=(f-1)*a+u-t,w=(g-1)*n+l-r,x=(y-1)*s+d-i,$=Math.floor(_/2),v=_-$,k=Math.floor(w/2),E=w-k,S=Math.floor(x/2),A=x-S;h={top:k,bottom:E,left:S,right:A,front:$,back:v}}else throw Error(`Unknown padding parameter: ${e}`);return{padInfo:h,outDepth:f,outHeight:g,outWidth:y}},A3=(e,t,r,i,a,n=!1,s="channelsLast")=>{let u,l,d,h,f;if(s==="channelsLast")[u,l,d,h,f]=e;else if(s==="channelsFirst")[u,f,l,d,h]=e;else throw new Error(`Unknown dataFormat ${s}`);let[g,,y,_,w]=t,[x,$,v]=Do(r),[k,E,S]=Do(i),A=wn(y,k),I=wn(_,E),z=wn(w,S),{padInfo:M,outDepth:V,outHeight:ee,outWidth:q}=xf(a,l,d,h,x,$,v,A,I,z),G=n?g*f:g,ge=[0,0,0,0,0];return s==="channelsFirst"?ge=[u,G,V,ee,q]:s==="channelsLast"&&(ge=[u,V,ee,q,G]),{batchSize:u,dataFormat:s,inDepth:l,inHeight:d,inWidth:h,inChannels:f,outDepth:V,outHeight:ee,outWidth:q,outChannels:G,padInfo:M,strideDepth:x,strideHeight:$,strideWidth:v,filterDepth:y,filterHeight:_,filterWidth:w,effectiveFilterDepth:A,effectiveFilterHeight:I,effectiveFilterWidth:z,dilationDepth:k,dilationHeight:E,dilationWidth:S,inShape:e,outShape:ge,filterShape:t}},I3=(e,t,r,i,a,n)=>{let s=n==="channelsLast";s?e[0].dims[3]:e[0].dims[1];let u=[64,1,1],l={x:r.map((x,$)=>$)},d=[Math.ceil(vf(l.x.map(x=>r[x]))/u[0]),1,1];ye("verbose",()=>`[conv3d_naive_webgpu] dispatch = ${d}`);let h=1,f=R.size(r),g=[{type:12,data:f},{type:12,data:i},{type:12,data:a},{type:12,data:t.strides},{type:12,data:t.dilations}];xi(t,g),g.push(...J(e[0].dims,e[1].dims));let y=["rank","rank"],_=e.length===3;_&&(g.push(...J(e[2].dims)),y.push("rank")),g.push(...J(r));let w=x=>{let $=[{name:"output_size",type:"u32"},{name:"filter_dims",type:"u32",length:i.length},{name:"pads",type:"u32",length:a.length},{name:"strides",type:"u32",length:t.strides.length},{name:"dilations",type:"u32",length:t.dilations.length}];Ti(t,$);let v=1,k=it(e[0].dataType),E=N("x",e[0].dataType,e[0].dims.length,h),S=N("W",e[1].dataType,e[1].dims.length,v),A=[E,S],I=K("result",e[0].dataType,r.length,v),z="";if(_){let ee=N("bias",e[2].dataType,e[2].dims.length,v);A.push(ee),z+=`
        fn getBiasByOutputCoords(coords : array<u32, 5>) -> ${k} {
          return bias[${s?Q("coords",4,5):Q("coords",1,5)}];
        }`}let M=ot(h,k),V=$i(t,M,k);return`
            ${z}
            fn getX(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> f32 {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${E.getByIndices("aIndices")};
            }
            fn getW(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> f32 {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${S.getByIndices("aIndices")};
            }
          ${x.registerUniforms($).declareVariables(...A,I)}
          ${x.mainStart()}
          ${x.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
              let coords = ${I.offsetToIndices("global_idx")};
              let batch = ${Q("coords",0,E.rank)};
              let d2 = ${s?Q("coords",E.rank-1,E.rank):Q("coords",1,E.rank)};
              let xFRCCorner = vec3<u32>(${s?Q("coords",1,E.rank):Q("coords",2,E.rank)},
              ${s?Q("coords",2,E.rank):Q("coords",3,E.rank)},
              ${s?Q("coords",3,E.rank):Q("coords",4,E.rank)}) * uniforms.strides - uniforms.pads;
              let xFCorner = xFRCCorner.x;
              let xRCorner = xFRCCorner.y;
              let xCCorner = xFRCCorner.z;
              let xShapeY = ${s?Q("uniforms.x_shape",1,E.rank):Q("uniforms.x_shape",2,E.rank)};
              let xShapeZ = ${s?Q("uniforms.x_shape",2,E.rank):Q("uniforms.x_shape",3,E.rank)};
              let xShapeW = ${s?Q("uniforms.x_shape",3,E.rank):Q("uniforms.x_shape",4,E.rank)};
              let xShapeU = ${s?Q("uniforms.x_shape",4,E.rank):Q("uniforms.x_shape",1,E.rank)};
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
              ${_?"value = value + getBiasByOutputCoords(coords)":""};
              ${V}
              result[global_idx] = f32(value);
          }`};return{name:"Conv3DNaive",shaderCache:{hint:`${t.cacheKey};${s};${h};${_}`,inputDependencies:y},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:d[0],y:d[1],z:d[2]},programUniforms:g}),getShaderSource:w}}}),z3,O3,U4=U(()=>{le(),he(),fe(),Si(),z3=(e,t,r,i)=>{let a=e.length>2,n=a?"value += b[output_channel];":"",s=e[0].dims,u=e[1].dims,l=t.format==="NHWC",d=l?r[3]:r[1],h=d/t.group,f=l&&h>=4?Fe(d):1,g=R.size(r)/f,y=[{type:12,data:g},{type:12,data:t.dilations},{type:12,data:[t.strides[0],t.strides[1]]},{type:12,data:[t.pads[0],t.pads[1]]},{type:12,data:h}];xi(t,y),y.push(...J(s,[u[0],u[1],u[2],u[3]/f]));let _=a?["rank","rank","rank"]:["rank","rank"];y.push(...J([r[0],r[1],r[2],r[3]/f]));let w=x=>{let $=K("output",e[0].dataType,r.length,f),v=it($.type.tensor),k=$i(t,$.type.value,v),E=N("x",e[0].dataType,s.length),S=N("w",e[1].dataType,u.length,f),A=[E,S];a&&A.push(N("b",e[2].dataType,e[2].dims,f));let I=[{name:"output_size",type:"u32"},{name:"dilations",type:"u32",length:t.dilations.length},{name:"strides",type:"u32",length:2},{name:"pads",type:"u32",length:2},{name:"output_channels_per_group",type:"u32"}];Ti(t,I);let z=l?`
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
            let xVal = ${E.get("batch","xHeight","xWidth","input_channel")};
            let wVal = ${S.get("wHeight","wWidth","wInChannel","output_channel")};
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

            let xVal = ${E.get("batch","input_channel","xHeight","xWidth")};
            let wVal = ${S.get("output_channel","wInChannel","wHeight","wWidth")};
            value += xVal * wVal;
          }
        }
      }
      `;return`
  ${x.registerUniforms(I).declareVariables(...A,$)}

  ${x.mainStart()}
    ${x.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let outputIndices = ${$.offsetToIndices("global_idx")};
    let batch: u32 = outputIndices[0];
    let output_channel: u32 = outputIndices[${l?3:1}];
    let xRCCorner: vec2<u32> = vec2<u32>(outputIndices[${l?1:2}], outputIndices[${l?2:3}]) * uniforms.strides - uniforms.pads;
    let group_id: u32 = output_channel * ${f} / uniforms.output_channels_per_group;
    var in_channel_offset = group_id * uniforms.w_shape[${l?2:1}];

    var value: ${$.type.value} = ${$.type.value}(0);
    ${z}
    ${n}
    ${k}
    ${$.setByOffset("global_idx","value")}
  }`};return{name:"GroupedConv",shaderCache:{hint:`${t.cacheKey}_${f}`,inputDependencies:_},getRunData:()=>({outputs:[{dims:i?i(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(g/64)},programUniforms:y}),getShaderSource:w}},O3=(e,t,r,i)=>{let a=e.length>2,n=Fe(r[3]),s=Fe(r[2]),u=R.size(r)/n/s,l=[e[0].dims[0],e[0].dims[1],e[0].dims[2],e[0].dims[3]/n],d=[e[1].dims[0],e[1].dims[1],e[1].dims[2],e[1].dims[3]/n],h=[r[0],r[1],r[2],r[3]/n],f=[{type:12,data:u},{type:6,data:[t.strides[0],t.strides[1]]},{type:6,data:[t.pads[0],t.pads[1]]}];xi(t,f),f.push(...J(l,d,h));let g=(s-1)*t.strides[1]+d[1],y=_=>{let w=K("output",e[0].dataType,h.length,n),x=it(w.type.tensor),$=$i(t,w.type.value,x),v=N("x",e[0].dataType,l.length,n),k=N("w",e[1].dataType,d.length,n),E=[v,k];a&&E.push(N("b",e[2].dataType,e[2].dims,n));let S=a?"value += b[output_channel];":"",A=[{name:"output_size",type:"u32"},{name:"strides",type:"i32",length:2},{name:"pads",type:"i32",length:2}];return Ti(t,A),`
  ${_.registerUniforms(A).declareVariables(...E,w)}
  ${_.mainStart()}
    ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
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
    var values: array<${w.type.value}, ${s}>;
    let input_channel = output_channel;
    // Use constant instead of uniform can give better performance for w's height/width.
    for (var w_height: u32 = 0u; w_height < ${d[0]}; w_height++) {
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
        for (var w_width: u32 = 0u; w_width < ${d[1]}; w_width++) {
          let w_val = ${k.get("w_height","w_width","0","output_channel")};
          for (var i = 0u; i < ${s}u; i++) {
            values[i] = fma(x_vals[i * u32(uniforms.strides[1]) + w_width], w_val, values[i]);
          }
        }
      }
    }

    for (var i = 0u; i < ${s}u; i++) {
      var value = values[i];
      ${S}
      ${$}
      ${w.set("batch","row","col + i","output_channel","value")};
    }
  }`};return{name:"GroupedConv-Vectorize",shaderCache:{hint:`${t.cacheKey};${n};${s};${g};${d[0]};${d[1]}`,inputDependencies:a?["rank","rank","type"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:i?i(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:f}),getShaderSource:y}}}),Tf,ga,kf,ya,Lu,Lo,Ef,Sf,Uu,F4=U(()=>{he(),P4(),L4(),yd(),U4(),Si(),gd(),Jr(),Tf=(e,t,r,i,a,n)=>{let s=e[0],u=e.slice(n?1:2,n?3:4),l=u.length,d=t[0],h=t.slice(2).map((g,y)=>g+(g-1)*(r[y]-1)),f=u.map((g,y)=>g+i[y]+i[y+l]).map((g,y)=>Math.floor((g-h[y]+a[y])/a[y]));return f.splice(0,0,s),f.splice(n?3:1,0,d),f},ga=[2,3,1,0],kf=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length>5)throw new Error("greater than 5D is not supported");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let r=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],i=e[1].dims[1]*t.group;if(r!==i)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");if(e.length===3&&(e[2].dims.length!==1||e[1].dims[0]!==e[2].dims[0]))throw new Error("invalid bias");let a=e[0].dims.length-2;if(t.dilations.length!==a)throw new Error(`dilations should be ${a}D`);if(t.strides.length!==a)throw new Error(`strides should be ${a}D`);if(t.pads.length!==a*2)throw new Error(`pads should be ${a*2}D`);if(t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape")},ya=(e,t)=>{let r=e.kernelShape.slice();r.length<t[1].dims.length-2&&r.push(...Array(t[1].dims.length-2-r.length).fill(0));for(let n=2;n<t[1].dims.length;++n)r[n-2]===0&&(r[n-2]=t[1].dims[n]);let i=e.pads.slice();Ha.adjustPadsBasedOnAutoPad(t[0].dims,e.strides,e.dilations,r,i,e.format==="NHWC",e.autoPad);let a=Object.assign({},e);return Object.assign(a,{kernelShape:r,pads:i}),a},Lu=e=>{let t=pd(e),r=e.format,i=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],a=e.dilations,n=e.group,s=e.kernel_shape,u=e.pads,l=e.strides,d=e.w_is_const();return{autoPad:i,format:r,dilations:a,group:n,kernelShape:s,pads:u,strides:l,wIsConst:d,...t,cacheKey:`${e.format};${t.activation};`}},Lo=(e,t,r,i)=>{let a=r.format==="NHWC",n=Tf(t[0].dims,t[1].dims,r.dilations,r.pads,r.strides,a);if(r.group!==1){let A=[t[0]];if(a){let I=e.kernelCustomData.wT??e.compute(It(t[1],ga),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=I),A.push(I)}else A.push(t[1]);t.length===3&&A.push(t[2]),!e.adapterInfo.isArchitecture("ampere")&&a&&t[1].dims[0]===r.group&&t[1].dims[1]===1&&r.dilations[0]===1&&r.dilations[1]===1?e.compute(O3(A,r,n,i),{inputs:A}):e.compute(z3(A,r,n,i),{inputs:A});return}let s=t.length===3,u=t[0].dims[a?1:2],l=t[0].dims[a?2:3],d=t[0].dims[a?3:1],h=t[1].dims[2],f=t[1].dims[3],g=n[a?1:2],y=n[a?2:3],_=n[a?3:1],w=a&&h===u&&f===l&&r.pads[0]===0&&r.pads[1]===0;if(w||h===1&&f===1&&r.dilations[0]===1&&r.dilations[1]===1&&r.strides[0]===1&&r.strides[1]===1&&r.pads[0]===0&&r.pads[1]===0){let A=n[0],I,z,M,V=[];if(a){let G=e.kernelCustomData.wT??e.compute(It(t[1],ga),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];if(r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=G),w){let ge=u*l*d;I=t[0].reshape([1,A,ge]),z=G.reshape([1,ge,_]),M=[1,A,_]}else I=t[0].reshape([A,u*l,d]),z=G.reshape([1,d,_]),M=[A,g*y,_];V.push(I),V.push(z)}else I=t[0].reshape([A,d,u*l]),z=t[1].reshape([1,_,d]),M=[A,_,g*y],V.push(z),V.push(I);s&&V.push(t[2]);let ee=M[2],q=V[0].dims[V[0].dims.length-1];ee<8&&q<8?e.compute(md(V,r,n,M,a,i),{inputs:V}):e.compute(Xa(V,r,n,M,a,i),{inputs:V});return}let x=!0,$=e.kernelCustomData.wT??e.compute(It(t[1],ga),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=$);let v=[t[0],$];s&&v.push(t[2]);let k=a?g*y:_,E=a?_:g*y,S=h*f*d;e.compute(C3(v,r,n,k,E,S,s,x,i),{inputs:v})},Ef=(e,t)=>{let r=t.format==="NHWC",i=[e.inputs[0].reshape(r?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&i.push(e.inputs[2]);let a=[0,t.pads[0],0,t.pads[1]],n=[1].concat(t.strides),s=[1].concat(t.dilations),u=[1].concat(t.kernelShape),l=ya({...t,pads:a,strides:n,dilations:s,kernelShape:u},i);Lo(e,i,l,d=>r?[d[0],d[2],d[3]]:[d[0],d[1],d[3]])},Sf=(e,t,r)=>{let i=r.format==="NHWC"?"channelsLast":"channelsFirst",a=ya(r,t),n=r.autoPad==="NOTSET"?r.pads:r.autoPad,s=A3(t[0].dims,t[1].dims,r.strides,r.dilations,n,!1,i);e.compute(I3(t,a,s.outShape,[s.filterDepth,s.filterHeight,s.filterWidth],[s.padInfo.front,s.padInfo.top,s.padInfo.left],i))},Uu=(e,t)=>{if(kf(e.inputs,t),e.inputs[0].dims.length===3)Ef(e,t);else if(e.inputs[0].dims.length===5)Sf(e,e.inputs,t);else{let r=ya(t,e.inputs);Lo(e,e.inputs,r)}}}),R3,V4=U(()=>{le(),Rr(),he(),fe(),R3=(e,t,r)=>{let i=e.length>2,a=t.outputShape,n=t.format==="NHWC",s=t.group,u=e[1].dims,l=u[2]/s,d=u[3],h=n?Fe(l):1,f=n&&d===1&&l>=4,g=f?Math.floor(l/4)*4:Math.floor(l/h)*h,y=l-g,_=n?Fe(d):1,w=n?d===1?h:_:1,x=R.size(a)/_,$=[Math.ceil(x/64),1,1];ye("verbose",()=>`[conv2d_backprop_webgpu] dispatch = ${$}`);let v=["rank","rank"],k=[t.strides[0],t.strides[1]],E=[t.kernelShape[n?1:2],t.kernelShape[n?2:3]],S=[t.dilations[0],t.dilations[1]],A=[E[0]+(t.dilations[0]<=1?0:(t.kernelShape[n?1:2]-1)*(t.dilations[0]-1)),E[1]+(t.dilations[1]<=1?0:(t.kernelShape[n?2:3]-1)*(t.dilations[1]-1))],I=[A[0]-1-Math.floor((t.pads[0]+t.pads[2])/2),A[1]-1-Math.floor((t.pads[1]+t.pads[3])/2)],z=[{type:12,data:x},{type:12,data:k},{type:12,data:E},{type:12,data:S},{type:12,data:A},{type:6,data:I},{type:12,data:g},{type:12,data:l},{type:12,data:d},...J(e[0].dims,e[1].dims)];i&&(z.push(...J(e[2].dims)),v.push("rank")),z.push(...J(a));let M=V=>{let ee=[{name:"output_size",type:"u32"},{name:"strides",type:"u32",length:k.length},{name:"filter_dims",type:"u32",length:E.length},{name:"dilations",type:"u32",length:E.length},{name:"effective_filter_dims",type:"u32",length:A.length},{name:"pads",type:"i32",length:I.length},{name:"input_channels_per_group_int",type:"u32"},{name:"input_channels_per_group",type:"u32"},{name:"output_channels_per_group",type:"u32"}],q=it(e[0].dataType),G=n?1:2,ge=n?2:3,ce=n?3:1,Y=N("W",e[1].dataType,e[1].dims.length,w),pe=N("Dy",e[0].dataType,e[0].dims.length,h),Z=[pe,Y];i&&Z.push(N("bias",e[2].dataType,[a[ce]].length,_));let se=K("result",e[0].dataType,a.length,_),Se=()=>{let j="";if(f)h===4?j+=`
        let xValue = ${pe.getByOffset("x_offset")};
        let wValue = ${Y.getByOffset("w_offset")};
        dotProd = dotProd + dot(xValue, wValue);
        x_offset += 1u;
        w_offset += 1u;`:h===2?j+=`
          dotProd = dotProd + dot(vec4<${q}>(${pe.getByOffset("x_offset")}, ${pe.getByOffset("x_offset + 1u")}), vec4<${q}>(${Y.getByOffset("w_offset")}, ${Y.getByOffset("w_offset + 1u")}));
          x_offset += 2u;
          w_offset += 2u;`:h===1&&(j+=`
          dotProd = dotProd + dot(vec4<${q}>(${pe.getByOffset("x_offset")}, ${pe.getByOffset("x_offset + 1u")}, ${pe.getByOffset("x_offset + 2u")}, ${pe.getByOffset("x_offset + 3u")}), vec4<${q}>(${Y.getByOffset("w_offset")}, ${Y.getByOffset("w_offset + 1u")}, ${Y.getByOffset("w_offset + 2u")}, ${Y.getByOffset("w_offset + 3u")}));
          x_offset += 4u;
          w_offset += 4u;`);else if(j+=`
                  let xValue = ${n?pe.getByOffset(`${pe.indicesToOffset(`${pe.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${h}`):pe.get("batch","inputChannel","idyR","idyC")};
        `,h===1)j+=`
          let w_offset = ${Y.indicesToOffset(`${Y.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel, wOutChannel)`)};
          let wValue = ${Y.getByOffset(`w_offset / ${w}`)};
          dotProd = dotProd + xValue * wValue;`;else for(let ie=0;ie<h;ie++)j+=`
            let wValue${ie} = ${Y.getByOffset(`${Y.indicesToOffset(`${Y.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel + ${ie}, wOutChannel)`)} / ${w}`)};
            dotProd = dotProd + xValue[${ie}] * wValue${ie};`;return j},D=()=>{if(y===0)return"";if(!f)throw new Error(`packInputAs4 ${f} is not true.`);let j="";if(h===1){j+="dotProd = dotProd";for(let ie=0;ie<y;ie++)j+=`
            + ${pe.getByOffset(`x_offset + ${ie}`)} * ${Y.getByOffset(`w_offset + ${ie}`)}`;j+=";"}else if(h===2){if(y!==2)throw new Error(`Invalid inputChannelsRemainder ${y}.`);j+=`
          let xValue = ${pe.getByOffset("x_offset")};
          let wValue = ${Y.getByOffset("w_offset")};
          dotProd = dotProd + dot(xValue, wValue);`}return j},W=`
            let outputIndices = ${se.offsetToIndices(`global_idx * ${_}`)};
            let batch = ${se.indicesGet("outputIndices",0)};
            let d1 = ${se.indicesGet("outputIndices",ce)};
            let r = ${se.indicesGet("outputIndices",G)};
            let c = ${se.indicesGet("outputIndices",ge)};
            let dyCorner = vec2<i32>(i32(r), i32(c)) - uniforms.pads;
            let dyRCorner = dyCorner.x;
            let dyCCorner = dyCorner.y;
            let groupId = d1 / uniforms.output_channels_per_group;
            let wOutChannel = d1 - groupId * uniforms.output_channels_per_group;
            // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
            // ? = to be determined. : = across all values in that axis.
            var dotProd = ${se.type.value}(0.0);
            var wR: u32 = 0;
            if (uniforms.dilations.x == 1) {
              // Minimum wR >= 0 that satisfies (dyRCorner + wR) % (uniforms.strides.x) == 0
              wR = u32(((dyRCorner + i32(uniforms.strides.x) - 1) / i32(uniforms.strides.x)) * i32(uniforms.strides.x) - dyRCorner);
            }
            for (; wR < uniforms.effective_filter_dims.x; wR = wR + 1) {
              if (wR % uniforms.dilations.x != 0) {
                continue;
              }
              let dyR = (${q}(dyRCorner) + ${q}(wR)) / ${q}(uniforms.strides[0]);
              let wRPerm = uniforms.filter_dims.x - 1 - wR / uniforms.dilations.x;
              if (dyR < 0.0 || dyR >= ${q}(uniforms.Dy_shape[${G}]) || fract(dyR) > 0.0 ||
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
                let dyC = (${q}(dyCCorner) + ${q}(wC)) / ${q}(uniforms.strides.y);
                let wCPerm = uniforms.filter_dims.y - 1 - wC / uniforms.dilations.y;
                if (dyC < 0.0 || dyC >= ${q}(uniforms.Dy_shape[${ge}]) ||
                    fract(dyC) > 0.0 || wCPerm < 0) {
                  continue;
                }
                let idyC: u32 = u32(dyC);
                var inputChannel = groupId * uniforms.input_channels_per_group;
                ${f?`
                var x_offset = ${pe.indicesToOffset(`${pe.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${h};
                var w_offset = ${Y.indicesToOffset(`${Y.type.indices}(wRPerm, wCPerm, inputChannel, wOutChannel)`)} / ${w};
                  `:""}
                for (var d2: u32 = 0; d2 < uniforms.input_channels_per_group_int; d2 = d2 + ${f?4:h}) {
                  ${Se()}
                  inputChannel = inputChannel + ${f?4:h};
                }
                ${D()}
                wC = wC + uniforms.strides.y - 1;
              }
              wR = wR + uniforms.strides[0] - 1;
            }
            let value = dotProd${i?` + bias[d1 / ${_}]`:""};
            ${se.setByOffset("global_idx","value")};
          `;return`
    ${V.registerUniforms(ee).declareVariables(...Z,se)}
      ${V.mainStart()}
      ${V.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")};
    ${W}}`};return{name:"ConvTranspose2D",shaderCache:{hint:`${t.cacheKey};${h}${w}${_}${f}${y}`,inputDependencies:v},getRunData:()=>({dispatchGroup:{x:$[0],y:$[1],z:$[2]},outputs:[{dims:r?r(a):a,dataType:e[0].dataType}],programUniforms:z}),getShaderSource:M}}}),Cf,Af,If,Uo,M3,zf,Fo,Of,B3,W4=U(()=>{V4(),Si(),Jr(),Cf=(e,t,r,i,a,n)=>(e-1)*t+r+(i-1)*a+1-n,Af=(e,t,r,i,a)=>{let n=Math.floor(e/2);t==="SAME_UPPER"?(r[i]=n,r[a]=e-n):t==="SAME_LOWER"&&(r[i]=e-n,r[a]=n)},If=(e,t,r,i,a,n,s,u,l,d)=>{let h=e.length-2,f=d.length===0;l.length<h&&l.push(...Array(h-l.length).fill(0));let g=e[0],y=t[u?3:1]*a;for(let _=0,w=e.length-h-(u?1:0);_<h;++_,++w){let x=e[w],$=f?x*s[_]:d[_],v=Cf(x,s[_],n[_],t[w],r[_],$);Af(v,i,n,_,_+h),f&&d.push(s[_]*(x-1)+l[_]+(t[w]-1)*r[_]+1-n[_]-n[_+h])}d.splice(0,0,g),d.splice(u?3:1,0,y)},Uo=(e,t)=>{let r=e.kernelShape.slice();if(e.kernelShape.length===0||e.kernelShape.reduce((f,g)=>f*g,1)===0){r.length=0;for(let f=2;f<t[1].dims.length;++f)r.push(t[1].dims[f])}let i=e.format==="NHWC";r.splice(0,0,t[1].dims[0]),r.splice(i?3:1,0,t[1].dims[1]);let a=e.pads.slice(),n=e.outputShape.slice(),s=e.outputPadding.slice(),u=t[0].dims,l=e.dilations.slice();if(l.reduce((f,g)=>f+g,0)===0){let f=t[0].dims.length-2;l=new Array(f).fill(1)}let d=e.strides.slice();if(d.reduce((f,g)=>f+g,0)===0){let f=t[0].dims.length-2;d=new Array(f).fill(1)}If(u,r,l,e.autoPad,e.group,a,d,i,s,n);let h=Object.assign({},e);return Object.assign(h,{kernelShape:r,pads:a,outputPadding:s,outputShape:n,dilations:l,strides:d}),h},M3=e=>{let t=pd(e),r=e.format,i=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][typeof e.autoPad>"u"?0:e.autoPad],a=e.dilations,n=e.group,s=e.kernelShape,u=e.pads,l=e.strides,d=e.wIsConst(),h=e.outputPadding,f=e.outputShape;return{autoPad:i,format:r,dilations:a,group:n,kernelShape:s,outputPadding:h,outputShape:f,pads:u,strides:l,wIsConst:d,...t,cacheKey:`${e.format};${t.activation};`}},zf=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length!==4&&e[0].dims.length!==3)throw new Error("currently only support 2-dimensional conv");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let r=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],i=e[1].dims[0];if(r!==i)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");let a=e[1].dims[1]*t.group;if(e.length===3&&(e[2].dims.length!==1||e[2].dims[0]!==a))throw new Error("invalid bias");let n=e[0].dims.length-2;if(t.dilations.reduce((s,u)=>s+u,0)>0&&t.dilations.length!==n)throw new Error(`dilations should be ${n}D`);if(t.strides.reduce((s,u)=>s+u,0)>0&&t.strides.length!==n)throw new Error(`strides should be ${n}D`);if(t.pads.reduce((s,u)=>s+u,0)>0&&t.pads.length!==n*2)throw new Error(`pads should be ${n*2}D`);if(t.outputPadding.length!==n&&t.outputPadding.length!==0)throw new Error(`output_padding should be ${n}D`);if(t.kernelShape.reduce((s,u)=>s+u,0)>0&&t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape");if(t.outputShape.length!==0&&t.outputShape.length!==e[0].dims.length-2)throw new Error("invalid output shape")},Fo=(e,t,r,i)=>{let a=e.kernelCustomData.wT??e.compute(It(t[1],[2,3,0,1]),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=a);let n=[t[0],a];t.length===3&&n.push(t[2]),e.compute(R3(n,r,i),{inputs:n})},Of=(e,t)=>{let r=t.format==="NHWC",i=[e.inputs[0].reshape(r?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&i.push(e.inputs[2]);let a=t.kernelShape;(a.length===0||a[0]===0)&&(a=[e.inputs[1].dims[2]]);let n=t.dilations;(n.length===0||n[0]===0)&&(n=[1]);let s=t.strides;(s.length===0||s[0]===0)&&(s=[1]);let u=t.pads;u.length===0&&(u=[0,0]),u=[0,u[0],0,u[1]],s=[1].concat(s),n=[1].concat(n),a=[1].concat(a);let l=t.outputPadding;l=[0].concat(l);let d=Uo({...t,pads:u,strides:s,dilations:n,kernelShape:a,outputPadding:l},i);Fo(e,i,d,h=>r?[h[0],h[2],h[3]]:[h[0],h[1],h[3]])},B3=(e,t)=>{if(zf(e.inputs,t),e.inputs[0].dims.length===3)Of(e,t);else{let r=Uo(t,e.inputs);Fo(e,e.inputs,r)}}}),Rf,N3,D3,G4=U(()=>{le(),he(),je(),fe(),Rf=(e,t,r,i)=>{let a=R.size(t),n=t.length,s=N("input",e,n),u=K("output",e,n),l=r.dataType===6?r.getInt32Array()[0]:Number(r.getBigInt64Array()[0]),d=R.normalizeAxis(l,n),h=f=>{let g=` i32(${s.indicesGet("inputIndices","uniforms.axis")}) `,y=Q("uniforms.input_shape","uniforms.axis",n),_=i.reverse?g+(i.exclusive?" + 1":""):"0",w=i.reverse?y:g+(i.exclusive?"":" + 1");return`
                ${f.registerUniform("outputSize","u32").registerUniform("axis","u32").declareVariables(s,u)}
                ${f.mainStart()}
                  ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
                  var inputIndices = ${u.offsetToIndices("global_idx")};
                  var sum = ${u.type.value}(0);
                  let first : i32 = ${_};
                  let last : i32 = ${w};
                  for (var i : i32 = first; i < last; i++) {
                    ${s.indicesSet("inputIndices","uniforms.axis","u32(i)")};
                    sum = sum + ${s.getByIndices("inputIndices")};
                  }
                  ${u.setByOffset("global_idx","sum")};
                }`};return{name:"CumSum",shaderCache:{hint:i.cacheKey,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:t,dataType:e}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:[{type:12,data:a},{type:12,data:d},...J(t,t)]}),getShaderSource:h}},N3=(e,t)=>{let r=e.inputs[0].dims,i=e.inputs[0].dataType,a=e.inputs[1];e.compute(Rf(i,r,a,t),{inputs:[0]})},D3=e=>{let t=e.exclusive===1,r=e.reverse===1;return xe({exclusive:t,reverse:r})}}),Mf,Bf,Nf,P3,L3,j4=U(()=>{le(),he(),je(),fe(),Mf=e=>{if(!e||e.length!==1)throw new Error("DepthToSpace requires 1 input.");if(e[0].dims.length!==4)throw new Error("DepthToSpace requires 4D input.")},Bf=(e,t,r,i)=>{let a=[];a.push(`fn perm(i: ${i.type.indices}) -> ${r.type.indices} {
    var a: ${r.type.indices};`);for(let n=0;n<t;++n)a.push(r.indicesSet("a",e[n],`i[${n}]`));return a.push("return a;}"),a.join(`
`)},Nf=(e,t)=>{let r,i,a,n,s,u,l=t.format==="NHWC",d=t.blocksize,h=t.mode==="DCR";l?([r,i,a,n]=e.dims,s=h?[r,i,a,d,d,n/d**2]:[r,i,a,n/d**2,d,d],u=h?[0,1,3,2,4,5]:[0,1,4,2,5,3]):([r,i,a,n]=[e.dims[0],e.dims[2],e.dims[3],e.dims[1]],s=h?[r,d,d,n/d**2,i,a]:[r,n/d**2,d,d,i,a],u=h?[0,3,4,1,5,2]:[0,1,4,2,5,3]);let f=e.reshape(s),g=f.dims.length,y=e.dataType,_=N("a",y,g),w=K("output",y,g),x=$=>`
  ${$.registerUniform("output_size","u32").declareVariables(_,w)}

  ${Bf(u,g,_,w)}

  ${$.mainStart()}
    ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${w.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${w.setByOffset("global_idx",_.getByIndices("aIndices"))}
  }`;return{name:"DepthToSpace",shaderCache:{hint:`${e.dims};${t.blocksize};${t.mode}`,inputDependencies:["rank"]},getRunData:$=>{let v=l?[r,i*d,a*d,n/d**2]:[r,n/d**2,i*d,a*d],k=R.size(v),E=f.dims,S=R.sortBasedOnPerm(E,u);return{outputs:[{dims:v,dataType:$[0].dataType}],dispatchGroup:{x:Math.ceil(k/64)},programUniforms:[{type:12,data:k},...J(E,S)]}},getShaderSource:x}},P3=(e,t)=>{Mf(e.inputs),e.compute(Nf(e.inputs[0],t))},L3=e=>xe({blocksize:e.blocksize,mode:e.mode,format:e.format})}),_a,vn,Vo,Df,Pf,Lf,Uf,Wo,Ff,U3,F3,q4=U(()=>{le(),he(),je(),fe(),_a="[a-zA-Z]|\\.\\.\\.",vn="("+_a+")+",Vo="^"+vn+"$",Df="("+vn+",)*"+vn,Pf="^"+Df+"$",Lf=class{constructor(e=-1){this.symbolToIndices=new Map,this.inputIndex=e}addSymbol(e,t){let r=this.symbolToIndices.get(e);r===void 0?r=[t]:r.push(t),this.symbolToIndices.set(e,r)}},Uf=class{constructor(e,t){var a;this.equation=t,this.hasEllipsis=!1,this.symbolToInfo=new Map,this.lhs=new Array,this.outputDims=[];let[r,i]=t.includes("->")?t.split("->",2):[t,""];if(!r.match(RegExp(Pf)))throw new Error("Invalid LHS term");if(r.split(",").forEach((n,s)=>{let u=e[s].dims.slice();if(!n.match(RegExp(Vo)))throw new Error("Invalid LHS term");let l=this.processTerm(n,!0,u,s);this.lhs.push(l)}),i==="")i+=[...this.symbolToInfo.entries()].filter(([n,s])=>s.count===1||n==="...").map(([n])=>n).join("");else if(!i.match(RegExp(vn)))throw new Error("Invalid RHS");(a=i.match(RegExp(_a,"g")))==null||a.forEach(n=>{if(n==="...")this.outputDims=this.outputDims.concat(this.ellipsisDims);else{let s=this.symbolToInfo.get(n);if(s===void 0)throw new Error("Invalid RHS symbol");this.outputDims.push(s.dimValue)}}),this.rhs=this.processTerm(i,!1,this.outputDims)}addSymbol(e,t,r){let i=this.symbolToInfo.get(e);if(i!==void 0){if(i.dimValue!==t&&i.count!==1)throw new Error("Dimension mismatch");i.count++,i.inputIndices.push(r)}else i={count:1,dimValue:t,inputIndices:[r]};this.symbolToInfo.set(e,i)}processTerm(e,t,r,i=-1){let a=r.length,n=!1,s=[],u=0;if(!e.match(RegExp(Vo))&&!t&&e!=="")throw new Error("Invalid LHS term");let l=e.match(RegExp(_a,"g")),d=new Lf(i);return l==null||l.forEach((h,f)=>{if(h==="..."){if(n)throw new Error("Only one ellipsis is allowed per input term");n=!0;let g=a-l.length+1;if(g<0)throw new Error("Ellipsis out of bounds");if(s=r.slice(u,u+g),this.hasEllipsis){if(this.ellipsisDims.length!==s.length||this.ellipsisDims.toString()!==s.toString())throw new Error("Ellipsis dimensions mismatch")}else if(t)this.hasEllipsis=!0,this.ellipsisDims=s;else throw new Error("Ellipsis must be specified in the LHS");for(let y=0;y<s.length;y++){let _=String.fromCharCode(48+y);d.addSymbol(_,f+y),this.addSymbol(_,r[u++],i)}}else d.addSymbol(h,f+(this.hasEllipsis?this.ellipsisDims.length-1:0)),this.addSymbol(h,r[u++],i)}),d}},Wo=e=>e+"_max",Ff=(e,t,r,i)=>{let a=e.map(d=>d.length).map((d,h)=>N(`input${h}`,t,d)),n=R.size(i),s=K("output",t,i.length),u=[...r.symbolToInfo.keys()].filter(d=>!r.rhs.symbolToIndices.has(d)),l=d=>{let h=[],f="var prod = 1.0;",g="var sum = 0.0;",y="sum += prod;",_=[],w=[],x=[],$=[],v=r.symbolToInfo.size===r.rhs.symbolToIndices.size;r.symbolToInfo.forEach((E,S)=>{var A;if(r.rhs.symbolToIndices.has(S)){let I=(A=r.rhs.symbolToIndices.get(S))==null?void 0:A[0];I!==void 0&&r.lhs.forEach((z,M)=>{if(E.inputIndices.includes(M)){let V=z.symbolToIndices.get(S);if(V===void 0)throw new Error("Invalid symbol error");V.forEach(ee=>{h.push(`${a[M].indicesSet(`input${M}Indices`,ee,s.indicesGet("outputIndices",I))}`)})}})}else r.lhs.forEach((I,z)=>{if(E.inputIndices.includes(z)){let M=I.symbolToIndices.get(S);if(M===void 0)throw new Error("Invalid symbol error");M.forEach(V=>{_.push(`${a[z].indicesSet(`input${z}Indices`,V,`${S}`)}`)}),$.push(`prod *= ${a[z].getByIndices(`input${z}Indices`)};`)}}),w.push(`for(var ${S}: u32 = 0; ${S} < uniforms.${Wo(S)}; ${S}++) {`),x.push("}")});let k=v?[...h,`let sum = ${a.map((E,S)=>E.getByIndices(`input${S}Indices`)).join(" * ")};`]:[...h,g,...w,..._,f,...$,y,...x];return`
            ${d.registerUniforms(u.map(E=>({name:`${Wo(E)}`,type:"u32"}))).registerUniform("outputSize","u32").declareVariables(...a,s)}

            ${d.mainStart()}
            ${d.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
            var outputIndices = ${s.offsetToIndices("global_idx")};
            ${a.map((E,S)=>`var input${S}Indices: ${a[S].type.indices};`).join(`
`)}
            ${k.join(`
`)};
            ${s.setByOffset("global_idx","sum")};
          }`};return{name:"Einsum",shaderCache:{hint:r.equation,inputDependencies:e.map(()=>"rank")},getRunData:()=>{let d=u.filter(f=>r.symbolToInfo.has(f)).map(f=>{var g;return{type:12,data:((g=r.symbolToInfo.get(f))==null?void 0:g.dimValue)||0}});d.push({type:12,data:n});let h=e.map((f,g)=>[...J(f)]).reduce((f,g)=>f.concat(g),d);return h.push(...J(i)),{outputs:[{dims:i,dataType:t}],dispatchGroup:{x:Math.ceil(n/64)},programUniforms:h}},getShaderSource:l}},U3=(e,t)=>{let r=new Uf(e.inputs,t.equation),i=r.outputDims,a=e.inputs.map((n,s)=>n.dims);e.compute(Ff(a,e.inputs[0].dataType,r,i))},F3=e=>{let t=e.equation.replace(/\s+/g,"");return xe({equation:t})}}),Vf,Go,Wf,Gf,V3,H4=U(()=>{le(),he(),fe(),Vf=e=>{if(!e||e.length!==2)throw new Error("Expand requires 2 input.");let t=e[0].dims,r=Array.from(e[1].getBigInt64Array(),Number),i=r.length<t.length?0:r.length-t.length,a=t.length<r.length?0:t.length-r.length;for(;i<r.length&&a<t.length;++i,++a)if(r[i]!==t[a]&&r[i]!==1&&t[a]!==1)throw new Error("Expand requires shape to be broadcastable to input")},Go=(e,t)=>{let r=e.length-t.length,i=[];for(let a=0;a<r;++a)i.push(e[a]);for(let a=0;a<t.length;++a)i.push(t[a]===1?e[a+r]:t[a]);return i},Wf=(e,t)=>e.length>t.length?Go(e,t):Go(t,e),Gf=e=>{let t=e[0].dims,r=Array.from(e[1].getBigInt64Array(),Number),i=Wf(t,r),a=e[0].dataType,n=a===9||R.size(t)===1,s=a===9||t.length>0&&t[t.length-1]%4===0?4:1,u=n||i.length>0&&i[i.length-1]%4===0?4:1,l=Math.ceil(R.size(i)/u),d=f=>{let g=N("input",a,t.length,s),y=K("output",a,i.length,u),_;if(a===9){let w=(x,$,v="")=>`
          let outputIndices${$} = ${y.offsetToIndices(`outputOffset + ${$}u`)};
          let offset${$} = ${g.broadcastedIndicesToOffset(`outputIndices${$}`,y)};
          let index${$} = offset${$} / 4u;
          let component${$} = offset${$} % 4u;
          ${x}[${$}] = ${v}(${g.getByOffset(`index${$}`)}[component${$}]);
        `;_=`
        let outputOffset = global_idx * ${u};
        var data = vec4<u32>(0);
        ${w("data",0,"u32")}
        ${w("data",1,"u32")}
        ${w("data",2,"u32")}
        ${w("data",3,"u32")}
        ${y.setByOffset("global_idx","data")}
      }`}else _=`
        let outputIndices = ${y.offsetToIndices(`global_idx * ${u}`)};
        let inputOffset = ${g.broadcastedIndicesToOffset("outputIndices",y)};
        let data = ${y.type.value}(${g.getByOffset(`inputOffset / ${s}`)});
        ${y.setByOffset("global_idx","data")}
      }`;return`
    ${f.registerUniform("vec_size","u32").declareVariables(g,y)}
    ${f.mainStart()}
    ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
    ${_}`},h=[{type:12,data:l},...J(t,i)];return{name:"Expand",shaderCache:{hint:`${i.length};${s}${u}`,inputDependencies:["rank"]},getShaderSource:d,getRunData:()=>({outputs:[{dims:i,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:h})}},V3=e=>{Vf(e.inputs),e.compute(Gf(e.inputs),{inputs:[0]})}}),jf,W3,K4=U(()=>{le(),he(),fe(),hd(),jf=e=>{let t=e[0].dataType,r=R.size(e[0].dims),i=R.size(e[1].dims),a=i%4===0,n=s=>{let u=N("x",t,[1],4),l=N("bias",t,[1],4),d=K("y",t,[1],4),h=[{name:"output_vec_size",type:"u32"},{name:"bias_size",type:"u32"}],f=y=>`
      let bias${y}_offset: u32 = (global_idx * 4 + ${y}) % uniforms.bias_size;
      let bias${y} = ${l.getByOffset(`bias${y}_offset / 4`)}[bias${y}_offset % 4];`,g=a?`
      let bias = ${l.getByOffset("global_idx % (uniforms.bias_size / 4)")};`:`${f(0)}${f(1)}${f(2)}${f(3)}
      let bias = ${u.type.value}(bias0, bias1, bias2, bias3);`;return`${s.registerUniforms(h).declareVariables(u,l,d)}

    ${Bu(ut(t))}

    ${s.mainStart(Qi)}
      ${s.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_vec_size")}

      let x = ${u.getByOffset("global_idx")};
      ${g}
      let x_in = x + bias;
      ${d.setByOffset("global_idx",Nu("x_in"))}
    }`};return{name:"FastGeluWithBias",shaderCache:{hint:`${a}`,inputDependencies:["type","type"]},getShaderSource:n,getRunData:s=>({outputs:[{dims:s[0].dims,dataType:s[0].dataType}],programUniforms:[{type:12,data:Math.ceil(r/4)},{type:12,data:i}],dispatchGroup:{x:Math.ceil(r/Qi/4)}})}},W3=e=>{e.inputs.length<2||R.size(e.inputs[1].dims)===0?l3(e):e.compute(jf(e.inputs))}}),qf,Hf,G3,j3,X4=U(()=>{le(),he(),je(),fe(),qf=e=>{if(!e||e.length!==2)throw new Error("Gather requires 2 inputs.")},Hf=(e,t)=>{let r=e[0].dims,i=e[1].dims,a=r.length,n=R.normalizeAxis(t.axis,a),s=r.slice(0);s.splice(n,1,...i);let u=r[n],l=e[0].dataType===9?4:1,d=Math.ceil(R.size(s)/l),h=[{type:12,data:d},{type:6,data:u},{type:12,data:n},...J(e[0].dims,e[1].dims,s)],f=g=>{let y=N("data",e[0].dataType,e[0].dims.length,l),_=N("inputIndices",e[1].dataType,e[1].dims.length),w=K("output",e[0].dataType,s.length,l),x=v=>{let k=i.length,E=`var indicesIndices${v}  = ${_.type.indices}(0);`;for(let S=0;S<k;S++)E+=`${k>1?`indicesIndices${v}[${S}]`:`indicesIndices${v}`} = ${s.length>1?`outputIndices${v}[uniforms.axis + ${S}]`:`outputIndices${v}`};`;E+=`
          var idx${v} = ${_.getByIndices(`indicesIndices${v}`)};
          if (idx${v} < 0) {
            idx${v} = idx${v} + uniforms.axisDimLimit;
          }
          var dataIndices${v} : ${y.type.indices};
        `;for(let S=0,A=0;S<a;S++)S===n?(E+=`${a>1?`dataIndices${v}[${S}]`:`dataIndices${v}`} = u32(idx${v});`,A+=k):(E+=`${a>1?`dataIndices${v}[${S}]`:`dataIndices${v}`} = ${s.length>1?`outputIndices${v}[${A}]`:`outputIndices${v}`};`,A++);return E},$;if(e[0].dataType===9){let v=(k,E,S="")=>`
          let outputIndices${E} = ${w.offsetToIndices(`outputOffset + ${E}u`)};
          ${x(E)};
          let offset${E} = ${y.indicesToOffset(`dataIndices${E}`)};
          let index${E} = offset${E} / 4u;
          let component${E} = offset${E} % 4u;
          ${k}[${E}] = ${S}(${y.getByOffset(`index${E}`)}[component${E}]);
        `;$=`
        let outputOffset = global_idx * ${l};
        var value = vec4<u32>(0);
        ${v("value",0,"u32")}
        ${v("value",1,"u32")}
        ${v("value",2,"u32")}
        ${v("value",3,"u32")}
        ${w.setByOffset("global_idx","value")}
      `}else $=`
      let outputIndices = ${w.offsetToIndices("global_idx")};
      ${x("")};
      let value = ${y.getByIndices("dataIndices")};
      ${w.setByOffset("global_idx","value")};
      `;return`
      ${g.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(y,_,w)}
      ${g.mainStart()}
        ${g.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        ${$}
      }`};return{name:"Gather",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:s,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:h}),getShaderSource:f}},G3=e=>xe({axis:e.axis}),j3=(e,t)=>{let r=e.inputs;qf(r),e.compute(Hf(e.inputs,t))}}),Kf,q3,H3,Y4=U(()=>{le(),he(),fe(),Kf=(e,t,r,i,a,n,s,u,l)=>{let d=[{type:12,data:n},{type:12,data:i},{type:12,data:a},{type:12,data:r},{type:12,data:s},{type:12,data:u},{type:12,data:l}],h=[n];d.push(...J(t.dims,h));let f=g=>{let y=N("indices_data",t.dataType,t.dims.length),_=K("input_slice_offsets_data",12,1,1),w=[y,_],x=[{name:"output_size",type:"u32"},{name:"batch_dims",type:"u32"},{name:"input_dims",type:"u32",length:a.length},{name:"sizes_from_slice_dims_data",type:"u32",length:r.length},{name:"num_slices_per_batch",type:"u32"},{name:"input_batch_stride",type:"u32"},{name:"num_slice_dims",type:"u32"}];return`
  ${g.registerUniforms(x).declareVariables(...w)}
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
  }`};return e.compute({name:"computeSliceOffsets",shaderCache:{hint:`${a.length}_${r.length}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:h,dataType:e.inputs[1].dataType}],dispatchGroup:{x:Math.ceil(n/64)},programUniforms:d}),getShaderSource:f},{inputs:[t],outputs:[-1]})[0]},q3=(e,t)=>{let r=e.inputs,i=r[0].dims,a=r[0].dataType,n=r[1].dims,s=n[n.length-1],u=R.sizeToDimension(n,n.length-1),l=R.sizeFromDimension(i,t.batchDims+s),d=R.sizeToDimension(i,t.batchDims),h=R.sizeFromDimension(i,t.batchDims),f=u/d,g=new Array(s),y=l;for(let E=0;E<s;++E)g[s-1-E]=y,y*=i[t.batchDims+s-1-E];let _=Kf(e,r[1],g,t.batchDims,i,u,f,h,s),w=t.batchDims+s;if(w>i.length)throw new Error("last dimension of indices must not be larger than rank of input tensor");let x=n.slice(0,-1).concat(i.slice(w)),$=R.size(x),v=[{type:12,data:$},{type:12,data:l},...J(r[0].dims,_.dims,x)],k=E=>{let S=N("data",r[0].dataType,r[0].dims.length),A=N("slice_offsets",12,_.dims.length),I=K("output",r[0].dataType,x.length);return`
          ${E.registerUniform("output_size","u32").registerUniform("slice_size","u32").declareVariables(S,A,I)}
            ${E.mainStart()}
            ${E.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let slice_offset = slice_offsets[global_idx / uniforms.slice_size];
          output[global_idx] = data[u32(slice_offset) + global_idx % uniforms.slice_size];
        }`};e.compute({name:"GatherND",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:x,dataType:a}],dispatchGroup:{x:Math.ceil($/64)},programUniforms:v}),getShaderSource:k},{inputs:[r[0],_]})},H3=e=>({batchDims:e.batch_dims,cacheKey:""})}),Xf,Yf,K3,X3,Z4=U(()=>{le(),he(),je(),fe(),Xf=(e,t)=>{if(e.length<3||e.length>4)throw new Error("GatherBlockQuantized requires 3 or 4 inputs.");let r=R.normalizeAxis(t.quantizeAxis,e[0].dims.length),i=t.blockSize,a=e[0],n=e[2],s=e.length===4?e[3]:void 0;if(n.dims.length!==a.dims.length||!a.dims.map((u,l)=>l===r?Math.ceil(u/i)===n.dims[l]:u===n.dims[l]).reduce((u,l)=>u&&l,!0))throw new Error("Scales must have the same rank as the input tensor and the dims should match except on gatherAxis.");if(s){if(s.dataType!==a.dataType)throw new Error("Zero point must have the same data type as the input tensor.");if(s.dims.length!==n.dims.length||!s.dims.map((u,l)=>u===n.dims[l]).reduce((u,l)=>u&&l,!0))throw new Error("Zero point must have the same rank as the input tensor and the dims should match except on quantizeAxis.")}},Yf=(e,t)=>{let r=e[0].dims,i=e[1].dims,a=r.length,n=R.normalizeAxis(t.gatherAxis,a),s=R.normalizeAxis(t.quantizeAxis,a),u=r.slice(0);u.splice(n,1,...i);let l=R.size(u),d=e[2].dataType,h=e[0].dataType===22,f=[{type:12,data:l},{type:12,data:s},{type:12,data:n},{type:12,data:t.blockSize},...J(...e.map((y,_)=>y.dims),u)],g=y=>{let _=N("data",e[0].dataType,e[0].dims.length),w=N("inputIndices",e[1].dataType,e[1].dims.length),x=N("scales",e[2].dataType,e[2].dims.length),$=e.length>3?N("zeroPoint",e[3].dataType,e[3].dims.length):void 0,v=K("output",d,u.length),k=[_,w,x];$&&k.push($);let E=[{name:"output_size",type:"u32"},{name:"quantize_axis",type:"u32"},{name:"gather_axis",type:"u32"},{name:"block_size",type:"u32"}];return`
        ${y.registerUniforms(E).declareVariables(...k,v)}
        ${y.mainStart()}
        let output_indices = ${v.offsetToIndices("global_idx")};
        var indices_indices = ${w.type.indices}(0);
        ${i.length>1?`
          for (var i: u32 = 0; i < ${i.length}; i++) {
            let index = ${v.indicesGet("output_indices","uniforms.gather_axis + i")};
            ${w.indicesSet("indices_indices","i","index")};
          }`:`indices_indices = ${v.indicesGet("output_indices","uniforms.gather_axis")};`};
        var data_indices = ${_.type.indices}(0);
        for (var i: u32 = 0; i < uniforms.gather_axis; i++) {
          let index = ${v.indicesGet("output_indices","i")};
          ${_.indicesSet("data_indices","i","index")};
        }
        var index_from_indices = ${w.getByIndices("indices_indices")};
        if (index_from_indices < 0) {
          index_from_indices += ${r[n]};
        }
        ${_.indicesSet("data_indices","uniforms.gather_axis","u32(index_from_indices)")};
        for (var i = uniforms.gather_axis + 1; i < ${u.length}; i++) {
          let index = ${v.indicesGet("output_indices",`i + ${i.length} - 1`)};
          ${_.indicesSet("data_indices","i","index")};
        }
        let data_offset = ${_.indicesToOffset("data_indices")};
        let data_index = data_offset % 8;
        // Convert 4-bit packed data to 8-bit packed data.
        let packed_4bit_quantized_data = ${_.getByOffset("data_offset / 8")};
        let packed_8bit_quantized_data = (packed_4bit_quantized_data >> (4 * (data_index % 2))) & 0x0f0f0f0f;
        let quantized_data_vec = ${h?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_quantized_data));
        let quantized_data = quantized_data_vec[data_index / 2];
        var scale_indices = data_indices;
        let quantize_axis_index = ${x.indicesGet("data_indices","uniforms.quantize_axis")} / uniforms.block_size;
        ${x.indicesSet("scale_indices","uniforms.quantize_axis","quantize_axis_index")};
        var scale = ${x.getByIndices("scale_indices")};
        ${$?`
              let zero_point_indices = scale_indices;
              let zero_point_offset = ${$.indicesToOffset("zero_point_indices")};
              let zero_point_index = zero_point_offset % 8;
              let packed_4bit_zero_points = ${$.getByOffset("zero_point_offset / 8")};
              let packed_8bit_zero_points = (packed_4bit_zero_points >> (4 * (zero_point_index % 2))) & 0x0f0f0f0f;
              let zero_point_vec = ${h?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_zero_points));
              let zero_point = zero_point_vec[zero_point_index / 2];`:"var zero_point = 0"};
        let dequantized_data = ${ut(d)}(quantized_data - zero_point) * scale;
        ${v.setByOffset("global_idx","dequantized_data")};
    }`};return{name:"GatherBlockQuantized",shaderCache:{hint:`${t.cacheKey};${e.filter((y,_)=>_!==1).map(y=>y.dims.join("_")).join(";")}`,inputDependencies:Array.from({length:e.length},(y,_)=>"rank")},getRunData:()=>({outputs:[{dims:u,dataType:d}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:f}),getShaderSource:g}},K3=(e,t)=>{let r=e.inputs;Xf(r,t),e.compute(Yf(e.inputs,t))},X3=e=>xe({blockSize:e.blockSize,gatherAxis:e.gatherAxis,quantizeAxis:e.quantizeAxis})}),Zf,Qf,Y3,Z3,Q4=U(()=>{le(),he(),je(),fe(),Zf=e=>{if(!e||e.length!==2)throw new Error("GatherElements requires 2 inputs.");if(e[0].dims.length<1)throw new Error("GatherElements requires that the data input be rank >= 1.");if(e[0].dims.length!==e[1].dims.length)throw new Error(`GatherElements requires that the data input and
                     indices input tensors be of same rank.`)},Qf=(e,t)=>{let r=e[0].dims,i=e[0].dataType,a=r.length,n=e[1].dims,s=e[1].dataType,u=R.normalizeAxis(t.axis,a),l=r[u],d=n.slice(0),h=R.size(d),f=N("input",i,a),g=N("indicesInput",s,n.length),y=K("output",i,d.length),_=[{type:12,data:h},{type:6,data:l},{type:12,data:u}];return _.push(...J(r,n,d)),{name:"GatherElements",shaderCache:{inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:d,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:_}),getShaderSource:w=>`
      ${w.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(f,g,y)}
      ${w.mainStart()}
      ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

      let outputIndices = ${y.offsetToIndices("global_idx")};

      var idx = ${g.getByOffset("global_idx")};
      if (idx < 0) {
        idx = idx + uniforms.axisDimLimit;
      }
      var inputIndices = ${f.type.indices}(outputIndices);
      ${f.indicesSet("inputIndices","uniforms.axis","u32(idx)")};
      let value = ${f.getByIndices("inputIndices")};

      ${y.setByOffset("global_idx","value")};
  }`}},Y3=e=>xe({axis:e.axis}),Z3=(e,t)=>{let r=e.inputs;Zf(r),e.compute(Qf(e.inputs,t))}}),Jf,em,Q3,J3,J4=U(()=>{le(),he(),fe(),Jf=e=>{if(!e)throw new Error("Input is missing");if(e.length<2||e.length>3)throw new Error("Invaid input number.");if(e.length===3&&e[2].dims.length>2)throw new Error("Invalid input shape of C");if(e[0].dataType!==e[1].dataType||e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("Input types are mismatched")},em=(e,t)=>{let r=e[0].dims.slice(),i=e[1].dims.slice(),[a,n,s]=Yg.getShapeOfGemmResult(r,t.transA,i,t.transB,e.length===3?e[2].dims:void 0),u=[a,n];if(!u)throw new Error("Can't use gemm on the given tensors");let l=16,d=Math.ceil(n/l),h=Math.ceil(a/l),f=!0,g=R.size(u),y=[{type:12,data:f?d:g},{type:12,data:a},{type:12,data:n},{type:12,data:s},{type:1,data:t.alpha},{type:1,data:t.beta}],_=["type","type"];e.length===3&&(y.push(...J(e[2].dims)),_.push("rank")),y.push(...J(u));let w=$=>{let v="";t.transA&&t.transB?v="value += a[k * uniforms.M + m] * b[n * uniforms.K + k];":t.transA&&!t.transB?v="value += a[k * uniforms.M + m] * b[k * uniforms.N + n];":!t.transA&&t.transB?v="value += a[m * uniforms.K + k] * b[n * uniforms.K + k];":!t.transA&&!t.transB&&(v="value += a[m * uniforms.K + k] * b[k * uniforms.N + n];");let k=t.alpha===1?"":"value *= uniforms.alpha;",E=N("a",e[0].dataType,e[0].dims),S=N("b",e[1].dataType,e[1].dims),A=E.type.value,I=null,z=[E,S];e.length===3&&(I=N("c",e[2].dataType,e[2].dims.length),z.push(I));let M=K("output",e[0].dataType,u.length);z.push(M);let V=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}];return`
  ${$.registerUniforms(V).declareVariables(...z)}

  ${$.mainStart()}
    ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let m = global_idx / uniforms.N;
    let n = global_idx % uniforms.N;

    var value = ${A}(0);
    for (var k: u32 = 0u; k < uniforms.K; k++) {
      ${v}
    }

    ${k}
    ${I!=null?`let cOffset = ${I.broadcastedIndicesToOffset("vec2(m, n)",M)}; value += ${A}(uniforms.beta) * ${I.getByOffset("cOffset")};`:""}
    output[global_idx] = value;
  }`},x=$=>{let v=N("a",e[0].dataType,e[0].dims),k=N("b",e[1].dataType,e[1].dims),E=null,S=[v,k];e.length===3&&(E=N("c",e[2].dataType,e[2].dims.length),S.push(E));let A=K("output",e[0].dataType,u.length);S.push(A);let I=[{name:"num_tile_n",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}],z="",M="";t.transA&&t.transB?(M=`
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
        tile_b[local_id.y][local_id.x] = ${k.type.value}(0);
      }
      `,z="value += tile_a[k][local_id.y] * tile_b[local_id.x][k];"):t.transA&&!t.transB?(M=`
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
        tile_b[local_id.y][local_id.x] = ${k.type.value}(0);
      }
      `,z="value += tile_a[k][local_id.y] * tile_b[k][local_id.x];"):!t.transA&&t.transB?(M=`
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
        tile_b[local_id.y][local_id.x] = ${k.type.value}(0);
      }
      `,z="value += tile_a[local_id.y][k] * tile_b[local_id.x][k];"):!t.transA&&!t.transB&&(M=`
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
        tile_b[local_id.y][local_id.x] = ${k.type.value}(0);
      }
      `,z="value += tile_a[local_id.y][k] * tile_b[k][local_id.x];");let V=t.alpha===1?"":"value *= uniforms.alpha;";return`
  ${$.registerUniforms(I).declareVariables(...S)}
  var<workgroup> tile_a: array<array<${v.type.storage}, ${l}>, ${l}>;
  var<workgroup> tile_b: array<array<${k.type.storage}, ${l}>, ${l}>;
  ${$.mainStart([l,l,1])}
    let tile_col_start = (workgroup_index % uniforms.num_tile_n) * ${l};
    let tile_row_start = (workgroup_index / uniforms.num_tile_n) * ${l};
    let num_tiles = (uniforms.K - 1) / ${l} + 1;
    var k_start = 0u;
    var value = ${A.type.value}(0);
    for (var t: u32 = 0u; t < num_tiles; t++) {
      ${M}
      k_start = k_start + ${l};
      workgroupBarrier();

      for (var k: u32 = 0u; k < ${l}; k++) {
        ${z}
      }
      workgroupBarrier();
    }

    ${V}
    let m = tile_row_start + local_id.y;
    let n = tile_col_start + local_id.x;
    ${E!=null?`let cOffset = ${E.broadcastedIndicesToOffset("vec2(m, n)",A)}; value += ${A.type.value}(uniforms.beta) * ${E.getByOffset("cOffset")};`:""}
    if (m < uniforms.M && n < uniforms.N) {
      output[m * uniforms.N + n] = value;
    }
  }`};return f?{name:"GemmShared",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:_},getRunData:()=>({outputs:[{dims:u,dataType:e[0].dataType}],dispatchGroup:{x:d*h},programUniforms:y}),getShaderSource:x}:{name:"Gemm",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:_},getRunData:()=>({outputs:[{dims:u,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(g/64)},programUniforms:y}),getShaderSource:w}},Q3=e=>{let t=e.transA,r=e.transB,i=e.alpha,a=e.beta;return{transA:t,transB:r,alpha:i,beta:a,cacheKey:`${e.transA};${e.transB};${e.alpha===1}`}},J3=(e,t)=>{Jf(e.inputs),e.compute(em(e.inputs,t))}}),cr,$r,oi,ui,tm,rm,im,nm,am,sm,om,um,ey,ty,ev=U(()=>{le(),he(),je(),fe(),[cr,$r,oi,ui]=[0,1,2,3],tm=e=>{if(e[0].dims.length!==4)throw new Error("only 4-D tensor is supported.");if(e[0].dims.length!==e[1].dims.length)throw new Error("input dimensions must be equal to grid dimensions");if(e[0].dims.length-2!==e[1].dims[e[1].dims.length-1])throw new Error(`last dimension of grid must be equal to ${e[0].dims.length-2}`);if(e[0].dims[0]!==e[1].dims[0])throw new Error("grid batch size must match input batch size")},rm=`
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
`,im=e=>`
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
`,nm=e=>`
  fn gs_denormalize(n: f32, length: i32) -> f32 {
    ${e.alignCorners===0?`
    // alignCorners: false => [-1, 1] to [-0.5, length - 0.5]
    return ((n + 1.0) * f32(length) - 1.0) / 2.0;
    `:`
    // alignCorners: true => [-1, 1] to [0, length - 1]
    return (n + 1.0) / 2.0 * (f32(length - 1));
    `}
  }
`,am=e=>`
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
`,sm=(e,t,r)=>`
  fn pixel_at_grid(r: i32, c: i32, H: i32, W: i32, batch: u32, channel: u32, border: vec4<f32>) -> ${t} {
     var pixel = ${t}(0);
     var indices = vec4<u32>(0);
     indices[${cr}] = batch;
     indices[${$r}] = channel;`+(()=>{switch(r.paddingMode){case"zeros":return`
          if (r >= 0 && r < H && c >=0 && c < W) {
            indices[${oi}] = u32(r);
            indices[${ui}] = u32(c);
          } else {
            return ${t}(0);
          }
        `;case"border":return`
          indices[${oi}] = u32(clamp(r, 0, H - 1));
          indices[${ui}] = u32(clamp(c, 0, W - 1));
        `;case"reflection":return`
          indices[${oi}] = gs_reflect(r, border[1], border[3]);
          indices[${ui}] = gs_reflect(c, border[0], border[2]);
        `;default:throw new Error(`padding mode ${r.paddingMode} is not supported`)}})()+`
    return ${e.getByIndices("indices")};
  }
`,om=(e,t,r)=>(()=>{switch(r.mode){case"nearest":return`
          let result = pixel_at_grid(i32(round(y)), i32(round(x)), H_in, W_in, indices[${cr}], indices[${$r}], border);
        `;case"bilinear":return`
          let x1 = i32(floor(x));
          let y1 = i32(floor(y));
          let x2 = x1 + 1;
          let y2 = y1 + 1;

          let p11 = pixel_at_grid(y1, x1, H_in, W_in, indices[${cr}], indices[${$r}], border);
          let p12 = pixel_at_grid(y1, x2, H_in, W_in, indices[${cr}], indices[${$r}], border);
          let p21 = pixel_at_grid(y2, x1, H_in, W_in, indices[${cr}], indices[${$r}], border);
          let p22 = pixel_at_grid(y2, x2, H_in, W_in, indices[${cr}], indices[${$r}], border);

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
              p[h][w] = pixel_at_grid(h + y0, w + x0, H_in, W_in, indices[${cr}], indices[${$r}], border);
            }
          }

          let dx = x - f32(x0 + 1);
          let dy = y - f32(y0 + 1);
          let result = gs_bicubic_interpolate(p, dx, dy);
        `;default:throw new Error(`mode ${r.mode} is not supported`)}})()+`${e.setByOffset("global_idx","result")}`,um=(e,t)=>{let r=N("x",e[0].dataType,e[0].dims.length),i=[e[1].dims[0],e[1].dims[1],e[1].dims[2]],a=N("grid",e[1].dataType,i.length,2),n=[e[0].dims[0],e[0].dims[1],e[1].dims[1],e[1].dims[2]];t.format==="NHWC"&&(n=[e[0].dims[0],e[1].dims[1],e[1].dims[2],e[0].dims[3]],[cr,$r,oi,ui]=[0,3,1,2]);let s=K("output",e[0].dataType,n.length),u=r.type.value,l=R.size(n),d=[{type:12,data:l},...J(e[0].dims,i,n)],h=f=>`
  ${f.registerUniform("output_size","u32").declareVariables(r,a,s)}
  ${rm}
  ${im(u)}
  ${nm(t)}
  ${am(t)}
  ${sm(r,u,t)}

  ${f.mainStart()}
    ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let H_in = i32(uniforms.x_shape[${oi}]);
      let W_in = i32(uniforms.x_shape[${ui}]);

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
      var grid_indices = vec3<u32>(indices[${cr}], indices[${oi}], indices[${ui}]);
      let nxy = ${a.getByIndices("grid_indices")};
      var x = gs_denormalize(f32(nxy[0]), W_in);
      var y = gs_denormalize(f32(nxy[1]), H_in);

      ${om(s,u,t)}
  }`;return{name:"GridSample",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:["type","type"]},getRunData:f=>{let g=R.size(n);return{outputs:[{dims:n,dataType:f[0].dataType}],dispatchGroup:{x:Math.ceil(g/64)},programUniforms:d}},getShaderSource:h}},ey=(e,t)=>{tm(e.inputs),e.compute(um(e.inputs,t))},ty=e=>xe({alignCorners:e.align_corners,mode:e.mode,paddingMode:e.padding_mode,format:e.format})}),ht,lm,ry,jo,dm,On,iy,ny=U(()=>{le(),he(),je(),ud(),cd(),fe(),Jr(),ht=(e,t)=>e.length>t&&e[t].dims.length>0?e[t]:void 0,lm=(e,t)=>{let r=e[0],i=ht(e,1),a=ht(e,2),n=ht(e,3),s=ht(e,4),u=ht(e,5),l=ht(e,6),d=ht(e,7);if(r.dims.length!==3&&r.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let h=r.dims[0],f=r.dims[1],g=r.dims.length===3?r.dims[2]:t.numHeads*r.dims[4],y=f,_=0,w=0,x=Math.floor(g/t.numHeads);if(l&&d&&R.size(l.dims)&&R.size(d.dims)){if(l.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(l.dims[0]!==h||l.dims[1]!==t.numHeads||l.dims[3]!==x)throw new Error('Input "past_key" shape (batch_size, num_heads, past_sequence_length, head_size)');if(d.dims[0]!==h||d.dims[1]!==t.numHeads||d.dims[3]!==x)throw new Error('Input "past_value" shape (batch_size, num_heads, past_sequence_length, head_size)');if(l.dims[2]!==d.dims[2])throw new Error('Input "past_key" and "past_value" shall have same dim 2 (past_sequence_length)');if(d.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');_=l.dims[2],w=l.dims[2]}else if(l&&R.size(l.dims)||d&&R.size(d.dims))throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let $;if(i&&R.size(i.dims)>0){if(r.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(i.dims.length<3||i.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(r.dims[0]!==i.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(i.dims.length===3){if(i.dims[2]!==r.dims[2])throw new Error('Input "query" and "key" shall have same dim 2 (hidden_size)');$=2,y=i.dims[1]}else if(i.dims.length===5){if(i.dims[2]!==t.numHeads||i.dims[3]!==2||i.dims[4]!==x)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(a)throw new Error('Expect "value" be none when "key" has packed kv format.');$=5,y=i.dims[1]}else{if(i.dims[1]!==t.numHeads||i.dims[3]!==x)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');$=0,y=i.dims[2]}}else{if(r.dims.length!==5)throw new Error('Input "query" is expected to have 5 dimensions when key is empty');if(r.dims[2]!==t.numHeads||r.dims[3]!==3)throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');$=3}if(n&&R.size(n.dims)>0){if(n.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimension');if(i&&i.dims.length===5&&i.dims[3]===2)throw new Error("bias is not allowed for packed kv.")}let v=_+y,k=0;if(s&&R.size(s.dims)>0){k=8;let I=s.dims;throw I.length===1?I[0]===h?k=1:I[0]===3*h+2&&(k=3):I.length===2&&I[0]===h&&I[1]===v&&(k=5),k===8?new Error('Input "key_padding_mask" shape shall be (batch_size) or (batch_size, total_sequence_length)'):new Error("Mask not supported")}let E=!1,S=g;if(a&&R.size(a.dims)>0){if(a.dims.length!==3&&a.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(r.dims[0]!==a.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(a.dims.length===3){if(y!==a.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');S=a.dims[2]}else{if(y!==a.dims[2])throw new Error('Input "key" and "value" shall have the same dim 2 (kv_sequence_length)');S=a.dims[1]*a.dims[3],E=!0}}let A=!1;if(s&&R.size(s.dims)>0)throw new Error("Key padding mask is not supported");if(u&&R.size(u.dims)>0){if(u.dims.length!==4)throw new Error('Input "attention_bias" is expected to have 4 dimensions');if(u.dims[0]!==h||u.dims[1]!==t.numHeads||u.dims[2]!==f||u.dims[3]!==v)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:h,sequenceLength:f,pastSequenceLength:_,kvSequenceLength:y,totalSequenceLength:v,maxSequenceLength:w,inputHiddenSize:0,hiddenSize:g,vHiddenSize:S,headSize:x,vHeadSize:Math.floor(S/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:k,scale:t.scale,broadcastResPosBias:A,passPastInKv:E,qkvFormat:$}},ry=e=>xe({...e}),jo=xe({perm:[0,2,1,3]}),dm=(e,t,r,i,a,n,s)=>{let u=[i,a,n],l=R.size(u),d=[{type:12,data:l},{type:12,data:s},{type:12,data:n}],h=f=>{let g=K("qkv_with_bias",t.dataType,u),y=N("qkv",t.dataType,u),_=N("bias",r.dataType,u),w=[{name:"output_size",type:"u32"},{name:"bias_offset",type:"u32"},{name:"hidden_size",type:"u32"}];return`
  ${f.registerUniforms(w).declareVariables(y,_,g)}
  ${f.mainStart()}
    ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let bias_offset_idx = (global_idx % uniforms.hidden_size) + uniforms.bias_offset;

    qkv_with_bias[global_idx] = qkv[global_idx] + bias[bias_offset_idx];
  }`};return e.compute({name:"MultiHeadAttentionAddBias",shaderCache:{inputDependencies:["type","type"]},getRunData:()=>({outputs:[{dims:u,dataType:t.dataType,gpuDataType:0}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:d}),getShaderSource:h},{inputs:[t,r],outputs:[-1]})[0]},On=(e,t,r,i,a,n,s,u)=>{let l=n;if(s&&R.size(s.dims)>0){if(i===1)throw new Error("AddBiasReshape is not implemented. Please export your model with packed QKV or KV");return l=dm(e,n,s,t,i,r*a,u),l=l.reshape([t,i,r,a]),r===1||i===1?l:e.compute(It(l,jo.perm),{inputs:[l],outputs:[-1]})[0]}else return n.dims.length===3&&(l=n.reshape([t,i,r,a])),r===1||i===1?l:e.compute(It(l,jo.perm),{inputs:[l],outputs:[-1]})[0]},iy=(e,t)=>{let r=lm(e.inputs,t),i=e.inputs[0],a=ht(e.inputs,1),n=ht(e.inputs,2),s=ht(e.inputs,3),u=ht(e.inputs,4),l=ht(e.inputs,5),d=ht(e.inputs,6),h=ht(e.inputs,7);if(i.dims.length===5)throw new Error("Packed QKV is not implemented");if((a==null?void 0:a.dims.length)===5)throw new Error("Packed KV is not implemented");let f=a&&n&&a.dims.length===4&&n.dims.length===4,g=On(e,r.batchSize,r.numHeads,r.sequenceLength,r.headSize,i,s,0);if(f)return Vn(e,g,a,n,u,void 0,d,h,l,r);if(!a||!n)throw new Error("key and value must be provided");let y=On(e,r.batchSize,r.numHeads,r.kvSequenceLength,r.headSize,a,s,r.hiddenSize),_=On(e,r.batchSize,r.numHeads,r.kvSequenceLength,r.vHeadSize,n,s,2*r.hiddenSize);Vn(e,g,y,_,u,void 0,d,h,l,r)}}),cm,hm,pm,fm,Fu,ay,sy,oy=U(()=>{le(),he(),je(),fe(),cm=e=>{if(!e||e.length<1)throw new Error("too few inputs")},hm=(e,t)=>{let r=[],i=t.numOutputs;return e[1].dims[0]>0&&(e[1].getBigInt64Array().forEach(a=>r.push(Number(a))),i=r.length),xe({numOutputs:i,axis:t.axis,splitSizes:r})},pm=e=>`
fn calculateOutputIndex(index: u32) -> u32 {
    for (var i: u32 = 0u; i < ${e}u; i += 1u ) {
    if (index < ${Q("uniforms.size_in_split_axis","i",e)}) {
        return i;
    }
    }
    return ${e}u;
}`,fm=e=>{let t=e.length,r=[];for(let i=0;i<t;++i){let a=e[i].setByIndices("indices","input[global_idx]");t===1?r.push(a):i===0?r.push(`if (output_number == ${i}u) { ${a} }`):i===t-1?r.push(`else { ${a} }`):r.push(`else if (output_number == ${i}) { ${a} }`)}return`
      fn writeBufferData(output_number: u32, indices: ${e[0].type.indices}, global_idx: u32) {
        ${r.join(`
`)}
      }`},Fu=(e,t)=>{let r=e[0].dims,i=R.size(r),a=e[0].dataType,n=R.normalizeAxis(t.axis,r.length),s=new Array(t.numOutputs),u=N("input",a,r.length),l=new Array(t.numOutputs),d=[],h=[],f=0,g=[{type:12,data:i}];for(let _=0;_<t.numOutputs;_++){f+=t.splitSizes[_],l[_]=f;let w=r.slice();w[n]=t.splitSizes[_],h.push(w),s[_]=K(`output${_}`,a,w.length),d.push({dims:h[_],dataType:e[0].dataType})}g.push({type:12,data:l},...J(r,...h));let y=_=>`
  ${_.registerUniform("input_size","u32").registerUniform("size_in_split_axis","u32",l.length).declareVariables(u,...s)}
  ${pm(l.length)}
  ${fm(s)}

  ${_.mainStart()}
    ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.input_size")}

    var indices = ${u.offsetToIndices("global_idx")};
    var index = ${u.indicesGet("indices",n)};
    let output_number = calculateOutputIndex(index);
    if (output_number != 0) {
      index -= ${Q("uniforms.size_in_split_axis","output_number - 1u",l.length)};
      ${u.indicesSet("indices",n,"index")};
    }
    writeBufferData(output_number, indices, global_idx);
  }`;return{name:"Split",shaderCache:{hint:t.cacheKey,inputDependencies:["rank"]},getShaderSource:y,getRunData:()=>({outputs:d,dispatchGroup:{x:Math.ceil(i/64)},programUniforms:g})}},ay=(e,t)=>{cm(e.inputs);let r=e.inputs.length===1?t:hm(e.inputs,t);e.compute(Fu(e.inputs,r),{inputs:[0]})},sy=e=>{let t=e.axis,r=e.splitSizes,i=e.numOutputs<0?r.length:e.numOutputs;if(i!==r.length)throw new Error("numOutputs and splitSizes length must be equal");return xe({axis:t,numOutputs:i,splitSizes:r})}}),mm,Ya,uy,ly=U(()=>{le(),he(),je(),fe(),mm=(e,t)=>{let[r,i,a,n]=e,{numHeads:s,rotaryEmbeddingDim:u}=t;if(r.dims.length!==3&&r.dims.length!==4)throw new Error(`Input 'x' is expected to have 3 or 4 dimensions, got ${r.dims.length}`);if(!R.areEqual(i.dims,[])&&!R.areEqual(i.dims,[1])&&i.dims.length!==2)throw new Error(`Input 'position_ids' is expected to have 0, 1, or 2 dimensions, got ${i.dims.length}`);if(a.dims.length!==2)throw new Error(`Input 'cos_cache' is expected to have 2 dimensions, got ${a.dims.length}`);if(n.dims.length!==2)throw new Error(`Input 'sin_cache' is expected to have 2 dimensions, got ${n.dims.length}`);if(!R.areEqual(a.dims,n.dims))throw new Error("Inputs 'cos_cache' and 'sin_cache' are expected to have the same shape");if(u>0&&s===0)throw new Error("num_heads must be provided if rotary_embedding_dim is specified");let l=r.dims[0],d=r.dims[r.dims.length-2],h=a.dims[0],f=R.sizeFromDimension(r.dims,1)/d,g=u===0?a.dims[1]*2:f/s;if(u>g)throw new Error("rotary_embedding_dim must be less than or equal to head_size");if(i.dims.length===2){if(l!==i.dims[0])throw new Error(`Input 'position_ids' dimension 0 should be of size batch_size, got ${i.dims[0]}`);if(d!==i.dims[1])throw new Error(`Input 'position_ids' dimension 1 should be of size sequence_length, got ${i.dims[1]}`)}if(g/2!==a.dims[1]&&u/2!==a.dims[1])throw new Error(`Input 'cos_cache' dimension 1 should be same as head_size / 2 or rotary_embedding_dim / 2, got ${a.dims[1]}`);if(d>h)throw new Error("Updating cos_cache and sin_cache in RotaryEmbedding is not currently supported")},Ya=(e,t)=>{let{interleaved:r,numHeads:i,rotaryEmbeddingDim:a,scale:n}=t,s=e[0].dims[0],u=R.sizeFromDimension(e[0].dims,1),l=e[0].dims[e[0].dims.length-2],d=u/l,h=e[2].dims[1],f=a===0?h*2:d/i,g=new Array(s,l,d/f,f-h),y=R.computeStrides(g),_=[{type:1,data:n},{type:12,data:g},{type:12,data:y},...e[0].dims.length===3?new Array({type:12,data:[u,d,f,1]}):[],...e[0].dims.length===4?new Array({type:12,data:[u,f,l*f,1]}):[],...J(e[0].dims,e[1].dims,e[2].dims,e[3].dims,e[0].dims)],w=x=>{let $=N("input",e[0].dataType,e[0].dims.length),v=N("position_ids",e[1].dataType,e[1].dims.length),k=N("cos_cache",e[2].dataType,e[2].dims.length),E=N("sin_cache",e[3].dataType,e[3].dims.length),S=K("output",e[0].dataType,e[0].dims.length);return x.registerUniforms([{name:"scale",type:"f32"},{name:"global_shape",type:"u32",length:g.length},{name:"global_strides",type:"u32",length:y.length},{name:"input_output_strides",type:"u32",length:y.length}]),`
        ${x.declareVariables($,v,k,E,S)}

        ${x.mainStart(Qi)}
          let half_rotary_emb_dim = uniforms.${k.name}_shape[1];
          let bsnh = global_idx / uniforms.global_strides % uniforms.global_shape;
          let size = uniforms.global_shape[0] * uniforms.global_strides[0];
          ${x.guardAgainstOutOfBoundsWorkgroupSizes("size")}

          if (bsnh[3] < half_rotary_emb_dim) {
            let position_ids_idx =
                ${v.broadcastedIndicesToOffset("bsnh.xy",K("",v.type.tensor,2))};
            let position_id =
                u32(${v.getByOffset("position_ids_idx")}) + select(0, bsnh[1], position_ids_idx == 0);
            let i = dot(bsnh, uniforms.input_output_strides) + select(0, bsnh[3], ${r});
            let j = i + select(half_rotary_emb_dim, 1, ${r});
            let re = ${$.getByOffset("i")} * ${k.get("position_id","bsnh[3]")} -
                ${$.getByOffset("j")} * ${E.get("position_id","bsnh[3]")};
            ${S.setByOffset("i","re")}
            let im = ${$.getByOffset("i")} * ${E.get("position_id","bsnh[3]")} +
                ${$.getByOffset("j")} * ${k.get("position_id","bsnh[3]")};
            ${S.setByOffset("j","im")}
          } else {
            let k = dot(bsnh, uniforms.input_output_strides) + half_rotary_emb_dim;
            ${S.setByOffset("k",$.getByOffset("k"))}
          }
        }`};return{name:"RotaryEmbedding",shaderCache:{hint:xe({interleaved:r}).cacheKey,inputDependencies:["rank","rank","rank","rank"]},getShaderSource:w,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(R.size(g)/Qi)},programUniforms:_})}},uy=(e,t)=>{mm(e.inputs,t),e.compute(Ya(e.inputs,t))}}),gm,ym,qo,_m,dy,tv=U(()=>{je(),le(),cd(),ny(),oy(),Jr(),ly(),fe(),gm=(e,t)=>{if(t.doRotary&&e.length<=7)throw new Error("cos_cache and sin_cache inputs are required if do_rotary is specified");let r=e[0],i=e[1],a=e[2],n=e[3],s=e[4];if(t.doRotary!==0&&e.length<=7)throw new Error("cos_cast and sin_cache are expected if do_rotary attribute is non-zero");if(t.localWindowSize!==-1)throw new Error("Local attention is not supported");if(t.softcap!==0)throw new Error("Softcap is not supported");if(t.rotaryInterleaved!==0)throw new Error("Rotary interleaved is not supported");if(t.smoothSoftmax)throw new Error("Smooth softmax is not supported");if(r.dims.length!==3&&r.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let u=!1,l=r.dims[0],d=r.dims[1],h=r.dims.length===3?u?r.dims[2]/3:r.dims[2]:t.numHeads*r.dims[4],f=d,g=0,y=!i||i.dims.length===0,_=Math.floor(y?h/(t.numHeads+2*t.kvNumHeads):h/t.numHeads);y&&(h=_*t.numHeads);let w=n&&n.dims.length!==0,x=s&&s.dims.length!==0;if(w&&n.dims.length===4&&n.dims[0]===l&&n.dims[1]!==t.kvNumHeads&&n.dims[2]===t.kvNumHeads&&n.dims[3]===_)throw new Error("BSNH pastKey/pastValue is not supported");if(w&&x){if(n.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(s.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');g=n.dims[2]}else if(w||x)throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let $=1;if(i&&i.dims.length>0){if(r.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(i.dims.length<3||i.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(r.dims[0]!==i.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(i.dims.length===3){if(r.dims[2]%i.dims[2]!==0)throw new Error('Dimension 2 of "query" should be a multiple of "key"');f=i.dims[1]}else if(i.dims.length===5){if(i.dims[2]!==t.numHeads||i.dims[3]!==2||i.dims[4]!==_)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(a)throw new Error('Expect "value" be none when "key" has packed kv format.');f=i.dims[1]}else{if(i.dims[1]!==t.numHeads||i.dims[3]!==_)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');f=i.dims[2]}}else{if(r.dims.length!==3&&r.dims.length!==5)throw new Error('Input "query" is expected to have 3 or 5 dimensions when key is empty');if(r.dims.length===5&&(r.dims[2]!==t.numHeads||r.dims[3]!==3))throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');$=3}let v=0,k=!1,E=t.kvNumHeads?_*t.kvNumHeads:h;if(a&&a.dims.length>0){if(a.dims.length!==3&&a.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(r.dims[0]!==a.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(a.dims.length===3){if(f!==a.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');E=a.dims[2]}else{if(f!==a.dims[2])throw new Error('Input "past_key" and "past_value" shall have the same dim 2 (kv_sequence_length)');E=a.dims[1]*a.dims[3],k=!0}}let S=e.length>4?e[5]:void 0;if(S&&S.dims.length!==1&&S.dims[0]!==l)throw new Error('Input "seqlens" is expected to have 1 dimension and the same dim 0 as batch_size');return{batchSize:l,sequenceLength:d,pastSequenceLength:g,kvSequenceLength:f,totalSequenceLength:-1,maxSequenceLength:-1,inputHiddenSize:0,hiddenSize:h,vHiddenSize:E,headSize:_,vHeadSize:Math.floor(E/t.kvNumHeads),numHeads:t.numHeads,kvNumHeads:t.kvNumHeads,nReps:t.numHeads/t.kvNumHeads,pastPresentShareBuffer:!1,maskType:v,scale:t.scale,broadcastResPosBias:!1,passPastInKv:k,qkvFormat:$}},ym=xe({perm:[0,2,1,3]}),qo=(e,t,r)=>{let i=t,a=r.kvNumHeads;return t.dims.length===3&&r.kvSequenceLength!==0&&(i=t.reshape([r.batchSize,r.kvSequenceLength,a,r.headSize]),i=e.compute(It(i,ym.perm),{inputs:[i],outputs:[-1]})[0]),i},_m=(e,t,r,i)=>{let a=7,n=["type","type"],s=[e*t],u=e*t,l=[{type:12,data:u},{type:12,data:t},{type:12,data:e}],d=h=>{let f=N("seq_lens",r.dataType,r.dims),g=N("total_seq_lens",i.dataType,i.dims),y=K("pos_ids",a,s),_=[{name:"output_size",type:"u32"},{name:"sequence_length",type:"u32"},{name:"batch_size",type:"u32"}];return`
  ${h.registerUniforms(_).declareVariables(f,g,y)}
  ${h.mainStart()}
    ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let total_sequence_length = u32(${g.getByOffset("0")});
    let is_subsequent_prompt = uniforms.sequence_length > 1 && uniforms.sequence_length != total_sequence_length;
    let is_first_prompt = !is_subsequent_prompt && uniforms.sequence_length == total_sequence_length;
    let batch_idx = global_idx / uniforms.sequence_length;
    let sequence_idx = i32(global_idx % uniforms.sequence_length);
    var pos_id: i32 = 0;
    let seqlen = ${f.getByOffset("batch_idx")};
    let total_seqlen = seqlen + 1;
    if (is_first_prompt) {
      if (sequence_idx < total_seqlen) {
        pos_id = sequence_idx;
      } else {
        pos_id = 1;
      }
      ${y.setByOffset("global_idx","pos_id")}
    } else if (is_subsequent_prompt) {
      let past_seqlen = total_seqlen - i32(uniforms.sequence_length);
      if (past_seqlen + sequence_idx < total_seqlen) {
        pos_id = past_seqlen + sequence_idx;
      } else {
        pos_id = 1;
      }
      ${y.setByOffset("global_idx","pos_id")}
    } else if (global_idx < uniforms.batch_size) {
      ${y.setByOffset("global_idx","seqlen")}
    };
  }
  `};return{name:"GeneratePositionIds",shaderCache:{hint:`${e};${t}`,inputDependencies:n},getRunData:()=>({outputs:[{dims:s,dataType:a}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:l}),getShaderSource:d}},dy=(e,t)=>{var E;let r=gm(e.inputs,t);if(e.inputs[0].dims.length===5)throw new Error("Packed QKV is not implemented");if(((E=e.inputs[1])==null?void 0:E.dims.length)===5)throw new Error("Packed KV is not implemented");let i=e.inputs[0],a=e.inputs[1]&&e.inputs[1].dims.length>0?e.inputs[1]:void 0,n=e.inputs[2]&&e.inputs[2].dims.length>0?e.inputs[2]:void 0,s=e.inputs[3]&&e.inputs[3].dims.length!==0?e.inputs[3]:void 0,u=e.inputs[4]&&e.inputs[4].dims.length!==0?e.inputs[4]:void 0,l=e.inputs.length>4?e.inputs[5]:void 0,d=e.inputs.length>5?e.inputs[6]:void 0,h=r.kvNumHeads?r.kvNumHeads:r.numHeads,f=xe({axis:2,numOutputs:3,splitSizes:[r.numHeads*r.headSize,h*r.headSize,h*r.headSize]}),[g,y,_]=!a&&!n?e.compute(Fu([i],f),{inputs:[i],outputs:[-1,-1,-1]}):[i,a,n],w,x;if(t.doRotary){let S=e.compute(_m(r.batchSize,r.sequenceLength,l,d),{inputs:[l,d],outputs:[-1]})[0],A=e.inputs[7],I=e.inputs[8],z=xe({interleaved:t.rotaryInterleaved!==0,numHeads:r.numHeads,rotaryEmbeddingDim:0,scale:t.scale}),M=[g,S,A,I],V=[-1];w=e.compute(Ya(M,z),{inputs:M,outputs:V})[0],M.splice(0,1,y);let ee=xe({interleaved:t.rotaryInterleaved!==0,numHeads:r.kvNumHeads,rotaryEmbeddingDim:0,scale:t.scale});x=e.compute(Ya(M,ee),{inputs:M,outputs:V})[0]}let $=On(e,r.batchSize,r.numHeads,r.sequenceLength,r.headSize,t.doRotary?w:g,void 0,0),v=qo(e,t.doRotary?x:y,r),k=qo(e,_,r);Vn(e,$,v,k,void 0,void 0,s,u,void 0,r,l,d)}}),Ho,bm,wm,cy,rv=U(()=>{le(),he(),Jr(),fe(),Ho=(e,t,r,i,a,n,s,u)=>{let l=Fe(n),d=l===1?"f32":`vec${l}f`,h=l===1?"vec2f":`mat2x${l}f`,f=a*s,g=64;f===1&&(g=256);let y=[a,s,n/l],_=[a,s,2],w=["rank","type","type"],x=[];x.push(...J(y,_));let $=v=>{let k=N("x",t.dataType,3,l),E=N("scale",r.dataType,r.dims),S=N("bias",i.dataType,i.dims),A=K("output",1,3,2),I=[k,E,S,A];return`
  var<workgroup> workgroup_shared : array<${h}, ${g}>;
  const workgroup_size = ${g}u;
  ${v.declareVariables(...I)}
  ${v.mainStart(g)}
    let batch = workgroup_index / uniforms.x_shape[1];
    let channel = workgroup_index % uniforms.x_shape[1];
    let hight = uniforms.x_shape[2];
    // initialize workgroup memory
    var sum = ${d}(0);
    var squared_sum = ${d}(0);
    for (var h = local_idx; h < hight; h += workgroup_size) {
      let value = ${d}(${k.get("batch","channel","h")});
      sum += value;
      squared_sum += value * value;
    }
    workgroup_shared[local_idx] = ${h}(sum, squared_sum);
    workgroupBarrier();

    for (var currSize = workgroup_size >> 1;  currSize > 0; currSize = currSize >> 1) {
      if (local_idx < currSize) {
        workgroup_shared[local_idx] = workgroup_shared[local_idx] + workgroup_shared[local_idx + currSize];
      }
      workgroupBarrier();
    }
    if (local_idx == 0) {
      let sum_final = ${Xr("workgroup_shared[0][0]",l)} / f32(hight * ${l});
      let squared_sum_final = ${Xr("workgroup_shared[0][1]",l)} / f32(hight * ${l});

      let inv_std_dev = inverseSqrt(squared_sum_final - sum_final * sum_final + f32(${u}));
      let channel_scale = inv_std_dev * f32(scale[channel]);
      let channel_shift = f32(bias[channel]) - sum_final * channel_scale;
      output[workgroup_index] = vec2f(channel_scale, channel_shift);
    }
  }`};return e.compute({name:"InstanceNormComputeChannelScaleShift",shaderCache:{hint:`${l};${u};${g}`,inputDependencies:w},getRunData:()=>({outputs:[{dims:_,dataType:1}],dispatchGroup:{x:f},programUniforms:x}),getShaderSource:$},{inputs:[t,r,i],outputs:[-1]})[0]},bm=(e,t,r)=>{let i=t[0].dims,a=i,n=2,s=i[0],u=i[1],l=R.sizeFromDimension(i,n),d=Fe(l),h=R.size(a)/d,f=Ho(e,t[0],t[1],t[2],s,l,u,r.epsilon),g=[s,u,l/d],y=[s,u],_=["type","none"],w=x=>{let $=N("x",t[0].dataType,g.length,d),v=N("scale_shift",1,y.length,2),k=K("output",t[0].dataType,g.length,d),E=[$,v,k];return`
  ${x.registerUniform("output_size","u32").declareVariables(...E)}
  ${x.mainStart()}
  ${x.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let outputIndices = ${k.offsetToIndices("global_idx")};
      let batch = outputIndices[0];
      let channel = outputIndices[1];
      let scale_shift = ${v.getByIndices("vec2<u32>(batch, channel)")};
      let value = ${$.getByOffset("global_idx")} * ${k.type.value}(scale_shift.x) + ${k.type.value}(scale_shift.y);
      ${k.setByOffset("global_idx","value")};
  }`};e.compute({name:"InstanceNormalization",shaderCache:{hint:`${d}`,inputDependencies:_},getRunData:()=>({outputs:[{dims:a,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:[{type:12,data:h},...J(g,y,g)]}),getShaderSource:w},{inputs:[t[0],f]})},wm=(e,t,r)=>{let i=t[0].dims,a=i,n=i[0],s=i[i.length-1],u=R.sizeFromDimension(i,1)/s,l=Fe(s),d=R.size(a)/l,h=[{type:12,data:u},{type:12,data:Math.floor(s/l)}],f=["type","type"],g=!1,y=[0,i.length-1];for(let $=0;$<i.length-2;$++)g=g||i[$+1]!==1,y.push($+1);g=g&&i[i.length-1]!==1;let _=g?e.compute(It(e.inputs[0],y),{inputs:[e.inputs[0]],outputs:[-1]})[0]:e.inputs[0].reshape(Array.from({length:i.length},($,v)=>i[y[v]])),w=Ho(e,_,t[1],t[2],n,u,s,r.epsilon),x=$=>{let v=it(t[0].dataType),k=l===1?"vec2f":`mat${l}x2f`,E=I=>{let z=I===0?"x":"y",M=l===1?"f32":`vec${l}f`;switch(l){case 1:return`${v}(${M}(scale.${z}))`;case 2:return`vec2<${v}>(${M}(scale[0].${z}, scale[1].${z}))`;case 4:return`vec4<${v}>(${M}(scale[0].${z}, scale[1].${z}, scale[2].${z}, scale[3].${z}))`;default:throw new Error(`Not supported compoents ${l}`)}},S=N("input",t[0].dataType,t[0].dims,l),A=K("output",t[0].dataType,a,l);return`
  @group(0) @binding(0) var<storage, read> input : array<${S.type.storage}>;
  @group(0) @binding(1) var<storage, read> scale_input : array<${k}>;
  @group(0) @binding(2) var<storage, read_write> output : array<${A.type.storage}>;
  struct Uniforms {H: u32, C : u32};
  @group(0) @binding(3) var<uniform> uniforms: Uniforms;

  ${$.mainStart()}
    let current_image_number = global_idx / (uniforms.C * uniforms.H);
    let current_channel_number = global_idx % uniforms.C;

    let scale_offset = current_image_number * uniforms.C + current_channel_number;
    let scale = scale_input[scale_offset];
    output[global_idx] = fma(input[global_idx], ${E(0)}, ${E(1)});
  }`};e.compute({name:"InstanceNormalizationNHWC",shaderCache:{hint:`${l}`,inputDependencies:f},getRunData:()=>({outputs:[{dims:a,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:h}),getShaderSource:x},{inputs:[t[0],w]})},cy=(e,t)=>{t.format==="NHWC"?wm(e,e.inputs,t):bm(e,e.inputs,t)}}),vm,$m,hy,iv=U(()=>{le(),he(),fe(),vm=e=>{if(!e||e.length<2)throw new Error("layerNorm requires at least 2 inputs.")},$m=(e,t,r)=>{let i=t.simplified,a=e[0].dims,n=e[1],s=!i&&e[2],u=a,l=R.normalizeAxis(t.axis,a.length),d=R.sizeToDimension(a,l),h=R.sizeFromDimension(a,l),f=R.size(n.dims),g=s?R.size(s.dims):0;if(f!==h||s&&g!==h)throw new Error(`Size of X.shape()[axis:] == ${h}.
       Size of scale and bias (if provided) must match this.
       Got scale size of ${f} and bias size of ${g}`);let y=[];for(let S=0;S<a.length;++S)S<l?y.push(a[S]):y.push(1);let _=Fe(h),w=["type","type"],x=[{type:12,data:d},{type:1,data:h},{type:12,data:Math.floor(h/_)},{type:1,data:t.epsilon}];s&&w.push("type");let $=r>1,v=r>2,k=S=>{let A=it(e[0].dataType),I=[N("x",e[0].dataType,e[0].dims,_),N("scale",n.dataType,n.dims,_)];s&&I.push(N("bias",s.dataType,s.dims,_)),I.push(K("output",e[0].dataType,u,_)),$&&I.push(K("mean_data_output",1,y)),v&&I.push(K("inv_std_output",1,y));let z=[{name:"norm_count",type:"u32"},{name:"norm_size",type:"f32"},{name:"norm_size_vectorized",type:"u32"},{name:"epsilon",type:"f32"}];return`
  ${S.registerUniforms(z).declareVariables(...I)}
  ${S.mainStart()}
    ${S.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.norm_count")}
    let offset = global_idx * uniforms.norm_size_vectorized;
    var mean_vector = ${Ou("f32",_)};
    var mean_square_vector = ${Ou("f32",_)};

    for (var h: u32 = 0u; h < uniforms.norm_size_vectorized; h++) {
      let value = ${Bi(A,_,"x[h + offset]")};
      mean_vector += value;
      mean_square_vector += value * value;
    }
    let mean = ${Xr("mean_vector",_)} / uniforms.norm_size;
    let inv_std_dev = inverseSqrt(${Xr("mean_square_vector",_)} / uniforms.norm_size ${i?"":"- mean * mean"} + uniforms.epsilon);

    for (var j: u32 = 0; j < uniforms.norm_size_vectorized; j++) {
      let f32input = ${Bi(A,_,"x[j + offset]")};
      let f32scale = ${Bi(A,_,"scale[j]")};
      output[j + offset] = ${I[0].type.value}((f32input ${i?"":"- mean"}) * inv_std_dev * f32scale
        ${s?`+ ${Bi(A,_,"bias[j]")}`:""}
      );
    }

    ${$?"mean_data_output[global_idx] = mean":""};
    ${v?"inv_std_output[global_idx] = inv_std_dev":""};
  }`},E=[{dims:u,dataType:e[0].dataType}];return $&&E.push({dims:y,dataType:1}),v&&E.push({dims:y,dataType:1}),{name:"LayerNormalization",shaderCache:{hint:`${_};${r};${i}`,inputDependencies:w},getRunData:()=>({outputs:E,dispatchGroup:{x:Math.ceil(d/64)},programUniforms:x}),getShaderSource:k}},hy=(e,t)=>{vm(e.inputs),e.compute($m(e.inputs,t,e.outputCount))}}),xm,py,nv=U(()=>{he(),gd(),yd(),xm=e=>{if(!e||e.length!==2)throw new Error("MatMul requires 2 inputs.");if(e[0].dims[e[0].dims.length-1]!==e[1].dims[e[1].dims.length-2])throw new Error("shared dimension does not match.")},py=e=>{xm(e.inputs);let t=Zi.calcShape(e.inputs[0].dims,e.inputs[1].dims,!0);if(!t)throw new Error("Can't use matmul on the given tensors");let r=t[t.length-1],i=e.inputs[0].dims[e.inputs[0].dims.length-1];if(r<8&&i<8)e.compute(md(e.inputs,{activation:""},t));else{let a=t[t.length-2],n=R.size(e.inputs[0].dims.slice(0,-2)),s=R.size(e.inputs[1].dims.slice(0,-2));if(n!==1&&a===1&&s===1){let u=e.inputs[0].reshape([1,n,i]),l=e.inputs[1].reshape([1,i,r]),d=[1,n,r],h=[u,l];e.compute(Xa(h,{activation:""},t,d),{inputs:h})}else e.compute(Xa(e.inputs,{activation:""},t))}}}),Tm,km,Em,fy,my,av=U(()=>{le(),he(),je(),fe(),Tm=(e,t)=>{if(e.length<3||e.length>4)throw new Error("MatMulNBits requires 3 or 4 inputs");let r=e[0],i=r.dims.length;if(r.dims[i-1]!==t.k)throw new Error("The last dim of input shape does not match the k value");let a=Math.floor((t.k+t.blockSize-1)/t.blockSize),n=t.blockSize/8*t.bits,s=e[1];if(!R.areEqual(s.dims,[t.n,a,n]))throw new Error("The second inputs must be 3D tensor with shape N X nBlocksPerCol X blobSize");let u=e[2].dims;if(R.size(u)!==t.n*a)throw new Error("scales input size error.");if(e.length===4){let l=e[3].dims,d=t.n*(t.bits===8?a:Math.floor((a*t.bits+7)/8));if(R.size(l)!==d)throw new Error("zeroPoints input size error.")}},km=(e,t)=>{let r=e[0].dims,i=r.length,a=r[i-2],n=t.k,s=t.n,u=r.slice(0,i-2),l=R.size(u),d=e[1].dims[2]/4,h=e[0].dataType,f=Fe(t.k),g=Fe(d),y=Fe(s),_=u.concat([a,s]),w=a>1&&s/y%2===0?2:1,x=R.size(_)/y/w,$=64,v=[],k=[l,a,n/f],E=R.convertShape(e[1].dims).slice();E.splice(-1,1,d/g),v.push(...J(k)),v.push(...J(E)),v.push(...J(e[2].dims)),e.length===4&&v.push(...J(R.convertShape(e[3].dims)));let S=[l,a,s/y];v.push(...J(S));let A=I=>{let z=k.length,M=N("a",e[0].dataType,z,f),V=N("b",12,E.length,g),ee=N("scales",e[2].dataType,e[2].dims.length),q=[M,V,ee],G=e.length===4?N("zero_points",12,e[3].dims.length):void 0;G&&q.push(G);let ge=S.length,ce=K("output",e[0].dataType,ge,y),Y=it(e[0].dataType),pe=(()=>{switch(f){case 1:return`array<${Y}, 8>`;case 2:return`mat4x2<${Y}>`;case 4:return`mat2x4<${Y}>`;default:throw new Error(`${f}-component is not supported.`)}})(),Z=()=>{let D=`
          // reuse a data
            var input_offset = ${M.indicesToOffset(`${M.type.indices}(batch, row, word_offset)`)};
            var a_data: ${pe};
            for (var j: u32 = 0; j < ${8/f}; j++) {
              a_data[j] = ${M.getByOffset("input_offset")};
              input_offset++;
            }
          `;for(let W=0;W<y*w;W++)D+=`
            b_value = ${g===1?`b${W}_data`:`b${W}_data[i]`};
            b_value_lower = unpack4xU8(b_value & b_mask);
            b_value_upper = unpack4xU8((b_value >> 4) & b_mask);
            b_quantized_values = ${pe}(${Array.from({length:4},(j,ie)=>`${Y}(b_value_lower[${ie}]), ${Y}(b_value_upper[${ie}])`).join(", ")});
            b_dequantized_values = ${f===1?`${pe}(${Array.from({length:8},(j,ie)=>`(b_quantized_values[${ie}] - ${G?`zero_point${W}`:"zero_point"}) * scale${W}`).join(", ")});`:`(b_quantized_values - ${pe}(${Array(8).fill(`${G?`zero_point${W}`:"zero_point"}`).join(",")})) * scale${W};`};
            workgroup_shared[local_id.x * ${w} + ${Math.floor(W/y)}]${y>1?`[${W%y}]`:""} += ${Array.from({length:8/f},(j,ie)=>`${f===1?`a_data[${ie}] * b_dequantized_values[${ie}]`:`dot(a_data[${ie}], b_dequantized_values[${ie}])`}`).join(" + ")};
          `;return D},se=()=>{let D=`
            var col_index = col * ${y};
            ${G?`
            let zero_point_bytes_per_col = (nBlocksPerCol + 1) / 2;
            var zero_point_byte_count: u32;
            var zero_point_word_index: u32;
            var zero_point_byte_offset: u32;
            let zero_point_nibble_offset: u32 = block & 0x1u;
            var zero_point_bits_offset: u32;
            var zero_point_word: u32;`:`
            // The default zero point is 8 for unsigned 4-bit quantization.
            let zero_point = ${Y}(8);`}
            `;for(let W=0;W<y*w;W++)D+=`
            let scale${W} = ${ee.getByOffset("col_index * nBlocksPerCol + block")};
            ${G?`
            zero_point_byte_count = col_index * zero_point_bytes_per_col + (block >> 0x1u);
            zero_point_word_index = zero_point_byte_count >> 0x2u;
            zero_point_byte_offset = zero_point_byte_count & 0x3u;
            zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_nibble_offset << 2);
            zero_point_word = ${G.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point${W} = ${Y}((zero_point_word) & 0xFu);`:""}
            col_index += 1;`;return D},Se=()=>{let D=`col_index = col * ${y};`;for(let W=0;W<y*w;W++)D+=`
            let b${W}_data = ${V.getByIndices(`${V.type.indices}(col_index, block, word)`)};
            col_index += 1;`;return D+=`
            var b_value: u32;
            let b_mask: u32 = 0x0F0F0F0Fu;
            var b_value_lower: vec4<u32>;
            var b_value_upper: vec4<u32>;
            var b_quantized_values: ${pe};
            var b_dequantized_values: ${pe};`,D};return`
        var<workgroup> workgroup_shared: array<${ce.type.value}, ${w*$}>;
        ${I.declareVariables(...q,ce)}
        ${I.mainStart([$,1,1])}
          let output_indices = ${ce.offsetToIndices(`(global_idx / ${$}) * ${w}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let nBlocksPerCol = uniforms.b_shape[1];

          for (var block = local_id.x; block < nBlocksPerCol; block += ${$}) {
            //process one block
            var word_offset: u32 = block * ${t.blockSize/f};
            ${se()}
            for (var word: u32 = 0; word < ${d}; word += ${g}) {
              ${Se()}
              for (var i: u32 = 0; i < ${g}; i++) {
                ${Z()}
                word_offset += ${8/f};
              }
            }
          }
          workgroupBarrier();

          if (local_id.x < ${w}) {
            var output_value: ${ce.type.value} = ${ce.type.value}(0);
            var workgroup_shared_offset: u32 = local_id.x;
            for (var b: u32 = 0u; b < ${$}u; b++) {
              output_value += workgroup_shared[workgroup_shared_offset];
              workgroup_shared_offset += ${w};
            }
            ${ce.setByIndices(`${ce.type.indices}(batch, row, col + local_id.x)`,"output_value")};
          }
        }`};return{name:"MatMulNBits",shaderCache:{hint:`${t.blockSize};${t.bits};${f};${g};${y};${w};${$}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:_,dataType:h}],dispatchGroup:{x},programUniforms:v}),getShaderSource:A}},Em=(e,t)=>{let r=e[0].dims,i=r.length,a=r[i-2],n=t.k,s=t.n,u=r.slice(0,i-2),l=R.size(u),d=e[1].dims[2]/4,h=e[0].dataType,f=Fe(t.k),g=Fe(d),y=u.concat([a,s]),_=128,w=s%8===0?8:s%4===0?4:1,x=_/w,$=x*g*8,v=$/f,k=$/t.blockSize,E=R.size(y)/w,S=[],A=[l,a,n/f],I=R.convertShape(e[1].dims).slice();I.splice(-1,1,d/g),S.push(...J(A)),S.push(...J(I)),S.push(...J(e[2].dims)),e.length===4&&S.push(...J(R.convertShape(e[3].dims)));let z=[l,a,s];S.push(...J(z));let M=V=>{let ee=A.length,q=N("a",e[0].dataType,ee,f),G=N("b",12,I.length,g),ge=N("scales",e[2].dataType,e[2].dims.length),ce=[q,G,ge],Y=e.length===4?N("zero_points",12,e[3].dims.length):void 0;Y&&ce.push(Y);let pe=z.length,Z=K("output",e[0].dataType,pe),se=it(e[0].dataType),Se=()=>{switch(f){case 1:return`
          let a_data0 = vec4<${se}>(sub_a[word_offset], sub_a[word_offset + 1], sub_a[word_offset + 2], sub_a[word_offset + 3]);
          let a_data1 = vec4<${se}>(sub_a[word_offset + 4], sub_a[word_offset + 5], sub_a[word_offset + 6], sub_a[word_offset + 7]);`;case 2:return`
          let a_data0 = vec4<${se}>(sub_a[word_offset], sub_a[word_offset + 1]);
          let a_data1 = vec4<${se}>(sub_a[word_offset + 2], sub_a[word_offset + 3]);`;case 4:return`
          let a_data0 = sub_a[word_offset];
          let a_data1 = sub_a[word_offset + 1];`;default:throw new Error(`${f}-component is not supported.`)}};return`
        var<workgroup> sub_a: array<${q.type.value}, ${v}>;
        var<workgroup> inter_results: array<array<${Z.type.value}, ${x}>, ${w}>;
        ${V.declareVariables(...ce,Z)}
        ${V.mainStart([x,w,1])}
          let output_indices = ${Z.offsetToIndices(`workgroup_index * ${w}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let n_blocks_per_col = uniforms.b_shape[1];
          let num_tiles =  (n_blocks_per_col - 1) / ${k} + 1;

          // Loop over shared dimension.
          for (var tile: u32 = 0; tile < num_tiles; tile += 1) {
            let a_col_start = tile * ${v};
            // load one tile A data into shared memory.
            for (var a_offset = local_idx; a_offset < ${v}; a_offset += ${_})
            {
              let a_col = a_col_start + a_offset;
              if (a_col < uniforms.a_shape[2])
              {
                sub_a[a_offset] = ${q.getByIndices(`${q.type.indices}(batch, row, a_col)`)};
              } else {
                sub_a[a_offset] = ${q.type.value}(0);
              }
            }
            workgroupBarrier();

            // each thread process one block
            let b_row = col + local_id.y;
            let block = tile * ${k} + local_id.x;
            ${Y?`
            let zero_point_bytes_per_col = (n_blocks_per_col + 1) / 2;
            let zero_point_byte_count = b_row * zero_point_bytes_per_col + (block >> 0x1u);
            let zero_point_word_index = zero_point_byte_count >> 0x2u;
            let zero_point_byte_offset = zero_point_byte_count & 0x3u;
            let zero_point_nibble_offset: u32 = block & 0x1u;
            let zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_nibble_offset << 2);
            let zero_point_word = ${Y.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point = ${se}((zero_point_word) & 0xFu);`:`
            // The default zero point is 8 for unsigned 4-bit quantization.
            let zero_point = ${se}(8);`}
            let scale = ${ge.getByOffset("b_row * n_blocks_per_col + block")};
            let b_data = ${G.getByIndices(`${G.type.indices}(b_row, block, 0)`)};
            var word_offset = local_id.x * ${t.blockSize/f};
            for (var i: u32 = 0; i < ${g}; i++) {
              ${Se()}
              let b_value = ${g===1?"b_data":"b_data[i]"};
              let b_value_lower = unpack4xU8(b_value & 0x0F0F0F0Fu);
              let b_value_upper = unpack4xU8((b_value >> 4) & 0x0F0F0F0Fu);
              let b_quantized_values = mat2x4<${se}>(${Array.from({length:4},(D,W)=>`${se}(b_value_lower[${W}]), ${se}(b_value_upper[${W}])`).join(", ")});
              let b_dequantized_values = (b_quantized_values - mat2x4<${se}>(${Array(8).fill("zero_point").join(",")})) * scale;
              inter_results[local_id.y][local_id.x] += ${Array.from({length:2},(D,W)=>`${`dot(a_data${W}, b_dequantized_values[${W}])`}`).join(" + ")};
              word_offset += ${8/f};
            }
            workgroupBarrier();
          }

          if (local_idx < ${w}) {
            var output_value: ${Z.type.value} = ${Z.type.value}(0);
            for (var b = 0u; b < ${x}; b++) {
              output_value += inter_results[local_idx][b];
            }
            if (col + local_idx < uniforms.output_shape[2])
            {
              ${Z.setByIndices(`${Z.type.indices}(batch, row, col + local_idx)`,"output_value")}
            }
          }
        }`};return{name:"BlockwiseMatMulNBits32",shaderCache:{hint:`${t.blockSize};${f};${g};${x};${w}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:y,dataType:h}],dispatchGroup:{x:E},programUniforms:S}),getShaderSource:M}},fy=(e,t)=>{Tm(e.inputs,t),t.blockSize===32&&e.adapterInfo.isVendor("intel")&&e.adapterInfo.isArchitecture("gen-12lp")?e.compute(Em(e.inputs,t)):e.compute(km(e.inputs,t))},my=e=>xe(e)}),Sm,Cm,Am,Im,zm,Om,Rm,Mm,gy,sv=U(()=>{le(),he(),fe(),Sm=e=>{if(!e||e.length<1)throw new Error("Too few inputs");if(e[0].dataType!==1&&e[0].dataType!==10)throw new Error("Input type must be float or float16.");if(e.length>=2){let t=e[0].dims.length*2===e[1].dims[0];if(e.length===4&&(t=e[3].dims[0]*2===e[1].dims[0]),!t)throw new Error("The pads should be a 1D tensor of shape [2 * input_rank] or [2 * num_axes].")}},Cm=(e,t,r)=>{let i="";for(let a=t-1;a>=0;--a)i+=`
            k = i32(${e.indicesGet("indices",a)}) - ${Q("uniforms.pads",a,r)};
            if (k < 0) {
              break;
            }
            if (k >= i32(${Q("uniforms.x_shape",a,t)})) {
              break;
            }
            offset += k * i32(${Q("uniforms.x_strides",a,t)});
        `;return`
          value = ${e.type.value}(uniforms.constant_value);
          for (var i = 0; i < 1; i++) {
            var offset = 0;
            var k = 0;
            ${i}
            value = x[offset];
          }
      `},Am=(e,t,r)=>{let i="";for(let a=t-1;a>=0;--a)i+=`
                k = i32(${e.indicesGet("indices",a)}) - ${Q("uniforms.pads",a,r)};
                if (k < 0) {
                  k = -k;
                }
                {
                  let _2n_1 = 2 * (i32(${Q("uniforms.x_shape",a,t)}) - 1);
                  k = k % _2n_1;
                  if(k >= i32(${Q("uniforms.x_shape",a,t)})) {
                    k = _2n_1 - k;
                  }
                }
                offset += k * i32(${Q("uniforms.x_strides",a,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${i}
              value = x[offset];
          `},Im=(e,t,r)=>{let i="";for(let a=t-1;a>=0;--a)i+=`
                k = i32(${e.indicesGet("indices",a)}) - ${Q("uniforms.pads",a,r)};
                if (k < 0) {
                  k = 0;
                }
                if (k >= i32(${Q("uniforms.x_shape",a,t)})) {
                  k = i32(${Q("uniforms.x_shape",a,t)}) - 1;
                }
                offset += k * i32(${Q("uniforms.x_strides",a,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${i}
              value = x[offset];
          `},zm=(e,t,r)=>{let i="";for(let a=t-1;a>=0;--a)i+=`
                k = i32(${e.indicesGet("indices",a)}) - ${Q("uniforms.pads",a,r)};
                if (k < 0)  {
                  k += i32(${Q("uniforms.x_shape",a,t)}]);
                }
                if (k >= i32(${Q("uniforms.x_shape",a,t)})) {
                  k -= i32(${Q("uniforms.x_shape",a,t)});
                }
                offset += k * i32(${Q("uniforms.x_strides",a,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${i}
              value = x[offset];
          `},Om=(e,t,r)=>{switch(r.mode){case 0:return Cm(e,t,r.pads.length);case 1:return Am(e,t,r.pads.length);case 2:return Im(e,t,r.pads.length);case 3:return zm(e,t,r.pads.length);default:throw new Error("Invalid mode")}},Rm=(e,t)=>{let r=R.padShape(e[0].dims.slice(),t.pads),i=e[0].dims,a=R.size(r),n=[{type:12,data:a},{type:6,data:t.pads}],s=e.length>=3&&e[2].data;t.mode===0&&n.push({type:s?e[2].dataType:1,data:t.value}),n.push(...J(e[0].dims,r));let u=["rank"],l=d=>{let h=K("output",e[0].dataType,r.length),f=N("x",e[0].dataType,i.length),g=f.type.value,y=Om(h,i.length,t),_=[{name:"output_size",type:"u32"},{name:"pads",type:"i32",length:t.pads.length}];return t.mode===0&&_.push({name:"constant_value",type:s?g:"f32"}),`
            ${d.registerUniforms(_).declareVariables(f,h)}
            ${d.mainStart()}
            ${d.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

            let indices = ${h.offsetToIndices("global_idx")};

            var value = ${g}(0);
            ${y}
            output[global_idx] = value;
        }`};return{name:"Pad",shaderCache:{hint:`${t.mode}${s}`,inputDependencies:u},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(R.size(r)/64)},programUniforms:n}),getShaderSource:l}},Mm=(e,t)=>{if(e.length>1){let r=e[1].getBigInt64Array(),i=e.length>=3&&e[2].data?e[2].dataType===10?e[2].getUint16Array()[0]:e[2].getFloat32Array()[0]:0,a=e[0].dims.length,n=new Int32Array(2*a).fill(0);if(e.length>=4){let u=e[3].getBigInt64Array();for(let l=0;l<u.length;l++)n[Number(u[l])]=Number(r[l]),n[Number(u[l])+a]=Number(r[l+u.length])}else r.forEach((u,l)=>n[Number(l)]=Number(u));let s=[];return n.forEach(u=>s.push(u)),{mode:t.mode,value:i,pads:s}}else return t},gy=(e,t)=>{Sm(e.inputs);let r=Mm(e.inputs,t);e.compute(Rm(e.inputs,r),{inputs:[0]})}}),$n,Ko,Xo,Yo,Zo,Bm,Nm,Qo,Jo,yy,_y,eu,by,wy,tu,vy,$y,xy,Ty,ov=U(()=>{qt(),le(),he(),fe(),$n=e=>{if(Ae.webgpu.validateInputContent&&(!e||e.length!==1))throw new Error("Pool ops requires 1 input.")},Ko=(e,t,r)=>{let i=t.format==="NHWC",a=e.dims.slice();i&&a.splice(1,0,a.pop());let n=Object.hasOwnProperty.call(t,"dilations"),s=t.kernelShape.slice(),u=t.strides.slice(),l=n?t.dilations.slice():[],d=t.pads.slice();Ha.adjustPoolAttributes(r,a,s,u,l,d);let h=Ha.computePoolOutputShape(r,a,u,l,s,d,t.autoPad),f=Object.assign({},t);n?Object.assign(f,{kernelShape:s,strides:u,pads:d,dilations:l,cacheKey:t.cacheKey}):Object.assign(f,{kernelShape:s,strides:u,pads:d,cacheKey:t.cacheKey});let g=h.slice();return g.push(g.splice(1,1)[0]),[f,i?g:h]},Xo=(e,t)=>{let r=t.format==="NHWC",i=R.size(e),a=R.size(t.kernelShape),n=[{type:12,data:i},{type:12,data:a}],s=[{name:"outputSize",type:"u32"},{name:"kernelSize",type:"u32"}];if(t.kernelShape.length<=2){let u=t.kernelShape[t.kernelShape.length-1],l=t.strides[t.strides.length-1],d=t.pads[t.pads.length/2-1],h=t.pads[t.pads.length-1],f=!!(d+h);n.push({type:12,data:u},{type:12,data:l},{type:12,data:d},{type:12,data:h}),s.push({name:"kw",type:"u32"},{name:"sw",type:"u32"},{name:"pwStart",type:"u32"},{name:"pwEnd",type:"u32"});let g=!1;if(t.kernelShape.length===2){let y=t.kernelShape[t.kernelShape.length-2],_=t.strides[t.strides.length-2],w=t.pads[t.pads.length/2-2],x=t.pads[t.pads.length-2];g=!!(w+x),n.push({type:12,data:y},{type:12,data:_},{type:12,data:w},{type:12,data:x}),s.push({name:"kh",type:"u32"},{name:"sh",type:"u32"},{name:"phStart",type:"u32"},{name:"phEnd",type:"u32"})}return[n,s,!0,f,g]}else{if(r)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let u=R.computeStrides(t.kernelShape);n.push({type:12,data:u},{type:12,data:t.pads},{type:12,data:t.strides}),s.push({name:"kernelStrides",type:"u32",length:u.length},{name:"pads",type:"u32",length:t.pads.length},{name:"strides",type:"u32",length:t.strides.length});let l=t.pads.reduce((d,h)=>d+h);return[n,s,!!l,!1,!1]}},Yo=(e,t,r,i,a,n,s,u,l,d,h,f)=>{let g=a.format==="NHWC",y=t.type.value,_=K("output",t.type.tensor,i);if(a.kernelShape.length<=2){let w="",x="",$="",v=r-(g?2:1);if(h?w=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${v}] = indices[${v}] * uniforms.sw - uniforms.pwStart + i;
                  if (xIndices[${v}] < 0 || xIndices[${v}]
                      >= uniforms.x_shape[${v}]) {
                    pad++;
                    continue;
                  }
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${n}
                }`:w=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${v}] = indices[${v}] * uniforms.sw - uniforms.pwStart + i;
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${n}
                }`,a.kernelShape.length===2){let k=r-(g?3:2);f?x=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${k}] = indices[${k}] * uniforms.sh - uniforms.phStart + j;
                  if (xIndices[${k}] < 0 || xIndices[${k}] >= uniforms.x_shape[${k}]) {
                    pad += i32(uniforms.kw);
                    continue;
                  }
              `:x=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${k}] = indices[${k}] * uniforms.sh - uniforms.phStart + j;
                `,$=`
              }
            `}return`
            ${e.registerUniforms(l).declareVariables(t,_)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

              let indices = ${_.offsetToIndices("global_idx")};
              var xIndices = ${_.offsetToIndices("global_idx")};

              var value = ${y}(${u});
              var pad = 0;
              ${x}
              ${w}
              ${$}
              ${s}

              output[global_idx] = value;
            }`}else{if(g)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let w=a.kernelShape.length,x=a.pads.length,$="";return d?$=`
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
            ${e.registerUniforms(l).declareVariables(t,_)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
              let indices = ${_.offsetToIndices("global_idx")};
              var xIndices = ${_.offsetToIndices("global_idx")};

              var offsets: array<u32, ${w}>;

              var value = ${y}(${u});
              var pad = 0;
              var isPad = false;

              for (var i: u32 = 0u; i < uniforms.kernelSize; i++) {
                var offset = i;
                for (var j = 0u; j < ${w-1}u; j++) {
                  offsets[j] = offset / ${Q("uniforms.kernelStrides","j",w)};
                  offset -= offsets[j] * ${Q("uniforms.kernelStrides","j",w)};
                }
                offsets[${w-1}] = offset;

                isPad = false;
                for (var j = ${r-w}u; j < ${r}u; j++) {
                  xIndices[j] = indices[j] * ${Q("uniforms.strides",`j - ${r-w}u`,w)}
                    + offsets[j - ${r-w}u] - ${Q("uniforms.pads","j - 2u",x)};
                  ${$}
              }
              ${s}

              output[global_idx] = value;
            }`}},Zo=e=>`${e.format};${e.ceilMode};${e.autoPad};${e.kernelShape.length}`,Bm=e=>`${Zo(e)};${e.countIncludePad}`,Nm=e=>`${Zo(e)};${e.storageOrder};${e.dilations}`,Qo=e=>({format:e.format,autoPad:["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],ceilMode:e.ceil_mode,kernelShape:e.kernel_shape,strides:e.strides,pads:e.pads}),Jo=(e,t,r,i)=>{let[a,n]=Ko(t,i,r),s=N("x",t.dataType,t.dims.length),u=s.type.value,l="value += x_val;",d="";a.countIncludePad?d+=`value /= ${u}(uniforms.kernelSize);`:d+=`value /= ${u}(i32(uniforms.kernelSize) - pad);`;let[h,f,g,y,_]=Xo(n,a);h.push(...J(t.dims,n));let w=["rank"];return{name:e,shaderCache:{hint:`${i.cacheKey};${g};${y};${_}`,inputDependencies:w},getRunData:()=>({outputs:[{dims:n,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(R.size(n)/64)},programUniforms:h}),getShaderSource:x=>Yo(x,s,t.dims.length,n.length,a,l,d,0,f,g,y,_)}},yy=e=>{let t=e.count_include_pad!==0,r=Qo(e);if(r.ceilMode!==0)throw new Error("using ceil() in shape computation is not yet supported for AveragePool");let i={countIncludePad:t,...r,cacheKey:""};return{...i,cacheKey:Bm(i)}},_y=(e,t)=>{$n(e.inputs),e.compute(Jo("AveragePool",e.inputs[0],!1,t))},eu={autoPad:"",ceilMode:0,countIncludePad:!1,kernelShape:[],strides:[],pads:[],storageOrder:0,dilations:[]},by=e=>{let t=e.format;return{format:t,...eu,cacheKey:t}},wy=(e,t)=>{$n(e.inputs),e.compute(Jo("GlobalAveragePool",e.inputs[0],!0,t))},tu=(e,t,r,i)=>{let[a,n]=Ko(t,i,r),s=`
      value = max(x_val, value);
    `,u="",l=N("x",t.dataType,t.dims.length),d=["rank"],[h,f,g,y,_]=Xo(n,a);return h.push(...J(t.dims,n)),{name:e,shaderCache:{hint:`${i.cacheKey};${g};${y};${_}`,inputDependencies:d},getRunData:()=>({outputs:[{dims:n,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(R.size(n)/64)},programUniforms:h}),getShaderSource:w=>Yo(w,l,t.dims.length,n.length,a,s,u,t.dataType===10?-65504:-1e5,f,g,y,_)}},vy=(e,t)=>{$n(e.inputs),e.compute(tu("MaxPool",e.inputs[0],!1,t))},$y=e=>{let t=e.storage_order,r=e.dilations,i=Qo(e);if(t!==0)throw new Error("column major storage order is not yet supported for MaxPool");if(i.ceilMode!==0)throw new Error("using ceil() in shape computation is not yet supported for MaxPool");let a={storageOrder:t,dilations:r,...i,cacheKey:""};return{...a,cacheKey:Nm(a)}},xy=e=>{let t=e.format;return{format:t,...eu,cacheKey:t}},Ty=(e,t)=>{$n(e.inputs),e.compute(tu("GlobalMaxPool",e.inputs[0],!0,t))}}),Dm,Pm,ky,Ey,uv=U(()=>{le(),he(),je(),fe(),Dm=(e,t)=>{if(e.length<2||e.length>3)throw new Error("DequantizeLinear requires 2 or 3 inputs.");if(e.length===3&&e[1].dims===e[2].dims)throw new Error("x-scale and x-zero-point must have the same shape.");if(e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[0].dataType===6&&e.length>2)throw new Error("In the case of dequantizing int32 there is no zero point.");if(e[1].dims.length!==0&&e[1].dims.length!==1&&e[1].dims.length!==e[0].dims.length)throw new Error("scale input must be a scalar, a 1D tensor, or have the same rank as the input tensor.");if(e.length>2){if(e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[1].dims.length!==e[2].dims.length)throw new Error("scale and zero-point inputs must have the same rank.");if(!e[1].dims.map((r,i)=>r===e[2].dims[i]).reduce((r,i)=>r&&i,!0))throw new Error("scale and zero-point inputs must have the same shape.")}if(t.blockSize>0){if(e[1].dims.length===0||e[1].dims.length===1&&e[1].dims[0]===1)throw new Error("blockSize must be set only for block quantization.");if(!e[1].dims.map((a,n)=>n===t.axis||a===e[0].dims[n]).reduce((a,n)=>a&&n,!0))throw new Error("For block qunatization, scale input shape to match the input shape except for the axis");if(e[1].dims.length!==e[0].dims.length)throw new Error("For block qunatization the scale input rank must be the same as the x rank.");let r=e[0].dims[t.axis],i=e[1].dims[t.axis];if(t.blockSize<Math.ceil(r/i)||t.blockSize>Math.ceil(r/(i-1)-1))throw new Error("blockSize must be with in the range [ceil(dI / Si), ceil(dI / (Si - 1) - 1)].")}},Pm=(e,t)=>{let r=R.normalizeAxis(t.axis,e[0].dims.length),i=e[0].dataType,a=i===3,n=e[0].dims,s=e[1].dataType,u=R.size(n),l=i===3||i===2,d=l?[Math.ceil(R.size(e[0].dims)/4)]:e[0].dims,h=e[1].dims,f=e.length>2?e[2]:void 0,g=f?l?[Math.ceil(R.size(f.dims)/4)]:f.dims:void 0,y=h.length===0||h.length===1&&h[0]===1,_=y===!1&&h.length===1,w=Fe(u),x=y&&(!l||w===4),$=x?w:1,v=x&&!l?w:1,k=N("input",l?12:i,d.length,v),E=N("scale",s,h.length),S=f?N("zero_point",l?12:i,g.length):void 0,A=K("output",s,n.length,$),I=[k,E];S&&I.push(S);let z=[d,h];f&&z.push(g);let M=[{type:12,data:u/$},{type:12,data:r},{type:12,data:t.blockSize},...J(...z,n)],V=ee=>{let q=[{name:"output_size",type:"u32"},{name:"axis",type:"u32"},{name:"block_size",type:"u32"}];return`
      ${ee.registerUniforms(q).declareVariables(...I,A)}
      ${ee.mainStart()}
          ${ee.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let output_indices = ${A.offsetToIndices("global_idx")};

          // Set input x
          ${l?`
            let input = ${k.getByOffset("global_idx / 4")};
            let x_vec = ${a?"unpack4xI8(input)":"unpack4xU8(input)"};
            let x_value = ${$===1?"x_vec[global_idx % 4]":"x_vec"};`:`let x_value = ${k.getByOffset("global_idx")};`};

          // Set scale input
          ${y?`let scale_value= ${E.getByOffset("0")}`:_?`
            let scale_index = ${A.indicesGet("output_indices","uniforms.axis")};
            let scale_value= ${E.getByOffset("scale_index")};`:`
            var scale_indices: ${E.type.indices} = output_indices;
            let index = ${E.indicesGet("scale_indices","uniforms.axis")} / uniforms.block_size;
            ${E.indicesSet("scale_indices","uniforms.axis","index")};
            let scale_value= ${E.getByIndices("scale_indices")};`};

          // Set zero-point input
          ${S?y?l?`
                let zero_point_input = ${S.getByOffset("0")};
                let zero_point_vec =  ${a?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value= zero_point_vec[0]`:`let zero_point_value = ${S.getByOffset("0")}`:_?l?`
                let zero_point_index = ${A.indicesGet("output_indices","uniforms.axis")};
                let zero_point_input = ${S.getByOffset("zero_point_index / 4")};
                let zero_point_vec =  ${a?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_index % 4]`:`
                let zero_point_index = ${A.indicesGet("output_indices","uniforms.axis")};
                let zero_point_value = ${S.getByOffset("zero_point_index")};`:l?`
                let zero_point_offset = ${E.indicesToOffset("scale_indices")};
                let zero_point_input = ${S.getByOffset("zero_point_offset / 4")};
                let zero_point_vec = ${a?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_offset % 4];`:`let zero_point_value = ${S.getByIndices("scale_indices")};`:`let zero_point_value = ${l?a?"i32":"u32":k.type.value}(0);`};
      // Compute and write output
      ${A.setByOffset("global_idx",`${A.type.value}(x_value - zero_point_value) * scale_value`)};
      }`};return{name:"DequantizeLinear",shaderCache:{hint:t.cacheKey,inputDependencies:S?["rank","rank","rank"]:["rank","rank"]},getShaderSource:V,getRunData:()=>({outputs:[{dims:n,dataType:s}],dispatchGroup:{x:Math.ceil(u/$/64),y:1,z:1},programUniforms:M})}},ky=(e,t)=>{Dm(e.inputs,t),e.compute(Pm(e.inputs,t))},Ey=e=>xe({axis:e.axis,blockSize:e.blockSize})}),Lm,Um,Sy,lv=U(()=>{qt(),le(),fe(),Lm=(e,t,r)=>{let i=e===t,a=e<t&&r<0,n=e>t&&r>0;if(i||a||n)throw new Error("Range these inputs' contents are invalid.")},Um=(e,t,r,i)=>{let a=Math.abs(Math.ceil((t-e)/r)),n=[a],s=a,u=[{type:12,data:s},{type:i,data:e},{type:i,data:r},...J(n)],l=d=>{let h=K("output",i,n.length),f=h.type.value,g=[{name:"outputSize",type:"u32"},{name:"start",type:f},{name:"delta",type:f}];return`
        ${d.registerUniforms(g).declareVariables(h)}
        ${d.mainStart()}
        ${d.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        output[global_idx] = uniforms.start + ${f}(global_idx) * uniforms.delta;
      }`};return{name:"Range",shaderCache:{hint:`${i}`},getShaderSource:l,getRunData:()=>({outputs:[{dims:n,dataType:i}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:u})}},Sy=e=>{let t=0,r=0,i=0;e.inputs[0].dataType===6?(t=e.inputs[0].getInt32Array()[0],r=e.inputs[1].getInt32Array()[0],i=e.inputs[2].getInt32Array()[0]):e.inputs[0].dataType===1&&(t=e.inputs[0].getFloat32Array()[0],r=e.inputs[1].getFloat32Array()[0],i=e.inputs[2].getFloat32Array()[0]),Ae.webgpu.validateInputContent&&Lm(t,r,i),e.compute(Um(t,r,i,e.inputs[0].dataType),{inputs:[]})}}),Fm,Vm,Cy,Ay,dv=U(()=>{le(),he(),je(),fe(),Fm=(e,t,r,i)=>{if(e!=="none"&&i!=="i32"&&i!=="u32"&&i!=="f32")throw new Error(`Input ${i} is not supported with reduction ${e}.`);let a=`{
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
                ${a}max(bitcast<f32>(oldValue), (${r}))${n}`;case"min":return i==="i32"||i==="u32"?`atomicMin(&${t}, bitcast<${i}>(${r}));`:`${a}min(bitcast<${i}>(oldValue), (${r}))${n}`;case"mul":return`${a}(bitcast<${i}>(oldValue) * (${r}))${n}`;default:throw new Error(`Reduction ${e} is not supported.`)}},Vm=(e,t)=>{let r=e[0].dims,i=e[1].dims,a=r,n=1,s=Math.ceil(R.sizeToDimension(i,i.length-1)/n),u=i[i.length-1],l=R.sizeFromDimension(r,u),d=[{type:12,data:s},{type:12,data:u},{type:12,data:l},...J(e[1].dims,e[2].dims,a)],h=f=>{let g=N("indices",e[1].dataType,e[1].dims.length),y=N("updates",e[2].dataType,e[2].dims.length,n),_=t.reduction!=="none"&&t.reduction!==""?i0("output",e[0].dataType,a.length):K("output",e[0].dataType,a.length,n);return`
      ${f.registerUniform("output_size","u32").registerUniform("last_index_dimension","u32").registerUniform("num_updates_elements","u32").declareVariables(g,y,_)}
      ${f.mainStart()}
        ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
  var data_offset = 0u;
  let indices_start = uniforms.last_index_dimension * global_idx;
  let indices_end = indices_start + uniforms.last_index_dimension;
  for (var i = indices_start; i < indices_end; i++) {
    var index = i32(indices[i].x);
    ${e[0].dims.length===1?`
    let element_count_dim = uniforms.output_strides;
    let dim_value = uniforms.output_shape;`:`
    let element_count_dim = uniforms.output_strides[i - indices_start];
    let dim_value = uniforms.output_shape[i - indices_start];`}
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
    ${Fm(t.reduction,"output[data_offset + i]","value",_.type.value)}
  }

      }`};return{name:"ScatterND",shaderCache:{hint:`${t.cacheKey}_${t.reduction}`,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:a,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:d}),getShaderSource:h}},Cy=e=>xe({reduction:e.reduction}),Ay=(e,t)=>{e.compute(Vm(e.inputs,t),{inputs:[e.inputs[1],e.inputs[2]],outputs:[]})}}),Wm,Gm,jm,ru,qm,Hm,Km,Xm,Ym,Zm,Qm,Jm,iu,e1,t1,r1,i1,n1,Iy,zy,cv=U(()=>{le(),he(),je(),fe(),Wm=(e,t)=>{if(e.every(r=>r>0||(()=>{throw new Error("Resize requires scales input values to be positive")})),e.length>0){if(t.mode==="linear"){if(!(e.length===2||e.length===3||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1||e.length===5&&e[0]===1&&e[1]===1))throw new Error(`For linear mode, Resize requires scales to be 2D, 3D, 4D with either two outermost or one innermost and
            one outermost scale values equal to 1, or 5D with two outermost scale values equal to 1`)}else if(t.mode==="cubic"&&!(e.length===2||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1))throw new Error("Resize requires scales input size to be 2 or 4 for cubic mode")}},Gm=(e,t,r)=>{t.every(a=>a>=0&&a<r||(()=>{throw new Error("Resize requires axes input values to be positive and less than rank")}));let i=new Array(r).fill(1);return t.forEach((a,n)=>i[a]=e[n]),i},jm=(e,t,r,i,a,n)=>{let[s,u,l]=r>10?[1,2,3]:[-1,e.length>1?1:-1,-1],d=e[0].dims.length;if(s>0&&e.length>s&&e[s].dims.length>0)e[s].getFloat32Array().forEach(h=>n.push(h));else if(t.coordinateTransformMode==="tf_crop_and_resize")throw new Error("Resize requires RoI input to be specified when coordinateTransformMode is tfCropAndResize");if(u>0&&e.length>u&&e[u].dims.length===1&&e[u].dims[0]>0){if(e[u].getFloat32Array().forEach(h=>i.push(h)),i.length!==0&&i.length!==d&&r>=18&&i.length!==t.axes.length)throw new Error("Resize requires scales input size to be same as input rank or axes size for opset 18 and up");Wm(i,t),t.axes.length>0&&Gm(i,t.axes,d).forEach((h,f)=>i[f]=h)}if(l>0&&e.length>l&&e[l].dims.length===1&&e[l].dims[0]>0&&(e[l].getBigInt64Array().forEach(h=>a.push(Number(h))),a.length!==0&&a.length!==d&&r>=18&&a.length!==t.axes.length))throw new Error("Resize requires sizes input size to be same as input rank or axes size for opset 18 and up");if(t.axes.length>0){if(i.length!==0&&i.length!==t.axes.length)throw new Error('Resize requires "scales" input size to be of axes rank when axes attributes is specified');if(a.length!==0&&a.length!==t.axes.length)throw new Error('Resize requires "sizes" input size to be of rank axes rank when axes attributes is specified')}if(typeof i<"u"&&typeof a<"u"&&i.length>0&&a.length>d)throw new Error("Resize requires only of scales or sizes to be specified")},ru=(e,t,r,i)=>`
  // The whole part and the fractional part are calculated separately due to inaccuracy of floating
  // point division. As an example, f32(21) / f32(7) may evaluate to 2.99... instead of 3, causing an
  // offset-by-one error later in floor().
  let big = (${e}) * (${t});
  let whole = ${i}(big / (${r}));
  let fract = ${i}(big % (${r})) / ${i}(${r});
  return whole + fract;
`,qm=(e,t)=>`fn getOriginalCoordinateFromResizedCoordinate(xResized: u32, xScale: f32, lengthResized: u32,
     lengthOriginal: u32, roiStart: f32, roiEnd: f32) -> ${t} { `+(()=>{switch(e){case"asymmetric":return`
          if (xScale < 1.0 || floor(xScale) != xScale) {
            return ${t}(xResized) / ${t}(xScale);
          } else {
            ${ru("xResized","lengthOriginal","lengthResized",t)}
          }
        `;case"pytorch_half_pixel":return`if (lengthResized > 1) {
                    return (${t}(xResized) + 0.5) / ${t}(xScale) - 0.5;
                  } else {
                    return 0.0;
                  }`;case"tf_half_pixel_for_nn":return`return (${t}(xResized) + 0.5) / ${t}(xScale);`;case"align_corners":return`if (lengthResized == 1) {
                    return 0.0;
                  } else {
                    ${ru("xResized","lengthOriginal - 1","lengthResized - 1",t)}
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
                  return offset + ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;case"half_pixel":return`return ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;default:throw new Error(`Coordinate transform mode ${e} is not supported`)}})()+"}",Hm=(e,t,r)=>`fn getNearestPixelFromOriginal(xOriginal: ${r}, isDownSample: bool) -> ${r} {`+(()=>{switch(e){case"round_prefer_ceil":return"if (fract(xOriginal) == 0.5) {             return ceil(xOriginal);           } else {             return round(xOriginal);           }";case"floor":return"return floor(xOriginal);";case"ceil":return"return ceil(xOriginal);";case"round_prefer_floor":return"if (fract(xOriginal) == 0.5) {                     return floor(xOriginal);                   } else {                     return round(xOriginal);                   }";case"simple":default:if(t<11)return"if (isDownSample)                     {                       return ceil(xOriginal);                     } else {                       return xOriginal;                     }";throw new Error(`Nearest mode ${e} is not supported`)}})()+"}",Km=(e,t,r)=>{let i=new Array(r).fill(0).concat(new Array(r).fill(1)),a=e.length===0?i:e.slice();return t.length>0?(t.forEach((n,s)=>{i[n]=a[s],i[s+r]=a[t.length+s]}),i):a},Xm=(e,t,r,i)=>{let a=[];if(r.length>0)if(i.length>0){if(e.forEach(n=>a.push(n)),Math.max(...i)>e.length)throw new Error("axes is out of bound");i.forEach((n,s)=>a[n]=r[s])}else r.forEach(n=>a.push(n));else{if(t.length===0)throw new Error("Resize requires either scales or sizes.");a=e.map((n,s)=>Math.round(n*t[s]))}return a},Ym=(e,t,r)=>{let i=(()=>{switch(r.keepAspectRatioPolicy){case"not_larger":return r.axes.length>0?Math.min(...r.axes.map(n=>t[n]),Number.MAX_VALUE):Math.min(...t,Number.MAX_VALUE);case"not_smaller":return r.axes.length>0?Math.max(...r.axes.map(n=>t[n]),Number.MIN_VALUE):Math.max(...t,Number.MIN_VALUE);default:throw new Error(`Keep aspect ratio policy ${r.keepAspectRatioPolicy} is not supported`)}})();t.fill(1,0,t.length);let a=e.slice();return r.axes.length>0?(r.axes.forEach(n=>t[n]=i),r.axes.forEach(n=>a[n]=Math.round(e[n]*t[n]))):(t.fill(i,0,t.length),a.forEach((n,s)=>a[s]=Math.round(n*t[s]))),a},Zm=(e,t,r,i,a)=>`
    fn calculateOriginalIndicesFromOutputIndices(output_indices: ${e.type.indices}) -> array<${e.type.value}, ${r.length}> {
      var original_indices: array<${e.type.value}, ${r.length}>;
      for (var i:u32 = 0; i < ${r.length}; i++) {
        var output_index = ${e.indicesGet("output_indices","i")};
        var scale = ${Q("uniforms.scales","i",i)};
        var roi_low = ${Q("uniforms.roi","i",a)};
        var roi_hi = ${Q("uniforms.roi",`i + ${t.length}`,a)};
        if (scale == 1.0) {
          original_indices[i] = ${e.type.value}(output_index);
        } else {
          var input_shape_i = ${Q("uniforms.input_shape","i",t.length)};
          var output_shape_i = ${Q("uniforms.output_shape","i",r.length)};
          original_indices[i] = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                           input_shape_i, roi_low, roi_hi);
        }
      }
      return original_indices;
    }`,Qm=(e,t,r,i,a,n,s)=>`
    fn calculateInputIndicesFromOutputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
      var input_indices: ${e.type.indices};
      for (var i:u32 = 0; i < ${i.length}; i++) {
        var output_index = ${t.indicesGet("output_indices","i")};
        var input_index: u32;
        var scale = ${Q("uniforms.scales","i",a)};
        if (scale == 1.0) {
          input_index = output_index;
        } else {
          var roi_low = ${Q("uniforms.roi","i",n)};
          var roi_hi = ${Q("uniforms.roi",`i + ${r.length}`,n)};
          var input_shape_i = ${Q("uniforms.input_shape","i",r.length)};
          var output_shape_i = ${Q("uniforms.output_shape","i",i.length)};
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
    }`,Jm=(e,t)=>`
    fn checkInputIndices(input_indices: ${e.type.indices}) -> bool {
      for (var i:u32 = 0; i < ${t.length}; i++) {
        var input_index = ${e.indicesGet("input_indices","i")};
        if (input_index < 0 || input_index >= ${Q("uniforms.input_shape","i",t.length)}) {
          return false;
        }
      }
      return true;
    }`,iu=(e,t,r,i)=>e.rank>i?`
    ${e.indicesSet("input_indices",t,"channel")};
    ${e.indicesSet("input_indices",r,"batch")};
`:"",e1=(e,t,r,i,a)=>{let[n,s,u,l]=r.length===2?[-1,0,1,-1]:[0,2,3,1],d=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, row: u32, col: u32) -> ${d} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",s,`max(0, min(row, ${r[s]} - 1))`)};
      ${e.indicesSet("input_indices",u,`max(0, min(col, ${r[u]} - 1))`)};
      ${iu(e,l,n,2)}
      return ${e.getByIndices("input_indices")};
    }

    fn bilinearInterpolation(output_indices: ${t.type.indices}) -> ${d} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var row:${d} = originalIndices[${s}];
      var col:${d} = originalIndices[${u}];
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
      var x11: ${d} = getInputValue(batch, channel, row1, col1);
      var x12: ${d} = getInputValue(batch, channel, row1, col2);
      var x21: ${d} = getInputValue(batch, channel, row2, col1);
      var x22: ${d} = getInputValue(batch, channel, row2, col2);
      var dx1: ${d} = abs(row - ${d}(row1));
      var dx2: ${d} = abs(${d}(row2) - row);
      var dy1: ${d} = abs(col - ${d}(col1));
      var dy2: ${d} = abs(${d}(col2) - col);
      if (row1 == row2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (col1 == col2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      return (x11 * dx2 * dy2 + x12 * dx2 * dy1 + x21 * dx1 * dy2 + x22 * dx1 * dy1);
    }`},t1=(e,t,r,i,a,n,s,u,l,d)=>{let h=r.length===2,[f,g]=h?[0,1]:[2,3],y=e.type.value,_=w=>{let x=w===f?"row":"col";return`
      fn ${x}CubicInterpolation(input_indices: ${e.type.indices}, output_indices: ${t.type.indices}) -> ${y} {
        var output_index = ${t.indicesGet("output_indices",w)};
        var originalIdx: ${y} = getOriginalCoordinateFromResizedCoordinate(output_index, ${a[w]},
        ${i[w]}, ${r[w]}, ${n[w]}, ${n[w]} + ${r.length});
        var fractOriginalIdx: ${y} = originalIdx - floor(originalIdx);
        var coefs = getCubicInterpolationCoefs(fractOriginalIdx);

        if (${u} && (originalIdx < 0 || originalIdx > (${r[w]} - 1))) {
          return ${l};
        }
        var data: array<${y}, 4> = array<${y}, 4>(0.0, 0.0, 0.0, 0.0);
        for (var i: i32 = -1; i < 3; i++) {
          var ${x}: ${y} = originalIdx + ${y}(i);
          if (${x} < 0 || ${x} >= ${r[w]}) {
            ${d?`coefs[i + 1] = 0.0;
                        continue;`:u?`return ${l};`:`${x} = max(0, min(${x}, ${r[w]} - 1));`};
          }
        var input_indices_copy: ${e.type.indices} = input_indices;
          ${e.indicesSet("input_indices_copy",w,`u32(${x})`)};
          data[i + 1] = ${w===f?e.getByIndices("input_indices_copy"):"rowCubicInterpolation(input_indices_copy, output_indices)"};
        }
        return cubicInterpolation1D(data, coefs);
      }`};return`
    ${_(f)};
    ${_(g)};
  fn getCubicInterpolationCoefs(s: ${y}) -> array<${y}, 4> {
    var absS = abs(s);
    var coeffs: array<${y}, 4> = array<${y}, 4>(0.0, 0.0, 0.0, 0.0);
    var oneMinusAbsS: ${y} = 1.0 - absS;
    var twoMinusAbsS: ${y} = 2.0 - absS;
    var onePlusAbsS: ${y} = 1.0 + absS;
    coeffs[0] = ((${s} * onePlusAbsS - 5 * ${s}) * onePlusAbsS + 8 * ${s}) * onePlusAbsS - 4 * ${s};
    coeffs[1] = ((${s} + 2) * absS - (${s} + 3)) * absS * absS + 1;
    coeffs[2] = ((${s} + 2) * oneMinusAbsS - (${s} + 3)) * oneMinusAbsS * oneMinusAbsS + 1;
    coeffs[3] = ((${s} * twoMinusAbsS - 5 * ${s}) * twoMinusAbsS + 8 * ${s}) * twoMinusAbsS - 4 * ${s};
    return coeffs;
  }

  fn cubicInterpolation1D(x: array<${y}, 4>, coefs: array<${y}, 4>) -> ${y} {
    var coefsSum: ${y} = coefs[0] + coefs[1] + coefs[2] + coefs[3];
    return (x[0] * coefs[0] + x[1] * coefs[1]+ x[2] * coefs[2]+ x[3] * coefs[3]) / coefsSum;
  }

  fn bicubicInterpolation(output_indices: ${t.type.indices}) -> ${y} {
    var input_indices: ${e.type.indices} = output_indices;
    return colCubicInterpolation(input_indices, output_indices);
  }
    `},r1=(e,t,r,i,a)=>{let[n,s,u,l,d]=r.length===3?[-1,0,1,2,-1]:[0,2,3,4,1],h=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, depth:u32, height: u32, width: u32) -> ${h} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",s,`max(0, min(depth, ${r[s]} - 1))`)};
      ${e.indicesSet("input_indices",u,`max(0, min(height, ${r[u]} - 1))`)};
      ${e.indicesSet("input_indices",l,`max(0, min(width, ${r[l]} - 1))`)};
      ${iu(e,d,n,3)}
      return ${e.getByIndices("input_indices")};
    }

    fn trilinearInterpolation(output_indices: ${t.type.indices}) -> ${h} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var depth:${h} = originalIndices[${s}];
      var height:${h} = originalIndices[${u}];
      var width:${h} = originalIndices[${l}];
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
      var channel: u32 = ${r.length>3?`u32(originalIndices[${d}])`:"0"};
      var batch: u32 =  ${r.length>3?`u32(originalIndices[${n}])`:"0"};

      var x111: ${h} = getInputValue(batch, channel, depth1, height1, width1);
      var x112: ${h} = getInputValue(batch, channel, depth1, height1, width2);
      var x121: ${h} = getInputValue(batch, channel, depth1, height2, width1);
      var x122: ${h} = getInputValue(batch, channel, depth1, height2, width2);
      var x211: ${h} = getInputValue(batch, channel, depth2, height1, width1);
      var x212: ${h} = getInputValue(batch, channel, depth2, height1, width2);
      var x221: ${h} = getInputValue(batch, channel, depth2, height2, width1);
      var x222: ${h} = getInputValue(batch, channel, depth2, height2, width2);
      var dx1: ${h} = abs(depth - ${h}(depth1));
      var dx2: ${h} = abs(${h}(depth2) - depth);
      var dy1: ${h} = abs(height - ${h}(height1));
      var dy2: ${h} = abs(${h}(height2) - height);
      var dz1: ${h} = abs(width - ${h}(width1));
      var dz2: ${h} = abs(${h}(width2) - width);
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
    }`},i1=(e,t,r,i,a,n)=>{let s=e.dims,u=Km(n,t.axes,s.length),l=Xm(s,i,a,t.axes),d=i.slice();i.length===0&&(d=s.map((v,k)=>v===0?1:l[k]/v),t.keepAspectRatioPolicy!=="stretch"&&(l=Ym(s,d,t)));let h=K("output",e.dataType,l.length),f=N("input",e.dataType,s.length),g=R.size(l),y=s.length===l.length&&s.every((v,k)=>v===l[k]),_=t.coordinateTransformMode==="tf_crop_and_resize",w=t.extrapolationValue,x=f.type.value,$=v=>`
      ${y?"":`
      ${qm(t.coordinateTransformMode,x)};
      ${(()=>{switch(t.mode){case"nearest":return`
              ${Jm(f,s)};
              ${Hm(t.nearestMode,r,x)};
              ${Qm(f,h,s,l,d.length,u.length,_)};
              `;case"linear":return`
              ${Zm(h,s,l,d.length,u.length)};
              ${(()=>{if(s.length===2||s.length===4)return`${e1(f,h,s,_,w)}`;if(s.length===3||s.length===5)return`${r1(f,h,s,_,w)}`;throw Error("Linear mode only supports input dims 2, 3, 4 and 5 are supported in linear mode.")})()};
            `;case"cubic":return`
            ${(()=>{if(s.length===2||s.length===4)return`${t1(f,h,s,l,d,u,t.cubicCoeffA,_,t.extrapolationValue,t.excludeOutside)}`;throw Error("Cubic mode only supports input dims 2 and 4 are supported in linear mode.")})()};
            `;default:throw Error("Invalid resize mode")}})()};
      `}
      ${v.registerUniform("output_size","u32").registerUniform("scales","f32",d.length).registerUniform("roi","f32",u.length).declareVariables(f,h)}
      ${v.mainStart()}
        ${v.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
        ${y?"output[global_idx] = input[global_idx];":`
        let output_indices = ${h.offsetToIndices("global_idx")};
        var input_indices: ${f.type.indices};
        ${(()=>{switch(t.mode){case"nearest":return`input_indices = calculateInputIndicesFromOutputIndices(output_indices);
                if (checkInputIndices(input_indices)) {
                  output[global_idx] = ${f.getByIndices("input_indices")};
                } else {
                  output[global_idx] = ${t.extrapolationValue};
                }`;case"linear":return`output[global_idx] = ${s.length===2||s.length===4?"bilinearInterpolation":"trilinearInterpolation"}(output_indices);`;case"cubic":return"output[global_idx] = bicubicInterpolation(output_indices);";default:throw Error(`Unsupported resize mode: ${t.mode}`)}})()};
`}
      }`;return{name:"Resize",shaderCache:{hint:`${t.cacheKey}|${r}|${d.length>0?t.mode==="cubic"?d:d.length:""}|${a.length>0?a:""}|${u.length>0?u:""}|${y}|${t.mode==="nearest"?s.length:s}`,inputDependencies:["rank"]},getShaderSource:$,getRunData:()=>({outputs:[{dims:l,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(g/64)},programUniforms:[{type:12,data:g},{type:1,data:d},{type:1,data:u},...J(s,l)]})}},n1=e=>{let t=e.customDataBuffer;return new Uint32Array(t,t.byteOffset,1)[0]},Iy=(e,t)=>{let r=[],i=[],a=[],n=n1(e);if(t.antialias!==0)throw Error("Only default value (0) for Antialias attribute is supported");jm(e.inputs,t,n,r,i,a),e.compute(i1(e.inputs[0],t,n,r,i,a),{inputs:[0]})},zy=e=>{let t=e.antialias,r=e.axes,i=e.coordinateTransformMode,a=e.cubicCoeffA,n=e.excludeOutside!==0,s=e.extrapolationValue,u=e.keepAspectRatioPolicy,l=e.mode,d=e.nearestMode===""?"simple":e.nearestMode;return xe({antialias:t,axes:r,coordinateTransformMode:i,cubicCoeffA:a,excludeOutside:n,extrapolationValue:s,keepAspectRatioPolicy:u,mode:l,nearestMode:d})}}),a1,s1,Oy,hv=U(()=>{le(),he(),fe(),a1=e=>{if(!e||e.length<3)throw new Error("layerNorm requires at least 3 inputs.");let t=e[0],r=e[1],i=e[2];if(t.dataType!==r.dataType||t.dataType!==i.dataType)throw new Error("All inputs must have the same data type");if(t.dims.length!==3&&t.dims.length!==2)throw new Error("Input must be 2D or 3D");if(r.dims.length!==3&&r.dims.length!==2)throw new Error("Skip must be 2D or 3D");let a=t.dims[t.dims.length-1],n=t.dims[t.dims.length-2];if(r.dims[r.dims.length-1]!==a)throw new Error("Skip must have the same hidden size as input");if(r.dims[r.dims.length-2]!==n)throw new Error("Skip must have the same sequence length as input");if(i.dims.length!==1)throw new Error("Gamma must be 1D");if(i.dims[i.dims.length-1]!==a)throw new Error("Gamma must have the same hidden size as input");if(e.length>3){let s=e[3];if(s.dims.length!==1)throw new Error("Beta must be 1D");if(s.dims[s.dims.length-1]!==a)throw new Error("Beta must have the same hidden size as input")}if(e.length>4){let s=e[4];if(s.dims.length!==1)throw new Error("Bias must be 1D");if(s.dims[s.dims.length-1]!==a)throw new Error("Bias must have the same hidden size as input")}},s1=(e,t,r,i)=>{let a=t.simplified,n=e[0].dims,s=R.size(n),u=n,l=s,d=n.slice(-1)[0],h=i?n.slice(0,-1).concat(1):[],f=!a&&e.length>3,g=e.length>4,y=i&&r>1,_=i&&r>2,w=r>3,x=64,$=Fe(d),v=[{type:12,data:l},{type:12,data:$},{type:12,data:d},{type:1,data:t.epsilon}],k=S=>{let A=[{name:"output_size",type:"u32"},{name:"components",type:"u32"},{name:"hidden_size",type:"u32"},{name:"epsilon",type:"f32"}],I=[N("x",e[0].dataType,e[0].dims,$),N("skip",e[1].dataType,e[1].dims,$),N("gamma",e[2].dataType,e[2].dims,$)];f&&I.push(N("beta",e[3].dataType,e[3].dims,$)),g&&I.push(N("bias",e[4].dataType,e[4].dims,$)),I.push(K("output",e[0].dataType,u,$)),y&&I.push(K("mean_output",1,h)),_&&I.push(K("inv_std_output",1,h)),w&&I.push(K("input_skip_bias_sum",e[0].dataType,u,$));let z=it(e[0].dataType),M=it(1,$);return`

      ${S.registerUniforms(A).declareVariables(...I)}
      var<workgroup> sum_shared : array<${M}, ${x}>;
      var<workgroup> sum_squared_shared : array<${M}, ${x}>;

      ${S.mainStart([x,1,1])}
        let ix = local_id.x;
        let iy = global_id.x / ${x};

        let hidden_size_vectorized: u32 = uniforms.hidden_size / uniforms.components;
        var stride = hidden_size_vectorized / ${x};
        let offset = ix * stride + iy * hidden_size_vectorized;
        let offset1d = stride * ix;
        if (ix == ${x-1}) {
          stride = hidden_size_vectorized - stride * ix;
        }
        for (var i: u32 = 0; i < stride; i++) {
          let skip_value = skip[offset + i];
          let bias_value = ${g?"bias[offset1d + i]":z+"(0.0)"};
          let input_value = x[offset + i];
          let value = input_value + skip_value + bias_value;
          ${w?"input_skip_bias_sum[offset + i] = value;":""}
          output[offset + i] = value;
          let f32_value = ${Bi(z,$,"value")};
          sum_shared[ix] += f32_value;
          sum_squared_shared[ix] += f32_value * f32_value;
        }
        workgroupBarrier();

        var reduce_size : u32 = ${x};
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
        let mean = ${Xr("sum",$)} / f32(uniforms.hidden_size);
        let inv_std_dev = inverseSqrt(${Xr("square_sum",$)} / f32(uniforms.hidden_size) ${a?"":"- mean * mean"} + uniforms.epsilon);
        ${y?"mean_output[global_idx] = mean;":""}
        ${_?"inv_std_output[global_idx] = inv_std_dev;":""}

        for (var i: u32 = 0; i < stride; i++) {
          output[offset + i] = (output[offset + i] ${a?"":`- ${z}(mean)`}) *
            ${z}(inv_std_dev) * gamma[offset1d + i]
            ${f?"+ beta[offset1d + i]":""};
        }
      }`},E=[{dims:u,dataType:e[0].dataType}];return r>1&&E.push({dims:h,dataType:1}),r>2&&E.push({dims:h,dataType:1}),r>3&&E.push({dims:n,dataType:e[0].dataType}),{name:"SkipLayerNormalization",shaderCache:{hint:`${$};${y};${_};${w}`,inputDependencies:e.map((S,A)=>"type")},getShaderSource:k,getRunData:()=>({outputs:E,dispatchGroup:{x:Math.ceil(l/d)},programUniforms:v})}},Oy=(e,t)=>{a1(e.inputs);let r=[0];e.outputCount>1&&r.push(-3),e.outputCount>2&&r.push(-3),e.outputCount>3&&r.push(3),e.compute(s1(e.inputs,t,e.outputCount,!1),{outputs:r})}}),o1,xn,u1,nu,l1,d1,Ry,My,pv=U(()=>{le(),he(),je(),fe(),o1=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");if(t.axes.length!==0){if(t.axes.length!==t.starts.length||t.axes.length!==t.ends.length)throw new Error("axes, starts and ends must have the same length")}else if(t.starts.length!==t.ends.length)throw new Error("starts and ends must have the same length");e.slice(1).forEach((r,i)=>{if(e[i+1].dataType!==6&&e[i+1].dataType!==7)throw new Error(`Input ${i} must be an array of int32 or int64`)})},xn=(e,t)=>{let r=[];if(e.length>t)if(e[t].dataType===7)e[t].getBigInt64Array().forEach(i=>r.push(Number(i)));else if(e[t].dataType===6)e[t].getInt32Array().forEach(i=>r.push(Number(i)));else throw new Error(`Input ${t} must be an array of int32 or int64`);return r},u1=(e,t)=>{if(e.length>1){let r=xn(e,1),i=xn(e,2),a=xn(e,3);return a.length===0&&(a=[...Array(e[0].dims.length).keys()]),xe({starts:r,ends:i,axes:a})}else return t},nu=(e,t,r,i,a)=>{let n=e;return e<0&&(n+=r[i[t]]),a[t]<0?Math.max(0,Math.min(n,r[i[t]]-1)):Math.max(0,Math.min(n,r[i[t]]))},l1=(e,t,r)=>`fn calculateInputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
          var input_indices: ${e.type.indices};
          var carry = 0u;
          for (var i = ${r.length-1}; i >= 0; i--) {
            let input_shape_i = ${Q("uniforms.input_shape","i",r.length)};
            let steps_i = ${Q("uniforms.steps","i",r.length)};
            let signs_i = ${Q("uniforms.signs","i",r.length)};
            let starts_i = ${Q("uniforms.starts","i",r.length)};
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
      }`,d1=(e,t)=>{let r=e[0].dims,i=R.size(r),a=t.axes.length>0?R.normalizeAxes(t.axes,r.length):[...Array(r.length).keys()],n=xn(e,4);n.forEach($=>$!==0||(()=>{throw new Error("step cannot be 0")})),n.length===0&&(n=Array(a.length).fill(1));let s=t.starts.map(($,v)=>nu($,v,r,a,n)),u=t.ends.map(($,v)=>nu($,v,r,a,n));if(a.length!==s.length||a.length!==u.length)throw new Error("start, ends and axes should have the same number of elements");if(a.length!==r.length)for(let $=0;$<r.length;++$)a.includes($)||(s.splice($,0,0),u.splice($,0,r[$]),n.splice($,0,1));let l=n.map($=>Math.sign($));n.forEach(($,v,k)=>{if($<0){let E=(u[v]-s[v])/$,S=s[v],A=S+E*n[v];s[v]=A,u[v]=S,k[v]=-$}});let d=r.slice(0);a.forEach(($,v)=>{d[$]=Math.ceil((u[$]-s[$])/n[$])});let h={dims:d,dataType:e[0].dataType},f=K("output",e[0].dataType,d.length),g=N("input",e[0].dataType,e[0].dims.length),y=R.size(d),_=[{name:"outputSize",type:"u32"},{name:"starts",type:"u32",length:s.length},{name:"signs",type:"i32",length:l.length},{name:"steps",type:"u32",length:n.length}],w=[{type:12,data:y},{type:12,data:s},{type:6,data:l},{type:12,data:n},...J(e[0].dims,d)],x=$=>`
      ${$.registerUniforms(_).declareVariables(g,f)}
        ${l1(g,f,r)}
        ${$.mainStart()}
          ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
          let output_indices = ${f.offsetToIndices("global_idx")};
          let input_indices = calculateInputIndices(output_indices);
          ${f.setByOffset("global_idx",g.getByIndices("input_indices"))}
      }`;return{name:"Slice",shaderCache:{hint:`${l.length}_${s.length}_${n.length}`,inputDependencies:["rank"]},getShaderSource:x,getRunData:()=>({outputs:[h],dispatchGroup:{x:Math.ceil(i/64)},programUniforms:w})}},Ry=(e,t)=>{o1(e.inputs,t);let r=u1(e.inputs,t);e.compute(d1(e.inputs,r),{inputs:[0]})},My=e=>{let t=e.starts,r=e.ends,i=e.axes;return xe({starts:t,ends:r,axes:i})}}),c1,h1,By,Ny,fv=U(()=>{le(),he(),je(),Jr(),fe(),c1=e=>{if(!e||e.length!==1)throw new Error("Softmax op requires 1 input.")},h1=(e,t)=>{let r=e.inputs[0],i=r.dims,a=R.size(i),n=i.length,s=R.normalizeAxis(t.axis,n),u=s<i.length-1,l,d=[];u?(d=Array.from({length:n},(I,z)=>z),d[s]=n-1,d[n-1]=s,l=e.compute(It(r,d),{inputs:[r],outputs:[-1]})[0]):l=r;let h=l.dims,f=h[n-1],g=a/f,y=Fe(f),_=f/y,w=64;g===1&&(w=256);let x=(I,z)=>z===4?`max(max(${I}.x, ${I}.y), max(${I}.z, ${I}.w))`:z===2?`max(${I}.x, ${I}.y)`:z===3?`max(max(${I}.x, ${I}.y), ${I}.z)`:I,$=N("x",l.dataType,l.dims,y),v=K("result",l.dataType,l.dims,y),k=$.type.value,E=it(l.dataType)==="f32"?`var threadMax = ${k}(-3.402823e+38f);`:`var threadMax = ${k}(-65504.0h);`,S=I=>`
      var<workgroup> rowMaxShared : ${k};
      var<workgroup> rowSumShared : ${k};
      var<workgroup> threadShared : array<${k}, ${w}>;

      fn getValue(row: i32, col: i32, row_stride: i32) -> ${k} {
        let index = row * row_stride + col;
        return x[index];
      }

      fn setValue(row: i32, col: i32, row_stride: i32, value: ${k}) {
        let index = row * row_stride + col;
        result[index] = value;
      }
      ${I.registerUniform("packedCols","i32").declareVariables($,v)}
      ${I.mainStart(w)}
        let gindex = i32(global_idx);
        let lindex = i32(local_idx);
        const wg = ${w};
        let row = gindex / wg;
        let cols = uniforms.packedCols;
        let row_stride : i32 = uniforms.packedCols;

        // find the rows max
        ${E}
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
          rowMaxShared = ${k}(${x("threadShared[0]",y)});
        }
        workgroupBarrier();

        // find the rows sum
        var threadSum = ${k}(0.0);
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
          rowSumShared = ${k}(${Xr("threadShared[0]",y)});
        }
        workgroupBarrier();

        // calculate final value for each element in the row
        for (var col = lindex; col < cols; col += wg) {
          var value = exp(getValue(row, col, row_stride) - rowMaxShared) / rowSumShared;
          // max operation protects against NaN since all values should be >=0
          value = max(value, ${k}(0.0));
          setValue(row, col, row_stride, value);
        }
      }`,A=e.compute({name:"Softmax",shaderCache:{hint:`${y};${w}`,inputDependencies:["type"]},getRunData:()=>({outputs:[{dims:h,dataType:l.dataType}],dispatchGroup:{x:g},programUniforms:[{type:6,data:_}]}),getShaderSource:S},{inputs:[l],outputs:[u?-1:0]})[0];u&&e.compute(It(A,d),{inputs:[A]})},By=(e,t)=>{c1(e.inputs),h1(e,t)},Ny=e=>xe({axis:e.axis})}),au,p1,f1,m1,Dy,mv=U(()=>{le(),he(),fe(),au=e=>Array.from(e.getBigInt64Array(),Number),p1=e=>{if(!e||e.length!==2)throw new Error("Tile requires 2 inputs.");if(e[0].dataType!==1&&e[0].dataType!==10&&e[0].dataType!==6&&e[0].dataType!==12)throw new Error("Tile only support float, float16, int32, and uint32 data types");if(e[1].dataType!==7)throw new Error("Tile `repeats` input should be of int64 data type");if(e[1].dims.length!==1)throw new Error("Tile `repeats` input should be 1-D");if(au(e[1]).length!==e[0].dims.length)throw new Error("Tile `repeats` input should have same number of elements as rank of input data tensor")},f1=(e,t)=>{let r=[];for(let i=0;i<e.length;++i)r.push(e[i]*t[i]);return r},m1=(e,t)=>{let r=e[0].dims,i=t??au(e[1]),a=f1(r,i),n=R.size(a),s=e[0].dataType,u=N("input",s,r.length),l=K("output",s,a.length),d=h=>`
      const inputShape = ${u.indices(...r)};
      ${h.registerUniform("output_size","u32").declareVariables(u,l)}
      ${h.mainStart()}
      ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let output_indices = ${l.offsetToIndices("global_idx")};
      var input_indices: ${u.type.indices};
      for (var i = 0; i < ${r.length}; i++) {
        let input_dim_i = ${u.indicesGet("uniforms.input_shape","i")};
        let input_dim_value = ${l.indicesGet("output_indices","i")}  % input_dim_i;

        ${u.indicesSet("input_indices","i","input_dim_value")}
      }
      ${l.setByOffset("global_idx",u.getByIndices("input_indices"))}
    }`;return{name:"Tile",shaderCache:{hint:`${i}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:a,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(n/64)},programUniforms:[{type:12,data:n},...J(e[0].dims,a)]}),getShaderSource:d}},Dy=e=>{p1(e.inputs),e.compute(m1(e.inputs),{inputs:[0]})}}),g1,y1,Py,gv=U(()=>{le(),he(),fe(),g1=(e,t,r,i,a)=>{let n=K("output_data",a,r.length,4),s=N("a_data",t[1].dataType,t[1].dims.length,4),u=N("b_data",t[2].dataType,t[2].dims.length,4),l=N("c_data",t[0].dataType,t[0].dims.length,4),d,h=(f,g,y)=>`select(${g}, ${f}, ${y})`;if(!i)d=n.setByOffset("global_idx",h(s.getByOffset("global_idx"),u.getByOffset("global_idx"),l.getByOffset("global_idx")));else{let f=(g,y,_="")=>{let w=`a_data[index_a${y}][component_a${y}]`,x=`b_data[index_b${y}][component_b${y}]`,$=`bool(c_data[index_c${y}] & (0xffu << (component_c${y} * 8)))`;return`
            let output_indices${y} = ${n.offsetToIndices(`global_idx * 4u + ${y}u`)};
            let offset_a${y} = ${s.broadcastedIndicesToOffset(`output_indices${y}`,n)};
            let offset_b${y} = ${u.broadcastedIndicesToOffset(`output_indices${y}`,n)};
            let offset_c${y} = ${l.broadcastedIndicesToOffset(`output_indices${y}`,n)};
            let index_a${y} = offset_a${y} / 4u;
            let index_b${y} = offset_b${y} / 4u;
            let index_c${y} = offset_c${y} / 4u;
            let component_a${y} = offset_a${y} % 4u;
            let component_b${y} = offset_b${y} % 4u;
            let component_c${y} = offset_c${y} % 4u;
            ${g}[${y}] = ${_}(${h(w,x,$)});
          `};a===9?d=`
            var data = vec4<u32>(0);
            ${f("data",0,"u32")}
            ${f("data",1,"u32")}
            ${f("data",2,"u32")}
            ${f("data",3,"u32")}
            output_data[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:d=`
            ${f("output_data[global_idx]",0)}
            ${f("output_data[global_idx]",1)}
            ${f("output_data[global_idx]",2)}
            ${f("output_data[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables(l,s,u,n)}
        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${d}
      }`},y1=e=>{let t=e[1].dims,r=e[2].dims,i=e[0].dims,a=e[1].dataType,n=!(R.areEqual(t,r)&&R.areEqual(r,i)),s=t,u=R.size(t);if(n){let d=Zi.calcShape(Zi.calcShape(t,r,!1),i,!1);if(!d)throw new Error("Can't perform where op on the given tensors");s=d,u=R.size(s)}let l=Math.ceil(u/4);return{name:"Where",shaderCache:{inputDependencies:["rank","rank","rank"]},getShaderSource:d=>g1(d,e,s,n,a),getRunData:()=>({outputs:[{dims:s,dataType:a}],dispatchGroup:{x:Math.ceil(u/64/4)},programUniforms:[{type:12,data:l},...J(i,t,r,s)]})}},Py=e=>{e.compute(y1(e.inputs))}}),Ly,yv=U(()=>{z4(),cd(),O4(),R4(),M4(),B4(),N4(),F4(),W4(),G4(),j4(),q4(),H4(),K4(),X4(),Y4(),Z4(),Q4(),J4(),ev(),tv(),rv(),iv(),nv(),av(),ny(),sv(),ov(),uv(),lv(),dv(),dd(),cv(),ly(),hv(),pv(),fv(),oy(),mv(),Jr(),hd(),gv(),Ly=new Map([["Abs",[O0]],["Acos",[R0]],["Acosh",[M0]],["Add",[f3]],["ArgMax",[C0,Mu]],["ArgMin",[S0,Mu]],["Asin",[B0]],["Asinh",[N0]],["Atan",[D0]],["Atanh",[P0]],["Attention",[A0]],["AveragePool",[_y,yy]],["BatchNormalization",[I0]],["BiasAdd",[z0]],["BiasSplitGelu",[p3]],["Cast",[U0,L0]],["Ceil",[V0]],["Clip",[F0]],["Concat",[T3,k3]],["Conv",[Uu,Lu]],["ConvTranspose",[B3,M3]],["Cos",[W0]],["Cosh",[G0]],["CumSum",[N3,D3]],["DepthToSpace",[P3,L3]],["DequantizeLinear",[ky,Ey]],["Div",[m3]],["Einsum",[U3,F3]],["Elu",[j0,zn]],["Equal",[g3]],["Erf",[q0]],["Exp",[H0]],["Expand",[V3]],["FastGelu",[W3]],["Floor",[K0]],["FusedConv",[Uu,Lu]],["Gather",[j3,G3]],["GatherElements",[Z3,Y3]],["GatherBlockQuantized",[K3,X3]],["GatherND",[q3,H3]],["Gelu",[X0]],["Gemm",[J3,Q3]],["GlobalAveragePool",[wy,by]],["GlobalMaxPool",[Ty,xy]],["Greater",[w3]],["GreaterOrEqual",[$3]],["GridSample",[ey,ty]],["GroupQueryAttention",[dy]],["HardSigmoid",[i3,r3]],["InstanceNormalization",[cy]],["LayerNormalization",[hy]],["LeakyRelu",[Y0,zn]],["Less",[v3]],["LessOrEqual",[x3]],["Log",[c3]],["MatMul",[py]],["MatMulNBits",[fy,my]],["MaxPool",[vy,$y]],["Mul",[y3]],["MultiHeadAttention",[iy,ry]],["Neg",[Q0]],["Not",[Z0]],["Pad",[gy]],["Pow",[_3]],["QuickGelu",[h3,zn]],["Range",[Sy]],["Reciprocal",[J0]],["ReduceMin",[$0]],["ReduceMean",[y0]],["ReduceMax",[v0]],["ReduceSum",[T0]],["ReduceProd",[x0]],["ReduceL1",[_0]],["ReduceL2",[b0]],["ReduceLogSum",[E0]],["ReduceLogSumExp",[w0]],["ReduceSumSquare",[k0]],["Relu",[e3]],["Resize",[Iy,zy]],["RotaryEmbedding",[uy]],["ScatterND",[Ay,Cy]],["Sigmoid",[t3]],["Sin",[n3]],["Sinh",[a3]],["Slice",[Ry,My]],["SkipLayerNormalization",[Oy]],["Split",[ay,sy]],["Sqrt",[s3]],["Softmax",[By,Ny]],["Sub",[b3]],["Tan",[o3]],["Tanh",[u3]],["ThresholdedRelu",[d3,zn]],["Tile",[Dy]],["Transpose",[a0,s0]],["Where",[Py]]])}),Uy,_v=U(()=>{qt(),Rr(),fe(),Uy=class{constructor(e){this.backend=e,this.repo=new Map,this.attributesBound=!1}getArtifact(e){return this.repo.get(e)}setArtifact(e,t){this.repo.set(e,t)}run(e,t,r,i,a){mr(e.programInfo.name);let n=this.backend.device,s=this.backend.getComputePassEncoder();this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2);let u=[];for(let d of t)u.push({binding:u.length,resource:{buffer:d.buffer}});for(let d of r)u.push({binding:u.length,resource:{buffer:d.buffer}});a&&u.push({binding:u.length,resource:a});let l=n.createBindGroup({layout:e.computePipeline.getBindGroupLayout(0),entries:u,label:e.programInfo.name});if(this.backend.sessionStatus==="capturing"){let d={kernelId:this.backend.currentKernelId,computePipeline:e.computePipeline,bindGroup:l,dispatchGroup:i};this.backend.capturedCommandList.get(this.backend.currentSessionId).push(d)}s.setPipeline(e.computePipeline),s.setBindGroup(0,l),s.dispatchWorkgroups(...i),this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2+1),this.backend.pendingDispatchNumber++,(this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber||this.backend.queryType==="at-passes")&&this.backend.endComputePass(),this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber&&this.backend.flush(),er(e.programInfo.name)}dispose(){}build(e,t){mr(e.name);let r=this.backend.device,i=[];[{feature:"shader-f16",extension:"f16"},{feature:"subgroups",extension:"subgroups"}].forEach(d=>{r.features.has(d.feature)&&i.push(`enable ${d.extension};`)});let a=n0(t,this.backend.device.limits),n=e.getShaderSource(a),s=`${i.join(`
`)}
${a.additionalImplementations}
${n}`,u=r.createShaderModule({code:s,label:e.name});ye("verbose",()=>`[WebGPU] ${e.name} shader code: ${s}`);let l=r.createComputePipeline({compute:{module:u,entryPoint:"main"},layout:"auto",label:e.name});return er(e.name),{programInfo:e,computePipeline:l,uniformVariablesInfo:a.variablesInfo}}normalizeDispatchGroupSize(e){let t=typeof e=="number"?e:e.x,r=typeof e=="number"?1:e.y||1,i=typeof e=="number"?1:e.z||1,a=this.backend.device.limits.maxComputeWorkgroupsPerDimension;if(t<=a&&r<=a&&i<=a)return[t,r,i];let n=t*r*i,s=Math.ceil(Math.sqrt(n));if(s>a){if(s=Math.ceil(Math.cbrt(n)),s>a)throw new Error("Total dispatch size exceeds WebGPU maximum.");return[s,s,s]}else return[s,s,1]}}}),Fy={};un(Fy,{WebGpuBackend:()=>Vy});var _1,b1,w1,Vy,bv=U(()=>{qt(),le(),Rr(),Jg(),A4(),yv(),_v(),_1=(e,t)=>{if(t.length!==e.length)throw new Error(`inputDependencies length ${t.length} is not equal to inputTensors length ${e.length}.`);let r=[];for(let i=0;i<e.length;++i){let a=e[i].dataType;switch(t[i]){case"none":{r.push("");break}case"type":{r.push(`${a}`);break}case"rank":{let n=e[i].dims.length;r.push(`${a};${n}`);break}case"dims":{let n=e[i].dims.join(",");r.push(`${a};${n}`);break}default:throw new Error(`unsupported input dependency: ${t[i]}`)}}return r.join("|")},b1=(e,t,r)=>{var a,n;let i=e.name;return(a=e.shaderCache)!=null&&a.hint&&(i+="["+e.shaderCache.hint+"]"),i+=":"+r+`:${_1(t,((n=e.shaderCache)==null?void 0:n.inputDependencies)??new Array(t.length).fill("dims"))}`,i},w1=class{constructor(e){e&&(this.architecture=e.architecture,this.vendor=e.vendor)}isArchitecture(e){return this.architecture===e}isVendor(e){return this.vendor===e}},Vy=class{constructor(){this.currentSessionId=null,this.currentKernelId=null,this.commandEncoder=null,this.computePassEncoder=null,this.maxDispatchNumber=16,this.pendingDispatchNumber=0,this.pendingKernels=[],this.pendingQueries=new Map,this.sessionStatus="default",this.capturedCommandList=new Map,this.capturedPendingKernels=new Map,this.sessionExternalDataMapping=new Map}get currentKernelCustomData(){if(this.currentKernelId===null)throw new Error("currentKernelCustomData(): currentKernelId is null. (should not happen)");let e=this.kernelCustomData.get(this.currentKernelId);return e||(e={},this.kernelCustomData.set(this.currentKernelId,e)),e}async initialize(e,t){this.env=e;let r=[],i={requiredLimits:{maxComputeWorkgroupStorageSize:t.limits.maxComputeWorkgroupStorageSize,maxComputeWorkgroupsPerDimension:t.limits.maxComputeWorkgroupsPerDimension,maxStorageBufferBindingSize:t.limits.maxStorageBufferBindingSize,maxBufferSize:t.limits.maxBufferSize,maxComputeInvocationsPerWorkgroup:t.limits.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupSizeX:t.limits.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.limits.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:t.limits.maxComputeWorkgroupSizeZ},requiredFeatures:r},a=n=>t.features.has(n)&&r.push(n)&&!0;a("chromium-experimental-timestamp-query-inside-passes")||a("timestamp-query"),a("shader-f16"),a("subgroups"),this.device=await t.requestDevice(i),this.adapterInfo=new w1(t.info||await t.requestAdapterInfo()),this.gpuDataManager=r0(this),this.programManager=new Uy(this),this.kernels=new Map,this.kernelPersistentData=new Map,this.kernelCustomData=new Map,sd(e.logLevel,!!e.debug),this.device.onuncapturederror=n=>{n.error instanceof GPUValidationError&&console.error(`An uncaught WebGPU validation error was raised: ${n.error.message}`)},Object.defineProperty(this.env.webgpu,"device",{value:this.device,writable:!1,enumerable:!0,configurable:!1}),Object.defineProperty(this.env.webgpu,"adapter",{value:t,writable:!1,enumerable:!0,configurable:!1}),this.setQueryType()}dispose(){typeof this.querySet<"u"&&this.querySet.destroy(),this.gpuDataManager.dispose()}getCommandEncoder(){return this.commandEncoder||(this.commandEncoder=this.device.createCommandEncoder()),this.commandEncoder}getComputePassEncoder(){if(!this.computePassEncoder){let e=this.getCommandEncoder(),t={};this.queryType==="at-passes"&&(t.timestampWrites={querySet:this.querySet,beginningOfPassWriteIndex:this.pendingDispatchNumber*2,endOfPassWriteIndex:this.pendingDispatchNumber*2+1}),this.computePassEncoder=e.beginComputePass(t)}return this.computePassEncoder}endComputePass(){this.computePassEncoder&&(this.computePassEncoder.end(),this.computePassEncoder=null)}flush(){if(!this.commandEncoder)return;mr(),this.endComputePass();let e;this.queryType!=="none"&&(this.commandEncoder.resolveQuerySet(this.querySet,0,this.pendingDispatchNumber*2,this.queryResolveBuffer,0),e=this.device.createBuffer({size:this.pendingDispatchNumber*2*8,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),this.pendingQueries.set(e,this.pendingKernels),this.pendingKernels=[],this.commandEncoder.copyBufferToBuffer(this.queryResolveBuffer,0,e,0,this.pendingDispatchNumber*2*8)),this.device.queue.submit([this.commandEncoder.finish()]),this.gpuDataManager.refreshPendingBuffers(),this.commandEncoder=null,this.pendingDispatchNumber=0,this.queryType!=="none"&&e.mapAsync(GPUMapMode.READ).then(()=>{var i;let t=new BigUint64Array(e.getMappedRange()),r=this.pendingQueries.get(e);for(let a=0;a<t.length/2;a++){let n=r[a],s=n.kernelId,u=this.kernels.get(s),l=u.kernelType,d=u.kernelName,h=n.programName,f=n.inputTensorViews,g=n.outputTensorViews,y=t[a*2],_=t[a*2+1];typeof this.queryTimeBase>"u"&&(this.queryTimeBase=y);let w=Number(y-this.queryTimeBase),x=Number(_-this.queryTimeBase);if(!Number.isSafeInteger(w)||!Number.isSafeInteger(x))throw new RangeError("incorrect timestamp range");if((i=this.env.webgpu.profiling)!=null&&i.ondata)this.env.webgpu.profiling.ondata({version:1,inputsMetadata:f.map($=>({dims:$.dims,dataType:kr($.dataType)})),outputsMetadata:g.map($=>({dims:$.dims,dataType:kr($.dataType)})),kernelId:s,kernelType:l,kernelName:d,programName:h,startTime:w,endTime:x});else{let $="";f.forEach((k,E)=>{$+=`input[${E}]: [${k.dims}] | ${kr(k.dataType)}, `});let v="";g.forEach((k,E)=>{v+=`output[${E}]: [${k.dims}] | ${kr(k.dataType)}, `}),console.log(`[profiling] kernel "${s}|${l}|${d}|${h}" ${$}${v}start time: ${w} ns, execution time: ${x-w} ns`)}Ga("GPU",`${h}::${y}::${_}`)}e.unmap(),this.pendingQueries.delete(e)}),er()}run(e,t,r,i,a,n){mr(e.name);let s=[];for(let v=0;v<t.length;++v){let k=t[v].data;if(k===0)continue;let E=this.gpuDataManager.get(k);if(!E)throw new Error(`no GPU data for input: ${k}`);s.push(E)}let{outputs:u,dispatchGroup:l,programUniforms:d}=e.getRunData(t),h=r.length===0?u.map((v,k)=>k):r;if(h.length!==u.length)throw new Error(`Output size ${h.length} must be equal to ${u.length}.`);let f=[],g=[];for(let v=0;v<u.length;++v){if(!Number.isInteger(h[v])||h[v]<-3||h[v]>=n)throw new Error(`Invalid output index: ${h[v]}`);if(h[v]===-3)continue;let k=h[v]===-1,E=h[v]===-2,S=k||E?a(u[v].dataType,u[v].dims):i(h[v],u[v].dataType,u[v].dims);if(f.push(S),S.data===0)continue;let A=this.gpuDataManager.get(S.data);if(!A)throw new Error(`no GPU data for output: ${S.data}`);if(k&&this.temporaryData.push(A),E){let I=this.kernelPersistentData.get(this.currentKernelId);I||(I=[],this.kernelPersistentData.set(this.currentKernelId,I)),I.push(A)}g.push(A)}if(s.length!==t.length||g.length!==f.length){if(g.length===0)return er(e.name),f;throw new Error(`Program ${e.name} has zero-sized tensor(s) in inputs or outputs. This is not supported now.`)}let y;if(d){let v=0,k=[];d.forEach(I=>{let z=typeof I.data=="number"?[I.data]:I.data;if(z.length===0)return;let M=I.type===10?2:4,V,ee;I.type===10?(ee=z.length>4?16:z.length>2?8:z.length*M,V=z.length>4?16:M*z.length):(ee=z.length<=2?z.length*M:16,V=16),v=Math.ceil(v/ee)*ee,k.push(v);let q=I.type===10?8:4;v+=z.length>4?Math.ceil(z.length/q)*V:z.length*M});let E=16;v=Math.ceil(v/E)*E;let S=new ArrayBuffer(v);d.forEach((I,z)=>{let M=k[z],V=typeof I.data=="number"?[I.data]:I.data;if(I.type===6)new Int32Array(S,M,V.length).set(V);else if(I.type===12)new Uint32Array(S,M,V.length).set(V);else if(I.type===10)new Uint16Array(S,M,V.length).set(V);else if(I.type===1)new Float32Array(S,M,V.length).set(V);else throw new Error(`Unsupported uniform type: ${kr(I.type)}`)});let A=this.gpuDataManager.create(v,GPUBufferUsage.COPY_DST|GPUBufferUsage.UNIFORM);this.device.queue.writeBuffer(A.buffer,0,S,0,v),this.gpuDataManager.release(A.id),y={offset:0,size:v,buffer:A.buffer}}let _=this.programManager.normalizeDispatchGroupSize(l),w=_[1]===1&&_[2]===1,x=b1(e,t,w),$=this.programManager.getArtifact(x);if($||($=this.programManager.build(e,_),this.programManager.setArtifact(x,$),ye("info",()=>`[artifact] key: ${x}, programName: ${e.name}`)),d&&$.uniformVariablesInfo){if(d.length!==$.uniformVariablesInfo.length)throw new Error(`Uniform variables count mismatch: expect ${$.uniformVariablesInfo.length}, got ${d.length} in program "${$.programInfo.name}".`);for(let v=0;v<d.length;v++){let k=d[v],E=k.type,S=typeof k.data=="number"?1:k.data.length,[A,I]=$.uniformVariablesInfo[v];if(E!==A||S!==I)throw new Error(`Uniform variable ${v} mismatch: expect type ${A} with size ${I}, got type ${E} with size ${S} in program "${$.programInfo.name}".`)}}if(ye("info",()=>`[ProgramManager] run "${e.name}" (key=${x}) with ${_[0]}x${_[1]}x${_[2]}`),this.queryType!=="none"||this.sessionStatus==="capturing"){let v={kernelId:this.currentKernelId,programName:$.programInfo.name,inputTensorViews:t,outputTensorViews:f};this.pendingKernels.push(v),this.sessionStatus==="capturing"&&this.capturedPendingKernels.get(this.currentSessionId).push(v)}return this.programManager.run($,s,g,_,y),er(e.name),f}upload(e,t){this.gpuDataManager.upload(e,t)}memcpy(e,t){this.gpuDataManager.memcpy(e,t)}async download(e,t){await this.gpuDataManager.download(e,t)}alloc(e){return this.gpuDataManager.create(e).id}free(e){return this.gpuDataManager.release(e)}createKernel(e,t,r,i){let a=Ly.get(e);if(!a)throw new Error(`kernel not implemented: ${e}`);let n={kernelType:e,kernelName:i,kernelEntry:a[0],attributes:[a[1],r]};this.kernels.set(t,n)}releaseKernel(e){let t=this.kernelPersistentData.get(e);if(t){for(let r of t)this.gpuDataManager.release(r.id);this.kernelPersistentData.delete(e)}this.kernelCustomData.delete(e),this.kernels.delete(e)}computeKernel(e,t,r){let i=this.kernels.get(e);if(!i)throw new Error(`kernel not created: ${e}`);let a=i.kernelType,n=i.kernelName,s=i.kernelEntry,u=i.attributes;if(this.currentKernelId!==null)throw new Error(`kernel "[${a}] ${n}" is not allowed to be called recursively`);this.currentKernelId=e,u[0]&&(u[1]=u[0](u[1]),u[0]=void 0),ye("info",()=>`[WebGPU] Start to run kernel "[${a}] ${n}"...`);let l=this.env.debug;this.temporaryData=[];try{return l&&this.device.pushErrorScope("validation"),s(t,u[1]),0}catch(d){return r.push(Promise.resolve(`[WebGPU] Kernel "[${a}] ${n}" failed. ${d}`)),1}finally{l&&r.push(this.device.popErrorScope().then(d=>d?`GPU validation error for kernel "[${a}] ${n}": ${d.message}`:null));for(let d of this.temporaryData)this.gpuDataManager.release(d.id);this.temporaryData=[],this.currentKernelId=null}}registerBuffer(e,t,r,i){let a=this.sessionExternalDataMapping.get(e);a||(a=new Map,this.sessionExternalDataMapping.set(e,a));let n=a.get(t),s=this.gpuDataManager.registerExternalBuffer(r,i,n);return a.set(t,[s,r]),s}unregisterBuffers(e){let t=this.sessionExternalDataMapping.get(e);t&&(t.forEach(r=>this.gpuDataManager.unregisterExternalBuffer(r[0])),this.sessionExternalDataMapping.delete(e))}getBuffer(e){let t=this.gpuDataManager.get(e);if(!t)throw new Error(`no GPU data for buffer: ${e}`);return t.buffer}createDownloader(e,t,r){return async()=>{let i=await zu(this,e,t);return od(i.buffer,r)}}writeTimestamp(e){this.queryType==="inside-passes"&&this.computePassEncoder.writeTimestamp(this.querySet,e)}setQueryType(){var e;this.queryType="none",(((e=this.env.webgpu.profiling)==null?void 0:e.mode)==="default"||(typeof this.env.trace>"u"?this.env.wasm.trace:this.env.trace))&&(this.device.features.has("chromium-experimental-timestamp-query-inside-passes")?this.queryType="inside-passes":this.device.features.has("timestamp-query")&&(this.queryType="at-passes"),this.queryType!=="none"&&typeof this.querySet>"u"&&(this.querySet=this.device.createQuerySet({type:"timestamp",count:this.maxDispatchNumber*2}),this.queryResolveBuffer=this.device.createBuffer({size:this.maxDispatchNumber*2*8,usage:GPUBufferUsage.COPY_SRC|GPUBufferUsage.QUERY_RESOLVE})))}captureBegin(){ye("info","captureBegin"),this.capturedCommandList.get(this.currentSessionId)||this.capturedCommandList.set(this.currentSessionId,[]),this.capturedPendingKernels.get(this.currentSessionId)||this.capturedPendingKernels.set(this.currentSessionId,[]),this.flush(),this.sessionStatus="capturing"}captureEnd(){ye("info","captureEnd"),this.flush(),this.sessionStatus="default"}replay(){ye("info","replay"),this.sessionStatus="replaying";let e=this.capturedCommandList.get(this.currentSessionId),t=this.capturedPendingKernels.get(this.currentSessionId),r=e.length;this.pendingKernels=[];for(let i=0;i<r;i++){let a=this.getComputePassEncoder(),n=e[i];this.writeTimestamp(this.pendingDispatchNumber*2),a.setPipeline(n.computePipeline),a.setBindGroup(0,n.bindGroup),a.dispatchWorkgroups(...n.dispatchGroup),this.writeTimestamp(this.pendingDispatchNumber*2+1),this.pendingDispatchNumber++,this.queryType!=="none"&&this.pendingKernels.push(t[i]),(this.pendingDispatchNumber>=this.maxDispatchNumber||this.queryType==="at-passes")&&this.endComputePass(),this.pendingDispatchNumber>=this.maxDispatchNumber&&this.flush()}this.flush(),this.sessionStatus="default"}onCreateSession(){this.gpuDataManager.onCreateSession()}onReleaseSession(e){this.unregisterBuffers(e),this.capturedCommandList.has(e)&&this.capturedCommandList.delete(e),this.capturedPendingKernels.has(e)&&this.capturedPendingKernels.delete(e),this.gpuDataManager.onReleaseSession(e)}onRunStart(e){this.currentSessionId=e,this.setQueryType()}}}),Wy={};un(Wy,{init:()=>Gy});var ba,v1,Gy,wv=U(()=>{le(),Rr(),he(),C4(),ba=class jy{constructor(t,r,i,a){this.module=t,this.dataType=r,this.data=i,this.dims=a}getFloat32Array(){if(this.dataType!==1)throw new Error("Invalid data type");let t=R.size(this.dims);return t===0?new Float32Array:new Float32Array(this.module.HEAP8.buffer,this.data,t)}getBigInt64Array(){if(this.dataType!==7)throw new Error("Invalid data type");let t=R.size(this.dims);return t===0?new BigInt64Array:new BigInt64Array(this.module.HEAP8.buffer,this.data,t)}getInt32Array(){if(this.dataType!==6)throw new Error("Invalid data type");let t=R.size(this.dims);return t===0?new Int32Array:new Int32Array(this.module.HEAP8.buffer,this.data,t)}getUint16Array(){if(this.dataType!==10&&this.dataType!==4)throw new Error("Invalid data type");let t=R.size(this.dims);return t===0?new Uint16Array:new Uint16Array(this.module.HEAP8.buffer,this.data,t)}reshape(t){if(R.size(t)!==R.size(this.dims))throw new Error("Invalid new shape");return new jy(this.module,this.dataType,this.data,t)}},v1=class{constructor(e,t,r){this.module=e,this.backend=t,this.customDataOffset=0,this.customDataSize=0,this.adapterInfo=t.adapterInfo;let i=e.PTR_SIZE,a=r/e.PTR_SIZE,n=i===4?"i32":"i64";this.opKernelContext=Number(e.getValue(i*a++,n));let s=Number(e.getValue(i*a++,n));this.outputCount=Number(e.getValue(i*a++,n)),this.customDataOffset=Number(e.getValue(i*a++,"*")),this.customDataSize=Number(e.getValue(i*a++,n));let u=[];for(let l=0;l<s;l++){let d=Number(e.getValue(i*a++,n)),h=Number(e.getValue(i*a++,"*")),f=Number(e.getValue(i*a++,n)),g=[];for(let y=0;y<f;y++)g.push(Number(e.getValue(i*a++,n)));u.push(new ba(e,d,h,g))}this.inputs=u}get kernelCustomData(){return this.backend.currentKernelCustomData}get customDataBuffer(){return this.module.HEAPU8.subarray(this.customDataOffset,this.customDataOffset+this.customDataSize)}compute(e,t){var s;let r=((s=t==null?void 0:t.inputs)==null?void 0:s.map(u=>typeof u=="number"?this.inputs[u]:u))??this.inputs,i=(t==null?void 0:t.outputs)??[],a=(u,l,d)=>new ba(this.module,l,this.output(u,d),d),n=(u,l)=>{let d=fi(u,l);if(!d)throw new Error(`Unsupported data type: ${u}`);let h=d>0?this.backend.gpuDataManager.create(d).id:0;return new ba(this.module,u,h,l)};return this.backend.run(e,r,i,a,n,this.outputCount)}output(e,t){let r=this.module.stackSave();try{let i=this.module.PTR_SIZE,a=i===4?"i32":"i64",n=this.module.stackAlloc((1+t.length)*i);this.module.setValue(n,t.length,a);for(let s=0;s<t.length;s++)this.module.setValue(n+i*(s+1),t[s],a);return this.module._JsepOutput(this.opKernelContext,e,n)}catch(i){throw new Error(`Failed to generate kernel's output[${e}] with dims [${t}]. If you are running with pre-allocated output, please make sure the output type/dims are correct. Error: ${i}`)}finally{this.module.stackRestore(r)}}},Gy=async(e,t,r,i)=>{let a=t.jsepInit;if(!a)throw new Error("Failed to initialize JSEP. The WebAssembly module is not built with JSEP support.");if(e==="webgpu"){let n=(bv(),Fn(Fy)).WebGpuBackend,s=new n;await s.initialize(r,i),a("webgpu",[s,u=>s.alloc(Number(u)),u=>s.free(u),(u,l,d,h=!1)=>{if(h)ye("verbose",()=>`[WebGPU] jsepCopyGpuToGpu: src=${Number(u)}, dst=${Number(l)}, size=${Number(d)}`),s.memcpy(Number(u),Number(l));else{ye("verbose",()=>`[WebGPU] jsepCopyCpuToGpu: dataOffset=${Number(u)}, gpuDataId=${Number(l)}, size=${Number(d)}`);let f=t.HEAPU8.subarray(Number(u>>>0),Number(u>>>0)+Number(d));s.upload(Number(l),f)}},async(u,l,d)=>{ye("verbose",()=>`[WebGPU] jsepCopyGpuToCpu: gpuDataId=${u}, dataOffset=${l}, size=${d}`),await s.download(Number(u),()=>t.HEAPU8.subarray(Number(l)>>>0,Number(l+d)>>>0))},(u,l,d)=>s.createKernel(u,Number(l),d,t.UTF8ToString(t._JsepGetNodeName(Number(l)))),u=>s.releaseKernel(u),(u,l,d,h)=>{ye("verbose",()=>`[WebGPU] jsepRun: sessionHandle=${d}, kernel=${u}, contextDataOffset=${l}`);let f=new v1(t,s,Number(l));return s.computeKernel(Number(u),f,h)},()=>s.captureBegin(),()=>s.captureEnd(),()=>s.replay()])}else{let n=new t0(r);a("webnn",[n,()=>n.reserveTensorId(),s=>n.releaseTensorId(s),async(s,u,l,d,h)=>n.ensureTensor(s,u,l,d,h),(s,u)=>{n.uploadTensor(s,u)},async(s,u)=>n.downloadTensor(s,u),(s,u)=>n.registerMLContext(s,u),!!r.trace])}}}),$1,_d,bd,Fr,x1,su,Za,wd,vd,ou,$d,xd,Td,qy=U(()=>{qt(),k4(),E4(),le(),Ei(),rd(),Xg(),$1=(e,t)=>{Oe()._OrtInit(e,t)!==0&&Ee("Can't initialize onnxruntime.")},_d=async e=>{$1(e.wasm.numThreads,qa(e.logLevel))},bd=async(e,t)=>{var i,a;(a=(i=Oe()).asyncInit)==null||a.call(i);let r=e.webgpu.adapter;if(t==="webgpu"){if(typeof navigator>"u"||!navigator.gpu)throw new Error("WebGPU is not supported in current environment");if(r){if(typeof r.limits!="object"||typeof r.features!="object"||typeof r.requestDevice!="function")throw new Error("Invalid GPU adapter set in `env.webgpu.adapter`. It must be a GPUAdapter object.")}else{let n=e.webgpu.powerPreference;if(n!==void 0&&n!=="low-power"&&n!=="high-performance")throw new Error(`Invalid powerPreference setting: "${n}"`);let s=e.webgpu.forceFallbackAdapter;if(s!==void 0&&typeof s!="boolean")throw new Error(`Invalid forceFallbackAdapter setting: "${s}"`);if(r=await navigator.gpu.requestAdapter({powerPreference:n,forceFallbackAdapter:s}),!r)throw new Error('Failed to get GPU adapter. You may need to enable flag "--enable-unsafe-webgpu" if you are using Chrome.')}}if(t==="webnn"&&(typeof navigator>"u"||!navigator.ml))throw new Error("WebNN is not supported in current environment");{let n=(wv(),Fn(Wy)).init;t==="webgpu"&&await n("webgpu",Oe(),e,r),t==="webnn"&&await n("webnn",Oe(),e)}},Fr=new Map,x1=e=>{let t=Oe(),r=t.stackSave();try{let i=t.PTR_SIZE,a=t.stackAlloc(2*i);t._OrtGetInputOutputCount(e,a,a+i)!==0&&Ee("Can't get session input/output count.");let n=i===4?"i32":"i64";return[Number(t.getValue(a,n)),Number(t.getValue(a+i,n))]}finally{t.stackRestore(r)}},su=(e,t)=>{let r=Oe(),i=r.stackSave(),a=0;try{let n=r.PTR_SIZE,s=r.stackAlloc(2*n);r._OrtGetInputOutputMetadata(e,t,s,s+n)!==0&&Ee("Can't get session input/output metadata.");let u=Number(r.getValue(s,"*"));a=Number(r.getValue(s+n,"*"));let l=r.HEAP32[a/4];if(l===0)return[u,0];let d=r.HEAPU32[a/4+1],h=[];for(let f=0;f<d;f++){let g=Number(r.getValue(a+8+f*n,"*"));h.push(g!==0?r.UTF8ToString(g):Number(r.getValue(a+8+(f+d)*n,"*")))}return[u,l,h]}finally{r.stackRestore(i),a!==0&&r._OrtFree(a)}},Za=e=>{let t=Oe(),r=t._malloc(e.byteLength);if(r===0)throw new Error(`Can't create a session. failed to allocate a buffer of size ${e.byteLength}.`);return t.HEAPU8.set(e,r),[r,e.byteLength]},wd=async(e,t)=>{var f,g,y,_;let r,i,a=Oe();Array.isArray(e)?[r,i]=e:e.buffer===a.HEAPU8.buffer?[r,i]=[e.byteOffset,e.byteLength]:[r,i]=Za(e);let n=0,s=0,u=0,l=[],d=[],h=[];try{if([s,l]=await Kg(t),(t==null?void 0:t.externalData)&&a.mountExternalData){let z=[];for(let M of t.externalData){let V=typeof M=="string"?M:M.path;z.push(ad(typeof M=="string"?M:M.data).then(ee=>{a.mountExternalData(V,ee)}))}await Promise.all(z)}for(let z of(t==null?void 0:t.executionProviders)??[])if((typeof z=="string"?z:z.name)==="webnn"){if(a.shouldTransferToMLTensor=!1,typeof z!="string"){let M=z,V=M==null?void 0:M.context,ee=M==null?void 0:M.gpuDevice,q=M==null?void 0:M.deviceType,G=M==null?void 0:M.powerPreference;V?a.currentContext=V:ee?a.currentContext=await a.webnnCreateMLContext(ee):a.currentContext=await a.webnnCreateMLContext({deviceType:q,powerPreference:G})}else a.currentContext=await a.webnnCreateMLContext();break}n=await a._OrtCreateSession(r,i,s),(f=a.webgpuOnCreateSession)==null||f.call(a,n),n===0&&Ee("Can't create a session."),(g=a.jsepOnCreateSession)==null||g.call(a),a.currentContext&&(a.webnnRegisterMLContext(n,a.currentContext),a.currentContext=void 0,a.shouldTransferToMLTensor=!0);let[w,x]=x1(n),$=!!(t!=null&&t.enableGraphCapture),v=[],k=[],E=[],S=[],A=[];for(let z=0;z<w;z++){let[M,V,ee]=su(n,z);M===0&&Ee("Can't get an input name."),d.push(M);let q=a.UTF8ToString(M);v.push(q),E.push(V===0?{name:q,isTensor:!1}:{name:q,isTensor:!0,type:kr(V),shape:ee})}for(let z=0;z<x;z++){let[M,V,ee]=su(n,z+w);M===0&&Ee("Can't get an output name."),h.push(M);let q=a.UTF8ToString(M);k.push(q),S.push(V===0?{name:q,isTensor:!1}:{name:q,isTensor:!0,type:kr(V),shape:ee});{if($&&(t==null?void 0:t.preferredOutputLocation)===void 0){A.push("gpu-buffer");continue}let G=typeof(t==null?void 0:t.preferredOutputLocation)=="string"?t.preferredOutputLocation:((y=t==null?void 0:t.preferredOutputLocation)==null?void 0:y[q])??"cpu",ge=a.webnnIsGraphOutput;if(G==="cpu"&&ge&&ge(n,q)){A.push("ml-tensor-cpu-output");continue}if(G!=="cpu"&&G!=="cpu-pinned"&&G!=="gpu-buffer"&&G!=="ml-tensor")throw new Error(`Not supported preferred output location: ${G}.`);if($&&G!=="gpu-buffer")throw new Error(`Not supported preferred output location: ${G}. Only 'gpu-buffer' location is supported when enableGraphCapture is true.`);A.push(G)}}let I=null;return A.some(z=>z==="gpu-buffer"||z==="ml-tensor"||z==="ml-tensor-cpu-output")&&(u=a._OrtCreateBinding(n),u===0&&Ee("Can't create IO binding."),I={handle:u,outputPreferredLocations:A,outputPreferredLocationsEncoded:A.map(z=>z==="ml-tensor-cpu-output"?"ml-tensor":z).map(z=>Au(z))}),Fr.set(n,[n,d,h,I,$,!1]),[n,v,k,E,S]}catch(w){throw d.forEach(x=>a._OrtFree(x)),h.forEach(x=>a._OrtFree(x)),u!==0&&a._OrtReleaseBinding(u)!==0&&Ee("Can't release IO binding."),n!==0&&a._OrtReleaseSession(n)!==0&&Ee("Can't release session."),w}finally{a._free(r),s!==0&&a._OrtReleaseSessionOptions(s)!==0&&Ee("Can't release session options."),l.forEach(w=>a._free(w)),(_=a.unmountExternalData)==null||_.call(a)}},vd=e=>{var l,d,h;let t=Oe(),r=Fr.get(e);if(!r)throw new Error(`cannot release session. invalid session id: ${e}`);let[i,a,n,s,u]=r;s&&(u&&t._OrtClearBoundOutputs(s.handle)!==0&&Ee("Can't clear bound outputs."),t._OrtReleaseBinding(s.handle)!==0&&Ee("Can't release IO binding.")),(l=t.jsepOnReleaseSession)==null||l.call(t,e),(d=t.webnnOnReleaseSession)==null||d.call(t,e),(h=t.webgpuOnReleaseSession)==null||h.call(t,e),a.forEach(f=>t._OrtFree(f)),n.forEach(f=>t._OrtFree(f)),t._OrtReleaseSession(i)!==0&&Ee("Can't release session."),Fr.delete(e)},ou=async(e,t,r,i,a,n,s=!1)=>{if(!e){t.push(0);return}let u=Oe(),l=u.PTR_SIZE,d=e[0],h=e[1],f=e[3],g=f,y,_;if(d==="string"&&(f==="gpu-buffer"||f==="ml-tensor"))throw new Error("String tensor is not supported on GPU.");if(s&&f!=="gpu-buffer")throw new Error(`External buffer must be provided for input/output index ${n} when enableGraphCapture is true.`);if(f==="gpu-buffer"){let $=e[2].gpuBuffer;_=fi(pi(d),h);{let v=u.jsepRegisterBuffer;if(!v)throw new Error('Tensor location "gpu-buffer" is not supported without using WebGPU.');y=v(i,n,$,_)}}else if(f==="ml-tensor"){let $=e[2].mlTensor;_=fi(pi(d),h);let v=u.webnnRegisterMLTensor;if(!v)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');y=v(i,$,pi(d),h)}else{let $=e[2];if(Array.isArray($)){_=l*$.length,y=u._malloc(_),r.push(y);for(let v=0;v<$.length;v++){if(typeof $[v]!="string")throw new TypeError(`tensor data at index ${v} is not a string`);u.setValue(y+v*l,Qt($[v],r),"*")}}else{let v=u.webnnIsGraphInput,k=u.webnnIsGraphOutput;if(d!=="string"&&v&&k){let E=u.UTF8ToString(a);if(v(i,E)||k(i,E)){let S=pi(d);_=fi(S,h),g="ml-tensor";let A=u.webnnCreateTemporaryTensor,I=u.webnnUploadTensor;if(!A||!I)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');let z=await A(i,S,h);I(z,new Uint8Array($.buffer,$.byteOffset,$.byteLength)),y=z}else _=$.byteLength,y=u._malloc(_),r.push(y),u.HEAPU8.set(new Uint8Array($.buffer,$.byteOffset,_),y)}else _=$.byteLength,y=u._malloc(_),r.push(y),u.HEAPU8.set(new Uint8Array($.buffer,$.byteOffset,_),y)}}let w=u.stackSave(),x=u.stackAlloc(4*h.length);try{h.forEach((v,k)=>u.setValue(x+k*l,v,l===4?"i32":"i64"));let $=u._OrtCreateTensor(pi(d),y,_,x,h.length,Au(g));$===0&&Ee(`Can't create tensor for input/output. session=${i}, index=${n}.`),t.push($)}finally{u.stackRestore(w)}},$d=async(e,t,r,i,a,n)=>{var ee,q,G,ge;let s=Oe(),u=s.PTR_SIZE,l=Fr.get(e);if(!l)throw new Error(`cannot run inference. invalid session id: ${e}`);let d=l[0],h=l[1],f=l[2],g=l[3],y=l[4],_=l[5],w=t.length,x=i.length,$=0,v=[],k=[],E=[],S=[],A=s.stackSave(),I=s.stackAlloc(w*u),z=s.stackAlloc(w*u),M=s.stackAlloc(x*u),V=s.stackAlloc(x*u);try{[$,v]=Hg(n),_i("wasm prepareInputOutputTensor");for(let Z=0;Z<w;Z++)await ou(r[Z],k,S,e,h[t[Z]],t[Z],y);for(let Z=0;Z<x;Z++)await ou(a[Z],E,S,e,f[i[Z]],w+i[Z],y);bi("wasm prepareInputOutputTensor");for(let Z=0;Z<w;Z++)s.setValue(I+Z*u,k[Z],"*"),s.setValue(z+Z*u,h[t[Z]],"*");for(let Z=0;Z<x;Z++)s.setValue(M+Z*u,E[Z],"*"),s.setValue(V+Z*u,f[i[Z]],"*");if(g&&!_){let{handle:Z,outputPreferredLocations:se,outputPreferredLocationsEncoded:Se}=g;if(h.length!==w)throw new Error(`input count from feeds (${w}) is expected to be always equal to model's input count (${h.length}).`);_i("wasm bindInputsOutputs");for(let D=0;D<w;D++){let W=t[D];await s._OrtBindInput(Z,h[W],k[D])!==0&&Ee(`Can't bind input[${D}] for session=${e}.`)}for(let D=0;D<x;D++){let W=i[D];(ee=a[D])!=null&&ee[3]?s._OrtBindOutput(Z,f[W],E[D],0)!==0&&Ee(`Can't bind pre-allocated output[${D}] for session=${e}.`):s._OrtBindOutput(Z,f[W],0,Se[W])!==0&&Ee(`Can't bind output[${D}] to ${se[D]} for session=${e}.`)}bi("wasm bindInputsOutputs"),Fr.set(e,[d,h,f,g,y,!0])}(q=s.jsepOnRunStart)==null||q.call(s,d),(G=s.webnnOnRunStart)==null||G.call(s,d);let ce;g?ce=await s._OrtRunWithBinding(d,g.handle,x,M,$):ce=await s._OrtRun(d,z,I,w,V,x,M,$),ce!==0&&Ee("failed to call OrtRun().");let Y=[],pe=[];_i("wasm ProcessOutputTensor");for(let Z=0;Z<x;Z++){let se=Number(s.getValue(M+Z*u,"*"));if(se===E[Z]){Y.push(a[Z]);continue}let Se=s.stackSave(),D=s.stackAlloc(4*u),W=!1,j,ie=0;try{s._OrtGetTensorData(se,D,D+u,D+2*u,D+3*u)!==0&&Ee(`Can't access output tensor data on index ${Z}.`);let Ze=u===4?"i32":"i64",ar=Number(s.getValue(D,Ze));ie=s.getValue(D+u,"*");let L=s.getValue(D+u*2,"*"),Ce=Number(s.getValue(D+u*3,Ze)),vt=[];for(let ke=0;ke<Ce;ke++)vt.push(Number(s.getValue(L+ke*u,Ze)));s._OrtFree(L)!==0&&Ee("Can't free memory for tensor dims.");let dt=vt.reduce((ke,Pe)=>ke*Pe,1);j=kr(ar);let yr=g==null?void 0:g.outputPreferredLocations[i[Z]];if(j==="string"){if(yr==="gpu-buffer"||yr==="ml-tensor")throw new Error("String tensor is not supported on GPU.");let ke=[];for(let Pe=0;Pe<dt;Pe++){let $t=s.getValue(ie+Pe*u,"*"),ei=s.getValue(ie+(Pe+1)*u,"*"),ti=Pe===dt-1?void 0:ei-$t;ke.push(s.UTF8ToString($t,ti))}Y.push([j,vt,ke,"cpu"])}else if(yr==="gpu-buffer"&&dt>0){let ke=s.jsepGetBuffer;if(!ke)throw new Error('preferredLocation "gpu-buffer" is not supported without using WebGPU.');let Pe=ke(ie),$t=fi(ar,dt);if($t===void 0||!id(j))throw new Error(`Unsupported data type: ${j}`);W=!0,Y.push([j,vt,{gpuBuffer:Pe,download:s.jsepCreateDownloader(Pe,$t,j),dispose:()=>{s._OrtReleaseTensor(se)!==0&&Ee("Can't release tensor.")}},"gpu-buffer"])}else if(yr==="ml-tensor"&&dt>0){let ke=s.webnnEnsureTensor,Pe=s.webnnIsGraphInputOutputTypeSupported;if(!ke||!Pe)throw new Error('preferredLocation "ml-tensor" is not supported without using WebNN.');if(fi(ar,dt)===void 0||!nd(j))throw new Error(`Unsupported data type: ${j}`);if(!Pe(e,j,!1))throw new Error(`preferredLocation "ml-tensor" for ${j} output is not supported by current WebNN Context.`);let $t=await ke(e,ie,ar,vt,!1);W=!0,Y.push([j,vt,{mlTensor:$t,download:s.webnnCreateMLTensorDownloader(ie,j),dispose:()=>{s.webnnReleaseTensorId(ie),s._OrtReleaseTensor(se)}},"ml-tensor"])}else if(yr==="ml-tensor-cpu-output"&&dt>0){let ke=s.webnnCreateMLTensorDownloader(ie,j)(),Pe=Y.length;W=!0,pe.push((async()=>{let $t=[Pe,await ke];return s.webnnReleaseTensorId(ie),s._OrtReleaseTensor(se),$t})()),Y.push([j,vt,[],"cpu"])}else{let ke=Es(j),Pe=new ke(dt);new Uint8Array(Pe.buffer,Pe.byteOffset,Pe.byteLength).set(s.HEAPU8.subarray(ie,ie+Pe.byteLength)),Y.push([j,vt,Pe,"cpu"])}}finally{s.stackRestore(Se),j==="string"&&ie&&s._free(ie),W||s._OrtReleaseTensor(se)}}g&&!y&&(s._OrtClearBoundOutputs(g.handle)!==0&&Ee("Can't clear bound outputs."),Fr.set(e,[d,h,f,g,y,!1]));for(let[Z,se]of await Promise.all(pe))Y[Z][2]=se;return bi("wasm ProcessOutputTensor"),Y}finally{(ge=s.webnnOnRunEnd)==null||ge.call(s,d),s.stackRestore(A),k.forEach(ce=>s._OrtReleaseTensor(ce)),E.forEach(ce=>s._OrtReleaseTensor(ce)),S.forEach(ce=>s._free(ce)),$!==0&&s._OrtReleaseRunOptions($),v.forEach(ce=>s._free(ce))}},xd=e=>{let t=Oe(),r=Fr.get(e);if(!r)throw new Error("invalid session id");let i=r[0],a=t._OrtEndProfiling(i);a===0&&Ee("Can't get an profile file name."),t._OrtFree(a)},Td=e=>{let t=[];for(let r of e){let i=r[2];!Array.isArray(i)&&"buffer"in i&&t.push(i.buffer)}return t}}),Vr,yt,zi,Tn,kn,wa,uu,va,li,di,T1,Hy,Ky,Xy,Yy,Zy,Qy,Jy,e_=U(()=>{qt(),qy(),Ei(),ed(),Vr=()=>!!Ae.wasm.proxy&&typeof document<"u",zi=!1,Tn=!1,kn=!1,va=new Map,li=(e,t)=>{let r=va.get(e);r?r.push(t):va.set(e,[t])},di=()=>{if(zi||!Tn||kn||!yt)throw new Error("worker not ready")},T1=e=>{switch(e.data.type){case"init-wasm":zi=!1,e.data.err?(kn=!0,uu[1](e.data.err)):(Tn=!0,uu[0]()),wa&&(URL.revokeObjectURL(wa),wa=void 0);break;case"init-ep":case"copy-from":case"create":case"release":case"run":case"end-profiling":{let t=va.get(e.data.type);e.data.err?t.shift()[1](e.data.err):t.shift()[0](e.data.out);break}}},Hy=async()=>{if(!Tn){if(zi)throw new Error("multiple calls to 'initWasm()' detected.");if(kn)throw new Error("previous call to 'initWasm()' failed.");if(zi=!0,Vr())return new Promise((e,t)=>{yt==null||yt.terminate(),jg().then(([r,i])=>{try{yt=i,yt.onerror=n=>t(n),yt.onmessage=T1,uu=[e,t];let a={type:"init-wasm",in:Ae};!a.in.wasm.wasmPaths&&(r||Cu)&&(a.in.wasm.wasmPaths={wasm:new URL("/dev-sandbox/games/emotion/assets/ort-wasm-simd-threaded.jsep-CLmJQkb_.wasm",import.meta.url).href}),yt.postMessage(a),wa=r}catch(a){t(a)}},t)});try{await td(Ae.wasm),await _d(Ae),Tn=!0}catch(e){throw kn=!0,e}finally{zi=!1}}},Ky=async e=>{if(Vr())return di(),new Promise((t,r)=>{li("init-ep",[t,r]);let i={type:"init-ep",in:{epName:e,env:Ae}};yt.postMessage(i)});await bd(Ae,e)},Xy=async e=>Vr()?(di(),new Promise((t,r)=>{li("copy-from",[t,r]);let i={type:"copy-from",in:{buffer:e}};yt.postMessage(i,[e.buffer])})):Za(e),Yy=async(e,t)=>{if(Vr()){if(t!=null&&t.preferredOutputLocation)throw new Error('session option "preferredOutputLocation" is not supported for proxy.');return di(),new Promise((r,i)=>{li("create",[r,i]);let a={type:"create",in:{model:e,options:{...t}}},n=[];e instanceof Uint8Array&&n.push(e.buffer),yt.postMessage(a,n)})}else return wd(e,t)},Zy=async e=>{if(Vr())return di(),new Promise((t,r)=>{li("release",[t,r]);let i={type:"release",in:e};yt.postMessage(i)});vd(e)},Qy=async(e,t,r,i,a,n)=>{if(Vr()){if(r.some(s=>s[3]!=="cpu"))throw new Error("input tensor on GPU is not supported for proxy.");if(a.some(s=>s))throw new Error("pre-allocated output tensor is not supported for proxy.");return di(),new Promise((s,u)=>{li("run",[s,u]);let l=r,d={type:"run",in:{sessionId:e,inputIndices:t,inputs:l,outputIndices:i,options:n}};yt.postMessage(d,Td(l))})}else return $d(e,t,r,i,a,n)},Jy=async e=>{if(Vr())return di(),new Promise((t,r)=>{li("end-profiling",[t,r]);let i={type:"end-profiling",in:e};yt.postMessage(i)});xd(e)}}),lu,k1,t_,vv=U(()=>{qt(),e_(),le(),Jl(),Xg(),lu=(e,t)=>{switch(e.location){case"cpu":return[e.type,e.dims,e.data,"cpu"];case"gpu-buffer":return[e.type,e.dims,{gpuBuffer:e.gpuBuffer},"gpu-buffer"];case"ml-tensor":return[e.type,e.dims,{mlTensor:e.mlTensor},"ml-tensor"];default:throw new Error(`invalid data location: ${e.location} for ${t()}`)}},k1=e=>{switch(e[3]){case"cpu":return new Jt(e[0],e[2],e[1]);case"gpu-buffer":{let t=e[0];if(!id(t))throw new Error(`not supported data type: ${t} for deserializing GPU tensor`);let{gpuBuffer:r,download:i,dispose:a}=e[2];return Jt.fromGpuBuffer(r,{dataType:t,dims:e[1],download:i,dispose:a})}case"ml-tensor":{let t=e[0];if(!nd(t))throw new Error(`not supported data type: ${t} for deserializing MLTensor tensor`);let{mlTensor:r,download:i,dispose:a}=e[2];return Jt.fromMLTensor(r,{dataType:t,dims:e[1],download:i,dispose:a})}default:throw new Error(`invalid data location: ${e[3]}`)}},t_=class{async fetchModelAndCopyToWasmMemory(e){return Xy(await ad(e))}async loadModel(e,t){mr();let r;typeof e=="string"?r=await this.fetchModelAndCopyToWasmMemory(e):r=e,[this.sessionId,this.inputNames,this.outputNames,this.inputMetadata,this.outputMetadata]=await Yy(r,t),er()}async dispose(){return Zy(this.sessionId)}async run(e,t,r){mr();let i=[],a=[];Object.entries(e).forEach(f=>{let g=f[0],y=f[1],_=this.inputNames.indexOf(g);if(_===-1)throw new Error(`invalid input '${g}'`);i.push(y),a.push(_)});let n=[],s=[];Object.entries(t).forEach(f=>{let g=f[0],y=f[1],_=this.outputNames.indexOf(g);if(_===-1)throw new Error(`invalid output '${g}'`);n.push(y),s.push(_)});let u=i.map((f,g)=>lu(f,()=>`input "${this.inputNames[a[g]]}"`)),l=n.map((f,g)=>f?lu(f,()=>`output "${this.outputNames[s[g]]}"`):null),d=await Qy(this.sessionId,a,u,s,l,r),h={};for(let f=0;f<d.length;f++)h[this.outputNames[s[f]]]=n[f]??k1(d[f]);return er(),h}startProfiling(){}endProfiling(){Jy(this.sessionId)}}}),r_={};un(r_,{OnnxruntimeWebAssemblyBackend:()=>Wu,initializeFlags:()=>Vu,wasmBackend:()=>i_});var Vu,Wu,i_,$v=U(()=>{qt(),e_(),vv(),Vu=()=>{(typeof Ae.wasm.initTimeout!="number"||Ae.wasm.initTimeout<0)&&(Ae.wasm.initTimeout=0);let e=Ae.wasm.simd;if(typeof e!="boolean"&&e!==void 0&&e!=="fixed"&&e!=="relaxed"&&(console.warn(`Property "env.wasm.simd" is set to unknown value "${e}". Reset it to \`false\` and ignore SIMD feature checking.`),Ae.wasm.simd=!1),typeof Ae.wasm.proxy!="boolean"&&(Ae.wasm.proxy=!1),typeof Ae.wasm.trace!="boolean"&&(Ae.wasm.trace=!1),typeof Ae.wasm.numThreads!="number"||!Number.isInteger(Ae.wasm.numThreads)||Ae.wasm.numThreads<=0)if(typeof self<"u"&&!self.crossOriginIsolated)Ae.wasm.numThreads=1;else{let t=typeof navigator>"u"?o4("node:os").cpus().length:navigator.hardwareConcurrency;Ae.wasm.numThreads=Math.min(4,Math.ceil((t||1)/2))}},Wu=class{async init(e){Vu(),await Hy(),await Ky(e)}async createInferenceSessionHandler(e,t){let r=new t_;return await r.loadModel(e,t),r}},i_=new Wu});qt();qt();qt();var xv="1.23.0";{let e=($v(),Fn(r_)).wasmBackend;Mi("webgpu",e,5),Mi("webnn",e,5),Mi("cpu",e,10),Mi("wasm",e,10)}Object.defineProperty(Ae.versions,"web",{value:xv,enumerable:!0});/**
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
 */const En=[{id:"joy",emoji:"😀",label:"よろこび",description:"口角を上げてにっこり"},{id:"anger",emoji:"😡",label:"いかり",description:"眉を寄せてキリッと"},{id:"sad",emoji:"😢",label:"かなしい",description:"口角を下げてしょんぼり"},{id:"surprise",emoji:"😲",label:"おどろき",description:"目と口を大きく開く"}],$a=["neutral","happiness","surprise","sadness","anger","disgust","fear","contempt"],xa={joy:$a.indexOf("happiness"),surprise:$a.indexOf("surprise"),sad:$a.indexOf("sadness"),anger:$a.indexOf("anger")},Oi=.2,Tv=.5,Ta=.35,E1=45,S1=8,C1=.25,A1=.45,hr=64,ka=(e,t)=>{const r=e.replace(/\/+$/,""),i=t.endsWith("/"),a=t.replace(/^\/+/,"").replace(/\/+$/,""),n=`${r}/${a}`;return i?`${n}/`:n},kv=e=>{const t=Array.isArray(e)?e:Array.from(e);let r=-1/0;for(let s=0;s<t.length;s+=1)r=Math.max(r,t[s]);const i=t.map(s=>Math.exp(s-r)),n=i.reduce((s,u)=>s+u,0)||1;return i.map(s=>s/n)},Ev=(e,t,r,i)=>new DOMRectReadOnly(e,t,r,i);class Sv extends Rb{constructor(){super();de(this,"video",null);de(this,"stream",null);de(this,"landmarker",null);de(this,"onnxSession",null);de(this,"detectionTimer",0);de(this,"detecting",!1);de(this,"cropCanvas");de(this,"cropCtx");de(this,"timeLeft",E1);de(this,"score",0);de(this,"combo",0);de(this,"bestCombo",0);de(this,"matchProgress",0);de(this,"target",En[0]);de(this,"lastExpression","unknown");de(this,"lastConfidence",0);de(this,"lastProbabilities",{joy:0,anger:0,sad:0,surprise:0});de(this,"lastBoundingBox",null);de(this,"status","カメラとモデルを初期化しています...");de(this,"gameOver",!1);de(this,"removeInputListener",null);this.cropCanvas=document.createElement("canvas"),this.cropCanvas.width=hr,this.cropCanvas.height=hr,this.cropCtx=this.cropCanvas.getContext("2d",{willReadFrequently:!0})}async onEnter(r){if(this.resetState(),this.video=document.getElementById("camera-stream"),!this.video){this.status="ビデオ要素が見つかりません。";return}try{this.stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"user",width:640,height:480},audio:!1}),this.video.srcObject=this.stream,await this.video.play()}catch(a){console.error(a),this.status="カメラの取得に失敗しました。権限を確認してください。";return}try{await this.initializeModels()}catch(a){console.error(a),this.status="表情解析モジュールの初期化に失敗しました。ブラウザを再読み込みしてください。";return}this.status="ターゲットの表情を真似てゲージを満たそう！",this.pickNextTarget();const i=r.input;this.removeInputListener=i.onInput(a=>this.handleInput(a))}onExit(){var r,i,a,n;this.cleanupStream(),(r=this.removeInputListener)==null||r.call(this),this.removeInputListener=null,(i=this.landmarker)==null||i.close(),this.landmarker=null,(n=(a=this.onnxSession)==null?void 0:a.release)==null||n.call(a),this.onnxSession=null}update(r){if(!this.gameOver){if(this.timeLeft=ai(this.timeLeft-r,0,999),this.timeLeft<=0){this.gameOver=!0,this.status="時間切れ！スペースかクリックで再スタート";return}!this.landmarker||!this.onnxSession||!this.video||this.video.readyState<HTMLMediaElement.HAVE_ENOUGH_DATA||(this.detectionTimer-=r,this.detectionTimer<=0&&!this.detecting&&(this.detectionTimer=Oi,this.detectExpression()))}}render(r){const i=r.renderer,a=i.context,n=i.canvas;a.save(),a.fillStyle="#0f172a",a.fillRect(0,0,n.width,n.height),a.restore(),this.video&&this.video.readyState>=HTMLMediaElement.HAVE_CURRENT_DATA&&(a.save(),a.translate(n.width,0),a.scale(-1,1),a.drawImage(this.video,0,0,n.width,n.height),a.restore()),this.lastBoundingBox&&this.drawFaceOutline(a,n),this.drawHud(a,n),this.drawStatus(a,n)}async initializeModels(){if(!this.video)throw new Error("video not ready");const r="/dev-sandbox/games/emotion/",i=ka(r,"mediapipe/wasm/"),a=ka(r,"mediapipe/face_landmarker.task"),n=await ci.forVisionTasks(i);this.landmarker=await We.createFromOptions(n,{baseOptions:{modelAssetPath:a},runningMode:"VIDEO",numFaces:1,outputFaceBlendshapes:!1,outputFacialTransformationMatrixes:!1}),Ae.wasm.wasmPaths=ka(r,"onnx/"),Ae.wasm.simd=!0,Ae.wasm.numThreads=1,Ae.wasm.proxy=!1;const s=ka(r,"models/ferplus.onnx"),u=await fetch(s);if(!u.ok)throw new Error(`モデルの取得に失敗しました (${u.status} ${u.statusText})`);const l=new Uint8Array(await u.arrayBuffer());this.onnxSession=await Ql.create(l,{executionProviders:["wasm"],graphOptimizationLevel:"all"})}resetState(){this.timeLeft=E1,this.score=0,this.combo=0,this.bestCombo=0,this.matchProgress=0,this.target=En[0],this.lastExpression="unknown",this.lastConfidence=0,this.lastProbabilities={joy:0,anger:0,sad:0,surprise:0},this.lastBoundingBox=null,this.status="カメラとモデルを初期化しています...",this.gameOver=!1,this.detectionTimer=0}handleInput(r){if(r instanceof PointerEvent&&r.type==="pointerdown"){this.gameOver&&(this.resetState(),this.status="ターゲットの表情を真似てゲージを満たそう！",this.pickNextTarget());return}if(!(r instanceof KeyboardEvent)||r.type!=="keydown")return;const i=r.key.toLowerCase();(i===" "||i==="enter")&&this.gameOver&&(this.resetState(),this.status="ターゲットの表情を真似てゲージを満たそう！",this.pickNextTarget())}async detectExpression(){if(!(!this.landmarker||!this.onnxSession||!this.video||!this.cropCtx)){this.detecting=!0;try{const r=this.landmarker.detectForVideo(this.video,performance.now());if(!r||!r.faceLandmarks.length){this.lastBoundingBox=null,this.lastExpression="unknown",this.lastConfidence=0,this.lastProbabilities={joy:0,anger:0,sad:0,surprise:0},this.matchProgress=Math.max(0,this.matchProgress-Ta*Oi),this.status="顔を検出中...";return}const i=this.computeBoundingBox(r,this.video);if(!i||i.width<=0||i.height<=0){this.matchProgress=Math.max(0,this.matchProgress-Ta*Oi);return}this.lastBoundingBox=i;const a=await this.predictEmotion(i);if(!a){this.matchProgress=Math.max(0,this.matchProgress-Ta*Oi);return}this.status=null,this.lastExpression=a.id,this.lastConfidence=a.confidence,this.lastProbabilities=a.probabilities,a.id!=="unknown"&&a.id===this.target.id&&a.confidence>=A1?this.matchProgress=Math.min(1,this.matchProgress+Tv*Oi):this.matchProgress=Math.max(0,this.matchProgress-Ta*Oi),this.matchProgress>=.999&&this.onSuccessMatch()}catch(r){console.error(r),this.status="表情の解析中にエラーが発生しました。再読み込みしてください。"}finally{this.detecting=!1}}}computeBoundingBox(r,i){var z;const a=(z=r.faceLandmarks)==null?void 0:z[0];if(!a||a.length===0)return null;const n=i.videoWidth||i.width,s=i.videoHeight||i.height,u=a.map(M=>M.x),l=a.map(M=>M.y),d=Math.max(...u)<=1&&Math.max(...l)<=1,h=M=>d?M*n:M,f=M=>d?M*s:M,g=Math.min(...u),y=Math.max(...u),_=Math.min(...l),w=Math.max(...l);let x=h(g),$=h(y),v=f(_),k=f(w);const E=$-x,S=k-v,A=E*C1,I=S*C1;return x=ai(x-A,0,n),v=ai(v-I,0,s),$=ai($+A,0,n),k=ai(k+I,0,s),Ev(x,v,Math.max(1,$-x),Math.max(1,k-v))}async predictEmotion(r){if(!this.video||!this.cropCtx||!this.onnxSession)return null;this.cropCtx.drawImage(this.video,r.x,r.y,r.width,r.height,0,0,hr,hr);const a=this.cropCtx.getImageData(0,0,hr,hr).data,n=new Float32Array(hr*hr);for(let x=0;x<n.length;x+=1){const $=x*4,v=a[$],k=a[$+1],E=a[$+2],S=(.299*v+.587*k+.114*E)/255;n[x]=S}const s={};s[this.onnxSession.inputNames[0]]=new Jt("float32",n,[1,1,hr,hr]);const u=await this.onnxSession.run(s),l=this.onnxSession.outputNames[0],d=u[l];if(!d)return null;const h=Array.from(d.data),f=kv(h),g={joy:f[xa.joy]??0,anger:f[xa.anger]??0,sad:f[xa.sad]??0,surprise:f[xa.surprise]??0},y=Object.entries(g);y.sort((x,$)=>$[1]-x[1]);const[_,w]=y[0];return{id:w>=A1?_:"unknown",confidence:w,probabilities:g}}onSuccessMatch(){this.score+=100+this.combo*20,this.combo+=1,this.bestCombo=Math.max(this.bestCombo,this.combo),this.timeLeft=ai(this.timeLeft+S1,0,120),this.matchProgress=0,this.status=`${this.target.label}クリア！ +${S1}秒`,this.pickNextTarget()}pickNextTarget(){const r=En.filter(a=>a.id!==this.target.id),i=Math.floor(Math.random()*r.length);this.target=r[i]}drawFaceOutline(r,i){if(!this.video||!this.lastBoundingBox)return;const a=this.lastBoundingBox,n=i.width/(this.video.videoWidth||this.video.width||i.width),s=i.height/(this.video.videoHeight||this.video.height||i.height),u=i.width-(a.x+a.width)*n,l=a.y*s,d=a.width*n,h=a.height*s;r.save(),r.strokeStyle="rgba(96, 165, 250, 0.85)",r.lineWidth=3,r.strokeRect(u,l,d,h),r.restore()}drawHud(r,i){var h;r.save(),r.fillStyle="rgba(15, 23, 42, 0.6)",r.fillRect(20,20,200,120),r.fillRect(i.width-240,20,220,180),r.fillStyle="#f8fafc",r.font='22px/1.3 "Noto Sans JP", system-ui, sans-serif',r.fillText("ターゲット",32,52),r.font='64px/1 "Segoe UI Emoji", system-ui',r.fillText(this.target.emoji,36,120),r.font='20px/1.2 "Noto Sans JP", system-ui, sans-serif',r.fillText(this.target.label,100,86),r.fillText(this.target.description,32,150),r.textAlign="right",r.font='24px/1.4 "Noto Sans JP", system-ui, sans-serif',r.fillText(`スコア: ${this.score}`,i.width-24,52),r.fillText(`のこり時間: ${Math.ceil(this.timeLeft)}s`,i.width-24,84),r.fillText(`コンボ: ${this.combo} (ベスト ${this.bestCombo})`,i.width-24,116);const a=this.lastExpression==="unknown"?"---":((h=En.find(f=>f.id===this.lastExpression))==null?void 0:h.label)??"---";r.fillText(`判定: ${a}`,i.width-24,148),r.fillText(`確信度: ${(this.lastConfidence*100).toFixed(1)}%`,i.width-24,180),r.textAlign="left";const n=i.width-80,s=40,u=i.height-60;r.fillStyle="rgba(15, 23, 42, 0.6)",r.fillRect(s,u,n,24),r.fillStyle="#34d399",r.fillRect(s,u,n*ai(this.matchProgress,0,1),24),r.strokeStyle="rgba(248, 250, 252, 0.8)",r.lineWidth=2,r.strokeRect(s,u,n,24),r.fillStyle="#f8fafc",r.font='18px/1.2 "Noto Sans JP", system-ui, sans-serif',r.fillText("ターゲットと一致するとゲージが満タンになります",s,u-8),r.font='16px/1.2 "Noto Sans JP", system-ui, sans-serif';const l=En.map(f=>[f,this.lastProbabilities[f.id]]);l.sort((f,g)=>g[1]-f[1]);const d=i.height-120;l.forEach(([f,g],y)=>{r.fillStyle=f.id===this.target.id?"#facc15":"#f8fafc",r.fillText(`${f.label}: ${(g*100).toFixed(1)}%`,32,d+y*20)}),r.restore()}drawStatus(r,i){if(!this.status)return;r.save(),r.fillStyle="rgba(15, 23, 42, 0.7)",r.fillRect(80,i.height/2-60,i.width-160,120),r.fillStyle="#f8fafc",r.textAlign="center",r.font='26px/1.4 "Noto Sans JP", system-ui, sans-serif',this.status.split(`
`).forEach((n,s)=>{r.fillText(n,i.width/2,i.height/2-10+s*30)}),r.textAlign="left",r.restore()}cleanupStream(){var r;(r=this.stream)==null||r.getTracks().forEach(i=>i.stop()),this.stream=null,this.video&&(this.video.srcObject=null,this.video=null)}}const Qa=document.getElementById("game-canvas");if(!Qa)throw new Error("ゲームキャンバスが見つかりません");const kd=new zb(Qa,{background:"#0f172a"});kd.renderer.resize(Ob(Qa.width,Qa.height));kd.setScene(new Sv);kd.start();
