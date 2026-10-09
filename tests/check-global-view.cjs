const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
function setup(bookId,lang='en',global=false){
 const elements={},events={};let startup;
 function element(){return{children:[],attributes:{},events:{},appendChild(child){this.children.push(child)},setAttribute(k,v){this.attributes[k]=v},addEventListener(k,f){this.events[k]=f},scrollIntoView(){},set innerHTML(value){this.html=value;this.children=[]},get innerHTML(){return this.html||''}}}
 const location={search:'?book='+bookId+'&lang='+lang+'&place=1&basemap=gray-vector',hash:'',href:'https://example.org/atlas.html',assign(url){this.assigned=url}};
 const ctx={console,URL,URLSearchParams,NodeFilter:{SHOW_TEXT:4},location,localStorage:{getItem(){},setItem(){}},window:{location,innerWidth:1200,matchMedia:()=>({matches:true}),addEventListener(k,f){events[k]=f}},document:{readyState:'loading',documentElement:{},body:{querySelectorAll:()=>[]},head:{querySelectorAll:()=>[]},addEventListener(k,f){startup=f},createTreeWalker:()=>({nextNode:()=>false}),querySelectorAll:()=>[],querySelector:()=>({}),getElementById:id=>elements[id]??(elements[id]=element()),createElement:element}};
 vm.createContext(ctx);for(const file of ['locales/ui.js','i18n.js','data/'+bookId+'.js','data/'+bookId+'-i18n.js','basemaps.js'])vm.runInContext(fs.readFileSync('docs/'+file,'utf8'),ctx);
 ctx.window.atlasData=ctx.window.atlasI18n.localizeData(ctx.window.atlasData);
 if(global)location.hash='#'+ctx.window.atlasData.book.hashPrefix+'-all';location.href+=location.search+location.hash;
 startup();vm.runInContext(fs.readFileSync('docs/app.js','utf8').replace(/initializeMap\(\);\s*$/,''),ctx);
 vm.runInContext(`let graphics=[],targets=[];markerLayer={removeAll(){graphics=[]},add(g){graphics.push(g)}};GraphicClass=class{constructor(props){Object.assign(this,props)}};ExtentClass=class{constructor(props){Object.assign(this,props)}};viewReady=true;view={goTo(target){targets.push(target);return Promise.resolve()}};`,ctx);
 return{ctx,elements,events,location};
}
for(const id of ['ulisse','proust','war-and-peace','moby-dick'])for(const lang of ['en','it','fr','es']){
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
}
const html=fs.readFileSync('docs/atlas.html','utf8');assert.match(html,/id="all-places"/);assert.match(html,/legend-diamond/);assert.match(html,/legend-selected/);
console.log('PASS: global view in four novels and four languages; unique markers, full extent, references back to sections, chapter/global switching, shared links and language changes preserve the global view and selected point.');
