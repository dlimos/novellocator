const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const root='docs/';
const original=require('./fixtures/ulisse-data.json');
for(const lang of ['en','it','fr','es']){
 const elements={};let startup,assigned,saved;
 const element=()=>({children:[],attributes:{},listeners:{},appendChild(x){this.children.push(x)},setAttribute(k,v){this.attributes[k]=v},addEventListener(k,f){this.listeners[k]=f},scrollIntoView(){}});
 const nodes=['Every book,','a world to explore','Literary Atlas'].map(text=>({textContent:text,parentElement:{closest(){return null}}}));
 const ctx={console,URL,URLSearchParams,NodeFilter:{SHOW_TEXT:4},location:{hash:'#episodio-18',search:'?book=ulisse'+(lang==='en'?'':'&lang='+lang)+'&basemap=gray-vector&place=0',href:'https://example.com/atlas.html?book=ulisse&lang='+lang+'#episodio-18',assign(url){assigned=url}},localStorage:{getItem(){return saved},setItem(k,v){saved=v}},window:{innerWidth:1100,matchMedia:()=>({matches:true}),addEventListener(){}},document:{readyState:'loading',documentElement:{},body:{querySelectorAll:()=>[]},head:{querySelectorAll:()=>[]},addEventListener(k,f){startup=f},createTreeWalker(){let i=-1;return{nextNode(){return ++i<nodes.length},get currentNode(){return nodes[i]}}},querySelectorAll:()=>[],getElementById:id=>elements[id]??(elements[id]=element()),querySelector:()=>({}),createElement:element}};
 ctx.window.location=ctx.location;vm.createContext(ctx);
 for(const name of ['locales/ui.js','i18n.js','data/ulisse.js','data/ulisse-i18n.js','basemaps.js'])vm.runInContext(fs.readFileSync(root+name,'utf8'),ctx);
 assert.equal(ctx.window.atlasI18n.locale,lang);assert.equal(ctx.document.documentElement.lang,lang);
 const english=JSON.parse(JSON.stringify(ctx.window.atlasData));
 ctx.window.atlasData=ctx.window.atlasI18n.localizeData(ctx.window.atlasData);
 const data=ctx.window.atlasData;
 assert.equal(data.book.hashPrefix,'episodio');assert.equal(data.chapters.length,18);
 assert.equal(data.book.title,{en:'Ulysses',it:'Ulisse',fr:'Ulysse',es:'Ulises'}[lang]);
 for(const [key,p] of Object.entries(data.places)){
  assert.deepEqual(Array.from(p.coords),original.places[key].coords,key+' '+lang);
  assert.equal(p.positionSource.url,original.places[key].positionSource.url);
  assert.equal(p.checked,original.places[key].checked);
  if(lang!=='it')for(const field of ['note','method','status'])assert.notEqual(p[field],original.places[key][field],key+' untranslated '+field+' '+lang);
 }
 for(const chapter of data.chapters){assert.deepEqual(Array.from(chapter.places),original.chapters[chapter.id-1].places);if(lang!=='it'){assert.notEqual(chapter.text,original.chapters[chapter.id-1].text);for(const [i,text] of chapter.placeText.entries())assert.notEqual(text,original.chapters[chapter.id-1].placeText[i])}}
 assert.doesNotMatch(data.book.footerHtml,lang==='it'?/Each place distinguishes/:/Ogni luogo distingue|Le basemap Esri/);
 startup();assert.equal(elements['language-select'].children.length,4);assert.equal(elements['language-select'].value,lang);
 assert.equal(nodes[0].textContent,{en:'Every book,',it:'Ogni libro,',fr:'Chaque livre,',es:'Cada libro,'}[lang]);
 vm.runInContext(fs.readFileSync(root+'app.js','utf8').replace(/initializeMap\(\);\s*$/,''),ctx);
 assert.equal(vm.runInContext('current',ctx),17);assert.match(elements.detail.innerHTML,new RegExp(data.chapters[17].title));
 assert.match(elements.detail.innerHTML,new RegExp(ctx.window.atlasI18n.t('Successivo')));
 assert.equal(vm.runInContext('activeBasemap',ctx),'gray-vector');
 elements['language-select'].value=lang==='fr'?'en':'fr';elements['language-select'].listeners.change();
 const destination=new URL(assigned);assert.equal(destination.hash,'#episodio-18');assert.equal(destination.searchParams.get('basemap'),'gray-vector');assert.equal(destination.searchParams.get('place'),'0');assert.equal(saved,elements['language-select'].value);
 if(lang==='en')assert.equal(english.book.title,'Ulysses');
}
console.log('PASS: English default; 4 languages, every scene and precision note translated; unchanged coordinates, sources and chapter links; language switching preserves episode, point and basemap.');
