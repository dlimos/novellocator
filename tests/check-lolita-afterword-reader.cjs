const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),{PGlite}=require('@electric-sql/pglite');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),dir='work/lolita-final-review/';
const before=read(dir+'live-main-release.json'),expected=read(dir+'reader-expected.json'),sql=fs.readFileSync(dir+'afterword-reader.sql','utf8');
const c={window:{}};vm.createContext(c);vm.runInContext(fs.readFileSync('docs/content-adapter.js','utf8'),c);
vm.runInContext('function applyGeographicReview(input){'+fs.readFileSync('docs/app.js','utf8').split('function applyGeographicReview(input){')[1].split('\nwindow.atlasData=')[0],c);
const view=c.applyGeographicReview(c.window.atlasContent.reconstruct(expected,'lolita').data);
const unlocated=view.chapters.flatMap(ch=>(ch.unlocatedPlaces||[]).filter(p=>p.displayInAtlas!==false));
assert.equal(unlocated.length,101);
for(const p of unlocated){const q=p.excerpt?.original||p;assert(q.quote?.trim(),p.name);assert(q.highlightTerms?.length,p.name);for(const term of q.highlightTerms)assert(q.quote.toLowerCase().includes(term.toLowerCase()),p.name+'/'+term);}
const four=expected.tables.unlocated_settings.filter(r=>r.section_id===71&&['America','Europe','Harvard','Cornell'].includes(r.name));
assert.equal(four.length,4);assert(four.every(r=>r.metadata.verificationStatus==='verified'&&r.metadata.sourcePages[0]===209));
(async()=>{const db=new PGlite();try{
 await db.exec(fs.readFileSync('database/migrations/001_content.sql','utf8'));
 for(const table of ['books','sections','places','sources','place_descriptions','place_references','excerpts','unlocated_settings','content_translations'])await db.query(`insert into public.${table} select * from jsonb_populate_recordset(null::public.${table},$1)`,[JSON.stringify(before.tables[table])]);
 await db.query("insert into books(id,title,author,original_language,metadata) values('other','Other','Author','en',$1)",[{sentinel:17}]);
 await db.exec(sql);await db.exec(sql);
 for(const row of four){const result=(await db.query('select * from unlocated_settings where book_id=$1 and section_id=$2 and ordinal=$3',['lolita',71,row.ordinal])).rows[0];assert.deepEqual(result,row);}
 assert.equal((await db.query("select count(*)::integer n from unlocated_settings where book_id='lolita'")).rows[0].n,341);
 assert.equal((await db.query("select metadata->>'sentinel' value from books where id='other'")).rows[0].value,'17');
 console.log('PASS: 101 reader-facing unlocated geographical references all have original passages and literal highlights; four afterword originals added; SQL is idempotent and preserves all 341 archival records.');
}finally{await db.close();}})().catch(e=>{console.error(e.message);process.exitCode=1});
