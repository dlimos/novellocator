// Render the editorial catalogue loaded from the database.
(function(root){
 const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const normalize=value=>String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase().replace(/[’‘]/g,"'").trim();
 function matches(book,title,author,translate=value=>value){
  const contains=(value,query)=>normalize(query).split(/\s+/).every(term=>normalize(value+' '+translate(value)).includes(term));
  return contains(book.title,title)&&contains(book.author,author);
 }
 function shuffle(books){
  const shuffled=books.slice();
  for(let index=shuffled.length-1;index>0;index--){
   const other=Math.floor(Math.random()*(index+1));
   [shuffled[index],shuffled[other]]=[shuffled[other],shuffled[index]];
  }
  return shuffled;
 }
 function renderCredit(credit){
  return `<details class="book-image-credit"><summary>Image source</summary><div><p>${escape(credit.artist)} · <a href="${escape(credit.url)}" target="_blank" rel="noopener noreferrer">${escape(credit.title)}</a> · ${escape(credit.year)}</p></div></details>`;
 }
 function render(books){
  return {
   cards:books.map((book,index)=>`<article class="book-card available-book"><a class="book-art" href="atlas.html?book=${encodeURIComponent(book.id)}" aria-label="${escape(book.ariaLabel)}" style="--cover-position:${escape(book.cover.position)}"><img src="${escape(book.cover.src)}" alt="${escape(book.cover.alt)}" width="${book.cover.width}" height="${book.cover.height}" ${index?'loading="lazy"':'fetchpriority="high"'} decoding="async"><span>${escape(book.setting)}</span></a>${renderCredit(book.credit)}<a class="book-copy" href="atlas.html?book=${encodeURIComponent(book.id)}" aria-label="${escape(book.ariaLabel)}"><div class="book-meta"><span>${escape(book.author)}</span></div><h2>${escape(book.title)}</h2>${book.editorialNotice?`<p class="book-editorial-notice">${escape(book.editorialNotice)}</p>`:""}</a></article>`).join('\n')
  };
 }
 root.atlasCatalogueView={render,matches,shuffle};
 if(!root.document)return;
 async function start(){
 const catalogue=await root.atlasCatalogueData.load();
 const books=shuffle(catalogue.books);
 const legacy=books.find(book=>book.legacyHashPrefix&&root.location.hash.startsWith('#'+book.legacyHashPrefix+'-'));
 if(legacy){const target=new URL('atlas.html',root.location.href);target.search=root.location.search;target.searchParams.set('book',legacy.id);target.hash=root.location.hash;root.location.replace(target.href);return;}
 const html=render(books);
 root.document.getElementById('catalogue-books').innerHTML=html.cards;
 root.atlasI18n.translateDOM(root.document.getElementById('catalogue-books'));
 for(const a of root.document.querySelectorAll('.book-card > a')){const url=new URL(a.href,root.location.href);url.searchParams.set('lang',root.atlasI18n.locale);a.href=url.href;}
 const form=root.document.getElementById('catalogue-search');
 const title=root.document.getElementById('catalogue-title-search');
 const author=root.document.getElementById('catalogue-author-search');
 const status=root.document.getElementById('catalogue-search-status');
 const cards=Array.from(root.document.querySelectorAll('#catalogue-books .book-card'));
 function filter(){
  let count=0;
  cards.forEach((card,index)=>{card.hidden=!matches(books[index],title.value,author.value,root.atlasI18n.t);if(!card.hidden)count++;});
  status.textContent=count?`${root.atlasI18n.t('Novels found')}: ${count} / ${books.length}`:root.atlasI18n.t('No novels match your search.');
 }
 form.addEventListener('submit',event=>event.preventDefault());
 form.addEventListener('input',filter);
 for(const control of form.elements)control.disabled=false;
 filter();
 }
 start().catch(error=>{console.error('Catalogue loading failed',error);const el=root.document.getElementById('catalogue-books');el.setAttribute('role','status');const messages={en:'The catalogue could not be loaded. Please try again later.',it:'Non è stato possibile caricare il catalogo. Riprova più tardi.',fr:'Le catalogue n’a pas pu être chargé. Réessayez plus tard.',es:'No se ha podido cargar el catálogo. Inténtalo de nuevo más tarde.'};el.textContent=messages[root.atlasI18n.locale]||messages.en;});
})(typeof window==='object'?window:globalThis);
