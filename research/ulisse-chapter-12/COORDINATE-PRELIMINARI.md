# Ulisse — episodio 12, coordinate: verifica preliminare

Aggiornamento: 9 novembre 2026. La verifica non è conclusa. Priorità: coordinate, quindi passi originali e traduzioni. La copia `research/ulisse-chapter-1/live-before.json` è una fotografia precedente, non prova lo stato corrente del database. La lettura integrale dell'episodio, il censimento e la verifica delle traduzioni sono ancora pendenti; non si dichiarano completati sulla base dei soli brani consultati.

## Coordinate dei tre luoghi d'azione nella copia storica

| Luogo geografico | Funzione narrativa | Coordinate nella copia | Lingue del passo nella copia | Stato/note |
| --- | --- | --- | --- | --- |
| Stoneybatter | Azione: il narratore incontra Joe | 53.350665, -6.281778, riferimento stradale approssimativo | 1 inglese, estratto generale | La fonte NIAH 50070188 riporta 314468, 234734 nella griglia irlandese: convertite da EPSG:29903 a WGS84 danno 53.350674, -6.281779. È il punto di un edificio al numero 11, datato 1905: serve solo come riferimento al tratto, non identifica il luogo esatto dell'incontro nel 1904. |
| Green Street Courthouse | Azione nel passo parodico del tribunale; il narratore e Joe passano anche sul retro | 53.349773, -6.270856 | Da verificare per l'associazione | La fonte NIAH 50070300 riporta 315188, 234653 nella griglia irlandese, pari a 53.349791, -6.271002 con trasformazione EPSG:29903 → WGS84. Differenza rispetto alla copia: circa 10 m; verificare quale punto dell'edificio indichino le due coordinate prima di modificarle. Il passaggio davanti/al retro non prova una scena interna ordinaria: distinguere la parodia dal racconto principale. |
| Barney Kiernan's | Azione: discussione tra Bloom e il Cittadino | 53.3491, -6.2707, approssimative | 1 inglese nella copia | La guida di Gunn, Hart e Beck indica 8–10 Little Britain Street. La coordinata è una ricostruzione del sito nella copia, non una misurazione verificata indipendentemente. Verificare la trasposizione sulla mappa prima di confermarla. |

## Fonti e prossimi controlli

- NIAH, [11 Stoneybatter](https://www.buildingsofireland.ie/buildings-search/building/50070188/centra-11-stoneybatter-dublin-7-dublin) e [Green Street Courthouse](https://www.buildingsofireland.ie/buildings-search/building/50070300/green-street-courthouse-green-street-halston-street-dublin-7-co-dublin): identificazioni e coordinate nella griglia irlandese; trasformazione con pyproj EPSG:29903 → EPSG:4326, ordine longitudine/latitudine invertito nella tabella.
- Gunn, Hart e Beck, [James Joyce's Dublin](https://www.riverrun.org.uk/JJD2.pdf), mappe 26–27 e pp. 69–71: identificazione del pub e del tribunale, percorso e precisione storica. La guida non certifica automaticamente le coordinate della copia.
- [Testo dell'episodio](https://www.owleyes.org/text/ulysses/read/episode-12-cyclops): sono stati consultati passi dell'inizio e del seguito, non certificata qui la rilettura integrale. Il narratore incontra Hynes su Stony Batter; passa con lui dietro il tribunale e i due entrano da Kiernan. La parodia descrive un procedimento nel tribunale di Green Street.
- [Scheda generale delle versioni](../ulisse/STATO-TRADUZIONI.md): edizioni e problemi di riuso. I passi del capitolo non sono ancora allineati alle tre traduzioni né pubblicati con questa verifica.

Restano da acquisire i dati correnti Supabase, completare la lettura e l'inventario dei luoghi geograficamente collocabili, controllare le coordinate una per una e i passi originali, poi le tre traduzioni. La connessione diretta a Supabase ha restituito errore DNS il 9 novembre; nessun dato del sito è stato modificato. Le altre menzioni e i luoghi esclusi non sono ancora censiti qui. I luoghi senza coordinate restano non prioritari per la selezione di citazioni, secondo l'indicazione dell'utente.

## Aggiornamento: riscontro del database pubblico

Il 9 novembre 2026 è stata acquisita una lettura delle tabelle pubbliche Supabase e ricostruito il romanzo con l'adattatore del sito. Per il capitolo 12 risultano ancora `stoney`, `green` e `kiernan` fra i luoghi dell'azione e 18 associazioni citate. La citazione generale inglese usa l'incontro di Stoneybatter; `kiernan` ha un passo inglese, ma non traduzioni; `green` non ha un passo specifico in `placeExcerpts`. I dati effettivamente mostrati dal sito e l'eventuale ripiego devono essere verificati separatamente. La presenza del testo nel database non certifica la correttezza di ogni trascrizione. Non sono stati modificati né il database né il sito.

È stata acquisita la [trascrizione della prima edizione, capitolo 12](https://en.wikisource.org/wiki/Ulysses_(1922)/Chapter_12), completa dall'incontro su Arbour Hill fino alla partenza di Bloom. È disponibile per la rilettura, che rimane pendente per le parti non ancora esaminate; l'acquisizione del testo non equivale alla lettura completa. La trascrizione Wikisource presenta possibili refusi: per ciascun estratto verificare anche la pagina della scansione prima di dichiararlo controllato.

Il precedente errore DNS era legato al percorso di rete diretto; la lettura pubblica è riuscita attraverso il collegamento disponibile il 9 novembre. Restano da controllare l'inventario completo dei luoghi e relative coordinate, le citazioni specifiche, le traduzioni, il riuso e la pubblicazione delle modifiche ai dati.
