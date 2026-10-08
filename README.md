# Novel Locator

Explore the places behind the stories. A literary atlas with a shared HTML, CSS and JavaScript interface and separate datasets for each book.

## Current scope

- **Ulysses** by James Joyce: 18 episodes and 115 distinct places.
- **In Search of Lost Time** by Marcel Proust: seven volumes, 23 distinct places and 33 scene records.
- **War and Peace** by Leo Tolstoy: 15 books and two epilogues, 62 distinct places and 91 scene records. Sixteen sections have maps; the Second Epilogue is philosophical.
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
