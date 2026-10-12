const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('docs/atlas.html','utf8');
const bootstrap=html.match(/<script>(document\.documentElement\.setAttribute[^<]+)<\/script>/)[1];
assert.ok(html.indexOf(bootstrap)<html.indexOf('<link rel="stylesheet"'));
assert.ok(html.includes('html[data-presentation="pending"] body{visibility:hidden}'));
const source=fs.readFileSync('docs/load-book.js','utf8');
async function check(mode){
 const attributes={},detail={setAttribute(){}},events=[];
 const document={documentElement:{setAttribute:(key,value)=>{attributes[key]=value;events.push(value);}},getElementById:()=>detail,createElement:()=>({}),head:{appendChild(){}}};
 let resolveCatalogue,rejectCatalogue;
 const catalogue=new Promise((resolve,reject)=>{resolveCatalogue=resolve;rejectCatalogue=reject;});
 const entry={id:'test-book'};
 const context={document,URLSearchParams,console:{error(){}},window:{location:{search:'?book=test-book'},atlasCatalogueData:{load:()=>catalogue},atlasCatalogue:{books:[entry]},atlasPresentation:{apply:book=>{assert.equal(book,entry);assert.equal(attributes['data-presentation'],'pending');events.push('theme');}},atlasI18n:{locale:'en',t:x=>x,localizeData:x=>x},atlasSupabase:{enabled:true},atlasSupabaseData:{loadBook:async()=>({data:{},dictionary:{}})}}};
 vm.runInNewContext(bootstrap,context);
 vm.runInNewContext(source,context);
 await new Promise(resolve=>setImmediate(resolve));
 assert.equal(attributes['data-presentation'],'pending','Slow catalogue must not reveal the standard theme');
 if(mode==='failure')rejectCatalogue(new Error('Network unavailable'));
 else resolveCatalogue();
 await new Promise(resolve=>setImmediate(resolve));
 assert.equal(attributes['data-presentation'],'ready');
 if(mode==='failure')assert.match(detail.textContent,/could not be loaded/);
 else assert.ok(events.indexOf('theme')<events.indexOf('ready'),'Theme must be applied before revealing the page');
}
(async()=>{await check('success');await check('failure');console.log('PASS: no standard-theme flash during slow loading; catalogue failures remain visible.');})().catch(error=>{console.error(error);process.exitCode=1;});
