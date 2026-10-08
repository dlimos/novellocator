# Atlante letterario · Joyce e Proust

Sito statico con inglese predefinito e traduzioni in italiano, francese e spagnolo. Ulisse comprende 18 mappe e 115 luoghi; Alla ricerca del tempo perduto comprende sette mappe e 23 luoghi. HTML, CSS e JavaScript condivisi; cartografia Esri ArcGIS Maps SDK for JavaScript 5.1, cinque sfondi: OpenStreetMap (predefinito), Ortofoto Esri (World Imagery), Stradale, Topografica e Grigio chiaro. Richiede Internet per cartografia e caratteri.

Aprire `index.html` per il catalogo dei romanzi e scegliere Joyce o Proust. `ulisse.html` mantiene compatibili i vecchi collegamenti; Proust usa `atlas.html?book=proust`. I promessi sposi, Delitto e castigo e La signora Dalloway sono proposte per il futuro: le loro mappe non sono ancora disponibili. Per ospitarlo su un servizio di hosting statico, caricare insieme i file di questa cartella. Nessuna compilazione è necessaria.

## Come leggere la precisione

Le schede distinguono la fonte della scena dalla fonte delle coordinate. 56 luoghi usano punti WGS84 del censimento ufficiale NIAH; la torre di Sandycove e Summerfield usano il centroide dell’impronta nel registro DLR County Council. Un punto censito individua un edificio o monumento, non l’ingresso né la posizione del personaggio. L’attribuzione della scuola di Deasy a Summerfield resta una ricostruzione critica.

Strade, coste e indirizzi scomparsi hanno precisione diversa, dichiarata nelle schede. I punti riportati manualmente dalle carte storiche sulla geografia moderna non sono rilievi catastali. In particolare l’ufficio postale di Westland Row, Bella Cohen, il rifugio dei vetturini e Barney Kiernan richiedono ulteriori riscontri per una localizzazione dell’impronta storica. La macelleria di Dlugacz è inventata e non ha un civico verificabile.

Le mappe non rappresentano la Dublino del 1904 con immagini storiche, né itinerari pedonali attuali. I numeri identificano i punti; nelle Rocce erranti i riferimenti § distinguono le sezioni simultanee. La casa dei Dedalus nella sezione 4 è omessa perché l’identificazione topografica è inferita.

`luoghi.csv` contiene il catalogo con coordinate, capitoli, note, metodo e fonti. Separatore: punto e virgola; codifica UTF-8. Fonti consultate il 7 ottobre 2026.

## Fonti

- James Joyce, *Ulysses*: https://www.gutenberg.org/ebooks/4300
- Ian Gunn e Clive Hart, con Harald Beck, *James Joyce’s Dublin*, edizione rivista 2022: https://riverrun.org.uk/JJD2.pdf
- National Inventory of Architectural Heritage, Department of Housing, Local Government and Heritage: https://data.gov.ie/dataset/national-inventory-of-architectural-heritage-niah-national-dataset
- Dún Laoghaire–Rathdown County Council, Record of Protected Structures: https://data.gov.ie/dataset/dun-laoghaire-rathdown-record-of-protected-structures
- Altri riscontri puntuali sono collegati nelle singole schede.

La selezione non è un inventario completo di tutti i toponimi del romanzo. I controlli automatici verificano integrità dei dati, corrispondenza delle coordinate NIAH, selezione dei luoghi, isolamento per capitolo e inquadrature. Non attestano l’accuratezza metrica dei siti storici ricostruiti o una prova del caricamento Esri nel browser.

## Un motore per tutti i romanzi

`atlas.html` è il modello comune; `app.js` gestisce capitoli, schede, punti e navigazione senza riferimenti a Joyce o Dublino. `basemaps.js` definisce gli sfondi condivisi. `load-book.js` sceglie il dataset dal parametro `book` dell’indirizzo: `atlas.html?book=ulisse`. `ulisse.html` mantiene compatibili i vecchi collegamenti, compresi quelli ai singoli episodi.

Per aggiungere un romanzo, creare `data/<identificativo>.js` con `window.atlasData={book,chapters,places}` usando la struttura di `data/ulisse.js`. Metadati, centro iniziale, fonti, note, nomi delle sezioni e prefisso dei link sono dati. Il catalogo va aggiornato con il collegamento al nuovo titolo. `book.footerHtml` è contenuto HTML redazionale fidato: non inserire contenuti inviati dai visitatori.

Gli sfondi vettoriali sono quelli documentati da Esri: https://developers.arcgis.com/javascript/latest/references/core/Map/ . Il cambio di sfondo mantiene capitolo, luogo e inquadratura; in caso di errore conserva lo sfondo precedente. Le attribuzioni includono i fornitori dei livelli di base e di riferimento.

## Lingue

L’inglese è la lingua del dataset principale e del primo accesso. Il selettore memorizza la scelta quando il browser lo consente; `?lang=it`, `?lang=fr` e `?lang=es` consentono collegamenti in una lingua specifica. Il cambio conserva episodio, punto e basemap. Sono tradotti catalogo, interfaccia, riassunti, scene, schede, metodi e note sulle fonti. Gli indirizzi e i nomi propri locali sono mantenuti. Le etichette della cartografia provengono dal servizio Esri e non vengono tradotte dal sito. Ogni lingua ha il proprio catalogo CSV (`places-en.csv`, `places-it.csv`, `places-fr.csv`, `places-es.csv`).

`i18n.js` è il motore comune; `locales/ui.js` contiene il registro delle lingue e i testi dell’interfaccia. `data/ulisse-i18n.js` contiene i contenuti tradotti, senza duplicare né modificare coordinate o fonti. Per un nuovo titolo servono il dataset principale e il relativo file `-i18n.js`. Per una nuova lingua si aggiungono dati di traduzione al registro e ai romanzi; il motore non deve cambiare.

Controlli eseguiti: tutti i 18 episodi, integrità dei 115 luoghi, coordinate NIAH, riuso con un libro di prova, cambio basemap e gestione degli errori, completezza delle note e delle scene in tutte le lingue e conservazione dei collegamenti. Sono stati verificati i servizi pubblici Esri; il caricamento visivo della mappa nel browser locale resta da verificare.

## Secondo titolo: Alla ricerca del tempo perduto

Il catalogo include ora Proust: `atlas.html?book=proust`. La stessa pagina e lo stesso motore mostrano sette mappe, una per volume, con 23 luoghi distinti e 33 schede di scena. L’inglese resta la lingua predefinita; italiano, francese e spagnolo comprendono riassunti, scene, schede, metodo, classificazione e fonti. OpenStreetMap è la basemap iniziale; Imagery resta disponibile. Ogni volume collega le proprie parti del testo originale francese.

I punti francesi provengono da IGN Géoplateforme (BAN per gli indirizzi, BD TOPO per i luoghi nominati), eccetto il Pré Catelan di Illiers-Combray, la cui coordinata è pubblicata da Eure-et-Loir Tourisme su Cirkwi. Per Venezia e Padova le coordinate geografiche pubblicate su Wikipedia sono dichiarate come **fonti secondarie**, affiancate dai siti ufficiali dei monumenti. Non sono rilievi catastali o verifiche sul posto. I risultati omonimi in città sbagliate sono stati scartati durante la ricerca.

Le coordinate conservano i valori delle fonti. Sei decimali indicano il formato, non una precisione metrica certificata. La scheda dichiara se il punto rappresenta un edificio, una strada o un’area. Per i giardini degli Champs-Élysées è usato un riferimento di indirizzo sul margine nord; per i Grands Boulevards un riferimento all’interno del quartiere. Non sono posizioni esatte delle scene.

Combray e Balbec sono costruzioni letterarie: la casa Amiot, Saint-Jacques, il Pré Catelan, il Grand Hôtel di Cabourg e il suo lungomare sono segnalati come **modelli documentati**, con marcatori a rombo. Non sono identificati arbitrariamente il castello o la casa di Swann, l’hôtel dei Guermantes, le stanze del narratore, l’albergo veneziano senza nome, Doncières, la Raspelière e le stazioni della piccola ferrovia. Il quai d’Orléans riguarda Swann; il quai de Conti riguarda il successivo salotto Verdurin. L’allée des Acacias del Bois è distinta dalla rue des Acacias.

I CSV sono `proust-places-en.csv`, `proust-places-it.csv`, `proust-places-fr.csv`, `proust-places-es.csv` (virgola, UTF-8 con BOM). Ogni riga collega volume, scena, classificazione, coordinate e fonti. La selezione non è un inventario esaustivo dei toponimi di tutta la Recherche. Il controllo automatico verifica i sette volumi e ogni scheda in quattro lingue, l’identità delle coordinate rispetto ai record consultati, gli indicatori dei modelli, i download e la conservazione di libro, volume e basemap al cambio di lingua. Il caricamento visivo Esri nel browser resta da verificare.

Fonti principali per le identificazioni:

- Testi originali dei sette volumi: https://fr.wikisource.org/wiki/%C3%80_la_recherche_du_temps_perdu
- Maison de tante Léonie: https://www.amisdeproust.fr/maison-de-tante-leonie
- Modelli di Combray: https://www.tourisme28.com/experiences/illiers-combray-le-berceau-litteraire-de-marcel-proust/
- Punto del Pré Catelan: https://www.cirkwi.com/fr/point-interet/3250342-le-pre-catelan
- Museo Villa du Temps retrouvé, Cabourg: https://villadutempsretrouve.com/le-concept/
- Musée Carnavalet, dossier Proust: https://www.carnavalet.paris.fr/sites/default/files/2022-03/dossier_pedagogique_proust_et_paris_vdef.pdf
- Geocodifica ufficiale IGN: https://www.data.gouv.fr/dataservices/api-geoplateforme-geocodage

La cartella è pronta per la consultazione locale; la pubblicazione online non è stata completata.

## Google Street View

Ogni scheda, per entrambi i romanzi e in tutte e quattro le lingue, include il collegamento **Google Street View**. Usa le coordinate WGS84 complete del luogo selezionato con le Maps URLs ufficiali (`api=1`, `map_action=pano`, `viewpoint=latitudine,longitudine`), senza chiave API. Al clic si apre una finestra separata; il browser può usare una nuova scheda. Se il popup è bloccato, resta il normale collegamento con apertura in nuova scheda. La finestra non mantiene accesso alla pagina dell’atlante.

Google sceglie il panorama disponibile più vicino: non garantisce che sia esattamente sul marcatore, che mostri la facciata desiderata o che l’area sia coperta. La scheda lo indica esplicitamente. Le fotografie non ricostruiscono l’epoca del romanzo. Google viene aperto solo al clic; nessuna API Google è caricata nella mappa Esri. Questa implementazione è un popup esterno, non un iframe incorporato nel sito.

Documentazione ufficiale: https://developers.google.com/maps/documentation/urls/get-started#street-view-action

## OpenStreetMap predefinito

Entrambi i romanzi aprono lo sfondo OpenStreetMap vettoriale pubblico fornito da Esri. Non richiede una chiave API nella configurazione attuale. Il motore resta ArcGIS Maps SDK; gli altri quattro sfondi rimangono selezionabili. Un collegamento visibile a © OpenStreetMap contributors accompagna i crediti del servizio. Un collegamento con parametro basemap esplicito conserva lo sfondo scelto.

Servizio: https://basemaps.arcgis.com/arcgis/rest/services/OpenStreetMap_v2/VectorTileServer

Sono stati verificati senza credenziali i metadati del servizio e lo stile. I controlli automatici verificano creazione del layer, predefinito, cambio sfondo, attribuzioni e ripristino in caso di errore. La verifica visiva nel browser resta da effettuare.
