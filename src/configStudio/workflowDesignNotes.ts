import {parseWorkflowExpression} from './workflowExpression';
import type {ClassificationPath,ConfigDesignNote,ConfigValidationIssue,FieldDefinition,WorkflowDefinition} from './types';

const dynamicCodes=new Set(['workflow-expression-format-unknown','workflow-value-schema-unknown','workflow-expression-type-unknown','workflow-required-field-coverage-unknown']);
/** Only a direct free-JSON source with a declared, runtime-enforced target
 * structure is an output-stage note. Unknown components and conflicts stay issues. */
export function partitionWorkflowDesignNotes(workflow:WorkflowDefinition,fields:FieldDefinition[],candidate:{outputId:string;classification:ClassificationPath},issues:ConfigValidationIssue[]):{issues:ConfigValidationIssue[];notes:ConfigDesignNote[]}{
 const output=workflow.outputs.find(o=>o.id===candidate.outputId),notes:ConfigDesignNote[]=[],remaining:ConfigValidationIssue[]=[];
 const controls=workflow.steps.flatMap(s=>s.controls??[]);
 for(const issue of issues){
  const assignmentId=/\/assignments\/([^/]+)$/.exec(issue.path)?.[1],requiredKey=/\/required\/(.+)$/.exec(issue.path)?.[1];
  const matches=output?.assignments.filter(a=>assignmentId?a.id===assignmentId:requiredKey&&(requiredKey===a.target||requiredKey.startsWith(a.target+'.')))??[];
  let slot:string|undefined;
  if(issue.severity==='warning'&&dynamicCodes.has(issue.code)&&matches.length===1){
   try{const ast=parseWorkflowExpression(matches[0].expression);if(ast.kind==='token'&&controls.some(c=>c.slot===ast.name&&c.kind==='json')&&fields.some(f=>f.key===matches[0].target&&(f.valueSchema||f.coordinateFormat)))slot=ast.name;}catch{/* Syntax errors remain ordinary issues. */}
  }
  if(!slot){remaining.push(issue);continue;}
  const {severity:_severity,...original}=issue;
  notes.push({...original,originalSeverity:'warning',checkStage:'output',sourceSlot:slot,outputId:candidate.outputId,classification:candidate.classification,groupRoot:`workflows/${workflow.id}/outputs/${candidate.outputId}/assignments/${matches[0].id}`});
 }
 return {issues:remaining,notes};
}
export function validDesignNotes(value:unknown):boolean{
 if(value===undefined)return true;
 return Array.isArray(value)&&value.length<=100000&&value.every(n=>n&&typeof n==='object'&&dynamicCodes.has(n.code)&&n.checkStage==='output'&&n.originalSeverity==='warning'&&['code','path','message','sourceSlot','outputId','groupRoot'].every(k=>typeof n[k]==='string'&&n[k].length<=20000)&&n.classification&&typeof n.classification.class==='string');
}
