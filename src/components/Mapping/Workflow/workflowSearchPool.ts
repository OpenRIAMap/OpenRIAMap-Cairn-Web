import { normalizeRuleSourceWorldId } from '@/core/project/worldIdentity';
type FeatureInfoAny = Record<string, any>;
export type SearchSelectConfig = {
  /** 搜索范围的语义标识；每次真实配置变化重新生成候选。 */
  cacheKey: string;

  /** 过滤条件：锁定需要搜索的要素范围 */
  filter: (fi: FeatureInfoAny) => boolean;

  /** 用于匹配搜索：识别字段 */
  getId: (fi: FeatureInfoAny) => string;
  getName: (fi: FeatureInfoAny) => string;

  /** 下拉展示：例如 Name(ID) */
  formatOption: (name: string, id: string) => string;

  /** 可选：用于判断图层管理动态池缓存是否足够稳定 */
  searchFields?: string[];
  displayFields?: string[];
  returnFields?: string[];
  requiredFields?: string[];
};

export type SearchPoolOption = { id: string; name: string; display: string; className?: string };
const DEFAULT_ID_KEYS = [
  'ID',
  'Id',
  'id',
  'BuildingID',
  'StationID',
  'StructureID',
  'GeoID',
  'GeoUnitID',
  'LineID',
  'RoadID',
  'PointID',
  'PgonID',
  'PolylineID',
  'WRPointI2D',
  'buildingID',
  'buildingId',
  'stationID',
  'stationId',
  'pointID',
  'pointId',
  'pgonID',
  'pgonId',
  'polylineID',
  'polylineId',
];

const DEFAULT_NAME_KEYS = [
  'Name',
  'name',
  'BuildingName',
  'StationName',
  'StructureName',
  'GeoName',
  'GeoUnitName',
  'LineName',
  'RoadName',
  'PointName',
  'PgonName',
  'PolylineName',
  'buildingName',
  'stationName',
  'pointName',
  'pgonName',
  'polylineName',
  'Label',
  'label',
];

function readFirstString(fi: FeatureInfoAny, keys: string[]): string {
  for (const key of keys) {
    const value = fi?.[key];
    if (value === null || value === undefined) continue;
    const s = String(value).trim();
    if (s) return s;
  }
  return '';
}

function readCandidateId(fi: FeatureInfoAny, cfg: SearchSelectConfig): string {
  const fromCfg = String(cfg.getId(fi) ?? '').trim();
  if (fromCfg) return fromCfg;
  return readFirstString(fi, DEFAULT_ID_KEYS);
}

function readCandidateName(fi: FeatureInfoAny, cfg: SearchSelectConfig): string {
  const fromCfg = String(cfg.getName(fi) ?? '').trim();
  if (fromCfg) return fromCfg;
  return readFirstString(fi, DEFAULT_NAME_KEYS);
}

function normalizeId(raw: any): string {
  return String(raw ?? '').trim();
}

export function buildWorkflowSearchOptionsFromFeatures(features: FeatureInfoAny[], cfg: SearchSelectConfig): SearchPoolOption[] {
  const out: SearchPoolOption[] = [];
  for (const item of features) {
    if (!item || typeof item !== 'object') continue;
    const fi = item as FeatureInfoAny;
    if (!cfg.filter(fi)) continue;
    const id = readCandidateId(fi, cfg);
    const name = readCandidateName(fi, cfg);
    if (!id || !name) continue;
    out.push({
      id,
      name,
      display: cfg.formatOption(name, id),
      className: String(fi?.Class ?? '').trim() || undefined,
    });
  }
  return out;
}

export function filterWorkflowSearchOptions(pool: SearchPoolOption[], q: string, limit = 50): SearchPoolOption[] {
  const s = q.trim().toLowerCase();
  if (!s) return pool.slice(0, limit);
  return pool
    .filter((o) =>
      o.name.toLowerCase().includes(s) ||
      o.id.toLowerCase().includes(s) ||
      o.display.toLowerCase().includes(s) ||
      String(o.className ?? '').toLowerCase().includes(s)
    )
    .slice(0, limit);
}


export function mergeWorkflowSearchPool(base: FeatureInfoAny[], committed: FeatureInfoAny[], deleted: readonly string[], config: SearchSelectConfig, worldId: string): SearchPoolOption[] {
  const world = normalizeRuleSourceWorldId(worldId), removed = new Set(deleted.map(normalizeId));
  const relevant = (record: FeatureInfoAny) => record.World === undefined || normalizeRuleSourceWorldId(String(record.World)) === world;
  const merged = new Map<string, FeatureInfoAny>();
  for (const record of [...base, ...committed]) {
    if (!relevant(record)) continue;
    const id=readCandidateId(record,config);
    if(id)merged.set(id,record);
  }
  return buildWorkflowSearchOptionsFromFeatures([...merged.values()],config).filter(option => !removed.has(option.id)).sort((a,b)=>a.name.localeCompare(b.name,'zh-Hans-CN'));
}
