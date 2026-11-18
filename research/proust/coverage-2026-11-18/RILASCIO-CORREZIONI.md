# Proust — rilascio delle correzioni di copertura

18 novembre 2026. Importazione applicata in Supabase e rilette esattamente tutte le righe delle nove tabelle tramite API anonima. Il risultato coincide con il piano collaudato. Il frontend è pubblicato sul branch `docs`; gli hash dei quattro file serviti da GitHub Pages coincidono con il commit. La verifica del deploy è registrata in [VERIFICA-PUBBLICAZIONE.json](VERIFICA-PUBBLICAZIONE.json).

## Risultato

Sono state aggiunte 240 traduzioni autentiche e due originali francesi, e ricontestualizzati 78 originali conservandone gli identificativi. Ora tutte le 249 associazioni geografiche visibili hanno FR/IT/EN/ES. I luoghi geografici distinti restano 162. Il lotto Excel di 169 associazioni e tutti i suoi estratti sono invariati; le 114 schede sospese non sono importate.

| Volume | Associazioni visibili | Passo in quattro lingue | Lacune conservate |
|---|---:|---:|---:|
| 1 | 40 | 40 | 0 |
| 2 | 15 | 15 | 0 |
| 3 | 53 | 53 | 0 |
| 4 | 28 | 28 | 0 |
| 5 | 32 | 32 | 0 |
| 6 | 31 | 31 | 0 |
| 7 | 50 | 50 | 0 |

Tutte le cinque posizioni nelle due vedute immaginarie hanno citazioni nelle quattro lingue. Le schede delle vedute mostrano le descrizioni letterarie pertinenti; i modelli reali conservano le descrizioni geografiche. I riepiloghi di Saint-Hilaire e Tansonville sono riallineati ai passi selezionati. Tutte le posizioni visibili hanno una descrizione nelle quattro lingue. L’inventario associazione–lingue è [COPERTURA-CORRETTA.csv](COPERTURA-CORRETTA.csv); le versioni complete, i traduttori e i diritti sono nella [scheda generale](../staging-2026-11-12/VERSIONS-ET-DROITS.md), integrata dalla [valutazione del riuso di questo lotto](CORREZIONI-E-RIUSO.md).

Le sei precedenti associazioni prive di evidenza geografica adeguata sono archiviate con motivazione e conservate nel database, insieme agli estratti precedenti. Montalivet è aggiunta al volume V con lo stesso identificativo geografico; nessun luogo geografico è cancellato. La correzione del quai d’Orléans distingue la residenza riferita da una scena d’azione. Il [dossier](CORREZIONI-E-RIUSO.md) dettaglia ciascuna decisione e non presume una nuova analisi integrale che escluda riferimenti alternativi.

## San Marco: caso di edizione risolto

Il problema del campanile è risolto con il passo del gesto materno nel battistero. FR è verificato nella BNR; IT e ES nelle copie integrali già acquisite. Per EN si usa un’autentica traduzione pubblicata da David Spurr nello studio *Architecture and Modern Literature*, p. 176, con credito esplicito e omissione iniziale indicata. La disponibilità di questo frammento non è presentata come acquisizione di una nuova traduzione inglese integrale del romanzo. Il [dossier specifico](SANMARCO-RISOLTO.md) documenta testo di origine, attribuzione, limiti della copia e riuso. La vecchia prova del campanile resta integralmente nei metadati. Nessuna citazione visibile rimane pendente.

## Verifiche eseguite e limiti

PostgreSQL isolato e transazioni native: vincoli, risultato esatto delle nove tabelle, rollback, idempotenza, rifiuto di snapshot concorrenti e preservazione di un’altra opera. La prova nativa con rollback è stata riletta dall’API e confrontata integralmente col prima; dopo il commit il confronto integrale coincide col dopo.

Codice effettivamente pubblico delle schede, delle tendine e delle esportazioni, con le correzioni: 1.016 selezioni iniziali, 4.064 cambi di lingua, 16 CSV, quattro lingue di interfaccia e entrambe le modalità. Testo, attribuzione e grassetto cambiano insieme senza cambiare l’interfaccia; le associazioni archiviate non riappaiono nei CSV; i testi pendenti non filtrano nella colonna dell’originale; la vecchia prova del campanile resta esclusa dai CSV dopo la correzione. Nessuna citazione disponibile ha un problema di grassetto rilevato. La verifica funzionale con DOM simulato non è presentata come controllo visivo nel browser.

Prove: [database](COLLAUDO-DATABASE.json), [lettura ed esportazione sul sito pubblicato](COLLAUDO-LETTURA-PUBBLICA.json), [esito live e conteggi](ESITO-CORREZIONI.json). Lo [stato iniziale](VERIFICA-COPERTURA.md) resta una fotografia storica precedente alle correzioni. Non si attesta una nuova analisi integrale o una collazione esterna di tutti gli estratti estranei al lotto.

L’ultimo completamento di San Marco ha superato lo stesso collaudo isolato e le transazioni native con rollback e commit: [COLLAUDO-SANMARCO.json](COLLAUDO-SANMARCO.json). Il confronto finale di tutte le nove tabelle rilette dall’API coincide esattamente con il piano.
