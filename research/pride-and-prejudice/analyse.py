"""Materialize and verify manually reviewed narrative associations.

No place or category is generated from keyword presence. Concordance is a separate
check used to flag omissions for editorial consideration.
"""
import collections, hashlib, json, pathlib, re
from decisions import REVIEWS
R=pathlib.Path(__file__).resolve().parent
S=json.loads((R/'sections.json').read_text(encoding='utf-8'))
assert set(REVIEWS)==set(range(1,62))
SOURCE='https://raw.githubusercontent.com/GITenberg/Pride-and-Prejudice_1342/master/1342.txt'
NAMES={
 'longbourn':'Longbourn', 'netherfield':'Netherfield', 'meryton':'Meryton',
 'hunsford':'Hunsford', 'rosings':'Rosings', 'pemberley':'Pemberley',
 'lucas-lodge':'Lucas Lodge', 'lambton':'Lambton', 'kympton':'Kympton',
 'hertfordshire':'Hertfordshire', 'kent':'Kent', 'derbyshire':'Derbyshire',
 'london':'London', 'gracechurch-street':'Gracechurch Street',
 'grosvenor-street':'Grosvenor Street','edward-street':'Edward Street',
 'cheapside':'Cheapside', 'st-jamess':"St James’s", 'st-clements':"St Clement’s",
 'brighton':'Brighton', 'ramsgate':'Ramsgate', 'gretna-green':'Gretna Green',
 'bromley':'Bromley', 'westerham':'Westerham', 'bell-inn':'The Bell, Bromley', 'george-inn':'The George, città anonima dell’Hertfordshire',
 'matlock':'Matlock', 'chatsworth':'Chatsworth', 'dovedale':'Dovedale',
 'peak':'Peak District', 'oxford':'Oxford', 'blenheim':'Blenheim',
 'warwick':'Warwick', 'kenilworth':'Kenilworth', 'birmingham':'Birmingham',
 'bakewell':'Bakewell', 'cambridge':'Cambridge', 'york':'York',
 'liverpool':'Liverpool', 'clapham':'Clapham', 'epsom':'Epsom',
 'barnet':'Barnet', 'hatfield':'Hatfield', 'newcastle':'Newcastle',
 'eastbourne':'Eastbourne', 'scarborough':'Scarborough', 'bath':'Bath',
 'england':'England', 'great-britain':'Great Britain', 'scotland':'Scotland',
 'north-england':'Nord dell’Inghilterra, non delimitato',
 'south-england':'Sud dell’Inghilterra, non delimitato', 'lakes':'Lake District',
 'haye-park':'Haye Park', 'stoke-house':'Grande casa a Stoke', 'ashworth':'Ashworth',
 'pulvis-lodge':'Pulvis Lodge', 'forster-house':'Casa del colonnello Forster',
 'return-journey':'Viaggio di ritorno da Lambton a Longbourn',
 'longbourn-walk':'Passeggiata nel territorio di Longbourn',
 'oakham-walk':'Passeggiata verso Oakham Mount', 'oakham-mount':'Oakham Mount',
 'rosings-edge-lane':'Vialetto lungo il confine esterno di Rosings',
 'london-lodgings':'Alloggi di Wickham e Lydia in una strada londinese omessa',
 'little-theatre':'Little Theatre, Londra',
 'bingley-new-estate':'Nuova tenuta di Bingley, contea non nominata',
}
# Review passages cropped by source boundaries only. No inserted ellipses or names.
OVERRIDES={
 (35,'netherfield'):('But it was not till the evening','From that moment','Netherfield'),
 (35,'london'):('We accordingly went','He had before believed','We accordingly went'),
 (35,'ramsgate'):('I joined them unexpectedly',"Mr. Wickham's chief object",'I joined them'),
 (46,'longbourn'):('With the kindest concern','Could she exert herself','Longbourn'),
 (52,'london-lodgings'):('He saw Wickham','Since such were her feelings','Lydia'),
 (52,'gracechurch-street'):('They met again on Sunday','','our visitor'),
}
def quote(ch,pid,p,term):
    para=S[ch-1]['paragraphs'][p]
    if (ch,pid) in OVERRIDES:
        start,end,term=OVERRIDES[ch,pid]
        q=para[para.index(start):para.index(end) if end else len(para)].strip()
    elif len(para.split())<=180:q=para
    else:
        # Locate the sentence carrying the manually selected wording, retain
        # neighboring sentences as context. Full paragraph remains in the audit.
        pos=para.lower().index(term.lower())
        bounds=[0]+[m.end() for m in re.finditer(r'[.!?][\"\x27]?(?=\s+[A-Z\"\x27]|$)',para)]
        at=max(i for i,x in enumerate(bounds) if x<=pos)
        a=bounds[max(0,at-1)]; b=bounds[min(len(bounds)-1,at+2)]
        q=para[a:b].strip() or para
    assert q and q in para,(ch,pid)
    assert term.lower() in q.lower(),(ch,pid,term,q)
    return dict(quote=q,language='en',type='original',highlightTerms=[term],
        verificationStatus='verified-against-acquired-transcription',
        sourceParagraph=p+1,sourceUrl=SOURCE,
        attribution=f'Jane Austen, Pride and Prejudice (1813), Project Gutenberg 1342, anonymous transcription, updated 15 February 2015; chapter {ch}, paragraph {p+1}. Underlying print edition unspecified.')
audit=[]
for s in S:
    ch=s['id'];r=REVIEWS[ch];seen=set();references=[]
    for pid,cat,p,term,reason,level in r['records']:
        assert pid in NAMES and pid not in seen,(ch,pid)
        seen.add(pid);assert cat in ('action','mentioned') and reason
        e=quote(ch,pid,p,term)
        references.append(dict(placeId=pid,name=NAMES[pid],category=cat,
            narrativeLevel=level,rationaleIt=reason,evidence=e,
            originalParagraph=s['paragraphs'][p],geographicalVerification='pending',
            publicationStatus='analysis-only'))
    audit.append(dict(id=ch,volume=s['volume'],volumeChapter=s['volumeChapter'],
        paragraphs=len(s['paragraphs']),words=len(s['text'].split()),sourceSha256=s['sha256'],
        completeNarrativeRead=True,reviewMethod='All paragraphs read, including dialogue and indirect recurrent settings; contextual concordance supplementary only.',
        introductionIt=r['introductionIt'],references=references,reviewNotes=r['notes']))
counts=collections.Counter(ref['category'] for s in audit for ref in s['references'])
data=dict(bookId='pride-and-prejudice',date='2026-10-19',
    status='full-narrative-read-complete-geography-editions-translations-pending',
    source=dict(url=SOURCE,corpusSha256=hashlib.sha256((R/'corpus/original.txt').read_bytes()).hexdigest(),
        edition='Project Gutenberg 1342, anonymous volunteers, updated 2015-02-15; underlying printed witness unspecified; do not label it Egerton 1813',
        integrity='61 consecutive complete chapters, first sentence and narrative ending checked. Three-volume correspondence 1–23, 24–42, 43–61. No separate authorial prologue or epilogue; chapter 61 is the narrative coda. Gutenberg end notice excluded.'),
    counts=dict(chapters=61,distinctPlaceIdentities=len({r['placeId'] for s in audit for r in s['references']}),associations=sum(counts.values()),**counts),
    exhaustiveGeographicalInventoryCertified=False,
    pending=['Corroborate critical identifications and historical geography for each place.',
        'Verify an explicitly identified printed edition and collate the selected quotations.',
        'Verify translation witnesses and rights; align individual passages.',
        'Translate editorial introductions into English, French and Spanish.',
        'Prepare regional boundaries, cover, theme, illustrated views and reviewable import; not yet published.'],
    sections=audit)
(R/'analysis.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(R/'full-review.json').write_text(json.dumps({str(s['id']):{k:v for k,v in s.items() if k!='references'} for s in audit},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(data['counts'],indent=2))
