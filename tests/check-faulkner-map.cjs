const fs=require('node:fs'),assert=require('node:assert/strict'),{chromium}=require('playwright-core');
const executable=['/usr/bin/google-chrome','/usr/bin/google-chrome-stable','/usr/bin/chromium'].find(fs.existsSync);
if(!executable)throw Error('Chrome unavailable');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:executable,args:['--no-sandbox','--disable-dev-shm-usage']});
 const page=await browser.newPage({viewport:{width:1440,height:1100}});
 const diagnostics={consoleErrors:[],pageErrors:[],failedRequests:[],sourceRequests:[]};
 page.on('console',x=>{if(x.type()==='error')diagnostics.consoleErrors.push(x.text().slice(0,650));});
 page.on('pageerror',e=>diagnostics.pageErrors.push(String(e).slice(0,650)));
 page.on('requestfailed',r=>diagnostics.failedRequests.push({url:r.url().slice(0,150),reason:r.failure()?.errorText}));
 page.on('response',r=>{if(/arcgis|openstreetmap|arcgisonline/i.test(r.url()))diagnostics.sourceRequests.push({status:r.status(),url:r.url().slice(0,120)});});
 try{
  await page.goto('https://dlimos.github.io/novellocator/atlas.html?book=sound-and-fury&lang=it&audit='+Date.now(),{waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForFunction(()=>window.atlasData?.book?.id==='sound-and-fury'&&document.querySelector('#detail .detail-text'),null,{timeout:60000});
  let state;
  try{await page.waitForFunction(()=>{try{return window.eval('viewReady')===true;}catch{return false;}},null,{timeout:40000})}
  catch(e){diagnostics.waitError=String(e);}
  await page.waitForTimeout(9000);
  state=await page.evaluate(()=>{
   const get=expr=>{try{return window.eval(expr)}catch(e){return String(e)}};
   const err=document.getElementById('map-error');
   const map=document.getElementById('map');
   const mapNode=map?.querySelector('.esri-view');
   return {
    ready:get('viewReady'),
    mapErrorVisible:err?!err.hidden:null,mapErrorText:err?.textContent?.trim(),
    mapViewFound:!!mapNode,
    mapSurfaceSize:map?{width:map.clientWidth,height:map.clientHeight}:null,
    basemapDisabled:document.getElementById('basemap-select')?.disabled,
    layerActionGraphics:get('markerLayer?.graphics?.length'),layerMentionGraphics:get('citedMarkerLayer?.graphics?.length'),
    mapScale:get('view?.scale'),mapStatus:get('view?.readyState'),mapUpdating:get('view?.updating'),
    esriCanvas:map?.querySelectorAll('canvas').length,
    leafletTiles:map?.querySelectorAll('img').length,
    imgLoaded:[...map?.querySelectorAll('img')||[]].filter(i=>i.naturalWidth>0).length
   }
  });
  fs.mkdirSync('faulkner-map-diagnostic',{recursive:true});
  await page.locator('#map-stage').screenshot({path:'faulkner-map-diagnostic/map-italian.png'});
  console.log('MAP_RESULT '+JSON.stringify(state));
  console.log('MAP_REQUESTS '+JSON.stringify(diagnostics.sourceRequests.slice(-20)));
  console.log('MAP_ISSUES '+JSON.stringify({...diagnostics,sourceRequests:undefined}));
  assert.equal(state.ready,true,'Map engine did not enter ready state');
  assert.equal(state.mapErrorVisible,false,'Map error UI visible');
  assert(state.layerActionGraphics+state.layerMentionGraphics>0,'No markers in the view');
  assert(state.esriCanvas>0,'The map is missing rendered canvas');
  assert.equal(diagnostics.pageErrors.length,0,'Unexpected page errors');
  console.log('PASS: basemap initialized with graphics and WebGL/Canvas; screenshot captured');
 }finally{await page.close();await browser.close();}
})().catch(e=>{console.error('MAP TEST FAILURE',e);process.exitCode=1});
