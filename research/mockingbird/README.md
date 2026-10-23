# Il buio oltre la siepe — prima pubblicazione verificata

Pubblicato il 23 ottobre 2026 nel catalogo, nel database Supabase e sul sito pubblico: [apri l’atlante](https://dlimos.github.io/novellocator/atlas.html?book=to-kill-a-mockingbird&lang=it).

Sono disponibili tutti i 31 capitoli con 124 introduzioni nelle quattro lingue, 36 luoghi geografici e 90 associazioni capitolo–luogo documentate: 31 associazioni dell’azione a Maycomb e 59 menzioni. Maycomb ha un riferimento puntuale a Monroeville, indicata esplicitamente come modello reale, senza indirizzi attribuiti agli edifici inventati. Le risposte geografiche sono conservate localmente; i risultati non pertinenti sono stati respinti.

**La revisione dell’inventario più ampio non è conclusa.** Il sito lo dichiara nella nota laterale. `narrative-review.json` conserva i candidati dei 31 capitoli; `release-evidence-review.json` distingue il sottoinsieme verificato dai casi ancora da controllare. Pubblicazione dei dati verificati e completamento dell’aggiunta restano due stati distinti.

## Originale, riscontri e citazioni

Si usa il PDF inglese Renaissance Academy già letto integralmente, accettato dall’utente il 23 ottobre. Non sono richiesti un’edizione cartacea o un ISBN, non vengono inventati dati bibliografici e non si svolgono ulteriori ricerche di edizione o OCR. Fonte, capitoli, hash e singoli passi letterali rimangono nei dati locali e in Supabase. Il confronto con il secondo testimone Peradaban è documentazione di supporto, non un certificato bibliografico.

I 97 estratti pubblicati, comprese le sette posizioni illustrate, contano complessivamente 931 parole nelle istanze e 896 nelle stringhe distinte; il più lungo contiene 17 parole. La valutazione critica individuale distingue scene, residenze, itinerari riferiti, destinazioni proposte, metafore, immagini e affermazioni incerte. Finalità, necessità e proporzione complessiva sono in `quotation-assessment.json`: brevità e attribuzione non vengono equiparate a una licenza. Non si dichiara il pubblico dominio dell’originale.

Le citazioni sono in inglese, con selettore autonomo disabilitato quando è l’unica versione autentica disponibile. Non sono state pubblicate traduzioni editoriali inventate. Le ricerche sulle traduzioni e le lacune rimangono in `TRADUZIONI.md`. Gli URL del romanzo restano nei dati di ricerca e non sono mostrati come collegamenti nelle schede o nei CSV.

## Presentazione e scenari

Quadro: Henry Ossawa Tanner, *The Thankful Poor*, 1894. Rapporto tematico e riproduzione sono documentati in `QUADRO.md`. Il credito visibile contiene soltanto autore, titolo collegato e anno.

Tema terracotta e filigrana del mockingbird sul ramo sono conservati nel CSS locale escluso da Git e pubblicati in `book_presentations`. Ingombro del simbolo circa 39 px; tessera desktop 96 × 128 con sfalsamento di 48 px, mobile 72 × 96. Contrasti controllati: testo/fondo 6,35:1 e secondario/fondo 4,84:1.

La valutazione delle vedute è positiva: il quartiere aiuta a seguire percorsi e cambiamenti di prospettiva. Il collegamento unico «Scenari del romanzo» apre una veduta con sette posizioni documentate: casa Finch, casa Radley, casa e giardino di Rachel, casa e giardino di Maudie, scuola, quercia della scuola e quercia dei Radley. Si tratta di un’interpretazione pittorica con distanze e architetture non certificate, separata dalla geografia. La casa di Maudie rappresenta la fase successiva all’incendio. La casa Dubose non ha un marker inventato nel disegno. La possibile veduta dell’aula del tribunale non è stata realizzata.

## Verifiche e lavoro residuo

`import-verification.json` documenta importazione locale PostgreSQL e ricostruzione esatta, riscontri letterali, introduzioni e posizioni illustrate senza coordinate terrestri. `public-api-verification.json` conferma la lettura anonima effettiva da Supabase e il confronto con dataset e dizionari locali. Verificati nel browser interno: presenza nel catalogo, credito minimo, apertura su «Tutti i luoghi», layer 1 / C1–C35, capitolo 31, citazione inglese e selettore, veduta con sette marker e assenza di overflow orizzontale a 390 px. Le immagini `published-scenarios.png` e `published-mobile.png` mostrano il risultato pubblico; `preview-desktop.png` rimane la precedente bozza locale.

Restano l’audit individuale dei candidati non inclusi nella prima pubblicazione e l’allineamento di eventuali traduzioni autentiche. Non attribuire a questi controlli la conclusione della revisione completa di tutti i luoghi.
