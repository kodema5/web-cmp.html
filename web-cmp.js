var g=Object.defineProperty;var y=(n,e,t)=>e in n?g(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var p=(n,e,t)=>(y(n,typeof e!="symbol"?e+"":e,t),t);var f=class{constructor(e,t){this.strings=e,this.keys=t,this.templateId="web-cmp-"+ ++f.templateId,this.template=null,this.dom=null,this.fnId=0,this.functions={}}get content(){return(this.template??this.build()).content}build(){let e=this,t=e.strings.map((i,o)=>{let l=e.keys[o];if(!l)return i;if(typeof l!="function")return[i,l];let c=this.getFnId();this.functions[c]=l;let s=l.call(e.context,e.context),a=s instanceof f?s.innerHTML:s;return[i,"<!--",c,"-->",a,"<!--\\",c,"-->"]}).flat().filter(Boolean).join(""),r=f.create(t);return this.template=r,r}getFnId(){return this.templateId+"-"+ ++this.fnId}get innerHTML(){let e=document.createElement("div");return e.appendChild(this.content.cloneNode(!0)),e.innerHTML}refresh(e=null,t){t=t??this.dom;let r=document.createTreeWalker(t,NodeFilter.SHOW_COMMENT);for(var i;i=r.nextNode();){let l=r.currentNode.textContent;if(!l)continue;let c=this.functions[l];if(!c)continue;let s=c.call(e,e),a=s instanceof f?s.content:s instanceof HTMLElement?s:f.create(s).content;if(!a)continue;let h="\\"+l;for(var o;(o=i.nextSibling)&&!(o.nodeType===8&&o.textContent===h);)o.remove();!i||i.parentNode.insertBefore(a,i.nextSibling)}}},u=f;p(u,"templateId",0),p(u,"create",e=>{let t=document.createElement("template");return t.innerHTML=e,t});var C=(n,...e)=>new u(n,e);var O=(n,{formAssociated:e=!0,elements:t={},connectedCallback:r=()=>{},attributes:i={},attributeChangedCallback:o=()=>{},properties:l={},...c}={})=>{let s=class extends HTMLElement{static formAssociated=e;constructor(){super(),this.template=n,this.internals=this.attachInternals();let h=this.attachShadow({mode:"open"});h.appendChild(n.content.cloneNode(!0)),T(this,h,t)}static get observedAttributes(){return Object.keys(i)}attributeChangedCallback(h,m,x){let d=i[h];d&&typeof d=="function"&&d.call(this,x,m),o.call(this,h,m,x)}refresh(){this.template.refresh(this,this.shadowRoot)}connectedCallback(){setTimeout(()=>{this.refresh(),r.call(this)})}},a=s.prototype;return b(a,l),b(a,c),s},T=(n,e,t)=>{Object.keys(t).forEach(r=>{let i=r==="."||r==="this"?e:e.querySelector(r);if(!i)return;let o={...t[r]},l=o.id||i.id;if(delete o.id,l&&i!==e){if(n[l])return;n[l]=i}Object.entries(o).forEach(([c,s])=>{let a=typeof s=="function";if(c[0]=="$"){if(!a)return;i.addEventListener(c.slice(1),s.bind(n))}i[c]=a?s.bind(n):s})})},b=(n,e)=>{Object.getOwnPropertyNames(e).forEach(t=>{let r=Object.getOwnPropertyDescriptor(e,t);r.hasOwnProperty("value")?n[t]=r.value:("get"in r||"set"in r)&&Object.defineProperty(n,t,{get:r.get,set:r.set})})};var w=n=>{let{cssRules:e}=Array.from(document.styleSheets).filter(t=>t.href.indexOf(n)>=0)[0]||{};return e?Object.values(e).map(t=>t.cssText).join(`
`):""};export{u as Template,w as getCssText,C as template,O as webCmp};
//# sourceMappingURL=web-cmp.js.map
