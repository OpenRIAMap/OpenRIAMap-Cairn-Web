import type {ConfigPackageV3,WorkflowControl,WorkflowDefinition} from './types';
import {validateWorkflowDefinition,resolveEffectiveFields} from './runtime';

/** Validate the proposed write, not equality of the candidates' field schemas.
 * Unrelated draft issues remain editable and are reported by normal Save. */
export function assertWorkflowFieldBinding(config:ConfigPackageV3,workflow:WorkflowDefinition,control:WorkflowControl,target:string,outputId:string):void{
  const output=workflow.outputs.find(output=>output.id===outputId);
  if(!output)throw Error('所选输出不存在。');
  if(config.contractRevision<15){if(!output.classification||!resolveEffectiveFields(config,output.classification).some(field=>field.key===target))throw Error('所选输出没有对应字段，不能绑定。');return;}
  const existing=output.assignments.find(row=>row.target===target);
  const id=existing?.id??'proposed-field-binding';
  const proposed={...workflow,steps:workflow.steps.map(step=>({...step,controls:step.controls?.map(item=>item.id===control.id?control:item)})),outputs:workflow.outputs.map(item=>item.id===outputId?{...item,assignments:existing?item.assignments.map(row=>row===existing?{...row,expression:control.slot??control.id}:row):[...item.assignments,{id,target,expression:control.slot??control.id}]}:item)};
  const path=`workflows/${workflow.id}/outputs/${outputId}/assignments/${id}`;
  const issues=validateWorkflowDefinition(proposed,config).issues.filter(issue=>issue.severity==='error'&&(issue.path===path||issue.path.endsWith(`/controls/${control.id}`)));
  if(issues.length)throw Error(issues.map(issue=>issue.message).join('\n'));
}
