import * as L from 'leaflet';
import type {DynmapProjection} from '@/lib/DynmapProjection';

import type {AssistGridSettings} from './assistGridMath';
export {normalizeAssistGrid,snapAssistGrid,type AssistGridSettings} from './assistGridMath';

/** One viewport canvas, independent of feature data and hit testing. */
export function mountAssistGrid(map:L.Map,projection:DynmapProjection,grid:AssistGridSettings,onDensity:(dense:boolean)=>void){
  const pane=map.getPane('assist-grid')??map.createPane('assist-grid');
  pane.style.zIndex='205';pane.style.pointerEvents='none';
  const canvas=L.DomUtil.create('canvas','ria-assist-grid leaflet-zoom-hide',pane) as HTMLCanvasElement;
  canvas.style.pointerEvents='none';let frame=0,lastDense:boolean|undefined;
  const draw=()=>{
    frame=0;const size=map.getSize(),ratio=window.devicePixelRatio||1;
    const width=Math.ceil(size.x*ratio),height=Math.ceil(size.y*ratio);
    if(canvas.width!==width)canvas.width=width;if(canvas.height!==height)canvas.height=height;
    canvas.style.width=size.x+'px';canvas.style.height=size.y+'px';
    L.DomUtil.setPosition(canvas,map.containerPointToLayerPoint(L.point(0,0)));
    const ctx=canvas.getContext('2d');if(!ctx)return;ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(0,0,size.x,size.y);
    const toScreen=(x:number,z:number)=>map.latLngToContainerPoint(projection.locationToLatLng(x,-64,z));
    const corners=[L.point(0,0),L.point(size.x,0),L.point(0,size.y),size].map(point=>projection.latLngToLocation(map.containerPointToLatLng(point),-64));
    const minX=Math.min(...corners.map(p=>p.x)),maxX=Math.max(...corners.map(p=>p.x)),minZ=Math.min(...corners.map(p=>p.z)),maxZ=Math.max(...corners.map(p=>p.z));
    const left=Math.floor((minX-grid.x)/grid.spacing)-1,right=Math.ceil((maxX-grid.x)/grid.spacing)+1,top=Math.floor((minZ-grid.z)/grid.spacing)-1,bottom=Math.ceil((maxZ-grid.z)/grid.spacing)+1;
    const a=toScreen(grid.x,grid.z),b=toScreen(grid.x+grid.spacing,grid.z),c=toScreen(grid.x,grid.z+grid.spacing);
    const area=Math.abs((b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x));
    const lineGap=Math.min(area/(Math.hypot(b.x-a.x,b.y-a.y)||1),area/(Math.hypot(c.x-a.x,c.y-a.y)||1));
    const dense=!Number.isFinite(lineGap)||lineGap<2||right-left+bottom-top>6000;
    if(dense!==lastDense){lastDense=dense;onDensity(dense);}if(dense)return;
    ctx.strokeStyle=grid.color;ctx.lineWidth=1;ctx.beginPath();
    const line=(x1:number,z1:number,x2:number,z2:number)=>{const a=toScreen(x1,z1),b=toScreen(x2,z2);ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);};
    for(let i=left;i<=right;i++)line(grid.x+i*grid.spacing,minZ-grid.spacing,grid.x+i*grid.spacing,maxZ+grid.spacing);
    for(let i=top;i<=bottom;i++)line(minX-grid.spacing,grid.z+i*grid.spacing,maxX+grid.spacing,grid.z+i*grid.spacing);
    ctx.stroke();
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(draw);};
  map.on('move zoom viewreset resize',schedule);schedule();
  return ()=>{map.off('move zoom viewreset resize',schedule);if(frame)cancelAnimationFrame(frame);canvas.remove();};
}
