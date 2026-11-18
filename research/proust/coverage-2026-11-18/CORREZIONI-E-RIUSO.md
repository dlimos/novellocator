# Proust — correzioni delle lacune e valutazione del riuso

18 novembre 2026. Piano circoscritto alle associazioni precedenti al lotto Excel. Stato: importazione applicata e risultato integrale verificato tramite API pubblica; pubblicazione del frontend e verifica del deploy documentate nel [rapporto di rilascio](RILASCIO-CORREZIONI.md).

## Modifiche pubblicate

- 80 gruppi di passi FR/IT/EN/ES selezionati e confrontati nel contesto: 240 traduzioni aggiunte, due nuovi originali FR (Grands Boulevards VII e rue Montalivet V), 78 originali preesistenti ricontestualizzati conservando i rispettivi identificativi. Il diff privato conserva ogni riga precedente completa.
- Tutti i 23 problemi di grassetto precedenti sono corretti tramite forme autentiche, anche indirette; San Marco usa ora la scena del battistero riscontrata in fonti alternative.
- Sei associazioni improprie sono archiviate con metadati e motivazione, senza cancellarne righe o estratti: Montalivet I, Baviera III/IV/V/VII e Chartres VII. Il primo caso deriva da un passo del volume V; gli altri dai titoli/nomi di personaggi. Non si afferma una nuova analisi integrale che escluda ogni possibile riferimento alternativo in quei volumi. Si archivia l’associazione fondata sulla precedente evidenza inadeguata. I riferimenti geografici validi di Baviera e Chartres negli altri volumi restano visibili.
- Rue Montalivet è associata correttamente al volume V come menzione retrospettiva di Brichot; il `place_id` geografico resta lo stesso. La residenza di Swann sul quai d’Orléans è classificata `mentioned`: il passo riferisce dove abita, non narra una scena lì.
- Le cinque schede delle due vedute mostrano il riepilogo letterario. Due riepiloghi (campanile di Saint-Hilaire e sentieri di Tansonville) sono riallineati ai passi effettivamente selezionati nelle quattro lingue. Le descrizioni dei modelli reali restano nella modalità geografica.
- Il lotto originario di 169 associazioni e tutti i suoi estratti rimangono identici. Identificativi geografici, coordinate, descrizioni geografiche e sette sezioni restano invariati. Le 114 schede sospese non sono importate.

## Copie e attribuzioni

Sono riutilizzate le 21 copie integrali già acquisite e documentate nella [scheda generale delle versioni](../staging-2026-11-12/VERSIONS-ET-DROITS.md) e nei dossier [IT](../translations-2026-11-14/RIUSO-ITALIANO.md), [EN](../translations-2026-11-14/RIUSO-INGLESE.md), [ES](../translations-2026-11-14/RIUSO-SPAGNOLO.md) e [ES IV–VII](../translations-2026-11-14/RIUSO-SPAGNOLO-99.md). I crediti italiani del colophon sono distinti per volume e per Un amore di Swann; le attribuzioni ES inferite rimangono esplicite. Non si dichiarano pubbliche le traduzioni italiane o quelle ES IV–VII. I termini ordinari in Italia dei traduttori storici EN e ES I–III sono distinti dai diritti e dalle restrizioni delle copie digitali e dagli altri territori.

La copia IT è l’AZW3 fornito dall’utente, Newton Compton ebook luglio 2011, ISBN 9788854125810. Le copie EN sono PGA, Scott Moncrieff I–VI e Stephen Hudson VII. Le copie ES sono gli EPUB PruébaT; le riserve del fornitore, la dichiarazione Educ.ar, l’assenza di una versione numerica certa della CC e l’assenza di autorizzazione individuale sono conservate nei dossier precedenti. Questa estensione non trasforma quelle informazioni in una licenza generale o in una certificazione mondiale dei diritti.

Ogni nuovo testo proviene dalla copia effettiva, con normalizzazione degli spazi e omissioni esplicite. Sono conservate grafie e varianti, fra cui Fontainebleu IT, La Perousse ES, Postdam ES, Ruan/Ruán ES, il giorno di arrivo della famiglia Stermaria e Touraine/Nizza. Non si producono traduzioni redazionali. I versi di Musset sull’Atlantico sono mantenuti in francese anche nelle copie IT/EN/ES: le versioni inserite comprendono la cornice narrativa nella lingua dell’edizione e il credito dichiara espressamente la conservazione del francese. Non si presenta una nuova traduzione dei versi. Il recupero IT è riscontrato direttamente nell’XHTML Kindle, perché la precedente estrazione per paragrafi aveva escluso la poesia.

Gli originali nuovi o corretti sono riscontrati nelle trascrizioni Wikisource già archiviate o negli estratti del lotto già verificati; si conservano i riferimenti delle copie realmente consultate, senza inventare pagine di stampa. La disponibilità strutturale dei libri non equivale a una nuova collazione integrale. I tentativi di acquisire altre copie Gutenberg nella sessione sono falliti; non se ne dichiarano download o verifiche eseguiti.

## Finalità, necessità e proporzione

Per questa estensione si valuta nuovamente il riuso per critica e discussione geografico-letteraria ai sensi dell’art. 70, commi 1 e 3, legge 633/1941, nel territorio italiano. L’autorizzazione dell’utente riguarda il lavoro e la pubblicazione dell’atlante, non viene presentata come autorizzazione del titolare. La sola brevità o attribuzione non è considerata sufficiente.

Il [diff](DIFF-CORREZIONI.csv) registra una motivazione specifica per ciascuna associazione: residenza contrapposta a scena, viaggio progettato o riferito, memoria, itinerario, metonimia, analogia pittorica, etimologia narrativa o rapporto fra luogo immaginario e modello. Il testo è accanto alla mappa, alla descrizione e alla discussione del luogo. Le porzioni e le clausole più ampie sono mantenute quando servono a rendere comprensibili il confronto o l’analogia; non si aggiungono scene circostanti per costruire una lettura seriale.

L’insieme comprende anche gli estratti già pubblicati: sono valutate ripetizioni e sovrapposizioni. L’unione reperita nelle copie testuali è deduplicata; ogni segmento non localizzato come stringa esatta è conteggiato integralmente nel limite superiore prudenziale, non dichiarato verificato per sola somiglianza. I denominatori comprendono intestazioni e sono indicativi. Le percentuali sono strumenti di controllo, non soglie legali. Gli estratti non ricostruiscono capitoli o sequenze autonome e non sostituiscono la lettura dei libri; anche l’esportazione conserva luogo, sezione, funzione e attribuzione. Nessun libro, copertina o apparato completo viene redistribuito. I link ai testi restano nell’analisi e non sono mostrati nelle schede o nei CSV per i lettori.

| Lingua | Volume | Aggiunte | Parole aggiunte con ripetizioni | Unione complessiva, limite superiore prudenziale | Percentuale indicativa |
|---|---:|---:|---:|---:|---:|
| IT | 1 | 15 | 1121 | 2267 | 1.4212% |
| IT | 2 | 12 | 690 | 938 | 0.4817% |
| IT | 3 | 11 | 769 | 2361 | 1.0883% |
| IT | 4 | 14 | 816 | 1183 | 0.5901% |
| IT | 5 | 9 | 488 | 1606 | 1.0488% |
| IT | 6 | 7 | 503 | 1912 | 1.8036% |
| IT | 7 | 12 | 751 | 2513 | 1.8357% |
| EN | 1 | 15 | 1138 | 2927 | 1.4936% |
| EN | 2 | 12 | 864 | 1250 | 0.5286% |
| EN | 3 | 11 | 868 | 3061 | 1.1877% |
| EN | 4 | 14 | 968 | 1554 | 0.6751% |
| EN | 5 | 9 | 603 | 2038 | 1.151% |
| EN | 6 | 6 | 521 | 2126 | 1.7776% |
| EN | 7 | 12 | 678 | 2574 | 1.8684% |
| ES | 1 | 15 | 1132 | 2575 | 1.513% |
| ES | 2 | 12 | 841 | 1091 | 0.5048% |
| ES | 3 | 11 | 749 | 2753 | 1.1359% |
| ES | 4 | 14 | 771 | 1190 | 0.5795% |
| ES | 5 | 9 | 522 | 1652 | 1.0708% |
| ES | 6 | 7 | 568 | 1966 | 1.888% |
| ES | 7 | 12 | 753 | 2789 | 2.0076% |

Il singolo frammento EN di Spurr (16 parole) è valutato separatamente e non viene diviso per la lunghezza della copia Scott Moncrieff. Fonte e attribuzione aggiuntive sono nel [dossier San Marco](SANMARCO-RISOLTO.md).

I dati dettagliati e i limiti dell’unione sono in [RIUSO-AGGREGATO.json](RIUSO-AGGREGATO.json).

## San Marco VI: problema di edizione risolto

La ricerca successiva ha reperito il francese pertinente nella BNR e la versione inglese autentica pubblicata da David Spurr, da distinguere dalla copia Scott Moncrieff e da un’edizione inglese integrale del romanzo. Le corrispondenti frasi IT/ES sono riscontrate nelle copie complete già acquisite. Il precedente estratto del campanile è conservato nei metadati e sostituito nella scheda, senza cambiare luogo o identificativo. Il [dossier](SANMARCO-RISOLTO.md) documenta i riscontri e il riuso.

## Controlli distinti

Collaudo del database PostgreSQL isolato: vincoli, risultato esatto delle nove tabelle, idempotenza, rollback, rifiuto di snapshot modificati e altra opera invariata. Collaudo del codice pubblico con DOM simulato: quattro lingue, selezione delle citazioni, evidenziazioni, descrizioni, vedute e visibilità delle associazioni archiviate. La verifica visiva nel browser interno non è attestata. Lo stato live e la pubblicazione Git devono risultare dal rapporto finale; questo dossier non li sostituisce.
