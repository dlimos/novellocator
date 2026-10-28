const fs=require('fs'),crypto=require('crypto'),assert=require('assert/strict');
const before=require('./before.json'),audit=require('../lolita/pdf-quotation-review.json'),native=require('../../work/lolita-quotes/native-sections.json');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex'),md5=s=>crypto.createHash('md5').update(s).digest('hex');
const q=s=>"'"+String(s).replaceAll("'","''")+"'";
const texts=new Map(fs.readFileSync(__dirname+'/lolita.tsv','utf8').trim().split(/\r?\n/).map(line=>{const [s,p,...values]=line.split('|');assert.equal(values.length,4);return[s+':'+p,Object.fromEntries(['en','it','fr','es'].map((l,i)=>[l,values[i]]))];}));
let verified=0;for(const r of audit.records){const section=native.find(s=>s.id===r.sectionId);assert(section);for(const part of r.parts)assert.equal(hash(section.text.slice(part.start,part.end)),part.sha256);verified++;}
const patches=[];let retained=0;
for(const r of before.place_references.filter(r=>r.book_id==='lolita')){
 const original=before.excerpts.find(e=>e.book_id==='lolita'&&e.reference_id===r.id&&e.slot==='original');
 let description;
 if(original){const record=audit.records.find(a=>a.section===r.section_id&&a.placeId===r.place_id);assert(record);assert.equal(record.quote,original.quote);assert.equal(record.category,r.category);
  const specific=texts.get(r.section_id+':'+r.place_id);
  if(!specific&&!/under review/i.test(r.scene_text)){retained++;continue;}
  description={status:'reviewed',reviewedAt:'2026-10-27',texts:specific||{},context:specific?'editorial':'authentic-quotation',evidence:{referenceId:r.id,excerptId:original.id,quoteSha256:hash(original.quote),pdfSha256:audit.source.sha256,previousReviewAt:audit.reviewedAt,section:record.sectionId,pages:record.pdfPages}};
 }else{assert.equal(r.section_id,71,'Unexpected original-text gap');description={status:'pending',reason:'source-unavailable',reviewedAt:'2026-10-27',texts:{},evidence:{referenceId:r.id,section:'afterword',sourceGap:'The selected native PDF does not include the authorial afterword.'}};}
 const sceneText=description.status==='reviewed'?(description.texts.en||''):r.scene_text;
 patches.push({id:r.id,category:r.category,oldHash:md5(r.scene_text||''),newHash:md5(sceneText||''),sceneText,quoteHash:original?hash(original.quote):null,description});
}
const data=q(JSON.stringify(patches));
const sql=`do $nl_lolita$ declare patch jsonb := ${data}::jsonb; begin
 if (select count(*) from jsonb_to_recordset(patch) p(id text,category text,"oldHash" text,"newHash" text,"quoteHash" text) join public.place_references r on r.book_id='lolita' and r.id=p.id and r.category=p.category and md5(coalesce(r.scene_text,'')) in(p."oldHash",p."newHash") where p."quoteHash" is null or exists(select 1 from public.excerpts e where e.book_id=r.book_id and e.reference_id=r.id and e.slot='original' and encode(sha256(convert_to(e.quote,'UTF8')),'hex')=p."quoteHash")) <> ${patches.length} then raise exception 'Lolita individual evidence changed'; end if;
 update public.place_references r set scene_text=p."sceneText",metadata=jsonb_set(r.metadata,'{narrativeDescription}',p.description,true) from jsonb_to_recordset(patch) p(id text,"sceneText" text,description jsonb) where r.book_id='lolita' and r.id=p.id;
end $nl_lolita$;
select metadata->'narrativeDescription'->>'status' as status,count(*) from public.place_references where book_id='lolita' and metadata ? 'narrativeDescription' group by 1;`;
const actualNames=new Set(before.place_descriptions.filter(p=>p.book_id==='lolita').map(p=>p.name));const translations=[];
for(const line of fs.readFileSync(__dirname+'/lolita-place-names.tsv','utf8').trim().split(/\r?\n/)){const [source,...values]=line.split('|');assert.equal(values.length,3);if(!actualNames.has(source))continue;for(const [i,language]of ['it','fr','es'].entries())translations.push({language,source,value:values[i]});}
const trSql=`insert into public.content_translations(book_id,language,source_hash,source_text,translated_text) values\n${translations.map(t=>'('+['lolita',t.language,hash(t.source),t.source,t.value].map(q).join(',')+')').join(',\n')}\non conflict(book_id,language,source_hash) do update set source_text=excluded.source_text,translated_text=excluded.translated_text;\nselect language,count(*) from public.content_translations where book_id='lolita' and source_text in ('Italy','London','England','Venice','Paris','Nile') group by language order by language;`;
fs.writeFileSync(__dirname+'/release/lolita.sql',sql);fs.writeFileSync(__dirname+'/release/lolita-names.sql',trSql);fs.writeFileSync(__dirname+'/release/lolita-manifest.json',JSON.stringify({patches,translations,verified,retained},null,2));
console.log({verifiedNativeAssociations:verified,patched:patches.length,retainedSpecificContexts:retained,reviewed:patches.filter(p=>p.description.status==='reviewed').length,sourceGaps:patches.filter(p=>p.description.status==='pending').length,translatedNames:translations.length/3});
