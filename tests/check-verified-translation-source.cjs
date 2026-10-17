const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const book=process.argv[2];assert.match(book||'',/^[a-z0-9-]+$/);
const records=JSON.parse(fs.readFileSync(`research/translations/verified/${book}.json`,'utf8'));
const c={window:{}};vm.runInNewContext(fs.readFileSync(`docs/data/${book}.js`,'utf8'),c);
const sources=new Map();
for(const r of records){
 if(!r.sourceFile){
  assert.equal(book,'crime-and-punishment');assert.equal(r.language,'fr');
  const legacy=fs.readFileSync(`research/translations/corpus/crime-fr-${r.section}-web.txt`,'utf8').replace(/L\d+: /g,'').replace(/\s+/g,' ').trim();
  assert.ok(legacy.includes(r.passage.quote.replace(/\s+/g,' ').trim()));
  continue;
 }
 if(!sources.has(r.sourceFile))sources.set(r.sourceFile,JSON.parse(fs.readFileSync(`research/translations/corpus/${r.sourceFile}`,'utf8')));
 assert.ok(sources.get(r.sourceFile)[r.sourceParagraph].includes(r.passage.quote),`Nonliteral quotation: ${r.section}/${r.id}`);
 for(const term of r.passage.highlightTerms||[])assert.ok(r.passage.quote.includes(term),`Invented geographic form: ${r.section}/${r.id}`);
 assert.ok(r.originalQuote&&r.alignment&&r.rightsNote&&r.passage.translator&&r.passage.edition&&r.passage.publisher);
 const ch=c.window.atlasData.chapters.find(ch=>ch.id===r.section);
 const group=r.collection==='section'?ch.excerpts:r.collection==='core'?ch.placeExcerpts[r.id]:r.collection==='citations'?ch.citations.find(x=>x.placeId===r.id).excerpt:ch.unlocatedPlaces.find(x=>(x.id||x.name)===r.id);
 assert.equal(group.translations[r.language].quote,r.passage.quote);
 assert.equal(r.collection==='unlocated'?group.quote:group.original.quote,r.originalQuote,'Original passage must remain unchanged');
}
const reviewLanguage=process.argv[3];
const reviewFile=`research/translations/${book}${reviewLanguage?'-'+reviewLanguage:''}-alignment-review.json`;
if(fs.existsSync(reviewFile)){
 const review=JSON.parse(fs.readFileSync(reviewFile,'utf8')),keys=new Set(review.map(r=>`${r.section}/${r.collection}/${r.id}`)),expected=[];
 assert.equal(keys.size,review.length,'An association must not be reviewed twice');
 for(const ch of c.window.atlasData.chapters){
  if(ch.excerpts||ch.excerpt)expected.push(`${ch.id}/section/null`);
  for(const id of ch.places)expected.push(`${ch.id}/core/${id}`);
  for(const r of ch.citations||[])expected.push(`${ch.id}/citations/${r.placeId}`);
  for(const r of ch.unlocatedPlaces||[])expected.push(`${ch.id}/unlocated/${r.id||r.name}`);
 }
 assert.deepEqual([...keys].sort(),expected.sort(),'The review must account for every association, including documented gaps');
 for(const r of review){
  const language=reviewLanguage||r.language;
  assert.ok(language||new Set(records.map(q=>q.language)).size===1,'A multilingual import needs an explicit review language');
  const imported=records.some(q=>q.section===r.section&&q.collection===r.collection&&q.id===r.id&&(!language||q.language===language)&&!['pending','rejected'].includes(q.passage.verificationStatus));
  assert.equal(imported,r.status==='verified','Pending passages must not be imported');
  if(r.status!=='verified')assert.ok(r.reason);
 }
 console.log(`PASS: all ${expected.length} associations reviewed, including ${review.filter(r=>r.status==='pending').length} documented gaps.`);
}
console.log(`PASS: ${records.length} literal ${book} quotations, authentic highlighted forms, source references and unchanged originals.`);
