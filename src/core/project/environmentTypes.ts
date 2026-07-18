export type CairnMapProjectTaggedConfig = {
  schemaVersion: string;
  projectId?: string;
};


export type CairnMapWorldItem = {
  id: string;
  numericCode: number;
  label?: string;
  enabled?: boolean;
  default?: boolean;
  center?: { x: number; y?: number; z: number };
  projectionId?: string;
  tileSourceId?: string;
  dataSourceId?: string;
};

export type CairnMapWorldsConfig = CairnMapProjectTaggedConfig & {
  items: CairnMapWorldItem[];
};

export type CairnMapSourceLinkModeItem = {
  id: string;
  label: string;
  rawCompatibleBaseUrl: string;
  default?: boolean;
};

export type CairnMapSourceLinkModesConfig = CairnMapProjectTaggedConfig & {
  storageKey: string;
  legacyStorageKeys?: string[];
  items: CairnMapSourceLinkModeItem[];
};

export type CairnMapDataSourceMode = 'pub' | 'dat';

export type CairnMapDataSourceItem = {
  id?: string;
  worldId: string;
  label?: string;
  type?: string;
  baseUrl: string;
  files: string[];
  sourceMode?: CairnMapDataSourceMode;
  pictureSourceMode?: CairnMapDataSourceMode;
};

export type CairnMapDataSourcesConfig = CairnMapProjectTaggedConfig & {
  items: CairnMapDataSourceItem[];
};

export type CairnMapRuleButtonTone = 'blue' | 'green' | 'cyan' | 'purple' | 'gray' | 'orange' | 'slate';

export type CairnMapRuleButtonCriteria = {
  classCode?: string[];
  kind?: string[];
  skind?: string[];
  skind2?: string[];
};

export type CairnMapRuleButtonLinkedButton = {
  targetId: string;
  mode: 'enableWhenThisEnabled' | 'disableWhenThisEnabled' | 'mirrorThisState';
};

export type CairnMapRuleButtonBehavior = {
  exclusiveWith?: string[];
  exclusiveGroup?: string | null;
  linkedButtons?: CairnMapRuleButtonLinkedButton[];
  disableWhenEnabled?: string[];
  enableWhenEnabled?: string[];
  persistState?: boolean;
};

export type CairnMapRuleButtonItem = {
  id: string;
  label: string;
  tone: CairnMapRuleButtonTone;
  iconKey: string;
  defaultEnabled?: boolean;
  criteria: CairnMapRuleButtonCriteria;
  behavior?: CairnMapRuleButtonBehavior;
};

export type CairnMapRuleButtonsConfig = CairnMapProjectTaggedConfig & {
  storageKey?: string;
  legacyStorageKeys?: string[];
  policy?: {
    maxActive?: number;
  };
  defaults?: {
    fallback?: string[];
    byWorld?: Record<string, string[] | undefined>;
  };
  items: CairnMapRuleButtonItem[];
};

export type CairnMapSearchRuleItem = {
  classCode?: string;
  kind?: string;
  skind?: string;
  skind2?: string;
};

export type CairnMapSearchCategoryOverride = {
  classCode: string;
  name: string;
};

export type CairnMapSearchProfile = {
  id: string;
  searchFields?: string[];
  blacklist?: CairnMapSearchRuleItem[];
  priority?: CairnMapSearchRuleItem[];
  categoryOverrides?: CairnMapSearchCategoryOverride[];
};

export type CairnMapSearchProfilesConfig = CairnMapProjectTaggedConfig & {
  defaultProfileId: string;
  items: CairnMapSearchProfile[];
};
export type CairnMapStorageProfileRole = 'featureData' | 'media' | 'mediaIndex' | 'relayPool';

export type CairnMapStorageProfileKind =
  | 'internal-path'
  | 'github-repo'
  | 'raw-compatible'
  | 'object-storage'
  | 'api'
  | 'database';

export type CairnMapStorageProfileMode = 'internal' | 'external' | 'planned';

export type CairnMapStorageProfileReadConfig = {
  rawCompatible?: boolean;
  sourceLinkModeRef?: string;
  baseUrl?: string;
};

export type CairnMapStorageProfileWriteConfig = {
  enabled?: boolean;
  reason?: string;
  requiredPermissions?: string[];
};

export type CairnMapStorageProfileCompatibilityConfig = {
  currentRuntimeReplacement?: boolean;
  currentRuntimeChain?: string;
  notes?: string;
  [key: string]: unknown;
};

export type CairnMapStorageProfileItem = {
  id: string;
  role: CairnMapStorageProfileRole;
  label?: string;
  kind: CairnMapStorageProfileKind;
  mode: CairnMapStorageProfileMode;
  owner?: string;
  repo?: string;
  branch?: string;
  root: string;
  paths?: Record<string, string | undefined>;
  read?: CairnMapStorageProfileReadConfig;
  write?: CairnMapStorageProfileWriteConfig;
  compatibility?: CairnMapStorageProfileCompatibilityConfig;
};

export type CairnMapStorageProfileDefaults = Partial<Record<CairnMapStorageProfileRole, string>>;

export type CairnMapStorageProfilesConfig = CairnMapProjectTaggedConfig & {
  description?: string;
  runtimeStatus?: 'contract-only' | 'active' | 'deprecated' | string;
  defaults: CairnMapStorageProfileDefaults;
  profiles: CairnMapStorageProfileItem[];
  compatibility?: Record<string, unknown>;
};

export type CairnMapNativeRelayPackageStatus =
  | 'draft'
  | 'pending'
  | 'prechecked'
  | 'accepted'
  | 'rejected'
  | 'skipped'
  | 'applied'
  | 'archived';

export type CairnMapNativeRelayPackageProtocolConfig = CairnMapProjectTaggedConfig & {
  description?: string;
  runtimeStatus?: 'contract-only' | 'active' | 'deprecated' | string;
  storageProfileRefs?: Record<string, string>;
  roots: {
    indexFile: string;
    deleteFile: string;
    reviewFile: string;
    splitRoot: string;
    pictureRoot: string;
    toolRefreshRoot?: string;
  };
  pathTemplates?: Record<string, string>;
  semantics: Record<string, string>;
  index?: Record<string, unknown>;
  delete?: Record<string, unknown>;
  review?: {
    schemaPath?: string;
    required?: boolean;
    statuses?: CairnMapNativeRelayPackageStatus[];
    [key: string]: unknown;
  };
  compatibility?: Record<string, unknown>;
};
export type CairnMapMediaIndexContractConfig = CairnMapProjectTaggedConfig & {
  description?: string;
  runtimeStatus?: 'contract-only' | 'active' | 'deprecated' | string;
  storageProfileRefs?: Record<string, string>;
  roots: {
    splitRoot: string;
    mergeRoot: string;
    assetSplitRoot: string;
    bindingSplitRoot: string;
    byFeatureMergeRoot: string;
    assetMergeRoot: string;
  };
  asset?: Record<string, unknown>;
  binding?: Record<string, unknown>;
  merge?: Record<string, unknown>;
  nativeRelayCompatibility?: Record<string, unknown>;
  compatibility?: Record<string, unknown>;
};

