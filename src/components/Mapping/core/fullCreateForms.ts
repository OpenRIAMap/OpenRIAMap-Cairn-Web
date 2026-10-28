import type {ClassificationPath,ConfigPackageV3,FieldDefinition,ValueSchema,WorkflowDefinition,WorkflowControl} from '@/configStudio/types';
import {findEditingWorkflow,compileWorkflowEditPlan,residualAnnotations,type WorkflowEditPlan,type WorkflowEditDraft} from '@/configStudio/workflowEditing';
import {initializeFullEditor} from '@/configStudio/fullEditor';
import {hasCategoryNode,resolveEffectiveFields,resolveGeometryProfile} from '@/configStudio/runtime';
import {effectiveOptionsOwner} from '@/configStudio/lookupTables';
import {fieldValueErrors} from '@/configStudio/fieldValueValidation';
import {isBlankFieldValue} from '@/configStudio/optionalFieldValues';
import {coerceWorkflowValues} from '@/configStudio/workflowValues';
import {validateV3WorkflowInputs} from '@/configStudio/workflowKernel';
import {annotationsForOutput,annotationEqual} from '@/configStudio/workflowAnnotations';
import {specializedFormView} from '../Workflow/specialized/registration';
import {externalRolePaths} from '@/configStudio/externalBindings';
import {classificationPathKey} from '@/configStudio/runtime';
import {mergeEditorDraftIntoFeatureInfo,parseFeatureInfoByRegistry,type WorkflowEditorDraftValues,type WorkflowEditorUnparsedEntry} from '@/components/Common/workflowEditorParser';
import type {ProjectedRegistryScene} from '@/components/Common/formProjection';

export type CreateForm={kind:'native';plan:WorkflowEditPlan;draft:WorkflowEditDraft}|{kind:'external';workflow:WorkflowDefinition;view:ProjectedRegistryScene;values:WorkflowEditorDraftValues;unparsed:WorkflowEditorUnparsedEntry[]};
export function resolveCreateForm(config:ConfigPackageV3,path:ClassificationPath):{form:CreateForm;type:'Point'|'LineString'|'Polygon'}{
  if(!hasCategoryNode(config,path))throw Error('请选择实际存在的分类。');
  const workflow=findEditingWorkflow(config,{Class:path.class,Kind:path.kind,SKind:path.skind,SKind2:path.skind2});
  if(!workflow)throw Error('此分类没有启用的编辑方案。');
  if(workflow.mode==='composed'){
    const plan=compileWorkflowEditPlan(workflow,config),type=workflow.outputs[0].geometry.selected;
    if(!plan.classifications.some(p=>classificationPathKey(p)===classificationPathKey(path)))throw Error('此分类不属于最高优先级编辑方案的实际输出范围。');
    if(!resolveGeometryProfile(config,path,type)?.enabled)throw Error('此分类未启用编辑方案指定的几何。');
    return {form:{kind:'native',plan,draft:initializeFullEditor(config,plan,path)},type};
  }
  if(!externalRolePaths(config,workflow,'tradePoint').some(p=>classificationPathKey(p)===classificationPathKey(path))||!resolveGeometryProfile(config,path,'Point')?.enabled)throw Error('此分类不属于专用编辑方案的点要素绑定。');
  const view=specializedFormView(config,workflow,path,'tradePoint'),fields=resolveEffectiveFields(config,path),values:WorkflowEditorDraftValues={ID:''};
  for(const field of view.fields){const definition=fields.find(item=>item.key===field.path);values[field.path]=definition?.defaultValue!==undefined?structuredClone(definition.defaultValue):field.control==='bool'?false:field.control==='trpTrade'?[]:'';}
  return {form:{kind:'external',workflow,view,values,unparsed:[]},type:'Point'};
}
const fieldsFor=(config:ConfigPackageV3,path:ClassificationPath):FieldDefinition[]=>{const fields=resolveEffectiveFields(config,path);return fields.some(f=>f.key==='ID')?fields:[{fieldId:'system-id',key:'ID',type:'string',cardinality:'single',input:'text',labels:{zh:'ID',en:'ID'},description:{zh:'',en:''}},...fields];};
const system=new Set(['Type','World','Class','Kind','SKind','SKind2','Skind','Skind2','CreateBy','CreateTime','Creator','ModifyBy','ModifyTime','ModifityBy','ModifityTime','CoordP','CoordL','CoordG']);
const safe=(path:string)=>path.split('.').every(k=>k&&!['__proto__','prototype','constructor'].includes(k));
function set(record:Record<string,unknown>,path:string,value:unknown,replace=false){if(!safe(path))throw Error(`非法字段路径 ${path}`);let node=record;const keys=path.split('.');for(const key of keys.slice(0,-1)){node[key]??={};if(!node[key]||typeof node[key]!=='object'||Array.isArray(node[key]))throw Error(`${path} 路径发生冲突。`);node=node[key] as Record<string,unknown>;}const key=keys[keys.length-1];if(!replace&&key in node&&!annotationEqual(node[key],value))throw Error(`${path} 的多个输入具有不同值。`);node[key]=structuredClone(value);}
const semanticValue=(control:WorkflowControl,value:unknown)=>{
  const prepared={...control,valueNormalization:control.valueNormalization==='number'?'number' as const:undefined,group:control.group?{...control.group,itemFields:control.group.itemFields.map(field=>({...field,valueNormalization:field.valueNormalization==='number'?'number' as const:undefined}))}:undefined};
  return coerceWorkflowValues({steps:[{controls:[prepared]}]} as WorkflowDefinition,{[control.slot??control.id]:value})[control.slot??control.id];
};
function project(form:CreateForm,fields:FieldDefinition[]):Record<string,unknown>{
  if(form.kind==='external'){
    const result=mergeEditorDraftIntoFeatureInfo({originalFeatureInfo:{},view:form.view,draftValues:form.values});
    for(const field of form.view.fields)if(field.control==='number'&&!isBlankFieldValue(form.values[field.path])){const n=Number(form.values[field.path]);if(!Number.isFinite(n))throw Error(`${field.path} 必须是有限数字。`);set(result,field.path,n,true);}
    for(const entry of form.unparsed){let value=entry.value;if(entry.valueKind==='json')try{value=JSON.parse(entry.valueText);}catch{throw Error(`${entry.path} 不是有效 JSON。`);}set(result,entry.path,value);}
    return result;
  }
  const {plan,draft}=form,result:Record<string,unknown>={ID:draft.slots.EDIT_ID};
  for(const binding of plan.bindings){if(system.has(binding.target))continue;const control=plan.controls.find(c=>c.slot===binding.slot);if(!control)continue;const value=semanticValue(control,draft.slots[binding.slot]);if(isBlankFieldValue(value)&&fields.find(f=>f.key===binding.target)?.emptyValue!=='preserve')continue;set(result,binding.target,value);}
  const annotations=annotationsForOutput(plan.workflow,draft.slots,plan.workflow.outputs[0].id);
  for(const [key,value]of Object.entries(annotations.tags))set(result,`tags.${key}`,value);
  for(const [group,values]of Object.entries(annotations.extensions))for(const [key,value]of Object.entries(values as Record<string,unknown>))set(result,`extensions.${group}.${key}`,value);
  return result;
}
const partialSchema=(schema:ValueSchema):ValueSchema=>({...schema,required:undefined,minItems:undefined,items:schema.items?partialSchema(schema.items):undefined,properties:schema.properties?Object.fromEntries(Object.entries(schema.properties).map(([k,v])=>[k,partialSchema(v)])):undefined,anyOf:schema.anyOf?.map(partialSchema)});
function draftField(field:FieldDefinition):FieldDefinition{return {...field,required:false,requiredWhen:undefined,valueSchema:field.valueSchema?partialSchema(field.valueSchema):undefined};}
const present=(field:FieldDefinition|undefined,value:unknown)=>field?.emptyValue==='preserve'&&value!==undefined||!isBlankFieldValue(value)&&!(Array.isArray(value)&&value.length===0);
function flatten(record:Record<string,unknown>,fields:FieldDefinition[],prefix=''):Map<string,unknown>{
  const result=new Map<string,unknown>();
  for(const [key,value]of Object.entries(record)){const path=prefix?`${prefix}.${key}`:key;if(system.has(path))continue;const field=fields.find(f=>f.key===path);if(!present(field,value))continue;
    if(field||!value||typeof value!=='object'||Array.isArray(value))result.set(path,value);else for(const entry of flatten(value as Record<string,unknown>,fields,path))result.set(...entry);
  }return result;
}
function formIssues(config:ConfigPackageV3,form:CreateForm):string[]{
  if(form.kind!=='native')return [];
  const controls=form.plan.controls.map(c=>({...c,fieldSource:undefined,required:false,requiredWhen:undefined,group:c.group?{...c.group,optional:true,minItems:0,itemFields:c.group.itemFields.map(f=>({...f,fieldSource:undefined,required:false,requiredWhen:undefined}))}:undefined}));
  const workflow={...form.plan.workflow,actor:{required:false},steps:[{id:'draft',kind:'form' as const,label:{zh:'草稿',en:''},controls}]};
  return validateV3WorkflowInputs(workflow,form.draft.slots,workflow.steps,config).map(i=>i.message);
}
export function projectCreateDraft(config:ConfigPackageV3,path:ClassificationPath,form:CreateForm):Map<string,unknown>{
  const issues=formIssues(config,form);if(issues.length)throw Error(issues.join('\n'));
  const fields=fieldsFor(config,path).map(f=>effectiveOptionsOwner(config,f)),values=flatten(project(form,fields),fields);
  for(const [key,value]of values){const field=fields.find(f=>f.key===key);if(field){const errors=fieldValueErrors(draftField(field),value);if(errors.length)throw Error(errors.join('\n'));}}
  return values;
}
function stable(value:unknown):unknown{if(Array.isArray(value))return value.map(stable);if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).filter(([,v])=>v!==undefined).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>[k,stable(v)]));return value;}
function schemaStandard(schema:ValueSchema|undefined):unknown{
 if(!schema)return undefined;
 const ordered=(values:unknown[])=>[...new Map(values.map(v=>[JSON.stringify(v),v])).entries()].sort(([a],[b])=>a.localeCompare(b)).map(([,v])=>v);
 return stable({...schema,required:undefined,minItems:schema.minItems===0?undefined:schema.minItems,properties:schema.properties&&Object.keys(schema.properties).length?Object.fromEntries(Object.entries(schema.properties).map(([k,v])=>[k,schemaStandard(v)])):undefined,items:schema.items?schemaStandard(schema.items):undefined,anyOf:schema.anyOf?ordered(schema.anyOf.map(schemaStandard)):undefined,enum:schema.enum?ordered(schema.enum):undefined});
}
export function fieldInputStandard(config:ConfigPackageV3,field:FieldDefinition){const f=effectiveOptionsOwner(config,field);return stable({type:f.type,cardinality:f.cardinality,format:f.format??'plain',coordinateFormat:f.coordinateFormat,optionValueType:f.type==='enum'?f.optionValueType??'string':undefined,options:f.type==='enum'?f.options?.map(o=>o.value).sort():undefined,reference:f.reference?{classCode:f.reference.classCode,matchField:f.reference.matchField}:undefined,valueSchema:schemaStandard(f.valueSchema),emptyValue:f.emptyValue??'omit'});}
function inputStandard(config:ConfigPackageV3,form:CreateForm,path:string):unknown{
  if(form.kind==='external')return {};
  const control=form.plan.controls.find(c=>form.plan.bindings.some(b=>b.target===path&&b.slot===c.slot));
  if(!control)return {};
  const describe=(raw:WorkflowControl|NonNullable<WorkflowControl['group']>['itemFields'][number]):unknown=>{
    const c=effectiveOptionsOwner(config,raw);
    return stable({normalization:c.valueNormalization&&c.valueNormalization!=='number'?c.valueNormalization:undefined,format:c.fieldFormat&&c.fieldFormat!=='plain'?c.fieldFormat:undefined,
      options:c.kind==='select'?c.options?.map(o=>o.value).sort():undefined,optionValueType:c.kind==='select'?c.optionValueType??'string':undefined,
      search:c.search?{target:c.search.target,queryFields:c.search.queryFields,returnField:c.search.returnField,cacheScope:c.search.cacheScope}:undefined});
  };
  return stable({...describe(control) as object,group:control.group?{storage:control.group.storage??'object',minItems:control.group.minItems??0,fields:control.group.itemFields.map(f=>({key:f.key,standard:describe(f)})).sort((a,b)=>a.key.localeCompare(b.key))}:undefined});
}
export function transferCreateDraft(config:ConfigPackageV3,from:ClassificationPath,source:CreateForm,to:ClassificationPath,target:CreateForm):CreateForm{
  const values=projectCreateDraft(config,from,source),before=fieldsFor(config,from),after=fieldsFor(config,to),errors:string[]=[];
  for(const [key]of values){const a=before.find(f=>f.key===key),b=after.find(f=>f.key===key);if(!b)errors.push(`${key}：目标分类未注册此字段。`);else if(!a||!annotationEqual(fieldInputStandard(config,a),fieldInputStandard(config,b)))errors.push(`${key}：源与目标的输入值标准不等价。`);}
  for(const [key]of values)if(!annotationEqual(inputStandard(config,source,key),inputStandard(config,target,key)))errors.push(`${key}：源与目标表单的输入限制或保存转换不等价。`);
  if(errors.length)throw Error(errors.join('\n'));
  const next=structuredClone(target),record:Record<string,unknown>={};for(const [key,value]of values)set(record,key,value);
  if(next.kind==='external'){
    const parsed=parseFeatureInfoByRegistry(record,next.view);next.values={...next.values,...parsed.values};next.unparsed=parsed.unparsedEntries;
  }else{
    const slots=next.draft.slots,assigned=new Map<string,unknown>();
    if(values.has('ID'))slots.EDIT_ID=values.get('ID');
    for(const binding of next.plan.bindings)if(values.has(binding.target)){
      const control=next.plan.controls.find(c=>c.slot===binding.slot),value=values.get(binding.target);
      const encoded=control?.kind==='json'?JSON.stringify(value,null,2):value;
      if(assigned.has(binding.slot)&&!annotationEqual(assigned.get(binding.slot),encoded))throw Error(`${binding.target}：多个字段无法无损回填同一槽位。`);
      assigned.set(binding.slot,encoded);slots[binding.slot]=structuredClone(encoded);
    }
    for(const control of next.plan.controls)if(control.kind==='tagsExtensions')slots[control.id]=residualAnnotations(next.plan,record);
  }
  const back=projectCreateDraft(config,to,next);
  for(const [key,value]of values)if(!back.has(key)||!annotationEqual(value,back.get(key)))throw Error(`${key}：目标表单不能无损回填并再次输出此值。`);
  return next;
}
