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
 vm.createContext(ctx);for(const file of ['locales/ui.js','content/book-translations.js','i18n.js',...(book==='macondo'?['data/macondo-local.js','fictional-atlas-adapter.js','atlas-modes.js']:['data/'+book+'.js','data/'+book+'-i18n.js']),'basemaps.js'])vm.runInContext(fs.readFileSync('docs/'+file,'utf8'),ctx);
 if(book==='macondo')ctx.window.atlasData=ctx.window.AtlasModes.adapt(ctx.window.IllustratedAdapter.adapt(ctx.window.atlasIllustratedLocal,lang),'geographic',lang);
 ctx.window.atlasData=ctx.window.atlasI18n.localizeData(ctx.window.atlasData);startup();
 vm.runInContext(fs.readFileSync('docs/app.js','utf8').replace(/initializeMap\(\);\s*$/,''),ctx);
 vm.runInContext(`function layer(){return{graphics:[],visible:true,removeAll(){this.graphics=[]},add(g){this.graphics.push(g)}}}markerLayer=layer();citedMarkerLayer=layer();GraphicClass=class{constructor(p){Object.assign(this,p)}};ExtentClass=class{constructor(p){Object.assign(this,p)}};viewReady=true;view={goTo(){return Promise.resolve()}};drawMarkers();`,ctx);
 return {ctx,elements,location,run:s=>vm.runInContext(s,ctx)};
}
function assertVisibleNumbers(run,elements){
 const labels=run("[markerLayer,citedMarkerLayer].filter(layer=>layer.visible).flatMap(layer=>layer.graphics.filter(g=>g.symbol.type==='text'))");
 for(const category of ['action','mentioned']){
  const group=Array.from(labels).filter(g=>g.attributes.category===category);
  for(const label of group)assert.match(label.symbol.text,category==='mentioned'?/^C[1-9]\d*$/:/^[1-9]\d*$/);
  const actual=group.map(g=>Number(g.symbol.text.replace(/^C/,''))).sort((a,b)=>a-b);
  assert.deepEqual(actual,Array.from({length:group.length},(_,i)=>i+1),'each visible category starts at 1 without gaps');
 }
 const numbers=run('visibleMarkerNumbers()');
 if(run('visibleLayers.mentioned')){
  const mentions=Array.from(labels).filter(g=>g.attributes.category==='mentioned').length;
  assert.equal(Number(elements['layer-mentioned-count'].textContent),mentions,'Mention count matches the markers without global duplicates');
 }
 for(const [index,button]of run('citationButtons').entries()){
  const duplicate=run(`current<0&&activeChapter().places.includes(activeCitations()[${index}].placeId)&&(placeCategory(activeCitations()[${index}].placeId)==='mentioned'||visibleLayers.action)`);
  assert.equal(button.hidden,duplicate,'A citation already represented by a core marker has no duplicate global button');
 }
 for(const [buttons,values]of [[run('placeButtons'),numbers.places],[run('citationButtons'),numbers.citations]]){
  for(const [index,button]of buttons.entries()){
   if(values[index]==null)assert.match(button.innerHTML,/<span hidden><\/span>/);
   else assert.ok(button.innerHTML.startsWith('<span>'+values[index]+'</span>'),'detail label matches marker');
  }
 }
 for(const label of labels){
  const a=label.attributes;
  assert.equal(label.symbol.text,Number.isInteger(a.placeIndex)?numbers.places[a.placeIndex]:numbers.citations[a.citationIndex],'selection retains the original source index');
 }
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
  assert.equal(elements['citation-locations'].children.length,d.chapters[index].citations.length+d.chapters[index].places.filter(id=>d.chapters[index].placeCategories?.[id]==='mentioned').length);
  run('citationButtons')[0].events.click();assert.equal(ctx.window.atlasState().citation,0);assert.match(elements['selected-location'].innerHTML,/category-mentioned/);
  const group=d.chapters[index].citations[0].excerpt,passage=group.original.language===lang?group.original:group.translations?.[lang]||group.original;
  const expected='lang="'+passage.language+'"';
  assert.ok(elements['selected-location'].children.some(c=>c.innerHTML.includes(expected)));
  for(const layer of ['markerLayer','citedMarkerLayer']){const graphics=run(layer+'.graphics.filter(g=>g.symbol.type===\'simple-marker\')');for(const g of graphics){const category=layer==='markerLayer'?'action':'mentioned';assert.equal(g.attributes.category,category);assert.equal(g.symbol.color,category==='action'?'#19665c':'#99502d');const id=Number.isInteger(g.attributes.citationIndex)?d.chapters[index].citations[g.attributes.citationIndex].placeId:d.chapters[index].places[g.attributes.placeIndex];assert.equal(g.symbol.style,['area','street','uncertain'].includes(all[id].kind)?'diamond':'circle')}}
  const selected=run('citedMarkerLayer.graphics.find(g=>g.attributes.citationIndex===0&&g.symbol.type===\'simple-marker\')');assert.equal(selected.symbol.outline.color,'#e8c565');assert.equal(selected.symbol.color,'#99502d');
  const basemap=ctx.window.atlasState().basemap;elements['layer-action'].events.change({target:{checked:false}});assert.equal(run('markerLayer.visible'),false);assert.equal(run('citedMarkerLayer.visible'),true);assert.equal(elements['layer-markers'].indeterminate,true);assert.equal(ctx.window.atlasState().basemap,basemap);
  elements['layer-markers'].events.change({target:{checked:false}});assert.equal(run('markerLayer.visible||citedMarkerLayer.visible'),false);assert.equal(elements['layer-markers'].indeterminate,false);
  run('selectAllPlaces(false,false)');assert.equal(ctx.window.atlasState().layers,'none');run("setLayerVisibility('all',true)");
  const shared=run("globalCitations.findIndex(r=>globalChapter.places.includes(r.placeId)&&placeCategory(r.placeId)==='action')");
  if(shared>=0){run('selectCitation('+shared+')');const id=run('globalCitations['+shared+'].placeId');assert.equal(run('citedMarkerLayer.graphics.some(g=>globalCitations[g.attributes.citationIndex]?.placeId==='+JSON.stringify(id)+')'),false);assert.equal(run('markerLayer.graphics.some(g=>globalChapter.places[g.attributes.placeIndex]==='+JSON.stringify(id)+'&&g.symbol.outline?.color===\'#e8c565\')'),true);run("setLayerVisibility('action',false)");assert.equal(run('citedMarkerLayer.graphics.some(g=>globalCitations[g.attributes.citationIndex]?.placeId==='+JSON.stringify(id)+')'),true)}
  run("setLayerVisibility('action',false);selectCitation(0)");location.hash='#'+d.book.hashPrefix+'-all';location.href='https://example.org/atlas.html'+location.search+location.hash;elements['language-select'].value=lang==='en'?'it':'en';elements['language-select'].events.change();const destination=new URL(location.assigned);assert.equal(destination.searchParams.get('layers'),'mentioned');assert.equal(destination.searchParams.get('citation'),'0');assert.equal(destination.hash,location.hash);
  for(const global of [false,true]){
   run(global?'selectAllPlaces(false,false)':'selectChapter('+index+',false,false)');
   const selection=JSON.stringify(ctx.window.atlasState()),chapter=run('current');
   for(const [action,mentioned]of [[true,true],[false,true],[true,false],[false,false],[true,true]]){
    elements['layer-action'].events.change({target:{checked:action}});elements['layer-mentioned'].events.change({target:{checked:mentioned}});
    assertVisibleNumbers(run,elements);
    const state=ctx.window.atlasState(),before=JSON.parse(selection);
    assert.equal(state.place,before.place);assert.equal(state.citation,before.citation);assert.equal(run('current'),chapter);
   }
  }
  const csv=fs.readFileSync('docs/'+book+'-citations-'+lang+'.csv','utf8');assert.equal(csvRows(csv),references+1);assert.ok(csv.includes(data.chapters[index].citations[0].excerpt.original.url));
 }
}
const html=fs.readFileSync('docs/atlas.html','utf8');for(const id of ['layer-markers','layer-action','layer-mentioned'])assert.match(html,new RegExp('id="'+id+'"'));
const catalogue={window:{}};vm.runInNewContext(fs.readFileSync('docs/content/books.js','utf8'),catalogue);
const survey=[];
for(const {id:book}of catalogue.window.atlasCatalogue.books){
 const {run,elements}=setup(book,'en');let mixed=-1;
 const count=run('chapters.length');
 for(let i=-1;i<count;i++){
  run(i<0?'selectAllPlaces(false,false)':'selectChapter('+i+',false,false)');
  const chapter=run('activeChapter()'),buttons=run('placeButtons'),citations=run('citationButtons');
  const actions=chapter.places.filter(id=>run('placeCategory('+JSON.stringify(id)+')')==='action').length;
  const mentions=chapter.places.length-actions;
  assert.equal(elements['episode-locations'].children.length,actions,book+'/'+i+' action group');
  assert.equal(elements['citation-locations']?.children.length||0,mentions+citations.length,book+'/'+i+' mentioned group');
  chapter.places.forEach((id,index)=>assert.equal(buttons[index].parentElement.id,run('placeCategory('+JSON.stringify(id)+')')==='mentioned'?'citation-locations':'episode-locations'));
  assertVisibleNumbers(run,elements);
  if(mentions&&i>=0&&mixed<0)mixed=i;
 }
 for(const lang of ['it','fr','es']){
  const localized=setup(book,lang);
  if(mixed>=0)localized.run('selectChapter('+mixed+',false,false)');
  const index=localized.run("activeChapter().places.findIndex(id=>placeCategory(id)==='mentioned')");
  if(index>=0){localized.run('placeButtons')[index].events.click();assert.equal(localized.run('selectedPlace'),index);assert.equal(localized.run('placeButtons')[index].attributes['aria-pressed'],'true');localized.run("setLayerVisibility('action',false)");assertVisibleNumbers(localized.run,localized.elements);}
 }
 survey.push({book,sections:count,mixedSection:mixed<0?null:mixed+1});
}
console.log('PASS: separate action/mentioned lists in every section and global view of '+survey.length+' catalogue novels; four interface languages, mixed storage formats, original selection indices and marker numbering.');
console.log('PASS: 1,106 sourced citations; original language retained in all four locales; restored 276 Moby-Dick positions; two independent layers, category colors, geometric shapes, selected outline, TOC, global overlap handling and CSVs.');
