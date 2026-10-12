# Anna Karenina

Testo russo completo nell’edizione critica PSS: tomo 18, Mosca–Leningrado, *Chudožestvennaja literatura*, 1934 (parti I–IV); tomo 19, Mosca, 1935 (parti V–VIII). Fonti: [tomo 18](https://tolstoy.ru/online/90/18/) e [tomo 19](https://tolstoy.ru/online/90/19/), edizione elettronica istituzionale «Весь Толстой в один клик», basata sulle scansioni della Biblioteca statale russa. La prefazione spiega la scelta del testo corretto da Tolstoj e Strachov e le divergenze dall’edizione del 1878. Nessuna collazione diplomatica parola per parola è dichiarata.

Sono acquisiti tutti i 239 capitoli, nelle otto parti di 34, 35, 32, 23, 33, 32, 31 e 19 capitoli. Il romanzo ha un’epigrafe, conservata nella fonte; non ha prologo o epilogo separati. Prefazioni, varianti, commenti e indice dei nomi sono distinti dal testo narrativo. Il titolo I.XXV usa due X cirilliche nella trascrizione: si normalizza soltanto l’identificativo del capitolo. I numeri delle pagine e i rimandi redazionali sono esclusi dal testo estratto; le parole, la grafia e la punteggiatura delle citazioni non sono riscritte.

Il corpus completo locale, `sections.json`, contiene oltre 1,69 milioni di caratteri e l’impronta SHA-256 di ogni capitolo. Gli HTML integrali e il corpus sono ignorati da Git. `extract.py` verifica la sequenza completa delle parti; `analysis.json` conserva fonti, capitoli, citazioni, categorie e motivazioni per ciascuna associazione, compresi risultati senza luoghi espliciti.

## Metodo e categorie

Ricerca sull’intero corpus, paragrafo per paragrafo, di nomi propri, forme flesse, aggettivi geografici e forme locative; revisione contestuale per capitolo dei candidati e delle ambientazioni. Il censimento non dichiara l’esaurimento definitivo di ogni allusione implicita. Gli script generano candidati e selezionano riscontri letterali; le decisioni editoriali e le correzioni dopo la revisione sono conservate in `build.py` e nell’analisi. Un controllo informatico di corrispondenza non sostituisce la valutazione narrativa.

69 luoghi con punti rappresentativi, 308 associazioni cartografate e 318 associazioni senza coordinate: **626 riscontri capitolo–luogo**, ciascuno con citazione russa, edizione, fonte e forme testuali da evidenziare. Un estratto generale per capitolo è archiviato separatamente. Il russo rimane originale nelle quattro lingue del sito; nomi e descrizioni editoriali principali hanno dizionari EN/IT/FR/ES.

- Residenze, confronti, notizie, progetti e viaggi riepilogati rimangono `mentioned`. Le tappe europee del capitolo V.VII non identificano la città italiana non nominata dei capitoli successivi.
- Il ristorante «Англия» di I.IX non è l’Inghilterra; le menzioni dell’ordine di Aleksandr Nevskij in V.XXIV, XXVI e XXVII non sono la prospettiva Nevskij. Rossi, in V.XI, è una persona e non la Russia.
- L’arrivo iniziale di Anna avviene nella stazione moscovita della ferrovia per Pietroburgo. La stazione innevata viene nominata Bologoe nella rievocazione di Vronskij in I.XXXI: il livello del ricordo è esplicito.
- Nel capitolo VII.XXXI il nome Obiralovka non è ripetuto: la destinazione è nominata in VII.XXX. L’arrivo e la scena finale conservano un riscontro proprio del capitolo XXXI, evidenziando le forme autentiche relative alla stazione, senza inserire il toponimo nella citazione.
- Le tenute Pokrovskoe, Ergušovo, Vozdviženskoe, i prati, le paludi, i distretti narrativi, la provincia di Kašin e gli interni non hanno coordinate arbitrarie. La presenza di un luogo reale omonimo non ne prova l’identità narrativa. I dubbi di categoria sono risolti come `mentioned`, con nota nell’analisi.

## Fonti di confronto e coordinate

- [Middlebury, *The Significance of Setting in Anna Karenina*](https://community.middlebury.edu/~beyer/courses/RUSS0101a-f05/Tolstoy/setting_significance.htm): risorsa didattica per confrontare città, tenute e spazio europeo; interpretazioni distinte dalle prove del testo.
- [Museo Tolstoj, atti scientifici 2016](https://tolstoymuseum.ru/wp-content/uploads/2023/04/sbornik-2016_compressed.pdf): geografia ferroviaria, Obiralovka e direzione Kursk nella parte VIII.
- [Museo Jasnaja Poljana, Pokrovskoe](https://ypmuseum.ru/filials/pokrovskoe?lang=ru): documenta una tenuta reale della famiglia Tolstoj, senza provare che il suo punto sia la casa di Levin. Non è trasferita sulla mappa del romanzo.
- Il censimento dei nomi e il commento testuale del tomo 19 sono consultabili insieme al testo istituzionale. Identificazioni non dimostrate come Mariinskij, Palazzo d’inverno e indirizzi esatti delle case sono escluse.
- `coordinates.json` conserva le query e i candidati di ArcGIS World Geocoding. I punti di città, strade, paesi, fiumi e località storiche sono rappresentativi; non descrivono il confine storico o la posizione del personaggio. Scartati l’omonimo americano del Reno e un risultato errato della Nikitskaja. Il punto di Obiralovka è l’area urbana dell’odierna Železnodorožnyj, non un binario o la posizione della morte di Anna.

## Presentazione e verifica

Anteprima: Ivan Kramskoj, *Ritratto di una sconosciuta*, 1883, Galleria Tret’jakov. Riproduzione bidimensionale in pubblico dominio da Wikimedia Commons. Collegamento tematico: società pietroburghese tardo-ottocentesca, eleganza femminile e sguardo sociale; la figura non è presentata come un ritratto di Anna. Fonte museale e condizioni di riutilizzo sono conservate nei crediti locali e nel record `book_presentations`.

Tema locale `docs/themes/anna-karenina.css`: verde bosco, avorio e ottone, con locomotiva e binari in filigrana discreta. Palette della mappa e contrasto del testo rimangono riconoscibili. `theme.cjs` e `presentation.cjs` rigenerano il tema e il record del catalogo.

`verify.cjs` controlla sequenza, impronte del corpus, autenticità e capitolo di ogni citazione, termini da evidenziare, concordanza delle categorie, traduzioni dei nomi e casi di omonimia. `check-sql.cjs` esegue gli stessi blocchi del SQL Editor in PostgreSQL/PGlite, verifica conteggi, tema, presentazione e idempotenza.

Preparazione: `python -X utf8 extract.py`, `python -X utf8 build.py`, `node theme.cjs`, `node presentation.cjs`, `npm run db:prepare -- --book=anna-karenina`, `node package.cjs`. Eseguire dalla radice del repository, indicando per gli script il prefisso `research/anna-karenina/`. `geocode.py` conserva il riscontro delle coordinate e richiede accesso alla rete.

I dodici blocchi SQL dei contenuti creano una bozza. `13-presentation-and-publish.sql` applica CSS, catalogo, crediti e pubblicazione solo dopo tutti i contenuti. Il sito usa esclusivamente Supabase; le sorgenti locali sono backup e input di importazione.

Pubblicato il **12 ottobre 2026**, con importazione autenticata nel SQL Editor di Supabase e asset sul solo branch `docs`. Verificati i conteggi remoti (239 sezioni, 69 luoghi, 308 riferimenti cartografati, 318 ambientazioni senza coordinate, 547 estratti archiviati e 1.924 voci dei dizionari). Il confronto completo tramite API pubblica conferma testo, categorie, metadati, dizionari, crediti e CSS identici alle sorgenti locali, con tolleranza 1e-12 per la serializzazione delle coordinate. Sul sito sono controllati la mappa globale, le sezioni, il tema e il toponimo russo in grassetto del capitolo I.IX. Il controllo specifico usa anche la funzione reale del browser per assicurare che ciascuna forma testuale rispetti i confini delle parole e produca il grassetto. `npm test`, il controllo delle citazioni e l’esecuzione dei blocchi in PostgreSQL/PGlite sono superati.
