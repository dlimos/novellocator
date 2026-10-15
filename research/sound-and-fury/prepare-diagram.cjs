const fs=require('node:fs');
const config=JSON.parse(fs.readFileSync(__dirname+'/reading-diagram.json','utf8'));
const json=JSON.stringify(config).replaceAll("'","''");
const sql=`begin;\nset local standard_conforming_strings = on;\nupdate public.books set metadata=jsonb_set(coalesce(metadata,'{}'::jsonb),'{readingDiagram}','${json}'::jsonb) where id='sound-and-fury';\ncommit;\nselect id,metadata->'readingDiagram'->>'version' as diagram_version from public.books where id='sound-and-fury';\n`;
fs.writeFileSync(__dirname+'/publish-diagram.sql',sql);
if(process.argv.includes('--preview'))fs.writeFileSync('docs/diagram-source.html','<!doctype html><meta charset=utf-8><title>Diagram metadata SQL</title><pre>'+sql.replaceAll('&','&amp;').replaceAll('<','&lt;')+'</pre>');
console.log('Targeted reading diagram metadata SQL ready.');
