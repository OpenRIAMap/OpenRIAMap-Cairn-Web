import type {ConfigPackageV3,LocalizedText,WorkflowDefinition} from './types';
import {validateConfigPackage,validateWorkflowDefinition} from './runtime';
import {dictionaryDependencies,dictionaryTableIds} from './dictionaryDependencies';
/** Workflow-local identities are scoped by the new workflow ID. Keeping slot,
 * output and drawing identities together preserves every internal reference. */
export function cloneWorkflowTemplate(config:ConfigPackageV3,sourceId:string,id:string,label:LocalizedText){
  id=id.trim();if(!/^[A-Za-z][A-Za-z0-9_-]{1,100}$/.test(id)||config.workflows.some(flow=>flow.id===id))throw Error('新工作流 ID 无效或已存在，不能覆盖模板。');
  if(!(label.zh.trim()||label.en.trim()))throw Error('请填写新工作流名称。');
  const source=config.workflows.find(flow=>flow.id===sourceId);if(!source)throw Error('模板工作流不存在。');
  dictionaryDependencies(config,source);for(const table of dictionaryTableIds(config,source))if(!config.lookupTables?.some(row=>row.id===table))throw Error(`模板缺少表格依赖 ${table}。`);
  const workflow:WorkflowDefinition={...structuredClone(source),id,label:{zh:label.zh.trim(),en:label.en.trim()}};
  const report=validateWorkflowDefinition(workflow,config);if(!report.valid)throw Error(report.issues.filter(issue=>issue.severity==='error').map(issue=>`${issue.path}：${issue.message}`).join('\n'));
  const packageReport=validateConfigPackage({...config,workflows:[...config.workflows,workflow]});
  return {workflow,report:packageReport}; // scope conflicts remain visible in the independent draft
}
