export type CairnMapFormatExecutorRuntimeStatus = 'passthrough' | 'active' | 'planned' | string;

export type CairnMapFormatExecutorBuildArgs = {
  op: string;
  mode: string;
  coords: unknown[];
  values: Record<string, unknown>;
  groups: Record<string, unknown[]>;
  worldId?: string;
  editorId?: string;
  prevFeatureInfo?: Record<string, unknown>;
  now?: Date;
};

export type CairnMapFormatExecutorHydrated = {
  values: Record<string, unknown>;
  groups: Record<string, unknown[]>;
};

export type CairnMapFormatExecutorContext<TFormatDef = unknown> = {
  formatterKey: string;
  classCode: string;
  featureKey: string;
  baseDef: TFormatDef;
};

export type CairnMapFormatExecutor<TFormatDef = unknown> = {
  key: string;
  runtimeStatus: CairnMapFormatExecutorRuntimeStatus;
  description?: string;
  buildFeatureInfo?: (
    args: CairnMapFormatExecutorBuildArgs,
    context: CairnMapFormatExecutorContext<TFormatDef>
  ) => Record<string, unknown>;
  hydrate?: (
    featureInfo: unknown,
    context: CairnMapFormatExecutorContext<TFormatDef>
  ) => CairnMapFormatExecutorHydrated;
  coordsFromFeatureInfo?: (
    featureInfo: unknown,
    context: CairnMapFormatExecutorContext<TFormatDef>
  ) => unknown[];
  validateImportItem?: (
    item: unknown,
    context: CairnMapFormatExecutorContext<TFormatDef>
  ) => string | undefined;
};
