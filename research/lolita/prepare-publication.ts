// The user explicitly requested publication after being told the analysis is pending.
// Publish an openly labelled work in progress, without exposing unverified quotations.
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {loadInputs,normalize,reconstruct,seedSqlChunks} from '../../scripts/database/model.js';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const notice='Analysis in progress · quotations pending verification';
const warning='Analysis in progress: 514 section–place associations still require individual verification. Quotations are unavailable pending edition and reuse checks. Unverified references are provisionally classified as mentioned.';
const notices=[notice,'Analisi in corso · citazioni in attesa di verifica','Analyse en cours · citations en attente de vérification','Análisis en curso · citas pendientes de verificación'];
const warnings=[warning,'Analisi in corso: 514 associazioni sezione–luogo richiedono ancora una verifica individuale. Le citazioni non sono disponibili in attesa dei controlli su edizione e riuso. I riferimenti non verificati sono classificati provvisoriamente come luoghi citati.','Analyse en cours : 514 associations section–lieu nécessitent encore une vérification individuelle. Les citations restent indisponibles dans l’attente des contrôles de l’édition et de la réutilisation. Les références non vérifiées sont provisoirement classées comme lieux mentionnés.','Análisis en curso: 514 asociaciones sección–lugar requieren todavía una verificación individual. Las citas no están disponibles mientras se comprueban la edición y su reutilización. Las referencias no verificadas se clasifican provisionalmente como lugares mencionados.'];
const input=loadInputs(process.cwd(),['lolita']);
input[0].data.book.sidebarNote=warning;
input[0].data.book.publicationStatus='published-in-progress';
const report=JSON.parse(fs.readFileSync('research/lolita/draft-build-report.json','utf8'));
assert.equal(report.originalEvidencePending,514);
for(const [i,lang]of ['en','it','fr','es'].entries()){
 input[0].dictionary[lang][warning]=warnings[i];
}
fs.writeFileSync('docs/data/lolita.js','window.atlasData='+JSON.stringify(input[0].data,null,2)+';\n');
fs.writeFileSync('docs/data/lolita-i18n.js','window.atlasTranslations='+JSON.stringify(input[0].dictionary,null,2)+';\n');
const bundle=normalize(input);bundle.tables.books[0].publication_status='draft';
assert.deepEqual(reconstruct(bundle,'lolita').data,input[0].data);
assert.equal(bundle.tables.excerpts.length,0);
const context:any={window:{}};vm.runInNewContext(fs.readFileSync('docs/content/books.js','utf8'),context);
const book=context.window.atlasCatalogue.books.find((b:any)=>b.id==='lolita');
book.editorialStatus='in-progress';book.editorialNotice=notice;
fs.writeFileSync('docs/content/books.js','window.atlasCatalogue='+JSON.stringify(context.window.atlasCatalogue,null,2)+';\n');
const additions=Object.fromEntries(['en','it','fr','es'].map((lang,i)=>[lang,{Lolita:'Lolita',[notice]:notices[i]}]));
const trFile='docs/content/book-translations.js';let tr=fs.readFileSync(trFile,'utf8');
const start='// lolita publication notice',end='// end lolita publication notice';
if(tr.includes(start))tr=tr.slice(0,tr.indexOf(start))+tr.slice(tr.indexOf(end)+end.length);
tr+='\n'+start+'\n(function(){const additions='+JSON.stringify(additions)+';for(const [lang,strings]of Object.entries(additions))Object.assign(window.atlasLocaleData.messages[lang],strings);})();\n'+end+'\n';fs.writeFileSync(trFile,tr);
const row=require('../../scripts/database/prepare-presentation.cjs').prepare().rows.find((r:any)=>r.book_id==='lolita');
row.artwork_documentation=fs.readFileSync('research/lolita/artwork.json','utf8');
const q=(v:any)=>"'"+String(v).replaceAll("'","''")+"'";
const keys=Object.keys(row),values=keys.map(k=>typeof row[k]==='object'?q(JSON.stringify(row[k]))+'::jsonb':typeof row[k]==='number'||typeof row[k]==='boolean'?String(row[k]):q(row[k]));
const dir='database/generated/lolita/publication';fs.mkdirSync(dir,{recursive:true});
const chunks=seedSqlChunks(bundle);chunks.forEach((sql,i)=>fs.writeFileSync(`${dir}/${String(i+1).padStart(2,'0')}-import.sql`,sql));
const final=`begin;\ninsert into public.book_presentations (${keys.join(',')}) values (${values.join(',')}) on conflict(book_id) do update set ${keys.filter(k=>k!=='book_id').map(k=>k+'=excluded.'+k).join(',')},updated_at=now();\nupdate public.books set publication_status='published' where id='lolita';\ncommit;\nselect id,publication_status,(select count(*) from public.sections where book_id='lolita') as sections,(select count(*) from public.excerpts where book_id='lolita') as quotations from public.books where id='lolita';\n`;
fs.writeFileSync(dir+'/publish.sql',final);
fs.writeFileSync(dir+'/content.json',JSON.stringify(bundle,null,2)+'\n');
fs.writeFileSync(dir+'/presentation.json',JSON.stringify(row,null,2)+'\n');
console.log(JSON.stringify({chunks:chunks.length,bytes:chunks.map(s=>Buffer.byteLength(s)),finalBytes:Buffer.byteLength(final),sections:71,quotations:0,analysis:'in-progress',pending:514}));
