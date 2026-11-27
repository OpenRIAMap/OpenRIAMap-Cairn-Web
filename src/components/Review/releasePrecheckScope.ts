import type { ReviewStatusBoardEntry } from './statusBoard';
import { isReviewReleaseGateLeaseExpired } from './statusBoard';
import type { ReviewReleaseControlReport, ReviewReleaseGateSnapshot } from './contracts';
import { reviewReportProtocolValid } from './reviewReportFindings';

/** Selection order is presentation; identity, immutable revisions and board are authority. */
export function releasePrecheckScopeKey(
  entries: Pick<ReviewStatusBoardEntry, 'submissionId' | 'decisionRevisionId'>[],
  boardVersion: number | undefined,
  principalId: string,
): string {
  const packages = entries.map(entry => [entry.submissionId, entry.decisionRevisionId ?? ''])
    .sort(([a, ar], [b, br]) => a.localeCompare(b) || ar.localeCompare(br));
  return JSON.stringify([principalId, boardVersion ?? null, packages]);
}

/** A visible historical report cannot authorize a different selection or gate. */
export function releasePrecheckCanPublish({dirty,currentKey,reportKey,report,gate,now=Date.now()}:{
  dirty:boolean;currentKey:string;reportKey?:string;report:ReviewReleaseControlReport|null;gate:ReviewReleaseGateSnapshot|null;now?:number;
}): boolean {
  return !dirty && reportKey === currentKey && reviewReportProtocolValid(report)
    && Boolean(report?.gate?.attemptId && gate?.state === 'awaiting-confirmation' && report.gate.attemptId === gate.attemptId
      && report.gate.gateVersion === gate.gateVersion && !isReviewReleaseGateLeaseExpired(gate,now))
    && (report?.decision === 'ready' || report?.decision === 'warning-confirmation-required');
}
