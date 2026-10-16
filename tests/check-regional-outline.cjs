const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const p=JSON.parse(fs.readFileSync('research/lolita/ramsdale-outline.json','utf8'));
const ctx={window:{}};vm.createContext(ctx);vm.runInContext(fs.readFileSync('docs/regional-outline.js','utf8'),ctx);vm.runInContext(fs.readFileSync('docs/csv-export.js','utf8'),ctx);
const api=ctx.window.RegionalOutline,geom=api.geometry(p),bounds=api.bounds(p);assert.equal(geom.type,'polyline');assert.equal(geom.paths.length,2);assert(bounds.xmin<-73&&bounds.xmax>-67&&bounds.ymin<41&&bounds.ymax>47);
for(const path of geom.paths)assert.deepEqual(path[0],path.at(-1));
for(const [category,color]of [['action','#19665c'],['mentioned','#99502d']]){
 const attrs={chapterId:2,category,placeIndex:0},graphics=api.graphics(p,category==='action'?'1':'C1',color,true,attrs);
 assert.equal(graphics.filter(g=>g.geometry.type==='polyline').length,2);assert(graphics.every(g=>g.symbol.type!=='simple-marker'));assert(graphics.every(g=>g.attributes===attrs));assert.equal(graphics[1].symbol.color,color);assert.equal(graphics[1].symbol.style,'dash');assert.equal(graphics[2].symbol.type,'text');assert.equal(graphics[0].symbol.color,'#e8c565');
}
assert.equal(api.geometry({coords:[43,-71.5]}),null);
const d={book:{},places:{region:{...p,coords:[43,-71.5],kind:'uncertain'}},chapters:[{id:1,title:'Part I',places:['region'],placeText:['Region']}]};
const csv=ctx.window.atlasCsv.build(d,'places');assert(!csv.includes('"43"'));assert(!csv.includes('"-71.5"'));assert(csv.includes('"polyline"'));
// Exercise the actual atlas renderer: a region produces only lines and a label.
const source=fs.readFileSync('docs/app.js','utf8');
Object.assign(ctx,{isIllustrated:false,selectedPlace:0,selectedCitation:-1,current:1,visibleLayers:{action:true,mentioned:true},markerColors:{action:'#19665c',mentioned:'#99502d'},literaryPlaces:{region:p},allLiteraryPlaces:{region:p},GraphicClass:class{constructor(p){Object.assign(this,p)}},visibleMarkerNumbers:()=>({places:['1'],citations:[]}),updateLocationNumbers(){},activeChapter:()=>({id:2,places:['region']}),activeCitations:()=>[],placeCategory:()=> 'action'});
const layer=()=>({graphics:[],removeAll(){this.graphics=[]},add(g){this.graphics.push(g)}});ctx.markerLayer=layer();ctx.citedMarkerLayer=layer();vm.runInContext(source.slice(source.indexOf('function drawMarkers(){'),source.indexOf('function showMapError')),ctx);ctx.drawMarkers();assert.equal(ctx.markerLayer.graphics.length,3);assert(!ctx.markerLayer.graphics.some(g=>g.symbol.type==='simple-marker'));
ctx.visibleMarkerNumbers=()=>({places:[null],citations:[]});ctx.drawMarkers();assert.equal(ctx.markerLayer.graphics.length,0);
ctx.viewReady=true;ctx.ExtentClass=class{constructor(p){Object.assign(this,p)}expand(factor){this.factor=factor;return this}};let target;ctx.navigate=p=>target=p;
vm.runInContext(source.slice(source.indexOf('function centerSelectedPlace('),source.indexOf('function selectPlace(')),ctx);ctx.centerSelectedPlace();assert.equal(target.xmin,bounds.xmin);assert.equal(target.ymax,bounds.ymax);assert.equal(target.center,undefined);
vm.runInContext(source.slice(source.indexOf('function overview('),source.indexOf('function chapterFromHash(')),ctx);ctx.overview();assert.equal(target.xmin,bounds.xmin);assert.equal(target.ymax,bounds.ymax);
(async()=>{const {PGlite}=require('@electric-sql/pglite'),db=new PGlite();await db.exec('create table books(id text primary key,metadata jsonb);create table content_translations(book_id text,language text,source_hash text,source_text text,translated_text text,primary key(book_id,language,source_hash));');
const original={sentinel:7,geographicReview:{regionalPlaces:[{id:'regional-ramsdale',categories:{11:'action'},place:{coords:[43,-71.5],kind:'uncertain'}},{id:'untouched',place:{coords:[1,2]}}]}};
await db.query('insert into books values($1,$2),($3,$4)',['lolita',original,'other',{sentinel:9}]);const sql=fs.readFileSync('research/lolita/publish-ramsdale-outline.sql','utf8');await db.exec(sql);await db.exec(sql);
const m=(await db.query("select metadata from books where id='lolita'")).rows[0].metadata;assert.equal(m.sentinel,7);assert.deepEqual(m.geographicReview.regionalPlaces[1],original.geographicReview.regionalPlaces[1]);assert.deepEqual(m.geographicReview.regionalPlaces[0].categories,{11:'action'});assert.deepEqual(m.geographicReview.regionalPlaces[0].place.regionalOutline,p.regionalOutline);assert.equal((await db.query("select metadata from books where id='other'")).rows[0].metadata.sentinel,9);await db.close();console.log('PASS: official region outline, category numbering/hit attributes, no point symbol, filter clearing, coordinate-free CSV, idempotent Ramsdale-only SQL.');})().catch(e=>{console.error(e);process.exitCode=1});
