'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const {chromium}=require('playwright-core');
const chrome=['/usr/bin/google-chrome','/usr/bin/google-chrome-stable','/usr/bin/chromium'].find(fs.existsSync);
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:chrome,args:['--no-sandbox','--disable-dev-shm-usage']});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 try{
  await page.goto('https://dlimos.github.io/novellocator/atlas.html?book=sound-and-fury&lang=it&mode=imaginary&audit='+Date.now(),{waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForFunction(()=>window.atlasData?.book?.illustration?.epochs?.length===2,null,{timeout:70000});
  const details=await page.evaluate(async()=>{
   const cfg=window.atlasData.book.illustration;
   const views=await Promise.all(cfg.epochs.map(v=>new Promise(resolve=>{
    const img=new Image();
    img.onload=()=>resolve({id:v.id,path:v.image,ok:true,width:img.naturalWidth,height:img.naturalHeight});
    img.onerror=()=>resolve({id:v.id,path:v.image,ok:false});
    img.src=v.image;
   })));
   return {id:window.atlasData.book.id,mapType:window.atlasData.book.mapType,views};
  });
  assert.equal(details.id,'sound-and-fury');
  assert.equal(details.mapType,'illustrated');
  assert.equal(details.views.length,2);
  assert(details.views.every(v=>v.ok&&v.width>500&&v.height>250),'Both panoramas must be renderable by the browser');
  assert(details.views.some(v=>v.path.includes('compson-jefferson-panorama.png')));
  assert(details.views.some(v=>v.path.includes('jefferson-panorama.png')));
  assert.equal(errors.length,0,'JavaScript errors in literary panorama mode');
  console.log('PASS PANORAMAS '+JSON.stringify(details));
 }finally{await browser.close();}
})().catch(e=>{console.error('PANORAMA FAILURE',e);process.exitCode=1});
