# Correzioni della verifica di coerenza

Interventi relativi alla verifica del 27 ottobre, completati il 28 ottobre 2026.

| Incoerenza | Intervento |
|---|---|
| Vista globale con categoria dell'azione e testo della prima menzione | Scelta di un'occorrenza dell'azione, con contesto, citazione e fonte della stessa sezione; identità e collegamenti espliciti conservati. |
| Prima scheda globale poco pertinente | Selezione iniziale di un luogo dell'azione visibile, quando disponibile. |
| Luoghi duplicati tra azione e menzioni globali | Nascoste le copie di menzione già rappresentate da un marker; conteggi allineati. Disattivando il layer azione, le menzioni pertinenti tornano visibili con la propria numerazione. Indici e selezione conservati. |
| Descrizioni metodologiche al posto del contesto | 339 contesti specifici in quattro lingue per Delitto e castigo, Don Chisciotte, Moby-Dick, 1984, Anna Karenina e Il buio oltre la siepe; altri 6 contesti regionali di Anna e 11 geografici di Macondo. |
| Contesti assenti nelle menzioni | Quando manca una descrizione specifica, il passo autentico disponibile viene aperto direttamente, con lingua e attribuzione; nessuna frase di riempimento. |
| Righe d'area generiche o improprie | Svuotate 456 etichette generiche. Le aree geografiche di Macondo non ereditano il nome della città immaginaria. Le righe vuote non compaiono. |
| Vecchi stati pendenti di Lolita | Ricontrollate le impronte dei 411 riscontri del PDF; risolte 177 etichette obsolete, conservati 15 contesti specifici. Nove nuovi contesti redazionali; negli altri casi è mostrato il passo autentico. |
| Esonimi di Lolita | Uniformati 26 nomi in italiano, francese e spagnolo; testo delle citazioni conservato. |

Tre correzioni puntuali del riscontro narrativo: due passi della Sennaja in
Delitto e castigo (I.6 e II.6), verificati nelle rispettive sezioni originali;
II.6 passa all'azione. Yellowstone nel capitolo 2 di Holden passa alla menzione:
il luogo è riferito nell'acquisto di una coperta, senza una scena ambientata lì.

I contesti sono salvati nel database per singolo riferimento e conservati nel
percorso di importazione/esportazione. Schede, popup, raggruppamenti e CSV usano
lo stesso dato; le viste geografiche non modificano il contenuto sorgente.
I backup locali esclusi da Git sono sincronizzati.

## Verifiche

`npm test` completo superato: interfaccia, romanzi, quattro lingue, numerazione,
scenari, citazioni, esportazioni, TypeScript, round trip PostgreSQL/PGlite,
vincoli, RLS e presentazioni. Superati anche i controlli dedicati ai 339 contesti,
alle patch regionali/Macondo, a Lolita, alle tre correzioni narrative e alla
conservazione dei contesti nel modello relazionale. Le patch SQL sono
idempotenti e controllano la sorgente prima di scrivere.

Le scritture Supabase sono state eseguite e i conteggi riletti nell'editor SQL.
Il codice è stato pubblicato su `docs` e verificato su GitHub Pages con versione
`20261028-location-contexts-2`. Il controllo pubblico ha confermato i nuovi
contesti dei sei romanzi, Riohacha e il passo autentico aperto di Parigi in Ulisse.
In Don Chisciotte sono presenti 128 menzioni con entrambi i layer attivi e 153
disattivando l'azione: elenco, numeri e conteggio coincidono in entrambi i casi,
senza pulsanti visibili privi di numero. La suite completa è stata ripetuta con
esito positivo dopo quest'ultima correzione.

Riscontri pubblici riletti: la scheda globale del laghetto di Holden usa la
scena del capitolo 20, Yellowstone è una menzione; Dorset in Lolita mostra il
contesto genealogico specifico, senza l'avviso superato. La prova visiva è in
`lolita-context-detail-published.png`.

## Lacune ancora aperte

I 17 riferimenti alla postfazione di Lolita restano pendenti: la copia verificata
non contiene il testo originale della sezione e l'edizione non è identificata.
La pagina esplicita questa lacuna. Non sono stati inventati passi o traduzioni.

La revisione di coerenza non certifica nuovamente tutte le associazioni
sezione–luogo e tutte le citazioni dell'inventario. In particolare rimangono
riscontri legacy di Moby-Dick riutilizzati in sezioni diverse, già segnalati nel
dossier: la riscrittura del contesto non risolve quella distinta verifica.
