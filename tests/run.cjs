const { spawnSync } = require('node:child_process');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
for (const name of ['episodes', 'locales', 'generic-atlas', 'proust', 'war-and-peace', 'moby-dick', 'excerpts', 'street-view', 'osm']) {
  const result = spawnSync(process.execPath, [path.join(__dirname, 'check-' + name + '.cjs')], { cwd: root, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}
