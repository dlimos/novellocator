const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const root='public/';const raw=JSON.parse(fs.readFileSync('tests/fixtures/proust-data.json','utf8'));
const geo=JSON.parse(fs.readFileSync('tests/fixtures/proust-geocoding.json','utf8').replace(/^\uFEFF/,''));
assert.equal(raw.chapters.length,7);assert.equal(Object.keys(raw.places).length,23);
const used=new Set();for(const c of raw.chapters){assert.equal(c.places.length,c.placeText.length);assert.ok(c.links.length);assert.ok(c.places.length);for(const id of c.places){assert.ok(raw.places[id]);used.add(id)}}assert.equal(used.size,23);
for(const [id,p] of Object.entries(raw.places)){
 assert.ok(p.coords.every(Number.isFinite));assert.ok(p.narrativeSource.url.startsWith('https://'));assert.ok(p.positionSource.url.startsWith('https://'));
 if(p.positionSource.recordId){const f=geo[id].features[0];assert.deepEqual(p.coords,[f.geometry.coordinates[1],f.geometry.coordinates[0]],id);assert.equal(p.positionSource.recordId,f.properties.id||f.properties.extrafields.cleabs);if(!['leonie','church','hotel','promenade'].includes(id)){assert.ok(p.coords[0]>48.8&&p.coords[0]<48.9&&p.coords[1]>2.2&&p.coords[1]<2.4,id+' wrong Paris position')}}
 if(['leonie','church','garden','hotel','promenade'].includes(id))assert.equal(p.kind,'uncertain');
 if(['orleans','perouse','montalivet','conti','foch'].includes(id))assert.equal(p.kind,'street');
}
for(const lang of ['en','it','fr','es']){
 const elements={};let startup,assigned;
 const element=()=>({children:[],attributes:{},listeners:{},appendChild(x){this.children.push(x)},setAttribute(k,v){this.attributes[k]=v},addEventListener(k,f){this.listeners[k]=f},scrollIntoView(){}});
 const location={hash:'#volume-6',search:'?book=proust'+(lang==='en'?'':'&lang='+lang),href:'https://example.com/atlas.html?book=proust&lang='+lang+'#volume-6',assign(url){assigned=url}};
 const ctx={console,URL,URLSearchParams,NodeFilter:{SHOW_TEXT:4},location,localStorage:{getItem(){},setItem(){}},window:{location,innerWidth:1100,matchMedia:()=>({matches:true}),addEventListener(){}},document:{readyState:'loading',documentElement:{},body:{querySelectorAll:()=>[]},head:{querySelectorAll:()=>[]},addEventListener(k,f){startup=f},createTreeWalker:()=>({nextNode:()=>false}),querySelectorAll:()=>[],getElementById:id=>elements[id]??(elements[id]=element()),querySelector:()=>({}),createElement:element}};
 vm.createContext(ctx);for(const name of ['locales/ui.js','i18n.js','data/proust.js','data/proust-i18n.js','basemaps.js'])vm.runInContext(fs.readFileSync(root+name,'utf8'),ctx);
 assert.equal(ctx.window.atlasI18n.locale,lang);assert.equal(ctx.document.documentElement.lang,lang);
 ctx.window.atlasData=ctx.window.atlasI18n.localizeData(ctx.window.atlasData);const d=ctx.window.atlasData;
 assert.equal(d.book.title,{en:'In Search of Lost Time',it:'Alla ricerca del tempo perduto',fr:'À la recherche du temps perdu',es:'En busca del tiempo perdido'}[lang]);
 for(const [id,p]of Object.entries(d.places)){assert.deepEqual(Array.from(p.coords),raw.places[id].coords);assert.equal(p.positionSource.url,raw.places[id].positionSource.url);if(lang!=='en')for(const k of ['note','method','status'])assert.notEqual(p[k],raw.places[id][k],id+' '+k+' '+lang)}
 for(const c of d.chapters){if(lang!=='en'){assert.notEqual(c.text,raw.chapters[c.id-1].text);for(const [i,s]of c.placeText.entries())assert.notEqual(s,raw.chapters[c.id-1].placeText[i])}}
 startup();assert.equal(elements['language-select'].children.length,4);
 vm.runInContext(fs.readFileSync(root+'app.js','utf8').replace(/initializeMap\(\);\s*$/,''),ctx);
 assert.equal(vm.runInContext('current',ctx),5);assert.equal(vm.runInContext('activeBasemap',ctx),'osm');assert.equal(elements['chapter-help'].textContent,d.book.help);assert.equal(elements.title.className,'long-book-title');
 for(let i=0;i<7;i++){vm.runInContext(`selectChapter(${i},false,false)`,ctx);assert.ok(elements.detail.innerHTML.includes(d.chapters[i].title));assert.ok(elements.detail.innerHTML.includes(d.chapters[i].links[0].url));for(let j=0;j<d.chapters[i].places.length;j++){vm.runInContext(`selectPlace(${j})`,ctx);const p=d.places[d.chapters[i].places[j]];assert.ok(elements['selected-location'].innerHTML.includes(p.coords[0].toFixed(6)))}}
 location.hash='#volume-7';location.href=location.href.replace('#volume-6','#volume-7');elements['language-select'].value=lang==='fr'?'en':'fr';elements['language-select'].listeners.change();const dest=new URL(assigned);assert.equal(dest.searchParams.get('book'),'proust');assert.equal(dest.hash,'#volume-7');assert.equal(dest.searchParams.get('basemap'),'osm');
 const csv=fs.readFileSync(root+`proust-places-${lang}.csv`,'utf8');assert.equal(csv.split('\r\n').length,34);assert.ok(csv.includes(d.chapters[0].title));assert.ok(d.book.footerHtml.includes('proust-places-'+lang+'.csv'));
}
console.log('PASS: 7 volumes / 23 verified position records / 33 scenes; 4 complete languages; all volumes and locations render; volume-specific text sources; OpenStreetMap default; CSV downloads and book/volume/basemap preserved.');
