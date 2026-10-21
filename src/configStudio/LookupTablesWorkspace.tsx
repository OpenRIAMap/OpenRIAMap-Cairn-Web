import { useState } from 'react';
import type { ConfigPackageV3, ConfigValidationReport, MountedFeatureRecord } from './types';
import { LookupTablesEditor } from './LookupTablesEditor';
import { lookupDraftSignature, prepareLookupTableCommit, type LookupTableDraft } from './lookupTableTransaction';
import { validateStudioModule } from './studioModuleValidation';
import { ModuleHelp } from './ModuleHelp';

export function LookupTablesWorkspace({ config, draft, onDraftChange, onSave, disabled, records, isolated = false }: {
  config: ConfigPackageV3; draft: LookupTableDraft | null; onDraftChange: (value: LookupTableDraft | null) => void;
  onSave: (value: LookupTableDraft) => Promise<void>; disabled: boolean; records: MountedFeatureRecord[]; isolated?: boolean;
}) {
  const [report, setReport] = useState<ConfigValidationReport | null>(null), [error, setError] = useState(''), [busy, setBusy] = useState(false);
  const change = (next: ConfigPackageV3) => {
    const baseline = draft?.baseline ?? config;
    onDraftChange(lookupDraftSignature(next) === lookupDraftSignature(baseline) ? null : { baseline, value: next });
    setReport(null); setError('');
  };
  const locate=(result:ConfigValidationReport)=>{const path=result.issues.flatMap(i=>[i.path,...i.relatedPaths??[]]).find(p=>p.startsWith('lookupTables/'));if(path)window.dispatchEvent(new CustomEvent('cairn:lookup-table-error',{detail:path.split('/')[1]}));};
  const validate = () => {
    if (!draft) return;
    try { const result=validateStudioModule(prepareLookupTableCommit(config, draft), records, isolated ? ['lookupTables'] : undefined);setReport(result);locate(result);setError(''); }
    catch (reason) { setError(String(reason)); setReport(null); }
  };
  return <section aria-label="对照表独立编辑区域" className="mb-3 min-w-0 rounded-lg border-2 border-slate-200 p-3">
    <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="font-semibold">对照表管理<ModuleHelp title="对照表管理" text="本区域独立核验、保存或放弃公共对照表。新建后删除或恢复原值会自动结束编辑；保存不会提交旁边的分类草稿。绑定方在表格保存后同步更新。"/></h2>
      <div className="flex flex-wrap gap-2 text-xs"><button type="button" className="rounded border px-2 py-1" disabled={!draft || busy} onClick={validate}>核验表格</button>
        <button type="button" className="rounded border bg-emerald-600 px-2 py-1 text-white disabled:bg-slate-300" disabled={!draft || disabled || busy} onClick={async () => {
          if (!draft) return; setBusy(true); setError('');
          try { const result = validateStudioModule(prepareLookupTableCommit(config, draft), records, isolated ? ['lookupTables'] : undefined); setReport(result); locate(result); if (!result.valid) return; await onSave(draft); onDraftChange(null); setReport(null); }
          catch (reason) { setError(String(reason)); } finally { setBusy(false); }
        }}>保存表格</button>
        <button type="button" className="rounded border px-2 py-1" disabled={!draft || busy} onClick={() => { onDraftChange(null); setReport(null); setError(''); }}>放弃表格草稿</button></div>
    </div>
    <p role="status" className="my-2 text-xs text-slate-600">{disabled ? '请先保存或放弃分类／引擎草稿，或结束 Class 树编辑，再修改公共表格。' : busy ? '正在保存表格…' : !draft ? '未修改' : report?.valid ? '核验通过，待保存' : '表格草稿尚未保存，需核验后保存或放弃。'}{isolated ? ' 当前为整包候选，区域保存只暂存到候选。' : ''}</p>
    <fieldset disabled={disabled || busy}><LookupTablesEditor config={draft?.value ?? config} onChange={change}/></fieldset>
    {error ? <p role="alert" className="text-xs text-rose-700">{error}</p> : null}
    {report ? <div aria-label="对照表核验报告" className="text-xs">{report.issues.map((issue, index) => <p key={index} className={issue.severity === 'error' ? 'text-rose-700' : 'text-amber-700'}>{issue.path}：{issue.message}</p>)}</div> : null}
  </section>;
}
