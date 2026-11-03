// Complete the four geographical records still shown by the deployed renderer.
const fs=require('fs'),assert=require('assert/strict'),crypto=require('crypto');
const dir='work/lolita-final-review/',before=JSON.parse(fs.readFileSync(dir+'live-main-release.json')),after=structuredClone(before);
const hash=s=>crypto.createHash('sha256').update(s).digest('hex'),q=s=>"'"+s.replaceAll("'","''")+"'",j=x=>q(JSON.stringify(x))+'::jsonb';
const sourceId=hash('lolita-afterword-image-witness-208-212'),rightsId=hash('lolita-final-critical-quotation-review-2026-11-02');
const places=[
 ['America','It had taken me some forty years to invent Russia and Western Europe, and now I was faced by the task of inventing America.','America',[
 'Nabokov discusses inventing America as a literary setting, contrasting it with his earlier fictional worlds.',
 'Nabokov riflette sull’invenzione letteraria dell’America, confrontandola con i mondi dei suoi romanzi precedenti.',
 'Nabokov réfléchit à l’invention littéraire de l’Amérique, en la comparant aux mondes de ses romans antérieurs.',
 'Nabokov reflexiona sobre la invención literaria de América, comparándola con los mundos de sus novelas anteriores.']],
 ['Europe','It had taken me some forty years to invent Russia and Western Europe, and now I was faced by the task of inventing America.','Western Europe',[
 'Western Europe belongs to the literary worlds Nabokov says he had spent decades creating; this is an essayistic comparison, not a journey.',
 'L’Europa occidentale appartiene ai mondi letterari che Nabokov racconta di aver costruito per decenni: è un confronto saggistico, non un viaggio.',
 'L’Europe occidentale appartient aux mondes littéraires que Nabokov dit avoir construits pendant des décennies : c’est une comparaison critique, non un voyage.',
 'Europa occidental pertenece a los mundos literarios que Nabokov afirma haber construido durante décadas: es una comparación ensayística, no un viaje.']],
 ['Harvard','Every summer my wife and I go butterfly hunting. The specimens are deposited at scientific institutions, such as the Museum of Comparative Zoology at Harvard or the Cornell University collection.','Museum of Comparative Zoology at Harvard',[
 'Nabokov names Harvard’s Museum of Comparative Zoology as a repository for butterfly specimens; he does not narrate a museum visit here.',
 'Nabokov indica il Museum of Comparative Zoology di Harvard fra i depositi dei suoi esemplari di farfalle; qui non narra una visita al museo.',
 'Nabokov cite le Museum of Comparative Zoology de Harvard parmi les lieux de dépôt de ses papillons ; il ne raconte pas ici de visite au musée.',
 'Nabokov cita el Museum of Comparative Zoology de Harvard como depósito de sus ejemplares de mariposas; aquí no narra una visita al museo.']],
 ['Cornell','Every summer my wife and I go butterfly hunting. The specimens are deposited at scientific institutions, such as the Museum of Comparative Zoology at Harvard or the Cornell University collection.','Cornell University collection',[
 'The Cornell University collection is named as a repository for butterfly specimens, within Nabokov’s account of summer fieldwork and writing.',
 'La collezione della Cornell University è nominata come deposito degli esemplari di farfalle, nel racconto delle ricerche estive e della scrittura.',
 'La collection de Cornell University est citée comme dépôt des papillons, dans le récit des recherches estivales et de l’écriture.',
 'La colección de Cornell University se cita como depósito de ejemplares de mariposas, al hablar de las investigaciones estivales y la escritura.']]
];
let sql='begin;\n';const newRows=[];
for(const [name,quote,term,values]of places){
 const old=before.tables.unlocated_settings.find(r=>r.section_id===71&&r.name===name);assert(old&&!old.quote.trim());
 const row=after.tables.unlocated_settings.find(r=>r.section_id===71&&r.name===name),attribution='Vladimir Nabokov · Lolita · On a book entitled Lolita (dated 12 November 1956) · digital image witness, publisher and edition date not stated · viewer p. 209 (printed p. 208)';
 row.description=values[0];row.quote=quote;row.source_id=sourceId;
 row.metadata={...row.metadata,category:'mentioned',language:'en',type:'original',attribution,highlightMode:'explicit',highlightTerms:[term],verificationStatus:'verified',quotationStatus:'reviewed-critical-use',analysisStatus:'original-context-reviewed',reviewedAt:'2026-11-02',sourcePages:[209],sourceEdition:'identified-image-witness-imprint-not-stated',verificationNote:values[0],criticalPurpose:'Distinguish the geographical reference in the author’s essay from an enacted fictional scene.',necessity:'The two brief autobiographical or essayistic sentences establish the reference and its function; no further text is required.'};
 sql+=`do $g$ begin if not exists(select 1 from unlocated_settings r where book_id='lolita' and section_id=71 and ordinal=${old.ordinal} and (to_jsonb(r) @> ${j({quote:old.quote,metadata:old.metadata})} or to_jsonb(r) @> ${j({quote:row.quote,metadata:row.metadata})})) then raise exception 'Changed afterword source';end if;end $g$;\n`;
 sql+=`update public.unlocated_settings set description=${q(row.description)},quote=${q(quote)},source_id=${q(sourceId)},metadata=${j(row.metadata)} where book_id='lolita' and section_id=71 and ordinal=${old.ordinal};\n`;
 for(const [i,language]of ['it','fr','es'].entries()){
  const tr={book_id:'lolita',language,source_hash:hash(values[0]),source_text:values[0],translated_text:values[i+1]};newRows.push(tr);
  sql+=`insert into public.content_translations(book_id,language,source_hash,source_text,translated_text) values(${Object.values(tr).map(q).join(',')}) on conflict(book_id,language,source_hash) do update set translated_text=excluded.translated_text;\n`;
 }
}
after.tables.content_translations.push(...newRows);
const oldBook=before.tables.books[0].metadata,book=after.tables.books[0].metadata;
Object.assign(book.finalGeographicalReview,{readerFacingAssociations:459,readerFacingUnlocatedAssociations:101,readerFacingOriginalEvidenceGaps:0});
book.quotationReview.mappedAndVisibleUnlocatedAssociations=459;
sql+=`do $g$ begin if not exists(select 1 from public.books where id='lolita' and (metadata->'finalGeographicalReview'=${j(oldBook.finalGeographicalReview)} or metadata->'finalGeographicalReview'=${j(book.finalGeographicalReview)})) then raise exception 'Changed Lolita metadata';end if;end $g$;\n`;
// Only the two count paths and the review summary change; preserve other metadata.
sql+=`update public.books set metadata=jsonb_set(jsonb_set(metadata,'{finalGeographicalReview}',${j(book.finalGeographicalReview)}),'{quotationReview,mappedAndVisibleUnlocatedAssociations}','459'::jsonb) where id='lolita';\ncommit;\nselect count(*) as afterword_records_with_originals from public.unlocated_settings where book_id='lolita' and section_id=71 and name in ('America','Europe','Harvard','Cornell') and length(quote)>0;\n`;
const four=after.tables.unlocated_settings.filter(r=>r.section_id===71&&places.some(p=>p[0]===r.name));
sql+=`-- READER_VERIFICATION_ONLY\nwith wanted as(select value r from jsonb_array_elements(${j(four)})), wanted_translations as(select value r from jsonb_array_elements(${j(newRows)})) select (select count(*) from wanted w join unlocated_settings u on u.book_id='lolita' and u.section_id=71 and u.ordinal=(w.r->>'ordinal')::integer and to_jsonb(u) @> w.r) as exact_original_records,(select count(*) from wanted_translations w join content_translations c on c.book_id='lolita' and c.language=w.r->>'language' and c.source_hash=w.r->>'source_hash' and to_jsonb(c) @> w.r) as exact_editorial_translations,(select metadata->'finalGeographicalReview'->>'readerFacingAssociations' from books where id='lolita') as reader_facing_associations,(select metadata->'finalGeographicalReview'=${j(book.finalGeographicalReview)} from books where id='lolita') as review_metadata_exact;\n`;
fs.writeFileSync(dir+'afterword-reader.sql',sql);
fs.writeFileSync(dir+'reader-expected.json',JSON.stringify(after,null,2));
const manifest=JSON.parse(fs.readFileSync(dir+'transfer-manifest.json'));manifest.files=manifest.files.filter(f=>f!=='afterword-reader.sql');manifest.additionalFiles=['afterword-reader.sql'];fs.writeFileSync(dir+'transfer-manifest.json',JSON.stringify(manifest,null,2));
console.log('Prepared four reader-facing originals; SQL bytes',Buffer.byteLength(sql));
