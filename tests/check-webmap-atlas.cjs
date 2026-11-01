const assert=require('node:assert/strict');
const {create,validatePlaces}=require('../docs/webmap-atlas.js');
class Properties{constructor(props){Object.assign(this,props);}}
class Collection extends Array{toArray(){return [...this];}}
let latestMap,latestView,handler,removed=0,destroyed=0,fail=false;
class WebMap extends Properties{
  constructor(props){super(props);this.layers=new Collection({id:'context'},{id:'film-routes'});latestMap=this;}
  async load(){if(fail)throw Error('Unavailable Web Map');}
  add(layer){this.layers.push(layer);}
  remove(layer){this.layers.splice(this.layers.indexOf(layer),1);}
  destroy(){destroyed++;}
}
class Graphics extends Properties{constructor(props){super(props);this.graphics=[];}add(graphic){this.graphics.push(graphic);}removeAll(){this.graphics=[];}}
class View extends Properties{
  constructor(props){super(props);latestView=this;this.targets=[];}
  async when(){}
  on(type,callback){handler=callback;return {remove(){removed++;}};}
  async hitTest(){return {results:[{graphic:{attributes:{placeId:'a'}}}]};}
  async goTo(target){this.targets.push(target);}
  destroy(){destroyed++;}
}
const options={container:{},portalItemId:'0123456789abcdef0123456789abcdef',spatialReference:{wkt:'TEST_LOCAL_CARTESIAN'},
  initialExtent:{xmin:0,ymin:0,xmax:100000,ymax:100000},contextLayerIds:['context'],
  places:[{id:'m',category:'mentioned',x:90000,y:90000},{id:'a',category:'action',x:12000,y:34000},{id:'b',category:'action',x:13000,y:35000}],
  load:async()=>[WebMap,View,Graphics,Properties,Properties]};
(async()=>{
  let selected;const api=await create({...options,onSelect:id=>selected=id});
  assert(!latestMap.layers.some(layer=>layer.id==='film-routes'));
  assert.equal(latestMap.basemap,null);assert.equal(latestView.spatialReference.wkt,'TEST_LOCAL_CARTESIAN');
  assert(latestView.extent.xmax<90000); // Initial view excludes a distant mention.
  assert.deepEqual([...api.getLabels()],[['m','C1'],['a','1'],['b','2']]);
  assert(await api.select('b'));assert.equal(api.getSelectedId(),'b');
  api.setVisible('action',false);assert.deepEqual([...api.getLabels()],[['m','C1']]);assert.equal(api.getSelectedId(),'b');
  api.setVisible('action',true);assert.equal(api.getSelectedId(),'b');
  api.setPlaces(options.places.filter(place=>place.id!=='a'));assert.equal(api.getLabels().get('b'),'1');assert.equal(api.getSelectedId(),'b');
  await api.fit();assert(latestView.targets.at(-1).xmax>90000);
  await api.fit({actionOnly:true});assert(latestView.targets.at(-1).xmax<90000);
  api.setPlaces([{id:'a',category:'action',x:12000,y:34000}]);await handler({});assert.equal(selected,'a');
  api.setPlaces([{id:'m',category:'mentioned',x:90000,y:90000}]);await api.fit({actionOnly:true});assert.equal(latestView.targets.at(-1).xmax,100000);
  assert.equal(api.getSelectedId(),null);assert.equal(await api.select('missing'),false);
  assert.throws(()=>validatePlaces([{...options.places[0],coords:[1,2]}]),/terrestrial/);
  assert.throws(()=>api.setPlaces([options.places[0],options.places[0]]),/duplicate/);
  assert.throws(()=>api.setVisible('other',true),/Unknown/);
  api.destroy();api.destroy();assert.equal(removed,1);assert.equal(destroyed,1);
  assert.throws(()=>api.setPlaces([]),/disposed/);
  fail=true;await assert.rejects(create(options),/Unavailable/);assert.equal(destroyed,2);fail=false;
  await assert.rejects(create({...options,contextLayerIds:['absent']}),/Missing context/);assert.equal(destroyed,3);
  console.log('PASS: local coordinates, context filtering, category numbering, selection, action-only initial fit, visible-layer fit and disposal. Mock SDK; separate browser verification is documented in PROGRESS.md.');
})().catch(error=>{console.error(error);process.exitCode=1;});

{
 const vm=require('node:vm'),fs=require('node:fs');
 const context={console,URL,URLSearchParams};context.window=context;
 vm.runInNewContext(fs.readFileSync('docs/webmap-atlas.js','utf8'),context);
 const text={it:'Introduzione specifica.',en:'Specific introduction.',fr:'Introduction précise.',es:'Introducción concreta.'};
 const original={quote:'Synthetic fixture.',language:'en',type:'original',verificationStatus:'verified',rightsReviewId:'test-only'};
 const payload={formatVersion:1,checked:'2026-11-01',book:{id:'synthetic',title:text},map:{portalItemId:'0123456789abcdef0123456789abcdef'},places:{a:{names:text,mapName:'A'},m:{names:text,mapName:'M'}},labels:Object.fromEntries(['it','en','fr','es'].map(lang=>[lang,{sections:'Sections',help:'Help',note:'Note',world:'Fiction',precision:'Local map',mapMethod:'Source',footerHtml:'',empty:'No mapped places'}])),sections:[{id:1,title:'Test',introduction:text,references:[{placeId:'a',category:'action',discussion:text,original},{placeId:'m',category:'mentioned',discussion:text,original}]}]};
 for(const locale of ['it','en','fr','es']){
  const data=context.WebMapAtlasData.adapt(payload,locale,{a:{x:2,y:3},m:{x:9,y:10}});
  assert.equal(data.chapters[0].text,text[locale]);assert.equal(data.chapters[0].people,undefined);assert.equal(data.chapters[0].time,undefined);
  assert.equal(data.chapters[0].placeCategories.m,'mentioned');assert.equal(data.places.a.coords,undefined);
 }
 const bad=structuredClone(payload);delete bad.sections[0].introduction.fr;assert.throws(()=>context.WebMapAtlasData.validate(bad),/introduction/);
 const pending=structuredClone(payload);pending.sections[0].references[0].original.verificationStatus='pending';assert.throws(()=>context.WebMapAtlasData.validate(pending),/Unreviewed/);
 console.log('PASS: Web Map multilingual adapter, optional independent badges, category preservation and rejected unverified excerpts.');
 payload.map.pointService='https://example.test/FeatureServer/1';
 context.fetch=async url=>{
  const target=new URL(url);
  if(target.pathname==='/rest/v1/book_maps')return {ok:true,json:async()=>[{metadata:{webmapAtlas:payload}}]};
  assert.equal(target.pathname,'/FeatureServer/1/query');
  assert.equal(target.searchParams.get('outFields'),'OBJECTID,Name');
  return {ok:true,json:async()=>({features:[{attributes:{Name:'A'},geometry:{x:2,y:3}},{attributes:{Name:'M'},geometry:{x:9,y:10}}]})};
 };
 context.WebMapAtlasData.load('synthetic','it',{enabled:true,url:'https://example.test',publishableKey:'test-only'}).then(data=>{
  assert.equal(data.book.webmap.positions.a.x,2);
  console.log('PASS: public loader queries feature geometry through /query with only names and object IDs.');
 }).catch(error=>{console.error(error);process.exitCode=1;});
}
