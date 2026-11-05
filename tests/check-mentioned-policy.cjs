const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const ctx={window:{}};
for(const file of ['mentioned-policy.js','csv-export.js'])vm.runInNewContext(fs.readFileSync('docs/'+file,'utf8'),ctx);
const policy=ctx.window.AtlasMentionPolicy;
for(const [locale,city] of Object.entries({en:'Moscow',it:'Mosca',fr:'Moscou',es:'Moscú'})){
 const section={id:1,title:'Chapter',places:['city','street','country'],placeText:['city scene','street scene','country scene'],placeCategories:{city:'mentioned',street:'mentioned',country:'mentioned'},placeExcerpts:{city:{original:{quote:'Moscow',language:'en'}}},citations:[{placeId:'city',category:'mentioned'},{placeId:'street',category:'mentioned'}],unlocatedPlaces:[{name:'Europe',category:'mentioned'},{name:'Europe',category:'action'}]};
 const action={...section,id:2,placeCategories:{city:'action',street:'action',country:'action'},citations:[{placeId:'city',category:'action'}]};
 const input={book:{id:'test'},places:{city:{name:city,coords:[1,2]},street:{name:'Londonbridge Road',coords:[2,3]},country:{name:'Country translated',excludedMentionReason:'country',coords:[3,4]}},chapters:[section,action],sourceChapters:[section,action]};
 const original=JSON.stringify(input),out=policy.apply(input);
 assert.equal(JSON.stringify(input),original,'archival input unchanged');
 assert.equal(out.chapters[0].places.join(','),'street');
 assert.equal(out.chapters[0].placeText.join(','),'street scene');
 assert.equal(out.chapters[0].citations.length,1);
 assert.equal(out.chapters[0].unlocatedPlaces.length,1);
 assert.equal(out.chapters[0].unlocatedPlaces[0].category,'action');
 assert.equal(out.chapters[1].places.length,3,'all action scenes preserved');
 assert.equal(out.chapters[1].citations.length,1);
 assert.equal(JSON.stringify(out.chapters),JSON.stringify(out.sourceChapters));
 const csv=ctx.window.atlasCsv.build(out,'citations',locale);
 assert.equal(csv.split('\r\n').filter(row=>row.includes(city)).length,1,'CSV keeps action occurrence only');
 assert(csv.includes('Londonbridge Road'));
 assert.equal(JSON.stringify(policy.apply(out)),JSON.stringify(out),'filter is idempotent');
}
console.log('Mention policy: categories, four languages, source sections, CSVs, preservation and idempotence OK');
