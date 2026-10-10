// One engine; book content and translations are datasets.
const bookId=new URLSearchParams(window.location.search).get('book')||window.atlasCatalogue?.defaultBook||'';
const entry=window.atlasCatalogue?.books.find(book=>book.id===bookId);
window.atlasPresentation?.apply(entry);
const unavailable=()=>{document.getElementById('detail').textContent=window.atlasI18n.t('Questo romanzo non è ancora disponibile. Torna al catalogo per scegliere un titolo.')};
function startEngine(source){window.atlasData=window.atlasI18n.localizeData(window.atlasData);window.atlasDataSource=source;const engine=document.createElement('script');engine.src='app.js';document.head.appendChild(engine);}
function connectionError(){const messages={en:'Book data could not be loaded. Please try again later.',it:'Non è stato possibile caricare i dati del romanzo. Riprova più tardi.',fr:'Les données du roman n’ont pas pu être chargées. Réessayez plus tard.',es:'No se han podido cargar los datos de la novela. Inténtalo de nuevo más tarde.'};const detail=document.getElementById('detail');detail.setAttribute('role','status');detail.textContent=messages[window.atlasI18n.locale]||messages.en;}
if(!/^[a-z0-9-]+$/.test(bookId)){document.getElementById('detail').textContent=window.atlasI18n.t('Titolo non valido.');}
else if(entry?.mapType==='illustrated'){
 window.IllustratedData.load(bookId).then(payload=>{window.atlasData=window.IllustratedAdapter.adapt(payload,window.atlasI18n.locale);startEngine('supabase-illustrated');}).catch(error=>{console.error('Illustrated loading failed',error);connectionError();});
}else if(window.atlasSupabase?.enabled){
 window.atlasSupabaseData.loadBook(bookId).then(({data,dictionary})=>{window.atlasData=data;window.atlasTranslations=dictionary;startEngine('supabase');}).catch(error=>{
  console.error('Supabase book loading failed',error);
  if(error.code==='BOOK_UNAVAILABLE'){unavailable();return;}
  connectionError();
 });
}else connectionError();
