import type { ClassificationPath, ConfigPackageV3, ConfigValidationIssue, FieldDefinition, MountedFeatureRecord } from './types';
import { RAILWAY_ROLES, pathCovers, pathsMatch, rawClassification } from '../core/project/navigationDefinition';
import type { RailwayRole } from '../core/project/navigationTypes';
import { VALUE_SCHEMA_TEMPLATES, validateValueSchema } from './valueSchema';
import { effectiveOptionTable } from './lookupTables';

const sharedBase = 'application/preferences/railwayRoles', navBase = 'application/navigation';
const stable = (value: unknown): string => JSON.stringify(value, (_key, row) => row && typeof row === 'object' && !Array.isArray(row) ? Object.fromEntries(Object.entries(row).sort(([a],[b]) => a.localeCompare(b))) : row);
export function validateNavigationConfiguration(config: ConfigPackageV3, fields: (config: ConfigPackageV3, path: ClassificationPath) => FieldDefinition[]): ConfigValidationIssue[] {
  const issues: ConfigValidationIssue[] = [], app = config.application;
  const add = (path: string, message: string, relatedPaths: string[] = [], severity: 'error' | 'warning' = 'error') => issues.push({ severity, code: 'navigation-configuration-invalid', path, message, relatedPaths });
  if (config.contractRevision < 13) {
    if (app?.navigation || app?.preferences.railwayRoles || config.nodes.some(n => n.fields.some(f => f.valueSchema))) add(navBase, '共享铁路角色、导航设置及值结构声明需要契约 c13。');
    return issues;
  }
  if (!app?.navigation || !app.preferences.railwayRoles) { add(navBase, 'c13 必须包含路径规划设置和共享铁路角色定义。', [sharedBase]); return issues; }
  if (app.preferences.navigation) add(navBase, '旧导航参数与 r13 设置不能并存。', ['application/preferences/navigation']);
  const nav = app.navigation, shared = app.preferences.railwayRoles.selectors;
  const pointNodes = (path: ClassificationPath) => config.nodes.filter(n => pathCovers(path, n.path));
  const geometry = (path: ClassificationPath) => { const nodes=config.nodes.filter(n => pathCovers(n.path, path) && n.geometryType).sort((a,b) => Object.values(a.path).filter(Boolean).length - Object.values(b.path).filter(Boolean).length);return nodes[nodes.length-1]?.geometryType; };
  const checkPaths = (rows: ClassificationPath[], base: string, required: boolean) => {
    if (required && !rows.length) add(base, '启用的角色／参与范围至少需要一条分类。');
    for (const [i, row] of rows.entries()) {
      if (!row.class || row.skind && !row.kind || row.skind2 && !row.skind || !config.nodes.some(n => stable(n.path) === stable(Object.fromEntries(Object.entries(row).filter(([,v]) => v))))) add(`${base}/${i}`, 'Class 必填，四级分类必须连续且存在。');
      if (rows.some((other, at) => at !== i && pathCovers(other, row))) add(`${base}/${i}`, '范围被同角色另一行包含，可整理冗余行。', [], 'warning');
    }
  };
  const shape = (field: FieldDefinition, template: string, path: string, related: string[]) => {
    if (!field.valueSchema || stable(field.valueSchema) !== stable(VALUE_SCHEMA_TEMPLATES[template].schema)) add(path, `${field.key} 需要已注册的“${VALUE_SCHEMA_TEMPLATES[template].label}”值结构模板。`, related);
  };
  const inspect = (rows: ClassificationPath[], base: string, role: RailwayRole | 'teleportPoints' | 'warpPoints' | 'roads', navigation: boolean) => {
    const nodes = [...new Map(rows.flatMap(pointNodes).map(n => [n.nodeId,n])).values()];
    for (const node of nodes) {
      const fs = fields(config, node.path), byKey = new Map(fs.map(f => [f.key, f])), related = [`nodes/${node.nodeId}`];
      const field = (key: string, kind: string, required = false, template?: string) => {
        const f = byKey.get(key);
        if (!f) { if (required) add(base, `${node.nodeId} 缺少 ${key} 字段定义。`, related); return; }
        const type = f.type === 'enum' ? f.optionValueType ?? 'string' : f.type === 'reference' ? 'string' : f.type;
        if (type !== kind || f.cardinality !== 'single') add(base, `${node.nodeId} 的 ${key} 需要单值 ${kind}。`, related);
        if (template && type === 'json') shape(f, template, base, related);
      };
      const reference = (key: string, scopes: ClassificationPath[], matchField = 'ID') => {
        const ref = byKey.get(key)?.reference;
        if (ref && (ref.matchField !== matchField || !scopes.some(p => p.class === ref.classCode))) add(base, `${node.nodeId} 的 ${key} 引用目标与角色范围不兼容。`, related);
      };
      const domain = (key: string, tableId: string) => {
        const f = byKey.get(key);
        if (!f || f.type !== 'enum') return;
        const allowed = new Set(config.lookupTables?.find(t => t.id === tableId)?.rows.map(r => r.value));
        const declared = effectiveOptionTable(config, f);
        if (declared.rows.some(row => !allowed.has(row.value))) add(base, `${node.nodeId} 的 ${key} 枚举域超出绑定功能表。`, [...related, `lookupTables/${tableId}`]);
      };
      field('Name','string');
      if (role === 'lines') { field('direction','number',navigation); field('color','string'); field('bureau','string'); field('line','string'); }
      if (role === 'platforms') { field('lines','json',true,'rail-lines'); field('Situation','boolean',navigation); field('Connect','boolean',navigation); }
      if (role === 'stationAreas') { field('platforms','json',true,'rail-platforms'); field('STBuilding','string',true); reference('STBuilding',shared.stations); }
      if (role === 'stations') for (const key of ['Stations','stations','stationsgroup','stationsGroup','StationsGroup','Stationsgroup']) field(key,'json',false,'rail-stations');
      if (role === 'roads') {
        field('Level','number',true); field('Oneway','boolean',true);
        for (const key of ['Enter','Exit','SelfJunction']) field(key,'boolean');
        field('Speed','number'); field('Mode','json',false,'road-modes'); field('ConnectL','json',false,'road-connections'); field('Blacklist','json',false,'road-blacklist');
      }
      if (role === 'teleportPoints') {
        field('hub','string'); field('TGTWarp','string'); field('TGTcoordinate','json',false,'target-point');
        for (const key of ['TGT_x','TGT_z','TGTelevation']) field(key,'number');
        if (!byKey.has('TGTWarp') && !byKey.has('TGTcoordinate') && !(byKey.has('TGT_x') && byKey.has('TGT_z'))) add(base, `${node.nodeId} 缺少 Warp 或目标坐标字段。`, related);
        reference('TGTWarp',nav.teleport.selectors.warpPoints,'WRPointI2D'); domain('hub',nav.teleport.hubTableId);
      }
      if (role === 'warpPoints') field('WRPointI2D','string',true);
      if (navigation) {
        const allowed = role === 'lines' || role === 'roads' ? ['LineString'] : role === 'stations' ? ['Point','Polygon'] : ['Point'];
        if (!allowed.includes(geometry(node.path) ?? '')) add(base, `${node.nodeId} 的有效几何不适合该导航角色。`, related);
      }
    }
  };
  const sharedUsed = nav.rail.enabled || config.nodes.some(n => n.card?.mode === 'fields' && n.card.items.some(i => i.renderer === 'lineChips') || n.fieldSettings?.search?.extension?.mode === 'lineChips');
  for (const role of RAILWAY_ROLES) {
    const sPath = `${sharedBase}/selectors/${role}`, nPath = `${navBase}/rail/selectors/${role}`;
    checkPaths(shared[role],sPath,sharedUsed); inspect(shared[role],sPath,role,false);
    checkPaths(nav.rail.selectors[role],nPath,nav.rail.enabled);
    for (const [i,row] of nav.rail.selectors[role].entries()) if (!shared[role].some(scope => pathCovers(scope,row))) add(`${nPath}/${i}`, '导航参与范围超出同角色共享定义，请协调修改两区。', [sPath]);
    if (nav.rail.enabled) inspect(nav.rail.selectors[role],nPath,role,true);
  }
  const overlap = (roles: Array<[string,ClassificationPath[]]>) => {
    for (let a=0;a<roles.length;a++) for (let b=a+1;b<roles.length;b++) if (roles[a][1].some(x => roles[b][1].some(y => pathCovers(x,y)||pathCovers(y,x)))) add(roles[a][0], '不同角色的分类范围重叠。', [roles[b][0]]);
  };
  overlap(RAILWAY_ROLES.map(role => [`${sharedBase}/selectors/${role}`, shared[role]]));
  for (const role of ['teleportPoints','warpPoints'] as const) { const base=`${navBase}/teleport/selectors/${role}`; checkPaths(nav.teleport.selectors[role],base,nav.teleport.enabled); if(nav.teleport.enabled)inspect(nav.teleport.selectors[role],base,role,true); }
  overlap(['teleportPoints','warpPoints'].map(role => [`${navBase}/teleport/selectors/${role}`,nav.teleport.selectors[role as 'teleportPoints'|'warpPoints']]));
  checkPaths(nav.road.selectors.roads,`${navBase}/road/selectors/roads`,nav.road.enabled);
  if(nav.road.enabled)inspect(nav.road.selectors.roads,`${navBase}/road/selectors/roads`,'roads',true);
  for (const [module,id,kind] of [['teleport',nav.teleport.hubTableId,'teleportHub'],['road',nav.road.travelModesTableId,'speed']] as const) {
    const table = config.lookupTables?.find(t => t.id === id), path = `${navBase}/${module}`;
    if (!id && !nav[module].enabled) continue;
    if (!table || table.functionKind !== kind || table.valueType !== 'string') { add(path,'绑定表不存在，或功能值格式／文本存储类型不兼容。',[`lookupTables/${id}`]); continue; }
    if (!table.rows.length) add(path,'导航绑定表不能为空。',[`lookupTables/${id}`]);
    for(const row of table.rows){const value=row.functionValue;if(kind==='teleportHub' && value && typeof value==='object' && 'world' in value && !app.worlds.some(w=>[w.id,w.prefix,String(w.numericCode),w.label.zh,w.label.en].includes(value.world))) add(path,'枢纽指定的世界不存在。',[`lookupTables/${id}`,'application/worlds']);}
  }
  for (const node of config.nodes) for (const f of node.fields) if (f.valueSchema) {
    if (f.type !== 'json' || f.cardinality !== 'single') add(`nodes/${node.nodeId}/fields/${f.fieldId}`,'结构声明用于单值 JSON 容器。');
    for (const error of validateValueSchema(f.valueSchema)) add(`nodes/${node.nodeId}/fields/${f.fieldId}/valueSchema`,error);
  }
  return issues;
}

/** Data-level diagnostics cover only the supplied world/source snapshot. */
export function validateNavigationRecords(config: ConfigPackageV3, records: MountedFeatureRecord[]): ConfigValidationIssue[] {
  const app = config.application, nav = app?.navigation, shared = app?.preferences.railwayRoles?.selectors;
  if (config.contractRevision < 13 || !nav || !shared) return [];
  const result: ConfigValidationIssue[] = [], ids = new Map<string, MountedFeatureRecord[]>(), warps = new Map<string, MountedFeatureRecord[]>();
  const world = (r: MountedFeatureRecord) => app!.worlds.find(w => [w.id, w.prefix, String(w.numericCode), w.label.zh, w.label.en].includes(String(r.World)))?.id ?? String(r.World ?? '');
  const role = (r: MountedFeatureRecord, key: RailwayRole) => pathsMatch(shared[key], rawClassification(r));
  const add = (r: MountedFeatureRecord, message: string, path: string, warning = false) => result.push({ severity: warning ? 'warning' : 'error', code: 'mounted-navigation-invalid', path, message, relatedPaths: [sharedBase, navBase,...(path.startsWith(`${navBase}/road`)?[`lookupTables/${nav.road.travelModesTableId}`]:path.startsWith(`${navBase}/teleport`)?[`lookupTables/${nav.teleport.hubTableId}`]:[]),...config.nodes.filter(n=>pathCovers(n.path,rawClassification(r))).map(n=>`nodes/${n.nodeId}`)], affectedFeatures: [{ id: String(r.ID ?? ''), name: String(r.Name ?? r.ID ?? '') }] } as ConfigValidationIssue);
  const insert = (map: Map<string, MountedFeatureRecord[]>, key: string, r: MountedFeatureRecord) => { const rows = map.get(key) ?? []; rows.push(r); map.set(key, rows); };
  const stationKey = (r: MountedFeatureRecord) => String(r.staBuildingID ?? (r.Type === 'Points' || r.Class === 'SBP' ? r.staBuildingPointId ?? r.ID : r.staBuildingId ?? r.buildingID ?? r.BuildingID ?? r.buildingId ?? r.ID) ?? '');
  for (const r of records) {
    insert(ids, `${world(r)}/${r.ID}`, r);
    if(role(r,'stations')&&stationKey(r)!==String(r.ID))insert(ids,`${world(r)}/${stationKey(r)}`,r);
    if (pathsMatch(nav.teleport.selectors.warpPoints, rawClassification(r))) insert(warps, `${world(r)}/${r.WRPointI2D ?? r.wrPointI2D ?? ''}`, r);
  }
  const refs = (r: MountedFeatureRecord, key: string) => Array.isArray(r[key]) ? (r[key] as unknown[]).map(v => typeof v === 'object' && v ? String((v as { ID?: unknown }).ID ?? '') : String(v)) : [];
  const check = (r: MountedFeatureRecord, id: string, target: RailwayRole) => {
    const candidates = ids.get(`${world(r)}/${id}`) ?? [];
    if (candidates.length !== 1 || !role(candidates[0], target)) add(r, `铁路关联 ${id} 缺失、重复或角色不符。`, sharedBase);
    else if (nav.rail.enabled && RAILWAY_ROLES.some(k => pathsMatch(nav.rail.selectors[k], rawClassification(r))) && !pathsMatch(nav.rail.selectors[target], rawClassification(candidates[0]))) add(r, `关联 ${id} 不在导航参与范围；仅排除该导航边。`, `${navBase}/rail`, true);
  };
  const finite = (v: unknown) => typeof v === 'number' && Number.isFinite(v);
  const coordinate = (v: unknown) => Boolean(v && typeof v === 'object' && finite((v as Record<string, unknown>).x) && finite((v as Record<string, unknown>).z));
  const codes = new Set(config.lookupTables?.find(t => t.id === nav.road.travelModesTableId)?.rows.map(row => row.value));
  for (const r of records) {
    const isRoad = pathsMatch(nav.road.selectors.roads, rawClassification(r)), isWarp = pathsMatch(nav.teleport.selectors.warpPoints, rawClassification(r)), isTeleport = pathsMatch(nav.teleport.selectors.teleportPoints, rawClassification(r));
    if ((RAILWAY_ROLES.some(key => role(r, key)) || isRoad || isWarp || isTeleport) && (ids.get(`${world(r)}/${r.ID}`)?.length ?? 0) > 1) add(r, '同世界 ID 重复，无法唯一解析。', navBase);
    if(role(r,'stations')&&(ids.get(`${world(r)}/${stationKey(r)}`)?.length??0)>1)add(r,'同世界车站规范建筑 ID 重复。',sharedBase);
    if (role(r, 'platforms')) for (const id of refs(r, 'lines')) if (id) check(r, id, 'lines');
    if (role(r, 'stationAreas')) { for (const id of refs(r, 'platforms')) if (id) check(r, id, 'platforms'); if (r.STBuilding) check(r, String(r.STBuilding), 'stations'); }
    if (role(r, 'stations')) for (const key of ['Stations', 'stations', 'stationsgroup', 'stationsGroup', 'StationsGroup', 'Stationsgroup']) for (const id of refs(r, key)) if (id) check(r, id, 'stationAreas');
    if (role(r, 'lines') && r.direction !== undefined && (!finite(r.direction) || !Number.isInteger(r.direction) || Number(r.direction) < 0 || Number(r.direction) > 7)) add(r, 'direction 必须为 0–7 整数。', `${navBase}/rail`);
    if (isRoad) {
      if (r.Speed !== undefined && (!finite(r.Speed) || Number(r.Speed) <= 0)) add(r, '道路 Speed 必须为正有限数。', `${navBase}/road`);
      if (Array.isArray(r.Mode)) for (const v of r.Mode) {
        const code = typeof v === 'string' ? v : Array.isArray(v) ? String(v[0] ?? '') : v && typeof v === 'object' ? String((v as Record<string, unknown>).code ?? (v as Record<string, unknown>).tgt ?? (v as Record<string, unknown>).ID ?? (v as Record<string, unknown>).id ?? '') : '';
        if (!codes.has(code)) add(r, `道路 Mode ${code} 不在绑定速度表中。`, `${navBase}/road`);
      }
      for (const key of ['ConnectL', 'Blacklist']) if (Array.isArray(r[key])) for (const v of r[key] as unknown[]) {
        const row = v && typeof v === 'object' ? v as Record<string, unknown> : {};
        const id = typeof v === 'string' ? v : Array.isArray(v) ? String(v[0] ?? '') : String(row.tgt ?? row.Tgt ?? row.ID ?? row.id ?? '');
        if (!id) continue;
        const candidates = ids.get(`${world(r)}/${id}`) ?? [];
        if (!candidates.length) add(r, `${key} 目标 ${id} 不存在。`, `${navBase}/road`);
        else if (candidates.length !== 1) add(r, `${key} 目标 ${id} 不唯一。`, `${navBase}/road`);
        else if (!pathsMatch(nav.road.selectors.roads, rawClassification(candidates[0]))) add(r, `${key} 目标 ${id} 不在道路参与范围；排除该连接。`, `${navBase}/road`, true);
      }
    }
    if (isWarp) {
      const key = String(r.WRPointI2D ?? r.wrPointI2D ?? '').trim();
      if (!key || (warps.get(`${world(r)}/${key}`)?.length ?? 0) > 1) add(r, '同世界 Warp 定位键缺失或重复。', `${navBase}/teleport`);
    }
    if (isTeleport) {
      const key = String(r.TGTWarp ?? r.tgtWarp ?? '').trim();
      const target = warps.get(`${world(r)}/${key}`) ?? [];
      const explicit = coordinate(r.TGTcoordinate) || finite(r.TGT_x) && finite(r.TGT_z);
      const excluded = key && records.filter(other => world(other) === world(r) && String(other.WRPointI2D ?? other.wrPointI2D ?? '') === key);
      if (key && target.length > 1) add(r, `Warp 目标 ${key} 不唯一。`, `${navBase}/teleport`);
      else if (!(key && target.length === 1) && !explicit) add(r, excluded && excluded.length === 1 ? `Warp 目标 ${key} 不在参与范围；排除该传送边。` : `传送目标无法解析${key ? `：${key}` : ''}。`, `${navBase}/teleport`, Boolean(excluded && excluded.length === 1));
      const hub = String(r.hub ?? (r.tags as Record<string, unknown> | undefined)?.hub ?? '').trim();
      if (hub && !config.lookupTables?.find(t => t.id === nav.teleport.hubTableId)?.rows.some(row => row.value === hub && row.functionValue && typeof row.functionValue === 'object' && 'world' in row.functionValue && world({World:row.functionValue.world}) === world(r))) add(r, `hub ${hub} 不在当前世界的绑定枢纽表中。`, `${navBase}/teleport`);
    }
  }
  return result;
}
