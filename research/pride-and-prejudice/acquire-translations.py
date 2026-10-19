import concurrent.futures,hashlib,html,json,pathlib,re,urllib.request,urllib.parse
R=pathlib.Path(__file__).resolve().parent/'corpus'
urls={'fr-full.html':'https://fr.wikisource.org/wiki/Orgueil_et_Pr%C3%A9vention/Texte_entier'}
index=(R/'es-index.html').read_text(encoding='utf-8')
links=list(dict.fromkeys(html.unescape(a) for a in re.findall(r'href="([^"]+)"',index)
    if re.search(r'Orgullo_y_prejuicio/Cap(?:%C3%AD|í)tulo_[IVXL]+$',a)))
assert len(links)==61,len(links)
for i,url in enumerate(links):
    url=urllib.parse.urljoin('https://es.wikisource.org',url)
    urls[f'es-{i+1:02}.html']=urllib.parse.quote(url,safe=':/%')
def fetch(item):
    name,url=item;f=R/name
    try:
        if not f.exists():
            req=urllib.request.Request(url,headers={'User-Agent':'NovelLocatorResearch/1.0 (public literary source verification)'})
            f.write_bytes(urllib.request.urlopen(req,timeout=25).read())
        data=f.read_bytes()
        return dict(file=name,url=url,bytes=len(data),sha256=hashlib.sha256(data).hexdigest(),status='acquired')
    except Exception as e:return dict(file=name,url=url,status='failed',error=str(e))
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as ex:result=list(ex.map(fetch,urls.items()))
(R/'translation-acquisition.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print('Acquired',sum(r['status']=='acquired' for r in result),'of',len(result))
for r in result:
    if r['status']=='failed':print(r)
