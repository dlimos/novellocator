"""Regression: rejected evidence must leave verified local outputs unchanged.

Requires the ignored local source corpus and manual evidence records.
No source quotations are bundled or printed by this test.
"""
import hashlib
import json
from pathlib import Path
import subprocess
import sys
import tempfile

ROOT = Path(__file__).resolve().parent
WORK = ROOT.parents[1] / 'work/tolkien'
inputs = sorted((ROOT / 'private').glob('*.json'))
if not inputs:
    raise SystemExit('Local manual evidence records are required; nothing tested.')

def snapshot():
    files = [ROOT / 'reading-manifest.json', ROOT / 'analysis-progress.json']
    files += sorted((WORK / 'analysis').glob('*.json'))
    return {str(path): hashlib.sha256(path.read_bytes()).hexdigest() for path in files}

def check_rejection(rejected, expected_error):
    before = snapshot()
    with tempfile.NamedTemporaryFile(mode='w', encoding='utf-8', suffix='.json',
                                 prefix='zz-negative-', dir=ROOT / 'private',
                                 delete=False) as handle:
        temporary_path = Path(handle.name)
        json.dump(rejected, handle, ensure_ascii=False)
    try:
        result = subprocess.run([sys.executable, '-X', 'utf8', str(ROOT / 'verify-analysis.py')],
                            capture_output=True, text=True, encoding='utf-8')
        assert result.returncode != 0, 'Invalid source evidence was accepted'
        assert expected_error in result.stderr, 'Unexpected validation failure'
        assert snapshot() == before, 'Rejected evidence replaced verified analysis outputs'
    finally:
        temporary_path.unlink(missing_ok=True)

rejected = json.loads(inputs[0].read_text(encoding='utf-8'))
rejected['references'][0][3] = 'UNMATCHED_TOLKIEN_VALIDATION_SENTINEL_20261028'
check_rejection(rejected, 'Evidence not found verbatim')
cases = 1
for file in inputs:
    section = json.loads(file.read_text(encoding='utf-8'))
    visual_records = [value['visualEvidence'] for value in section.get('referenceMetadata', {}).values() if 'visualEvidence' in value]
    if visual_records:
        visual_records[0]['imageSha256'] = '0' * 64
        check_rejection(section, 'Rendered source image failed integrity check')
        cases += 1
        break
print(f'PASS: {cases} negative checks; verified local outputs and progress unchanged.')
