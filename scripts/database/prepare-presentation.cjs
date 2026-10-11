// Local sources are backups/import inputs, never a browser fallback.
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
function prepare(){
 const context={window:{}};
 for(const file of ['locales/ui.js','content/books.js'])vm.runInNewContext(fs.readFileSync('docs/'+file,'utf8'),context);
 const shared=structuredClone(context.window.atlasLocaleData.messages);
 vm.runInNewContext(fs.readFileSync('docs/content/book-translations.js','utf8'),context);
 const catalogue=JSON.parse(JSON.stringify(context.window.atlasCatalogue));
 const editorial=Object.fromEntries(Object.entries(context.window.atlasLocaleData.messages).map(([lang,messages])=>[lang,Object.fromEntries(Object.entries(messages).filter(([key,value])=>shared[lang][key]!==value))]));
 const credits=fs.readFileSync('docs/images/CREDITS.md','utf8');
 const rows=catalogue.books.map((book,index)=>{
  const {stylesheet,...presentation}=book;
  // Keep only this book's catalogue strings and their translations.
  const strings=new Set();function visit(value){if(typeof value==='string')strings.add(value);else if(value&&typeof value==='object')Object.values(value).forEach(visit);}visit(presentation);
  for(const [key,value]of Object.entries(editorial.en||{}))if(strings.has(value))strings.add(key);
  const translations=Object.fromEntries(Object.entries(editorial).map(([lang,messages])=>[lang,Object.fromEntries(Object.entries(messages).filter(([key])=>strings.has(key)))]));
  return{book_id:book.id,catalogue_order:index,presentation,translations,css:fs.readFileSync(path.join('docs',stylesheet),'utf8'),artwork_documentation:credits,is_default:book.id===catalogue.defaultBook,is_legacy_illustrated:book.id===catalogue.legacyIllustratedBook};
 });
 const literal=value=>"'"+String(value).replaceAll("'","''")+"'";
 const sql='-- Apply 004_book_presentation.sql first. Missing narrative books are reported, not created.\nbegin;\n'+rows.map(row=>{
  const keys=Object.keys(row),values=keys.map(key=>typeof row[key]==='object'?literal(JSON.stringify(row[key]))+'::jsonb':typeof row[key]==='number'||typeof row[key]==='boolean'?String(row[key]):literal(row[key]));
  return `insert into public.book_presentations (${keys.join(',')}) select ${values.join(',')} where exists(select 1 from public.books where id=${literal(row.book_id)}) on conflict(book_id) do update set ${keys.filter(key=>key!=='book_id').map(key=>`${key}=excluded.${key}`).join(',')},updated_at=now();`;
 }).join('\n')+'\ncommit;\nselect book_id,length(css) as css_characters from public.book_presentations order by catalogue_order;\n';
 return {rows,sql};
}
if(require.main===module){const out='database/generated/presentation';fs.mkdirSync(out,{recursive:true});const {rows,sql}=prepare();fs.writeFileSync(out+'/import.sql',sql);fs.writeFileSync(out+'/presentation.json',JSON.stringify(rows,null,2)+'\n');console.log('Prepared '+rows.length+' presentation records in '+out);}
module.exports={prepare};
