import html,json,pathlib,re
R=pathlib.Path(__file__).resolve().parent/'corpus'
def text(s):
    s=re.sub(r'<(script|style)\b[^>]*>.*?</\1>','',s,flags=re.S|re.I)
    return re.sub(r'\s+',' ',html.unescape(re.sub('<[^>]+>',' ',s))).strip()
for f in ['it-castellini.html','it-rosi.html']:
    s=text((R/f).read_text(encoding='utf-8'))
    at=s.index('Da Wikisource.')
    print(f,s[at:at+1000])
for f in ['ierolli-index.html','ierolli-home.html']:
    raw=(R/f).read_text(encoding='latin1');s=text(raw)
    print(f,'RIGHTS',[s[max(0,m.start()-80):m.end()+160] for m in re.finditer('diritti|copyright|Creative|riprodu|licenz',s,re.I)])
    print('FINAL LINKS',re.findall(r'href=["\x27]([^"\x27]+)',raw)[-15:])
for f in ['fr-1822-index.html','es-index.html']:
    raw=(R/f).read_text(encoding='utf-8')
    print(f,'LINKS',[(html.unescape(a),text(b)) for a,b in re.findall(r'<a[^>]*href="([^"]+)"[^>]*>(.*?)</a>',raw,re.S) if re.search(r'Pr%C3%A9vention/|prejuicio/|Chapitre|Capítulo',a+b)][-70:])
