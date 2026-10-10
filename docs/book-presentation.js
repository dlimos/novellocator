// Apply the presentation and dedicated stylesheet selected by editorial data.
(function(root){
 root.atlasPresentation={apply(book){
  if(!book)return;
  const page=root.document.documentElement;
  page.setAttribute('data-book',book.id);
  page.setAttribute('data-theme',book.theme);
  const previous=root.document.getElementById('book-stylesheet');
  if(book.stylesheet){
   const stylesheet=previous||root.document.createElement('link');
   stylesheet.id='book-stylesheet';
   stylesheet.rel='stylesheet';
   stylesheet.href=book.stylesheet;
   if(!previous)root.document.head.appendChild(stylesheet);
  }else if(previous){previous.remove();}
  page.style.setProperty('--book-art',`url("${book.cover.src}")`);
  page.style.setProperty('--banner-art-opacity',String(book.cover.banner?.opacity??.22));
  page.style.setProperty('--banner-art-mobile-opacity',String(book.cover.banner?.mobileOpacity??.13));
 }};
})(window);
