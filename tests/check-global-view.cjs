const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
function setup(bookId,lang='en',global=false,query=null){
 const elements={},events={};let startup;
 function element(){return{children:[],parentElement:{children:[],appendChild(child){this.children.push(child)}},attributes:{},events:{},appendChild(child){this.children.push(child)},setAttribute(k,v){this.attributes[k]=v},addEventListener(k,f){this.events[k]=f},scrollIntoView(){},set innerHTML(value){this.html=value;this.children=[]},get innerHTML(){return this.html||''}}}
 const location={search:'?book='+bookId+'&lang='+lang+'&place=1&basemap=gray-vector',hash:'',href:'https://example.org/atlas.html',assign(url){this.assigned=url}};
 if(query!==null)location.search='?book='+bookId+'&lang='+lang+'&'+query;
 const ctx={console,URL,URLSearchParams,NodeFilter:{SHOW_TEXT:4},location,localStorage:{getItem(){},setItem(){}},window:{location,innerWidth:1200,matchMedia:()=>({matches:true}),addEventListener(k,f){events[k]=f}},document:{readyState:'loading',documentElement:{},body:{querySelectorAll:()=>[]},head:{querySelectorAll:()=>[]},addEventListener(k,f){startup=f},createTreeWalker:()=>({nextNode:()=>false}),querySelectorAll:()=>[],querySelector:()=>({}),getElementById:id=>elements[id]??(elements[id]=element()),createElement:element}};
 vm.createContext(ctx);for(const file of ['locales/ui.js','content/book-translations.js','i18n.js','data/'+bookId+'.js','data/'+bookId+'-i18n.js','basemaps.js'])vm.runInContext(fs.readFileSync('docs/'+file,'utf8'),ctx);
 ctx.window.atlasData=ctx.window.atlasI18n.localizeData(ctx.window.atlasData);
 if(global)location.hash='#'+ctx.window.atlasData.book.hashPrefix+'-all';location.href+=location.search+location.hash;
 startup();vm.runInContext(fs.readFileSync('docs/app.js','utf8').replace(/initializeMap\(\);\s*$/,''),ctx);
 vm.runInContext(`let graphics=[],targets=[];markerLayer={removeAll(){graphics=[]},add(g){graphics.push(g)}};GraphicClass=class{constructor(props){Object.assign(this,props)}};ExtentClass=class{constructor(props){Object.assign(this,props)}};viewReady=true;view={goTo(target){targets.push(target);return Promise.resolve()}};`,ctx);
 return{ctx,elements,events,location};
}
for(const id of ['ulisse','proust','war-and-peace','moby-dick','gatsby','holden'])for(const lang of ['en','it','fr','es']){
 const {ctx,elements,events,location}=setup(id,lang,true),data=ctx.window.atlasData;
 const expected=[...new Set(data.chapters.flatMap(c=>c.places))];
 assert.equal(vm.runInContext('current',ctx),-1);assert.equal(ctx.window.atlasState().place,1);
 assert.equal(elements['all-places'].attributes['aria-pressed'],'true');assert.equal(elements.previous.hidden,true);
 assert.ok(elements.detail.innerHTML.includes(ctx.window.atlasI18n.t('Whole novel')));
 vm.runInContext('drawMarkers();overview()',ctx);
 const graphicIds=vm.runInContext('graphics.filter(g=>g.symbol.type===\'simple-marker\').map(g=>g.attributes.placeIndex)',ctx);
 assert.equal(graphicIds.length,expected.length);assert.equal(new Set(graphicIds).size,expected.length);
 assert.equal(vm.runInContext('graphics.every(g=>g.attributes.chapterId===\'all\')',ctx),true);
 const extent=vm.runInContext('targets.at(-1)',ctx);assert.ok(extent.xmin>=-180&&extent.xmax<=180&&extent.ymin>=-85&&extent.ymax<=85);
 vm.runInContext('selectPlace(0)',ctx);const refs=elements['selected-location'].children.at(-1);
 const occurrences=data.chapters.filter(c=>c.places.includes(expected[0])||(c.citations||[]).some(r=>r.placeId===expected[0]));assert.equal(refs.children.length,occurrences.length+1);
 assert.equal(refs.children[0].textContent,ctx.window.atlasI18n.t('Appears in'));
 refs.children[1].events.click();const sectionIndex=data.chapters.findIndex(c=>c.places.includes(expected[0]));
 assert.equal(vm.runInContext('current',ctx),sectionIndex);assert.equal(elements['all-places'].attributes['aria-pressed'],'false');assert.equal(elements.previous.hidden,false);
 assert.equal(vm.runInContext('graphics.length',ctx),data.chapters[sectionIndex].places.length*2);
 elements['all-places'].events.click();assert.equal(location.hash,data.book.hashPrefix+'-all');
 assert.equal(vm.runInContext('graphics.length',ctx),expected.length*2);
 location.hash='#'+data.book.hashPrefix+'-all';events.hashchange();
 vm.runInContext('selectPlace(1)',ctx);elements['language-select'].value=lang==='en'?'it':'en';elements['language-select'].events.change();
 const url=new URL(location.assigned);assert.equal(url.hash,'#'+data.book.hashPrefix+'-all');assert.equal(url.searchParams.get('place'),'1');assert.equal(url.searchParams.get('basemap'),'gray-vector');
 location.hash='#'+data.book.hashPrefix+'-'+data.chapters[0].id;events.hashchange();assert.equal(vm.runInContext('current',ctx),0);
 location.hash='#'+data.book.hashPrefix+'-all';events.hashchange();assert.equal(vm.runInContext('current',ctx),-1);
 // Chapter navigation fits action only; explicit Fit View includes both collections.
 const allPlaces={...data.citedPlaces,...data.places};
 function checkTarget(ids,fallback){
  const points=ids.map(id=>allPlaces[id]),target=vm.runInContext('targets.at(-1)',ctx);
  if(!points.length){assert.equal(JSON.stringify(target),JSON.stringify(fallback));return;}
  if(points.length===1){assert.deepEqual(Array.from(target.center),[points[0].coords[1],points[0].coords[0]]);assert.equal(target.zoom,points[0].zoom);return;}
  const xs=points.map(p=>p.coords[1]),ys=points.map(p=>p.coords[0]);
  const xlo=Math.min(...xs),xhi=Math.max(...xs),ylo=Math.min(...ys),yhi=Math.max(...ys),mx=Math.max(.002,(xhi-xlo)*.18),my=Math.max(.002,(yhi-ylo)*.18);
  assert.equal(target.xmin,Math.max(-180,xlo-mx));assert.equal(target.xmax,Math.min(180,xhi+mx));assert.equal(target.ymin,Math.max(-85,ylo-my));assert.equal(target.ymax,Math.min(85,yhi+my));
 }
 vm.runInContext('selectAllPlaces()',ctx);
 const actionIds=expected.filter(id=>data.chapters.some(c=>c.places.includes(id)&&c.placeCategories?.[id]!=='mentioned'));
 checkTarget(actionIds,data.book.initialView);
 elements.overview.events.click();checkTarget([...expected,...data.chapters.flatMap(c=>(c.citations||[]).map(r=>r.placeId))]);
 const opening=setup(id,lang,false,'');assert.equal(vm.runInContext('current',opening.ctx),-1);assert.equal(opening.elements['all-places'].attributes['aria-pressed'],'true');
 assert.equal(vm.runInContext('visibleLayers.mentioned',opening.ctx),true);
 const candidates=data.chapters.map((chapter,index)=>({chapter,index})).filter(({chapter})=>chapter.places.some(id=>chapter.placeCategories?.[id]==='mentioned')||chapter.citations?.length);
 for(const {chapter,index}of candidates.slice(0,2)){
  vm.runInContext(`selectChapter(${index},true,false)`,ctx);
  const ids=chapter.overviewPlaces??chapter.places;
  checkTarget(ids.filter(id=>chapter.placeCategories?.[id]!=='mentioned'),chapter.initialView||data.book.initialView);
  elements.overview.events.click();checkTarget([...chapter.places,...(chapter.citations||[]).map(r=>r.placeId)]);
 }
 if(id==='holden'){
  vm.runInContext('selectChapter(16,true,false)',ctx);
  checkTarget(['biltmore','rink']);
  elements.overview.events.click();checkTarget(data.chapters[16].places);
  vm.runInContext("setLayerVisibility('mentioned',false)",ctx);elements.overview.events.click();checkTarget(['biltmore','rink']);
  vm.runInContext("setLayerVisibility('mentioned',true);selectChapter(0,true,false)",ctx);checkTarget([],data.book.initialView);
  vm.runInContext("chapters[16].overviewPlaces=['biltmore'];selectChapter(16,true,false)",ctx);checkTarget(['biltmore']);
  elements.overview.events.click();checkTarget(data.chapters[16].places);
  vm.runInContext('delete chapters[16].overviewPlaces',ctx);
 }
 if(id==='holden')for(let index=0;index<data.chapters.length;index++){
  vm.runInContext(`selectChapter(${index},false)`,ctx);
  assert.equal(vm.runInContext('graphics.length',ctx),data.chapters[index].places.length*2);
  for(let place=0;place<data.chapters[index].places.length;place++){
   vm.runInContext(`selectPlace(${place})`,ctx);
   assert.ok(!elements['selected-location'].innerHTML.includes('undefined'));
   const category=data.chapters[index].placeCategories[data.chapters[index].places[place]];
   assert.ok(elements['selected-location'].innerHTML.includes('category-'+category));
  }
  if(data.chapters[index].unlocatedPlaces.length)assert.ok(!elements['selected-location'].parentElement.children.at(-1).innerHTML.includes('<blockquote'),'No empty original-passage blocks for paraphrases');
 }
}
const html=fs.readFileSync('docs/atlas.html','utf8');assert.match(html,/id="all-places"/);assert.match(html,/legend-diamond/);assert.match(html,/legend-selected/);
const focusSource=setup('proust','en',true).ctx.window.atlasData;
const focusId=Object.keys(focusSource.places).find(id=>!focusSource.chapters[0].places.includes(id));
const focused=setup('proust','en',false,'focus='+encodeURIComponent(focusId));
assert.equal(vm.runInContext('current',focused.ctx),-1);
assert.equal(vm.runInContext('activeChapter().places[selectedPlace]',focused.ctx),focusId);
vm.runInContext('centerSelectedPlace()',focused.ctx);
assert.deepEqual(Array.from(vm.runInContext('targets.at(-1).center',focused.ctx)),[focusSource.places[focusId].coords[1],focusSource.places[focusId].coords[0]]);
const explicit=setup('proust','en',false,'focus='+encodeURIComponent(focusId)+'&place=0');
assert.equal(vm.runInContext('current',explicit.ctx),-1);assert.equal(explicit.ctx.window.atlasState().place,0);
const unknown=setup('proust','en',false,'focus=unknown-location');assert.equal(vm.runInContext('current',unknown.ctx),-1);
const emptyAction=setup('gatsby','en',false,'');
vm.runInContext("for(const c of chapters)c.placeCategories=Object.fromEntries(c.places.map(id=>[id,'mentioned']));overview()",emptyAction.ctx);
assert.equal(JSON.stringify(vm.runInContext('targets.at(-1)',emptyAction.ctx)),JSON.stringify(emptyAction.ctx.window.atlasData.book.initialView));
vm.runInContext("chapters[0].placeCategories[chapters[0].places[0]]='action';overview()",emptyAction.ctx);
const only=emptyAction.ctx.window.atlasData.places[emptyAction.ctx.window.atlasData.chapters[0].places[0]];
assert.deepEqual(Array.from(vm.runInContext('targets.at(-1).center',emptyAction.ctx)),[only.coords[1],only.coords[0]]);
console.log('PASS: global view in six novels and four languages; unique markers, full extent, references back to sections, chapter/global switching, shared links and language changes preserve the global view and selected point.');
