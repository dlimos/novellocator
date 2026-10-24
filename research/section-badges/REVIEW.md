# Revisione dei badge — 24 ottobre 2026

Controllati i valori `time` e `people` delle 862 sezioni pubblicate in Supabase e gli adattatori della vista globale, dei raggruppamenti e degli scenari (incluso Macondo, alimentato da `book_maps`). La revisione riguarda l'utilità editoriale dei badge esistenti, non una nuova verifica integrale di cronologia e presenza dei personaggi nel testo.

Rimossi dal database 701 valori in 565 sezioni:

- Moby-Dick: cronologia dichiarata non specificata e identico elenco generale dei protagonisti in tutte le 136 sezioni.
- Anna Karenina: identico elenco generale dei protagonisti in 239 capitoli. Conservato il riferimento al decennio narrativo.
- Delitto e castigo: autore impropriamente usato come personaggio in 41 capitoli.
- Don Chisciotte: date editoriali usate come tempo narrativo in 142 sezioni.
- Ricerca: anni di pubblicazione usati come tempo narrativo nei sette volumi. Conservati i personaggi specifici dei volumi.

Conservati gli altri valori temporali e i personaggi pertinenti già presenti. I campi vuoti o assenti degli altri romanzi restano facoltativi, senza integrazioni artificiali. Non sono state inventate nuove date o liste di personaggi.

Il motore mostra zero, uno o due badge, senza contenitori vuoti, ed esclude segnaposto e ripetizioni esatte di autore, titolo o ambientazione. La vista globale non genera etichette di riempimento; gli scenari non usano l'autore o il luogo come personaggi e non duplicano il titolo della veduta. I raggruppamenti accettano valori editoriali propri oppure valori comuni a tutti i capitoli, senza ereditare quelli del solo primo capitolo.

Pubblicazione dati eseguita con `publish.sql`. Confronto tra snapshot API prima/dopo: invariati numero delle sezioni, tutti gli altri campi e metadati; modificate esclusivamente le 701 proprietà previste. Gli snapshot completi sono backup locali, non sorgenti da pubblicare in Git.

Verifiche: test dedicato ai badge, vista globale nelle quattro lingue, modalità geografiche/scenari, adattatore Macondo, revisione geografica e controllo TypeScript.
