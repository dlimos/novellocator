"""Measure the unpublished excerpt set; counts never imply legal clearance."""
import hashlib
import json
from pathlib import Path
import re

ROOT=Path(__file__).resolve().parent
records=[]
for file in sorted((ROOT/'private').glob('*.json')):
    section=json.loads(file.read_text(encoding='utf-8'))
    for place,category,page,quote,rationale in section['references']:
        quote=re.sub(r'\s+',' ',quote).strip()
        records.append({'sectionId':section['sectionId'],'placeId':place,'pdfPage':page,
            'words':len(quote.split()),'textSha256':hashlib.sha256(quote.encode('utf-8')).hexdigest(),
            'criticalPurpose':'Discuss the narrative role and spatial identification of this occurrence.',
            'necessityReview':'pending','proportionalityReview':'pending','publicationStatus':'analysis-only'})
unique={record['textSha256']:record for record in records}
result={'date':max(json.loads(file.read_text(encoding='utf-8'))['date'] for file in (ROOT/'private').glob('*.json')),
    'edition':'HarperCollins 2005; Adobe Acrobat eBook May 2009; ISBN 9780061917806',
    'language':'en','associations':len(records),'uniqueExtracts':len(unique),
    'wordsCountingRepeatedExtracts':sum(record['words'] for record in records),
    'wordsDeduplicated':sum(record['words'] for record in unique.values()),
    'maxSingleExtractWords':max(record['words'] for record in records),
    'status':'No excerpts cleared for publication. Counts are for editorial review; no numerical threshold is treated as a legal safe harbour.',
    'records':records}
(ROOT/'quotation-budget.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print({key:value for key,value in result.items() if key!='records'})
