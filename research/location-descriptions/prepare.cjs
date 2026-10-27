const fs=require('fs'),crypto=require('crypto'),vm=require('vm');
const before=JSON.parse(fs.readFileSync(__dirname+'/before.json'));
const quote=v=>"'"+String(v).replaceAll("'","''")+"'";
const md5=v=>crypto.createHash('md5').update(v).digest('hex');
const root=__dirname+'/release';fs.mkdirSync(root,{recursive:true});
const languages=['en','it','fr','es'];const manifest=[];
for(const book of ['crime-and-punishment','don-quijote','moby-dick','orwell1984','anna-karenina','to-kill-a-mockingbird']){
 const dictionaryContext={window:{}};vm.runInNewContext(fs.readFileSync('docs/data/'+book+'-i18n.js','utf8'),dictionaryContext);
 const rows=fs.readFileSync(__dirname+'/'+book+'.tsv','utf8').trim().split(/\r?\n/).map(line=>line.split('|'));
 if(book==='crime-and-punishment')rows.push(...fs.readFileSync(__dirname+'/crime-and-punishment-extra.tsv','utf8').trim().split(/\r?\n/).map(line=>line.split('|')));
 const selected=book==='anna-karenina'?JSON.parse(fs.readFileSync(__dirname+'/anna-selected.json')):null;
 const expanded=rows.flatMap(([section,places,...texts])=>places.split(',').map(place=>[section,place,...texts]));
 const patches=expanded.map(([section,place,...texts])=>{
  if(texts.length!==4||texts.some(t=>!t.trim()))throw Error('Incomplete '+book+'/'+section+'/'+place);
  const refId=selected?selected.find(c=>c.id===Number(section))?.placeExcerpts?.[place]?.original?._reference:null;
  const matches=before.place_references.filter(r=>r.book_id===book&&(selected?r.id===refId:r.section_id===Number(section)&&r.place_id===place&&r.collection==='core'));
  if(matches.length!==1)throw Error('Ambiguous '+book+'/'+section+'/'+place+': '+matches.length);
  const ref=matches[0];
  const name=before.place_descriptions.find(p=>p.book_id===book&&p.place_id===place&&p.collection==='core')?.name||place;
  texts=texts.map((text,i)=>text.replaceAll('{name}',dictionaryContext.window.atlasTranslations?.[languages[i]]?.[name]||name));
  const original=before.excerpts.find(q=>q.book_id===book&&q.reference_id===ref.id&&q.slot==='original'&&q.quote?.trim())||(ref.metadata?.quote?.trim()?{id:null,language:before.books.find(b=>b.id===book).original_language,legacy:true}:null);
  if(!original)throw Error('No original '+book+'/'+ref.id);
  return {id:ref.id,book,section:Number(section),place,oldHash:md5(ref.scene_text||''),description:{status:'reviewed',reviewedAt:'2026-10-27',texts:Object.fromEntries(languages.map((lang,i)=>[lang,texts[i]])),evidence:{referenceId:ref.id,excerptId:original.id,legacyQuote:!!original.legacy,language:original.language,scope:'editorial-context-only'}}};
 });
 if(new Set(patches.map(p=>p.id)).size!==patches.length)throw Error('Duplicate patch '+book);
 manifest.push(...patches);
 const data=quote(JSON.stringify(patches));
 const sql=`do $nl_description$\ndeclare patch jsonb := ${data}::jsonb;\nbegin\n if (select count(*) from public.place_references r join jsonb_to_recordset(patch) p(book text,id text,"oldHash" text,description jsonb) on p.book=r.book_id and p.id=r.id and md5(coalesce(r.scene_text,''))=p."oldHash") <> ${patches.length} then raise exception 'Description sources changed: ${book}'; end if;\n update public.place_references r set metadata=jsonb_set(r.metadata,'{narrativeDescription}',p.description,true) from jsonb_to_recordset(patch) p(book text,id text,description jsonb) where r.book_id=p.book and r.id=p.id;\nend $nl_description$;\nselect book_id,count(*) filter(where metadata->'narrativeDescription'->>'status'='reviewed') as reviewed_descriptions from public.place_references where book_id=${quote(book)} group by book_id;\n`;
 fs.writeFileSync(root+'/'+book+'.sql',sql);
 console.log(book+': '+patches.length+' verified descriptions');
}
fs.writeFileSync(root+'/manifest-20261027.json',JSON.stringify(manifest,null,2));
