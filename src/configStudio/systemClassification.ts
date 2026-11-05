import type {ConfigPackageV3,WorkflowDefinition} from './types';
import {classificationPathKey,hasDescendants} from './runtime';
import {workflowClassificationGroup} from './workflowClassificationGroup';
/** Refresh generated controls only; preserve user pages, IDs and their positions. */
export function syncWorkflowClassification(config:ConfigPackageV3,source:WorkflowDefinition):WorkflowDefinition{
  if(source.mode==='external')return source;
  if(config.contractRevision>=18){
    const workflow=structuredClone(source),form=workflow.steps.find(step=>step.kind==='form');
    if(!form){if(workflow.outputs.length)throw Error('每个输出都需要信息页放置分类和标签扩展单元。');return workflow;}
    const seen=new Set<string>(),legacy=workflow.steps.flatMap(step=>step.controls??[]).find(control=>control.kind==='tagsExtensions'&&!control.outputId);
    for(const step of workflow.steps)if(step.kind==='form')step.controls=(step.controls??[]).flatMap(control=>{
      if(!control.systemManaged||!['classificationPicker','tagsExtensions'].includes(control.kind))return [control];
      const output=workflow.outputs.find(output=>output.id===(control.outputId??(workflow.outputs.length===1?workflow.outputs[0].id:undefined)));
      const key=control.kind+':'+output?.id;if(!output||seen.has(key))return [];seen.add(key);
      return [{...control,outputId:output.id,classificationScope:undefined,columns:1 as const,required:control.kind==='classificationPicker',label:{zh:(control.kind==='classificationPicker'?'分类':'标签与扩展')+' · 输出 '+(workflow.outputs.indexOf(output)+1),en:''}}];
    });
    for(const [index,output] of workflow.outputs.entries())for(const kind of ['classificationPicker','tagsExtensions'] as const)if(!seen.has(kind+':'+output.id))form.controls!.push({...(kind==='tagsExtensions'?legacy:{}),id:`system-${kind}-${output.id}`,kind,outputId:output.id,columns:1,label:{zh:(kind==='classificationPicker'?'分类':'标签与扩展')+' · 输出 '+(index+1),en:''},systemManaged:true,...(kind==='classificationPicker'?{required:true}:{tagsExtensions:{tagsEnabled:true,extensionsEnabled:true}})});
    return JSON.stringify(source)===JSON.stringify(workflow)?source:workflow;
  }

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
