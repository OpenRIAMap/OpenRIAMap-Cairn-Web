import type { IconItem, RenderColorBinding } from './types';
export function composeIconSvg(item: IconItem, path: string, color: (binding: RenderColorBinding, fallback: string) => string): string {
  const s = item.sizePx, p = item.plate, width = p?.strokeWidthPx ?? 0, inset = width / 2;
  const padding = (p?.paddingPx ?? 0) + width;
  const foreground = color(item.foreground, '#ffffff');
  let plate = '';
  if (p) {
    const attrs = `fill="${color(p.fill, '#2563eb')}" fill-opacity="${p.fillOpacity}" stroke="${color(p.stroke, '#ffffff')}" stroke-opacity="${p.strokeOpacity}" stroke-width="${width}"`;
    if (p.shape === 'circle') plate = `<circle cx="${s/2}" cy="${s/2}" r="${(s-width)/2}" ${attrs}/>`;
    else if (p.shape === 'pin') plate = `<path d="M ${s/2} ${s-inset} C ${s*.44} ${s*.85} ${inset} ${s*.53} ${inset} ${s*.35} A ${(s-width)/2} ${s*.35-inset} 0 1 1 ${s-inset} ${s*.35} C ${s-inset} ${s*.53} ${s*.56} ${s*.85} ${s/2} ${s-inset} Z" ${attrs}/>`;
    else plate = `<rect x="${inset}" y="${inset}" width="${s-width}" height="${s-width}" rx="${p.shape === 'roundedRect' ? Math.min(p.radiusPx ?? s*.2, (s-width)/2) : 0}" ${attrs}/>`;
  }
  const inner = Math.max(.1, Math.min(s - 2 * padding, p?.shape === 'pin' ? s*.58 : s));
  const x = (s-inner)/2, y = p?.shape === 'pin' ? s*.35-inner/2 : (s-inner)/2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">${plate}<path d="${path}" transform="translate(${x} ${y}) scale(${inner/15})" fill="${foreground}" fill-opacity="${item.foregroundOpacity}"/></svg>`;
}
