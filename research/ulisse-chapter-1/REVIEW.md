# Ulisse, I: Telemaco — verifica del 5–6 novembre 2026

**Aggiornamento 6 novembre:** le indicazioni «da aggiungere/verificare» nella tabella storica del 5 novembre sono superate, per gli undici riferimenti elencati nel supplemento in fondo, dalla loro verifica e pubblicazione. L'atlante pubblico ora mostra 2 luoghi d'azione e 13 luoghi citati. La revisione resta parziale per le dieci lacune geografiche e per le traduzioni, conservate anche nel database.

La lettura dell'intero episodio è stata svolta sulla trascrizione della prima edizione del 1922, dall'incipit fino a «Usurper»: https://en.wikisource.org/wiki/Ulysses_(1922)/Chapter_1 (versione indicata dalla pagina: oldid=11518819). La verifica riguarda esclusivamente l'episodio I. Non è una revisione integrale del romanzo. Sono state lette le istruzioni analisi-opere, citazioni e atlante.

## Dati attuali e interventi

La query nel SQL Editor di Supabase ha confermato cinque associazioni iniziali e sei estratti inglesi, senza traduzioni: torre e Forty Foot (`action`), Parigi, Atene e Inghilterra (`mentioned`), più il brano generale di sezione. Le descrizioni di posizione della torre e di Forty Foot erano già disponibili nelle quattro lingue.

Applicato `publish.sql` dal browser interno: aggiunte Dundrum e National Library of Ireland come menzioni; verificato il risultato della transazione (sette associazioni). Il nuovo punto di Dundrum è rappresentativo della località, non dell'inesistente scena del libro di Haines. La Biblioteca riusa il record geografico già esistente nel romanzo: l'intenzione di Haines non diventa una visita narrata.

Il brano della torre conserva il testo autentico, con evidenziazione dei riferimenti indiretti `parapet` e `gunrest`. Il brano di Forty Foot unisce due estratti distinti con omissione esplicita: destinazione e arrivo alla zona di balneazione. La prima edizione legge `birdlike cries`, diversamente da `birdsweet cries` nel testo Gutenberg precedentemente usato: non sono state mescolate le due versioni. Attribuzione dei quattro passi: James Joyce, Ulysses, Shakespeare and Company, Paris, 1922, Chapter I.

Applicato `position.sql`: Forty Foot passa da 53.28875, -6.1131 a 53.28944, -6.11361, riferimento approssimativo della zona di balneazione a nord della torre. La nuova coordinata è pubblicata in https://en.wikipedia.org/wiki/Forty_Foot ed è corroborata da https://www.byway.world/places/attractions/forty-foot-7c694a3a (53.28949, -6.11370). Il rapporto topografico con la torre è documentato dal piano comunale https://www.dlrcoco.ie/sites/default/files/2023-08/bullock_and_sandycove_harbours_masterplan_2020_1.pdf. Conservata la fonte precedente come fonte aggiuntiva; conservate coordinate precedenti e precisione nella metadata. Il riferimento non identifica un nuotatore.

Torre: mantenute 53.288656, -6.113632, coerenti con la posizione pubblicata in https://en.wikipedia.org/wiki/Martello_towers_in_the_Greater_Dublin_Area. Il museo conferma Sandycove Point (https://joycetower.ie/visit). Il servizio ArcGIS del registro DLR non ha restituito una risposta verificabile tramite lo strumento web: non si dichiara una nuova verifica diretta del centroide ufficiale.

Dundrum: 53.28972, -6.24417 da https://en.wikipedia.org/wiki/Dundrum,_Dublin. L'associazione alla località presso Dublino è corroborata dal riferimento alla Dun Emer Press nello studio https://books.openedition.org/puc/pdf/917. Non si è localizzato il passo presso una stamperia: il nome autentico è Dundrum.

## Lunghezza e riuso

| Passaggio visibile rivisto | Parole (conteggio spazi) | Valutazione |
| --- | ---: | --- |
| Torre | 55 | Scena autonoma, movimento e rasatura, riferimento indiretto autentico |
| Forty Foot | 80 | Destinazione e arrivo; omissione esplicita, senza continuità inventata |
| Dundrum | 39 | Intera battuta: spiega l'uso parodico del luogo |
| Biblioteca nazionale | 55 | Contesto della proposta, visita progettata e bagno preliminare |

Le regole non fissano un minimo o un massimo numerico: richiedono qualche riga comprensibile, contesto e proporzione. Totale dei quattro blocchi: 229 parole; testo inglese del 1922, senza apparati moderni. Finalità: discutere l'ambientazione e distinguere azione, destinazione e menzione. Non si aggiungono capitoli estesi o traduzioni editoriali non verificate. Gli estratti conservati per Parigi (16 parole), Atene (43) e Inghilterra (37) non sono tutti blocchi visibili: il filtro pubblico esclude queste menzioni. Non si allungano artificialmente gli estratti archivistici esclusi.

## Censimento dalla lettura integrale: lacune ancora aperte

Questo inventario documenta anche ciò che resta da completare; l'aggiunta di due menzioni non completa l'atlante dell'episodio.

| Riferimento originale / luogo | Categoria o decisione | Esito geografico/editoriale |
| --- | --- | --- |
| tower / Torre Martello | action | Verificata scena e pubblicato passo |
| fortyfoot hole, creek / Forty Foot | action | Verificata scena, pubblicati passo e nuova posizione |
| Sandycove milk | mentioned | Origine locale del latte; territorio già coperto da torre e zona costiera; da valutare eventuale associazione autonoma |
| Athens | mentioned | Viaggio proposto; esclusa dalla vista dalla policy di notorietà |
| Oxford | mentioned | Provenienza di Haines; Oxford città esclusa dalla policy; non equiparare automaticamente città e college |
| Dublin bay | mentioned | Panorama osservato dalla torre; da aggiungere con riferimento geografico della baia |
| harbour mouth of Kingstown | mentioned | La nave esce dal porto osservato a distanza; non scena dei protagonisti nel porto. Da localizzare l'imboccatura storica |
| the Ship | mentioned | Notizia della sera precedente e appuntamento futuro; non scena narrata nel pub. Indirizzo storico da verificare (5/6 Lower Abbey Street) |
| Dottyville with Conolly Norman | mentioned | Ricovero riferito; identificazione con Richmond District Asylum da verificare geograficamente, distinta dal Richmond Hospital |
| Magdalen / rooms of Clive Kempthorpe | mentioned, prudenziale | Scena immaginata di goliardia; il college è suggerito dall'affiliazione di Ades. Studio critico propone Magdalen ma la localizzazione non è provata dalla sola affiliazione; nessun punto per stanze |
| Bray Head | mentioned | Promontorio visto dalla torre; non confondere con l'omonimo a Valentia, Kerry. Coordinata del promontorio di Bray da completare |
| your house (Mulligan) | action, scena raccontata | Stephen racconta visita e battuta sulla madre. Edificio geografico non identificato con sicurezza; nessuna location per pianerottolo o salotto |
| Mater | mentioned | Pratica medica genericamente riferita; non scena specifica. Da documentare edificio ospedaliero storico |
| Richmond | mentioned | Pratica medica riferita; da distinguere l'ospedale chirurgico dall'asilo psichiatrico |
| Lalouette’s | mentioned | Impresa funebre come termine di confronto; indirizzo e identità da verificare |
| her house / casa della madre | action, ricordo | Sono narrati canto e visita al letto della madre. Posizione geografica non dimostrata qui; nessun punto arbitrario in città |
| Clongowes | mentioned, prudenziale | Breve ricordo dell'incenso; non si assume una scena sufficientemente sviluppata. Da verificare il collegio e la posizione |
| Paris; Latin quarter hat | mentioned | Parigi esclusa; cappello come allusione culturale, non prova di una scena nel Quartiere Latino |
| Dundrum | mentioned | Battuta sul libro di Haines: aggiunta con passo e coordinate rappresentative |
| school kip | mentioned | Impiego/pagamento e destinazione futura; non scena nella scuola nell'episodio. Associazione con il record Deasy da documentare attraverso continuità col II |
| national library | mentioned | Visita progettata: aggiunta al record esistente con passo originale |
| gulfstream | mentioned | Corrente oceanica: riferimento geografico reale; non assegnata coordinata arbitraria. Rappresentazione utile da verificare |
| Elsinore | mentioned | Confronto con Hamlet. Fonte ufficiale di Kronborg documenta il modello; richiede scheda che distingua modello e luogo letterario, con coordinate verificate |
| the Muglins | mentioned | Vela vista a distanza; non movimento dei protagonisti presso gli scogli. Posizione da verificare |
| Calvary; Olivet | mentioned | Allusioni geografiche religiose nella ballata; non scene dell'azione principale. Identificazione e precisione da trattare separatamente |
| Bullock harbour | mentioned | Destinazione attribuita alla barca vista dal promontorio; da verificare porto e coordinate |
| Westmeath | mentioned | Soggiorno del fratello e dei Bannon riferito, senza scena. Riferimento territoriale da verificare; nessun indirizzo dei Bannon inventato |
| the pier | mentioned, prudenziale | Incontro della sera precedente riferito; quale molo non è dimostrato dal passo, non assegnato a Kingstown automaticamente |
| Ireland; England; British state | mentioned | Riferimenti politici/geografici generali esclusi secondo la policy |

Non sono stati censiti autonomamente scale, parapetti, corridoi, camere o altri interni. `Loyola`, `Marcellus`, nomi di persone, etnonimi e aggettivi nazionali non diventano nuove location soltanto per l'etimologia; `omphalos` è metafora della torre già identificata. `Carlisle girl` non dimostra da solo un riferimento geografico alla città di Carlisle.

Confronti specialistici: Michael Groden, https://www.michaelgroden.com/notes/open01.html; studi e mappe https://italish.eu/ulisse-di-james-joyce-i-luoghi-i-telemaco-james-joyce-italishmagazinemap-02/; Ship e Dottyville https://jj21k.wordpress.com/2018/03/30/ulysses-pubs/ e https://jj21k.wordpress.com/2015/06/10/up-in-dottyville-with-conolly-norman/; Magdalen https://eprints.whiterose.ac.uk/id/eprint/218128/1/olh-16536-wells.pdf; modello di Elsinore https://kronborg.dk/en/knowledge/who-is-hamlet. I suggerimenti critici non sono prove automatiche della categoria narrativa.

## Ricerca delle traduzioni

| Lingua | Edizioni individuate | Stato degli estratti |
| --- | --- | --- |
| en | Originale, Shakespeare and Company 1922, Wikisource; confronto Gutenberg 4300 | Quattro passi verificati, pubblicati con evidenziazioni autentiche |
| it | De Angelis, Mondadori 1960; Celati; episodio I di Alberto Rossi, Il Convegno 1931 | Nessuna versione riutilizzabile verificata per i quattro passi; resta originale en |
| fr | Morel, Gilbert, Larbaud e Joyce, 1929; nuova traduzione collettiva Gallimard 2004 | Nessuna versione riutilizzabile verificata; resta originale en |
| es | Salas Subirat, Santiago Rueda 1945; Valverde 1976 | Nessuna versione riutilizzabile verificata; resta originale en |

Il pubblico dominio di Joyce non prova quello delle traduzioni. Per l'Italia la regola ordinaria è vita più settant'anni (artt. 25–26 L. 633/1941): https://www2.regione.sicilia.it/beniculturali/dirbenicult/normativa/normativanazionale/LEGGE22aprile1941-XIXn633.htm. De Angelis è morto nel 2000 secondo SIUSA (https://siusa-archivi.cultura.gov.it/cgi-bin/siusa/pagina.pl?Chiave=45244&RicLin=en&RicProgetto=personalita&RicSez=prodpersone&RicTipoScheda=pp&RicVM=indice&TipoPag=prodpersona). Gilbert è morto nel 1969 secondo BnF; la traduzione francese storica non è indicata di pubblico dominio dalla BNFA: https://www.bnfa.fr/livre?biblionumber=20082. La biografia di Salas Subirat edita da Penguin riporta necrologi del 1975: https://www.penguinlibros.com/cl/tematicas/145013-ebook-el-traductor-del-ulises-9789500756341/fragmento. Queste edizioni non sono state assunte liberamente riproducibili.

La ricerca non ha trovato una traduzione di pubblico dominio verificata dei quattro passi. Non si dichiara inesistente una tale traduzione: resta in particolare da reperire integralmente e controllare l'episodio di Rossi del 1931, attestato in https://joyceintranslation.com/DetailsTranslation?idBook=231&idBookN=0&idColl=0. Non sono stati assunti diritti dal semplice reperimento di PDF online. La verifica dei quattro corrispettivi nelle traduzioni protette e della proporzione cumulativa dell'intero romanzo non è completata; non sono state aggiunte nuove traduzioni sotto art. 70 per aggirare queste lacune.

## Verifiche

`npx tsx research/ulisse-chapter-1/check.ts`: esecuzione di SQL e vincoli in PGlite, ripetibilità del primo aggiornamento, ricostruzione dei quattro record, categorie e termini effettivamente presenti nei passi. Verifica pubblica dal browser interno: capitolo I mostra due luoghi d'azione e due luoghi citati, attribuzione 1922 e ripiego inglese dichiarato. La verifica delle menzioni ancora pendenti non è completata e non viene presentata come pubblicata.

## Supplemento del 6 novembre: undici nuove menzioni pubblicate

`continue.sql`, applicato dal SQL Editor nel browser interno, aggiunge esclusivamente associazioni `mentioned`, ciascuna con estratto originale, fonte geografica, motivazione narrativa e descrizione nelle quattro lingue. I testi completi, le coordinate, i metodi e i termini da evidenziare sono in `continue-records.json`.

| Riferimento | Fonte della posizione e precisione | Parole del passo |
| --- | --- | ---: |
| Baia di Dublino | https://en.wikipedia.org/wiki/Dublin_Bay, riferimento rappresentativo della baia | 68 |
| Bray Head | https://www.npws.ie/protected-sites/sac/000714, riferimento dell'area protetta sul promontorio del Wicklow, non della vetta | 47 |
| Clongowes | https://en.wikipedia.org/wiki/Clongowes_Wood_College, riferimento al campus; identità/indirizzo corroborati da https://www.isc.co.uk/schools/republic-of-ireland/co-kildare/clane/clongowes-wood-college-sj/ | 53 |
| Muglins | https://www.irishlights.ie/tourism/our-lighthouses/muglins.aspx, posizione del segnale sugli scogli, non della vela; nel 1904 il segnale non era ancora luminoso | 42 |
| Bullock Harbour | https://en.wikipedia.org/wiki/Bullock_Harbour e piano comunale già citato, riferimento al bacino portuale | 53 |
| Westmeath | https://www.geonames.org/2960972/county-westmeath.html, riferimento alla contea; non un indirizzo dei Bannon | 38 |
| Mater | https://hospitalsdatabase.lshtm.ac.uk/hospital.php?hospno=975, riferimento storico al sito su Eccles Street; non al moderno Mater Private | 51 |
| Dottyville | https://en.wikipedia.org/wiki/St._Brendan%27s_Hospital,_Dublin, riferimento al sito dell'asilo; identità documentata da https://www.dib.ie/biography/norman-conolly-a6233 | 31 |
| Elsinore | https://whc.unesco.org/en/list/696, coordinate di Kronborg, esplicitamente un modello del castello letterario; rapporto documentato dal museo https://kronborg.dk/en/knowledge/who-is-hamlet | 32 |
| Imboccatura del porto di Kingstown | https://www.irishlights.ie/media/12547/gla-aton-review-2010-15.pdf, riferimento fisso al faro sul lato orientale dell'ingresso, non posizione del piroscafo; identità storica https://www.dublinportarchive.com/collection/dun-laoghaire-harbour/ | 47 |
| Magdalen | https://en.wikipedia.org/wiki/Magdalen_College,_Oxford, riferimento al collegio; il testo nomina l'affiliazione di Ades ma non prova che gli alloggi di Kempthorpe siano nel collegio: categoria prudenziale `mentioned` | 84 |

Totale nuovo lotto: 546 parole; totale dei 15 blocchi visibili verificati: 775 parole, dall'originale inglese del 1922. La selezione conserva passi comprensibili e proporzionati alla singola funzione geografica, senza imporre un numero meccanico di righe. Le lunghezze da 31 a 84 parole sono valutate sul senso del passo, non sul numero di righe sul dispositivo. Le descrizioni spiegano ciò che le citazioni da sole non dimostrano, per esempio il rapporto con il modello Kronborg o la precisione territoriale di Westmeath.

La Biblioteca nazionale aveva una descrizione globale che richiamava impropriamente la discussione shakespeariana dell'episodio IX anche nella scheda dell'episodio I. È stata sostituita nelle quattro lingue con una descrizione geografica del palazzo su Kildare Street, accanto a Leinster House. Fonti: https://www.nli.ie/visit/getting-here e https://www.nli.ie/about-us/our-history. Il passo del capitolo I continua a documentare la visita progettata da Haines.

`labels.sql` aggiunge nomi geografici tradotti IT/FR/ES per baia, porto, modello, asilo e Biblioteca, senza sostituire traduzioni preesistenti. Questi sono testi redazionali dell'atlante, non traduzioni del romanzo.

Verifiche locali: SQL in PGlite con vincoli e ricostruzione, ripetibilità dell'intero lotto, 15 associazioni visibili attese, categoria e grassetto pertinenti, descrizioni IT/EN/FR/ES. Verifiche pubbliche nel browser interno: tutti gli undici nuovi passi più la Biblioteca hanno citazione e grassetto; nessun collegamento al testo del romanzo nelle schede; tutte le 33 descrizioni nuove nelle tre lingue non originali sono state confrontate con i dati pubblicati (`public-checks.json`, `locale-checks.json`). La tendina resta disabilitata sull'inglese quando è la sola versione autentica verificata.

## Lacune residue e ricerche con esito incompleto

Sono registrate in `gaps.json` e in `books.metadata.chapterOneReview` con stato `partial`, riscontri originali e motivazioni. Dopo l’aggiornamento degli indirizzi descritto sotto restano otto riferimenti: identificazione del Richmond accanto al Mater, le due case ricordate, la scuola richiamata indirettamente, il molo non identificato, una geometria utile della Corrente del Golfo, Calvary e Olivet. Non sono posizioni dichiarate completate, né nuovi punti arbitrari.

Ship: l'indirizzo storico 5 Lower Abbey Street è corroborato da https://www.riverrun.org.uk/JJD2_Small.pdf e https://www.irishgenealogy.ie/2016-family-history/learning-resources/sean-mac-diarmada.html. Lalouette: Thom's 1904 riporta 68 Marlborough Street (https://conor-mccabe.com/wp-content/uploads/2023/01/thoms-1904-street-directory.pdf). Le prime richieste di geocodifica non avevano restituito un risultato verificabile; i due casi sono stati successivamente risolti con il confronto delle fonti descritto sotto. Una ricerca senza risultato non prova l’assenza del luogo.

Richmond: la precedente ipotesi di ospedale chirurgico richiede verifica; le annotazioni di Gifford reperite tramite ricerca propongono anche l'asilo. Non è stato creato un secondo punto su quella sola ipotesi. Dottyville, invece, è documentato indipendentemente dalla biografia di Norman.

Sandycove è già rappresentata dalla torre e dal luogo di balneazione; la menzione dell'origine del latte resta nell'inventario senza duplicare il territorio. Oxford come città famosa resta esclusa dalla vista; il collegio esplicitamente nominato Magdalen è un riferimento distinto. Le tre associazioni escluse già archiviate (Parigi, Atene, Inghilterra) sono conservate.

Traduzioni: la ricerca aggiuntiva ha trovato la copia dell'episodio di Rossi nel catalogo del Museo Joyce di Trieste (https://museojoycetrieste.it/en/online-catalogue/), mentre la cronologia dello stesso museo parla di traduzione di una parte dell'episodio (https://museojoycetrieste.it/en/james-joyce-and-trieste/chronology/). Estensione effettiva, corrispondenze e diritti restano non verificati: non si dichiara l'episodio integralmente disponibile e riutilizzabile. Le ricerche biografiche non hanno identificato con sicurezza le date del traduttore Alberto Rossi; sono stati esclusi gli omonimi pittore e autore contemporaneo. Il ripiego sull'originale resta esplicito per tutti i passi e non equivale a copertura quadrilingue delle citazioni.


## Supplemento del 6 novembre: The Ship e Lalouette’s

`addresses.sql` aggiunge due associazioni `mentioned` nell’episodio I, con originali autentici del 1922, evidenziazioni e attribuzione. Le schede complete e le descrizioni redazionali IT/EN/FR/ES sono in `addresses-records.json`. Non viene inventata una scena presso i due esercizi: The Ship è un appuntamento futuro proposto mentre Stephen lascia il luogo di balneazione; Lalouette’s è il termine di un paragone usato da Mulligan parlando del lutto di Stephen.

- **The Ship: 53.348670, −6.258728.** L’indirizzo storico è 5 Lower Abbey Street, documentato nella guida di Gunn, Hart e Beck, *James Joyce’s Dublin* (https://www.riverrun.org.uk/JJD2_Small.pdf, mappa 12, p. PDF 44), e da Irish Genealogy (https://www.irishgenealogy.ie/2016-family-history/learning-resources/sean-mac-diarmada.html). La coordinata pubblicata del civico moderno è 53.3486704, −6.2587275: https://ie.near-place.com/ladbrokes-5-lower-abbey-street-dublin. Il civico è corroborato dal registro Revenue: https://www.revenue.ie/en/corporate/documents/statistics/excise/register-of-bookmaking-offices.pdf. La mappa topografica è stata letta e confrontata con la posizione. Il riferimento individua approssimativamente il sito storico attraverso il civico attuale; non certifica la sopravvivenza o l’impronta esatta della taverna originaria.
- **Lalouette’s: 53.352058, −6.259480.** Il 68 di Marlborough Street è attestato nella guida topografica (voce 311, p. PDF 135), in Thom’s 1904 (https://conor-mccabe.com/wp-content/uploads/2023/01/thoms-1904-street-directory.pdf) e nell’inserzione coeva riprodotta in https://james-joyce.ru/ulysses/LastPink.pdf. Il registro comunale 2005–2011 assegna esplicitamente il civico 68 al Dublin College of Catering (voce 5119, p. PDF 126: https://www.dublincity.ie/sites/default/files/2026-01/volume-3.pdf). Il successivo complesso è identificato da NIAH 50010236, costruito nel 1938–39: https://www.buildingsofireland.ie/buildings-search/building/50010236/school-of-culinary-arts-and-food-technology-66-74-cathal-brugha-street-marlborough-street-dublin-1-dublin. L’accesso diretto a questa pagina ha restituito 403; i metadati descrittivi indicizzati sono stati consultati. Il CSV del registro comunale corrente, voce 1331, colloca il complesso «Cathal Brugha Street/ 66-72 Marlborough Street» in Irish Grid E315949.03 N234923.958. La conversione EPSG:29903 → EPSG:4326 con pyproj dà 53.3520579375438, −6.259480078764796. La procedura è riproducibile con `check-address-coordinate.py`, riscontro in `address-coordinate-check.json`. È un riferimento all’area del complesso che comprende il sito storico; non è una coordinata misurata dell’ingresso o dell’edificio scomparso al civico 68. La descrizione pubblica chiarisce il rapporto con il college successivo.

Fonte CSV comunale: https://data.smartdublin.ie/dataset/f1dd00f0-5914-4b97-b66e-0dbb4bcb510c/resource/f0288278-32e4-4117-803e-9ac10b83a882/download/251218-rps-master-2022-2028_for-gis.csv. Non è stata usata la geometria del GeoJSON parallelo: per la voce 1331 riporta −11.867938, 48.804406, incompatibile con Dublino, mentre gli attributi Irish Grid del CSV sono coerenti. Non sono stati usati come civico esatto i risultati Nominatim riferiti a soli segmenti della via.

I nuovi passaggi hanno rispettivamente 46 e 40 parole, tratte da sequenze contigue e verificate del capitolo I (https://en.wikisource.org/wiki/Ulysses_(1922)/Chapter_1). Il primo conserva il saluto, l’appuntamento e la risposta; il secondo conserva il paragone e il riferimento alla madre che ne chiarisce il senso. Non sono toponimi isolati. L’estensione è proporzionata alla discussione del luogo; i nomi sono evidenziati nelle forme autentiche «The Ship» e «Lalouette’s». Le 86 parole aggiunte portano a 861 parole i 17 blocchi visibili del capitolo, contando separatamente gli estratti ripetuti. Si usa soltanto l’originale del 1922 già verificato, con attribuzione e lingua dichiarata. Restano valide le ricerche e le lacune IT/FR/ES registrate sopra; non si dichiara completata la traduzione delle citazioni.

`books.metadata.chapterOneReview` viene aggiornato conservando gli altri campi: le due voci passano da pendenti a pubblicate, restano otto lacune, stato `partial`. L’inventario locale `gaps.json` è allineato. Controlli locali completati: SQL e vincoli in PGlite, ripetibilità, coordinate ricostruite, categorie, estratti, grassetti e descrizioni in quattro lingue, rimozione delle sole due lacune risolte; controllo separato della trasformazione del CSV.

Nel controllo pubblico è emersa una traduzione di dizionario preesistente che rendeva il nome proprio «The Ship» come «La nave». L’aggiornamento conserva entrambi i nomi commerciali nella forma autentica in IT/FR/ES; non cambia né traduce i passi del romanzo.

Verifica pubblica del 7 novembre nel browser interno: due luoghi dell’azione e quindici luoghi citati nel capitolo I. Le otto combinazioni scheda–lingua vengono confrontate con descrizione, citazione autentica, grassetto, attribuzione 1922, selettore della citazione disabilitato sull’originale e coordinate del collegamento Street View; esiti in `address-public-checks.json`. Le traduzioni mancanti dei passi restano registrate separatamente.
