const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=require('node:path').resolve(__dirname,'../research/editorial-translations');
const rows=JSON.parse(fs.readFileSync(root+'/patch.json','utf8'));
const live=process.argv.includes('--live');
function local(id){const c={window:{}};for(const suffix of ['', '-i18n'])vm.runInNewContext(fs.readFileSync(`docs/data/${id}${suffix}.js`,'utf8'),c);return{data:c.window.atlasData,dictionary:c.window.atlasTranslations};}
for(const id of new Set(rows.map(r=>r.book_id))){
 const payload=live?JSON.parse(fs.readFileSync(`${root}/${id}-after.json`,'utf8')):local(id);
 for(const r of rows.filter(r=>r.book_id===id))assert.equal(payload.dictionary[r.language]?.[r.source_text],r.translated_text,`${id}/${r.language}: ${r.source_text}`);
 // Exercise the real browser localizer, including HTML and the protected quotation fields.
 for(const lang of ['it','fr','es']){
  const c={window:{atlasLocaleData:{defaultLocale:'it',languages:[{id:lang}],messages:{it:{},[lang]:{}}},atlasTranslations:payload.dictionary},location:{search:'?lang='+lang},localStorage:{getItem(){}},URLSearchParams,document:{documentElement:{},readyState:'loading',addEventListener(){}}};
  vm.runInNewContext(fs.readFileSync('docs/i18n.js','utf8'),c);
  const result=c.window.atlasI18n.localizeData(payload.data);
  if(id==='sound-and-fury'){
   assert.equal(result.chapters.flatMap(x=>x.placeText).length,31);
   result.chapters.forEach((chapter,i)=>{
    assert.notEqual(chapter.time,payload.data.chapters[i].time);
    assert.notEqual(chapter.people,payload.data.chapters[i].people);
    chapter.placeText.forEach((text,j)=>assert.notEqual(text,payload.data.chapters[i].placeText[j]));
   });
  }
  if(id==='wuthering-heights')for(const p of Object.values({...result.places,...result.citedPlaces}))assert.ok(!p.note.startsWith('A named geographical reference.'),p.name);
  if(['anna-karenina','crime-and-punishment'].includes(id)){assert.notEqual(result.book.footerHtml,payload.data.book.footerHtml);assert.match(result.book.footerHtml,/^<p>[^<]+<\/p>$/);}
  const original={quote:'Greece and Italy',attribution:'Original edition',highlightTerms:['Greece']};assert.deepEqual(JSON.parse(JSON.stringify(c.window.atlasI18n.localizeData(original))),original);
 }
 if(live){const before=JSON.parse(fs.readFileSync(`${root}/${id}-before.json`,'utf8'));assert.deepEqual(payload.data,before.data,`${id}: narrative data and quotations unchanged`);}
}
console.log(`PASS: ${rows.length} editorial translations, full scene/badge coverage, HTML, toponyms and quotation preservation (${live?'public database':'local backups'}).`);
