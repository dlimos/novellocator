const {locale,t}=window.atlasI18n??{locale:"it",t:key=>key};
const {book,chapters,places:literaryPlaces}=window.atlasData;
const isIllustrated=book.mapType==='illustrated';let illustratedMap=null;
const basemaps=window.atlasBasemaps;
let view=null, markerLayer=null, citedMarkerLayer=null, GraphicClass=null, ExtentClass=null;
let current=0, selectedPlace=0, selectedCitation=-1, viewReady=false;
const allLiteraryPlaces={...window.atlasData.citedPlaces,...literaryPlaces};
const layerQuery=new URLSearchParams(window.location.search).get('layers');
const visibleLayers={action:layerQuery===null||layerQuery.split(',').includes('action'),mentioned:layerQuery===null||layerQuery.split(',').includes('mentioned')};
const markerColors={action:'#19665c',mentioned:'#99502d'};
const mapStage=document.getElementById('map-stage'),fullscreenButton=document.getElementById('map-fullscreen');
const chapterPicker=document.getElementById('map-chapter-picker'),chapterToggle=document.getElementById('map-chapter-toggle'),chapterMenu=document.getElementById('map-chapter-menu');
let expandedFallback=false,fullscreenBusy=false,previousBodyOverflow='';
const mapIsFullscreen=()=>document.fullscreenElement===mapStage||expandedFallback;
const defaultMapPadding={top:55,bottom:35,left:20,right:20};
function updatePopupPadding(recenter=false){
 if(!view)return;
 const padding={...defaultMapPadding},popup=document.getElementById('map-place-popup');
 if(mapIsFullscreen()&&!popup.hidden&&window.innerWidth<=700){
  const mapBounds=document.getElementById('map').getBoundingClientRect?.(),popupBounds=popup.getBoundingClientRect?.();
  if(mapBounds?.height>0&&popupBounds?.height>0){
   padding.bottom=Math.max(padding.bottom,Math.ceil(mapBounds.bottom-popupBounds.top+16));
   padding.bottom=Math.min(padding.bottom,Math.max(defaultMapPadding.bottom,mapBounds.height-padding.top-80));
  }
 }
 const changed=Object.keys(padding).some(key=>view.padding?.[key]!==padding[key]);
 if(changed){view.padding=padding;if(recenter&&!popup.hidden)centerSelectedPlace(false);}
}
function closeChapterMenu(returnFocus=false){chapterMenu.hidden=true;chapterToggle.setAttribute('aria-expanded','false');if(returnFocus)chapterToggle.focus?.();}
function openChapterMenu(focus=false){
 if(!mapIsFullscreen())return;
 const opening=chapterMenu.hidden;
 chapterMenu.hidden=false;chapterToggle.setAttribute('aria-expanded','true');
 if(opening)chapterMenu.children[current+1]?.scrollIntoView?.({block:'nearest'});
 if(focus)chapterMenu.children[current+1]?.focus?.();
}
function updateChapterMenu(){
 Array.from(chapterMenu.children).forEach((button,index)=>button.setAttribute('aria-current',String(index===current+1)));
 chapterToggle.setAttribute('aria-label',t('Choose section')+': '+document.getElementById('map-heading').textContent);
 closeChapterMenu();
}
function closeMapPopup(returnFocus=false){document.getElementById('map-place-popup').hidden=true;updatePopupPadding();if(returnFocus)document.getElementById('map').focus?.();}
function syncFullscreen(){
 const expanded=mapIsFullscreen();mapStage.classList?.toggle('map-expanded',expanded);
 fullscreenButton.textContent=t(expanded?'Exit fullscreen':'Fullscreen');fullscreenButton.setAttribute('aria-label',fullscreenButton.textContent);fullscreenButton.setAttribute('aria-pressed',String(expanded));
 chapterToggle.disabled=!expanded;closeChapterMenu();
 if(!expanded){closeMapPopup();fullscreenButton.focus?.();}
}
async function toggleMapFullscreen(){
 if(fullscreenBusy)return;fullscreenBusy=true;
 try{
  if(document.fullscreenElement===mapStage){await document.exitFullscreen();}
  else if(expandedFallback){expandedFallback=false;if(document.body?.style)document.body.style.overflow=previousBodyOverflow;}
  else{
   if(mapStage.requestFullscreen)try{await mapStage.requestFullscreen();}catch{/* A full-window view is available when native fullscreen is refused. */}
   if(document.fullscreenElement!==mapStage){expandedFallback=true;previousBodyOverflow=document.body?.style?.overflow||'';if(document.body?.style)document.body.style.overflow='hidden';}
  }
 }finally{fullscreenBusy=false;syncFullscreen();}
}
function showMapPopup(focus=false,recenter=true){
 if(!mapIsFullscreen())return;
 const citation=activeCitations()[selectedCitation],id=citation?.placeId||activeChapter().places[selectedPlace],place=allLiteraryPlaces[id];
 if(!place){closeMapPopup();return;}
 const popup=document.getElementById('map-place-popup'),content=document.getElementById('map-popup-content');
 document.getElementById('map-popup-title').textContent=place.name;
 const source=document.getElementById('selected-location');content.innerHTML=source.innerHTML;
 // The same record is shown in the popup; IDs remain unique in the page.
 content.querySelectorAll?.('[id]').forEach(node=>node.removeAttribute('id'));
 const streetView=content.querySelector?.('.street-view-link');if(streetView)streetView.onclick=openStreetView;
 const referenceButtons=source.querySelectorAll?.('.section-link')||[];
 content.querySelectorAll?.('.section-link').forEach((button,index)=>{button.onclick=()=>{referenceButtons[index]?.click();showMapPopup(true);};});
 popup.hidden=false;
 updatePopupPadding(recenter);
 if(focus)document.getElementById('map-popup-close').focus?.();
}
let BasemapClass=null, VectorTileLayerClass=null, activeBasemap=basemaps.find(b=>b.id===new URLSearchParams(window.location.search).get("basemap"))?.id||basemaps[0].id;
const basemapSelect=document.getElementById("basemap-select");
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const list=document.getElementById('places');
const globalPlaceIds=[...new Set(chapters.flatMap(chapter=>chapter.places))];
const globalChapter={id:'all',title:t('All places'),places:globalPlaceIds,placeText:[],placeSources:{},placeExcerpts:{},placeQuotes:{},links:book.links||[],text:t('Explore every mapped location in the novel. Select a place to see the sections in which it appears.'),time:t('Whole novel'),people:t('Global view')};
for(const id of globalPlaceIds){const chapter=chapters.find(section=>section.places.includes(id));globalChapter.placeText.push(chapter.placeText[chapter.places.indexOf(id)]);globalChapter.placeSources[id]=chapter.placeSources?.[id];globalChapter.placeExcerpts[id]=chapter.placeExcerpts?.[id];globalChapter.placeQuotes[id]=chapter.placeQuotes?.[id];}
const activeChapter=()=>current<0?globalChapter:chapters[current];
if(isIllustrated){globalChapter.placeKinds=Object.fromEntries(globalPlaceIds.map(id=>[id,literaryPlaces[id].kind]));globalChapter.placeNames=Object.fromEntries(globalPlaceIds.map(id=>[id,literaryPlaces[id].name]));}
const globalCitations=[...new Map(chapters.flatMap(chapter=>chapter.citations||[]).map(reference=>[reference.placeId,reference])).values()];
const activeCitations=()=>current<0?globalCitations:chapters[current].citations||[];
function placeCategory(id){if(current>=0)return chapters[current].placeCategories?.[id]||'action';return chapters.some(chapter=>chapter.places.includes(id)&&chapter.placeCategories?.[id]!=='mentioned')?'action':'mentioned';}
function updateLayerControls(){
 const chapter=activeChapter();
 document.getElementById('layer-action').checked=visibleLayers.action;
 document.getElementById('layer-mentioned').checked=visibleLayers.mentioned;
 const all=document.getElementById('layer-markers');all.checked=visibleLayers.action&&visibleLayers.mentioned;all.indeterminate=visibleLayers.action!==visibleLayers.mentioned;
 document.getElementById('layer-action-count').textContent=chapter.places.filter(id=>placeCategory(id)==='action').length;
 document.getElementById('layer-mentioned-count').textContent=new Set([...chapter.places.filter(id=>placeCategory(id)==='mentioned'),...activeCitations().map(reference=>reference.placeId)]).size;
}
function setLayerVisibility(category,visible){if(category==='all'){visibleLayers.action=visible;visibleLayers.mentioned=visible}else if(category in visibleLayers)visibleLayers[category]=visible;else return;updateLayerControls();drawMarkers();}
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
document.getElementById('chapter-count').textContent=chapters.filter(chapter=>chapter.places.length||chapter.citations?.length).length+' '+t('mappe');
document.getElementById('chapter-help').textContent=book.help||t('Scegli un capitolo per esplorarne i luoghi.');
document.getElementById('book-note-text').textContent=book.sidebarNote||'';
document.getElementById('atlas-workspace').setAttribute('aria-label',t('Atlante')+': '+book.title);
// Source links are curated editorial content from the book metadata.
document.getElementById('book-sources').innerHTML=book.footerHtml||'';
if(book.citationCsvPrefix){const paragraph=document.createElement('p'),link=document.createElement('a');link.href=book.citationCsvPrefix+'-'+locale+'.csv';link.download='';link.textContent=t('Download cited places (CSV)');paragraph.appendChild(link);document.getElementById('book-sources').appendChild(paragraph);}
if(!isIllustrated)window.atlasCsv?.bind(document.getElementById('book-sources'),window.atlasData,locale);
if(isIllustrated)document.querySelector('.basemap-toolbar').hidden=true;
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
 button.innerHTML=`<span class="place-number">${number(chapter.id)}</span><span class="place-copy"><strong>${esc(chapter.title)}</strong>${chapter.setting?`<small>${esc(chapter.setting)}</small>`:''}</span>`;
 button.addEventListener('click',()=>selectChapter(i));list.appendChild(button);
});
const allSectionsButton=document.createElement('button');allSectionsButton.type='button';allSectionsButton.textContent=t('All places');allSectionsButton.addEventListener('click',()=>{selectAllPlaces();chapterToggle.focus?.();});chapterMenu.appendChild(allSectionsButton);
chapters.forEach((chapter,index)=>{const button=document.createElement('button');button.type='button';button.textContent=number(chapter.id)+' · '+chapter.title;button.addEventListener('click',()=>{selectChapter(index);chapterToggle.focus?.();});chapterMenu.appendChild(button);});
chapterToggle.addEventListener('click',()=>openChapterMenu());
chapterPicker.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')openChapterMenu();});
chapterPicker.addEventListener('pointerleave',event=>{if(event.pointerType==='mouse'&&!chapterMenu.contains?.(document.activeElement))closeChapterMenu();});
chapterPicker.addEventListener('focusout',event=>{if(!chapterPicker.contains?.(event.relatedTarget))closeChapterMenu();});
chapterPicker.addEventListener('keydown',event=>{
 if(!mapIsFullscreen())return;
 if(event.key==='Escape'&&!chapterMenu.hidden){event.preventDefault();event.stopPropagation();closeChapterMenu(true);return;}
 if(['ArrowDown','ArrowUp','Home','End'].includes(event.key)){
  event.preventDefault();const wasClosed=chapterMenu.hidden;openChapterMenu();const buttons=Array.from(chapterMenu.children),index=buttons.indexOf(document.activeElement);
  const next=event.key==='Home'?0:event.key==='End'?buttons.length-1:wasClosed||index<0?current+1:(index+(event.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length;
  buttons[next]?.focus?.();
 }
});
document.addEventListener?.('pointerdown',event=>{if(!chapterPicker.contains?.(event.target))closeChapterMenu();});
function selectChapter(index,move=true,updateHash=true){
 if(!Number.isInteger(index)||index<0||index>=chapters.length)return;
 closeMapPopup();
 current=index;selectedPlace=0;selectedCitation=-1;
 document.getElementById('all-places').setAttribute('aria-pressed','false');
 const chapter=chapters[current];
 Array.from(list.children).forEach((button,i)=>button.setAttribute('aria-pressed',String(i===current)));
 document.getElementById('map-heading').textContent=`${number(chapter.id)} · ${chapter.title}`;
 updateChapterMenu();
 document.getElementById('map').setAttribute('aria-label',`${t('Mappa')} · ${book.unit} ${chapter.id}: ${chapter.title}`);
 document.title=`${number(chapter.id)} · ${chapter.title} — ${book.title} · ${t('Atlante letterario')}`;
 renderDetail();updateLayerControls();drawMarkers();
 if(move&&viewReady)overview();
 if(updateHash)window.location.hash=`${book.hashPrefix}-${chapter.id}`;
 if(window.innerWidth<=700)list.children[current].scrollIntoView({behavior:reduced?'instant':'smooth',block:'nearest',inline:'center'});
}
function selectAllPlaces(move=true,updateHash=true){
 closeMapPopup();
 current=-1;selectedPlace=0;selectedCitation=-1;
 Array.from(list.children).forEach(button=>button.setAttribute('aria-pressed','false'));
 document.getElementById('all-places').setAttribute('aria-pressed','true');
 document.getElementById('map-heading').textContent=t('All places')+' · '+book.title;
 updateChapterMenu();
 document.getElementById('map').setAttribute('aria-label',t('Global view')+' · '+book.title);
 document.title=t('All places')+' — '+book.title+' · '+t('Atlante letterario');
 renderDetail();updateLayerControls();drawMarkers();if(move&&viewReady)overview();
 if(updateHash)window.location.hash=book.hashPrefix+'-all';
}
function renderExcerpts(excerpts,heading){
 if(!excerpts)return '';
 const languageNames={en:'English',fr:'French',ru:'Russian',it:'Italian',es:'Spanish'};
 const records=[];
 for(const item of [excerpts.original,excerpts.translations?.en,excerpts.translations?.[locale]])if(item&&!records.some(record=>record.language===item.language))records.push(item);
 if(!records.length)return '';
 return `<details class="original-excerpt"><summary>${esc(t(heading))} · ${records.map(item=>esc(t(languageNames[item.language]||item.language))).join(' / ')}</summary>${records.map(item=>`<p><strong>${esc(t(item.type==='translation'?'Public-domain translation':'Original text'))} · ${esc(t(languageNames[item.language]||item.language))}</strong></p><blockquote lang="${esc(item.language)}">${esc(item.quote)}</blockquote><p class="excerpt-credit">${esc(item.attribution)}<br>${item.url?`<a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">${esc(t('Read the source'))}</a>`:""}${item.rightsUrl?` · <a href="${esc(item.rightsUrl)}" target="_blank" rel="noopener noreferrer">${esc(t('Edition and rights'))}</a>`:""}</p>`).join('')}</details>`;
}
function renderDetail(){
 const chapter=activeChapter();
 const eyebrow=current<0?esc(t('Whole novel'))+' · '+new Set([...globalPlaceIds,...globalCitations.map(reference=>reference.placeId)]).size+' '+esc(t('mapped places')):esc(book.unit.toUpperCase())+' '+number(chapter.id)+' '+t('DI')+' '+chapters.length+(chapter.english&&chapter.english!==chapter.title?' · '+esc(chapter.english):'');
 document.getElementById('detail').innerHTML=`<div><p class="detail-eyebrow">${eyebrow}</p><h2>${esc(chapter.title)}</h2><div class="tags"><span class="tag">${esc(chapter.time)}</span><span class="tag">${esc(chapter.people)}</span></div><div class="detail-nav"><button type="button" id="previous" aria-label="${esc(t('Sezione precedente'))}" ${current===0?'disabled':''}>${t('Precedente')}</button><button type="button" id="next" aria-label="${esc(t('Sezione successiva'))}" ${current===chapters.length-1?'disabled':''}>${t('Successivo')}</button></div><p class="episode-source">${(chapter.links||book.links).map(link=>`<a class="source-link" href="${esc(link.url)}" target="_blank" rel="noopener noreferrer">${esc(link.label)}</a>`).join("<br>")}</p></div><div class="detail-text"><p>${esc(chapter.text)}</p><h3 class="locations-heading">${t('Luoghi')} <span>${chapter.places.length}</span></h3><div class="location-buttons" id="episode-locations" aria-label="${t('Luoghi')}"></div><div id="selected-location" aria-live="polite"></div>${chapter.note?`<p class="episode-note">${esc(chapter.note)}</p>`:''}</div>`;
 document.getElementById('previous').onclick=()=>selectChapter(current-1);
 document.getElementById('next').onclick=()=>selectChapter(current+1);
 document.getElementById('previous').hidden=current<0;document.getElementById('next').hidden=current<0;
 const locations=document.getElementById('episode-locations');
 chapter.places.forEach((id,i)=>{
  const button=document.createElement('button');button.type='button';button.className='location-button'+(placeCategory(id)==='mentioned'?' cited-location':'');button.setAttribute('aria-pressed',String(i===selectedPlace&&selectedCitation<0));
  button.innerHTML=`<span>${i+1}</span>${esc(literaryPlaces[id].name)}`;
  button.addEventListener('click',()=>selectPlace(i));locations.appendChild(button);
 });
 const citations=activeCitations();
 if(citations.length){const container=document.createElement('section');container.className='citation-selector';const heading=document.createElement('h3');heading.className='locations-heading';heading.textContent=t('Mentioned locations')+' · '+citations.length;container.appendChild(heading);const buttons=document.createElement('div');buttons.className='location-buttons';buttons.id='citation-locations';citations.forEach((reference,index)=>{const button=document.createElement('button');button.type='button';button.className='location-button cited-location';button.setAttribute('aria-pressed',String(index===selectedCitation));button.innerHTML='<span>C'+(index+1)+'</span>'+esc(allLiteraryPlaces[reference.placeId].name);button.addEventListener('click',()=>selectCitation(index));buttons.appendChild(button)});container.appendChild(buttons);document.getElementById('episode-locations').after?.(container);}
 renderLocation();
 if(chapter.unlocatedPlaces?.length){
  const section=document.createElement('section');section.className='unlocated-places';
  section.innerHTML=`<h3>${esc(t('Locations without verified coordinates'))}</h3>${chapter.unlocatedPlaces.map(item=>`<details class="location-evidence"><summary>${esc(item.name)}</summary><p>${esc(item.text)}</p><p><strong>${esc(t('Original text'))} · ${esc(t(item.language==='es'?'Spanish':'English'))}</strong></p><blockquote lang="${item.language||'en'}">${esc(item.quote)}</blockquote>${item.url?`<a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">${esc(t('Read the source'))}</a>`:""}</details>`).join('')}`;
  document.getElementById('selected-location').parentElement.appendChild(section);
 }
}
function renderLocation(){
 const chapter=activeChapter(),citation=activeCitations()[selectedCitation],id=citation?.placeId||chapter.places[selectedPlace],place=allLiteraryPlaces[id],category=citation?'mentioned':placeCategory(id);
 if(!place){document.getElementById('selected-location').innerHTML='<p class="episode-note">'+esc(chapter.emptyMessage||chapter.text)+'</p>'+renderExcerpts(chapter.excerpt,'Passage from the novel');return;}
 const narrativeSource=citation?{label:citation.excerpt.original.attribution,url:citation.excerpt.original.url}:chapter.placeSources?.[id]||place.narrativeSource;
 Array.from(document.getElementById('episode-locations').children).forEach((button,i)=>button.setAttribute('aria-pressed',String(i===selectedPlace&&selectedCitation<0)));
 Array.from(document.getElementById('citation-locations')?.children||[]).forEach((button,i)=>button.setAttribute('aria-pressed',String(i===selectedCitation)));
 const decimals=Number.isInteger(place.coordinateDecimals)&&place.coordinateDecimals>=0&&place.coordinateDecimals<=8?place.coordinateDecimals:place.positionSource.recordId||place.positionSource.councilRecord?6:4;
 const coordinateText=isIllustrated?'':place.coords.map(n=>n.toFixed(decimals)).join(', ');
 if(isIllustrated){
  document.getElementById('selected-location').innerHTML=`<p class="category-badge category-${category}">${esc(t(category==='action'?'Action locations':'Mentioned locations'))}</p><p class="location-scene">${esc(chapter.placeText[selectedPlace])}</p><p class="today">${esc(place.note)}</p><details class="location-evidence"><summary>${t('Posizione e fonti')}</summary><p>${esc(place.method)}</p><p>${esc(narrativeSource?.label||'')}</p></details>`;
 }else{
 document.getElementById('selected-location').innerHTML=`<p class="category-badge category-${category}">${esc(t(category==='action'?'Action locations':'Mentioned locations'))}</p><p class="location-address">${esc(place.area)}</p><p class="location-scene">${esc(citation?t('A geographical reference in the original text. Read the passage for its context.'):chapter.placeText[selectedPlace])}</p><p class="today"><strong>${esc(place.status)}.</strong> ${esc(place.note)}</p><details class="location-evidence"><summary>${t('Posizione e fonti')}</summary><p>${esc(place.method)}</p><p class="coordinates">WGS84 · ${coordinateText}<br>${t('Verifica delle fonti')}: ${esc(new Date(place.checked+"T12:00:00").toLocaleDateString(locale,{day:"numeric",month:"long",year:"numeric"}))}</p><a href="${esc(narrativeSource.url)}" target="_blank" rel="noopener noreferrer">${esc(narrativeSource.label)}</a><br><a href="${esc(place.positionSource.url)}" target="_blank" rel="noopener noreferrer">${esc(place.positionSource.label)}</a>${place.additionalSource?`<br><a href="${esc(place.additionalSource.url)}" target="_blank" rel="noopener noreferrer">${esc(place.additionalSource.label)}</a>`:''}</details>`;
 document.getElementById('selected-location').innerHTML+=`<div class="street-view-action"><a class="street-view-link" id="street-view-link" href="${esc(streetViewUrl(place))}" target="_blank" rel="noopener noreferrer" aria-label="${esc(t('Apri Street View in una nuova finestra')+': '+place.name)}">Google Street View <span aria-hidden="true">↗</span></a><p class="street-view-note">${esc(t('Google mostra il panorama disponibile più vicino: può essere spostato rispetto al punto e dipende dalla copertura.'))}</p></div>`;
 }
 const quote=!citation&&chapter.placeQuotes?.[id];
 if(quote){const evidence=document.createElement('div');evidence.className='original-excerpt';evidence.innerHTML=`<p><strong>${esc(t('Original text (English)'))}</strong></p><blockquote lang="en">${esc(quote)}</blockquote>`;document.getElementById('selected-location').appendChild(evidence);}
 const excerpt=citation?.excerpt||chapter.placeExcerpts?.[id];
 if(excerpt){const evidence=document.createElement('div');evidence.innerHTML=renderExcerpts(excerpt,'Passage from the novel');document.getElementById('selected-location').appendChild(evidence);}
 if(current<0){const references=document.createElement('div');references.className='global-references';const heading=document.createElement('h3');heading.textContent=t('Appears in');references.appendChild(heading);chapters.forEach((section,index)=>{const placeIndex=section.places.indexOf(id),citationIndex=(section.citations||[]).findIndex(reference=>reference.placeId===id);if(placeIndex<0&&citationIndex<0)return;const button=document.createElement('button');button.type='button';button.className='section-link';button.textContent=number(section.id)+' · '+section.title+' · '+t(placeIndex>=0&&section.placeCategories?.[id]!=='mentioned'?'Action locations':'Mentioned locations');button.addEventListener('click',()=>{selectChapter(index,false);if(placeIndex>=0)selectPlace(placeIndex);else selectCitation(citationIndex)});references.appendChild(button)});document.getElementById('selected-location').appendChild(references);}
 if(!isIllustrated)document.getElementById('street-view-link').onclick=openStreetView;
 if(!document.getElementById('map-place-popup').hidden)showMapPopup();
}
function centerSelectedPlace(zoomToPlace=true){
 if(isIllustrated){const id=activeCitations()[selectedCitation]?.placeId||activeChapter().places[selectedPlace];return illustratedMap?.focus(id);}

 if(!viewReady)return;
 const id=activeCitations()[selectedCitation]?.placeId||activeChapter().places[selectedPlace],place=allLiteraryPlaces[id];
 if(place)navigate({center:[place.coords[1],place.coords[0]],...(zoomToPlace?{zoom:place.zoom}:{})});
}
function selectPlace(index,move=true){
 const chapter=activeChapter();if(!Number.isInteger(index)||index<0||index>=chapter.places.length)return;
 selectedPlace=index;selectedCitation=-1;renderLocation();drawMarkers();
 if(move)centerSelectedPlace();
}
function selectCitation(index,move=true){const citation=activeCitations()[index];if(!citation||!Number.isInteger(index))return;selectedCitation=index;renderLocation();drawMarkers();if(move)centerSelectedPlace();}
function drawMarkers(){
 if(isIllustrated){const id=activeCitations()[selectedCitation]?.placeId||activeChapter().places[selectedPlace];illustratedMap?.update(activeChapter(),visibleLayers,id);return;}

 if(!markerLayer||!GraphicClass)return;markerLayer.removeAll();citedMarkerLayer?.removeAll();markerLayer.visible=visibleLayers.action;if(citedMarkerLayer)citedMarkerLayer.visible=visibleLayers.mentioned;
 activeChapter().places.forEach((id,index)=>{
  const place=literaryPlaces[id],active=(index===selectedPlace&&selectedCitation<0)||(current<0&&activeCitations()[selectedCitation]?.placeId===id),category=placeCategory(id),layer=category==='mentioned'&&citedMarkerLayer?citedMarkerLayer:markerLayer;
  const geometry={type:'point',longitude:place.coords[1],latitude:place.coords[0],spatialReference:{wkid:4326}};
  const attributes={placeIndex:index,chapterId:activeChapter().id,category};
  const approximate=['area','uncertain','street'].includes(place.kind);
  layer.add(new GraphicClass({geometry,attributes,symbol:{type:'simple-marker',style:approximate?'diamond':'circle',size:approximate?31:28,color:markerColors[category],outline:{color:active?'#e8c565':'#ffffff',width:active?3.5:2}}}));
  layer.add(new GraphicClass({geometry,attributes,symbol:{type:'text',text:String(index+1),color:'#ffffff',font:{family:'Arial',size:current<0?10:12,weight:'bold'},verticalAlignment:'middle',horizontalAlignment:'center'}}));
 });
 if(citedMarkerLayer)activeCitations().forEach((reference,index)=>{if(current<0&&visibleLayers.action&&globalChapter.places.includes(reference.placeId)&&placeCategory(reference.placeId)==='action')return;const place=allLiteraryPlaces[reference.placeId],active=index===selectedCitation,approximate=['area','uncertain','street'].includes(place.kind),geometry={type:'point',longitude:place.coords[1],latitude:place.coords[0],spatialReference:{wkid:4326}},attributes={citationIndex:index,chapterId:activeChapter().id,category:'mentioned'};citedMarkerLayer.add(new GraphicClass({geometry,attributes,symbol:{type:'simple-marker',style:approximate?'diamond':'circle',size:approximate?31:28,color:markerColors.mentioned,outline:{color:active?'#e8c565':'#ffffff',width:active?3.5:2}}}));citedMarkerLayer.add(new GraphicClass({geometry,attributes,symbol:{type:'text',text:'C'+(index+1),color:'#ffffff',font:{family:'Arial',size:10,weight:'bold'},verticalAlignment:'middle',horizontalAlignment:'center'}}));});
}
function showMapError(message){const notice=document.getElementById('map-error');notice.textContent=t(message);notice.hidden=false}
function navigate(target){if(!viewReady)return;return view.goTo(target,{animate:!reduced,duration:800}).catch(error=>{if(error.name!=='AbortError')console.error('Spostamento della mappa non riuscito',error)})}
function overview(includeCitations=false){
 if(isIllustrated)return illustratedMap?.fit();

 if(!viewReady||!ExtentClass)return;
 const chapter=activeChapter();
 let points=(chapter.overviewPlaces??chapter.places).filter(id=>visibleLayers[placeCategory(id)]).map(id=>literaryPlaces[id]);
 if(visibleLayers.mentioned&&(includeCitations||current<0||!points.length))points.push(...activeCitations().map(reference=>allLiteraryPlaces[reference.placeId]));
 if(!points.length){navigate(chapter.initialView||book.initialView);return;}
 if(points.length===1){navigate({center:[points[0].coords[1],points[0].coords[0]],zoom:points[0].zoom});return}
 const longitudes=points.map(p=>p.coords[1]),latitudes=points.map(p=>p.coords[0]);
 const xmin=Math.min(...longitudes),xmax=Math.max(...longitudes),ymin=Math.min(...latitudes),ymax=Math.max(...latitudes);
 const marginX=Math.max(.002,(xmax-xmin)*.18),marginY=Math.max(.002,(ymax-ymin)*.18);
 navigate(new ExtentClass({xmin:Math.max(-180,xmin-marginX),xmax:Math.min(180,xmax+marginX),ymin:Math.max(-85,ymin-marginY),ymax:Math.min(85,ymax+marginY),spatialReference:{wkid:4326}}));
}
function chapterFromHash(){const prefix='#'+book.hashPrefix+'-';if(!window.location.hash.startsWith(prefix))return 0;const id=window.location.hash.slice(prefix.length);if(id==='all')return -1;const index=chapters.findIndex(chapter=>String(chapter.id)===id);return index<0?0:index}
if(chapterFromHash()<0)selectAllPlaces(false,false);else selectChapter(chapterFromHash(),false,false);
const initialPlace=Number(new URLSearchParams(window.location.search).get('place'));
if(Number.isInteger(initialPlace)&&initialPlace>=0&&initialPlace<activeChapter().places.length)selectPlace(initialPlace);
const initialCitation=new URLSearchParams(window.location.search).get('citation');if(initialCitation!==null)selectCitation(Number(initialCitation));
window.atlasState=()=>({basemap:activeBasemap,place:selectedPlace,citation:selectedCitation,layers:Object.keys(visibleLayers).filter(key=>visibleLayers[key]).join(',')||'none'});
window.addEventListener('hashchange',()=>{const index=chapterFromHash();if(index!==current){if(index<0)selectAllPlaces(true,false);else selectChapter(index,true,false)}});
document.getElementById('all-places').addEventListener('click',()=>selectAllPlaces());
document.getElementById('layer-action').addEventListener('change',event=>setLayerVisibility('action',event.target.checked));
document.getElementById('layer-mentioned').addEventListener('change',event=>setLayerVisibility('mentioned',event.target.checked));
document.getElementById('layer-markers').addEventListener('change',event=>setLayerVisibility('all',event.target.checked));
fullscreenButton.addEventListener('click',toggleMapFullscreen);
document.getElementById('map-popup-close').addEventListener('click',()=>closeMapPopup(true));
document.addEventListener?.('fullscreenchange',syncFullscreen);
window.addEventListener('resize',()=>updatePopupPadding(true));
if(typeof ResizeObserver!=='undefined'){
 const popupResizeObserver=new ResizeObserver(()=>updatePopupPadding(true));
 popupResizeObserver.observe(document.getElementById('map-place-popup'));
 popupResizeObserver.observe(document.getElementById('map'));
}
document.addEventListener?.('keydown',event=>{
 if(event.key==='Escape'){closeMapPopup();if(expandedFallback)toggleMapFullscreen();}
 if(event.key==='Tab'&&expandedFallback){
  const controls=Array.from(mapStage.querySelectorAll('button:not([disabled]),a[href],select:not([disabled]),[tabindex="0"]')).filter(node=>node.offsetParent!==null);
  const first=controls[0],last=controls.at(-1);if(!first)return;
  if(event.shiftKey&&(document.activeElement===first||!mapStage.contains(document.activeElement))){event.preventDefault();last.focus();}
  else if(!event.shiftKey&&(document.activeElement===last||!mapStage.contains(document.activeElement))){event.preventDefault();first.focus();}
 }
});
async function selectMapPoint(event){
 const chapterId=activeChapter().id;
 try{
  const hit=await view.hitTest(event,{include:[markerLayer,citedMarkerLayer].filter(layer=>layer.visible)});
  if(activeChapter().id!==chapterId)return;
  const result=hit.results.find(r=>r.type==='graphic'&&r.graphic.attributes?.chapterId===chapterId&&visibleLayers[r.graphic.attributes.category]&&(Number.isInteger(r.graphic.attributes.placeIndex)||Number.isInteger(r.graphic.attributes.citationIndex)));
  if(!result){closeMapPopup();return;}
  const attributes=result.graphic.attributes;
  if(Number.isInteger(attributes.citationIndex))selectCitation(attributes.citationIndex,false);else selectPlace(attributes.placeIndex,false);
  showMapPopup(true,false);centerSelectedPlace();
 }catch(error){if(error.name!=='AbortError')console.error('Selezione del luogo non disponibile',error)}
}
async function initializeMap(){
 if(isIllustrated){
  illustratedMap=new IllustratedMapController(book.illustration,document.getElementById('map'),id=>{const index=activeChapter().places.indexOf(id);if(index<0)return;selectPlace(index,false);showMapPopup(true);centerSelectedPlace(false)});
  await illustratedMap.update(activeChapter(),visibleLayers,activeChapter().places[selectedPlace]);
  try{const nativeView=await illustratedMap.initialize();view=nativeView;viewReady=true;['overview','zoom-in','zoom-out'].forEach(id=>document.getElementById(id).disabled=false);document.getElementById('map-error').hidden=true;}catch(error){showMapError('The interactive map is unavailable. The illustrated map remains visible.');console.error(error)}
  return;
 }

 let stage='sdk';
 try{
  await import('https://js.arcgis.com/5.1/index.js');
  if(!globalThis.$arcgis?.import)throw new Error('Caricatore ArcGIS non inizializzato');
  const [ArcGISMap,MapView,GraphicsLayer,Graphic,Basemap,Extent,VectorTileLayer]=await globalThis.$arcgis.import(['@arcgis/core/Map.js','@arcgis/core/views/MapView.js','@arcgis/core/layers/GraphicsLayer.js','@arcgis/core/Graphic.js','@arcgis/core/Basemap.js','@arcgis/core/geometry/Extent.js','@arcgis/core/layers/VectorTileLayer.js']);
  stage='view';BasemapClass=Basemap;VectorTileLayerClass=VectorTileLayer;GraphicClass=Graphic;ExtentClass=Extent;markerLayer=new GraphicsLayer({title:t('Action locations'),visible:visibleLayers.action});citedMarkerLayer=new GraphicsLayer({title:t('Mentioned locations'),visible:visibleLayers.mentioned});
  const basemap=createBasemap(activeBasemap);
  const map=new ArcGISMap({basemap,layers:[markerLayer,citedMarkerLayer]});
  // Credits and zoom use HTML to avoid legacy DefaultUI2D components.
  view=new MapView({container:'map',map,center:book.initialView.center,zoom:book.initialView.zoom,ui:{components:[]},constraints:{minZoom:1,maxZoom:19},navigation:{mouseWheelZoomEnabled:false},popupEnabled:false,padding:{...defaultMapPadding}});
  drawMarkers();await view.when();viewReady=true;
  ['overview','zoom-in','zoom-out'].forEach(id=>document.getElementById(id).disabled=false);
  document.getElementById('map-error').hidden=true;overview();
  basemapSelect.disabled=false;
  refreshBasemapCredits(basemap).catch(error=>{if(view.map.basemap===basemap)showMapError('La cartografia non si è caricata. Prova un altro sfondo o verifica la connessione.');console.error(error)});
  view.on('click',selectMapPoint);
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
document.getElementById('overview').addEventListener('click',()=>overview(true));
document.getElementById('zoom-in').addEventListener('click',()=>isIllustrated?illustratedMap?.zoom(.7):navigate({zoom:Math.min(19,view.zoom+1)}));
document.getElementById('zoom-out').addEventListener('click',()=>isIllustrated?illustratedMap?.zoom(1.4):navigate({zoom:Math.max(1,view.zoom-1)}));
initializeMap();
