const fs=require('node:fs'),vm=require('node:vm');
const dir=__dirname;fs.mkdirSync(dir+'/live',{recursive:true});
const {execFileSync}=require('node:child_process');
// curl uses the Windows network configuration on this workstation.
const networkFetch=async(url,options={})=>{
 const args=['--max-time','60','--retry','2','--fail-with-body','-sS',String(url)];
 for(const [key,value]of Object.entries(options.headers||{}))args.push('-H',key+': '+value);
 const body=execFileSync('curl.exe',args,{encoding:'utf8',maxBuffer:50_000_000});
 return {ok:true,status:200,json:async()=>JSON.parse(body)};
};
const ctx={window:{},URL,URLSearchParams,AbortController,setTimeout,clearTimeout,fetch:networkFetch,console};
for(const f of ['supabase-config.js','content-adapter.js','supabase-data.js'])vm.runInNewContext(fs.readFileSync('docs/'+f,'utf8'),ctx);
(async()=>{
 const config=ctx.window.atlasSupabase;
 const response=await networkFetch(config.url+'/rest/v1/books?select=id,title,publication_status&order=id',{headers:{apikey:config.publishableKey}});if(!response.ok)throw Error('HTTP '+response.status);
 const books=await response.json();fs.writeFileSync(dir+'/catalogue.json',JSON.stringify(books,null,2));
 for(const b of books.filter(b=>b.id==='gatsby')){
  const result=await ctx.window.atlasSupabaseData.loadBook(b.id);
  fs.writeFileSync(dir+'/live/'+b.id+'.json',JSON.stringify(result,null,2));
  console.log(b.id+': '+result.data.chapters.length+' sections');
 }
})().catch(error=>{console.error(error);process.exitCode=1});
