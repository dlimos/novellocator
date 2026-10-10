(()=>{
 const config=window.atlasLocaleData;
 const query=new URLSearchParams(location.search);
 let saved;try{saved=localStorage.getItem('atlas-language')}catch{}
 const requested=query.get('lang')||saved||config.defaultLocale;
 const locale=config.languages.some(lang=>lang.id===requested)?requested:config.defaultLocale;
 const aliases=Object.fromEntries(Object.entries(config.messages[config.defaultLocale]).map(([key,value])=>[value,key]));
 const t=key=>config.messages[locale]?.[aliases[key]||key]??config.messages[config.defaultLocale]?.[aliases[key]||key]??key;
 document.documentElement.lang=locale;
 function translateDOM(root){
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
  for(const node of nodes){if(node.parentElement?.closest('script,style,.esri-view'))continue;const key=node.textContent.trim();if(key)node.textContent=node.textContent.replace(key,t(key));}
  for(const element of root.querySelectorAll('[aria-label],[title],[alt],meta[name="description"]')){
   for(const attr of ['aria-label','title','alt','content'])if(element.hasAttribute(attr))element.setAttribute(attr,t(element.getAttribute(attr)));
  }
 }
 function localizeData(value,key){
  if(key==='placeCategories')return value;
  if(typeof value==='string')return ['english','id','placeId','category','citationCsvPrefix','hashPrefix','url','kind','checked','quote','language','attribution','rightsUrl','type','entityId'].includes(key)?value:(window.atlasTranslations?.[locale]?.[value]??value);
  if(Array.isArray(value))return value.map(item=>localizeData(item));
  if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,item])=>[k,localizeData(item,k)]));
  return value;
 }
 function start(){
  translateDOM(document.body);translateDOM(document.head);
  const select=document.getElementById('language-select');if(!select)return;
  config.languages.forEach(lang=>{const option=document.createElement('option');option.value=lang.id;option.textContent=lang.label;select.appendChild(option)});select.value=locale;
  select.addEventListener('change',()=>{
   try{localStorage.setItem('atlas-language',select.value)}catch{}
   const url=new URL(location.href);url.searchParams.set('lang',select.value);
   if(window.atlasState){const state=window.atlasState();url.searchParams.set('basemap',state.basemap);url.searchParams.set('place',state.place);if(state.layers)url.searchParams.set('layers',state.layers);if(state.citation>=0)url.searchParams.set('citation',state.citation);else url.searchParams.delete('citation')}
   location.assign(url.href);
  });
  for(const a of document.querySelectorAll('a[href]')){
   const href=a.getAttribute('href');if(!/^(index|atlas|illustrated)\.html(?:[?#]|$)/.test(href))continue;
   const target=new URL(href,location.href);target.searchParams.set('lang',locale);a.href=target.href;
  }
 }
 window.atlasI18n={locale,t,translateDOM,localizeData};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
