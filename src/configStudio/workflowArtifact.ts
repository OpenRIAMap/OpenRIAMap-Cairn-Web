import { dictionaryDependencies, dictionaryTableIds, remapDictionaryDependencies, type DictionaryFieldDependency } from './dictionaryDependencies';
import type { ConfigPackageV3, LookupTable, WorkflowDefinition } from './types';
import { validateNativeStructure } from './nativeContractValidation';
import { validateWorkflowDefinition } from './runtime';

export type WorkflowArtifact={schemaVersion:'cairnmap.workflow-design.v3';contractRevision:5|6|7|8|9|10|11|12;fieldDependencies?:DictionaryFieldDependency[];exportedAt:string;projectId:string;workflow:WorkflowDefinition;lookupTables?:LookupTable[]};
const canonical=(value:unknown):string=>Array.isArray(value)?'['+value.map(canonical).join(',')+']':value&&typeof value==='object'?'{'+Object.entries(value).filter(([,v])=>v!==undefined).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>JSON.stringify(k)+':'+canonical(v)).join(',')+'}':JSON.stringify(value);
export function workflowTableIds(workflow:WorkflowDefinition):Set<string>{return new Set(workflow.steps.flatMap(step=>(step.controls??[]).flatMap(control=>[control.optionsTableId,...control.group?.itemFields.map(field=>field.optionsTableId)??[]].filter(Boolean) as string[])));}
export function buildWorkflowArtifact(config:ConfigPackageV3,workflow:WorkflowDefinition):WorkflowArtifact {
  const report=validateWorkflowDefinition(workflow,config);if(!report.valid)throw Error(report.issues.filter(i=>i.severity==='error').map(i=>i.message).join('\n'));
  const ids=dictionaryTableIds(config,workflow),tables=config.lookupTables?.filter(table=>ids.has(table.id));
  return {schemaVersion:'cairnmap.workflow-design.v3',contractRevision:config.contractRevision as WorkflowArtifact['contractRevision'],exportedAt:new Date().toISOString(),projectId:config.projectId,workflow:structuredClone(workflow),...(config.contractRevision>=11?{fieldDependencies:dictionaryDependencies(config,workflow)}:{}),...(tables?.length?{lookupTables:structuredClone(tables)}:{})};
}
/** Dependencies remain part of the workflow draft until its atomic save. */
export function prepareWorkflowArtifactImport(config:ConfigPackageV3,input:unknown):{workflow:WorkflowDefinition;tables:LookupTable[]}{
  if(!input||typeof input!=='object')throw Error('工作流文件结构无效。');const artifact=input as WorkflowArtifact;
  if(artifact.schemaVersion!=='cairnmap.workflow-design.v3'||!artifact.workflow)throw Error('文件不是标准 V3 工作流设计稿。');
  if(![5,6,7,8,9,10,11,12].includes(artifact.contractRevision)||artifact.contractRevision>config.contractRevision)throw Error('未知或更高的工作流契约版本，请先迁移总配置。');
  if(Object.keys(artifact).some(key=>!['schemaVersion','contractRevision','exportedAt','projectId','workflow','lookupTables','fieldDependencies'].includes(key)))throw Error('工作流文件含有未知属性。');
  const tables:LookupTable[]=[];
  for(const table of artifact.lookupTables??[]){const existing=config.lookupTables?.find(row=>row.id===table.id)??tables.find(row=>row.id===table.id);if(existing&&canonical(existing)!==canonical(table))throw Error(`对照表 ${table.id} 与当前配置冲突，未覆盖共享表。`);if(!existing)tables.push(structuredClone(table));}
  const imported=structuredClone(artifact.workflow);
  const candidate={...config,lookupTables:[...config.lookupTables??[],...tables],workflows:[imported]};
  if(artifact.contractRevision>=11)remapDictionaryDependencies(candidate,imported,structuredClone(artifact.fieldDependencies??[]));
  const structure=validateNativeStructure(candidate);if(structure.length)throw Error(structure.map(i=>`${i.path}：${i.message}`).join('\n'));
  const ids=dictionaryTableIds(candidate,imported);if(tables.some(table=>!ids.has(table.id)))throw Error('工作流文件包含未引用的额外表格。');
  const report=validateWorkflowDefinition(imported,candidate);if(!report.valid)throw Error(report.issues.filter(i=>i.severity==='error').map(i=>i.message).join('\n'));
  return {workflow:imported,tables};
}
