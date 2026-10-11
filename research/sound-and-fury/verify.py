"""Verify every section/place passage against independently acquired primary texts."""
import pathlib,json,re,hashlib
r=pathlib.Path(__file__).resolve().parent
root=r.parents[1]
audit=json.loads((r/'analysis.json').read_text(encoding='utf8'))
data=json.loads((root/'docs/data/sound-and-fury.js').read_text(encoding='utf8').removeprefix('window.atlasData=').strip().removesuffix(';'))
assert len(data['chapters'])==5
total=0
for section in audit['sections']:
 sid=section['id'];raw=(r/f'{sid}.json').read_bytes();paragraphs=json.loads(raw)
 assert hashlib.sha256(raw).hexdigest()==section['sha256']
 assert section['reviewedRange']==[0,len(paragraphs)-1]
 chapter=data['chapters'][sid-1];found={}
 for place in chapter['places']:found[place]=chapter['placeExcerpts'][place]['original']
 for item in chapter['citations']:found[item['placeId']]=item['excerpt']['original']
 for item in chapter['unlocatedPlaces']:
  assert item['id'] not in found
  found[item['id']]=item
 refs=[x for x in audit['references'] if x['section']==sid]
 assert len(found)==len(refs)==section['references']
 for ref in refs:
  assert ref['quote'] in paragraphs[ref['paragraph']],(sid,ref['id'])
  assert ref['term'] in ref['quote']
  q=found[ref['id']]
  assert q['quote']==ref['quote'] and q['url']==ref['url']
  assert q['highlightTerms']==[ref['term']]
  assert q['sourceParagraph']==ref['paragraph']+1
  total+=1
assert total==audit['mappedReferences']+audit['unlocatedReferences']
assert len(set(data['places'])|set(data['citedPlaces']))==audit['mappedPlaces']
assert 'jefferson' not in data['places'] and 'mottson' not in data['places']
assert 'culloden' not in data['places'],'rejected ambiguous geocode must not be published'
assert audit['appendixQuotedWords']<=200
assert not audit['pending']
report={'verified':True,'sections':5,'authenticSectionPlacePassages':total,'mappedPlaces':len(set(data['places'])|set(data['citedPlaces'])),'mappedReferences':audit['mappedReferences'],'unlocatedReferences':audit['unlocatedReferences'],'appendixQuotedWords':audit['appendixQuotedWords'],'checks':['All source hashes match','All selected original quotations are literal substrings','All highlight forms occur in the actual passage','Every section/place association has its own passage','Fictional towns and rejected geocodes have no invented coordinates']}
(r/'verification.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print(json.dumps(report))
