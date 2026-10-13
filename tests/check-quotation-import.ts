import fs from 'node:fs';
import assert from 'node:assert/strict';
import {PGlite} from '@electric-sql/pglite';
import {loadInputs,normalize,reconstruct,seedSql,tables,type Bundle,type Row} from '../scripts/database/model.js';
(async()=>{
const inputs=loadInputs(process.cwd(),['crime-and-punishment']);
const before=structuredClone(inputs);
for(const section of before[0].data.chapters){
 for(const group of Object.values(section.placeExcerpts||{}))group.translations={};
 for(const reference of section.citations||[])reference.excerpt.translations={};
 for(const setting of section.unlocatedPlaces||[])delete setting.translations;
}
const baseline=normalize(before),db=new PGlite();
try{
 await db.exec(fs.readFileSync('database/migrations/001_content.sql','utf8'));
 await db.exec(seedSql(baseline));
 const sql=fs.readFileSync('research/translations/publish-translations.sql','utf8');
 await db.exec(sql);await db.exec(sql);
 const imported:Bundle={formatVersion:1,tables:{...baseline.tables}};
 for(const table of tables)imported.tables[table]=(await db.query<Row>('select * from public.'+table)).rows;
 assert.deepEqual(reconstruct(imported,'crime-and-punishment').data,inputs[0].data,'Only the intended translated passages may change, even on rerun');
 assert.deepEqual(imported.tables.place_references,baseline.tables.place_references,'Narrative categories and geographic associations stay intact');
 assert.equal(imported.tables.excerpts.filter(r=>r.type==='translation').length,13);
 const settings=imported.tables.unlocated_settings.filter(r=>Object.hasOwn(r.metadata,'translations'));
 assert.equal(settings.length,8);
 assert.equal(settings.reduce((n,r)=>n+Object.keys((r.metadata as any).translations).length,0),9);
 console.log('PASS: production quotation SQL tested twice in PostgreSQL/PGlite; exactly 13 mapped and 9 unlocated translations, complete unchanged originals, categories and all other data.');
}finally{await db.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
