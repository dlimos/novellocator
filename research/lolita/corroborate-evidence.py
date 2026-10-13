"""Cross-check OCR words against the supplied transcripts, without replacing
the image witness or claiming that agreement proves a narrative category.
Only offsets/statuses are included in the repository report; text stays local.
"""
import json,re,unicodedata
from pathlib import Path
R=Path(__file__).resolve().parent;W=R.parents[1]/'work/lolita'
def read(p):return json.loads(p.read_text(encoding='utf-8'))
def words(text):
 text=re.sub(r'([A-Za-z])[-\u00ad]\s*\n\s*([A-Za-z])',r'\1\2',text)
 return [unicodedata.normalize('NFKC',w).casefold()for w in re.findall(r'[^\W_]+',text,re.UNICODE)]
sources={name:{u['id']:words(u['text'])for u in read(W/(name+'-recovered-sections.json'))}for name in ['beland','readingsanctuary']}
rows=read(W/'reference-census.json');public=[]
for r in rows:
 sid=r['sectionId'];out=[]
 for index,e in enumerate(r['evidenceCandidates']):
  needle=words(e['text']);found=[]
  for source,units in sources.items():
   hay=units.get(sid,[])
   if not needle:continue
   for i in range(len(hay)-len(needle)+1):
    if hay[i:i+len(needle)]==needle:
     found.append({'witness':source,'wordOffset':i,'normalizedWordCount':len(needle)});break
  out.append({'candidateIndex':index,'agreement':found,'imageAuthority':True,
   'wordingStatus':'cross-witness-corroborated'if found else 'requires-image-collation',
   'narrativeCategoryDemonstrated':False})
 r['transcriptComparison']=out
 public.append({'sectionId':sid,'name':r['name'],'corroboratedCandidateCount':sum(bool(e['agreement'])for e in out),
  'candidateCount':len(out),'wordingCorroborated':any(e['agreement']for e in out),
  'afterwordAbsentFromEarlierWitnesses':sid=='afterword','categoryVerification':'separate-not-automated'})
(W/'reference-census.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
report={'date':'2026-10-13','candidateAssociations':len(rows),
 'associationsWithCorroboratedWording':sum(r['wordingCorroborated']for r in public),
 'remainingWordingChecks':sum(not r['wordingCorroborated']for r in public),
 'method':'Exact consecutive Unicode word sequence after punctuation, case and line-end hyphen normalization; no source words replaced.',
 'limits':['The two earlier transcripts have common errors and cannot be treated as independent editions.',
 'Agreement with OCR supports transcription checking but does not identify the print edition, establish rights, or validate a narrative category.',
 'The image witness remains authoritative. Afterword candidates necessarily need image verification because the earlier PDFs omit the afterword.'],
 'associations':public}
(R/'wording-corroboration-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({k:report[k]for k in ['candidateAssociations','associationsWithCorroboratedWording','remainingWordingChecks']}))
