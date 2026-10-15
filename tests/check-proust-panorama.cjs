const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const config=JSON.parse(fs.readFileSync('research/proust/panorama.json','utf8'));
const evidence=JSON.parse(fs.readFileSync('research/proust/panorama-evidence.json','utf8'));
const updates=JSON.parse(fs.readFileSync('research/proust/panorama-updates.json','utf8'));
const ctx={window:{}};vm.createContext(ctx);
for(const file of ['data/proust.js','illustrated-overlay.js','csv-export.js'])vm.runInContext(fs.readFileSync('docs/'+file,'utf8'),ctx);
const source=JSON.parse(JSON.stringify(ctx.window.atlasData));source.book.illustratedView=config;
for(const e of evidence){const q=source.chapters.find(c=>c.id===e.section).placeExcerpts[e.id].original;Object.assign(q,{quote:e.quote,highlightTerms:e.highlightTerms,attribution:e.edition});assert(e.highlightTerms.every(t=>e.quote.includes(t)));assert(e.narrativeEvidence);assert.equal(e.category,'action');}
const before=JSON.stringify(source);
for(const locale of ['it','en','fr','es']){
 const d=ctx.window.IllustratedOverlay.adapt(source,locale);
 assert.equal(JSON.stringify(source),before);assert.equal(d.book.illustration.epochs.length,2);assert(d.book.illustration.geographicOption);
 for(const id of config.placeOrder){assert.deepEqual(Array.from(d.places[id].coords),source.places[id].coords);assert(d.places[id].imagePresentation);assert.equal(d.places[id].name,source.places[id].name);}
 for(const e of evidence){const c=d.chapters.find(c=>c.id===e.section);assert.equal(c.placeExcerpts[e.id].original.quote,e.quote);assert.equal(c.placeText[c.places.indexOf(e.id)],config.sceneNotes[locale][e.section+':'+e.id]);}
 for(const kind of ['places','citations'])assert.equal(ctx.window.atlasCsv.build(d,kind,locale),ctx.window.atlasCsv.build(source,kind,locale));
 for(const n of [3,5,6])assert.equal(d.chapters[n-1].places[0],source.chapters[n-1].places[0]);
 assert.equal(d.chapters[0].places[0],'leonie');assert.equal(d.chapters[1].places[0],'hotel');assert.equal(d.chapters[6].places[0],'garden');
}
const pending=structuredClone(source);pending.chapters[0].placeExcerpts.leonie.original.verificationStatus='pending';
assert(ctx.window.IllustratedOverlay.adapt(pending).chapters[0].illustratedExcluded.includes('leonie'));
for(const view of config.views){assert(fs.existsSync('docs/'+view.image));for(const p of Object.values(view.positions))assert(p.every(x=>x>=0&&x<=1));}
(async()=>{
 const {PGlite}=require('@electric-sql/pglite'),db=new PGlite();
 await db.exec('create table books(id text primary key,metadata jsonb);create table sources(book_id text,id text,url text,label text,primary key(book_id,id));create table excerpts(book_id text,id text,quote text,attribution text,text_source_id text,metadata jsonb);');
 await db.query('insert into books values($1,$2),($3,$4)',['proust',{sentinel:1},'other',{sentinel:2}]);
 for(const u of updates)await db.query('insert into excerpts values($1,$2,$3,$4,$5,$6)',['proust',u.id,u.old_quote,'before','source',{sentinel:1}]);
 const sql=fs.readFileSync('research/proust/publish-panorama.sql','utf8');await db.exec(sql);await db.exec(sql);
 const b=(await db.query("select metadata from books where id='proust'")).rows[0].metadata;assert.deepEqual(b.illustratedView,config);assert.equal(b.sentinel,1);
 assert.deepEqual((await db.query("select metadata from books where id='other'")).rows[0].metadata,{sentinel:2});
 for(const row of (await db.query('select * from excerpts')).rows){const u=updates.find(u=>u.id===row.id);assert.equal(row.quote,u.quote);assert.equal(row.metadata.sentinel,1);assert.equal(row.text_source_id,u.text_source_id);}
 await db.query('update excerpts set quote=$1 where id=$2',['concurrent edit',updates[0].id]);await assert.rejects(db.exec(sql),/Proust quotation conflict/);await db.exec('rollback');await db.close();
 console.log('PASS: Combray/Balbec evidence, four languages, immutable geographic models and CSVs, independent anchors, guarded idempotent publication and conflict rollback.');
})().catch(e=>{console.error(e);process.exitCode=1});
