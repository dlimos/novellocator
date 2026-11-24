'use strict';
const fs=require('node:fs');
const http=require('node:http');
const path=require('node:path');
const assert=require('node:assert/strict');
const {chromium}=require('playwright-core');

const site=path.resolve(__dirname,'../docs');
const mime={'.html':'text/html','.js':'application/javascript','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.webp':'image/webp','.json':'application/json','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{
 const url=new URL(req.url,'http://localhost');
 const pathname=decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname);
 const target=path.resolve(site,'.'+pathname);
 if(!target.startsWith(site+path.sep)){res.writeHead(403).end();return;}
 fs.readFile(target,(error,data)=>{
  if(error){res.writeHead(404).end('Not found: '+pathname);return;}
  res.writeHead(200,{'Content-Type':mime[path.extname(target)]||'application/octet-stream','Cache-Control':'no-store'});
  res.end(data);
 });
});
const start=()=>new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const stop=()=>new Promise(resolve=>server.close(resolve));
(async()=>{
 await start();
 const port=server.address().port;
 const executable=['/usr/bin/google-chrome','/usr/bin/google-chrome-stable','/usr/bin/chromium'].find(p=>fs.existsSync(p));
 assert(executable,'No Google Chrome/Chromium available on the GitHub runner');
 const browser=await chromium.launch({headless:true,executablePath:executable,args:['--no-sandbox','--disable-dev-shm-usage']});
 fs.mkdirSync('faulkner-browser-audit',{recursive:true});
 try{
  for(const lang of ['en','it','es']){
   const page=await browser.newPage({viewport:{width:1440,height:960},deviceScaleFactor:1});
   const errors=[];
   page.on('pageerror',err=>errors.push(String(err).slice(0,300)));
   try{
    const url='http://127.0.0.1:'+port+'/atlas.html?book=sound-and-fury&lang='+lang;
    await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});
    await page.waitForFunction(()=>window.atlasData?.book?.id==='sound-and-fury'&&document.querySelector('#detail .detail-text'),null,{timeout:90000});
    const snapshot=await page.evaluate(()=>{
     const d=window.atlasData;
     return {book:d.book.id,chapters:d.chapters.length,
      counts:d.chapters.map(c=>(c.unlocatedPlaces||[]).filter(v=>v.rev23Multilingual===true).length),
      panoramas:d.book.illustratedView?.views?.length||0,
      nonMapped:d.chapters.flatMap(c=>c.unlocatedPlaces||[]).filter(v=>v.rev23Multilingual===true&&v.excerpt?.original?.quote&&v.excerpt?.translations?.it?.quote&&v.excerpt?.translations?.es?.quote).length,
      mismatch:d.chapters.flatMap(c=>c.unlocatedPlaces||[]).filter(v=>v.rev23Multilingual===true&&!v.id.startsWith('rev23:')).length};
    });
    assert.equal(snapshot.book,'sound-and-fury');
    assert.equal(snapshot.panoramas,2,'Keep exactly the two existing panoramas');
    assert.equal(snapshot.counts.reduce((a,b)=>a+b,0),73,'73 non-cartographic reference rows');
    assert.equal(snapshot.nonMapped,73,'Every curated record must have EN/IT/ES');
    assert.equal(snapshot.mismatch,0);
    const first=snapshot.counts.findIndex(n=>n>0);assert(first>=0);
    await page.evaluate(index=>window.selectChapter(index,false,false),first);
    const details=page.locator('.unlocated-places details.location-evidence');
    const visible=await details.count();
    assert.equal(visible,snapshot.counts[first],'The UI should show only verified selected settings');
    await details.first().evaluate(el=>el.open=true);
    const picker=details.first().locator('select.quotation-language-select');
    const values=await picker.locator('option').evaluateAll(els=>els.map(e=>e.value));
    assert.deepEqual(values.sort(),['en','es','it'],'Language picker exposes all three verified editions');
    await picker.selectOption(lang);
    await page.waitForFunction(expected=>document.querySelector('.unlocated-places details.location-evidence select')?.value===expected,lang);
    const block=details.first().locator('blockquote');
    assert.equal(await block.getAttribute('lang'),lang,'Language switch updates visible quotation');
    const quote=await block.innerText();
    assert(quote.trim().length>7,'Selected passage must contain real text');
    const filename='faulkner-browser-audit/faulkner-'+lang+'.png';
    await page.screenshot({path:filename,fullPage:false});
    console.log('PASS browser '+lang+' '+JSON.stringify({...snapshot,visible,quoteLength:quote.length,screenshot:filename,errors:errors.slice(0,3)}));
   }catch(error){
    const file='faulkner-browser-audit/faulkner-'+lang+'-failure.png';
    await page.screenshot({path:file,fullPage:false}).catch(()=>{});
    console.error('FAIL browser '+lang+' '+String(error),{errors});
    throw error;
   }finally{await page.close();}
  }
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{if(server.listening)await stop();});
