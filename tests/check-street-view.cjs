const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');const root='public/';
const localeCtx={window:{}};vm.runInNewContext(fs.readFileSync(root+'locales/ui.js','utf8'),localeCtx);const messages=localeCtx.window.atlasLocaleData.messages;
for(const book of ['ulisse','proust'])for(const lang of ['en','it','fr','es']){
 const elements={};const el=()=>({children:[],appendChild(x){this.children.push(x)},setAttribute(){},addEventListener(){},scrollIntoView(){}});
 let calls=0,replaced,prevented=false;const popup={opener:'old',location:{replace(url){assert.equal(popup.opener,null);replaced=url}},close(){}};
 const ctx={console,URLSearchParams,window:{atlasI18n:{locale:lang,t:k=>messages[lang][k]??k},location:{hash:'',search:''},innerWidth:1200,matchMedia:()=>({matches:true}),addEventListener(){},open(url,target,features){calls++;assert.equal(url,'about:blank');assert.equal(target,'_blank');assert.ok(features.includes('popup=yes'));return popup}},document:{getElementById:id=>elements[id]??(elements[id]=el()),createElement:el,querySelector:()=>({})}};
 vm.createContext(ctx);for(const p of ['data/'+book+'.js','basemaps.js'])vm.runInContext(fs.readFileSync(root+p,'utf8'),ctx);
 vm.runInContext(fs.readFileSync(root+'app.js','utf8').replace(/initializeMap\(\);\s*$/,''),ctx);assert.equal(calls,0);
 for(const [i,c]of ctx.window.atlasData.chapters.entries()){
  vm.runInContext(`selectChapter(${i},false,false)`,ctx);
  for(const [j,id]of c.places.entries()){
   vm.runInContext(`selectPlace(${j})`,ctx);const p=ctx.window.atlasData.places[id];const html=elements['selected-location'].innerHTML;
   const href=html.match(/id="street-view-link" href="([^"]+)"/)[1].replaceAll('&amp;','&');const url=new URL(href);
   assert.equal(url.origin,'https://www.google.com');assert.equal(url.searchParams.get('api'),'1');assert.equal(url.searchParams.get('map_action'),'pano');assert.equal(url.searchParams.get('viewpoint'),Array.from(p.coords).join(','));assert.equal(url.searchParams.has('key'),false);
   assert.ok(html.includes(messages[lang]['Google mostra il panorama disponibile più vicino: può essere spostato rispetto al punto e dipende dalla copertura.']));
   assert.match(html,/target="_blank" rel="noopener noreferrer" aria-label=/);
  }
 }
 const href=elements['selected-location'].innerHTML.match(/id="street-view-link" href="([^"]+)"/)[1].replaceAll('&amp;','&');
 const event={currentTarget:{href},button:0,preventDefault(){prevented=true}};
 elements['street-view-link'].onclick(event);assert.equal(calls,1);assert.equal(replaced,href);assert.equal(prevented,true);
 prevented=false;elements['street-view-link'].onclick({...event,ctrlKey:true});assert.equal(calls,1);assert.equal(prevented,false);
 ctx.window.open=()=>null;elements['street-view-link'].onclick(event);assert.equal(prevented,false);
 ctx.window.open=()=>{throw Error('blocked')};elements['street-view-link'].onclick(event);assert.equal(prevented,false);
}
console.log('PASS: Street View URLs use selected coordinates for both books in four languages; no key or pre-click Google request; popup severs opener; blocked and modified clicks retain ordinary link.');
