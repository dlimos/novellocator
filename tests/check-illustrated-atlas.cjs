const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),path=require('path');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
const fixture={};vm.runInNewContext(read('docs/data/macondo-local.js'),{window:fixture});const payload=fixture.atlasIllustratedLocal;
const html=read('docs/illustrated.html'),app=read('docs/illustrated-atlas.js');new vm.Script(app);
const elements={},events={};function element(){return{children:[],style:{},dataset:{},attributes:{},append(...items){this.children.push(...items)},replaceChildren(){this.children=[]},setAttribute(k,v){this.attributes[k]=v},remove(){this.removed=true}}}
const get=id=>elements[id]??(elements[id]=element());get('action').checked=true;
const translated=[...html.matchAll(/data-text="([^"]+)"/g)].map(m=>{const el=element();el.dataset.text=m[1];return el});
const document={documentElement:{},getElementById:get,createElement:element,querySelectorAll(selector){return selector==='[data-text]'?translated:get('drawing').children.filter(p=>!p.removed&&p.className?.startsWith('pin'))},querySelector(selector){return translated.find(el=>selector.includes('"'+el.dataset.text+'"'))},addEventListener(name,cb){const prior=events[name];events[name]=()=>{prior?.();cb()}}};
const context={document,window:{addEventListener(){}},console:{warn(){},error(){}},URL,URLSearchParams,location:{search:'?book=macondo&lang=it',href:'https://example.test/illustrated.html?book=macondo&lang=it'},history:{replaceState(){}},localStorage:{getItem(){return null},setItem(){}},IllustratedData:{load:async()=>structuredClone(payload)},FictionalMap:{create:async()=>{throw Error('Mock WebGL failure')}}};vm.createContext(context);
(async()=>{
 vm.runInContext(app,context);await new Promise(setImmediate);
 assert.equal(document.documentElement.lang,'it');assert.equal(get('places').children.length,11);assert.equal(get('home').href,'index.html?lang=it');
 for(const lang of ['en','it','fr','es']){get('language').onchange({target:{value:lang}});for(const epoch of [0,1,2]){get('epoch-slider').oninput({target:{value:String(epoch)}});await new Promise(setImmediate);assert.ok(get('places').children.length>0);get('places').children[0].onclick();assert.ok(get('detail').children.some(p=>p.lang==='es'));assert.ok(get('detail').children.some(p=>p.className==='source-reference'));assert.ok(!get('detail').children.some(p=>p.href?.includes('.pdf')));assert.equal(get('home').href,'index.html?lang='+lang);}}
 assert.equal(document.querySelectorAll('.pin').length,19);get('action').checked=false;get('action').onchange();assert.ok(document.querySelectorAll('.pin').every(p=>p.hidden));
 const apiContext={window:{location:{protocol:'https:'},fetch:async(url,options)=>{assert.ok(String(url).includes('/rest/v1/book_maps'));assert.equal(options.headers.apikey,'sb_publishable_test');return{ok:true,json:async()=>[{metadata:{illustratedAtlas:structuredClone(payload)}}]}}},URL,URLSearchParams,AbortController,setTimeout,clearTimeout,structuredClone};vm.createContext(apiContext);vm.runInContext(read('docs/illustrated-data.js'),apiContext);const api=apiContext.window.IllustratedData;
 assert.equal((await api.load('macondo',{enabled:true,publishableKey:'sb_publishable_test',url:'https://test.supabase.co'})).places.length,47);
 const bad=structuredClone(payload);bad.epochs[0].image='https://evil.test/image.png';assert.throws(()=>api.validate(bad),/Invalid epoch/);await assert.rejects(api.load('../bad'),/Invalid book ID/);
 apiContext.window.fetch=async()=>({ok:true,json:async()=>[]});await assert.rejects(api.load('macondo',{enabled:true,publishableKey:'sb_publishable_test',url:'https://test.supabase.co'}),/not published/);
 assert.ok(read('docs/index.html').includes('illustrated.html?book=macondo'));
 assert.ok(!html.includes('const data=')&&!html.includes('data:image/png;base64'));
 console.log('PASS: illustrated catalogue, three epochs, four languages, public API, safe image paths, source references, markers and private local data.');
})().catch(e=>{console.error(e);process.exitCode=1});
