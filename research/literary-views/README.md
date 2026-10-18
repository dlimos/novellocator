# Regioni, modelli reali e vedute letterarie

18 ottobre 2026.

Le vedute sono accessibili dalla pagina geografica del romanzo con un unico collegamento «Vedute immaginarie». Al suo interno l'elenco dei capitoli è sostituito dall'elenco delle vedute, identificate dai luoghi o dalle epoche: ciascuna raccoglie tutte le associazioni verificate pertinenti, conserva attribuzioni e citazioni autentiche e non riscrive il dataset geografico. Le occorrenze originali restano in `placeOccurrences`; un passo pendente o respinto non rende visibile un luogo nel disegno.

Macondo usa le tre immagini già presenti e i relativi ancoraggi: primo villaggio (`settlement`), espansione bananiera (`expansion`), declino (`decline`). Gli ancoraggi di ogni epoca delimitano gli elementi rappresentabili. La scelta di una casa presente in più epoche non deve riportare alla prima immagine. Le associazioni della stessa epoca hanno priorità; un edificio rappresentato ma documentato soltanto da un'altra epoca rimane una menzione nel riepilogo, senza attribuirgli una scena non verificata in quel periodo. Questa è una ricostruzione figurativa per grandi fasi narrative, non una cronologia edilizia esatta.

## Aracataca: modello reale di Macondo

- Fundación Gabo, **Ruta Macondo – circuito Aracataca**: https://especiales.fundaciongabo.org/ruta-macondo-circuito-aracataca/ — documenta il rapporto fra Aracataca e l'immaginazione letteraria di García Márquez.
- Fundación Gabo, **Crónica de la Beca Gabo en Aracataca**: https://fundaciongabo.org/es/beca-gabo/2017/recursos/cronica-de-la-beca-gabo-en-aracataca — riferisce la ricerca degli ambienti che ispirarono l'universo macondiano.
- Colombia Travel, **Aracataca y García Márquez**: https://colombia.travel/es/santa-marta/aracataca-y-garcia-marquez — contesto biografico, urbano e letterario, con distinzione fra la città natale e il mondo narrativo.
- FINDETER, **Estudios previos EBAR Aracataca**, 2022, §11: https://www.findeter.gov.co/system/files/convocatorias/PAF-AASB-O-010-2022/documento_2_-_estudios_previos_ebar_aracataca-_obra_1.pdf — riferimento geografico 10°35′34″ N, 74°11′26″ O, convertito in `[10.5927777778, -74.1905555556]`. Si usa esclusivamente il riferimento urbano dichiarato nel documento, senza avallare le altre distanze riportate nella sua descrizione generale.

Il marker indica **Aracataca come fonte d'ispirazione reale**, non l'esatta posizione di Macondo e non la casa dei Buendía. L'identificativo `regional-town` resta invariato per preservare associazioni e selezione. `publish-macondo-model.sql` aggiorna soltanto i campi geografici del record esistente in `book_maps`; citazioni, categorie, pagine, immagini e altri luoghi rimangono conservati.

Il collegamento permanente «Aracataca — città ispiratrice di Macondo» è generato dal campo editoriale `modelName`. Apre la vista geografica di tutti i luoghi con `focus=regional-town`, selezionando e inquadrando il modello reale anche quando si proviene da un altro capitolo o da una veduta immaginaria. Il parametro usa l'identità del luogo, non il suo numero nella lista. `publish-model-navigation.sql` aggiunge esclusivamente il nome del modello al record geografico già verificato.

## Regioni senza modello puntuale

La regola editoriale usa il contorno geografico in polyline, senza centro immaginario. Il caso già pubblicato di Ramsdale/New England rimane il riferimento tecnico in `research/lolita/RAMSDALE-REGION.md`. Ogni nuovo contorno richiede una geometria geografica documentata: non si genera un rettangolo o un cerchio arbitrario intorno a un vecchio punto.
