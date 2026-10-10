# Atlanti illustrati

La home include Cent’anni di solitudine e apre `docs/atlas.html?book=macondo`, con la stessa interfaccia degli altri romanzi. Il vecchio indirizzo `illustrated.html` reindirizza alla pagina comune conservando lingua e selezione.

## Contenuti e caricamento

`fictional-atlas-adapter.js` adatta i dati illustrati al contratto del motore condiviso `app.js`; `illustrated-map-controller.js` gestisce il disegno e i marker in una sola vista Esri. Testi, lingue, capitoli, epoche, immagini e ancoraggi arrivano dai dati. `illustrated-data.js` carica `book_maps.metadata.illustratedAtlas` tramite la Data API e la publishable key. Le policy di lettura esistenti ammettono solo libri pubblicati. I dati di questo primo atlante sono un documento JSONB versionato nel database, non ancora suddivisi fra tutte le tabelle editoriali; il contratto consente una successiva normalizzazione senza cambiare le schede.

Con file:// il caricatore usa esclusivamente `docs/data/macondo-local.js`, escluso da Git. Online non c’è fallback locale: una mancata importazione produce un messaggio esplicito. Dataset e SQL di reinserimento sono in `database/generated/macondo/`, esclusi da Git. Il PDF completo resta fuori dal repository e non viene distribuito; la pagina mostra brevi estratti originali spagnoli e riferimenti di pagina.

Macondo contiene 47 voci, 29 luoghi illustrabili nell’intero inventario e tre fasi editoriali. Le immagini continuano ciascuna scena ai bordi; non usano una cornice comune. Gli ancoraggi dei marker sono calibrati separatamente: 3 nel primo villaggio, 24 nell’espansione e 19 nel declino. I luoghi senza una posizione nel disegno restano consultabili senza inventare coordinate. Le fasi e la geografia interna sono interpretative, non una planimetria o date storiche certe.

La navigazione comprende 20 capitoli. Il PDF fornito contiene un’intestazione aggiuntiva a pagina 56, nel mezzo di un dialogo: i segmenti IV e V sono quindi riuniti nel quarto capitolo, mantenendo i riferimenti alle pagine della fonte. Le occorrenze dei luoghi sono associate ai capitoli attraverso questi riferimenti. I capitoli 1–3 mostrano il primo villaggio, 4–15 l’espansione e 16–20 il declino. Non c’è un cursore delle epoche. La vista globale mostra tutti i 29 luoghi sulla fase di espansione; per gli ancoraggi mancanti in una fase viene usata la posizione interpretativa disponibile in un’altra.

## Renderer

`FictionalMap.create({container,image,width,height,places,onSelect,contentExtent,initialExtent,lockFrame,fillFrame,padding})` usa MediaLayer e due GraphicsLayer. Le posizioni sono pixel del disegno con origine in alto a sinistra; il wkid 3857 serve solo come canvas, non indica coordinate terrestri. Cerchi per edifici/siti e rombi per strade/aree; verde per azione e terracotta per citazioni. Macondo al momento mostra solo luoghi di azione.

`contentExtent` definisce la vista iniziale e Reset. `lockFrame` limita il trascinamento; `fillFrame` calcola il limite di zoom su tutta la finestra per evitare bande esterne, aggiornandolo al ridimensionamento e ai popup. `setImage()` sostituisce il MediaLayer conservando la MapView; l’anteprima resta visibile fino alla disponibilità del nuovo layer. I percorsi PNG relativi vengono riconosciuti come URL, evitando di interpretarli come testo SVG. `getExtent()`, `select()`, `setVisible()`, `zoom()`, `reset()` e `destroy()` gestiscono il ciclo di vita. Se Esri/WebGL non si avvia rimane una vista statica con marker selezionabili.

## Verifica

Test automatici: quattro lingue, 20 capitoli nell’interfaccia condivisa, vista globale, cambio immagine durante il caricamento iniziale, percorsi PNG relativi, marker e limiti della mappa con SDK/DOM simulati. Importazione Supabase completata: 47 voci, 3 epoche e 20 capitoli; lettura anonima verificata con la publishable key. I test simulati non certificano il rendering WebGL su tutti i dispositivi. La procedura di reinserimento locale richiede anche `09-capitoli.sql` dopo i precedenti script.
