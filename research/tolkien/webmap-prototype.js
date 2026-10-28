/* Research prototype: local X/Y overlays on an explicitly chosen Web Map.
 * No book data or third-party cartography is bundled or published by this file. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.ResearchWebMap=api;
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
        layers[category]=new GraphicsLayer({id:'research-'+category,title:category});map.add(layers[category]);
      }
      paint();
      view=new MapView({container,map,spatialReference,extent:fitExtent(places.filter(p=>p.category==='action')),
        ui:{components:[]},popupEnabled:false,constraints:{rotationEnabled:false,snapToZoom:false},
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
        async select(id){assertLive();if(!graphics.has(id))return false;selectedId=id;paint();await navigate({center:graphics.get(id).geometry});return true;},
        async fit({actionOnly=false}={}){assertLive();await navigate(fitExtent(places.filter(place=>visible[place.category]&&(!actionOnly||place.category==='action'))));},
        destroy(){if(disposed)return;disposed=true;clickHandle?.remove();view.destroy();}
      };
    }catch(error){disposed=true;clickHandle?.remove();if(view)view.destroy();else map?.destroy();throw error;}
  }
  return {create,labels,validatePlaces};
});
