const fs=require('node:fs'),vm=require('node:vm');
const id='wuthering-heights',out='database/generated/'+id;
const editorial=JSON.parse(fs.readFileSync('research/'+id+'/editorial.json','utf8'));
const ctx={window:{}};vm.runInNewContext(fs.readFileSync('docs/content/books.js','utf8'),ctx);
const catalogue=JSON.parse(JSON.stringify(ctx.window.atlasCatalogue));
const book={id,title:'Wuthering Heights',author:'EMILY BRONTË',description:editorial.description[0],ariaLabel:'Explore Wuthering Heights by Emily Brontë',setting:'YORKSHIRE / MOORLAND',mapType:'geographic',theme:'moorland',stylesheet:'themes/'+id+'.css',originalLanguage:'en',cover:{src:'images/wuthering-heights-friedrich.jpg',alt:'Cairn in Snow (Hünengrab im Schnee), Caspar David Friedrich, 1807',width:2020,height:1535,position:'center 58%',banner:{opacity:.19,mobileOpacity:.13}},credit:{artist:'Caspar David Friedrich',title:'Hünengrab im Schnee',year:'1807',url:'https://skd-online-collection.skd.museum/Details/Index/241955',reproduction:'Wikimedia Commons · faithful two-dimensional reproduction',reproductionUrl:'https://commons.wikimedia.org/wiki/File:Huenengrab_im_Schnee_(C_D_Friedrich).jpg',license:'Public domain · PD-Art',licenseUrl:'https://commons.wikimedia.org/wiki/Commons:Reuse_of_PD-Art_photographs',reuseNote:'Thematic connection: exposed winter landscape, bare trees, stone burial and Romantic meditations on death. The painting is not a view of Yorkshire and is not claimed to illustrate the novel.'}};
const index=catalogue.books.findIndex(b=>b.id===id);if(index<0)catalogue.books.push(book);else catalogue.books[index]=book;
fs.writeFileSync('docs/content/books.js','window.atlasCatalogue='+JSON.stringify(catalogue,null,2)+';\n');
const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 160"><g fill="none" stroke="#70636f" stroke-opacity=".20" stroke-width="1.5" stroke-linecap="round"><path d="M24 137Q74 119 137 137M84 132Q90 104 74 70L55 42M78 83L111 67L138 57M82 102L52 92L37 72M64 56L77 38M108 69L119 42M117 65L140 76M49 87L25 92M57 44L32 38M105 24Q131 12 157 24M114 30Q140 18 169 32M120 112Q145 99 171 111"/><path d="M43 139v-15h12v14M38 124l11-10 12 10"/></g></svg>';
const s=`html[data-book="${id}"]`;
const css=`/* Wuthering Heights: heather, weathered stone, ivory and a wind-bent hawthorn. */
${s}{--ink:#303936;--muted:#5b635d;--paper:#e1ddd3;--panel:#fbf8ee;--wash:#ede7dc;--line:#b3aaa6;--accent:#735c78;--heading-font:Georgia,serif}
${s} body{padding:36px 0;background:var(--paper) url("data:image/svg+xml,${encodeURIComponent(svg)}") repeat;background-size:180px 160px}
${s} .masthead,${s} main{background:transparent}
${s} .introduction{background:linear-gradient(110deg,#f6f0e4,#d7d9cf);border-top:5px solid #4b5850;border-bottom:2px solid #8d728f;min-height:235px;padding:32px}
${s} .introduction #title{font-family:Georgia,serif;font-weight:400;font-size:clamp(43px,5.5vw,76px);line-height:1.06;letter-spacing:-.035em;max-width:78%}
${s} #book-author{color:#735c78;letter-spacing:.15em}
${s} .introduction::after{width:53%;opacity:.25;background-position:center 54%}
${s} .workspace{border-top:4px solid #4b5850;box-shadow:0 5px 22px #30393618}
${s} .detail h2,${s} .sidebar-title h2{font-family:Georgia,serif;font-weight:400}
${s} .original-excerpt blockquote,${s} .location-evidence blockquote{background:#f6f0e4;border-left:4px solid #8d728f;color:#303936;line-height:1.8}
${s} .masthead>.brand,${s} .masthead>.edition,${s} .masthead>.language-picker,${s} footer>p,${s} footer>details{background:#e1ddd3ed;border-radius:3px;padding:5px 8px}
.book-card[data-book="${id}"]{--card-bg:#e9e2d7;--card-ink:#303936;--card-line:#b3aaa6;--card-accent:#735c78;background:var(--card-bg);color:var(--card-ink);border-top:6px solid #4b5850}
.book-card[data-book="${id}"] .book-copy{background:var(--card-bg)}
.book-card[data-book="${id}"] .book-copy h2{font-family:Georgia,serif;font-weight:400;color:var(--card-ink)}
.book-card[data-book="${id}"] .book-copy>p,.book-card[data-book="${id}"] .book-meta{color:var(--card-ink)}
.book-card[data-book="${id}"] .book-art img{filter:none}
@media(max-width:700px){${s} body{padding:24px 0;background-size:135px 120px}${s} .introduction{padding:24px 20px;min-height:0}${s} .introduction #title{font-size:44px;max-width:100%}${s} .introduction::after{width:75%;opacity:.18}}
`;
fs.writeFileSync('docs/themes/'+id+'.css',css);
const entries=[
 ['Wuthering Heights','Cime tempestose','Les Hauts de Hurlevent','Cumbres borrascosas'],
 ['Explore Wuthering Heights by Emily Brontë','Esplora Cime tempestose di Emily Brontë','Explorer Les Hauts de Hurlevent d’Emily Brontë','Explora Cumbres borrascosas de Emily Brontë'],
 ['YORKSHIRE / MOORLAND','YORKSHIRE / BRUGHIERA','YORKSHIRE / LANDE','YORKSHIRE / PÁRAMO'],
 editorial.description,
 ['Cairn in Snow (Hünengrab im Schnee), Caspar David Friedrich, 1807','Dolmen nella neve (Hünengrab im Schnee), Caspar David Friedrich, 1807','Tombe mégalithique dans la neige (Hünengrab im Schnee), Caspar David Friedrich, 1807','Sepulcro megalítico en la nieve (Hünengrab im Schnee), Caspar David Friedrich, 1807']
];
const additions=Object.fromEntries(['en','it','fr','es'].map((l,i)=>[l,Object.fromEntries(entries.map(v=>[v[0],v[i]]))]));
const marker='// wuthering-heights editorial strings',end='// end wuthering-heights editorial strings',file='docs/content/book-translations.js';
let text=fs.readFileSync(file,'utf8');if(text.includes(marker)){const a=text.indexOf(marker),b=text.indexOf(end,a);if(b<0)throw Error('Missing editorial block end');text=text.slice(0,a)+text.slice(b+end.length);}
fs.writeFileSync(file,text+'\n'+marker+'\n(function(){const additions='+JSON.stringify(additions)+';for(const [language,strings] of Object.entries(additions))Object.assign(window.atlasLocaleData.messages[language],strings);})();\n'+end+'\n');
const credits=`\n\n## Wuthering Heights — Caspar David Friedrich\n\n- Hünengrab im Schnee (Cairn in Snow / Dolmen in Snow), Caspar David Friedrich, 1807. Oil on canvas, Galerie Neue Meister, Staatliche Kunstsammlungen Dresden, inventory 2196.\n- Museum record: https://skd-online-collection.skd.museum/Details/Index/241955\n- Reproduction: https://commons.wikimedia.org/wiki/File:Huenengrab_im_Schnee_(C_D_Friedrich).jpg\n- Local file: wuthering-heights-friedrich.jpg, 2020 × 1535 pixels. Author died 1840; underlying painting is public domain in Italy/EU/UK and the US. Commons identifies the faithful two-dimensional reproduction as PD-Art / Public Domain Mark; no modern creative adaptation is used.\n- Connection: exposed winter landscape, bare trees, stone burial and Romantic meditations on death. This is a thematic connection, not a Yorkshire topographical identification or a claim of direct illustration.\n- Verified 19 October 2026. The catalogue credit displays only artist, linked title and year; reuse details stay in this documentation and the database.\n`;
const cf='docs/images/CREDITS.md';if(!fs.readFileSync(cf,'utf8').includes('## Wuthering Heights —'))fs.appendFileSync(cf,credits);
const {prepare}=require('../../scripts/database/prepare-presentation.cjs');const row=prepare().rows.find(r=>r.book_id===id);row.artwork_documentation=credits;
const literal=v=>"E'"+String(v).replaceAll('\\','\\\\').replaceAll("'","''").replaceAll('\r','\\r').replaceAll('\n','\\n')+"'";
const keys=Object.keys(row),values=keys.map(k=>typeof row[k]==='object'?literal(JSON.stringify(row[k]))+'::jsonb':typeof row[k]==='number'||typeof row[k]==='boolean'?String(row[k]):literal(row[k]));
const sql=`begin;\ninsert into public.book_presentations (${keys.join(',')}) select ${values.join(',')} where exists(select 1 from public.books where id=${literal(id)}) on conflict(book_id) do update set ${keys.filter(k=>k!=='book_id').map(k=>`${k}=excluded.${k}`).join(',')},updated_at=now();\ncommit;\n`;
fs.mkdirSync(out,{recursive:true});fs.writeFileSync(out+'/presentation.json',JSON.stringify(row,null,2)+'\n');fs.writeFileSync(out+'/presentation.sql',sql);
console.log('Prepared Wuthering Heights presentation. This script does not publish the book.');
