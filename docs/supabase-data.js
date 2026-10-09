(()=>{
 const order={books:'id',sections:'book_id,id',places:'book_id,id',sources:'book_id,id',place_descriptions:'book_id,place_id,collection',place_references:'book_id,id',excerpts:'book_id,id',unlocated_settings:'book_id,section_id,ordinal',content_translations:'book_id,language,source_hash'};
 async function loadBook(bookId,config=window.atlasSupabase){
  if(!/^[a-z0-9-]+$/.test(bookId))throw new Error('Invalid book ID');
  if(!config?.enabled||!/^sb_publishable_/.test(config.publishableKey))throw new Error('Supabase publishable key is not configured');
  const base=new URL(config.url);if(base.protocol!=='https:')throw new Error('Supabase must use HTTPS');
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),20000);
  const headers={apikey:config.publishableKey,Accept:'application/json'};
  async function rows(table){
   const result=[],pageSize=500;
   for(let offset=0;;){
    const url=new URL('/rest/v1/'+table,base);
    url.search=new URLSearchParams({select:'*',order:order[table],limit:String(pageSize),offset:String(offset),[table==='books'?'id':'book_id']:'eq.'+bookId});
    if(table==='books')url.searchParams.set('publication_status','eq.published');
    const response=await fetch(url,{headers,signal:controller.signal,cache:'no-store'});
    if(!response.ok)throw new Error('Supabase '+table+': HTTP '+response.status);
    const batch=await response.json();if(!Array.isArray(batch))throw new Error('Invalid Supabase response');
    result.push(...batch);offset+=batch.length;
    // Continue until empty, even if the server imposes a smaller page limit.
    if(!batch.length)return result;
   }
  }
  try{
   const books=await rows('books');if(!books.length){const error=new Error('Book is not published');error.code='BOOK_UNAVAILABLE';throw error;}
   const bundle={formatVersion:1,tables:{books}};
   await Promise.all(window.atlasContent.tables.filter(t=>t!=='books').map(async table=>{bundle.tables[table]=await rows(table);}));
   return window.atlasContent.reconstruct(bundle,bookId);
  }finally{controller.abort();clearTimeout(timer);}
 }
 window.atlasSupabaseData={loadBook};
})();
