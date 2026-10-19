const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
(async()=>{
 const c={window:{}};vm.runInNewContext(fs.readFileSync('docs/supabase-config.js','utf8'),c);const config=c.window.atlasSupabase;
 if(process.argv.includes('--published')){
  const dir='database/generated/wuthering-heights/',bundle=JSON.parse(fs.readFileSync(dir+'content.json','utf8')),presentation=JSON.parse(fs.readFileSync(dir+'presentation.json','utf8'));
  const result=await Promise.all([...Object.keys(bundle.tables),'book_presentations'].map(async table=>{
   const url=new URL('/rest/v1/'+table,config.url);url.searchParams.set('select','*');url.searchParams.set(table==='books'?'id':'book_id','eq.wuthering-heights');
   const r=await fetch(url,{headers:{apikey:config.publishableKey}});assert.equal(r.status,200,table);return [table,await r.json()];
  }));
  const tables=Object.fromEntries(result);
  assert.equal(tables.books[0].publication_status,'published');assert.equal(tables.books[0].metadata.analysisCoverage.fullNarrativeRereadComplete,true);
  for(const [table,rows]of Object.entries(bundle.tables)){
   if(['sources','content_translations'].includes(table)){assert.ok(tables[table].length>=rows.length);continue;}
   assert.equal(tables[table].length,rows.length,table);
  }
  for(const q of bundle.tables.excerpts){const remote=tables.excerpts.find(r=>r.id===q.id);assert.equal(remote.quote,q.quote);assert.deepEqual(remote.metadata,q.metadata);}
  for(const q of bundle.tables.content_translations){const remote=tables.content_translations.find(r=>r.language===q.language&&r.source_hash===q.source_hash);assert.equal(remote.translated_text,q.translated_text);}
  for(const key of Object.keys(presentation))assert.deepEqual(tables.book_presentations[0][key],presentation[key],key);
  console.log('PASS: live anonymous API exposes the published book, 34 sections, 134 references, 155 exact excerpts, every active translation and the exact presentation/CSS.');
  return;
 }
 for(const [table,key]of [['books','id'],['book_presentations','book_id']]){
  const u=new URL('/rest/v1/'+table,config.url);u.searchParams.set('select',key);u.searchParams.set(key,'eq.wuthering-heights');
  const response=await fetch(u,{headers:{apikey:config.publishableKey}});assert.equal(response.status,200);assert.deepEqual(await response.json(),[],table+' must remain private while draft');
 }
 console.log('PASS: live anonymous API cannot read the Wuthering Heights draft or its presentation.');
})().catch(e=>{console.error(e);process.exitCode=1;});
