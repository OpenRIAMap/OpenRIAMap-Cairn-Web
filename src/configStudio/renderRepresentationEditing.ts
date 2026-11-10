import { mapSymbolItems } from './c19Render';
import { r12PointStyle } from './r12Migration';
import type { DisplayRepresentation, GeometryKind, PointSymbol, RenderStyle, SymbolBehavior, ZoomPriorityRule } from './types';

type StyleKind = 'point' | 'path' | 'composite';
export type RepresentationDrafts = Map<string, RenderStyle>;

function styleKind(geometry: GeometryKind, representation: DisplayRepresentation | undefined): StyleKind {
  if (representation === 'geometryWithPoint') return 'composite';
  return geometry === 'Point' || representation === 'point' ? 'point' : 'path';
}

function pathAppearance(style: RenderStyle, geometry: GeometryKind): RenderStyle {
  const { dashPreset, weight, stroke, strokeOpacity, lineCap, lineJoin, fill, fillOpacity, halo } = style;
  return {
    dashPreset, weight, stroke, strokeOpacity, lineCap, lineJoin,
    ...(geometry === 'Polygon'
      ? { fill, fillOpacity, halo: halo && { ...halo, showInner: 'showInner' in halo && halo.showInner } }
      : { halo }),
  };
}

export function changeC19Representation(
  rule: ZoomPriorityRule, representation: DisplayRepresentation, geometry: GeometryKind,
  drafts: RepresentationDrafts, defaults: RenderStyle, pointDefaults: RenderStyle,
): RenderStyle | undefined {
  const previous = repairPointBehavior(rule, geometry).style ?? rule.style;
  const from = styleKind(geometry, rule.representation), to = styleKind(geometry, representation);
  const key = (kind: StyleKind) => rule.id + ':' + kind;
  if (previous && rule.representation !== 'hidden') drafts.set(key(from), structuredClone(previous));
  if (representation === 'hidden') return undefined;

  const stored = drafts.get(key(to));
  const midpoint = previous?.midpoint?.pointSymbol;
  const point = midpoint ?? previous?.pointSymbol;
  if (to === 'point') {
    if (midpoint) return { ...stored, pointSymbol: structuredClone(midpoint) };
    if (stored?.pointSymbol) return structuredClone(stored);
    const { pointSymbol } = r12PointStyle(previous ?? pointDefaults);
    return { pointSymbol };
  }
  if (to === 'composite') {
    const area = stored ?? (from === 'path' ? previous : drafts.get(key('path'))) ?? defaults;
    const symbol = point ?? stored?.midpoint?.pointSymbol ?? drafts.get(key('point'))?.pointSymbol ?? r12PointStyle(pointDefaults).pointSymbol!;
    return { ...pathAppearance(area, geometry), midpoint: { pointSymbol: structuredClone(symbol) } };
  }
  const area = stored ?? (from === 'composite' ? previous : undefined) ?? defaults;
  return pathAppearance(area, geometry);
}

function validBehavior(value: unknown): value is SymbolBehavior {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const { anchor, visibility, offsetPx } = value as SymbolBehavior;
  return Object.keys(value).length === 3 && (anchor === 'geometry' || anchor === 'label')
    && (visibility === 'independent' || visibility === 'withLabel')
    && !!offsetPx && Object.keys(offsetPx).length === 2
    && Number.isFinite(offsetPx.x) && Number.isFinite(offsetPx.y);
}

function restoreSymbolBehavior(symbol: PointSymbol, leaked: SymbolBehavior): PointSymbol | undefined {
  let missing = 0, invalid = false;
  try {
    mapSymbolItems(symbol, item => {
      if (item.behavior === undefined) missing++;
      else if (!validBehavior(item.behavior)) invalid = true;
      return item;
    });
  } catch {
    return undefined;
  }
  if (invalid) return undefined;
  if (!missing) return symbol;
  if (missing !== 1 || symbol.kind !== 'shape' || symbol.mapping) return undefined;
  return { ...symbol, shape: { ...symbol.shape, behavior: leaked } };
}

/** Repair only the top-level behavior leaked by the c19 representation editor. */
export function repairPointBehavior(rule: ZoomPriorityRule, geometry: GeometryKind): { style?: RenderStyle; problem?: string } {
  const source = rule.style as (RenderStyle & { behavior?: unknown }) | undefined;
  if (!source || !Object.prototype.hasOwnProperty.call(source, 'behavior')) return {};
  const { behavior, ...style } = source;
  const problem = 'style.behavior 的归属无法确认。请复核此规则的点符号与回退项，原草稿已保留。';
  if (!validBehavior(behavior)) return { problem: problem + ' 位置：style.behavior。' };
  const kind = styleKind(geometry, rule.representation);
  if (kind === 'point') {
    if (!style.pointSymbol || style.midpoint) return { problem };
    const pointSymbol = restoreSymbolBehavior(style.pointSymbol, behavior);
    return pointSymbol ? { style: { ...style, pointSymbol } } : { problem };
  }
  if (style.pointSymbol || Boolean(style.midpoint) !== (kind === 'composite') || !style.pointShape || style.size === undefined) return { problem };
  // In the leaked composite variant, the top-level object came from the old
  // base point. Its behavior did not belong to the independently created midpoint.
  return { style: { ...pathAppearance(style, geometry), ...(style.midpoint ? { midpoint: style.midpoint } : {}) } };
}
