const fs=require('node:fs'),vm=require('node:vm');
const dir='work/lolita-final-review';fs.mkdirSync(dir,{recursive:true});
const suffix=process.argv.includes('--after')?'after':'before';
const c={window:{},fetch,URL,URLSearchParams,AbortController,setTimeout,clearTimeout};vm.createContext(c);
for(const f of ['supabase-config.js','content-adapter.js','supabase-data.js'])vm.runInContext(fs.readFileSync('docs/'+f,'utf8'),c);
(async()=>{
 const cfg=c.window.atlasSupabase,bundle={formatVersion:1,tables:{}};
 for(const table of [...c.window.atlasContent.tables,'book_presentations']){
  const rows=[];
  for(let offset=0;;offset+=500){
   const u=cfg.url+'/rest/v1/'+table+'?'+new URLSearchParams({[table==='books'?'id':'book_id']:'eq.lolita',select:'*',limit:'500',offset:String(offset)});
   let r;for(let attempt=0;attempt<3;attempt++){try{r=await fetch(u,{headers:{apikey:cfg.publishableKey},signal:AbortSignal.timeout(12000)});break;}catch(error){if(attempt===2)throw error;console.log('Retry',table,attempt+1);}}if(!r.ok)throw Error(table+': '+r.status);
   const a=await r.json();rows.push(...a);if(a.length<500)break;
  }
  bundle.tables[table]=rows;console.log(table,rows.length);fs.writeFileSync(dir+'/partial-'+suffix+'.json',JSON.stringify(bundle,null,2));
 }
 fs.writeFileSync(dir+'/live-'+suffix+'.json',JSON.stringify(bundle,null,2));
 fs.writeFileSync(dir+'/reconstructed-'+suffix+'.json',JSON.stringify(c.window.atlasContent.reconstruct(bundle,'lolita'),null,2));
})().catch(e=>{console.error(e.message);process.exitCode=1});
