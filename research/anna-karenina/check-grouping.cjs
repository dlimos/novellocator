const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctx={window:{},URL,URLSearchParams,AbortController,setTimeout,clearTimeout};vm.createContext(ctx);
for(const file of ['docs/data/anna-karenina.js','docs/data/anna-karenina-i18n.js','docs/supabase-data.js','docs/csv-export.js'])vm.runInContext(fs.readFileSync(file,'utf8'),ctx);
const source=ctx.window.atlasData,before=JSON.stringify(source),grouped=ctx.window.atlasSupabaseData.groupSections(source);
assert.equal(grouped.chapters.length,8);assert.equal(grouped.book.unit,'Part');assert.equal(grouped.book.hashPrefix,'part');
assert.equal(JSON.stringify(source),before,'Grouping must not modify original evidence');
assert.deepEqual(Array.from(grouped.chapters,c=>c.sourceSectionIds.length),[34,35,32,23,33,32,31,19]);
assert.equal(new Set(grouped.chapters.flatMap(c=>c.sourceSectionIds)).size,239);
assert.equal(grouped.sourceChapters.length,239);
for(const part of grouped.chapters){
 assert.equal(new Set(part.places).size,part.places.length,'No overlapping duplicate markers');
 for(const id of part.places){const refs=part.placeOccurrences[id];assert(refs.length);assert(grouped.places[id]);assert(refs.some(r=>r.excerpt===part.placeExcerpts[id]));
  if(part.placeCategories[id]==='action')assert(refs.some(r=>r.category==='action'&&r.excerpt===part.placeExcerpts[id]&&r.excerpt.original.quote));
  else assert(!refs.some(r=>r.category==='action'&&r.excerpt?.original?.quote));
 }
 for(const item of part.unlocatedPlaces)assert(item.displayInAtlas!==false&&item.occurrences.length);
 for(const lang of ['en','it','fr','es'])assert(ctx.window.atlasTranslations[lang][part.text]&&ctx.window.atlasTranslations[lang][part.title],lang+' introduction');
}
assert.equal(grouped.chapters[0].placeCategories.moscow,'action');
assert(grouped.chapters[0].placeExcerpts.moscow.original.attribution.includes('глава VII'),'Action proof must not come from earlier biographical mention');
assert(grouped.places['regional-pokrovskoe'],'Keep the existing regional review');
assert.equal(grouped.chapters[7].placeCategories['regional-pokrovskoe'],'action','VIII.VI regional action remains action');
assert(!grouped.chapters.flatMap(c=>c.unlocatedPlaces).some(u=>u.id==='oblonsky-house'),'Keep reviewed visibility decisions');
for(const lang of ['en','it','fr','es'])for(const kind of ['places','citations'])assert.equal(ctx.window.atlasCsv.build(grouped,kind,lang),ctx.window.atlasCsv.build(source,kind,lang),'Every original chapter quotation remains in the CSV');
assert.equal(ctx.window.atlasSupabaseData.groupSections({...source,book:{...source.book,sectionGrouping:undefined}}).chapters,source.chapters,'Ungrouped novels stay intact');
console.log('PASS: eight parts, 239 retained chapter records, scene-specific categories/evidence, regional review, four-language introductions and exact detailed CSVs.');
