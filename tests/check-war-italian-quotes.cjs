const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm');
const records=JSON.parse(fs.readFileSync('research/translations/verified/war-and-peace.json','utf8'));
const source=JSON.parse(fs.readFileSync('research/translations/corpus/war-and-peace-verdinois-paragraphs.json','utf8'));
for(const r of records){
 assert.ok(source[r.sourceParagraph].includes(r.passage.quote),`Non-literal source text: ${r.section}/${r.id}`);
 assert.ok(r.originalQuote&&r.alignment&&r.rightsNote);
 assert.ok(r.passage.translator&&r.passage.publisher&&r.passage.edition);
 for(const term of r.passage.highlightTerms)assert.ok(r.passage.quote.includes(term));
}
const harness={require,console,URL,URLSearchParams,module:{exports:{}}};
vm.runInNewContext(fs.readFileSync('tests/check-global-view.cjs','utf8').split("for(const id of ['ulisse'")[0]+'module.exports=setup;',harness);
const {ctx,elements}=harness.module.exports('war-and-peace','it');
const run=s=>vm.runInContext(s,ctx);
run('selectChapter(0,false,false);selectPlace(0,false)');
let html=elements['selected-location'].children.at(-1).innerHTML;
assert.ok(html.includes('lang="ru"'));
assert.ok(!html.includes('value="it"')&&!html.includes('<strong class="quote-place">Anna Scherer</strong>'));
run('selectPlace(3,false);renderLocation({target:document.getElementById("map-popup-content")})');
html=elements['map-popup-content'].children.map(c=>c.innerHTML).join('');
assert.ok(html.includes('<strong class="quote-place">Montecalvo</strong>'));
assert.ok(html.includes('capitolo XXII'));
console.log(`PASS: ${records.length} literal Verdinois passages, preserved source forms and credits, Italian-only rendering and popup highlighting.`);
