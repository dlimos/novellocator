const fs=require('fs'),vm=require('vm'),crypto=require('crypto');
const load=(p,key)=>{const c={window:{}};vm.runInNewContext(fs.readFileSync(p,'utf8'),c);return c.window[key];};
const catalogue=load('docs/content/books.js','atlasCatalogue');
const root='research/chapter-introductions';fs.mkdirSync(root,{recursive:true});
const changes=[];
const previous=fs.existsSync(root+'/changes.json')?JSON.parse(fs.readFileSync(root+'/changes.json','utf8')):[];
for(const book of catalogue.books.filter(b=>b.mapType==='geographic')){
 const p=`docs/data/${book.id}.js`,ip=`docs/data/${book.id}-i18n.js`;
 const data=load(p,'atlasData'),dict=load(ip,'atlasTranslations');
 const file=`${root}/${book.id}.tsv`;
 if(fs.existsSync(file)){
  const rows=fs.readFileSync(file,'utf8').trim().split(/\r?\n/).map(l=>l.split('|'));
  if(rows.length!==data.chapters.length)throw Error(`${book.id}: ${rows.length}/${data.chapters.length}`);
  data.chapters.forEach((c,i)=>{const [en,it,fr,es]=rows[i];if(!en||!it||!fr||!es||rows[i].length!==4)throw Error(`${book.id}/${c.id}: malformed intro`);changes.push({book_id:book.id,id:c.id,old:previous.find(p=>p.book_id===book.id&&p.id===c.id)?.old||c.text,text:en,translations:{it,fr,es}});c.text=en;for(const lang of ['it','fr','es']){dict[lang]??={};dict[lang][en]={it,fr,es}[lang];}if(dict.en)dict.en[en]=en;});
  fs.writeFileSync(p,'window.atlasData='+JSON.stringify(data,null,2)+';\n');
  fs.writeFileSync(ip,'window.atlasTranslations='+JSON.stringify(dict,null,2)+';\n');
 }
}
const illustrated=catalogue.books.filter(b=>b.mapType==='illustrated');
const mapChanges=[];
for(const book of illustrated){
 const file=`${root}/${book.id}.tsv`;if(!fs.existsSync(file))continue;
 const p=`docs/data/${book.id}-local.js`,data=load(p,'atlasIllustratedLocal');
 const rows=fs.readFileSync(file,'utf8').trim().split(/\r?\n/).map(l=>l.split('|'));
 if(rows.length!==data.chapterRanges.length||rows.some(r=>r.length!==4||r.some(v=>!v.trim())))throw Error(`${book.id}: incomplete illustrated introductions`);
 data.chapterIntroductions=rows.map(([en,it,fr,es])=>({en,it,fr,es}));
 fs.writeFileSync(p,'window.atlasIllustratedLocal='+JSON.stringify(data,null,2)+';\n');
 mapChanges.push({book_id:book.id,introductions:data.chapterIntroductions});
}
fs.writeFileSync(root+'/changes.json',JSON.stringify(changes,null,2)+'\n');
const q=v=>"'"+String(v).replaceAll("'","''")+"'";
const queries=changes.map(c=>`update public.sections set metadata=jsonb_set(metadata,'{text}',to_jsonb(${q(c.text)}::text)) where book_id=${q(c.book_id)} and id=${c.id};\n`+Object.entries(c.translations).map(([lang,value])=>`insert into public.content_translations(book_id,language,source_hash,source_text,translated_text) values(${q(c.book_id)},${q(lang)},${q(crypto.createHash('sha256').update(c.text).digest('hex'))},${q(c.text)},${q(value)}) on conflict(book_id,language,source_hash) do update set source_text=excluded.source_text,translated_text=excluded.translated_text;`).join('\n'));
fs.writeFileSync(root+'/publish.sql','begin;\n'+queries.join('\n')+'\ncommit;\nselect book_id,count(*) from public.sections group by book_id order by book_id;\n');
const chunks=[];
for(let i=0;i<changes.length;i+=100){
 const rows=changes.slice(i,i+100).map(({book_id,id,text,translations})=>({book_id,id,text,source_hash:crypto.createHash('sha256').update(text).digest('hex'),translations}));
 const payload=JSON.stringify(rows);
 chunks.push(`begin;\ndo $check$ begin if (select count(*) from public.sections s join jsonb_to_recordset($intro$${payload}$intro$::jsonb) as r(book_id text,id integer) using(book_id,id))<>${rows.length} then raise exception 'Missing sections'; end if; end $check$;\nwith incoming as (select * from jsonb_to_recordset($intro$${payload}$intro$::jsonb) as r(book_id text,id integer,text text,source_hash text,translations jsonb)), changed as (update public.sections s set metadata=jsonb_set(s.metadata,'{text}',to_jsonb(r.text)) from incoming r where s.book_id=r.book_id and s.id=r.id returning s.id) insert into public.content_translations(book_id,language,source_hash,source_text,translated_text) select r.book_id,t.key,r.source_hash,r.text,t.value from incoming r cross join lateral jsonb_each_text(r.translations) t on conflict(book_id,language,source_hash) do update set source_text=excluded.source_text,translated_text=excluded.translated_text;\ncommit;\nselect 'Introductions ${i+1}–${i+rows.length} applied' as result;\n`);
}
for(const map of mapChanges)chunks.push(`begin;\ndo $check$ begin if not exists(select 1 from public.book_maps where book_id=${q(map.book_id)} and id='reading-map') then raise exception 'Illustrated map missing'; end if; end $check$;\nupdate public.book_maps set metadata=jsonb_set(metadata,'{illustratedAtlas,chapterIntroductions}',$intro$${JSON.stringify(map.introductions)}$intro$::jsonb) where book_id=${q(map.book_id)} and id='reading-map';\ncommit;\nselect jsonb_array_length(metadata#>'{illustratedAtlas,chapterIntroductions}') as introductions from public.book_maps where book_id=${q(map.book_id)} and id='reading-map';\n`);
chunks.forEach((sql,i)=>fs.writeFileSync(`${root}/${String(i+1).padStart(2,'0')}-publish.sql`,sql));
const expected=crypto.createHash('md5').update(changes.slice().sort((a,b)=>a.book_id.localeCompare(b.book_id)||a.id-b.id).map(c=>`${c.book_id}:${c.id}:${c.text}`).join('\n')).digest('hex');
fs.writeFileSync(root+'/expected.json',JSON.stringify({sections:changes.length,translations:changes.length*3,sectionHash:expected,illustrated:mapChanges.map(m=>({id:m.book_id,chapters:m.introductions.length,hash:crypto.createHash('md5').update(m.introductions.map(v=>v.en).join('\n')).digest('hex')}))},null,2)+'\n');
console.log(`${changes.length} section introductions and ${mapChanges.reduce((n,m)=>n+m.introductions.length,0)} illustrated introductions prepared in ${chunks.length} targeted publication scripts.`);
