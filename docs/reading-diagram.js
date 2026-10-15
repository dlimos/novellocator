/* Generic reading diagrams. Editorial configuration comes from book metadata. */
(()=>{
 function passages(item,book){return item.excerpt||{original:{...item,language:item.language||book.originalLanguage||'en',type:'original',attribution:item.attribution},translations:item.translations||{}};}
 function collect(chapters,section,layout,book){
  const found=new Map();
  for(const chapter of chapters){
   if(section!==null&&chapter.id!==section)continue;
   for(const item of chapter.unlocatedPlaces||[]){
    if(!book.readingDiagram.layouts[layout].positions[item.id])continue;
    const original=passages(item,book).original;
    if(!original?.quote?.trim()||['pending','rejected'].includes(original.verificationStatus))continue;
    // Some published snippets name a setting without proving a scene there.
    // Downgrade those occurrences locally; never upgrade the source category.
    const uncertain=(book.readingDiagram.mentionedOccurrences||[]).some(key=>key===chapter.id+':'+item.id||key===chapter.id+':*');
    const role=!uncertain&&item.category==='action'?'action':'mentioned';
    const record=found.get(item.id)||{id:item.id,name:item.name,role:'mentioned',occurrences:[]};
    if(role==='action')record.role='action';
    record.occurrences.push({item,chapter,role});found.set(item.id,record);
   }
  }
  return [...found.values()];
 }
 function visibleRecords(records,layers){const next={action:1,mentioned:1};return records.filter(p=>layers[p.role]).map(p=>({...p,number:(p.role==='mentioned'?'C':'')+next[p.role]++}));}
 function create({book,chapters,locale,renderExcerpts,esc,t}){
  const config=book.readingDiagram;
  if(!config?.layouts||!config.messages)return null;
  const words=config.messages[locale]||config.messages.en;
  const name=record=>config.names?.[locale]?.[record.id]||record.name;
  const sectionName=chapter=>config.sectionNames?.[locale]?.[chapters.indexOf(chapter)]||chapter?.title||'';
  const root=document.createElement('section');root.className='reading-map';root.setAttribute('aria-labelledby','reading-map-title');
  root.innerHTML=`<header><p class="eyebrow">${esc(words[1])}</p><h2 id="reading-map-title">${esc(words[0])}</h2></header><p>${esc(words[4])}</p><div class="reading-map-tabs" role="group" aria-label="${esc(words[0])}"></div><p class="reading-map-context"></p><p class="reading-map-help">${esc(words[5])}</p><div class="reading-diagram"><div class="reading-diagram-grain" aria-hidden="true"></div><img class="reading-map-drawing" alt="" aria-hidden="true"><div class="reading-pins"></div></div><p class="reading-empty" role="status" hidden>${esc(words[6])}</p><div class="reading-evidence" aria-live="polite"></div><details class="reading-notes"><summary>${esc(words[9])}</summary><p>${esc(words[7])}</p><p>${esc(words[10])}</p><p><a href="${esc(config.source.url)}" target="_blank" rel="noopener noreferrer">${esc(config.source.label)}</a></p></details>`;
  document.getElementById('detail').before(root);
  const jump=document.createElement('button');jump.type='button';jump.className='reading-map-jump';jump.textContent=words[0]+' ↓';jump.title=words[1];jump.onclick=()=>{root.scrollIntoView({block:'start'});const heading=root.querySelector('h2');heading.tabIndex=-1;heading.focus({preventScroll:true});};document.querySelector('.basemap-toolbar').before(jump);
  const pins=root.querySelector('.reading-pins'),evidence=root.querySelector('.reading-evidence'),context=root.querySelector('.reading-map-context');
  let layout=config.defaultLayout,section=null,layers={action:true,mentioned:true},selected=null,cache='';
  const selections={};
  const buttons={};
  for(const [id,definition]of Object.entries(config.layouts)){
   const label=words[definition.labelIndex];
   const button=document.createElement('button');button.type='button';button.textContent=label;button.onclick=()=>{layout=id;selected=selections[id]??null;cache='';paint();};buttons[id]=button;root.querySelector('.reading-map-tabs').append(button);
  }
  function paint(){
   const records=visibleRecords(collect(chapters,section,layout,book),layers);
   root.querySelector('.reading-map-drawing').src=config.layouts[layout].image;
   for(const [id,button]of Object.entries(buttons))button.setAttribute('aria-pressed',String(layout===id));
   context.textContent=section===null?t('All places'):sectionName(chapters.find(c=>c.id===section));
   root.querySelector('.reading-empty').hidden=records.length>0;
   pins.replaceChildren();
   const active=records.find(p=>p.id===selected)||(selected===null?records[0]:null);
   if(selected===null&&active){selected=active.id;selections[layout]=selected;}
   function show(record){
    evidence.innerHTML=record?`<h3><span class="reading-evidence-number">${esc(record.number)}</span> ${esc(name(record))}</h3><p>${esc(config.notes?.[locale]?.[record.id]||record.occurrences[0].item.text||'')}</p>${record.occurrences.map(({item,chapter,role})=>`<section><h4>${esc(sectionName(chapter))} · ${esc(t(role==='action'?'Action locations':'Mentioned locations'))}</h4>${renderExcerpts(passages(item,book),words[8],[item])}</section>`).join('')}`:'';
   }
   for(const record of records){
    const button=document.createElement('button');button.type='button';button.className='reading-pin '+record.role;button.dataset.placeId=record.id;
    button.style.left=config.layouts[layout].positions[record.id][0]+'%';button.style.top=config.layouts[layout].positions[record.id][1]+'%';
    button.innerHTML=`<span class="reading-pin-number">${esc(record.number)}</span><span class="reading-pin-name">${esc(name(record))}</span>`;
    button.setAttribute('aria-pressed',String(record.id===active?.id));button.setAttribute('aria-label',record.number+' · '+name(record));
    button.onclick=()=>{selected=record.id;selections[layout]=selected;for(const pin of pins.children)pin.setAttribute('aria-pressed',String(pin.dataset.placeId===selected));show(record);};pins.append(button);
   }
   show(active);
  }
  return {update(nextSection,nextLayers){const key=JSON.stringify([nextSection,nextLayers.action,nextLayers.mentioned]);if(key===cache)return;cache=key;section=nextSection;layers={...nextLayers};paint();}};
 }
 window.ReadingDiagram={create,collect,visibleRecords};
})();
