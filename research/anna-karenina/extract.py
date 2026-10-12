import xml.etree.ElementTree as ET
import pathlib, re, json, hashlib, collections
R=pathlib.Path(__file__).resolve().parent
sections=[]
parts={'ПЕРВАЯ':1,'ВТОРАЯ':2,'ТРЕТЬЯ':3,'ЧЕТВЕРТАЯ':4,'ПЯТАЯ':5,'ШЕСТАЯ':6,'СЕДЬМАЯ':7,'ВОСЬМАЯ':8}
for volume in (18,19):
    root=ET.parse(R/f'volume-{volume}.html').getroot()
    part=None; current=None
    for el in root.iter():
        tag=el.tag.split('}')[-1]
        if tag=='h1':
            current=None;part=None
        elif tag=='h2':
            title=''.join(el.itertext()).strip().translate(str.maketrans({'Х':'X','І':'I','Ѵ':'V'}))
            part=next((v for k,v in parts.items() if title.startswith('ЧАСТЬ '+k)),None)
            current=None
        elif tag=='h3' and part:
            title=''.join(el.itertext()).strip().translate(str.maketrans({'Х':'X','І':'I','Ѵ':'V'}))
            if not re.fullmatch('[IVXL]+[.]?',title):
                current=None; continue
            current={'id':len(sections)+1,'part':part,'chapter':title.rstrip('.'),'volume':volume,'paragraphs':[]}
            sections.append(current)
        elif tag=='p' and current:
            # Page markers and footnote anchors are edition apparatus, not narrative words.
            def text(e):
                out=e.text or ''
                for child in e:
                    if child.tag.split('}')[-1] not in ('sup',) and child.attrib.get('class') not in ('npnumber','opnumber') and not (child.tag.split('}')[-1]=='a' and ('note' in child.attrib.get('class','') or re.fullmatch(r'\[?\d+\]?', ''.join(child.itertext()).strip()))):
                        out+=text(child)
                    out+=child.tail or ''
                return out
            t=re.sub(r'\s+',' ',text(el)).strip()
            if t:current['paragraphs'].append(t)
for s in sections:
    s['text']='\n'.join(s['paragraphs'])
    s['sha256']=hashlib.sha256(s['text'].encode()).hexdigest()
    s['url']=f"https://tolstoy.ru/online/90/{s['volume']}/"
counts=collections.Counter(s['part'] for s in sections)
assert dict(counts)=={1:34,2:35,3:32,4:23,5:33,6:32,7:31,8:19},counts
(R/'sections.json').write_text(json.dumps(sections,ensure_ascii=False,indent=2),encoding='utf8')
words=collections.Counter(w for s in sections for w in re.findall(r'\b[А-ЯЁ][а-яё-]{3,}',s['text']))
(R/'capitalized.txt').write_text('\n'.join(f'{w} {n}' for w,n in words.most_common()),encoding='utf8')
print(counts, sum(len(s['text']) for s in sections),len(sections))
