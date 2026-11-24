const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctx={window:{}};
vm.runInNewContext(fs.readFileSync('docs/content-adapter.js','utf8'),ctx);
const book='sound-and-fury',sourceId=(lang)=>'src-'+lang;
const sources=['en','it','es'].map(lang=>({book_id:book,id:sourceId(lang),url:'https://example.test/'+lang,label:null,metadata:{}}));
const example=(id,section,referenceId,lang,slot,quote,metadata={})=>({
 book_id:book,id,section_id:section,reference_id:referenceId,slot,language:lang,
 type:lang==='en'?'original':'translation',quote,attribution:'William Faulkner · '+lang,
 text_source_id:sourceId(lang),rights_source_id:sourceId(lang),metadata
});
const excerpts=[
 ...['GATE','REGIONAL'].flatMap(kind=>[
  example('rf:RF-01-'+kind+':en',1,null,'en','rf:RF-01-'+kind+':en',kind+' original'),
  example('rf:RF-01-'+kind+':it',1,null,'it','rf:RF-01-'+kind+':it',kind+' italiano'),
  example('rf:RF-01-'+kind+':es',1,null,'es','rf:RF-01-'+kind+':es',kind+' español')
 ]),
 example('1:cited:city:original',1,'1:cited:city','en','original','old, longer English quotation',{
  geoCitationTransferRev23:{referenceId:'RF-01-CITY',shortEnglishFromWorkbook:'selected city passage'}}),
 example('1:cited:city:it',1,'1:cited:city','it','it','città tradotta'),
 example('1:cited:city:es',1,'1:cited:city','es','es','ciudad traducida')
];
const pack=(kind)=>({
 section:1,placeIdWorkbook:kind==='REGIONAL'?'PL-JEFFERSON':'PL-GATE',
 englishExcerptId:'rf:RF-01-'+kind+':en',italianExcerptId:'rf:RF-01-'+kind+':it',
 spanishExcerptId:'rf:RF-01-'+kind+':es',
 shortOriginal:kind+' original',shortItalian:kind+' italiano',shortSpanish:kind+' español'
});
const bundle={formatVersion:1,tables:{
 books:[{id:book,title:'The Sound and the Fury',author:'William Faulkner',metadata:{
  geoReconciliationRev22:{references:[
   {refId:'RF-01-GATE',target:'unlocated_settings',section:1,ordinal:0},
   {refId:'RF-01-REGIONAL',target:'books.metadata.geographicReview.regionalPlaces'},
   {refId:'RF-01-CITY',target:'place_references',section:1,placeId:'city',collection:'cited'}
  ]},
  geoCitationTransferRev23:{citations:{'RF-01-GATE':pack('GATE'),'RF-01-REGIONAL':pack('REGIONAL')}}
 }}],
 sections:[{book_id:book,id:1,ordinal:0,title:'April Seventh, 1928',metadata:{},legacy_fields:[
  'places','placeText','citations','placeCategories','placeSources','placeExcerpts','unlocatedPlaces'
 ]}],
 sources,places:[],place_descriptions:[],
 place_references:[{book_id:book,id:'1:cited:city',section_id:1,place_id:'city',collection:'cited',ordinal:0,category:'mentioned',scene_text:null,metadata:{}}],
 excerpts,
 unlocated_settings:[{book_id:book,section_id:1,ordinal:0,name:'Compson gate',description:'The gate by the house.',quote:'Old contextual passage',source_id:sourceId('en'),metadata:{}}],
 content_translations:[]
}};
const {data}=ctx.window.atlasContent.reconstruct(bundle,book);
const section=data.chapters[0],curated=section.unlocatedPlaces.filter(p=>p.rev23Multilingual);
assert.equal(curated.length,2,'unmapped and regional references must both be presented');
assert.equal(section.unlocatedPlaces.length,3,'keep the original analysis row untouched');
const gate=curated.find(p=>p.referenceId==='RF-01-GATE');
assert.equal(gate.name,'Compson gate');assert.equal(gate.text,'The gate by the house.');
for(const [lang,quote]of [['en','GATE original'],['it','GATE italiano'],['es','GATE español']]){
 const p=lang==='en'?gate.excerpt.original:gate.excerpt.translations[lang];
 assert.equal(p.quote,quote);assert.equal(p.language,lang);assert.equal(p.url,'https://example.test/'+lang);
}
assert(curated.some(p=>p.referenceId==='RF-01-REGIONAL'&&p.name==='Jefferson'));
assert.equal(section.citations[0].excerpt.original.quote,'selected city passage','display the same English selection as the translation pair');
assert.equal(excerpts[6].quote,'old, longer English quotation','never alter the stored original');
const app=fs.readFileSync('docs/app.js','utf8');
assert.match(app,/item\.rev23Multilingual===true/,'only curated references should bypass analysis-only');
assert.match(app,/item\.excerpt\?\.original\?\.quote/,'only populated references should appear');
const noTransfer=JSON.parse(JSON.stringify(bundle));
noTransfer.tables.books[0].metadata={};
assert.equal(ctx.window.atlasContent.reconstruct(noTransfer,book).data.chapters[0].unlocatedPlaces.length,1,'no forced exposure without audited data');
console.log('PASS: Faulkner REV23 English/Italian/Spanish excerpts and the regional/unlocated presentation.');
