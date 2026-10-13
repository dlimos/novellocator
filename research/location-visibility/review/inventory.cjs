const fs=require('fs'),vm=require('vm');
function load(file,key){const ctx={window:{}};vm.runInNewContext(fs.readFileSync(file,'utf8'),ctx);return ctx.window[key];}
const catalogue=load('docs/content/books.js','atlasCatalogue');
const out=[];
for(const b of catalogue.books){
 if(b.mapType!=='geographic')continue;
 const d=load('docs/data/'+b.id+'.js','atlasData');
 const u=new Map();
 for(const c of d.chapters)for(const p of c.unlocatedPlaces||[]){const key=p.id||p.name;if(!u.has(key))u.set(key,{id:p.id,name:p.name,text:p.text,category:p.category,records:[]});u.get(key).records.push({section:c.id,...p});}
 const mapped=Object.entries({...d.places,...d.citedPlaces}).map(([id,p])=>({id,...p}));
 out.push({id:b.id,title:b.title,sections:d.chapters.length,hidden:d.book.hiddenUnlocatedPlaceIds||[],mapped,unlocated:[...u.values()]});
}
fs.mkdirSync('research/location-visibility/review',{recursive:true});
fs.writeFileSync('research/location-visibility/review/inventory.json',JSON.stringify(out,null,2));
console.log(out.map(b=>({id:b.id,sections:b.sections,mapped:b.mapped.length,unlocated:b.unlocated.length,hidden:b.hidden.length})));
if(process.argv.includes('--unlocated'))for(const b of out){console.log('\n'+b.id);for(const u of b.unlocated)console.log(u.id+' | '+u.name+' | '+u.text+' | '+u.records.length+' records');}
if(process.argv.includes('--mapped'))for(const b of out){console.log('\n'+b.id);for(const p of b.mapped)if(/fiction|invent|imag|uncertain|compos|model|unident/i.test(JSON.stringify(p)))console.log(p.id+' | '+p.name+' | '+p.kind+' | '+p.status+' | '+p.note+' | '+p.method);}
