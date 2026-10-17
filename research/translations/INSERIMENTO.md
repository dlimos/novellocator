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

## Controllo integrale Verdinois — 14 ottobre 2026

Esaminati tutti i 244 gruppi di citazioni di Guerra e pace, nei quindici libri e nelle due parti dell'epilogo. Pubblicate e confrontate letteralmente nel database **217 citazioni italiane**: 200 associazioni con luoghi e 17 introduzioni di sezione. Restano **27 lacune documentate**, perché il passo corrispondente non conserva il riferimento geografico o non è allineabile esattamente. Non vengono sostituite con frasi vicine; il lettore dispone dell'originale autentico.

Il registro locale `war-and-peace-alignment-review.json` rende conto di tutti i 244 gruppi; `verified/war-and-peace.json` conserva testo, paragrafo, capitolo, volume, parte, attribuzione e confronto narrativo. Le varianti dell'edizione italiana non sono corrette silenziosamente. Il passo iniziale di Anna Scherer resta escluso dalla citazione geografica di Pietroburgo: è utilizzabile soltanto come introduzione della sezione, senza evidenziare il nome della persona come luogo.

Durante il confronto sono state corrette 34 categorie da azione a menzione, quando il riscontro conservato è una destinazione, una notizia, una disposizione militare o un riepilogo, senza scena ambientata nel luogo. `war-and-peace-category-corrections.json` conserva il riscontro originale e la motivazione di ogni modifica. La pubblicazione protegge ogni associazione con confronto dell'originale, aggiorna soltanto gli identificativi previsti e non sovrascrive altri estratti. Il test PostgreSQL/PGlite, eseguito due volte sul medesimo import, conferma la ricostruzione completa e la conservazione degli originali.

Le indicazioni storiche sopra sui messaggi di indisponibilità sono superate: la tendina mostra soltanto testi autentici disponibili e, in mancanza della traduzione, conserva l'originale. Il titolo resta «Passaggio del romanzo»; una sola lingua rende la tendina non modificabile.

## Pavese — 15 ottobre 2026

Il [registro dedicato a Moby-Dick](MOBY-DICK-PAVESE.md) documenta il confronto completo di tutte le 609 associazioni, nei 135 capitoli e nell'epilogo: 592 citazioni italiane verificate, diciassette lacune e diciotto correzioni delle categorie narrative. Sono comprese quattordici citazioni per luoghi senza coordinate e tre tratte da due note dell'autore, distinte dalle note del traduttore. Il confronto dei dati e il test SQL conservano tutti i riscontri originali.

## Garnett — 16 ottobre 2026

Il [registro di Delitto e castigo](DELITTO-E-CASTIGO-GARNETT.md) documenta il confronto di tutti i 363 gruppi nelle sei parti e nell’epilogo: **299 citazioni inglesi verificate**, comprese quaranta introduzioni, e **64 lacune**. Sono 293 aggiunte alle sei versioni inglesi iniziali. La revisione distingue omissioni di Garnett, varianti dei nomi e riscontri originali insufficienti o attribuiti al luogo sbagliato.

Sono corrette 58 categorie da azione a menzione. Ventitré originali non utilizzabili sono marcati pendenti e una precedente versione francese sulle barche della Neva, erroneamente assegnata alla piazza Sennaja, è respinta: i testi restano nei dati di analisi, esclusi dai controlli pubblici delle citazioni. Restano quindici versioni francesi utilizzabili. Le altre lacune inglesi conservano l’originale disponibile, senza inventare il passo mancante.

I cinque lotti SQL sono stati provati due volte in PostgreSQL/PGlite, con ricostruzione integrale dei dati e conservazione dei testi originali. L’aggiornamento dei metadati di revisione usa payload codificati e condizioni puntuali sugli identificativi: un avviso preliminare dell’editor sulle condizioni SQL ha portato ad annullare quella esecuzione e riscrivere la forma della query, senza ampliare gli aggiornamenti.

I lotti sono pubblicati. La verifica finale nel database conferma 299 testi inglesi esatti, le sedici versioni francesi conservate compresa quella respinta, tutti i 24 stati di revisione e le 58 correzioni delle categorie. Controllata sul sito la citazione inglese di Sennaja nel capitolo I.5, con selettore indipendente dall’interfaccia italiana, evidenziazione autentica e credito di Garnett.

## Derély — 17 ottobre 2026

Il [registro francese di Delitto e castigo](DELITTO-E-CASTIGO-DERELY.md) documenta tutti i 363 gruppi: **267 nuove citazioni**, per **282 versioni francesi utilizzabili**, 80 lacune motivate e un’associazione già respinta. Sono compresi 38 estratti introduttivi, 97 associazioni con luoghi mappati o citati e 147 luoghi senza coordinate. Sono documentati i tagli di Derély e l’accorpamento dei capitoli russi VI.III–IV nel francese VI.III: non si ricavano passi mancanti da brani vicini.

Pubblicati i quattro lotti dopo i controlli delle fonti, la suite applicativa e la doppia esecuzione SQL/PGlite. Il confronto finale nel database conferma 299 testi inglesi e 283 record francesi esatti, incluso quello respinto, oltre ai 24 stati di revisione e alle 58 categorie già corrette. Verificata sul sito la citazione francese del vicolo K… con la tendina indipendente dalla lingua italiana dell’interfaccia, il nome evidenziato e l’attribuzione a Derély, Plon 1884. Originali, testi inglesi, coordinate e identità dei luoghi sono conservati.

## Maude — 17 ottobre 2026

Il [registro inglese di Guerra e pace](GUERRA-E-PACE-MAUDE.md) documenta il confronto dei 136 gruppi ancora senza inglese: **135 nuove citazioni** e una lacuna, relativa all’Europa nella frase su Elena a Erfurt. Le 108 versioni inglesi precedenti sono conservate; il totale disponibile è **243 gruppi su 244**. I nuovi passi derivano dalla trascrizione Wikisource della ristampa Encyclopædia Britannica 1952 della versione storica Maude, con facsimile, frontespizio e pagina dei diritti distinti dal testo della traduzione e dagli apparati. Archiviati tutti i 365 capitoli, inclusi entrambi gli epiloghi.

Pubblicati e verificati i due lotti delle sole aggiunte inglesi. Il confronto letterale finale conferma **244 originali russi, 243 inglesi, 218 italiani conservati compreso quello respinto e 17 francesi**; sono confermate le 34 categorie già corrette e lo stato respinto dell’italiano su Anna Scherer erroneamente associato a Pietroburgo. Il test SQL completo è passato dopo due esecuzioni e ricostruzione integrale; passata anche la suite applicativa. Controllata sul sito la nuova citazione inglese sul Messico nel secondo epilogo, con selettore indipendente dalla lingua italiana dell’interfaccia, luogo in grassetto e crediti editoriali.
