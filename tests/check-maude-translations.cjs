const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const root='research/translations/',review=JSON.parse(fs.readFileSync(root+'war-and-peace-maude-review.json','utf8'));
const records=JSON.parse(fs.readFileSync(root+'verified/war-and-peace.json','utf8')).filter(r=>r.language==='en');
const ctx={window:{}};vm.runInNewContext(fs.readFileSync('docs/data/war-and-peace.js','utf8'),ctx);
const keys=[];
for(const ch of ctx.window.atlasData.chapters){
 keys.push(`${ch.id}/section/null`);
 for(const id of ch.places)keys.push(`${ch.id}/core/${id}`);
 for(const r of ch.citations||[])keys.push(`${ch.id}/citations/${r.placeId}`);
}
assert.deepEqual(review.map(r=>`${r.section}/${r.collection}/${r.id}`).sort(),keys.sort());
assert.equal(review.filter(r=>r.status==='preexisting').length,108);
assert.equal(review.filter(r=>r.status==='verified').length,135);
assert.equal(records.length,135);
for(const r of review){
 const imported=records.some(q=>q.section===r.section&&q.collection===r.collection&&q.id===r.id);
 assert.equal(imported,r.status==='verified');
 if(r.status!=='verified')assert.ok(r.reason);
}
const missing=review.filter(r=>r.status==='pending');
assert.deepEqual(missing.map(r=>[r.section,r.id]),[[6,'europe']]);
const ch6=ctx.window.atlasData.chapters[5];
assert.equal(ch6.citations.find(r=>r.placeId==='europe').excerpt.translations?.en,undefined);
assert.equal(ch6.citations.find(r=>r.placeId==='erfurt').excerpt.translations.en.sourceBook,5);
assert.equal(ch6.citations.find(r=>r.placeId==='erfurt').excerpt.translations.en.sourceChapter,21);
assert.equal(ch6.citations.find(r=>r.placeId==='austria').excerpt.translations.en.sourceChapter,22);
const chapters=JSON.parse(fs.readFileSync(root+'corpus/war-maude-ws-chapters.json','utf8'));
assert.deepEqual(Array.from({length:17},(_,i)=>chapters.filter(c=>c.book===i+1).length),[28,21,19,16,22,26,13,22,23,39,34,16,19,19,20,16,12]);
for(const c of chapters){
 const paragraphs=JSON.parse(fs.readFileSync(root+'corpus/'+c.file.replace('.html','-paragraphs.json'),'utf8'));
 assert.ok(paragraphs.length>1,`Missing source chapter ${c.book}/${c.chapter}`);
}
console.log('PASS: 365 source chapters, 135 new English passages, 108 retained passages, one documented omission; cross-book alignment preserved.');
