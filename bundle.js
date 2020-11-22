var app=function(){"use strict";function n(){}function t(n,t){for(const e in t)n[e]=t[e];return n}function e(n){return n()}function a(){return Object.create(null)}function s(n){n.forEach(e)}function o(n){return"function"==typeof n}function c(n,t){return n!=n?t==t:n!==t||n&&"object"==typeof n||"function"==typeof n}function l(n){const t={};for(const e in n)"$"!==e[0]&&(t[e]=n[e]);return t}function p(n,t){const e={};t=new Set(t);for(const a in n)t.has(a)||"$"===a[0]||(e[a]=n[a]);return e}function r(n,t){n.appendChild(t)}function u(n,t,e){n.insertBefore(t,e||null)}function i(n){n.parentNode.removeChild(n)}function d(n){return document.createElement(n)}function f(n){return document.createTextNode(n)}function g(){return f(" ")}function h(n,t,e,a){return n.addEventListener(t,e,a),()=>n.removeEventListener(t,e,a)}function k(n,t,e){null==e?n.removeAttribute(t):n.getAttribute(t)!==e&&n.setAttribute(t,e)}function m(n,t){const e=Object.getOwnPropertyDescriptors(n.__proto__);for(const a in t)null==t[a]?n.removeAttribute(a):"style"===a?n.style.cssText=t[a]:"__value"===a?n.value=n[a]=t[a]:e[a]&&e[a].set?n[a]=t[a]:k(n,a,t[a])}function v(n,t){t=""+t,n.wholeText!==t&&(n.data=t)}function y(n,t){n.value=null==t?"":t}function b(n,t,e){n.classList[e?"add":"remove"](t)}let x;function $(n){x=n}function w(){if(!x)throw new Error("Function called outside component initialization");return x}function _(){const n=w();return(t,e)=>{const a=n.$$.callbacks[t];if(a){const s=function(n,t){const e=document.createEvent("CustomEvent");return e.initCustomEvent(n,!1,!1,t),e}(t,e);a.slice().forEach((t=>{t.call(n,s)}))}}}function L(n,t){const e=n.$$.callbacks[t.type];e&&e.slice().forEach((n=>n(t)))}const T=[],C=[],E=[],M=[],j=Promise.resolve();let H=!1;function S(n){E.push(n)}function V(n){M.push(n)}let A=!1;const D=new Set;function q(){if(!A){A=!0;do{for(let n=0;n<T.length;n+=1){const t=T[n];$(t),N(t.$$)}for($(null),T.length=0;C.length;)C.pop()();for(let n=0;n<E.length;n+=1){const t=E[n];D.has(t)||(D.add(t),t())}E.length=0}while(T.length);for(;M.length;)M.pop()();H=!1,A=!1,D.clear()}}function N(n){if(null!==n.fragment){n.update(),s(n.before_update);const t=n.dirty;n.dirty=[-1],n.fragment&&n.fragment.p(n.ctx,t),n.after_update.forEach(S)}}const z=new Set;function I(n,t){n&&n.i&&(z.delete(n),n.i(t))}function P(n,t,e,a){if(n&&n.o){if(z.has(n))return;z.add(n),undefined.c.push((()=>{z.delete(n),a&&(e&&n.d(1),a())})),n.o(t)}}function O(n,t,e){const a=n.$$.props[t];void 0!==a&&(n.$$.bound[a]=e,e(n.$$.ctx[a]))}function B(n){n&&n.c()}function F(n,t,a){const{fragment:c,on_mount:l,on_destroy:p,after_update:r}=n.$$;c&&c.m(t,a),S((()=>{const t=l.map(e).filter(o);p?p.push(...t):s(t),n.$$.on_mount=[]})),r.forEach(S)}function U(n,t){const e=n.$$;null!==e.fragment&&(s(e.on_destroy),e.fragment&&e.fragment.d(t),e.on_destroy=e.fragment=null,e.ctx=[])}function G(n,t){-1===n.$$.dirty[0]&&(T.push(n),H||(H=!0,j.then(q)),n.$$.dirty.fill(0)),n.$$.dirty[t/31|0]|=1<<t%31}function W(t,e,o,c,l,p,r=[-1]){const u=x;$(t);const d=e.props||{},f=t.$$={fragment:null,ctx:null,props:p,update:n,not_equal:l,bound:a(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(u?u.$$.context:[]),callbacks:a(),dirty:r,skip_bound:!1};let g=!1;if(f.ctx=o?o(t,d,((n,e,...a)=>{const s=a.length?a[0]:e;return f.ctx&&l(f.ctx[n],f.ctx[n]=s)&&(!f.skip_bound&&f.bound[n]&&f.bound[n](s),g&&G(t,n)),e})):[],f.update(),g=!0,s(f.before_update),f.fragment=!!c&&c(f.ctx),e.target){if(e.hydrate){const n=function(n){return Array.from(n.childNodes)}(e.target);f.fragment&&f.fragment.l(n),n.forEach(i)}else f.fragment&&f.fragment.c();e.intro&&I(t.$$.fragment),F(t,e.target,e.anchor),q()}$(u)}class R{$destroy(){U(this,1),this.$destroy=n}$on(n,t){const e=this.$$.callbacks[n]||(this.$$.callbacks[n]=[]);return e.push(t),()=>{const n=e.indexOf(t);-1!==n&&e.splice(n,1)}}$set(n){var t;this.$$set&&(t=n,0!==Object.keys(t).length)&&(this.$$.skip_bound=!0,this.$$set(n),this.$$.skip_bound=!1)}}function Y(e){let a,o,c,l,p,x,$,w,_=[e[6],{type:"search"},{id:e[1]},{name:e[4]}],L={};for(let n=0;n<_.length;n+=1)L=t(L,_[n]);return{c(){a=d("form"),o=d("label"),c=f(e[2]),p=g(),x=d("input"),k(o,"id",l=e[1]+"-label"),k(o,"for",e[1]),k(o,"class","svelte-5m0wg6"),b(o,"hide-label",e[3]),m(x,L),b(x,"svelte-5m0wg6",!0),k(a,"class","svelte-search"),k(a,"role","search"),k(a,"aria-labelledby",e[1])},m(n,t){var s;u(n,a,t),r(a,o),r(o,c),r(a,p),r(a,x),e[17](x),y(x,e[0]),$||(w=[h(x,"input",e[18]),h(x,"input",e[12]),h(x,"change",e[13]),h(x,"focus",e[14]),h(x,"blur",e[15]),h(x,"keydown",e[16]),h(a,"submit",(s=e[11],function(n){return n.preventDefault(),s.call(this,n)}))],$=!0)},p(n,[t]){4&t&&v(c,n[2]),2&t&&l!==(l=n[1]+"-label")&&k(o,"id",l),2&t&&k(o,"for",n[1]),8&t&&b(o,"hide-label",n[3]),m(x,L=function(n,t){const e={},a={},s={$$scope:1};let o=n.length;for(;o--;){const c=n[o],l=t[o];if(l){for(const n in c)n in l||(a[n]=1);for(const n in l)s[n]||(e[n]=l[n],s[n]=1);n[o]=l}else for(const n in c)s[n]=1}for(const n in a)n in e||(e[n]=void 0);return e}(_,[64&t&&n[6],{type:"search"},2&t&&{id:n[1]},16&t&&{name:n[4]}])),1&t&&y(x,n[0]),b(x,"svelte-5m0wg6",!0),2&t&&k(a,"aria-labelledby",n[1])},i:n,o:n,d(n){n&&i(a),e[17](null),$=!1,s(w)}}}function J(n,e,a){const s=["id","label","hideLabel","name","value","debounce","debounceValue","clear","focus"];let o=p(e,s),{id:c="search"+Math.random().toString(36)}=e,{label:r="Search"}=e,{hideLabel:u=!1}=e,{name:i="search"}=e,{value:d=""}=e,{debounce:f=!1}=e,{debounceValue:g=250}=e;const h=_();let k,m,v=d,y=!1;var b;return b=()=>(e.autofocus&&window.requestAnimationFrame((()=>{k.focus()})),()=>{void 0!==m&&clearTimeout(m)}),w().$$.on_mount.push(b),function(n){w().$$.after_update.push(n)}((()=>{var n;d.length>0&&d!==v&&(f?(n=()=>h("type"),y||(y=!0,m=setTimeout((()=>{n(),y=!1}),g))):h("type")),0===d.length&&v.length>0&&h("clear"),v=d})),n.$$set=n=>{a(24,e=t(t({},e),l(n))),a(6,o=p(e,s)),"id"in n&&a(1,c=n.id),"label"in n&&a(2,r=n.label),"hideLabel"in n&&a(3,u=n.hideLabel),"name"in n&&a(4,i=n.name),"value"in n&&a(0,d=n.value),"debounce"in n&&a(7,f=n.debounce),"debounceValue"in n&&a(8,g=n.debounceValue)},e=l(e),[d,c,r,u,i,k,o,f,g,function(){a(0,d="")},function(){k.focus()},function(t){L(n,t)},function(t){L(n,t)},function(t){L(n,t)},function(t){L(n,t)},function(t){L(n,t)},function(t){L(n,t)},function(n){C[n?"unshift":"push"]((()=>{k=n,a(5,k)}))},function(){d=this.value,a(0,d)}]}class K extends R{constructor(n){var t;super(),document.getElementById("svelte-5m0wg6-style")||((t=d("style")).id="svelte-5m0wg6-style",t.textContent=".hide-label.svelte-5m0wg6{position:absolute;height:1px;width:1px;overflow:hidden;clip:rect(1px 1px 1px 1px);clip:rect(1px, 1px, 1px, 1px);white-space:nowrap}",r(document.head,t)),W(this,n,J,Y,c,{id:1,label:2,hideLabel:3,name:4,value:0,debounce:7,debounceValue:8,clear:9,focus:10})}get clear(){return this.$$.ctx[9]}get focus(){return this.$$.ctx[10]}}function Q(n,t,e){const a=n.slice();return a[5]=t[e],a}function X(n){let t,e,a,s=n[5]+"";return{c(){t=d("div"),e=f(s),a=g()},m(n,s){u(n,t,s),r(t,e),u(n,a,s)},p(n,t){2&t&&s!==(s=n[5]+"")&&v(e,s)},d(n){n&&i(t),n&&i(a)}}}function Z(n){let t,e,a,s,o,c,l,p,h,m,y,b,x,$,w,_,L,T,E,M,j,H,S,A,D,q,N,z,G,W,R,Y,J,Z,nn,tn,en,an,sn,on,cn,ln,pn,rn,un,dn,fn,gn,hn,kn,mn,vn,yn,bn,xn,$n,wn,_n,Ln,Tn,Cn,En;function Mn(t){n[2].call(null,t)}let jn={};function Hn(t){n[3].call(null,t)}void 0!==n[0]&&(jn.value=n[0]),D=new K({props:jn}),C.push((()=>O(D,"value",Mn)));let Sn={debounce:!0,debounceValue:800};void 0!==n[0]&&(Sn.value=n[0]),an=new K({props:Sn}),C.push((()=>O(an,"value",Hn))),an.$on("type",n[4]);let Vn=n[1],An=[];for(let t=0;t<Vn.length;t+=1)An[t]=X(Q(n,Vn,t));return{c(){t=d("main"),e=d("h1"),e.textContent="svelte-search",a=g(),s=d("p"),s.innerHTML='<a href="https://npmjs.com/package/svelte-search"><img src="https://img.shields.io/npm/v/svelte-search.svg?color=blue" alt="NPM"/></a> \n<a href="https://travis-ci.com/metonym/svelte-search"><img src="https://travis-ci.com/metonym/svelte-search.svg?branch=master" alt="Build"/></a>',o=g(),c=d("blockquote"),c.innerHTML="<p>Customizable search component for Svelte.</p>",l=g(),p=d("h2"),p.textContent="Install",h=g(),m=d("pre"),y=g(),b=d("h2"),b.textContent="Usage",x=g(),$=d("h3"),$.textContent="Styling",w=g(),_=d("p"),_.innerHTML="Note: the component is unstyled by default. You can target the component using the <code>.svelte-search</code> class selector.",L=g(),T=d("pre"),E=g(),M=d("h3"),M.textContent="Basic",j=g(),H=d("div"),S=d("style"),S.textContent=".svelte-search input {\n  width: 100%;\n  font-size: 1.25rem;\n  padding: .5rem;\n  margin: .5rem 0;\n  border: 2px solid #e0e0e0;\n  border-radius: 0.25rem;\n}",A=g(),B(D.$$.fragment),N=f("\n\nValue: "),z=f(n[0]),G=d("pre"),W=g(),R=d("h3"),R.textContent="Debounced input",Y=g(),J=d("p"),J.innerHTML="Debounce the search input by setting <code>debounce</code> to <code>true</code>.",Z=g(),nn=d("p"),nn.innerHTML="Adjust the debounce value using <code>debounceValue</code> in milliseconds. The default is <code>250</code>ms.",tn=g(),en=d("div"),B(an.$$.fragment),on=g();for(let n=0;n<An.length;n+=1)An[n].c();cn=d("pre"),ln=g(),pn=d("h2"),pn.textContent="API",rn=g(),un=d("p"),un.innerHTML="This component forwards <code>$$restProps</code> to the input element.",dn=g(),fn=d("table"),fn.innerHTML='<thead><tr><th style="text-align:left">Prop name</th> \n<th style="text-align:left">Value</th></tr></thead> \n<tbody><tr><td style="text-align:left">id</td> \n<td style="text-align:left"><code>string</code></td></tr> \n<tr><td style="text-align:left">label</td> \n<td style="text-align:left"><code>string</code> (default: <code>&quot;Search&quot;</code>)</td></tr> \n<tr><td style="text-align:left">hideLabel</td> \n<td style="text-align:left"><code>boolean</code> (default: <code>false</code>)</td></tr> \n<tr><td style="text-align:left">name</td> \n<td style="text-align:left"><code>string</code> (default: <code>&quot;search&quot;</code>)</td></tr> \n<tr><td style="text-align:left">value</td> \n<td style="text-align:left"><code>string</code> (default: <code>&quot;value&quot;</code>)</td></tr> \n<tr><td style="text-align:left">debounce</td> \n<td style="text-align:left"><code>boolean</code> (default: <code>false</code>)</td></tr> \n<tr><td style="text-align:left">debounceValue</td> \n<td style="text-align:left"><code>number</code> (default: <code>250</code>)</td></tr></tbody>',gn=g(),hn=d("h2"),hn.textContent="Forwarded events",kn=g(),mn=d("table"),mn.innerHTML='<thead><tr><th style="text-align:left">Event name</th> \n<th style="text-align:left">Description</th></tr></thead> \n<tbody><tr><td style="text-align:left"><code>on:input</code></td> \n<td style="text-align:left">triggered if the value changes</td></tr> \n<tr><td style="text-align:left"><code>on:type</code></td> \n<td style="text-align:left">alias for <code>on:input</code>; dispatched when <code>debounce</code> is enabled</td></tr> \n<tr><td style="text-align:left"><code>on:submit</code></td> \n<td style="text-align:left">forwarded to the <code>form</code> element; triggered when pressing the “Enter” key</td></tr> \n<tr><td style="text-align:left"><code>on:change</code></td> \n<td style="text-align:left">triggered if the value changes after blurring</td></tr> \n<tr><td style="text-align:left"><code>on:focus</code></td> \n<td style="text-align:left">triggered when the input element is focused</td></tr> \n<tr><td style="text-align:left"><code>on:blur</code></td> \n<td style="text-align:left">triggered when the input element is blurred</td></tr> \n<tr><td style="text-align:left"><code>on:keydown</code></td> \n<td style="text-align:left">triggered when any key is pressed <a href="https://developer.mozilla.org/en-US/docs/Web/API/Document/keydown_event">MDN</a></td></tr></tbody>',vn=g(),yn=d("h2"),yn.textContent="Notes",bn=g(),xn=d("ul"),xn.innerHTML='<li>The <code>keypress</code> event is not forwarded because it is <a href="https://developer.mozilla.org/en-US/docs/Web/API/Document/keypress_event">deprecated</a></li>',$n=g(),wn=d("h2"),wn.innerHTML='<a href="CHANGELOG.md">Changelog</a>',_n=g(),Ln=d("h2"),Ln.textContent="License",Tn=g(),Cn=d("p"),Cn.innerHTML='<a href="LICENSE">MIT</a>',k(m,"class","language-bash"),k(T,"class","language-css"),k(S,"global",""),k(H,"class","code-fence svelte-hvavi2"),k(G,"class","language-svelte"),k(G,"data-svelte",""),k(en,"class","code-fence svelte-hvavi2"),k(cn,"class","language-svelte"),k(cn,"data-svelte",""),k(t,"class","markdown-body svelte-hvavi2")},m(n,i){u(n,t,i),r(t,e),r(t,a),r(t,s),r(t,o),r(t,c),r(t,l),r(t,p),r(t,h),r(t,m),m.innerHTML='<span class="token function">yarn</span> <span class="token function">add</span> -D svelte-search\n<span class="token comment"># OR</span>\n<span class="token function">npm</span> i -D svelte-search\n',r(t,y),r(t,b),r(t,x),r(t,$),r(t,w),r(t,_),r(t,L),r(t,T),T.innerHTML='<span class="token selector">:global(.svelte-search input)</span> <span class="token punctuation">{</span>\n  <span class="token property">font-size</span><span class="token punctuation">:</span> 1.5rem<span class="token punctuation">;</span>\n  <span class="token property">padding</span><span class="token punctuation">:</span> 1rem<span class="token punctuation">;</span>\n  <span class="token property">border</span><span class="token punctuation">:</span> 2px solid #e0e0e0<span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n',r(t,E),r(t,M),r(t,j),r(t,H),r(H,S),r(H,A),F(D,H,null),r(H,N),r(H,z),r(t,G),G.innerHTML='<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">></span></span><span class="token script"><span class="token language-javascript">\n  <span class="token keyword">import</span> Search <span class="token keyword">from</span> <span class="token string">"svelte-search"</span><span class="token punctuation">;</span>\n\n  <span class="token keyword">let</span> value <span class="token operator">=</span> <span class="token string">""</span><span class="token punctuation">;</span>\n</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>\n\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>style</span> <span class="token attr-name">global</span><span class="token punctuation">></span></span><span class="token style"><span class="token language-css">\n  <span class="token selector">.svelte-search input</span> <span class="token punctuation">{</span>\n    <span class="token property">width</span><span class="token punctuation">:</span> 100%<span class="token punctuation">;</span>\n    <span class="token property">font-size</span><span class="token punctuation">:</span> 1.25rem<span class="token punctuation">;</span>\n    <span class="token property">padding</span><span class="token punctuation">:</span> 0.5rem<span class="token punctuation">;</span>\n    <span class="token property">margin</span><span class="token punctuation">:</span> 0.5rem 0<span class="token punctuation">;</span>\n    <span class="token property">border</span><span class="token punctuation">:</span> 2px solid #e0e0e0<span class="token punctuation">;</span>\n    <span class="token property">border-radius</span><span class="token punctuation">:</span> 0.25rem<span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>style</span><span class="token punctuation">></span></span>\n\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Search</span> <span class="token attr-name"><span class="token namespace">bind:</span>value</span> <span class="token punctuation">/></span></span>\n\nValue:\n<span class="token language-javascript"><span class="token punctuation">{</span>value<span class="token punctuation">}</span></span>\n',r(t,W),r(t,R),r(t,Y),r(t,J),r(t,Z),r(t,nn),r(t,tn),r(t,en),F(an,en,null),r(en,on);for(let n=0;n<An.length;n+=1)An[n].m(en,null);r(t,cn),cn.innerHTML='<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">></span></span><span class="token script"><span class="token language-javascript">\n  <span class="token keyword">let</span> type <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>\n</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>\n\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Search</span>\n  <span class="token attr-name"><span class="token namespace">bind:</span>value</span>\n  <span class="token attr-name">debounce</span>\n  <span class="token attr-name">debounceValue=</span><span class="token language-javascript"><span class="token punctuation">{</span><span class="token number">800</span><span class="token punctuation">}</span></span>\n  <span class="token attr-name"><span class="token namespace">on:</span>type=</span><span class="token language-javascript"><span class="token punctuation">{</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n    type <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token operator">...</span>type<span class="token punctuation">,</span> value<span class="token punctuation">]</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span><span class="token punctuation">}</span></span>\n<span class="token punctuation">/></span></span>\n\n<span class="token each"><span class="token punctuation">{</span><span class="token keyword">#each</span> <span class="token language-javascript">type </span><span class="token keyword">as</span> <span class="token language-javascript">entry<span class="token punctuation">}</span></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">></span></span><span class="token language-javascript"><span class="token punctuation">{</span>entry<span class="token punctuation">}</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>\n<span class="token each"><span class="token punctuation">{</span><span class="token keyword">/each</span><span class="token punctuation">}</span></span>\n',r(t,ln),r(t,pn),r(t,rn),r(t,un),r(t,dn),r(t,fn),r(t,gn),r(t,hn),r(t,kn),r(t,mn),r(t,vn),r(t,yn),r(t,bn),r(t,xn),r(t,$n),r(t,wn),r(t,_n),r(t,Ln),r(t,Tn),r(t,Cn),En=!0},p(n,[t]){const e={};!q&&1&t&&(q=!0,e.value=n[0],V((()=>q=!1))),D.$set(e),(!En||1&t)&&v(z,n[0]);const a={};if(!sn&&1&t&&(sn=!0,a.value=n[0],V((()=>sn=!1))),an.$set(a),2&t){let e;for(Vn=n[1],e=0;e<Vn.length;e+=1){const a=Q(n,Vn,e);An[e]?An[e].p(a,t):(An[e]=X(a),An[e].c(),An[e].m(en,null))}for(;e<An.length;e+=1)An[e].d(1);An.length=Vn.length}},i(n){En||(I(D.$$.fragment,n),I(an.$$.fragment,n),En=!0)},o(n){P(D.$$.fragment,n),P(an.$$.fragment,n),En=!1},d(n){n&&i(t),U(D),U(an),function(n,t){for(let e=0;e<n.length;e+=1)n[e]&&n[e].d(t)}(An,n)}}}function nn(n,t,e){let a="",s=[];return[a,s,function(n){a=n,e(0,a)},function(n){a=n,e(0,a)},()=>{e(1,s=[...s,a])}]}return new class extends R{constructor(n){var t;super(),document.getElementById("svelte-hvavi2-style")||((t=d("style")).id="svelte-hvavi2-style",t.textContent=".token.language-javascript{color:#24292e}.token.language-javascript .function{color:#005cc5}.token.language-javascript .string{color:#032f62}.token.language-javascript .number{color:#005cc5}.token.language-javascript .keyword{color:#d73a49}.token.each{color:#d73a49}.token.punctuation{color:#24292e }.token.tag{color:#22863a}.token.attr-name{color:#6f42c1}.token.operator{color:#d73a49}.token.comment{color:#6a737d}.language-css{color:#032f62}.language-css .selector{color:#22863a}.language-css .property{color:#005cc5}.code-fence.svelte-hvavi2{padding:45px 15px;border:1px solid #eaecef;border-bottom:0}main.svelte-hvavi2{box-sizing:border-box;max-width:980px;margin:0 auto;padding:45px}@media(max-width: 767px){main.svelte-hvavi2{padding:15px}}",r(document.head,t)),W(this,n,nn,Z,c,{})}}({target:document.body})}();
