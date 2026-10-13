const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),{PGlite}=require('@electric-sql/pglite');
const dir='research/location-visibility/review/',metadata=JSON.parse(fs.readFileSync(dir+'metadata.json')),patch=JSON.parse(fs.readFileSync(dir+'macondo-patch.json'));
(async()=>{
 const db=new PGlite();try{
  await db.exec('create table books(id text primary key,metadata jsonb);create table book_maps(book_id text,id text,metadata jsonb);create table content_translations(book_id text,language text,source_hash text,source_text text,translated_text text,primary key(book_id,language,source_hash));create table excerpts(id text,quote text);create table unlocated_settings(id text,quote text);');
  for(const id of Object.keys(metadata)){const ctx={window:{}};vm.runInNewContext(fs.readFileSync('docs/data/'+id+'.js','utf8'),ctx);const book={...ctx.window.atlasData.book};delete book.geographicReview;await db.query('insert into books values($1,$2)',[id,JSON.stringify({...book,sentinel:'retain-existing-fields'})]);}
  const local={window:{}};vm.runInNewContext(fs.readFileSync('docs/data/macondo-local.js','utf8'),local);const atlas=JSON.parse(JSON.stringify(local.window.atlasIllustratedLocal));atlas.places=atlas.places.filter(p=>p.id!=='regional-town');delete atlas.geographicPlaces['regional-town'];delete atlas.geographicReview;
  await db.query('insert into book_maps values($1,$2,$3)',['macondo','reading-map',JSON.stringify({illustratedAtlas:atlas,sentinel:'preserve-map-metadata'})]);
  await db.exec("insert into excerpts values('original','authentic original');insert into unlocated_settings values('analysis','retained original');");
  const sql=fs.readFileSync(dir+'publish.sql','utf8');await db.exec(sql);await db.exec(sql);
  for(const {id,metadata:book}of (await db.query('select * from books')).rows){assert.deepEqual(book.geographicReview,metadata[id]);assert.equal(book.sentinel,'retain-existing-fields');}
  const result=(await db.query('select metadata from book_maps')).rows[0].metadata;
  assert.equal(result.sentinel,'preserve-map-metadata');assert.equal(result.illustratedAtlas.places.length,48);assert.deepEqual(result.illustratedAtlas.places.slice(0,47),atlas.places);assert.deepEqual(result.illustratedAtlas.geographicPlaces['regional-town'],patch.geographical);
  assert.equal((await db.query('select quote from excerpts')).rows[0].quote,'authentic original');assert.equal((await db.query('select quote from unlocated_settings')).rows[0].quote,'retained original');
  // Also support the batched representation without replacing its original rows.
  atlas.placeBatches={'000':atlas.places};delete atlas.places;
  await db.query('update book_maps set metadata=$1',[JSON.stringify({illustratedAtlas:atlas})]);await db.exec(sql);await db.exec(sql);
  const batched=(await db.query('select metadata from book_maps')).rows[0].metadata.illustratedAtlas;
  assert.equal(Object.values(batched.placeBatches).flat().length,48);
  console.log('PASS: geography publication SQL is idempotent; unrelated book/map metadata, original quotations, all existing places and both array/batched map formats are preserved.');
 }finally{await db.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
