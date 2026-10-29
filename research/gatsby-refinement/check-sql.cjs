const fs=require('node:fs'),assert=require('node:assert/strict'),{PGlite}=require('@electric-sql/pglite');
(async()=>{
 const db=new PGlite(),input=require('./live/gatsby.json'),expected=require('./expected.json');
 try{
  await db.exec('CREATE TABLE books(id text primary key,metadata jsonb); CREATE TABLE sections(book_id text,id integer,metadata jsonb); CREATE TABLE content_translations(book_id text,language text,source_hash text,source_text text,translated_text text,primary key(book_id,language,source_hash));');
  await db.query('INSERT INTO books VALUES($1,$2)',['gatsby',JSON.stringify({...input.data.book,sentinel:'preserved'})]);
  await db.query('INSERT INTO books VALUES($1,$2)',['another-book',JSON.stringify({sentinel:'unaffected'})]);
  for(const c of input.data.chapters)await db.query('INSERT INTO sections VALUES($1,$2,$3)',['gatsby',c.id,JSON.stringify(c)]);
  const sql=fs.readFileSync(__dirname+'/publish.sql','utf8');await db.exec(sql);await db.exec(sql);
  const book=(await db.query("SELECT metadata FROM books WHERE id='gatsby'")).rows[0].metadata;
  assert.deepEqual(book.geographicReview,expected.patch.geographicReview);assert.equal(book.sentinel,'preserved');
  assert.deepEqual((await db.query("SELECT metadata FROM books WHERE id='another-book'")).rows[0].metadata,{sentinel:'unaffected'});
  for(const row of (await db.query("SELECT * FROM sections WHERE book_id='gatsby' ORDER BY id")).rows){
   assert.equal(row.metadata.setting,expected.settings[row.id-1].setting);
   const original={...input.data.chapters[row.id-1],setting:row.metadata.setting};assert.deepEqual(row.metadata,original);
  }
  assert.equal((await db.query('SELECT count(*) AS n FROM content_translations')).rows[0].n,expected.translations.length);
  console.log('PASS: exact PostgreSQL publication SQL, repeatable updates, all source quotations and section fields preserved, other books unaffected.');
 }finally{await db.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
