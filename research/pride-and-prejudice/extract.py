"""Preserve the acquired transcription and stable paragraph positions."""
import hashlib, json, pathlib, re
R = pathlib.Path(__file__).resolve().parent
raw = (R / 'corpus/original.txt').read_text(encoding='utf-8-sig')
heads = list(re.finditer(r'^Chapter (\d+)\s*$', raw, re.M))
assert [int(h[1]) for h in heads] == list(range(1, 62))
end = raw.index('*** END OF THIS PROJECT GUTENBERG', heads[-1].end())
sections = []
for i, h in enumerate(heads):
    text = raw[h.end():heads[i+1].start() if i+1 < len(heads) else end].strip()
    text = re.split(r'^End of the Project Gutenberg EBook', text, flags=re.M)[0].rstrip()
    paragraphs = [re.sub(r'\s+', ' ', p).strip() for p in re.split(r'\n\s*\n', text) if p.strip()]
    sections.append(dict(id=i+1, volume=1 if i<23 else 2 if i<42 else 3,
        volumeChapter=i+1 if i<23 else i-22 if i<42 else i-41,
        paragraphs=paragraphs, text='\n\n'.join(paragraphs),
        sha256=hashlib.sha256(text.encode()).hexdigest()))
(R / 'sections.json').write_text(json.dumps(sections, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(dict(chapters=len(sections), words=sum(len(s['text'].split()) for s in sections),
    originalSha256=hashlib.sha256((R/'corpus/original.txt').read_bytes()).hexdigest(),
    edition='Project Gutenberg 1342, anonymous volunteers, updated 2015-02-15; underlying print edition unspecified'), indent=2))
