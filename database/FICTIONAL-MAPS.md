# Atlanti illustrati

La home include Cent’anni di solitudine e apre `docs/illustrated.html?book=macondo`. I romanzi geografici continuano a usare `atlas.html`.

## Contenuti e caricamento

`illustrated-atlas.js` è un’interfaccia generica per mappe immaginarie; testi, lingue, epoche, immagini e ancoraggi arrivano dai dati. `illustrated-data.js` carica `book_maps.metadata.illustratedAtlas` tramite la Data API e la publishable key. Le policy di lettura esistenti ammettono solo libri pubblicati. I dati di questo primo atlante sono un documento JSONB versionato nel database, non ancora suddivisi fra tutte le tabelle editoriali; il contratto consente una successiva normalizzazione senza cambiare le schede.

Con file:// il caricatore usa esclusivamente `docs/data/macondo-local.js`, escluso da Git. Online non c’è fallback locale: una mancata importazione produce un messaggio esplicito. Dataset e SQL di reinserimento sono in `database/generated/macondo/`, esclusi da Git. Il PDF completo resta fuori dal repository e non viene distribuito; la pagina mostra brevi estratti originali spagnoli e riferimenti di pagina.

Macondo contiene 47 voci, 29 luoghi illustrabili nell’intero inventario e tre fasi editoriali. Le immagini continuano ciascuna scena ai bordi; non usano una cornice comune. Gli ancoraggi dei marker sono calibrati separatamente: 3 nel primo villaggio, 24 nell’espansione e 19 nel declino. I luoghi senza una posizione nel disegno restano consultabili senza inventare coordinate. Le fasi e la geografia interna sono interpretative, non una planimetria o date storiche certe.

## Renderer

`FictionalMap.create({container,image,width,height,places,onSelect,contentExtent,initialExtent,lockFrame,fillFrame,padding})` usa MediaLayer e due GraphicsLayer. Le posizioni sono pixel del disegno con origine in alto a sinistra; il wkid 3857 serve solo come canvas, non indica coordinate terrestri. Cerchi per edifici/siti e rombi per strade/aree; verde per azione e terracotta per citazioni. Macondo al momento mostra solo luoghi di azione.

`contentExtent` definisce la vista iniziale e Reset; `initialExtent` conserva la vista nel cambio d’epoca. `lockFrame` limita il trascinamento; `fillFrame` calcola il limite di zoom su tutta la finestra per evitare bande esterne, aggiornandolo al ridimensionamento. `getExtent()`, `select()`, `setVisible()`, `zoom()`, `reset()` e `destroy()` gestiscono il ciclo di vita. Se Esri/WebGL non si avvia rimane una vista statica con marker selezionabili.

## Verifica

Test automatici: API pubblica e validazione dati, lingue, epoche, marker, fonti, navigazione e limiti della mappa con SDK/DOM simulati. Importazione Supabase completata: 47 voci e 3 epoche; lettura anonima verificata con la publishable key. I test simulati non certificano il rendering WebGL su tutti i dispositivi.
