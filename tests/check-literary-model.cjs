const fs=require('node:fs'),assert=require('node:assert/strict');
const {PGlite}=require('@electric-sql/pglite');
(async()=>{
 const db=new PGlite(),sql=fs.readFileSync('research/literary-views/publish-macondo-model.sql','utf8');
 try{
  await db.exec('create table book_maps(book_id text,id text,metadata jsonb,primary key(book_id,id));');
  const original={sentinel:1,illustratedAtlas:{places:[{id:'house',source:{quote:'Original evidence'}}],epochs:[{id:'early'}],geographicPlaces:{'regional-town':{coords:[10.5,-74],pages:[2],excerpts:{1:{quote:'Macondo',language:'es'}},chapterRoles:{1:'mentioned'}},other:{coords:[1,2]}}}};
  original.illustratedAtlas.geographicPlaces['regional-town'].chapterRoles[2]='mentioned';
  await db.query('insert into book_maps values($1,$2,$3),($4,$5,$6)',['macondo','reading-map',original,'other','reading-map',{sentinel:2}]);
  await db.exec(sql);await db.exec(sql);
  const result=(await db.query("select metadata from book_maps where book_id='macondo'")).rows[0].metadata;
  assert.equal(result.sentinel,1);assert.deepEqual(result.illustratedAtlas.places,original.illustratedAtlas.places);assert.deepEqual(result.illustratedAtlas.epochs,original.illustratedAtlas.epochs);assert.deepEqual(result.illustratedAtlas.geographicPlaces.other,{coords:[1,2]});
  const place=result.illustratedAtlas.geographicPlaces['regional-town'];assert.equal(place.scope,'real-literary-model');assert.equal(place.names.it,'Macondo · Aracataca, modello reale');assert.deepEqual(place.excerpts,original.illustratedAtlas.geographicPlaces['regional-town'].excerpts);assert.deepEqual(place.pages,[2]);assert.deepEqual(place.chapterRoles,{1:'mentioned',2:'mentioned'});
  const actionSql=fs.readFileSync('research/literary-views/publish-macondo-action.sql','utf8');await db.exec(actionSql);await db.exec(actionSql);
  const corrected=(await db.query("select metadata from book_maps where book_id='macondo'")).rows[0].metadata.illustratedAtlas.geographicPlaces['regional-town'];
  assert.deepEqual(corrected.chapterRoles,{1:'action',2:'mentioned'});assert.deepEqual(corrected.excerpts,place.excerpts);assert.deepEqual(corrected.coords,place.coords);assert(corrected.chapterScenes[1].it.includes('luogo dell’azione'));
  const chapterSql=fs.readFileSync('research/literary-views/publish-macondo-chapters.sql','utf8');await db.exec(chapterSql);await db.exec(chapterSql);
  const all=(await db.query("select metadata from book_maps where book_id='macondo'")).rows[0].metadata;
  const town=all.illustratedAtlas.geographicPlaces['regional-town'];
  assert.equal(Object.keys(town.chapterRoles).length,20);assert(Object.values(town.chapterRoles).every(role=>role==='action'));
  assert.equal(Object.keys(town.excerpts).length,20);assert.equal(new Set(Object.values(town.excerpts).map(e=>e.quote)).size,20);
  assert.deepEqual(town.coords,place.coords);assert.deepEqual(all.illustratedAtlas.geographicPlaces.other,{coords:[1,2]});assert.deepEqual(all.illustratedAtlas.places,original.illustratedAtlas.places);
  assert.deepEqual((await db.query("select metadata from book_maps where book_id='other'")).rows[0].metadata,{sentinel:2});
  console.log('PASS: scoped, idempotent Aracataca model update preserves quotations, categories, eras, other places and other books.');
 }finally{await db.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
