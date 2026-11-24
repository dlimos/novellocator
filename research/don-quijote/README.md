# Don Quijote: corpus and geographical evidence

The Spanish narrative was acquired in full from the GITenberg archive of Project Gutenberg #2000, not from summaries. The archive contains both parts, 52 + 74 chapters, prologues, dedications, preliminary poems, editorial documents, I.52's closing poems and the conclusion of II.74. The two historical title pages were acquired separately from the Instituto Cervantes edition directed by Francisco Rico (1998). Modern critical notes are excluded from the literary corpus.

The resulting inventory has **142 sections: 126 chapters and 16 preliminary sections**. `analysis.json` records every section, including sections with no locations: source, edition, paragraph and word counts, SHA-256 digest, matching paragraphs, authentic Spanish quotations, classifications and critical comparisons. Headings and inserted stories are included. Multiple unnamed houses or roads are recorded per paragraph, without pretending to identify one common address.

The Gutenberg digital edition is identifiable (1999; revised HTML 2010), but its underlying printed edition is not stated. It is not described as a diplomatic transcription of the 1605/1615 first editions. Archived spellings and readings are preserved. The CVC index corroborates the section structure; CVC supplied the title pages and specific critical identifications, not the complete acquired narrative.

The archive omits all fourteen lines of the Burlador sonnet to Sancho after its heading in I.52. The missing historical verse was acquired from [CVC I.52, page 4](https://cvc.cervantes.es/literatura/clasicos/quijote/edicion/parte1/cap52/cap52_04.htm), with modern note markers stripped. The section audit records the fourteen-line supplement, its precise paragraph, edition and source; it contains no additional identifiable location. This is an explicit supplement, not an unrecorded alteration of Gutenberg. The archive reads Jasón decreta in the Monicongo poem: CVC reads de Creta and records decreta in critical note XLV. The archived spelling is retained; note 53 explains the Cretan allusion. Title pages and poem captions are also checked; I.52's CVC note 64 identifies Sierra Negra as Sierra Morena, while note 65 cautions that Don Quixote does not approach Aranjuez in either part.

## Valutazione delle vedute letterarie — 24 novembre 2026

**Raccomandazione positiva:** le vedute panoramiche aiuterebbero a leggere il contrasto fra gli spazi aperti della Mancia, il paesaggio aspro della Sierra Morena, la visione sotterranea della Cueva de Montesinos e l'approdo mediterraneo di Barcellona. Proposta editoriale, non vedute già realizzate:

1. **Mancia e Campo de Montiel:** orizzonte ampio, strade e mulini a vento; passaggi di riferimento I.2 e I.8. Il villaggio di Don Chisciotte e i mulini non hanno una posizione puntuale verificata: la composizione resta una ricostruzione letteraria.
2. **Sierra Morena:** rilievi aridi, gole e ripari che rendano leggibili le vicende di Cardenio e la penitenza di Don Chisciotte; I.23–26. Mantenere distinta la regione dalla posizione non accertata di ogni singolo episodio.
3. **Lagune di Ruidera e Cueva de Montesinos:** panorama delle lagune con l'imbocco della grotta e, solo se utile, una seconda profondità interna; II.22–24. Il geocodificatore non ha identificato la grotta correttamente, quindi non assegnarle coordinate né un indirizzo; il punto sulla veduta sarebbe interpretativo.
4. **Barcellona e il Mediterraneo:** profilo costiero, approdo e spiaggia per la sequenza conclusiva in città; II.61–66. Distinguere il paesaggio rappresentativo dagli esatti itinerari o punti di sosta.

Il testo primario è l'[edizione digitale Project Gutenberg #2000](https://www.gutenberg.org/ebooks/2000). La BNE descrive [la carta del 1780 di Tomás López](https://www.bne.es/es/colecciones/cervantes/mapa-porcion-reyno-espana) come la prima a rappresentare la rotta e i luoghi delle avventure: è un riferimento storico utile per leggere la tradizione cartografica, non una prova di coordinate precise o di un percorso letterale. Ogni posizione sulle panoramiche va mantenuta separata dalle coordinate geografiche, e le vedute dovranno conservare i riferimenti alle sezioni e ai passi verificati.

## Sources and distinctions

- [Gutenberg #2000](https://www.gutenberg.org/ebooks/2000) and [acquired GITenberg HTML](https://raw.githubusercontent.com/GITenberg/Don-Quijote_2000/master/2000-h/2000-h.htm): textual evidence.
- [Instituto Cervantes / Francisco Rico](https://cvc.cervantes.es/literatura/clasicos/quijote/edicion/default.htm): critical edition, preliminary structure and specific identifications.
- [José María Casasayas, Lugares y tiempos en el Quijote](https://cvc.cervantes.es/literatura/clasicos/quijote/introduccion/apendice/casasayas.htm), all five pages: specialist itinerary. His scope excludes inserted narratives, poems and fantasy geography; this atlas also indexes those categories.
- [Biblioteca Nacional de España: Tomás López / José de Hermosilla map, 1780](https://www.bne.es/es/colecciones/cervantes/mapa-porcion-reyno-espana): historical cartography, explicitly a reconstruction rather than proof of an exact literary address.
- ArcGIS World Geocoding: modern coordinates only. Candidate responses were checked for geographical homonyms. The analysis records rejected results and representative coordinates separately from textual evidence.

Viso is Viso del Marqués (CVC I.23 note 16); Augusta is Augsburg (II.54 note 37), with Ricote's house in an unnamed village nearby. Alejandría de la Palla is Alessandria, not Alexandria in Egypt. Zaragoza is a projected destination avoided by Don Quixote. His home village, the windmills, ducal residence and Barataria are not assigned invented exact coordinates. Cueva de Montesinos remains without a coordinate because the geocoder returned an unrelated Alicante locality. The unnamed place remains useful as a documented literary setting.

The original says Rondilla de Granada in I.3, whereas the Casasayas itinerary lists Málaga. The original reading and the divergence are recorded. Personal names, a saint, musical *compás*, the noun *vitoria* (victory), and *a costa de* were rejected as lexical false positives.

The painting and its reuse documentation are in `docs/images/CREDITS.md`. Published geographical content and translations are stored in Supabase; local datasets, eight CSV exports and SQL Editor import chunks follow the project's existing generation workflow.

