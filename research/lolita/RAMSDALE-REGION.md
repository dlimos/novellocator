# Ramsdale: a regional outline instead of a point

16 October 2026. Pilot explicitly limited to Ramsdale. Existing literary identities, section associations and action/mention categories remain unchanged. No novel excerpt or translation is added, republished or given a new verification status.

## Evidence and precision

The existing complete analysis identifies New England in Part I, chapter 10, where Humbert reaches Ramsdale and visits the Haze household. See `ANALISI.md`, chapter 1.10, and the original digital-witness/edition limitations in `section-analysis.json`. The geographical claim is regional. Existing passage-publication gaps remain pending: the outline does not make a pending quotation publishable.

Dieter E. Zimmer’s specialist study *Lolita, USA*, “Trip One”, https://dezimmer.net/LolitaUSA/Trip1.htm, identifies Ramsdale with New England and explicitly presents the southern Berkshires/southwestern Massachusetts identification as a hypothesis. This pilot therefore uses New England, not a selected town, a Massachusetts-only outline or a New Hampshire identification borrowed from film adaptations. The inference is strong at regional level and unresolved within it. No numerical confidence, probability density or equal likelihood across the region is claimed.

The Census definition of New England comprises Connecticut, Maine, Massachusetts, New Hampshire, Rhode Island and Vermont: https://www2.census.gov/econ2007/Reference_materials/htm%20files/geocendiv.htm. The line is the boundary of that geographical reference region, not a recovered boundary of fictional Ramsdale.

## Boundary provenance

US Census Bureau TIGERweb, Census 2020 Census Divisions, division code 1. Source service: https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Region_Division/MapServer/9. `ramsdale-census-source.json` records the precise request, fields, service response and geometry. WGS84 rings are generalized by the official service with `maxAllowableOffset=0.02` degrees and rounded to four decimals, for regional-scale reading. The resulting two closed paths (209 vertices) are rendered as a polyline, without fill. This is a modern generalized geographical outline, not a reconstruction of a town boundary or a historical cadastral survey.

The number/name label is anchored on a vertex of the regional boundary. It is a text label, not a point marker or a town centre. `coords` retains the previous representative point as internal legacy data, but the new renderer, navigation, visible coordinates, Street View and coordinate columns in mapped CSV records do not use it to represent Ramsdale. Other places, including the separately cited real region New England, keep their existing representation.

## Implementation and publication

`ramsdale-outline.json` is the reviewed place patch; `prepare-ramsdale-outline.cjs` generates it and the scoped, idempotent publication SQL. Only the `regional-ramsdale` place in `books.metadata.geographicReview.regionalPlaces` is patched, plus its four-language descriptive translations. Other regions, books, category assignments, source IDs and original texts remain intact. The grouped navigation propagates the same geometry to every appearance of Ramsdale.

The shared renderer draws category-coloured dashed lines with a light/selected halo, clickable through the normal place/section attributes. No Ramsdale point symbol is drawn. Selection and overview frame the complete boundary. Layer filters hide the line and renumber visible records as before. The card declares the regional uncertainty, links the Census geometry source and omits a point coordinate and Street View. A dashed-outline explanation appears only in books with an outline. The four interface languages are supported.

Tests cover boundary closure and bounds, both narrative categories, selection/hit attributes, no point symbol, filters, regional framing, blank point-coordinate exports and idempotent Ramsdale-only publication. Browser QA checks the map and card. The geographic atlas remains distinct from the literary views. Assets/code publish only on the `docs` branch; content metadata is applied separately in Supabase.
