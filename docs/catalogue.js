// Render public editorial metadata independently of the narrative database.
(function(root){
 const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function render(books){
  return {
   cards:books.map((book,index)=>`<a class="book-card available-book" href="atlas.html?book=${encodeURIComponent(book.id)}" aria-label="${escape(book.ariaLabel)}"><div class="book-art" style="--cover-position:${escape(book.cover.position)}"><img src="${escape(book.cover.src)}" alt="${escape(book.cover.alt)}" width="${book.cover.width}" height="${book.cover.height}" ${index?'loading="lazy"':'fetchpriority="high"'} decoding="async"><span>${escape(book.setting)}</span></div><div class="book-copy"><div class="book-meta"><span>${String(index+1).padStart(2,'0')} · ${escape(book.author)}</span><span class="book-status">Available</span></div><h2>${escape(book.title)}</h2><p>${escape(book.description)}</p><span class="book-action">Explore the maps <span aria-hidden="true">↗</span></span></div></a>`).join('\n'),
   credits:books.map(({credit})=>`<li>${escape(credit.artist)} · <a href="${escape(credit.url)}" target="_blank" rel="noopener noreferrer">${escape(credit.title)}</a> · ${escape(credit.year)}</li>`).join('')
  };
 }
 root.atlasCatalogueView={render};
 if(!root.document)return;
 const {books}=root.atlasCatalogue;
 const legacy=books.find(book=>book.legacyHashPrefix&&root.location.hash.startsWith('#'+book.legacyHashPrefix+'-'));
 if(legacy){const target=new URL('atlas.html',root.location.href);target.search=root.location.search;target.searchParams.set('book',legacy.id);target.hash=root.location.hash;root.location.replace(target.href);return;}
 const html=render(books);
 root.document.getElementById('catalogue-books').innerHTML=html.cards;
 root.document.getElementById('catalogue-credits').innerHTML=html.credits;
})(typeof window==='object'?window:globalThis);
