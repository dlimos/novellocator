# Revisione dei contorni nei primi romanzi importati

19 ottobre 2026. Revisione cartografica dei record già importati: non è una nuova analisi integrale del testo e non modifica le categorie narrative, i riscontri originali o i diritti delle citazioni ancora pendenti.

Sono stati controllati i riferimenti regionali dell'importazione iniziale e dei successivi romanzi anteriori a *Lolita*: Ulisse, Alla ricerca del tempo perduto, Guerra e pace, Moby-Dick, Il grande Gatsby, Il giovane Holden, 1984, Don Chisciotte, Delitto e castigo, L'urlo e il furore, Anna Karenina. I romanzi più recenti mantengono i contorni già presenti. I restanti riferimenti regionali di Lolita non rientrano in questa revisione dei primi importati.

Dieci record in sei romanzi hanno ora una polyline, senza simbolo puntuale né coordinate del centro mostrate nella scheda e nel CSV. Otto provengono dai riferimenti regionali aggiunti alla vista; due sono descrizioni geografiche già presenti nelle tabelle relazionali. Le coordinate storiche rimangono nei dati originali, senza essere usate come posizione della scena. Le etichette sono ancorate al contorno; tale ancoraggio è tipografico e non localizza il paese immaginario.

| Romanzo | Record aggiornati | Contorno e limiti interpretativi |
| --- | --- | --- |
| Anna Karenina | Pokrovskoye | Oblast di Tula attuale: contesto regionale del modello Jasnaja Poljana, non prova della posizione della tenuta immaginaria. |
| L'urlo e il furore | Jefferson, Mottson, Mississippi | Confine dello Stato. Per Jefferson il testo e la critica indicano il nord: il contorno dell'intero Stato è dichiaratamente più ampio, non una delimitazione di Yoknapatawpha o della sua parte settentrionale. |
| Il giovane Holden | Agerstown / Pencey | Pennsylvania. Non viene identificato un campus o un indirizzo reale; restano pendenti i riscontri testuali già mancanti. |
| Il grande Gatsby | Little Girl Bay, Lake Superior | Sponda e isole del lago Superiore; non viene inventato il perimetro della baia. Le due etichette occupano punti distinti del contorno. |
| Moby-Dick | Rokovoko | Pacifico meridionale IHO: ampio contesto oceanico dell'isola inventata, non confine dell'isola né itinerario di Queequeg. |
| Don Chisciotte | Barataria, Micomicón | Per Barataria, contorno esterno dell'Aragona attuale, ottenuto eliminando i bordi condivisi delle sue tre province; non perimetro del ducato. Per Micomicón, Etiopia attuale come riferimento orientativo, distinta esplicitamente dall'Aethiopia della prima età moderna e dal regno immaginario. |

Per Ulisse non sono stati trovati altri record regionali sintetici nella revisione precedente: i tre punti incerti riguardano identificazioni di edifici. Proust e Guerra e pace conservano modelli reali dichiarati, come Cabourg, Illiers-Combray, Jasnaja Poljana e Nikolskoye-Vyazemskoye: non sono trattati come coordinate certe delle località immaginarie. In 1984 restano le esclusioni editoriali degli edifici inventati; in Delitto e castigo il problema del modello siberiano non viene trasformato in una nuova localizzazione certa. Queste conclusioni riguardano i record già censiti, non certificano un nuovo inventario narrativo completo di ogni luogo dell'opera.

## Casi non completati

- **Paese anonimo nella Mancha e La Mancha:** il contorno della comunità autonoma Castilla-La Mancha non equivale alla regione letteraria o storica. La ricerca ha trovato l'edizione critica del Centro Virtual Cervantes e la cartografia delle comarche agrarie MAPA, ma non ha consentito di acquisire e verificare un perimetro appropriato. Il CVC è stato reindirizzato alla pagina di manutenzione; il collegamento MAPA all'archivio ha restituito HTML, non lo shapefile. Non è stato pubblicato un contorno amministrativo sostitutivo. I record preesistenti restano da correggere: questa parte della richiesta è pendente.
- **Candaya:** la Trifaldi cita una geografia fantastica presso Comorín e Trapobana. Non è verificato un territorio delimitabile; il Tamil Nadu attuale non è il confine del regno. Il riferimento regionale preesistente non è stato convertito in un perimetro arbitrario e resta pendente.

## Fonti

- [US Census, TIGERweb State/County, layer 70](https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/State_County/MapServer/70): Pennsylvania e Mississippi, generalizzazione di 0,02 gradi e arrotondamento a quattro decimali. `sources/urls.json` conserva la query integrale.
- [Natural Earth, laghi 1:50 milioni](https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_lakes.geojson): geometria di Lake Superior.
- [Natural Earth, province 1:50 milioni](https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_1_states_provinces.geojson): Tula.
- [Natural Earth, province 1:10 milioni](https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_1_states_provinces.geojson): Huesca, Zaragoza e Teruel; cancellazione degli spigoli condivisi, conservazione delle parti distaccate. `dissolve-aragon.cjs` verifica la chiusura degli anelli.
- [Natural Earth, suddivisioni nazionali 1:50 milioni](https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_map_subunits.geojson): Etiopia attuale. I confini moderni non sono proposti come ricostruzione storica.
- [Marine Regions, South Pacific Ocean, MRGID 1910](https://www.marineregions.org/gazetteer.php?id=1910&p=details): area marina IHO basata su *Limits of Oceans and Seas*, 1953. Generalizzazione Ramer-Douglas-Peucker di 0,05 gradi; soli contorni esterni, parti minori sotto 0,1 gradi quadrati omesse; longitudini continue 130–293 gradi per attraversare l'antimeridiano. La versione WFS e la query sono conservate in `sources/south-pacific-selected.json`. Scartate le aree Natural Earth destinate alla collocazione di etichette come fonte di un confine idrografico.
- [Digital Yoknapatawpha, Mottstown/Mottson](https://faulkner.iath.virginia.edu/shanti/content/mottstownmottson): distinzione fra geografia immaginaria e modelli reali.
- [Museo Jasnaja Poljana](https://ypmuseum.ru/event/1283): riferimento al modello letterario già documentato nella precedente analisi.
- [CVC, discussione del paese anonimo](https://cvc.cervantes.es/el_rinconete/anteriores/abril_09/23042009_01.asp) e [MAPA, comarche agrarie](https://www.mapa.gob.es/es/cartografia-y-sig/ide/descargas/agricultura/comarcas_agrarias.aspx): ricerca del perimetro della Mancha ancora senza esito utilizzabile.

Le prove narrative restano nelle singole associazioni e nell'analisi precedente. Le nuove fonti cartografiche non vengono usate per riclassificare una menzione come azione.

## Pubblicazione e verifiche

`publish.sql` è transazionale e ripetibile: aggiorna soltanto le geometrie e le note dei record elencati, aggiunge le traduzioni nelle quattro lingue e collega le due descrizioni relazionali alle nuove fonti geografiche. Non reimporta i romanzi. `publish-aragon.sql` e `publish-labels.sql` conservano le successive correzioni mirate: contorno esterno senza divisioni provinciali ed etichette distanziate.

`tests/check-earlier-regional-outlines.cjs` verifica la chiusura delle geometrie, la resa con linee ed etichetta senza simboli puntuali, l'assenza delle coordinate rappresentative nei CSV, l'idempotenza PostgreSQL, le traduzioni e la conservazione dei metadati e delle categorie. Usa una fixture ridotta dei metadati, senza citazioni editoriali. È passato anche `tests/check-regional-outline.cjs`.

La pubblicazione è stata riletta tramite l'API pubblica: dieci geometrie corrispondenti alle patch attese; categorie, riferimenti alle sezioni e record regionali non interessati conservati. Esito in `verification.json`. Verifica visiva del lago Superiore nel sito pubblico, con selezione, numero dell'azione e contorno. Le copie complete dei dati pubblici e delle fonti geografiche sono locali ed escluse da Git; `patches.json` conserva le sole geometrie e note applicate.

Per rigenerare le geometrie, con rete disponibile, dalla radice del progetto:

```powershell
node research/regional-outline-review/fetch-sources.cjs
node research/regional-outline-review/dissolve-aragon.cjs
node research/regional-outline-review/simplify-pacific.cjs
node research/regional-outline-review/prepare.cjs
node tests/check-earlier-regional-outlines.cjs
```

`verify-public.cjs` rilegge i record pubblici dopo l'applicazione SQL. Non sono richieste credenziali amministrative per acquisizione e verifica; la pubblicazione usa l'editor SQL del progetto autorizzato. Non rieseguire vecchie importazioni complete dei romanzi.
