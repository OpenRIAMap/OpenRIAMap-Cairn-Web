import { getApplicationGeneration, applicationWorld } from '@/core/project/applicationRuntime';
import {
  createBrowserDataSourceSelectionStorage,
  createDataSourceSelectionController,
  parseDataSourceSelectionConfig,
  type DataSourceSelectionController,
  type DataSourceSelectionPolicy,
} from '@/core/dataSourceSelection';
import { getOpenRIAMapFormalDataSourceRuntimeConfig } from '@/core/project/openriamapRiaEnvironment';
import { buildRawCompatibleUrlFromParts, getCurrentSourceLinkMode } from './sourceLinkModes';

export type RuleDataSourceSnapshot = {
  worldId?:string;
  sourceId: string;
  label: string;
  readerKind: string;
  readerSchemaVersion: string;
  rootUrl: string;
  mediaRootUrl: string | null;
  transportId: string;
  generation: number;
};

let runtimeConfig = getOpenRIAMapFormalDataSourceRuntimeConfig();
let selectionConfig = parseDataSourceSelectionConfig(runtimeConfig.selection);
let bindingsById = new Map(runtimeConfig.bindings.map((binding) => [String(binding.id).trim(), binding]));
let githubRawTransport = runtimeConfig.githubRawTransport;

for (const source of selectionConfig.sources) {
  const binding = bindingsById.get(source.id);
  if (!binding) throw new Error(`openriamap-formal-data-source:binding-missing:${source.id}`);
  if (binding.readerKind !== source.readerKind) {
    throw new Error(`openriamap-formal-data-source:reader-kind-mismatch:${source.id}`);
  }
  if (!String(binding.rootUrl ?? '').trim() || !String(binding.readerSchemaVersion ?? '').trim()) {
    throw new Error(`openriamap-formal-data-source:binding-invalid:${source.id}`);
  }
  if (binding.transport === 'github-raw-compatible' && !githubRawTransport?.sourceIds.includes(source.id)) {
    throw new Error(`openriamap-formal-data-source:github-raw-transport-unbound:${source.id}`);
  }
}

if (githubRawTransport) {
  const repository = githubRawTransport.repository;
  if (!Array.isArray(githubRawTransport.sourceIds) || !githubRawTransport.sourceIds.length || !String(repository?.owner ?? '').trim() || !String(repository?.repo ?? '').trim() || !String(repository?.branch ?? '').trim()) {
    throw new Error('openriamap-formal-data-source:github-raw-transport-invalid');
  }
}

let selectionController: DataSourceSelectionController = createDataSourceSelectionController({
  sources: selectionConfig.sources,
  policy: selectionConfig.policy,
  storage: createBrowserDataSourceSelectionStorage(),
  storageKey: selectionConfig.storageKey,
});

let applicationEpoch=getApplicationGeneration();
function refreshApplicationSource(){
  if(applicationEpoch===getApplicationGeneration())return;
  applicationEpoch=getApplicationGeneration();runtimeConfig=getOpenRIAMapFormalDataSourceRuntimeConfig();selectionConfig=parseDataSourceSelectionConfig(runtimeConfig.selection);bindingsById=new Map(runtimeConfig.bindings.map(binding=>[binding.id,binding]));githubRawTransport=runtimeConfig.githubRawTransport;
  selectionController=createDataSourceSelectionController({sources:selectionConfig.sources,policy:selectionConfig.policy,storage:createBrowserDataSourceSelectionStorage(),storageKey:selectionConfig.storageKey});
}
export function getRuleDataSourceSelectionController(): DataSourceSelectionController {
  refreshApplicationSource();return selectionController;
}

export function getRuleDataSourceSelectionPolicy(): DataSourceSelectionPolicy {
  refreshApplicationSource();return { ...selectionConfig.policy };
}

export function isFormalGithubTransportSource(sourceId: string | null | undefined): boolean {
  refreshApplicationSource();return !!sourceId && !!githubRawTransport?.sourceIds.includes(String(sourceId));
}

export function getFormalGithubTransportSourceIds(): string[] {
  refreshApplicationSource();return [...(githubRawTransport?.sourceIds ?? [])];
}

function resolveRootUrl(sourceId: string, fallbackRootUrl: string): { rootUrl: string; transportId: string } {
  if (!isFormalGithubTransportSource(sourceId) || !githubRawTransport) {
    const rootUrl = fallbackRootUrl.replace(/\/+$/, '');
    return { rootUrl, transportId: `direct:${rootUrl}` };
  }
  const mode = getCurrentSourceLinkMode();
  const rootUrl = buildRawCompatibleUrlFromParts(mode.rawCompatibleBaseUrl, {
    owner: githubRawTransport.repository.owner,
    repo: githubRawTransport.repository.repo,
    branch: githubRawTransport.repository.branch,
    path: '',
  }).replace(/\/+$/, '');
  return { rootUrl, transportId: `github-raw-compatible:${mode.id}:${rootUrl}` };
}

export function getRuleDataSourceSnapshot(worldId?:string): RuleDataSourceSnapshot {
  refreshApplicationSource();const state = selectionController.getState();
  const sourceId=worldId&&state.sourceId===selectionConfig.policy.defaultSourceId?applicationWorld(worldId).dataSourceId:state.sourceId;
  const source = selectionConfig.sources.find((item) => item.id === sourceId);
  const binding = bindingsById.get(sourceId);
  if (!source || !binding) throw new Error(`openriamap-formal-data-source:active-source-invalid:${state.sourceId}`);
  const transport = resolveRootUrl(source.id, String(binding.rootUrl).trim());
  return {
    ...(worldId?{worldId}:{}),
    sourceId: source.id,
    label: source.label,
    readerKind: source.readerKind,
    readerSchemaVersion: String(binding.readerSchemaVersion).trim(),
    rootUrl: transport.rootUrl,
    mediaRootUrl: String(binding.mediaRootUrl ?? '').trim().replace(/\/+$/, '') || null,
    transportId: transport.transportId,
    generation: applicationEpoch * 1000000 + state.generation,
  };
}

export function retiredSourceNotice():string {
  try{const raw=localStorage.getItem(selectionConfig.storageKey);if(raw&&JSON.parse(raw).sourceId==='legacy-github')return '旧兼容数据源已退役。当前仅提供现役正式来源；请确认来源并显式应用，旧缓存不会重新启用旧接口。';}catch{}return '';
}
