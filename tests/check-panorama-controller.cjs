const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
function element(tagName='div'){return {tagName,style:{},children:[],append(...xs){for(const x of xs){x.parentElement=this;this.children.push(x)}},remove(){this.parentElement.children=this.parentElement.children.filter(x=>x!==this)},setAttribute(){},querySelectorAll(){return this.children.filter(x=>x.tagName==='button')},getBoundingClientRect(){return {width:900,height:550}}};}
const ctx={window:{addEventListener(){}},document:{createElement:element},console};vm.createContext(ctx);
vm.runInContext(fs.readFileSync('docs/illustrated-map-controller.js','utf8')+'\nglobalThis.Controller=IllustratedMapController;',ctx);
(async()=>{
 const container=element();container.parentElement=element();let selected;
 const config={width:1000,height:600,separateViews:true,globalEpoch:0,viewLabel:'View',epochs:[{id:'a',image:'a.png',label:'Grounds'},{id:'b',image:'b.png',label:'Town'}],anchors:{a:{positions:{house:{x:.2,y:.4}}},b:{positions:{square:{x:.5,y:.6}}}}};
 const controller=new ctx.Controller(config,container,id=>selected=id),chapter={mapEpoch:0,places:['house','square'],placeCategories:{house:'action',square:'mentioned'}};
 await controller.update(chapter,{action:true,mentioned:true},'house');
 assert.equal(controller.epoch,0);assert.equal(controller.position('square'),null);assert.deepEqual([...controller.visibleNumbers().values()],['1']);
 await controller.update(chapter,{action:true,mentioned:true},'square');
 assert.equal(controller.epoch,1);assert.equal(controller.position('house'),null);assert.deepEqual([...controller.visibleNumbers().values()],['C1']);
 await controller.update(chapter,{action:true,mentioned:false},'square');assert.equal(controller.selected,'square');assert.equal(controller.visibleNumbers().size,0);
 await controller.update(chapter,{action:true,mentioned:true},'square');assert.deepEqual([...controller.visibleNumbers().values()],['C1']);
 controller.viewSelect.value='0';controller.viewSelect.onchange();assert.equal(selected,'house');
 console.log('PASS: separate panorama views never reuse foreign anchors; selecting a place changes image; filters renumber without changing identity; view picker selects a place in its target image.');
})().catch(e=>{console.error(e);process.exitCode=1});
