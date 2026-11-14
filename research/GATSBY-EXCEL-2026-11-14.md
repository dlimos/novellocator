# Gatsby — citazioni dall’Excel, 14 novembre 2026

Su richiesta esplicita dell’utente sono stati pubblicati direttamente i passi del foglio 17 di `NovelLocator_Gatsby_79_CITAZIONI_IT_FR_ES_PUBBLICATE.xlsx`, assumendo la collazione dichiarata nel foglio senza ripetere il confronto con i PDF. Le ellissi sono conservate come nel file. Le edizioni italiane e spagnole restano senza traduttore identificato; la fonte francese è attribuita a Victor Llona, Éditions du Sagittaire, 1946. La verifica indipendente dei diritti non è stata completata; la decisione di pubblicazione è stata esplicitamente assunta dall’utente.

Il primo lotto comprende 42 associazioni già esistenti, nelle quali il passo inglese del foglio compare nell’originale conservato nel database: 42 versioni italiane, 41 francesi e 42 spagnole. La versione francese di Queens (GAT-EXC-0018) non è presente nel foglio. Gli originali e le categorie sono conservati. La versione spagnola su Minnesota (GAT-EXC-0052) riporta nord mentre il riscontro originale riporta sud; la variante è registrata nei metadati.

Le 37 righe rimanenti non sono state inserite: il riferimento non compare nello stesso passo originale già associato al luogo, oppure non è stato riconciliato con un record mappato. Non sono dichiarate verificate né pubblicate. Il censimento complessivo del romanzo, i luoghi citati e l’analisi dei nove capitoli restano fuori dalla verifica di questo lotto.

Una transazione idempotente conserva i record originali ed è stata provata due volte in PGlite con le righe pubbliche. Il successivo riscontro REST ha confermato 125 testi esattamente corrispondenti al foglio; sul sito è stata controllata la scheda Monte Carlo con il selettore delle quattro lingue e il passo italiano. Snapshot, riconciliazione e SQL locale: `tmp/gatsby-excel-review/`.

## Secondo lotto

Pubblicate ulteriori 33 versioni: 18 su sei associazioni nelle tabelle `excerpts` e 15 su cinque associazioni conservate nei metadati geografici (Muhlbach Hotel, Old Metropole, Trinity Quad, Little Girl Bay e vecchia Union Station). Le tre lingue del foglio sono presenti per ciascuna delle undici associazioni. La traduzione spagnola di Union Station riporta «Union Street»: la divergenza è conservata nei metadati, senza correggere il testo.

Complessivamente sono state pubblicate 158 versioni per 53 delle 79 righe del foglio; 26 righe restano da riconciliare. Sono conservati gli originali precedenti. Il test locale ha eseguito la transazione su dati pubblici e il confronto successivo ha confermato tutti i 33 testi nel database pubblico. La scheda Trinity Quad è stata controllata sul sito, con le quattro opzioni di lingua e il passo italiano visibile. La pubblicazione non costituisce verifica indipendente delle trascrizioni o dei diritti.

## Terzo intervento: riconciliazione e nuove associazioni

Aggiunte 39 versioni tradotte per tredici righe dell’Excel. In nove associazioni esistenti è stato scelto un passo inglese dell’episodio indicato nel foglio quando pertinente; gli otto originali precedenti sostituiti sono conservati integralmente nel campo `previousOriginal` dei rispettivi metadati, con attribuzione e riferimenti alle fonti. Per Chicago IX è stato selezionato il record citato, distinto dalla scena alla vecchia stazione. Il testo inglese delle sostituzioni proviene da Project Gutenberg n. 64317; le versioni IT/FR/ES sono riportate dal foglio su richiesta dell’utente.

Quattro associazioni sono state aggiunte alle identità già esistenti; le coordinate sono quelle geografiche già documentate nelle schede dei luoghi:

| Capitolo | Luogo | Funzione narrativa | Coordinate | Lingue inserite | Stato |
| --- | --- | --- | --- | --- | --- |
| II | West Egg | citato | modello Great Neck / Kings Point | EN, IT, FR, ES | la strada è descritta fra West Egg e New York |
| III | East Egg | citato | modello Sands Point | EN, IT, FR, ES | gli ospiti di East Egg sono descritti alla festa |
| III | Long Island Sound | citato | punto rappresentativo nelle acque occidentali | EN, IT, FR, ES | Nick riflette sulla villa di Gatsby |
| IX | East Egg | citato | modello Sands Point | EN, IT, FR, ES | ipotesi narrata su un viaggio, non scena ambientata a East Egg; categoria corretta rispetto a `action` nel foglio |

In seguito all’inserimento delle quattro associazioni il sito ha mostrato temporaneamente un errore di caricamento: l’adattatore richiede che `placeCategories` compaia nei `legacy_fields` delle sezioni con categoria esplicita. Il campo è stato aggiunto ai capitoli II, III e IX e il caricamento pubblico è tornato operativo. Sono state controllate nel sito le schede West Egg I e Long Island Sound III, compresi citazione italiana e categoria di quest’ultimo. I 39 nuovi testi sono stati confrontati con il contenuto pubblico del database; le transazioni sono state provate localmente in PGlite. La verifica indipendente delle trascrizioni IT/FR/ES e dei diritti rimane aperta.

**Situazione: 66 righe su 79 utilizzate**, 197 versioni tradotte pubblicate (la versione francese di Queens manca). Le 13 righe non inserite sono conservate per l’analisi:

| Riferimenti del foglio | Luogo | Esito |
| --- | --- | --- |
| 0004, 0017, 0056 | New York | menzioni di una città molto famosa, escluse dalla vista secondo le istruzioni geografiche |
| 0007 | California | menzione di uno Stato, esclusa dalla vista |
| 0045 | Montenegro | menzione di uno Stato, esclusa dalla vista |
| 0013 | Hot Springs | identificazione fra omonimi non risolta; nessuna coordinata assegnata |
| 0014 | Westchester | associazione e perimetro geografico ancora da documentare |
| 0015, 0079 | Middle West | riferimento regionale; perimetro utile non verificato |
| 0041, 0066 | Port Roosevelt | identificazione e coordinate non risolte |
| 0062 | Kapiolani | referente storico non identificato con sufficiente certezza |
| 0067 | Gad’s Hill | identificazione e coordinate non risolte |

Queste decisioni non completano l’analisi integrale del romanzo né la verifica dei restanti luoghi preesistenti. Non sono stati creati punti arbitrari per le località irrisolte.

## Completamento delle otto righe residue

Le decisioni qui sotto superano lo stato pendente del paragrafo precedente. Sono state pubblicate 24 versioni tradotte per otto associazioni, riunite in sei identità geografiche. I 24 testi, le categorie e i contorni sono stati confrontati con i dati pubblici; le tre transazioni sono state provate localmente in PGlite e con il renderer dell’atlante. Sul sito sono state controllate le schede Midwest, Kapiolani, Port Roosevelt e Gad’s Hill, con selettore di lingua, classificazione e descrizioni. Non è stato svolto un nuovo confronto delle trascrizioni con i PDF o una verifica indipendente dei diritti delle edizioni, come richiesto dall’utente.

| Capitolo | Luogo geografico | Funzione narrativa | Coordinate / rappresentazione | Lingue del passo | Stato e fonte |
| --- | --- | --- | --- | --- | --- |
| I | Hot Springs, Arkansas | citato: fotografie sportive | riferimento alla città, GNIS 0077237 | EN, IT, FR, ES | l’edizione annotata indicata sotto identifica l’Arkansas; nessun campo sportivo specifico è attribuito alla scena |
| I | Westchester | citato: torneo progettato | contorno Census 2020 della contea, generalizzazione 0,002° | EN, IT, FR, ES | la nota editoriale identifica la contea; il luogo del torneo resta sconosciuto |
| I, IX | Middle West | citato: riflessioni e ricordi di Nick | contorno Census 2020 della regione statistica, generalizzazione 0,02° | EN, IT, FR, ES in entrambi | il contorno moderno è soltanto contesto: non attribuisce al Middle West letterario limiti esatti o identici nel 1922 |
| VII | Kapiolani | citato: Tom ricorda un luogo durante il confronto al Plaza | riferimento approssimativo al parco di Honolulu | EN, IT, FR, ES | Bruccoli interpreta il nome come il parco; il testo non identifica un punto preciso. Il riferimento cartografico è una stazione di monitoraggio nel parco, non il punto del ricordo |
| IV | Port Roosevelt | azione: Nick e Gatsby attraversano il luogo in auto | riferimento approssimativo presso la foce del Flushing Creek | EN, IT, FR, ES | Bruccoli propone come probabile modello l’ex terminal delle chiatte di Flushing Bay; il punto è una stazione moderna presso la foce, non il terminal esatto né un indirizzo fittizio |
| VIII | Port Roosevelt | citato: percorso di Wilson ricostruito successivamente | stesso riferimento al modello proposto | EN, IT, FR, ES | una sola identità narrativa; categoria distinta da quella del capitolo IV |
| VIII | Gad’s Hill | citato: percorso ricostruito di Wilson | contorno OpenStreetMap di Long Island; nessun punto esatto | EN, IT, FR, ES | Bruccoli non individua il luogo nelle mappe e ritiene il nome probabilmente inventato; il contorno è contesto geografico ampio, non una localizzazione precisa o un confine della località. La categoria è `mentioned`, diversa da `action` nel foglio, perché l’episodio è riferito a posteriori |

Riscontri letterari e geografici: [edizione annotata moderna, note su Westchester e Hot Springs](https://www.scribd.com/document/876579223/The-Great-Gatsby-6); [Matthew J. Bruccoli, *Apparatus for The Great Gatsby*, note su Port Roosevelt, Kapiolani e Gad’s Hill](https://www.scribd.com/document/975119952/Apparatus-for-F-Scott-Fitzgerald-s-the-Great-Gatsby-Under-Bruccoli-Matthew-J-Matthew-Joseph-1931-South-Carolina-Apparatus-for-978087); [USGS GNIS, Hot Springs](https://edits.nationalmap.gov/apps/gaz-domestic/public/search/names/0077237); [Census 2020, contea](https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/State_County/MapServer/55) e [regione](https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Region_Division/MapServer/10); [Water Quality Portal, Kapiolani Park](https://www.waterqualitydata.us/provider/STORET/21HI/21HI-000307/); [US Army Corps of Engineers, *Flushing Bay and Creek*, 1924](https://www.govinfo.gov/content/pkg/SERIALSET-08273_00_00-024-0124-0000/pdf/SERIALSET-08273_00_00-024-0124-0000.pdf); [NYC DEP, stazione S6 alla foce del Flushing River](https://www.nyc.gov/assets/dep/downloads/pdf/water/nyc-waterways/sentinel-monitoring-program/2025-sentinel-monitoring-report.pdf); [OpenStreetMap, Long Island](https://www.openstreetmap.org/relation/3955977) e [USGS, geografia dell’isola](https://www.usgs.gov/centers/new-york-water-science-center/science/long-island-location-and-physical-setting). Bruccoli discute Little Neck Bay come alternativa a Flushing Bay ma la giudica improbabile; non è presentata come modello confermato.

**Stato finale del foglio:** 74 delle 79 righe sono state utilizzate per 221 versioni tradotte; le cinque restanti sono le menzioni escluse di New York, California e Montenegro già elencate sopra. La mancanza della versione francese di Queens (0018) resta una lacuna. Questi numeri riguardano il foglio, non dimostrano la completezza dell’analisi geografica dell’intero romanzo.

## Versioni consultate e limiti dei diritti

| Lingua | Opera / edizione e traduttore | Testo integrale disponibile | Pubblico dominio e restrizioni | Fonti e verifiche |
| --- | --- | --- | --- | --- |
| EN | F. Scott Fitzgerald, *The Great Gatsby* (1925), Project Gutenberg n. 64317 / Standard Ebooks | sì, fonti digitali pubbliche | opera originale di pubblico dominio secondo le normali durate USA ed europee; verificare separatamente termini di ogni copia digitale | [Gutenberg](https://www.gutenberg.org/ebooks/64317); originali e contesto controllati per i passaggi geografici lavorati |
| IT | *Il grande Gatsby*, PDF indicato dall’Excel; traduttore ed edizione non accertati | il foglio riferisce un PDF integrale; copia non disponibile in questa sessione | diritti e riuso in Italia non verificati indipendentemente; pubblicazione dei frammenti su richiesta esplicita dell’utente | [fonte indicata](https://www.skylabstudios.it/il-grande-gatsby/); trascrizioni accettate dal foglio 17, non ricollazionate qui |
| FR | *Gatsby le Magnifique*, Victor Llona, Éditions du Sagittaire, 1946; trascrizione Wikisource | capitoli indicizzati online | Llona morì nel 1953; verificare eventuali specificità territoriali, revisione, copia digitale e apparati; la prefazione non è inclusa | [Wikisource e scansioni](https://fr.wikisource.org/wiki/Livre:Fitzgerald_(trad._Llona_1946)_-_Gatsby_le_Magnifique.djvu); passi come nel foglio 17 |
| ES | *El gran Gatsby*, PDF indicato dall’Excel; traduttore ed edizione non accertati | il foglio riferisce un PDF integrale; copia non disponibile in questa sessione | la disponibilità online non certifica il riuso in Italia; diritti non verificati indipendentemente, pubblicazione su richiesta esplicita dell’utente | [fonte indicata](https://www.elejandria.com/libro/el-gran-gatsby/francis-scott-fitzgerald/1852); trascrizioni accettate dal foglio 17, non ricollazionate qui |
