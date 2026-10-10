/* Adapt an illustrated dataset to the shared chapter atlas contract. */
(function(root){
 function adapt(payload,locale='en'){
  const text=payload.ui[locale]||payload.ui.en, labels={en:{chapter:'Chapter',unit:'chapter',period:'Illustrated period',sidebar:'Chapters',note:'The images show broad narrative periods, not exact plans. Locations follow the selected chapter; their positions in the drawing are interpretative.',source:'Spanish source supplied by the reader',pages:'Source PDF pages'},it:{chapter:'Capitolo',unit:'capitolo',period:'Periodo illustrato',sidebar:'Capitoli',note:'Le immagini mostrano periodi narrativi ampi, non planimetrie esatte. I luoghi seguono il capitolo scelto; le posizioni nel disegno sono interpretative.',source:'Originale spagnolo fornito dal lettore',pages:'Pagine del PDF originale'},fr:{chapter:'Chapitre',unit:'chapitre',period:'Période illustrée',sidebar:'Chapitres',note:'Les images représentent de grandes périodes narratives, pas des plans exacts. Les lieux suivent le chapitre choisi ; leurs positions sont interprétatives.',source:'Original espagnol fourni par le lecteur',pages:'Pages du PDF original'},es:{chapter:'Capítulo',unit:'capítulo',period:'Periodo ilustrado',sidebar:'Capítulos',note:'Las imágenes representan periodos narrativos amplios, no planos exactos. Los lugares siguen el capítulo elegido; sus posiciones son interpretativas.',source:'Original español proporcionado por el lector',pages:'Páginas del PDF original'}}[locale];
  if(!Array.isArray(payload.chapterRanges)||payload.chapterRanges.length!==payload.chapterEpochs?.length)throw Error('Chapter structure missing');
  const model={book:{id:payload.book.id,title:text.title,author:payload.book.author,year:payload.book.year,description:text.note,unit:labels.unit,sidebarTitle:labels.sidebar,help:text.hint,sidebarNote:labels.note,hashPrefix:'chapter',mapType:'illustrated',links:[],footerHtml:'',initialView:{},illustration:{width:payload.width*2,height:payload.height*2,core:{xmin:payload.width/2,ymin:payload.height/2,xmax:payload.width*1.5,ymax:payload.height*1.5,spatialReference:{wkid:3857}},epochs:payload.epochs,anchors:payload.panoramaAnchors,globalEpoch:1}},chapters:[],places:{},citedPlaces:{}};
  for(const p of payload.places){if(p.x===null)continue;model.places[p.id]={name:p.names[locale],area:text.town,kind:p.kind==='site'?'site':'area',status:text.position,note:text.mapped,method:labels.note,checked:'2026-10-10',narrativeSource:{label:labels.source},positionSource:{label:labels.period},role:p.role};}
  payload.chapterRanges.forEach(([start,end],i)=>{
   const records=payload.places.filter(p=>p.source.pages.some(page=>page>=start&&page<=end)),epoch=payload.chapterEpochs[i];
   const c={id:i+1,title:labels.chapter+' '+(i+1),mapEpoch:epoch,places:[],placeText:[],placeSources:{},placeExcerpts:{},placeCategories:{},placeKinds:{},placeNames:{},unlocatedPlaces:[],time:payload.epochTexts[locale].labels[epoch],people:'Macondo',links:[],text:labels.pages+' '+start+'–'+end+'. '+labels.note};
   for(const p of records){const pages=p.source.pages.filter(page=>page>=start&&page<=end),quoted=p.source.page>=start&&p.source.page<=end;
    if(p.x===null){c.unlocatedPlaces.push({name:p.names[locale],text:p.scenes[locale]+' · '+labels.pages+' '+pages.join(', '),quote:quoted?p.source.quote:'',language:'es'});continue;}
    c.places.push(p.id);c.placeKinds[p.id]=p.kind;c.placeNames[p.id]=p.names[locale];c.placeText.push(p.scenes[locale]);c.placeCategories[p.id]=p.role;c.placeSources[p.id]={label:labels.source+' · '+labels.pages+' '+pages.join(', ')};
    if(quoted)c.placeExcerpts[p.id]={original:{quote:p.source.quote,language:'es',type:'original',attribution:labels.source+' · '+labels.pages+' '+p.source.page},translations:{}};
   }
   model.chapters.push(c);
  });
  return model;
 }
 root.IllustratedAdapter={adapt};
})(typeof window==='object'?window:globalThis);
