import fs from 'node:fs';
import path from 'node:path';
import {bookIds,reconstruct,type Bundle} from './model.js';
const input=process.argv[2]||'database/generated/content.json',out=process.argv[3]||'database/generated/site-data';
const bundle=JSON.parse(fs.readFileSync(input,'utf8')) as Bundle;
if(bundle.formatVersion!==1)throw new Error('Unsupported export format');
if(path.resolve(out)===path.resolve('docs/data'))throw new Error('Export to a review directory before replacing the published data.');
fs.mkdirSync(out,{recursive:true});
for(const id of bookIds){const {data,dictionary}=reconstruct(bundle,id);fs.writeFileSync(path.join(out,id+'.js'),'window.atlasData='+JSON.stringify(data,null,2)+';\n');fs.writeFileSync(path.join(out,id+'-i18n.js'),'window.atlasTranslations='+JSON.stringify(dictionary,null,2)+';\n');}
console.log('Exported four browser-compatible datasets and dictionaries to '+out);
