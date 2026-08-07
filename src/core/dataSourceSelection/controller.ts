import {
  DATA_SOURCE_SELECTION_STATE_SCHEMA_VERSION,
  type DataSourceDefinition,
  type DataSourceSelectionApplyResult,
  type DataSourceSelectionContext,
  type DataSourceSelectionFailure,
  type DataSourceSelectionFailureStage,
  type DataSourceSelectionPolicy,
  type DataSourceSelectionState,
  type DataSourceSelectionStorage,
  type DataSourceSwitchPort,
} from './contracts';

export type DataSourceSelectionControllerOptions = {
  sources: readonly DataSourceDefinition[];
  policy: DataSourceSelectionPolicy;
  storage: DataSourceSelectionStorage;
  storageKey: string;
};

export type DataSourceSelectionController = {
  getState(): DataSourceSelectionState;
  getSources(): readonly DataSourceDefinition[];
  apply(sourceId: string, context: DataSourceSelectionContext, port: DataSourceSwitchPort): Promise<DataSourceSelectionApplyResult>;
};

type PersistedDataSourceSelection = {
  schemaVersion?: unknown;
  sourceId?: unknown;
};

function fail(message: string): never {
  throw new Error(`data-source-selection:${message}`);
}

function normalizedId(value: string): string {
  return String(value ?? '').trim();
}

function isEnabled(source: DataSourceDefinition): boolean {
  return source.enabled !== false;
}

function isSelectable(source: DataSourceDefinition): boolean {
  return isEnabled(source) && source.selectable !== false;
}

export function validateDataSourceSelectionConfig(
  sources: readonly DataSourceDefinition[],
  policy: DataSourceSelectionPolicy,
): void {
  if (!Array.isArray(sources) || sources.length === 0) fail('sources-required');
  if (policy.automaticFallback !== false) fail('automatic-fallback-must-be-disabled');
  if (policy.clearCacheOnApply !== 'source-dependent') fail('unsupported-cache-clear-policy');
  if (!['fixed', 'user-select', 'user-select-on-failure'].includes(policy.selectionMode)) fail('unsupported-selection-mode');

  const seen = new Set<string>();
  for (const source of sources) {
    const id = normalizedId(source.id);
    if (!id) fail('source-id-required');
    if (seen.has(id)) fail(`duplicate-source-id:${id}`);
    if (!String(source.label ?? '').trim()) fail(`source-label-required:${id}`);
    if (!String(source.readerKind ?? '').trim()) fail(`source-reader-kind-required:${id}`);
    seen.add(id);
  }

  const defaultSource = sources.find((source) => normalizedId(source.id) === normalizedId(policy.defaultSourceId));
  if (!defaultSource || !isEnabled(defaultSource)) fail('default-source-must-be-enabled');
}

export function isDataSourceSelectionAllowed(
  policy: DataSourceSelectionPolicy,
  context: DataSourceSelectionContext,
): boolean {
  if (policy.selectionMode === 'fixed') return false;
  return policy.selectionMode === 'user-select' || context === 'failure';
}

export function createDataSourceSelectionFailure(input: {
  sourceId: string;
  stage?: DataSourceSelectionFailureStage;
  message: string;
  retryAllowed?: boolean;
  worldId?: string;
}): DataSourceSelectionFailure {
  return {
    sourceId: normalizedId(input.sourceId),
    stage: input.stage ?? 'unknown',
    message: String(input.message ?? '').trim() || 'Data source request failed.',
    retryAllowed: input.retryAllowed !== false,
    ...(input.worldId ? { worldId: normalizedId(input.worldId) } : {}),
  };
}

function readPersistedSourceId(storage: DataSourceSelectionStorage, storageKey: string): string | null {
  try {
    const raw = storage.read(storageKey);
    if (!raw) return null;
    const value = JSON.parse(raw) as PersistedDataSourceSelection;
    if (value.schemaVersion !== DATA_SOURCE_SELECTION_STATE_SCHEMA_VERSION || typeof value.sourceId !== 'string') return null;
    return normalizedId(value.sourceId) || null;
  } catch {
    return null;
  }
}

function persistState(storage: DataSourceSelectionStorage, storageKey: string, state: DataSourceSelectionState): void {
  storage.write(storageKey, JSON.stringify({
    schemaVersion: DATA_SOURCE_SELECTION_STATE_SCHEMA_VERSION,
    sourceId: state.sourceId,
  }));
}

export function createDataSourceSelectionController(options: DataSourceSelectionControllerOptions): DataSourceSelectionController {
  const sources = options.sources.map((source) => ({ ...source, id: normalizedId(source.id) }));
  const policy = { ...options.policy, defaultSourceId: normalizedId(options.policy.defaultSourceId) };
  validateDataSourceSelectionConfig(sources, policy);

  const defaultSourceId = policy.defaultSourceId;
  const persistedSourceId = readPersistedSourceId(options.storage, options.storageKey);
  const persistedSource = sources.find((source) => source.id === persistedSourceId);
  const initialSourceId = policy.selectionMode === 'fixed' || !persistedSource || !isSelectable(persistedSource)
    ? defaultSourceId
    : persistedSource.id;
  let state: DataSourceSelectionState = {
    schemaVersion: DATA_SOURCE_SELECTION_STATE_SCHEMA_VERSION,
    sourceId: initialSourceId,
    generation: 0,
  };

  const requireSelectableSource = (sourceId: string): DataSourceDefinition => {
    const source = sources.find((item) => item.id === normalizedId(sourceId));
    if (!source) fail(`source-not-found:${normalizedId(sourceId)}`);
    if (!isSelectable(source)) fail(`source-not-selectable:${source.id}`);
    return source;
  };

  return {
    getState: () => ({ ...state }),
    getSources: () => sources.map((source) => ({ ...source })),
    apply: async (sourceId, context, port) => {
      const nextSource = requireSelectableSource(sourceId);
      if (nextSource.id !== state.sourceId && !isDataSourceSelectionAllowed(policy, context)) {
        fail(`selection-not-allowed:${context}`);
      }

      const previousSourceId = state.sourceId;
      const nextState: DataSourceSelectionState = {
        schemaVersion: DATA_SOURCE_SELECTION_STATE_SCHEMA_VERSION,
        sourceId: nextSource.id,
        generation: state.generation + 1,
      };
      state = nextState;
      persistState(options.storage, options.storageKey, nextState);

      const switchContext = {
        previousSourceId,
        nextSourceId: nextState.sourceId,
        generation: nextState.generation,
      };
      await port.abortStaleLoads?.(switchContext);
      await port.clearSourceDependentCache(switchContext);
      await port.clearInMemoryDatasets(switchContext);
      await port.reloadCurrentWorld(switchContext);

      return { previousSourceId, state: { ...nextState } };
    },
  };
}
