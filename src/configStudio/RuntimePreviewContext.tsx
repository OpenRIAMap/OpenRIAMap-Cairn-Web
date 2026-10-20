import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import type { CategoryNode, ConfigPackageV3, GeometryKind, PreviewScenario, RenderColorBinding } from './types';
import { resolveColor } from '../components/Rules/configRuntime/configPackageAdapter';
import type { FeatureRecord } from '../components/Rules/rendering/renderRules';
import type { PreviewPin } from './conditionWitness';
import { solveConditionWitness } from './conditionWitness';
import { resolveGeometryProfile } from './runtime';
import { ConfigRuntimePreview, makeConfigPreviewFixture, PREVIEW_SCENARIOS } from './ConfigRuntimePreview';
import { buildPreview, chooseConditionZoom, toggleMapping, previewWrite, type MappingPreview, type PreviewNameMode } from './previewState';
import { HelpLabel } from './SettingHelp';

type Scope = { ruleId: string; geometry: GeometryKind; pins?: PreviewPin[]; fallback?: boolean };
const RuleScope = createContext<Scope | undefined>(undefined);
type Controller = {
  mappings: MappingPreview[]; condition?: string; name: PreviewNameMode; zoom: number; notice: string;
  chooseMapping: (next: MappingPreview) => void; syncMapping: (group: string, rows: Array<{ id: string; pins: PreviewPin[] }>) => void;
  removeMapping: (group: string) => void; chooseCondition: (scope: Scope) => void; setName: (mode: PreviewNameMode) => void;
  result: ReturnType<typeof buildPreview> | undefined; setZoom: (zoom: number) => void; zoomRequest: { value: number; token: number };
};
const PreviewContext = createContext<Controller | undefined>(undefined);
export const useRulePreviewScope = () => useContext(RuleScope);
export function RulePreviewScope({ ruleId, geometry, pins, fallback, children }: Scope & { children: ReactNode }) {
  const parent = useContext(RuleScope);
  return <RuleScope.Provider value={{ ruleId, geometry, pins: [...(parent?.pins ?? []), ...(pins ?? [])], fallback: fallback ?? parent?.fallback }}>{children}</RuleScope.Provider>;
}
export function RuntimePreviewProvider({ config, node, scenario, onShow, children, resetKey }: { config: ConfigPackageV3; node?: CategoryNode; scenario?: PreviewScenario; onShow: () => void; children: ReactNode; resetKey?: string }) {
  const [mappings, setMappings] = useState<MappingPreview[]>([]), [condition, setCondition] = useState<string>();
  const [name, setName] = useState<PreviewNameMode>('zh'), [notice, setNotice] = useState('');
  const [zoom, setZoom] = useState(4), [zoomRequest, setZoomRequest] = useState({ value: 4, token: 0 });
  useEffect(() => { const value = PREVIEW_SCENARIOS.find(item => item.id === scenario)?.zoom ?? 4; setMappings([]); setCondition(undefined); setNotice(''); setZoom(value); setZoomRequest(v => ({ value, token: v.token + 1 })); }, [node?.nodeId, scenario, resetKey]);
  const chooseMapping = useCallback((next: MappingPreview) => { setMappings(current => toggleMapping(current, next)); setNotice(''); onShow(); }, [onShow]);
  const removeMapping = useCallback((group: string) => setMappings(current => current.some(item => item.group === group) ? current.filter(item => item.group !== group) : current), []);
  const syncMapping = useCallback((group: string, rows: Array<{ id: string; pins: PreviewPin[] }>) => setMappings(current => {
    const item = current.find(item => item.group === group); if (!item) return current;
    const row = rows.find(row => row.id === item.row); if (!row) return current.filter(selected => selected !== item);
    if (JSON.stringify(item.pins) === JSON.stringify(row.pins)) return current;
    // An edited active row remains selected; contradictions are reported by the joint solver.
    return current.map(selected => selected === item ? { ...item, pins: row.pins } : selected);
  }), []);
  const chooseCondition = useCallback((scope: Scope) => {
    if (condition === scope.ruleId) { setCondition(undefined); setNotice(''); return; }
    if (!node) return;
    const next = chooseConditionZoom(config, node, scope.geometry, scope.ruleId, zoom);
    if (next === undefined) { setNotice('该规则没有可安全构造且实际生效的样例（可能被后续规则覆盖）；原选择已保留。'); return; }
    setCondition(scope.ruleId); setZoom(next); setZoomRequest(v => ({ value: next, token: v.token + 1 })); setNotice(''); onShow();
  }, [condition, config, node, zoom, onShow]);
  useEffect(() => {
    if (!condition || !node || !scenario) return;
    const geometry = PREVIEW_SCENARIOS.find(item => item.id === scenario)?.geometry;
    if (!geometry || !resolveGeometryProfile(config,node.path,geometry)?.zoomPriority.rules.some(rule => rule.id === condition && rule.when?.fields)) setCondition(undefined);
  },[config,node,scenario,condition]);
  const result = useMemo(() => node && scenario ? buildPreview(config, node, makeConfigPreviewFixture(config, node, scenario), `config-preview-${scenario}`, name, mappings, condition, zoom) : undefined, [config, node, scenario, name, mappings, condition, zoom]);
  return <PreviewContext.Provider value={{ mappings, condition, name, zoom, notice, chooseMapping, syncMapping, removeMapping, chooseCondition, setName, result, setZoom, zoomRequest }}>{children}</PreviewContext.Provider>;
}
/** Stable UI-only row identities follow object moves; editing a row keeps its position identity. */
export function usePreviewRowKeys<T extends object>(rows: T[]): string[] {
  const scope = useId(), sequence = useRef(0), previous = useRef<Array<{ row: T; key: string }>>([]);
  const next = rows.map((row, index) => ({ row, key: previous.current.find(item => item.row === row)?.key ?? (rows.length === previous.current.length ? previous.current[index]?.key : undefined) ?? `${scope}-${sequence.current++}` }));
  // An edited row and a moved neighbour must never acquire the same key.
  const used = new Set<string>(); for (const item of next) { if (used.has(item.key)) item.key = `${scope}-${sequence.current++}`; used.add(item.key); }
  previous.current = next; return next.map(item => item.key);
}
export function useMappingPreview(rows: Array<{ id: string; pins: PreviewPin[] }>) {
  const controller = useContext(PreviewContext), scope = useContext(RuleScope), group = useId();
  const rowsWithScope = rows.map(row => ({ ...row, pins: [...(scope?.pins ?? []), ...row.pins] })), signature = JSON.stringify(rowsWithScope);
  const sync = controller?.syncMapping, remove = controller?.removeMapping;
  useEffect(() => { sync?.(group, rowsWithScope); }, [sync, group, signature]); // values, not callback identity
  useEffect(() => () => remove?.(group), [remove, group]);
  return { available: Boolean(controller && scope), active: controller?.mappings.find(item => item.group === group)?.row, toggle: (id: string) => {
    const row = rowsWithScope.find(row => row.id === id); if (row) controller?.chooseMapping({ group, row: id, pins: row.pins, ruleId: scope?.ruleId, fallback: scope?.fallback });
  } };
}
export function MappingPreviewButton({ preview, row, index }: { preview: ReturnType<typeof useMappingPreview>; row: string; index: number }) {
  return preview.available ? <button type="button" aria-pressed={preview.active === row} className={`rounded border px-2 py-1 text-xs ${preview.active === row ? 'border-violet-500 bg-violet-100 text-violet-800' : 'bg-white'}`} onClick={() => preview.toggle(row)}>{preview.active === row ? '取消显示' : '显示'}第 {index + 1} 行</button> : null;
}
export function ConditionPreviewButton() {
  const controller = useContext(PreviewContext), scope = useContext(RuleScope);
  return controller && scope ? <button type="button" aria-pressed={controller.condition === scope.ruleId} className="ml-2 rounded border border-violet-300 bg-white px-2 py-1 text-xs text-violet-800" onClick={() => controller.chooseCondition(scope)}>{controller.condition === scope.ruleId ? '取消显示效果' : '显示效果'}</button> : null;
}
export function PreviewNameSelector() {
  const controller = useContext(PreviewContext);
  return controller ? <HelpLabel context="RuntimePreviewContext" className="grid min-w-0 flex-1 basis-32 gap-1 text-xs">Name 状态<select className="rounded border px-2 py-1" value={controller.name} onChange={e => controller.setName(e.target.value as PreviewNameMode)}><option value="zh">名称（zh）</option><option value="en">名称（en）</option><option value="fallback">留空并使用回退</option></select></HelpLabel> : null;
}
export function ConnectedConfigRuntimePreview(props: React.ComponentProps<typeof ConfigRuntimePreview>) {
  const controller = useContext(PreviewContext), result = controller?.result;
  return <div className="flex h-full min-h-0 flex-col"><div className="min-h-0 flex-1"><ConfigRuntimePreview {...props} config={result?.previewConfig ?? props.config} fixture={result?.fixture} zoomRequest={controller?.zoomRequest} onZoomChange={controller?.setZoom} /></div><p role={result?.error || controller?.notice ? 'alert' : 'status'} className={`shrink-0 p-2 text-xs ${result?.error || controller?.notice ? 'bg-rose-50 text-rose-800' : 'bg-slate-50 text-slate-600'}`}>{controller?.notice || result?.error || result?.note}</p></div>;
}
export function usePreviewColor() {
  const controller = useContext(PreviewContext);
  const selected = controller?.result?.fixture.features.find(item => String((item as Record<string, unknown>).ID).startsWith('config-preview-') && (item as Record<string, unknown>).ID !== 'config-preview-context-host') as Record<string, unknown> | undefined;
  // Use the production colour resolver, with only the current fixture. External business targets are never invented.
  return (binding: RenderColorBinding, fallback: string) => resolveColor({ uid: 'icon-dialog-preview', featureInfo: selected ?? {}, meta: { Class: selected?.Class ?? '' } } as FeatureRecord, binding, fallback);
}
/** Modal edits own their preview pins; closing cannot alter the underlying validator selection. */
export function PreviewDraftScope({ children }: { children: ReactNode }) {
  const parent = useContext(PreviewContext), [mappings, setMappings] = useState<MappingPreview[]>([]);
  const removeMapping = useCallback((group: string) => setMappings(current => current.filter(item => item.group !== group)), []);
  const chooseMapping = useCallback((next: MappingPreview) => setMappings(current => toggleMapping(current, next)), []);
  const syncMapping = useCallback((group: string, rows: Array<{ id: string; pins: PreviewPin[] }>) => setMappings(current => {
    const selected = current.find(item => item.group === group), row = rows.find(row => row.id === selected?.row);
    if (!selected) return current; if (!row) return current.filter(item => item !== selected);
    return JSON.stringify(row.pins) === JSON.stringify(selected.pins) ? current : current.map(item => item === selected ? { ...selected, pins: row.pins } : item);
  }), []);
  const result = useMemo(() => {
    if (!parent?.result) return undefined;
    const fixture = structuredClone(parent.result.fixture), feature = fixture.features.find(item => String((item as Record<string, unknown>).ID).startsWith('config-preview-') && (item as Record<string, unknown>).ID !== 'config-preview-context-host') as Record<string, unknown> | undefined;
    const pins=mappings.flatMap(item=>item.pins);
    if(solveConditionWitness([],[],pins,{seed:feature,respectRequired:false}).status==='unsatisfiable')return {fixture:{features:[]},error:'弹窗预览字段值与外层映射存在冲突，未应用临时效果。'};
    if (feature) for (const pin of pins) { // All paths passed through the shared safe writer.
      previewWrite(feature, pin.field, pin.value);
    }
    return { ...parent.result, fixture };
  }, [parent?.result, mappings]);
  return parent ? <PreviewContext.Provider value={{ ...parent, mappings, result, chooseMapping, removeMapping, syncMapping }}>{children}</PreviewContext.Provider> : <>{children}</>;
}
