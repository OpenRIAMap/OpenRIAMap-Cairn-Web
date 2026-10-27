import {defaultHalo,haloWidth,haloProblems,symbolHalos} from './halo';
import pinhead from './pinhead-capabilities.generated.json';
import type { BasePointStyle, ConfigPackageV3, FieldDefinition, IconItem, PointSymbol, RenderColorBinding, RenderStyle, SymbolPlacement } from './types';
import { scalarValueErrors } from './renderScalar';
import { imageSourceFormProblems } from './imageLibrary';

export const ICON_LIBRARY = { library: 'pinhead' as const, version: pinhead.version, manifestSha256: pinhead.manifestSha256 };
const iconIds=new Set(pinhead.ids);
export const supportedIconId = (id: string) => iconIds.has(id);
export const POINT_SYMBOL_LIMITS = { iconSize: 512, imageSize: 2048, stroke: 72 } as const;
export const defaultSymbolPlacement = (): SymbolPlacement => ({ anchor: { mode: 'center' }, offsetPx: { x: 0, y: 0 } });
const hasIcons = (config:ConfigPackageV3) => config.nodes.some(node=>Object.values(node.geometryProfiles).some(profile=>profile?.zoomPriority.rules.some(rule=>rule.style?.pointSymbol?.kind==='icon'||rule.conditionalOverrides?.some(override=>override.style?.pointSymbol?.kind==='icon'))));
/** A first explicit Icon selection declares the one fixed catalogue; existing/unknown declarations are never rewritten. */
export function declareNewIconCapability(previous:ConfigPackageV3,next:ConfigPackageV3):ConfigPackageV3 {
  if(next.contractRevision<12||hasIcons(previous)||!hasIcons(next)||next.resources?.iconLibraries.some(item=>item.library==='pinhead'))return next;
  return {...next,resources:{iconLibraries:[...next.resources?.iconLibraries??[],{...ICON_LIBRARY}]}};
}
export function basePointFromLegacy(style: Partial<RenderStyle> = {},contractRevision=12): BasePointStyle {
  return structuredClone({ ...(contractRevision>=14?{halo:style.halo??defaultHalo()}:{}),pointShape: style.pointShape ?? 'circle', size: style.size ?? 5, weight: style.weight ?? 1,
    lineCap: style.lineCap ?? 'round', lineJoin: style.lineJoin ?? 'round',
    stroke: style.stroke ?? { mode: 'fixed', color: '#334155' }, fill: style.fill ?? { mode: 'fixed', color: '#2563eb' },
    strokeOpacity: style.strokeOpacity ?? 1, fillOpacity: style.fillOpacity ?? 1 });
}
/** No browser/global origin dependency; dynamic values use the same protocol policy. */
export function acceptableImageUrl(value: unknown): value is string {
  if (typeof value !== 'string' || !value.trim() || value.length > 8192) return false;
  try { const url = new URL(value, 'https://cairn.invalid'); return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password; } catch { return false; }
}
export function placementAnchor(value: SymbolPlacement, width: number, height: number): [number, number] {
  const positions: Record<string, [number, number]> = { center: [width / 2, height / 2], topCenter: [width / 2, 0], bottomCenter: [width / 2, height], leftCenter: [0, height / 2], rightCenter: [width, height / 2], topLeft: [0, 0], topRight: [width, 0], bottomLeft: [0, height], bottomRight: [width, height] };
  const anchor = value.anchor.mode === 'custom' ? [value.anchor.x!, value.anchor.y!] : positions[value.anchor.mode];
  // Positive local offsets move only the image, so subtract them from its anchor.
  return [anchor[0] - value.offsetPx.x, anchor[1] - value.offsetPx.y];
}
const reachCache = new WeakMap<PointSymbol, number>();
export function pointSymbolReach(symbol?: PointSymbol): number {
  if (!symbol) return 0; const prior = reachCache.get(symbol); if (prior !== undefined) return prior;
  const base = (value: BasePointStyle) => value.size + value.weight + haloWidth(value.halo);
  const image = (width: number, height: number, placement: SymbolPlacement) => { const anchor = placementAnchor(placement,width,height); return Math.max(Math.abs(anchor[0]),Math.abs(width-anchor[0]),Math.abs(anchor[1]),Math.abs(height-anchor[1])); };
  let result: number;
  if (symbol.kind === 'shape') result = base(symbol.shape);
  else if (symbol.kind === 'icon') { const items = symbol.icon.mode === 'single' ? [symbol.icon.item] : symbol.icon.entries.map(row => row.item); result = Math.max(base(symbol.fallback), ...items.map(item => image(item.sizePx,item.sizePx,item.placement)+haloWidth(item.halo))); }
  else { const items = symbol.image.mode === 'valueMap' ? symbol.image.entries.map(row => row.presentation) : [symbol.image.presentation]; result = Math.max(base(symbol.fallback), ...items.map(item => image(item.sizePx.width,item.sizePx.height,item.placement)+haloWidth(item.halo))); }
  reachCache.set(symbol,result); return result;
}
export type SymbolProblem = { path: string; message: string };
export function pointSymbolProblems(value: PointSymbol, fields: FieldDefinition[], config: ConfigPackageV3): SymbolProblem[] {
  const issues: SymbolProblem[] = [], fail = (path: string, message: string) => issues.push({ path, message });
  const finite = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n);
  const range = (n: unknown, min: number, max: number) => finite(n) && n >= min && n <= max;
  const field = (key: string, at: string) => {
    const definition = fields.find(f => f.key === key);
    if (!definition || definition.cardinality !== 'single' || definition.type === 'json') fail(at, '来源需要存在的单值标量字段。');
    return definition;
  };
  const placement = (p: SymbolPlacement | undefined, at: string) => {
    if (!p || !p.anchor || !p.offsetPx) { fail(at, '缺少完整锚点及局部偏移。'); return; }
    if (!['center','topCenter','bottomCenter','leftCenter','rightCenter','topLeft','topRight','bottomLeft','bottomRight','custom'].includes(p.anchor.mode)) fail(at, '锚点模式无效。');
    if (p.anchor.mode === 'custom' && (!finite(p.anchor.x) || !finite(p.anchor.y)) || !finite(p.offsetPx.x) || !finite(p.offsetPx.y)) fail(at, '锚点及局部偏移必须是有限数字。');
    if (p.anchor.mode !== 'custom' && (p.anchor.x !== undefined || p.anchor.y !== undefined)) fail(at, '预设锚点不能同时保存另一套自定义坐标。');
    if ([p.anchor.x ?? 0,p.anchor.y ?? 0,p.offsetPx.x,p.offsetPx.y].every(finite) && !placementAnchor(p,2048,2048).every(finite)) fail(at,'组合锚点与偏移计算超出有限数值范围。');
  };
  const base = (p: BasePointStyle | undefined, at: string) => {
    if (!p) { fail(at, '缺少完整基础点样式。'); return; }
    if (!range(p.size, 0, 512) || !range(p.weight, 0, 72)) fail(at, '基础点大小／描边宽度超出范围。');
    if (!['circle','square','triangle','regular4','regular5','regular6'].includes(p.pointShape)) fail(at, '回退仅允许基础点形状。');
    if (!range(p.strokeOpacity, 0, 1) || !range(p.fillOpacity, 0, 1)) fail(at, '基础点透明度必须介于 0–1。');
  };
  const item = (p: IconItem, at: string) => {
    if (p.library !== 'pinhead' || !supportedIconId(p.id)) fail(at, '图标不在固定 Pinhead 清单中。');
    if (!config.resources?.iconLibraries.some(r => r.library === 'pinhead' && r.version === ICON_LIBRARY.version && r.manifestSha256 === ICON_LIBRARY.manifestSha256)) fail(at, '配置未声明受支持的 Pinhead 版本及资源摘要。');
    if (!range(p.sizePx, 1, 512) || !range(p.foregroundOpacity, 0, 1)) fail(at, '图标大小或透明度无效。');
    const plate = p.plate;
    if (plate) {
      if (!range(plate.paddingPx, 0, 512) || !range(plate.strokeWidthPx, 0, 72) || 2 * (plate.paddingPx + plate.strokeWidthPx) >= p.sizePx) fail(at + '/plate', '底板内边距及描边不能占满图案区域。');
      if (!range(plate.fillOpacity, 0, 1) || !range(plate.strokeOpacity, 0, 1) || plate.radiusPx !== undefined && !range(plate.radiusPx, 0, 512)) fail(at + '/plate', '底板透明度或圆角无效。');
    }
    placement(p.placement, at + '/placement');
  };
  const rows = <T extends { value: string | number | boolean }>(key: string, entries: T[], at: string, inspect: (entry: T, at: string) => void) => {
    const definition = field(key, at + '/field'), seen = new Set<unknown>();
    if (!entries.length) fail(at, '至少需要一条有效映射。');
    entries.forEach((entry, i) => {
      const row = `${at}/entries/${i}`;
      if (seen.has(entry.value)) fail(row, '映射保存值重复。'); seen.add(entry.value);
      if (definition) for (const message of scalarValueErrors(definition, entry.value)) fail(row, message);
      inspect(entry, row);
    });
  };
  if (value.kind === 'shape') base(value.shape, 'shape');
  else if (value.kind === 'icon') {
    base(value.fallback, 'fallback');
    if (value.icon.mode === 'single') item(value.icon.item, 'icon/item');
    else rows(value.icon.field, value.icon.entries, 'icon', (row, at) => item(row.item, at + '/item'));
  } else if (value.kind === 'externalImage') {
    base(value.fallback, 'fallback'); const source = value.image;
    const presentation = (p: import('./types').ImagePresentation, at: string) => {
      if (!range(p.sizePx.width, 1, 2048) || !range(p.sizePx.height, 1, 2048)) fail(at, '图片宽高须介于 1–2048px。');
      placement(p.placement, at + '/placement');
    };
    const reference=(row:import('./types').ImageReference,at:string)=>{
      for(const issue of imageSourceFormProblems(row,config.contractRevision))fail(at+'/'+issue.path,issue.message);
      if(!acceptableImageUrl(row.url))fail(at+'/url','图片链接必须是有效 HTTP(S) 或站内地址。');
    };
    if (source.mode === 'valueMap') rows(source.field, source.entries, 'image', (row, at) => { reference(row,at); presentation(row.presentation, at + '/presentation'); });
    else {
      presentation(source.presentation, 'image/presentation');
      if (source.mode === 'fixed') reference(source,'image');
      if (source.mode === 'fieldUrl') field(source.field, 'image/field');
      if (source.mode === 'externalFieldUrl') {
        const id = field(source.targetIdField, 'image/targetIdField');
        if (id && !['string', 'reference', 'enum'].includes(id.type)) fail('image/targetIdField', '外部目标 ID 需要单值文本／引用字段。');
        if (!source.targetUrlField || !source.targetUrlField.split('.').every(part => /^[A-Za-z_][A-Za-z0-9_-]*$/.test(part) && !['constructor','prototype','__proto__'].includes(part))) fail('image/targetUrlField', '手填目标字段路径无效。');
      }
    }
  }
  for(const row of symbolHalos(value))for(const message of haloProblems(row.value,config.contractRevision>=14))fail(row.path,message);
  return issues;
}
export function pointSymbolBindings(value?: PointSymbol): Array<{ path: string; value: RenderColorBinding }> {
  if (!value) return [];
  const result: Array<{ path: string; value: RenderColorBinding }> = [];
  const base = (p: BasePointStyle, at: string) => { result.push({ path: at + '/stroke', value: p.stroke }, { path: at + '/fill', value: p.fill }); };
  if (value.kind === 'shape') base(value.shape, 'shape');
  else {
    base(value.fallback, 'fallback');
    if (value.kind === 'icon') {
      const item = (p: IconItem, at: string) => {
        result.push({ path: at + '/foreground', value: p.foreground });
        if (p.plate) result.push({ path: at + '/plate/fill', value: p.plate.fill }, { path: at + '/plate/stroke', value: p.plate.stroke });
      };
      if (value.icon.mode === 'single') item(value.icon.item, 'icon/item');
      else value.icon.entries.forEach((row, i) => item(row.item, `icon/entries/${i}/item`));
    }
  }
  for(const row of symbolHalos(value))if(row.value)result.push({path:row.path+'/color',value:row.value.color});
  return result;
}
