# Cime tempestose — importazione pubblicata

**Pubblicato nel catalogo e nell’atlante il 19 ottobre 2026**, dopo il push della copertina sul branch `docs`. [Apri l’atlante](https://dlimos.github.io/novellocator/atlas.html?book=wuthering-heights&lang=it). Analisi integrale dei 34 capitoli completata; introduzioni EN/IT/FR/ES, 13 luoghi cartografici, **134 associazioni cartografate (77 azione, 57 menzioni)**, 5 riferimenti geografici senza coordinate e 23 passi francesi allineati individualmente. Lo stato remoto e le prove sono registrati in `import-status.json`.

## Stato della revisione

Sono stati letti integralmente tutti i paragrafi dei 34 capitoli, inclusi i dialoghi senza toponimo, le cornici e i racconti intercalati. `full-review.json` registra per ogni capitolo l’impronta del testo, il numero di paragrafi e le decisioni emerse dalla rilettura; `analysis.json` conserva ogni associazione e prova originale. La concordanza lessicale è stata soltanto uno strumento di supporto.

La rilettura ha aggiunto le associazioni della brughiera nei capitoli II, XVII, XX, XXII e XXIX e corretto a `action` l’incontro sulla strada in XXIV e la scena del resoconto a Edgar alla Grange in XXVI. Le due identità preesistenti nel database sono conservate anche dopo la riclassificazione. Le scene soltanto riepilogate o dubbie restano `mentioned`.

L’importazione avviene nel browser interno Supabase autenticato, in transazioni ripetibili con confronto esatto del testo SQL prima dell’esecuzione. Un conflitto iniziale nell’ordine delle schede ha annullato la relativa transazione: risolto spostando temporaneamente gli ordinali nella stessa transazione, prima degli UPSERT. Non si eliminano dati. Le fonti non più referenziate della bozza precedente restano come storia documentale.

La pubblicazione è separata dall’importazione della bozza e subordinata alla verifica remota di conteggi e impronte di citazioni, dizionari e CSS e alla disponibilità degli asset sul branch `docs`.

## Fonti e integrità

- Emily Brontë, *Wuthering Heights*, London, John Murray, 1910; trascrizione Project Gutenberg di David Price, aggiornata il 28 agosto 2010. Copia acquisita dall’archivio pubblico GITenberg: `https://raw.githubusercontent.com/GITenberg/Wuthering-Heights_768/master/768.txt`. L’intestazione del file documenta l’edizione. Le citazioni conservano le parole e la punteggiatura di quel testimone, anche dove differisce da trascrizioni più recenti. Si normalizzano soltanto gli spazi e gli a capo.
- Sequenza completa I–XXXIV: 34 capitoli, 115.829 parole secondo il conteggio per spazi. Nessun prologo o epilogo narrativo separato nel testimone. Le prefazioni editoriali di Charlotte non sono presentate come testo narrativo di Emily. Non è dichiarata una collazione diplomatica con le scansioni del 1910 né con la prima edizione del 1847.
- `extract.py` conserva tutti i paragrafi, testo completo e SHA-256 dei capitoli; `analysis.json` conserva motivazioni, citazioni originali, capitoli, fonte, livelli narrativi e decisioni di visibilità. `corpus/` e `sections.json` restano locali, esclusi da Git.
- `read.py` produce una concordanza contestuale e **non** certifica l’inventario completo. Le decisioni non derivano automaticamente dal numero di occorrenze.

## Geografia e modelli

- [Brontë Parsonage Museum, Maps & walks](https://www.bronte.org.uk/plan-your-visit/maps-walks): paesaggio esplorato dalle sorelle, Top Withens come ispirazione proposta, Ponden Kirk e brughiera. È distinta dalla prova narrativa nei capitoli.
- [Victorian Web, The Withins](https://victorianweb.org/authors/bronte/gallery/12.html), con riferimenti a Ann Dinsdale, *The Brontës in Context*, Cambridge University Press, 2012, pp. 17–35, e Butler Wood, 1918, pp. 313–325: documenta modelli concorrenti, senza identificare la casa immaginaria con un edificio unico.
- [Reader’s Guide, Thrushcross Grange](https://www.wuthering-heights.co.uk/locations/thrushcross-grange): Ponden Hall è un’ipotesi tradizionale controversa; dimensioni e parco non coincidono. Shibden Hall è un’altra proposta. La mappa indica chiaramente il modello proposto, non una posizione certa della Grange.
- [Historic England, Ponden Hall, 1313937](https://historicengland.org.uk/listing/the-list/list-entry/1313937): SD9907437095, convertito da EPSG:27700 a EPSG:4326 con il Geometry Service ArcGIS. Coordinate arrotondate 53.83013, −2.01555.
- [Reader’s Guide, Ponden Kirk](https://www.wuthering-heights.co.uk/locations/ponden-kirk): modello proposto per Penistone Crags e Fairy Cave, griglia SD979364, precisione circa 100 m. Coordinate convertite e arrotondate 53.82388, −2.03339. Non si sceglie il paese reale di Penistone per omonimia.
- [Reader’s Guide, The moors](https://www.wuthering-heights.co.uk/wh/locations/the-moors.php): confronto fra indicazioni testuali, Haworth, Shibden e paesaggi conosciuti dall’autrice. Gimmerton non acquisisce il centro di Haworth. Il villaggio, la brughiera/palude e i Lees mantengono identità distinte con il solo contorno dello Yorkshire come contesto regionale.
- [Historic County Borders Project](https://www.county-borders.co.uk/): file `UKDefinitionA_WG84_Simplified.kmz`, Historic Counties Standard A; confine dello Yorkshire con parti distaccate, ridotto ulteriormente di 0,008 gradi per la visualizzazione. Il contorno non delimita i luoghi immaginari. Le ancore delle etichette non sono posizioni narrative. This atlas made use of data provided by the Historic County Borders Project. Riutilizzo libero anche commerciale, secondo le condizioni della fonte archiviate in `corpus/borders.html`.
- [Natural Earth](https://www.naturalearthdata.com/about/terms-of-use/): `ne_50m_admin_0_map_subunits.geojson`, pubblico dominio, per Inghilterra, Cina, India e Spagna. I contorni moderni orientano geograficamente senza pretendere di ricostruire i confini politici dell’epoca. Per la Cina non si importa automaticamente la geometria di ogni territorio classificato sotto lo stesso sovrano; si usano le unità geografiche nominate nel codice.
- ArcGIS World Geocoding: query, risposte e candidati in `corpus/coordinates.json`. Per Top Withens si scartano i risultati più alti relativi al paese di Haworth e si sceglie il POI effettivo. Per Ponden Hall si scarta Hall Street; per Ponden Kirk si scartano Haworth e Hanworth. I centri di Liverpool e Londra sono riferimenti urbani, non indirizzi dei personaggi.
- [NOAA, Atlantic Ocean](https://oceanservice.noaa.gov/facts/atlantic.html): riscontro geografico per l’etichetta rappresentativa 30°N, 40°W. Nel romanzo l’Atlantico è soltanto un paragone di Isabella.

America, Continente e Indie non sono assegnati arbitrariamente agli Stati Uniti, a una città europea o all’India moderna. La costa della villeggiatura di Lockwood non è identificata. Questi casi mantengono un elenco senza coordinate perché hanno una funzione geografica. Cappella del sogno, paradiso, palude allegorica e deserto del gioco restano nell’analisi quando non hanno una collocazione utile. Galloway come nome del tipo di pony, lingue, strumenti e titoli di ballate non creano luoghi.

## Edizioni e traduzioni

La ricerca e le lacune sono registrate in [TRADUZIONI.md](TRADUZIONI.md). Inglese originale e francese verificato sono le sole lingue abilitate per i singoli passi. La lingua dell’interfaccia resta indipendente. Le altre citazioni francesi rimangono in attesa di allineamento e non compaiono nella tendina. Italiano e spagnolo usano il passo inglese autentico. Non sono state inventate traduzioni né importati passi editoriali protetti.

Le attribuzioni visibili comprendono autore, titolo, traduttore quando pertinente, editore, edizione, capitolo e paragrafo; il francese include anche l’intervallo di pagine del capitolo. I testi integrali e gli URL rimangono nell’analisi, senza collegamenti diretti dal sito, dai popup o dai CSV.

## Quadro e tema

Caspar David Friedrich, *Hünengrab im Schnee* (*Dolmen nella neve*), 1807, Galerie Neue Meister, Dresda, inventario 2196. [Record museale](https://skd-online-collection.skd.museum/Details/Index/241955); riproduzione Wikimedia Commons identificata come PD-Art. Il collegamento è tematico: paesaggio invernale esposto, alberi spogli, pietre sepolcrali e sensibilità romantica. Non è una veduta dello Yorkshire né una presunta illustrazione del romanzo. Artista morto nel 1840. Crediti e condizioni completi nei backup locali e nel record di presentazione; sulla scheda soltanto autore, titolo collegato e anno.

Tema in `docs/themes/wuthering-heights.css`: erica, pietra, avorio, carattere Georgia e un biancospino piegato dal vento come filigrana. Il CSS è pubblicabile tramite `book_presentations`, con sorgente locale esclusa da Git.

## Rigenerazione e controlli

```powershell
python -X utf8 research/wuthering-heights/extract.py
python -X utf8 research/wuthering-heights/extract-fr.py
python -X utf8 research/wuthering-heights/build.py
node research/wuthering-heights/presentation.cjs
node research/wuthering-heights/verify.cjs
npm run db:prepare -- --book=wuthering-heights
node research/wuthering-heights/package.cjs
node research/wuthering-heights/remote-check.cjs
node research/wuthering-heights/check-sql.cjs
node research/wuthering-heights/preview.cjs
```

Anteprima locale: `http://127.0.0.1:8768/preview/atlas.html?book=wuthering-heights&lang=it`. Il server ascolta solo su localhost e usa il motore reale con dati della bozza. Non modifica il loader di produzione e non esegue scritture remote.

`verify.cjs` controlla riscontri letterali, capitoli, termini in grassetto, introduzioni tradotte, chiusura dei contorni, selettore delle citazioni, fallback inglese, CSV privi di link ai romanzi e numerazione progressiva delle categorie quando cambiano i layer. `check-sql.cjs` esegue due volte i quattro blocchi effettivi in PostgreSQL/PGlite e verifica che il libro completo e la presentazione siano invisibili al ruolo anonimo.

Il pacchetto si trova in `database/generated/wuthering-heights/sql-editor/`. Nessun file contiene un comando per pubblicare la bozza. Il generatore ora rispetta `publicationStatus: draft`; `package.cjs` aggiunge una seconda verifica dello stato e prepara la guida. Tutti i file generati sono backup locali esclusi da Git. Alla futura pubblicazione usare soltanto il branch `docs` e `git push origin docs`.

## Verifica pubblica

La query di controllo remoto ha restituito `verified = true`; la transazione condizionata ha impostato `published`. Il browser pubblico carica catalogo, quadro, 34 capitoli e citazioni. Verificati selettore francese indipendente, attribuzione e grassetti, crediti del quadro e contorni regionali nel capitolo XVII. Prova: `catalogue-published.png`.

Limitazione della sessione: lo sfondo cartografico esterno Esri non si è caricato, anche provando Stradale; i layer dei luoghi e i contorni sono visibili. Le connessioni dirette di Node/Python a Supabase sono scadute: il controllo anonimo completo via shell non è dichiarato superato. Il caricamento anonimo nel browser e il confronto SQL dei dati attivi sono riusciti.

Il dataset locale e gli SQL di importazione conservano volutamente lo stato di staging `draft`; la pubblicazione avviene soltanto con `publish.sql`, dopo i controlli. La loro rigenerazione non costituisce una nuova verifica o pubblicazione remota.
