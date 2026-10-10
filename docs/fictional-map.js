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
  function boundedCenter(center, visibleWidth, visibleHeight, width, height) {
    const clamp = (value, visible, size) => visible >= size ? size / 2 : Math.max(visible / 2, Math.min(size - visible / 2, value));
    return { x: clamp(center.x, visibleWidth, width), y: clamp(center.y, visibleHeight, height) };
  }
  async function loadSDK() {
    await import('https://js.arcgis.com/5.1/index.js');
    return globalThis.$arcgis.import([
      '@arcgis/core/Map.js', '@arcgis/core/views/MapView.js',
      '@arcgis/core/layers/MediaLayer.js', '@arcgis/core/layers/support/ImageElement.js',
      '@arcgis/core/layers/support/ExtentAndRotationGeoreference.js',
      '@arcgis/core/geometry/Extent.js', '@arcgis/core/layers/GraphicsLayer.js', '@arcgis/core/Graphic.js',
      '@arcgis/core/core/reactiveUtils.js'
    ]);
  }
  async function create({ container, image, width, height, places, onSelect = () => {}, load = loadSDK,
    initialExtent = null, lockFrame = false, padding = { top: 15, right: 15, bottom: 15, left: 15 } }) {
    const positions = places.map(p => ({ place: p, geometry: point(p, width, height), symbol: symbol(p) }));
    if (new Set(places.map(p => p.id)).size !== places.length) throw new TypeError('Duplicate place id.');
    const [Map, MapView, MediaLayer, ImageElement, Georeference, Extent, GraphicsLayer, Graphic, reactiveUtils] = await load();
    // SVG source, an image Blob or a trusted HTTPS/data image URL can be supplied.
    const isURL = typeof image === 'string' && /^(https:\/\/|data:image\/)/i.test(image);
    const imageURL = isURL ? image : URL.createObjectURL(image instanceof Blob ? image : new Blob([image], { type: 'image/svg+xml' }));
    const releaseImage = () => { if (!isURL) URL.revokeObjectURL(imageURL); };
    let view, clickHandle, frameHandle, disposed = false, selectedId = null;
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
        if (item.place.label) layers[item.place.role].add(new Graphic({ geometry: item.geometry,
          symbol: { type: 'text', text: String(item.place.label), color: '#fff8e8',
            font: { family: 'Arial', size: 8, weight: 'bold' }, verticalAlignment: 'middle' },
          attributes: { id: item.place.id } }));
      }
      const map = new Map({ basemap: null, layers: [background, layers.action, layers.mentioned] });
      view = new MapView({ container, map, extent: initialExtent ?? extent, spatialReference: { wkid: 3857 },
        ui: { components: [] }, popupEnabled: false, background: { color: '#eee1bd' },
        constraints: { geometry: extent, rotationEnabled: false }, padding });
      await view.when();
      await background.load();
      if (lockFrame) {
        const enforceFrame = () => {
          if (disposed || !view.center || !(view.resolution > 0) || !(view.scale > 0)) return;
          const usableWidth = Math.max(1, view.width - padding.left - padding.right);
          const usableHeight = Math.max(1, view.height - padding.top - padding.bottom);
          const fitResolution = Math.max(width / usableWidth, height / usableHeight);
          // In MapView, minScale is the zoom-out limit; maxScale limits zoom-in.
          view.constraints.minScale = fitResolution * view.scale / view.resolution;
          if (view.scale > view.constraints.minScale) view.scale = view.constraints.minScale;
          const center = boundedCenter(view.center, view.resolution * usableWidth, view.resolution * usableHeight, width, height);
          if (Math.abs(center.x - view.center.x) > 1e-7 || Math.abs(center.y - view.center.y) > 1e-7)
            view.center = { type: 'point', ...center, spatialReference: { wkid: 3857 } };
        };
        frameHandle = reactiveUtils.watch(() => [view.center?.x, view.center?.y, view.resolution, view.width, view.height], enforceFrame);
        enforceFrame();
      }
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
          if (selectedId) graphics.get(selectedId).symbol = positions.find(p => p.place.id === selectedId).symbol;
          const baseSymbol = positions.find(p => p.place.id === id).symbol;
          graphic.symbol = { ...baseSymbol, outline: { color: '#f0c965', width: 3 } };
          selectedId = id;
          await view.goTo({ center: graphic.geometry }, { animate: false });
          return true;
        },
        reset() { return view.goTo(extent, { animate: false }); },
        getExtent() { return view.extent.clone(); },
        zoom(factor) { if (!Number.isFinite(factor) || factor <= 0) throw new RangeError('Invalid zoom factor.'); return view.goTo(view.extent.clone().expand(factor), { animate: false }); },
        destroy() { if (disposed) return; disposed = true; clickHandle?.remove(); frameHandle?.remove(); view.destroy(); releaseImage(); }
      };
    } catch (error) { disposed = true; clickHandle?.remove(); frameHandle?.remove(); view?.destroy(); releaseImage(); throw error; }
  }
  const MapConstructor = globalThis.Map;
  return { create, point, symbol, colors, boundedCenter };
});
