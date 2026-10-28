const fs=require('fs'),crypto=require('crypto'),assert=require('assert/strict');
const before=require('./before.json'),crime=require('../../work/crime-and-punishment/sections.json'),holden=require('../../docs/data/holden-original.json');
const q=s=>"'"+String(s).replaceAll("'","''")+"'",md5=s=>crypto.createHash('md5').update(s).digest('hex');
const corrections=[
 {section:6,quote:'Тут ему вспомнились его собственные прогулки по Сенной, и он на минуту очнулся.',category:'mentioned',reason:'Il passo ricorda le passeggiate precedenti sulla Sennaja durante un tragitto altrove; non mette in scena un nuovo evento nella piazza.'},
 {section:13,quote:'Раскольников пошел прямо и вышел к тому углу на Сенной, где торговали мещанин и баба, разговаривавшие тогда с Лизаветой; но теперь их не было.',category:'action',reason:'Scena principale: Raskolnikov raggiunge l’angolo della Sennaja, si ferma, si guarda intorno e rivolge una domanda a un giovane.'}
];
let sql='begin;\n';
for(const c of corrections){const source=crime.find(s=>s.id===c.section);assert(source.text.includes(c.quote));const ref=before.place_references.find(r=>r.book_id==='crime-and-punishment'&&r.id===c.section+':core:haymarket'),e=before.excerpts.find(e=>e.book_id===ref.book_id&&e.reference_id===ref.id&&e.slot==='original');assert(e);
 const review={reviewedAt:'2026-10-27',scope:'specific-section-source-correction',narrativeLevel:'main narrative',reason:c.reason,sourceSection:source.title,sourceSha256:crypto.createHash('sha256').update(source.text).digest('hex')};
 sql+=`do $nl_evidence$ begin if not exists(select 1 from public.excerpts where book_id='crime-and-punishment' and id=${q(e.id)} and md5(quote) in (${q(md5(e.quote))},${q(md5(c.quote))})) then raise exception 'Crime evidence changed'; end if; end $nl_evidence$;\n`;
 sql+=`update public.excerpts set quote=${q(c.quote)},metadata=coalesce(metadata,'{}'::jsonb)||jsonb_build_object('highlightTerms',jsonb_build_array('Сенной'),'sourceCorrection',${q(JSON.stringify(review))}::jsonb) where book_id='crime-and-punishment' and id=${q(e.id)};\n`;
 sql+=`update public.place_references set category=${q(c.category)},metadata=metadata||jsonb_build_object('categoryReview',${q(JSON.stringify(review))}::jsonb) where book_id='crime-and-punishment' and id=${q(ref.id)};\n`;
}
const h=holden.find(s=>s.id===2);assert(h.text.includes('blanket that he and Mrs. Spencer\'d bought off some Indian in Yellowstone Park.'));
const hr={reviewedAt:'2026-10-27',narrativeLevel:'reported purchase within a recalled visit to Spencer',reason:'Il ricordo mette in scena Spencer che mostra una coperta; l’acquisto a Yellowstone è una notizia sulla sua provenienza, senza una scena narrata nel parco.',sourceSection:2,pages:[h.pageStart,h.pageEnd],sourceSha256:crypto.createHash('sha256').update(h.text).digest('hex')};
const holdenRef=before.place_references.find(r=>r.book_id==='holden'&&r.id==='2:core:yellowstone');
sql+=`do $nl_hold$ begin if not exists(select 1 from public.place_references where book_id='holden' and id='2:core:yellowstone' and md5(scene_text)=${q(md5(holdenRef.scene_text))}) then raise exception 'Holden source changed'; end if; end $nl_hold$;\n`;
sql+=`update public.place_references set category='mentioned',metadata=metadata||jsonb_build_object('categoryReview',${q(JSON.stringify(hr))}::jsonb) where book_id='holden' and id='2:core:yellowstone';\ncommit;\nselect book_id,id,category from public.place_references where (book_id='holden' and id='2:core:yellowstone') or (book_id='crime-and-punishment' and id in ('6:core:haymarket','13:core:haymarket')) order by book_id,id;`;
fs.writeFileSync(__dirname+'/release/source-corrections.sql',sql);fs.writeFileSync(__dirname+'/release/source-corrections.json',JSON.stringify({corrections,holden:hr},null,2));
console.log('Prepared two section-specific Russian evidence corrections and the conservative Yellowstone classification, backed by full local sections.');
