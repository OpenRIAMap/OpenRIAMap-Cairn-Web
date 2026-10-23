/** Offset a convex regular/square outline; no projection and no per-marker SVG mask. */
export function convexHaloRing(vertices:Array<[number,number]>,inner:number,outer:number,join:string):string{
 const contour=(distance:number)=>{
  if(distance===0)return 'M'+vertices.map(point=>point.join(' ')).join('L')+'Z';
  const normal=(a:[number,number],b:[number,number])=>{const dx=b[0]-a[0],dy=b[1]-a[1],n=Math.hypot(dx,dy);return [dy/n,-dx/n];};
  return vertices.map((point,index)=>{
   const prev=normal(vertices[(index+vertices.length-1)%vertices.length],point),next=normal(point,vertices[(index+1)%vertices.length]);
   const a=[point[0]+prev[0]*distance,point[1]+prev[1]*distance],b=[point[0]+next[0]*distance,point[1]+next[1]*distance];
   if(join==='miter'){const scale=distance/(1+prev[0]*next[0]+prev[1]*next[1]);return (index?'L':'M')+[point[0]+(prev[0]+next[0])*scale,point[1]+(prev[1]+next[1])*scale].join(' ');}
   return (index?'L':'M')+a.join(' ')+(join==='bevel'?'L'+b.join(' '):`A${distance} ${distance} 0 0 1 ${b.join(' ')}`);
  }).join('')+'Z';
 };
 return contour(outer)+' '+contour(inner);
}
