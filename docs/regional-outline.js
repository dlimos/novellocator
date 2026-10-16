/* Region boundaries locate a narrative area, never an imaginary town centre. */
(function(root){
 function geometry(place){const paths=place?.regionalOutline?.paths;if(!Array.isArray(paths)||!paths.length)return null;return {type:'polyline',paths,spatialReference:{wkid:4326}};}
 function bounds(place){const line=geometry(place);if(!line)return null;const points=line.paths.flat(),xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);return {xmin:Math.min(...xs),xmax:Math.max(...xs),ymin:Math.min(...ys),ymax:Math.max(...ys),spatialReference:{wkid:4326}};}
 function graphics(place,number,color,active,attributes){
  const line=geometry(place);if(!line)return null;
  const anchor=place.regionalOutline.labelAnchor||line.paths[0][0];
  return [
   {geometry:line,attributes,symbol:{type:'simple-line',color:active?'#e8c565':'#ffffff',width:active?7:5}},
   {geometry:line,attributes,symbol:{type:'simple-line',color,width:3,style:'dash'}},
   {geometry:{type:'point',longitude:anchor[0],latitude:anchor[1],spatialReference:{wkid:4326}},attributes,symbol:{type:'text',text:number+' · '+(place.regionalOutline.label||place.name),color,haloColor:'#fffaf0',haloSize:2,font:{family:'Arial',size:12,weight:'bold'},verticalAlignment:'bottom',yoffset:8}}
  ];
 }
 root.RegionalOutline={geometry,bounds,graphics};
})(typeof window==='object'?window:globalThis);
