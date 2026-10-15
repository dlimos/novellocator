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
 if(change.legacyCore){delete section.placeExcerpts![change.id];if(!Object.keys(section.placeExcerpts!).length)delete section.placeExcerpts;continue;}
 const target=change.collection==='section'?section.excerpts!:change.collection==='unlocated'?section.unlocatedPlaces!.find(s=>((s as any).id||s.name)===change.id)!:change.collection==='core'?section.placeExcerpts![change.id]:section.citations!.find(c=>c.placeId===change.id)!.excerpt;
 delete target.translations![change.language];
 if(change.collection==='unlocated'&&!Object.keys(target.translations!).length)delete target.translations;
}
const categoryFile=`research/translations/${bookId}-category-corrections.json`;
const categoryChanges=fs.existsSync(categoryFile)?JSON.parse(fs.readFileSync(categoryFile,'utf8')):[];
for(const change of categoryChanges){
 const section=before[0].data.chapters.find(s=>s.id===change.section)!;
 if(section.placeCategories)delete section.placeCategories[change.id];
 if(section.placeCategories&&!Object.keys(section.placeCategories).length)delete section.placeCategories;
}
const baseline=normalize(before),db=new PGlite();
try{
 await db.exec(fs.readFileSync('database/migrations/001_content.sql','utf8'));
 await db.exec(seedSql(baseline));
 const batchArg=process.argv[3];
 const files=batchArg?JSON.parse(fs.readFileSync(batchArg,'utf8')):[`research/translations/${prefix}publish-translations.sql`];
 for(let run=0;run<2;run++)for(const file of files)await db.exec(fs.readFileSync(file,'utf8'));
 const imported:Bundle={formatVersion:1,tables:{...baseline.tables}};
 for(const table of tables)imported.tables[table]=(await db.query<Row>('select * from public.'+table)).rows;
 assert.deepEqual(reconstruct(imported,bookId).data,inputs[0].data,'Only the intended translated passages may change, even on rerun');
 const byId=(a:Row,b:Row)=>String(a.id).localeCompare(String(b.id));
 assert.deepEqual([...imported.tables.place_references].sort(byId),normalize(inputs).tables.place_references.sort(byId),'Only the documented narrative category corrections may change');
 const mapped=changes.filter((c:any)=>c.collection!=='unlocated');
 assert.equal(imported.tables.excerpts.length-baseline.tables.excerpts.length,mapped.length+mapped.filter((c:any)=>c.legacyCore).length);
 console.log(`PASS: ${bookId}, SQL tested twice; ${mapped.length} mapped/section and ${changes.length-mapped.length} unlocated translations, ${categoryChanges.length} documented category corrections; all originals and other data preserved.`);
}finally{await db.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
