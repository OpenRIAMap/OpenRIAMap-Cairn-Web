import type {WorkflowBridge} from '../WorkflowHost';
import {specializedFormView} from './registration';
import {externalRolePaths} from '@/configStudio/externalBindings';
import {EXTERNAL_COMPONENT_ROLES} from '@/configStudio/externalCapabilities';
export function specializedFormLabels(bridge:WorkflowBridge){
 const context=bridge.getCaptureContext?.();
 const views=()=>context?(EXTERNAL_COMPONENT_ROLES[context.workflow.external?.componentKey??'']??[]).flatMap(role=>{
  try{const path=externalRolePaths(context.config,context.workflow,role)[0];return [specializedFormView(context.config,context.workflow,path,role,'workflow')];}catch{return [];}
 }):[];
 const field=(key:string)=>views().flatMap(view=>[view.idField,...view.fields]).find(field=>field.key===key||field.path===key);
 return {
  getWorkflowClassificationLabel:(_workflow:string)=>'类型',
  getWorkflowFieldLabel:(_workflow:string,key:string)=>field(key)?.label??key,
  getWorkflowFieldPlaceholder:(_workflow:string,key:string)=>field(key)?.placeholder,
  getWorkflowAuxLabel:(_workflow:string,key:string)=>views().flatMap(view=>view.auxInputs).find(row=>row.key===key)?.label??key,
  getWorkflowAuxPlaceholder:(_workflow:string,key:string)=>views().flatMap(view=>view.auxInputs).find(row=>row.key===key)?.placeholder,
  getWorkflowGroupLabel:(_workflow:string,key:string)=>views().flatMap(view=>view.groups).find(row=>row.key===key)?.label??key,
  getWorkflowGroupFieldLabel:(_workflow:string,group:string,key:string)=>views().flatMap(view=>view.groups).find(row=>row.key===group)?.fields.find(row=>row.key===key)?.labels.workflow??key,
 };
}
