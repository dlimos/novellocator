// Prepare a narrowly scoped editorial patch from the current public database.
// Never reimport whole books: quotations, categories and introductions stay intact.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const DIR=__dirname,ROOT=require('node:path').resolve(DIR,'../..');
const ids=['pride-and-prejudice','wuthering-heights'],counts=[94,77],langs=['en','it','fr','es'];
const load=(file,key)=>{const c={window:{}};vm.runInNewContext(fs.readFileSync(file,'utf8'),c);return c.window[key];};
const cfg=load(ROOT+'/docs/supabase-config.js','atlasSupabase');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const readScenes=id=>fs.readFileSync(ROOT+'/research/'+id+'/place-scenes.tsv','utf8').trim().split(/\r?\n/).slice(1).map(line=>{
 const fields=line.split('|');assert.equal(fields.length,6,line);const [chapter,placeId,...values]=fields;
 assert(values.every(v=>v.trim()&&v.endsWith('.')));return {chapter:+chapter,placeId,...Object.fromEntries(langs.map((l,i)=>[l,values[i]]))};
});
async function rows(table,id){const out=[];for(let offset=0;;offset+=500){const res=await fetch(cfg.url+'/rest/v1/'+table+'?book_id=eq.'+id+'&select=*&limit=500&offset='+offset,{headers:{apikey:cfg.publishableKey}});assert(res.ok,await res.clone().text());const batch=await res.json();out.push(...batch);if(batch.length<500)return out;}}
const literal=x=>"'"+JSON.stringify(x).replaceAll("'","''")+"'::jsonb";
async function main(){
 const verify=process.argv.includes('--verify');const patch=[];const result=[];
 for(const [i,id] of ids.entries()){
  const scenes=readScenes(id),refs=await rows('place_references',id),translations=await rows('content_translations',id);
  assert.equal(scenes.length,counts[i]);assert.equal(new Set(scenes.map(r=>r.chapter+':'+r.placeId)).size,scenes.length);
  const core=refs.filter(r=>r.collection==='core');assert.equal(core.length,counts[i]);
  const dataFile=ROOT+'/docs/data/'+id+'.js',dictFile=ROOT+'/docs/data/'+id+'-i18n.js';
  const data=load(dataFile,'atlasData'),dict=load(dictFile,'atlasTranslations');
  for(const scene of scenes){
   const ref=core.find(r=>r.section_id===scene.chapter&&r.place_id===scene.placeId);assert(ref,JSON.stringify(scene));assert.equal(ref.category,'action');
   const c=data.chapters.find(c=>c.id===scene.chapter);assert(c);const index=c.places.indexOf(scene.placeId);assert(index>=0);
   for(const l of langs){assert.notEqual(scene[l],dict[l]?.[c.text]||c.text);assert(!/^(Narrated scene|Scena narrata|Scène racontée|Escena narrada)/.test(scene[l]));}
   if(verify){
    assert.equal(ref.scene_text,scene.en);
    for(const l of langs)assert.equal(translations.find(t=>t.language===l&&t.source_hash===hash(scene.en))?.translated_text,scene[l]);
   }else{
    patch.push({book_id:id,id:ref.id,old_md5:crypto.createHash('md5').update(ref.scene_text).digest('hex'),scene_text:scene.en,source_hash:hash(scene.en),it:scene.it,fr:scene.fr,es:scene.es});
    c.placeText[index]=scene.en;
    for(const l of langs){dict[l]||={};dict[l][scene.en]=scene[l];}
   }
  }
  if(!verify){
   fs.writeFileSync(DIR+'/'+id+'-before.json',JSON.stringify({refs,translations},null,2));
   fs.writeFileSync(dataFile,'window.atlasData='+JSON.stringify(data,null,2)+';\n');
   fs.writeFileSync(dictFile,'window.atlasTranslations='+JSON.stringify(dict,null,2)+';\n');
  }else{
   const before=JSON.parse(fs.readFileSync(DIR+'/'+id+'-before.json','utf8'));
   const stripped=rows=>rows.map(({scene_text,...r})=>r).sort((a,b)=>a.id.localeCompare(b.id));
   assert.deepEqual(stripped(refs),stripped(before.refs),'Unexpected reference changes');
  }
  result.push({book:id,scenes:scenes.length,languages:langs,verified:verify});
 }
 if(!verify){
  const sql=`begin;\nset local standard_conforming_strings=on;\ncreate temporary table scene_patch on commit drop as select * from jsonb_to_recordset(${literal(patch)}) as x(book_id text,id text,old_md5 text,scene_text text,source_hash text,it text,fr text,es text);\ndo $$ begin if (select count(*) from public.place_references r join scene_patch p using(book_id,id) where md5(r.scene_text)=p.old_md5 and r.collection='core' and r.category='action') <> 171 then raise exception 'Scene patch conflicts with current data'; end if; end $$;\nupdate public.place_references r set scene_text=p.scene_text from scene_patch p where r.book_id=p.book_id and r.id=p.id;\ninsert into public.content_translations(book_id,language,source_hash,source_text,translated_text) select p.book_id,v.language,p.source_hash,p.scene_text,v.translated_text from scene_patch p cross join lateral (values ('en',p.scene_text),('it',p.it),('fr',p.fr),('es',p.es)) v(language,translated_text) on conflict(book_id,language,source_hash) do update set source_text=excluded.source_text,translated_text=excluded.translated_text;\nselect p.book_id,count(*) as updated_scenes from scene_patch p join public.place_references r using(book_id,id) where r.scene_text=p.scene_text group by p.book_id;\ncommit;\n`;
  fs.writeFileSync(DIR+'/patch.sql',sql);
 }
 fs.writeFileSync(DIR+'/'+(verify?'public-verification':'prepared')+'.json',JSON.stringify(result,null,2)+'\n');console.log(result);
}
main().catch(e=>{console.error(e);process.exitCode=1;});
