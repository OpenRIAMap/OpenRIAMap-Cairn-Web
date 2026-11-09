import type { MigrationChange } from './contractMigration';
import type { CategoryNode, ConfigPackageV3, DensityGrid, GeometryKind, RenderDensityGroup, RenderLogicModules,
  RenderLogicTemplate, RenderRuleExtensions, RenderStyle, ZoomPriorityRule } from './types';
import {
  BUILTIN_DENSITY_GROUP_NAMES, C19_EXTERNAL_LAYERS, C19_GEOMETRIES, LOGIC_MODULES,
  defaultSymbolBehavior, densityGridAt, emptyLogicModules, interactionSnapshot, labelModifierCapabilities, mapSymbolItems,
} from './c19Render';

const seedDefinitions = [
  ['point-poi-around','Point','普通地点','Points of interest'],
  ['point-fixed-position','Point','固定方位地点','Fixed-position point'],
  ['point-transport-node','Point','交通节点','Transport point'],
  ['line-natural-path','LineString','自然与边界沿线','Natural line'],
  ['line-road-path','LineString','道路沿线','Road'],
  ['line-rail-route','LineString','铁路线路','Rail line'],
  ['polygon-surface-stable','Polygon','地域大面','Large area'],
  ['polygon-symbol-anchor','Polygon','面中点标注','Area marker'],
  ['polygon-structure-center','Polygon','结构面中心','Structure center'],
  ['polygon-floor-center','Polygon','楼层面中心','Floor center'],
  ['polygon-geometry-only','Polygon','无标签几何','Geometry only'],
] as const;

const stable = (value: unknown): string => JSON.stringify(value, (_, item: unknown) => item && typeof item === 'object' && !Array.isArray(item)
  ? Object.fromEntries(Object.entries(item).sort(([a], [b]) => a.localeCompare(b))) : item) ?? '';

function report(changes: MigrationChange[], path: string, message: string, before?: unknown, after?: unknown, kind: MigrationChange['kind'] = 'converted') {
  changes.push({ id: 'c18-c19:' + path, kind, component: 'render', path, message, before, after });
}

function legacyExtensions(config: ConfigPackageV3 | undefined, geometry: GeometryKind, local?: RenderRuleExtensions) {
  const resolved = structuredClone(config?.engine?.renderDefaults?.[geometry] ?? {});
  const values = resolved as Record<string, unknown>;
  for (const [key, value] of Object.entries(local ?? {})) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      if ('mode' in value && value.mode === 'inherit') continue;
      const patch = Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined && item !== 'inherit'));
      values[key] = { ...(values[key] && typeof values[key] === 'object' ? values[key] : {}), ...patch };
    } else if (value !== undefined) values[key] = value;
  }
  return resolved;
}

function seedId(node: CategoryNode, geometry: GeometryKind, rule: ZoomPriorityRule): string {
  const { class: cls, kind, skind } = node.path;
  if (geometry === 'Point') {
    if (cls === 'RIL' && (kind === 'PLF' || kind === 'STA')) return 'point-transport-node';
    if (cls === 'TRP' || cls === 'TPT' || cls === 'TPP' || cls === 'WRP') return 'point-fixed-position';
    return 'point-poi-around';
  }
  if (geometry === 'LineString') {
    if (cls === 'RIL' || cls === 'RLE') return 'line-rail-route';
    if (cls === 'ROD' || skind === 'MTL' || node.path.skind2 === 'MTL') return 'line-road-path';
    return 'line-natural-path';
  }
  if (cls === 'FLR' || (cls === 'RIL' && kind === 'STF')) return 'polygon-floor-center';
  if (cls === 'RIL' && kind === 'PFB') return 'polygon-geometry-only';
  if (rule.representation === 'point') return 'polygon-symbol-anchor';
  if (cls === 'BUD' || cls === 'PTA' || (cls === 'RIL' && kind === 'STB')) return 'polygon-structure-center';
  return 'polygon-surface-stable';
}

function convertRule(rule: ZoomPriorityRule, geometry: GeometryKind, ext: RenderRuleExtensions, changes: MigrationChange[], at: string): RenderLogicModules {
  const modules = emptyLogicModules();
  modules.admission = { screenGate: ext.screenGate, pane: ext.pane, hitTolerancePx: ext.hitTolerancePx };
  const stack = rule.geometryStack;
  if (stack?.pane) {
    // Pane authoring uses the registered pane roles. Old explicit names must be
    // checked before removing their separate authority.
    report(changes, at + '/geometryStack/pane', '旧绘制容器名称需要映射到注册 Pane。', stack.pane, undefined, 'unresolved');
  }
  const fallback = ext.fallback;
  if (ext.labelText) {
    const { minChars, opacity, emptyBehavior, ...active } = ext.labelText;
    modules.text.labelText = active;
    if (minChars !== undefined || opacity !== undefined || emptyBehavior !== undefined)
      report(changes, at + '/extensions/labelText/retired', '移除当前渲染器未消费的文字参数。', { minChars, opacity, emptyBehavior }, undefined, 'removed');
  }
  if (fallback) modules.text.fallback = { whenNoLabelText: fallback.whenNoLabelText, whenGeometryInvalid: fallback.whenGeometryInvalid };
  modules.visibility.visibility = ext.visibility;
  const coincident = modules.visibility.visibility?.coincidentPoint;
  if (coincident?.precision !== undefined) {
    if (coincident.precision !== 1000) report(changes, at + '/visibility/precision', '旧重合点精度不同，请处理后再迁移。', coincident.precision, 1000, 'unresolved');
    delete coincident.precision;
  }
  if (ext.anchor) {
    const { preferViewportCenter, candidatePlacement, ...anchor } = ext.anchor;
    modules.candidates.anchor = anchor;
    if (rule.label && candidatePlacement) rule.label.candidatePlacement = candidatePlacement;
    if (geometry === 'Polygon' && preferViewportCenter !== undefined && ext.polygonCandidates?.preferViewportCenter === undefined)
      modules.candidates.polygonCandidates = { preferViewportCenter };
  }
  if (geometry === 'Polygon' && ext.polygonCandidates) {
    const { switchThreshold, ...candidates } = ext.polygonCandidates;
    modules.candidates.polygonCandidates = {
      ...modules.candidates.polygonCandidates, ...candidates,
      weightedSwitchThreshold: candidates.weightedSwitchThreshold ?? switchThreshold,
    };
  }
  const label = rule.label;
  const group = label?.collision.collisionGroup;
  if (group === 'structureLabel' && (label?.placement ?? 'center') === 'center')
    modules.stability.stability = { ...ext.stability, preferCenterCandidate: true };
  else if (ext.stability) modules.stability.stability = ext.stability;
  if (geometry === 'LineString' && ext.lineLabel) {
    const { profile, ...line } = ext.lineLabel;
    modules.line.lineLabel = { ...line, mode: line.mode ?? (profile === 'strict-on-line' ? 'strictOnLine' : 'free') };
  }
  const oldPolicy = fallback?.whenCollisionFailed;
  modules.collision.collision = { ...ext.collision, hidePolicy: ext.collision?.hidePolicy ??
    (oldPolicy === 'forceShow' || label?.collision.hideWhenColliding === false ? 'forceShow'
      : oldPolicy === 'abbreviate' ? 'abbreviateThenHide' : oldPolicy === 'showGeometryOnly' ? 'geometryOnly' : 'hide') };
  const targets = modules.collision.collision;
  const target = (value: string) => value.endsWith('Label') && ['requiredLabel','importantLabel','optionalLabel','softLabel'].includes(value)
    ? 'role:' + value.slice(0,-5) : value === 'symbol' || value === 'geometry' ? value : value.includes(':') ? value : 'group:' + value;
  if (targets.collideWith) targets.collideWith = targets.collideWith.map(target) as typeof targets.collideWith;
  if (targets.blocks) targets.blocks = targets.blocks.map(target) as typeof targets.blocks;
  const density = ext.density;
  const densityOn = density?.mode === 'override' && density.enabled !== false;
  modules.collision.groupId = group ?? (densityOn ? 'config-runtime' : undefined);
  if (density) {
    const { mode, gridSizePx, maxLabelsPerGrid, maxSymbolsPerGrid, ...behavior } = density;
    modules.collision.density = { ...behavior, enabled: densityOn };
  }
  if (label?.collision.densityLimit !== undefined) modules.collision.screenBudget = { id: group ?? 'config-runtime', limit: label.collision.densityLimit };
  if (rule.priority) {
    const { base, ...priority } = rule.priority;
    modules.priority.priority = priority;
    rule.priority = { mode: 'add', base };
  }
  modules.interaction.interaction = ext.interaction;
  delete rule.extensions;

  if (label) {
    label.mode='fixed';
    delete label.collision.collisionGroup;
    delete label.collision.densityLimit;
    delete label.collision.hideWhenColliding;
    if (geometry !== 'Point') {
      if (label.withDot || label.dotAnchorMode) report(changes, at + '/label/dot', '线／面的旧标签装饰圆点移除。', { withDot: label.withDot, dotAnchorMode: label.dotAnchorMode }, undefined, 'removed');
      delete label.withDot; delete label.dotAnchorMode;
    }
    if (label.fallbackValueFormats?.NofFloor === 'floorLabel') {
      delete label.fallbackValueFormats.NofFloor;
      if (!Object.keys(label.fallbackValueFormats).length) delete label.fallbackValueFormats;
      report(changes, at + '/label/fallbackValueFormats/NofFloor', '楼层回退显示原值。', 'floorLabel', 'plain');
    }
    if (label.style?.modifiers) {
      const capabilities = labelModifierCapabilities(geometry, label, ext);
      for (const key of ['bold','italic','underline'] as const) if (label.style.modifiers[key] && !capabilities[key]) {
        label.style.modifiers[key] = false;
        report(changes, at + '/label/style/modifiers/' + key, '实际渲染路径不支持此文字修饰。', true, false);
      }
    }
  }
  if (stack && geometry === 'Point') {
    const before = stack.zLevel;
    stack.zLevel += 1000;
    report(changes, at + '/geometryStack/zLevel', 'Point 源规则内部层级 +1000。', before, stack.zLevel);
  }
  const moveSymbolBehavior = (style: RenderStyle | undefined) => {
    if (!style) return;
    const behavior = defaultSymbolBehavior();
    behavior.offsetPx = style.symbolOffsetPx ?? behavior.offsetPx;
    behavior.anchor = style.symbolAnchor ?? behavior.anchor;
    behavior.visibility = style.symbolVisibility ?? behavior.visibility;
    if (style.pointSymbol) {
      if(style.pointSymbol.kind==='shape')style.pointSymbol.mode='fixed';
      style.pointSymbol = mapSymbolItems(style.pointSymbol, item => ({ ...item, behavior: structuredClone(behavior) }));
    }
    delete style.symbolOffsetPx; delete style.symbolAnchor; delete style.symbolVisibility;
  };
  moveSymbolBehavior(rule.style);
  return modules;
}

function seedTemplates(rows: Array<{ id: string; modules: RenderLogicModules; rule: ZoomPriorityRule }>): RenderLogicTemplate[] {
  return seedDefinitions.map(([id, geometry, zh, en]) => {
    const candidates = rows.filter(row => row.id === id && row.rule.representation !== 'hidden');
    const modules = emptyLogicModules();
    for (const key of LOGIC_MODULES) {
      const counted = new Map<string, { modules: RenderLogicModules; count: number }>();
      for (const row of candidates) {
        const signature = stable(row.modules[key]);
        const previous = counted.get(signature);
        counted.set(signature, { modules: row.modules, count: (previous?.count ?? 0) + 1 });
      }
      const selected = [...counted.values()].sort((a,b) => b.count - a.count)[0];
      if (selected) Object.assign(modules, { [key]: selected.modules[key] });
    }
    return { id, geometry, name: { zh, en }, description: { zh: '', en: '' }, modules };
  });
}

function groupSeed(id: string): RenderDensityGroup {
  const [zh,en] = BUILTIN_DENSITY_GROUP_NAMES[id] ?? [id,id];
  const gridSizePx = id === 'structureLabel' ? 104 : id === 'poiLabel' ? 72 : 96;
  return { id, name:{ zh,en }, description:{ zh:'格内密度和碰撞目标',en:'Grid density and collision target' },
    defaultGrid:{ gridSizePx, maxLabelsPerGrid:id === 'poiLabel' ? 3 : 2 },
    zoomGrids:id === 'structureLabel' ? [{ minZoom:6,maxZoom:8,grid:{gridSizePx,maxLabelsPerGrid:3} }] : [] };
}

export function migrateC19Render(nodes: CategoryNode[], source: ConfigPackageV3 | undefined, destination: ConfigPackageV3 | undefined, changes: MigrationChange[]) {
  const ids = new Set(Object.keys(BUILTIN_DENSITY_GROUP_NAMES));
  const rows = nodes.flatMap(node => C19_GEOMETRIES.flatMap(geometry => (node.geometryProfiles[geometry]?.zoomPriority.rules ?? []).map(rule => {
    const at = `nodes/${node.nodeId}/geometryProfiles/${geometry}/rules/${rule.id}`;
    const ext = legacyExtensions(source, geometry, rule.extensions);
    const modules = convertRule(rule, geometry, ext, changes, at);
    if(ext.interaction&&(source||destination))
      modules.interaction.interaction=interactionSnapshot((source??destination)!,geometry,ext.interaction);
    if (modules.collision.groupId) ids.add(modules.collision.groupId);
    for (const target of [...modules.collision.collision?.blocks ?? [], ...modules.collision.collision?.collideWith ?? []])
      if (target.startsWith('group:')) ids.add(target.slice(6));
    return { id:seedId(node,geometry,rule), at, geometry, modules, rule, oldDensity:ext.density };
  })));
  const templates = destination?.engine?.renderTemplates ?? seedTemplates(rows);
  const groups = destination?.engine?.densityGroups ?? [...ids].map(groupSeed);
  if(source)for(const group of groups){
    const byZoom = Array.from({length:9},(_,zoom)=>{
      const active=rows.filter(({rule,modules,geometry,oldDensity})=>{
        const range=rule.when?.zoom;
        const visibleLabel=rule.label?.visible;
        const budgetedSymbol=(geometry==='Point'||rule.representation==='point')&&oldDensity?.maxSymbolsPerGrid!==undefined;
        return modules.collision.groupId===group.id&&modules.collision.density?.enabled&&rule.representation!=='hidden'
          &&range&&zoom>=range.min&&zoom<=range.max&&(visibleLabel||budgetedSymbol);
      });
      const seeded=densityGridAt(group,zoom);
      if(!active.length)return seeded;
      const grid=new Set(active.map(row=>row.oldDensity?.gridSizePx??96));
      const label=new Set(active.filter(row=>row.rule.label?.visible).map(row=>row.oldDensity?.maxLabelsPerGrid??2));
      const symbol=new Set(active.flatMap(row=>row.oldDensity?.maxSymbolsPerGrid===undefined?[]:[row.oldDensity.maxSymbolsPerGrid]));
      if([grid,label,symbol].some(values=>values.size>1)){
        report(changes,`engine/densityGroups/${group.id}/zoom/${zoom}`,'旧规则在同组同 Zoom 的有效网格规格不一致。',
          active.map(row=>({path:row.at,density:row.oldDensity})),seeded,'unresolved');
        return seeded;
      }
      return {gridSizePx:[...grid][0],maxLabelsPerGrid:[...label][0]??seeded.maxLabelsPerGrid,maxSymbolsPerGrid:[...symbol][0]} satisfies DensityGrid;
    });
    group.zoomGrids=[];
    for(const [zoom,grid] of byZoom.entries()){
      if(stable(grid)===stable(group.defaultGrid))continue;
      const last=group.zoomGrids[group.zoomGrids.length-1];
      if(last&&last.maxZoom===zoom-1&&stable(last.grid)===stable(grid))last.maxZoom=zoom;
      else group.zoomGrids.push({minZoom:zoom,maxZoom:zoom,grid});
    }
  }
  for (const row of rows) {
    const template = templates.find(item => item.id === row.id && item.geometry === row.geometry) ?? templates.find(item => item.geometry === row.geometry);
    if (!template) throw Error(`缺少 ${row.geometry} 迁移模板：${row.at}`);
    const overrides = Object.fromEntries(LOGIC_MODULES.filter(key => stable(template.modules[key]) !== stable(row.modules[key])).map(key => [key,row.modules[key]]));
    row.rule.logic = { templateId:template.id, overrides };
    report(changes, row.at + '/logic', '模板与完整模块覆写。', undefined, { templateId:template.id, overrides:Object.keys(overrides) });
  }
  if (source?.engine) {
    source.engine.renderTemplates = templates;
    source.engine.densityGroups = groups;
    source.engine.missingRenderRule = Object.fromEntries(C19_GEOMETRIES.flatMap(geometry => {
      const value = source.engine?.renderDefaults?.[geometry]?.fallback?.whenRuleMissing;
      return value ? [[geometry,value]] : [];
    }));
    delete source.engine.renderDefaults;
    delete source.engine.contextView.minZoom;
  }
  if (source?.application) source.application.externalLayers = { ...C19_EXTERNAL_LAYERS };
}
