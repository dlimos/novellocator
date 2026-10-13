"""Prepare the complete section skeleton and pending references, never publish."""
import json,re,unicodedata
from pathlib import Path
R=Path(__file__).resolve().parent;ROOT=R.parents[1];W=ROOT/'work/lolita'
def read(p):return json.loads(p.read_text(encoding='utf-8'))
sections=read(R/'section-analysis.json')['sections'];refs=read(W/'reference-census.json');coords=read(R/'coordinates.json')
verified=read(W/'verified-reading-examples.json')
by_ref={(e['sectionId'],e['place']):e for e in verified}
present={(r['sectionId'],r['name'])for r in refs}
for e in verified:
 if(e['sectionId'],e['place'])not in present:
  refs.append({'sectionId':e['sectionId'],'name':e['place'],'category':e['category'],'categoryStatus':'visually-reviewed',
    'reason':e['reason'],'source':e['source'],'originalEvidenceVerified':True,'publicQuotationStatus':'pending',
    'evidenceCandidates':[]})
messages={lang:{}for lang in ['en','it','fr','es']}
def tr(en,it,fr,es):
 for lang,value in zip(messages,[en,it,fr,es]):messages[lang][en]=value
 return en
description=tr('Dolores and Humbert between the Haze house, Beardsley and the Enchanted Hunters.',
 'Dolores e Humbert tra la casa degli Haze, Beardsley e l’Enchanted Hunters.',
 'Dolores et Humbert entre la maison des Haze, Beardsley et l’Enchanted Hunters.',
 'Dolores y Humbert entre la casa de los Haze, Beardsley y el Enchanted Hunters.')
sidebar=tr('The story and the author’s afterword','Il racconto e la postfazione d’autore','Le récit et la postface de l’auteur','El relato y el epílogo del autor')
helptext=tr('Choose a section or explore the places.','Scegli una sezione o esplora i luoghi.','Choisissez une section ou explorez les lieux.','Elige una sección o explora los lugares.')
note=tr('Fictional towns and unidentified interiors remain without coordinates.',
 'Le città immaginarie e gli interni non identificati restano senza coordinate.',
 'Les villes fictives et les intérieurs non identifiés restent sans coordonnées.',
 'Las ciudades ficticias y los interiores no identificados quedan sin coordenadas.')
pending=tr('Geographical reference under review; the original passage and narrative function still require individual verification.',
 'Riferimento geografico in verifica: il passo originale e la funzione narrativa richiedono ancora il controllo individuale.',
 'Référence géographique en cours de vérification : le passage original et sa fonction narrative restent à contrôler individuellement.',
 'Referencia geográfica en revisión: el pasaje original y su función narrativa requieren todavía una comprobación individual.')
position=tr('Representative geographical position','Posizione geografica rappresentativa','Position géographique représentative','Posición geográfica representativa')
geonote=tr('The point identifies the named area, not a precise scene or interior.',
 'Il punto identifica l’area nominata, non una scena o un interno preciso.',
 'Le point identifie la zone nommée, pas une scène ou un intérieur précis.',
 'El punto identifica la zona nombrada, no una escena ni un interior preciso.')
no_coords=tr('Fictional, ambiguous or not yet identified setting','Ambientazione immaginaria, ambigua o ancora da identificare','Lieu fictif, ambigu ou encore à identifier','Lugar ficticio, ambiguo o todavía sin identificar')
def slug(name):return re.sub(r'[^a-z0-9]+','-',unicodedata.normalize('NFKD',name).encode('ascii','ignore').decode().lower()).strip('-')
data={'book':{'id':'lolita','title':'Lolita','author':'Vladimir Nabokov','year':'1955','originalLanguage':'en',
 'unit':'section','hashPrefix':'section','description':description,'sidebarTitle':sidebar,'help':helptext,
 'sidebarNote':note,'initialView':{'center':[-98,39],'zoom':3},'analysisStatus':'pending-individual-evidence',
 'publicationStatus':'draft','links':[{'url':'https://online.fliphtml5.com/unwsfj/Lolita---Vladimir-Nabokov/','label':'Nabokov · Lolita · digital witness'}]},
 'chapters':[],'places':{},'citedPlaces':{}}
def title(s):
 if s['id']=='foreword':return tr('Foreword · John Ray','Prefazione · John Ray','Préface · John Ray','Prefacio · John Ray')
 if s['id']=='afterword':return tr('On a book entitled Lolita','A proposito di un libro intitolato Lolita','À propos d’un livre intitulé Lolita','Sobre un libro titulado Lolita')
 p,n=s['id'].split('.')
 return tr(f'Part {p} · Chapter {n}',f'Parte {p} · Capitolo {n}',f'Partie {p} · Chapitre {n}',f'Parte {p} · Capítulo {n}')
summary=[]
for i,s in enumerate(sections,1):
 intro=s['intro']['en']
 for lang in messages:messages[lang][intro]=s['intro'][lang]
 c={'id':i,'originalSectionId':s['id'],'title':title(s),'text':intro,'time':'','people':'',
  'note':note,'places':[],'placeText':[],'placeCategories':{},'placeSources':{},'placeQuotes':{},
  'placeExcerpts':{},'unlocatedPlaces':[],'links':[{'url':s['source'],'label':'Nabokov · Lolita · '+s['id']}],
  'analysisStatus':'draft-not-ready-for-publication'}
 for r in [r for r in refs if r['sectionId']==s['id']]:
  e=by_ref.get((s['id'],r['name']));category=e['category']if e else 'mentioned'
  coordinate=coords.get(r['name'],{})
  reason=e['reason']if e else r['reason']
  source=e['source']if e else r['source']
  item={'sectionId':s['id'],'name':r['name'],'category':category,'originalEvidenceVerified':bool(e),
    'originalEvidenceFile':'work/lolita/verified-reading-examples.json'if e else 'work/lolita/reference-census.json',
    'reason':reason,'publicQuotationStatus':'pending','source':source}
  summary.append(item)
  if coordinate.get('status')=='reviewed-representative-position':
   pid=slug(r['name'])
   if pid not in data['places']:
    data['places'][pid]={'name':r['name'],'area':coordinate['matchedName'],'coords':coordinate['coords'],
     'zoom':6 if coordinate['entityType']=='Locality'else 12,'kind':'area','checked':'2026-10-13',
     'status':position,'note':geonote,'method':geonote,
     'positionSource':{'url':coordinate['source'],'label':'Esri · representative position'},
     'narrativeSource':{'url':source,'label':'Nabokov · Lolita · digital witness'},
     'aliases':[r['name']],'analysisStatus':'pending-narrative-verification'}
   c['places'].append(pid);c['placeText'].append(pending);c['placeCategories'][pid]=category
   c['placeSources'][pid]={'url':source,'label':'Nabokov · Lolita · '+s['id']}
  else:
   c['unlocatedPlaces'].append({'name':r['name'],'text':no_coords,'quote':'','url':source,
     'category':category,'language':'en','quotationStatus':'pending','aliases':[r['name']],
     'analysisStatus':'pending-individual-verification'if not e else 'original-evidence-verified-publication-pending'})
 data['chapters'].append(c)
assert len(data['chapters'])==71
assert all(len(c['places'])==len(c['placeText'])for c in data['chapters'])
for c in data['chapters']:
 assert len(set(c['places']))==len(c['places'])
 assert all(pid in data['places']for pid in c['places'])
 assert all(c['placeCategories'][pid]in ['action','mentioned']for pid in c['places'])
 assert all(messages[lang].get(c['text'])for lang in ['it','fr','es'])
out=ROOT/'docs/data';out.mkdir(exist_ok=True)
(out/'lolita.js').write_text('window.atlasData='+json.dumps(data,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
(out/'lolita-i18n.js').write_text('window.atlasTranslations='+json.dumps(messages,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
(R/'draft-reference-summary.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
report={'status':'draft','sections':71,'mappedPlaces':len(data['places']),
 'mappedReferences':sum(len(c['places'])for c in data['chapters']),
 'unlocatedReferences':sum(len(c['unlocatedPlaces'])for c in data['chapters']),
 'originalEvidenceVerified':sum(x['originalEvidenceVerified']for x in summary),
 'originalEvidencePending':sum(not x['originalEvidenceVerified']for x in summary),
 'publicQuotations':0,'languages':list(messages),'publicationAllowed':False,
 'remaining':['Complete every individual narrative rationale and original quotation collation.',
 'Review geographic identity independently of geocoder scores.',
 'Complete the individual and aggregate quotation rights assessment; retain unavailable translated quotations until verified.']}
(R/'draft-build-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(report,ensure_ascii=False))
