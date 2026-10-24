const fs=require('node:fs'),vm=require('node:vm');
const ctx={window:{}};
vm.runInNewContext(fs.readFileSync('docs/supabase-config.js','utf8'),ctx);
const config=ctx.window.atlasSupabase;
async function rows(table){
 const result=[];
 for(let offset=0;;){
  const response=await fetch(config.url+'/rest/v1/'+table+'?select=*&limit=500&offset='+offset,{headers:{apikey:config.publishableKey}});
  if(!response.ok)throw Error(await response.text());
  const batch=await response.json();result.push(...batch);
  if(!batch.length)return result;
  offset+=batch.length;
 }
}
(async()=>{
 const books=await rows('books'),sections=await rows('sections');
 fs.writeFileSync('research/section-badges/'+(process.argv.includes('--after')?'after':'before')+'.json',JSON.stringify({books,sections},null,2));
 for(const book of books){
  const own=sections.filter(s=>s.book_id===book.id);
  console.log('\n'+book.id+' ('+own.length+')');
  for(const key of ['time','people']){
   const counts={};for(const section of own){const value=section.metadata?.[key];counts[String(value)]=(counts[String(value)]||0)+1;}
   console.log(key,JSON.stringify(counts));
  }
 }
})().catch(error=>{console.error(error);process.exitCode=1;});
