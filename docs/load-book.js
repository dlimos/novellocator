// One engine; book content and translations are datasets.
const bookId=new URLSearchParams(window.location.search).get('book')||'ulisse';
const unavailable=()=>{document.getElementById('detail').textContent=window.atlasI18n.t('Questo romanzo non è ancora disponibile. Torna al catalogo per scegliere un titolo.')};
function startEngine(source){window.atlasData=window.atlasI18n.localizeData(window.atlasData);window.atlasDataSource=source;const engine=document.createElement('script');engine.src='app.js';document.head.appendChild(engine);}
function loadStatic(){
 const dataset=document.createElement('script');dataset.src='data/'+bookId+'.js';
 dataset.onload=()=>{const translations=document.createElement('script');translations.src='data/'+bookId+'-i18n.js';translations.onload=()=>startEngine('static');translations.onerror=unavailable;document.head.appendChild(translations)};
 dataset.onerror=unavailable;document.head.appendChild(dataset);
}
if(!/^[a-z0-9-]+$/.test(bookId)){document.getElementById('detail').textContent=window.atlasI18n.t('Titolo non valido.');}
else if(window.atlasSupabase?.enabled){
 window.atlasSupabaseData.loadBook(bookId).then(({data,dictionary})=>{window.atlasData=data;window.atlasTranslations=dictionary;startEngine('supabase');}).catch(error=>{
  console.error('Supabase book loading failed',error);
  if(error.code==='BOOK_UNAVAILABLE'){unavailable();return;}
  const messages={en:'Live data is unavailable. Showing the saved edition.',it:'I dati online non sono disponibili. È visualizzata la versione salvata.',fr:'Les données en ligne sont indisponibles. La version enregistrée est affichée.',es:'Los datos en línea no están disponibles. Se muestra la versión guardada.'};
  const notice=document.createElement('p');notice.setAttribute('role','status');notice.className='data-notice';notice.textContent=messages[window.atlasI18n.locale]||messages.en;document.getElementById('atlas-workspace').before(notice);loadStatic();
 });
}else loadStatic();
