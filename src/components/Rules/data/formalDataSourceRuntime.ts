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
  sourceId: string;
  label: string;
  readerKind: string;
  readerSchemaVersion: string;
  rootUrl: string;
  transportId: string;
  generation: number;
};

const runtimeConfig = getOpenRIAMapFormalDataSourceRuntimeConfig();
const selectionConfig = parseDataSourceSelectionConfig(runtimeConfig.selection);
const bindingsById = new Map(runtimeConfig.bindings.map((binding) => [String(binding.id).trim(), binding]));
const githubRawTransport = runtimeConfig.githubRawTransport;

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

const selectionController: DataSourceSelectionController = createDataSourceSelectionController({
  sources: selectionConfig.sources,
  policy: selectionConfig.policy,
  storage: createBrowserDataSourceSelectionStorage(),
  storageKey: selectionConfig.storageKey,
});

export function getRuleDataSourceSelectionController(): DataSourceSelectionController {
  return selectionController;
}

export function getRuleDataSourceSelectionPolicy(): DataSourceSelectionPolicy {
  return { ...selectionConfig.policy };
}

export function isFormalGithubTransportSource(sourceId: string | null | undefined): boolean {
  return !!sourceId && !!githubRawTransport?.sourceIds.includes(String(sourceId));
}

export function getFormalGithubTransportSourceIds(): string[] {
  return [...(githubRawTransport?.sourceIds ?? [])];
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
  return { rootUrl, transportId: `github-raw-compatible:${mode.id}` };
}

export function getRuleDataSourceSnapshot(): RuleDataSourceSnapshot {
  const state = selectionController.getState();
  const source = selectionConfig.sources.find((item) => item.id === state.sourceId);
  const binding = bindingsById.get(state.sourceId);
  if (!source || !binding) throw new Error(`openriamap-formal-data-source:active-source-invalid:${state.sourceId}`);
  const transport = resolveRootUrl(source.id, String(binding.rootUrl).trim());
  return {
    sourceId: source.id,
    label: source.label,
    readerKind: source.readerKind,
    readerSchemaVersion: String(binding.readerSchemaVersion).trim(),
    rootUrl: transport.rootUrl,
    transportId: transport.transportId,
    generation: state.generation,
  };
}
