import pathlib,re,json,hashlib
from html.parser import HTMLParser
R=pathlib.Path(__file__).resolve().parent
class Reader(HTMLParser):
 def __init__(self):
  super().__init__();self.stack=[];self.ps=[];self.buf=None;self.pages=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs);parent=self.stack[-1] if self.stack else (False,False)
  active=parent[0] or 'prp-pages-output' in a.get('class','').split()
  skip=parent[1] or any(x in a.get('class','').split() for x in ['ws-noexport','pagenum','reference','noprint'])
  if tag not in ['br','hr','img','link','meta','input','wbr']:self.stack.append((active,skip))
  if active and not skip and tag=='p':self.buf=[]
 def handle_endtag(self,tag):
  if tag=='p' and self.buf is not None:
   t=re.sub(r'\s+',' ',''.join(self.buf)).strip()
   if t:self.ps.append(t)
   self.buf=None
  if tag not in ['br','hr','img','link','meta','input','wbr'] and self.stack:self.stack.pop()
 def handle_data(self,data):
  if self.buf is not None and self.stack and self.stack[-1][0] and not self.stack[-1][1]:self.buf.append(data)
out=[]
for i in range(1,35):
 raw=(R/f'corpus/fr-{i:02}.html').read_text(encoding='utf8');r=Reader();r.feed(raw)
 assert r.ps and len(' '.join(r.ps))>5000,(i,len(r.ps))
 pages=re.search(r'itemprop="pageStart">(\d+)</span>-(?:<span itemprop="pageEnd">)?(\d+)',raw)
 out.append(dict(id=i,paragraphs=r.ps,pages=list(pages.groups()) if pages else [],sha256=hashlib.sha256(raw.encode()).hexdigest()))
(R/'corpus/french.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf8')
print([(s['id'],len(s['paragraphs']),s['pages']) for s in out])
print('\n'.join(f'{i}: {p}' for i,p in enumerate(out[0]['paragraphs']) if i<15))
