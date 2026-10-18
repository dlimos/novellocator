function applyGeographicReview(input){
 const review=input.book.geographicReview;
 if(!review?.regionalPlaces?.length&&!review?.hiddenUnlocatedKeys?.length)return input;
 // Work on a view copy: the imported text, quotations and analysis stay intact.
 const data={...input,places:{...input.places},chapters:input.chapters.map(chapter=>({...chapter,places:[...(chapter.places||[])],placeText:[...(chapter.placeText||[])],...(chapter.overviewPlaces?{overviewPlaces:[...chapter.overviewPlaces]}:{}),placeCategories:{...chapter.placeCategories},placeSources:{...chapter.placeSources},placeExcerpts:{...chapter.placeExcerpts},unlocatedPlaces:(chapter.unlocatedPlaces||[]).map(item=>({...item}))}))};
 const hidden=new Set(review.hiddenUnlocatedKeys||[]);
 if(review.sidebarNote)data.book={...data.book,sidebarNote:review.sidebarNote};
 if(review.sectionNote)for(const chapter of data.chapters)chapter.note=review.sectionNote;
 for(const chapter of data.chapters)for(const item of chapter.unlocatedPlaces){
  const key=item.id||item.name;
  if(review.coveredSettings?.[chapter.id]?.[key]){item.displayInAtlas=false;item.mappedPlaceId=review.coveredSettings[chapter.id][key];}
  if(review.unlocatedNote)item.text=review.unlocatedNote;
  if(hidden.has(key))item.displayInAtlas=false;
  const region=(review.regionalPlaces||[]).find(record=>(record.keys||[]).includes(key));
  if(!region)continue;
  data.places[region.id]=region.place;
  item.displayInAtlas=false;
  item.mappedPlaceId=region.id;
  if(chapter.places.includes(region.id))continue;
  const priority=region.categories?.[chapter.id]==='action'?(region.evidencePriority||region.keys):region.keys;
  const evidence=chapter.unlocatedPlaces.filter(candidate=>region.keys.includes(candidate.id||candidate.name)).sort((a,b)=>priority.indexOf(a.id||a.name)-priority.indexOf(b.id||b.name))[0]||item;
  chapter.places.push(region.id);
  if(chapter.overviewPlaces&&!chapter.overviewPlaces.includes(region.id))chapter.overviewPlaces.push(region.id);
  chapter.placeText.push(region.scenes?.[chapter.id]||region.sceneText);
  chapter.placeCategories[region.id]=region.categories?.[chapter.id]||'mentioned';
  chapter.placeSources[region.id]={url:evidence.url||region.place.narrativeSource.url,label:region.evidenceLabel};
  // A pending original is kept pending; a geographical review cannot supply it.
  if(evidence.excerpt?.original?.quote?.trim())chapter.placeExcerpts[region.id]=evidence.excerpt;
  else if(evidence.quote?.trim())chapter.placeExcerpts[region.id]={original:{quote:evidence.quote,language:evidence.language||input.book.originalLanguage||'en',type:'original',attribution:evidence.attribution||[input.book.author,input.book.title,chapter.title].join(' · '),url:evidence.url,rightsUrl:evidence.rightsUrl||evidence.url,highlightTerms:evidence.highlightTerms||evidence.aliases||[]},translations:evidence.translations||{}};
 }
 for(const chapter of data.chapters)for(const region of review.regionalPlaces||[]){
  const occurrence=region.sectionOccurrences?.[chapter.id];if(!occurrence)continue;
  data.places[region.id]=region.place;
  let index=chapter.places.indexOf(region.id);if(index<0){index=chapter.places.length;chapter.places.push(region.id);}
  if(chapter.overviewPlaces&&!chapter.overviewPlaces.includes(region.id))chapter.overviewPlaces.push(region.id);
  chapter.placeText[index]=occurrence.scene;chapter.placeCategories[region.id]=occurrence.category;
  chapter.placeSources[region.id]=occurrence.source;chapter.placeExcerpts[region.id]=occurrence.excerpt;
 }
 return data;
}
window.atlasData=applyGeographicReview(window.atlasData);
window.atlasData=window.AtlasModes?window.AtlasModes.adapt(window.atlasData,new URLSearchParams(window.location.search).get('mode'),window.atlasI18n?.locale||'en'):window.IllustratedOverlay?.adapt(window.atlasData,window.atlasI18n?.locale||'en')||window.atlasData;
const {locale,t}=window.atlasI18n??{locale:"it",t:key=>key};
const {book,chapters,places:literaryPlaces}=window.atlasData;
const isIllustrated=book.mapType==='illustrated';let illustratedMap=null;
const basemaps=window.atlasBasemaps;
let view=null, markerLayer=null, citedMarkerLayer=null, GraphicClass=null, ExtentClass=null;
let current=0, selectedPlace=0, selectedCitation=-1, viewReady=false;
const allLiteraryPlaces={...window.atlasData.citedPlaces,...literaryPlaces};
const regionLegend=document.getElementById('regional-outline-legend');
if(regionLegend){regionLegend.hidden=!Object.values(allLiteraryPlaces).some(place=>place.regionalOutline);regionLegend.textContent=t('Dashed outline: documented geographical region, not the town boundary.');}
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
function showMapPopup(focus=false,recenter=true,reference=null){
 if(!mapIsFullscreen())return;
 const citation=activeCitations()[selectedCitation],id=citation?.placeId||activeChapter().places[selectedPlace],place=allLiteraryPlaces[id];
 if(!place){closeMapPopup();return;}
 const popup=document.getElementById('map-place-popup'),content=document.getElementById('map-popup-content');
 document.getElementById('map-popup-title').textContent=place.name;
 if(reference){
  const chapter=chapters[reference.chapterIndex],placeIndex=chapter.places.indexOf(reference.placeId),citation=(chapter.citations||[]).find(item=>item.placeId===reference.placeId);
  renderLocation({chapter,placeIndex,citation:placeIndex>=0?null:citation,target:content,referencePlaceId:reference.placeId});
 }else renderLocation({target:content});
 // Popup references render their own chapter context without changing map selection.
 content.querySelectorAll?.('[id]').forEach(node=>node.removeAttribute('id'));
 const streetView=content.querySelector?.('.street-view-link');if(streetView)streetView.onclick=openStreetView;
 popup.hidden=false;
 updatePopupPadding(recenter);
 if(focus)document.getElementById('map-popup-close').focus?.();
}
let BasemapClass=null, VectorTileLayerClass=null, activeBasemap=basemaps.find(b=>b.id===new URLSearchParams(window.location.search).get("basemap"))?.id||basemaps[0].id;
const basemapSelect=document.getElementById("basemap-select");
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const list=document.getElementById('places');
const globalPlaceIds=[...new Set(chapters.flatMap(chapter=>chapter.places))];
const hasAction=id=>chapters.some(section=>section.places.includes(id)&&section.placeCategories?.[id]!=='mentioned');
if(book.sectionGrouping?.actionFirst)globalPlaceIds.sort((a,b)=>Number(hasAction(b))-Number(hasAction(a)));
const globalChapter={id:'all',title:t('All places'),places:globalPlaceIds,placeText:[],placeSources:{},placeExcerpts:{},placeQuotes:{},links:book.links||[],text:t('Explore every mapped location in the novel. Select a place to see the sections in which it appears.'),time:t('Whole novel'),people:t('Global view')};
for(const id of globalPlaceIds){const chapter=(book.sectionGrouping?.actionFirst&&chapters.find(section=>section.places.includes(id)&&section.placeCategories?.[id]!=='mentioned'))||chapters.find(section=>section.places.includes(id));globalChapter.placeText.push(chapter.placeText[chapter.places.indexOf(id)]);globalChapter.placeSources[id]=chapter.placeSources?.[id];globalChapter.placeExcerpts[id]=chapter.placeExcerpts?.[id];globalChapter.placeQuotes[id]=chapter.placeQuotes?.[id];}
const activeChapter=()=>current<0?globalChapter:chapters[current];
if(isIllustrated){globalChapter.placeKinds=Object.fromEntries(globalPlaceIds.map(id=>[id,literaryPlaces[id].kind]));globalChapter.placeNames=Object.fromEntries(globalPlaceIds.map(id=>[id,literaryPlaces[id].name]));globalChapter.placeCategories=Object.fromEntries(globalPlaceIds.map(id=>[id,chapters.some(section=>section.places.includes(id)&&section.placeCategories?.[id]!=='mentioned')?'action':'mentioned']));}
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
document.getElementById('title').textContent=book.title.replace(/\.\s*$/,'');
document.getElementById('title').className=book.titleSize==='long'?'long-book-title':'';
window.atlasPresentation?.fitTitle?.();
document.getElementById('book-author').textContent=book.author.toUpperCase()+' · '+book.year;
document.querySelector('meta[name="description"]').content=book.description;
document.getElementById('chapter-list-title').textContent=book.sidebarTitle||'Capitoli';
document.getElementById('chapter-count').textContent=chapters.filter(chapter=>chapter.places.length||chapter.citations?.length).length+' '+t(book.literaryViews?'Views':'mappe');
document.getElementById('chapter-help').textContent=book.help||t('Scegli un capitolo per esplorarne i luoghi.');
document.getElementById('book-note-text').textContent=book.sidebarNote||'';
document.getElementById('atlas-workspace').setAttribute('aria-label',t('Atlante')+': '+book.title);
// Source links are curated editorial content from the book metadata.
const textSourceUrls=new Set();
const sourceAddress=value=>{try{const u=new URL(value);return u.origin+u.pathname;}catch{return value;}};
function rememberTextSource(source){if(source?.url)textSourceUrls.add(sourceAddress(source.url));if(source?.rightsUrl)textSourceUrls.add(sourceAddress(source.rightsUrl));}
for(const link of book.links||[])rememberTextSource(link);
for(const section of window.atlasData.sourceChapters||chapters){
 for(const link of section.links||[])rememberTextSource(link);
 for(const source of Object.values(section.placeSources||{}))rememberTextSource(source);
 for(const group of [section.excerpts,...Object.values(section.placeExcerpts||{}),...(section.citations||[]).map(r=>r.excerpt),...(section.unlocatedPlaces||[]).map(r=>r.excerpt||{original:r,translations:r.translations})]){
  rememberTextSource(group?.original);for(const passage of Object.values(group?.translations||{}))rememberTextSource(passage);
 }
}
function isTextSourceLink(url){return textSourceUrls.has(sourceAddress(url))||/^https?:\/\/([^/]*\.)?(fliphtml5\.com|wikisource\.org|gutenberg\.org|gutenberg\.ca|standardebooks\.org|tolstoy\.ru|imwerden\.de)(\/|$)/i.test(url)||/\/uploads\/.*\.pdf(?:[?#]|$)/i.test(url);}
function publicSourceLink(source){return isTextSourceLink(source.url)?`<span>${esc(source.label)}</span>`:`<a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.label)}</a>`;}
document.getElementById('book-sources').innerHTML=book.footerHtml||'';
for(const link of document.getElementById('book-sources').querySelectorAll?.('a[href]')||[])if(isTextSourceLink(link.getAttribute('href')))link.removeAttribute('href');
if(book.citationCsvPrefix){const paragraph=document.createElement('p'),link=document.createElement('a');link.href=book.citationCsvPrefix+'-'+locale+'.csv';link.download='';link.textContent=t('Download cited places (CSV)');paragraph.appendChild(link);document.getElementById('book-sources').appendChild(paragraph);}
if(!isIllustrated||book.exportOriginalGeography)window.atlasCsv?.bind(document.getElementById('book-sources'),window.atlasData,locale);
if(isIllustrated)document.querySelector('.basemap-toolbar').hidden=true;
basemaps.forEach(item=>{const option=document.createElement('option');option.value=item.id;option.textContent=t(item.label);basemapSelect.appendChild(option)});
basemapSelect.value=activeBasemap;
document.getElementById('basemap-description').textContent=t(basemaps.find(b=>b.id===activeBasemap).description);
document.getElementById('osm-credit').hidden=isIllustrated||activeBasemap!=='osm';
function createBasemap(id){
 const definition=basemaps.find(item=>item.id===id);
 if(!definition)throw new Error('Unknown basemap');
 return definition.url?new BasemapClass({id,title:definition.label,baseLayers:[new VectorTileLayerClass({url:definition.url})]}):BasemapClass.fromId(id);
}
chapters.forEach((chapter,i)=>{
 const button=document.createElement('button');
 button.type='button';button.className='place-button';button.setAttribute('aria-pressed','false');
 button.innerHTML=`${book.literaryViews?'':`<span class="place-number">${number(chapter.id)}</span>`}<span class="place-copy"><strong>${esc(chapter.title)}</strong>${chapter.setting?`<small>${esc(chapter.setting)}</small>`:''}</span>`;
 button.addEventListener('click',()=>selectChapter(i));list.appendChild(button);
});
const allSectionsButton=document.createElement('button');allSectionsButton.type='button';allSectionsButton.textContent=t('All places');allSectionsButton.addEventListener('click',()=>{selectAllPlaces();chapterToggle.focus?.();});chapterMenu.appendChild(allSectionsButton);
if(book.literaryViews){allSectionsButton.hidden=true;document.getElementById('all-places').hidden=true;}
chapters.forEach((chapter,index)=>{const button=document.createElement('button');button.type='button';button.textContent=(book.literaryViews?'':number(chapter.id)+' · ')+chapter.title;button.addEventListener('click',()=>{selectChapter(index);chapterToggle.focus?.();});chapterMenu.appendChild(button);});
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
 document.getElementById('map-heading').textContent=(book.literaryViews?'':number(chapter.id)+' · ')+chapter.title;
 updateChapterMenu();
 document.getElementById('map').setAttribute('aria-label',`${t('Mappa')} · ${book.unit} ${chapter.id}: ${chapter.title}`);
 document.title=(book.literaryViews?'':number(chapter.id)+' · ')+`${chapter.title} — ${book.title} · ${t('Atlante letterario')}`;
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
// Keep quotation text literal: only insert escaped text and presentation markup.
function quoteNameKey(value){return String(value).normalize('NFD').replace(/\p{M}/gu,'').replace(/[‘’]/g,"'").toLowerCase();}
let quoteNameIndex;
function quotePlaceNames(place){
 const names=new Set([place?.name,...(place?.aliases||[])].filter(value=>typeof value==='string'&&value.trim()));
 if(!quoteNameIndex){
  quoteNameIndex=new Map();
  for(const dictionary of Object.values(window.atlasTranslations||{}))for(const [original,translated] of Object.entries(dictionary))if(typeof translated==='string'){
   for(const name of [original,translated]){const key=quoteNameKey(name);if(!quoteNameIndex.has(key))quoteNameIndex.set(key,new Set());quoteNameIndex.get(key).add(original);quoteNameIndex.get(key).add(translated);}
  }
 }
 for(const name of names)for(const alias of quoteNameIndex.get(quoteNameKey(name))||[])names.add(alias);
 return [...names].flatMap(name=>[name,...name.split(/\s*·\s*|\s+\/\s+|[()]/)]).map(name=>name.trim()).filter(name=>name.length>1);
}
function renderQuote(quote,places=[],terms=null){
 const text=String(quote),offsets=[],characters=[];
 let offset=0;
 for(const character of text){const key=quoteNameKey(character);for(const unit of key){characters.push(unit);offsets.push({start:offset,end:offset+character.length});}if(!key&&offsets.length)offsets.at(-1).end=offset+character.length;offset+=character.length;}
 const normalized=characters.join(''),ranges=[];
 const isWord=character=>character&&/[\p{L}\p{N}\p{M}]/u.test(character);
 // Passage-specific evidence takes precedence over aliases from other scenes.
 const names=terms??places.flatMap(quotePlaceNames);
 for(const term of names){
  const key=quoteNameKey(term);if(!key)continue;
  let start=normalized.indexOf(key);
  while(start>=0){const end=start+key.length;
   if(!isWord(normalized[start-1])&&!isWord(normalized[end]))ranges.push({start:offsets[start].start,end:offsets[end-1].end});
   start=normalized.indexOf(key,start+key.length);
  }
 }
 ranges.sort((a,b)=>a.start-b.start||b.end-a.end);
 const merged=[];for(const range of ranges){const previous=merged.at(-1);if(previous&&range.start<previous.end)previous.end=Math.max(previous.end,range.end);else merged.push({...range});}
 let html='',cursor=0;for(const range of merged){html+=esc(text.slice(cursor,range.start))+'<strong class="quote-place">'+esc(text.slice(range.start,range.end))+'</strong>';cursor=range.end;}
 return html+esc(text.slice(cursor));
}
const excerptLanguageNames={en:'English',fr:'French',ru:'Russian',it:'Italian',es:'Spanish'};
function availablePassages(excerpts){
 const records=[excerpts?.original,...Object.values(excerpts?.translations||{})],languages=new Set();
 return records.filter(item=>{
  if(!item?.quote?.trim()||!item.language||item.verificationStatus==='rejected'||item.verificationStatus==='pending'||languages.has(item.language))return false;
  languages.add(item.language);return true;
 });
}
function selectedPassage(excerpts,language=locale){
 const records=availablePassages(excerpts);
 return records.find(item=>item.language===language)||records.find(item=>item.type==='original')||records[0]||null;
}
const quotationControls=new Map();let quotationControlId=0;
function quotationBody(item,places){
 const terms=item.highlightTerms?.length||item.highlightMode==='explicit'?item.highlightTerms||[]:null;
 return `<p><strong>${esc(t(item.type==='translation'?'Published translation':'Original text'))} · ${esc(t(excerptLanguageNames[item.language]||item.language))}</strong></p><blockquote lang="${esc(item.language)}">${renderQuote(item.quote,places,terms)}</blockquote><p class="excerpt-credit">${esc(item.attribution||'')}</p>`;
}
function changeQuotationLanguage(select){
 const state=quotationControls.get(select.dataset.quotationId),item=state?.records.find(item=>item.language===select.value);
 if(!item)return;
 const block=select.closest('.original-excerpt');
 block.querySelector('.quotation-body').innerHTML=quotationBody(item,state.places);
 block.querySelector('summary').textContent=t(state.heading);
}
document.addEventListener?.('change',event=>{
 if(event.target?.matches?.('select.quotation-language-select'))changeQuotationLanguage(event.target);
});
function renderExcerpts(excerpts,heading,places=[]){
 const selected=selectedPassage(excerpts);
 if(!selected)return '';
 const records=availablePassages(excerpts),id=String(++quotationControlId);
 quotationControls.set(id,{records,places,heading});
 return `<details class="original-excerpt"><summary>${esc(t(heading))}</summary><label class="quotation-language" for="quotation-language-${id}">${esc(t('Quotation language'))}<select id="quotation-language-${id}" class="quotation-language-select" data-quotation-id="${id}" ${records.length===1?'disabled aria-disabled="true"':''}>${records.map(item=>`<option value="${esc(item.language)}" ${item.language===selected.language?'selected':''}>${esc(t(excerptLanguageNames[item.language]||item.language))}</option>`).join('')}</select></label><div class="quotation-body" aria-live="polite">${quotationBody(selected,places)}</div></details>`;
}
function unlocatedPlacesForDisplay(chapter){
 // These invented institutions and non-geographic spaces remain in the audit.
 // A literary setting with a documented real area can instead receive a mapped
 // representative point; its fictional nature does not prevent that mapping.
 const hidden=new Set(book.hiddenUnlocatedPlaceIds||[]);
 return (chapter.unlocatedPlaces||[]).filter(item=>item.displayInAtlas!==false&&item.geographicRelevance!=='none'&&!hidden.has(item.id));
}
function renderDetail(){
 const chapter=activeChapter();
 const eyebrow=book.literaryViews?esc(t('Literary views')):current<0?esc(t('Whole novel'))+' · '+new Set([...globalPlaceIds,...globalCitations.map(reference=>reference.placeId)]).size+' '+esc(t('mapped places')):esc(book.unit.toUpperCase())+' '+number(chapter.id)+' '+t('DI')+' '+chapters.length+(chapter.english&&chapter.english!==chapter.title?' · '+esc(chapter.english):'');
 document.getElementById('detail').innerHTML=`<div><p class="detail-eyebrow">${eyebrow}</p><h2>${esc(chapter.title)}</h2><div class="tags"><span class="tag">${esc(chapter.time)}</span><span class="tag">${esc(chapter.people)}</span></div><div class="detail-nav"><button type="button" id="previous" aria-label="${esc(t('Sezione precedente'))}" ${current===0?'disabled':''}>${t('Precedente')}</button><button type="button" id="next" aria-label="${esc(t('Sezione successiva'))}" ${current===chapters.length-1?'disabled':''}>${t('Successivo')}</button></div><p class="episode-source">${esc([book.author,book.title,chapter.title].join(' · '))}</p></div><div class="detail-text"><p>${esc(chapter.text)}</p><h3 class="locations-heading">${t('Luoghi')} <span>${chapter.places.length}</span></h3><div class="location-buttons" id="episode-locations" aria-label="${t('Luoghi')}"></div><div id="selected-location" aria-live="polite"></div>${chapter.note?`<p class="episode-note">${esc(chapter.note)}</p>`:''}</div>`;
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
 const unlocatedPlaces=unlocatedPlacesForDisplay(chapter);
 if(unlocatedPlaces.length){
  const section=document.createElement('section');section.className='unlocated-places';
  section.innerHTML=`<h3>${esc(t('Locations without verified coordinates'))}</h3>${unlocatedPlaces.map(item=>`<details class="location-evidence"><summary>${esc(item.name)}</summary><p>${esc(item.text)}</p>${renderExcerpts(item.excerpt||{original:{...item,language:item.language||book.originalLanguage||'en',type:'original',attribution:item.attribution||[book.author,book.title,chapter.title].join(' · ')},translations:item.translations||{}},'Passage from the novel',[item])}</details>`).join('')}`;
  document.getElementById('selected-location').parentElement.appendChild(section);
 }
}
function renderLocation(options={}){
 const target=options.target||document.getElementById('selected-location'),isPopup=target===document.getElementById('map-popup-content');
 const chapter=options.chapter||activeChapter(),placeIndex=options.placeIndex??selectedPlace,citation=options.chapter?options.citation:activeCitations()[selectedCitation],id=options.referencePlaceId||citation?.placeId||chapter.places[placeIndex],place=allLiteraryPlaces[id],category=citation?'mentioned':options.chapter?(chapter.placeCategories?.[id]||'action'):placeCategory(id);
 if(!place){target.innerHTML='<p class="episode-note">'+esc(chapter.emptyMessage||chapter.text)+'</p>'+renderExcerpts(chapter.excerpts||chapter.excerpt,'Passage from the novel');return;}
 const narrativeSource=citation?{label:citation.excerpt.original.attribution,url:citation.excerpt.original.url}:chapter.placeSources?.[id]||place.narrativeSource;
 if(!isPopup)Array.from(document.getElementById('episode-locations').children).forEach((button,i)=>button.setAttribute('aria-pressed',String(i===selectedPlace&&selectedCitation<0)));
 if(!isPopup)Array.from(document.getElementById('citation-locations')?.children||[]).forEach((button,i)=>button.setAttribute('aria-pressed',String(i===selectedCitation)));
 const decimals=Number.isInteger(place.coordinateDecimals)&&place.coordinateDecimals>=0&&place.coordinateDecimals<=8?place.coordinateDecimals:place.positionSource.recordId||place.positionSource.councilRecord?6:4;
 const geographicPlace=place.geographic&&(!place.imagePresentation||illustratedMap?.geographic);
 const presentation=!geographicPlace&&place.imagePresentation||place;
 const hasOutline=!!window.RegionalOutline?.geometry(place);
 const coordinateText=hasOutline?t('Regional outline · no exact position'):isIllustrated&&!geographicPlace?'':place.coords.map(n=>n.toFixed(decimals)).join(', ');
 if(isIllustrated){
  target.innerHTML=`<p class="category-badge category-${category}">${esc(t(category==='action'?'Action locations':'Mentioned locations'))}</p><p class="location-scene">${esc(chapter.placeText[placeIndex])}</p><p class="today">${esc(presentation.note)}</p><details class="location-evidence"><summary>${t('Posizione e fonti')}</summary><p>${esc(presentation.method)}</p><p>${esc(narrativeSource?.label||'')}</p>${geographicPlace?`<p class="coordinates">WGS84 · ${coordinateText}</p>${publicSourceLink(place.positionSource)}`:''}</details>`;
 }else{
 target.innerHTML=`<p class="category-badge category-${category}">${esc(t(category==='action'?'Action locations':'Mentioned locations'))}</p><p class="location-address">${esc(place.area)}</p><p class="location-scene">${esc(citation?t('A geographical reference in the original text. Read the passage for its context.'):chapter.placeText[placeIndex])}</p><p class="today"><strong>${esc(place.status)}.</strong> ${esc(place.note)}</p><details class="location-evidence"><summary>${t('Posizione e fonti')}</summary><p>${esc(place.method)}</p><p class="coordinates">${hasOutline?'':'WGS84 · '}${coordinateText}<br>${t('Verifica delle fonti')}: ${esc(new Date(place.checked+"T12:00:00").toLocaleDateString(locale,{day:"numeric",month:"long",year:"numeric"}))}</p><span>${esc(narrativeSource.label)}</span><br>${publicSourceLink(place.positionSource)}${place.additionalSource?`<br>${publicSourceLink(place.additionalSource)}`:''}</details>`;
 if(!hasOutline&&place.geographicReview?.precision!=='region')target.innerHTML+=`<div class="street-view-action"><a class="street-view-link" id="street-view-link" href="${esc(streetViewUrl(place))}" target="_blank" rel="noopener noreferrer" aria-label="${esc(t('Apri Street View in una nuova finestra')+': '+place.name)}">Google Street View <span aria-hidden="true">↗</span></a><p class="street-view-note">${esc(t('Google mostra il panorama disponibile più vicino: può essere spostato rispetto al punto e dipende dalla copertura.'))}</p></div>`;
 }
 if(isPopup&&options.chapter)target.innerHTML=`<p class="detail-eyebrow">${esc(number(chapter.id)+' · '+chapter.title)}</p>`+target.innerHTML;
 const quote=!citation&&chapter.placeQuotes?.[id];
 const excerpt=citation?.excerpt||chapter.placeExcerpts?.[id];
 const evidence=document.createElement('div');evidence.innerHTML=renderExcerpts(excerpt||(quote?{original:{quote,language:book.originalLanguage||'en',type:'original',attribution:narrativeSource?.label||[book.author,book.title,chapter.title].join(' · '),url:narrativeSource?.url}}:null),'Passage from the novel',[place]);target.appendChild(evidence);
 if(current<0||isPopup){const references=document.createElement('div');references.className='global-references';const heading=document.createElement('h3');heading.textContent=t('Appears in');references.appendChild(heading);chapters.forEach((section,index)=>{const placeIndex=section.places.indexOf(id),citationIndex=(section.citations||[]).findIndex(reference=>reference.placeId===id);if(placeIndex<0&&citationIndex<0)return;const button=document.createElement('button');button.type='button';button.className='section-link';button.textContent=number(section.id)+' · '+section.title+' · '+t(placeIndex>=0&&section.placeCategories?.[id]!=='mentioned'?'Action locations':'Mentioned locations');button.addEventListener('click',()=>{if(isPopup){showMapPopup(true,false,{chapterIndex:index,placeId:id});return;}selectChapter(index,false);if(placeIndex>=0)selectPlace(placeIndex);else selectCitation(citationIndex)});references.appendChild(button)});target.appendChild(references);}
 if(!isIllustrated){const link=isPopup?target.querySelector?.('.street-view-link'):document.getElementById('street-view-link');if(link)link.onclick=openStreetView;}
 if(!isPopup&&!document.getElementById('map-place-popup').hidden)showMapPopup();
}
function centerSelectedPlace(zoomToPlace=true){
 if(isIllustrated){const id=activeCitations()[selectedCitation]?.placeId||activeChapter().places[selectedPlace];return illustratedMap?.focus(id);}

 if(!viewReady)return;
 const id=activeCitations()[selectedCitation]?.placeId||activeChapter().places[selectedPlace],place=allLiteraryPlaces[id];
 const boundary=window.RegionalOutline?.bounds(place);if(boundary&&ExtentClass){navigate(new ExtentClass(boundary).expand(1.15));return;}
 if(place)navigate({center:[place.coords[1],place.coords[0]],...(zoomToPlace?{zoom:place.zoom}:{})});
}
function selectPlace(index,move=true){
 const chapter=activeChapter();if(!Number.isInteger(index)||index<0||index>=chapter.places.length)return;
 if(isIllustrated)illustratedMap?.allowGeographicSelection();
 selectedPlace=index;selectedCitation=-1;renderLocation();drawMarkers();
 if(move)centerSelectedPlace();
}
function selectCitation(index,move=true){const citation=activeCitations()[index];if(!citation||!Number.isInteger(index))return;selectedCitation=index;renderLocation();drawMarkers();if(move)centerSelectedPlace();}
// Display numbers depend on visible markers; source indices remain stable for selection.
function visibleMarkerNumbers(){
 const next={action:1,mentioned:1};
 const places=activeChapter().places.map(id=>{
  const category=placeCategory(id);
  return visibleLayers[category]?(category==='mentioned'?'C':'')+next[category]++:null;
 });
 if(isIllustrated&&illustratedMap){
  const numbers=illustratedMap.visibleNumbers(activeChapter(),visibleLayers);
  return {places:activeChapter().places.map(id=>numbers.get(id)??null),citations:[]};
 }
 const citations=activeCitations().map(reference=>{
  if(!visibleLayers.mentioned)return null;
  const index=activeChapter().places.indexOf(reference.placeId);
  if(current<0&&visibleLayers.action&&index>=0&&placeCategory(reference.placeId)==='action')return null;
  return 'C'+next.mentioned++;
 });
 return {places,citations};
}
function updateLocationNumbers(numbers=visibleMarkerNumbers()){
 for(const [container,values] of [['episode-locations',numbers.places],['citation-locations',numbers.citations]]){
  Array.from(document.getElementById(container)?.children||[]).forEach((button,index)=>{
   // Replace only the label, preserving the button and its selection handler.
   button.innerHTML=button.innerHTML.replace(/<span[^>]*>.*?<\/span>/,values[index]==null?'<span hidden></span>':'<span>'+values[index]+'</span>');
  });
 }
}
function drawMarkers(){
 const numbers=visibleMarkerNumbers();updateLocationNumbers(numbers);
 if(isIllustrated){const id=activeCitations()[selectedCitation]?.placeId||activeChapter().places[selectedPlace];illustratedMap?.update(activeChapter(),visibleLayers,id);return;}

 if(!markerLayer||!GraphicClass)return;markerLayer.removeAll();citedMarkerLayer?.removeAll();markerLayer.visible=visibleLayers.action;if(citedMarkerLayer)citedMarkerLayer.visible=visibleLayers.mentioned;
 activeChapter().places.forEach((id,index)=>{
  if(numbers.places[index]==null)return;
  const place=literaryPlaces[id],active=(index===selectedPlace&&selectedCitation<0)||(current<0&&activeCitations()[selectedCitation]?.placeId===id),category=placeCategory(id),layer=category==='mentioned'&&citedMarkerLayer?citedMarkerLayer:markerLayer;
  const regional=window.RegionalOutline?.graphics(place,numbers.places[index],markerColors[category],active,{placeIndex:index,chapterId:activeChapter().id,category});
  if(regional){for(const graphic of regional)layer.add(new GraphicClass(graphic));return;}
  const geometry={type:'point',longitude:place.coords[1],latitude:place.coords[0],spatialReference:{wkid:4326}};
  const attributes={placeIndex:index,chapterId:activeChapter().id,category};
  const approximate=['area','uncertain','street'].includes(place.kind);
  layer.add(new GraphicClass({geometry,attributes,symbol:{type:'simple-marker',style:approximate?'diamond':'circle',size:approximate?31:28,color:markerColors[category],outline:{color:active?'#e8c565':'#ffffff',width:active?3.5:2}}}));
  layer.add(new GraphicClass({geometry,attributes,symbol:{type:'text',text:String(numbers.places[index]),color:'#ffffff',font:{family:'Arial',size:current<0?10:12,weight:'bold'},verticalAlignment:'middle',horizontalAlignment:'center'}}));
 });
 if(citedMarkerLayer)activeCitations().forEach((reference,index)=>{if(numbers.citations[index]==null)return;if(current<0&&visibleLayers.action&&globalChapter.places.includes(reference.placeId)&&placeCategory(reference.placeId)==='action')return;const place=allLiteraryPlaces[reference.placeId],active=index===selectedCitation,approximate=['area','uncertain','street'].includes(place.kind),geometry={type:'point',longitude:place.coords[1],latitude:place.coords[0],spatialReference:{wkid:4326}},attributes={citationIndex:index,chapterId:activeChapter().id,category:'mentioned'};const regional=window.RegionalOutline?.graphics(place,numbers.citations[index],markerColors.mentioned,active,attributes);if(regional){for(const graphic of regional)citedMarkerLayer.add(new GraphicClass(graphic));return;}citedMarkerLayer.add(new GraphicClass({geometry,attributes,symbol:{type:'simple-marker',style:approximate?'diamond':'circle',size:approximate?31:28,color:markerColors.mentioned,outline:{color:active?'#e8c565':'#ffffff',width:active?3.5:2}}}));citedMarkerLayer.add(new GraphicClass({geometry,attributes,symbol:{type:'text',text:String(numbers.citations[index]),color:'#ffffff',font:{family:'Arial',size:10,weight:'bold'},verticalAlignment:'middle',horizontalAlignment:'center'}}));});
}
function showMapError(message){const notice=document.getElementById('map-error');notice.textContent=t(message);notice.hidden=false}
function navigate(target){if(!viewReady)return;return view.goTo(target,{animate:!reduced,duration:800}).catch(error=>{if(error.name!=='AbortError')console.error('Spostamento della mappa non riuscito',error)})}
function overview(includeCitations=false){
 if(isIllustrated)return illustratedMap?.fit();

 if(!viewReady||!ExtentClass)return;
 const chapter=activeChapter();
 const includeMentions=includeCitations||current<0;
 const overviewIds=includeMentions?chapter.places:(chapter.overviewPlaces??chapter.places);
 let points=overviewIds.filter(id=>visibleLayers[placeCategory(id)]&&(includeMentions||placeCategory(id)==='action')).map(id=>literaryPlaces[id]);
 if(visibleLayers.mentioned&&includeMentions)points.push(...activeCitations().map(reference=>allLiteraryPlaces[reference.placeId]));
 if(!points.length){navigate(chapter.initialView||book.initialView);return;}
 if(points.length===1){const boundary=window.RegionalOutline?.bounds(points[0]);if(boundary){navigate(new ExtentClass(boundary).expand(1.15));return;}navigate({center:[points[0].coords[1],points[0].coords[0]],zoom:points[0].zoom});return}
 const extents=points.map(p=>window.RegionalOutline?.bounds(p)||{xmin:p.coords[1],xmax:p.coords[1],ymin:p.coords[0],ymax:p.coords[0]});
 const longitudes=extents.flatMap(e=>[e.xmin,e.xmax]),latitudes=extents.flatMap(e=>[e.ymin,e.ymax]);
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
  illustratedMap=new IllustratedMapController(book.illustration,document.getElementById('map'),id=>{const index=activeChapter().places.indexOf(id);if(index<0)return;selectPlace(index,false);showMapPopup(true);centerSelectedPlace(false)},geographic=>{updateLocationNumbers();document.getElementById('osm-credit').hidden=!geographic;document.getElementById('map-heading').textContent=(current<0?t('All places'):(book.literaryViews?'':number(activeChapter().id)+' · ')+activeChapter().title)+(geographic?' · '+book.illustration.geographyLabels.map:'');if(book.illustratedView?.preferIllustratedAnchors)renderLocation();});
  await illustratedMap.update(activeChapter(),visibleLayers,activeChapter().places[selectedPlace]);
  updateLocationNumbers();
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
