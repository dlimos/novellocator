# Esito delle sostituzioni — 2 novembre 2026

## Scelta finale dell'utente

La richiesta iniziale riguardava i quattro cambi proposti, escluso Holden. Alla verifica delle condizioni di riuso, l'utente ha confermato di non avere autorizzazioni per Rivera, Tolkien e Tooker. Alla successiva proposta di tre alternative storiche ha scelto espressamente **«Mantieni per ora i tre quadri attuali»**.

L'esito richiesto e realizzato è pertanto:

| Romanzo | Esito |
| --- | --- |
| Il grande Gatsby | Sostituito Bellows con Florine Stettheimer, *The Cathedrals of Fifth Avenue*, 1931. |
| Cent'anni di solitudine | Conservato Rousseau, *Tropical Forest with Monkeys*. |
| Il Signore degli Anelli | Conservato Bierstadt, *Among the Sierra Nevada, California*. |
| 1984 | Conservato Monet, *The Thames below Westminster*. |
| Il giovane Holden | Conservato Henri, *Snow in New York*, come richiesto sin dall'inizio. |

## Riproduzione di Gatsby

- Scheda del dipinto: https://www.metmuseum.org/art/collection/search/488735 .
- File utilizzato: https://commons.wikimedia.org/wiki/File:The_Cathedrals_of_Fifth_Avenue_MET_DT11557.jpg . La scheda specifica una donazione del Met e CC0 1.0; non si assume una licenza generale da tutte le pagine del museo. Il file risale al 25 marzo 2017; la pagina attuale del Met, diversamente, non offre il download.
- File locale e pubblicato: `docs/images/gatsby-stettheimer-fifth-avenue.jpg`, 3083 × 3712 pixel. Riproduzione conservata integralmente, ritaglio soltanto CSS (`center 70%`) per includere gli sposi.
- SHA256: `957193e8c0cdf2eba3761de4ddf76f0307dbf09c5418c308188eb6a5758e553a`.
- Testi alternativi preparati e pubblicati nelle quattro lingue. Attribuzione pubblica limitata ad artista, titolo collegato al museo e anno.

## Pubblicazione e verifica

1. File pubblicato nel branch `docs`; disponibilità dell'immagine verificata con HTTP 200 prima di attivarla nel database.
2. Eseguito `publish-gatsby-cover.sql` nell'editor autenticato di Supabase: restituito un solo record, `gatsby`. Patch limitata a copertina, credito, nuovi testi alternativi e documentazione dell'opera; conservati tema, ordine del catalogo e metadati narrativi.
3. Controllo PostgreSQL/PGlite eseguito con `check-gatsby-cover.cjs`: applicazione ripetibile; immagine, tema e dati di Holden conservati; conservati i campi aggiuntivi e le traduzioni preesistenti di Gatsby. Passati anche i controlli della presentazione del progetto.
4. Verifica nel catalogo pubblico: nuova immagine caricata con dimensioni naturali 3083 × 3712, testo alternativo italiano corretto, fonte espandibile con Florine Stettheimer, titolo e 1931. Ritaglio controllato visivamente.
5. Confrontati i 17 record visibili con lo snapshot precedente: **l'unica immagine diversa è Gatsby**. Snapshot successivo in `public-after-gatsby.json`; schermata in `gatsby-published.png`.

Non sono stati richiesti permessi né inviati messaggi ai titolari delle altre opere. Nessuna loro immagine è stata inserita nel catalogo. Le alternative storiche proposte (Rousseau, *La Noce*; Cole, *The Voyage of Life: Manhood*; Ensor, *Christ's Entry into Brussels in 1889*) non sono state selezionate dall'utente e non sono state applicate.
