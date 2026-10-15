// Read-only public snapshot; the publication script updates quotation fields only.
const fs=require('node:fs'),vm=require('node:vm');
const ctx={window:{},URL,URLSearchParams,AbortController,setTimeout,clearTimeout,console,fetch};vm.createContext(ctx);
for(const name of ['supabase-config.js','content-adapter.js','supabase-data.js'])vm.runInContext(fs.readFileSync('docs/'+name,'utf8'),ctx);
(async()=>{
 const result=await ctx.window.atlasSupabaseData.loadBook('sound-and-fury');
 fs.writeFileSync('work/sound-and-fury-excerpts/live-before.json',JSON.stringify(result,null,2)+'\n');
 const config=ctx.window.atlasSupabase;
 for(const table of ['excerpts','unlocated_settings']){
  const response=await fetch(config.url+'/rest/v1/'+table+'?book_id=eq.sound-and-fury&select=*',{headers:{apikey:config.publishableKey}});
  if(!response.ok)throw new Error(table+': '+response.status);
  fs.writeFileSync('work/sound-and-fury-excerpts/'+table+'-before.json',JSON.stringify(await response.json(),null,2)+'\n');
 }
 console.log('Saved current public quotations, attribution and unrelated metadata before targeted updates.');
})().catch(e=>{console.error(e);process.exitCode=1;});
