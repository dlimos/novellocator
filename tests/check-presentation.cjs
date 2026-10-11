const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const {PGlite}=require('@electric-sql/pglite');
const {prepare}=require('../scripts/database/prepare-presentation.cjs');
async function main(){
 const {rows,sql}=prepare(),db=new PGlite();
 try{
  await db.exec(`create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;grant usage on schema auth to anon,authenticated;grant execute on function auth.uid() to anon,authenticated;`);
  for(const file of ['001_content.sql','002_supabase_access.sql','004_book_presentation.sql'])await db.exec(fs.readFileSync('database/migrations/'+file,'utf8'));
  for(const row of rows)await db.query("insert into public.books(id,title,author,original_language,publication_status) values($1,'Title','Author','en','published')",[row.book_id]);
  await db.exec(sql);await db.exec(sql);
  const stored=(await db.query('select * from public.book_presentations order by catalogue_order')).rows;
  for(const [index,row]of rows.entries())for(const key of Object.keys(row))assert.deepEqual(stored[index][key],row[key],row.book_id+': '+key);
  await db.exec("update public.books set publication_status='draft' where id='ulisse';set role anon;");
  assert.equal((await db.query('select * from public.book_presentations')).rows.length,rows.length-1);
  await assert.rejects(db.exec("update public.book_presentations set css='body{}'"));
  await db.exec('reset role;');
  await db.exec("insert into auth.users values('00000000-0000-0000-0000-000000000001');insert into public.editorial_memberships values('00000000-0000-0000-0000-000000000001','editor');set role authenticated;select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',false);");
  assert.equal((await db.query("update public.book_presentations set css='body{}' where book_id='ulisse' returning book_id")).rows.length,1);
  assert.equal((await db.query('select * from public.book_presentations')).rows.length,rows.length);
 }finally{await db.close();}
 const calls=[],ctx={window:{atlasSupabase:{enabled:true,url:'https://example.supabase.co',publishableKey:'sb_publishable_test'},atlasLocaleData:{messages:{en:{},it:{},fr:{},es:{}}},atlasI18n:{refreshAliases(){}}},URL,URLSearchParams,AbortController,setTimeout,clearTimeout,fetch:async url=>{
  const u=new URL(url);calls.push(u);const offset=Number(u.searchParams.get('offset'));return{ok:true,json:async()=>rows.slice(offset,offset+2)};
 }};
 vm.runInNewContext(fs.readFileSync('docs/catalogue-data.js','utf8'),ctx);
 const catalogue=await ctx.window.atlasCatalogueData.load();
 assert.equal(catalogue.books.length,rows.length);assert.equal(catalogue.defaultBook,'ulisse');
 assert.equal(catalogue.books[0].css,rows[0].css);assert.equal(catalogue.books[0].stylesheet,undefined);
 assert.ok(calls.length>2);assert.equal(calls[0].searchParams.get('books.publication_status'),'eq.published');
 assert.equal(ctx.window.atlasLocaleData.messages.it['Don Quixote'],'Don Chisciotte');
 assert.equal(ctx.window.atlasLocaleData.messages.en.Ulisse,'Ulysses');
 assert.equal(ctx.window.atlasLocaleData.messages.it.Ulisse,'Ulisse');
 ctx.fetch=async()=>({ok:false,status:403});await assert.rejects(ctx.window.atlasCatalogueData.load(),/HTTP 403/);
 for(const name of ['index','atlas','illustrated']){const html=fs.readFileSync('docs/'+name+'.html','utf8');assert.ok(!html.includes('content/books.js'));assert.ok(!html.includes('content/book-translations.js'));}
 console.log('PASS: editorial/CSS PostgreSQL round trip, idempotent import, RLS, paginated catalogue, translations and HTTP errors.');
}
main().catch(error=>{console.error(error);process.exitCode=1;});
