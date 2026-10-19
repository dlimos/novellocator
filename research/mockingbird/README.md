# Il buio oltre la siepe — avvio dell'analisi

Stato al 19 ottobre 2026: **ricerca preliminare; romanzo non importato e non pubblicato nell'atlante**. Questi documenti registrano risultati verificati, limiti delle fonti e decisioni editoriali ancora da completare. Non certificano una lettura integrale o un inventario completo dei luoghi.

## Testo originale

È stata acquisita una trascrizione inglese accessibile sul sito della Renaissance Academy. Il PDF ha 285 pagine digitali; contiene dedica, epigrafe attribuita a Charles Lamb, due parti, intestazioni consecutive dei 31 capitoli e la conclusione. Il controllo strutturale riproducibile è in `audit-source.py`; risultati, hash e copertura in `source-audit.json`. PDF, testo estratto e capitoli separati rimangono in `work/mockingbird/`, escluso da Git.

**L'edizione della trascrizione non è verificata.** Il documento riporta copyright 1960, rinnovo 1988 e accordo con McIntosh and Otis, ma non identifica editore, stampa o ISBN del volume trascritto. Le note finali dichiarano scansione e correzione anonime, con revisione HTML del 30 marzo 2005. Non attribuire questa trascrizione alla prima edizione Lippincott né a una specifica ristampa HarperCollins. Le pagine del PDF non sono pagine tipografiche certificate. La presenza delle intestazioni e della fine non dimostra che ogni frase sia integra.

Il record della [Morgan Library](https://www.themorgan.org/printed-books/92875) identifica una prima edizione del 1960, ma non costituisce un facsimile integrale con cui collazionare il PDF. Il servizio ministeriale canadese consultato elenca un'edizione Grand Central, ISBN 0446310786: è un'altra edizione, non la prova della provenienza della trascrizione. Le risorse NEA Big Read sono fonti critiche e didattiche, non sostituiscono il romanzo.

Gli URL dei testi e gli esiti dei tentativi di acquisizione sono conservati in `sources.json`, esclusivamente come documentazione di ricerca: non vanno esposti in schede, popup, note pubbliche o CSV dell'atlante.

## Geografia: decisioni sostenute dalle fonti

Il [Monroe County Museum](https://www.monroecountymuseum.org/home) documenta il rapporto fra Monroeville e la Maycomb immaginaria. Il riferimento geografico appropriato è quindi il **modello reale esplicitamente dichiarato**, con una posizione puntuale da verificare: nessun contorno regionale deve concorrere a localizzare la stessa Maycomb. Monroeville e Maycomb restano due identità distinte.

Il [record dell'Old Courthouse Museum](https://www.monroecountymuseum.org/old-courthouse-museum) documenta il modello del tribunale e distingue l'edificio reale dalla ricostruzione hollywoodiana. Non usare la scenografia del film come prova delle adiacenze nel romanzo. Verificare separatamente coordinate, scene e citazioni prima dell'importazione. Le abitazioni Finch e Radley non acquisiscono automaticamente indirizzi di Monroeville.

La prima lettura esplorativa dei capitoli 1 e 31 sostiene l'utilità di una ricostruzione del quartiere. Non equivale alla revisione dei 31 capitoli. Nel primo capitolo, per esempio, l'origine di Dill a Meridian è una menzione; il percorso genealogico di Simon Finch non diventa automaticamente una serie di scene; la visita progettata all'istituto di Tuscaloosa rimane menzione. I racconti su Boo hanno livelli narrativi e attendibilità propri. Categoria narrativa, realtà del luogo e precisione delle coordinate richiedono tre valutazioni separate.

## Vedute immaginarie: valutazione positiva, realizzazione pendente

Si propone una veduta realistica del **quartiere dei Finch e dei Radley**, motivata dai rapporti spaziali descritti nel capitolo 1 e dal punto di vista sulla strada assunto da Scout nel capitolo 31. Il primo documenta cortili, limite delle case, curva della strada e prossimità della scuola; l'ultimo rende il cambiamento di prospettiva parte del significato del romanzo. Una veduta aiuterebbe a comprendere percorsi, distanza sociale e conoscenza del vicino.

La ricostruzione dovrà verificare anche i capitoli intermedi, distinguere elementi attestati e scelte pittoriche, e mantenere posizioni sul disegno separate da coordinate terrestri. Una seconda veduta dell'aula del tribunale è una possibilità da valutare dopo la lettura dei capitoli processuali; non è già approvata né realizzata. Non ricostruire l'intera città con una precisione che il testo non consente. Nessuna veduta è stata generata in questa fase.

## Presentazione: proposte ancora da verificare

Filigrana proposta: un mockingbird posato su un ramo, con ingombro reale del disegno di circa 38 px su tessera desktop di 96 × 128 px e righe sfalsate di 48 px; tessera mobile 72 × 96 px. La filigrana non è ancora realizzata.

Palette proposta: azzurro ardesia chiaro, pannelli luminosi e dettagli ruggine ispirati al caldo, alla polvere e alle strade del romanzo. Confronto cromatico completo con il catalogo e verifica del contrasto ancora pendenti; nessun CSS o record `book_presentations` è stato pubblicato.

Quadro candidato: Henry Ossawa Tanner, *The Thankful Poor*, 1894, Art Bridges, AB.2020.16. Il [record della collezione](https://artbridgesfoundation.org/artworks/tanner-the-thankful-poor) documenta autore, data e soggetto. Il rapporto proposto è tematico: dignità della vita domestica afroamericana e relazione fra generazioni; non raffigura Maycomb né i personaggi di Lee. Scelta definitiva, riproduzione e condizioni di riuso vanno verificate prima di scaricarlo o inserirlo nel catalogo.

## Condizioni per completare l'aggiunta

Occorre un testo inglese integrale con frontespizio e pagina dei diritti identificabili, oppure un'edizione verificabile con cui collazionare la trascrizione. Poi servono lettura di tutti i capitoli, inventario delle associazioni con motivazioni e riscontri individuali, introduzioni nelle quattro lingue, verifica geografica, valutazione documentata delle citazioni singole e cumulative e allineamento delle traduzioni utilizzabili. Le ricerche già svolte sono in `TRADUZIONI.md`.

Non è sufficiente pubblicare una scheda Maycomb con poche scene campione. Il libro resta fuori dal catalogo finché l'aggiunta non soddisfa i requisiti del progetto. La protezione del testo non è di per sé un divieto di citazione: l'eventuale applicazione dell'art. 70 richiede l'analisi concreta prevista dalle istruzioni, non soltanto brevi passi e attribuzione.

La documentazione completata può essere pubblicata sul branch `docs`. La futura pubblicazione del romanzo richiede anche importazione Supabase, presentazione e verifica pubblica; un push di questi appunti non pubblica il libro.
