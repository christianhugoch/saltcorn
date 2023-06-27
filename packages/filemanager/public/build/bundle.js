var app=function(){"use strict";function e(){}function t(e){return e()}function n(){return Object.create(null)}function l(e){e.forEach(t)}function o(e){return"function"==typeof e}function c(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}let i,r;function a(e,t){return i||(i=document.createElement("a")),i.href=t,e===i.href}function s(e,t){e.appendChild(t)}function f(e,t,n){e.insertBefore(t,n||null)}function u(e){e.parentNode.removeChild(e)}function m(e,t){for(let n=0;n<e.length;n+=1)e[n]&&e[n].d(t)}function d(e){return document.createElement(e)}function p(e){return document.createElementNS("http://www.w3.org/2000/svg",e)}function h(e){return document.createTextNode(e)}function g(){return h(" ")}function v(){return h("")}function $(e,t,n,l){return e.addEventListener(t,n,l),()=>e.removeEventListener(t,n,l)}function _(e,t,n){null==n?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function y(e,t){t=""+t,e.wholeText!==t&&(e.data=t)}function w(e,t,n,l){null===n?e.style.removeProperty(t):e.style.setProperty(t,n,l?"important":"")}function z(e,t,n){e.classList[n?"add":"remove"](t)}function b(e){r=e}function x(e){(function(){if(!r)throw new Error("Function called outside component initialization");return r})().$$.on_mount.push(e)}const C=[],H=[],V=[],L=[],M=Promise.resolve();let k=!1;function N(e){V.push(e)}const D=new Set;let O=0;function R(){const e=r;do{for(;O<C.length;){const e=C[O];O++,b(e),S(e.$$)}for(b(null),C.length=0,O=0;H.length;)H.pop()();for(let e=0;e<V.length;e+=1){const t=V[e];D.has(t)||(D.add(t),t())}V.length=0}while(C.length);for(;L.length;)L.pop()();k=!1,D.clear(),b(e)}function S(e){if(null!==e.fragment){e.update(),l(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(N)}}const A=new Set;let E;function j(){E={r:0,c:[],p:E}}function W(){E.r||l(E.c),E=E.p}function B(e,t){e&&e.i&&(A.delete(e),e.i(t))}function F(e,t,n,l){if(e&&e.o){if(A.has(e))return;A.add(e),E.c.push((()=>{A.delete(e),l&&(n&&e.d(1),l())})),e.o(t)}else l&&l()}function X(e){e&&e.c()}function P(e,n,c,i){const{fragment:r,on_mount:a,on_destroy:s,after_update:f}=e.$$;r&&r.m(n,c),i||N((()=>{const n=a.map(t).filter(o);s?s.push(...n):l(n),e.$$.on_mount=[]})),f.forEach(N)}function U(e,t){const n=e.$$;null!==n.fragment&&(l(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function T(e,t){-1===e.$$.dirty[0]&&(C.push(e),k||(k=!0,M.then(R)),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function q(t,o,c,i,a,s,f,m=[-1]){const d=r;b(t);const p=t.$$={fragment:null,ctx:null,props:s,update:e,not_equal:a,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(o.context||(d?d.$$.context:[])),callbacks:n(),dirty:m,skip_bound:!1,root:o.target||d.$$.root};f&&f(p.root);let h=!1;if(p.ctx=c?c(t,o.props||{},((e,n,...l)=>{const o=l.length?l[0]:n;return p.ctx&&a(p.ctx[e],p.ctx[e]=o)&&(!p.skip_bound&&p.bound[e]&&p.bound[e](o),h&&T(t,e)),n})):[],p.update(),h=!0,l(p.before_update),p.fragment=!!i&&i(p.ctx),o.target){if(o.hydrate){const e=function(e){return Array.from(e.childNodes)}(o.target);p.fragment&&p.fragment.l(e),e.forEach(u)}else p.fragment&&p.fragment.c();o.intro&&B(t.$$.fragment),P(t,o.target,o.anchor,o.customElement),R()}b(d)}class I{$destroy(){U(this,1),this.$destroy=e}$on(e,t){const n=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return n.push(t),()=>{const e=n.indexOf(t);-1!==e&&n.splice(e,1)}}$set(e){var t;this.$$set&&(t=e,0!==Object.keys(t).length)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}const Y=parseFloat;function K(e,t=";"){let n;if(Array.isArray(e))n=e.filter((e=>e));else{n=[];for(const t in e)e[t]&&n.push(`${t}:${e[t]}`)}return n.join(t)}function Z(e){let t,n,l,o,c,i,r,a;function m(e,t){return"string"==typeof e[10][4]?G:J}let d=m(e),h=d(e);return{c(){t=p("svg"),n=p("g"),l=p("g"),h.c(),_(l,"transform",e[12]),_(n,"transform",o="translate("+e[10][0]/2+" "+e[10][1]/2+")"),_(n,"transform-origin",c=e[10][0]/4+" 0"),_(t,"id",i=e[1]||void 0),_(t,"class",r="svelte-fa "+e[0]+" svelte-1cj2gr0"),_(t,"style",e[11]),_(t,"viewBox",a="0 0 "+e[10][0]+" "+e[10][1]),_(t,"aria-hidden","true"),_(t,"role","img"),_(t,"xmlns","http://www.w3.org/2000/svg"),z(t,"pulse",e[4]),z(t,"spin",e[3])},m(e,o){f(e,t,o),s(t,n),s(n,l),h.m(l,null)},p(e,s){d===(d=m(e))&&h?h.p(e,s):(h.d(1),h=d(e),h&&(h.c(),h.m(l,null))),4096&s&&_(l,"transform",e[12]),1024&s&&o!==(o="translate("+e[10][0]/2+" "+e[10][1]/2+")")&&_(n,"transform",o),1024&s&&c!==(c=e[10][0]/4+" 0")&&_(n,"transform-origin",c),2&s&&i!==(i=e[1]||void 0)&&_(t,"id",i),1&s&&r!==(r="svelte-fa "+e[0]+" svelte-1cj2gr0")&&_(t,"class",r),2048&s&&_(t,"style",e[11]),1024&s&&a!==(a="0 0 "+e[10][0]+" "+e[10][1])&&_(t,"viewBox",a),17&s&&z(t,"pulse",e[4]),9&s&&z(t,"spin",e[3])},d(e){e&&u(t),h.d()}}}function J(e){let t,n,l,o,c,i,r,a,s,m;return{c(){t=p("path"),i=p("path"),_(t,"d",n=e[10][4][0]),_(t,"fill",l=e[6]||e[2]||"currentColor"),_(t,"fill-opacity",o=0!=e[9]?e[7]:e[8]),_(t,"transform",c="translate("+e[10][0]/-2+" "+e[10][1]/-2+")"),_(i,"d",r=e[10][4][1]),_(i,"fill",a=e[5]||e[2]||"currentColor"),_(i,"fill-opacity",s=0!=e[9]?e[8]:e[7]),_(i,"transform",m="translate("+e[10][0]/-2+" "+e[10][1]/-2+")")},m(e,n){f(e,t,n),f(e,i,n)},p(e,f){1024&f&&n!==(n=e[10][4][0])&&_(t,"d",n),68&f&&l!==(l=e[6]||e[2]||"currentColor")&&_(t,"fill",l),896&f&&o!==(o=0!=e[9]?e[7]:e[8])&&_(t,"fill-opacity",o),1024&f&&c!==(c="translate("+e[10][0]/-2+" "+e[10][1]/-2+")")&&_(t,"transform",c),1024&f&&r!==(r=e[10][4][1])&&_(i,"d",r),36&f&&a!==(a=e[5]||e[2]||"currentColor")&&_(i,"fill",a),896&f&&s!==(s=0!=e[9]?e[8]:e[7])&&_(i,"fill-opacity",s),1024&f&&m!==(m="translate("+e[10][0]/-2+" "+e[10][1]/-2+")")&&_(i,"transform",m)},d(e){e&&u(t),e&&u(i)}}}function G(e){let t,n,l,o;return{c(){t=p("path"),_(t,"d",n=e[10][4]),_(t,"fill",l=e[2]||e[5]||"currentColor"),_(t,"transform",o="translate("+e[10][0]/-2+" "+e[10][1]/-2+")")},m(e,n){f(e,t,n)},p(e,c){1024&c&&n!==(n=e[10][4])&&_(t,"d",n),36&c&&l!==(l=e[2]||e[5]||"currentColor")&&_(t,"fill",l),1024&c&&o!==(o="translate("+e[10][0]/-2+" "+e[10][1]/-2+")")&&_(t,"transform",o)},d(e){e&&u(t)}}}function Q(t){let n,l=t[10][4]&&Z(t);return{c(){l&&l.c(),n=v()},m(e,t){l&&l.m(e,t),f(e,n,t)},p(e,[t]){e[10][4]?l?l.p(e,t):(l=Z(e),l.c(),l.m(n.parentNode,n)):l&&(l.d(1),l=null)},i:e,o:e,d(e){l&&l.d(e),e&&u(n)}}}function ee(e,t,n){let l,o,c,{class:i=""}=t,{id:r=""}=t,{style:a=""}=t,{icon:s}=t,{size:f=""}=t,{color:u=""}=t,{fw:m=!1}=t,{pull:d=""}=t,{scale:p=1}=t,{translateX:h=0}=t,{translateY:g=0}=t,{rotate:v=""}=t,{flip:$=!1}=t,{spin:_=!1}=t,{pulse:y=!1}=t,{primaryColor:w=""}=t,{secondaryColor:z=""}=t,{primaryOpacity:b=1}=t,{secondaryOpacity:x=.4}=t,{swapOpacity:C=!1}=t;return e.$$set=e=>{"class"in e&&n(0,i=e.class),"id"in e&&n(1,r=e.id),"style"in e&&n(13,a=e.style),"icon"in e&&n(14,s=e.icon),"size"in e&&n(15,f=e.size),"color"in e&&n(2,u=e.color),"fw"in e&&n(16,m=e.fw),"pull"in e&&n(17,d=e.pull),"scale"in e&&n(18,p=e.scale),"translateX"in e&&n(19,h=e.translateX),"translateY"in e&&n(20,g=e.translateY),"rotate"in e&&n(21,v=e.rotate),"flip"in e&&n(22,$=e.flip),"spin"in e&&n(3,_=e.spin),"pulse"in e&&n(4,y=e.pulse),"primaryColor"in e&&n(5,w=e.primaryColor),"secondaryColor"in e&&n(6,z=e.secondaryColor),"primaryOpacity"in e&&n(7,b=e.primaryOpacity),"secondaryOpacity"in e&&n(8,x=e.secondaryOpacity),"swapOpacity"in e&&n(9,C=e.swapOpacity)},e.$$.update=()=>{16384&e.$$.dirty&&n(10,l=s&&s.icon||[0,0,"",[],""]),237568&e.$$.dirty&&n(11,o=function(e,t,n,l){let o,c,i,r,a,s="-.125em";return l&&(a="center",c="1.25em"),n&&(o=n),t&&("lg"==t?(r="1.33333em",i=".75em",s="-.225em"):r="xs"==t?".75em":"sm"==t?".875em":t.replace("x","em")),K([K({float:o,width:c,height:"1em","line-height":i,"font-size":r,"text-align":a,"vertical-align":s,"transform-origin":"center",overflow:"visible"}),e])}(a,f,d,m)),8126464&e.$$.dirty&&n(12,c=function(e,t,n,l,o,c=1,i="",r=""){let a=1,s=1;return o&&("horizontal"==o?a=-1:"vertical"==o?s=-1:a=s=-1),K([`translate(${Y(t)*c}${i},${Y(n)*c}${i})`,`scale(${a*Y(e)},${s*Y(e)})`,l&&`rotate(${l}${r})`]," ")}(p,h,g,v,$,512))},[i,r,u,_,y,w,z,b,x,C,l,o,c,a,s,f,m,d,p,h,g,v,$]}class te extends I{constructor(e){super(),q(this,e,ee,Q,c,{class:0,id:1,style:13,icon:14,size:15,color:2,fw:16,pull:17,scale:18,translateX:19,translateY:20,rotate:21,flip:22,spin:3,pulse:4,primaryColor:5,secondaryColor:6,primaryOpacity:7,secondaryOpacity:8,swapOpacity:9})}}
/*!
     * Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com
     * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
     */var ne={prefix:"fas",iconName:"caret-down",icon:[320,512,[],"f0d7","M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"]},le={prefix:"fas",iconName:"caret-up",icon:[320,512,[],"f0d8","M288.662 352H31.338c-17.818 0-26.741-21.543-14.142-34.142l128.662-128.662c7.81-7.81 20.474-7.81 28.284 0l128.662 128.662c12.6 12.599 3.676 34.142-14.142 34.142z"]},oe={prefix:"fas",iconName:"file",icon:[384,512,[],"f15b","M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm160-14.1v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z"]},ce={prefix:"fas",iconName:"file-alt",icon:[384,512,[],"f15c","M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm64 236c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12v8zm0-64c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12v8zm0-72v8c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12zm96-114.1v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z"]},ie={prefix:"fas",iconName:"file-audio",icon:[384,512,[],"f1c7","M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm-64 268c0 10.7-12.9 16-20.5 8.5L104 376H76c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h28l35.5-36.5c7.6-7.6 20.5-2.2 20.5 8.5v136zm33.2-47.6c9.1-9.3 9.1-24.1 0-33.4-22.1-22.8 12.2-56.2 34.4-33.5 27.2 27.9 27.2 72.4 0 100.4-21.8 22.3-56.9-10.4-34.4-33.5zm86-117.1c54.4 55.9 54.4 144.8 0 200.8-21.8 22.4-57-10.3-34.4-33.5 36.2-37.2 36.3-96.5 0-133.8-22.1-22.8 12.3-56.3 34.4-33.5zM384 121.9v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z"]},re={prefix:"fas",iconName:"file-csv",icon:[384,512,[],"f6dd","M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm-96 144c0 4.42-3.58 8-8 8h-8c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h8c4.42 0 8 3.58 8 8v16c0 4.42-3.58 8-8 8h-8c-26.51 0-48-21.49-48-48v-32c0-26.51 21.49-48 48-48h8c4.42 0 8 3.58 8 8v16zm44.27 104H160c-4.42 0-8-3.58-8-8v-16c0-4.42 3.58-8 8-8h12.27c5.95 0 10.41-3.5 10.41-6.62 0-1.3-.75-2.66-2.12-3.84l-21.89-18.77c-8.47-7.22-13.33-17.48-13.33-28.14 0-21.3 19.02-38.62 42.41-38.62H200c4.42 0 8 3.58 8 8v16c0 4.42-3.58 8-8 8h-12.27c-5.95 0-10.41 3.5-10.41 6.62 0 1.3.75 2.66 2.12 3.84l21.89 18.77c8.47 7.22 13.33 17.48 13.33 28.14.01 21.29-19 38.62-42.39 38.62zM256 264v20.8c0 20.27 5.7 40.17 16 56.88 10.3-16.7 16-36.61 16-56.88V264c0-4.42 3.58-8 8-8h16c4.42 0 8 3.58 8 8v20.8c0 35.48-12.88 68.89-36.28 94.09-3.02 3.25-7.27 5.11-11.72 5.11s-8.7-1.86-11.72-5.11c-23.4-25.2-36.28-58.61-36.28-94.09V264c0-4.42 3.58-8 8-8h16c4.42 0 8 3.58 8 8zm121-159L279.1 7c-4.5-4.5-10.6-7-17-7H256v128h128v-6.1c0-6.3-2.5-12.4-7-16.9z"]},ae={prefix:"fas",iconName:"file-excel",icon:[384,512,[],"f1c3","M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm60.1 106.5L224 336l60.1 93.5c5.1 8-.6 18.5-10.1 18.5h-34.9c-4.4 0-8.5-2.4-10.6-6.3C208.9 405.5 192 373 192 373c-6.4 14.8-10 20-36.6 68.8-2.1 3.9-6.1 6.3-10.5 6.3H110c-9.5 0-15.2-10.5-10.1-18.5l60.3-93.5-60.3-93.5c-5.2-8 .6-18.5 10.1-18.5h34.8c4.4 0 8.5 2.4 10.6 6.3 26.1 48.8 20 33.6 36.6 68.5 0 0 6.1-11.7 36.6-68.5 2.1-3.9 6.2-6.3 10.6-6.3H274c9.5-.1 15.2 10.4 10.1 18.4zM384 121.9v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z"]},se={prefix:"fas",iconName:"file-image",icon:[384,512,[],"f1c5","M384 121.941V128H256V0h6.059a24 24 0 0 1 16.97 7.029l97.941 97.941a24.002 24.002 0 0 1 7.03 16.971zM248 160c-13.2 0-24-10.8-24-24V0H24C10.745 0 0 10.745 0 24v464c0 13.255 10.745 24 24 24h336c13.255 0 24-10.745 24-24V160H248zm-135.455 16c26.51 0 48 21.49 48 48s-21.49 48-48 48-48-21.49-48-48 21.491-48 48-48zm208 240h-256l.485-48.485L104.545 328c4.686-4.686 11.799-4.201 16.485.485L160.545 368 264.06 264.485c4.686-4.686 12.284-4.686 16.971 0L320.545 304v112z"]},fe={prefix:"fas",iconName:"file-pdf",icon:[384,512,[],"f1c1","M181.9 256.1c-5-16-4.9-46.9-2-46.9 8.4 0 7.6 36.9 2 46.9zm-1.7 47.2c-7.7 20.2-17.3 43.3-28.4 62.7 18.3-7 39-17.2 62.9-21.9-12.7-9.6-24.9-23.4-34.5-40.8zM86.1 428.1c0 .8 13.2-5.4 34.9-40.2-6.7 6.3-29.1 24.5-34.9 40.2zM248 160h136v328c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V24C0 10.7 10.7 0 24 0h200v136c0 13.2 10.8 24 24 24zm-8 171.8c-20-12.2-33.3-29-42.7-53.8 4.5-18.5 11.6-46.6 6.2-64.2-4.7-29.4-42.4-26.5-47.8-6.8-5 18.3-.4 44.1 8.1 77-11.6 27.6-28.7 64.6-40.8 85.8-.1 0-.1.1-.2.1-27.1 13.9-73.6 44.5-54.5 68 5.6 6.9 16 10 21.5 10 17.9 0 35.7-18 61.1-61.8 25.8-8.5 54.1-19.1 79-23.2 21.7 11.8 47.1 19.5 64 19.5 29.2 0 31.2-32 19.7-43.4-13.9-13.6-54.3-9.7-73.6-7.2zM377 105L279 7c-4.5-4.5-10.6-7-17-7h-6v128h128v-6.1c0-6.3-2.5-12.4-7-16.9zm-74.1 255.3c4.1-2.7-2.5-11.9-42.8-9 37.1 15.8 42.8 9 42.8 9z"]},ue={prefix:"fas",iconName:"file-video",icon:[384,512,[],"f1c8","M384 121.941V128H256V0h6.059c6.365 0 12.47 2.529 16.971 7.029l97.941 97.941A24.005 24.005 0 0 1 384 121.941zM224 136V0H24C10.745 0 0 10.745 0 24v464c0 13.255 10.745 24 24 24h336c13.255 0 24-10.745 24-24V160H248c-13.2 0-24-10.8-24-24zm96 144.016v111.963c0 21.445-25.943 31.998-40.971 16.971L224 353.941V392c0 13.255-10.745 24-24 24H88c-13.255 0-24-10.745-24-24V280c0-13.255 10.745-24 24-24h112c13.255 0 24 10.745 24 24v38.059l55.029-55.013c15.011-15.01 40.971-4.491 40.971 16.97z"]},me={prefix:"fas",iconName:"file-word",icon:[384,512,[],"f1c2","M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm57.1 120H305c7.7 0 13.4 7.1 11.7 14.7l-38 168c-1.2 5.5-6.1 9.3-11.7 9.3h-38c-5.5 0-10.3-3.8-11.6-9.1-25.8-103.5-20.8-81.2-25.6-110.5h-.5c-1.1 14.3-2.4 17.4-25.6 110.5-1.3 5.3-6.1 9.1-11.6 9.1H117c-5.6 0-10.5-3.9-11.7-9.4l-37.8-168c-1.7-7.5 4-14.6 11.7-14.6h24.5c5.7 0 10.7 4 11.8 9.7 15.6 78 20.1 109.5 21 122.2 1.6-10.2 7.3-32.7 29.4-122.7 1.3-5.4 6.1-9.1 11.7-9.1h29.1c5.6 0 10.4 3.8 11.7 9.2 24 100.4 28.8 124 29.6 129.4-.2-11.2-2.6-17.8 21.6-129.2 1-5.6 5.9-9.5 11.5-9.5zM384 121.9v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z"]},de={prefix:"fas",iconName:"folder",icon:[512,512,[],"f07b","M464 128H272l-64-64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V176c0-26.51-21.49-48-48-48z"]},pe={prefix:"fas",iconName:"folder-plus",icon:[512,512,[],"f65e","M464,128H272L208,64H48A48,48,0,0,0,0,112V400a48,48,0,0,0,48,48H464a48,48,0,0,0,48-48V176A48,48,0,0,0,464,128ZM359.5,296a16,16,0,0,1-16,16h-64v64a16,16,0,0,1-16,16h-16a16,16,0,0,1-16-16V312h-64a16,16,0,0,1-16-16V280a16,16,0,0,1,16-16h64V200a16,16,0,0,1,16-16h16a16,16,0,0,1,16,16v64h64a16,16,0,0,1,16,16Z"]},he={prefix:"fas",iconName:"home",icon:[576,512,[],"f015","M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47L488 182.56V44.05a12 12 0 0 0-12-12h-56a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5 31A12 12 0 0 0 45.15 301l235.22-193.74a12.19 12.19 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z"]};function ge(e,t,n){const l=e.slice();return l[31]=t[n],l}function ve(e,t,n){const l=e.slice();return l[34]=t[n],l}function $e(e,t,n){const l=e.slice();return l[37]=t[n],l}function _e(e,t,n){const l=e.slice();return l[40]=t[n],l}function ye(t){let n,l=t[40].name+"";return{c(){n=h(l)},m(e,t){f(e,n,t)},p(e,t){32&t[0]&&l!==(l=e[40].name+"")&&y(n,l)},i:e,o:e,d(e){e&&u(n)}}}function we(e){let t,n;return t=new te({props:{icon:e[40].icon}}),{c(){X(t.$$.fragment)},m(e,l){P(t,e,l),n=!0},p(e,n){const l={};32&n[0]&&(l.icon=e[40].icon),t.$set(l)},i(e){n||(B(t.$$.fragment,e),n=!0)},o(e){F(t.$$.fragment,e),n=!1},d(e){U(t,e)}}}function ze(e){let t,n,l,c,i,r,a;const m=[we,ye],p=[];function h(e,t){return e[40].icon?0:1}return n=h(e),l=p[n]=m[n](e),{c(){t=d("li"),l.c(),c=g(),_(t,"class","breadcrumb-item")},m(l,u){f(l,t,u),p[n].m(t,null),s(t,c),i=!0,r||(a=$(t,"click",(function(){o(e[16](e[40].location))&&e[16](e[40].location).apply(this,arguments)})),r=!0)},p(o,i){let r=n;n=h(e=o),n===r?p[n].p(e,i):(j(),F(p[r],1,1,(()=>{p[r]=null})),W(),l=p[n],l?l.p(e,i):(l=p[n]=m[n](e),l.c()),B(l,1),l.m(t,c))},i(e){i||(B(l),i=!0)},o(e){F(l),i=!1},d(e){e&&u(t),p[n].d(),r=!1,a()}}}function be(e){let t,n=e[37].filename+"";return{c(){t=h(n)},m(e,n){f(e,t,n)},p(e,l){2&l[0]&&n!==(n=e[37].filename+"")&&y(t,n)},d(e){e&&u(t)}}}function xe(e){let t,n,l=e[37].filename+"";return{c(){t=h(l),n=h("/")},m(e,l){f(e,t,l),f(e,n,l)},p(e,n){2&n[0]&&l!==(l=e[37].filename+"")&&y(t,l)},d(e){e&&u(t),e&&u(n)}}}function Ce(e){let t,n,o,c,i,r,a,m,p,v,b,x,C,H,V,L,M,k,N,D,O=e[37].mimetype+"",R=(e[37].isDirectory?"":e[37].size_kb)+"",S=e[3][e[37].min_role_read]+"",A=new Date(e[37].uploaded_at).toLocaleString()+"";function E(e,t){return e[37].isDirectory?xe:be}o=new te({props:{size:"lg",icon:e[17](e[37])}});let j=E(e),W=j(e);function T(...t){return e[25](e[37],...t)}function q(){return e[26](e[37])}return{c(){t=d("tr"),n=d("td"),X(o.$$.fragment),c=g(),i=d("td"),W.c(),r=g(),a=d("td"),m=h(O),p=g(),v=d("td"),b=h(R),x=g(),C=d("td"),H=h(S),V=g(),L=d("td"),M=h(A),w(v,"text-align","right"),_(t,"class","svelte-16rl54v"),z(t,"selected",e[4][e[37].filename])},m(e,l){f(e,t,l),s(t,n),P(o,n,null),s(t,c),s(t,i),W.m(i,null),s(t,r),s(t,a),s(a,m),s(t,p),s(t,v),s(v,b),s(t,x),s(t,C),s(C,H),s(t,V),s(t,L),s(L,M),k=!0,N||(D=[$(t,"click",T),$(t,"dblclick",q)],N=!0)},p(n,l){e=n;const c={};2&l[0]&&(c.icon=e[17](e[37])),o.$set(c),j===(j=E(e))&&W?W.p(e,l):(W.d(1),W=j(e),W&&(W.c(),W.m(i,null))),(!k||2&l[0])&&O!==(O=e[37].mimetype+"")&&y(m,O),(!k||2&l[0])&&R!==(R=(e[37].isDirectory?"":e[37].size_kb)+"")&&y(b,R),(!k||10&l[0])&&S!==(S=e[3][e[37].min_role_read]+"")&&y(H,S),(!k||2&l[0])&&A!==(A=new Date(e[37].uploaded_at).toLocaleString()+"")&&y(M,A),(!k||18&l[0])&&z(t,"selected",e[4][e[37].filename])},i(e){k||(B(o.$$.fragment,e),k=!0)},o(e){F(o.$$.fragment,e),k=!1},d(e){e&&u(t),U(o),W.d(),N=!1,l(D)}}}function He(e){let t,n,o,c,i,r,a,p,w,z,b,x,C,H,V,L,M,k,N,D,O,R,S,A,E,j,W,B,F,X,P,U,T,q,I,Y,K,Z,J,G,Q,ee,te,ne,le,oe,ce,ie,re,ae=e[8].filename+"",se=new Date(e[8].uploaded_at).toLocaleString()+"",fe=e[3][e[8].min_role_read]+"",ue=1===e[6].length&&e[8].filename.endsWith(".zip"),me="image"===e[8].mime_super&&Ve(e),de=!e[8].isDirectory&&Le(e);function pe(e,t){return e[8].isDirectory?ke:Me}let he=pe(e),$e=he(e),_e=e[6].length>1&&Ne(e),ye=e[7],we=[];for(let t=0;t<ye.length;t+=1)we[t]=De(ve(e,ye,t));let ze=e[2],be=[];for(let t=0;t<ze.length;t+=1)be[t]=Oe(ge(e,ze,t));let xe=1===e[6].length&&Re(),Ce=ue&&Se(),He=e[6].length>1&&Ae(e);return{c(){t=d("h5"),n=h(ae),o=g(),me&&me.c(),c=g(),i=d("table"),r=d("tbody"),de&&de.c(),a=g(),p=d("tr"),w=d("th"),w.textContent="MIME type",z=g(),b=d("td"),$e.c(),x=g(),C=d("tr"),H=d("th"),H.textContent="Created",V=g(),L=d("td"),M=h(se),k=g(),N=d("tr"),D=d("th"),D.textContent="Role to access",O=g(),R=d("td"),S=h(fe),A=g(),E=d("div"),j=d("a"),W=h("Link"),F=h("\n           | \n          "),X=d("a"),P=h("Download"),T=g(),_e&&_e.c(),q=g(),I=d("div"),Y=d("select"),K=d("option"),K.textContent="Set access";for(let e=0;e<we.length;e+=1)we[e].c();Z=g(),J=d("select"),G=d("option"),G.textContent="Move to...";for(let e=0;e<be.length;e+=1)be[e].c();Q=g(),ee=d("select"),te=d("option"),te.textContent="Action...",ne=d("option"),ne.textContent="Delete",xe&&xe.c(),le=v(),Ce&&Ce.c(),oe=g(),He&&He.c(),ce=v(),_(D,"class","pe-1"),_(j,"href",B=`/files/serve/${e[8].location}`),_(X,"href",U=`/files/download/${e[8].location}`),K.__value="",K.value=K.__value,K.disabled=!0,K.selected=!0,_(Y,"class","form-select svelte-16rl54v"),G.__value="",G.value=G.__value,G.disabled=!0,G.selected=!0,_(J,"class","form-select svelte-16rl54v"),te.__value="",te.value=te.__value,te.disabled=!0,te.selected=!0,ne.__value="Delete",ne.value=ne.__value,_(ee,"class","form-select svelte-16rl54v"),_(I,"class","file-actions d-flex svelte-16rl54v")},m(l,u){f(l,t,u),s(t,n),f(l,o,u),me&&me.m(l,u),f(l,c,u),f(l,i,u),s(i,r),de&&de.m(r,null),s(r,a),s(r,p),s(p,w),s(p,z),s(p,b),$e.m(b,null),s(r,x),s(r,C),s(C,H),s(C,V),s(C,L),s(L,M),s(r,k),s(r,N),s(N,D),s(N,O),s(N,R),s(R,S),f(l,A,u),f(l,E,u),s(E,j),s(j,W),s(E,F),s(E,X),s(X,P),f(l,T,u),_e&&_e.m(l,u),f(l,q,u),f(l,I,u),s(I,Y),s(Y,K);for(let e=0;e<we.length;e+=1)we[e].m(Y,null);s(I,Z),s(I,J),s(J,G);for(let e=0;e<be.length;e+=1)be[e].m(J,null);s(I,Q),s(I,ee),s(ee,te),s(ee,ne),xe&&xe.m(ee,null),s(ee,le),Ce&&Ce.m(ee,null),f(l,oe,u),He&&He.m(l,u),f(l,ce,u),ie||(re=[$(Y,"change",e[13]),$(J,"change",e[15]),$(ee,"change",e[12])],ie=!0)},p(e,t){if(256&t[0]&&ae!==(ae=e[8].filename+"")&&y(n,ae),"image"===e[8].mime_super?me?me.p(e,t):(me=Ve(e),me.c(),me.m(c.parentNode,c)):me&&(me.d(1),me=null),e[8].isDirectory?de&&(de.d(1),de=null):de?de.p(e,t):(de=Le(e),de.c(),de.m(r,a)),he===(he=pe(e))&&$e?$e.p(e,t):($e.d(1),$e=he(e),$e&&($e.c(),$e.m(b,null))),256&t[0]&&se!==(se=new Date(e[8].uploaded_at).toLocaleString()+"")&&y(M,se),264&t[0]&&fe!==(fe=e[3][e[8].min_role_read]+"")&&y(S,fe),256&t[0]&&B!==(B=`/files/serve/${e[8].location}`)&&_(j,"href",B),256&t[0]&&U!==(U=`/files/download/${e[8].location}`)&&_(X,"href",U),e[6].length>1?_e?_e.p(e,t):(_e=Ne(e),_e.c(),_e.m(q.parentNode,q)):_e&&(_e.d(1),_e=null),128&t[0]){let n;for(ye=e[7],n=0;n<ye.length;n+=1){const l=ve(e,ye,n);we[n]?we[n].p(l,t):(we[n]=De(l),we[n].c(),we[n].m(Y,null))}for(;n<we.length;n+=1)we[n].d(1);we.length=ye.length}if(4&t[0]){let n;for(ze=e[2],n=0;n<ze.length;n+=1){const l=ge(e,ze,n);be[n]?be[n].p(l,t):(be[n]=Oe(l),be[n].c(),be[n].m(J,null))}for(;n<be.length;n+=1)be[n].d(1);be.length=ze.length}1===e[6].length?xe||(xe=Re(),xe.c(),xe.m(ee,le)):xe&&(xe.d(1),xe=null),320&t[0]&&(ue=1===e[6].length&&e[8].filename.endsWith(".zip")),ue?Ce||(Ce=Se(),Ce.c(),Ce.m(ee,null)):Ce&&(Ce.d(1),Ce=null),e[6].length>1?He?He.p(e,t):(He=Ae(e),He.c(),He.m(ce.parentNode,ce)):He&&(He.d(1),He=null)},d(e){e&&u(t),e&&u(o),me&&me.d(e),e&&u(c),e&&u(i),de&&de.d(),$e.d(),e&&u(A),e&&u(E),e&&u(T),_e&&_e.d(e),e&&u(q),e&&u(I),m(we,e),m(be,e),xe&&xe.d(),Ce&&Ce.d(),e&&u(oe),He&&He.d(e),e&&u(ce),ie=!1,l(re)}}}function Ve(e){let t,n,l;return{c(){t=d("img"),_(t,"class","file-preview my-2 svelte-16rl54v"),a(t.src,n=`/files/serve/${e[8].location}`)||_(t,"src",n),_(t,"alt",l=e[8].filename)},m(e,n){f(e,t,n)},p(e,o){256&o[0]&&!a(t.src,n=`/files/serve/${e[8].location}`)&&_(t,"src",n),256&o[0]&&l!==(l=e[8].filename)&&_(t,"alt",l)},d(e){e&&u(t)}}}function Le(e){let t,n,l,o,c,i,r=e[8].size_kb+"";return{c(){t=d("tr"),n=d("th"),n.textContent="Size",l=g(),o=d("td"),c=h(r),i=h(" KB")},m(e,r){f(e,t,r),s(t,n),s(t,l),s(t,o),s(o,c),s(o,i)},p(e,t){256&t[0]&&r!==(r=e[8].size_kb+"")&&y(c,r)},d(e){e&&u(t)}}}function Me(e){let t,n,l,o=e[8].mime_super+"",c=e[8].mime_sub+"";return{c(){t=h(o),n=h("/"),l=h(c)},m(e,o){f(e,t,o),f(e,n,o),f(e,l,o)},p(e,n){256&n[0]&&o!==(o=e[8].mime_super+"")&&y(t,o),256&n[0]&&c!==(c=e[8].mime_sub+"")&&y(l,c)},d(e){e&&u(t),e&&u(n),e&&u(l)}}}function ke(t){let n;return{c(){n=h("Directory")},m(e,t){f(e,n,t)},p:e,d(e){e&&u(n)}}}function Ne(e){let t,n,l,o,c,i,r=e[6].length-1+"",a=e[6].length>2?"s":"";return{c(){t=d("strong"),n=h("and "),l=h(r),o=h(" other file"),c=h(a),i=h(":")},m(e,r){f(e,t,r),s(t,n),s(t,l),s(t,o),s(t,c),s(t,i)},p(e,t){64&t[0]&&r!==(r=e[6].length-1+"")&&y(l,r),64&t[0]&&a!==(a=e[6].length>2?"s":"")&&y(c,a)},d(e){e&&u(t)}}}function De(e){let t,n,l,o=e[34].role+"";return{c(){t=d("option"),n=h(o),t.__value=l=e[34].id,t.value=t.__value},m(e,l){f(e,t,l),s(t,n)},p(e,c){128&c[0]&&o!==(o=e[34].role+"")&&y(n,o),128&c[0]&&l!==(l=e[34].id)&&(t.__value=l,t.value=t.__value)},d(e){e&&u(t)}}}function Oe(e){let t,n,l,o=(e[31].location||"/")+"";return{c(){t=d("option"),n=h(o),t.__value=l=e[31].location||"/",t.value=t.__value},m(e,l){f(e,t,l),s(t,n)},p(e,c){4&c[0]&&o!==(o=(e[31].location||"/")+"")&&y(n,o),4&c[0]&&l!==(l=e[31].location||"/")&&(t.__value=l,t.value=t.__value)},d(e){e&&u(t)}}}function Re(e){let t;return{c(){t=d("option"),t.textContent="Rename",t.__value="Rename",t.value=t.__value},m(e,n){f(e,t,n)},d(e){e&&u(t)}}}function Se(e){let t;return{c(){t=d("option"),t.textContent="Unzip",t.__value="Unzip",t.value=t.__value},m(e,n){f(e,t,n)},d(e){e&&u(t)}}}function Ae(t){let n,l,o;return{c(){n=d("button"),n.innerHTML='<i class="fas fa-file-archive"></i>\n            Download Zip Archive',_(n,"class","btn btn-outline-secondary mt-2")},m(e,c){f(e,n,c),l||(o=$(n,"click",t[14]),l=!0)},p:e,d(e){e&&u(n),l=!1,o()}}}function Ee(e){let t,n,o,c,i,r,a,p,v,y,z,b,x,C,H,V,L,M,k,N,D,O,R,S,A,E,T,q,I,Y,K,Z,J,G,Q,ee,ne,le,oe,ce,ie,re,ae,se,fe,ue,me,de,he,ge,ve,ye=e[5],we=[];for(let t=0;t<ye.length;t+=1)we[t]=ze(_e(e,ye,t));const be=e=>F(we[e],1,1,(()=>{we[e]=null}));V=new te({props:{icon:e[19]("filename",e[9],e[10])}}),N=new te({props:{icon:e[19]("mimetype",e[9],e[10])}}),R=new te({props:{icon:e[19]("size_kb",e[9],e[10])}}),q=new te({props:{icon:e[19]("min_role_read",e[9],e[10])}}),Z=new te({props:{icon:e[19]("uploaded_at",e[9],e[10])}});let xe=e[1],Ve=[];for(let t=0;t<xe.length;t+=1)Ve[t]=Ce($e(e,xe,t));const Le=e=>F(Ve[e],1,1,(()=>{Ve[e]=null}));le=new te({props:{size:"lg",icon:pe}});let Me=e[6].length>0&&He(e);return{c(){t=d("main"),n=d("div"),o=d("div"),c=d("div"),i=d("nav"),r=d("ol");for(let e=0;e<we.length;e+=1)we[e].c();a=g(),p=d("div"),v=d("table"),y=d("thead"),z=d("tr"),b=d("th"),x=g(),C=d("th"),H=h("Filename\n                "),X(V.$$.fragment),L=g(),M=d("th"),k=h("Media type\n                "),X(N.$$.fragment),D=g(),O=d("th"),X(R.$$.fragment),S=h("\n                Size (KiB)"),A=g(),E=d("th"),T=h("Role to access\n                "),X(q.$$.fragment),I=g(),Y=d("th"),K=h("Created\n                "),X(Z.$$.fragment),J=g(),G=d("tbody");for(let e=0;e<Ve.length;e+=1)Ve[e].c();Q=g(),ee=d("tr"),ne=d("td"),X(le.$$.fragment),oe=g(),ce=d("td"),ce.textContent="Create new folder...",ie=g(),re=d("td"),ae=g(),se=d("td"),fe=g(),ue=d("td"),me=g(),de=d("div"),Me&&Me.c(),_(r,"class","breadcrumb"),_(i,"aria-label","breadcrumb"),w(O,"text-align","right"),_(v,"class","table table-sm"),_(p,"class","filelist svelte-16rl54v"),_(o,"class","col-8"),_(de,"class","col-4"),_(n,"class","row")},m(l,u){f(l,t,u),s(t,n),s(n,o),s(o,c),s(c,i),s(i,r);for(let e=0;e<we.length;e+=1)we[e].m(r,null);s(o,a),s(o,p),s(p,v),s(v,y),s(y,z),s(z,b),s(z,x),s(z,C),s(C,H),P(V,C,null),s(z,L),s(z,M),s(M,k),P(N,M,null),s(z,D),s(z,O),P(R,O,null),s(O,S),s(z,A),s(z,E),s(E,T),P(q,E,null),s(z,I),s(z,Y),s(Y,K),P(Z,Y,null),s(v,J),s(v,G);for(let e=0;e<Ve.length;e+=1)Ve[e].m(G,null);s(G,Q),s(G,ee),s(ee,ne),P(le,ne,null),s(ee,oe),s(ee,ce),s(ee,ie),s(ee,re),s(ee,ae),s(ee,se),s(ee,fe),s(ee,ue),s(n,me),s(n,de),Me&&Me.m(de,null),he=!0,ge||(ve=[$(C,"click",e[20]),$(M,"click",e[21]),$(O,"click",e[22]),$(E,"click",e[23]),$(Y,"click",e[24]),$(ee,"click",e[27])],ge=!0)},p(e,t){if(65568&t[0]){let n;for(ye=e[5],n=0;n<ye.length;n+=1){const l=_e(e,ye,n);we[n]?(we[n].p(l,t),B(we[n],1)):(we[n]=ze(l),we[n].c(),B(we[n],1),we[n].m(r,null))}for(j(),n=ye.length;n<we.length;n+=1)be(n);W()}const n={};1536&t[0]&&(n.icon=e[19]("filename",e[9],e[10])),V.$set(n);const l={};1536&t[0]&&(l.icon=e[19]("mimetype",e[9],e[10])),N.$set(l);const o={};1536&t[0]&&(o.icon=e[19]("size_kb",e[9],e[10])),R.$set(o);const c={};1536&t[0]&&(c.icon=e[19]("min_role_read",e[9],e[10])),q.$set(c);const i={};if(1536&t[0]&&(i.icon=e[19]("uploaded_at",e[9],e[10])),Z.$set(i),198682&t[0]){let n;for(xe=e[1],n=0;n<xe.length;n+=1){const l=$e(e,xe,n);Ve[n]?(Ve[n].p(l,t),B(Ve[n],1)):(Ve[n]=Ce(l),Ve[n].c(),B(Ve[n],1),Ve[n].m(G,Q))}for(j(),n=xe.length;n<Ve.length;n+=1)Le(n);W()}e[6].length>0?Me?Me.p(e,t):(Me=He(e),Me.c(),Me.m(de,null)):Me&&(Me.d(1),Me=null)},i(e){if(!he){for(let e=0;e<ye.length;e+=1)B(we[e]);B(V.$$.fragment,e),B(N.$$.fragment,e),B(R.$$.fragment,e),B(q.$$.fragment,e),B(Z.$$.fragment,e);for(let e=0;e<xe.length;e+=1)B(Ve[e]);B(le.$$.fragment,e),he=!0}},o(e){we=we.filter(Boolean);for(let e=0;e<we.length;e+=1)F(we[e]);F(V.$$.fragment,e),F(N.$$.fragment,e),F(R.$$.fragment,e),F(q.$$.fragment,e),F(Z.$$.fragment,e),Ve=Ve.filter(Boolean);for(let e=0;e<Ve.length;e+=1)F(Ve[e]);F(le.$$.fragment,e),he=!1},d(e){e&&u(t),m(we,e),U(V),U(N),U(R),U(q),U(Z),m(Ve,e),U(le),Me&&Me.d(),ge=!1,l(ve)}}}async function je(e,t,n){const l=fetch(e,{headers:{"X-Requested-With":"XMLHttpRequest","CSRF-Token":window._sc_globalCsrf,"Content-Type":"application/json"},method:"POST",body:JSON.stringify(t||{})});if(!n)return await l;{const e=await l,t=await e.blob(),n=document.createElement("a");n.href=window.URL.createObjectURL(t);const o=e.headers.get("Content-Disposition");if(o){let e=o.split(";")[1].split("=")[1].replaceAll('"',"");n.download=e}else n.target="_blank";n.click()}}function We(e,t,n){let l,o,{files:c=[]}=t,{directories:i=[]}=t,{roles:r={}}=t,{currentFolder:a="/"}=t,s=[],f={};const u=new URL(window.location).searchParams.get("dir");u&&(a=u);const m=()=>{const e=new URL(window.location);e.searchParams.get("dir")!==a&&(e.searchParams.set("dir",a),window.history.replaceState(null,"",e.toString()));const t=document.getElementById("uploadFolderInpId");t?.value!==a&&(t.value=a)},d=async function(e){const t=await fetch(`/files?dir=${a}`,{headers:{"X-Requested-With":"XMLHttpRequest"}}),u=await t.json();n(1,c=u.files);for(const e of c)e.mimetype=e.mime_sub&&e.mime_super?`${e.mime_super}/${e.mime_sub}`:"";n(2,i=u.directories),n(7,l=u.roles);for(const e of u.roles)n(3,r[e.id]=e.role,r);e?o&&n(8,o=c.find((e=>e.filename===o.filename))):(n(6,s=[]),n(4,f={}),n(8,o=null)),_("filename")};function p(e,t){e.selected=!0;const l=f[e.filename];if(t.shiftKey||n(4,f={}),n(4,f[e.filename]=!l,f),l){const e=Object.entries(f).findLast((([e,t])=>t));n(8,o=e?c.find((t=>t.filename===e[0])):null)}else n(8,o=e);document.getSelection().removeAllRanges(),console.log(o)}function h(e){n(0,a=e),m(),d()}x(d);let g,v=[];let $=!1;function _(e){g===e?n(10,$=!$):n(9,g=e);let t=e=>e[g];"uploaded_at"===g&&(t=e=>new Date(e[g])),"filename"===g&&(t=e=>(e[g]||"").toLowerCase());n(1,c=c.sort(((e,n)=>t(e)<t(n)?$?1:-1:t(e)>t(n)?$?-1:1:0)))}return e.$$set=e=>{"files"in e&&n(1,c=e.files),"directories"in e&&n(2,i=e.directories),"roles"in e&&n(3,r=e.roles),"currentFolder"in e&&n(0,a=e.currentFolder)},e.$$.update=()=>{16&e.$$.dirty[0]&&n(6,s=Object.entries(f).filter((([e,t])=>t)).map((([e,t])=>e))),33&e.$$.dirty[0]&&("/"===a||""===a?n(5,v=[{icon:he,location:"/"}]):(n(5,v=a.split("/").map(((e,t)=>({name:e,location:a.split("/").slice(0,t+1).join("/")})))),v.unshift({icon:he,location:"/"})))},[a,c,i,r,f,v,s,l,o,g,$,p,async function(e){const t=e?.target.value;if(t)switch(t){case"Delete":if(!confirm(`Delete files: ${s.join()}`))return;for(const e of s){const t=c.find((t=>t.filename===e)),n=await je(`/files/delete/${t.location}`),l=await n.json();l.error&&window.notifyAlert({type:"danger",text:l.error})}await d();break;case"Rename":const e=window.prompt(`Rename ${o.filename} to:`,o.filename);if(!e)return;await je(`/files/setname/${o.location}`,{value:e}),await d();break;case"Unzip":await je(`/files/unzip/${o.location}`,{}),await d()}},async function(e){const t=e.target.value;for(const e of s){const n=c.find((t=>t.filename===e));await je(`/files/setrole/${n.location}`,{role:t})}await d(!0)},async function(){const e=[];for(const t of s)e.push(t);await je("/files/download-zip",{files:e,location:a},!0)},async function(e){for(const t of s){const n=e.target.value;if(!n)return;const l=c.find((e=>e.filename===t));await je(`/files/move/${l.location}`,{new_path:n})}await d()},h,function(e){if("image"===e.mime_super)return se;if("audio"===e.mime_super)return ie;if("video"===e.mime_super)return ue;if("pdf"===e.mime_sub)return fe;if(e.isDirectory)return de;const t=e.filename.toLowerCase();return t.endsWith(".csv")?re:t.endsWith(".xls")||t.endsWith(".xlsx")?ae:t.endsWith(".doc")||t.endsWith(".docx")?me:t.endsWith(".txt")?ce:oe},_,function(e){return e!==g?null:$?ne:le},()=>_("filename"),()=>_("mimetype"),()=>_("size_kb"),()=>_("min_role_read"),()=>_("uploaded_at"),(e,t)=>p(e,t),e=>{e.isDirectory?h(e.location):window.open(`/files/serve/${e.location}`)},()=>window.create_new_folder(a)]}return new class extends I{constructor(e){super(),q(this,e,We,Ee,c,{files:1,directories:2,roles:3,currentFolder:0},null,[-1,-1])}}({target:document.getElementById("saltcorn-file-manager"),props:{name:"world"}})}();
//# sourceMappingURL=bundle.js.map
