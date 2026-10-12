const fs=require('node:fs'),assert=require('node:assert/strict');
const {PGlite}=require('@electric-sql/pglite');
(async()=>{
 const db=new PGlite();
 try{
  await db.exec('create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$select null::uuid$$;');
  for(const migration of ['001_content.sql','002_supabase_access.sql','003_book_maps.sql','004_book_presentation.sql'])await db.exec(fs.readFileSync('database/migrations/'+migration,'utf8'));
  const dir='database/generated/anna-karenina/';
  for(const file of fs.readdirSync(dir+'sql-editor').filter(f=>/^\d+-import.sql$/.test(f)).sort())await db.exec(fs.readFileSync(dir+'sql-editor/'+file,'utf8'));
  await db.exec(fs.readFileSync(dir+'presentation.sql','utf8'));
  const report=JSON.parse(fs.readFileSync(dir+'report.json','utf8'));
  for(const [table,count]of Object.entries(report.rows))assert.equal((await db.query('select count(*)::int as n from public.'+table)).rows[0].n,count,table);
  const presentation=(await db.query("select * from public.book_presentations where book_id='anna-karenina'")).rows[0],expected=JSON.parse(fs.readFileSync(dir+'presentation.json','utf8'));
  for(const key of Object.keys(expected))assert.deepEqual(presentation[key],expected[key],key+' copied exactly');
  assert.ok(presentation.css.includes('data:image/svg+xml'));
  await db.exec(fs.readFileSync(dir+'presentation.sql','utf8'));
  assert.equal((await db.query('select count(*)::int as n from public.book_presentations')).rows[0].n,1);
  console.log('PASS: exact SQL Editor chunks, 626 sourced associations, exact presentation/CSS and repeatable publication.');
 }finally{await db.close();}
})().catch(error=>{console.error(error.message);process.exitCode=1;});

