import type { ApplicationSection, ApplicationSettings } from './applicationTypes';
import { defaultSourceSettings, isWorldGroups } from './applicationResources';
export function mergeApplicationSection(current:ApplicationSettings,section:ApplicationSection,value:ApplicationSettings[ApplicationSection],baseline:string):ApplicationSettings {
  if(JSON.stringify(current[section])!==baseline)throw Error('本模块活动版本已变化，请重新读取；未覆盖其他模块。');
  return {...current,[section]:structuredClone(value)};
}
export function applicationIdentityImpact(before:ApplicationSettings,after:ApplicationSettings):string[]{
  const changes:string[]=[];
  for(const [key,rows,next] of [['世界',before.worlds,after.worlds],['按钮',before.buttons.items,after.buttons.items],['来源',defaultSourceSettings(before).items,defaultSourceSettings(after).items]] as const){
    for(const row of rows)if(!next.some(item=>item.id===row.id))changes.push(`${key} ${row.id} 将移除：相关数据、分享链接、默认绑定或已记忆状态需要重新确认。`);
  }
  for(const world of before.worlds){const next=after.worlds.find(item=>item.id===world.id);if(next&&(world.prefix!==next.prefix||world.numericCode!==next.numericCode))changes.push(`世界 ${world.id} 简称/编号变化：仅影响后续输入和 ID 组装，不会改写已有 record。`);}
  if(isWorldGroups(before.sources)||isWorldGroups(after.sources)){
    const oldSources=before.sources,newSources=after.sources;
    for(const world of before.worlds){const next=after.worlds.find(row=>row.id===world.id);if(!next)continue;const from=isWorldGroups(oldSources)?oldSources.bindings[world.id]??oldSources.defaultGroupId:'legacy',to=isWorldGroups(newSources)?newSources.bindings[world.id]??newSources.defaultGroupId:'legacy';if(from!==to||world.remoteWorldId!==next.remoteWorldId)changes.push(`世界 ${world.id} 来源归属：${from} → ${to}，远端世界键 ${world.remoteWorldId??world.id} → ${next.remoteWorldId??next.id}；数据和瓦片将一起切换。`);}
    if(isWorldGroups(oldSources)&&isWorldGroups(newSources))for(const group of oldSources.groups){const next=newSources.groups.find(row=>row.id===group.id);if(!next)changes.push(`来源组 ${group.id} 将删除。`);else if(JSON.stringify({...group,label:undefined})!==JSON.stringify({...next,label:undefined}))changes.push(`来源组 ${group.id} 的链路或瓦片设置将更新，仅影响该组世界。`);}
  }
  return changes;
}
