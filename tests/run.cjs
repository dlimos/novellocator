const { spawnSync } = require('node:child_process');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const selectedQuotesCheck = spawnSync(process.execPath, [path.join(__dirname, 'check-selected-quotes.cjs')], { cwd: root, stdio: 'inherit' });
if (selectedQuotesCheck.status !== 0) process.exit(selectedQuotesCheck.status || 1);
const crimeCheck = spawnSync(process.execPath, [path.join(__dirname, 'check-crime-and-punishment.cjs')], { cwd: root, stdio: 'inherit' });
if (crimeCheck.status !== 0) process.exit(crimeCheck.status || 1);
for (const name of ['episodes', 'locales', 'generic-atlas', 'proust', 'war-and-peace', 'moby-dick', 'gatsby', 'holden', 'orwell1984', 'don-quijote', 'excerpts', 'quote-highlights', 'quotation-language-picker', 'global-view', 'street-view', 'osm', 'layers', 'fullscreen', 'supabase', 'csv-export', 'fictional-map', 'illustrated-atlas', 'illustrated-controller', 'editorial-boundary', 'theme-loading', 'geographic-review']) {
  const result = spawnSync(process.execPath, [path.join(__dirname, 'check-' + name + '.cjs')], { cwd: root, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}
const geographySql = spawnSync(process.execPath, [path.join(__dirname, 'check-geographic-review-sql.cjs')], { cwd: root, stdio: 'inherit' });
if (geographySql.status !== 0) process.exit(geographySql.status || 1);
