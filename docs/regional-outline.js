/* Region boundaries locate a narrative area, never an imaginary town centre. */
(function(root){
 function outline(place){
  if(place?.regionalOutline?.paths?.length)return place.regionalOutline;
  const shape=place?.geometry;
  if(shape?.type==='MultiLineString'&&shape.coordinateSpace==='EPSG:4326'&&Array.isArray(shape.paths))return shape;
  return null;
 }
 function geometry(place){
  const paths=outline(place)?.paths;
  if(!Array.isArray(paths)||!paths.length||!paths.every(path=>Array.isArray(path)&&path.length>=2&&path.every(point=>Array.isArray(point)&&point.length===2&&Number.isFinite(point[0])&&Number.isFinite(point[1]))))return null;
  return {type:'polyline',paths,spatialReference:{wkid:4326}};
 }
 function bounds(place){const line=geometry(place);if(!line)return null;const points=line.paths.flat(),xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);return {xmin:Math.min(...xs),xmax:Math.max(...xs),ymin:Math.min(...ys),ymax:Math.max(...ys),spatialReference:{wkid:4326}};}
 function graphics(place,number,color,active,attributes){
  const line=geometry(place);if(!line)return null;
  const metadata=outline(place),extent=bounds(place);
  const anchor=metadata.labelAnchor||(place.geometry?.type==='MultiLineString'?[(extent.xmin+extent.xmax)/2,(extent.ymin+extent.ymax)/2]:line.paths[0][0]);
  return [
   {geometry:line,attributes,symbol:{type:'simple-line',color:active?'#e8c565':'#ffffff',width:active?7:5}},
   {geometry:line,attributes,symbol:{type:'simple-line',color,width:3,style:'dash'}},
   {geometry:{type:'point',longitude:anchor[0],latitude:anchor[1],spatialReference:{wkid:4326}},attributes,symbol:{type:'text',text:number+' · '+(metadata.label||place.name),color,haloColor:'#fffaf0',haloSize:2,font:{family:'Arial',size:12,weight:'bold'},verticalAlignment:'bottom',yoffset:8}}
  ];
 }
 root.RegionalOutline={geometry,bounds,graphics};
})(typeof window==='object'?window:globalThis);
