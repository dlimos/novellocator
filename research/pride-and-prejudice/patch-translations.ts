import fs from 'node:fs';
import {seedSql,type Bundle} from '../../scripts/database/model.js';
const dir='database/generated/pride-and-prejudice',bundle=JSON.parse(fs.readFileSync(dir+'/content.json','utf8')) as Bundle;
const excerpts=bundle.tables.excerpts.filter(q=>q.language==='fr'||q.language==='es');
const ids=new Set(excerpts.map(q=>q.text_source_id));
const patch={...bundle,tables:Object.fromEntries(Object.entries(bundle.tables).map(([table,rows])=>[table,table==='excerpts'?excerpts:table==='sources'?rows.filter(r=>ids.has(r.id)):[]]))} as Bundle;
const sql=seedSql(patch);fs.writeFileSync(dir+'/align-citations.sql',sql);
fs.writeFileSync('docs/preview/pride-and-prejudice-import/10-align-citations.sql.html','<!doctype html><meta charset="utf-8"><title>Align eight authentic translated citations</title><pre>'+sql.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')+'</pre>');
console.log('Scoped additive patch:',excerpts.length,'translation excerpts,',patch.tables.sources.length,'bibliographical sources. No place identity or narrative category changed.');
