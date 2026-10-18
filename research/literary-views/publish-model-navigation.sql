begin;
update public.book_maps
set metadata=jsonb_set(metadata,'{illustratedAtlas,geographicPlaces,regional-town,modelName}','"Aracataca"'::jsonb)
where book_id='macondo' and id='reading-map'
and metadata#>>'{illustratedAtlas,geographicPlaces,regional-town,scope}'='real-literary-model';
commit;
select book_id,metadata#>>'{illustratedAtlas,geographicPlaces,regional-town,modelName}' as model_name
from public.book_maps where book_id='macondo' and id='reading-map';
