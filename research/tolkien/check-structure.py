"""Inspect extracted section starts; render a few non-text pages if available."""
import importlib.util
import json
from pathlib import Path
import re
import unicodedata

folder = Path('work/tolkien')
text = (folder/'lotr-harpercollins-2005-candidate.txt').read_text(encoding='utf-8')
chunks = re.split(r'\[PDF PAGE (\d+)\]', text)
pages = {int(chunks[i]): chunks[i+1] for i in range(1, len(chunks), 2)}
ranges = [(45, 240), (243, 432), (437, 624), (627, 766), (771, 918), (921, 1055)]
counts = []
chapter_pages = []
for start, end in ranges:
    starts = []
    for page in range(start, end+1):
        normalized = unicodedata.normalize('NFKC', pages[page])
        if re.search(r'Chapter\s+\d+\s*\n', normalized[:200]):
            starts.append(page)
    counts.append(len(starts))
    chapter_pages.append(starts)
report = {'checkedDate': '2026-10-27', 'pdfPageNumbering': 'one-based',
          'narrativeRanges': ranges, 'chapterStartCountsByBook': counts,
          'expectedChapterCounts': [12,10,11,10,10,9], 'chapterStartPages': chapter_pages,
          'all62ChapterStartsFound': counts == [12,10,11,10,10,9],
          'prologueStart': 25, 'appendicesStart': {'A':1057,'B':1106,'C':1123,'D':1130,'E':1137,'F':1151},
          'assessment': 'Narrative text is directly extractable without OCR. This is not a full textual collation; figures and genealogical tables require visual inspection.',
          'normalization': 'Keep raw text for quotations. NFKC may be used only in a separate search index for typographic ligatures.'}
Path('research/tolkien/structure-audit.json').write_text(json.dumps(report, indent=2)+'\n', encoding='utf-8')
print(json.dumps(report))
if importlib.util.find_spec('pypdfium2'):
    import pypdfium2 as pdfium
    document = pdfium.PdfDocument(str(folder/'lotr-harpercollins-2005-candidate.pdf'))
    for number in [45,329,1124,1127,1204]:
        document[number-1].render(scale=1).to_pil().save(str(folder/f'page-{number}.png'))
    print('Rendered sample pages in ignored work/tolkien')
