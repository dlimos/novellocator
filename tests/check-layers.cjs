const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const audit=JSON.parse(fs.readFileSync('tests/fixtures/original-citations.json','utf8'));
const books={ulisse:[18,55,186,'en'],proust:[7,67,231,'fr'],'war-and-peace':[17,30,136,'ru'],'moby-dick':[136,266,553,'en']};
function setup(book,lang){
 const elements={};let startup;
 function register(node){if(node.id)elements[node.id]=node;node.children.forEach(register)}
 function element(){return {children:[],events:{},attributes:{},appendChild(child){child.parentElement=this;this.children.push(child);register(child)},after(child){this.parentElement?.appendChild(child);register(child)},setAttribute(k,v){this.attributes[k]=v},addEventListener(k,f){this.events[k]=f},scrollIntoView(){},set innerHTML(v){this.html=v;this.children=[];if(this.id==='detail'){delete elements['citation-locations'];for(const id of ['episode-locations','selected-location','previous','next']){const child=element();child.id=id;this.appendChild(child)}}},get innerHTML(){return this.html||''}}}
 const get=id=>{if(!elements[id]){const node=element();node.id=id;elements[id]=node}return elements[id]};
 const location={search:'?book='+book+'&lang='+lang,hash:'',href:'https://example.org/atlas.html?book='+book+'&lang='+lang,assign(url){this.assigned=url}};
 const ctx={console,URL,URLSearchParams,NodeFilter:{SHOW_TEXT:4},location,localStorage:{getItem(){},setItem(){}},window:{location,innerWidth:1200,matchMedia:()=>({matches:true}),addEventListener(){}},document:{readyState:'loading',documentElement:{},body:{querySelectorAll:()=>[]},head:{querySelectorAll:()=>[]},addEventListener(k,f){startup=f},createTreeWalker:()=>({nextNode:()=>false}),querySelectorAll:()=>[],querySelector:()=>({}),getElementById:get,createElement:element}};
 vm.createContext(ctx);for(const file of ['locales/ui.js','i18n.js','data/'+book+'.js','data/'+book+'-i18n.js','basemaps.js'])vm.runInContext(fs.readFileSync('docs/'+file,'utf8'),ctx);
 ctx.window.atlasData=ctx.window.atlasI18n.localizeData(ctx.window.atlasData);startup();
 vm.runInContext(fs.readFileSync('docs/app.js','utf8').replace(/initializeMap\(\);\s*$/,''),ctx);
 vm.runInContext(`function layer(){return{graphics:[],visible:true,removeAll(){this.graphics=[]},add(g){this.graphics.push(g)}}}markerLayer=layer();citedMarkerLayer=layer();GraphicClass=class{constructor(p){Object.assign(this,p)}};ExtentClass=class{constructor(p){Object.assign(this,p)}};viewReady=true;view={goTo(){return Promise.resolve()}};drawMarkers();`,ctx);
 return {ctx,elements,location,run:s=>vm.runInContext(s,ctx)};
}
function csvRows(text){let rows=0,quoted=false;for(let i=0;i<text.length;i++){if(text[i]==='"'){if(quoted&&text[i+1]==='"')i++;else quoted=!quoted}else if(text[i]==='\n'&&!quoted)rows++}assert.equal(quoted,false);return rows}
assert.equal(audit.records.length,1106);
for(const [book,[sections,places,references,language]]of Object.entries(books)){
 const coverage=audit.coverage.find(c=>c.book===book);assert.equal(coverage.sections.length,sections);assert.equal(coverage.language,language);for(const s of coverage.sections){assert.match(s.sha256,/^[a-f0-9]{64}$/);assert.ok(s.characters>100)}
 const raw={window:{}};vm.runInNewContext(fs.readFileSync('docs/data/'+book+'.js','utf8'),raw);const data=raw.window.atlasData;
 assert.equal(Object.keys(data.citedPlaces).length,places);assert.equal(data.chapters.reduce((n,c)=>n+c.citations.length,0),references);
 const all={...data.citedPlaces,...data.places};
 for(const c of data.chapters){assert.equal(new Set(c.citations.map(r=>r.placeId)).size,c.citations.length);for(const r of c.citations){const a=audit.records.find(a=>a.book===book&&a.section===c.id&&a.placeId===r.placeId);assert.ok(a);assert.equal(r.category,'mentioned');assert.equal(r.excerpt.original.language,language);assert.equal(r.excerpt.original.quote,a.quote);assert.ok(a.paragraph.includes(a.quote.replace(/^\[\u2026\] | \[\u2026\]$/g,'')));assert.equal(r.excerpt.original.url,a.url);assert.match(a.url,/^https:\/\//);assert.deepEqual(Array.from(all[r.placeId].coords),a.coords);assert.ok(Math.abs(a.coords[0])<=90&&Math.abs(a.coords[1])<=180);assert.ok(all[r.placeId].positionSource.url);}}
 if(book==='moby-dick'){assert.equal(Object.keys(all).length,276);assert.deepEqual(Array.from(all.gibraltar.coords),[35.97388888888889,-5.516111111111111]);for(const id of ['england','java','sumatra','wapping'])assert.ok(data.citedPlaces[id],id+' restored as a citation')}
 for(const lang of ['en','it','fr','es']){
  const {ctx,elements,location,run}=setup(book,lang),d=ctx.window.atlasData;
  const index=d.chapters.findIndex(c=>c.citations.length);run('selectChapter('+index+',false,false)');
  assert.equal(elements['citation-locations'].children.length,d.chapters[index].citations.length);
  elements['citation-locations'].children[0].events.click();assert.equal(ctx.window.atlasState().citation,0);assert.match(elements['selected-location'].innerHTML,/category-mentioned/);assert.ok(elements['selected-location'].children.some(c=>c.innerHTML.includes('lang="'+language+'"')));
  for(const layer of ['markerLayer','citedMarkerLayer']){const graphics=run(layer+'.graphics.filter(g=>g.symbol.type===\'simple-marker\')');for(const g of graphics){const category=layer==='markerLayer'?'action':'mentioned';assert.equal(g.attributes.category,category);assert.equal(g.symbol.color,category==='action'?'#19665c':'#99502d');const id=Number.isInteger(g.attributes.citationIndex)?d.chapters[index].citations[g.attributes.citationIndex].placeId:d.chapters[index].places[g.attributes.placeIndex];assert.equal(g.symbol.style,['area','street','uncertain'].includes(all[id].kind)?'diamond':'circle')}}
  const selected=run('citedMarkerLayer.graphics.find(g=>g.attributes.citationIndex===0&&g.symbol.type===\'simple-marker\')');assert.equal(selected.symbol.outline.color,'#e8c565');assert.equal(selected.symbol.color,'#99502d');
  const basemap=ctx.window.atlasState().basemap;elements['layer-action'].events.change({target:{checked:false}});assert.equal(run('markerLayer.visible'),false);assert.equal(run('citedMarkerLayer.visible'),true);assert.equal(elements['layer-markers'].indeterminate,true);assert.equal(ctx.window.atlasState().basemap,basemap);
  elements['layer-markers'].events.change({target:{checked:false}});assert.equal(run('markerLayer.visible||citedMarkerLayer.visible'),false);assert.equal(elements['layer-markers'].indeterminate,false);
  run('selectAllPlaces(false,false)');assert.equal(ctx.window.atlasState().layers,'none');run("setLayerVisibility('all',true)");
  const shared=run("globalCitations.findIndex(r=>globalChapter.places.includes(r.placeId)&&placeCategory(r.placeId)==='action')");
  if(shared>=0){run('selectCitation('+shared+')');const id=run('globalCitations['+shared+'].placeId');assert.equal(run('citedMarkerLayer.graphics.some(g=>globalCitations[g.attributes.citationIndex]?.placeId==='+JSON.stringify(id)+')'),false);assert.equal(run('markerLayer.graphics.some(g=>globalChapter.places[g.attributes.placeIndex]==='+JSON.stringify(id)+'&&g.symbol.outline?.color===\'#e8c565\')'),true);run("setLayerVisibility('action',false)");assert.equal(run('citedMarkerLayer.graphics.some(g=>globalCitations[g.attributes.citationIndex]?.placeId==='+JSON.stringify(id)+')'),true)}
  run("setLayerVisibility('action',false);selectCitation(0)");location.hash='#'+d.book.hashPrefix+'-all';location.href='https://example.org/atlas.html'+location.search+location.hash;elements['language-select'].value=lang==='en'?'it':'en';elements['language-select'].events.change();const destination=new URL(location.assigned);assert.equal(destination.searchParams.get('layers'),'mentioned');assert.equal(destination.searchParams.get('citation'),'0');assert.equal(destination.hash,location.hash);
  const csv=fs.readFileSync('docs/'+book+'-citations-'+lang+'.csv','utf8');assert.equal(csvRows(csv),references+1);assert.ok(csv.includes(data.chapters[index].citations[0].excerpt.original.url));
 }
}
const html=fs.readFileSync('docs/atlas.html','utf8');for(const id of ['layer-markers','layer-action','layer-mentioned'])assert.match(html,new RegExp('id="'+id+'"'));
console.log('PASS: 1,106 sourced citations; original language retained in all four locales; restored 276 Moby-Dick positions; two independent layers, category colors, geometric shapes, selected outline, TOC, global overlap handling and CSVs.');
