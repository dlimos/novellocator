# Atlante letterario · Joyce, Proust, Tolstoj e Melville

Sito statico con inglese predefinito e traduzioni in italiano, francese e spagnolo. Ulisse comprende 18 mappe e 115 luoghi; Alla ricerca del tempo perduto comprende sette mappe e 23 luoghi. HTML, CSS e JavaScript condivisi; cartografia Esri ArcGIS Maps SDK for JavaScript 5.1, cinque sfondi: OpenStreetMap (predefinito), Ortofoto Esri (World Imagery), Stradale, Topografica e Grigio chiaro. Richiede Internet per cartografia e caratteri.

Aprire `index.html` per il catalogo dei romanzi e scegliere Joyce, Proust, Tolstoj o Melville. `ulisse.html` mantiene compatibili i vecchi collegamenti; Proust usa `atlas.html?book=proust`; Tolstoj usa `atlas.html?book=war-and-peace`; Melville usa `atlas.html?book=moby-dick`. I promessi sposi, Delitto e castigo e La signora Dalloway sono proposte per il futuro: le loro mappe non sono ancora disponibili. Per ospitarlo su un servizio di hosting statico, caricare insieme i file di questa cartella. Nessuna compilazione è necessaria.

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

## Guerra e pace

Il terzo romanzo usa lo stesso motore, con `data/war-and-peace.js` e `data/war-and-peace-i18n.js`. La suddivisione segue la traduzione Maude: quindici libri e due epiloghi. Le sezioni narrative hanno sedici mappe, con 62 luoghi distinti e 91 schede di scena. Il secondo epilogo contiene una scheda filosofica senza luoghi; selezionarlo cancella i punti della sezione precedente e ripristina l’inquadratura generale.

Inglese, italiano, francese e spagnolo comprendono introduzioni, scene, classificazioni, metodi e limiti delle posizioni. I quattro file `war-and-peace-places-<lingua>.csv` esportano le schede e le rispettive fonti. I collegamenti al testo narrativo sono specifici per scena: lo stesso luogo può avere fonti diverse in libri diversi.

La precisione riguarda ciò che è effettivamente identificabile:

- Le coordinate pubblicate da Wikipedia e Wikidata identificano città, strade e complessi. Le città sono aree, non indirizzi di case private o confini di accampamenti. I decimali non costituiscono una misura dell’accuratezza storica.
- Jasnaja Poljana e Nikol’skoe-Vjazemskoe sono modelli letterari documentati di Lysye Gory e Otradnoe. I punti indicano le tenute reali, non la posizione narrativa delle tenute immaginarie. Bogučarovo, gli interni e i percorsi della caccia restano senza coordinate esatte.
- La ridotta di Ševardino usa la media dei sei vertici distinti della fortificazione cartografata in OpenStreetMap, geometria 263822780. È un punto rappresentativo del sito, non un rilievo della posizione di Napoleone. Attribuzione: © OpenStreetMap contributors, ODbL.
- La batteria di Raevskij usa il punto GPS pubblicato in un itinerario del Museo di Borodino, riprodotto da Nash Ural. Non individua la posizione esatta di Pierre.
- Il Monumento della Pace indica le alture del Pratzen, ma è posteriore alla battaglia. L’izba di Fili è una ricostruzione del 1887. Poklonnaja è un’area storica profondamente modificata.
- Novodevičij è un edificio visibile nei capitoli della prigionia; l’esecuzione avviene in un giardino vicino, non dentro il convento. Devič’e Pole è un riferimento di area, non la posizione della fossa.
- La Beresina usa il riferimento geografico dell’area dell’attraversamento presso Studenka, non le coordinate della foce del fiume. Enns, Prace, Kobylnice e i villaggi di Borodino sono disambiguati nei dati di controllo.

Le descrizioni distinguono scene, riferimenti storici, luoghi ricordati e monumenti visibili. La numerazione guida la lettura e non afferma di ricostruire un percorso GPS. La selezione non include ogni toponimo del romanzo. Fonti consultate l’8 ottobre 2026.

Fonti principali, oltre ai collegamenti geografici di ogni scheda:

- Tolstoj, testo completo nella traduzione Maude: https://www.gutenberg.org/files/2600/2600-h/2600-h.htm
- Museo di Jasnaja Poljana, modello della tenuta dei Bolkonskij: https://ypmuseum.ru/object/park-kliny?lang=en
- Museo di Jasnaja Poljana, Nikol’skoe-Vjazemskoe: https://www.ypmuseum.ru/filials/nikolsko-vyasemskoe
- Museo della regione di Brno, Monumento della Pace: https://mohylamiru.muzeumbrnenska.cz/cz/
- Museo Panorama di Borodino, izba di Kutuzov: https://1812panorama.ru/en/node/721
- Itinerario del Museo di Borodino riprodotto da Nash Ural: https://nashural.ru/russia/dostoprimechatelnosti-muzeya-zapovednika-borodinskoe-pole-batareya-raevskogo/

`tests/fixtures/war-and-peace-sources.json` conserva gli identificatori geografici, le coordinate consultate e brevi estratti del testo inglese per verificare i riferimenti alle scene. I controlli automatici coprono tutte le sezioni e lingue, i CSV, i collegamenti Street View e il passaggio all’epilogo senza punti. Non verificano il rendering WebGL reale né attestano un’accuratezza metrica dei siti storici.

## Moby-Dick

135 capitoli e un epilogo, con 21 ambientazioni, 42 riferimenti capitolo–ambientazione e 14 ambientazioni prive di coordinate. Le citazioni sono verificate sul testo inglese integrale di Project Gutenberg e restano in inglese anche nelle interfacce italiana, francese e spagnola. Le posizioni hanno fonti geografiche separate. Le mappe includono solo ambientazioni degli eventi narrati e dei racconti inseriti. Allusioni, provenienze e destinazioni soltanto previste sono escluse.

Water Street indica Liverpool, secondo l’edizione critica della Melville Electronic Library. La Seamen’s Bethel è il modello della cappella immaginaria; il pulpito attuale è una replica del 1961. Tranque, Arsacidi, locande immaginarie e naufragio finale non hanno punti inventati. Una vista regionale senza punti correnti è solo contestuale. I CSV includono anche i riferimenti senza coordinate. La selezione è ampia, ma non pretende di esaurire ogni toponimo del romanzo.

Dati: `data/moby-dick.js`, traduzioni: `data/moby-dick-i18n.js`. Il motore comune supporta citazioni (`placeQuotes`), ruoli geografici (`placeRoles`), punti prioritari nella panoramica (`overviewPlaces`), vista contestuale (`initialView`) e riferimenti non geolocalizzati (`unlocatedPlaces`).

## Estratti letterari

Ogni sezione di Ulisse, Proust e Guerra e pace include un estratto originale, rispettivamente in inglese, francese e russo. Tutti i 219 passaggi capitolo–luogo hanno ora l’originale; le 91 schede di Guerra e pace comprendono anche la traduzione storica inglese Maude. Gli estratti mostrano sempre originale, inglese se disponibile e lingua scelta se disponibile, senza duplicati. Le edizioni russe e tradotte mantengono riferimenti indipendenti perché formulazioni e suddivisioni possono differire. Sono disponibili anche Scott Moncrieff per i primi sei volumi di Proust e Bienstock per gli inizi delle sezioni di Tolstoj. Ogni citazione conserva fonte, attribuzione e informazioni sull’edizione.

Il pulsante «Tutti i luoghi» mostra in una sola mappa tutti i luoghi cartografati del romanzo, senza duplicare quelli presenti in più sezioni. Ogni scheda elenca le sezioni in cui compare il luogo. La vista è condivisibile con `#<hashPrefix>-all` e si conserva al cambio di lingua. Le scene senza coordinate verificate restano prive di marker. La legenda mostra simboli numerati più grandi: cerchio, rombo e punto selezionato.

## Luoghi dell’azione, luoghi citati e TOC

I marker verdi indicano i luoghi dell’azione; quelli color terracotta indicano i luoghi citati. La forma resta indipendente dal colore: cerchio per edifici o siti storici, rombo per strade, aree o posizioni incerte. Il punto selezionato mantiene il proprio colore e ha un bordo dorato. La TOC consente di nascondere uno strato o tutti i marker, lasciando visibile la cartografia. La scelta si conserva quando si cambia lingua.

Sono stati analizzati i testi originali delle 18 sezioni di Joyce, dei sette volumi francesi di Proust, delle 17 parti russe di Tolstoj e dei 136 capitoli/epilogo di Melville. I nuovi riferimenti conservano passo originale e fonte geografica distinta: Ulisse 186 riferimenti a 55 luoghi; Proust 231 a 67; Guerra e pace 136 a 30; Moby-Dick 553 a 266. In Moby-Dick tornano tutte le 276 posizioni del dataset precedente, distribuite nei due strati, con le coordinate conservate. Le omonimie note sono controllate: Florence e Menton come persone, Amiens Street, Geneva Barracks e Kitay-gorod non generano marker nelle città o nei paesi omonimi. Il censimento resta ampliabile: la scansione di nomi espliciti non garantisce l’identificazione di ogni variante o riferimento indiretto.

Le nuove citazioni sono esportabili in CSV nelle quattro lingue. Il motore è generico: i dati `citedPlaces`, `citations` e `placeCategories` determinano categoria, scheda e fonte. Nella vista globale un punto presente in entrambi gli strati conserva il colore dell’azione; disattivando questo strato compare tra i luoghi citati. Le aree usano punti rappresentativi dichiarati, senza attribuire coordinate esatte a case immaginarie o alla nave.
