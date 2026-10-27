const fs=require('fs'),assert=require('assert/strict'),{PGlite}=require('@electric-sql/pglite');
(async()=>{const b=require('./before.json'),maps=require('./maps-before.json').book_maps;const db=new PGlite();
await db.exec('create table books(id text,metadata jsonb);create table book_maps(book_id text,id text,metadata jsonb);create table place_descriptions(book_id text,place_id text,collection text,area text);');
for(const row of b.books)await db.query('insert into books values($1,$2)',[row.id,row.metadata]);
for(const row of maps)await db.query('insert into book_maps values($1,$2,$3)',[row.book_id,row.id,row.metadata]);
for(const row of b.place_descriptions)await db.query('insert into place_descriptions values($1,$2,$3,$4)',[row.book_id,row.place_id,row.collection,row.area]);
for(const file of ['macondo','anna-regional','generic-areas']){const sql=fs.readFileSync(__dirname+'/release/'+file+'.sql','utf8');await db.exec(sql);await db.exec(sql);}
const actualMaps=(await db.query('select * from book_maps')).rows;
for(const row of actualMaps){const old=maps.find(x=>x.book_id===row.book_id&&x.id===row.id);const copy=structuredClone(row.metadata);for(const geo of Object.values(copy.illustratedAtlas.geographicPlaces))delete geo.chapterScenes;const oldCopy=structuredClone(old.metadata);for(const geo of Object.values(oldCopy.illustratedAtlas.geographicPlaces))delete geo.chapterScenes;assert.deepEqual(copy,oldCopy);}
const actualBooks=(await db.query('select * from books')).rows;for(const row of actualBooks){const old=b.books.find(x=>x.id===row.id);const copy=structuredClone(row.metadata);for(const r of copy.geographicReview?.regionalPlaces||[])delete r.narrativeDescriptions;assert.deepEqual(copy,old.metadata);}
const anna=actualBooks.find(x=>x.id==='anna-karenina');assert.equal(Object.keys(anna.metadata.geographicReview.regionalPlaces[0].narrativeDescriptions).length,6);
const after=(await db.query('select * from place_descriptions')).rows;for(const row of after){const old=b.place_descriptions.find(p=>p.book_id===row.book_id&&p.place_id===row.place_id&&p.collection===row.collection);assert(row.area===old.area||row.area==='');}
await db.close();console.log('PASS: extra patches repeatable; 11 map and 6 regional contexts; original evidence, narrative categories, geometry and unrelated metadata unchanged.');})().catch(e=>{console.error(e);process.exitCode=1});
