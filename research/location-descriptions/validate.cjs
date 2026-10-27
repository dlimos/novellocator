const fs=require('fs'),assert=require('assert/strict');
const {PGlite}=require('@electric-sql/pglite');
(async()=>{
 const before=JSON.parse(fs.readFileSync(__dirname+'/before.json'));
 const patches=JSON.parse(fs.readFileSync(__dirname+'/release/manifest-20261027.json'));
 const db=new PGlite();await db.exec('create table place_references(book_id text,id text,scene_text text,category text,metadata jsonb,primary key(book_id,id));');
 for(const r of before.place_references)await db.query('insert into place_references values($1,$2,$3,$4,$5)',[r.book_id,r.id,r.scene_text,r.category,r.metadata]);
 for(const book of new Set(patches.map(p=>p.book))){const sql=fs.readFileSync(__dirname+'/release/'+book+'.sql','utf8');await db.exec(sql);await db.exec(sql);}
 const actual=(await db.query('select * from place_references')).rows;
 for(const row of actual){const previous=before.place_references.find(r=>r.book_id===row.book_id&&r.id===row.id);const patch=patches.find(p=>p.book===row.book_id&&p.id===row.id);
  assert.equal(row.category,previous.category);assert.equal(row.scene_text,previous.scene_text);
  assert.deepEqual(row.metadata,patch?{...previous.metadata,narrativeDescription:patch.description}:previous.metadata);
  if(patch)for(const lang of ['en','it','fr','es']){assert(patch.description.texts[lang].trim());assert(!patch.description.texts[lang].includes('{name}'));}
 }
 await assert.rejects(db.exec("begin; update place_references set scene_text='changed' where book_id='crime-and-punishment' and id='1:core:stolyarny';"+fs.readFileSync(__dirname+'/release/crime-and-punishment.sql','utf8')),/sources changed/);await db.exec('rollback');
 await db.close();console.log('PASS: '+patches.length+' four-language descriptions; SQL repeatable; categories, legacy scenes and unrelated metadata preserved; stale evidence rejected.');
})().catch(e=>{console.error(e);process.exitCode=1});
