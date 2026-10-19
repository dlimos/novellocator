import concurrent.futures,json,pathlib,urllib.parse,urllib.request
R=pathlib.Path(__file__).resolve().parent
queries={
'london':'London, England','gracechurch-street':'Gracechurch Street, London','grosvenor-street':'Grosvenor Street, Mayfair, London','cheapside':'Cheapside, City of London','st-jamess':"St James Palace, London",
'brighton':'Brighton, England','ramsgate':'Ramsgate, England','gretna-green':'Gretna Green, Scotland','bromley':'Bromley, London','westerham':'Westerham, Kent',
'matlock':'Matlock, Derbyshire','chatsworth':'Chatsworth House, Derbyshire','dovedale':'Dovedale, Derbyshire','oxford':'Oxford, England','blenheim':'Blenheim Palace, Woodstock','warwick':'Warwick, England','kenilworth':'Kenilworth, England','birmingham':'Birmingham, England','bakewell':'Bakewell, Derbyshire','cambridge':'Cambridge, England','york':'York, England','liverpool':'Liverpool, England','clapham':'Clapham, London','epsom':'Epsom, Surrey','barnet':'Barnet, London','hatfield':'Hatfield, Hertfordshire','newcastle':'Newcastle upon Tyne, England','eastbourne':'Eastbourne, England','scarborough':'Scarborough, England','bath':'Bath, England'}
def fetch(item):
 pid,q=item;url='https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?'+urllib.parse.urlencode(dict(SingleLine=q,f='json',outFields='*',maxLocations=3))
 with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'NovelLocator/1.0'}),timeout=30) as f:data=json.load(f)
 return pid,dict(query=q,url=url,**data)
out={}
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as ex:
 for pid,data in ex.map(fetch,queries.items()):
  out[pid]=data;print(pid,[(c['address'],c['score'],c['location']) for c in data.get('candidates',[])])
(R/'corpus/coordinates.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf8')
