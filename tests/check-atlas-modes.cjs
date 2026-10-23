const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctx={window:{}};vm.createContext(ctx);
for(const f of ['illustrated-overlay.js','fictional-atlas-adapter.js','atlas-modes.js','csv-export.js'])vm.runInContext(fs.readFileSync('docs/'+f,'utf8'),ctx);
vm.runInContext(fs.readFileSync('docs/app.js','utf8').split('window.atlasData=applyGeographicReview')[0],ctx);
const plain=x=>JSON.parse(JSON.stringify(x));
for(const id of ['proust','sound-and-fury','macondo']){
 const c={window:{}};vm.runInNewContext(fs.readFileSync('docs/data/'+(id==='macondo'?'macondo-local':id)+'.js','utf8'),c);
 let source=id==='macondo'?ctx.window.IllustratedAdapter.adapt(c.window.atlasIllustratedLocal,'en'):c.window.atlasData;
 if(id!=='macondo')source.book.illustratedView=JSON.parse(fs.readFileSync('research/'+id+'/panorama.json','utf8'));
 source=ctx.applyGeographicReview(source);const before=JSON.stringify(source);
 for(const lang of ['en','it','fr','es']){
  const geo=ctx.window.AtlasModes.adapt(source,null,lang),image=ctx.window.AtlasModes.adapt(source,'imaginary',lang);
  assert.equal(JSON.stringify(source),before,'modes preserve the canonical source');
  assert.notEqual(geo.book.mapType,'illustrated');assert.equal(image.book.mapType,'illustrated');
  assert.equal(image.sourceChapters,undefined);assert.equal(image.book.illustration.geographicOption,null);assert.deepEqual(plain(image.book.illustration.geographicPlaces),{});
  const anchors=new Set(Object.values(image.book.illustration.anchors).flatMap(a=>Object.keys(a.positions)));
  for(const [pid,p]of Object.entries({...geo.citedPlaces,...geo.places}))assert(p.coords?.every(Number.isFinite),id+': geographic '+pid);
  for(const [pid,p]of Object.entries({...image.citedPlaces,...image.places})){assert(anchors.has(pid));assert.equal(p.coords,undefined);assert.equal(p.geographic,undefined);}
  for(const chapter of image.chapters){assert.equal(chapter.places.length,chapter.placeText.length);assert.equal(chapter.unlocatedPlaces.length,0);for(const pid of chapter.places){assert(anchors.has(pid));assert(chapter.placeExcerpts[pid]?.original.quote);}}
  assert.equal(geo.chapters.length,source.chapters.length);
  assert.equal(image.chapters.length,image.book.illustration.epochs.length);
  assert.equal(image.book.hashPrefix,'view');assert.equal(image.book.illustration.viewsAsSections,true);
  const expected=new Set(source.chapters.flatMap(c=>c.places).filter(pid=>anchors.has(pid)));
  const actual=new Set(image.chapters.flatMap(c=>c.places));
  for(const pid of expected)assert(actual.has(pid),id+': all illustrated locations retained '+pid);
  image.chapters.forEach((view,index)=>{assert.equal(view.id,image.book.illustration.epochs[index].id);for(const pid of view.places){assert(image.book.illustration.anchors[view.id].positions[pid]);assert(view.placeOccurrences[pid].length);}});
  if(id==='macondo'){assert.equal(Object.keys(geo.places).length,4);assert.equal(Object.keys(image.places).length,29);for(const p of Object.values(geo.places))assert(p.coords);assert(!ctx.window.atlasCsv.build(image,'places',lang).includes('Riohacha'));}
  if(id==='proust'){assert.equal(Object.keys(image.places).length,5);assert.deepEqual(Array.from(image.chapters[0].places),['leonie','church','garden']);assert.deepEqual(Array.from(image.chapters[1].places),['hotel','promenade']);assert.equal(geo.places.hotel.coords[0],source.places.hotel.coords[0]);assert(!image.places.hotel.name.includes('Cabourg'));assert.equal(image.chapters[1].placeNames.hotel,image.places.hotel.name);}
 }
}
const catalog={window:{}};vm.runInNewContext(fs.readFileSync('docs/catalogue.js','utf8'),catalog);
const example={id:'test-world',title:'World',author:'Author',ariaLabel:'Open',setting:'Town',cover:{position:'center',src:'test.jpg',alt:'Art',width:1,height:1},credit:{artist:'Artist',title:'Painting',url:'https://example.org',year:1900}};
assert(!catalog.window.atlasCatalogueView.render([example],'imaginary').cards.includes('mode=imaginary'));
assert(!catalog.window.atlasCatalogueView.render([example]).cards.includes('mode=imaginary'));
assert(!fs.existsSync('docs/imaginary.html'));
assert(!fs.readFileSync('docs/index.html','utf8').includes('imaginary.html'));
assert(!fs.readFileSync('docs/load-book.js','utf8').includes('imaginary.html'));
assert(fs.readFileSync('docs/load-book.js','utf8').includes("link.textContent=t('Imaginary views')"));
assert.deepEqual(plain(ctx.window.AtlasModes.views({book:{illustratedView:{views:[{id:'town',names:{en:'Town',it:'Città'}}]}}},'it')),[{id:'town',name:'Città'}]);
console.log('PASS: three novels have independent geographic/illustrated points, original evidence, image-only exports and access exclusively through the novel; no collection or catalogue links.');
(async()=>{
 for(const mode of ['', '&mode=imaginary'])for(const hasModel of [false,true]){
  const nav={children:[],hidden:true,appendChild(child){this.children.push(child);}},head={appendChild(){}},location=new URL('https://atlas.example/atlas.html?book=example&lang=it'+mode);
  const context={URL,URLSearchParams,location,console,document:{documentElement:{setAttribute(){}},head,createElement:()=>({}),getElementById:id=>id==='atlas-mode-nav'?nav:{}},window:{location,atlasSupabase:{enabled:true},atlasCatalogue:{books:[{id:'example',mapType:'geographic'}]},atlasCatalogueData:{load:async()=>{}},AtlasModes:{views:()=>[{id:'a',name:'First view'},{id:'b',name:'Second view'}]},atlasI18n:{locale:'it',t:key=>key==='Imaginary views'?'Scenari del romanzo':key,localizeData:x=>x},atlasSupabaseData:{loadBook:async()=>({data:{book:{}},dictionary:{}})}}};
  if(hasModel)context.window.atlasSupabaseData.loadBook=async()=>({data:{book:{hashPrefix:'chapter',geographicModels:[{placeId:'real-model',name:'Aracataca',inspirationFor:'Macondo'}]}},dictionary:{}});
  vm.runInNewContext(fs.readFileSync('docs/load-book.js','utf8'),context);await new Promise(resolve=>setImmediate(resolve));
  const links=nav.children.filter(child=>child.href);
  assert.equal(links.length,1,'Only the scenarios link, or the return to geography inside scenarios, including books with real models');
  if(!mode){assert.equal(links[0].textContent,'Scenari del romanzo');assert.equal(new URL(links[0].href).searchParams.get('mode'),'imaginary');}
  else assert.equal(new URL(links[0].href).searchParams.get('mode'),null);
  assert(!links.some(link=>['First view','Second view'].includes(link.textContent)));
 }
 console.log('PASS: one imaginary-views link per novel; individual view names remain inside the view list.');
})().catch(error=>{console.error(error);process.exitCode=1});
