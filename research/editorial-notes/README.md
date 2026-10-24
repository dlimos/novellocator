# Note editoriali — 24 ottobre 2026

Correzioni pubblicate in Supabase e verificate tramite API pubblica:

- Gatsby: gli interni immaginari senza collocazione geografica utile sono conservati nell’analisi ed esclusi dall’atlante. La nota non promette più un elenco sotto la mappa.
- L’urlo e il furore: Oxford è il modello reale documentato di Jefferson; il punto non localizza la città immaginaria o i suoi edifici. Mottson conserva il riferimento regionale.
- Moby-Dick: eliminati i totali statici del vecchio inventario. La legenda conta luoghi distinti nella vista corrente, il CSV associazioni capitolo–luogo. Le vecchie cifre sono dichiarate superate dalle revisioni narrative e di visibilità.
- Ulisse: 51 etichette di fonte riportano titolo, autori, anno e natura topografica della numerazione. Le descrizioni di 14 riferimenti alla tavola 11 e 8 alla tavola 32 esplicitano la stessa fonte.
- Eliminate 717 copie di cautele generali dalle sezioni di undici romanzi. La cautela comune resta nella nota laterale; le note specifiche di Ulisse sono conservate. La revisione geografica non reinserisce più una nota comune in tutte le sezioni.
- Le cautele di precisione del singolo luogo sono riunite in «Posizione e fonti», anche nei popup e nelle mappe illustrate. Lo stato breve resta visibile nelle schede geografiche. Testi identici non vengono ripetuti nello stesso pannello.

Le 228 versioni dei nuovi testi e delle attribuzioni sono state controllate in inglese, italiano, francese e spagnolo. Nessuna modifica alle categorie narrative, alle geometrie, ai riscontri originali o alle introduzioni delle sezioni. I backup locali esclusi da Git sono stati sincronizzati.

`check.cjs` verifica l’SQL due volte in PostgreSQL/PGlite e controlla la conservazione dei dati estranei alla correzione. `verify.cjs` confronta gli snapshot prima/dopo e le traduzioni esposte dall’API pubblica. `verification.json` contiene i risultati. È stata eseguita anche la suite `npm test`, inclusi typecheck, database e presentazioni; il controllo Moby-Dick è stato adeguato al carattere facoltativo della nota di capitolo.

Gli snapshot completi restano locali; `prepare.cjs` documenta le modifiche e genera l’SQL. Le attribuzioni bibliografiche derivano dalla fonte topografica già registrata, *James Joyce’s Dublin*, Ian Gunn e Clive Hart, con Harald Beck, edizione riveduta 2022, https://riverrun.org.uk/JJD2.pdf.
