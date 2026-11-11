begin;
update public.sections set legacy_fields=array(select distinct f from unnest(legacy_fields || array['placeCategories']) f) where book_id='ulisse' and id=17;
update public.place_references set category='mentioned', scene_text='Bloom recalls reading the race result in the cabmen’s shelter earlier that day.', metadata=metadata || '{"explicitCategory":true}'::jsonb where book_id='ulisse' and id='17:core:shelter';
insert into public.excerpts(book_id,id,section_id,reference_id,slot,language,type,quote,attribution,text_source_id,rights_source_id,metadata)
select base.book_id,'17:core:'||v.place_id||':original',17,'17:core:'||v.place_id,'original','en','original',base.quote,base.attribution,base.text_source_id,base.rights_source_id,jsonb_build_object('highlightTerms',jsonb_build_array(v.term),'reviewedAt','2026-11-10')
from public.excerpts base cross join (values ('lowergardiner','Lower and Middle Gardiner streets'),('mountjoy','Mountjoy square'),('gardinerplace','Gardiner’s place')) v(place_id,term)
where base.book_id='ulisse' and base.id='17:core:beresford:original' and not exists (select 1 from public.excerpts e where e.book_id=base.book_id and e.reference_id='17:core:'||v.place_id and e.slot='original');
update public.excerpts e set metadata=e.metadata || jsonb_build_object('highlightTerms',jsonb_build_array(v.term),'reviewedAt','2026-11-10') from (values ('beresford','Beresford place'),('middlegardiner','Lower and Middle Gardiner streets'),('temple','Temple street'),('george','George’s church'),('eccles','7 Eccles street'),('shelter','cabman’s shelter')) v(place_id,term) where e.book_id='ulisse' and e.id='17:core:'||v.place_id||':original';
commit;
