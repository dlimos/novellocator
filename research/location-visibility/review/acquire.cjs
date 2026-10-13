const fs=require('fs'),vm=require('vm');
const ctx={window:{},URL,URLSearchParams,AbortController,setTimeout,clearTimeout,fetch,console};
for(const f of ['supabase-config.js','content-adapter.js','supabase-data.js','illustrated-data.js'])vm.runInNewContext(fs.readFileSync('docs/'+f,'utf8'),ctx);
const dir='research/location-visibility/review';
(async()=>{
 const config=ctx.window.atlasSupabase;
 const r=await fetch(config.url+'/rest/v1/books?select=id,title,publication_status&order=id',{headers:{apikey:config.publishableKey}});if(!r.ok)throw Error('HTTP '+r.status);
 const books=await r.json();fs.writeFileSync(dir+'/catalogue.json',JSON.stringify(books,null,2));
 for(const b of books){
  if(b.id==='macondo'){
   ctx.window.location={protocol:'https:'};ctx.window.fetch=fetch;
   const data=await ctx.window.IllustratedData.load(b.id);fs.writeFileSync(dir+'/'+b.id+'-live.json',JSON.stringify(data,null,2));console.log(b.id+': '+data.places.length+' illustrated places');continue;
  }
  const {data}=await ctx.window.atlasSupabaseData.loadBook(b.id);fs.writeFileSync(dir+'/'+b.id+'-live.json',JSON.stringify(data,null,2));
  const local={window:{}};vm.runInNewContext(fs.readFileSync('docs/data/'+b.id+'.js','utf8'),local);
  console.log(b.id+': '+data.chapters.length+' sections; local equal '+(JSON.stringify(data)===JSON.stringify(local.window.atlasData)));
 }
})().catch(e=>{console.error(e);process.exitCode=1;});
