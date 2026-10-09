/* Reusable illustrated-map renderer. Positions use drawing pixels, never lat/lon. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.FictionalMap = api;
})(typeof globalThis === 'object' ? globalThis : this, function () {
  'use strict';
  const colors = { action: '#19665c', mentioned: '#99502d' };
  function point(position, width, height) {
    if (![width, height].every(n => Number.isFinite(n) && n > 0) ||
        ![position.x, position.y].every(Number.isFinite) ||
        position.x < 0 || position.x > width || position.y < 0 || position.y > height) {
      throw new RangeError('Position must lie within the drawing.');
    }
    // This spatial reference is only a rendering canvas. Units are image pixels.
    return { type: 'point', x: position.x, y: height - position.y, spatialReference: { wkid: 3857 } };
  }
  function symbol(place) {
    if (!Object.hasOwn(colors, place.role)) throw new TypeError('Unknown place role.');
    if (!['site', 'area'].includes(place.kind)) throw new TypeError('Unknown place geometry.');
    return { type: 'simple-marker', style: place.kind === 'site' ? 'circle' : 'diamond',
      color: colors[place.role], size: 18, outline: { color: '#fff8e8', width: 2 } };
  }
  async function loadSDK() {
    await import('https://js.arcgis.com/5.1/index.js');
    return globalThis.$arcgis.import([
      '@arcgis/core/Map.js', '@arcgis/core/views/MapView.js',
      '@arcgis/core/layers/MediaLayer.js', '@arcgis/core/layers/support/ImageElement.js',
      '@arcgis/core/layers/support/ExtentAndRotationGeoreference.js',
      '@arcgis/core/geometry/Extent.js', '@arcgis/core/layers/GraphicsLayer.js', '@arcgis/core/Graphic.js'
    ]);
  }
  async function create({ container, image, width, height, places, onSelect = () => {}, load = loadSDK }) {
    const positions = places.map(p => ({ place: p, geometry: point(p, width, height), symbol: symbol(p) }));
    if (new Set(places.map(p => p.id)).size !== places.length) throw new TypeError('Duplicate place id.');
    const [Map, MapView, MediaLayer, ImageElement, Georeference, Extent, GraphicsLayer, Graphic] = await load();
    const imageURL = URL.createObjectURL(new Blob([image], { type: 'image/svg+xml' }));
    let view, clickHandle, disposed = false;
    try {
      const extent = new Extent({ xmin: 0, ymin: 0, xmax: width, ymax: height, spatialReference: { wkid: 3857 } });
      const background = new MediaLayer({ source: [new ImageElement({ image: imageURL,
        georeference: new Georeference({ extent }) })], title: 'Illustrated map' });
      const layers = Object.fromEntries(Object.keys(colors).map(role => [role,
        new GraphicsLayer({ id: role, title: role })]));
      const graphics = new MapConstructor();
      for (const item of positions) {
        const graphic = new Graphic({ geometry: item.geometry, symbol: item.symbol, attributes: { id: item.place.id } });
        layers[item.place.role].add(graphic);
        graphics.set(item.place.id, graphic);
      }
      const map = new Map({ basemap: null, layers: [background, layers.action, layers.mentioned] });
      view = new MapView({ container, map, extent, spatialReference: { wkid: 3857 },
        ui: { components: [] }, popupEnabled: false, background: { color: '#eee1bd' },
        constraints: { geometry: extent, rotationEnabled: false }, padding: { top: 15, right: 15, bottom: 15, left: 15 } });
      await view.when();
      await background.load();
      clickHandle = view.on('click', async event => {
        try {
          const result = await view.hitTest(event, { include: [layers.action, layers.mentioned] });
          const hit = result.results.find(r => r.graphic?.attributes?.id);
          if (hit && !disposed) onSelect(hit.graphic.attributes.id);
        } catch (error) { if (!disposed) console.warn('Illustrated map hit test failed', error); }
      });
      return {
        setVisible(role, visible) { if (!layers[role]) throw new TypeError('Unknown layer.'); layers[role].visible = Boolean(visible); },
        async select(id) {
          const graphic = graphics.get(id);
          if (!graphic || !layers[places.find(p => p.id === id).role].visible) return false;
          await view.goTo({ center: graphic.geometry }, { animate: false });
          return true;
        },
        reset() { return view.goTo(extent, { animate: false }); },
        zoom(factor) { if (!Number.isFinite(factor) || factor <= 0) throw new RangeError('Invalid zoom factor.'); return view.goTo(view.extent.clone().expand(factor), { animate: false }); },
        destroy() { if (disposed) return; disposed = true; clickHandle?.remove(); view.destroy(); URL.revokeObjectURL(imageURL); }
      };
    } catch (error) { disposed = true; clickHandle?.remove(); view?.destroy(); URL.revokeObjectURL(imageURL); throw error; }
  }
  const MapConstructor = globalThis.Map;
  return { create, point, symbol, colors };
});
