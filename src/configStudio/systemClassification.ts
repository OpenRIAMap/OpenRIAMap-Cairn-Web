import type {ConfigPackageV3,WorkflowDefinition} from './types';
import {classificationPathKey,hasDescendants} from './runtime';
import {workflowClassificationGroup} from './workflowClassificationGroup';
/** Refresh generated controls only; preserve user pages, IDs and their positions. */
export function syncWorkflowClassification(config:ConfigPackageV3,source:WorkflowDefinition):WorkflowDefinition{
  if(source.mode==='external')return source;
  const workflow={...source,steps:source.steps.map(step=>({...step}))},eligible=workflow.outputs.filter(output=>config.contractRevision>=15?workflowClassificationGroup(config,output).paths.length>1:Boolean(output.classification&&hasDescendants(config,output.classification))),seen=new Set<string>();
  for(const step of workflow.steps)if(step.kind==='form')step.controls=(step.controls??[]).flatMap(control=>{
    if(control.kind!=='classificationPicker'||!control.systemManaged)return [control];
    const output=eligible.find(output=>output.id===control.outputId||!control.outputId&&control.classificationScope&&output.classification&&classificationPathKey(control.classificationScope)===classificationPathKey(output.classification));
    if(!output||seen.has(output.id))return [];seen.add(output.id);
    const next={...control,outputId:output.id,required:true};if(config.contractRevision>=15)delete next.classificationScope;else next.classificationScope=structuredClone(output.classification);return [next];
  });
  const missing=eligible.filter(output=>!seen.has(output.id)),form=workflow.steps.find(step=>step.kind==='form');
  if(missing.length&&!form)throw Error('分类组存在多个候选，需要信息页放置系统分类控件。');
  if(form)form.controls=[...missing.map(output=>({id:'system-classification-'+output.id,kind:'classificationPicker' as const,columns:1 as const,label:{zh:'分类 '+(workflow.outputs.indexOf(output)+1),en:''},...(config.contractRevision<15?{classificationScope:structuredClone(output.classification)}:{}),outputId:output.id,required:true,systemManaged:true})),...form.controls??[]];
  return JSON.stringify(source)===JSON.stringify(workflow)?source:workflow;
}
export function syncSystemClassification(config:ConfigPackageV3):ConfigPackageV3{return {...config,workflows:config.workflows.map(workflow=>syncWorkflowClassification(config,workflow))};}
