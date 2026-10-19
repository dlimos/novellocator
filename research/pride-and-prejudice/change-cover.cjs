// Reproducible, narrowly scoped cover replacement. No remote writes.
const fs=require('node:fs'),vm=require('node:vm');
const id='pride-and-prejudice',dir='research/'+id,out='database/generated/'+id;
const alt='Thomas Gainsborough, Mr and Mrs William Hallett (The Morning Walk), 1785';
const cover={src:'images/pride-and-prejudice-gainsborough-morning-walk.jpg',alt,width:833,height:1100,position:'center 20%',banner:{opacity:.20,mobileOpacity:.14}};
const credit={artist:'Thomas Gainsborough',title:'Mr and Mrs William Hallett (The Morning Walk)',year:'1785',url:'https://www.nationalgallery.org.uk/paintings/thomas-gainsborough-mr-and-mrs-william-hallett-the-morning-walk',reproduction:'Wikimedia Commons · faithful public-domain reproduction',reproductionUrl:'https://upload.wikimedia.org/wikipedia/commons/2/26/Mr_and_Mrs_William_Hallett.jpg',license:'Public domain · PD-Art / Public Domain Mark 1.0',licenseUrl:'https://commons.wikimedia.org/wiki/File:Mr_and_Mrs_William_Hallett.jpg',reuseNote:'A couple walking arm in arm through English parkland evokes courtship, marriage and the landed society of Austen. Painted in 1785, before the novel; it is not an illustration of Elizabeth Bennet and Mr Darcy.'};
const translations={en:{[alt]:alt},it:{[alt]:'Thomas Gainsborough, La passeggiata mattutina (Mr e Mrs William Hallett), 1785'},fr:{[alt]:'Thomas Gainsborough, La Promenade du matin (Mr et Mrs William Hallett), 1785'},es:{[alt]:'Thomas Gainsborough, El paseo matutino (Mr y Mrs William Hallett), 1785'}};
const documentation=`## Pride and Prejudice — Thomas Gainsborough

- Mr and Mrs William Hallett (The Morning Walk), Thomas Gainsborough, 1785. Oil on canvas, 236.2 × 179.1 cm. National Gallery, London, NG6209.
- Museum source: ${credit.url}
- Reproduction source and rights: ${credit.licenseUrl}
- Original file: ${credit.reproductionUrl} (833 × 1100 pixels; downloaded without alteration).
- Rights verified 19 October 2026: Gainsborough died in 1788; the painting is public domain in Italy/EU (life plus 70 years) and the United States (published before 1931). Commons identifies this faithful two-dimensional reproduction as PD-Art, Public Domain Mark 1.0. No modern creative adaptation is asserted; the museum's separate reproduction service is not the source of this file.
- Connection: William Hallett and Elizabeth Stephen walking arm in arm in parkland, painted shortly before their marriage in 1785. Courtship, marriage, walking and landed English society connect thematically with Austen. The portrait predates the novel (1813) and does not depict its characters or identify its fictional estates.
- Selected by the user on 19 October 2026, replacing Constable's Wivenhoe Park, Essex (1816). The previous asset is retained. The card uses a CSS crop at center 20% to preserve both faces; the underlying reproduction is unchanged.
- Public catalogue attribution displays only artist, linked title and year.
- Three imaginary views were generated with the built-in image_gen tool: Hertfordshire, Hunsford/Rosings, Pemberley. Prompts and textual/interpretative distinctions: research/pride-and-prejudice/views-prompts.json and views-evidence.md. These generated views are not catalogue images.
`;
const ctx={window:{}};vm.runInNewContext(fs.readFileSync('docs/content/books.js','utf8'),ctx);
const book=ctx.window.atlasCatalogue.books.find(b=>b.id===id);if(!book)throw Error('Missing book');book.cover=cover;book.credit=credit;
fs.writeFileSync('docs/content/books.js','window.atlasCatalogue='+JSON.stringify(ctx.window.atlasCatalogue,null,2)+';\n');
const cf='docs/images/CREDITS.md',old=fs.readFileSync(cf,'utf8');
fs.writeFileSync(cf,old.replace(/## Pride and Prejudice —[^\n]*\n[\s\S]*?(?=\n## |$)/,documentation.trimEnd()));
const tf='docs/content/book-translations.js',marker='// pride-and-prejudice cover strings',end='// end pride-and-prejudice cover strings';let t=fs.readFileSync(tf,'utf8');
if(t.includes(marker))t=t.slice(0,t.indexOf(marker))+t.slice(t.indexOf(end)+end.length);
fs.writeFileSync(tf,t+'\n'+marker+'\n(function(){const additions='+JSON.stringify(translations)+';for(const [language,strings] of Object.entries(additions))Object.assign(window.atlasLocaleData.messages[language],strings);})();\n'+end+'\n');
// Keep the original full-import generator aligned with the selected artwork.
const pf=dir+'/presentation.cjs';let p=fs.readFileSync(pf,'utf8').replaceAll('\r\n','\n');
p=p.replace(/cover:\{src:[\s\S]*?\}\};\nconst i=/,'cover:'+JSON.stringify(cover)+',credit:'+JSON.stringify(credit)+'};\nconst i=');
p=p.replace(/const credits=`[\s\S]*?`;\nconst cf=/,'const credits='+JSON.stringify('\n\n'+documentation)+';\nconst cf=');
fs.writeFileSync(pf,p);
const row=require('../../scripts/database/prepare-presentation.cjs').prepare().rows.find(r=>r.book_id===id);row.artwork_documentation=documentation;
fs.writeFileSync(out+'/presentation.json',JSON.stringify(row,null,2)+'\n');
const lit=v=>'$cover$'+(typeof v==='string'?v:JSON.stringify(v))+'$cover$';
const patches=Object.entries(translations).map(([lang,m])=>`'${lang}',coalesce(translations->'${lang}','{}'::jsonb)||${lit(m)}::jsonb`).join(',');
const sql=`begin;\nupdate public.book_presentations set presentation=jsonb_set(jsonb_set(presentation,'{cover}',${lit(cover)}::jsonb),'{credit}',${lit(credit)}::jsonb),translations=translations||jsonb_build_object(${patches}),artwork_documentation=${lit(documentation)},updated_at=now() where book_id='${id}' returning book_id,catalogue_order,presentation->'cover' as cover,presentation->'credit' as credit;\ncommit;\n`;
fs.writeFileSync(out+'/cover-update.sql',sql);
fs.writeFileSync(dir+'/cover-change.json',JSON.stringify({bookId:id,date:'2026-10-19',cover,credit,translations,documentation,publication:'prepared; use scoped cover-update.sql without changing catalogue order, theme or narrative data'},null,2)+'\n');
const rf=dir+'/README.md';fs.writeFileSync(rf,fs.readFileSync(rf,'utf8').replace(/^Copertina:.*$/m,`Copertina scelta dall’utente il 19 ottobre 2026: **Thomas Gainsborough, *La passeggiata mattutina (Mr and Mrs William Hallett)*, 1785**, National Gallery, Londra, NG6209. Fonte: ${credit.url} . Riproduzione fedele di pubblico dominio da Wikimedia Commons (PD-Art). La coppia a passeggio richiama corteggiamento, matrimonio e società inglese; non raffigura Elizabeth e Darcy. Crediti pubblici limitati a artista, titolo collegato e anno. Fonti e diritti documentati in \`cover-change.json\`; aggiornamento remoto limitato a immagine, crediti e testi alternativi.`));
console.log('Prepared scoped cover update, local catalogue, credits, translations and research documentation.');
