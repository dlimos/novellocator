const fs=require('node:fs'),crypto=require('node:crypto');
const dir=__dirname,metadata=JSON.parse(fs.readFileSync(dir+'/metadata.json')),translations=JSON.parse(fs.readFileSync(dir+'/translations.json')),patch=JSON.parse(fs.readFileSync(dir+'/macondo-patch.json'));
const literal=value=>"'"+JSON.stringify(value).replaceAll("'","''")+"'::jsonb";
const str=value=>"'"+value.replaceAll("'","''")+"'";
const statements=['-- Reviewed regional positions and atlas visibility. Original text tables are untouched.','begin;','set local standard_conforming_strings = on;'];
for(const [id,review]of Object.entries(metadata))statements.push(`update public.books set metadata=coalesce(metadata,'{}'::jsonb)||jsonb_build_object('geographicReview',${literal(review)}) where id=${str(id)};`);
statements.push(`update public.book_maps set metadata=jsonb_set(metadata,'{illustratedAtlas,geographicReview}',${literal(patch.geographicReview)}) where book_id='macondo' and id='reading-map';`);
statements.push(`update public.book_maps set metadata=jsonb_set(metadata,'{illustratedAtlas,geographicPlaces,regional-town}',${literal(patch.geographical)}) where book_id='macondo' and id='reading-map';`);
statements.push(`update public.book_maps set metadata=case
 when jsonb_typeof(metadata#>'{illustratedAtlas,placeBatches}')='object' then jsonb_set(metadata,'{illustratedAtlas,placeBatches,999-geographical-review}',${literal([patch.place])})
 when exists(select 1 from jsonb_array_elements(metadata#>'{illustratedAtlas,places}') p where p->>'id'='regional-town') then metadata
 else jsonb_set(metadata,'{illustratedAtlas,places}',(metadata#>'{illustratedAtlas,places}')||${literal([patch.place])}) end
 where book_id='macondo' and id='reading-map';`);
const rows=[];
for(const [id,languages]of Object.entries(translations))for(const [lang,messages]of Object.entries(languages))for(const [source,target]of Object.entries(messages))rows.push('('+[id,lang,crypto.createHash('sha256').update(source).digest('hex'),source,target].map(str).join(',')+')');
statements.push('insert into public.content_translations(book_id,language,source_hash,source_text,translated_text) values\n'+rows.join(',\n')+'\non conflict(book_id,language,source_hash) do update set translated_text=excluded.translated_text;');
statements.push('commit;');
statements.push("select id,jsonb_array_length(metadata->'geographicReview'->'regionalPlaces') as regional_places,jsonb_array_length(metadata->'geographicReview'->'hiddenUnlocatedKeys') as hidden_keys from public.books where metadata?'geographicReview' order by id;");
fs.writeFileSync(dir+'/publish.sql',statements.join('\n\n')+'\n');
console.log(rows.length+' translation rows; '+Buffer.byteLength(statements.join('\n\n'))+' SQL bytes; additive metadata update, no original quotations changed.');
