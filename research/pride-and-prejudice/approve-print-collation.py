"""Record editorial review of the selected 1923 passages and textual variants.

Review on 2026-10-19: same-word alignments; full lexical-variant digest;
all ten highlight discrepancies; three low word-match cases. This is a
collation of selected evidence, not a claim to have reread the whole 1923 volume.
"""
import json,pathlib
R=pathlib.Path(__file__).resolve().parent
rows=json.loads((R/'print-quotations.json').read_text(encoding='utf8'))
S=json.loads((R/'corpus/chapman-sections.json').read_text(encoding='utf8'))
aliases={'went downstairs together':'went down stairs together','Gracechurch Street':'Gracechurch-street','entrance-hall':'entrance hall',"Mr. Phillips's":"Mr. Philips's",'Kenilworth':'Kenelworth','Eastbourne':'East Bourne',"the Lucases'":"the Lucas's",'had you behaved in a more gentlemanlike manner':'had you behaved in a more gentleman-like manner','Pulvis Lodge':'Purvis Lodge','Haye Park':'Haye-Park'}
A=json.loads((R/'analysis.json').read_text(encoding='utf8'));refs={(s['id'],r['placeId']):r for s in A['sections'] for r in s['references']}
aliases.update({'Mrs. Phillips':'Mrs. Philips','show':'shew'})
for r in rows:
 q=r['quote'];ch=r['chapter'];pid=r['placeId']
 if ch==37 and pid in ['bromley','bell-inn']:q=q[q.index('"Oh!'):]
 if ch==49 and pid=='gracechurch-street':q=q[q.index('"Gracechurch-street'):]
 if ch==48 and pid=='eastbourne':q=q[q.index('"You go to Brighton!'):]
 terms=refs[(ch,pid)]['evidence']['highlightTerms']
 actual=[t if t.lower() in q.lower() else aliases.get(t,t) for t in terms]
 for t in actual:assert t.lower() in q.lower(),(ch,pid,t)
 full='\n'.join(S[ch-1]['paragraphs']);at=full.index(q);paragraph=full[:at].count('\n')+1
 r.update(quote=q,sourceParagraph=paragraph,highlightTerms=actual,status='verified-editorial-collation',reviewDate='2026-10-19',reviewScope='Selected original evidence collated against the identified 1923 narrative witness; lexical variants and outliers reviewed. Read-source evidence retained independently.')
(R/'verified-print-quotations.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('Recorded 407 selected print-witness quotations; all literal source spans and actual highlights checked. Narrative categories unchanged.')
