const {locale,t}=window.atlasI18n??{locale:"it",t:key=>key};
const {book,chapters,places:literaryPlaces}=window.atlasData;
const basemaps=window.atlasBasemaps;
let view=null, markerLayer=null, GraphicClass=null, ExtentClass=null;
let current=0, selectedPlace=0, viewReady=false;
let BasemapClass=null, VectorTileLayerClass=null, activeBasemap=basemaps.find(b=>b.id===new URLSearchParams(window.location.search).get("basemap"))?.id||basemaps[0].id;
const basemapSelect=document.getElementById("basemap-select");
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const list=document.getElementById('places');
const number=id=>String(id).padStart(2,'0');
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function streetViewUrl(place){return 'https://www.google.com/maps/@?api=1&map_action=pano&viewpoint='+encodeURIComponent(place.coords.join(','))}
function openStreetView(event){
 if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||event.button>0)return;
 let popup;
 try{
  popup=window.open('about:blank','_blank','popup=yes,width=1100,height=760');
  if(!popup)return; // The ordinary link remains available when popups are blocked.
  popup.opener=null;
  popup.location.replace(event.currentTarget.href);
  event.preventDefault();
 }catch{if(popup)try{popup.close()}catch{}}
}
document.getElementById('title').innerHTML=esc(book.title)+'<span class="title-dot">.</span>';
document.getElementById('title').className=book.titleSize==='long'?'long-book-title':'';
document.getElementById('book-author').textContent=book.author.toUpperCase()+' · '+book.year;
document.querySelector('meta[name="description"]').content=book.description;
document.getElementById('chapter-list-title').textContent=book.sidebarTitle||'Capitoli';
document.getElementById('chapter-count').textContent=chapters.filter(chapter=>chapter.places.length).length+' '+t('mappe');
document.getElementById('chapter-help').textContent=book.help||t('Scegli un capitolo per esplorarne i luoghi.');
document.getElementById('book-note-text').textContent=book.sidebarNote||'';
document.getElementById('atlas-workspace').setAttribute('aria-label',t('Atlante')+': '+book.title);
// footerHtml is authored in the local dataset, never supplied by visitors.
document.getElementById('book-sources').innerHTML=book.footerHtml||'';
basemaps.forEach(item=>{const option=document.createElement('option');option.value=item.id;option.textContent=t(item.label);basemapSelect.appendChild(option)});
basemapSelect.value=activeBasemap;
document.getElementById('basemap-description').textContent=t(basemaps.find(b=>b.id===activeBasemap).description);
document.getElementById('osm-credit').hidden=activeBasemap!=='osm';
function createBasemap(id){
 const definition=basemaps.find(item=>item.id===id);
 if(!definition)throw new Error('Unknown basemap');
 return definition.url?new BasemapClass({id,title:definition.label,baseLayers:[new VectorTileLayerClass({url:definition.url})]}):BasemapClass.fromId(id);
}
chapters.forEach((chapter,i)=>{
 const button=document.createElement('button');
 button.type='button';button.className='place-button';button.setAttribute('aria-pressed','false');
 button.innerHTML=`<span class="place-number">${number(chapter.id)}</span><span class="place-copy"><strong>${esc(chapter.title)}</strong><small>${esc(chapter.setting)}</small></span>`;
 button.addEventListener('click',()=>selectChapter(i));list.appendChild(button);
});
function selectChapter(index,move=true,updateHash=true){
 if(!Number.isInteger(index)||index<0||index>=chapters.length)return;
 current=index;selectedPlace=0;
 const chapter=chapters[current];
 Array.from(list.children).forEach((button,i)=>button.setAttribute('aria-pressed',String(i===current)));
 document.getElementById('map-heading').textContent=`${number(chapter.id)} · ${chapter.title}`;
 document.getElementById('map').setAttribute('aria-label',`${t('Mappa')} · ${book.unit} ${chapter.id}: ${chapter.title}`);
 document.title=`${number(chapter.id)} · ${chapter.title} — ${book.title} · ${t('Atlante letterario')}`;
 renderDetail();drawMarkers();
 if(move&&viewReady)overview();
 if(updateHash)window.location.hash=`${book.hashPrefix}-${chapter.id}`;
 if(window.innerWidth<=700)list.children[current].scrollIntoView({behavior:reduced?'instant':'smooth',block:'nearest',inline:'center'});
}
function renderDetail(){
 const chapter=chapters[current];
 document.getElementById('detail').innerHTML=`<div><p class="detail-eyebrow">${esc(book.unit.toUpperCase())} ${number(chapter.id)} ${t('DI')} ${chapters.length}${chapter.english&&chapter.english!==chapter.title?` · ${esc(chapter.english)}`:''}</p><h2>${esc(chapter.title)}</h2><div class="tags"><span class="tag">${esc(chapter.time)}</span><span class="tag">${esc(chapter.people)}</span></div><div class="detail-nav"><button type="button" id="previous" aria-label="${esc(t('Sezione precedente'))}" ${current===0?'disabled':''}>${t('Precedente')}</button><button type="button" id="next" aria-label="${esc(t('Sezione successiva'))}" ${current===chapters.length-1?'disabled':''}>${t('Successivo')}</button></div><p class="episode-source">${(chapter.links||book.links).map(link=>`<a class="source-link" href="${esc(link.url)}" target="_blank" rel="noopener noreferrer">${esc(link.label)}</a>`).join("<br>")}</p></div><div class="detail-text"><p>${esc(chapter.text)}</p><h3 class="locations-heading">${t('Luoghi')} <span>${chapter.places.length}</span></h3><div class="location-buttons" id="episode-locations" aria-label="${t('Luoghi')}"></div><div id="selected-location" aria-live="polite"></div>${chapter.note?`<p class="episode-note">${esc(chapter.note)}</p>`:''}</div>`;
 document.getElementById('previous').onclick=()=>selectChapter(current-1);
 document.getElementById('next').onclick=()=>selectChapter(current+1);
 const locations=document.getElementById('episode-locations');
 chapter.places.forEach((id,i)=>{
  const button=document.createElement('button');button.type='button';button.className='location-button';button.setAttribute('aria-pressed',String(i===selectedPlace));
  button.innerHTML=`<span>${i+1}</span>${esc(literaryPlaces[id].name)}`;
  button.addEventListener('click',()=>selectPlace(i));locations.appendChild(button);
 });
 renderLocation();
 if(chapter.unlocatedPlaces?.length){
  const section=document.createElement('section');section.className='unlocated-places';
  section.innerHTML=`<h3>${esc(t('Locations without verified coordinates'))}</h3>${chapter.unlocatedPlaces.map(item=>`<details class="location-evidence"><summary>${esc(item.name)}</summary><p>${esc(item.text)}</p><p><strong>${esc(t('Original text (English)'))}</strong></p><blockquote lang="en">${esc(item.quote)}</blockquote><a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">${esc(t('Read the source'))}</a></details>`).join('')}`;
  document.getElementById('selected-location').parentElement.appendChild(section);
 }
}
function renderLocation(){
 const chapter=chapters[current],place=literaryPlaces[chapter.places[selectedPlace]];
 if(!place){document.getElementById('selected-location').innerHTML='<p class="episode-note">'+esc(chapter.emptyMessage||chapter.text)+'</p>';return;}
 const narrativeSource=chapter.placeSources?.[chapter.places[selectedPlace]]||place.narrativeSource;
 Array.from(document.getElementById('episode-locations').children).forEach((button,i)=>button.setAttribute('aria-pressed',String(i===selectedPlace)));
 const decimals=Number.isInteger(place.coordinateDecimals)&&place.coordinateDecimals>=0&&place.coordinateDecimals<=8?place.coordinateDecimals:place.positionSource.recordId||place.positionSource.councilRecord?6:4;
 const coordinateText=place.coords.map(n=>n.toFixed(decimals)).join(', ');
 document.getElementById('selected-location').innerHTML=`<p class="location-address">${esc(place.area)}</p><p class="location-scene">${esc(chapter.placeText[selectedPlace])}</p><p class="today"><strong>${esc(place.status)}.</strong> ${esc(place.note)}</p><details class="location-evidence"><summary>${t('Posizione e fonti')}</summary><p>${esc(place.method)}</p><p class="coordinates">WGS84 · ${coordinateText}<br>${t('Verifica delle fonti')}: ${esc(new Date(place.checked+"T12:00:00").toLocaleDateString(locale,{day:"numeric",month:"long",year:"numeric"}))}</p><a href="${esc(narrativeSource.url)}" target="_blank" rel="noopener noreferrer">${esc(narrativeSource.label)}</a><br><a href="${esc(place.positionSource.url)}" target="_blank" rel="noopener noreferrer">${esc(place.positionSource.label)}</a>${place.additionalSource?`<br><a href="${esc(place.additionalSource.url)}" target="_blank" rel="noopener noreferrer">${esc(place.additionalSource.label)}</a>`:''}</details>`;
 document.getElementById('selected-location').innerHTML+=`<div class="street-view-action"><a class="street-view-link" id="street-view-link" href="${esc(streetViewUrl(place))}" target="_blank" rel="noopener noreferrer" aria-label="${esc(t('Apri Street View in una nuova finestra')+': '+place.name)}">Google Street View <span aria-hidden="true">↗</span></a><p class="street-view-note">${esc(t('Google mostra il panorama disponibile più vicino: può essere spostato rispetto al punto e dipende dalla copertura.'))}</p></div>`;
 const quote=chapter.placeQuotes?.[chapter.places[selectedPlace]];
 if(quote){const evidence=document.createElement('div');evidence.className='original-excerpt';evidence.innerHTML=`<p><strong>${esc(t('Original text (English)'))}</strong></p><blockquote lang="en">${esc(quote)}</blockquote>`;document.getElementById('selected-location').appendChild(evidence);}
 document.getElementById('street-view-link').onclick=openStreetView;
}
function selectPlace(index){
 const chapter=chapters[current];if(!Number.isInteger(index)||index<0||index>=chapter.places.length)return;
 selectedPlace=index;renderLocation();drawMarkers();
 if(viewReady){const place=literaryPlaces[chapter.places[selectedPlace]];navigate({center:[place.coords[1],place.coords[0]],zoom:place.zoom})}
}
function drawMarkers(){
 if(!markerLayer||!GraphicClass)return;markerLayer.removeAll();
 chapters[current].places.forEach((id,index)=>{
  const place=literaryPlaces[id],active=index===selectedPlace;
  const geometry={type:'point',longitude:place.coords[1],latitude:place.coords[0],spatialReference:{wkid:4326}};
  const attributes={placeIndex:index,chapterId:chapters[current].id};
  const approximate=['area','uncertain','street'].includes(place.kind);
  markerLayer.add(new GraphicClass({geometry,attributes,symbol:{type:'simple-marker',style:approximate?'diamond':'circle',size:approximate?29:26,color:active?'#e8c565':'#1b302e',outline:{color:active?'#1b302e':'#ffffff',width:active?2.5:1.5}}}));
  markerLayer.add(new GraphicClass({geometry,attributes,symbol:{type:'text',text:String(index+1),color:active?'#1b302e':'#ffffff',font:{family:'Arial',size:11,weight:'bold'},verticalAlignment:'middle',horizontalAlignment:'center'}}));
 });
}
function showMapError(message){const notice=document.getElementById('map-error');notice.textContent=t(message);notice.hidden=false}
function navigate(target){if(!viewReady)return;return view.goTo(target,{animate:!reduced,duration:800}).catch(error=>{if(error.name!=='AbortError')console.error('Spostamento della mappa non riuscito',error)})}
function overview(){
 if(!viewReady||!ExtentClass)return;
 const chapter=chapters[current];
 const points=(chapter.overviewPlaces??chapter.places).map(id=>literaryPlaces[id]);
 if(!points.length){navigate(chapter.initialView||book.initialView);return;}
 if(points.length===1){navigate({center:[points[0].coords[1],points[0].coords[0]],zoom:points[0].zoom});return}
 const longitudes=points.map(p=>p.coords[1]),latitudes=points.map(p=>p.coords[0]);
 const xmin=Math.min(...longitudes),xmax=Math.max(...longitudes),ymin=Math.min(...latitudes),ymax=Math.max(...latitudes);
 const marginX=Math.max(.002,(xmax-xmin)*.18),marginY=Math.max(.002,(ymax-ymin)*.18);
 navigate(new ExtentClass({xmin:xmin-marginX,xmax:xmax+marginX,ymin:ymin-marginY,ymax:ymax+marginY,spatialReference:{wkid:4326}}));
}
function chapterFromHash(){const prefix='#'+book.hashPrefix+'-';if(!window.location.hash.startsWith(prefix))return 0;const id=window.location.hash.slice(prefix.length);const index=chapters.findIndex(chapter=>String(chapter.id)===id);return index<0?0:index}
selectChapter(chapterFromHash(),false,false);
const initialPlace=Number(new URLSearchParams(window.location.search).get('place'));
if(Number.isInteger(initialPlace)&&initialPlace>=0&&initialPlace<chapters[current].places.length)selectPlace(initialPlace);
window.atlasState=()=>({basemap:activeBasemap,place:selectedPlace});
window.addEventListener('hashchange',()=>{const index=chapterFromHash();if(index!==current)selectChapter(index,true,false)});
async function initializeMap(){
 let stage='sdk';
 try{
  await import('https://js.arcgis.com/5.1/index.js');
  if(!globalThis.$arcgis?.import)throw new Error('Caricatore ArcGIS non inizializzato');
  const [ArcGISMap,MapView,GraphicsLayer,Graphic,Basemap,Extent,VectorTileLayer]=await globalThis.$arcgis.import(['@arcgis/core/Map.js','@arcgis/core/views/MapView.js','@arcgis/core/layers/GraphicsLayer.js','@arcgis/core/Graphic.js','@arcgis/core/Basemap.js','@arcgis/core/geometry/Extent.js','@arcgis/core/layers/VectorTileLayer.js']);
  stage='view';BasemapClass=Basemap;VectorTileLayerClass=VectorTileLayer;GraphicClass=Graphic;ExtentClass=Extent;markerLayer=new GraphicsLayer({title:'Luoghi del romanzo'});
  const basemap=createBasemap(activeBasemap);
  const map=new ArcGISMap({basemap,layers:[markerLayer]});
  // Credits and zoom use HTML to avoid legacy DefaultUI2D components.
  view=new MapView({container:'map',map,center:book.initialView.center,zoom:book.initialView.zoom,ui:{components:[]},constraints:{minZoom:3,maxZoom:19},navigation:{mouseWheelZoomEnabled:false},popupEnabled:false,padding:{top:55,bottom:35,left:20,right:20}});
  drawMarkers();await view.when();viewReady=true;
  ['overview','zoom-in','zoom-out'].forEach(id=>document.getElementById(id).disabled=false);
  document.getElementById('map-error').hidden=true;overview();
  basemapSelect.disabled=false;
  refreshBasemapCredits(basemap).catch(error=>{if(view.map.basemap===basemap)showMapError('La cartografia non si è caricata. Prova un altro sfondo o verifica la connessione.');console.error(error)});
  view.on('click',async event=>{const chapterId=chapters[current].id;try{const hit=await view.hitTest(event,{include:markerLayer});if(chapters[current].id!==chapterId)return;const result=hit.results.find(r=>r.type==='graphic'&&r.graphic.attributes?.chapterId===chapterId&&Number.isInteger(r.graphic.attributes?.placeIndex));if(result)selectPlace(result.graphic.attributes.placeIndex)}catch(error){if(error.name!=='AbortError')console.error('Selezione del luogo non disponibile',error)}});
 }catch(error){viewReady=false;['overview','zoom-in','zoom-out'].forEach(id=>document.getElementById(id).disabled=true);showMapError(stage==='sdk'?'La libreria Esri non si è caricata. Verifica la connessione e che il browser consenta l’accesso a js.arcgis.com.':'La mappa Esri non ha completato l’avvio.');console.error(`Mappa ArcGIS non disponibile (${stage})`,error)}
}
async function refreshBasemapCredits(basemap){
 await basemap.loadAll();
 if(view.map.basemap!==basemap)return;
 const credits=[...basemap.baseLayers.toArray(),...basemap.referenceLayers.toArray()].map(layer=>layer.copyright).filter(Boolean);
 document.getElementById('basemap-credits').textContent=[...new Set(credits)].join(' · ')||basemap.portalItem?.accessInformation||'Esri';
}
async function switchBasemap(id){
 if(!viewReady||!basemaps.some(item=>item.id===id))return;
 const previous=view.map.basemap,oldId=activeBasemap;basemapSelect.disabled=true;
 try{
  const next=createBasemap(id);
  // Load before swapping, so a failed request leaves the existing map visible.
  await next.loadAll();view.map.basemap=next;activeBasemap=id;
  await refreshBasemapCredits(next);
  document.getElementById('basemap-description').textContent=t(basemaps.find(item=>item.id===id).description);
  document.getElementById('osm-credit').hidden=id!=='osm';
  document.getElementById('map-error').hidden=true;
 }catch(error){view.map.basemap=previous;activeBasemap=oldId;basemapSelect.value=oldId;showMapError('Questo sfondo non è disponibile. È stato mantenuto lo sfondo precedente.');console.error('Cambio cartografia non riuscito',error)}
 finally{basemapSelect.disabled=false}
}
basemapSelect.addEventListener('change',()=>switchBasemap(basemapSelect.value));
document.getElementById('overview').addEventListener('click',overview);
document.getElementById('zoom-in').addEventListener('click',()=>navigate({zoom:Math.min(19,view.zoom+1)}));
document.getElementById('zoom-out').addEventListener('click',()=>navigate({zoom:Math.max(3,view.zoom-1)}));
initializeMap();
