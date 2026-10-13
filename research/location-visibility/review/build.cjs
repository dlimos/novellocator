const fs=require('node:fs'),vm=require('node:vm');
const decisions=require('./decisions.cjs');
const dir=__dirname;
const read=id=>JSON.parse(fs.readFileSync(`${dir}/${id}-live.json`,'utf8'));
const areas={
 'South Pacific':['Pacifico meridionale','Pacifique Sud','Pacífico Sur'],
 'Lake Superior':['Lago Superiore','Lac Supérieur','Lago Superior'],
 'Pennsylvania':['Pennsylvania','Pennsylvanie','Pensilvania'],
 'La Mancha':['La Mancia','La Manche','La Mancha'],
 'Aragon · Ebro region':['Aragona · area dell’Ebro','Aragon · région de l’Èbre','Aragón · región del Ebro'],
 'Ethiopia · literary geography':['Etiopia · geografia letteraria','Éthiopie · géographie littéraire','Etiopía · geografía literaria'],
 'Cape Comorin · southern India':['Capo Comorin · India meridionale','Cap Comorin · Inde du Sud','Cabo Comorín · sur de la India'],
 'Northern Mississippi':['Mississippi settentrionale','Nord du Mississippi','Norte de Misisipi'],
 'Mississippi':['Mississippi','Mississippi','Misisipi'],
 'Tula region · literary model':['Area di Tula · modello letterario','Région de Toula · modèle littéraire','Región de Tula · modelo literario'],
 'New England':['New England','Nouvelle-Angleterre','Nueva Inglaterra'],
 'Massachusetts':['Massachusetts','Massachusetts','Massachusetts'],
 'Northwestern North America':['Nordovest dell’America settentrionale','Nord-ouest de l’Amérique du Nord','Noroeste de América del Norte'],
 'Appalachia':['Appalachi','Appalaches','Apalaches'],
 'Northeastern United States':['Nordest degli Stati Uniti','Nord-est des États-Unis','Noreste de Estados Unidos'],
 'Nebraska–Wyoming travel region':['Area dell’itinerario Nebraska–Wyoming','Région de l’itinéraire Nebraska–Wyoming','Región del itinerario Nebraska–Wyoming'],
 'Midwestern United States':['Midwest degli Stati Uniti','Midwest des États-Unis','Medio Oeste de Estados Unidos'],
 'Wyoming · Continental Divide':['Wyoming · spartiacque continentale','Wyoming · ligne continentale de partage des eaux','Wyoming · divisoria continental'],
 'Colorado Rockies':['Montagne Rocciose del Colorado','Rocheuses du Colorado','Montañas Rocosas de Colorado'],
 'Colorado':['Colorado','Colorado','Colorado'],
 'Western Rocky Mountains':['Area occidentale delle Montagne Rocciose','Région occidentale des Rocheuses','Región occidental de las Montañas Rocosas']
};
const reports=[],metadata={},translations={};
const inventory=JSON.parse(fs.readFileSync(dir+'/inventory.json','utf8'));
function loadDictionary(id){const ctx={window:{}};vm.runInNewContext(fs.readFileSync('docs/data/'+id+'-i18n.js','utf8'),ctx);return ctx.window.atlasTranslations;}
for(const [id,d] of Object.entries(decisions)){
 const data=read(id),dictionary=loadDictionary(id),added={it:{},fr:{},es:{}};
 // PostgreSQL rounds float serialization; keep the original local precision.
 for(const p of inventory.find(b=>b.id===id).mapped)for(const collection of [data.places,data.citedPlaces])if(collection?.[p.id])collection[p.id].coords=p.coords;
 // Existing local quotation work is independent of this public geography patch.
 if(id==='holden')for(const q of JSON.parse(fs.readFileSync('docs/data/holden-audit.json','utf8')).quotations){const {chapter,place,...original}=q;const section=data.chapters.find(c=>c.id===chapter);section.placeExcerpts??={};section.placeExcerpts[place]={original,translations:{}};}
 const tr=(en,it,fr,es)=>{dictionary.en??={};dictionary.en[en]=en;for(const [lang,value]of Object.entries({it,fr,es})){dictionary[lang]??={};dictionary[lang][en]=value;added[lang][en]=value;}return en;};
 if(id==='holden'){const footer=Object.keys(dictionary.en||{}).find(key=>key.startsWith('<p>Locations checked against the original English novel. Selected brief quotations'));if(footer)data.book.footerHtml=footer;}
 const hidden=new Set(d.hide),keys=new Set(data.chapters.flatMap(c=>(c.unlocatedPlaces||[]).map(u=>u.id||u.name)));
 for(const key of hidden)if(!keys.has(key))console.log('CHECK unused exclusion',id,key);
 for(const key of keys)if((d.hidePatterns||[]).some(pattern=>new RegExp(pattern).test(key)))hidden.add(key);
 const regionalPlaces=[];
 for(const r of d.regions){
  if(!keys.has(r.key))throw Error('Missing existing source record '+id+'/'+r.key);
  const records=data.chapters.flatMap(c=>(c.unlocatedPlaces||[]).filter(u=>(u.id||u.name)===r.key).map(u=>({chapter:c.id,...u})));
  const sample=records[0],names=[sample.name,...['it','fr','es'].map(lang=>dictionary[lang]?.[sample.name]||sample.name)];
  const area=areas[r.area];if(!area)throw Error('Missing area translations '+r.area);
  tr(r.area,...area);
  const name=tr(names[0]+' · regional position',names[1]+' · posizione regionale',names[2]+' · position régionale',names[3]+' · posición regional');
  const note=tr(`Fictional or unnamed setting. The diamond marks only a representative point in ${r.area}; it does not identify a real town, island, address or boundary.`,
   `Luogo immaginario o anonimo. Il rombo indica soltanto un punto rappresentativo in ${area[0]}; non identifica una città, un’isola, un indirizzo o un confine reale.`,
   `Lieu fictif ou anonyme. Le losange indique uniquement un point représentatif dans ${area[1]} ; il n’identifie ni ville, ni île, ni adresse, ni frontière réelle.`,
   `Lugar ficticio o anónimo. El rombo indica solo un punto representativo en ${area[2]}; no identifica una ciudad, isla, dirección o frontera real.`);
  const status=tr('Uncertain regional position','Posizione regionale incerta','Position régionale incertaine','Posición regional incierta');
  const method=tr('The region or literary model is supported by the textual/critical source. The rounded map point is selected within that area for orientation only; distances and routes are not reconstructed.',
   'La regione o il modello letterario sono sostenuti dalla fonte testuale o critica. Il punto cartografico arrotondato è scelto nell’area soltanto per orientarsi; non ricostruisce distanze né percorsi.',
   'La région ou le modèle littéraire est étayé par la source textuelle ou critique. Le point cartographique arrondi est choisi dans cette zone uniquement pour s’orienter ; il ne reconstitue ni distances ni itinéraires.',
   'La región o el modelo literario están respaldados por la fuente textual o crítica. El punto cartográfico redondeado se elige en esa área solo para orientarse; no reconstruye distancias ni rutas.');
  const sceneText=tr('The original reference is retained. This regional position gives geographical context; narrative category is assessed separately for each section.',
   'Il riscontro originale è conservato. Questa posizione regionale offre il contesto geografico; la categoria narrativa è valutata separatamente per ogni sezione.',
   'La référence originale est conservée. Cette position régionale donne le contexte géographique ; la catégorie narrative est évaluée séparément pour chaque section.',
   'Se conserva el testimonio original. Esta posición regional aporta el contexto geográfico; la categoría narrativa se evalúa por separado en cada sección.');
  const label=tr('Original section evidence','Riscontro della sezione originale','Témoignage de la section originale','Testimonio de la sección original');
  const regionalKeys=[r.key,...Object.entries(d.related||{}).filter(([,target])=>target===r.id).map(([key])=>key)];
  // Only reviewed scenes can become action. Reported residence, summary and
  // ambiguous/publication-pending references default to mentioned.
  const categories={};
  if(id==='don-quijote'&&r.key==='barataria')categories[113]='action';
  if(id==='anna-karenina'&&r.key==='pokrovskoe')categories[226]='action';
  if(id==='lolita')for(const record of records)if(record.category==='action'&&record.analysisStatus==='original-evidence-verified-publication-pending')categories[record.chapter]='action';
  if(id==='sound-and-fury'&&r.key==='jefferson')Object.assign(categories,{1:'action',3:'action',4:'action'});
  if(id==='sound-and-fury'&&r.key==='mottson')categories[4]='action';
  const preferred=id==='sound-and-fury'?(r.key==='jefferson'?['house','post-jefferson','square','garden','black-church','store']:['station-mottson','gas-mottson']):[];
  const evidencePriority=[...preferred.filter(key=>regionalKeys.includes(key)),...regionalKeys.filter(key=>!preferred.includes(key))];
  regionalPlaces.push({id:r.id,keys:regionalKeys,evidencePriority,categories,sceneText,evidenceLabel:label,place:{name,area:r.area,coords:r.coords,kind:'uncertain',zoom:r.zoom,checked:'2026-10-13',status,note,method,aliases:sample.aliases||[sample.name],positionSource:{url:`https://www.openstreetmap.org/#map=${r.zoom}/${r.coords[0]}/${r.coords[1]}`,label:'OpenStreetMap · representative regional view'},narrativeSource:{url:r.source,label:'Textual / critical geographical evidence'},geographicReview:{reason:r.reason,precision:'region',realWorldIdentity:'not-established'}}});
 }
 const regionalKeys=new Map(regionalPlaces.flatMap(r=>r.keys.map(key=>[key,r.id])));
 const previous=new Set(data.book.hiddenUnlocatedPlaceIds||[]);
 const audit=data.chapters.flatMap(c=>(c.unlocatedPlaces||[]).map((u,ordinal)=>{const key=u.id||u.name;return {section:c.id,ordinal,key,name:u.name,decision:regionalKeys.has(key)?'regional-diamond':hidden.has(key)||previous.has(key)?'hidden-analysis-retained':'retained-unlocated',mappedPlaceId:regionalKeys.get(key)||null,source:u.url||null,originalEvidence:u.quote?.trim()?'existing-original-retained':'original-publication-pending',reason:regionalKeys.has(key)?d.regions.find(r=>r.id===regionalKeys.get(key)).reason:hidden.has(key)?'Luogo o interno immaginario senza un riferimento utile distinto; riscontro conservato nell’analisi.':'Riferimento geografico reale, anonimo o irrisolto conservato; l’assenza di coordinate non è una prova di inesistenza.'};}));
 const counts={mappedExisting:Object.keys({...data.places,...data.citedPlaces}).length,unlocatedRecords:audit.length,unlocatedKeys:keys.size,newRegionalPlaces:regionalPlaces.length,regionalReferences:audit.filter(r=>r.decision==='regional-diamond').length,hiddenRecords:audit.filter(r=>r.decision==='hidden-analysis-retained').length,retainedRecords:audit.filter(r=>r.decision==='retained-unlocated').length};
 metadata[id]={reviewedAt:'2026-10-13',scope:'geographical-placement-and-visibility-of-imported-records',regionalPlaces,hiddenUnlocatedKeys:[...hidden].filter(key=>keys.has(key)),counts,analysisNote:d.finding};
 if(id==='sound-and-fury'){
  const note=tr('Jefferson and Mottson are shown as uncertain regional diamonds. Fictional interiors without an independent useful position remain in the analysis. The later appendix has documented divergences.',
   'Jefferson e Mottson sono rappresentate da rombi con posizione regionale incerta. Gli interni immaginari privi di una collocazione indipendente utile restano nell’analisi. L’appendice successiva conserva le divergenze documentate.',
   'Jefferson et Mottson sont représentées par des losanges de position régionale incertaine. Les intérieurs fictifs sans position indépendante utile restent dans l’analyse. L’appendice ultérieur conserve les divergences documentées.',
   'Jefferson y Mottson se muestran como rombos de posición regional incierta. Los interiores ficticios sin ubicación independiente útil quedan en el análisis. El apéndice posterior conserva las divergencias documentadas.');
  metadata[id].sidebarNote=note;metadata[id].sectionNote=note;
 }
 if(id==='lolita'){
  metadata[id].sidebarNote=tr('Analysis in progress: original passages and their publication conditions still require individual verification. Diamonds show documented regional positions, without identifying fictional towns with real settlements.',
   'Analisi in corso: i passi originali e le condizioni di pubblicazione richiedono ancora una verifica individuale. I rombi mostrano collocazioni regionali documentate, senza identificare le città immaginarie con centri reali.',
   'Analyse en cours : les passages originaux et leurs conditions de publication nécessitent encore une vérification individuelle. Les losanges montrent des positions régionales documentées, sans identifier les villes fictives à des localités réelles.',
   'Análisis en curso: los pasajes originales y sus condiciones de publicación aún requieren una comprobación individual. Los rombos muestran ubicaciones regionales documentadas, sin identificar los pueblos ficticios con localidades reales.');
  metadata[id].sectionNote=tr('Regional diamonds provide geographical context. Imaginary places without a useful geographical reference remain only in the analysis.',
   'I rombi regionali offrono il contesto geografico. I luoghi immaginari privi di un riferimento geografico utile restano soltanto nell’analisi.',
   'Les losanges régionaux donnent le contexte géographique. Les lieux fictifs sans référence géographique utile restent uniquement dans l’analyse.',
   'Los rombos regionales aportan contexto geográfico. Los lugares ficticios sin una referencia geográfica útil se conservan solo en el análisis.');
  metadata[id].unlocatedNote=tr('Geographical reference retained without a separate verified map point. An unlocated name is not necessarily fictional.',
   'Riferimento geografico conservato senza un punto cartografico distinto verificato. Un nome senza coordinate non è necessariamente immaginario.',
   'Référence géographique conservée sans point cartographique distinct vérifié. Un nom sans coordonnées n’est pas nécessairement fictif.',
   'Referencia geográfica conservada sin un punto cartográfico distinto verificado. Un nombre sin coordenadas no es necesariamente ficticio.');
 }
 data.book.geographicReview=metadata[id];
 // Local import backup: retain the canonical records and store the reviewed view.
 fs.writeFileSync('docs/data/'+id+'.js','window.atlasData='+JSON.stringify(data,null,2)+';\n');
 fs.writeFileSync('docs/data/'+id+'-i18n.js','window.atlasTranslations='+JSON.stringify(dictionary,null,2)+';\n');
 fs.writeFileSync(dir+'/'+id+'-audit.json',JSON.stringify({counts,finding:d.finding,records:audit,mapped:data.places,cited:data.citedPlaces},null,2));
 reports.push({id,title:data.book.title,...counts,finding:d.finding});translations[id]=added;
}
fs.writeFileSync(dir+'/metadata.json',JSON.stringify(metadata,null,2));
fs.writeFileSync(dir+'/translations.json',JSON.stringify(translations,null,2));
fs.writeFileSync(dir+'/summary.json',JSON.stringify(reports,null,2));
console.log(reports.map(({id,newRegionalPlaces,regionalReferences,hiddenRecords,retainedRecords})=>({id,newRegionalPlaces,regionalReferences,hiddenRecords,retainedRecords})));
