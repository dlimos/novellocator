"""Locate the selected evidence in the identified print witness, retaining variants.
No fuzzy match is silently accepted: unresolved matches are reported for review.
"""
import json,pathlib,re,difflib,unicodedata
R=pathlib.Path(__file__).resolve().parent
A=json.loads((R/'analysis.json').read_text(encoding='utf8'))
S=json.loads((R/'corpus/chapman-sections.json').read_text(encoding='utf8'))
def indexed(s):
    letters=[];positions=[]
    for i,c in enumerate(s):
        for x in unicodedata.normalize('NFKD',c.lower()):
            if x.isascii() and x.isalnum():letters.append(x);positions.append(i)
    return ''.join(letters),positions
rows=[]
for section in A['sections']:
    ch=section['id'];pp=S[ch-1]['paragraphs'];full='\n'.join(pp);norm,ix=indexed(full)
    for ref in section['references']:
        q=ref['evidence']['quote'];nq,_=indexed(q);a=norm.find(nq)
        row={'chapter':ch,'placeId':ref['placeId'],'readQuote':q,'highlightTerms':ref['evidence']['highlightTerms']}
        if a>=0:
            start=ix[a];end=ix[a+len(nq)-1]+1
            while start>0 and full[start-1] in '\"“‘':start-=1
            while end<len(full) and full[end] in '.!?;:,\"”’':end+=1
            row.update(quote=full[start:end],sourceParagraph=full[:start].count('\n')+1,match='same-words-typographical-variants')
        else:
            # Candidate remains explicitly pending until the actual variant is inspected.
            m=difflib.SequenceMatcher(None,nq,norm,autojunk=False).find_longest_match()
            start=max(0,m.b-m.a);end=min(len(norm),start+len(nq))
            row.update(candidate=full[ix[start]:ix[end-1]+1],match='pending',ratio=round(m.size/len(nq),3))
        rows.append(row)
(R/'quotation-edition.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('Literal normalized matches',sum(r['match']!='pending' for r in rows),'/',len(rows))
for r in rows:
    if r['match']=='pending':print(r['chapter'],r['placeId'],'READ:',r['readQuote'],'PRINT:',r['candidate'])
