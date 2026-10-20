import type { ConfigPackageV3, GeometryKind, RenderStyle, ZoomPriorityRule } from './types';
import { migrateConfigToR11 } from './r11Migration';
import { basePointFromLegacy, ICON_LIBRARY } from './pointSymbol';

export function r12PointStyle(style: RenderStyle, confirmHiddenFallback = false): RenderStyle {
  if (style.pointSymbol) return structuredClone(style);
  // A historical hide decision needs an explicit user choice. Preserve the invalid draft until then.
  if (style.icon?.fallback === 'hide' && !confirmHiddenFallback) return structuredClone(style);
  const shape = basePointFromLegacy({ ...style, size: style.size ?? Math.max(4, Number(style.weight ?? 2) * 3) });
  const { pointShape: _shape, icon, size: _size, weight: _weight, stroke: _stroke, fill: _fill, strokeOpacity: _opacity, fillOpacity: _fillOpacity, lineCap: _cap, lineJoin: _join, ...other } = style;
  return { ...other, pointSymbol: icon ? { kind: 'externalImage', image: { mode: 'fieldUrl', field: icon.source, presentation: { sizePx: { width: icon.size[0], height: icon.size[1] }, placement: { anchor: { mode: 'custom', x: icon.anchor[0], y: icon.anchor[1] }, offsetPx: { x: 0, y: 0 } } } }, fallback: shape } : { kind: 'shape', shape } };
}
export function r12RenderRule(rule: ZoomPriorityRule, geometry: GeometryKind): ZoomPriorityRule {
  const result = structuredClone(rule);
  if (result.style && (geometry === 'Point' || result.representation === 'point') && result.representation !== 'hidden') result.style = r12PointStyle(result.style);
  for (const override of result.conditionalOverrides ?? []) if (override.style && (geometry === 'Point' || (override.representation ?? result.representation) === 'point') && override.representation !== 'hidden') override.style = r12PointStyle({ ...rule.style, ...override.style });
  return result;
}
export function migrateConfigToR12(value: ConfigPackageV3): { config: ConfigPackageV3; changes: string[]; unresolved: string[] } {
  if (value.contractRevision >= 12) return { config: structuredClone(value), changes: [], unresolved: [] };
  const previous = value.contractRevision < 11 ? migrateConfigToR11(value) : { config: structuredClone(value), changes: [] };
  const config = previous.config, changes = [...previous.changes], unresolved: string[] = [];
  config.contractRevision = 12; config.revision++;
  config.resources = { iconLibraries: [{ ...ICON_LIBRARY }] };
  for (const node of config.nodes) for (const [key, profile] of Object.entries(node.geometryProfiles)) {
    const geometry = key as GeometryKind;
    profile.zoomPriority.rules = profile.zoomPriority.rules.map(rule => {
      const converted = r12RenderRule(rule, geometry);
      if (JSON.stringify(converted) !== JSON.stringify(rule)) changes.push(`${node.nodeId}/${geometry}/${rule.id}：点外观迁移为单一 pointSymbol，保留颜色、尺寸和图片锚点。`);
      const inherited = config.engine?.renderDefaults?.[geometry]?.lineLabel;
      const own = converted.extensions?.lineLabel;
      const line = { ...inherited, ...(own?.profile === 'inherit' ? Object.fromEntries(Object.entries(own).filter(([,value]) => value !== 'inherit')) : own) };
      if (geometry === 'LineString' && line.cjkGlyphPathMode !== 'off' && (line.profile === 'strict-on-line' || line.mode === 'strictOnLine') && line.orientationPolicy === 'autoCjkUpright') {
        converted.extensions = { ...converted.extensions, lineLabel: { ...(own ?? { profile: 'inherit' }), orientationPolicy: 'scriptAware', textPathLengthMode: 'actualText', ...(line.repositionStrictSvg !== false && line.repositionMode === 'chainageSearch' ? {cjkGlyphFallbackMode:'hide' as const,textPathFallback:'hide' as const,repositionFailure:'hide' as const,simpleFallbackEnabled:false} : {}), cjkGlyphMaxAngleDeltaDeg: line.cjkGlyphMaxAngleDeltaDeg ?? line.textPathMaxAngleDeltaDeg ?? 45, cjkGlyphMaxTotalBendDeg: line.cjkGlyphMaxTotalBendDeg ?? line.textPathMaxTotalBendDeg ?? 100 } };
        changes.push(`${node.nodeId}/${geometry}/${rule.id}：ROD 同类贴线配置启用中英分流／实际文字宽度，保留普通与弯曲字距、留白、候选及预算；CJK 字数限制只计中文，英文保留路径预算；严格 SVG 失败显式隐藏。`);
      }
      if (converted.style?.icon?.fallback === 'hide') unresolved.push(`${node.nodeId}/${geometry}/${rule.id}`);
      for (const override of converted.conditionalOverrides ?? []) if (override.style?.icon?.fallback === 'hide') unresolved.push(`${node.nodeId}/${geometry}/${rule.id}/${override.id}`);
      return converted;
    });
  }
  changes.push('升级契约 r12；原始历史配置保持可读。Pinhead v25 资源能力已声明，未自动把旧 hide 回退改成圆点。');
  return { config, changes, unresolved };
}
