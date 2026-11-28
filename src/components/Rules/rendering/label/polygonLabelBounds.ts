type Point={x:number;y:number};
type Rect={x:number;y:number;w:number;h:number};
const cross=(a:Point,b:Point,c:Point)=>(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);
function inside(point:Point,ring:Point[]):boolean{
  let hit=false;
  for(let i=0,j=ring.length-1;i<ring.length;j=i++){
    const a=ring[j],b=ring[i];
    if(Math.abs(cross(a,b,point))<1e-6&&point.x>=Math.min(a.x,b.x)-1e-6&&point.x<=Math.max(a.x,b.x)+1e-6&&point.y>=Math.min(a.y,b.y)-1e-6&&point.y<=Math.max(a.y,b.y)+1e-6)return true;
    if((a.y>point.y)!==(b.y>point.y)&&point.x<(b.x-a.x)*(point.y-a.y)/(b.y-a.y)+a.x)hit=!hit;
  }
  return hit;
}
function crosses(a:Point,b:Point,c:Point,d:Point){return cross(a,b,c)*cross(a,b,d)<-1e-8&&cross(c,d,a)*cross(c,d,b)<-1e-8;}
/** A single part must contain the complete painted rectangle, including its edges. */
export function polygonLabelContainment(parts:Point[][][]){
  const contains=(point:Point,rings:Point[][])=>Boolean(rings[0]?.length&&inside(point,rings[0])&&!rings.slice(1).some(hole=>inside(point,hole)));
  return {
    point:(point:Point)=>parts.some(rings=>contains(point,rings)),
    rect:(rect:Rect)=>{
      const corners=[{x:rect.x,y:rect.y},{x:rect.x+rect.w,y:rect.y},{x:rect.x+rect.w,y:rect.y+rect.h},{x:rect.x,y:rect.y+rect.h}];
      return parts.some(rings=>corners.every(point=>contains(point,rings))&&!rings.some(ring=>ring.some((a,index)=>{
        const b=ring[(index+1)%ring.length];
        // A hole wholly inside the rectangle has no edge crossing and still excludes it.
        if(a.x>rect.x&&a.x<rect.x+rect.w&&a.y>rect.y&&a.y<rect.y+rect.h)return true;
        return corners.some((c,i)=>crosses(a,b,c,corners[(i+1)%corners.length]));
      })));
    },
  };
}
