// Editorial proposals only. Source words stay in work/ until individually reviewed.
const fs=require('node:fs');
const rows=JSON.parse(fs.readFileSync('work/lolita-final-review/visible-inventory.json'));
const native=JSON.parse(fs.readFileSync('work/lolita-quotes/native-sections.json'));
const splitter=new Intl.Segmenter('en',{granularity:'sentence'});
const out=rows.filter(r=>r.sourceAudit).map(r=>{
 const s=native.find(s=>s.id===r.sectionId).text;
 const masked=s.replace(/\b(?:Mr|Mrs|Ms|Dr|Jr|Sr|St|Mme|Mlle|Esq|Prof|Col|Gen|Rev|Ph|D|Co|Inc|Ave|Blvd|Rd|Fla|Ga|Mass|Colo|Wyo|Ariz|Calif|Nebr|Nev|pop|pp|vol|[A-Z])\./g,m=>m.replaceAll('.','·'));
 const sentences=[...splitter.segment(masked)].map(x=>({start:x.index,end:x.index+x.segment.trimEnd().length}));
 let parts=r.sourceAudit.parts.map(p=>{
  const a=sentences.find(x=>x.start<=p.start&&x.end>p.start)||p;
  const b=sentences.find(x=>x.start<p.end&&x.end>=p.end)||p;
  return {start:a.start,end:b.end};
 }).sort((a,b)=>a.start-b.start);
 const merged=[];for(const p of parts){const last=merged.at(-1);if(last&&last.end>=p.start)last.end=Math.max(last.end,p.end);else merged.push(p);}
 parts=merged;
 const quote=parts.map(p=>s.slice(p.start,p.end)).join(' […] ');
 return {...r,parts,proposed:quote,words:quote.split(/\s+/).length};
});
fs.writeFileSync('work/lolita-final-review/proposals.json',JSON.stringify(out,null,2));
for(let start=0;start<71;start+=12)fs.writeFileSync('work/lolita-final-review/proposals-'+start+'.txt',out.filter(r=>r.section>start&&r.section<=start+12).map(r=>`${r.sectionId}|${r.id}|${r.category}|${r.words}|${r.proposed}`).join('\n'));
console.log({proposals:out.length,long:out.filter(r=>r.words>120).map(r=>[r.sectionId,r.id,r.words])});
