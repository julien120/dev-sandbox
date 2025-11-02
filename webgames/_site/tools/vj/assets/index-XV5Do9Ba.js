(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();const Oh="14.9.17",hu=(i,t,e)=>({endTime:t,insertTime:e,type:"exponentialRampToValue",value:i}),du=(i,t,e)=>({endTime:t,insertTime:e,type:"linearRampToValue",value:i}),Ec=(i,t)=>({startTime:t,type:"setValue",value:i}),Uh=(i,t,e)=>({duration:e,startTime:t,type:"setValueCurve",values:i}),Fh=(i,t,{startTime:e,target:n,timeConstant:s})=>n+(t-n)*Math.exp((e-i)/s),Cs=i=>i.type==="exponentialRampToValue",Fo=i=>i.type==="linearRampToValue",fi=i=>Cs(i)||Fo(i),ml=i=>i.type==="setValue",jn=i=>i.type==="setValueCurve",ko=(i,t,e,n)=>{const s=i[t];return s===void 0?n:fi(s)||ml(s)?s.value:jn(s)?s.values[s.values.length-1]:Fh(e,ko(i,t-1,s.startTime,n),s)},fu=(i,t,e,n,s)=>e===void 0?[n.insertTime,s]:fi(e)?[e.endTime,e.value]:ml(e)?[e.startTime,e.value]:jn(e)?[e.startTime+e.duration,e.values[e.values.length-1]]:[e.startTime,ko(i,t-1,e.startTime,s)],bc=i=>i.type==="cancelAndHold",wc=i=>i.type==="cancelScheduledValues",oi=i=>bc(i)||wc(i)?i.cancelTime:Cs(i)||Fo(i)?i.endTime:i.startTime,pu=(i,t,e,{endTime:n,value:s})=>e===s?s:0<e&&0<s||e<0&&s<0?e*(s/e)**((i-t)/(n-t)):0,mu=(i,t,e,{endTime:n,value:s})=>e+(i-t)/(n-t)*(s-e),Gf=(i,t)=>{const e=Math.floor(t),n=Math.ceil(t);return e===n?i[e]:(1-(t-e))*i[e]+(1-(n-t))*i[n]},Hf=(i,{duration:t,startTime:e,values:n})=>{const s=(i-e)/t*(n.length-1);return Gf(n,s)},$r=i=>i.type==="setTarget";class Wf{constructor(t){this._automationEvents=[],this._currenTime=0,this._defaultValue=t}[Symbol.iterator](){return this._automationEvents[Symbol.iterator]()}add(t){const e=oi(t);if(bc(t)||wc(t)){const n=this._automationEvents.findIndex(r=>wc(t)&&jn(r)?r.startTime+r.duration>=e:oi(r)>=e),s=this._automationEvents[n];if(n!==-1&&(this._automationEvents=this._automationEvents.slice(0,n)),bc(t)){const r=this._automationEvents[this._automationEvents.length-1];if(s!==void 0&&fi(s)){if(r!==void 0&&$r(r))throw new Error("The internal list is malformed.");const o=r===void 0?s.insertTime:jn(r)?r.startTime+r.duration:oi(r),a=r===void 0?this._defaultValue:jn(r)?r.values[r.values.length-1]:r.value,c=Cs(s)?pu(e,o,a,s):mu(e,o,a,s),l=Cs(s)?hu(c,e,this._currenTime):du(c,e,this._currenTime);this._automationEvents.push(l)}if(r!==void 0&&$r(r)&&this._automationEvents.push(Ec(this.getValue(e),e)),r!==void 0&&jn(r)&&r.startTime+r.duration>e){const o=e-r.startTime,a=(r.values.length-1)/r.duration,c=Math.max(2,1+Math.ceil(o*a)),l=o/(c-1)*a,u=r.values.slice(0,c);if(l<1)for(let h=1;h<c;h+=1){const d=l*h%1;u[h]=r.values[h-1]*(1-d)+r.values[h]*d}this._automationEvents[this._automationEvents.length-1]=Uh(u,r.startTime,o)}}}else{const n=this._automationEvents.findIndex(o=>oi(o)>e),s=n===-1?this._automationEvents[this._automationEvents.length-1]:this._automationEvents[n-1];if(s!==void 0&&jn(s)&&oi(s)+s.duration>e)return!1;const r=Cs(t)?hu(t.value,t.endTime,this._currenTime):Fo(t)?du(t.value,e,this._currenTime):t;if(n===-1)this._automationEvents.push(r);else{if(jn(t)&&e+t.duration>oi(this._automationEvents[n]))return!1;this._automationEvents.splice(n,0,r)}}return!0}flush(t){const e=this._automationEvents.findIndex(n=>oi(n)>t);if(e>1){const n=this._automationEvents.slice(e-1),s=n[0];$r(s)&&n.unshift(Ec(ko(this._automationEvents,e-2,s.startTime,this._defaultValue),s.startTime)),this._automationEvents=n}}getValue(t){if(this._automationEvents.length===0)return this._defaultValue;const e=this._automationEvents.findIndex(o=>oi(o)>t),n=this._automationEvents[e],s=(e===-1?this._automationEvents.length:e)-1,r=this._automationEvents[s];if(r!==void 0&&$r(r)&&(n===void 0||!fi(n)||n.insertTime>t))return Fh(t,ko(this._automationEvents,s-1,r.startTime,this._defaultValue),r);if(r!==void 0&&ml(r)&&(n===void 0||!fi(n)))return r.value;if(r!==void 0&&jn(r)&&(n===void 0||!fi(n)||r.startTime+r.duration>t))return t<r.startTime+r.duration?Hf(t,r):r.values[r.values.length-1];if(r!==void 0&&fi(r)&&(n===void 0||!fi(n)))return r.value;if(n!==void 0&&Cs(n)){const[o,a]=fu(this._automationEvents,s,r,n,this._defaultValue);return pu(t,o,a,n)}if(n!==void 0&&Fo(n)){const[o,a]=fu(this._automationEvents,s,r,n,this._defaultValue);return mu(t,o,a,n)}return this._defaultValue}}const qf=i=>({cancelTime:i,type:"cancelAndHold"}),Xf=i=>({cancelTime:i,type:"cancelScheduledValues"}),Yf=(i,t)=>({endTime:t,type:"exponentialRampToValue",value:i}),jf=(i,t)=>({endTime:t,type:"linearRampToValue",value:i}),$f=(i,t,e)=>({startTime:t,target:i,timeConstant:e,type:"setTarget"}),Zf=()=>new DOMException("","AbortError"),Kf=i=>(t,e,[n,s,r],o)=>{i(t[s],[e,n,r],a=>a[0]===e&&a[1]===n,o)},Jf=i=>(t,e,n)=>{const s=[];for(let r=0;r<n.numberOfInputs;r+=1)s.push(new Set);i.set(t,{activeInputs:s,outputs:new Set,passiveInputs:new WeakMap,renderer:e})},Qf=i=>(t,e)=>{i.set(t,{activeInputs:new Set,passiveInputs:new WeakMap,renderer:e})},Ls=new WeakSet,kh=new WeakMap,_l=new WeakMap,Bh=new WeakMap,gl=new WeakMap,Ma=new WeakMap,Vh=new WeakMap,Ac=new WeakMap,Cc=new WeakMap,Rc=new WeakMap,zh={construct(){return zh}},tp=i=>{try{const t=new Proxy(i,zh);new t}catch{return!1}return!0},_u=/^import(?:(?:[\s]+[\w]+|(?:[\s]+[\w]+[\s]*,)?[\s]*\{[\s]*[\w]+(?:[\s]+as[\s]+[\w]+)?(?:[\s]*,[\s]*[\w]+(?:[\s]+as[\s]+[\w]+)?)*[\s]*}|(?:[\s]+[\w]+[\s]*,)?[\s]*\*[\s]+as[\s]+[\w]+)[\s]+from)?(?:[\s]*)("([^"\\]|\\.)+"|'([^'\\]|\\.)+')(?:[\s]*);?/,gu=(i,t)=>{const e=[];let n=i.replace(/^[\s]+/,""),s=n.match(_u);for(;s!==null;){const r=s[1].slice(1,-1),o=s[0].replace(/([\s]+)?;?$/,"").replace(r,new URL(r,t).toString());e.push(o),n=n.slice(s[0].length).replace(/^[\s]+/,""),s=n.match(_u)}return[e.join(";"),n]},vu=i=>{if(i!==void 0&&!Array.isArray(i))throw new TypeError("The parameterDescriptors property of given value for processorCtor is not an array.")},xu=i=>{if(!tp(i))throw new TypeError("The given value for processorCtor should be a constructor.");if(i.prototype===null||typeof i.prototype!="object")throw new TypeError("The given value for processorCtor should have a prototype.")},ep=(i,t,e,n,s,r,o,a,c,l,u,h,d)=>{let m=0;return(_,g,p={credentials:"omit"})=>{const f=u.get(_);if(f!==void 0&&f.has(g))return Promise.resolve();const y=l.get(_);if(y!==void 0){const w=y.get(g);if(w!==void 0)return w}const x=r(_),T=x.audioWorklet===void 0?s(g).then(([w,E])=>{const[b,C]=gu(w,E),S=`${b};((a,b)=>{(a[b]=a[b]||[]).push((AudioWorkletProcessor,global,registerProcessor,sampleRate,self,window)=>{${C}
})})(window,'_AWGS')`;return e(S)}).then(()=>{const w=d._AWGS.pop();if(w===void 0)throw new SyntaxError;n(x.currentTime,x.sampleRate,()=>w(class{},void 0,(E,b)=>{if(E.trim()==="")throw t();const C=Cc.get(x);if(C!==void 0){if(C.has(E))throw t();xu(b),vu(b.parameterDescriptors),C.set(E,b)}else xu(b),vu(b.parameterDescriptors),Cc.set(x,new Map([[E,b]]))},x.sampleRate,void 0,void 0))}):Promise.all([s(g),Promise.resolve(i(h,h))]).then(([[w,E],b])=>{const C=m+1;m=C;const[S,v]=gu(w,E),F=`${S};((AudioWorkletProcessor,registerProcessor)=>{${v}
})(${b?"AudioWorkletProcessor":"class extends AudioWorkletProcessor {__b=new WeakSet();constructor(){super();(p=>p.postMessage=(q=>(m,t)=>q.call(p,m,t?t.filter(u=>!this.__b.has(u)):t))(p.postMessage))(this.port)}}"},(n,p)=>registerProcessor(n,class extends p{${b?"":"__c = (a) => a.forEach(e=>this.__b.add(e.buffer));"}process(i,o,p){${b?"":"i.forEach(this.__c);o.forEach(this.__c);this.__c(Object.values(p));"}return super.process(i.map(j=>j.some(k=>k.length===0)?[]:j),o,p)}}));registerProcessor('__sac${C}',class extends AudioWorkletProcessor{process(){return !1}})`,z=new Blob([F],{type:"application/javascript; charset=utf-8"}),U=URL.createObjectURL(z);return x.audioWorklet.addModule(U,p).then(()=>{if(a(x))return x;const B=o(x);return B.audioWorklet.addModule(U,p).then(()=>B)}).then(B=>{if(c===null)throw new SyntaxError;try{new c(B,`__sac${C}`)}catch{throw new SyntaxError}}).finally(()=>URL.revokeObjectURL(U))});return y===void 0?l.set(_,new Map([[g,T]])):y.set(g,T),T.then(()=>{const w=u.get(_);w===void 0?u.set(_,new Set([g])):w.add(g)}).finally(()=>{const w=l.get(_);w!==void 0&&w.delete(g)}),T}},xn=(i,t)=>{const e=i.get(t);if(e===void 0)throw new Error("A value with the given key could not be found.");return e},Ta=(i,t)=>{const e=Array.from(i).filter(t);if(e.length>1)throw Error("More than one element was found.");if(e.length===0)throw Error("No element was found.");const[n]=e;return i.delete(n),n},Gh=(i,t,e,n)=>{const s=xn(i,t),r=Ta(s,o=>o[0]===e&&o[1]===n);return s.size===0&&i.delete(t),r},Ir=i=>xn(Vh,i),Os=i=>{if(Ls.has(i))throw new Error("The AudioNode is already stored.");Ls.add(i),Ir(i).forEach(t=>t(!0))},Hh=i=>"port"in i,Nr=i=>{if(!Ls.has(i))throw new Error("The AudioNode is not stored.");Ls.delete(i),Ir(i).forEach(t=>t(!1))},Dc=(i,t)=>{!Hh(i)&&t.every(e=>e.size===0)&&Nr(i)},np=(i,t,e,n,s,r,o,a,c,l,u,h,d)=>{const m=new WeakMap;return(_,g,p,f,y)=>{const{activeInputs:x,passiveInputs:T}=r(g),{outputs:w}=r(_),E=a(_),b=C=>{const S=c(g),v=c(_);if(C){const R=Gh(T,_,p,f);i(x,_,R,!1),!y&&!h(_)&&e(v,S,p,f),d(g)&&Os(g)}else{const R=n(x,_,p,f);t(T,f,R,!1),!y&&!h(_)&&s(v,S,p,f);const P=o(g);if(P===0)u(g)&&Dc(g,x);else{const N=m.get(g);N!==void 0&&clearTimeout(N),m.set(g,setTimeout(()=>{u(g)&&Dc(g,x)},P*1e3))}}};return l(w,[g,p,f],C=>C[0]===g&&C[1]===p&&C[2]===f,!0)?(E.add(b),u(_)?i(x,_,[p,f,b],!0):t(T,f,[_,p,b],!0),!0):!1}},ip=i=>(t,e,[n,s,r],o)=>{const a=t.get(n);a===void 0?t.set(n,new Set([[s,e,r]])):i(a,[s,e,r],c=>c[0]===s&&c[1]===e,o)},sp=i=>(t,e)=>{const n=i(t,{channelCount:1,channelCountMode:"explicit",channelInterpretation:"discrete",gain:0});e.connect(n).connect(t.destination);const s=()=>{e.removeEventListener("ended",s),e.disconnect(n),n.disconnect()};e.addEventListener("ended",s)},rp=i=>(t,e)=>{i(t).add(e)},op={channelCount:2,channelCountMode:"max",channelInterpretation:"speakers",fftSize:2048,maxDecibels:-30,minDecibels:-100,smoothingTimeConstant:.8},ap=(i,t,e,n,s,r)=>class extends i{constructor(a,c){const l=s(a),u={...op,...c},h=n(l,u),d=r(l)?t():null;super(a,!1,h,d),this._nativeAnalyserNode=h}get fftSize(){return this._nativeAnalyserNode.fftSize}set fftSize(a){this._nativeAnalyserNode.fftSize=a}get frequencyBinCount(){return this._nativeAnalyserNode.frequencyBinCount}get maxDecibels(){return this._nativeAnalyserNode.maxDecibels}set maxDecibels(a){const c=this._nativeAnalyserNode.maxDecibels;if(this._nativeAnalyserNode.maxDecibels=a,!(a>this._nativeAnalyserNode.minDecibels))throw this._nativeAnalyserNode.maxDecibels=c,e()}get minDecibels(){return this._nativeAnalyserNode.minDecibels}set minDecibels(a){const c=this._nativeAnalyserNode.minDecibels;if(this._nativeAnalyserNode.minDecibels=a,!(this._nativeAnalyserNode.maxDecibels>a))throw this._nativeAnalyserNode.minDecibels=c,e()}get smoothingTimeConstant(){return this._nativeAnalyserNode.smoothingTimeConstant}set smoothingTimeConstant(a){this._nativeAnalyserNode.smoothingTimeConstant=a}getByteFrequencyData(a){this._nativeAnalyserNode.getByteFrequencyData(a)}getByteTimeDomainData(a){this._nativeAnalyserNode.getByteTimeDomainData(a)}getFloatFrequencyData(a){this._nativeAnalyserNode.getFloatFrequencyData(a)}getFloatTimeDomainData(a){this._nativeAnalyserNode.getFloatTimeDomainData(a)}},Ue=(i,t)=>i.context===t,cp=(i,t,e)=>()=>{const n=new WeakMap,s=async(r,o)=>{let a=t(r);if(!Ue(a,o)){const l={channelCount:a.channelCount,channelCountMode:a.channelCountMode,channelInterpretation:a.channelInterpretation,fftSize:a.fftSize,maxDecibels:a.maxDecibels,minDecibels:a.minDecibels,smoothingTimeConstant:a.smoothingTimeConstant};a=i(o,l)}return n.set(o,a),await e(r,o,a),a};return{render(r,o){const a=n.get(o);return a!==void 0?Promise.resolve(a):s(r,o)}}},Bo=i=>{try{i.copyToChannel(new Float32Array(1),0,-1)}catch{return!1}return!0},Un=()=>new DOMException("","IndexSizeError"),vl=i=>{i.getChannelData=(t=>e=>{try{return t.call(i,e)}catch(n){throw n.code===12?Un():n}})(i.getChannelData)},lp={numberOfChannels:1},up=(i,t,e,n,s,r,o,a)=>{let c=null;return class Wh{constructor(u){if(s===null)throw new Error("Missing the native OfflineAudioContext constructor.");const{length:h,numberOfChannels:d,sampleRate:m}={...lp,...u};c===null&&(c=new s(1,1,44100));const _=n!==null&&t(r,r)?new n({length:h,numberOfChannels:d,sampleRate:m}):c.createBuffer(d,h,m);if(_.numberOfChannels===0)throw e();return typeof _.copyFromChannel!="function"?(o(_),vl(_)):t(Bo,()=>Bo(_))||a(_),i.add(_),_}static[Symbol.hasInstance](u){return u!==null&&typeof u=="object"&&Object.getPrototypeOf(u)===Wh.prototype||i.has(u)}}},He=-34028234663852886e22,ke=-He,Jn=i=>Ls.has(i),hp={buffer:null,channelCount:2,channelCountMode:"max",channelInterpretation:"speakers",loop:!1,loopEnd:0,loopStart:0,playbackRate:1},dp=(i,t,e,n,s,r,o,a)=>class extends i{constructor(l,u){const h=r(l),d={...hp,...u},m=s(h,d),_=o(h),g=_?t():null;super(l,!1,m,g),this._audioBufferSourceNodeRenderer=g,this._isBufferNullified=!1,this._isBufferSet=d.buffer!==null,this._nativeAudioBufferSourceNode=m,this._onended=null,this._playbackRate=e(this,_,m.playbackRate,ke,He)}get buffer(){return this._isBufferNullified?null:this._nativeAudioBufferSourceNode.buffer}set buffer(l){if(this._nativeAudioBufferSourceNode.buffer=l,l!==null){if(this._isBufferSet)throw n();this._isBufferSet=!0}}get loop(){return this._nativeAudioBufferSourceNode.loop}set loop(l){this._nativeAudioBufferSourceNode.loop=l}get loopEnd(){return this._nativeAudioBufferSourceNode.loopEnd}set loopEnd(l){this._nativeAudioBufferSourceNode.loopEnd=l}get loopStart(){return this._nativeAudioBufferSourceNode.loopStart}set loopStart(l){this._nativeAudioBufferSourceNode.loopStart=l}get onended(){return this._onended}set onended(l){const u=typeof l=="function"?a(this,l):null;this._nativeAudioBufferSourceNode.onended=u;const h=this._nativeAudioBufferSourceNode.onended;this._onended=h!==null&&h===u?l:h}get playbackRate(){return this._playbackRate}start(l=0,u=0,h){if(this._nativeAudioBufferSourceNode.start(l,u,h),this._audioBufferSourceNodeRenderer!==null&&(this._audioBufferSourceNodeRenderer.start=h===void 0?[l,u]:[l,u,h]),this.context.state!=="closed"){Os(this);const d=()=>{this._nativeAudioBufferSourceNode.removeEventListener("ended",d),Jn(this)&&Nr(this)};this._nativeAudioBufferSourceNode.addEventListener("ended",d)}}stop(l=0){this._nativeAudioBufferSourceNode.stop(l),this._audioBufferSourceNodeRenderer!==null&&(this._audioBufferSourceNodeRenderer.stop=l)}},fp=(i,t,e,n,s)=>()=>{const r=new WeakMap;let o=null,a=null;const c=async(l,u)=>{let h=e(l);const d=Ue(h,u);if(!d){const m={buffer:h.buffer,channelCount:h.channelCount,channelCountMode:h.channelCountMode,channelInterpretation:h.channelInterpretation,loop:h.loop,loopEnd:h.loopEnd,loopStart:h.loopStart,playbackRate:h.playbackRate.value};h=t(u,m),o!==null&&h.start(...o),a!==null&&h.stop(a)}return r.set(u,h),d?await i(u,l.playbackRate,h.playbackRate):await n(u,l.playbackRate,h.playbackRate),await s(l,u,h),h};return{set start(l){o=l},set stop(l){a=l},render(l,u){const h=r.get(u);return h!==void 0?Promise.resolve(h):c(l,u)}}},pp=i=>"playbackRate"in i,mp=i=>"frequency"in i&&"gain"in i,_p=i=>"offset"in i,gp=i=>!("frequency"in i)&&"gain"in i,vp=i=>"detune"in i&&"frequency"in i&&!("gain"in i),xp=i=>"pan"in i,Be=i=>xn(kh,i),Lr=i=>xn(Bh,i),Pc=(i,t)=>{const{activeInputs:e}=Be(i);e.forEach(s=>s.forEach(([r])=>{t.includes(i)||Pc(r,[...t,i])}));const n=pp(i)?[i.playbackRate]:Hh(i)?Array.from(i.parameters.values()):mp(i)?[i.Q,i.detune,i.frequency,i.gain]:_p(i)?[i.offset]:gp(i)?[i.gain]:vp(i)?[i.detune,i.frequency]:xp(i)?[i.pan]:[];for(const s of n){const r=Lr(s);r!==void 0&&r.activeInputs.forEach(([o])=>Pc(o,t))}Jn(i)&&Nr(i)},qh=i=>{Pc(i.destination,[])},yp=i=>i===void 0||typeof i=="number"||typeof i=="string"&&(i==="balanced"||i==="interactive"||i==="playback"),Sp=(i,t,e,n,s,r,o,a,c)=>class extends i{constructor(u={}){if(c===null)throw new Error("Missing the native AudioContext constructor.");let h;try{h=new c(u)}catch(_){throw _.code===12&&_.message==="sampleRate is not in range"?e():_}if(h===null)throw n();if(!yp(u.latencyHint))throw new TypeError(`The provided value '${u.latencyHint}' is not a valid enum value of type AudioContextLatencyCategory.`);if(u.sampleRate!==void 0&&h.sampleRate!==u.sampleRate)throw e();super(h,2);const{latencyHint:d}=u,{sampleRate:m}=h;if(this._baseLatency=typeof h.baseLatency=="number"?h.baseLatency:d==="balanced"?512/m:d==="interactive"||d===void 0?256/m:d==="playback"?1024/m:Math.max(2,Math.min(128,Math.round(d*m/128)))*128/m,this._nativeAudioContext=h,c.name==="webkitAudioContext"?(this._nativeGainNode=h.createGain(),this._nativeOscillatorNode=h.createOscillator(),this._nativeGainNode.gain.value=1e-37,this._nativeOscillatorNode.connect(this._nativeGainNode).connect(h.destination),this._nativeOscillatorNode.start()):(this._nativeGainNode=null,this._nativeOscillatorNode=null),this._state=null,h.state==="running"){this._state="suspended";const _=()=>{this._state==="suspended"&&(this._state=null),h.removeEventListener("statechange",_)};h.addEventListener("statechange",_)}}get baseLatency(){return this._baseLatency}get state(){return this._state!==null?this._state:this._nativeAudioContext.state}close(){return this.state==="closed"?this._nativeAudioContext.close().then(()=>{throw t()}):(this._state==="suspended"&&(this._state=null),this._nativeAudioContext.close().then(()=>{this._nativeGainNode!==null&&this._nativeOscillatorNode!==null&&(this._nativeOscillatorNode.stop(),this._nativeGainNode.disconnect(),this._nativeOscillatorNode.disconnect()),qh(this)}))}createMediaElementSource(u){return new s(this,{mediaElement:u})}createMediaStreamDestination(){return new r(this)}createMediaStreamSource(u){return new o(this,{mediaStream:u})}createMediaStreamTrackSource(u){return new a(this,{mediaStreamTrack:u})}resume(){return this._state==="suspended"?new Promise((u,h)=>{const d=()=>{this._nativeAudioContext.removeEventListener("statechange",d),this._nativeAudioContext.state==="running"?u():this.resume().then(u,h)};this._nativeAudioContext.addEventListener("statechange",d)}):this._nativeAudioContext.resume().catch(u=>{throw u===void 0||u.code===15?t():u})}suspend(){return this._nativeAudioContext.suspend().catch(u=>{throw u===void 0?t():u})}},Mp=(i,t,e,n,s,r,o,a)=>class extends i{constructor(l,u){const h=r(l),d=o(h),m=s(h,u,d),_=d?t(a):null;super(l,!1,m,_),this._isNodeOfNativeOfflineAudioContext=d,this._nativeAudioDestinationNode=m}get channelCount(){return this._nativeAudioDestinationNode.channelCount}set channelCount(l){if(this._isNodeOfNativeOfflineAudioContext)throw n();if(l>this._nativeAudioDestinationNode.maxChannelCount)throw e();this._nativeAudioDestinationNode.channelCount=l}get channelCountMode(){return this._nativeAudioDestinationNode.channelCountMode}set channelCountMode(l){if(this._isNodeOfNativeOfflineAudioContext)throw n();this._nativeAudioDestinationNode.channelCountMode=l}get maxChannelCount(){return this._nativeAudioDestinationNode.maxChannelCount}},Tp=i=>{const t=new WeakMap,e=async(n,s)=>{const r=s.destination;return t.set(s,r),await i(n,s,r),r};return{render(n,s){const r=t.get(s);return r!==void 0?Promise.resolve(r):e(n,s)}}},Ep=(i,t,e,n,s,r,o,a)=>(c,l)=>{const u=l.listener,h=()=>{const w=new Float32Array(1),E=t(l,{channelCount:1,channelCountMode:"explicit",channelInterpretation:"speakers",numberOfInputs:9}),b=o(l);let C=!1,S=[0,0,-1,0,1,0],v=[0,0,0];const R=()=>{if(C)return;C=!0;const z=n(l,256,9,0);z.onaudioprocess=({inputBuffer:U})=>{const B=[r(U,w,0),r(U,w,1),r(U,w,2),r(U,w,3),r(U,w,4),r(U,w,5)];B.some((j,J)=>j!==S[J])&&(u.setOrientation(...B),S=B);const V=[r(U,w,6),r(U,w,7),r(U,w,8)];V.some((j,J)=>j!==v[J])&&(u.setPosition(...V),v=V)},E.connect(z)},P=z=>U=>{U!==S[z]&&(S[z]=U,u.setOrientation(...S))},N=z=>U=>{U!==v[z]&&(v[z]=U,u.setPosition(...v))},F=(z,U,B)=>{const V=e(l,{channelCount:1,channelCountMode:"explicit",channelInterpretation:"discrete",offset:U});V.connect(E,0,z),V.start(),Object.defineProperty(V.offset,"defaultValue",{get(){return U}});const j=i({context:c},b,V.offset,ke,He);return a(j,"value",J=>()=>J.call(j),J=>nt=>{try{J.call(j,nt)}catch(xt){if(xt.code!==9)throw xt}R(),b&&B(nt)}),j.cancelAndHoldAtTime=(J=>b?()=>{throw s()}:(...nt)=>{const xt=J.apply(j,nt);return R(),xt})(j.cancelAndHoldAtTime),j.cancelScheduledValues=(J=>b?()=>{throw s()}:(...nt)=>{const xt=J.apply(j,nt);return R(),xt})(j.cancelScheduledValues),j.exponentialRampToValueAtTime=(J=>b?()=>{throw s()}:(...nt)=>{const xt=J.apply(j,nt);return R(),xt})(j.exponentialRampToValueAtTime),j.linearRampToValueAtTime=(J=>b?()=>{throw s()}:(...nt)=>{const xt=J.apply(j,nt);return R(),xt})(j.linearRampToValueAtTime),j.setTargetAtTime=(J=>b?()=>{throw s()}:(...nt)=>{const xt=J.apply(j,nt);return R(),xt})(j.setTargetAtTime),j.setValueAtTime=(J=>b?()=>{throw s()}:(...nt)=>{const xt=J.apply(j,nt);return R(),xt})(j.setValueAtTime),j.setValueCurveAtTime=(J=>b?()=>{throw s()}:(...nt)=>{const xt=J.apply(j,nt);return R(),xt})(j.setValueCurveAtTime),j};return{forwardX:F(0,0,P(0)),forwardY:F(1,0,P(1)),forwardZ:F(2,-1,P(2)),positionX:F(6,0,N(0)),positionY:F(7,0,N(1)),positionZ:F(8,0,N(2)),upX:F(3,0,P(3)),upY:F(4,1,P(4)),upZ:F(5,0,P(5))}},{forwardX:d,forwardY:m,forwardZ:_,positionX:g,positionY:p,positionZ:f,upX:y,upY:x,upZ:T}=u.forwardX===void 0?h():u;return{get forwardX(){return d},get forwardY(){return m},get forwardZ(){return _},get positionX(){return g},get positionY(){return p},get positionZ(){return f},get upX(){return y},get upY(){return x},get upZ(){return T}}},Vo=i=>"context"in i,Or=i=>Vo(i[0]),is=(i,t,e,n)=>{for(const s of i)if(e(s)){if(n)return!1;throw Error("The set contains at least one similar element.")}return i.add(t),!0},yu=(i,t,[e,n],s)=>{is(i,[t,e,n],r=>r[0]===t&&r[1]===e,s)},Su=(i,[t,e,n],s)=>{const r=i.get(t);r===void 0?i.set(t,new Set([[e,n]])):is(r,[e,n],o=>o[0]===e,s)},$s=i=>"inputs"in i,zo=(i,t,e,n)=>{if($s(t)){const s=t.inputs[n];return i.connect(s,e,0),[s,e,0]}return i.connect(t,e,n),[t,e,n]},Xh=(i,t,e)=>{for(const n of i)if(n[0]===t&&n[1]===e)return i.delete(n),n;return null},bp=(i,t,e)=>Ta(i,n=>n[0]===t&&n[1]===e),Yh=(i,t)=>{if(!Ir(i).delete(t))throw new Error("Missing the expected event listener.")},jh=(i,t,e)=>{const n=xn(i,t),s=Ta(n,r=>r[0]===e);return n.size===0&&i.delete(t),s},Go=(i,t,e,n)=>{$s(t)?i.disconnect(t.inputs[n],e,0):i.disconnect(t,e,n)},ce=i=>xn(_l,i),pr=i=>xn(gl,i),Yi=i=>Ac.has(i),bo=i=>!Ls.has(i),Mu=(i,t)=>new Promise(e=>{if(t!==null)e(!0);else{const n=i.createScriptProcessor(256,1,1),s=i.createGain(),r=i.createBuffer(1,2,44100),o=r.getChannelData(0);o[0]=1,o[1]=1;const a=i.createBufferSource();a.buffer=r,a.loop=!0,a.connect(n).connect(i.destination),a.connect(s),a.disconnect(s),n.onaudioprocess=c=>{const l=c.inputBuffer.getChannelData(0);Array.prototype.some.call(l,u=>u===1)?e(!0):e(!1),a.stop(),n.onaudioprocess=null,a.disconnect(n),n.disconnect(i.destination)},a.start()}}),ja=(i,t)=>{const e=new Map;for(const n of i)for(const s of n){const r=e.get(s);e.set(s,r===void 0?1:r+1)}e.forEach((n,s)=>t(s,n))},Ho=i=>"context"in i,wp=i=>{const t=new Map;i.connect=(e=>(n,s=0,r=0)=>{const o=Ho(n)?e(n,s,r):e(n,s),a=t.get(n);return a===void 0?t.set(n,[{input:r,output:s}]):a.every(c=>c.input!==r||c.output!==s)&&a.push({input:r,output:s}),o})(i.connect.bind(i)),i.disconnect=(e=>(n,s,r)=>{if(e.apply(i),n===void 0)t.clear();else if(typeof n=="number")for(const[o,a]of t){const c=a.filter(l=>l.output!==n);c.length===0?t.delete(o):t.set(o,c)}else if(t.has(n))if(s===void 0)t.delete(n);else{const o=t.get(n);if(o!==void 0){const a=o.filter(c=>c.output!==s&&(c.input!==r||r===void 0));a.length===0?t.delete(n):t.set(n,a)}}for(const[o,a]of t)a.forEach(c=>{Ho(o)?i.connect(o,c.output,c.input):i.connect(o,c.output)})})(i.disconnect)},Ap=(i,t,e,n)=>{const{activeInputs:s,passiveInputs:r}=Lr(t),{outputs:o}=Be(i),a=Ir(i),c=l=>{const u=ce(i),h=pr(t);if(l){const d=jh(r,i,e);yu(s,i,d,!1),!n&&!Yi(i)&&u.connect(h,e)}else{const d=bp(s,i,e);Su(r,d,!1),!n&&!Yi(i)&&u.disconnect(h,e)}};return is(o,[t,e],l=>l[0]===t&&l[1]===e,!0)?(a.add(c),Jn(i)?yu(s,i,[e,c],!0):Su(r,[i,e,c],!0),!0):!1},Cp=(i,t,e,n)=>{const{activeInputs:s,passiveInputs:r}=Be(t),o=Xh(s[n],i,e);return o===null?[Gh(r,i,e,n)[2],!1]:[o[2],!0]},Rp=(i,t,e)=>{const{activeInputs:n,passiveInputs:s}=Lr(t),r=Xh(n,i,e);return r===null?[jh(s,i,e)[1],!1]:[r[2],!0]},xl=(i,t,e,n,s)=>{const[r,o]=Cp(i,e,n,s);if(r!==null&&(Yh(i,r),o&&!t&&!Yi(i)&&Go(ce(i),ce(e),n,s)),Jn(e)){const{activeInputs:a}=Be(e);Dc(e,a)}},yl=(i,t,e,n)=>{const[s,r]=Rp(i,e,n);s!==null&&(Yh(i,s),r&&!t&&!Yi(i)&&ce(i).disconnect(pr(e),n))},Dp=(i,t)=>{const e=Be(i),n=[];for(const s of e.outputs)Or(s)?xl(i,t,...s):yl(i,t,...s),n.push(s[0]);return e.outputs.clear(),n},Pp=(i,t,e)=>{const n=Be(i),s=[];for(const r of n.outputs)r[1]===e&&(Or(r)?xl(i,t,...r):yl(i,t,...r),s.push(r[0]),n.outputs.delete(r));return s},Ip=(i,t,e,n,s)=>{const r=Be(i);return Array.from(r.outputs).filter(o=>o[0]===e&&(n===void 0||o[1]===n)&&(s===void 0||o[2]===s)).map(o=>(Or(o)?xl(i,t,...o):yl(i,t,...o),r.outputs.delete(o),o[0]))},Np=(i,t,e,n,s,r,o,a,c,l,u,h,d,m,_,g)=>class extends l{constructor(f,y,x,T){super(x),this._context=f,this._nativeAudioNode=x;const w=u(f);h(w)&&e(Mu,()=>Mu(w,g))!==!0&&wp(x),_l.set(this,x),Vh.set(this,new Set),f.state!=="closed"&&y&&Os(this),i(this,T,x)}get channelCount(){return this._nativeAudioNode.channelCount}set channelCount(f){this._nativeAudioNode.channelCount=f}get channelCountMode(){return this._nativeAudioNode.channelCountMode}set channelCountMode(f){this._nativeAudioNode.channelCountMode=f}get channelInterpretation(){return this._nativeAudioNode.channelInterpretation}set channelInterpretation(f){this._nativeAudioNode.channelInterpretation=f}get context(){return this._context}get numberOfInputs(){return this._nativeAudioNode.numberOfInputs}get numberOfOutputs(){return this._nativeAudioNode.numberOfOutputs}connect(f,y=0,x=0){if(y<0||y>=this._nativeAudioNode.numberOfOutputs)throw s();const T=u(this._context),w=_(T);if(d(f)||m(f))throw r();if(Vo(f)){const C=ce(f);try{const v=zo(this._nativeAudioNode,C,y,x),R=bo(this);(w||R)&&this._nativeAudioNode.disconnect(...v),this.context.state!=="closed"&&!R&&bo(f)&&Os(f)}catch(v){throw v.code===12?r():v}if(t(this,f,y,x,w)){const v=c([this],f);ja(v,n(w))}return f}const E=pr(f);if(E.name==="playbackRate"&&E.maxValue===1024)throw o();try{this._nativeAudioNode.connect(E,y),(w||bo(this))&&this._nativeAudioNode.disconnect(E,y)}catch(C){throw C.code===12?r():C}if(Ap(this,f,y,w)){const C=c([this],f);ja(C,n(w))}}disconnect(f,y,x){let T;const w=u(this._context),E=_(w);if(f===void 0)T=Dp(this,E);else if(typeof f=="number"){if(f<0||f>=this.numberOfOutputs)throw s();T=Pp(this,E,f)}else{if(y!==void 0&&(y<0||y>=this.numberOfOutputs)||Vo(f)&&x!==void 0&&(x<0||x>=f.numberOfInputs))throw s();if(T=Ip(this,E,f,y,x),T.length===0)throw r()}for(const b of T){const C=c([this],b);ja(C,a)}}},Lp=(i,t,e,n,s,r,o,a,c,l,u,h,d)=>(m,_,g,p=null,f=null)=>{const y=g.value,x=new Wf(y),T=_?n(x):null,w={get defaultValue(){return y},get maxValue(){return p===null?g.maxValue:p},get minValue(){return f===null?g.minValue:f},get value(){return g.value},set value(E){g.value=E,w.setValueAtTime(E,m.context.currentTime)},cancelAndHoldAtTime(E){if(typeof g.cancelAndHoldAtTime=="function")T===null&&x.flush(m.context.currentTime),x.add(s(E)),g.cancelAndHoldAtTime(E);else{const b=Array.from(x).pop();T===null&&x.flush(m.context.currentTime),x.add(s(E));const C=Array.from(x).pop();g.cancelScheduledValues(E),b!==C&&C!==void 0&&(C.type==="exponentialRampToValue"?g.exponentialRampToValueAtTime(C.value,C.endTime):C.type==="linearRampToValue"?g.linearRampToValueAtTime(C.value,C.endTime):C.type==="setValue"?g.setValueAtTime(C.value,C.startTime):C.type==="setValueCurve"&&g.setValueCurveAtTime(C.values,C.startTime,C.duration))}return w},cancelScheduledValues(E){return T===null&&x.flush(m.context.currentTime),x.add(r(E)),g.cancelScheduledValues(E),w},exponentialRampToValueAtTime(E,b){if(E===0)throw new RangeError;if(!Number.isFinite(b)||b<0)throw new RangeError;const C=m.context.currentTime;return T===null&&x.flush(C),Array.from(x).length===0&&(x.add(l(y,C)),g.setValueAtTime(y,C)),x.add(o(E,b)),g.exponentialRampToValueAtTime(E,b),w},linearRampToValueAtTime(E,b){const C=m.context.currentTime;return T===null&&x.flush(C),Array.from(x).length===0&&(x.add(l(y,C)),g.setValueAtTime(y,C)),x.add(a(E,b)),g.linearRampToValueAtTime(E,b),w},setTargetAtTime(E,b,C){return T===null&&x.flush(m.context.currentTime),x.add(c(E,b,C)),g.setTargetAtTime(E,b,C),w},setValueAtTime(E,b){return T===null&&x.flush(m.context.currentTime),x.add(l(E,b)),g.setValueAtTime(E,b),w},setValueCurveAtTime(E,b,C){const S=E instanceof Float32Array?E:new Float32Array(E);if(h!==null&&h.name==="webkitAudioContext"){const v=b+C,R=m.context.sampleRate,P=Math.ceil(b*R),N=Math.floor(v*R),F=N-P,z=new Float32Array(F);for(let B=0;B<F;B+=1){const V=(S.length-1)/C*((P+B)/R-b),j=Math.floor(V),J=Math.ceil(V);z[B]=j===J?S[j]:(1-(V-j))*S[j]+(1-(J-V))*S[J]}T===null&&x.flush(m.context.currentTime),x.add(u(z,b,C)),g.setValueCurveAtTime(z,b,C);const U=N/R;U<v&&d(w,z[z.length-1],U),d(w,S[S.length-1],v)}else T===null&&x.flush(m.context.currentTime),x.add(u(S,b,C)),g.setValueCurveAtTime(S,b,C);return w}};return e.set(w,g),t.set(w,m),i(w,T),w},Op=i=>({replay(t){for(const e of i)if(e.type==="exponentialRampToValue"){const{endTime:n,value:s}=e;t.exponentialRampToValueAtTime(s,n)}else if(e.type==="linearRampToValue"){const{endTime:n,value:s}=e;t.linearRampToValueAtTime(s,n)}else if(e.type==="setTarget"){const{startTime:n,target:s,timeConstant:r}=e;t.setTargetAtTime(s,n,r)}else if(e.type==="setValue"){const{startTime:n,value:s}=e;t.setValueAtTime(s,n)}else if(e.type==="setValueCurve"){const{duration:n,startTime:s,values:r}=e;t.setValueCurveAtTime(r,s,n)}else throw new Error("Can't apply an unknown automation.")}});class $h{constructor(t){this._map=new Map(t)}get size(){return this._map.size}entries(){return this._map.entries()}forEach(t,e=null){return this._map.forEach((n,s)=>t.call(e,n,s,this))}get(t){return this._map.get(t)}has(t){return this._map.has(t)}keys(){return this._map.keys()}values(){return this._map.values()}}const Up={channelCount:2,channelCountMode:"explicit",channelInterpretation:"speakers",numberOfInputs:1,numberOfOutputs:1,parameterData:{},processorOptions:{}},Fp=(i,t,e,n,s,r,o,a,c,l,u,h,d,m)=>class extends t{constructor(g,p,f){var y;const x=a(g),T=c(x),w=u({...Up,...f});d(w);const E=Cc.get(x),b=E==null?void 0:E.get(p),C=T||x.state!=="closed"?x:(y=o(x))!==null&&y!==void 0?y:x,S=s(C,T?null:g.baseLatency,l,p,b,w),v=T?n(p,w,b):null;super(g,!0,S,v);const R=[];S.parameters.forEach((N,F)=>{const z=e(this,T,N);R.push([F,z])}),this._nativeAudioWorkletNode=S,this._onprocessorerror=null,this._parameters=new $h(R),T&&i(x,this);const{activeInputs:P}=r(this);h(S,P)}get onprocessorerror(){return this._onprocessorerror}set onprocessorerror(g){const p=typeof g=="function"?m(this,g):null;this._nativeAudioWorkletNode.onprocessorerror=p;const f=this._nativeAudioWorkletNode.onprocessorerror;this._onprocessorerror=f!==null&&f===p?g:f}get parameters(){return this._parameters===null?this._nativeAudioWorkletNode.parameters:this._parameters}get port(){return this._nativeAudioWorkletNode.port}};function Wo(i,t,e,n,s){if(typeof i.copyFromChannel=="function")t[e].byteLength===0&&(t[e]=new Float32Array(128)),i.copyFromChannel(t[e],n,s);else{const r=i.getChannelData(n);if(t[e].byteLength===0)t[e]=r.slice(s,s+128);else{const o=new Float32Array(r.buffer,s*Float32Array.BYTES_PER_ELEMENT,128);t[e].set(o)}}}const Zh=(i,t,e,n,s)=>{typeof i.copyToChannel=="function"?t[e].byteLength!==0&&i.copyToChannel(t[e],n,s):t[e].byteLength!==0&&i.getChannelData(n).set(t[e],s)},qo=(i,t)=>{const e=[];for(let n=0;n<i;n+=1){const s=[],r=typeof t=="number"?t:t[n];for(let o=0;o<r;o+=1)s.push(new Float32Array(128));e.push(s)}return e},kp=(i,t)=>{const e=xn(Rc,i),n=ce(t);return xn(e,n)},Bp=async(i,t,e,n,s,r,o)=>{const a=t===null?Math.ceil(i.context.length/128)*128:t.length,c=n.channelCount*n.numberOfInputs,l=s.reduce((p,f)=>p+f,0),u=l===0?null:e.createBuffer(l,a,e.sampleRate);if(r===void 0)throw new Error("Missing the processor constructor.");const h=Be(i),d=await kp(e,i),m=qo(n.numberOfInputs,n.channelCount),_=qo(n.numberOfOutputs,s),g=Array.from(i.parameters.keys()).reduce((p,f)=>({...p,[f]:new Float32Array(128)}),{});for(let p=0;p<a;p+=128){if(n.numberOfInputs>0&&t!==null)for(let f=0;f<n.numberOfInputs;f+=1)for(let y=0;y<n.channelCount;y+=1)Wo(t,m[f],y,y,p);r.parameterDescriptors!==void 0&&t!==null&&r.parameterDescriptors.forEach(({name:f},y)=>{Wo(t,g,f,c+y,p)});for(let f=0;f<n.numberOfInputs;f+=1)for(let y=0;y<s[f];y+=1)_[f][y].byteLength===0&&(_[f][y]=new Float32Array(128));try{const f=m.map((x,T)=>h.activeInputs[T].size===0?[]:x),y=o(p/e.sampleRate,e.sampleRate,()=>d.process(f,_,g));if(u!==null)for(let x=0,T=0;x<n.numberOfOutputs;x+=1){for(let w=0;w<s[x];w+=1)Zh(u,_[x],w,T+w,p);T+=s[x]}if(!y)break}catch(f){i.dispatchEvent(new ErrorEvent("processorerror",{colno:f.colno,filename:f.filename,lineno:f.lineno,message:f.message}));break}}return u},Vp=(i,t,e,n,s,r,o,a,c,l,u,h,d,m,_,g)=>(p,f,y)=>{const x=new WeakMap;let T=null;const w=async(E,b)=>{let C=u(E),S=null;const v=Ue(C,b),R=Array.isArray(f.outputChannelCount)?f.outputChannelCount:Array.from(f.outputChannelCount);if(h===null){const P=R.reduce((U,B)=>U+B,0),N=s(b,{channelCount:Math.max(1,P),channelCountMode:"explicit",channelInterpretation:"discrete",numberOfOutputs:Math.max(1,P)}),F=[];for(let U=0;U<E.numberOfOutputs;U+=1)F.push(n(b,{channelCount:1,channelCountMode:"explicit",channelInterpretation:"speakers",numberOfInputs:R[U]}));const z=o(b,{channelCount:f.channelCount,channelCountMode:f.channelCountMode,channelInterpretation:f.channelInterpretation,gain:1});z.connect=t.bind(null,F),z.disconnect=c.bind(null,F),S=[N,F,z]}else v||(C=new h(b,p));if(x.set(b,S===null?C:S[2]),S!==null){if(T===null){if(y===void 0)throw new Error("Missing the processor constructor.");if(d===null)throw new Error("Missing the native OfflineAudioContext constructor.");const B=E.channelCount*E.numberOfInputs,V=y.parameterDescriptors===void 0?0:y.parameterDescriptors.length,j=B+V;T=Bp(E,j===0?null:await(async()=>{const nt=new d(j,Math.ceil(E.context.length/128)*128,b.sampleRate),xt=[],Ot=[];for(let ot=0;ot<f.numberOfInputs;ot+=1)xt.push(o(nt,{channelCount:f.channelCount,channelCountMode:f.channelCountMode,channelInterpretation:f.channelInterpretation,gain:1})),Ot.push(s(nt,{channelCount:f.channelCount,channelCountMode:"explicit",channelInterpretation:"discrete",numberOfOutputs:f.channelCount}));const X=await Promise.all(Array.from(E.parameters.values()).map(async ot=>{const ut=r(nt,{channelCount:1,channelCountMode:"explicit",channelInterpretation:"discrete",offset:ot.value});return await m(nt,ot,ut.offset),ut})),Y=n(nt,{channelCount:1,channelCountMode:"explicit",channelInterpretation:"speakers",numberOfInputs:Math.max(1,B+V)});for(let ot=0;ot<f.numberOfInputs;ot+=1){xt[ot].connect(Ot[ot]);for(let ut=0;ut<f.channelCount;ut+=1)Ot[ot].connect(Y,ut,ot*f.channelCount+ut)}for(const[ot,ut]of X.entries())ut.connect(Y,0,B+ot),ut.start(0);return Y.connect(nt.destination),await Promise.all(xt.map(ot=>_(E,nt,ot))),g(nt)})(),b,f,R,y,l)}const P=await T,N=e(b,{buffer:null,channelCount:2,channelCountMode:"max",channelInterpretation:"speakers",loop:!1,loopEnd:0,loopStart:0,playbackRate:1}),[F,z,U]=S;P!==null&&(N.buffer=P,N.start(0)),N.connect(F);for(let B=0,V=0;B<E.numberOfOutputs;B+=1){const j=z[B];for(let J=0;J<R[B];J+=1)F.connect(j,V+J,J);V+=R[B]}return U}if(v)for(const[P,N]of E.parameters.entries())await i(b,N,C.parameters.get(P));else for(const[P,N]of E.parameters.entries())await m(b,N,C.parameters.get(P));return await _(E,b,C),C};return{render(E,b){a(b,E);const C=x.get(b);return C!==void 0?Promise.resolve(C):w(E,b)}}},zp=(i,t,e,n,s,r,o,a,c,l,u,h,d,m,_,g,p,f,y,x)=>class extends _{constructor(w,E){super(w,E),this._nativeContext=w,this._audioWorklet=i===void 0?void 0:{addModule:(b,C)=>i(this,b,C)}}get audioWorklet(){return this._audioWorklet}createAnalyser(){return new t(this)}createBiquadFilter(){return new s(this)}createBuffer(w,E,b){return new e({length:E,numberOfChannels:w,sampleRate:b})}createBufferSource(){return new n(this)}createChannelMerger(w=6){return new r(this,{numberOfInputs:w})}createChannelSplitter(w=6){return new o(this,{numberOfOutputs:w})}createConstantSource(){return new a(this)}createConvolver(){return new c(this)}createDelay(w=1){return new u(this,{maxDelayTime:w})}createDynamicsCompressor(){return new h(this)}createGain(){return new d(this)}createIIRFilter(w,E){return new m(this,{feedback:E,feedforward:w})}createOscillator(){return new g(this)}createPanner(){return new p(this)}createPeriodicWave(w,E,b={disableNormalization:!1}){return new f(this,{...b,imag:E,real:w})}createStereoPanner(){return new y(this)}createWaveShaper(){return new x(this)}decodeAudioData(w,E,b){return l(this._nativeContext,w).then(C=>(typeof E=="function"&&E(C),C),C=>{throw typeof b=="function"&&b(C),C})}},Gp={Q:1,channelCount:2,channelCountMode:"max",channelInterpretation:"speakers",detune:0,frequency:350,gain:0,type:"lowpass"},Hp=(i,t,e,n,s,r,o,a)=>class extends i{constructor(l,u){const h=r(l),d={...Gp,...u},m=s(h,d),_=o(h),g=_?e():null;super(l,!1,m,g),this._Q=t(this,_,m.Q,ke,He),this._detune=t(this,_,m.detune,1200*Math.log2(ke),-1200*Math.log2(ke)),this._frequency=t(this,_,m.frequency,l.sampleRate/2,0),this._gain=t(this,_,m.gain,40*Math.log10(ke),He),this._nativeBiquadFilterNode=m,a(this,1)}get detune(){return this._detune}get frequency(){return this._frequency}get gain(){return this._gain}get Q(){return this._Q}get type(){return this._nativeBiquadFilterNode.type}set type(l){this._nativeBiquadFilterNode.type=l}getFrequencyResponse(l,u,h){try{this._nativeBiquadFilterNode.getFrequencyResponse(l,u,h)}catch(d){throw d.code===11?n():d}if(l.length!==u.length||u.length!==h.length)throw n()}},Wp=(i,t,e,n,s)=>()=>{const r=new WeakMap,o=async(a,c)=>{let l=e(a);const u=Ue(l,c);if(!u){const h={Q:l.Q.value,channelCount:l.channelCount,channelCountMode:l.channelCountMode,channelInterpretation:l.channelInterpretation,detune:l.detune.value,frequency:l.frequency.value,gain:l.gain.value,type:l.type};l=t(c,h)}return r.set(c,l),u?(await i(c,a.Q,l.Q),await i(c,a.detune,l.detune),await i(c,a.frequency,l.frequency),await i(c,a.gain,l.gain)):(await n(c,a.Q,l.Q),await n(c,a.detune,l.detune),await n(c,a.frequency,l.frequency),await n(c,a.gain,l.gain)),await s(a,c,l),l};return{render(a,c){const l=r.get(c);return l!==void 0?Promise.resolve(l):o(a,c)}}},qp=(i,t)=>(e,n)=>{const s=t.get(e);if(s!==void 0)return s;const r=i.get(e);if(r!==void 0)return r;try{const o=n();return o instanceof Promise?(i.set(e,o),o.catch(()=>!1).then(a=>(i.delete(e),t.set(e,a),a))):(t.set(e,o),o)}catch{return t.set(e,!1),!1}},Xp={channelCount:1,channelCountMode:"explicit",channelInterpretation:"speakers",numberOfInputs:6},Yp=(i,t,e,n,s)=>class extends i{constructor(o,a){const c=n(o),l={...Xp,...a},u=e(c,l),h=s(c)?t():null;super(o,!1,u,h)}},jp=(i,t,e)=>()=>{const n=new WeakMap,s=async(r,o)=>{let a=t(r);if(!Ue(a,o)){const l={channelCount:a.channelCount,channelCountMode:a.channelCountMode,channelInterpretation:a.channelInterpretation,numberOfInputs:a.numberOfInputs};a=i(o,l)}return n.set(o,a),await e(r,o,a),a};return{render(r,o){const a=n.get(o);return a!==void 0?Promise.resolve(a):s(r,o)}}},$p={channelCount:6,channelCountMode:"explicit",channelInterpretation:"discrete",numberOfOutputs:6},Zp=(i,t,e,n,s,r)=>class extends i{constructor(a,c){const l=n(a),u=r({...$p,...c}),h=e(l,u),d=s(l)?t():null;super(a,!1,h,d)}},Kp=(i,t,e)=>()=>{const n=new WeakMap,s=async(r,o)=>{let a=t(r);if(!Ue(a,o)){const l={channelCount:a.channelCount,channelCountMode:a.channelCountMode,channelInterpretation:a.channelInterpretation,numberOfOutputs:a.numberOfOutputs};a=i(o,l)}return n.set(o,a),await e(r,o,a),a};return{render(r,o){const a=n.get(o);return a!==void 0?Promise.resolve(a):s(r,o)}}},Jp=i=>(t,e,n)=>i(e,t,n),Qp=i=>(t,e,n=0,s=0)=>{const r=t[n];if(r===void 0)throw i();return Ho(e)?r.connect(e,0,s):r.connect(e,0)},tm=i=>(t,e)=>{const n=i(t,{buffer:null,channelCount:2,channelCountMode:"max",channelInterpretation:"speakers",loop:!1,loopEnd:0,loopStart:0,playbackRate:1}),s=t.createBuffer(1,2,44100);return n.buffer=s,n.loop=!0,n.connect(e),n.start(),()=>{n.stop(),n.disconnect(e)}},em={channelCount:2,channelCountMode:"max",channelInterpretation:"speakers",offset:1},nm=(i,t,e,n,s,r,o)=>class extends i{constructor(c,l){const u=s(c),h={...em,...l},d=n(u,h),m=r(u),_=m?e():null;super(c,!1,d,_),this._constantSourceNodeRenderer=_,this._nativeConstantSourceNode=d,this._offset=t(this,m,d.offset,ke,He),this._onended=null}get offset(){return this._offset}get onended(){return this._onended}set onended(c){const l=typeof c=="function"?o(this,c):null;this._nativeConstantSourceNode.onended=l;const u=this._nativeConstantSourceNode.onended;this._onended=u!==null&&u===l?c:u}start(c=0){if(this._nativeConstantSourceNode.start(c),this._constantSourceNodeRenderer!==null&&(this._constantSourceNodeRenderer.start=c),this.context.state!=="closed"){Os(this);const l=()=>{this._nativeConstantSourceNode.removeEventListener("ended",l),Jn(this)&&Nr(this)};this._nativeConstantSourceNode.addEventListener("ended",l)}}stop(c=0){this._nativeConstantSourceNode.stop(c),this._constantSourceNodeRenderer!==null&&(this._constantSourceNodeRenderer.stop=c)}},im=(i,t,e,n,s)=>()=>{const r=new WeakMap;let o=null,a=null;const c=async(l,u)=>{let h=e(l);const d=Ue(h,u);if(!d){const m={channelCount:h.channelCount,channelCountMode:h.channelCountMode,channelInterpretation:h.channelInterpretation,offset:h.offset.value};h=t(u,m),o!==null&&h.start(o),a!==null&&h.stop(a)}return r.set(u,h),d?await i(u,l.offset,h.offset):await n(u,l.offset,h.offset),await s(l,u,h),h};return{set start(l){o=l},set stop(l){a=l},render(l,u){const h=r.get(u);return h!==void 0?Promise.resolve(h):c(l,u)}}},sm=i=>t=>(i[0]=t,i[0]),rm={buffer:null,channelCount:2,channelCountMode:"clamped-max",channelInterpretation:"speakers",disableNormalization:!1},om=(i,t,e,n,s,r)=>class extends i{constructor(a,c){const l=n(a),u={...rm,...c},h=e(l,u),m=s(l)?t():null;super(a,!1,h,m),this._isBufferNullified=!1,this._nativeConvolverNode=h,u.buffer!==null&&r(this,u.buffer.duration)}get buffer(){return this._isBufferNullified?null:this._nativeConvolverNode.buffer}set buffer(a){if(this._nativeConvolverNode.buffer=a,a===null&&this._nativeConvolverNode.buffer!==null){const c=this._nativeConvolverNode.context;this._nativeConvolverNode.buffer=c.createBuffer(1,1,c.sampleRate),this._isBufferNullified=!0,r(this,0)}else this._isBufferNullified=!1,r(this,this._nativeConvolverNode.buffer===null?0:this._nativeConvolverNode.buffer.duration)}get normalize(){return this._nativeConvolverNode.normalize}set normalize(a){this._nativeConvolverNode.normalize=a}},am=(i,t,e)=>()=>{const n=new WeakMap,s=async(r,o)=>{let a=t(r);if(!Ue(a,o)){const l={buffer:a.buffer,channelCount:a.channelCount,channelCountMode:a.channelCountMode,channelInterpretation:a.channelInterpretation,disableNormalization:!a.normalize};a=i(o,l)}return n.set(o,a),$s(a)?await e(r,o,a.inputs[0]):await e(r,o,a),a};return{render(r,o){const a=n.get(o);return a!==void 0?Promise.resolve(a):s(r,o)}}},cm=(i,t)=>(e,n,s)=>{if(t===null)throw new Error("Missing the native OfflineAudioContext constructor.");try{return new t(e,n,s)}catch(r){throw r.name==="SyntaxError"?i():r}},lm=()=>new DOMException("","DataCloneError"),Tu=i=>{const{port1:t,port2:e}=new MessageChannel;return new Promise(n=>{const s=()=>{e.onmessage=null,t.close(),e.close(),n()};e.onmessage=()=>s();try{t.postMessage(i,[i])}catch{}finally{s()}})},um=(i,t,e,n,s,r,o,a,c,l,u)=>(h,d)=>{const m=o(h)?h:r(h);if(s.has(d)){const _=e();return Promise.reject(_)}try{s.add(d)}catch{}return t(c,()=>c(m))?m.decodeAudioData(d).then(_=>(Tu(d).catch(()=>{}),t(a,()=>a(_))||u(_),i.add(_),_)):new Promise((_,g)=>{const p=async()=>{try{await Tu(d)}catch{}},f=y=>{g(y),p()};try{m.decodeAudioData(d,y=>{typeof y.copyFromChannel!="function"&&(l(y),vl(y)),i.add(y),p().then(()=>_(y))},y=>{f(y===null?n():y)})}catch(y){f(y)}})},hm=(i,t,e,n,s,r,o,a)=>(c,l)=>{const u=t.get(c);if(u===void 0)throw new Error("Missing the expected cycle count.");const h=r(c.context),d=a(h);if(u===l){if(t.delete(c),!d&&o(c)){const m=n(c),{outputs:_}=e(c);for(const g of _)if(Or(g)){const p=n(g[0]);i(m,p,g[1],g[2])}else{const p=s(g[0]);m.connect(p,g[1])}}}else t.set(c,u-l)},dm={channelCount:2,channelCountMode:"max",channelInterpretation:"speakers",delayTime:0,maxDelayTime:1},fm=(i,t,e,n,s,r,o)=>class extends i{constructor(c,l){const u=s(c),h={...dm,...l},d=n(u,h),m=r(u),_=m?e(h.maxDelayTime):null;super(c,!1,d,_),this._delayTime=t(this,m,d.delayTime),o(this,h.maxDelayTime)}get delayTime(){return this._delayTime}},pm=(i,t,e,n,s)=>r=>{const o=new WeakMap,a=async(c,l)=>{let u=e(c);const h=Ue(u,l);if(!h){const d={channelCount:u.channelCount,channelCountMode:u.channelCountMode,channelInterpretation:u.channelInterpretation,delayTime:u.delayTime.value,maxDelayTime:r};u=t(l,d)}return o.set(l,u),h?await i(l,c.delayTime,u.delayTime):await n(l,c.delayTime,u.delayTime),await s(c,l,u),u};return{render(c,l){const u=o.get(l);return u!==void 0?Promise.resolve(u):a(c,l)}}},mm=i=>(t,e,n,s)=>i(t[s],r=>r[0]===e&&r[1]===n),_m=i=>(t,e)=>{i(t).delete(e)},gm=i=>"delayTime"in i,vm=(i,t,e)=>function n(s,r){const o=Vo(r)?r:e(i,r);if(gm(o))return[];if(s[0]===o)return[s];if(s.includes(o))return[];const{outputs:a}=t(o);return Array.from(a).map(c=>n([...s,o],c[0])).reduce((c,l)=>c.concat(l),[])},Zr=(i,t,e)=>{const n=t[e];if(n===void 0)throw i();return n},xm=i=>(t,e=void 0,n=void 0,s=0)=>e===void 0?t.forEach(r=>r.disconnect()):typeof e=="number"?Zr(i,t,e).disconnect():Ho(e)?n===void 0?t.forEach(r=>r.disconnect(e)):s===void 0?Zr(i,t,n).disconnect(e,0):Zr(i,t,n).disconnect(e,0,s):n===void 0?t.forEach(r=>r.disconnect(e)):Zr(i,t,n).disconnect(e,0),ym={attack:.003,channelCount:2,channelCountMode:"clamped-max",channelInterpretation:"speakers",knee:30,ratio:12,release:.25,threshold:-24},Sm=(i,t,e,n,s,r,o,a)=>class extends i{constructor(l,u){const h=r(l),d={...ym,...u},m=n(h,d),_=o(h),g=_?e():null;super(l,!1,m,g),this._attack=t(this,_,m.attack),this._knee=t(this,_,m.knee),this._nativeDynamicsCompressorNode=m,this._ratio=t(this,_,m.ratio),this._release=t(this,_,m.release),this._threshold=t(this,_,m.threshold),a(this,.006)}get attack(){return this._attack}get channelCount(){return this._nativeDynamicsCompressorNode.channelCount}set channelCount(l){const u=this._nativeDynamicsCompressorNode.channelCount;if(this._nativeDynamicsCompressorNode.channelCount=l,l>2)throw this._nativeDynamicsCompressorNode.channelCount=u,s()}get channelCountMode(){return this._nativeDynamicsCompressorNode.channelCountMode}set channelCountMode(l){const u=this._nativeDynamicsCompressorNode.channelCountMode;if(this._nativeDynamicsCompressorNode.channelCountMode=l,l==="max")throw this._nativeDynamicsCompressorNode.channelCountMode=u,s()}get knee(){return this._knee}get ratio(){return this._ratio}get reduction(){return typeof this._nativeDynamicsCompressorNode.reduction.value=="number"?this._nativeDynamicsCompressorNode.reduction.value:this._nativeDynamicsCompressorNode.reduction}get release(){return this._release}get threshold(){return this._threshold}},Mm=(i,t,e,n,s)=>()=>{const r=new WeakMap,o=async(a,c)=>{let l=e(a);const u=Ue(l,c);if(!u){const h={attack:l.attack.value,channelCount:l.channelCount,channelCountMode:l.channelCountMode,channelInterpretation:l.channelInterpretation,knee:l.knee.value,ratio:l.ratio.value,release:l.release.value,threshold:l.threshold.value};l=t(c,h)}return r.set(c,l),u?(await i(c,a.attack,l.attack),await i(c,a.knee,l.knee),await i(c,a.ratio,l.ratio),await i(c,a.release,l.release),await i(c,a.threshold,l.threshold)):(await n(c,a.attack,l.attack),await n(c,a.knee,l.knee),await n(c,a.ratio,l.ratio),await n(c,a.release,l.release),await n(c,a.threshold,l.threshold)),await s(a,c,l),l};return{render(a,c){const l=r.get(c);return l!==void 0?Promise.resolve(l):o(a,c)}}},Tm=()=>new DOMException("","EncodingError"),Em=i=>t=>new Promise((e,n)=>{if(i===null){n(new SyntaxError);return}const s=i.document.head;if(s===null)n(new SyntaxError);else{const r=i.document.createElement("script"),o=new Blob([t],{type:"application/javascript"}),a=URL.createObjectURL(o),c=i.onerror,l=()=>{i.onerror=c,URL.revokeObjectURL(a)};i.onerror=(u,h,d,m,_)=>{if(h===a||h===i.location.href&&d===1&&m===1)return l(),n(_),!1;if(c!==null)return c(u,h,d,m,_)},r.onerror=()=>{l(),n(new SyntaxError)},r.onload=()=>{l(),e()},r.src=a,r.type="module",s.appendChild(r)}}),bm=i=>class{constructor(e){this._nativeEventTarget=e,this._listeners=new WeakMap}addEventListener(e,n,s){if(n!==null){let r=this._listeners.get(n);r===void 0&&(r=i(this,n),typeof n=="function"&&this._listeners.set(n,r)),this._nativeEventTarget.addEventListener(e,r,s)}}dispatchEvent(e){return this._nativeEventTarget.dispatchEvent(e)}removeEventListener(e,n,s){const r=n===null?void 0:this._listeners.get(n);this._nativeEventTarget.removeEventListener(e,r===void 0?null:r,s)}},wm=i=>(t,e,n)=>{Object.defineProperties(i,{currentFrame:{configurable:!0,get(){return Math.round(t*e)}},currentTime:{configurable:!0,get(){return t}}});try{return n()}finally{i!==null&&(delete i.currentFrame,delete i.currentTime)}},Am=i=>async t=>{try{const e=await fetch(t);if(e.ok)return[await e.text(),e.url]}catch{}throw i()},Cm={channelCount:2,channelCountMode:"max",channelInterpretation:"speakers",gain:1},Rm=(i,t,e,n,s,r)=>class extends i{constructor(a,c){const l=s(a),u={...Cm,...c},h=n(l,u),d=r(l),m=d?e():null;super(a,!1,h,m),this._gain=t(this,d,h.gain,ke,He)}get gain(){return this._gain}},Dm=(i,t,e,n,s)=>()=>{const r=new WeakMap,o=async(a,c)=>{let l=e(a);const u=Ue(l,c);if(!u){const h={channelCount:l.channelCount,channelCountMode:l.channelCountMode,channelInterpretation:l.channelInterpretation,gain:l.gain.value};l=t(c,h)}return r.set(c,l),u?await i(c,a.gain,l.gain):await n(c,a.gain,l.gain),await s(a,c,l),l};return{render(a,c){const l=r.get(c);return l!==void 0?Promise.resolve(l):o(a,c)}}},Pm=(i,t)=>e=>t(i,e),Im=i=>t=>{const e=i(t);if(e.renderer===null)throw new Error("Missing the renderer of the given AudioNode in the audio graph.");return e.renderer},Nm=i=>t=>{var e;return(e=i.get(t))!==null&&e!==void 0?e:0},Lm=i=>t=>{const e=i(t);if(e.renderer===null)throw new Error("Missing the renderer of the given AudioParam in the audio graph.");return e.renderer},Om=i=>t=>i.get(t),Ce=()=>new DOMException("","InvalidStateError"),Um=i=>t=>{const e=i.get(t);if(e===void 0)throw Ce();return e},Fm=(i,t)=>e=>{let n=i.get(e);if(n!==void 0)return n;if(t===null)throw new Error("Missing the native OfflineAudioContext constructor.");return n=new t(1,1,44100),i.set(e,n),n},km=i=>t=>{const e=i.get(t);if(e===void 0)throw new Error("The context has no set of AudioWorkletNodes.");return e},Ea=()=>new DOMException("","InvalidAccessError"),Bm=i=>{i.getFrequencyResponse=(t=>(e,n,s)=>{if(e.length!==n.length||n.length!==s.length)throw Ea();return t.call(i,e,n,s)})(i.getFrequencyResponse)},Vm={channelCount:2,channelCountMode:"max",channelInterpretation:"speakers"},zm=(i,t,e,n,s,r)=>class extends i{constructor(a,c){const l=n(a),u=s(l),h={...Vm,...c},d=t(l,u?null:a.baseLatency,h),m=u?e(h.feedback,h.feedforward):null;super(a,!1,d,m),Bm(d),this._nativeIIRFilterNode=d,r(this,1)}getFrequencyResponse(a,c,l){return this._nativeIIRFilterNode.getFrequencyResponse(a,c,l)}},Kh=(i,t,e,n,s,r,o,a,c,l,u)=>{const h=l.length;let d=a;for(let m=0;m<h;m+=1){let _=e[0]*l[m];for(let g=1;g<s;g+=1){const p=d-g&c-1;_+=e[g]*r[p],_-=i[g]*o[p]}for(let g=s;g<n;g+=1)_+=e[g]*r[d-g&c-1];for(let g=s;g<t;g+=1)_-=i[g]*o[d-g&c-1];r[d]=l[m],o[d]=_,d=d+1&c-1,u[m]=_}return d},Gm=(i,t,e,n)=>{const s=e instanceof Float64Array?e:new Float64Array(e),r=n instanceof Float64Array?n:new Float64Array(n),o=s.length,a=r.length,c=Math.min(o,a);if(s[0]!==1){for(let _=0;_<o;_+=1)r[_]/=s[0];for(let _=1;_<a;_+=1)s[_]/=s[0]}const l=32,u=new Float32Array(l),h=new Float32Array(l),d=t.createBuffer(i.numberOfChannels,i.length,i.sampleRate),m=i.numberOfChannels;for(let _=0;_<m;_+=1){const g=i.getChannelData(_),p=d.getChannelData(_);u.fill(0),h.fill(0),Kh(s,o,r,a,c,u,h,0,l,g,p)}return d},Hm=(i,t,e,n,s)=>(r,o)=>{const a=new WeakMap;let c=null;const l=async(u,h)=>{let d=null,m=t(u);const _=Ue(m,h);if(h.createIIRFilter===void 0?d=i(h,{buffer:null,channelCount:2,channelCountMode:"max",channelInterpretation:"speakers",loop:!1,loopEnd:0,loopStart:0,playbackRate:1}):_||(m=h.createIIRFilter(o,r)),a.set(h,d===null?m:d),d!==null){if(c===null){if(e===null)throw new Error("Missing the native OfflineAudioContext constructor.");const p=new e(u.context.destination.channelCount,u.context.length,h.sampleRate);c=(async()=>{await n(u,p,p.destination);const f=await s(p);return Gm(f,h,r,o)})()}const g=await c;return d.buffer=g,d.start(0),d}return await n(u,h,m),m};return{render(u,h){const d=a.get(h);return d!==void 0?Promise.resolve(d):l(u,h)}}},Wm=(i,t,e,n,s,r)=>o=>(a,c)=>{const l=i.get(a);if(l===void 0){if(!o&&r(a)){const u=n(a),{outputs:h}=e(a);for(const d of h)if(Or(d)){const m=n(d[0]);t(u,m,d[1],d[2])}else{const m=s(d[0]);u.disconnect(m,d[1])}}i.set(a,c)}else i.set(a,l+c)},qm=(i,t)=>e=>{const n=i.get(e);return t(n)||t(e)},Xm=(i,t)=>e=>i.has(e)||t(e),Ym=(i,t)=>e=>i.has(e)||t(e),jm=(i,t)=>e=>{const n=i.get(e);return t(n)||t(e)},$m=i=>t=>i!==null&&t instanceof i,Zm=i=>t=>i!==null&&typeof i.AudioNode=="function"&&t instanceof i.AudioNode,Km=i=>t=>i!==null&&typeof i.AudioParam=="function"&&t instanceof i.AudioParam,Jm=(i,t)=>e=>i(e)||t(e),Qm=i=>t=>i!==null&&t instanceof i,t_=i=>i!==null&&i.isSecureContext,e_=(i,t,e,n)=>class extends i{constructor(r,o){const a=e(r),c=t(a,o);if(n(a))throw TypeError();super(r,!0,c,null),this._nativeMediaElementAudioSourceNode=c}get mediaElement(){return this._nativeMediaElementAudioSourceNode.mediaElement}},n_={channelCount:2,channelCountMode:"explicit",channelInterpretation:"speakers"},i_=(i,t,e,n)=>class extends i{constructor(r,o){const a=e(r);if(n(a))throw new TypeError;const c={...n_,...o},l=t(a,c);super(r,!1,l,null),this._nativeMediaStreamAudioDestinationNode=l}get stream(){return this._nativeMediaStreamAudioDestinationNode.stream}},s_=(i,t,e,n)=>class extends i{constructor(r,o){const a=e(r),c=t(a,o);if(n(a))throw new TypeError;super(r,!0,c,null),this._nativeMediaStreamAudioSourceNode=c}get mediaStream(){return this._nativeMediaStreamAudioSourceNode.mediaStream}},r_=(i,t,e)=>class extends i{constructor(s,r){const o=e(s),a=t(o,r);super(s,!0,a,null)}},o_=(i,t,e,n,s,r)=>class extends e{constructor(a,c){super(a),this._nativeContext=a,Ma.set(this,a),n(a)&&s.set(a,new Set),this._destination=new i(this,c),this._listener=t(this,a),this._onstatechange=null}get currentTime(){return this._nativeContext.currentTime}get destination(){return this._destination}get listener(){return this._listener}get onstatechange(){return this._onstatechange}set onstatechange(a){const c=typeof a=="function"?r(this,a):null;this._nativeContext.onstatechange=c;const l=this._nativeContext.onstatechange;this._onstatechange=l!==null&&l===c?a:l}get sampleRate(){return this._nativeContext.sampleRate}get state(){return this._nativeContext.state}},mr=i=>{const t=new Uint32Array([1179011410,40,1163280727,544501094,16,131073,44100,176400,1048580,1635017060,4,0]);try{const e=i.decodeAudioData(t.buffer,()=>{});return e===void 0?!1:(e.catch(()=>{}),!0)}catch{}return!1},a_=(i,t)=>(e,n,s)=>{const r=new Set;return e.connect=(o=>(a,c=0,l=0)=>{const u=r.size===0;if(t(a))return o.call(e,a,c,l),i(r,[a,c,l],h=>h[0]===a&&h[1]===c&&h[2]===l,!0),u&&n(),a;o.call(e,a,c),i(r,[a,c],h=>h[0]===a&&h[1]===c,!0),u&&n()})(e.connect),e.disconnect=(o=>(a,c,l)=>{const u=r.size>0;if(a===void 0)o.apply(e),r.clear();else if(typeof a=="number"){o.call(e,a);for(const d of r)d[1]===a&&r.delete(d)}else{t(a)?o.call(e,a,c,l):o.call(e,a,c);for(const d of r)d[0]===a&&(c===void 0||d[1]===c)&&(l===void 0||d[2]===l)&&r.delete(d)}const h=r.size===0;u&&h&&s()})(e.disconnect),e},le=(i,t,e)=>{const n=t[e];n!==void 0&&n!==i[e]&&(i[e]=n)},Te=(i,t)=>{le(i,t,"channelCount"),le(i,t,"channelCountMode"),le(i,t,"channelInterpretation")},Eu=i=>typeof i.getFloatTimeDomainData=="function",c_=i=>{i.getFloatTimeDomainData=t=>{const e=new Uint8Array(t.length);i.getByteTimeDomainData(e);const n=Math.max(e.length,i.fftSize);for(let s=0;s<n;s+=1)t[s]=(e[s]-128)*.0078125;return t}},l_=(i,t)=>(e,n)=>{const s=e.createAnalyser();if(Te(s,n),!(n.maxDecibels>n.minDecibels))throw t();return le(s,n,"fftSize"),le(s,n,"maxDecibels"),le(s,n,"minDecibels"),le(s,n,"smoothingTimeConstant"),i(Eu,()=>Eu(s))||c_(s),s},u_=i=>i===null?null:i.hasOwnProperty("AudioBuffer")?i.AudioBuffer:null,me=(i,t,e)=>{const n=t[e];n!==void 0&&n!==i[e].value&&(i[e].value=n)},h_=i=>{i.start=(t=>{let e=!1;return(n=0,s=0,r)=>{if(e)throw Ce();t.call(i,n,s,r),e=!0}})(i.start)},Sl=i=>{i.start=(t=>(e=0,n=0,s)=>{if(typeof s=="number"&&s<0||n<0||e<0)throw new RangeError("The parameters can't be negative.");t.call(i,e,n,s)})(i.start)},Ml=i=>{i.stop=(t=>(e=0)=>{if(e<0)throw new RangeError("The parameter can't be negative.");t.call(i,e)})(i.stop)},d_=(i,t,e,n,s,r,o,a,c,l,u)=>(h,d)=>{const m=h.createBufferSource();return Te(m,d),me(m,d,"playbackRate"),le(m,d,"buffer"),le(m,d,"loop"),le(m,d,"loopEnd"),le(m,d,"loopStart"),t(e,()=>e(h))||h_(m),t(n,()=>n(h))||c(m),t(s,()=>s(h))||l(m,h),t(r,()=>r(h))||Sl(m),t(o,()=>o(h))||u(m,h),t(a,()=>a(h))||Ml(m),i(h,m),m},f_=i=>i===null?null:i.hasOwnProperty("AudioContext")?i.AudioContext:i.hasOwnProperty("webkitAudioContext")?i.webkitAudioContext:null,p_=(i,t)=>(e,n,s)=>{const r=e.destination;if(r.channelCount!==n)try{r.channelCount=n}catch{}s&&r.channelCountMode!=="explicit"&&(r.channelCountMode="explicit"),r.maxChannelCount===0&&Object.defineProperty(r,"maxChannelCount",{value:n});const o=i(e,{channelCount:n,channelCountMode:r.channelCountMode,channelInterpretation:r.channelInterpretation,gain:1});return t(o,"channelCount",a=>()=>a.call(o),a=>c=>{a.call(o,c);try{r.channelCount=c}catch(l){if(c>r.maxChannelCount)throw l}}),t(o,"channelCountMode",a=>()=>a.call(o),a=>c=>{a.call(o,c),r.channelCountMode=c}),t(o,"channelInterpretation",a=>()=>a.call(o),a=>c=>{a.call(o,c),r.channelInterpretation=c}),Object.defineProperty(o,"maxChannelCount",{get:()=>r.maxChannelCount}),o.connect(r),o},m_=i=>i===null?null:i.hasOwnProperty("AudioWorkletNode")?i.AudioWorkletNode:null,__=i=>{const{port1:t}=new MessageChannel;try{t.postMessage(i)}finally{t.close()}},g_=(i,t,e,n,s)=>(r,o,a,c,l,u)=>{if(a!==null)try{const h=new a(r,c,u),d=new Map;let m=null;if(Object.defineProperties(h,{channelCount:{get:()=>u.channelCount,set:()=>{throw i()}},channelCountMode:{get:()=>"explicit",set:()=>{throw i()}},onprocessorerror:{get:()=>m,set:_=>{typeof m=="function"&&h.removeEventListener("processorerror",m),m=typeof _=="function"?_:null,typeof m=="function"&&h.addEventListener("processorerror",m)}}}),h.addEventListener=(_=>(...g)=>{if(g[0]==="processorerror"){const p=typeof g[1]=="function"?g[1]:typeof g[1]=="object"&&g[1]!==null&&typeof g[1].handleEvent=="function"?g[1].handleEvent:null;if(p!==null){const f=d.get(g[1]);f!==void 0?g[1]=f:(g[1]=y=>{y.type==="error"?(Object.defineProperties(y,{type:{value:"processorerror"}}),p(y)):p(new ErrorEvent(g[0],{...y}))},d.set(p,g[1]))}}return _.call(h,"error",g[1],g[2]),_.call(h,...g)})(h.addEventListener),h.removeEventListener=(_=>(...g)=>{if(g[0]==="processorerror"){const p=d.get(g[1]);p!==void 0&&(d.delete(g[1]),g[1]=p)}return _.call(h,"error",g[1],g[2]),_.call(h,g[0],g[1],g[2])})(h.removeEventListener),u.numberOfOutputs!==0){const _=e(r,{channelCount:1,channelCountMode:"explicit",channelInterpretation:"discrete",gain:0});return h.connect(_).connect(r.destination),s(h,()=>_.disconnect(),()=>_.connect(r.destination))}return h}catch(h){throw h.code===11?n():h}if(l===void 0)throw n();return __(u),t(r,o,l,u)},Jh=(i,t)=>i===null?512:Math.max(512,Math.min(16384,Math.pow(2,Math.round(Math.log2(i*t))))),v_=i=>new Promise((t,e)=>{const{port1:n,port2:s}=new MessageChannel;n.onmessage=({data:r})=>{n.close(),s.close(),t(r)},n.onmessageerror=({data:r})=>{n.close(),s.close(),e(r)},s.postMessage(i)}),x_=async(i,t)=>{const e=await v_(t);return new i(e)},y_=(i,t,e,n)=>{let s=Rc.get(i);s===void 0&&(s=new WeakMap,Rc.set(i,s));const r=x_(e,n);return s.set(t,r),r},S_=(i,t,e,n,s,r,o,a,c,l,u,h,d)=>(m,_,g,p)=>{if(p.numberOfInputs===0&&p.numberOfOutputs===0)throw c();const f=Array.isArray(p.outputChannelCount)?p.outputChannelCount:Array.from(p.outputChannelCount);if(f.some(rt=>rt<1))throw c();if(f.length!==p.numberOfOutputs)throw t();if(p.channelCountMode!=="explicit")throw c();const y=p.channelCount*p.numberOfInputs,x=f.reduce((rt,it)=>rt+it,0),T=g.parameterDescriptors===void 0?0:g.parameterDescriptors.length;if(y+T>6||x>6)throw c();const w=new MessageChannel,E=[],b=[];for(let rt=0;rt<p.numberOfInputs;rt+=1)E.push(o(m,{channelCount:p.channelCount,channelCountMode:p.channelCountMode,channelInterpretation:p.channelInterpretation,gain:1})),b.push(s(m,{channelCount:p.channelCount,channelCountMode:"explicit",channelInterpretation:"discrete",numberOfOutputs:p.channelCount}));const C=[];if(g.parameterDescriptors!==void 0)for(const{defaultValue:rt,maxValue:it,minValue:Ut,name:_t}of g.parameterDescriptors){const ft=r(m,{channelCount:1,channelCountMode:"explicit",channelInterpretation:"discrete",offset:p.parameterData[_t]!==void 0?p.parameterData[_t]:rt===void 0?0:rt});Object.defineProperties(ft.offset,{defaultValue:{get:()=>rt===void 0?0:rt},maxValue:{get:()=>it===void 0?ke:it},minValue:{get:()=>Ut===void 0?He:Ut}}),C.push(ft)}const S=n(m,{channelCount:1,channelCountMode:"explicit",channelInterpretation:"speakers",numberOfInputs:Math.max(1,y+T)}),v=Jh(_,m.sampleRate),R=a(m,v,y+T,Math.max(1,x)),P=s(m,{channelCount:Math.max(1,x),channelCountMode:"explicit",channelInterpretation:"discrete",numberOfOutputs:Math.max(1,x)}),N=[];for(let rt=0;rt<p.numberOfOutputs;rt+=1)N.push(n(m,{channelCount:1,channelCountMode:"explicit",channelInterpretation:"speakers",numberOfInputs:f[rt]}));for(let rt=0;rt<p.numberOfInputs;rt+=1){E[rt].connect(b[rt]);for(let it=0;it<p.channelCount;it+=1)b[rt].connect(S,it,rt*p.channelCount+it)}const F=new $h(g.parameterDescriptors===void 0?[]:g.parameterDescriptors.map(({name:rt},it)=>{const Ut=C[it];return Ut.connect(S,0,y+it),Ut.start(0),[rt,Ut.offset]}));S.connect(R);let z=p.channelInterpretation,U=null;const B=p.numberOfOutputs===0?[R]:N,V={get bufferSize(){return v},get channelCount(){return p.channelCount},set channelCount(rt){throw e()},get channelCountMode(){return p.channelCountMode},set channelCountMode(rt){throw e()},get channelInterpretation(){return z},set channelInterpretation(rt){for(const it of E)it.channelInterpretation=rt;z=rt},get context(){return R.context},get inputs(){return E},get numberOfInputs(){return p.numberOfInputs},get numberOfOutputs(){return p.numberOfOutputs},get onprocessorerror(){return U},set onprocessorerror(rt){typeof U=="function"&&V.removeEventListener("processorerror",U),U=typeof rt=="function"?rt:null,typeof U=="function"&&V.addEventListener("processorerror",U)},get parameters(){return F},get port(){return w.port2},addEventListener(...rt){return R.addEventListener(rt[0],rt[1],rt[2])},connect:i.bind(null,B),disconnect:l.bind(null,B),dispatchEvent(...rt){return R.dispatchEvent(rt[0])},removeEventListener(...rt){return R.removeEventListener(rt[0],rt[1],rt[2])}},j=new Map;w.port1.addEventListener=(rt=>(...it)=>{if(it[0]==="message"){const Ut=typeof it[1]=="function"?it[1]:typeof it[1]=="object"&&it[1]!==null&&typeof it[1].handleEvent=="function"?it[1].handleEvent:null;if(Ut!==null){const _t=j.get(it[1]);_t!==void 0?it[1]=_t:(it[1]=ft=>{u(m.currentTime,m.sampleRate,()=>Ut(ft))},j.set(Ut,it[1]))}}return rt.call(w.port1,it[0],it[1],it[2])})(w.port1.addEventListener),w.port1.removeEventListener=(rt=>(...it)=>{if(it[0]==="message"){const Ut=j.get(it[1]);Ut!==void 0&&(j.delete(it[1]),it[1]=Ut)}return rt.call(w.port1,it[0],it[1],it[2])})(w.port1.removeEventListener);let J=null;Object.defineProperty(w.port1,"onmessage",{get:()=>J,set:rt=>{typeof J=="function"&&w.port1.removeEventListener("message",J),J=typeof rt=="function"?rt:null,typeof J=="function"&&(w.port1.addEventListener("message",J),w.port1.start())}}),g.prototype.port=w.port1;let nt=null;y_(m,V,g,p).then(rt=>nt=rt);const Ot=qo(p.numberOfInputs,p.channelCount),X=qo(p.numberOfOutputs,f),Y=g.parameterDescriptors===void 0?[]:g.parameterDescriptors.reduce((rt,{name:it})=>({...rt,[it]:new Float32Array(128)}),{});let ot=!0;const ut=()=>{p.numberOfOutputs>0&&R.disconnect(P);for(let rt=0,it=0;rt<p.numberOfOutputs;rt+=1){const Ut=N[rt];for(let _t=0;_t<f[rt];_t+=1)P.disconnect(Ut,it+_t,_t);it+=f[rt]}},st=new Map;R.onaudioprocess=({inputBuffer:rt,outputBuffer:it})=>{if(nt!==null){const Ut=h(V);for(let _t=0;_t<v;_t+=128){for(let ft=0;ft<p.numberOfInputs;ft+=1)for(let D=0;D<p.channelCount;D+=1)Wo(rt,Ot[ft],D,D,_t);g.parameterDescriptors!==void 0&&g.parameterDescriptors.forEach(({name:ft},D)=>{Wo(rt,Y,ft,y+D,_t)});for(let ft=0;ft<p.numberOfInputs;ft+=1)for(let D=0;D<f[ft];D+=1)X[ft][D].byteLength===0&&(X[ft][D]=new Float32Array(128));try{const ft=Ot.map((M,H)=>{if(Ut[H].size>0)return st.set(H,v/128),M;const et=st.get(H);return et===void 0?[]:(M.every(tt=>tt.every(wt=>wt===0))&&(et===1?st.delete(H):st.set(H,et-1)),M)});ot=u(m.currentTime+_t/m.sampleRate,m.sampleRate,()=>nt.process(ft,X,Y));for(let M=0,H=0;M<p.numberOfOutputs;M+=1){for(let Z=0;Z<f[M];Z+=1)Zh(it,X[M],Z,H+Z,_t);H+=f[M]}}catch(ft){ot=!1,V.dispatchEvent(new ErrorEvent("processorerror",{colno:ft.colno,filename:ft.filename,lineno:ft.lineno,message:ft.message}))}if(!ot){for(let ft=0;ft<p.numberOfInputs;ft+=1){E[ft].disconnect(b[ft]);for(let D=0;D<p.channelCount;D+=1)b[_t].disconnect(S,D,ft*p.channelCount+D)}if(g.parameterDescriptors!==void 0){const ft=g.parameterDescriptors.length;for(let D=0;D<ft;D+=1){const M=C[D];M.disconnect(S,0,y+D),M.stop()}}S.disconnect(R),R.onaudioprocess=null,Ct?ut():I();break}}}};let Ct=!1;const Nt=o(m,{channelCount:1,channelCountMode:"explicit",channelInterpretation:"discrete",gain:0}),ne=()=>R.connect(Nt).connect(m.destination),I=()=>{R.disconnect(Nt),Nt.disconnect()},de=()=>{if(ot){I(),p.numberOfOutputs>0&&R.connect(P);for(let rt=0,it=0;rt<p.numberOfOutputs;rt+=1){const Ut=N[rt];for(let _t=0;_t<f[rt];_t+=1)P.connect(Ut,it+_t,_t);it+=f[rt]}}Ct=!0},Zt=()=>{ot&&(ne(),ut()),Ct=!1};return ne(),d(V,de,Zt)},Qh=(i,t)=>{const e=i.createBiquadFilter();return Te(e,t),me(e,t,"Q"),me(e,t,"detune"),me(e,t,"frequency"),me(e,t,"gain"),le(e,t,"type"),e},M_=(i,t)=>(e,n)=>{const s=e.createChannelMerger(n.numberOfInputs);return i!==null&&i.name==="webkitAudioContext"&&t(e,s),Te(s,n),s},T_=i=>{const t=i.numberOfOutputs;Object.defineProperty(i,"channelCount",{get:()=>t,set:e=>{if(e!==t)throw Ce()}}),Object.defineProperty(i,"channelCountMode",{get:()=>"explicit",set:e=>{if(e!=="explicit")throw Ce()}}),Object.defineProperty(i,"channelInterpretation",{get:()=>"discrete",set:e=>{if(e!=="discrete")throw Ce()}})},Ur=(i,t)=>{const e=i.createChannelSplitter(t.numberOfOutputs);return Te(e,t),T_(e),e},E_=(i,t,e,n,s)=>(r,o)=>{if(r.createConstantSource===void 0)return e(r,o);const a=r.createConstantSource();return Te(a,o),me(a,o,"offset"),t(n,()=>n(r))||Sl(a),t(s,()=>s(r))||Ml(a),i(r,a),a},Zs=(i,t)=>(i.connect=t.connect.bind(t),i.disconnect=t.disconnect.bind(t),i),b_=(i,t,e,n)=>(s,{offset:r,...o})=>{const a=s.createBuffer(1,2,44100),c=t(s,{buffer:null,channelCount:2,channelCountMode:"max",channelInterpretation:"speakers",loop:!1,loopEnd:0,loopStart:0,playbackRate:1}),l=e(s,{...o,gain:r}),u=a.getChannelData(0);u[0]=1,u[1]=1,c.buffer=a,c.loop=!0;const h={get bufferSize(){},get channelCount(){return l.channelCount},set channelCount(_){l.channelCount=_},get channelCountMode(){return l.channelCountMode},set channelCountMode(_){l.channelCountMode=_},get channelInterpretation(){return l.channelInterpretation},set channelInterpretation(_){l.channelInterpretation=_},get context(){return l.context},get inputs(){return[]},get numberOfInputs(){return c.numberOfInputs},get numberOfOutputs(){return l.numberOfOutputs},get offset(){return l.gain},get onended(){return c.onended},set onended(_){c.onended=_},addEventListener(..._){return c.addEventListener(_[0],_[1],_[2])},dispatchEvent(..._){return c.dispatchEvent(_[0])},removeEventListener(..._){return c.removeEventListener(_[0],_[1],_[2])},start(_=0){c.start.call(c,_)},stop(_=0){c.stop.call(c,_)}},d=()=>c.connect(l),m=()=>c.disconnect(l);return i(s,c),n(Zs(h,l),d,m)},w_=(i,t)=>(e,n)=>{const s=e.createConvolver();if(Te(s,n),n.disableNormalization===s.normalize&&(s.normalize=!n.disableNormalization),le(s,n,"buffer"),n.channelCount>2||(t(s,"channelCount",r=>()=>r.call(s),r=>o=>{if(o>2)throw i();return r.call(s,o)}),n.channelCountMode==="max"))throw i();return t(s,"channelCountMode",r=>()=>r.call(s),r=>o=>{if(o==="max")throw i();return r.call(s,o)}),s},td=(i,t)=>{const e=i.createDelay(t.maxDelayTime);return Te(e,t),me(e,t,"delayTime"),e},A_=i=>(t,e)=>{const n=t.createDynamicsCompressor();if(Te(n,e),e.channelCount>2||e.channelCountMode==="max")throw i();return me(n,e,"attack"),me(n,e,"knee"),me(n,e,"ratio"),me(n,e,"release"),me(n,e,"threshold"),n},Ye=(i,t)=>{const e=i.createGain();return Te(e,t),me(e,t,"gain"),e},C_=i=>(t,e,n)=>{if(t.createIIRFilter===void 0)return i(t,e,n);const s=t.createIIRFilter(n.feedforward,n.feedback);return Te(s,n),s};function R_(i,t){const e=t[0]*t[0]+t[1]*t[1];return[(i[0]*t[0]+i[1]*t[1])/e,(i[1]*t[0]-i[0]*t[1])/e]}function D_(i,t){return[i[0]*t[0]-i[1]*t[1],i[0]*t[1]+i[1]*t[0]]}function bu(i,t){let e=[0,0];for(let n=i.length-1;n>=0;n-=1)e=D_(e,t),e[0]+=i[n];return e}const P_=(i,t,e,n)=>(s,r,{channelCount:o,channelCountMode:a,channelInterpretation:c,feedback:l,feedforward:u})=>{const h=Jh(r,s.sampleRate),d=l instanceof Float64Array?l:new Float64Array(l),m=u instanceof Float64Array?u:new Float64Array(u),_=d.length,g=m.length,p=Math.min(_,g);if(_===0||_>20)throw n();if(d[0]===0)throw t();if(g===0||g>20)throw n();if(m[0]===0)throw t();if(d[0]!==1){for(let C=0;C<g;C+=1)m[C]/=d[0];for(let C=1;C<_;C+=1)d[C]/=d[0]}const f=e(s,h,o,o);f.channelCount=o,f.channelCountMode=a,f.channelInterpretation=c;const y=32,x=[],T=[],w=[];for(let C=0;C<o;C+=1){x.push(0);const S=new Float32Array(y),v=new Float32Array(y);S.fill(0),v.fill(0),T.push(S),w.push(v)}f.onaudioprocess=C=>{const S=C.inputBuffer,v=C.outputBuffer,R=S.numberOfChannels;for(let P=0;P<R;P+=1){const N=S.getChannelData(P),F=v.getChannelData(P);x[P]=Kh(d,_,m,g,p,T[P],w[P],x[P],y,N,F)}};const E=s.sampleRate/2;return Zs({get bufferSize(){return h},get channelCount(){return f.channelCount},set channelCount(C){f.channelCount=C},get channelCountMode(){return f.channelCountMode},set channelCountMode(C){f.channelCountMode=C},get channelInterpretation(){return f.channelInterpretation},set channelInterpretation(C){f.channelInterpretation=C},get context(){return f.context},get inputs(){return[f]},get numberOfInputs(){return f.numberOfInputs},get numberOfOutputs(){return f.numberOfOutputs},addEventListener(...C){return f.addEventListener(C[0],C[1],C[2])},dispatchEvent(...C){return f.dispatchEvent(C[0])},getFrequencyResponse(C,S,v){if(C.length!==S.length||S.length!==v.length)throw i();const R=C.length;for(let P=0;P<R;P+=1){const N=-Math.PI*(C[P]/E),F=[Math.cos(N),Math.sin(N)],z=bu(m,F),U=bu(d,F),B=R_(z,U);S[P]=Math.sqrt(B[0]*B[0]+B[1]*B[1]),v[P]=Math.atan2(B[1],B[0])}},removeEventListener(...C){return f.removeEventListener(C[0],C[1],C[2])}},f)},I_=(i,t)=>i.createMediaElementSource(t.mediaElement),N_=(i,t)=>{const e=i.createMediaStreamDestination();return Te(e,t),e.numberOfOutputs===1&&Object.defineProperty(e,"numberOfOutputs",{get:()=>0}),e},L_=(i,{mediaStream:t})=>{const e=t.getAudioTracks();e.sort((r,o)=>r.id<o.id?-1:r.id>o.id?1:0);const n=e.slice(0,1),s=i.createMediaStreamSource(new MediaStream(n));return Object.defineProperty(s,"mediaStream",{value:t}),s},O_=(i,t)=>(e,{mediaStreamTrack:n})=>{if(typeof e.createMediaStreamTrackSource=="function")return e.createMediaStreamTrackSource(n);const s=new MediaStream([n]),r=e.createMediaStreamSource(s);if(n.kind!=="audio")throw i();if(t(e))throw new TypeError;return r},U_=i=>i===null?null:i.hasOwnProperty("OfflineAudioContext")?i.OfflineAudioContext:i.hasOwnProperty("webkitOfflineAudioContext")?i.webkitOfflineAudioContext:null,F_=(i,t,e,n,s,r)=>(o,a)=>{const c=o.createOscillator();return Te(c,a),me(c,a,"detune"),me(c,a,"frequency"),a.periodicWave!==void 0?c.setPeriodicWave(a.periodicWave):le(c,a,"type"),t(e,()=>e(o))||Sl(c),t(n,()=>n(o))||r(c,o),t(s,()=>s(o))||Ml(c),i(o,c),c},k_=i=>(t,e)=>{const n=t.createPanner();return n.orientationX===void 0?i(t,e):(Te(n,e),me(n,e,"orientationX"),me(n,e,"orientationY"),me(n,e,"orientationZ"),me(n,e,"positionX"),me(n,e,"positionY"),me(n,e,"positionZ"),le(n,e,"coneInnerAngle"),le(n,e,"coneOuterAngle"),le(n,e,"coneOuterGain"),le(n,e,"distanceModel"),le(n,e,"maxDistance"),le(n,e,"panningModel"),le(n,e,"refDistance"),le(n,e,"rolloffFactor"),n)},B_=(i,t,e,n,s,r,o,a,c,l)=>(u,{coneInnerAngle:h,coneOuterAngle:d,coneOuterGain:m,distanceModel:_,maxDistance:g,orientationX:p,orientationY:f,orientationZ:y,panningModel:x,positionX:T,positionY:w,positionZ:E,refDistance:b,rolloffFactor:C,...S})=>{const v=u.createPanner();if(S.channelCount>2||S.channelCountMode==="max")throw o();Te(v,S);const R={channelCount:1,channelCountMode:"explicit",channelInterpretation:"discrete"},P=e(u,{...R,channelInterpretation:"speakers",numberOfInputs:6}),N=n(u,{...S,gain:1}),F=n(u,{...R,gain:1}),z=n(u,{...R,gain:0}),U=n(u,{...R,gain:0}),B=n(u,{...R,gain:0}),V=n(u,{...R,gain:0}),j=n(u,{...R,gain:0}),J=s(u,256,6,1),nt=r(u,{...R,curve:new Float32Array([1,1]),oversample:"none"});let xt=[p,f,y],Ot=[T,w,E];const X=new Float32Array(1);J.onaudioprocess=({inputBuffer:st})=>{const Ct=[c(st,X,0),c(st,X,1),c(st,X,2)];Ct.some((ne,I)=>ne!==xt[I])&&(v.setOrientation(...Ct),xt=Ct);const Nt=[c(st,X,3),c(st,X,4),c(st,X,5)];Nt.some((ne,I)=>ne!==Ot[I])&&(v.setPosition(...Nt),Ot=Nt)},Object.defineProperty(z.gain,"defaultValue",{get:()=>0}),Object.defineProperty(U.gain,"defaultValue",{get:()=>0}),Object.defineProperty(B.gain,"defaultValue",{get:()=>0}),Object.defineProperty(V.gain,"defaultValue",{get:()=>0}),Object.defineProperty(j.gain,"defaultValue",{get:()=>0});const Y={get bufferSize(){},get channelCount(){return v.channelCount},set channelCount(st){if(st>2)throw o();N.channelCount=st,v.channelCount=st},get channelCountMode(){return v.channelCountMode},set channelCountMode(st){if(st==="max")throw o();N.channelCountMode=st,v.channelCountMode=st},get channelInterpretation(){return v.channelInterpretation},set channelInterpretation(st){N.channelInterpretation=st,v.channelInterpretation=st},get coneInnerAngle(){return v.coneInnerAngle},set coneInnerAngle(st){v.coneInnerAngle=st},get coneOuterAngle(){return v.coneOuterAngle},set coneOuterAngle(st){v.coneOuterAngle=st},get coneOuterGain(){return v.coneOuterGain},set coneOuterGain(st){if(st<0||st>1)throw t();v.coneOuterGain=st},get context(){return v.context},get distanceModel(){return v.distanceModel},set distanceModel(st){v.distanceModel=st},get inputs(){return[N]},get maxDistance(){return v.maxDistance},set maxDistance(st){if(st<0)throw new RangeError;v.maxDistance=st},get numberOfInputs(){return v.numberOfInputs},get numberOfOutputs(){return v.numberOfOutputs},get orientationX(){return F.gain},get orientationY(){return z.gain},get orientationZ(){return U.gain},get panningModel(){return v.panningModel},set panningModel(st){v.panningModel=st},get positionX(){return B.gain},get positionY(){return V.gain},get positionZ(){return j.gain},get refDistance(){return v.refDistance},set refDistance(st){if(st<0)throw new RangeError;v.refDistance=st},get rolloffFactor(){return v.rolloffFactor},set rolloffFactor(st){if(st<0)throw new RangeError;v.rolloffFactor=st},addEventListener(...st){return N.addEventListener(st[0],st[1],st[2])},dispatchEvent(...st){return N.dispatchEvent(st[0])},removeEventListener(...st){return N.removeEventListener(st[0],st[1],st[2])}};h!==Y.coneInnerAngle&&(Y.coneInnerAngle=h),d!==Y.coneOuterAngle&&(Y.coneOuterAngle=d),m!==Y.coneOuterGain&&(Y.coneOuterGain=m),_!==Y.distanceModel&&(Y.distanceModel=_),g!==Y.maxDistance&&(Y.maxDistance=g),p!==Y.orientationX.value&&(Y.orientationX.value=p),f!==Y.orientationY.value&&(Y.orientationY.value=f),y!==Y.orientationZ.value&&(Y.orientationZ.value=y),x!==Y.panningModel&&(Y.panningModel=x),T!==Y.positionX.value&&(Y.positionX.value=T),w!==Y.positionY.value&&(Y.positionY.value=w),E!==Y.positionZ.value&&(Y.positionZ.value=E),b!==Y.refDistance&&(Y.refDistance=b),C!==Y.rolloffFactor&&(Y.rolloffFactor=C),(xt[0]!==1||xt[1]!==0||xt[2]!==0)&&v.setOrientation(...xt),(Ot[0]!==0||Ot[1]!==0||Ot[2]!==0)&&v.setPosition(...Ot);const ot=()=>{N.connect(v),i(N,nt,0,0),nt.connect(F).connect(P,0,0),nt.connect(z).connect(P,0,1),nt.connect(U).connect(P,0,2),nt.connect(B).connect(P,0,3),nt.connect(V).connect(P,0,4),nt.connect(j).connect(P,0,5),P.connect(J).connect(u.destination)},ut=()=>{N.disconnect(v),a(N,nt,0,0),nt.disconnect(F),F.disconnect(P),nt.disconnect(z),z.disconnect(P),nt.disconnect(U),U.disconnect(P),nt.disconnect(B),B.disconnect(P),nt.disconnect(V),V.disconnect(P),nt.disconnect(j),j.disconnect(P),P.disconnect(J),J.disconnect(u.destination)};return l(Zs(Y,v),ot,ut)},V_=i=>(t,{disableNormalization:e,imag:n,real:s})=>{const r=n instanceof Float32Array?n:new Float32Array(n),o=s instanceof Float32Array?s:new Float32Array(s),a=t.createPeriodicWave(o,r,{disableNormalization:e});if(Array.from(n).length<2)throw i();return a},Fr=(i,t,e,n)=>i.createScriptProcessor(t,e,n),z_=(i,t)=>(e,n)=>{const s=n.channelCountMode;if(s==="clamped-max")throw t();if(e.createStereoPanner===void 0)return i(e,n);const r=e.createStereoPanner();return Te(r,n),me(r,n,"pan"),Object.defineProperty(r,"channelCountMode",{get:()=>s,set:o=>{if(o!==s)throw t()}}),r},G_=(i,t,e,n,s,r)=>{const a=new Float32Array([1,1]),c=Math.PI/2,l={channelCount:1,channelCountMode:"explicit",channelInterpretation:"discrete"},u={...l,oversample:"none"},h=(_,g,p,f)=>{const y=new Float32Array(16385),x=new Float32Array(16385);for(let S=0;S<16385;S+=1){const v=S/16384*c;y[S]=Math.cos(v),x[S]=Math.sin(v)}const T=e(_,{...l,gain:0}),w=n(_,{...u,curve:y}),E=n(_,{...u,curve:a}),b=e(_,{...l,gain:0}),C=n(_,{...u,curve:x});return{connectGraph(){g.connect(T),g.connect(E.inputs===void 0?E:E.inputs[0]),g.connect(b),E.connect(p),p.connect(w.inputs===void 0?w:w.inputs[0]),p.connect(C.inputs===void 0?C:C.inputs[0]),w.connect(T.gain),C.connect(b.gain),T.connect(f,0,0),b.connect(f,0,1)},disconnectGraph(){g.disconnect(T),g.disconnect(E.inputs===void 0?E:E.inputs[0]),g.disconnect(b),E.disconnect(p),p.disconnect(w.inputs===void 0?w:w.inputs[0]),p.disconnect(C.inputs===void 0?C:C.inputs[0]),w.disconnect(T.gain),C.disconnect(b.gain),T.disconnect(f,0,0),b.disconnect(f,0,1)}}},d=(_,g,p,f)=>{const y=new Float32Array(16385),x=new Float32Array(16385),T=new Float32Array(16385),w=new Float32Array(16385),E=Math.floor(16385/2);for(let B=0;B<16385;B+=1)if(B>E){const V=(B-E)/(16384-E)*c;y[B]=Math.cos(V),x[B]=Math.sin(V),T[B]=0,w[B]=1}else{const V=B/(16384-E)*c;y[B]=1,x[B]=0,T[B]=Math.cos(V),w[B]=Math.sin(V)}const b=t(_,{channelCount:2,channelCountMode:"explicit",channelInterpretation:"discrete",numberOfOutputs:2}),C=e(_,{...l,gain:0}),S=n(_,{...u,curve:y}),v=e(_,{...l,gain:0}),R=n(_,{...u,curve:x}),P=n(_,{...u,curve:a}),N=e(_,{...l,gain:0}),F=n(_,{...u,curve:T}),z=e(_,{...l,gain:0}),U=n(_,{...u,curve:w});return{connectGraph(){g.connect(b),g.connect(P.inputs===void 0?P:P.inputs[0]),b.connect(C,0),b.connect(v,0),b.connect(N,1),b.connect(z,1),P.connect(p),p.connect(S.inputs===void 0?S:S.inputs[0]),p.connect(R.inputs===void 0?R:R.inputs[0]),p.connect(F.inputs===void 0?F:F.inputs[0]),p.connect(U.inputs===void 0?U:U.inputs[0]),S.connect(C.gain),R.connect(v.gain),F.connect(N.gain),U.connect(z.gain),C.connect(f,0,0),N.connect(f,0,0),v.connect(f,0,1),z.connect(f,0,1)},disconnectGraph(){g.disconnect(b),g.disconnect(P.inputs===void 0?P:P.inputs[0]),b.disconnect(C,0),b.disconnect(v,0),b.disconnect(N,1),b.disconnect(z,1),P.disconnect(p),p.disconnect(S.inputs===void 0?S:S.inputs[0]),p.disconnect(R.inputs===void 0?R:R.inputs[0]),p.disconnect(F.inputs===void 0?F:F.inputs[0]),p.disconnect(U.inputs===void 0?U:U.inputs[0]),S.disconnect(C.gain),R.disconnect(v.gain),F.disconnect(N.gain),U.disconnect(z.gain),C.disconnect(f,0,0),N.disconnect(f,0,0),v.disconnect(f,0,1),z.disconnect(f,0,1)}}},m=(_,g,p,f,y)=>{if(g===1)return h(_,p,f,y);if(g===2)return d(_,p,f,y);throw s()};return(_,{channelCount:g,channelCountMode:p,pan:f,...y})=>{if(p==="max")throw s();const x=i(_,{...y,channelCount:1,channelCountMode:p,numberOfInputs:2}),T=e(_,{...y,channelCount:g,channelCountMode:p,gain:1}),w=e(_,{channelCount:1,channelCountMode:"explicit",channelInterpretation:"discrete",gain:f});let{connectGraph:E,disconnectGraph:b}=m(_,g,T,w,x);Object.defineProperty(w.gain,"defaultValue",{get:()=>0}),Object.defineProperty(w.gain,"maxValue",{get:()=>1}),Object.defineProperty(w.gain,"minValue",{get:()=>-1});const C={get bufferSize(){},get channelCount(){return T.channelCount},set channelCount(P){T.channelCount!==P&&(S&&b(),{connectGraph:E,disconnectGraph:b}=m(_,P,T,w,x),S&&E()),T.channelCount=P},get channelCountMode(){return T.channelCountMode},set channelCountMode(P){if(P==="clamped-max"||P==="max")throw s();T.channelCountMode=P},get channelInterpretation(){return T.channelInterpretation},set channelInterpretation(P){T.channelInterpretation=P},get context(){return T.context},get inputs(){return[T]},get numberOfInputs(){return T.numberOfInputs},get numberOfOutputs(){return T.numberOfOutputs},get pan(){return w.gain},addEventListener(...P){return T.addEventListener(P[0],P[1],P[2])},dispatchEvent(...P){return T.dispatchEvent(P[0])},removeEventListener(...P){return T.removeEventListener(P[0],P[1],P[2])}};let S=!1;const v=()=>{E(),S=!0},R=()=>{b(),S=!1};return r(Zs(C,x),v,R)}},H_=(i,t,e,n,s,r,o)=>(a,c)=>{const l=a.createWaveShaper();if(r!==null&&r.name==="webkitAudioContext"&&a.createGain().gain.automationRate===void 0)return e(a,c);Te(l,c);const u=c.curve===null||c.curve instanceof Float32Array?c.curve:new Float32Array(c.curve);if(u!==null&&u.length<2)throw t();le(l,{curve:u},"curve"),le(l,c,"oversample");let h=null,d=!1;return o(l,"curve",g=>()=>g.call(l),g=>p=>(g.call(l,p),d&&(n(p)&&h===null?h=i(a,l):!n(p)&&h!==null&&(h(),h=null)),p)),s(l,()=>{d=!0,n(l.curve)&&(h=i(a,l))},()=>{d=!1,h!==null&&(h(),h=null)})},W_=(i,t,e,n,s)=>(r,{curve:o,oversample:a,...c})=>{const l=r.createWaveShaper(),u=r.createWaveShaper();Te(l,c),Te(u,c);const h=e(r,{...c,gain:1}),d=e(r,{...c,gain:-1}),m=e(r,{...c,gain:1}),_=e(r,{...c,gain:-1});let g=null,p=!1,f=null;const y={get bufferSize(){},get channelCount(){return l.channelCount},set channelCount(w){h.channelCount=w,d.channelCount=w,l.channelCount=w,m.channelCount=w,u.channelCount=w,_.channelCount=w},get channelCountMode(){return l.channelCountMode},set channelCountMode(w){h.channelCountMode=w,d.channelCountMode=w,l.channelCountMode=w,m.channelCountMode=w,u.channelCountMode=w,_.channelCountMode=w},get channelInterpretation(){return l.channelInterpretation},set channelInterpretation(w){h.channelInterpretation=w,d.channelInterpretation=w,l.channelInterpretation=w,m.channelInterpretation=w,u.channelInterpretation=w,_.channelInterpretation=w},get context(){return l.context},get curve(){return f},set curve(w){if(w!==null&&w.length<2)throw t();if(w===null)l.curve=w,u.curve=w;else{const E=w.length,b=new Float32Array(E+2-E%2),C=new Float32Array(E+2-E%2);b[0]=w[0],C[0]=-w[E-1];const S=Math.ceil((E+1)/2),v=(E+1)/2-1;for(let R=1;R<S;R+=1){const P=R/S*v,N=Math.floor(P),F=Math.ceil(P);b[R]=N===F?w[N]:(1-(P-N))*w[N]+(1-(F-P))*w[F],C[R]=N===F?-w[E-1-N]:-((1-(P-N))*w[E-1-N])-(1-(F-P))*w[E-1-F]}b[S]=E%2===1?w[S-1]:(w[S-2]+w[S-1])/2,l.curve=b,u.curve=C}f=w,p&&(n(f)&&g===null?g=i(r,h):g!==null&&(g(),g=null))},get inputs(){return[h]},get numberOfInputs(){return l.numberOfInputs},get numberOfOutputs(){return l.numberOfOutputs},get oversample(){return l.oversample},set oversample(w){l.oversample=w,u.oversample=w},addEventListener(...w){return h.addEventListener(w[0],w[1],w[2])},dispatchEvent(...w){return h.dispatchEvent(w[0])},removeEventListener(...w){return h.removeEventListener(w[0],w[1],w[2])}};o!==null&&(y.curve=o instanceof Float32Array?o:new Float32Array(o)),a!==y.oversample&&(y.oversample=a);const x=()=>{h.connect(l).connect(m),h.connect(d).connect(u).connect(_).connect(m),p=!0,n(f)&&(g=i(r,h))},T=()=>{h.disconnect(l),l.disconnect(m),h.disconnect(d),d.disconnect(u),u.disconnect(_),_.disconnect(m),p=!1,g!==null&&(g(),g=null)};return s(Zs(y,m),x,T)},ze=()=>new DOMException("","NotSupportedError"),q_={numberOfChannels:1},X_=(i,t,e,n,s)=>class extends i{constructor(o,a,c){let l;if(typeof o=="number"&&a!==void 0&&c!==void 0)l={length:a,numberOfChannels:o,sampleRate:c};else if(typeof o=="object")l=o;else throw new Error("The given parameters are not valid.");const{length:u,numberOfChannels:h,sampleRate:d}={...q_,...l},m=n(h,u,d);t(mr,()=>mr(m))||m.addEventListener("statechange",(()=>{let _=0;const g=p=>{this._state==="running"&&(_>0?(m.removeEventListener("statechange",g),p.stopImmediatePropagation(),this._waitForThePromiseToSettle(p)):_+=1)};return g})()),super(m,h),this._length=u,this._nativeOfflineAudioContext=m,this._state=null}get length(){return this._nativeOfflineAudioContext.length===void 0?this._length:this._nativeOfflineAudioContext.length}get state(){return this._state===null?this._nativeOfflineAudioContext.state:this._state}startRendering(){return this._state==="running"?Promise.reject(e()):(this._state="running",s(this.destination,this._nativeOfflineAudioContext).finally(()=>{this._state=null,qh(this)}))}_waitForThePromiseToSettle(o){this._state===null?this._nativeOfflineAudioContext.dispatchEvent(o):setTimeout(()=>this._waitForThePromiseToSettle(o))}},Y_={channelCount:2,channelCountMode:"max",channelInterpretation:"speakers",detune:0,frequency:440,periodicWave:void 0,type:"sine"},j_=(i,t,e,n,s,r,o)=>class extends i{constructor(c,l){const u=s(c),h={...Y_,...l},d=e(u,h),m=r(u),_=m?n():null,g=c.sampleRate/2;super(c,!1,d,_),this._detune=t(this,m,d.detune,153600,-153600),this._frequency=t(this,m,d.frequency,g,-g),this._nativeOscillatorNode=d,this._onended=null,this._oscillatorNodeRenderer=_,this._oscillatorNodeRenderer!==null&&h.periodicWave!==void 0&&(this._oscillatorNodeRenderer.periodicWave=h.periodicWave)}get detune(){return this._detune}get frequency(){return this._frequency}get onended(){return this._onended}set onended(c){const l=typeof c=="function"?o(this,c):null;this._nativeOscillatorNode.onended=l;const u=this._nativeOscillatorNode.onended;this._onended=u!==null&&u===l?c:u}get type(){return this._nativeOscillatorNode.type}set type(c){this._nativeOscillatorNode.type=c,this._oscillatorNodeRenderer!==null&&(this._oscillatorNodeRenderer.periodicWave=null)}setPeriodicWave(c){this._nativeOscillatorNode.setPeriodicWave(c),this._oscillatorNodeRenderer!==null&&(this._oscillatorNodeRenderer.periodicWave=c)}start(c=0){if(this._nativeOscillatorNode.start(c),this._oscillatorNodeRenderer!==null&&(this._oscillatorNodeRenderer.start=c),this.context.state!=="closed"){Os(this);const l=()=>{this._nativeOscillatorNode.removeEventListener("ended",l),Jn(this)&&Nr(this)};this._nativeOscillatorNode.addEventListener("ended",l)}}stop(c=0){this._nativeOscillatorNode.stop(c),this._oscillatorNodeRenderer!==null&&(this._oscillatorNodeRenderer.stop=c)}},$_=(i,t,e,n,s)=>()=>{const r=new WeakMap;let o=null,a=null,c=null;const l=async(u,h)=>{let d=e(u);const m=Ue(d,h);if(!m){const _={channelCount:d.channelCount,channelCountMode:d.channelCountMode,channelInterpretation:d.channelInterpretation,detune:d.detune.value,frequency:d.frequency.value,periodicWave:o===null?void 0:o,type:d.type};d=t(h,_),a!==null&&d.start(a),c!==null&&d.stop(c)}return r.set(h,d),m?(await i(h,u.detune,d.detune),await i(h,u.frequency,d.frequency)):(await n(h,u.detune,d.detune),await n(h,u.frequency,d.frequency)),await s(u,h,d),d};return{set periodicWave(u){o=u},set start(u){a=u},set stop(u){c=u},render(u,h){const d=r.get(h);return d!==void 0?Promise.resolve(d):l(u,h)}}},Z_={channelCount:2,channelCountMode:"clamped-max",channelInterpretation:"speakers",coneInnerAngle:360,coneOuterAngle:360,coneOuterGain:0,distanceModel:"inverse",maxDistance:1e4,orientationX:1,orientationY:0,orientationZ:0,panningModel:"equalpower",positionX:0,positionY:0,positionZ:0,refDistance:1,rolloffFactor:1},K_=(i,t,e,n,s,r,o)=>class extends i{constructor(c,l){const u=s(c),h={...Z_,...l},d=e(u,h),m=r(u),_=m?n():null;super(c,!1,d,_),this._nativePannerNode=d,this._orientationX=t(this,m,d.orientationX,ke,He),this._orientationY=t(this,m,d.orientationY,ke,He),this._orientationZ=t(this,m,d.orientationZ,ke,He),this._positionX=t(this,m,d.positionX,ke,He),this._positionY=t(this,m,d.positionY,ke,He),this._positionZ=t(this,m,d.positionZ,ke,He),o(this,1)}get coneInnerAngle(){return this._nativePannerNode.coneInnerAngle}set coneInnerAngle(c){this._nativePannerNode.coneInnerAngle=c}get coneOuterAngle(){return this._nativePannerNode.coneOuterAngle}set coneOuterAngle(c){this._nativePannerNode.coneOuterAngle=c}get coneOuterGain(){return this._nativePannerNode.coneOuterGain}set coneOuterGain(c){this._nativePannerNode.coneOuterGain=c}get distanceModel(){return this._nativePannerNode.distanceModel}set distanceModel(c){this._nativePannerNode.distanceModel=c}get maxDistance(){return this._nativePannerNode.maxDistance}set maxDistance(c){this._nativePannerNode.maxDistance=c}get orientationX(){return this._orientationX}get orientationY(){return this._orientationY}get orientationZ(){return this._orientationZ}get panningModel(){return this._nativePannerNode.panningModel}set panningModel(c){this._nativePannerNode.panningModel=c}get positionX(){return this._positionX}get positionY(){return this._positionY}get positionZ(){return this._positionZ}get refDistance(){return this._nativePannerNode.refDistance}set refDistance(c){this._nativePannerNode.refDistance=c}get rolloffFactor(){return this._nativePannerNode.rolloffFactor}set rolloffFactor(c){this._nativePannerNode.rolloffFactor=c}},J_=(i,t,e,n,s,r,o,a,c,l)=>()=>{const u=new WeakMap;let h=null;const d=async(m,_)=>{let g=null,p=r(m);const f={channelCount:p.channelCount,channelCountMode:p.channelCountMode,channelInterpretation:p.channelInterpretation},y={...f,coneInnerAngle:p.coneInnerAngle,coneOuterAngle:p.coneOuterAngle,coneOuterGain:p.coneOuterGain,distanceModel:p.distanceModel,maxDistance:p.maxDistance,panningModel:p.panningModel,refDistance:p.refDistance,rolloffFactor:p.rolloffFactor},x=Ue(p,_);if("bufferSize"in p)g=n(_,{...f,gain:1});else if(!x){const T={...y,orientationX:p.orientationX.value,orientationY:p.orientationY.value,orientationZ:p.orientationZ.value,positionX:p.positionX.value,positionY:p.positionY.value,positionZ:p.positionZ.value};p=s(_,T)}if(u.set(_,g===null?p:g),g!==null){if(h===null){if(o===null)throw new Error("Missing the native OfflineAudioContext constructor.");const R=new o(6,m.context.length,_.sampleRate),P=t(R,{channelCount:1,channelCountMode:"explicit",channelInterpretation:"speakers",numberOfInputs:6});P.connect(R.destination),h=(async()=>{const N=await Promise.all([m.orientationX,m.orientationY,m.orientationZ,m.positionX,m.positionY,m.positionZ].map(async(F,z)=>{const U=e(R,{channelCount:1,channelCountMode:"explicit",channelInterpretation:"discrete",offset:z===0?1:0});return await a(R,F,U.offset),U}));for(let F=0;F<6;F+=1)N[F].connect(P,0,F),N[F].start(0);return l(R)})()}const T=await h,w=n(_,{...f,gain:1});await c(m,_,w);const E=[];for(let R=0;R<T.numberOfChannels;R+=1)E.push(T.getChannelData(R));let b=[E[0][0],E[1][0],E[2][0]],C=[E[3][0],E[4][0],E[5][0]],S=n(_,{...f,gain:1}),v=s(_,{...y,orientationX:b[0],orientationY:b[1],orientationZ:b[2],positionX:C[0],positionY:C[1],positionZ:C[2]});w.connect(S).connect(v.inputs[0]),v.connect(g);for(let R=128;R<T.length;R+=128){const P=[E[0][R],E[1][R],E[2][R]],N=[E[3][R],E[4][R],E[5][R]];if(P.some((F,z)=>F!==b[z])||N.some((F,z)=>F!==C[z])){b=P,C=N;const F=R/_.sampleRate;S.gain.setValueAtTime(0,F),S=n(_,{...f,gain:0}),v=s(_,{...y,orientationX:b[0],orientationY:b[1],orientationZ:b[2],positionX:C[0],positionY:C[1],positionZ:C[2]}),S.gain.setValueAtTime(1,F),w.connect(S).connect(v.inputs[0]),v.connect(g)}}return g}return x?(await i(_,m.orientationX,p.orientationX),await i(_,m.orientationY,p.orientationY),await i(_,m.orientationZ,p.orientationZ),await i(_,m.positionX,p.positionX),await i(_,m.positionY,p.positionY),await i(_,m.positionZ,p.positionZ)):(await a(_,m.orientationX,p.orientationX),await a(_,m.orientationY,p.orientationY),await a(_,m.orientationZ,p.orientationZ),await a(_,m.positionX,p.positionX),await a(_,m.positionY,p.positionY),await a(_,m.positionZ,p.positionZ)),$s(p)?await c(m,_,p.inputs[0]):await c(m,_,p),p};return{render(m,_){const g=u.get(_);return g!==void 0?Promise.resolve(g):d(m,_)}}},Q_={disableNormalization:!1},tg=(i,t,e,n)=>class ed{constructor(r,o){const a=t(r),c=n({...Q_,...o}),l=i(a,c);return e.add(l),l}static[Symbol.hasInstance](r){return r!==null&&typeof r=="object"&&Object.getPrototypeOf(r)===ed.prototype||e.has(r)}},eg=(i,t)=>(e,n,s)=>(i(n).replay(s),t(n,e,s)),ng=(i,t,e)=>async(n,s,r)=>{const o=i(n);await Promise.all(o.activeInputs.map((a,c)=>Array.from(a).map(async([l,u])=>{const d=await t(l).render(l,s),m=n.context.destination;!e(l)&&(n!==m||!e(n))&&d.connect(r,u,c)})).reduce((a,c)=>[...a,...c],[]))},ig=(i,t,e)=>async(n,s,r)=>{const o=t(n);await Promise.all(Array.from(o.activeInputs).map(async([a,c])=>{const u=await i(a).render(a,s);e(a)||u.connect(r,c)}))},sg=(i,t,e,n)=>s=>i(mr,()=>mr(s))?Promise.resolve(i(n,n)).then(r=>{if(!r){const o=e(s,512,0,1);s.oncomplete=()=>{o.onaudioprocess=null,o.disconnect()},o.onaudioprocess=()=>s.currentTime,o.connect(s.destination)}return s.startRendering()}):new Promise(r=>{const o=t(s,{channelCount:1,channelCountMode:"explicit",channelInterpretation:"discrete",gain:0});s.oncomplete=a=>{o.disconnect(),r(a.renderedBuffer)},o.connect(s.destination),s.startRendering()}),rg=i=>(t,e)=>{i.set(t,e)},og=i=>(t,e)=>i.set(t,e),ag=(i,t,e,n,s,r,o,a)=>(c,l)=>e(c).render(c,l).then(()=>Promise.all(Array.from(n(l)).map(u=>e(u).render(u,l)))).then(()=>s(l)).then(u=>(typeof u.copyFromChannel!="function"?(o(u),vl(u)):t(r,()=>r(u))||a(u),i.add(u),u)),cg={channelCount:2,channelCountMode:"explicit",channelInterpretation:"speakers",pan:0},lg=(i,t,e,n,s,r)=>class extends i{constructor(a,c){const l=s(a),u={...cg,...c},h=e(l,u),d=r(l),m=d?n():null;super(a,!1,h,m),this._pan=t(this,d,h.pan)}get pan(){return this._pan}},ug=(i,t,e,n,s)=>()=>{const r=new WeakMap,o=async(a,c)=>{let l=e(a);const u=Ue(l,c);if(!u){const h={channelCount:l.channelCount,channelCountMode:l.channelCountMode,channelInterpretation:l.channelInterpretation,pan:l.pan.value};l=t(c,h)}return r.set(c,l),u?await i(c,a.pan,l.pan):await n(c,a.pan,l.pan),$s(l)?await s(a,c,l.inputs[0]):await s(a,c,l),l};return{render(a,c){const l=r.get(c);return l!==void 0?Promise.resolve(l):o(a,c)}}},hg=i=>()=>{if(i===null)return!1;try{new i({length:1,sampleRate:44100})}catch{return!1}return!0},dg=(i,t)=>async()=>{if(i===null)return!0;if(t===null)return!1;const e=new Blob(['class A extends AudioWorkletProcessor{process(i){this.port.postMessage(i,[i[0][0].buffer])}}registerProcessor("a",A)'],{type:"application/javascript; charset=utf-8"}),n=new t(1,128,44100),s=URL.createObjectURL(e);let r=!1,o=!1;try{await n.audioWorklet.addModule(s);const a=new i(n,"a",{numberOfOutputs:0}),c=n.createOscillator();a.port.onmessage=()=>r=!0,a.onprocessorerror=()=>o=!0,c.connect(a),c.start(0),await n.startRendering(),await new Promise(l=>setTimeout(l))}catch{}finally{URL.revokeObjectURL(s)}return r&&!o},fg=(i,t)=>()=>{if(t===null)return Promise.resolve(!1);const e=new t(1,1,44100),n=i(e,{channelCount:1,channelCountMode:"explicit",channelInterpretation:"discrete",gain:0});return new Promise(s=>{e.oncomplete=()=>{n.disconnect(),s(e.currentTime!==0)},e.startRendering()})},pg=()=>new DOMException("","UnknownError"),mg={channelCount:2,channelCountMode:"max",channelInterpretation:"speakers",curve:null,oversample:"none"},_g=(i,t,e,n,s,r,o)=>class extends i{constructor(c,l){const u=s(c),h={...mg,...l},d=e(u,h),_=r(u)?n():null;super(c,!0,d,_),this._isCurveNullified=!1,this._nativeWaveShaperNode=d,o(this,1)}get curve(){return this._isCurveNullified?null:this._nativeWaveShaperNode.curve}set curve(c){if(c===null)this._isCurveNullified=!0,this._nativeWaveShaperNode.curve=new Float32Array([0,0]);else{if(c.length<2)throw t();this._isCurveNullified=!1,this._nativeWaveShaperNode.curve=c}}get oversample(){return this._nativeWaveShaperNode.oversample}set oversample(c){this._nativeWaveShaperNode.oversample=c}},gg=(i,t,e)=>()=>{const n=new WeakMap,s=async(r,o)=>{let a=t(r);if(!Ue(a,o)){const l={channelCount:a.channelCount,channelCountMode:a.channelCountMode,channelInterpretation:a.channelInterpretation,curve:a.curve,oversample:a.oversample};a=i(o,l)}return n.set(o,a),$s(a)?await e(r,o,a.inputs[0]):await e(r,o,a),a};return{render(r,o){const a=n.get(o);return a!==void 0?Promise.resolve(a):s(r,o)}}},vg=()=>typeof window>"u"?null:window,xg=(i,t)=>e=>{e.copyFromChannel=(n,s,r=0)=>{const o=i(r),a=i(s);if(a>=e.numberOfChannels)throw t();const c=e.length,l=e.getChannelData(a),u=n.length;for(let h=o<0?-o:0;h+o<c&&h<u;h+=1)n[h]=l[h+o]},e.copyToChannel=(n,s,r=0)=>{const o=i(r),a=i(s);if(a>=e.numberOfChannels)throw t();const c=e.length,l=e.getChannelData(a),u=n.length;for(let h=o<0?-o:0;h+o<c&&h<u;h+=1)l[h+o]=n[h]}},yg=i=>t=>{t.copyFromChannel=(e=>(n,s,r=0)=>{const o=i(r),a=i(s);if(o<t.length)return e.call(t,n,a,o)})(t.copyFromChannel),t.copyToChannel=(e=>(n,s,r=0)=>{const o=i(r),a=i(s);if(o<t.length)return e.call(t,n,a,o)})(t.copyToChannel)},Sg=i=>(t,e)=>{const n=e.createBuffer(1,1,44100);t.buffer===null&&(t.buffer=n),i(t,"buffer",s=>()=>{const r=s.call(t);return r===n?null:r},s=>r=>s.call(t,r===null?n:r))},Mg=(i,t)=>(e,n)=>{n.channelCount=1,n.channelCountMode="explicit",Object.defineProperty(n,"channelCount",{get:()=>1,set:()=>{throw i()}}),Object.defineProperty(n,"channelCountMode",{get:()=>"explicit",set:()=>{throw i()}});const s=e.createBufferSource();t(n,()=>{const a=n.numberOfInputs;for(let c=0;c<a;c+=1)s.connect(n,0,c)},()=>s.disconnect(n))},nd=(i,t,e)=>i.copyFromChannel===void 0?i.getChannelData(e)[0]:(i.copyFromChannel(t,e),t[0]),id=i=>{if(i===null)return!1;const t=i.length;return t%2!==0?i[Math.floor(t/2)]!==0:i[t/2-1]+i[t/2]!==0},kr=(i,t,e,n)=>{let s=i;for(;!s.hasOwnProperty(t);)s=Object.getPrototypeOf(s);const{get:r,set:o}=Object.getOwnPropertyDescriptor(s,t);Object.defineProperty(i,t,{get:e(r),set:n(o)})},Tg=i=>({...i,outputChannelCount:i.outputChannelCount!==void 0?i.outputChannelCount:i.numberOfInputs===1&&i.numberOfOutputs===1?[i.channelCount]:Array.from({length:i.numberOfOutputs},()=>1)}),Eg=i=>({...i,channelCount:i.numberOfOutputs}),bg=i=>{const{imag:t,real:e}=i;return t===void 0?e===void 0?{...i,imag:[0,0],real:[0,0]}:{...i,imag:Array.from(e,()=>0),real:e}:e===void 0?{...i,imag:t,real:Array.from(t,()=>0)}:{...i,imag:t,real:e}},sd=(i,t,e)=>{try{i.setValueAtTime(t,e)}catch(n){if(n.code!==9)throw n;sd(i,t,e+1e-7)}},wg=i=>{const t=i.createBufferSource();t.start();try{t.start()}catch{return!0}return!1},Ag=i=>{const t=i.createBufferSource(),e=i.createBuffer(1,1,44100);t.buffer=e;try{t.start(0,1)}catch{return!1}return!0},Cg=i=>{const t=i.createBufferSource();t.start();try{t.stop()}catch{return!1}return!0},Tl=i=>{const t=i.createOscillator();try{t.start(-1)}catch(e){return e instanceof RangeError}return!1},rd=i=>{const t=i.createBuffer(1,1,44100),e=i.createBufferSource();e.buffer=t,e.start(),e.stop();try{return e.stop(),!0}catch{return!1}},El=i=>{const t=i.createOscillator();try{t.stop(-1)}catch(e){return e instanceof RangeError}return!1},Rg=i=>{const{port1:t,port2:e}=new MessageChannel;try{t.postMessage(i)}finally{t.close(),e.close()}},Dg=i=>{i.start=(t=>(e=0,n=0,s)=>{const r=i.buffer,o=r===null?n:Math.min(r.duration,n);r!==null&&o>r.duration-.5/i.context.sampleRate?t.call(i,e,0,0):t.call(i,e,o,s)})(i.start)},od=(i,t)=>{const e=t.createGain();i.connect(e);const n=(s=>()=>{s.call(i,e),i.removeEventListener("ended",n)})(i.disconnect);i.addEventListener("ended",n),Zs(i,e),i.stop=(s=>{let r=!1;return(o=0)=>{if(r)try{s.call(i,o)}catch{e.gain.setValueAtTime(0,o)}else s.call(i,o),r=!0}})(i.stop)},Ks=(i,t)=>e=>{const n={value:i};return Object.defineProperties(e,{currentTarget:n,target:n}),typeof t=="function"?t.call(i,e):t.handleEvent.call(i,e)},Pg=Kf(is),Ig=ip(is),Ng=mm(Ta),ad=new WeakMap,Lg=Nm(ad),En=qp(new Map,new WeakMap),In=vg(),cd=l_(En,Un),bl=Im(Be),Ie=ng(Be,bl,Yi),Og=cp(cd,ce,Ie),oe=Um(Ma),ni=U_(In),re=Qm(ni),ld=new WeakMap,ud=bm(Ks),Br=f_(In),wl=$m(Br),Al=Zm(In),hd=Km(In),_r=m_(In),ve=Np(Jf(kh),np(Pg,Ig,zo,Ng,Go,Be,Lg,Ir,ce,is,Jn,Yi,bo),En,Wm(Ac,Go,Be,ce,pr,Jn),Un,Ea,ze,hm(zo,Ac,Be,ce,pr,oe,Jn,re),vm(ld,Be,xn),ud,oe,wl,Al,hd,re,_r),Ug=ap(ve,Og,Un,cd,oe,re),Cl=new WeakSet,wu=u_(In),dd=sm(new Uint32Array(1)),Rl=xg(dd,Un),Dl=yg(dd),fd=up(Cl,En,ze,wu,ni,hg(wu),Rl,Dl),ba=sp(Ye),pd=ig(bl,Lr,Yi),Fn=Jp(pd),Js=d_(ba,En,wg,Ag,Cg,Tl,rd,El,Dg,Sg(kr),od),kn=eg(Lm(Lr),pd),Fg=fp(Fn,Js,ce,kn,Ie),bn=Lp(Qf(Bh),ld,gl,Op,qf,Xf,Yf,jf,$f,Ec,Uh,Br,sd),kg=dp(ve,Fg,bn,Ce,Js,oe,re,Ks),Bg=Mp(ve,Tp,Un,Ce,p_(Ye,kr),oe,re,Ie),Vg=Wp(Fn,Qh,ce,kn,Ie),ss=og(ad),zg=Hp(ve,bn,Vg,Ea,Qh,oe,re,ss),Ti=a_(is,Al),Gg=Mg(Ce,Ti),Ei=M_(Br,Gg),Hg=jp(Ei,ce,Ie),Wg=Yp(ve,Hg,Ei,oe,re),qg=Kp(Ur,ce,Ie),Xg=Zp(ve,qg,Ur,oe,re,Eg),Yg=b_(ba,Js,Ye,Ti),Qs=E_(ba,En,Yg,Tl,El),jg=im(Fn,Qs,ce,kn,Ie),$g=nm(ve,bn,jg,Qs,oe,re,Ks),md=w_(ze,kr),Zg=am(md,ce,Ie),Kg=om(ve,Zg,md,oe,re,ss),Jg=pm(Fn,td,ce,kn,Ie),Qg=fm(ve,bn,Jg,td,oe,re,ss),_d=A_(ze),tv=Mm(Fn,_d,ce,kn,Ie),ev=Sm(ve,bn,tv,_d,ze,oe,re,ss),nv=Dm(Fn,Ye,ce,kn,Ie),iv=Rm(ve,bn,nv,Ye,oe,re),sv=P_(Ea,Ce,Fr,ze),wa=sg(En,Ye,Fr,fg(Ye,ni)),rv=Hm(Js,ce,ni,Ie,wa),ov=C_(sv),av=zm(ve,ov,rv,oe,re,ss),cv=Ep(bn,Ei,Qs,Fr,ze,nd,re,kr),gd=new WeakMap,lv=o_(Bg,cv,ud,re,gd,Ks),vd=F_(ba,En,Tl,rd,El,od),uv=$_(Fn,vd,ce,kn,Ie),hv=j_(ve,bn,vd,uv,oe,re,Ks),xd=tm(Js),dv=W_(xd,Ce,Ye,id,Ti),Aa=H_(xd,Ce,dv,id,Ti,Br,kr),fv=B_(zo,Ce,Ei,Ye,Fr,Aa,ze,Go,nd,Ti),yd=k_(fv),pv=J_(Fn,Ei,Qs,Ye,yd,ce,ni,kn,Ie,wa),mv=K_(ve,bn,yd,pv,oe,re,ss),_v=V_(Un),gv=tg(_v,oe,new WeakSet,bg),vv=G_(Ei,Ur,Ye,Aa,ze,Ti),Sd=z_(vv,ze),xv=ug(Fn,Sd,ce,kn,Ie),yv=lg(ve,bn,Sd,xv,oe,re),Sv=gg(Aa,ce,Ie),Mv=_g(ve,Ce,Aa,Sv,oe,re,ss),Md=t_(In),Pl=wm(In),Td=new WeakMap,Tv=Fm(Td,ni),Ev=Md?ep(En,ze,Em(In),Pl,Am(Zf),oe,Tv,re,_r,new WeakMap,new WeakMap,dg(_r,ni),In):void 0,bv=Jm(wl,re),wv=um(Cl,En,lm,Tm,new WeakSet,oe,bv,Bo,mr,Rl,Dl),Ed=zp(Ev,Ug,fd,kg,zg,Wg,Xg,$g,Kg,wv,Qg,ev,iv,av,lv,hv,mv,gv,yv,Mv),Av=e_(ve,I_,oe,re),Cv=i_(ve,N_,oe,re),Rv=s_(ve,L_,oe,re),Dv=O_(Ce,re),Pv=r_(ve,Dv,oe),Iv=Sp(Ed,Ce,ze,pg,Av,Cv,Rv,Pv,Br),Il=km(gd),Nv=rp(Il),bd=Qp(Un),Lv=_m(Il),wd=xm(Un),Ad=new WeakMap,Ov=Pm(Ad,xn),Uv=S_(bd,Un,Ce,Ei,Ur,Qs,Ye,Fr,ze,wd,Pl,Ov,Ti),Fv=g_(Ce,Uv,Ye,ze,Ti),kv=Vp(Fn,bd,Js,Ei,Ur,Qs,Ye,Lv,wd,Pl,ce,_r,ni,kn,Ie,wa),Bv=Om(Td),Vv=rg(Ad),Au=Md?Fp(Nv,ve,bn,kv,Fv,Be,Bv,oe,re,_r,Tg,Vv,Rg,Ks):void 0,zv=cm(ze,ni),Gv=ag(Cl,En,bl,Il,wa,Bo,Rl,Dl),Hv=X_(Ed,En,Ce,zv,Gv),Wv=qm(Ma,wl),qv=Xm(_l,Al),Xv=Ym(gl,hd),Yv=jm(Ma,re);function on(i){return i===void 0}function zt(i){return i!==void 0}function jv(i){return typeof i=="function"}function yn(i){return typeof i=="number"}function Hi(i){return Object.prototype.toString.call(i)==="[object Object]"&&i.constructor===Object}function Cd(i){return typeof i=="boolean"}function Qe(i){return Array.isArray(i)}function Qn(i){return typeof i=="string"}function Kr(i){return Qn(i)&&/^([a-g]{1}(?:b|#|x|bb)?)(-?[0-9]+)/i.test(i)}function At(i,t){if(!i)throw new Error(t)}function Sn(i,t,e=1/0){if(!(t<=i&&i<=e))throw new RangeError(`Value must be within [${t}, ${e}], got: ${i}`)}function Rd(i){!i.isOffline&&i.state!=="running"&&Ca('The AudioContext is "suspended". Invoke Tone.start() from a user action to start the audio.')}let Dd=!1,Cu=!1;function Ru(i){Dd=i}function $v(i){on(i)&&Dd&&!Cu&&(Cu=!0,Ca("Events scheduled inside of scheduled callbacks should use the passed in scheduling time. See https://github.com/Tonejs/Tone.js/wiki/Accurate-Timing"))}let Pd=console;function Zv(...i){Pd.log(...i)}function Ca(...i){Pd.warn(...i)}function Kv(i){return new Iv(i)}function Jv(i,t,e){return new Hv(i,t,e)}const Wi=typeof self=="object"?self:null,Qv=Wi&&(Wi.hasOwnProperty("AudioContext")||Wi.hasOwnProperty("webkitAudioContext"));function t0(i,t,e){return At(zt(Au),"This node only works in a secure context (https or localhost)"),new Au(i,t,e)}function wn(i,t,e,n){var s=arguments.length,r=s<3?t:n===null?n=Object.getOwnPropertyDescriptor(t,e):n,o;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(i,t,e,n);else for(var a=i.length-1;a>=0;a--)(o=i[a])&&(r=(s<3?o(r):s>3?o(t,e,r):o(t,e))||r);return s>3&&r&&Object.defineProperty(t,e,r),r}function ge(i,t,e,n){function s(r){return r instanceof e?r:new e(function(o){o(r)})}return new(e||(e=Promise))(function(r,o){function a(u){try{l(n.next(u))}catch(h){o(h)}}function c(u){try{l(n.throw(u))}catch(h){o(h)}}function l(u){u.done?r(u.value):s(u.value).then(a,c)}l((n=n.apply(i,t||[])).next())})}class e0{constructor(t,e,n,s){this._callback=t,this._type=e,this._minimumUpdateInterval=Math.max(128/(s||44100),.001),this.updateInterval=n,this._createClock()}_createWorker(){const t=new Blob([`
			// the initial timeout time
			let timeoutTime =  ${(this._updateInterval*1e3).toFixed(1)};
			// onmessage callback
			self.onmessage = function(msg){
				timeoutTime = parseInt(msg.data);
			};
			// the tick function which posts a message
			// and schedules a new tick
			function tick(){
				setTimeout(tick, timeoutTime);
				self.postMessage('tick');
			}
			// call tick initially
			tick();
			`],{type:"text/javascript"}),e=URL.createObjectURL(t),n=new Worker(e);n.onmessage=this._callback.bind(this),this._worker=n}_createTimeout(){this._timeout=setTimeout(()=>{this._createTimeout(),this._callback()},this._updateInterval*1e3)}_createClock(){if(this._type==="worker")try{this._createWorker()}catch{this._type="timeout",this._createClock()}else this._type==="timeout"&&this._createTimeout()}_disposeClock(){this._timeout&&clearTimeout(this._timeout),this._worker&&(this._worker.terminate(),this._worker.onmessage=null)}get updateInterval(){return this._updateInterval}set updateInterval(t){var e;this._updateInterval=Math.max(t,this._minimumUpdateInterval),this._type==="worker"&&((e=this._worker)===null||e===void 0||e.postMessage(this._updateInterval*1e3))}get type(){return this._type}set type(t){this._disposeClock(),this._type=t,this._createClock()}dispose(){this._disposeClock()}}function ji(i){return Xv(i)}function mi(i){return qv(i)}function wo(i){return Yv(i)}function As(i){return Wv(i)}function n0(i){return i instanceof fd}function i0(i,t){return i==="value"||ji(t)||mi(t)||n0(t)}function qi(i,...t){if(!t.length)return i;const e=t.shift();if(Hi(i)&&Hi(e))for(const n in e)i0(n,e[n])?i[n]=e[n]:Hi(e[n])?(i[n]||Object.assign(i,{[n]:{}}),qi(i[n],e[n])):Object.assign(i,{[n]:e[n]});return qi(i,...t)}function s0(i,t){return i.length===t.length&&i.every((e,n)=>t[n]===e)}function $(i,t,e=[],n){const s={},r=Array.from(t);if(Hi(r[0])&&n&&!Reflect.has(r[0],n)&&(Object.keys(r[0]).some(a=>Reflect.has(i,a))||(qi(s,{[n]:r[0]}),e.splice(e.indexOf(n),1),r.shift())),r.length===1&&Hi(r[0]))qi(s,r[0]);else for(let o=0;o<e.length;o++)zt(r[o])&&(s[e[o]]=r[o]);return qi(i,s)}function r0(i){return i.constructor.getDefaults()}function Xi(i,t){return on(i)?t:i}function gr(i,t){return t.forEach(e=>{Reflect.has(i,e)&&delete i[e]}),i}/**
 * Tone.js
 * @author Yotam Mann
 * @license http://opensource.org/licenses/MIT MIT License
 * @copyright 2014-2019 Yotam Mann
 */class ii{constructor(){this.debug=!1,this._wasDisposed=!1}static getDefaults(){return{}}log(...t){(this.debug||Wi&&this.toString()===Wi.TONE_DEBUG_CLASS)&&Zv(this,...t)}dispose(){return this._wasDisposed=!0,this}get disposed(){return this._wasDisposed}toString(){return this.name}}ii.version=Oh;const Nl=1e-6;function Us(i,t){return i>t+Nl}function Ic(i,t){return Us(i,t)||fn(i,t)}function Xo(i,t){return i+Nl<t}function fn(i,t){return Math.abs(i-t)<Nl}function rs(i,t,e){return Math.max(Math.min(i,e),t)}class an extends ii{constructor(){super(),this.name="Timeline",this._timeline=[];const t=$(an.getDefaults(),arguments,["memory"]);this.memory=t.memory,this.increasing=t.increasing}static getDefaults(){return{memory:1/0,increasing:!1}}get length(){return this._timeline.length}add(t){if(At(Reflect.has(t,"time"),"Timeline: events must have a time attribute"),t.time=t.time.valueOf(),this.increasing&&this.length){const e=this._timeline[this.length-1];At(Ic(t.time,e.time),"The time must be greater than or equal to the last scheduled time"),this._timeline.push(t)}else{const e=this._search(t.time);this._timeline.splice(e+1,0,t)}if(this.length>this.memory){const e=this.length-this.memory;this._timeline.splice(0,e)}return this}remove(t){const e=this._timeline.indexOf(t);return e!==-1&&this._timeline.splice(e,1),this}get(t,e="time"){const n=this._search(t,e);return n!==-1?this._timeline[n]:null}peek(){return this._timeline[0]}shift(){return this._timeline.shift()}getAfter(t,e="time"){const n=this._search(t,e);return n+1<this._timeline.length?this._timeline[n+1]:null}getBefore(t){const e=this._timeline.length;if(e>0&&this._timeline[e-1].time<t)return this._timeline[e-1];const n=this._search(t);return n-1>=0?this._timeline[n-1]:null}cancel(t){if(this._timeline.length>1){let e=this._search(t);if(e>=0)if(fn(this._timeline[e].time,t)){for(let n=e;n>=0&&fn(this._timeline[n].time,t);n--)e=n;this._timeline=this._timeline.slice(0,e)}else this._timeline=this._timeline.slice(0,e+1);else this._timeline=[]}else this._timeline.length===1&&Ic(this._timeline[0].time,t)&&(this._timeline=[]);return this}cancelBefore(t){const e=this._search(t);return e>=0&&(this._timeline=this._timeline.slice(e+1)),this}previousEvent(t){const e=this._timeline.indexOf(t);return e>0?this._timeline[e-1]:null}_search(t,e="time"){if(this._timeline.length===0)return-1;let n=0;const s=this._timeline.length;let r=s;if(s>0&&this._timeline[s-1][e]<=t)return s-1;for(;n<r;){let o=Math.floor(n+(r-n)/2);const a=this._timeline[o],c=this._timeline[o+1];if(fn(a[e],t)){for(let l=o;l<this._timeline.length;l++){const u=this._timeline[l];if(fn(u[e],t))o=l;else break}return o}else{if(Xo(a[e],t)&&Us(c[e],t))return o;Us(a[e],t)?r=o:n=o+1}}return-1}_iterate(t,e=0,n=this._timeline.length-1){this._timeline.slice(e,n+1).forEach(t)}forEach(t){return this._iterate(t),this}forEachBefore(t,e){const n=this._search(t);return n!==-1&&this._iterate(e,0,n),this}forEachAfter(t,e){const n=this._search(t);return this._iterate(e,n+1),this}forEachBetween(t,e,n){let s=this._search(t),r=this._search(e);return s!==-1&&r!==-1?(this._timeline[s].time!==t&&(s+=1),this._timeline[r].time===e&&(r-=1),this._iterate(n,s,r)):s===-1&&this._iterate(n,0,r),this}forEachFrom(t,e){let n=this._search(t);for(;n>=0&&this._timeline[n].time>=t;)n--;return this._iterate(e,n+1),this}forEachAtTime(t,e){const n=this._search(t);if(n!==-1&&fn(this._timeline[n].time,t)){let s=n;for(let r=n;r>=0&&fn(this._timeline[r].time,t);r--)s=r;this._iterate(r=>{e(r)},s,n)}return this}dispose(){return super.dispose(),this._timeline=[],this}}const Id=[];function Ra(i){Id.push(i)}function o0(i){Id.forEach(t=>t(i))}const Nd=[];function Da(i){Nd.push(i)}function a0(i){Nd.forEach(t=>t(i))}class Vr extends ii{constructor(){super(...arguments),this.name="Emitter"}on(t,e){return t.split(/\W+/).forEach(s=>{on(this._events)&&(this._events={}),this._events.hasOwnProperty(s)||(this._events[s]=[]),this._events[s].push(e)}),this}once(t,e){const n=(...s)=>{e(...s),this.off(t,n)};return this.on(t,n),this}off(t,e){return t.split(/\W+/).forEach(s=>{if(on(this._events)&&(this._events={}),this._events.hasOwnProperty(s))if(on(e))this._events[s]=[];else{const r=this._events[s];for(let o=r.length-1;o>=0;o--)r[o]===e&&r.splice(o,1)}}),this}emit(t,...e){if(this._events&&this._events.hasOwnProperty(t)){const n=this._events[t].slice(0);for(let s=0,r=n.length;s<r;s++)n[s].apply(this,e)}return this}static mixin(t){["on","once","off","emit"].forEach(e=>{const n=Object.getOwnPropertyDescriptor(Vr.prototype,e);Object.defineProperty(t.prototype,e,n)})}dispose(){return super.dispose(),this._events=void 0,this}}class Ld extends Vr{constructor(){super(...arguments),this.isOffline=!1}toJSON(){return{}}}class zr extends Ld{constructor(){var t,e;super(),this.name="Context",this._constants=new Map,this._timeouts=new an,this._timeoutIds=0,this._initialized=!1,this._closeStarted=!1,this.isOffline=!1,this._workletPromise=null;const n=$(zr.getDefaults(),arguments,["context"]);n.context?(this._context=n.context,this._latencyHint=((t=arguments[0])===null||t===void 0?void 0:t.latencyHint)||""):(this._context=Kv({latencyHint:n.latencyHint}),this._latencyHint=n.latencyHint),this._ticker=new e0(this.emit.bind(this,"tick"),n.clockSource,n.updateInterval,this._context.sampleRate),this.on("tick",this._timeoutLoop.bind(this)),this._context.onstatechange=()=>{this.emit("statechange",this.state)},this[!((e=arguments[0])===null||e===void 0)&&e.hasOwnProperty("updateInterval")?"_lookAhead":"lookAhead"]=n.lookAhead}static getDefaults(){return{clockSource:"worker",latencyHint:"interactive",lookAhead:.1,updateInterval:.05}}initialize(){return this._initialized||(o0(this),this._initialized=!0),this}createAnalyser(){return this._context.createAnalyser()}createOscillator(){return this._context.createOscillator()}createBufferSource(){return this._context.createBufferSource()}createBiquadFilter(){return this._context.createBiquadFilter()}createBuffer(t,e,n){return this._context.createBuffer(t,e,n)}createChannelMerger(t){return this._context.createChannelMerger(t)}createChannelSplitter(t){return this._context.createChannelSplitter(t)}createConstantSource(){return this._context.createConstantSource()}createConvolver(){return this._context.createConvolver()}createDelay(t){return this._context.createDelay(t)}createDynamicsCompressor(){return this._context.createDynamicsCompressor()}createGain(){return this._context.createGain()}createIIRFilter(t,e){return this._context.createIIRFilter(t,e)}createPanner(){return this._context.createPanner()}createPeriodicWave(t,e,n){return this._context.createPeriodicWave(t,e,n)}createStereoPanner(){return this._context.createStereoPanner()}createWaveShaper(){return this._context.createWaveShaper()}createMediaStreamSource(t){return At(As(this._context),"Not available if OfflineAudioContext"),this._context.createMediaStreamSource(t)}createMediaElementSource(t){return At(As(this._context),"Not available if OfflineAudioContext"),this._context.createMediaElementSource(t)}createMediaStreamDestination(){return At(As(this._context),"Not available if OfflineAudioContext"),this._context.createMediaStreamDestination()}decodeAudioData(t){return this._context.decodeAudioData(t)}get currentTime(){return this._context.currentTime}get state(){return this._context.state}get sampleRate(){return this._context.sampleRate}get listener(){return this.initialize(),this._listener}set listener(t){At(!this._initialized,"The listener cannot be set after initialization."),this._listener=t}get transport(){return this.initialize(),this._transport}set transport(t){At(!this._initialized,"The transport cannot be set after initialization."),this._transport=t}get draw(){return this.initialize(),this._draw}set draw(t){At(!this._initialized,"Draw cannot be set after initialization."),this._draw=t}get destination(){return this.initialize(),this._destination}set destination(t){At(!this._initialized,"The destination cannot be set after initialization."),this._destination=t}createAudioWorkletNode(t,e){return t0(this.rawContext,t,e)}addAudioWorkletModule(t){return ge(this,void 0,void 0,function*(){At(zt(this.rawContext.audioWorklet),"AudioWorkletNode is only available in a secure context (https or localhost)"),this._workletPromise||(this._workletPromise=this.rawContext.audioWorklet.addModule(t)),yield this._workletPromise})}workletsAreReady(){return ge(this,void 0,void 0,function*(){(yield this._workletPromise)?this._workletPromise:Promise.resolve()})}get updateInterval(){return this._ticker.updateInterval}set updateInterval(t){this._ticker.updateInterval=t}get clockSource(){return this._ticker.type}set clockSource(t){this._ticker.type=t}get lookAhead(){return this._lookAhead}set lookAhead(t){this._lookAhead=t,this.updateInterval=t?t/2:.01}get latencyHint(){return this._latencyHint}get rawContext(){return this._context}now(){return this._context.currentTime+this._lookAhead}immediate(){return this._context.currentTime}resume(){return As(this._context)?this._context.resume():Promise.resolve()}close(){return ge(this,void 0,void 0,function*(){As(this._context)&&this.state!=="closed"&&!this._closeStarted&&(this._closeStarted=!0,yield this._context.close()),this._initialized&&a0(this)})}getConstant(t){if(this._constants.has(t))return this._constants.get(t);{const e=this._context.createBuffer(1,128,this._context.sampleRate),n=e.getChannelData(0);for(let r=0;r<n.length;r++)n[r]=t;const s=this._context.createBufferSource();return s.channelCount=1,s.channelCountMode="explicit",s.buffer=e,s.loop=!0,s.start(0),this._constants.set(t,s),s}}dispose(){return super.dispose(),this._ticker.dispose(),this._timeouts.dispose(),Object.keys(this._constants).map(t=>this._constants[t].disconnect()),this.close(),this}_timeoutLoop(){const t=this.now();let e=this._timeouts.peek();for(;this._timeouts.length&&e&&e.time<=t;)e.callback(),this._timeouts.shift(),e=this._timeouts.peek()}setTimeout(t,e){this._timeoutIds++;const n=this.now();return this._timeouts.add({callback:t,id:this._timeoutIds,time:n+e}),this._timeoutIds}clearTimeout(t){return this._timeouts.forEach(e=>{e.id===t&&this._timeouts.remove(e)}),this}clearInterval(t){return this.clearTimeout(t)}setInterval(t,e){const n=++this._timeoutIds,s=()=>{const r=this.now();this._timeouts.add({callback:()=>{t(),s()},id:n,time:r+e})};return s(),n}}class c0 extends Ld{constructor(){super(...arguments),this.lookAhead=0,this.latencyHint=0,this.isOffline=!1}createAnalyser(){return{}}createOscillator(){return{}}createBufferSource(){return{}}createBiquadFilter(){return{}}createBuffer(t,e,n){return{}}createChannelMerger(t){return{}}createChannelSplitter(t){return{}}createConstantSource(){return{}}createConvolver(){return{}}createDelay(t){return{}}createDynamicsCompressor(){return{}}createGain(){return{}}createIIRFilter(t,e){return{}}createPanner(){return{}}createPeriodicWave(t,e,n){return{}}createStereoPanner(){return{}}createWaveShaper(){return{}}createMediaStreamSource(t){return{}}createMediaElementSource(t){return{}}createMediaStreamDestination(){return{}}decodeAudioData(t){return Promise.resolve({})}createAudioWorkletNode(t,e){return{}}get rawContext(){return{}}addAudioWorkletModule(t){return ge(this,void 0,void 0,function*(){return Promise.resolve()})}resume(){return Promise.resolve()}setTimeout(t,e){return 0}clearTimeout(t){return this}setInterval(t,e){return 0}clearInterval(t){return this}getConstant(t){return{}}get currentTime(){return 0}get state(){return{}}get sampleRate(){return 0}get listener(){return{}}get transport(){return{}}get draw(){return{}}set draw(t){}get destination(){return{}}set destination(t){}now(){return 0}immediate(){return 0}}function $t(i,t){Qe(t)?t.forEach(e=>$t(i,e)):Object.defineProperty(i,t,{enumerable:!0,writable:!1})}function Ll(i,t){Qe(t)?t.forEach(e=>Ll(i,e)):Object.defineProperty(i,t,{writable:!0})}const jt=()=>{};class se extends ii{constructor(){super(),this.name="ToneAudioBuffer",this.onload=jt;const t=$(se.getDefaults(),arguments,["url","onload","onerror"]);this.reverse=t.reverse,this.onload=t.onload,Qn(t.url)?this.load(t.url).catch(t.onerror):t.url&&this.set(t.url)}static getDefaults(){return{onerror:jt,onload:jt,reverse:!1}}get sampleRate(){return this._buffer?this._buffer.sampleRate:mn().sampleRate}set(t){return t instanceof se?t.loaded?this._buffer=t.get():t.onload=()=>{this.set(t),this.onload(this)}:this._buffer=t,this._reversed&&this._reverse(),this}get(){return this._buffer}load(t){return ge(this,void 0,void 0,function*(){const e=se.load(t).then(n=>{this.set(n),this.onload(this)});se.downloads.push(e);try{yield e}finally{const n=se.downloads.indexOf(e);se.downloads.splice(n,1)}return this})}dispose(){return super.dispose(),this._buffer=void 0,this}fromArray(t){const e=Qe(t)&&t[0].length>0,n=e?t.length:1,s=e?t[0].length:t.length,r=mn(),o=r.createBuffer(n,s,r.sampleRate),a=!e&&n===1?[t]:t;for(let c=0;c<n;c++)o.copyToChannel(a[c],c);return this._buffer=o,this}toMono(t){if(yn(t))this.fromArray(this.toArray(t));else{let e=new Float32Array(this.length);const n=this.numberOfChannels;for(let s=0;s<n;s++){const r=this.toArray(s);for(let o=0;o<r.length;o++)e[o]+=r[o]}e=e.map(s=>s/n),this.fromArray(e)}return this}toArray(t){if(yn(t))return this.getChannelData(t);if(this.numberOfChannels===1)return this.toArray(0);{const e=[];for(let n=0;n<this.numberOfChannels;n++)e[n]=this.getChannelData(n);return e}}getChannelData(t){return this._buffer?this._buffer.getChannelData(t):new Float32Array(0)}slice(t,e=this.duration){At(this.loaded,"Buffer is not loaded");const n=Math.floor(t*this.sampleRate),s=Math.floor(e*this.sampleRate);At(n<s,"The start time must be less than the end time");const r=s-n,o=mn().createBuffer(this.numberOfChannels,r,this.sampleRate);for(let a=0;a<this.numberOfChannels;a++)o.copyToChannel(this.getChannelData(a).subarray(n,s),a);return new se(o)}_reverse(){if(this.loaded)for(let t=0;t<this.numberOfChannels;t++)this.getChannelData(t).reverse();return this}get loaded(){return this.length>0}get duration(){return this._buffer?this._buffer.duration:0}get length(){return this._buffer?this._buffer.length:0}get numberOfChannels(){return this._buffer?this._buffer.numberOfChannels:0}get reverse(){return this._reversed}set reverse(t){this._reversed!==t&&(this._reversed=t,this._reverse())}static fromArray(t){return new se().fromArray(t)}static fromUrl(t){return ge(this,void 0,void 0,function*(){return yield new se().load(t)})}static load(t){return ge(this,void 0,void 0,function*(){const e=t.match(/\[([^\]\[]+\|.+)\]$/);if(e){const c=e[1].split("|");let l=c[0];for(const u of c)if(se.supportsType(u)){l=u;break}t=t.replace(e[0],l)}const n=se.baseUrl===""||se.baseUrl.endsWith("/")?se.baseUrl:se.baseUrl+"/",s=document.createElement("a");s.href=n+t,s.pathname=(s.pathname+s.hash).split("/").map(encodeURIComponent).join("/");const r=yield fetch(s.href);if(!r.ok)throw new Error(`could not load url: ${t}`);const o=yield r.arrayBuffer();return yield mn().decodeAudioData(o)})}static supportsType(t){const e=t.split("."),n=e[e.length-1];return document.createElement("audio").canPlayType("audio/"+n)!==""}static loaded(){return ge(this,void 0,void 0,function*(){for(yield Promise.resolve();se.downloads.length;)yield se.downloads[0]})}}se.baseUrl="";se.downloads=[];class Pa extends zr{constructor(){super({clockSource:"offline",context:wo(arguments[0])?arguments[0]:Jv(arguments[0],arguments[1]*arguments[2],arguments[2]),lookAhead:0,updateInterval:wo(arguments[0])?128/arguments[0].sampleRate:128/arguments[2]}),this.name="OfflineContext",this._currentTime=0,this.isOffline=!0,this._duration=wo(arguments[0])?arguments[0].length/arguments[0].sampleRate:arguments[1]}now(){return this._currentTime}get currentTime(){return this._currentTime}_renderClock(t){return ge(this,void 0,void 0,function*(){let e=0;for(;this._duration-this._currentTime>=0;){this.emit("tick"),this._currentTime+=128/this.sampleRate,e++;const n=Math.floor(this.sampleRate/128);t&&e%n===0&&(yield new Promise(s=>setTimeout(s,1)))}})}render(t=!0){return ge(this,void 0,void 0,function*(){yield this.workletsAreReady(),yield this._renderClock(t);const e=yield this._context.startRendering();return new se(e)})}close(){return Promise.resolve()}}const Od=new c0;let ki=Od;function mn(){return ki===Od&&Qv&&l0(new zr),ki}function l0(i,t=!1){t&&ki.dispose(),As(i)?ki=new zr(i):wo(i)?ki=new Pa(i):ki=i}function u0(){return ki.resume()}if(Wi&&!Wi.TONE_SILENCE_LOGGING){const t=` * Tone.js v${Oh} * `;console.log(`%c${t}`,"background: #000; color: #fff")}function h0(i){return Math.pow(10,i/20)}function d0(i){return 20*(Math.log(i)/Math.LN10)}function Ud(i){return Math.pow(2,i/12)}let Ia=440;function f0(){return Ia}function p0(i){Ia=i}function Bi(i){return Math.round(Fd(i))}function Fd(i){return 69+12*Math.log2(i/Ia)}function kd(i){return Ia*Math.pow(2,(i-69)/12)}class Ol extends ii{constructor(t,e,n){super(),this.defaultUnits="s",this._val=e,this._units=n,this.context=t,this._expressions=this._getExpressions()}_getExpressions(){return{hz:{method:t=>this._frequencyToUnits(parseFloat(t)),regexp:/^(\d+(?:\.\d+)?)hz$/i},i:{method:t=>this._ticksToUnits(parseInt(t,10)),regexp:/^(\d+)i$/i},m:{method:t=>this._beatsToUnits(parseInt(t,10)*this._getTimeSignature()),regexp:/^(\d+)m$/i},n:{method:(t,e)=>{const n=parseInt(t,10),s=e==="."?1.5:1;return n===1?this._beatsToUnits(this._getTimeSignature())*s:this._beatsToUnits(4/n)*s},regexp:/^(\d+)n(\.?)$/i},number:{method:t=>this._expressions[this.defaultUnits].method.call(this,t),regexp:/^(\d+(?:\.\d+)?)$/},s:{method:t=>this._secondsToUnits(parseFloat(t)),regexp:/^(\d+(?:\.\d+)?)s$/},samples:{method:t=>parseInt(t,10)/this.context.sampleRate,regexp:/^(\d+)samples$/},t:{method:t=>{const e=parseInt(t,10);return this._beatsToUnits(8/(Math.floor(e)*3))},regexp:/^(\d+)t$/i},tr:{method:(t,e,n)=>{let s=0;return t&&t!=="0"&&(s+=this._beatsToUnits(this._getTimeSignature()*parseFloat(t))),e&&e!=="0"&&(s+=this._beatsToUnits(parseFloat(e))),n&&n!=="0"&&(s+=this._beatsToUnits(parseFloat(n)/4)),s},regexp:/^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?):?(\d+(?:\.\d+)?)?$/}}}valueOf(){if(this._val instanceof Ol&&this.fromType(this._val),on(this._val))return this._noArg();if(Qn(this._val)&&on(this._units)){for(const t in this._expressions)if(this._expressions[t].regexp.test(this._val.trim())){this._units=t;break}}else if(Hi(this._val)){let t=0;for(const e in this._val)if(zt(this._val[e])){const n=this._val[e],s=new this.constructor(this.context,e).valueOf()*n;t+=s}return t}if(zt(this._units)){const t=this._expressions[this._units],e=this._val.toString().trim().match(t.regexp);return e?t.method.apply(this,e.slice(1)):t.method.call(this,this._val)}else return Qn(this._val)?parseFloat(this._val):this._val}_frequencyToUnits(t){return 1/t}_beatsToUnits(t){return 60/this._getBpm()*t}_secondsToUnits(t){return t}_ticksToUnits(t){return t*this._beatsToUnits(1)/this._getPPQ()}_noArg(){return this._now()}_getBpm(){return this.context.transport.bpm.value}_getTimeSignature(){return this.context.transport.timeSignature}_getPPQ(){return this.context.transport.PPQ}fromType(t){switch(this._units=void 0,this.defaultUnits){case"s":this._val=t.toSeconds();break;case"i":this._val=t.toTicks();break;case"hz":this._val=t.toFrequency();break;case"midi":this._val=t.toMidi();break}return this}toFrequency(){return 1/this.toSeconds()}toSamples(){return this.toSeconds()*this.context.sampleRate}toMilliseconds(){return this.toSeconds()*1e3}}class _n extends Ol{constructor(){super(...arguments),this.name="TimeClass"}_getExpressions(){return Object.assign(super._getExpressions(),{now:{method:t=>this._now()+new this.constructor(this.context,t).valueOf(),regexp:/^\+(.+)/},quantize:{method:t=>{const e=new _n(this.context,t).valueOf();return this._secondsToUnits(this.context.transport.nextSubdivision(e))},regexp:/^@(.+)/}})}quantize(t,e=1){const n=new this.constructor(this.context,t).valueOf(),s=this.valueOf(),a=Math.round(s/n)*n-s;return s+a*e}toNotation(){const t=this.toSeconds(),e=["1m"];for(let r=1;r<9;r++){const o=Math.pow(2,r);e.push(o+"n."),e.push(o+"n"),e.push(o+"t")}e.push("0");let n=e[0],s=new _n(this.context,e[0]).toSeconds();return e.forEach(r=>{const o=new _n(this.context,r).toSeconds();Math.abs(o-t)<Math.abs(s-t)&&(n=r,s=o)}),n}toBarsBeatsSixteenths(){const t=this._beatsToUnits(1);let e=this.valueOf()/t;e=parseFloat(e.toFixed(4));const n=Math.floor(e/this._getTimeSignature());let s=e%1*4;e=Math.floor(e)%this._getTimeSignature();const r=s.toString();return r.length>3&&(s=parseFloat(parseFloat(r).toFixed(3))),[n,e,s].join(":")}toTicks(){const t=this._beatsToUnits(1);return this.valueOf()/t*this._getPPQ()}toSeconds(){return this.valueOf()}toMidi(){return Bi(this.toFrequency())}_now(){return this.context.now()}}class Je extends _n{constructor(){super(...arguments),this.name="Frequency",this.defaultUnits="hz"}static get A4(){return f0()}static set A4(t){p0(t)}_getExpressions(){return Object.assign({},super._getExpressions(),{midi:{regexp:/^(\d+(?:\.\d+)?midi)/,method(t){return this.defaultUnits==="midi"?t:Je.mtof(t)}},note:{regexp:/^([a-g]{1}(?:b|#|##|x|bb|###|#x|x#|bbb)?)(-?[0-9]+)/i,method(t,e){const s=m0[t.toLowerCase()]+(parseInt(e,10)+1)*12;return this.defaultUnits==="midi"?s:Je.mtof(s)}},tr:{regexp:/^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?):?(\d+(?:\.\d+)?)?/,method(t,e,n){let s=1;return t&&t!=="0"&&(s*=this._beatsToUnits(this._getTimeSignature()*parseFloat(t))),e&&e!=="0"&&(s*=this._beatsToUnits(parseFloat(e))),n&&n!=="0"&&(s*=this._beatsToUnits(parseFloat(n)/4)),s}}})}transpose(t){return new Je(this.context,this.valueOf()*Ud(t))}harmonize(t){return t.map(e=>this.transpose(e))}toMidi(){return Bi(this.valueOf())}toNote(){const t=this.toFrequency(),e=Math.log2(t/Je.A4);let n=Math.round(12*e)+57;const s=Math.floor(n/12);return s<0&&(n+=-12*s),_0[n%12]+s.toString()}toSeconds(){return 1/super.toSeconds()}toTicks(){const t=this._beatsToUnits(1),e=this.valueOf()/t;return Math.floor(e*this._getPPQ())}_noArg(){return 0}_frequencyToUnits(t){return t}_ticksToUnits(t){return 1/(t*60/(this._getBpm()*this._getPPQ()))}_beatsToUnits(t){return 1/super._beatsToUnits(t)}_secondsToUnits(t){return 1/t}static mtof(t){return kd(t)}static ftom(t){return Bi(t)}}const m0={cbbb:-3,cbb:-2,cb:-1,c:0,"c#":1,cx:2,"c##":2,"c###":3,"cx#":3,"c#x":3,dbbb:-1,dbb:0,db:1,d:2,"d#":3,dx:4,"d##":4,"d###":5,"dx#":5,"d#x":5,ebbb:1,ebb:2,eb:3,e:4,"e#":5,ex:6,"e##":6,"e###":7,"ex#":7,"e#x":7,fbbb:2,fbb:3,fb:4,f:5,"f#":6,fx:7,"f##":7,"f###":8,"fx#":8,"f#x":8,gbbb:4,gbb:5,gb:6,g:7,"g#":8,gx:9,"g##":9,"g###":10,"gx#":10,"g#x":10,abbb:6,abb:7,ab:8,a:9,"a#":10,ax:11,"a##":11,"a###":12,"ax#":12,"a#x":12,bbbb:8,bbb:9,bb:10,b:11,"b#":12,bx:13,"b##":13,"b###":14,"bx#":14,"b#x":14},_0=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];class dr extends _n{constructor(){super(...arguments),this.name="TransportTime"}_now(){return this.context.transport.seconds}}class Re extends ii{constructor(){super();const t=$(Re.getDefaults(),arguments,["context"]);this.defaultContext?this.context=this.defaultContext:this.context=t.context}static getDefaults(){return{context:mn()}}now(){return this.context.currentTime+this.context.lookAhead}immediate(){return this.context.currentTime}get sampleTime(){return 1/this.context.sampleRate}get blockTime(){return 128/this.context.sampleRate}toSeconds(t){return $v(t),new _n(this.context,t).toSeconds()}toFrequency(t){return new Je(this.context,t).toFrequency()}toTicks(t){return new dr(this.context,t).toTicks()}_getPartialProperties(t){const e=this.get();return Object.keys(e).forEach(n=>{on(t[n])&&delete e[n]}),e}get(){const t=r0(this);return Object.keys(t).forEach(e=>{if(Reflect.has(this,e)){const n=this[e];zt(n)&&zt(n.value)&&zt(n.setValueAtTime)?t[e]=n.value:n instanceof Re?t[e]=n._getPartialProperties(t[e]):Qe(n)||yn(n)||Qn(n)||Cd(n)?t[e]=n:delete t[e]}}),t}set(t){return Object.keys(t).forEach(e=>{Reflect.has(this,e)&&zt(this[e])&&(this[e]&&zt(this[e].value)&&zt(this[e].setValueAtTime)?this[e].value!==t[e]&&(this[e].value=t[e]):this[e]instanceof Re?this[e].set(t[e]):this[e]=t[e])}),this}}class Na extends an{constructor(t="stopped"){super(),this.name="StateTimeline",this._initial=t,this.setStateAtTime(this._initial,0)}getValueAtTime(t){const e=this.get(t);return e!==null?e.state:this._initial}setStateAtTime(t,e,n){return Sn(e,0),this.add(Object.assign({},n,{state:t,time:e})),this}getLastState(t,e){const n=this._search(e);for(let s=n;s>=0;s--){const r=this._timeline[s];if(r.state===t)return r}}getNextState(t,e){const n=this._search(e);if(n!==-1)for(let s=n;s<this._timeline.length;s++){const r=this._timeline[s];if(r.state===t)return r}}}class Wt extends Re{constructor(){super($(Wt.getDefaults(),arguments,["param","units","convert"])),this.name="Param",this.overridden=!1,this._minOutput=1e-7;const t=$(Wt.getDefaults(),arguments,["param","units","convert"]);for(At(zt(t.param)&&(ji(t.param)||t.param instanceof Wt),"param must be an AudioParam");!ji(t.param);)t.param=t.param._param;this._swappable=zt(t.swappable)?t.swappable:!1,this._swappable?(this.input=this.context.createGain(),this._param=t.param,this.input.connect(this._param)):this._param=this.input=t.param,this._events=new an(1e3),this._initialValue=this._param.defaultValue,this.units=t.units,this.convert=t.convert,this._minValue=t.minValue,this._maxValue=t.maxValue,zt(t.value)&&t.value!==this._toType(this._initialValue)&&this.setValueAtTime(t.value,0)}static getDefaults(){return Object.assign(Re.getDefaults(),{convert:!0,units:"number"})}get value(){const t=this.now();return this.getValueAtTime(t)}set value(t){this.cancelScheduledValues(this.now()),this.setValueAtTime(t,this.now())}get minValue(){return zt(this._minValue)?this._minValue:this.units==="time"||this.units==="frequency"||this.units==="normalRange"||this.units==="positive"||this.units==="transportTime"||this.units==="ticks"||this.units==="bpm"||this.units==="hertz"||this.units==="samples"?0:this.units==="audioRange"?-1:this.units==="decibels"?-1/0:this._param.minValue}get maxValue(){return zt(this._maxValue)?this._maxValue:this.units==="normalRange"||this.units==="audioRange"?1:this._param.maxValue}_is(t,e){return this.units===e}_assertRange(t){return zt(this.maxValue)&&zt(this.minValue)&&Sn(t,this._fromType(this.minValue),this._fromType(this.maxValue)),t}_fromType(t){return this.convert&&!this.overridden?this._is(t,"time")?this.toSeconds(t):this._is(t,"decibels")?h0(t):this._is(t,"frequency")?this.toFrequency(t):t:this.overridden?0:t}_toType(t){return this.convert&&this.units==="decibels"?d0(t):t}setValueAtTime(t,e){const n=this.toSeconds(e),s=this._fromType(t);return At(isFinite(s)&&isFinite(n),`Invalid argument(s) to setValueAtTime: ${JSON.stringify(t)}, ${JSON.stringify(e)}`),this._assertRange(s),this.log(this.units,"setValueAtTime",t,n),this._events.add({time:n,type:"setValueAtTime",value:s}),this._param.setValueAtTime(s,n),this}getValueAtTime(t){const e=Math.max(this.toSeconds(t),0),n=this._events.getAfter(e),s=this._events.get(e);let r=this._initialValue;if(s===null)r=this._initialValue;else if(s.type==="setTargetAtTime"&&(n===null||n.type==="setValueAtTime")){const o=this._events.getBefore(s.time);let a;o===null?a=this._initialValue:a=o.value,s.type==="setTargetAtTime"&&(r=this._exponentialApproach(s.time,a,s.value,s.constant,e))}else if(n===null)r=s.value;else if(n.type==="linearRampToValueAtTime"||n.type==="exponentialRampToValueAtTime"){let o=s.value;if(s.type==="setTargetAtTime"){const a=this._events.getBefore(s.time);a===null?o=this._initialValue:o=a.value}n.type==="linearRampToValueAtTime"?r=this._linearInterpolate(s.time,o,n.time,n.value,e):r=this._exponentialInterpolate(s.time,o,n.time,n.value,e)}else r=s.value;return this._toType(r)}setRampPoint(t){t=this.toSeconds(t);let e=this.getValueAtTime(t);return this.cancelAndHoldAtTime(t),this._fromType(e)===0&&(e=this._toType(this._minOutput)),this.setValueAtTime(e,t),this}linearRampToValueAtTime(t,e){const n=this._fromType(t),s=this.toSeconds(e);return At(isFinite(n)&&isFinite(s),`Invalid argument(s) to linearRampToValueAtTime: ${JSON.stringify(t)}, ${JSON.stringify(e)}`),this._assertRange(n),this._events.add({time:s,type:"linearRampToValueAtTime",value:n}),this.log(this.units,"linearRampToValueAtTime",t,s),this._param.linearRampToValueAtTime(n,s),this}exponentialRampToValueAtTime(t,e){let n=this._fromType(t);n=fn(n,0)?this._minOutput:n,this._assertRange(n);const s=this.toSeconds(e);return At(isFinite(n)&&isFinite(s),`Invalid argument(s) to exponentialRampToValueAtTime: ${JSON.stringify(t)}, ${JSON.stringify(e)}`),this._events.add({time:s,type:"exponentialRampToValueAtTime",value:n}),this.log(this.units,"exponentialRampToValueAtTime",t,s),this._param.exponentialRampToValueAtTime(n,s),this}exponentialRampTo(t,e,n){return n=this.toSeconds(n),this.setRampPoint(n),this.exponentialRampToValueAtTime(t,n+this.toSeconds(e)),this}linearRampTo(t,e,n){return n=this.toSeconds(n),this.setRampPoint(n),this.linearRampToValueAtTime(t,n+this.toSeconds(e)),this}targetRampTo(t,e,n){return n=this.toSeconds(n),this.setRampPoint(n),this.exponentialApproachValueAtTime(t,n,e),this}exponentialApproachValueAtTime(t,e,n){e=this.toSeconds(e),n=this.toSeconds(n);const s=Math.log(n+1)/Math.log(200);return this.setTargetAtTime(t,e,s),this.cancelAndHoldAtTime(e+n*.9),this.linearRampToValueAtTime(t,e+n),this}setTargetAtTime(t,e,n){const s=this._fromType(t);At(isFinite(n)&&n>0,"timeConstant must be a number greater than 0");const r=this.toSeconds(e);return this._assertRange(s),At(isFinite(s)&&isFinite(r),`Invalid argument(s) to setTargetAtTime: ${JSON.stringify(t)}, ${JSON.stringify(e)}`),this._events.add({constant:n,time:r,type:"setTargetAtTime",value:s}),this.log(this.units,"setTargetAtTime",t,r,n),this._param.setTargetAtTime(s,r,n),this}setValueCurveAtTime(t,e,n,s=1){n=this.toSeconds(n),e=this.toSeconds(e);const r=this._fromType(t[0])*s;this.setValueAtTime(this._toType(r),e);const o=n/(t.length-1);for(let a=1;a<t.length;a++){const c=this._fromType(t[a])*s;this.linearRampToValueAtTime(this._toType(c),e+a*o)}return this}cancelScheduledValues(t){const e=this.toSeconds(t);return At(isFinite(e),`Invalid argument to cancelScheduledValues: ${JSON.stringify(t)}`),this._events.cancel(e),this._param.cancelScheduledValues(e),this.log(this.units,"cancelScheduledValues",e),this}cancelAndHoldAtTime(t){const e=this.toSeconds(t),n=this._fromType(this.getValueAtTime(e));At(isFinite(e),`Invalid argument to cancelAndHoldAtTime: ${JSON.stringify(t)}`),this.log(this.units,"cancelAndHoldAtTime",e,"value="+n);const s=this._events.get(e),r=this._events.getAfter(e);return s&&fn(s.time,e)?r?(this._param.cancelScheduledValues(r.time),this._events.cancel(r.time)):(this._param.cancelAndHoldAtTime(e),this._events.cancel(e+this.sampleTime)):r&&(this._param.cancelScheduledValues(r.time),this._events.cancel(r.time),r.type==="linearRampToValueAtTime"?this.linearRampToValueAtTime(this._toType(n),e):r.type==="exponentialRampToValueAtTime"&&this.exponentialRampToValueAtTime(this._toType(n),e)),this._events.add({time:e,type:"setValueAtTime",value:n}),this._param.setValueAtTime(n,e),this}rampTo(t,e=.1,n){return this.units==="frequency"||this.units==="bpm"||this.units==="decibels"?this.exponentialRampTo(t,e,n):this.linearRampTo(t,e,n),this}apply(t){const e=this.context.currentTime;t.setValueAtTime(this.getValueAtTime(e),e);const n=this._events.get(e);if(n&&n.type==="setTargetAtTime"){const s=this._events.getAfter(n.time),r=s?s.time:e+2,o=(r-e)/10;for(let a=e;a<r;a+=o)t.linearRampToValueAtTime(this.getValueAtTime(a),a)}return this._events.forEachAfter(this.context.currentTime,s=>{s.type==="cancelScheduledValues"?t.cancelScheduledValues(s.time):s.type==="setTargetAtTime"?t.setTargetAtTime(s.value,s.time,s.constant):t[s.type](s.value,s.time)}),this}setParam(t){At(this._swappable,"The Param must be assigned as 'swappable' in the constructor");const e=this.input;return e.disconnect(this._param),this.apply(t),this._param=t,e.connect(this._param),this}dispose(){return super.dispose(),this._events.dispose(),this}get defaultValue(){return this._toType(this._param.defaultValue)}_exponentialApproach(t,e,n,s,r){return n+(e-n)*Math.exp(-(r-t)/s)}_linearInterpolate(t,e,n,s,r){return e+(s-e)*((r-t)/(n-t))}_exponentialInterpolate(t,e,n,s,r){return e*Math.pow(s/e,(r-t)/(n-t))}}class Tt extends Re{constructor(){super(...arguments),this._internalChannels=[]}get numberOfInputs(){return zt(this.input)?ji(this.input)||this.input instanceof Wt?1:this.input.numberOfInputs:0}get numberOfOutputs(){return zt(this.output)?this.output.numberOfOutputs:0}_isAudioNode(t){return zt(t)&&(t instanceof Tt||mi(t))}_getInternalNodes(){const t=this._internalChannels.slice(0);return this._isAudioNode(this.input)&&t.push(this.input),this._isAudioNode(this.output)&&this.input!==this.output&&t.push(this.output),t}_setChannelProperties(t){this._getInternalNodes().forEach(n=>{n.channelCount=t.channelCount,n.channelCountMode=t.channelCountMode,n.channelInterpretation=t.channelInterpretation})}_getChannelProperties(){const t=this._getInternalNodes();At(t.length>0,"ToneAudioNode does not have any internal nodes");const e=t[0];return{channelCount:e.channelCount,channelCountMode:e.channelCountMode,channelInterpretation:e.channelInterpretation}}get channelCount(){return this._getChannelProperties().channelCount}set channelCount(t){const e=this._getChannelProperties();this._setChannelProperties(Object.assign(e,{channelCount:t}))}get channelCountMode(){return this._getChannelProperties().channelCountMode}set channelCountMode(t){const e=this._getChannelProperties();this._setChannelProperties(Object.assign(e,{channelCountMode:t}))}get channelInterpretation(){return this._getChannelProperties().channelInterpretation}set channelInterpretation(t){const e=this._getChannelProperties();this._setChannelProperties(Object.assign(e,{channelInterpretation:t}))}connect(t,e=0,n=0){return Mn(this,t,e,n),this}toDestination(){return this.connect(this.context.destination),this}toMaster(){return Ca("toMaster() has been renamed toDestination()"),this.toDestination()}disconnect(t,e=0,n=0){return Bd(this,t,e,n),this}chain(...t){return $i(this,...t),this}fan(...t){return t.forEach(e=>this.connect(e)),this}dispose(){return super.dispose(),zt(this.input)&&(this.input instanceof Tt?this.input.dispose():mi(this.input)&&this.input.disconnect()),zt(this.output)&&(this.output instanceof Tt?this.output.dispose():mi(this.output)&&this.output.disconnect()),this._internalChannels=[],this}}function $i(...i){const t=i.shift();i.reduce((e,n)=>(e instanceof Tt?e.connect(n):mi(e)&&Mn(e,n),n),t)}function Mn(i,t,e=0,n=0){for(At(zt(i),"Cannot connect from undefined node"),At(zt(t),"Cannot connect to undefined node"),(t instanceof Tt||mi(t))&&At(t.numberOfInputs>0,"Cannot connect to node with no inputs"),At(i.numberOfOutputs>0,"Cannot connect from node with no outputs");t instanceof Tt||t instanceof Wt;)zt(t.input)&&(t=t.input);for(;i instanceof Tt;)zt(i.output)&&(i=i.output);ji(t)?i.connect(t,e):i.connect(t,e,n)}function Bd(i,t,e=0,n=0){if(zt(t))for(;t instanceof Tt;)t=t.input;for(;!mi(i);)zt(i.output)&&(i=i.output);ji(t)?i.disconnect(t,e):mi(t)?i.disconnect(t,e,n):i.disconnect()}class qt extends Tt{constructor(){super($(qt.getDefaults(),arguments,["gain","units"])),this.name="Gain",this._gainNode=this.context.createGain(),this.input=this._gainNode,this.output=this._gainNode;const t=$(qt.getDefaults(),arguments,["gain","units"]);this.gain=new Wt({context:this.context,convert:t.convert,param:this._gainNode.gain,units:t.units,value:t.gain,minValue:t.minValue,maxValue:t.maxValue}),$t(this,"gain")}static getDefaults(){return Object.assign(Tt.getDefaults(),{convert:!0,gain:1,units:"gain"})}dispose(){return super.dispose(),this._gainNode.disconnect(),this.gain.dispose(),this}}class Fs extends Tt{constructor(t){super(t),this.onended=jt,this._startTime=-1,this._stopTime=-1,this._timeout=-1,this.output=new qt({context:this.context,gain:0}),this._gainNode=this.output,this.getStateAtTime=function(e){const n=this.toSeconds(e);return this._startTime!==-1&&n>=this._startTime&&(this._stopTime===-1||n<=this._stopTime)?"started":"stopped"},this._fadeIn=t.fadeIn,this._fadeOut=t.fadeOut,this._curve=t.curve,this.onended=t.onended}static getDefaults(){return Object.assign(Tt.getDefaults(),{curve:"linear",fadeIn:0,fadeOut:0,onended:jt})}_startGain(t,e=1){At(this._startTime===-1,"Source cannot be started more than once");const n=this.toSeconds(this._fadeIn);return this._startTime=t+n,this._startTime=Math.max(this._startTime,this.context.currentTime),n>0?(this._gainNode.gain.setValueAtTime(0,t),this._curve==="linear"?this._gainNode.gain.linearRampToValueAtTime(e,t+n):this._gainNode.gain.exponentialApproachValueAtTime(e,t,n)):this._gainNode.gain.setValueAtTime(e,t),this}stop(t){return this.log("stop",t),this._stopGain(this.toSeconds(t)),this}_stopGain(t){At(this._startTime!==-1,"'start' must be called before 'stop'"),this.cancelStop();const e=this.toSeconds(this._fadeOut);return this._stopTime=this.toSeconds(t)+e,this._stopTime=Math.max(this._stopTime,this.now()),e>0?this._curve==="linear"?this._gainNode.gain.linearRampTo(0,e,t):this._gainNode.gain.targetRampTo(0,e,t):(this._gainNode.gain.cancelAndHoldAtTime(t),this._gainNode.gain.setValueAtTime(0,t)),this.context.clearTimeout(this._timeout),this._timeout=this.context.setTimeout(()=>{const n=this._curve==="exponential"?e*2:0;this._stopSource(this.now()+n),this._onended()},this._stopTime-this.context.currentTime),this}_onended(){if(this.onended!==jt&&(this.onended(this),this.onended=jt,!this.context.isOffline)){const t=()=>this.dispose();typeof window.requestIdleCallback<"u"?window.requestIdleCallback(t):setTimeout(t,1e3)}}get state(){return this.getStateAtTime(this.now())}cancelStop(){return this.log("cancelStop"),At(this._startTime!==-1,"Source is not started"),this._gainNode.gain.cancelScheduledValues(this._startTime+this.sampleTime),this.context.clearTimeout(this._timeout),this._stopTime=-1,this}dispose(){return super.dispose(),this._gainNode.dispose(),this.onended=jt,this}}class Yo extends Fs{constructor(){super($(Yo.getDefaults(),arguments,["offset"])),this.name="ToneConstantSource",this._source=this.context.createConstantSource();const t=$(Yo.getDefaults(),arguments,["offset"]);Mn(this._source,this._gainNode),this.offset=new Wt({context:this.context,convert:t.convert,param:this._source.offset,units:t.units,value:t.offset,minValue:t.minValue,maxValue:t.maxValue})}static getDefaults(){return Object.assign(Fs.getDefaults(),{convert:!0,offset:1,units:"number"})}start(t){const e=this.toSeconds(t);return this.log("start",e),this._startGain(e),this._source.start(e),this}_stopSource(t){this._source.stop(t)}dispose(){return super.dispose(),this.state==="started"&&this.stop(),this._source.disconnect(),this.offset.dispose(),this}}class ie extends Tt{constructor(){super($(ie.getDefaults(),arguments,["value","units"])),this.name="Signal",this.override=!0;const t=$(ie.getDefaults(),arguments,["value","units"]);this.output=this._constantSource=new Yo({context:this.context,convert:t.convert,offset:t.value,units:t.units,minValue:t.minValue,maxValue:t.maxValue}),this._constantSource.start(0),this.input=this._param=this._constantSource.offset}static getDefaults(){return Object.assign(Tt.getDefaults(),{convert:!0,units:"number",value:0})}connect(t,e=0,n=0){return La(this,t,e,n),this}dispose(){return super.dispose(),this._param.dispose(),this._constantSource.dispose(),this}setValueAtTime(t,e){return this._param.setValueAtTime(t,e),this}getValueAtTime(t){return this._param.getValueAtTime(t)}setRampPoint(t){return this._param.setRampPoint(t),this}linearRampToValueAtTime(t,e){return this._param.linearRampToValueAtTime(t,e),this}exponentialRampToValueAtTime(t,e){return this._param.exponentialRampToValueAtTime(t,e),this}exponentialRampTo(t,e,n){return this._param.exponentialRampTo(t,e,n),this}linearRampTo(t,e,n){return this._param.linearRampTo(t,e,n),this}targetRampTo(t,e,n){return this._param.targetRampTo(t,e,n),this}exponentialApproachValueAtTime(t,e,n){return this._param.exponentialApproachValueAtTime(t,e,n),this}setTargetAtTime(t,e,n){return this._param.setTargetAtTime(t,e,n),this}setValueCurveAtTime(t,e,n,s){return this._param.setValueCurveAtTime(t,e,n,s),this}cancelScheduledValues(t){return this._param.cancelScheduledValues(t),this}cancelAndHoldAtTime(t){return this._param.cancelAndHoldAtTime(t),this}rampTo(t,e,n){return this._param.rampTo(t,e,n),this}get value(){return this._param.value}set value(t){this._param.value=t}get convert(){return this._param.convert}set convert(t){this._param.convert=t}get units(){return this._param.units}get overridden(){return this._param.overridden}set overridden(t){this._param.overridden=t}get maxValue(){return this._param.maxValue}get minValue(){return this._param.minValue}apply(t){return this._param.apply(t),this}}function La(i,t,e,n){(t instanceof Wt||ji(t)||t instanceof ie&&t.override)&&(t.cancelScheduledValues(0),t.setValueAtTime(0,0),t instanceof ie&&(t.overridden=!0)),Mn(i,t,e,n)}class jo extends Wt{constructor(){super($(jo.getDefaults(),arguments,["value"])),this.name="TickParam",this._events=new an(1/0),this._multiplier=1;const t=$(jo.getDefaults(),arguments,["value"]);this._multiplier=t.multiplier,this._events.cancel(0),this._events.add({ticks:0,time:0,type:"setValueAtTime",value:this._fromType(t.value)}),this.setValueAtTime(t.value,0)}static getDefaults(){return Object.assign(Wt.getDefaults(),{multiplier:1,units:"hertz",value:1})}setTargetAtTime(t,e,n){e=this.toSeconds(e),this.setRampPoint(e);const s=this._fromType(t),r=this._events.get(e),o=Math.round(Math.max(1/n,1));for(let a=0;a<=o;a++){const c=n*a+e,l=this._exponentialApproach(r.time,r.value,s,n,c);this.linearRampToValueAtTime(this._toType(l),c)}return this}setValueAtTime(t,e){const n=this.toSeconds(e);super.setValueAtTime(t,e);const s=this._events.get(n),r=this._events.previousEvent(s),o=this._getTicksUntilEvent(r,n);return s.ticks=Math.max(o,0),this}linearRampToValueAtTime(t,e){const n=this.toSeconds(e);super.linearRampToValueAtTime(t,e);const s=this._events.get(n),r=this._events.previousEvent(s),o=this._getTicksUntilEvent(r,n);return s.ticks=Math.max(o,0),this}exponentialRampToValueAtTime(t,e){e=this.toSeconds(e);const n=this._fromType(t),s=this._events.get(e),r=Math.round(Math.max((e-s.time)*10,1)),o=(e-s.time)/r;for(let a=0;a<=r;a++){const c=o*a+s.time,l=this._exponentialInterpolate(s.time,s.value,e,n,c);this.linearRampToValueAtTime(this._toType(l),c)}return this}_getTicksUntilEvent(t,e){if(t===null)t={ticks:0,time:0,type:"setValueAtTime",value:0};else if(on(t.ticks)){const o=this._events.previousEvent(t);t.ticks=this._getTicksUntilEvent(o,t.time)}const n=this._fromType(this.getValueAtTime(t.time));let s=this._fromType(this.getValueAtTime(e));const r=this._events.get(e);return r&&r.time===e&&r.type==="setValueAtTime"&&(s=this._fromType(this.getValueAtTime(e-this.sampleTime))),.5*(e-t.time)*(n+s)+t.ticks}getTicksAtTime(t){const e=this.toSeconds(t),n=this._events.get(e);return Math.max(this._getTicksUntilEvent(n,e),0)}getDurationOfTicks(t,e){const n=this.toSeconds(e),s=this.getTicksAtTime(e);return this.getTimeOfTick(s+t)-n}getTimeOfTick(t){const e=this._events.get(t,"ticks"),n=this._events.getAfter(t,"ticks");if(e&&e.ticks===t)return e.time;if(e&&n&&n.type==="linearRampToValueAtTime"&&e.value!==n.value){const s=this._fromType(this.getValueAtTime(e.time)),o=(this._fromType(this.getValueAtTime(n.time))-s)/(n.time-e.time),a=Math.sqrt(Math.pow(s,2)-2*o*(e.ticks-t)),c=(-s+a)/o,l=(-s-a)/o;return(c>0?c:l)+e.time}else return e?e.value===0?1/0:e.time+(t-e.ticks)/e.value:t/this._initialValue}ticksToTime(t,e){return this.getDurationOfTicks(t,e)}timeToTicks(t,e){const n=this.toSeconds(e),s=this.toSeconds(t),r=this.getTicksAtTime(n);return this.getTicksAtTime(n+s)-r}_fromType(t){return this.units==="bpm"&&this.multiplier?1/(60/t/this.multiplier):super._fromType(t)}_toType(t){return this.units==="bpm"&&this.multiplier?t/this.multiplier*60:super._toType(t)}get multiplier(){return this._multiplier}set multiplier(t){const e=this.value;this._multiplier=t,this.cancelScheduledValues(0),this.setValueAtTime(e,0)}}class $o extends ie{constructor(){super($($o.getDefaults(),arguments,["value"])),this.name="TickSignal";const t=$($o.getDefaults(),arguments,["value"]);this.input=this._param=new jo({context:this.context,convert:t.convert,multiplier:t.multiplier,param:this._constantSource.offset,units:t.units,value:t.value})}static getDefaults(){return Object.assign(ie.getDefaults(),{multiplier:1,units:"hertz",value:1})}ticksToTime(t,e){return this._param.ticksToTime(t,e)}timeToTicks(t,e){return this._param.timeToTicks(t,e)}getTimeOfTick(t){return this._param.getTimeOfTick(t)}getDurationOfTicks(t,e){return this._param.getDurationOfTicks(t,e)}getTicksAtTime(t){return this._param.getTicksAtTime(t)}get multiplier(){return this._param.multiplier}set multiplier(t){this._param.multiplier=t}dispose(){return super.dispose(),this._param.dispose(),this}}class Zo extends Re{constructor(){super($(Zo.getDefaults(),arguments,["frequency"])),this.name="TickSource",this._state=new Na,this._tickOffset=new an,this._ticksAtTime=new an,this._secondsAtTime=new an;const t=$(Zo.getDefaults(),arguments,["frequency"]);this.frequency=new $o({context:this.context,units:t.units,value:t.frequency}),$t(this,"frequency"),this._state.setStateAtTime("stopped",0),this.setTicksAtTime(0,0)}static getDefaults(){return Object.assign({frequency:1,units:"hertz"},Re.getDefaults())}get state(){return this.getStateAtTime(this.now())}start(t,e){const n=this.toSeconds(t);return this._state.getValueAtTime(n)!=="started"&&(this._state.setStateAtTime("started",n),zt(e)&&this.setTicksAtTime(e,n),this._ticksAtTime.cancel(n),this._secondsAtTime.cancel(n)),this}stop(t){const e=this.toSeconds(t);if(this._state.getValueAtTime(e)==="stopped"){const n=this._state.get(e);n&&n.time>0&&(this._tickOffset.cancel(n.time),this._state.cancel(n.time))}return this._state.cancel(e),this._state.setStateAtTime("stopped",e),this.setTicksAtTime(0,e),this._ticksAtTime.cancel(e),this._secondsAtTime.cancel(e),this}pause(t){const e=this.toSeconds(t);return this._state.getValueAtTime(e)==="started"&&(this._state.setStateAtTime("paused",e),this._ticksAtTime.cancel(e),this._secondsAtTime.cancel(e)),this}cancel(t){return t=this.toSeconds(t),this._state.cancel(t),this._tickOffset.cancel(t),this._ticksAtTime.cancel(t),this._secondsAtTime.cancel(t),this}getTicksAtTime(t){const e=this.toSeconds(t),n=this._state.getLastState("stopped",e),s=this._ticksAtTime.get(e),r={state:"paused",time:e};this._state.add(r);let o=s||n,a=s?s.ticks:0,c=null;return this._state.forEachBetween(o.time,e+this.sampleTime,l=>{let u=o.time;const h=this._tickOffset.get(l.time);h&&h.time>=o.time&&(a=h.ticks,u=h.time),o.state==="started"&&l.state!=="started"&&(a+=this.frequency.getTicksAtTime(l.time)-this.frequency.getTicksAtTime(u),l.time!==r.time&&(c={state:l.state,time:l.time,ticks:a})),o=l}),this._state.remove(r),c&&this._ticksAtTime.add(c),a}get ticks(){return this.getTicksAtTime(this.now())}set ticks(t){this.setTicksAtTime(t,this.now())}get seconds(){return this.getSecondsAtTime(this.now())}set seconds(t){const e=this.now(),n=this.frequency.timeToTicks(t,e);this.setTicksAtTime(n,e)}getSecondsAtTime(t){t=this.toSeconds(t);const e=this._state.getLastState("stopped",t),n={state:"paused",time:t};this._state.add(n);const s=this._secondsAtTime.get(t);let r=s||e,o=s?s.seconds:0,a=null;return this._state.forEachBetween(r.time,t+this.sampleTime,c=>{let l=r.time;const u=this._tickOffset.get(c.time);u&&u.time>=r.time&&(o=u.seconds,l=u.time),r.state==="started"&&c.state!=="started"&&(o+=c.time-l,c.time!==n.time&&(a={state:c.state,time:c.time,seconds:o})),r=c}),this._state.remove(n),a&&this._secondsAtTime.add(a),o}setTicksAtTime(t,e){return e=this.toSeconds(e),this._tickOffset.cancel(e),this._tickOffset.add({seconds:this.frequency.getDurationOfTicks(t,e),ticks:t,time:e}),this._ticksAtTime.cancel(e),this._secondsAtTime.cancel(e),this}getStateAtTime(t){return t=this.toSeconds(t),this._state.getValueAtTime(t)}getTimeOfTick(t,e=this.now()){const n=this._tickOffset.get(e),s=this._state.get(e),r=Math.max(n.time,s.time),o=this.frequency.getTicksAtTime(r)+t-n.ticks;return this.frequency.getTimeOfTick(o)}forEachTickBetween(t,e,n){let s=this._state.get(t);this._state.forEachBetween(t,e,o=>{s&&s.state==="started"&&o.state!=="started"&&this.forEachTickBetween(Math.max(s.time,t),o.time-this.sampleTime,n),s=o});let r=null;if(s&&s.state==="started"){const o=Math.max(s.time,t),a=this.frequency.getTicksAtTime(o),c=this.frequency.getTicksAtTime(s.time),l=a-c;let u=Math.ceil(l)-l;u=fn(u,1)?0:u;let h=this.frequency.getTimeOfTick(a+u);for(;h<e;){try{n(h,Math.round(this.getTicksAtTime(h)))}catch(d){r=d;break}h+=this.frequency.getDurationOfTicks(1,h)}}if(r)throw r;return this}dispose(){return super.dispose(),this._state.dispose(),this._tickOffset.dispose(),this._ticksAtTime.dispose(),this._secondsAtTime.dispose(),this.frequency.dispose(),this}}class vr extends Re{constructor(){super($(vr.getDefaults(),arguments,["callback","frequency"])),this.name="Clock",this.callback=jt,this._lastUpdate=0,this._state=new Na("stopped"),this._boundLoop=this._loop.bind(this);const t=$(vr.getDefaults(),arguments,["callback","frequency"]);this.callback=t.callback,this._tickSource=new Zo({context:this.context,frequency:t.frequency,units:t.units}),this._lastUpdate=0,this.frequency=this._tickSource.frequency,$t(this,"frequency"),this._state.setStateAtTime("stopped",0),this.context.on("tick",this._boundLoop)}static getDefaults(){return Object.assign(Re.getDefaults(),{callback:jt,frequency:1,units:"hertz"})}get state(){return this._state.getValueAtTime(this.now())}start(t,e){Rd(this.context);const n=this.toSeconds(t);return this.log("start",n),this._state.getValueAtTime(n)!=="started"&&(this._state.setStateAtTime("started",n),this._tickSource.start(n,e),n<this._lastUpdate&&this.emit("start",n,e)),this}stop(t){const e=this.toSeconds(t);return this.log("stop",e),this._state.cancel(e),this._state.setStateAtTime("stopped",e),this._tickSource.stop(e),e<this._lastUpdate&&this.emit("stop",e),this}pause(t){const e=this.toSeconds(t);return this._state.getValueAtTime(e)==="started"&&(this._state.setStateAtTime("paused",e),this._tickSource.pause(e),e<this._lastUpdate&&this.emit("pause",e)),this}get ticks(){return Math.ceil(this.getTicksAtTime(this.now()))}set ticks(t){this._tickSource.ticks=t}get seconds(){return this._tickSource.seconds}set seconds(t){this._tickSource.seconds=t}getSecondsAtTime(t){return this._tickSource.getSecondsAtTime(t)}setTicksAtTime(t,e){return this._tickSource.setTicksAtTime(t,e),this}getTimeOfTick(t,e=this.now()){return this._tickSource.getTimeOfTick(t,e)}getTicksAtTime(t){return this._tickSource.getTicksAtTime(t)}nextTickTime(t,e){const n=this.toSeconds(e),s=this.getTicksAtTime(n);return this._tickSource.getTimeOfTick(s+t,n)}_loop(){const t=this._lastUpdate,e=this.now();this._lastUpdate=e,this.log("loop",t,e),t!==e&&(this._state.forEachBetween(t,e,n=>{switch(n.state){case"started":const s=this._tickSource.getTicksAtTime(n.time);this.emit("start",n.time,s);break;case"stopped":n.time!==0&&this.emit("stop",n.time);break;case"paused":this.emit("pause",n.time);break}}),this._tickSource.forEachTickBetween(t,e,(n,s)=>{this.callback(n,s)}))}getStateAtTime(t){const e=this.toSeconds(t);return this._state.getValueAtTime(e)}dispose(){return super.dispose(),this.context.off("tick",this._boundLoop),this._tickSource.dispose(),this._state.dispose(),this}}Vr.mixin(vr);class ks extends Tt{constructor(){super($(ks.getDefaults(),arguments,["delayTime","maxDelay"])),this.name="Delay";const t=$(ks.getDefaults(),arguments,["delayTime","maxDelay"]),e=this.toSeconds(t.maxDelay);this._maxDelay=Math.max(e,this.toSeconds(t.delayTime)),this._delayNode=this.input=this.output=this.context.createDelay(e),this.delayTime=new Wt({context:this.context,param:this._delayNode.delayTime,units:"time",value:t.delayTime,minValue:0,maxValue:this.maxDelay}),$t(this,"delayTime")}static getDefaults(){return Object.assign(Tt.getDefaults(),{delayTime:0,maxDelay:1})}get maxDelay(){return this._maxDelay}dispose(){return super.dispose(),this._delayNode.disconnect(),this.delayTime.dispose(),this}}class Ul extends ii{constructor(){super(),this.name="ToneAudioBuffers",this._buffers=new Map,this._loadingCount=0;const t=$(Ul.getDefaults(),arguments,["urls","onload","baseUrl"],"urls");this.baseUrl=t.baseUrl,Object.keys(t.urls).forEach(e=>{this._loadingCount++;const n=t.urls[e];this.add(e,n,this._bufferLoaded.bind(this,t.onload),t.onerror)})}static getDefaults(){return{baseUrl:"",onerror:jt,onload:jt,urls:{}}}has(t){return this._buffers.has(t.toString())}get(t){return At(this.has(t),`ToneAudioBuffers has no buffer named: ${t}`),this._buffers.get(t.toString())}_bufferLoaded(t){this._loadingCount--,this._loadingCount===0&&t&&t()}get loaded(){return Array.from(this._buffers).every(([t,e])=>e.loaded)}add(t,e,n=jt,s=jt){return Qn(e)?(this.baseUrl&&e.trim().substring(0,11).toLowerCase()==="data:audio/"&&(this.baseUrl=""),this._buffers.set(t.toString(),new se(this.baseUrl+e,n,s))):this._buffers.set(t.toString(),new se(e,n,s)),this}dispose(){return super.dispose(),this._buffers.forEach(t=>t.dispose()),this._buffers.clear(),this}}class Ko extends Je{constructor(){super(...arguments),this.name="MidiClass",this.defaultUnits="midi"}_frequencyToUnits(t){return Bi(super._frequencyToUnits(t))}_ticksToUnits(t){return Bi(super._ticksToUnits(t))}_beatsToUnits(t){return Bi(super._beatsToUnits(t))}_secondsToUnits(t){return Bi(super._secondsToUnits(t))}toMidi(){return this.valueOf()}toFrequency(){return kd(this.toMidi())}transpose(t){return new Ko(this.context,this.toMidi()+t)}}class nn extends dr{constructor(){super(...arguments),this.name="Ticks",this.defaultUnits="i"}_now(){return this.context.transport.ticks}_beatsToUnits(t){return this._getPPQ()*t}_secondsToUnits(t){return Math.floor(t/(60/this._getBpm())*this._getPPQ())}_ticksToUnits(t){return t}toTicks(){return this.valueOf()}toSeconds(){return this.valueOf()/this._getPPQ()*(60/this._getBpm())}}class g0 extends Re{constructor(){super(...arguments),this.name="Draw",this.expiration=.25,this.anticipation=.008,this._events=new an,this._boundDrawLoop=this._drawLoop.bind(this),this._animationFrame=-1}schedule(t,e){return this._events.add({callback:t,time:this.toSeconds(e)}),this._events.length===1&&(this._animationFrame=requestAnimationFrame(this._boundDrawLoop)),this}cancel(t){return this._events.cancel(this.toSeconds(t)),this}_drawLoop(){const t=this.context.currentTime;for(;this._events.length&&this._events.peek().time-this.anticipation<=t;){const e=this._events.shift();e&&t-e.time<=this.expiration&&e.callback()}this._events.length>0&&(this._animationFrame=requestAnimationFrame(this._boundDrawLoop))}dispose(){return super.dispose(),this._events.dispose(),cancelAnimationFrame(this._animationFrame),this}}Ra(i=>{i.draw=new g0({context:i})});Da(i=>{i.draw.dispose()});class v0 extends ii{constructor(){super(...arguments),this.name="IntervalTimeline",this._root=null,this._length=0}add(t){At(zt(t.time),"Events must have a time property"),At(zt(t.duration),"Events must have a duration parameter"),t.time=t.time.valueOf();let e=new x0(t.time,t.time+t.duration,t);for(this._root===null?this._root=e:this._root.insert(e),this._length++;e!==null;)e.updateHeight(),e.updateMax(),this._rebalance(e),e=e.parent;return this}remove(t){if(this._root!==null){const e=[];this._root.search(t.time,e);for(const n of e)if(n.event===t){this._removeNode(n),this._length--;break}}return this}get length(){return this._length}cancel(t){return this.forEachFrom(t,e=>this.remove(e)),this}_setRoot(t){this._root=t,this._root!==null&&(this._root.parent=null)}_replaceNodeInParent(t,e){t.parent!==null?(t.isLeftChild()?t.parent.left=e:t.parent.right=e,this._rebalance(t.parent)):this._setRoot(e)}_removeNode(t){if(t.left===null&&t.right===null)this._replaceNodeInParent(t,null);else if(t.right===null)this._replaceNodeInParent(t,t.left);else if(t.left===null)this._replaceNodeInParent(t,t.right);else{const e=t.getBalance();let n,s=null;if(e>0)if(t.left.right===null)n=t.left,n.right=t.right,s=n;else{for(n=t.left.right;n.right!==null;)n=n.right;n.parent&&(n.parent.right=n.left,s=n.parent,n.left=t.left,n.right=t.right)}else if(t.right.left===null)n=t.right,n.left=t.left,s=n;else{for(n=t.right.left;n.left!==null;)n=n.left;n.parent&&(n.parent.left=n.right,s=n.parent,n.left=t.left,n.right=t.right)}t.parent!==null?t.isLeftChild()?t.parent.left=n:t.parent.right=n:this._setRoot(n),s&&this._rebalance(s)}t.dispose()}_rotateLeft(t){const e=t.parent,n=t.isLeftChild(),s=t.right;s&&(t.right=s.left,s.left=t),e!==null?n?e.left=s:e.right=s:this._setRoot(s)}_rotateRight(t){const e=t.parent,n=t.isLeftChild(),s=t.left;s&&(t.left=s.right,s.right=t),e!==null?n?e.left=s:e.right=s:this._setRoot(s)}_rebalance(t){const e=t.getBalance();e>1&&t.left?t.left.getBalance()<0?this._rotateLeft(t.left):this._rotateRight(t):e<-1&&t.right&&(t.right.getBalance()>0?this._rotateRight(t.right):this._rotateLeft(t))}get(t){if(this._root!==null){const e=[];if(this._root.search(t,e),e.length>0){let n=e[0];for(let s=1;s<e.length;s++)e[s].low>n.low&&(n=e[s]);return n.event}}return null}forEach(t){if(this._root!==null){const e=[];this._root.traverse(n=>e.push(n)),e.forEach(n=>{n.event&&t(n.event)})}return this}forEachAtTime(t,e){if(this._root!==null){const n=[];this._root.search(t,n),n.forEach(s=>{s.event&&e(s.event)})}return this}forEachFrom(t,e){if(this._root!==null){const n=[];this._root.searchAfter(t,n),n.forEach(s=>{s.event&&e(s.event)})}return this}dispose(){return super.dispose(),this._root!==null&&this._root.traverse(t=>t.dispose()),this._root=null,this}}class x0{constructor(t,e,n){this._left=null,this._right=null,this.parent=null,this.height=0,this.event=n,this.low=t,this.high=e,this.max=this.high}insert(t){t.low<=this.low?this.left===null?this.left=t:this.left.insert(t):this.right===null?this.right=t:this.right.insert(t)}search(t,e){t>this.max||(this.left!==null&&this.left.search(t,e),this.low<=t&&this.high>t&&e.push(this),!(this.low>t)&&this.right!==null&&this.right.search(t,e))}searchAfter(t,e){this.low>=t&&(e.push(this),this.left!==null&&this.left.searchAfter(t,e)),this.right!==null&&this.right.searchAfter(t,e)}traverse(t){t(this),this.left!==null&&this.left.traverse(t),this.right!==null&&this.right.traverse(t)}updateHeight(){this.left!==null&&this.right!==null?this.height=Math.max(this.left.height,this.right.height)+1:this.right!==null?this.height=this.right.height+1:this.left!==null?this.height=this.left.height+1:this.height=0}updateMax(){this.max=this.high,this.left!==null&&(this.max=Math.max(this.max,this.left.max)),this.right!==null&&(this.max=Math.max(this.max,this.right.max))}getBalance(){let t=0;return this.left!==null&&this.right!==null?t=this.left.height-this.right.height:this.left!==null?t=this.left.height+1:this.right!==null&&(t=-(this.right.height+1)),t}isLeftChild(){return this.parent!==null&&this.parent.left===this}get left(){return this._left}set left(t){this._left=t,t!==null&&(t.parent=this),this.updateHeight(),this.updateMax()}get right(){return this._right}set right(t){this._right=t,t!==null&&(t.parent=this),this.updateHeight(),this.updateMax()}dispose(){this.parent=null,this._left=null,this._right=null,this.event=null}}class Zi extends Tt{constructor(){super($(Zi.getDefaults(),arguments,["volume"])),this.name="Volume";const t=$(Zi.getDefaults(),arguments,["volume"]);this.input=this.output=new qt({context:this.context,gain:t.volume,units:"decibels"}),this.volume=this.output.gain,$t(this,"volume"),this._unmutedVolume=t.volume,this.mute=t.mute}static getDefaults(){return Object.assign(Tt.getDefaults(),{mute:!1,volume:0})}get mute(){return this.volume.value===-1/0}set mute(t){!this.mute&&t?(this._unmutedVolume=this.volume.value,this.volume.value=-1/0):this.mute&&!t&&(this.volume.value=this._unmutedVolume)}dispose(){return super.dispose(),this.input.dispose(),this.volume.dispose(),this}}class Jo extends Tt{constructor(){super($(Jo.getDefaults(),arguments)),this.name="Destination",this.input=new Zi({context:this.context}),this.output=new qt({context:this.context}),this.volume=this.input.volume;const t=$(Jo.getDefaults(),arguments);$i(this.input,this.output,this.context.rawContext.destination),this.mute=t.mute,this._internalChannels=[this.input,this.context.rawContext.destination,this.output]}static getDefaults(){return Object.assign(Tt.getDefaults(),{mute:!1,volume:0})}get mute(){return this.input.mute}set mute(t){this.input.mute=t}chain(...t){return this.input.disconnect(),t.unshift(this.input),t.push(this.output),$i(...t),this}get maxChannelCount(){return this.context.rawContext.destination.maxChannelCount}dispose(){return super.dispose(),this.volume.dispose(),this}}Ra(i=>{i.destination=new Jo({context:i})});Da(i=>{i.destination.dispose()});class y0 extends ii{constructor(t){super(),this.name="TimelineValue",this._timeline=new an({memory:10}),this._initialValue=t}set(t,e){return this._timeline.add({value:t,time:e}),this}get(t){const e=this._timeline.get(t);return e?e.value:this._initialValue}}class Nn extends Tt{constructor(){super(Object.assign($(Nn.getDefaults(),arguments,["context"])))}connect(t,e=0,n=0){return La(this,t,e,n),this}}class Ki extends Nn{constructor(){super(Object.assign($(Ki.getDefaults(),arguments,["mapping","length"]))),this.name="WaveShaper",this._shaper=this.context.createWaveShaper(),this.input=this._shaper,this.output=this._shaper;const t=$(Ki.getDefaults(),arguments,["mapping","length"]);Qe(t.mapping)||t.mapping instanceof Float32Array?this.curve=Float32Array.from(t.mapping):jv(t.mapping)&&this.setMap(t.mapping,t.length)}static getDefaults(){return Object.assign(ie.getDefaults(),{length:1024})}setMap(t,e=1024){const n=new Float32Array(e);for(let s=0,r=e;s<r;s++){const o=s/(r-1)*2-1;n[s]=t(o,s)}return this.curve=n,this}get curve(){return this._shaper.curve}set curve(t){this._shaper.curve=t}get oversample(){return this._shaper.oversample}set oversample(t){const e=["none","2x","4x"].some(n=>n.includes(t));At(e,"oversampling must be either 'none', '2x', or '4x'"),this._shaper.oversample=t}dispose(){return super.dispose(),this._shaper.disconnect(),this}}class Qo extends Nn{constructor(){super(Object.assign($(Qo.getDefaults(),arguments,["value"]))),this.name="Pow";const t=$(Qo.getDefaults(),arguments,["value"]);this._exponentScaler=this.input=this.output=new Ki({context:this.context,mapping:this._expFunc(t.value),length:8192}),this._exponent=t.value}static getDefaults(){return Object.assign(Nn.getDefaults(),{value:1})}_expFunc(t){return e=>Math.pow(Math.abs(e),t)}get value(){return this._exponent}set value(t){this._exponent=t,this._exponentScaler.setMap(this._expFunc(this._exponent))}dispose(){return super.dispose(),this._exponentScaler.dispose(),this}}class vi{constructor(t,e){this.id=vi._eventId++,this._remainderTime=0;const n=Object.assign(vi.getDefaults(),e);this.transport=t,this.callback=n.callback,this._once=n.once,this.time=Math.floor(n.time),this._remainderTime=n.time-this.time}static getDefaults(){return{callback:jt,once:!1,time:0}}get floatTime(){return this.time+this._remainderTime}invoke(t){if(this.callback){const e=this.transport.bpm.getDurationOfTicks(1,t);this.callback(t+this._remainderTime*e),this._once&&this.transport.clear(this.id)}}dispose(){return this.callback=void 0,this}}vi._eventId=0;class Fl extends vi{constructor(t,e){super(t,e),this._currentId=-1,this._nextId=-1,this._nextTick=this.time,this._boundRestart=this._restart.bind(this);const n=Object.assign(Fl.getDefaults(),e);this.duration=n.duration,this._interval=n.interval,this._nextTick=n.time,this.transport.on("start",this._boundRestart),this.transport.on("loopStart",this._boundRestart),this.transport.on("ticks",this._boundRestart),this.context=this.transport.context,this._restart()}static getDefaults(){return Object.assign({},vi.getDefaults(),{duration:1/0,interval:1,once:!1})}invoke(t){this._createEvents(t),super.invoke(t)}_createEvent(){return Xo(this._nextTick,this.floatTime+this.duration)?this.transport.scheduleOnce(this.invoke.bind(this),new nn(this.context,this._nextTick).toSeconds()):-1}_createEvents(t){Xo(this._nextTick+this._interval,this.floatTime+this.duration)&&(this._nextTick+=this._interval,this._currentId=this._nextId,this._nextId=this.transport.scheduleOnce(this.invoke.bind(this),new nn(this.context,this._nextTick).toSeconds()))}_restart(t){this.transport.clear(this._currentId),this.transport.clear(this._nextId),this._nextTick=this.floatTime;const e=this.transport.getTicksAtTime(t);Us(e,this.time)&&(this._nextTick=this.floatTime+Math.ceil((e-this.floatTime)/this._interval)*this._interval),this._currentId=this._createEvent(),this._nextTick+=this._interval,this._nextId=this._createEvent()}dispose(){return super.dispose(),this.transport.clear(this._currentId),this.transport.clear(this._nextId),this.transport.off("start",this._boundRestart),this.transport.off("loopStart",this._boundRestart),this.transport.off("ticks",this._boundRestart),this}}class xr extends Re{constructor(){super($(xr.getDefaults(),arguments)),this.name="Transport",this._loop=new y0(!1),this._loopStart=0,this._loopEnd=0,this._scheduledEvents={},this._timeline=new an,this._repeatedEvents=new v0,this._syncedSignals=[],this._swingAmount=0;const t=$(xr.getDefaults(),arguments);this._ppq=t.ppq,this._clock=new vr({callback:this._processTick.bind(this),context:this.context,frequency:0,units:"bpm"}),this._bindClockEvents(),this.bpm=this._clock.frequency,this._clock.frequency.multiplier=t.ppq,this.bpm.setValueAtTime(t.bpm,0),$t(this,"bpm"),this._timeSignature=t.timeSignature,this._swingTicks=t.ppq/2}static getDefaults(){return Object.assign(Re.getDefaults(),{bpm:120,loopEnd:"4m",loopStart:0,ppq:192,swing:0,swingSubdivision:"8n",timeSignature:4})}_processTick(t,e){if(this._loop.get(t)&&e>=this._loopEnd&&(this.emit("loopEnd",t),this._clock.setTicksAtTime(this._loopStart,t),e=this._loopStart,this.emit("loopStart",t,this._clock.getSecondsAtTime(t)),this.emit("loop",t)),this._swingAmount>0&&e%this._ppq!==0&&e%(this._swingTicks*2)!==0){const n=e%(this._swingTicks*2)/(this._swingTicks*2),s=Math.sin(n*Math.PI)*this._swingAmount;t+=new nn(this.context,this._swingTicks*2/3).toSeconds()*s}Ru(!0),this._timeline.forEachAtTime(e,n=>n.invoke(t)),Ru(!1)}schedule(t,e){const n=new vi(this,{callback:t,time:new dr(this.context,e).toTicks()});return this._addEvent(n,this._timeline)}scheduleRepeat(t,e,n,s=1/0){const r=new Fl(this,{callback:t,duration:new _n(this.context,s).toTicks(),interval:new _n(this.context,e).toTicks(),time:new dr(this.context,n).toTicks()});return this._addEvent(r,this._repeatedEvents)}scheduleOnce(t,e){const n=new vi(this,{callback:t,once:!0,time:new dr(this.context,e).toTicks()});return this._addEvent(n,this._timeline)}clear(t){if(this._scheduledEvents.hasOwnProperty(t)){const e=this._scheduledEvents[t.toString()];e.timeline.remove(e.event),e.event.dispose(),delete this._scheduledEvents[t.toString()]}return this}_addEvent(t,e){return this._scheduledEvents[t.id.toString()]={event:t,timeline:e},e.add(t),t.id}cancel(t=0){const e=this.toTicks(t);return this._timeline.forEachFrom(e,n=>this.clear(n.id)),this._repeatedEvents.forEachFrom(e,n=>this.clear(n.id)),this}_bindClockEvents(){this._clock.on("start",(t,e)=>{e=new nn(this.context,e).toSeconds(),this.emit("start",t,e)}),this._clock.on("stop",t=>{this.emit("stop",t)}),this._clock.on("pause",t=>{this.emit("pause",t)})}get state(){return this._clock.getStateAtTime(this.now())}start(t,e){this.context.resume();let n;return zt(e)&&(n=this.toTicks(e)),this._clock.start(t,n),this}stop(t){return this._clock.stop(t),this}pause(t){return this._clock.pause(t),this}toggle(t){return t=this.toSeconds(t),this._clock.getStateAtTime(t)!=="started"?this.start(t):this.stop(t),this}get timeSignature(){return this._timeSignature}set timeSignature(t){Qe(t)&&(t=t[0]/t[1]*4),this._timeSignature=t}get loopStart(){return new _n(this.context,this._loopStart,"i").toSeconds()}set loopStart(t){this._loopStart=this.toTicks(t)}get loopEnd(){return new _n(this.context,this._loopEnd,"i").toSeconds()}set loopEnd(t){this._loopEnd=this.toTicks(t)}get loop(){return this._loop.get(this.now())}set loop(t){this._loop.set(t,this.now())}setLoopPoints(t,e){return this.loopStart=t,this.loopEnd=e,this}get swing(){return this._swingAmount}set swing(t){this._swingAmount=t}get swingSubdivision(){return new nn(this.context,this._swingTicks).toNotation()}set swingSubdivision(t){this._swingTicks=this.toTicks(t)}get position(){const t=this.now(),e=this._clock.getTicksAtTime(t);return new nn(this.context,e).toBarsBeatsSixteenths()}set position(t){const e=this.toTicks(t);this.ticks=e}get seconds(){return this._clock.seconds}set seconds(t){const e=this.now(),n=this._clock.frequency.timeToTicks(t,e);this.ticks=n}get progress(){if(this.loop){const t=this.now();return(this._clock.getTicksAtTime(t)-this._loopStart)/(this._loopEnd-this._loopStart)}else return 0}get ticks(){return this._clock.ticks}set ticks(t){if(this._clock.ticks!==t){const e=this.now();if(this.state==="started"){const n=this._clock.getTicksAtTime(e),s=this._clock.frequency.getDurationOfTicks(Math.ceil(n)-n,e),r=e+s;this.emit("stop",r),this._clock.setTicksAtTime(t,r),this.emit("start",r,this._clock.getSecondsAtTime(r))}else this.emit("ticks",e),this._clock.setTicksAtTime(t,e)}}getTicksAtTime(t){return this._clock.getTicksAtTime(t)}getSecondsAtTime(t){return this._clock.getSecondsAtTime(t)}get PPQ(){return this._clock.frequency.multiplier}set PPQ(t){this._clock.frequency.multiplier=t}nextSubdivision(t){if(t=this.toTicks(t),this.state!=="started")return 0;{const e=this.now(),n=this.getTicksAtTime(e),s=t-n%t;return this._clock.nextTickTime(s,e)}}syncSignal(t,e){const n=this.now();let s=this.bpm,r=1/(60/s.getValueAtTime(n)/this.PPQ),o=[];if(t.units==="time"){const c=.015625/r,l=new qt(c),u=new Qo(-1),h=new qt(c);s.chain(l,u,h),s=h,r=1/r,o=[l,u,h]}e||(t.getValueAtTime(n)!==0?e=t.getValueAtTime(n)/r:e=0);const a=new qt(e);return s.connect(a),a.connect(t._param),o.push(a),this._syncedSignals.push({initial:t.value,nodes:o,signal:t}),t.value=0,this}unsyncSignal(t){for(let e=this._syncedSignals.length-1;e>=0;e--){const n=this._syncedSignals[e];n.signal===t&&(n.nodes.forEach(s=>s.dispose()),n.signal.value=n.initial,this._syncedSignals.splice(e,1))}return this}dispose(){return super.dispose(),this._clock.dispose(),Ll(this,"bpm"),this._timeline.dispose(),this._repeatedEvents.dispose(),this}}Vr.mixin(xr);Ra(i=>{i.transport=new xr({context:i})});Da(i=>{i.transport.dispose()});let Oe=class extends Tt{constructor(t){super(t),this.input=void 0,this._state=new Na("stopped"),this._synced=!1,this._scheduled=[],this._syncedStart=jt,this._syncedStop=jt,this._state.memory=100,this._state.increasing=!0,this._volume=this.output=new Zi({context:this.context,mute:t.mute,volume:t.volume}),this.volume=this._volume.volume,$t(this,"volume"),this.onstop=t.onstop}static getDefaults(){return Object.assign(Tt.getDefaults(),{mute:!1,onstop:jt,volume:0})}get state(){return this._synced?this.context.transport.state==="started"?this._state.getValueAtTime(this.context.transport.seconds):"stopped":this._state.getValueAtTime(this.now())}get mute(){return this._volume.mute}set mute(t){this._volume.mute=t}_clampToCurrentTime(t){return this._synced?t:Math.max(t,this.context.currentTime)}start(t,e,n){let s=on(t)&&this._synced?this.context.transport.seconds:this.toSeconds(t);if(s=this._clampToCurrentTime(s),!this._synced&&this._state.getValueAtTime(s)==="started")At(Us(s,this._state.get(s).time),"Start time must be strictly greater than previous start time"),this._state.cancel(s),this._state.setStateAtTime("started",s),this.log("restart",s),this.restart(s,e,n);else if(this.log("start",s),this._state.setStateAtTime("started",s),this._synced){const r=this._state.get(s);r&&(r.offset=this.toSeconds(Xi(e,0)),r.duration=n?this.toSeconds(n):void 0);const o=this.context.transport.schedule(a=>{this._start(a,e,n)},s);this._scheduled.push(o),this.context.transport.state==="started"&&this.context.transport.getSecondsAtTime(this.immediate())>s&&this._syncedStart(this.now(),this.context.transport.seconds)}else Rd(this.context),this._start(s,e,n);return this}stop(t){let e=on(t)&&this._synced?this.context.transport.seconds:this.toSeconds(t);if(e=this._clampToCurrentTime(e),this._state.getValueAtTime(e)==="started"||zt(this._state.getNextState("started",e))){if(this.log("stop",e),!this._synced)this._stop(e);else{const n=this.context.transport.schedule(this._stop.bind(this),e);this._scheduled.push(n)}this._state.cancel(e),this._state.setStateAtTime("stopped",e)}return this}restart(t,e,n){return t=this.toSeconds(t),this._state.getValueAtTime(t)==="started"&&(this._state.cancel(t),this._restart(t,e,n)),this}sync(){return this._synced||(this._synced=!0,this._syncedStart=(t,e)=>{if(Us(e,0)){const n=this._state.get(e);if(n&&n.state==="started"&&n.time!==e){const s=e-this.toSeconds(n.time);let r;n.duration&&(r=this.toSeconds(n.duration)-s),this._start(t,this.toSeconds(n.offset)+s,r)}}},this._syncedStop=t=>{const e=this.context.transport.getSecondsAtTime(Math.max(t-this.sampleTime,0));this._state.getValueAtTime(e)==="started"&&this._stop(t)},this.context.transport.on("start",this._syncedStart),this.context.transport.on("loopStart",this._syncedStart),this.context.transport.on("stop",this._syncedStop),this.context.transport.on("pause",this._syncedStop),this.context.transport.on("loopEnd",this._syncedStop)),this}unsync(){return this._synced&&(this.context.transport.off("stop",this._syncedStop),this.context.transport.off("pause",this._syncedStop),this.context.transport.off("loopEnd",this._syncedStop),this.context.transport.off("start",this._syncedStart),this.context.transport.off("loopStart",this._syncedStart)),this._synced=!1,this._scheduled.forEach(t=>this.context.transport.clear(t)),this._scheduled=[],this._state.cancel(0),this._stop(0),this}dispose(){return super.dispose(),this.onstop=jt,this.unsync(),this._volume.dispose(),this._state.dispose(),this}};class Bs extends Fs{constructor(){super($(Bs.getDefaults(),arguments,["url","onload"])),this.name="ToneBufferSource",this._source=this.context.createBufferSource(),this._internalChannels=[this._source],this._sourceStarted=!1,this._sourceStopped=!1;const t=$(Bs.getDefaults(),arguments,["url","onload"]);Mn(this._source,this._gainNode),this._source.onended=()=>this._stopSource(),this.playbackRate=new Wt({context:this.context,param:this._source.playbackRate,units:"positive",value:t.playbackRate}),this.loop=t.loop,this.loopStart=t.loopStart,this.loopEnd=t.loopEnd,this._buffer=new se(t.url,t.onload,t.onerror),this._internalChannels.push(this._source)}static getDefaults(){return Object.assign(Fs.getDefaults(),{url:new se,loop:!1,loopEnd:0,loopStart:0,onload:jt,onerror:jt,playbackRate:1})}get fadeIn(){return this._fadeIn}set fadeIn(t){this._fadeIn=t}get fadeOut(){return this._fadeOut}set fadeOut(t){this._fadeOut=t}get curve(){return this._curve}set curve(t){this._curve=t}start(t,e,n,s=1){At(this.buffer.loaded,"buffer is either not set or not loaded");const r=this.toSeconds(t);this._startGain(r,s),this.loop?e=Xi(e,this.loopStart):e=Xi(e,0);let o=Math.max(this.toSeconds(e),0);if(this.loop){const a=this.toSeconds(this.loopEnd)||this.buffer.duration,c=this.toSeconds(this.loopStart),l=a-c;Ic(o,a)&&(o=(o-c)%l+c),fn(o,this.buffer.duration)&&(o=0)}if(this._source.buffer=this.buffer.get(),this._source.loopEnd=this.toSeconds(this.loopEnd)||this.buffer.duration,Xo(o,this.buffer.duration)&&(this._sourceStarted=!0,this._source.start(r,o)),zt(n)){let a=this.toSeconds(n);a=Math.max(a,0),this.stop(r+a)}return this}_stopSource(t){!this._sourceStopped&&this._sourceStarted&&(this._sourceStopped=!0,this._source.stop(this.toSeconds(t)),this._onended())}get loopStart(){return this._source.loopStart}set loopStart(t){this._source.loopStart=this.toSeconds(t)}get loopEnd(){return this._source.loopEnd}set loopEnd(t){this._source.loopEnd=this.toSeconds(t)}get buffer(){return this._buffer}set buffer(t){this._buffer.set(t)}get loop(){return this._source.loop}set loop(t){this._source.loop=t,this._sourceStarted&&this.cancelStop()}dispose(){return super.dispose(),this._source.onended=null,this._source.disconnect(),this._buffer.dispose(),this.playbackRate.dispose(),this}}class Ji extends Oe{constructor(){super($(Ji.getDefaults(),arguments,["type"])),this.name="Noise",this._source=null;const t=$(Ji.getDefaults(),arguments,["type"]);this._playbackRate=t.playbackRate,this.type=t.type,this._fadeIn=t.fadeIn,this._fadeOut=t.fadeOut}static getDefaults(){return Object.assign(Oe.getDefaults(),{fadeIn:0,fadeOut:0,playbackRate:1,type:"white"})}get type(){return this._type}set type(t){if(At(t in Du,"Noise: invalid type: "+t),this._type!==t&&(this._type=t,this.state==="started")){const e=this.now();this._stop(e),this._start(e)}}get playbackRate(){return this._playbackRate}set playbackRate(t){this._playbackRate=t,this._source&&(this._source.playbackRate.value=t)}_start(t){const e=Du[this._type];this._source=new Bs({url:e,context:this.context,fadeIn:this._fadeIn,fadeOut:this._fadeOut,loop:!0,onended:()=>this.onstop(this),playbackRate:this._playbackRate}).connect(this.output),this._source.start(this.toSeconds(t),Math.random()*(e.duration-.001))}_stop(t){this._source&&(this._source.stop(this.toSeconds(t)),this._source=null)}get fadeIn(){return this._fadeIn}set fadeIn(t){this._fadeIn=t,this._source&&(this._source.fadeIn=this._fadeIn)}get fadeOut(){return this._fadeOut}set fadeOut(t){this._fadeOut=t,this._source&&(this._source.fadeOut=this._fadeOut)}_restart(t){this._stop(t),this._start(t)}dispose(){return super.dispose(),this._source&&this._source.disconnect(),this}}const cs=44100*5,$a=2,zn={brown:null,pink:null,white:null},Du={get brown(){if(!zn.brown){const i=[];for(let t=0;t<$a;t++){const e=new Float32Array(cs);i[t]=e;let n=0;for(let s=0;s<cs;s++){const r=Math.random()*2-1;e[s]=(n+.02*r)/1.02,n=e[s],e[s]*=3.5}}zn.brown=new se().fromArray(i)}return zn.brown},get pink(){if(!zn.pink){const i=[];for(let t=0;t<$a;t++){const e=new Float32Array(cs);i[t]=e;let n,s,r,o,a,c,l;n=s=r=o=a=c=l=0;for(let u=0;u<cs;u++){const h=Math.random()*2-1;n=.99886*n+h*.0555179,s=.99332*s+h*.0750759,r=.969*r+h*.153852,o=.8665*o+h*.3104856,a=.55*a+h*.5329522,c=-.7616*c-h*.016898,e[u]=n+s+r+o+a+c+l+h*.5362,e[u]*=.11,l=h*.115926}}zn.pink=new se().fromArray(i)}return zn.pink},get white(){if(!zn.white){const i=[];for(let t=0;t<$a;t++){const e=new Float32Array(cs);i[t]=e;for(let n=0;n<cs;n++)e[n]=Math.random()*2-1}zn.white=new se().fromArray(i)}return zn.white}};function os(i,t){return ge(this,void 0,void 0,function*(){const e=t/i.context.sampleRate,n=new Pa(1,e,i.context.sampleRate);return new i.constructor(Object.assign(i.get(),{frequency:2/e,detune:0,context:n})).toDestination().start(0),(yield n.render()).getChannelData(0)})}class ta extends Fs{constructor(){super($(ta.getDefaults(),arguments,["frequency","type"])),this.name="ToneOscillatorNode",this._oscillator=this.context.createOscillator(),this._internalChannels=[this._oscillator];const t=$(ta.getDefaults(),arguments,["frequency","type"]);Mn(this._oscillator,this._gainNode),this.type=t.type,this.frequency=new Wt({context:this.context,param:this._oscillator.frequency,units:"frequency",value:t.frequency}),this.detune=new Wt({context:this.context,param:this._oscillator.detune,units:"cents",value:t.detune}),$t(this,["frequency","detune"])}static getDefaults(){return Object.assign(Fs.getDefaults(),{detune:0,frequency:440,type:"sine"})}start(t){const e=this.toSeconds(t);return this.log("start",e),this._startGain(e),this._oscillator.start(e),this}_stopSource(t){this._oscillator.stop(t)}setPeriodicWave(t){return this._oscillator.setPeriodicWave(t),this}get type(){return this._oscillator.type}set type(t){this._oscillator.type=t}dispose(){return super.dispose(),this.state==="started"&&this.stop(),this._oscillator.disconnect(),this.frequency.dispose(),this.detune.dispose(),this}}class he extends Oe{constructor(){super($(he.getDefaults(),arguments,["frequency","type"])),this.name="Oscillator",this._oscillator=null;const t=$(he.getDefaults(),arguments,["frequency","type"]);this.frequency=new ie({context:this.context,units:"frequency",value:t.frequency}),$t(this,"frequency"),this.detune=new ie({context:this.context,units:"cents",value:t.detune}),$t(this,"detune"),this._partials=t.partials,this._partialCount=t.partialCount,this._type=t.type,t.partialCount&&t.type!=="custom"&&(this._type=this.baseType+t.partialCount.toString()),this.phase=t.phase}static getDefaults(){return Object.assign(Oe.getDefaults(),{detune:0,frequency:440,partialCount:0,partials:[],phase:0,type:"sine"})}_start(t){const e=this.toSeconds(t),n=new ta({context:this.context,onended:()=>this.onstop(this)});this._oscillator=n,this._wave?this._oscillator.setPeriodicWave(this._wave):this._oscillator.type=this._type,this._oscillator.connect(this.output),this.frequency.connect(this._oscillator.frequency),this.detune.connect(this._oscillator.detune),this._oscillator.start(e)}_stop(t){const e=this.toSeconds(t);this._oscillator&&this._oscillator.stop(e)}_restart(t){const e=this.toSeconds(t);return this.log("restart",e),this._oscillator&&this._oscillator.cancelStop(),this._state.cancel(e),this}syncFrequency(){return this.context.transport.syncSignal(this.frequency),this}unsyncFrequency(){return this.context.transport.unsyncSignal(this.frequency),this}_getCachedPeriodicWave(){if(this._type==="custom")return he._periodicWaveCache.find(e=>e.phase===this._phase&&s0(e.partials,this._partials));{const t=he._periodicWaveCache.find(e=>e.type===this._type&&e.phase===this._phase);return this._partialCount=t?t.partialCount:this._partialCount,t}}get type(){return this._type}set type(t){this._type=t;const e=["sine","square","sawtooth","triangle"].indexOf(t)!==-1;if(this._phase===0&&e)this._wave=void 0,this._partialCount=0,this._oscillator!==null&&(this._oscillator.type=t);else{const n=this._getCachedPeriodicWave();if(zt(n)){const{partials:s,wave:r}=n;this._wave=r,this._partials=s,this._oscillator!==null&&this._oscillator.setPeriodicWave(this._wave)}else{const[s,r]=this._getRealImaginary(t,this._phase),o=this.context.createPeriodicWave(s,r);this._wave=o,this._oscillator!==null&&this._oscillator.setPeriodicWave(this._wave),he._periodicWaveCache.push({imag:r,partialCount:this._partialCount,partials:this._partials,phase:this._phase,real:s,type:this._type,wave:this._wave}),he._periodicWaveCache.length>100&&he._periodicWaveCache.shift()}}}get baseType(){return this._type.replace(this.partialCount.toString(),"")}set baseType(t){this.partialCount&&this._type!=="custom"&&t!=="custom"?this.type=t+this.partialCount:this.type=t}get partialCount(){return this._partialCount}set partialCount(t){Sn(t,0);let e=this._type;const n=/^(sine|triangle|square|sawtooth)(\d+)$/.exec(this._type);if(n&&(e=n[1]),this._type!=="custom")t===0?this.type=e:this.type=e+t.toString();else{const s=new Float32Array(t);this._partials.forEach((r,o)=>s[o]=r),this._partials=Array.from(s),this.type=this._type}}_getRealImaginary(t,e){let s=2048;const r=new Float32Array(s),o=new Float32Array(s);let a=1;if(t==="custom"){if(a=this._partials.length+1,this._partialCount=this._partials.length,s=a,this._partials.length===0)return[r,o]}else{const c=/^(sine|triangle|square|sawtooth)(\d+)$/.exec(t);c?(a=parseInt(c[2],10)+1,this._partialCount=parseInt(c[2],10),t=c[1],a=Math.max(a,2),s=a):this._partialCount=0,this._partials=[]}for(let c=1;c<s;++c){const l=2/(c*Math.PI);let u;switch(t){case"sine":u=c<=a?1:0,this._partials[c-1]=u;break;case"square":u=c&1?2*l:0,this._partials[c-1]=u;break;case"sawtooth":u=l*(c&1?1:-1),this._partials[c-1]=u;break;case"triangle":c&1?u=2*(l*l)*(c-1>>1&1?-1:1):u=0,this._partials[c-1]=u;break;case"custom":u=this._partials[c-1];break;default:throw new TypeError("Oscillator: invalid type: "+t)}u!==0?(r[c]=-u*Math.sin(e*c),o[c]=u*Math.cos(e*c)):(r[c]=0,o[c]=0)}return[r,o]}_inverseFFT(t,e,n){let s=0;const r=t.length;for(let o=0;o<r;o++)s+=t[o]*Math.cos(o*n)+e[o]*Math.sin(o*n);return s}getInitialValue(){const[t,e]=this._getRealImaginary(this._type,0);let n=0;const s=Math.PI*2,r=32;for(let o=0;o<r;o++)n=Math.max(this._inverseFFT(t,e,o/r*s),n);return rs(-this._inverseFFT(t,e,this._phase)/n,-1,1)}get partials(){return this._partials.slice(0,this.partialCount)}set partials(t){this._partials=t,this._partialCount=this._partials.length,t.length&&(this.type="custom")}get phase(){return this._phase*(180/Math.PI)}set phase(t){this._phase=t*Math.PI/180,this.type=this._type}asArray(t=1024){return ge(this,void 0,void 0,function*(){return os(this,t)})}dispose(){return super.dispose(),this._oscillator!==null&&this._oscillator.dispose(),this._wave=void 0,this.frequency.dispose(),this.detune.dispose(),this}}he._periodicWaveCache=[];class Vd extends Nn{constructor(){super(...arguments),this.name="AudioToGain",this._norm=new Ki({context:this.context,mapping:t=>(t+1)/2}),this.input=this._norm,this.output=this._norm}dispose(){return super.dispose(),this._norm.dispose(),this}}class xi extends ie{constructor(){super(Object.assign($(xi.getDefaults(),arguments,["value"]))),this.name="Multiply",this.override=!1;const t=$(xi.getDefaults(),arguments,["value"]);this._mult=this.input=this.output=new qt({context:this.context,minValue:t.minValue,maxValue:t.maxValue}),this.factor=this._param=this._mult.gain,this.factor.setValueAtTime(t.value,0)}static getDefaults(){return Object.assign(ie.getDefaults(),{value:0})}dispose(){return super.dispose(),this._mult.dispose(),this}}class yr extends Oe{constructor(){super($(yr.getDefaults(),arguments,["frequency","type","modulationType"])),this.name="AMOscillator",this._modulationScale=new Vd({context:this.context}),this._modulationNode=new qt({context:this.context});const t=$(yr.getDefaults(),arguments,["frequency","type","modulationType"]);this._carrier=new he({context:this.context,detune:t.detune,frequency:t.frequency,onstop:()=>this.onstop(this),phase:t.phase,type:t.type}),this.frequency=this._carrier.frequency,this.detune=this._carrier.detune,this._modulator=new he({context:this.context,phase:t.phase,type:t.modulationType}),this.harmonicity=new xi({context:this.context,units:"positive",value:t.harmonicity}),this.frequency.chain(this.harmonicity,this._modulator.frequency),this._modulator.chain(this._modulationScale,this._modulationNode.gain),this._carrier.chain(this._modulationNode,this.output),$t(this,["frequency","detune","harmonicity"])}static getDefaults(){return Object.assign(he.getDefaults(),{harmonicity:1,modulationType:"square"})}_start(t){this._modulator.start(t),this._carrier.start(t)}_stop(t){this._modulator.stop(t),this._carrier.stop(t)}_restart(t){this._modulator.restart(t),this._carrier.restart(t)}get type(){return this._carrier.type}set type(t){this._carrier.type=t}get baseType(){return this._carrier.baseType}set baseType(t){this._carrier.baseType=t}get partialCount(){return this._carrier.partialCount}set partialCount(t){this._carrier.partialCount=t}get modulationType(){return this._modulator.type}set modulationType(t){this._modulator.type=t}get phase(){return this._carrier.phase}set phase(t){this._carrier.phase=t,this._modulator.phase=t}get partials(){return this._carrier.partials}set partials(t){this._carrier.partials=t}asArray(t=1024){return ge(this,void 0,void 0,function*(){return os(this,t)})}dispose(){return super.dispose(),this.frequency.dispose(),this.detune.dispose(),this.harmonicity.dispose(),this._carrier.dispose(),this._modulator.dispose(),this._modulationNode.dispose(),this._modulationScale.dispose(),this}}class Sr extends Oe{constructor(){super($(Sr.getDefaults(),arguments,["frequency","type","modulationType"])),this.name="FMOscillator",this._modulationNode=new qt({context:this.context,gain:0});const t=$(Sr.getDefaults(),arguments,["frequency","type","modulationType"]);this._carrier=new he({context:this.context,detune:t.detune,frequency:0,onstop:()=>this.onstop(this),phase:t.phase,type:t.type}),this.detune=this._carrier.detune,this.frequency=new ie({context:this.context,units:"frequency",value:t.frequency}),this._modulator=new he({context:this.context,phase:t.phase,type:t.modulationType}),this.harmonicity=new xi({context:this.context,units:"positive",value:t.harmonicity}),this.modulationIndex=new xi({context:this.context,units:"positive",value:t.modulationIndex}),this.frequency.connect(this._carrier.frequency),this.frequency.chain(this.harmonicity,this._modulator.frequency),this.frequency.chain(this.modulationIndex,this._modulationNode),this._modulator.connect(this._modulationNode.gain),this._modulationNode.connect(this._carrier.frequency),this._carrier.connect(this.output),this.detune.connect(this._modulator.detune),$t(this,["modulationIndex","frequency","detune","harmonicity"])}static getDefaults(){return Object.assign(he.getDefaults(),{harmonicity:1,modulationIndex:2,modulationType:"square"})}_start(t){this._modulator.start(t),this._carrier.start(t)}_stop(t){this._modulator.stop(t),this._carrier.stop(t)}_restart(t){return this._modulator.restart(t),this._carrier.restart(t),this}get type(){return this._carrier.type}set type(t){this._carrier.type=t}get baseType(){return this._carrier.baseType}set baseType(t){this._carrier.baseType=t}get partialCount(){return this._carrier.partialCount}set partialCount(t){this._carrier.partialCount=t}get modulationType(){return this._modulator.type}set modulationType(t){this._modulator.type=t}get phase(){return this._carrier.phase}set phase(t){this._carrier.phase=t,this._modulator.phase=t}get partials(){return this._carrier.partials}set partials(t){this._carrier.partials=t}asArray(t=1024){return ge(this,void 0,void 0,function*(){return os(this,t)})}dispose(){return super.dispose(),this.frequency.dispose(),this.harmonicity.dispose(),this._carrier.dispose(),this._modulator.dispose(),this._modulationNode.dispose(),this.modulationIndex.dispose(),this}}class Vs extends Oe{constructor(){super($(Vs.getDefaults(),arguments,["frequency","width"])),this.name="PulseOscillator",this._widthGate=new qt({context:this.context,gain:0}),this._thresh=new Ki({context:this.context,mapping:e=>e<=0?-1:1});const t=$(Vs.getDefaults(),arguments,["frequency","width"]);this.width=new ie({context:this.context,units:"audioRange",value:t.width}),this._triangle=new he({context:this.context,detune:t.detune,frequency:t.frequency,onstop:()=>this.onstop(this),phase:t.phase,type:"triangle"}),this.frequency=this._triangle.frequency,this.detune=this._triangle.detune,this._triangle.chain(this._thresh,this.output),this.width.chain(this._widthGate,this._thresh),$t(this,["width","frequency","detune"])}static getDefaults(){return Object.assign(Oe.getDefaults(),{detune:0,frequency:440,phase:0,type:"pulse",width:.2})}_start(t){t=this.toSeconds(t),this._triangle.start(t),this._widthGate.gain.setValueAtTime(1,t)}_stop(t){t=this.toSeconds(t),this._triangle.stop(t),this._widthGate.gain.cancelScheduledValues(t),this._widthGate.gain.setValueAtTime(0,t)}_restart(t){this._triangle.restart(t),this._widthGate.gain.cancelScheduledValues(t),this._widthGate.gain.setValueAtTime(1,t)}get phase(){return this._triangle.phase}set phase(t){this._triangle.phase=t}get type(){return"pulse"}get baseType(){return"pulse"}get partials(){return[]}get partialCount(){return 0}set carrierType(t){this._triangle.type=t}asArray(t=1024){return ge(this,void 0,void 0,function*(){return os(this,t)})}dispose(){return super.dispose(),this._triangle.dispose(),this.width.dispose(),this._widthGate.dispose(),this._thresh.dispose(),this}}class Mr extends Oe{constructor(){super($(Mr.getDefaults(),arguments,["frequency","type","spread"])),this.name="FatOscillator",this._oscillators=[];const t=$(Mr.getDefaults(),arguments,["frequency","type","spread"]);this.frequency=new ie({context:this.context,units:"frequency",value:t.frequency}),this.detune=new ie({context:this.context,units:"cents",value:t.detune}),this._spread=t.spread,this._type=t.type,this._phase=t.phase,this._partials=t.partials,this._partialCount=t.partialCount,this.count=t.count,$t(this,["frequency","detune"])}static getDefaults(){return Object.assign(he.getDefaults(),{count:3,spread:20,type:"sawtooth"})}_start(t){t=this.toSeconds(t),this._forEach(e=>e.start(t))}_stop(t){t=this.toSeconds(t),this._forEach(e=>e.stop(t))}_restart(t){this._forEach(e=>e.restart(t))}_forEach(t){for(let e=0;e<this._oscillators.length;e++)t(this._oscillators[e],e)}get type(){return this._type}set type(t){this._type=t,this._forEach(e=>e.type=t)}get spread(){return this._spread}set spread(t){if(this._spread=t,this._oscillators.length>1){const e=-t/2,n=t/(this._oscillators.length-1);this._forEach((s,r)=>s.detune.value=e+n*r)}}get count(){return this._oscillators.length}set count(t){if(Sn(t,1),this._oscillators.length!==t){this._forEach(e=>e.dispose()),this._oscillators=[];for(let e=0;e<t;e++){const n=new he({context:this.context,volume:-6-t*1.1,type:this._type,phase:this._phase+e/t*360,partialCount:this._partialCount,onstop:e===0?()=>this.onstop(this):jt});this.type==="custom"&&(n.partials=this._partials),this.frequency.connect(n.frequency),this.detune.connect(n.detune),n.detune.overridden=!1,n.connect(this.output),this._oscillators[e]=n}this.spread=this._spread,this.state==="started"&&this._forEach(e=>e.start())}}get phase(){return this._phase}set phase(t){this._phase=t,this._forEach((e,n)=>e.phase=this._phase+n/this.count*360)}get baseType(){return this._oscillators[0].baseType}set baseType(t){this._forEach(e=>e.baseType=t),this._type=this._oscillators[0].type}get partials(){return this._oscillators[0].partials}set partials(t){this._partials=t,this._partialCount=this._partials.length,t.length&&(this._type="custom",this._forEach(e=>e.partials=t))}get partialCount(){return this._oscillators[0].partialCount}set partialCount(t){this._partialCount=t,this._forEach(e=>e.partialCount=t),this._type=this._oscillators[0].type}asArray(t=1024){return ge(this,void 0,void 0,function*(){return os(this,t)})}dispose(){return super.dispose(),this.frequency.dispose(),this.detune.dispose(),this._forEach(t=>t.dispose()),this}}class Tr extends Oe{constructor(){super($(Tr.getDefaults(),arguments,["frequency","modulationFrequency"])),this.name="PWMOscillator",this.sourceType="pwm",this._scale=new xi({context:this.context,value:2});const t=$(Tr.getDefaults(),arguments,["frequency","modulationFrequency"]);this._pulse=new Vs({context:this.context,frequency:t.modulationFrequency}),this._pulse.carrierType="sine",this.modulationFrequency=this._pulse.frequency,this._modulator=new he({context:this.context,detune:t.detune,frequency:t.frequency,onstop:()=>this.onstop(this),phase:t.phase}),this.frequency=this._modulator.frequency,this.detune=this._modulator.detune,this._modulator.chain(this._scale,this._pulse.width),this._pulse.connect(this.output),$t(this,["modulationFrequency","frequency","detune"])}static getDefaults(){return Object.assign(Oe.getDefaults(),{detune:0,frequency:440,modulationFrequency:.4,phase:0,type:"pwm"})}_start(t){t=this.toSeconds(t),this._modulator.start(t),this._pulse.start(t)}_stop(t){t=this.toSeconds(t),this._modulator.stop(t),this._pulse.stop(t)}_restart(t){this._modulator.restart(t),this._pulse.restart(t)}get type(){return"pwm"}get baseType(){return"pwm"}get partials(){return[]}get partialCount(){return 0}get phase(){return this._modulator.phase}set phase(t){this._modulator.phase=t}asArray(t=1024){return ge(this,void 0,void 0,function*(){return os(this,t)})}dispose(){return super.dispose(),this._pulse.dispose(),this._scale.dispose(),this._modulator.dispose(),this}}const Pu={am:yr,fat:Mr,fm:Sr,oscillator:he,pulse:Vs,pwm:Tr};class Er extends Oe{constructor(){super($(Er.getDefaults(),arguments,["frequency","type"])),this.name="OmniOscillator";const t=$(Er.getDefaults(),arguments,["frequency","type"]);this.frequency=new ie({context:this.context,units:"frequency",value:t.frequency}),this.detune=new ie({context:this.context,units:"cents",value:t.detune}),$t(this,["frequency","detune"]),this.set(t)}static getDefaults(){return Object.assign(he.getDefaults(),Sr.getDefaults(),yr.getDefaults(),Mr.getDefaults(),Vs.getDefaults(),Tr.getDefaults())}_start(t){this._oscillator.start(t)}_stop(t){this._oscillator.stop(t)}_restart(t){return this._oscillator.restart(t),this}get type(){let t="";return["am","fm","fat"].some(e=>this._sourceType===e)&&(t=this._sourceType),t+this._oscillator.type}set type(t){t.substr(0,2)==="fm"?(this._createNewOscillator("fm"),this._oscillator=this._oscillator,this._oscillator.type=t.substr(2)):t.substr(0,2)==="am"?(this._createNewOscillator("am"),this._oscillator=this._oscillator,this._oscillator.type=t.substr(2)):t.substr(0,3)==="fat"?(this._createNewOscillator("fat"),this._oscillator=this._oscillator,this._oscillator.type=t.substr(3)):t==="pwm"?(this._createNewOscillator("pwm"),this._oscillator=this._oscillator):t==="pulse"?this._createNewOscillator("pulse"):(this._createNewOscillator("oscillator"),this._oscillator=this._oscillator,this._oscillator.type=t)}get partials(){return this._oscillator.partials}set partials(t){!this._getOscType(this._oscillator,"pulse")&&!this._getOscType(this._oscillator,"pwm")&&(this._oscillator.partials=t)}get partialCount(){return this._oscillator.partialCount}set partialCount(t){!this._getOscType(this._oscillator,"pulse")&&!this._getOscType(this._oscillator,"pwm")&&(this._oscillator.partialCount=t)}set(t){return Reflect.has(t,"type")&&t.type&&(this.type=t.type),super.set(t),this}_createNewOscillator(t){if(t!==this._sourceType){this._sourceType=t;const e=Pu[t],n=this.now();if(this._oscillator){const s=this._oscillator;s.stop(n),this.context.setTimeout(()=>s.dispose(),this.blockTime)}this._oscillator=new e({context:this.context}),this.frequency.connect(this._oscillator.frequency),this.detune.connect(this._oscillator.detune),this._oscillator.connect(this.output),this._oscillator.onstop=()=>this.onstop(this),this.state==="started"&&this._oscillator.start(n)}}get phase(){return this._oscillator.phase}set phase(t){this._oscillator.phase=t}get sourceType(){return this._sourceType}set sourceType(t){let e="sine";this._oscillator.type!=="pwm"&&this._oscillator.type!=="pulse"&&(e=this._oscillator.type),t==="fm"?this.type="fm"+e:t==="am"?this.type="am"+e:t==="fat"?this.type="fat"+e:t==="oscillator"?this.type=e:t==="pulse"?this.type="pulse":t==="pwm"&&(this.type="pwm")}_getOscType(t,e){return t instanceof Pu[e]}get baseType(){return this._oscillator.baseType}set baseType(t){!this._getOscType(this._oscillator,"pulse")&&!this._getOscType(this._oscillator,"pwm")&&t!=="pulse"&&t!=="pwm"&&(this._oscillator.baseType=t)}get width(){if(this._getOscType(this._oscillator,"pulse"))return this._oscillator.width}get count(){if(this._getOscType(this._oscillator,"fat"))return this._oscillator.count}set count(t){this._getOscType(this._oscillator,"fat")&&yn(t)&&(this._oscillator.count=t)}get spread(){if(this._getOscType(this._oscillator,"fat"))return this._oscillator.spread}set spread(t){this._getOscType(this._oscillator,"fat")&&yn(t)&&(this._oscillator.spread=t)}get modulationType(){if(this._getOscType(this._oscillator,"fm")||this._getOscType(this._oscillator,"am"))return this._oscillator.modulationType}set modulationType(t){(this._getOscType(this._oscillator,"fm")||this._getOscType(this._oscillator,"am"))&&Qn(t)&&(this._oscillator.modulationType=t)}get modulationIndex(){if(this._getOscType(this._oscillator,"fm"))return this._oscillator.modulationIndex}get harmonicity(){if(this._getOscType(this._oscillator,"fm")||this._getOscType(this._oscillator,"am"))return this._oscillator.harmonicity}get modulationFrequency(){if(this._getOscType(this._oscillator,"pwm"))return this._oscillator.modulationFrequency}asArray(t=1024){return ge(this,void 0,void 0,function*(){return os(this,t)})}dispose(){return super.dispose(),this.detune.dispose(),this.frequency.dispose(),this._oscillator.dispose(),this}}class kl extends ie{constructor(){super(Object.assign($(kl.getDefaults(),arguments,["value"]))),this.override=!1,this.name="Add",this._sum=new qt({context:this.context}),this.input=this._sum,this.output=this._sum,this.addend=this._param,$i(this._constantSource,this._sum)}static getDefaults(){return Object.assign(ie.getDefaults(),{value:0})}dispose(){return super.dispose(),this._sum.dispose(),this}}class ea extends Nn{constructor(){super(Object.assign($(ea.getDefaults(),arguments,["min","max"]))),this.name="Scale";const t=$(ea.getDefaults(),arguments,["min","max"]);this._mult=this.input=new xi({context:this.context,value:t.max-t.min}),this._add=this.output=new kl({context:this.context,value:t.min}),this._min=t.min,this._max=t.max,this.input.connect(this.output)}static getDefaults(){return Object.assign(Nn.getDefaults(),{max:1,min:0})}get min(){return this._min}set min(t){this._min=t,this._setRange()}get max(){return this._max}set max(t){this._max=t,this._setRange()}_setRange(){this._add.value=this._min,this._mult.value=this._max-this._min}dispose(){return super.dispose(),this._add.dispose(),this._mult.dispose(),this}}class Bl extends Nn{constructor(){super(Object.assign($(Bl.getDefaults(),arguments))),this.name="Zero",this._gain=new qt({context:this.context}),this.output=this._gain,this.input=void 0,Mn(this.context.getConstant(0),this._gain)}dispose(){return super.dispose(),Bd(this.context.getConstant(0),this._gain),this}}class br extends Tt{constructor(){super($(br.getDefaults(),arguments,["frequency","min","max"])),this.name="LFO",this._stoppedValue=0,this._units="number",this.convert=!0,this._fromType=Wt.prototype._fromType,this._toType=Wt.prototype._toType,this._is=Wt.prototype._is,this._clampValue=Wt.prototype._clampValue;const t=$(br.getDefaults(),arguments,["frequency","min","max"]);this._oscillator=new he(t),this.frequency=this._oscillator.frequency,this._amplitudeGain=new qt({context:this.context,gain:t.amplitude,units:"normalRange"}),this.amplitude=this._amplitudeGain.gain,this._stoppedSignal=new ie({context:this.context,units:"audioRange",value:0}),this._zeros=new Bl({context:this.context}),this._a2g=new Vd({context:this.context}),this._scaler=this.output=new ea({context:this.context,max:t.max,min:t.min}),this.units=t.units,this.min=t.min,this.max=t.max,this._oscillator.chain(this._amplitudeGain,this._a2g,this._scaler),this._zeros.connect(this._a2g),this._stoppedSignal.connect(this._a2g),$t(this,["amplitude","frequency"]),this.phase=t.phase}static getDefaults(){return Object.assign(he.getDefaults(),{amplitude:1,frequency:"4n",max:1,min:0,type:"sine",units:"number"})}start(t){return t=this.toSeconds(t),this._stoppedSignal.setValueAtTime(0,t),this._oscillator.start(t),this}stop(t){return t=this.toSeconds(t),this._stoppedSignal.setValueAtTime(this._stoppedValue,t),this._oscillator.stop(t),this}sync(){return this._oscillator.sync(),this._oscillator.syncFrequency(),this}unsync(){return this._oscillator.unsync(),this._oscillator.unsyncFrequency(),this}_setStoppedValue(){this._stoppedValue=this._oscillator.getInitialValue(),this._stoppedSignal.value=this._stoppedValue}get min(){return this._toType(this._scaler.min)}set min(t){t=this._fromType(t),this._scaler.min=t}get max(){return this._toType(this._scaler.max)}set max(t){t=this._fromType(t),this._scaler.max=t}get type(){return this._oscillator.type}set type(t){this._oscillator.type=t,this._setStoppedValue()}get partials(){return this._oscillator.partials}set partials(t){this._oscillator.partials=t,this._setStoppedValue()}get phase(){return this._oscillator.phase}set phase(t){this._oscillator.phase=t,this._setStoppedValue()}get units(){return this._units}set units(t){const e=this.min,n=this.max;this._units=t,this.min=e,this.max=n}get state(){return this._oscillator.state}connect(t,e,n){return(t instanceof Wt||t instanceof ie)&&(this.convert=t.convert,this.units=t.units),La(this,t,e,n),this}dispose(){return super.dispose(),this._oscillator.dispose(),this._stoppedSignal.dispose(),this._zeros.dispose(),this._scaler.dispose(),this._a2g.dispose(),this._amplitudeGain.dispose(),this.amplitude.dispose(),this}}function zd(i,t=1/0){const e=new WeakMap;return function(n,s){Reflect.defineProperty(n,s,{configurable:!0,enumerable:!0,get:function(){return e.get(this)},set:function(r){Sn(r,i,t),e.set(this,r)}})}}function si(i,t=1/0){const e=new WeakMap;return function(n,s){Reflect.defineProperty(n,s,{configurable:!0,enumerable:!0,get:function(){return e.get(this)},set:function(r){Sn(this.toSeconds(r),i,t),e.set(this,r)}})}}class wr extends Oe{constructor(){super($(wr.getDefaults(),arguments,["url","onload"])),this.name="Player",this._activeSources=new Set;const t=$(wr.getDefaults(),arguments,["url","onload"]);this._buffer=new se({onload:this._onload.bind(this,t.onload),onerror:t.onerror,reverse:t.reverse,url:t.url}),this.autostart=t.autostart,this._loop=t.loop,this._loopStart=t.loopStart,this._loopEnd=t.loopEnd,this._playbackRate=t.playbackRate,this.fadeIn=t.fadeIn,this.fadeOut=t.fadeOut}static getDefaults(){return Object.assign(Oe.getDefaults(),{autostart:!1,fadeIn:0,fadeOut:0,loop:!1,loopEnd:0,loopStart:0,onload:jt,onerror:jt,playbackRate:1,reverse:!1})}load(t){return ge(this,void 0,void 0,function*(){return yield this._buffer.load(t),this._onload(),this})}_onload(t=jt){t(),this.autostart&&this.start()}_onSourceEnd(t){this.onstop(this),this._activeSources.delete(t),this._activeSources.size===0&&!this._synced&&this._state.getValueAtTime(this.now())==="started"&&(this._state.cancel(this.now()),this._state.setStateAtTime("stopped",this.now()))}start(t,e,n){return super.start(t,e,n),this}_start(t,e,n){this._loop?e=Xi(e,this._loopStart):e=Xi(e,0);const s=this.toSeconds(e),r=n;n=Xi(n,Math.max(this._buffer.duration-s,0));let o=this.toSeconds(n);o=o/this._playbackRate,t=this.toSeconds(t);const a=new Bs({url:this._buffer,context:this.context,fadeIn:this.fadeIn,fadeOut:this.fadeOut,loop:this._loop,loopEnd:this._loopEnd,loopStart:this._loopStart,onended:this._onSourceEnd.bind(this),playbackRate:this._playbackRate}).connect(this.output);!this._loop&&!this._synced&&(this._state.cancel(t+o),this._state.setStateAtTime("stopped",t+o,{implicitEnd:!0})),this._activeSources.add(a),this._loop&&on(r)?a.start(t,s):a.start(t,s,o-this.toSeconds(this.fadeOut))}_stop(t){const e=this.toSeconds(t);this._activeSources.forEach(n=>n.stop(e))}restart(t,e,n){return super.restart(t,e,n),this}_restart(t,e,n){var s;(s=[...this._activeSources].pop())===null||s===void 0||s.stop(t),this._start(t,e,n)}seek(t,e){const n=this.toSeconds(e);if(this._state.getValueAtTime(n)==="started"){const s=this.toSeconds(t);this._stop(n),this._start(n,s)}return this}setLoopPoints(t,e){return this.loopStart=t,this.loopEnd=e,this}get loopStart(){return this._loopStart}set loopStart(t){this._loopStart=t,this.buffer.loaded&&Sn(this.toSeconds(t),0,this.buffer.duration),this._activeSources.forEach(e=>{e.loopStart=t})}get loopEnd(){return this._loopEnd}set loopEnd(t){this._loopEnd=t,this.buffer.loaded&&Sn(this.toSeconds(t),0,this.buffer.duration),this._activeSources.forEach(e=>{e.loopEnd=t})}get buffer(){return this._buffer}set buffer(t){this._buffer.set(t)}get loop(){return this._loop}set loop(t){if(this._loop!==t&&(this._loop=t,this._activeSources.forEach(e=>{e.loop=t}),t)){const e=this._state.getNextState("stopped",this.now());e&&this._state.cancel(e.time)}}get playbackRate(){return this._playbackRate}set playbackRate(t){this._playbackRate=t;const e=this.now(),n=this._state.getNextState("stopped",e);n&&n.implicitEnd&&(this._state.cancel(n.time),this._activeSources.forEach(s=>s.cancelStop())),this._activeSources.forEach(s=>{s.playbackRate.setValueAtTime(t,e)})}get reverse(){return this._buffer.reverse}set reverse(t){this._buffer.reverse=t}get loaded(){return this._buffer.loaded}dispose(){return super.dispose(),this._activeSources.forEach(t=>t.dispose()),this._activeSources.clear(),this._buffer.dispose(),this}}wn([si(0)],wr.prototype,"fadeIn",void 0);wn([si(0)],wr.prototype,"fadeOut",void 0);class S0 extends Nn{constructor(){super(...arguments),this.name="GainToAudio",this._norm=new Ki({context:this.context,mapping:t=>Math.abs(t)*2-1}),this.input=this._norm,this.output=this._norm}dispose(){return super.dispose(),this._norm.dispose(),this}}class Ln extends Tt{constructor(){super($(Ln.getDefaults(),arguments,["attack","decay","sustain","release"])),this.name="Envelope",this._sig=new ie({context:this.context,value:0}),this.output=this._sig,this.input=void 0;const t=$(Ln.getDefaults(),arguments,["attack","decay","sustain","release"]);this.attack=t.attack,this.decay=t.decay,this.sustain=t.sustain,this.release=t.release,this.attackCurve=t.attackCurve,this.releaseCurve=t.releaseCurve,this.decayCurve=t.decayCurve}static getDefaults(){return Object.assign(Tt.getDefaults(),{attack:.01,attackCurve:"linear",decay:.1,decayCurve:"exponential",release:1,releaseCurve:"exponential",sustain:.5})}get value(){return this.getValueAtTime(this.now())}_getCurve(t,e){if(Qn(t))return t;{let n;for(n in Jr)if(Jr[n][e]===t)return n;return t}}_setCurve(t,e,n){if(Qn(n)&&Reflect.has(Jr,n)){const s=Jr[n];Hi(s)?t!=="_decayCurve"&&(this[t]=s[e]):this[t]=s}else if(Qe(n)&&t!=="_decayCurve")this[t]=n;else throw new Error("Envelope: invalid curve: "+n)}get attackCurve(){return this._getCurve(this._attackCurve,"In")}set attackCurve(t){this._setCurve("_attackCurve","In",t)}get releaseCurve(){return this._getCurve(this._releaseCurve,"Out")}set releaseCurve(t){this._setCurve("_releaseCurve","Out",t)}get decayCurve(){return this._getCurve(this._decayCurve,"Out")}set decayCurve(t){this._setCurve("_decayCurve","Out",t)}triggerAttack(t,e=1){this.log("triggerAttack",t,e),t=this.toSeconds(t);let s=this.toSeconds(this.attack);const r=this.toSeconds(this.decay),o=this.getValueAtTime(t);if(o>0){const a=1/s;s=(1-o)/a}if(s<this.sampleTime)this._sig.cancelScheduledValues(t),this._sig.setValueAtTime(e,t);else if(this._attackCurve==="linear")this._sig.linearRampTo(e,s,t);else if(this._attackCurve==="exponential")this._sig.targetRampTo(e,s,t);else{this._sig.cancelAndHoldAtTime(t);let a=this._attackCurve;for(let c=1;c<a.length;c++)if(a[c-1]<=o&&o<=a[c]){a=this._attackCurve.slice(c),a[0]=o;break}this._sig.setValueCurveAtTime(a,t,s,e)}if(r&&this.sustain<1){const a=e*this.sustain,c=t+s;this.log("decay",c),this._decayCurve==="linear"?this._sig.linearRampToValueAtTime(a,r+c):this._sig.exponentialApproachValueAtTime(a,c,r)}return this}triggerRelease(t){this.log("triggerRelease",t),t=this.toSeconds(t);const e=this.getValueAtTime(t);if(e>0){const n=this.toSeconds(this.release);n<this.sampleTime?this._sig.setValueAtTime(0,t):this._releaseCurve==="linear"?this._sig.linearRampTo(0,n,t):this._releaseCurve==="exponential"?this._sig.targetRampTo(0,n,t):(At(Qe(this._releaseCurve),"releaseCurve must be either 'linear', 'exponential' or an array"),this._sig.cancelAndHoldAtTime(t),this._sig.setValueCurveAtTime(this._releaseCurve,t,n,e))}return this}getValueAtTime(t){return this._sig.getValueAtTime(t)}triggerAttackRelease(t,e,n=1){return e=this.toSeconds(e),this.triggerAttack(e,n),this.triggerRelease(e+this.toSeconds(t)),this}cancel(t){return this._sig.cancelScheduledValues(this.toSeconds(t)),this}connect(t,e=0,n=0){return La(this,t,e,n),this}asArray(t=1024){return ge(this,void 0,void 0,function*(){const e=t/this.context.sampleRate,n=new Pa(1,e,this.context.sampleRate),s=this.toSeconds(this.attack)+this.toSeconds(this.decay),r=s+this.toSeconds(this.release),o=r*.1,a=r+o,c=new this.constructor(Object.assign(this.get(),{attack:e*this.toSeconds(this.attack)/a,decay:e*this.toSeconds(this.decay)/a,release:e*this.toSeconds(this.release)/a,context:n}));return c._sig.toDestination(),c.triggerAttackRelease(e*(s+o)/a,0),(yield n.render()).getChannelData(0)})}dispose(){return super.dispose(),this._sig.dispose(),this}}wn([si(0)],Ln.prototype,"attack",void 0);wn([si(0)],Ln.prototype,"decay",void 0);wn([zd(0,1)],Ln.prototype,"sustain",void 0);wn([si(0)],Ln.prototype,"release",void 0);const Jr=(()=>{let t,e;const n=[];for(t=0;t<128;t++)n[t]=Math.sin(t/127*(Math.PI/2));const s=[],r=6.4;for(t=0;t<127;t++){e=t/127;const d=Math.sin(e*(Math.PI*2)*r-Math.PI/2)+1;s[t]=d/10+e*.83}s[127]=1;const o=[],a=5;for(t=0;t<128;t++)o[t]=Math.ceil(t/127*a)/a;const c=[];for(t=0;t<128;t++)e=t/127,c[t]=.5*(1-Math.cos(Math.PI*e));const l=[];for(t=0;t<128;t++){e=t/127;const d=Math.pow(e,3)*4+.2,m=Math.cos(d*Math.PI*2*e);l[t]=Math.abs(m*(1-e))}function u(d){const m=new Array(d.length);for(let _=0;_<d.length;_++)m[_]=1-d[_];return m}function h(d){return d.slice(0).reverse()}return{bounce:{In:u(l),Out:l},cosine:{In:n,Out:h(n)},exponential:"exponential",linear:"linear",ripple:{In:s,Out:u(s)},sine:{In:c,Out:u(c)},step:{In:o,Out:u(o)}}})();class Tn extends Tt{constructor(){super($(Tn.getDefaults(),arguments)),this._scheduledEvents=[],this._synced=!1,this._original_triggerAttack=this.triggerAttack,this._original_triggerRelease=this.triggerRelease,this._syncedRelease=e=>this._original_triggerRelease(e);const t=$(Tn.getDefaults(),arguments);this._volume=this.output=new Zi({context:this.context,volume:t.volume}),this.volume=this._volume.volume,$t(this,"volume")}static getDefaults(){return Object.assign(Tt.getDefaults(),{volume:0})}sync(){return this._syncState()&&(this._syncMethod("triggerAttack",1),this._syncMethod("triggerRelease",0),this.context.transport.on("stop",this._syncedRelease),this.context.transport.on("pause",this._syncedRelease),this.context.transport.on("loopEnd",this._syncedRelease)),this}_syncState(){let t=!1;return this._synced||(this._synced=!0,t=!0),t}_syncMethod(t,e){const n=this["_original_"+t]=this[t];this[t]=(...s)=>{const r=s[e],o=this.context.transport.schedule(a=>{s[e]=a,n.apply(this,s)},r);this._scheduledEvents.push(o)}}unsync(){return this._scheduledEvents.forEach(t=>this.context.transport.clear(t)),this._scheduledEvents=[],this._synced&&(this._synced=!1,this.triggerAttack=this._original_triggerAttack,this.triggerRelease=this._original_triggerRelease,this.context.transport.off("stop",this._syncedRelease),this.context.transport.off("pause",this._syncedRelease),this.context.transport.off("loopEnd",this._syncedRelease)),this}triggerAttackRelease(t,e,n,s){const r=this.toSeconds(n),o=this.toSeconds(e);return this.triggerAttack(t,r,s),this.triggerRelease(r+o),this}dispose(){return super.dispose(),this._volume.dispose(),this.unsync(),this._scheduledEvents=[],this}}class yi extends Tn{constructor(){super($(yi.getDefaults(),arguments));const t=$(yi.getDefaults(),arguments);this.portamento=t.portamento,this.onsilence=t.onsilence}static getDefaults(){return Object.assign(Tn.getDefaults(),{detune:0,onsilence:jt,portamento:0})}triggerAttack(t,e,n=1){this.log("triggerAttack",t,e,n);const s=this.toSeconds(e);return this._triggerEnvelopeAttack(s,n),this.setNote(t,s),this}triggerRelease(t){this.log("triggerRelease",t);const e=this.toSeconds(t);return this._triggerEnvelopeRelease(e),this}setNote(t,e){const n=this.toSeconds(e),s=t instanceof Je?t.toFrequency():t;if(this.portamento>0&&this.getLevelAtTime(n)>.05){const r=this.toSeconds(this.portamento);this.frequency.exponentialRampTo(s,r,n)}else this.frequency.setValueAtTime(s,n);return this}}wn([si(0)],yi.prototype,"portamento",void 0);class Oa extends Ln{constructor(){super($(Oa.getDefaults(),arguments,["attack","decay","sustain","release"])),this.name="AmplitudeEnvelope",this._gainNode=new qt({context:this.context,gain:0}),this.output=this._gainNode,this.input=this._gainNode,this._sig.connect(this._gainNode.gain),this.output=this._gainNode,this.input=this._gainNode}dispose(){return super.dispose(),this._gainNode.dispose(),this}}class Qi extends yi{constructor(){super($(Qi.getDefaults(),arguments)),this.name="Synth";const t=$(Qi.getDefaults(),arguments);this.oscillator=new Er(Object.assign({context:this.context,detune:t.detune,onstop:()=>this.onsilence(this)},t.oscillator)),this.frequency=this.oscillator.frequency,this.detune=this.oscillator.detune,this.envelope=new Oa(Object.assign({context:this.context},t.envelope)),this.oscillator.chain(this.envelope,this.output),$t(this,["oscillator","frequency","detune","envelope"])}static getDefaults(){return Object.assign(yi.getDefaults(),{envelope:Object.assign(gr(Ln.getDefaults(),Object.keys(Tt.getDefaults())),{attack:.005,decay:.1,release:1,sustain:.3}),oscillator:Object.assign(gr(Er.getDefaults(),[...Object.keys(Oe.getDefaults()),"frequency","detune"]),{type:"triangle"})})}_triggerEnvelopeAttack(t,e){if(this.envelope.triggerAttack(t,e),this.oscillator.start(t),this.envelope.sustain===0){const n=this.toSeconds(this.envelope.attack),s=this.toSeconds(this.envelope.decay);this.oscillator.stop(t+n+s)}}_triggerEnvelopeRelease(t){this.envelope.triggerRelease(t),this.oscillator.stop(t+this.toSeconds(this.envelope.release))}getLevelAtTime(t){return t=this.toSeconds(t),this.envelope.getValueAtTime(t)}dispose(){return super.dispose(),this.oscillator.dispose(),this.envelope.dispose(),this}}class Ar extends Tt{constructor(){super($(Ar.getDefaults(),arguments,["frequency","type"])),this.name="BiquadFilter";const t=$(Ar.getDefaults(),arguments,["frequency","type"]);this._filter=this.context.createBiquadFilter(),this.input=this.output=this._filter,this.Q=new Wt({context:this.context,units:"number",value:t.Q,param:this._filter.Q}),this.frequency=new Wt({context:this.context,units:"frequency",value:t.frequency,param:this._filter.frequency}),this.detune=new Wt({context:this.context,units:"cents",value:t.detune,param:this._filter.detune}),this.gain=new Wt({context:this.context,units:"decibels",convert:!1,value:t.gain,param:this._filter.gain}),this.type=t.type}static getDefaults(){return Object.assign(Tt.getDefaults(),{Q:1,type:"lowpass",frequency:350,detune:0,gain:0})}get type(){return this._filter.type}set type(t){At(["lowpass","highpass","bandpass","lowshelf","highshelf","notch","allpass","peaking"].indexOf(t)!==-1,`Invalid filter type: ${t}`),this._filter.type=t}getFrequencyResponse(t=128){const e=new Float32Array(t);for(let o=0;o<t;o++){const c=Math.pow(o/t,2)*19980+20;e[o]=c}const n=new Float32Array(t),s=new Float32Array(t),r=this.context.createBiquadFilter();return r.type=this.type,r.Q.value=this.Q.value,r.frequency.value=this.frequency.value,r.gain.value=this.gain.value,r.getFrequencyResponse(e,n,s),n}dispose(){return super.dispose(),this._filter.disconnect(),this.Q.dispose(),this.frequency.dispose(),this.gain.dispose(),this.detune.dispose(),this}}class na extends Tt{constructor(){super($(na.getDefaults(),arguments,["frequency","type","rolloff"])),this.name="Filter",this.input=new qt({context:this.context}),this.output=new qt({context:this.context}),this._filters=[];const t=$(na.getDefaults(),arguments,["frequency","type","rolloff"]);this._filters=[],this.Q=new ie({context:this.context,units:"positive",value:t.Q}),this.frequency=new ie({context:this.context,units:"frequency",value:t.frequency}),this.detune=new ie({context:this.context,units:"cents",value:t.detune}),this.gain=new ie({context:this.context,units:"decibels",convert:!1,value:t.gain}),this._type=t.type,this.rolloff=t.rolloff,$t(this,["detune","frequency","gain","Q"])}static getDefaults(){return Object.assign(Tt.getDefaults(),{Q:1,detune:0,frequency:350,gain:0,rolloff:-12,type:"lowpass"})}get type(){return this._type}set type(t){At(["lowpass","highpass","bandpass","lowshelf","highshelf","notch","allpass","peaking"].indexOf(t)!==-1,`Invalid filter type: ${t}`),this._type=t,this._filters.forEach(n=>n.type=t)}get rolloff(){return this._rolloff}set rolloff(t){const e=yn(t)?t:parseInt(t,10),n=[-12,-24,-48,-96];let s=n.indexOf(e);At(s!==-1,`rolloff can only be ${n.join(", ")}`),s+=1,this._rolloff=e,this.input.disconnect(),this._filters.forEach(r=>r.disconnect()),this._filters=new Array(s);for(let r=0;r<s;r++){const o=new Ar({context:this.context});o.type=this._type,this.frequency.connect(o.frequency),this.detune.connect(o.detune),this.Q.connect(o.Q),this.gain.connect(o.gain),this._filters[r]=o}this._internalChannels=this._filters,$i(this.input,...this._internalChannels,this.output)}getFrequencyResponse(t=128){const e=new Ar({frequency:this.frequency.value,gain:this.gain.value,Q:this.Q.value,type:this._type,detune:this.detune.value}),n=new Float32Array(t).map(()=>1);return this._filters.forEach(()=>{e.getFrequencyResponse(t).forEach((r,o)=>n[o]*=r)}),e.dispose(),n}dispose(){return super.dispose(),this._filters.forEach(t=>{t.dispose()}),Ll(this,["detune","frequency","gain","Q"]),this.frequency.dispose(),this.Q.dispose(),this.detune.dispose(),this.gain.dispose(),this}}class zs extends Qi{constructor(){super($(zs.getDefaults(),arguments)),this.name="MembraneSynth",this.portamento=0;const t=$(zs.getDefaults(),arguments);this.pitchDecay=t.pitchDecay,this.octaves=t.octaves,$t(this,["oscillator","envelope"])}static getDefaults(){return qi(yi.getDefaults(),Qi.getDefaults(),{envelope:{attack:.001,attackCurve:"exponential",decay:.4,release:1.4,sustain:.01},octaves:10,oscillator:{type:"sine"},pitchDecay:.05})}setNote(t,e){const n=this.toSeconds(e),s=this.toFrequency(t instanceof Je?t.toFrequency():t),r=s*this.octaves;return this.oscillator.frequency.setValueAtTime(r,n),this.oscillator.frequency.exponentialRampToValueAtTime(s,n+this.toSeconds(this.pitchDecay)),this}dispose(){return super.dispose(),this}}wn([zd(0)],zs.prototype,"octaves",void 0);wn([si(0)],zs.prototype,"pitchDecay",void 0);class ia extends Tn{constructor(){super($(ia.getDefaults(),arguments)),this.name="NoiseSynth";const t=$(ia.getDefaults(),arguments);this.noise=new Ji(Object.assign({context:this.context},t.noise)),this.envelope=new Oa(Object.assign({context:this.context},t.envelope)),this.noise.chain(this.envelope,this.output)}static getDefaults(){return Object.assign(Tn.getDefaults(),{envelope:Object.assign(gr(Ln.getDefaults(),Object.keys(Tt.getDefaults())),{decay:.1,sustain:0}),noise:Object.assign(gr(Ji.getDefaults(),Object.keys(Oe.getDefaults())),{type:"white"})})}triggerAttack(t,e=1){return t=this.toSeconds(t),this.envelope.triggerAttack(t,e),this.noise.start(t),this.envelope.sustain===0&&this.noise.stop(t+this.toSeconds(this.envelope.attack)+this.toSeconds(this.envelope.decay)),this}triggerRelease(t){return t=this.toSeconds(t),this.envelope.triggerRelease(t),this.noise.stop(t+this.toSeconds(this.envelope.release)),this}sync(){return this._syncState()&&(this._syncMethod("triggerAttack",0),this._syncMethod("triggerRelease",0)),this}triggerAttackRelease(t,e,n=1){return e=this.toSeconds(e),t=this.toSeconds(t),this.triggerAttack(e,n),this.triggerRelease(e+t),this}dispose(){return super.dispose(),this.noise.dispose(),this.envelope.dispose(),this}}const Gd=new Set;function Vl(i){Gd.add(i)}function Hd(i,t){const e=`registerProcessor("${i}", ${t})`;Gd.add(e)}const M0=`
	/**
	 * The base AudioWorkletProcessor for use in Tone.js. Works with the {@link ToneAudioWorklet}. 
	 */
	class ToneAudioWorkletProcessor extends AudioWorkletProcessor {

		constructor(options) {
			
			super(options);
			/**
			 * If the processor was disposed or not. Keep alive until it's disposed.
			 */
			this.disposed = false;
		   	/** 
			 * The number of samples in the processing block
			 */
			this.blockSize = 128;
			/**
			 * the sample rate
			 */
			this.sampleRate = sampleRate;

			this.port.onmessage = (event) => {
				// when it receives a dispose 
				if (event.data === "dispose") {
					this.disposed = true;
				}
			};
		}
	}
`;Vl(M0);const T0=`
	/**
	 * Abstract class for a single input/output processor. 
	 * has a 'generate' function which processes one sample at a time
	 */
	class SingleIOProcessor extends ToneAudioWorkletProcessor {

		constructor(options) {
			super(Object.assign(options, {
				numberOfInputs: 1,
				numberOfOutputs: 1
			}));
			/**
			 * Holds the name of the parameter and a single value of that
			 * parameter at the current sample
			 * @type { [name: string]: number }
			 */
			this.params = {}
		}

		/**
		 * Generate an output sample from the input sample and parameters
		 * @abstract
		 * @param input number
		 * @param channel number
		 * @param parameters { [name: string]: number }
		 * @returns number
		 */
		generate(){}

		/**
		 * Update the private params object with the 
		 * values of the parameters at the given index
		 * @param parameters { [name: string]: Float32Array },
		 * @param index number
		 */
		updateParams(parameters, index) {
			for (const paramName in parameters) {
				const param = parameters[paramName];
				if (param.length > 1) {
					this.params[paramName] = parameters[paramName][index];
				} else {
					this.params[paramName] = parameters[paramName][0];
				}
			}
		}

		/**
		 * Process a single frame of the audio
		 * @param inputs Float32Array[][]
		 * @param outputs Float32Array[][]
		 */
		process(inputs, outputs, parameters) {
			const input = inputs[0];
			const output = outputs[0];
			// get the parameter values
			const channelCount = Math.max(input && input.length || 0, output.length);
			for (let sample = 0; sample < this.blockSize; sample++) {
				this.updateParams(parameters, sample);
				for (let channel = 0; channel < channelCount; channel++) {
					const inputSample = input && input.length ? input[channel][sample] : 0;
					output[channel][sample] = this.generate(inputSample, channel, this.params);
				}
			}
			return !this.disposed;
		}
	};
`;Vl(T0);const E0=`
	/**
	 * A multichannel buffer for use within an AudioWorkletProcessor as a delay line
	 */
	class DelayLine {
		
		constructor(size, channels) {
			this.buffer = [];
			this.writeHead = []
			this.size = size;

			// create the empty channels
			for (let i = 0; i < channels; i++) {
				this.buffer[i] = new Float32Array(this.size);
				this.writeHead[i] = 0;
			}
		}

		/**
		 * Push a value onto the end
		 * @param channel number
		 * @param value number
		 */
		push(channel, value) {
			this.writeHead[channel] += 1;
			if (this.writeHead[channel] > this.size) {
				this.writeHead[channel] = 0;
			}
			this.buffer[channel][this.writeHead[channel]] = value;
		}

		/**
		 * Get the recorded value of the channel given the delay
		 * @param channel number
		 * @param delay number delay samples
		 */
		get(channel, delay) {
			let readHead = this.writeHead[channel] - Math.floor(delay);
			if (readHead < 0) {
				readHead += this.size;
			}
			return this.buffer[channel][readHead];
		}
	}
`;Vl(E0);const b0="feedback-comb-filter",w0=`
	class FeedbackCombFilterWorklet extends SingleIOProcessor {

		constructor(options) {
			super(options);
			this.delayLine = new DelayLine(this.sampleRate, options.channelCount || 2);
		}

		static get parameterDescriptors() {
			return [{
				name: "delayTime",
				defaultValue: 0.1,
				minValue: 0,
				maxValue: 1,
				automationRate: "k-rate"
			}, {
				name: "feedback",
				defaultValue: 0.5,
				minValue: 0,
				maxValue: 0.9999,
				automationRate: "k-rate"
			}];
		}

		generate(input, channel, parameters) {
			const delayedSample = this.delayLine.get(channel, parameters.delayTime * this.sampleRate);
			this.delayLine.push(channel, input + delayedSample * parameters.feedback);
			return delayedSample;
		}
	}
`;Hd(b0,w0);class sa extends Tn{constructor(){super($(sa.getDefaults(),arguments,["voice","options"])),this.name="PolySynth",this._availableVoices=[],this._activeVoices=[],this._voices=[],this._gcTimeout=-1,this._averageActiveVoices=0,this._syncedRelease=s=>this.releaseAll(s);const t=$(sa.getDefaults(),arguments,["voice","options"]);At(!yn(t.voice),"DEPRECATED: The polyphony count is no longer the first argument.");const e=t.voice.getDefaults();this.options=Object.assign(e,t.options),this.voice=t.voice,this.maxPolyphony=t.maxPolyphony,this._dummyVoice=this._getNextAvailableVoice();const n=this._voices.indexOf(this._dummyVoice);this._voices.splice(n,1),this._gcTimeout=this.context.setInterval(this._collectGarbage.bind(this),1)}static getDefaults(){return Object.assign(Tn.getDefaults(),{maxPolyphony:32,options:{},voice:Qi})}get activeVoices(){return this._activeVoices.length}_makeVoiceAvailable(t){this._availableVoices.push(t);const e=this._activeVoices.findIndex(n=>n.voice===t);this._activeVoices.splice(e,1)}_getNextAvailableVoice(){if(this._availableVoices.length)return this._availableVoices.shift();if(this._voices.length<this.maxPolyphony){const t=new this.voice(Object.assign(this.options,{context:this.context,onsilence:this._makeVoiceAvailable.bind(this)}));return At(t instanceof yi,"Voice must extend Monophonic class"),t.connect(this.output),this._voices.push(t),t}else Ca("Max polyphony exceeded. Note dropped.")}_collectGarbage(){if(this._averageActiveVoices=Math.max(this._averageActiveVoices*.95,this.activeVoices),this._availableVoices.length&&this._voices.length>Math.ceil(this._averageActiveVoices+1)){const t=this._availableVoices.shift(),e=this._voices.indexOf(t);this._voices.splice(e,1),this.context.isOffline||t.dispose()}}_triggerAttack(t,e,n){t.forEach(s=>{const r=new Ko(this.context,s).toMidi(),o=this._getNextAvailableVoice();o&&(o.triggerAttack(s,e,n),this._activeVoices.push({midi:r,voice:o,released:!1}),this.log("triggerAttack",s,e))})}_triggerRelease(t,e){t.forEach(n=>{const s=new Ko(this.context,n).toMidi(),r=this._activeVoices.find(({midi:o,released:a})=>o===s&&!a);r&&(r.voice.triggerRelease(e),r.released=!0,this.log("triggerRelease",n,e))})}_scheduleEvent(t,e,n,s){At(!this.disposed,"Synth was already disposed"),n<=this.now()?t==="attack"?this._triggerAttack(e,n,s):this._triggerRelease(e,n):this.context.setTimeout(()=>{this.disposed||this._scheduleEvent(t,e,n,s)},n-this.now())}triggerAttack(t,e,n){Array.isArray(t)||(t=[t]);const s=this.toSeconds(e);return this._scheduleEvent("attack",t,s,n),this}triggerRelease(t,e){Array.isArray(t)||(t=[t]);const n=this.toSeconds(e);return this._scheduleEvent("release",t,n),this}triggerAttackRelease(t,e,n,s){const r=this.toSeconds(n);if(this.triggerAttack(t,r,s),Qe(e)){At(Qe(t),"If the duration is an array, the notes must also be an array"),t=t;for(let o=0;o<t.length;o++){const a=e[Math.min(o,e.length-1)],c=this.toSeconds(a);At(c>0,"The duration must be greater than 0"),this.triggerRelease(t[o],r+c)}}else{const o=this.toSeconds(e);At(o>0,"The duration must be greater than 0"),this.triggerRelease(t,r+o)}return this}sync(){return this._syncState()&&(this._syncMethod("triggerAttack",1),this._syncMethod("triggerRelease",1),this.context.transport.on("stop",this._syncedRelease),this.context.transport.on("pause",this._syncedRelease),this.context.transport.on("loopEnd",this._syncedRelease)),this}set(t){const e=gr(t,["onsilence","context"]);return this.options=qi(this.options,e),this._voices.forEach(n=>n.set(e)),this._dummyVoice.set(e),this}get(){return this._dummyVoice.get()}releaseAll(t){const e=this.toSeconds(t);return this._activeVoices.forEach(({voice:n})=>{n.triggerRelease(e)}),this}dispose(){return super.dispose(),this._dummyVoice.dispose(),this._voices.forEach(t=>t.dispose()),this._activeVoices=[],this._availableVoices=[],this.context.clearInterval(this._gcTimeout),this}}class Cr extends Tn{constructor(){super($(Cr.getDefaults(),arguments,["urls","onload","baseUrl"],"urls")),this.name="Sampler",this._activeSources=new Map;const t=$(Cr.getDefaults(),arguments,["urls","onload","baseUrl"],"urls"),e={};Object.keys(t.urls).forEach(n=>{const s=parseInt(n,10);if(At(Kr(n)||yn(s)&&isFinite(s),`url key is neither a note or midi pitch: ${n}`),Kr(n)){const r=new Je(this.context,n).toMidi();e[r]=t.urls[n]}else yn(s)&&isFinite(s)&&(e[s]=t.urls[s])}),this._buffers=new Ul({urls:e,onload:t.onload,baseUrl:t.baseUrl,onerror:t.onerror}),this.attack=t.attack,this.release=t.release,this.curve=t.curve,this._buffers.loaded&&Promise.resolve().then(t.onload)}static getDefaults(){return Object.assign(Tn.getDefaults(),{attack:0,baseUrl:"",curve:"exponential",onload:jt,onerror:jt,release:.1,urls:{}})}_findClosest(t){let n=0;for(;n<96;){if(this._buffers.has(t+n))return-n;if(this._buffers.has(t-n))return n;n++}throw new Error(`No available buffers for note: ${t}`)}triggerAttack(t,e,n=1){return this.log("triggerAttack",t,e,n),Array.isArray(t)||(t=[t]),t.forEach(s=>{const r=Fd(new Je(this.context,s).toFrequency()),o=Math.round(r),a=r-o,c=this._findClosest(o),l=o-c,u=this._buffers.get(l),h=Ud(c+a),d=new Bs({url:u,context:this.context,curve:this.curve,fadeIn:this.attack,fadeOut:this.release,playbackRate:h}).connect(this.output);d.start(e,0,u.duration/h,n),Qe(this._activeSources.get(o))||this._activeSources.set(o,[]),this._activeSources.get(o).push(d),d.onended=()=>{if(this._activeSources&&this._activeSources.has(o)){const m=this._activeSources.get(o),_=m.indexOf(d);_!==-1&&m.splice(_,1)}}}),this}triggerRelease(t,e){return this.log("triggerRelease",t,e),Array.isArray(t)||(t=[t]),t.forEach(n=>{const s=new Je(this.context,n).toMidi();if(this._activeSources.has(s)&&this._activeSources.get(s).length){const r=this._activeSources.get(s);e=this.toSeconds(e),r.forEach(o=>{o.stop(e)}),this._activeSources.set(s,[])}}),this}releaseAll(t){const e=this.toSeconds(t);return this._activeSources.forEach(n=>{for(;n.length;)n.shift().stop(e)}),this}sync(){return this._syncState()&&(this._syncMethod("triggerAttack",1),this._syncMethod("triggerRelease",1)),this}triggerAttackRelease(t,e,n,s=1){const r=this.toSeconds(n);return this.triggerAttack(t,r,s),Qe(e)?(At(Qe(t),"notes must be an array when duration is array"),t.forEach((o,a)=>{const c=e[Math.min(a,e.length-1)];this.triggerRelease(o,r+this.toSeconds(c))})):this.triggerRelease(t,r+this.toSeconds(e)),this}add(t,e,n){if(At(Kr(t)||isFinite(t),`note must be a pitch or midi: ${t}`),Kr(t)){const s=new Je(this.context,t).toMidi();this._buffers.add(s,e,n)}else this._buffers.add(t,e,n);return this}get loaded(){return this._buffers.loaded}dispose(){return super.dispose(),this._buffers.dispose(),this._activeSources.forEach(t=>{t.forEach(e=>e.dispose())}),this._activeSources.clear(),this}}wn([si(0)],Cr.prototype,"attack",void 0);wn([si(0)],Cr.prototype,"release",void 0);class ra extends Re{constructor(){super($(ra.getDefaults(),arguments,["callback","value"])),this.name="ToneEvent",this._state=new Na("stopped"),this._startOffset=0;const t=$(ra.getDefaults(),arguments,["callback","value"]);this._loop=t.loop,this.callback=t.callback,this.value=t.value,this._loopStart=this.toTicks(t.loopStart),this._loopEnd=this.toTicks(t.loopEnd),this._playbackRate=t.playbackRate,this._probability=t.probability,this._humanize=t.humanize,this.mute=t.mute,this._playbackRate=t.playbackRate,this._state.increasing=!0,this._rescheduleEvents()}static getDefaults(){return Object.assign(Re.getDefaults(),{callback:jt,humanize:!1,loop:!1,loopEnd:"1m",loopStart:0,mute:!1,playbackRate:1,probability:1,value:null})}_rescheduleEvents(t=-1){this._state.forEachFrom(t,e=>{let n;if(e.state==="started"){e.id!==-1&&this.context.transport.clear(e.id);const s=e.time+Math.round(this.startOffset/this._playbackRate);if(this._loop===!0||yn(this._loop)&&this._loop>1){n=1/0,yn(this._loop)&&(n=this._loop*this._getLoopDuration());const r=this._state.getAfter(s);r!==null&&(n=Math.min(n,r.time-s)),n!==1/0&&(n=new nn(this.context,n));const o=new nn(this.context,this._getLoopDuration());e.id=this.context.transport.scheduleRepeat(this._tick.bind(this),o,new nn(this.context,s),n)}else e.id=this.context.transport.schedule(this._tick.bind(this),new nn(this.context,s))}})}get state(){return this._state.getValueAtTime(this.context.transport.ticks)}get startOffset(){return this._startOffset}set startOffset(t){this._startOffset=t}get probability(){return this._probability}set probability(t){this._probability=t}get humanize(){return this._humanize}set humanize(t){this._humanize=t}start(t){const e=this.toTicks(t);return this._state.getValueAtTime(e)==="stopped"&&(this._state.add({id:-1,state:"started",time:e}),this._rescheduleEvents(e)),this}stop(t){this.cancel(t);const e=this.toTicks(t);if(this._state.getValueAtTime(e)==="started"){this._state.setStateAtTime("stopped",e,{id:-1});const n=this._state.getBefore(e);let s=e;n!==null&&(s=n.time),this._rescheduleEvents(s)}return this}cancel(t){t=Xi(t,-1/0);const e=this.toTicks(t);return this._state.forEachFrom(e,n=>{this.context.transport.clear(n.id)}),this._state.cancel(e),this}_tick(t){const e=this.context.transport.getTicksAtTime(t);if(!this.mute&&this._state.getValueAtTime(e)==="started"){if(this.probability<1&&Math.random()>this.probability)return;if(this.humanize){let n=.02;Cd(this.humanize)||(n=this.toSeconds(this.humanize)),t+=(Math.random()*2-1)*n}this.callback(t,this.value)}}_getLoopDuration(){return(this._loopEnd-this._loopStart)/this._playbackRate}get loop(){return this._loop}set loop(t){this._loop=t,this._rescheduleEvents()}get playbackRate(){return this._playbackRate}set playbackRate(t){this._playbackRate=t,this._rescheduleEvents()}get loopEnd(){return new nn(this.context,this._loopEnd).toSeconds()}set loopEnd(t){this._loopEnd=this.toTicks(t),this._loop&&this._rescheduleEvents()}get loopStart(){return new nn(this.context,this._loopStart).toSeconds()}set loopStart(t){this._loopStart=this.toTicks(t),this._loop&&this._rescheduleEvents()}get progress(){if(this._loop){const t=this.context.transport.ticks,e=this._state.get(t);if(e!==null&&e.state==="started"){const n=this._getLoopDuration();return(t-e.time)%n/n}else return 0}else return 0}dispose(){return super.dispose(),this.cancel(),this._state.dispose(),this}}class ts extends Re{constructor(){super($(ts.getDefaults(),arguments,["callback","interval"])),this.name="Loop";const t=$(ts.getDefaults(),arguments,["callback","interval"]);this._event=new ra({context:this.context,callback:this._tick.bind(this),loop:!0,loopEnd:t.interval,playbackRate:t.playbackRate,probability:t.probability,humanize:t.humanize}),this.callback=t.callback,this.iterations=t.iterations}static getDefaults(){return Object.assign(Re.getDefaults(),{interval:"4n",callback:jt,playbackRate:1,iterations:1/0,probability:1,mute:!1,humanize:!1})}start(t){return this._event.start(t),this}stop(t){return this._event.stop(t),this}cancel(t){return this._event.cancel(t),this}_tick(t){this.callback(t)}get state(){return this._event.state}get progress(){return this._event.progress}get interval(){return this._event.loopEnd}set interval(t){this._event.loopEnd=t}get playbackRate(){return this._event.playbackRate}set playbackRate(t){this._event.playbackRate=t}get humanize(){return this._event.humanize}set humanize(t){this._event.humanize=t}get probability(){return this._event.probability}set probability(t){this._event.probability=t}get mute(){return this._event.mute}set mute(t){this._event.mute=t}get iterations(){return this._event.loop===!0?1/0:this._event.loop}set iterations(t){t===1/0?this._event.loop=!0:this._event.loop=t}dispose(){return super.dispose(),this._event.dispose(),this}}function*A0(i){let t=0;for(;t<i;)t=rs(t,0,i-1),yield t,t++}function*C0(i){let t=i-1;for(;t>=0;)t=rs(t,0,i-1),yield t,t--}function*ir(i,t){for(;;)yield*t(i)}function*Iu(i,t){let e=t?0:i-1;for(;;)e=rs(e,0,i-1),yield e,t?(e++,e>=i-1&&(t=!1)):(e--,e<=0&&(t=!0))}function*R0(i){let t=0,e=0;for(;t<i;)t=rs(t,0,i-1),yield t,e++,t+=e%2?2:-1}function*D0(i){let t=i-1,e=0;for(;t>=0;)t=rs(t,0,i-1),yield t,e++,t+=e%2?-2:1}function*P0(i){for(;;)yield Math.floor(Math.random()*i)}function*I0(i){const t=[];for(let e=0;e<i;e++)t.push(e);for(;t.length>0;){const e=t.splice(Math.floor(t.length*Math.random()),1);yield rs(e[0],0,i-1)}}function*N0(i){let t=Math.floor(Math.random()*i);for(;;)t===0?t++:t===i-1||Math.random()<.5?t--:t++,yield t}function*Nu(i,t="up",e=0){switch(At(i>=1,"The number of values must be at least one"),t){case"up":yield*ir(i,A0);case"down":yield*ir(i,C0);case"upDown":yield*Iu(i,!0);case"downUp":yield*Iu(i,!1);case"alternateUp":yield*ir(i,R0);case"alternateDown":yield*ir(i,D0);case"random":yield*P0(i);case"randomOnce":yield*ir(i,I0);case"randomWalk":yield*N0(i)}}class oa extends ts{constructor(){super($(oa.getDefaults(),arguments,["callback","values","pattern"])),this.name="Pattern";const t=$(oa.getDefaults(),arguments,["callback","values","pattern"]);this.callback=t.callback,this._values=t.values,this._pattern=Nu(t.values.length,t.pattern),this._type=t.pattern}static getDefaults(){return Object.assign(ts.getDefaults(),{pattern:"up",values:[],callback:jt})}_tick(t){const e=this._pattern.next();this._index=e.value,this._value=this._values[e.value],this.callback(t,this._value)}get values(){return this._values}set values(t){this._values=t,this.pattern=this._type}get value(){return this._value}get index(){return this._index}get pattern(){return this._type}set pattern(t){this._type=t,this._pattern=Nu(this._values.length,this._type)}}class Rr extends Tt{constructor(){super(Object.assign($(Rr.getDefaults(),arguments,["fade"]))),this.name="CrossFade",this._panner=this.context.createStereoPanner(),this._split=this.context.createChannelSplitter(2),this._g2a=new S0({context:this.context}),this.a=new qt({context:this.context,gain:0}),this.b=new qt({context:this.context,gain:0}),this.output=new qt({context:this.context}),this._internalChannels=[this.a,this.b];const t=$(Rr.getDefaults(),arguments,["fade"]);this.fade=new ie({context:this.context,units:"normalRange",value:t.fade}),$t(this,"fade"),this.context.getConstant(1).connect(this._panner),this._panner.connect(this._split),this._panner.channelCount=1,this._panner.channelCountMode="explicit",Mn(this._split,this.a.gain,0),Mn(this._split,this.b.gain,1),this.fade.chain(this._g2a,this._panner.pan),this.a.connect(this.output),this.b.connect(this.output)}static getDefaults(){return Object.assign(Tt.getDefaults(),{fade:.5})}dispose(){return super.dispose(),this.a.dispose(),this.b.dispose(),this.output.dispose(),this.fade.dispose(),this._g2a.dispose(),this._panner.disconnect(),this._split.disconnect(),this}}class aa extends Tt{constructor(t){super(t),this.name="Effect",this._dryWet=new Rr({context:this.context}),this.wet=this._dryWet.fade,this.effectSend=new qt({context:this.context}),this.effectReturn=new qt({context:this.context}),this.input=new qt({context:this.context}),this.output=this._dryWet,this.input.fan(this._dryWet.a,this.effectSend),this.effectReturn.connect(this._dryWet.b),this.wet.setValueAtTime(t.wet,0),this._internalChannels=[this.effectReturn,this.effectSend],$t(this,"wet")}static getDefaults(){return Object.assign(Tt.getDefaults(),{wet:1})}connectEffect(t){return this._internalChannels.push(t),this.effectSend.chain(t,this.effectReturn),this}dispose(){return super.dispose(),this._dryWet.dispose(),this.effectSend.dispose(),this.effectReturn.dispose(),this.wet.dispose(),this}}class ca extends Tt{constructor(){super(Object.assign($(ca.getDefaults(),arguments,["pan"]))),this.name="Panner",this._panner=this.context.createStereoPanner(),this.input=this._panner,this.output=this._panner;const t=$(ca.getDefaults(),arguments,["pan"]);this.pan=new Wt({context:this.context,param:this._panner.pan,value:t.pan,minValue:-1,maxValue:1}),this._panner.channelCount=t.channelCount,this._panner.channelCountMode="explicit",$t(this,"pan")}static getDefaults(){return Object.assign(Tt.getDefaults(),{pan:0,channelCount:1})}dispose(){return super.dispose(),this._panner.disconnect(),this.pan.dispose(),this}}const L0="bit-crusher",O0=`
	class BitCrusherWorklet extends SingleIOProcessor {

		static get parameterDescriptors() {
			return [{
				name: "bits",
				defaultValue: 12,
				minValue: 1,
				maxValue: 16,
				automationRate: 'k-rate'
			}];
		}

		generate(input, _channel, parameters) {
			const step = Math.pow(0.5, parameters.bits - 1);
			const val = step * Math.floor(input / step + 0.5);
			return val;
		}
	}
`;Hd(L0,O0);class Gs extends Tt{constructor(){super($(Gs.getDefaults(),arguments,["channels"])),this.name="Split";const t=$(Gs.getDefaults(),arguments,["channels"]);this._splitter=this.input=this.output=this.context.createChannelSplitter(t.channels),this._internalChannels=[this._splitter]}static getDefaults(){return Object.assign(Tt.getDefaults(),{channels:2})}dispose(){return super.dispose(),this._splitter.disconnect(),this}}class Hs extends Tt{constructor(){super($(Hs.getDefaults(),arguments,["channels"])),this.name="Merge";const t=$(Hs.getDefaults(),arguments,["channels"]);this._merger=this.output=this.input=this.context.createChannelMerger(t.channels)}static getDefaults(){return Object.assign(Tt.getDefaults(),{channels:2})}dispose(){return super.dispose(),this._merger.disconnect(),this}}class Lu extends Tt{constructor(t){super(t),this.name="StereoEffect",this.input=new qt({context:this.context}),this.input.channelCount=2,this.input.channelCountMode="explicit",this._dryWet=this.output=new Rr({context:this.context,fade:t.wet}),this.wet=this._dryWet.fade,this._split=new Gs({context:this.context,channels:2}),this._merge=new Hs({context:this.context,channels:2}),this.input.connect(this._split),this.input.connect(this._dryWet.a),this._merge.connect(this._dryWet.b),$t(this,["wet"])}connectEffectLeft(...t){this._split.connect(t[0],0,0),$i(...t),Mn(t[t.length-1],this._merge,0,0)}connectEffectRight(...t){this._split.connect(t[0],1,0),$i(...t),Mn(t[t.length-1],this._merge,0,1)}static getDefaults(){return Object.assign(Tt.getDefaults(),{wet:1})}dispose(){return super.dispose(),this._dryWet.dispose(),this._split.dispose(),this._merge.dispose(),this}}class Ou extends Lu{constructor(t){super(t),this.feedback=new ie({context:this.context,value:t.feedback,units:"normalRange"}),this._feedbackL=new qt({context:this.context}),this._feedbackR=new qt({context:this.context}),this._feedbackSplit=new Gs({context:this.context,channels:2}),this._feedbackMerge=new Hs({context:this.context,channels:2}),this._merge.connect(this._feedbackSplit),this._feedbackMerge.connect(this._split),this._feedbackSplit.connect(this._feedbackL,0,0),this._feedbackL.connect(this._feedbackMerge,0,0),this._feedbackSplit.connect(this._feedbackR,1,0),this._feedbackR.connect(this._feedbackMerge,0,1),this.feedback.fan(this._feedbackL.gain,this._feedbackR.gain),$t(this,["feedback"])}static getDefaults(){return Object.assign(Lu.getDefaults(),{feedback:.5})}dispose(){return super.dispose(),this.feedback.dispose(),this._feedbackL.dispose(),this._feedbackR.dispose(),this._feedbackSplit.dispose(),this._feedbackMerge.dispose(),this}}class la extends Ou{constructor(){super($(la.getDefaults(),arguments,["frequency","delayTime","depth"])),this.name="Chorus";const t=$(la.getDefaults(),arguments,["frequency","delayTime","depth"]);this._depth=t.depth,this._delayTime=t.delayTime/1e3,this._lfoL=new br({context:this.context,frequency:t.frequency,min:0,max:1}),this._lfoR=new br({context:this.context,frequency:t.frequency,min:0,max:1,phase:180}),this._delayNodeL=new ks({context:this.context}),this._delayNodeR=new ks({context:this.context}),this.frequency=this._lfoL.frequency,$t(this,["frequency"]),this._lfoL.frequency.connect(this._lfoR.frequency),this.connectEffectLeft(this._delayNodeL),this.connectEffectRight(this._delayNodeR),this._lfoL.connect(this._delayNodeL.delayTime),this._lfoR.connect(this._delayNodeR.delayTime),this.depth=this._depth,this.type=t.type,this.spread=t.spread}static getDefaults(){return Object.assign(Ou.getDefaults(),{frequency:1.5,delayTime:3.5,depth:.7,type:"sine",spread:180,feedback:0,wet:.5})}get depth(){return this._depth}set depth(t){this._depth=t;const e=this._delayTime*t;this._lfoL.min=Math.max(this._delayTime-e,0),this._lfoL.max=this._delayTime+e,this._lfoR.min=Math.max(this._delayTime-e,0),this._lfoR.max=this._delayTime+e}get delayTime(){return this._delayTime*1e3}set delayTime(t){this._delayTime=t/1e3,this.depth=this._depth}get type(){return this._lfoL.type}set type(t){this._lfoL.type=t,this._lfoR.type=t}get spread(){return this._lfoR.phase-this._lfoL.phase}set spread(t){this._lfoL.phase=90-t/2,this._lfoR.phase=t/2+90}start(t){return this._lfoL.start(t),this._lfoR.start(t),this}stop(t){return this._lfoL.stop(t),this._lfoR.stop(t),this}sync(){return this._lfoL.sync(),this._lfoR.sync(),this}unsync(){return this._lfoL.unsync(),this._lfoR.unsync(),this}dispose(){return super.dispose(),this._lfoL.dispose(),this._lfoR.dispose(),this._delayNodeL.dispose(),this._delayNodeR.dispose(),this.frequency.dispose(),this}}class Uu extends aa{constructor(t){super(t),this.name="FeedbackEffect",this._feedbackGain=new qt({context:this.context,gain:t.feedback,units:"normalRange"}),this.feedback=this._feedbackGain.gain,$t(this,"feedback"),this.effectReturn.chain(this._feedbackGain,this.effectSend)}static getDefaults(){return Object.assign(aa.getDefaults(),{feedback:.125})}dispose(){return super.dispose(),this._feedbackGain.dispose(),this.feedback.dispose(),this}}class ua extends Uu{constructor(){super($(ua.getDefaults(),arguments,["delayTime","feedback"])),this.name="FeedbackDelay";const t=$(ua.getDefaults(),arguments,["delayTime","feedback"]);this._delayNode=new ks({context:this.context,delayTime:t.delayTime,maxDelay:t.maxDelay}),this.delayTime=this._delayNode.delayTime,this.connectEffect(this._delayNode),$t(this,"delayTime")}static getDefaults(){return Object.assign(Uu.getDefaults(),{delayTime:.25,maxDelay:1})}dispose(){return super.dispose(),this._delayNode.dispose(),this.delayTime.dispose(),this}}class ha extends aa{constructor(){super($(ha.getDefaults(),arguments,["decay"])),this.name="Reverb",this._convolver=this.context.createConvolver(),this.ready=Promise.resolve();const t=$(ha.getDefaults(),arguments,["decay"]);this._decay=t.decay,this._preDelay=t.preDelay,this.generate(),this.connectEffect(this._convolver)}static getDefaults(){return Object.assign(aa.getDefaults(),{decay:1.5,preDelay:.01})}get decay(){return this._decay}set decay(t){t=this.toSeconds(t),Sn(t,.001),this._decay=t,this.generate()}get preDelay(){return this._preDelay}set preDelay(t){t=this.toSeconds(t),Sn(t,0),this._preDelay=t,this.generate()}generate(){return ge(this,void 0,void 0,function*(){const t=this.ready,e=new Pa(2,this._decay+this._preDelay,this.context.sampleRate),n=new Ji({context:e}),s=new Ji({context:e}),r=new Hs({context:e});n.connect(r,0,0),s.connect(r,0,1);const o=new qt({context:e}).toDestination();r.connect(o),n.start(0),s.start(0),o.gain.setValueAtTime(0,0),o.gain.setValueAtTime(1,this._preDelay),o.gain.exponentialApproachValueAtTime(0,this._preDelay,this.decay);const a=e.render();return this.ready=a.then(jt),yield t,this._convolver.buffer=(yield a).get(),this})}dispose(){return super.dispose(),this._convolver.disconnect(),this}}class da extends Tt{constructor(){super($(da.getDefaults(),arguments,["type","size"])),this.name="Analyser",this._analysers=[],this._buffers=[];const t=$(da.getDefaults(),arguments,["type","size"]);this.input=this.output=this._gain=new qt({context:this.context}),this._split=new Gs({context:this.context,channels:t.channels}),this.input.connect(this._split),Sn(t.channels,1);for(let e=0;e<t.channels;e++)this._analysers[e]=this.context.createAnalyser(),this._split.connect(this._analysers[e],e,0);this.size=t.size,this.type=t.type,this.smoothing=t.smoothing}static getDefaults(){return Object.assign(Tt.getDefaults(),{size:1024,smoothing:.8,type:"fft",channels:1})}getValue(){return this._analysers.forEach((t,e)=>{const n=this._buffers[e];this._type==="fft"?t.getFloatFrequencyData(n):this._type==="waveform"&&t.getFloatTimeDomainData(n)}),this.channels===1?this._buffers[0]:this._buffers}get size(){return this._analysers[0].frequencyBinCount}set size(t){this._analysers.forEach((e,n)=>{e.fftSize=t*2,this._buffers[n]=new Float32Array(t)})}get channels(){return this._analysers.length}get type(){return this._type}set type(t){At(t==="waveform"||t==="fft",`Analyser: invalid type: ${t}`),this._type=t}get smoothing(){return this._analysers[0].smoothingTimeConstant}set smoothing(t){this._analysers.forEach(e=>e.smoothingTimeConstant=t)}dispose(){return super.dispose(),this._analysers.forEach(t=>t.disconnect()),this._split.dispose(),this._gain.dispose(),this}}class _e extends Tt{constructor(){super($(_e.getDefaults(),arguments,["solo"])),this.name="Solo";const t=$(_e.getDefaults(),arguments,["solo"]);this.input=this.output=new qt({context:this.context}),_e._allSolos.has(this.context)||_e._allSolos.set(this.context,new Set),_e._allSolos.get(this.context).add(this),this.solo=t.solo}static getDefaults(){return Object.assign(Tt.getDefaults(),{solo:!1})}get solo(){return this._isSoloed()}set solo(t){t?this._addSolo():this._removeSolo(),_e._allSolos.get(this.context).forEach(e=>e._updateSolo())}get muted(){return this.input.gain.value===0}_addSolo(){_e._soloed.has(this.context)||_e._soloed.set(this.context,new Set),_e._soloed.get(this.context).add(this)}_removeSolo(){_e._soloed.has(this.context)&&_e._soloed.get(this.context).delete(this)}_isSoloed(){return _e._soloed.has(this.context)&&_e._soloed.get(this.context).has(this)}_noSolos(){return!_e._soloed.has(this.context)||_e._soloed.has(this.context)&&_e._soloed.get(this.context).size===0}_updateSolo(){this._isSoloed()?this.input.gain.value=1:this._noSolos()?this.input.gain.value=1:this.input.gain.value=0}dispose(){return super.dispose(),_e._allSolos.get(this.context).delete(this),this._removeSolo(),this}}_e._allSolos=new Map;_e._soloed=new Map;class fa extends Tt{constructor(){super($(fa.getDefaults(),arguments,["pan","volume"])),this.name="PanVol";const t=$(fa.getDefaults(),arguments,["pan","volume"]);this._panner=this.input=new ca({context:this.context,pan:t.pan,channelCount:t.channelCount}),this.pan=this._panner.pan,this._volume=this.output=new Zi({context:this.context,volume:t.volume}),this.volume=this._volume.volume,this._panner.connect(this._volume),this.mute=t.mute,$t(this,["pan","volume"])}static getDefaults(){return Object.assign(Tt.getDefaults(),{mute:!1,pan:0,volume:0,channelCount:1})}get mute(){return this._volume.mute}set mute(t){this._volume.mute=t}dispose(){return super.dispose(),this._panner.dispose(),this.pan.dispose(),this._volume.dispose(),this.volume.dispose(),this}}class Oi extends Tt{constructor(){super($(Oi.getDefaults(),arguments,["volume","pan"])),this.name="Channel";const t=$(Oi.getDefaults(),arguments,["volume","pan"]);this._solo=this.input=new _e({solo:t.solo,context:this.context}),this._panVol=this.output=new fa({context:this.context,pan:t.pan,volume:t.volume,mute:t.mute,channelCount:t.channelCount}),this.pan=this._panVol.pan,this.volume=this._panVol.volume,this._solo.connect(this._panVol),$t(this,["pan","volume"])}static getDefaults(){return Object.assign(Tt.getDefaults(),{pan:0,volume:0,mute:!1,solo:!1,channelCount:1})}get solo(){return this._solo.solo}set solo(t){this._solo.solo=t}get muted(){return this._solo.muted||this.mute}get mute(){return this._panVol.mute}set mute(t){this._panVol.mute=t}_getBus(t){return Oi.buses.has(t)||Oi.buses.set(t,new qt({context:this.context})),Oi.buses.get(t)}send(t,e=0){const n=this._getBus(t),s=new qt({context:this.context,units:"decibels",gain:e});return this.connect(s),s.connect(n),s}receive(t){return this._getBus(t).connect(this),this}dispose(){return super.dispose(),this._panVol.dispose(),this.pan.dispose(),this.volume.dispose(),this._solo.dispose(),this}}Oi.buses=new Map;class U0 extends Tt{constructor(){super(...arguments),this.name="Listener",this.positionX=new Wt({context:this.context,param:this.context.rawContext.listener.positionX}),this.positionY=new Wt({context:this.context,param:this.context.rawContext.listener.positionY}),this.positionZ=new Wt({context:this.context,param:this.context.rawContext.listener.positionZ}),this.forwardX=new Wt({context:this.context,param:this.context.rawContext.listener.forwardX}),this.forwardY=new Wt({context:this.context,param:this.context.rawContext.listener.forwardY}),this.forwardZ=new Wt({context:this.context,param:this.context.rawContext.listener.forwardZ}),this.upX=new Wt({context:this.context,param:this.context.rawContext.listener.upX}),this.upY=new Wt({context:this.context,param:this.context.rawContext.listener.upY}),this.upZ=new Wt({context:this.context,param:this.context.rawContext.listener.upZ})}static getDefaults(){return Object.assign(Tt.getDefaults(),{positionX:0,positionY:0,positionZ:0,forwardX:0,forwardY:0,forwardZ:-1,upX:0,upY:1,upZ:0})}dispose(){return super.dispose(),this.positionX.dispose(),this.positionY.dispose(),this.positionZ.dispose(),this.forwardX.dispose(),this.forwardY.dispose(),this.forwardZ.dispose(),this.upX.dispose(),this.upY.dispose(),this.upZ.dispose(),this}}Ra(i=>{i.listener=new U0({context:i})});Da(i=>{i.listener.dispose()});const Wd=mn().transport,qd=mn().destination;mn().destination;mn().listener;mn().draw;mn();/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const zl="168",F0=0,Fu=1,k0=2,Xd=1,B0=2,Yn=3,Si=0,qe=1,$n=2,_i=0,Ds=1,ku=2,Bu=3,Vu=4,V0=5,Ui=100,z0=101,G0=102,H0=103,W0=104,q0=200,X0=201,Y0=202,j0=203,Nc=204,Lc=205,$0=206,Z0=207,K0=208,J0=209,Q0=210,tx=211,ex=212,nx=213,ix=214,sx=0,rx=1,ox=2,pa=3,ax=4,cx=5,lx=6,ux=7,Yd=0,hx=1,dx=2,gi=0,fx=1,px=2,mx=3,_x=4,gx=5,vx=6,xx=7,jd=300,Ws=301,qs=302,Oc=303,Uc=304,Ua=306,Fc=1e3,Vi=1001,kc=1002,rn=1003,yx=1004,Qr=1005,pn=1006,Za=1007,zi=1008,ti=1009,$d=1010,Zd=1011,Dr=1012,Gl=1013,es=1014,Zn=1015,Gr=1016,Hl=1017,Wl=1018,Xs=1020,Kd=35902,Jd=1021,Qd=1022,gn=1023,tf=1024,ef=1025,Ps=1026,Ys=1027,nf=1028,ql=1029,sf=1030,Xl=1031,Yl=1033,Ao=33776,Co=33777,Ro=33778,Do=33779,Bc=35840,Vc=35841,zc=35842,Gc=35843,Hc=36196,Wc=37492,qc=37496,Xc=37808,Yc=37809,jc=37810,$c=37811,Zc=37812,Kc=37813,Jc=37814,Qc=37815,tl=37816,el=37817,nl=37818,il=37819,sl=37820,rl=37821,Po=36492,ol=36494,al=36495,rf=36283,cl=36284,ll=36285,ul=36286,Sx=3200,Mx=3201,of=0,Tx=1,pi="",Cn="srgb",bi="srgb-linear",jl="display-p3",Fa="display-p3-linear",ma="linear",ae="srgb",_a="rec709",ga="p3",ls=7680,zu=519,Ex=512,bx=513,wx=514,af=515,Ax=516,Cx=517,Rx=518,Dx=519,Gu=35044,Hu="300 es",Kn=2e3,va=2001;class tr{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}}const Ne=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Ka=Math.PI/180,hl=180/Math.PI;function Hr(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ne[i&255]+Ne[i>>8&255]+Ne[i>>16&255]+Ne[i>>24&255]+"-"+Ne[t&255]+Ne[t>>8&255]+"-"+Ne[t>>16&15|64]+Ne[t>>24&255]+"-"+Ne[e&63|128]+Ne[e>>8&255]+"-"+Ne[e>>16&255]+Ne[e>>24&255]+Ne[n&255]+Ne[n>>8&255]+Ne[n>>16&255]+Ne[n>>24&255]).toLowerCase()}function We(i,t,e){return Math.max(t,Math.min(e,i))}function Px(i,t){return(i%t+t)%t}function Ja(i,t,e){return(1-e)*i+e*t}function sr(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Ge(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}class Gt{constructor(t=0,e=0){Gt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(We(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Bt{constructor(t,e,n,s,r,o,a,c,l){Bt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,c,l)}set(t,e,n,s,r,o,a,c,l){const u=this.elements;return u[0]=t,u[1]=s,u[2]=a,u[3]=e,u[4]=r,u[5]=c,u[6]=n,u[7]=o,u[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],u=n[4],h=n[7],d=n[2],m=n[5],_=n[8],g=s[0],p=s[3],f=s[6],y=s[1],x=s[4],T=s[7],w=s[2],E=s[5],b=s[8];return r[0]=o*g+a*y+c*w,r[3]=o*p+a*x+c*E,r[6]=o*f+a*T+c*b,r[1]=l*g+u*y+h*w,r[4]=l*p+u*x+h*E,r[7]=l*f+u*T+h*b,r[2]=d*g+m*y+_*w,r[5]=d*p+m*x+_*E,r[8]=d*f+m*T+_*b,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],u=t[8];return e*o*u-e*a*l-n*r*u+n*a*c+s*r*l-s*o*c}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],u=t[8],h=u*o-a*l,d=a*c-u*r,m=l*r-o*c,_=e*h+n*d+s*m;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);const g=1/_;return t[0]=h*g,t[1]=(s*l-u*n)*g,t[2]=(a*n-s*o)*g,t[3]=d*g,t[4]=(u*e-s*c)*g,t[5]=(s*r-a*e)*g,t[6]=m*g,t[7]=(n*c-l*e)*g,t[8]=(o*e-n*r)*g,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*o+l*a)+o+t,-s*l,s*c,-s*(-l*o+c*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(Qa.makeScale(t,e)),this}rotate(t){return this.premultiply(Qa.makeRotation(-t)),this}translate(t,e){return this.premultiply(Qa.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Qa=new Bt;function cf(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function xa(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Ix(){const i=xa("canvas");return i.style.display="block",i}const Wu={};function fr(i){i in Wu||(Wu[i]=!0,console.warn(i))}function Nx(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}const qu=new Bt().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Xu=new Bt().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),rr={[bi]:{transfer:ma,primaries:_a,luminanceCoefficients:[.2126,.7152,.0722],toReference:i=>i,fromReference:i=>i},[Cn]:{transfer:ae,primaries:_a,luminanceCoefficients:[.2126,.7152,.0722],toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[Fa]:{transfer:ma,primaries:ga,luminanceCoefficients:[.2289,.6917,.0793],toReference:i=>i.applyMatrix3(Xu),fromReference:i=>i.applyMatrix3(qu)},[jl]:{transfer:ae,primaries:ga,luminanceCoefficients:[.2289,.6917,.0793],toReference:i=>i.convertSRGBToLinear().applyMatrix3(Xu),fromReference:i=>i.applyMatrix3(qu).convertLinearToSRGB()}},Lx=new Set([bi,Fa]),ee={enabled:!0,_workingColorSpace:bi,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!Lx.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,t,e){if(this.enabled===!1||t===e||!t||!e)return i;const n=rr[t].toReference,s=rr[e].fromReference;return s(n(i))},fromWorkingColorSpace:function(i,t){return this.convert(i,this._workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this._workingColorSpace)},getPrimaries:function(i){return rr[i].primaries},getTransfer:function(i){return i===pi?ma:rr[i].transfer},getLuminanceCoefficients:function(i,t=this._workingColorSpace){return i.fromArray(rr[t].luminanceCoefficients)}};function Is(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function tc(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let us;class Ox{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{us===void 0&&(us=xa("canvas")),us.width=t.width,us.height=t.height;const n=us.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=us}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=xa("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Is(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Is(e[n]/255)*255):e[n]=Is(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Ux=0;class lf{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Ux++}),this.uuid=Hr(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(ec(s[o].image)):r.push(ec(s[o]))}else r=ec(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function ec(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Ox.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Fx=0;class Xe extends tr{constructor(t=Xe.DEFAULT_IMAGE,e=Xe.DEFAULT_MAPPING,n=Vi,s=Vi,r=pn,o=zi,a=gn,c=ti,l=Xe.DEFAULT_ANISOTROPY,u=pi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Fx++}),this.uuid=Hr(),this.name="",this.source=new lf(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new Gt(0,0),this.repeat=new Gt(1,1),this.center=new Gt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Bt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==jd)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Fc:t.x=t.x-Math.floor(t.x);break;case Vi:t.x=t.x<0?0:1;break;case kc:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Fc:t.y=t.y-Math.floor(t.y);break;case Vi:t.y=t.y<0?0:1;break;case kc:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Xe.DEFAULT_IMAGE=null;Xe.DEFAULT_MAPPING=jd;Xe.DEFAULT_ANISOTROPY=1;class Ae{constructor(t=0,e=0,n=0,s=1){Ae.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const c=t.elements,l=c[0],u=c[4],h=c[8],d=c[1],m=c[5],_=c[9],g=c[2],p=c[6],f=c[10];if(Math.abs(u-d)<.01&&Math.abs(h-g)<.01&&Math.abs(_-p)<.01){if(Math.abs(u+d)<.1&&Math.abs(h+g)<.1&&Math.abs(_+p)<.1&&Math.abs(l+m+f-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const x=(l+1)/2,T=(m+1)/2,w=(f+1)/2,E=(u+d)/4,b=(h+g)/4,C=(_+p)/4;return x>T&&x>w?x<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(x),s=E/n,r=b/n):T>w?T<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(T),n=E/s,r=C/s):w<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(w),n=b/r,s=C/r),this.set(n,s,r,e),this}let y=Math.sqrt((p-_)*(p-_)+(h-g)*(h-g)+(d-u)*(d-u));return Math.abs(y)<.001&&(y=1),this.x=(p-_)/y,this.y=(h-g)/y,this.z=(d-u)/y,this.w=Math.acos((l+m+f-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class kx extends tr{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Ae(0,0,t,e),this.scissorTest=!1,this.viewport=new Ae(0,0,t,e);const s={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:pn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const r=new Xe(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,s=t.textures.length;n<s;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new lf(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ns extends kx{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class uf extends Xe{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=rn,this.minFilter=rn,this.wrapR=Vi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Bx extends Xe{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=rn,this.minFilter=rn,this.wrapR=Vi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Wr{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let c=n[s+0],l=n[s+1],u=n[s+2],h=n[s+3];const d=r[o+0],m=r[o+1],_=r[o+2],g=r[o+3];if(a===0){t[e+0]=c,t[e+1]=l,t[e+2]=u,t[e+3]=h;return}if(a===1){t[e+0]=d,t[e+1]=m,t[e+2]=_,t[e+3]=g;return}if(h!==g||c!==d||l!==m||u!==_){let p=1-a;const f=c*d+l*m+u*_+h*g,y=f>=0?1:-1,x=1-f*f;if(x>Number.EPSILON){const w=Math.sqrt(x),E=Math.atan2(w,f*y);p=Math.sin(p*E)/w,a=Math.sin(a*E)/w}const T=a*y;if(c=c*p+d*T,l=l*p+m*T,u=u*p+_*T,h=h*p+g*T,p===1-a){const w=1/Math.sqrt(c*c+l*l+u*u+h*h);c*=w,l*=w,u*=w,h*=w}}t[e]=c,t[e+1]=l,t[e+2]=u,t[e+3]=h}static multiplyQuaternionsFlat(t,e,n,s,r,o){const a=n[s],c=n[s+1],l=n[s+2],u=n[s+3],h=r[o],d=r[o+1],m=r[o+2],_=r[o+3];return t[e]=a*_+u*h+c*m-l*d,t[e+1]=c*_+u*d+l*h-a*m,t[e+2]=l*_+u*m+a*d-c*h,t[e+3]=u*_-a*h-c*d-l*m,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,c=Math.sin,l=a(n/2),u=a(s/2),h=a(r/2),d=c(n/2),m=c(s/2),_=c(r/2);switch(o){case"XYZ":this._x=d*u*h+l*m*_,this._y=l*m*h-d*u*_,this._z=l*u*_+d*m*h,this._w=l*u*h-d*m*_;break;case"YXZ":this._x=d*u*h+l*m*_,this._y=l*m*h-d*u*_,this._z=l*u*_-d*m*h,this._w=l*u*h+d*m*_;break;case"ZXY":this._x=d*u*h-l*m*_,this._y=l*m*h+d*u*_,this._z=l*u*_+d*m*h,this._w=l*u*h-d*m*_;break;case"ZYX":this._x=d*u*h-l*m*_,this._y=l*m*h+d*u*_,this._z=l*u*_-d*m*h,this._w=l*u*h+d*m*_;break;case"YZX":this._x=d*u*h+l*m*_,this._y=l*m*h+d*u*_,this._z=l*u*_-d*m*h,this._w=l*u*h-d*m*_;break;case"XZY":this._x=d*u*h-l*m*_,this._y=l*m*h-d*u*_,this._z=l*u*_+d*m*h,this._w=l*u*h+d*m*_;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],c=e[9],l=e[2],u=e[6],h=e[10],d=n+a+h;if(d>0){const m=.5/Math.sqrt(d+1);this._w=.25/m,this._x=(u-c)*m,this._y=(r-l)*m,this._z=(o-s)*m}else if(n>a&&n>h){const m=2*Math.sqrt(1+n-a-h);this._w=(u-c)/m,this._x=.25*m,this._y=(s+o)/m,this._z=(r+l)/m}else if(a>h){const m=2*Math.sqrt(1+a-n-h);this._w=(r-l)/m,this._x=(s+o)/m,this._y=.25*m,this._z=(c+u)/m}else{const m=2*Math.sqrt(1+h-n-a);this._w=(o-s)/m,this._x=(r+l)/m,this._y=(c+u)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(We(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,c=e._y,l=e._z,u=e._w;return this._x=n*u+o*a+s*l-r*c,this._y=s*u+o*c+r*a-n*l,this._z=r*u+o*l+n*c-s*a,this._w=o*u-n*a-s*c-r*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,o=this._w;let a=o*t._w+n*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;const c=1-a*a;if(c<=Number.EPSILON){const m=1-e;return this._w=m*o+e*this._w,this._x=m*n+e*this._x,this._y=m*s+e*this._y,this._z=m*r+e*this._z,this.normalize(),this}const l=Math.sqrt(c),u=Math.atan2(l,a),h=Math.sin((1-e)*u)/l,d=Math.sin(e*u)/l;return this._w=o*h+this._w*d,this._x=n*h+this._x*d,this._y=s*h+this._y*d,this._z=r*h+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class G{constructor(t=0,e=0,n=0){G.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Yu.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Yu.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,c=t.w,l=2*(o*s-a*n),u=2*(a*e-r*s),h=2*(r*n-o*e);return this.x=e+c*l+o*h-a*u,this.y=n+c*u+a*l-r*h,this.z=s+c*h+r*u-o*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,c=e.z;return this.x=s*c-r*a,this.y=r*o-n*c,this.z=n*a-s*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return nc.copy(this).projectOnVector(t),this.sub(nc)}reflect(t){return this.sub(nc.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(We(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const nc=new G,Yu=new Wr;class qr{constructor(t=new G(1/0,1/0,1/0),e=new G(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(un.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(un.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=un.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,un):un.fromBufferAttribute(r,o),un.applyMatrix4(t.matrixWorld),this.expandByPoint(un);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),to.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),to.copy(n.boundingBox)),to.applyMatrix4(t.matrixWorld),this.union(to)}const s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,un),un.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(or),eo.subVectors(this.max,or),hs.subVectors(t.a,or),ds.subVectors(t.b,or),fs.subVectors(t.c,or),ai.subVectors(ds,hs),ci.subVectors(fs,ds),Ai.subVectors(hs,fs);let e=[0,-ai.z,ai.y,0,-ci.z,ci.y,0,-Ai.z,Ai.y,ai.z,0,-ai.x,ci.z,0,-ci.x,Ai.z,0,-Ai.x,-ai.y,ai.x,0,-ci.y,ci.x,0,-Ai.y,Ai.x,0];return!ic(e,hs,ds,fs,eo)||(e=[1,0,0,0,1,0,0,0,1],!ic(e,hs,ds,fs,eo))?!1:(no.crossVectors(ai,ci),e=[no.x,no.y,no.z],ic(e,hs,ds,fs,eo))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,un).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(un).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Gn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Gn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Gn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Gn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Gn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Gn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Gn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Gn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Gn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Gn=[new G,new G,new G,new G,new G,new G,new G,new G],un=new G,to=new qr,hs=new G,ds=new G,fs=new G,ai=new G,ci=new G,Ai=new G,or=new G,eo=new G,no=new G,Ci=new G;function ic(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){Ci.fromArray(i,r);const a=s.x*Math.abs(Ci.x)+s.y*Math.abs(Ci.y)+s.z*Math.abs(Ci.z),c=t.dot(Ci),l=e.dot(Ci),u=n.dot(Ci);if(Math.max(-Math.max(c,l,u),Math.min(c,l,u))>a)return!1}return!0}const Vx=new qr,ar=new G,sc=new G;class ka{constructor(t=new G,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Vx.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;ar.subVectors(t,this.center);const e=ar.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(ar,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(sc.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(ar.copy(t.center).add(sc)),this.expandByPoint(ar.copy(t.center).sub(sc))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Hn=new G,rc=new G,io=new G,li=new G,oc=new G,so=new G,ac=new G;class hf{constructor(t=new G,e=new G(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Hn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Hn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Hn.copy(this.origin).addScaledVector(this.direction,e),Hn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){rc.copy(t).add(e).multiplyScalar(.5),io.copy(e).sub(t).normalize(),li.copy(this.origin).sub(rc);const r=t.distanceTo(e)*.5,o=-this.direction.dot(io),a=li.dot(this.direction),c=-li.dot(io),l=li.lengthSq(),u=Math.abs(1-o*o);let h,d,m,_;if(u>0)if(h=o*c-a,d=o*a-c,_=r*u,h>=0)if(d>=-_)if(d<=_){const g=1/u;h*=g,d*=g,m=h*(h+o*d+2*a)+d*(o*h+d+2*c)+l}else d=r,h=Math.max(0,-(o*d+a)),m=-h*h+d*(d+2*c)+l;else d=-r,h=Math.max(0,-(o*d+a)),m=-h*h+d*(d+2*c)+l;else d<=-_?(h=Math.max(0,-(-o*r+a)),d=h>0?-r:Math.min(Math.max(-r,-c),r),m=-h*h+d*(d+2*c)+l):d<=_?(h=0,d=Math.min(Math.max(-r,-c),r),m=d*(d+2*c)+l):(h=Math.max(0,-(o*r+a)),d=h>0?r:Math.min(Math.max(-r,-c),r),m=-h*h+d*(d+2*c)+l);else d=o>0?-r:r,h=Math.max(0,-(o*d+a)),m=-h*h+d*(d+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,h),s&&s.copy(rc).addScaledVector(io,d),m}intersectSphere(t,e){Hn.subVectors(t.center,this.origin);const n=Hn.dot(this.direction),s=Hn.dot(Hn)-n*n,r=t.radius*t.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,c;const l=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,d=this.origin;return l>=0?(n=(t.min.x-d.x)*l,s=(t.max.x-d.x)*l):(n=(t.max.x-d.x)*l,s=(t.min.x-d.x)*l),u>=0?(r=(t.min.y-d.y)*u,o=(t.max.y-d.y)*u):(r=(t.max.y-d.y)*u,o=(t.min.y-d.y)*u),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),h>=0?(a=(t.min.z-d.z)*h,c=(t.max.z-d.z)*h):(a=(t.max.z-d.z)*h,c=(t.min.z-d.z)*h),n>c||a>s)||((a>n||n!==n)&&(n=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Hn)!==null}intersectTriangle(t,e,n,s,r){oc.subVectors(e,t),so.subVectors(n,t),ac.crossVectors(oc,so);let o=this.direction.dot(ac),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;li.subVectors(this.origin,t);const c=a*this.direction.dot(so.crossVectors(li,so));if(c<0)return null;const l=a*this.direction.dot(oc.cross(li));if(l<0||c+l>o)return null;const u=-a*li.dot(ac);return u<0?null:this.at(u/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Me{constructor(t,e,n,s,r,o,a,c,l,u,h,d,m,_,g,p){Me.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,c,l,u,h,d,m,_,g,p)}set(t,e,n,s,r,o,a,c,l,u,h,d,m,_,g,p){const f=this.elements;return f[0]=t,f[4]=e,f[8]=n,f[12]=s,f[1]=r,f[5]=o,f[9]=a,f[13]=c,f[2]=l,f[6]=u,f[10]=h,f[14]=d,f[3]=m,f[7]=_,f[11]=g,f[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Me().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/ps.setFromMatrixColumn(t,0).length(),r=1/ps.setFromMatrixColumn(t,1).length(),o=1/ps.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(s),l=Math.sin(s),u=Math.cos(r),h=Math.sin(r);if(t.order==="XYZ"){const d=o*u,m=o*h,_=a*u,g=a*h;e[0]=c*u,e[4]=-c*h,e[8]=l,e[1]=m+_*l,e[5]=d-g*l,e[9]=-a*c,e[2]=g-d*l,e[6]=_+m*l,e[10]=o*c}else if(t.order==="YXZ"){const d=c*u,m=c*h,_=l*u,g=l*h;e[0]=d+g*a,e[4]=_*a-m,e[8]=o*l,e[1]=o*h,e[5]=o*u,e[9]=-a,e[2]=m*a-_,e[6]=g+d*a,e[10]=o*c}else if(t.order==="ZXY"){const d=c*u,m=c*h,_=l*u,g=l*h;e[0]=d-g*a,e[4]=-o*h,e[8]=_+m*a,e[1]=m+_*a,e[5]=o*u,e[9]=g-d*a,e[2]=-o*l,e[6]=a,e[10]=o*c}else if(t.order==="ZYX"){const d=o*u,m=o*h,_=a*u,g=a*h;e[0]=c*u,e[4]=_*l-m,e[8]=d*l+g,e[1]=c*h,e[5]=g*l+d,e[9]=m*l-_,e[2]=-l,e[6]=a*c,e[10]=o*c}else if(t.order==="YZX"){const d=o*c,m=o*l,_=a*c,g=a*l;e[0]=c*u,e[4]=g-d*h,e[8]=_*h+m,e[1]=h,e[5]=o*u,e[9]=-a*u,e[2]=-l*u,e[6]=m*h+_,e[10]=d-g*h}else if(t.order==="XZY"){const d=o*c,m=o*l,_=a*c,g=a*l;e[0]=c*u,e[4]=-h,e[8]=l*u,e[1]=d*h+g,e[5]=o*u,e[9]=m*h-_,e[2]=_*h-m,e[6]=a*u,e[10]=g*h+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(zx,t,Gx)}lookAt(t,e,n){const s=this.elements;return Ze.subVectors(t,e),Ze.lengthSq()===0&&(Ze.z=1),Ze.normalize(),ui.crossVectors(n,Ze),ui.lengthSq()===0&&(Math.abs(n.z)===1?Ze.x+=1e-4:Ze.z+=1e-4,Ze.normalize(),ui.crossVectors(n,Ze)),ui.normalize(),ro.crossVectors(Ze,ui),s[0]=ui.x,s[4]=ro.x,s[8]=Ze.x,s[1]=ui.y,s[5]=ro.y,s[9]=Ze.y,s[2]=ui.z,s[6]=ro.z,s[10]=Ze.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],u=n[1],h=n[5],d=n[9],m=n[13],_=n[2],g=n[6],p=n[10],f=n[14],y=n[3],x=n[7],T=n[11],w=n[15],E=s[0],b=s[4],C=s[8],S=s[12],v=s[1],R=s[5],P=s[9],N=s[13],F=s[2],z=s[6],U=s[10],B=s[14],V=s[3],j=s[7],J=s[11],nt=s[15];return r[0]=o*E+a*v+c*F+l*V,r[4]=o*b+a*R+c*z+l*j,r[8]=o*C+a*P+c*U+l*J,r[12]=o*S+a*N+c*B+l*nt,r[1]=u*E+h*v+d*F+m*V,r[5]=u*b+h*R+d*z+m*j,r[9]=u*C+h*P+d*U+m*J,r[13]=u*S+h*N+d*B+m*nt,r[2]=_*E+g*v+p*F+f*V,r[6]=_*b+g*R+p*z+f*j,r[10]=_*C+g*P+p*U+f*J,r[14]=_*S+g*N+p*B+f*nt,r[3]=y*E+x*v+T*F+w*V,r[7]=y*b+x*R+T*z+w*j,r[11]=y*C+x*P+T*U+w*J,r[15]=y*S+x*N+T*B+w*nt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],c=t[9],l=t[13],u=t[2],h=t[6],d=t[10],m=t[14],_=t[3],g=t[7],p=t[11],f=t[15];return _*(+r*c*h-s*l*h-r*a*d+n*l*d+s*a*m-n*c*m)+g*(+e*c*m-e*l*d+r*o*d-s*o*m+s*l*u-r*c*u)+p*(+e*l*h-e*a*m-r*o*h+n*o*m+r*a*u-n*l*u)+f*(-s*a*u-e*c*h+e*a*d+s*o*h-n*o*d+n*c*u)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],u=t[8],h=t[9],d=t[10],m=t[11],_=t[12],g=t[13],p=t[14],f=t[15],y=h*p*l-g*d*l+g*c*m-a*p*m-h*c*f+a*d*f,x=_*d*l-u*p*l-_*c*m+o*p*m+u*c*f-o*d*f,T=u*g*l-_*h*l+_*a*m-o*g*m-u*a*f+o*h*f,w=_*h*c-u*g*c-_*a*d+o*g*d+u*a*p-o*h*p,E=e*y+n*x+s*T+r*w;if(E===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const b=1/E;return t[0]=y*b,t[1]=(g*d*r-h*p*r-g*s*m+n*p*m+h*s*f-n*d*f)*b,t[2]=(a*p*r-g*c*r+g*s*l-n*p*l-a*s*f+n*c*f)*b,t[3]=(h*c*r-a*d*r-h*s*l+n*d*l+a*s*m-n*c*m)*b,t[4]=x*b,t[5]=(u*p*r-_*d*r+_*s*m-e*p*m-u*s*f+e*d*f)*b,t[6]=(_*c*r-o*p*r-_*s*l+e*p*l+o*s*f-e*c*f)*b,t[7]=(o*d*r-u*c*r+u*s*l-e*d*l-o*s*m+e*c*m)*b,t[8]=T*b,t[9]=(_*h*r-u*g*r-_*n*m+e*g*m+u*n*f-e*h*f)*b,t[10]=(o*g*r-_*a*r+_*n*l-e*g*l-o*n*f+e*a*f)*b,t[11]=(u*a*r-o*h*r-u*n*l+e*h*l+o*n*m-e*a*m)*b,t[12]=w*b,t[13]=(u*g*s-_*h*s+_*n*d-e*g*d-u*n*p+e*h*p)*b,t[14]=(_*a*s-o*g*s-_*n*c+e*g*c+o*n*p-e*a*p)*b,t[15]=(o*h*s-u*a*s+u*n*c-e*h*c-o*n*d+e*a*d)*b,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,c=t.z,l=r*o,u=r*a;return this.set(l*o+n,l*a-s*c,l*c+s*a,0,l*a+s*c,u*a+n,u*c-s*o,0,l*c-s*a,u*c+s*o,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,o=e._y,a=e._z,c=e._w,l=r+r,u=o+o,h=a+a,d=r*l,m=r*u,_=r*h,g=o*u,p=o*h,f=a*h,y=c*l,x=c*u,T=c*h,w=n.x,E=n.y,b=n.z;return s[0]=(1-(g+f))*w,s[1]=(m+T)*w,s[2]=(_-x)*w,s[3]=0,s[4]=(m-T)*E,s[5]=(1-(d+f))*E,s[6]=(p+y)*E,s[7]=0,s[8]=(_+x)*b,s[9]=(p-y)*b,s[10]=(1-(d+g))*b,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=ps.set(s[0],s[1],s[2]).length();const o=ps.set(s[4],s[5],s[6]).length(),a=ps.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],hn.copy(this);const l=1/r,u=1/o,h=1/a;return hn.elements[0]*=l,hn.elements[1]*=l,hn.elements[2]*=l,hn.elements[4]*=u,hn.elements[5]*=u,hn.elements[6]*=u,hn.elements[8]*=h,hn.elements[9]*=h,hn.elements[10]*=h,e.setFromRotationMatrix(hn),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,s,r,o,a=Kn){const c=this.elements,l=2*r/(e-t),u=2*r/(n-s),h=(e+t)/(e-t),d=(n+s)/(n-s);let m,_;if(a===Kn)m=-(o+r)/(o-r),_=-2*o*r/(o-r);else if(a===va)m=-o/(o-r),_=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=l,c[4]=0,c[8]=h,c[12]=0,c[1]=0,c[5]=u,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=Kn){const c=this.elements,l=1/(e-t),u=1/(n-s),h=1/(o-r),d=(e+t)*l,m=(n+s)*u;let _,g;if(a===Kn)_=(o+r)*h,g=-2*h;else if(a===va)_=r*h,g=-1*h;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-d,c[1]=0,c[5]=2*u,c[9]=0,c[13]=-m,c[2]=0,c[6]=0,c[10]=g,c[14]=-_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const ps=new G,hn=new Me,zx=new G(0,0,0),Gx=new G(1,1,1),ui=new G,ro=new G,Ze=new G,ju=new Me,$u=new Wr;class On{constructor(t=0,e=0,n=0,s=On.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],o=s[4],a=s[8],c=s[1],l=s[5],u=s[9],h=s[2],d=s[6],m=s[10];switch(e){case"XYZ":this._y=Math.asin(We(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,m),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-We(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,m),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(We(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,m),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-We(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,m),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(We(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,l),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(a,m));break;case"XZY":this._z=Math.asin(-We(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-u,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return ju.makeRotationFromQuaternion(t),this.setFromRotationMatrix(ju,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return $u.setFromEuler(this),this.setFromQuaternion($u,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}On.DEFAULT_ORDER="XYZ";class df{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Hx=0;const Zu=new G,ms=new Wr,Wn=new Me,oo=new G,cr=new G,Wx=new G,qx=new Wr,Ku=new G(1,0,0),Ju=new G(0,1,0),Qu=new G(0,0,1),th={type:"added"},Xx={type:"removed"},_s={type:"childadded",child:null},cc={type:"childremoved",child:null};class Ve extends tr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Hx++}),this.uuid=Hr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ve.DEFAULT_UP.clone();const t=new G,e=new On,n=new Wr,s=new G(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Me},normalMatrix:{value:new Bt}}),this.matrix=new Me,this.matrixWorld=new Me,this.matrixAutoUpdate=Ve.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ve.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new df,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return ms.setFromAxisAngle(t,e),this.quaternion.multiply(ms),this}rotateOnWorldAxis(t,e){return ms.setFromAxisAngle(t,e),this.quaternion.premultiply(ms),this}rotateX(t){return this.rotateOnAxis(Ku,t)}rotateY(t){return this.rotateOnAxis(Ju,t)}rotateZ(t){return this.rotateOnAxis(Qu,t)}translateOnAxis(t,e){return Zu.copy(t).applyQuaternion(this.quaternion),this.position.add(Zu.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Ku,t)}translateY(t){return this.translateOnAxis(Ju,t)}translateZ(t){return this.translateOnAxis(Qu,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Wn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?oo.copy(t):oo.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),cr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Wn.lookAt(cr,oo,this.up):Wn.lookAt(oo,cr,this.up),this.quaternion.setFromRotationMatrix(Wn),s&&(Wn.extractRotation(s.matrixWorld),ms.setFromRotationMatrix(Wn),this.quaternion.premultiply(ms.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(th),_s.child=t,this.dispatchEvent(_s),_s.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Xx),cc.child=t,this.dispatchEvent(cc),cc.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Wn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Wn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Wn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(th),_s.child=t,this.dispatchEvent(_s),_s.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(cr,t,Wx),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(cr,qx,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let l=0,u=c.length;l<u;l++){const h=c[l];r(t.shapes,h)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(t.materials,this.material[c]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];s.animations.push(r(t.animations,c))}}if(e){const a=o(t.geometries),c=o(t.materials),l=o(t.textures),u=o(t.images),h=o(t.shapes),d=o(t.skeletons),m=o(t.animations),_=o(t.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),u.length>0&&(n.images=u),h.length>0&&(n.shapes=h),d.length>0&&(n.skeletons=d),m.length>0&&(n.animations=m),_.length>0&&(n.nodes=_)}return n.object=s,n;function o(a){const c=[];for(const l in a){const u=a[l];delete u.metadata,c.push(u)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}Ve.DEFAULT_UP=new G(0,1,0);Ve.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ve.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const dn=new G,qn=new G,lc=new G,Xn=new G,gs=new G,vs=new G,eh=new G,uc=new G,hc=new G,dc=new G;class Dn{constructor(t=new G,e=new G,n=new G){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),dn.subVectors(t,e),s.cross(dn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){dn.subVectors(s,e),qn.subVectors(n,e),lc.subVectors(t,e);const o=dn.dot(dn),a=dn.dot(qn),c=dn.dot(lc),l=qn.dot(qn),u=qn.dot(lc),h=o*l-a*a;if(h===0)return r.set(0,0,0),null;const d=1/h,m=(l*c-a*u)*d,_=(o*u-a*c)*d;return r.set(1-m-_,_,m)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Xn)===null?!1:Xn.x>=0&&Xn.y>=0&&Xn.x+Xn.y<=1}static getInterpolation(t,e,n,s,r,o,a,c){return this.getBarycoord(t,e,n,s,Xn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Xn.x),c.addScaledVector(o,Xn.y),c.addScaledVector(a,Xn.z),c)}static isFrontFacing(t,e,n,s){return dn.subVectors(n,e),qn.subVectors(t,e),dn.cross(qn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return dn.subVectors(this.c,this.b),qn.subVectors(this.a,this.b),dn.cross(qn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Dn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Dn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return Dn.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return Dn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Dn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let o,a;gs.subVectors(s,n),vs.subVectors(r,n),uc.subVectors(t,n);const c=gs.dot(uc),l=vs.dot(uc);if(c<=0&&l<=0)return e.copy(n);hc.subVectors(t,s);const u=gs.dot(hc),h=vs.dot(hc);if(u>=0&&h<=u)return e.copy(s);const d=c*h-u*l;if(d<=0&&c>=0&&u<=0)return o=c/(c-u),e.copy(n).addScaledVector(gs,o);dc.subVectors(t,r);const m=gs.dot(dc),_=vs.dot(dc);if(_>=0&&m<=_)return e.copy(r);const g=m*l-c*_;if(g<=0&&l>=0&&_<=0)return a=l/(l-_),e.copy(n).addScaledVector(vs,a);const p=u*_-m*h;if(p<=0&&h-u>=0&&m-_>=0)return eh.subVectors(r,s),a=(h-u)/(h-u+(m-_)),e.copy(s).addScaledVector(eh,a);const f=1/(p+g+d);return o=g*f,a=d*f,e.copy(n).addScaledVector(gs,o).addScaledVector(vs,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const ff={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},hi={h:0,s:0,l:0},ao={h:0,s:0,l:0};function fc(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Yt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Cn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ee.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=ee.workingColorSpace){return this.r=t,this.g=e,this.b=n,ee.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=ee.workingColorSpace){if(t=Px(t,1),e=We(e,0,1),n=We(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=fc(o,r,t+1/3),this.g=fc(o,r,t),this.b=fc(o,r,t-1/3)}return ee.toWorkingColorSpace(this,s),this}setStyle(t,e=Cn){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Cn){const n=ff[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Is(t.r),this.g=Is(t.g),this.b=Is(t.b),this}copyLinearToSRGB(t){return this.r=tc(t.r),this.g=tc(t.g),this.b=tc(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Cn){return ee.fromWorkingColorSpace(Le.copy(this),t),Math.round(We(Le.r*255,0,255))*65536+Math.round(We(Le.g*255,0,255))*256+Math.round(We(Le.b*255,0,255))}getHexString(t=Cn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ee.workingColorSpace){ee.fromWorkingColorSpace(Le.copy(this),e);const n=Le.r,s=Le.g,r=Le.b,o=Math.max(n,s,r),a=Math.min(n,s,r);let c,l;const u=(a+o)/2;if(a===o)c=0,l=0;else{const h=o-a;switch(l=u<=.5?h/(o+a):h/(2-o-a),o){case n:c=(s-r)/h+(s<r?6:0);break;case s:c=(r-n)/h+2;break;case r:c=(n-s)/h+4;break}c/=6}return t.h=c,t.s=l,t.l=u,t}getRGB(t,e=ee.workingColorSpace){return ee.fromWorkingColorSpace(Le.copy(this),e),t.r=Le.r,t.g=Le.g,t.b=Le.b,t}getStyle(t=Cn){ee.fromWorkingColorSpace(Le.copy(this),t);const e=Le.r,n=Le.g,s=Le.b;return t!==Cn?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(hi),this.setHSL(hi.h+t,hi.s+e,hi.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(hi),t.getHSL(ao);const n=Ja(hi.h,ao.h,e),s=Ja(hi.s,ao.s,e),r=Ja(hi.l,ao.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Le=new Yt;Yt.NAMES=ff;let Yx=0;class er extends tr{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Yx++}),this.uuid=Hr(),this.name="",this.type="Material",this.blending=Ds,this.side=Si,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Nc,this.blendDst=Lc,this.blendEquation=Ui,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Yt(0,0,0),this.blendAlpha=0,this.depthFunc=pa,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=zu,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ls,this.stencilZFail=ls,this.stencilZPass=ls,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ds&&(n.blending=this.blending),this.side!==Si&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Nc&&(n.blendSrc=this.blendSrc),this.blendDst!==Lc&&(n.blendDst=this.blendDst),this.blendEquation!==Ui&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==pa&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==zu&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ls&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ls&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ls&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const o=[];for(const a in r){const c=r[a];delete c.metadata,o.push(c)}return o}if(e){const r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class pf extends er{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Yt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new On,this.combine=Yd,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Se=new G,co=new Gt;class Pn{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Gu,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=Zn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return fr("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)co.fromBufferAttribute(this,e),co.applyMatrix3(t),this.setXY(e,co.x,co.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Se.fromBufferAttribute(this,e),Se.applyMatrix3(t),this.setXYZ(e,Se.x,Se.y,Se.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Se.fromBufferAttribute(this,e),Se.applyMatrix4(t),this.setXYZ(e,Se.x,Se.y,Se.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Se.fromBufferAttribute(this,e),Se.applyNormalMatrix(t),this.setXYZ(e,Se.x,Se.y,Se.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Se.fromBufferAttribute(this,e),Se.transformDirection(t),this.setXYZ(e,Se.x,Se.y,Se.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=sr(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Ge(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=sr(e,this.array)),e}setX(t,e){return this.normalized&&(e=Ge(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=sr(e,this.array)),e}setY(t,e){return this.normalized&&(e=Ge(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=sr(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Ge(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=sr(e,this.array)),e}setW(t,e){return this.normalized&&(e=Ge(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Ge(e,this.array),n=Ge(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=Ge(e,this.array),n=Ge(n,this.array),s=Ge(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=Ge(e,this.array),n=Ge(n,this.array),s=Ge(s,this.array),r=Ge(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Gu&&(t.usage=this.usage),t}}class mf extends Pn{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class _f extends Pn{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class cn extends Pn{constructor(t,e,n){super(new Float32Array(t),e,n)}}let jx=0;const en=new Me,pc=new Ve,xs=new G,Ke=new qr,lr=new qr,we=new G;class Bn extends tr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:jx++}),this.uuid=Hr(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(cf(t)?_f:mf)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Bt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return en.makeRotationFromQuaternion(t),this.applyMatrix4(en),this}rotateX(t){return en.makeRotationX(t),this.applyMatrix4(en),this}rotateY(t){return en.makeRotationY(t),this.applyMatrix4(en),this}rotateZ(t){return en.makeRotationZ(t),this.applyMatrix4(en),this}translate(t,e,n){return en.makeTranslation(t,e,n),this.applyMatrix4(en),this}scale(t,e,n){return en.makeScale(t,e,n),this.applyMatrix4(en),this}lookAt(t){return pc.lookAt(t),pc.updateMatrix(),this.applyMatrix4(pc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(xs).negate(),this.translate(xs.x,xs.y,xs.z),this}setFromPoints(t){const e=[];for(let n=0,s=t.length;n<s;n++){const r=t[n];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new cn(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new qr);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new G(-1/0,-1/0,-1/0),new G(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];Ke.setFromBufferAttribute(r),this.morphTargetsRelative?(we.addVectors(this.boundingBox.min,Ke.min),this.boundingBox.expandByPoint(we),we.addVectors(this.boundingBox.max,Ke.max),this.boundingBox.expandByPoint(we)):(this.boundingBox.expandByPoint(Ke.min),this.boundingBox.expandByPoint(Ke.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ka);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new G,1/0);return}if(t){const n=this.boundingSphere.center;if(Ke.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){const a=e[r];lr.setFromBufferAttribute(a),this.morphTargetsRelative?(we.addVectors(Ke.min,lr.min),Ke.expandByPoint(we),we.addVectors(Ke.max,lr.max),Ke.expandByPoint(we)):(Ke.expandByPoint(lr.min),Ke.expandByPoint(lr.max))}Ke.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)we.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(we));if(e)for(let r=0,o=e.length;r<o;r++){const a=e[r],c=this.morphTargetsRelative;for(let l=0,u=a.count;l<u;l++)we.fromBufferAttribute(a,l),c&&(xs.fromBufferAttribute(t,l),we.add(xs)),s=Math.max(s,n.distanceToSquared(we))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Pn(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],c=[];for(let C=0;C<n.count;C++)a[C]=new G,c[C]=new G;const l=new G,u=new G,h=new G,d=new Gt,m=new Gt,_=new Gt,g=new G,p=new G;function f(C,S,v){l.fromBufferAttribute(n,C),u.fromBufferAttribute(n,S),h.fromBufferAttribute(n,v),d.fromBufferAttribute(r,C),m.fromBufferAttribute(r,S),_.fromBufferAttribute(r,v),u.sub(l),h.sub(l),m.sub(d),_.sub(d);const R=1/(m.x*_.y-_.x*m.y);isFinite(R)&&(g.copy(u).multiplyScalar(_.y).addScaledVector(h,-m.y).multiplyScalar(R),p.copy(h).multiplyScalar(m.x).addScaledVector(u,-_.x).multiplyScalar(R),a[C].add(g),a[S].add(g),a[v].add(g),c[C].add(p),c[S].add(p),c[v].add(p))}let y=this.groups;y.length===0&&(y=[{start:0,count:t.count}]);for(let C=0,S=y.length;C<S;++C){const v=y[C],R=v.start,P=v.count;for(let N=R,F=R+P;N<F;N+=3)f(t.getX(N+0),t.getX(N+1),t.getX(N+2))}const x=new G,T=new G,w=new G,E=new G;function b(C){w.fromBufferAttribute(s,C),E.copy(w);const S=a[C];x.copy(S),x.sub(w.multiplyScalar(w.dot(S))).normalize(),T.crossVectors(E,S);const R=T.dot(c[C])<0?-1:1;o.setXYZW(C,x.x,x.y,x.z,R)}for(let C=0,S=y.length;C<S;++C){const v=y[C],R=v.start,P=v.count;for(let N=R,F=R+P;N<F;N+=3)b(t.getX(N+0)),b(t.getX(N+1)),b(t.getX(N+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Pn(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,m=n.count;d<m;d++)n.setXYZ(d,0,0,0);const s=new G,r=new G,o=new G,a=new G,c=new G,l=new G,u=new G,h=new G;if(t)for(let d=0,m=t.count;d<m;d+=3){const _=t.getX(d+0),g=t.getX(d+1),p=t.getX(d+2);s.fromBufferAttribute(e,_),r.fromBufferAttribute(e,g),o.fromBufferAttribute(e,p),u.subVectors(o,r),h.subVectors(s,r),u.cross(h),a.fromBufferAttribute(n,_),c.fromBufferAttribute(n,g),l.fromBufferAttribute(n,p),a.add(u),c.add(u),l.add(u),n.setXYZ(_,a.x,a.y,a.z),n.setXYZ(g,c.x,c.y,c.z),n.setXYZ(p,l.x,l.y,l.z)}else for(let d=0,m=e.count;d<m;d+=3)s.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),u.subVectors(o,r),h.subVectors(s,r),u.cross(h),n.setXYZ(d+0,u.x,u.y,u.z),n.setXYZ(d+1,u.x,u.y,u.z),n.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)we.fromBufferAttribute(t,e),we.normalize(),t.setXYZ(e,we.x,we.y,we.z)}toNonIndexed(){function t(a,c){const l=a.array,u=a.itemSize,h=a.normalized,d=new l.constructor(c.length*u);let m=0,_=0;for(let g=0,p=c.length;g<p;g++){a.isInterleavedBufferAttribute?m=c[g]*a.data.stride+a.offset:m=c[g]*u;for(let f=0;f<u;f++)d[_++]=l[m++]}return new Pn(d,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Bn,n=this.index.array,s=this.attributes;for(const a in s){const c=s[a],l=t(c,n);e.setAttribute(a,l)}const r=this.morphAttributes;for(const a in r){const c=[],l=r[a];for(let u=0,h=l.length;u<h;u++){const d=l[u],m=t(d,n);c.push(m)}e.morphAttributes[a]=c}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,c=o.length;a<c;a++){const l=o[a];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],u=[];for(let h=0,d=l.length;h<d;h++){const m=l[h];u.push(m.toJSON(t.data))}u.length>0&&(s[c]=u,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const s=t.attributes;for(const l in s){const u=s[l];this.setAttribute(l,u.clone(e))}const r=t.morphAttributes;for(const l in r){const u=[],h=r[l];for(let d=0,m=h.length;d<m;d++)u.push(h[d].clone(e));this.morphAttributes[l]=u}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let l=0,u=o.length;l<u;l++){const h=o[l];this.addGroup(h.start,h.count,h.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const nh=new Me,Ri=new hf,lo=new ka,ih=new G,ys=new G,Ss=new G,Ms=new G,mc=new G,uo=new G,ho=new Gt,fo=new Gt,po=new Gt,sh=new G,rh=new G,oh=new G,mo=new G,_o=new G;class vn extends Ve{constructor(t=new Bn,e=new pf){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const a=this.morphTargetInfluences;if(r&&a){uo.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const u=a[c],h=r[c];u!==0&&(mc.fromBufferAttribute(h,t),o?uo.addScaledVector(mc,u):uo.addScaledVector(mc.sub(e),u))}e.add(uo)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),lo.copy(n.boundingSphere),lo.applyMatrix4(r),Ri.copy(t.ray).recast(t.near),!(lo.containsPoint(Ri.origin)===!1&&(Ri.intersectSphere(lo,ih)===null||Ri.origin.distanceToSquared(ih)>(t.far-t.near)**2))&&(nh.copy(r).invert(),Ri.copy(t.ray).applyMatrix4(nh),!(n.boundingBox!==null&&Ri.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Ri)))}_computeIntersections(t,e,n){let s;const r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,u=r.attributes.uv1,h=r.attributes.normal,d=r.groups,m=r.drawRange;if(a!==null)if(Array.isArray(o))for(let _=0,g=d.length;_<g;_++){const p=d[_],f=o[p.materialIndex],y=Math.max(p.start,m.start),x=Math.min(a.count,Math.min(p.start+p.count,m.start+m.count));for(let T=y,w=x;T<w;T+=3){const E=a.getX(T),b=a.getX(T+1),C=a.getX(T+2);s=go(this,f,t,n,l,u,h,E,b,C),s&&(s.faceIndex=Math.floor(T/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{const _=Math.max(0,m.start),g=Math.min(a.count,m.start+m.count);for(let p=_,f=g;p<f;p+=3){const y=a.getX(p),x=a.getX(p+1),T=a.getX(p+2);s=go(this,o,t,n,l,u,h,y,x,T),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let _=0,g=d.length;_<g;_++){const p=d[_],f=o[p.materialIndex],y=Math.max(p.start,m.start),x=Math.min(c.count,Math.min(p.start+p.count,m.start+m.count));for(let T=y,w=x;T<w;T+=3){const E=T,b=T+1,C=T+2;s=go(this,f,t,n,l,u,h,E,b,C),s&&(s.faceIndex=Math.floor(T/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{const _=Math.max(0,m.start),g=Math.min(c.count,m.start+m.count);for(let p=_,f=g;p<f;p+=3){const y=p,x=p+1,T=p+2;s=go(this,o,t,n,l,u,h,y,x,T),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}}}function $x(i,t,e,n,s,r,o,a){let c;if(t.side===qe?c=n.intersectTriangle(o,r,s,!0,a):c=n.intersectTriangle(s,r,o,t.side===Si,a),c===null)return null;_o.copy(a),_o.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(_o);return l<e.near||l>e.far?null:{distance:l,point:_o.clone(),object:i}}function go(i,t,e,n,s,r,o,a,c,l){i.getVertexPosition(a,ys),i.getVertexPosition(c,Ss),i.getVertexPosition(l,Ms);const u=$x(i,t,e,n,ys,Ss,Ms,mo);if(u){s&&(ho.fromBufferAttribute(s,a),fo.fromBufferAttribute(s,c),po.fromBufferAttribute(s,l),u.uv=Dn.getInterpolation(mo,ys,Ss,Ms,ho,fo,po,new Gt)),r&&(ho.fromBufferAttribute(r,a),fo.fromBufferAttribute(r,c),po.fromBufferAttribute(r,l),u.uv1=Dn.getInterpolation(mo,ys,Ss,Ms,ho,fo,po,new Gt)),o&&(sh.fromBufferAttribute(o,a),rh.fromBufferAttribute(o,c),oh.fromBufferAttribute(o,l),u.normal=Dn.getInterpolation(mo,ys,Ss,Ms,sh,rh,oh,new G),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const h={a,b:c,c:l,normal:new G,materialIndex:0};Dn.getNormal(ys,Ss,Ms,h.normal),u.face=h}return u}class Xr extends Bn{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const c=[],l=[],u=[],h=[];let d=0,m=0;_("z","y","x",-1,-1,n,e,t,o,r,0),_("z","y","x",1,-1,n,e,-t,o,r,1),_("x","z","y",1,1,t,n,e,s,o,2),_("x","z","y",1,-1,t,n,-e,s,o,3),_("x","y","z",1,-1,t,e,n,s,r,4),_("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new cn(l,3)),this.setAttribute("normal",new cn(u,3)),this.setAttribute("uv",new cn(h,2));function _(g,p,f,y,x,T,w,E,b,C,S){const v=T/b,R=w/C,P=T/2,N=w/2,F=E/2,z=b+1,U=C+1;let B=0,V=0;const j=new G;for(let J=0;J<U;J++){const nt=J*R-N;for(let xt=0;xt<z;xt++){const Ot=xt*v-P;j[g]=Ot*y,j[p]=nt*x,j[f]=F,l.push(j.x,j.y,j.z),j[g]=0,j[p]=0,j[f]=E>0?1:-1,u.push(j.x,j.y,j.z),h.push(xt/b),h.push(1-J/C),B+=1}}for(let J=0;J<C;J++)for(let nt=0;nt<b;nt++){const xt=d+nt+z*J,Ot=d+nt+z*(J+1),X=d+(nt+1)+z*(J+1),Y=d+(nt+1)+z*J;c.push(xt,Ot,Y),c.push(Ot,X,Y),V+=6}a.addGroup(m,V,S),m+=V,d+=B}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Xr(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function js(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Fe(i){const t={};for(let e=0;e<i.length;e++){const n=js(i[e]);for(const s in n)t[s]=n[s]}return t}function Zx(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function gf(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:ee.workingColorSpace}const Kx={clone:js,merge:Fe};var Jx=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Qx=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Mi extends er{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Jx,this.fragmentShader=Qx,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=js(t.uniforms),this.uniformsGroups=Zx(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class vf extends Ve{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Me,this.projectionMatrix=new Me,this.projectionMatrixInverse=new Me,this.coordinateSystem=Kn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const di=new G,ah=new Gt,ch=new Gt;class sn extends vf{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=hl*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Ka*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return hl*2*Math.atan(Math.tan(Ka*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){di.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(di.x,di.y).multiplyScalar(-t/di.z),di.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(di.x,di.y).multiplyScalar(-t/di.z)}getViewSize(t,e){return this.getViewBounds(t,ah,ch),e.subVectors(ch,ah)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Ka*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*s/c,e-=o.offsetY*n/l,s*=o.width/c,n*=o.height/l}const a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Ts=-90,Es=1;class ty extends Ve{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new sn(Ts,Es,t,e);s.layers=this.layers,this.add(s);const r=new sn(Ts,Es,t,e);r.layers=this.layers,this.add(r);const o=new sn(Ts,Es,t,e);o.layers=this.layers,this.add(o);const a=new sn(Ts,Es,t,e);a.layers=this.layers,this.add(a);const c=new sn(Ts,Es,t,e);c.layers=this.layers,this.add(c);const l=new sn(Ts,Es,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,c]=e;for(const l of e)this.remove(l);if(t===Kn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===va)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,c,l,u]=this.children,h=t.getRenderTarget(),d=t.getActiveCubeFace(),m=t.getActiveMipmapLevel(),_=t.xr.enabled;t.xr.enabled=!1;const g=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,o),t.setRenderTarget(n,2,s),t.render(e,a),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,l),n.texture.generateMipmaps=g,t.setRenderTarget(n,5,s),t.render(e,u),t.setRenderTarget(h,d,m),t.xr.enabled=_,n.texture.needsPMREMUpdate=!0}}class xf extends Xe{constructor(t,e,n,s,r,o,a,c,l,u){t=t!==void 0?t:[],e=e!==void 0?e:Ws,super(t,e,n,s,r,o,a,c,l,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class ey extends ns{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new xf(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:pn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Xr(5,5,5),r=new Mi({name:"CubemapFromEquirect",uniforms:js(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:qe,blending:_i});r.uniforms.tEquirect.value=e;const o=new vn(s,r),a=e.minFilter;return e.minFilter===zi&&(e.minFilter=pn),new ty(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,s){const r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}}const _c=new G,ny=new G,iy=new Bt;class Ni{constructor(t=new G(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=_c.subVectors(n,e).cross(ny.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(_c),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||iy.getNormalMatrix(t),s=this.coplanarPoint(_c).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Di=new ka,vo=new G;class yf{constructor(t=new Ni,e=new Ni,n=new Ni,s=new Ni,r=new Ni,o=new Ni){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Kn){const n=this.planes,s=t.elements,r=s[0],o=s[1],a=s[2],c=s[3],l=s[4],u=s[5],h=s[6],d=s[7],m=s[8],_=s[9],g=s[10],p=s[11],f=s[12],y=s[13],x=s[14],T=s[15];if(n[0].setComponents(c-r,d-l,p-m,T-f).normalize(),n[1].setComponents(c+r,d+l,p+m,T+f).normalize(),n[2].setComponents(c+o,d+u,p+_,T+y).normalize(),n[3].setComponents(c-o,d-u,p-_,T-y).normalize(),n[4].setComponents(c-a,d-h,p-g,T-x).normalize(),e===Kn)n[5].setComponents(c+a,d+h,p+g,T+x).normalize();else if(e===va)n[5].setComponents(a,h,g,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Di.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Di.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Di)}intersectsSprite(t){return Di.center.set(0,0,0),Di.radius=.7071067811865476,Di.applyMatrix4(t.matrixWorld),this.intersectsSphere(Di)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(vo.x=s.normal.x>0?t.max.x:t.min.x,vo.y=s.normal.y>0?t.max.y:t.min.y,vo.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(vo)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Sf(){let i=null,t=!1,e=null,n=null;function s(r,o){e(r,o),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function sy(i){const t=new WeakMap;function e(a,c){const l=a.array,u=a.usage,h=l.byteLength,d=i.createBuffer();i.bindBuffer(c,d),i.bufferData(c,l,u),a.onUploadCallback();let m;if(l instanceof Float32Array)m=i.FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?m=i.HALF_FLOAT:m=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)m=i.SHORT;else if(l instanceof Uint32Array)m=i.UNSIGNED_INT;else if(l instanceof Int32Array)m=i.INT;else if(l instanceof Int8Array)m=i.BYTE;else if(l instanceof Uint8Array)m=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)m=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:m,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:h}}function n(a,c,l){const u=c.array,h=c._updateRange,d=c.updateRanges;if(i.bindBuffer(l,a),h.count===-1&&d.length===0&&i.bufferSubData(l,0,u),d.length!==0){for(let m=0,_=d.length;m<_;m++){const g=d[m];i.bufferSubData(l,g.start*u.BYTES_PER_ELEMENT,u,g.start,g.count)}c.clearUpdateRanges()}h.count!==-1&&(i.bufferSubData(l,h.offset*u.BYTES_PER_ELEMENT,u,h.offset,h.count),h.count=-1),c.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const c=t.get(a);c&&(i.deleteBuffer(c.buffer),t.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const u=t.get(a);(!u||u.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const l=t.get(a);if(l===void 0)t.set(a,e(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,a,c),l.version=a.version}}return{get:s,remove:r,update:o}}class Ba extends Bn{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,o=e/2,a=Math.floor(n),c=Math.floor(s),l=a+1,u=c+1,h=t/a,d=e/c,m=[],_=[],g=[],p=[];for(let f=0;f<u;f++){const y=f*d-o;for(let x=0;x<l;x++){const T=x*h-r;_.push(T,-y,0),g.push(0,0,1),p.push(x/a),p.push(1-f/c)}}for(let f=0;f<c;f++)for(let y=0;y<a;y++){const x=y+l*f,T=y+l*(f+1),w=y+1+l*(f+1),E=y+1+l*f;m.push(x,T,E),m.push(T,w,E)}this.setIndex(m),this.setAttribute("position",new cn(_,3)),this.setAttribute("normal",new cn(g,3)),this.setAttribute("uv",new cn(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ba(t.width,t.height,t.widthSegments,t.heightSegments)}}var ry=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,oy=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,ay=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,cy=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,ly=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,uy=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,hy=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,dy=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,fy=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,py=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,my=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,_y=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,gy=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,vy=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,xy=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,yy=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Sy=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,My=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Ty=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Ey=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,by=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,wy=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Ay=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,Cy=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Ry=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Dy=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Py=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Iy=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Ny=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Ly=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Oy="gl_FragColor = linearToOutputTexel( gl_FragColor );",Uy=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Fy=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,ky=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,By=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Vy=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,zy=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Gy=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Hy=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Wy=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,qy=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Xy=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Yy=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,jy=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,$y=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Zy=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Ky=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Jy=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Qy=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,tS=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,eS=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,nS=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,iS=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,sS=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,rS=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,oS=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,aS=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,cS=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,lS=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,uS=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,hS=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,dS=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,fS=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,pS=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,mS=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,_S=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,gS=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,vS=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,xS=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,yS=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,SS=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,MS=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,TS=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,ES=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,bS=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,wS=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,AS=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,CS=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,RS=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,DS=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,PS=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,IS=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,NS=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,LS=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,OS=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,US=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,FS=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,kS=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,BS=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,VS=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,zS=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,GS=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,HS=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,WS=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,qS=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,XS=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,YS=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,jS=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,$S=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,ZS=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,KS=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,JS=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,QS=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,tM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,eM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,nM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,iM=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const sM=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,rM=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,oM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,aM=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,lM=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,uM=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,hM=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,dM=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,fM=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,pM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,mM=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,_M=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,gM=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,vM=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,xM=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,yM=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,SM=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,MM=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,TM=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,EM=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,bM=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,wM=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,AM=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,CM=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,RM=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,DM=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,PM=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,IM=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,NM=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,LM=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,OM=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,UM=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,FM=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,kt={alphahash_fragment:ry,alphahash_pars_fragment:oy,alphamap_fragment:ay,alphamap_pars_fragment:cy,alphatest_fragment:ly,alphatest_pars_fragment:uy,aomap_fragment:hy,aomap_pars_fragment:dy,batching_pars_vertex:fy,batching_vertex:py,begin_vertex:my,beginnormal_vertex:_y,bsdfs:gy,iridescence_fragment:vy,bumpmap_pars_fragment:xy,clipping_planes_fragment:yy,clipping_planes_pars_fragment:Sy,clipping_planes_pars_vertex:My,clipping_planes_vertex:Ty,color_fragment:Ey,color_pars_fragment:by,color_pars_vertex:wy,color_vertex:Ay,common:Cy,cube_uv_reflection_fragment:Ry,defaultnormal_vertex:Dy,displacementmap_pars_vertex:Py,displacementmap_vertex:Iy,emissivemap_fragment:Ny,emissivemap_pars_fragment:Ly,colorspace_fragment:Oy,colorspace_pars_fragment:Uy,envmap_fragment:Fy,envmap_common_pars_fragment:ky,envmap_pars_fragment:By,envmap_pars_vertex:Vy,envmap_physical_pars_fragment:Ky,envmap_vertex:zy,fog_vertex:Gy,fog_pars_vertex:Hy,fog_fragment:Wy,fog_pars_fragment:qy,gradientmap_pars_fragment:Xy,lightmap_pars_fragment:Yy,lights_lambert_fragment:jy,lights_lambert_pars_fragment:$y,lights_pars_begin:Zy,lights_toon_fragment:Jy,lights_toon_pars_fragment:Qy,lights_phong_fragment:tS,lights_phong_pars_fragment:eS,lights_physical_fragment:nS,lights_physical_pars_fragment:iS,lights_fragment_begin:sS,lights_fragment_maps:rS,lights_fragment_end:oS,logdepthbuf_fragment:aS,logdepthbuf_pars_fragment:cS,logdepthbuf_pars_vertex:lS,logdepthbuf_vertex:uS,map_fragment:hS,map_pars_fragment:dS,map_particle_fragment:fS,map_particle_pars_fragment:pS,metalnessmap_fragment:mS,metalnessmap_pars_fragment:_S,morphinstance_vertex:gS,morphcolor_vertex:vS,morphnormal_vertex:xS,morphtarget_pars_vertex:yS,morphtarget_vertex:SS,normal_fragment_begin:MS,normal_fragment_maps:TS,normal_pars_fragment:ES,normal_pars_vertex:bS,normal_vertex:wS,normalmap_pars_fragment:AS,clearcoat_normal_fragment_begin:CS,clearcoat_normal_fragment_maps:RS,clearcoat_pars_fragment:DS,iridescence_pars_fragment:PS,opaque_fragment:IS,packing:NS,premultiplied_alpha_fragment:LS,project_vertex:OS,dithering_fragment:US,dithering_pars_fragment:FS,roughnessmap_fragment:kS,roughnessmap_pars_fragment:BS,shadowmap_pars_fragment:VS,shadowmap_pars_vertex:zS,shadowmap_vertex:GS,shadowmask_pars_fragment:HS,skinbase_vertex:WS,skinning_pars_vertex:qS,skinning_vertex:XS,skinnormal_vertex:YS,specularmap_fragment:jS,specularmap_pars_fragment:$S,tonemapping_fragment:ZS,tonemapping_pars_fragment:KS,transmission_fragment:JS,transmission_pars_fragment:QS,uv_pars_fragment:tM,uv_pars_vertex:eM,uv_vertex:nM,worldpos_vertex:iM,background_vert:sM,background_frag:rM,backgroundCube_vert:oM,backgroundCube_frag:aM,cube_vert:cM,cube_frag:lM,depth_vert:uM,depth_frag:hM,distanceRGBA_vert:dM,distanceRGBA_frag:fM,equirect_vert:pM,equirect_frag:mM,linedashed_vert:_M,linedashed_frag:gM,meshbasic_vert:vM,meshbasic_frag:xM,meshlambert_vert:yM,meshlambert_frag:SM,meshmatcap_vert:MM,meshmatcap_frag:TM,meshnormal_vert:EM,meshnormal_frag:bM,meshphong_vert:wM,meshphong_frag:AM,meshphysical_vert:CM,meshphysical_frag:RM,meshtoon_vert:DM,meshtoon_frag:PM,points_vert:IM,points_frag:NM,shadow_vert:LM,shadow_frag:OM,sprite_vert:UM,sprite_frag:FM},dt={common:{diffuse:{value:new Yt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Bt},alphaMap:{value:null},alphaMapTransform:{value:new Bt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Bt}},envmap:{envMap:{value:null},envMapRotation:{value:new Bt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Bt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Bt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Bt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Bt},normalScale:{value:new Gt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Bt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Bt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Bt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Bt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Yt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Yt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Bt},alphaTest:{value:0},uvTransform:{value:new Bt}},sprite:{diffuse:{value:new Yt(16777215)},opacity:{value:1},center:{value:new Gt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Bt},alphaMap:{value:null},alphaMapTransform:{value:new Bt},alphaTest:{value:0}}},Rn={basic:{uniforms:Fe([dt.common,dt.specularmap,dt.envmap,dt.aomap,dt.lightmap,dt.fog]),vertexShader:kt.meshbasic_vert,fragmentShader:kt.meshbasic_frag},lambert:{uniforms:Fe([dt.common,dt.specularmap,dt.envmap,dt.aomap,dt.lightmap,dt.emissivemap,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.fog,dt.lights,{emissive:{value:new Yt(0)}}]),vertexShader:kt.meshlambert_vert,fragmentShader:kt.meshlambert_frag},phong:{uniforms:Fe([dt.common,dt.specularmap,dt.envmap,dt.aomap,dt.lightmap,dt.emissivemap,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.fog,dt.lights,{emissive:{value:new Yt(0)},specular:{value:new Yt(1118481)},shininess:{value:30}}]),vertexShader:kt.meshphong_vert,fragmentShader:kt.meshphong_frag},standard:{uniforms:Fe([dt.common,dt.envmap,dt.aomap,dt.lightmap,dt.emissivemap,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.roughnessmap,dt.metalnessmap,dt.fog,dt.lights,{emissive:{value:new Yt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:kt.meshphysical_vert,fragmentShader:kt.meshphysical_frag},toon:{uniforms:Fe([dt.common,dt.aomap,dt.lightmap,dt.emissivemap,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.gradientmap,dt.fog,dt.lights,{emissive:{value:new Yt(0)}}]),vertexShader:kt.meshtoon_vert,fragmentShader:kt.meshtoon_frag},matcap:{uniforms:Fe([dt.common,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.fog,{matcap:{value:null}}]),vertexShader:kt.meshmatcap_vert,fragmentShader:kt.meshmatcap_frag},points:{uniforms:Fe([dt.points,dt.fog]),vertexShader:kt.points_vert,fragmentShader:kt.points_frag},dashed:{uniforms:Fe([dt.common,dt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:kt.linedashed_vert,fragmentShader:kt.linedashed_frag},depth:{uniforms:Fe([dt.common,dt.displacementmap]),vertexShader:kt.depth_vert,fragmentShader:kt.depth_frag},normal:{uniforms:Fe([dt.common,dt.bumpmap,dt.normalmap,dt.displacementmap,{opacity:{value:1}}]),vertexShader:kt.meshnormal_vert,fragmentShader:kt.meshnormal_frag},sprite:{uniforms:Fe([dt.sprite,dt.fog]),vertexShader:kt.sprite_vert,fragmentShader:kt.sprite_frag},background:{uniforms:{uvTransform:{value:new Bt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:kt.background_vert,fragmentShader:kt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Bt}},vertexShader:kt.backgroundCube_vert,fragmentShader:kt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:kt.cube_vert,fragmentShader:kt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:kt.equirect_vert,fragmentShader:kt.equirect_frag},distanceRGBA:{uniforms:Fe([dt.common,dt.displacementmap,{referencePosition:{value:new G},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:kt.distanceRGBA_vert,fragmentShader:kt.distanceRGBA_frag},shadow:{uniforms:Fe([dt.lights,dt.fog,{color:{value:new Yt(0)},opacity:{value:1}}]),vertexShader:kt.shadow_vert,fragmentShader:kt.shadow_frag}};Rn.physical={uniforms:Fe([Rn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Bt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Bt},clearcoatNormalScale:{value:new Gt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Bt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Bt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Bt},sheen:{value:0},sheenColor:{value:new Yt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Bt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Bt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Bt},transmissionSamplerSize:{value:new Gt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Bt},attenuationDistance:{value:0},attenuationColor:{value:new Yt(0)},specularColor:{value:new Yt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Bt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Bt},anisotropyVector:{value:new Gt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Bt}}]),vertexShader:kt.meshphysical_vert,fragmentShader:kt.meshphysical_frag};const xo={r:0,b:0,g:0},Pi=new On,kM=new Me;function BM(i,t,e,n,s,r,o){const a=new Yt(0);let c=r===!0?0:1,l,u,h=null,d=0,m=null;function _(y){let x=y.isScene===!0?y.background:null;return x&&x.isTexture&&(x=(y.backgroundBlurriness>0?e:t).get(x)),x}function g(y){let x=!1;const T=_(y);T===null?f(a,c):T&&T.isColor&&(f(T,1),x=!0);const w=i.xr.getEnvironmentBlendMode();w==="additive"?n.buffers.color.setClear(0,0,0,1,o):w==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||x)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function p(y,x){const T=_(x);T&&(T.isCubeTexture||T.mapping===Ua)?(u===void 0&&(u=new vn(new Xr(1,1,1),new Mi({name:"BackgroundCubeMaterial",uniforms:js(Rn.backgroundCube.uniforms),vertexShader:Rn.backgroundCube.vertexShader,fragmentShader:Rn.backgroundCube.fragmentShader,side:qe,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(w,E,b){this.matrixWorld.copyPosition(b.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(u)),Pi.copy(x.backgroundRotation),Pi.x*=-1,Pi.y*=-1,Pi.z*=-1,T.isCubeTexture&&T.isRenderTargetTexture===!1&&(Pi.y*=-1,Pi.z*=-1),u.material.uniforms.envMap.value=T,u.material.uniforms.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(kM.makeRotationFromEuler(Pi)),u.material.toneMapped=ee.getTransfer(T.colorSpace)!==ae,(h!==T||d!==T.version||m!==i.toneMapping)&&(u.material.needsUpdate=!0,h=T,d=T.version,m=i.toneMapping),u.layers.enableAll(),y.unshift(u,u.geometry,u.material,0,0,null)):T&&T.isTexture&&(l===void 0&&(l=new vn(new Ba(2,2),new Mi({name:"BackgroundMaterial",uniforms:js(Rn.background.uniforms),vertexShader:Rn.background.vertexShader,fragmentShader:Rn.background.fragmentShader,side:Si,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=T,l.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,l.material.toneMapped=ee.getTransfer(T.colorSpace)!==ae,T.matrixAutoUpdate===!0&&T.updateMatrix(),l.material.uniforms.uvTransform.value.copy(T.matrix),(h!==T||d!==T.version||m!==i.toneMapping)&&(l.material.needsUpdate=!0,h=T,d=T.version,m=i.toneMapping),l.layers.enableAll(),y.unshift(l,l.geometry,l.material,0,0,null))}function f(y,x){y.getRGB(xo,gf(i)),n.buffers.color.setClear(xo.r,xo.g,xo.b,x,o)}return{getClearColor:function(){return a},setClearColor:function(y,x=1){a.set(y),c=x,f(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(y){c=y,f(a,c)},render:g,addToRenderList:p}}function VM(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null);let r=s,o=!1;function a(v,R,P,N,F){let z=!1;const U=h(N,P,R);r!==U&&(r=U,l(r.object)),z=m(v,N,P,F),z&&_(v,N,P,F),F!==null&&t.update(F,i.ELEMENT_ARRAY_BUFFER),(z||o)&&(o=!1,T(v,R,P,N),F!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(F).buffer))}function c(){return i.createVertexArray()}function l(v){return i.bindVertexArray(v)}function u(v){return i.deleteVertexArray(v)}function h(v,R,P){const N=P.wireframe===!0;let F=n[v.id];F===void 0&&(F={},n[v.id]=F);let z=F[R.id];z===void 0&&(z={},F[R.id]=z);let U=z[N];return U===void 0&&(U=d(c()),z[N]=U),U}function d(v){const R=[],P=[],N=[];for(let F=0;F<e;F++)R[F]=0,P[F]=0,N[F]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:R,enabledAttributes:P,attributeDivisors:N,object:v,attributes:{},index:null}}function m(v,R,P,N){const F=r.attributes,z=R.attributes;let U=0;const B=P.getAttributes();for(const V in B)if(B[V].location>=0){const J=F[V];let nt=z[V];if(nt===void 0&&(V==="instanceMatrix"&&v.instanceMatrix&&(nt=v.instanceMatrix),V==="instanceColor"&&v.instanceColor&&(nt=v.instanceColor)),J===void 0||J.attribute!==nt||nt&&J.data!==nt.data)return!0;U++}return r.attributesNum!==U||r.index!==N}function _(v,R,P,N){const F={},z=R.attributes;let U=0;const B=P.getAttributes();for(const V in B)if(B[V].location>=0){let J=z[V];J===void 0&&(V==="instanceMatrix"&&v.instanceMatrix&&(J=v.instanceMatrix),V==="instanceColor"&&v.instanceColor&&(J=v.instanceColor));const nt={};nt.attribute=J,J&&J.data&&(nt.data=J.data),F[V]=nt,U++}r.attributes=F,r.attributesNum=U,r.index=N}function g(){const v=r.newAttributes;for(let R=0,P=v.length;R<P;R++)v[R]=0}function p(v){f(v,0)}function f(v,R){const P=r.newAttributes,N=r.enabledAttributes,F=r.attributeDivisors;P[v]=1,N[v]===0&&(i.enableVertexAttribArray(v),N[v]=1),F[v]!==R&&(i.vertexAttribDivisor(v,R),F[v]=R)}function y(){const v=r.newAttributes,R=r.enabledAttributes;for(let P=0,N=R.length;P<N;P++)R[P]!==v[P]&&(i.disableVertexAttribArray(P),R[P]=0)}function x(v,R,P,N,F,z,U){U===!0?i.vertexAttribIPointer(v,R,P,F,z):i.vertexAttribPointer(v,R,P,N,F,z)}function T(v,R,P,N){g();const F=N.attributes,z=P.getAttributes(),U=R.defaultAttributeValues;for(const B in z){const V=z[B];if(V.location>=0){let j=F[B];if(j===void 0&&(B==="instanceMatrix"&&v.instanceMatrix&&(j=v.instanceMatrix),B==="instanceColor"&&v.instanceColor&&(j=v.instanceColor)),j!==void 0){const J=j.normalized,nt=j.itemSize,xt=t.get(j);if(xt===void 0)continue;const Ot=xt.buffer,X=xt.type,Y=xt.bytesPerElement,ot=X===i.INT||X===i.UNSIGNED_INT||j.gpuType===Gl;if(j.isInterleavedBufferAttribute){const ut=j.data,st=ut.stride,Ct=j.offset;if(ut.isInstancedInterleavedBuffer){for(let Nt=0;Nt<V.locationSize;Nt++)f(V.location+Nt,ut.meshPerAttribute);v.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=ut.meshPerAttribute*ut.count)}else for(let Nt=0;Nt<V.locationSize;Nt++)p(V.location+Nt);i.bindBuffer(i.ARRAY_BUFFER,Ot);for(let Nt=0;Nt<V.locationSize;Nt++)x(V.location+Nt,nt/V.locationSize,X,J,st*Y,(Ct+nt/V.locationSize*Nt)*Y,ot)}else{if(j.isInstancedBufferAttribute){for(let ut=0;ut<V.locationSize;ut++)f(V.location+ut,j.meshPerAttribute);v.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=j.meshPerAttribute*j.count)}else for(let ut=0;ut<V.locationSize;ut++)p(V.location+ut);i.bindBuffer(i.ARRAY_BUFFER,Ot);for(let ut=0;ut<V.locationSize;ut++)x(V.location+ut,nt/V.locationSize,X,J,nt*Y,nt/V.locationSize*ut*Y,ot)}}else if(U!==void 0){const J=U[B];if(J!==void 0)switch(J.length){case 2:i.vertexAttrib2fv(V.location,J);break;case 3:i.vertexAttrib3fv(V.location,J);break;case 4:i.vertexAttrib4fv(V.location,J);break;default:i.vertexAttrib1fv(V.location,J)}}}}y()}function w(){C();for(const v in n){const R=n[v];for(const P in R){const N=R[P];for(const F in N)u(N[F].object),delete N[F];delete R[P]}delete n[v]}}function E(v){if(n[v.id]===void 0)return;const R=n[v.id];for(const P in R){const N=R[P];for(const F in N)u(N[F].object),delete N[F];delete R[P]}delete n[v.id]}function b(v){for(const R in n){const P=n[R];if(P[v.id]===void 0)continue;const N=P[v.id];for(const F in N)u(N[F].object),delete N[F];delete P[v.id]}}function C(){S(),o=!0,r!==s&&(r=s,l(r.object))}function S(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:C,resetDefaultState:S,dispose:w,releaseStatesOfGeometry:E,releaseStatesOfProgram:b,initAttributes:g,enableAttribute:p,disableUnusedAttributes:y}}function zM(i,t,e){let n;function s(l){n=l}function r(l,u){i.drawArrays(n,l,u),e.update(u,n,1)}function o(l,u,h){h!==0&&(i.drawArraysInstanced(n,l,u,h),e.update(u,n,h))}function a(l,u,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,u,0,h);let m=0;for(let _=0;_<h;_++)m+=u[_];e.update(m,n,1)}function c(l,u,h,d){if(h===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let _=0;_<l.length;_++)o(l[_],u[_],d[_]);else{m.multiDrawArraysInstancedWEBGL(n,l,0,u,0,d,0,h);let _=0;for(let g=0;g<h;g++)_+=u[g];for(let g=0;g<d.length;g++)e.update(_,n,d[g])}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function GM(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const E=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(E){return!(E!==gn&&n.convert(E)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(E){const b=E===Gr&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(E!==ti&&n.convert(E)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&E!==Zn&&!b)}function c(E){if(E==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const u=c(l);u!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",u,"instead."),l=u);const h=e.logarithmicDepthBuffer===!0,d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),f=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),y=i.getParameter(i.MAX_VARYING_VECTORS),x=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),T=m>0,w=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:h,maxTextures:d,maxVertexTextures:m,maxTextureSize:_,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:f,maxVaryings:y,maxFragmentUniforms:x,vertexTextures:T,maxSamples:w}}function HM(i){const t=this;let e=null,n=0,s=!1,r=!1;const o=new Ni,a=new Bt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){const m=h.length!==0||d||n!==0||s;return s=d,n=h.length,m},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,d){e=u(h,d,0)},this.setState=function(h,d,m){const _=h.clippingPlanes,g=h.clipIntersection,p=h.clipShadows,f=i.get(h);if(!s||_===null||_.length===0||r&&!p)r?u(null):l();else{const y=r?0:n,x=y*4;let T=f.clippingState||null;c.value=T,T=u(_,d,x,m);for(let w=0;w!==x;++w)T[w]=e[w];f.clippingState=T,this.numIntersection=g?this.numPlanes:0,this.numPlanes+=y}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function u(h,d,m,_){const g=h!==null?h.length:0;let p=null;if(g!==0){if(p=c.value,_!==!0||p===null){const f=m+g*4,y=d.matrixWorldInverse;a.getNormalMatrix(y),(p===null||p.length<f)&&(p=new Float32Array(f));for(let x=0,T=m;x!==g;++x,T+=4)o.copy(h[x]).applyMatrix4(y,a),o.normal.toArray(p,T),p[T+3]=o.constant}c.value=p,c.needsUpdate=!0}return t.numPlanes=g,t.numIntersection=0,p}}function WM(i){let t=new WeakMap;function e(o,a){return a===Oc?o.mapping=Ws:a===Uc&&(o.mapping=qs),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===Oc||a===Uc)if(t.has(o)){const c=t.get(o).texture;return e(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const l=new ey(c.height);return l.fromEquirectangularTexture(i,o),t.set(o,l),o.addEventListener("dispose",s),e(l.texture,o.mapping)}else return null}}return o}function s(o){const a=o.target;a.removeEventListener("dispose",s);const c=t.get(a);c!==void 0&&(t.delete(a),c.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}class qM extends vf{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,o=n+t,a=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=u*this.view.offsetY,c=a-u*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Rs=4,lh=[.125,.215,.35,.446,.526,.582],Fi=20,gc=new qM,uh=new Yt;let vc=null,xc=0,yc=0,Sc=!1;const Li=(1+Math.sqrt(5))/2,bs=1/Li,hh=[new G(-Li,bs,0),new G(Li,bs,0),new G(-bs,0,Li),new G(bs,0,Li),new G(0,Li,-bs),new G(0,Li,bs),new G(-1,1,-1),new G(1,1,-1),new G(-1,1,1),new G(1,1,1)];class dh{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){vc=this._renderer.getRenderTarget(),xc=this._renderer.getActiveCubeFace(),yc=this._renderer.getActiveMipmapLevel(),Sc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=mh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ph(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(vc,xc,yc),this._renderer.xr.enabled=Sc,t.scissorTest=!1,yo(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Ws||t.mapping===qs?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),vc=this._renderer.getRenderTarget(),xc=this._renderer.getActiveCubeFace(),yc=this._renderer.getActiveMipmapLevel(),Sc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:pn,minFilter:pn,generateMipmaps:!1,type:Gr,format:gn,colorSpace:bi,depthBuffer:!1},s=fh(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=fh(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=XM(r)),this._blurMaterial=YM(r,t,e)}return s}_compileMaterial(t){const e=new vn(this._lodPlanes[0],t);this._renderer.compile(e,gc)}_sceneToCubeUV(t,e,n,s){const a=new sn(90,1,e,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],u=this._renderer,h=u.autoClear,d=u.toneMapping;u.getClearColor(uh),u.toneMapping=gi,u.autoClear=!1;const m=new pf({name:"PMREM.Background",side:qe,depthWrite:!1,depthTest:!1}),_=new vn(new Xr,m);let g=!1;const p=t.background;p?p.isColor&&(m.color.copy(p),t.background=null,g=!0):(m.color.copy(uh),g=!0);for(let f=0;f<6;f++){const y=f%3;y===0?(a.up.set(0,c[f],0),a.lookAt(l[f],0,0)):y===1?(a.up.set(0,0,c[f]),a.lookAt(0,l[f],0)):(a.up.set(0,c[f],0),a.lookAt(0,0,l[f]));const x=this._cubeSize;yo(s,y*x,f>2?x:0,x,x),u.setRenderTarget(s),g&&u.render(_,a),u.render(t,a)}_.geometry.dispose(),_.material.dispose(),u.toneMapping=d,u.autoClear=h,t.background=p}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===Ws||t.mapping===qs;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=mh()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ph());const r=s?this._cubemapMaterial:this._equirectMaterial,o=new vn(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;const c=this._cubeSize;yo(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(o,gc)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=hh[(s-r-1)%hh.length];this._blur(t,r-1,r,o,a)}e.autoClear=n}_blur(t,e,n,s,r){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,s,"latitudinal",r),this._halfBlur(o,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,o,a){const c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,h=new vn(this._lodPlanes[s],l),d=l.uniforms,m=this._sizeLods[n]-1,_=isFinite(r)?Math.PI/(2*m):2*Math.PI/(2*Fi-1),g=r/_,p=isFinite(r)?1+Math.floor(u*g):Fi;p>Fi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${Fi}`);const f=[];let y=0;for(let b=0;b<Fi;++b){const C=b/g,S=Math.exp(-C*C/2);f.push(S),b===0?y+=S:b<p&&(y+=2*S)}for(let b=0;b<f.length;b++)f[b]=f[b]/y;d.envMap.value=t.texture,d.samples.value=p,d.weights.value=f,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:x}=this;d.dTheta.value=_,d.mipInt.value=x-n;const T=this._sizeLods[s],w=3*T*(s>x-Rs?s-x+Rs:0),E=4*(this._cubeSize-T);yo(e,w,E,3*T,2*T),c.setRenderTarget(e),c.render(h,gc)}}function XM(i){const t=[],e=[],n=[];let s=i;const r=i-Rs+1+lh.length;for(let o=0;o<r;o++){const a=Math.pow(2,s);e.push(a);let c=1/a;o>i-Rs?c=lh[o-i+Rs-1]:o===0&&(c=0),n.push(c);const l=1/(a-2),u=-l,h=1+l,d=[u,u,h,u,h,h,u,u,h,h,u,h],m=6,_=6,g=3,p=2,f=1,y=new Float32Array(g*_*m),x=new Float32Array(p*_*m),T=new Float32Array(f*_*m);for(let E=0;E<m;E++){const b=E%3*2/3-1,C=E>2?0:-1,S=[b,C,0,b+2/3,C,0,b+2/3,C+1,0,b,C,0,b+2/3,C+1,0,b,C+1,0];y.set(S,g*_*E),x.set(d,p*_*E);const v=[E,E,E,E,E,E];T.set(v,f*_*E)}const w=new Bn;w.setAttribute("position",new Pn(y,g)),w.setAttribute("uv",new Pn(x,p)),w.setAttribute("faceIndex",new Pn(T,f)),t.push(w),s>Rs&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function fh(i,t,e){const n=new ns(i,t,e);return n.texture.mapping=Ua,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function yo(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function YM(i,t,e){const n=new Float32Array(Fi),s=new G(0,1,0);return new Mi({name:"SphericalGaussianBlur",defines:{n:Fi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:$l(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:_i,depthTest:!1,depthWrite:!1})}function ph(){return new Mi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:$l(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:_i,depthTest:!1,depthWrite:!1})}function mh(){return new Mi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:$l(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:_i,depthTest:!1,depthWrite:!1})}function $l(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function jM(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const c=a.mapping,l=c===Oc||c===Uc,u=c===Ws||c===qs;if(l||u){let h=t.get(a);const d=h!==void 0?h.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return e===null&&(e=new dh(i)),h=l?e.fromEquirectangular(a,h):e.fromCubemap(a,h),h.texture.pmremVersion=a.pmremVersion,t.set(a,h),h.texture;if(h!==void 0)return h.texture;{const m=a.image;return l&&m&&m.height>0||u&&m&&s(m)?(e===null&&(e=new dh(i)),h=l?e.fromEquirectangular(a):e.fromCubemap(a),h.texture.pmremVersion=a.pmremVersion,t.set(a,h),a.addEventListener("dispose",r),h.texture):null}}}return a}function s(a){let c=0;const l=6;for(let u=0;u<l;u++)a[u]!==void 0&&c++;return c===l}function r(a){const c=a.target;c.removeEventListener("dispose",r);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function $M(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&fr("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function ZM(i,t,e,n){const s={},r=new WeakMap;function o(h){const d=h.target;d.index!==null&&t.remove(d.index);for(const _ in d.attributes)t.remove(d.attributes[_]);for(const _ in d.morphAttributes){const g=d.morphAttributes[_];for(let p=0,f=g.length;p<f;p++)t.remove(g[p])}d.removeEventListener("dispose",o),delete s[d.id];const m=r.get(d);m&&(t.remove(m),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function a(h,d){return s[d.id]===!0||(d.addEventListener("dispose",o),s[d.id]=!0,e.memory.geometries++),d}function c(h){const d=h.attributes;for(const _ in d)t.update(d[_],i.ARRAY_BUFFER);const m=h.morphAttributes;for(const _ in m){const g=m[_];for(let p=0,f=g.length;p<f;p++)t.update(g[p],i.ARRAY_BUFFER)}}function l(h){const d=[],m=h.index,_=h.attributes.position;let g=0;if(m!==null){const y=m.array;g=m.version;for(let x=0,T=y.length;x<T;x+=3){const w=y[x+0],E=y[x+1],b=y[x+2];d.push(w,E,E,b,b,w)}}else if(_!==void 0){const y=_.array;g=_.version;for(let x=0,T=y.length/3-1;x<T;x+=3){const w=x+0,E=x+1,b=x+2;d.push(w,E,E,b,b,w)}}else return;const p=new(cf(d)?_f:mf)(d,1);p.version=g;const f=r.get(h);f&&t.remove(f),r.set(h,p)}function u(h){const d=r.get(h);if(d){const m=h.index;m!==null&&d.version<m.version&&l(h)}else l(h);return r.get(h)}return{get:a,update:c,getWireframeAttribute:u}}function KM(i,t,e){let n;function s(d){n=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function c(d,m){i.drawElements(n,m,r,d*o),e.update(m,n,1)}function l(d,m,_){_!==0&&(i.drawElementsInstanced(n,m,r,d*o,_),e.update(m,n,_))}function u(d,m,_){if(_===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,m,0,r,d,0,_);let p=0;for(let f=0;f<_;f++)p+=m[f];e.update(p,n,1)}function h(d,m,_,g){if(_===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let f=0;f<d.length;f++)l(d[f]/o,m[f],g[f]);else{p.multiDrawElementsInstancedWEBGL(n,m,0,r,d,0,g,0,_);let f=0;for(let y=0;y<_;y++)f+=m[y];for(let y=0;y<g.length;y++)e.update(f,n,g[y])}}this.setMode=s,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function JM(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function QM(i,t,e){const n=new WeakMap,s=new Ae;function r(o,a,c){const l=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=u!==void 0?u.length:0;let d=n.get(a);if(d===void 0||d.count!==h){let v=function(){C.dispose(),n.delete(a),a.removeEventListener("dispose",v)};var m=v;d!==void 0&&d.texture.dispose();const _=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,p=a.morphAttributes.color!==void 0,f=a.morphAttributes.position||[],y=a.morphAttributes.normal||[],x=a.morphAttributes.color||[];let T=0;_===!0&&(T=1),g===!0&&(T=2),p===!0&&(T=3);let w=a.attributes.position.count*T,E=1;w>t.maxTextureSize&&(E=Math.ceil(w/t.maxTextureSize),w=t.maxTextureSize);const b=new Float32Array(w*E*4*h),C=new uf(b,w,E,h);C.type=Zn,C.needsUpdate=!0;const S=T*4;for(let R=0;R<h;R++){const P=f[R],N=y[R],F=x[R],z=w*E*4*R;for(let U=0;U<P.count;U++){const B=U*S;_===!0&&(s.fromBufferAttribute(P,U),b[z+B+0]=s.x,b[z+B+1]=s.y,b[z+B+2]=s.z,b[z+B+3]=0),g===!0&&(s.fromBufferAttribute(N,U),b[z+B+4]=s.x,b[z+B+5]=s.y,b[z+B+6]=s.z,b[z+B+7]=0),p===!0&&(s.fromBufferAttribute(F,U),b[z+B+8]=s.x,b[z+B+9]=s.y,b[z+B+10]=s.z,b[z+B+11]=F.itemSize===4?s.w:1)}}d={count:h,texture:C,size:new Gt(w,E)},n.set(a,d),a.addEventListener("dispose",v)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",o.morphTexture,e);else{let _=0;for(let p=0;p<l.length;p++)_+=l[p];const g=a.morphTargetsRelative?1:1-_;c.getUniforms().setValue(i,"morphTargetBaseInfluence",g),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",d.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function tT(i,t,e,n){let s=new WeakMap;function r(c){const l=n.render.frame,u=c.geometry,h=t.get(c,u);if(s.get(h)!==l&&(t.update(h),s.set(h,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),s.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const d=c.skeleton;s.get(d)!==l&&(d.update(),s.set(d,l))}return h}function o(){s=new WeakMap}function a(c){const l=c.target;l.removeEventListener("dispose",a),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:r,dispose:o}}class Mf extends Xe{constructor(t,e,n,s,r,o,a,c,l,u=Ps){if(u!==Ps&&u!==Ys)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&u===Ps&&(n=es),n===void 0&&u===Ys&&(n=Xs),super(null,s,r,o,a,c,u,n,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:rn,this.minFilter=c!==void 0?c:rn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Tf=new Xe,_h=new Mf(1,1),Ef=new uf,bf=new Bx,wf=new xf,gh=[],vh=[],xh=new Float32Array(16),yh=new Float32Array(9),Sh=new Float32Array(4);function nr(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=gh[s];if(r===void 0&&(r=new Float32Array(s),gh[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function Ee(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function be(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Va(i,t){let e=vh[t];e===void 0&&(e=new Int32Array(t),vh[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function eT(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function nT(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ee(e,t))return;i.uniform2fv(this.addr,t),be(e,t)}}function iT(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ee(e,t))return;i.uniform3fv(this.addr,t),be(e,t)}}function sT(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ee(e,t))return;i.uniform4fv(this.addr,t),be(e,t)}}function rT(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ee(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),be(e,t)}else{if(Ee(e,n))return;Sh.set(n),i.uniformMatrix2fv(this.addr,!1,Sh),be(e,n)}}function oT(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ee(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),be(e,t)}else{if(Ee(e,n))return;yh.set(n),i.uniformMatrix3fv(this.addr,!1,yh),be(e,n)}}function aT(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ee(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),be(e,t)}else{if(Ee(e,n))return;xh.set(n),i.uniformMatrix4fv(this.addr,!1,xh),be(e,n)}}function cT(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function lT(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ee(e,t))return;i.uniform2iv(this.addr,t),be(e,t)}}function uT(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ee(e,t))return;i.uniform3iv(this.addr,t),be(e,t)}}function hT(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ee(e,t))return;i.uniform4iv(this.addr,t),be(e,t)}}function dT(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function fT(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ee(e,t))return;i.uniform2uiv(this.addr,t),be(e,t)}}function pT(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ee(e,t))return;i.uniform3uiv(this.addr,t),be(e,t)}}function mT(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ee(e,t))return;i.uniform4uiv(this.addr,t),be(e,t)}}function _T(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(_h.compareFunction=af,r=_h):r=Tf,e.setTexture2D(t||r,s)}function gT(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||bf,s)}function vT(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||wf,s)}function xT(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Ef,s)}function yT(i){switch(i){case 5126:return eT;case 35664:return nT;case 35665:return iT;case 35666:return sT;case 35674:return rT;case 35675:return oT;case 35676:return aT;case 5124:case 35670:return cT;case 35667:case 35671:return lT;case 35668:case 35672:return uT;case 35669:case 35673:return hT;case 5125:return dT;case 36294:return fT;case 36295:return pT;case 36296:return mT;case 35678:case 36198:case 36298:case 36306:case 35682:return _T;case 35679:case 36299:case 36307:return gT;case 35680:case 36300:case 36308:case 36293:return vT;case 36289:case 36303:case 36311:case 36292:return xT}}function ST(i,t){i.uniform1fv(this.addr,t)}function MT(i,t){const e=nr(t,this.size,2);i.uniform2fv(this.addr,e)}function TT(i,t){const e=nr(t,this.size,3);i.uniform3fv(this.addr,e)}function ET(i,t){const e=nr(t,this.size,4);i.uniform4fv(this.addr,e)}function bT(i,t){const e=nr(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function wT(i,t){const e=nr(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function AT(i,t){const e=nr(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function CT(i,t){i.uniform1iv(this.addr,t)}function RT(i,t){i.uniform2iv(this.addr,t)}function DT(i,t){i.uniform3iv(this.addr,t)}function PT(i,t){i.uniform4iv(this.addr,t)}function IT(i,t){i.uniform1uiv(this.addr,t)}function NT(i,t){i.uniform2uiv(this.addr,t)}function LT(i,t){i.uniform3uiv(this.addr,t)}function OT(i,t){i.uniform4uiv(this.addr,t)}function UT(i,t,e){const n=this.cache,s=t.length,r=Va(e,s);Ee(n,r)||(i.uniform1iv(this.addr,r),be(n,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||Tf,r[o])}function FT(i,t,e){const n=this.cache,s=t.length,r=Va(e,s);Ee(n,r)||(i.uniform1iv(this.addr,r),be(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||bf,r[o])}function kT(i,t,e){const n=this.cache,s=t.length,r=Va(e,s);Ee(n,r)||(i.uniform1iv(this.addr,r),be(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||wf,r[o])}function BT(i,t,e){const n=this.cache,s=t.length,r=Va(e,s);Ee(n,r)||(i.uniform1iv(this.addr,r),be(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||Ef,r[o])}function VT(i){switch(i){case 5126:return ST;case 35664:return MT;case 35665:return TT;case 35666:return ET;case 35674:return bT;case 35675:return wT;case 35676:return AT;case 5124:case 35670:return CT;case 35667:case 35671:return RT;case 35668:case 35672:return DT;case 35669:case 35673:return PT;case 5125:return IT;case 36294:return NT;case 36295:return LT;case 36296:return OT;case 35678:case 36198:case 36298:case 36306:case 35682:return UT;case 35679:case 36299:case 36307:return FT;case 35680:case 36300:case 36308:case 36293:return kT;case 36289:case 36303:case 36311:case 36292:return BT}}class zT{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=yT(e.type)}}class GT{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=VT(e.type)}}class HT{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(t,e[a.id],n)}}}const Mc=/(\w+)(\])?(\[|\.)?/g;function Mh(i,t){i.seq.push(t),i.map[t.id]=t}function WT(i,t,e){const n=i.name,s=n.length;for(Mc.lastIndex=0;;){const r=Mc.exec(n),o=Mc.lastIndex;let a=r[1];const c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===s){Mh(e,l===void 0?new zT(a,i,t):new GT(a,i,t));break}else{let h=e.map[a];h===void 0&&(h=new HT(a),Mh(e,h)),e=h}}}class Io{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);WT(r,o,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){const a=e[r],c=n[a.id];c.needsUpdate!==!1&&a.setValue(t,c.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const o=t[s];o.id in e&&n.push(o)}return n}}function Th(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const qT=37297;let XT=0;function YT(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}function jT(i){const t=ee.getPrimaries(ee.workingColorSpace),e=ee.getPrimaries(i);let n;switch(t===e?n="":t===ga&&e===_a?n="LinearDisplayP3ToLinearSRGB":t===_a&&e===ga&&(n="LinearSRGBToLinearDisplayP3"),i){case bi:case Fa:return[n,"LinearTransferOETF"];case Cn:case jl:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function Eh(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const o=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+YT(i.getShaderSource(t),o)}else return s}function $T(i,t){const e=jT(t);return`vec4 ${i}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function ZT(i,t){let e;switch(t){case fx:e="Linear";break;case px:e="Reinhard";break;case mx:e="Cineon";break;case _x:e="ACESFilmic";break;case vx:e="AgX";break;case xx:e="Neutral";break;case gx:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const So=new G;function KT(){ee.getLuminanceCoefficients(So);const i=So.x.toFixed(4),t=So.y.toFixed(4),e=So.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function JT(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ur).join(`
`)}function QT(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function tE(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),o=r.name;let a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function ur(i){return i!==""}function bh(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function wh(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const eE=/^[ \t]*#include +<([\w\d./]+)>/gm;function dl(i){return i.replace(eE,iE)}const nE=new Map;function iE(i,t){let e=kt[t];if(e===void 0){const n=nE.get(t);if(n!==void 0)e=kt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return dl(e)}const sE=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Ah(i){return i.replace(sE,rE)}function rE(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Ch(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function oE(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Xd?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===B0?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Yn&&(t="SHADOWMAP_TYPE_VSM"),t}function aE(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Ws:case qs:t="ENVMAP_TYPE_CUBE";break;case Ua:t="ENVMAP_TYPE_CUBE_UV";break}return t}function cE(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case qs:t="ENVMAP_MODE_REFRACTION";break}return t}function lE(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Yd:t="ENVMAP_BLENDING_MULTIPLY";break;case hx:t="ENVMAP_BLENDING_MIX";break;case dx:t="ENVMAP_BLENDING_ADD";break}return t}function uE(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function hE(i,t,e,n){const s=i.getContext(),r=e.defines;let o=e.vertexShader,a=e.fragmentShader;const c=oE(e),l=aE(e),u=cE(e),h=lE(e),d=uE(e),m=JT(e),_=QT(r),g=s.createProgram();let p,f,y=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_].filter(ur).join(`
`),p.length>0&&(p+=`
`),f=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_].filter(ur).join(`
`),f.length>0&&(f+=`
`)):(p=[Ch(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+u:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ur).join(`
`),f=[Ch(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+u:"",e.envMap?"#define "+h:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==gi?"#define TONE_MAPPING":"",e.toneMapping!==gi?kt.tonemapping_pars_fragment:"",e.toneMapping!==gi?ZT("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",kt.colorspace_pars_fragment,$T("linearToOutputTexel",e.outputColorSpace),KT(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(ur).join(`
`)),o=dl(o),o=bh(o,e),o=wh(o,e),a=dl(a),a=bh(a,e),a=wh(a,e),o=Ah(o),a=Ah(a),e.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,p=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,f=["#define varying in",e.glslVersion===Hu?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Hu?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const x=y+p+o,T=y+f+a,w=Th(s,s.VERTEX_SHADER,x),E=Th(s,s.FRAGMENT_SHADER,T);s.attachShader(g,w),s.attachShader(g,E),e.index0AttributeName!==void 0?s.bindAttribLocation(g,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(g,0,"position"),s.linkProgram(g);function b(R){if(i.debug.checkShaderErrors){const P=s.getProgramInfoLog(g).trim(),N=s.getShaderInfoLog(w).trim(),F=s.getShaderInfoLog(E).trim();let z=!0,U=!0;if(s.getProgramParameter(g,s.LINK_STATUS)===!1)if(z=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,g,w,E);else{const B=Eh(s,w,"vertex"),V=Eh(s,E,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(g,s.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+P+`
`+B+`
`+V)}else P!==""?console.warn("THREE.WebGLProgram: Program Info Log:",P):(N===""||F==="")&&(U=!1);U&&(R.diagnostics={runnable:z,programLog:P,vertexShader:{log:N,prefix:p},fragmentShader:{log:F,prefix:f}})}s.deleteShader(w),s.deleteShader(E),C=new Io(s,g),S=tE(s,g)}let C;this.getUniforms=function(){return C===void 0&&b(this),C};let S;this.getAttributes=function(){return S===void 0&&b(this),S};let v=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return v===!1&&(v=s.getProgramParameter(g,qT)),v},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(g),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=XT++,this.cacheKey=t,this.usedTimes=1,this.program=g,this.vertexShader=w,this.fragmentShader=E,this}let dE=0;class fE{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new pE(t),e.set(t,n)),n}}class pE{constructor(t){this.id=dE++,this.code=t,this.usedTimes=0}}function mE(i,t,e,n,s,r,o){const a=new df,c=new fE,l=new Set,u=[],h=s.logarithmicDepthBuffer,d=s.vertexTextures;let m=s.precision;const _={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(S){return l.add(S),S===0?"uv":`uv${S}`}function p(S,v,R,P,N){const F=P.fog,z=N.geometry,U=S.isMeshStandardMaterial?P.environment:null,B=(S.isMeshStandardMaterial?e:t).get(S.envMap||U),V=B&&B.mapping===Ua?B.image.height:null,j=_[S.type];S.precision!==null&&(m=s.getMaxPrecision(S.precision),m!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",m,"instead."));const J=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,nt=J!==void 0?J.length:0;let xt=0;z.morphAttributes.position!==void 0&&(xt=1),z.morphAttributes.normal!==void 0&&(xt=2),z.morphAttributes.color!==void 0&&(xt=3);let Ot,X,Y,ot;if(j){const Kt=Rn[j];Ot=Kt.vertexShader,X=Kt.fragmentShader}else Ot=S.vertexShader,X=S.fragmentShader,c.update(S),Y=c.getVertexShaderID(S),ot=c.getFragmentShaderID(S);const ut=i.getRenderTarget(),st=N.isInstancedMesh===!0,Ct=N.isBatchedMesh===!0,Nt=!!S.map,ne=!!S.matcap,I=!!B,de=!!S.aoMap,Zt=!!S.lightMap,rt=!!S.bumpMap,it=!!S.normalMap,Ut=!!S.displacementMap,_t=!!S.emissiveMap,ft=!!S.metalnessMap,D=!!S.roughnessMap,M=S.anisotropy>0,H=S.clearcoat>0,Z=S.dispersion>0,et=S.iridescence>0,tt=S.sheen>0,wt=S.transmission>0,pt=M&&!!S.anisotropyMap,vt=H&&!!S.clearcoatMap,Ft=H&&!!S.clearcoatNormalMap,at=H&&!!S.clearcoatRoughnessMap,gt=et&&!!S.iridescenceMap,Ht=et&&!!S.iridescenceThicknessMap,It=tt&&!!S.sheenColorMap,yt=tt&&!!S.sheenRoughnessMap,Lt=!!S.specularMap,Vt=!!S.specularColorMap,ue=!!S.specularIntensityMap,L=wt&&!!S.transmissionMap,ct=wt&&!!S.thicknessMap,K=!!S.gradientMap,Q=!!S.alphaMap,ht=S.alphaTest>0,Rt=!!S.alphaHash,Xt=!!S.extensions;let xe=gi;S.toneMapped&&(ut===null||ut.isXRRenderTarget===!0)&&(xe=i.toneMapping);const De={shaderID:j,shaderType:S.type,shaderName:S.name,vertexShader:Ot,fragmentShader:X,defines:S.defines,customVertexShaderID:Y,customFragmentShaderID:ot,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:m,batching:Ct,batchingColor:Ct&&N._colorsTexture!==null,instancing:st,instancingColor:st&&N.instanceColor!==null,instancingMorph:st&&N.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:ut===null?i.outputColorSpace:ut.isXRRenderTarget===!0?ut.texture.colorSpace:bi,alphaToCoverage:!!S.alphaToCoverage,map:Nt,matcap:ne,envMap:I,envMapMode:I&&B.mapping,envMapCubeUVHeight:V,aoMap:de,lightMap:Zt,bumpMap:rt,normalMap:it,displacementMap:d&&Ut,emissiveMap:_t,normalMapObjectSpace:it&&S.normalMapType===Tx,normalMapTangentSpace:it&&S.normalMapType===of,metalnessMap:ft,roughnessMap:D,anisotropy:M,anisotropyMap:pt,clearcoat:H,clearcoatMap:vt,clearcoatNormalMap:Ft,clearcoatRoughnessMap:at,dispersion:Z,iridescence:et,iridescenceMap:gt,iridescenceThicknessMap:Ht,sheen:tt,sheenColorMap:It,sheenRoughnessMap:yt,specularMap:Lt,specularColorMap:Vt,specularIntensityMap:ue,transmission:wt,transmissionMap:L,thicknessMap:ct,gradientMap:K,opaque:S.transparent===!1&&S.blending===Ds&&S.alphaToCoverage===!1,alphaMap:Q,alphaTest:ht,alphaHash:Rt,combine:S.combine,mapUv:Nt&&g(S.map.channel),aoMapUv:de&&g(S.aoMap.channel),lightMapUv:Zt&&g(S.lightMap.channel),bumpMapUv:rt&&g(S.bumpMap.channel),normalMapUv:it&&g(S.normalMap.channel),displacementMapUv:Ut&&g(S.displacementMap.channel),emissiveMapUv:_t&&g(S.emissiveMap.channel),metalnessMapUv:ft&&g(S.metalnessMap.channel),roughnessMapUv:D&&g(S.roughnessMap.channel),anisotropyMapUv:pt&&g(S.anisotropyMap.channel),clearcoatMapUv:vt&&g(S.clearcoatMap.channel),clearcoatNormalMapUv:Ft&&g(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:at&&g(S.clearcoatRoughnessMap.channel),iridescenceMapUv:gt&&g(S.iridescenceMap.channel),iridescenceThicknessMapUv:Ht&&g(S.iridescenceThicknessMap.channel),sheenColorMapUv:It&&g(S.sheenColorMap.channel),sheenRoughnessMapUv:yt&&g(S.sheenRoughnessMap.channel),specularMapUv:Lt&&g(S.specularMap.channel),specularColorMapUv:Vt&&g(S.specularColorMap.channel),specularIntensityMapUv:ue&&g(S.specularIntensityMap.channel),transmissionMapUv:L&&g(S.transmissionMap.channel),thicknessMapUv:ct&&g(S.thicknessMap.channel),alphaMapUv:Q&&g(S.alphaMap.channel),vertexTangents:!!z.attributes.tangent&&(it||M),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,pointsUvs:N.isPoints===!0&&!!z.attributes.uv&&(Nt||Q),fog:!!F,useFog:S.fog===!0,fogExp2:!!F&&F.isFogExp2,flatShading:S.flatShading===!0,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:h,skinning:N.isSkinnedMesh===!0,morphTargets:z.morphAttributes.position!==void 0,morphNormals:z.morphAttributes.normal!==void 0,morphColors:z.morphAttributes.color!==void 0,morphTargetsCount:nt,morphTextureStride:xt,numDirLights:v.directional.length,numPointLights:v.point.length,numSpotLights:v.spot.length,numSpotLightMaps:v.spotLightMap.length,numRectAreaLights:v.rectArea.length,numHemiLights:v.hemi.length,numDirLightShadows:v.directionalShadowMap.length,numPointLightShadows:v.pointShadowMap.length,numSpotLightShadows:v.spotShadowMap.length,numSpotLightShadowsWithMaps:v.numSpotLightShadowsWithMaps,numLightProbes:v.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:S.dithering,shadowMapEnabled:i.shadowMap.enabled&&R.length>0,shadowMapType:i.shadowMap.type,toneMapping:xe,decodeVideoTexture:Nt&&S.map.isVideoTexture===!0&&ee.getTransfer(S.map.colorSpace)===ae,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===$n,flipSided:S.side===qe,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:Xt&&S.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Xt&&S.extensions.multiDraw===!0||Ct)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return De.vertexUv1s=l.has(1),De.vertexUv2s=l.has(2),De.vertexUv3s=l.has(3),l.clear(),De}function f(S){const v=[];if(S.shaderID?v.push(S.shaderID):(v.push(S.customVertexShaderID),v.push(S.customFragmentShaderID)),S.defines!==void 0)for(const R in S.defines)v.push(R),v.push(S.defines[R]);return S.isRawShaderMaterial===!1&&(y(v,S),x(v,S),v.push(i.outputColorSpace)),v.push(S.customProgramCacheKey),v.join()}function y(S,v){S.push(v.precision),S.push(v.outputColorSpace),S.push(v.envMapMode),S.push(v.envMapCubeUVHeight),S.push(v.mapUv),S.push(v.alphaMapUv),S.push(v.lightMapUv),S.push(v.aoMapUv),S.push(v.bumpMapUv),S.push(v.normalMapUv),S.push(v.displacementMapUv),S.push(v.emissiveMapUv),S.push(v.metalnessMapUv),S.push(v.roughnessMapUv),S.push(v.anisotropyMapUv),S.push(v.clearcoatMapUv),S.push(v.clearcoatNormalMapUv),S.push(v.clearcoatRoughnessMapUv),S.push(v.iridescenceMapUv),S.push(v.iridescenceThicknessMapUv),S.push(v.sheenColorMapUv),S.push(v.sheenRoughnessMapUv),S.push(v.specularMapUv),S.push(v.specularColorMapUv),S.push(v.specularIntensityMapUv),S.push(v.transmissionMapUv),S.push(v.thicknessMapUv),S.push(v.combine),S.push(v.fogExp2),S.push(v.sizeAttenuation),S.push(v.morphTargetsCount),S.push(v.morphAttributeCount),S.push(v.numDirLights),S.push(v.numPointLights),S.push(v.numSpotLights),S.push(v.numSpotLightMaps),S.push(v.numHemiLights),S.push(v.numRectAreaLights),S.push(v.numDirLightShadows),S.push(v.numPointLightShadows),S.push(v.numSpotLightShadows),S.push(v.numSpotLightShadowsWithMaps),S.push(v.numLightProbes),S.push(v.shadowMapType),S.push(v.toneMapping),S.push(v.numClippingPlanes),S.push(v.numClipIntersection),S.push(v.depthPacking)}function x(S,v){a.disableAll(),v.supportsVertexTextures&&a.enable(0),v.instancing&&a.enable(1),v.instancingColor&&a.enable(2),v.instancingMorph&&a.enable(3),v.matcap&&a.enable(4),v.envMap&&a.enable(5),v.normalMapObjectSpace&&a.enable(6),v.normalMapTangentSpace&&a.enable(7),v.clearcoat&&a.enable(8),v.iridescence&&a.enable(9),v.alphaTest&&a.enable(10),v.vertexColors&&a.enable(11),v.vertexAlphas&&a.enable(12),v.vertexUv1s&&a.enable(13),v.vertexUv2s&&a.enable(14),v.vertexUv3s&&a.enable(15),v.vertexTangents&&a.enable(16),v.anisotropy&&a.enable(17),v.alphaHash&&a.enable(18),v.batching&&a.enable(19),v.dispersion&&a.enable(20),v.batchingColor&&a.enable(21),S.push(a.mask),a.disableAll(),v.fog&&a.enable(0),v.useFog&&a.enable(1),v.flatShading&&a.enable(2),v.logarithmicDepthBuffer&&a.enable(3),v.skinning&&a.enable(4),v.morphTargets&&a.enable(5),v.morphNormals&&a.enable(6),v.morphColors&&a.enable(7),v.premultipliedAlpha&&a.enable(8),v.shadowMapEnabled&&a.enable(9),v.doubleSided&&a.enable(10),v.flipSided&&a.enable(11),v.useDepthPacking&&a.enable(12),v.dithering&&a.enable(13),v.transmission&&a.enable(14),v.sheen&&a.enable(15),v.opaque&&a.enable(16),v.pointsUvs&&a.enable(17),v.decodeVideoTexture&&a.enable(18),v.alphaToCoverage&&a.enable(19),S.push(a.mask)}function T(S){const v=_[S.type];let R;if(v){const P=Rn[v];R=Kx.clone(P.uniforms)}else R=S.uniforms;return R}function w(S,v){let R;for(let P=0,N=u.length;P<N;P++){const F=u[P];if(F.cacheKey===v){R=F,++R.usedTimes;break}}return R===void 0&&(R=new hE(i,v,S,r),u.push(R)),R}function E(S){if(--S.usedTimes===0){const v=u.indexOf(S);u[v]=u[u.length-1],u.pop(),S.destroy()}}function b(S){c.remove(S)}function C(){c.dispose()}return{getParameters:p,getProgramCacheKey:f,getUniforms:T,acquireProgram:w,releaseProgram:E,releaseShaderCache:b,programs:u,dispose:C}}function _E(){let i=new WeakMap;function t(o){return i.has(o)}function e(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,c){i.get(o)[a]=c}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function gE(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Rh(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Dh(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(h,d,m,_,g,p){let f=i[t];return f===void 0?(f={id:h.id,object:h,geometry:d,material:m,groupOrder:_,renderOrder:h.renderOrder,z:g,group:p},i[t]=f):(f.id=h.id,f.object=h,f.geometry=d,f.material=m,f.groupOrder=_,f.renderOrder=h.renderOrder,f.z=g,f.group=p),t++,f}function a(h,d,m,_,g,p){const f=o(h,d,m,_,g,p);m.transmission>0?n.push(f):m.transparent===!0?s.push(f):e.push(f)}function c(h,d,m,_,g,p){const f=o(h,d,m,_,g,p);m.transmission>0?n.unshift(f):m.transparent===!0?s.unshift(f):e.unshift(f)}function l(h,d){e.length>1&&e.sort(h||gE),n.length>1&&n.sort(d||Rh),s.length>1&&s.sort(d||Rh)}function u(){for(let h=t,d=i.length;h<d;h++){const m=i[h];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:a,unshift:c,finish:u,sort:l}}function vE(){let i=new WeakMap;function t(n,s){const r=i.get(n);let o;return r===void 0?(o=new Dh,i.set(n,[o])):s>=r.length?(o=new Dh,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function xE(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new G,color:new Yt};break;case"SpotLight":e={position:new G,direction:new G,color:new Yt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new G,color:new Yt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new G,skyColor:new Yt,groundColor:new Yt};break;case"RectAreaLight":e={color:new Yt,position:new G,halfWidth:new G,halfHeight:new G};break}return i[t.id]=e,e}}}function yE(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Gt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Gt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Gt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let SE=0;function ME(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function TE(i){const t=new xE,e=yE(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new G);const s=new G,r=new Me,o=new Me;function a(l){let u=0,h=0,d=0;for(let S=0;S<9;S++)n.probe[S].set(0,0,0);let m=0,_=0,g=0,p=0,f=0,y=0,x=0,T=0,w=0,E=0,b=0;l.sort(ME);for(let S=0,v=l.length;S<v;S++){const R=l[S],P=R.color,N=R.intensity,F=R.distance,z=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)u+=P.r*N,h+=P.g*N,d+=P.b*N;else if(R.isLightProbe){for(let U=0;U<9;U++)n.probe[U].addScaledVector(R.sh.coefficients[U],N);b++}else if(R.isDirectionalLight){const U=t.get(R);if(U.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){const B=R.shadow,V=e.get(R);V.shadowIntensity=B.intensity,V.shadowBias=B.bias,V.shadowNormalBias=B.normalBias,V.shadowRadius=B.radius,V.shadowMapSize=B.mapSize,n.directionalShadow[m]=V,n.directionalShadowMap[m]=z,n.directionalShadowMatrix[m]=R.shadow.matrix,y++}n.directional[m]=U,m++}else if(R.isSpotLight){const U=t.get(R);U.position.setFromMatrixPosition(R.matrixWorld),U.color.copy(P).multiplyScalar(N),U.distance=F,U.coneCos=Math.cos(R.angle),U.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),U.decay=R.decay,n.spot[g]=U;const B=R.shadow;if(R.map&&(n.spotLightMap[w]=R.map,w++,B.updateMatrices(R),R.castShadow&&E++),n.spotLightMatrix[g]=B.matrix,R.castShadow){const V=e.get(R);V.shadowIntensity=B.intensity,V.shadowBias=B.bias,V.shadowNormalBias=B.normalBias,V.shadowRadius=B.radius,V.shadowMapSize=B.mapSize,n.spotShadow[g]=V,n.spotShadowMap[g]=z,T++}g++}else if(R.isRectAreaLight){const U=t.get(R);U.color.copy(P).multiplyScalar(N),U.halfWidth.set(R.width*.5,0,0),U.halfHeight.set(0,R.height*.5,0),n.rectArea[p]=U,p++}else if(R.isPointLight){const U=t.get(R);if(U.color.copy(R.color).multiplyScalar(R.intensity),U.distance=R.distance,U.decay=R.decay,R.castShadow){const B=R.shadow,V=e.get(R);V.shadowIntensity=B.intensity,V.shadowBias=B.bias,V.shadowNormalBias=B.normalBias,V.shadowRadius=B.radius,V.shadowMapSize=B.mapSize,V.shadowCameraNear=B.camera.near,V.shadowCameraFar=B.camera.far,n.pointShadow[_]=V,n.pointShadowMap[_]=z,n.pointShadowMatrix[_]=R.shadow.matrix,x++}n.point[_]=U,_++}else if(R.isHemisphereLight){const U=t.get(R);U.skyColor.copy(R.color).multiplyScalar(N),U.groundColor.copy(R.groundColor).multiplyScalar(N),n.hemi[f]=U,f++}}p>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=dt.LTC_FLOAT_1,n.rectAreaLTC2=dt.LTC_FLOAT_2):(n.rectAreaLTC1=dt.LTC_HALF_1,n.rectAreaLTC2=dt.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=h,n.ambient[2]=d;const C=n.hash;(C.directionalLength!==m||C.pointLength!==_||C.spotLength!==g||C.rectAreaLength!==p||C.hemiLength!==f||C.numDirectionalShadows!==y||C.numPointShadows!==x||C.numSpotShadows!==T||C.numSpotMaps!==w||C.numLightProbes!==b)&&(n.directional.length=m,n.spot.length=g,n.rectArea.length=p,n.point.length=_,n.hemi.length=f,n.directionalShadow.length=y,n.directionalShadowMap.length=y,n.pointShadow.length=x,n.pointShadowMap.length=x,n.spotShadow.length=T,n.spotShadowMap.length=T,n.directionalShadowMatrix.length=y,n.pointShadowMatrix.length=x,n.spotLightMatrix.length=T+w-E,n.spotLightMap.length=w,n.numSpotLightShadowsWithMaps=E,n.numLightProbes=b,C.directionalLength=m,C.pointLength=_,C.spotLength=g,C.rectAreaLength=p,C.hemiLength=f,C.numDirectionalShadows=y,C.numPointShadows=x,C.numSpotShadows=T,C.numSpotMaps=w,C.numLightProbes=b,n.version=SE++)}function c(l,u){let h=0,d=0,m=0,_=0,g=0;const p=u.matrixWorldInverse;for(let f=0,y=l.length;f<y;f++){const x=l[f];if(x.isDirectionalLight){const T=n.directional[h];T.direction.setFromMatrixPosition(x.matrixWorld),s.setFromMatrixPosition(x.target.matrixWorld),T.direction.sub(s),T.direction.transformDirection(p),h++}else if(x.isSpotLight){const T=n.spot[m];T.position.setFromMatrixPosition(x.matrixWorld),T.position.applyMatrix4(p),T.direction.setFromMatrixPosition(x.matrixWorld),s.setFromMatrixPosition(x.target.matrixWorld),T.direction.sub(s),T.direction.transformDirection(p),m++}else if(x.isRectAreaLight){const T=n.rectArea[_];T.position.setFromMatrixPosition(x.matrixWorld),T.position.applyMatrix4(p),o.identity(),r.copy(x.matrixWorld),r.premultiply(p),o.extractRotation(r),T.halfWidth.set(x.width*.5,0,0),T.halfHeight.set(0,x.height*.5,0),T.halfWidth.applyMatrix4(o),T.halfHeight.applyMatrix4(o),_++}else if(x.isPointLight){const T=n.point[d];T.position.setFromMatrixPosition(x.matrixWorld),T.position.applyMatrix4(p),d++}else if(x.isHemisphereLight){const T=n.hemi[g];T.direction.setFromMatrixPosition(x.matrixWorld),T.direction.transformDirection(p),g++}}}return{setup:a,setupView:c,state:n}}function Ph(i){const t=new TE(i),e=[],n=[];function s(u){l.camera=u,e.length=0,n.length=0}function r(u){e.push(u)}function o(u){n.push(u)}function a(){t.setup(e)}function c(u){t.setupView(e,u)}const l={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:a,setupLightsView:c,pushLight:r,pushShadow:o}}function EE(i){let t=new WeakMap;function e(s,r=0){const o=t.get(s);let a;return o===void 0?(a=new Ph(i),t.set(s,[a])):r>=o.length?(a=new Ph(i),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}class bE extends er{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Sx,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class wE extends er{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const AE=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,CE=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function RE(i,t,e){let n=new yf;const s=new Gt,r=new Gt,o=new Ae,a=new bE({depthPacking:Mx}),c=new wE,l={},u=e.maxTextureSize,h={[Si]:qe,[qe]:Si,[$n]:$n},d=new Mi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Gt},radius:{value:4}},vertexShader:AE,fragmentShader:CE}),m=d.clone();m.defines.HORIZONTAL_PASS=1;const _=new Bn;_.setAttribute("position",new Pn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const g=new vn(_,d),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Xd;let f=this.type;this.render=function(E,b,C){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||E.length===0)return;const S=i.getRenderTarget(),v=i.getActiveCubeFace(),R=i.getActiveMipmapLevel(),P=i.state;P.setBlending(_i),P.buffers.color.setClear(1,1,1,1),P.buffers.depth.setTest(!0),P.setScissorTest(!1);const N=f!==Yn&&this.type===Yn,F=f===Yn&&this.type!==Yn;for(let z=0,U=E.length;z<U;z++){const B=E[z],V=B.shadow;if(V===void 0){console.warn("THREE.WebGLShadowMap:",B,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;s.copy(V.mapSize);const j=V.getFrameExtents();if(s.multiply(j),r.copy(V.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/j.x),s.x=r.x*j.x,V.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/j.y),s.y=r.y*j.y,V.mapSize.y=r.y)),V.map===null||N===!0||F===!0){const nt=this.type!==Yn?{minFilter:rn,magFilter:rn}:{};V.map!==null&&V.map.dispose(),V.map=new ns(s.x,s.y,nt),V.map.texture.name=B.name+".shadowMap",V.camera.updateProjectionMatrix()}i.setRenderTarget(V.map),i.clear();const J=V.getViewportCount();for(let nt=0;nt<J;nt++){const xt=V.getViewport(nt);o.set(r.x*xt.x,r.y*xt.y,r.x*xt.z,r.y*xt.w),P.viewport(o),V.updateMatrices(B,nt),n=V.getFrustum(),T(b,C,V.camera,B,this.type)}V.isPointLightShadow!==!0&&this.type===Yn&&y(V,C),V.needsUpdate=!1}f=this.type,p.needsUpdate=!1,i.setRenderTarget(S,v,R)};function y(E,b){const C=t.update(g);d.defines.VSM_SAMPLES!==E.blurSamples&&(d.defines.VSM_SAMPLES=E.blurSamples,m.defines.VSM_SAMPLES=E.blurSamples,d.needsUpdate=!0,m.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new ns(s.x,s.y)),d.uniforms.shadow_pass.value=E.map.texture,d.uniforms.resolution.value=E.mapSize,d.uniforms.radius.value=E.radius,i.setRenderTarget(E.mapPass),i.clear(),i.renderBufferDirect(b,null,C,d,g,null),m.uniforms.shadow_pass.value=E.mapPass.texture,m.uniforms.resolution.value=E.mapSize,m.uniforms.radius.value=E.radius,i.setRenderTarget(E.map),i.clear(),i.renderBufferDirect(b,null,C,m,g,null)}function x(E,b,C,S){let v=null;const R=C.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(R!==void 0)v=R;else if(v=C.isPointLight===!0?c:a,i.localClippingEnabled&&b.clipShadows===!0&&Array.isArray(b.clippingPlanes)&&b.clippingPlanes.length!==0||b.displacementMap&&b.displacementScale!==0||b.alphaMap&&b.alphaTest>0||b.map&&b.alphaTest>0){const P=v.uuid,N=b.uuid;let F=l[P];F===void 0&&(F={},l[P]=F);let z=F[N];z===void 0&&(z=v.clone(),F[N]=z,b.addEventListener("dispose",w)),v=z}if(v.visible=b.visible,v.wireframe=b.wireframe,S===Yn?v.side=b.shadowSide!==null?b.shadowSide:b.side:v.side=b.shadowSide!==null?b.shadowSide:h[b.side],v.alphaMap=b.alphaMap,v.alphaTest=b.alphaTest,v.map=b.map,v.clipShadows=b.clipShadows,v.clippingPlanes=b.clippingPlanes,v.clipIntersection=b.clipIntersection,v.displacementMap=b.displacementMap,v.displacementScale=b.displacementScale,v.displacementBias=b.displacementBias,v.wireframeLinewidth=b.wireframeLinewidth,v.linewidth=b.linewidth,C.isPointLight===!0&&v.isMeshDistanceMaterial===!0){const P=i.properties.get(v);P.light=C}return v}function T(E,b,C,S,v){if(E.visible===!1)return;if(E.layers.test(b.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&v===Yn)&&(!E.frustumCulled||n.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,E.matrixWorld);const N=t.update(E),F=E.material;if(Array.isArray(F)){const z=N.groups;for(let U=0,B=z.length;U<B;U++){const V=z[U],j=F[V.materialIndex];if(j&&j.visible){const J=x(E,j,S,v);E.onBeforeShadow(i,E,b,C,N,J,V),i.renderBufferDirect(C,null,N,J,E,V),E.onAfterShadow(i,E,b,C,N,J,V)}}}else if(F.visible){const z=x(E,F,S,v);E.onBeforeShadow(i,E,b,C,N,z,null),i.renderBufferDirect(C,null,N,z,E,null),E.onAfterShadow(i,E,b,C,N,z,null)}}const P=E.children;for(let N=0,F=P.length;N<F;N++)T(P[N],b,C,S,v)}function w(E){E.target.removeEventListener("dispose",w);for(const C in l){const S=l[C],v=E.target.uuid;v in S&&(S[v].dispose(),delete S[v])}}}function DE(i){function t(){let L=!1;const ct=new Ae;let K=null;const Q=new Ae(0,0,0,0);return{setMask:function(ht){K!==ht&&!L&&(i.colorMask(ht,ht,ht,ht),K=ht)},setLocked:function(ht){L=ht},setClear:function(ht,Rt,Xt,xe,De){De===!0&&(ht*=xe,Rt*=xe,Xt*=xe),ct.set(ht,Rt,Xt,xe),Q.equals(ct)===!1&&(i.clearColor(ht,Rt,Xt,xe),Q.copy(ct))},reset:function(){L=!1,K=null,Q.set(-1,0,0,0)}}}function e(){let L=!1,ct=null,K=null,Q=null;return{setTest:function(ht){ht?ot(i.DEPTH_TEST):ut(i.DEPTH_TEST)},setMask:function(ht){ct!==ht&&!L&&(i.depthMask(ht),ct=ht)},setFunc:function(ht){if(K!==ht){switch(ht){case sx:i.depthFunc(i.NEVER);break;case rx:i.depthFunc(i.ALWAYS);break;case ox:i.depthFunc(i.LESS);break;case pa:i.depthFunc(i.LEQUAL);break;case ax:i.depthFunc(i.EQUAL);break;case cx:i.depthFunc(i.GEQUAL);break;case lx:i.depthFunc(i.GREATER);break;case ux:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}K=ht}},setLocked:function(ht){L=ht},setClear:function(ht){Q!==ht&&(i.clearDepth(ht),Q=ht)},reset:function(){L=!1,ct=null,K=null,Q=null}}}function n(){let L=!1,ct=null,K=null,Q=null,ht=null,Rt=null,Xt=null,xe=null,De=null;return{setTest:function(Kt){L||(Kt?ot(i.STENCIL_TEST):ut(i.STENCIL_TEST))},setMask:function(Kt){ct!==Kt&&!L&&(i.stencilMask(Kt),ct=Kt)},setFunc:function(Kt,Vn,An){(K!==Kt||Q!==Vn||ht!==An)&&(i.stencilFunc(Kt,Vn,An),K=Kt,Q=Vn,ht=An)},setOp:function(Kt,Vn,An){(Rt!==Kt||Xt!==Vn||xe!==An)&&(i.stencilOp(Kt,Vn,An),Rt=Kt,Xt=Vn,xe=An)},setLocked:function(Kt){L=Kt},setClear:function(Kt){De!==Kt&&(i.clearStencil(Kt),De=Kt)},reset:function(){L=!1,ct=null,K=null,Q=null,ht=null,Rt=null,Xt=null,xe=null,De=null}}}const s=new t,r=new e,o=new n,a=new WeakMap,c=new WeakMap;let l={},u={},h=new WeakMap,d=[],m=null,_=!1,g=null,p=null,f=null,y=null,x=null,T=null,w=null,E=new Yt(0,0,0),b=0,C=!1,S=null,v=null,R=null,P=null,N=null;const F=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let z=!1,U=0;const B=i.getParameter(i.VERSION);B.indexOf("WebGL")!==-1?(U=parseFloat(/^WebGL (\d)/.exec(B)[1]),z=U>=1):B.indexOf("OpenGL ES")!==-1&&(U=parseFloat(/^OpenGL ES (\d)/.exec(B)[1]),z=U>=2);let V=null,j={};const J=i.getParameter(i.SCISSOR_BOX),nt=i.getParameter(i.VIEWPORT),xt=new Ae().fromArray(J),Ot=new Ae().fromArray(nt);function X(L,ct,K,Q){const ht=new Uint8Array(4),Rt=i.createTexture();i.bindTexture(L,Rt),i.texParameteri(L,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(L,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Xt=0;Xt<K;Xt++)L===i.TEXTURE_3D||L===i.TEXTURE_2D_ARRAY?i.texImage3D(ct,0,i.RGBA,1,1,Q,0,i.RGBA,i.UNSIGNED_BYTE,ht):i.texImage2D(ct+Xt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ht);return Rt}const Y={};Y[i.TEXTURE_2D]=X(i.TEXTURE_2D,i.TEXTURE_2D,1),Y[i.TEXTURE_CUBE_MAP]=X(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Y[i.TEXTURE_2D_ARRAY]=X(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Y[i.TEXTURE_3D]=X(i.TEXTURE_3D,i.TEXTURE_3D,1,1),s.setClear(0,0,0,1),r.setClear(1),o.setClear(0),ot(i.DEPTH_TEST),r.setFunc(pa),rt(!1),it(Fu),ot(i.CULL_FACE),de(_i);function ot(L){l[L]!==!0&&(i.enable(L),l[L]=!0)}function ut(L){l[L]!==!1&&(i.disable(L),l[L]=!1)}function st(L,ct){return u[L]!==ct?(i.bindFramebuffer(L,ct),u[L]=ct,L===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=ct),L===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=ct),!0):!1}function Ct(L,ct){let K=d,Q=!1;if(L){K=h.get(ct),K===void 0&&(K=[],h.set(ct,K));const ht=L.textures;if(K.length!==ht.length||K[0]!==i.COLOR_ATTACHMENT0){for(let Rt=0,Xt=ht.length;Rt<Xt;Rt++)K[Rt]=i.COLOR_ATTACHMENT0+Rt;K.length=ht.length,Q=!0}}else K[0]!==i.BACK&&(K[0]=i.BACK,Q=!0);Q&&i.drawBuffers(K)}function Nt(L){return m!==L?(i.useProgram(L),m=L,!0):!1}const ne={[Ui]:i.FUNC_ADD,[z0]:i.FUNC_SUBTRACT,[G0]:i.FUNC_REVERSE_SUBTRACT};ne[H0]=i.MIN,ne[W0]=i.MAX;const I={[q0]:i.ZERO,[X0]:i.ONE,[Y0]:i.SRC_COLOR,[Nc]:i.SRC_ALPHA,[Q0]:i.SRC_ALPHA_SATURATE,[K0]:i.DST_COLOR,[$0]:i.DST_ALPHA,[j0]:i.ONE_MINUS_SRC_COLOR,[Lc]:i.ONE_MINUS_SRC_ALPHA,[J0]:i.ONE_MINUS_DST_COLOR,[Z0]:i.ONE_MINUS_DST_ALPHA,[tx]:i.CONSTANT_COLOR,[ex]:i.ONE_MINUS_CONSTANT_COLOR,[nx]:i.CONSTANT_ALPHA,[ix]:i.ONE_MINUS_CONSTANT_ALPHA};function de(L,ct,K,Q,ht,Rt,Xt,xe,De,Kt){if(L===_i){_===!0&&(ut(i.BLEND),_=!1);return}if(_===!1&&(ot(i.BLEND),_=!0),L!==V0){if(L!==g||Kt!==C){if((p!==Ui||x!==Ui)&&(i.blendEquation(i.FUNC_ADD),p=Ui,x=Ui),Kt)switch(L){case Ds:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ku:i.blendFunc(i.ONE,i.ONE);break;case Bu:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Vu:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}else switch(L){case Ds:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ku:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case Bu:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Vu:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}f=null,y=null,T=null,w=null,E.set(0,0,0),b=0,g=L,C=Kt}return}ht=ht||ct,Rt=Rt||K,Xt=Xt||Q,(ct!==p||ht!==x)&&(i.blendEquationSeparate(ne[ct],ne[ht]),p=ct,x=ht),(K!==f||Q!==y||Rt!==T||Xt!==w)&&(i.blendFuncSeparate(I[K],I[Q],I[Rt],I[Xt]),f=K,y=Q,T=Rt,w=Xt),(xe.equals(E)===!1||De!==b)&&(i.blendColor(xe.r,xe.g,xe.b,De),E.copy(xe),b=De),g=L,C=!1}function Zt(L,ct){L.side===$n?ut(i.CULL_FACE):ot(i.CULL_FACE);let K=L.side===qe;ct&&(K=!K),rt(K),L.blending===Ds&&L.transparent===!1?de(_i):de(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),r.setFunc(L.depthFunc),r.setTest(L.depthTest),r.setMask(L.depthWrite),s.setMask(L.colorWrite);const Q=L.stencilWrite;o.setTest(Q),Q&&(o.setMask(L.stencilWriteMask),o.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),o.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),_t(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?ot(i.SAMPLE_ALPHA_TO_COVERAGE):ut(i.SAMPLE_ALPHA_TO_COVERAGE)}function rt(L){S!==L&&(L?i.frontFace(i.CW):i.frontFace(i.CCW),S=L)}function it(L){L!==F0?(ot(i.CULL_FACE),L!==v&&(L===Fu?i.cullFace(i.BACK):L===k0?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):ut(i.CULL_FACE),v=L}function Ut(L){L!==R&&(z&&i.lineWidth(L),R=L)}function _t(L,ct,K){L?(ot(i.POLYGON_OFFSET_FILL),(P!==ct||N!==K)&&(i.polygonOffset(ct,K),P=ct,N=K)):ut(i.POLYGON_OFFSET_FILL)}function ft(L){L?ot(i.SCISSOR_TEST):ut(i.SCISSOR_TEST)}function D(L){L===void 0&&(L=i.TEXTURE0+F-1),V!==L&&(i.activeTexture(L),V=L)}function M(L,ct,K){K===void 0&&(V===null?K=i.TEXTURE0+F-1:K=V);let Q=j[K];Q===void 0&&(Q={type:void 0,texture:void 0},j[K]=Q),(Q.type!==L||Q.texture!==ct)&&(V!==K&&(i.activeTexture(K),V=K),i.bindTexture(L,ct||Y[L]),Q.type=L,Q.texture=ct)}function H(){const L=j[V];L!==void 0&&L.type!==void 0&&(i.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function Z(){try{i.compressedTexImage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function et(){try{i.compressedTexImage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function tt(){try{i.texSubImage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function wt(){try{i.texSubImage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function pt(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function vt(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Ft(){try{i.texStorage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function at(){try{i.texStorage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function gt(){try{i.texImage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Ht(){try{i.texImage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function It(L){xt.equals(L)===!1&&(i.scissor(L.x,L.y,L.z,L.w),xt.copy(L))}function yt(L){Ot.equals(L)===!1&&(i.viewport(L.x,L.y,L.z,L.w),Ot.copy(L))}function Lt(L,ct){let K=c.get(ct);K===void 0&&(K=new WeakMap,c.set(ct,K));let Q=K.get(L);Q===void 0&&(Q=i.getUniformBlockIndex(ct,L.name),K.set(L,Q))}function Vt(L,ct){const Q=c.get(ct).get(L);a.get(ct)!==Q&&(i.uniformBlockBinding(ct,Q,L.__bindingPointIndex),a.set(ct,Q))}function ue(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),l={},V=null,j={},u={},h=new WeakMap,d=[],m=null,_=!1,g=null,p=null,f=null,y=null,x=null,T=null,w=null,E=new Yt(0,0,0),b=0,C=!1,S=null,v=null,R=null,P=null,N=null,xt.set(0,0,i.canvas.width,i.canvas.height),Ot.set(0,0,i.canvas.width,i.canvas.height),s.reset(),r.reset(),o.reset()}return{buffers:{color:s,depth:r,stencil:o},enable:ot,disable:ut,bindFramebuffer:st,drawBuffers:Ct,useProgram:Nt,setBlending:de,setMaterial:Zt,setFlipSided:rt,setCullFace:it,setLineWidth:Ut,setPolygonOffset:_t,setScissorTest:ft,activeTexture:D,bindTexture:M,unbindTexture:H,compressedTexImage2D:Z,compressedTexImage3D:et,texImage2D:gt,texImage3D:Ht,updateUBOMapping:Lt,uniformBlockBinding:Vt,texStorage2D:Ft,texStorage3D:at,texSubImage2D:tt,texSubImage3D:wt,compressedTexSubImage2D:pt,compressedTexSubImage3D:vt,scissor:It,viewport:yt,reset:ue}}function Ih(i,t,e,n){const s=PE(n);switch(e){case Jd:return i*t;case tf:return i*t;case ef:return i*t*2;case nf:return i*t/s.components*s.byteLength;case ql:return i*t/s.components*s.byteLength;case sf:return i*t*2/s.components*s.byteLength;case Xl:return i*t*2/s.components*s.byteLength;case Qd:return i*t*3/s.components*s.byteLength;case gn:return i*t*4/s.components*s.byteLength;case Yl:return i*t*4/s.components*s.byteLength;case Ao:case Co:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Ro:case Do:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Vc:case Gc:return Math.max(i,16)*Math.max(t,8)/4;case Bc:case zc:return Math.max(i,8)*Math.max(t,8)/2;case Hc:case Wc:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case qc:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Xc:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Yc:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case jc:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case $c:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case Zc:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case Kc:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Jc:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case Qc:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case tl:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case el:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case nl:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case il:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case sl:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case rl:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case Po:case ol:case al:return Math.ceil(i/4)*Math.ceil(t/4)*16;case rf:case cl:return Math.ceil(i/4)*Math.ceil(t/4)*8;case ll:case ul:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function PE(i){switch(i){case ti:case $d:return{byteLength:1,components:1};case Dr:case Zd:case Gr:return{byteLength:2,components:1};case Hl:case Wl:return{byteLength:2,components:4};case es:case Gl:case Zn:return{byteLength:4,components:1};case Kd:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function IE(i,t,e,n,s,r,o){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Gt,u=new WeakMap;let h;const d=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(D,M){return m?new OffscreenCanvas(D,M):xa("canvas")}function g(D,M,H){let Z=1;const et=ft(D);if((et.width>H||et.height>H)&&(Z=H/Math.max(et.width,et.height)),Z<1)if(typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&D instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&D instanceof ImageBitmap||typeof VideoFrame<"u"&&D instanceof VideoFrame){const tt=Math.floor(Z*et.width),wt=Math.floor(Z*et.height);h===void 0&&(h=_(tt,wt));const pt=M?_(tt,wt):h;return pt.width=tt,pt.height=wt,pt.getContext("2d").drawImage(D,0,0,tt,wt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+et.width+"x"+et.height+") to ("+tt+"x"+wt+")."),pt}else return"data"in D&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+et.width+"x"+et.height+")."),D;return D}function p(D){return D.generateMipmaps&&D.minFilter!==rn&&D.minFilter!==pn}function f(D){i.generateMipmap(D)}function y(D,M,H,Z,et=!1){if(D!==null){if(i[D]!==void 0)return i[D];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+D+"'")}let tt=M;if(M===i.RED&&(H===i.FLOAT&&(tt=i.R32F),H===i.HALF_FLOAT&&(tt=i.R16F),H===i.UNSIGNED_BYTE&&(tt=i.R8)),M===i.RED_INTEGER&&(H===i.UNSIGNED_BYTE&&(tt=i.R8UI),H===i.UNSIGNED_SHORT&&(tt=i.R16UI),H===i.UNSIGNED_INT&&(tt=i.R32UI),H===i.BYTE&&(tt=i.R8I),H===i.SHORT&&(tt=i.R16I),H===i.INT&&(tt=i.R32I)),M===i.RG&&(H===i.FLOAT&&(tt=i.RG32F),H===i.HALF_FLOAT&&(tt=i.RG16F),H===i.UNSIGNED_BYTE&&(tt=i.RG8)),M===i.RG_INTEGER&&(H===i.UNSIGNED_BYTE&&(tt=i.RG8UI),H===i.UNSIGNED_SHORT&&(tt=i.RG16UI),H===i.UNSIGNED_INT&&(tt=i.RG32UI),H===i.BYTE&&(tt=i.RG8I),H===i.SHORT&&(tt=i.RG16I),H===i.INT&&(tt=i.RG32I)),M===i.RGB&&H===i.UNSIGNED_INT_5_9_9_9_REV&&(tt=i.RGB9_E5),M===i.RGBA){const wt=et?ma:ee.getTransfer(Z);H===i.FLOAT&&(tt=i.RGBA32F),H===i.HALF_FLOAT&&(tt=i.RGBA16F),H===i.UNSIGNED_BYTE&&(tt=wt===ae?i.SRGB8_ALPHA8:i.RGBA8),H===i.UNSIGNED_SHORT_4_4_4_4&&(tt=i.RGBA4),H===i.UNSIGNED_SHORT_5_5_5_1&&(tt=i.RGB5_A1)}return(tt===i.R16F||tt===i.R32F||tt===i.RG16F||tt===i.RG32F||tt===i.RGBA16F||tt===i.RGBA32F)&&t.get("EXT_color_buffer_float"),tt}function x(D,M){let H;return D?M===null||M===es||M===Xs?H=i.DEPTH24_STENCIL8:M===Zn?H=i.DEPTH32F_STENCIL8:M===Dr&&(H=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===es||M===Xs?H=i.DEPTH_COMPONENT24:M===Zn?H=i.DEPTH_COMPONENT32F:M===Dr&&(H=i.DEPTH_COMPONENT16),H}function T(D,M){return p(D)===!0||D.isFramebufferTexture&&D.minFilter!==rn&&D.minFilter!==pn?Math.log2(Math.max(M.width,M.height))+1:D.mipmaps!==void 0&&D.mipmaps.length>0?D.mipmaps.length:D.isCompressedTexture&&Array.isArray(D.image)?M.mipmaps.length:1}function w(D){const M=D.target;M.removeEventListener("dispose",w),b(M),M.isVideoTexture&&u.delete(M)}function E(D){const M=D.target;M.removeEventListener("dispose",E),S(M)}function b(D){const M=n.get(D);if(M.__webglInit===void 0)return;const H=D.source,Z=d.get(H);if(Z){const et=Z[M.__cacheKey];et.usedTimes--,et.usedTimes===0&&C(D),Object.keys(Z).length===0&&d.delete(H)}n.remove(D)}function C(D){const M=n.get(D);i.deleteTexture(M.__webglTexture);const H=D.source,Z=d.get(H);delete Z[M.__cacheKey],o.memory.textures--}function S(D){const M=n.get(D);if(D.depthTexture&&D.depthTexture.dispose(),D.isWebGLCubeRenderTarget)for(let Z=0;Z<6;Z++){if(Array.isArray(M.__webglFramebuffer[Z]))for(let et=0;et<M.__webglFramebuffer[Z].length;et++)i.deleteFramebuffer(M.__webglFramebuffer[Z][et]);else i.deleteFramebuffer(M.__webglFramebuffer[Z]);M.__webglDepthbuffer&&i.deleteRenderbuffer(M.__webglDepthbuffer[Z])}else{if(Array.isArray(M.__webglFramebuffer))for(let Z=0;Z<M.__webglFramebuffer.length;Z++)i.deleteFramebuffer(M.__webglFramebuffer[Z]);else i.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&i.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&i.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let Z=0;Z<M.__webglColorRenderbuffer.length;Z++)M.__webglColorRenderbuffer[Z]&&i.deleteRenderbuffer(M.__webglColorRenderbuffer[Z]);M.__webglDepthRenderbuffer&&i.deleteRenderbuffer(M.__webglDepthRenderbuffer)}const H=D.textures;for(let Z=0,et=H.length;Z<et;Z++){const tt=n.get(H[Z]);tt.__webglTexture&&(i.deleteTexture(tt.__webglTexture),o.memory.textures--),n.remove(H[Z])}n.remove(D)}let v=0;function R(){v=0}function P(){const D=v;return D>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+D+" texture units while this GPU supports only "+s.maxTextures),v+=1,D}function N(D){const M=[];return M.push(D.wrapS),M.push(D.wrapT),M.push(D.wrapR||0),M.push(D.magFilter),M.push(D.minFilter),M.push(D.anisotropy),M.push(D.internalFormat),M.push(D.format),M.push(D.type),M.push(D.generateMipmaps),M.push(D.premultiplyAlpha),M.push(D.flipY),M.push(D.unpackAlignment),M.push(D.colorSpace),M.join()}function F(D,M){const H=n.get(D);if(D.isVideoTexture&&Ut(D),D.isRenderTargetTexture===!1&&D.version>0&&H.__version!==D.version){const Z=D.image;if(Z===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Z.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Ot(H,D,M);return}}e.bindTexture(i.TEXTURE_2D,H.__webglTexture,i.TEXTURE0+M)}function z(D,M){const H=n.get(D);if(D.version>0&&H.__version!==D.version){Ot(H,D,M);return}e.bindTexture(i.TEXTURE_2D_ARRAY,H.__webglTexture,i.TEXTURE0+M)}function U(D,M){const H=n.get(D);if(D.version>0&&H.__version!==D.version){Ot(H,D,M);return}e.bindTexture(i.TEXTURE_3D,H.__webglTexture,i.TEXTURE0+M)}function B(D,M){const H=n.get(D);if(D.version>0&&H.__version!==D.version){X(H,D,M);return}e.bindTexture(i.TEXTURE_CUBE_MAP,H.__webglTexture,i.TEXTURE0+M)}const V={[Fc]:i.REPEAT,[Vi]:i.CLAMP_TO_EDGE,[kc]:i.MIRRORED_REPEAT},j={[rn]:i.NEAREST,[yx]:i.NEAREST_MIPMAP_NEAREST,[Qr]:i.NEAREST_MIPMAP_LINEAR,[pn]:i.LINEAR,[Za]:i.LINEAR_MIPMAP_NEAREST,[zi]:i.LINEAR_MIPMAP_LINEAR},J={[Ex]:i.NEVER,[Dx]:i.ALWAYS,[bx]:i.LESS,[af]:i.LEQUAL,[wx]:i.EQUAL,[Rx]:i.GEQUAL,[Ax]:i.GREATER,[Cx]:i.NOTEQUAL};function nt(D,M){if(M.type===Zn&&t.has("OES_texture_float_linear")===!1&&(M.magFilter===pn||M.magFilter===Za||M.magFilter===Qr||M.magFilter===zi||M.minFilter===pn||M.minFilter===Za||M.minFilter===Qr||M.minFilter===zi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(D,i.TEXTURE_WRAP_S,V[M.wrapS]),i.texParameteri(D,i.TEXTURE_WRAP_T,V[M.wrapT]),(D===i.TEXTURE_3D||D===i.TEXTURE_2D_ARRAY)&&i.texParameteri(D,i.TEXTURE_WRAP_R,V[M.wrapR]),i.texParameteri(D,i.TEXTURE_MAG_FILTER,j[M.magFilter]),i.texParameteri(D,i.TEXTURE_MIN_FILTER,j[M.minFilter]),M.compareFunction&&(i.texParameteri(D,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(D,i.TEXTURE_COMPARE_FUNC,J[M.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===rn||M.minFilter!==Qr&&M.minFilter!==zi||M.type===Zn&&t.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||n.get(M).__currentAnisotropy){const H=t.get("EXT_texture_filter_anisotropic");i.texParameterf(D,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,s.getMaxAnisotropy())),n.get(M).__currentAnisotropy=M.anisotropy}}}function xt(D,M){let H=!1;D.__webglInit===void 0&&(D.__webglInit=!0,M.addEventListener("dispose",w));const Z=M.source;let et=d.get(Z);et===void 0&&(et={},d.set(Z,et));const tt=N(M);if(tt!==D.__cacheKey){et[tt]===void 0&&(et[tt]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,H=!0),et[tt].usedTimes++;const wt=et[D.__cacheKey];wt!==void 0&&(et[D.__cacheKey].usedTimes--,wt.usedTimes===0&&C(M)),D.__cacheKey=tt,D.__webglTexture=et[tt].texture}return H}function Ot(D,M,H){let Z=i.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(Z=i.TEXTURE_2D_ARRAY),M.isData3DTexture&&(Z=i.TEXTURE_3D);const et=xt(D,M),tt=M.source;e.bindTexture(Z,D.__webglTexture,i.TEXTURE0+H);const wt=n.get(tt);if(tt.version!==wt.__version||et===!0){e.activeTexture(i.TEXTURE0+H);const pt=ee.getPrimaries(ee.workingColorSpace),vt=M.colorSpace===pi?null:ee.getPrimaries(M.colorSpace),Ft=M.colorSpace===pi||pt===vt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,M.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,M.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ft);let at=g(M.image,!1,s.maxTextureSize);at=_t(M,at);const gt=r.convert(M.format,M.colorSpace),Ht=r.convert(M.type);let It=y(M.internalFormat,gt,Ht,M.colorSpace,M.isVideoTexture);nt(Z,M);let yt;const Lt=M.mipmaps,Vt=M.isVideoTexture!==!0,ue=wt.__version===void 0||et===!0,L=tt.dataReady,ct=T(M,at);if(M.isDepthTexture)It=x(M.format===Ys,M.type),ue&&(Vt?e.texStorage2D(i.TEXTURE_2D,1,It,at.width,at.height):e.texImage2D(i.TEXTURE_2D,0,It,at.width,at.height,0,gt,Ht,null));else if(M.isDataTexture)if(Lt.length>0){Vt&&ue&&e.texStorage2D(i.TEXTURE_2D,ct,It,Lt[0].width,Lt[0].height);for(let K=0,Q=Lt.length;K<Q;K++)yt=Lt[K],Vt?L&&e.texSubImage2D(i.TEXTURE_2D,K,0,0,yt.width,yt.height,gt,Ht,yt.data):e.texImage2D(i.TEXTURE_2D,K,It,yt.width,yt.height,0,gt,Ht,yt.data);M.generateMipmaps=!1}else Vt?(ue&&e.texStorage2D(i.TEXTURE_2D,ct,It,at.width,at.height),L&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,at.width,at.height,gt,Ht,at.data)):e.texImage2D(i.TEXTURE_2D,0,It,at.width,at.height,0,gt,Ht,at.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){Vt&&ue&&e.texStorage3D(i.TEXTURE_2D_ARRAY,ct,It,Lt[0].width,Lt[0].height,at.depth);for(let K=0,Q=Lt.length;K<Q;K++)if(yt=Lt[K],M.format!==gn)if(gt!==null)if(Vt){if(L)if(M.layerUpdates.size>0){const ht=Ih(yt.width,yt.height,M.format,M.type);for(const Rt of M.layerUpdates){const Xt=yt.data.subarray(Rt*ht/yt.data.BYTES_PER_ELEMENT,(Rt+1)*ht/yt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,K,0,0,Rt,yt.width,yt.height,1,gt,Xt,0,0)}M.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,K,0,0,0,yt.width,yt.height,at.depth,gt,yt.data,0,0)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,K,It,yt.width,yt.height,at.depth,0,yt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Vt?L&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,K,0,0,0,yt.width,yt.height,at.depth,gt,Ht,yt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,K,It,yt.width,yt.height,at.depth,0,gt,Ht,yt.data)}else{Vt&&ue&&e.texStorage2D(i.TEXTURE_2D,ct,It,Lt[0].width,Lt[0].height);for(let K=0,Q=Lt.length;K<Q;K++)yt=Lt[K],M.format!==gn?gt!==null?Vt?L&&e.compressedTexSubImage2D(i.TEXTURE_2D,K,0,0,yt.width,yt.height,gt,yt.data):e.compressedTexImage2D(i.TEXTURE_2D,K,It,yt.width,yt.height,0,yt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Vt?L&&e.texSubImage2D(i.TEXTURE_2D,K,0,0,yt.width,yt.height,gt,Ht,yt.data):e.texImage2D(i.TEXTURE_2D,K,It,yt.width,yt.height,0,gt,Ht,yt.data)}else if(M.isDataArrayTexture)if(Vt){if(ue&&e.texStorage3D(i.TEXTURE_2D_ARRAY,ct,It,at.width,at.height,at.depth),L)if(M.layerUpdates.size>0){const K=Ih(at.width,at.height,M.format,M.type);for(const Q of M.layerUpdates){const ht=at.data.subarray(Q*K/at.data.BYTES_PER_ELEMENT,(Q+1)*K/at.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,Q,at.width,at.height,1,gt,Ht,ht)}M.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,at.width,at.height,at.depth,gt,Ht,at.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,It,at.width,at.height,at.depth,0,gt,Ht,at.data);else if(M.isData3DTexture)Vt?(ue&&e.texStorage3D(i.TEXTURE_3D,ct,It,at.width,at.height,at.depth),L&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,at.width,at.height,at.depth,gt,Ht,at.data)):e.texImage3D(i.TEXTURE_3D,0,It,at.width,at.height,at.depth,0,gt,Ht,at.data);else if(M.isFramebufferTexture){if(ue)if(Vt)e.texStorage2D(i.TEXTURE_2D,ct,It,at.width,at.height);else{let K=at.width,Q=at.height;for(let ht=0;ht<ct;ht++)e.texImage2D(i.TEXTURE_2D,ht,It,K,Q,0,gt,Ht,null),K>>=1,Q>>=1}}else if(Lt.length>0){if(Vt&&ue){const K=ft(Lt[0]);e.texStorage2D(i.TEXTURE_2D,ct,It,K.width,K.height)}for(let K=0,Q=Lt.length;K<Q;K++)yt=Lt[K],Vt?L&&e.texSubImage2D(i.TEXTURE_2D,K,0,0,gt,Ht,yt):e.texImage2D(i.TEXTURE_2D,K,It,gt,Ht,yt);M.generateMipmaps=!1}else if(Vt){if(ue){const K=ft(at);e.texStorage2D(i.TEXTURE_2D,ct,It,K.width,K.height)}L&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,gt,Ht,at)}else e.texImage2D(i.TEXTURE_2D,0,It,gt,Ht,at);p(M)&&f(Z),wt.__version=tt.version,M.onUpdate&&M.onUpdate(M)}D.__version=M.version}function X(D,M,H){if(M.image.length!==6)return;const Z=xt(D,M),et=M.source;e.bindTexture(i.TEXTURE_CUBE_MAP,D.__webglTexture,i.TEXTURE0+H);const tt=n.get(et);if(et.version!==tt.__version||Z===!0){e.activeTexture(i.TEXTURE0+H);const wt=ee.getPrimaries(ee.workingColorSpace),pt=M.colorSpace===pi?null:ee.getPrimaries(M.colorSpace),vt=M.colorSpace===pi||wt===pt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,M.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,M.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,vt);const Ft=M.isCompressedTexture||M.image[0].isCompressedTexture,at=M.image[0]&&M.image[0].isDataTexture,gt=[];for(let Q=0;Q<6;Q++)!Ft&&!at?gt[Q]=g(M.image[Q],!0,s.maxCubemapSize):gt[Q]=at?M.image[Q].image:M.image[Q],gt[Q]=_t(M,gt[Q]);const Ht=gt[0],It=r.convert(M.format,M.colorSpace),yt=r.convert(M.type),Lt=y(M.internalFormat,It,yt,M.colorSpace),Vt=M.isVideoTexture!==!0,ue=tt.__version===void 0||Z===!0,L=et.dataReady;let ct=T(M,Ht);nt(i.TEXTURE_CUBE_MAP,M);let K;if(Ft){Vt&&ue&&e.texStorage2D(i.TEXTURE_CUBE_MAP,ct,Lt,Ht.width,Ht.height);for(let Q=0;Q<6;Q++){K=gt[Q].mipmaps;for(let ht=0;ht<K.length;ht++){const Rt=K[ht];M.format!==gn?It!==null?Vt?L&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ht,0,0,Rt.width,Rt.height,It,Rt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ht,Lt,Rt.width,Rt.height,0,Rt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Vt?L&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ht,0,0,Rt.width,Rt.height,It,yt,Rt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ht,Lt,Rt.width,Rt.height,0,It,yt,Rt.data)}}}else{if(K=M.mipmaps,Vt&&ue){K.length>0&&ct++;const Q=ft(gt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,ct,Lt,Q.width,Q.height)}for(let Q=0;Q<6;Q++)if(at){Vt?L&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,gt[Q].width,gt[Q].height,It,yt,gt[Q].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,Lt,gt[Q].width,gt[Q].height,0,It,yt,gt[Q].data);for(let ht=0;ht<K.length;ht++){const Xt=K[ht].image[Q].image;Vt?L&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ht+1,0,0,Xt.width,Xt.height,It,yt,Xt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ht+1,Lt,Xt.width,Xt.height,0,It,yt,Xt.data)}}else{Vt?L&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,It,yt,gt[Q]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,Lt,It,yt,gt[Q]);for(let ht=0;ht<K.length;ht++){const Rt=K[ht];Vt?L&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ht+1,0,0,It,yt,Rt.image[Q]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ht+1,Lt,It,yt,Rt.image[Q])}}}p(M)&&f(i.TEXTURE_CUBE_MAP),tt.__version=et.version,M.onUpdate&&M.onUpdate(M)}D.__version=M.version}function Y(D,M,H,Z,et,tt){const wt=r.convert(H.format,H.colorSpace),pt=r.convert(H.type),vt=y(H.internalFormat,wt,pt,H.colorSpace);if(!n.get(M).__hasExternalTextures){const at=Math.max(1,M.width>>tt),gt=Math.max(1,M.height>>tt);et===i.TEXTURE_3D||et===i.TEXTURE_2D_ARRAY?e.texImage3D(et,tt,vt,at,gt,M.depth,0,wt,pt,null):e.texImage2D(et,tt,vt,at,gt,0,wt,pt,null)}e.bindFramebuffer(i.FRAMEBUFFER,D),it(M)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Z,et,n.get(H).__webglTexture,0,rt(M)):(et===i.TEXTURE_2D||et>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&et<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,Z,et,n.get(H).__webglTexture,tt),e.bindFramebuffer(i.FRAMEBUFFER,null)}function ot(D,M,H){if(i.bindRenderbuffer(i.RENDERBUFFER,D),M.depthBuffer){const Z=M.depthTexture,et=Z&&Z.isDepthTexture?Z.type:null,tt=x(M.stencilBuffer,et),wt=M.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,pt=rt(M);it(M)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,pt,tt,M.width,M.height):H?i.renderbufferStorageMultisample(i.RENDERBUFFER,pt,tt,M.width,M.height):i.renderbufferStorage(i.RENDERBUFFER,tt,M.width,M.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,wt,i.RENDERBUFFER,D)}else{const Z=M.textures;for(let et=0;et<Z.length;et++){const tt=Z[et],wt=r.convert(tt.format,tt.colorSpace),pt=r.convert(tt.type),vt=y(tt.internalFormat,wt,pt,tt.colorSpace),Ft=rt(M);H&&it(M)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Ft,vt,M.width,M.height):it(M)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Ft,vt,M.width,M.height):i.renderbufferStorage(i.RENDERBUFFER,vt,M.width,M.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function ut(D,M){if(M&&M.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,D),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(M.depthTexture).__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),F(M.depthTexture,0);const Z=n.get(M.depthTexture).__webglTexture,et=rt(M);if(M.depthTexture.format===Ps)it(M)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,Z,0,et):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,Z,0);else if(M.depthTexture.format===Ys)it(M)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,Z,0,et):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,Z,0);else throw new Error("Unknown depthTexture format")}function st(D){const M=n.get(D),H=D.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==D.depthTexture){const Z=D.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),Z){const et=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,Z.removeEventListener("dispose",et)};Z.addEventListener("dispose",et),M.__depthDisposeCallback=et}M.__boundDepthTexture=Z}if(D.depthTexture&&!M.__autoAllocateDepthBuffer){if(H)throw new Error("target.depthTexture not supported in Cube render targets");ut(M.__webglFramebuffer,D)}else if(H){M.__webglDepthbuffer=[];for(let Z=0;Z<6;Z++)if(e.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer[Z]),M.__webglDepthbuffer[Z]===void 0)M.__webglDepthbuffer[Z]=i.createRenderbuffer(),ot(M.__webglDepthbuffer[Z],D,!1);else{const et=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,tt=M.__webglDepthbuffer[Z];i.bindRenderbuffer(i.RENDERBUFFER,tt),i.framebufferRenderbuffer(i.FRAMEBUFFER,et,i.RENDERBUFFER,tt)}}else if(e.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=i.createRenderbuffer(),ot(M.__webglDepthbuffer,D,!1);else{const Z=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,et=M.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,et),i.framebufferRenderbuffer(i.FRAMEBUFFER,Z,i.RENDERBUFFER,et)}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Ct(D,M,H){const Z=n.get(D);M!==void 0&&Y(Z.__webglFramebuffer,D,D.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),H!==void 0&&st(D)}function Nt(D){const M=D.texture,H=n.get(D),Z=n.get(M);D.addEventListener("dispose",E);const et=D.textures,tt=D.isWebGLCubeRenderTarget===!0,wt=et.length>1;if(wt||(Z.__webglTexture===void 0&&(Z.__webglTexture=i.createTexture()),Z.__version=M.version,o.memory.textures++),tt){H.__webglFramebuffer=[];for(let pt=0;pt<6;pt++)if(M.mipmaps&&M.mipmaps.length>0){H.__webglFramebuffer[pt]=[];for(let vt=0;vt<M.mipmaps.length;vt++)H.__webglFramebuffer[pt][vt]=i.createFramebuffer()}else H.__webglFramebuffer[pt]=i.createFramebuffer()}else{if(M.mipmaps&&M.mipmaps.length>0){H.__webglFramebuffer=[];for(let pt=0;pt<M.mipmaps.length;pt++)H.__webglFramebuffer[pt]=i.createFramebuffer()}else H.__webglFramebuffer=i.createFramebuffer();if(wt)for(let pt=0,vt=et.length;pt<vt;pt++){const Ft=n.get(et[pt]);Ft.__webglTexture===void 0&&(Ft.__webglTexture=i.createTexture(),o.memory.textures++)}if(D.samples>0&&it(D)===!1){H.__webglMultisampledFramebuffer=i.createFramebuffer(),H.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let pt=0;pt<et.length;pt++){const vt=et[pt];H.__webglColorRenderbuffer[pt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,H.__webglColorRenderbuffer[pt]);const Ft=r.convert(vt.format,vt.colorSpace),at=r.convert(vt.type),gt=y(vt.internalFormat,Ft,at,vt.colorSpace,D.isXRRenderTarget===!0),Ht=rt(D);i.renderbufferStorageMultisample(i.RENDERBUFFER,Ht,gt,D.width,D.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+pt,i.RENDERBUFFER,H.__webglColorRenderbuffer[pt])}i.bindRenderbuffer(i.RENDERBUFFER,null),D.depthBuffer&&(H.__webglDepthRenderbuffer=i.createRenderbuffer(),ot(H.__webglDepthRenderbuffer,D,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(tt){e.bindTexture(i.TEXTURE_CUBE_MAP,Z.__webglTexture),nt(i.TEXTURE_CUBE_MAP,M);for(let pt=0;pt<6;pt++)if(M.mipmaps&&M.mipmaps.length>0)for(let vt=0;vt<M.mipmaps.length;vt++)Y(H.__webglFramebuffer[pt][vt],D,M,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+pt,vt);else Y(H.__webglFramebuffer[pt],D,M,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+pt,0);p(M)&&f(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(wt){for(let pt=0,vt=et.length;pt<vt;pt++){const Ft=et[pt],at=n.get(Ft);e.bindTexture(i.TEXTURE_2D,at.__webglTexture),nt(i.TEXTURE_2D,Ft),Y(H.__webglFramebuffer,D,Ft,i.COLOR_ATTACHMENT0+pt,i.TEXTURE_2D,0),p(Ft)&&f(i.TEXTURE_2D)}e.unbindTexture()}else{let pt=i.TEXTURE_2D;if((D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(pt=D.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(pt,Z.__webglTexture),nt(pt,M),M.mipmaps&&M.mipmaps.length>0)for(let vt=0;vt<M.mipmaps.length;vt++)Y(H.__webglFramebuffer[vt],D,M,i.COLOR_ATTACHMENT0,pt,vt);else Y(H.__webglFramebuffer,D,M,i.COLOR_ATTACHMENT0,pt,0);p(M)&&f(pt),e.unbindTexture()}D.depthBuffer&&st(D)}function ne(D){const M=D.textures;for(let H=0,Z=M.length;H<Z;H++){const et=M[H];if(p(et)){const tt=D.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,wt=n.get(et).__webglTexture;e.bindTexture(tt,wt),f(tt),e.unbindTexture()}}}const I=[],de=[];function Zt(D){if(D.samples>0){if(it(D)===!1){const M=D.textures,H=D.width,Z=D.height;let et=i.COLOR_BUFFER_BIT;const tt=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,wt=n.get(D),pt=M.length>1;if(pt)for(let vt=0;vt<M.length;vt++)e.bindFramebuffer(i.FRAMEBUFFER,wt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+vt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,wt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+vt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,wt.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,wt.__webglFramebuffer);for(let vt=0;vt<M.length;vt++){if(D.resolveDepthBuffer&&(D.depthBuffer&&(et|=i.DEPTH_BUFFER_BIT),D.stencilBuffer&&D.resolveStencilBuffer&&(et|=i.STENCIL_BUFFER_BIT)),pt){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,wt.__webglColorRenderbuffer[vt]);const Ft=n.get(M[vt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Ft,0)}i.blitFramebuffer(0,0,H,Z,0,0,H,Z,et,i.NEAREST),c===!0&&(I.length=0,de.length=0,I.push(i.COLOR_ATTACHMENT0+vt),D.depthBuffer&&D.resolveDepthBuffer===!1&&(I.push(tt),de.push(tt),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,de)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,I))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),pt)for(let vt=0;vt<M.length;vt++){e.bindFramebuffer(i.FRAMEBUFFER,wt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+vt,i.RENDERBUFFER,wt.__webglColorRenderbuffer[vt]);const Ft=n.get(M[vt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,wt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+vt,i.TEXTURE_2D,Ft,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,wt.__webglMultisampledFramebuffer)}else if(D.depthBuffer&&D.resolveDepthBuffer===!1&&c){const M=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[M])}}}function rt(D){return Math.min(s.maxSamples,D.samples)}function it(D){const M=n.get(D);return D.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function Ut(D){const M=o.render.frame;u.get(D)!==M&&(u.set(D,M),D.update())}function _t(D,M){const H=D.colorSpace,Z=D.format,et=D.type;return D.isCompressedTexture===!0||D.isVideoTexture===!0||H!==bi&&H!==pi&&(ee.getTransfer(H)===ae?(Z!==gn||et!==ti)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",H)),M}function ft(D){return typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement?(l.width=D.naturalWidth||D.width,l.height=D.naturalHeight||D.height):typeof VideoFrame<"u"&&D instanceof VideoFrame?(l.width=D.displayWidth,l.height=D.displayHeight):(l.width=D.width,l.height=D.height),l}this.allocateTextureUnit=P,this.resetTextureUnits=R,this.setTexture2D=F,this.setTexture2DArray=z,this.setTexture3D=U,this.setTextureCube=B,this.rebindTextures=Ct,this.setupRenderTarget=Nt,this.updateRenderTargetMipmap=ne,this.updateMultisampleRenderTarget=Zt,this.setupDepthRenderbuffer=st,this.setupFrameBufferTexture=Y,this.useMultisampledRTT=it}function NE(i,t){function e(n,s=pi){let r;const o=ee.getTransfer(s);if(n===ti)return i.UNSIGNED_BYTE;if(n===Hl)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Wl)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Kd)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===$d)return i.BYTE;if(n===Zd)return i.SHORT;if(n===Dr)return i.UNSIGNED_SHORT;if(n===Gl)return i.INT;if(n===es)return i.UNSIGNED_INT;if(n===Zn)return i.FLOAT;if(n===Gr)return i.HALF_FLOAT;if(n===Jd)return i.ALPHA;if(n===Qd)return i.RGB;if(n===gn)return i.RGBA;if(n===tf)return i.LUMINANCE;if(n===ef)return i.LUMINANCE_ALPHA;if(n===Ps)return i.DEPTH_COMPONENT;if(n===Ys)return i.DEPTH_STENCIL;if(n===nf)return i.RED;if(n===ql)return i.RED_INTEGER;if(n===sf)return i.RG;if(n===Xl)return i.RG_INTEGER;if(n===Yl)return i.RGBA_INTEGER;if(n===Ao||n===Co||n===Ro||n===Do)if(o===ae)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Ao)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Co)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Ro)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Do)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Ao)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Co)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Ro)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Do)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Bc||n===Vc||n===zc||n===Gc)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Bc)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Vc)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===zc)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Gc)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Hc||n===Wc||n===qc)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Hc||n===Wc)return o===ae?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===qc)return o===ae?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Xc||n===Yc||n===jc||n===$c||n===Zc||n===Kc||n===Jc||n===Qc||n===tl||n===el||n===nl||n===il||n===sl||n===rl)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Xc)return o===ae?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Yc)return o===ae?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===jc)return o===ae?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===$c)return o===ae?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Zc)return o===ae?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Kc)return o===ae?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Jc)return o===ae?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Qc)return o===ae?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===tl)return o===ae?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===el)return o===ae?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===nl)return o===ae?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===il)return o===ae?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===sl)return o===ae?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===rl)return o===ae?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Po||n===ol||n===al)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===Po)return o===ae?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===ol)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===al)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===rf||n===cl||n===ll||n===ul)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===Po)return r.COMPRESSED_RED_RGTC1_EXT;if(n===cl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===ll)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===ul)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Xs?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}class LE extends sn{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class hr extends Ve{constructor(){super(),this.isGroup=!0,this.type="Group"}}const OE={type:"move"};class Tc{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new hr,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new hr,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new G,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new G),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new hr,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new G,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new G),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null;const a=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){o=!0;for(const g of t.hand.values()){const p=e.getJointPose(g,n),f=this._getHandJoint(l,g);p!==null&&(f.matrix.fromArray(p.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=p.radius),f.visible=p!==null}const u=l.joints["index-finger-tip"],h=l.joints["thumb-tip"],d=u.position.distanceTo(h.position),m=.02,_=.005;l.inputState.pinching&&d>m+_?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&d<=m-_&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(OE)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new hr;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const UE=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,FE=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class kE{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){const s=new Xe,r=t.properties.get(s);r.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Mi({vertexShader:UE,fragmentShader:FE,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new vn(new Ba(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class BE extends tr{constructor(t,e){super();const n=this;let s=null,r=1,o=null,a="local-floor",c=1,l=null,u=null,h=null,d=null,m=null,_=null;const g=new kE,p=e.getContextAttributes();let f=null,y=null;const x=[],T=[],w=new Gt;let E=null;const b=new sn;b.layers.enable(1),b.viewport=new Ae;const C=new sn;C.layers.enable(2),C.viewport=new Ae;const S=[b,C],v=new LE;v.layers.enable(1),v.layers.enable(2);let R=null,P=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(X){let Y=x[X];return Y===void 0&&(Y=new Tc,x[X]=Y),Y.getTargetRaySpace()},this.getControllerGrip=function(X){let Y=x[X];return Y===void 0&&(Y=new Tc,x[X]=Y),Y.getGripSpace()},this.getHand=function(X){let Y=x[X];return Y===void 0&&(Y=new Tc,x[X]=Y),Y.getHandSpace()};function N(X){const Y=T.indexOf(X.inputSource);if(Y===-1)return;const ot=x[Y];ot!==void 0&&(ot.update(X.inputSource,X.frame,l||o),ot.dispatchEvent({type:X.type,data:X.inputSource}))}function F(){s.removeEventListener("select",N),s.removeEventListener("selectstart",N),s.removeEventListener("selectend",N),s.removeEventListener("squeeze",N),s.removeEventListener("squeezestart",N),s.removeEventListener("squeezeend",N),s.removeEventListener("end",F),s.removeEventListener("inputsourceschange",z);for(let X=0;X<x.length;X++){const Y=T[X];Y!==null&&(T[X]=null,x[X].disconnect(Y))}R=null,P=null,g.reset(),t.setRenderTarget(f),m=null,d=null,h=null,s=null,y=null,Ot.stop(),n.isPresenting=!1,t.setPixelRatio(E),t.setSize(w.width,w.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(X){r=X,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(X){a=X,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(X){l=X},this.getBaseLayer=function(){return d!==null?d:m},this.getBinding=function(){return h},this.getFrame=function(){return _},this.getSession=function(){return s},this.setSession=async function(X){if(s=X,s!==null){if(f=t.getRenderTarget(),s.addEventListener("select",N),s.addEventListener("selectstart",N),s.addEventListener("selectend",N),s.addEventListener("squeeze",N),s.addEventListener("squeezestart",N),s.addEventListener("squeezeend",N),s.addEventListener("end",F),s.addEventListener("inputsourceschange",z),p.xrCompatible!==!0&&await e.makeXRCompatible(),E=t.getPixelRatio(),t.getSize(w),s.renderState.layers===void 0){const Y={antialias:p.antialias,alpha:!0,depth:p.depth,stencil:p.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(s,e,Y),s.updateRenderState({baseLayer:m}),t.setPixelRatio(1),t.setSize(m.framebufferWidth,m.framebufferHeight,!1),y=new ns(m.framebufferWidth,m.framebufferHeight,{format:gn,type:ti,colorSpace:t.outputColorSpace,stencilBuffer:p.stencil})}else{let Y=null,ot=null,ut=null;p.depth&&(ut=p.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,Y=p.stencil?Ys:Ps,ot=p.stencil?Xs:es);const st={colorFormat:e.RGBA8,depthFormat:ut,scaleFactor:r};h=new XRWebGLBinding(s,e),d=h.createProjectionLayer(st),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),y=new ns(d.textureWidth,d.textureHeight,{format:gn,type:ti,depthTexture:new Mf(d.textureWidth,d.textureHeight,ot,void 0,void 0,void 0,void 0,void 0,void 0,Y),stencilBuffer:p.stencil,colorSpace:t.outputColorSpace,samples:p.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await s.requestReferenceSpace(a),Ot.setContext(s),Ot.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function z(X){for(let Y=0;Y<X.removed.length;Y++){const ot=X.removed[Y],ut=T.indexOf(ot);ut>=0&&(T[ut]=null,x[ut].disconnect(ot))}for(let Y=0;Y<X.added.length;Y++){const ot=X.added[Y];let ut=T.indexOf(ot);if(ut===-1){for(let Ct=0;Ct<x.length;Ct++)if(Ct>=T.length){T.push(ot),ut=Ct;break}else if(T[Ct]===null){T[Ct]=ot,ut=Ct;break}if(ut===-1)break}const st=x[ut];st&&st.connect(ot)}}const U=new G,B=new G;function V(X,Y,ot){U.setFromMatrixPosition(Y.matrixWorld),B.setFromMatrixPosition(ot.matrixWorld);const ut=U.distanceTo(B),st=Y.projectionMatrix.elements,Ct=ot.projectionMatrix.elements,Nt=st[14]/(st[10]-1),ne=st[14]/(st[10]+1),I=(st[9]+1)/st[5],de=(st[9]-1)/st[5],Zt=(st[8]-1)/st[0],rt=(Ct[8]+1)/Ct[0],it=Nt*Zt,Ut=Nt*rt,_t=ut/(-Zt+rt),ft=_t*-Zt;if(Y.matrixWorld.decompose(X.position,X.quaternion,X.scale),X.translateX(ft),X.translateZ(_t),X.matrixWorld.compose(X.position,X.quaternion,X.scale),X.matrixWorldInverse.copy(X.matrixWorld).invert(),st[10]===-1)X.projectionMatrix.copy(Y.projectionMatrix),X.projectionMatrixInverse.copy(Y.projectionMatrixInverse);else{const D=Nt+_t,M=ne+_t,H=it-ft,Z=Ut+(ut-ft),et=I*ne/M*D,tt=de*ne/M*D;X.projectionMatrix.makePerspective(H,Z,et,tt,D,M),X.projectionMatrixInverse.copy(X.projectionMatrix).invert()}}function j(X,Y){Y===null?X.matrixWorld.copy(X.matrix):X.matrixWorld.multiplyMatrices(Y.matrixWorld,X.matrix),X.matrixWorldInverse.copy(X.matrixWorld).invert()}this.updateCamera=function(X){if(s===null)return;let Y=X.near,ot=X.far;g.texture!==null&&(g.depthNear>0&&(Y=g.depthNear),g.depthFar>0&&(ot=g.depthFar)),v.near=C.near=b.near=Y,v.far=C.far=b.far=ot,(R!==v.near||P!==v.far)&&(s.updateRenderState({depthNear:v.near,depthFar:v.far}),R=v.near,P=v.far);const ut=X.parent,st=v.cameras;j(v,ut);for(let Ct=0;Ct<st.length;Ct++)j(st[Ct],ut);st.length===2?V(v,b,C):v.projectionMatrix.copy(b.projectionMatrix),J(X,v,ut)};function J(X,Y,ot){ot===null?X.matrix.copy(Y.matrixWorld):(X.matrix.copy(ot.matrixWorld),X.matrix.invert(),X.matrix.multiply(Y.matrixWorld)),X.matrix.decompose(X.position,X.quaternion,X.scale),X.updateMatrixWorld(!0),X.projectionMatrix.copy(Y.projectionMatrix),X.projectionMatrixInverse.copy(Y.projectionMatrixInverse),X.isPerspectiveCamera&&(X.fov=hl*2*Math.atan(1/X.projectionMatrix.elements[5]),X.zoom=1)}this.getCamera=function(){return v},this.getFoveation=function(){if(!(d===null&&m===null))return c},this.setFoveation=function(X){c=X,d!==null&&(d.fixedFoveation=X),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=X)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(v)};let nt=null;function xt(X,Y){if(u=Y.getViewerPose(l||o),_=Y,u!==null){const ot=u.views;m!==null&&(t.setRenderTargetFramebuffer(y,m.framebuffer),t.setRenderTarget(y));let ut=!1;ot.length!==v.cameras.length&&(v.cameras.length=0,ut=!0);for(let Ct=0;Ct<ot.length;Ct++){const Nt=ot[Ct];let ne=null;if(m!==null)ne=m.getViewport(Nt);else{const de=h.getViewSubImage(d,Nt);ne=de.viewport,Ct===0&&(t.setRenderTargetTextures(y,de.colorTexture,d.ignoreDepthValues?void 0:de.depthStencilTexture),t.setRenderTarget(y))}let I=S[Ct];I===void 0&&(I=new sn,I.layers.enable(Ct),I.viewport=new Ae,S[Ct]=I),I.matrix.fromArray(Nt.transform.matrix),I.matrix.decompose(I.position,I.quaternion,I.scale),I.projectionMatrix.fromArray(Nt.projectionMatrix),I.projectionMatrixInverse.copy(I.projectionMatrix).invert(),I.viewport.set(ne.x,ne.y,ne.width,ne.height),Ct===0&&(v.matrix.copy(I.matrix),v.matrix.decompose(v.position,v.quaternion,v.scale)),ut===!0&&v.cameras.push(I)}const st=s.enabledFeatures;if(st&&st.includes("depth-sensing")){const Ct=h.getDepthInformation(ot[0]);Ct&&Ct.isValid&&Ct.texture&&g.init(t,Ct,s.renderState)}}for(let ot=0;ot<x.length;ot++){const ut=T[ot],st=x[ot];ut!==null&&st!==void 0&&st.update(ut,Y,l||o)}nt&&nt(X,Y),Y.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Y}),_=null}const Ot=new Sf;Ot.setAnimationLoop(xt),this.setAnimationLoop=function(X){nt=X},this.dispose=function(){}}}const Ii=new On,VE=new Me;function zE(i,t){function e(p,f){p.matrixAutoUpdate===!0&&p.updateMatrix(),f.value.copy(p.matrix)}function n(p,f){f.color.getRGB(p.fogColor.value,gf(i)),f.isFog?(p.fogNear.value=f.near,p.fogFar.value=f.far):f.isFogExp2&&(p.fogDensity.value=f.density)}function s(p,f,y,x,T){f.isMeshBasicMaterial||f.isMeshLambertMaterial?r(p,f):f.isMeshToonMaterial?(r(p,f),h(p,f)):f.isMeshPhongMaterial?(r(p,f),u(p,f)):f.isMeshStandardMaterial?(r(p,f),d(p,f),f.isMeshPhysicalMaterial&&m(p,f,T)):f.isMeshMatcapMaterial?(r(p,f),_(p,f)):f.isMeshDepthMaterial?r(p,f):f.isMeshDistanceMaterial?(r(p,f),g(p,f)):f.isMeshNormalMaterial?r(p,f):f.isLineBasicMaterial?(o(p,f),f.isLineDashedMaterial&&a(p,f)):f.isPointsMaterial?c(p,f,y,x):f.isSpriteMaterial?l(p,f):f.isShadowMaterial?(p.color.value.copy(f.color),p.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(p,f){p.opacity.value=f.opacity,f.color&&p.diffuse.value.copy(f.color),f.emissive&&p.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(p.map.value=f.map,e(f.map,p.mapTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,e(f.alphaMap,p.alphaMapTransform)),f.bumpMap&&(p.bumpMap.value=f.bumpMap,e(f.bumpMap,p.bumpMapTransform),p.bumpScale.value=f.bumpScale,f.side===qe&&(p.bumpScale.value*=-1)),f.normalMap&&(p.normalMap.value=f.normalMap,e(f.normalMap,p.normalMapTransform),p.normalScale.value.copy(f.normalScale),f.side===qe&&p.normalScale.value.negate()),f.displacementMap&&(p.displacementMap.value=f.displacementMap,e(f.displacementMap,p.displacementMapTransform),p.displacementScale.value=f.displacementScale,p.displacementBias.value=f.displacementBias),f.emissiveMap&&(p.emissiveMap.value=f.emissiveMap,e(f.emissiveMap,p.emissiveMapTransform)),f.specularMap&&(p.specularMap.value=f.specularMap,e(f.specularMap,p.specularMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest);const y=t.get(f),x=y.envMap,T=y.envMapRotation;x&&(p.envMap.value=x,Ii.copy(T),Ii.x*=-1,Ii.y*=-1,Ii.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(Ii.y*=-1,Ii.z*=-1),p.envMapRotation.value.setFromMatrix4(VE.makeRotationFromEuler(Ii)),p.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=f.reflectivity,p.ior.value=f.ior,p.refractionRatio.value=f.refractionRatio),f.lightMap&&(p.lightMap.value=f.lightMap,p.lightMapIntensity.value=f.lightMapIntensity,e(f.lightMap,p.lightMapTransform)),f.aoMap&&(p.aoMap.value=f.aoMap,p.aoMapIntensity.value=f.aoMapIntensity,e(f.aoMap,p.aoMapTransform))}function o(p,f){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,f.map&&(p.map.value=f.map,e(f.map,p.mapTransform))}function a(p,f){p.dashSize.value=f.dashSize,p.totalSize.value=f.dashSize+f.gapSize,p.scale.value=f.scale}function c(p,f,y,x){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,p.size.value=f.size*y,p.scale.value=x*.5,f.map&&(p.map.value=f.map,e(f.map,p.uvTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,e(f.alphaMap,p.alphaMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest)}function l(p,f){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,p.rotation.value=f.rotation,f.map&&(p.map.value=f.map,e(f.map,p.mapTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,e(f.alphaMap,p.alphaMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest)}function u(p,f){p.specular.value.copy(f.specular),p.shininess.value=Math.max(f.shininess,1e-4)}function h(p,f){f.gradientMap&&(p.gradientMap.value=f.gradientMap)}function d(p,f){p.metalness.value=f.metalness,f.metalnessMap&&(p.metalnessMap.value=f.metalnessMap,e(f.metalnessMap,p.metalnessMapTransform)),p.roughness.value=f.roughness,f.roughnessMap&&(p.roughnessMap.value=f.roughnessMap,e(f.roughnessMap,p.roughnessMapTransform)),f.envMap&&(p.envMapIntensity.value=f.envMapIntensity)}function m(p,f,y){p.ior.value=f.ior,f.sheen>0&&(p.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),p.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(p.sheenColorMap.value=f.sheenColorMap,e(f.sheenColorMap,p.sheenColorMapTransform)),f.sheenRoughnessMap&&(p.sheenRoughnessMap.value=f.sheenRoughnessMap,e(f.sheenRoughnessMap,p.sheenRoughnessMapTransform))),f.clearcoat>0&&(p.clearcoat.value=f.clearcoat,p.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(p.clearcoatMap.value=f.clearcoatMap,e(f.clearcoatMap,p.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,e(f.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(p.clearcoatNormalMap.value=f.clearcoatNormalMap,e(f.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===qe&&p.clearcoatNormalScale.value.negate())),f.dispersion>0&&(p.dispersion.value=f.dispersion),f.iridescence>0&&(p.iridescence.value=f.iridescence,p.iridescenceIOR.value=f.iridescenceIOR,p.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(p.iridescenceMap.value=f.iridescenceMap,e(f.iridescenceMap,p.iridescenceMapTransform)),f.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=f.iridescenceThicknessMap,e(f.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),f.transmission>0&&(p.transmission.value=f.transmission,p.transmissionSamplerMap.value=y.texture,p.transmissionSamplerSize.value.set(y.width,y.height),f.transmissionMap&&(p.transmissionMap.value=f.transmissionMap,e(f.transmissionMap,p.transmissionMapTransform)),p.thickness.value=f.thickness,f.thicknessMap&&(p.thicknessMap.value=f.thicknessMap,e(f.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=f.attenuationDistance,p.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(p.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(p.anisotropyMap.value=f.anisotropyMap,e(f.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=f.specularIntensity,p.specularColor.value.copy(f.specularColor),f.specularColorMap&&(p.specularColorMap.value=f.specularColorMap,e(f.specularColorMap,p.specularColorMapTransform)),f.specularIntensityMap&&(p.specularIntensityMap.value=f.specularIntensityMap,e(f.specularIntensityMap,p.specularIntensityMapTransform))}function _(p,f){f.matcap&&(p.matcap.value=f.matcap)}function g(p,f){const y=t.get(f).light;p.referencePosition.value.setFromMatrixPosition(y.matrixWorld),p.nearDistance.value=y.shadow.camera.near,p.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function GE(i,t,e,n){let s={},r={},o=[];const a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(y,x){const T=x.program;n.uniformBlockBinding(y,T)}function l(y,x){let T=s[y.id];T===void 0&&(_(y),T=u(y),s[y.id]=T,y.addEventListener("dispose",p));const w=x.program;n.updateUBOMapping(y,w);const E=t.render.frame;r[y.id]!==E&&(d(y),r[y.id]=E)}function u(y){const x=h();y.__bindingPointIndex=x;const T=i.createBuffer(),w=y.__size,E=y.usage;return i.bindBuffer(i.UNIFORM_BUFFER,T),i.bufferData(i.UNIFORM_BUFFER,w,E),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,x,T),T}function h(){for(let y=0;y<a;y++)if(o.indexOf(y)===-1)return o.push(y),y;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(y){const x=s[y.id],T=y.uniforms,w=y.__cache;i.bindBuffer(i.UNIFORM_BUFFER,x);for(let E=0,b=T.length;E<b;E++){const C=Array.isArray(T[E])?T[E]:[T[E]];for(let S=0,v=C.length;S<v;S++){const R=C[S];if(m(R,E,S,w)===!0){const P=R.__offset,N=Array.isArray(R.value)?R.value:[R.value];let F=0;for(let z=0;z<N.length;z++){const U=N[z],B=g(U);typeof U=="number"||typeof U=="boolean"?(R.__data[0]=U,i.bufferSubData(i.UNIFORM_BUFFER,P+F,R.__data)):U.isMatrix3?(R.__data[0]=U.elements[0],R.__data[1]=U.elements[1],R.__data[2]=U.elements[2],R.__data[3]=0,R.__data[4]=U.elements[3],R.__data[5]=U.elements[4],R.__data[6]=U.elements[5],R.__data[7]=0,R.__data[8]=U.elements[6],R.__data[9]=U.elements[7],R.__data[10]=U.elements[8],R.__data[11]=0):(U.toArray(R.__data,F),F+=B.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,P,R.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function m(y,x,T,w){const E=y.value,b=x+"_"+T;if(w[b]===void 0)return typeof E=="number"||typeof E=="boolean"?w[b]=E:w[b]=E.clone(),!0;{const C=w[b];if(typeof E=="number"||typeof E=="boolean"){if(C!==E)return w[b]=E,!0}else if(C.equals(E)===!1)return C.copy(E),!0}return!1}function _(y){const x=y.uniforms;let T=0;const w=16;for(let b=0,C=x.length;b<C;b++){const S=Array.isArray(x[b])?x[b]:[x[b]];for(let v=0,R=S.length;v<R;v++){const P=S[v],N=Array.isArray(P.value)?P.value:[P.value];for(let F=0,z=N.length;F<z;F++){const U=N[F],B=g(U),V=T%w,j=V%B.boundary,J=V+j;T+=j,J!==0&&w-J<B.storage&&(T+=w-J),P.__data=new Float32Array(B.storage/Float32Array.BYTES_PER_ELEMENT),P.__offset=T,T+=B.storage}}}const E=T%w;return E>0&&(T+=w-E),y.__size=T,y.__cache={},this}function g(y){const x={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(x.boundary=4,x.storage=4):y.isVector2?(x.boundary=8,x.storage=8):y.isVector3||y.isColor?(x.boundary=16,x.storage=12):y.isVector4?(x.boundary=16,x.storage=16):y.isMatrix3?(x.boundary=48,x.storage=48):y.isMatrix4?(x.boundary=64,x.storage=64):y.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",y),x}function p(y){const x=y.target;x.removeEventListener("dispose",p);const T=o.indexOf(x.__bindingPointIndex);o.splice(T,1),i.deleteBuffer(s[x.id]),delete s[x.id],delete r[x.id]}function f(){for(const y in s)i.deleteBuffer(s[y]);o=[],s={},r={}}return{bind:c,update:l,dispose:f}}class HE{constructor(t={}){const{canvas:e=Ix(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1}=t;this.isWebGLRenderer=!0;let d;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=n.getContextAttributes().alpha}else d=o;const m=new Uint32Array(4),_=new Int32Array(4);let g=null,p=null;const f=[],y=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Cn,this.toneMapping=gi,this.toneMappingExposure=1;const x=this;let T=!1,w=0,E=0,b=null,C=-1,S=null;const v=new Ae,R=new Ae;let P=null;const N=new Yt(0);let F=0,z=e.width,U=e.height,B=1,V=null,j=null;const J=new Ae(0,0,z,U),nt=new Ae(0,0,z,U);let xt=!1;const Ot=new yf;let X=!1,Y=!1;const ot=new Me,ut=new G,st=new Ae,Ct={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Nt=!1;function ne(){return b===null?B:1}let I=n;function de(A,O){return e.getContext(A,O)}try{const A={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${zl}`),e.addEventListener("webglcontextlost",K,!1),e.addEventListener("webglcontextrestored",Q,!1),e.addEventListener("webglcontextcreationerror",ht,!1),I===null){const O="webgl2";if(I=de(O,A),I===null)throw de(O)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(A){throw console.error("THREE.WebGLRenderer: "+A.message),A}let Zt,rt,it,Ut,_t,ft,D,M,H,Z,et,tt,wt,pt,vt,Ft,at,gt,Ht,It,yt,Lt,Vt,ue;function L(){Zt=new $M(I),Zt.init(),Lt=new NE(I,Zt),rt=new GM(I,Zt,t,Lt),it=new DE(I),Ut=new JM(I),_t=new _E,ft=new IE(I,Zt,it,_t,rt,Lt,Ut),D=new WM(x),M=new jM(x),H=new sy(I),Vt=new VM(I,H),Z=new ZM(I,H,Ut,Vt),et=new tT(I,Z,H,Ut),Ht=new QM(I,rt,ft),Ft=new HM(_t),tt=new mE(x,D,M,Zt,rt,Vt,Ft),wt=new zE(x,_t),pt=new vE,vt=new EE(Zt),gt=new BM(x,D,M,it,et,d,c),at=new RE(x,et,rt),ue=new GE(I,Ut,rt,it),It=new zM(I,Zt,Ut),yt=new KM(I,Zt,Ut),Ut.programs=tt.programs,x.capabilities=rt,x.extensions=Zt,x.properties=_t,x.renderLists=pt,x.shadowMap=at,x.state=it,x.info=Ut}L();const ct=new BE(x,I);this.xr=ct,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){const A=Zt.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){const A=Zt.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return B},this.setPixelRatio=function(A){A!==void 0&&(B=A,this.setSize(z,U,!1))},this.getSize=function(A){return A.set(z,U)},this.setSize=function(A,O,W=!0){if(ct.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}z=A,U=O,e.width=Math.floor(A*B),e.height=Math.floor(O*B),W===!0&&(e.style.width=A+"px",e.style.height=O+"px"),this.setViewport(0,0,A,O)},this.getDrawingBufferSize=function(A){return A.set(z*B,U*B).floor()},this.setDrawingBufferSize=function(A,O,W){z=A,U=O,B=W,e.width=Math.floor(A*W),e.height=Math.floor(O*W),this.setViewport(0,0,A,O)},this.getCurrentViewport=function(A){return A.copy(v)},this.getViewport=function(A){return A.copy(J)},this.setViewport=function(A,O,W,q){A.isVector4?J.set(A.x,A.y,A.z,A.w):J.set(A,O,W,q),it.viewport(v.copy(J).multiplyScalar(B).round())},this.getScissor=function(A){return A.copy(nt)},this.setScissor=function(A,O,W,q){A.isVector4?nt.set(A.x,A.y,A.z,A.w):nt.set(A,O,W,q),it.scissor(R.copy(nt).multiplyScalar(B).round())},this.getScissorTest=function(){return xt},this.setScissorTest=function(A){it.setScissorTest(xt=A)},this.setOpaqueSort=function(A){V=A},this.setTransparentSort=function(A){j=A},this.getClearColor=function(A){return A.copy(gt.getClearColor())},this.setClearColor=function(){gt.setClearColor.apply(gt,arguments)},this.getClearAlpha=function(){return gt.getClearAlpha()},this.setClearAlpha=function(){gt.setClearAlpha.apply(gt,arguments)},this.clear=function(A=!0,O=!0,W=!0){let q=0;if(A){let k=!1;if(b!==null){const lt=b.texture.format;k=lt===Yl||lt===Xl||lt===ql}if(k){const lt=b.texture.type,mt=lt===ti||lt===es||lt===Dr||lt===Xs||lt===Hl||lt===Wl,St=gt.getClearColor(),Mt=gt.getClearAlpha(),Dt=St.r,Pt=St.g,Et=St.b;mt?(m[0]=Dt,m[1]=Pt,m[2]=Et,m[3]=Mt,I.clearBufferuiv(I.COLOR,0,m)):(_[0]=Dt,_[1]=Pt,_[2]=Et,_[3]=Mt,I.clearBufferiv(I.COLOR,0,_))}else q|=I.COLOR_BUFFER_BIT}O&&(q|=I.DEPTH_BUFFER_BIT),W&&(q|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),I.clear(q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",K,!1),e.removeEventListener("webglcontextrestored",Q,!1),e.removeEventListener("webglcontextcreationerror",ht,!1),pt.dispose(),vt.dispose(),_t.dispose(),D.dispose(),M.dispose(),et.dispose(),Vt.dispose(),ue.dispose(),tt.dispose(),ct.dispose(),ct.removeEventListener("sessionstart",An),ct.removeEventListener("sessionend",su),wi.stop()};function K(A){A.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),T=!0}function Q(){console.log("THREE.WebGLRenderer: Context Restored."),T=!1;const A=Ut.autoReset,O=at.enabled,W=at.autoUpdate,q=at.needsUpdate,k=at.type;L(),Ut.autoReset=A,at.enabled=O,at.autoUpdate=W,at.needsUpdate=q,at.type=k}function ht(A){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function Rt(A){const O=A.target;O.removeEventListener("dispose",Rt),Xt(O)}function Xt(A){xe(A),_t.remove(A)}function xe(A){const O=_t.get(A).programs;O!==void 0&&(O.forEach(function(W){tt.releaseProgram(W)}),A.isShaderMaterial&&tt.releaseShaderCache(A))}this.renderBufferDirect=function(A,O,W,q,k,lt){O===null&&(O=Ct);const mt=k.isMesh&&k.matrixWorld.determinant()<0,St=kf(A,O,W,q,k);it.setMaterial(q,mt);let Mt=W.index,Dt=1;if(q.wireframe===!0){if(Mt=Z.getWireframeAttribute(W),Mt===void 0)return;Dt=2}const Pt=W.drawRange,Et=W.attributes.position;let Jt=Pt.start*Dt,fe=(Pt.start+Pt.count)*Dt;lt!==null&&(Jt=Math.max(Jt,lt.start*Dt),fe=Math.min(fe,(lt.start+lt.count)*Dt)),Mt!==null?(Jt=Math.max(Jt,0),fe=Math.min(fe,Mt.count)):Et!=null&&(Jt=Math.max(Jt,0),fe=Math.min(fe,Et.count));const pe=fe-Jt;if(pe<0||pe===1/0)return;Vt.setup(k,q,St,W,Mt);let je,Qt=It;if(Mt!==null&&(je=H.get(Mt),Qt=yt,Qt.setIndex(je)),k.isMesh)q.wireframe===!0?(it.setLineWidth(q.wireframeLinewidth*ne()),Qt.setMode(I.LINES)):Qt.setMode(I.TRIANGLES);else if(k.isLine){let bt=q.linewidth;bt===void 0&&(bt=1),it.setLineWidth(bt*ne()),k.isLineSegments?Qt.setMode(I.LINES):k.isLineLoop?Qt.setMode(I.LINE_LOOP):Qt.setMode(I.LINE_STRIP)}else k.isPoints?Qt.setMode(I.POINTS):k.isSprite&&Qt.setMode(I.TRIANGLES);if(k.isBatchedMesh)if(k._multiDrawInstances!==null)Qt.renderMultiDrawInstances(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount,k._multiDrawInstances);else if(Zt.get("WEBGL_multi_draw"))Qt.renderMultiDraw(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount);else{const bt=k._multiDrawStarts,Pe=k._multiDrawCounts,te=k._multiDrawCount,ln=Mt?H.get(Mt).bytesPerElement:1,as=_t.get(q).currentProgram.getUniforms();for(let $e=0;$e<te;$e++)as.setValue(I,"_gl_DrawID",$e),Qt.render(bt[$e]/ln,Pe[$e])}else if(k.isInstancedMesh)Qt.renderInstances(Jt,pe,k.count);else if(W.isInstancedBufferGeometry){const bt=W._maxInstanceCount!==void 0?W._maxInstanceCount:1/0,Pe=Math.min(W.instanceCount,bt);Qt.renderInstances(Jt,pe,Pe)}else Qt.render(Jt,pe)};function De(A,O,W){A.transparent===!0&&A.side===$n&&A.forceSinglePass===!1?(A.side=qe,A.needsUpdate=!0,jr(A,O,W),A.side=Si,A.needsUpdate=!0,jr(A,O,W),A.side=$n):jr(A,O,W)}this.compile=function(A,O,W=null){W===null&&(W=A),p=vt.get(W),p.init(O),y.push(p),W.traverseVisible(function(k){k.isLight&&k.layers.test(O.layers)&&(p.pushLight(k),k.castShadow&&p.pushShadow(k))}),A!==W&&A.traverseVisible(function(k){k.isLight&&k.layers.test(O.layers)&&(p.pushLight(k),k.castShadow&&p.pushShadow(k))}),p.setupLights();const q=new Set;return A.traverse(function(k){const lt=k.material;if(lt)if(Array.isArray(lt))for(let mt=0;mt<lt.length;mt++){const St=lt[mt];De(St,W,k),q.add(St)}else De(lt,W,k),q.add(lt)}),y.pop(),p=null,q},this.compileAsync=function(A,O,W=null){const q=this.compile(A,O,W);return new Promise(k=>{function lt(){if(q.forEach(function(mt){_t.get(mt).currentProgram.isReady()&&q.delete(mt)}),q.size===0){k(A);return}setTimeout(lt,10)}Zt.get("KHR_parallel_shader_compile")!==null?lt():setTimeout(lt,10)})};let Kt=null;function Vn(A){Kt&&Kt(A)}function An(){wi.stop()}function su(){wi.start()}const wi=new Sf;wi.setAnimationLoop(Vn),typeof self<"u"&&wi.setContext(self),this.setAnimationLoop=function(A){Kt=A,ct.setAnimationLoop(A),A===null?wi.stop():wi.start()},ct.addEventListener("sessionstart",An),ct.addEventListener("sessionend",su),this.render=function(A,O){if(O!==void 0&&O.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(T===!0)return;if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),ct.enabled===!0&&ct.isPresenting===!0&&(ct.cameraAutoUpdate===!0&&ct.updateCamera(O),O=ct.getCamera()),A.isScene===!0&&A.onBeforeRender(x,A,O,b),p=vt.get(A,y.length),p.init(O),y.push(p),ot.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),Ot.setFromProjectionMatrix(ot),Y=this.localClippingEnabled,X=Ft.init(this.clippingPlanes,Y),g=pt.get(A,f.length),g.init(),f.push(g),ct.enabled===!0&&ct.isPresenting===!0){const lt=x.xr.getDepthSensingMesh();lt!==null&&Wa(lt,O,-1/0,x.sortObjects)}Wa(A,O,0,x.sortObjects),g.finish(),x.sortObjects===!0&&g.sort(V,j),Nt=ct.enabled===!1||ct.isPresenting===!1||ct.hasDepthSensing()===!1,Nt&&gt.addToRenderList(g,A),this.info.render.frame++,X===!0&&Ft.beginShadows();const W=p.state.shadowsArray;at.render(W,A,O),X===!0&&Ft.endShadows(),this.info.autoReset===!0&&this.info.reset();const q=g.opaque,k=g.transmissive;if(p.setupLights(),O.isArrayCamera){const lt=O.cameras;if(k.length>0)for(let mt=0,St=lt.length;mt<St;mt++){const Mt=lt[mt];ou(q,k,A,Mt)}Nt&&gt.render(A);for(let mt=0,St=lt.length;mt<St;mt++){const Mt=lt[mt];ru(g,A,Mt,Mt.viewport)}}else k.length>0&&ou(q,k,A,O),Nt&&gt.render(A),ru(g,A,O);b!==null&&(ft.updateMultisampleRenderTarget(b),ft.updateRenderTargetMipmap(b)),A.isScene===!0&&A.onAfterRender(x,A,O),Vt.resetDefaultState(),C=-1,S=null,y.pop(),y.length>0?(p=y[y.length-1],X===!0&&Ft.setGlobalState(x.clippingPlanes,p.state.camera)):p=null,f.pop(),f.length>0?g=f[f.length-1]:g=null};function Wa(A,O,W,q){if(A.visible===!1)return;if(A.layers.test(O.layers)){if(A.isGroup)W=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(O);else if(A.isLight)p.pushLight(A),A.castShadow&&p.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||Ot.intersectsSprite(A)){q&&st.setFromMatrixPosition(A.matrixWorld).applyMatrix4(ot);const mt=et.update(A),St=A.material;St.visible&&g.push(A,mt,St,W,st.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||Ot.intersectsObject(A))){const mt=et.update(A),St=A.material;if(q&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),st.copy(A.boundingSphere.center)):(mt.boundingSphere===null&&mt.computeBoundingSphere(),st.copy(mt.boundingSphere.center)),st.applyMatrix4(A.matrixWorld).applyMatrix4(ot)),Array.isArray(St)){const Mt=mt.groups;for(let Dt=0,Pt=Mt.length;Dt<Pt;Dt++){const Et=Mt[Dt],Jt=St[Et.materialIndex];Jt&&Jt.visible&&g.push(A,mt,Jt,W,st.z,Et)}}else St.visible&&g.push(A,mt,St,W,st.z,null)}}const lt=A.children;for(let mt=0,St=lt.length;mt<St;mt++)Wa(lt[mt],O,W,q)}function ru(A,O,W,q){const k=A.opaque,lt=A.transmissive,mt=A.transparent;p.setupLightsView(W),X===!0&&Ft.setGlobalState(x.clippingPlanes,W),q&&it.viewport(v.copy(q)),k.length>0&&Yr(k,O,W),lt.length>0&&Yr(lt,O,W),mt.length>0&&Yr(mt,O,W),it.buffers.depth.setTest(!0),it.buffers.depth.setMask(!0),it.buffers.color.setMask(!0),it.setPolygonOffset(!1)}function ou(A,O,W,q){if((W.isScene===!0?W.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[q.id]===void 0&&(p.state.transmissionRenderTarget[q.id]=new ns(1,1,{generateMipmaps:!0,type:Zt.has("EXT_color_buffer_half_float")||Zt.has("EXT_color_buffer_float")?Gr:ti,minFilter:zi,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ee.workingColorSpace}));const lt=p.state.transmissionRenderTarget[q.id],mt=q.viewport||v;lt.setSize(mt.z,mt.w);const St=x.getRenderTarget();x.setRenderTarget(lt),x.getClearColor(N),F=x.getClearAlpha(),F<1&&x.setClearColor(16777215,.5),x.clear(),Nt&&gt.render(W);const Mt=x.toneMapping;x.toneMapping=gi;const Dt=q.viewport;if(q.viewport!==void 0&&(q.viewport=void 0),p.setupLightsView(q),X===!0&&Ft.setGlobalState(x.clippingPlanes,q),Yr(A,W,q),ft.updateMultisampleRenderTarget(lt),ft.updateRenderTargetMipmap(lt),Zt.has("WEBGL_multisampled_render_to_texture")===!1){let Pt=!1;for(let Et=0,Jt=O.length;Et<Jt;Et++){const fe=O[Et],pe=fe.object,je=fe.geometry,Qt=fe.material,bt=fe.group;if(Qt.side===$n&&pe.layers.test(q.layers)){const Pe=Qt.side;Qt.side=qe,Qt.needsUpdate=!0,au(pe,W,q,je,Qt,bt),Qt.side=Pe,Qt.needsUpdate=!0,Pt=!0}}Pt===!0&&(ft.updateMultisampleRenderTarget(lt),ft.updateRenderTargetMipmap(lt))}x.setRenderTarget(St),x.setClearColor(N,F),Dt!==void 0&&(q.viewport=Dt),x.toneMapping=Mt}function Yr(A,O,W){const q=O.isScene===!0?O.overrideMaterial:null;for(let k=0,lt=A.length;k<lt;k++){const mt=A[k],St=mt.object,Mt=mt.geometry,Dt=q===null?mt.material:q,Pt=mt.group;St.layers.test(W.layers)&&au(St,O,W,Mt,Dt,Pt)}}function au(A,O,W,q,k,lt){A.onBeforeRender(x,O,W,q,k,lt),A.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),k.onBeforeRender(x,O,W,q,A,lt),k.transparent===!0&&k.side===$n&&k.forceSinglePass===!1?(k.side=qe,k.needsUpdate=!0,x.renderBufferDirect(W,O,q,k,A,lt),k.side=Si,k.needsUpdate=!0,x.renderBufferDirect(W,O,q,k,A,lt),k.side=$n):x.renderBufferDirect(W,O,q,k,A,lt),A.onAfterRender(x,O,W,q,k,lt)}function jr(A,O,W){O.isScene!==!0&&(O=Ct);const q=_t.get(A),k=p.state.lights,lt=p.state.shadowsArray,mt=k.state.version,St=tt.getParameters(A,k.state,lt,O,W),Mt=tt.getProgramCacheKey(St);let Dt=q.programs;q.environment=A.isMeshStandardMaterial?O.environment:null,q.fog=O.fog,q.envMap=(A.isMeshStandardMaterial?M:D).get(A.envMap||q.environment),q.envMapRotation=q.environment!==null&&A.envMap===null?O.environmentRotation:A.envMapRotation,Dt===void 0&&(A.addEventListener("dispose",Rt),Dt=new Map,q.programs=Dt);let Pt=Dt.get(Mt);if(Pt!==void 0){if(q.currentProgram===Pt&&q.lightsStateVersion===mt)return lu(A,St),Pt}else St.uniforms=tt.getUniforms(A),A.onBeforeCompile(St,x),Pt=tt.acquireProgram(St,Mt),Dt.set(Mt,Pt),q.uniforms=St.uniforms;const Et=q.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(Et.clippingPlanes=Ft.uniform),lu(A,St),q.needsLights=Vf(A),q.lightsStateVersion=mt,q.needsLights&&(Et.ambientLightColor.value=k.state.ambient,Et.lightProbe.value=k.state.probe,Et.directionalLights.value=k.state.directional,Et.directionalLightShadows.value=k.state.directionalShadow,Et.spotLights.value=k.state.spot,Et.spotLightShadows.value=k.state.spotShadow,Et.rectAreaLights.value=k.state.rectArea,Et.ltc_1.value=k.state.rectAreaLTC1,Et.ltc_2.value=k.state.rectAreaLTC2,Et.pointLights.value=k.state.point,Et.pointLightShadows.value=k.state.pointShadow,Et.hemisphereLights.value=k.state.hemi,Et.directionalShadowMap.value=k.state.directionalShadowMap,Et.directionalShadowMatrix.value=k.state.directionalShadowMatrix,Et.spotShadowMap.value=k.state.spotShadowMap,Et.spotLightMatrix.value=k.state.spotLightMatrix,Et.spotLightMap.value=k.state.spotLightMap,Et.pointShadowMap.value=k.state.pointShadowMap,Et.pointShadowMatrix.value=k.state.pointShadowMatrix),q.currentProgram=Pt,q.uniformsList=null,Pt}function cu(A){if(A.uniformsList===null){const O=A.currentProgram.getUniforms();A.uniformsList=Io.seqWithValue(O.seq,A.uniforms)}return A.uniformsList}function lu(A,O){const W=_t.get(A);W.outputColorSpace=O.outputColorSpace,W.batching=O.batching,W.batchingColor=O.batchingColor,W.instancing=O.instancing,W.instancingColor=O.instancingColor,W.instancingMorph=O.instancingMorph,W.skinning=O.skinning,W.morphTargets=O.morphTargets,W.morphNormals=O.morphNormals,W.morphColors=O.morphColors,W.morphTargetsCount=O.morphTargetsCount,W.numClippingPlanes=O.numClippingPlanes,W.numIntersection=O.numClipIntersection,W.vertexAlphas=O.vertexAlphas,W.vertexTangents=O.vertexTangents,W.toneMapping=O.toneMapping}function kf(A,O,W,q,k){O.isScene!==!0&&(O=Ct),ft.resetTextureUnits();const lt=O.fog,mt=q.isMeshStandardMaterial?O.environment:null,St=b===null?x.outputColorSpace:b.isXRRenderTarget===!0?b.texture.colorSpace:bi,Mt=(q.isMeshStandardMaterial?M:D).get(q.envMap||mt),Dt=q.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,Pt=!!W.attributes.tangent&&(!!q.normalMap||q.anisotropy>0),Et=!!W.morphAttributes.position,Jt=!!W.morphAttributes.normal,fe=!!W.morphAttributes.color;let pe=gi;q.toneMapped&&(b===null||b.isXRRenderTarget===!0)&&(pe=x.toneMapping);const je=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,Qt=je!==void 0?je.length:0,bt=_t.get(q),Pe=p.state.lights;if(X===!0&&(Y===!0||A!==S)){const tn=A===S&&q.id===C;Ft.setState(q,A,tn)}let te=!1;q.version===bt.__version?(bt.needsLights&&bt.lightsStateVersion!==Pe.state.version||bt.outputColorSpace!==St||k.isBatchedMesh&&bt.batching===!1||!k.isBatchedMesh&&bt.batching===!0||k.isBatchedMesh&&bt.batchingColor===!0&&k.colorTexture===null||k.isBatchedMesh&&bt.batchingColor===!1&&k.colorTexture!==null||k.isInstancedMesh&&bt.instancing===!1||!k.isInstancedMesh&&bt.instancing===!0||k.isSkinnedMesh&&bt.skinning===!1||!k.isSkinnedMesh&&bt.skinning===!0||k.isInstancedMesh&&bt.instancingColor===!0&&k.instanceColor===null||k.isInstancedMesh&&bt.instancingColor===!1&&k.instanceColor!==null||k.isInstancedMesh&&bt.instancingMorph===!0&&k.morphTexture===null||k.isInstancedMesh&&bt.instancingMorph===!1&&k.morphTexture!==null||bt.envMap!==Mt||q.fog===!0&&bt.fog!==lt||bt.numClippingPlanes!==void 0&&(bt.numClippingPlanes!==Ft.numPlanes||bt.numIntersection!==Ft.numIntersection)||bt.vertexAlphas!==Dt||bt.vertexTangents!==Pt||bt.morphTargets!==Et||bt.morphNormals!==Jt||bt.morphColors!==fe||bt.toneMapping!==pe||bt.morphTargetsCount!==Qt)&&(te=!0):(te=!0,bt.__version=q.version);let ln=bt.currentProgram;te===!0&&(ln=jr(q,O,k));let as=!1,$e=!1,qa=!1;const ye=ln.getUniforms(),ri=bt.uniforms;if(it.useProgram(ln.program)&&(as=!0,$e=!0,qa=!0),q.id!==C&&(C=q.id,$e=!0),as||S!==A){ye.setValue(I,"projectionMatrix",A.projectionMatrix),ye.setValue(I,"viewMatrix",A.matrixWorldInverse);const tn=ye.map.cameraPosition;tn!==void 0&&tn.setValue(I,ut.setFromMatrixPosition(A.matrixWorld)),rt.logarithmicDepthBuffer&&ye.setValue(I,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(q.isMeshPhongMaterial||q.isMeshToonMaterial||q.isMeshLambertMaterial||q.isMeshBasicMaterial||q.isMeshStandardMaterial||q.isShaderMaterial)&&ye.setValue(I,"isOrthographic",A.isOrthographicCamera===!0),S!==A&&(S=A,$e=!0,qa=!0)}if(k.isSkinnedMesh){ye.setOptional(I,k,"bindMatrix"),ye.setOptional(I,k,"bindMatrixInverse");const tn=k.skeleton;tn&&(tn.boneTexture===null&&tn.computeBoneTexture(),ye.setValue(I,"boneTexture",tn.boneTexture,ft))}k.isBatchedMesh&&(ye.setOptional(I,k,"batchingTexture"),ye.setValue(I,"batchingTexture",k._matricesTexture,ft),ye.setOptional(I,k,"batchingIdTexture"),ye.setValue(I,"batchingIdTexture",k._indirectTexture,ft),ye.setOptional(I,k,"batchingColorTexture"),k._colorsTexture!==null&&ye.setValue(I,"batchingColorTexture",k._colorsTexture,ft));const Xa=W.morphAttributes;if((Xa.position!==void 0||Xa.normal!==void 0||Xa.color!==void 0)&&Ht.update(k,W,ln),($e||bt.receiveShadow!==k.receiveShadow)&&(bt.receiveShadow=k.receiveShadow,ye.setValue(I,"receiveShadow",k.receiveShadow)),q.isMeshGouraudMaterial&&q.envMap!==null&&(ri.envMap.value=Mt,ri.flipEnvMap.value=Mt.isCubeTexture&&Mt.isRenderTargetTexture===!1?-1:1),q.isMeshStandardMaterial&&q.envMap===null&&O.environment!==null&&(ri.envMapIntensity.value=O.environmentIntensity),$e&&(ye.setValue(I,"toneMappingExposure",x.toneMappingExposure),bt.needsLights&&Bf(ri,qa),lt&&q.fog===!0&&wt.refreshFogUniforms(ri,lt),wt.refreshMaterialUniforms(ri,q,B,U,p.state.transmissionRenderTarget[A.id]),Io.upload(I,cu(bt),ri,ft)),q.isShaderMaterial&&q.uniformsNeedUpdate===!0&&(Io.upload(I,cu(bt),ri,ft),q.uniformsNeedUpdate=!1),q.isSpriteMaterial&&ye.setValue(I,"center",k.center),ye.setValue(I,"modelViewMatrix",k.modelViewMatrix),ye.setValue(I,"normalMatrix",k.normalMatrix),ye.setValue(I,"modelMatrix",k.matrixWorld),q.isShaderMaterial||q.isRawShaderMaterial){const tn=q.uniformsGroups;for(let Ya=0,zf=tn.length;Ya<zf;Ya++){const uu=tn[Ya];ue.update(uu,ln),ue.bind(uu,ln)}}return ln}function Bf(A,O){A.ambientLightColor.needsUpdate=O,A.lightProbe.needsUpdate=O,A.directionalLights.needsUpdate=O,A.directionalLightShadows.needsUpdate=O,A.pointLights.needsUpdate=O,A.pointLightShadows.needsUpdate=O,A.spotLights.needsUpdate=O,A.spotLightShadows.needsUpdate=O,A.rectAreaLights.needsUpdate=O,A.hemisphereLights.needsUpdate=O}function Vf(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return E},this.getRenderTarget=function(){return b},this.setRenderTargetTextures=function(A,O,W){_t.get(A.texture).__webglTexture=O,_t.get(A.depthTexture).__webglTexture=W;const q=_t.get(A);q.__hasExternalTextures=!0,q.__autoAllocateDepthBuffer=W===void 0,q.__autoAllocateDepthBuffer||Zt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),q.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(A,O){const W=_t.get(A);W.__webglFramebuffer=O,W.__useDefaultFramebuffer=O===void 0},this.setRenderTarget=function(A,O=0,W=0){b=A,w=O,E=W;let q=!0,k=null,lt=!1,mt=!1;if(A){const Mt=_t.get(A);if(Mt.__useDefaultFramebuffer!==void 0)it.bindFramebuffer(I.FRAMEBUFFER,null),q=!1;else if(Mt.__webglFramebuffer===void 0)ft.setupRenderTarget(A);else if(Mt.__hasExternalTextures)ft.rebindTextures(A,_t.get(A.texture).__webglTexture,_t.get(A.depthTexture).__webglTexture);else if(A.depthBuffer){const Et=A.depthTexture;if(Mt.__boundDepthTexture!==Et){if(Et!==null&&_t.has(Et)&&(A.width!==Et.image.width||A.height!==Et.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");ft.setupDepthRenderbuffer(A)}}const Dt=A.texture;(Dt.isData3DTexture||Dt.isDataArrayTexture||Dt.isCompressedArrayTexture)&&(mt=!0);const Pt=_t.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(Pt[O])?k=Pt[O][W]:k=Pt[O],lt=!0):A.samples>0&&ft.useMultisampledRTT(A)===!1?k=_t.get(A).__webglMultisampledFramebuffer:Array.isArray(Pt)?k=Pt[W]:k=Pt,v.copy(A.viewport),R.copy(A.scissor),P=A.scissorTest}else v.copy(J).multiplyScalar(B).floor(),R.copy(nt).multiplyScalar(B).floor(),P=xt;if(it.bindFramebuffer(I.FRAMEBUFFER,k)&&q&&it.drawBuffers(A,k),it.viewport(v),it.scissor(R),it.setScissorTest(P),lt){const Mt=_t.get(A.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+O,Mt.__webglTexture,W)}else if(mt){const Mt=_t.get(A.texture),Dt=O||0;I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,Mt.__webglTexture,W||0,Dt)}C=-1},this.readRenderTargetPixels=function(A,O,W,q,k,lt,mt){if(!(A&&A.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let St=_t.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&mt!==void 0&&(St=St[mt]),St){it.bindFramebuffer(I.FRAMEBUFFER,St);try{const Mt=A.texture,Dt=Mt.format,Pt=Mt.type;if(!rt.textureFormatReadable(Dt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!rt.textureTypeReadable(Pt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=A.width-q&&W>=0&&W<=A.height-k&&I.readPixels(O,W,q,k,Lt.convert(Dt),Lt.convert(Pt),lt)}finally{const Mt=b!==null?_t.get(b).__webglFramebuffer:null;it.bindFramebuffer(I.FRAMEBUFFER,Mt)}}},this.readRenderTargetPixelsAsync=async function(A,O,W,q,k,lt,mt){if(!(A&&A.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let St=_t.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&mt!==void 0&&(St=St[mt]),St){it.bindFramebuffer(I.FRAMEBUFFER,St);try{const Mt=A.texture,Dt=Mt.format,Pt=Mt.type;if(!rt.textureFormatReadable(Dt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!rt.textureTypeReadable(Pt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(O>=0&&O<=A.width-q&&W>=0&&W<=A.height-k){const Et=I.createBuffer();I.bindBuffer(I.PIXEL_PACK_BUFFER,Et),I.bufferData(I.PIXEL_PACK_BUFFER,lt.byteLength,I.STREAM_READ),I.readPixels(O,W,q,k,Lt.convert(Dt),Lt.convert(Pt),0),I.flush();const Jt=I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE,0);await Nx(I,Jt,4);try{I.bindBuffer(I.PIXEL_PACK_BUFFER,Et),I.getBufferSubData(I.PIXEL_PACK_BUFFER,0,lt)}finally{I.deleteBuffer(Et),I.deleteSync(Jt)}return lt}}finally{const Mt=b!==null?_t.get(b).__webglFramebuffer:null;it.bindFramebuffer(I.FRAMEBUFFER,Mt)}}},this.copyFramebufferToTexture=function(A,O=null,W=0){A.isTexture!==!0&&(fr("WebGLRenderer: copyFramebufferToTexture function signature has changed."),O=arguments[0]||null,A=arguments[1]);const q=Math.pow(2,-W),k=Math.floor(A.image.width*q),lt=Math.floor(A.image.height*q),mt=O!==null?O.x:0,St=O!==null?O.y:0;ft.setTexture2D(A,0),I.copyTexSubImage2D(I.TEXTURE_2D,W,0,0,mt,St,k,lt),it.unbindTexture()},this.copyTextureToTexture=function(A,O,W=null,q=null,k=0){A.isTexture!==!0&&(fr("WebGLRenderer: copyTextureToTexture function signature has changed."),q=arguments[0]||null,A=arguments[1],O=arguments[2],k=arguments[3]||0,W=null);let lt,mt,St,Mt,Dt,Pt;W!==null?(lt=W.max.x-W.min.x,mt=W.max.y-W.min.y,St=W.min.x,Mt=W.min.y):(lt=A.image.width,mt=A.image.height,St=0,Mt=0),q!==null?(Dt=q.x,Pt=q.y):(Dt=0,Pt=0);const Et=Lt.convert(O.format),Jt=Lt.convert(O.type);ft.setTexture2D(O,0),I.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,O.flipY),I.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),I.pixelStorei(I.UNPACK_ALIGNMENT,O.unpackAlignment);const fe=I.getParameter(I.UNPACK_ROW_LENGTH),pe=I.getParameter(I.UNPACK_IMAGE_HEIGHT),je=I.getParameter(I.UNPACK_SKIP_PIXELS),Qt=I.getParameter(I.UNPACK_SKIP_ROWS),bt=I.getParameter(I.UNPACK_SKIP_IMAGES),Pe=A.isCompressedTexture?A.mipmaps[k]:A.image;I.pixelStorei(I.UNPACK_ROW_LENGTH,Pe.width),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,Pe.height),I.pixelStorei(I.UNPACK_SKIP_PIXELS,St),I.pixelStorei(I.UNPACK_SKIP_ROWS,Mt),A.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,k,Dt,Pt,lt,mt,Et,Jt,Pe.data):A.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,k,Dt,Pt,Pe.width,Pe.height,Et,Pe.data):I.texSubImage2D(I.TEXTURE_2D,k,Dt,Pt,lt,mt,Et,Jt,Pe),I.pixelStorei(I.UNPACK_ROW_LENGTH,fe),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,pe),I.pixelStorei(I.UNPACK_SKIP_PIXELS,je),I.pixelStorei(I.UNPACK_SKIP_ROWS,Qt),I.pixelStorei(I.UNPACK_SKIP_IMAGES,bt),k===0&&O.generateMipmaps&&I.generateMipmap(I.TEXTURE_2D),it.unbindTexture()},this.copyTextureToTexture3D=function(A,O,W=null,q=null,k=0){A.isTexture!==!0&&(fr("WebGLRenderer: copyTextureToTexture3D function signature has changed."),W=arguments[0]||null,q=arguments[1]||null,A=arguments[2],O=arguments[3],k=arguments[4]||0);let lt,mt,St,Mt,Dt,Pt,Et,Jt,fe;const pe=A.isCompressedTexture?A.mipmaps[k]:A.image;W!==null?(lt=W.max.x-W.min.x,mt=W.max.y-W.min.y,St=W.max.z-W.min.z,Mt=W.min.x,Dt=W.min.y,Pt=W.min.z):(lt=pe.width,mt=pe.height,St=pe.depth,Mt=0,Dt=0,Pt=0),q!==null?(Et=q.x,Jt=q.y,fe=q.z):(Et=0,Jt=0,fe=0);const je=Lt.convert(O.format),Qt=Lt.convert(O.type);let bt;if(O.isData3DTexture)ft.setTexture3D(O,0),bt=I.TEXTURE_3D;else if(O.isDataArrayTexture||O.isCompressedArrayTexture)ft.setTexture2DArray(O,0),bt=I.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}I.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,O.flipY),I.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),I.pixelStorei(I.UNPACK_ALIGNMENT,O.unpackAlignment);const Pe=I.getParameter(I.UNPACK_ROW_LENGTH),te=I.getParameter(I.UNPACK_IMAGE_HEIGHT),ln=I.getParameter(I.UNPACK_SKIP_PIXELS),as=I.getParameter(I.UNPACK_SKIP_ROWS),$e=I.getParameter(I.UNPACK_SKIP_IMAGES);I.pixelStorei(I.UNPACK_ROW_LENGTH,pe.width),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,pe.height),I.pixelStorei(I.UNPACK_SKIP_PIXELS,Mt),I.pixelStorei(I.UNPACK_SKIP_ROWS,Dt),I.pixelStorei(I.UNPACK_SKIP_IMAGES,Pt),A.isDataTexture||A.isData3DTexture?I.texSubImage3D(bt,k,Et,Jt,fe,lt,mt,St,je,Qt,pe.data):O.isCompressedArrayTexture?I.compressedTexSubImage3D(bt,k,Et,Jt,fe,lt,mt,St,je,pe.data):I.texSubImage3D(bt,k,Et,Jt,fe,lt,mt,St,je,Qt,pe),I.pixelStorei(I.UNPACK_ROW_LENGTH,Pe),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,te),I.pixelStorei(I.UNPACK_SKIP_PIXELS,ln),I.pixelStorei(I.UNPACK_SKIP_ROWS,as),I.pixelStorei(I.UNPACK_SKIP_IMAGES,$e),k===0&&O.generateMipmaps&&I.generateMipmap(bt),it.unbindTexture()},this.initRenderTarget=function(A){_t.get(A).__webglFramebuffer===void 0&&ft.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?ft.setTextureCube(A,0):A.isData3DTexture?ft.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?ft.setTexture2DArray(A,0):ft.setTexture2D(A,0),it.unbindTexture()},this.resetState=function(){w=0,E=0,b=null,it.reset(),Vt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Kn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===jl?"display-p3":"srgb",e.unpackColorSpace=ee.workingColorSpace===Fa?"display-p3":"srgb"}}class WE extends Ve{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new On,this.environmentIntensity=1,this.environmentRotation=new On,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class Af extends er{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Yt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const Nh=new Me,fl=new hf,Mo=new ka,To=new G;class qE extends Ve{constructor(t=new Bn,e=new Af){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Mo.copy(n.boundingSphere),Mo.applyMatrix4(s),Mo.radius+=r,t.ray.intersectsSphere(Mo)===!1)return;Nh.copy(s).invert(),fl.copy(t.ray).applyMatrix4(Nh);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=n.index,h=n.attributes.position;if(l!==null){const d=Math.max(0,o.start),m=Math.min(l.count,o.start+o.count);for(let _=d,g=m;_<g;_++){const p=l.getX(_);To.fromBufferAttribute(h,p),Lh(To,p,c,s,t,e,this)}}else{const d=Math.max(0,o.start),m=Math.min(h.count,o.start+o.count);for(let _=d,g=m;_<g;_++)To.fromBufferAttribute(h,_),Lh(To,_,c,s,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function Lh(i,t,e,n,s,r,o){const a=fl.distanceSqToPoint(i);if(a<e){const c=new G;fl.closestPointToPoint(i,c),c.applyMatrix4(n);const l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;r.push({distance:l,distanceToRay:Math.sqrt(a),point:c,index:t,face:null,object:o})}}class Zl extends Bn{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const r=[],o=[];a(s),l(n),u(),this.setAttribute("position",new cn(r,3)),this.setAttribute("normal",new cn(r.slice(),3)),this.setAttribute("uv",new cn(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(y){const x=new G,T=new G,w=new G;for(let E=0;E<e.length;E+=3)m(e[E+0],x),m(e[E+1],T),m(e[E+2],w),c(x,T,w,y)}function c(y,x,T,w){const E=w+1,b=[];for(let C=0;C<=E;C++){b[C]=[];const S=y.clone().lerp(T,C/E),v=x.clone().lerp(T,C/E),R=E-C;for(let P=0;P<=R;P++)P===0&&C===E?b[C][P]=S:b[C][P]=S.clone().lerp(v,P/R)}for(let C=0;C<E;C++)for(let S=0;S<2*(E-C)-1;S++){const v=Math.floor(S/2);S%2===0?(d(b[C][v+1]),d(b[C+1][v]),d(b[C][v])):(d(b[C][v+1]),d(b[C+1][v+1]),d(b[C+1][v]))}}function l(y){const x=new G;for(let T=0;T<r.length;T+=3)x.x=r[T+0],x.y=r[T+1],x.z=r[T+2],x.normalize().multiplyScalar(y),r[T+0]=x.x,r[T+1]=x.y,r[T+2]=x.z}function u(){const y=new G;for(let x=0;x<r.length;x+=3){y.x=r[x+0],y.y=r[x+1],y.z=r[x+2];const T=p(y)/2/Math.PI+.5,w=f(y)/Math.PI+.5;o.push(T,1-w)}_(),h()}function h(){for(let y=0;y<o.length;y+=6){const x=o[y+0],T=o[y+2],w=o[y+4],E=Math.max(x,T,w),b=Math.min(x,T,w);E>.9&&b<.1&&(x<.2&&(o[y+0]+=1),T<.2&&(o[y+2]+=1),w<.2&&(o[y+4]+=1))}}function d(y){r.push(y.x,y.y,y.z)}function m(y,x){const T=y*3;x.x=t[T+0],x.y=t[T+1],x.z=t[T+2]}function _(){const y=new G,x=new G,T=new G,w=new G,E=new Gt,b=new Gt,C=new Gt;for(let S=0,v=0;S<r.length;S+=9,v+=6){y.set(r[S+0],r[S+1],r[S+2]),x.set(r[S+3],r[S+4],r[S+5]),T.set(r[S+6],r[S+7],r[S+8]),E.set(o[v+0],o[v+1]),b.set(o[v+2],o[v+3]),C.set(o[v+4],o[v+5]),w.copy(y).add(x).add(T).divideScalar(3);const R=p(w);g(E,v+0,y,R),g(b,v+2,x,R),g(C,v+4,T,R)}}function g(y,x,T,w){w<0&&y.x===1&&(o[x]=y.x-1),T.x===0&&T.z===0&&(o[x]=w/2/Math.PI+.5)}function p(y){return Math.atan2(y.z,-y.x)}function f(y){return Math.atan2(-y.y,Math.sqrt(y.x*y.x+y.z*y.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Zl(t.vertices,t.indices,t.radius,t.details)}}class za extends Zl{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new za(t.radius,t.detail)}}class Cf extends er{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Yt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Yt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=of,this.normalScale=new Gt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new On,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class XE extends Ve{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Yt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class YE extends XE{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:zl}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=zl);const ei=document.getElementById("vj-canvas"),Rf=document.getElementById("instructions"),Df=document.getElementById("start-button");if(!ei||!Rf||!(Df instanceof HTMLButtonElement))throw new Error("初期化エラー: 必要なDOM要素が見つかりませんでした");const Kl=new HE({canvas:ei,antialias:!0,alpha:!0});Kl.setPixelRatio(Math.min(window.devicePixelRatio,2));const Ga=new WE;Ga.background=new Yt("#030712");const Gi=new sn(60,1,.1,100);Gi.position.set(0,0,8);const jE=new YE("#e0e7ff",.6);Ga.add(jE);const Ha=new hr;Ga.add(Ha);const $E=new Cf({color:"#8b5cf6",metalness:.9,roughness:.25,emissive:"#4c1d95",emissiveIntensity:.35}),No=new vn(new za(1.8,2),$E);Ha.add(No);const ZE=new Cf({color:"#22d3ee",metalness:.4,roughness:.1,transparent:!0,opacity:.22,emissive:"#0891b2",emissiveIntensity:.4}),Lo=new vn(new za(2.4,3),ZE);Ha.add(Lo);const Jl=new Bn,Ql=900,Oo=new Float32Array(Ql*3),Pf=new Float32Array(Ql);for(let i=0;i<Ql;i+=1){const t=2.8+Math.random()*1.8,e=Math.random()*Math.PI*2,n=Math.acos(2*Math.random()-1),s=t*Math.sin(n)*Math.cos(e),r=t*Math.sin(n)*Math.sin(e),o=t*Math.cos(n);Oo[i*3]=s,Oo[i*3+1]=r,Oo[i*3+2]=o,Pf[i]=Math.random()}Jl.setAttribute("position",new cn(Oo,3));Jl.setAttribute("scale",new cn(Pf,1));const KE=new Af({color:"#f0abfc",size:.14,sizeAttenuation:!0,transparent:!0,opacity:.9}),Uo=new qE(Jl,KE);Ha.add(Uo);const pl=new Gt(0,0),ws=new Gt(0,0);ei.addEventListener("pointermove",i=>{const t=ei.getBoundingClientRect();pl.x=(i.clientX-t.left)/t.width-.5,pl.y=(i.clientY-t.top)/t.height-.5});let ya=!1;const Eo=(i,t,e,n,s)=>{const o=(Math.min(Math.max(i,t),e)-t)/(e-t);return n+o*(s-n)},tu=new sa(Qi,{oscillator:{type:"sawtooth"},envelope:{attack:.03,decay:.2,sustain:.4,release:1.2}}),If=new zs({pitchDecay:.008,octaves:3,envelope:{attack:.001,decay:.4,sustain:0,release:.4}}),JE=new ia({noise:{type:"pink"},envelope:{attack:.001,decay:.18,sustain:0}}).toDestination(),Sa=new na({type:"lowpass",frequency:900,Q:1}),Nf=new la(6,3.5,.4).start(),eu=new ha({decay:6,wet:.3}),Lf=new ua("8n",.3);tu.chain(Sa,Nf,eu,Lf,qd);If.chain(eu,qd);const nu=new da("waveform",256);Lf.connect(nu);Sa.connect(nu);const Pr=[["C4","E4","G4","B3"],["A3","C4","E4","G4"],["F3","A3","C4","E4"],["G3","B3","D4","F4"]];let Ns=0;const iu=new oa((i,t)=>{tu.triggerAttackRelease(t,"8n",i,.6)},Pr[Ns],"upDown");iu.interval="8n";iu.start(0);const QE=new ts(i=>{const t=Pr[Ns][0];If.triggerAttackRelease(t.replace("4","2"),"8n",i,.8)},"1n");QE.start(0);const tb=new ts(i=>{JE.triggerAttackRelease("16n",i)},"2n");tb.start("4n");Wd.bpm.value=92;const Of=async()=>{ya||(await u0(),Rf.classList.add("hidden"),Wd.start(),ya=!0)};Df.addEventListener("click",Of);ei.addEventListener("click",async()=>{if(!ya){await Of();return}tu.triggerAttackRelease(Pr[Ns][Math.floor(Math.random()*4)],"16n",void 0,.9)});window.addEventListener("keydown",i=>{i.code==="Space"&&(i.preventDefault(),Ns=(Ns+1)%Pr.length,iu.values=Pr[Ns])});ei.addEventListener("pointermove",i=>{if(!ya)return;const t=ei.getBoundingClientRect(),e=(i.clientX-t.left)/t.width,n=(i.clientY-t.top)/t.height;Sa.frequency.value=Eo(e,0,1,320,4200),Sa.Q.value=Eo(n,0,1,.6,12),Nf.wet.value=Eo(n,0,1,.15,.4),eu.wet.value=Eo(e,0,1,.2,.5)});const Uf=()=>{const{clientWidth:i,clientHeight:t}=ei;!i||!t||(Gi.aspect=i/t,Gi.updateProjectionMatrix(),Kl.setSize(i,t,!1))},eb=new ResizeObserver(Uf);eb.observe(ei);Uf();const nb=.08,Ff=()=>{ws.lerp(pl,nb);const i=nu.getValue();let t=0;for(let e=0;e<i.length;e+=1)t+=Math.abs(i[e]);t=Math.min(1,t/i.length),No.rotation.x+=.004+t*.02,No.rotation.y+=.006+ws.x*.04,No.scale.setScalar(1+t*.6),Lo.rotation.x-=.002+ws.y*.02,Lo.rotation.y+=.004,Lo.scale.setScalar(1.08+Math.sin(performance.now()*.001)*.05+t*.2),Uo.rotation.y+=.0015+t*.01,Uo.rotation.x+=ws.y*.01,Uo.material.opacity=.4+t*.45,Gi.position.x=ws.x*3.2,Gi.position.y=ws.y*2.4,Gi.lookAt(0,0,0),Kl.render(Ga,Gi),requestAnimationFrame(Ff)};Ff();
