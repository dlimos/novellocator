const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const book=process.argv[2];assert.match(book||'',/^[a-z0-9-]+$/);
const records=JSON.parse(fs.readFileSync(`research/translations/verified/${book}.json`,'utf8'));
const c={window:{}};vm.runInNewContext(fs.readFileSync(`docs/data/${book}.js`,'utf8'),c);
const sources=new Map();
for(const r of records){
 if(!sources.has(r.sourceFile))sources.set(r.sourceFile,JSON.parse(fs.readFileSync(`research/translations/corpus/${r.sourceFile}`,'utf8')));
 assert.ok(sources.get(r.sourceFile)[r.sourceParagraph].includes(r.passage.quote),`Nonliteral quotation: ${r.section}/${r.id}`);
 for(const term of r.passage.highlightTerms||[])assert.ok(r.passage.quote.includes(term),`Invented geographic form: ${r.section}/${r.id}`);
 assert.ok(r.originalQuote&&r.alignment&&r.rightsNote&&r.passage.translator&&r.passage.edition&&r.passage.publisher);
 const ch=c.window.atlasData.chapters.find(ch=>ch.id===r.section);
 const group=r.collection==='section'?ch.excerpts:r.collection==='core'?ch.placeExcerpts[r.id]:r.collection==='citations'?ch.citations.find(x=>x.placeId===r.id).excerpt:ch.unlocatedPlaces.find(x=>(x.id||x.name)===r.id);
 assert.equal(group.translations[r.language].quote,r.passage.quote);
 assert.equal(r.collection==='unlocated'?group.quote:group.original.quote,r.originalQuote,'Original passage must remain unchanged');
}
console.log(`PASS: ${records.length} literal ${book} quotations, authentic highlighted forms, source references and unchanged originals.`);
