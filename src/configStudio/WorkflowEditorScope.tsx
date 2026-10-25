import {CategoryPathPicker} from './CategoryPathPicker';
import {workflowClassificationGroup} from './workflowClassificationGroup';
import type {ClassificationPath,ConfigPackageV3,WorkflowDefinition} from './types';

/** A missing legacy scope can be initialized from the actual candidate set;
 * an explicit scope is always retained until the author changes it. */
export function proposedWorkflowEditorScope(config:ConfigPackageV3,workflow:WorkflowDefinition):ClassificationPath {
  if(workflow.editor?.scope)return workflow.editor.scope;
  const paths=workflow.outputs.flatMap(output=>workflowClassificationGroup(config,output).paths);
  if(!paths.length)return workflow.target??{class:''};
  const scope:ClassificationPath={class:''};
  for(const key of ['class','kind','skind','skind2'] as const){
    const value=paths[0][key];
    if(!value||!paths.every(path=>path[key]===value))break;
    scope[key]=value;
  }
  return scope;
}

export function WorkflowEditorScope({config,workflow,onChange}:{config:ConfigPackageV3;workflow:WorkflowDefinition;onChange:(workflow:WorkflowDefinition)=>void}) {
  if(workflow.mode!=='composed')return null;
  return <section className="cm-subsection space-y-2" aria-label="编辑作用范围设置">
    <h4 className="text-sm font-medium">编辑作用范围</h4>
    <p className="text-xs text-slate-500">编辑对象还必须属于下方分类组。迁移输出分类后，请同步核对本范围；未通过匹配与字段核验时不能保存。</p>
    <CategoryPathPicker config={config} scopeMode label="编辑作用范围" value={proposedWorkflowEditorScope(config,workflow)} onChange={scope=>onChange({...workflow,editor:{...workflow.editor,enabled:workflow.editor?.enabled??false,scope}})}/>
  </section>;
}
