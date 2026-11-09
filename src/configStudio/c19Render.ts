import type {
  BasePointStyle, ConfigPackageV3, DensityGrid, ExternalRenderLayers, GeometryKind,
  PointSymbol, RenderDensityGroup, RenderLabelAppearance, RenderLogicModules,
  RenderRuleExtensions, SymbolBehavior, ZoomPriorityRule,
} from './types';

export const C19_GEOMETRIES = ['Point', 'LineString', 'Polygon'] as const;
export const C19_EXTERNAL_LAYERS: ExternalRenderLayers = {
  path: 650, highlightPath: 655, point: 650, topPoint: 660, featureLabel: 670,
  playerAvatar: 600, playerTooltip: 900,
};
export const HISTORICAL_EXTERNAL_LAYERS = { ...C19_EXTERNAL_LAYERS, path: 410, highlightPath: 640 };
export const externalLayersFor = (config?: ConfigPackageV3) =>
  config?.application?.externalLayers ?? HISTORICAL_EXTERNAL_LAYERS;

export const LOGIC_MODULE_NAMES = {
  admission: '屏幕准入、绘制容器与命中',
  text: '文字约束与通用失败处理',
  visibility: '跨要素可见性与上下文关系',
  candidates: '锚点、方向与几何候选',
  stability: '稳定性与布局缓存',
  line: '贴线文字算法',
  collision: '碰撞与密度响应',
  priority: '显示权重合成',
  interaction: '交互视觉',
} satisfies Record<keyof RenderLogicModules, string>;
export const LOGIC_MODULES = Object.keys(LOGIC_MODULE_NAMES) as Array<keyof RenderLogicModules>;

export function emptyLogicModules(): RenderLogicModules {
  return { admission: {}, text: {}, visibility: {}, candidates: {}, stability: {}, line: {}, collision: {}, priority: {}, interaction: {} };
}

export const BUILTIN_DENSITY_GROUP_NAMES: Record<string, [string, string]> = {
  surfaceLabel: ['地表标签','Surface'], networkLabel: ['网络标签','Network'],
  structureLabel: ['结构标签','Structure'], transportLabel: ['交通设施标签','Transport'],
  poiLabel: ['兴趣点标签','Points of interest'], indoorLabel: ['室内标签','Indoor'],
};

export function interactionSnapshot(config: ConfigPackageV3, geometry: GeometryKind, local?: RenderRuleExtensions['interaction']) {
  const baseline=config.engine?.interactionBaselines[geometry];
  if(!baseline)return local;
  const {hitTolerancePx: _tolerance,...states}=baseline;
  return structuredClone(Object.fromEntries(Object.entries(states).map(([state,visual])=>[
    state,{...visual,...local?.[state as keyof typeof states]},
  ])) as NonNullable<RenderRuleExtensions['interaction']>);
}

export function densityGridAt(group: RenderDensityGroup, zoom: number): DensityGrid {
  return group.zoomGrids.find(range => zoom >= range.minZoom && zoom <= range.maxZoom)?.grid ?? group.defaultGrid;
}

export function resolveLogicModules(config: ConfigPackageV3, geometry: GeometryKind, rule: ZoomPriorityRule) {
  const template = config.engine?.renderTemplates?.find(item => item.id === rule.logic?.templateId && item.geometry === geometry);
  return { ...emptyLogicModules(), ...template?.modules, ...rule.logic?.overrides };
}

/** The compatibility projection is for existing layout algorithms only. Its
 * output is not serialized and does not add a second source of author values. */
export function logicExtensions(modules: RenderLogicModules, grid?: DensityGrid): RenderRuleExtensions {
  const { density, collision } = modules.collision;
  return {
    ...modules.admission, ...modules.text, ...modules.visibility, ...modules.candidates,
    ...modules.stability, ...modules.interaction, collision,
    lineLabel: modules.line.lineLabel ? { profile: 'standard', ...modules.line.lineLabel } : undefined,
    ...(density ? { density: { ...density, ...grid, mode: 'override', enabled: density.enabled === true && Boolean(grid) } } : {}),
  };
}

export function materializeC19Rule(config: ConfigPackageV3, geometry: GeometryKind, rule: ZoomPriorityRule, zoom: number): ZoomPriorityRule {
  const modules = resolveLogicModules(config, geometry, rule);
  const group = config.engine?.densityGroups?.find(item => item.id === modules.collision.groupId);
  const extensions = logicExtensions(modules, group && densityGridAt(group, zoom));
  const priority = modules.priority.priority ? { base: rule.priority?.base, ...modules.priority.priority } : rule.priority;
  const label = rule.label;
  return {
    ...rule, extensions, priority,
    ...(label ? { label: { ...label, collision: { ...label.collision,
      collisionGroup: group?.id, hideWhenColliding: extensions.collision?.hidePolicy !== 'forceShow',
      densityLimit: modules.collision.screenBudget?.limit,
    } } } : {}),
  };
}

export const defaultSymbolBehavior = (): SymbolBehavior => ({ offsetPx: { x: 0, y: 0 }, anchor: 'geometry', visibility: 'independent' });

export function mapSymbolItems(symbol: PointSymbol, mapper: <T extends { behavior?: SymbolBehavior }>(item: T) => T): PointSymbol {
  if (symbol.kind === 'shape') return { ...symbol, shape: mapper(symbol.shape),
    ...(symbol.mapping ? { mapping: { ...symbol.mapping, entries: symbol.mapping.entries.map(row => ({ ...row, item: mapper(row.item) })) } } : {}) };
  if (symbol.kind === 'icon') {
    const { icon } = symbol;
    return { ...symbol, fallback: mapper(symbol.fallback), icon: icon.mode === 'single'
      ? { ...icon, item: mapper(icon.item) } : { ...icon, entries: icon.entries.map(row => ({ ...row, item: mapper(row.item) })) } };
  }
  const { image } = symbol;
  return { ...symbol, fallback: mapper(symbol.fallback), image: image.mode === 'valueMap'
    ? { ...image, entries: image.entries.map(row => ({ ...row, presentation: mapper(row.presentation) })) }
    : { ...image, presentation: mapper(image.presentation) } };
}
export function resolvedBasePoint(symbol: PointSymbol, read: (field: string) => unknown): BasePointStyle {
  return symbol.kind === 'shape'
    ? (symbol.mode==='valueMap'?symbol.mapping:undefined)?.entries.find(row => row.value === read(symbol.mapping!.field))?.item ?? symbol.shape
    : symbol.fallback;
}

export function mappedLabel(label: import('./types').RenderLabelStyle, read: (field: string) => unknown): import('./types').RenderLabelStyle {
  const { mapping, mode, ...fallback } = label;
  const item = mode==='valueMap'?mapping?.entries.find(row => row.value === read(mapping.field))?.item:undefined;
  return item ? { ...item, visible: fallback.visible && item.visible, collision: fallback.collision } : fallback;
}

export function labelModifierCapabilities(geometry: GeometryKind, appearance: RenderLabelAppearance, extensions?: RenderRuleExtensions) {
  const family = appearance.style?.family ?? 'gm-outline';
  const text = ['gm-bw', 'gm-outline', 'gm-wtb', 'structure-label'].includes(family);
  const line = extensions?.lineLabel;
  const svg = geometry === 'LineString' && Boolean(line && (
    line.advancedTextEnabled || line.cjkGlyphPathMode && line.cjkGlyphPathMode !== 'off' ||
    line.textMode !== 'rotatedLabel' || line.cjkVerticalRenderMode === 'svgVertical'
  ));
  return { italic: text && !svg, underline: text && !svg, bold: text && (!svg || family === 'gm-outline') };
}

export function clearUnsupportedLabelModifiers(geometry:GeometryKind,label:import('./types').RenderLabelStyle,extensions:RenderRuleExtensions){
  const cleared=new Set<'bold'|'italic'|'underline'>();
  const clean=<T extends RenderLabelAppearance>(item:T):T=>{
    const style=item.style;
    if(!style?.modifiers)return item;
    const support=labelModifierCapabilities(geometry,item,extensions);
    const modifiers={...style.modifiers};
    let changed=false;
    for(const key of ['bold','italic','underline'] as const)if(modifiers[key]&&!support[key]){
      cleared.add(key);modifiers[key]=false;changed=true;
    }
    return changed?{...item,style:{...style,modifiers}}:item;
  };
  const result=clean(label);
  const mapping=result.mapping;
  const entries=mapping?.entries.map(row=>({...row,item:clean(row.item)}));
  return {label:cleared.size&&mapping&&entries?{...result,mapping:{...mapping,entries}}:result,cleared:[...cleared]};
}
