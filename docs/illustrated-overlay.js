/* Display existing, source-verified records on an editorial panorama.
 * Drawing positions are never terrestrial coordinates. */
(function(root){
 function adapt(input,locale='en'){
  const config=input.book.illustratedView;
  if(!config)return input;
  const copy=value=>JSON.parse(JSON.stringify(value));
  const data=copy(input),text=config.labels[locale]||config.labels.en;
  data.sourceChapters=copy(input.sourceChapters||input.chapters);
  data.places={...data.citedPlaces,...data.places};
  const geographicPlaces={};
  for(const [id,place]of Object.entries(data.places))if(place.coords){
   geographicPlaces[id]={coords:place.coords,zoom:place.zoom};place.geographic=true;
  }
  const positions=Object.assign({},...config.views.map(view=>view.positions));
  const anchors=Object.fromEntries(config.views.map(view=>[view.id,{positions:Object.fromEntries(Object.entries(view.positions).map(([id,p])=>[id,{x:p[0],y:p[1]}]))}]));
  data.book={...data.book,mapType:'illustrated',exportOriginalGeography:true,sidebarNote:text.notice,
   illustration:{width:config.width,height:config.height,core:{xmin:0,ymin:0,xmax:config.width,ymax:config.height,spatialReference:{wkid:3857}},
    epochs:config.views.map(view=>({id:view.id,image:view.image,label:view.names[locale]||view.names.en})),anchors,globalEpoch:0,geographicPlaces,separateViews:true,viewLabel:text.view,
    geographyLabels:{back:text.back,map:text.geographic},caption:text.caption,imageAlt:text.alt,
    basemapURL:root.atlasBasemaps?.find(b=>b.id==='osm')?.url||'https://basemaps.arcgis.com/arcgis/rest/services/OpenStreetMap_v2/VectorTileServer'}};
  for(const chapter of data.chapters){
   chapter.mapEpoch=config.sectionViews?.[chapter.id]??0;
   chapter.placeText=chapter.placeText||[];chapter.placeCategories=chapter.placeCategories||{};
   chapter.placeSources=chapter.placeSources||{};chapter.placeExcerpts=chapter.placeExcerpts||{};
   for(const ref of chapter.citations||[]){
    if(chapter.places.includes(ref.placeId))continue;
    chapter.places.push(ref.placeId);chapter.placeText.push(ref.text||ref.scene||text.reference);
    chapter.placeCategories[ref.placeId]='mentioned';chapter.placeExcerpts[ref.placeId]=ref.excerpt;
    chapter.placeSources[ref.placeId]={label:ref.excerpt?.original?.attribution||'',url:ref.excerpt?.original?.url};
   }
   chapter.citations=[];
   const added=[];
   for(const id of config.placeOrder||Object.keys(positions)){
    const item=(chapter.unlocatedPlaces||[]).find(item=>item.id===id);
    if(!item)continue;
    const excerpt=item.excerpt||{original:{...item,language:item.language||data.book.originalLanguage||'en',type:'original'},translations:item.translations||{}};
    if(!excerpt.original?.quote?.trim()||['pending','rejected'].includes(excerpt.original.verificationStatus))continue;
    const names=config.names[locale]||config.names.en,notes=config.notes[locale]||config.notes.en;
    data.places[id]={name:names[id]||item.name,area:text.area,kind:['pasture','garden','branch','square'].includes(id)?'area':'site',
     note:text.caption,method:text.notice+' '+text.method,status:text.caption,checked:config.checked,
     positionSource:{label:text.caption},narrativeSource:{label:excerpt.original.attribution,url:excerpt.original.url},aliases:item.aliases||[]};
    if(chapter.places.includes(id))continue;
    added.push(id);chapter.places.push(id);chapter.placeText.push(notes[id]||item.text);
    chapter.placeCategories[id]=(config.mentionedOccurrences||[]).includes(chapter.id+':'+id)?'mentioned':item.category==='action'?'action':'mentioned';
    chapter.placeExcerpts[id]=excerpt;chapter.placeSources[id]=data.places[id].narrativeSource;
    item.displayInAtlas=false;
   }
   if(!(config.geographicFirstSections||[]).includes(chapter.id)){
    const scenes=new Map(chapter.places.map((id,index)=>[id,chapter.placeText[index]]));
    const primary=config.views[chapter.mapEpoch].positions;
    chapter.places=[...added.filter(id=>primary[id]),...added.filter(id=>!primary[id]),...chapter.places.filter(id=>!added.includes(id))];chapter.placeText=chapter.places.map(id=>scenes.get(id));
   }
   if(chapter.overviewPlaces)chapter.overviewPlaces=[...chapter.places];
   chapter.placeKinds=Object.fromEntries(chapter.places.map(id=>[id,data.places[id].kind]));
   chapter.placeNames=Object.fromEntries(chapter.places.map(id=>[id,data.places[id].name]));
  }
  return data;
 }
 root.IllustratedOverlay={adapt};
})(typeof window==='object'?window:globalThis);
