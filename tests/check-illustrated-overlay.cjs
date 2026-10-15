const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const context={window:{}};vm.createContext(context);
vm.runInContext(fs.readFileSync('docs/data/sound-and-fury.js','utf8'),context);
vm.runInContext(fs.readFileSync('docs/illustrated-overlay.js','utf8'),context);
vm.runInContext(fs.readFileSync('docs/csv-export.js','utf8'),context);
vm.runInContext(fs.readFileSync('docs/app.js','utf8').split('window.atlasData=applyGeographicReview')[0],context);
const config=JSON.parse(fs.readFileSync('research/sound-and-fury/panorama.json','utf8'));
const source=context.applyGeographicReview(context.window.atlasData);source.book.illustratedView=config;
const before=JSON.stringify(source),plain=x=>JSON.parse(JSON.stringify(x));
for(const locale of ['it','en','fr','es']){
 const data=context.window.IllustratedOverlay.adapt(source,locale);
 assert.equal(JSON.stringify(source),before,'canonical source is immutable');
 assert.equal(data.book.mapType,'illustrated');assert.equal(data.book.illustration.epochs.length,2);
 assert.equal(data.chapters.length,source.chapters.length);
 assert.deepEqual(plain(data.sourceChapters),plain(source.chapters));
 for(const section of data.chapters){
  assert.equal(section.places.length,new Set(section.places).size);
  assert.equal(section.places.length,section.placeText.length);
  for(const view of config.views)for(const id of Object.keys(view.positions)){
   const original=source.chapters.find(c=>c.id===section.id).unlocatedPlaces.find(p=>p.id===id);
   if(!original)continue;
   assert(section.places.includes(id),section.id+':'+id);
   assert.equal(data.places[id].coords,undefined,'illustration gets no invented terrestrial coordinates');
   assert.equal(section.placeExcerpts[id].original.quote,original.excerpt?.original?.quote||original.quote);
   assert.equal(data.places[id].name,config.names[locale][id]);
  }
 }
 assert.equal(data.chapters[0].places[0],'house','first view opens on the property');
 assert.equal(data.chapters[1].places[0],source.chapters[1].places[0],'Quentin section opens on real geography');
 assert.equal(data.chapters[2].places[0],'square','Jason section opens on Jefferson');
 assert.equal(data.chapters[2].placeCategories.square,'mentioned');
 for(const kind of ['places','citations'])assert.equal(context.window.atlasCsv.build(data,kind,locale),context.window.atlasCsv.build(source,kind,locale),'CSV retains original geographical evidence');
}
const pending=plain(source);pending.chapters[0].unlocatedPlaces.find(p=>p.id==='house').verificationStatus='pending';
assert(!context.window.IllustratedOverlay.adapt(pending).chapters[0].places.includes('house'));
for(const view of config.views){assert(fs.existsSync('docs/'+view.image));for(const p of Object.values(view.positions))assert(p.every(n=>n>=0&&n<=1));}
console.log('PASS: two illustrated views, authentic section evidence, four languages, independent categories, preserved real geography/CSV and immutable source data.');
(async()=>{
 const {PGlite}=require('@electric-sql/pglite'),db=new PGlite();
 await db.exec("create table public.books(id text primary key,metadata jsonb);insert into public.books values('sound-and-fury','{\"sentinel\":1}'),('other','{\"sentinel\":2}');");
 const sql=fs.readFileSync('research/sound-and-fury/publish-panorama.sql','utf8');await db.exec(sql);await db.exec(sql);
 const {rows}=await db.query('select id,metadata from public.books order by id');assert.deepEqual(rows[0].metadata,{sentinel:2});assert.equal(rows[1].metadata.sentinel,1);assert.deepEqual(rows[1].metadata.illustratedView,config);
 await db.close();console.log('PASS: panorama publication is idempotent and preserves all unrelated metadata.');
})().catch(error=>{console.error(error);process.exitCode=1;});
