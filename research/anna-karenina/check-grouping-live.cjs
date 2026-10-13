const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctx={window:{},URL,URLSearchParams,AbortController,setTimeout,clearTimeout,fetch};vm.createContext(ctx);
for(const f of ['supabase-config.js','content-adapter.js','supabase-data.js'])vm.runInContext(fs.readFileSync('docs/'+f,'utf8'),ctx);
(async()=>{
 const {data,dictionary}=await ctx.window.atlasSupabaseData.loadBook('anna-karenina');
 assert.equal(data.chapters.length,8);assert.equal(data.sourceChapters.length,239);
 assert.deepEqual(Array.from(data.chapters,c=>c.title),['Part I','Part II','Part III','Part IV','Part V','Part VI','Part VII','Part VIII']);
 for(const c of data.chapters)for(const lang of ['en','it','fr','es'])assert(dictionary[lang][c.text]&&dictionary[lang][c.title]);
 const {data:raw}=await ctx.window.atlasSupabaseData.loadBook('anna-karenina',ctx.window.atlasSupabase,{rawSections:true});
 assert.equal(raw.chapters.length,239);
 assert.equal(raw.chapters.reduce((n,c)=>n+c.places.length+(c.citations||[]).length+(c.unlocatedPlaces||[]).length,0),626);
 fs.writeFileSync('research/anna-karenina/grouping-verification.json',JSON.stringify({date:'2026-10-13',displayParts:8,sourceChapters:239,sourceReferences:626,published:true,partTitles:data.chapters.map(c=>c.title)},null,2)+'\n');
 console.log('PASS: published eight-part navigation, four-language introductions and all 626 original chapter–place references retained.');
})().catch(e=>{console.error(e.message);process.exitCode=1;});
