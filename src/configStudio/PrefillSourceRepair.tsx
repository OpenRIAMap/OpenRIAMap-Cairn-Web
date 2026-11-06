import {useState} from 'react';
import type {ConfigPackageV3} from './types';
import {previewPrefillSourceRepairs,applyPrefillSourceRepairs} from './prefillAudit';
import {resolveEffectiveFields} from './runtime';

/** An explicit preview in the existing validation area, never an automatic migration. */
export function PrefillSourceRepair({config,onApply}:{config:ConfigPackageV3;onApply?:(value:ConfigPackageV3)=>void}){
 const [preview,setPreview]=useState<ReturnType<typeof previewPrefillSourceRepairs>>(),[baseline,setBaseline]=useState('');
 const current=JSON.stringify(config),valid=baseline===current;
 return <section className="my-2 rounded border bg-sky-50 p-2 text-xs"><button type="button" className="rounded border bg-white px-2 py-1" disabled={!onApply} onClick={()=>{setPreview(previewPrefillSourceRepairs(config,resolveEffectiveFields));setBaseline(current);}}>检查预填来源搬迁</button>
  {preview?<><p className="my-2">共清点 {preview.length} 项；原来源有效 {preview.filter(row=>row.status==='unchanged').length} 项；可修来源地址 {preview.filter(row=>row.status==='repairable').length} 项；定义已变化或证据不足 {preview.filter(row=>row.status==='changed').length} 项；待核对 {preview.filter(row=>row.status==='unresolved').length} 项。当前独立副本内容均不覆盖。</p><details><summary>查看全部修整依据</summary><ul className="max-h-48 overflow-auto">{preview.map(row=><li key={row.owner} className="mb-2 break-all">{row.owner} · {row.status}<details><summary>{row.reason}</summary><pre className="whitespace-pre-wrap">{JSON.stringify(row,null,2)}</pre></details></li>)}</ul></details><button type="button" disabled={!onApply||!valid||!preview.some(row=>row.status==='repairable')} className="mt-2 rounded border bg-white px-2 py-1 disabled:opacity-40" onClick={()=>{if(valid)onApply?.(applyPrefillSourceRepairs(config,resolveEffectiveFields));setPreview(undefined);}}>将可证明的来源修整加入当前草稿</button>{!valid?<p>配置已变化，请重新检查，未应用旧预览。</p>:null}</>:null}
 </section>;
}
