# Guerra e pace — citazioni francesi Bienstock

Revisione del 18 ottobre 2026: tutti i **244 gruppi** dell’atlante sono registrati, con **220 nuove versioni francesi**, **17 preesistenti conservate** e **sette lacune**. Le versioni preesistenti non sono conteggiate come nuovi allineamenti. Il francese disponibile raggiunge 237 gruppi su 244.

## Edizione, fonte e diritti

Léon Tolstoï, *Guerre et Paix*, traduzione di J.-Wladimir Bienstock, Stock, Paris, 1903–1904, *Œuvres complètes*, tomi VII–XII. L’[indice della trascrizione Wikisource](https://fr.wikisource.org/wiki/Guerre_et_Paix_(trad._Bienstock)) collega i sei facsimili e tutte le parti. La [scheda del traduttore](https://fr.wikisource.org/wiki/Auteur:J.-Wladimir_Bienstock), con riferimenti alle autorità bibliografiche, documenta le date 1868–1933 e la pubblicazione del 1903–1904.

Il riuso riguarda il testo della traduzione storica: i termini patrimoniali sono trascorsi in Italia e Francia (anche considerando le proroghe storiche francesi), in Spagna (termine storico di 80 anni) e negli Stati Uniti (pubblicazione anteriore al 1931). Questo non estende il riuso ad apparati, note o revisioni moderne. La trascrizione è accreditata; non viene dichiarata interamente validata: Wikisource indica uno stato di rilettura/correzione con validazione non uniforme. URL e facsimili restano nella documentazione di analisi, mentre nell’atlante l’attribuzione bibliografica è testo senza collegamenti diretti al romanzo.

## Integrità e varianti

Archiviati indice e **364 pagine di sezione**: 362 capitoli del romanzo e due appendici. I quindici libri hanno rispettivamente 25, 21, 19, 16, 21, 26, 13, 22, 23, 39, 34, 16, 19, 19 e 21 capitoli; seguono 16 capitoli del primo epilogo e 12 del secondo. Ogni pagina conserva HTML e paragrafi letterali, separati da navigazione e apparati. La disponibilità di tutte le sezioni dell’edizione non dimostra l’assenza di omissioni rispetto al russo: la suddivisione differisce e il confronto ha rilevato tagli e varianti, documentati senza correzioni tacite.

Ogni nuovo passo corrisponde manualmente al medesimo evento, discorso, ricordo, progetto o esempio storico del riscontro russo. Sono conservate forme quali *Postdam*, *Pétesbourg*, *Patriarché-Proudi*, *Vosdvijenka*, *Vosvijenka* e *Mitistchi*. Gli etnonimi *Français* sono evidenziati dove la traduzione rende così il riferimento alla Francia. Il piano militare in I.23 indica 5.000 uomini, diversamente dal russo; il matrimonio di Nicola in epilogo I.7 è datato 1813 anziché 1814. Sono varianti della fonte consultata, non emendamenti redazionali. Il riferimento al volume è ricavato dal facsimile associato alla pagina effettiva.

## Sette esclusioni

| Sezione | Luogo | Motivo |
| --- | --- | --- |
| I | Pietroburgo | Nel passo sulla malattia di Anna il nome manca; non si usa il ritratto della società nel capitolo seguente. |
| III | Austerlitz | Il paragrafo corrispondente su Weyrother non conserva il nome; il castello compare in un altro paragrafo. |
| III | Pratzen | Il passo di Andrea con lo stendardo non nomina il luogo; non si sostituisce con la scena del ferimento successivo. |
| X | Monti Calvi | La lettera di Andrea non conserva Lissia-Gorï; la menzione nel dialogo seguente non è lo stesso passo. |
| X | Batteria di Raevskij | L’invito al colle non nomina Raevskij; le menzioni posteriori non sostituiscono la citazione. |
| Epilogo I | Parigi | Nel ritorno dall’Italia il francese scrive France; la successiva Parigi appartiene a un altro momento. |
| Epilogo I | Erfurt | L’elenco si ferma ad Austerlitz e Tilsitt. |

L’Europa nella descrizione di Elena dopo Erfurt (VI.9) è invece conservata da Bienstock: il francese è disponibile anche se manca una corrispondenza inglese Maude. In tutti i casi esclusi resta disponibile l’originale autentico; non viene generata una traduzione sostitutiva.

## Funzione critica e proporzione

Le 220 associazioni nuove usano 196 estratti distinti, per 43.977 caratteri senza duplicazioni; il più lungo misura 870 caratteri. Sono misure descrittive, non soglie automatiche di liceità. Gli estratti servono a discutere l’identificazione geografica e la funzione narrativa del luogo, limitando il testo alla parte pertinente; il pubblico dominio della traduzione costituisce la base di riuso distinta dal solo diritto di citazione.

Il confronto ha inoltre documentato **12 correzioni da azione a menzione**, in aggiunta alle 34 precedenti (totale 46). Si tratta di notizie biografiche o militari, panorami osservati, destinazioni future e città nominate soltanto come estremi di un tragitto: Mosca I; Krems e Schöngrabern II; Monti Calvi III; Sokolniki IV; Kremenčug e Kiev VII; Monti Calvi, Raevskij, Ševardino, Utica e monastero di Kolockoe X. Le motivazioni e i riscontri russi restano nel registro. Non vengono cambiati i testi originali o le coordinate.

## Registri e verifica

- `war-and-peace-bienstock-review.json`: copertura dei 244 gruppi e motivazioni delle lacune.
- `verified/war-and-peace.json`: 572 importazioni complessive, di cui 220 francesi nuove, con riscontro russo e riferimento letterale alla fonte.
- `corpus/war-bienstock-chapters.json`: indice delle 364 pagine, con HTML e paragrafi.
- `war-and-peace-bienstock-import-batches.json`: tre lotti delle sole aggiunte francesi; il registro completo include anche i precedenti lotti italiani e inglesi.

Il controllo specifico verifica copertura, esclusioni, differenza Europa/Maude, numero delle sezioni e tomi. Il controllo delle fonti verifica la letteralità di tutti i 572 record. PostgreSQL/PGlite applica due volte i lotti completi e confronta integralmente i dati ricostruiti: originali e altre lingue restano conservati, insieme allo stato respinto dell’italiano su Anna Scherer.

## Pubblicazione

Pubblicati i tre lotti delle 220 aggiunte francesi. Il confronto letterale del database conferma 244 originali, 243 inglesi, 218 record italiani conservati incluso quello respinto e 237 francesi; tutte le 46 categorie documentate risultano menzioni. L’italiano errato su Pietroburgo conserva lo stato respinto. Passati la suite completa npm test, il controllo delle fonti, il controllo specifico Bienstock, il controllo Maude e la doppia importazione SQL/PGlite. Sul sito sono verificati il Messico nel secondo epilogo e l’Europa nel libro VI, con tendina indipendente dalla lingua italiana dell’interfaccia, toponimo evidenziato e attribuzione Stock. Prove visive locali: war-and-peace-bienstock-published.png e war-and-peace-bienstock-europe-published.png.
