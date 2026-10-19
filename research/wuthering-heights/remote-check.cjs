const fs=require('node:fs'),crypto=require('node:crypto');
const dir='database/generated/wuthering-heights/',b=JSON.parse(fs.readFileSync(dir+'content.json','utf8')),p=JSON.parse(fs.readFileSync(dir+'presentation.json','utf8'));
const md5=s=>crypto.createHash('md5').update(s).digest('hex');
const activeHashes=[...new Set(b.tables.content_translations.map(r=>r.source_hash))].map(h=>"'"+h+"'").join(',');
const activeDictionary=`book_id='wuthering-heights' and source_hash in (${activeHashes})`;
// PostgreSQL order is made bytewise explicit; use the same order locally.
const ordered=(rows,key)=>[...rows].sort((a,b)=>Buffer.compare(Buffer.from(key(a)),Buffer.from(key(b))));
const digests={cssMd5:md5(p.css),excerptsMd5:md5(ordered(b.tables.excerpts,r=>r.id).map(r=>r.id+':'+r.quote).join('\n')),translationsMd5:md5(ordered(b.tables.content_translations,r=>r.language+':'+r.source_hash).map(r=>r.language+':'+r.source_hash+':'+r.translated_text).join('\n'))};
const checks=[...Object.entries(b.tables).filter(([t])=>t!=='sources').map(([t,r])=>`(select count(*) from public.${t} where ${t==='content_translations'?activeDictionary:`${t==='books'?'id':'book_id'}='wuthering-heights'`})=${r.length}`),
`(select md5(css) from public.book_presentations where book_id='wuthering-heights')='${digests.cssMd5}'`,
`(select md5(string_agg(id||':'||quote,E'\\n' order by id collate "C")) from public.excerpts where book_id='wuthering-heights')='${digests.excerptsMd5}'`,
`(select md5(string_agg(language||':'||source_hash||':'||translated_text,E'\\n' order by (language||':'||source_hash) collate "C")) from public.content_translations where ${activeDictionary})='${digests.translationsMd5}'`,
`(select count(*) from public.place_references where book_id='wuthering-heights' and category='action')=77`,
`(select metadata->'analysisCoverage'->>'fullNarrativeRereadComplete' from public.books where id='wuthering-heights')='true'`];
const condition=checks.join('\n and ');
fs.writeFileSync(dir+'sql-editor/verifica.sql',`select id,publication_status,(${condition}) as verified from public.books where id='wuthering-heights';\n`);
fs.writeFileSync(dir+'publish.sql',`begin;\ndo $$begin if not (${condition}) then raise exception 'Wuthering Heights verification failed'; end if; end$$;\nupdate public.books set publication_status='published' where id='wuthering-heights' and publication_status='draft';\ncommit;\nselect id,publication_status from public.books where id='wuthering-heights';\n`);
fs.writeFileSync(dir+'digests.json',JSON.stringify(digests,null,2)+'\n');
console.log(digests);
