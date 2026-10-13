const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const context={window:{}};
for(const file of ['docs/data/orwell1984.js','docs/data/orwell1984-i18n.js','docs/csv-export.js'])vm.runInNewContext(fs.readFileSync(file,'utf8'),context);
const data=context.window.atlasData,dict=context.window.atlasTranslations;
const audit=JSON.parse(fs.readFileSync('tests/fixtures/orwell1984-sources.json','utf8'));
const corpus=JSON.parse(fs.readFileSync('work/orwell1984/sections.json','utf8'));
assert.equal(data.chapters.length,25);assert.deepEqual(audit.structure.parts,[8,10,6]);assert(audit.structure.appendix);assert.equal(audit.sections.length,25);
assert.match(data.chapters[17].title,/Part 2 · Chapter 10/);assert.match(data.chapters[24].title,/Newspeak/);
assert(corpus[17].text.startsWith('When he woke'));assert(corpus[24].text.startsWith('Newspeak was the official language'));
assert(corpus[23].text.endsWith('He loved Big Brother.'));assert(corpus[24].text.endsWith('2050.'));
let mapped=0,unlocated=0;
for(const c of data.chapters){
 const text=corpus[c.id-1].text.replace(/\s+/g,' ');
 function evidence(q){assert(q?.quote,`${c.id}: missing evidence`);assert.equal(q.language,'en');assert(text.includes(q.quote.replace(/\s+/g,' ')),`${c.id}: nonliteral quote`);assert.match(q.attribution,/1949/);assert(q.attribution.includes(corpus[c.id-1].title));assert.equal(q.url,audit.source.url);}
 evidence(c.excerpts.original);
 for(const id of c.places){assert(data.places[id]);evidence(c.placeExcerpts[id].original);mapped++;}
 const seen=new Set();
 for(const ref of c.citations){assert(!seen.has(ref.placeId));seen.add(ref.placeId);assert(data.citedPlaces[ref.placeId]);assert.equal(ref.category,'mentioned');evidence(ref.excerpt.original);mapped++;}
 for(const p of c.unlocatedPlaces){evidence(p);assert(!Object.hasOwn(p,'coords'));unlocated++;}
 for(const lang of ['en','it','fr','es'])for(const value of [c.title,c.text,c.note,c.emptyMessage,...c.unlocatedPlaces.map(p=>p.name)])assert(dict[lang][value],lang+': '+value);
 for(const lang of ['it','fr','es'])assert.notEqual(dict[lang][c.text],c.text);
}
assert.equal(new Set([...Object.keys(data.places),...Object.keys(data.citedPlaces)]).size,58);assert.equal(mapped,102);assert.equal(unlocated,203);
for(const id of ['oceania','eurasia','eastasia','truth','love','room101','golden'])assert(!data.places[id]&&!data.citedPlaces[id]);
assert(data.chapters[15].unlocatedPlaces.some(p=>p.id==='truth')===false); // A model never manufactures a chapter reference.
assert(data.chapters[15].citations.some(p=>p.placeId==='shoreditch'));
assert(data.chapters[24].citations.some(p=>p.placeId==='paris'));
assert(data.chapters[0].unlocatedPlaces.find(p=>p.id==='truth').additionalSource.url.includes('orwellfoundation'));
assert(audit.rejectedGeocodes.some(s=>s.startsWith('rhine')));
for(const lang of ['en','it','fr','es'])for(const kind of ['places','citations'])assert(fs.readFileSync(`docs/orwell1984-${kind}-${lang}.csv`,'utf8').includes(audit.source.url));
for(const lang of ['en','it','fr','es']){
 const elements={};let startup;
 const el=()=>({children:[],attributes:{},listeners:{},appendChild(x){this.children.push(x)},setAttribute(k,v){this.attributes[k]=v},addEventListener(k,f){this.listeners[k]=f},scrollIntoView(){},after(){}});
 const get=id=>elements[id]??(elements[id]=el());get('selected-location').parentElement=el();
 const location={hash:'#section-1',search:'?book=orwell1984&lang='+lang,href:'https://example.com/atlas.html?book=orwell1984&lang='+lang,assign(){}};
 const ctx={console,URL,URLSearchParams,NodeFilter:{SHOW_TEXT:4},location,localStorage:{getItem(){},setItem(){}},window:{location,innerWidth:1100,matchMedia:()=>({matches:true}),addEventListener(){}},document:{readyState:'loading',documentElement:{},body:{querySelectorAll:()=>[]},head:{querySelectorAll:()=>[]},addEventListener(k,f){startup=f},createTreeWalker:()=>({nextNode:()=>false}),querySelectorAll:()=>[],getElementById:get,querySelector:()=>({}),createElement:el}};
 vm.createContext(ctx);for(const file of ['locales/ui.js','content/book-translations.js','i18n.js','data/orwell1984.js','data/orwell1984-i18n.js','basemaps.js'])vm.runInContext(fs.readFileSync('docs/'+file,'utf8'),ctx);
 ctx.window.atlasData=ctx.window.atlasI18n.localizeData(ctx.window.atlasData);startup();vm.runInContext(fs.readFileSync('docs/app.js','utf8').replace(/initializeMap\(\);\s*$/,''),ctx);
 for(let i=0;i<25;i++){
  get('selected-location').parentElement.children=[];
  vm.runInContext(`selectChapter(${i},false,false)`,ctx);assert(elements.detail.innerHTML.includes(ctx.window.atlasData.chapters[i].title));
  const expected='lang="en"';
  const visible=vm.runInContext('unlocatedPlacesForDisplay(activeChapter())',ctx);
  const unlocatedSection=get('selected-location').parentElement.children.find(node=>node.className==='unlocated-places');
  if(visible.length){assert(unlocatedSection);assert(unlocatedSection.innerHTML.includes(expected));}
  else assert.equal(unlocatedSection,undefined,'empty unlocated heading must not be rendered');
  for(const hidden of ['truth','peace','love','plenty','room101','golden']){
   assert(!visible.some(p=>p.id===hidden),'invented institution or dream location visible: '+hidden);
   const record=ctx.window.atlasData.chapters[i].unlocatedPlaces.find(p=>p.id===hidden);
   if(record)assert(!unlocatedSection?.innerHTML.includes('<summary>'+record.name+'</summary>'));
  }
  if(!data.chapters[i].places.length)assert(get('selected-location').innerHTML.includes(expected),'section quotation or pending message absent in unlocated section');
  if(data.chapters[i].citations.length){vm.runInContext('selectCitation(0)',ctx);assert(get('selected-location').children.at(-1).innerHTML.includes(expected));}
 }
 vm.runInContext('selectChapter(7,false,false)',ctx);
 assert(vm.runInContext("unlocatedPlacesForDisplay(activeChapter()).some(p=>p.id==='prole-streets')",ctx),'documented London area should remain available');
 assert(ctx.window.atlasData.chapters[0].unlocatedPlaces.some(p=>p.id==='truth'),'hidden institutions must remain in the analysis data');
 assert.deepEqual(Array.from(ctx.window.atlasData.chapters[0].places),Array.from(data.chapters[0].places),'mapped references must remain available');
 assert.equal(vm.runInContext("unlocatedPlacesForDisplay({unlocatedPlaces:[{id:'explicit-hide',displayInAtlas:false},{id:'no-geography',geographicRelevance:'none'},{id:'regional-setting',geographicRelevance:'regional'}]}).length",ctx),1);
 vm.runInContext('selectAllPlaces(false,false)',ctx);assert.equal(vm.runInContext('current',ctx),-1);assert.equal(get('all-places').attributes['aria-pressed'],'true');
}
console.log('PASS: 1984 complete section structure; 305 literal section–place quotations; fictional geography unlocated; four languages and eight CSV exports.');
