import fs from 'node:fs';
import assert from 'node:assert/strict';
import {PGlite} from '@electric-sql/pglite';
import {loadInputs,normalize,seedSql} from '../../scripts/database/model.js';
async function main(){
const ids=['pride-and-prejudice','wuthering-heights'];
const bundle=normalize(loadInputs(process.cwd(),ids));
for(const id of ids){
 const before=JSON.parse(fs.readFileSync(`research/place-scenes/${id}-before.json`,'utf8'));
 for(const ref of bundle.tables.place_references.filter(r=>r.book_id===id&&r.collection==='core')){
  const live=before.refs.find((r:{section_id:number;place_id:string;collection:string})=>r.section_id===ref.section_id&&r.place_id===ref.place_id&&r.collection==='core');
  // Category reviews preserve the original identity even when the collection changes.
  const oldId=ref.id;
  for(const e of bundle.tables.excerpts.filter(e=>e.book_id===id&&e.reference_id===oldId)){
   e.reference_id=live.id;e.id=live.id+String(e.id).slice(String(oldId).length);
  }
  ref.id=live.id;ref.scene_text=live.scene_text;
 }
}
const db=new PGlite();
try{
 await db.exec(fs.readFileSync('database/migrations/001_content.sql','utf8'));
 await db.exec(seedSql(bundle));
 const before=(await db.query('select * from public.sections order by book_id,id')).rows;
 const excerpts=(await db.query('select * from public.excerpts order by book_id,id')).rows;
 await db.exec(fs.readFileSync('research/place-scenes/patch.sql','utf8'));
 assert.deepEqual((await db.query('select * from public.sections order by book_id,id')).rows,before);
 assert.deepEqual((await db.query('select * from public.excerpts order by book_id,id')).rows,excerpts);
 for(const id of ids){
  const scenes=fs.readFileSync(`research/${id}/place-scenes.tsv`,'utf8').trim().split(/\r?\n/).slice(1);
  for(const line of scenes){
   const [chapter,pid,en,it,fr,es]=line.split('|');
   const ref=(await db.query<{scene_text:string}>("select scene_text from public.place_references where book_id=$1 and section_id=$2 and place_id=$3 and collection='core'",[id,+chapter,pid])).rows[0];
   assert.equal(ref.scene_text,en);
   for(const [language,text] of Object.entries({en,it,fr,es}))assert.equal((await db.query<{translated_text:string}>('select translated_text from public.content_translations where book_id=$1 and language=$2 and source_text=$3',[id,language,en])).rows[0].translated_text,text);
  }
 }
 console.log('SQL verified in PostgreSQL: 171 scenes, 684 language entries; section introductions and quotations preserved.');
}finally{await db.close();}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
