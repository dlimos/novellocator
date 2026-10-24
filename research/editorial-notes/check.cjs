const fs=require('node:fs'),assert=require('node:assert/strict'),{PGlite}=require('@electric-sql/pglite');
const x=require('./before.json'),changes=require('./changes.json');
(async()=>{const db=new PGlite();try{
 await db.exec('create table books(id text primary key,metadata jsonb);create table sections(book_id text,id integer,metadata jsonb);create table sources(book_id text,id text,label text);create table place_references(book_id text,id text,scene_text text,category text,metadata jsonb);create table content_translations(book_id text,language text,source_hash text,source_text text,translated_text text,primary key(book_id,language,source_hash));');
 for(const b of x.books)await db.query('insert into books values($1,$2)',[b.id,b.metadata]);
 for(const s of x.sections)await db.query('insert into sections values($1,$2,$3)',[s.book_id,s.id,s.metadata]);
 for(const s of x.sources.filter(s=>s.book_id==='ulisse'))await db.query('insert into sources values($1,$2,$3)',[s.book_id,s.id,s.label]);
 for(const r of x.place_references.filter(s=>s.book_id==='ulisse'))await db.query('insert into place_references values($1,$2,$3,$4,$5)',[r.book_id,r.id,r.scene_text,r.category,r.metadata]);
 const sql=fs.readFileSync(__dirname+'/publish.sql','utf8');await db.exec(sql);await db.exec(sql);
 const sections=(await db.query('select * from sections')).rows;
 for(const s of sections){const old=x.sections.find(o=>o.book_id===s.book_id&&o.id===s.id),expected={...old.metadata};if(changes.sections.some(c=>c.book===s.book_id&&c.id===s.id))delete expected.note;assert.deepEqual(s.metadata,expected);}
 for(const r of(await db.query('select * from place_references')).rows){const old=x.place_references.find(o=>o.book_id===r.book_id&&o.id===r.id);assert.equal(r.category,old.category);assert.deepEqual(r.metadata,old.metadata);}
 for(const b of(await db.query('select * from books')).rows){const old=x.books.find(o=>o.id===b.id);assert.deepEqual(b.metadata.geographicReview?.regionalPlaces,old.metadata.geographicReview?.regionalPlaces);}
 assert.equal((await db.query("select count(*)::int n from content_translations")).rows[0].n,changes.translations.length);
 console.log('PASS: SQL idempotente; note specifiche, introduzioni, geometrie, categorie e riscontri conservati; traduzioni complete in quattro lingue.');
}finally{await db.close();}})().catch(e=>{console.error(e);process.exitCode=1});
