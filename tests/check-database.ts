import fs from 'node:fs';
import assert from 'node:assert/strict';
import {PGlite} from '@electric-sql/pglite';
import {loadInputs,normalize,reconstruct,seedSql,seedSqlChunks,tables,type Bundle,type Row} from '../scripts/database/model.js';
async function main(){
 const inputs=loadInputs(process.cwd()),bundle=normalize(inputs),db=new PGlite();
 try{
  // Supabase Auth is external. Stub only its users/JWT identity in this local DB.
  await db.exec(`create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;grant usage on schema auth to anon,authenticated;grant execute on function auth.uid() to anon,authenticated;`);
  for(const file of ['001_content.sql','002_supabase_access.sql','003_book_maps.sql'])await db.exec(fs.readFileSync('database/migrations/'+file,'utf8'));
  const sql=seedSql(bundle),chunks=seedSqlChunks(bundle);assert.ok(chunks.length>1);assert.deepEqual(chunks,seedSqlChunks(bundle),'deterministic chunks');
  for(const chunk of chunks){assert.ok(Buffer.byteLength(chunk,'utf8')<=250_000);await db.exec(chunk);}
  await db.exec(sql);
  const imported:Bundle={formatVersion:1,tables:{...bundle.tables}};
  for(const table of tables){const result=await db.query<Row>('select * from public.'+table);assert.equal(result.rows.length,bundle.tables[table].length,table+' idempotent import');imported.tables[table]=result.rows;}
  for(const input of inputs){const rebuilt=reconstruct(imported,input.id);assert.deepEqual(rebuilt.data,input.data,input.id+' exact dataset round trip through PostgreSQL');assert.deepEqual(rebuilt.dictionary,input.dictionary,input.id+' all translations preserved');}
  // Importing a single additional book preserves every existing book.
  const added=normalize(inputs.filter(input=>input.id==='gatsby'));
  assert.equal(added.tables.books.length,1);for(const table of tables)for(const row of added.tables[table])assert.equal(table==='books'?row.id:row.book_id,'gatsby');
  await db.exec("update public.books set title='Existing title preserved' where id='ulisse'");
  for(const chunk of seedSqlChunks(added)){assert.ok(Buffer.byteLength(chunk,'utf8')<=250_000);await db.exec(chunk);}
  assert.equal((await db.query<Row>("select title from public.books where id='ulisse'")).rows[0].title,'Existing title preserved');
  assert.equal((await db.query("select * from public.sections where book_id='gatsby'")).rows.length,9);await db.exec(sql);
  // Geographical updates affect exported coordinates without changing sources.
  await db.exec("update public.places set latitude=53.3 where book_id='ulisse' and id='tower'");
  const changed=await db.query<Row>('select * from public.places');const exportBundle={...imported,tables:{...imported.tables,places:changed.rows}};assert.equal(reconstruct(exportBundle,'ulisse').data.places.tower.coords[0],53.3);await db.exec(sql);
  // Invalid geographic positions, dangling references and inconsistent categories fail.
  await assert.rejects(db.exec("update public.places set latitude=200 where book_id='ulisse' and id='tower'"));
  await assert.rejects(db.exec("update public.place_references set place_id='missing' where book_id='ulisse' and id='1:core:tower'"));
  await assert.rejects(db.exec("update public.place_references set category='action' where collection='cited'"));
  const users={reader:'00000000-0000-0000-0000-000000000001',other:'00000000-0000-0000-0000-000000000002',editor:'00000000-0000-0000-0000-000000000003',admin:'00000000-0000-0000-0000-000000000004'};
  for(const id of Object.values(users))await db.query('insert into auth.users values ($1)',[id]);
  await db.query("insert into public.editorial_memberships values ($1,'editor'),($2,'admin')",[users.editor,users.admin]);
  await db.exec("insert into public.books(id,title,author,original_language) values ('draft','Unpublished','Test','en');insert into public.places values ('draft','hidden',1,1)");
  await db.exec(`insert into public.book_maps(book_id,id,title,world_type,renderer,coordinate_space,spatial_reference,portal_item_id,is_default) values ('draft','fantasy','Test world','fictional','webmap','cartesian','{"wkid":3857}','0123456789abcdef0123456789abcdef',true);insert into public.places values ('draft','fictional-place',null,null);insert into public.place_positions(book_id,place_id,map_id,coordinate_space,x,y,method) values ('draft','fictional-place','fantasy','cartesian',12000,34000,'Local map reference');insert into public.map_layers(book_id,map_id,id,title,layer_type,layer_role,webmap_layer_id,ordinal) values ('draft','fantasy','roads','Roads','feature','context','roads-layer',0);`);
  await assert.rejects(db.exec("insert into public.place_positions(book_id,place_id,map_id,coordinate_space,x,y,method) values ('draft','hidden','fantasy','wgs84',1,1,'Wrong coordinate space')"));
  await assert.rejects(db.exec("insert into public.place_positions(book_id,place_id,map_id,coordinate_space,x,y,method) values ('ulisse','tower','fantasy','cartesian',1,1,'Wrong book')"));
  await assert.rejects(db.exec("insert into public.places values ('draft','half-point',null,1)"));
  await assert.rejects(db.exec("update public.place_positions set x='NaN' where book_id='draft'"));
  await assert.rejects(db.exec("update public.book_maps set renderer='image' where book_id='draft'"));
  await db.exec("insert into public.sections(book_id,id,ordinal,title) values ('draft',1,0,'Fantasy chapter');insert into public.section_maps values ('draft',1,'fantasy',true)");
  await assert.rejects(db.exec("insert into public.section_maps values ('ulisse',1,'fantasy',true)"));
  async function identity(role:'anon'|'authenticated',uid=''){await db.exec('reset role');await db.query("select set_config('request.jwt.claim.sub',$1,false)",[uid]);await db.exec('set role '+role);}
  await identity('anon');assert.equal((await db.query('select * from public.books')).rows.length,inputs.length);assert.equal((await db.query("select * from public.places where book_id='draft'")).rows.length,0);for(const table of ['book_maps','section_maps','map_layers','place_positions']){assert.equal((await db.query('select * from public.'+table)).rows.length,0);await assert.rejects(db.exec('delete from public.'+table));}
  await assert.rejects(db.exec("update public.books set title='Hacked' where id='ulisse'"));await assert.rejects(db.exec('select * from public.editorial_memberships'));await assert.rejects(db.exec('select * from public.favorite_places'));
  await identity('authenticated',users.reader);assert.equal((await db.query("update public.books set title='Hacked' where id='ulisse' returning id")).rows.length,0);
  await assert.rejects(db.exec("insert into public.editorial_memberships values ('"+users.reader+"','admin')"));
  await db.query("insert into public.favorite_places(user_id,book_id,place_id) values ($1,'ulisse','tower')",[users.reader]);
  await assert.rejects(db.query("insert into public.favorite_places(user_id,book_id,place_id) values ($1,'ulisse','tower')",[users.other]));
  await assert.rejects(db.query("insert into public.favorite_places(user_id,book_id,place_id) values ($1,'draft','hidden')",[users.reader]));
  await identity('authenticated',users.other);assert.equal((await db.query('select * from public.favorite_places')).rows.length,0);assert.equal((await db.query('delete from public.favorite_places returning *')).rows.length,0);
  await identity('authenticated',users.editor);assert.equal((await db.query('select * from public.books')).rows.length,inputs.length+1);assert.equal((await db.query("update public.books set title='Edited' where id='ulisse' returning id")).rows.length,1);assert.equal((await db.query("delete from public.books where id='draft' returning id")).rows.length,0);assert.equal((await db.query('select * from public.place_positions')).rows.length,1);assert.equal((await db.query("update public.map_layers set default_visible=false where book_id='draft' returning id")).rows.length,1);
  await assert.rejects(db.query("insert into public.editorial_memberships values ($1,'admin')",[users.other]));
  await identity('authenticated',users.admin);await db.query("insert into public.editorial_memberships values ($1,'editor')",[users.other]);assert.equal((await db.query("delete from public.books where id='draft' returning id")).rows.length,1);
  await identity('authenticated',users.reader);assert.equal((await db.query('delete from public.favorite_places returning *')).rows.length,1);
  console.log('PASS: PostgreSQL/PGlite migrations, exact import/export of '+inputs.length+' novels, fantasy webmap/section/layers with local coordinates, constraints and anonymous/reader/editor/admin RLS.');
 }finally{await db.close();}
}
main().catch(error=>{console.error(error instanceof Error?error.message:String(error));process.exitCode=1});
