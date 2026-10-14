# Inserimento delle citazioni tradotte

## Revisione e selettore del 14 ottobre 2026

Ogni citazione offre una tendina indipendente dalla lingua dell'interfaccia, con soltanto originale e traduzioni effettivamente disponibili. Con una sola versione il controllo è disabilitato. Testo, lingua dichiarata, grassetti e credito cambiano insieme, in schede, popup, sezioni e luoghi senza coordinate. Le attribuzioni sono testo bibliografico, senza link ai romanzi.

La verifica ha respinto il passo italiano di Pietroburgo del Libro I: «Anna Scherer» non è un riferimento geografico valido. Il record è conservato per l'analisi con `verificationStatus: rejected` ed escluso dalla tendina e dal CSV. Questo corregge e supera la precedente nota qui sotto che lo considerava un riferimento indiretto ammissibile. Gli script di inserimento sperimentali in `work/` non costituiscono una verifica e non vanno rieseguiti senza revisione.

Il lotto accettato di Guerra e pace comprende ora 30 citazioni italiane: 15 già presenti del Libro I e 15 nuove del Libro II. Due ulteriori traduzioni autentiche del Libro II (Brünn e Znaim) restano pendenti perché il passo isolato non prova la scena nel luogo classificato come azione. Non vengono pubblicate come nuovi riscontri verificati. Il registro delle tre esclusioni è in `war-and-peace-review-excluded.json`.

Le altre versioni storiche reperite nel repertorio non sono ancora tutte allineate alle singole citazioni: la loro mera disponibilità non le rende opzioni della tendina. La copertura continua a distinguere fonti reperite e passi pronti.

Seconda tranche del 13 ottobre 2026: pubblicate e confrontate nel database **16 citazioni italiane del Libro I di Guerra e pace**, dalla traduzione di Federigo Verdinois, Istituto editoriale italiano, digitalizzazione Liber Liber del 25 luglio 2018. Crediti, riferimento al capitolo dell'edizione italiana e collegamento alle condizioni della fonte accompagnano ogni passo. La verifica PostgreSQL/PGlite esegue l'importazione due volte e confronta la ricostruzione completa: cambiano soltanto queste traduzioni.

Il [file ODT ufficiale](https://www.liberliber.eu/mediateca/libri/t/tolstoj/la_guerra_e_la_pace/odt/tolstoj_la_guerra_e_la_pace.odt) e il PDF sono conservati in `corpus/`. L'ODT contiene quattro volumi, quindici parti narrative e i due epiloghi; i passi del primo libro sono stati confrontati con i riscontri originali. La verifica dell'integrità testuale dell'intera traduzione e l'allineamento degli altri libri restano da completare. La numerazione dei capitoli di Verdinois differisce da quella della fonte Maude, quindi ogni credito usa il capitolo italiano effettivo.

Le 16 corrispondenze sono documentate in `verified/war-and-peace.json`, con numero di paragrafo, testo originale, passo italiano, motivazione dell'allineamento e forme da evidenziare. Sono mantenute le varianti autentiche: «Montecalvo» per Lysye Gory, «Povarscaia» per Povarskaya, «Nuova York» come riferimento indiretto all'America. Nel passo iniziale relativo al salotto di Pietroburgo, il riscontro originale e la traduzione non nominano la città: si evidenzia «Anna Scherer», registrando esplicitamente il riferimento indiretto alla padrona del salotto. Nessun toponimo viene aggiunto al testo.

**Restano pendenti 228 delle 244 associazioni italiane di Guerra e pace.** Una è nel Libro I: nel passo del precettore che scrive alla famiglia, Verdinois omette «Germania» (paragrafo 1143), quindi quella scheda resta senza citazione italiana verificata. Le altre appartengono ai libri successivi e agli epiloghi. Non estendere una citazione ad altre sezioni senza un nuovo allineamento.

Comandi per questo lotto:

```powershell
npx tsx scripts/database/prepare-quotation-translations.ts war-and-peace
node tests/check-war-italian-quotes.cjs
npx tsx tests/check-quotation-import.ts war-and-peace
```

La verifica nel database pubblico ha restituito `it: 16` dopo il confronto esatto dei testi con i record attesi. Il sito in italiano è stato controllato nella scheda di Lysye Gory, con «Montecalvo» in grassetto e attribuzione a Verdinois; prova in `war-and-peace-italian-published.png`.

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
