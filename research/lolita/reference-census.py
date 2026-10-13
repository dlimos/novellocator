"""Refine the lexical audit; no DB writes and no automatic action promotion."""
import ast,hashlib,json,re
from pathlib import Path
R=Path(__file__).resolve().parent; W=R.parents[1]/'work/lolita'
def read(p):return json.loads(p.read_text(encoding='utf-8'))
def save(p,x):p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
tree=ast.parse((R/'consolidate-analysis.py').read_text(encoding='utf-8'))
lexicon=next(ast.literal_eval(n.value)for n in tree.body if isinstance(n,ast.Assign)and any(isinstance(t,ast.Name)and t.id=='lexicon'for t in n.targets))
names=[line.split('|')for line in lexicon.splitlines()]
names += [['France'],['Germany'],['Spain'],['North America'],['Mexican border'],['Gulf of Mexico'],['Seventh Street'],['Central Avenue'],['Washington Street','W. Washington'],['Crystal Chamber'],['Columbia University'],['Corn Palace'],['North Dakota'],['South Dakota']]
# Retain authentic abbreviated or split printed forms. Do not invent words.
extra={'Lawn Street':['342 Lawn Street'],'Thayer Street':['Thayer St.'],'Hotel Mirana':['Mirana'],
       'Mother’s Club':["Mother's club"], 'Scotty':["Scotty’s Castle"],
       'Arctic Canada':['arctic Canada'],'Old Faithful':['Old faithful']}
seen=set();unique=[]
for aliases in names:
 if aliases[0]in seen:continue
 seen.add(aliases[0]);unique.append(aliases+extra.get(aliases[0],[]))
names=unique
def join_lines(s):
 s=re.sub(r'([A-Za-z])[-\u00ad]\s*\n\s*([A-Za-z])',r'\1\2',s)
 return re.sub(r'\s+',' ',s).strip()
units=read(W/'fliphtml-sections.json');pages=read(W/'fliphtml-clean-pages.json')
notes={s['id']:s for s in read(R/'section-analysis.json')['sections']}
excluded={('1.8','Elphinstone'):'Percy Elphinstone è una persona, non la città del secondo viaggio.',
 ('1.11','Virginia'):'Virginia è la persona evocata nell’allusione a Poe.',
 ('1.11','Sheridan'):'Agnes Sheridan è un’alunna nell’elenco.',
 ('1.18','Sheridan'):'Mrs. Sheridan è una persona.',('1.32','Sheridan'):'Agnes Sheridan è una persona.',
 ('2.4','Shakespeare'):'Shakespeare è l’autore citato dalla direttrice.',
 ('2.13','Vermont'):'Maurice Vermont è l’autore fittizio di un dramma.',
 ('2.15','Vermont'):'Vermont è l’autore fittizio del dramma.',
 ('2.24','Ramble'):'Cecilia Dalrymple Ramble è la donatrice della panchina.',
 ('2.32','Shakespeare'):'Shakespeare è l’autore nel riferimento culturale.'}
rows=[];rejected=[];new_hits=[]
for u in units:
 sid=u['id'];text=join_lines(u['text']);matches=[]
 for aliases in names:
  p=re.compile(r'(?<!\w)(?:'+'|'.join(re.escape(a)for a in sorted(set(aliases),key=len,reverse=True))+r')(?!\w)')
  for m in p.finditer(text):
   if (sid,aliases[0])in excluded:
    rejected.append({'sectionId':sid,'name':aliases[0],'reason':excluded[sid,aliases[0]]});continue
   if aliases[0]=='Paris'and text[m.end():].startswith('-Soir'):
    rejected.append({'sectionId':sid,'name':'Paris','reason':'Paris-Soir è il titolo del giornale.'});continue
   if aliases[0]=='Soda'and text[m.end():].startswith(' Springs'):
    rejected.append({'sectionId':sid,'name':'Soda','reason':'Soda Springs è una diversa denominazione generica dell’elenco, non la cittadina Soda.'});continue
   if aliases[0]=='Independence'and text[m.end():].startswith(' Day'):
    rejected.append({'sectionId':sid,'name':'Independence','reason':'Independence Day è una ricorrenza, non la città del Missouri.'});continue
   matches.append((m.start(),m.end(),aliases[0],m.group(),aliases))
 # Longer place names own their spans: England in New England, Mexico in
 # New Mexico, and Petersburg in St. Petersburg are not separate locations.
 matches=[m for m in matches if not any(n[0]<=m[0]and n[1]>=m[1]and n[1]-n[0]>m[1]-m[0]for n in matches)]
 grouped={}
 for m in matches:grouped.setdefault(m[2],[]).append(m)
 for name,hits in grouped.items():
  contexts=[]
  for a,b,_,form,aliases in hits:
   words=list(re.finditer(r'\S+',text));wi=next(i for i,w in enumerate(words)if w.end()>a)
   start=words[max(0,wi-12)].start();end=words[min(len(words)-1,wi+20)].end()
   quote=text[start:end]
   candidate_pages=[p['page']for p in pages if u['pageStart']<=p['page']<=u['pageEnd']and form in join_lines(p['body'])]
   contexts.append({'text':quote,'highlightTerms':[form],'sectionOffset':a,'viewerPages':candidate_pages,
     'status':'ocr-awaiting-collation','categoryDemonstrated':False})
  row={'sectionId':sid,'name':name,'category':'mentioned','categoryStatus':'conservative-unresolved',
       'reason':'Il nome compare nel testo; il solo toponimo non dimostra una scena ambientata. Conservato mentioned finché il riscontro specifico non dimostra gli eventi e l’ambientazione.',
       'narrativeReviewNotes':notes[sid]['locationAnalysis'],'source':notes[sid]['source'],
       'evidenceCandidates':contexts,'originalEvidenceVerified':False,'publicQuotationStatus':'pending',
       'coordinates':None,'geographicalIdentificationStatus':'pending'}
  rows.append(row)
 old={(r['sectionId'],r['name'])for r in read(W/'location-evidence-candidates.json')}
 for name in grouped:
  if(sid,name)not in old:new_hits.append({'sectionId':sid,'name':name})
save(W/'reference-census.json',rows)
summary={'date':'2026-10-13','previousLexicalCandidates':len(read(W/'location-evidence-candidates.json')),
 'refinedCandidates':len(rows),'distinctNames':len(set(r['name']for r in rows)),
 'rules':['Case-sensitive geographic names, retaining explicitly registered genuine lowercase variants.',
 'Join printed line-end hyphenation without correcting spelling.',
 'Exclude nested place names and manually verified names of people, journals and festivals.'],
 'explicitExclusions':list({(r['sectionId'],r['name']):r for r in rejected}.values()),
 'newlyRecoveredNames':new_hits,'sourceTextDistributed':False,'publicationReady':False,
 'evidenceFile':'work/lolita/reference-census.json'}
save(R/'reference-census-report.json',summary)
print(json.dumps({k:summary[k]for k in ['previousLexicalCandidates','refinedCandidates','distinctNames']},ensure_ascii=False))
