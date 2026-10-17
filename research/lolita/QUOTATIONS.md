# Lolita: citazioni dalla copia PDF scelta dall’utente

17 ottobre 2026. Fonte esclusiva degli estratti: `Lolita-Vladimir-Nabokov.pdf`,
283 pagine, SHA-256
`9950fc89e4a03b5ade99076aa29c70be416fe8e8b8348086ec80b2b84794e7ee`.
Il testo è estratto direttamente dagli oggetti testuali del PDF con pypdf:
nessun OCR, nessun recupero di citazioni dal precedente testimone a immagini.
Il PDF completo e il testo estratto restano privati in `work/`, esclusi da Git.

## Identificazione e integrità

Il frontespizio testuale dichiara autore e titolo. Mancano un colophon,
l’indicazione dell’editore e la data dell’edizione. I metadati LibreOffice
descrivono la produzione del file, non un’edizione letteraria. Le attribuzioni
pubbliche dichiarano quindi «digital copy, publisher and date not stated»;
non attribuiscono la copia a Olympia Press, Penguin, Adelphi o altri editori.
Il 1955 del catalogo è l’anno della prima pubblicazione dell’opera, non della copia.

La sequenza comprende prefazione, 33 capitoli della parte I e 36 della parte II.
L’intestazione di II.3 manca: il confine di contenuto è individuato prima della
domanda sul nome del milk bar, fra II.2 e II.4. Non viene inventata un’intestazione
dentro una citazione. La postfazione d’autore è assente: nessun suo estratto viene
aggiunto da altre fonti. La sua analisi e le relative location restano conservate.

La copia contiene refusi, fra cui `Abiliene` e `Napes`: i frammenti preservano le
forme del file, registrate come termini da evidenziare. Non si spacciano per
lezioni di un’edizione critica o correzioni d’autore. Solo spazi e interruzioni
di riga sono normalizzati. Le omissioni sono visibili come `[…]`.
Controllo visivo aggiuntivo del PDF alle pagine 1, 28, 138 e 158.

## Copertura e funzione critica

411 associazioni sezione–luogo ricevono un estratto: 192 record relazionali,
162 ambientazioni conservate senza un punto separato e 57 scene regionali
esplicite nella revisione geografica. Non sono 411 luoghi distinti.
Nelle viste aggregate di prefazione, parte I e parte II tutte le 164 schede
geografiche e le 72 ambientazioni visibili hanno il proprio originale disponibile.

Ogni record in `pdf-quotation-review.json` conserva sezione, pagine fisiche del
PDF (numerazione da 1, non pagine di un’edizione cartacea), intervalli del testo
nativo e relative impronte, categoria, motivazione, note narrative specifiche,
termini da evidenziare, finalità e necessità del frammento. Il controllo sul PDF
privato prova che le parole distribuite sono sottostringhe del testo estratto.

Le citazioni d’azione isolano gli eventi: conversazione nel giardino scolastico,
visita agli Haze, telefonata, nuotata, barbiere di Kasbeam, colazione a Soda,
dialogo al motel in Utah, gioco nella neve in Colorado, conversazione con Mona.
La localizzazione contestuale delle scene che non ripetono il nome della città
è dichiarata nell’attribuzione. Evidenziare un riferimento indiretto non introduce
il toponimo assente nel testo. Le scene intercalate restano distinte dalle tappe
dei viaggi di Humbert e Dolores.

Le menzioni restano conservative: notizie biografiche, norme riferite da Humbert,
progetti, paragoni, bibliografia, elenchi turistici e falsi recapiti non sono
promossi ad azione per la sola presenza del toponimo. In particolare le firme
del registro in II.23 non dimostrano soggiorni di Quilty nei luoghi nominati.
Resta pendente, senza citazione, il richiamo alla Riviera in I.21: il capitolo
del PDF non fornisce una prova geografica utile per quella associazione importata.

## Valutazione dei singoli estratti e dell’insieme

La base adottata è la critica e discussione della geografia narrativa prevista
dall’[art. 70 L. 633/1941](https://www.bandistapp.it/norma/l-1941-633/art-70),
consultato nuovamente il 17 ottobre 2026. Non si dichiara il pubblico dominio
dell’originale né si trasferisce ad altri il diritto di riprodurre liberamente il PDF.

I passi sono subordinati alle schede che discutono identificazione, precisione e
funzione narrativa. Consentono di confrontare il testo con la classificazione:
per esempio lo Stato di un motel non basta a localizzarne l’indirizzo; il luogo
di una firma falsa non è una tappa; un progetto non è un viaggio compiuto.
Non vengono aggiunti brani solo perché brevi, famosi o accompagnati da crediti.
Le omissioni sostituiscono le parti non necessarie e le spiegazioni restano
redazionali, senza riprodurre pagine continue o costruire un’antologia della trama.

L’insieme contiene 6.910 parole citate contando ripetizioni fra schede; gli
intervalli originali distinti coprono circa 5.724 parole su 111.290 parole native.
La proporzione è un dato di controllo, non una soglia automatica di liceità.
Molte sovrapposizioni sono necessarie per distinguere Stati, città e ambientazioni
regionali del medesimo passo. La selezione è geografica e discontinua; non offre
la lettura del romanzo né dei suoi capitoli e non sostituisce l’edizione integrale.
Per ogni estratto si conservano separatamente finalità, necessità e motivazione.
Non vengono riprodotte traduzioni, note critiche editoriali o apparati altrui.

## Traduzioni: ricerca e lacune

Rinnovate le ricerche `Lolita traduzione pubblico dominio`, `Lolita traduction
domaine public` e `Lolita traducción dominio público`, oltre alla precedente
ricerca Project Gutenberg/Faded Page. Non è stata reperita una traduzione con
testo integrale, edizione e riuso in Italia verificati; non se ne deduce l’inesistenza.
L’inglese è l’originale, non una traduzione.

- Italiano: Giulia Arborio Mella, Adelphi, Biblioteca Adelphi 278, 1993,
  ISBN 9788845909979; la [scheda editoriale](https://www.adelphi.it/libro/9788845909979)
  conferma traduttrice e dati. Nessun suo passo è riprodotto.
- Francese: Maurice Couturier, Gallimard, Folio 3532, 2001,
  ISBN 9782070412082, già censito nell’audit precedente. Il nuovo accesso al
  [catalogo Gallimard](https://www.gallimard.fr/catalogue/lolita/9782070348619)
  è stato respinto; non costituisce una nuova verifica del testo o dei diritti.
- Spagnolo: Francesc Roca, Anagrama, edizione precedentemente censita in
  `README.md`; restano da verificare i passi e i diritti, distinguendola da
  Enrique Tejedor/Enrique Pezzoni e dalle versioni espurgate. Lo
  [studio di Carlos Moreno Hernández, Hikma 18(1), 2019](https://journals.uco.es/hikma/article/view/11196)
  documenta il problema delle diverse versioni: non autorizza il loro riuso.

L’interfaccia nelle quattro lingue presenta perciò il testo inglese autentico
disponibile, dichiarandone la lingua. Il selettore autonomo della citazione
contiene solo English ed è disabilitato finché non esistono altre versioni verificate.
Non vengono inventate traduzioni né pubblicati link diretti al testo del romanzo.

## Pubblicazione e verifiche

`publish-pdf-quotations.sql` aggiorna soltanto Lolita in una transazione.
Preserva categorie, ordine, coordinate e contorni. Le citazioni relazionali
preesistenti non sono sovrascritte. Le ambientazioni hanno controlli sul precedente
contenuto e le scene regionali sono aggiornate solo ai percorsi delle citazioni.
Una verifica prima del COMMIT annulla l’operazione se cambia una riga degli altri
romanzi nelle cinque tabelle coinvolte. Il test esegue la transazione due volte
e verifica anche il rollback di una modifica estranea deliberatamente iniettata
nel solo database di prova.

La verifica locale controlla il testo nativo, le impronte di ogni frammento,
le pagine, le evidenziazioni, le 164 schede aggregate, l’assenza di estratti della
postfazione e la disponibilità dell’originale senza traduzioni inventate.
L’aggiunta non risolve la provenienza cartacea della copia né le lacune della
postfazione o della traduzione; tali limiti restano espliciti nei dati.

Pubblicazione del database eseguita il 17 ottobre 2026. L’API pubblica è stata
confrontata con tutte le citazioni attese: testo, lingua, fonte, pagine,
attribuzioni ed evidenziazioni delle schede aggregate. Tutta la suite `npm test`
è passata; il controllo specifico delle citazioni è stato ripetuto dopo le
ultime revisioni della selezione e della transazione compatta.
