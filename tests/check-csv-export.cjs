const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const ctx={window:{}};vm.runInNewContext(fs.readFileSync('docs/csv-export.js','utf8'),ctx);
// Parse RFC4180 fields, including commas, escaped quotes and embedded newlines.
function parse(text){const rows=[];let row=[],field='',quoted=false;text=text.replace(/^\ufeff/,'');for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){field+='"';i++;}else quoted=!quoted;}else if(c===','&&!quoted){row.push(field);field='';}else if(c==='\r'&&text[i+1]==='\n'&&!quoted){row.push(field);rows.push(row);row=[];field='';i++;}else field+=c;}assert.equal(quoted,false);return rows;}
for(const id of ['ulisse','proust','war-and-peace','moby-dick','gatsby']){
 const raw={window:{}};vm.runInNewContext(fs.readFileSync('docs/data/'+id+'.js','utf8'),raw);const data=raw.window.atlasData;
 for(const locale of ['en','it','fr','es'])for(const kind of ['places','citations']){
  const csv=ctx.window.atlasCsv.build(data,kind,locale),rows=parse(csv);assert.ok(csv.startsWith('\ufeff'));assert.equal(rows.length,1+data.chapters.reduce((sum,c)=>sum+(kind==='citations'?(c.citations||[]).length:c.places.length+(c.unlocatedPlaces||[]).length),0));assert.ok(rows.every(row=>row.length===16));
  if(kind==='citations'){const c=data.chapters.find(c=>c.citations?.length),ref=c.citations[0];assert.equal(rows[1][10],ref.excerpt.original.quote);assert.equal(rows[1][11],ref.excerpt.original.url);assert.equal(rows[1][5],String(data.citedPlaces[ref.placeId].coords[0]));}
 }
}
const synthetic={chapters:[{id:1,title:'A, "B"\nC',places:['p'],placeText:['First\nSecond']}],places:{p:{name:'Place',coords:[1,2]}}};assert.equal(parse(ctx.window.atlasCsv.build(synthetic,'places'))[1][1],synthetic.chapters[0].title);
const attrs={href:'moby-dick-places-it.csv'},link={getAttribute:k=>attrs[k],setAttribute:(k,v)=>attrs[k]=v,addEventListener:(name,fn)=>link.click=fn};ctx.window.atlasCsv.bind({querySelectorAll:()=>[link]},synthetic,'it');assert.equal(attrs.href,'#');assert.equal(attrs.download,'moby-dick-places-it.csv');assert.equal(typeof link.click,'function');
let blob,clicked=false,removed=false,prevented=false,revoked=false;ctx.Blob=Blob;ctx.URL={createObjectURL:value=>{blob=value;return 'blob:test'},revokeObjectURL:url=>{assert.equal(url,'blob:test');revoked=true}};ctx.setTimeout=fn=>fn();ctx.document={body:{appendChild(){}},createElement:()=>({click(){clicked=true;assert.equal(this.download,attrs.download);assert.equal(this.href,'blob:test')},remove(){removed=true}})};
link.click({preventDefault(){prevented=true}});assert.ok(clicked&&removed&&prevented&&revoked);assert.equal(blob.type,'text/csv;charset=utf-8');
blob.text().then(text=>{assert.equal(parse(text)[1][1],synthetic.chapters[0].title);console.log('PASS: dynamic CSV exports in four languages across five novels, every mapped/unlocated record, original quotes/sources, coordinate precision, escaping and actual Blob download without static links.');}).catch(error=>{console.error(error);process.exitCode=1});
