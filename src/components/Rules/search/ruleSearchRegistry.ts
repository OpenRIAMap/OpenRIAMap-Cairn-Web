import type { FeatureRecord } from '@/components/Rules/rendering/renderPrimitives';
import { normalizeRuleSourceWorldId } from '@/components/Rules/data/ruleDataSources';

/**
 * 规则搜索池（供 SearchBar 使用）
 *
 * 设计目标：
 * - SearchBar 仅“读取快照”进行模糊检索；不订阅、不触发 React 状态，避免循环渲染/白屏。
 * - RuleDrivenLayer 在“预加载池”更新完成后写入快照（包含临时挂载启用的数据）。
 */

type RuleSearchSnapshot = {
  records: FeatureRecord[];
  updatedAt: number;
};

const POOL_BY_WORLD = new Map<string, RuleSearchSnapshot>();
const versions=new Map<string,number>();
const listeners=new Map<string,Set<()=>void>>();

export function setRuleSearchPool(worldId: string, records: FeatureRecord[]) {
  const key = normalizeRuleSourceWorldId(worldId);
  if (!key) return;
  const previous=POOL_BY_WORLD.get(key)?.records;
  if(previous===records||previous&&previous.length===records.length&&previous.every((record,index)=>record===records[index]))return;
  POOL_BY_WORLD.set(key, {
    records: Array.isArray(records) ? records : [],
    updatedAt: Date.now(),
  });
  versions.set(key,(versions.get(key)??0)+1);listeners.get(key)?.forEach(listener=>listener());
}
export function subscribeRuleSearchPool(worldId:string,listener:()=>void):()=>void {
  const key=normalizeRuleSourceWorldId(worldId),group=listeners.get(key)??new Set();group.add(listener);listeners.set(key,group);return ()=>{group.delete(listener);if(!group.size)listeners.delete(key);};
}
export function getRuleSearchPoolVersion(worldId:string):number{return versions.get(normalizeRuleSourceWorldId(worldId))??0;}

export function getRuleSearchPool(worldId: string): FeatureRecord[] {
  const key = normalizeRuleSourceWorldId(worldId);
  if (!key) return [];
  return POOL_BY_WORLD.get(key)?.records ?? [];
}

export function getRuleSearchPoolUpdatedAt(worldId: string): number {
  const key = normalizeRuleSourceWorldId(worldId);
  if (!key) return 0;
  return POOL_BY_WORLD.get(key)?.updatedAt ?? 0;
}
