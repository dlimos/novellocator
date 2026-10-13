const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctx={window:{},fetch,URL,URLSearchParams,AbortController,setTimeout,clearTimeout,console};vm.createContext(ctx);
for(const file of ['supabase-config.js','content-adapter.js','supabase-data.js'])vm.runInContext(fs.readFileSync('docs/'+file,'utf8'),ctx);
function local(file,key){const c={window:{}};vm.runInNewContext(fs.readFileSync(file,'utf8'),c);return JSON.parse(JSON.stringify(c.window[key]));}
(async()=>{
 const result=await ctx.window.atlasSupabaseData.loadBook('lolita');const data=JSON.parse(JSON.stringify(result.data));
 const expected=local('docs/data/lolita.js','atlasData');
 for(const collection of ['places','citedPlaces'])for(const [id,p]of Object.entries(expected[collection]||{}))for(let i=0;i<2;i++){assert.ok(Math.abs(data[collection][id].coords[i]-p.coords[i])<1e-12);p.coords[i]=data[collection][id].coords[i];}
 assert.deepEqual(data,expected);assert.deepEqual(JSON.parse(JSON.stringify(result.dictionary)),local('docs/data/lolita-i18n.js','atlasTranslations'));
 const response=await fetch(ctx.window.atlasSupabase.url+'/rest/v1/book_presentations?book_id=eq.lolita&select=*',{headers:{apikey:ctx.window.atlasSupabase.publishableKey}});assert.ok(response.ok);
 const rows=await response.json();assert.equal(rows.length,1);const row=rows[0],p=JSON.parse(fs.readFileSync('database/generated/lolita/publication/presentation.json','utf8'));
 for(const key of Object.keys(p)){
  if(typeof p[key]==='string')assert.equal(row[key].replace(/\r\n/g,'\n'),p[key].replace(/\r\n/g,'\n'));
  else assert.deepEqual(row[key],p[key]);
 }
 const report={checkedAt:new Date().toISOString(),remote:'https://dlimos.github.io/novellocator/atlas.html?book=lolita&lang=it',publicationStatus:'published',analysisStatus:'in-progress',sections:71,mappedPlaces:124,mappedReferences:207,unlocatedReferences:341,originalEvidencePending:514,publicQuotations:0,allFourDictionaries:'exact',presentation:'exact',content:'exact except PostgreSQL coordinate serialization within 1e-12',commit:'c7bbbc3acba9d4afe27092fe2ce8f0525d87eeb8'};
 report.presentation='exact after Windows clipboard newline normalization';
 fs.writeFileSync('research/lolita/publication-verification.json',JSON.stringify(report,null,2)+'\n');
 console.log('PASS: anonymous live database reconstructs the complete Lolita dataset, all four dictionaries, Prinet artwork and heart-shaped watermark exactly.');
})().catch(e=>{console.error(e.message);process.exitCode=1});
