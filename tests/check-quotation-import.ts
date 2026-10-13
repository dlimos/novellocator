import fs from 'node:fs';
import assert from 'node:assert/strict';
import {PGlite} from '@electric-sql/pglite';
import {loadInputs,normalize,reconstruct,seedSql,tables,type Bundle,type Row} from '../scripts/database/model.js';
(async()=>{
const bookId=process.argv[2]||'crime-and-punishment';
const prefix=bookId==='crime-and-punishment'?'':bookId+'-';
const changes=JSON.parse(fs.readFileSync(`research/translations/verified/${bookId}.json`,'utf8'));
const inputs=loadInputs(process.cwd(),[bookId]);
const before=structuredClone(inputs);
for(const change of changes){
 const section=before[0].data.chapters.find(s=>s.id===change.section)!;
 const target=change.collection==='unlocated'?section.unlocatedPlaces!.find(s=>(s as any).id===change.id)!:change.collection==='core'?section.placeExcerpts![change.id]:section.citations!.find(c=>c.placeId===change.id)!.excerpt;
 delete target.translations![change.language];
 if(change.collection==='unlocated'&&!Object.keys(target.translations!).length)delete target.translations;
}
const baseline=normalize(before),db=new PGlite();
try{
 await db.exec(fs.readFileSync('database/migrations/001_content.sql','utf8'));
 await db.exec(seedSql(baseline));
 const sql=fs.readFileSync(`research/translations/${prefix}publish-translations.sql`,'utf8');
 await db.exec(sql);await db.exec(sql);
 const imported:Bundle={formatVersion:1,tables:{...baseline.tables}};
 for(const table of tables)imported.tables[table]=(await db.query<Row>('select * from public.'+table)).rows;
 assert.deepEqual(reconstruct(imported,bookId).data,inputs[0].data,'Only the intended translated passages may change, even on rerun');
 assert.deepEqual(imported.tables.place_references,baseline.tables.place_references,'Narrative categories and geographic associations stay intact');
 const mapped=changes.filter((c:any)=>c.collection!=='unlocated');
 assert.equal(imported.tables.excerpts.length-baseline.tables.excerpts.length,mapped.length);
 console.log(`PASS: ${bookId}, production quotation SQL tested twice in PostgreSQL/PGlite; exactly ${mapped.length} mapped and ${changes.length-mapped.length} unlocated translations, complete unchanged originals, categories and all other data.`);
}finally{await db.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
