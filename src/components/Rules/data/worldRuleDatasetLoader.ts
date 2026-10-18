import {runtimeDatasetView} from '@/configRuntime/runtimeDataView';
import type { ProgressCallback } from '@/lib/fetchWithMirror';
import { getRuleDataSourceSnapshot, type RuleDataSourceSnapshot } from './formalDataSourceRuntime';
import {
  abortActiveFormalDataRequests,
  loadFormalWorldFeatures,
  resolveFormalWorldRelease,
  assertFormalReleaseCurrent,
  withStableFormalRelease,
  type FormalReleaseSet,
} from './formalReleaseReader';
import { isRuleWorldCacheValid, readRuleWorldCache, writeRuleWorldCache, type RuleCacheScope } from './worldRuleCache';
import type { RuleWorldDataset } from './sourceTypes';

function cacheScope(source: RuleDataSourceSnapshot, releaseId: string, worldId: string): RuleCacheScope { return {sourceId:source.sourceId,transportId:source.transportId,releaseId,worldId,readerSchemaVersion:source.readerSchemaVersion}; }
/** A view normalizes World for the app; cache/warehouse records stay untouched. */
export function applicationWorldDataset(dataset:RuleWorldDataset,source:RuleDataSourceSnapshot,worldId:string):RuleWorldDataset {
  if(!source.resourceGroupId)return runtimeDatasetView(dataset);
  return runtimeDatasetView({...dataset,worldId,resourceGroupId:source.resourceGroupId,remoteWorldId:source.remoteWorldId,features:source.remoteWorldId&&source.remoteWorldId!==worldId?dataset.features.map(feature=>({...feature,World:worldId})):dataset.features});
}
export type RuleWorldVersion = {
  formalVersion: string | null;
  releaseId: string;
};

export async function fetchWorldMergeVersion(
  worldId: string,
  _onProgress?: ProgressCallback,
  source: RuleDataSourceSnapshot = getRuleDataSourceSnapshot(worldId),
  releaseSet?: FormalReleaseSet,
): Promise<RuleWorldVersion> {
  if (source.readerKind === 'formal-release-v2') {
    let initialSet=releaseSet;
    const release = await withStableFormalRelease(async()=>{const selectedSet=initialSet;initialSet=undefined;const value=await resolveFormalWorldRelease({source,worldId,releaseSet:selectedSet});await assertFormalReleaseCurrent({source,release:value});return value;});
    return { formalVersion: release.formalVersion === null ? null : String(release.formalVersion), releaseId: release.releaseId };
  }
  throw Error('已退役数据格式不能恢复；请选择现役正式数据源。');
}

export function abortActiveRuleDatasetRequests(worldIds?:readonly string[]): void {
  abortActiveFormalDataRequests(worldIds);

}

export async function loadWorldRuleDataset(
  worldId: string,
  onProgress?: ProgressCallback,
  source: RuleDataSourceSnapshot = getRuleDataSourceSnapshot(worldId),
): Promise<RuleWorldDataset> {
  if (source.readerKind !== 'formal-release-v2') {
    throw Error('已退役数据格式不能加载；请选择现役正式数据源。');
  }

  return withStableFormalRelease(async()=>{
  const release = await resolveFormalWorldRelease({ source, worldId });
  const scope = cacheScope(source, release.releaseId, worldId);
  onProgress?.({ stage: 'world-cache-check', status: 'loading' });
  if (isRuleWorldCacheValid(scope)) {
    onProgress?.({ stage: 'world-cache-check', status: 'success' });
    const cached = readRuleWorldCache(scope);
    if (cached && cached.features.length===release.worldManifest.featureCount) {await assertFormalReleaseCurrent({source,release});return applicationWorldDataset(cached,source,worldId);}
  } else {
    onProgress?.({ stage: 'world-cache-check', status: 'success', message: 'Cache requires refresh' });
  }

  const features = await loadFormalWorldFeatures({ source, release, onProgress });
  onProgress?.({ stage: 'world-cache-write', status: 'loading' });
  const dataset: RuleWorldDataset = {
    worldId,
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
  return applicationWorldDataset(dataset,source,worldId);
  });
}
