import {convexHaloRing} from './convexHaloRing';
import L from 'leaflet';
import {pointSymbolMetrics} from './pointSymbolMetrics';
function safeSvgColor(value: unknown, fallback: string): string {
  const color = String(value ?? '').trim();
  // Colors in a local config still cross an HTML boundary here. Keep the
  // generated SVG to a conservative CSS-color subset instead of interpolating
  // arbitrary text into markup.
  return /^(#[0-9a-f]{3,8}|(?:rgb|hsl)a?\([0-9.,%\s-]+\)|[a-z]+)$/i.test(color) ? color : fallback;
}

export function makeConfigShapeMarker(latlng: L.LatLng, plan: any, pane: string, interactive: boolean): L.Marker {
  const metrics=pointSymbolMetrics(plan),radius=metrics.radius,size=metrics.canvas;
  const center = size / 2;
  const outer = metrics.outer;
  const stroke = safeSvgColor(plan?.style?.color, '#111827');
  const fill = safeSvgColor(plan?.style?.fillColor ?? plan?.style?.color, '#f97316');
  const strokeWidth = Math.max(0, Number(plan?.style?.weight ?? 1));
  const opacity = Math.min(1, Math.max(0, Number(plan?.style?.opacity ?? (plan?.shape==='circle'?1:0.9))));
  const fillOpacity = Math.min(1, Math.max(0, Number(plan?.style?.fillOpacity ?? 0.6)));
  const pointsFor = (count: number, rotate = -90) => Array.from({ length: count }, (_, index) => {
    const angle = ((rotate + index * 360 / count) * Math.PI) / 180;
    return `${(center + outer * Math.cos(angle)).toFixed(2)},${(center + outer * Math.sin(angle)).toFixed(2)}`;
  }).join(' ');
  const shape = String(plan?.shape ?? 'square');
  const figure = shape === 'circle' ? `<circle cx="${center}" cy="${center}" r="${radius}"/>` : shape === 'triangle'
    ? `<polygon points="${pointsFor(3)}" />`
    : shape === 'regular4'
      ? `<polygon points="${pointsFor(4, -45)}" />`
      : shape === 'regular5'
        ? `<polygon points="${pointsFor(5)}" />`
        : shape === 'regular6'
          ? `<polygon points="${pointsFor(6, -90)}" />`
          : `<rect x="${(center - outer).toFixed(2)}" y="${(center - outer).toFixed(2)}" width="${(outer * 2).toFixed(2)}" height="${(outer * 2).toFixed(2)}" />`;
  const h=radius>0?Number(plan?.halo?.widthPx??0):0,color=safeSvgColor(plan?.halo?.color,'#ffffff'),join=plan?.style?.lineJoin??'round';
  const vertices:Array<[number,number]>=shape==='square'?[[center-outer,center-outer],[center+outer,center-outer],[center+outer,center+outer],[center-outer,center+outer]]:Array.from({length:shape==='triangle'?3:shape==='regular5'?5:shape==='regular6'?6:4},(_,index)=>{
   const n=shape==='triangle'?3:shape==='regular5'?5:shape==='regular6'?6:4,angle=((shape==='regular4'?-45:-90)+index*360/n)*Math.PI/180;return [center+outer*Math.cos(angle),center+outer*Math.sin(angle)];
  });
  const halo=!h?'':plan?.halo?.cutout?(shape==='circle'?`<circle cx="${center}" cy="${center}" r="${radius+strokeWidth/2+h/2}" fill="none" stroke="${color}" stroke-width="${h}"/>`:`<path d="${convexHaloRing(vertices,strokeWidth/2,strokeWidth/2+h,join)}" fill="${color}" fill-rule="evenodd"/>`):`<g fill="none" stroke="${color}" stroke-width="${strokeWidth+2*h}" stroke-linecap="${plan?.style?.lineCap??'round'}" stroke-linejoin="${join}">${figure}</g>`;
  const html = `<svg aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">${halo}<g stroke="${stroke}" fill="${fill}" stroke-width="${strokeWidth}" stroke-opacity="${opacity}" fill-opacity="${fillOpacity}" stroke-linecap="${plan?.style?.lineCap??'round'}" stroke-linejoin="${join}">${radius>0?figure:''}</g></svg>`;
  return L.marker(latlng, {
    pane,
    icon: L.divIcon({ className: 'ria-config-shape-marker', html, iconSize: [size, size], iconAnchor: [center, center] }),
    interactive,
    zIndexOffset: Number(plan?.zIndexOffset ?? 0),
  });
}
