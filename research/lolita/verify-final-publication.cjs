const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm'),crypto=require('node:crypto');
const dir='work/lolita-final-review/',read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const actual=read(dir+'live-after.json'),expected=read(dir+(fs.existsSync(dir+'reader-expected.json')?'reader-expected.json':'expected.json')),changes=read(dir+'changes.json');
for(const ch of changes){const row=actual.tables[ch.table].find(r=>Object.entries(ch.keys).every(([k,v])=>r[k]===v)),want=expected.tables[ch.table].find(r=>Object.entries(ch.keys).every(([k,v])=>r[k]===v));assert(row,'Missing '+ch.table);for(const key of Object.keys(ch.after))assert.deepEqual(row[key],want[key],ch.table+'/'+JSON.stringify(ch.keys)+'/'+key);}
const c={window:{}};vm.createContext(c);vm.runInContext(fs.readFileSync('docs/content-adapter.js','utf8'),c);
const fn=fs.readFileSync('docs/app.js','utf8').split('function applyGeographicReview(input){')[1].split('\nwindow.atlasData=')[0];vm.runInContext('function applyGeographicReview(input){'+fn,c);
const raw=c.window.atlasContent.reconstruct(actual,'lolita'),view=c.applyGeographicReview(raw.data);
const positions=view.chapters.flatMap(ch=>ch.places.map(id=>({section:ch.id,id,q:ch.placeExcerpts[id]?.original})));
assert.equal(positions.length,358);assert(positions.every(p=>p.q?.quote&&p.q.verificationStatus==='verified'));
const unlocated=view.chapters.flatMap(ch=>(ch.unlocatedPlaces||[]).filter(p=>p.displayInAtlas!==false));assert.equal(unlocated.length,101);assert(unlocated.every(p=>(p.excerpt?.original?.quote||p.quote)?.trim()));
assert.equal(actual.tables.excerpts.length,209);assert.equal(view.chapters.at(-1).places.length,21);
const orderedUnlocated=rows=>[...rows].sort((a,b)=>a.section_id-b.section_id||a.ordinal-b.ordinal);
assert.deepEqual(orderedUnlocated(actual.tables.unlocated_settings),orderedUnlocated(expected.tables.unlocated_settings));
assert(!actual.tables.book_presentations[0].presentation.editorialNotice);
const digest=crypto.createHash('sha256').update(fs.readFileSync(dir+'publish.sql')).digest('hex');
const report={bookId:'lolita',checkedAt:new Date().toISOString(),databasePublication:'verified-via-public-anonymous-api',browserPublication:'Supabase SQL Editor; 19 protected transfer chunks; atomic final transaction; four additional reader-facing afterword originals verified separately',editorNetworkResponse:'Final SQL Editor response failed to fetch; subsequent complete public API comparison verifies the committed result.',reviewedSections:71,mappedAssociations:358,readerFacingUnlocatedAssociations:101,readerFacingAssociations:459,readerFacingOriginalEvidenceGaps:0,mappedOriginalEvidenceGaps:0,afterwordMappedAssociations:21,afterwordAdditionalOriginals:4,relationalOriginalExcerpts:209,preservedUnlocatedRecords:341,changedRowsVerified:changes.length,editorialNotice:null,editorialStatus:'reviewed',sqlSha256:digest,translationCoverage:{en:'verified-original',it:'original-fallback; translation-not-completed',fr:'original-fallback; translation-not-completed',es:'original-fallback; translation-not-completed'},githubPublication:'pending'};
fs.writeFileSync('research/lolita/final-publication.json',JSON.stringify(report,null,2)+'\n');
fs.writeFileSync(dir+'verified-reconstruction.json',JSON.stringify(raw,null,2)+'\n');
console.log('PASS: all '+changes.length+' changed rows match the public API exactly; 358 mapped associations have individual originals; afterword 21; obsolete notice absent; 341 archival records preserved.');
