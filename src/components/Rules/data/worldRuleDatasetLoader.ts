import type { ProgressCallback } from '@/lib/fetchWithMirror';
import { getRuleDataSourceSnapshot, type RuleDataSourceSnapshot } from './formalDataSourceRuntime';
import {
  abortActiveFormalDataRequests,
  loadFormalWorldFeatures,
  resolveFormalWorldRelease,
} from './formalReleaseReader';
import { isRuleWorldCacheValid, readRuleWorldCache, writeRuleWorldCache, type RuleCacheScope } from './worldRuleCache';
import type { RuleWorldDataset } from './sourceTypes';

function cacheScope(source: RuleDataSourceSnapshot, releaseId: string, worldId: string): RuleCacheScope { return {sourceId:source.sourceId,transportId:source.transportId,releaseId,worldId,readerSchemaVersion:source.readerSchemaVersion}; }
export type RuleWorldVersion = {
  formalVersion: string | null;
  releaseId: string;
};

export async function fetchWorldMergeVersion(
  worldId: string,
  _onProgress?: ProgressCallback,
  source: RuleDataSourceSnapshot = getRuleDataSourceSnapshot(worldId),
): Promise<RuleWorldVersion> {
  if (source.readerKind === 'formal-release-v2') {
    const release = await resolveFormalWorldRelease({ source, worldId });
    return { formalVersion: release.formalVersion === null ? null : String(release.formalVersion), releaseId: release.releaseId };
  }
  throw Error('已退役数据格式不能恢复；请选择现役正式数据源。');
}

export function abortActiveRuleDatasetRequests(): void {
  abortActiveFormalDataRequests();

}

export async function loadWorldRuleDataset(
  worldId: string,
  onProgress?: ProgressCallback,
  source: RuleDataSourceSnapshot = getRuleDataSourceSnapshot(worldId),
): Promise<RuleWorldDataset> {
  if (source.readerKind !== 'formal-release-v2') {
    throw Error('已退役数据格式不能加载；请选择现役正式数据源。');
  }

  const release = await resolveFormalWorldRelease({ source, worldId });
  const scope = cacheScope(source, release.releaseId, release.worldId);
  onProgress?.({ stage: 'world-cache-check', status: 'loading' });
  if (isRuleWorldCacheValid(scope)) {
    onProgress?.({ stage: 'world-cache-check', status: 'success' });
    const cached = readRuleWorldCache(scope);
    if (cached) return cached;
  } else {
    onProgress?.({ stage: 'world-cache-check', status: 'success', message: 'Cache requires refresh' });
  }

  const features = await loadFormalWorldFeatures({ source, release, onProgress });
  onProgress?.({ stage: 'world-cache-write', status: 'loading' });
  const dataset: RuleWorldDataset = {
    worldId: release.worldId,
    mergeVersion: release.releaseId,
    releaseId: release.releaseId,
    formalVersion: release.formalVersion ?? undefined,
    sourceId: source.sourceId,
    transportId: source.transportId,
    readerSchemaVersion: source.readerSchemaVersion,
    loadedAt: Date.now(),
    features,
  };
  writeRuleWorldCache(scope, dataset);
  onProgress?.({ stage: 'world-cache-write', status: 'success' });
  onProgress?.({ stage: 'world-ready', status: 'success' });
  return dataset;
}
