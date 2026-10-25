import type { ReviewPackagePrecheckReport } from './contracts';

export type LocalFeatureIdentity = { worldId: string; classCode: string; featureId: string };
type Finding = ReviewPackagePrecheckReport['findings'][number];
const idKey = (item: LocalFeatureIdentity) => JSON.stringify([item.worldId, item.featureId]);
const exactKey = (item: LocalFeatureIdentity) => JSON.stringify([item.worldId, item.classCode, item.featureId]);

/** Browser snapshot advice only; the server rechecks the final atomic delta. */
export function checkLocalReviewDelta(upserts: LocalFeatureIdentity[], deletes: LocalFeatureIdentity[], snapshots: Map<string, LocalFeatureIdentity[]>): Finding[] {
  const findings: Finding[] = [];
  const add = (code: Finding['code'], severity: Finding['severity'], message: string) => findings.push({ code, severity, message });
  const seenUpserts = new Set<string>();
  for (const item of upserts) {
    const key = idKey(item);
    if (seenUpserts.has(key)) add('UPSERT_DUPLICATE', 'blocker', `同世界存在重复新增/修改 ID：${item.worldId}/${item.featureId}`);
    seenUpserts.add(key);
  }
  const removed = new Set<string>();
  const seenDeletes = new Set<string>();
  for (const item of deletes) {
    const key = exactKey(item);
    if (seenDeletes.has(key)) add('UPSERT_DUPLICATE', 'blocker', `存在重复删除目标：${item.worldId}/${item.classCode}/${item.featureId}`);
    seenDeletes.add(key);
    const source = snapshots.get(item.worldId);
    if (!source) continue;
    const matches = source.filter(record => record.featureId === item.featureId && (!item.classCode || record.classCode === item.classCode));
    if (matches.length === 0) add('DELETE_TARGET_MISSING', 'blocker', `删除目标不存在：${item.worldId}/${item.classCode}/${item.featureId}`);
    else if (matches.length > 1) add('DELETE_TARGET_AMBIGUOUS', 'blocker', `删除目标不唯一：${item.worldId}/${item.classCode}/${item.featureId}`);
    else if (removed.has(exactKey(matches[0]))) add('UPSERT_DUPLICATE', 'blocker', `多个删除标记指向同一记录：${item.worldId}/${item.featureId}`);
    else removed.add(exactKey(matches[0]));
  }
  for (const item of upserts) {
    const source = snapshots.get(item.worldId);
    if (!source) continue;
    const current = source.filter(record => record.featureId === item.featureId);
    const remaining = current.filter(record => !removed.has(exactKey(record)));
    if (remaining.some(record => record.classCode !== item.classCode) || remaining.length > 1) {
      add('UPSERT_DUPLICATE', 'blocker', `新增/修改 ID 与未删除的正式记录冲突：${item.worldId}/${item.featureId}`);
    } else if (current.length && !remaining.length) {
      add('UPSERT_OVERWRITES_CURRENT', 'warning', `同包先删除精确旧目标再重建：${item.worldId}/${item.featureId}；服务端仍会核验最终集合。`);
    } else if (remaining.length) {
      add('UPSERT_OVERWRITES_CURRENT', 'warning', `将覆盖同世界、同分类、同 ID 的正式记录：${item.worldId}/${item.classCode}/${item.featureId}`);
    }
  }
  return findings;
}
