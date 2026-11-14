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
