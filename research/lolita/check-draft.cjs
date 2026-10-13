const fs=require('node:fs'),assert=require('node:assert/strict');
const {PGlite}=require('@electric-sql/pglite');
(async()=>{
 const db=new PGlite();try{
  await db.exec(`create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;grant usage on schema auth to anon,authenticated;grant execute on function auth.uid() to anon,authenticated;`);
  for(const name of ['001_content.sql','002_supabase_access.sql','003_book_maps.sql','004_book_presentation.sql'])await db.exec(fs.readFileSync('database/migrations/'+name,'utf8'));
  const sql=fs.readFileSync('database/generated/lolita/content-draft.sql','utf8');
  const presentation=fs.readFileSync('database/generated/lolita/presentation-draft.sql','utf8');
  await db.exec(sql);await db.exec(presentation);await db.exec(sql);await db.exec(presentation);
  const book=(await db.query("select publication_status from public.books where id='lolita'")).rows[0];assert.equal(book.publication_status,'draft');
  const count=await db.query("select count(*)::int as n from public.sections where book_id='lolita'");assert.equal(count.rows[0].n,71);
  assert.equal((await db.query("select count(*)::int as n from public.excerpts where book_id='lolita'")).rows[0].n,0);
  const p=(await db.query("select css,presentation from public.book_presentations where book_id='lolita'")).rows[0];
  assert.ok(p.css.length>1000);
  assert.equal(p.presentation.cover.src,'images/lolita-prinet-kreutzer.jpg');
  await db.exec('set role anon;');
  assert.equal((await db.query("select count(*)::int as n from public.books where id='lolita'")).rows[0].n,0);
  assert.equal((await db.query("select count(*)::int as n from public.sections where book_id='lolita'")).rows[0].n,0);
  assert.equal((await db.query("select count(*)::int as n from public.book_presentations where book_id='lolita'")).rows[0].n,0);
  await db.exec('reset role;');await db.exec("update public.books set publication_status='published' where id='lolita';");
  await assert.rejects(db.exec(sql),/Refusing to overwrite published Lolita/);
  await db.exec('rollback;');
  console.log('PASS: idempotent PostgreSQL draft import, 71 sections, pending quotes omitted, anonymous access hidden, published-book overwrite rejected.');
 }finally{await db.close();}
})().catch(e=>{console.error(e.message);process.exitCode=1});
