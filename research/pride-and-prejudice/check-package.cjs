const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{PGlite}=require('@electric-sql/pglite');
const id='pride-and-prejudice',dir='database/generated/'+id;
const q=s=>"'"+s.replaceAll("'","''")+"'";
(async()=>{
 const bundle=JSON.parse(fs.readFileSync(dir+'/content.json','utf8')),presentation=JSON.parse(fs.readFileSync(dir+'/presentation.json','utf8')),db=new PGlite();
 try{
  await db.exec("create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$select null::uuid$$;");
  for(const m of ['001_content.sql','002_supabase_access.sql','003_book_maps.sql','004_book_presentation.sql'])await db.exec(fs.readFileSync('database/migrations/'+m,'utf8'));
  const files=fs.readdirSync(dir+'/sql-editor').filter(f=>/^\d+-import\.sql$/.test(f)).sort();
  for(let repeat=0;repeat<2;repeat++)for(const f of files){const sql=fs.readFileSync(dir+'/sql-editor/'+f,'utf8');assert.ok(Buffer.byteLength(sql)<=250000);await db.exec(sql);}
  for(const [table,rows]of Object.entries(bundle.tables))assert.equal((await db.query('select count(*)::int n from public.'+table)).rows[0].n,rows.length,table);
  await db.exec(fs.readFileSync(dir+'/presentation.sql','utf8'));const stored=(await db.query('select * from public.book_presentations')).rows[0];for(const k of Object.keys(presentation))assert.deepEqual(stored[k],presentation[k],k);
  const tests=[],hashes={};
  for(const [table,rows]of Object.entries({...bundle.tables,book_presentations:[presentation]})){
   let keys=Object.keys(rows[0]);if(table==='books')keys=keys.filter(k=>k!=='publication_status');
   const filter=table==='books'?'id':'book_id';const active=table==='sources'?' and id in ('+rows.map(r=>q(r.id)).join(',')+')':'';const expression=`(select md5(coalesce(jsonb_agg(to_jsonb(t) order by to_jsonb(t)::text collate "C"),'[]'::jsonb)::text) from (select ${keys.map(k=>'"'+k+'"').join(',')} from public.${table} where ${filter}=${q(id)}${active}) t)`;
   const hash=(await db.query('select '+expression+' as hash')).rows[0].hash;hashes[table]={hash,rows:rows.length};tests.push(expression+'='+q(hash));
  }
  const condition=tests.join('\n and '),verify='select\n '+condition+' as verified;\n';fs.writeFileSync(dir+'/sql-editor/verifica.sql',verify);
  const publish=`begin;\ndo $$begin if not coalesce((select ${condition}),false) then raise exception 'Pride and Prejudice content or presentation does not match the verified package'; end if; update public.books set publication_status='published' where id='${id}'; end$$;\ncommit;\nselect id,publication_status from public.books where id='${id}';\n`;
  fs.writeFileSync(dir+'/publish.sql',publish);fs.writeFileSync('research/'+id+'/package-hashes.json',JSON.stringify(hashes,null,2)+'\n');
  assert.equal((await db.query(verify)).rows[0].verified,true);
  await db.exec('set role anon');for(const t of [...Object.keys(bundle.tables),'book_presentations'])assert.equal((await db.query('select count(*)::int n from public.'+t)).rows[0].n,0,'draft hidden '+t);await db.exec('reset role');
  await db.exec(publish);await db.exec('set role anon');assert.equal((await db.query('select count(*)::int n from public.sections')).rows[0].n,61);assert.equal((await db.query('select count(*)::int n from public.book_presentations')).rows[0].n,1);
  const local='docs/preview/pride-and-prejudice-import';fs.mkdirSync(local,{recursive:true});for(const f of files)fs.copyFileSync(dir+'/sql-editor/'+f,local+'/'+f);for(const [source,target]of [['presentation.sql','07-presentation.sql'],['sql-editor/verifica.sql','08-verify.sql'],['publish.sql','09-publish.sql']])fs.copyFileSync(dir+'/'+source,local+'/'+target);
  for(const f of fs.readdirSync(local).filter(f=>f.endsWith('.sql'))){const sql=fs.readFileSync(local+'/'+f,'utf8');fs.writeFileSync(local+'/'+f+'.html','<!doctype html><meta charset="utf-8"><title>'+f+'</title><pre>'+sql.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')+'</pre>');}
  console.log('PASS: six exact SQL transactions imported twice; all rows and presentation preserved; draft hidden by RLS; full package hashes and conditional publication verified.');
 }finally{await db.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
