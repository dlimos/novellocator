const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const context={window:{}};vm.runInNewContext(fs.readFileSync('docs/reading-diagram.js','utf8'),context);
const config=JSON.parse(fs.readFileSync('research/sound-and-fury/reading-diagram.json','utf8'));
const map=context.window.ReadingDiagram,book={id:'sound-and-fury',originalLanguage:'en',readingDiagram:config};
const chapters=[
 {id:1,unlocatedPlaces:[{id:'house',name:'House',category:'action',quote:'We ran to the house.'},{id:'cemetery',category:'mentioned',quote:'We are going to the cemetery.'},{id:'swing',category:'mentioned',quote:'Go to the swing.'},{id:'barn',category:'action',quote:'Barn.',verificationStatus:'pending'}]},
 {id:3,unlocatedPlaces:[{id:'house',category:'mentioned',quote:'The house.'},{id:'store',category:'action',quote:'I can quit the store.'},{id:'square',category:'action',quote:'Poison in the square.'}]},
 {id:5,unlocatedPlaces:[{id:'house',category:'action',quote:'the house to'}]}
];
const before=JSON.stringify(chapters),plain=x=>JSON.parse(JSON.stringify(x));
const records=map.collect(chapters,1,'compson',book);
assert.deepEqual(plain(records.map(x=>[x.id,x.role])),[['house','action'],['swing','mentioned']]);
assert.equal(map.collect(chapters,1,'jefferson',book).find(p=>p.id==='cemetery').role,'mentioned');
assert.equal(map.collect(chapters,3,'jefferson',book).find(p=>p.id==='store').role,'mentioned');
assert.equal(map.collect(chapters,5,'compson',book)[0].role,'mentioned');
assert.equal(map.collect(chapters,null,'compson',book).find(p=>p.id==='house').occurrences.length,3);
for(const [layers,expected]of [[{action:true,mentioned:true},['1','C1']],[{action:false,mentioned:true},['C1']],[{action:true,mentioned:false},['1']],[{action:false,mentioned:false},[]]])assert.deepEqual(plain(map.visibleRecords(records,layers).map(p=>p.number)),expected);
assert.equal(JSON.stringify(chapters),before,'view must not mutate imported evidence');
assert.equal(map.create({book:{id:'ulisse'}}),null,'other novels unaffected');
for(const locale of ['it','en','fr','es'])assert.equal(config.messages[locale].length,11);
for(const locale of ['it','en','fr','es'])for(const layout of Object.values(config.layouts))for(const id of Object.keys(layout.positions)){
 assert.ok(config.names[locale][id]?.trim(),locale+':'+id+' name');
 assert.ok(config.notes[locale][id]?.trim(),locale+':'+id+' note');
}
assert.deepEqual(plain(Object.keys(config.layouts)),['compson','jefferson']);
console.log('PASS: Faulkner diagrams keep evidence identities, exclude pending originals, use conservative categories, renumber visible layers, separate appendix and provide four UI languages.');
(async()=>{
 const {PGlite}=require('@electric-sql/pglite'),db=new PGlite();
 await db.exec("create table public.books(id text primary key,metadata jsonb); insert into public.books values ('sound-and-fury','{\"sentinel\":\"preserved\"}'),('other','{\"sentinel\":\"untouched\"}');");
 const sql=fs.readFileSync('research/sound-and-fury/publish-diagram.sql','utf8');
 await db.exec(sql);await db.exec(sql);
 const {rows}=await db.query('select id,metadata from public.books order by id');
 assert.deepEqual(rows[0],{id:'other',metadata:{sentinel:'untouched'}});
 assert.equal(rows[1].metadata.sentinel,'preserved');assert.deepEqual(rows[1].metadata.readingDiagram,config);
 await db.close();console.log('PASS: diagram metadata publication is idempotent, preserves unrelated keys and books, and round-trips all four languages.');
})().catch(error=>{console.error(error);process.exitCode=1;});
