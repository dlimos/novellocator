# Avanzamento editoriale e tecnico

28 ottobre 2026. Il romanzo non è stato importato né pubblicato nel catalogo.

## Lettura e inventario

L'originale è stato suddiviso in 72 unità locali con pagine e impronte SHA-256: preliminari editoriali, Prologo, 62 capitoli, appendici A–F, indici e mappe. Questa preparazione non è marcata come lettura completata. `reading-manifest.json` registra separatamente lettura, primo inventario e verifiche successive.

Sono stati letti integralmente il Prologo e i capitoli I.1–I.8. I preliminari editoriali sono stati consultati solo in parte: il relativo stato resta pendente. I capitoli successivi, le appendici e gli indici non sono dichiarati letti. Le sezioni lette conservano introduzioni narrative nelle quattro lingue, motivazioni individuali e riscontri originali.

| Sezione | Associazioni in prima analisi | action | mentioned |
| --- | ---: | ---: | ---: |
| Prologo | 62 | 5 | 57 |
| I.1 | 23 | 8 | 15 |
| I.2 | 31 | 10 | 21 |
| I.3 | 41 | 21 | 20 |
| I.4 | 24 | 12 | 12 |
| I.5 | 35 | 13 | 22 |
| I.6 | 23 | 17 | 6 |
| I.7 | 19 | 6 | 13 |
| I.8 | 28 | 13 | 15 |
| Totale | 286 | 105 | 181 |

Questi sono conteggi dell'analisi, non marker approvati o conteggi pubblici. Comprendono ambientazioni senza posizione utile e sei scene oniriche o visionarie escluse dalla futura vista geografica. L'inventario è un primo passaggio manuale, non una certificazione di completezza. La corrispondenza delle citazioni al testo non sostituisce la revisione narrativa e geografica delle decisioni.

Le distinzioni già registrate includono:

- Prologo: i movimenti storici delle popolazioni rimangono menzioni; l'episodio sviluppato del ritrovamento dell'Anello è un racconto intercalato con azione nei cunicoli, sul lago e sull'isola.
- I.1: la conversazione del Gaffer avviene all'Ivy Bush; le residenze e le voci sull'annegamento dei genitori di Frodo non diventano scene nei luoghi citati.
- I.2: le scene raccontate della pesca e della morte di Déagol sono distinte dalla conversazione a Bag End. Le notizie o ricostruzioni dubbie sui viaggi di Gollum rimangono menzioni.
- I.3: Woodhall è visto dall'accampamento, non visitato. Il ruscello del primo pernottamento non viene identificato automaticamente con lo Stock-brook del capitolo seguente. I due alberi e i diversi incontri lungo la strada restano topograficamente distinti.
- I.4: la visita alla fattoria e la traversata dello Stock-brook sono azione; il Golden Perch è espressamente evitato. L'arrivo alla corsia del traghetto è distinto dal traghettamento.
- I.5: solo qui è narrato l'attraversamento del Brandywine. Brandy Hall viene costeggiata; la riunione si svolge a Crickhollow. La torre e la foresta del sogno restano nell'analisi, senza coordinate e senza un'equivalenza inventata con luoghi descritti altrove.
- I.6: il tunnel nella siepe viene attraversato; la radura, il colle, il ruscello e il salice restano distinti. Il soccorso di Tom avviene nel bosco; il capitolo termina già sulla soglia della sua casa, senza anticipare le scene interne.
- I.7: la permanenza nella casa è verificata anche nelle pagine senza ripetizione del toponimo. Orto e giardino sono osservati dalle finestre. Le visioni notturne non diventano punti geografici; l'identificazione della torre vista da Frodo richiede confronto con il successivo racconto originale.
- I.8: la pietra singola del pasto non è la coppia attraversata nella nebbia, e quella coppia non è il vero varco settentrionale raggiunto dopo il soccorso. Carn Dûm indica l'origine degli aggressori nel ricordo di Merry, non il campo di battaglia. La strada viene raggiunta e percorsa; Bree e la locanda restano destinazioni prima dell'ingresso verificabile nel capitolo successivo.

`research/tolkien/private/` e `work/tolkien/analysis/` contengono le citazioni e i giudizi ancora da verificare; entrambe sono escluse da Git. I file pubblici conservano conteggi, metodo e stato. Non è stata aggiunta alcuna citazione del romanzo al sito o al repository pubblico.

`verify-analysis.py` verifica impronta del PDF, integrità delle unità lette, unicità degli identificativi nella sezione, categoria, intervallo di pagine e presenza letterale di ciascun riscontro dopo la sola normalizzazione degli spazi. Le dichiarazioni di lettura restano manuali; non sono dedotte dalle ricerche lessicali o dall'esito dello script. Evidenziazioni, posizioni e riuso dei singoli passi restano pendenti.

## Originale ed edizioni

Il testimone acquisito non viene presentato come testo aggiornato a ogni correzione successiva. Il controllo di tre punti segnalati da [Wayne G. Hammond e Christina Scull](https://www.hammondandscull.com/addenda/rings.html) mostra che conserva lezioni anteriori alle loro correzioni: nel Prologo, pagina stampata 8/PDF 32, e alle pagine stampate 367/PDF 391 e 373/PDF 397. Questo riscontro puntuale non è una collazione integrale; non sono state applicate correzioni silenziose alle citazioni. Le parti editoriali e l'indice sono accreditati separatamente agli autori indicati nel PDF.

`quotation-budget.json` misura il primo insieme locale per l'analisi critica: 286 associazioni, 270 estratti diversi, 2.549 parole contando le ripetizioni e 2.419 deduplicate; il passo più lungo di questo insieme ha 17 parole. Nessun numero è usato come soglia automatica di liceità. Restano da valutare necessità e proporzione di ogni passo e del complesso, insieme all'eventuale confronto con un testimone di accesso editoriale documentato. Non è ancora stato approvato alcun estratto per la pubblicazione. La ricerca preliminare delle traduzioni riutilizzabili in italiano, francese e spagnolo resta documentata nel README, con le lacune aperte.

## Modelli reali

[Il Tolkien Estate](https://www.tolkienestate.com/life/biography/) documenta Sarehole come ispirazione della Contea. [Birmingham Museums](https://www.birminghammuseums.org.uk/sarehole-mill/highlights/middle-earth) documenta anche i legami del mulino e del paesaggio con Tolkien. `geographical-models.json` conserva la relazione senza identificare l'Inghilterra con la Terra di Mezzo o la casa di Bilbo con un edificio reale.

L'indirizzo ufficiale di Sarehole Mill ha permesso di trovare il POI del museo. Sono stati scartati i primi risultati del geocoder per strade omonime, benché avessero punteggi più alti. Il punto è candidato per un riferimento d'ispirazione, non importato o pubblicato; precisione e condizioni della fonte geografica sono distinte dall'evidenza letteraria.

Le [annotazioni sulla mappa conservata dalla Bodleian, descritte da Exeter College](https://www.exeter.ox.ac.uk/tolkien-annotated-map-of-middle-earth-acquired-by-bodleian-library/) parlano di confronti di latitudine e distanze. Non provano da sole che Oxford sia Hobbiton o che Ravenna/Belgrado siano Minas Tirith. Nessuna di queste equivalenze è stata introdotta.

## Prototipo Web Map

`webmap-prototype.js` è un esperimento di ricerca isolato, non collegato ai loader di produzione. Carica una Web Map scelta esplicitamente, mantiene il WKT e accetta soltanto posizioni X/Y locali. Un elenco esplicito ammette i soli layer di contesto: gli itinerari del film vengono rimossi dalla vista. I marker della prova sono sintetici e non sono associazioni del romanzo.

Il controllo con SDK simulato copre numerazione indipendente, identità stabili, esclusione delle menzioni dall'inquadratura iniziale, inclusione dei layer visibili nel comando di inquadratura, conservazione della selezione quando il layer viene nascosto, dati invalidi, layer mancanti e smaltimento della vista.

La prova nel browser con ArcGIS 5.1 e la Web Map `16abf625a5704ebd90fff024e7d9c476` ha confermato:

- caricamento effettivo di rilievi, boschi, fiumi ed etichette;
- allineamento dei due controlli X/Y alle località di Hobbiton e Bree;
- etichette `1`, `2` e `C1`, con il controllo citato distante escluso dalla vista iniziale;
- comando esplicito che include anche `C1` nell'inquadratura;
- selezione del controllo 2 conservata dopo nascondi/mostra del layer action.

È stato corretto un errore di inizializzazione dei controlli UI nel SDK; lo script aggiornato è stato provato senza cache. Screenshot e pagina di prova restano in `work/tolkien/`, esclusa da Git. Non è stata redistribuita la cartografia. Test mobile, integrazione nelle schede del romanzo, accessibilità completa e tutti gli asset alle diverse scale restano da verificare.

## Diritti cartografici

La Web Map candidata non espone una licenza di riuso esplicita nei metadati verificati. La ricerca di alternative non ha ancora risolto la provenienza di tutti gli elementi:

- [ME-GIS](https://github.com/andrewheiss/ME-GIS) invita a chiedere il permesso per usare i dati; non è una licenza aperta generale.
- [Arda](https://github.com/bburns/Arda) dichiara MIT il progetto, ma segnala espressamente incertezza sui dati DEM originali e sui vettori. La licenza del codice non è stata estesa a questi dati.
- [Mapome](https://github.com/k1tesurfen/mapome) dichiara CC BY-SA 4.0 nel README, mentre [LICENSE.txt](https://github.com/k1tesurfen/mapome/blob/master/LICENSE.txt) contiene CC BY 4.0. Il README indica una mappa reperita su Reddit come base e avverte che alcune posizioni non sono state verificate. La discussione collegata rimanda a un'immagine su Imgur senza chiarire l'intera catena dei diritti. Non è stata adottata come cartografia con diritti risolti.

Nessuna richiesta è stata inviata a terzi. Il prototipo locale verifica il comportamento tecnico e non costituisce autorizzazione alla pubblicazione della mappa.

## Stato delle vedute e prossima lettura

Resta favorevole la valutazione preliminare di vedute di Minas Tirith, Fosso di Helm e Moria, per chiarire livelli, accessi e percorsi. I relativi capitoli non sono ancora stati analizzati in questa lettura: non sono state realizzate vedute o inventate disposizioni. Le immagini di catalogo dovranno essere quadri esistenti con fonte e riuso documentati; tema, filigrana e descrizioni quadrilingui restano da predisporre dopo la scelta editoriale.

La prossima unità da leggere è I.9, *At the Sign of the Prancing Pony*, da pagina PDF 173. Il lavoro non è concluso: restano 54 capitoli, sei appendici, il completamento dei preliminari e la verifica di indici/mappe, oltre alla riconciliazione critica e geografica e alla revisione dei diritti. Il solo avanzamento di ricerca è pronto per Git; nessun contenuto del nuovo romanzo è stato pubblicato in Supabase o sul sito.

## Ripresa locale

```powershell
python -X utf8 research/tolkien/prepare-corpus.py
python -X utf8 research/tolkien/verify-analysis.py
python -X utf8 research/tolkien/quotation-budget.py
node research/tolkien/check-webmap-prototype.cjs
```

Le dichiarazioni di lettura sono conservate da `prepare-corpus.py` solo se l'impronta della singola unità non cambia. Per ripetere la verifica narrativa servono i file locali ignorati; un clone Git conserva soltanto il metodo e i conteggi, non i riscontri integrali ancora in revisione.
