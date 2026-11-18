# Proust — rilascio delle correzioni di copertura

18 novembre 2026. Importazione applicata in Supabase e rilette esattamente tutte le righe delle nove tabelle tramite API anonima. Il risultato coincide con il piano collaudato. Il frontend viene pubblicato sul branch `docs`; la verifica del deploy è registrata separatamente in [VERIFICA-PUBBLICAZIONE.json](VERIFICA-PUBBLICAZIONE.json).

## Risultato

Sono state aggiunte 237 traduzioni autentiche e due originali francesi, e ricontestualizzati 77 originali conservandone gli identificativi. Ora 248 delle 249 associazioni geografiche visibili hanno FR/IT/EN/ES. I luoghi geografici distinti restano 162. Il lotto Excel di 169 associazioni e tutti i suoi estratti sono invariati; le 114 schede sospese non sono importate.

| Volume | Associazioni visibili | Passo in quattro lingue | Lacune conservate |
|---|---:|---:|---:|
| 1 | 40 | 40 | 0 |
| 2 | 15 | 15 | 0 |
| 3 | 53 | 53 | 0 |
| 4 | 28 | 28 | 0 |
| 5 | 32 | 32 | 0 |
| 6 | 31 | 30 | 1 |
| 7 | 50 | 50 | 0 |

Tutte le cinque posizioni nelle due vedute immaginarie hanno citazioni nelle quattro lingue. Le schede delle vedute mostrano le descrizioni letterarie pertinenti; i modelli reali conservano le descrizioni geografiche. I riepiloghi di Saint-Hilaire e Tansonville sono riallineati ai passi selezionati. Tutte le posizioni visibili hanno una descrizione nelle quattro lingue. L’inventario associazione–lingue è [COPERTURA-CORRETTA.csv](COPERTURA-CORRETTA.csv); le versioni complete, i traduttori e i diritti sono nella [scheda generale](../staging-2026-11-12/VERSIONS-ET-DROITS.md), integrata dalla [valutazione del riuso di questo lotto](CORREZIONI-E-RIUSO.md).

Le sei precedenti associazioni prive di evidenza geografica adeguata sono archiviate con motivazione e conservate nel database, insieme agli estratti precedenti. Montalivet è aggiunta al volume V con lo stesso identificativo geografico; nessun luogo geografico è cancellato. La correzione del quai d’Orléans distingue la residenza riferita da una scena d’azione. Il [dossier](CORREZIONI-E-RIUSO.md) dettaglia ciascuna decisione e non presume una nuova analisi integrale che escluda riferimenti alternativi.

## Lacuna ancora aperta

San Marco, volume VI: il vecchio passo descrive il campanile separato. Rimane conservato con verifica pendente e non viene mostrato o esportato come prova della visita alla basilica. La posizione resta visibile e censita. La visita al battistero è presente nelle copie IT/ES, ma manca nelle copie storiche FR/EN consultate; manca ancora la collazione delle corrispondenti versioni di un’edizione che includa la scena, con attribuzione e riuso documentati. Il rapporto non dichiara completa l’intera copertura.

## Verifiche eseguite e limiti

PostgreSQL isolato e transazioni native: vincoli, risultato esatto delle nove tabelle, rollback, idempotenza, rifiuto di snapshot concorrenti e preservazione di un’altra opera. La prova nativa con rollback è stata riletta dall’API e confrontata integralmente col prima; dopo il commit il confronto integrale coincide col dopo.

Codice effettivamente pubblico delle schede, delle tendine e delle esportazioni, con le correzioni: 1.012 selezioni iniziali, 4.048 cambi di lingua, 16 CSV, quattro lingue di interfaccia e entrambe le modalità. Testo, attribuzione e grassetto cambiano insieme senza cambiare l’interfaccia; le associazioni archiviate non riappaiono nei CSV; i testi pendenti non filtrano nella colonna dell’originale. Nessuna citazione disponibile ha un problema di grassetto rilevato. La verifica funzionale con DOM simulato non è presentata come controllo visivo nel browser.

Prove: [database](COLLAUDO-DATABASE.json), [lettura ed esportazione](COLLAUDO-LETTURA.json), [esito live e conteggi](ESITO-CORREZIONI.json). Lo [stato iniziale](VERIFICA-COPERTURA.md) resta una fotografia storica precedente alle correzioni. Non si attesta una nuova analisi integrale o una collazione esterna di tutti gli estratti estranei al lotto.
