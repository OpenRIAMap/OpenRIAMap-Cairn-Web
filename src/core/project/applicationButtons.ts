import type { ApplicationButtons } from './applicationTypes';
/** The editor simulation and production toggles use this same bounded transition. */
export function transitionApplicationButtons(current:string[],id:string,config:ApplicationButtons):string[]{
  const known=new Map(config.items.map(item=>[item.id,item]));if(!known.has(id))return current.filter(item=>known.has(item));
  let next=[...new Set(current.filter(item=>known.has(item)))];const enable=!next.includes(id);
  const visited=new Set<string>();
  const update=(target:string,on:boolean)=>{
    if(!known.has(target)||visited.has(target+':'+on))return;visited.add(target+':'+on);const button=known.get(target)!,behavior=button.behavior;
    next=next.filter(item=>item!==target);if(on)next.push(target);
    if(on){for(const other of config.items)if(behavior?.exclusiveWith?.includes(other.id)||behavior?.exclusiveGroup&&behavior.exclusiveGroup===other.behavior?.exclusiveGroup&&other.id!==target)update(other.id,false);for(const other of behavior?.disableWhenEnabled??[])update(other,false);for(const other of behavior?.enableWhenEnabled??[])update(other,true);}
    for(const relation of behavior?.linkedButtons??[])if(relation.mode==='mirrorThisState')update(relation.targetId,on);else if(on)update(relation.targetId,relation.mode==='enableWhenThisEnabled');
  };
  update(id,enable);return config.maxActive>0?next.slice(-config.maxActive):next;
}
