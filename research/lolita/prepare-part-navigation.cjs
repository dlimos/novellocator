const fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const ctx={window:{}};for(const f of ['docs/data/lolita.js','docs/data/lolita-i18n.js','docs/supabase-data.js'])vm.runInNewContext(fs.readFileSync(f,'utf8'),ctx);
const d=ctx.window.atlasData,tr=ctx.window.atlasTranslations;
assert.equal(d.chapters.length,71);
const text1='Humbert enters the Haze household and draws Dolores into a journey marked by his manipulation and abuse.';
const text2='Across American roads and Beardsley, Humbert tries to maintain his control over Dolores. Their separation leads him to seek her out and pursue Quilty.';
const strings={
 'Part I':['Part I','Parte I','Partie I','Parte I'],
 'Part II':['Part II','Parte II','Partie II','Parte II'],
 [text1]:[text1,'Humbert entra nella casa degli Haze e trascina Dolores in un viaggio segnato dalla sua manipolazione e dai suoi abusi.','Humbert entre dans la maison des Haze et entraîne Dolores dans un voyage marqué par ses manipulations et ses abus.','Humbert entra en la casa de los Haze y arrastra a Dolores a un viaje marcado por su manipulación y sus abusos.'],
 [text2]:[text2,'Tra le strade americane e Beardsley, Humbert cerca di mantenere il controllo su Dolores. La loro separazione lo spinge a cercarla e a inseguire Quilty.','Sur les routes américaines et à Beardsley, Humbert tente de maintenir son emprise sur Dolores. Leur séparation le pousse à la rechercher et à poursuivre Quilty.','Entre las carreteras estadounidenses y Beardsley, Humbert intenta mantener su control sobre Dolores. Su separación lo lleva a buscarla y a perseguir a Quilty.']
};
for(const [key,values]of Object.entries(strings))for(const [i,lang]of ['en','it','fr','es'].entries())tr[lang][key]=values[i];
d.book.sectionGrouping={unit:'section',hashPrefix:'section',groups:[
 {id:1,title:d.chapters[0].title,text:d.chapters[0].text,firstSection:1,lastSection:1},
 {id:2,title:'Part I',text:text1,firstSection:2,lastSection:34},
 {id:3,title:'Part II',text:text2,firstSection:35,lastSection:70},
 {id:4,title:d.chapters[70].title,text:d.chapters[70].text,firstSection:71,lastSection:71}
]};
const grouped=ctx.window.atlasSupabaseData.groupSections(d);
assert.equal(grouped.chapters.length,4);assert.deepEqual(Array.from(grouped.chapters,c=>c.sourceSectionIds.length),[1,33,36,1]);
assert.equal(grouped.sourceChapters,d.chapters);
assert.equal(new Set(grouped.chapters.flatMap(c=>c.sourceSectionIds)).size,71);
for(const c of grouped.chapters){assert.equal(new Set(c.places).size,c.places.length);for(const id of c.places){const occurrences=c.placeOccurrences[id];assert.ok(occurrences.length);const action=occurrences.find(r=>r.category==='action');assert.equal(c.placeCategories[id],action?'action':'mentioned');if(action)assert.equal(c.placeSources[id],action.source);}for(const lang of ['en','it','fr','es'])assert.ok(tr[lang][c.text]);}
const q=v=>"E'"+String(v).replaceAll('\\','\\\\').replaceAll("'","''").replaceAll('\r','\\r').replaceAll('\n','\\n')+"'";
const rows=Object.entries(strings).flatMap(([key,values])=>['en','it','fr','es'].map((lang,i)=>`('lolita',${q(lang)},${q(crypto.createHash('sha256').update(key).digest('hex'))},${q(key)},${q(values[i])})`));
const sql=`begin;\nupdate public.books set metadata=metadata||jsonb_build_object('sectionGrouping',${q(JSON.stringify(d.book.sectionGrouping))}::jsonb) where id='lolita';\ninsert into public.content_translations(book_id,language,source_hash,source_text,translated_text) values\n${rows.join(',\n')}\non conflict(book_id,language,source_hash) do update set translated_text=excluded.translated_text;\ncommit;\nselect id,jsonb_array_length(metadata->'sectionGrouping'->'groups') as navigation_sections,(select count(*) from public.sections where book_id='lolita') as preserved_source_sections from public.books where id='lolita';\n`;
fs.mkdirSync('database/generated/lolita/parts',{recursive:true});fs.writeFileSync('database/generated/lolita/parts/publish.sql',sql);
fs.writeFileSync('docs/data/lolita.js','window.atlasData='+JSON.stringify(d,null,2)+';\n');fs.writeFileSync('docs/data/lolita-i18n.js','window.atlasTranslations='+JSON.stringify(tr,null,2)+';\n');
fs.writeFileSync('research/lolita/part-navigation.json',JSON.stringify({navigationSections:4,sourceSections:71,groups:d.book.sectionGrouping.groups,chapterReferences:'preserved in sourceChapters and placeOccurrences',languages:['en','it','fr','es']},null,2)+'\n');
console.log('PASS: four navigation sections, both parts merged, all 71 source sections and occurrence references preserved, four-language introductions.');
