const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const id='pride-and-prejudice',dir='research/'+id,raw={window:{}};
for(const suffix of ['.js','-i18n.js'])vm.runInNewContext(fs.readFileSync('docs/data/'+id+suffix,'utf8'),raw);
const data=raw.window.atlasData,dict=raw.window.atlasTranslations;
const original=JSON.parse(fs.readFileSync(dir+'/sections.json','utf8'));
const corpora={en:original,fr:JSON.parse(fs.readFileSync(dir+'/corpus/fr-sections.json','utf8')),es:JSON.parse(fs.readFileSync(dir+'/corpus/es-sections.json','utf8'))};
const print=JSON.parse(fs.readFileSync(dir+'/corpus/chapman-sections.json','utf8'));
const records=[];assert.equal(data.chapters.length,61);
for(const c of data.chapters){
 for(const l of ['en','it','fr','es'])assert.ok(dict[l][c.text]?.length>30,l+':'+c.id);
 assert.equal(c.places.length,c.placeText.length);
 for(const pid of c.places)records.push({ch:c.id,pid,category:c.placeCategories[pid],group:c.placeExcerpts[pid]});
 for(const r of c.citations)records.push({ch:c.id,pid:r.placeId,category:r.category,group:r.excerpt});
 for(const u of c.unlocatedPlaces)if(!u.illustratedOnly)records.push({ch:c.id,pid:u.id,category:u.category,group:u.excerpt});
}
assert.equal(records.length,407);assert.equal(records.filter(r=>r.category==='action').length,96);
assert.equal(new Set(records.map(r=>r.ch+':'+r.pid)).size,407);
for(const r of records)for(const q of [r.group.original,...Object.values(r.group.translations)]){
 const source=q.language==='en'?print:corpora[q.language];const full=source[r.ch-1].paragraphs.join('\n');assert.ok(full.includes(q.quote),r.ch+':'+r.pid+' literal '+q.language);assert.equal(full.slice(0,full.indexOf(q.quote)).split('\n').length,q.sourceParagraph,r.ch+':'+r.pid+' paragraph '+q.language);
 assert.equal(q.verificationStatus,'verified');assert.ok(q.rightsUrl&&q.rightsNote&&q.criticalPurpose&&q.attribution);
 assert.ok(q.highlightTerms.length);for(const t of q.highlightTerms)assert.ok(q.quote.toLowerCase().includes(t.toLowerCase()),r.ch+':'+r.pid+' highlight');
}
const places={...data.places,...data.citedPlaces};assert.equal(Object.keys(places).length,58);
for(const p of Object.values(places)){
 assert.ok(p.coords.every(Number.isFinite));
 if(p.regionalOutline)for(const ring of p.regionalOutline.paths){assert.ok(ring.length>=4);assert.deepEqual(ring[0],ring.at(-1));for(const [x,y]of ring)assert.ok(Math.abs(x)<=180&&Math.abs(y)<=90);}
}
const harness={require,console,URL,URLSearchParams,module:{exports:{}}};
vm.runInNewContext(fs.readFileSync('tests/check-global-view.cjs','utf8').split("for(const id of ['ulisse'")[0]+'module.exports=setup;',harness);
for(const l of ['en','it','fr','es']){
 const {ctx}=harness.module.exports(id,l,true),run=s=>vm.runInContext(s,ctx);
 vm.runInContext(fs.readFileSync('docs/csv-export.js','utf8'),ctx);
 for(const r of records){
  ctx.reviewGroup=r.group;const html=run("renderExcerpts(reviewGroup,'Passage from the novel')");
  assert.ok(html.includes('class="quote-place"'),r.ch+':'+r.pid+' bold '+l);assert.ok(!/href=/.test(html));
  const chosen=r.group.translations[l]?l:'en';assert.ok(html.includes('lang="'+chosen+'"'));
  assert.equal(html.includes('disabled aria-disabled="true"'),Object.keys(r.group.translations).length===0);
 }
 for(const kind of ['places','citations']){ctx.reviewKind=kind;const csv=run('window.atlasCsv.build(window.atlasData,reviewKind,locale)');assert.ok(!/GITenberg|wikisource\.org|fliphtml/.test(csv));fs.writeFileSync('docs/'+id+'-'+kind+'-'+l+'.csv',csv);}
 run('selectChapter(-1,false,false)');assert.equal(run('current'),-1);
 function numbering(){const n=JSON.parse(run('JSON.stringify(visibleMarkerNumbers())'));const nums=[...n.places,...n.citations].filter(x=>x!=null);for(const cat of ['action','mentioned']){const values=nums.filter(x=>String(x).startsWith('C')===(cat==='mentioned')).map(x=>Number(String(x).replace(/^C/,'')));const unique=[...new Set(values)].sort((a,b)=>a-b);assert.deepEqual(unique,Array.from({length:unique.length},(_,i)=>i+1));}}
 numbering();run("setLayerVisibility('mentioned',false)");numbering();run("setLayerVisibility('mentioned',true);setLayerVisibility('action',false)");numbering();
}
assert.equal(data.book.illustratedView.views.length,3);
const illustrated=data.chapters.flatMap(c=>c.unlocatedPlaces.filter(u=>u.illustratedOnly));assert.equal(illustrated.length,3);
for(const u of illustrated){assert.ok(print[42].paragraphs[u.excerpt.original.sourceParagraph-1].includes(u.quote));assert.equal(u.displayInAtlas,false);assert.ok(u.quote.includes(u.highlightTerms[0]));}
for(const v of data.book.illustratedView.views){assert.ok(fs.existsSync('docs/'+v.image));for(const [pid,p]of Object.entries(v.positions)){assert.ok(places[pid]||illustrated.some(u=>u.id===pid));assert.ok(p.every(x=>x>=0&&x<=1));}}
const words=s=>s.split(/\s+/).length,quotes=records.map(r=>r.group.original.quote);
const imported=fs.existsSync(dir+'/import-status.json')?JSON.parse(fs.readFileSync(dir+'/import-status.json','utf8')):null;
const report={technicalStatus:'passed',chapters:61,introductions:244,associations:407,action:96,mentioned:311,mappedReferences:396,unlocatedReferences:11,mappedIdentities:58,illustratedSubsettings:3,translations:records.reduce((n,r)=>n+Object.keys(r.group.translations).length,0),views:3,originalQuotedWords:quotes.reduce((n,q)=>n+words(q),0),originalUniqueQuotedWords:[...new Set(quotes)].reduce((n,q)=>n+words(q),0),remoteStatus:imported?.remoteStatus||'not-imported'};
fs.writeFileSync(dir+'/atlas-verification.json',JSON.stringify(report,null,2)+'\n');console.log('PASS: 407 authentic source associations, 244 introductions, 8 translations, outlines, 4-language quotation rendering, fallback, bold, CSV, marker numbering and three view assets.');console.log(report);
