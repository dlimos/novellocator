(()=>{
 const headings={
  en:['Section','Title','Place','Address or area','Category','Latitude','Longitude','Geometry','Scene','Original language','Original passage','Text source','Position source','Position method','Note','Checked'],
  it:['Sezione','Titolo','Luogo','Indirizzo o area','Categoria','Latitudine','Longitudine','Geometria','Scena','Lingua originale','Passo originale','Fonte testuale','Fonte coordinate','Metodo posizione','Nota','Verifica'],
  fr:['Section','Titre','Lieu','Adresse ou zone','Catégorie','Latitude','Longitude','Géométrie','Scène','Langue originale','Passage original','Source textuelle','Source des coordonnées','Méthode de localisation','Note','Vérification'],
  es:['Sección','Título','Lugar','Dirección o área','Categoría','Latitud','Longitud','Geometría','Escena','Idioma original','Pasaje original','Fuente textual','Fuente de coordenadas','Método de localización','Nota','Verificación']
 };
 const categories={en:['Action locations','Mentioned locations'],it:['Luoghi dell’azione','Luoghi citati'],fr:['Lieux de l’action','Lieux mentionnés'],es:['Lugares de la acción','Lugares mencionados']};
 const selectedHeadings={en:['Quotation language','Displayed passage','Quotation credit','Edition and rights'],it:['Lingua della citazione','Passo visualizzato','Attribuzione della citazione','Edizione e diritti'],fr:['Langue de la citation','Passage affiché','Attribution de la citation','Édition et droits'],es:['Idioma de la cita','Pasaje mostrado','Atribución de la cita','Edición y derechos']};
 function selectedColumns(group,locale){
  const valid=q=>q?.quote?.trim()&&!['rejected','pending'].includes(q.verificationStatus);
  const original=valid(group?.original)?group.original:null,translated=valid(group?.translations?.[locale])?group.translations[locale]:null;
  const q=original?.language===locale&&original.quote?.trim()?original:translated?.language===locale&&translated.quote?.trim()?translated:original?.quote?.trim()?original:null;
  return [q?.language||locale,q?.quote||'',q?.attribution||'',q?.rightsNote||''];
 }
 function build(data,kind,locale='en'){
  const rows=[(headings[locale]||headings.en).concat(selectedHeadings[locale]||selectedHeadings.en)],labels=categories[locale]||categories.en;
  for(const chapter of data.sourceChapters||data.chapters){
   const references=kind==='citations'?(chapter.citations||[]):(chapter.places||[]).map((id,index)=>({placeId:id,category:chapter.placeCategories?.[id]||'action',scene:chapter.placeText[index],excerpt:chapter.placeExcerpts?.[id]}));
   for(const ref of references){
    const p=(kind==='citations'?data.citedPlaces?.[ref.placeId]:null)||data.places[ref.placeId]||data.citedPlaces?.[ref.placeId];if(!p)throw new Error('Missing CSV place: '+ref.placeId);
    const q=ref.excerpt?.original;
    const legacy=chapter.placeQuotes?.[ref.placeId],source=chapter.placeSources?.[ref.placeId]||p.narrativeSource;
    const group=ref.excerpt||(legacy?{original:{quote:legacy,language:data.book.originalLanguage||'en',attribution:source?.label||'',url:source?.url}}:null);
    rows.push([chapter.id,chapter.title,p.name,p.area,labels[ref.category==='mentioned'?1:0],p.coords?.[0],p.coords?.[1],p.kind,ref.scene||'',q?.language,q?.quote||legacy||'',q?.attribution||source?.label,p.positionSource?.url,p.method,p.note,p.checked].concat(selectedColumns(group,locale)));
   }
   if(kind!=='citations')for(const p of chapter.unlocatedPlaces||[])rows.push([chapter.id,chapter.title,p.name,'',labels[p.category==='mentioned'?1:0],'','','',p.text,p.language||data.book.originalLanguage||'en',p.quote,p.attribution||'','','','',''].concat(selectedColumns(p.excerpt||{original:{...p,language:p.language||data.book.originalLanguage||'en'},translations:p.translations},locale)));
  }
  return '\ufeff'+rows.map(row=>row.map(value=>'"'+String(value??'').replaceAll('"','""')+'"').join(',')).join('\r\n')+'\r\n';
 }
 function bind(root,data,locale){
  for(const link of root.querySelectorAll?.('a[href]')||[]){
   const filename=link.getAttribute('href');if(!/^[a-z0-9-]+\.csv$/i.test(filename||''))continue;
   link.setAttribute('href','#');link.setAttribute('download',filename);
   link.addEventListener('click',event=>{
    event.preventDefault();
    const text=build(data,filename.includes('-citations-')?'citations':'places',locale);
    const url=URL.createObjectURL(new Blob([text],{type:'text/csv;charset=utf-8'}));
    const download=document.createElement('a');download.href=url;download.download=filename;document.body.appendChild(download);download.click();download.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
   });
  }
 }
 window.atlasCsv={build,bind};
})();
