const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),crypto=require('crypto');
const audit=JSON.parse(fs.readFileSync('research/lolita/pdf-quotation-review.json')),sql=fs.readFileSync('research/lolita/publish-pdf-quotations.sql','utf8');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
assert.equal(audit.records.length,411);assert.equal(audit.counts.relationalExcerpts,192);assert.equal(audit.source.extraction,'pypdf native text; no OCR');assert.equal(audit.source.publisher,null);
for(const r of audit.records){assert.notEqual(r.sectionId,'afterword');assert(r.pdfPages.every(n=>Number.isInteger(n)&&n>=1&&n<=282));assert.equal(r.translations.length,0);assert(r.highlightTerms.length,'An explicit literal or indirect reference must be recorded');for(const term of r.highlightTerms)assert(r.quote.includes(term));const pieces=r.quote.replace(/^\[…\] /,'').replace(/ \[…\]$/,'').split(' […] ');assert.equal(pieces.length,r.parts.length);pieces.forEach((p,i)=>assert.equal(hash(p),r.parts[i].sha256));assert(r.purpose&&r.necessity&&r.rationale&&r.sectionNarrativeNotes);}
assert(!sql.includes('delete from'));assert(sql.includes('Quotation scope verification failed'));assert(sql.includes("where id='lolita'"));
if(!fs.existsSync('work/lolita-quotes/bundle-before.json')){console.log('PASS: public quotation hashes, provenance, pages, highlights and SQL scope; native PDF witness is private.');process.exit(0);}
const sections=JSON.parse(fs.readFileSync('work/lolita-quotes/native-sections.json'));
for(const r of audit.records){const s=sections.find(s=>s.id===r.sectionId);for(const p of r.parts)assert.equal(hash(s.text.slice(p.start,p.end)),p.sha256);}
const {PGlite}=require('@electric-sql/pglite');
(async()=>{const db=new PGlite();try{
await db.exec(fs.readFileSync('database/migrations/001_content.sql','utf8'));
const before=JSON.parse(fs.readFileSync('work/lolita-quotes/bundle-before.json'));
for(const [table,rows]of Object.entries(before.tables)){// Insert in explicit FK order below.
 if(!['books','sections','places','sources','place_descriptions','place_references','excerpts','unlocated_settings','content_translations'].includes(table))throw Error('Unexpected table');
}
for(const table of ['books','sections','places','sources','place_descriptions','place_references','excerpts','unlocated_settings','content_translations'])for(const row of before.tables[table]){const cols=Object.keys(row);await db.query(`insert into public.${table}(${cols.join(',')}) values(${cols.map((_,i)=>'$'+(i+1)).join(',')})`,cols.map(k=>row[k]));}
await db.query("insert into books(id,title,author,original_language,metadata) values('other','Other','Author','en',$1)",[{sentinel:17}]);
await db.exec(sql);await db.exec(sql);
const expected=JSON.parse(fs.readFileSync('work/lolita-quotes/bundle-expected.json')),actual={formatVersion:1,tables:{}};
for(const table of Object.keys(before.tables))actual.tables[table]=(await db.query(`select * from public.${table} where ${table==='books'?'id':'book_id'}='lolita'`)).rows;
const ctx={window:{}};vm.createContext(ctx);for(const f of ['content-adapter.js','supabase-data.js','csv-export.js'])vm.runInContext(fs.readFileSync('docs/'+f,'utf8'),ctx);
const reconstruct=b=>JSON.parse(JSON.stringify(ctx.window.atlasSupabaseData.groupSections(ctx.window.atlasContent.reconstruct(b,'lolita').data)));
const view=reconstruct(actual),want=reconstruct(expected);
assert.deepEqual(view.book,want.book);for(let i=0;i<4;i++){assert.deepEqual(view.chapters[i].placeExcerpts,want.chapters[i].placeExcerpts);assert.deepEqual(view.chapters[i].placeCategories,want.chapters[i].placeCategories);}
assert.deepEqual(view.chapters.slice(0,3).map(c=>c.places.filter(id=>c.placeExcerpts[id]?.original?.quote).length),[6,54,104]);assert.equal(view.chapters[3].places.filter(id=>cquote(view.chapters[3],id)).length,0);
function cquote(c,id){return c.placeExcerpts[id]?.original?.quote;}
assert.equal((await db.query("select metadata->>'sentinel' value from books where id='other'")).rows[0].value,'17');
const tampered=sql.replace('do $scope$ begin',"update books set metadata='{\"sentinel\":99}' where id='other';\ndo $scope$ begin");
await assert.rejects(db.exec(tampered),/Quotation scope verification failed/);await db.exec('rollback;');
assert.equal((await db.query("select metadata->>'sentinel' value from books where id='other'")).rows[0].value,'17');
console.log('PASS: 411 native-PDF association quotations, 192 relational excerpts, all 164 mapped cards in foreword/parts, idempotent constrained SQL and rollback of an unrelated-book mutation.');
}finally{await db.close();}})().catch(e=>{console.error(e);process.exitCode=1});
