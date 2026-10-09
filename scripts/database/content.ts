export const tables=['books','sections','places','sources','place_descriptions','place_references','excerpts','unlocated_settings','content_translations'] as const;
export type Obj=Record<string,unknown>;
export type Row=Record<string,string|number|boolean|null|object>;
export type Bundle={formatVersion:1;tables:Record<typeof tables[number],Row[]>};
export interface Source extends Obj {url:string;label?:string}
export interface Passage extends Obj {quote:string;language:string;type:'original'|'translation';attribution:string;url:string;rightsUrl:string}
export interface Excerpt {original:Passage;translations:Record<string,Passage>}
interface Place extends Obj {name:string;area:string;coords:[number,number];zoom:number;kind:string;checked:string;status:string;note:string;method:string;positionSource:Source;narrativeSource?:Source;additionalSource?:Source}
interface Citation extends Obj {placeId:string;category:string;excerpt:Excerpt}
interface Section extends Obj {id:number;title:string;places:string[];placeText:string[];placeCategories?:Record<string,string>;placeSources?:Record<string,Source>;placeRoles?:Record<string,string>;placeQuotes?:Record<string,string>;placeExcerpts?:Record<string,Excerpt>;excerpts?:Excerpt;citations?:Citation[];unlocatedPlaces?:Array<Obj&{name:string;text:string;quote:string;url:string}>}
export interface Dataset {book:Obj&{id:string;title:string;author:string};chapters:Section[];places:Record<string,Place>;citedPlaces:Record<string,Place>}
export type Dictionary=Record<string,Record<string,string>>;
// Reconstruct the unchanged browser contract from relational rows.
export function reconstruct(bundle:Bundle,id:string):{data:Dataset;dictionary:Dictionary}{
 // Pasting SQL on Windows can turn literal line breaks into CRLF.
 const own=(table:typeof tables[number])=>bundle.tables[table].filter(r=>(table==='books'?r.id:r.book_id)===id).map(row=>Object.fromEntries(Object.entries(row).map(([key,value])=>[key,typeof value==='string'?value.replaceAll('\r\n','\n'):value])) as Row);
 const book=own('books')[0];if(!book)throw new Error(`Unknown book: ${id}`);
 const sourceMap=new Map(own('sources').map(s=>[s.id,s]));
 function source(sourceId:unknown):Source{const s=sourceMap.get(sourceId as string);if(!s)throw new Error(`Missing source: ${sourceId}`);return {...s.metadata as Obj,url:s.url as string,...(s.label!==null?{label:s.label as string}:{})};}
 const coords=new Map(own('places').map(p=>{if(p.latitude===null||p.longitude===null)throw new Error(`Place ${id}/${p.id} needs its dedicated map renderer; it cannot be exported as WGS84.`);return [p.id,[p.latitude,p.longitude]];}));
 const data:Dataset={book:{...book.metadata as Obj,id:book.id as string,title:book.title as string,author:book.author as string},chapters:[],places:{},citedPlaces:{}};
 for(const p of own('place_descriptions')){const place={...p.metadata as Obj,name:p.name,area:p.area,kind:p.kind,zoom:p.zoom,checked:p.checked instanceof Date?p.checked.toISOString().slice(0,10):String(p.checked).slice(0,10),status:p.status,note:p.note,method:p.method,coords:coords.get(p.place_id),positionSource:source(p.position_source_id),...(p.narrative_source_id?{narrativeSource:source(p.narrative_source_id)}:{}),...(p.additional_source_id?{additionalSource:source(p.additional_source_id)}:{})} as Place;(p.collection==='core'?data.places:data.citedPlaces)[p.place_id as string]=place;}
 function group(sectionId:unknown,refId:unknown):Excerpt|undefined{
  const rows=own('excerpts').filter(q=>q.section_id===sectionId&&q.reference_id===refId);if(!rows.length)return undefined;
  const result={translations:{}} as Excerpt;
  for(const q of rows){const passage={...q.metadata as Obj,quote:q.quote,language:q.language,type:q.type,attribution:q.attribution,url:source(q.text_source_id).url,rightsUrl:source(q.rights_source_id).url} as Passage;if(q.slot==='original')result.original=passage;else result.translations[q.slot as string]=passage;}return result;
 }
 for(const s of own('sections').sort((a,b)=>Number(a.ordinal)-Number(b.ordinal))){
  const c={...s.metadata as Obj,id:s.id,title:s.title} as Section,fields=s.legacy_fields as string[];
  for(const field of fields)c[field]=['places','placeText','citations','unlocatedPlaces'].includes(field)?[]:{};
  if(fields.includes('excerpts'))c.excerpts=group(s.id,null);
  for(const r of own('place_references').filter(r=>r.section_id===s.id).sort((a,b)=>Number(a.ordinal)-Number(b.ordinal))){const metadata=r.metadata as Obj,placeId=r.place_id as string;
   if(r.collection==='core'){c.places.push(placeId);c.placeText.push(r.scene_text as string);if(metadata.explicitCategory)c.placeCategories![placeId]=r.category as string;if(metadata.role!==undefined)c.placeRoles![placeId]=metadata.role as string;if(metadata.quote!==undefined)c.placeQuotes![placeId]=metadata.quote as string;if(r.source_id)c.placeSources![placeId]=source(r.source_id);const excerpt=group(s.id,r.id);if(excerpt)c.placeExcerpts![placeId]=excerpt;}
   else c.citations!.push({...metadata,placeId,category:r.category as string,excerpt:group(s.id,r.id)!});
  }
  for(const u of own('unlocated_settings').filter(u=>u.section_id===s.id).sort((a,b)=>Number(a.ordinal)-Number(b.ordinal)))c.unlocatedPlaces!.push({...u.metadata as Obj,name:u.name as string,text:u.description as string,quote:u.quote as string,url:source(u.source_id).url});
  data.chapters.push(c);
 }
 const dictionary:Dictionary={};for(const row of own('content_translations')){dictionary[row.language as string]??={};dictionary[row.language as string][row.source_text as string]=row.translated_text as string;}return {data,dictionary};
}
