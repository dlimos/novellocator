# Il buio oltre la siepe — dossier di lavorazione

Stato al 23 ottobre 2026: **originale inglese acquisito e accettato; romanzo non ancora importato nell’atlante**. Su istruzione esplicita dell’utente, l’identificazione dell’edizione e dell’ISBN non è più un requisito per il testo originale. Si usa il testo già estratto, senza OCR e senza ulteriori ricerche bibliografiche. Restano necessari i riscontri individuali e le categorie delle associazioni capitolo–luogo. La decisione è registrata in `source-policy.json`.

## Lettura e confronto dei testi

Sono stati letti tutti i 31 capitoli della trascrizione inglese Renaissance Academy, comprese le ambientazioni ricorrenti. `narrative-review.json` conserva note specifiche per capitolo e candidati luoghi dell’azione e menzioni. Non sono associazioni già certificate e non sostituiscono i riscontri originali individuali. `source-audit.json` conserva il controllo strutturale del 19 ottobre: il suo stato di lettura pendente è storico, aggiornato dal dossier narrativo del 20 ottobre.

Il PDF di 285 pagine contiene dedica, epigrafe, due parti e 31 capitoli, ma non identifica l’edizione cartacea trascritta. Riporta copyright 1960 e rinnovo 1988; le note dichiarano scansione anonima e revisione HTML del 2005. Non attribuirlo alla prima Lippincott né a una ristampa specifica.

È stato acquisito un secondo testimone dal repository dell’Universitas Peradaban: un’appendice di tesi di 157 pagine, con testo reimpaginato, prefazione del 1993 e ISBN dichiarato 9780061980268. Non è un facsimile editoriale e contiene errori nei preliminari. Il confronto dei 31 capitoli (`compare-transcriptions.py`, risultati in `transcription-comparison.json`) trova una somiglianza lessicale minima del 98,9%, ignorando maiuscole e punteggiatura. Non dimostra l’integrità di ogni frase, la provenienza editoriale o l’indipendenza dei testimoni: potrebbero derivare dalla stessa trascrizione elettronica.

PDF, testi integrali e differenze estese rimangono in `work/mockingbird/`, escluso da Git. Gli URL sono documentati in `sources.json` per ricerca; non devono comparire nell’atlante o nei CSV pubblici.

## Geografia e categorie narrative

Il Monroe County Museum documenta Monroeville come modello della Maycomb immaginaria. Il modello deve essere dichiarato esplicitamente, mantenendo distinte le due identità e senza trasferire indirizzi reali agli edifici inventati. Le coordinate devono ancora essere verificate.

Museo e National Park Service documentano il tribunale reale e la successiva ricostruzione cinematografica. Il film non prova la topografia del romanzo. Le coordinate sul disegno restano interpretative e separate da quelle terrestri.

Le note distinguono scene, provenienze, destinazioni progettate, racconti e testimonianze contestate. La residenza di Dill a Meridian non diventa una scena; i racconti su Boo e le deposizioni del processo richiedono livello narrativo e attendibilità espliciti. Le categorie dei candidati non sono pronte per l’importazione: nel dubbio la categoria finale sarà `mentioned`. Nessun totale dei luoghi è certificato.

## Introduzioni, quadro e tema

`editorial.json` contiene 124 introduzioni narrative in bozza: una per ciascuno dei 31 capitoli nelle quattro lingue, oltre alle descrizioni del catalogo e alle didascalie. Sono parafrasi editoriali, non traduzioni attribuite a traduttori del romanzo.

È stata acquisita una riproduzione di Henry Ossawa Tanner, *The Thankful Poor* (1894), verificando il record Art Bridges e la specifica riproduzione Commons. Il rapporto con Lee è tematico: dignità domestica afroamericana e generazioni; il quadro non raffigura Maycomb. Fonti e condizioni sono in `QUADRO.md`. Il credito visibile dell’anteprima contiene soltanto autore, titolo collegato e anno.

Il CSS locale `docs/themes/to-kill-a-mockingbird.css`, escluso da Git, usa un fondo terracotta polveroso confrontato con le palette esistenti e una filigrana a forma di mockingbird sul ramo. Il simbolo ha un ingombro di circa 39 px, tessera desktop 96 × 128 e righe sfalsate di 48 px; la tessera mobile è 72 × 96. Contrasti calcolati: testo/fondo 6,35:1, testo secondario/fondo 4,84:1. Il tema non è stato inviato al database.

## Vedute immaginarie: valutazione positiva e primo studio

La lettura conferma l’utilità del quartiere Finch–Radley, soprattutto per i capitoli 1, 4–8, 28–31. È stato realizzato un **primo studio pittorico realistico**, `neighbourhood-study.png`. `VEDUTA.md` separa gli elementi documentati dalle scelte interpretative e segnala le correzioni necessarie prima di farne una veduta interattiva definitiva. Non contiene marker o coordinate geografiche. Una veduta dell’aula del tribunale sarebbe utile per i capitoli 16–21, ma non è stata realizzata.

`preview-desktop.png` documenta l’anteprima locale: selezione di capitolo, cambio di lingua mantenendo il capitolo, introduzioni, quadro e studio. Non è una schermata del sito pubblico. La verifica visiva riguarda il desktop; il comportamento mobile resta da verificare.

## Lavoro ancora necessario

Documentare per ogni associazione il riscontro originale, la funzione narrativa e la precisione geografica; completare il controllo delle traduzioni e la valutazione individuale e cumulativa delle citazioni; rifinire la veduta e verificare l’interfaccia mobile. Le ricerche sulle traduzioni e le lacune sono in `TRADUZIONI.md`. Nessuna citazione è ancora abilitata alla pubblicazione: il motivo attuale è la verifica individuale e cumulativa dei passi, non l’assenza di edizione o ISBN. I limiti bibliografici descritti sopra restano dati storici sulle fonti, senza costituire un impedimento aggiuntivo.

Solo dopo queste verifiche si potrà completare il pacchetto, importarlo in Supabase, pubblicare `book_presentations` e controllare il risultato pubblico. Il push di questo dossier sul branch `docs` pubblica la documentazione di lavoro, **non aggiunge il romanzo al catalogo**.
