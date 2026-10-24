const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm'),{execFileSync}=require('node:child_process');
const before=require('./before.json'),after=require('./after.json'),c=require('./changes.json');
const ctx={window:{}};vm.runInNewContext(fs.readFileSync('docs/supabase-config.js','utf8'),ctx);const config=ctx.window.atlasSupabase;
const hashes=[...new Set(c.translations.map(t=>require('crypto').createHash('sha256').update(t.text).digest('hex')))];
const url=config.url+'/rest/v1/content_translations?select=*&source_hash=in.('+hashes.join(',')+')&limit=1000';
const tr=JSON.parse(execFileSync('curl.exe',['-sS','--fail','--max-time','60',url,'-H','apikey: '+config.publishableKey],{encoding:'utf8',maxBuffer:5e6}));
for(const expected of c.translations)assert.equal(tr.find(t=>t.book_id===expected.book&&t.language===expected.language&&t.source_text===expected.text)?.translated_text,expected.translated);
for(const s of c.sections)assert.equal(after.sections.find(x=>x.book_id===s.book&&x.id===s.id).metadata.note,undefined);
for(const s of c.sources)assert.equal(after.sources.find(x=>x.book_id==='ulisse'&&x.id===s.id).label,s.label);
for(const s of after.sections){const old=before.sections.find(x=>x.book_id===s.book_id&&x.id===s.id);if(!c.sections.some(x=>x.book===s.book_id&&x.id===s.id))assert.equal(s.metadata.note,old.metadata.note);assert.equal(s.metadata.text,old.metadata.text);}
for(const r of before.place_references)assert.equal(after.place_references.find(x=>x.book_id===r.book_id&&x.id===r.id).category,r.category);
for(const b of after.books)assert.deepEqual(b.metadata.geographicReview?.regionalPlaces,before.books.find(x=>x.id===b.id).metadata.geographicReview?.regionalPlaces);
const result={publicApiVerified:true,repeatedNotesRemoved:c.sections.length,topographicSourceLabels:c.sources.length,sceneReferences:c.references.reduce((n,r)=>n+r.count,0),verifiedTranslations:c.translations.length,sectionSpecificNotesPreserved:true,categoriesAndGeometryPreserved:true};
fs.writeFileSync(__dirname+'/verification.json',JSON.stringify(result,null,2)+'\n');console.log(result);
