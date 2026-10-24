/* Geography and interpretative drawings are distinct reading modes. */
(function(root){
 const clone=value=>JSON.parse(JSON.stringify(value));
 function views(input,locale='en'){
  if(input.book.illustratedView)return input.book.illustratedView.views.map(view=>({id:view.id,name:view.names[locale]||view.names.en}));
  return (input.book.illustration?.epochs||[]).map(epoch=>({id:epoch.id,name:epoch.label||epoch.id}));
 }
 function collectViews(data,locale){
  const t=root.atlasI18n?.t||((key)=>key),config=data.book.illustration,sections=data.chapters;
  const valid=excerpt=>excerpt?.original?.quote?.trim()&&!['pending','rejected'].includes(excerpt.original.verificationStatus);
  config.separateViews=true;config.viewsAsSections=true;
  config.emptyNote=t('No illustrated places in this view.');
  data.book.literaryViews=true;data.book.hashPrefix='view';data.book.unit=t('View');
  data.book.sidebarTitle=t('Imaginary views');data.book.help=t('All documented places in the selected literary view.');
  data.book.sidebarNote=config.caption||t('Imaginary views');
  delete data.book.sectionGrouping;
  data.chapters=config.epochs.map((epoch,index)=>{
   const ids=Object.keys(config.anchors[epoch.id]?.positions||{});
   const view={id:epoch.id,title:epoch.label||epoch.id,mapEpoch:index,places:[],placeText:[],placeCategories:{},placeKinds:{},placeNames:{},placeSources:{},placeExcerpts:{},placeOccurrences:{},citations:[],unlocatedPlaces:[],links:[],text:epoch.note||config.caption||t('Literary views')};
   for(const id of ids){
    if(!data.places[id])continue;
    const occurrences=sections.filter(section=>section.places.includes(id)&&!section.illustratedExcluded?.includes(id)&&valid(section.placeExcerpts?.[id]));
    if(!occurrences.length)continue;
    const sameEpoch=occurrences.filter(section=>section.mapEpoch===index);
    const relevant=data.book.nativeEpochViews&&sameEpoch.length?sameEpoch:occurrences;
    const action=relevant.find(section=>section.placeCategories?.[id]!=='mentioned');
    const selected=action||relevant[0];
    view.places.push(id);view.placeText.push(selected.placeText[selected.places.indexOf(id)]);
    view.placeCategories[id]=data.book.nativeEpochViews&&!sameEpoch.length?'mentioned':action?'action':'mentioned';
    view.placeKinds[id]=data.places[id].kind;view.placeNames[id]=data.places[id].name;
    view.placeSources[id]=selected.placeSources?.[id];view.placeExcerpts[id]=selected.placeExcerpts[id];
    view.placeOccurrences[id]=relevant.map(section=>({sectionId:section.id,title:section.title,category:section.placeCategories?.[id]||'action',excerpt:section.placeExcerpts[id]}));
   }
   return view;
  });
  return data;
 }
 function adapt(input,requested,locale='en'){
  const imaginary=requested==='imaginary';
  const native=input.book.mapType==='illustrated';
  if(!imaginary&&!native)return input;
  if(imaginary&&!native&&!input.book.illustratedView)return input;
  const data=imaginary&&!native?root.IllustratedOverlay.adapt(input,locale):clone(input);
  const illustration=data.book.illustration;
  const all={...data.citedPlaces,...data.places};
  const anchors=new Set(Object.values(illustration?.anchors||{}).flatMap(a=>Object.keys(a.positions)));
  const keep=new Set(Object.keys(all).filter(id=>imaginary?anchors.has(id):Array.isArray(all[id].coords)));
  data.places=Object.fromEntries(Object.entries(data.places).filter(([id])=>keep.has(id)));
  data.citedPlaces=Object.fromEntries(Object.entries(data.citedPlaces||{}).filter(([id])=>keep.has(id)));
  for(const chapter of data.chapters){
   const indices=chapter.places.map((id,i)=>keep.has(id)?i:-1).filter(i=>i>=0);
   chapter.placeText=indices.map(i=>chapter.placeText[i]);chapter.places=indices.map(i=>chapter.places[i]);
   chapter.citations=(chapter.citations||[]).filter(ref=>keep.has(ref.placeId));
   chapter.unlocatedPlaces=[];
   if(chapter.overviewPlaces)chapter.overviewPlaces=chapter.overviewPlaces.filter(id=>keep.has(id));
   for(const key of ['placeCategories','placeKinds','placeNames','placeExcerpts','placeSources','placeQuotes','placeOccurrences'])if(chapter[key])chapter[key]=Object.fromEntries(Object.entries(chapter[key]).filter(([id])=>keep.has(id)));
  }
  delete data.sourceChapters;
  delete data.book.exportOriginalGeography;
  delete data.book.geographicReview;
  data.book.atlasMode=imaginary?'imaginary':'geographic';
  if(imaginary){
   for(const place of Object.values({...data.citedPlaces,...data.places})){
    if(place.imagePresentation){Object.assign(place,place.imagePresentation);place.name=place.name.split(' · ')[0];}
    delete place.coords;delete place.regionalOutline;delete place.geographic;delete place.imagePresentation;
   }
   for(const chapter of data.chapters)chapter.placeNames=Object.fromEntries(chapter.places.map(id=>[id,data.places[id]?.name||data.citedPlaces[id]?.name]));
   illustration.geographicPlaces={};illustration.geographicOption=null;illustration.preferIllustratedAnchors=true;
   illustration.emptyNote=(root.atlasI18n?.t||((key)=>key))('No illustrated places in this section.');
   illustration.caption=illustration.caption||(root.atlasI18n?.t||((key)=>key))('Imaginary views');
   data.book.footerHtml='';
   collectViews(data,locale);
  }else{
   data.book.mapType='geographic';delete data.book.illustration;
   const first=Object.values(data.places)[0];data.book.initialView={center:first?[first.coords[1],first.coords[0]]:[0,0],zoom:5};
   const t=root.atlasI18n?.t||((key)=>key);
   data.book.sidebarNote=t('Only geographic places and documented regional positions appear in this atlas.');
   for(const chapter of data.chapters)delete chapter.mapEpoch;
  }
  return data;
 }
 root.AtlasModes={adapt,views};
})(typeof window==='object'?window:globalThis);
