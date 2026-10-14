const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const harness={require,console,URL,URLSearchParams,module:{exports:{}}};
vm.runInNewContext(fs.readFileSync('tests/check-global-view.cjs','utf8').split("for(const id of ['ulisse'")[0]+'module.exports=setup;',harness);
for(const locale of ['en','it','fr','es']){
 const {ctx}=harness.module.exports('crime-and-punishment',locale);
 const run=s=>vm.runInContext(s,ctx);
 const html=run("renderExcerpts(chapters[0].placeExcerpts.stolyarny,'Passage from the novel',[literaryPlaces.stolyarny])");
 for(const language of ['ru','en','fr'])assert.ok(html.includes(`value="${language}"`));
 assert.ok(!html.includes('value="it"')&&!html.includes('disabled aria-disabled'));
 const id=html.match(/data-quotation-id="(\d+)"/)[1],body={},summary={};
 const select={dataset:{quotationId:id},value:'fr',closest:()=>({querySelector:s=>s==='summary'?summary:body})};
 ctx.pickerTest=select;run('changeQuotationLanguage(pickerTest)');
 assert.ok(body.innerHTML.includes('lang="fr"')&&body.innerHTML.includes('Victor Derély'));
 assert.ok(!body.innerHTML.includes('lang="en"')&&!body.innerHTML.includes('lang="ru"'));
 assert.ok(body.innerHTML.includes('quote-place')&&!body.innerHTML.includes('href='));
 select.value='ru';run('changeQuotationLanguage(pickerTest)');
 assert.ok(body.innerHTML.includes('lang="ru"'));
 select.value='en';run('changeQuotationLanguage(pickerTest)');
 assert.ok(body.innerHTML.includes('Constance Garnett'));
 assert.equal(run('locale'),locale,'Quotation choices do not change the site language');
 const solo=run("renderExcerpts({original:{quote:'Москва',language:'ru',type:'original',attribution:'Tolstoj'}},'Passage from the novel')");
 assert.ok(solo.includes('disabled aria-disabled="true"'));
 assert.equal((solo.match(/<option /g)||[]).length,1);
 assert.equal(run("renderExcerpts({original:{quote:' ',language:'ru'}},'Passage from the novel')"),'');
 const filtered=run("renderExcerpts({original:{quote:'Москва',language:'ru',type:'original'},translations:{it:{quote:'invented',language:'it',verificationStatus:'rejected'}}},'Passage from the novel')");
 assert.ok(!filtered.includes('invented')&&!filtered.includes('value="it"'));
}
console.log('PASS: per-quotation language choices in all four interface locales, switching text/credits/highlights, read-only single language, excluded rejected passages and no novel links.');
