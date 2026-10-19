const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const id='wuthering-heights',dir='research/'+id;
const raw={window:{}};for(const f of ['docs/data/'+id+'.js','docs/data/'+id+'-i18n.js'])vm.runInNewContext(fs.readFileSync(f,'utf8'),raw);
const data=raw.window.atlasData,dictionary=raw.window.atlasTranslations;
const original=JSON.parse(fs.readFileSync(dir+'/sections.json','utf8')),french=JSON.parse(fs.readFileSync(dir+'/corpus/french.json','utf8'));
assert.equal(data.chapters.length,34);assert.equal(original.length,34);assert.equal(french.length,34);
const review=JSON.parse(fs.readFileSync(dir+'/full-review.json','utf8'));assert.equal(Object.keys(review).length,34);for(const c of original){assert.equal(review[c.id].sourceSha256,c.sha256);assert.equal(review[c.id].completeNarrativeRead,true);}
const records=[];
for(const c of data.chapters){
 assert.equal(c.id,data.chapters.indexOf(c)+1);assert.ok(c.text.length>30);
 for(const l of ['en','it','fr','es'])assert.ok(dictionary[l][c.text]?.length>30,l+' introduction '+c.id);
 for(const [i,pid]of c.places.entries()){assert.equal(c.placeCategories[pid],'action');assert.ok(c.placeText[i]);records.push({section:c.id,id:pid,category:'action',excerpt:c.placeExcerpts[pid]});}
 for(const ref of c.citations){assert.equal(ref.category,'mentioned');records.push({section:c.id,id:ref.placeId,...ref});}
 for(const u of c.unlocatedPlaces)if(!u.illustratedOnly)records.push({section:c.id,id:u.id,category:u.category,excerpt:u.excerpt});
}
assert.equal(records.length,139);assert.equal(new Set(records.map(r=>r.section+':'+r.id)).size,139);
for(const r of records){
 for(const q of [r.excerpt.original,...Object.values(r.excerpt.translations)]){
  const corpus=q.language==='en'?original:french;
  assert.ok(corpus[r.section-1].paragraphs[q.sourceParagraph-1].includes(q.quote),r.section+':'+r.id+' literal '+q.language);
  assert.ok(q.highlightTerms.length);for(const term of q.highlightTerms)assert.ok(q.quote.toLowerCase().includes(term.toLowerCase()));
  assert.ok(q.attribution.includes('Emily Brontë')&&q.attribution.includes('chapter'));
  assert.equal(q.verificationStatus,'verified');assert.ok(q.rightsNote);
 }
 assert.ok(r.excerpt.original.criticalPurpose);
}
const places={...data.places,...data.citedPlaces};assert.equal(Object.keys(places).length,13);
for(const p of Object.values(places)){
 assert.ok(p.coords.every(Number.isFinite));assert.ok(Math.abs(p.coords[0])<90&&Math.abs(p.coords[1])<180);
 if(p.regionalOutline){for(const line of p.regionalOutline.paths){assert.ok(line.length>=4);assert.deepEqual(line[0],line.at(-1));for(const [x,y]of line)assert.ok(Number.isFinite(x)&&Number.isFinite(y)&&Math.abs(x)<=180&&Math.abs(y)<=90);}}
}
// Exercise the actual engine, quotation formatter and CSV functions in all UI languages.
const harness={require,console,URL,URLSearchParams,module:{exports:{}}};
vm.runInNewContext(fs.readFileSync('tests/check-global-view.cjs','utf8').split("for(const id of ['ulisse'")[0]+'module.exports=setup;',harness);
for(const l of ['en','it','fr','es']){
 const {ctx}=harness.module.exports(id,l),run=s=>vm.runInContext(s,ctx);
 vm.runInContext(fs.readFileSync('docs/csv-export.js','utf8'),ctx);
 for(const r of records){
  ctx.reviewGroup=r.excerpt;
  const html=run("renderExcerpts(reviewGroup,'Passage from the novel')");
  assert.ok(html.includes('class="quote-place"'),r.section+':'+r.id+' bold '+l);
  assert.ok(!/href=/.test(html),'No direct novel links');
  assert.ok(html.includes('lang="'+(l==='fr'&&r.excerpt.translations.fr?'fr':'en')+'"'));
  assert.equal(html.includes('disabled aria-disabled="true"'),!r.excerpt.translations.fr);
 }
 for(const kind of ['places','citations']){
  ctx.reviewKind=kind;const csv=run('window.atlasCsv.build(window.atlasData,reviewKind,locale)');
  assert.ok(!csv.includes('GITenberg')&&!csv.includes('wikisource.org')&&!csv.includes('fliphtml'));
  assert.ok(csv.includes('John Murray'));
  fs.writeFileSync('docs/'+id+'-'+(kind==='places'?'places':'citations')+'-'+l+'.csv',csv);
 }
 run('selectChapter(-1,false,false)');
 const check=()=>{
  const n=JSON.parse(run('JSON.stringify(visibleMarkerNumbers())'));
  const nums=[...n.places,...n.citations].filter(x=>x!==null&&x!==undefined);
  const a=nums.filter(x=>!String(x).startsWith('C')).map(Number),m=nums.filter(x=>String(x).startsWith('C')).map(x=>Number(x.slice(1)));
  assert.deepEqual([...new Set(a)].sort((a,b)=>a-b),Array.from({length:new Set(a).size},(_,i)=>i+1));
  assert.deepEqual([...new Set(m)].sort((a,b)=>a-b),Array.from({length:new Set(m).size},(_,i)=>i+1));
 };
 check();run("setLayerVisibility('mentioned',false)");check();run("setLayerVisibility('mentioned',true);setLayerVisibility('action',false)");check();
}
const words=s=>(s.match(/\S+/g)||[]).length,english=records.map(r=>r.excerpt.original.quote),fr=records.filter(r=>r.excerpt.translations.fr).map(r=>r.excerpt.translations.fr.quote);
const imported=fs.existsSync(dir+'/import-status.json')?JSON.parse(fs.readFileSync(dir+'/import-status.json','utf8')):null;
const report={chapters:34,places:13,mapped:134,unlocated:5,french:fr.length,originalQuotedWords:english.reduce((n,q)=>n+words(q),0),originalUniqueQuotedWords:[...new Set(english)].reduce((n,q)=>n+words(q),0),frenchQuotedWords:fr.reduce((n,q)=>n+words(q),0),fullOriginalWords:original.reduce((n,c)=>n+words(c.text),0),technicalStatus:'passed',narrativeInventoryStatus:'full-reread-complete',remoteStatus:imported?.remoteStatus||'not-imported'};
fs.writeFileSync(dir+'/verification.json',JSON.stringify(report,null,2)+'\n');console.log('PASS: literal original/French evidence, individual highlights and credits, 34 multilingual introductions, region rings, actual UI quotation fallback and disabled selectors, CSVs without novel links and sequential layer numbers.');console.log(report);
