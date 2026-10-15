// Prepare a guarded, quotation-only update. No categories, coordinates or translations are replaced.
const fs=require('node:fs'),assert=require('node:assert/strict');
const dir='work/sound-and-fury-excerpts/';
const review=JSON.parse(fs.readFileSync(dir+'proposals.json','utf8'));
const before=JSON.parse(fs.readFileSync(dir+'live-before.json','utf8'));
const quoted=JSON.parse(fs.readFileSync(dir+'excerpts-before.json','utf8'));
const unlocated=JSON.parse(fs.readFileSync(dir+'unlocated_settings-before.json','utf8'));
const after=structuredClone(before),updates={excerpts:[],unlocated_settings:[]};
const summary={reviewed:review.length,changed:0,explicitHighlights:0,noLocativeForm:0,sections:[]};
for(const record of review){
 assert.ok(record.reviewed);
 const paragraphs=JSON.parse(fs.readFileSync('research/sound-and-fury/'+record.section+'.json','utf8'));
 const source=paragraphs.join(record.sourceJoin);
 assert.equal(source.slice(record.sourceStart,record.sourceEnd).trim(),record.quote,record.id+' literal evidence');
 assert.ok(record.highlightTerms.every(term=>record.quote.includes(term)),record.id+' highlight evidence');
 assert.ok(record.words>=(record.section===2&&record.id==='canada'?10:13)&&record.words<=120,record.id+' contextual passage length');
 let offset=0,start=0,end=0;
 for(let i=0;i<paragraphs.length;i++){
  if(offset<=record.sourceStart)start=i;
  if(offset<record.sourceEnd)end=i;
  offset+=paragraphs[i].length+record.sourceJoin.length;
 }
 const range=start===end?String(start+1):`${start+1}–${end+1}`;
 const chapter=after.data.chapters.find(c=>c.id===record.section);
 const group=chapter.placeExcerpts?.[record.id]||chapter.citations?.find(c=>c.placeId===record.id)?.excerpt;
 const local=group?.original||chapter.unlocatedPlaces.find(u=>u.id===record.id);
 assert.ok(local,record.id+' current association');
 const metadata={highlightTerms:record.highlightTerms,highlightMode:'explicit',highlightReason:record.highlightReason,sourceParagraph:start+1,sourceParagraphEnd:end+1,sourceStart:record.sourceStart,sourceEnd:record.sourceEnd,sourceJoin:record.sourceJoin,quotationReview:'2026-10-15'};
 const attribution=local.attribution.replace(/ · (?:paragraph|line)s? \d+(?:[–-]\d+)?$/,'')+` · ${record.section===5?'lines':'paragraphs'} ${range}`;
 const patch={quote:record.quote,...metadata,attribution};
 Object.assign(local,patch);
 const q=quoted.find(q=>q.section_id===record.section&&q.reference_id?.split(':').at(-1)===record.id);
 if(q)updates.excerpts.push({id:q.id,old_quote:q.quote,quote:record.quote,attribution,metadata});
 else{
  const u=unlocated.find(u=>u.section_id===record.section&&u.metadata.id===record.id);
  assert.ok(u);updates.unlocated_settings.push({section_id:u.section_id,ordinal:u.ordinal,old_quote:u.quote,quote:record.quote,metadata:{...metadata,attribution}});
 }
 summary.changed+=record.quote!==record.previousQuote?1:0;
 summary.explicitHighlights+=record.highlightTerms.length?1:0;
 summary.noLocativeForm+=record.highlightTerms.length?0:1;
}
assert.equal(updates.excerpts.length,quoted.length);
assert.equal(updates.unlocated_settings.length,unlocated.length);
for(let s=1;s<=5;s++){
 const records=review.filter(r=>r.section===s),join=records[0].sourceJoin;
 const paragraphs=JSON.parse(fs.readFileSync('research/sound-and-fury/'+s+'.json','utf8'));
 const intervals=records.map(r=>[r.sourceStart,r.sourceEnd]).sort((a,b)=>a[0]-b[0]),merged=[];
 for(const [a,b]of intervals){if(merged.length&&a<=merged.at(-1)[1])merged.at(-1)[1]=Math.max(b,merged.at(-1)[1]);else merged.push([a,b]);}
 const source=paragraphs.join(join),uniqueWords=merged.map(([a,b])=>source.slice(a,b).trim().split(/\s+/).length).reduce((a,b)=>a+b,0);
 summary.sections.push({section:s,passages:records.length,minimumWords:Math.min(...records.map(r=>r.words)),maximumWords:Math.max(...records.map(r=>r.words)),quotedWords:records.reduce((a,r)=>a+r.words,0),uniqueWords,sourceWords:source.trim().split(/\s+/).length});
}
fs.writeFileSync(dir+'expected.json',JSON.stringify(after,null,2)+'\n');
fs.writeFileSync(dir+'updates.json',JSON.stringify(updates,null,2)+'\n');
fs.writeFileSync(dir+'summary.json',JSON.stringify(summary,null,2)+'\n');
let sql=`begin;\ndo $review$\ndeclare changed integer;\nbegin\n`;
sql+=`with patch as (select * from jsonb_to_recordset($passages$${JSON.stringify(updates.excerpts)}$passages$::jsonb) as p(id text, old_quote text, quote text, attribution text, metadata jsonb))\nupdate public.excerpts as q set quote=p.quote, attribution=p.attribution, metadata=q.metadata||p.metadata from patch p where q.book_id='sound-and-fury' and q.id=p.id and (q.quote=p.old_quote or q.quote=p.quote);\nget diagnostics changed = row_count;\nif changed <> ${quoted.length} then raise exception 'Quotation conflict: %', changed; end if;\n`;
sql+=`with patch as (select * from jsonb_to_recordset($settings$${JSON.stringify(updates.unlocated_settings)}$settings$::jsonb) as p(section_id integer, ordinal integer, old_quote text, quote text, metadata jsonb))\nupdate public.unlocated_settings as q set quote=p.quote, metadata=q.metadata||p.metadata from patch p where q.book_id='sound-and-fury' and q.section_id=p.section_id and q.ordinal=p.ordinal and (q.quote=p.old_quote or q.quote=p.quote);\nget diagnostics changed = row_count;\nif changed <> ${unlocated.length} then raise exception 'Setting conflict: %', changed; end if;\nend $review$;\ncommit;\nselect 'sound-and-fury' as book, ${review.length} as reviewed_passages;\n`;
fs.writeFileSync(dir+'publish.sql',sql);
console.log(JSON.stringify(summary,null,2));console.log('SQL bytes:',Buffer.byteLength(sql));
