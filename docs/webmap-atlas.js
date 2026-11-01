/* Local X/Y overlays on public ArcGIS Web Maps; no cartography is bundled.
 * ArcGIS JavaScript API is owned by Esri and used under https://www.esri.com/termsofuse */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.AtlasWebMapRenderer=api;
})(typeof globalThis==='object'?globalThis:this,function(){
  'use strict';
  const colors={action:'#19665c',mentioned:'#99502d'};
  function validatePlaces(places){
    const ids=new Set();
    for(const place of places){
      if(typeof place.id!=='string'||!place.id||ids.has(place.id))throw Error('Missing or duplicate place identity');
      ids.add(place.id);
      if(!Object.hasOwn(colors,place.category)||![place.x,place.y].every(Number.isFinite))throw Error('Expected category and finite local X/Y');
      if(Object.hasOwn(place,'coords')||Object.hasOwn(place,'latitude')||Object.hasOwn(place,'longitude'))throw Error('Do not mix local X/Y with terrestrial coordinates');
    }
  }
  function labels(places,visible){
    const next={action:1,mentioned:1};
    return new Map(places.filter(place=>visible[place.category]).map(place=>[place.id,(place.category==='mentioned'?'C':'')+next[place.category]++]));
  }
  async function loadSDK(){
    await import('https://js.arcgis.com/5.1/index.js');
    return globalThis.$arcgis.import(['@arcgis/core/WebMap.js','@arcgis/core/views/MapView.js',
      '@arcgis/core/layers/GraphicsLayer.js','@arcgis/core/Graphic.js','@arcgis/core/geometry/Extent.js']);
  }
  async function create({container,portalItemId,spatialReference,initialExtent,contextLayerIds,
    places=[],onSelect=()=>{},load=loadSDK}){
    if(!/^[a-f\d]{32}$/i.test(portalItemId))throw Error('Invalid Web Map id');
    if(!spatialReference||!(typeof spatialReference.wkt==='string'&&spatialReference.wkt.trim()||Number.isInteger(spatialReference.wkid)))throw Error('Explicit spatial reference required');
    if(!initialExtent||!['xmin','ymin','xmax','ymax'].every(key=>Number.isFinite(initialExtent[key]))||
      initialExtent.xmax<=initialExtent.xmin||initialExtent.ymax<=initialExtent.ymin)throw Error('Finite nonempty editorial extent required');
    if(!Array.isArray(contextLayerIds)||!contextLayerIds.length||contextLayerIds.some(id=>typeof id!=='string'||!id))throw Error('Explicit context layer allowlist required');
    validatePlaces(places);
    const [WebMap,MapView,GraphicsLayer,Graphic,Extent]=await load();
    let map,view,clickHandle,disposed=false,selectedId=null;
    const visible={action:true,mentioned:true},layers={},graphics=new Map();
    const editorial=()=>new Extent({...initialExtent,spatialReference});
    const assertLive=()=>{if(disposed)throw Error('Renderer disposed');};
    async function navigate(target){
      try{await view.goTo(target);}catch(error){if(error.name!=='AbortError')throw error;}
    }
    function fitExtent(points){
      if(!points.length)return editorial();
      const minimumSpan=Math.min(initialExtent.xmax-initialExtent.xmin,initialExtent.ymax-initialExtent.ymin)/100;
      const xs=points.map(p=>p.x),ys=points.map(p=>p.y);
      const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
      const dx=Math.max(maxX-minX,minimumSpan)*.15,dy=Math.max(maxY-minY,minimumSpan)*.15;
      return new Extent({xmin:minX-dx,xmax:maxX+dx,ymin:minY-dy,ymax:maxY+dy,spatialReference});
    }
    function paint(){
      for(const layer of Object.values(layers))layer.removeAll();
      graphics.clear();
      for(const place of places){
        const label=labelsForView.get(place.id);if(!label)continue;
        const geometry={type:'point',x:place.x,y:place.y,spatialReference};
        const attributes={placeId:place.id,category:place.category};
        const marker=new Graphic({geometry,attributes,symbol:{type:'simple-marker',style:'circle',size:30,
          color:colors[place.category],outline:{color:selectedId===place.id?'#e8c565':'#ffffff',width:selectedId===place.id?3.5:2}}});
        layers[place.category].add(marker);
        layers[place.category].add(new Graphic({geometry,attributes,symbol:{type:'text',text:label,color:'#ffffff',
          font:{family:'Arial',size:10,weight:'bold'},verticalAlignment:'middle',horizontalAlignment:'center'}}));
        graphics.set(place.id,marker);
      }
    }
    let labelsForView=labels(places,visible);
    try{
      map=new WebMap({portalItem:{id:portalItemId}});await map.load();
      const available=new Set(map.layers.map(layer=>layer.id));
      for(const id of contextLayerIds)if(!available.has(id))throw Error('Missing context layer: '+id);
      // Remove original route/plot layers from this view, retaining only approved context.
      for(const layer of map.layers.toArray())if(!contextLayerIds.includes(layer.id))map.remove(layer);
      map.basemap=null;
      for(const category of Object.keys(colors)){
        layers[category]=new GraphicsLayer({id:'atlas-'+category,title:category});map.add(layers[category]);
      }
      paint();
      view=new MapView({container,map,spatialReference,extent:fitExtent(places.filter(p=>p.category==='action')),
        ui:{components:[]},navigation:{mouseWheelZoomEnabled:false},padding:{top:55,bottom:35,left:20,right:20},popupEnabled:false,constraints:{rotationEnabled:false,snapToZoom:false},
        background:{color:'#ecf0f5'}});
      await view.when();
      clickHandle=view.on('click',async event=>{
        const result=await view.hitTest(event,{include:Object.values(layers)});
        if(disposed)return;
        const id=result.results.map(item=>item.graphic?.attributes?.placeId).find(id=>graphics.has(id));
        if(id)onSelect(id);
      });
      return {view,map,getLabels:()=>new Map(labelsForView),getSelectedId:()=>selectedId,
        setVisible(category,value){assertLive();if(!Object.hasOwn(visible,category))throw Error('Unknown category');visible[category]=Boolean(value);labelsForView=labels(places,visible);paint();},
        setPlaces(next){assertLive();validatePlaces(next);places=next;if(!places.some(place=>place.id===selectedId))selectedId=null;labelsForView=labels(places,visible);paint();},
        highlight(id){assertLive();selectedId=places.some(p=>p.id===id)?id:null;paint();},
        async select(id){assertLive();if(!graphics.has(id))return false;selectedId=id;paint();await navigate({center:graphics.get(id).geometry});return true;},
        async fit({actionOnly=false}={}){assertLive();await navigate(fitExtent(places.filter(place=>visible[place.category]&&(!actionOnly||place.category==='action'))));},
        destroy(){if(disposed)return;disposed=true;clickHandle?.remove();view.destroy();}
      };
    }catch(error){disposed=true;clickHandle?.remove();if(view)view.destroy();else map?.destroy();throw error;}
  }
  return {create,labels,validatePlaces};
});

(function(root){
 'use strict';
 const languages=['it','en','fr','es'];
 const choose=(value,locale)=>typeof value==='string'?value:value?.[locale]||value?.en||'';
 function validate(payload){
  if(payload?.formatVersion!==1||!Array.isArray(payload.sections)||!payload.sections.length||!payload.map?.portalItemId)throw Error('Invalid Web Map atlas');
  const ids=new Set(Object.keys(payload.places||{}));
  for(const section of payload.sections){
   for(const locale of languages)if(!section.introduction?.[locale]?.trim())throw Error('Section introduction missing');
   const seen=new Set();
   for(const ref of section.references||[]){
    if(!ids.has(ref.placeId)||seen.has(ref.placeId)||!['action','mentioned'].includes(ref.category))throw Error('Invalid Web Map reference');
    if(!ref.original?.quote?.trim()||ref.original.language!=='en'||ref.original.verificationStatus!=='verified'||!ref.original.rightsReviewId)throw Error('Unreviewed quotation');
    seen.add(ref.placeId);
   }
  }
  return payload;
 }
 async function load(bookId,locale='en',config=root.atlasSupabase){
  if(!/^[a-z0-9-]+$/.test(bookId)||!config?.enabled)throw Error('Invalid Web Map book');
  const url=new URL('/rest/v1/book_maps',config.url);
  url.search=new URLSearchParams({select:'metadata',book_id:'eq.'+bookId,id:'eq.reading-map'});
  const response=await fetch(url,{headers:{apikey:config.publishableKey,Accept:'application/json'},cache:'no-store'});
  if(!response.ok)throw Error('Web Map atlas HTTP '+response.status);
  const rows=await response.json(),payload=validate(rows[0]?.metadata?.webmapAtlas);
  const features=await fetch(payload.map.pointService+'/query?'+new URLSearchParams({where:'1=1',outFields:'OBJECTID,Name',returnGeometry:'true',f:'json'})).then(r=>{if(!r.ok)throw Error('Map positions unavailable');return r.json()});
  if(features.error||!features.features?.length)throw Error('Map positions unavailable');
  const points=new Map(features.features.map(f=>[f.attributes.Name.normalize('NFC').trim(),f.geometry]));
  const positions={};
  for(const [id,p]of Object.entries(payload.places)){
   const geometry=points.get(p.mapName.normalize('NFC').trim());
   if(!geometry||![geometry.x,geometry.y].every(Number.isFinite))throw Error('Missing map position: '+p.mapName);
   positions[id]={x:geometry.x,y:geometry.y};
  }
  return adapt(payload,locale,positions);
 }
 function adapt(payload,locale,positions){
  validate(payload);
  const labels=payload.labels[locale]||payload.labels.en;
  const book={...payload.book,title:choose(payload.book.title,locale),subtitle:choose(payload.book.subtitle,locale),description:labels.note,unit:({it:'sezione',en:'section',fr:'section',es:'sección'})[locale]||'section',mapType:'webmap',sidebarTitle:labels.sections,help:labels.help,sidebarNote:labels.note,footerHtml:labels.footerHtml,webmap:{...payload.map,positions,attribution:payload.map.attribution},initialView:{center:[0,0],zoom:4}};
  const places=Object.fromEntries(Object.entries(payload.places).map(([id,p])=>[id,{...p,name:choose(p.names,locale),area:labels.world,kind:'site',status:'',note:labels.precision,method:labels.mapMethod,checked:payload.checked,positionSource:{url:payload.map.projectUrl,label:payload.map.attribution}}]));
  const chapters=payload.sections.map(section=>{
   const chapter={id:section.id,title:section.title,text:section.introduction[locale]||section.introduction.en,time:choose(section.time,locale)||undefined,people:choose(section.people,locale)||undefined,setting:labels.world,places:[],placeText:[],placeCategories:{},placeSources:{},placeExcerpts:{},placeKinds:{},placeNames:{},citations:[],unlocatedPlaces:[],links:[],note:section.references.length?undefined:labels.empty};
   for(const ref of section.references){
    chapter.places.push(ref.placeId);chapter.placeCategories[ref.placeId]=ref.category;
    chapter.placeText.push(chapter.text+' '+choose(ref.discussion,locale));
    chapter.placeSources[ref.placeId]={label:ref.original.attribution};
    chapter.placeExcerpts[ref.placeId]={original:ref.original,translations:{}};
    chapter.placeKinds[ref.placeId]='site';chapter.placeNames[ref.placeId]=places[ref.placeId].name;
   }
   return chapter;
  });
  return {book,places,citedPlaces:{},chapters};
 }
 class WebMapController{
  constructor(config,container,onSelect){this.config=config;this.container=container;this.onSelect=onSelect;this.visible={action:true,mentioned:true};this.geographic=false;}
  points(chapter=this.chapter){return (chapter?.places||[]).map(id=>({id,...this.config.positions[id],category:chapter.placeCategories?.[id]||'action'}));}
  visibleNumbers(chapter,visible){return root.AtlasWebMapRenderer.labels(this.points(chapter),visible);}
  async update(chapter,visible,selected){
   const changed=this.chapter?.id!==chapter.id;this.chapter=chapter;this.visible={...visible};this.selected=selected;
   if(!this.renderer)return;
   this.renderer.setPlaces(this.points());for(const category of ['action','mentioned'])this.renderer.setVisible(category,this.visible[category]);
   this.renderer.highlight(selected);
   if(changed)await this.renderer.fit({actionOnly:true});
  }
  async initialize(){
   this.renderer=await root.AtlasWebMapRenderer.create({container:this.container,...this.config,places:this.points(),onSelect:this.onSelect});
   for(const category of ['action','mentioned'])this.renderer.setVisible(category,this.visible[category]);
   this.renderer.highlight(this.selected);
   await this.renderer.fit({actionOnly:true});
   const credit=root.document?.getElementById('basemap-credits');if(credit)credit.textContent=' · '+this.config.attribution;
   const osm=root.document?.getElementById('osm-credit');if(osm)osm.hidden=true;
   root.addEventListener?.('pagehide',()=>this.renderer?.destroy(),{once:true});
   return this.renderer.view;
  }
  allowGeographicSelection(){}
  focus(id){return this.renderer?.select(id);}
  fit(options){return this.renderer?.fit(options);}
  zoom(factor){const view=this.renderer?.view;if(view)return view.goTo({scale:view.scale*factor},{animate:false}).catch(e=>{if(e.name!=='AbortError')throw e;});}
 }
 root.WebMapAtlasData={load,adapt,validate};root.WebMapController=WebMapController;
})(typeof window==='object'?window:globalThis);
