# Gatsby — citazioni dall’Excel, 14 novembre 2026

Su richiesta esplicita dell’utente sono stati pubblicati direttamente i passi del foglio 17 di `NovelLocator_Gatsby_79_CITAZIONI_IT_FR_ES_PUBBLICATE.xlsx`, assumendo la collazione dichiarata nel foglio senza ripetere il confronto con i PDF. Le ellissi sono conservate come nel file. Le edizioni italiane e spagnole restano senza traduttore identificato; la fonte francese è attribuita a Victor Llona, Éditions du Sagittaire, 1946. La verifica indipendente dei diritti non è stata completata; la decisione di pubblicazione è stata esplicitamente assunta dall’utente.

Il primo lotto comprende 42 associazioni già esistenti, nelle quali il passo inglese del foglio compare nell’originale conservato nel database: 42 versioni italiane, 41 francesi e 42 spagnole. La versione francese di Queens (GAT-EXC-0018) non è presente nel foglio. Gli originali e le categorie sono conservati. La versione spagnola su Minnesota (GAT-EXC-0052) riporta nord mentre il riscontro originale riporta sud; la variante è registrata nei metadati.

Le 37 righe rimanenti non sono state inserite: il riferimento non compare nello stesso passo originale già associato al luogo, oppure non è stato riconciliato con un record mappato. Non sono dichiarate verificate né pubblicate. Il censimento complessivo del romanzo, i luoghi citati e l’analisi dei nove capitoli restano fuori dalla verifica di questo lotto.

Una transazione idempotente conserva i record originali ed è stata provata due volte in PGlite con le righe pubbliche. Il successivo riscontro REST ha confermato 125 testi esattamente corrispondenti al foglio; sul sito è stata controllata la scheda Monte Carlo con il selettore delle quattro lingue e il passo italiano. Snapshot, riconciliazione e SQL locale: `tmp/gatsby-excel-review/`.

## Secondo lotto

Pubblicate ulteriori 33 versioni: 18 su sei associazioni nelle tabelle `excerpts` e 15 su cinque associazioni conservate nei metadati geografici (Muhlbach Hotel, Old Metropole, Trinity Quad, Little Girl Bay e vecchia Union Station). Le tre lingue del foglio sono presenti per ciascuna delle undici associazioni. La traduzione spagnola di Union Station riporta «Union Street»: la divergenza è conservata nei metadati, senza correggere il testo.

Complessivamente sono state pubblicate 158 versioni per 53 delle 79 righe del foglio; 26 righe restano da riconciliare. Sono conservati gli originali precedenti. Il test locale ha eseguito la transazione su dati pubblici e il confronto successivo ha confermato tutti i 33 testi nel database pubblico. La scheda Trinity Quad è stata controllata sul sito, con le quattro opzioni di lingua e il passo italiano visibile. La pubblicazione non costituisce verifica indipendente delle trascrizioni o dei diritti.
