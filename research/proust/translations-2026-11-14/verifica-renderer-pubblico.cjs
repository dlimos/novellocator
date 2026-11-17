// Codice del renderer effettivamente pubblico + dati API reali; non collaudo visivo.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const P=__dirname;
const decode=s=>s.replace(/&(?:amp|lt|gt|quot|#39);/g,x=>({'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&#39;':"'"}[x]));
const key=s=>s.normalize('NFD').replace(/\p{M}/gu,'').replace(/[‘’]/g,"'").toLowerCase();
(async()=>{
 const files=await Promise.all(['app.js','content-adapter.js'].map(async n=>{const r=await fetch('https://dlimos.github.io/novellocator/'+n,{signal:AbortSignal.timeout(30000)});assert.equal(r.status,200);return [n,await r.text()]}));
 const scripts=Object.fromEntries(files),start=scripts['app.js'].indexOf('// Keep quotation text literal:'),end=scripts['app.js'].indexOf('function unlocatedPlacesForDisplay',start);
 assert.ok(start>=0&&end>start);const esc=scripts['app.js'].split('\n').find(s=>s.startsWith('const esc='));assert.ok(esc);
 const snapshot=process.argv[2]||'snapshot-renderer-pubblicato-2026-11-17.json';assert.match(snapshot,/^[a-z0-9-]+\.json$/);
 const tables=JSON.parse(fs.readFileSync(path.join(P,snapshot),'utf8')).tables;
 const adapter={window:{}};vm.runInNewContext(scripts['content-adapter.js'],adapter);const data=adapter.window.atlasContent.reconstruct({formatVersion:1,tables},'proust').data;
 const refs=tables.place_references.filter(r=>r.metadata?.stagingSelectedId);assert.equal(refs.length,169);
 const failures=[],counts={defaults:0,switches:0,passages:0};
 for(const locale of ['en','es','fr','it']){
  const listeners={},ctx={window:{atlasTranslations:{}},locale,t:s=>s,document:{addEventListener:(n,f)=>{listeners[n]=f}}};vm.createContext(ctx);vm.runInContext(esc+'\n'+scripts['app.js'].slice(start,end),ctx);assert.equal(typeof listeners.change,'function');
  for(const ref of refs){
   const chapter=data.chapters.find(c=>c.id===ref.section_id),place=(ref.collection==='core'?data.places:data.citedPlaces)[ref.place_id];
   const excerpts=ref.collection==='core'?chapter.placeExcerpts[ref.place_id]:chapter.citations.find(c=>c.placeId===ref.place_id).excerpt;
   ctx.currentExcerpts=excerpts;ctx.currentPlaces=[place];const before=JSON.stringify(excerpts);
   const html=vm.runInContext("renderExcerpts(currentExcerpts,'Passage from the novel',currentPlaces)",ctx);counts.defaults++;
   assert.match(html,/<section class="original-excerpt">/);assert.doesNotMatch(html,/<details|<summary|href=|disabled/);
   assert.equal((html.match(/<option /g)||[]).length,4);assert.match(html,new RegExp(`<option value="${locale}" selected`));
   const id=html.match(/data-quotation-id="(\d+)"/)[1],body={innerHTML:''},heading={};
   const select={dataset:{quotationId:id},value:locale,matches:s=>s==='select.quotation-language-select',closest:s=>{assert.equal(s,'.original-excerpt');return {querySelector:s=>s==='.quotation-body'?body:heading}}};
   for(const language of ['en','es','fr','it']){
    select.value=language;listeners.change({target:select});counts.switches++;
    const row=tables.excerpts.find(e=>e.reference_id===ref.id&&e.language===language);assert.ok(row);
    assert.match(body.innerHTML,new RegExp(`<blockquote lang="${language}">`));
    const rendered=body.innerHTML.match(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/)[1];
    const literal=decode(rendered.replace(/<strong class="quote-place">|<\/strong>/g,''));assert.equal(literal,row.quote);
    assert.equal(decode(body.innerHTML.match(/<p class="excerpt-credit">([\s\S]*?)<\/p>/)[1]),row.attribution);
    const bold=[...rendered.matchAll(/<strong class="quote-place">([\s\S]*?)<\/strong>/g)].map(x=>decode(x[1]));
    const missing=(row.metadata.highlightTerms||[]).filter(t=>!bold.some(s=>key(s).includes(key(t))));
    if(!bold.length||missing.length)failures.push({interfaceLocale:locale,referenceId:ref.id,excerptId:row.id,language,issue:'highlight-not-rendered',terms:missing});
    assert.doesNotMatch(body.innerHTML,/href=|<a\b/);assert.equal(vm.runInContext('locale',ctx),locale);counts.passages++;
   }
   assert.equal(JSON.stringify(excerpts),before,'No source-data mutation during language switches');
  }
 }
 const result={date:'2026-11-17',status:failures.length?'FAIL':'PASS',scope:'Verifica funzionale del codice pubblico delle citazioni su snapshot API reale; controlli eventi/select simulati, nessun browser o impaginazione verificati.',snapshot,associations:169,interfaceLocales:4,...counts,expectedLanguages:['en','es','fr','it'],literalTextsAndCreditsPreserved:true,independentQuotationLanguage:true,noNovelTextLinks:true,translatedInterfaceLabelsChecked:false,browserVisualQa:'PENDING: comandi del browser interno non disponibili',publicScriptHashes:Object.fromEntries(files.map(([n,s])=>[n,crypto.createHash('sha256').update(s).digest('hex')])),failures};
 fs.writeFileSync(path.join(P,'verifica-renderer-pubblico-2026-11-17.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));if(failures.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});
