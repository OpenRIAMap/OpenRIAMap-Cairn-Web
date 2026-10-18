import type {ConfigPackageV3,WorkflowDefinition} from './types';
import {classificationPathKey,hasDescendants} from './runtime';
/** Category transactions refresh only generated controls; user forms/drawings stay intact. */
export function syncWorkflowClassification(config:ConfigPackageV3,source:WorkflowDefinition):WorkflowDefinition {
  if(source.mode==='external')return source;
  const workflow=structuredClone(source),eligible=workflow.outputs.filter(output=>hasDescendants(config,output.classification)),seen=new Set<string>();
  for(const step of workflow.steps)if(step.kind==='form')step.controls=(step.controls??[]).flatMap(control=>{
    if(control.kind!=='classificationPicker'||!control.systemManaged)return [control];
    const output=eligible.find(output=>output.id===control.outputId||!control.outputId&&control.classificationScope&&classificationPathKey(control.classificationScope)===classificationPathKey(output.classification));
    if(!output||seen.has(output.id))return [];seen.add(output.id);return [{...control,outputId:output.id,required:true,classificationScope:structuredClone(output.classification)}];
  });
  const missing=eligible.filter(output=>!seen.has(output.id)),form=workflow.steps.find(step=>step.kind==='form');
  if(missing.length&&!form)throw Error('分类新增子级后需要信息页，当前工作流没有可放置分类控件的信息页。');
  if(form)form.controls=[...missing.map(output=>({id:`system-classification-${output.id}`,kind:'classificationPicker' as const,columns:1 as const,label:{zh:`分类 ${workflow.outputs.indexOf(output)+1}`,en:''},classificationScope:structuredClone(output.classification),outputId:output.id,required:true,systemManaged:true})),...form.controls??[]];
  return JSON.stringify(source)===JSON.stringify(workflow)?source:workflow;
}
export function syncSystemClassification(config:ConfigPackageV3):ConfigPackageV3{return {...config,workflows:config.workflows.map(workflow=>syncWorkflowClassification(config,workflow))};}
