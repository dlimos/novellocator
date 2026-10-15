const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctx={window:{},URL,URLSearchParams,AbortController,setTimeout,clearTimeout,console,fetch};vm.createContext(ctx);
for(const name of ['supabase-config.js','content-adapter.js','supabase-data.js'])vm.runInContext(fs.readFileSync('docs/'+name,'utf8'),ctx);
(async()=>{
 const result=JSON.parse(JSON.stringify(await ctx.window.atlasSupabaseData.loadBook('sound-and-fury')));
 const expected=JSON.parse(fs.readFileSync('work/sound-and-fury-excerpts/expected.json','utf8'));
 if(process.argv.includes('--allow-reading-diagram-update')){
  // An independently published diagram is the only explicitly allowed concurrent field.
  expected.data.book.readingDiagram=result.data.book.readingDiagram;
  console.log('Preserving the independently published book.readingDiagram metadata.');
 }
 try{assert.deepEqual(result,expected,'Only reviewed quotation fields may change');}catch(error){
  fs.writeFileSync('work/sound-and-fury-excerpts/live-mismatch.json',JSON.stringify(result,null,2)+'\n');
  function differences(a,b,path=''){if(JSON.stringify(a)===JSON.stringify(b))return [];if(!a||!b||typeof a!=='object'||typeof b!=='object')return [path];return [...new Set([...Object.keys(a),...Object.keys(b)])].flatMap(key=>differences(a[key],b[key],path+'.'+key));}
  console.error('Changed paths:',differences(result,expected).slice(0,30));throw error;
 }
 fs.writeFileSync('docs/data/sound-and-fury.js','window.atlasData='+JSON.stringify(result.data,null,2)+';\n');
 fs.writeFileSync('docs/data/sound-and-fury-i18n.js','window.atlasTranslations='+JSON.stringify(result.dictionary,null,2)+';\n');
 fs.writeFileSync('work/sound-and-fury-excerpts/live-after.json',JSON.stringify(result,null,2)+'\n');
 console.log('PASS: all 227 published passages, exact highlight forms and bibliography match; every other book field and editorial translation is unchanged.');
})().catch(e=>{console.error(e);process.exitCode=1;});
