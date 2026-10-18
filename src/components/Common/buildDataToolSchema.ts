import { getOpenRIAMapWorldsConfig } from '@/core/project/openriamapRiaEnvironment';
import type { ConfigPackageV3, GeometryKind } from '@/configStudio/types';
import { resolveCategoryNodes } from '@/configStudio/runtime';

export const DATA_TOOL_SCHEMA_VERSION = '1.1.0';
export const SPECIAL_CLASS_LIST = ['ISG', 'ISL', 'ISP'] as const;
export const BASE_FEATURE_CLASS_LIST = ['RLE', 'STA', 'STB', 'PLF', 'PFB', 'SBP'] as const;

export type DataToolSchema = {
  schemaVersion: string;
  worlds: Record<string, number>;
  featureClasses: string[];
  specialClasses: string[];
  workflowKinds: Record<string, string[]>;
  workflowSubKinds: Record<string, Record<string, string[]>>;
  classToDrawMode: Record<string, string>;
  classToGeometry: Record<string, string>;
};

const sortObjectKeys = <T>(obj: Record<string, T>): Record<string, T> => Object.fromEntries(
  Object.entries(obj).sort(([a], [b]) => a.localeCompare(b, 'zh-CN')),
) as Record<string, T>;

const geometryToDrawMode = (geometryType: string): string => {
  if (geometryType === 'Point') return 'point';
  if (geometryType === 'LineString') return 'polyline';
  return 'polygon';
};

const geometryToChineseName = (geometryType: string): string => {
  if (geometryType === 'Point') return '点';
  if (geometryType === 'LineString') return '线';
  return '面';
};

export function buildWorldCodeMapFromConfig(config?:ConfigPackageV3): Record<string, number> {
  const worlds: Record<string, number> = {};
  for (const item of config?.application?.worlds ?? getOpenRIAMapWorldsConfig().items ?? []) {
    const id = String(item.id ?? '').trim();
    const code = Number(item.numericCode);
    if (id && Number.isFinite(code)) worlds[id] = code;
  }
  return sortObjectKeys(worlds);
}

export function dataToolSchemaWarnings(config:ConfigPackageV3):string[]{
  return config.nodes.some(node=>node.path.skind2)?['兼容格式1.1.0仅表示Class / Kind / SKind，SKind2不会写入该兼容文件；完整四级定义请使用正式配置整包。']:[];
}

export function buildDataToolSchema(config?:ConfigPackageV3): DataToolSchema {
  if(!config)throw Error('正式V3配置尚未加载，不能导出Data Tool Schema。');
  const featureClasses = new Set(config.nodes.map(node=>node.path.class));
  const workflowKinds: Record<string, Set<string>> = {};
  const workflowSubKinds: Record<string, Record<string, Set<string>>> = {};
  const classToDrawMode: Record<string, string> = {};
  const classToGeometry: Record<string, string> = {};

  for(const classCode of featureClasses){
    const leaves=config.nodes.filter(node=>node.path.class===classCode&&!node.children.length);
    const geometries=new Set<GeometryKind>();
    for(const leaf of leaves){const geometry=[...resolveCategoryNodes(config,leaf.path)].reverse().find(node=>node.geometryType)?.geometryType;if(geometry)geometries.add(geometry);}
    if(geometries.size!==1)throw Error(`分类 ${classCode} 的几何定义无法由1.1.0兼容格式唯一表示，请使用完整配置整包。`);
    const geometry=[...geometries][0];classToDrawMode[classCode]=geometryToDrawMode(geometry);classToGeometry[classCode]=geometryToChineseName(geometry);
  }
  for(const {path} of config.nodes){
    if(path.kind)(workflowKinds[path.class]??=new Set()).add(path.kind);
    if(path.kind&&path.skind)(((workflowSubKinds[path.class]??={})[path.kind]??=new Set())).add(path.skind);
  }

  const workflowKindsSorted = sortObjectKeys(
    Object.fromEntries(
      Object.entries(workflowKinds).map(([classCode, set]) => [classCode, Array.from(set).filter(Boolean).sort((a, b) => a.localeCompare(b, 'zh-CN'))]),
    ),
  );

  const workflowSubKindsSorted = sortObjectKeys(
    Object.fromEntries(
      Object.entries(workflowSubKinds).map(([classCode, byKind]) => [
        classCode,
        sortObjectKeys(
          Object.fromEntries(
            Object.entries(byKind).map(([kind, set]) => [kind, Array.from(set).filter(Boolean).sort((a, b) => a.localeCompare(b, 'zh-CN'))]),
          ),
        ),
      ]),
    ),
  );

  return {
    schemaVersion: DATA_TOOL_SCHEMA_VERSION,
    worlds: buildWorldCodeMapFromConfig(config),
    featureClasses: Array.from(featureClasses).sort((a, b) => a.localeCompare(b, 'zh-CN')),
    specialClasses: SPECIAL_CLASS_LIST.filter(classCode=>featureClasses.has(classCode)),
    workflowKinds: workflowKindsSorted,
    workflowSubKinds: workflowSubKindsSorted,
    classToDrawMode: sortObjectKeys(classToDrawMode),
    classToGeometry: sortObjectKeys(classToGeometry),
  };
}
