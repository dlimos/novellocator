const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const harness={require,console,URL,URLSearchParams,module:{exports:{}}};
vm.runInNewContext(fs.readFileSync('tests/check-global-view.cjs','utf8').split("for(const id of ['ulisse'")[0]+'module.exports=setup;',harness);
for(const locale of ['en','it','fr','es']){
 const {ctx,elements}=harness.module.exports('crime-and-punishment',locale);
 const run=code=>vm.runInContext(code,ctx);
 run('selectChapter(0,false,false);selectPlace(0,false)');
 const html=elements['selected-location'].children.at(-1).innerHTML;
 if(['en','fr'].includes(locale)){
  assert.match(html,new RegExp('lang="'+locale+'"'));
  assert.ok(html.includes(locale==='fr'?'Victor Derély':'Constance Garnett'));
  assert.ok(html.includes('<strong class="quote-place">'));
  assert.ok(!html.includes('lang="ru"'));
 }else{assert.ok(html.includes('lang="ru"'));assert.ok(html.includes(ctx.window.atlasI18n.t('Original text')));assert.ok(html.includes(run('esc(chapters[0].placeExcerpts[chapters[0].places[0]].original.attribution)')));}
 run("renderLocation({target:document.getElementById('map-popup-content')})");
 const popup=elements['map-popup-content'].children.map(c=>c.innerHTML).join('');
 assert.ok(popup.includes('<blockquote'));assert.equal(popup.includes('lang="ru"'),!['en','fr'].includes(locale));
 run('renderDetail()');
 const unlocated=elements['selected-location'].parentElement.children.at(-1).innerHTML;
 assert.ok(unlocated.includes('<blockquote'));
 assert.ok(unlocated.includes('lang="ru"'));
 assert.equal(run("renderExcerpts(null,'Passage from the novel')"),'');
 assert.equal(run("renderExcerpts({original:{quote:'   ',language:'ru'}},'Passage from the novel')"),'');
 assert.equal(run("selectedPassage({original:{quote:'Original',language:'ru'},translations:{[locale]:{quote:' ',language:locale}}}).quote"),'Original');
}
// Each imported passage is a literal substring of its archived consulted source.
const records=JSON.parse(fs.readFileSync('research/translations/verified/crime-and-punishment.json','utf8'));
const normalize=s=>s.replace(/L\d+: /g,'').replace(/\s+/g,' ').trim();
for(const record of records){
 const source=fs.readFileSync(`research/translations/corpus/crime-${record.language}-${record.language==='en'?1:record.section}-web.txt`,'utf8');
 assert.ok(normalize(source).includes(normalize(record.passage.quote)),`${record.section}/${record.id}/${record.language}: source mismatch`);
 assert.ok(record.originalQuote&&record.alignment&&record.rightsNote);
 assert.ok(record.passage.translator&&record.passage.publisher&&record.passage.edition);
}
console.log(`PASS: ${records.length} source-checked translations; selected-language text, credits and highlights in details, popups and unlocated settings; authentic original-language fallback and no empty quotation notices.`);
