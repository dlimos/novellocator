"""Prepare a paragraph-level collation against the explicitly identified 1923 witness.

This proposes source matches and reports differences; it never silently replaces
the manually read source or marks fuzzy quotations verified.
"""
import difflib,hashlib,html,json,pathlib,re,unicodedata
R=pathlib.Path(__file__).resolve().parent
original=json.loads((R/'sections.json').read_text(encoding='utf-8'))
raw=(R/'corpus/first-edition.html').read_text(encoding='latin1')
heads=list(re.finditer(r'<h2>CHAPTER ([IVXL]+)\.</h2>',raw))
assert len(heads)==61,len(heads)
def clean(s):
    s=re.sub(r'<span\b[^>]*class="pagenum"[^>]*>.*?</span>','',s,flags=re.S)
    return re.sub(r'\s+',' ',html.unescape(re.sub('<[^>]+>','',s))).strip()
def norm(s):return re.sub('[^a-z0-9]','',unicodedata.normalize('NFKD',s).lower())
ss=[]
for i,h in enumerate(heads):
    body=raw[h.end():heads[i+1].start() if i+1<len(heads) else raw.index('***END OF THE PROJECT GUTENBERG',h.end())]
    # At the end of the first two volumes, only the narrative paragraphs precede
    # the title page of the next volume. The footer is not narrative.
    body=re.split(r'<h1>PRIDE AND PREJUDICE',body)[0]
    pp=[p for p in (clean(x) for x in re.findall(r'<p\b[^>]*>(.*?)</p>',body,re.S))
        if p and not re.fullmatch(r'(END OF THE (?:FIRST|SECOND) VOLUME\.|THE END\.|FINIS\.)',p)]
    ss.append(dict(id=i+1,volume=original[i]['volume'],volumeChapter=original[i]['volumeChapter'],paragraphs=pp,
        sha256=hashlib.sha256(body.encode()).hexdigest()))
(R/'corpus/chapman-sections.json').write_text(json.dumps(ss,ensure_ascii=False,indent=2),encoding='utf-8')
analysis=json.loads((R/'analysis.json').read_text(encoding='utf-8'))
out=[]
for section in analysis['sections']:
    n=section['id'];pp=ss[n-1]['paragraphs'];nn=[norm(p) for p in pp]
    for ref in section['references']:
        old=ref['originalParagraph'];query=norm(old)
        ratios=[difflib.SequenceMatcher(None,query,x,autojunk=False).ratio() for x in nn]
        at=max(range(len(ratios)),key=ratios.__getitem__)
        # Exact quote matching is independent of the fuzzy paragraph proposal.
        q=ref['evidence']['quote'].replace('_','')
        exact=[i for i,p in enumerate(pp) if q in p]
        out.append(dict(chapter=n,placeId=ref['placeId'],originalParagraph=ref['evidence']['sourceParagraph'],
            proposedChapmanParagraph=at+1,similarity=round(ratios[at],4),
            exactQuotationParagraphs=[i+1 for i in exact],
            status='exact-quotation' if exact else 'editorial-collation-required',
            readSource=old,chapmanSource=pp[at]))
(R/'edition-collation.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('1923 witness:',len(ss),'chapters;',sum(len(p.split()) for s in ss for p in s['paragraphs']),'words')
print('Exact quote matches:',sum(bool(r['exactQuotationParagraphs']) for r in out),'/',len(out))
print('Paragraph proposals below .80:',[(r['chapter'],r['placeId'],r['similarity']) for r in out if r['similarity']<.80])
