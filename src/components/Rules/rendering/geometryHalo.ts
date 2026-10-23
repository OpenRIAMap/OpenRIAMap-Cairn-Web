import L from 'leaflet';
export type ResolvedHalo={widthPx:number;color:string;cutout?:boolean;showInner?:boolean};
type Binding={key:string;remove:()=>void;start:()=>void};
const bindings=new WeakMap<L.Path,Binding>();
const ns='http://www.w3.org/2000/svg';
let sequence=0;
const attr=(node:Element,key:string,value:string)=>{if(node.getAttribute(key)!==value)node.setAttribute(key,value);};
const nonInteractive=(node:SVGElement)=>{node.classList.remove('leaflet-interactive');node.setAttribute('aria-hidden','true');node.style.pointerEvents='none';};
const geometryAttributes=['d','stroke-linecap','stroke-linejoin','stroke-miterlimit','stroke-dasharray','stroke-dashoffset','fill-rule','transform'];
function copyGeometry(source:Element,target:Element){for(const name of geometryAttributes){const value=source.getAttribute(name);if(value===null)target.removeAttribute(name);else attr(target,name,value);}}

/** Paint and cutout reuse the projected path, without another geometry pass. */
export function bindGeometryHalo(path:L.Path,halo?:ResolvedHalo):void{
  const key=halo&&halo.widthPx>0?JSON.stringify(halo):'',prior=bindings.get(path);
  if(prior?.key===key)return;
  if(prior){prior.remove();path.off('add',prior.start);path.off('remove',prior.remove);bindings.delete(path);}
  if(!key||!halo)return;
  let node:SVGPathElement|undefined,defs:SVGDefsElement|undefined,fill:SVGPathElement|undefined,observer:MutationObserver|undefined,splitFill=false;
  const remove=()=>{
    observer?.disconnect();observer=undefined;node?.remove();node=undefined;defs?.remove();defs=undefined;fill?.remove();fill=undefined;
    if(splitFill){const original=path.getElement();if(original)original.setAttribute('fill-opacity',String(path.options.fillOpacity??.2));splitFill=false;}
  };
  const start=()=>{
    remove();const original=path.getElement() as SVGPathElement|undefined;if(!original?.parentNode)return;
    const parent=original.parentNode,polygon=path instanceof L.Polygon,inner=Boolean(polygon&&halo.cutout&&halo.showInner);
    node=original.cloneNode(false) as SVGPathElement;node.removeAttribute('id');nonInteractive(node);node.classList.add('ria-geometry-halo');
    let mask:SVGMaskElement|undefined,white:SVGRectElement|undefined,cut:SVGPathElement|undefined;
    if(halo.cutout){
      defs=document.createElementNS(ns,'defs');mask=document.createElementNS(ns,'mask');mask.id='ria-halo-'+(++sequence);mask.setAttribute('maskUnits','userSpaceOnUse');mask.setAttribute('maskContentUnits','userSpaceOnUse');mask.style.maskType='luminance';
      white=document.createElementNS(ns,'rect');white.setAttribute('fill','white');cut=original.cloneNode(false) as SVGPathElement;nonInteractive(cut);cut.removeAttribute('id');mask.append(white,cut);defs.append(mask);parent.insertBefore(defs,original);node.setAttribute('mask','url(#'+mask.id+')');
    }
    if(inner){fill=original.cloneNode(false) as SVGPathElement;nonInteractive(fill);fill.removeAttribute('id');fill.classList.add('ria-halo-original-fill');parent.insertBefore(fill,original);splitFill=true;}
    const sync=()=>{
      if(!node)return;copyGeometry(original,node);attr(node,'fill','none');attr(node,'stroke',halo.color);attr(node,'stroke-opacity','1');
      const width=original.getAttribute('stroke')==='none'?0:Number(original.getAttribute('stroke-width')??path.options.weight??0);attr(node,'stroke-width',String(width+2*halo.widthPx));
      if(mask&&white&&cut){
        copyGeometry(original,cut);attr(cut,'stroke','black');attr(cut,'stroke-opacity','1');attr(cut,'stroke-width',String(width));attr(cut,'fill',polygon&&!inner?'black':'none');attr(cut,'fill-opacity','1');
        const bounds=(path as L.Path&{_pxBounds?:L.Bounds})._pxBounds;
        const box=bounds?.min&&bounds.max?{x:bounds.min.x,y:bounds.min.y,width:bounds.max.x-bounds.min.x,height:bounds.max.y-bounds.min.y}:original.getBBox();
        // Restrict each offscreen mask to the actual outer stroke envelope.
        // Round/bevel joins need one radius; square caps can reach sqrt(2),
        // and a miter is bounded by the SVG miter limit (default 4).
        const radius=width/2+halo.widthPx,join=original.getAttribute('stroke-linejoin')??'miter',cap=original.getAttribute('stroke-linecap')??'butt';
        const authoredMiter=Number(original.getAttribute('stroke-miterlimit')??4),miter=Number.isFinite(authoredMiter)&&authoredMiter>=1?authoredMiter:4;
        const margin=radius*Math.max(cap==='square'?Math.SQRT2:1,join==='miter'?miter:1)+2;
        for(const [name,value]of Object.entries({x:box.x-margin,y:box.y-margin,width:Math.max(1,box.width+2*margin),height:Math.max(1,box.height+2*margin)})){attr(mask,name,String(value));attr(white,name,String(value));}
      }
      if(fill){copyGeometry(original,fill);attr(fill,'stroke','none');attr(fill,'fill',path.options.fill===false?'none':original.getAttribute('fill')??'none');attr(fill,'fill-opacity',String(path.options.fillOpacity??.2));attr(original,'fill-opacity','0');}
    };
    sync();parent.insertBefore(node,original);
    // Leaflet reassigns identical d/style attributes while panning. Do not
    // rescan and synchronize every mask for those no-op notifications.
    observer=new MutationObserver(records=>{if(records.some(record=>record.attributeName&&original.getAttribute(record.attributeName)!==record.oldValue))sync();});
    observer.observe(original,{attributes:true,attributeOldValue:true,attributeFilter:[...geometryAttributes,'stroke-width','stroke','fill','fill-opacity']});
  };
  bindings.set(path,{key,start,remove});path.on('add',start);path.on('remove',remove);if(path.getElement())start();
}

/** Image pixels remain an ordinary img, with an independent SVG rectangle. */
export function nativeImageIcon(plan:{iconSize?:[number,number];iconAnchor?:[number,number];imageHalo?:ResolvedHalo},url:string):L.Icon|L.DivIcon{
  const size=plan.iconSize??[24,24],anchor=plan.iconAnchor??[12,12],halo=plan.imageHalo;
  if(!halo||halo.widthPx<=0)return L.icon({iconUrl:url,iconSize:size,iconAnchor:anchor});
  const frame=document.createElement('div'),image=document.createElement('img');
  Object.assign(frame.style,{width:size[0]+'px',height:size[1]+'px',position:'relative',overflow:'visible'});
  image.src=url;image.alt='';Object.assign(image.style,{width:'100%',height:'100%',maxWidth:'none',pointerEvents:'none',display:'block'});frame.append(image);
  if(!halo.cutout){image.style.outline=halo.widthPx+'px solid '+halo.color;}
  else{
    const svg=document.createElementNS(ns,'svg'),defs=document.createElementNS(ns,'defs'),mask=document.createElementNS(ns,'mask'),white=document.createElementNS(ns,'rect'),cut=document.createElementNS(ns,'rect'),ring=document.createElementNS(ns,'rect');
    svg.setAttribute('width',String(size[0]));svg.setAttribute('height',String(size[1]));svg.setAttribute('viewBox','0 0 '+size.join(' '));Object.assign(svg.style,{position:'absolute',left:'0',top:'0',overflow:'visible',pointerEvents:'none'});svg.setAttribute('aria-hidden','true');
    mask.id='ria-image-halo-'+(++sequence);mask.setAttribute('maskUnits','userSpaceOnUse');mask.style.maskType='luminance';
    for(const target of [mask,white])for(const [name,value]of Object.entries({x:-halo.widthPx-1,y:-halo.widthPx-1,width:size[0]+2*halo.widthPx+2,height:size[1]+2*halo.widthPx+2}))target.setAttribute(name,String(value));
    white.setAttribute('fill','white');cut.setAttribute('width',String(size[0]));cut.setAttribute('height',String(size[1]));cut.setAttribute('fill','black');mask.append(white,cut);defs.append(mask);
    ring.setAttribute('width',String(size[0]));ring.setAttribute('height',String(size[1]));ring.setAttribute('fill','none');ring.setAttribute('stroke',halo.color);ring.setAttribute('stroke-width',String(2*halo.widthPx));ring.setAttribute('mask','url(#'+mask.id+')');svg.append(defs,ring);frame.append(svg);
  }
  return L.divIcon({className:'ria-config-image-marker',html:frame,iconSize:size,iconAnchor:anchor});
}
