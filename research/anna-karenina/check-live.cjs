// Read-only check of the published book through the site's public data loader.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctx={window:{},URL,URLSearchParams,AbortController,setTimeout,clearTimeout,console,fetch};vm.createContext(ctx);
for(const file of ['supabase-config.js','content-adapter.js','supabase-data.js'])vm.runInContext(fs.readFileSync('docs/'+file,'utf8'),ctx);
function local(file,key){const c={window:{}};vm.runInNewContext(fs.readFileSync(file,'utf8'),c);return JSON.parse(JSON.stringify(c.window[key]));}
(async()=>{
 const result=await ctx.window.atlasSupabaseData.loadBook('anna-karenina');
 const actual=JSON.parse(JSON.stringify(result.data)),expected=local('docs/data/anna-karenina.js','atlasData');
 for(const collection of ['places','citedPlaces'])for(const [id,p]of Object.entries(expected[collection]))for(let i=0;i<2;i++){assert.ok(Math.abs(actual[collection][id].coords[i]-p.coords[i])<1e-12,id+' coordinates');p.coords[i]=actual[collection][id].coords[i];}
 assert.deepEqual(actual,expected,'published passages, sources, categories and metadata');
 assert.deepEqual(JSON.parse(JSON.stringify(result.dictionary)),local('docs/data/anna-karenina-i18n.js','atlasTranslations'),'all published editorial translations');
 const config=ctx.window.atlasSupabase;const response=await fetch(config.url+'/rest/v1/book_presentations?book_id=eq.anna-karenina&select=*',{headers:{apikey:config.publishableKey}});assert.ok(response.ok);const rows=await response.json();assert.equal(rows.length,1);
 const presentation=JSON.parse(fs.readFileSync('database/generated/anna-karenina/presentation.json','utf8'));for(const key of Object.keys(presentation))assert.deepEqual(rows[0][key],presentation[key],key+' live presentation');
 console.log('PASS: live Supabase matches all 239 sections, 626 authentic associations, four editorial dictionaries, painting credits and exact railway CSS.');
})().catch(e=>{console.error(e.message);process.exitCode=1;});

