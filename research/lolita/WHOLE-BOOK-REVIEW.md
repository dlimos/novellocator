# Lolita: revisione geografica e narrativa del 16 ottobre 2026

Aggiornamento del 17 ottobre: [citazioni dal testo nativo dell’ultimo PDF](QUOTATIONS.md).
L’apparato descritto come pendente in questo rapporto storico è stato aggiunto
per prefazione e due parti; restano le lacune esplicite della postfazione e
dell’identificazione dell’edizione cartacea.

La revisione riguarda la prefazione, tutti i 33 capitoli della prima parte,
tutti i 36 della seconda e la postfazione d’autore: 71 sezioni.
Riprende le note della lettura integrale, confronta i contesti originali delle
classificazioni corrette e verifica la successione completa dei capitoli nel
nuovo PDF inglese fornito dall’utente (283 pagine, testo estraibile).
Il PDF è una copia reimpaginata senza dati editoriali sufficienti e senza
postfazione. Per quest’ultima resta il testimone precedente.
Le pagine delle due copie non sono intercambiabili.

## Esito

- Prima parte: da 2 a **11** luoghi dell’azione nella vista aggregata.
- Seconda parte: da 1 a **21**.
- Postfazione: **1**, Parigi, a livello autobiografico.
- Prefazione: **0**; le notizie sui personaggi restano menzioni.
- **73 associazioni sezione–luogo** hanno una motivazione esplicita della scena,
  livello narrativo, impronta del contesto originale e riferimenti alle copie.
  Sono associazioni, non 73 luoghi distinti.

L’importazione iniziale aveva applicato `mentioned` anche a scene già annotate
nell’analisi, in attesa della collazione individuale. Inoltre molti capitoli
continuano una scena in una casa, scuola o strada inventata senza ripetere il
nome della città. Le nuove associazioni regionali esplicite recuperano questa
continuità: il nome non viene inserito artificialmente in una citazione e gli
edifici non ricevono indirizzi reali.

I luoghi dell’azione precedono i citati nelle parti e nella vista globale.
Quando un luogo ha entrambe le funzioni, la scheda aggregata sceglie una sua
scena d’azione e la fonte corrispondente; le singole occorrenze mantengono la
propria categoria. Le due numerazioni restano indipendenti e reagiscono ai filtri.
Gli export dettagliati mantengono i capitoli originali e le associazioni regionali
riviste, senza inventare citazioni o coordinate puntuali per i contorni.

## Criterio critico

Il saggio di Monica Manolescu-Oancea,
[Inventing and naming America](https://journals.openedition.org/ejas/7550),
*European journal of American studies*, 4-1, 2009, è stato letto integralmente.
I §§25–26 aiutano a riconoscere la funzione narrativa delle brevi vignette del
viaggio: la lunghezza o la forma nominale non bastano a escludere una scena.
I §§33–43 distinguono i diversi livelli dei nomi geografici e le identificazioni
critiche dalle certezze del testo.

Restano citati i falsi recapiti dei registri, le mete progettate, le notizie
biografiche, i confronti e gli elenchi turistici privi di un evento narrato.
Si distinguono il racconto californiano del medico, l’aneddoto di Arles e i
ricordi parigini dalle tappe effettive dei due viaggi. Non si adotta la geografia
della sceneggiatura cinematografica per Beardsley o Elphinstone.

Confronto specialistico:
[Zimmer, Trip One](https://dezimmer.net/LolitaUSA/Trip1.htm) e
[Trip Two](https://www.dezimmer.net/LolitaUSA/Trip2.htm).
I modelli proposti da Zimmer non sono trasformati in città reali equivalenti.
Magnolia Garden è confrontato anche con il
[sito ufficiale della proprietà](https://www.magnoliaplantation.com/contact).
Il punto indica il complesso, non la panchina della scena.

## Precisione geografica

I contorni di California, Colorado, Arkansas, Georgia, Mississippi e Utah
provengono dal servizio ufficiale US Census, cartografia 2020, generalizzata a
0,02 gradi. Identificano gli Stati di riferimento per scene senza un sito preciso.
In Georgia la scena è in barca al largo: il contorno non è la traccia di navigazione
e non attesta uno sbarco. Ramsdale conserva il precedente contorno del New England.
Non sono distribuzioni di probabilità, itinerari o confini di città inventate.

Riviera, Artico canadese e cittadina anonima degli Appalachi hanno collocazioni
regionali dichiarate come tali. I punti arrotondati sono scelti per orientarsi,
non ottenuti geocodificando un edificio inventato. La definizione ampia di Riviera
non sceglie una città, un Paese o un albergo reale come equivalente del Mirana.
Fonti di orientamento: voce geografica Riviera dell’*Encyclopædia Britannica*
1911, Natural Resources Canada, National Park Service. Il masso e il campo artico
non vengono assegnati a Prince of Wales Island o Victoria Island.

## File e limiti documentali

`whole-book-review.json` documenta le 71 sezioni, le associazioni preesistenti,
le revisioni e le pagine della nuova copia. `whole-review-patch.json` e
`publish-whole-review.sql` contengono le modifiche pubblicabili; il secondo è
transazionale, circoscritto a Lolita e verificato anche alla seconda esecuzione.
Le descrizioni redazionali sono tradotte nelle quattro lingue del sito.

Pubblicazione dei dati verificata il 17 ottobre 2026. Gli aggiornamenti hanno
filtri espliciti anche nei rami `ON CONFLICT DO UPDATE`. La transazione salva
le impronte di tutte le righe degli altri romanzi nelle cinque tabelle coinvolte
e le confronta prima di `COMMIT`: una differenza annulla l’intera operazione.
Il test esercita sia il caso corretto sia l’annullamento di una modifica estranea.
L’API pubblica restituisce i conteggi, le scene, l’ordine, i sei contorni statali e
tutte le nuove traduzioni attesi.

Il PDF, il testo estratto, gli ancoraggi letterali e i contesti originali restano
in `work/lolita-roadtrip/`, escluso da Git. Il preparatore richiede questi input
privati e gli snapshot precedenti del database; non li scarica né li pubblica.
Non vengono aggiunti nuovi estratti del romanzo alla distribuzione pubblica.
L’identificazione editoriale e la collazione/valutazione del futuro apparato
completo di citazioni restano pendenti. La correzione delle categorie non
equivale a dichiarare completata quell’attività distinta.
