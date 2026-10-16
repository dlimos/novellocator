// Public editorial data comes from the database in local and published builds.
(function(root){
 async function load(config=root.atlasSupabase){
  if(!config?.enabled)throw new Error('Supabase is disabled');
  const base=new URL(config.url);if(base.protocol!=='https:')throw new Error('Supabase must use HTTPS');
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),20000);
  try{
   const rows=[];
   for(let offset=0;;){
    const url=new URL('/rest/v1/book_presentations',base);
    url.search=new URLSearchParams({select:'*,books!inner(publication_status,illustrated:metadata->illustratedView)', 'books.publication_status':'eq.published',order:'catalogue_order,book_id',limit:'100',offset:String(offset)});
    const response=await fetch(url,{headers:{apikey:config.publishableKey,Accept:'application/json'},signal:controller.signal,cache:'no-store'});
    if(!response.ok)throw new Error('Supabase catalogue: HTTP '+response.status);
    const batch=await response.json();if(!Array.isArray(batch))throw new Error('Invalid catalogue response');
    rows.push(...batch);if(!batch.length)break;offset+=batch.length;
   }
   const messages={};
   for(const row of rows)for(const [lang,values]of Object.entries(row.translations))Object.assign(messages[lang]??={},values);
   for(const [lang,values]of Object.entries(messages))Object.assign(root.atlasLocaleData.messages[lang]??={},values);
   const catalogue={books:rows.map(row=>({...row.presentation,id:row.book_id,css:row.css,hasImaginaryMap:!!row.books?.illustrated||row.presentation.mapType==='illustrated',imaginaryViews:row.books?.illustrated?.views?.map(view=>view.names)||[]})),defaultBook:rows.find(row=>row.is_default)?.book_id,legacyIllustratedBook:rows.find(row=>row.is_legacy_illustrated)?.book_id};
   root.atlasCatalogue=catalogue;
   root.atlasI18n?.refreshAliases();
   return catalogue;
  }finally{clearTimeout(timer);controller.abort();}
 }
 root.atlasCatalogueData={load};
})(window);
