const fs=require('node:fs'),assert=require('node:assert/strict');const {PGlite}=require('@electric-sql/pglite');
(async()=>{
 const dir='database/generated/wuthering-heights/',bundle=JSON.parse(fs.readFileSync(dir+'content.json','utf8')),expected=JSON.parse(fs.readFileSync(dir+'presentation.json','utf8')),db=new PGlite();
 try{
  await db.exec("create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$select null::uuid$$;");
  for(const m of ['001_content.sql','002_supabase_access.sql','003_book_maps.sql','004_book_presentation.sql'])await db.exec(fs.readFileSync('database/migrations/'+m,'utf8'));
  const files=fs.readdirSync(dir+'sql-editor').filter(f=>/^\d+.*\.sql$/.test(f)).sort();assert.equal(files.length,4);
  for(let repeat=0;repeat<2;repeat++)for(const f of files){const sql=fs.readFileSync(dir+'sql-editor/'+f,'utf8');assert.ok(Buffer.byteLength(sql)<=250000);await db.exec(sql);}
  for(const [table,rows]of Object.entries(bundle.tables))assert.equal((await db.query('select count(*)::int n from public.'+table)).rows[0].n,rows.length,table+' row count');
  assert.equal((await db.query('select publication_status from public.books')).rows[0].publication_status,'draft');
  const stored=(await db.query('select * from public.book_presentations')).rows[0];for(const k of Object.keys(expected))assert.deepEqual(stored[k],expected[k],k);
  const excerpts=(await db.query('select quote,language,metadata from public.excerpts')).rows;for(const q of bundle.tables.excerpts)assert.ok(excerpts.some(r=>r.quote===q.quote&&r.language===q.language&&JSON.stringify(r.metadata.highlightTerms)===JSON.stringify(q.metadata.highlightTerms)),q.id);
  await db.exec('set role anon');for(const table of [...Object.keys(bundle.tables),'book_presentations'])assert.equal((await db.query('select count(*)::int n from public.'+table)).rows[0].n,0,'draft hidden: '+table);
  await db.exec('reset role');
  const verification=await db.query(fs.readFileSync(dir+'sql-editor/verifica.sql','utf8'));assert.equal(verification.rows[0].verified,true);
  await db.exec(fs.readFileSync(dir+'publish.sql','utf8'));
  await db.exec('set role anon');assert.equal((await db.query('select count(*)::int n from public.sections')).rows[0].n,34);
  console.log('PASS: exact four SQL Editor transactions, repeatable import, preserved passages/CSS/catalogue, and anonymous invisibility of the complete draft.');
 }finally{await db.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
