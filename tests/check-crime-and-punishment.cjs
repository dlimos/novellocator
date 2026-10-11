const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),crypto=require('crypto');
const ctx={window:{}};for(const f of ['docs/data/crime-and-punishment.js','docs/data/crime-and-punishment-i18n.js'])vm.runInNewContext(fs.readFileSync(f,'utf8'),ctx);
const d=ctx.window.atlasData,dict=ctx.window.atlasTranslations,a=require('../research/crime-and-punishment/analysis.json'),corpus=require('../work/crime-and-punishment/sections.json');
assert.equal(d.chapters.length,41);assert.deepEqual(a.structure.parts,[7,7,6,6,5,8]);assert.equal(a.structure.epilogueChapters,2);assert.equal(a.missingScenes.length,0);assert(a.structure.characters>900000);
let associations=0;
for(const c of d.chapters){const s=corpus[c.id-1];assert.equal(a.sections[c.id-1].sha256,crypto.createHash('sha256').update(s.text).digest('hex'));
 function evidence(e){assert.equal(e.language,'ru');assert(e.quote&&s.text.includes(e.quote),'Wrong-section or invented quote: '+c.id);assert.equal(e.url,s.url);assert(e.edition.includes('print edition not identified'));}
 evidence(c.excerpts.original);
 for(const id of c.places){assert(d.places[id]);evidence(c.placeExcerpts[id].original);associations++;}
 for(const r of c.citations){assert(d.citedPlaces[r.placeId]);evidence(r.excerpt.original);associations++;}
 for(const u of c.unlocatedPlaces){evidence(u);assert(!Object.hasOwn(u,'coords'));associations++;}
 for(const l of ['en','it','fr','es'])for(const v of [c.title,c.text,c.note,...c.unlocatedPlaces.map(u=>u.name)])assert(dict[l][v],l+': '+v);
}
assert.equal(associations,312);
for(const id of ['garret','moneylender','adrianople','sonya','police','new-jerusalem','irtysh'])assert(!d.places[id],'Invented coordinate: '+id);
assert(!d.chapters[18].citations.some(r=>r.placeId==='jerusalem'));assert(d.chapters[18].unlocatedPlaces.some(u=>u.id==='new-jerusalem'));
assert(d.chapters[38].citations.some(r=>r.placeId==='jerusalem'));assert(d.chapters[39].unlocatedPlaces.some(u=>u.id==='penal'));assert(d.chapters[40].unlocatedPlaces.some(u=>u.id==='riverbank'));
for(const l of ['en','it','fr','es'])for(const k of ['places','citations'])assert(fs.readFileSync(`docs/crime-and-punishment-${k}-${l}.csv`,'utf8').includes('wikisource.org'));
console.log('PASS: Crime and Punishment, 41 complete Russian sections, 312 literal section–place associations, translations and disputed geography.');
