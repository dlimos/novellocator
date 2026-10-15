const fs=require('node:fs'),assert=require('node:assert/strict');
const {PGlite}=require('@electric-sql/pglite');
const dir='work/sound-and-fury-excerpts/';
(async()=>{
 const db=new PGlite();
 await db.exec('create table excerpts(book_id text,id text,section_id integer,quote text,attribution text,metadata jsonb); create table unlocated_settings(book_id text,section_id integer,ordinal integer,quote text,metadata jsonb);');
 for(const q of JSON.parse(fs.readFileSync(dir+'excerpts-before.json')))
  await db.query('insert into excerpts values ($1,$2,$3,$4,$5,$6)',[q.book_id,q.id,q.section_id,q.quote,q.attribution,{...q.metadata,sentinel:'preserved'}]);
 for(const q of JSON.parse(fs.readFileSync(dir+'unlocated_settings-before.json')))
  await db.query('insert into unlocated_settings values ($1,$2,$3,$4,$5)',[q.book_id,q.section_id,q.ordinal,q.quote,{...q.metadata,sentinel:'preserved'}]);
 await db.exec("insert into excerpts values ('other-book','untouched',1,'do not replace','original credit','{}');");
 const sql=fs.readFileSync(dir+'publish.sql','utf8');
 await db.exec(sql);await db.exec(sql);
 const expected=JSON.parse(fs.readFileSync(dir+'updates.json'));
 for(const p of expected.excerpts){const {rows:[q]}=await db.query("select * from excerpts where book_id='sound-and-fury' and id=$1",[p.id]);assert.equal(q.quote,p.quote);assert.equal(q.attribution,p.attribution);assert.equal(q.metadata.sentinel,'preserved');for(const [key,value]of Object.entries(p.metadata))assert.deepEqual(q.metadata[key],value);}
 for(const p of expected.unlocated_settings){const {rows:[q]}=await db.query("select * from unlocated_settings where book_id='sound-and-fury' and section_id=$1 and ordinal=$2",[p.section_id,p.ordinal]);assert.equal(q.quote,p.quote);assert.equal(q.metadata.sentinel,'preserved');for(const [key,value]of Object.entries(p.metadata))assert.deepEqual(q.metadata[key],value);}
 assert.equal((await db.query("select quote from excerpts where book_id='other-book'")).rows[0].quote,'do not replace');
 console.log('PASS: 227 guarded quotation updates, exact source spans and highlights; repeatable SQL preserves unrelated metadata and other books.');await db.close();
})().catch(e=>{console.error(e);process.exitCode=1;});
