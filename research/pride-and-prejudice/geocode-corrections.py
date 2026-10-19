import json,pathlib,urllib.parse,urllib.request
R=pathlib.Path(__file__).resolve().parent;file=R/'corpus/coordinates.json';out=json.loads(file.read_text(encoding='utf8'))
for pid,q in {'bromley':'Bromley, Kent, England','dovedale':'Dovedale Stepping Stones, Thorpe, England','clapham':'Clapham Common, London','barnet':'High Barnet, England','bell-inn':'Royal Bell, High Street, Bromley','little-theatre':'Kings Head, Haymarket, London'}.items():
 u='https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?'+urllib.parse.urlencode(dict(SingleLine=q,f='json',outFields='*',maxLocations=3))
 data=json.load(urllib.request.urlopen(u,timeout=30));out[pid]={'query':q,'url':u,**data};print(pid,[(c['address'],c['score'],c['location']) for c in data.get('candidates',[])])
file.write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf8')
