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
  assert.equal(geo.chapters.length,image.chapters.length);assert.equal(geo.chapters.length,source.chapters.length);
  if(id==='macondo'){assert.equal(Object.keys(geo.places).length,4);assert.equal(Object.keys(image.places).length,29);for(const p of Object.values(geo.places))assert(p.coords);assert(!ctx.window.atlasCsv.build(image,'places',lang).includes('Riohacha'));}
  if(id==='proust'){assert.equal(Object.keys(image.places).length,5);assert(!image.chapters[2].places.length);assert.equal(geo.places.hotel.coords[0],source.places.hotel.coords[0]);assert(!image.places.hotel.name.includes('Cabourg'));assert.equal(image.chapters[1].placeNames.hotel,image.places.hotel.name);}
 }
}
const catalog={window:{}};vm.runInNewContext(fs.readFileSync('docs/catalogue.js','utf8'),catalog);
const example={id:'test-world',title:'World',author:'Author',ariaLabel:'Open',setting:'Town',cover:{position:'center',src:'test.jpg',alt:'Art',width:1,height:1},credit:{artist:'Artist',title:'Painting',url:'https://example.org',year:1900}};
assert(catalog.window.atlasCatalogueView.render([example],'imaginary').cards.includes('&amp;mode=imaginary'));
assert(!catalog.window.atlasCatalogueView.render([example]).cards.includes('mode=imaginary'));
console.log('PASS: three novels have independent geographic/imaginary points, original evidence and identities, image-only exports, empty sections, four languages and separate catalogue links.');
