# Vedute immaginarie di Cime tempestose

Tre vedute realizzate il 19 ottobre 2026 con lo strumento integrato ImageGen: Wuthering Heights, Thrushcross Grange e la brughiera. Immagini PNG 1536 × 1024, originali generati per questo atlante. Non sono riproduzioni di dipinti storici. La copertina del catalogo rimane il quadro esistente di Friedrich.

## Regola generale

Le vedute devono essere realistiche ed evocative: ambienti credibili, profondità, luce e atmosfera coerenti con l’opera. La regola è registrata in AGENTS.md per tutti i romanzi presenti e futuri. Le prime bozze vettoriali sono state ritirate e conservate soltanto in work/wuthering-heights-vector-drafts, escluso da Git.

## Ricostruzione e limiti

Le case sono vedute pittoriche con aperture interpretative degli interni, non piante misurate. Adiacenze, prospetti e posizioni delle stanze non sono attestate come disposizione esatta; la camera preparata per Catherine alla Grange è sul piano del salotto, secondo il capitolo XIII. Il paesaggio ricompone relazioni narrative: non stabilisce distanze o orientamenti geografici. Non identifica le case inventate con Top Withens o Ponden Hall. La fioritura del giardino delle Heights appartiene alla fase finale; una veduta riunisce episodi di date diverse senza affermarne la simultaneità.

19 posizioni complessive (7 + 6 + 6), di cui 14 nuovi ambienti attestati da passi originali specifici. I 5 luoghi già presenti conservano le associazioni ai capitoli; Penistone Crags resta luogo citato. Le posizioni delle immagini sono separate dalle coordinate geografiche. I nuovi interni restano nascosti nell’atlante geografico e nelle sue esportazioni. Nessun collegamento pubblico diretto al testo del romanzo.

Le citazioni sono selezionate per discutere l’ambientazione della singola scena, non per riprodurre il racconto continuativamente. I 14 nuovi riscontri ammontano a 1164 parole complessive dell’originale di pubblico dominio, distribuite tra capitoli diversi; le attribuzioni e gli evidenziamenti sono verificati sul testo integrale. Le traduzioni editoriali esistenti vengono riusate solo quando corrispondono esattamente al passo; negli altri casi è mostrato l’originale autentico. Nessuna traduzione inventata.

## Set di prompt (contenuto e composizione)

Strumento: ImageGen integrato, tre generazioni indipendenti, sfondo opaco. Nessuna immagine generata usata come copertina del catalogo.

- Heights: realistic evocative panoramic Romantic oil painting, Yorkshire circa 1800, landscape 3:2. Rugged dark stone farmhouse, mullioned windows, slate roof, wind-bent firs and hawthorns. Stable with pony on left, enclosed court and gate in front, flower garden on right. Naturalistically painted architectural cutaway: ground-floor family sitting room with hearth and pewter dresser on left, kitchen on right; enclosed oak box bed near window upstairs left; rough attic with two skylights above right. Dramatic storm light, warm interiors, credible materials and depth. No diagrams, labels, arrows, grids, markers or modern objects. Interpretative, not measured.
- Grange: realistic evocative Romantic oil painting, Yorkshire circa 1800, landscape 3:2. Refined pale stone Georgian house in sheltered wooded valley. Elevated view from park, naturalistic cutaway with three rooms all on same ground floor: crimson drawing room, white/gold ceiling and chandelier on left, book-lined library middle, prepared sickroom with bed on right. Intact upper facade. Old ash left, park and carriage approach foreground, stone boundary wall and small locked gate right. Warm light after rain, atmospheric depth, no labels, diagram elements or modern objects. Architectural layout interpretative.
- Moorland: realistic evocative Romantic landscape, panoramic Yorkshire moor circa 1800, 3:2. Solitary rugged farmhouse upper left; pale Georgian Grange in sheltered wooded park lower right; stone Gimmerton and square church tower lower left; gritstone Penistone crags with cave upper right; weathered guidepost near diverging footpaths central foreground; heather moor at center. Storm breaks to warm valley light, believable stone and vegetation, coherent perspective. No text, compass, arrows, roads diagram, labels, pins or modern objects. Imaginary landscape, not measured geography.

## Verifiche

`prepare-views.cjs` produce configurazione, riscontri e SQL limitato ai metadati delle vedute, ai 14 ambienti e alle traduzioni pertinenti. `check-views.cjs` verifica riscontri letterali, categorie, quattro lingue, riferimenti originali, CSV e applicazione SQL ripetibile; preserva le 134 associazioni geografiche e i 5 ambienti senza coordinate già visibili. `verify.cjs` controlla il romanzo originale. Le tre immagini e le posizioni sono state ispezionate visivamente nell’anteprima locale.

Fonti e prove: views-evidence.json, views-layout-evidence.json, analisi integrale già conservata nella cartella dell’opera. Le coordinate pittoriche sono in views.json.
