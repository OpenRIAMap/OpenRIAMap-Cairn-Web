import {HelpControl,HelpLabel} from './SettingHelp';
import { useState } from 'react';
import { FieldPrefill } from './FieldPrefillDialog';
import { prefillGroupField, prefillWorkflowControl } from './fieldPrefillModel';
import { resolveEffectiveFields } from './runtime';
import { canonicalDictionaryOwner } from './dictionaryContract';
import type { ConfigPackageV3, WorkflowControl, WorkflowDefinition, WorkflowGroupField } from './types';

export function WorkflowPrefill({config,workflow,value,onChange,onImport,groupField=false}:{config:ConfigPackageV3;workflow:WorkflowDefinition;value:WorkflowControl|WorkflowGroupField;onChange:(value:WorkflowControl|WorkflowGroupField)=>void;onImport?:(value:WorkflowControl,key:string,outputId?:string)=>void;groupField?:boolean}) {
  const [bind,setBind]=useState(false),[outputId,setOutputId]=useState(workflow.outputs[0]?.id??'');
  return <div className="mt-2 flex flex-wrap items-center gap-2 rounded border bg-white p-2 text-xs"><FieldPrefill config={config} initialPath={workflow.outputs[0]?.classification} single={groupField} onApply={(field,audit)=>{
    if(groupField){const next=prefillGroupField(value as WorkflowGroupField,field,audit);onChange(config.contractRevision>=11?canonicalDictionaryOwner(next):next);return;}
    const generated=prefillWorkflowControl(value as WorkflowControl,field,audit),control=config.contractRevision>=11?canonicalDictionaryOwner(generated):generated;
    const output=workflow.outputs.find(output=>output.id===outputId),existing=output?.assignments.find(item=>item.target===field.key);
    if(bind&&(!output||!resolveEffectiveFields(config,output.classification).some(item=>item.key===field.key)))throw Error('所选输出没有对应字段，不能绑定。');
    if(bind&&existing&&existing.expression!==control.slot)throw Error('目标字段已被其他输入绑定，请先调整原组装行。');
    if(onImport)onImport(control,field.key,bind&&!existing?outputId:undefined);else onChange(control);
  }}/>{onImport&&!groupField?<><HelpLabel context="WorkflowPrefill"><input type="checkbox" checked={bind} onChange={event=>setBind(event.target.checked)}/>同时建立输出组装</HelpLabel>{bind?<HelpControl context="WorkflowPrefill"><select aria-label="预填绑定输出" value={outputId} onChange={event=>setOutputId(event.target.value)}>{workflow.outputs.map((output,index)=><option key={output.id} value={output.id}>输出 {index+1}</option>)}</select></HelpControl>:null}</>:null}{config.contractRevision<11&&value.kind==='select'&&!value.optionsTableId?<span>本地显示对照 {value.options?.length??0} 项；需要更新时重新预填。<button type="button" className="ml-2 rounded border px-2 py-1" onClick={()=>onChange({...value,options:undefined,prefillAudit:undefined})}>清除</button></span>:null}</div>;
}
