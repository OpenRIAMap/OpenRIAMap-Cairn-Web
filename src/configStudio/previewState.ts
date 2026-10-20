import type { CategoryNode, ConfigPackageV3, GeometryKind, ZoomPriorityRule } from './types';
import type { PreviewPin } from './conditionWitness';
import { solveConditionWitness } from './conditionWitness';
import { matchesRenderFields, renderRuleRange, safeConditionPath } from './renderRuleConditions';
import { resolveGeometryProfile, resolveSelectableFields } from './runtime';
import { resolveNodeFieldSettings } from './nodeFieldSettings';

export type MappingPreview = { group: string; row: string; pins: PreviewPin[]; ruleId?: string; fallback?: boolean };
export type PreviewNameMode = 'zh' | 'en' | 'fallback';
export const previewRead = (record: Record<string, unknown>, path: string): unknown => path.split('.').reduce<unknown>((v, key) => v && typeof v === 'object' ? (v as Record<string, unknown>)[key] : undefined, record);
export function previewWrite(record: Record<string, unknown>, path: string, value: unknown) {
  if (!safeConditionPath(path)) throw new Error('预览字段路径无效');
  const parts = path.split('.'); let current = record;
  for (const key of parts.slice(0, -1)) {
    const prior = current[key];
    if (!prior || typeof prior !== 'object' || Array.isArray(prior)) current[key] = {};
    current = current[key] as Record<string, unknown>;
  }
  if (value === undefined) delete current[parts[parts.length - 1]]; else current[parts[parts.length - 1]] = value;
}
export function pinsConflict(left: PreviewPin[], right: PreviewPin[]) {
  return left.some(a => right.some(b => a.field === b.field ? !Object.is(a.value, b.value) : a.field.startsWith(b.field + '.') || b.field.startsWith(a.field + '.')));
}
/** Only this selection domain is mutually exclusive. Conditions are kept separately. */
export function toggleMapping(current: MappingPreview[], next: MappingPreview): MappingPreview[] {
  if (current.some(item => item.group === next.group && item.row === next.row)) return current.filter(item => item.group !== next.group);
  return [...current.filter(item => item.group !== next.group && !pinsConflict(item.pins, next.pins)), next];
}
export function previewClassName(node: CategoryNode, mode: PreviewNameMode): { value?: string; description: string } {
  const level = node.path.skind2 ? 'skind2' : node.path.skind ? 'skind' : node.path.kind ? 'kind' : 'class';
  const names = node.classificationLabels?.[level];
  if (mode === 'en') return { value: names?.en || undefined, description: names?.en ? '名称（en）' : '该分类没有英文名称，使用配置中的真实回退' };
  if (mode === 'zh') return { value: names?.zh || names?.en || undefined, description: names?.zh ? '名称（zh）' : '中文为空，回退英文或配置来源' };
  return { description: 'Name 留空，按当前 Label 来源执行真实回退' };
}
function protectedPins(config: ConfigPackageV3, node: CategoryNode, selected: Record<string, unknown>): PreviewPin[] {
  const role = resolveNodeFieldSettings(config, node.path).value.structure;
  const keys = ['ID', 'World', 'Type', 'Class', 'Kind', 'SKind', 'SKind2', role?.hostField, role?.selectorField].filter(Boolean) as string[];
  return keys.flatMap(field => { const value = previewRead(selected, field); return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' ? [{ field, value }] : []; });
}
export function geometryForPreview(type: unknown): GeometryKind { return type === 'Points' ? 'Point' : type === 'Polyline' ? 'LineString' : 'Polygon'; }
export function rulePreviewGroups(rules: ZoomPriorityRule[], id: string, zoom: number) {
  const index = rules.findIndex(rule => rule.id === id), rule = rules[index];
  if (!rule?.when?.fields) return undefined;
  const range = renderRuleRange(rule);
  if (zoom < range.min || zoom > range.max) return undefined;
  const groups = [{ group: rule.when.fields, negate: false }];
  for (const later of rules.slice(index + 1)) {
    const window = renderRuleRange(later);
    if (zoom < window.min || zoom > window.max) continue;
    if (!later.when?.fields) return undefined;
    groups.push({ group: later.when.fields, negate: true });
  }
  return groups;
}
export function buildPreview(config: ConfigPackageV3, node: CategoryNode, base: { features: unknown[] }, selectedId: string, mode: PreviewNameMode, mappings: MappingPreview[], conditionRule: string | undefined, zoom: number) {
  const fixture = structuredClone(base), selected = fixture.features.find(item => (item as Record<string, unknown>).ID === selectedId) as Record<string, unknown> | undefined;
  if (!selected) return { fixture, error: '未找到当前业务样例，未应用预览。' };
  const name = previewClassName(node, mode); previewWrite(selected, 'Name', name.value);
  const geometry = geometryForPreview(selected.Type), profile = resolveGeometryProfile(config, node.path, geometry);
  const pins = [...protectedPins(config, node, selected), ...mappings.flatMap(item => item.pins)];
  let groups: ReturnType<typeof rulePreviewGroups> = [];
  if (conditionRule) groups = rulePreviewGroups(profile?.zoomPriority.rules ?? [], conditionRule, zoom);
  if (!groups) return { fixture: { features: [] }, error: '当前 Zoom 下，该条件规则被后续规则覆盖或不在范围内；未应用预览。' };
  const result = solveConditionWitness(groups, resolveSelectableFields(config, node.path), pins, { seed: selected });
  if (result.status !== 'satisfiable') return { fixture: { features: [] }, error: `预览未应用：${result.status === 'unsatisfiable' ? '条件与映射行存在冲突。' : result.reason}` };
  for (const [field, value] of Object.entries(result.values)) previewWrite(selected, field, value);
  const winner = profile?.zoomPriority.rules.filter(rule => { const range = renderRuleRange(rule); return zoom >= range.min && zoom <= range.max && matchesRenderFields(rule.when?.fields, field => previewRead(selected, field)); }).slice(-1)[0];
  const unapplied = mappings.filter(item => item.ruleId && item.ruleId !== winner?.id);
  const nameOverridden = !Object.is(selected.Name, name.value);
  const fallback = mappings.find(item => item.fallback && item.ruleId);
  let previewConfig = config;
  if (fallback && profile) {
    previewConfig = structuredClone(config);
    // Resolve inheritance first: the preview copy is isolated, never saved.
    const own = previewConfig.nodes.find(item => item.nodeId === node.nodeId)!;
    const cloned = structuredClone(profile);
    for (const rule of cloned.zoomPriority.rules) if (rule.id === fallback.ruleId && rule.style?.pointSymbol && rule.style.pointSymbol.kind !== 'shape') rule.style.pointSymbol = { kind: 'shape', shape: structuredClone(rule.style.pointSymbol.fallback) };
    own.geometryProfiles[geometry] = cloned;
  }
  return { fixture, previewConfig, note: [name.description, nameOverridden ? 'Name 已由启用条件／映射行覆盖' : '', mappings.length ? `临时映射 ${mappings.length} 组；仍按真实末项命中规则显示` : '', unapplied.length ? `其中 ${unapplied.length} 组所在规则未命中或被覆盖；当前生效：${winner?.id ?? '无'}` : ''].filter(Boolean).join('；') };
}
export function chooseConditionZoom(config: ConfigPackageV3, node: CategoryNode, geometry: GeometryKind, ruleId: string, currentZoom: number) {
  const rules = resolveGeometryProfile(config, node.path, geometry)?.zoomPriority.rules ?? [];
  const range = renderRuleRange(rules.find(rule => rule.id === ruleId) ?? { id: '' });
  const candidates = [...new Set([currentZoom, ...Array.from({ length: 9 }, (_, i) => i)])].filter(z => z >= range.min && z <= range.max);
  for (const zoom of candidates) {
    const groups = rulePreviewGroups(rules, ruleId, zoom);
    if (groups && solveConditionWitness(groups, resolveSelectableFields(config, node.path)).status === 'satisfiable') return zoom;
  }
  return undefined;
}
