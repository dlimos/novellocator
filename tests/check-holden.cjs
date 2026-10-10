const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),{spawnSync}=require('node:child_process');
const context={window:{}};
for(const file of ['data/holden.js','data/holden-i18n.js','content/books.js','csv-export.js'])vm.runInNewContext(fs.readFileSync('docs/'+file,'utf8'),context);
const d=context.window.atlasData,dict=context.window.atlasTranslations;
assert.equal(d.chapters.length,26);assert.deepEqual(Array.from(d.chapters,c=>c.id),Array.from({length:26},(_,i)=>i+1));
assert.equal(Object.keys(d.places).length,52);
for(const p of Object.values(d.places))assert.ok(['building','historical','street','area','uncertain'].includes(p.kind));
const refs=d.chapters.flatMap(c=>c.places);assert.equal(refs.length,82);assert.equal(new Set(refs).size,52);
for(const c of d.chapters){assert.equal(c.places.length,c.placeText.length);assert.ok(c.setting&&!c.setting.includes('undefined'));assert.equal(new Set(c.places).size,c.places.length);for(const id of c.places){assert.ok(d.places[id]);assert.ok(['action','mentioned'].includes(c.placeCategories[id]));assert.ok(c.placeSources[id].url.includes('#page='));}assert.ok(!c.placeExcerpts&&!c.excerpts);for(const u of c.unlocatedPlaces){assert.equal(u.quote,'');assert.ok(u.url.includes('#page='));}}
const c=n=>d.chapters[n-1];
assert.ok(c(16).places.includes('amnh'));assert.ok(!c(16).places.includes('met'));
assert.ok(c(25).places.includes('met'));assert.ok(!c(25).places.includes('amnh'));
assert.equal(c(17).placeCategories.rink,'action');assert.ok(!c(17).places.includes('radio'));assert.equal(c(18).placeCategories.radio,'action');
assert.equal(c(9).placeCategories.pond,'mentioned');assert.equal(c(20).placeCategories.pond,'action');
assert.equal(c(17).placeCategories.vermont,'mentioned');assert.equal(c(24).placeCategories.vermont,'action');
assert.equal(c(25).placeCategories.holland,'mentioned');assert.equal(c(24).placeCategories.sutton,'action');
assert.equal(c(26).places.length,0);assert.ok(c(26).unlocatedPlaces.length);
assert.ok(!Object.keys(d.places).some(id=>/pencey|edmont|seton|sedebego|mcburney/.test(id)));
assert.ok(d.places.trenton.coords[1]<-74.7&&d.places.trenton.coords[0]<40.3,'Reject similarly named New Jersey transit centres');
assert.ok(d.places.elmo.coords[0]>40.75&&d.places.elmo.coords[1]<-73.96,'Historical El Morocco is in Manhattan, not Brooklyn');
assert.ok(d.places.holland.coords[0]>40.72&&d.places.holland.coords[1]<-74.0,'Reject incorrect Brooklyn tunnel geocode');
assert.equal(d.places.carousel.coords[0],40.76994074);assert.equal(d.places.pond.coords[1],-73.97424142);
function translated(value,key){if(typeof value==='string'&&!['id','url','kind','checked','quote','originalLanguage','hashPrefix','unit','role'].includes(key)&&!/^\d+$/.test(value)&&!value.startsWith('Holden ·')&&!['J. D. Salinger','en','memory','plan','present-and-memory','invented-plan','embedded-film','proposed-film','speculation','offstage-reported','reported-memory','action','mentioned'].includes(value)){for(const lang of ['en','it','fr','es'])assert.equal(typeof dict[lang][value],'string',`${lang}: ${key}: ${value}`);}else if(Array.isArray(value))value.forEach(v=>translated(v,key));else if(value&&typeof value==='object')Object.entries(value).forEach(([k,v])=>translated(v,k));}
translated(d.book);for(const p of Object.values(d.places))translated(p);for(const chapter of d.chapters){for(const key of ['title','time','setting','text','note','placeText','links','unlocatedPlaces'])translated(chapter[key],key);}
assert.ok(dict.it[d.book.title].includes('Holden'));assert.equal(dict.fr[d.book.title],'L’Attrape-cœurs');
const csv=context.window.atlasCsv.build(d,'places','en');assert.ok(csv.startsWith('\ufeff'));assert.ok(csv.includes('Sutton Place')&&csv.includes('Lake Sedebego'));
const book=context.window.atlasCatalogue.books.find(b=>b.id===d.book.id);assert.equal(book.theme,'winter-city');assert.ok(fs.existsSync('docs/'+book.cover.src));assert.equal(fs.readFileSync('docs/'+book.cover.src).readUInt16BE(0),0xffd8);
const ignored=spawnSync('git',['check-ignore','docs/data/holden.js','docs/data/holden-i18n.js','docs/data/holden-original.json','docs/data/holden-audit.json','database/generated/holden/content.sql'],{encoding:'utf8'});assert.equal(ignored.status,0);assert.equal(ignored.stdout.trim().split(/\r?\n/).length,5);
console.log('PASS: 26 original chapters, 52 mapped places, 82 category-aware references, fictional settings unlocated, historical geography, four-language descriptions and no copyrighted passages published.');
