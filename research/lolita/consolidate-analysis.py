"""Consolidate the full reading; keep source text and quotation candidates local.

The lexical index is a research aid, NOT a publishable set of associations.
Run with the workspace's Python runtime. No network access or DB writes.
"""
import csv, hashlib, json, re
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent
WORK = ROOT / 'work/lolita'
SOURCE = 'https://online.fliphtml5.com/unwsfj/Lolita---Vladimir-Nabokov/'

def read(path):
    return json.loads(path.read_text(encoding='utf-8-sig'))

def save(path, obj):
    path.write_text(json.dumps(obj, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

notes = read(WORK / 'reading-notes.json')['sections']
for n in ['02', '03', '04', '05']:
    notes += read(WORK / f'reading-notes-{n}.json')
by_id = {n['id']: n for n in notes}
units = read(WORK / 'fliphtml-sections.json')
expected = ['foreword'] + [f'1.{n}' for n in range(1, 34)] + [f'2.{n}' for n in range(1, 37)] + ['afterword']
assert [u['id'] for u in units] == expected
assert len(notes) == len(by_id) == len(units) == 71
with (HERE / 'introductions.tsv').open(encoding='utf-8', newline='') as f:
    translations = {r['id']: r for r in csv.DictReader(f, delimiter='\t')}
assert set(translations) == set(expected)
manifest = read(WORK / 'fliphtml-pages.json')
assert [p['page'] for p in manifest] == list(range(1, 214))
for p in manifest:
    assert hashlib.sha256(Path(p['path']).read_bytes()).hexdigest() == p['sha256']

# Explicit names noticed during the sequential reading. No place inferred from
# demonyms, accents, colours, book titles or unspecified geographic endpoints.
# Pipe-separated forms are genuine textual alternatives, not replacements.
lexicon = '''District of Columbia
Ramsdale
Paris
Florida
Gray Star
Northwest
Widworth
Danube
Dorset
America
Pisa
Lyon
Italy
Hotel Mirana|Mirana Hotel
Riviera
Corfu
London
Deux Magots
Auteuil
England
Massachusetts
Nile
Florence
Vaucluse
Madeleine
Rue Bonaparte
New York|New York City
California
Pasadena
Venice
Boston
Lundy
Derby
Ocean City
Columbia University
Dayton
Ottawa
Portugal
Central Park
Arctic Canada
Prince of Wales
Pierre Point
Melville Sound
Victoria Island
New England
Lawn Street|342 Lawn Street
Bermudas
Bahamas
Mexico
Roches Roses
Our Glass Lake|Hourglass Lake
Blankton
New Hampshire
Carolinas
Chicago
Petersburg
Pisky
Middle West
Gulf
Hollywood
Savannah
Vera Cruz
Camp Q
Eden
Philadelphia
Roosevelt
Chile
Parkington
Arles
Atlantic
Scandinavia
Canada
Enchanted Hunters|The Enchanted Hunters
St. Algebra
Maine
Climax|Lake Climax
New Mexico
Hazy Hills
Briceland
Lepingville
Hunters’ Hall|Hunters' Hall
Raspberry Room
Vienna
Persia
Eiffel Tower
Niagara
St. Louis|St Louis
Cincinnati
Onyx
Eryx
Willow Island
Schwab
Pennsylvania
Dixieland
Rockies
Pacific
Canadian border
Beardsley
Virginia
Arkansas
Oklahoma
Louisiana
Lourdes
Rocky Mountains
Kansas
Main Street
Magnolia Garden
Georgia
Hobby House
Mississippi
Little Iceberg Lake
Colorado
Russian Gulch
Cannes
Arizona
Poplar Shade
Utah
Milner Pass
Lacework Cabins
Park Avenue
Little Rock
Phoenix
Los Angeles
Third Street
Broadway
Washington
Burns
Oregon
Sun Valley
Idaho
Pinedale
Farson
Nebraska
McEwen
Wheaton
Michigan
Blue Licks
Poplar Cove
Bourbon Street
New Orleans
Menninger
Independence
Missouri
Oregon Trail
Abilene
Texas
Crystal Chamber
Conception Park
Shakespeare
Hell’s Canyon|Hell's Canyon
Reno
Nevada
Death Valley
Scotty
Mission Dolores
Crater Lake
Yellowstone
North Dakota
South Dakota
Indiana
City of Cheboygan
Frigid Queen
Alps
Switzerland
Europe
Roaring Gulch
Alabama
Minnesota
Thayer Street|14 Thayer Street
School Rd
Beardsley School
Beardsley College
Greece
Orient
Naples
Butler Academy
Walton Inn
Providence
Brooklyn
Duke’s Manor|Duke's Manor
Junior Club
Dolly’s Dell|Dolly's Dell
Perilous Forest
Campus Avenue
Appalachian Mountains|Appalachia|Appalachians
New Brunswick
Tennessee
Vermont
Tibet
Ohio
Wace
Continental Divide
Magic Cave
Elphinstone
Red Rock
Kasbeam
Chestnut Court|Chestnut Castle|Chestnut Crest
Algiers
The Bustle
Soda
Hill Drug Store
Larkin’s Pharmacy|Larkin's Pharmacy
Mirana Motel
Snow
Champion
Champion Hotel
Wimbledon
Nice
Silver Spur Court
Elphinstone Hospital
Central America
Oloron
Lagore
Rolas
Ponderosa Lodge
Cedar City
Kawtagain
Larousse
Illinois
Mirandola
Quelquepart Island
Porlock
Elmira
Sheridan
Wyoming
Lebanon
Ramble
Catagela
Hoaxton
Geneva
Merrymay
Dolores, Colo
Tombstone
Sierra
Cane
Styx
Chestnut Lodge
Maker Hall
Pritchard Road
Quebec
Montreal
Toylestown
Blake
Tigermoth
San Humbertino
Grainball
Central Park West
Cantrip
Inchkeith
Dunkerque
Picture Lake
Cape Cod
India
South America
United States
Alaska
Coalmont
Killer Street
Hunter Road
Mother’s Club|Mother's Club
Duk Duk Ranch
Readsburg
Juneau
Austria
Java
Jupiter
Woodbine
Route X
Highway Y
Rubinov
Jiffy Jeff
Lakeview Hill
Moulinet
Korea
Grimm Road
Pavor Manor
Insomnia Lodge
Patagonia
Paradise
Hell Canyon
Rio
Bagration
Barda Sea
Old Faithful
Jardin des Plantes
Provence
Russia
St. Petersburg
Ithaca
Telluride
Afton
Portal
Ashland
Harvard
Cornell'''
terms = [line.split('|') for line in lexicon.splitlines() if line]
pages = read(WORK / 'fliphtml-clean-pages.json')
index = []
out_sections = []
for unit in units:
    sid = unit['id']
    note = by_id[sid]
    intros = {'it': note['intro'], **{lang: translations[sid][lang] for lang in ['en', 'fr', 'es']}}
    assert all(len(v.strip()) > 20 for v in intros.values())
    names = []
    text = unit['text']
    for aliases in terms:
        pattern = re.compile(r'(?<!\w)(?:' + '|'.join(re.escape(a) for a in sorted(aliases, key=len, reverse=True)) + r')(?!\w)', re.I)
        hits = list(pattern.finditer(text))
        if not hits:
            continue
        names.append(aliases[0])
        # Small original contexts for internal review, with no synthesized text.
        evidence = []
        for hit in hits[:3]:
            words = list(re.finditer(r'\S+', text))
            wi = next(i for i, w in enumerate(words) if w.end() > hit.start())
            start = words[max(0, wi-12)].start()
            end = words[min(len(words)-1, wi+18)].end()
            excerpt = text[start:end]
            page_matches = [p for p in pages if unit['pageStart'] <= p['page'] <= unit['pageEnd'] and pattern.search(p['body'])]
            evidence.append({'text': excerpt, 'highlightTerms': [hit.group()], 'unitOffset': hit.start(),
                'viewerPagesContainingName': [p['page'] for p in page_matches],
                'status': 'ocr-candidate-not-visually-collated',
                'categoryDemonstrated': False})
        index.append({'sectionId': sid, 'name': aliases[0], 'aliases': aliases,
            'type': 'lexical-candidate', 'defaultCategoryIfUnresolved': 'mentioned',
            'category': 'mentioned', 'classificationStatus': 'conservative-lexical-candidate-not-final-association',
            'occurrenceCount': len(hits), 'evidenceCandidates': evidence,
            'classificationNotes': note['places'], 'classificationNotesScope': 'whole-section; split into per-association rationales before import',
            'coordinates': None, 'publicCitation': {'en': 'pending', 'it': 'unavailable-unverified', 'fr': 'unavailable-unverified', 'es': 'unavailable-unverified'},
            'publicationAllowed': False})
    out_sections.append({'id': sid, 'source': SOURCE + f'#p={unit["pageStart"]}',
        'viewerPageStart': unit['pageStart'], 'viewerPageEnd': unit['pageEnd'],
        'printedPageStart': unit['pageStart']-1, 'printedPageEnd': unit['pageEnd']-1,
        'ocrWordCount': unit['words'], 'ocrSha256': unit['sha256'],
        'fullSectionRead': True, 'narrativeReview': 'reviewed-with-classification-notes',
        'intro': intros, 'locationAnalysis': note['places'], 'namedCandidates': names,
        'unlocatedSettingsIncludedInNotes': True, 'associationEvidenceStatus': 'draft-requires-individual-collation'})
save(WORK / 'location-evidence-candidates.json', index)
examples = read(WORK / 'verified-reading-examples.json')
def normalize(text):
    text = re.sub(r'([A-Za-z])[-\u00ad]\s*\n\s*([A-Za-z])', r'\1\2', text)
    return re.sub(r'\s+', ' ', text).strip().translate(str.maketrans({'“':'"','”':'"','’':"'"}))
example_summary = []
for e in examples:
    assert e['category'] in ['action', 'mentioned']
    page = next(p for p in pages if p['page'] == e['viewerPage'])
    e['ocrComparison'] = []
    for fragment in [e['quote']] + e.get('additionalEvidence', []):
        match = normalize(fragment) in normalize(page['body'])
        e['ocrComparison'].append({'fragment': fragment, 'matchesNormalizedOCR': match,
            'authority': 'visually-collated-page-image'})
        if not match:
            print('Image/OCR difference:', e['sectionId'], e['place'], fragment)
    assert all(term in e['quote'] for term in e['highlightTerms'])
    e.update(source=SOURCE + f'#p={e["viewerPage"]}', printedPage=e['viewerPage']-1,
        sourceImageSha256=manifest[e['viewerPage']-1]['sha256'], author='Vladimir Nabokov', title='Lolita',
        sourceEdition='FlipHTML5 digital witness, printed edition unverified', visuallyCollated=True,
        publicationAllowed=False, publicCitationStatus='pending-edition-and-individual-aggregate-rights-review',
        criticalPurpose='Dimostrare la differenza fra scena ambientata, notizia, progetto, riferimento geografico e commento metanarrativo.',
        necessityAndProportion='Frammento geografico circoscritto alla motivazione indicata; evitare duplicati e rivalutare il totale insieme a tutti gli altri estratti prima della pubblicazione.',
        translatedQuotation={lang:{'status':'unavailable-unverified','text':None} for lang in ['it','fr','es']})
    example_summary.append({k:e[k] for k in ['sectionId','place','category','narrativeLevel','viewerPage','printedPage','reason','source']})
save(WORK / 'verified-reading-examples.json', examples)
save(HERE / 'verified-association-summary.json', example_summary)
fragments = list(dict.fromkeys(f for e in examples for f in [e['quote']] + e.get('additionalEvidence', [])))
aggregate_words = sum(len(f.split()) for f in fragments)
report = {'bookId': 'lolita', 'title': 'Lolita', 'author': 'Vladimir Nabokov', 'originalLanguage': 'en',
    'analysisDate': '2026-10-13', 'selectedSource': SOURCE,
    'sourceEdition': {'publisher': None, 'year': None, 'status': 'digital-witness-identified-print-edition-unverified',
        'referenceConvention': 'viewer page and printed page of this digital witness; not Olympia Press pagination'},
    'coverage': {'viewerPagesAcquired': 213, 'viewerPagesRead': [1, 213], 'partOneChapters': 33,
        'partTwoChapters': 36, 'forewordRead': True, 'afterwordRead': True,
        'dedicationAndContentsChecked': True, 'editorialBiographyRead': True,
        'sectionReviewsCompleted': 71, 'completeReadingAndSectionReview': True,
        'fullyCollatedQuotationDataset': False, 'completeBookAddition': False},
    'editorialBiography': {'viewerPage': 213, 'printedPage': 212, 'includedInNovelLocations': False,
        'reason': 'Unsigned editorial biography, not a section of Humbert’s narrative or the author’s afterword; not adopted as authority.',
        'verifiedError': {'claim': 'Father killed four years after 1919 exile', 'correction': '28 March 1922',
            'source': 'https://www.thenabokovian.org/life/chronology', 'imageVisuallyChecked': True}},
    'method': {'sourceAcquisition': '213 actual image URLs observed in the public browser DOM; ordered local images plus SHA-256 manifest',
        'text': 'English OCR read sequentially; image witness controls quotation wording. OCR errors are not editorial corrections.',
        'category': 'Actual narrated scene required for action; use mentioned if in doubt. Plans, summaries, addresses, metaphors, news and literary allusions are distinct from scenes.',
        'lexicalIndex': 'Non-exhaustive candidate index for finding short contexts; not a substitute for full reading or per-association verification.',
        'fictionalGeography': 'No coordinates from an invented name, distance, homonym or critical model alone.',
        'narrativeLevels': 'Present memoir action, recalled scene, embedded testimony, letter, dream, poem, play, prototype novel, author biography and editorial framing recorded separately in notes.'},
    'localEvidenceIndex': 'work/lolita/location-evidence-candidates.json',
    'visuallyCollatedExamples': len(examples), 'verifiedAssociationSummary': 'verified-association-summary.json',
    'lexicalCandidateCount': len(index), 'lexicalNameCount': len(set(r['name'] for r in index)),
    'rights': {'originalPublicDomainInItalyVerified': False, 'quotationPublication': 'pending-individual-and-aggregate-assessment',
        'internalEvidenceAggregate': {'witness': SOURCE, 'uniqueFragments': len(fragments), 'words': aggregate_words,
            'wholeWitnessOCRWords': sum(u['words'] for u in units), 'distributedToSite': False,
            'purpose': 'Test narrative classification using narrowly selected geographical evidence, accompanied by individual critical explanations.',
            'necessity': 'Keep setting and event or the form of a report where needed to distinguish scene from mention; omit unrelated descriptive and sexual details.',
            'proportion': 'Internal examples only, not the complete future quotation selection; remove duplicate fragments. Counts are an audit aid and do not establish a legal basis by themselves.',
            'economicCompetitionAssessment': 'Not published. Must assess the final selection and presentation before publication, including every added fragment and every edition/translation.'},
        'translations': {lang: {'publicDomainSearch': 'no-verified-reusable-edition-found', 'authenticQuotation': 'unavailable', 'silentOriginalFallback': False} for lang in ['it', 'fr', 'es']},
        'editorialIntroductions': 'New editorial prose translated into four languages; not quotations or translations attributed to published translators.'},
    'pendingBeforePublication': ['Visually collate every selected original quotation against the page image.',
        'Split section notes into one rationale and category per association, including unnamed settings.',
        'Resolve identification and coordinate sources; keep fictional or ambiguous settings unlocated.',
        'Evaluate necessity/proportion of each quotation and the aggregate per edition; identify publisher/edition or state the verified digital witness without fabricated provenance.',
        'Verify translation excerpts/rights independently or retain explicit unavailable status in each language.',
        'Prepare painting credits, theme and watermark, then validate/import the final dataset.'],
    'databaseImported': False, 'published': False, 'sections': out_sections}
save(HERE / 'section-analysis.json', report)
md = ['# Lolita: lettura integrale e analisi per sezione', '',
    'Fonte scelta: [testimone FlipHTML5](' + SOURCE + '). Analisi del 13 ottobre 2026.', '',
    '**Lettura e note narrative completate; aggiunta al sito ancora pendente.** Sono stati letti prefazione, 69 capitoli e postfazione. Dedica, indice e biografia editoriale sono stati controllati separatamente. Le introduzioni redazionali sono disponibili in italiano, inglese, francese e spagnolo nel file `section-analysis.json`.', '',
    f'Le 213 immagini sono conservate localmente con impronte SHA-256. L’indice di lavoro contiene {len(index)} candidati lessicali: non è un conteggio di location approvate né un’analisi automatica sostitutiva della lettura. {len(examples)} riscontri esemplificativi sono stati collazionati visivamente; gli altri contesti OCR richiedono verifica individuale.', '',
    'I numeri del lettore e quelli stampati sono distinti. Editore e anno della copia cartacea non sono verificati e non sono attribuiti a Olympia Press. Le categorie riportate nelle note sono motivate narrativamente; i dubbi vanno risolti mantenendo `mentioned`. I luoghi anonimi e i diversi livelli narrativi sono inclusi nelle note.', '',
    'Prima dell’importazione restano la collazione di ogni citazione selezionata, le motivazioni strutturate per ogni associazione, le fonti geografiche e la valutazione individuale e complessiva degli estratti. Le citazioni tradotte non verificate rimangono indisponibili. Nessun dato è stato pubblicato o importato.', '']
for s in out_sections:
    label = {'foreword':'Prefazione di John Ray', 'afterword':'Postfazione d’autore'}.get(s['id'], 'Capitolo ' + s['id'])
    md += ['## ' + label, '', f'Lettore: pp. {s["viewerPageStart"]}–{s["viewerPageEnd"]}; numerazione stampata: pp. {s["printedPageStart"]}–{s["printedPageEnd"]}. [Fonte]({s["source"]})', '', s['intro']['it'], '', '**Luoghi e funzione narrativa.** ' + s['locationAnalysis'], '']
(HERE / 'ANALISI.md').write_text('\n'.join(md), encoding='utf-8')
save(HERE / 'page-manifest.json', [{k:v for k,v in p.items() if k != 'path'} for p in manifest])
verification = read(HERE / 'fliphtml5-verification.json')
verification.update(fullFlipHTML5TextAcquired=True, completeReadingAndSectionReview=True,
    fullNarrativeAnalysisCompleted=False, structuredLocationEvidenceCompleted=False,
    readingRecord='section-analysis.json', pageManifest='page-manifest.json')
save(HERE / 'fliphtml5-verification.json', verification)
print(json.dumps({'sectionsReviewed': len(out_sections), 'languagesPerIntroduction': 4, 'pageImagesVerified': len(manifest),
    'lexicalCandidates': len(index), 'lexicalNames': report['lexicalNameCount'], 'publication': 'pending'}, ensure_ascii=False))
