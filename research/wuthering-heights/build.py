import pathlib,json,csv,re,xml.etree.ElementTree as ET,hashlib,math
from decisions import WH,TG,OTHER,UNLOCATED,EXCLUDED
R=pathlib.Path(__file__).resolve().parent; ROOT=R.parents[1]
ID='wuthering-heights'; DATE='2026-10-19'; LANGS=['en','it','fr','es']
SCENES={(int(r['chapter']),r['placeId']):r for r in csv.DictReader((R/'place-scenes.tsv').open(encoding='utf8'),delimiter='|')}
S=json.loads((R/'sections.json').read_text(encoding='utf8')); F=json.loads((R/'corpus/french.json').read_text(encoding='utf8'))
REVIEW=json.loads((R/'full-review.json').read_text(encoding='utf8'))
assert len(REVIEW)==34
for s in S:
 assert REVIEW[str(s['id'])]['completeNarrativeRead'] and REVIEW[str(s['id'])]['sourceSha256']==s['sha256']
ED=json.loads((R/'editorial.json').read_text(encoding='utf8'))
G=json.loads((R/'corpus/coordinates.json').read_text(encoding='utf8'))
ORIGINAL='https://raw.githubusercontent.com/GITenberg/Wuthering-Heights_768/master/768.txt'
RIGHTS='https://www.legislation.gov.uk/ukpga/1988/48/section/12'
FRBASE='https://fr.wikisource.org/wiki/Les_Hauts_de_Hurlevent_(trad._Delebecque)/Chapitre_'
DICT={l:{} for l in LANGS}
def tr(*values):
 assert len(values)==4
 for l,v in zip(LANGS,values):DICT[l][values[0]]=v
 return values[0]
def crop(p,start='',limit=650):
 a=p.index(start) if start else 0
 q=p[a:]
 if len(q)<=limit:return q
 # A boundary is a source boundary; no editorial ellipsis or invented words.
 ends=[m.end() for m in re.finditer(r'[.!?](?:[\x27\x22])?(?=\s|$)',q[:limit])]
 b=next((n for n in reversed(ends) if n>120),None)
 if b is None:b=q.rfind(' ',0,limit)
 return q[:b]
def evidence(ch,p,term,start='',language='en'):
 source=(S if language=='en' else F)[ch-1]
 paragraph=source['paragraphs'][p]
 quote=crop(paragraph,start)
 assert term.lower() in quote.lower(),(ch,p,term,quote)
 if language=='en':
  attribution=f'Emily Brontë, Wuthering Heights, John Murray, London, 1910; chapter {S[ch-1]["roman"]}, paragraph {p+1}; Project Gutenberg transcription (David Price, 2010).'
  url=ORIGINAL; rights=RIGHTS
 else:
  pages='–'.join(source['pages'])
  attribution=f'Emily Brontë, Les Hauts de Hurle-Vent, translated by Frédéric Delebecque, Payot, Paris, 1946 (translation first published 1925); chapter {S[ch-1]["roman"]}, pp. {pages}, paragraph {p+1}; Wikisource transcription.'
  url=FRBASE+str(ch);rights='https://catalogue.bnf.fr/ark:/12148/cb318771965'
 rightsNote=('Original literary text: public domain in Italy/EU/UK and US; Emily Brontë died in 1848. John Murray 1910 witness; mechanical transcription, no modern editorial apparatus.' if language=='en' else 'Underlying Delebecque translation: public domain in Italy/EU/UK; translator died 1940. Payot 1946 witness of the 1925 translation. Modern introductions, annotations and revisions are excluded; no new reviser is credited in this witness.')
 return dict(quote=quote,language=language,type='original' if language=='en' else 'translation',attribution=attribution,url=url,rightsUrl=rights,rightsNote=rightsNote,highlightTerms=[term],highlightMode='explicit',verificationStatus='verified',sourceParagraph=p+1)

# Hand-aligned passages. Other French passages remain pending and are never
# offered in the quotation selector until the individual alignment is reviewed.
FR={
 (1,'heights'):(12,'salle de famille',''),(1,'grange'):(3,'Thrushcross Grange',''),(1,'england'):(0,'Angleterre',''),(1,'seaside'):(14,'bord de la mer',''),
 (2,'heights'):(0,'porte du jardin','Ce spectacle'),(2,'grange'):(0,'cabinet de travail',''),
 (3,'heights'):(0,'chambre',''),(3,'grange'):(45,'parc de Thrushcross',''),(3,'moorland'):(44,'lande',''),
 (4,'heights'):(34,'descendit','Une belle matinée'),(4,'liverpool'):(37,'Liverpool','Le maître essaya'),
 (5,'heights'):(5,'coin du feu',''),(5,'gimmerton'):(7,'Gimmerton',''),
 (6,'grange'):(13,'fenêtre du salon','Nous nous sommes glissés'),(6,'moorland'):(13,'parc','Nous avons couru'),
 (6,'liverpool'):(18,'Liverpool',''),(6,'spain'):(18,'Espagne',''),(6,'america'):(18,'Amérique',''),
 (7,'heights'):(34,'cour',''),(7,'china'):(33,'Chine','Qui sait'),(7,'india'):(33,'Inde','Qui sait'),(7,'england'):(33,'Angleterre','Mais vous avez'),
 (34,'gimmerton'):(90,'église','')
}

def dist(p,a,b):
 dx=b[0]-a[0];dy=b[1]-a[1]
 if dx==dy==0:return math.hypot(p[0]-a[0],p[1]-a[1])
 t=max(0,min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/(dx*dx+dy*dy)))
 return math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dy)
def simplify(points,tol=.008):
 if len(points)<=2:return points
 im=max(range(1,len(points)-1),key=lambda i:dist(points[i],points[0],points[-1]),default=0)
 if im and dist(points[im],points[0],points[-1])>tol:return simplify(points[:im+1],tol)[:-1]+simplify(points[im:],tol)
 return [points[0],points[-1]]
def ring(points):
 points=[[round(float(x),5),round(float(y),5)] for x,y,*_ in points]
 # Split a closed ring at a distant vertex so both halves simplify correctly.
 if points[0]==points[-1] and len(points)>4:
  k=max(range(1,len(points)-1),key=lambda i:math.dist(points[0],points[i]))
  out=simplify(points[:k+1])+simplify(points[k:])[1:]
 else:out=simplify(points)
 return out if len(out)>=4 else points
ns={'k':'http://www.opengis.net/kml/2.2'}
county=next(e for e in ET.parse(R/'corpus/historic-counties.kml').findall('.//k:Placemark',ns) if e.findtext('k:name',namespaces=ns)=='Yorkshire')
paths=[ring([p.split(',') for p in e.text.strip().split()]) for e in county.findall('.//k:outerBoundaryIs/k:LinearRing/k:coordinates',ns)]
(R/'yorkshire-outline.json').write_text(json.dumps(dict(paths=paths,source='https://www.county-borders.co.uk/UKDefinitionA_WG84_Simplified.kmz',definition='Historic Counties Standard A; detached parts retained; display simplification 0.008 degrees'),ensure_ascii=False),encoding='utf8')
world=json.loads((R/'corpus/world.geojson').read_text(encoding='utf8'))
def worldpaths(names):
 out=[]
 for f in world['features']:
  if f['properties']['NAME'] not in names:continue
  polygons=[f['geometry']['coordinates']] if f['geometry']['type']=='Polygon' else f['geometry']['coordinates']
  for p in polygons:out.append(ring(p[0]))
 return out
def arc(q,index=0):
 c=G[q]['candidates'][index];return [c['location']['y'],c['location']['x']]
def source(url,label):return dict(url=url,label=label)
PLACES={}
MODEL=tr('Proposed literary inspiration; not the fictional address','Modello d’ispirazione proposto; non indirizzo della dimora immaginaria','Inspiration littéraire proposée ; pas l’adresse de la demeure fictive','Inspiración literaria propuesta; no es la dirección de la casa ficticia')
REGION=tr('Documented narrative region; no exact fictional position','Regione narrativa documentata; nessuna posizione puntuale della località immaginaria','Région narrative documentée ; aucune position précise du lieu fictif','Región narrativa documentada; sin posición exacta del lugar ficticio')
AREA=tr('Geographical area; representative position','Area geografica; posizione rappresentativa','Aire géographique ; position représentative','Área geográfica; posición representativa')
def place(pid,names,coords,kind,zoom,note,method,position,critical=None,outline=None):
 name=tr(*names)
 PLACES[pid]=dict(name=name,area='Yorkshire' if pid in ['heights','grange','gimmerton','moorland','penistone','lees'] else tr('Geographical references','Riferimenti geografici','Références géographiques','Referencias geográficas'),coords=coords,kind=kind,zoom=zoom,checked=DATE,status=MODEL if pid in ['heights','grange','penistone'] else REGION if outline and pid in ['gimmerton','moorland','lees'] else AREA,note=note,method=method,positionSource=position,aliases=[],**({'additionalSource':critical} if critical else {}),**({'regionalOutline':outline} if outline else {}))
simpleMethod=tr('The point locates a real place or named geographical area, not a character’s precise position.','Il punto localizza un luogo reale o un’area geografica nominata, non la posizione precisa di un personaggio.','Le point situe un lieu réel ou une aire géographique nommée, pas la position précise d’un personnage.','El punto sitúa un lugar real o un área geográfica nombrada, no la posición exacta de un personaje.')
modelMethod=tr('The textual setting and the real model have separate evidence. Distances between model markers do not reconstruct the novel’s routes.','L’ambientazione testuale e il modello reale hanno riscontri separati. Le distanze fra i modelli non ricostruiscono gli itinerari del romanzo.','Le cadre textuel et le modèle réel reposent sur des preuves distinctes. Les distances entre modèles ne reconstituent pas les itinéraires du roman.','El escenario textual y el modelo real tienen pruebas separadas. Las distancias entre modelos no reconstruyen las rutas de la novela.')
place('heights',['Wuthering Heights · Top Withens inspiration','Wuthering Heights · ispirazione di Top Withens','Hurle-Vent · inspiration de Top Withens','Cumbres Borrascosas · inspiración de Top Withens'],arc('Top Withens, Haworth, England',2),'uncertain',14,tr('Top Withens is a widely proposed inspiration, also recorded by the Brontë Parsonage Museum. Its ruins do not identify the fictional house or its rooms.','Top Withens è una diffusa ipotesi d’ispirazione, ricordata anche dal museo Brontë. Le rovine non identificano la dimora immaginaria né le sue stanze.','Top Withens est une inspiration souvent proposée, également signalée par le musée Brontë. Ses ruines n’identifient ni la maison fictive ni ses pièces.','Top Withens es una inspiración propuesta con frecuencia y recogida por el museo Brontë. Sus ruinas no identifican la casa ficticia ni sus habitaciones.'),modelMethod,source(G['Top Withens, Haworth, England']['url'],'ArcGIS · Top Withens candidate 3'),source('https://www.bronte.org.uk/plan-your-visit/maps-walks','Brontë Parsonage Museum · landscape and inspiration'))
place('grange',['Thrushcross Grange · disputed Ponden Hall inspiration','Thrushcross Grange · ipotesi controversa di Ponden Hall','Thrushcross Grange · inspiration contestée de Ponden Hall','Granja de los Tordos · hipótesis discutida de Ponden Hall'],[53.83013,-2.01555],'uncertain',14,tr('Ponden Hall is a traditional but disputed proposed model. Its scale and lack of a park differ from the novel; Shibden Hall is another proposal. This marker shows Ponden Hall, not the Grange’s position.','Ponden Hall è un modello tradizionalmente proposto ma controverso. Dimensioni e assenza del parco divergono dal romanzo; un’altra ipotesi è Shibden Hall. Il punto indica Ponden Hall, non la posizione della Grange.','Ponden Hall est un modèle traditionnel mais contesté. Ses dimensions et l’absence de parc diffèrent du roman ; Shibden Hall est une autre proposition. Le point situe Ponden Hall, pas la Grange.','Ponden Hall es un modelo tradicional pero discutido. Su tamaño y la falta de parque difieren del relato; otra propuesta es Shibden Hall. El punto sitúa Ponden Hall, no la Granja.'),modelMethod,source('https://historicengland.org.uk/listing/the-list/list-entry/1313937','Historic England · Ponden Hall · SD9907437095'),source('https://www.wuthering-heights.co.uk/locations/thrushcross-grange','Reader’s Guide · competing Grange models'))
place('penistone',['Penistone Crags and Fairy Cave · Ponden Kirk inspiration','Penistone Crags e Fairy Cave · ispirazione di Ponden Kirk','Penistone Crags et Fairy Cave · inspiration de Ponden Kirk','Penistone Crags y Fairy Cave · inspiración de Ponden Kirk'],[53.82388,-2.03339],'uncertain',14,tr('Ponden Kirk is proposed as the inspiration for the crags and their cave. The marker locates the real outcrop to roughly 100 metres; it does not make the fictional distances exact.','Ponden Kirk è proposto come ispirazione delle rupi e della grotta. Il punto localizza l’affioramento reale con precisione di circa 100 metri; non rende esatte le distanze narrative.','Ponden Kirk est proposé comme inspiration des rochers et de leur grotte. Le point situe l’affleurement réel à environ 100 mètres près, sans rendre exactes les distances du récit.','Ponden Kirk se propone como inspiración de los riscos y su cueva. El punto sitúa el afloramiento real con unos 100 metros de precisión; no hace exactas las distancias narrativas.'),modelMethod,source('https://www.wuthering-heights.co.uk/locations/ponden-kirk','Reader’s Guide · Ponden Kirk · SD 979 364'),source('https://www.bronte.org.uk/plan-your-visit/maps-walks','Brontë Parsonage Museum · Ponden Kirk and moorland'))
regionNote=tr('The dashed boundary is historic Yorkshire, the documented geographical context. It is not the boundary of Gimmerton, a route, a marsh or a fictional estate. The position is regional only.','Il contorno tratteggiato è quello dello Yorkshire storico, contesto geografico documentato. Non è il confine di Gimmerton, un percorso, una palude o una tenuta immaginaria. La collocazione è soltanto regionale.','Le contour discontinu représente le Yorkshire historique, contexte géographique documenté. Ce n’est la limite ni de Gimmerton, ni d’un itinéraire, d’un marais ou d’un domaine fictif. La localisation est uniquement régionale.','El contorno discontinuo representa Yorkshire histórico, contexto geográfico documentado. No delimita Gimmerton, una ruta, una marisma ni una finca ficticia. La ubicación es solo regional.')
regionMethod=tr('Historic County Borders Project, definition A, WGS84. Boundary simplified by 0.008 degrees for display; label anchors are cartographic labels, not scene coordinates.','Historic County Borders Project, definizione A, WGS84. Confine semplificato di 0,008 gradi per la visualizzazione; le ancore delle etichette non sono coordinate delle scene.','Historic County Borders Project, définition A, WGS84. Limite simplifiée à 0,008 degré pour l’affichage ; les points d’ancrage des étiquettes ne sont pas des coordonnées de scènes.','Historic County Borders Project, definición A, WGS84. Límite simplificado a 0,008 grados para mostrarlo; los anclajes de las etiquetas no son coordenadas de escenas.')
for pid,names,anchor in [
 ('gimmerton',['Gimmerton and its kirk · Yorkshire context','Gimmerton e il kirk · contesto dello Yorkshire','Gimmerton et son église · contexte du Yorkshire','Gimmerton y su iglesia · contexto de Yorkshire'],[-1.1,54.3]),
 ('moorland',['Moorland, paths and Blackhorse marsh · Yorkshire context','Brughiera, sentieri e palude Blackhorse · contesto dello Yorkshire','Lande, chemins et marais Blackhorse · contexte du Yorkshire','Páramo, caminos y marisma Blackhorse · contexto de Yorkshire'],[-1.7,53.6]),
 ('lees',['The Lees · Yorkshire context','I Lees · contesto dello Yorkshire','Les Lees · contexte du Yorkshire','Los Lees · contexto de Yorkshire'],[-.3,53.9])
]:
 place(pid,names,[54,-1.5],'uncertain',7,regionNote,regionMethod,source('https://www.county-borders.co.uk/','Historic County Borders Project · Yorkshire boundary'),source('https://www.wuthering-heights.co.uk/wh/locations/the-moors.php','Reader’s Guide · textual geography and Yorkshire landscape'),dict(paths=paths,label=tr(*[n.split(' · ')[0] for n in names]),labelAnchor=anchor,source='https://www.county-borders.co.uk/UKDefinitionA_WG84_Simplified.kmz'))
for pid,query,names in [
 ('liverpool','Liverpool, England',['Liverpool','Liverpool','Liverpool','Liverpool']),
 ('london','London, England',['London and its unspecified vicinity','Londra e dintorni non precisati','Londres et environs non précisés','Londres y alrededores no precisados']),
 ('england','England',['England','Inghilterra','Angleterre','Inglaterra']),
 ('china','China',['China · imagined origin','Cina · origine immaginata','Chine · origine imaginée','China · origen imaginado']),
 ('india','India',['India · imagined origin','India · origine immaginata','Inde · origine imaginée','India · origen imaginado']),
 ('spain','Spain',['Spain · conjectured origin','Spagna · origine congetturata','Espagne · origine supposée','España · origen supuesto'])
]:
 note=tr('A named geographical reference. Birthplaces, journeys and residences suggested by the characters remain conjectures or reports unless an actual scene is narrated.','Riferimento geografico nominato. Origini, viaggi e residenze suggeriti dai personaggi restano ipotesi o notizie, salvo una scena effettivamente narrata.','Référence géographique nommée. Origines, voyages et résidences suggérés par les personnages restent hypothèses ou informations, sauf scène effectivement racontée.','Referencia geográfica nombrada. Orígenes, viajes y residencias sugeridos por los personajes siguen siendo hipótesis o noticias salvo escena efectivamente narrada.')
 outline=None
 if pid in ['england','china','india','spain']:
  nameset={'england':['England'],'china':['China','Hainan'],'india':['India','Nicobar Is.','Andaman Is.','Lakshadweep'],'spain':['Spain','Balearic Is.','Canary Is.']}[pid]
  outline=dict(paths=worldpaths(nameset),label=tr(*[n.split(' · ')[0] for n in names]),labelAnchor=list(reversed(arc(query))),source='https://www.naturalearthdata.com/')
  note+=tr(' The outline is a modern geographical reference, not a reconstruction of eighteenth-century political borders.',' Il contorno è un riferimento geografico moderno, non una ricostruzione dei confini politici settecenteschi.',' Le contour est un repère géographique moderne, pas une reconstitution des frontières politiques du XVIIIe siècle.',' El contorno es una referencia geográfica moderna, no una reconstrucción de las fronteras políticas del siglo XVIII.')
 place(pid,names,arc(query),'area',9 if pid in ['liverpool','london'] else 4,note,simpleMethod,source(G[query]['url'],'ArcGIS · named geographical area'),None,outline)
place('atlantic',['Atlantic Ocean · comparison','Oceano Atlantico · paragone','Océan Atlantique · comparaison','Océano Atlántico · comparación'],[30,-40],'area',2,tr('Isabella compares a four-mile separation with the Atlantic. The diamond is an ocean label, not a voyage or a ship position.','Isabella paragona una separazione di quattro miglia all’Atlantico. Il rombo è un’etichetta dell’oceano, non un viaggio o una posizione navale.','Isabella compare une séparation de quatre milles à l’Atlantique. Le losange est une étiquette océanique, pas un voyage ni une position de navire.','Isabella compara una separación de cuatro millas con el Atlántico. El rombo es una etiqueta del océano, no un viaje ni una posición naval.'),simpleMethod,source('https://oceanservice.noaa.gov/facts/atlantic.html','NOAA · Atlantic Ocean · editorial ocean-label anchor'))

records=[]
for pid,items in [('heights',WH),('grange',TG)]:
 for row in items:
  ch,p,category,term,reason,*rest=row
  records.append((ch,pid,p,category,term,reason,rest[0] if rest else ''))
records += [(ch,pid,p,category,term,reason,rest[0] if rest else '') for ch,pid,p,category,term,reason,*rest in OTHER]
assert len({(r[0],r[1]) for r in records})==len(records)
chapters=[]; audit=[]
PEOPLE=['Lockwood · Heathcliff · Joseph','Lockwood · Heathcliff · Cathy · Hareton · Zillah','Lockwood · Heathcliff · Catherine','Nelly · Earnshaw · Hindley · Catherine · Heathcliff','Earnshaw · Catherine · Heathcliff · Joseph · Nelly','Hindley · Frances · Catherine · Heathcliff · Linton','Catherine · Heathcliff · Edgar · Isabella · Nelly','Frances · Hindley · Hareton · Catherine · Edgar','Catherine · Heathcliff · Nelly · Hindley','Catherine · Edgar · Heathcliff · Isabella · Nelly','Nelly · Hareton · Heathcliff · Catherine · Edgar · Isabella','Catherine · Edgar · Nelly · Isabella · Kenneth','Catherine · Edgar · Isabella · Joseph · Hindley · Hareton','Nelly · Isabella · Heathcliff','Catherine · Heathcliff · Nelly · Edgar','Catherine · Cathy · Edgar · Heathcliff · Nelly','Isabella · Hindley · Heathcliff · Nelly','Cathy · Hareton · Nelly','Edgar · Cathy · Linton · Joseph · Nelly','Linton · Heathcliff · Nelly · Hareton','Cathy · Linton · Hareton · Heathcliff · Nelly','Cathy · Heathcliff · Nelly · Edgar','Cathy · Linton · Nelly','Cathy · Linton · Hareton · Nelly','Edgar · Cathy · Nelly · Lockwood · Linton','Cathy · Linton · Nelly','Cathy · Linton · Heathcliff · Nelly · Edgar','Nelly · Cathy · Linton · Edgar · Zillah','Heathcliff · Nelly · Cathy','Cathy · Linton · Zillah · Nelly · Lockwood','Lockwood · Cathy · Hareton · Heathcliff','Lockwood · Nelly · Cathy · Hareton','Cathy · Hareton · Heathcliff · Nelly','Heathcliff · Nelly · Hareton · Cathy · Lockwood']
recollections=tr('Nelly’s recollections','Ricordi di Nelly','Souvenirs de Nelly','Recuerdos de Nelly')
returnTime=tr('Return and recollection','Ritorno e ricordo','Retour et souvenir','Regreso y recuerdo')
roles={
 'action':tr('Narrated scene. ','Scena narrata. ','Scène racontée. ','Escena narrada. '),
 'mentioned':tr('Geographical mention. ','Menzione geografica. ','Mention géographique. ','Mención geográfica. ')
}
for s,intros in zip(S,ED['chapters']):
 ch=s['id'];intro=tr(*intros); title=tr(f'Chapter {s["roman"]}',f'Capitolo {s["roman"]}',f'Chapitre {s["roman"]}',f'Capítulo {s["roman"]}')
 c=dict(id=ch,title=title,text=intro,time='1801' if ch<=3 else recollections if ch<=30 else returnTime,people=PEOPLE[ch-1],places=[],placeText=[],placeCategories={},placeExcerpts={},placeSources={},citations=[],unlocatedPlaces=[])
 a=dict(id=ch,roman=s['roman'],sourceSha256=s['sha256'],sourceParagraphs=len(s['paragraphs']),sourceCharacters=len(s['text']),fullNarrativeReview=REVIEW[str(ch)],references=[],excluded=[])
 for sid,pid,p,cat,term,reason,start in sorted([r for r in records if r[0]==ch],key=lambda r:(r[3]!='action',r[1])):
  q=evidence(ch,p,term,start);q['criticalPurpose']=reason;group=dict(original=q,translations={})
  if (ch,pid) in FR:
   fp,ft,fs=FR[(ch,pid)];group['translations']['fr']=evidence(ch,fp,ft,fs,'fr')
  scene=roles[cat]+intro
  for lang in LANGS:DICT[lang][scene]=DICT[lang][roles[cat]]+DICT[lang][intro]
  if cat=='action':scene=tr(*[SCENES[(ch,pid)][l] for l in LANGS])
  if cat=='action':
   c['places'].append(pid);c['placeCategories'][pid]=cat;c['placeExcerpts'][pid]=group;c['placeSources'][pid]=source(ORIGINAL,q['attribution']);c['placeText'].append(scene)
  else:c['citations'].append(dict(placeId=pid,category=cat,excerpt=group,scene=scene))
  a['references'].append(dict(placeId=pid,category=cat,paragraph=p+1,reason=reason,evidence=q,narrativeLevel='See individual reason: Lockwood frame / Nelly retrospective narration / embedded speech or letter.',frenchAlignment='verified' if group['translations'] else 'pending-individual-alignment'))
 for sid,pid,p,cat,term,reason in [r for r in UNLOCATED if r[0]==ch]:
  q=evidence(ch,p,term);q['criticalPurpose']=reason;group=dict(original=q,translations={})
  if (ch,pid) in FR:
   fp,ft,fs=FR[(ch,pid)];group['translations']['fr']=evidence(ch,fp,ft,fs,'fr')
  names={
   'seaside':['Unnamed seaside resort','Località balneare non nominata','Lieu de villégiature maritime non nommé','Lugar de veraneo marítimo sin nombre'],
   'america':['America · unspecified conjecture','America · congettura non precisata','Amérique · conjecture non précisée','América · conjetura sin precisar'],
   'continent':['The Continent · hypothetical destination','Il Continente · destinazione ipotetica','Le Continent · destination hypothétique','El Continente · destino hipotético'],
   'indies':['The Indies · unspecified comparison','Le Indie · paragone non precisato','Les Indes · comparaison non précisée','Las Indias · comparación sin precisar']
  }[pid]
  note=tr('The passage has a geographical function, but does not identify a country, town or defensible regional boundary. No point is invented.','Il passo ha funzione geografica, ma non identifica un paese, una città o un confine regionale dimostrabile. Nessun punto è inventato.','Le passage a une fonction géographique, sans identifier de pays, de ville ou de limite régionale défendable. Aucun point n’est inventé.','El pasaje tiene función geográfica, pero no identifica un país, una ciudad ni un límite regional demostrable. No se inventa ningún punto.')
  c['unlocatedPlaces'].append(dict(id=pid,name=tr(*names),text=note,category=cat,quote=q['quote'],language='en',type='original',attribution=q['attribution'],url=q['url'],rightsUrl=q['rightsUrl'],highlightTerms=q['highlightTerms'],excerpt=group))
  a['references'].append(dict(placeId=pid,category=cat,paragraph=p+1,reason=reason,evidence=q,position='unlocated-geographically-functional'))
 for sid,name,p,kind,reason in EXCLUDED:
  if sid==ch:a['excluded'].append(dict(name=name,paragraph=p+1,kind=kind,reason=reason,originalParagraph=s['paragraphs'][p],displayInAtlas=False))
 # Keep room-level identities as audit subsettings; no duplicate invented points.
 a['microsettingsPolicy']='Rooms, yards, parks and estate interiors remain tied to the documented parent setting, with their section-specific passage; no invented independent address.'
 chapters.append(c);audit.append(a)

book=dict(id=ID,title='Wuthering Heights',author='Emily Brontë',originalLanguage='en',year='1847',unit='chapter',hashPrefix='chapter',description=tr(*ED['description']),help=tr('Choose a chapter or explore all places.','Scegli un capitolo o esplora tutti i luoghi.','Choisissez un chapitre ou explorez tous les lieux.','Elige un capítulo o explora todos los lugares.'),sidebarTitle=tr('Across the moor','Attraverso la brughiera','À travers la lande','A través del páramo'),sidebarNote=tr('Fictional houses are distinguished from proposed real inspirations. Regional outlines give context without assigning fictional addresses.','Le dimore immaginarie sono distinte dai possibili modelli reali. I contorni regionali danno contesto senza assegnare indirizzi fittizi.','Les demeures fictives sont distinguées des inspirations réelles proposées. Les contours régionaux donnent un contexte sans attribuer d’adresses fictives.','Las casas ficticias se distinguen de sus posibles inspiraciones reales. Los contornos regionales dan contexto sin asignar direcciones ficticias.'),initialView=dict(center=[-2.01,53.825],zoom=12),links=[source('https://www.bronte.org.uk/plan-your-visit/maps-walks','Brontë Parsonage Museum · landscape'),source('https://victorianweb.org/authors/bronte/gallery/12.html','Victorian Web · competing literary models'),source('https://www.county-borders.co.uk/','Historic County Borders Project')],citationCsvPrefix=ID+'-citations',analysisStatus='full-narrative-review-complete',analysisCoverage=dict(originalChapters=34,frenchChapters=34,fullCorpusAcquired=True,insertedAssociationsIndividuallyDocumented=True,exhaustiveGeographicalInventoryCertified=True,fullNarrativeRereadComplete=True),publicationStatus='draft',footerHtml='')
book['footerHtml']=tr(*[f'<p><a href="{ID}-places-{lang}.csv" download>{label}</a></p>' for lang,label in zip(LANGS,['Download action settings and unlocated references (CSV)','Scarica ambientazioni dell’azione e riferimenti senza coordinate (CSV)','Télécharger les lieux de l’action et les références sans coordonnées (CSV)','Descargar escenarios de la acción y referencias sin coordenadas (CSV)'])])
actionIds={r[1] for r in records if r[3]=='action'};mentionedIds={r[1] for r in records if r[3]=='mentioned'}
data=dict(book=book,chapters=chapters,places={k:v for k,v in PLACES.items() if k in actionIds},citedPlaces={k:v for k,v in PLACES.items() if k in mentionedIds})
book['title']=tr('Wuthering Heights','Cime tempestose','Les Hauts de Hurlevent','Cumbres borrascosas')
book['unit']=tr('chapter','capitolo','chapitre','capítulo')
(ROOT/'docs/data'/f'{ID}.js').write_text('window.atlasData='+json.dumps(data,ensure_ascii=False,indent=2)+';\n',encoding='utf8')
(ROOT/'docs/data'/f'{ID}-i18n.js').write_text('window.atlasTranslations='+json.dumps(DICT,ensure_ascii=False,indent=2)+';\n',encoding='utf8')
analysis=dict(bookId=ID,date=DATE,source=dict(url=ORIGINAL,edition='John Murray, London, 1910; Gutenberg transcription by David Price, updated 2010-08-28',integrity='34 consecutive narrative chapters I–XXXIV. No separate authorial prologue or epilogue in this witness. Charlotte’s editorial prefaces are not treated as Emily’s narrative.',corpusSha256=hashlib.sha256((R/'corpus/original.txt').read_bytes()).hexdigest()),method='All paragraphs of all 34 narrative chapters read in full. Chapter-specific source hashes, review notes and recurrent implicit settings checked in full-review.json. Contextual concordance is supplementary only. Every imported association has its own original evidence and narrative rationale; doubtful reports remain mentioned.',publicationGate='Full narrative review complete. Retain draft until revised database counts, literal passages, public assets and presentation are verified. Translation gaps are documented; authentic English fallback applies.',sections=audit,frenchAligned=len(FR),translationGaps=['Italian: Binetti 1926 identified; reliable complete reusable witness and translator rights not verified.','Spanish: Montoliu 1921 identified; public-domain term supports reuse, but complete authenticated witness not obtained.','French: complete 1946 Payot witness acquired; only individually aligned excerpts enabled.'],coordinateRejections=['Top Withens: discard the higher-scoring Haworth candidates; choose the actual Top Withens POI.','Ponden Hall: reject Hall Street and Haworth village geocodes; use Historic England grid reference.','Ponden Kirk: reject Haworth and Hanworth candidates; convert documented SD979364.'])
(R/'analysis.json').write_text(json.dumps(analysis,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps(dict(chapters=len(chapters),places=len(PLACES),mappedReferences=len(records),unlocatedReferences=len(UNLOCATED),frenchAligned=len(FR),actions=sum(r[3]=='action' for r in records),mentions=sum(r[3]=='mentioned' for r in records),status='Local staging dataset — full narrative review complete; remote status recorded separately in import-status.json'),ensure_ascii=False))
