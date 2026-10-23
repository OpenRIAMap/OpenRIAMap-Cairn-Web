import type {IconItem,RenderColorBinding} from './types';
import {haloWidth} from './halo';
const cache=new Map<string,string>();
export const iconCompositionStats={hits:0,misses:0};
export function iconCanvas(item:IconItem){const padding=haloWidth(item.halo)>0?Math.ceil(haloWidth(item.halo)+1):0;return {padding,size:item.sizePx+2*padding};}
const attr=(value:string)=>value.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
export function composeIconSvg(item:IconItem,path:string,color:(binding:RenderColorBinding,fallback:string)=>string):string{
  const s=item.sizePx,p=item.plate,w=p?.strokeWidthPx??0,inset=w/2,h=haloWidth(item.halo),canvas=iconCanvas(item);
  const foreground=color(item.foreground,'#ffffff'),fill=p?color(p.fill,'#2563eb'):'',stroke=p?color(p.stroke,'#ffffff'):'',halo=item.halo?color(item.halo.color,'#ffffff'):'#ffffff';
  const key=JSON.stringify([item,path,foreground,fill,stroke,halo]);const hit=cache.get(key);if(hit){iconCompositionStats.hits++;return hit;}iconCompositionStats.misses++;
  const plate=(attrs:string)=>!p?'':p.shape==='circle'?`<circle cx="${s/2}" cy="${s/2}" r="${(s-w)/2}" ${attrs}/>`:p.shape==='pin'?`<path d="M ${s/2} ${s-inset} C ${s*.44} ${s*.85} ${inset} ${s*.53} ${inset} ${s*.35} A ${(s-w)/2} ${s*.35-inset} 0 1 1 ${s-inset} ${s*.35} C ${s-inset} ${s*.53} ${s*.56} ${s*.85} ${s/2} ${s-inset} Z" ${attrs}/>`:`<rect x="${inset}" y="${inset}" width="${s-w}" height="${s-w}" rx="${p.shape==='roundedRect'?Math.min(p.radiusPx??s*.2,(s-w)/2):0}" ${attrs}/>`;
  const inner=Math.max(.1,Math.min(s-2*((p?.paddingPx??0)+w),p?.shape==='pin'?s*.58:s)),x=(s-inner)/2,y=p?.shape==='pin'?s*.35-inner/2:(s-inner)/2;
  const glyph=`d="${attr(path)}" transform="translate(${x} ${y}) scale(${inner/15})"`;
  const haloLayer=h? p?plate(`fill="none" stroke="${attr(halo)}" stroke-width="${w+2*h}" stroke-linejoin="round"`):`<path ${glyph} fill="none" stroke="${attr(halo)}" stroke-width="${2*h*15/inner}" stroke-linejoin="round"/>`:'';
  const body=plate(`fill="${attr(fill)}" fill-opacity="${p?.fillOpacity}" stroke="${attr(stroke)}" stroke-opacity="${p?.strokeOpacity}" stroke-width="${w}"`)+`<path ${glyph} fill="${attr(foreground)}" fill-opacity="${item.foregroundOpacity}"/>`;
  const result=`<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.size}" height="${canvas.size}" viewBox="0 0 ${canvas.size} ${canvas.size}"><g transform="translate(${canvas.padding} ${canvas.padding})">${haloLayer}${body}</g></svg>`;
  if(cache.size>=1024)cache.delete(cache.keys().next().value!);cache.set(key,result);return result;
}
