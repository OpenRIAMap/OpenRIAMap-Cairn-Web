import { getApplicationSettings, applicationWorld } from '@/core/project/applicationRuntime';
export function resolveWorldDirName(world:string|number):string {
  const raw=String(world??'').trim();return getApplicationSettings().worlds.find(item=>item.id===raw||String(item.numericCode)===raw||item.prefix.toLowerCase()===raw.toLowerCase())?.id??(raw||applicationWorld('').id);
}
