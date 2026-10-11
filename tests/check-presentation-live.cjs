const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const {prepare}=require('../scripts/database/prepare-presentation.cjs');
async function main(){
 const ctx={window:{atlasLocaleData:{messages:{en:{},it:{},fr:{},es:{}}}},fetch,URL,URLSearchParams,AbortController,setTimeout,clearTimeout};
 for(const file of ['supabase-config.js','catalogue-data.js'])vm.runInNewContext(fs.readFileSync('docs/'+file,'utf8'),ctx);
 const catalogue=await ctx.window.atlasCatalogueData.load();assert.ok(catalogue.books.length>0);
 const {rows}=prepare();
 for(const book of catalogue.books){const source=rows.find(row=>row.book_id===book.id);assert.ok(source);assert.equal(book.css.replaceAll('\r\n','\n'),source.css.replaceAll('\r\n','\n'),book.id+' CSS');const {css,...presentation}=JSON.parse(JSON.stringify(book));assert.deepEqual(presentation,source.presentation,book.id+' metadata');for(const [lang,strings]of Object.entries(source.translations))for(const [key,value]of Object.entries(strings))assert.equal(ctx.window.atlasLocaleData.messages[lang][key],value);}
 console.log('PASS: public Supabase catalogue, exact CSS/metadata and editorial translations for '+catalogue.books.length+' published books. Local-only: '+rows.filter(row=>!catalogue.books.some(book=>book.id===row.book_id)).map(row=>row.book_id).join(', '));
}
main().catch(error=>{console.error(error);process.exitCode=1;});
