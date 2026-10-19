const fs=require('node:fs'),vm=require('node:vm');
const id='pride-and-prejudice',dir='research/'+id,out='database/generated/'+id,langs=['en','it','fr','es'];
const audit=JSON.parse(fs.readFileSync(dir+'/publication-audit.json','utf8'));
const ctx={window:{}};vm.runInNewContext(fs.readFileSync('docs/content/books.js','utf8'),ctx);const catalogue=JSON.parse(JSON.stringify(ctx.window.atlasCatalogue));
const book={id,title:'Pride and Prejudice',author:'JANE AUSTEN',description:audit.description[0],ariaLabel:'Explore Pride and Prejudice by Jane Austen',setting:'HERTFORDSHIRE / KENT / DERBYSHIRE',mapType:'geographic',theme:'austen-letters',stylesheet:'themes/'+id+'.css',originalLanguage:'en',cover:{src:'images/pride-and-prejudice-constable.jpg',alt:'John Constable, Wivenhoe Park, Essex, 1816',width:1800,height:975,position:'center 50%',banner:{opacity:.20,mobileOpacity:.14}},credit:{artist:'John Constable',title:'Wivenhoe Park, Essex',year:'1816',url:'https://www.nga.gov/artworks/1147-wivenhoe-park-essex',reproduction:'National Gallery of Art · Open Access',reproductionUrl:'https://api.nga.gov/iiif/c49fa4a0-1e3a-4038-b7dd-ad9036146e73/full/full/0/default.jpg',license:'Public domain · NGA Open Access',licenseUrl:'https://www.nga.gov/open-access-policy',reuseNote:'English country-estate landscape painted three years after the novel. The park, water and gentleman’s house evoke the social landscape of Austen; this is not a depiction or identification of Pemberley or another fictional estate.'}};
const i=catalogue.books.findIndex(b=>b.id===id);if(i<0)catalogue.books.push(book);else catalogue.books[i]=book;
fs.writeFileSync('docs/content/books.js','window.atlasCatalogue='+JSON.stringify(catalogue,null,2)+';\n');
// A folded letter: the novel's misunderstandings turn on correspondence.
const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 180"><g fill="none" stroke="#516a60" stroke-opacity=".12" stroke-width="1.3"><path d="M49 58h112v70H49zM49 58l56 43 56-43M49 128l43-38M161 128l-43-38"/><circle cx="105" cy="104" r="7"/><path d="M71 145h68M85 153h40"/></g></svg>';
const s=`html[data-book="${id}"]`;
const css=`/* Austen: folded letters, sage, warm paper, restrained plum. */
${s}{--ink:#293a33;--muted:#526159;--paper:#e9e6db;--panel:#fffdf5;--wash:#f2eee3;--line:#b5beb1;--accent:#805568;--heading-font:Georgia,serif}
${s} body{padding:36px 0;background:var(--paper) url("data:image/svg+xml,${encodeURIComponent(svg)}") repeat;background-size:210px 180px}
${s} .masthead,${s} main{background:transparent}
${s} .introduction{background:linear-gradient(115deg,#faf6e9,#dce3d7);border-top:5px solid #516a60;border-bottom:2px solid #967184;padding:32px;min-height:235px}
${s} .introduction #title{font-family:Georgia,serif;font-weight:400;font-size:clamp(43px,5.5vw,74px);line-height:1.08;letter-spacing:-.03em;max-width:80%}
${s} #book-author{color:#805568;letter-spacing:.16em}
${s} .introduction::after{width:54%;opacity:.22;background-position:center}
${s} .workspace{border-top:4px solid #516a60;box-shadow:0 5px 22px #293a3318}
${s} .detail h2,${s} .sidebar-title h2{font-family:Georgia,serif;font-weight:400}
${s} .original-excerpt blockquote,${s} .location-evidence blockquote{background:#f8f4e8;border-left:4px solid #967184;color:#293a33;line-height:1.8}
${s} .masthead>.brand,${s} .masthead>.edition,${s} .masthead>.language-picker,${s} footer>p,${s} footer>details{background:#e9e6dbed;padding:5px 8px;border-radius:3px}
.book-card[data-book="${id}"]{--card-bg:#e8ecdf;--card-ink:#293a33;--card-line:#b5beb1;--card-accent:#805568;background:var(--card-bg);color:var(--card-ink);border-top:6px solid #516a60}
.book-card[data-book="${id}"] .book-copy{background:var(--card-bg)}
.book-card[data-book="${id}"] .book-copy h2{font-family:Georgia,serif;font-weight:400;color:var(--card-ink)}
.book-card[data-book="${id}"] .book-copy>p,.book-card[data-book="${id}"] .book-meta{color:var(--card-ink)}
.book-card[data-book="${id}"] .book-art img{filter:none}
@media(max-width:700px){${s} body{padding:24px 0;background-size:160px 137px}${s} .introduction{padding:24px 20px;min-height:0}${s} .introduction #title{font-size:43px;max-width:100%}${s} .introduction::after{width:75%;opacity:.16}}
`;
fs.writeFileSync('docs/themes/'+id+'.css',css);
const entries=[['Pride and Prejudice','Orgoglio e pregiudizio','Orgueil et Préjugés','Orgullo y prejuicio'],audit.description,['Explore Pride and Prejudice by Jane Austen','Esplora Orgoglio e pregiudizio di Jane Austen','Explorer Orgueil et Préjugés de Jane Austen','Explora Orgullo y prejuicio de Jane Austen']];
const additions=Object.fromEntries(langs.map((l,i)=>[l,Object.fromEntries(entries.map(v=>[v[0],v[i]]))]));
const marker='// pride-and-prejudice editorial strings',end='// end pride-and-prejudice editorial strings',file='docs/content/book-translations.js';let text=fs.readFileSync(file,'utf8');
if(text.includes(marker)){const a=text.indexOf(marker),b=text.indexOf(end,a);if(b<0)throw Error('Missing block end');text=text.slice(0,a)+text.slice(b+end.length);}
fs.writeFileSync(file,text+'\n'+marker+'\n(function(){const additions='+JSON.stringify(additions)+';for(const [language,strings] of Object.entries(additions))Object.assign(window.atlasLocaleData.messages[language],strings);})();\n'+end+'\n');
const credits=`\n\n## Pride and Prejudice — John Constable\n\n- Wivenhoe Park, Essex, John Constable, 1816. Oil on canvas, National Gallery of Art, Widener Collection, accession 1942.9.10.\n- Museum source: ${book.credit.url}\n- Download: ${book.credit.reproductionUrl}\n- NGA states this object’s media is free and in the public domain; Open Access reuse. Constable died 1837. Faithful reproduction, no modern creative adaptation. Verified 19 October 2026.\n- Connection: an English country estate of Austen’s period, with house, park and water; evokes landscape, property and social visits. It does not identify a fictional estate or claim direct illustration.\n- The catalogue displays only artist, linked title and year.\n- Three imaginary views were generated with the built-in image_gen tool: Hertfordshire, Hunsford/Rosings, Pemberley. Prompts and textual/interpretative distinctions: research/pride-and-prejudice/views-prompts.json and views-evidence.md. These generated views are not catalogue images.\n`;
const cf='docs/images/CREDITS.md';if(!fs.readFileSync(cf,'utf8').includes('## Pride and Prejudice —'))fs.appendFileSync(cf,credits);
const {prepare}=require('../../scripts/database/prepare-presentation.cjs');const row=prepare().rows.find(r=>r.book_id===id);row.artwork_documentation=credits;
const lit=v=>"E'"+String(v).replaceAll('\\','\\\\').replaceAll("'","''").replaceAll('\r','\\r').replaceAll('\n','\\n')+"'";
const keys=Object.keys(row),values=keys.map(k=>typeof row[k]==='object'?lit(JSON.stringify(row[k]))+'::jsonb':typeof row[k]==='number'||typeof row[k]==='boolean'?String(row[k]):lit(row[k]));
fs.mkdirSync(out,{recursive:true});fs.writeFileSync(out+'/presentation.json',JSON.stringify(row,null,2)+'\n');fs.writeFileSync(out+'/presentation.sql',`begin;\ninsert into public.book_presentations (${keys.join(',')}) select ${values.join(',')} where exists(select 1 from public.books where id=${lit(id)}) on conflict(book_id) do update set ${keys.filter(k=>k!=='book_id').map(k=>`${k}=excluded.${k}`).join(',')},updated_at=now();\ncommit;\n`);
console.log('Prepared local catalogue entry, theme, translations and presentation SQL. No remote writes.');
