# Jefferson and the Compson grounds — schematic companion, 15 October 2026

## Scope and editorial method

Two interpretative diagrams accompany the existing geographic atlas; the geographic positions and imported evidence are not rewritten. The diagrams use thirteen existing place identities, with `house` repeated as a connection between views. Runtime names, scene notes, passages, translations, highlight terms and bibliographic references are read from the published Supabase dataset, not duplicated in a public static corpus. No novel text links are emitted. The existing quotation component provides authentic available languages, English original fallback and disabled single-language selection.

The arrangement is editorial, not a reconstruction of bearings, distances, property boundaries or a street network. Drawings are original SVG illustrations made for these diagrams, not reproductions of Faulkner's maps or Digital Yoknapatawpha's artwork. Lines, building silhouettes, vegetation and stream are illustrative. They must not be used to infer paths, building plans, compass directions or exact adjacency. There are no terrestrial coordinates, scale bar or north arrow. Jefferson is not substituted with Oxford. Interior rooms remain in the research rather than being placed on a fabricated floor plan. The generic `reading-diagram.js` reads all layout definitions, four-language labels, interpretative notes and section headings from `books.metadata.readingDiagram`; the targeted publication SQL changes only this key.

## Sources checked

- Complete primary-source reading and hashes: `analysis.json`, `verification.json`; all four dated sections of the 1931 third printing and the separately documented 1946 appendix. The selected quotations in sections 1–4 were checked again as literal substrings of the corresponding complete local source paragraphs on 15 October 2026. The companion reads the contextual quotations restored by the separate quotation review, including the expanded appendix passages, directly from the database.
- Primary edition: https://en.wikisource.org/wiki/The_Sound_and_the_Fury
- Appendix critical transcription: https://drc.usask.ca/projects/faulkner/moved/main/appendix/index.html
- University of Virginia, Digital Yoknapatawpha: https://faulkner.iath.virginia.edu/ and https://faulkner.iath.virginia.edu/shanti/content/sound-and-fury
- Compson Place overview: https://faulkner.iath.virginia.edu/shanti/content/compson-place
- Faulkner's maps and variations across texts: https://faulkner.iath.virginia.edu/media/resources/DISPLAYS/FaulknerMapsHP.html
- Yale, Wai Chee Dimock, lecture 6: https://oyc.yale.edu/american-studies/amst-246/lecture-6 — centrality of the square and monument to the ending. This is critical interpretation, not an authority for terrestrial coordinates.
- University of California Press, Thomas S. Hines, *William Faulkner and the Tangible Past*: https://publishing.cdlib.org/ucpressebooks/public/book/william-faulkner-and-the-tangible-past-the-architecture-of-yoknapatawpha.html — architectural context; not copied as a plan.

The two Virginia content pages and maps resource did not reliably load in the web reader during this session; search results and the previously retained complete research provide the comparison. No inaccessible page is claimed as newly read in full.

## Placement audit

| Diagram | Existing identity | What the primary text establishes | Graphic choice |
| --- | --- | --- | --- |
| Both | house | Family home, childhood return in I; decaying portico in IV; later sale in appendix | Repeated anchor, not Oxford address or measured footprint |
| Grounds | pasture | Benjy watches golfers across a fence; alienated family land | Separate illustrated zone; extent and orientation invented |
| Grounds | garden | Fence and broken opening traversed by Benjy and Luster | Nearby zone in diagram; no survey |
| Grounds | gate | Gate linking the enclosed grounds to the street | Separate threshold symbol; no compass bearing |
| Grounds | cabin | Versh's house in I; Dilsey emerging from cabin in IV | Separate house silhouette, not an architectural reconstruction |
| Grounds | barn | Passage through barn, open stalls | Outbuilding symbol; shape and relative position editorial |
| Grounds | branch | Stream in childhood memories | Wavy line; neither real watercourse nor documented course |
| Grounds | swing | Rendezvous evoked in I and II | Symbol among trees; no exact position |
| Jefferson | square | Carriage scene and final approach | Central node; dimensions not asserted |
| Jefferson | monument | Soldier at the square; final turn | Visually associated with square; no measured placement |
| Jefferson | store | Jason's employment and shop scenes | Diagram node; no specific frontage or address |
| Jefferson | cemetery | Intended visits in I and IV; recalled funeral in III | Independent node; no claimed arrival in I or IV |
| Jefferson | black-church | Dilsey's Easter service | Independent church symbol; no reconstructed street route |

## Categories and temporal layers

The category belongs to each section–place occurrence. The companion never upgrades a published mention. After checking the restored contextual passages, the following occurrences do not clearly prove a scene in that location and are conservatively shown as `mentioned`: II/square (the skyline seen from elsewhere) and swing (the invitation does not establish arrival); III/store (employment) and square (a conditional comment about chickens); appendix/cabin (residence) and house (reported sale and use). These are presentation-level conservative downgrades, documented separately from the untouched import. A future promotion requires stronger original evidence. I/swing now retains `action`, because the contextual original narrates Benjy seeing the swing and crying; appendix/store retains `action`, because Melissa enters the shop in the narrated encounter. Other occurrences retain their published categories and narrative justification in `analysis.json`.

In global view a location is an action node if at least one included occurrence proves action; its evidence lists all occurrences with their individual categories and section titles. Four dated sections are kept in reading order, not converted into a chronological itinerary. The appendix is explicitly separate; the drawings do not pretend to depict a dated cadastral state or animate an unverified redevelopment.

## Citation purpose and proportion

No new literary extracts are added. Existing short verified excerpts are shown for the critical purpose of discussing a selected location and testing whether the passage narrates action or merely mentions it. The aggregate corpus of quotations is unchanged; repeated viewing does not create a new edition of excerpts. The necessity is to let the reader assess each diagram node against its source. Bibliographic attribution, original language, section/paragraph reference and authentic highlight terms are retained. Rights and translation research remain documented in the existing editorial record and translation research; this change does not treat English-original rights as clearance for a translation.

## Validation

`tests/check-faulkner-map.cjs` checks original-evidence eligibility, conservative categories, section/global behavior, no source mutation, layer-specific contiguous numbering and four UI languages. Browser checks cover both diagrams, source evidence, language selectors, chapter/global navigation, filters and small-screen layout.
