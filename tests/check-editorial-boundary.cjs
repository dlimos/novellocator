const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const read=file=>fs.readFileSync('docs/'+file,'utf8');
const ctx={window:{}};
for(const file of ['content/books.js','locales/ui.js','content/book-translations.js','catalogue.js'])vm.runInNewContext(read(file),ctx);
const {books}=ctx.window.atlasCatalogue;
const common=fs.readdirSync('docs').filter(file=>/\.(js|css|html)$/.test(file));
for(const file of [...common,'locales/ui.js']){
 const source=read(file);
 for(const book of books)assert.ok(!source.includes(book.id),`${file} contains an editorial book ID: ${book.id}`);
}
for(const book of books){
 assert.ok(fs.existsSync('docs/'+book.cover.src));
 for(const lang of ['en','it','fr','es'])for(const field of [book.title,book.description,book.ariaLabel,book.cover.alt]){
  const messages=ctx.window.atlasLocaleData.messages[lang];
  const alias=Object.entries(ctx.window.atlasLocaleData.messages.en).find(([,value])=>value===field)?.[0];
  assert.ok(messages[field]||messages[alias],`${lang}: missing catalogue translation ${field}`);
 }
}
const extra={...books[0],id:'new-fictional-world',title:'<A new world>',mapType:'illustrated',theme:'rose'};
const html=ctx.window.atlasCatalogueView.render([extra]);
assert.ok(html.cards.includes('book=new-fictional-world'));
assert.ok(html.cards.includes('&lt;A new world&gt;'));
const attributes={},properties={};ctx.window.document={documentElement:{setAttribute:(key,value)=>attributes[key]=value,style:{setProperty:(key,value)=>properties[key]=value}}};
vm.runInNewContext(read('book-presentation.js'),ctx);ctx.window.atlasPresentation.apply(extra);
assert.equal(attributes['data-theme'],'rose');assert.ok(properties['--book-art'].includes(extra.cover.src));
(async()=>{
 let loads=0;const scripts=[];
 const context={URLSearchParams,console,window:{location:{search:'?book='+extra.id},atlasCatalogue:{books:[extra]},atlasI18n:{locale:'en',localizeData:x=>x,t:x=>x},IllustratedData:{load:async id=>{assert.equal(id,extra.id);loads++;return{}}},IllustratedAdapter:{adapt:()=>({book:{id:extra.id}})}},document:{getElementById:()=>({}),createElement:()=>({}),head:{appendChild:s=>scripts.push(s)}}};
 vm.runInNewContext(read('load-book.js'),context);await new Promise(resolve=>setImmediate(resolve));
 assert.equal(loads,1);assert.equal(scripts[0].src,'app.js');
 console.log('PASS: shared JS/CSS/HTML contain no book IDs; editorial translations, cover assets and new illustrated titles work through metadata.');
})().catch(error=>{console.error(error);process.exitCode=1});
