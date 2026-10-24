const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const patches=JSON.parse(fs.readFileSync('research/scenario-introductions/patches.json','utf8'));
const ctx={window:{}};vm.createContext(ctx);
for(const name of ['illustrated-overlay','atlas-modes','fictional-atlas-adapter'])vm.runInContext(fs.readFileSync('docs/'+name+'.js','utf8'),ctx);
const apply=data=>{
 if(!data.book.illustratedView)data.book.illustratedView=JSON.parse(fs.readFileSync('research/'+data.book.id+'/panorama.json','utf8'));
 for(const patch of patches.filter(p=>p.bookId===data.book.id)){
  let target=data.book;
  for(const key of patch.path.slice(0,-1))target=target[key];
  target[patch.path.at(-1)]=structuredClone(patch.value);
 }
 return data;
};
const langs=['en','it','fr','es'];let views=0,places=0;
for(const id of [...new Set(patches.map(p=>p.bookId))]){
 const sourceCtx={window:{}};vm.runInNewContext(fs.readFileSync('docs/data/'+id+'.js','utf8'),sourceCtx);
 const source=apply(sourceCtx.window.atlasData),before=JSON.stringify(source);
 for(const lang of langs){
  const result=ctx.window.AtlasModes.adapt(source,'imaginary',lang);
  assert.equal(JSON.stringify(source),before,'canonical sections remain unchanged');
  assert.equal(result.book.sidebarNote,source.book.illustratedView.labels[lang].notice);
  assert.equal(result.book.illustration.caption,'','no second notice beneath the map');
  for(const view of result.chapters){
   assert(view.text.trim().length>40,id+'/'+view.id+' requires narrative orientation');
   assert.notEqual(view.text,source.book.illustratedView.labels[lang].caption);
   assert(!/interpretativ|interprétativ|interpretive|not to scale|non in scala/i.test(view.text),id+'/'+view.id);
   const descriptions=view.places.map(pid=>view.placeText[view.places.indexOf(pid)]);
   assert.equal(new Set(descriptions).size,descriptions.length,'places have distinct descriptions');
   for(const pid of view.places){
    assert(view.placeExcerpts[pid].original.quote,'original evidence retained');
    assert(view.placeOccurrences[pid].length,'original section provenance retained');
    assert(!/interpretativ|interprétativ|not to scale|non in scala/i.test(view.placeText[view.places.indexOf(pid)]),id+'/'+pid);
    assert.equal(result.places[pid].coords,undefined);
   }
  }
  if(lang==='en'){views+=result.chapters.length;places+=result.chapters.reduce((n,v)=>n+v.places.length,0);}
 }
}
// A section-level description must not override the editorial panorama description.
const b={book:{id:'test',mapType:'geographic',illustratedView:{width:1,height:1,labels:{en:{notice:'General interpretation notice',caption:'Not to scale'}},views:[{id:'v',names:{en:'View'},notes:{en:'A specific narrative introduction for this view.'},image:'x.png',positions:{p:[.5,.5]}}],notes:{en:{p:'The two characters meet in this room.'}}}},places:{p:{name:'Room',coords:[1,1]}},chapters:[{id:1,places:['p'],placeText:['Old description'],placeNarrativeDescriptions:{p:{status:'reviewed',texts:{en:'A chapter-specific account.'}}},placeExcerpts:{p:{original:{quote:'They met in the room.'}}}}]};
assert.equal(ctx.window.AtlasModes.adapt(b,'imaginary').chapters[0].placeText[0],'The two characters meet in this room.');
assert.equal(b.chapters[0].placeNarrativeDescriptions.p.texts.en,'A chapter-specific account.');
console.log(`PASS: ${views} views and ${places} illustrated places in four languages; one notice, original evidence and separate section descriptions.`);
(async()=>{
 const {PGlite}=require('@electric-sql/pglite'),db=new PGlite();
 await db.exec('create table books(id text primary key,metadata jsonb);');
 for(const id of [...new Set(patches.map(p=>p.bookId))]){
  const c={window:{}};vm.runInNewContext(fs.readFileSync('docs/data/'+id+'.js','utf8'),c);
  if(!c.window.atlasData.book.illustratedView)c.window.atlasData.book.illustratedView=JSON.parse(fs.readFileSync('research/'+id+'/panorama.json','utf8'));
  await db.query('insert into books values($1,$2)',[id,JSON.stringify({...c.window.atlasData.book,sentinel:'preserve'})]);
 }
 const sql=fs.readFileSync('research/scenario-introductions/publish.sql','utf8');await db.exec(sql);await db.exec(sql);
 for(const {id,metadata}of(await db.query('select * from books')).rows){
  assert.equal(metadata.sentinel,'preserve');
  for(const p of patches.filter(p=>p.bookId===id)){let value=metadata;for(const key of p.path)value=value[key];assert.deepEqual(value,p.value);}
 }
 await db.close();console.log('PASS: SQL is idempotent and preserves unrelated metadata.');
})().catch(e=>{console.error(e);process.exitCode=1});
