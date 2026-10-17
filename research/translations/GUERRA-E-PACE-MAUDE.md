# Guerra e pace — nuove citazioni Maude

Confronto del 17 ottobre 2026 dei **136 gruppi ancora privi di inglese**: 135 nuovi passi autentici e una lacuna documentata. Le 108 versioni inglesi preesistenti sono conservate senza riscriverle; il totale disponibile passa a **243 gruppi su 244**. Il registro distingue esplicitamente i nuovi confronti dalle versioni preesistenti: il conteggio non certifica una nuova revisione di queste ultime.

## Fonti, edizione e diritti

Leo Tolstoy, *War and Peace*, traduzione di Louise e Aylmer Maude. La [scheda Gutenberg 2600](https://www.gutenberg.org/ebooks/2600) identifica entrambi i traduttori e dichiara il pubblico dominio negli Stati Uniti. Il [testo Gutenberg](https://www.gutenberg.org/cache/epub/2600/pg2600-images.html) è consultabile tramite il servizio di ricerca, ma i tentativi di download diretto dal computer hanno dato timeout. Il tentativo di recupero dal mirror GITenberg e quello della copia PDF non hanno fornito un testo scaricato utilizzabile; non sono usati come fonti dei nuovi estratti.

Per i nuovi passi si usa la trascrizione verificabile di [Wikisource](https://en.wikisource.org/wiki/War_and_Peace_(Tolstoy)), basata sul facsimile *War and Peace.djvu*: [indice](https://en.wikisource.org/wiki/Index:War_and_Peace.djvu), [frontespizio](https://en.wikisource.org/wiki/Page:War_and_Peace.djvu/1), [pagina dei diritti](https://en.wikisource.org/wiki/Page:War_and_Peace.djvu/2). Il frontespizio indica William Benton, Encyclopædia Britannica, Chicago–London–Toronto; l’edizione è la ristampa del 1952, non viene attribuita a un esemplare Gutenberg identificato. La pagina dei diritti menziona l’accordo con Oxford University Press e il copyright della pubblicazione del 1952: questo avviso non viene confuso con i diritti della traduzione storica, né ignorato per estendere il riuso agli apparati.

Le schede di [Louise Maude](https://en.wikisource.org/wiki/Author:Louise_Maude) e [Aylmer Maude](https://en.wikisource.org/wiki/Author:Aylmer_Maude) documentano le morti rispettivamente nel 1939 e nel 1938; quella di Louise registra la traduzione del 1922 e la successiva edizione del 1937. Il riuso riguarda il testo storico della traduzione, i cui termini sono trascorsi nei territori considerati, non le note biografiche, gli elenchi dei personaggi, le introduzioni o altri contributi editoriali successivi. La trascrizione Wikisource è accreditata. L’anno 1952 è indicato come ristampa, senza inventare una revisione moderna o attribuirla ai traduttori.

## Integrità e corrispondenze

Conservati gli indici e tutti i **365 capitoli** elencati: quindici libri con 28, 21, 19, 16, 22, 26, 13, 22, 23, 39, 34, 16, 19, 19 e 20 capitoli, più sedici capitoli del primo epilogo e dodici del secondo. Per ogni capitolo sono archiviati HTML e paragrafi letterali separati dai controlli, dai numeri di pagina e dagli apparati. L’indice del facsimile dichiara il corpo dell’opera trascritto e revisionato, con validazione non uniforme: non si dichiara che tutte le pagine siano validate.

La divisione in libri della traduzione non coincide sempre con quella del riscontro russo dell’atlante. Le menzioni di Erfurt del 1808 e della guerra contro l’Austria del 1809, associate alla sezione 6 dell’atlante, si trovano rispettivamente nel libro inglese V, capitoli XXI e XXII. Questo spostamento è verificato anche nel testo Gutenberg; i crediti seguono il libro inglese effettivo e i dati mantengono distinta la sezione dell’atlante.

Ogni nuova citazione è allineata manualmente al fatto, discorso, ricordo, progetto o confronto saggistico del riscontro russo. Non basta trovare lo stesso nome altrove. La lacuna rimasta è la menzione dell’Europa nella descrizione delle relazioni di Elena dopo Erfurt (sezione 6): sia la trascrizione consultata sia il testo Gutenberg parlano dei notabili napoleonici senza conservare quel riferimento geografico. Non si aggiunge “Europe” e non si sostituisce il passo con un’altra frase su Erfurt.

Le forme autentiche comprendono anche aggettivi geografici, quali *French*, *Russian* ed *European*. Sono registrate esplicitamente per evidenziarle senza inserire o espandere toponimi assenti. I refusi e i residui di composizione non sono corretti tacitamente: quando possibile si seleziona una clausola integra e pertinente che li esclude; per esempio, il progetto di viaggio di Andrea conserva la clausola sulle tre destinazioni senza il residuo di markup che precede quella clausola nella trascrizione.

## Necessità, proporzione e conservazione

I 135 abbinamenti impiegano 115 testi distinti, per 22.535 caratteri complessivi senza ripetizioni; il più lungo misura 513 caratteri. Queste misure descrivono la selezione e non sono soglie automatiche di liceità. Ogni estratto serve l’analisi del riferimento geografico: destinazioni, provenienze, lettere, ricordi, titoli, esempi storici e paragoni restano distinti dalle scene dell’azione. Le nuove aggiunte sono tutte menzioni; non comportano nuove coordinate o cambi di categoria.

Gli originali russi, i testi inglesi precedenti, le 217 citazioni italiane accettate, le versioni francesi e la traduzione italiana respinta di Anna Scherer restano conservati con i rispettivi stati. Restano inoltre le 34 correzioni di categoria già pubblicate. Nessun URL dei testi viene aggiunto alle superfici pubbliche: bibliografia e attribuzioni sono presentate come testo.

## Registri e controlli

- `war-and-peace-maude-review.json`: tutti i 244 gruppi, con 135 nuovi verificati, 108 preesistenti conservati e una lacuna.
- `verified/war-and-peace.json`: 217 record italiani e 135 nuove versioni inglesi, con testo originale, motivazione narrativa, edizione, capitolo e paragrafo della fonte.
- `corpus/war-maude-ws-chapters.json`: indice delle 365 pagine consultate, con i corrispondenti HTML e file dei paragrafi.
- `war-and-peace-maude-import-batches.json`: due lotti delle sole aggiunte inglesi; `war-and-peace-all-import-batches.json` include anche le importazioni italiane per la verifica completa.

Il controllo delle fonti verifica letteralità e forme evidenziate per tutti i 352 record di importazione. Il controllo Maude verifica la copertura dei gruppi mancanti, i capitoli disponibili e gli spostamenti fra libri. Il test PostgreSQL/PGlite applica due volte l’insieme dei lotti e ricostruisce integralmente i dati, verificando la conservazione degli originali e degli altri campi.

## Pubblicazione

I due lotti delle 135 nuove versioni sono pubblicati. La verifica letterale del database conferma tutti i 244 originali, i 243 testi inglesi, i 218 record italiani conservati incluso quello respinto e i 17 francesi. Le 34 categorie già corrette sono conservate; l’italiano respinto su Pietroburgo resta escluso dalla visualizzazione. La suite completa `npm test`, il controllo delle fonti, il controllo specifico Maude e la doppia importazione SQL/PGlite sono passati. Sul sito è stata verificata la nuova citazione del Messico nel secondo epilogo, con selezione inglese, nome evidenziato e attribuzione completa. Prova visiva locale: `war-and-peace-maude-published.png`.
