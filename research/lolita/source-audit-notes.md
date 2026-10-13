# Audit precedente: stato storico, superato per la copertura della lettura

# Lolita: acquisizione e verifica delle fonti

Stato al 13 ottobre 2026: **aggiunta pendente; non pubblicata**. L'analisi
narrativa integrale non è ancora completata. `analysis.json` contiene l'audit
dei due PDF forniti dall'utente, le impronte SHA-256 e l'inventario dei confini
effettivamente rilevati. Non è un attestato di completamento del libro.

### Aggiornamento: terza fonte fornita dall'utente

Il [lettore FlipHTML5](https://online.fliphtml5.com/unwsfj/Lolita---Vladimir-Nabokov/)
ha 213 pagine. Il controllo visivo ha verificato indice (pagina 3), dedica
(pagina 2), intestazione II.3 (pagina 110 del lettore, numero 109 stampato)
e inizio della postfazione *On a book entitled Lolita* (pagina 208 del
lettore, numero 207 stampato). Le pagine controllate non mostrano un
colophon che stabilisca editore e anno della trascrizione.

**Il dubbio sul confine II.2/II.3 è ora risolto.** Il testo del capitolo III
era presente nei due PDF precedenti: mancava l'intestazione. La nuova fonte
mostra il confine effettivo; `recover-chapter-boundary.py` separa i due
intervalli senza aggiungere, correggere o eliminare parole. Le copie
ricostruite conservano esattamente il testo acquisito e hanno 70 unità
narrative (prefazione e 69 capitoli), mentre l'audit iniziale sottostante
resta conservato come riscontro storico. La postfazione del terzo testimone
si aggiunge a queste unità: non è stata acquisita integralmente né analizzata.

`fliphtml5-verification.json` registra i riscontri e le limitazioni. La nuova
fonte è più utile per l'analisi e il confronto; non viene per questo
dichiarata un'edizione cartacea verificata. L'analisi narrativa integrale,
le citazioni per ogni luogo e l'importazione restano da completare.

## Testi forniti e confronto

- [PDF Mr Beland](https://mrbeland.weebly.com/uploads/3/0/5/5/30558007/lolita.pdf):
  224 pagine; prima pagina con la dicitura «Spellchecked by M. Avrekh, 21 Dec
  1999». Il PDF è una conversione di testo, non una scansione di un'edizione
  cartacea. I metadati indicano Acrobat Web Capture e dicembre 2003.
- [PDF Reading Sanctuary](https://www.readingsanctuary.com/wp-content/uploads/2023/04/lolita.pdf):
  320 pagine; conversione calibre con filigrane pdfFactory e una riga finale
  che attribuisce bibliograficamente il testo a Olympia Press, Parigi, 1955.
  Il nome Balki nei metadati PDF non identifica l'autore letterario.

Entrambi sono in inglese, lingua originale del romanzo. Entrambi contengono
la prefazione narrativa di John Ray, la prima parte fino a I.33 e la seconda
fino a II.36. **In entrambi manca il numero del capitolo II.3**: l'intervallo
attualmente identificato come II.2 deve essere separato tramite un'edizione
verificata. Questo non dimostra che sia assente tutto il testo del capitolo;
non si inventa un confine a partire da un riassunto.

Entrambi conservano nella prefazione le forme anomale `settlemen`, `publshed`
e `despare`. La coincidenza richiede cautela nel considerarli testimonianze
indipendenti. Il diverso numero di pagine non prova maggiore completezza.
Le pagine iniziale del primo PDF e 125 del primo PDF sono state renderizzate
e controllate; l'audit estrae e confronta tutti gli intervalli identificati
nei due documenti, senza dichiararli tutti letti e analizzati narrativamente.

La postfazione d'autore *On a Book Entitled Lolita* non compare nei due PDF.
La sua assenza non dimostra da sola una lacuna dell'edizione del 1955: va
distinta dalla storia delle edizioni successive. La riga bibliografica del
secondo PDF non dimostra la fedeltà della trascrizione a una specifica copia.

Le fonti complete e i testi estratti restano in `work/lolita/`, esclusa da
Git. Lo script riproducibile `audit-sources.py` genera il manifesto pubblico
senza includere il testo del romanzo. I numeri di pagina sono quelli dei
PDF, non pagine attribuite a Olympia Press.

## Riscontri bibliografici e critici

- [WorldCat: Lolita, Olympia Press, 1955](https://search.worldcat.org/title/Lolita/oclc/487306850):
  riscontro bibliografico; non certifica i PDF forniti.
- [Penguin: The Annotated Lolita, Alfred Appel Jr.](https://www.penguin.co.uk/books/57246/the-annotated-lolita-by-vladimir-nabokov-edited-with-preface-introduction-and-notes-by-alfred-appel-jr/9780718192846):
  candidato per il confronto con una versione identificabile; gli apparati
  del curatore hanno diritti distinti dal testo di Nabokov.
- [International Vladimir Nabokov Society: annotazioni](https://www.thenabokovian.org/annotations):
  repertorio specialistico, compresi i riferimenti agli apparati francesi.
- [Per Ambrosiani, Text, paratext, and translation](https://www.benjamins.com/catalog/tis.11.1.05amb):
  studio del 2016 sulle differenze tra testo, postfazioni e apparati delle
  edizioni; non un testo integrale inglese.
- [University of Texas, Google Mapping Travel Narratives: Lolita](https://lessonplans.dwrl.utexas.edu/content/google-mapping-travel-narratives-lolita.html):
  risorsa didattica sulla geografia e sulle difficoltà di rappresentare
  luoghi immaginari e cronologia. Non è prova testuale di un'associazione.
- [Yale, ENGL 291, lezione su Lolita](https://openmedia.yale.edu/projects/iphone/departments/engl/engl291/transcript07.html):
  interpretazione accademica dei viaggi e del finale; i riscontri devono
  essere verificati nel romanzo.
- [Library of America: storia della pubblicazione americana](https://www.loa.org/news-and-views/1055-vladimir-nabokov8217s-lolita-first-published-in-the-us-52-years-ago/):
  distingue la prima pubblicazione dalla circolazione della postfazione.

## Ricerca delle traduzioni riutilizzabili

La ricerca iniziale non ha reperito traduzioni italiane, francesi o spagnole
di cui siano verificati pubblico dominio, integrità e disponibilità del
testo. Questo esito non prova l'inesistenza di una traduzione riutilizzabile.
Non sono stati ricavati passi editoriali da parafrasi né tradotte citazioni
attribuendole a traduttori pubblicati.

| Lingua | Edizione trovata | Verifica ancora necessaria |
| --- | --- | --- |
| Inglese | Originale; due PDF forniti dall'utente | Provenienza della trascrizione, confine II.2/II.3 e confronto con edizione identificabile |
| Italiano | Giulia Arborio Mella, Adelphi, Biblioteca Adelphi 278, 1993, ISBN 9788845909979 | Testo integrale, passi autentici, diritti della traduzione e condizioni di citazione |
| Francese | Maurice Couturier, Gallimard, Folio 3532, 2001, ISBN 9782070412082 | Testo integrale, passi autentici, diritti della traduzione e apparati separati |
| Spagnolo | Francesc Roca, Anagrama; scheda CM34, 2006, ISBN 9788433928047 | Testo integrale, passi autentici e diritti; non confondere con la precedente traduzione Enrique Tejedor/Enrique Pezzoni |

Fonti: [Adelphi](https://www.adelphi.it/libro/9788845909979),
[Gallimard, Cercle de l'enseignement](https://www.cercle-enseignement.com/Ouvrages/Gallimard/Folio/Lolita),
[Anagrama](https://www.anagrama-ed.es/libro/coleccion-especial/lolita/9788433930811/ESP_115).
La scheda Anagrama consultata riporta Roca e l'ISBN CM34; il percorso URL
contiene un altro ISBN: la scheda e la singola edizione vanno distinte.

Ricerche effettuate: `Lolita traduzione pubblico dominio`, `Lolita traduction
domaine public`, `Lolita traducción dominio público`, `Lolita public domain
Project Gutenberg Faded Page`, oltre alle ricerche sui siti degli editori.
Nessun risultato consultato dimostra una base di pubblico dominio valida
per il riuso sul sito in Italia. Per l'originale e le traduzioni si devono
valutare separatamente i diritti, il singolo passo e l'insieme degli estratti.

La valutazione segue [art. 70 legge 633/1941](https://www.bandistapp.it/norma/l-1941-633/art-70):
finalità critica concreta, necessità del passo, proporzione e assenza di
concorrenza all'utilizzazione economica. Ricevere un PDF per analizzarlo non
equivale a ottenere un'autorizzazione generale a pubblicarne gli estratti.

## Presentazione: proposta ancora da preparare

Descrizioni redazionali proposte, prive di conteggi e istruzioni:

- EN: Dolores and Humbert across American roads, motels and landscapes of captivity.
- IT: Dolores e Humbert tra strade americane, motel e paesaggi di prigionia.
- FR: Dolores et Humbert sur les routes américaines, entre motels et paysages de captivité.
- ES: Dolores y Humbert por las carreteras americanas, entre moteles y paisajes de cautiverio.

Un dipinto candidato è [George Inness, The Lackawanna Valley, circa 1856](https://www.nga.gov/artworks/30776-lackawanna-valley).
La National Gallery of Art dichiara pubblica e libera l'immagine. Il
collegamento proposto è tematico: paesaggio americano attraversato dalle
infrastrutture. Il quadro è ottocentesco, non raffigura il viaggio del romanzo
e non è una fonte per le sue coordinate. La scheda finale deve riportare
solo artista, titolo collegato alla fonte e anno; ulteriori note restano
nella documentazione e nel database. Tema CSS e filigrana specifica restano
da realizzare dopo la verifica del contenuto.

## Prima dell'importazione e della pubblicazione

L'inventario non sostituisce l'analisi narrativa. Restano da completare:
edizione e confini verificati, lettura e analisi di ogni sezione, introduzioni
nelle quattro lingue, associazioni motivate con citazioni autentiche,
ricerca delle fonti geografiche, base di pubblicazione degli estratti,
immagine e tema. Nel dubbio una relazione documentata va classificata
`mentioned`; un candidato automatico non è ancora una relazione pubblicabile.
Non attribuire coordinate a città immaginarie sulla base di somiglianze.

Nessun dato di Lolita è stato importato nel database né aggiunto al catalogo
pubblico. Il lavoro continua dal manifesto senza riscaricare i PDF.
La pubblicazione, quando tutti i requisiti saranno soddisfatti, avverrà
soltanto nel branch `docs` con `git push origin docs`.
