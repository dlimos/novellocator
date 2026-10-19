const fs=require('node:fs'),assert=require('node:assert/strict');
const dir='database/generated/wuthering-heights';
// Preserve the two existing reference identities when their category changes.
// The collection/category fields are updated by UPSERT; no draft data is deleted.
const stableKeys=s=>s.replaceAll('24:core:moorland','24:cited:moorland').replaceAll('26:core:grange','26:cited:grange');
const bundle=JSON.parse(stableKeys(fs.readFileSync(dir+'/content.json','utf8')));
assert.equal(bundle.tables.books.length,1);assert.equal(bundle.tables.books[0].id,'wuthering-heights');
bundle.tables.books[0].publication_status='draft';
fs.writeFileSync(dir+'/content.json',JSON.stringify(bundle,null,2)+'\n');
for(const name of ['content.sql',...fs.readdirSync(dir+'/sql-editor').filter(n=>/^\d+-import\.sql$/.test(n)).map(n=>'sql-editor/'+n)]){
 let sql=stableKeys(fs.readFileSync(dir+'/'+name,'utf8'));
 if(name==='content.sql'||name==='sql-editor/01-import.sql'){
  const shift="update public.place_references set ordinal=ordinal+1000 where book_id='wuthering-heights';";
  if(!sql.includes(shift))sql=sql.replace('begin;','begin;\n'+shift);
 }
 sql=sql.replace("E'en',E'published'","E'en',E'draft'");
 assert.ok(!sql.includes("E'en',E'published'"));
 fs.writeFileSync(dir+'/'+name,sql);
}
fs.copyFileSync(dir+'/presentation.sql',dir+'/sql-editor/04-presentation-DRAFT.sql');
const text=`# Cime tempestose — aggiornamento della bozza

Rilettura narrativa integrale completata per tutti i 34 capitoli; registro e impronte in full-review.json.

Eseguire in ordine 01-import.sql, 02-import.sql, 03-import.sql e 04-presentation-DRAFT.sql, poi verifica.sql. Le transazioni sono ripetibili e mantengono draft fino alla verifica e alla pubblicazione esplicita.

Le identità delle due associazioni riclassificate sono conservate; non si eliminano dati. Possono restare fonti storiche della precedente bozza senza riferimenti attivi.

Importazione iniziale già verificata nel browser interno autenticato; questa revisione aggiunge cinque associazioni e corregge due categorie. Le lacune nelle traduzioni restano documentate e usano il fallback inglese autentico.
`;
fs.writeFileSync(dir+'/sql-editor/IMPORTA.md',text);
console.log('Packaged three content transactions and one presentation transaction. All retain DRAFT.');
