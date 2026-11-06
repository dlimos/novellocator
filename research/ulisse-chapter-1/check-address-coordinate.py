"""Reproduce Lalouette's geographical reference from the municipal CSV.

Requires pyproj; the CSV is available at the position-source URL in
addresses-records.json. This transforms an area reference, not the lost plot.
"""
import csv
import json
from pathlib import Path

from pyproj import Transformer

folder = Path(__file__).resolve().parent
with (folder / 'dcc-rps.csv').open(encoding='cp1252', newline='') as stream:
    rows = list(csv.DictReader(stream))
row = next(r for r in rows if r['RPS_ID'] == '1331')
assert '66-72 Marlborough Street' in row['Address Full']
assert 'College of Catering' in row['DESCRIPTION']
easting, northing = float(row['IG_EASTING']), float(row['IG_NORTHING'])
assert (easting, northing) == (315949.03, 234923.958)
transformer = Transformer.from_crs('EPSG:29903', 'EPSG:4326', always_xy=True)
longitude, latitude = transformer.transform(easting, northing)
assert abs(latitude - 53.352058) < 0.000001
assert abs(longitude - (-6.259480)) < 0.000001
result = {'sourceRecord': row, 'sourceCrs': 'EPSG:29903',
          'targetCrs': 'EPSG:4326', 'latitude': latitude, 'longitude': longitude,
          'transformation': transformer.get_last_used_operation().description,
          'limitation': 'Area of later college complex, not a surveyed coordinate of the former no. 68 plot.'}
(folder / 'address-coordinate-check.json').write_text(json.dumps(result, indent=2), encoding='utf-8')
print(f'PASS: municipal RPS 1331 -> {latitude:.6f}, {longitude:.6f}')
