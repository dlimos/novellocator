const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ids=['ulisse','proust','war-and-peace','moby-dick','gatsby'];
const live=process.argv.includes('--live');
const bundle=live?null:JSON.parse(require('node:child_process').execFileSync(process.execPath,['node_modules/tsx/dist/cli.mjs','-e',"import {loadInputs,normalize} from './scripts/database/model.ts'; console.log(JSON.stringify(normalize(loadInputs(process.cwd()))))"],{encoding:'utf8',maxBuffer:30_000_000}));
const calls=[];
const ctx={window:{atlasSupabase:{enabled:true,url:'https://example.supabase.co',publishableKey:'sb_publishable_test'}},URL,URLSearchParams,AbortController,setTimeout,clearTimeout,console,fetch:async(url,options)=>{
 calls.push(String(url));assert.equal(options.headers.apikey,'sb_publishable_test');assert.equal(options.headers.Authorization,undefined);
 const query=url.searchParams,table=url.pathname.split('/').pop(),id=query.get(table==='books'?'id':'book_id').slice(3),offset=Number(query.get('offset'));
 assert.ok(query.get('order'));assert.equal(query.get('limit'),'500');
 const rows=bundle.tables[table].filter(row=>(table==='books'?row.id:row.book_id)===id);
 // Simulate a server cap smaller than the requested size.
 return {ok:true,json:async()=>rows.slice(offset,offset+100)};
}};
vm.createContext(ctx);
for(const file of ['content-adapter.js','supabase-data.js'])vm.runInContext(fs.readFileSync('docs/'+file,'utf8'),ctx);
if(live){ctx.fetch=fetch;vm.runInContext(fs.readFileSync('docs/supabase-config.js','utf8'),ctx);}
function raw(file,key){const data={window:{}};vm.runInNewContext(fs.readFileSync('docs/data/'+file,'utf8'),data);return JSON.parse(JSON.stringify(data.window[key]));}
async function main(){
 for(const id of ids){const actual=await ctx.window.atlasSupabaseData.loadBook(id);const parsed=JSON.parse(JSON.stringify(actual.data)),expected=raw(id+'.js','atlasData');
  // PostgreSQL's JSON serializer can round double precision at the last digit.
  if(live)for(const collection of ['places','citedPlaces'])for(const [key,place] of Object.entries(expected[collection]||{})){
   assert.ok(parsed[collection][key],id+'/'+key+' exists');
   for(let axis=0;axis<2;axis++){assert.ok(Math.abs(parsed[collection][key].coords[axis]-place.coords[axis])<1e-12,id+'/'+key+' coordinates');place.coords[axis]=parsed[collection][key].coords[axis];}
  }
  assert.deepEqual(parsed,expected,id+' complete data');const dictionary=JSON.parse(JSON.stringify(actual.dictionary)),expectedDictionary=raw(id+'-i18n.js','atlasTranslations');
  if(live)for(const [language,messages] of Object.entries(expectedDictionary)){const missing=Object.keys(messages).filter(key=>!Object.hasOwn(dictionary[language]||{},key));if(missing.length)console.error(id+'/'+language+': missing '+missing.length+' translations; first: '+JSON.stringify(missing[0])+'; similar: '+JSON.stringify(Object.keys(dictionary[language]||{}).find(key=>key.startsWith(missing[0].slice(0,20)))));}
  assert.deepEqual(dictionary,expectedDictionary,id+' all languages');}
 await assert.rejects(ctx.window.atlasSupabaseData.loadBook('../private'));
 await assert.rejects(ctx.window.atlasSupabaseData.loadBook('missing'),error=>error.code==='BOOK_UNAVAILABLE');
 if(!live){assert.ok(calls.some(url=>url.includes('offset=1000')),'all translation pages loaded');ctx.fetch=async()=>({ok:false,status:403});await assert.rejects(ctx.window.atlasSupabaseData.loadBook('ulisse'),/HTTP 403/);
  const sqlPaste=JSON.parse(JSON.stringify(bundle));for(const row of sqlPaste.tables.content_translations){row.source_text=row.source_text.replaceAll('\n','\r\n');row.translated_text=row.translated_text.replaceAll('\n','\r\n');}
  assert.deepEqual(JSON.parse(JSON.stringify(ctx.window.atlasContent.reconstruct(sqlPaste,'ulisse').dictionary)),raw('ulisse-i18n.js','atlasTranslations'),'Windows SQL paste line endings');
  for(const mode of ['success','offline','missing','disabled']){
   const scripts=[],detail={setAttribute(){}};const context={URLSearchParams,console:{error(){}},window:{location:{search:'?book=ulisse'},atlasSupabase:{enabled:mode!=='disabled'},atlasI18n:{locale:'it',t:x=>x,localizeData:x=>x},atlasSupabaseData:{loadBook:async()=>{if(mode==='success')return{data:{book:{}},dictionary:{it:{}}};const error=new Error('test');if(mode==='missing')error.code='BOOK_UNAVAILABLE';throw error;}}},document:{head:{appendChild:s=>scripts.push(s)},createElement:()=>({setAttribute(){}}),getElementById:()=>detail}};
   vm.runInNewContext(fs.readFileSync('docs/load-book.js','utf8'),context);await new Promise(resolve=>setImmediate(resolve));
   if(mode==='success'){assert.equal(scripts.length,1);assert.equal(scripts[0].src,'app.js');assert.equal(context.window.atlasDataSource,'supabase');}
   if(mode==='offline'||mode==='disabled'){assert.equal(scripts.length,0);assert.match(detail.textContent,/Riprova più tardi/);}
   if(mode==='missing'){assert.equal(scripts.length,0);assert.match(detail.textContent,/non è ancora disponibile/);}
  }
 }
 console.log('PASS: '+(live?'live Supabase anonymous API (coordinate tolerance 1e-12 degrees)':'paginated Supabase API with smaller server cap')+', complete datasets and translations for five novels; unpublished/missing books blocked.');
}
main().catch(error=>{console.error(error.message);process.exitCode=1});
