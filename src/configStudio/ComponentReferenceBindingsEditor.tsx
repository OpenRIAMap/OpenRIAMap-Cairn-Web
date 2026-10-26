import {HelpLabel} from './SettingHelp';
import {resolveExternalReferenceSource} from './externalBindings';
import type {ConfigPackageV3,ExternalReferenceSource} from './types';
export function ComponentReferenceBindingsEditor({config,options,onChange}:{config:ConfigPackageV3;options?:Record<string,unknown>;onChange:(options:Record<string,unknown>)=>void}){
 const bindings=(options?.referenceBindings??{}) as Record<string,ExternalReferenceSource>;
 const set=(key:string,source:ExternalReferenceSource)=>onChange({...options,referenceBindings:{...bindings,[key]:source}});
 return <details className="cm-subsection mt-3"><summary>专用卡片关联来源</summary><div className="mt-3 space-y-3 text-xs">{[['landUnit','所属地理单元'],['settlementPoint','所属聚落点'],['settlementArea','所属聚落范围']].map(([key,label])=>{
  const source=bindings[key]??{workflowId:'',bindingId:''},workflow=config.workflows.find(workflow=>workflow.id===source.workflowId);
  let error='';try{resolveExternalReferenceSource(config,source);}catch(reason){error=reason instanceof Error?reason.message:String(reason);}
  return <div className="rounded border p-2" key={key}><strong>{label}</strong><HelpLabel context="ComponentReferenceBindingsEditor" className="mt-2 block">来源工作流<select className="ml-2 rounded border px-2 py-1" value={source.workflowId} onChange={event=>set(key,{workflowId:event.target.value,bindingId:''})}><option value="">请选择</option>{config.workflows.filter(workflow=>workflow.mode==='external').map(workflow=><option key={workflow.id} value={workflow.id}>{workflow.label.zh}（{workflow.id}）</option>)}</select></HelpLabel><HelpLabel context="ComponentReferenceBindingsEditor" className="mt-2 block">来源用途<select className="ml-2 rounded border px-2 py-1" value={source.bindingId} onChange={event=>set(key,{...source,bindingId:event.target.value})}><option value="">请选择</option>{workflow?.external?.referenceBindings?.map(binding=><option key={binding.bindingId} value={binding.bindingId}>{binding.bindingId}</option>)}</select></HelpLabel>{error?<p role="alert" className="mt-2 text-rose-700">{error}</p>:null}</div>;
 })}</div></details>;
}
