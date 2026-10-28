# Contesti dei luoghi — revisione del 27 ottobre 2026

Descrizioni redazionali specifiche nelle quattro lingue, distinte da citazioni,
motivazioni delle categorie e precisione geografica. I TSV di sei romanzi
alimentano 339 aggiornamenti di `place_references.metadata.narrativeDescription`;
quelli regionali e di Macondo aggiungono rispettivamente 6 e 11 contesti.

I dossier originali, gli estratti e gli snapshot pubblici sono conservati
localmente ed esclusi da Git. La revisione di queste descrizioni non è una nuova
certificazione dell'intero inventario, delle categorie o delle citazioni legacy.
In particolare alcune citazioni legacy di Melville ricorrono in sezioni diverse:
questa lacuna rimane nell'analisi e non viene qualificata come risolta dalla sola
riscrittura della descrizione. Le descrizioni seguono il contesto dei capitoli
nel corpus completo locale e i dossier delle associazioni.

`prepare.cjs` conserva ogni citazione e categoria, lega il contesto al riferimento
esistente, espande i gruppi di luoghi e risolve i nomi nelle quattro lingue.
La patch atomica controlla l'identità e l'hash del testo precedente prima di
aggiornare soltanto il metadato editoriale. `validate.cjs` esegue davvero le patch
con PostgreSQL/PGlite, controlla l'idempotenza, la conservazione dei dati estranei
e il rifiuto di una sorgente cambiata. `prepare-extra.cjs` e `validate-extra.cjs`
gestiscono aggiornamenti puntuali ai JSON dei modelli regionali e di Macondo.

I contesti redazionali vengono letti da schede, popup, raggruppamenti e CSV.
Se manca una descrizione, il passo autentico già disponibile viene mostrato
aperto, con lo stesso selettore di lingua e attribuzione; non si aggiunge una
formula generica. I riferimenti realmente pendenti rimangono segnalati e non
acquisiscono automaticamente lo stato di verificati.

I capitoli I.6 e II.6 di Dostoevskij sono stati confrontati con le sezioni complete:
i due estratti generici sono sostituiti da riscontri specifici della Sennaja;
II.6 passa all'azione perché narra l'arrivo, la sosta e il colloquio nella piazza.
In Holden, capitolo 2, Yellowstone passa alla menzione: è riferito l'acquisto
della coperta, mentre la scena ricordata è la visita a Spencer. Motivi, livello
narrativo e impronte delle sezioni restano registrati separatamente.

Per Lolita `prepare-lolita.cjs` ricontrolla i 411 riscontri del PDF nativo. La
patch risolve 177 vecchi stati di verifica, conserva 15 contesti già specifici,
aggiunge nove descrizioni redazionali e offre direttamente il passo autentico
negli altri casi. I 17 riferimenti della postfazione mantengono la lacuna reale:
il testo non è contenuto nella copia verificata. Non vengono aggiunti nuovi
estratti protetti. Sono uniformati 26 toponimi in italiano, francese e spagnolo.

`sync-local.cjs` sincronizza i backup di importazione esclusi da Git e conserva
una copia precedente prima della prima scrittura. Le traduzioni comuni mancanti
nel backup Holden sono recuperate dalle righe già pubblicate in Supabase.

In Lolita le etichette legacy «under review» vengono svuotate quando è disponibile
il passo autentico oppure sostituite dal contesto specifico. Anche una copia
precedente del motore evita così di riattivare avvisi ormai superati. La patch
accetta soltanto l'impronta della sorgente attesa o del risultato già applicato.
