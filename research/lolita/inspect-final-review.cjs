const fs=require('node:fs'),vm=require('node:vm');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const before=read('work/lolita-final-review/reconstructed-before.json');
const fn=fs.readFileSync('docs/app.js','utf8').split('function applyGeographicReview(input){')[1].split('\nwindow.atlasData=')[0];
const ctx={};vm.createContext(ctx);vm.runInContext('function applyGeographicReview(input){'+fn,ctx);
const data=ctx.applyGeographicReview(before.data);
const audit=read('research/lolita/pdf-quotation-review.json').records;
const records=[];
for(const c of data.chapters)for(const id of c.places){
 const q=c.placeExcerpts?.[id]?.original;
 const r=audit.find(r=>r.section===c.id&&r.placeId===id)||audit.find(r=>r.section===c.id&&r.quote===q?.quote);
 records.push({section:c.id,sectionId:c.originalSectionId,id,name:data.places[id]?.name,category:c.placeCategories[id],quote:q?.quote||null,terms:q?.highlightTerms||[],sourceAudit:r?{section:r.sectionId,placeId:r.placeId,parts:r.parts,pages:r.pdfPages}:null,description:c.placeText[c.places.indexOf(id)]});
}
fs.writeFileSync('work/lolita-final-review/visible-inventory.json',JSON.stringify(records,null,2));
console.log({visibleAssociations:records.length,missing:records.filter(r=>!r.quote).map(r=>[r.sectionId,r.id]),withoutAudit:records.filter(r=>r.quote&&!r.sourceAudit).map(r=>[r.sectionId,r.id])});
for(let start=0;start<71;start+=12){
 const rows=records.filter(r=>r.section>start&&r.section<=start+12);
 fs.writeFileSync('work/lolita-final-review/review-'+start+'.txt',rows.map(r=>`${r.sectionId}|${r.id}|${r.category}|${r.quote||'MISSING'}`).join('\n'));
}
