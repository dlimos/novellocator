(()=>{
 // Navigation groups are a presentation of the source sections, never a rewrite
 // of the imported evidence. The original sections also drive detailed CSVs.
 function groupSections(input){
  const grouping=input.book.sectionGrouping;
  if(!grouping?.groups?.length)return input;
  const review=input.book.geographicReview||{},hidden=new Set([...(input.book.hiddenUnlocatedPlaceIds||[]),...(review.hiddenUnlocatedKeys||[])]);
  const places={...input.citedPlaces,...input.places};
  const sourceChapters=input.chapters;
  const sourceViews=sourceChapters.map(section=>{
   const chapter={...section,places:[...(section.places||[])],placeText:[...(section.placeText||[])],placeCategories:{...section.placeCategories},placeExcerpts:{...section.placeExcerpts},placeSources:{...section.placeSources},unlocatedPlaces:(section.unlocatedPlaces||[]).map(item=>({...item}))};
   for(const item of chapter.unlocatedPlaces){
    const key=item.id||item.name;
    if(review.coveredSettings?.[chapter.id]?.[key]){item.displayInAtlas=false;item.mappedPlaceId=review.coveredSettings[chapter.id][key];}
    if(hidden.has(key))item.displayInAtlas=false;
    const region=(review.regionalPlaces||[]).find(record=>(record.keys||[]).includes(key));
    if(!region)continue;
    places[region.id]=region.place;item.displayInAtlas=false;
    if(chapter.places.includes(region.id))continue;
    const priority=region.evidencePriority||region.keys;
    const evidence=chapter.unlocatedPlaces.filter(candidate=>region.keys.includes(candidate.id||candidate.name)).sort((a,b)=>priority.indexOf(a.id||a.name)-priority.indexOf(b.id||b.name))[0]||item;
    chapter.places.push(region.id);chapter.placeText.push(region.scenes?.[chapter.id]||region.sceneText);
    chapter.placeCategories[region.id]=region.categories?.[chapter.id]||'mentioned';
    chapter.placeSources[region.id]={url:evidence.url||region.place.narrativeSource.url,label:region.evidenceLabel};
    chapter.placeExcerpts[region.id]=evidence.excerpt||{original:{...evidence,language:evidence.language||input.book.originalLanguage,type:'original'},translations:evidence.translations||{}};
   }
   // Explicit reviewed scenes also cover chapters naming only an interior or
   // continuing the preceding scene. Their geographical scope stays regional.
   for(const region of review.regionalPlaces||[]){
    const occurrence=region.sectionOccurrences?.[chapter.id];if(!occurrence)continue;
    places[region.id]=region.place;
    let index=chapter.places.indexOf(region.id);if(index<0){index=chapter.places.length;chapter.places.push(region.id);}
    chapter.placeText[index]=occurrence.scene;chapter.placeCategories[region.id]=occurrence.category;
    chapter.placeSources[region.id]=occurrence.source;
    chapter.placeExcerpts[region.id]=occurrence.excerpt;
   }
   return chapter;
  });
  const used=new Set();
  const chapters=grouping.groups.map(group=>{
   const members=sourceViews.filter(c=>c.id>=group.firstSection&&c.id<=group.lastSection);
   if(!members.length)throw new Error('Empty section group');
   for(const c of members){if(used.has(c.id))throw new Error('Overlapping section groups');used.add(c.id);}
   const first=members[0],chapter={id:group.id,title:group.title,text:group.text,time:first.time,people:first.people,setting:first.setting,note:review.sectionNote||first.note,links:group.links||[...new Map(members.flatMap(c=>c.links||[]).map(link=>[link.url,link])).values()],places:[],placeText:[],placeCategories:{},placeExcerpts:{},placeSources:{},placeOccurrences:{},citations:[],unlocatedPlaces:[],sourceSectionIds:members.map(c=>c.id)};
   const references=new Map(),unlocated=new Map();
   for(const c of members){
    const refs=[...(c.places||[]).map((id,i)=>({placeId:id,category:c.placeCategories?.[id]||'action',scene:c.placeText[i],excerpt:c.placeExcerpts?.[id],source:c.placeSources?.[id]})),...(c.citations||[])];
    for(const ref of refs){const list=references.get(ref.placeId)||[];list.push({...ref,sourceSectionId:c.id,sourceSectionTitle:c.title});references.set(ref.placeId,list);}
    for(const item of c.unlocatedPlaces||[]){if(item.displayInAtlas===false||item.geographicRelevance==='none'||hidden.has(item.id||item.name))continue;const key=item.id||item.name,list=unlocated.get(key)||[];list.push({...item,sourceSectionId:c.id,sourceSectionTitle:c.title});unlocated.set(key,list);}
   }
   const orderedReferences=[...references];
   if(grouping.actionFirst)orderedReferences.sort((a,b)=>Number(b[1].some(ref=>ref.category==='action'))-Number(a[1].some(ref=>ref.category==='action')));
   for(const [id,occurrences]of orderedReferences){
    // Preserve the category already reviewed for a source chapter. When a
    // part contains an action, select that occurrence and its own source;
    // a mention elsewhere in the part must not replace its evidence.
    const action=occurrences.find(ref=>ref.category==='action');
    const selected=action||occurrences.find(ref=>ref.excerpt?.original?.quote?.trim())||occurrences[0];
    chapter.places.push(id);chapter.placeText.push(selected.scene||'');chapter.placeCategories[id]=action?'action':'mentioned';chapter.placeExcerpts[id]=selected.excerpt;chapter.placeSources[id]=selected.source;chapter.placeOccurrences[id]=occurrences;
   }
   for(const occurrences of unlocated.values()){
    const selected=occurrences.find(item=>item.category==='action'&&(item.excerpt?.original?.quote?.trim()||item.quote?.trim()))||occurrences[0];
    chapter.unlocatedPlaces.push({...selected,occurrences});
   }
   return chapter;
  });
  if(used.size!==sourceChapters.length)throw new Error('Source section omitted from navigation groups');
  // The geographical review has already been applied before category merging.
  const {geographicReview,...book}=input.book;
  return {...input,book:{...book,unit:grouping.unit||book.unit,hashPrefix:grouping.hashPrefix||book.hashPrefix,help:grouping.help||book.help,sidebarTitle:grouping.sidebarTitle||book.sidebarTitle,sidebarNote:review.sidebarNote||book.sidebarNote},places,citedPlaces:{},chapters,sourceChapters:sourceViews};
 }
 const order={books:'id',sections:'book_id,id',places:'book_id,id',sources:'book_id,id',place_descriptions:'book_id,place_id,collection',place_references:'book_id,id',excerpts:'book_id,id',unlocated_settings:'book_id,section_id,ordinal',content_translations:'book_id,language,source_hash'};
 async function loadBook(bookId,config=window.atlasSupabase,options={}){
  if(!/^[a-z0-9-]+$/.test(bookId))throw new Error('Invalid book ID');
  if(!config?.enabled||!/^sb_publishable_/.test(config.publishableKey))throw new Error('Supabase publishable key is not configured');
  const base=new URL(config.url);if(base.protocol!=='https:')throw new Error('Supabase must use HTTPS');
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),20000);
  const headers={apikey:config.publishableKey,Accept:'application/json'};
  async function rows(table){
   const result=[],pageSize=500;
   for(let offset=0;;){
    const url=new URL('/rest/v1/'+table,base);
    url.search=new URLSearchParams({select:'*',order:order[table],limit:String(pageSize),offset:String(offset),[table==='books'?'id':'book_id']:'eq.'+bookId});
    if(table==='books')url.searchParams.set('publication_status','eq.published');
    const response=await fetch(url,{headers,signal:controller.signal,cache:'no-store'});
    if(!response.ok)throw new Error('Supabase '+table+': HTTP '+response.status);
    const batch=await response.json();if(!Array.isArray(batch))throw new Error('Invalid Supabase response');
    result.push(...batch);offset+=batch.length;
    // Continue until empty, even if the server imposes a smaller page limit.
    if(!batch.length)return result;
   }
  }
  try{
   const books=await rows('books');if(!books.length){const error=new Error('Book is not published');error.code='BOOK_UNAVAILABLE';throw error;}
   const bundle={formatVersion:1,tables:{books}};
   await Promise.all(window.atlasContent.tables.filter(t=>t!=='books').map(async table=>{bundle.tables[table]=await rows(table);}));
   const result=window.atlasContent.reconstruct(bundle,bookId);
   if(!options.rawSections)result.data=groupSections(result.data);
   return result;
  }finally{controller.abort();clearTimeout(timer);}
 }
 window.atlasSupabaseData={loadBook,groupSections};
})();
