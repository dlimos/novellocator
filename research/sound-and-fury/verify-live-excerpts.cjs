const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctx={window:{},URL,URLSearchParams,AbortController,setTimeout,clearTimeout,console,fetch};vm.createContext(ctx);
for(const name of ['supabase-config.js','content-adapter.js','supabase-data.js'])vm.runInContext(fs.readFileSync('docs/'+name,'utf8'),ctx);
(async()=>{
 const result=JSON.parse(JSON.stringify(await ctx.window.atlasSupabaseData.loadBook('sound-and-fury')));
 const expected=JSON.parse(fs.readFileSync('work/sound-and-fury-excerpts/expected.json','utf8'));
 assert.deepEqual(result,expected,'Only reviewed quotation fields may change');
 fs.writeFileSync('docs/data/sound-and-fury.js','window.atlasData='+JSON.stringify(result.data,null,2)+';\n');
 fs.writeFileSync('docs/data/sound-and-fury-i18n.js','window.atlasTranslations='+JSON.stringify(result.dictionary,null,2)+';\n');
 fs.writeFileSync('work/sound-and-fury-excerpts/live-after.json',JSON.stringify(result,null,2)+'\n');
 console.log('PASS: all 227 published passages, exact highlight forms and bibliography match; every other book field and editorial translation is unchanged.');
})().catch(e=>{console.error(e);process.exitCode=1;});
