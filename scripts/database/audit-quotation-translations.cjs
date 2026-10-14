const fs=require('node:fs'),vm=require('node:vm');
const load=(file,key)=>{const c={window:{}};vm.runInNewContext(fs.readFileSync(file,'utf8'),c);return c.window[key];};
const catalogue=load('docs/content/books.js','atlasCatalogue'),rows=[];
const available=passage=>!!passage?.quote?.trim()&&!['pending','rejected'].includes(passage.verificationStatus);
for(const book of catalogue.books){
 let data;
 if(book.mapType==='illustrated'){
  const payload=load(`docs/data/${book.id}-local.js`,'atlasIllustratedLocal');
  const c={window:{}};vm.runInNewContext(fs.readFileSync('docs/fictional-atlas-adapter.js','utf8'),c);
  data=c.window.IllustratedAdapter.adapt(payload,'en');
 }else data=load(`docs/data/${book.id}.js`,'atlasData');
 const records=[];
 for(const chapter of data.chapters){
  const add=(kind,id,group)=>records.push({section:chapter.id,kind,id,group});
  if(chapter.excerpts||chapter.excerpt)add('section',null,chapter.excerpts||chapter.excerpt);
  for(const id of chapter.places){const group=chapter.placeExcerpts?.[id];add('core',id,group||{original:{quote:chapter.placeQuotes?.[id],language:book.originalLanguage}});}
  for(const ref of chapter.citations||[])add('cited',ref.placeId,ref.excerpt);
  for(const item of chapter.unlocatedPlaces||[])add('unlocated',item.id||item.name,item.excerpt||{original:{quote:item.quote,language:item.language||book.originalLanguage},translations:item.translations});
 }
 const counts=Object.fromEntries(['en','it','fr','es'].map(language=>[language,records.filter(r=>available(r.group?.original?.language===language?r.group.original:r.group?.translations?.[language])).length]));
 rows.push({book:book.id,title:book.title,total:records.length,available:counts,pending:records.map(({group,...record})=>({...record,languages:['en','it','fr','es'].filter(l=>!available(group?.original?.language===l?group.original:group?.translations?.[l]))})).filter(r=>r.languages.length)});
}
fs.writeFileSync('research/translations/coverage.json',JSON.stringify({date:'2026-10-14',rows},null,2)+'\n');
let text='# Copertura delle citazioni nella lingua selezionata\n\nVerifica delle copie locali al 14 ottobre 2026. I conteggi comprendono i gruppi introduttivi, i luoghi mappati, le menzioni e i luoghi senza coordinate; non sono conteggi di testi unici. «Disponibile» comprende l’originale quando coincide con la lingua selezionata. La disponibilità non equivale a una nuova verifica dei diritti di tutti i contenuti preesistenti.\n\n| Opera | Gruppi | EN | IT | FR | ES |\n| --- | ---: | ---: | ---: | ---: | ---: |\n';
for(const r of rows)text+=`| ${r.title} | ${r.total} | ${r.available.en} | ${r.available.it} | ${r.available.fr} | ${r.available.es} |\n`;
text+='\nLe celle inferiori al totale rappresentano lacune ancora da colmare con passi editoriali autentici e verificati. Il registro locale coverage.json elenca ogni associazione e lingua pendente. Non vengono generate traduzioni e attribuite a traduttori editoriali.\n';
fs.writeFileSync('research/translations/COPERTURA.md',text);
console.log(rows.map(r=>({book:r.book,total:r.total,...r.available})));
