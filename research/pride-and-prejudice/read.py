"""Print complete chapters for narrative review; no lexical filtering."""
import json, pathlib, sys
S=json.loads(pathlib.Path(__file__).with_name('sections.json').read_text(encoding='utf-8'))
for s in S[int(sys.argv[1])-1:int(sys.argv[2])]:
    print('\nCHAPTER',s['id'],'VOLUME',s['volume'],'CHAPTER',s['volumeChapter'])
    for i,p in enumerate(s['paragraphs']):print(f'[{i}] {p}')
