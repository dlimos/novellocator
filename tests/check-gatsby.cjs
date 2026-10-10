const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),cp=require('node:child_process');
const context={window:{}};
for(const file of ['gatsby.js','gatsby-i18n.js'])vm.runInNewContext(fs.readFileSync('docs/data/'+file,'utf8'),context);
const data=context.window.atlasData,dictionary=context.window.atlasTranslations;
const original=JSON.parse(fs.readFileSync('docs/data/gatsby-original.json','utf8'));
assert.equal(original.length,9);assert.equal(data.chapters.length,9);
assert.deepEqual(Array.from(data.chapters,c=>c.id),[1,2,3,4,5,6,7,8,9]);
const all={...data.places,...data.citedPlaces};
function passage(c,q){assert.equal(q.language,'en');assert.equal(q.type,'original');assert.ok(original[c.id-1].paragraphs.includes(q.quote),`Chapter ${c.id}: quotation differs from the original`);assert.ok(q.url.endsWith('/chapter-'+c.id));assert.deepEqual(Object.keys(q.translations||{}),[]);}
for(const c of data.chapters){
 assert.equal(c.places.length,c.placeText.length);assert.ok(c.places.length);assert.equal(new Set(c.places).size,c.places.length);
 for(const id of c.places){assert.ok(data.places[id]);assert.ok(c.placeSources[id]);passage(c,c.placeExcerpts[id].original);assert.deepEqual(Object.keys(c.placeExcerpts[id].translations),[]);}
 for(const ref of c.citations){assert.equal(ref.category,'mentioned');assert.ok(data.citedPlaces[ref.placeId]);passage(c,ref.excerpt.original);assert.deepEqual(Object.keys(ref.excerpt.translations),[]);}
 for(const u of c.unlocatedPlaces){assert.ok(original[c.id-1].paragraphs.includes(u.quote));assert.equal(u.coords,undefined);}
}
for(const p of Object.values(all)){assert.ok(p.coords.every(Number.isFinite));assert.ok(Math.abs(p.coords[0])<=90&&Math.abs(p.coords[1])<=180);assert.match(p.positionSource.url,/^https:\/\//);assert.ok(['area','street','historical','building','uncertain'].includes(p.kind));}
// Fictional estates/garage must not acquire a guessed real-world mansion/address.
for(const id of ['west','east','valley'])assert.equal(data.places[id].kind,'area');
assert.match(data.places.west.note,/No surviving mansion/);assert.match(data.places.valley.note,/does not locate Wilson/);
assert.ok(data.chapters[7].unlocatedPlaces.some(p=>p.name==='Gatsby’s swimming pool'));
assert.ok(data.chapters[8].unlocatedPlaces.some(p=>p.name.includes('cemetery')));
assert.ok(data.chapters[2].unlocatedPlaces.some(p=>p.name==='Warwick'));
assert.ok(!Object.values(all).some(p=>/Hempstead House|Oheka|Seelbach|Gatsby’s mansion|Wilson’s garage/.test(p.name)));
// Suggested trips, fake biography and photographs are cited; they are not visited scenes.
assert.ok(!data.chapters[4].places.includes('coney'));assert.ok(data.chapters[4].citations.some(p=>p.placeId==='coney'));
assert.ok(!data.chapters[7].places.includes('atlantic'));assert.ok(!data.chapters[7].places.includes('montreal'));
assert.ok(!data.chapters[3].places.includes('sanfrancisco'));
assert.ok(data.chapters[1].citations.some(p=>p.placeId==='montauk'));
// A place can be an action setting in one chapter and a mention in another.
assert.ok(data.chapters[2].places.includes('forties'));assert.ok(data.chapters[3].citations.some(p=>p.placeId==='forties'));
assert.ok(data.chapters[3].places.includes('louisville'));assert.ok(data.chapters[0].citations.some(p=>p.placeId==='louisville'));
// Protect against plausible-looking geocoder results in the wrong city or on another campus.
const near=(id,lat,lon,tolerance)=>{assert.ok(Math.abs(all[id].coords[0]-lat)<tolerance&&Math.abs(all[id].coords[1]-lon)<tolerance,id+' wrong geographical match');};
near('murray',40.7514,-73.9784,.002);near('merton',51.7497,-1.2527,.0008);near('grandcanal',45.436,12.331,.006);near('argonne',49.17,5,.15);near('plaza',40.7645,-73.9745,.001);near('brooklynbridge',40.7061,-73.9969,.003);
const namedEvidence={adriatic:/Adriatic Sea/,montauk:/Montauk Point/,carnegie:/Carnegie Hall/,camptaylor:/Camp Taylor/,marseilles:/Marseilles/,street43:/Forty-third Street/,street50:/Fiftieth Street/,hempstead:/Hempstead/,southampton:/Southampton/,greenwich:/Greenwich/,albany:/Albany/};
for(const[id,re]of Object.entries(namedEvidence))for(const c of data.chapters)for(const r of c.citations.filter(r=>r.placeId===id))assert.match(r.excerpt.original.quote,re);
const translatedKeys=new Set(['title','text','note','description','status','method','help','sidebarTitle','sidebarNote','footerHtml','setting']);
function translations(value,key){if(Array.isArray(value)){for(const x of value)translations(x,key);return;}if(value&&typeof value==='object'){for(const[k,v]of Object.entries(value))translations(v,k);return;}if(typeof value==='string'&&(translatedKeys.has(key)||key==='placeText'))for(const l of ['en','it','fr','es'])assert.equal(typeof dictionary[l][value],'string',l+': '+value);}
translations(data);
assert.equal(dictionary.it['The Great Gatsby'],'Il grande Gatsby');assert.equal(dictionary.fr['The Great Gatsby'],'Gatsby le Magnifique');assert.equal(dictionary.es['The Great Gatsby'],'El gran Gatsby');
const home=fs.readFileSync('docs/index.html','utf8'),theme=fs.readFileSync('docs/book-themes.css','utf8');
assert.match(home,/href="atlas\.html\?book=gatsby"/);assert.match(home,/images\/gatsby-bellows-new-york\.jpg/);assert.match(theme,/html\[data-book="gatsby"\]/);
assert.ok(fs.statSync('docs/images/gatsby-bellows-new-york.jpg').size>10_000);
for(const file of ['docs/data/gatsby.js','docs/data/gatsby-i18n.js','docs/data/gatsby-original.json','docs/data/gatsby-audit.json','database/generated/gatsby/sql-editor/01-import.sql'])assert.equal(cp.spawnSync('git',['check-ignore','-q',file]).status,0,file+' must remain local');
assert.equal(cp.spawnSync('git',['ls-files','docs/data/gatsby*'],{encoding:'utf8'}).stdout.trim(),'');
console.log('PASS: Gatsby original quotations in nine chapters, action/mention distinctions, fictional-site uncertainty, geocoder disambiguation, four complete description languages and local-only data.');
