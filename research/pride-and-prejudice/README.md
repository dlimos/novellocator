# Orgoglio e pregiudizio — atlante e verifica editoriale

**Pubblicato e verificato il 19 ottobre 2026.** [Apri l’atlante](https://dlimos.github.io/novellocator/atlas.html?book=pride-and-prejudice&lang=it). Il registro remoto è `import-status.json`; la verifica finale ha restituito `true`, stato `published`. L’analisi della precedente fase di lettura rimane in `narrative-analysis-phase.md`: i suoi stati pendenti non descrivono il pacchetto finale.

## Copertura narrativa e testimoni

Letti integralmente i **61 capitoli**, 2.063 paragrafi e 121.439 parole del primo testimone acquisito. Analizzate **407 associazioni capitolo–luogo: 96 azione e 311 menzioni**, per 66 identità. Ogni associazione conserva motivazione, livello narrativo e proprio riscontro originale. Verificate le ambientazioni ricorrenti anche in assenza del nome. Lettere e ricordi sono azione soltanto se narrano effettivamente una scena; nei casi dubbi resta la menzione. Tutte le **61 introduzioni narrative sono disponibili in EN/IT/FR/ES** e sono distinte dalle citazioni.

- **Lettura:** Gutenberg 1342, trascrizione aggiornata il 15 febbraio 2015; edizione cartacea sottostante non dichiarata. Il corpus con impronta e l’analisi originaria sono conservati indipendentemente.
- **Citazioni finali:** Jane Austen, *Pride and Prejudice*, in *The Novels*, vol. II, a cura di R. W. Chapman, Oxford, Clarendon Press, **1923**; Gutenberg 42671. Tutti i 61 capitoli acquisiti e controllati strutturalmente. Collazionati i 407 riscontri selezionati, con registro in `verified-print-quotations.json`. Esclusi introduzione, note e apparati di Chapman.
- La collazione distingue 238 corrispondenze con le stesse parole da 169 casi con varianti lessicali o ortografiche. Revisionati il prospetto delle varianti, le discrepanze dei termini evidenziati e i tre casi di basso allineamento. Si tratta della collazione **dei passi selezionati**, non di una seconda rilettura integrale del volume del 1923.
- Conservate le forme autentiche *Kenelworth*, *Gracechurch-street*, *East Bourne*, *Haye-Park*, *Purvis Lodge*, *Philips*, *chuse*, *shew*. L’identità `pulvis-lodge` rimane stabile; il nome pubblico segue l’edizione scelta: **Purvis Lodge**.
- Otto traduzioni autentiche individualmente allineate: quattro francesi di Eloïse Perks (Maradan 1822) e quattro spagnole di José J. de Urríes y Azara (Calpe 1924). Le altre associazioni usano l’originale inglese. Ricerca italiana e lacune dei diritti documentate in `TRADUZIONI.md`, senza traduzioni inventate.

Il registro iniziale `analysis.json` conserva lo stato storico della prima fase, compresi i vecchi pendenti geografici. **`publication-audit.json`** documenta le decisioni successive effettivamente applicate.

## Geografia

**58 identità cartografate**, 396 associazioni cartografate e 11 riferimenti senza coordinate. Tre dettagli aggiuntivi sono riservati alla veduta di Pemberley; nessun punto geografico o voce pubblica non localizzata viene inventato per essi.

- Ambientazioni inventate dell’Hertfordshire, del Kent e del Derbyshire: contorni delle contee storiche, non falsi indirizzi. Fonti Historic County Borders, definizione A, WGS84, semplificazione grafica 0,008 gradi. Le posizioni delle etichette sono cartografiche.
- Pemberley non è identificata con Chatsworth; l’ipotesi Harpenden per Longbourn resta distinta dalla prova testuale. Bakewell è una tappa narrata distinta dalla Lambton inventata. Confrontate le interpretazioni specialistiche JASNA.
- Lake District e Peak District: contorni ufficiali Natural England dei parchi moderni, esplicitamente distinti dalla regione storica del romanzo. I parchi furono istituiti nel 1951. Inghilterra, Scozia e Gran Bretagna: contorni geografici Natural Earth, senza ricostruzioni amministrative fittizie.
- Città e strade reali: risultati ArcGIS controllati. Respinti Bromley orientale, le strade Dovedale di Derby, Clapham Road e il centro del borough moderno di Barnet. Correzioni: Bromley nel Kent storico, Dovedale come riferimento di valle, Clapham Common e High Barnet. Non si attribuiscono numeri civici alle case immaginarie.
- Il Bell di Bromley è documentato dal Comune: sito della vecchia locanda, distinto dall’edificio successivo. Il testo propone soltanto un cambio di cavalli.
- Edward Street rimane ambiguo fra strade storiche omonime; Mrs Younge non abita nella strada omessa degli alloggi di Wickham e Lydia. St Clement’s conserva le alternative Danes/Eastcheap. Il Little Theatre è collegato allo storico Haymarket, senza un falso punto nell’edificio aperto più a sud nel 1821.
- Nord/sud dell’Inghilterra e percorso di ritorno non ricevono confini o itinerari inventati. La nuova tenuta di Bingley conserva la sua funzione geografica senza contea nominata. Gli alloggi londinesi anonimi restano nell’analisi, con Londra già rappresentata.

## Vedute, copertina e tema

Realizzate **tre vedute realistiche**: Hertfordshire; Hunsford e Rosings; Pemberley. Valutazione positiva: dimore, cammini, parchi e visite hanno una funzione narrativa centrale, particolarmente nel cambiamento del giudizio di Elizabeth su Darcy. Un solo collegamento dalla pagina principale; elenco delle vedute al suo interno, posizioni pertinenti insieme e introduzioni narrative nelle quattro lingue.

Strumento usato: **`image_gen` integrato**, una generazione per veduta. File finali in `docs/images/pride-and-prejudice/`; prompt integrali in `views-prompts.json`; prove e distinzione fra testo e interpretazione in `views-evidence.md` e `views-evidence.json`. Architettura, scala, orientamento, dettagli atmosferici e posizioni sul disegno sono interpretativi. Nessuna veduta è una pianta schematica o una coordinata geografica.

Copertina scelta dall’utente il 19 ottobre 2026: **Thomas Gainsborough, *La passeggiata mattutina (Mr and Mrs William Hallett)*, 1785**, National Gallery, Londra, NG6209. Fonte: https://www.nationalgallery.org.uk/paintings/thomas-gainsborough-mr-and-mrs-william-hallett-the-morning-walk . Riproduzione fedele di pubblico dominio da Wikimedia Commons (PD-Art). La coppia a passeggio richiama corteggiamento, matrimonio e società inglese; non raffigura Elizabeth e Darcy. Crediti pubblici limitati a artista, titolo collegato e anno. Fonti e diritti documentati in `cover-change.json`; aggiornamento remoto limitato a immagine, crediti e testi alternativi.

Tema locale `docs/themes/pride-and-prejudice.css`: carta chiara, verde salvia, prugna e filigrana discreta di **lettera ripiegata**, legata alla corrispondenza e ai fraintendimenti. Catalogo, tema, traduzioni editoriali e documentazione delle immagini sono preparati per `book_presentations`; le sorgenti locali restano escluse da Git.

## Controlli e importazione

```text
python research/pride-and-prejudice/build.py
node research/pride-and-prejudice/verify-atlas.cjs
node research/pride-and-prejudice/presentation.cjs
npm run db:prepare -- --book=pride-and-prejudice
node research/pride-and-prejudice/check-package.cjs
```

Verificati i 407 passi letterali nell’edizione scelta, otto traduzioni, evidenziazioni autentiche, 244 introduzioni, chiusura dei contorni, fallback e tendine delle citazioni nelle quattro lingue, CSV privi di link ai testi, numerazione dei layer e tre vedute. Superati i test PostgreSQL/PGlite del database e delle presentazioni, compreso il round trip esatto.

Il pacchetto locale `database/generated/pride-and-prejudice/` comprende sei transazioni di contenuto e una di presentazione, eseguite due volte nel database di prova. La bozza è invisibile al ruolo anonimo. `verifica.sql` confronta le impronte dell’intero contenuto e della presentazione; `publish.sql` pubblica soltanto se corrispondono. Nessun altro romanzo viene modificato o cancellato. I file locali restano volutamente `draft`; lo stato remoto ha un registro separato. Anteprima con il motore reale: `node research/pride-and-prejudice/preview.cjs`, porta 8770.

Importazione e pubblicazione effettivamente eseguite nel SQL Editor Supabase autenticato; confronto esatto dei testi SQL, con sola normalizzazione degli a capo CRLF. Reso esplicito l’ordinamento PostgreSQL `COLLATE "C"` per evitare differenze di impronta dovute alla lingua del server. Nel controllo pubblico sono stati riallineati i due passi di Pemberley dal paragrafo dell’arrivo al paragrafo della vista della casa; accorciati i due passi di Hunsford alla stessa porzione dell’originale. Verificata nuovamente la citazione francese mantenendo l’interfaccia italiana. Otto vecchie righe bibliografiche sono conservate come storia senza riferimenti attivi: 351 fonti attive, 359 righe conservate. La verifica confronta tutte le fonti attive e tutte le righe delle altre tabelle, senza cancellazioni.

Controllati nel sito pubblico: catalogo e quadro caricato, credito limitato ad autore/titolo/anno, apertura su «Tutti i luoghi» con i due layer attivi, capitolo 43, citazione autentica con grassetto e selettore indipendente, tutte e tre le vedute e i quattro punti di Pemberley. Le quattro immagini pubbliche rispondono HTTP 200. Prove visive nei file indicati dal registro remoto.

La pubblicazione delle immagini avviene esclusivamente sul branch `docs`, con `git push origin docs`.

## Necessità e proporzione degli estratti

Gli estratti dimostrano, capitolo per capitolo, luogo e funzione narrativa. Circa **20.821 parole inglesi complessive**, con ripetizioni, e 18.555 senza duplicati identici, distribuite sull’intera opera. Le menzioni sono state ridotte alla frase pertinente quando possibile; conservato il contesto per scene e riferimenti indiretti, con ulteriore riduzione dei due lunghi passi epistolari del capitolo 35. Tre brevi riscontri supplementari illustrano ponti e camminata nel capitolo 43. La motivazione specifica rimane in ogni associazione.

Il testo narrativo di Austen è di pubblico dominio. Nessun apparato o traduzione protetta è riprodotto; i diritti delle traduzioni sono verificati separatamente. La selezione non assume che brevità, attribuzione o link d’acquisto costituiscano da soli una base di riuso. Il prospetto dei testimoni, dei diritti e delle ricerche senza esito rimane nella documentazione, distinta dall’interfaccia.
