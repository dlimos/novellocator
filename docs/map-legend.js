/* Include only symbols used by mapped associations in the current novel/mode. */
(function(root){
 function types(data){
  const result=new Set(),illustrated=['illustrated','webmap'].includes(data.book.mapType);
  function visit(place,category,kind){
   if(!place)return;
   result.add(category);result.add('selected');
   if(!illustrated&&place.alternativeModels?.some(p=>Array.isArray(p.coords)&&p.coords.length===2&&p.coords.every(Number.isFinite)&&Math.abs(p.coords[0])<=90&&Math.abs(p.coords[1])<=180)){result.add('star');return;}
   if(!illustrated&&place.regionalOutline?.paths?.length){result.add('region');return;}
   result.add(['area','street','uncertain'].includes(kind||place.kind)?'diamond':'circle');
  }
  for(const chapter of data.chapters){
   for(const id of chapter.places||[])visit(data.places[id],chapter.placeCategories?.[id]||'action',chapter.placeKinds?.[id]);
   for(const ref of chapter.citations||[])visit(data.citedPlaces?.[ref.placeId]||data.places[ref.placeId],'mentioned');
  }
  return result;
 }
 function render(data,document=root.document){
  const legend=document?.querySelector?.('.complete-legend');if(!legend)return;
  const used=types(data);legend.hidden=used.size===0;
  for(const item of legend.querySelectorAll('[data-legend-symbol]'))item.hidden=!used.has(item.getAttribute('data-legend-symbol'));
 }
 root.AtlasMapLegend={types,render};
})(typeof window==='object'?window:globalThis);
