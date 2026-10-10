const fs=require('fs'),vm=require('vm');
module.exports=function(){
 const context={window:{}};
 for(const file of ['docs/content/books.js','docs/catalogue.js'])vm.runInNewContext(fs.readFileSync(file,'utf8'),context);
 const result=context.window.atlasCatalogueView.render(context.window.atlasCatalogue.books);
 return fs.readFileSync('docs/index.html','utf8').replace('<section class="book-grid" id="catalogue-books" aria-label="Novels in the atlas"></section>',`<section class="book-grid">${result.cards}</section>`).replace('<ul id="catalogue-credits"></ul>',`<ul>${result.credits}</ul>`);
};
