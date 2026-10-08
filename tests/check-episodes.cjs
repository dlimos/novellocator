const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const elements={};function element(){return {children:[],hidden:true,disabled:true,innerHTML:'',attributes:{},setAttribute(k,v){this.attributes[k]=v},addEventListener(){},appendChild(b){this.children.push(b)},scrollIntoView(){}}}
const sandbox={console,URLSearchParams,window:{innerWidth:1100,location:{hash:'#episodio-18'},matchMedia:()=>({matches:true}),addEventListener(){}},document:{getElementById:id=>elements[id]??(elements[id]=element()),createElement:element,querySelector:()=>({})}};
vm.createContext(sandbox);vm.runInContext(fs.readFileSync('public/data/ulisse.js','utf8'),sandbox);vm.runInContext(fs.readFileSync('public/basemaps.js','utf8'),sandbox);
const source=fs.readFileSync('public/app.js','utf8').replace(/initializeMap\(\);\s*$/,'');vm.runInContext(source,sandbox);
assert.equal(vm.runInContext('current',sandbox),17);assert.match(elements.detail.innerHTML,/Penelope/);
vm.runInContext(`GraphicClass=class{constructor(p){Object.assign(this,p)}};ExtentClass=class{constructor(p){Object.assign(this,p)}};markerLayer={graphics:[],removeAll(){this.graphics=[]},add(g){this.graphics.push(g)}};let destinations=[];view={goTo(target){destinations.push(target);return Promise.resolve()}};viewReady=true;`,sandbox);
for(let i=0;i<18;i++){
 const chapter=vm.runInContext(`chapters[${i}]`,sandbox);assert.equal(chapter.id,i+1);assert.equal(chapter.places.length,chapter.placeText.length);
 for(const id of chapter.places){const p=vm.runInContext(`literaryPlaces['${id}']`,sandbox);assert.ok(p);assert.ok(p.coords[0]>53.2&&p.coords[0]<53.5&&p.coords[1]<-6&&p.coords[1]>-6.5)}
 vm.runInContext(`selectChapter(${i})`,sandbox);
 assert.equal(elements.places.children.filter(b=>b.attributes['aria-pressed']==='true').length,1);
 assert.equal(vm.runInContext('markerLayer.graphics.length',sandbox),chapter.places.length*2);
 assert.ok(vm.runInContext('markerLayer.graphics.every(g=>g.attributes.chapterId===chapters[current].id)',sandbox));
 assert.match(elements.detail.innerHTML,new RegExp(chapter.title));assert.equal(sandbox.window.location.hash,`episodio-${i+1}`);
 const target=vm.runInContext('destinations.at(-1)',sandbox);if(chapter.places.length>1){for(const id of chapter.places){const p=vm.runInContext(`literaryPlaces['${id}']`,sandbox);assert.ok(p.coords[1]>=target.xmin&&p.coords[1]<=target.xmax&&p.coords[0]>=target.ymin&&p.coords[0]<=target.ymax)}}
}
vm.runInContext('selectChapter(9);selectPlace(chapters[9].places.indexOf("merchants"))',sandbox);assert.match(elements['selected-location'].innerHTML,/Temple Bar/);assert.match(elements['selected-location'].innerHTML,/NIAH/);
vm.runInContext('selectChapter(17);',sandbox);assert.match(elements.detail.innerHTML,/id="next"[^>]*disabled/);
const html=fs.readFileSync('public/atlas.html','utf8');assert.ok(html.includes('src="load-book.js"'));assert.ok(html.includes('id="basemap-select"'));assert.doesNotMatch(source+html,/components:\['attribution'\]/);
const all=vm.runInContext('literaryPlaces',sandbox),records=require('./fixtures/niah-dublin.json');
assert.equal(Object.keys(all).length,115);
for(const [id,p] of Object.entries(all)){
 assert.ok(p.method&&p.note&&p.kind&&p.checked,id);for(const s of [p.narrativeSource,p.positionSource])assert.ok(/^https:\/\//.test(s.url)&&s.label,id);
 if(p.positionSource.recordId){const official=records.find(r=>r.REG_NO===p.positionSource.recordId);assert.deepEqual(Array.from(p.coords),[official.LATITUDE,official.LONGITUDE],id)}
}
assert.deepEqual(Array.from(all.sweny.coords),[53.341865,-6.250559]);assert.equal(all.grafton.positionSource.recordId,50920061);assert.ok(all.post.coords[0]>all.andrew.coords[0]);
assert.ok(vm.runInContext('chapters[5].places.length>=20&&chapters[7].places.length>=13&&chapters[9].places.length>=30',sandbox));
assert.equal(new Set(vm.runInContext('chapters[9].places',sandbox)).size,34);
console.log('PASS: 18 episodi, 115 luoghi con fonti, coordinate NIAH coincidenti con i dati ufficiali, selezione e isolamento dei punti, link diretti, inquadrature e navigazione.');

