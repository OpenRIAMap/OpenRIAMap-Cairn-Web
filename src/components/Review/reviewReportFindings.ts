export type ReviewFindingView={code?:string;severity:string;message:string;packageId?:string};
/** Gate errors and immutable per-package reports are part of the same report. */
export function reviewReportFindings(value:unknown):ReviewFindingView[]{
 const results:ReviewFindingView[]=[];
 const visit=(raw:unknown,packageId?:string,depth=0)=>{if(!raw||typeof raw!=='object'||depth>8)return;const row=raw as Record<string,unknown>,identity=row.package as Record<string,unknown>|undefined,label=String(identity?.submissionId??row.submissionId??packageId??'');
  if(Array.isArray(row.findings))for(const item of row.findings){if(item&&typeof item==='object'){const finding=item as Record<string,unknown>;results.push({code:typeof finding.code==='string'?finding.code:undefined,severity:String(finding.severity??'info'),message:String(finding.message??finding.code??'未提供说明'),...(label?{packageId:label}:{})});}}
  for(const key of ['error','staleReason'])if(typeof row[key]==='string'&&row[key])results.push({code:key,severity:'blocker',message:String(row[key]),...(label?{packageId:label}:{})});
  visit(row.report,label,depth+1);visit(row.gate,label,depth+1);if(Array.isArray(row.reports))for(const report of row.reports)visit(report,label,depth+1);
 };visit(value);
 return [...new Map(results.map(item=>[JSON.stringify(item),item])).values()];
}
export function reviewReportProtocolValid(report:{decision?:string}|null){return !report||!['blocked','warning-confirmation-required','failed'].includes(report.decision??'')||reviewReportFindings(report).some(item=>item.severity==='blocker'||report.decision==='warning-confirmation-required'&&item.severity==='warning');}
