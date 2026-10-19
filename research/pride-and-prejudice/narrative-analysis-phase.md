# Orgoglio e pregiudizio — analisi narrativa e preparazione editoriale

Aggiornato il 19 ottobre 2026. **Letti integralmente i 61 capitoli** della trascrizione inglese acquisita: 2.063 paragrafi, 121.439 parole. Registrate **407 associazioni sezione–luogo: 96 `action`, 311 `mentioned`, per 66 identità geografiche o ambientazioni di riferimento**. Questi numeri non corrispondono a 66 punti da inserire sulla mappa: comprendono regioni, percorsi, edifici immaginari e luoghi senza identificazione puntuale.

La lettura narrativa e la prima catalogazione sono concluse. **L’aggiunta al sito non è conclusa né pubblicata**: rimangono revisione geografica, collazione definitiva dei passi con un’edizione identificata, selezione degli estratti pubblicabili, allineamenti linguistici, confini, vedute e presentazione. Il flag di certificazione dell’inventario geografico esaustivo resta falso. Non confondere i controlli tecnici superati con una verifica critica completa dei luoghi o con un’importazione remota.

## Esito editoriale

La valutazione positiva dell’analisi preliminare è confermata dalla lettura. Il romanzo offre una geografia relativamente concentrata, ma la relazione fra case, mobilità, rango sociale e cambiamento del giudizio di Elizabeth è molto forte. Pemberley non è un semplice sfondo: il percorso di visita e l’incontro con Darcy cambiano la lettura del proprietario. Le distanze fra Longbourn, Meryton e Netherfield chiariscono visite e passeggiate; il viaggio in Kent mette in contrasto Charlotte e Lady Catherine; Londra sostiene parte della vicenda attraverso lettere e racconti.

Il risultato sarebbe convincente con una mappa geografica prudente e vedute realistiche; avrebbe meno valore ridotto a una raccolta di punti attribuiti arbitrariamente alle case immaginarie.

## Cosa contiene il dossier

- `analysis.json`: 407 associazioni con categoria, livello narrativo, motivazione italiana, passo originale letterale, intero paragrafo di riscontro, posizione, fonte e termini da evidenziare. Le collocazioni geografiche sono ancora marcate come da verificare, senza coordinate inventate.
- `full-review.json`: registro dei 61 capitoli, numero di paragrafi, impronta del testo, introduzione e osservazioni specifiche.
- [Registro leggibile dei capitoli](chapter-review.md): introduzioni e tabelle dei luoghi, con distinzione delle scene epistolari e raccontate.
- `introductions.json`: tutte le 61 introduzioni narrative in **EN/IT/FR/ES**, scritte dopo la lettura della sezione. Sono testi editoriali, non citazioni del romanzo.
- [Testimoni, traduzioni e lacune](TRADUZIONI.md): originale, fonte Chapman 1923, testimoni francese e spagnolo completi, ricerca italiana e limiti dei diritti.
- `aligned-translations.json`: quattro associazioni confrontate in francese e spagnolo, **otto passi** autentici individualmente allineati. Non è dichiarata la copertura tradotta delle altre 403 associazioni.
- `edition-collation.json`: proposte di corrispondenza con la fonte inglese identificata del 1923; i passi approssimati non sono promossi a verificati.
- `concordance-review.json`: decisioni sulle segnalazioni lessicali e casi esclusi o mantenuti senza localizzazione puntuale.
- `verification.json`: controlli d’integrità superati e limiti ancora aperti.

Corpus completi e copie HTML sono locali in `corpus/`, esclusi da Git. `sections.json` conserva l’originale diviso in paragrafi. Gli script rendono riproducibile l’estrazione e la verifica; `decisions.py` contiene decisioni editoriali scritte dopo la lettura, non categorie prodotte dalla ricerca di parole.

## Scene ricorrenti e livelli narrativi

| Ambientazione | Capitoli con associazione `action` | Osservazione |
| --- | ---: | --- |
| Longbourn | 40 | Comprende scene domestiche senza toponimo, il giardino e il boschetto, arrivi e congedi. Nel 46 la scena appartiene alla lettera di Jane. |
| Hunsford | 10 | Canonica e giardino: non confondere la proposta del capitolo 34 con una scena a Rosings. |
| Netherfield | 9 | Il soggiorno di Jane e i balli sono distinti dai ricordi e dalle visite soltanto riferite. Nei capitoli 35 e 45 sono presenti scene riportate. |
| Meryton | 7 | Assemblea, strada e casa Phillips; due associazioni derivano da scene raccontate. |
| Rosings | 6 | Cene, musica, passeggiate e consegna della lettera presso il cancello. Il vialetto esterno è distinto dal parco. |
| Pemberley | 2 | Visite sviluppate nei capitoli 43 e 45; altri soggiorni, inviti e ricordi non diventano automaticamente azione. |

Ogni ricorrenza è verificata nella propria sezione. Non si applica una categoria unica alla località in tutto il romanzo. Il capitolo 61 contiene una conclusione retrospettiva: residenze e visite riassunte restano `mentioned`, senza assegnare azione a tutti i futuri domicili dei personaggi.

Tra i casi di controllo: il percorso attraverso Oxford, Blenheim, Warwick, Kenilworth e Birmingham è elencato ma non messo in scena nel capitolo 42; il viaggio ai Laghi viene abbandonato; Gretna Green è una meta dichiarata e non raggiunta; il Brighton immaginato da Lydia nel capitolo 41 non costituisce una scena già avvenuta. La semplice attestazione delle nozze a St Clement’s nel 51 non dimostra una scena del rito, mentre i preparativi nella casa dei Gardiner sono raccontati con eventi e interazioni.

## Identificazioni da trattare con prudenza

**Pemberley e Chatsworth.** La lettura distingue il luogo reale nominato nel viaggio dalla tenuta immaginaria. [John Wiltshire](https://www.jasna.org/publications-2/persuasions-online/vol-42-no-1/wiltshire/) discute e contesta la tradizionale identificazione, ricordando anche la posizione di Pat Rogers. [Donald Greene](https://test.jasna.org/publications-2/persuasions/number1/pemberley-revisited/) propone invece una relazione stretta. Conservare le ipotesi e le divergenze; nessun punto per Pemberley su Chatsworth è stato creato.

**Longbourn e Meryton.** [Kenneth Smith](https://www.jasna.org/persuasions/printed/number27/smith.pdf) propone identificazioni nell’area di Harpenden attraverso distanze e nomi. È un’interpretazione critica, non la prova di un indirizzo dei Bennet. La rappresentazione geografica di base deve usare il contorno verificato dell’Hertfordshire.

**Bakewell e Lambton.** Nel capitolo 42 la scena notturna delle domande alla cameriera è collegata a Bakewell dal chiarimento del capitolo 43, paragrafo 60. Bakewell è distinta da Lambton. Il dibattito è documentato anche da [Janine Barchas](https://jasna.org/assets/Uploads/Publications/Articles/7258662b79/barchas.pdf) e dal [Bakewell & District Historical Society Journal 2009](https://oldhousemuseum.org.uk/wp-content/uploads/2020/09/2009_Journal.pdf). Non si attribuisce un nome all’albergo di Bakewell né si assume un modello certo per Lambton.

**George e Bell.** La George del capitolo 39 è in una città anonima dell’Hertfordshire: non è automaticamente a Meryton. Il Bell di Bromley, nel 37, è un cambio dei cavalli consigliato da Lady Catherine; non è una sosta narrata come compiuta. Entrambe richiedono identificazione storica separata.

**Edward Street e St Clement’s.** [Sue Forgue, Where’s Wickham?](https://www.jasna.org/publications-2/persuasions-online/vol36no1/forgue/) confronta numerose Edward Streets e le due parrocchie di St Clement Danes e St Clement Eastcheap. La preferenza critica per Danes non è una certezza del romanzo. La casa di Mrs Younge e gli alloggi dei fuggitivi sono distinti: il testo dice che lei non poté ospitarli. La via della coppia resta deliberatamente omessa. [Laurie Kaplan](https://test.jasna.org/persuasions/on-line/vol32no1/kaplan.html) discute anch’essa le alternative londinesi.

**Little Theatre.** La [storia istituzionale del Theatre Royal Haymarket](https://trh.co.uk/theatre-history/) documenta il precedente Little Theatre e lo spostamento dell’edificio nel 1821. L’eventuale identificazione del teatro desiderato da Lydia va riferita al sito storico, non trasferita senza avvertenza all’edificio attuale. Non coincide automaticamente con il teatro non nominato in cui Elizabeth parla con la zia nel capitolo 27.

**Oakham Mount, Kympton e le case del vicinato.** Non assegnare coordinate a un omonimo reale. Per Oakham Mount distinguere il panorama proposto dalla conversazione durante la passeggiata; la cima non è descritta come luogo della scena. La parrocchia Kympton, nominata nel 52, unifica le precedenti menzioni indirette del beneficio di Wickham. Haye Park, Stoke, Ashworth e Pulvis Lodge sono case proposte nel discorso della madre, non scene compiute in ciascuna di esse.

## Valutazione e progetto delle vedute immaginarie

**Valutazione positiva; nessuna veduta è già stata realizzata.** Le vedute finali devono essere paesaggi realistici ed evocativi, con luce, profondità e ambiente credibile, come richiesto dalle regole aggiornate; non schemi, diagrammi o planimetrie stilizzate. Le coordinate sul disegno saranno interpretative e separate dalla geografia. Un solo collegamento «Vedute immaginarie» dovrà aprire la selezione delle singole vedute. Non emergono ragioni per separare epoche narrative.

1. **Pemberley, priorità massima.** Capitolo 43, paragrafi 0–4, 42–49 e 54–65: ingresso basso nel parco, bosco, salita al punto panoramico, casa sul versante opposto della valle, fiume e ponte d’accesso; giro nel bosco e secondo ponte semplice nella gola; strada delle stalle dietro la casa. Il capitolo 45, paragrafo 1, aggiunge il salone a nord, le finestre a terra, il prato intermedio e le colline boscose. Non fondere i due ponti, non assumere una pianta interna completa e non usare un palazzo cinematografico come fonte testuale. Possibile una veduta del paesaggio e una seconda veduta ravvicinata della casa, se la leggibilità lo richiede.
2. **Longbourn, Meryton e Netherfield, priorità alta.** Capitoli 5 e 7: Lucas Lodge a circa un miglio da Meryton, Longbourn a un miglio dal paese e passeggiata di Elizabeth fino a Netherfield, passando da Meryton, per campi e stiles. Il capitolo 56 documenta il piccolo parco di Longbourn, il gravel walk e il boschetto su un lato del prato. Una prospettiva panoramica può rendere leggibili le relazioni, senza trasformare le distanze testuali in una posizione geografica o in orientamenti certi. Forma delle facciate, raccordo dei sentieri e disposizione complessiva restano interpretativi.
3. **Hunsford e Rosings, priorità alta dopo la verifica.** Capitoli 14, 28–30, 33 e 35: canonica con giardino in pendenza, cancello, breve vialetto ghiaioso e siepe d’alloro; strada fra la casa e il margine del parco, apertura fra gli alberi verso Rosings su un rialzo; passeggiata nel parco di circa mezzo miglio, boschetto riparato e vialetto esterno. Il retro della canonica ospita il salotto delle donne; studio e dining-parlour affacciano sulla strada. Disegnare l’esterno con queste relazioni, senza attribuire indirizzi reali o seguire l’orientamento aggiunto nella traduzione francese.

Il modello geografico resta distinto: Hertfordshire per il primo nucleo, Kent per Hunsford/Rosings, Derbyshire per Pemberley/Lambton, attraverso confini storici verificati in polyline. Nessuna coordinata di scena può essere ricavata dalla sola composizione pittorica.

## Verifiche eseguite e lavoro prima della pubblicazione

`python research/pride-and-prejudice/verify.py` verifica sequenza e conclusione del corpus, impronte di tutti i capitoli, literalità di tutte le citazioni inglesi e degli otto passi tradotti, highlight realmente presenti, identità uniche nella sezione, categorie ammesse e disponibilità delle 244 introduzioni. I controlli sono superati. Non sono test del sito o del database, che non sono stati modificati.

Prima dell’importazione restano: collazione editoriale dei passi inglesi definitivi; riduzione e valutazione cumulativa degli estratti; revisione delle identificazioni e fonti geografiche; contorni storici e precisioni; ulteriori allineamenti FR/ES; prosecuzione documentata della ricerca italiana con fallback inglese dove necessario; realizzazione e verifica delle vedute; scelta di un quadro esistente con fonte e riuso verificati; tema CSS e filigrana specifica; dataset e importazione di prova. Pubblicazione solo dal branch `docs` con verifica dei dati remoti e degli asset, secondo le regole del progetto.

Nessuna aggiunta al catalogo, modifica del database, asset illustrato o pubblicazione GitHub è stata eseguita in questa fase di analisi.
