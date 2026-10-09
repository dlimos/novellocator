(()=>{
 const headings={
  en:['Section','Title','Place','Address or area','Category','Latitude','Longitude','Geometry','Scene','Original language','Original passage','Text source','Position source','Position method','Note','Checked'],
  it:['Sezione','Titolo','Luogo','Indirizzo o area','Categoria','Latitudine','Longitudine','Geometria','Scena','Lingua originale','Passo originale','Fonte testuale','Fonte coordinate','Metodo posizione','Nota','Verifica'],
  fr:['Section','Titre','Lieu','Adresse ou zone','Catégorie','Latitude','Longitude','Géométrie','Scène','Langue originale','Passage original','Source textuelle','Source des coordonnées','Méthode de localisation','Note','Vérification'],
  es:['Sección','Título','Lugar','Dirección o área','Categoría','Latitud','Longitud','Geometría','Escena','Idioma original','Pasaje original','Fuente textual','Fuente de coordenadas','Método de localización','Nota','Verificación']
 };
 const categories={en:['Action locations','Mentioned locations'],it:['Luoghi dell’azione','Luoghi citati'],fr:['Lieux de l’action','Lieux mentionnés'],es:['Lugares de la acción','Lugares mencionados']};
 function build(data,kind,locale='en'){
  const rows=[headings[locale]||headings.en],labels=categories[locale]||categories.en;
  for(const chapter of data.chapters){
   const references=kind==='citations'?(chapter.citations||[]):(chapter.places||[]).map((id,index)=>({placeId:id,category:chapter.placeCategories?.[id]||'action',scene:chapter.placeText[index],excerpt:chapter.placeExcerpts?.[id]}));
   for(const ref of references){
    const p=(kind==='citations'?data.citedPlaces?.[ref.placeId]:null)||data.places[ref.placeId]||data.citedPlaces?.[ref.placeId];if(!p)throw new Error('Missing CSV place: '+ref.placeId);
    const q=ref.excerpt?.original;
    rows.push([chapter.id,chapter.title,p.name,p.area,labels[ref.category==='mentioned'?1:0],p.coords?.[0],p.coords?.[1],p.kind,ref.scene||'',q?.language,q?.quote||chapter.placeQuotes?.[ref.placeId]||'',q?.url||chapter.placeSources?.[ref.placeId]?.url||p.narrativeSource?.url,p.positionSource?.url,p.method,p.note,p.checked]);
   }
   if(kind!=='citations')for(const p of chapter.unlocatedPlaces||[])rows.push([chapter.id,chapter.title,p.name,'',labels[0],'','','',p.text,'',p.quote,p.url,'','','','']);
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
