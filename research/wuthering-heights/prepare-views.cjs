// Scoped addition: view metadata, hidden subsettings and their translations only.
const fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const dir=__dirname,id='wuthering-heights',langs=['en','it','fr','es'];
const ctx={window:{}};for(const tail of ['.js','-i18n.js'])vm.runInNewContext(fs.readFileSync('docs/data/'+id+tail,'utf8'),ctx);
const data=ctx.window.atlasData,dict=ctx.window.atlasTranslations,sections=JSON.parse(fs.readFileSync(dir+'/sections.json','utf8')),specs=JSON.parse(fs.readFileSync(dir+'/views-specs.json','utf8')),copy=JSON.parse(fs.readFileSync(dir+'/views-copy.json','utf8'));
const originalUrl='https://raw.githubusercontent.com/GITenberg/Wuthering-Heights_768/master/768.txt';
const hash=s=>crypto.createHash('sha256').update(s).digest('hex'),messages={};
function tr(values){langs.forEach((l,i)=>{dict[l][values[0]]=values[i];(messages[l]??={})[values[0]]=values[i];});return values[0];}
const labelValues={...copy,view:['View','Veduta','Vue','Vista'],area:['Literary spaces','Spazi letterari','Espaces littéraires','Espacios literarios'],back:['Back to view','Torna alla veduta','Retour à la vue','Volver a la vista'],geographic:['Geographic atlas','Atlante geografico','Atlas géographique','Atlas geográfico'],reference:['A documented reference.','Un riferimento documentato.','Une référence attestée.','Una referencia documentada.'],empty:['No visible places with these filters.','Nessun luogo visibile con questi filtri.','Aucun lieu visible avec ces filtres.','No hay lugares visibles con estos filtros.']};
const labels=Object.fromEntries(langs.map((l,i)=>[l,Object.fromEntries(Object.entries(labelValues).filter(([k])=>!['heights','grange','moorland'].includes(k)).map(([k,v])=>[k,v[i]]))]));
const views=[
 {id:'heights',names:{en:'Wuthering Heights · Earnshaw house',it:'Wuthering Heights · casa Earnshaw',fr:'Wuthering Heights · maison Earnshaw',es:'Wuthering Heights · casa Earnshaw'},positions:{'wh-court':[.42,.70],'wh-hall':[.44,.54],'wh-kitchen':[.68,.54],'wh-bed':[.41,.35],'wh-attic':[.67,.30],'wh-stable':[.13,.52],'wh-garden':[.83,.69]}},
 {id:'grange',names:{en:'Thrushcross Grange',it:'Thrushcross Grange',fr:'Thrushcross Grange',es:'Thrushcross Grange'},positions:{'tg-drawing':[.41,.51],'tg-library':[.53,.51],'tg-chamber':[.66,.52],'tg-park':[.48,.67],'tg-ash':[.15,.44],'tg-wall':[.84,.81]}},
 {id:'moorland',names:{en:'Across the moor',it:'Il paesaggio della brughiera',fr:'À travers la lande',es:'El paisaje del páramo'},positions:{heights:[.15,.20],grange:[.83,.51],gimmerton:[.18,.43],penistone:[.84,.19],moorland:[.48,.40],'moor-guide':[.475,.66]}}
];
for(const v of views){v.image='images/wuthering-heights/'+v.id+'-panorama.png';v.notes=Object.fromEntries(langs.map((l,i)=>[l,copy[v.id][i]]));}
const config={version:1,width:1536,height:1024,checked:'2026-10-19',offerGeography:false,preferIllustratedAnchors:true,labels,names:Object.fromEntries(langs.map(l=>[l,{}])),notes:Object.fromEntries(langs.map(l=>[l,{}])),placeOrder:views.flatMap(v=>Object.keys(v.positions)),views};
const records=[],audit=[];
for(const [index,[pid,ch,p,term,start,names,notes]]of specs.entries()){
 const source=sections[ch-1],paragraph=source.paragraphs[p],a=start?paragraph.indexOf(start):0;assert(a>=0);let quote=paragraph.slice(a);
 if(quote.length>650){const ends=[...quote.slice(0,650).matchAll(/[.!?](?:['"])?(?=\s|$)/g)].map(m=>m.index+m[0].length);quote=quote.slice(0,ends.filter(i=>i>120).at(-1)||quote.lastIndexOf(' ',650));}
 assert(quote.toLowerCase().includes(term.toLowerCase()),pid+': literal highlight absent');
 const chapter=data.chapters.find(c=>c.id===ch),existing=Object.values(chapter.placeExcerpts||{}).find(g=>g.original.quote===quote);
 const q=existing?structuredClone(existing.original):{quote,language:'en',type:'original',attribution:`Emily Brontë, Wuthering Heights, John Murray, London, 1910; chapter ${source.roman}, paragraph ${p+1}; Project Gutenberg transcription (David Price, 2010).`,url:originalUrl,rightsUrl:'https://www.legislation.gov.uk/ukpga/1988/48/section/12',rightsNote:'Original text, public domain in Italy/EU/UK and US; author died 1848. No modern editorial apparatus.',verificationStatus:'verified',sourceParagraph:p+1};
 Object.assign(q,{highlightTerms:[term],highlightMode:'explicit',criticalPurpose:notes[0]});
 const excerpt={original:q,translations:existing?structuredClone(existing.translations):{}};
 const item={id:pid,name:tr(names),text:tr(notes),category:'action',quote,language:'en',type:'original',attribution:q.attribution,url:originalUrl,rightsUrl:q.rightsUrl,highlightTerms:[term],excerpt,displayInAtlas:false,geographicRelevance:'none',illustratedOnly:true};
 chapter.unlocatedPlaces=chapter.unlocatedPlaces.filter(u=>u.id!==pid);chapter.unlocatedPlaces.push(item);
 langs.forEach((l,i)=>{config.names[l][pid]=names[i];config.notes[l][pid]=notes[i];});
 records.push({section_id:ch,ordinal:1000+index,name:item.name,description:item.text,quote,metadata:Object.fromEntries(Object.entries(item).filter(([k])=>!['name','text','quote','url'].includes(k)))});
 audit.push({placeId:pid,sourceChapter:ch,sourceParagraph:p+1,sourceSha256:source.sha256,quote,highlightTerms:[term],category:'action',narrativeRationale:notes[0],positionEvidence:'Space and scene are textual; pixel position, adjacency and building form are interpretative, not measured or geographical.',sourceEdition:q.attribution});
}
for(const pid of ['heights','grange','gimmerton','penistone','moorland'])for(const l of langs)config.notes[l][pid]=labels[l].notice;
data.book.illustratedView=config;
fs.writeFileSync('docs/data/'+id+'.js','window.atlasData='+JSON.stringify(data,null,2)+';\n');fs.writeFileSync('docs/data/'+id+'-i18n.js','window.atlasTranslations='+JSON.stringify(dict,null,2)+';\n');
fs.writeFileSync(dir+'/views.json',JSON.stringify(config,null,2)+'\n');fs.writeFileSync(dir+'/views-evidence.json',JSON.stringify(audit,null,2)+'\n');
const lit=x=>"E'"+String(x).replaceAll('\\','\\\\').replaceAll("'","''").replaceAll('\n','\\n')+"'",json=x=>lit(JSON.stringify(x))+'::jsonb';
let sql=`begin;\ndo $$begin if not exists(select 1 from public.books where id='${id}' and publication_status='published') then raise exception 'Published novel missing'; end if; end$$;\n`;
sql+=`update public.books set metadata=jsonb_set(metadata,'{illustratedView}',${json(config)}) where id='${id}';\n`;
for(const r of records)sql+=`insert into public.unlocated_settings(book_id,section_id,ordinal,name,description,quote,source_id,metadata) values ('${id}',${r.section_id},${r.ordinal},${lit(r.name)},${lit(r.description)},${lit(r.quote)},(select id from public.sources where book_id='${id}' and url=${lit(originalUrl)} order by id limit 1),${json(r.metadata)}) on conflict(book_id,section_id,ordinal) do update set name=excluded.name,description=excluded.description,quote=excluded.quote,source_id=excluded.source_id,metadata=excluded.metadata;\n`;
for(const [l,m]of Object.entries(messages))for(const [source,value]of Object.entries(m))sql+=`insert into public.content_translations(book_id,language,source_hash,source_text,translated_text) values ('${id}','${l}','${hash(source)}',${lit(source)},${lit(value)}) on conflict(book_id,language,source_hash) do update set translated_text=excluded.translated_text;\n`;
sql+=`commit;\nselect id,publication_status,jsonb_array_length(metadata#>'{illustratedView,views}') as imaginary_views from public.books where id='${id}';\n`;fs.writeFileSync(dir+'/publish-views.sql',sql);
fs.writeFileSync(dir+'/verify-views.sql',`select id,publication_status,(metadata->'illustratedView'=${json(config)} and (select count(*) from public.unlocated_settings where book_id='${id}' and ordinal>=1000 and metadata->>'illustratedOnly'='true')=${records.length} and (select count(*) from public.place_references where book_id='${id}')=134) as verified from public.books where id='${id}';\n`);
console.log('Prepared three views, '+records.length+' hidden subsettings and '+audit.reduce((n,r)=>n+r.quote.split(/\s+/).length,0)+' original quoted words. Geography is unchanged.');
