const fs=require('node:fs'),assert=require('node:assert/strict'),{PGlite}=require('@electric-sql/pglite');
(async()=>{const db=new PGlite();try{
 await db.exec(`create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;grant usage on schema auth to anon,authenticated;grant execute on function auth.uid() to anon,authenticated;`);
 for(const name of ['001_content.sql','002_supabase_access.sql','003_book_maps.sql','004_book_presentation.sql'])await db.exec(fs.readFileSync('database/migrations/'+name,'utf8'));
 const dir='database/generated/lolita/publication';
 for(const name of fs.readdirSync(dir).filter(n=>/^\d+-import\.sql$/.test(n)).sort())await db.exec(fs.readFileSync(dir+'/'+name,'utf8'));
 await db.exec('set role anon;');assert.equal((await db.query("select count(*)::int n from public.books where id='lolita'")).rows[0].n,0);await db.exec('reset role;');
 await db.exec(fs.readFileSync(dir+'/publish.sql','utf8'));await db.exec('set role anon;');
 assert.equal((await db.query("select count(*)::int n from public.sections where book_id='lolita'")).rows[0].n,71);
 assert.equal((await db.query("select count(*)::int n from public.excerpts where book_id='lolita'")).rows[0].n,0);
 const p=(await db.query("select presentation,translations,css from public.book_presentations where book_id='lolita'")).rows[0];
 assert.equal(p.presentation.editorialStatus,'in-progress');for(const lang of ['en','it','fr','es'])assert.ok(p.translations[lang][p.presentation.editorialNotice]);
 assert.match(p.css,/data-book="lolita"/);
 console.log('PASS: staged import remains hidden until final publication; anonymous readers see 71 sections, a translated work-in-progress notice, and no unverified quotations.');
}finally{await db.close();}})().catch(e=>{console.error(e.message);process.exitCode=1;});
