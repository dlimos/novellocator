# Lolita: analisi della fonte scelta dall’utente

Stato al 13 ottobre 2026: **lettura integrale e note per sezione completate;
versione in corso pubblicata; aggiunta completa ancora pendente**. È stata usata l’ultima fonte
indicata dall’utente, il [testimone FlipHTML5](https://online.fliphtml5.com/unwsfj/Lolita---Vladimir-Nabokov/).
Sono state acquisite tutte le 213 immagini e letto tutto il testo: prefazione,
33 capitoli della prima parte, 36 della seconda e postfazione d’autore.
Dedica, indice e biografia editoriale sono stati esaminati separatamente.

## Risultati salvati

- `ANALISI.md`: introduzione e analisi dei luoghi per ciascuna delle 71 sezioni.
- `section-analysis.json`: stessa copertura, pagine, introduzioni redazionali
  in italiano, inglese, francese e spagnolo, motivazioni e dubbi.
- `page-manifest.json`: URL e SHA-256 delle 213 immagini effettive della fonte.
- `verified-association-summary.json`: 34 riscontri collazionati visivamente,
  categoria, motivazione e livello narrativo. I frammenti inglesi restano in
  `work/lolita/verified-reading-examples.json`, escluso da Git.
- `work/lolita/location-evidence-candidates.json`: indice locale di 561
  candidati lessicali e brevi contesti originali OCR. **Non sono 561 location
  approvate**: l’indice serve a ritrovare i passi e non sostituisce la verifica
  narrativa. I candidati irrisolti conservano `mentioned`; nessun candidato
  automatico è promosso ad `action`.

La lettura completa non certifica ancora ogni citazione e associazione per
la pubblicazione. La collazione individuale, le coordinate e la base di
riuso restano distinte e pendenti. Le introduzioni sono nuova prosa
redazionale: non sono citazioni editoriali né traduzioni attribuite ai
traduttori del romanzo. Il testo integrale e le immagini restano in `work/`.

`consolidate-analysis.py` ricostruisce il rapporto dalle note e dai materiali
locali, controllando tutti gli ID, quattro lingue per introduzione e SHA-256
di ogni immagine. Per riprodurlo servono i materiali locali acquisiti, che
non sono distribuiti nel repository.

## Integrità del testimone e riferimenti

L’indice, la dedica, il confine II.2/II.3 e l’inizio della postfazione sono
stati controllati visivamente. La postfazione occupa le pagine 208–212 del
lettore ed è datata 12 novembre 1956. La biografia anonima occupa la pagina
213. I riferimenti distinguono numero del lettore e numero stampato; non
vengono presentati come pagine dell’edizione Olympia Press.

**Editore e anno dell’edizione cartacea non sono verificati.** Non si
attribuisce alla copia la provenienza di un’edizione soltanto perché tale
editore è menzionato nella postfazione.

Il capitolo II.3, la cui intestazione mancava nei due PDF precedenti, è
presente con intestazione a pagina 110 del lettore, numero 109 stampato.
`recover-chapter-boundary.py` ha separato anche i due testimoni precedenti
senza aggiungere, correggere o eliminare parole. `analysis.json` e
`source-audit-notes.md` conservano l’audit iniziale; i loro campi storici non
descrivono l’avanzamento successivo in `section-analysis.json`.

La biografia finale contiene un errore cronologico verificato sull’immagine:
dopo l’esilio del 1919, colloca l’uccisione del padre «Four years later».
La [cronologia della International Vladimir Nabokov Society](https://www.thenabokovian.org/life/chronology)
registra invece il 28 marzo 1922. L’apparato non viene usato come autorità
per la biografia o per le location del romanzo; l’errore non autorizza a
emendare il romanzo né a respingere tutto il testimone.

## Confronto critico con il testo integrale

[Monica Manolescu-Oancea, Inventing and naming America, EJAS 4-1, 2009](https://journals.openedition.org/ejas/7550)
esamina geografia reale, invenzione e nomi nei registri. Il confronto con
II.2 e II.23 distingue elenchi turistici e indirizzi-pseudonimo dalle scene
ambientate. Lo studio segnala il modello McEwen/Wheaton a Clare, Michigan,
e l’impossibilità dell’incrocio Seventh/Central a Phoenix. Sono riscontri
critici: la verifica cartografica autonoma resta pendente. Non si assegna
una coordinata a un incrocio impossibile né si trasforma l’elenco dei litigi
in una scena a Clare. II.28 dichiara il camuffamento di Coalmont, impedendo
di scegliere automaticamente un’omonima reale. Gray Star/Juneau è
un’interpretazione critica, distinta dalla valle anonima di II.36.

La [lezione di Amy Hungerford a Yale](https://openmedia.yale.edu/projects/iphone/departments/engl/engl291/transcript07.html)
è stata confrontata con la seconda traversata e il finale. La sorveglianza,
la fuga di Dolores e la memoria di Humbert orientano l’analisi dei motel e
delle strade. Le formulazioni del narratore e le interpretazioni critiche
non diventano affermazioni neutrali sul desiderio o sul consenso di Dolores.

Il [laboratorio dell’Università del Texas](https://lessonplans.dwrl.utexas.edu/content/google-mapping-travel-narratives-lolita.html)
documenta il problema didattico dei luoghi inesistenti e della cronologia
incerta: non fornisce di per sé coordinate affidabili.

Il repertorio di [Dieter E. Zimmer, Lolita, USA](http://www.d-e-zimmer.de/LolitaUSA/LoUSpre.html)
è stato individuato nella bibliografia accademica; l’accesso diretto con il
lettore web ha restituito un errore. Non se ne dichiara una consultazione
integrale. Il primo risultato OpenEdition rimandava a `/7518`, non
accessibile; l’articolo effettivamente consultato è `/7550`.

Altre fonti registrate nell’audit: [International Vladimir Nabokov Society, annotazioni](https://www.thenabokovian.org/annotations),
[Per Ambrosiani, Text, paratext, and translation, 2016](https://www.benjamins.com/catalog/tis.11.1.05amb),
[Library of America, storia della pubblicazione](https://www.loa.org/news-and-views/1055-vladimir-nabokov8217s-lolita-first-published-in-the-us-52-years-ago/),
[WorldCat, Olympia Press 1955](https://search.worldcat.org/title/Lolita/oclc/487306850).
I riscontri bibliografici non certificano la provenienza della trascrizione.

## Traduzioni e pubblicazione degli estratti

La ricerca di traduzioni di pubblico dominio in italiano, francese e
spagnolo non ha reperito un’edizione con integrità, disponibilità e diritti
verificati per il riuso in Italia. Questo non prova che tali traduzioni
non esistano. Per l’inglese si usa l’originale, con provenienza editoriale
ancora da stabilire. Per le altre lingue le citazioni sono **indisponibili
finché non verificate**, senza sostituzione silenziosa con l’originale.

| Lingua | Edizione reperita | Verifica pendente |
| --- | --- | --- |
| IT | Giulia Arborio Mella, Adelphi, Biblioteca Adelphi 278, 1993, ISBN 9788845909979 | Testo, passi autentici, diritti della traduzione |
| FR | Maurice Couturier, Gallimard, Folio 3532, 2001, ISBN 9782070412082 | Testo, passi autentici, diritti e apparati distinti |
| ES | Francesc Roca, Anagrama, CM34, 2006, ISBN 9788433928047 | Testo, passi autentici e diritti; distinto da Enrique Tejedor/Enrique Pezzoni |

Fonti: [Adelphi](https://www.adelphi.it/libro/9788845909979),
[Gallimard](https://www.cercle-enseignement.com/Ouvrages/Gallimard/Folio/Lolita),
[Anagrama](https://www.anagrama-ed.es/libro/coleccion-especial/lolita/9788433930811/ESP_115).
La scheda Anagrama consultata riporta Roca e l’ISBN CM34, mentre il percorso
URL contiene un altro ISBN: scheda e singola edizione sono distinte.

Ricerche registrate: `Lolita traduzione pubblico dominio`, `Lolita traduction
domaine public`, `Lolita traducción dominio público`, `Lolita public domain
Project Gutenberg Faded Page`, oltre ai siti editoriali. Nessun risultato
consultato dimostra una base di pubblico dominio valida per il riuso in Italia.

La valutazione degli estratti segue [art. 70 legge 633/1941](https://www.bandistapp.it/norma/l-1941-633/art-70):
finalità critica concreta, necessità, proporzione e assenza di concorrenza.
I riscontri visivi riportano la finalità e la necessità del frammento,
ma non sono una decisione definitiva di pubblicazione: occorre rivalutare
ogni citazione insieme all’insieme degli estratti selezionati. Originale,
traduzioni, revisioni e apparati hanno verifiche distinte.

## Lavoro ancora necessario per aggiungere il libro al sito

Restano la collazione dei passi scelti per ogni associazione, motivazioni e
categorie individuali strutturate, fonti delle identificazioni e coordinate,
la base di riuso degli estratti, l’immagine e il tema. Non attribuire
coordinate ai luoghi immaginari mediante somiglianze o modelli critici.

La presentazione è stata preparata seguendo la correzione dell’utente:
[René-Xavier Prinet, La Sonate à Kreutzer, 1901](https://commons.wikimedia.org/wiki/File:Prinet_-_Kreutzer_Sonata.jpg)
come immagine e **occhiali da sole a forma di cuore** come filigrana.
Il dipinto è nominato in I.10 sopra il letto nella camera assegnata a Humbert
(pagina 25 del lettore, numero 24 stampato), non nel salotto. Il testimone
non specifica la versione pittorica: la riproduzione scelta è documentata
come opera del 1901 nella scheda Commons e nel
[catalogo storico del Salon del Musée d’Orsay](https://salons.musee-orsay.fr/Detail/objects/423547).
La forma a cuore degli occhiali è una scelta grafica richiesta dall’utente,
distinta dagli occhiali scuri descritti nel romanzo. La precedente proposta
di Inness e della strada sinuosa è stata ritirata dai file della presentazione.

`artwork.json` conserva fonte, condizioni di riuso, impronte dei file e
riscontri letterari. Il CSS è in `docs/themes/lolita.css`, l’immagine in
`docs/images/lolita-prinet-kreutzer.jpg`; crediti, catalogo e traduzioni
editoriali sono preparati nelle sorgenti locali previste da AGENTS.md.
`work/lolita/presentation-preview.html` e `presentation-preview.jpg`
conservano l’anteprima verificata nel browser. I crediti visibili contengono
soltanto autore del quadro, titolo collegato e anno.

## Avanzamento della bozza strutturata

`reference-census.py` ha affinato l’indice in **539 candidati**: esclusi nomi
di persone, parole comuni, il titolo Paris-Soir, Independence Day e nomi
geografici annidati. Ha recuperato nomi spezzati a fine riga senza correggere
la grafia. `reference-census-report.json` registra le esclusioni e i nuovi
riscontri; il testo originale rimane locale.

`corroborate-evidence.py` ha inoltre trovato per **446 associazioni candidate**
almeno un contesto OCR con la stessa sequenza di parole in uno dei due
testimoni inglesi precedenti. **93** richiedono ancora un controllo della
formulazione, compresi i passi della postfazione assente nei PDF precedenti.
`wording-corroboration-report.json` conserva gli esiti senza distribuire i
frammenti. La normalizzazione riguarda punteggiatura, maiuscole e a capo;
non sostituisce parole. L’accordo non prova l’indipendenza dei testimoni,
l’edizione, i diritti o la categoria narrativa: questi controlli rimangono
separati dalla corrispondenza testuale.

Le query Esri hanno prodotto 130 gruppi di candidati. Dopo il controllo,
`coordinates.json` conserva **124 posizioni rappresentative** e **6 casi
rinviati**, con motivazioni. Il primo risultato per Crater Lake era un
omonimo errato; il secondo è stato confrontato con la
[fonte USGS](https://pubs.usgs.gov/of/1990/0651/report.pdf).
Scandinavia restituiva attività commerciali estranee alla regione europea.
Sun Valley indica una valle con una cittadina anonima, non prova una scena
nel comune omonimo. Cedar City non è accompagnata da uno stato: il candidato
dello Utah non risolve da solo l’identificazione narrativa. Le coordinate
non certificano l’interpretazione del passo né la posizione dei personaggi.

La bozza locale `docs/data/lolita.js` e il dizionario `lolita-i18n.js`
contengono tutte le sezioni, i riferimenti candidati e gli stati pendenti.
**Non costituiscono un dataset narrativo approvato.** I casi non risolti
rimangono `mentioned`; una categoria `action` è usata solo per i riscontri
individuali verificati. Le citazioni pendenti non sono inserite fra gli
estratti pubblicabili, e i passi originali di analisi restano separati.
`draft-build-report.json` riporta i conteggi attuali dopo la ricostruzione.

Preparazione e controlli:

```text
python research/lolita/reference-census.py
python research/lolita/geocode.py
python research/lolita/review-coordinates.py
python research/lolita/corroborate-evidence.py
python research/lolita/prepare-artwork.py
python research/lolita/build-draft.py
node research/lolita/presentation.cjs
npx tsx research/lolita/prepare-draft.ts
node research/lolita/check-draft.cjs
npm run test:presentation
```

I controlli hanno verificato la ricostruzione esatta dei dati, 71 sezioni,
le introduzioni nelle quattro lingue, l’importazione PostgreSQL ripetibile,
l’invisibilità della bozza agli utenti anonimi e il rifiuto di sovrascrivere
un eventuale libro già pubblicato con i dati pendenti. Gli script generati
in `database/generated/lolita/` importano soltanto una **bozza** e non sono
stati eseguiti sul database remoto. Non usare `npm run db:prepare -- --book=lolita`
per questa bozza: la preparazione ordinaria marca i nuovi libri come pubblicati;
usare la preparazione dedicata finché l’analisi individuale non è completa.

Nessun dato di Lolita è stato importato nel database o pubblicato nel catalogo.
La pubblicazione finale userà soltanto il branch `docs` e `git push origin docs`.

## Pubblicazione della versione in corso

Il 13 ottobre 2026 l’utente ha richiesto esplicitamente di pubblicare dopo essere stato informato che la verifica individuale era ancora in corso. La versione preparata con prepare-publication.ts è quindi contrassegnata come analisi in corso, nelle quattro lingue. Questa richiesta supera la precedente sospensione della pubblicazione, senza certificare l’aggiunta come completata: restano 514 associazioni da verificare e nessuna citazione viene esposta. Le categorie non verificate restano mentioned. Il catalogo usa Prinet e la filigrana usa gli occhiali a cuore scelti dall’utente. check-publication.cjs verifica la visibilità pubblica soltanto dopo l’ultimo passaggio SQL e l’assenza di estratti non verificati.


La versione in corso è stata importata in Supabase e pubblicata con `git push origin docs` (commit `c7bbbc3`). La pagina pubblica, il catalogo, l’immagine e la filigrana sono stati verificati nel browser. `publication-verification.json` registra il confronto tramite API anonima: tutti i dati e i quattro dizionari coincidono con le copie locali; CSS e documentazione coincidono normalizzando i ritorni a capo del copia-incolla Windows. Tutti i controlli del sito, TypeScript, presentazione e importazione della versione in corso sono passati. L’analisi narrativa individuale resta da completare.
