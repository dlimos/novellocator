"""Structural extraction only: individual translated excerpts require manual alignment."""
import hashlib,html,json,pathlib,re
R=pathlib.Path(__file__).resolve().parent/'corpus'
def clean(s):
    s=re.sub(r'<span\b[^>]*class="[^"]*(?:pagenum|ws-pagenum)[^"]*"[^>]*>.*?</span>','',s,flags=re.S)
    return re.sub(r'\s+',' ',html.unescape(re.sub('<[^>]+>','',s))).strip()
def paragraphs(s):return [p for p in (clean(p) for p in re.findall(r'<p\b[^>]*>(.*?)</p>',s,re.S)) if p]
raw=(R/'fr-full.html').read_text(encoding='utf-8')
heads=list(re.finditer(r'<h3\b[^>]*id="CHAPITRE_[^"]*"[^>]*>.*?</h3>',raw,re.S))
assert len(heads)==61,len(heads)
fr=[]
for i,h in enumerate(heads):
    body=raw[h.end():heads[i+1].start() if i+1<len(heads) else raw.find('<!-- NewPP',h.end())]
    pp=paragraphs(body)
    # Narrative paragraphs follow the chapter heading. Keep the raw HTML for
    # page numbers and the transcluded scan references.
    fr.append(dict(id=i+1,heading=clean(h[0]),paragraphs=pp,
        sha256=hashlib.sha256(body.encode()).hexdigest()))
es=[]
for i in range(1,62):
    body=(R/f'es-{i:02}.html').read_text(encoding='utf-8')
    heads=list(re.finditer(r'<h[23]\b[^>]*>.*?CAP[IÍ]TULO.*?</h[23]>',body,re.S|re.I))
    assert heads,(i,'missing Spanish chapter heading')
    body=body[heads[-1].end():]
    body=body.split('<!-- NewPP')[0].split('<div class="printfooter"')[0]
    pp=paragraphs(body)
    es.append(dict(id=i,paragraphs=pp,sha256=hashlib.sha256(body.encode()).hexdigest()))
for lang,ss in [('fr',fr),('es',es)]:
    assert all(len(s['paragraphs'])>3 for s in ss)
    (R/f'{lang}-sections.json').write_text(json.dumps(ss,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(lang,'chapters',len(ss),'words',sum(len(p.split()) for s in ss for p in s['paragraphs']))
    for n in [1,43,61]:
        print(n,ss[n-1]['paragraphs'][0][:180],'/ END /',ss[n-1]['paragraphs'][-1][-180:])
