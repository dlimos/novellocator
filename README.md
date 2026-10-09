# Novel Locator

Explore the places behind the stories. A literary atlas with a shared HTML, CSS and JavaScript interface and separate datasets for each book.

## Current scope

- **Ulysses** by James Joyce: 18 episodes and 115 distinct places.
- **In Search of Lost Time** by Marcel Proust: seven volumes, 23 distinct places and 33 scene records.
- **War and Peace** by Leo Tolstoy: 15 books and two epilogues, 62 distinct places and 91 scene records. Sixteen sections have maps; the Second Epilogue is philosophical.
- **Moby-Dick** by Herman Melville: 135 chapters and an epilogue, 21 narrative settings, 42 chapter references and 14 unlocated settings. 30 sections contain mapped places; other sections have contextual regional views.
- English is the default language; Italian, French and Spanish are available.
- Esri ArcGIS Maps SDK for JavaScript, five basemaps and external Google Street View links.

The current application is a static website. Database, user authentication and the editorial administration interface have not been implemented. The website is in `docs/`, ready for GitHub Pages when repository settings support and enable that source.

## Files

- `docs/`: complete website and GitHub Pages source directory.
- `docs/data/`: book datasets and translated content.
- `docs/locales/ui.js`: interface translations.
- `docs/LEGGIMI.md`: detailed Italian documentation, coordinate methodology and references.
- `tests/`: automated integrity and interface checks using Node.js and browser mocks.
- `tests/fixtures/`: reference snapshots for coordinate and translation comparisons. These are test inputs, not the editable website datasets.

## Run and check

The website needs no build step or package installation. Open `docs/index.html` or serve the `docs/` directory with a static web server. Internet access is required for mapping services and web fonts.

With Node.js 20 or later, run:

```sh
npm test
```

The tests check chapter navigation, coordinate consistency with source records, all four languages, basemap state and Street View links. They use mocks and **do not verify actual WebGL rendering or mapping-service availability in a browser**.

## Known limitations

The reported blank-map issue with the default Esri OpenStreetMap layer remains unresolved. Browser verification is required before public release. Historic positions vary in precision; an address, area marker or documented fictional model is not an exact location of a character. Each record explains its sources and positioning method. The book datasets do not claim to include every place mentioned in the text.

War and Peace follows the 15-book structure of the Maude translation hosted by Project Gutenberg. Each mapped scene links to its own chapter. Most city points come from published Wikipedia/Wikidata geographic references and represent areas. The Shevardino point is computed from mapped OpenStreetMap earthworks; the Raevsky Battery point comes from a published museum itinerary. Yasnaya Polyana and Nikolskoye-Vyazemskoye are explicitly identified as literary models. Historical mentions, recalled journeys and visible landmarks are distinguished in scene descriptions. Private houses, hunting tracks and exact battle positions without evidence remain unlocated. The source fixture preserves coordinate identifiers and short public-domain textual excerpts for auditing.

## Editing content

Edit the corresponding `docs/data/<book>.js` and `docs/data/<book>-i18n.js` files. Keep stable identifiers and source links; update all supported translations and affected CSV exports. See the detailed documentation for adding books or languages. Changes to audited coordinates should be supported by source evidence and reviewed against the test reference snapshots. A chapter can supply `placeSources` for scene-specific references and an empty `places` array with `emptyMessage` when there is no narrative geography to map.

## Credentials and future hosting

Keep hosting passwords, database connection strings and deployment profiles outside Git. Examples may use placeholders. Configure deployment secrets in the selected provider or GitHub Secrets when deployment is introduced.

External source documents, temporary research downloads and the previous hosting-service configuration are not bundled here. Source links and attributions remain with the website. No open-source license is assigned by this repository; third-party maps, fonts and referenced datasets retain their respective terms.

## Moby-Dick

135 individual chapters and the epilogue; 21 narrative settings, 42 chapter–setting references and 14 unlocated settings. Sources are checked against the complete English Project Gutenberg text, with short original excerpts, separate coordinate citations and four language interfaces. Markers include narrated settings and embedded stories; allusions, origins and planned routes are excluded. The regional map overview prioritizes settings; references elsewhere remain selectable. Unknown settings have contextual regional views, not ship positions.

Water Street is identified as Liverpool using the Melville Electronic Library critical edition. Seamen’s Bethel is a documented model, not an exact fictional interior. Tranque and the Arsacides remain unlocated because of conflicting geographic clues. No point is invented for the Pequod’s wreck or Ishmael’s rescue. CSV exports contain mapped and unlocated references. The source fixture records coordinates, identifiers, English excerpts and chapter anchors; it is not independent proof of literary identification.

The generic chapter schema also supports `placeQuotes`, `placeRoles`, `overviewPlaces`, `initialView` and `unlocatedPlaces`. Omitting these fields preserves existing book behavior.

## Literary excerpts

Every section of Ulysses, Proust and War and Peace has a sourced original-language excerpt (English, French and Russian respectively). 219 chapter–place references also have passages from their own sections or an explicitly sourced recalled scene: 128 original passages and 91 excerpts from the historical Maude translation. Section passages are labelled separately from location passages; a passage does not prove a model’s real street address. Original quotations are protected from interface translation.

Historical public-domain translations are shown with the original when the selected language matches an available edition: Scott Moncrieff for Proust’s first six volumes, and Maude (English) / Bienstock (French) for Tolstoy. Section panels retain the original when no verified translation in the chosen language is available. Tolstoy’s location passages are separately labelled as English Maude translations in every interface; the Russian original remains in the section panel. Modern revisions, unidentified translators and editorial notes are excluded. Edition, translator and rights sources are attached to the quotations; the test fixture records the source paragraphs. Russian and Maude chapter divisions differ, so source references are retained independently.
