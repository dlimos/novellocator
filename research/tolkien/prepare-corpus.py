"""Prepare complete paginated reading units; no lexical inventory inference."""
import hashlib
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent
WORK = ROOT.parents[1] / 'work/tolkien'
text = (WORK/'lotr-harpercollins-2005-candidate.txt').read_text(encoding='utf-8')
chunks = re.split(r'\[PDF PAGE (\d+)\]', text)
pages = {int(chunks[i]): chunks[i+1].strip() for i in range(1, len(chunks), 2)}
audit = json.loads((ROOT/'structure-audit.json').read_text(encoding='utf-8'))
chapter_starts = audit['chapterStartPages']
previous = {}
if (ROOT/'reading-manifest.json').exists():
    previous = {unit['id']:unit for unit in json.loads((ROOT/'reading-manifest.json').read_text(encoding='utf-8'))['units']}
units = []
def unit(key, title, start, end, **metadata):
    raw = '\n\n'.join(f'[PDF PAGE {page}]\n{pages[page]}' for page in range(start,end+1))
    record = dict(id=key,title=title,pdfStart=start,pdfEnd=end,
                      sha256=hashlib.sha256(raw.encode('utf-8')).hexdigest(),
                      characters=len(raw),words=len(re.findall(r'\S+',raw)),
                      readStatus='pending',inventoryStatus='pending',**metadata)
    old = previous.get(key,{})
    if old.get('sha256') == record['sha256']:
        for field in ['readStatus','inventoryStatus','reviewDate','reviewNote']:
            if field in old: record[field] = old[field]
    units.append(record)
    (WORK/'sections'/f'{key}.txt').write_text(raw+'\n',encoding='utf-8')
(WORK/'sections').mkdir(exist_ok=True)
unit('editorial-preliminaries','Editorial notes and Foreword to the Second Edition',8,23,kind='paratext')
unit('prologue','Prologue',25,40,kind='prologue')
for book, starts in enumerate(chapter_starts,1):
    end=audit['narrativeRanges'][book-1][1]
    for index,start in enumerate(starts):
        next_start=starts[index+1] if index+1<len(starts) else end+1
        after = re.split(r'Chapter\s+\d+\s*\n',pages[start],maxsplit=1)[-1]
        heading=[]
        for line in after.splitlines():
            if line.strip() and line.isupper(): heading.append(line.strip())
            else: break
        title=' '.join(heading) or f'Book {book}, chapter {index+1}'
        title_metadata={}
        if book==2 and index==4:
            # PDF 345 visually checked: extraction moves the accented final syllable.
            title_metadata={'titleVerification':{'method':'visual-review','pdfPage':345,'rawExtractedTitle':title}}
            title='THE BRIDGE OF KHAZAD-DÛM'
        if book==2 and index in (5,7):
            # PDF 357 and 391 visually checked: extraction detaches the acute accent.
            title_metadata={'titleVerification':{'method':'visual-review','pdfPage':start,'rawExtractedTitle':title}}
            title={5:'LOTHLÓRIEN',7:'FAREWELL TO LÓRIEN'}[index]
        if book==3 and index==10:
            # PDF 612 visually checked: extraction puts the acute accent before THE.
            title_metadata={'titleVerification':{'method':'visual-review','pdfPage':start,'rawExtractedTitle':title}}
            title='THE PALANTÍR'
        unit(f'b{book}-c{index+1:02}',title,start,next_start-1,kind='chapter',book=book,chapter=index+1,**title_metadata)
appendices=list(audit['appendicesStart'].items())
for index,(letter,start) in enumerate(appendices):
    end=appendices[index+1][1]-1 if index+1<len(appendices) else 1162
    unit('appendix-'+letter.lower(),'Appendix '+letter,start,end,kind='appendix')
unit('indexes','Indexes',1163,1202,kind='reference')
unit('maps','Maps',1203,1207,kind='figure',visualReviewRequired=True)
manifest={'bookId':'lord-of-the-rings','language':'en','date':'2026-10-27',
          'sourceEdition':'HarperCollins 2005; Adobe Acrobat eBook May 2009; ISBN 9780061917806',
          'sourcePdfSha256':'4e2fdba27a4dbc444e182bf10d25cfb6731294fd4215b449e38a190391ebf465',
          'scope':'Complete corpus split for reading. Preparation does not certify a narrative read or any place association.',
          'units':units}
(ROOT/'reading-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(f'Prepared {len(units)} units, including 62 chapters, prologue, 6 appendices, preliminaries, indexes and maps.')
