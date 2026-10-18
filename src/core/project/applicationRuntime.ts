import { validateApplication } from './applicationValidation';
import type { ApplicationModuleId, ApplicationSettings, ResolvedApplicationSettings, ResolvedApplicationWorld } from './applicationTypes';
import { isWorldGroups, resourceGroupForWorld, resolveApplicationSettings } from './applicationResources';
import { defaultApplicationSettings } from './applicationDefaults';
let current:ApplicationSettings=defaultApplicationSettings(),resolved:ResolvedApplicationSettings=resolveApplicationSettings(current),generation=0;
const listeners=new Set<()=>void>(),guards=new Set<(next:ApplicationSettings)=>Promise<boolean>>();
export const getApplicationSettings=()=>resolved;
export const getApplicationDefinition=()=>current;
export const getApplicationGeneration=()=>generation;
export const subscribeApplication=(listener:()=>void)=>{listeners.add(listener);return()=>{listeners.delete(listener);};};
export const registerApplicationGuard=(guard:(next:ApplicationSettings)=>Promise<boolean>)=>{guards.add(guard);return()=>{guards.delete(guard);};};
export async function checkApplicationTransition(next:ApplicationSettings):Promise<void>{if(JSON.stringify(next)===JSON.stringify(current))return;for(const guard of guards)if(!await guard(next))throw Error('总体规则应用已取消，当前工作区草稿保持原状。');}
export function applyApplicationSettings(next?:ApplicationSettings):void {
  const value=next??defaultApplicationSettings();const issues=validateApplication(value);if(issues.length)throw Error(issues.map(issue=>issue.message).join('；'));if(JSON.stringify(value)===JSON.stringify(current))return;
  current=structuredClone(value);resolved=resolveApplicationSettings(current);generation++;for(const listener of listeners)listener();
  if(typeof window!=='undefined')window.dispatchEvent(new CustomEvent('cairn:application-change',{detail:{generation}}));
}
export const moduleEnabled=(id:ApplicationModuleId)=>current.modules.items.find(item=>item.id===id)?.enabled===true;
export function enabledApplicationWorldId(id:string):string{return current.worlds.find(world=>world.id===id&&world.enabled)?.id??current.worlds.find(world=>world.enabled&&world.default)!.id;}
export function applicationWorldCodeMap():Record<string,number>{return Object.fromEntries(current.worlds.flatMap(world=>[[world.id,world.numericCode],[world.id.toLowerCase(),world.numericCode],[world.prefix,world.numericCode],[world.prefix.toLowerCase(),world.numericCode],[String(world.numericCode),world.numericCode]]));}
export function applicationWorldPrefixMap():Record<number,string>{return Object.fromEntries(current.worlds.map(world=>[world.numericCode,world.prefix]));}
export function applicationWorld(id:string):ResolvedApplicationWorld {
  const value=resolved.worlds.find(world=>world.id===id)||resolved.worlds.find(world=>world.enabled&&world.default)||resolved.worlds.find(world=>world.enabled);if(!value)throw Error('没有已启用世界。');return value;
}
export function worldUsesSharedInterfaces(worldId:string):boolean {
  return !isWorldGroups(current.sources)||current.worlds.some(world=>world.id===worldId)&&resourceGroupForWorld(current,worldId)?.id===(current.sources.sharedInterfaceGroupId??current.sources.defaultGroupId);
}
export function assertReviewWorldContext(payload:unknown,requireContext=false):void {
  if(!isWorldGroups(current.sources)||current.sources.groups.length<=1)return;
  let found=false,budget=10000;
  const check=(value:unknown)=>{if(typeof value!=='string'&&typeof value!=='number')return;const world=current.worlds.find(world=>world.id===String(value)||String(world.numericCode)===String(value));if(world){found=true;if(!worldUsesSharedInterfaces(world.id))throw Error(`世界 ${world.id} 所属来源组尚未绑定审核服务。`);}};
  const visit=(value:unknown,depth:number)=>{if(depth>16||--budget<0)throw Error('审核来源上下文过大，无法确认目标。');if(Array.isArray(value)){for(const row of value)visit(row,depth+1);return;}if(!value||typeof value!=='object')return;for(const [key,row] of Object.entries(value)){if(key==='worldId'||key==='World')check(row);else if((key==='worldIds'||key==='worlds')&&Array.isArray(row))row.forEach(check);if(row&&typeof row==='object')visit(row,depth+1);}};
  visit(payload,0);
  if(requireContext&&current.sources.groups.length>1&&!found)throw Error('多服务器上传缺少可确认的世界归属，不能发送到默认审核服务器。');
}
export function reviewEndpoint(key:'start'|'session'|'logout'|'control'|'workflow'|'publicReleases',worldId?:string):string {
  if(worldId&&!worldUsesSharedInterfaces(worldId))throw Error('此来源组尚未绑定审核服务，不能发送到其他服务器的审核接口。');
  if(!current.review.enabled||!moduleEnabled(key==='publicReleases'?'publicReleases':'review'))throw Error('审核远端功能未启用。');
  const path=key==='start'||key==='session'||key==='logout'?current.review.auth[key]:current.review[key];
  if(!path.trim())throw Error('审核接口尚未配置。');return path;
}
