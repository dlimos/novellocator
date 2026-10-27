const fs=require('fs'),crypto=require('crypto');
const q=v=>"'"+String(v).replaceAll("'","''")+"'";
const before=require('./before.json'),maps=require('./maps-before.json').book_maps;
const langs=['en','it','fr','es'];
const rows=file=>fs.readFileSync(__dirname+'/'+file,'utf8').trim().split(/\r?\n/).map(line=>{const [section,place,...texts]=line.split('|');if(texts.length!==4)throw Error('Invalid TSV');return{section,place,texts:Object.fromEntries(langs.map((l,i)=>[l,texts[i]]))};});
const macondo=rows('macondo.tsv').map(p=>({...p,hash:crypto.createHash('md5').update(maps[0].metadata.illustratedAtlas.geographicPlaces[p.place].excerpts[p.section].quote).digest('hex')}));
const anna=rows('anna-regional.tsv');
const macondoSql=`do $nl_map$ declare p record; geo jsonb; begin
 for p in select * from jsonb_to_recordset(${q(JSON.stringify(macondo))}::jsonb) as x(section text,place text,texts jsonb,hash text) loop
  select metadata#>array['illustratedAtlas','geographicPlaces',p.place] into geo from public.book_maps where book_id='macondo' and id='reading-map';
  if geo is null or md5(geo#>>array['excerpts',p.section,'quote']) is distinct from p.hash then raise exception 'Macondo source changed: % / %',p.place,p.section; end if;
  update public.book_maps set metadata=jsonb_set(metadata,array['illustratedAtlas','geographicPlaces',p.place],geo||jsonb_build_object('chapterScenes',coalesce(geo->'chapterScenes','{}'::jsonb)||jsonb_build_object(p.section,p.texts)),true) where book_id='macondo' and id='reading-map';
 end loop;
end $nl_map$;
select 'macondo' as book,count(*) as descriptions from public.book_maps m,jsonb_each(m.metadata#>'{illustratedAtlas,geographicPlaces}') g,jsonb_each(g.value->'chapterScenes') c where m.book_id='macondo' and m.id='reading-map';`;
const annaSql=`do $nl_anna$ declare p record; idx integer; base jsonb; begin
 select (ordinality-1)::integer,value into idx,base from public.books b,jsonb_array_elements(b.metadata#>'{geographicReview,regionalPlaces}') with ordinality where b.id='anna-karenina' and value->>'id'='regional-pokrovskoe';
 if idx is null then raise exception 'Missing Pokrovskoye regional evidence'; end if;
 for p in select * from jsonb_to_recordset(${q(JSON.stringify(anna))}::jsonb) x(section text,place text,texts jsonb) loop
  base=jsonb_set(base,array['narrativeDescriptions'],coalesce(base->'narrativeDescriptions','{}'::jsonb)||jsonb_build_object(p.section,jsonb_build_object('status','reviewed','reviewedAt','2026-10-27','texts',p.texts)),true);
 end loop;
 update public.books set metadata=jsonb_set(metadata,array['geographicReview','regionalPlaces',idx::text],base,false) where id='anna-karenina';
end $nl_anna$;
select id,jsonb_object_length(metadata#>'{geographicReview,regionalPlaces,0,narrativeDescriptions}') as descriptions from public.books where id='anna-karenina';`;
// PostgreSQL has no jsonb_object_length; count the keys explicitly.
const fixedAnna=annaSql.replace("jsonb_object_length(metadata#>'{geographicReview,regionalPlaces,0,narrativeDescriptions}')","(select count(*) from jsonb_object_keys(metadata#>'{geographicReview,regionalPlaces,0,narrativeDescriptions}'))");
const areas=`with updated as (update public.place_descriptions set area='' where area in ('Historical geography','Petersburg; recalled, imagined or distant places','Spain, Mediterranean and narrated worlds','Geographical reference','Named geographical area','Real site') returning book_id) select book_id,count(*) as removed_generic_areas from updated group by book_id order by book_id;`;
fs.writeFileSync(__dirname+'/release/macondo.sql',macondoSql);fs.writeFileSync(__dirname+'/release/anna-regional.sql',fixedAnna);fs.writeFileSync(__dirname+'/release/generic-areas.sql',areas);
console.log('Prepared 11 Macondo contexts, 6 estate contexts and exact-match removal of generic area labels.');
