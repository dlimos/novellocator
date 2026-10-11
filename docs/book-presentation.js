// Apply the presentation and dedicated stylesheet selected by editorial data.
(function(root){
 let watchedTitle;
 function fitTitle(){
  const title=root.document.getElementById('title');
  if(!title||!title.textContent||!title.clientWidth)return;
  title.style.removeProperty('font-size');
  let size=parseFloat(root.getComputedStyle(title).fontSize);
  // Measure the rendered font, including each book's spacing and capitalization.
  for(let attempt=0;attempt<4&&title.scrollWidth>title.clientWidth;attempt++){
   size*=title.clientWidth/title.scrollWidth*.99;
   title.style.fontSize=size+'px';
  }
  if(watchedTitle!==title){
   watchedTitle=title;
   root.addEventListener('resize',fitTitle);
   root.document.fonts?.ready.then(fitTitle);
   if(root.ResizeObserver){
    let width=title.parentElement.clientWidth;
    new root.ResizeObserver(()=>{
     const next=title.parentElement.clientWidth;
     if(next!==width){width=next;fitTitle();}
    }).observe(title.parentElement);
   }
  }
 }
 root.atlasPresentation={fitTitle,apply(book){
  if(!book)return;
  const page=root.document.documentElement;
  page.setAttribute('data-book',book.id);
  page.setAttribute('data-theme',book.theme);
  const previous=root.document.getElementById('book-stylesheet');
  if(book.css){
   const stylesheet=previous||root.document.createElement('style');
   stylesheet.id='book-stylesheet';
   stylesheet.textContent=book.css;
   if(!previous)root.document.head.appendChild(stylesheet);
  }else if(previous){previous.remove();}
  page.style.setProperty('--book-art',`url("${book.cover.src}")`);
  page.style.setProperty('--banner-art-opacity',String(book.cover.banner?.opacity??.22));
  page.style.setProperty('--banner-art-mobile-opacity',String(book.cover.banner?.mobileOpacity??.13));
 }};
})(window);
