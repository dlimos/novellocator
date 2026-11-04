begin;
do $region$ declare i integer; old jsonb; begin
 select (ordinality-1)::int,value into i,old from public.books b,jsonb_array_elements(b.metadata#>'{geographicReview,regionalPlaces}') with ordinality where b.id='anna-karenina' and value->>'id'='regional-pokrovskoe';
 if i is null or md5(old#>>'{place,note}') <> 'd2379353c482fd4f8c7f465d5c129cd1' or old#>'{place,positionDescription}' is not null then raise exception 'Regional source changed'; end if;
 update public.books set metadata=jsonb_set(metadata,array['geographicReview','regionalPlaces',i::text,'place','positionDescription'],'{"status":"reviewed","reviewedAt":"2026-11-04","basis":"Yasnaya Polyana Museum documented literary model","texts":{"en":"Yasnaya Polyana is the documented real inspiration for Levin’s fictional estate of Pokrovskoye.","it":"Jasnaja Poljana è la fonte d’ispirazione reale documentata per la tenuta immaginaria di Pokrovskoe di Levin.","fr":"Iasnaïa Poliana est la source d’inspiration réelle documentée du domaine fictif de Pokrovskoïé, propriété de Lévine.","es":"Yásnaya Poliana es la inspiración real documentada para la finca ficticia de Pokróvskoye, propiedad de Levin."}}'::jsonb,true) where id='anna-karenina';
end $region$;
commit;
