import { loadRuleItemsForWorld, normalizeRuleSourceWorldId } from '@/components/Rules/data/ruleDataSources';
import {
  bumpTemporaryRuleDeleteIdsRevision,
  bumpTemporaryRuleOverrideIdsRevision,
  bumpTemporaryRuleSourcesRevision,
  readTemporaryRuleDeleteIdsForWorld,
  readTemporaryRuleOverrideIdsForWorld,
  readTemporaryRuleSourcesForWorld,
  temporaryRuleRevisions,
} from '@/components/Rules/data/temporaryRuleSession';

export type TempRuleSource = {
  uid: string;
  worldId: string;
  label?: string;
  enabled: boolean;
  items: any[];
};

export type EffectiveRuleItemsResult = {
  worldId: string;
  items: any[];
  enabledTempSources: TempRuleSource[];
  overrideIds: Set<string>;
  deleteIds: Set<string>;
  signature: string;
  sourceRevision: string;
  overrideRevision: string;
  deleteRevision: string;
};

function hashString(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
  return String(h >>> 0);
}

function readTempSources(worldId: string): TempRuleSource[] {
  return readTemporaryRuleSourcesForWorld(worldId)
    .filter((x) => x && typeof x === 'object')
    .map((x) => ({ uid: String(x.uid ?? ''), worldId: String(x.worldId ?? worldId), label: typeof x.label === 'string' ? x.label : undefined, enabled: Boolean(x.enabled), items: Array.isArray(x.items) ? x.items : [] }))
    .filter((x) => x.uid && x.worldId === worldId);
}

function readOverrideIds(worldId: string): Set<string> {
  return readTemporaryRuleOverrideIdsForWorld(worldId);
}

function readTempDeleteIds(worldId: string): Set<string> {
  return readTemporaryRuleDeleteIdsForWorld(worldId);
}

function buildSignature(worldId: string, enabledTemps: TempRuleSource[], overrideIds: Set<string>, deleteIds: Set<string>, sourceRevision: string, overrideRevision: string, deleteRevision: string): string {
  const tempMeta = enabledTemps.map((t) => ({ uid: t.uid, enabled: !!t.enabled, count: Array.isArray(t.items) ? t.items.length : 0 }));
  const rawTempMeta = (() => {
    try { return JSON.stringify(tempMeta); } catch { return ''; }
  })();
  const rawOverride = (() => {
    try { return JSON.stringify(Array.from(overrideIds).sort()); } catch { return ''; }
  })();
  const rawDelete = (() => {
    try { return JSON.stringify(Array.from(deleteIds).sort()); } catch { return ''; }
  })();
  return `eff::${worldId}::temp=${hashString(rawTempMeta)}::srcRev=${sourceRevision}::ovr=${hashString(rawOverride)}::ovrRev=${overrideRevision}::del=${hashString(rawDelete)}::delRev=${deleteRevision}`;
}

export async function loadEffectiveRuleItemsForWorld(
  worldId: string,
  opt?: { fetcher?: (url: string) => Promise<any[]> },
): Promise<EffectiveRuleItemsResult> {
  const wid = normalizeRuleSourceWorldId(worldId);
  const baseItems = await loadRuleItemsForWorld(wid, { fetcher: opt?.fetcher });
  const enabledTempSources = readTempSources(wid).filter((t) => t.enabled);
  const overrideIds = enabledTempSources.length > 0 ? readOverrideIds(wid) : new Set<string>();
  const deleteIds = enabledTempSources.length > 0 ? readTempDeleteIds(wid) : new Set<string>();
  const revisions = temporaryRuleRevisions();
  const sourceRevision = enabledTempSources.length > 0 ? revisions.sourceRevision : '';
  const overrideRevision = enabledTempSources.length > 0 || overrideIds.size > 0 ? revisions.overrideRevision : '';
  const deleteRevision = deleteIds.size > 0 ? revisions.deleteRevision : '';
  const excludeIds = new Set<string>([...overrideIds, ...deleteIds]);

  const items: any[] = [];
  for (const it of baseItems) {
    const id = String((it as any)?.ID ?? '').trim();
    if (id && excludeIds.has(id)) continue;
    items.push(it);
  }
  for (const src of enabledTempSources) {
    for (const it of src.items ?? []) items.push(it);
  }

  return {
    worldId: wid,
    items,
    enabledTempSources,
    overrideIds,
    deleteIds,
    sourceRevision,
    overrideRevision,
    deleteRevision,
    signature: buildSignature(wid, enabledTempSources, overrideIds, deleteIds, sourceRevision, overrideRevision, deleteRevision),
  };
}

export function bumpTempRuleSourcesRevision(): string {
  return bumpTemporaryRuleSourcesRevision();
}

export function bumpTempRuleOverrideIdsRevision(): string {
  return bumpTemporaryRuleOverrideIdsRevision();
}

export function bumpTempRuleDeleteIdsRevision(): string {
  return bumpTemporaryRuleDeleteIdsRevision();
}
