# Mappe immaginarie: primo prototipo

`docs/fictional-map.js` è un renderer riutilizzabile per un'immagine SVG e luoghi con coordinate del disegno. Non è ancora collegato al caricatore Supabase di `atlas.html`. I romanzi geografici continuano a usare il percorso esistente.

Il primo esempio, Macondo all'apertura di *Cien años de soledad*, è nella cartella locale `../macondo/` esterna al repository. Non è un nuovo titolo del catalogo pubblico. I quattro luoghi e le loro descrizioni derivano dall'[estratto originale pubblicato dall'editore](https://penguinrandomhousesecondaryeducation.com/book/?isbn=9780307474728), non dall'analisi del romanzo completo.

## Contratto del renderer

`FictionalMap.create({ container, image, width, height, places, onSelect })` riceve:

- `image`: stringa SVG controllata dall'applicazione, non markup inviato dagli utenti;
- `width`, `height`: dimensioni del disegno;
- `places`: record `{ id, x, y, kind, role }`, con origine in alto a sinistra;
- `kind`: `site` (cerchio) oppure `area` (rombo);
- `role`: `action` (verde) oppure `mentioned` (terracotta).

Il risultato espone `select`, `setVisible`, `reset`, `zoom`, `destroy`. L'interfaccia chiamante gestisce testi, lingue e schede, anche a schermo intero. Non si aggiungono basemap terrestri, Street View o scale metriche. Il riferimento 3857 è solo un canvas tecnico per Esri: i numeri rappresentano pixel e non coordinate geografiche. Il cambio dell'origine Y avviene nel renderer; il database conserva i valori originali.

Esri MediaLayer carica l'immagine da un Blob URL; due GraphicsLayer contengono i marker. Il prototipo non usa servizi ArcGIS Online ospitati e non richiede una chiave. La pagina contiene un'anteprima illustrata selezionabile se SDK, immagine o WebGL non si caricano. Il test del renderer usa costruttori simulati; non certifica il rendering WebGL su un dispositivo reale.

## Passaggio al catalogo

Lo schema `003_book_maps.sql` prevede già `book_maps`, `section_maps`, `map_layers`, `place_positions`, e posizioni cartesiane. Per la produzione occorrerà:

1. Analizzare l'originale completo e registrare fonti, fasi temporali, relazioni documentate e collocazioni editoriali separatamente.
2. Preparare il disegno definitivo e verificarne i diritti. Per mappe del mondo immaginario non si devono ricavare false longitudini/latitudini.
3. Estendere il caricatore e l'adapter dei contenuti: oggi il percorso geografico rifiuta esplicitamente i luoghi privi di coordinate terrestri.
4. Importare il libro e le mappe tramite script SQL locali, pubblicando il titolo solo dopo verifica.

Non sono stati generati script di importazione per questa prima bozza. L'analisi dell'intero romanzo non va dedotta dal solo estratto iniziale.
