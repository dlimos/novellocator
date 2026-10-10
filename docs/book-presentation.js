// Select reusable presentation profiles from editorial data.
(function(root){
 root.atlasPresentation={apply(book){
  if(!book)return;
  const page=root.document.documentElement;
  page.setAttribute('data-book',book.id);
  page.setAttribute('data-theme',book.theme);
  page.style.setProperty('--book-art',`url("${book.cover.src}")`);
  page.style.setProperty('--banner-art-opacity',String(book.cover.banner?.opacity??.22));
  page.style.setProperty('--banner-art-mobile-opacity',String(book.cover.banner?.mobileOpacity??.13));
 }};
})(window);
