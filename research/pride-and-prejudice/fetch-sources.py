"""Acquire public bibliographical witnesses; preserve successes and failures."""
import concurrent.futures,json,pathlib,urllib.request,urllib.parse
R=pathlib.Path(__file__).resolve().parent/'corpus'
urls={
 'chapman-metadata.json':'https://archive.org/metadata/novelstextbasedo02austuoft',
 'it-castellini.html':'https://it.wikisource.org/wiki/Autore:Itala_Castellini',
 'it-rosi.html':'https://it.wikisource.org/wiki/Autore:Natalia_Rosi',
 'fr-1822-index.html':'https://fr.wikisource.org/wiki/Orgueil_et_Pr%C3%A9vention',
 'es-index.html':'https://es.wikisource.org/wiki/Orgullo_y_prejuicio',
 'ierolli-index.html':'https://www.jausten.it/jarcpap.html',
 'ierolli-home.html':'https://www.jausten.it/',
}
def fetch(item):
    name,url=item
    try:
        data=urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'NovelLocatorResearch/1.0'}),timeout=20).read()
        (R/name).write_bytes(data)
        return dict(file=name,url=url,bytes=len(data),status='acquired')
    except Exception as e:return dict(file=name,url=url,status='failed',error=str(e))
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as ex:
    result=list(ex.map(fetch,urls.items()))
(R/'acquisition-log.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(result,ensure_ascii=False,indent=2))
