import{o as ye,J as Ke,S as Z,i as q,s as G,C as Je,b as B,a as W,c as v,m as y,d as K,t as $,e as d,f as E,g as Ee,h as F,j as L,k as M,l as U,n as A,T as He,B as V,A as Ve,p as Ze,q as S,u as Le,r as re,v as z,w as I,x as J,y as O,z as Ae,D as Se,E as qe,F as ne,G as Ne,H as Ce,I as Ge,K as x,L as ee,M as Qe,N as Xe,O as Ye,P as xe,Q as R,R as Q,U as et,V as tt,W as Ie,X as Y,Y as nt,Z as rt,_ as ae,$ as ie}from"./vendor.48486bb1.js";const st=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))t(r);new MutationObserver(r=>{for(const l of r)if(l.type==="childList")for(const a of l.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&t(a)}).observe(document,{childList:!0,subtree:!0});function n(r){const l={};return r.integrity&&(l.integrity=r.integrity),r.referrerpolicy&&(l.referrerPolicy=r.referrerpolicy),r.crossorigin==="use-credentials"?l.credentials="include":r.crossorigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function t(r){if(r.ep)return;r.ep=!0;const l=n(r);fetch(r.href,l)}};st();function lt(s=""){const[e,n]=ot(s,/[\d~,]+$/);console.log("\u{1F680} ~ destructArgString ~ [lawName, query]",[e,n]);const t="[1-9][0-9]*",r=`(?:${t}-${t}|${t})`,l=`(?:${r}~${r}|~${r}|${r}~|${r})`;if(new RegExp(`^(${l}(?:,${l})*)$`).test(n)){const i=n.split(",").map(o=>{let c,u;if(new RegExp(`${r}~${r}`).test(o))[c,u]=o.split("~");else if(new RegExp(`~${r}`).test(o))u=o.substring(1);else if(new RegExp(`${r}~`).test(o))c=o.substring(0,o.length-1);else return o;return[c,u]});return{lawName:e,options:i}}else return{lawName:e,options:[null]}}function ot(s,e){const n=s.search(e);return n===-1?[s,""]:[s.substring(0,n),s.substring(n)]}async function at(){let s=!0;return await ye("law-db",1,{upgrade(e){console.log("upgrade"),e.createObjectStore("update-records"),e.createObjectStore("laws",{keyPath:"LawName"}),e.createObjectStore("aliases"),s=!1}}),s}async function Oe(){const e=await(await H()).transaction("update-records").store.openCursor(null,"prev");if(e)return{timestamp:e.key,date:e.value}}async function Pe(s){(await H()).put("update-records",s,Date.now())}async function Re(s){const n=(await H()).transaction("laws","readwrite");await Promise.all([...s.map(t=>n.store.put(t)),n.done])}async function it(){return await(await H()).getAll("laws")}async function Te(){const s=await H(),e=await s.getAllKeys("aliases"),n=s.transaction("aliases","readonly"),t={},r=e.map(async l=>{t[l]=await n.store.get(l)});return await Promise.all([...r,n.done]),t}async function ct(s,e){await(await H()).put("aliases",e,s)}async function se(s){const n=(await H()).transaction("aliases","readwrite");await Promise.all([...Object.entries(s).map(([t,r])=>n.store.put(r,t)),n.done])}async function H(){return await ye("law-db")}const ut="modulepreload",ce={},ft="/",De=function(e,n){return!n||n.length===0?e():Promise.all(n.map(t=>{if(t=`${ft}${t}`,t in ce)return;ce[t]=!0;const r=t.endsWith(".css"),l=r?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${t}"]${l}`))return;const a=document.createElement("link");if(a.rel=r?"stylesheet":ut,r||(a.as="script",a.crossOrigin=""),a.href=t,document.head.appendChild(a),r)return new Promise((i,o)=>{a.addEventListener("load",i),a.addEventListener("error",o)})})).then(()=>e())};let X;async function ze(){if(!X)try{await De(()=>import("./browser-polyfill.f16ed479.js").then(function(l){return l.b}),["assets/browser-polyfill.f16ed479.js","assets/vendor.48486bb1.js","assets/vendor.30b899a4.css"]),X="https://law.moj.gov.tw/api/Ch/Law/JSON"}catch{X="./assets/ChLaw.json.zip"}const e=await(await fetch(X)).blob(),t=await(await new Ke().loadAsync(e)).file("ChLaw.json").async("string");return JSON.parse(t.trim())}let le=!1,j,T,je=[];(async()=>{try{if(await at())j=await it(),T=await Te(),console.log(Object.keys(T)),j.forEach(e=>{e.LawAlias=T[e.LawName]});else{console.log("db not found, start initialize...");const e=await ze(),n=Be(e.Laws);T=n.aliases,j=n.laws,Pe(e.UpdateDate),Re(j),se(T)}le=!0,je.forEach(e=>{e()})}catch(s){console.log(s)}})();function Be(s){const e={};return s.forEach(n=>{n.LawArticles.forEach(t=>{t.ArticleNo=t.ArticleNo.slice(2,-2);const r=/\r\n(?![一二三四五六七八九十]{1,3}[、\s]|[┌┐├│]|(?:\s\s){0,1}第\s\d[\d\s]\s|（[一二三四五六七八九十]）|\s\s（[一二三四五六七八九十]）)/;t.ArticleContents=t.ArticleContent.split(r),n.LawAlias=[n.LawName],e[n.LawName]=[n.LawName]})}),{aliases:e,laws:s}}function Fe(s){if(le){s();return}je.push(s)}async function pt(){if(!le)throw new Error("Data is not loaded yet.");const[s,e]=await Promise.all([ze(),Oe()]);if(e&&e.date===s.UpdateDate)return{date:e.date,msg:"No need to update"};j=Be(s.Laws).laws,j.forEach(({LawName:a})=>{T.hasOwnProperty(a)||ct(a,[a])});const t=Pe(s.UpdateDate),r=Re(j),l=se(T);await Promise.all([t,r,l])}const te={PERFECT:10,CONNECTED:5,COUNT:1},D=",";async function $t(s){let e=null;const n=new RegExp(`^${s}${D}|${D}${s}${D}|${D}${s}$`);return Object.entries(T).some(([t,r])=>{const l=r.join(D).concat(",");if(n.test(l))return e=j.find(a=>a.LawName===t),!0}),e}async function Me(s,e){const t=j.filter(r=>{let l=0;const a=T[r.LawName].join(D).concat(",");return l+=new RegExp(`^${s}${D}|${D}${s}${D}|${D}${s}$`).test(a)?te.PERFECT:0,s.length>1&&(l+=new RegExp(s).test(a)?te.CONNECTED:0),l+=gt(a,`[${s}]`)*te.COUNT*Math.exp(-r.LawName.length),r.Score=l,l!==0}).sort((r,l)=>l.Score-r.Score);return e?t.slice(0,e):t}async function dt(s,e){if(Array.isArray(e))return mt(s,e[0],e[1]);if(typeof e=="string"){const n=_t(s,e);return n?[n]:[]}return s}function _t(s,e){return s.find(n=>n.ArticleNo===e)}function ue(s,e){return s.findIndex(n=>n.ArticleNo===e)}function mt(s,e,n){const t=s.length,r=ue(s,e),l=ue(s,n);let a=r<0?0:r,i=l>t-1||l===-1?t-1:l;if(a>i){const o=a;a=i,i=o}return s.slice(a,i+1)}function gt(s,e){return(s.match(new RegExp(e,"g"))||[]).length}function ht(s){let e,n,t,r;function l(o){s[6](o)}function a(o){s[7](o)}let i={disabled:!s[0],size:"sm",placeholder:s[0]?"\u641C\u5C0B":"\u8F09\u5165\u4E2D...",items:s[2]};return s[1]!==void 0&&(i.value=s[1]),s[3]!==void 0&&(i.ref=s[3]),e=new Je({props:i}),B.push(()=>W(e,"value",l)),B.push(()=>W(e,"ref",a)),{c(){v(e.$$.fragment)},m(o,c){y(e,o,c),r=!0},p(o,[c]){const u={};c&1&&(u.disabled=!o[0]),c&1&&(u.placeholder=o[0]?"\u641C\u5C0B":"\u8F09\u5165\u4E2D..."),c&4&&(u.items=o[2]),!n&&c&2&&(n=!0,u.value=o[1],K(()=>n=!1)),!t&&c&8&&(t=!0,u.ref=o[3],K(()=>t=!1)),e.$set(u)},i(o){r||($(e.$$.fragment,o),r=!0)},o(o){d(e.$$.fragment,o),r=!1},d(o){E(e,o)}}}function bt(s,e,n){let t,r=!1;Fe(()=>{n(0,r=!0)});const l=Ee();let a=[],i,o="";function c(){i.focus()}async function u(_){return r?await Me(_,5):void 0}async function m(_,b){if(!r)return;const N={name:"",articles:[]},f=await $t(_);if(!f)return;N.name=f.LawName;const h=b.map(async p=>await dt(f.LawArticles,p));for(const p of h){const g=await p;N.articles.push(...g)}return N}function w(_){o=_,n(1,o)}function C(_){i=_,n(3,i)}return s.$$.update=()=>{s.$$.dirty&2&&n(5,t=lt(o)),s.$$.dirty&35&&u(t.lawName).then(_=>{var N;if(!r)return;if(_.length===0){n(2,a=[]);return}const b=_.map(({LawName:f})=>({id:f,text:f}));if(t.lawName===b[0].text||((N=T[b[0].text])==null?void 0:N.includes(t.lawName))){b[0].text=b[0].text.concat(o.replace(t.lawName,"")),n(2,a=[b[0]]);return}if(o===""){n(2,a=b);return}n(2,a=[{id:-1,text:o},...b.slice(1)])}),s.$$.dirty&32&&m(t.lawName,t.options).then(_=>{_&&l("search",_)}).catch(_=>console.log(_))},[r,o,a,i,c,t,w,C]}class wt extends Z{constructor(e){super();q(this,e,bt,ht,G,{focus:4})}get focus(){return this.$$.ctx[4]}}function fe(s){let e,n,t,r;function l(o){s[6](o)}function a(o){s[7](o)}let i={labelText:s[0],children:s[2]};return s[3]!==void 0&&(i.activeId=s[3]),s[4]!==void 0&&(i.selectedIds=s[4]),e=new He({props:i}),B.push(()=>W(e,"activeId",l)),B.push(()=>W(e,"selectedIds",a)),s[8](e),{c(){v(e.$$.fragment)},m(o,c){y(e,o,c),r=!0},p(o,c){const u={};c&1&&(u.labelText=o[0]),c&4&&(u.children=o[2]),!n&&c&8&&(n=!0,u.activeId=o[3],K(()=>n=!1)),!t&&c&16&&(t=!0,u.selectedIds=o[4],K(()=>t=!1)),e.$set(u)},i(o){r||($(e.$$.fragment,o),r=!0)},o(o){d(e.$$.fragment,o),r=!1},d(o){s[8](null),E(e,o)}}}function kt(s){let e,n,t=s[0]&&fe(s);return{c(){t&&t.c(),e=F()},m(r,l){t&&t.m(r,l),L(r,e,l),n=!0},p(r,[l]){r[0]?t?(t.p(r,l),l&1&&$(t,1)):(t=fe(r),t.c(),$(t,1),t.m(e.parentNode,e)):t&&(M(),d(t,1,1,()=>{t=null}),U())},i(r){n||($(t),n=!0)},o(r){d(t),n=!1},d(r){t&&t.d(r),r&&A(e)}}}function vt(s){return s.map(({ArticleType:e,ArticleNo:n,ArticleContents:t},r)=>e==="C"?{id:r,text:t[0]}:{id:r,text:`\u7B2C ${n} \u689D`,children:t.map((l,a)=>({id:r.toString()+a,text:l}))})}function yt(s,e,n){let t,{name:r=null}=e,{articles:l=[]}=e,a="",i=[],o;function c(w){a=w,n(3,a)}function u(w){i=w,n(4,i)}function m(w){B[w?"unshift":"push"](()=>{o=w,n(1,o)})}return s.$$set=w=>{"name"in w&&n(0,r=w.name),"articles"in w&&n(5,l=w.articles)},s.$$.update=()=>{s.$$.dirty&32&&n(2,t=vt(l)),s.$$.dirty&38&&t.length<=100&&(o==null||o.expandAll())},[r,o,t,a,i,l,c,u,m]}class Et extends Z{constructor(e){super();q(this,e,yt,kt,G,{name:0,articles:5})}}const P=100,Ue=100;let We;De(()=>import("./browser-polyfill.f16ed479.js").then(function(s){return s.b}),["assets/browser-polyfill.f16ed479.js","assets/vendor.48486bb1.js","assets/vendor.30b899a4.css"]).then(s=>{We=s}).catch(s=>{console.log(s)});var pe=We;function $e(s,e,n){const t=s.slice();return t[12]=e[n],t[14]=n,t}function de(s,e,n){const t=s.slice();return t[15]=e[n],t[17]=n,t}function _e(s,e,n){const t=s.slice();return t[19]=e[n],t[20]=e,t[14]=n,t}function me(s){let e,n=s[14],t;const r=()=>s[8](e,n),l=()=>s[8](null,n);function a(...o){return s[9](s[14],...o)}let i={};return e=new wt({props:i}),r(),e.$on("search",a),{c(){v(e.$$.fragment)},m(o,c){y(e,o,c),t=!0},p(o,c){s=o,n!==s[14]&&(l(),n=s[14],r());const u={};e.$set(u)},i(o){t||($(e.$$.fragment,o),t=!0)},o(o){d(e.$$.fragment,o),t=!1},d(o){l(),E(e,o)}}}function Lt(s){let e,n;return e=new V({props:{size:"small",kind:"ghost",iconDescription:"Settings",icon:ne}}),e.$on("click",s[6]),{c(){v(e.$$.fragment)},m(t,r){y(e,t,r),n=!0},p:S,i(t){n||($(e.$$.fragment,t),n=!0)},o(t){d(e.$$.fragment,t),n=!1},d(t){E(e,t)}}}function At(s){return{c:S,m:S,p:S,i:S,o:S,d:S}}function St(s){let e,n,t=s[18]&&Nt(s);return{c(){t&&t.c(),e=I()},m(r,l){t&&t.m(r,l),L(r,e,l),n=!0},p(r,l){r[18]&&t.p(r,l)},i(r){n||($(t),n=!0)},o(r){d(t),n=!1},d(r){t&&t.d(r),r&&A(e)}}}function Nt(s){let e,n;return e=new Et({props:{name:s[12].name,articles:s[12].articles.slice(s[17]*P,(s[17]+1)*P)}}),{c(){v(e.$$.fragment)},m(t,r){y(e,t,r),n=!0},p(t,r){const l={};r&8&&(l.name=t[12].name),r&8&&(l.articles=t[12].articles.slice(t[17]*P,(t[17]+1)*P)),e.$set(l)},i(t){n||($(e.$$.fragment,t),n=!0)},o(t){d(e.$$.fragment,t),n=!1},d(t){E(e,t)}}}function Ct(s){return{c:S,m:S,p:S,i:S,o:S,d:S}}function ge(s){let e,n,t={ctx:s,current:null,token:null,hasCatch:!1,pending:Ct,then:St,catch:At,value:18,blocks:[,,,]};return Ne(s[7](),t),{c(){e=F(),t.block.c()},m(r,l){L(r,e,l),t.block.m(r,t.anchor=l),t.mount=()=>e.parentNode,t.anchor=e,n=!0},p(r,l){s=r,Le(t,s,l)},i(r){n||($(t.block),n=!0)},o(r){for(let l=0;l<3;l+=1){const a=t.blocks[l];d(a)}n=!1},d(r){r&&A(e),t.block.d(r),t.token=null,t=null}}}function he(s,e){let n,t,r,l=Array(Math.floor(e[12].articles.length/P)+1).fill(!0),a=[];for(let o=0;o<l.length;o+=1)a[o]=ge(de(e,l,o));const i=o=>d(a[o],1,1,()=>{a[o]=null});return{key:s,first:null,c(){n=F();for(let o=0;o<a.length;o+=1)a[o].c();t=F(),this.first=n},m(o,c){L(o,n,c);for(let u=0;u<a.length;u+=1)a[u].m(o,c);L(o,t,c),r=!0},p(o,c){if(e=o,c&136){l=Array(Math.floor(e[12].articles.length/P)+1).fill(!0);let u;for(u=0;u<l.length;u+=1){const m=de(e,l,u);a[u]?(a[u].p(m,c),$(a[u],1)):(a[u]=ge(m),a[u].c(),$(a[u],1),a[u].m(t.parentNode,t))}for(M(),u=l.length;u<a.length;u+=1)i(u);U()}},i(o){if(!r){for(let c=0;c<l.length;c+=1)$(a[c]);r=!0}},o(o){a=a.filter(Boolean);for(let c=0;c<a.length;c+=1)d(a[c]);r=!1},d(o){o&&A(n),re(a,o),o&&A(t)}}}function It(s){let e,n,t,r,l,a,i,o,c,u=[],m=new Map,w,C=s[1],_=[];for(let p=0;p<C.length;p+=1)_[p]=me(_e(s,C,p));const b=p=>d(_[p],1,1,()=>{_[p]=null});l=new V({props:{size:"small",iconDescription:"Add",icon:Ve}}),l.$on("click",s[4]),i=new V({props:{size:"small",iconDescription:"Remove",icon:Ze}}),i.$on("click",s[5]);let N=!s[0]&&Lt(s),f=s[3];const h=p=>p[14];for(let p=0;p<f.length;p+=1){let g=$e(s,f,p),k=h(g);m.set(k,u[p]=he(k,g))}return{c(){e=z("main"),n=z("div");for(let p=0;p<_.length;p+=1)_[p].c();t=I(),r=z("div"),v(l.$$.fragment),a=I(),v(i.$$.fragment),o=I(),N&&N.c(),c=I();for(let p=0;p<u.length;p+=1)u[p].c();J(e,"class","svelte-1qvtyzj")},m(p,g){L(p,e,g),O(e,n);for(let k=0;k<_.length;k+=1)_[k].m(n,null);O(e,t),O(e,r),y(l,r,null),O(r,a),y(i,r,null),O(r,o),N&&N.m(r,null),O(e,c);for(let k=0;k<u.length;k+=1)u[k].m(e,null);w=!0},p(p,[g]){if(g&14){C=p[1];let k;for(k=0;k<C.length;k+=1){const oe=_e(p,C,k);_[k]?(_[k].p(oe,g),$(_[k],1)):(_[k]=me(oe),_[k].c(),$(_[k],1),_[k].m(n,null))}for(M(),k=C.length;k<_.length;k+=1)b(k);U()}p[0]||N.p(p,g),g&136&&(f=p[3],M(),u=Ae(u,g,h,1,p,f,m,e,Ce,he,null,$e),U())},i(p){if(!w){for(let g=0;g<C.length;g+=1)$(_[g]);$(l.$$.fragment,p),$(i.$$.fragment,p),$(N);for(let g=0;g<f.length;g+=1)$(u[g]);w=!0}},o(p){_=_.filter(Boolean);for(let g=0;g<_.length;g+=1)d(_[g]);d(l.$$.fragment,p),d(i.$$.fragment,p),d(N);for(let g=0;g<u.length;g+=1)d(u[g]);w=!1},d(p){p&&A(e),re(_,p),E(l),E(i),N&&N.d();for(let g=0;g<u.length;g+=1)u[g].d()}}}let Ot=0;function Pt(s,e,n){Se(()=>{window.onunhandledrejection=b=>{console.log("we got exception, but the app has crashed",b)}});let t=[0],r=[],l=!0,a=[];const i=!1,o=Ee();qe("s",b=>{!l||(r[Ot].focus(),l=!1,b.preventDefault())});function c(){t.push(0),n(1,t)}function u(){t.pop(),r.pop(),a.pop(),n(1,t),n(3,a)}function m(){if(pe){pe.runtime.openOptionsPage();return}o("openOptions")}function w(){return new Promise(b=>{setTimeout(()=>{b(!0)},Ue)})}function C(b,N){B[b?"unshift":"push"](()=>{r[N]=b,n(2,r)})}return[i,t,r,a,c,u,m,w,C,(b,N)=>{n(3,a[b]=N.detail,a)}]}class Rt extends Z{constructor(e){super();q(this,e,Pt,It,G,{isWebpage:0})}get isWebpage(){return this.$$.ctx[0]}}function be(s,e,n){const t=s.slice();return t[14]=e[n],t[16]=n,t}function we(s,e,n){const t=s.slice();return t[18]=e[n].name,t[19]=e[n].alias,t[20]=e,t[21]=n,t}function Tt(s){let e,n,t,r,l,a;return e=new x({props:{label:"\u6CD5\u898F\u5225\u540D"}}),t=new x({props:{label:"\u6CD5\u898F\u66F4\u65B0"}}),l=new x({props:{label:"\u5176\u4ED6"}}),{c(){v(e.$$.fragment),n=I(),v(t.$$.fragment),r=I(),v(l.$$.fragment)},m(i,o){y(e,i,o),L(i,n,o),y(t,i,o),L(i,r,o),y(l,i,o),a=!0},p:S,i(i){a||($(e.$$.fragment,i),$(t.$$.fragment,i),$(l.$$.fragment,i),a=!0)},o(i){d(e.$$.fragment,i),d(t.$$.fragment,i),d(l.$$.fragment,i),a=!1},d(i){E(e,i),i&&A(n),E(t,i),i&&A(r),E(l,i)}}}function Dt(s){let e;return{c(){e=R("\u5132\u5B58")},m(n,t){L(n,e,t)},d(n){n&&A(e)}}}function zt(s){let e;return{c(){e=R("\u6CD5\u898F")},m(n,t){L(n,e,t)},d(n){n&&A(e)}}}function jt(s){let e;return{c(){e=R("\u5225\u540D")},m(n,t){L(n,e,t)},d(n){n&&A(e)}}}function Bt(s){let e,n,t,r;return e=new Y({props:{head:!0,$$slots:{default:[zt]},$$scope:{ctx:s}}}),t=new Y({props:{head:!0,$$slots:{default:[jt]},$$scope:{ctx:s}}}),{c(){v(e.$$.fragment),n=I(),v(t.$$.fragment)},m(l,a){y(e,l,a),L(l,n,a),y(t,l,a),r=!0},p(l,a){const i={};a&4194304&&(i.$$scope={dirty:a,ctx:l}),e.$set(i);const o={};a&4194304&&(o.$$scope={dirty:a,ctx:l}),t.$set(o)},i(l){r||($(e.$$.fragment,l),$(t.$$.fragment,l),r=!0)},o(l){d(e.$$.fragment,l),d(t.$$.fragment,l),r=!1},d(l){E(e,l),l&&A(n),E(t,l)}}}function Ft(s){let e,n;return e=new Ie({props:{head:!0,$$slots:{default:[Bt]},$$scope:{ctx:s}}}),{c(){v(e.$$.fragment)},m(t,r){y(e,t,r),n=!0},p(t,r){const l={};r&4194304&&(l.$$scope={dirty:r,ctx:t}),e.$set(l)},i(t){n||($(e.$$.fragment,t),n=!0)},o(t){d(e.$$.fragment,t),n=!1},d(t){E(e,t)}}}function Mt(s){let e,n,t=Array(Math.floor(s[2].length/P)+1).fill(!0),r=[];for(let a=0;a<t.length;a+=1)r[a]=ve(be(s,t,a));const l=a=>d(r[a],1,1,()=>{r[a]=null});return{c(){for(let a=0;a<r.length;a+=1)r[a].c();e=F()},m(a,i){for(let o=0;o<r.length;o+=1)r[o].m(a,i);L(a,e,i),n=!0},p(a,i){if(i&524){t=Array(Math.floor(a[2].length/P)+1).fill(!0);let o;for(o=0;o<t.length;o+=1){const c=be(a,t,o);r[o]?(r[o].p(c,i),$(r[o],1)):(r[o]=ve(c),r[o].c(),$(r[o],1),r[o].m(e.parentNode,e))}for(M(),o=t.length;o<r.length;o+=1)l(o);U()}},i(a){if(!n){for(let i=0;i<t.length;i+=1)$(r[i]);n=!0}},o(a){r=r.filter(Boolean);for(let i=0;i<r.length;i+=1)d(r[i]);n=!1},d(a){re(r,a),a&&A(e)}}}function Ut(s){let e,n,t,r;return{c(){e=z("div"),n=R('\u6C92\u6709\u95DC\u65BC"'),t=R(s[1]),r=R('"\u7684\u6CD5\u898F'),J(e,"class","not-found svelte-1l4rbpi")},m(l,a){L(l,e,a),O(e,n),O(e,t),O(e,r)},p(l,a){a&2&&Q(t,l[1])},i:S,o:S,d(l){l&&A(e)}}}function Wt(s){return{c:S,m:S,p:S,i:S,o:S,d:S}}function Kt(s){let e=[],n=new Map,t,r,l=s[2].slice(s[16]*P,(s[16]+1)*P);const a=i=>i[18];for(let i=0;i<l.length;i+=1){let o=we(s,l,i),c=a(o);n.set(c,e[i]=ke(c,o))}return{c(){for(let i=0;i<e.length;i+=1)e[i].c();t=I()},m(i,o){for(let c=0;c<e.length;c+=1)e[c].m(i,o);L(i,t,o),r=!0},p(i,o){o&12&&(l=i[2].slice(i[16]*P,(i[16]+1)*P),M(),e=Ae(e,o,a,1,i,l,n,t.parentNode,Ce,ke,t,we),U())},i(i){if(!r){for(let o=0;o<l.length;o+=1)$(e[o]);r=!0}},o(i){for(let o=0;o<e.length;o+=1)d(e[o]);r=!1},d(i){for(let o=0;o<e.length;o+=1)e[o].d(i);i&&A(t)}}}function Jt(s){let e=s[18]+"",n;return{c(){n=R(e)},m(t,r){L(t,n,r)},p(t,r){r&4&&e!==(e=t[18]+"")&&Q(n,e)},d(t){t&&A(n)}}}function Ht(s){let e,n,t;function r(a){s[12](a,s[18])}let l={placeholder:"\u8ACB\u4EE5<,>\u9032\u884C\u5206\u9694",value:s[19]};return s[3][s[18]]!==void 0&&(l.ref=s[3][s[18]]),e=new nt({props:l}),B.push(()=>W(e,"ref",r)),{c(){v(e.$$.fragment)},m(a,i){y(e,a,i),t=!0},p(a,i){s=a;const o={};i&4&&(o.value=s[19]),!n&&i&12&&(n=!0,o.ref=s[3][s[18]],K(()=>n=!1)),e.$set(o)},i(a){t||($(e.$$.fragment,a),t=!0)},o(a){d(e.$$.fragment,a),t=!1},d(a){E(e,a)}}}function Vt(s){let e,n,t,r;return e=new Y({props:{$$slots:{default:[Jt]},$$scope:{ctx:s}}}),t=new Y({props:{$$slots:{default:[Ht]},$$scope:{ctx:s}}}),{c(){v(e.$$.fragment),n=I(),v(t.$$.fragment)},m(l,a){y(e,l,a),L(l,n,a),y(t,l,a),r=!0},p(l,a){const i={};a&4194308&&(i.$$scope={dirty:a,ctx:l}),e.$set(i);const o={};a&4194316&&(o.$$scope={dirty:a,ctx:l}),t.$set(o)},i(l){r||($(e.$$.fragment,l),$(t.$$.fragment,l),r=!0)},o(l){d(e.$$.fragment,l),d(t.$$.fragment,l),r=!1},d(l){E(e,l),l&&A(n),E(t,l)}}}function ke(s,e){let n,t,r;return t=new Ie({props:{label:!0,for:"row-"+e[18],$$slots:{default:[Vt]},$$scope:{ctx:e}}}),{key:s,first:null,c(){n=F(),v(t.$$.fragment),this.first=n},m(l,a){L(l,n,a),y(t,l,a),r=!0},p(l,a){e=l;const i={};a&4&&(i.for="row-"+e[18]),a&4194316&&(i.$$scope={dirty:a,ctx:e}),t.$set(i)},i(l){r||($(t.$$.fragment,l),r=!0)},o(l){d(t.$$.fragment,l),r=!1},d(l){l&&A(n),E(t,l)}}}function Zt(s){return{c:S,m:S,p:S,i:S,o:S,d:S}}function ve(s){let e,n,t={ctx:s,current:null,token:null,hasCatch:!1,pending:Zt,then:Kt,catch:Wt,value:17,blocks:[,,,]};return Ne(s[9](s[16]),t),{c(){e=F(),t.block.c()},m(r,l){L(r,e,l),t.block.m(r,t.anchor=l),t.mount=()=>e.parentNode,t.anchor=e,n=!0},p(r,l){s=r,Le(t,s,l)},i(r){n||($(t.block),n=!0)},o(r){for(let l=0;l<3;l+=1){const a=t.blocks[l];d(a)}n=!1},d(r){r&&A(e),t.block.d(r),t.token=null,t=null}}}function qt(s){let e,n,t,r;const l=[Ut,Mt],a=[];function i(o,c){return o[2].length===0?0:1}return e=i(s),n=a[e]=l[e](s),{c(){n.c(),t=F()},m(o,c){a[e].m(o,c),L(o,t,c),r=!0},p(o,c){let u=e;e=i(o),e===u?a[e].p(o,c):(M(),d(a[u],1,1,()=>{a[u]=null}),U(),n=a[e],n?n.p(o,c):(n=a[e]=l[e](o),n.c()),$(n,1),n.m(t.parentNode,t))},i(o){r||($(n),r=!0)},o(o){d(n),r=!1},d(o){a[e].d(o),o&&A(t)}}}function Gt(s){let e,n,t,r;return e=new et({props:{$$slots:{default:[Ft]},$$scope:{ctx:s}}}),t=new tt({props:{$$slots:{default:[qt]},$$scope:{ctx:s}}}),{c(){v(e.$$.fragment),n=I(),v(t.$$.fragment)},m(l,a){y(e,l,a),L(l,n,a),y(t,l,a),r=!0},p(l,a){const i={};a&4194304&&(i.$$scope={dirty:a,ctx:l}),e.$set(i);const o={};a&4194318&&(o.$$scope={dirty:a,ctx:l}),t.$set(o)},i(l){r||($(e.$$.fragment,l),$(t.$$.fragment,l),r=!0)},o(l){d(e.$$.fragment,l),d(t.$$.fragment,l),r=!1},d(l){E(e,l),l&&A(n),E(t,l)}}}function Qt(s){let e,n,t,r,l,a,i,o;function c(m){s[11](m)}let u={disabled:!s[0],placeholder:s[0]?"\u641C\u5C0B\u6CD5\u898F\u540D\u7A31\u6216\u5225\u540D":"\u8F09\u5165\u4E2D...",autofocus:!0};return s[1]!==void 0&&(u.value=s[1]),n=new Qe({props:u}),B.push(()=>W(n,"value",c)),l=new V({props:{size:"small",icon:Xe,disabled:s[4],$$slots:{default:[Dt]},$$scope:{ctx:s}}}),l.$on("click",s[7]),i=new Ye({props:{condensed:!0,$$slots:{default:[Gt]},$$scope:{ctx:s}}}),{c(){e=z("content"),v(n.$$.fragment),r=I(),v(l.$$.fragment),a=I(),v(i.$$.fragment),J(e,"class","svelte-1l4rbpi")},m(m,w){L(m,e,w),y(n,e,null),O(e,r),y(l,e,null),O(e,a),y(i,e,null),o=!0},p(m,w){const C={};w&1&&(C.disabled=!m[0]),w&1&&(C.placeholder=m[0]?"\u641C\u5C0B\u6CD5\u898F\u540D\u7A31\u6216\u5225\u540D":"\u8F09\u5165\u4E2D..."),!t&&w&2&&(t=!0,C.value=m[1],K(()=>t=!1)),n.$set(C);const _={};w&16&&(_.disabled=m[4]),w&4194304&&(_.$$scope={dirty:w,ctx:m}),l.$set(_);const b={};w&4194318&&(b.$$scope={dirty:w,ctx:m}),i.$set(b)},i(m){o||($(n.$$.fragment,m),$(l.$$.fragment,m),$(i.$$.fragment,m),o=!0)},o(m){d(n.$$.fragment,m),d(l.$$.fragment,m),d(i.$$.fragment,m),o=!1},d(m){m&&A(e),E(n),E(l),E(i)}}}function Xt(s){let e=s[5]?"\u4E0B\u8F09\u4E2D...":"\u66F4\u65B0\u6CD5\u898F",n;return{c(){n=R(e)},m(t,r){L(t,n,r)},p(t,r){r&32&&e!==(e=t[5]?"\u4E0B\u8F09\u4E2D...":"\u66F4\u65B0\u6CD5\u898F")&&Q(n,e)},d(t){t&&A(n)}}}function Yt(s){let e,n,t,r,l,a;return n=new V({props:{icon:xe,disabled:s[5],$$slots:{default:[Xt]},$$scope:{ctx:s}}}),n.$on("click",s[8]),{c(){e=z("content"),v(n.$$.fragment),t=I(),r=z("p"),l=R(s[6]),J(e,"class","svelte-1l4rbpi")},m(i,o){L(i,e,o),y(n,e,null),O(e,t),O(e,r),O(r,l),a=!0},p(i,o){const c={};o&32&&(c.disabled=i[5]),o&4194336&&(c.$$scope={dirty:o,ctx:i}),n.$set(c),(!a||o&64)&&Q(l,i[6])},i(i){a||($(n.$$.fragment,i),a=!0)},o(i){d(n.$$.fragment,i),a=!1},d(i){i&&A(e),E(n)}}}function xt(s){let e;return{c(){e=R("Content 3")},m(n,t){L(n,e,t)},d(n){n&&A(e)}}}function en(s){let e,n,t,r,l,a;return e=new ee({props:{$$slots:{default:[Qt]},$$scope:{ctx:s}}}),t=new ee({props:{$$slots:{default:[Yt]},$$scope:{ctx:s}}}),l=new ee({props:{$$slots:{default:[xt]},$$scope:{ctx:s}}}),{c(){v(e.$$.fragment),n=I(),v(t.$$.fragment),r=I(),v(l.$$.fragment)},m(i,o){y(e,i,o),L(i,n,o),y(t,i,o),L(i,r,o),y(l,i,o),a=!0},p(i,o){const c={};o&4194335&&(c.$$scope={dirty:o,ctx:i}),e.$set(c);const u={};o&4194400&&(u.$$scope={dirty:o,ctx:i}),t.$set(u);const m={};o&4194304&&(m.$$scope={dirty:o,ctx:i}),l.$set(m)},i(i){a||($(e.$$.fragment,i),$(t.$$.fragment,i),$(l.$$.fragment,i),a=!0)},o(i){d(e.$$.fragment,i),d(t.$$.fragment,i),d(l.$$.fragment,i),a=!1},d(i){E(e,i),i&&A(n),E(t,i),i&&A(r),E(l,i)}}}function tn(s){let e,n,t;return n=new Ge({props:{autoWidth:!0,$$slots:{content:[en],default:[Tt]},$$scope:{ctx:s}}}),{c(){e=z("main"),v(n.$$.fragment),J(e,"class","svelte-1l4rbpi")},m(r,l){L(r,e,l),y(n,e,null),t=!0},p(r,[l]){const a={};l&4194431&&(a.$$scope={dirty:l,ctx:r}),n.$set(a)},i(r){t||($(n.$$.fragment,r),t=!0)},o(r){d(n.$$.fragment,r),t=!1},d(r){r&&A(e),E(n)}}}function nn(s,e,n){let t=!1;Fe(()=>{n(0,t=!0),Te().then(f=>{const h=[];for(const p in f){let g="";f[p].length>1&&(g=f[p].slice(1).join(",").concat(",")),h.push({name:p,alias:g})}n(2,l=h),n(10,c=f)}),Oe().then(f=>{if(f){const h=new Date(f.timestamp).toLocaleString();n(6,u=`\u6700\u5F8C\u4E00\u6B21\u66F4\u65B0\u6642\u9593\uFF1A${h}\uFF08${f.date}\u7248\uFF09`)}})}),Se(()=>{window.onunhandledrejection=f=>{console.log("we got exception, but the app has crashed",f)}});let r="",l=[],a={},i=!1,o=!1,c,u="";async function m(f){return t?await Me(f):void 0}async function w(){n(4,i=!0);const f={};Object.keys(a).forEach(h=>{if(a[h]){const p=a[h].value,g=[h,...p.split(",").filter(k=>k.length>0)];g!==c[h]&&(f[h]=g)}});try{await se(f),n(10,c=f),console.log("saved")}catch(h){console.log(h)}finally{n(4,i=!1)}}async function C(){n(5,o=!0);try{const{date:f,msg:h}=await pt();h==="No need to update"?n(6,u=`\u6CD5\u898F\u5DF2\u662F\u6700\u65B0\u7248\u672C\uFF08${f}\u7248\uFF09`):n(6,u=`\u6CD5\u898F\u66F4\u65B0\u6210\u529F\uFF08${f}\u7248\uFF09`)}catch(f){n(6,u="\u6CD5\u898F\u66F4\u65B0\u5931\u6557:("),console.log(f)}finally{n(5,o=!1)}}function _(f){return f===0?new Promise(h=>{h(!0)}):new Promise(h=>{setTimeout(()=>{h(!0)},Ue)})}function b(f){r=f,n(1,r)}function N(f,h){s.$$.not_equal(a[h],f)&&(a[h]=f,n(3,a))}return s.$$.update=()=>{s.$$.dirty&1027&&m(r).then(f=>{!t||n(2,l=f.map(({LawName:h})=>{let p="";return c&&c[h].length>1&&(p=c[h].slice(1).join(",").concat(",")),{name:h,alias:p}}))})},[t,r,l,a,i,o,u,w,C,_,c,b,N]}class rn extends Z{constructor(e){super();q(this,e,nn,tn,G,{})}}function sn(s){let e=s[2]==="popup"?"\u8A2D\u5B9A\u9801\u9762":"\u641C\u5C0B\u9801\u9762",n;return{c(){n=R(e)},m(t,r){L(t,n,r)},p(t,r){r&4&&e!==(e=t[2]==="popup"?"\u8A2D\u5B9A\u9801\u9762":"\u641C\u5C0B\u9801\u9762")&&Q(n,e)},d(t){t&&A(n)}}}function ln(s){let e,n;return e=new rn({}),{c(){v(e.$$.fragment)},m(t,r){y(e,t,r),n=!0},i(t){n||($(e.$$.fragment,t),n=!0)},o(t){d(e.$$.fragment,t),n=!1},d(t){E(e,t)}}}function on(s){let e,n;return e=new Rt({props:{isWebpage:!0}}),{c(){v(e.$$.fragment)},m(t,r){y(e,t,r),n=!0},i(t){n||($(e.$$.fragment,t),n=!0)},o(t){d(e.$$.fragment,t),n=!1},d(t){E(e,t)}}}function an(s){let e,n,t,r,l,a,i,o,c,u,m;function w(f){s[3](f)}let C={};s[0]!==void 0&&(C.size=s[0]),e=new rt({props:C}),B.push(()=>W(e,"size",w)),e.$on("match",s[4]),l=new V({props:{size:"small",kind:"secondary",icon:s[2]==="popup"?ne:ae,$$slots:{default:[sn]},$$scope:{ctx:s}}}),l.$on("click",s[5]);const _=[on,ln],b=[];function N(f,h){return f[2]==="popup"?0:1}return o=N(s),c=b[o]=_[o](s),{c(){v(e.$$.fragment),t=I(),r=z("main"),v(l.$$.fragment),a=I(),i=z("section"),c.c(),J(i,"class",u=ie(s[0])+" svelte-1a44pmk")},m(f,h){y(e,f,h),L(f,t,h),L(f,r,h),y(l,r,null),O(r,a),O(r,i),b[o].m(i,null),m=!0},p(f,[h]){const p={};!n&&h&1&&(n=!0,p.size=f[0],K(()=>n=!1)),e.$set(p);const g={};h&4&&(g.icon=f[2]==="popup"?ne:ae),h&68&&(g.$$scope={dirty:h,ctx:f}),l.$set(g);let k=o;o=N(f),o!==k&&(M(),d(b[k],1,1,()=>{b[k]=null}),U(),c=b[o],c||(c=b[o]=_[o](f),c.c()),$(c,1),c.m(i,null)),(!m||h&1&&u!==(u=ie(f[0])+" svelte-1a44pmk"))&&J(i,"class",u)},i(f){m||($(e.$$.fragment,f),$(l.$$.fragment,f),$(c),m=!0)},o(f){d(e.$$.fragment,f),d(l.$$.fragment,f),d(c),m=!1},d(f){E(e,f),f&&A(t),f&&A(r),E(l),b[o].d()}}}function cn(s,e,n){let t,r=[],l="popup";function a(c){t=c,n(0,t)}return[t,r,l,a,c=>n(1,r=[...r,c.detail]),()=>{n(2,l=l==="popup"?"options":"popup")}]}class un extends Z{constructor(e){super();q(this,e,cn,an,G,{})}}new un({target:document.getElementById("app")});