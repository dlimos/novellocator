# Inserimento delle citazioni tradotte

Prima tranche del 13 ottobre 2026: 22 associazioni di *Delitto e castigo*, sei in inglese (Constance Garnett) e sedici in francese (Victor Derély, Plon, 1884). Sono incluse tredici traduzioni di passi relativi a luoghi mappati e nove traduzioni per otto record senza coordinate. La distinzione azione/menzione e i testi originali sono conservati.

I passi inglesi sono tratti dalla trascrizione [Project Gutenberg n. 2554](https://www.gutenberg.org/ebooks/2554); il preciso esemplare cartaceo utilizzato dal progetto non è identificato, e l'attribuzione lo dichiara. Per il francese sono stati consultati i capitoli [I.1](https://fr.wikisource.org/wiki/Crime_et_Châtiment/I/1), [I.2](https://fr.wikisource.org/wiki/Crime_et_Châtiment/I/2), [I.3](https://fr.wikisource.org/wiki/Crime_et_Châtiment/I/3), [I.4](https://fr.wikisource.org/wiki/Crime_et_Châtiment/I/4). Si tratta di traduzioni storiche, distinte dalle edizioni moderne del repertorio iniziale.

Il registro locale `verified/crime-and-punishment.json` conserva per ogni associazione il riscontro originale, l'allineamento narrativo, la fonte, l'attribuzione e la motivazione del riuso. Le copie delle risposte testuali consultate sono in `corpus/`. Il test `check-selected-quotes.cjs` verifica che ogni passo sia contenuto letteralmente nella fonte, normalizzando soltanto gli spazi.

L'importazione è stata collaudata due volte in PostgreSQL/PGlite con `tests/check-quotation-import.ts`: la ricostruzione completa conferma che cambiano soltanto le traduzioni previste. Lo script limita ogni aggiornamento a libro, sezione e posizione del record; gli estratti mappati sono soltanto inseriti, senza sovrascrivere quelli esistenti. Prima di applicare una traduzione, confronta il testo originale pubblicato con quello verificato localmente e interrompe la transazione in caso di divergenza.

La prima versione dello script è stata fermata dalla revisione automatica per un avviso di Supabase sugli aggiornamenti potenzialmente estesi. La versione corretta usa inserimenti senza aggiornamento dei conflitti e aggiornamenti puntuali con payload codificati, evitando che la punteggiatura dei brani interferisca con il controllo del SQL Editor. È stata eseguita nel database; la verifica finale confronta i testi integrali dei 22 passi con i valori attesi.

L'interfaccia usa la lingua selezionata per schede, popup e luoghi senza coordinate, con attribuzione editoriale e grassetto sul termine realmente presente. I brani mancanti hanno un messaggio esplicito, senza sostituzione automatica con l'originale. Le esportazioni CSV conservano anche il riscontro originale per l'analisi.

**L'inserimento di tutti i romanzi in tutte le lingue non è completato.** Il [prospetto di copertura](COPERTURA.md) e il registro locale `coverage.json` documentano tutte le lacune. Le edizioni moderne sono state identificate bibliograficamente, ma non sono ancora disponibili tutti i loro testi da cui ricavare e controllare i passi. Anche le versioni storiche richiedono l'allineamento per singola scena; la corrispondenza di un toponimo, da sola, non giustifica l'inserimento.

Comandi per aggiornare il lavoro:

```powershell
node scripts/database/audit-quotation-translations.cjs
npx tsx scripts/database/prepare-quotation-translations.ts
node tests/check-selected-quotes.cjs
npx tsx tests/check-quotation-import.ts
```

I corpora, i record testuali e gli script SQL generati rimangono locali ed esclusi da Git, come gli altri contenuti editoriali del progetto. La pubblicazione dell'interfaccia usa il branch `docs`.
