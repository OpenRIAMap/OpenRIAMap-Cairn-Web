import type {Coordinate} from '@/types';
export const TELEPORT_HUB_RADIUS=100;
type Source={hub:string;node:number;coord:Coordinate};
/** World-local, transient index. Only actual trigger coordinates define coverage. */
export function buildTeleportHubIndex(sources:Source[],nodes:Coordinate[]){
 const groups=new Map<string,Set<number>>(),sourceGroups=new Map<number,Set<string>>(),grid=new Map<string,Source[]>(),cell=(n:number)=>Math.floor(n/TELEPORT_HUB_RADIUS);
 for(const source of sources){const hub=source.hub.trim();if(!hub)continue;const row={...source,hub},key=cell(row.coord.x)+':'+cell(row.coord.z);const bucket=grid.get(key)??[];bucket.push(row);grid.set(key,bucket);const members=groups.get(hub)??new Set<number>();members.add(row.node);groups.set(hub,members);}
 const hubsAt=(point:Coordinate)=>{const result=new Set<string>(),x=cell(point.x),z=cell(point.z);for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++)for(const row of grid.get((x+dx)+':'+(z+dz))??[])if((point.x-row.coord.x)**2+(point.z-row.coord.z)**2<=TELEPORT_HUB_RADIUS**2)result.add(row.hub);return result;};
 for(const [hub,members]of groups)for(const node of members){const tags=sourceGroups.get(node)??new Set<string>();tags.add(hub);sourceGroups.set(node,tags);}
 const groupNodes=new Map<string,Set<number>>();nodes.forEach((point,index)=>{for(const hub of hubsAt(point)){const members=groupNodes.get(hub)??new Set<number>();members.add(index);groupNodes.set(hub,members);}});
 const candidates=(point:Coordinate,includeArrivals=false)=>{const result=new Set<number>();for(const hub of hubsAt(point))for(const id of (includeArrivals?groupNodes:groups).get(hub)??[])result.add(id);return result;};
 // Expand only a visited vertex. Reverse source->arrival links preserve the
 // same bidirectional graph without materializing a quadratic hub clique.
 const neighbors=(node:number)=>{const result=candidates(nodes[node]);for(const hub of sourceGroups.get(node)??[])for(const id of groupNodes.get(hub)??[])result.add(id);result.delete(node);return result;};
 return {hubsAt,candidates,neighbors};
}
