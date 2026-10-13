const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const read=file=>fs.readFileSync('docs/'+file,'utf8');
const ctx={window:{}};
for(const file of ['content/books.js','locales/ui.js','content/book-translations.js','catalogue.js'])vm.runInNewContext(read(file),ctx);
const {books}=ctx.window.atlasCatalogue;
for(const book of books)book.css=read(book.stylesheet);
const common=fs.readdirSync('docs').filter(file=>/\.(js|css|html)$/.test(file));
for(const file of [...common,'locales/ui.js']){
 const source=read(file);
 for(const book of books)assert.ok(!source.includes(book.id),`${file} contains an editorial book ID: ${book.id}`);
}
for(const book of books){
 assert.ok(fs.existsSync('docs/'+book.cover.src));
 assert.equal(book.stylesheet,`themes/${book.id}.css`);
 assert.ok(fs.existsSync('docs/'+book.stylesheet),book.id+' dedicated CSS');
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
const licensed={...extra,credit:{artist:'Painter',title:'Painting',year:'1889',url:'https://museum.example/art',reproduction:'Photo & credit',reproductionUrl:'https://commons.example/art',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',reuseNote:'Faithful reproduction'}};
const licensedHtml=ctx.window.atlasCatalogueView.render([licensed]).cards;
assert.ok(licensedHtml.includes('<p>Painter · <a href="https://museum.example/art" target="_blank" rel="noopener noreferrer">Painting</a> · 1889</p>'));
assert.ok(!licensedHtml.includes('Photo &amp; credit'));
assert.ok(!licensedHtml.includes('https://creativecommons.org/licenses/by-sa/4.0/'));
assert.ok(!licensedHtml.includes('Faithful reproduction'));
assert.ok(licensedHtml.includes('</a><details class="book-image-credit"><summary>Image source</summary>'));
assert.ok(licensedHtml.includes('</details><a class="book-copy"'));
assert.ok(!licensedHtml.includes('book-status'));
assert.ok(!licensedHtml.includes('book-action'));
assert.ok(!fs.readFileSync('docs/index.html','utf8').includes('catalogue-credits'));
const attributes={},properties={},stylesheets=[];ctx.window.document={getElementById:id=>stylesheets.find(link=>link.id===id),createElement:()=>({remove(){stylesheets.splice(stylesheets.indexOf(this),1)}}),head:{appendChild:link=>stylesheets.push(link)},documentElement:{setAttribute:(key,value)=>attributes[key]=value,style:{setProperty:(key,value)=>properties[key]=value}}};
vm.runInNewContext(read('book-presentation.js'),ctx);ctx.window.atlasPresentation.apply(extra);
assert.equal(attributes['data-theme'],'rose');assert.ok(properties['--book-art'].includes(extra.cover.src));
for(const book of books){ctx.window.atlasPresentation.apply(book);assert.equal(stylesheets.length,1);assert.equal(stylesheets[0].textContent,book.css);}
ctx.window.atlasPresentation.apply({...extra,css:undefined});assert.equal(stylesheets.length,0);
(async()=>{
 let loads=0;const scripts=[];
 const context={URLSearchParams,console,window:{location:{search:'?book='+extra.id},atlasCatalogue:{books:[extra]},atlasCatalogueData:{load:async()=>({books:[extra]})},atlasI18n:{locale:'en',localizeData:x=>x,t:x=>x},IllustratedData:{load:async id=>{assert.equal(id,extra.id);loads++;return{}}},IllustratedAdapter:{adapt:()=>({book:{id:extra.id}})}},document:{getElementById:()=>({}),createElement:()=>({}),head:{appendChild:s=>scripts.push(s)}}};
 vm.runInNewContext(read('load-book.js'),context);await new Promise(resolve=>setImmediate(resolve));
 assert.equal(loads,1);assert.equal(scripts[0].src.split('?')[0],'app.js');
 console.log('PASS: shared JS/CSS/HTML contain no book IDs; editorial translations, cover assets and new illustrated titles work through metadata.');
})().catch(error=>{console.error(error);process.exitCode=1});
