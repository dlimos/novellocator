# Mappe immaginarie: primo prototipo

`docs/fictional-map.js` è un renderer riutilizzabile per immagini SVG/raster e luoghi con coordinate del disegno. Non è ancora collegato al caricatore Supabase di `atlas.html`. I romanzi geografici continuano a usare il percorso esistente.

L'esempio Macondo è nella cartella locale `../macondo/` esterna al repository. Non è un nuovo titolo del catalogo pubblico. La prima bozza di quattro luoghi basata sull'estratto dell'editore è stata sostituita da una mappa di lettura evocativa: 47 voci selezionate da passaggi distribuiti nel PDF spagnolo fornito dall'utente, con 29 posizioni illustrative, ambienti della casa e luoghi esterni non collocati. L'estrazione copre tutte le 334 pagine; l'inventario è una prima analisi spaziale, non un censimento esaustivo di ogni scena. Nessun luogo è incluso soltanto per un legame biografico con l'autore.

## Contratto del renderer

`FictionalMap.create({ container, image, width, height, places, onSelect })` riceve:

- `image`: stringa SVG controllata dall'applicazione, Blob immagine oppure URL immagine HTTPS/data; non markup inviato dagli utenti;
- `width`, `height`: dimensioni del disegno;
- `places`: record `{ id, x, y, kind, role, label? }`, con origine in alto a sinistra; `label` opzionale aggiunge un numero/testo al marker;
- `kind`: `site` (cerchio) oppure `area` (rombo);
- `role`: `action` (verde) oppure `mentioned` (terracotta).

Il risultato espone `select`, `setVisible`, `reset`, `zoom`, `destroy`. L'interfaccia chiamante gestisce testi, lingue e schede, anche a schermo intero. Non si aggiungono basemap terrestri, Street View o scale metriche. Il riferimento 3857 è solo un canvas tecnico per Esri: i numeri rappresentano pixel e non coordinate geografiche. Il cambio dell'origine Y avviene nel renderer; il database conserva i valori originali.

Esri MediaLayer carica l'immagine da Blob URL o URL immagine; due GraphicsLayer contengono i marker. La selezione evidenzia il punto con un contorno dorato. Il prototipo non usa servizi ArcGIS Online ospitati e non richiede una chiave. La pagina contiene un'anteprima illustrata selezionabile se SDK, immagine o WebGL non si caricano. Il test del renderer usa costruttori simulati; non certifica il rendering WebGL su un dispositivo reale.

## Passaggio al catalogo

Lo schema `003_book_maps.sql` prevede già `book_maps`, `section_maps`, `map_layers`, `place_positions`, e posizioni cartesiane. Per la produzione occorrerà:

1. Analizzare l'originale completo e registrare fonti, fasi temporali, relazioni documentate e collocazioni editoriali separatamente.
2. Preparare il disegno definitivo e verificarne i diritti. Per mappe del mondo immaginario non si devono ricavare false longitudini/latitudini.
3. Estendere il caricatore e l'adapter dei contenuti: oggi il percorso geografico rifiuta esplicitamente i luoghi privi di coordinate terrestri.
4. Importare il libro e le mappe tramite script SQL locali, pubblicando il titolo solo dopo verifica.

Non sono stati generati script di importazione per questa bozza. Il PDF e i dati restano fuori dal repository; le schede citano brevi estratti e pagine del documento locale. L'illustrazione generata con IA riunisce diverse epoche: i due punti del fiume sono posizioni successive, scuola/caserma sono un sito solo, le due case di Rebeca sono distinte. Gli ambienti interni non diventano finti punti separati. I luoghi oltre Macondo non vengono collocati dentro il paese; le eventuali coordinate terrestri vanno verificate separatamente.
