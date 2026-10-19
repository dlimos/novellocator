// Local-only preview of the real atlas engine. No production fallback or remote writes.
const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve('.'),id='wuthering-heights';
function input(){const c={window:{}};for(const f of ['docs/data/'+id+'.js','docs/data/'+id+'-i18n.js'])vm.runInNewContext(fs.readFileSync(f,'utf8'),c);return{data:c.window.atlasData,dictionary:c.window.atlasTranslations};}
const bootstrap=`window.atlasCatalogueData.load=async()=>{const row=await(await fetch('/preview/presentation.json')).json();for(const [l,m]of Object.entries(row.translations))Object.assign(window.atlasLocaleData.messages[l],m);window.atlasI18n.refreshAliases();window.atlasCatalogue={books:[{...row.presentation,css:row.css}],defaultBook:'${id}'};return window.atlasCatalogue;};if(window.atlasSupabaseData)window.atlasSupabaseData.loadBook=async()=>await(await fetch('/preview/bundle.json')).json();`;
function html(file,script){return fs.readFileSync('docs/'+file,'utf8').replace('<head>','<head><base href="/docs/">').replace(/(<script defer src="(?:load-book|catalogue)\.js[^"]*"><\/script>)/,'<script defer src="/preview/bootstrap.js"></script>$1').replace('</head>','<style>body::before{content:"Anteprima locale · dati di staging";display:block;background:#735c78;color:#fff8ed;text-align:center;padding:9px;font:14px system-ui}</style></head>');}
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2'};
http.createServer((req,res)=>{
 try{
  const url=new URL(req.url,'http://localhost');let content,type='text/html';
  if(url.pathname.startsWith('/preview/images/'))url.pathname='/docs/images/'+url.pathname.slice('/preview/images/'.length);
  if(url.pathname==='/preview/atlas.html')content=html('atlas.html','  <script defer src="load-book.js?v=20261018-section-evidence"></script>');
  else if(['/preview/catalogue.html','/preview/index.html'].includes(url.pathname))content=html('index.html','  <script defer src="catalogue.js?v=20261016-literary-views"></script>');
  else if(url.pathname==='/preview/bootstrap.js'){content=bootstrap;type='text/javascript';}
  else if(url.pathname==='/preview/bundle.json'){content=JSON.stringify(input());type='application/json';}
  else if(url.pathname==='/preview/presentation.json'){content=fs.readFileSync('database/generated/'+id+'/presentation.json');type='application/json';}
  else if(url.pathname.startsWith('/docs/')){
   const file=path.resolve(root,'.'+decodeURIComponent(url.pathname)),docs=path.join(root,'docs')+path.sep;
   if(!file.startsWith(docs)){res.writeHead(403);res.end();return;}
   content=fs.readFileSync(file);type=types[path.extname(file)]||'application/octet-stream';
  }else{res.writeHead(404);res.end();return;}
  res.writeHead(200,{'Content-Type':type+'; charset=utf-8','Cache-Control':'no-store'});res.end(content);
 }catch(e){res.writeHead(404);res.end('Not found');}
}).listen(8768,'127.0.0.1',()=>console.log('Local preview: http://127.0.0.1:8768/preview/atlas.html?book=wuthering-heights&lang=it'));
