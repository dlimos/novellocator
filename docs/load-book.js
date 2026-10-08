// One engine; book content and translations are datasets.
const bookId=new URLSearchParams(window.location.search).get('book')||'ulisse';
const unavailable=()=>{document.getElementById('detail').textContent=window.atlasI18n.t('Questo romanzo non è ancora disponibile. Torna al catalogo per scegliere un titolo.')};
if(!/^[a-z0-9-]+$/.test(bookId)){document.getElementById('detail').textContent=window.atlasI18n.t('Titolo non valido.');}else{
 const dataset=document.createElement('script');dataset.src='data/'+bookId+'.js';
 dataset.onload=()=>{const translations=document.createElement('script');translations.src='data/'+bookId+'-i18n.js';translations.onload=()=>{window.atlasData=window.atlasI18n.localizeData(window.atlasData);const engine=document.createElement('script');engine.src='app.js';document.head.appendChild(engine)};translations.onerror=unavailable;document.head.appendChild(translations)};
 dataset.onerror=unavailable;document.head.appendChild(dataset);
}
