const fs=require('fs'),vm=require('vm');
const dir='work/lolita-final-review/',read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const raw=read(dir+'verified-reconstruction.json'),live=read(dir+'live-after.json');
for(const file of ['docs/data/lolita.js','docs/data/lolita-i18n.js','docs/content/books.js']){
 const name=file.replaceAll('/','__');if(!fs.existsSync(dir+name+'.before'))fs.copyFileSync(file,dir+name+'.before');
}
fs.writeFileSync('docs/data/lolita.js','window.atlasData='+JSON.stringify(raw.data,null,2)+';\n');
fs.writeFileSync('docs/data/lolita-i18n.js','window.atlasTranslations='+JSON.stringify(raw.dictionary,null,2)+';\n');
const c={window:{}};vm.createContext(c);vm.runInContext(fs.readFileSync('docs/content/books.js','utf8'),c);
const books=c.window.atlasCatalogue.books,index=books.findIndex(b=>b.id==='lolita');
const backup={window:{}};vm.createContext(backup);vm.runInContext(fs.readFileSync(dir+'docs__content__books.js.before','utf8'),backup);
const stylesheet=books[index].stylesheet||backup.window.atlasCatalogue.books.find(b=>b.id==='lolita').stylesheet;
books[index]={...live.tables.book_presentations[0].presentation,stylesheet};
fs.writeFileSync('docs/content/books.js','window.atlasCatalogue='+JSON.stringify(c.window.atlasCatalogue,null,2)+';\n');
const analysis=read('research/lolita/section-analysis.json');
analysis.coverage.asOf='2026-10-13';
analysis.latestGeographicalReview={reviewedAt:'2026-11-02',publishedAt:'2026-11-03',record:'FINAL-REVIEW.md',manifest:'final-review.json',publication:'final-publication.json',geographicalSections:71,mappedAssociations:358,readerFacingUnlocatedAssociations:101,readerFacingOriginalEvidenceGaps:0,translationCoverageCompleted:false,historicalCoverageFields:'The original coverage and section collation statuses describe the review dated 13 October; the latest geographic result is recorded here and in the final manifest.'};
fs.writeFileSync('research/lolita/section-analysis.json',JSON.stringify(analysis,null,2)+'\n');
const report=read('research/lolita/final-review.json');
report.readerFacingCompletion={verifiedAt:'2026-11-03',mapped:358,unlocated:101,total:459,missingOriginals:0,afterwordAdditionalGeographicalReferences:['America','Europe','Harvard','Cornell'],record:'FINAL-REVIEW.md'};
fs.writeFileSync('research/lolita/final-review.json',JSON.stringify(report,null,2)+'\n');
console.log('Synchronized only Lolita local data/catalogue backups and latest-review pointers.');
