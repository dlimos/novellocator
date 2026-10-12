// Render the editorial catalogue loaded from the database.
(function(root){
 const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const normalize=value=>String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase().replace(/[’‘]/g,"'").trim();
 function matches(book,title,author,translate=value=>value){
  const contains=(value,query)=>normalize(query).split(/\s+/).every(term=>normalize(value+' '+translate(value)).includes(term));
  return contains(book.title,title)&&contains(book.author,author);
 }
 function render(books){
  return {
   cards:books.map((book,index)=>`<a class="book-card available-book" href="atlas.html?book=${encodeURIComponent(book.id)}" aria-label="${escape(book.ariaLabel)}"><div class="book-art" style="--cover-position:${escape(book.cover.position)}"><img src="${escape(book.cover.src)}" alt="${escape(book.cover.alt)}" width="${book.cover.width}" height="${book.cover.height}" ${index?'loading="lazy"':'fetchpriority="high"'} decoding="async"><span>${escape(book.setting)}</span></div><div class="book-copy"><div class="book-meta"><span>${String(index+1).padStart(2,'0')} · ${escape(book.author)}</span><span class="book-status">Available</span></div><h2>${escape(book.title)}</h2><p>${escape(book.description)}</p><span class="book-action">Explore the maps <span aria-hidden="true">↗</span></span></div></a>`).join('\n'),
   credits:books.map(({credit})=>`<li>${escape(credit.artist)} · <a href="${escape(credit.url)}" target="_blank" rel="noopener noreferrer">${escape(credit.title)}</a> · ${escape(credit.year)}${credit.reproduction?`<br><a href="${escape(credit.reproductionUrl)}" target="_blank" rel="noopener noreferrer">${escape(credit.reproduction)}</a> · <a href="${escape(credit.licenseUrl)}" target="_blank" rel="noopener noreferrer">${escape(credit.license)}</a>${credit.reuseNote?` · ${escape(credit.reuseNote)}`:''}`:''}</li>`).join('')
  };
 }
 root.atlasCatalogueView={render,matches};
 if(!root.document)return;
 async function start(){
 const {books}=await root.atlasCatalogueData.load();
 const legacy=books.find(book=>book.legacyHashPrefix&&root.location.hash.startsWith('#'+book.legacyHashPrefix+'-'));
 if(legacy){const target=new URL('atlas.html',root.location.href);target.search=root.location.search;target.searchParams.set('book',legacy.id);target.hash=root.location.hash;root.location.replace(target.href);return;}
 const html=render(books);
 root.document.getElementById('catalogue-books').innerHTML=html.cards;
 root.document.getElementById('catalogue-credits').innerHTML=html.credits;
 root.atlasI18n.translateDOM(root.document.getElementById('catalogue-books'));
 for(const a of root.document.querySelectorAll('.book-card')){const url=new URL(a.href,root.location.href);url.searchParams.set('lang',root.atlasI18n.locale);a.href=url.href;}
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
