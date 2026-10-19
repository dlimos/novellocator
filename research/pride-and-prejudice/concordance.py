"""Supplementary omission check, never an inventory or category classifier."""
import json,re
from analyse import NAMES,R,S
from decisions import REVIEWS
terms={k:[v] for k,v in NAMES.items() if v.isascii() and len(v)>3}
terms.update({'st-jamess':["St. James's"],'st-clements':["St. Clement's"],
 'oakham-mount':['Oakham Mount'],'lakes':['Lakes'],'edward-street':['Edward-street'],
 'gracechurch-street':['Gracechurch Street','Gracechurch street'],
 'grosvenor-street':['Grosvenor Street'],'dovedale':['Dovedale','Dove Dale']})
out=[]
for s in S:
    recorded={r[0] for r in REVIEWS[s['id']]['records']}
    for pid,variants in terms.items():
        if pid in recorded:continue
        matches=[dict(paragraph=i+1,text=p) for i,p in enumerate(s['paragraphs'])
                 if any(re.search(r'(?<!\w)'+re.escape(t)+r'(?!\w)',p,re.I) for t in variants)]
        if matches:out.append(dict(chapter=s['id'],placeId=pid,matches=matches))
(R/'concordance-flags.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf-8')
for row in out:
    print(row['chapter'],row['placeId'])
    for m in row['matches']:print(' ',m['paragraph'],m['text'])
