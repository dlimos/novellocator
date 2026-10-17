const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict'),vm=require('node:vm');
const dir=__dirname,work='work/lolita-roadtrip/',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),write=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,2)+'\n'),hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const before=read(work+'raw-before.json'),expected=structuredClone(before),book=read(work+'books-before.json')[0],sections=read('work/lolita/fliphtml-sections.json'),analysis=read(dir+'/section-analysis.json'),pages=read('work/lolita/fliphtml-clean-pages.json'),pdf=read(work+'pdf-pages.json'),pdfMeta=read(work+'pdf-metadata.json'),manifest=read(dir+'/page-manifest.json'),decisions=require('../../work/lolita-roadtrip/review-scenes.cjs'),refs=read(work+'place_references-before.json'),descriptions=read(work+'place_descriptions-before.json');
const norm=t=>String(t).normalize('NFKD').toLowerCase().replace(/[^a-z0-9]/g,'');
const languages=['en','it','fr','es'],dictionary={},regionPatches=new Map(),coreUpdates=[],descriptionUpdates=[],privateProof=[];
function translate(values){assert.equal(values.length,4);const key=values[0];dictionary[key]=values;return key;}
const source=(section)=>({url:analysis.sections.find(s=>s.id===section.id).source,label:'Vladimir Nabokov · Lolita · '+(section.id==='afterword'?'On a Book Entitled Lolita':section.id)});
const regionSource='https://journals.openedition.org/ejas/7550';
function region(id,keys,name,area,coords,geoSource,notes){
 const pointNote=translate(notes),method=translate([
  'Only the geographical region is established. This rounded point is selected within it for orientation; it is not a scene, address, route reconstruction or probability estimate.',
  'È stabilita soltanto la regione geografica. Il punto arrotondato è scelto al suo interno per orientarsi; non è una scena, un indirizzo, una ricostruzione del percorso o una stima di probabilità.',
  'Seule la région géographique est établie. Ce point arrondi est choisi à l’intérieur pour s’orienter ; ce n’est ni une scène, ni une adresse, ni un trajet reconstitué, ni une estimation de probabilité.',
  'Solo queda establecida la región geográfica. El punto redondeado se elige dentro de ella para orientarse; no es una escena, una dirección, un recorrido reconstruido ni una estimación de probabilidad.'
 ]);
 regionPatches.set(id,{id,keys,place:{name:translate(name),area,coords,kind:'uncertain',zoom:4,checked:'2026-10-16',status:'Uncertain regional position',note:pointNote,method,positionSource:{url:geoSource,label:'Geographical region · representative point'},narrativeSource:{url:regionSource,label:'Text and critical geographical review'},geographicReview:{precision:'region',realWorldIdentity:'not-established'}},sceneText:pointNote,categories:{},evidenceLabel:'Original section evidence',sectionOccurrences:{}});
}
region('regional-riviera',['Riviera','Hotel Mirana'],['Riviera · regional setting','Riviera · ambientazione regionale','Riviera · cadre régional','Riviera · ambientación regional'],'Mediterranean Riviera',[43.8,7.5],'https://en.wikisource.org/wiki/1911_Encyclop%C3%A6dia_Britannica/Riviera',[
 'The childhood scenes are set on the Riviera near the fictional Hotel Mirana. The diamond indicates the Mediterranean coastal region; it does not identify the hotel, villa, school or beach, or choose a real town as their equivalent.',
 'Le scene d’infanzia si svolgono sulla Riviera presso l’Hotel Mirana immaginario. Il rombo indica la regione costiera mediterranea; non identifica albergo, villa, scuola o spiaggia e non sceglie una città reale equivalente.',
 'Les scènes d’enfance se déroulent sur la Riviera près de l’hôtel Mirana fictif. Le losange indique la région côtière méditerranéenne ; il n’identifie ni hôtel, ni villa, ni école, ni plage et ne choisit pas de ville réelle équivalente.',
 'Las escenas de infancia transcurren en la Riviera cerca del Hotel Mirana ficticio. El rombo indica la región costera mediterránea; no identifica hotel, villa, escuela ni playa, ni elige una ciudad real equivalente.'
]);
region('regional-arctic-canada',['Arctic Canada'],['Arctic Canada · expedition region','Artico canadese · regione della spedizione','Arctique canadien · région de l’expédition','Ártico canadiense · región de la expedición'],'Arctic Canada',[70,-100],'https://natural-resources.canada.ca/maps-tools-publications/maps/north-maps',[
 'The expedition and the boulder scene belong to Arctic Canada. The camp is not located. Prince of Wales Island is a conjecture about the expedition’s purpose, and Victoria Island is expressly excluded as that purpose.',
 'La spedizione e la scena del masso appartengono all’Artico canadese. Il campo non è localizzato. Prince of Wales Island è una congettura sullo scopo della spedizione; Victoria Island è espressamente esclusa come scopo.',
 'L’expédition et la scène du rocher se situent dans l’Arctique canadien. Le camp n’est pas localisé. Prince of Wales Island est une conjecture sur le but de l’expédition ; Victoria Island est explicitement exclue comme but.',
 'La expedición y la escena de la roca se sitúan en el Ártico canadiense. El campamento no está localizado. Prince of Wales Island es una conjetura sobre el objetivo; Victoria Island se excluye expresamente como objetivo.'
]);
region('regional-appalachia',['Appalachian Mountains'],['Appalachia · unnamed town','Appalachi · cittadina anonima','Appalaches · ville anonyme','Apalaches · localidad anónima'],'Appalachian region',[38,-80],'https://www.nps.gov/articles/series.htm?id=12C422BC-1DD8-B71B-0B1552CA902E5909',[
 'Part II, chapter 30 explicitly places the night stop somewhere in Appalachia. The diamond represents the broad region, not the anonymous town, a particular state or the disguised roads.',
 'La parte II, capitolo 30, colloca esplicitamente la sosta notturna da qualche parte negli Appalachi. Il rombo rappresenta la regione ampia, non la cittadina anonima, uno Stato preciso o le strade camuffate.',
 'La deuxième partie, chapitre 30, situe explicitement l’arrêt nocturne quelque part dans les Appalaches. Le losange représente la vaste région, pas la ville anonyme, un État précis ni les routes camouflées.',
 'La segunda parte, capítulo 30, sitúa expresamente la parada nocturna en algún lugar de los Apalaches. El rombo representa la región amplia, no la localidad anónima, un estado preciso ni las carreteras camufladas.'
]);
const magnolia=read(work+'magnolia-geocode.json'),candidate=magnolia.data.candidates[0];assert.equal(candidate.attributes.Addr_type,'PointAddress');assert(candidate.address.includes('3550 Ashley River'));
regionPatches.set('scene-magnolia-gardens',{id:'scene-magnolia-gardens',keys:['Magnolia Garden'],categories:{},evidenceLabel:'Original section evidence',sectionOccurrences:{},sceneText:'',place:{name:'Magnolia Garden',area:'Magnolia Plantation & Gardens · Charleston, South Carolina',coords:[candidate.location.y,candidate.location.x],kind:'area',zoom:13,checked:'2026-10-16',status:'Representative geographical position',note:translate([
 'Zimmer identifies the garden in Part II, chapter 2 as Magnolia Gardens near Charleston. The official site confirms the Ashley River grounds at 3550 Ashley River Road. The point locates the property, not Dolores’s bench.',
 'Zimmer identifica il giardino della parte II, capitolo 2, con Magnolia Gardens presso Charleston. Il sito ufficiale conferma il complesso sull’Ashley River al 3550 Ashley River Road. Il punto localizza la proprietà, non la panchina di Dolores.',
 'Zimmer identifie le jardin de la deuxième partie, chapitre 2, à Magnolia Gardens près de Charleston. Le site officiel confirme le domaine sur l’Ashley River au 3550 Ashley River Road. Le point situe la propriété, pas le banc de Dolores.',
 'Zimmer identifica el jardín de la segunda parte, capítulo 2, con Magnolia Gardens cerca de Charleston. El sitio oficial confirma el recinto del Ashley River en 3550 Ashley River Road. El punto sitúa la propiedad, no el banco de Dolores.'
 ]),method:'Official property address matched to Esri PointAddress; the scene is verified independently in Part II, chapter 2.',positionSource:{url:magnolia.url,label:'Esri · official property address'},narrativeSource:{url:'https://dezimmer.net/LolitaUSA/Trip1.htm',label:'Dieter E. Zimmer · Lolita, USA · Trip One'},additionalSource:{url:'https://www.magnoliaplantation.com/contact',label:'Magnolia Plantation & Gardens · official site'}}});
const pdfText=pdf.map(p=>norm(p.text)),pdfOffsets=[];let pdfLength=0;
for(const t of pdfText){pdfOffsets.push(pdfLength);pdfLength+=t.length;}
const pdfAll=pdfText.join(''),pdfSections=new Map();let cursor=0;
for(const s of sections.filter(s=>s.id!=='afterword')){
 const text=norm(s.text);let found=-1;
 for(const skip of [0,35,70,105,140,175]){const k=pdfAll.indexOf(text.slice(skip,skip+45),cursor);if(k>=0){found=k;break;}}
 assert(found>=0,'Chapter start missing from user PDF: '+s.id);
 const startPage=pdfOffsets.findLastIndex(offset=>offset<=found)+1;pdfSections.set(s.id,{startPage,offset:found});cursor=found+45;
}
const pdfEntries=[...pdfSections];for(let i=0;i<pdfEntries.length;i++)pdfEntries[i][1].endPage=pdfEntries[i+1]?.[1].startPage||pdf.length;
for(const d of decisions){
 const section=sections.find(s=>s.id===d.sectionId),sectionId=sections.indexOf(section)+1,prior=analysis.sections.find(s=>s.id===d.sectionId);
 assert(norm(section.text).includes(norm(d.needle)),d.sectionId+' '+d.needle);
 let sceneText=d.translations;
 // Existing chapter introductions make repeated regional notes scene-specific.
 if(['regional-ramsdale','regional-beardsley'].includes(d.placeId)&&!['2.29'].includes(d.sectionId))sceneText=languages.map((l,i)=>prior.intro[l]+' '+d.translations[i]);
 const scene=translate(sceneText),chapter=expected.data.chapters.find(c=>c.id===sectionId);
 const match=pages.filter(p=>p.page>=section.pageStart&&p.page<=section.pageEnd).find(p=>norm(p.body).includes(norm(d.needle)))||pages.find(p=>p.page===section.pageStart);
 const pdfRange=pdfSections.get(d.sectionId);
 const pdfMatches=pdf.filter((p,i)=>pdfRange&&p.page>=pdfRange.startPage&&p.page<=pdfRange.endPage&&pdfText[i].includes(norm(d.needle)));
 assert(d.sectionId==='afterword'||pdfMatches.length>0,'User PDF proof missing '+d.sectionId+' '+d.needle);
 const proofId=hash(d.sectionId+'|'+d.placeId),evidence={id:proofId,sectionId:d.sectionId,placeId:d.placeId,category:'action',narrativeLevel:d.level,reason:d.reason,viewerPage:match.page,printedPage:match.page-1,sourceImageSha256:manifest.find(p=>p.page===match.page).sha256,sourceSectionSha256:hash(section.text),pdfPages:pdfMatches.map(p=>p.page),pdfSha256:pdfMeta.sha256,publicQuotationStatus:'pending-edition-and-individual-aggregate-rights-review'};
 privateProof.push({...evidence,needle:d.needle,originalSection:section.text,originalPdfPages:pdfMatches.map(p=>({page:p.page,text:p.text}))});
 d.evidence=evidence;d.scene=scene;d.sourceSectionId=sectionId;
 if(d.placeId.startsWith('regional-')||d.placeId==='scene-magnolia-gardens'){
  let patch=regionPatches.get(d.placeId);if(!patch){patch={id:d.placeId,sectionOccurrences:{}};regionPatches.set(d.placeId,patch);}
  patch.sectionOccurrences[sectionId]={category:'action',scene,source:source(section),evidenceReview:evidence.id};
 }else{
  let r=refs.find(r=>r.section_id===sectionId&&r.place_id===d.placeId&&r.collection==='core');
  const isNew=!r;if(!r){r={book_id:'lolita',id:sectionId+':core:'+d.placeId,section_id:sectionId,place_id:d.placeId,collection:'core',ordinal:Math.max(0,...refs.filter(r=>r.section_id===sectionId&&r.collection==='core').map(r=>r.ordinal))+1,category:'mentioned',scene_text:'',source_id:refs.find(r=>r.section_id===sectionId).source_id,metadata:{explicitCategory:true}};refs.push(r);chapter.places.push(d.placeId);chapter.placeText.push('');}
  coreUpdates.push({...r,isNew,category:'action',scene_text:scene,metadata:{...r.metadata,narrativeReview:evidence}});
  chapter.placeCategories[d.placeId]='action';chapter.placeText[chapter.places.indexOf(d.placeId)]=scene;
 }
}
write(work+'original-evidence-private.json',privateProof);
const census=read(work+'states.json'),outlineSource={url:'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/State_County/MapServer/70',label:'US Census Bureau · state boundaries (2020)'};
const sourceId=hash(outlineSource.url);
for(const f of census.data.features){const id=f.attributes.NAME.toLowerCase(),place=expected.data.places[id],paths=f.geometry.rings;assert(paths.every(p=>p.length>=4));
 const anchor=paths[0].reduce((a,p)=>p[1]>a[1]?p:a),patch={regionalOutline:{paths,label:place.name,labelAnchor:anchor,sourceVintage:2020,generalizationDegrees:0.02,scope:'documented-state-not-exact-scene',confidence:'state-supported; exact-site-unresolved'}};
 const note=translate([
  'The outline indicates the state established for the narrated scenes, not the position of a court, beach, lake or laboratory. It is an area of geographical reference, not a reconstructed route or a probability distribution.',
  'Il contorno indica lo Stato attestato per le scene narrate, non la posizione di un campo, una spiaggia, un lago o un laboratorio. È un ambito geografico di riferimento, non un percorso ricostruito o una distribuzione di probabilità.',
  'Le contour indique l’État établi pour les scènes racontées, pas la position d’un court, d’une plage, d’un lac ou d’un laboratoire. C’est un cadre géographique de référence, pas un trajet reconstitué ni une distribution de probabilité.',
  'El contorno indica el estado documentado para las escenas narradas, no la posición de una pista, playa, lago ni laboratorio. Es un ámbito geográfico de referencia, no un recorrido reconstruido ni una distribución de probabilidad.'
 ]),method=translate([
  'US Census 2020 state boundary, generalized to 0.02 degrees. Narrative precision is evaluated separately for each source chapter; internal legacy coordinates do not locate a scene and are not displayed for this outline.',
  'Confine statale US Census 2020, generalizzato a 0,02 gradi. La precisione narrativa è valutata separatamente per ogni capitolo; le coordinate interne pregresse non localizzano una scena e non sono mostrate per questo contorno.',
  'Limite d’État du US Census 2020, généralisée à 0,02 degré. La précision narrative est évaluée séparément pour chaque chapitre ; les anciennes coordonnées internes ne situent pas une scène et ne sont pas affichées pour ce contour.',
  'Límite estatal US Census 2020, generalizado a 0,02 grados. La precisión narrativa se evalúa por separado para cada capítulo; las coordenadas internas anteriores no sitúan una escena y no se muestran para este contorno.'
 ]);
 Object.assign(place,patch,{note,method,checked:'2026-10-16',positionSource:outlineSource});descriptionUpdates.push({placeId:id,metadata:patch,note,method,positionSourceId:sourceId});
}
const geographic=expected.data.book.geographicReview;
const coveredSettings={36:{'Hobby House':'mississippi','Little Iceberg Lake':'colorado','Poplar Shade':'utah'},57:{'Strada anonima dell’incontro con Mary':'regional-elphinstone'},63:{'Casa degli Schiller: salotto':'regional-coalmont'}};
geographic.coveredSettings={...geographic.coveredSettings,...coveredSettings};
for(const patch of regionPatches.values()){
 if(patch.place&&patch.id!=='scene-magnolia-gardens'){
  const first=decisions.find(d=>d.placeId===patch.id);patch.place.narrativeSource=source(sections.find(s=>s.id===first.sectionId));
 }
 const existing=geographic.regionalPlaces.find(r=>r.id===patch.id);if(existing){existing.sectionOccurrences={...existing.sectionOccurrences,...patch.sectionOccurrences};}
 else geographic.regionalPlaces.push(patch);
}
expected.data.book.sectionGrouping.actionFirst=true;
// Keep the study in the novel's critical/geographical sources.
const critical={url:regionSource,label:'Monica Manolescu-Oancea · Inventing and naming America (2009)'};
const bibliography='<p><a href="'+critical.url+'" target="_blank" rel="noopener noreferrer">Monica Manolescu-Oancea, <em>Inventing and naming America: Place and Place Names in Vladimir Nabokov’s Lolita</em>, 2009</a>.</p><p>Dieter E. Zimmer, <em>Lolita, USA</em>: <a href="https://dezimmer.net/LolitaUSA/Trip1.htm" target="_blank" rel="noopener noreferrer">Trip One</a> · <a href="https://www.dezimmer.net/LolitaUSA/Trip2.htm" target="_blank" rel="noopener noreferrer">Trip Two</a>.</p>';
const footer=translate(['<p>Critical geographical sources. Scene classifications also rely on the original chapter context.</p>','<p>Fonti critiche geografiche. Le categorie delle scene si basano anche sul contesto del capitolo originale.</p>','<p>Sources critiques géographiques. Les catégories des scènes reposent aussi sur le contexte du chapitre original.</p>','<p>Fuentes críticas geográficas. Las categorías de las escenas se basan también en el contexto del capítulo original.</p>'].map(text=>text+bibliography));
expected.data.book.footerHtml=footer;
for(const [key,values]of Object.entries(dictionary))for(const [i,lang]of languages.entries())(expected.dictionary[lang]??={})[key]=values[i];
const dataPatch={actionFirst:true,regionalPlaces:[...regionPatches.values()],coveredSettings,coreUpdates,descriptionUpdates,outlineSource:{...outlineSource,id:sourceId},critical,footerHtml:footer};
write(dir+'/whole-review-patch.json',dataPatch);
write(dir+'/roadtrip-state-boundaries.json',census);
const coverage=sections.map((s,index)=>({id:s.id,sourceSectionId:index+1,viewerPages:[s.pageStart,s.pageEnd],userPdfPages:pdfSections.has(s.id)?[pdfSections.get(s.id).startPage,pdfSections.get(s.id).endPage]:null,originalSectionSha256:hash(s.text),previousSectionAnalysis:analysis.sections.find(a=>a.id===s.id).locationAnalysis,reviewedActionPlaces:decisions.filter(d=>d.sectionId===s.id).map(d=>({placeId:d.placeId,...d.evidence})),existingCoreReferences:before.data.chapters[index].places.map(id=>({placeId:id,category:coreUpdates.find(r=>r.section_id===index+1&&r.place_id===id)?.category||before.data.chapters[index].placeCategories[id]||'action'})),unlocatedNames:before.data.chapters[index].unlocatedPlaces.map(p=>p.id||p.name),remainingMentions:'Biographical news, projected journeys, comparisons, names in a register, attraction lists and summaries without an enacted scene remain mentioned. Fictional interiors continue under their documented regional setting; no real address is inferred.'}));
write(dir+'/whole-book-review.json',{bookId:'lolita',reviewDate:'2026-10-16',coverage:{sourceSections:71,partI:33,partII:36,foreword:true,afterword:true,coreReferencesBefore:read(work+'place_references-before.json').length,unlocatedReferencesBefore:read(work+'unlocated_settings-before.json').length},userPdf:{sha256:pdfMeta.sha256,pages:pdfMeta.pages,edition:'Unidentified reflowed English witness; no publisher/year established',afterwordPresent:false,private:true},method:'Review of all section analyses and original geographical contexts, checked against the user-provided searchable PDF for the novel and the previous witness for the authorial afterword. A short or nominal vignette may enact a scene. Contextual continuations and embedded scenes are recorded explicitly. No new protected quotation is published.',criticalSources:[critical,{url:'https://dezimmer.net/LolitaUSA/Trip1.htm',label:'Dieter E. Zimmer · Trip One'},{url:'https://www.dezimmer.net/LolitaUSA/Trip2.htm',label:'Dieter E. Zimmer · Trip Two'}],publicationStatus:'Narrative/geographical corrections; edition identification and full public quotation apparatus remain pending',sections:coverage});
const ctx={window:{}};vm.createContext(ctx);vm.runInContext(fs.readFileSync('docs/supabase-data.js','utf8'),ctx);expected.data=ctx.window.atlasSupabaseData.groupSections(expected.data);write(work+'expected.json',expected);
const lit=x=>"'"+String(x).replaceAll("'","''")+"'",json=x=>lit(JSON.stringify(x))+'::jsonb';
const scopeDigestQuery=['books','place_references','place_descriptions','sources','content_translations'].map(table=>`select '${table}'::text as target,md5(coalesce(string_agg(h,'' order by h),'')) as digest from (select md5(to_jsonb(r)::text) h from public.${table} r where r.${table==='books'?'id':'book_id'}<>'lolita') rows`).join('\nunion all\n');
let sql='begin isolation level repeatable read;\nset local standard_conforming_strings=on;\n';
// Verify the scope on the production database itself, before COMMIT. Any
// change to any other book in any target table aborts the whole transaction.
sql+=`create temporary table lolita_review_scope_guard on commit drop as\n${scopeDigestQuery};\n`;
sql+=`do $guard$ begin if not exists(select 1 from public.books where id='lolita' and jsonb_array_length(metadata->'sectionGrouping'->'groups')=4) then raise exception 'Unexpected navigation';end if;end $guard$;\n`;
for(const p of regionPatches.values())if(!p.place)sql+=`do $guard$ begin if (select count(*) from public.books b cross join lateral jsonb_array_elements(b.metadata->'geographicReview'->'regionalPlaces') r where b.id='lolita' and r->>'id'=${lit(p.id)})<>1 then raise exception 'Regional record missing or duplicated';end if;end $guard$;\n`;
for(const r of coreUpdates)if(!r.isNew)sql+=`do $guard$ begin if (select count(*) from public.place_references where book_id='lolita' and id=${lit(r.id)} and section_id=${r.section_id} and place_id=${lit(r.place_id)} and source_id=${lit(r.source_id)})<>1 then raise exception 'Source association changed';end if;end $guard$;\n`;
sql+=`update public.books set metadata=jsonb_set(metadata,'{sectionGrouping,actionFirst}','true'::jsonb) where id='lolita';\n`;
sql+=`update public.books set metadata=jsonb_set(metadata,'{geographicReview,coveredSettings}',coalesce(metadata->'geographicReview'->'coveredSettings','{}'::jsonb)||${json(coveredSettings)}) where id='lolita';\n`;
for(const p of regionPatches.values()){
 const existing=book.metadata.geographicReview.regionalPlaces.some(r=>r.id===p.id);
 if(existing)sql+=`update public.books b set metadata=jsonb_set(b.metadata,'{geographicReview,regionalPlaces}',(select jsonb_agg(case when r->>'id'=${lit(p.id)} then r||jsonb_build_object('sectionOccurrences',coalesce(r->'sectionOccurrences','{}'::jsonb)||${json(p.sectionOccurrences)}) else r end order by ord) from jsonb_array_elements(b.metadata->'geographicReview'->'regionalPlaces') with ordinality as a(r,ord))) where b.id='lolita';\n`;
 else sql+=`update public.books b set metadata=jsonb_set(b.metadata,'{geographicReview,regionalPlaces}',(b.metadata->'geographicReview'->'regionalPlaces')||${json([p])}) where b.id='lolita' and not exists(select 1 from jsonb_array_elements(b.metadata->'geographicReview'->'regionalPlaces') r where r->>'id'=${lit(p.id)});\n`;
}
sql+=`do $guard$ begin if exists(select 1 from public.books where id='lolita' and metadata->>'footerHtml' is not null and metadata->>'footerHtml'<>${lit(footer)}) then raise exception 'Existing footer changed';end if;end $guard$;\nupdate public.books set metadata=jsonb_set(metadata,'{footerHtml}',${json(footer)}) where id='lolita';\n`;
for(const r of coreUpdates){
 if(!r.isNew)sql+=`update public.place_references set category='action',scene_text=${lit(r.scene_text)},metadata=metadata||${json(r.metadata)} where book_id='lolita' and id=${lit(r.id)} and section_id=${r.section_id} and place_id=${lit(r.place_id)};\n`;
 else sql+=`insert into public.place_references(book_id,id,section_id,place_id,collection,ordinal,category,scene_text,source_id,metadata) values('lolita',${lit(r.id)},${r.section_id},${lit(r.place_id)},'core',${r.ordinal},'action',${lit(r.scene_text)},${lit(r.source_id)},${json(r.metadata)}) on conflict(book_id,id) do update set category=excluded.category,scene_text=excluded.scene_text,metadata=public.place_references.metadata||excluded.metadata where public.place_references.book_id='lolita' and public.place_references.section_id=excluded.section_id and public.place_references.place_id=excluded.place_id;\n`;
}
sql+=`insert into public.sources(book_id,id,url,label,metadata) values('lolita',${lit(sourceId)},${lit(outlineSource.url)},${lit(outlineSource.label)},'{}'::jsonb) on conflict(book_id,id) do nothing;\n`;
for(const p of descriptionUpdates)sql+=`update public.place_descriptions set metadata=metadata||${json(p.metadata)},note=${lit(p.note)},method=${lit(p.method)},position_source_id=${lit(sourceId)},checked='2026-10-16' where book_id='lolita' and place_id=${lit(p.placeId)} and collection='core';\n`;
const rows=Object.entries(dictionary).flatMap(([key,values])=>languages.map((l,i)=>`('lolita',${lit(l)},${lit(hash(key))},${lit(key)},${lit(values[i])})`));
sql+=`insert into public.content_translations(book_id,language,source_hash,source_text,translated_text) values\n${rows.join(',\n')}\non conflict(book_id,language,source_hash) do update set translated_text=excluded.translated_text where public.content_translations.book_id='lolita';\n`;
sql+=`do $scope$ begin if exists(select 1 from lolita_review_scope_guard original full join (${scopeDigestQuery}) current_rows using(target) where original.digest is distinct from current_rows.digest) then raise exception 'Scope verification failed: another book was modified; transaction rolled back';end if;end $scope$;\ncommit;\nselect id from public.books where id='lolita';\n`;
write(dir+'/whole-review-translations.json',dictionary);fs.writeFileSync(dir+'/publish-whole-review.sql',sql);
if(process.argv.includes('--preview')){fs.mkdirSync('docs/preview',{recursive:true});fs.writeFileSync('docs/preview/whole-review-sql.html','<!doctype html><meta charset=utf-8><pre>'+sql.replaceAll('&','&amp;').replaceAll('<','&lt;')+'</pre>');fs.writeFileSync('docs/preview/whole-review.json',JSON.stringify(expected));fs.writeFileSync('docs/preview/whole-review.js',"window.atlasSupabaseData.loadBook=async()=>await(await fetch('preview/whole-review.json')).json();");let html=fs.readFileSync('docs/atlas.html','utf8').replace('<head>','<head><base href="../">').replace(/(<script[^>]*src="load-book.js[^>]*><\/script>)/,'<script src="preview/whole-review.js" defer></script>$1');fs.writeFileSync('docs/preview/whole-review.html',html);}
console.log('Reviewed scenes:',decisions.length,'core updates:',coreUpdates.length,'new regional/site records:',[...regionPatches.values()].filter(p=>p.place).length);
for(const c of expected.data.chapters)console.log(c.title,c.places.filter(id=>c.placeCategories[id]==='action').length,'action /',c.places.filter(id=>c.placeCategories[id]==='mentioned').length,'mentioned');
