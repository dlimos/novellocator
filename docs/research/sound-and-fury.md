# The Sound and the Fury — editorial record

The complete English novel was read sequentially in all four dated sections, using the proofread Wikisource transcription of the scanned Jonathan Cape and Harrison Smith **third printing, November 1931**, first published in 1929. This edition has no appendix. The separately attributed **Compson 1699–1945** appendix, written in 1945 and first published in 1946, was read in full through the University of Saskatchewan's scholarly transcription. It is the fifth atlas section, not silently merged into the 1929 narrative.

## Primary texts and integrity

- [Original edition and section navigation](https://en.wikisource.org/wiki/The_Sound_and_the_Fury)
- [April Seventh, 1928](https://en.wikisource.org/wiki/The_Sound_and_the_Fury/April_Seventh,_1928): 1,023 parsed paragraphs, complete.
- [June Second, 1910](https://en.wikisource.org/wiki/The_Sound_and_the_Fury/June_Second,_1910): 920 parsed paragraphs, complete.
- [April Sixth, 1928](https://en.wikisource.org/wiki/The_Sound_and_the_Fury/April_Sixth,_1928): 728 parsed paragraphs, complete.
- [April Eighth, 1928](https://en.wikisource.org/wiki/The_Sound_and_the_Fury/April_Eighth,_1928): 491 parsed paragraphs, complete.
- [Compson appendix, University of Saskatchewan](https://drc.usask.ca/projects/faulkner/moved/main/appendix/index.html): all entries, from Ikkemotubbe through Dilsey, including the unheaded connective genealogical passages. Line breaks in this transcription are normalized as whitespace, not editorial corrections.

The local `research/sound-and-fury/analysis.json` records section bounds, source hashes and every selected passage with its exact paragraph/line index. Raw complete texts remain local and excluded from Git. `build.py` slices quotations from those originals and rejects absent forms; it does not manufacture quotations. Typography highlighting is separately recorded in `highlightTerms`. Only original English quotations are supplied; descriptions and available editorial translations do not replace them.

## Scope and categories

Every section includes narrative locations. Action covers the narrated present, memories and embedded accounts; mentions include proposed journeys, origins, comparisons, commodity sources and sacred geography. An appendix event remains an appendix event. Benjy's 1933 commitment must not be represented as an accomplished event in the 1928 sections. The cemetery outing at the original ending is intended but does not reach the cemetery on the page.

Jefferson, Mottson, the Compson rooms, outbuildings, stream, play graveyard, neighborhood and businesses have no substituted Oxford coordinates. Real cities, universities, countries, regions and historical corridors receive explicitly representative WGS84 markers. An addressless restaurant or rural Massachusetts setting remains unlocated, even when a critic proposes an identification. The toy graveyard differs from the town cemetery; the Charles drawbridge differs from the rural stone bridge and the creek bridge near Jefferson. Nancy is a horse, not the person in another Faulkner story.

## Specialist comparison and divergences

[Digital Yoknapatawpha](https://faulkner.iath.virginia.edu/shanti/content/sound-and-fury), University of Virginia, edited by Julie Napolin and colleagues (2014, further editing 2020), was compared against the complete text and all nine pages of its linked-location inventory. Its scholarship and inset coordinates support interpretations but do not establish precise terrestrial positions. The project itself qualifies Quentin's Massachusetts geography as substantially invented. Its 1990 Vintage pagination differs from the scanned printing used for quotations.

- [Charles and drawbridge](https://faulkner.iath.virginia.edu/shanti/node/4023): river identification contextual; exact drawbridge uncertain. Kept unlocated as a combined narrative setting.
- [Parker's](https://faulkner.iath.virginia.edu/shanti/node/3887): Parker House is a tentative critical identification, not an asserted address.
- [Swimming hole / Bigelow's Mill](https://faulkner.iath.virginia.edu/shanti/node/4008): proposal and later bathing distinguished.
- [Picnic](https://faulkner.iath.virginia.edu/shanti/node/3980): its physical position is speculative; no invented farm coordinate.
- [Operation site](https://faulkner.iath.virginia.edu/shanti/node/6256): Benjy's breathing passage suggests anesthesia, but does not establish a particular doctor's office or hospital.
- [Havana](https://faulkner.iath.virginia.edu/shanti/node/3896): verified in Herbert's original cigar passage, rather than imported as an unsupported Cuba trip.
- [Biblical world](https://faulkner.iath.virginia.edu/shanti/node/6352): Bethlehem and Jerusalem are contextual critical readings; the quoted passage names Jesus and Calvary, not those cities. They remain interpretive, unlocated entries.
- [Appendix editorial history](https://faulkner.iath.virginia.edu/shanti/content/appendix-compson) and [Philip Cohen on textual instability](https://drc.usask.ca/projects/faulkner/main/criticism/cohen.html): the later genealogy is a distinct textual layer. It changes details of Miss Quentin's escape and Benjy's companion at the golf course; the four sections' pear-tree route and Luster are not replaced with the appendix's rainpipe and T.P.

Coventry is an idiom, Arcadia an epitaph allusion, and Milk street / Honey avenue are sarcastic imaginary addresses. Heaven and hell have no terrestrial markers. The Cannebière backdrop is preserved without resolving an uncertain photograph into a precise Caddy address. A missing locality is a documented uncertainty, not a gap concealed by a guessed coordinate.

## Coordinate review and artwork

ArcGIS candidate responses and query URLs are preserved in `coordinates.json`; region and river markers represent broad areas. The false Glasgow result for Culloden was rejected. Culloden remains an unlocated battlefield reference pending a reliable position, with no claim that the narrative reference itself lacks evidence. The [National Park Service](https://www.nps.gov/natr/planyourvisit/old-natchez-trace-sections.htm) distinguishes the historic Trace from the modern commemorative parkway; its marker is a corridor reference, not Jason's exact 1811 route.

The preview is Winslow Homer's **The Cotton Pickers (1876)**, LACMA M.77.68. It links thematically to agricultural labor, race and the Southern social order. It depicts Virginia after emancipation, not the Compson characters or a documented Mississippi scene. The [museum record](https://collections.lacma.org/object/79639) establishes the work; the [Wikimedia Commons file](https://commons.wikimedia.org/wiki/File:Winslow_Homer_-_The_Cotton_Pickers,_1876.jpg) supplies the faithful public-domain reproduction. Full reuse attribution is in the local `docs/images/CREDITS.md` and the database presentation record.

The dedicated CSS uses a discreet, fractured pocket watch as its background watermark, recalling Quentin's inherited watch. Reading panels stay opaque and the existing action/mention map categories retain their shared colors.

## Contextual quotation review · 15 October 2026

All 227 section–place passages were reviewed again against the complete saved originals. The initial importer cut the four dated sections at character offsets and reduced appendix evidence to the toponym with its adjacent words. That method preserved literal fragments but frequently removed the predicate, speaker or geographical relationship needed to understand them. It is superseded by `research/sound-and-fury/review-excerpts.py` and the guarded quotation-only publication workflow alongside it; do not rerun the initial importer to publish quotations.

The revised passages retain sentences or meaningful clauses, with adjacent dialogue where needed. Appendix passages now contain 13–45 words rather than isolated two- or three-word fragments. Length follows the evidence: the complete ten-word remark about Canada remains short because adjoining material would not clarify that reference. Original spelling and punctuation, including transcription anomalies, are preserved. Exact offsets, paragraph/line ranges and edition attribution accompany each passage. No translation has been composed for this revision.

Highlighting now gives the individual passage's verified forms priority over the place's accumulated aliases. The room belonging to Mother, Caddy's room, Uncle Maury's room and Miss Quentin's window have distinct phrases. Jason's later apartment highlights the offices **above** the supply store, rather than identifying the store itself as his dwelling. Five indirect passages have no highlighted location phrase: the medical recollection, the hunting recollection, the bakery detail, the reference to Mrs Burgess and the Nativity allusion. Highlighting breathing, Louis Hatcher, bread, Mrs Burgess or Jesus as a geographical name would misrepresent the evidence. Their source evidence and interpretative notes remain in the analysis.

The purpose of each published extract is the adjoining discussion of that place: to show a setting, distinguish it from a similar one, explain a reported connection, or expose an uncertain critical identification. Context is retained only when it supplies that relationship; unrelated plot is omitted. The rights assessment treats the 1931 novel and the 1946 appendix separately and does not infer permission from their availability online. Under the [article 70 criteria](https://www.bandistapp.it/norma/l-1941-633/art-70), the assessment considers the critical purpose, the necessity of each passage and the combined selection, rather than a supposed word-count safe harbor. Across the local analysis, the four sections contain 8,446 quotation words before overlap removal (7,645 distinct source words out of 96,567); the appendix contains 1,258 quotation words (1,001 distinct source words out of 5,836). These are deliberately conservative totals including evidence retained for hidden settings, not claims that every stored extract appears in the reader's atlas. Repeated passages are counted once in the distinct-source totals. The extracts remain dispersed evidence attached to place analysis and do not reproduce continuous chapters or the appendix as a reading edition. These totals document the proportionality review; they are not an automatic legal threshold.

Publication updates only the original quotation, exact highlighted forms and bibliographical location in 81 mapped-reference records and 146 stored settings. Coordinates, categories, identities, translations and presentation data are preserved. Source comparisons and an idempotence test precede publication; the public loader is then compared against the expected complete dataset.
