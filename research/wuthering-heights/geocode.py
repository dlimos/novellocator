import urllib.request,urllib.parse,json,pathlib,time
R=pathlib.Path(__file__).resolve().parent
queries=['Top Withens, Haworth, England','Ponden Hall, Haworth, England','Ponden Kirk, Haworth, England','Haworth, England','Liverpool, England','London, England','England','China','India','Spain']
out={}
for q in queries:
 u='https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?'+urllib.parse.urlencode(dict(SingleLine=q,f='json',outFields='*',maxLocations=3))
 data=json.load(urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'NovelLocator/1.0'}),timeout=20))
 out[q]={'url':u,**data}
 print(q,[(c['address'],c['score'],c['location']) for c in data['candidates']])
(R/'corpus/coordinates.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf8')
