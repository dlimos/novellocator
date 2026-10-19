"""Preserve the complete original, chapter divisions and paragraph positions."""
import pathlib, re, json, hashlib, sys
R=pathlib.Path(__file__).resolve().parent
text=(R/'corpus/original.txt').read_text(encoding='utf-8-sig')
heads=list(re.finditer(r'^CHAPTER ([IVX]+)\s*$',text,re.M))
assert len(heads)==34
end=text.index('***END OF THE PROJECT GUTENBERG',heads[-1].end())
sections=[]
for i,h in enumerate(heads):
    raw=text[h.end():heads[i+1].start() if i+1<len(heads) else end].strip()
    paragraphs=[re.sub(r'\s+',' ',p).strip() for p in re.split(r'\n\s*\n',raw) if p.strip()]
    sections.append(dict(id=i+1,roman=h[1],text='\n\n'.join(paragraphs),paragraphs=paragraphs,sha256=hashlib.sha256(raw.encode()).hexdigest()))
(R/'sections.json').write_text(json.dumps(sections,ensure_ascii=False,indent=2),encoding='utf-8')
print([(s['id'],len(s['paragraphs']),len(s['text'])) for s in sections])
