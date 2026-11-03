const fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const report=read('research/lolita/final-review.json');
assert.equal(report.sections.length,71);assert.equal(report.counts.mappedAssociations,358);
assert(report.sections.every(s=>s.fullSectionRead&&s.narrativeAnalysis));
for(const section of report.sections)for(const r of section.associations){assert(r.reason);assert(/^[a-f0-9]{64}$/.test(r.quoteSha256));assert.equal(r.translationCoverage.it,'verified-original-fallback; translation-not-available');}
if(!fs.existsSync('work/lolita-final-review/expected.json')){console.log('PASS: public final review manifest; private witnesses required for full collation and SQL test.');process.exit(0);}
const before=read('work/lolita-final-review/live-before.json'),expected=read('work/lolita-final-review/expected.json');
const browserFiles=process.argv.includes('--browser')?read('work/lolita-final-review/transfer-manifest.json').files:[];
const sql=fs.readFileSync('work/lolita-final-review/'+(browserFiles.at(-1)||'publish.sql'),'utf8');
const native=read('work/lolita-quotes/native-sections.json');
for(const s of report.sections){if(s.nativeSectionSha256)assert.equal(hash(native.find(n=>n.id===s.id).text),s.nativeSectionSha256);for(const r of s.associations)for(const p of r.evidence.parts||[])assert.equal(hash(native.find(n=>n.id===s.id).text.slice(p.start,p.end)),p.sha256);}
const c={window:{}};vm.createContext(c);vm.runInContext(fs.readFileSync('docs/content-adapter.js','utf8'),c);
const fn=fs.readFileSync('docs/app.js','utf8').split('function applyGeographicReview(input){')[1].split('\nwindow.atlasData=')[0];vm.runInContext('function applyGeographicReview(input){'+fn,c);
function view(bundle){return JSON.parse(JSON.stringify(c.applyGeographicReview(c.window.atlasContent.reconstruct(bundle,'lolita').data)));}
const old=view(before),wanted=view(expected);
const all=wanted.chapters.flatMap(ch=>ch.places.map(id=>({ch,id,q:ch.placeExcerpts[id]?.original})));
assert.equal(all.length,358);assert(all.every(({q})=>q?.quote?.trim()&&q.verificationStatus==='verified'));
for(const {q,ch,id}of all){assert(q.attribution.includes(ch.originalSectionId==='afterword'?'image witness':'PDF p.'));assert(q.highlightTerms.length,id);for(const term of q.highlightTerms)assert(q.quote.toLowerCase().includes(term.toLowerCase()),term);}
for(const ch of old.chapters){const target=wanted.chapters.find(c=>c.id===ch.id);for(const id of ch.places)assert(target.places.includes([50,71].includes(ch.id)&&id==='new-york'?'new-york-state':ch.id===12&&id==='st-petersburg'?'petersburg-florida-reference':id),'A previously documented association disappeared');}
assert(wanted.chapters[11].places.includes('petersburg-florida-reference'));
assert(!wanted.chapters[11].places.includes('st-petersburg'));
assert(wanted.chapters[70].places.includes('st-petersburg'));
assert(wanted.places['petersburg-florida-reference'].regionalOutline.paths.length);
assert.equal(wanted.chapters[50].placeCategories['regional-ramsdale'],'action');
assert.equal(wanted.chapters[30].placeCategories['regional-briceland'],'mentioned');
assert.equal(wanted.chapters[21].placeCategories['regional-riviera'],'mentioned');
for(const n of [50,71]){assert(!wanted.chapters[n-1].places.includes('new-york'));assert(wanted.chapters[n-1].places.includes('new-york-state'));}
assert.deepEqual(expected.tables.unlocated_settings,before.tables.unlocated_settings,'Archival source records must be preserved');
assert(!expected.tables.book_presentations[0].presentation.editorialNotice);
const {PGlite}=require('@electric-sql/pglite');
(async()=>{const db=new PGlite();try{
 async function runPublication(query=sql){for(const f of browserFiles.slice(0,-1))await db.exec(fs.readFileSync('work/lolita-final-review/'+f,'utf8'));return db.exec(query);}
 await db.exec('create role anon;create role authenticated;');
 await db.exec(fs.readFileSync('database/migrations/001_content.sql','utf8'));
 await db.exec(fs.readFileSync('database/migrations/004_book_presentation.sql','utf8').split('alter table public.book_presentations')[0]+'commit;');
 for(const table of ['books','sections','places','sources','place_descriptions','place_references','excerpts','unlocated_settings','content_translations','book_presentations'])await db.query(`insert into public.${table} select * from jsonb_populate_recordset(null::public.${table},$1)`,[JSON.stringify(before.tables[table])]);
 await db.query("insert into books(id,title,author,original_language,metadata) values('other','Other','Author','en',$1)",[{sentinel:17}]);
 await runPublication();await runPublication();
 const actual={formatVersion:1,tables:{}};
 for(const table of Object.keys(before.tables)){actual.tables[table]=(await db.query(`select * from public.${table} where ${table==='books'?'id':'book_id'}='lolita'`)).rows;for(const row of actual.tables[table])if(row.checked instanceof Date)row.checked=row.checked.toISOString().slice(0,10);}
 assert.deepEqual(view(actual),wanted);
 assert.equal((await db.query("select metadata->>'sentinel' value from books where id='other'")).rows[0].value,'17');
 const tampered=sql.replace('do $verify$ begin',"update books set metadata='{\"sentinel\":99}' where id='other';\ndo $verify$ begin");
 await assert.rejects(runPublication(tampered),/Other novels changed/);await db.exec('rollback;');
 assert.equal((await db.query("select metadata->>'sentinel' value from books where id='other'")).rows[0].value,'17');
 await db.exec("update excerpts set quote='changed since review' where book_id='lolita' and id='3:core:dorset:original';");
 await assert.rejects(runPublication(),/Changed source row/);await db.exec('rollback;');
 console.log('PASS: all 358 mapped associations have individual original passages and literal highlights; 71 section analyses; New York state/city distinction; recurrent settings; no association removed; archival records unchanged; real PostgreSQL publication twice, concurrency refusal, and rollback of unrelated-book changes.');
}finally{await db.close();}})().catch(e=>{console.error(e);process.exitCode=1});
