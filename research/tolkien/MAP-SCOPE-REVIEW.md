# Revisione dei luoghi collocabili sulla mappa

**2 novembre 2026: pubblicata la selezione di 159 ancoraggi presenti nella cartografia**, con 1.236 associazioni nelle 70 sezioni. Le altre 18 proposte interpretative restano locali e non sono sulla mappa pubblica. [Apri l’atlante](https://dlimos.github.io/novellocator/atlas.html?book=lord-of-the-rings&lang=it). Il precedente limite temporaneo di pubblicazione è rientrato; il codice e il registro sono pubblicati normalmente sul branch `docs`, insieme all’aggiornamento del database. La revisione cartografica dei 177 candidati è descritta qui sotto; non equivale alla conclusione dell’intera analisi critica.

## Criterio

Il lavoro riguarda località e territori che offrano un riferimento utile sulla carta: città, villaggi, regioni, montagne, foreste, fiumi, guadi e tappe nominate. Non prosegue la ricostruzione di camere, sale, scale, porte interne, singoli ripari, soste anonime o percorsi solamente proposti. Una casa o un luogo nominato già presente sulla carta, come Bag End o Wellinghall, rimane un riferimento esterno unico; non genera marker per i suoi interni.

Sono state vagliate le 1.530 identità dell’inventario dopo le riconciliazioni già documentate, attraverso tutte le 70 sezioni editoriali e narrative. Questo è un controllo cartografico dell’inventario esistente: non una nuova lettura integrale né una dichiarazione che l’intero inventario critico sia definitivo.

## Risultato della revisione

| Dato | Quantità |
| --- | ---: |
| Località candidate | 177 |
| Ancoraggi derivati dai POI della cartografia | 159 |
| Ancoraggi interpretativi separati | 18 |
| Associazioni sezione–luogo, senza duplicati | 1.388 |
| Azione | 293 |
| Menzioni | 1.095 |
| Correzioni narrative registrate | 43 |

I 159 ancoraggi cartografici sono posizioni nel disegno dell’autore, non rilievi esatti delle scene. I 18 ancoraggi interpretativi restano proposte da controllare prima della pubblicazione; nell’anteprima normale sono esclusi. Sono consultabili solo nella variante esplicita `positions=candidates`, che rimane una proposta privata. Comprendono Parth Galen, Caradhras, Misty Mountains, Ithilien, Entwash, Nen Hithoel, Pelennor, Cormallen, Henneth Annûn, Gorgoroth, Morgai, Morgul Vale, Buckland, Bree-land, Cerin Amroth, Dimrill Dale, Mirrormere e Fords of Isen. La precisione e il motivo della posizione sono conservati per ogni record. Non vengono presentate latitudini, longitudini o confini misurati.

I casi privi di un ancoraggio indipendente controllato restano nell’analisi: non vengono trasformati in punti mediante il solo prefisso del nome o una coordinata della città vicina. Questo comprende anche luoghi importanti che richiedono una successiva verifica geografica; non sono dichiarati inesistenti o impossibili da collocare.

L’anteprima normale mostra soltanto i **159 ancoraggi della cartografia**, con 1236 associazioni (239 azione e 997 menzioni). L’elenco è `work/tolkien/map-review/cartographic-places.csv`; le 18 proposte sono separate in `interpretative-candidates.csv`.

## Mordor e categorie narrative

Mordor è azione in II.2 (racconto storico), II.10 (percezione remota), IV.3 (armate osservate alla Porta), VI.1, VI.2, VI.3 e VI.4. La nuova associazione di VI.2 usa un proprio riscontro originale della sezione, con la presenza di Frodo e Sam nel paese esplicitamente verificata: non eredita automaticamente la categoria da VI.1. Le visioni e i racconti rimangono distinti dal viaggio presente.

Sono state recuperate anche ambientazioni generali già dimostrate dalle scene, per esempio Minas Tirith durante l’assedio e diverse località delle storie dell’Appendice A. Il marker rappresenta il luogo generale; non sposta camere e sepolcri su indirizzi inventati. Ogni recupero conserva il proprio riscontro della sezione e una motivazione, senza trasferire una categoria da un capitolo all’altro.

Le revisioni conservative portano a menzione gli itinerari riferiti di Merry in VI.5, alcuni brevi raccordi cronologici tra i fili narrativi, la semplice attesa dell’esercito presso le Ered Lithui e l’usanza del calendario nel Buckland. Il richiamo al nome o alla presenza di una persona non basta a dimostrare una scena.

## Dati e controlli

- Stato sintetico senza citazioni: `map-scope-review.json`.
- Elenco di lavoro: `work/tolkien/map-review/mappable-places.csv`, con X/Y locali, precisione e sezioni per categoria.
- Inventario, motivazioni, riscontri originali, selezioni e correzioni: `work/tolkien/map-review/`, escluso da Git.
- Anteprima privata: `docs/preview/tolkien-map-review.html`, esclusa da Git e servita soltanto sul server locale.

I riscontri testuali sono stati ricontrollati contro la propria pagina; per le tavole è stata ricontrollata l’integrità dell’immagine già letta manualmente. Passano i controlli di unicità delle associazioni, 70 introduzioni nelle quattro lingue, distinzione azione/menzione, assenza di marker interni, assenza di coordinate terrestri e conservazione del testo autentico senza URL del romanzo nell’interfaccia. Le citazioni della bozza non costituiscono un insieme già approvato per la pubblicazione: la loro selezione pubblica e la proporzione complessiva restano un controllo distinto, richiesto dalle regole del progetto.

## Estratti nella pubblicazione

La selezione pubblica non riversa i 1.236 originali sul sito: mantiene gli estratti già valutati soltanto quando testo, identità e categoria coincidono, aggiungendo il breve riscontro di Mordor in VI.2 accompagnato da discussione critica nelle quattro lingue. Sono visibili 197 estratti; gli altri 1.039 sono conservati nell’analisi privata. I riferimenti bibliografici restano disponibili senza collegamenti al testo integrale. I test verificano l’omissione del blocco vuoto, il rifiuto di estratti non verificati e la presenza del riscontro originale privato per ogni associazione.
