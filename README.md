# Novel Locator

Explore the places behind the stories. A literary atlas with a shared HTML, CSS and JavaScript interface and separate datasets for each book.

## Current scope

- **Ulysses** by James Joyce: 18 episodes and 115 distinct places.
- **In Search of Lost Time** by Marcel Proust: seven volumes, 23 distinct places and 33 scene records.
- **War and Peace** by Leo Tolstoy: 15 books and two epilogues, 62 distinct places and 91 scene records. Sixteen sections have maps; the Second Epilogue is philosophical.
- **Moby-Dick** by Herman Melville: 135 chapters and an epilogue, 21 narrative settings, 42 chapter references and 14 unlocated settings. 30 sections contain mapped places; other sections have contextual regional views.
- **The Great Gatsby** by F. Scott Fitzgerald: nine chapters, 88 mapped places, 50 action references and 82 geographical mentions. Fictional buildings and ambiguous locations retain original-text evidence without guessed coordinates. Descriptions use four languages; excerpts retain the original English. Its Art Déco theme uses dark teal, ivory and gold.
- English is the default language; Italian, French and Spanish are available.
- Esri ArcGIS Maps SDK for JavaScript, five basemaps and external Google Street View links.

The website is hosted as static files on GitHub Pages and now loads published books from Supabase's read API. Configuration is in `docs/supabase-config.js`; only the publishable key belongs there. Novel datasets in `docs/data/` and research JSON files in `tests/fixtures/` are kept locally and excluded from Git. The public site depends on Supabase; an outage displays a translated error. The home catalogue is rendered from public editorial metadata in `docs/content/books.js`; login and an editorial interface are not implemented yet. PostgreSQL migrations and TypeScript import/export tools are under `database/` and `scripts/database/`. See [database/README.md](database/README.md).

For a new book, run `npm run db:prepare -- --book=gatsby` to prepare only that book. Run the numbered local scripts in `database/generated/gatsby/sql-editor/` in Supabase before publishing the home card. The scripts, original English text and audit files remain local and ignored by Git. Gatsby's location evidence comes from the nine original-English chapters of the Standard Ebooks edition, with geographical models supported by Preservation Long Island and NYC Parks and real-site addresses checked separately. Reference coordinates locate regions and streets as extents; they do not establish fictional house addresses or exact character positions.

## Files

CSV data exports in `docs/*.csv` are also kept only locally and excluded from Git. Download links generate UTF-8 CSV files directly from the loaded Supabase content via `docs/csv-export.js`, in the current language. Content checks require the local CSV copies as well as the datasets and research snapshots after a fresh clone.

- `docs/`: complete website and GitHub Pages source directory.
- `docs/data/`: local-only book datasets and translated content, excluded from Git.
- `docs/content/`: public catalogue metadata and editorial translations; book-specific names stay here.
- `docs/locales/ui.js`: shared interface translations.
- `docs/book-themes.css`: reusable visual profiles, selected through metadata rather than book IDs.
- `docs/LEGGIMI.md`: detailed Italian documentation, coordinate methodology and references.
- `tests/`: automated integrity and interface checks using Node.js and browser mocks.
- `tests/fixtures/`: local-only JSON reference snapshots for coordinate and translation comparisons.

## Run and check

The committed website files need no build step or package installation. Open `docs/index.html` or serve the `docs/` directory with a static web server. Internet access is required for Supabase, mapping services and web fonts. After changing `scripts/database/content.ts`, run `npm run build:browser` and commit the generated `docs/content-adapter.js`.

The import/export tools and content checks require the local `docs/data/` and `tests/fixtures/*.json` copies. Restore these from your local backup after a fresh clone. Hosting the committed website files does not require them.

With Node.js 20 or later, install development dependencies and run:

```sh
npm ci
npm test
```

The site tests check chapter navigation, coordinate consistency, all four languages, basemaps and Street View using browser mocks; they **do not verify actual WebGL rendering or mapping-service availability**. The database test executes migrations and imports in PostgreSQL/PGlite, checks exact reconstruction and tests RLS access for anonymous visitors, readers, editors and administrators. `npm run db:prepare` generates local import files; `npm run db:export` generates review copies of the browser datasets.

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

Every section of Ulysses, Proust and War and Peace has a sourced original-language excerpt (English, French and Russian respectively). All 219 chapter–place passages also include an original; Tolstoy’s 91 location passages offer the Russian source alongside the historical English Maude translation. Excerpts always display the original, English when available, and the chosen language when available, without duplicates. The Russian and translated editions have independent source references, as their wording and chapter divisions can differ. Historical public-domain translations include Scott Moncrieff (Proust volumes 1–6), Maude and Bienstock (Tolstoy section openings). Modern revisions, unidentified translators and editorial notes are excluded.

The “All places” button opens the whole novel’s mapped locations, deduplicated by place identifier. Each location lists its sections. The view has a shareable `#<hashPrefix>-all` link and survives language changes. Unlocated scenes do not acquire speculative coordinates. Larger legend samples match the numbered circles, diamonds and selected marker used on the map.

## Action and geographical mentions

The shared engine uses two independent Esri GraphicsLayers. Green markers denote action settings; terracotta markers denote geographical mentions. Circles identify buildings or historical sites; diamonds identify streets, areas or uncertain positions. The selected marker keeps its category color and has a gold outline. The TOC can hide either category or every marker, independently of the basemap. `layers=action,mentioned`, `layers=action`, `layers=mentioned` and `layers=none` are preserved when changing language; `citation` preserves the selected mention.

The original English Joyce and Melville, French Proust and Russian Tolstoy corpora were scanned section by section. The reference fixture records coverage digests and literal passages. Explicit-name matching is checked for known homonyms; personal names, Amiens Street, the Geneva Barracks and Moscow’s Kitay-gorod are not confused with distant cities or China. This is an expanding index rather than an assertion that every alias has been found. Current added references: Ulysses 186 across 55 places; Proust 231 across 67; War and Peace 136 across 30; Moby-Dick 553 across 266. All 276 previously mapped Melville positions are recovered across the two layers, preserving their coordinates. Narrated past events and embedded stories remain action settings; comparisons, origins and planned routes belong to mentions. A few pre-existing address recollections and visible buildings are classified as mentions using `placeCategories`.

Data: `citedPlaces` contains geographic records; chapter `citations` contains `{placeId, category, excerpt}` with the original-language source. These do not replace the core `places`/`placeText` records. All four languages have cited-location CSVs and shared interface labels. New citations have verified original passages, and only existing verified public-domain translations are displayed. A representative region point is explicitly labelled; a fictional place without a defensible earthly identification still has no invented coordinates. Global view avoids covering an action marker with a mention at the same place; hiding action reveals that place in the mention layer.
