const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const harness={require,console,URL,URLSearchParams,module:{exports:{}}};
vm.runInNewContext(fs.readFileSync('tests/check-global-view.cjs','utf8').split("for(const id of ['ulisse'")[0]+'module.exports=setup;',harness);
for(const locale of ['en','it','fr','es']){
 const {ctx,elements}=harness.module.exports('ulisse',locale);
 vm.runInContext("selectChapter(0,false);selectPlace(chapters[0].places.indexOf('tower'),false)",ctx);
 const html=elements['selected-location'].innerHTML;
 assert.ok(html.includes('location-position'),locale+' tower description');
 assert.doesNotMatch(html,/location-evidence|WGS84|RPS 1027|Sources checked/);
 assert.ok(!html.includes('<details'));
 vm.runInContext("renderLocation({target:document.getElementById('map-popup-content')})",ctx);
 assert.ok(elements['map-popup-content'].innerHTML.includes('location-position'));
 assert.doesNotMatch(elements['map-popup-content'].innerHTML,/location-evidence|WGS84|RPS 1027/);
}
console.log('PASS: tower description visible in four languages in card and popup, without coordinates and source panel.');
