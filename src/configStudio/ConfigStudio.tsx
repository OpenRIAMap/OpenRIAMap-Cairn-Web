import {RuleInteractionEditor} from './RuleInteractionEditor';
import { declareNewIconCapability } from './pointSymbol';
import { PointSymbolEditor } from './PointSymbolEditor';
import { LabelAppearanceEditor } from './LabelAppearanceEditor';
import { RenderRuleTitle } from './RenderRuleTitle';
import { RuntimePreviewProvider, RulePreviewScope, ConnectedConfigRuntimePreview, PreviewNameSelector } from './RuntimePreviewContext';
import {GlobalPackageControls} from './GlobalPackageControls';
import {HelpLabel,HelpControl} from './SettingHelp';
import { mergeApplicationSection, applicationIdentityImpact } from '../core/project/applicationCommit';
import { GeneralRulesEditor, type GeneralDrafts, type RelatedSourceDraft } from './GeneralRulesEditor';
import type { ApplicationSection, ApplicationSettings } from '../core/project/applicationTypes';
import { LabelSourceEditor } from './LabelSourceEditor';
import { NodeFieldSettingsEditor } from './NodeFieldSettingsEditor';
import {ColorBindingEditor} from './ColorBindingEditor';
import { CategoryFileControls } from './CategoryFileControls';
import { CategoryDeletionDialog } from './CategoryDeletionDialog';
import { prepareCategoryDeletion, withCategoryDeletionIssues } from './categoryDeletion';
import { categoryDraftReport } from './categoryDraft';
import { ConfigDialog } from './ConfigDialog';
import { prepareCategoryImport, prepareClassTreeCommit, readCategoryArtifact, type CategoryImportResult, type CategoryArtifact } from './categoryArtifact';
import { persistStudioEditingSession as saveStudioEditingSession, stableConfigText } from './defaultConfigProvider';
import type { ClassTreeSession, StudioEditingSession } from './studioSession';
import {openAddedSetting,studioFoldKey} from './folding';
import {HaloEditor} from './HaloEditor';
import {addC14NodeDefaults} from './contractMigration';
import {CONTRACT_CAPABILITIES,formatContractRevision,formatConfigRevision,migrationMinimumRevision} from './contract';
import {migratePackageToContract} from './contractMigration';
import {MigrationNotices} from './MigrationNotices';
import {captureImportOriginal} from './migrationAttachment';
import {setMigrationAttachment} from './workspaceController';
import { r12PointStyle } from './r12Migration';
import { migrateConfigToR13 } from './r13Migration';
import { confirmPrefillCopies } from './prefillAudit';
import { migrateConfigToR9 } from './r9Migration';
import { getActiveConfigSnapshot, getStudioSessionSnapshot, readDurableActiveConfig, persistActiveConfig, restoreApplicationDefault } from './defaultConfigProvider';
import { LookupTablesWorkspace } from './LookupTablesWorkspace';
import { prepareLookupTableCommit, type LookupTableDraft } from './lookupTableTransaction';
import { TableOptionsEditor } from './TableOptionsEditor';
import { ModuleHelp } from './ModuleHelp';
import { GripOrderControls } from './GripOrderControls';
import { UnifiedRuleExtensions } from './UnifiedRuleExtensions';
import { CategoryPathPicker } from './CategoryPathPicker';
import { CategoryCreationPanel,type CategoryCreationDraft } from './CategoryCreationPanel';
import { NewRenderRulePanel } from './NewRenderRulePanel';
import { RenderFieldConditionsEditor } from './RenderFieldConditionsEditor';
import { renderRuleRange } from './renderRuleConditions';
import { editableGeometryProfile,prepareRenderRule } from './renderRuleTemplates';
import { FieldAdvancedSettings } from './FieldAdvancedSettings';
import { ExtraRuleSettings } from './ExtraRuleSettings';
import { InteractionShapeSettings, RuleInteractionSettings } from './InteractionShapeSettings';
import { CollisionMetricEditor } from './CollisionMetricEditor';
import { LabelPlacementSettings } from './LabelPlacementSettings';
import { NativeSymbolSettings } from './NativeSymbolSettings';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, ChevronRight, FileUp, Maximize2, Minimize2, Plus, Save, SlidersHorizontal, X } from 'lucide-react';
import { readConfigPackageWithDiagnostics } from './package';
import {useWorkspaceState} from './ConfigBootstrap';
import {getWorkspaceState,recordWorkspaceValidation,setImportedDiagnostic} from './workspaceController';
import {validateWorkspace} from './workspaceValidation';
import type {TemporaryDiagnostic} from './temporaryDiagnostic';
import { classificationPathKey, fieldScope, fieldShortKey, resolveEffectiveFields, resolveSelectableFields, resolveGeometryProfile, resolveRenderExtensions, validateConfigPackage } from './runtime';
import { PREVIEW_SCENARIOS, previewScenarioCompatible } from './ConfigRuntimePreview';
import { RenderRuleExtensionsEditor } from './RenderRuleExtensionsEditor';
import { createV32EngineDefaults, defaultRenderRule } from './v32Defaults';
import { V3CardEditor } from './V3CardEditor';
import { WorkflowWorkbench } from './WorkflowWorkbench';
import { canSwitchStudioTab, recoverPackageCandidate, type PackageCandidate, type FeatureDraftScope, type StudioTab } from './studioSession';
import { EngineSettingsWorkspace } from './EngineSettingsWorkspace';
import { prepareEngineCommit, type EngineDraft } from './engineTransaction';
import { validateStudioModule } from './studioModuleValidation';
import type { WorkflowEditingSession } from './WorkflowWorkbench';
import type {
  CategoryNode,
  ClassificationPath,
  Condition,
  ConfigEngineSettings,
  ConfigPackageV3,
  ContextBinding,
  FieldDefinition,
  GeometryInteractionTriggers,
  GeometryKind,
  GeometryProfile,
  InteractionState,
  MountedFeatureRecord,
  PreviewScenario,
  RenderLabelVisualStyle,
  RenderRuleConditionalOverride,
  RenderStyle,
  ZoomPriorityRule,
} from './types';

const geometries: GeometryKind[] = ['Point', 'LineString', 'Polygon'];
const geometryLabel: Record<GeometryKind, string> = { Point: '点', LineString: '线', Polygon: '面' };
const labelFamilies: Array<{ value: RenderLabelVisualStyle['family']; label: string }> = [
  { value: 'gm-bw', label: 'gm-bw · 白填充黑描边' },
  { value: 'gm-outline', label: 'gm-outline · 黑填色白描边' },
  { value: 'gm-wtb', label: 'gm-wtb · 水域蓝描边' },
  { value: 'structure-label', label: 'structure-label · 黑字白光晕' },
  { value: 'bubble-dark', label: 'bubble-dark · 深色气泡' },
  { value: 'rle-line-color', label: 'rle-line-color · 线路色文字' },
  { value: 'rle-pill-color', label: 'rle-pill-color · 线路色胶囊' },
];
const textOnlyFamilies = new Set<RenderLabelVisualStyle['family']>(['gm-bw', 'gm-outline', 'gm-wtb', 'structure-label']);
const interactionStates: InteractionState[] = ['hover', 'selected', 'searchResult', 'editing', 'deletionMarked'];
const interactionStateLabel: Record<InteractionState, string> = {
  hover: '悬停', selected: '选中', searchResult: '搜索结果', editing: '编辑态', deletionMarked: '删除态',
};
function clone<T>(value: T): T { return JSON.parse(JSON.stringify(value)) as T; }
function uid(prefix: string): string { return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`; }
function nodeLabel(node: CategoryNode): string {
  return (['class', 'kind', 'skind', 'skind2'] as const).filter((level) => Boolean(node.path[level])).map((level) => {
    const code = node.path[level] as string;
    const name = node.classificationLabels?.[level]?.zh;
    return name && name !== code ? `${code}（${name}）` : code;
  }).join(' / ');
}
function samePath(a: ClassificationPath, b: ClassificationPath): boolean { return classificationPathKey(a) === classificationPathKey(b); }
function readMountedRecords(): MountedFeatureRecord[] {
  try { return JSON.parse(sessionStorage.getItem('cairnmap-config-studio-mounted-records') ?? '[]') as MountedFeatureRecord[]; }
  catch { return []; }
}
function readLocalConfig(): ConfigPackageV3 { return getActiveConfigSnapshot(); }
function updateNode(config: ConfigPackageV3, nodeId: string, updater: (node: CategoryNode) => CategoryNode): ConfigPackageV3 {
  return { ...config, nodes: config.nodes.map((node) => node.nodeId === nodeId ? updater(node) : node) };
}
function allFieldKeys(config: ConfigPackageV3, path: ClassificationPath): string[] {
  return [...new Set(['ID', 'Name', 'World', 'Class', 'Kind', 'Skind', 'Skind2', ...resolveEffectiveFields(config, path).map((field) => field.key)])];
}

function defaultLabel(geometry: GeometryKind) {
  return clone(defaultRenderRule(geometry).label!);
}
function defaultStyle(geometry: GeometryKind) {
  return clone(defaultRenderRule(geometry).style!);
}

function NumberField({ label, value, onChange, min, max, step = 1, disabled = false }: {
  label: string; value: number | undefined; onChange: (value: number | undefined) => void; min?: number; max?: number; step?: number; disabled?: boolean;
}) {
  return <HelpLabel context="ConfigStudio" className="text-xs">{label}<input disabled={disabled} className="mt-1 w-full rounded border px-2 py-1 disabled:bg-slate-100" type="number" min={min} max={max} step={step} value={value ?? ''} onChange={(event) => onChange(event.target.value === '' ? undefined : Number(event.target.value))} /></HelpLabel>;
}

/** Keeps the requested numeric entry and visible 0–1 slider in one source of truth. */
function OpacityField({ label, value, onChange }: { label: string; value: number | undefined; onChange: (value: number) => void }) {
  const resolved = Math.min(1, Math.max(0, Number.isFinite(value) ? Number(value) : 1));
  return <HelpLabel context="ConfigStudio" className="min-w-0 text-xs">{label}<span className="mt-1 grid min-w-0 grid-cols-1 min-[1600px]:grid-cols-[minmax(0,1fr)_4rem] items-center gap-2"><input className="w-full min-w-0" type="range" min="0" max="1" step="0.05" value={resolved} onChange={(event) => onChange(Number(event.target.value))} /><input className="w-full rounded border px-2 py-1" type="number" min="0" max="1" step="0.05" value={resolved} onChange={(event) => onChange(Math.min(1, Math.max(0, Number(event.target.value))))} /></span></HelpLabel>;
}

/** Field-conditioned branches are still inside one inclusive Zoom rule.  This
 * is deliberately a small, typed editor because V1 only uses them for a few
 * real branches (for example RLE direction and PLF connection state), not a
 * second parallel time line. */
function ConditionalOverridesEditor({ config, path, geometry, rule, onChange }: {
  config: ConfigPackageV3; path: ClassificationPath; geometry: GeometryKind; rule: ZoomPriorityRule; onChange: (next: ZoomPriorityRule) => void;
}) {
  const fields = allFieldKeys(config, path);
  const overrides = rule.conditionalOverrides ?? [];
  const representations = geometry === 'Polygon'
    ? [['hidden', '隐藏'], ['point', '面内中点'], ['geometry', '显示面'], ['labelOnly', '仅标签']]
    : geometry === 'LineString' ? [['hidden', '隐藏'], ['geometry', '显示线'], ['labelOnly', '仅标签']]
      : [['hidden', '隐藏'], ['geometry', '显示点'], ['labelOnly', '仅标签']];
  const patch = (index: number, next: RenderRuleConditionalOverride) => onChange({ ...rule, conditionalOverrides: overrides.map((item, current) => current === index ? next : item) });
  const add = () => {
    const baseLabel = rule.label ? clone(rule.label) : defaultLabel(geometry);
    const next: RenderRuleConditionalOverride = {
      id: uid('field-branch'),
      when: [{ kind: 'fieldEquals', field: fields[0] ?? 'Name', value: '' }],
      representation: rule.representation,
      label: { ...baseLabel, visible: false },
    };
    onChange({ ...rule, conditionalOverrides: [...overrides, next] });
  };
  const conditionFor = (kind: 'fieldEquals' | 'fieldIn' | 'fieldPresent', field: string, value = '', present = true): Condition => {
    if (kind === 'fieldIn') return { kind, field, values: value.split(',').map((item) => item.trim()).filter(Boolean) };
    if (kind === 'fieldPresent') return { kind, field, present };
    return { kind, field, value };
  };
  return <details className="rounded border border-amber-200 bg-amber-50/40 p-2"><summary className="cursor-pointer text-sm font-medium">字段条件分支（同一 Zoom 规则内）</summary><p className="mt-1 text-xs text-slate-600">用于真实 V1 的方向、关联状态等字段分支。分支不会新增 Zoom 区间；顺序从上至下覆盖，后一个命中的分支优先。</p>
    <div className="mt-2 space-y-2">{overrides.map((override, index) => {
      const source = override.when[0] ?? { kind: 'fieldEquals' as const, field: fields[0] ?? 'Name', value: '' };
      const conditionKind = source.kind === 'fieldIn' || source.kind === 'fieldPresent' ? source.kind : 'fieldEquals';
      const sourceField = source.kind === 'always' || source.kind === 'zoomRange' || source.kind === 'bboxArea' ? fields[0] ?? 'Name' : source.field;
      const sourceValue = source.kind === 'fieldIn' ? source.values.join(', ') : source.kind === 'fieldEquals' ? source.value : '';
      const baseStyle = override.style;
      const branchLabel = override.label;
      const updateCondition = (kind: 'fieldEquals' | 'fieldIn' | 'fieldPresent' = conditionKind, field = sourceField, value = sourceValue, present = source.kind === 'fieldPresent' ? source.present : true) => patch(index, { ...override, when: [conditionFor(kind, field, value, present)] });
      return <article key={override.id} className="rounded border bg-white p-2"><div className="cm-flex-grid gap-2"><HelpLabel context="ConfigStudio" className="text-xs">条件<select className="mt-1 w-full rounded border px-2 py-1" value={conditionKind} onChange={(event) => updateCondition(event.target.value as typeof conditionKind)}><option value="fieldEquals">字段等于</option><option value="fieldIn">字段属于（多值）</option><option value="fieldPresent">字段存在/为空</option></select></HelpLabel><HelpLabel context="ConfigStudio" className="text-xs">字段<select className="mt-1 w-full rounded border px-2 py-1" value={sourceField} onChange={(event) => updateCondition(conditionKind, event.target.value)}>{fields.map((field) => <option key={field}>{field}</option>)}</select></HelpLabel>{conditionKind === 'fieldPresent' ? <HelpLabel context="ConfigStudio" className="inline-flex items-center gap-1 pt-5 text-xs"><input type="checkbox" checked={source.kind === 'fieldPresent' ? source.present : true} onChange={(event) => updateCondition(conditionKind, sourceField, '', event.target.checked)} />字段存在时命中</HelpLabel> : <HelpLabel context="ConfigStudio" className="text-xs">{conditionKind === 'fieldIn' ? '匹配值（逗号分隔）' : '匹配值'}<input className="mt-1 w-full rounded border px-2 py-1" value={sourceValue} onChange={(event) => updateCondition(conditionKind, sourceField, event.target.value)} /></HelpLabel>}<button type="button" className="mt-5 text-xs text-rose-700" onClick={() => onChange({ ...rule, conditionalOverrides: overrides.filter((_, current) => current !== index) })}>删除分支</button></div>
        <div className="mt-2 cm-flex-grid gap-2"><HelpLabel context="ConfigStudio" className="text-xs">该分支显示种类<select className="mt-1 w-full rounded border px-2 py-1" value={override.representation ?? rule.representation ?? 'geometry'} onChange={(event) => patch(index, { ...override, representation: event.target.value as RenderRuleConditionalOverride['representation'] })}>{representations.map(([value, name]) => <option key={value} value={value}>{name}</option>)}</select></HelpLabel><HelpLabel context="ConfigStudio" className="inline-flex items-center gap-1 pt-5 text-xs"><input type="checkbox" checked={Boolean(baseStyle)} onChange={(event) => patch(index, { ...override, style: event.target.checked ? clone(rule.style ?? defaultStyle(geometry)) : undefined })} />覆盖显示效果</HelpLabel><HelpLabel context="ConfigStudio" className="inline-flex items-center gap-1 pt-5 text-xs"><input type="checkbox" checked={Boolean(branchLabel)} onChange={(event) => patch(index, { ...override, label: event.target.checked ? clone(rule.label ?? defaultLabel(geometry)) : undefined })} />覆盖 Label 效果</HelpLabel></div>
        {baseStyle ? <div className="mt-2 rounded border border-slate-200 p-2"><div className="cm-flex-grid gap-2"><NumberField label="点大小" value={baseStyle.size} min={1} onChange={(value) => patch(index, { ...override, style: { ...baseStyle, size: value } })} /><NumberField label="描边粗细" value={baseStyle.weight} min={0} step={0.5} onChange={(value) => patch(index, { ...override, style: { ...baseStyle, weight: value } })} /><OpacityField label="描边透明度" value={baseStyle.strokeOpacity} onChange={(value) => patch(index, { ...override, style: { ...baseStyle, strokeOpacity: value } })} /><OpacityField label="填色透明度" value={baseStyle.fillOpacity ?? 0.88} onChange={(value) => patch(index, { ...override, style: { ...baseStyle, fillOpacity: value } })} /></div><div className="mt-2 cm-flex-grid gap-2"><ColorBindingEditor config={config} sourcePath={path} fields={fields} label="条件描边" value={baseStyle.stroke ?? { mode: 'fixed', color: '#334155' }} onChange={(stroke) => patch(index, { ...override, style: { ...baseStyle, stroke } })} /><ColorBindingEditor config={config} sourcePath={path} fields={fields} label="条件填色" value={baseStyle.fill ?? { mode: 'fixed', color: '#334155' }} onChange={(fill) => patch(index, { ...override, style: { ...baseStyle, fill } })} /></div></div> : null}
        {branchLabel ? <div className="mt-2 cm-flex-grid gap-2 rounded border border-slate-200 p-2"><HelpLabel context="ConfigStudio" className="inline-flex items-center gap-1 pt-5 text-xs"><input type="checkbox" checked={branchLabel.visible} onChange={(event) => patch(index, { ...override, label: { ...branchLabel, visible: event.target.checked } })} />显示 Label</HelpLabel><HelpLabel context="ConfigStudio" className="text-xs">样式<select className="mt-1 w-full rounded border px-2 py-1" value={branchLabel.style?.family ?? 'gm-outline'} onChange={(event) => patch(index, { ...override, label: { ...branchLabel, style: { ...(branchLabel.style ?? { size: 14 }), family: event.target.value as RenderLabelVisualStyle['family'] } } })}>{labelFamilies.map((family) => <option key={family.value} value={family.value}>{family.label}</option>)}</select></HelpLabel><NumberField label="Label 大小" value={branchLabel.style?.size ?? 14} min={6} max={72} onChange={(value) => patch(index, { ...override, label: { ...branchLabel, style: { ...(branchLabel.style ?? { family: 'gm-outline' }), size: value ?? 14 } } })} /><HelpLabel context="ConfigStudio" className="text-xs">来源<select className="mt-1 w-full rounded border px-2 py-1" value={branchLabel.source ?? 'Name'} onChange={(event) => patch(index, { ...override, label: { ...branchLabel, source: event.target.value } })}>{fields.map((field) => <option key={field}>{field}</option>)}</select></HelpLabel></div> : null}
        <details className="mt-2 rounded border p-2"><summary className="text-xs">条件分支高级设置</summary>{(() => {
          const branch: ZoomPriorityRule = { ...rule, ...override, when: rule.when, conditionalOverrides: undefined, extensions: override.extensions ?? {}, style: override.style ?? rule.style, label: override.label ?? rule.label };
          const update = (next: ZoomPriorityRule) => patch(index, { ...override, style: next.style, label: next.label, priority: next.priority, geometryStack: next.geometryStack, extensions: next.extensions });
          return <><NativeSymbolSettings rule={branch} onChange={update} allowOffsets={geometry === 'Point' || branch.representation === 'point'} /><LabelPlacementSettings rule={branch} onChange={update} allowDecoration={geometry === 'Point' && branch.style?.symbolVisibility !== 'withLabel'} /><CollisionMetricEditor rule={branch} onChange={update} fields={fields} /><UnifiedRuleExtensions config={config} path={path} fields={fields} geometry={geometry} rule={branch} onChange={update} /></>;
        })()}</details>
      </article>;
    })}</div><button type="button" className="mt-2 inline-flex items-center gap-1 rounded border px-2 py-1 text-xs" onClick={add}><Plus className="h-3 w-3" />添加字段条件分支</button>
  </details>;
}

function RuleExtensionsEditor({ geometry, rule, onChange }: { geometry: GeometryKind; rule: ZoomPriorityRule; onChange: (rule: ZoomPriorityRule) => void }) {
  const ext = rule.extensions ?? {};
  const screen = ext.screenGate ?? { mode: 'inherit' as const };
  const labelText = ext.labelText ?? {};
  const density = ext.density ?? { mode: 'inherit' as const };
  const lineLabel = ext.lineLabel ?? { profile: 'inherit' as const };
  const anchorOptions = geometry === 'Point'
    ? [['inherit', '继承'], ['featureCenter', '完整中心']]
    : geometry === 'LineString'
      ? [['inherit', '继承'], ['featureCenter', '完整中心'], ['lineCenter', '线中点'], ['lineCandidates', '线候选点']]
      : [['inherit', '继承'], ['featureCenter', '完整中心'], ['interior', '面内固定'], ['visibleInterior', '可见面内']];
  const anchorCandidates = ['C', 'N', 'S', 'E', 'W', 'NE', 'NW', 'SE', 'SW'] as const;
  const patch = (next: typeof ext) => onChange({ ...rule, extensions: next });
  return <details className="rounded border border-indigo-200 bg-indigo-50/40 p-2"><summary className="cursor-pointer text-sm font-medium">扩展规则（引擎默认值，可按规则覆盖）</summary>
    <p className="mt-1 text-xs text-slate-600">Pane、点击容差、屏幕面积/长度、文字截断、候选锚点、密度预算和线标签算法均为类型化字段；没有 JSON 回退和 V1 成品规则开关。</p>
    <div className="mt-2 cm-flex-grid gap-2"><HelpLabel context="ConfigStudio" className="text-xs">屏幕阈值<select className="mt-1 w-full rounded border px-2 py-1" value={screen.mode} onChange={(event) => patch({ ...ext, screenGate: { ...screen, mode: event.target.value as 'inherit' | 'override' } })}><option value="inherit">继承全局</option><option value="override">本规则覆盖</option></select></HelpLabel>
      {geometry === 'Polygon' ? <NumberField label="最小屏幕面积 px²" value={screen.minScreenAreaPx} min={0} disabled={screen.mode !== 'override'} onChange={(value) => patch({ ...ext, screenGate: { ...screen, minScreenAreaPx: value } })} /> : null}
      {geometry === 'LineString' ? <NumberField label="最小屏幕长度 px" value={screen.minScreenLengthPx} min={0} disabled={screen.mode !== 'override'} onChange={(value) => patch({ ...ext, screenGate: { ...screen, minScreenLengthPx: value } })} /> : null}
      <HelpLabel context="ConfigStudio" className="text-xs">Pane 覆盖<select className="mt-1 w-full rounded border px-2 py-1" value={ext.pane ?? 'auto'} onChange={(event) => patch({ ...ext, pane: event.target.value as NonNullable<typeof ext.pane> })}><option value="auto">自动（引擎默认）</option><option value="overlay">普通线/面</option><option value="overlay-top">顶层线/面</option><option value="point">普通点</option><option value="point-top">顶层点</option></select></HelpLabel>
      <NumberField label="点击容差 px" value={ext.hitTolerancePx} min={0} max={80} onChange={(value) => patch({ ...ext, hitTolerancePx: value })} />
    </div>
    <div className="mt-2 cm-flex-grid gap-2"><NumberField label="Label 最大字符数" value={labelText.maxChars} min={1} onChange={(value) => patch({ ...ext, labelText: { ...labelText, maxChars: value } })} />
      <HelpLabel context="ConfigStudio" className="text-xs">多行 Label<input className="ml-2" type="checkbox" checked={Boolean(labelText.multiline)} onChange={(event) => patch({ ...ext, labelText: { ...labelText, multiline: event.target.checked } })} /></HelpLabel>
      <NumberField label="最大行数" value={labelText.maxLines} min={1} disabled={!labelText.multiline} onChange={(value) => patch({ ...ext, labelText: { ...labelText, maxLines: value } })} />
      <HelpLabel context="ConfigStudio" className="text-xs">截断后缀<input className="mt-1 w-full rounded border px-2 py-1" value={labelText.suffix ?? '…'} onChange={(event) => patch({ ...ext, labelText: { ...labelText, suffix: event.target.value } })} /></HelpLabel>
    </div>
    <div className="mt-2 rounded border border-indigo-100 bg-white p-2"><div className="cm-flex-grid gap-2"><HelpLabel context="ConfigStudio" className="text-xs">候选锚点策略<select className="mt-1 w-full rounded border px-2 py-1" value={ext.anchor?.strategy ?? 'inherit'} onChange={(event) => patch({ ...ext, anchor: { ...ext.anchor, strategy: event.target.value as NonNullable<typeof ext.anchor>['strategy'] } })}>{anchorOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></HelpLabel>
      <HelpLabel context="ConfigStudio" className="inline-flex items-center gap-1 pt-5 text-xs"><input type="checkbox" checked={Boolean(ext.anchor?.preferViewportCenter)} onChange={(event) => patch({ ...ext, anchor: { ...ext.anchor, preferViewportCenter: event.target.checked } })} />大要素优先视窗中心</HelpLabel>
      <HelpLabel context="ConfigStudio" className="text-xs">密度预算<select className="mt-1 w-full rounded border px-2 py-1" value={density.mode} onChange={(event) => patch({ ...ext, density: { ...density, mode: event.target.value as 'inherit' | 'override' } })}><option value="inherit">继承</option><option value="override">本规则覆盖</option></select></HelpLabel></div>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs"><span>候选方向：</span>{anchorCandidates.map((candidate) => <HelpLabel context="ConfigStudio" key={candidate}><input type="checkbox" checked={Boolean(ext.anchor?.candidates?.includes(candidate))} onChange={(event) => { const next = new Set(ext.anchor?.candidates ?? []); if (event.target.checked) next.add(candidate); else next.delete(candidate); patch({ ...ext, anchor: { ...ext.anchor, candidates: [...next] } }); }} /> {candidate}</HelpLabel>)}</div>
      <div className="mt-2 cm-flex-grid gap-2"><NumberField label="密度网格 px" value={density.gridSizePx} min={1} disabled={density.mode !== 'override'} onChange={(value) => patch({ ...ext, density: { ...density, gridSizePx: value } })} /><NumberField label="每格最多 Label" value={density.maxLabelsPerGrid} min={1} disabled={density.mode !== 'override'} onChange={(value) => patch({ ...ext, density: { ...density, maxLabelsPerGrid: value } })} /><NumberField label="每格最多符号" value={density.maxSymbolsPerGrid} min={1} disabled={density.mode !== 'override'} onChange={(value) => patch({ ...ext, density: { ...density, maxSymbolsPerGrid: value } })} /></div>
    </div>
    {geometry === 'LineString' ? <div className="mt-2 rounded border border-indigo-100 bg-white p-2"><div className="cm-flex-grid gap-2"><HelpLabel context="ConfigStudio" className="text-xs">线标签算法<select className="mt-1 w-full rounded border px-2 py-1" value={lineLabel.profile} onChange={(event) => patch({ ...ext, lineLabel: { ...lineLabel, profile: event.target.value as NonNullable<typeof ext.lineLabel>['profile'] } })}><option value="inherit">继承</option><option value="standard">标准</option><option value="network">网络</option><option value="strict-on-line">严格沿线</option></select></HelpLabel><HelpLabel context="ConfigStudio" className="text-xs">线文字模式<select className="mt-1 w-full rounded border px-2 py-1" value={lineLabel.textMode ?? 'auto'} onChange={(event) => patch({ ...ext, lineLabel: { ...lineLabel, textMode: event.target.value as NonNullable<typeof lineLabel.textMode> } })}><option value="auto">自动</option><option value="rotatedLabel">旋转文字</option><option value="textPath">沿线字形</option></select></HelpLabel><NumberField label="端点留白比例" value={lineLabel.endpointPaddingRatio} min={0} step={0.01} onChange={(value) => patch({ ...ext, lineLabel: { ...lineLabel, endpointPaddingRatio: value } })} /></div><div className="mt-2 cm-flex-grid gap-2"><NumberField label="端点最小留白 px" value={lineLabel.endpointPaddingMinPx} min={0} onChange={(value) => patch({ ...ext, lineLabel: { ...lineLabel, endpointPaddingMinPx: value } })} /><NumberField label="最大转角" value={lineLabel.maxTurnAngleDeg} min={0} max={180} onChange={(value) => patch({ ...ext, lineLabel: { ...lineLabel, maxTurnAngleDeg: value } })} /><NumberField label="最小线长 px" value={lineLabel.minLengthPx} min={0} onChange={(value) => patch({ ...ext, lineLabel: { ...lineLabel, minLengthPx: value } })} /></div></div> : null}
  </details>;
}
// Kept as a read-only compatibility reference while the complete editor lives
// in RenderRuleExtensionsEditor.  It helps old saved JSX snapshots remain
// explainable without becoming a second editable contract.
void RuleExtensionsEditor;

function LegacyRenderRuleEditor({ config, path, geometry, profile, onChange }: { config: ConfigPackageV3; path: ClassificationPath; geometry: GeometryKind; profile: GeometryProfile; onChange: (value: GeometryProfile) => void }) {
  const rules = profile.zoomPriority.rules;
  const fields = allFieldKeys(config, path);
  const update = (ruleId: string, patch: Partial<ZoomPriorityRule>) => onChange({ ...profile, zoomPriority: { rules: rules.map((rule) => rule.id === ruleId ? { ...rule, ...patch } : rule) } });
  const updateRule = (next: ZoomPriorityRule) => update(next.id, next);
  const append = () => {
    const last = rules[rules.length - 1] ?? defaultRenderRule(geometry);
    const min = Math.max(0, Number(last.minZoom ?? 0));
    const max = Math.min(8, Number(last.maxZoom ?? 8));
    // The intervals are inclusive.  Copying a 0–8 rule verbatim would make
    // the freshly added rule invalid until the author manually repairs both
    // ends, which is a particularly easy way to lose a draft after pressing
    // “添加渲染规则”. Split the previous final interval into two adjacent,
    // non-overlapping intervals instead. The copied visual settings remain
    // editable on the new half.
    if (!Number.isFinite(min) || !Number.isFinite(max) || min >= max) return;
    const split = Math.floor((min + max) / 2);
    const next = clone(last);
    next.id = uid('render');
    next.minZoom = split + 1;
    next.maxZoom = max;
    onChange({
      ...profile,
      zoomPriority: {
        rules: rules.map((rule) => rule.id === last.id ? { ...rule, maxZoom: split } : rule).concat(next),
      },
    });
  };
  const representationOptions = geometry === 'Polygon'
    ? [['hidden', '隐藏'], ['point', '面内中点'], ['geometry', '显示面'], ['labelOnly', '仅标签']]
    : geometry === 'LineString'
      ? [['hidden', '隐藏'], ['geometry', '显示线'], ['labelOnly', '仅标签']]
      : [['hidden', '隐藏'], ['geometry', '显示点'], ['labelOnly', '仅标签']];
  return <section className="space-y-3"><div><h4 className="font-semibold">渲染规则</h4><p className="mt-1 text-xs text-slate-500">规则 Zoom 区间是唯一的渲染规则对象（沿用 V1 的 round(Leaflet Zoom + 3)、0–8 映射）。每条规则独立拥有样式、Label、层级、优先级及扩展覆盖；渲染规则 1 不可删除。</p></div>
    {rules.map((rule, index) => {
      const style = rule.style ?? defaultStyle(geometry);
      const label = rule.label ?? defaultLabel(geometry);
      const visual = label.style ?? defaultLabel(geometry).style!;
      const pointLike = geometry === 'Point' || rule.representation === 'point';
      const supportsFill = geometry !== 'LineString' || pointLike;
      const updateStyle = (patch: Partial<RenderStyle>) => update(rule.id, { style: { ...style, ...patch } });
      const updateLabel = (patch: Partial<typeof label>) => update(rule.id, { label: { ...label, ...patch } });
      const updateVisual = (patch: Partial<RenderLabelVisualStyle>) => updateLabel({ style: { ...visual, ...patch } });
      const metricKinds = geometry === 'Point' ? ['partCount', 'field'] : geometry === 'LineString' ? ['length', 'partCount', 'field'] : ['area', 'partCount', 'field'];
      return <details key={rule.id} data-fold-key={`rule:${rule.id}`} className="rounded border bg-slate-50 p-3"><summary className="cursor-pointer font-medium">渲染规则 {index + 1} · {rule.minZoom ?? 0} ≤ Zoom ≤ {rule.maxZoom ?? 8}</summary><div className="mt-3 space-y-3">
        <div className="cm-flex-grid gap-2"><NumberField label="下界" value={rule.minZoom} min={0} max={8} onChange={(value) => update(rule.id, { minZoom: value })} /><span className="pt-6 text-sm">≤ Zoom ≤</span><NumberField label="上界" value={rule.maxZoom} min={0} max={8} onChange={(value) => update(rule.id, { maxZoom: value })} /><HelpLabel context="ConfigStudio" className="text-xs">显示种类<select className="mt-1 w-full rounded border px-2 py-1" value={rule.representation ?? 'geometry'} onChange={(event) => update(rule.id, { representation: event.target.value as ZoomPriorityRule['representation'] })}>{representationOptions.map(([value, name]) => <option key={value} value={value}>{name}</option>)}</select></HelpLabel>{rules.length > 1 ? <button type="button" className="mt-5 text-xs text-rose-700" onClick={() => onChange({ ...profile, zoomPriority: { rules: rules.filter((item) => item.id !== rule.id) } })}>删除</button> : <span />}</div>
        {rule.representation !== 'hidden' ? <section className="rounded border bg-white p-2"><h5 className="font-medium">显示效果</h5><div className="mt-2 cm-flex-grid gap-2"><HelpLabel context="ConfigStudio" className="text-xs">显示效果<select className="mt-1 w-full rounded border px-2 py-1" value={pointLike ? style.pointShape ?? 'circle' : style.dashPreset ?? 'solid'} onChange={(event) => updateStyle(pointLike ? { pointShape: event.target.value as RenderStyle['pointShape'] } : { dashPreset: event.target.value as RenderStyle['dashPreset'] })}>{pointLike ? [['circle', '圆圈'], ['square', '方块'], ['triangle', '三角'], ['regular4', '正方形'], ['regular5', '五边形'], ['regular6', '六边形']].map(([value, name]) => <option key={value} value={value}>{name}</option>) : [['solid', '实线'], ['dash', '虚线'], ['dotDash', '点-短线虚线'], ['dotDotDash', '点-点-短线虚线']].map(([value, name]) => <option key={value} value={value}>{name}</option>)}</select></HelpLabel>{pointLike ? <NumberField label="大小" value={style.size} min={1} onChange={(value) => updateStyle({ size: value })} /> : null}<NumberField label="描边粗细" value={style.weight} min={0} step={0.5} onChange={(value) => updateStyle({ weight: value })} />{geometry !== 'Point' ? <><HelpLabel context="ConfigStudio" className="text-xs">线端<select className="mt-1 w-full rounded border px-2 py-1" value={style.lineCap ?? 'round'} onChange={(event) => updateStyle({ lineCap: event.target.value as RenderStyle['lineCap'] })}><option value="round">圆</option><option value="butt">平</option><option value="square">方</option></select></HelpLabel><HelpLabel context="ConfigStudio" className="text-xs">转角<select className="mt-1 w-full rounded border px-2 py-1" value={style.lineJoin ?? 'round'} onChange={(event) => updateStyle({ lineJoin: event.target.value as RenderStyle['lineJoin'] })}><option value="round">圆</option><option value="miter">尖</option><option value="bevel">斜</option></select></HelpLabel></> : null}</div><div className={`mt-2 grid gap-2 ${supportsFill ? 'lg:grid-cols-2' : ''}`}><ColorBindingEditor config={config} sourcePath={path} fields={fields} label="描边" value={style.stroke ?? { mode: 'fixed', color: '#334155' }} onChange={(stroke) => updateStyle({ stroke })} />{supportsFill ? <ColorBindingEditor config={config} sourcePath={path} fields={fields} label="填色" value={style.fill ?? { mode: 'fixed', color: '#334155' }} onChange={(fill) => updateStyle({ fill })} /> : null}</div><div className="mt-2 cm-flex-grid gap-2"><OpacityField label="描边透明度" value={style.strokeOpacity} onChange={(value) => updateStyle({ strokeOpacity: value })} />{supportsFill ? <OpacityField label="填色透明度" value={style.fillOpacity ?? (geometry === 'Polygon' ? 0.24 : 0.88)} onChange={(value) => updateStyle({ fillOpacity: value })} /> : null}</div>{pointLike ? <details className="mt-2 rounded border border-slate-200 bg-slate-50 p-2"><summary className="cursor-pointer text-xs font-medium">图标覆盖（本 Zoom 规则）</summary><div className="mt-2 cm-flex-grid gap-2"><HelpLabel context="ConfigStudio" className="inline-flex items-center gap-1 pt-5 text-xs"><input type="checkbox" checked={Boolean(style.icon)} onChange={(event) => updateStyle({ icon: event.target.checked ? { source: fields.find((field) => /icon|image|picture/i.test(field)) ?? fields[0] ?? 'iconUrl', size: [32, 32], anchor: [16, 16], fallback: 'circle' } : undefined })} />使用外部图标字段</HelpLabel>{style.icon ? <><HelpLabel context="ConfigStudio" className="text-xs">图标 URL 字段<select className="mt-1 w-full rounded border px-2 py-1" value={style.icon.source} onChange={(event) => updateStyle({ icon: { ...style.icon!, source: event.target.value } })}>{fields.map((field) => <option key={field}>{field}</option>)}</select></HelpLabel><NumberField label="宽度 px" value={style.icon.size[0]} min={1} onChange={(value) => updateStyle({ icon: { ...style.icon!, size: [value ?? 32, style.icon!.size[1]] } })} /><NumberField label="高度 px" value={style.icon.size[1]} min={1} onChange={(value) => updateStyle({ icon: { ...style.icon!, size: [style.icon!.size[0], value ?? 32] } })} /><HelpLabel context="ConfigStudio" className="text-xs">URL 缺失时<select className="mt-1 w-full rounded border px-2 py-1" value={style.icon.fallback} onChange={(event) => updateStyle({ icon: { ...style.icon!, fallback: event.target.value as typeof style.icon.fallback } })}><option value="circle">使用本规则点样式</option><option value="hide">隐藏</option></select></HelpLabel></> : null}</div>{style.icon ? <div className="mt-2 cm-flex-grid gap-2"><NumberField label="锚点 X px" value={style.icon.anchor[0]} onChange={(value) => updateStyle({ icon: { ...style.icon!, anchor: [value ?? 16, style.icon!.anchor[1]] } })} /><NumberField label="锚点 Y px" value={style.icon.anchor[1]} onChange={(value) => updateStyle({ icon: { ...style.icon!, anchor: [style.icon!.anchor[0], value ?? 16] } })} /></div> : null}</details> : null}</section> : null}
        <section className="rounded border bg-white p-2"><h5 className="font-medium">Label 效果</h5><div className="mt-2 cm-flex-grid gap-2"><HelpLabel context="ConfigStudio" className="inline-flex items-center gap-1 text-sm"><input type="checkbox" checked={label.visible} onChange={(event) => updateLabel({ visible: event.target.checked })} />显示 Label</HelpLabel><HelpLabel context="ConfigStudio" className="text-xs">样式<select className="mt-1 w-full rounded border px-2 py-1" value={visual.family} onChange={(event) => updateVisual({ family: event.target.value as RenderLabelVisualStyle['family'], ...(textOnlyFamilies.has(event.target.value as RenderLabelVisualStyle['family']) ? {} : { modifiers: {} }) })}>{labelFamilies.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></HelpLabel><NumberField label="大小" value={visual.size} min={6} max={72} onChange={(value) => updateVisual({ size: value ?? 14 })} /><HelpLabel context="ConfigStudio" className="text-xs">来源<select className="mt-1 w-full rounded border px-2 py-1" value={label.source ?? 'Name'} onChange={(event) => updateLabel({ source: event.target.value })}>{fields.map((field) => <option key={field}>{field}</option>)}</select></HelpLabel>{textOnlyFamilies.has(visual.family) ? <span className="flex flex-col gap-1 pt-1 text-xs"><HelpLabel context="ConfigStudio"><input type="checkbox" checked={Boolean(visual.modifiers?.italic)} onChange={(event) => updateVisual({ modifiers: { ...visual.modifiers, italic: event.target.checked } })} /> 斜体</HelpLabel><HelpLabel context="ConfigStudio"><input type="checkbox" checked={Boolean(visual.modifiers?.underline)} onChange={(event) => updateVisual({ modifiers: { ...visual.modifiers, underline: event.target.checked } })} /> 下划线</HelpLabel></span> : <span className="pt-5 text-xs text-slate-400">该样式不支持斜体/下划线</span>}</div><div className="mt-2 cm-flex-grid gap-2"><HelpLabel context="ConfigStudio" className="text-xs md:col-span-2">回退来源（逗号分隔，按顺序）<input className="mt-1 w-full rounded border px-2 py-1" value={(label.fallbackSources ?? []).join(', ')} placeholder="例如 ID, NofFloor" onChange={(event) => updateLabel({ fallbackSources: event.target.value.split(',').map((value) => value.trim()).filter(Boolean) })} /></HelpLabel><HelpLabel context="ConfigStudio" className="text-xs">主来源格式<select className="mt-1 w-full rounded border px-2 py-1" value={label.valueFormat ?? 'plain'} onChange={(event) => updateLabel({ valueFormat: event.target.value as NonNullable<typeof label.valueFormat> })}><option value="plain">原文</option><option value="floorLabel">楼层号格式</option></select></HelpLabel><HelpLabel context="ConfigStudio" className="text-xs">标签位置<select className="mt-1 w-full rounded border px-2 py-1" value={label.placement ?? 'center'} onChange={(event) => updateLabel({ placement: event.target.value as NonNullable<typeof label.placement> })}>{labelPlacementOptions.map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select></HelpLabel><NumberField label="X 偏移 px" value={label.offsetX} onChange={(value) => updateLabel({ offsetX: value })} /><NumberField label="Y 偏移 px" value={label.offsetY} onChange={(value) => updateLabel({ offsetY: value })} /></div><div className="mt-2 cm-flex-grid gap-2"><HelpLabel context="ConfigStudio" className="text-xs">首个回退格式<select className="mt-1 w-full rounded border px-2 py-1" value={label.fallbackValueFormats?.[(label.fallbackSources ?? [])[0] ?? ''] ?? 'plain'} disabled={!(label.fallbackSources ?? []).length} onChange={(event) => { const source = (label.fallbackSources ?? [])[0]; if (!source) return; updateLabel({ fallbackValueFormats: { ...label.fallbackValueFormats, [source]: event.target.value as 'plain' | 'floorLabel' } }); }}><option value="plain">原文</option><option value="floorLabel">楼层号格式</option></select></HelpLabel><HelpLabel context="ConfigStudio" className="inline-flex items-center gap-1 pt-5 text-xs"><input type="checkbox" checked={Boolean(label.withDot)} onChange={(event) => updateLabel({ withDot: event.target.checked })} />显示锚点圆点</HelpLabel><HelpLabel context="ConfigStudio" className="text-xs">圆点位置<select className="mt-1 w-full rounded border px-2 py-1" value={label.dotAnchorMode ?? 'anchorRight'} onChange={(event) => updateLabel({ dotAnchorMode: event.target.value as NonNullable<typeof label.dotAnchorMode> })}><option value="anchorRight">标签右侧</option><option value="inline">文字前</option></select></HelpLabel><p className="pt-5 text-xs text-slate-500">格式、回退、位置与圆点均属于当前 Zoom 渲染规则，不会写入全局默认。</p></div>{visual.family === 'rle-line-color' || visual.family === 'rle-pill-color' ? <div className="mt-2"><ColorBindingEditor config={config} sourcePath={path} fields={fields} label={visual.family === 'rle-line-color' ? '线路文字颜色' : '胶囊背景颜色'} value={visual.color ?? { mode: 'fixed', color: '#2563eb' }} onChange={(color) => updateVisual({ color })} /></div> : null}</section>
        <section className="rounded border bg-white p-2"><h5 className="font-medium">权重和层数</h5><p className="mt-1 text-xs text-slate-500">几何 zLevel 决定跨类覆盖顺序；Label 角色和显示权重分别独立参与碰撞与同层排序，互不混用。</p><div className="mt-2 cm-flex-grid gap-2"><NumberField label="整体几何 zLevel" value={rule.geometryStack?.zLevel} min={0} max={9999} onChange={(value) => update(rule.id, { geometryStack: { ...rule.geometryStack, zLevel: value ?? 300 } })} /><HelpLabel context="ConfigStudio" className="text-xs">Label 角色<select className="mt-1 w-full rounded border px-2 py-1" value={label.collision.role} onChange={(event) => updateLabel({ collision: { ...label.collision, role: event.target.value as typeof label.collision.role } })}>{['ignore', 'soft', 'optional', 'important', 'required'].map((role) => <option key={role}>{role}</option>)}</select></HelpLabel><NumberField label="Label 优先级" value={label.collision.basePriority} onChange={(value) => updateLabel({ collision: { ...label.collision, basePriority: value ?? 0 } })} /><NumberField label="基础显示权重" value={rule.priority?.base} onChange={(value) => update(rule.id, { priority: { ...(rule.priority ?? { mode: 'replace' }), base: value } })} /></div><div className="mt-2 cm-flex-grid gap-2"><HelpLabel context="ConfigStudio" className="text-xs">动态指标<select className="mt-1 w-full rounded border px-2 py-1" value={rule.priority?.metric?.kind ?? ''} onChange={(event) => { const kind = event.target.value; update(rule.id, { priority: { ...(rule.priority ?? { mode: 'replace' }), metric: kind ? { kind: kind as NonNullable<NonNullable<ZoomPriorityRule['priority']>['metric']>['kind'], multiplier: 1, rounding: 'floor' } : undefined } }); }}>{<option value="">不启用</option>}{metricKinds.map((kind) => <option key={kind} value={kind}>{kind === 'area' ? '面积' : kind === 'length' ? '长度' : kind === 'partCount' ? '部件数量' : '字段数值'}</option>)}</select></HelpLabel>{rule.priority?.metric ? <><HelpLabel context="ConfigStudio" className="text-xs">权重合成<select className="mt-1 w-full rounded border px-2 py-1" value={rule.priority?.mode ?? 'replace'} onChange={(event) => updateRule({ ...rule, priority: { ...rule.priority!, mode: event.target.value as NonNullable<ZoomPriorityRule['priority']>['mode'] } })}><option value="replace">指标替代基础权重</option><option value="add">基础权重 + 指标</option></select></HelpLabel><NumberField label="倍率" value={rule.priority.metric.multiplier} onChange={(value) => updateRule({ ...rule, priority: { ...rule.priority!, metric: { ...rule.priority!.metric!, multiplier: value ?? 1 } } })} /><NumberField label="除数" value={rule.priority.metric.divisor} min={0.0001} onChange={(value) => updateRule({ ...rule, priority: { ...rule.priority!, metric: { ...rule.priority!.metric!, divisor: value } } })} />{rule.priority.metric.kind === 'field' ? <HelpLabel context="ConfigStudio" className="text-xs">指标字段<select className="mt-1 w-full rounded border px-2 py-1" value={rule.priority.metric.field ?? ''} onChange={(event) => updateRule({ ...rule, priority: { ...rule.priority!, metric: { ...rule.priority!.metric!, field: event.target.value } } })}>{fields.map((field) => <option key={field}>{field}</option>)}</select></HelpLabel> : null}</> : null}</div>{rule.priority?.metric ? <div className="mt-2 cm-flex-grid gap-2"><NumberField label="指标下限（可空）" value={rule.priority.metric.min} onChange={(value) => updateRule({ ...rule, priority: { ...rule.priority!, metric: { ...rule.priority!.metric!, min: value } } })} /><NumberField label="指标上限（可空）" value={rule.priority.metric.max} onChange={(value) => updateRule({ ...rule, priority: { ...rule.priority!, metric: { ...rule.priority!.metric!, max: value } } })} /><HelpLabel context="ConfigStudio" className="text-xs">取整方式<select className="mt-1 w-full rounded border px-2 py-1" value={rule.priority.metric.rounding} onChange={(event) => updateRule({ ...rule, priority: { ...rule.priority!, metric: { ...rule.priority!.metric!, rounding: event.target.value as NonNullable<NonNullable<ZoomPriorityRule['priority']>['metric']>['rounding'] } } })}><option value="none">不取整</option><option value="floor">向下取整</option><option value="round">四舍五入</option><option value="ceil">向上取整</option></select></HelpLabel></div> : null}</section>
        {pointLike ? <NativeSymbolSettings rule={rule} onChange={updateRule} /> : null}<LabelPlacementSettings rule={rule} onChange={updateRule} allowDecoration={geometry === 'Point' && style.symbolVisibility !== 'withLabel' && rule.representation !== 'labelOnly'} /><ConditionalOverridesEditor config={config} path={path} geometry={geometry} rule={rule} onChange={updateRule} />
        <RenderRuleExtensionsEditor geometry={geometry} rule={rule} onChange={updateRule} config={config} sourcePath={path} fields={fields} /><CollisionMetricEditor rule={rule} onChange={updateRule} fields={fields} /><ExtraRuleSettings rule={rule} onChange={updateRule}  config={config} geometry={geometry} /><RuleInteractionSettings rule={rule} baseline={(config.engine ?? createV32EngineDefaults()).interactionBaselines[geometry]} onChange={updateRule} />
      </div></details>;
    })}
    <button type="button" className="inline-flex items-center gap-1 rounded border px-3 py-1.5 text-sm" onClick={append}><Plus className="h-4 w-4" />添加渲染规则（复制上一条）</button>
  </section>;
}

// The former component is retained only as a migration reference.  The
// author-facing editor below is deliberately structured around one inclusive
// Zoom rule at a time, so no global geometry/style values can silently leak
// between low- and high-zoom BUD/ROD/ISG states.
void LegacyRenderRuleEditor;

const labelPlacementOptions: Array<[string, string]> = [
  ['center', '中心'], ['N', '上方'], ['S', '下方'], ['E', '右侧'], ['W', '左侧'],
  ['NE', '右上'], ['NW', '左上'], ['SE', '右下'], ['SW', '左下'],
  ['aboveLine', '线条上方'], ['belowLine', '线条下方'], ['near', '近锚点（兼容旧包）'],
];

/** Native r5 rule authoring surface.  Every visual value lives in exactly one
 * inclusive logical Zoom interval.  Geometry interaction triggers use each c15 rule; historical contracts retain
 * the GeometryProfile, and common hover/selected/edit/delete styling stays
 * in the engine baseline, as agreed in the V3.2 contract. */
export function RenderRuleEditor({ config, path, geometry, profile, onChange }: { config: ConfigPackageV3; path: ClassificationPath; geometry: GeometryKind; profile: GeometryProfile; onChange: (value: GeometryProfile) => void }) {
  const rules = profile.zoomPriority.rules;
  const fields = allFieldKeys(config, path);
  const representations: Array<[ZoomPriorityRule['representation'], string]> = geometry === 'Polygon'
    ? [['hidden', '隐藏'], ['point', '面内中点'], ['geometry', '显示面'], ['labelOnly', '仅标签']]
    : geometry === 'LineString'
      ? [['hidden', '隐藏'], ['point', '线中点'], ['geometry', '显示线'], ['labelOnly', '仅标签']]
      : [['hidden', '隐藏'], ['geometry', '显示点'], ['labelOnly', '仅标签']];
  const representationDrafts=useRef(new Map<string,RenderStyle>());
  const updateRule = (id: string, patch: Partial<ZoomPriorityRule>) => onChange({
    ...profile,
    zoomPriority: { rules: rules.map((rule) => {
      if (rule.id !== id) return rule;
      let merged = { ...rule, ...patch };
      if(config.contractRevision>=12&&patch.representation!==undefined&&patch.representation!==rule.representation){
        const priorKind=geometry==='Point'||rule.representation==='point'?'point':'path', nextKind=geometry==='Point'||patch.representation==='point'?'point':'path';
        if(rule.style)representationDrafts.current.set(rule.id+':'+priorKind,structuredClone(rule.style));
        if(patch.representation==='hidden')merged.style=undefined;
        else {const prior=representationDrafts.current.get(rule.id+':'+nextKind); if(prior)merged.style=structuredClone(prior);else if(nextKind==='point')merged.style=r12PointStyle(rule.style??defaultStyle(geometry));else {const own=rule.style?.pointSymbol;merged.style=own?{...(own.kind==='shape'?own.shape:own.fallback)}:defaultStyle(geometry);}}
      }
      if(config.contractRevision>=14&&patch.representation!==undefined&&patch.representation!==rule.representation)merged=prepareRenderRule(merged,geometry,config.contractRevision);
      if (config.contractRevision < 7) return merged;
      const { minZoom: _min, maxZoom: _max, minExclusive: _mi, maxExclusive: _ma, conditionalOverrides: _branches, ...body } = merged;
      const range = renderRuleRange(merged);
      return { ...body,...(config.contractRevision>=14&&merged.conditionalOverrides?{conditionalOverrides:merged.conditionalOverrides}:{}), when: { ...merged.when, zoom: { min: Object.prototype.hasOwnProperty.call(patch, 'minZoom') ? patch.minZoom! : range.min, max: Object.prototype.hasOwnProperty.call(patch, 'maxZoom') ? patch.maxZoom! : range.max } } };
    }) },
  });
  const replaceRule = (next: ZoomPriorityRule) => updateRule(next.id, next);
  const append = () => {
    const last = rules[rules.length - 1] ?? defaultRenderRule(geometry);
    const min = Math.max(0, Math.trunc(last.minZoom ?? 0));
    const max = Math.min(8, Math.trunc(last.maxZoom ?? 8));
    if (min >= max) return;
    const split = Math.floor((min + max) / 2);
    const copy = clone(last);
    copy.id = uid('render'); copy.minZoom = split + 1; copy.maxZoom = max;
    onChange({ ...profile, zoomPriority: { rules: rules.map((rule) => rule.id === last.id ? { ...rule, maxZoom: split } : rule).concat(copy) } });
  };
  return <section className="cm-panel space-y-3"><div><h4 className="font-semibold">渲染规则</h4><p className="mt-1 text-xs text-slate-500">必填逻辑 Zoom（0–8）与选填非分类字段组合共同匹配；允许重叠，末项命中的完整规则生效。</p></div>
    {rules.map((storedRule, index) => {
      const range = renderRuleRange(storedRule);
      const rule = config.contractRevision >= 7 ? { ...storedRule, minZoom: range.min, maxZoom: range.max } : storedRule;
      const style = rule.style ?? defaultStyle(geometry);
      const label = rule.label ?? defaultLabel(geometry);
      const visual = label.style ?? { family: 'gm-outline' as const, size: 14 };
      const pointLike = geometry === 'Point' || rule.representation === 'point';
      const supportsFill = pointLike || geometry === 'Polygon';
      const setStyle = (patch: Partial<RenderStyle>) => updateRule(rule.id, { style: { ...style, ...patch } });
      const setLabel = (patch: Partial<typeof label>) => updateRule(rule.id, { label: { ...label, ...patch } });
      return <RulePreviewScope key={rule.id} ruleId={rule.id} geometry={geometry}><details data-fold-key={`rule:${rule.id}`} className="cm-item cm-render-rule"><summary className="cursor-pointer font-medium"><RenderRuleTitle rule={rule} index={index} /></summary><div className="mt-3 space-y-3">
        <section aria-label="规则适用范围" className="cm-subsection"><h5 className="text-sm font-medium">规则适用范围</h5><div className="cm-rule-range"><NumberField label="下界" value={rule.minZoom} min={0} max={8} onChange={(value) => updateRule(rule.id, { minZoom: value })} /><span className="cm-zoom-join text-sm">≤ Zoom ≤</span><NumberField label="上界" value={rule.maxZoom} min={0} max={8} onChange={(value) => updateRule(rule.id, { maxZoom: value })} /><HelpLabel context="ConfigStudio" className="text-xs">显示种类<select className="mt-1 w-full rounded border px-2 py-1" value={rule.representation ?? 'geometry'} onChange={(event) => updateRule(rule.id, { representation: event.target.value as ZoomPriorityRule['representation'] })}>{representations.map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select></HelpLabel>{rules.length > 1 ? <button type="button" className="mt-5 text-xs text-rose-700" onClick={() => onChange({ ...profile, zoomPriority: { rules: rules.filter((item) => item.id !== rule.id) } })}>删除</button> : <span />}</div>{config.contractRevision >= 7 ? <RenderFieldConditionsEditor config={config} path={path} value={rule.when?.fields} onChange={fields => replaceRule({ ...rule, when: { zoom: renderRuleRange(rule), ...(fields ? { fields } : {}) } })} /> : <ConditionalOverridesEditor config={config} path={path} geometry={geometry} rule={rule} onChange={replaceRule} />}</section>
        {config.contractRevision>=15?<RuleInteractionEditor geometry={geometry} profile={profile} rule={rule} onChange={replaceRule}/>:null}
        {rule.representation !== 'hidden' ? config.contractRevision >= 12 && pointLike ? <PointSymbolEditor config={config} path={path} fields={resolveSelectableFields(config,path)} geometry={geometry} ruleId={rule.id} value={style} onChange={style => updateRule(rule.id,{style})} /> : <section className="cm-subsection"><h5 className="font-medium">显示效果</h5><div className="mt-2 cm-flex-grid gap-2"><HelpLabel context="ConfigStudio" className="text-xs">显示效果<select className="mt-1 w-full rounded border px-2 py-1" value={pointLike ? style.pointShape ?? 'circle' : style.dashPreset ?? 'solid'} onChange={(event) => setStyle(pointLike ? { pointShape: event.target.value as RenderStyle['pointShape'] } : { dashPreset: event.target.value as RenderStyle['dashPreset'] })}>{pointLike ? <><option value="circle">圆圈</option><option value="square">方块</option><option value="triangle">三角</option><option value="regular4">正方形</option><option value="regular5">五边形</option><option value="regular6">六边形</option></> : <><option value="solid">实线描边</option><option value="dash">虚线描边</option><option value="dotDash">点-短线虚线</option><option value="dotDotDash">点-点-短线虚线</option></>}</select></HelpLabel>{pointLike ? <NumberField label="大小 px" value={style.size} min={1} onChange={(value) => setStyle({ size: value })} /> : null}<NumberField label="描边粗细" value={style.weight} min={0} step={0.5} onChange={(value) => setStyle({ weight: value })} />{geometry !== 'Point' ? <><HelpLabel context="ConfigStudio" className="text-xs">线端<select className="mt-1 w-full rounded border px-2 py-1" value={style.lineCap ?? 'round'} onChange={(event) => setStyle({ lineCap: event.target.value as RenderStyle['lineCap'] })}><option value="round">圆</option><option value="butt">平</option><option value="square">方</option></select></HelpLabel><HelpLabel context="ConfigStudio" className="text-xs">转角<select className="mt-1 w-full rounded border px-2 py-1" value={style.lineJoin ?? 'round'} onChange={(event) => setStyle({ lineJoin: event.target.value as RenderStyle['lineJoin'] })}><option value="round">圆</option><option value="miter">尖</option><option value="bevel">斜</option></select></HelpLabel></> : null}</div><div className="mt-2 cm-flex-grid gap-2"><ColorBindingEditor config={config} sourcePath={path} fields={fields} label="描边" value={style.stroke ?? { mode: 'fixed', color: '#334155' }} onChange={(stroke) => setStyle({ stroke })} />{supportsFill ? <ColorBindingEditor config={config} sourcePath={path} fields={fields} label="填色" value={style.fill ?? { mode: 'fixed', color: '#334155' }} onChange={(fill) => setStyle({ fill })} /> : null}</div><div className="mt-2 cm-flex-grid gap-2"><OpacityField label="描边透明度" value={style.strokeOpacity} onChange={(value) => setStyle({ strokeOpacity: value })} />{supportsFill ? <OpacityField label="填色透明度" value={style.fillOpacity ?? (geometry === 'Polygon' ? 0.24 : 0.88)} onChange={(value) => setStyle({ fillOpacity: value })} /> : null}</div>{!pointLike?<HaloEditor config={config} path={path} fields={fields} polygon={geometry==='Polygon'} value={style.halo} onChange={halo=>setStyle({halo})}/>:null}{pointLike ? <details className="mt-2 rounded border border-slate-200 bg-slate-50 p-2"><summary className="cursor-pointer text-xs font-medium">图标覆盖（本 Zoom 规则）</summary><div className="mt-2 cm-flex-grid gap-2"><HelpLabel context="ConfigStudio" className="inline-flex items-center gap-1 pt-5 text-xs"><input type="checkbox" checked={Boolean(style.icon)} onChange={(event) => setStyle({ icon: event.target.checked ? { source: fields.find((field) => /icon|image|picture/i.test(field)) ?? fields[0] ?? 'iconUrl', size: [32, 32], anchor: [16, 16], fallback: 'circle' } : undefined })} />使用图标字段</HelpLabel>{style.icon ? <><HelpLabel context="ConfigStudio" className="text-xs">图标 URL 字段<select className="mt-1 w-full rounded border px-2 py-1" value={style.icon.source} onChange={(event) => setStyle({ icon: { ...style.icon!, source: event.target.value } })}>{fields.map((field) => <option key={field}>{field}</option>)}</select></HelpLabel><NumberField label="图标宽 px" value={style.icon.size[0]} min={1} onChange={(value) => setStyle({ icon: { ...style.icon!, size: [value ?? 32, style.icon!.size[1]] } })} /><NumberField label="图标高 px" value={style.icon.size[1]} min={1} onChange={(value) => setStyle({ icon: { ...style.icon!, size: [style.icon!.size[0], value ?? 32] } })} /></> : null}</div></details> : null}</section> : null}
        <section className="cm-subsection"><h5 className="font-medium">Label 效果</h5><div className="cm-flags mt-2"><HelpLabel context="ConfigStudio" className="inline-flex items-center gap-1 pt-5 text-sm"><input type="checkbox" checked={label.visible} onChange={(event) => setLabel({ visible: event.target.checked })} />显示 Label</HelpLabel></div><LabelAppearanceEditor config={config} path={path} fields={resolveSelectableFields(config,path)} value={visual} onChange={style => setLabel({style})} /><LabelSourceEditor label={label} fields={fields} onChange={setLabel} /><div className="mt-2 cm-flex-grid gap-2"><HelpLabel context="ConfigStudio" className="text-xs">回退来源（逗号分隔，按顺序）<input className="mt-1 w-full rounded border px-2 py-1" value={(label.fallbackSources ?? []).join(', ')} placeholder="例如 ID, NofFloor" onChange={(event) => setLabel({ fallbackSources: event.target.value.split(',').map((value) => value.trim()).filter(Boolean) })} /></HelpLabel><HelpLabel context="ConfigStudio" className="text-xs">主来源格式<select className="mt-1 w-full rounded border px-2 py-1" value={label.valueFormat ?? 'plain'} onChange={(event) => setLabel({ valueFormat: event.target.value as NonNullable<typeof label.valueFormat> })}><option value="plain">原文</option><option value="floorLabel">楼层号格式</option></select></HelpLabel><HelpLabel context="ConfigStudio" className="text-xs">标签位置<select className="mt-1 w-full rounded border px-2 py-1" value={label.placement ?? (geometry === 'LineString' ? 'aboveLine' : 'center')} onChange={(event) => setLabel({ placement: event.target.value as NonNullable<typeof label.placement> })}>{labelPlacementOptions.map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select></HelpLabel><NumberField label="X 偏移 px" value={label.offsetX} onChange={(value) => setLabel({ offsetX: value })} /><NumberField label="Y 偏移 px" value={label.offsetY} onChange={(value) => setLabel({ offsetY: value })} /></div><p className="mt-2 text-xs text-slate-500">标签位置使用当前渲染锚点的方向；圆点是该规则的真实点/面中点显示效果，不再使用 BUD 式“标签装饰圆点”兼容逻辑。</p></section>
        <section className="cm-subsection"><h5 className="font-medium">权重和层数</h5><p className="mt-1 text-xs text-slate-500">A 几何层级、B Label 碰撞与 C 显示权重独立；高级指标放在扩展规则。</p><div className="mt-2 cm-flex-grid gap-2"><NumberField label="几何 zLevel" value={rule.geometryStack?.zLevel} min={0} max={9999} onChange={value => updateRule(rule.id, { geometryStack: { ...rule.geometryStack!, zLevel: value ?? 300 } })} /><HelpLabel context="ConfigStudio" className="text-xs">Label 角色<select className="mt-1 w-full rounded border px-2 py-1" value={label.collision.role} onChange={e => setLabel({ collision: { ...label.collision, role: e.target.value as typeof label.collision.role } })}>{['ignore','soft','optional','important','required'].map(role => <option key={role}>{role}</option>)}</select></HelpLabel><NumberField label="Label 基础碰撞优先级" value={label.collision.basePriority} onChange={value => setLabel({ collision: { ...label.collision, basePriority: value ?? 0 } })} /><NumberField label="基础显示权重" value={rule.priority?.base} onChange={value => updateRule(rule.id, { priority: { mode: 'add', ...rule.priority, base: value } })} /></div></section>
        <NativeSymbolSettings rule={rule} onChange={replaceRule} allowOffsets={pointLike} /><LabelPlacementSettings rule={rule} onChange={replaceRule} allowDecoration={geometry === 'Point' && style.symbolVisibility !== 'withLabel' && rule.representation !== 'labelOnly'} /><CollisionMetricEditor rule={rule} onChange={replaceRule} fields={fields} />

        {config.contractRevision >= 7 ? <GripOrderControls scope={`${classificationPathKey(path)}:${geometry}:rules`} index={index} count={rules.length} label="规则" onMove={(from, to) => { const next = [...rules]; const [item] = next.splice(from, 1); next.splice(to, 0, item); onChange({ ...profile, zoomPriority: { rules: next } }); }} /> : null}
        <UnifiedRuleExtensions config={config} path={path} fields={fields} geometry={geometry} rule={rule} onChange={replaceRule} /><details className="mt-2 rounded border p-2"><summary className="text-xs">有效扩展值与来源<ModuleHelp title="有效扩展值与来源" /></summary><p className="mt-1 text-xs">全局几何默认 → 当前完整规则的本地覆盖；此处为静态合成检查，实际命中取决于 Zoom、字段条件及交互态。</p><pre className="mt-2 max-h-48 overflow-auto text-xs">{JSON.stringify({ global: config.engine?.renderDefaults?.[geometry] ?? {}, local: rule.extensions ?? {}, effective: resolveRenderExtensions(config, geometry, rule.extensions) },null,2)}</pre></details>
      </div></details></RulePreviewScope>;
    })}
    {config.contractRevision >= 7 ? <NewRenderRulePanel config={config} path={path} geometry={geometry} profile={profile} onAdd={rule => onChange({ ...profile, renderState:config.contractRevision>=9?'enabled':profile.renderState, zoomPriority: { rules: [...rules, rule] } })} /> : <button type="button" className="inline-flex items-center gap-1 rounded border bg-white px-3 py-1.5 text-sm" onClick={append}><Plus className="h-4 w-4" />添加渲染规则</button>}
  </section>;
}

function GeometryEditor({ config, path, geometry, profile, onChange }: { config: ConfigPackageV3; path: ClassificationPath; geometry: GeometryKind; profile: GeometryProfile; onChange: (profile: GeometryProfile) => void }) {
  const [expanded, setExpanded] = useState(profile.enabled);
  const triggers = profile.interaction?.triggers ?? {};
  const triggerLabels: Array<[keyof GeometryInteractionTriggers, string]> = geometry === 'Point'
    ? [['point', '点击点'], ['label', '点击 Label']]
    : geometry === 'LineString' ? [['line', '点击线'], ['label', '点击 Label']]
      : [['boundary', '点击边框'], ['interior', '点击面内'], ['label', '点击 Label']];
  const toggle = (key: keyof GeometryInteractionTriggers, value: boolean) => onChange({ ...profile, interaction: { triggers: { ...triggers, [key]: value } } });
  return <article className="rounded-lg border bg-white"><header className="flex items-center gap-3 p-3"><button type="button" className="flex min-w-0 flex-1 items-center gap-2 text-left" onClick={() => setExpanded((value) => !value)}>{expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}<strong>{geometryLabel[geometry]}</strong><span className="text-xs text-slate-500">{profile.renderState==='unconfigured'?'尚未配置显示 · ':''}{expanded ? '渲染规则已展开' : '仅显示启用状态'}</span></button><HelpLabel context="ConfigStudio" className="shrink-0 text-sm"><input type="checkbox" checked={profile.enabled} onChange={(event) => { onChange({ ...profile, enabled: event.target.checked }); if (event.target.checked) setExpanded(true); }} /> 启用</HelpLabel></header>{expanded ? <div className="space-y-3 border-t p-3">{config.contractRevision>=15?<section className="rounded border bg-slate-50 p-2"><h4 className="font-medium">总体设置</h4><HelpLabel context="ConfigStudio" className="mt-2 inline-flex items-center gap-1 text-sm"><input type="checkbox" checked={profile.allowMultipleParts} onChange={event=>onChange({...profile,allowMultipleParts:event.target.checked})}/>允许多部件</HelpLabel></section>:<section className="rounded border bg-slate-50 p-2"><h4 className="font-medium">多部件与交互触发</h4><div className="mt-2 cm-flex-grid gap-2"><HelpLabel context="ConfigStudio" className="inline-flex items-center gap-1 text-sm"><input type="checkbox" checked={profile.allowMultipleParts} onChange={(event) => onChange({ ...profile, allowMultipleParts: event.target.checked })} />允许多部件</HelpLabel><HelpLabel context="ConfigStudio" className="text-xs">锚点<select disabled={!profile.allowMultipleParts} className="mt-1 w-full rounded border px-2 py-1 disabled:bg-slate-100" value={profile.anchor ?? 'featureBbox'} onChange={(event) => onChange({ ...profile, anchor: event.target.value as GeometryProfile['anchor'] })}><option value="featureBbox">完整要素 bbox 中心</option><option value="perPart">各部件中心</option></select></HelpLabel><div className="flex flex-wrap gap-3 pt-5 text-xs">{triggerLabels.map(([key, text]) => <HelpLabel context="ConfigStudio" key={key}><input type="checkbox" checked={Boolean(triggers[key])} onChange={(event) => toggle(key, event.target.checked)} /> {text}</HelpLabel>)}</div></div></section>}<RenderRuleEditor config={config} path={path} geometry={geometry} profile={profile} onChange={onChange} /></div> : null}</article>;
}

export function LegacyFieldEditor({ config, node, onChange }: { config: ConfigPackageV3; node: CategoryNode; onChange: (node: CategoryNode) => void }) {
  const effective = resolveEffectiveFields(config, node.path);
  const local = new Set(node.fields.map((field) => field.fieldId));
  const add = () => onChange({ ...node, fields: [...node.fields, { fieldId: uid('field'), key: 'NewField', type: 'string', cardinality: 'single', input: 'text', labels: { zh: '新字段', en: 'New field' }, description: { zh: '', en: '' } }] });
  const update = (fieldId: string, patch: Partial<FieldDefinition>) => onChange({ ...node, fields: node.fields.map((field) => field.fieldId === fieldId ? { ...field, ...patch } : field) });
  const addOverride = (field: FieldDefinition) => onChange({ ...node, fields: [...node.fields, { ...clone(field), fieldId: uid('field-override'), overrideOf: field.key }] });
  return <section><div className="mb-2 flex items-center justify-between"><div><h3 className="font-semibold">字段设置</h3><p className="text-xs text-slate-500">World 是引擎自动分配的必填系统字段；子分类可新增特有字段，也可对继承字段建立本地覆盖。字段名称、数据类型、单/多值和中英文定义均在此保存。</p></div><button type="button" className="inline-flex items-center gap-1 rounded border px-2 py-1 text-sm" onClick={add}><Plus className="h-4 w-4" />添加字段</button></div><div className="space-y-2">{effective.map((field) => {
    const isLocal = local.has(field.fieldId);
    const disabled = !isLocal;
    return <article key={field.fieldId} className="rounded border bg-white p-2"><div className="cm-flex-grid gap-2"><HelpLabel context="ConfigStudio" className="text-xs">字段名<input disabled={disabled} className="mt-1 w-full rounded border px-2 py-1 disabled:bg-slate-100" value={field.key} onChange={(event) => update(field.fieldId, { key: event.target.value })} /></HelpLabel><HelpLabel context="ConfigStudio" className="text-xs">数据类型<select disabled={disabled} className="mt-1 w-full rounded border px-2 py-1 disabled:bg-slate-100" value={field.type} onChange={(event) => update(field.fieldId, { type: event.target.value as FieldDefinition['type'] })}>{['string', 'number', 'boolean', 'enum', 'json', 'reference'].map((type) => <option key={type}>{type}</option>)}</select></HelpLabel><HelpLabel context="ConfigStudio" className="text-xs">值数量<select disabled={disabled} className="mt-1 w-full rounded border px-2 py-1 disabled:bg-slate-100" value={field.cardinality} onChange={(event) => update(field.fieldId, { cardinality: event.target.value as FieldDefinition['cardinality'] })}><option value="single">单值</option><option value="multiple">允许多值</option></select></HelpLabel><HelpLabel context="ConfigStudio" className="text-xs">输入控件<select disabled={disabled} className="mt-1 w-full rounded border px-2 py-1 disabled:bg-slate-100" value={field.input} onChange={(event) => update(field.fieldId, { input: event.target.value as FieldDefinition['input'] })}>{['text', 'textarea', 'select', 'toggle', 'json', 'featureSearch'].map((input) => <option key={input}>{input}</option>)}</select></HelpLabel><HelpLabel context="ConfigStudio" className="pt-5 text-sm"><input disabled={disabled} type="checkbox" checked={Boolean(field.required)} onChange={(event) => update(field.fieldId, { required: event.target.checked })} /> 必填</HelpLabel>{isLocal ? <button type="button" className="mt-5 text-xs text-rose-700" onClick={() => onChange({ ...node, fields: node.fields.filter((item) => item.fieldId !== field.fieldId) })}>删除</button> : <button type="button" className="mt-5 text-xs text-blue-700" onClick={() => addOverride(field)}>建立覆盖</button>}</div><div className="mt-2 cm-flex-grid gap-2"><HelpLabel context="ConfigStudio" className="text-xs">名称（zh）<input disabled={disabled} className="mt-1 w-full rounded border px-2 py-1 disabled:bg-slate-100" value={field.labels.zh} onChange={(event) => update(field.fieldId, { labels: { ...field.labels, zh: event.target.value } })} /></HelpLabel><HelpLabel context="ConfigStudio" className="text-xs">名称（en）<input disabled={disabled} className="mt-1 w-full rounded border px-2 py-1 disabled:bg-slate-100" value={field.labels.en} onChange={(event) => update(field.fieldId, { labels: { ...field.labels, en: event.target.value } })} /></HelpLabel><HelpLabel context="ConfigStudio" className="text-xs">定义（zh）<textarea disabled={disabled} className="mt-1 min-h-16 w-full rounded border px-2 py-1 disabled:bg-slate-100" value={field.description.zh} onChange={(event) => update(field.fieldId, { description: { ...field.description, zh: event.target.value } })} /></HelpLabel><HelpLabel context="ConfigStudio" className="text-xs">定义（en）<textarea disabled={disabled} className="mt-1 min-h-16 w-full rounded border px-2 py-1 disabled:bg-slate-100" value={field.description.en} onChange={(event) => update(field.fieldId, { description: { ...field.description, en: event.target.value } })} /></HelpLabel></div>{field.type === 'enum' ? <HelpLabel context="ConfigStudio" className="mt-2 block text-xs">枚举选项（用逗号分隔）<input disabled={disabled} className="mt-1 w-full rounded border px-2 py-1 disabled:bg-slate-100" value={(field.options ?? []).map((option) => option.value).join(', ')} onChange={(event) => update(field.fieldId, { options: event.target.value.split(',').map((item) => item.trim()).filter(Boolean).map((value) => ({ value, label: { zh: value, en: '' } })) })} /></HelpLabel> : null}</article>;
  })}</div></section>;
}

function FieldCard({ config, field, local, onUpdate, onDelete, onOverride, contractRevision=8 }: { config:ConfigPackageV3; field: FieldDefinition; local: boolean; contractRevision?:number; onUpdate: (patch: Partial<FieldDefinition>) => void; onDelete: () => void; onOverride: () => void }) {
  const disabled = !local;
  const scope = fieldScope(field);
  const shortKey = fieldShortKey(field);
  const setShortKey = (next: string) => onUpdate({ key: scope === 'root' ? next : `${scope}.${next}`, scope });
  return <details data-fold-key={`field:${field.fieldId}`} aria-label={`字段 ${field.key}`} className="cm-item cm-field-definition"><summary className="cursor-pointer font-medium">{field.key}</summary>
    <div className="cm-field-identity grid min-w-0 gap-2">
      <HelpLabel context="ConfigStudio" className="min-w-0 text-xs">字段名<input disabled={disabled} className="mt-1 w-full rounded border px-2 py-1 disabled:bg-slate-100" value={shortKey} onChange={(event) => setShortKey(event.target.value)} /></HelpLabel>
      <HelpLabel context="ConfigStudio" className="min-w-0 text-xs">数据类型<select disabled={disabled} className="mt-1 w-full rounded border px-2 py-1 disabled:bg-slate-100" value={field.type} onChange={(event) => onUpdate({ type: event.target.value as FieldDefinition['type'] })}>{['string', 'number', 'boolean', 'enum', 'json', 'reference'].map((type) => <option key={type} value={type}>{type}</option>)}</select></HelpLabel>
      <HelpLabel context="ConfigStudio" className="min-w-0 text-xs">值数量<select disabled={disabled} className="mt-1 w-full rounded border px-2 py-1 disabled:bg-slate-100" value={field.cardinality} onChange={(event) => onUpdate({ cardinality: event.target.value as FieldDefinition['cardinality'] })}><option value="single">单值</option><option value="multiple">允许多值</option></select></HelpLabel>
      <HelpLabel context="ConfigStudio" className="min-w-0 text-xs">输入控件<select disabled={disabled} className="mt-1 w-full rounded border px-2 py-1 disabled:bg-slate-100" value={field.input} onChange={(event) => onUpdate({ input: event.target.value as FieldDefinition['input'] })}>{['text', 'textarea', 'select', 'toggle', 'json', 'featureSearch'].map((input) => <option key={input} value={input}>{input}</option>)}</select></HelpLabel>
    </div>
    <div className="cm-field-actions cm-action-bar rounded bg-slate-50 px-2 py-1.5 text-sm">
      <HelpLabel context="ConfigStudio" className="inline-flex items-center gap-1"><input disabled={disabled} type="checkbox" checked={Boolean(field.required)} onChange={(event) => onUpdate({ required: event.target.checked })} />必填</HelpLabel>
      {local ? <button type="button" className="ml-auto text-xs text-rose-700" onClick={onDelete}>删除</button> : <button type="button" disabled={field.inheritance==='sealed'} className="ml-auto text-xs text-blue-700 disabled:text-slate-400" onClick={onOverride}>{field.inheritance==='sealed'?'固定继承':'建立覆盖'}</button>}
    </div>
    <div className="mt-2 cm-flex-grid min-w-0 gap-2"><HelpLabel context="ConfigStudio" className="min-w-0 text-xs">名称（zh）<input disabled={disabled} className="mt-1 w-full rounded border px-2 py-1 disabled:bg-slate-100" value={field.labels.zh} onChange={(event) => onUpdate({ labels: { ...field.labels, zh: event.target.value } })} /></HelpLabel><HelpLabel context="ConfigStudio" className="min-w-0 text-xs">名称（en）<input disabled={disabled} className="mt-1 w-full rounded border px-2 py-1 disabled:bg-slate-100" value={field.labels.en} onChange={(event) => onUpdate({ labels: { ...field.labels, en: event.target.value } })} /></HelpLabel><HelpLabel context="ConfigStudio" className="min-w-0 text-xs">定义（zh）<textarea disabled={disabled} className="mt-1 min-h-16 w-full rounded border px-2 py-1 disabled:bg-slate-100" value={field.description.zh} onChange={(event) => onUpdate({ description: { ...field.description, zh: event.target.value } })} /></HelpLabel><HelpLabel context="ConfigStudio" className="min-w-0 text-xs">定义（en）<textarea disabled={disabled} className="mt-1 min-h-16 w-full rounded border px-2 py-1 disabled:bg-slate-100" value={field.description.en} onChange={(event) => onUpdate({ description: { ...field.description, en: event.target.value } })} /></HelpLabel></div><TableOptionsEditor config={config} value={field} disabled={disabled} allowFieldBinding={false} onChange={owner=>onUpdate({options:owner.options,optionTable:owner.optionTable,optionsTableId:owner.optionsTableId,optionValueType:owner.optionValueType})} /><FieldAdvancedSettings contractRevision={contractRevision} field={field} disabled={disabled} onChange={onUpdate} /></details>;
}

function FieldEditor({ config, node, onChange }: { config: ConfigPackageV3; node: CategoryNode; onChange: (node: CategoryNode) => void }) {
  const effective = resolveEffectiveFields(config, node.path);
  const local = new Set(node.fields.map((field) => field.fieldId));
  const levels: Array<keyof ClassificationPath> = ['class', 'kind', 'skind', 'skind2'];
  const update = (fieldId: string, patch: Partial<FieldDefinition>) => onChange({ ...node, fields: node.fields.map((field) => field.fieldId === fieldId ? { ...field, ...patch } : field) });
  const updateClassificationLabel = (level: keyof ClassificationPath, language: 'zh' | 'en', value: string) => {
    const current = node.classificationLabels?.[level] ?? { zh: String(node.path[level] ?? ''), en: '' };
    onChange({
      ...node,
      classificationLabels: {
        ...node.classificationLabels,
        [level]: { ...current, [language]: value },
      },
    });
  };
  const add = (scope: 'root' | 'tags' | 'extensions') => {
    const base = 'NewField';
    const key = scope === 'root' ? base : `${scope}.${base}`;
    const fieldId=uid('field');openAddedSetting('field:'+fieldId);
    onChange({ ...node, fields: [...node.fields, { fieldId, key, scope, type: 'string', cardinality: 'single', input: 'text', labels: { zh: '新字段', en: '' }, description: { zh: '', en: '' } }] });
  };
  const renderScope = (scope: 'root' | 'tags' | 'extensions', title: string, detail: string) => {
    const fields = effective.filter((field) => fieldScope(field) === scope && !(scope !== 'root' && (field.key === scope || field.key === `${scope}.`)));
    return <section key={scope} aria-label={`${scope} 字段组`} className="cm-panel cm-field-group">
      <div className="cm-panel-heading">
        <div><h4 className="font-medium">{title}</h4><p className="text-xs text-slate-500">{detail}</p></div>
        <button type="button" className="inline-flex items-center gap-1 rounded border bg-white px-2 py-1 text-sm" onClick={() => add(scope)}><Plus className="h-4 w-4" />添加字段</button>
      </div>
      {fields.length ? <div className="mt-2 space-y-2">{fields.map((field) => {
        const isLocal = local.has(field.fieldId);
        return <FieldCard config={config} contractRevision={config.contractRevision} key={field.fieldId} field={field} local={isLocal} onUpdate={(patch) => update(field.fieldId, patch)} onDelete={() => onChange({ ...node, fields: node.fields.filter((item) => item.fieldId !== field.fieldId) })} onOverride={() => onChange({ ...node, fields: [...node.fields, { ...clone(field), fieldId: uid('field-override'), overrideOf: field.key }] })} />;
      })}</div> : <p className="mt-2 text-xs text-slate-500">当前没有此字段组的已定义字段。</p>}
    </section>;
  };
  return <section className="cm-panel">
    <div className="cm-panel-heading"><div><h3 className="font-semibold">分类标识与字段设置</h3><p className="text-xs text-slate-500">World 是引擎自动分配的必填系统字段。tags 与 extensions 是始终存在的可选字段组，不会再被伪造成名为 tags/extensions 的顶级文本字段；子分类可新增本地字段或建立继承覆盖。</p></div></div>
    <section className="cm-subsection"><h4 className="font-medium">分类标识（路径代码与显示名称）</h4><p className="mt-1 text-xs text-slate-500">路径代码用于机器分类；中文/英文显示名称用于编辑器、选择框与工作流。例如 ROD／道路、ROD/NOM／普通。</p><div className="mt-2 space-y-3">{levels.filter((level) => Boolean(node.path[level])).map((level) => {
      const label = node.classificationLabels?.[level] ?? { zh: String(node.path[level] ?? ''), en: '' };
      return <div key={level} className="cm-flex-grid min-w-0 gap-2 rounded border bg-white p-2"><HelpLabel context="ConfigStudio" className="text-xs">代码<input disabled className="mt-1 w-full rounded border bg-slate-100 px-2 py-1" value={String(node.path[level] ?? '')} /></HelpLabel><HelpLabel context="ConfigStudio" className="min-w-0 text-xs">名称（zh）<input className="mt-1 w-full rounded border px-2 py-1" value={label.zh} onChange={(event) => updateClassificationLabel(level, 'zh', event.target.value)} /></HelpLabel><HelpLabel context="ConfigStudio" className="min-w-0 text-xs">名称（en）<input className="mt-1 w-full rounded border px-2 py-1" value={label.en} onChange={(event) => updateClassificationLabel(level, 'en', event.target.value)} /></HelpLabel></div>;
    })}</div></section>
    <div className="space-y-3">{renderScope('root', '顶级字段', '直接写入要素根对象。')}{renderScope('tags', 'tags（可选字段组）', '写入 tags.xxx；字段组本身不可删除。')}{renderScope('extensions', 'extensions（可选字段组）', '写入 extensions.xxx；字段组本身不可删除。')}</div>
  </section>;
}

function EngineEditor({ engine, config, onChange }: { engine: ConfigEngineSettings; config: ConfigPackageV3; onChange: (next: ConfigEngineSettings) => void }) {
  const [geometry, setGeometry] = useState<GeometryKind>('Point');
  const baseline = engine.interactionBaselines[geometry];
  const updateState = (state: InteractionState, patch: Partial<typeof baseline[InteractionState]>) => onChange({ ...engine, interactionBaselines: { ...engine.interactionBaselines, [geometry]: { ...baseline, [state]: { ...baseline[state], ...patch } } } });
  const contextView = engine.contextView ?? { minZoom: 6, activationRadiusPx: 70, retainRadiusPx: 120 };
  return <details className="cm-panel">
    <summary className="cursor-pointer font-medium">引擎参数</summary>
    <div className="mt-1 flex flex-wrap items-center gap-2"><p className="mr-auto text-xs text-slate-600">World 永远由当前地图世界赋值。导航/编辑态不是渲染规则选择项；交互状态、点击容差、屏幕阈值，以及通用主结构/单元视角入口统一在此处定义。</p></div>
    <div className="mt-2 cm-flex-grid gap-2">
      <HelpLabel context="ConfigStudio" className="text-xs">World 系统字段<input disabled className="mt-1 w-full rounded border bg-slate-100 px-2 py-1" value="World（活动世界自动赋值）" /></HelpLabel>
      <NumberField label="面最小屏幕面积 px²" value={engine.screenGateDefaults.polygonMinScreenAreaPx} min={0} onChange={(value) => onChange({ ...engine, screenGateDefaults: { ...engine.screenGateDefaults, polygonMinScreenAreaPx: value } })} />
      <NumberField label="线最小屏幕长度 px" value={engine.screenGateDefaults.lineMinScreenLengthPx} min={0} onChange={(value) => onChange({ ...engine, screenGateDefaults: { ...engine.screenGateDefaults, lineMinScreenLengthPx: value } })} />
    </div>
    <fieldset className="mt-3 rounded border bg-white p-2 text-xs"><legend>共享 Pane 名称</legend><div className="cm-flex-grid gap-2">{Object.entries(engine.paneDefaults).map(([key,value]) => <HelpLabel context="ConfigStudio" key={key}>{key}<input className="w-full rounded border px-2" value={value} onChange={event => onChange({ ...engine, paneDefaults: { ...engine.paneDefaults, [key]: event.target.value } })} /></HelpLabel>)}</div></fieldset>
    <details className="cm-subsection"><summary className="text-xs">{geometryLabel[geometry]}通用候选、密度与稳定性默认<ModuleHelp title={`${geometryLabel[geometry]}通用候选、密度与稳定性默认`} helpKey="全局扩展默认" /></summary><RenderRuleExtensionsEditor config={config} sourcePath={config.nodes.find(node => node.geometryType === geometry)?.path ?? { class: '' }} fields={['ID','Name']} geometry={geometry} rule={{ id: 'engine-default', extensions: engine.renderDefaults?.[geometry] }} onChange={rule => onChange({ ...engine, renderDefaults: { ...engine.renderDefaults, [geometry]: rule.extensions } })} /><ExtraRuleSettings rule={{ id: 'engine-default', extensions: engine.renderDefaults?.[geometry] }} onChange={rule => onChange({ ...engine, renderDefaults: { ...engine.renderDefaults, [geometry]: rule.extensions } })}  config={config} geometry={geometry} /></details>
    <div className="cm-subsection">
      <strong className="text-sm">通用包含关系视角</strong>
      <p className="mt-1 text-xs text-slate-500">分类和关联字段在下方“包含关系绑定”中选择；这里仅定义进入/保持视角的全局方式。</p>
      <div className="mt-2 cm-flex-grid gap-2">
        <NumberField label="进入视角最小 Zoom" value={contextView.minZoom} min={0} max={8} onChange={(value) => onChange({ ...engine, contextView: { ...contextView, minZoom: value ?? 6 } })} />
        <NumberField label="激活半径 px" value={contextView.activationRadiusPx} min={0} onChange={(value) => onChange({ ...engine, contextView: { ...contextView, activationRadiusPx: value ?? 0 } })} />
        <NumberField label="保持半径 px" value={contextView.retainRadiusPx} min={0} onChange={(value) => onChange({ ...engine, contextView: { ...contextView, retainRadiusPx: value ?? 0 } })} />
      </div>
    </div>
    <div className="cm-subsection">
      <div className="flex flex-wrap items-center gap-3">
        <strong className="text-sm">统一交互基准</strong>
        <HelpLabel context="ConfigStudio" className="text-xs">几何<select className="ml-1 rounded border px-2 py-1" value={geometry} onChange={(event) => setGeometry(event.target.value as GeometryKind)}>{geometries.map((item) => <option key={item} value={item}>{geometryLabel[item]}</option>)}</select></HelpLabel>
        <NumberField label="默认点击容差 px" value={baseline.hitTolerancePx} min={0} max={80} onChange={(value) => onChange({ ...engine, interactionBaselines: { ...engine.interactionBaselines, [geometry]: { ...baseline, hitTolerancePx: value ?? 0 } } })} />
      </div>
      <div className="mt-2 cm-flex-grid gap-2 2xl:grid-cols-5">
        {interactionStates.map((state) => <fieldset key={state} className="rounded border p-2">
          <legend className="px-1 text-xs">{interactionStateLabel[state]}</legend>
          <HelpLabel context="ConfigStudio" className="text-xs"><input type="checkbox" checked={baseline[state].enabled} onChange={(event) => updateState(state, { enabled: event.target.checked })} /> 启用</HelpLabel>
          <HelpLabel context="ConfigStudio" className="mt-1 block text-xs">描边颜色<input className="mt-1 h-7 w-full" type="color" value={baseline[state].strokeColor} onChange={(event) => updateState(state, { strokeColor: event.target.value })} /></HelpLabel>
          <NumberField label="描边粗细" value={baseline[state].strokeWidth} min={0} step={0.5} onChange={(value) => updateState(state, { strokeWidth: value ?? 0 })} />
          <OpacityField label="描边透明度" value={baseline[state].strokeOpacity} onChange={(value) => updateState(state, { strokeOpacity: value })} />
          <HelpLabel context="ConfigStudio" className="mt-1 block text-xs">填色颜色<input className="mt-1 h-7 w-full" type="color" value={baseline[state].fillColor ?? baseline[state].strokeColor} onChange={(event) => updateState(state, { fillColor: event.target.value })} /></HelpLabel>
          <OpacityField label="填色透明度" value={baseline[state].fillOpacity} onChange={(value) => updateState(state, { fillOpacity: value })} />
          <NumberField label="zIndex 偏移" value={baseline[state].zIndexOffset} step={1} onChange={(value) => updateState(state, { zIndexOffset: value })} />
          <NumberField label="Label 优先级" value={baseline[state].labelPriority} step={1} onChange={(value) => updateState(state, { labelPriority: value })} />
          <HelpLabel context="ConfigStudio" className="mt-1 block text-xs"><input type="checkbox" checked={baseline[state].forceShowLabel !== false} onChange={(event) => updateState(state, { forceShowLabel: event.target.checked })} /> 强制显示 Label</HelpLabel>
          <InteractionShapeSettings visual={baseline[state]} onChange={patch => updateState(state, patch)} />
        </fieldset>)}
      </div>
    </div>
  </details>;
}

function ContextBindingsEditor({ config, selected, onChange }: { config: ConfigPackageV3; selected: CategoryNode; onChange: (next: ConfigPackageV3) => void }) {
  const bindings = config.contextBindings ?? [];
  const related = bindings.filter((binding) => samePath(binding.host.classification, selected.path) || samePath(binding.member.classification, selected.path));
  const endpointFields = (path: ClassificationPath) => allFieldKeys(config, path);
  const create = () => {
    const binding: ContextBinding = { id: uid('context'), label: { zh: '新的包含关系', en: 'New context binding' }, host: { classification: selected.path, referenceField: 'ID' }, member: { classification: { class: '' }, referenceField: '' }, enabled: false, profile: 'default' };
    onChange({ ...config, contextBindings: [...bindings, binding] });
  };
  const update = (id: string, patch: Partial<ContextBinding>) => onChange({ ...config, contextBindings: bindings.map((binding) => binding.id === id ? { ...binding, ...patch } : binding) });
  const selectEndpoint = (binding: ContextBinding, side: 'host' | 'member', nodeId: string) => {
    const node = config.nodes.find((item) => item.nodeId === nodeId);
    update(binding.id, { [side]: { classification: node?.path ?? { class: '' }, referenceField: '' } } as Partial<ContextBinding>);
  };
  return (
    <section className="rounded border p-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">包含关系绑定</h3>
          <p className="text-xs text-slate-500">任意主结构与任意附属/单元分类可互相绑定；不是 BUD/FLR 特例，也不属于任一 Zoom 渲染规则。</p>
        </div>
        <button type="button" className="inline-flex items-center gap-1 rounded border px-2 py-1 text-sm" onClick={create}><Plus className="h-4 w-4" />新建绑定</button>
      </div>
      {related.length ? (
        <div className="mt-2 space-y-2">
          {related.map((binding) => {
            const memberFields = endpointFields(binding.member.classification);
            return <div key={binding.id} className="rounded border bg-slate-50 p-2">
              <div className="flex flex-wrap items-center gap-2">
                <HelpControl context="ConfigStudio"><input className="min-w-40 flex-1 rounded border px-2 py-1 text-sm" value={binding.label.zh} onChange={(event) => update(binding.id, { label: { zh: event.target.value, en: binding.label.en } })} /></HelpControl>
                <HelpLabel context="ConfigStudio" className="text-xs"><input type="checkbox" checked={binding.enabled} onChange={(event) => update(binding.id, { enabled: event.target.checked })} /> 启用</HelpLabel>
                <HelpLabel context="ConfigStudio" className="text-xs">成员显示<select className="ml-1 rounded border px-2 py-1" value={binding.profile} onChange={(event) => update(binding.id, { profile: event.target.value as ContextBinding['profile'] })}><option value="default">关联成员</option><option value="keep-host-context">保留主结构上下文</option><option value="show-active-member-only">仅当前成员</option></select></HelpLabel>
                <button type="button" className="text-xs text-rose-700" onClick={() => onChange({ ...config, contextBindings: bindings.filter((item) => item.id !== binding.id) })}>删除</button>
              </div>
              <div className="mt-2 cm-flex-grid gap-2">
                {(['host', 'member'] as const).map((side) => {
                  const endpoint = binding[side];
                  const current = config.nodes.find((node) => samePath(node.path, endpoint.classification));
                  return <fieldset key={side} className="rounded border bg-white p-2">
                    <legend className="px-1 text-xs">{side === 'host' ? '主结构' : '附属/单元'}</legend>
                    <HelpLabel context="ConfigStudio" className="text-xs">分类<select className="mt-1 w-full rounded border px-2 py-1" value={current?.nodeId ?? ''} onChange={(event) => selectEndpoint(binding, side, event.target.value)}><option value="">选择分类</option>{config.nodes.map((node) => <option key={node.nodeId} value={node.nodeId}>{nodeLabel(node)}</option>)}</select></HelpLabel>
                    <HelpLabel context="ConfigStudio" className="mt-1 block text-xs">引用字段<select className="mt-1 w-full rounded border px-2 py-1" value={endpoint.referenceField} onChange={(event) => update(binding.id, { [side]: { ...endpoint, referenceField: event.target.value } } as Partial<ContextBinding>)}><option value="">选择字段</option>{endpointFields(endpoint.classification).map((field) => <option key={field}>{field}</option>)}</select></HelpLabel>
                  </fieldset>;
                })}
              </div>
              <HelpLabel context="ConfigStudio" className="mt-2 block max-w-sm text-xs">附属/单元切换字段（可选）<select className="mt-1 w-full rounded border px-2 py-1" value={binding.memberSelectorField ?? ''} onChange={(event) => update(binding.id, { memberSelectorField: event.target.value || undefined })}><option value="">默认 ID</option>{memberFields.map((field) => <option key={field}>{field}</option>)}</select></HelpLabel>
            </div>;
          })}
        </div>
      ) : <p className="mt-2 text-sm text-slate-500">当前分类尚未参与包含关系绑定。</p>}
    </section>
  );
}

function Report({ config: _config, records, report, onConfirm }: { config: ConfigPackageV3; records: MountedFeatureRecord[]; report: ReturnType<typeof validateConfigPackage> | null;onConfirm?:(paths:string[])=>void }) {
  if (!report) return <section className="shrink-0 border-t bg-white px-4 py-2 text-xs text-slate-500">尚未核验。核验会按错误编码、字段/内容和受影响要素 ID 集分组显示。</section>;
  const groups = new Map<string, typeof report.issues>();
  report.issues.forEach((item) => { const key = `${item.severity}:${item.code}:${item.message}`; groups.set(key, [...(groups.get(key) ?? []), item]); });
  return <details data-fold-transient className="shrink-0 border-t bg-white px-4 py-2" open={!report.valid}><summary className={`cursor-pointer font-medium ${report.valid ? 'text-emerald-700' : 'text-rose-700'}`}>{report.valid ? '核验通过' : `发现 ${[...groups.values()].filter((items) => items.some((item) => item.severity === 'error')).length} 个问题组`} · 挂载记录 {records.length}</summary><div className="mt-2 max-h-48 space-y-2 overflow-auto">{[...groups.entries()].map(([key, items]) => { const affected = [...new Map(items.flatMap((item) => item.affectedFeatures ?? []).map((item) => [item.id, item])).values()]; return <div key={key} className={`rounded border px-3 py-2 text-xs ${items.some((item) => item.severity === 'error') ? 'border-rose-200 bg-rose-50 text-rose-900' : 'border-amber-200 bg-amber-50 text-amber-900'}`}><strong>{items[0].code}</strong> · {items[0].field ?? items[0].path} · {items[0].message}{items[0].code==='prefill-copy-outdated'&&onConfirm?<button type="button" className="ml-2 rounded border px-2 py-1" onClick={()=>onConfirm(items.map(item=>item.path))}>确认保留本次副本</button>:null}{affected.length ? <div className="mt-1">要素 ID：{affected.map((item) => `${item.id}${item.name ? `(${item.name})` : ''}`).join('、')}</div> : null}</div>; })}</div></details>;
}

export function ConfigStudio({ onClose, mountedRecords, initialTab }: { onClose: () => void; mountedRecords?: MountedFeatureRecord[]; initialTab?: StudioTab }) {
  const workspace=useWorkspaceState();
  const [importReview,setImportReview]=useState<{config:ConfigPackageV3;diagnostic?:TemporaryDiagnostic;recheckReason?:string}>(),[showImported,setShowImported]=useState(false),[autoRecheck,setAutoRecheck]=useState(false);
  const [activeTab, setActiveTab] = useState<StudioTab>(() => {
    const session=getStudioSessionSnapshot();
    if (session?.workflowSession?.draft||session?.workflowSession?.creation) return 'workflows';
    if (session?.activeTab) return session.activeTab;
    if(session?.lookupDraft||session?.engineDraft||session?.draft||session?.tree||session?.editing)return 'features';
    if(Object.keys(session?.generalDrafts??{}).length)return 'general';
    return initialTab ?? (new URLSearchParams(window.location.search).get('tab') === 'workflows' ? 'workflows' : new URLSearchParams(window.location.search).get('tab') === 'general' ? 'general' : 'features');
  });
  const [workflowHasDraft, setWorkflowHasDraft] = useState(Boolean(getStudioSessionSnapshot()?.workflowSession?.draft||getStudioSessionSnapshot()?.workflowSession?.creation));
  const [savedConfig, setSavedConfig] = useState<ConfigPackageV3>(() => {
    const stored = readLocalConfig();
    return stored;
  });
  const [restoredSession]=useState(getStudioSessionSnapshot);
  const [restoredCandidate] = useState(() => recoverPackageCandidate(restoredSession));
  // Only the old, unscoped package draft is consumed by candidate recovery.
  // A modern candidate may itself contain an unfinished category edit.
  const restoredLegacyPackageDraft = Boolean(restoredCandidate && !restoredSession?.packageCandidate);
  const [packageCandidate, setPackageCandidate] = useState<PackageCandidate | null>(restoredCandidate);
  const [packageReport, setPackageReport] = useState<ReturnType<typeof validateConfigPackage> | null>(null);
  const [packageBusy, setPackageBusy] = useState(false);
  const [engineDraft, setEngineDraft] = useState<EngineDraft | null>(restoredSession?.engineDraft ?? null);
  const [workflowSession, setWorkflowSession] = useState<WorkflowEditingSession | null>(restoredSession?.workflowSession ?? null);
  const [detailsByTab,setDetailsByTab]=useState<Partial<Record<StudioTab,string[]>>>(()=>Object.fromEntries(Object.entries(restoredSession?.detailsByTab??{}).map(([tab,rows])=>[tab,rows.filter((v):v is string=>typeof v==='string')])) );
  const engineHasDraft = engineDraft !== null;
  const [lookupDraft,setLookupDraft]=useState<LookupTableDraft|null>(restoredSession?.lookupDraft??null);
  const lookupHasDraft=lookupDraft!==null;
  const [applicationImpact,setApplicationImpact]=useState<string[]>([]);
  const impactDecision=useRef<(accepted:boolean)=>void>();
  const finishImpact=(accepted:boolean)=>{impactDecision.current?.(accepted);impactDecision.current=undefined;setApplicationImpact([]);};
  const [generalDrafts,setGeneralDrafts]=useState<GeneralDrafts>(restoredSession?.generalDrafts??{});
  const generalHasDraft=Object.keys(generalDrafts).length>0;
  const [treeSession,setTreeSession]=useState<ClassTreeSession|null>(restoredSession?.tree??null);
  const [treeReport,setTreeReport]=useState<ReturnType<typeof validateConfigPackage>|null>(null);
  const [deletionPlan,setDeletionPlan]=useState<ReturnType<typeof prepareCategoryDeletion>|null>(null);
  const [importConflict,setImportConflict]=useState<{artifact:CategoryArtifact;result:CategoryImportResult}|null>(null);
  const [draftConfig, setDraftConfig] = useState<ConfigPackageV3 | null>(restoredLegacyPackageDraft ? null : restoredSession?.draft??null);
  const [draftScope, setDraftScope] = useState<FeatureDraftScope>('category');
  const [selectedId, setSelectedId] = useState(restoredSession?.selectedId??'');
  const [categoryCreation,setCategoryCreation]=useState<CategoryCreationDraft|null>(restoredSession?.categoryCreation??null);
  const [categoryHasDraft,setCategoryHasDraft]=useState(Boolean(restoredSession?.categoryCreation));
  const [editing, setEditing] = useState(restoredLegacyPackageDraft ? false : restoredSession?.editing??false);
  const [editorExpanded, setEditorExpanded] = useState(restoredSession?.editorExpanded??true);
  const [message, setMessage] = useState(() => { try { return sessionStorage.getItem('cairnmap-config-studio-recovery-issue') ?? '已加载本机编辑版本，与线上正式配置分别保存；可点击“恢复当前正式配置”同步。正式发布需通过全局核验和维护者身份确认。'; } catch { return '已加载本地编辑版本。'; } });
  const [report, setReport] = useState<ReturnType<typeof validateConfigPackage> | null>(null);
  const [scenario, setScenarioState] = useState<PreviewScenario>(restoredSession?.scenario??'singlePoint');
  const setScenario = (value: string) => setScenarioState(value as PreviewScenario);
  const uploadRef = useRef<HTMLInputElement>(null);
  const importController=useRef<AbortController>();
  const [importing,setImporting]=useState(false);
  const [importBusy,setImportBusy]=useState(false);
  useEffect(()=>()=>importController.current?.abort(),[]);
  const records = useMemo(() => mountedRecords ?? readMountedRecords(), [mountedRecords]);
  const workingConfig = packageCandidate?.config ?? savedConfig;
  const config = draftConfig ?? treeSession?.staged ?? workingConfig;
  const previewConfig = useMemo(() => engineDraft ? { ...config, engine: engineDraft.value } : config, [config, engineDraft]);
  const packageDraft = packageCandidate !== null;
  const featureHasDraft = Boolean(draftConfig || editing || categoryHasDraft || treeSession);
  const hasRegionDraft = Boolean(featureHasDraft || lookupHasDraft || engineHasDraft || generalHasDraft || workflowHasDraft || workflowSession?.draft || workflowSession?.creation);
  useEffect(()=>{if(hasRegionDraft)setPackageReport(null);},[hasRegionDraft]);
  useEffect(()=>setPackageReport(null),[packageCandidate?.config,records]);
  const editingSnapshot=useRef<StudioEditingSession|null>(null);
  editingSnapshot.current={draft:draftConfig,draftScope,tree:treeSession,selectedId,editing,baseline:savedConfig,generalDrafts,lookupDraft,engineDraft,packageCandidate,activeTab,workflowSession,editorExpanded,scenario,categoryCreation,detailsByTab};
  useEffect(()=>{void saveStudioEditingSession(editingSnapshot.current).catch(error=>setMessage(String(error)));},[savedConfig,draftConfig,draftScope,treeSession,selectedId,editing,generalDrafts,lookupDraft,engineDraft,packageCandidate,activeTab,workflowSession,editorExpanded,scenario,categoryCreation,detailsByTab]);
  useEffect(()=>{
    const root=document.querySelector('main.config-editor');if(!root)return;
    const details=()=>Array.from(root.querySelectorAll<HTMLDetailsElement>('details')).filter(item=>!item.closest('[data-fold-transient]'));
    const prefix=activeTab+':'+selectedId+':';const key=(item:HTMLDetailsElement)=>studioFoldKey(item,prefix);
    const remembered=detailsByTab[activeTab];if(remembered)details().forEach(item=>{item.open=remembered.includes(key(item));});
    const changed=(event:Event)=>{if(!(event.target instanceof HTMLDetailsElement)||!root.contains(event.target))return;const opened=[...(detailsByTab[activeTab]??[]).filter(value=>!value.startsWith(prefix)),...details().flatMap(item=>item.open?[key(item)]:[])];setDetailsByTab(previous=>stableConfigText(previous[activeTab])===stableConfigText(opened)?previous:{...previous,[activeTab]:opened});};
    root.addEventListener('toggle',changed,true);return()=>root.removeEventListener('toggle',changed,true);
  },[activeTab,selectedId]);
  const stageCandidate = (next: ConfigPackageV3, area: string) => {
    if (!packageCandidate) throw Error('整包候选已结束，请重新读取。');
    setPackageCandidate({ ...packageCandidate, config: next });setPackageReport(null);setReport(null);
    setMessage(area+'已暂存到整包候选；本地活动配置未改变，仍需顶部整包核验并保存。');
  };
  const beginCandidate = (next: ConfigPackageV3, source: PackageCandidate['source']) => {
    setPackageCandidate({baseline:packageCandidate?.baseline??savedConfig,config:next,source});setPackageReport(null);setDraftConfig(null);setEditing(false);setActiveTab('features');setReport(null);
  };
  const selected = config.nodes.find((node) => node.nodeId === selectedId);
  const setConfig = (next: ConfigPackageV3 | ((current: ConfigPackageV3) => ConfigPackageV3)) => {
    const current = draftConfig ?? clone(treeSession?.staged??workingConfig);
    const resolved = typeof next === 'function' ? (next as (value: ConfigPackageV3) => ConfigPackageV3)(current) : next;
    if (!draftConfig) setDraftScope('category');
    const canonical=clone(resolved);if(canonical.contractRevision>=14)addC14NodeDefaults(canonical.nodes);
    setDraftConfig(declareNewIconCapability(current,canonical));
    setEditing(true);
    setReport(null);setTreeReport(null);
  };
  const switchTab = (next: StudioTab) => {
    if (!canSwitchStudioTab(activeTab, next, { feature: lookupHasDraft || engineHasDraft || featureHasDraft, workflow: workflowHasDraft || Boolean(workflowSession?.draft||workflowSession?.creation), general:generalHasDraft })) {
      setMessage('请先保存或放弃当前草稿，再切换设计标签。');
      return;
    }
    setActiveTab(next);
    const target = new URL(window.location.href);
    target.searchParams.set('workspace', 'config-studio');
    target.searchParams.set('tab', next);
    window.history.replaceState(null, '', target);
  };
  const saveWorkflowPackage = async (next: ConfigPackageV3): Promise<boolean> => {
    const changed = next.workflows.filter(w => stableConfigText(workingConfig.workflows.find(before => before.id === w.id)) !== stableConfigText(w));
    const nextReport = validateStudioModule(next, records, packageCandidate ? changed.map(w => 'workflows/'+w.id) : undefined);
    setReport(nextReport);
    if (!nextReport.valid) { setMessage('工作流保存被核验阻断。'); return false; }
    if (packageCandidate) { stageCandidate(next,'工作流'); return true; }
    try {setSavedConfig(await persistActiveConfig(next,true));setMessage('工作流已持久保存到当前活动配置。');return true;}catch(error){setMessage(String(error));return false;}
  };
  const saveLookupTables = async (draft: LookupTableDraft): Promise<void> => {
    const durable = packageCandidate ? undefined : await readDurableActiveConfig();
    const next=prepareLookupTableCommit(durable?.config ?? workingConfig,draft);
    const result=validateStudioModule(next,records,packageCandidate?['lookupTables']:undefined);
    if(!result.valid)throw Error(result.issues.filter(issue=>issue.severity==='error').map(issue=>issue.path+'：'+issue.message).join('\n'));
    if(packageCandidate){stageCandidate(next,'对照表');return;}
    setSavedConfig(await persistActiveConfig(next,true,durable));setMessage('对照表已独立保存并应用，其他区域内容保持。');
  };
  const saveEngine = async (draft: EngineDraft): Promise<void> => {
    const durable = packageCandidate ? undefined : await readDurableActiveConfig();
    const next=prepareEngineCommit(durable?.config ?? workingConfig,draft);
    const result=validateStudioModule(next,records,packageCandidate?['engine']:undefined);
    if(!result.valid)throw Error(result.issues.filter(issue=>issue.severity==='error').map(issue=>issue.path+'：'+issue.message).join('\n'));
    if(packageCandidate){stageCandidate(next,'全局引擎');return;}
    setSavedConfig(await persistActiveConfig(next,true,durable));setMessage('全局引擎已独立保存并应用，其他区域内容保持。');
  };
  const saveGeneral=async(section:ApplicationSection,value:ApplicationSettings[ApplicationSection],baseline:string,relatedSources?:RelatedSourceDraft):Promise<boolean>=>{
    try{
      const durable = packageCandidate ? undefined : await readDurableActiveConfig();
      const base=durable?.config ?? workingConfig;
      if(base.contractRevision<10)throw Error('总体规则最低要求 c10，请先明确升级工作稿。');
      if(!base.application)throw Error('缺少总体规则。');
      let nextApplication=mergeApplicationSection(base.application,section,value,baseline);
      if(relatedSources)nextApplication=mergeApplicationSection(nextApplication,'sources',relatedSources.value,relatedSources.baseline);
      const next={...base,application:nextApplication},result=validateStudioModule(next,records,packageCandidate?['application/'+section,...(relatedSources?['application/sources']:[])]:undefined);setReport(result);if(!result.valid){setMessage('总体规则保存被核验阻断。');return false;}
      const impact=applicationIdentityImpact(base.application,nextApplication);
      if(impact.length&&!await new Promise<boolean>(resolve=>{impactDecision.current=resolve;setApplicationImpact(impact);}))return false;
      if(packageCandidate){stageCandidate(next,'总体规则模块');return true;}
      setSavedConfig(await persistActiveConfig(next,true,durable));setMessage('总体规则模块已保存并应用。');return true;
    }catch(error){setMessage(String(error));return false;}
  };
  const validatePackageCandidate = async () => {
    if(!packageCandidate||hasRegionDraft)return;
    try{const run=await validateWorkspace(packageCandidate.config,records,getWorkspaceState().generation,packageCandidate.baseline);recordWorkspaceValidation(run);setPackageReport(run.report);setReport(null);setMessage(run.report.valid?'整包候选核验通过，可以保存到本机。':'整包候选仍有阻断问题，可以临时下载并继续修复。');}catch(error){setMessage(String(error));}
  };
  const savePackageCandidate = async () => {
    if(!packageCandidate||hasRegionDraft||packageBusy)return;
    const next=withCategoryDeletionIssues(validateConfigPackage(packageCandidate.config,records),packageCandidate.baseline,packageCandidate.config,records);setPackageReport(next);if(!next.valid)return;
    if(!window.confirm('将核验通过的整包候选保存为本地活动配置。确定继续吗？'))return;
    setPackageBusy(true);setMessage('正在核验并保存整包候选…');
    try{
      const durable=await readDurableActiveConfig();
      if(stableConfigText(durable.config)!==stableConfigText(packageCandidate.baseline))throw Error('本地活动配置已被其他编辑更新，整包候选已保留，请先比较基线。');
      setSavedConfig(await persistActiveConfig(packageCandidate.config,false,durable));
      await saveStudioEditingSession(null);setPackageCandidate(null);setPackageReport(null);setSelectedId('');setReport(null);setMessage('整包候选已保存为本地活动配置；正式发布仍需全局核验。');
    }catch(error){setMessage(String(error));}finally{setPackageBusy(false);}
  };
  const discardPackageCandidate = async () => {
    if(hasRegionDraft||packageBusy)return;
    await saveStudioEditingSession(null);setPackageCandidate(null);setPackageReport(null);setSelectedId('');setReport(null);setMessage('已放弃整包候选，原本地活动配置保持。');
  };
  const readSelected = () => {
    if (!selected) { setMessage('请先新建或选择一个分类。'); return; }
    if(editing||categoryHasDraft)return; // A staged ordinary draft remains the source when another node is read.
    if (!draftConfig) { setDraftConfig(clone(treeSession?.staged??workingConfig)); setDraftScope('category'); }
    setEditing(true); setReport(null); setMessage(`已读取 ${nodeLabel(selected)} 到本地草稿。`);
  };
  const validate = () => {
    const next = validateStudioModule(config, records, packageCandidate ? ['nodes/'+selectedId] : undefined);
    setReport(next); setMessage(next.valid ? '核验通过：当前草稿可保存。' : `核验发现 ${next.issues.filter((item) => item.severity === 'error').length} 项阻断问题。`);
  };
  const stageCategoryNode = async () => {
    if(!draftConfig||!editing||treeSession)return;
    const next=validateStudioModule(config,records,packageCandidate?['nodes/'+selectedId]:undefined);setReport(next);
    if(!categoryDraftReport(next).valid){setMessage('节点暂存被阻断；除未完成末端的几何外，其他核验错误须先修复。');return;}
    await saveStudioEditingSession({...editingSnapshot.current!,draft:config,editing:false});
    setEditing(false);setMessage('节点已暂存到普通分类草稿，可继续选择或新增子分类；本地活动配置未改变，完成后仍须核验保存。');
  };
  const requestCategoryDeletion = () => {
    if(!selected||hasRegionDraft||treeSession)return;
    try{setDeletionPlan(prepareCategoryDeletion(workingConfig,selected.nodeId,records));}catch(error){setMessage(String(error));}
  };
  const confirmCategoryDeletion = () => {
    if(!deletionPlan||hasRegionDraft||treeSession)return;
    try{const next=prepareCategoryDeletion(workingConfig,deletionPlan.selectedId,records);beginCandidate(next.config,'editing');setSelectedId('');setDeletionPlan(null);setReport(next.report);setMessage('分类及其全部子分类已暂存删除；请修复引用，再使用顶部整包核验保存。本地活动配置未改变。');}catch(error){setMessage(String(error));}
  };
  const deleteWorkflow = (id:string) => {
    if(hasRegionDraft)return;
    beginCandidate({...workingConfig,workflows:workingConfig.workflows.filter(flow=>flow.id!==id)},'editing');setWorkflowSession(null);setActiveTab('workflows');setMessage('工作流已暂存删除；请使用顶部整包核验保存，或放弃整包草稿恢复。本地活动配置未改变。');
  };
  const save = async () => {
    const next = validateStudioModule(config, records, packageCandidate ? ['nodes/'+selectedId] : undefined);
    setReport(next);
    if(treeSession){const localErrors=next.issues.filter(issue=>issue.severity==='error'&&(issue.path.startsWith('nodes/'+selectedId)||issue.code==='native-contract-structure-invalid'));if(localErrors.length){setMessage('当前节点未通过核验，不能保存到暂存树。');return;}const nextTree={...treeSession,staged:config};await saveStudioEditingSession({...editingSnapshot.current!,draft:null,tree:nextTree,selectedId,editing:false,baseline:savedConfig});setTreeSession(nextTree);setDraftConfig(null);setEditing(false);setTreeReport(null);setMessage('已保存节点到暂存 Class 树；总配置尚未改变。');return;}
    if (!next.valid) { setMessage('保存被阻断；请先处理问题组。'); return; }
    if(packageCandidate){stageCandidate(config,'分类');setDraftConfig(null);setEditing(false);return;}
    if (!window.confirm('将当前 V3.2 草稿保存到浏览器本地配置。确定继续吗？')) return;
    try {setSavedConfig(await persistActiveConfig(config,true));await saveStudioEditingSession(null);setDraftConfig(null);setDraftScope('category');setEditing(false);setMessage('已保存本地活动配置，刷新后继续使用。');}catch(error){setMessage(String(error));}
  };
  const discard = async () => {await saveStudioEditingSession(packageCandidate||treeSession?{...editingSnapshot.current!,draft:null,tree:treeSession,selectedId,editing:false,baseline:savedConfig}:null);setDraftConfig(null);setDraftScope('category');setEditing(false);setReport(null);setMessage('已放弃未保存草稿。');};
  const applyCategoryImport=(result:CategoryImportResult)=>{
    if(treeSession&&result.classCode!==treeSession.classCode){setMessage('当前 Class 树模式不允许导入其他 Class。');return;}
    if(result.kind==='classTree'){
      const baseline=treeSession?.baseline??(workingConfig.contractRevision<9?migrateConfigToR9(workingConfig):workingConfig);
      setTreeSession({classCode:result.classCode,baseline,staged:result.config,changes:result.changes});setDraftConfig(null);setEditing(false);setTreeReport(result.report);
    }else{setDraftConfig(result.config);setDraftScope('category');setEditing(true);}
    if(result.migration)setMigrationAttachment({...getWorkspaceState().migration,report:result.migration},result.config);
    setSelectedId(result.selectedId);setEditorExpanded(false);setReport(result.report);setImportConflict(null);setMessage(result.kind==='classTree'?'已进入 Class 树导入暂存模式；核验保存后才注入总配置。':'已读取单分类导入草稿，请核验保存。');
  };
  const importCategoryFile=async(file:File)=>{try{if(editing||categoryHasDraft||draftConfig)throw Error('请先保存或放弃当前分类草稿。');setMigrationAttachment({original:await captureImportOriginal(file)});const artifact=await readCategoryArtifact(file);if(treeSession&&artifact.payload.classCode!==treeSession.classCode)throw Error('当前 Class 树模式不允许导入其他 Class。');const result=prepareCategoryImport(config,artifact);if(result.conflicts.length)setImportConflict({artifact,result});else applyCategoryImport(result);}catch(error){setMessage(String(error));}};
  const treePaths = () => treeSession ? [...treeSession.staged.nodes.filter(n=>n.path.class===treeSession.classCode).map(n=>'nodes/'+n.nodeId),'resources'] : [];
  const validateTree=async()=>{
    if(!treeSession)return;
    try{const live=packageCandidate?workingConfig:(await readDurableActiveConfig()).config,next=prepareClassTreeCommit(live,treeSession.baseline,treeSession.staged,treeSession.classCode),result=validateStudioModule(next,records,packageCandidate?treePaths():undefined);setTreeReport(result);setReport(result);setMessage(result.valid?'Class 树核验通过，可以保存。':'Class 树仍有阻断问题。');}catch(error){setTreeReport(null);setMessage(String(error));}
  };
  const saveTree=async()=>{
    if(!treeSession||editing||categoryHasDraft)return;
    try{const durable=packageCandidate?undefined:await readDurableActiveConfig(),next=prepareClassTreeCommit(durable?.config??workingConfig,treeSession.baseline,treeSession.staged,treeSession.classCode),result=validateStudioModule(next,records,packageCandidate?treePaths():undefined);setTreeReport(result);if(!result.valid)return;
      if(packageCandidate)stageCandidate(next,'Class 分类树');else setSavedConfig(await persistActiveConfig(next,true,durable));
      setTreeSession(null);setDraftConfig(null);setSelectedId('');setEditing(false);setReport(null);await saveStudioEditingSession(packageCandidate?{...editingSnapshot.current!,packageCandidate:{...packageCandidate,config:next},tree:null,draft:null,editing:false,selectedId:''}:null);
      if(!packageCandidate)setMessage('Class 分类树已整体替换保存到总配置。');
    }catch(error){setMessage(String(error));}
  };
  const discardTree=async()=>{await saveStudioEditingSession(packageCandidate?{...editingSnapshot.current!,tree:null,draft:null,editing:false,selectedId:''}:null);setTreeSession(null);setDraftConfig(null);setSelectedId('');setEditing(false);setReport(null);setTreeReport(null);setMessage('已放弃整次 Class 树导入。');};
  const importPackage = async (file?: File) => {
    if(treeSession){setMessage('请先保存或放弃 Class 树总控，再导入总包。');return;}
    if (!file) return;
    if(hasRegionDraft||packageBusy){setMessage('请先保存或放弃所有区域草稿。');return;}
    if(importController.current)return;
    const controller=new AbortController();importController.current=controller;setImporting(true);setImportBusy(true);
    try {
      setMigrationAttachment({original:await captureImportOriginal(file)});
      const imported = await readConfigPackageWithDiagnostics(file,{signal:controller.signal,onProgress:setMessage});
      controller.signal.throwIfAborted();
      if(imported.recheckReason)setImportReview(imported);else applyImportedPackage(imported,false);
    } catch (error) { setMessage(controller.signal.aborted?'已取消本次导入，当前配置保持原样。':error instanceof Error ? error.message : '配置包读取失败。'); }
    finally {importController.current=undefined;setImporting(false);setImportBusy(false);if(uploadRef.current)uploadRef.current.value='';}
  };
  const applyImportedPackage=(imported:{config:ConfigPackageV3;diagnostic?:TemporaryDiagnostic},recheck:boolean)=>{
    const migration=imported.config.contractRevision>=13&&imported.config.contractRevision<CONTRACT_CAPABILITIES.latest?migratePackageToContract(imported.config):undefined;
    const next=migration?.config??imported.config,importedReport=validateConfigPackage(next,records);
    setMigrationAttachment({...getWorkspaceState().migration,report:migration?.report??imported.diagnostic?.migration},next);
    if(importedReport.issues.some(issue=>issue.code==='native-contract-structure-invalid')){setReport(importedReport);setMessage('导入结构无效，原工作区保持。');return;}
    beginCandidate(next,'import');setSelectedId('');setEditorExpanded(true);setImportedDiagnostic(imported.diagnostic);setReport(importedReport);setAutoRecheck(recheck);
    setMessage(imported.diagnostic?'已载入隔离候选和上次导出报告；正式输出仍需本次全局核验。':'已导入隔离候选，请分区修复／暂存后执行全局核验。');
  };
  useEffect(()=>{if(autoRecheck&&packageCandidate&&!hasRegionDraft){setAutoRecheck(false);void validatePackageCandidate();}},[autoRecheck,packageCandidate,hasRegionDraft]);
  const inheritedGeometry = selected ? geometries.find((geometry) => Boolean(resolveGeometryProfile(config, selected.path, geometry)?.enabled)) : undefined;
  const geometry = selected?.geometryType ?? inheritedGeometry;
  const effectiveProfile = selected && geometry ? resolveGeometryProfile(config, selected.path, geometry) : undefined;
  const profile = selected && geometry ? selected.geometryProfiles[geometry] ?? (effectiveProfile ? { ...clone(effectiveProfile), zoomPriority: { rules: effectiveProfile.zoomPriority.rules.map(rule => ({ ...clone(rule), id: `${selected.nodeId}-${rule.id}` })) } } : editableGeometryProfile(geometry, config.contractRevision)) : undefined;
  const compatibleScenarios = selected ? PREVIEW_SCENARIOS.filter((item) => previewScenarioCompatible(config, selected, item.id)) : [];
  const activeScenario = compatibleScenarios.some((item) => item.id === scenario) ? scenario : compatibleScenarios[0]?.id;
  const updateSelected = (updater: (node: CategoryNode) => CategoryNode) => selected && setConfig((current) => updateNode(current, selected.nodeId, updater));

  const restoreFormalDefault = async () => {
    if (hasRegionDraft || packageDraft || packageBusy || importBusy) return;
    setPackageBusy(true);setMessage('正在读取并核验当前正式配置…');
    try { await restoreApplicationDefault();location.reload(); }
    catch (error) { setMessage(String(error)); }
    finally { setPackageBusy(false); }
  };
  return <RuntimePreviewProvider config={previewConfig} node={selected} scenario={activeScenario} onShow={() => setEditorExpanded(false)} resetKey={`${editing}:${activeTab}`}><main {...(packageBusy?{inert:''}:{})} aria-busy={packageBusy} className="config-editor cm-editor-design fixed inset-0 z-[3000] flex h-screen flex-col overflow-hidden bg-slate-100 text-slate-800"><header className="cm-studio-header flex shrink-0 flex-wrap items-center gap-3 border-b bg-white px-5 py-3"><SlidersHorizontal className="h-5 w-5 text-violet-600" /><div className="cm-studio-title min-w-0 flex-1"><h1 className="font-bold">配置文件工作台 · V3.2 原生渲染</h1><p className="text-xs text-slate-500">{workingConfig.packageId} · 本机编辑稿 {formatConfigRevision(workingConfig.revision)} · 契约 {formatContractRevision(workingConfig.contractRevision)} · World 自动归一化、原生渲染、信息卡和标准工作流均以可编辑 V3 配置承接。</p><p role="status" className="mt-1 text-xs text-slate-500">本地检查点：{workspace.savedAt?new Date(workspace.savedAt).toLocaleString():workspace.modified?'正在准备缓存…':'尚无编辑缓存'}{workspace.writeError?' · 写入失败，请重试或临时下载':''}</p></div>{workingConfig.contractRevision<CONTRACT_CAPABILITIES.latest?<button type="button" className="rounded border px-3 py-1.5 text-sm" disabled={hasRegionDraft||packageBusy} onClick={()=>{try{const base=workingConfig.contractRevision<13?migrateConfigToR13(workingConfig).config:workingConfig;const next=migratePackageToContract({...base,revision:workingConfig.revision});setMigrationAttachment({...getWorkspaceState().migration,report:next.report},next.config,workingConfig);beginCandidate(next.config,'migration');setSelectedId('');setEditorExpanded(true);setMessage('已建立 '+formatContractRevision(next.config.contractRevision)+' 整包候选；区域保存仅暂存，最终从顶部核验保存。');}catch(error){setMessage(String(error));}}}>迁移到 {formatContractRevision(CONTRACT_CAPABILITIES.latest)} 草稿</button>:null}<button type="button" className="rounded border px-3 py-1.5 text-sm" disabled={hasRegionDraft||packageDraft||packageBusy} title="读取并核验当前 Web 正式配置，清除本机工作区后恢复默认。" onClick={()=>void restoreFormalDefault()}>恢复当前正式配置</button><button type="button" className="inline-flex items-center gap-1 rounded border px-3 py-1.5 text-sm" disabled={importBusy||hasRegionDraft||packageDraft||packageBusy} title={`完整包 ${formatContractRevision(migrationMinimumRevision())} 起自动迁移到 ${formatContractRevision(CONTRACT_CAPABILITIES.latest)} 候选；原件保留，须核验后保存。`} onClick={() => uploadRef.current?.click()}><FileUp className="h-4 w-4" />导入本地配置</button><span className="hidden text-xs text-slate-500 2xl:inline">完整包 {formatContractRevision(migrationMinimumRevision())} 起自动迁移到 {formatContractRevision(CONTRACT_CAPABILITIES.latest)} 候选</span><GlobalPackageControls config={workingConfig} validationBaseline={packageCandidate?.baseline} records={records} hasDraft={importBusy||hasRegionDraft||packageBusy} formalBlocked={packageDraft} onValidated={run=>{if(packageCandidate)setPackageReport(run.report);else setReport(run.report);}} onSaved={setSavedConfig} onMessage={setMessage}/>{activeTab==='features'?<button type="button" className="inline-flex items-center gap-1 rounded border px-3 py-1.5 text-sm" disabled={!selected||activeTab!=='features'} onClick={() => setEditorExpanded((value) => !value)}>{editorExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}{editorExpanded ? '显示验证器' : '编辑器全屏'}</button>:null}<button type="button" className="rounded p-2 hover:bg-slate-100" onClick={() => { if(packageBusy||importBusy)return;onClose(); }} aria-label="关闭"><X className="h-5 w-5" /></button><>{importing?<button type="button" className="rounded border px-3 py-1.5 text-sm" onClick={()=>importController.current?.abort()}>取消导入</button>:null}</><input ref={uploadRef} className="hidden" type="file" accept=".zip,.json,application/zip,application/json" onChange={(event) => void importPackage(event.target.files?.[0])} /></header>
    <nav className="cm-studio-tabs flex shrink-0 flex-wrap gap-2 border-b bg-white px-5 py-2" aria-label="设计工作区"><button type="button" role="tab" aria-selected={activeTab==='general'} className={`rounded border border-transparent px-4 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-600 ${activeTab==='general'?'bg-violet-600 text-white':'border-slate-200 bg-slate-100 hover:bg-slate-200'}`} onClick={()=>switchTab('general')}>总体规则</button><button type="button" role="tab" aria-selected={activeTab === 'features'} className={`rounded border border-transparent px-4 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-600 ${activeTab === 'features' ? 'bg-violet-600 text-white' : 'border-slate-200 bg-slate-100 hover:bg-slate-200'}`} onClick={() => switchTab('features')}>要素设计</button><button type="button" role="tab" aria-selected={activeTab === 'workflows'} className={`rounded border border-transparent px-4 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-600 ${activeTab === 'workflows' ? 'bg-violet-600 text-white' : 'border-slate-200 bg-slate-100 hover:bg-slate-200'}`} onClick={() => switchTab('workflows')}>工作流设计</button><span role="status" className="min-w-0 self-center text-xs text-slate-600">{message}</span></nav>
    {workspace.importedDiagnostic?<div className="shrink-0 border-b bg-amber-50 px-5 py-2 text-xs">上次导出核验报告 · 契约 c{workspace.importedDiagnostic.configuration.contractRevision} · {workspace.importedDiagnostic.exportedAt} · {workspace.importedDiagnostic.scope.mountedData?'含原环境挂载数据检查，本机结果需重新核验':'仅配置检查'}<button className="ml-2 rounded border bg-white px-2 py-1" onClick={()=>setShowImported(true)}>查看上次报告</button></div>:null}
    <ConfigDialog open={showImported} title="上次导出核验报告" onClose={()=>setShowImported(false)}><p className="text-sm">历史诊断，不作为当前正式输出凭据。</p>{workspace.importedDiagnostic?.report.issues.map((issue,index)=><p key={index} className="break-words text-xs">{issue.severity} · {issue.code} · {issue.path} · {issue.message}</p>)}</ConfigDialog>
    <ConfigDialog open={!!importReview} title="导入报告版本变化" onClose={()=>setImportReview(undefined)}><p>{importReview?.recheckReason}</p><p className="text-sm">确认关闭后按当前核验器自动执行完整检查；旧报告只作为历史诊断，不会自动发布；窗口内来源配置按导入口已声明的目标迁移为隔离候选。</p><button className="rounded bg-violet-600 px-3 py-2 text-white" onClick={()=>{if(importReview)applyImportedPackage(importReview,true);setImportReview(undefined);}}>确认并重新核验</button></ConfigDialog>
    {packageCandidate ? <section aria-label="整包草稿操作" className="flex shrink-0 flex-wrap items-center gap-3 border-b border-violet-200 bg-violet-50 px-5 py-3">
      <div className="min-w-0 flex-1 basis-64"><strong className="text-sm">整包候选 · 契约 c{packageCandidate.baseline.contractRevision}{packageCandidate.config.contractRevision !== packageCandidate.baseline.contractRevision ? ` → c${packageCandidate.config.contractRevision}` : ''}</strong><p className="text-xs text-slate-600">三个设计标签共用候选，各区域保存仅暂存。{hasRegionDraft?'请先保存或放弃当前区域草稿，再切换标签或提交整包。':'检查完成后在此整包核验并保存到本机；正式发布仍需全局核验。'}</p></div>
      <button type="button" className="rounded border bg-white px-3 py-1.5 text-sm" disabled={hasRegionDraft||packageBusy} onClick={validatePackageCandidate}>核验整包草稿</button>
      <button type="button" className="inline-flex items-center gap-1 rounded bg-emerald-600 px-3 py-1.5 text-sm text-white disabled:bg-slate-300" disabled={hasRegionDraft||packageBusy||!packageReport?.valid} onClick={() => void savePackageCandidate()}><Save className="h-4 w-4" />保存整包草稿</button>
      <button type="button" className="rounded border bg-white px-3 py-1.5 text-sm" disabled={hasRegionDraft||packageBusy} onClick={() => void discardPackageCandidate()}>放弃整包草稿</button>
    </section> : null}
    {activeTab==='general'?<div className="min-h-0 flex-1 overflow-hidden p-3"><GeneralRulesEditor config={workingConfig} isolated={packageDraft} drafts={generalDrafts} onDraftsChange={setGeneralDrafts} onSave={saveGeneral} onValidate={()=>{if(packageCandidate){if(hasRegionDraft){setMessage('请先保存或放弃当前区域草稿。');return;}validatePackageCandidate();return;}const result=validateConfigPackage(savedConfig,records);setReport(result);setMessage(result.valid?'活动整包核验通过。':'活动整包存在错误，请检查报告。');}}/></div>:activeTab === 'workflows' ? <div className="min-h-0 flex-1 overflow-hidden p-3"><WorkflowWorkbench config={workingConfig} isolated={packageDraft} initialSession={workflowSession} onSessionChange={setWorkflowSession} records={records} onChange={saveWorkflowPackage} onDelete={deleteWorkflow} onDraftStateChange={setWorkflowHasDraft} /></div> : <div className="cm-workspace-grid">{selected && !editorExpanded ? <section className="cm-validator-pane flex min-w-0 flex-col overflow-hidden rounded-xl border bg-white p-3"><div className="mb-2 flex shrink-0 flex-wrap items-start justify-between gap-2"><strong>显示规则验证器</strong><PreviewNameSelector />{activeScenario ? <HelpLabel context="ConfigStudio" className="grid min-w-0 flex-1 basis-40 gap-1 text-xs">样例状态<select className="w-full max-w-full rounded border px-2 py-1" value={activeScenario} onChange={(event) => setScenario(event.target.value)}>{compatibleScenarios.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></HelpLabel> : null}</div>{selected && activeScenario ? <div className="cm-preview-frame min-w-0"><ConnectedConfigRuntimePreview config={previewConfig} node={selected} scenario={activeScenario} onRuntimeError={(error) => setMessage(`验证器错误：${error.message}`)} /></div> : <div className="flex h-full min-h-[300px] items-center justify-center rounded border border-dashed p-6 text-sm text-slate-500">先新建分类、选择几何类型并启用首条渲染规则。验证器会调用与主地图相同的 V3.2 RuleDrivenLayer；中心固定，允许滚轮缩放。</div>}</section> : null}
      <section className={`cm-authoring-pane min-h-0 overflow-y-auto rounded-xl border bg-white p-4 ${editorExpanded ? 'col-span-full' : ''}`}><div className="mb-3 rounded border bg-slate-50 p-2 text-xs text-slate-700">{message}</div><LookupTablesWorkspace config={workingConfig} isolated={packageDraft} draft={lookupDraft} onDraftChange={setLookupDraft} onSave={saveLookupTables} disabled={featureHasDraft||engineHasDraft} records={records}/><EngineSettingsWorkspace config={workingConfig} draft={engineDraft} onDraftChange={setEngineDraft} onSave={saveEngine} disabled={featureHasDraft||lookupHasDraft} isolated={packageDraft} records={records}>{(engine,onChange)=><EngineEditor config={{...workingConfig,engine:engine??createV32EngineDefaults()}} engine={engine??createV32EngineDefaults()} onChange={onChange}/>}</EngineSettingsWorkspace><fieldset disabled={lookupHasDraft||engineHasDraft}><div className={treeSession?'rounded-lg border-2 border-violet-300 p-3':''} aria-label={treeSession?'Class 树隔离编辑容器':'分类管理容器'}>{treeSession?<section aria-label="Class 树导入总控" className="cm-panel mt-4 space-y-2 border-2 border-violet-400 bg-violet-50"><h2 className="font-semibold">Class 树导入总控 · {treeSession.classCode}</h2><p className="text-xs">内部保存只更新暂存树；总控保存替换总包中的整个同 Class 树。</p><div className="flex flex-wrap gap-2"><button type="button" disabled={editing||categoryHasDraft} className="rounded border bg-white px-3 py-1" onClick={validateTree}>核验整棵 Class 树</button><button type="button" disabled={editing||categoryHasDraft||!treeReport?.valid} className="rounded bg-violet-600 px-3 py-1 text-white disabled:bg-slate-300" onClick={()=>void saveTree()}>保存 Class 树到总配置</button><button type="button" className="rounded border bg-white px-3 py-1" onClick={discardTree}>放弃导入 Class 树</button></div><details><summary>注入差异</summary>{treeSession.changes.map((item,index)=><p key={index} className="text-xs">{item}</p>)}</details></section>:null}
        <section className="cm-panel"><h2 className="mb-3 font-semibold">要素分类定义及管理区</h2><CategoryPathPicker config={config} value={selected?.path??{class:''}} disabled={editing||categoryHasDraft} lockedClass={treeSession?.classCode} label="编辑分类" onChange={path=>{const node=config.nodes.find(item=>classificationPathKey(item.path)===classificationPathKey(path));setSelectedId(node?.nodeId??'');setEditorExpanded(!node);}}/><fieldset disabled={editing}><CategoryCreationPanel initialDraft={restoredSession?.categoryCreation} onSessionChange={setCategoryCreation} config={config} parent={selected} lockedClass={treeSession?.classCode} onDraftStateChange={setCategoryHasDraft} onCreate={(next,node)=>{setConfig(next);setDraftScope('category');setSelectedId(node.nodeId);setEditorExpanded(false);setCategoryHasDraft(false);setMessage('已创建分类草稿；可暂存节点继续添加子分类，完成后核验保存。');}}/></fieldset><CategoryFileControls config={treeSession?.staged??workingConfig} selectedId={selectedId} editing={editing||categoryHasDraft||Boolean(draftConfig)} onImport={file=>void importCategoryFile(file)}/><button type="button" disabled={!selected||hasRegionDraft||Boolean(treeSession)} className="mt-2 rounded border bg-white px-3 py-1.5 text-sm text-rose-700 disabled:text-slate-400" onClick={requestCategoryDeletion}>删除当前分类及其子分类</button>{draftConfig&&!editing&&!treeSession?<section aria-label="普通分类草稿暂存" className="cm-subsection mt-3 space-y-2"><p className="text-xs">普通分类草稿已暂存；可继续选择分类或新增子分类。本地活动配置未改变，须完成整份分类草稿的核验保存。</p><div className="flex flex-wrap gap-2"><button type="button" className="rounded border bg-white px-3 py-1.5 text-sm" onClick={validate}>核验分类草稿</button><button type="button" disabled={!report?.valid} className="rounded bg-emerald-600 px-3 py-1.5 text-sm text-white disabled:bg-emerald-200" onClick={()=>void save()}>保存分类草稿</button><button type="button" className="rounded border bg-white px-3 py-1.5 text-sm" onClick={()=>void discard()}>放弃分类草稿</button></div></section>:null}</section>
        {!selected ? <section className="mt-4 rounded border border-dashed p-4"><p>请选择一级 Class 或点击新增分类，再逐级选择需要编辑的分类。显示规则验证器默认关闭。</p><div className="mt-2 flex gap-2"><button type="button" disabled={!editing} onClick={validate}>核验全局草稿</button><button type="button" disabled={!editing||!report?.valid} onClick={save}>保存</button><button type="button" disabled={!editing} onClick={discard}>放弃草稿</button></div></section> : <div className="mt-4 space-y-4"><section className="rounded-lg border bg-slate-50 p-3"><div className="flex flex-wrap items-end gap-2"><button type="button" className="rounded border px-3 py-1.5 text-sm" onClick={readSelected}>{editing ? '已读取草稿' : '读取分类'}</button><button type="button" disabled={!editing} className="rounded border px-3 py-1.5 text-sm disabled:text-slate-300" onClick={validate}>核验</button><button type="button" disabled={!editing || (treeSession?Boolean(report?.issues.some(issue=>issue.severity==='error'&&issue.path.startsWith('nodes/'+selectedId)))||!report:!report?.valid)} className="inline-flex items-center gap-1 rounded bg-emerald-600 px-3 py-1.5 text-sm text-white disabled:bg-emerald-200" onClick={save}><Save className="h-4 w-4" />保存</button>{!treeSession?<button type="button" disabled={!editing} className="rounded border bg-white px-3 py-1.5 text-sm disabled:text-slate-300" onClick={()=>void stageCategoryNode()}>暂存节点</button>:null}<button type="button" disabled={!editing} className="rounded border px-3 py-1.5 text-sm disabled:text-slate-300" onClick={discard}>放弃草稿</button></div><div className="mt-3 cm-flex-grid gap-2"><span className="rounded border bg-white px-2 py-1 text-sm">Class：{selected.path.class}</span><span className="rounded border bg-white px-2 py-1 text-sm">Kind：{selected.path.kind || '—'}</span><span className="rounded border bg-white px-2 py-1 text-sm">Skind：{selected.path.skind || '—'}</span><span className="rounded border bg-white px-2 py-1 text-sm">Skind2：{selected.path.skind2 || '—'}</span></div><div className="mt-3 flex flex-wrap items-center gap-4 rounded border bg-white p-2 text-sm"><strong>该层设置是否向下继承</strong>{(['fields', 'display', 'card'] as const).map((key) => <HelpLabel context="ConfigStudio" key={key}><input disabled={!editing} type="checkbox" checked={selected.inheritDown?.[key] ?? true} onChange={(event) => updateSelected((node) => ({ ...node, inheritDown: { ...(node.inheritDown ?? { fields: true, display: true, card: true }), [key]: event.target.checked } }))} /> {key === 'fields' ? '字段' : key === 'display' ? '显示与交互（软继承）' : '信息卡'}</HelpLabel>)}</div></section>
          {editing ? <><FieldEditor config={config} node={selected} onChange={(node) => setConfig((current) => updateNode(current, node.nodeId, () => node))} /><section className="cm-panel"><h3 className="cm-panel-heading mb-2 font-semibold">显示、交互与层级</h3><p className="mb-2 text-xs text-slate-500">分类只能选择一种几何类型。父级未指定时，本级可以首次定义；若继承了父级，类型保持一致。</p><HelpLabel context="ConfigStudio" className="block max-w-sm text-sm">几何类型<select className="ml-2 rounded border px-2 py-1" value={geometry ?? ''} onChange={(event) => { const next = event.target.value as GeometryKind; updateSelected((node) => ({ ...node, geometryType: next || undefined, geometryProfiles: next ? { [next]: node.geometryProfiles[next] ?? editableGeometryProfile(next, config.contractRevision) } : {} })); }}><option value="">暂不指定</option>{geometries.map((item) => <option key={item} value={item}>{geometryLabel[item]}</option>)}</select></HelpLabel>{geometry && profile ? <div className="mt-2"><GeometryEditor config={config} path={selected.path} geometry={geometry} profile={profile} onChange={(next) => updateSelected((node) => ({ ...node, geometryType: geometry, geometryProfiles: { ...node.geometryProfiles, [geometry]: next } }))} /></div> : <p className="mt-2 rounded border border-dashed p-3 text-sm text-slate-500">暂不定义几何，允许先编辑父/子分类结构；总包核验时最终分类必须解析到明确几何类型。</p>}</section>{config.contractRevision>=10?<NodeFieldSettingsEditor config={config} node={selected} onChange={node=>setConfig(current=>updateNode(current,node.nodeId,()=>node))}/>:<fieldset disabled={Boolean(treeSession)}><ContextBindingsEditor config={config} selected={selected} onChange={setConfig} /></fieldset>}<V3CardEditor config={config} node={selected} onChange={(node) => setConfig((current) => updateNode(current, node.nodeId, () => node))} /></> : <p className="rounded border border-dashed p-5 text-sm text-slate-500">点击“读取分类”后才开启字段、渲染规则、信息卡、工作流与上下文绑定编辑。</p>}</div>}</div></fieldset></section></div>}
    <CategoryDeletionDialog plan={deletionPlan} onClose={()=>setDeletionPlan(null)} onConfirm={confirmCategoryDeletion}/><ConfigDialog open={applicationImpact.length>0} title="总体规则标识变更影响" onClose={()=>finishImpact(false)}>{applicationImpact.map((message,index)=><p className="text-sm" key={index}>{message}</p>)}<button type="button" className="rounded border px-3 py-1" onClick={()=>finishImpact(false)}>取消保存</button><button type="button" className="ml-2 rounded bg-violet-600 px-3 py-1 text-white" aria-label="Confirm application changes" onClick={()=>finishImpact(true)}>确认影响并继续核验保存</button></ConfigDialog><ConfigDialog open={Boolean(importConflict)} title="分类导入冲突" onClose={()=>setImportConflict(null)}>{importConflict?<><p className="text-sm">继续将按上游固定继承修正导入字段，并重映射冲突内部 ID；不修改父级。</p>{importConflict.result.conflicts.map((item,index)=><p key={index} className="text-xs text-rose-700">{item}</p>)}<button type="button" className="rounded bg-violet-600 px-3 py-1 text-white" onClick={()=>{try{applyCategoryImport(prepareCategoryImport(config,importConflict.artifact,true));}catch(error){setMessage(String(error));}}}>按上游约束修正后继续</button><button type="button" className="ml-2 rounded border px-3 py-1" onClick={()=>setImportConflict(null)}>取消导入</button></>:null}</ConfigDialog><MigrationNotices value={workspace.migration} onReport={report=>setMigrationAttachment({...workspace.migration,report})} onLocate={path=>{if(hasRegionDraft){setMessage('请先保存或放弃区域草稿，再定位其他设置。');return;}const id=/nodes\/([^/]+)/.exec(path)?.[1];if(id){setSelectedId(id);setActiveTab('features');requestAnimationFrame(()=>requestAnimationFrame(()=>{const rule=/rules\/([^/]+)/.exec(path)?.[1];const item=Array.from(document.querySelectorAll<HTMLDetailsElement>('details[data-fold-key]')).find(el=>rule&&el.dataset.foldKey?.includes(rule));if(item){item.open=true;item.scrollIntoView({block:'center'});}}));}else setMessage(path);}}/><Report config={config} records={records} report={packageReport??report} onConfirm={paths=>{const next=confirmPrefillCopies(config,resolveEffectiveFields,paths);if(packageCandidate&&!draftConfig)stageCandidate(next,'预填副本确认');else setConfig(next);}} /></main></RuntimePreviewProvider>;
}

export default ConfigStudio;
