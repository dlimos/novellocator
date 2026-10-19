"""Integrity checks for the research dossier, not automatic narrative verification."""
import collections,hashlib,json,pathlib
R=pathlib.Path(__file__).resolve().parent
read=lambda name:json.loads((R/name).read_text(encoding='utf-8'))
S=read('sections.json');A=read('analysis.json');I=read('introductions.json')
assert [s['id'] for s in S]==list(range(1,62))
assert [s['id'] for s in A['sections']]==list(range(1,62))
assert len(I)==61
assert S[0]['paragraphs'][0].startswith('It is a truth universally acknowledged')
assert S[-1]['paragraphs'][-1].endswith('had been the means of uniting them.')
assert len(S[-1]['paragraphs'])==15
assert A['source']['corpusSha256']==hashlib.sha256((R/'corpus/original.txt').read_bytes()).hexdigest()
counts=collections.Counter();quotes=[]
for source,section in zip(S,A['sections']):
    assert section['completeNarrativeRead'] is True
    assert source['sha256']==section['sourceSha256']
    assert len(source['paragraphs'])==section['paragraphs']
    assert section['references']
    assert len({r['placeId'] for r in section['references']})==len(section['references'])
    intro=I[str(section['id'])]
    assert set(intro)=={'it','en','fr','es'}
    for text in intro.values():
        assert len(text)>40 and 'http' not in text
        assert 'map controls' not in text.lower() and 'luoghi disponibili' not in text.lower()
    for r in section['references']:
        q=r['evidence'];p=source['paragraphs'][q['sourceParagraph']-1]
        assert q['quote'] in p and r['originalParagraph']==p
        assert r['rationaleIt'] and r['category'] in ('action','mentioned')
        assert all(term.casefold() in q['quote'].casefold() for term in q['highlightTerms'])
        assert r['publicationStatus']=='analysis-only'
        counts[r['category']]+=1;quotes.append(q['quote'])
assert counts=={'action':96,'mentioned':311}
assert sum(counts.values())==A['counts']['associations']==407
assert not any(r['category']=='action' for r in A['sections'][60]['references'])
assert A['exhaustiveGeographicalInventoryCertified'] is False
aligned=read('aligned-translations.json');n=0
for row in aligned:
    for lang,q in row['translations'].items():
        corpus=read(f'corpus/{lang}-sections.json');source=corpus[row['chapter']-1]
        assert q['quote']==source['paragraphs'][q['sourceParagraph']-1]
        assert q['sourceChapterSha256']==source['sha256']
        assert all(t.casefold() in q['quote'].casefold() for t in q['highlightTerms'])
        assert q['verificationStatus']=='verified';n+=1
assert n==8
for lang in ['fr','es']:
    corpus=read(f'corpus/{lang}-sections.json')
    assert [s['id'] for s in corpus]==list(range(1,62))
    assert all(len(s['paragraphs'])>3 for s in corpus)
collation=read('edition-collation.json')
assert len(collation)==407
report=dict(chaptersRead=61,narrativeParagraphs=sum(len(s['paragraphs']) for s in S),
    originalWords=sum(len(s['text'].split()) for s in S),
    placeIdentities=A['counts']['distinctPlaceIdentities'],associations=sum(counts.values()),
    action=counts['action'],mentioned=counts['mentioned'],
    multilingualIntroductions=61*4,translationWitnessChapters={'fr':61,'es':61},
    individuallyAlignedTranslationPassages=n,
    selectedOriginalEvidenceWordsIncludingRepeats=sum(len(q.split()) for q in quotes),
    uniqueSelectedOriginalEvidenceWords=sum(len(q.split()) for q in set(quotes)),
    literalEvidenceChecks='passed',publication='not-published',
    limitations=['Printed-edition collation not complete.','Historical geography and final boundaries not complete.',
        'Italian reuse basis not verified; authentic English fallback remains possible.',
        'Only eight translated passages aligned; remaining translations pending.',
        'No illustrated views, cover, theme or database import produced in this analysis phase.'])
(R/'verification.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(report,ensure_ascii=False,indent=2))
