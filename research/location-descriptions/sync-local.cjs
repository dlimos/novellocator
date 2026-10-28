const fs=require('fs'),vm=require('vm');
const manifest=require('./release/manifest-20261027.json'),lolita=require('./release/lolita-manifest.json'),repairs=require('./release/source-corrections.json');
const before=require('./before.json');const target=__dirname+'/release/local-backups';fs.mkdirSync(target,{recursive:true});
const genericAreas=new Set(['Historical geography','Petersburg; recalled, imagined or distant places','Spain, Mediterranean and narrated worlds','Geographical reference','Named geographical area','Real site']);
for(const book of new Set([...manifest.map(p=>p.book),'holden','lolita'])){
 const file='docs/data/'+book+'.js',ctx={window:{}};vm.runInNewContext(fs.readFileSync(file,'utf8'),ctx);const data=ctx.window.atlasData;if(!fs.existsSync(target+'/'+book+'.js'))fs.copyFileSync(file,target+'/'+book+'.js');
 for(const patch of manifest.filter(p=>p.book===book)){const ref=before.place_references.find(r=>r.book_id===book&&r.id===patch.id),chapter=data.chapters.find(c=>c.id===ref.section_id);(chapter.placeNarrativeDescriptions??={})[patch.place]=patch.description;}
 for(const place of Object.values({...data.citedPlaces,...data.places}))if(genericAreas.has(place.area))place.area='';
 if(book==='anna-karenina'){const region=data.book.geographicReview.regionalPlaces.find(r=>r.id==='regional-pokrovskoe');region.narrativeDescriptions??={};for(const line of fs.readFileSync(__dirname+'/anna-regional.tsv','utf8').trim().split(/\r?\n/)){const [section,,...values]=line.split('|');region.narrativeDescriptions[section]={status:'reviewed',reviewedAt:'2026-10-27',texts:Object.fromEntries(['en','it','fr','es'].map((l,i)=>[l,values[i]]))};}}
 if(book==='lolita')for(const patch of lolita.patches){const ref=before.place_references.find(r=>r.book_id===book&&r.id===patch.id),chapter=data.chapters.find(c=>c.id===ref.section_id);(chapter.placeNarrativeDescriptions??={})[ref.place_id]=patch.description;}
 if(book==='holden')data.chapters.find(c=>c.id===2).placeCategories.yellowstone='mentioned';
 if(book==='crime-and-punishment')for(const correction of repairs.corrections){const chapter=data.chapters.find(c=>c.id===correction.section);chapter.placeCategories.haymarket=correction.category;const original=chapter.placeExcerpts.haymarket.original;original.quote=correction.quote;original.highlightTerms=['Сенной'];}
 fs.writeFileSync(file,'window.atlasData='+JSON.stringify(data,null,2)+';\n');
 if(book==='holden'||book==='lolita'){const dictFile='docs/data/'+book+'-i18n.js',dictionary={window:{}};vm.runInNewContext(fs.readFileSync(dictFile,'utf8'),dictionary);if(!fs.existsSync(target+'/'+book+'-i18n.js'))fs.copyFileSync(dictFile,target+'/'+book+'-i18n.js');const dict=dictionary.window.atlasTranslations;
  const translations=book==='lolita'?lolita.translations.map(t=>({language:t.language,source:t.source,translation:t.value})):require('./release/published-backup-translations.json');
  for(const t of translations)(dict[t.language]??={})[t.source]=t.translation;
  fs.writeFileSync(dictFile,'window.atlasTranslations='+JSON.stringify(dict,null,2)+';\n');
 }
 console.log(book+': local import backup synchronized');
}
{
 const file='docs/data/macondo-local.js',ctx={window:{}};vm.runInNewContext(fs.readFileSync(file,'utf8'),ctx);
 if(!fs.existsSync(target+'/macondo-local.js'))fs.copyFileSync(file,target+'/macondo-local.js');
 for(const line of fs.readFileSync(__dirname+'/macondo.tsv','utf8').trim().split(/\r?\n/)){
  const [section,place,...values]=line.split('|');
  const geo=ctx.window.atlasIllustratedLocal.geographicPlaces[place];
  (geo.chapterScenes??={})[section]=Object.fromEntries(['en','it','fr','es'].map((l,i)=>[l,values[i]]));
 }
 fs.writeFileSync(file,'window.atlasIllustratedLocal='+JSON.stringify(ctx.window.atlasIllustratedLocal,null,2)+';\n');
 console.log('macondo: local import backup synchronized');
}
