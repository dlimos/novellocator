# Moby-Dick — traduzione di Cesare Pavese

Controllo del 14–15 ottobre 2026, in corso. Il testo integrale è disponibile: 135 capitoli ed epilogo, oltre a etimologia ed estratti iniziali. La corrispondenza delle citazioni viene controllata capitolo per capitolo, senza ricostruire il testo italiano dall'inglese.

Fonte: [scheda ufficiale Liber Liber](https://liberliber.it/autori/autori-m/herman-melville/moby-dick/). Il file ODT riproduce *Moby Dick, o, La balena*, traduzione riveduta e migliorata di Cesare Pavese, Torino, Frassinelli, 1963, settima ristampa identica alla precedente del 15 settembre 1959. La scheda attribuisce a Pavese la revisione autoriale pubblicata nel 1941. Pavese morì nel 1950: la traduzione storica è in pubblico dominio in Italia; questa constatazione non estende automaticamente lo stato dei diritti ad altri territori o ad apparati successivi.

La trascrizione digitale è accreditata a Catia Righi, con revisione di Paolo Alberti, e indicata dalla fonte con licenza CC BY-NC-SA 4.0. Il frontespizio ODT dichiara il 15 febbraio 2021, mentre la scheda web indica il 15 febbraio 2020: entrambe le indicazioni sono conservate, senza assumere che coincidano. Le citazioni identificano l'edizione cartacea, la digitalizzazione e il capitolo; gli URL consultati restano nei dati di analisi.

Le note sono escluse dal testo del romanzo. L'estrazione ODT conserva i testi dopo le note, gli spazi espliciti e i ritorni a capo; non incolla il contenuto delle note nelle frasi. `moby-dick-pavese-paragraphs.json` conserva i paragrafi numerati della fonte per il riscontro letterale.

## Copertura controllata

Esaminati tutti i **219 gruppi dei capitoli 1–41**: **206 citazioni italiane verificate**, di cui 200 per luoghi mappati/citati e sei per luoghi senza coordinate. **13 lacune** rimangono documentate. I capitoli 42–135 e l'epilogo devono ancora essere allineati: questo non è un controllo completo di tutte le 609 associazioni del romanzo.

Dodici lacune riguardano passi inglesi che i dati preesistenti ripetevano sotto un capitolo diverso da quello di provenienza. Non viene attribuita la traduzione del passo fuori sezione al nuovo capitolo. Un'altra lacuna riguarda Siracusa nel capitolo 41: Pavese scrive «fonte Aretusa della Sicilia», omettendo il nome della città; Sicilia non viene evidenziata come se fosse Siracusa. Gli originali sono conservati.

Sono documentate anche undici correzioni da azione a menzione, per descrizioni generali, itinerari suggeriti al lettore, notizie o riepiloghi che non dimostrano una scena nel luogo. Nomi tradotti o aggettivi autentici, come Bastione, Capo Allegro, Vigneto, islandese e londinese, sono registrati esplicitamente; non si sostituisce al luogo una persona o un oggetto generico.

Il registro locale `verified/moby-dick.json` conserva testo originale, passo italiano, traduttore, edizione, paragrafo, forme da evidenziare e motivazione narrativa. `moby-dick-alignment-review.json` copre tutti i 219 gruppi esaminati; `moby-dick-category-corrections.json` registra le undici riclassificazioni. Restano separati dai contenuti di presentazione.

La pubblicazione usa una transazione con confronto del riscontro originale e controllo dei conflitti: una traduzione diversa già presente interrompe l'intera operazione. Gli originali memorizzati nel vecchio campo `placeQuotes` vengono conservati identici e aggiunti al gruppo multilingue. Il test PostgreSQL/PGlite esegue due volte lo stesso SQL e confronta l'intera ricostruzione del libro, comprese le citazioni senza coordinate.
