"""Validate source records and declared release status, not inventory completeness."""
import hashlib
import json
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent

def load(name):
    return json.loads((HERE / name).read_text(encoding='utf-8-sig'))

editorial = load('editorial.json')
review = load('narrative-review.json')
comparison = load('transcription-comparison.json')
status = load('import-status.json')
policy = load('source-policy.json')
assert policy['editionIdentificationRequired'] is False
assert policy['isbnRequired'] is False and policy['ocrAllowed'] is False
assert policy['acceptedOriginalSource'] == review['sourceId']
expected = list(range(1, 32))
for data in (editorial, review, comparison):
    assert [c['chapter'] for c in data['chapters']] == expected
for chapter in editorial['chapters']:
    for language in ('en', 'it', 'fr', 'es'):
        assert chapter[language].strip()
for chapter in review['chapters']:
    original = ROOT / 'work/mockingbird' / f"chapter-{chapter['chapter']:02d}.txt"
    assert hashlib.sha256(original.read_bytes()).hexdigest() == chapter['sourceSha256']
    assert chapter['reading'] == 'complete-transcription'
    assert chapter['associationInventoryStatus'] == 'candidate-review-pending-individual-evidence'
assert not review['publicationReady'] and not review['editionVerified']
assert not status['fullNarrativeReviewComplete']
if status['cataloguePublished']:
    assert status['databaseUpdated'] and status['remoteStatus'] == 'published'
    assert status['verifiedPublicQuotationCount'] == 97
    assert load('public-api-verification.json')['passed']
else:
    assert not status['databaseUpdated'] and status['remoteStatus'] == 'not-imported'
assert comparison['claimedEditionVerified'] is False
assert comparison['independenceOfWitnessesEstablished'] is False
images = {}
for relative in ('research/mockingbird/neighbourhood-study.png', 'research/mockingbird/preview-desktop.png', 'docs/images/mockingbird-tanner-thankful-poor.jpg'):
    with Image.open(ROOT / relative) as image:
        images[relative] = list(image.size)
        image.verify()
report = {
    'checked': '2026-10-23',
    'scope': 'Source record structure, chapter hashes, image decoding and consistency of declared release status. Does not certify a completed association inventory.',
    'passed': True,
    'chapters': 31,
    'draftIntroductions': 124,
    'sourceChapterHashesMatched': 31,
    'originalSourceAccepted': True,
    'editionIdentificationRequired': False,
    'minimumTokenSimilarity': min(c['tokenSimilarity'] for c in comparison['chapters']),
    'images': images,
    'cataloguePublished': status['cataloguePublished'],
    'databaseUpdated': status['databaseUpdated'],
}
(HERE / 'draft-verification.json').write_text(json.dumps(report, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
print(json.dumps(report, ensure_ascii=False, indent=2))
