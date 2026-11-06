import type {ConfigValidationIssue} from './types';
export const isDynamicDiagnostic=(code:string)=>/^workflow-.*-unknown$/.test(code);
/** Presentation grouping only: original findings and severity remain authoritative. */
export function diagnosticGroups(issues:ConfigValidationIssue[]):Array<[string,ConfigValidationIssue[]]>{
 const groups=new Map<string,ConfigValidationIssue[]>();
 const expressions=new Map<string,Set<string>>();
 for(const issue of issues){const match=/^(workflows\/[^/]+\/outputs\/[^/]+)\/assignments\/[^/]+/.exec(issue.path);if(match&&isDynamicDiagnostic(issue.code)&&issue.field){const key=match[1]+':'+issue.field.split('.')[0],roots=expressions.get(key)??new Set<string>();roots.add(match[0]);expressions.set(key,roots);}}
 for(const issue of issues){
  let root=issue.path,reason=issue.code;
  if(issue.code.startsWith('prefill-')){
   const source=/(?:预填来源|来源)\s+([^\s]+)\s*\//.exec(issue.message)?.[1];
   root=source?'prefill:'+source:issue.path;
  }else if(isDynamicDiagnostic(issue.code)){
   // The same assignment proves a shared expression; workflow alone does not.
   const assignment=/^(workflows\/[^/]+\/outputs\/[^/]+\/assignments\/[^/]+)/.exec(issue.path)?.[1];
   if(assignment){root=assignment;reason='dynamic-expression';}
   else {const required=/^(workflows\/[^/]+\/outputs\/[^/]+)\/required\/([^/.]+)/.exec(issue.path);const roots=required?expressions.get(required[1]+':'+required[2]):undefined;if(roots?.size===1){root=[...roots][0];reason='dynamic-expression';}}
  }
  const key=[issue.severity,reason,root].join(':');
  const rows=groups.get(key)??[];rows.push(issue);groups.set(key,rows);
 }
 return [...groups].sort(([,a],[,b])=>Number(b[0].severity==='error')-Number(a[0].severity==='error'));
}
