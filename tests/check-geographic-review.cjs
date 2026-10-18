const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('docs/app.js','utf8').split('window.atlasData=applyGeographicReview')[0];
const functions={};vm.createContext(functions);vm.runInContext(source,functions);
const review=functions.applyGeographicReview;
const metadata=JSON.parse(fs.readFileSync('research/location-visibility/review/metadata.json','utf8'));
let regions=0,associations=0;
for(const [id,record]of Object.entries(metadata)){
 const input={window:{}};vm.runInNewContext(fs.readFileSync('docs/data/'+id+'.js','utf8'),input);
 const canonical=input.window.atlasData,original=JSON.stringify(canonical);
 const result=review(canonical);assert.equal(JSON.stringify(canonical),original,'review must not alter imported analysis');
 if(id==='sound-and-fury')for(const sectionId of [2,5])assert.equal(result.chapters.find(c=>c.id===sectionId).placeExcerpts['regional-jefferson'].original.quote,canonical.chapters.find(c=>c.id===sectionId).unlocatedPlaces.find(u=>u.id==='jefferson').quote,'mentions must retain the direct town evidence, not an unrelated interior fragment');
 assert.equal(result.chapters.length,canonical.chapters.length);
 assert.equal(result.chapters.reduce((n,c)=>n+(c.unlocatedPlaces||[]).length,0),canonical.chapters.reduce((n,c)=>n+(c.unlocatedPlaces||[]).length,0));
 assert.equal(JSON.stringify(review(result)),JSON.stringify(result),'review is idempotent');
 for(const c of result.chapters){assert.equal(c.places.length,new Set(c.places).size);assert.equal(c.places.length,c.placeText.length);for(const u of c.unlocatedPlaces||[])if(record.hiddenUnlocatedKeys.includes(u.id||u.name))assert.equal(u.displayInAtlas,false);}
 for(const r of record.regionalPlaces){
  regions++;assert.equal(result.places[r.id].kind,'uncertain');assert.deepEqual(Array.from(result.places[r.id].coords),r.place.coords);
  assert(result.chapters.some(c=>c.places.includes(r.id)));
  for(const c of result.chapters.filter(c=>c.places.includes(r.id))){associations++;assert.equal(c.placeCategories[r.id],r.categories[c.id]||'mentioned');assert(c.unlocatedPlaces.some(u=>u.mappedPlaceId===r.id&&u.displayInAtlas===false));
   const q=c.placeExcerpts[r.id]?.original;if(q)assert(canonical.chapters.find(x=>x.id===c.id).unlocatedPlaces.some(u=>u.quote===q.quote||u.excerpt?.original?.quote===q.quote),'only authentic existing evidence may be used');
  }
 }
 for(const lang of ['en','it','fr','es']){
  const ctx={window:{},URLSearchParams,location:{search:'?lang='+lang},localStorage:{getItem(){}},document:{documentElement:{},readyState:'loading',addEventListener(){}}};
  for(const file of ['docs/locales/ui.js','docs/data/'+id+'-i18n.js','docs/i18n.js'])vm.runInNewContext(fs.readFileSync(file,'utf8'),ctx);
  const localized=review(ctx.window.atlasI18n.localizeData(canonical));
  for(const r of record.regionalPlaces)for(const field of ['name','area','status','note','method']){
   assert.equal(localized.places[r.id][field],ctx.window.atlasTranslations[lang]?.[r.place[field]]||r.place[field]);
   if(lang!=='en')assert(ctx.window.atlasTranslations[lang]?.[r.place[field]],'regional UI translation missing '+id+'/'+field+'/'+lang);
  }
  const expectedHidden=result.chapters.flatMap(c=>c.unlocatedPlaces||[]).filter(u=>u.displayInAtlas===false).length;
  assert.equal(localized.chapters.flatMap(c=>c.unlocatedPlaces||[]).filter(u=>u.displayInAtlas===false).length,expectedHidden,'name-based exclusions must survive localization');
 }
}
assert.equal(regions,25);
const s={window:{}};for(const file of ['docs/data/macondo-local.js','docs/fictional-atlas-adapter.js','docs/fictional-map.js'])vm.runInNewContext(fs.readFileSync(file,'utf8'),s);
for(const lang of ['en','it','fr','es']){
 const mapped=review(s.window.IllustratedAdapter.adapt(s.window.atlasIllustratedLocal,lang));
 const p=mapped.places['regional-town'];assert.equal(p.kind,'area');assert(p.geographic);assert(p.name.includes('Aracataca'));assert(p.method.includes('FINDETER'));assert(Math.abs(p.coords[0]-10.592778)<.000001);assert(Math.abs(p.coords[1]+74.190556)<.000001);assert.equal(s.FictionalMap.symbol({kind:p.kind,role:'mentioned'}).style,'diamond');
 assert(mapped.chapters.flatMap(c=>c.unlocatedPlaces||[]).filter(u=>u.id==='lab').every(u=>u.displayInAtlas===false));
 assert.equal(mapped.chapters[0].placeExcerpts['regional-town'].original.highlightTerms[0],'Macondo');
 assert.equal(Object.values(mapped.places).filter(p=>!p.geographic).length,29);
}
console.log(`PASS: ${regions+1} reviewed regional diamonds; ${associations} section references; original analysis untouched, no duplicate points per section, pending original quotations preserved, four languages and illustrated geography.`);
