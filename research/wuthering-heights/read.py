"""Contextual concordance; never used as the final narrative classification."""
import json,pathlib,re,sys
ss=json.loads(pathlib.Path(__file__).with_name('sections.json').read_text(encoding='utf-8'))
start,end=map(int,sys.argv[1:3])
pattern=re.compile(r'\b(?:Heights|Grange|Gimmerton|Penistone|Fairy|Blackhorse|Liverpool|London|Yorkshire|York|England|English|Scotland|Scottish|Ireland|Irish|France|French|Spain|Spanish|America|American|China|Chinese|India|Indian|Arabia|Arabian|Italy|Italian|Europe|Africa|African|West Indies|Gibraltar|Lancashire|Marsh|Leeds|Bradford|Haworth|chapel|churchyard|church|kirkyard|moor|crags|beck|valley|seacoast|sea-coast|country|village|town)\b',re.I)
for s in ss[start-1:end]:
 print('\nCHAPTER',s['id'],s['roman'])
 for i,p in enumerate(s['paragraphs']):
  if '--complete' in sys.argv or pattern.search(p) or i<2 or i>=len(s['paragraphs'])-2:
   if '--full' in sys.argv or '--complete' in sys.argv: out=p
   else:
    spans=[(max(0,m.start()-110),min(len(p),m.end()+180)) for m in pattern.finditer(p)]
    if i<2 or i>=len(s['paragraphs'])-2:spans.append((0,min(len(p),300)))
    merged=[]
    for a,b in sorted(spans):
     if merged and a<=merged[-1][1]+15:merged[-1]=(merged[-1][0],max(merged[-1][1],b))
     else:merged.append((a,b))
    out=' [...] '.join(p[a:b] for a,b in merged)
   print(f'[{i}] {out}')
