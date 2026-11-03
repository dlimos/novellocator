// Requires the private, individually collated source selections in work/.
// Does not download or redistribute the complete novel or image witness.
const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict'),vm=require('node:vm');
const dir='work/lolita-final-review/',out='research/lolita/';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const before=read(dir+'live-before.json'),after=structuredClone(before),t=after.tables;
const sections=read('work/lolita-quotes/native-sections.json'),sectionAnalysis=read(out+'section-analysis.json').sections;
const oldAudit=read(out+'pdf-quotation-review.json'),imageManifest=read(out+'page-manifest.json'),actionAudit=read(out+'whole-book-review.json').sections;
const curated=read(dir+'curated.json'),afterword=read(dir+'afterword.json');
const inventory=read(dir+'visible-inventory.json'),records=[];
const book=t.books[0],review=book.metadata.geographicReview;
const stamp='2026-11-02',recordUrl='https://github.com/dlimos/novellocator/blob/docs/research/lolita/FINAL-REVIEW.md';
const rightsId=hash('lolita-final-critical-quotation-review-'+stamp),textId=hash('lolita-afterword-image-witness-208-212');
const rightSource={book_id:'lolita',id:rightsId,url:'https://www.bandistapp.it/norma/l-1941-633/art-70',label:'Lolita · geographical criticism · individual and aggregate quotation review',metadata:{publicDomainClaim:false,basis:'critical discussion of narrative geography',reviewedAt:stamp,analysisRecord:recordUrl,translationRights:'No translated literary passages are distributed.'}};
const afterwordSource={book_id:'lolita',id:textId,url:recordUrl,label:'Vladimir Nabokov · Lolita · On a book entitled Lolita · English digital image witness',metadata:{kind:'bibliographical-record',author:'Vladimir Nabokov',title:'Lolita',section:'On a book entitled Lolita',originalLanguage:'en',authorialEssayDate:'1956-11-12',publisher:null,editionYear:null,editionStatus:'identified-digital-witness-imprint-not-stated',viewerPages:[208,209,210,211,212],printedPages:[207,208,209,210,211],sourceConsulted:read(out+'section-analysis.json').selectedSource,verification:'manual-transcription-collated-with-all-five-page-images',pageImages:imageManifest.filter(p=>p.page>=208&&p.page<=212)}};
t.sources.push(rightSource,afterwordSource);
const pdfPages=read('work/lolita-roadtrip/pdf-pages.json');
const joined=pdfPages.map(p=>p.text+'\n').join(''),normalized=joined.replace(/\s+/g,' '),pageOffsets=[];
let offset=0;for(const p of pdfPages){pageOffsets.push({page:p.page,start:joined.slice(0,offset).replace(/\s+/g,' ').length});offset+=p.text.length+1;}
function pagesFor(s,parts){const global=normalized.indexOf(s.text.slice(0,100));assert(global>=0);return [...new Set(parts.flatMap(p=>[global+p.start,global+p.end-1].map(at=>pageOffsets.filter(p=>p.start<=at).at(-1).page)))].sort((a,b)=>a-b);}
function texts(values){return Object.fromEntries(['en','it','fr','es'].map((l,i)=>[l,values[i]]));}
function translate(en,values){for(const [language,translated_text]of Object.entries(values))if(language!=='en'){const source_hash=hash(en),r=t.content_translations.find(r=>r.language===language&&r.source_hash===source_hash);const row={book_id:'lolita',language,source_hash,source_text:en,translated_text};if(r)Object.assign(r,row);else t.content_translations.push(row);}}
function passage(r){
 let base,quote,pages,proof,attribution;
 const original=inventory.find(x=>x.section===r.section&&x.id===r.id);
 const ref=t.place_references.find(x=>x.section_id===r.section&&x.place_id===r.id);
 const old=ref&&t.excerpts.find(e=>e.reference_id===ref.id);
 const region=review.regionalPlaces.find(x=>x.id===r.id);
 const oldRegional=region?.sectionOccurrences?.[r.section]?.excerpt?.original;
 base=old?{...old.metadata,language:'en',type:'original'}:{...oldRegional,language:'en',type:'original'};
 if(r.sectionId==='afterword'){
  quote=r.quote;pages=r.pages;proof={imagePages:pages,imageSha256:imageManifest.filter(p=>pages.includes(p.page)).map(p=>({page:p.page,sha256:p.sha256})),collation:'manual-image-comparison'};
  attribution=`Vladimir Nabokov · Lolita · On a book entitled Lolita (dated 12 November 1956) · digital image witness, publisher and edition date not stated · viewer p. ${pages.join(', ')} (printed p. ${pages.map(p=>p-1).join(', ')})`;
 }else{
  const s=sections.find(s=>s.id===r.sectionId);assert(s);
  quote=r.proposed;pages=pagesFor(s,r.parts);
  proof={pdfSha256:oldAudit.source.sha256,parts:r.parts.map(p=>({start:p.start,end:p.end,sha256:hash(s.text.slice(p.start,p.end))}))};
  for(const part of r.parts)assert(quote.includes(s.text.slice(part.start,part.end)),'non-native quotation');
  attribution=`Vladimir Nabokov · Lolita · ${r.sectionId==='foreword'?'Foreword':`Part ${r.sectionId.split('.')[0]} · Chapter ${r.sectionId.split('.')[1]}`} · digital copy, publisher and date not stated · PDF p. ${pages.join(', ')}`;
 }
 const candidates=r.terms||[];let terms=candidates.filter(term=>quote.toLocaleLowerCase('en').includes(term.toLocaleLowerCase('en')));
 if(!terms.length)terms=(original?.terms||[]).filter(term=>quote.toLowerCase().includes(term.toLowerCase()));
 if(!terms.length){const named=(region?.place.aliases||[]).find(term=>quote.toLowerCase().includes(term.toLowerCase()));if(named)terms=[named];}
 const indirect={
  '1.2:regional-riviera':['rose garden','Riviera'],'1.3:regional-riviera':['beach'],'1.4:regional-riviera':['mimosa grove'],
  '1.10:regional-ramsdale':['Mrs. Haze'],'1.11:regional-ramsdale':['Haze house'],'1.13:regional-ramsdale':['sofa'],
  '1.14:regional-ramsdale':['plate'],'1.15:regional-ramsdale':['phone'],'1.16:regional-ramsdale':['room'],
  '1.17:regional-ramsdale':['lawn'],'1.18:regional-ramsdale':['furniture'],'1.19:regional-ramsdale':['bedroom'],
  '1.21:regional-ramsdale':['studio'],'1.22:regional-ramsdale':['homeward'],'1.23:regional-ramsdale':['street'],
  '1.28:regional-briceland':['lobby'],'1.29:regional-briceland':['bedroom'],'2.4:regional-beardsley':['school'],'2.5:regional-beardsley':['living room window'],
  '2.6:regional-beardsley':['board'],'2.7:regional-beardsley':['Treasure Island'],'2.8:regional-beardsley':['campus'],
  '2.9:regional-beardsley':['Mona'],'2.10:regional-beardsley':['homework'],'2.11:regional-beardsley':['Pratt'],
  '2.12:regional-beardsley':['bronchitis'],'2.21:regional-champion':['terrace'],'2.27:new-york':['flat'],
  '2.29:regional-coalmont':['bell button'],
 };
 if(!terms.length)terms=(indirect[r.sectionId+':'+r.id]||[]).filter(term=>quote.toLowerCase().includes(term.toLowerCase()));
 assert(terms.length,r.sectionId+'/'+r.id+': authentic highlight missing');
 const notes=sectionAnalysis.find(s=>s.id===r.sectionId);assert(notes?.fullSectionRead);
 const actionReason=actionAudit.find(s=>s.id===r.sectionId)?.reviewedActionPlaces?.find(p=>p.placeId===r.id)?.reason;
 const reason=r.reason||(r.category==='action'?(actionReason||ref?.metadata.narrativeReview?.reason):null)||notes.locationAnalysis;
 const contextEstablished=!terms.some(term=>(region?.place.aliases||[r.name||r.id]).some(name=>name.toLowerCase()===term.toLowerCase()));
 const value={...base,quote,language:'en',type:'original',attribution,highlightTerms:terms,highlightMode:'explicit',verificationStatus:'verified',quotationStatus:'reviewed-critical-use',analysisStatus:'original-context-reviewed',narrativeCategory:r.category,verificationNote:reason,reviewedAt:stamp,sourcePages:pages,sourceEdition:r.sectionId==='afterword'?'identified-image-witness-imprint-not-stated':'identified-digital-copy-imprint-not-stated',contextEstablished,criticalPurpose:`Discuss the geographical role of ${r.name||r.id} in ${r.sectionId}; distinguish an enacted scene from a reference, comparison or report.`,necessity:'The geographical wording and enough surrounding syntax are retained to make the reference intelligible and assess its narrative category. Unrelated clauses are omitted visibly.',evidence:proof};
 delete value.url;delete value.rightsUrl;
 if(r.sectionId!=='afterword'){value.sourcePdfPages=pages;value.sourcePdfSha256=oldAudit.source.sha256;}
 const description={status:'reviewed',reviewedAt:stamp,context:r.texts?'editorial':'authentic-quotation',texts:r.texts||{},evidence:{section:r.sectionId,quoteSha256:hash(quote),sourcePages:pages}};
 if(r.texts)translate(r.texts.en,r.texts);
 const source={url:recordUrl,label:attribution};
 if(ref){
  let excerpt=t.excerpts.find(e=>e.reference_id===ref.id&&e.slot==='original');
  const fields={book_id:'lolita',id:ref.id+':original',section_id:r.section,reference_id:ref.id,slot:'original',language:'en',type:'original',quote,attribution,text_source_id:r.sectionId==='afterword'?textId:(old?.text_source_id||t.sources.find(s=>s.metadata.sourceFile==='Lolita-Vladimir-Nabokov.pdf').id),rights_source_id:rightsId,metadata:Object.fromEntries(Object.entries(value).filter(([k])=>!['quote','attribution','language','type'].includes(k)))};
  if(excerpt)Object.assign(excerpt,fields);else t.excerpts.push(fields);
  ref.scene_text=r.texts?.en||ref.metadata.narrativeDescription?.texts?.en||'';
  ref.metadata={...ref.metadata,narrativeDescription:description,narrativeReview:{...(ref.metadata.narrativeReview||{}),reviewedAt:stamp,category:r.category,reason,originalSection:r.sectionId,evidence:proof}};
  if(r.sectionId==='afterword')ref.source_id=textId;
 }else{
  assert(region,'region missing '+r.id);
  (region.sectionOccurrences??={})[r.section]={...(region.sectionOccurrences?.[r.section]||{}),category:r.category,scene:r.texts?.en||region.sectionOccurrences?.[r.section]?.scene||'',source,excerpt:{original:value,translations:{}},narrativeReview:{reviewedAt:stamp,reason,originalSection:r.sectionId,evidence:proof}};
 }
 records.push({section:r.sectionId,sectionNumber:r.section,placeId:r.id,category:r.category,quoteSha256:hash(quote),words:quote.replaceAll('[…]','').trim().split(/\s+/).length,pages,evidence:proof,reason,translationCoverage:{en:'verified-original',it:'verified-original-fallback; translation-not-available',fr:'verified-original-fallback; translation-not-available',es:'verified-original-fallback; translation-not-available'}});
}
for(const r of [...curated,...afterword])passage(r);
// The selected PDF does contain the Mirana comparison in I.21. Keep it a mention.
function nativeAddition(sectionId,id,start,end,terms,values,reason,category='mentioned'){
 const s=sections.find(s=>s.id===sectionId),a=s.text.indexOf(start),b=s.text.indexOf(end,a);assert(a>=0&&b>=a);
 const section=t.sections.find(s=>s.metadata.originalSectionId===sectionId).id;
 passage({sectionId,section,id,category,terms,proposed:s.text.slice(a,b+end.length),parts:[{start:a,end:b+end.length}],texts:texts(values),reason});
}
nativeAddition('1.21','regional-riviera','I swallowed my spoonful','We two are not going to England."',['Mirana Hotel'],[
 'During the dispute over a proposed English holiday, Humbert contrasts the paper napkin with the linens of his childhood Mirana Hotel. The comparison recalls the Riviera; the scene itself remains at Ramsdale.',
 'Durante la disputa sul viaggio in Inghilterra, Humbert contrappone il tovagliolo di carta alla biancheria del Mirana Hotel della sua infanzia. Il paragone richiama la Riviera; la scena resta a Ramsdale.',
 'Pendant la dispute sur le voyage en Angleterre, Humbert oppose la serviette en papier au linge du Mirana Hotel de son enfance. La comparaison rappelle la Riviera ; la scène reste à Ramsdale.',
 'Durante la disputa sobre el viaje a Inglaterra, Humbert contrasta la servilleta de papel con la mantelería del Mirana Hotel de su infancia. La comparación evoca la Riviera; la escena sigue en Ramsdale.'
], 'Il richiamo alla biancheria del Mirana è un confronto nella scena di Ramsdale. Il rapporto con la Riviera è stabilito da I.2; non si aggiunge il nome Riviera al testo e non si promuove il ricordo ad azione.');
nativeAddition('1.30','regional-briceland','had I been a painter,','There would have been an arbor in flameflower.',['The Enchanted Hunters'],[
 'Humbert imagines decorating the Enchanted Hunters with murals of his own making. The hotel is invoked in a hypothetical commission, not revisited in a new scene.',
 'Humbert immagina di decorare l’Enchanted Hunters con proprie pitture murali. L’albergo è richiamato per una commissione ipotetica, senza una nuova scena di visita.',
 'Humbert imagine décorer l’Enchanted Hunters de ses propres peintures murales. L’hôtel apparaît dans une commande hypothétique, sans nouvelle scène de visite.',
 'Humbert imagina decorar el Enchanted Hunters con sus propios murales. El hotel aparece en un encargo hipotético, sin una nueva escena de visita.'
], 'Il periodo ipotetico presenta una commissione mai realizzata. Briceland è il contesto geografico dell’albergo identificato in I.27–29; questa associazione è mentioned.');
nativeAddition('2.17','regional-ramsdale','I was now glad I had it with me','for proof--only a little iridescent fluff.',['pine forest','glass lake'],[
 'At the Kasbeam motel Humbert recalls learning to shoot with Farlow in the woods around Hourglass Lake. The recalled shooting scene belongs to the Ramsdale surroundings established in Part I.',
 'Nel motel di Kasbeam Humbert ricorda le esercitazioni con Farlow nei boschi intorno a Hourglass Lake. La scena ricordata appartiene ai dintorni di Ramsdale stabiliti nella prima parte.',
 'Au motel de Kasbeam, Humbert se rappelle avoir appris à tirer avec Farlow dans les bois autour de Hourglass Lake. La scène remémorée appartient aux environs de Ramsdale établis dans la première partie.',
 'En el motel de Kasbeam, Humbert recuerda las prácticas de tiro con Farlow en los bosques de Hourglass Lake. La escena recordada pertenece a los alrededores de Ramsdale establecidos en la primera parte.'
], 'Il ricordo narra Farlow che mira e colpisce un uccello nel bosco, non soltanto il fatto che vi abbia soggiornato. Hourglass Lake è collocato a poche miglia da Ramsdale in I.20. La scena presente resta a Kasbeam; il livello di questa associazione è il ricordo.', 'action');
// Distinguish the state from the city in the childhood map and writing chronology.
const ny=read(dir+'new-york-census.json'),paths=ny.data.features[0].geometry.rings;
assert.equal(ny.data.features[0].attributes.NAME,'New York');
const geoId=hash(ny.url);t.sources.push({book_id:'lolita',id:geoId,url:ny.url,label:'US Census Bureau · New York state boundary (2020)',metadata:{sourceVintage:2020,generalizationDegrees:0.02}});
t.places.push({book_id:'lolita',id:'new-york-state',latitude:42.9,longitude:-75.6});
const nyTexts=texts(['New York State','Stato di New York','État de New York','Estado de Nueva York']);translate(nyTexts.en,nyTexts);
t.place_descriptions.push({book_id:'lolita',place_id:'new-york-state',collection:'core',name:nyTexts.en,area:'United States',kind:'area',zoom:6,checked:stamp,status:'Documented state · not New York City',note:'The outline identifies New York State. No city scene or precise address is inferred.',method:'US Census 2020 state boundary, generalized to 0.02 degrees.',position_source_id:geoId,narrative_source_id:null,additional_source_id:null,metadata:{aliases:['New York'],regionalOutline:{paths,label:nyTexts.en,labelAnchor:paths.flat().reduce((a,p)=>p[1]>a[1]?p:a),sourceVintage:2020,generalizationDegrees:0.02,scope:'documented-state-not-city'}}});
for(const r of t.place_references.filter(r=>r.place_id==='new-york'&&[50,71].includes(r.section_id))){
 r.place_id='new-york-state';r.metadata.geographicalCorrection={previousPlaceId:'new-york',reason:'The original means the state, not New York City.',reviewedAt:stamp};
 const a=records.find(a=>a.sectionNumber===r.section_id&&a.placeId==='new-york');a.placeId='new-york-state';
}
// I.11 says Petersburg, Fla.; it must never inherit the Russian city's point.
const petersburg=review.regionalPlaces.find(r=>r.id==='st-petersburg');
assert.deepEqual(Object.keys(petersburg.sectionOccurrences),['12']);
const fl=read(dir+'florida-census.json'),flPaths=fl.data.features[0].geometry.rings,flSourceId=hash(fl.url);
t.sources.push({book_id:'lolita',id:flSourceId,url:fl.url,label:'US Census Bureau · Florida state boundary (2020)',metadata:{sourceVintage:2020,generalizationDegrees:0.02}});
petersburg.id='petersburg-florida-reference';
const flName=texts(['Petersburg, Fla. · regional reference','Petersburg, Fla. · riferimento regionale','Petersburg, Fla. · référence régionale','Petersburg, Fla. · referencia regional']);translate(flName.en,flName);
const flNote=texts(['The narrator explicitly writes Petersburg, Fla. The outline identifies Florida only; neither the Russian city nor an exact Floridian city or historical honeymoon is established.',
 'Il narratore scrive esplicitamente Petersburg, Fla. Il contorno indica soltanto la Florida; non dimostra la città russa, una precisa città della Florida o la verità storica del viaggio di nozze.',
 'Le narrateur écrit explicitement Petersburg, Fla. Le contour indique uniquement la Floride ; il n’établit ni la ville russe, ni une ville précise de Floride, ni la vérité historique du voyage de noces.',
 'El narrador escribe expresamente Petersburg, Fla. El contorno indica solo Florida; no establece la ciudad rusa, una ciudad concreta de Florida ni la verdad histórica del viaje de novios.']);translate(flNote.en,flNote);
const flScene=texts(['In the diary Humbert mentions a honeymoon of Edgar Allan Poe and Virginia at Petersburg, Fla. This is the narrator’s biographical claim, not a narrated scene or an independently established historical fact.',
 'Nel diario Humbert menziona un viaggio di nozze di Edgar Allan Poe e Virginia a Petersburg, Fla. È una notizia biografica del narratore, non una scena né un fatto storico verificato autonomamente.',
 'Dans le journal, Humbert mentionne un voyage de noces d’Edgar Allan Poe et Virginia à Petersburg, Fla. C’est une affirmation biographique du narrateur, non une scène ou un fait historique vérifié indépendamment.',
 'En el diario Humbert menciona un viaje de novios de Edgar Allan Poe y Virginia a Petersburg, Fla. Es una afirmación biográfica del narrador, no una escena ni un hecho histórico comprobado de forma independiente.']);translate(flScene.en,flScene);
const florida=t.places.find(p=>p.id==='florida');
Object.assign(petersburg.place,{name:flName.en,area:'Florida',coords:[florida.latitude,florida.longitude],kind:'uncertain',aliases:['Petersburg'],note:flNote.en,method:'US Census 2020 state boundary, generalized to 0.02 degrees; the precise city is not established.',status:'Textual regional reference · precise city unresolved',checked:stamp,analysisStatus:'geographical-reference-reviewed',positionSource:{url:fl.url,label:'US Census Bureau · Florida state boundary (2020)'},narrativeSource:{url:recordUrl,label:'Vladimir Nabokov · Lolita · Part I, chapter 11'},regionalOutline:{paths:flPaths,label:flName.en,labelAnchor:flPaths.flat().reduce((a,p)=>p[1]>a[1]?p:a),sourceVintage:2020,generalizationDegrees:0.02,scope:'literal-state-reference-not-an-identified-city'}});
petersburg.sectionOccurrences[12].scene=flScene.en;
petersburg.sectionOccurrences[12].excerpt.original.criticalPurpose='Discuss the geographical and biographical allusion to Petersburg, Fla., without confusing it with St. Petersburg, Russia or endorsing the narrator’s claim.';
records.find(r=>r.sectionNumber===12&&r.placeId==='st-petersburg').placeId=petersburg.id;
const summary={bookId:'lolita',reviewedAt:stamp,scope:'All 71 section analyses and all currently mapped section-place associations, including contextual recurrent settings, plus the two recovered associations. This is a collation of the existing integral reading, not a new lexical census.',sections:sectionAnalysis.map(s=>({id:s.id,fullSectionRead:s.fullSectionRead,originalWitnessPages:[s.viewerPageStart,s.viewerPageEnd],nativeSectionSha256:s.id==='afterword'?null:hash(sections.find(x=>x.id===s.id).text),narrativeAnalysis:s.locationAnalysis,associations:records.filter(r=>r.section===s.id)})),counts:{sourceSections:71,mappedAssociations:records.length,missingMappedOriginals:0,afterwordMappedAssociations:21,recoveredContextualAssociations:2,originalFallbackLanguages:['it','fr','es']},editionLimit:'The two digital witnesses are identified and independently paginated. Neither provides a verified publisher or edition date; these fields remain explicitly unknown.',translationCoverage:'Original English verified; no authentic reusable translation verified in Italian, French or Spanish. Fallback is not completed translation coverage.',archivalScope:'The 341 original unlocated records are preserved. Interiors are archival material, not additional geographical locations or completeness obligations. Unlocatable fictional micro-settings are not assigned invented addresses.',imaginaryViews:{decision:'not-added',reason:'The itinerary, deliberately camouflaged towns and dispersed motel scenes are better served by the geographical atlas. A realistic synthetic view would require many unsupported spatial choices; no speculative view is presented as a reconstruction.'}};
assert.equal(records.length,358);assert.equal(new Set(records.map(r=>r.section+':'+r.placeId)).size,358);
book.metadata.analysisStatus='geographical-analysis-and-visible-original-evidence-reviewed';
book.metadata.publicationStatus='published-reviewed-geographical-analysis';
book.metadata.finalGeographicalReview={reviewedAt:stamp,sections:71,mappedAssociations:358,originalEvidenceGaps:0,translationCoverage:{en:'original',it:'original-fallback',fr:'original-fallback',es:'original-fallback'},analysisRecord:recordUrl,editionLimit:summary.editionLimit,imaginaryViews:summary.imaginaryViews};
book.metadata.quotationReview={...book.metadata.quotationReview,pendingAssociations:[],afterword:'collated-separately-with-image-witness-viewer-pages-208-212',finalReviewAt:stamp,mappedAndVisibleUnlocatedAssociations:358};
const note=texts([
 'Passages are shown in the verified English original. The foreword and novel use PDF page numbers; the author’s afterword uses the separately checked image witness. Publisher and edition date are not stated in these copies. Verified reusable translations are not available.',
 'I passi sono mostrati nell’originale inglese verificato. Prefazione e romanzo usano le pagine del PDF; la postfazione usa il testimone a immagini verificato separatamente. Le copie non dichiarano editore e data dell’edizione. Non sono disponibili traduzioni riutilizzabili verificate.',
 'Les passages sont présentés dans l’original anglais vérifié. La préface et le roman renvoient aux pages du PDF ; la postface utilise le témoin en images vérifié séparément. Ces copies n’indiquent ni éditeur ni date d’édition. Aucune traduction réutilisable vérifiée n’est disponible.',
 'Los pasajes se muestran en el original inglés verificado. El prólogo y la novela remiten a las páginas del PDF; el epílogo utiliza el testimonio en imágenes comprobado por separado. Las copias no indican editorial ni fecha de edición. No se dispone de traducciones reutilizables verificadas.'
]);book.metadata.sidebarNote=note.en;review.sidebarNote=note.en;translate(note.en,note);
for(const s of t.sections){s.metadata.analysisStatus='geographical-section-reviewed';s.metadata.geographicalReviewAt=stamp;}
// Keep the presentation truthful: remove the obsolete broad warning, retain the
// concrete edition/translation qualifications in the atlas and analysis data.
delete t.book_presentations[0].presentation.editorialNotice;
t.book_presentations[0].presentation.editorialStatus='reviewed';
for(const p of t.place_descriptions){p.metadata.analysisStatus='geographical-reference-reviewed';p.metadata.geographicalReviewAt=stamp;}
write(dir+'expected.json',after);write(out+'final-review.json',summary);
console.log(summary.counts);
const c={window:{}};vm.createContext(c);vm.runInContext(fs.readFileSync('docs/content-adapter.js','utf8'),c);
write(dir+'reconstructed-expected.json',c.window.atlasContent.reconstruct(after,'lolita'));
// Build a guarded, idempotent transaction that only touches changed Lolita rows.
const keys={books:['id'],sections:['book_id','id'],places:['book_id','id'],sources:['book_id','id'],place_descriptions:['book_id','place_id','collection'],place_references:['book_id','id'],excerpts:['book_id','id'],unlocated_settings:['book_id','section_id','ordinal'],content_translations:['book_id','language','source_hash'],book_presentations:['book_id']};
const order=['sources','places','place_descriptions','sections','place_references','excerpts','unlocated_settings','content_translations','books','book_presentations'];
const changes=[];
for(const table of order){const k=keys[table];for(const row of t[table]){const old=before.tables[table].find(o=>k.every(key=>o[key]===row[key]));if(old&&JSON.stringify(old)===JSON.stringify(row))continue;const changed=Object.keys(row).filter(key=>!old||JSON.stringify(old[key])!==JSON.stringify(row[key]));changes.push({table,keys:Object.fromEntries(k.map(key=>[key,row[key]])),before:old?Object.fromEntries([...new Set([...k,...changed])].map(key=>[key,old[key]])):null,after:Object.fromEntries([...new Set([...k,...changed])].map(key=>[key,row[key]])),row});}}
write(dir+'changes.json',changes);
const lit=v=>"'"+JSON.stringify(v).replaceAll("'","''")+"'::jsonb";
let sql='begin isolation level repeatable read;\n';
sql+='create temporary table lolita_final_other_rows on commit drop as '+order.map(table=>`select '${table}'::text target,md5(coalesce(string_agg(h,'' order by h),'')) digest from (select md5(to_jsonb(r)::text) h from public.${table} r where ${table==='books'?"r.id<>'lolita'":"r.book_id<>'lolita'"}) x`).join(' union all ')+';\n';
const transport=changes.map(ch=>({table:ch.table,keys:ch.keys,before:ch.before,after:ch.after,...(!ch.before?{row:ch.row}:{})}));
sql+='create temporary table lolita_final_patch on commit drop as select value as patch from jsonb_array_elements('+lit(transport)+');\n';
sql+=`do $review$ declare p jsonb; table_name text; current_row jsonb; assignments text; begin
 for p in select patch from lolita_final_patch loop
  table_name:=p->>'table';
  if not table_name=any(array['sources','places','place_descriptions','sections','place_references','excerpts','unlocated_settings','content_translations','books','book_presentations']) then raise exception 'Unexpected table'; end if;
  if (table_name='books' and p->'keys'->>'id'<>'lolita') or (table_name<>'books' and p->'keys'->>'book_id'<>'lolita') then raise exception 'Unexpected book'; end if;
  execute format('select to_jsonb(r) from public.%I r where to_jsonb(r) @> $1',table_name) into current_row using p->'keys';
  if current_row is null then
   if p->'before'<>'null'::jsonb then raise exception 'Missing source row in %',table_name; end if;
   execute format('insert into public.%I select * from jsonb_populate_record(null::public.%I,$1)',table_name,table_name) using p->'row';
  else
   if not (current_row @> (p->'after')) and not (current_row @> coalesce(nullif(p->'before','null'::jsonb),p->'after')) then raise exception 'Changed source row in %',table_name; end if;
   if p->'before'<>'null'::jsonb then
    select string_agg(format('%I=p.%I',key,key),',') into assignments from jsonb_object_keys(p->'after') key where not (p->'keys' ? key);
    execute format('update public.%I r set %s from jsonb_populate_record(null::public.%I,$1) p where to_jsonb(r) @> $2',table_name,assignments,table_name) using p->'after',p->'keys';
   end if;
  end if;
 end loop;
end $review$;\n`;
sql+='do $verify$ begin if exists(select 1 from lolita_final_other_rows before_rows join ('+order.map(table=>`select '${table}'::text target,md5(coalesce(string_agg(h,'' order by h),'')) digest from (select md5(to_jsonb(r)::text) h from public.${table} r where ${table==='books'?"r.id<>'lolita'":"r.book_id<>'lolita'"}) x`).join(' union all ')+") after_rows using(target) where before_rows.digest<>after_rows.digest) then raise exception 'Other novels changed'; end if; end $verify$;\ncommit;\n";
sql+="select 'lolita-final-review-2026-11-02' as release, (select count(*) from public.excerpts where book_id='lolita') as relational_originals, (select metadata->'finalGeographicalReview'->>'mappedAssociations' from public.books where id='lolita') as mapped_associations, (select presentation->>'editorialStatus' from public.book_presentations where book_id='lolita') as editorial_status;\n";
fs.writeFileSync(dir+'publish.sql',sql);console.log('Changed rows',changes.length,'SQL bytes',Buffer.byteLength(sql));
