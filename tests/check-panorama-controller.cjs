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
 // A fictional landmark may also have a separately documented real model.
 config.preferIllustratedAnchors=true;config.geographicOption='Real models';config.geographicPlaces={house:{coords:[48,1],zoom:12},square:{coords:[49,2],zoom:11},paris:{coords:[48.8,2.3],zoom:10}};
 const modes=[],layer=()=>({removeAll(){},add(){}});
 ctx.FictionalMap={point:p=>p,symbol:()=>({})};
 controller.renderer={setGeographic:async value=>modes.push(value),setImage:async()=>{},reset:async()=>{},view:{goTo:async()=>{}},layers:{action:layer(),mentioned:layer()},Graphic:class{constructor(p){Object.assign(this,p)}}};controller.ready=true;
 controller.allowGeographicSelection();await controller.update(chapter,{action:true,mentioned:true},'house');assert.equal(controller.geographic,false);
 controller.viewSelect.value='geographic';controller.viewSelect.onchange();await controller.queue;
 assert.equal(controller.geographic,true);assert.equal(controller.viewSelect.value,'geographic');assert.equal(controller.viewPicker.hidden,false);assert.deepEqual([...controller.visibleNumbers().values()],['1','C1']);
 controller.viewSelect.value='0';controller.viewSelect.onchange();await controller.update(chapter,{action:true,mentioned:true},'house');assert.equal(controller.geographic,false);
 controller.allowGeographicSelection();const realChapter={...chapter,places:['house','paris']};await controller.update(realChapter,{action:true,mentioned:true},'paris');assert.equal(controller.geographic,true);
 controller.allowGeographicSelection();await controller.update(realChapter,{action:true,mentioned:true},'house');assert.equal(controller.geographic,false);
 const excluded={...chapter,illustratedExcluded:['house']};await controller.update(excluded,{action:true,mentioned:true},'house');assert.equal(controller.position('house'),null);assert.equal(controller.geographic,true);
 // A shared landmark must stay in the selected historical era.
 const epochs={...config,viewsAsSections:true,geographicPlaces:{},epochs:[{id:'early',image:'early.png'},{id:'late',image:'late.png'}],anchors:{early:{positions:{house:{x:.2,y:.3}}},late:{positions:{house:{x:.7,y:.8},square:{x:.5,y:.6}}}}};
 const eras=new ctx.Controller(epochs,container,()=>{});
 const early={mapEpoch:0,places:['house'],placeCategories:{house:'action'}},late={mapEpoch:1,places:['house','square'],placeCategories:{house:'action',square:'mentioned'}};
 await eras.update(early,{action:true,mentioned:true},'house');assert.equal(eras.epoch,0);
 await eras.update(late,{action:true,mentioned:true},'house');assert.equal(eras.epoch,1);assert.equal(eras.image.src,'late.png');assert.equal(eras.position('house').x,700);assert.equal(eras.viewPicker,undefined);
 await eras.update(late,{action:false,mentioned:true},'house');assert.equal(eras.epoch,1);assert.deepEqual([...eras.visibleNumbers().values()],['C1']);
 console.log('PASS: separate panorama views never reuse foreign anchors; selecting a place changes image; filters renumber without changing identity; view picker selects a place in its target image.');
})().catch(e=>{console.error(e);process.exitCode=1});
