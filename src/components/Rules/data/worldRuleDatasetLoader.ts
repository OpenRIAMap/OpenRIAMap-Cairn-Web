import { createSharedReadPool } from '@/lib/sharedRead';
import type { LoadingProgress } from '@/lib/fetchWithMirror';
import {runtimeDatasetView} from '@/configRuntime/runtimeDataView';
import type { ProgressCallback } from '@/lib/fetchWithMirror';
import { getRuleDataSourceSnapshot, type RuleDataSourceSnapshot } from './formalDataSourceRuntime';
import {
  abortActiveFormalDataRequests,
  fetchFormalJson,
  loadFormalWorldFeatures,
  resolveFormalWorldRelease,
  assertFormalReleaseCurrent,
  formalReleaseMetadata,
  withStableFormalRelease,
  type FormalReleaseSet,
} from './formalReleaseReader';
import { isRuleWorldCacheValid, readRuleWorldCache, writeRuleWorldCache, type RuleCacheScope } from './worldRuleCache';
import type { RuleWorldDataset } from './sourceTypes';

function cacheScope(source: RuleDataSourceSnapshot, releaseId: string, worldId: string,release?:import('./formalReleaseReader').FormalWorldRelease): RuleCacheScope { return {sourceId:source.sourceId,transportId:source.transportId,releaseId,worldId,readerSchemaVersion:source.readerSchemaVersion,...(release?.effectiveReaderProtocol?{effectiveReaderProtocol:release.effectiveReaderProtocol,contentSha256:release.contentSha256}:{})}; }
/** A view normalizes World for the app; cache/warehouse records stay untouched. */
export function applicationWorldDataset(dataset:RuleWorldDataset,source:RuleDataSourceSnapshot,worldId:string):RuleWorldDataset {
  dataset={...dataset,sourceGeneration:source.generation};
  if(!source.resourceGroupId)return runtimeDatasetView(dataset);
  return runtimeDatasetView({...dataset,worldId,resourceGroupId:source.resourceGroupId,remoteWorldId:source.remoteWorldId,features:source.remoteWorldId&&source.remoteWorldId!==worldId?dataset.features.map(feature=>({...feature,World:worldId})):dataset.features});
}
export type RuleWorldVersion = {
  formalVersion: string | null;
  releaseId: string;
  publicationId?:string;
  publicationVersion?:number;
  bindingRevision?:number;
  contentSha256?:string;
  effectiveReaderProtocol?:string;
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
    return { formalVersion: release.formalVersion === null ? null : String(release.formalVersion), releaseId: release.releaseId,...formalReleaseMetadata(release) };
  }
  throw Error('已退役数据格式不能恢复；请选择现役正式数据源。');
}

export function abortActiveRuleDatasetRequests(worldIds?:readonly string[]): void {
  abortActiveFormalDataRequests(worldIds);

}

async function readWorldRuleDataset(
  worldId: string,
  onProgress: ProgressCallback | undefined,
  source: RuleDataSourceSnapshot,
  signal: AbortSignal,
): Promise<RuleWorldDataset> {
  if (source.readerKind !== 'formal-release-v2') {
    throw Error('已退役数据格式不能加载；请选择现役正式数据源。');
  }

  const fetchJson: import('./formalReleaseReader').FormalReleaseFetchJson = (key, stage, options) => fetchFormalJson(source, key, stage, {...options, signal});
  return withStableFormalRelease(async()=>{
  signal.throwIfAborted();
  onProgress?.({ stage: 'world-version', status: 'loading' });
  const release = await resolveFormalWorldRelease({ source, worldId, fetchJson });
  const scope = cacheScope(source, release.releaseId, worldId,release);
  onProgress?.({ stage: 'world-cache-check', status: 'loading' });
  if (isRuleWorldCacheValid(scope)) {
    onProgress?.({ stage: 'world-cache-check', status: 'success' });
    const cached = readRuleWorldCache(scope);
    if (cached && cached.features.length===release.worldManifest.featureCount) {await assertFormalReleaseCurrent({source,release,fetchJson});signal.throwIfAborted();const updated={...cached,formalVersion:release.formalVersion??undefined,...formalReleaseMetadata(release)};writeRuleWorldCache(scope,updated);return applicationWorldDataset(updated,source,worldId);}
  } else {
    onProgress?.({ stage: 'world-cache-check', status: 'success', message: 'Cache requires refresh' });
  }

  const features = await loadFormalWorldFeatures({ source, release, onProgress, fetchJson });
  onProgress?.({ stage: 'world-cache-write', status: 'loading' });
  const dataset: RuleWorldDataset = {
    worldId,
    mergeVersion: release.releaseId,
    releaseId: release.releaseId,
    formalVersion: release.formalVersion ?? undefined,
    ...formalReleaseMetadata(release),
    sourceId: source.sourceId,
    transportId: source.transportId,
    readerSchemaVersion: source.readerSchemaVersion,
    loadedAt: Date.now(),
    features,
  };
  signal.throwIfAborted();
  writeRuleWorldCache(scope, dataset);
  onProgress?.({ stage: 'world-cache-write', status: 'success' });
  onProgress?.({ stage: 'world-ready', status: 'success' });
  return applicationWorldDataset(dataset,source,worldId);
  });
}

export const ruleDatasetSourceKey = (worldId: string, source: RuleDataSourceSnapshot) => JSON.stringify([worldId,source.worldId,source.remoteWorldId,source.resourceGroupId,source.sourceId,source.transportId,source.rootUrl,source.generation,source.readerKind,source.readerSchemaVersion]);
export function datasetMatchesSource(dataset: RuleWorldDataset | undefined, worldId: string, source: RuleDataSourceSnapshot): dataset is RuleWorldDataset {
  return Boolean(dataset && dataset.worldId===worldId && dataset.sourceId===source.sourceId && dataset.transportId===source.transportId && dataset.readerSchemaVersion===source.readerSchemaVersion && dataset.sourceGeneration===source.generation && dataset.resourceGroupId===source.resourceGroupId && dataset.remoteWorldId===source.remoteWorldId && dataset.releaseId);
}
const sharedDatasetRead = createSharedReadPool<RuleWorldDataset, LoadingProgress>();
export function loadWorldRuleDataset(worldId: string, onProgress?: ProgressCallback, source = getRuleDataSourceSnapshot(worldId), options: {signal?: AbortSignal} = {}): Promise<RuleWorldDataset> {
  return sharedDatasetRead(ruleDatasetSourceKey(worldId,source), (signal,emit) => readWorldRuleDataset(worldId,emit,source,signal),options.signal,onProgress);
}
