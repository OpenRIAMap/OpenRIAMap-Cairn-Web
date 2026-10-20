import { validateConfigPackage } from './runtime';
import type { ConfigPackageV3, ConfigValidationReport, MountedFeatureRecord } from './types';

/** A candidate may contain other broken modules. Their errors still block the
 * final package commit, but must not prevent staging an independently repaired
 * module. Ordinary saves always retain full-package validation. */
export function validateStudioModule(
  config: ConfigPackageV3,
  records: MountedFeatureRecord[],
  isolatedPaths?: string[],
): ConfigValidationReport {
  const report = validateConfigPackage(config, records);
  if (!isolatedPaths) return report;
  const issues = report.issues.filter(issue => issue.code === 'native-contract-structure-invalid' ||
    isolatedPaths.some(path => issue.path === path || issue.path.startsWith(path + '/')));
  return { ...report, issues, valid: !issues.some(issue => issue.severity === 'error') };
}
