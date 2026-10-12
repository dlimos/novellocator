"""Reproducible editorial census; source text and evidence remain separate from coordinates."""
import json,pathlib,re,hashlib,collections,runpy,contextlib,io
R=pathlib.Path(__file__).resolve().parent;ROOT=R.parents[1];ID='anna-karenina'
S=json.loads((R/'sections.json').read_text(encoding='utf8'))
with contextlib.redirect_stdout(io.StringIO()):
    patterns=runpy.run_path(str(R/'scan.py'))['patterns']
patterns.update({'bologoe':r'Бологов\w*','corso':r'Корсо','usa':r'Соединенных Штатах','vienna':r'Венской выставке','baltic':r'Балтийском море','voz-drema':r'Воздрем\w*','western-region':r'Западный край','kolok':r'Колок\w*','seleznev':r'Селезневск\w*','eliseyev':r'Елисеева','fulde':r'Фульд\w*','filippov':r'Филиппов','tyutkin':r'Тютькин','moscow-station':r'станци\w* Петербургской железной дороги','ostend':r'остендск\w*'})
coords=json.loads((R/'coordinates.json').read_text(encoding='utf8'))
names='''moscow|Moscow|Mosca|Moscou|Moscú
petersburg|Saint Petersburg|San Pietroburgo|Saint-Pétersbourg|San Petersburgo
russia|Russia|Russia|Russie|Rusia
europe|Europe|Europa|Europe|Europa
england|England|Inghilterra|Angleterre|Inglaterra
germany|Germany|Germania|Allemagne|Alemania
france|France|Francia|France|Francia
italy|Italy|Italia|Italie|Italia
america|America (dream and cultural references)|America (sogno e riferimenti culturali)|Amérique (rêve et références culturelles)|América (sueño y referencias culturales)
switzerland|Switzerland|Svizzera|Suisse|Suiza
prussia|Historical Prussia|Prussia storica|Prusse historique|Prusia histórica
poland|Poland|Polonia|Pologne|Polonia
china|China|Cina|Chine|China
india|India|India|Inde|India
spain|Spain|Spagna|Espagne|España
turkey|Turkey|Turchia|Turquie|Turquía
serbia|Serbia|Serbia|Serbie|Serbia
montenegro|Montenegro|Montenegro|Monténégro|Montenegro
herzegovina|Herzegovina|Erzegovina|Herzégovine|Herzegovina
central-asia|Central Asia|Asia centrale|Asie centrale|Asia Central
darmstadt|Darmstadt in Oblonsky’s dream|Darmstadt nel sogno di Oblonskij|Darmstadt dans le rêve d’Oblonski|Darmstadt en el sueño de Oblonski
wiesbaden|Wiesbaden|Wiesbaden|Wiesbaden|Wiesbaden
tver|Tver|Tver’|Tver|Tver
nice|Nice|Nizza|Nice|Niza
naples|Naples|Napoli|Naples|Nápoles
sorrento|Sorrento|Sorrento|Sorrente|Sorrento
paris|Paris|Parigi|Paris|París
rome|Rome|Roma|Rome|Roma
karlsbad|Karlsbad (Karlovy Vary)|Karlsbad (Karlovy Vary)|Carlsbad (Karlovy Vary)|Karlsbad (Karlovy Vary)
baden|Baden-Baden|Baden-Baden|Baden-Baden|Baden-Baden
kissingen|Bad Kissingen|Bad Kissingen|Bad Kissingen|Bad Kissingen
soden|Soden (Bad Soden am Taunus)|Soden (Bad Soden am Taunus)|Soden (Bad Soden am Taunus)|Soden (Bad Soden am Taunus)
frankfurt|Frankfurt am Main|Francoforte sul Meno|Francfort-sur-le-Main|Fráncfort del Meno
menton|Menton|Mentone|Menton|Menton
mulhouse|Mulhouse|Mulhouse|Mulhouse|Mulhouse
kiev|Kiev (Kyiv)|Kiev (Kyiv)|Kiev (Kyiv)|Kiev (Kyiv)
kharkov|Kharkov (Kharkiv)|Char’kov (Kharkiv)|Kharkov (Kharkiv)|Járkov (Kharkiv)
tashkent|Tashkent|Taškent|Tachkent|Taskent
helsinki|Helsingfors (Helsinki)|Helsingfors (Helsinki)|Helsingfors (Helsinki)|Helsingfors (Helsinki)
khiva|Khiva|Chiva|Khiva|Jiva
crimea|Crimea|Crimea|Crimée|Crimea
kursk|Kursk|Kursk|Koursk|Kursk
volga|Volga|Volga|Volga|Volga
rhine|Rhine|Reno|Rhin|Rin
babylon|Babylon (comparison)|Babilonia (paragone)|Babylone (comparaison)|Babilonia (comparación)
flensburg|Flensburg (oyster provenance)|Flensburg (provenienza delle ostriche)|Flensbourg (provenance des huîtres)|Flensburgo (procedencia de las ostras)
ostend|Ostend (oyster provenance)|Ostenda (provenienza delle ostriche)|Ostende (provenance des huîtres)|Ostende (procedencia de las ostras)
peterhof|Peterhof|Peterhof|Peterhof|Peterhof
tsarskoe|Tsarskoye Selo|Carskoe Selo|Tsarskoïe Selo|Tsárskoye Seló
krasnoe|Krasnoye Selo and racecourse area|Krasnoe Selo e area delle corse|Krasnoïe Selo et région des courses|Krásnoye Seló y zona de carreras
moscow-zoo|Moscow Zoological Garden|Giardino zoologico di Mosca|Jardin zoologique de Moscou|Jardín zoológico de Moscú
hermitage-restaurant|Hermitage restaurant, Moscow|Ristorante Ermitage, Mosca|Restaurant Ermitage, Moscou|Restaurante Hermitage, Moscú
english-club|English Club (institution; exact branch uncertain)|Club inglese (istituzione; sede incerta)|Club anglais (institution ; siège incertain)|Club Inglés (institución; sede incierta)
summer-garden|Summer Garden|Giardino d’estate|Jardin d’été|Jardín de Verano
nevsky|Nevsky Prospekt|Prospettiva Nevskij|Perspective Nevski|Avenida Nevski
bolshaya-morskaya|Bolshaya Morskaya Street|Via Bol’šaja Morskaja|Rue Bolchaïa Morskaïa|Calle Bolshaya Morskaya
voz-dvizhenka|Vozdvizhenka Street|Via Vozdviženka|Rue Vozdvijenka|Calle Vozdvizhenka
sivtsev|Sivtsev Vrazhek Lane|Vicolo Sivcev Vražek|Ruelle Sivtsev Vrajek|Callejón Sívtsev Vrázhek
nikitskaya|Nikitskaya Street (representative area)|Via Nikitskaja (area rappresentativa)|Rue Nikitskaïa (zone indicative)|Calle Nikítskaya (zona representativa)
znamenka|Znamenka Street|Via Znamenka|Rue Znamenka|Calle Znamenka
okhotny|Okhotny Ryad|Ochotnyj Rjad|Okhotny Riad|Ojotni Riad
kislovka|Kislovka (Kislovsky lanes area)|Kislovka (area dei vicoli Kislovskij)|Kislovka (quartier des ruelles Kislovski)|Kislovka (zona de los callejones Kislovski)
arbat|Arbat|Arbat|Arbat|Arbat
obiralovka|Obiralovka (modern Zheleznodorozhny area)|Obiralovka (area dell’odierna Železnodorožnyj)|Obiralovka (région de Jeleznodorojny)|Obiralovka (zona de Zheleznodorozhni)
nizhny-station|Moscow Nizhny Novgorod railway station and line|Stazione e linea di Nižnij Novgorod a Mosca|Gare et ligne de Nijni Novgorod à Moscou|Estación y línea de Nizhni Nóvgorod en Moscú
kursk-station|Moscow Kursk railway station|Stazione Kursk di Mosca|Gare de Koursk à Moscou|Estación Kursk de Moscú
troitsa|Trinity monastery (Troitsa)|Monastero della Trinità (Troica)|Monastère de la Trinité (Troïtsa)|Monasterio de la Trinidad (Troitsa)
mytishchi|Mytishchi wells area|Area dei pozzi di Mytišči|Région des puits de Mytichtchi|Zona de los pozos de Mytishchi
karazin|Karazin district (fictional or unidentified)|Distretto di Karazin (immaginario o non identificato)|District de Karazine (fictif ou non identifié)|Distrito de Karazin (ficticio o sin identificar)
pokrovskoe|Pokrovskoye, Levin’s estate|Pokrovskoe, tenuta di Levin|Pokrovskoïe, domaine de Lévine|Pokróvskoye, finca de Levin
ergushovo|Ergushovo, Dolly’s estate|Ergušovo, tenuta di Dolly|Ergouchovo, domaine de Dolly|Ergúshovo, finca de Dolly
vozdvizhenskoe|Vozdvizhenskoye, Vronsky’s estate|Vozdviženskoe, tenuta di Vronskij|Vozdvijenskoïe, domaine de Vronski|Vozdvízhenskoye, finca de Vronski
kashin|Kashin and Kashin province in the novel|Kašin e governatorato di Kašin nel romanzo|Kachine et province de Kachine dans le roman|Kashin y provincia de Kashin en la novela
kolpenskoye|Kolpenskoye marsh|Palude di Kolpenskoe|Marais de Kolpenskoïe|Pantano de Kolpénskoye
mashkin|Mashkin Verkh meadow|Prato di Maškin Verch|Pré de Machkine Verkh|Prado de Mashkin Verj
kalinovy|Kalinovy meadow|Prato Kalinovyj|Pré Kalinovy|Prado Kalinovi
sur-forest|Surov district and marshes|Distretto di Surov e paludi|District de Sourov et marais|Distrito de Súrov y pantanos
gurin|Gurin’s restaurant|Ristorante di Gurin|Restaurant de Gourine|Restaurante de Gurin
dussot|Dussot hotel|Albergo Dussot|Hôtel Dussot|Hotel Dussot
buff-theatre|Buff theatre|Teatro Buff|Théâtre Buff|Teatro Buff
page-corps|Corps of Pages|Corpo dei paggi|Corps des pages|Cuerpo de Pajes
moscow-university|University (not always identified)|Università (non sempre identificata)|Université (parfois non identifiée)|Universidad (no siempre identificada)
foundling|Foundling Home|Casa dei trovatelli|Maison des enfants trouvés|Casa de Expósitos
proud|Prudnoye hunting grounds|Terreni di caccia di Prudnoe|Terrains de chasse de Proudnoïe|Terrenos de caza de Prúdnoe
khapilovo|Khapilovo hunting grounds|Terreni di caccia di Chapilovo|Terrains de chasse de Khapilovo|Terrenos de caza de Jápilovo
birch-dale|Birch Dale|Valle delle betulle|Vallon des bouleaux|Valle de los abedules
chefir|Chefirovka|Čefirovka|Tcheﬁrovka|Chefirovka
sura|Sury|Sury|Soury|Sury
slavyansky|Slavyansky Bazaar|Slavjanskij Bazar|Bazar slave|Bazar Eslavo
venice|Venice|Venezia|Venise|Venecia
byzantium|Byzantium|Bisanzio|Byzance|Bizancio
samara|Samara region|Regione di Samara|Région de Samara|Región de Samara
tsaritsyno|Tsaritsyno railway station|Stazione ferroviaria di Caricyno|Gare de Tsaritsyno|Estación de Tsarítsino
gvozdevo|Gvozdevo village and marshes|Villaggio e paludi di Gvozdevo|Village et marais de Gvozdevo|Pueblo y pantanos de Gvózdevo
gazetny|Gazetny Lane|Vicolo Gazetnyj|Ruelle Gazetny|Callejón Gazetni
bolshoi|Bolshoi Theatre|Teatro Bol’šoj|Théâtre Bolchoï|Teatro Bolshói
penza|Penza governorate|Governatorato di Penza|Gouvernement de Penza|Gobernación de Penza
kazan|Kazan governorate|Governatorato di Kazan’|Gouvernement de Kazan|Gobernación de Kazán
bologoe|Bologoye|Bologoe|Bologoïe|Bologoye
usa|United States|Stati Uniti|États-Unis|Estados Unidos
vienna|Vienna exhibition|Esposizione di Vienna|Exposition de Vienne|Exposición de Viena
baltic|Baltic Sea|Mar Baltico|Mer Baltique|Mar Báltico
corso|Via del Corso, Rome|Via del Corso, Roma|Via del Corso, Rome|Via del Corso, Roma
voz-drema|Vozdrema village|Villaggio di Vozdrema|Village de Vozdrema|Pueblo de Vozdrema
western-region|Western region of the Russian Empire|Territorio occidentale dell’Impero russo|Région occidentale de l’Empire russe|Territorio occidental del Imperio ruso
kolok|Kolok, woods near Levin’s house|Kolok, bosco presso la casa di Levin|Kolok, bois près de la maison de Lévine|Kolok, bosque junto a la casa de Levin
seleznev|Seleznev district|Distretto di Seleznev|District de Seleznev|Distrito de Seleznev
eliseyev|Eliseyev’s shop|Negozio di Eliseev|Magasin Elisseïev|Tienda de Eliseyev
fulde|Fulde’s shop|Negozio di Fulde|Magasin de Foulde|Tienda de Fulde
filippov|Filippov’s bakery|Panetteria di Filippov|Boulangerie Filippov|Panadería Filippov
tyutkin|Tyutkin’s hairdresser|Parrucchiere Tjutkin|Coiffeur Tioutkine|Peluquería Tiutkin
moscow-station|Moscow station of the Petersburg railway|Stazione moscovita della ferrovia per Pietroburgo|Gare moscovite du chemin de fer de Pétersbourg|Estación moscovita del ferrocarril de Petersburgo
england-restaurant|England restaurant, Moscow|Ristorante Anglija, Mosca|Restaurant Anglia, Moscou|Restaurante Anglia, Moscú'''
N={line.split('|')[0]:line.split('|')[1:] for line in names.splitlines()}
dictionary={l:{} for l in ['en','it','fr','es']}
def tr(values):
    for l,v in zip(dictionary,values):dictionary[l][values[0]]=v
    return values[0]
for labels in N.values():tr(labels)
def phrase(*values):return tr(values)
mention=phrase('Named reference, reported residence, comparison or planned/recalled travel; no enacted scene at this place is established by the quotation.','Riferimento nominato, residenza riferita, paragone o viaggio progettato/riepilogato; la citazione non dimostra una scena narrata in questo luogo.','Référence nommée, résidence rapportée, comparaison ou voyage projeté/résumé ; la citation ne démontre pas de scène racontée dans ce lieu.','Referencia nombrada, residencia referida, comparación o viaje previsto/resumido; la cita no demuestra una escena narrada en este lugar.')
uncertain=phrase('The narrative name does not establish a unique real-world location. No coordinates are assigned.','Il nome narrativo non identifica un luogo reale univoco. Non sono assegnate coordinate.','Le nom narratif ne permet pas une localisation réelle unique. Aucune coordonnée n’est attribuée.','El nombre narrativo no identifica una ubicación real única. No se asignan coordenadas.')
geonote=phrase('Representative point for the named area, street or institution; not an exact character position or a fictional address. Historical borders may differ from modern map labels.','Punto rappresentativo dell’area, strada o istituzione nominata; non indica la posizione esatta del personaggio o un indirizzo immaginario. I confini storici possono differire dalle etichette moderne.','Point indicatif de la région, rue ou institution nommée ; ni position exacte du personnage ni adresse fictive. Les frontières historiques peuvent différer des indications modernes.','Punto representativo de la zona, calle o institución nombrada; no indica la posición exacta del personaje ni una dirección ficticia. Las fronteras históricas pueden diferir de las etiquetas modernas.')
# Scene overrides are individually tied to an original paragraph, not a city-wide category.
# Named places omitted from this list remain mentioned, including summarized past journeys.
A={
(7,'moscow'):(0,'Levin enters Koznyshev’s study after arriving in Moscow; the arrival and conversation form the scene.'),
(9,'moscow-zoo'):(0,'Levin leaves the cab at the Zoological Garden and walks to the skating rink to meet Kitty.'),
(30,'petersburg'):(9,'Anna gets off the train in Petersburg and meets Karenin on the platform.'),
(31,'petersburg'):(3,'Vronsky leaves the carriage in Petersburg and waits for Anna to emerge.'),
(31,'bologoe'):(2,'Vronsky recalls getting out at Bologoye and speaking to Anna; narrated recollection, not the Petersburg arrival.'),
(34,'bolshaya-morskaya'):((0,1),'The apartment is identified on Morskaya; Vronsky returns and finds Petritsky and guests making coffee. The street marker does not fix the apartment number.'),
(34,'petersburg'):((0,1),'Vronsky’s return to his Petersburg apartment and conversation with the guests are narrated.'),
(40,'bolshaya-morskaya'):(0,'Betsy returns from the theatre and guests enter her house on Bolshaya Morskaya; no house number is asserted.'),
(68,'soden'):(6,'The prince walks with Kitty and converses about Soden while being introduced to the spa guests.'),
(74,'mashkin'):(26,'The mowers enter the ravine of Mashkin Verkh; the subsequent mowing continues this scene.'),
(75,'mashkin'):(0,'The mowing of Mashkin Verkh ends and Levin rides home while hearing the departing mowers.'),
(83,'petersburg'):(0,'Karenin approaches Petersburg, enters the hall and orders papers to his study.'),
(107,'gazetny'):(6,'Karenin’s carriage meets Oblonsky and Dolly at the corner of Gazetny Lane.'),
(107,'moscow'):((5,6,7),'The three-day stay in Moscow is followed by the enacted carriage encounter with Oblonsky and Dolly.'),
(108,'bolshoi'):(0,'Oblonsky visits the ballet rehearsal and gives coral beads to Chibisova backstage.'),
(108,'okhotny'):(0,'Oblonsky personally selects fish and asparagus in Okhotny Ryad.'),
(108,'dussot'):(0,'Oblonsky goes to Dussot’s hotel and visits Levin, his superior and Karenin; historical building coordinates are withheld.'),
(116,'gazetny'):(2,'Levin walks around Gazetny Lane and Kislovka while awaiting his visit to the Shcherbatskys.'),
(116,'kislovka'):(2,'Levin walks through the Kislovka lanes and returns to his hotel; a representative area is used.'),
(118,'nevsky'):(9,'Karenin rides along deserted Nevsky Prospekt after returning to Petersburg.'),
(118,'petersburg'):(9,'Karenin’s early-morning carriage journey along Nevsky is narrated.'),
(129,'moscow'):(0,'The Moscow wedding guests talk during Kitty and Levin’s betrothal ceremony.'),
(151,'summer-garden'):(0,'Seryozha remembers following a veiled woman along the Summer Garden path, hoping she is his mother; remembered scene.'),
(152,'petersburg'):(0,'Anna and Vronsky check into separate rooms of a Petersburg hotel before the visits narrated in this chapter.'),
(166,'gvozdevo'):(34,'After breakfast the hunters reach Gvozdevo marsh and begin the hunting episode.'),
(183,'kashin'):(6,'The governor opens the assembly with a speech to the Kashin nobility; the narrative province remains fictional or unidentified.'),
(191,'nikitskaya'):(49,'Levin takes a cab to Nikitskaya on his way to meeting the scholars.'),
(219,'nizhny-station'):(3,'Anna reaches the low building of the Moscow Nizhny Novgorod station and porters run towards her.'),
(222,'kursk-station'):(0,'Koznyshev and Katavasov arrive at the Moscow station of the Kursk railway among volunteers and flower-bearing women.'),
(223,'tsaritsyno'):(1,'A choir greets the arriving train at Tsaritsyno; the volunteers bow from the carriage.'),
(226,'pokrovskoe'):(0,'Koznyshev and Katavasov arrive at Pokrovskoye’s porch; Kitty descends from the balcony to greet them.'),
(237,'kolok'):(7,'Levin runs into Kolok during the storm to find Kitty and the baby; the nearby woods were identified in VIII.XIV.'),
}
excluded={(9,'england'),(135,'russia'),(148,'nevsky'),(150,'nevsky'),(151,'nevsky'),(26,'don'),(40,'schuetzburg')}
# Non-toponym personal/institutional names are not geographical points.
for k in ['yar','don','schuetzburg']:patterns.pop(k,None)
def quote(s,idx,pattern=None):
    if isinstance(idx,tuple):return '\n'.join(s['paragraphs'][i] for i in idx)
    p=s['paragraphs'][idx]
    if len(p)<=1600:return p
    m=re.search(pattern or r'\w+',p)
    at=m.start() if m else 0
    # Select complete sentences around the actual textual form; never manufacture ellipses or words.
    starts=[0]+[m.end() for m in re.finditer(r'[.!?…][»”]?\s+',p)]
    before=max(i for i in starts if i<=at)
    after=next((i for i in starts if i>(m.end() if m else at)+250),len(p))
    q=p[before:after].strip()
    assert q in s['text']
    return q
def passage(s,q,terms):
    return {'language':'ru','type':'original','quote':q,'attribution':f"Л. Н. Толстой, Анна Каренина, часть {s['part']}, глава {s['chapter']}; ПСС, т. {s['volume']} ({1934 if s['volume']==18 else 1935}), Н. К. Гудзий / П. Н. Сакулин",'url':s['url'],'rightsUrl':s['url'],'edition':f"ПСС в 90 томах, том {s['volume']}, Москва{' — Ленинград' if s['volume']==18 else ''}, Художественная литература, {1934 if s['volume']==18 else 1935}; tolstoy.ru electronic edition",'highlightTerms':terms}
data={'book':{'id':ID,'title':'Anna Karenina','author':'Leo Tolstoy','year':'1878','originalLanguage':'ru','unit':'Chapter','hashPrefix':'section','description':'Eight parts: Moscow, Petersburg, country estates, railways and European journeys.','sidebarTitle':'The eight parts','help':'Choose a chapter or explore all places.','sidebarNote':uncertain,'initialView':{'center':[35,57],'zoom':5},'citationCsvPrefix':ID+'-citations','links':[{'url':f'https://tolstoy.ru/online/90/{v}/','label':f'Tolstoy · critical Russian edition · volume {v}'} for v in (18,19)]+[{'url':'https://community.middlebury.edu/~beyer/courses/RUSS0101a-f05/Tolstoy/setting_significance.htm','label':'Middlebury · role of setting'},{'url':'https://tolstoymuseum.ru/wp-content/uploads/2023/04/sbornik-2016_compressed.pdf','label':'Tolstoy Museum · scholarly proceedings (2016)'}],'footerHtml':'<p>Complete original Russian: 239 chapters in eight parts, based on PSS volumes 18 (1934) and 19 (1935). The epigraph is retained in the research corpus; the novel has no separate prologue or epilogue. Historical place names and uncertain estates are documented separately from modern coordinates.</p>'},'chapters':[],'places':{},'citedPlaces':{}}
analysis={'bookId':ID,'edition':{'volumes':[18,19],'years':[1934,1935],'language':'ru','source':'tolstoy.ru','epigraph':'Мне отмщение, и Аз воздам.','noSeparatePrologueOrEpilogue':True},'structure':{'parts':[34,35,32,23,33,32,31,19],'chapters':239,'characters':sum(len(s['text']) for s in S)},'method':'Whole-corpus paragraph search, proper-name and locative-form census, section-by-section contextual review of candidates and scene settings. Category belongs to each reference. Summaries, provenance and proposed journeys remain mentioned. This is not a diplomatic collation or a guarantee that every implicit geographical allusion has been exhausted.','sections':[],'ambiguities':[],'specialistSources':[{'url':'https://tolstoy.ru/online/90/18/','role':'Original text and critical preface'},{'url':'https://tolstoy.ru/online/90/19/','role':'Original text, textual commentary and name index'},{'url':'https://community.middlebury.edu/~beyer/courses/RUSS0101a-f05/Tolstoy/setting_significance.htm','role':'Teaching resource; interpretive comparison of cities and estates, not coordinate evidence'},{'url':'https://tolstoymuseum.ru/wp-content/uploads/2023/04/sbornik-2016_compressed.pdf','role':'Museum scholarly proceedings; railway geography and Obiralovka'},{'url':'https://ypmuseum.ru/filials/pokrovskoe?lang=ru','role':'Real Tolstoy-family estate; its existence does not prove identity with Levin’s fictional estate'}]}
def place(k):
    if k in data['places']:return
    c=coords[k]['candidates'][0];loc=c['location']
    # All points represent an area, including station localities: no precision is invented.
    data['places'][k]={'name':N[k][0],'coords':[loc['y'],loc['x']],'area':'Historical geography','kind':'area','zoom':9 if k in ['moscow','petersburg'] else 6,'checked':'2026-10-12','status':'Representative geographical position','note':geonote,'method':'ArcGIS World Geocoding; reviewed against query and regional context','positionSource':{'url':coords[k]['url'],'label':'ArcGIS · '+coords[k]['query']},'narrativeSource':{'url':'https://tolstoy.ru/online/90/18/','label':'Tolstoy · PSS volumes 18–19'},'aliases':[]}
records={}
for s in S:
    title=f"Part {s['part']} · Chapter {s['chapter']}"
    tr([title,f"Parte {s['part']} · Capitolo {s['chapter']}",f"Partie {s['part']} · Chapitre {s['chapter']}",f"Parte {s['part']} · Capítulo {s['chapter']}"])
    c={'id':s['id'],'title':title,'time':'1870s','setting':'Russia and referenced places','people':'Anna, Levin and their social circles','text':'Scenes, recollections and geographical references in this chapter.','note':uncertain,'links':[{'url':s['url'],'label':'Tolstoy · original Russian'}],'places':[],'placeText':[],'placeCategories':{},'placeExcerpts':{},'citations':[],'unlocatedPlaces':[]}
    refs=[]
    for k,pattern in patterns.items():
        idx=[i for i,p in enumerate(s['paragraphs']) if re.search(pattern,p)]
        if not idx or (s['id'],k) in excluded:continue
        if k not in N:continue
        override=A.get((s['id'],k));category='action' if override else 'mentioned'
        pi,reason=override if override else (idx[0],mention)
        q=quote(s,pi,pattern);terms=list(dict.fromkeys(m.group() for m in re.finditer(pattern,q)))
        assert terms,(s['id'],k,pi)
        rec={'id':k,'category':category,'reason':reason,'quote':q,'paragraphs':list(pi) if isinstance(pi,tuple) else [pi],'matchedParagraphs':idx,'highlightTerms':terms,'narrativeLevel':'recollection' if (s['id'],k) in [(31,'bologoe'),(151,'summer-garden')] else 'primary narrative or named discourse','source':s['url']}
        refs.append(rec)
        if k in coords and k not in ['tsaritsyno']:
            place(k);data['places'][k]['aliases']=list(dict.fromkeys(data['places'][k]['aliases']+terms))
            c['places'].append(k);c['placeText'].append(reason);c['placeCategories'][k]=category;c['placeExcerpts'][k]={'original':passage(s,q,terms),'translations':{}}
        else:
            c['unlocatedPlaces'].append({'id':k,'name':N[k][0],'text':reason+' '+uncertain,'category':category,**passage(s,q,terms)})
    # The restaurant Anglia is a destination in Moscow, never a country marker.
    if s['id']==9:
        q=s['paragraphs'][55];c['unlocatedPlaces'].append({'id':'england-restaurant','name':N['england-restaurant'][0],'text':mention+' '+uncertain,'category':'mentioned',**passage(s,q,['Англию'])})
        refs.append({'id':'england-restaurant','category':'mentioned','quote':q,'reason':'Restaurant proposed for dinner; not a trip to England.','highlightTerms':['Англию']})
    records[s['id']]=(s,c,refs);data['chapters'].append(c)
# Supplement implicit but enacted settings with their own section-local evidence.
# ranges | setting id | name | textual form pattern | enacted event/context
scenes=[
('1-4','oblonsky-house','Oblonsky house in Moscow',r'доме|комнат|кабинет|спальн|стол','Domestic crisis, dressing and the spouses’ confrontation; an unspecified house, not a surveyed Moscow address.'),
('5','office','Oblonsky’s government office',r'присутств|кабинет','Levin’s visit and conversation with Oblonsky at the office.'),
('6,12-16,117','shcherbatsky-house','Shcherbatsky house',r'дом[еаà]?|гостин|комнат|кабинет','The Shcherbatsky family and Levin’s proposal or engagement; the precise house address is unverified.'),
('7-8','koznyshev-house','Koznyshev’s study',r'кабинет|стул','Levin and his brother converse in the study; the interior is not assigned coordinates.'),
('10-11','hermitage-scene','Hermitage dining room',r'столов|гостиниц|Татарин|бокал','Levin and Oblonsky dine and talk; context continues the Hermitage chosen in I.IX.'),
('19-21,28','oblonsky-house','Oblonsky house in Moscow',r'дома|комнат|гостин|столов','Anna visits Dolly and the children; family conversation and preparations for departure.'),
('22-23','ballroom','Moscow ballroom',r'зал|лестниц|бале|вальс','Kitty watches Anna and Vronsky dance; the host’s house is not identified with a real address.'),
('24-25','nikolai-room','Nikolai Levin’s Moscow room',r'комнат|углу|стол','Levin visits his brother and meets Kritsky and Marya; exact lodging unknown.'),
('26-27,46-48,50-51,70-73,75,98-101,138-140,158-160,163-165,171-172,227,234-236,238-239','levin-house','Levin’s house and estate grounds',r'дом[аеу]?|кабинет|комнат|двор|террас|балкон|саду|хозяйств','Domestic, agricultural or reflective action at Levin’s estate. The context identifies Pokrovskoye; no real estate is equated with the fictional house.'),
('29','train-north','Night train from Moscow to Petersburg',r'вагон|диванчик','Anna reads, dreams and reflects in the moving railway carriage; no fixed coordinate is appropriate.'),
('30','bologoe-platform','Snowbound railway platform (Bologoye context)',r'станции|платформ','Anna and Vronsky meet on the snowbound platform; Bologoye is named in Vronsky’s recollection in I.XXXI.'),
('17-18','moscow-station-scene','Moscow Petersburg-railway platform',r'станци|вагон|кондуктор','Vronsky meets Anna and his mother at the Moscow arrival; the railway worker’s fatal accident occurs at this station, not in Petersburg.'),
('32-33,42-44,102,104-105,118-123,145-146,150-151,153-154,206-208','karenin-house','Karenin house in Petersburg',r'дом[аеу]?|комнат|кабинет|гостин|постел|крыльц|зале','The Karenin household: conversations, marital conflict, illness, visits or Seryozha’s lessons. No precise street address is established.'),
('34','vronsky-apartment','Vronsky’s Morskaya apartment',r'квартир|комнат','Vronsky returns to the shared apartment and joins Petritsky’s guests; the street is mapped separately.'),
('35-37','kitty-room','Kitty’s rooms in the Shcherbatsky house',r'дом[аеу]?|комнат|кабинет','Medical consultation and Dolly’s conversation with the ill Kitty.'),
('38-39','opera','Petersburg opera theatre',r'театр|опер|лож','Betsy and Vronsky converse at the opera; the excerpt does not name the building, so Mariinsky Theatre is not asserted.'),
('40-41','betsy-house','Betsy’s Bolshaya Morskaya salon',r'дом[аеу]?|гостин','Guests take tea and Anna meets Vronsky in Betsy’s salon.'),
('45','anna-rendezvous','Anna and Vronsky’s unnamed meeting place',r'ковр|пол|комнат','Anna and Vronsky’s intimate encounter; its exact building is unnamed.'),
('49','woodcock-clearing','Woodcock hunting clearing near Levin’s estate',r'полян|осин|лес|речк','Levin and Oblonsky wait and shoot during the evening woodcock hunt.'),
('53-54,88-90','military-quarters','Vronsky’s regimental quarters',r'зал|изб|комнат|двор','Vronsky’s regimental meals, accounts and conversations; camp and city quarters are not pinned to an invented building.'),
('55,58-59,62-63','racecourse','Krasnoye Selo racecourse',r'гипподром|скач|круг|беседк','Vronsky prepares for and rides the steeplechase; Anna watches his fall. The course is known contextually from II.XIX, but no track geometry is asserted.'),
('56-57,60-61,82,84-85','karenin-dacha','Karenin summer house at Peterhof',r'дач|балкон|дом[аеу]?|комнат','Anna’s summer-house encounters and preparations; Peterhof is named in II.XXVI, while the house itself has no verified coordinates.'),
('86-87','betsy-dacha','Betsy’s summer house and croquet grounds',r'крокет|гостин|сад|двор','Anna and Betsy’s guests converse and take part in the croquet gathering; no exact estate coordinates.'),
('64-69','soden-spa','Soden spa, gallery and lodging',r'водах|вод|галлер|садик|двор|сад','Kitty’s spa life, walks, friendships and care for the sick. Soden is named within II.XXXIV; exact buildings are not identified.'),
('73-74','mowing','Mowing grounds near Pokrovskoye',r'косить|покос|луг|ряды','Levin works alongside the mowers; the meadows are narrative places with no unique real-world match.'),
('76-79','dolly-country-house','Dolly’s Ergushovo house and grounds',r'деревн|дом[аеу]?|сад|двор|купал','Dolly organizes country life, takes the children bathing and receives Levin; Ergushovo’s exact real location is unknown.'),
('80-81','sister-meadows','Meadows of Levin’s sister’s estate',r'луг|сено|воз|копн','Levin oversees haymaking and stays by a haystack, observing the peasants; the estate is distinct from his own.'),
('91','rendezvous-garden','Garden of Anna and Vronsky’s meeting',r'сад|скамейк|алле','Vronsky meets Anna in an unnamed garden; the place of the conversation is not given a street address.'),
('92','commission','Karenin’s committee meeting room',r'зал|заседани','Karenin participates in the committee meeting before Anna returns home.'),
('94','peasant-farm','Peasant’s farm on the Surov road',r'ворот|двор|дом[аеу]?','Levin stops to feed the horses and examines the prosperous peasant farm en route to Sviyazhsky.'),
('95-97','sviyazhsky-estate','Sviyazhsky’s estate',r'дом[аеу]?|комнат|чай|стол','Levin visits Sviyazhsky; dinner and conversations about agriculture occur in the estate house.'),
('106','lawyer','Petersburg lawyer’s office',r'комнат|кабинет|приемн','Karenin consults the lawyer about divorce; the office address is not supplied.'),
('109,115-116,126','moscow-hotel','Moscow hotel rooms (Dussot context)',r'гостиниц|нумер|номер|комнат','Hotel-room conversations and waiting during Karenin’s or Levin’s Moscow stay; no exact room location is assigned.'),
('110-114','oblonsky-dinner','Oblonsky dining and drawing rooms',r'обед|стол|гостин|комнат|сели','The Moscow dinner gathering and Kitty and Levin’s renewed proposal; separate from distant places discussed by guests.'),
('125,127-130','wedding-church','Church of Kitty and Levin’s wedding',r'церк|обедн','Confession, betrothal and wedding rites are enacted in a Moscow church; no particular church is claimed.'),
('131-137','italian-city','Unnamed Italian city, palazzo and artist’s studio',r'итальянский город|гостиниц|палаццо|студи|комнат|диван|домой','Anna and Vronsky’s Italian stay and Mikhailov’s painting sessions. Venice, Rome and Naples are summarized earlier stops, not the unnamed city’s proven identity.'),
('141-144','provincial-hotel','Provincial hotel where Nikolai Levin dies',r'гостиниц|нумер|комнат|больного','Levin and Kitty care for the dying Nikolai in an unnamed provincial hotel. The doctor summoned from Moscow does not make the hotel a Moscow setting.'),
('147-149,210-211','lydia-house','Lydia Ivanovna’s house and study',r'кабинет|комнат|стол|дом[аеу]?','Lydia discusses Karenin’s situation and later receives Oblonsky and Landau; precise address unknown.'),
('148','palace','Imperial palace reception',r'дворц|поздравл','Officials gather for congratulations and discuss Karenin; the excerpt does not establish a particular palace.'),
('152,155-156','petersburg-hotel','Anna and Vronsky’s Petersburg hotel',r'гостиниц|комнат|отделени','Anna stays in the hotel, prepares for visits and receives Vronsky and Yashvin.'),
('157','opera-scandal','Petersburg opera audience and box',r'театр|лож|опер','Vronsky goes to the opera; Anna experiences public rejection in her box. The theatre remains unnamed in the novel.'),
('161-162','mushroom-woods','Woods of the mushroom-picking outing',r'лес|гриб|берез|опушк','Koznyshev and Varenka walk and gather mushrooms; the expected proposal does not happen.'),
('166-167,169-170','hunt-marshes','Marshes of the Gvozdevo hunting trip',r'болот|луг|дупел|бекас','Levin and his companions hunt snipe and other birds; narrative marshes without surveyed coordinates.'),
('168','hunting-izba','Peasant hut at the hunting stop',r'изб|лавк|сен','The hunters stay and converse in a peasant hut; the village episode belongs to the Gvozdevo trip.'),
('173-174','vozdvizhen-road','Road to Vozdvizhenskoye',r'дорог|поле|поворот','Dolly travels to Anna and asks directions near Vronsky’s estate.'),
('175-182,189','vozdvizhen-house','Vozdvizhenskoye house, garden and hospital',r'дом[аеу]?|комнат|террас|сад|больниц','Dolly visits Anna and Vronsky, tours the new hospital and talks in the house; later Anna waits while Vronsky attends the elections.'),
('183-187','election-rooms','Kashin election assembly and cathedral',r'собор|зал|собран|выбор','The noble elections and associated service; the fictional province cannot be equated securely with modern Kashin.'),
('188','election-dinner','Vronsky’s lodgings during the elections',r'обед|дом[аеу]?|квартир','Vronsky hosts the victorious election party; exact lodgings in the narrative province are unknown.'),
('190-191,200,202-205','levin-moscow-house','Levin and Kitty’s Moscow lodging',r'комнат|дом[аеу]?|кабинет|постел','Conversations, waiting for childbirth and the birth of Mitya; the precise residence is not established.'),
('192','katavasov-house','Katavasov’s Moscow drawing room',r'гостин|комнат','Levin meets Katavasov and Metrov for scholarly and political conversation.'),
('193','lvov-house','Lvov family home',r'комнат|кабинет|дом[аеу]?','Levin visits Lvov and his family and discusses the children’s education.'),
('194','concert','Moscow concert hall',r'концерт|кресл|колонн','Levin listens to the concert and evaluates the new music; the hall is unnamed.'),
('195','countess-bol','Countess Bol’s house',r'дома|гостин|сени','Levin makes the formal social call to Countess Bol.'),
('196-197','moscow-club','Moscow club dining, billiard and reading rooms',r'клуб|зал|бильярд|комнат','Levin dines, meets companions and visits the club rooms; identification with a precise building is withheld.'),
('198-199,201,212-216','anna-moscow-house','Anna and Vronsky’s Moscow rooms',r'комнат|гостин|кабинет|дом[аеу]?','Levin’s visit, Anna’s conversations and the later quarrels with Vronsky occur in the Moscow lodging.'),
('203','doctor-house','Moscow doctor’s home and pharmacy route',r'лаке|доктор|аптек','Levin searches for the doctor during Kitty’s labour; neither the doctor’s address nor pharmacy is named.'),
('217-218','anna-city-route','Anna’s final Moscow carriage route',r'коляск|улиц|дом[аеу]?','Anna rides through Moscow, visits Dolly and Kitty, and returns home in mounting distress.'),
('220','train-east','Train from Moscow towards Obiralovka',r'вагон|платформ','Anna boards and travels in a carriage, observing fellow passengers; a moving train has no fixed coordinate.'),
('220','obiralovka-platform','Obiralovka platform and railway track',r'Когда поезд подошел к станции','Anna alights at the destination named in VII.XXX, walks along the platform and dies beneath a goods train. The identification is contextual; the original chapter’s words are highlighted without inserting the name.'),
('221-222','volunteer-departure','Moscow departure of the Serbian volunteers',r'станци|вагон','Koznyshev and Katavasov join the volunteers at the Kursk railway departure; Serbia is a destination, not an enacted battlefield.'),
('223-225','southbound-train','Kursk railway train and provincial platforms',r'вагон|платформ|станци','Conversations aboard the train and with Vronsky and his mother at an unnamed provincial stop; Kursk is the mother’s stated destination, not proof of the current stop.'),
('226','pokrovskoye-arrival','Porch and balcony of Pokrovskoye',r'крыльцу|балкон','Kitty welcomes Koznyshev and Katavasov to Levin’s home.'),
('103,119,124','vronsky-city-room','Vronsky’s city rooms',r'домой|комнат|стол|постел','Vronsky returns to his rooms or recovers after his attempt to shoot himself; distinct from the Karenin house.'),
('227','nursery','Nursery at Levin’s estate',r'кроватк|полога','Kitty and the nurse watch the sleeping baby in the nursery.'),
('44','betsy-visits','Betsy’s house in Anna’s social life',r'у княгини Бетси','Anna’s habitual social visits are summarized; no single scene is narrated in this passage.'),
('233','children-memory','Setting of Dolly’s children’s mischief',r'оставшись одни|на свечах','Levin recalls Dolly scolding the children for wasting raspberries and milk; the exact room is not named.'),
('231-233','levin-road','Levin’s farm road and countryside',r'дорог|лес|трава|берез|поле','Levin converses with Fyodor and reflects while walking in the countryside; philosophical discourse is distinguished from distant places mentioned.'),
('237','storm-woods','Kolok woods during the thunderstorm',r'Колок|лес|дерев','Levin rushes to the woods during the storm to find his family.'),
]
# Editorial corrections after reviewing the generated scene evidence. Select enacted passages
# instead of incidental nouns in biographical introductions or distant recollections.
scene_paragraphs={(1,'oblonsky-house'):2,(5,'office'):4,(28,'oblonsky-house'):3,(36,'kitty-room'):6,
    (42,'karenin-house'):1,(58,'racecourse'):11,(66,'soden-spa'):20,
    (73,'mowing'):19,(75,'levin-house'):1,(100,'levin-house'):0,(125,'wedding-church'):12,
    (153,'karenin-house'):7,(183,'election-rooms'):7,(187,'election-rooms'):31,
    (188,'election-dinner'):2,(189,'vozdvizhen-house'):5,(193,'lvov-house'):3,
    (194,'concert'):1,(206,'karenin-house'):4,(234,'levin-house'):42}
scene_conservative={16,51,60,67,76,77,80,82,84,86,88,89,91,95,99,104,115,117,118,120,
    131,138,140,143,145,147,157,165,170,175,190,200,203,207,208,215,217,231,235,236,50,56}
def ids(spec):
    for p in spec.split(','):
        if '-' in p:
            a,b=map(int,p.split('-'));yield from range(a,b+1)
        else:yield int(p)
for spec,key,name,pattern,reason in scenes:
    for sid in ids(spec):
        s,c,refs=records[sid]
        hits=[(i,p) for i,p in enumerate(s['paragraphs']) if re.search(pattern,p)]
        if not hits:continue
        pi,p=hits[0]
        if (sid,key) in scene_paragraphs:pi=scene_paragraphs[sid,key];p=s['paragraphs'][pi]
        q=quote(s,pi,pattern)
        terms=list(dict.fromkeys(m.group() for m in re.finditer(pattern,q)))
        if not terms:
            # A continuation can establish the room by a literal door/stair/furniture form.
            terms=[m.group() for m in re.finditer(r'передн\w*|лестниц\w*|гостиниц\w*|кабинет\w*|церк\w*|стол\w*|дом\w*|комнат\w*|беседк\w*|стул\w*|крыльц\w*|зал\w*|двор\w*',q)][:3]
        if not terms:continue
        # Explicit scene proofs require an enacted gesture/movement/perception, not an address or biographical summary.
        enacted=re.search(r'вош|выш|пош|приш|стоя|сид|леж|сказ|говор|поех|приех|подъех|смотр|оглян|ход|шел|шли|встал|кос|села|побеж|слуш|пил|чит|плак|крич|держ|был[аи]?|собрал|провел|просну|думал|брос|увид|застал',q)
        category='action' if enacted and sid not in scene_conservative|{2,6,12,44,46,70,98,102,182,212,221,233} else 'mentioned'
        # These chapters begin with exposition. Without scene-local evidence, keep the setting mentioned.
        item={'id':key,'name':name,'text':reason+' '+uncertain,'category':category,**passage(s,q,terms)}
        if not any(u['id']==key for u in c['unlocatedPlaces']):c['unlocatedPlaces'].append(item)
        refs.append({'id':key,'category':category,'reason':reason if category=='action' else reason+' The selected passage is introductory, retrospective or uncertain; conservatively mentioned.','quote':q,'paragraphs':[pi],'highlightTerms':terms,'narrativeLevel':'embedded memory' if sid==233 else 'primary narrative','source':s['url']})
        if category=='mentioned':analysis['ambiguities'].append({'section':sid,'id':key,'resolution':'mentioned','note':'The selected passage does not alone prove an enacted scene; no action status is retained pending verification.'})
for sid,(s,c,refs) in records.items():
    analysis['sections'].append({'id':sid,'part':s['part'],'chapter':s['chapter'],'volume':s['volume'],'sha256':s['sha256'],'paragraphs':len(s['paragraphs']),'source':s['url'],'reviewStatus':'reviewed with conservative mentioned rule','result':'documented references' if refs else 'no explicit location retained after review','references':refs})
    # Retain a general authentic excerpt even in chapters with no mapped locations.
    c['excerpts']={'original':passage(s,s['paragraphs'][0],[]),'translations':{}}
analysis['counts']={'mappedPlaces':len(data['places']),'mappedReferences':sum(len(c['places']) for c in data['chapters']),'unlocatedReferences':sum(len(c['unlocatedPlaces']) for c in data['chapters'])}
# Expose category and attribution consistently, including unlocated narrative interiors.
scene_note=phrase('The quotation documents a narrated setting. Where the place is unnamed, its identification follows the chapter’s narrative continuity; no exact real-world address is claimed.','La citazione documenta un’ambientazione narrata. Per gli spazi non nominati, l’identificazione segue la continuità narrativa del capitolo; non è attribuito un indirizzo reale preciso.','La citation documente un cadre raconté. Pour les lieux sans nom, l’identification suit la continuité narrative du chapitre ; aucune adresse réelle précise n’est affirmée.','La cita documenta un escenario narrado. Para los lugares sin nombre, la identificación sigue la continuidad narrativa del capítulo; no se afirma una dirección real exacta.')
for c in data['chapters']:
    for u in c['unlocatedPlaces']:
        u['narrativeReason']=u['text']
        u['text']=(scene_note if u['category']=='action' else mention)+' '+uncertain
        for l in dictionary:dictionary[l][u['text']]=dictionary[l][scene_note if u['category']=='action' else mention]+' '+dictionary[l][uncertain]
(R/'analysis.json').write_text(json.dumps(analysis,ensure_ascii=False,indent=2),encoding='utf8')
(ROOT/'docs/data'/f'{ID}.js').write_text('window.atlasData='+json.dumps(data,ensure_ascii=False,indent=2)+';\n',encoding='utf8')
# The four-language editorial dictionary is extended by presentation.cjs with book-level copy.
(ROOT/'docs/data'/f'{ID}-i18n.js').write_text('window.atlasTranslations='+json.dumps(dictionary,ensure_ascii=False,indent=2)+';\n',encoding='utf8')
(R/'review.txt').write_text('\n'.join(f"{s['id']} {r['id']} {r['category']} :: {r['quote'][:700]}" for s in analysis['sections'] for r in s['references']),encoding='utf8')
print(json.dumps(analysis['counts']))
