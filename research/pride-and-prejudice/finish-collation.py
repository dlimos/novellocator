"""Produce inspectable, literal excerpts from the identified 1923 print witness.
All lexical variants are printed for editorial review; nothing is published here.
"""
import collections,difflib,json,pathlib,re
R=pathlib.Path(__file__).resolve().parent
A=json.loads((R/'analysis.json').read_text(encoding='utf8'));S=json.loads((R/'corpus/chapman-sections.json').read_text(encoding='utf8'))
def norm(s):return re.sub('[^a-z0-9]','',s.lower())
def words(s):
 matches=list(re.finditer(r'\S+',s));return [norm(m[0]) for m in matches],matches
def sentences(s):
 ends=[0]
 for m in re.finditer(r'[.!?][\"\x27]?(?=\s|$)',s):
  prefix=s[:m.start()];last=re.search(r'[A-Za-z]+$',prefix)
  if m[0].startswith('.') and last and last[0] in ['Mr','Mrs','Dr','St','Esq','Col','Messrs']:continue
  ends.append(m.end())
 if ends[-1]!=len(s):ends.append(len(s))
 return ends
rows=[];variants=collections.Counter();errors=[]
for section in A['sections']:
 ch=section['id'];pp=S[ch-1]['paragraphs'];full='\n'.join(pp);nw,mw=words(full);fn=norm(full)
 for ref in section['references']:
  old=ref['evidence']['quote'];ow,_=words(old)
  # Longest sequence identifies the passage; match again within its neighbourhood.
  matcher=difflib.SequenceMatcher(None,ow,nw,autojunk=False);longest=matcher.find_longest_match()
  lo=max(0,longest.b-longest.a-25);hi=min(len(nw),longest.b+longest.size+len(ow)-longest.a-longest.size+25)
  local=nw[lo:hi];sm=difflib.SequenceMatcher(None,ow,local,autojunk=False);blocks=[b for b in sm.get_matching_blocks() if b.size]
  first,last=blocks[0],blocks[-1];a=max(lo,lo+first.b-first.a);b=min(hi,lo+last.b+last.size+len(ow)-last.a-last.size)
  start=mw[a].start();end=mw[b-1].end();cuts=sentences(full)
  # Complete the fragment to source sentence boundaries, preserving all source text.
  start=max(x for x in cuts if x<=start);end=next((x for x in cuts if x>=end),len(full))
  quote=full[start:end].strip();paragraph=full[:start].count('\n')+1
  # Strip boundary whitespace only; paragraph reference follows first non-whitespace.
  start=full.find(quote,start);paragraph=full[:start].count('\n')+1
  terms=ref['evidence']['highlightTerms'];actual=[]
  for t in terms:
   if t.lower() in quote.lower():actual.append(t)
   else:
    aliases={'Pulvis Lodge':'Purvis Lodge','Haye Park':'Haye-Park','show':'shew','Mrs. Phillips':'Mrs. Philips','Mrs. Phillips\'s':'Mrs. Philips\'s'}
    if t in aliases and aliases[t].lower() in quote.lower():actual.append(aliases[t])
    else:errors.append((ch,ref['placeId'],t,quote[:140]))
  matched=sum(b.size for b in blocks)/len(ow)
  for tag,i,j,k,l in sm.get_opcodes():
   if tag!='equal' and i<len(ow) and j>0:
    left=' '.join(ow[i:j]);right=' '.join(local[k:l]);
    if i==0 or j==len(ow):continue
    variants[(left,right)]+=1
  rows.append(dict(chapter=ch,placeId=ref['placeId'],quote=quote,sourceParagraph=paragraph,highlightTerms=actual,readQuote=old,matchedWordRatio=round(matched,3),status='editorial-review-required'))
(R/'print-quotations.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('Rows:',len(rows),'highlight errors:',errors)
print('Low word match:',[(r['chapter'],r['placeId'],r['matchedWordRatio']) for r in rows if r['matchedWordRatio']<.85])
print('Unique lexical variants:')
for (old,new),count in sorted(variants.items()):
 if len(old)+len(new)<220:print(count,repr(old),'->',repr(new))
 else:print(count,'LONG VARIANT',len(old),len(new),repr(old[:75]),repr(new[:75]))
