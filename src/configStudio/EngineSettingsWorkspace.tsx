import { useState, type ReactNode } from 'react';
import { ModuleHelp } from './ModuleHelp';
import { prepareEngineCommit, type EngineDraft } from './engineTransaction';
import { stableConfigText } from '../configRuntime/configurationFingerprint';
import { validateStudioModule } from './studioModuleValidation';
import type { ConfigEngineSettings, ConfigPackageV3, ConfigValidationReport, MountedFeatureRecord } from './types';

export function EngineSettingsWorkspace({ config, draft, onDraftChange, onSave, disabled, isolated, records, children }: {
  config: ConfigPackageV3; draft: EngineDraft | null; onDraftChange: (draft: EngineDraft | null) => void;
  onSave: (draft: EngineDraft) => Promise<void>; disabled: boolean; isolated: boolean;
  records: MountedFeatureRecord[];
  children: (engine: ConfigEngineSettings | undefined, onChange: (value: ConfigEngineSettings) => void) => ReactNode;
}) {
  const [report, setReport] = useState<ConfigValidationReport | null>(null);
  const [error, setError] = useState(''), [busy, setBusy] = useState(false);
  const validate = () => {
    if (!draft) return;
    try { const result = validateStudioModule(prepareEngineCommit(config, draft), records, isolated ? ['engine'] : undefined); setReport(result); setError(''); return result; }
    catch (reason) { setError(String(reason)); setReport(null); }
  };
  return <section aria-label="全局引擎独立编辑区域" className="mb-3 min-w-0 rounded-lg border-2 border-slate-200 p-3">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h2 className="font-semibold">V3.2 全局引擎默认值<ModuleHelp title="全局引擎独立保存" text="本区域独立核验、保存或放弃全局引擎修改，不受当前分类选择影响。整包候选模式下保存只更新候选，最终仍须顶部整包核验并保存。" /></h2>
      <div className="flex flex-wrap gap-2 text-xs">
        <button type="button" className="rounded border px-2 py-1" disabled={!draft || disabled || busy} onClick={validate}>核验引擎</button>
        <button type="button" className="rounded border bg-emerald-600 px-2 py-1 text-white disabled:bg-slate-300" disabled={!draft || disabled || busy} onClick={async () => {
          if (!draft || !validate()?.valid) return;
          setBusy(true);
          try { await onSave(draft); onDraftChange(null); setReport(null); }
          catch (reason) { setError(String(reason)); }
          finally { setBusy(false); }
        }}>保存引擎</button>
        <button type="button" className="rounded border px-2 py-1" disabled={!draft || busy} onClick={() => { onDraftChange(null); setReport(null); setError(''); }}>放弃引擎草稿</button>
      </div>
    </div>
    <p role="status" className="my-2 text-xs text-slate-600">{disabled ? '请先保存或放弃其他区域的编辑。' : busy ? '正在保存引擎…' : !draft ? '未修改' : report?.valid ? '核验通过，待保存' : '引擎草稿尚未保存，需核验后保存或放弃。'}{isolated ? ' 当前为整包候选，区域保存只暂存到候选。' : ''}</p>
    <fieldset disabled={disabled || busy}>{children(draft?.value ?? config.engine, value => { const baseline = draft?.baseline ?? config.engine; onDraftChange(stableConfigText(value) === stableConfigText(baseline) ? null : { baseline, value }); setReport(null); setError(''); })}</fieldset>
    {error ? <p role="alert" className="text-xs text-rose-700">{error}</p> : null}
    {report ? <div aria-label="引擎核验报告" className="text-xs">{report.issues.map((issue, index) => <p key={index} className={issue.severity === 'error' ? 'text-rose-700' : 'text-amber-700'}>{issue.path}：{issue.message}</p>)}</div> : null}
  </section>;
}
