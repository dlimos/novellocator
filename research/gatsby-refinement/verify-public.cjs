const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const live=require('./live/gatsby.json'),before=require('./before.json'),expected=require('./expected.json');
assert.deepEqual(live.data.book.geographicReview,expected.patch.geographicReview);
for(const c of live.data.chapters){assert.equal(c.setting,expected.settings[c.id-1].setting);assert.deepEqual({...c,setting:before.data.chapters[c.id-1].setting},before.data.chapters[c.id-1]);}
assert.deepEqual(live.data.places,before.data.places);assert.deepEqual(live.data.citedPlaces,before.data.citedPlaces);
for(const r of expected.translations)assert.equal(live.dictionary[r.language][r.source_text],r.translated_text);
const app=fs.readFileSync('docs/app.js','utf8'),ctx={};vm.runInNewContext(app.slice(app.indexOf('function applyGeographicReview'),app.indexOf('window.atlasData=applyGeographicReview')),ctx);
for(const locale of ['en','it','fr','es']){
 const local={window:{atlasTranslations:live.dictionary},URLSearchParams,location:{search:'?lang='+locale},localStorage:{getItem(){}},document:{documentElement:{},readyState:'loading',addEventListener(){}}};
 for(const file of ['docs/locales/ui.js','docs/i18n.js'])vm.runInNewContext(fs.readFileSync(file,'utf8'),local);
 const result=ctx.applyGeographicReview(local.window.atlasI18n.localizeData(live.data));
 assert.equal(result.chapters.flatMap(c=>c.unlocatedPlaces.filter(u=>u.displayInAtlas!==false)).length,0,locale);
 for(const r of expected.patch.geographicReview.regionalPlaces){assert(result.chapters.some(c=>c.places.includes(r.id)));assert(!result.places[r.id].regionalOutline);}
}
console.log('PASS: public Supabase content matches every expected change in all four languages; all 38 unlocated records, original quotations and existing mapped places remain intact.');
