import L from 'leaflet';
export type ResolvedHalo={widthPx:number;color:string};
type Binding={key:string;remove:()=>void;start:()=>void};
const bindings=new WeakMap<L.Path,Binding>();
/** The formal renderer is Leaflet SVG. A sibling path shares its projected d,
 * avoids another geometry/index pass, and has no event targets of its own. */
export function bindGeometryHalo(path:L.Path,halo?:ResolvedHalo):void{
  const key=halo&&halo.widthPx>0?JSON.stringify(halo):'',prior=bindings.get(path);
  if(prior?.key===key)return;
  if(prior){prior.remove();path.off('add',prior.start);path.off('remove',prior.remove);bindings.delete(path);}
  if(!key||!halo)return;
  let node:SVGPathElement|undefined,observer:MutationObserver|undefined;
  const remove=()=>{observer?.disconnect();observer=undefined;node?.remove();node=undefined;};
  const start=()=>{
    remove();const original=path.getElement();if(!original||!original.parentNode)return;
    node=original.cloneNode(false) as SVGPathElement;node.classList.remove('leaflet-interactive');node.classList.add('ria-geometry-halo');node.setAttribute('aria-hidden','true');node.style.pointerEvents='none';
    const sync=()=>{if(!node)return;for(const name of ['d','stroke-linecap','stroke-linejoin','stroke-dasharray','stroke-dashoffset','fill-rule','transform']){const value=original.getAttribute(name);if(value===null)node.removeAttribute(name);else node.setAttribute(name,value);}node.setAttribute('fill','none');node.setAttribute('stroke',halo.color);node.setAttribute('stroke-opacity','1');node.setAttribute('stroke-width',String(Number(original.getAttribute('stroke-width')??path.options.weight??0)+2*halo.widthPx));};
    sync();original.parentNode.insertBefore(node,original);observer=new MutationObserver(sync);observer.observe(original,{attributes:true,attributeFilter:['d','stroke-width','stroke-linecap','stroke-linejoin','stroke-dasharray','stroke-dashoffset','fill-rule','transform']});
  };
  bindings.set(path,{key,start,remove});path.on('add',start);path.on('remove',remove);if(path.getElement())start();
}
export function nativeImageIcon(plan:{iconSize?:[number,number];iconAnchor?:[number,number];imageHalo?:ResolvedHalo},url:string):L.Icon|L.DivIcon{
  const size=plan.iconSize??[24,24],anchor=plan.iconAnchor??[12,12],halo=plan.imageHalo;
  if(!halo||halo.widthPx<=0)return L.icon({iconUrl:url,iconSize:size,iconAnchor:anchor});
  const frame=document.createElement('div'),image=document.createElement('img');
  frame.style.width=size[0]+'px';frame.style.height=size[1]+'px';image.src=url;image.alt='';image.style.width='100%';image.style.height='100%';image.style.maxWidth='none';image.style.outline=`${halo.widthPx}px solid ${halo.color}`;image.style.pointerEvents='none';image.style.display='block';frame.appendChild(image);
  return L.divIcon({className:'ria-config-image-marker',html:frame,iconSize:size,iconAnchor:anchor});
}
