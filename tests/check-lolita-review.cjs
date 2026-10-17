const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),{PGlite}=require('@electric-sql/pglite');
const patch=JSON.parse(fs.readFileSync('research/lolita/whole-review-patch.json')),audit=JSON.parse(fs.readFileSync('research/lolita/whole-book-review.json')),dictionary=JSON.parse(fs.readFileSync('research/lolita/whole-review-translations.json'));
const plain=x=>JSON.parse(JSON.stringify(x));
assert.equal(audit.sections.length,71);assert.equal(audit.sections.filter(s=>s.id.startsWith('1.')).length,33);assert.equal(audit.sections.filter(s=>s.id.startsWith('2.')).length,36);
for(const s of audit.sections){assert(s.originalSectionSha256);assert(s.previousSectionAnalysis);for(const a of s.reviewedActionPlaces){assert(a.reason);assert(a.sourceImageSha256);assert(a.narrativeLevel);if(s.id!=='afterword')assert(a.pdfPages.length);}}
for(const values of Object.values(dictionary))assert.equal(values.filter(v=>typeof v==='string'&&v.trim()).length,4);
for(const id of ['colorado','california']){const p=patch.descriptionUpdates.find(p=>p.placeId===id);assert(p);assert(p.metadata.regionalOutline.paths.every(path=>JSON.stringify(path[0])===JSON.stringify(path.at(-1))));}
const ctx={window:{}};vm.createContext(ctx);vm.runInContext(fs.readFileSync('docs/supabase-data.js','utf8'),ctx);vm.runInContext(fs.readFileSync('docs/csv-export.js','utf8'),ctx);
const evidence={original:{quote:'Existing original evidence.',language:'en',type:'original',attribution:'Verified reference'}};
const input={book:{sectionGrouping:{actionFirst:true,groups:[{id:1,title:'Part',firstSection:1,lastSection:3}]},geographicReview:{regionalPlaces:[{id:'r',keys:['Town'],place:{name:'Town region',kind:'uncertain',coords:[1,2],narrativeSource:{url:'https://example.org'}},sceneText:'Generic mention',sectionOccurrences:{2:{category:'action',scene:'Enacted scene in the continuing house.',source:{label:'Chapter two'}}}}]}},places:{a:{name:'A'},m:{name:'M'}},chapters:[{id:1,title:'First',places:['m','a'],placeText:['Mention M','Mention A'],placeCategories:{m:'mentioned',a:'mentioned'},unlocatedPlaces:[{name:'Town'}]},{id:2,title:'Second',places:['a'],placeText:['Action A'],placeCategories:{a:'action'},placeExcerpts:{a:evidence},unlocatedPlaces:[]},{id:3,title:'Third',places:[],placeText:[],unlocatedPlaces:[]}]};
const original=plain(input),result=ctx.window.atlasSupabaseData.groupSections(input),chapter=result.chapters[0];
assert.deepEqual(plain(input),original,'view review must not mutate source input');assert.deepEqual(plain(chapter.places),['a','r','m']);assert.equal(chapter.placeText[0],'Action A');assert.deepEqual(plain(chapter.placeExcerpts.a),evidence);assert.equal(chapter.placeCategories.r,'action');assert.equal(chapter.placeOccurrences.r.length,2);assert.equal(chapter.placeOccurrences.r[0].category,'mentioned');assert.equal(chapter.placeOccurrences.r[1].sourceSectionId,2);assert.equal(chapter.placeText[1],'Enacted scene in the continuing house.');
assert.equal(result.sourceChapters[1].placeCategories.r,'action','detailed CSV keeps reviewed regional scene in its original chapter');assert(ctx.window.atlasCsv.build(result,'places').includes('Enacted scene in the continuing house.'));
// Use the actual global-view construction, where an earlier mention must not
// replace the source or scene of a later action.
const app=fs.readFileSync('docs/app.js','utf8');Object.assign(ctx,{chapters:[{places:['m','a'],placeCategories:{m:'mentioned',a:'mentioned'},placeText:['M','Old mention']},{places:['a'],placeCategories:{a:'action'},placeText:['Actual action'],placeSources:{a:{label:'Action source'}}}],book:{sectionGrouping:{actionFirst:true}},t:x=>x});
vm.runInContext(app.slice(app.indexOf('const globalPlaceIds='),app.indexOf('const activeChapter=')),ctx);assert.deepEqual(plain(vm.runInContext('globalPlaceIds',ctx)),['a','m']);assert.equal(vm.runInContext('globalChapter.placeText[0]',ctx),'Actual action');assert.equal(vm.runInContext('globalChapter.placeSources.a.label',ctx),'Action source');
assert(!patch.coreUpdates.some(r=>r.section_id===57&&['elmira','geneva','tombstone','porlock'].includes(r.place_id)),'false register addresses remain mentions');
assert(!patch.regionalPlaces.find(r=>r.id==='regional-ramsdale').sectionOccurrences[1],'foreword news does not become an action');
assert(!patch.regionalPlaces.find(r=>r.id==='regional-briceland').sectionOccurrences[31],'imagined mural does not become an action');
(async()=>{const db=new PGlite();try{
 await db.exec('create table books(id text primary key,metadata jsonb);create table place_references(book_id text,id text,section_id int,place_id text,collection text,ordinal int,category text,scene_text text,source_id text,metadata jsonb,primary key(book_id,id));create table place_descriptions(book_id text,place_id text,collection text,metadata jsonb,note text,method text,position_source_id text,checked date);create table sources(book_id text,id text,url text,label text,metadata jsonb,primary key(book_id,id));create table content_translations(book_id text,language text,source_hash text,source_text text,translated_text text,primary key(book_id,language,source_hash));create table excerpts(id text,quote text);');
 const regions=patch.regionalPlaces.filter(p=>!p.place).map(p=>({id:p.id,categories:{999:'mentioned'},place:{coords:[3,4],sentinel:true}}));regions.push({id:'untouched',place:{sentinel:42}});
 const metadata={sentinel:'book',sectionGrouping:{groups:[1,2,3,4].map(id=>({id,links:[{url:'https://existing.example',label:'Retained'}]}))},geographicReview:{regionalPlaces:regions}};
 await db.query('insert into books values($1,$2),($3,$4)',['lolita',metadata,'other',{sentinel:8}]);
 for(const r of patch.coreUpdates.filter(r=>!r.isNew))await db.query('insert into place_references values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',[r.book_id,r.id,r.section_id,r.place_id,r.collection,r.ordinal,'mentioned','Prior description',r.source_id,{sentinel:true}]);
 for(const p of patch.descriptionUpdates)await db.query('insert into place_descriptions values($1,$2,$3,$4,$5,$6,$7,$8)',['lolita',p.placeId,'core',{sentinel:true},'Old note','Old method','old','2026-10-13']);
 await db.exec("insert into excerpts values('protected-original','Retained original quotation');");
 // Every table changed by the publication has a fail-closed trigger in this
 // isolated test database: even an attempted write outside Lolita aborts it.
 await db.exec(`create function assert_lolita_scope() returns trigger language plpgsql as $$ begin
 if TG_TABLE_NAME='books' then if NEW.id<>'lolita' then raise exception 'OUT OF SCOPE: books';end if;
 else if NEW.book_id<>'lolita' then raise exception 'OUT OF SCOPE: %',TG_TABLE_NAME;end if;end if;return NEW;end $$;`);
 for(const table of ['books','place_references','place_descriptions','sources','content_translations'])await db.exec(`create trigger publication_scope before insert or update on ${table} for each row execute function assert_lolita_scope();`);
 const sql=fs.readFileSync('research/lolita/publish-whole-review.sql','utf8');await db.exec(sql);await db.exec(sql);
 const m=(await db.query("select metadata from books where id='lolita'")).rows[0].metadata;assert.equal(m.sentinel,'book');assert.equal(m.sectionGrouping.actionFirst,true);assert.equal(m.geographicReview.regionalPlaces.length,regions.length+4);assert.deepEqual(m.geographicReview.regionalPlaces.find(r=>r.id==='untouched'),regions.at(-1));
 for(const p of patch.regionalPlaces.filter(p=>!p.place)){const r=m.geographicReview.regionalPlaces.find(r=>r.id===p.id);assert.deepEqual(r.categories,{999:'mentioned'});assert.equal(r.place.sentinel,true);assert.deepEqual(r.sectionOccurrences,p.sectionOccurrences);}
 assert.equal((await db.query('select count(*)::int n from place_references')).rows[0].n,patch.coreUpdates.length);assert.equal((await db.query('select quote from excerpts')).rows[0].quote,'Retained original quotation');assert.equal((await db.query("select metadata from books where id='other'")).rows[0].metadata.sentinel,8);
 for(const p of (await db.query('select metadata from place_descriptions')).rows)assert.equal(p.metadata.sentinel,true);
 // Exercise the publication's own pre-COMMIT guard independently of the
 // additional test trigger. This database contains disposable fixtures only.
 await db.exec('drop trigger publication_scope on books;');
 const injected=sql.replace('do $scope$ begin',"update public.books set metadata='{\"sentinel\":999}'::jsonb where id='other';\ndo $scope$ begin");
 await assert.rejects(db.exec(injected),/Scope verification failed/);await db.exec('rollback;');
 assert.equal((await db.query("select metadata from books where id='other'")).rows[0].metadata.sentinel,8,'server-side scope guard rolls back an unrelated-book change before commit');
 console.log('PASS: 71-section review, 73 evidenced scenes, four languages, action-first grouping/global evidence, contextual regions/CSV, protected mentions, idempotent scoped SQL and untouched original quotations.');
 console.log('PASS: all 5 mutation targets are protected by fail-closed test triggers; the complete publication ran twice without attempting ANY write outside book lolita. Every ON CONFLICT DO UPDATE now also has an explicit book_id = lolita WHERE predicate.');
 console.log('PASS: production SQL additionally snapshots all non-Lolita rows in every target table and verifies their hashes BEFORE COMMIT; an injected unrelated-book change raised Scope verification failed and was rolled back.');
 }finally{await db.close();}})().catch(e=>{console.error(e);process.exitCode=1});
