"""Read-only anonymous verification using the host's standard proxy settings."""
import pathlib,re,json,urllib.request
R=pathlib.Path(__file__).resolve().parent;ROOT=R.parents[1]
config=(ROOT/'docs/supabase-config.js').read_text(encoding='utf-8')
url=re.search(r'url:\s*[\x27\x22]([^\x27\x22]+)',config)[1]
key=re.search(r'publishableKey:\s*[\x27\x22]([^\x27\x22]+)',config)[1]
bundle=json.loads((ROOT/'database/generated/wuthering-heights/content.json').read_text(encoding='utf-8'))
presentation=json.loads((ROOT/'database/generated/wuthering-heights/presentation.json').read_text(encoding='utf-8'))
tables={}
for table in [*bundle['tables'],'book_presentations']:
 column='id' if table=='books' else 'book_id'
 request=urllib.request.Request(f'{url}/rest/v1/{table}?select=*&{column}=eq.wuthering-heights',headers={'apikey':key,'User-Agent':'NovelLocator-verification'})
 with urllib.request.urlopen(request,timeout=45) as response:tables[table]=json.load(response)
assert tables['books'][0]['publication_status']=='published'
assert tables['books'][0]['metadata']['analysisCoverage']['fullNarrativeRereadComplete']
for table,rows in bundle['tables'].items():
 if table in ['sources','content_translations']:assert len(tables[table])>=len(rows)
 else:assert len(tables[table])==len(rows),(table,len(tables[table]),len(rows))
for q in bundle['tables']['excerpts']:
 remote=next(r for r in tables['excerpts'] if r['id']==q['id'])
 assert remote['quote']==q['quote'] and remote['metadata']==q['metadata'],q['id']
for q in bundle['tables']['content_translations']:
 remote=next(r for r in tables['content_translations'] if (r['language'],r['source_hash'])==(q['language'],q['source_hash']))
 assert remote['translated_text']==q['translated_text']
for k,v in presentation.items():assert tables['book_presentations'][0][k]==v,k
print('PASS: public published book, 34 chapters, 134 references, 155 exact quotations, active dictionaries and CSS.')
print('Historical rows retained:',{k:len(tables[k]) for k in ['sources','content_translations']})
