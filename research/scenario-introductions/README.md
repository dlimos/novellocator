# Introduzioni e descrizioni degli scenari — 24 ottobre 2026

Revisione editoriale delle vedute già pubblicate: cinque introduzioni mancanti o metodologiche (Combray, Balbec, proprietà Compson, Jefferson, quartiere Finch–Radley) e 45 descrizioni di luoghi nelle quattro lingue. Le introduzioni di Austen, Brontë e delle tre epoche di Macondo restano specifiche e vengono conservate. Non si aggiungono vedute, coordinate, citazioni o classificazioni narrative.

I testi in `copy.tsv` sono descrizioni redazionali, non traduzioni di passi letterari. Confrontati con le citazioni originali delle associazioni pubblicate e con i dossier locali:

- Proust: `research/proust/panorama-evidence.json`, sezioni 1, 2, 4 e 7; madeleine e camera di Léonie, Saint-Hilaire, biancospini di Tansonville, soggiorni al Grand-Hôtel e diga.
- Faulkner: citazioni delle quattro sezioni e dell’appendice conservate nel database e nel dossier `research/sound-and-fury/`. La descrizione del negozio distingue l’appendice; quella del cimitero distingue la visita annunciata dal funerale ricordato. Nessuna categoria viene dedotta dalla descrizione generale della veduta.
- Harper Lee: `research/mockingbird/VEDUTA.md` e riscontri pubblicati, capitoli 1, 4, 5, 6, 28 e 31. Distinte le due querce e conservata nella scheda di Maudie la fase successiva all’incendio.
- Austen: `research/pride-and-prejudice/views-evidence.md` e `.json`; capitoli 1–3, 6–8, 18, 28–29, 34–36, 43 e 45. Il vialetto descrive la rilettura nel capitolo 36; i due ponti e la passeggiata hanno riscontri distinti nel capitolo 43.
- Brontë: `research/wuthering-heights/views-evidence.json` e associazioni originali pubblicate. Dimore, brughiera, Gimmerton e Penistone sostituiscono avvisi generici; letto, giardino, frassino e cippo perdono le ripetizioni metodologiche. Le altre note specifiche restano invariate.

La nota generale già presente nel database compare una sola volta, nel menu degli scenari. Non è usata come introduzione, didascalia duplicata o descrizione nelle schede/popup. Le schede mantengono citazioni e riferimenti originali. Le descrizioni panoramiche restano separate dalle descrizioni delle singole associazioni capitolo–luogo, incluse le revisioni contemporanee.

`prepare.cjs` prepara patch limitate a `illustratedView.notes` e alle cinque `views[].notes`, senza sovrascrivere l’intero metadata. `publish.sql` è transazionale e ripetibile; gli snapshot pubblici completi restano backup locali esclusi da Git.
