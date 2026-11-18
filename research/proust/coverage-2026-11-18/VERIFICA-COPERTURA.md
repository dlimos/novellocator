# Proust — verifica estesa di citazioni e descrizioni

> Stato storico prima delle correzioni. Consultare il [rilascio successivo](RILASCIO-CORREZIONI.md) e l’[inventario aggiornato](COPERTURA-CORRETTA.csv).

Verifica del 18 novembre 2026. Lettura anonima delle API effettivamente usate dal sito e controllo incrociato in Supabase. Esecuzione degli adattatori e delle funzioni pubbliche di selezione, evidenziazione e rendering delle descrizioni/citazioni, con DOM simulato. Nessuna modifica ai dati o al sito; nessun controllo visivo nel browser.

## Perimetro e copertura

Il database contiene 412 associazioni volume–luogo e 931 estratti. Dopo le regole editoriali di visibilità applicate dal codice pubblico risultano 254 associazioni visibili, corrispondenti a 162 luoghi distinti. Le altre 158 associazioni restano nel database e non sono posizioni visibili. Le 114 schede sospese dell’Excel non sono state importate da questo controllo.

Tra le 254 associazioni visibili, 169 hanno FR/IT/EN/ES, 84 soltanto FR e una non ha estratti: `7:core:boulevards`, Grands Boulevards, volume VII. Nel database completo 411 associazioni su 412 hanno un originale francese non vuoto. La presenza degli estratti precedenti non costituisce nuova collazione o attestazione dei diritti.

| Volume | Associazioni visibili | Quattro lingue | Solo FR | Nessuna citazione |
|---|---:|---:|---:|---:|
| 1 | 41 | 25 | 16 | 0 |
| 2 | 15 | 3 | 12 | 0 |
| 3 | 54 | 42 | 12 | 0 |
| 4 | 29 | 14 | 15 | 0 |
| 5 | 32 | 23 | 9 | 0 |
| 6 | 31 | 24 | 7 | 0 |
| 7 | 52 | 38 | 13 | 1 |

La copertura multilingue dichiarata completa nei precedenti rapporti riguarda soltanto il lotto di 169 associazioni, non tutta la Ricerca pubblicata. L’affermazione successiva che restasse soltanto il controllo visivo non vale per l’insieme dell’opera.

## Vedute immaginarie

Le due vedute mostrano cinque posizioni. Riutilizzano citazioni e identificativi delle associazioni esistenti: non sono cinque nuovi luoghi da sommare ai 162 geografici. Il riferimento originale è presente per tutte e cinque le posizioni, con attribuzione ed evidenziazione rese dal codice pubblico.

| Veduta | Posizione | Lingue del passo selezionato |
|---|---|---|
| Combray | Saint-Hilaire | EN, ES, FR, IT |
| Combray | Parco di Tansonville | EN, ES, FR, IT |
| Combray | Casa di tante Léonie | FR |
| Balbec | Grand Hôtel di Balbec | EN, ES, FR, IT |
| Balbec | Lungomare di Balbec | FR |

La casa di zia Léonie e il lungomare di Balbec non hanno IT/EN/ES. Per il lungomare mancano anche nelle due associazioni di provenienza (volumi II e IV). I restanti tre luoghi hanno quattro lingue anche nelle occorrenze raccolte dalla veduta.

## Descrizioni

Le 217 schede descrittive nel database hanno `positionDescription.status=reviewed` e testi nelle quattro lingue. Questo è lo stato registrato, non una nuova verifica esterna delle fonti. Tutte le 254 associazioni visibili e tutte le cinque posizioni delle vedute rendono una descrizione non vuota nelle quattro lingue, senza ripiego su una descrizione inglese. Non risultano descrizioni identiche condivise fra luoghi distinti nelle 162 posizioni geografiche.

**Problema nelle vedute:** per tutte e cinque le schede, `positionDescription` del luogo geografico resta prioritaria anche in modalità immaginaria. Il lettore vede quindi la descrizione di casa Amiot, Saint-Jacques, Pré Catelan o dei modelli di Cabourg, mentre il riepilogo narrativo specifico della veduta viene nascosto. I cinque riepiloghi narrativi e le introduzioni delle due vedute sono già presenti nelle quattro lingue. Il controllo ha confrontato i testi e confermato la soppressione tramite la funzione pubblica `renderLocation`; non ha modificato il comportamento.

I riepiloghi delle vedute descrivono anche momenti ulteriori rispetto al singolo estratto selezionato (per esempio il ritorno a Balbec e il lutto). La loro presenza multilingue non attesta una nuova collazione di ciascuna affermazione con tutti i relativi passi. Nelle schede geografiche esistono inoltre descrizioni narrative specifiche dei volumi: il renderer mostra quelle abilitate insieme alla descrizione della posizione e ne conserva le altre nei dati.

## Grassetto delle citazioni precedenti

In 23 associazioni visibili il passo francese disponibile non rende alcun `<strong class="quote-place">`. Sono riferimenti precedenti al lotto multilingue; il lotto di 169 continua a superare il controllo. Questi casi richiedono la verifica della forma autentica del riferimento geografico e dei relativi termini di evidenziazione, senza aggiungere al testo nomi assenti:

- Volume 1: Quai d’Orléans.
- Volume 1: Rue Montalivet.
- Volume 1: Monte Carlo.
- Volume 1: Nineveh.
- Volume 1: Mar Mediterraneo.
- Volume 1: Oceano Atlantico.
- Volume 2: Giardini degli Champs-Élysées.
- Volume 2: Algeciras.
- Volume 2: Monte Carlo.
- Volume 2: River Thames.
- Volume 2: Oceano Atlantico.
- Volume 3: Guermantes a Parigi · riferimento al faubourg Saint-Honoré.
- Volume 3: Alps.
- Volume 3: Nile.
- Volume 3: Red Sea.
- Volume 3: Mar Mediterraneo.
- Volume 4: Guermantes a Parigi · riferimento al faubourg Saint-Honoré.
- Volume 4: Monte Carlo.
- Volume 5: Guermantes a Parigi · riferimento al faubourg Saint-Honoré.
- Volume 6: Basilica di San Marco.
- Volume 6: Mar Mediterraneo.
- Volume 7: Giardini degli Champs-Élysées.
- Volume 7: Alps.

## Esito

Verifica eseguita; copertura dell’intera opera non completa. Restano da integrare 85 associazioni visibili: 84 con l’originale ma senza le tre traduzioni e una senza originale né traduzioni. Le due posizioni incomplete delle vedute sono comprese in queste lacune, non aggiunte. Restano da correggere la priorità descrittiva nelle vedute e i 23 casi di grassetto. Nessuna lacuna è stata nascosta o dichiarata risolta.

Inventario senza riproduzione degli estratti: [COPERTURA-LUOGHI.csv](COPERTURA-LUOGHI.csv). Conteggi, provenienza e hash degli script pubblici: [ESITO.json](ESITO.json). Le copie dei testi e gli snapshot integrali restano locali. Questo controllo non sostituisce una nuova analisi integrale del romanzo, la collazione autentica di ogni estratto o la verifica visiva dell’impaginazione.
