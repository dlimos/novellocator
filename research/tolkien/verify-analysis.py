"""Verify hand-written evidence against source pages; never infer place roles."""
import hashlib
import json
from pathlib import Path
import re
import unicodedata

ROOT=Path(__file__).resolve().parent
WORK=ROOT.parents[1]/'work/tolkien'
raw=(WORK/'lotr-harpercollins-2005-candidate.txt').read_text(encoding='utf-8')
chunks=re.split(r'\[PDF PAGE (\d+)\]',raw)
pages={int(chunks[i]):chunks[i+1].strip() for i in range(1,len(chunks),2)}
def norm(value):
    # Layout-only joining. Keep internal word hyphens and original ligatures.
    return re.sub(r'\s+',' ',value).strip()
manifest=json.loads((ROOT/'reading-manifest.json').read_text(encoding='utf-8'))
assert hashlib.sha256((WORK/'lotr-harpercollins-2005-candidate.pdf').read_bytes()).hexdigest()==manifest['sourcePdfSha256'],'Source PDF changed'
units={unit['id']:unit for unit in manifest['units']}
summaries=[]
errors=[]
enriched_outputs=[]
for file in sorted((ROOT/'private').glob('*.json')):
    section=json.loads(file.read_text(encoding='utf-8'))
    unit=units[section['sectionId']]
    unit_raw='\n\n'.join(f'[PDF PAGE {page}]\n{pages[page]}' for page in range(unit['pdfStart'],unit['pdfEnd']+1))
    assert hashlib.sha256(unit_raw.encode('utf-8')).hexdigest()==unit['sha256'],'Source reading unit changed: '+unit['id']
    assert set(section['introduction'])=={'it','en','fr','es'}
    references=[]
    seen=set()
    for place,category,page,quote,rationale in section['references']:
        assert category in ['action','mentioned']
        assert place not in seen,(file.name,place)
        seen.add(place)
        assert unit['pdfStart']<=page<=unit['pdfEnd'],(file.name,page)
        metadata=section.get('referenceMetadata',{}).get(place,{})
        visual=metadata.get('visualEvidence')
        verification='verified-against-local-pdf-text'
        visual_source={}
        if visual:
            image_path=(ROOT.parents[1]/visual['imagePath']).resolve()
            assert image_path.is_relative_to(WORK.resolve()),'Rendered image must stay inside the local corpus'
            assert visual['pdfPage']==page and visual['sourcePdfSha256']==manifest['sourcePdfSha256'],'Visual evidence source mismatch'
            assert visual['reviewStatus']=='manually-compared-with-rendered-page' and visual.get('reviewDate') and visual.get('reviewNote'),'Manual page review must be recorded'
            if not image_path.is_file() or hashlib.sha256(image_path.read_bytes()).hexdigest()!=visual['imageSha256']:
                raise ValueError('Rendered source image failed integrity check: '+place)
            # Integrity is automated; authenticity of this transcription was checked visually.
            # Do not claim an extracted-text match or infer a human review from this hash.
            verification='manual-visual-transcription-with-image-integrity-checked'
            visual_source={'sourceImageSha256':visual['imageSha256'],'sourceImagePath':visual['imagePath']}
        elif norm(quote) not in norm(pages[page]):
            errors.append([file.name,place,page,quote])
            continue
        for term in metadata.get('highlightTerms',[]):
            assert norm(term) in norm(quote),('Highlight absent from authentic quotation',place,term)
        references.append({'placeId':place,'category':category,'rationaleIt':rationale,
            'narrativeLevel':metadata.get('narrativeLevel','embedded-retelling' if section['sectionId']=='prologue' and category=='action' else 'primary' if category=='action' else 'reference'),
            'evidence':{'quote':norm(quote),'language':'en','type':'original','pdfPage':page,
                'sourcePageSha256':hashlib.sha256(pages[page].encode('utf-8')).hexdigest(),
                'printedPage':page-24,
                'sourceUrl':'https://go2train.co/wp-content/uploads/2025/11/The-Lord-of-the-Rings-by-J.R.R.-Tolkien.pdf',
                'edition':manifest['sourceEdition'],'verificationStatus':verification,**visual_source,
                'publicationStatus':section['quotationPublicationStatus']},
            'highlightVerification':'pending','geographicalVerification':'pending','mapPosition':None,**metadata})
    enriched={**section,'references':references}
    enriched_outputs.append((file.name,enriched))
    summaries.append({'sectionId':section['sectionId'],'completeRead':section['completeRead'],
        'references':len(references),'action':sum(ref['category']=='action' for ref in references),
        'mentioned':sum(ref['category']=='mentioned' for ref in references),
        'inventoryStatus':'first-manual-pass-reconciliation-pending','quotationRightsStatus':'pending',
        'introductionsAvailable':['it','en','fr','es']})
if errors:
    raise ValueError('Evidence not found verbatim after whitespace normalization: '+json.dumps(errors,ensure_ascii=False))
# Do not replace any verified analysis output until every source check passes.
(WORK/'analysis').mkdir(exist_ok=True)
for name,enriched in enriched_outputs:
    (WORK/'analysis'/name).write_text(json.dumps(enriched,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
review_dates={json.loads(file.read_text(encoding='utf-8'))['sectionId']:json.loads(file.read_text(encoding='utf-8'))['date'] for file in (ROOT/'private').glob('*.json')}
for summary in summaries:
    unit=units[summary['sectionId']]
    unit.update(readStatus='complete' if summary['completeRead'] else 'pending',inventoryStatus='first-manual-pass-reconciliation-pending',reviewDate=review_dates[summary['sectionId']],reviewNote='Individual evidence checked against local source; reading status is a manual declaration, not inferred from matching quotes. Rights and geographical verification pending.')
(ROOT/'reading-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(ROOT/'analysis-progress.json').write_text(json.dumps({'date':max(review_dates.values()),'status':'in-progress',
    'fullNovelAnalysisComplete':False,'sections':summaries,'errors':[]},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(summaries))
