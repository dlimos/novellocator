# Pubblicazione dell’atlante

**2 novembre 2026: ampliamento pubblicato e verificato.** La selezione ora comprende 159 località con ancoraggi nella cartografia, 70 sezioni e 1.236 associazioni. Le 18 posizioni interpretative pendenti restano escluse. La pubblicazione riproduce soltanto 197 estratti (1.767 parole, comprese le ripetizioni), mantenendo gli altri 1.039 riscontri originali nell’analisi privata in attesa della revisione del riuso. Non compaiono blocchi vuoti o citazioni inventate. [Valutazione della selezione](surface-publication-quotation-review.json) · [Verifica pubblica](publication-status.json). Il caricamento è avvenuto con attivazione atomica dopo il controllo del pacchetto completo; lo staging è stato rimosso. Il blocco temporaneo del precedente tentativo Git è rientrato; la pubblicazione ha usato il normale `git push origin docs`.

## Prima edizione, conservata come cronaca

1 novembre 2026. Pacchetto editoriale: 70 sezioni (preliminari, Prologo, 62 capitoli e appendici A–F), introduzioni in italiano, inglese, francese e spagnolo, 11 località principali e 207 associazioni sezione–luogo. La pubblicazione non certifica la conclusione dell’inventario critico completo: `fullNovelAnalysisComplete` resta `false`.

## Cartografia attuale: Jean Tinland

La cartografia iniziale ArcGIS è stata sostituita il 1 novembre 2026 con il disegno di Jean Tinland. L’immagine originale è stata ridimensionata a 7600 × 5200 pixel; fonte, revisione, GPL-3.0, attribuzione della bussola Freepik e modifiche sono conservate in `docs/images/maps/tinland/README.md`. [Verifica delle coordinate](tinland-cartography-review.json) e [stato pubblico](publication-status.json). Le posizioni sono locali all’immagine: il riferimento tecnico del renderer non le rende coordinate terrestri. Dieci ancoraggi derivano dai punti «Canon» del progetto; Parth Galen ha un ancoraggio editoriale dichiarato vicino al piede di Amon Hen. I dati narrativi, le categorie e i 207 riscontri restano invariati. L’applicazione non interroga più il vecchio servizio di punti ArcGIS.

## Selezione e geografia iniziali

Sono presentati Hobbiton, Bree, Parth Galen, Amon Sûl, Isengard, Rivendell, Moria, Lothlórien, Erebor, Tharbad e Minas Tirith. Ogni associazione conserva categoria e riscontro specifici; i sotto-luoghi non sono assimilati automaticamente alla città o alla regione. Gli altri record dell’analisi privata rimangono fuori da questa prima selezione.

Le posizioni vengono lette dal servizio pubblico della Web Map `16abf625a5704ebd90fff024e7d9c476`. Sono coordinate del disegno della Terra di Mezzo, mai coordinate terrestri. Il visualizzatore mantiene soltanto il gruppo cartografico di contesto e sovrappone dati narrativi propri: itinerari, testi e fotografie del progetto cinematografico non sono presentati. I poligoni regionali non sono usati come localizzazioni arbitrarie. Sarehole è ricordato nelle note come fonte d’ispirazione documentata per la Contea, senza identificarlo con Hobbiton.

## Consultazione dei servizi ArcGIS: documentazione della prima mappa, ora sostituita

La precedente verifica dei soli metadati non aveva individuato una licenza esplicita. La decisione aggiornata riguarda la consultazione remota del servizio condiviso pubblicamente, secondo [ArcGIS Online Terms of Use](https://doc.arcgis.com/en/arcgis-online/reference/terms-of-use.htm) e [Esri Web Site and Service Terms of Use, §2.6](https://www.esri.com/en-us/legal/terms/web-site-service), verificati il 1 novembre 2026. Questa base non equivale a dichiarare di pubblico dominio il DEM o ogni opera sottostante, né autorizza una loro redistribuzione autonoma. Cartografia e immagini originali non sono copiate nel repository. Restano attribuite Myrto-Panagiota Bouloukou e Vanessa Henkes, con [collegamento al progetto](https://cartographymaster.eu/studentwork/mp22_group5/).

## Citazioni

[publication-quotation-review.json](publication-quotation-review.json) documenta la valutazione dei 207 estratti originali selezionati: 1.889 parole complessive e altrettante deduplicate. Ogni record identifica finalità critica, necessità, proporzione, capitolo, pagina e impronta del passo. La valutazione applica l’art. 70 della legge 633/1941 alla discussione della funzione narrativa del luogo; non si fonda su una soglia numerica e non costituisce una licenza del titolare. L’inventario privato integrale non è approvato nel suo insieme.

Le citazioni sono soltanto in inglese autentico, con attribuzione all’edizione HarperCollins 2005, Adobe Acrobat eBook 2009, ISBN 9780061917806. La ricerca delle traduzioni di pubblico dominio IT/FR/ES e le lacune restano documentate nel README. La tendina della citazione mostra l’unica lingua verificata ed è disabilitata. Le altre lingue ricevono l’originale; non vengono inventate traduzioni. Gli URL dei testi integrali restano esclusi dall’interfaccia e dalle esportazioni.

## Identità visiva e vedute

Copertina: Albert Bierstadt, *Among the Sierra Nevada, California* (1868), Smithsonian American Art Museum, 1977.107.1, [fonte istituzionale](https://americanart.si.edu/artwork/among-sierra-nevada-california-2059), Smithsonian Open Access CC0. Monti, lago e luce evocano l’attraversamento di un paesaggio sublime: il dipinto non è un’illustrazione di Tolkien o un modello geografico. Il tema locale unisce verde bosco e oro, con una filigrana ad anelli di 36 px; CSS, traduzioni e crediti sono conservati in `book_presentations`, con backup locali esclusi da Git.

Valutazione positiva per future vedute di Moria, Minas Tirith e Fosso di Helm: percorsi, dislivelli, porte e relazioni fra spazi sono descritti nel testo e possono aiutare la lettura. La prima edizione non contiene queste vedute. La mappa cartografica non viene presentata come loro ricostruzione realistica; eventuali coordinate sulle immagini dovranno restare interpretative e separate dalla geografia.

## Controlli

Passati: suite del visualizzatore condiviso; test del renderer Web Map; prova SQL su PGlite con doppia importazione, uguaglianza del payload, isolamento RLS della bozza e accesso dopo pubblicazione; adattamento nelle quattro lingue; riscontri originali e due controlli negativi. Il database reale ha restituito `verified = true` dopo l’importazione delle 70 sezioni e della presentazione. Lo stato pubblico finale è registrato separatamente in `publication-status.json`.
