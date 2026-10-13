// Prepare the user's approved visual choices; keep the remote book unpublished.
const fs=require('node:fs'),vm=require('node:vm');
const id='lolita',art=JSON.parse(fs.readFileSync('research/lolita/artwork.json','utf8'));
const ctx={window:{}};vm.runInNewContext(fs.readFileSync('docs/content/books.js','utf8'),ctx);
const book={id,title:'Lolita',author:'VLADIMIR NABOKOV',
 description:'Dolores and Humbert between the Haze house, Beardsley and the Enchanted Hunters.',
 ariaLabel:'Explore Lolita by Vladimir Nabokov',setting:'RAMSDALE / BEARDSLEY / ENCHANTED HUNTERS',
 mapType:'geographic',theme:'lolita',stylesheet:'themes/lolita.css',originalLanguage:'en',
 editorialStatus:'draft',cover:{src:'images/lolita-prinet-kreutzer.jpg',alt:'La Sonate à Kreutzer by René-Xavier Prinet, 1901',
 width:art.width,height:art.height,position:'center 38%',banner:{opacity:.22,mobileOpacity:.13}},
 credit:{artist:art.artist,title:art.title,url:art.url,year:art.year,
 reproduction:'Faithful reproduction · Wikimedia Commons',reproductionUrl:art.downloadUrl,
 license:art.rights,licenseUrl:art.rightsUrl,reuseNote:art.connection}};
const at=ctx.window.atlasCatalogue.books.findIndex(b=>b.id===id);
if(at<0)ctx.window.atlasCatalogue.books.push(book);else ctx.window.atlasCatalogue.books[at]=book;
fs.writeFileSync('docs/content/books.js','window.atlasCatalogue='+JSON.stringify(ctx.window.atlasCatalogue,null,2)+';\n');
const additions={en:{},it:{},fr:{},es:{}};
const strings=[
 [book.description,'Dolores e Humbert tra la casa degli Haze, Beardsley e l’Enchanted Hunters.','Dolores et Humbert entre la maison des Haze, Beardsley et l’Enchanted Hunters.','Dolores y Humbert entre la casa de los Haze, Beardsley y el Enchanted Hunters.'],
 [book.ariaLabel,'Esplora Lolita di Vladimir Nabokov','Explorer Lolita de Vladimir Nabokov','Explorar Lolita de Vladimir Nabokov'],
 [book.cover.alt,'La Sonate à Kreutzer di René-Xavier Prinet, 1901','La Sonate à Kreutzer de René-Xavier Prinet, 1901','La Sonate à Kreutzer de René-Xavier Prinet, 1901']];
for(const [en,it,fr,es]of strings)for(const [i,lang]of ['en','it','fr','es'].entries())additions[lang][en]=[en,it,fr,es][i];
const file='docs/content/book-translations.js',start='// lolita editorial strings',end='// end lolita editorial strings';
let tr=fs.readFileSync(file,'utf8');if(tr.includes(start)){const a=tr.indexOf(start),b=tr.indexOf(end,a);if(b<0)throw Error('Incomplete Lolita translation block');tr=tr.slice(0,a)+tr.slice(b+end.length);}
tr+='\n'+start+'\n(function(){const additions='+JSON.stringify(additions)+';for(const [lang,strings]of Object.entries(additions))Object.assign(window.atlasLocaleData.messages[lang],strings);})();\n'+end+'\n';
fs.writeFileSync(file,tr);
const {prepare}=require('../../scripts/database/prepare-presentation.cjs');const row=prepare().rows.find(r=>r.book_id===id);
row.artwork_documentation=JSON.stringify(art,null,2);
const literal=v=>"E'"+String(v).replaceAll('\\','\\\\').replaceAll("'","''").replaceAll('\r','\\r').replaceAll('\n','\\n')+"'";
const keys=Object.keys(row),values=keys.map(k=>typeof row[k]==='object'?literal(JSON.stringify(row[k]))+'::jsonb':typeof row[k]==='number'||typeof row[k]==='boolean'?String(row[k]):literal(row[k]));
const sql=`-- DRAFT: inserts the presentation only while Lolita is unpublished.\nbegin;\ninsert into public.book_presentations (${keys.join(',')}) select ${values.join(',')} where exists(select 1 from public.books where id='lolita' and publication_status='draft') on conflict(book_id) do update set ${keys.filter(k=>k!=='book_id').map(k=>k+'=excluded.'+k).join(',')},updated_at=now();\ncommit;\n`;
fs.mkdirSync('database/generated/lolita',{recursive:true});fs.writeFileSync('database/generated/lolita/presentation.json',JSON.stringify(row,null,2)+'\n');fs.writeFileSync('database/generated/lolita/presentation-draft.sql',sql);
console.log('Prepared Prinet cover, heart-shaped sunglasses watermark and catalogue translations. No remote writes.');
