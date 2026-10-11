(async()=>{
await window.atlasCatalogueData.load();
// Preserve the earlier illustrated-atlas URL using its configured default.
const target=new URL('atlas.html',location.href);
target.search=location.search;
if(!target.searchParams.has('book'))target.searchParams.set('book',window.atlasCatalogue.legacyIllustratedBook);
target.hash=location.hash;
location.replace(target.href);

})().catch(error=>{console.error(error);document.body.textContent='The catalogue could not be loaded. Please try again later.';});
