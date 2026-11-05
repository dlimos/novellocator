# Guerra e pace — Libro primo: verifica di nuove location (5 novembre 2026)

## Stato

**Ricognizione preliminare, non importazione nel database.** I contenuti pubblici del romanzo sono letti da Supabase; `docs/data/` e `tests/fixtures/` sono esclusi da Git. Questa verifica non ha accesso in scrittura al database né ai dataset locali e pertanto non certifica l'assenza di ciascun record. Non pubblicare coordinate o nuove associazioni se non confrontate con le schede attuali e con una citazione russa originale della stessa sezione.

## Candidati e decisioni

| Luogo narrativo | Scena | Collocazione proposta | Esito |
| --- | --- | --- | --- |
| Casa del conte Kirill Bezuchov, padre di Pierre | Visite al conte morente, testamento e morte nel Libro primo | Mosca. Numerosi edifici sono indicati come possibili modelli, ma nessuno è univoco | **Pendente, senza coordinate.** Non scegliere arbitrariamente un modello |
| Casa dei Rostov | Ricevimento e onomastico nella casa di via Povarskaja, Libro primo | Modello tradizionalmente identificato con la tenuta Bode-Kolychev/Sollogub, via Povarskaja 52/55, Mosca | **Modello documentato, controllare duplicati** nell'atlante; distinguere «modello» da «identità narrativa». Riscontro russo necessario |
| Salotto/casa di Anna Pavlovna Scherer | Ricevimento iniziale a Pietroburgo | San Pietroburgo; nessun edificio o indirizzo verificato | **Non geocodificare come edificio** usando un monumento qualsiasi |
| Residenza di Anatole Kuragin | Ritrovo di Pierre, Anatole e Dolohov | San Pietroburgo; indirizzo non documentato | **Pendente**, senza punto edilizio |

## Esito della verifica sulle fonti esterne

- La casa dei Rostov ha un riscontro testuale esplicito sulla via Povarskaja, oltre a una tradizione di identificazione del modello reale con il n. 52/55. Il modello non equivale automaticamente a un indirizzo della casa romanzesca.
- Per il palazzo di Bezuchov, lo storico Alexander Vaskin segnala candidati **alternativi**: tenuta Razumovskij, via Kazakova 18; tenuta Tutolmin, Gončarnaja 12; palazzo Slobodskoj, 2-ja Baumanskaja 5. Un'altra attribuzione cita Znamenska 12 e altre fonti suggeriscono l'English Club su Tverskaja. La molteplicità delle ipotesi impedisce di concludere che uno sia il modello verificato.
- Le numerazioni dei capitoli differiscono fra edizioni e strutture dei libri; allineare le scene alla suddivisione originale del database prima di creare riferimenti.

## Fonti

- https://www.ng.ru/subject/2021-05-26/9_1079_tolstoy.html — pluralità dei candidati per casa Bezuchov.
- https://www.litres.ru/book/a-a-vaskin/lev-v-moskve-tolstovskie-mesta-stolicy-65473467/chitat-onlayn/ — testo dello studio di A. Vaskin.
- https://www.timeout.ru/msk/feature/moskva-rozhdestvenskaya-prazdnichnyj-gorod-v-proizvedeniyah-klassikov — casa dei Rostov e incertezza su casa Bezuchov.
- https://www.gw2ru.com/history/2515-moscow-photos-leo-tolstoy — modello storico del palazzo dei Rostov.
- https://www.gutenberg.org/ebooks/2600 — traduzione Maude, utile alla ricerca ma non sostitutiva dell'originale russo.

## Prossima verifica necessaria per pubblicazione

1. Leggere i record pubblicati di `places`, `place_descriptions`, `place_references`, `sections`, `excerpts` relativi a `war-and-peace`.
2. Confrontare gli alias e le coordinate: non duplicare casa dei Rostov né Mosca.
3. Verificare nel russo originale la scena di ogni capitolo pertinente, conservando citazione autentica, fonte e categoria.
4. Aggiungere al database **solo** location non già esistenti e con modello reale univocamente documentato, posizione verificata e precisione esplicita; verificare la visualizzazione pubblica.

**Risultato attuale: zero nuove coordinate validate per l'importazione**, non perché non esistano altre location, ma perché il controllo di duplicati e la prova primaria sono incompleti.
