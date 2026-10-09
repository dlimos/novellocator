import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
export const bookIds=['ulisse','proust','war-and-peace','moby-dick','gatsby'] as const;
import {tables,type Obj,type Row,type Bundle,type Dataset,type Dictionary,type Source,type Passage,type Excerpt} from './content.js';
export {tables,reconstruct,type Row,type Bundle,type Dataset,type Dictionary} from './content.js';
export function loadScript(file:string,key:string):unknown {
 const context={window:{} as Record<string,unknown>};vm.runInNewContext(fs.readFileSync(file,'utf8'),context,{filename:file,timeout:3000});
 if(!context.window[key])throw new Error(`Missing ${key}: ${file}`);
 return JSON.parse(JSON.stringify(context.window[key]));
}
export function loadInputs(root:string,ids:readonly string[]=bookIds){return ids.map(id=>({id,data:loadScript(path.join(root,'docs/data',id+'.js'),'atlasData') as Dataset,dictionary:loadScript(path.join(root,'docs/data',id+'-i18n.js'),'atlasTranslations') as Dictionary}));}
function without(value:Obj,keys:string[]):Obj{return Object.fromEntries(Object.entries(value).filter(([key])=>!keys.includes(key)));}
function canonical(value:unknown):string{if(Array.isArray(value))return '['+value.map(canonical).join(',')+']';if(value&&typeof value==='object')return '{'+Object.entries(value).sort(([a],[b])=>a.localeCompare(b)).map(([key,v])=>JSON.stringify(key)+':'+canonical(v)).join(',')+'}';return JSON.stringify(value);}
const hash=(value:string)=>createHash('sha256').update(value).digest('hex');
const sectionFields=['places','placeText','placeCategories','placeSources','placeRoles','placeQuotes','placeExcerpts','excerpts','citations','unlocatedPlaces'];
export function normalize(inputs:ReturnType<typeof loadInputs>):Bundle {
 const bundle:Bundle={formatVersion:1,tables:{books:[],sections:[],places:[],sources:[],place_descriptions:[],place_references:[],excerpts:[],unlocated_settings:[],content_translations:[]}};
 for(const {id,data,dictionary} of inputs){
  if(data.book.id!==id)throw new Error(`Book ID mismatch: ${id}`);
  const originalLanguage=id==='proust'?'fr':id==='war-and-peace'?'ru':'en';
  bundle.tables.books.push({id,title:data.book.title,author:data.book.author,original_language:originalLanguage,publication_status:'published',metadata:without(data.book,['id','title','author'])});
  const sourceIds=new Set<string>();
  function source(src?:Source):string|null {
   if(!src)return null;if(!/^https?:\/\//.test(src.url))throw new Error(`Invalid source in ${id}`);
   const sourceId=hash(canonical(src));if(!sourceIds.has(sourceId)){sourceIds.add(sourceId);bundle.tables.sources.push({book_id:id,id:sourceId,url:src.url,label:src.label??null,metadata:without(src,['url','label'])});}return sourceId;
  }
  const placeIds=new Map<string,[number,number]>();
  for(const [collection,places] of Object.entries({core:data.places,cited:data.citedPlaces||{}}))for(const [placeId,p]of Object.entries(places)){
   if(!p.coords.every(Number.isFinite)||Math.abs(p.coords[0])>90||Math.abs(p.coords[1])>180)throw new Error(`Invalid coordinates: ${id}/${placeId}`);
   if(placeIds.has(placeId)){if(canonical(placeIds.get(placeId))!==canonical(p.coords))throw new Error(`Conflicting place coordinates: ${id}/${placeId}`);}
   else{placeIds.set(placeId,p.coords);bundle.tables.places.push({book_id:id,id:placeId,latitude:p.coords[0],longitude:p.coords[1]});}
   bundle.tables.place_descriptions.push({book_id:id,place_id:placeId,collection,name:p.name,area:p.area,kind:p.kind,zoom:p.zoom,checked:p.checked,status:p.status,note:p.note,method:p.method,position_source_id:source(p.positionSource)!,narrative_source_id:source(p.narrativeSource),additional_source_id:source(p.additionalSource),metadata:without(p,['coords','name','area','kind','zoom','checked','status','note','method','positionSource','narrativeSource','additionalSource'])});
  }
  function excerpts(sectionId:number,referenceId:string|null,group:Excerpt){
   const slots:[string,Passage][]=[['original',group.original],...Object.entries(group.translations||{})];
   for(const [slot,q]of slots){if(!q?.quote)throw new Error(`Empty excerpt: ${id}/${sectionId}/${slot}`);
    bundle.tables.excerpts.push({book_id:id,id:`${referenceId??'section:'+sectionId}:${slot}`,section_id:sectionId,reference_id:referenceId,slot,language:q.language,type:q.type,quote:q.quote,attribution:q.attribution,text_source_id:source({url:q.url,label:q.attribution})!,rights_source_id:source({url:q.rightsUrl,label:'Edition and rights'})!,metadata:without(q,['quote','language','type','attribution','url','rightsUrl'])});
   }
  }
  data.chapters.forEach((c,ordinal)=>{
   if(c.places.length!==c.placeText.length)throw new Error(`Scene count mismatch: ${id}/${c.id}`);
   bundle.tables.sections.push({book_id:id,id:c.id,ordinal,title:c.title,metadata:without(c,['id','title',...sectionFields]),legacy_fields:sectionFields.filter(key=>Object.hasOwn(c,key))});
   if(c.excerpts)excerpts(c.id,null,c.excerpts);
   c.places.forEach((placeId,index)=>{
    const refId=`${c.id}:core:${placeId}`,metadata:Obj={};
    if(Object.hasOwn(c.placeCategories||{},placeId))metadata.explicitCategory=true;
    if(Object.hasOwn(c.placeRoles||{},placeId))metadata.role=c.placeRoles![placeId];
    if(Object.hasOwn(c.placeQuotes||{},placeId))metadata.quote=c.placeQuotes![placeId];
    bundle.tables.place_references.push({book_id:id,id:refId,section_id:c.id,place_id:placeId,collection:'core',ordinal:index,category:c.placeCategories?.[placeId]||'action',scene_text:c.placeText[index],source_id:source(c.placeSources?.[placeId]),metadata});
    if(c.placeExcerpts?.[placeId])excerpts(c.id,refId,c.placeExcerpts[placeId]);
   });
   (c.citations||[]).forEach((r,index)=>{const refId=`${c.id}:cited:${r.placeId}`;bundle.tables.place_references.push({book_id:id,id:refId,section_id:c.id,place_id:r.placeId,collection:'cited',ordinal:index,category:r.category,scene_text:null,source_id:null,metadata:without(r,['placeId','category','excerpt'])});excerpts(c.id,refId,r.excerpt);});
   (c.unlocatedPlaces||[]).forEach((u,index)=>bundle.tables.unlocated_settings.push({book_id:id,section_id:c.id,ordinal:index,name:u.name,description:u.text,quote:u.quote,source_id:source({url:u.url})!,metadata:without(u,['name','text','quote','url'])}));
  });
  for(const [language,messages]of Object.entries(dictionary))for(const [sourceText,translatedText]of Object.entries(messages)){
   if(typeof translatedText!=='string')throw new Error(`Invalid translation: ${id}/${language}`);
   bundle.tables.content_translations.push({book_id:id,language,source_hash:hash(sourceText),source_text:sourceText,translated_text:translatedText});
  }
 }
 return bundle;
}
const primaryKeys:Record<typeof tables[number],string[]>={books:['id'],sections:['book_id','id'],places:['book_id','id'],sources:['book_id','id'],place_descriptions:['book_id','place_id','collection'],place_references:['book_id','id'],excerpts:['book_id','id'],unlocated_settings:['book_id','section_id','ordinal'],content_translations:['book_id','language','source_hash']};
function literal(value:Row[string]):string{if(value===null)return 'null';if(typeof value==='number'){if(!Number.isFinite(value))throw new Error('Non-finite SQL number');return String(value);}if(typeof value==='boolean')return String(value);const text=typeof value==='object'?JSON.stringify(value):value;return "E'"+text.replaceAll('\\','\\\\').replaceAll("'","''").replaceAll('\r','\\r').replaceAll('\n','\\n')+"'";}
function seedStatements(bundle:Bundle,maxStatementBytes=Infinity):string[]{
 const statements:string[]=[];
 for(const table of tables){const rows=bundle.tables[table];if(!rows.length)continue;const columns=Object.keys(rows[0]),keys=primaryKeys[table],updates=columns.filter(c=>!keys.includes(c)&&!(table==='books'&&c==='publication_status')).map(c=>`${c}=excluded.${c}`).join(',');
  function append(batch:Row[]){const sql=`insert into public.${table} (${columns.join(',')}) values\n`+batch.map(row=>'('+columns.map(column=>column==='legacy_fields'?`array[${(row[column] as string[]).map(literal).join(',')}]::text[]`:literal(row[column])).join(',')+')').join(',\n')+`\non conflict (${keys.join(',')}) do update set ${updates};`;
   if(Buffer.byteLength(sql,'utf8')>maxStatementBytes){if(batch.length===1)throw new Error(`One ${table} row exceeds the SQL chunk size`);const middle=Math.ceil(batch.length/2);append(batch.slice(0,middle));append(batch.slice(middle));}else statements.push(sql);
  }
  for(let offset=0;offset<rows.length;offset+=100)append(rows.slice(offset,offset+100));
 }
 return statements;
}
const sqlHeader='-- Generated from verified repository datasets. Additive upserts; no deletes.\nbegin;\nset local standard_conforming_strings = on;\n\n';
const sqlFooter='\n\ncommit;\n';
export function seedSql(bundle:Bundle):string{return sqlHeader+seedStatements(bundle).join('\n\n')+sqlFooter;}
export function seedSqlChunks(bundle:Bundle,maxBytes=250_000):string[]{
 const overhead=Buffer.byteLength(sqlHeader+sqlFooter,'utf8');
 if(maxBytes<=overhead+1000)throw new Error('SQL chunk size is too small');
 const chunks:string[]=[];let current:string[]=[];let size=overhead;
 for(const statement of seedStatements(bundle,maxBytes-overhead)){
  const bytes=Buffer.byteLength(statement,'utf8')+(current.length?2:0);
  if(size+bytes>maxBytes){chunks.push(sqlHeader+current.join('\n\n')+sqlFooter);current=[];size=overhead;}
  size+=Buffer.byteLength(statement,'utf8')+(current.length?2:0);current.push(statement);
 }
 if(current.length)chunks.push(sqlHeader+current.join('\n\n')+sqlFooter);
 return chunks;
}
