const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const audit=JSON.parse(fs.readFileSync('tests/fixtures/text-excerpts.json','utf8'));
const raw={};for(const id of ['ulisse','proust','war-and-peace']){const ctx={window:{}};vm.runInNewContext(fs.readFileSync('docs/data/'+id+'.js','utf8'),ctx);raw[id]=JSON.parse(JSON.stringify(ctx.window.atlasData));}
assert.equal(audit.records.length,392);assert.equal(audit.records.filter(r=>r.type==='translation').length,131);
const originalLanguages={ulisse:'en',proust:'fr','war-and-peace':'ru'};
for(const [id,d]of Object.entries(raw))for(const c of d.chapters){assert.equal(c.excerpts.original.language,originalLanguages[id]);assert.ok(c.excerpts.original.quote.length>=40);for(const place of Object.keys(c.placeExcerpts||{}))assert.ok(c.places.includes(place));}
for(const r of audit.records){const c=raw[r.book].chapters[r.section-1],group=r.place?c.placeExcerpts[r.place]:c.excerpts;const value=r.type==='original'?group.original:group.translations[r.language];assert.deepEqual(value,{quote:r.quote,language:r.language,url:r.url,attribution:r.attribution,rightsUrl:r.rightsUrl,type:r.type});assert.ok(r.paragraph.includes(r.quote.replace(/^\[…] /,'').replace(/ \[…\]$/,'')));assert.ok(audit.editions[r.edition]);assert.equal(audit.editions[r.edition].language,r.language);assert.ok(r.url.startsWith('https://'));assert.ok(r.rightsUrl.startsWith('https://'));assert.ok((r.url.match(/#/g)||[]).length<=1);assert.doesNotMatch(r.quote,/&(?:amp|#\d+|nbsp);|\[\d+\]/);if(r.cue)assert.ok(r.paragraph.normalize('NFD').replace(/\p{Diacritic}/gu,'').replace(/[’‘]/g,"'").toLowerCase().includes(r.cue.normalize('NFD').replace(/\p{Diacritic}/gu,'').replace(/[’‘]/g,"'").toLowerCase()));}
assert.match(raw.proust.chapters[0].excerpts.original.quote,/^Longtemps,/);assert.match(raw.proust.chapters[3].excerpts.original.quote,/^On sait/);assert.match(raw.proust.chapters[3].excerpts.translations.en.quote,/^The reader/);assert.equal(raw.proust.chapters[6].excerpts.translations.en,undefined);
assert.match(raw['war-and-peace'].chapters[5].excerpts.original.quote,/^Князь Андрей/);assert.match(raw['war-and-peace'].chapters[5].excerpts.translations.en.quote,/^Prince Andrew/);assert.match(raw['war-and-peace'].chapters[5].excerpts.translations.fr.quote,/prince André/);
for(const lang of ['en','it','fr','es'])for(const id of Object.keys(raw)){
 const elements={};const el=()=>({children:[],appendChild(x){this.children.push(x)},setAttribute(){},addEventListener(){},scrollIntoView(){}});let startup;
 const location={search:'?book='+id+'&lang='+lang,hash:'',href:'https://example.org/atlas.html?book='+id+'&lang='+lang};
 const ctx={console,URL,URLSearchParams,NodeFilter:{SHOW_TEXT:4},location,localStorage:{getItem(){},setItem(){}},window:{location,innerWidth:1100,matchMedia:()=>({matches:true}),addEventListener(){}},document:{readyState:'loading',documentElement:{},body:{querySelectorAll:()=>[]},head:{querySelectorAll:()=>[]},addEventListener(k,f){startup=f},createTreeWalker:()=>({nextNode:()=>false}),querySelectorAll:()=>[],getElementById:x=>elements[x]??(elements[x]=el()),querySelector:()=>({}),createElement:el}};
 vm.createContext(ctx);for(const name of ['locales/ui.js','content/book-translations.js','i18n.js','data/'+id+'.js','data/'+id+'-i18n.js','basemaps.js'])vm.runInContext(fs.readFileSync('docs/'+name,'utf8'),ctx);ctx.window.atlasData=ctx.window.atlasI18n.localizeData(ctx.window.atlasData);startup();vm.runInContext(fs.readFileSync('docs/app.js','utf8').replace(/initializeMap\(\);\s*$/,''),ctx);
 const localized=ctx.window.atlasData;
 function verifySelected(html,group){
  const selected=group.original.language===lang?group.original:group.translations?.[lang];
  assert.deepEqual([...html.matchAll(/<blockquote lang="([^"]+)"/g)].map(m=>m[1]),selected?[lang]:[]);
  if(selected){assert.ok(html.includes(selected.attribution));assert.ok(html.includes(ctx.window.atlasI18n.t('Edition and rights')));}
  else{assert.ok(html.includes(ctx.window.atlasI18n.t('A verified quotation is not yet available in the selected language.')));assert.ok(!html.includes(group.original.quote));}
 }
 for(const [i,c]of localized.chapters.entries()){
  vm.runInContext('selectChapter('+i+',false,false)',ctx);
  assert.equal(c.excerpts.original.quote,raw[id].chapters[i].excerpts.original.quote);
  verifySelected(vm.runInContext("renderExcerpts(chapters["+i+"].excerpts,'Text from this section')",ctx),c.excerpts);
  for(const [j,place]of c.places.entries()){
   if(!c.placeExcerpts?.[place])continue;
   vm.runInContext('selectPlace('+j+')',ctx);
   assert.equal(c.placeExcerpts[place].original.quote,raw[id].chapters[i].placeExcerpts[place].original.quote);
   verifySelected(elements['selected-location'].children.at(-1).innerHTML,c.placeExcerpts[place]);
  }
 }
 // Quotations and attribution remain literal even if a future UI dictionary contains the same string.
 ctx.window.atlasTranslations[lang]??={};ctx.window.atlasTranslations[lang]['literal quotation']='wrong';assert.equal(ctx.window.atlasI18n.localizeData({quote:'literal quotation'}).quote,'literal quotation');
}
assert.equal(audit.records.filter(r=>r.book==='war-and-peace'&&r.place&&r.type==='original').length,91);
console.log('PASS: original evidence preserved; only the selected-language quotation is shown, with literal attribution and sources; missing translations are explicit across four locales.');
