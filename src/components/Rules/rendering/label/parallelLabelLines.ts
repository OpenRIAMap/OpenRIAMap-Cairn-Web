import * as L from 'leaflet';

export function parallelLabelPaths(map:L.Map,path:L.LatLng[],text:string,fontSize=14){
  const points=path.map(point=>map.latLngToContainerPoint(point));
  const a=points[0],b=points[points.length-1];
  if(!a||!b)return [];
  const length=Math.hypot(b.x-a.x,b.y-a.y)||1, nx=-(b.y-a.y)/length, ny=(b.x-a.x)/length;
  const lines=text.split('\n'),height=fontSize*1.35;
  return lines.map((line,index)=>({text:line||'\u00a0',path:points.map(point=>map.containerPointToLatLng(L.point(point.x+nx*(index-(lines.length-1)/2)*height,point.y+ny*(index-(lines.length-1)/2)*height)))}));
}

export function unionLabelRects(rects:Array<{x:number;y:number;w:number;h:number}>){
  const x=Math.min(...rects.map(r=>r.x)),y=Math.min(...rects.map(r=>r.y));
  return {x,y,w:Math.max(...rects.map(r=>r.x+r.w))-x,h:Math.max(...rects.map(r=>r.y+r.h))-y};
}
