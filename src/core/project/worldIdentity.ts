import { applicationWorld, getApplicationSettings } from './applicationRuntime';

/** Pure world identity resolution; no dataset loaders, stores or browser I/O. */
export function normalizeRuleSourceWorldId(worldId: string): string {
  const raw=String(worldId??'').trim(),worlds=getApplicationSettings().worlds;
  return worlds.find(world=>world.id.toLowerCase()===raw.toLowerCase()||world.prefix.toLowerCase()===raw.toLowerCase()||String(world.numericCode)===raw||world.label.zh===raw||world.label.en&&world.label.en===raw)?.id??(raw||applicationWorld('').id);
}
