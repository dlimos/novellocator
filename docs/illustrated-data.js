/* Public illustrated-atlas data; local fixtures are never used online. */
(function(root){
  function validate(data){
    if(data?.formatVersion!==1||![data.width,data.height].every(n=>Number.isFinite(n)&&n>0)||!Array.isArray(data.places)||!Array.isArray(data.epochs)||!data.epochs.length)throw Error('Invalid illustrated atlas');
    const ids=new Set();
    for(const p of data.places){
      if(typeof p.id!=='string'||ids.has(p.id)||!['site','area'].includes(p.kind)||!['action','mentioned'].includes(p.role))throw Error('Invalid place');
      ids.add(p.id);
      for(const lang of ['en','it','fr','es'])if(typeof p.names?.[lang]!=='string'||typeof p.scenes?.[lang]!=='string')throw Error('Incomplete translation');
    }
    for(const e of data.epochs){
      if(!/^images\/[a-z0-9/_.-]+\.png$/.test(e.image)||!e.ids.every(id=>ids.has(id)))throw Error('Invalid epoch');
      const anchors=data.panoramaAnchors?.[e.id]?.positions;
      if(!anchors)throw Error('Missing image anchors');
      for(const id of e.ids){
        if(data.places.find(p=>p.id===id).x===null)continue;
        const p=anchors[id];
        if(!p||![p.x,p.y].every(n=>Number.isFinite(n)&&n>=0&&n<=1))throw Error('Invalid image position');
      }
    }
    return data;
  }
  async function load(bookId,config=root.atlasSupabase){
    if(!/^[a-z0-9-]+$/.test(bookId))throw Error('Invalid book ID');
    if(root.location.protocol==='file:'){
      await new Promise((resolve,reject)=>{const script=root.document.createElement('script');script.src='data/'+bookId+'-local.js';script.onload=resolve;script.onerror=()=>reject(Error('Local dataset missing'));root.document.head.append(script)});
      return validate(structuredClone(root.atlasIllustratedLocal));
    }
    if(!config?.enabled||!/^sb_publishable_/.test(config.publishableKey))throw Error('Supabase is not configured');
    const url=new URL('/rest/v1/book_maps',config.url);
    if(url.protocol!=='https:')throw Error('Supabase requires HTTPS');
    url.search=new URLSearchParams({select:'metadata',book_id:'eq.'+bookId,id:'eq.reading-map'});
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),20000);
    try{
      const response=await root.fetch(url,{headers:{apikey:config.publishableKey,Accept:'application/json'},signal:controller.signal,cache:'no-store'});
      if(!response.ok)throw Error('Illustrated atlas HTTP '+response.status);
      const rows=await response.json(),data=rows[0]?.metadata?.illustratedAtlas;
      if(!data)throw Error('Illustrated atlas is not published');
      if(data.placeBatches)data.places=Object.keys(data.placeBatches).sort().flatMap(key=>data.placeBatches[key]);
      return validate(data);
    }finally{clearTimeout(timer);controller.abort();}
  }
  root.IllustratedData={load,validate};
})(typeof window==='object'?window:globalThis);

window.atlasIllustratedBooks=['macondo'];
