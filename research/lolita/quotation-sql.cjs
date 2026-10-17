// One atomic transaction, with one compact data payload instead of repeated literals.
module.exports=function buildQuotationSql({before,bundle,audit,textSource,rightsSource,note,translations}){
 const q=s=>"E'"+String(s).replaceAll('\\','\\\\').replaceAll("'","''").replaceAll('\n','\\n').replaceAll('\r','\\r')+"'",json=x=>`${q(JSON.stringify(x))}::jsonb`;
 const book=bundle.tables.books[0],review=book.metadata.geographicReview;
 const inputs=audit.map(r=>{
  const direct=bundle.tables.place_references.find(x=>x.section_id===r.section&&x.place_id===r.placeId),index=review.regionalPlaces.findIndex(x=>x.id===r.placeId),region=review.regionalPlaces[index];
  const base={section:r.section,original_section:r.sectionId,place_id:r.placeId,quote:r.quote,pages:r.pdfPages,terms:r.highlightTerms,category:r.category,context:r.contextEstablished};
  if(r.category==='action')base.rationale=r.rationale;
  if(direct)return {...base,reference_id:direct.id};
  if(region?.sectionOccurrences?.[r.section])return {...base,region_index:index};
  const keys=region?(region.evidencePriority||region.keys):[r.placeId],row=bundle.tables.unlocated_settings.filter(u=>u.section_id===r.section&&keys.includes(u.metadata.id||u.name)).sort((a,b)=>keys.indexOf(a.metadata.id||a.name)-keys.indexOf(b.metadata.id||b.name))[0];
  if(!row)throw Error('Missing quotation target');return {...base,ordinal:row.ordinal,name:row.name};
 });
 const common={language:'en',type:'original',highlightMode:'explicit',verificationStatus:'verified',quotationStatus:'reviewed-critical-use',analysisStatus:'native-pdf-evidence-reviewed',sourceEdition:'identified-digital-copy-imprint-not-stated',sourcePdfSha256:book.metadata.quotationReview.sourcePdfSha256};
 const mention=audit.find(r=>r.category==='mentioned').rationale;
 const scope=['books','sources','excerpts','unlocated_settings','content_translations'].map(t=>`select '${t}'::text target,md5(coalesce(string_agg(h,'' order by h),'')) digest from (select md5(to_jsonb(r)::text) h from public.${t} r where r.${t==='books'?'id':'book_id'}<>'lolita') rows`).join(' union all ');
 let sql=`begin isolation level repeatable read;\nset local standard_conforming_strings=on;\ncreate temporary table lolita_quote_scope on commit drop as ${scope};\n`;
 sql+=`create temporary table lolita_quote_rows on commit drop as select x.*,${json(common)}||jsonb_build_object('quote',x.quote,'attribution','Vladimir Nabokov · Lolita · '||case when original_section='foreword' then 'Foreword' else 'Part '||split_part(original_section,'.',1)||' · Chapter '||split_part(original_section,'.',2) end||' · digital copy, publisher and date not stated · PDF p. '||(select string_agg(value,', ' order by ordinal) from jsonb_array_elements_text(x.pages) with ordinality as p(value,ordinal))||case when context then ' · setting identified from chapter context' else '' end,'highlightTerms',x.terms,'sourcePdfPages',x.pages,'narrativeCategory',x.category,'contextEstablished',x.context,'verificationNote',coalesce(x.rationale,${q(mention)})) passage from jsonb_to_recordset(${json(inputs)}) as x(section integer,original_section text,place_id text,quote text,pages jsonb,terms jsonb,category text,context boolean,rationale text,reference_id text,region_index integer,ordinal integer,name text);\n`;
 sql+=`do $guard$ begin
 if (select count(*) from lolita_quote_rows)<>411 then raise exception 'Incomplete quotation payload';end if;
 if exists(select 1 from lolita_quote_rows r where r.reference_id is not null and not exists(select 1 from public.place_references p where p.book_id='lolita' and p.id=r.reference_id and p.section_id=r.section and p.place_id=r.place_id and p.category=r.category)) then raise exception 'Mapped quotation target changed';end if;
 if exists(select 1 from lolita_quote_rows r join public.excerpts e on e.book_id='lolita' and e.reference_id=r.reference_id and e.slot='original' where e.quote<>r.quote or e.attribution<>r.passage->>'attribution') then raise exception 'Existing quotation differs';end if;
 if exists(select 1 from lolita_quote_rows r where r.ordinal is not null and not exists(select 1 from public.unlocated_settings u where u.book_id='lolita' and u.section_id=r.section and u.ordinal=r.ordinal and u.name=r.name and u.quote in ('',r.quote))) then raise exception 'Unlocated quotation target changed';end if;
 end $guard$;\n`;
 for(const s of [textSource,rightsSource])sql+=`insert into public.sources(book_id,id,url,label,metadata) values('lolita',${q(s.id)},${q(s.url)},${q(s.label)},${json(s.metadata)}) on conflict(book_id,id) do update set metadata=excluded.metadata where sources.book_id='lolita';\n`;
 sql+=`insert into public.excerpts(book_id,id,section_id,reference_id,slot,language,type,quote,attribution,text_source_id,rights_source_id,metadata) select 'lolita',reference_id||':original',section,reference_id,'original','en','original',quote,passage->>'attribution',${q(textSource.id)},${q(rightsSource.id)},passage-'quote'-'language'-'type'-'attribution' from lolita_quote_rows where reference_id is not null on conflict(book_id,id) do nothing;\n`;
 sql+=`update public.unlocated_settings u set quote=r.quote,source_id=${q(textSource.id)},metadata=u.metadata||(r.passage-'quote')||jsonb_build_object('category',r.category) from lolita_quote_rows r where u.book_id='lolita' and r.ordinal is not null and u.section_id=r.section and u.ordinal=r.ordinal and u.name=r.name;\n`;
 sql+=`do $regions$ declare r record; begin for r in select * from lolita_quote_rows where region_index is not null loop
 if not exists(select 1 from public.books b where b.id='lolita' and b.metadata#>>array['geographicReview','regionalPlaces',r.region_index::text,'id']=r.place_id and b.metadata#>>array['geographicReview','regionalPlaces',r.region_index::text,'sectionOccurrences',r.section::text,'category']=r.category) then raise exception 'Regional quotation target changed';end if;
 update public.books set metadata=jsonb_set(metadata,array['geographicReview','regionalPlaces',r.region_index::text,'sectionOccurrences',r.section::text,'excerpt'],jsonb_build_object('original',r.passage,'translations','{}'::jsonb)) where id='lolita';
 end loop;end $regions$;\n`;
 sql+=`update public.books set metadata=jsonb_set(metadata||${json({sidebarNote:book.metadata.sidebarNote,analysisStatus:book.metadata.analysisStatus,quotationReview:book.metadata.quotationReview})},'{geographicReview,sidebarNote}',${json(note[0])}) where id='lolita';\n`;
 for(const t of translations)sql+=`insert into public.content_translations(book_id,language,source_hash,source_text,translated_text) values('lolita',${q(t.language)},${q(t.source_hash)},${q(t.source_text)},${q(t.translated_text)}) on conflict(book_id,language,source_hash) do update set translated_text=excluded.translated_text where content_translations.book_id='lolita';\n`;
 sql+=`do $scope$ begin if exists(select * from lolita_quote_scope except select * from (${scope}) current_scope) then raise exception 'Quotation scope verification failed: another book changed';end if;end $scope$;\ncommit;\nselect count(*) as published_original_excerpts from public.excerpts where book_id='lolita';\n`;
 return sql;
};
