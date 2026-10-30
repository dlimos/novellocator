# Il Signore degli Anelli: fattibilità e originale inglese

Ricerca avviata il 27 ottobre, aggiornata al 31 ottobre 2026. Lettura integrale e prima analisi terminate; revisione editoriale in corso, opera non importata.

## Esito

Un atlante della Terra di Mezzo è tecnicamente realizzabile. La candidata più utile è la Web Map `16abf625a5704ebd90fff024e7d9c476`, con cartografia e itinerari separati. L'applicazione pubblica si carica nel browser senza login; i servizi REST interrogati sono accessibili anonimamente. Non è stata trovata una licenza esplicita che autorizzi il nostro riuso. L'accessibilità tecnica non chiude la verifica dei diritti.

Sono stati scaricati e controllati tre PDF inglesi con testo estraibile senza OCR. Il volume unico è il candidato principale: 1.210 pagine PDF, tutti i 62 inizi di capitolo nella sequenza attesa, prologo e appendici A–F presenti. Alla verifica strutturale iniziale sono seguiti la lettura integrale e il primo inventario documentati in [PROGRESS.md](PROGRESS.md). La collazione critica completa resta pendente.

## Cartografia ArcGIS

### Candidata principale: One Map To Track Them All

- StoryMap: https://storymaps.arcgis.com/stories/096c1500ab154071a40aa2089d38d091
- Autrici: Myrto-Panagiota Bouloukou e Vanessa Henkes; progetto del master internazionale in Cartography, semestre alla TU München.
- Scheda del progetto e metodo: https://cartographymaster.eu/studentwork/mp22_group5/
- Instant App: https://tu-muenchen.maps.arcgis.com/apps/instant/basic/index.html?appid=4c25857601c34f9f9beb6cfd49694a86
- Web Map: https://www.arcgis.com/home/item.html?id=16abf625a5704ebd90fff024e7d9c476
- Titolo tecnico: `Middle_Earth_final`; accesso `public`.
- La configurazione dell'Instant App indica `values.webmap=16abf625a5704ebd90fff024e7d9c476`. Il campo `source` dell'app identifica un modello applicativo, non la mappa.
- Cartografia composta da DEM, foreste, curve di livello, Anduin, regioni e località. Itinerari e popup riguardano il primo film: non usarli come inventario o prove del romanzo.
- Interrogazioni anonime riuscite: località 12 record, regioni 4, foreste 3; itinerari Aragorn 3, Boromir 132, Fellowship 3, Gandalf 5, Gimli 4, Hobbits 131, Legolas 5. Sono conteggi tecnici, non conteggi di luoghi narrativi verificati.
- Riferimento spaziale: WKT Transverse Mercator, denominato `UTM_Zone_31_Northern_Hemisphere`. È un supporto tecnico applicato al mondo inventato. Esempio di posizione restituita per Hobbiton: X=2496.462399999611, Y=-4753.021299999207; non sono longitudine e latitudine reali e non dimostrano una scala narrativa attendibile.
- Conferma visiva nell'Instant App: rilievi, etichette di Hobbiton, Rivendell, Moria e altre località, e percorso fino a Parth Galen renderizzati. Non è una prova di integrazione nel nostro sito né del funzionamento futuro di tutti gli asset a ogni scala.
- `licenseInfo` e `accessInformation` della Web Map sono null; i metadati dei layer interrogati non forniscono una licenza esplicita. Anche i due elementi vettoriali Contour_DEM_tile e river_tile sono pubblici ma con campi di licenza vuoti. La dichiarazione delle autrici sul proprio uso dei materiali non autorizza automaticamente quello di NovelLocator. Verificare provenienza del DEM, simboli, dati e immagini ed eventualmente ottenere i permessi necessari.

### Alternativa: Exploring Middle Earth

- StoryMap: https://storymaps.arcgis.com/stories/b53467423da6430a88fc619e789f3ab6
- Autrice indicata: Sara Lynnore; progetto dichiarato incompleto.
- Web Map: https://www.arcgis.com/home/item.html?id=d1639e2fc51748c29de2849832bb53db
- Titolo: `Middle Earth`; accesso `public`; licenza e attribuzione vuote.
- È un `MediaLayer` con immagine 3200 × 2400, georeferenziata su un canvas Web Mercator (`wkid=102100`, `latestWkid=3857`), accompagnato da una base vettoriale nera. Non è un servizio vettoriale completo della Terra di Mezzo. Il tour contiene ulteriori contenuti nella StoryMap.
- I crediti citano una fotografia Flickr con CC BY-NC-SA e altri materiali eterogenei. Una licenza della fotografia non risolve da sola i diritti dell'opera cartografica ripresa. Verifica del file sorgente e dell'intera catena dei diritti pendente.

## Compatibilità con NovelLocator

Il database contiene già `book_maps`, `section_maps`, `map_layers` e `place_positions` (migrazione 003). Una configurazione appropriata sarebbe `world_type=fictional`, `renderer=webmap`, `coordinate_space=cartesian`, con il riferimento spaziale completo conservato in `spatial_reference`. Le posizioni interne si registrano in X/Y e non nelle colonne geografiche terrestri.

Il visualizzatore geografico corrente in `docs/app.js` costruisce marker WGS84. `scripts/database/content.ts` rifiuta luoghi senza latitudine/longitudine; non basta quindi inserire un `portal_item_id`. Esiste già `docs/fictional-map.js` per immagini e punti in pixel, ma non è un caricatore generico di Web Map esterne.

Servono un percorso dati dedicato alle mappe fantasy e un controller che carichi la Web Map nel suo riferimento spaziale, conservando solo il contesto cartografico autorizzato e sovrapponendo marker editoriali nostri. Occorre gestire selezione per identità, capitoli, azione/menzione, numerazioni indipendenti, inquadratura iniziale sui luoghi dell'azione, errori dei servizi e attribuzioni. Street View e altre basi terrestri non sono pertinenti a queste posizioni.

Prima della pubblicazione: prototipo locale con marker sintetici, prova di allineamento a più zoom, compatibilità del WKT nel SDK corrente, navigazione e layer su desktop/mobile, quindi controllo dei diritti. Il prototipo locale è stato realizzato e provato con ArcGIS 5.1, comprese selezione, categorie, numerazione e inquadratura; risultati e limiti sono in [PROGRESS.md](PROGRESS.md). Integrazione nel sito, mobile e accessibilità restano da completare. Il prototipo non modifica il codice applicativo o Supabase.

## PDF inglesi senza necessità di OCR

I file e il testo estratto sono conservati esclusivamente in `work/tolkien/`, già esclusa da Git. Nessun testo completo, immagine del libro o link diretto al testo è stato aggiunto alle schede pubbliche, alle esportazioni o al catalogo. Gli URL consultati sono registrati qui per documentazione della ricerca, come previsto dalle regole editoriali.

| Candidato | Pagine PDF | Pagine con testo | Caratteri estratti | Identificazione interna |
| --- | ---: | ---: | ---: | --- |
| Volume unico | 1210 | 1199 | 3050024 | HarperCollins 2005; eBook Adobe Acrobat maggio 2009, ISBN 9780061917806 |
| The Two Towers | 461 | 455 | 833801 | HarperCollins; ISBN 9780061917929 |
| The Return of the King | 620 | 606 | 1149090 | HarperCollins; ISBN 9780061917868 |

Fonti dei candidati, accessibili al controllo ma con autorizzazione alla distribuzione non verificata:

- Volume unico: https://go2train.co/wp-content/uploads/2025/11/The-Lord-of-the-Rings-by-J.R.R.-Tolkien.pdf
- Seconda parte: https://rsd2-alert-durden-reading-room.weebly.com/uploads/6/7/1/6/6716949/02-the-two-towers.pdf
- Terza parte: https://rsd2-alert-durden-reading-room.weebly.com/uploads/6/7/1/6/6716949/03-the-return-of-the-king.pdf

Il volume unico dichiara di basarsi sulla composizione del 2002, revisione di quella del 1994. Il controllo automatico rileva 12, 10, 11, 10, 10 e 9 inizi di capitolo nei sei libri. Prologo a pagina PDF 25; appendici A=1057, B=1106, C=1123, D=1130, E=1137, F=1151; fine della narrazione a pagina PDF 1055. I numeri sono le pagine del file, non la paginazione stampata. Non importare l'epilogo scartato da Tolkien come se appartenesse a questa edizione: eventuali testi postumi richiedono una fonte distinta.

L'estrazione con pypdf è riuscita per tutte le pagine, senza cifratura e senza caratteri Unicode di sostituzione. Restano legature tipografiche e intestazioni spaziate: conservare il testo grezzo per i riscontri e usare eventualmente una copia normalizzata NFKC per la ricerca. L'assenza del carattere di sostituzione non prova da sola l'assenza di refusi.

Le pagine prive di testo non rendono necessario l'OCR della narrazione. Il controllo visivo delle pagine PDF 329 e 1124 conferma rispettivamente un disegno delle porte di Moria e una tavola genealogica: i contenuti figurativi richiedono lettura manuale e non devono essere ignorati nell'analisi. Non si afferma che ogni tabella e scritta nelle immagini sia estraibile. Nessun OCR è stato eseguito.

Per un accesso editoriale o bibliotecario documentato sono state individuate l'edizione HarperCollins in inglese ISBN 9780007322596, disponibile in EPUB/OverDrive Read presso The Libraries Consortium, e un'edizione integrale illustrata del 2021. L'accesso al testo integrale tramite prestito richiede una biblioteca abilitata; non è stato effettuato login o acquisto. Le schede di catalogo non equivalgono all'accesso già ottenuto al contenuto completo:

- https://llc.overdrive.com/tlc/content/media/235103
- https://www.overdrive.com/media/6243450/the-lord-of-the-rings
- https://www.perlego.com/book/2970755/the-lord-of-the-rings-pdf — catalogo di edizione digitale, non PDF scaricabile verificato in questa sessione.

## Traduzioni e riuso dei passi: ricerca preliminare

Ricerche effettuate in italiano, francese e spagnolo con titolo, traduzione e pubblico dominio/domaine public/dominio público, più ricerca nei risultati di Gutenberg e Liber Liber. Non è stata reperita una traduzione integrale con pubblico dominio o licenza di riuso verificati per la pubblicazione dall'Italia. È un esito negativo della ricerca svolta, non una dichiarazione di inesistenza.

- Italiano: Bompiani conferma Ottavio Fatica nella scheda ISBN 9788830105263; AIST documenta anche la traduzione Alliata e le revisioni. Edizioni, apparati, testo completo e diritti dei singoli passi restano da verificare separatamente. https://www.bompiani.it/catalogo/la-compagnia-dellanello-9788830105263 e https://www.jrrtolkien.it/jrr-tolkien/opere/
- Francese: Christian Bourgois conferma Daniel Lauzon nell'integrale 2023, ISBN 9782267050356. BNFA indica esplicitamente che la versione Lauzon del primo volume non è di pubblico dominio. Non è stato ottenuto il testo tramite questi servizi. https://bourgoisediteur.fr/le-seigneur-des-anneaux-integrale/ e https://www.bnfa.fr/livre?biblionumber=32941
- Spagnolo: Planeta registra Matilde Horne, Luis Domènech e Rubén Masera per l'edizione ISBN 9788445003022. Disponibilità editoriale verificata, diritti di riuso dei passi non accertati. https://www.planetadelibros.com/libro-el-senor-de-los-anillos/209563
- Inglese: lingua originale; la reperibilità di un PDF non dimostra il pubblico dominio o l'autorizzazione del sito ospitante. Le indicazioni del Tolkien Estate indirizzano le richieste sui passi pubblicati a HarperCollins: https://www.tolkienestate.com/frequently-asked-questions-and-links/

L'eventuale pubblicazione delle citazioni richiede una valutazione documentata per singolo passo e per il totale degli estratti secondo l'art. 70, distinguendo originale e traduzioni. Non è sufficiente che il passo sia breve o attribuito. Fonte normativa indicata dalle regole del progetto: https://www.bandistapp.it/norma/l-1941-633/art-70. Nessuna citazione è stata autorizzata o pubblicata da questa verifica.

## Vedute e analisi ancora pendenti

Le vedute sarebbero utili per Minas Tirith, il Fosso di Helm e Moria, perché la disposizione di porte, livelli, accessi e percorsi può aiutare la lettura. Questa è una valutazione preliminare, non una ricostruzione verificata. I capitoli pertinenti sono stati letti integralmente; restano da separare le scelte interpretative e da verificare i diritti delle fonti figurative. Nessuna veduta è stata realizzata.

Aggiornamento del 31 ottobre: letta tutta l’edizione, compresi Prologo, 62 capitoli, sei appendici, preliminari, indici, tavole, mappe e colophon. Le 70 unità con testo analizzato hanno introduzioni in quattro lingue e 3.313 associazioni in prima analisi: 2.899 nel Prologo/capitoli, 404 nelle appendici e 10 riferimenti editoriali o autobiografici esclusi dai marker. Indici e mappe sono controlli di riferimento. I riscontri restano privati; sono pubblicati conteggi, metodo e impronte. Sono documentati 90 confronti puntuali, senza dichiarare conclusa la revisione di ogni associazione. Restano ricorrenze, alias, collazione, verifica geografica e diritti; il romanzo non è stato importato nel catalogo o nel database. Le vedute sono valutate in [PROGRESS.md](PROGRESS.md), ma non realizzate.

Prima riconciliazione: [place-identity-review.json](place-identity-review.json) registra 14 gruppi di alias, 233 associazioni annotate e cinque distinzioni da conservare. Sono state corrette due chiavi del Campo di Celebrant e recuperata la scena raccontata dell’arresto di Lobelia in VI.8. Il resto dell’inventario mantiene lo stato di revisione pendente.

## Riscontri riproducibili

- `*.metadata.json`: campi dei metadati pubblici degli elementi ArcGIS.
- `*.webmap.json`: configurazione tecnica selezionata; popup, simbologie e immagini omessi.
- `arcgis-service-audit.json`: risposte sintetiche delle interrogazioni anonime.
- `audit-arcgis.ps1`: ripete i controlli REST sui servizi URL degli snapshot; non verifica tutti gli asset secondari o le tessere.
- `pdf-text-audit.json`: impronte SHA-256, metadati, conteggi e presenza delle intestazioni; il campo OCR resta nullo nel controllo puramente automatico. La valutazione della narrazione è esplicitata in `structure-audit.json` dopo il controllo delle sezioni e delle figure campione.
- `check-pdf-text.py`: estrae il testo dei file locali in `work/tolkien/` e genera il rapporto senza salvare prose nel repository.
- `check-structure.py`: verifica gli inizi dei capitoli e produce campioni visivi locali tramite pypdfium2, se disponibile.
- `apparatus-review.json`: metodo di lettura degli apparati, controlli visivi e pagine supplementari, senza testo o immagini del romanzo.
- `check-analysis-validation.py`: con il corpus locale disponibile, controlla il rifiuto di testo estraneo alla fonte e, se presenti riscontri visivi, di un'impronta errata dell'immagine; nessun rifiuto deve sostituire gli output verificati. Non distribuisce o stampa citazioni del romanzo.

La fattibilità tecnica è favorevole; la pubblicazione dell'atlante dipende ancora da diritti cartografici, integrazione e analisi dell'opera. È pronta soltanto la documentazione di ricerca.
