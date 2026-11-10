export type ReviewFindingTarget = { worldId?: string; classCode?: string; featureId?: string };
type ReviewFindingOperation = ReviewFindingTarget & { submissionId?: string; revisionId?: string; packageName?: string; action?: string };
export type ReviewFindingView = {
  code?: string;
  severity: string;
  message: string;
  packageId?: string;
  target?: ReviewFindingTarget;
  operations?: ReviewFindingOperation[];
  formalTargets?: ReviewFindingTarget[];
  currentTargets?: ReviewFindingTarget[];
  businessKey?: string;
  detail?: string;
  jobId?: string;
  sourceReleaseId?: string;
  currentReleaseId?: string;
  before?: ReviewFindingTarget | null;
  after?: ReviewFindingTarget | null;
  baselineChanges?: ReviewFindingView[];
};

function object(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : undefined;
}

function details<T>(value: unknown): T[] | undefined {
  return Array.isArray(value) ? value.filter(object) as T[] : undefined;
}

function readFinding(row: Record<string, unknown>, packageId?: string, depth=0): ReviewFindingView {
  const string = (key: string) => typeof row[key] === 'string' ? row[key] as string : undefined;
  return {
    code: string('code'), severity: String(row.severity ?? 'info'),
    message: String(row.message ?? row.code ?? '未提供说明'), packageId,
    target: object(row.target) as ReviewFindingTarget | undefined,
    operations: details<ReviewFindingOperation>(row.operations),
    formalTargets: details<ReviewFindingTarget>(row.formalTargets),
    currentTargets: details<ReviewFindingTarget>(row.currentTargets),
    businessKey: string('businessKey'), detail: string('detail'), jobId: string('jobId'), sourceReleaseId: string('sourceReleaseId'), currentReleaseId: string('currentReleaseId'),
    before: row.before===null ? null : object(row.before) as ReviewFindingTarget | undefined,
    after: row.after===null ? null : object(row.after) as ReviewFindingTarget | undefined,
    baselineChanges: depth<2 ? details<Record<string,unknown>>(row.baselineChanges)?.map(item=>readFinding(item,undefined,depth+1)) : undefined,
  };
}

/** Gate errors and immutable per-package reports are part of the same report. */
export function reviewReportFindings(value:unknown):ReviewFindingView[] {
  const results: ReviewFindingView[] = [];
  function visit(raw: unknown, packageId?: string, depth=0) {
    const row=object(raw);
    if(!row||depth>8)return;
    const identity=object(row.package), label=String(identity?.submissionId??row.submissionId??packageId??'')||undefined;
    for(const item of details<Record<string,unknown>>(row.findings)??[])results.push(readFinding(item,label));
    for(const key of ['error','staleReason']){
      if(typeof row[key]==='string'&&row[key])results.push({code:key,severity:'blocker',message:String(row[key]),packageId:label});
    }
    visit(row.report,label,depth+1);
    visit(row.gate,label,depth+1);
    for(const report of details(row.reports)??[])visit(report,label,depth+1);
  }
  visit(value);
  return [...new Map(results.map(item=>[JSON.stringify(item),item])).values()];
}

export function reviewReportProtocolValid(report:{decision?:string}|null) {
  return !report||!['blocked','warning-confirmation-required','failed'].includes(report.decision??'')||
    reviewReportFindings(report).some(item=>item.severity==='blocker'||report.decision==='warning-confirmation-required'&&item.severity==='warning');
}
