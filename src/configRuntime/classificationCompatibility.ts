import type { ClassificationPath, ConfigPackageV3 } from '../configStudio/types';
const indexes=new WeakMap<ConfigPackageV3,Set<string>>();
const key=(path:ClassificationPath)=>JSON.stringify([path.class,path.kind??'',path.skind??'',path.skind2??'']);
/** Explicit pre-V3 road placeholder compatibility; arbitrary unknown paths
 * never fall through to a parent/default category. Prefer a real exact node. */
export function readableClassification(config:ConfigPackageV3,raw:ClassificationPath):ClassificationPath|undefined {
  let paths=Object.isFrozen(config)?indexes.get(config):undefined;
  if(!paths){paths=new Set(config.nodes.map(node=>key(node.path)));if(Object.isFrozen(config))indexes.set(config,paths);}
  if(paths.has(key(raw)))return raw;
  if(raw.class==='ROD'&&raw.kind&&(!raw.skind||raw.skind==='NOM')&&(!raw.skind2||raw.skind2==='NOM')){
    const candidate={class:raw.class,kind:raw.kind};
    if(paths.has(key(candidate)))return candidate;
  }
  return undefined;
}
