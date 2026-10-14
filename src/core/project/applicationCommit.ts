import type { ApplicationSection, ApplicationSettings } from './applicationTypes';
export function mergeApplicationSection(current:ApplicationSettings,section:ApplicationSection,value:ApplicationSettings[ApplicationSection],baseline:string):ApplicationSettings {
  if(JSON.stringify(current[section])!==baseline)throw Error('本模块活动版本已变化，请重新读取；未覆盖其他模块。');
  return {...current,[section]:structuredClone(value)};
}
export function applicationIdentityImpact(before:ApplicationSettings,after:ApplicationSettings):string[]{
  const changes:string[]=[];
  for(const [key,rows,next] of [['世界',before.worlds,after.worlds],['按钮',before.buttons.items,after.buttons.items],['来源',before.sources.items,after.sources.items]] as const){
    for(const row of rows)if(!next.some(item=>item.id===row.id))changes.push(`${key} ${row.id} 将移除：相关数据、分享链接、默认绑定或已记忆状态需要重新确认。`);
  }
  for(const world of before.worlds){const next=after.worlds.find(item=>item.id===world.id);if(next&&(world.prefix!==next.prefix||world.numericCode!==next.numericCode))changes.push(`世界 ${world.id} 简称/编号变化：仅影响后续输入和 ID 组装，不会改写已有 record。`);}
  return changes;
}
