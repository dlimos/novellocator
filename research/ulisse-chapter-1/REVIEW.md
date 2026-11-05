# Ulisse, I: Telemaco — verifica del 5 novembre 2026

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
