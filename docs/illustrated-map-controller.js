/* One persistent ArcGIS view; chapter changes replace only its background. */
class IllustratedMapController {
 constructor(config,container,onSelect){
  this.config=config;this.container=container;this.onSelect=onSelect;this.renderer=null;this.ready=false;this.queue=Promise.resolve();this.sequence=0;this.epoch=config.globalEpoch;this.visible={action:true,mentioned:true};
  this.preview=document.createElement('div');this.preview.className='illustrated-preview';
  this.drawing=document.createElement('div');this.drawing.className='illustrated-drawing';
  this.image=document.createElement('img');this.image.alt='';this.drawing.append(this.image);this.preview.append(this.drawing);container.parentElement.append(this.preview);
  this.resize=()=>{const box=container.getBoundingClientRect();const width=Math.max(box.width,box.height*config.width/config.height);this.drawing.style.width=width+'px';this.drawing.style.height=width*config.height/config.width+'px';};
  this.observer=typeof ResizeObserver==='function'?new ResizeObserver(this.resize):null;this.observer?.observe(container);this.resize();
  window.addEventListener('pagehide',()=>{this.sequence++;this.observer?.disconnect();this.renderer?.destroy();});
 }
 position(id,epoch=this.epoch){
  const anchors=this.config.anchors[this.config.epochs[epoch].id]?.positions;
  const p=anchors?.[id]||Object.values(this.config.anchors).map(a=>a.positions[id]).find(Boolean);
  return p?{x:p.x*this.config.width,y:p.y*this.config.height}:null;
 }
 paintPreview(){
  this.image.src=this.config.epochs[this.epoch].image;
  for(const pin of Array.from(this.drawing.querySelectorAll('button')))pin.remove();
  (this.chapter?.places||[]).forEach((id,index)=>{const p=this.position(id);if(!p)return;const role=this.chapter.placeCategories?.[id]||'action';const pin=document.createElement('button');pin.className='illustrated-fallback-pin'+(this.chapter.placeKinds?.[id]==='area'?' area':'')+(this.selected===id?' selected':'');pin.style.left=p.x/this.config.width*100+'%';pin.style.top=p.y/this.config.height*100+'%';pin.style.background=role==='mentioned'?'#99502d':'#19665c';const label=document.createElement('span');label.textContent=String(index+1);pin.append(label);pin.hidden=!this.visible[role];pin.setAttribute('aria-label',this.chapter.placeNames?.[id]||id);pin.onclick=()=>this.onSelect(id);this.drawing.append(pin);});
 }
 draw(){
  if(!this.renderer)return;
  const {layers,Graphic}=this.renderer;layers.action.removeAll();layers.mentioned.removeAll();
  for(const role of ['action','mentioned'])layers[role].visible=this.visible[role];
  (this.chapter?.places||[]).forEach((id,index)=>{const p=this.position(id);if(!p)return;const role=this.chapter.placeCategories?.[id]||'action',kind=this.chapter.placeKinds?.[id]||'site';const geometry=FictionalMap.point(p,this.config.width,this.config.height),attributes={id};const symbol=FictionalMap.symbol({kind,role});symbol.size=kind==='area'?31:28;symbol.outline={color:this.selected===id?'#e8c565':'#fff',width:this.selected===id?3.5:2};layers[role].add(new Graphic({geometry,attributes,symbol}));layers[role].add(new Graphic({geometry,attributes,symbol:{type:'text',text:String(index+1),color:'#fff',font:{family:'Arial',size:12,weight:'bold'},verticalAlignment:'middle'}}));});
 }
 async update(chapter,visible,selected){
  this.chapter=chapter;this.visible={...visible};this.selected=selected;this.epoch=chapter.mapEpoch??this.config.globalEpoch;this.paintPreview();
  if(!this.renderer||!this.ready)return;
  if(this.loadedEpoch===this.epoch){this.draw();return;}
  this.preview.hidden=false;const token=++this.sequence;
  this.queue=this.queue.catch(()=>{}).then(async()=>{if(token!==this.sequence)return;const epoch=this.epoch;
   try{await this.renderer.setImage(this.config.epochs[epoch].image);if(token!==this.sequence)return;this.loadedEpoch=epoch;this.draw();await this.renderer.reset();this.preview.hidden=true;}
   catch(error){this.preview.hidden=false;console.error('Illustrated background failed',error);}
  });return this.queue;
 }
 async initialize(){
  const epoch=this.epoch;
  this.renderer=await FictionalMap.create({container:this.container,image:this.config.epochs[epoch].image,width:this.config.width,height:this.config.height,places:[],contentExtent:this.config.core,lockFrame:true,fillFrame:true,padding:{top:55,bottom:35,left:20,right:20},onSelect:this.onSelect});
  try{await this.renderer.whenImageReady();this.loadedEpoch=epoch;this.ready=true;await this.renderer.reset();await this.update(this.chapter,this.visible,this.selected);this.draw();this.preview.hidden=false;
   if(this.loadedEpoch===this.epoch)this.preview.hidden=true;return this.renderer.view;
  }catch(error){this.renderer.destroy();this.renderer=null;this.ready=false;this.preview.hidden=false;throw error;}
 }
 fit(){return this.renderer?.reset();}
 zoom(factor){return this.renderer?.zoom(factor);}
 focus(id){const p=this.position(id);if(!p||!this.renderer)return;return this.renderer.view.goTo({center:FictionalMap.point(p,this.config.width,this.config.height)},{animate:false});}
}
