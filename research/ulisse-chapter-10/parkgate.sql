begin;
do $$ begin
 if not exists (select 1 from public.places where book_id='ulisse' and id='parkgate' and latitude=53.348 and longitude=-6.2937) then raise exception 'Unexpected Park Gate coordinates'; end if;
 if not exists (select 1 from public.place_references where book_id='ulisse' and section_id=10 and id='10:core:parkgate' and category='action') then raise exception 'Unexpected Park Gate reference'; end if;
 if exists (select 1 from public.excerpts where book_id='ulisse' and reference_id='10:core:parkgate' and slot='original') then raise exception 'Existing Park Gate excerpt'; end if;
end $$;
insert into public.sources(book_id,id,url,label,metadata) values ('ulisse','f29e2fb54d73f821cc9b44fb2968e3a8bfc3baf78c8c67fcbe41e9f1a4bfe867','https://www.buildingsofireland.ie/buildings-search/building/50060017/park-gate-phoenix-park-chesterfield-avenue-dublin-8-dublin','NIAH 50060017 · Park Gate','{}') on conflict do nothing;
update public.places set latitude=53.348419,longitude=-6.296902 where book_id='ulisse' and id='parkgate';
update public.place_descriptions set position_source_id='f29e2fb54d73f821cc9b44fb2968e3a8bfc3baf78c8c67fcbe41e9f1a4bfe867', checked='2026-11-10', method='NIAH 50060017 Irish Grid E313467 N234459 converted from EPSG:29903 to WGS84; identifies the gate site, not the moving cavalcade.' where book_id='ulisse' and place_id='parkgate' and collection='core';
insert into public.excerpts(book_id,id,section_id,reference_id,slot,language,type,quote,attribution,text_source_id,rights_source_id,metadata) values ('ulisse','10:core:parkgate:original',10,'10:core:parkgate','original','en','original','The cavalcade passed out by the lower gate of Phoenix park saluted by obsequious policemen and proceeded past Kingsbridge along the northern quays. The viceroy was most cordially greeted on his way through the metropolis.','James Joyce · Ulysses · 1922 · Episode 10','f7244b0c3d499b30564049044c7d0b40a93acde70f05da4ee230e140a9c6fac9','21f5ddc16c42981666952e8d2fe36af645a8542aa0034417c672e91792c00cf9','{"highlightTerms":["lower gate of Phoenix park"],"reviewedAt":"2026-11-10"}'::jsonb);
commit;
