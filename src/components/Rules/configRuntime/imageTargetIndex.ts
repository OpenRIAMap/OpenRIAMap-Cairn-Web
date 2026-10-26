import type { FeatureStore } from '../data/featureStore';
import type { FeatureRecord } from '../rendering/renderPrimitives';
import { normalizeRuleSourceWorldId } from '../data/ruleDataSources';
const indexes = new WeakMap<FeatureStore, Map<string, Map<string, FeatureRecord[]>>>();
const worldOf = (record: FeatureRecord, active: string) => normalizeRuleSourceWorldId(String(record.featureInfo?.World ?? record.meta.World ?? active));
/** A store belongs to the active world resource source; the index additionally partitions world tags.
 * Duplicate IDs across classifications are deliberately ambiguous, never first-match. */
export function uniqueImageTarget(store: FeatureStore | undefined, source: FeatureRecord, activeWorld: string, id: unknown): FeatureRecord | undefined {
  if (!store || typeof id !== 'string' && typeof id !== 'number' || String(id).trim() === '') return undefined;
  let index = indexes.get(store);
  if (!index) {
    index = new Map(); indexes.set(store, index);
    for (const target of store.all) {
      const world = worldOf(target, activeWorld), key = String(target.featureInfo?.ID ?? target.meta.idValue ?? '');
      const partition = index.get(world) ?? new Map<string, FeatureRecord[]>(); index.set(world, partition);
      partition.set(key, [...partition.get(key) ?? [], target]);
    }
  }
  const matches = index.get(worldOf(source, activeWorld))?.get(String(id));
  return matches?.length === 1 ? matches[0] : undefined;
}
