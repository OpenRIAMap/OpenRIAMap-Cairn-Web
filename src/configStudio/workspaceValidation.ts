import { stableConfigText } from '../configRuntime/configurationFingerprint';
import { CONFIGURATION_RULES_VERSION } from '../configRuntime/formalConfiguration';
import { VALIDATOR_FINGERPRINT, RESOURCE_FINGERPRINT, sha256Bytes } from '../configRuntime/configurationVerification';
import { validateConfigPackage } from './runtime';
import { withCategoryDeletionIssues } from './categoryDeletion';
import type { ConfigPackageV3, MountedFeatureRecord } from './types';
import type { WorkspaceValidation } from './workspaceTypes';
export const VALIDATION_SESSION=crypto.randomUUID();

export async function validateWorkspace(config: ConfigPackageV3, records: MountedFeatureRecord[], generation: number, baseline?: ConfigPackageV3): Promise<WorkspaceValidation> {
  const nativeReport = validateConfigPackage(config, records);
  const report = baseline ? withCategoryDeletionIssues(nativeReport, baseline, config, records) : nativeReport;
  const [configFingerprint, recordsFingerprint] = await Promise.all([config, records].map(value => sha256Bytes(new TextEncoder().encode(stableConfigText(value)))));
  return { id: crypto.randomUUID(), sessionId:VALIDATION_SESSION, generation, configFingerprint, recordsFingerprint, rulesVersion: CONFIGURATION_RULES_VERSION, validatorFingerprint: VALIDATOR_FINGERPRINT, resourceFingerprint: RESOURCE_FINGERPRINT, mountedCount: records.length, report };
}
export function currentValidation(run: WorkspaceValidation | undefined, generation: number): boolean {
  return !!run && run.generation === generation && run.rulesVersion === CONFIGURATION_RULES_VERSION && run.validatorFingerprint === VALIDATOR_FINGERPRINT && run.resourceFingerprint === RESOURCE_FINGERPRINT && typeof run.report?.valid==='boolean' && Array.isArray(run.report.issues) && run.report.issues.every(issue=>!!issue&&typeof issue.code==='string'&&typeof issue.message==='string'&&typeof issue.path==='string');
}
