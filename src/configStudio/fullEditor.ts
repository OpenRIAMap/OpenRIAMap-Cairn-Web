import type {ClassificationPath,ConfigPackageV3,GeometryKind,WorkflowDefinition} from './types';
import {findEditingWorkflow,compileWorkflowEditPlan,workflowEditSlots,type WorkflowEditDraft,type WorkflowEditPlan} from './workflowEditing';
import {resolveEffectiveFields,resolveGeometryProfile} from './runtime';
import {evaluateV3WorkflowOutputs,validateV3WorkflowInputs} from './workflowKernel';
import {coerceWorkflowValues} from './workflowValues';
import {prepareNativeRecordCreate} from './nativeRecordSubmission';
import type {MultipartGeometry} from '../core/geometry/multipartGeometry';

export function fullEditorWorkflow(config:ConfigPackageV3,path:ClassificationPath,geometry:GeometryKind):WorkflowDefinition{
 if(!resolveGeometryProfile(config,path,geometry)?.enabled)throw Error('此分类未启用当前绘制类型。');
 const workflow=findEditingWorkflow(config,{Class:path.class,Kind:path.kind,SKind:path.skind,SKind2:path.skind2});
 if(!workflow)throw Error('此分类未配置启用的编辑方案，请在工作台配置后使用完整测绘。');
 if(workflow.mode==='composed'&&workflow.outputs[0]?.geometry.selected!==geometry)throw Error('最高优先级编辑方案与当前几何不相容，未自动改用其他方案。');
 if(workflow.mode==='external'&&geometry!=='Point')throw Error('此专用编辑方案仅支持点几何。');
 return workflow;
}
export function initializeFullEditor(config:ConfigPackageV3,plan:WorkflowEditPlan,classification:ClassificationPath):WorkflowEditDraft{
 const fields=resolveEffectiveFields(config,classification),slots:Record<string,unknown>={EDIT_ID:''};
 for(const control of plan.controls){
  const key=control.slot??control.id;
  if(control.kind==='classificationPicker'){slots[key]=JSON.stringify(classification);continue;}
  if(control.kind==='tagsExtensions'){slots[control.id]={[plan.workflow.outputs[0].id]:{tags:[],extensions:[]}};continue;}
  const target=plan.bindings.find(binding=>binding.slot===control.slot)?.target,field=fields.find(field=>field.key===target);
  const value=control.defaultValue??field?.defaultValue;
  slots[key]=value!==undefined?structuredClone(value):control.kind==='group'?[]:control.kind==='toggle'?false:'';
 }
 return {classification,slots,initialSlots:structuredClone(slots)};
}
export function prepareFullEditorCreate(config:ConfigPackageV3,workflow:WorkflowDefinition,draft:WorkflowEditDraft,geometry:MultipartGeometry,world:string,actor:string,others:Record<string,unknown>[]=[],now=new Date()){
 const plan=compileWorkflowEditPlan(workflow,config),id=String(draft.slots.EDIT_ID??'').trim();if(!id)throw Error('ID 不能为空。');
 if(geometry.type!==workflow.outputs[0].geometry.selected)throw Error('编辑表单与绘制几何不相容。');
 const projected={...workflow,steps:workflow.steps.map(step=>({...step,...(step.kind==='form'?{controls:plan.controls}:{} )})),outputs:workflow.outputs.map(output=>({...output,assignments:output.assignments.map(assignment=>assignment.target==='ID'?{...assignment,expression:JSON.stringify(id)}:assignment)}))};
 const slots={...coerceWorkflowValues(projected,workflowEditSlots(plan,{},draft,geometry)),actor:actor.trim()};
 const inputs=validateV3WorkflowInputs({...projected,actor:{required:false}},slots,projected.steps.filter(step=>step.kind==='form'),config);
 if(inputs.length)throw Error(inputs.map(issue=>issue.message).join('\n'));
 const output=projected.outputs[0],results=evaluateV3WorkflowOutputs(projected,slots,{world,config,classifications:{[output.id]:draft.classification},coordinates:{[output.id]:geometry},now});
 const raw=results[0]?.record;if(!raw)throw Error('未生成有效的新建记录。');
 return prepareNativeRecordCreate(config,draft.classification,geometry,raw,world,actor,others,now);
}
