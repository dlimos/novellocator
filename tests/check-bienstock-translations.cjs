const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const root='research/translations/',review=JSON.parse(fs.readFileSync(root+'war-and-peace-bienstock-review.json','utf8'));
const records=JSON.parse(fs.readFileSync(root+'verified/war-and-peace.json','utf8')).filter(r=>r.language==='fr');
const ctx={window:{}};vm.runInNewContext(fs.readFileSync('docs/data/war-and-peace.js','utf8'),ctx);
const keys=[];for(const ch of ctx.window.atlasData.chapters){keys.push(`${ch.id}/section/null`);for(const id of ch.places)keys.push(`${ch.id}/core/${id}`);for(const r of ch.citations||[])keys.push(`${ch.id}/citations/${r.placeId}`);}
assert.deepEqual(review.map(r=>`${r.section}/${r.collection}/${r.id}`).sort(),keys.sort());
assert.equal(review.filter(r=>r.status==='preexisting').length,17);assert.equal(records.length,220);
for(const r of review){assert.equal(records.some(q=>q.section===r.section&&q.collection===r.collection&&q.id===r.id),r.status==='verified');if(r.status!=='verified')assert.ok(r.reason);}
assert.deepEqual(review.filter(r=>r.status==='pending').map(r=>[r.section,r.id]),[[1,'petersburg'],[3,'austerlitz'],[3,'pratzen'],[10,'bald-hills'],[10,'raevsky'],[16,'paris'],[16,'erfurt']]);
for(const r of review.filter(r=>r.status==='pending')){const ch=ctx.window.atlasData.chapters[r.section-1],g=r.collection==='core'?ch.placeExcerpts[r.id]:ch.citations.find(c=>c.placeId===r.id).excerpt;assert.equal(g.translations?.fr,undefined);assert.ok(g.original.quote);}
const europe=ctx.window.atlasData.chapters[5].citations.find(c=>c.placeId==='europe').excerpt;
assert.ok(europe.translations.fr.quote.includes('Europe'));assert.equal(europe.translations.en,undefined);
const chapters=JSON.parse(fs.readFileSync(root+'corpus/war-bienstock-chapters.json','utf8'));
const parts=['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','EI','EII','App'];
assert.deepEqual(parts.map(part=>chapters.filter(c=>c.part===part).length),[25,21,19,16,21,26,13,22,23,39,34,16,19,19,21,16,12,2]);
for(const c of chapters){const paragraphs=JSON.parse(fs.readFileSync(root+'corpus/'+c.file.replace('.html','-paragraphs.json'),'utf8'));assert.ok(paragraphs.length>1,`Missing source ${c.part}/${c.chapter}`);}
for(const r of records){const source=fs.readFileSync(root+'corpus/'+r.sourceFile.replace('-paragraphs.json','.html'),'utf8');assert.equal(r.passage.sourceVolume,Number(source.match(/vol(\d+)\.djvu/)[1]));assert.ok(r.passage.attribution.includes('Bienstock'));}
console.log('PASS: 244 groups reviewed, 220 new French passages, 17 retained, seven documented gaps; all 364 source pages present and edition volumes checked.');
