const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const ctx={window:{}};for(const suffix of ['','-i18n'])vm.runInNewContext(fs.readFileSync(`docs/data/anna-karenina${suffix}.js`,'utf8'),ctx);
const d=ctx.window.atlasData,dict=ctx.window.atlasTranslations,a=require('./analysis.json'),corpus=require('./sections.json');
// Use the actual browser highlighter, including its Unicode word-boundary handling.
const app=fs.readFileSync('docs/app.js','utf8');
const quoteCode=app.slice(app.indexOf('function quoteNameKey'),app.indexOf('const excerptLanguageNames'));
const highlightCtx={window:{atlasTranslations:{}},esc:value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')};
vm.createContext(highlightCtx);vm.runInContext(quoteCode,highlightCtx);
assert.equal(d.chapters.length,239);assert.deepEqual(a.structure.parts,[34,35,32,23,33,32,31,19]);
let mapped=0,unlocated=0;
for(const c of d.chapters){const s=corpus[c.id-1],section=a.sections[c.id-1];assert.equal(section.sha256,crypto.createHash('sha256').update(s.text).digest('hex'));
 function evidence(q,location=true){assert.equal(q.language,'ru');assert(s.text.includes(q.quote),`Wrong-section or altered quote ${c.id}`);assert.equal(q.url,s.url);assert(q.edition.includes('ПСС'));if(location){assert(q.highlightTerms.length);for(const term of q.highlightTerms){assert(q.quote.includes(term),`Missing highlight ${c.id}/${term}`);highlightCtx.q=q.quote;highlightCtx.term=term;assert(vm.runInContext('renderQuote(q,[],[term])',highlightCtx).includes('<strong class="quote-place">'),`Term does not render in bold ${c.id}/${term}`);}}}
 evidence(c.excerpts.original,false);
 for(const id of c.places){evidence(c.placeExcerpts[id].original);assert(d.places[id]);assert(['action','mentioned'].includes(c.placeCategories[id]));const r=section.references.find(r=>r.id===id);assert(r&&r.reason&&r.quote===c.placeExcerpts[id].original.quote);assert.equal(r.category,c.placeCategories[id]);mapped++;}
 for(const u of c.unlocatedPlaces){evidence(u);assert(!Object.hasOwn(u,'coords'));assert(u.narrativeReason);const r=section.references.find(r=>r.id===u.id);assert(r&&r.quote===u.quote);assert.equal(r.category,u.category);unlocated++;}
 for(const l of ['en','it','fr','es'])for(const key of [c.title,c.text,c.note,...c.placeText,...c.unlocatedPlaces.map(u=>u.name)])assert(dict[l][key],l+': '+key);
}
assert.equal(mapped,a.counts.mappedReferences);assert.equal(unlocated,a.counts.unlocatedReferences);
assert.equal(d.chapters[8].placeCategories.england,undefined);assert(d.chapters[8].unlocatedPlaces.some(u=>u.id==='england-restaurant'));
for(const id of ['pokrovskoe','ergushovo','vozdvizhenskoe','kashin','italian-city','provincial-hotel','darmstadt'])assert(!d.places[id],'Unjustified coordinates: '+id);
assert(d.places.rhine.coords[1]>0&&d.places.rhine.coords[1]<15,'American Rhine homonym');
for(const sid of [148,150,151])assert(!d.chapters[sid-1].places.includes('nevsky'),'Order confused with street');
assert.equal(d.chapters[130].placeCategories.venice,'mentioned');assert.equal(d.chapters[130].placeCategories.rome,'mentioned');
const preview=JSON.parse(fs.readFileSync('database/generated/anna-karenina/presentation.json','utf8'));assert(preview.css.includes('data:image/svg+xml'));assert(preview.artwork_documentation.includes('not a claim'));
const result={checkedAt:'2026-10-12',sections:239,mappedReferences:mapped,unlocatedReferences:unlocated,literalRussianEvidence:true,highlightTerms:true,sectionHashes:true,conservativeCategories:true};
fs.writeFileSync('research/anna-karenina/verification.json',JSON.stringify(result,null,2)+'\n');console.log('PASS: '+JSON.stringify(result));
