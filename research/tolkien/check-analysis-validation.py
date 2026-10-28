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

before = snapshot()
rejected = json.loads(inputs[0].read_text(encoding='utf-8'))
rejected['references'][0][3] = 'UNMATCHED_TOLKIEN_VALIDATION_SENTINEL_20261028'
with tempfile.NamedTemporaryFile(mode='w', encoding='utf-8', suffix='.json',
                                 prefix='zz-negative-', dir=ROOT / 'private',
                                 delete=False) as handle:
    temporary_path = Path(handle.name)
    json.dump(rejected, handle, ensure_ascii=False)
try:
    result = subprocess.run([sys.executable, '-X', 'utf8', str(ROOT / 'verify-analysis.py')],
                            capture_output=True, text=True, encoding='utf-8')
    assert result.returncode != 0, 'Invalid source evidence was accepted'
    assert 'Evidence not found verbatim' in result.stderr, 'Unexpected validation failure'
    assert snapshot() == before, 'Rejected evidence replaced verified analysis outputs'
finally:
    temporary_path.unlink(missing_ok=True)
print('PASS: invalid evidence rejected; all verified local outputs and progress unchanged.')
