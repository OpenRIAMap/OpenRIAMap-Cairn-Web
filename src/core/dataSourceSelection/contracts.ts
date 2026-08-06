export const DATA_SOURCE_SELECTION_CONFIG_SCHEMA_VERSION = 'cairnmap.data-source-selection.v1';
export const DATA_SOURCE_SELECTION_STATE_SCHEMA_VERSION = 'cairnmap.data-source-selection-state.v1';

export type DataSourceSelectionMode = 'fixed' | 'user-select' | 'user-select-on-failure';

export type DataSourceSelectionContext = 'settings' | 'failure';

export type DataSourceDefinition = {
  id: string;
  label: string;
  readerKind: string;
  enabled?: boolean;
  selectable?: boolean;
};

export type DataSourceSelectionPolicy = {
  defaultSourceId: string;
  selectionMode: DataSourceSelectionMode;
  requireExplicitApply: boolean;
  automaticFallback: false;
  clearCacheOnApply: 'source-dependent';
  retryOnFailure: boolean;
};

export type DataSourceSelectionConfig = {
  schemaVersion: typeof DATA_SOURCE_SELECTION_CONFIG_SCHEMA_VERSION;
  storageKey: string;
  sources: DataSourceDefinition[];
  policy: DataSourceSelectionPolicy;
};

export type DataSourceSelectionState = {
  schemaVersion: typeof DATA_SOURCE_SELECTION_STATE_SCHEMA_VERSION;
  sourceId: string;
  generation: number;
};

export type DataSourceSelectionFailureStage =
  | 'selection'
  | 'release-set'
  | 'world-pointer'
  | 'manifest'
  | 'chunk-catalog'
  | 'chunk'
  | 'media-index'
  | 'network'
  | 'unknown';

export type DataSourceSelectionFailure = {
  sourceId: string;
  stage: DataSourceSelectionFailureStage;
  message: string;
  retryAllowed: boolean;
  worldId?: string;
};

export type DataSourceSelectionStorage = {
  read(storageKey: string): string | null;
  write(storageKey: string, value: string): void;
};

export type DataSourceSwitchContext = {
  previousSourceId: string;
  nextSourceId: string;
  generation: number;
};

export type DataSourceSwitchPort = {
  abortStaleLoads?(context: DataSourceSwitchContext): void | Promise<void>;
  clearSourceDependentCache(context: DataSourceSwitchContext): void | Promise<void>;
  clearInMemoryDatasets(context: DataSourceSwitchContext): void | Promise<void>;
  reloadCurrentWorld(context: DataSourceSwitchContext): void | Promise<void>;
};

export type DataSourceSelectionApplyResult = {
  previousSourceId: string;
  state: DataSourceSelectionState;
};
