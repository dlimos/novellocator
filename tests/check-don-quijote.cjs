const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),crypto=require('crypto');
const ctx={window:{}};
for(const file of ['docs/data/don-quijote.js','docs/data/don-quijote-i18n.js','docs/csv-export.js'])vm.runInNewContext(fs.readFileSync(file,'utf8'),ctx);
const data=ctx.window.atlasData,dict=ctx.window.atlasTranslations,audit=require('../research/don-quijote/analysis.json'),corpus=JSON.parse(fs.readFileSync('work/don-quijote/sections-pg.json','utf8'));
assert.equal(data.chapters.length,142);assert.deepEqual(audit.structure.parts,[52,74]);assert.deepEqual(audit.structure.preliminarySections,[7,9]);assert.equal(audit.structure.prologues,2);assert.equal(audit.sections.length,142);assert(audit.structure.words>380000);
assert(corpus[7].text.includes('En un lugar de la Mancha'));assert(corpus[141].text.endsWith('Vale.\n\nFin'));
assert(/argamasilla/i.test(corpus[58].text));assert(corpus[6].text.includes('URGAND')||corpus[6].text.includes('Urganda'));
let mapped=0,unlocated=0;
for(const c of data.chapters){const s=corpus[c.id-1];assert.equal(audit.sections[c.id-1].sha256,crypto.createHash('sha256').update(s.text).digest('hex'));
 function evidence(e){assert(e?.quote);assert.equal(e.language,'es');assert(s.text.includes(e.quote),c.id+': fabricated or wrong-section evidence');assert.equal(e.url,s.url);assert(e.attribution.includes(s.edition));}
 evidence(c.excerpts.original);
 for(const id of c.places){assert(data.places[id]);evidence(c.placeExcerpts[id].original);mapped++;}
 for(const r of c.citations){assert(data.citedPlaces[r.placeId]);assert.equal(r.category,'mentioned');evidence(r.excerpt.original);mapped++;}
 for(const p of c.unlocatedPlaces){evidence(p);assert(!Object.hasOwn(p,'coords'));unlocated++;}
 for(const l of ['en','it','fr','es'])for(const v of [c.title,c.text,c.note,c.emptyMessage,...c.unlocatedPlaces.map(p=>p.name)])assert(dict[l][v],l+': '+v);
 for(const l of ['it','fr','es'])assert.notEqual(dict[l][c.text],c.text);
}
assert.equal(mapped,614);assert.equal(unlocated,1405);
const places={...data.places,...data.citedPlaces};assert.equal(Object.keys(places).length,157);
for(const id of ['barataria','micomicon','candaya','gaula','clavilenosky','windmills','nonavillage','vitoria','santiago','balbastro','tolosa','montesinos'])assert(!places[id],id+' must not have invented or unrelated coordinates');
assert(places.mancha.coords[1]>-5&&places.mancha.coords[1]<-1);assert(places.salamanca.coords[1]<-5);assert(places.modon.coords[0]<38);assert(places.tunis.coords[0]>36);assert(places.viso.coords[1]>-4&&places.viso.coords[1]<-3);
assert(!data.chapters.some(c=>c.places.includes('zaragoza')));
assert(data.chapters[104].places.length===0&&data.chapters[104].citations.length===0&&data.chapters[104].unlocatedPlaces.length===0);assert(audit.sections[104].withoutLocations);
assert(data.chapters[7].unlocatedPlaces.some(p=>p.id==='nonavillage'));
assert(data.chapters[26].unlocatedPlaces.some(p=>p.id==='mill'));
assert(data.chapters[129].unlocatedPlaces.some(p=>p.id==='printing'));
assert(audit.rejectedLexicalMatches.some(s=>s.includes('Carta-')));
for(const l of ['en','it','fr','es'])for(const kind of ['places','citations'])assert(fs.readFileSync(`docs/don-quijote-${kind}-${l}.csv`,'utf8').includes('gutenberg.org'));
assert.equal(corpus[58].supplements[0].lines,14);assert(corpus[58].text.includes('Sancho Panza es aqueste, en cuerpo chico'));
for(const lang of ['en','it','fr','es']){
 const elements={};let startup;
 const el=()=>({children:[],attributes:{},listeners:{},appendChild(x){this.children.push(x)},setAttribute(k,v){this.attributes[k]=v},addEventListener(k,f){this.listeners[k]=f},scrollIntoView(){},after(){}});
 const get=id=>elements[id]??(elements[id]=el());get('selected-location').parentElement=el();
 const location={hash:'#section-1',search:'?book=don-quijote&lang='+lang,href:'https://example.com/atlas.html?book=don-quijote&lang='+lang,assign(){}};
 const ctx={console,URL,URLSearchParams,NodeFilter:{SHOW_TEXT:4},location,localStorage:{getItem(){},setItem(){}},window:{location,innerWidth:1100,matchMedia:()=>({matches:true}),addEventListener(){}},document:{readyState:'loading',documentElement:{},body:{querySelectorAll:()=>[]},head:{querySelectorAll:()=>[]},addEventListener(k,f){startup=f},createTreeWalker:()=>({nextNode:()=>false}),querySelectorAll:()=>[],getElementById:get,querySelector:()=>({}),createElement:el}};
 vm.createContext(ctx);for(const file of ['locales/ui.js','content/book-translations.js','i18n.js','data/don-quijote.js','data/don-quijote-i18n.js','basemaps.js'])vm.runInContext(fs.readFileSync('docs/'+file,'utf8'),ctx);
 ctx.window.atlasData=ctx.window.atlasI18n.localizeData(ctx.window.atlasData);startup();vm.runInContext(fs.readFileSync('docs/app.js','utf8').replace(/initializeMap\(\);\s*$/,''),ctx);
 for(let i=0;i<142;i++){
  vm.runInContext(`selectChapter(${i},false,false)`,ctx);assert(elements.detail.innerHTML.includes(ctx.window.atlasData.chapters[i].title));
  assert(get('selected-location').parentElement.children.at(-1).innerHTML.includes('lang="es"'));
  if(!data.chapters[i].places.length)assert(get('selected-location').innerHTML.includes('lang="es"'),'section quotation absent in unlocated section');
  if(data.chapters[i].citations.length){vm.runInContext('selectCitation(0)',ctx);assert(get('selected-location').children.at(-1).innerHTML.includes('lang="es"'));}
 }
 vm.runInContext('selectAllPlaces(false,false)',ctx);assert.equal(vm.runInContext('current',ctx),-1);assert.equal(get('all-places').attributes['aria-pressed'],'true');
}
console.log('PASS: Don Quixote, 142 complete sections, 2019 literal Spanish section–place associations, acquired fourteen-line supplement, rejected homonyms and unmapped fantasy geography.');
