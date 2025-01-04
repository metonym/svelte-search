var app=function(){"use strict";function n(){}function a(n,a){for(const t in a)n[t]=a[t];return n}function t(n){return n()}function s(){return Object.create(null)}function e(n){n.forEach(t)}function o(n){return"function"==typeof n}function p(n,a){return n!=n?a==a:n!==a}function l(n,t,s,e){return n[1]&&e?a(s.ctx.slice(),n[1](e(t))):s.ctx}function c(n,a){const t={};a=new Set(a);for(const s in n)a.has(s)||"$"===s[0]||(t[s]=n[s]);return t}function i(n,a){n.appendChild(a)}function u(n,a,t){n.insertBefore(a,t||null)}function r(n){n.parentNode&&n.parentNode.removeChild(n)}function d(n){return document.createElement(n)}function k(n){return document.createTextNode(n)}function f(){return k(" ")}function g(n,a,t,s){return n.addEventListener(a,t,s),()=>n.removeEventListener(a,t,s)}function h(n,a,t){null==t?n.removeAttribute(a):n.getAttribute(a)!==t&&n.setAttribute(a,t)}const m=["width","height"];function b(n,a){const t=Object.getOwnPropertyDescriptors(n.__proto__);for(const s in a)null==a[s]?n.removeAttribute(s):"style"===s?n.style.cssText=a[s]:"__value"===s?n.value=n[s]=a[s]:t[s]&&t[s].set&&-1===m.indexOf(s)?n[s]=a[s]:h(n,s,a[s])}function v(n,a){a=""+a,n.data!==a&&(n.data=a)}function y(n,a){n.value=null==a?"":a}let $;function x(n){$=n}function w(){const n=function(){if(!$)throw new Error("Function called outside component initialization");return $}();return(a,t,{cancelable:s=!1}={})=>{const e=n.$$.callbacks[a];if(e){const o=function(n,a,{bubbles:t=!1,cancelable:s=!1}={}){return new CustomEvent(n,{detail:a,bubbles:t,cancelable:s})}(a,t,{cancelable:s});return e.slice().forEach((a=>{a.call(n,o)})),!o.defaultPrevented}return!0}}function L(n,a){const t=n.$$.callbacks[a.type];t&&t.slice().forEach((n=>n.call(this,a)))}const T=[],M=[];let H=[];const C=[],S=Promise.resolve();let _=!1;function A(n){H.push(n)}function j(n){C.push(n)}const E=new Set;let P=0;function F(){if(0!==P)return;const n=$;do{try{for(;P<T.length;){const n=T[P];P++,x(n),O(n.$$)}}catch(n){throw T.length=0,P=0,n}for(x(null),T.length=0,P=0;M.length;)M.pop()();for(let n=0;n<H.length;n+=1){const a=H[n];E.has(a)||(E.add(a),a())}H.length=0}while(T.length);for(;C.length;)C.pop()();_=!1,E.clear(),x(n)}function O(n){if(null!==n.fragment){n.update(),e(n.before_update);const a=n.dirty;n.dirty=[-1],n.fragment&&n.fragment.p(n.ctx,a),n.after_update.forEach(A)}}const N=new Set;function q(n,a){n&&n.i&&(N.delete(n),n.i(a))}function D(n,a,t,s){if(n&&n.o){if(N.has(n))return;N.add(n),undefined.c.push((()=>{N.delete(n),s&&(t&&n.d(1),s())})),n.o(a)}else s&&s()}function I(n,a,t){const s=n.$$.props[a];void 0!==s&&(n.$$.bound[s]=t,t(n.$$.ctx[s]))}function U(n){n&&n.c()}function z(n,a,s){const{fragment:p,after_update:l}=n.$$;p&&p.m(a,s),A((()=>{const a=n.$$.on_mount.map(t).filter(o);n.$$.on_destroy?n.$$.on_destroy.push(...a):e(a),n.$$.on_mount=[]})),l.forEach(A)}function B(n,a){const t=n.$$;null!==t.fragment&&(!function(n){const a=[],t=[];H.forEach((s=>-1===n.indexOf(s)?a.push(s):t.push(s))),t.forEach((n=>n())),H=a}(t.after_update),e(t.on_destroy),t.fragment&&t.fragment.d(a),t.on_destroy=t.fragment=null,t.ctx=[])}function G(n,a){-1===n.$$.dirty[0]&&(T.push(n),_||(_=!0,S.then(F)),n.$$.dirty.fill(0)),n.$$.dirty[a/31|0]|=1<<a%31}function J(a,t,o,p,l,c,i=null,u=[-1]){const d=$;x(a);const k=a.$$={fragment:null,ctx:[],props:c,update:n,not_equal:l,bound:s(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(t.context||(d?d.$$.context:[])),callbacks:s(),dirty:u,skip_bound:!1,root:t.target||d.$$.root};i&&i(k.root);let f=!1;if(k.ctx=o?o(a,t.props||{},((n,t,...s)=>{const e=s.length?s[0]:t;return k.ctx&&l(k.ctx[n],k.ctx[n]=e)&&(!k.skip_bound&&k.bound[n]&&k.bound[n](e),f&&G(a,n)),t})):[],k.update(),f=!0,e(k.before_update),k.fragment=!!p&&p(k.ctx),t.target){if(t.hydrate){const n=function(n){return Array.from(n.childNodes)}(t.target);k.fragment&&k.fragment.l(n),n.forEach(r)}else k.fragment&&k.fragment.c();t.intro&&q(a.$$.fragment),z(a,t.target,t.anchor),F()}x(d)}class V{$$=void 0;$$set=void 0;$destroy(){B(this,1),this.$destroy=n}$on(a,t){if(!o(t))return n;const s=this.$$.callbacks[a]||(this.$$.callbacks[a]=[]);return s.push(t),()=>{const n=s.indexOf(t);-1!==n&&s.splice(n,1)}}$set(n){var a;this.$$set&&(a=n,0!==Object.keys(a).length)&&(this.$$.skip_bound=!0,this.$$set(n),this.$$.skip_bound=!1)}}"undefined"!=typeof window&&(window.__svelte||(window.__svelte={v:new Set})).v.add("4");const R=n=>({}),X=n=>({});function Y(n){let t,s,o,p,c,m,$,x,w,L,T;const M=n[10].label,H=function(n,a,t,s){if(n){const e=l(n,a,t,s);return n[0](e)}}(M,n,n[9],X),C=H||function(n){let a;return{c(){a=k(n[2])},m(n,t){u(n,a,t)},p(n,t){4&t&&v(a,n[2])},d(n){n&&r(a)}}}(n);let S=[{name:"search"},{type:"search"},{placeholder:"Search..."},{autocomplete:"off"},{spellcheck:"false"},n[6],{id:n[4]}],_={};for(let n=0;n<S.length;n+=1)_=a(_,S[n]);return{c(){t=d("form"),s=d("label"),C&&C.c(),c=f(),m=d("input"),h(s,"id",o=n[4]+"-label"),h(s,"for",n[4]),h(s,"style",p=n[3]&&"position: absolute;height: 1px;width: 1px;overflow: hidden;clip: rect(1px 1px 1px 1px);clip: rect(1px, 1px, 1px, 1px);white-space: nowrap;"),b(m,_),h(t,"data-svelte-search",""),h(t,"role",$=n[5]?null:"search"),h(t,"aria-labelledby",x=n[5]?null:n[4]),h(t,"action","")},m(a,e){var o;u(a,t,e),i(t,s),C&&C.m(s,null),i(t,c),i(t,m),m.autofocus&&m.focus(),n[17](m),y(m,n[0]),w=!0,L||(T=[g(m,"input",n[18]),g(m,"input",n[12]),g(m,"change",n[13]),g(m,"focus",n[14]),g(m,"blur",n[15]),g(m,"keydown",n[16]),g(t,"submit",(o=n[11],function(n){return n.preventDefault(),o.call(this,n)}))],L=!0)},p(n,[a]){H?H.p&&(!w||512&a)&&function(n,a,t,s,e,o){if(e){const p=l(a,t,s,o);n.p(p,e)}}(H,M,n,n[9],w?function(n,a,t,s){if(n[2]&&s){const e=n[2](s(t));if(void 0===a.dirty)return e;if("object"==typeof e){const n=[],t=Math.max(a.dirty.length,e.length);for(let s=0;s<t;s+=1)n[s]=a.dirty[s]|e[s];return n}return a.dirty|e}return a.dirty}(M,n[9],a,R):function(n){if(n.ctx.length>32){const a=[],t=n.ctx.length/32;for(let n=0;n<t;n++)a[n]=-1;return a}return-1}(n[9]),X):C&&C.p&&(!w||4&a)&&C.p(n,w?a:-1),(!w||16&a&&o!==(o=n[4]+"-label"))&&h(s,"id",o),(!w||16&a)&&h(s,"for",n[4]),(!w||8&a&&p!==(p=n[3]&&"position: absolute;height: 1px;width: 1px;overflow: hidden;clip: rect(1px 1px 1px 1px);clip: rect(1px, 1px, 1px, 1px);white-space: nowrap;"))&&h(s,"style",p),b(m,_=function(n,a){const t={},s={},e={$$scope:1};let o=n.length;for(;o--;){const p=n[o],l=a[o];if(l){for(const n in p)n in l||(s[n]=1);for(const n in l)e[n]||(t[n]=l[n],e[n]=1);n[o]=l}else for(const n in p)e[n]=1}for(const n in s)n in t||(t[n]=void 0);return t}(S,[{name:"search"},{type:"search"},{placeholder:"Search..."},{autocomplete:"off"},{spellcheck:"false"},64&a&&n[6],(!w||16&a)&&{id:n[4]}])),1&a&&m.value!==n[0]&&y(m,n[0]),(!w||32&a&&$!==($=n[5]?null:"search"))&&h(t,"role",$),(!w||48&a&&x!==(x=n[5]?null:n[4]))&&h(t,"aria-labelledby",x)},i(n){w||(q(C,n),w=!0)},o(n){D(C,n),w=!1},d(a){a&&r(t),C&&C.d(a),n[17](null),L=!1,e(T)}}}function K(n,t,s){const e=["value","autofocus","debounce","label","hideLabel","id","ref","removeFormAriaAttributes"];let o=c(t,e),{$$slots:p={},$$scope:l}=t,{value:i=""}=t,{autofocus:u=!1}=t,{debounce:r=0}=t,{label:d="Label"}=t,{hideLabel:k=!1}=t,{id:f="search"+Math.random().toString(36)}=t,{ref:g=null}=t,{removeFormAriaAttributes:h=!1}=t;return w(),n.$$set=n=>{t=a(a({},t),function(n){const a={};for(const t in n)"$"!==t[0]&&(a[t]=n[t]);return a}(n)),s(6,o=c(t,e)),"value"in n&&s(0,i=n.value),"autofocus"in n&&s(7,u=n.autofocus),"debounce"in n&&s(8,r=n.debounce),"label"in n&&s(2,d=n.label),"hideLabel"in n&&s(3,k=n.hideLabel),"id"in n&&s(4,f=n.id),"ref"in n&&s(1,g=n.ref),"removeFormAriaAttributes"in n&&s(5,h=n.removeFormAriaAttributes),"$$scope"in n&&s(9,l=n.$$scope)},[i,g,d,k,f,h,o,u,r,l,p,function(a){L.call(this,n,a)},function(a){L.call(this,n,a)},function(a){L.call(this,n,a)},function(a){L.call(this,n,a)},function(a){L.call(this,n,a)},function(a){L.call(this,n,a)},function(n){M[n?"unshift":"push"]((()=>{g=n,s(1,g)}))},function(){i=this.value,s(0,i)}]}class Q extends V{constructor(n){super(),J(this,n,K,Y,p,{value:0,autofocus:7,debounce:8,label:2,hideLabel:3,id:4,ref:1,removeFormAriaAttributes:5})}}function W(n){let a,t,s,e,o,p,l;return{c(){a=d("button"),t=k('Clear "'),s=k(n[0]),e=k('"'),o=f()},m(c,r){u(c,a,r),i(a,t),i(a,s),i(a,e),u(c,o,r),p||(l=g(a,"click",n[4]),p=!0)},p(n,a){1&a&&v(s,n[0])},d(n){n&&(r(a),r(o)),p=!1,l()}}}function Z(a){let t;return{c(){var n,a,s,e;t=d("span"),t.textContent="Custom label",h(t,"slot","label"),n=t,a="color",null==(s="red")?n.style.removeProperty(a):n.style.setProperty(a,s,e?"important":"")},m(n,a){u(n,t,a)},p:n,d(n){n&&r(t)}}}function nn(n){let a,t,s,e,o,p,l,c,m,b,y,$,x,w,L,T,H,C,S,_,A,E,P,F,O,N,G,J,V,R,X,Y,K,nn,an,tn,sn,en,on,pn,ln,cn,un,rn,dn,kn,fn,gn,hn,mn,bn,vn,yn,$n,xn,wn,Ln,Tn,Mn,Hn,Cn,Sn,_n,An,jn,En,Pn,Fn,On,Nn,qn,Dn,In,Un,zn,Bn,Gn,Jn,Vn,Rn,Xn,Yn,Kn,Qn,Wn,Zn,na,aa,ta,sa,ea,oa,pa,la,ca,ia,ua,ra,da,ka,fa,ga,ha,ma,ba,va,ya,$a,xa,wa,La,Ta,Ma,Ha,Ca,Sa,_a,Aa,ja,Ea,Pa,Fa,Oa,Na,qa,Da,Ia,Ua,za,Ba=JSON.stringify(n[2],null,2)+"";function Ga(a){n[3](a)}let Ja={};void 0!==n[0]&&(Ja.value=n[0]),tn=new Q({props:Ja}),M.push((()=>I(tn,"value",Ga)));let Va=n[0]&&W(n);function Ra(a){n[5](a)}let Xa={};function Ya(a){n[7](a)}void 0!==n[0]&&(Xa.value=n[0]),kn=new Q({props:Xa}),M.push((()=>I(kn,"value",Ra))),kn.$on("submit",n[6]),xn=new Q({props:{label:"My label",placeholder:"Placeholder text..."}}),Cn=new Q({props:{$$slots:{label:[Z]},$$scope:{ctx:n}}}),On=new Q({props:{hideLabel:!0,label:"My label",placeholder:"Placeholder text..."}});let Ka={};return void 0!==n[1]&&(Ka.ref=n[1]),Kn=new Q({props:Ka}),M.push((()=>I(Kn,"ref",Ya))),la=new Q({props:{debounce:800}}),la.$on("type",n[9]),_a=new Q({}),_a.$on("type",n[10]),_a.$on("clear",n[11]),{c(){a=d("main"),t=d("h1"),t.textContent="svelte-search",s=f(),e=d("p"),e.innerHTML='<a href="https://npmjs.com/package/svelte-search"><img src="https://img.shields.io/npm/v/svelte-search.svg?color=%23ff3e00&amp;style=for-the-badge" alt="NPM"/></a>',o=f(),p=d("blockquote"),p.innerHTML="<p>Accessible, customizable Svelte search component.</p>",l=f(),c=d("p"),c.innerHTML='<a href="git+https://github.com/metonym/svelte-search.git">GitHub repo</a>',m=f(),b=d("p"),b.innerHTML="This search component is composed using semantic <code>form</code> and <code>input</code> elements.",y=f(),$=d("p"),$.innerHTML='See <a href="https://github.com/metonym/svelte-typeahead">svelte-typeahead</a> for a search component with dropdown results.',x=f(),w=d("p"),w.innerHTML='Try it in the <a href="https://svelte.dev/playground/5e14a2cff1b9488fa4ffbff980c1f21d">Svelte REPL</a>.',L=f(),T=d("hr"),H=f(),C=d("p"),C.innerHTML="<strong>Table of Contents</strong>",S=d("ul"),S.innerHTML='<li><a href="#installation">Installation</a></li> <li><a href="#styling">Styling</a></li> <li><a href="#usage">Usage</a></li> <ul><li><a href="#two-way-binding">Two-way binding</a></li> <li><a href="#on%3Asubmit">on:submit</a></li> <li><a href="#label-with-placeholder-text">Label with placeholder text</a></li> <li><a href="#label-slot">Label slot</a></li> <li><a href="#visually-hidden-label">Visually hidden label</a></li> <li><a href="#focus-(declarative)">Focus (declarative)</a></li> <li><a href="#focus-(programmatic)">Focus (programmatic)</a></li> <li><a href="#debounced-input">Debounced input</a></li> </ul><li><a href="#api">API</a></li> <ul><li><a href="#props">Props</a></li> <li><a href="#forwarded-events">Forwarded events</a></li> <li><a href="#dispatched-events">Dispatched events</a></li> </ul><li><a href="#changelog">Changelog</a></li> <li><a href="#license">License</a></li>',_=f(),A=d("h2"),A.textContent="Installation",E=f(),P=d("pre"),F=f(),O=d("h2"),O.textContent="Styling",N=f(),G=d("p"),G.innerHTML="This component is unstyled by design. Target the component using the <code>[data-svelte-search]</code> selector.",J=f(),V=d("pre"),R=f(),X=d("h2"),X.textContent="Usage",Y=f(),K=d("h3"),K.textContent="Two-way binding",nn=f(),an=d("div"),U(tn.$$.fragment),en=f(),Va&&Va.c(),on=d("pre"),pn=f(),ln=d("h3"),ln.textContent="on:submit",cn=f(),un=d("p"),un.innerHTML="The <code>input</code> element is contained in a <code>form</code>. Use the forwarded <code>submit</code> event to obtain the value when pressing “Enter.”",rn=f(),dn=d("div"),U(kn.$$.fragment),gn=d("pre"),hn=f(),mn=d("h3"),mn.textContent="Label with placeholder text",bn=f(),vn=d("p"),vn.innerHTML="<code>$$restProps</code> are forwarded to the input element.",yn=f(),$n=d("div"),U(xn.$$.fragment),wn=d("pre"),Ln=f(),Tn=d("h3"),Tn.textContent="Label slot",Mn=f(),Hn=d("div"),U(Cn.$$.fragment),Sn=d("pre"),_n=f(),An=d("h3"),An.textContent="Visually hidden label",jn=f(),En=d("p"),En.innerHTML="Set <code>hideLabel</code> to <code>true</code> to visually hide the label.",Pn=f(),Fn=d("div"),U(On.$$.fragment),Nn=d("pre"),qn=f(),Dn=d("h3"),Dn.textContent="Focus (declarative)",In=f(),Un=d("p"),Un.innerHTML="Use the <code>autofocus</code> prop to declaratively focus the input.",zn=f(),Bn=d("pre"),Gn=f(),Jn=d("h3"),Jn.textContent="Focus (programmatic)",Vn=f(),Rn=d("p"),Rn.innerHTML="Bind the <code>ref</code> prop to programmatically focus the input.",Xn=f(),Yn=d("div"),U(Kn.$$.fragment),Wn=f(),Zn=d("button"),Zn.textContent="Focus",na=d("pre"),aa=f(),ta=d("h3"),ta.textContent="Debounced input",sa=f(),ea=d("p"),ea.innerHTML="Use the <code>debounce</code> prop to specify the debounce value in milliseconds.",oa=f(),pa=d("div"),U(la.$$.fragment),ca=f(),ia=d("pre"),ua=k(Ba),ra=d("pre"),da=f(),ka=d("h2"),ka.textContent="API",fa=f(),ga=d("p"),ga.innerHTML="<code>$$restProps</code> are forwarded to the input element.",ha=f(),ma=d("h3"),ma.textContent="Props",ba=f(),va=d("table"),va.innerHTML='<thead><tr><th style="text-align:left">Prop name</th> <th style="text-align:left">Type</th> <th style="text-align:left">Default value</th></tr></thead> <tbody><tr><td style="text-align:left">value</td> <td style="text-align:left"><code>string</code></td> <td style="text-align:left"><code>&quot;&quot;</code></td></tr> <tr><td style="text-align:left">label</td> <td style="text-align:left"><code>string</code></td> <td style="text-align:left"><code>&quot;Search&quot;</code></td></tr> <tr><td style="text-align:left">hideLabel</td> <td style="text-align:left"><code>boolean</code></td> <td style="text-align:left"><code>false</code></td></tr> <tr><td style="text-align:left">debounce</td> <td style="text-align:left"><code>number</code></td> <td style="text-align:left"><code>0</code></td></tr> <tr><td style="text-align:left">ref</td> <td style="text-align:left"><code>HTMLInputElement</code></td> <td style="text-align:left"><code>null</code></td></tr> <tr><td style="text-align:left">id</td> <td style="text-align:left"><code>string</code></td> <td style="text-align:left"><code>&quot;search&quot; + Math.random().toString(36)</code></td></tr> <tr><td style="text-align:left">removeFormAriaAttributes</td> <td style="text-align:left"><code>boolean</code></td> <td style="text-align:left"><code>false</code></td></tr> <tr><td style="text-align:left">autofocus</td> <td style="text-align:left"><code>boolean</code></td> <td style="text-align:left"><code>false</code></td></tr></tbody>',ya=f(),$a=d("h3"),$a.textContent="Forwarded events",xa=f(),wa=d("ul"),wa.innerHTML="<li>on:input</li> <li>on:change</li> <li>on:submit</li> <li>on:focus</li> <li>on:blur</li> <li>on:keydown</li>",La=f(),Ta=d("h3"),Ta.textContent="Dispatched events",Ma=f(),Ha=d("ul"),Ha.innerHTML="<li><strong>on:type</strong>: fired when the the input value is updated</li> <li><strong>on:clear</strong>: fired when clicking the “X” button to clear the input value</li>",Ca=f(),Sa=d("div"),U(_a.$$.fragment),Aa=d("pre"),ja=f(),Ea=d("h2"),Ea.textContent="Changelog",Pa=f(),Fa=d("p"),Fa.innerHTML='<a href="https://github.com/metonym/svelte-search/tree/master/CHANGELOG.md">Changelog</a>',Oa=f(),Na=d("h2"),Na.textContent="License",qa=f(),Da=d("p"),Da.innerHTML='<a href="https://github.com/metonym/svelte-search/tree/master/LICENSE">MIT</a>',h(t,"id","svelte-search"),h(A,"id","installation"),h(P,"class","language-bash"),h(O,"id","styling"),h(V,"class","language-css"),h(X,"id","usage"),h(K,"id","two-way-binding"),h(an,"class","code-fence"),h(on,"class","language-svelte"),h(on,"data-svelte",""),h(ln,"id","on%3Asubmit"),h(dn,"class","code-fence"),h(gn,"class","language-svelte"),h(gn,"data-svelte",""),h(mn,"id","label-with-placeholder-text"),h($n,"class","code-fence"),h(wn,"class","language-svelte"),h(wn,"data-svelte",""),h(Tn,"id","label-slot"),h(Hn,"class","code-fence"),h(Sn,"class","language-svelte"),h(Sn,"data-svelte",""),h(An,"id","visually-hidden-label"),h(Fn,"class","code-fence"),h(Nn,"class","language-svelte"),h(Nn,"data-svelte",""),h(Dn,"id","focus-(declarative)"),h(Bn,"class","language-svelte"),h(Jn,"id","focus-(programmatic)"),h(Yn,"class","code-fence"),h(na,"class","language-svelte"),h(na,"data-svelte",""),h(ta,"id","debounced-input"),h(pa,"class","code-fence"),h(ra,"class","language-svelte"),h(ra,"data-svelte",""),h(ka,"id","api"),h(ma,"id","props"),h($a,"id","forwarded-events"),h(Ta,"id","dispatched-events"),h(Sa,"class","code-fence"),h(Aa,"class","language-svelte"),h(Aa,"data-svelte",""),h(Ea,"id","changelog"),h(Na,"id","license"),h(a,"class","markdown-body")},m(r,d){u(r,a,d),i(a,t),i(a,s),i(a,e),i(a,o),i(a,p),i(a,l),i(a,c),i(a,m),i(a,b),i(a,y),i(a,$),i(a,x),i(a,w),i(a,L),i(a,T),i(a,H),i(a,C),i(a,S),i(a,_),i(a,A),i(a,E),i(a,P),P.innerHTML='<span class="token comment"># npm</span>\n<span class="token function">npm</span> i svelte-search\n\n<span class="token comment"># pnpm</span>\n<span class="token function">pnpm</span> i svelte-search\n\n<span class="token comment"># Yarn</span>\n<span class="token function">yarn</span> <span class="token function">add</span> svelte-search\n\n<span class="token comment"># Bun</span>\nbun <span class="token function">add</span> svelte-search\n',i(a,F),i(a,O),i(a,N),i(a,G),i(a,J),i(a,V),V.innerHTML='<span class="token selector">:global([data-svelte-search] input)</span> <span class="token punctuation">{</span>\n  <span class="token property">width</span><span class="token punctuation">:</span> 100%<span class="token punctuation">;</span>\n  <span class="token property">font-size</span><span class="token punctuation">:</span> 1rem<span class="token punctuation">;</span>\n  <span class="token property">padding</span><span class="token punctuation">:</span> 0.5rem<span class="token punctuation">;</span>\n  <span class="token property">margin</span><span class="token punctuation">:</span> 0.5rem 0<span class="token punctuation">;</span>\n  <span class="token property">border</span><span class="token punctuation">:</span> 1px solid #e0e0e0<span class="token punctuation">;</span>\n  <span class="token property">border-radius</span><span class="token punctuation">:</span> 0.25rem<span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n',i(a,R),i(a,X),i(a,Y),i(a,K),i(a,nn),i(a,an),z(tn,an,null),i(an,en),Va&&Va.m(an,null),i(a,on),on.innerHTML='<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">></span></span><span class="token script"><span class="token language-javascript">\n  <span class="token keyword">import</span> Search <span class="token keyword">from</span> <span class="token string">"svelte-search"</span><span class="token punctuation">;</span>\n\n  <span class="token keyword">let</span> value <span class="token operator">=</span> <span class="token string">""</span><span class="token punctuation">;</span>\n</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>\n\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Search</span> <span class="token attr-name"><span class="token namespace">bind:</span>value</span> <span class="token punctuation">/></span></span>\n\n<span class="token language-javascript"><span class="token punctuation">{</span>#<span class="token keyword">if</span> value<span class="token punctuation">}</span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name"><span class="token namespace">on:</span>click=</span><span class="token language-javascript"><span class="token punctuation">{</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">(</span>value <span class="token operator">=</span> <span class="token string">""</span><span class="token punctuation">)</span><span class="token punctuation">}</span></span><span class="token punctuation">></span></span>Clear "<span class="token language-javascript"><span class="token punctuation">{</span>value<span class="token punctuation">}</span></span>"<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">></span></span>\n<span class="token language-javascript"><span class="token punctuation">{</span><span class="token operator">/</span><span class="token keyword">if</span><span class="token punctuation">}</span></span>\n',i(a,pn),i(a,ln),i(a,cn),i(a,un),i(a,rn),i(a,dn),z(kn,dn,null),i(a,gn),gn.innerHTML='<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Search</span> <span class="token attr-name"><span class="token namespace">bind:</span>value</span> <span class="token attr-name"><span class="token namespace">on:</span>submit=</span><span class="token language-javascript"><span class="token punctuation">{</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">"submit"</span><span class="token punctuation">,</span> value<span class="token punctuation">)</span><span class="token punctuation">}</span></span> <span class="token punctuation">/></span></span>\n',i(a,hn),i(a,mn),i(a,bn),i(a,vn),i(a,yn),i(a,$n),z(xn,$n,null),i(a,wn),wn.innerHTML='<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Search</span> <span class="token attr-name">label</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>My label<span class="token punctuation">"</span></span> <span class="token attr-name">placeholder</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>Placeholder text...<span class="token punctuation">"</span></span> <span class="token punctuation">/></span></span>\n',i(a,Ln),i(a,Tn),i(a,Mn),i(a,Hn),z(Cn,Hn,null),i(a,Sn),Sn.innerHTML='<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Search</span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>span</span> <span class="token attr-name">slot</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>label<span class="token punctuation">"</span></span> <span class="token attr-name">style</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>color: red;<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>Custom label<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>span</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>Search</span><span class="token punctuation">></span></span>\n',i(a,_n),i(a,An),i(a,jn),i(a,En),i(a,Pn),i(a,Fn),z(On,Fn,null),i(a,Nn),Nn.innerHTML='<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Search</span> <span class="token attr-name">hideLabel</span> <span class="token attr-name">label</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>My label<span class="token punctuation">"</span></span> <span class="token attr-name">placeholder</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>Placeholder text...<span class="token punctuation">"</span></span> <span class="token punctuation">/></span></span>\n',i(a,qn),i(a,Dn),i(a,In),i(a,Un),i(a,zn),i(a,Bn),Bn.innerHTML='<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Search</span> <span class="token attr-name">autofocus</span> <span class="token punctuation">/></span></span>\n',i(a,Gn),i(a,Jn),i(a,Vn),i(a,Rn),i(a,Xn),i(a,Yn),z(Kn,Yn,null),i(Yn,Wn),i(Yn,Zn),i(a,na),na.innerHTML='<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">></span></span><span class="token script"><span class="token language-javascript">\n  <span class="token keyword">import</span> Search <span class="token keyword">from</span> <span class="token string">"svelte-search"</span><span class="token punctuation">;</span>\n\n  <span class="token keyword">let</span> ref <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>\n</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>\n\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Search</span> <span class="token attr-name"><span class="token namespace">bind:</span>ref</span> <span class="token punctuation">/></span></span>\n\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name"><span class="token namespace">on:</span>click=</span><span class="token language-javascript"><span class="token punctuation">{</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> ref<span class="token punctuation">.</span><span class="token function">focus</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">}</span></span><span class="token punctuation">></span></span>Focus<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">></span></span>\n',i(a,aa),i(a,ta),i(a,sa),i(a,ea),i(a,oa),i(a,pa),z(la,pa,null),i(pa,ca),i(pa,ia),i(ia,ua),i(a,ra),ra.innerHTML='<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">></span></span><span class="token script"><span class="token language-javascript">\n  <span class="token keyword">import</span> Search <span class="token keyword">from</span> <span class="token string">"svelte-search"</span><span class="token punctuation">;</span>\n\n  <span class="token keyword">let</span> events <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>\n</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>\n\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Search</span>\n  <span class="token attr-name">debounce=</span><span class="token language-javascript"><span class="token punctuation">{</span><span class="token number">800</span><span class="token punctuation">}</span></span>\n  <span class="token attr-name"><span class="token namespace">on:</span>type=</span><span class="token language-javascript"><span class="token punctuation">{</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> <span class="token literal-property property">detail</span><span class="token operator">:</span> value <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">(</span>events <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token operator">...</span>events<span class="token punctuation">,</span> value<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">}</span></span>\n<span class="token punctuation">/></span></span>\n\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>pre</span><span class="token punctuation">></span></span><span class="token language-javascript"><span class="token punctuation">{</span><span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">stringify</span><span class="token punctuation">(</span>events<span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">}</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>pre</span><span class="token punctuation">></span></span>\n',i(a,da),i(a,ka),i(a,fa),i(a,ga),i(a,ha),i(a,ma),i(a,ba),i(a,va),i(a,ya),i(a,$a),i(a,xa),i(a,wa),i(a,La),i(a,Ta),i(a,Ma),i(a,Ha),i(a,Ca),i(a,Sa),z(_a,Sa,null),i(a,Aa),Aa.innerHTML='<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Search</span>\n  <span class="token attr-name"><span class="token namespace">on:</span>type=</span><span class="token language-javascript"><span class="token punctuation">{</span><span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">"type"</span><span class="token punctuation">,</span> e<span class="token punctuation">.</span>detail<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// input value</span>\n  <span class="token punctuation">}</span><span class="token punctuation">}</span></span>\n  <span class="token attr-name"><span class="token namespace">on:</span>clear=</span><span class="token language-javascript"><span class="token punctuation">{</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">"clear"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span><span class="token punctuation">}</span></span>\n<span class="token punctuation">/></span></span>\n',i(a,ja),i(a,Ea),i(a,Pa),i(a,Fa),i(a,Oa),i(a,Na),i(a,qa),i(a,Da),Ia=!0,Ua||(za=g(Zn,"click",n[8]),Ua=!0)},p(n,[a]){const t={};!sn&&1&a&&(sn=!0,t.value=n[0],j((()=>sn=!1))),tn.$set(t),n[0]?Va?Va.p(n,a):(Va=W(n),Va.c(),Va.m(an,null)):Va&&(Va.d(1),Va=null);const s={};!fn&&1&a&&(fn=!0,s.value=n[0],j((()=>fn=!1))),kn.$set(s);const e={};4096&a&&(e.$$scope={dirty:a,ctx:n}),Cn.$set(e);const o={};!Qn&&2&a&&(Qn=!0,o.ref=n[1],j((()=>Qn=!1))),Kn.$set(o),(!Ia||4&a)&&Ba!==(Ba=JSON.stringify(n[2],null,2)+"")&&v(ua,Ba)},i(n){Ia||(q(tn.$$.fragment,n),q(kn.$$.fragment,n),q(xn.$$.fragment,n),q(Cn.$$.fragment,n),q(On.$$.fragment,n),q(Kn.$$.fragment,n),q(la.$$.fragment,n),q(_a.$$.fragment,n),Ia=!0)},o(n){D(tn.$$.fragment,n),D(kn.$$.fragment,n),D(xn.$$.fragment,n),D(Cn.$$.fragment,n),D(On.$$.fragment,n),D(Kn.$$.fragment,n),D(la.$$.fragment,n),D(_a.$$.fragment,n),Ia=!1},d(n){n&&r(a),B(tn),Va&&Va.d(),B(kn),B(xn),B(Cn),B(On),B(Kn),B(la),B(_a),Ua=!1,za()}}}function an(n,a,t){let s="",e=null,o=[];return[s,e,o,function(n){s=n,t(0,s)},()=>t(0,s=""),function(n){s=n,t(0,s)},()=>console.log("submit",s),function(n){e=n,t(1,e)},()=>e.focus(),({detail:n})=>t(2,o=[...o,n]),n=>{console.log("type",n.detail)},()=>{console.log("clear")}]}return new class extends V{constructor(n){super(),J(this,n,an,nn,p,{})}}({target:document.body})}();
