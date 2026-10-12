const fs=require('node:fs');const dir='database/generated/anna-karenina';
// Keep the additive import invisible until every chunk and the presentation are applied.
for(const file of ['content.sql',...fs.readdirSync(dir+'/sql-editor').filter(f=>/^\d+-import.sql$/.test(f)).map(f=>'sql-editor/'+f)]){
 const path=dir+'/'+file;let sql=fs.readFileSync(path,'utf8');sql=sql.replace("E'ru',E'published'","E'ru',E'draft'");fs.writeFileSync(path,sql);
}
fs.copyFileSync(dir+'/presentation.sql',dir+'/sql-editor/13-presentation-and-publish.sql');
const guide=dir+'/sql-editor/IMPORTA.md';fs.appendFileSync(guide,'\nDopo i dodici blocchi dei contenuti, esegui `13-presentation-and-publish.sql`: importa tema e catalogo e rende pubblico il libro. La prima importazione crea una bozza, invisibile al sito. Esegui infine `verifica.sql`.\n');
