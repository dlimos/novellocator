const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c={window:{}};vm.createContext(c);for(const f of ['data/wuthering-heights.js','data/wuthering-heights-i18n.js','illustrated-overlay.js','atlas-modes.js','csv-export.js'])vm.runInContext(fs.readFileSync('docs/'+f,'utf8'),c);
const data=c.window.atlasData,before=JSON.stringify(data),source=JSON.parse(fs.readFileSync(__dirname+'/sections.json','utf8')),audit=JSON.parse(fs.readFileSync(__dirname+'/views-evidence.json','utf8'));
assert.equal(audit.length,14);for(const r of audit){assert(source[r.sourceChapter-1].paragraphs[r.sourceParagraph-1].includes(r.quote));assert.equal(source[r.sourceChapter-1].sha256,r.sourceSha256);assert(r.highlightTerms.every(t=>r.quote.toLowerCase().includes(t.toLowerCase())));}
for(const lang of ['en','it','fr','es']){
 const geo=c.window.AtlasModes.adapt(data,null,lang),image=c.window.AtlasModes.adapt(data,'imaginary',lang);
 assert.equal(JSON.stringify(data),before);assert.equal(geo.chapters.length,34);assert.equal(image.chapters.length,3);
 assert.deepEqual(Array.from(image.chapters.map(v=>v.places.length)),[7,6,6]);
 assert.equal(image.book.hashPrefix,'view');assert.equal(image.book.illustration.viewsAsSections,true);
 for(const v of image.chapters){assert(v.text.length>60&&v.text!==image.book.illustration.caption);for(const pid of v.places){assert(image.book.illustration.anchors[v.id].positions[pid]);assert(v.placeOccurrences[pid].length);assert(v.placeExcerpts[pid].original.quote);assert.equal(image.places[pid].coords,undefined);}}
 assert.equal(image.chapters[2].placeCategories.penistone,'mentioned');assert.equal(image.chapters[2].placeCategories.heights,'action');
 assert.equal(geo.chapters.flatMap(c=>c.places).length+geo.chapters.flatMap(c=>c.citations).length,134);
 const visibleUnlocated=geo.chapters.flatMap(c=>c.unlocatedPlaces.filter(u=>u.displayInAtlas!==false));assert.equal(visibleUnlocated.length,5);
 const geoCsv=c.window.atlasCsv.build(geo,'places',lang),imageCsv=c.window.atlasCsv.build(image,'places',lang);
 assert(!geoCsv.includes('Chamber with the enclosed bed'));assert(imageCsv.includes(image.places['wh-bed'].name));
 assert(!imageCsv.includes('wikisource.org')&&!imageCsv.includes('githubusercontent.com'));assert(!imageCsv.includes('"polyline"'));
 for(const pid of ['heights','grange','gimmerton','penistone','moorland'])assert.equal(image.places[pid].positionSource.url,undefined);
 const hidden=geo.chapters.flatMap(c=>c.unlocatedPlaces.filter(u=>u.illustratedOnly));assert.equal(hidden.length,14);assert(hidden.every(u=>u.displayInAtlas===false));
 for(const v of data.book.illustratedView.views){assert(fs.existsSync('docs/'+v.image));for(const p of Object.values(v.positions))assert(p.every(n=>n>0&&n<1));}
}
console.log('PASS: 3 views, 19 anchored places, 14 individually sourced subsettings, 4 narrative introductions, preserved geography and chapter references.');
// The exact patch must be idempotent and preserve the existing geographic rows.
(async()=>{
 const {PGlite}=require('@electric-sql/pglite'),db=new PGlite();try{
 await db.exec('create table books(id text primary key,publication_status text,metadata jsonb);create table sources(book_id text,id text,url text);create table unlocated_settings(book_id text,section_id int,ordinal int,name text,description text,quote text,source_id text,metadata jsonb,primary key(book_id,section_id,ordinal));create table content_translations(book_id text,language text,source_hash text,source_text text,translated_text text,primary key(book_id,language,source_hash));create table place_references(book_id text);');
 await db.query('insert into books values($1,$2,$3)',['wuthering-heights','published',{preserved:'geographic metadata'}]);await db.query('insert into sources values($1,$2,$3)',['wuthering-heights','original',audit[0].sourceEdition&&'https://raw.githubusercontent.com/GITenberg/Wuthering-Heights_768/master/768.txt']);
 await db.exec("insert into place_references select 'wuthering-heights' from generate_series(1,134)");
 const sql=fs.readFileSync(__dirname+'/publish-views.sql','utf8');await db.exec(sql);await db.exec(sql);
 assert.equal((await db.query('select count(*)::int n from unlocated_settings')).rows[0].n,14);
 assert.equal((await db.query("select metadata->>'preserved' as value from books")).rows[0].value,'geographic metadata');
 assert.equal((await db.query(fs.readFileSync(__dirname+'/verify-views.sql','utf8'))).rows[0].verified,true);
 console.log('PASS: exact scoped SQL patch twice, preserved book metadata, stable hidden identities and verification query.');
 }finally{await db.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
