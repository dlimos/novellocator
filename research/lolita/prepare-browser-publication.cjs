// Supabase SQL Editor has a request-size limit. Transfer text chunks into a
// short-lived, RLS-protected staging table, then apply the same atomic release.
const fs=require('fs'),crypto=require('crypto');
const dir='work/lolita-final-review/',sql=fs.readFileSync(dir+'publish.sql','utf8');
const changes=JSON.parse(fs.readFileSync(dir+'changes.json'));
const payload=JSON.stringify(changes.map(ch=>({table:ch.table,keys:ch.keys,before:ch.before,after:ch.after,...(!ch.before?{row:ch.row}:{})})));
const sha=crypto.createHash('sha256').update(payload).digest('hex');
const stage='_lolita_review_01a17f40',lit=s=>"'"+s.replaceAll("'","''")+"'";
const files=[],parts=[];for(let start=0;start<payload.length;start+=110000)parts.push(payload.slice(start,start+110000));
for(let i=0;i<parts.length;i++){
 const pre=i===0?`create table if not exists public.${stage}(part integer primary key,body text not null);\nalter table public.${stage} enable row level security;\nrevoke all on public.${stage} from public,anon,authenticated;\n`:'';
 const body=`begin;\n${pre}insert into public.${stage}(part,body) values(${i},${lit(parts[i])}) on conflict(part) do update set body=excluded.body;\ncommit;\nselect ${i+1} as transferred_part,${parts.length} as total_parts;\n`;
 const file=`transfer-${String(i+1).padStart(2,'0')}.sql`;fs.writeFileSync(dir+file,body);files.push(file);
}
const originalLine=sql.split('\n').find(l=>l.startsWith('create temporary table lolita_final_patch'));
const replacement=`do $payload$ begin if (select count(*) from public.${stage})<>${parts.length} or (select encode(sha256(convert_to(string_agg(body,'' order by part),'UTF8')),'hex') from public.${stage})<>${lit(sha)} then raise exception 'Incomplete or changed Lolita transfer';end if;end $payload$;\ncreate temporary table lolita_final_patch on commit drop as select value as patch from jsonb_array_elements((select string_agg(body,'' order by part)::jsonb from public.${stage}));`;
const final=sql.replace(originalLine,replacement).replace('\ncommit;\n',`\ndrop table public.${stage};\ncommit;\n`);
fs.writeFileSync(dir+'apply-transfer.sql',final);files.push('apply-transfer.sql');
fs.writeFileSync(dir+'transfer-manifest.json',JSON.stringify({stage,payloadSha256:sha,parts:parts.length,files},null,2)+'\n');
console.log({parts:parts.length,largestSql:Math.max(...files.map(f=>fs.statSync(dir+f).size)),payloadSha256:sha});
