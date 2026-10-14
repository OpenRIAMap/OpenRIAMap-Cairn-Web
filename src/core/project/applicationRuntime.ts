import { validateApplication } from './applicationValidation';
import type { ApplicationModuleId, ApplicationSettings, ApplicationWorld } from './applicationTypes';
import { defaultApplicationSettings } from './applicationDefaults';
let current:ApplicationSettings=defaultApplicationSettings(),generation=0;
const listeners=new Set<()=>void>(),guards=new Set<(next:ApplicationSettings)=>Promise<boolean>>();
export const getApplicationSettings=()=>current;
export const getApplicationGeneration=()=>generation;
export const subscribeApplication=(listener:()=>void)=>{listeners.add(listener);return()=>{listeners.delete(listener);};};
export const registerApplicationGuard=(guard:(next:ApplicationSettings)=>Promise<boolean>)=>{guards.add(guard);return()=>{guards.delete(guard);};};
export async function checkApplicationTransition(next:ApplicationSettings):Promise<void>{if(JSON.stringify(next)===JSON.stringify(current))return;for(const guard of guards)if(!await guard(next))throw Error('总体规则应用已取消，当前工作区草稿保持原状。');}
export function applyApplicationSettings(next?:ApplicationSettings):void {
  const value=next??defaultApplicationSettings();const issues=validateApplication(value);if(issues.length)throw Error(issues.map(issue=>issue.message).join('；'));if(JSON.stringify(value)===JSON.stringify(current))return;
  current=structuredClone(value);generation++;for(const listener of listeners)listener();
  if(typeof window!=='undefined')window.dispatchEvent(new CustomEvent('cairn:application-change',{detail:{generation}}));
}
export const moduleEnabled=(id:ApplicationModuleId)=>current.modules.items.find(item=>item.id===id)?.enabled===true;
export function applicationWorld(id:string):ApplicationWorld {
  const value=current.worlds.find(world=>world.id===id)||current.worlds.find(world=>world.enabled&&world.default)||current.worlds.find(world=>world.enabled);if(!value)throw Error('没有已启用世界。');return value;
}
export function reviewEndpoint(key:'start'|'session'|'logout'|'control'|'workflow'|'publicReleases'):string {
  if(!current.review.enabled||!moduleEnabled(key==='publicReleases'?'publicReleases':'review'))throw Error('审核远端功能未启用。');
  const path=key==='start'||key==='session'||key==='logout'?current.review.auth[key]:current.review[key];
  if(!path.trim())throw Error('审核接口尚未配置。');return path;
}
