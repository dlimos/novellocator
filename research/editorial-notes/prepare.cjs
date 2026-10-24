const fs=require('node:fs'),crypto=require('node:crypto');
const before=JSON.parse(fs.readFileSync(__dirname+'/before.json'));
const sql=["begin;"], changes={books:[],sections:[],sources:[],references:[]}, translations=[];
const q=v=>"'"+String(v).replaceAll("'","''")+"'";
function translate(book,text,it,fr,es){for(const [language,translated] of Object.entries({en:text,it,fr,es}))translations.push({book,language,text,translated});return text;}
const gatsby=translate('gatsby',
 'Fictional buildings without a useful geographical location remain in the analysis and are excluded from the atlas. Documented real models and regional references are identified in their records.',
 'Gli edifici immaginari privi di una collocazione geografica utile restano nell’analisi e sono esclusi dall’atlante. I modelli reali documentati e i riferimenti regionali sono dichiarati nelle rispettive schede.',
 'Les bâtiments fictifs sans localisation géographique utile restent dans l’analyse et sont exclus de l’atlas. Les modèles réels documentés et les repères régionaux sont précisés dans leurs fiches.',
 'Los edificios ficticios sin una localización geográfica útil permanecen en el análisis y se excluyen del atlas. Los modelos reales documentados y las referencias regionales se indican en sus fichas.');
const faulkner=translate('sound-and-fury',
 'Oxford, Mississippi, is shown as the documented real model for fictional Jefferson. The marker locates Oxford, not Jefferson or its invented buildings. Mottson is represented only by its documented regional context. The appendix is a later text with documented differences.',
 'Oxford, Mississippi, è mostrata come modello reale documentato di Jefferson, città immaginaria. Il punto localizza Oxford, non Jefferson né i suoi edifici inventati. Mottson è rappresentata soltanto dal contesto regionale documentato. L’appendice è un testo successivo con differenze documentate.',
 'Oxford, dans le Mississippi, figure comme modèle réel documenté de Jefferson, ville fictive. Le point situe Oxford, sans localiser Jefferson ni ses bâtiments inventés. Mottson est représentée uniquement par son contexte régional documenté. L’appendice est un texte ultérieur présentant des différences documentées.',
 'Oxford, Misisipi, aparece como modelo real documentado de la ciudad ficticia de Jefferson. El punto sitúa Oxford, sin localizar Jefferson ni sus edificios inventados. Mottson se representa solo mediante su contexto regional documentado. El apéndice es un texto posterior con diferencias documentadas.');
const mobyFooter=translate('moby-dick',
 '<p>The legend counts distinct places visible in the current view, separately for action and mentions. Chapter–place records in the CSV count occurrences: a recurring place can appear in several chapters. Earlier inventory totals have been superseded by the narrative and visibility reviews.</p><p><a href="moby-dick-places-en.csv" download>Download chapter–place records (CSV)</a></p>',
 '<p>La legenda conta i luoghi distinti visibili nella vista corrente, separando azione e menzioni. Le schede capitolo–luogo nel CSV contano le occorrenze: un luogo ricorrente può comparire in più capitoli. I totali dei precedenti inventari sono superati dalle revisioni narrative e di visibilità.</p><p><a href="moby-dick-places-it.csv" download>Scarica le schede capitolo–luogo (CSV)</a></p>',
 '<p>La légende compte les lieux distincts visibles dans la vue actuelle, en séparant action et mentions. Les fiches chapitre–lieu du CSV comptent les occurrences : un lieu récurrent peut figurer dans plusieurs chapitres. Les totaux des anciens inventaires sont remplacés par les révisions narratives et de visibilité.</p><p><a href="moby-dick-places-fr.csv" download>Télécharger les fiches chapitre–lieu (CSV)</a></p>',
 '<p>La leyenda cuenta los lugares distintos visibles en la vista actual, separando acción y menciones. Las fichas capítulo–lugar del CSV cuentan las apariciones: un lugar recurrente puede figurar en varios capítulos. Los totales de inventarios anteriores quedan superados por las revisiones narrativas y de visibilidad.</p><p><a href="moby-dick-places-es.csv" download>Descargar las fichas capítulo–lugar (CSV)</a></p>');
const extraNotes={};
for(const b of before.books){
 const clauses=[],meta=b.metadata,own=before.sections.filter(s=>s.book_id===b.id),counts=new Map();
 for(const s of own){const note=s.metadata.note;if(note)counts.set(note,(counts.get(note)||0)+1);}
 // Remove only a common note used by every section with a note. Keep unique section cautions.
 const repeated=[...counts].filter(([,n])=>n>1&&n>=own.length-1&&counts.size===1).map(([n])=>n);
 for(const s of own)if(repeated.includes(s.metadata.note)){
  changes.sections.push({book:b.id,id:s.id,note:s.metadata.note});
 }
 for(const note of repeated)sql.push(`update public.sections set metadata=metadata-'note' where book_id=${q(b.id)} and metadata->>'note'=${q(note)};`);
 if(meta.geographicReview?.sectionNote)clauses.push(`metadata #- '{geographicReview,sectionNote}'`);
 let expression=clauses[0]||'metadata';
 let sidebar=meta.geographicReview?.sidebarNote||meta.sidebarNote;
 if(b.id==='gatsby')sidebar=gatsby;
 if(b.id==='sound-and-fury')sidebar=faulkner;
 if(['proust','war-and-peace'].includes(b.id)&&repeated.length)sidebar=repeated[0];
 if(sidebar!==meta.sidebarNote){expression=`jsonb_set(${expression},'{sidebarNote}',${q(JSON.stringify(sidebar))}::jsonb)`;extraNotes[b.id]=sidebar;}
 if(meta.geographicReview?.sidebarNote&&sidebar!==meta.geographicReview.sidebarNote)expression=`jsonb_set(${expression},'{geographicReview,sidebarNote}',${q(JSON.stringify(sidebar))}::jsonb)`;
 if(b.id==='moby-dick')expression=`jsonb_set(${expression},'{footerHtml}',${q(JSON.stringify(mobyFooter))}::jsonb)`;
 if(b.id==='gatsby'){
  const footer=translate('gatsby','<p><a href="gatsby-places-en.csv" download>Download location records (CSV)</a></p>','<p><a href="gatsby-places-it.csv" download>Scarica le schede dei luoghi (CSV)</a></p>','<p><a href="gatsby-places-fr.csv" download>Télécharger les fiches des lieux (CSV)</a></p>','<p><a href="gatsby-places-es.csv" download>Descargar las fichas de lugares (CSV)</a></p>');
  expression=`jsonb_set(${expression},'{footerHtml}',${q(JSON.stringify(footer))}::jsonb)`;
 }
 if(expression!=='metadata'){sql.push(`update public.books set metadata=${expression} where id=${q(b.id)};`);changes.books.push(b.id);}
}
// Full attribution makes the numbering unambiguously belong to the topographic source.
const dict={};const vm=require('node:vm');const ctx={window:{}};vm.runInNewContext(fs.readFileSync('docs/data/ulisse-i18n.js','utf8'),ctx);Object.assign(dict,ctx.window.atlasTranslations);
for(const s of before.sources.filter(s=>s.book_id==='ulisse'&&/^Gunn and Hart · maps? /.test(s.label))){
 const label=s.label.replace('Gunn and Hart · ','James Joyce’s Dublin (Gunn, Hart, Beck, 2022) · topographic ');
 changes.sources.push({id:s.id,old:s.label,label});
 const localized={it:'tavola topografica',fr:'carte topographique',es:'mapa topográfico'};
 const texts={};for(const lang of ['it','fr','es']){const old=dict[lang]?.[s.label]||s.label;const number=s.label.split(' · ')[1].replace(/^maps? /,'');texts[lang]=`James Joyce’s Dublin (Gunn, Hart, Beck, 2022) · ${localized[lang]} ${number}`;}
 translate('ulisse',label,texts.it,texts.fr,texts.es);
}
const scenePairs=[
 ['Reference on the carriage route reconstructed in map 11.', 'Reference on the carriage route reconstructed in topographic plate 11 of James Joyce’s Dublin (Gunn, Hart, Beck, 2022).', 'Riferimento del tragitto in carrozza ricostruito nella tavola topografica 11 di James Joyce’s Dublin (Gunn, Hart, Beck, 2022).', 'Repère du trajet en voiture reconstitué dans la carte topographique 11 de James Joyce’s Dublin (Gunn, Hart, Beck, 2022).', 'Referencia del trayecto en carruaje reconstruido en el mapa topográfico 11 de James Joyce’s Dublin (Gunn, Hart, Beck, 2022).'],
 ['Reference on the night-time return, reconstructed in map 32.', 'Reference on the night-time return, reconstructed in topographic plate 32 of James Joyce’s Dublin (Gunn, Hart, Beck, 2022).', 'Riferimento del ritorno notturno ricostruito nella tavola topografica 32 di James Joyce’s Dublin (Gunn, Hart, Beck, 2022).', 'Repère du retour nocturne reconstitué dans la carte topographique 32 de James Joyce’s Dublin (Gunn, Hart, Beck, 2022).', 'Referencia del regreso nocturno reconstruido en el mapa topográfico 32 de James Joyce’s Dublin (Gunn, Hart, Beck, 2022).']
];
for(const [old,text,it,fr,es]of scenePairs){translate('ulisse',text,it,fr,es);sql.push(`update public.place_references set scene_text=${q(text)} where book_id='ulisse' and scene_text=${q(old)};`);changes.references.push({old,text,count:before.place_references.filter(r=>r.book_id==='ulisse'&&r.scene_text===old).length});}
sql.push(`update public.sources set label=replace(label,'Gunn and Hart · ','James Joyce’s Dublin (Gunn, Hart, Beck, 2022) · topographic ') where book_id='ulisse' and label ~ '^Gunn and Hart · maps? ';`);
sql.push(`insert into public.content_translations(book_id,language,source_hash,source_text,translated_text) select 'ulisse',l.language,encode(sha256(convert_to(s.label,'UTF8')),'hex'),s.label,case when l.language='en' then s.label else 'James Joyce’s Dublin (Gunn, Hart, Beck, 2022) · '||l.term||' '||regexp_replace(s.label,'^.* · topographic maps? ','') end from public.sources s cross join (values('en','topographic map'),('it','tavola topografica'),('fr','carte topographique'),('es','mapa topográfico')) l(language,term) where s.book_id='ulisse' and s.label like 'James Joyce’s Dublin (Gunn, Hart, Beck, 2022) · topographic %' on conflict(book_id,language,source_hash) do update set source_text=excluded.source_text,translated_text=excluded.translated_text;`);
for(const tr of translations.filter(t=>!t.text.startsWith('James Joyce’s Dublin (Gunn, Hart, Beck, 2022) · '))){const hash=crypto.createHash('sha256').update(tr.text).digest('hex');sql.push(`insert into public.content_translations(book_id,language,source_hash,source_text,translated_text) values(${q(tr.book)},${q(tr.language)},${q(hash)},${q(tr.text)},${q(tr.translated)}) on conflict(book_id,language,source_hash) do update set source_text=excluded.source_text,translated_text=excluded.translated_text;`);}
sql.push('commit;',`select id,metadata->>'sidebarNote' as sidebar_note,metadata->>'footerHtml' as footer from public.books where id in ('gatsby','sound-and-fury','moby-dick');`);
fs.writeFileSync(__dirname+'/publish.sql',sql.join('\n')+'\n');fs.writeFileSync(__dirname+'/changes.json',JSON.stringify({...changes,translations},null,2));
console.log({books:changes.books.length,removedRepeatedNotes:changes.sections.length,sourceLabels:changes.sources.length,sceneReferences:changes.references,translations:translations.length,sqlBytes:sql.join('\n').length});
