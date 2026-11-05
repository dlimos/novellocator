begin;
insert into public.sources(book_id,id,url,label,metadata) values
('ulisse','d9d2475b198dcb4d40e10c732d5725d391a24e427ce7e58a8a72ba1da35e1705','https://en.wikipedia.org/wiki/Forty_Foot','Forty Foot · published coordinates','{}') on conflict do nothing;
update public.places set latitude=53.28944,longitude=-6.11361 where book_id='ulisse' and id='forty';
update public.place_descriptions set position_source_id='d9d2475b198dcb4d40e10c732d5725d391a24e427ce7e58a8a72ba1da35e1705',
additional_source_id=coalesce(additional_source_id,position_source_id),checked='2026-11-05',
method='Approximate reference for the bathing area north of the tower, using the published Forty Foot coordinate, corroborated by Byway (53.28949, -6.11370) and the DLR Sandycove Point masterplan. It does not locate an individual swimmer.',
metadata=metadata||'{"coordinateReview":{"date":"2026-11-05","previous":[53.28875,-6.1131],"corroboratingSources":["https://www.byway.world/places/attractions/forty-foot-7c694a3a","https://www.dlrcoco.ie/sites/default/files/2023-08/bullock_and_sandycove_harbours_masterplan_2020_1.pdf"],"precision":"approximate bathing-area reference"}}'::jsonb
where book_id='ulisse' and place_id='forty';
commit;
select id,latitude,longitude from public.places where book_id='ulisse' and id in ('forty','tower','dundrum');
