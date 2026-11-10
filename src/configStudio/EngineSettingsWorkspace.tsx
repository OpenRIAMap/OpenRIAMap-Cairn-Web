import {DiagnosticGroups} from './DiagnosticGroups';
import { useState, type ReactNode } from 'react';
import { ModuleHelp } from './ModuleHelp';
import { prepareEngineCommit, type EngineDraft, type EngineSection } from './engineTransaction';
import { stableConfigText } from '../configRuntime/configurationFingerprint';
import { C19_GEOMETRIES, LOGIC_MODULES, LOGIC_MODULE_NAMES } from './c19Render';
import { classificationPathKey, resolveGeometryProfile } from './runtime';
import { validateStudioModule } from './studioModuleValidation';
import type { ConfigEngineSettings, ConfigPackageV3, ConfigValidationReport, MountedFeatureRecord } from './types';

export function EngineSettingsWorkspace({ config, draft, onDraftChange, onSave, disabled, isolated, records, children, title, section, creating, onLocate }: {
  config: ConfigPackageV3; draft: EngineDraft | null; onDraftChange: (draft: EngineDraft | null) => void;
  onSave: (draft: EngineDraft) => Promise<void>; disabled: boolean; isolated: boolean;
  records: MountedFeatureRecord[];
  title?: string;
  section?: EngineSection;
  creating?: boolean;
  onLocate?: (path: string) => void;
  children: (engine: ConfigEngineSettings | undefined, onChange: (value: ConfigEngineSettings) => void) => ReactNode;
}) {
  const [report, setReport] = useState<ConfigValidationReport | null>(null);
  const [error, setError] = useState(''), [busy, setBusy] = useState(false);
  const impact=draft?.section==='renderTemplates'?config.nodes.flatMap(node=>C19_GEOMETRIES.flatMap(geometry=>
    (resolveGeometryProfile(config,node.path,geometry)?.zoomPriority.rules??[]).flatMap(rule=>{
      const id=rule.logic?.templateId;
      if(!id)return [];
      const before=draft.baseline?.renderTemplates?.find(item=>item.id===id)?.modules;
      const after=draft.value.renderTemplates?.find(item=>item.id===id)?.modules;
      const changed=LOGIC_MODULES.filter(key=>!rule.logic?.overrides[key]&&stableConfigText(before?.[key])!==stableConfigText(after?.[key]));
      return changed.length?[{path:classificationPathKey(node.path),id:rule.id,zoom:rule.when?.zoom,changed}]:[];
    })
  )):[];
  const validate = () => {
    if (!draft || creating) return;
    try { const result = validateStudioModule(prepareEngineCommit(config, draft), records, isolated ? ['engine'] : undefined); setReport(result); setError(''); return result; }
    catch (reason) { setError(String(reason)); setReport(null); }
  };
  return <section data-engine-section={section} aria-label="全局引擎独立编辑区域" className="mb-3 min-w-0 rounded-lg border-2 border-slate-200 p-3">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h2 className="font-semibold">{title??'V3.2 全局引擎默认值'}<ModuleHelp title="全局引擎独立保存" text="本区域独立核验、保存或放弃修改。整包候选模式下保存只更新候选，最终仍须顶部整包核验并保存。" /></h2>
      <div className="flex flex-wrap gap-2 text-xs">
        <button type="button" className="rounded border px-2 py-1" disabled={!draft || disabled || busy || creating} onClick={validate}>{title?'核验':'核验引擎'}</button>
        <button type="button" className="rounded border bg-emerald-600 px-2 py-1 text-white disabled:bg-slate-300" disabled={!draft || disabled || busy || creating} onClick={async () => {
          if (!draft || !validate()?.valid) return;
          if(impact.length&&!window.confirm(`本次保存会更新 ${impact.length} 条有效规则。确认保存模板？`))return;
          setBusy(true);
          try { await onSave(draft); onDraftChange(null); setReport(null); }
          catch (reason) { setError(String(reason)); }
          finally { setBusy(false); }
        }}>{title?'保存':'保存引擎'}</button>
        <button type="button" className="rounded border px-2 py-1" disabled={!draft || busy || creating} onClick={() => { onDraftChange(null); setReport(null); setError(''); }}>{title?'放弃草稿':'放弃引擎草稿'}</button>
      </div>
    </div>
    <p role="status" className="my-2 text-xs text-slate-600">{disabled ? '请先保存或放弃其他区域的编辑。' : busy ? '正在保存引擎…' : creating ? '正在创建，请先核验并创建或取消。' : !draft ? '未修改' : report?.valid ? '核验通过，待保存' : '引擎草稿尚未保存，需核验后保存或放弃。'}{isolated ? ' 当前为整包候选，区域保存只暂存到候选。' : ''}</p>
    <fieldset disabled={disabled || busy}>{children(draft?.value ?? config.engine, value => { const baseline = draft?.baseline ?? config.engine; onDraftChange(stableConfigText(value) === stableConfigText(baseline) ? null : { baseline, value, section, legacySource:draft?.legacySource }); setReport(null); setError(''); })}</fieldset>
    {draft?.section==='renderTemplates'?<details open className="cm-subsection my-2 text-xs">
      <summary>本次保存影响 · {impact.length} 条有效规则</summary>
      {impact.map(row=><p key={row.path+row.id}>{row.path} · Zoom {row.zoom?.min}–{row.zoom?.max} · {row.changed.map(key=>LOGIC_MODULE_NAMES[key]).join('、')}</p>)}
    </details>:null}
    {error ? <p role="alert" className="text-xs text-rose-700">{error}</p> : null}
    {report ? <div aria-label="引擎核验报告" className="text-xs"><DiagnosticGroups language={config.application?.preferences.language} report={report} onLocate={onLocate}/></div> : null}
  </section>;
}
