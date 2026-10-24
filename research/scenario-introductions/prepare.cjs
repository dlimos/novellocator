const fs=require('node:fs'),vm=require('node:vm');
const dir=__dirname,langs=['en','it','fr','es'];
const before=JSON.parse(fs.readFileSync(dir+'/before.json','utf8'));
const after=structuredClone(before),patches=[];
const q=value=>"'"+String(value).replaceAll("'","''")+"'";
for(const line of fs.readFileSync(dir+'/copy.tsv','utf8').trim().split(/\r?\n/)){
 const [bookId,kind,id,...texts]=line.split('|');
 if(texts.length!==4||texts.some(t=>!t.trim()))throw Error('Invalid copy: '+line);
 const config=after.find(b=>b.id===bookId).metadata.illustratedView;
 if(kind==='view'){
  const index=config.views.findIndex(v=>v.id===id);if(index<0)throw Error(id);
  config.views[index].notes=Object.fromEntries(langs.map((lang,i)=>[lang,texts[i]]));
  patches.push({bookId,path:['illustratedView','views',String(index),'notes'],value:config.views[index].notes});
 }else{
  if(!config.views.some(v=>v.positions[id]))throw Error(id);
  for(const [i,lang]of langs.entries()){
   config.notes[lang]??={};config.notes[lang][id]=texts[i];
  }
 }
}
// Publish only the edited fields, preserving concurrent chapter/category reviews.
for(const b of after.filter(b=>b.metadata.illustratedView))patches.push({bookId:b.id,path:['illustratedView','notes'],value:b.metadata.illustratedView.notes});
fs.writeFileSync(dir+'/after.json',JSON.stringify(after,null,2)+'\n');
fs.writeFileSync(dir+'/patches.json',JSON.stringify(patches,null,2)+'\n');
const sql='begin;\nset local standard_conforming_strings=on;\n'+patches.map(p=>
 `update public.books set metadata=jsonb_set(metadata,${q('{'+p.path.join(',')+'}')},${q(JSON.stringify(p.value))}::jsonb,true) where id=${q(p.bookId)};`
).join('\n')+'\ncommit;\nselect id,jsonb_array_length(metadata #> \'{illustratedView,views}\') as views from public.books where metadata ? \'illustratedView\' order by id;\n';
fs.writeFileSync(dir+'/publish.sql',sql);
fs.mkdirSync('docs/preview',{recursive:true});
fs.writeFileSync('docs/preview/scenario-introductions-sql.html','<!doctype html><meta charset="utf-8"><title>Scenario introductions SQL</title><pre>'+sql.replaceAll('&','&amp;').replaceAll('<','&lt;')+'</pre>');
// Keep ignored import fixtures in sync without changing unrelated local content.
for(const b of after.filter(b=>b.metadata.illustratedView)){
 const file='docs/data/'+b.id+'.js';if(!fs.existsSync(file))continue;
 const c={window:{}};vm.runInNewContext(fs.readFileSync(file,'utf8'),c);
 const config=c.window.atlasData.book.illustratedView;
 if(!config)continue;
 config.notes=b.metadata.illustratedView.notes;
 for(const p of patches.filter(p=>p.bookId===b.id&&p.path[1]==='views'))config.views[Number(p.path[2])].notes=p.value;
 fs.writeFileSync(file,'window.atlasData='+JSON.stringify(c.window.atlasData,null,2)+';\n');
}
console.log(patches.length+' field patches prepared.');
