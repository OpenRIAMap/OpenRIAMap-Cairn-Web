import type { CardItem, FieldDefinition, PrefillAudit, WorkflowControl, WorkflowGroupField } from './types';
import { workflowControlFromField } from './workflowFieldControl';

export function prefillWorkflowControl(value:WorkflowControl,field:FieldDefinition,audit?:PrefillAudit):WorkflowControl {
  const generated=workflowControlFromField({...field,defaultValue:undefined,placeholder:undefined},value.slot??value.id,value.id);
  const {fieldSource:_source,optionSource:_options,optionsTableId:_table,optionsFieldRef:_ref,optionTable:_body,...original}=value;
  const next:WorkflowControl={...original,kind:generated.kind,label:structuredClone(field.labels),prefillField:field.key,fieldFormat:field.format??'plain',options:structuredClone(generated.options),optionValueType:generated.optionValueType,group:generated.group,columns:value.columns};
  delete next.prefillAudit;if(audit)next.prefillAudit=structuredClone(audit);
  if(generated.search)next.search=generated.search;
  else if(next.kind!=='featureSearch')delete next.search;
  if(next.defaultValue!==undefined) {
    const v=next.defaultValue;
    const valid=next.kind==='group'?Array.isArray(v):next.kind==='number'?typeof v==='number'&&Number.isFinite(v):next.kind==='toggle'?typeof v==='boolean':next.kind==='select'?next.options?.some(option=>option.value===String(v)):next.kind==='json'?true:typeof v==='string';
    if(!valid)delete next.defaultValue;
  }
  if(['number','toggle','json','group'].includes(next.kind))delete next.valueNormalization;
  return next;
}
export function prefillGroupField(value:WorkflowGroupField,field:FieldDefinition,audit?:PrefillAudit):WorkflowGroupField {
  if(field.cardinality!=='single')throw Error('组内单字段只能预填单值字段。');
  const control=prefillWorkflowControl({...value,id:'group-prefill',slot:'GROUP_VALUE',columns:1},field,audit);
  const {id:_id,slot:_slot,columns:_columns,group:_group,...result}=control;
  if(['classificationPicker','group','tagsExtensions','component','notice','runtimeValue'].includes(result.kind))throw Error('此字段不能预填到组内单控件。');
  const {fieldSource:_source,optionsTableId:_table,optionsFieldRef:_ref,optionTable:_body,prefillAudit:_audit,...original}=value;
  return {...original,...result,key:value.key,kind:result.kind as WorkflowGroupField['kind']};
}
export function prefillCardItem(value:CardItem,field:FieldDefinition,audit?:PrefillAudit):CardItem {
  const {labelMode:_label,valueMode:_value,prefillAudit:_audit,fieldBinding:_binding,optionsFieldRef:_ref,optionsTableId:_table,optionTable:_body,...item}=value;
  return {...item,...(audit?{prefillAudit:structuredClone(audit)}:{}),source:field.key,label:structuredClone(field.labels),valueOptions:structuredClone(field.options??[]),options:{...item.options,format:field.options?.length?'enum':field.format??'plain'}};
}
export function clearCardMapping(item:CardItem):CardItem {
  return {...item,valueOptions:undefined,prefillAudit:undefined,options:item.options?.format==='enum'?{...item.options,format:'plain'}:item.options};
}
