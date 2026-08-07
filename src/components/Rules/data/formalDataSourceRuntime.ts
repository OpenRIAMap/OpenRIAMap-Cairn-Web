import {
  createBrowserDataSourceSelectionStorage,
  createDataSourceSelectionController,
  parseDataSourceSelectionConfig,
  type DataSourceSelectionController,
  type DataSourceSelectionPolicy,
} from '@/core/dataSourceSelection';
import { getOpenRIAMapFormalDataSourceRuntimeConfig } from '@/core/project/openriamapRiaEnvironment';

export type RuleDataSourceSnapshot = {
  sourceId: string;
  label: string;
  readerKind: string;
  readerSchemaVersion: string;
  rootUrl: string;
  generation: number;
};

const runtimeConfig = getOpenRIAMapFormalDataSourceRuntimeConfig();
const selectionConfig = parseDataSourceSelectionConfig(runtimeConfig.selection);
const bindingsById = new Map(runtimeConfig.bindings.map((binding) => [String(binding.id).trim(), binding]));

for (const source of selectionConfig.sources) {
  const binding = bindingsById.get(source.id);
  if (!binding) throw new Error(`openriamap-formal-data-source:binding-missing:${source.id}`);
  if (binding.readerKind !== source.readerKind) {
    throw new Error(`openriamap-formal-data-source:reader-kind-mismatch:${source.id}`);
  }
  if (!String(binding.rootUrl ?? '').trim() || !String(binding.readerSchemaVersion ?? '').trim()) {
    throw new Error(`openriamap-formal-data-source:binding-invalid:${source.id}`);
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

export function getRuleDataSourceSnapshot(): RuleDataSourceSnapshot {
  const state = selectionController.getState();
  const source = selectionConfig.sources.find((item) => item.id === state.sourceId);
  const binding = bindingsById.get(state.sourceId);
  if (!source || !binding) throw new Error(`openriamap-formal-data-source:active-source-invalid:${state.sourceId}`);
  return {
    sourceId: source.id,
    label: source.label,
    readerKind: source.readerKind,
    readerSchemaVersion: String(binding.readerSchemaVersion).trim(),
    rootUrl: String(binding.rootUrl).trim().replace(/\/+$/, ''),
    generation: state.generation,
  };
}
