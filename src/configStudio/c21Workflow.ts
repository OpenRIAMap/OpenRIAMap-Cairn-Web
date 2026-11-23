import type {ClassificationPath,ConfigPackageV3,DatasetEntry,WorkflowControl,WorkflowDefinition} from './types';
import {workflowConditionMatches} from './workflowExpression';
import {matchesClassificationRange} from './classificationScope';
import {normalizeRuleSourceWorldId} from '../core/project/worldIdentity';
export const DATASET_TABLE_ID='dataset-directory';
export function datasetOptions(config:ConfigPackageV3,world:string,path:ClassificationPath|undefined){
 if(!path?.class)return [];
 return (config.lookupTables?.find(t=>t.id===DATASET_TABLE_ID)?.rows??[]).filter(row=>{const entry=row.functionValue as DatasetEntry|undefined;return entry&&entry.world===normalizeRuleSourceWorldId(world)&&entry.scope&&matchesClassificationRange(entry.scope,path);});
}
/** Stable output IDs are available alongside historical single-output/index tokens. */
export function workflowConditionContext(workflow:WorkflowDefinition,slots:Record<string,unknown>,selections:Record<string,ClassificationPath|undefined>={}):Record<string,unknown>{
 const context={...slots};
 workflow.outputs.forEach((output,index)=>{
  const picker=workflow.steps.flatMap(s=>s.controls??[]).find(c=>c.kind==='classificationPicker'&&c.outputId===output.id);
  let selected=selections[output.id]??(typeof slots[`${output.id}.Class`]==='string'?{class:String(slots[`${output.id}.Class`]),kind:String(slots[`${output.id}.Kind`]??''),skind:String(slots[`${output.id}.Skind`]??''),skind2:String(slots[`${output.id}.Skind2`]??'')}:undefined)??output.classification;
  if(!selected&&picker)try{selected=JSON.parse(String(slots[picker.slot??picker.id]??''));}catch{/* Unselected. */}
  const values={Class:selected?.class??'',Kind:selected?.kind??'',Skind:selected?.skind??'',Skind2:selected?.skind2??''};
  for(const [key,value] of Object.entries(values)){if(index===0)context[key]=value;context[`${key}_${index+1}`]=value;context[`${output.id}.${key}`]=value;}
 });return context;
}
export function workflowControlActive(workflow:WorkflowDefinition,control:WorkflowControl,slots:Record<string,unknown>,selections:Record<string,ClassificationPath|undefined>={}):boolean{
 return workflowConditionMatches(control.when,workflowConditionContext(workflow,slots,selections));
}
/** Preserve hidden drafts; only a successful output snapshot drops inactive values. */
export function activeWorkflowSlots(workflow:WorkflowDefinition,slots:Record<string,unknown>,selections:Record<string,ClassificationPath|undefined>={}):Record<string,unknown>{
 const result={...slots};for(const c of workflow.steps.flatMap(s=>s.controls??[]))if(c.slot&&!workflowControlActive(workflow,c,slots,selections))delete result[c.slot];return result;
}
export function groupTagControls(workflow:WorkflowDefinition):void{
 for(const step of workflow.steps.filter(s=>s.kind==='form')){
  const tags=(step.controls??[]).filter(c=>c.kind==='dataset'||c.kind!=='tagsExtensions'&&c.kind!=='classificationPicker'&&c.slot&&workflow.outputs.some(o=>o.assignments.some(a=>a.target.startsWith('tags.')&&a.expression.trim()===c.slot)));
  if(!tags.length)continue;step.sections??=[];let section=step.sections.find(s=>s.id==='extra-tag-information');if(!section){section={id:'extra-tag-information',label:{zh:'额外标签信息',en:'Additional tags'},initialOpen:true};step.sections.push(section);}for(const c of tags)if(!c.sectionId)c.sectionId=section.id;
 }
}
