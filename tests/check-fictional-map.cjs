const assert = require('node:assert/strict');
const { point, symbol, create, boundedCenter } = require('../docs/fictional-map.js');
assert.deepEqual(point({ x: 0, y: 0 }, 1600, 1000), { type: 'point', x: 0, y: 1000, spatialReference: { wkid: 3857 } });
assert.equal(point({ x: 1600, y: 1000 }, 1600, 1000).y, 0);
for (const p of [{ x: -1, y: 0 }, { x: 1, y: NaN }, { x: 1601, y: 5 }]) assert.throws(() => point(p, 1600, 1000), RangeError);
assert.throws(() => point({ x: 0, y: 0 }, 0, 1000), RangeError);
assert.equal(symbol({ kind: 'site', role: 'action' }).style, 'circle');
assert.equal(symbol({ kind: 'area', role: 'action' }).style, 'diamond');
assert.notEqual(symbol({ kind: 'site', role: 'action' }).color, symbol({ kind: 'site', role: 'mentioned' }).color);
assert.throws(() => symbol({ kind: 'area', role: 'unknown' }), TypeError);
let frameCallback, frameRemoved=0;
let view, map, handler, failImage = false, destroyed = 0, removed = 0;
class Props { constructor(props) { Object.assign(this, props); } }
class FakeMap extends Props { constructor(props) { super(props); map = this; } }
class Extent extends Props { clone() { return new Extent({ ...this }); } expand(factor) { this.factor = factor; return this; } }
class View extends Props {
  constructor(props) { super(props); view = this; this.targets = []; this.width=830; this.height=530; this.resolution=1; this.scale=100; this.center={x:0,y:0}; }
  async when() {}
  on(event, cb) { assert.equal(event, 'click'); handler = cb; return { remove() { removed++; } }; }
  async goTo(target) { this.targets.push(target); }
  async hitTest(event, options) { this.include = options.include; return { results: [{ graphic: { attributes: { id: 'house' } } }] }; }
  destroy() { destroyed++; }
}
class Media extends Props { async load() { if (failImage) throw Error('image load failed'); } }
class Graphics extends Props { constructor(props) { super(props); this.graphics = []; this.visible = true; } add(graphic) { this.graphics.push(graphic); } }
const load = async () => [FakeMap, View, Media, Props, Props, Extent, Graphics, Props, {watch(getter, callback){frameCallback=callback; return {remove(){frameRemoved++}}}}];
const places = [{ id: 'house', x: 120, y: 230, kind: 'site', role: 'action' }, { id: 'area', x: 450, y: 200, kind: 'area', role: 'mentioned' }];
(async () => {
  const selections = [];
  const renderer = await create({ container: {}, image: '<svg/>', width: 1600, height: 1000, places, load, onSelect: id => selections.push(id) });
  assert.equal(map.basemap, null);
  assert.equal(map.layers.length, 3);
  assert.equal(view.zoom, undefined);
  assert.deepEqual(view.ui.components, []);
  assert.equal(view.popupEnabled, false);
  assert.equal(view.constraints.geometry.xmax, 1600);
  assert.equal(map.layers[1].graphics[0].geometry.y, 770);
  renderer.setVisible('mentioned', false);
  assert.equal(map.layers[2].visible, false);
  assert.equal(map.layers[1].visible, true);
  assert.equal(await renderer.select('area'), false);
  assert.equal(await renderer.select('house'), true);
  assert.equal(map.layers[1].graphics[0].symbol.outline.color, '#f0c965');
  assert.equal(view.targets.at(-1).center.x, 120);
  await renderer.zoom(.7);
  assert.equal(view.targets.at(-1).factor, .7);
  await renderer.reset();
  assert.equal(view.targets.at(-1).xmin, 0);
  await handler({});
  assert.deepEqual(selections, ['house']);
  assert.equal(view.include.length, 2);
  renderer.destroy(); renderer.destroy();
  assert.equal(destroyed, 1); assert.equal(removed, 1);
  failImage = true;
  await assert.rejects(create({ container: {}, image: '<svg/>', width: 1600, height: 1000, places, load }), /image load failed/);
  assert.equal(destroyed, 2);
  failImage = false;
  const raster = await create({ container: {}, image: 'data:image/png;base64,abc', width: 1600, height: 1000,
    places: [{ ...places[0], label: '1' }, places[1]], load });
  assert.equal(map.layers[0].source[0].image, 'data:image/png;base64,abc');
  assert.equal(map.layers[1].graphics.length, 2);
  assert.equal(map.layers[1].graphics[1].symbol.type, 'text');
  await raster.select('house'); await raster.select('area');
  assert.equal(map.layers[1].graphics[0].symbol.outline.color, '#fff8e8');
  raster.destroy();
  await assert.rejects(create({ container: {}, image: '', width: 1600, height: 1000, places: [...places, places[0]], load }), /Duplicate/);
  assert.deepEqual(boundedCenter({x:-100,y:1200}, 400, 200, 1600, 1000), {x:200,y:900});
  assert.deepEqual(boundedCenter({x:0,y:0}, 2000, 1200, 1600, 1000), {x:800,y:500});
  const locked = await create({container:{},image:'data:image/png;base64,abc',width:1600,height:1000,places,load,lockFrame:true});
  assert.equal(view.constraints.minScale,200);
  assert.equal(view.center.x,400); assert.equal(view.center.y,250);
  view.center={x:1500,y:-100}; frameCallback();
  assert.equal(view.center.x,1200); assert.equal(view.center.y,250);
  view.width=430; view.height=280; frameCallback();
  assert.equal(view.constraints.minScale,400);
  assert.notEqual(locked.getExtent(),view.extent);
  locked.destroy(); assert.equal(frameRemoved,1);
  console.log('Illustrated maps: coordinate transforms, symbols, layers, selection and disposal OK (mock SDK).');
})().catch(error => { console.error(error); process.exitCode = 1; });
