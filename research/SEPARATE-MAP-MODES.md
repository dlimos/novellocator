# Separate geographical and imaginary reading modes

16 October 2026. User decision: retain the illustrated maps in a separate collection; never mix their points with geographical markers.

The normal catalogue and ordinary `atlas.html?book=…` links now open geography. The new `imaginary.html` collection links to `atlas.html?book=…&mode=imaginary`. A visible navigation bar identifies the current mode and links to the other mode and the collection. Language changes preserve the mode. The previous `illustrated.html` entry redirects explicitly into imaginary mode.

Availability comes from the database: an existing native illustrated presentation or `books.metadata.illustratedView`. No book IDs, new quotations or image assets are hardcoded in the shared engine. The initial collection has three novels: García Márquez, Faulkner and Proust. Existing catalogue painting credits remain unchanged.

`atlas-modes.js` creates independent display views after the geographical review. In imaginary mode it retains only records with image anchors and no terrestrial coordinates, geographical switching or external real-place records. Source chapter IDs, narrative categories, introductions and authentic quotations are retained. Paris-only sections may have no illustrated markers; the image caption says so. Geography retains the existing real places and documented models. The native Macondo dataset becomes a normal geographical view with its four previously documented geographical records, including the regional diamond; its 29 image records are excluded. This does not identify Macondo with a real town. Proust and Faulkner use their original reviewed geographic datasets without the panorama overlay. No terrestrial coordinate, classification or source text is changed in the database.

Image mode removes the original-geography export override and source chapter pointer so it cannot export geographic records through the image dataset. It does not expose download links that would claim a geographical export. The underlying canonical data and analysis remain intact. Map numbers continue to be computed from visible category layers.

Validation covers three books, four languages, independent coordinates/anchors, source immutability, source quotations, empty sections, exports and catalogue links; the existing atlas/controller/database suites run as regressions. Browser checks cover the three-entry collection, both modes, external navigation, language preservation and mobile layout. Publication uses only the `docs` branch; no database migration or content mutation is needed.
