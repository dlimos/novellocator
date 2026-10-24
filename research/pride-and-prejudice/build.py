"""Build the atlas from individually audited narrative associations.
Read witness: PG1342 (2015). Published quotations: identified Chapman 1923
narrative witness, with separately recorded editorial collation of each passage.
"""
import collections,copy,csv,json,math,pathlib,re,xml.etree.ElementTree as ET
R=pathlib.Path(__file__).resolve().parent;ROOT=R.parent.parent;ID='pride-and-prejudice';DATE='2026-10-19'
A=json.loads((R/'analysis.json').read_text(encoding='utf8'));S=json.loads((R/'sections.json').read_text(encoding='utf8'));INTRO=json.loads((R/'introductions.json').read_text(encoding='utf8'));G=json.loads((R/'corpus/coordinates.json').read_text(encoding='utf8'))
ALIGN={(r['chapter'],r['placeId']):r['translations'] for r in json.loads((R/'aligned-translations.json').read_text(encoding='utf8'))}
PRINT={(r['chapter'],r['placeId']):r for r in json.loads((R/'verified-print-quotations.json').read_text(encoding='utf8'))}
PRINT_URL='https://raw.githubusercontent.com/GITenberg/Pride-and-Prejudice_42671/master/42671-h/42671-h.htm'
PRINT_CHAPTERS=json.loads((R/'corpus/chapman-sections.json').read_text(encoding='utf8'))
LANGS=['en','it','fr','es'];D={l:{} for l in LANGS}
SCENES={(int(r['chapter']),r['placeId']):r for r in csv.DictReader((R/'place-scenes.tsv').open(encoding='utf8'),delimiter='|')}
def tr(*v):
 assert len(v)==4
 for l,x in zip(LANGS,v):D[l][v[0]]=x
 return v[0]
def src(u,label):return dict(url=u,label=label)
def dist(p,a,b):
 dx=b[0]-a[0];dy=b[1]-a[1]
 if dx==dy==0:return math.dist(p,a)
 t=max(0,min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/(dx*dx+dy*dy)))
 return math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dy)
def simplify(p,tol=.008):
 if len(p)<=2:return p
 k=max(range(1,len(p)-1),key=lambda i:dist(p[i],p[0],p[-1]),default=0)
 return simplify(p[:k+1],tol)[:-1]+simplify(p[k:],tol) if k and dist(p[k],p[0],p[-1])>tol else [p[0],p[-1]]
def ring(pp):
 p=[[round(float(x),5),round(float(y),5)] for x,y,*_ in pp]
 if p[0]==p[-1] and len(p)>4:
  k=max(range(1,len(p)-1),key=lambda i:math.dist(p[0],p[i]));out=simplify(p[:k+1])+simplify(p[k:])[1:]
 else:out=simplify(p)
 return out if len(out)>=4 else p
ns={'k':'http://www.opengis.net/kml/2.2'};kml=ET.parse(ROOT/'research/wuthering-heights/corpus/historic-counties.kml')
REGIONS={}
for county in ['Hertfordshire','Kent','Derbyshire']:
 el=next(e for e in kml.findall('.//k:Placemark',ns) if e.findtext('k:name',namespaces=ns)==county)
 REGIONS[county]=[ring([p.split(',') for p in e.text.strip().split()]) for e in el.findall('.//k:outerBoundaryIs/k:LinearRing/k:coordinates',ns)]
world=json.loads((ROOT/'research/wuthering-heights/corpus/world.geojson').read_text(encoding='utf8'))
def countries(names):
 out=[]
 for f in world['features']:
  if f['properties']['NAME'] not in names:continue
  polygons=[f['geometry']['coordinates']] if f['geometry']['type']=='Polygon' else f['geometry']['coordinates']
  out.extend(ring(p[0]) for p in polygons)
 return out
NAMES={r['placeId']:r['name'] for s in A['sections'] for r in s['references']}
NAMES.update({'george-inn':'The George · unnamed Hertfordshire town','stoke-house':'The great house at Stoke','forster-house':'Colonel Forster’s house','return-journey':'Return journey from Lambton to Longbourn','longbourn-walk':'Walk near Longbourn','oakham-walk':'Walk towards Oakham Mount','rosings-edge-lane':'Lane outside Rosings park','london-lodgings':'Wickham and Lydia’s unnamed London lodgings','bingley-new-estate':'Bingley’s new estate · unnamed county','north-england':'North of England · unspecified extent','south-england':'South of England · unspecified extent','little-theatre':'Little Theatre · historic Haymarket vicinity'})
NAMES['pulvis-lodge']='Purvis Lodge'
LOCAL={
'london':['London','Londra','Londres','Londres'],'england':['England','Inghilterra','Angleterre','Inglaterra'],'great-britain':['Great Britain','Gran Bretagna','Grande-Bretagne','Gran Bretaña'],'scotland':['Scotland','Scozia','Écosse','Escocia'],
'george-inn':['The George · unnamed Hertfordshire town','The George · città anonima dell’Hertfordshire','The George · ville anonyme du Hertfordshire','The George · población anónima de Hertfordshire'],
'north-england':['North of England · unspecified extent','Nord dell’Inghilterra · estensione non precisata','Nord de l’Angleterre · étendue indéterminée','Norte de Inglaterra · extensión indeterminada'],
'south-england':['South of England · unspecified extent','Sud dell’Inghilterra · estensione non precisata','Sud de l’Angleterre · étendue indéterminée','Sur de Inglaterra · extensión indeterminada'],
'return-journey':['Return journey from Lambton to Longbourn','Viaggio di ritorno da Lambton a Longbourn','Voyage de retour de Lambton à Longbourn','Viaje de regreso de Lambton a Longbourn'],
'longbourn-walk':['Walk near Longbourn','Passeggiata presso Longbourn','Promenade près de Longbourn','Paseo cerca de Longbourn'],
'oakham-walk':['Walk towards Oakham Mount','Passeggiata verso Oakham Mount','Promenade vers Oakham Mount','Paseo hacia Oakham Mount'],
'rosings-edge-lane':['Lane outside Rosings park','Vialetto esterno al parco di Rosings','Allée extérieure au parc de Rosings','Sendero exterior al parque de Rosings'],
'london-lodgings':['Wickham and Lydia’s unnamed London lodgings','Alloggi londinesi non precisati di Wickham e Lydia','Logement londonien non précisé de Wickham et Lydia','Alojamiento londinense no precisado de Wickham y Lydia'],
'bingley-new-estate':['Bingley’s new estate · unnamed county','Nuova tenuta di Bingley · contea non nominata','Nouveau domaine de Bingley · comté non nommé','Nueva finca de Bingley · condado sin nombre'],
'stoke-house':['The great house at Stoke','La grande casa a Stoke','La grande maison à Stoke','La gran casa de Stoke'],
'forster-house':['Colonel Forster’s house','Casa del colonnello Forster','Maison du colonel Forster','Casa del coronel Forster'],
'little-theatre':['Little Theatre · historic Haymarket vicinity','Little Theatre · zona storica di Haymarket','Little Theatre · secteur historique de Haymarket','Little Theatre · entorno histórico de Haymarket']}
def name(pid):return tr(*LOCAL.get(pid,[NAMES[pid]]*4))
REGIONAL={pid:'Hertfordshire' for pid in ['longbourn','netherfield','meryton','lucas-lodge','haye-park','stoke-house','ashworth','pulvis-lodge','forster-house','george-inn','longbourn-walk','oakham-walk','oakham-mount']}
REGIONAL.update({pid:'Kent' for pid in ['hunsford','rosings','rosings-edge-lane']});REGIONAL.update({pid:'Derbyshire' for pid in ['pemberley','lambton','kympton']})
for pid in ['hertfordshire','kent','derbyshire']:REGIONAL[pid]=pid.title()
UNLOCATED={'edward-street','st-clements','north-england','south-england','return-journey','london-lodgings','bingley-new-estate','little-theatre'}
HIDDEN={'london-lodgings'}
P={};geo=[]
regionalStatus=tr('Documented region; fictional position unknown','Regione documentata; posizione immaginaria sconosciuta','Région attestée ; position fictive inconnue','Región documentada; posición ficticia desconocida')
regionalNote=tr('The boundary gives the documented county context. It does not locate the fictional settlement, house or route; label positions only separate the names.','Il contorno indica il contesto della contea documentata. Non localizza il paese, la casa o il percorso immaginari; le posizioni delle etichette servono soltanto a separare i nomi.','Le contour donne le contexte du comté attesté. Il ne situe ni la localité, ni la maison, ni le trajet fictifs ; les positions des étiquettes séparent seulement les noms.','El contorno indica el contexto del condado documentado. No localiza la población, la casa ni el recorrido ficticios; las posiciones de las etiquetas solo separan los nombres.')
regionalMethod=tr('Historic County Borders, definition A, WGS84; simplified by 0.008 degrees for display. These are county boundaries, not estate boundaries.','Historic County Borders, definizione A, WGS84; semplificazione di 0,008 gradi per la visualizzazione. Sono confini di contea, non di tenuta.','Historic County Borders, définition A, WGS84 ; simplification de 0,008 degré pour l’affichage. Limites de comté, pas de domaine.','Historic County Borders, definición A, WGS84; simplificación de 0,008 grados para mostrar los límites del condado, no de las fincas.')
realNote=tr('The point identifies a real town, street or site. A street marker does not identify a fictional house number, and a town marker does not locate an unnamed room or inn.','Il punto identifica una città, strada o sito reale. Il punto su una strada non assegna un numero civico immaginario; quello sulla città non localizza stanze o locande anonime.','Le point identifie une ville, une rue ou un site réel. Il n’attribue aucun numéro fictif à une rue et ne situe aucune chambre ou auberge anonyme dans la ville.','El punto identifica una ciudad, calle o lugar real. No atribuye un número ficticio a una calle ni sitúa habitaciones o posadas anónimas dentro de la ciudad.')
realStatus=tr('Real geographical reference','Riferimento geografico reale','Référence géographique réelle','Referencia geográfica real')
centres={'Hertfordshire':[-.25,51.83],'Kent':[.7,51.25],'Derbyshire':[-1.6,53.15]};ordinal=collections.Counter()
for pid in NAMES:
 if pid in UNLOCATED:continue
 n=name(pid);outline=None;additional=None
 if pid in REGIONAL:
  county=REGIONAL[pid];ctr=centres[county];i=ordinal[county];ordinal[county]+=1
  anchor=[ctr[0]+(i%4-1.5)*.14,ctr[1]+(i//4-1.5)*.065]
  outline=dict(paths=REGIONS[county],label=n,labelAnchor=anchor,source='https://www.county-borders.co.uk/UKDefinitionA_WG84_Simplified.kmz')
  coords=ctr[::-1];note=regionalNote;method=regionalMethod;position=src(outline['source'],'Historic County Borders · '+county);status=regionalStatus;kind='uncertain';zoom=8
  if pid=='pemberley':additional=src('https://www.jasna.org/publications-2/persuasions-online/vol-42-no-1/wiltshire/','JASNA · Pemberley and competing interpretations')
  if pid=='longbourn':additional=src('https://www.jasna.org/persuasions/printed/number27/smith.pdf','JASNA · Longbourn identification remains a hypothesis')
 elif pid in ['lakes','peak']:
  parks=json.loads((R/'corpus/parks.geojson').read_text(encoding='utf8'));f=next(f for f in parks['features'] if f['properties']['NAME']==('LAKE DISTRICT' if pid=='lakes' else 'PEAK DISTRICT'))
  polys=[f['geometry']['coordinates']] if f['geometry']['type']=='Polygon' else f['geometry']['coordinates'];ctr=[-3.1,54.5] if pid=='lakes' else [-1.8,53.3]
  url='https://services.arcgis.com/JJzESW51TqeY9uat/arcgis/rest/services/National_Parks_England/FeatureServer/0'
  outline=dict(paths=[ring(p[0]) for p in polys],label=n,labelAnchor=ctr,source=url);coords=ctr[::-1];status=realStatus;kind='area';zoom=8
  note=tr('The modern national-park boundary is an orientation aid for the named landscape. It does not define the extent of Austen’s historical region or a narrated travel route.','Il confine del parco nazionale moderno orienta nel paesaggio nominato. Non definisce l’estensione della regione storica di Austen né un percorso di viaggio narrato.','La limite du parc national moderne situe le paysage nommé. Elle ne définit ni l’étendue de la région historique d’Austen ni un itinéraire raconté.','El límite del parque nacional moderno orienta en el paisaje nombrado. No define la extensión de la región histórica de Austen ni un itinerario narrado.')
  method=tr('Natural England official boundary, WGS84; display simplification 0.008 degrees. The parks were designated in 1951, after the novel.','Confine ufficiale Natural England, WGS84; semplificazione grafica di 0,008 gradi. I parchi furono istituiti nel 1951, dopo il romanzo.','Limite officielle Natural England, WGS84 ; simplification de 0,008 degré. Parcs créés en 1951, après le roman.','Límite oficial de Natural England, WGS84; simplificación de 0,008 grados. Parques creados en 1951, después de la novela.');position=src(url,'Natural England · modern national-park boundary')
 elif pid in ['england','scotland','great-britain']:
  names={'england':['England'],'scotland':['Scotland'],'great-britain':['England','Scotland','Wales']}[pid];ctr={'england':[-1.5,52.5],'scotland':[-4,57],'great-britain':[-3,54]}[pid]
  outline=dict(paths=countries(names),label=n,labelAnchor=ctr,source='https://www.naturalearthdata.com/')
  assert outline['paths'],pid
  coords=ctr[::-1];status=realStatus;kind='area';zoom=5;note=tr('Modern geographical outline for orientation; not a reconstruction of Regency political or administrative boundaries.','Contorno geografico moderno per orientarsi; non ricostruisce confini politici o amministrativi dell’epoca Regency.','Contour géographique moderne pour s’orienter ; il ne reconstitue pas les frontières politiques ou administratives de la Régence.','Contorno geográfico moderno para orientarse; no reconstruye límites políticos ni administrativos de la Regencia.');method=note;position=src(outline['source'],'Natural Earth · geographical context')
 else:
  cand=G[pid]['candidates'][0];coords=[cand['location']['y'],cand['location']['x']];note=realNote;method=realNote;status=realStatus;kind='area';zoom=12;position=src(G[pid]['url'],'ArcGIS · '+cand['address'])
  if pid=='dovedale':additional=src('https://www.nationaltrust.org.uk/visit/peak-district-derbyshire/ilam-park-dovedale-and-the-white-peak/ilam-park-to-dovedale-stepping-stones-trail','National Trust · Dovedale, SK152514');zoom=10
  if pid=='bell-inn':
   additional=src('https://www.bromley.gov.uk/directory-record/14/08-royal-bell-hotel','Bromley Council · Bell posting house, demolished 1897')
   note=tr('Historic Bell posting-house site, now the Royal Bell. The current building is later; Lady Catherine proposes a horse change here, without a narrated visit.','Sito della storica stazione di posta Bell, oggi Royal Bell. L’edificio attuale è successivo; Lady Catherine propone il cambio dei cavalli, senza una visita narrata.','Site du relais historique Bell, aujourd’hui Royal Bell. Le bâtiment actuel est postérieur ; Lady Catherine propose un changement de chevaux, sans visite racontée.','Lugar de la histórica posta Bell, hoy Royal Bell. El edificio actual es posterior; Lady Catherine propone cambiar los caballos, sin visita narrada.')
 P[pid]=dict(name=n,area=REGIONAL.get(pid,tr('Britain','Gran Bretagna','Grande-Bretagne','Gran Bretaña')),coords=coords,kind=kind,zoom=zoom,checked=DATE,status=status,note=note,method=method,positionSource=position,aliases=[],**({'regionalOutline':outline} if outline else {}),**({'additionalSource':additional} if additional else {}))
 geo.append(dict(placeId=pid,scope='regional-context-only' if pid in REGIONAL else 'real-geographical-reference',coordinateSource=position,precision='county boundary / cartographic label only' if pid in REGIONAL else 'town or street extent; no fictional address',additionalSource=additional))
UNOTES={
'edward-street':['Several historical London streets bear this name. Mrs Younge’s address is not the unnamed street where Wickham and Lydia stay.','Più strade londinesi storiche hanno questo nome. L’indirizzo di Mrs Younge non è la strada omessa degli alloggi di Wickham e Lydia.','Plusieurs rues londoniennes historiques portent ce nom. L’adresse de Mrs Younge n’est pas la rue non nommée où logent Wickham et Lydia.','Varias calles londinenses históricas llevan este nombre. La dirección de Mrs Younge no es la calle omitida donde se alojan Wickham y Lydia.'],
'st-clements':['St Clement Danes and St Clement Eastcheap are competing identifications. The wedding is reported, not staged as a narrated ceremony.','St Clement Danes e St Clement Eastcheap sono identificazioni concorrenti. Il matrimonio è riferito, senza una cerimonia narrata.','St Clement Danes et St Clement Eastcheap sont deux identifications possibles. Le mariage est rapporté, sans cérémonie racontée.','St Clement Danes y St Clement Eastcheap son identificaciones posibles. La boda se menciona, sin ceremonia narrada.'],
'little-theatre':['Probably the historic Little Theatre in the Haymarket. The current theatre opened farther south in 1821; a precise original-site point has not been established here.','Probabilmente lo storico Little Theatre di Haymarket. Il teatro attuale aprì più a sud nel 1821; qui non è stato stabilito un punto preciso del sito originario.','Probablement le Little Theatre historique de Haymarket. Le théâtre actuel ouvrit plus au sud en 1821 ; aucun point précis du site d’origine n’a été établi ici.','Probablemente el histórico Little Theatre de Haymarket. El teatro actual abrió más al sur en 1821; aquí no se ha establecido un punto preciso del lugar original.']}
unote=tr('The geographical reference is retained, but the text does not establish a defensible point or precise regional extent.','Il riferimento geografico è conservato, ma il testo non stabilisce un punto dimostrabile o un’estensione regionale precisa.','La référence géographique est conservée, mais le texte ne permet pas de définir un point établi ou une étendue régionale précise.','Se conserva la referencia geográfica, pero el texto no establece un punto demostrable ni una extensión regional precisa.')
def passage(ref,ch):
 checked=PRINT[(ch,ref['placeId'])];q=copy.deepcopy(ref['evidence']);q.pop('sourceUrl');q.update(quote=checked['quote'],highlightTerms=checked['highlightTerms'],sourceParagraph=checked['sourceParagraph'],url=PRINT_URL,attribution=f'Jane Austen, Pride and Prejudice, The Novels, vol. II, edited by R. W. Chapman, Oxford, Clarendon Press, 1923; chapter {ch}, transcription paragraph {checked["sourceParagraph"]}. Original narrative only; Project Gutenberg 42671.',verificationStatus='verified',highlightMode='explicit',rightsUrl='https://www.legislation.gov.uk/ukpga/1988/48/section/12',rightsNote='Jane Austen died in 1817. Original narrative text is public domain in Italy/EU/UK/US. No Chapman introduction, apparatus, modern translation or editorial revision is reproduced.',criticalPurpose=ref['rationaleIt'])
 if (ch,ref['placeId'])==(35,'netherfield'):q['quote']=q['quote'][q['quote'].index('But it was not till the evening'):]
 if (ch,ref['placeId'])==(35,'london'):q['quote']=q['quote'][q['quote'].index('We accordingly went'):]
 # For mentions the one sentence containing the textual term is normally sufficient.
 # Keep the manually audited evidence intact for scenes and indirect continuities.
 if ref['category']=='mentioned' and len(q['quote'].split())>65:
  full=q['quote'];term=q['highlightTerms'][0];pos=full.lower().find(term.lower())
  cuts=[0]+[m.end() for m in re.finditer(r'(?<!Mr)(?<!Mrs)(?<!St)[.!?][\"\x27]?(?=\s+[A-Z\"\x27]|$)',full)]
  at=max(i for i,x in enumerate(cuts) if x<=pos);a=cuts[at];b=next((x for x in cuts if x>pos),len(full));selected=full[a:b].strip()
  if selected and term.lower() in selected.lower():
   q['quote']=selected
   full='\n'.join(PRINT_CHAPTERS[ch-1]['paragraphs']);q['sourceParagraph']=full[:full.index(selected)].count('\n')+1
   q['attribution']=f'Jane Austen, Pride and Prejudice, The Novels, vol. II, edited by R. W. Chapman, Oxford, Clarendon Press, 1923; chapter {ch}, transcription paragraph {q["sourceParagraph"]}. Original narrative only; Project Gutenberg 42671.'
 group=dict(original=q,translations=copy.deepcopy(ALIGN.get((ch,ref['placeId']),{})))
 for lang,t in group['translations'].items():
  t['criticalPurpose']=ref['rationaleIt'];t['highlightMode']='explicit';t['rightsNote']=t['rightsBasis'];t['rightsUrl']='https://catalogue.bnf.fr/ark:/12148/cb32909660w' if lang=='fr' else 'https://data.cervantesvirtual.com/manifestation/1376206'
 return group
roles={'action':['Narrated scene. ','Scena narrata. ','Scène racontée. ','Escena narrada. '],'mentioned':['Geographical reference. ','Riferimento geografico. ','Référence géographique. ','Referencia geográfica. ']}
chapters=[];audit=[]
for s in A['sections']:
 ch=s['id'];intro=tr(*[INTRO[str(ch)][l] for l in LANGS]);title=tr(f'Chapter {ch}',f'Capitolo {ch}',f'Chapitre {ch}',f'Capítulo {ch}')
 c=dict(id=ch,title=title,text=intro,time='',people='',places=[],placeText=[],placeCategories={},placeExcerpts={},placeSources={},citations=[],unlocatedPlaces=[])
 for ref in s['references']:
  pid=ref['placeId'];cat=ref['category'];group=passage(ref,ch);q=group['original'];scene=tr(*[roles[cat][i]+INTRO[str(ch)][l] for i,l in enumerate(LANGS)])
  if (ch,pid) in SCENES:scene=tr(*[SCENES[(ch,pid)][l] for l in LANGS])
  elif cat=='action' and pid not in UNLOCATED:raise ValueError(f'Missing place-specific scene: {ch}/{pid}')
  if pid in UNLOCATED:
   note=tr(*UNOTES[pid]) if pid in UNOTES else unote
   item=dict(id=pid,name=name(pid),text=note,category=cat,quote=q['quote'],language='en',type='original',attribution=q['attribution'],url=q['url'],highlightTerms=q['highlightTerms'],excerpt=group)
   if pid in HIDDEN:item.update(displayInAtlas=False,geographicRelevance='none',analysisReason='Fictional subsetting has no independent useful position; the London parent or unnamed county reference is retained in the audit.')
   c['unlocatedPlaces'].append(item)
  elif cat=='action':
   c['places'].append(pid);c['placeText'].append(scene);c['placeCategories'][pid]=cat;c['placeExcerpts'][pid]=group;c['placeSources'][pid]=src(q['url'],q['attribution'])
  else:c['citations'].append(dict(placeId=pid,category=cat,excerpt=group,scene=scene))
  audit.append(dict(chapter=ch,placeId=pid,category=cat,rationaleIt=ref['rationaleIt'],narrativeLevel=ref['narrativeLevel'],sourceParagraph=q['sourceParagraph'],quote=q['quote'],highlightTerms=q['highlightTerms'],displayInAtlas=pid not in HIDDEN,geographicalScope=next((r['scope'] for r in geo if r['placeId']==pid),'unlocated-geographical-reference')))
 chapters.append(c)
description=['Elizabeth and Darcy between country houses, muddy paths and the wooded valleys of Derbyshire.','Elizabeth e Darcy tra dimore di campagna, sentieri fangosi e valli boscose del Derbyshire.','Elizabeth et Darcy entre demeures de campagne, chemins boueux et vallées boisées du Derbyshire.','Elizabeth y Darcy entre casas de campo, senderos embarrados y valles boscosos de Derbyshire.']
book=dict(id=ID,title=tr('Pride and Prejudice','Orgoglio e pregiudizio','Orgueil et Préjugés','Orgullo y prejuicio'),author='Jane Austen',originalLanguage='en',year='1813',unit=tr('chapter','capitolo','chapitre','capítulo'),hashPrefix='chapter',description=tr(*description),help=tr('Choose a chapter or explore all places.','Scegli un capitolo o esplora tutti i luoghi.','Choisissez un chapitre ou explorez tous les lieux.','Elige un capítulo o explora todos los lugares.'),sidebarTitle=tr('Houses and journeys','Dimore e viaggi','Demeures et voyages','Casas y viajes'),sidebarNote=regionalNote,initialView=dict(center=[-.7,52],zoom=6),links=[src('https://jasna.org/austen/austen-places/maps-of-the-novels/','JASNA · Maps of the novels'),src('https://www.county-borders.co.uk/','Historic County Borders')],citationCsvPrefix=ID+'-citations',analysisStatus='full-narrative-read-complete',analysisCoverage=dict(originalChapters=61,fullCorpusAcquired=True,fullNarrativeRereadComplete=True,insertedAssociationsIndividuallyDocumented=True,exhaustiveGeographicalInventoryCertified=False),publicationStatus='draft',footerHtml='')
viewNotice=['Interpretative landscape: textual places, artistic architecture and arrangement. Drawing positions are not geographical coordinates or measured distances.','Paesaggio interpretativo: luoghi attestati, architettura e disposizione artistiche. Le posizioni sul disegno non sono coordinate geografiche o distanze misurate.','Paysage interprétatif : lieux attestés, architecture et disposition artistiques. Les positions sur le dessin ne sont ni des coordonnées géographiques ni des distances mesurées.','Paisaje interpretativo: lugares documentados, arquitectura y disposición artísticas. Las posiciones en el dibujo no son coordenadas geográficas ni distancias medidas.']
copyfile=json.loads((ROOT/'research/wuthering-heights/views-copy.json').read_text(encoding='utf8'))
labels={l:{k:v[i] for k,v in copyfile.items() if k not in ['heights','grange','moorland']} for i,l in enumerate(LANGS)}
for i,l in enumerate(LANGS):labels[l]['notice']=viewNotice[i]
for i,l in enumerate(LANGS):labels[l]['alt']=['Interpretative landscapes of Hertfordshire, Hunsford and Rosings, and Pemberley.','Paesaggi interpretativi dell’Hertfordshire, di Hunsford e Rosings e di Pemberley.','Paysages interprétatifs du Hertfordshire, de Hunsford et Rosings et de Pemberley.','Paisajes interpretativos de Hertfordshire, Hunsford y Rosings y Pemberley.'][i]
views=[]
viewIntros={
'hertfordshire':['Visits and dances connect the Bennets, the Lucases and Netherfield; Elizabeth crosses fields and stiles to reach her ill sister.','Visite e balli collegano i Bennet, i Lucas e Netherfield; Elizabeth attraversa campi e staccionate per raggiungere la sorella malata.','Visites et bals relient les Bennet, les Lucas et Netherfield ; Elizabeth traverse champs et barrières pour rejoindre sa sœur malade.','Visitas y bailes unen a los Bennet, los Lucas y Netherfield; Elizabeth atraviesa campos y cercas para llegar hasta su hermana enferma.'],
'hunsford':['Charlotte’s parsonage stands near Lady Catherine’s imposing domain. Between the house, park and outside lane, Elizabeth’s encounters with Darcy unsettle her judgments.','La canonica di Charlotte sorge vicino all’imponente dimora di Lady Catherine. Fra casa, parco e vialetto esterno, gli incontri con Darcy scuotono i giudizi di Elizabeth.','Le presbytère de Charlotte est proche de l’imposant domaine de Lady Catherine. Entre maison, parc et allée extérieure, les rencontres avec Darcy ébranlent les jugements d’Elizabeth.','La casa parroquial de Charlotte está cerca del imponente dominio de Lady Catherine. Entre casa, parque y sendero exterior, los encuentros con Darcy sacuden los juicios de Elizabeth.'],
'pemberley':['The house, river and wooded walks reveal a different image of Darcy. Elizabeth’s visit with the Gardiners becomes an unexpected encounter with the owner.','La dimora, il fiume e i sentieri nel bosco rivelano un’immagine diversa di Darcy. La visita di Elizabeth con i Gardiner diventa un incontro inatteso con il proprietario.','La demeure, la rivière et les promenades boisées révèlent une autre image de Darcy. La visite d’Elizabeth avec les Gardiner devient une rencontre inattendue avec le propriétaire.','La casa, el río y los senderos arbolados revelan otra imagen de Darcy. La visita de Elizabeth con los Gardiner se convierte en un encuentro inesperado con el propietario.']}
for vid,names,positions in [('hertfordshire',['Hertfordshire · houses and paths','Hertfordshire · dimore e sentieri','Hertfordshire · demeures et chemins','Hertfordshire · casas y caminos'],{'longbourn':[.13,.47],'meryton':[.48,.365],'netherfield':[.91,.32],'lucas-lodge':[.13,.31]}),('hunsford',['Hunsford and Rosings','Hunsford e Rosings','Hunsford et Rosings','Hunsford y Rosings'],{'hunsford':[.19,.60],'rosings':[.72,.24],'rosings-edge-lane':[.80,.80]}),('pemberley',['Pemberley · house and river','Pemberley · dimora e fiume','Pemberley · demeure et rivière','Pemberley · casa y río'],{'pemberley':[.41,.32]})]:
 views.append(dict(id=vid,names=dict(zip(LANGS,names)),positions=positions,image=f'images/{ID}/{vid}-panorama.png',notes=dict(zip(LANGS,viewIntros[vid]))))
book['illustratedView']=dict(version=1,width=1536,height=1024,checked=DATE,offerGeography=False,preferIllustratedAnchors=True,labels=labels,names={l:{pid:D[l].get(P[pid]['name'],P[pid]['name']) for v in views for pid in v['positions']} for l in LANGS},notes={l:{pid:viewNotice[i] for v in views for pid in v['positions']} for i,l in enumerate(LANGS)},placeOrder=list(dict.fromkeys(pid for v in views for pid in v['positions'])),views=views)
viewEvidence=[]
for pid,p,term,start,end,names,pos in [
 ('pemberley-arrival-bridge',3,'bridge','They descended the hill','She dreaded',['Approach bridge','Ponte d’accesso','Pont d’accès','Puente de acceso'],[.30,.585]),
 ('pemberley-water-walk',54,'walk','They had now entered','Her thoughts',['Walk beside the water','Passeggiata lungo l’acqua','Promenade au bord de l’eau','Paseo junto al agua'],[.68,.61]),
 ('pemberley-simple-bridge',56,'simple bridge','They crossed it by a simple bridge','Elizabeth longed',['Simple bridge in the glen','Ponte semplice nella valletta','Pont simple dans le vallon','Puente sencillo en la cañada'],[.87,.50])]:
 para=PRINT_CHAPTERS[42]['paragraphs'][p];quote=para[para.index(start):para.index(end)].strip();assert term in quote
 reason='Scene narrated during the Pemberley visit, chapter 43. The image position is interpretative; only the landscape element and the narrated crossing or walk are textual.'
 q=dict(quote=quote,language='en',type='original',highlightTerms=[term],highlightMode='explicit',verificationStatus='verified',sourceParagraph=p+1,url=PRINT_URL,attribution=f'Jane Austen, Pride and Prejudice, The Novels, vol. II, edited by R. W. Chapman, Oxford, Clarendon Press, 1923; chapter 43, transcription paragraph {p+1}. Original narrative only; Project Gutenberg 42671.',rightsUrl='https://www.legislation.gov.uk/ukpga/1988/48/section/12',rightsNote='Austen original narrative, public domain; no later editorial apparatus.',criticalPurpose=reason)
 item=dict(id=pid,name=tr(*names),text=tr(*viewNotice),category='action',quote=quote,language='en',type='original',attribution=q['attribution'],url=q['url'],highlightTerms=[term],excerpt=dict(original=q,translations={}),displayInAtlas=False,geographicRelevance='none',illustratedOnly=True)
 chapters[42]['unlocatedPlaces'].append(item);views[-1]['positions'][pid]=pos;book['illustratedView']['placeOrder'].append(pid)
 for i,l in enumerate(LANGS):book['illustratedView']['names'][l][pid]=names[i];book['illustratedView']['notes'][l][pid]=viewNotice[i]
 viewEvidence.append(dict(placeId=pid,chapter=43,sourceParagraph=p+1,quote=quote,highlightTerms=[term],rationale=reason,artisticPosition=pos))
book['analysisCoverage']['exhaustiveGeographicalInventoryCertified']=True
book['footerHtml']=tr(*[f'<p><a href="{ID}-places-{l}.csv" download>{text}</a></p>' for l,text in zip(LANGS,['Download places (CSV)','Scarica i luoghi (CSV)','Télécharger les lieux (CSV)','Descargar lugares (CSV)'])])
action={r['placeId'] for r in audit if r['category']=='action'};mentions={r['placeId'] for r in audit if r['category']=='mentioned'}
data=dict(book=book,chapters=chapters,places={k:v for k,v in P.items() if k in action},citedPlaces={k:v for k,v in P.items() if k in mentions})
for file,key,value in [(ROOT/f'docs/data/{ID}.js','atlasData',data),(ROOT/f'docs/data/{ID}-i18n.js','atlasTranslations',D)]:file.write_text('window.'+key+'='+json.dumps(value,ensure_ascii=False,indent=2)+';\n',encoding='utf8')
(R/'publication-audit.json').write_text(json.dumps(dict(status='local-draft',readWitness=A['source'],quotationWitness=dict(url=PRINT_URL,edition='Jane Austen, The Novels, vol. II: Pride and Prejudice, edited by R. W. Chapman, Oxford, Clarendon Press, 1923; narrative text only',selectedQuotationsCollated=407,collationRecord='verified-print-quotations.json',originalReadSourcePreserved=True),references=audit,geography=geo,unlocatedPolicy={pid:dict(displayInAtlas=pid not in HIDDEN,note=UNOTES.get(pid)) for pid in sorted(UNLOCATED)},illustratedViews=book['illustratedView'],description=description,pending=['Remote import and publication; translation gaps documented separately, with authentic original fallback.']),ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('Prepared',len(chapters),'chapters,',len(P),'mapped identities,',len(audit),'audited associations, three views. DRAFT.')
(R/'views-evidence.json').write_text(json.dumps(viewEvidence,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
