import type { ConfigValidationReport } from './types';

/** Authoring-only allowance. Final saves and all normal exports still use the
 * complete validator; only an unfinished leaf's missing geometry may wait. */
export function categoryDraftReport(report: ConfigValidationReport): ConfigValidationReport {
  const issues = report.issues.filter(issue => issue.code !== 'leaf-geometry-type-required');
  return {
    ...report,
    issues,
    valid: !issues.some(issue => issue.severity === 'error'),
    ...(report.summary ? { summary: { ...report.summary, configuration: report.summary.configuration - (report.issues.length - issues.length) } } : {}),
  };
}
