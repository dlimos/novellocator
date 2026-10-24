const fs=require('node:fs'),vm=require('node:vm');
const before=require('./before.json'),after=require('./after.json'),changes=require('./changes.json');
for(const b of after.books){const file='docs/data/'+b.id+'.js';if(!fs.existsSync(file))continue;const ctx={window:{}};vm.runInNewContext(fs.readFileSync(file,'utf8'),ctx);const data=ctx.window.atlasData;if(!data)continue;let modified=false;
 const old=before.books.find(x=>x.id===b.id);
 for(const key of ['sidebarNote','footerHtml'])if(old.metadata[key]!==b.metadata[key]){data.book[key]=b.metadata[key];modified=true;}
 if(data.book.geographicReview&&old.metadata.geographicReview?.sectionNote&&!b.metadata.geographicReview?.sectionNote){delete data.book.geographicReview.sectionNote;modified=true;}
 if(data.book.geographicReview&&b.metadata.geographicReview?.sidebarNote!==old.metadata.geographicReview?.sidebarNote){data.book.geographicReview.sidebarNote=b.metadata.geographicReview.sidebarNote;modified=true;}
 for(const chapter of data.chapters)if(changes.sections.some(s=>s.book===b.id&&s.id===chapter.id&&s.note===chapter.note)){delete chapter.note;modified=true;}
 if(modified)fs.writeFileSync(file,'window.atlasData='+JSON.stringify(data,null,2)+';\n');
}
let file='docs/data/ulisse.js',s=fs.readFileSync(file,'utf8');for(const x of [...changes.sources,...changes.references])s=s.replaceAll(JSON.stringify(x.old),JSON.stringify(x.label||x.text));fs.writeFileSync(file,s);
for(const book of new Set(changes.translations.map(t=>t.book))){const f='docs/data/'+book+'-i18n.js',ctx={window:{}};vm.runInNewContext(fs.readFileSync(f,'utf8'),ctx);const dict=ctx.window.atlasTranslations;for(const tr of changes.translations.filter(t=>t.book===book)){dict[tr.language]??={};dict[tr.language][tr.text]=tr.translated;}fs.writeFileSync(f,'window.atlasTranslations='+JSON.stringify(dict,null,2)+';\n');}
console.log('Local editorial backups synchronized.');
