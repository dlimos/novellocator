# Descrizioni delle singole ambientazioni

Correzione pubblicata su Supabase e verificata attraverso la sua API pubblica il 24 ottobre 2026.

Le 94 descrizioni base di *Orgoglio e pregiudizio* e le 77 di *Cime tempestose* ripetevano l'introduzione del capitolo con il prefisso «Scena narrata». Sono state sostituite con frasi specifiche per associazione sezione–luogo, in inglese, italiano, francese e spagnolo (684 voci linguistiche). I testi sono nei rispettivi `place-scenes.tsv`; i generatori li richiedono per tutte le associazioni cartografate dell'azione.

La redazione si basa sui riscontri originali e sulle motivazioni individuali già conservati nei due `analysis.json` e nei `decisions.py`, con controllo contestuale nei `sections.json`. Le descrizioni distinguono presente, cornice, ricordo, racconto intercalato e lettera quando necessario. Non sono citazioni editoriali né traduzioni di passi del romanzo.

Esempi verificati nelle pagine pubbliche:

- Austen, capitolo 3: a Longbourn la madre racconta la serata al marito; a Meryton Elizabeth ascolta il rifiuto di Darcy.
- Brontë, capitolo III: alla Grange Lockwood arriva dopo essersi smarrito; alle Heights legge gli scritti nella camera e trascorre la notte; sulla brughiera Heathcliff gli indica il cammino.

La patch aggiorna esclusivamente `place_references.scene_text` delle 171 righe base e aggiunge le traduzioni in `content_translations`. Conserva identità, ordine, categorie, geometrie, citazioni, attribuzioni e introduzioni. Le menzioni e i luoghi senza coordinate sono fuori da questo intervento; non si tratta di una nuova revisione completa dell'inventario geografico o delle categorie narrative.

`patch.cjs` prepara la transazione a partire dai dati pubblici correnti, verificando identità e categorie. Il controllo MD5 dei testi precedenti interrompe l'operazione se intervengono altre modifiche. Snapshot precedenti e SQL generato restano locali ed esclusi da Git.

Verifiche eseguite:

- `npx tsx research/place-scenes/validate.ts`: esecuzione effettiva della patch con PostgreSQL/PGlite, controllo di 171 descrizioni e 684 voci linguistiche, confronto integrale di sezioni ed estratti prima/dopo.
- `node research/place-scenes/patch.cjs --verify`: confronto di tutti i nuovi testi e delle quattro lingue con l'API pubblica; confronto di tutti gli altri campi delle associazioni con lo snapshot precedente. Esito in `public-verification.json`.
- Controllo visivo e testuale dei capitoli 3/III nel sito pubblico, selezionando i diversi luoghi.
- Controllo sintattico Python dei due generatori.

Le introduzioni rimangono nel contesto del capitolo; le nuove frasi non ne sono copie e non attribuiscono al singolo luogo l'intera azione del capitolo. Le stesse associazioni alimentano schede, selezione globale e scenari attraverso il normale adattatore del sito.
