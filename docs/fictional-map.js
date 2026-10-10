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
      '@arcgis/core/core/reactiveUtils.js', '@arcgis/core/Basemap.js', '@arcgis/core/layers/VectorTileLayer.js'
    ]);
  }
  async function create({ container, image, width, height, places, onSelect = () => {}, load = loadSDK,
    initialExtent = null, contentExtent = null, lockFrame = false, fillFrame = false, padding = { top: 15, right: 15, bottom: 15, left: 15 } }) {
    const positions = places.map(p => ({ place: p, geometry: point(p, width, height), symbol: symbol(p) }));
    if (new Set(places.map(p => p.id)).size !== places.length) throw new TypeError('Duplicate place id.');
    const [Map, MapView, MediaLayer, ImageElement, Georeference, Extent, GraphicsLayer, Graphic, reactiveUtils, Basemap, VectorTileLayer] = await load();
    // SVG source, an image Blob or a trusted HTTPS/data image URL can be supplied.
    const isURL = typeof image === 'string' && /^(https:\/\/|file:\/\/|data:image\/|images\/|\.\.?\/)/i.test(image);
    const imageURL = isURL ? image : URL.createObjectURL(image instanceof Blob ? image : new Blob([image], { type: 'image/svg+xml' }));
    const releaseImage = () => { if (!isURL) URL.revokeObjectURL(imageURL); };
    let geographicMode=false, geographicBasemap, geographicLayer;
    let view, clickHandle, frameHandle, disposed = false, selectedId = null;
    try {
      const extent = new Extent({ xmin: 0, ymin: 0, xmax: width, ymax: height, spatialReference: { wkid: 3857 } });
      const homeExtent = contentExtent ? new Extent(contentExtent) : extent;
      let background = new MediaLayer({ source: [new ImageElement({ image: imageURL,
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
      view = new MapView({ container, map, extent: initialExtent ?? homeExtent, spatialReference: { wkid: 3857 },
        ui: { components: [] }, popupEnabled: false, background: { color: '#eee1bd' },
        constraints: { geometry: extent, rotationEnabled: false, snapToZoom: false }, padding });
      await view.when();
      await background.load();
      if (lockFrame) {
        const enforceFrame = () => {
          if (geographicMode || disposed || !view.center || !(view.resolution > 0) || !(view.scale > 0)) return;
          const padding = view.padding || {top:0,right:0,bottom:0,left:0};
          const usableWidth = Math.max(1, view.width - padding.left - padding.right);
          const usableHeight = Math.max(1, view.height - padding.top - padding.bottom);
          const fitResolution = fillFrame ? Math.min(width / Math.max(1, view.width), height / Math.max(1, view.height)) : Math.max(width / usableWidth, height / usableHeight);
          // In MapView, minScale is the zoom-out limit; maxScale limits zoom-in.
          view.constraints.minScale = fitResolution * view.scale / view.resolution;
          if (view.scale > view.constraints.minScale) view.scale = view.constraints.minScale;
          const resolution = Math.min(view.resolution, fitResolution);
          const offsetX = fillFrame ? resolution * (padding.right - padding.left) / 2 : 0;
          const offsetY = fillFrame ? resolution * (padding.top - padding.bottom) / 2 : 0;
          const center = boundedCenter({x:view.center.x+offsetX,y:view.center.y+offsetY}, resolution * (fillFrame ? view.width : usableWidth), resolution * (fillFrame ? view.height : usableHeight), width, height);
          center.x -= offsetX; center.y -= offsetY;
          if (Math.abs(center.x - view.center.x) > 1e-7 || Math.abs(center.y - view.center.y) > 1e-7)
            view.center = { type: 'point', ...center, spatialReference: { wkid: 3857 } };
        };
        frameHandle = reactiveUtils.watch(() => [view.center?.x, view.center?.y, view.resolution, view.width, view.height, view.padding?.top, view.padding?.right, view.padding?.bottom, view.padding?.left], enforceFrame);
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
        view, layers, Graphic, Extent,
        async setGeographic(enabled, basemapURL) {
          if(enabled&&!geographicBasemap){
            const layer=new VectorTileLayer({url:basemapURL});await layer.load();
            geographicLayer=layer;geographicBasemap=new Basemap({baseLayers:[layer]});
          }
          if(disposed)return;
          geographicMode=enabled;background.visible=!enabled;map.basemap=enabled?geographicBasemap:null;
          // Replace all constraints together so the illustrated frame cannot
          // clamp navigation while the geographic basemap is being attached.
          view.constraints={geometry:enabled?null:extent,rotationEnabled:false,snapToZoom:false,
            lods:enabled?geographicLayer?.tileInfo?.lods||null:null,
            minScale:enabled?295828763.7957775:0,maxScale:enabled?1128.497176:0,
            minZoom:-1,maxZoom:-1};
          if(!enabled)await view.goTo(homeExtent,{animate:false});
        },
        async whenImageReady(){if(view.whenLayerView && reactiveUtils?.whenOnce){const layerView=await view.whenLayerView(background);await reactiveUtils.whenOnce(()=>!layerView.updating);}},
        async setImage(nextImage) {
          if (disposed) return;
          if (typeof nextImage !== 'string' || !/^(https:\/\/|file:\/\/|data:image\/|images\/|\.\.?\/)/i.test(nextImage)) throw new TypeError('Invalid image URL.');
          const next = new MediaLayer({source:[new ImageElement({image:nextImage,georeference:new Georeference({extent})})],title:'Illustrated map'});
          try { await next.load(); if(disposed){next.destroy?.();return;} map.add(next,0);
            if(view.whenLayerView && reactiveUtils?.whenOnce){const layerView=await view.whenLayerView(next);await reactiveUtils.whenOnce(()=>!layerView.updating);}
            if(disposed){map.remove(next);next.destroy?.();return;}
            const previous=background;background=next;background.visible=!geographicMode;map.remove(previous);previous.destroy?.();
          }catch(error){map.remove(next);next.destroy?.();throw error;}
        },
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
        reset() { return view.goTo(homeExtent, { animate: false }); },
        getExtent() { return view.extent.clone(); },
        zoom(factor) { if (!Number.isFinite(factor) || factor <= 0) throw new RangeError('Invalid zoom factor.'); return view.goTo(view.extent.clone().expand(factor), { animate: false }); },
        destroy() { if (disposed) return; disposed = true; clickHandle?.remove(); frameHandle?.remove(); view.destroy(); releaseImage(); }
      };
    } catch (error) { disposed = true; clickHandle?.remove(); frameHandle?.remove(); view?.destroy(); releaseImage(); throw error; }
  }
  const MapConstructor = globalThis.Map;
  return { create, point, symbol, colors, boundedCenter };
});
