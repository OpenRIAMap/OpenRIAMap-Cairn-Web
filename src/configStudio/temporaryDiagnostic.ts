import { sha256Bytes, VALIDATOR_FINGERPRINT, RESOURCE_FINGERPRINT } from '../configRuntime/configurationVerification';
import { CONFIGURATION_RULES_VERSION } from '../configRuntime/formalConfiguration';
import {readMigrationReport} from './migrationAttachment';
import type { ConfigPackageV3, ConfigValidationReport } from './types';

export const TEMPORARY_REPORT_PATH = 'reports/temporary-validation.json';
export type TemporaryDiagnostic = {
  schemaVersion: 'cairnmap.temporary-validation.v1'; exportedAt: string;
  configuration: { packageId: string; projectId: string; revision: number; contractRevision: number; configSha256: string };
  validator: { rulesVersion: string; fingerprint: string; resourceFingerprint: string };
  scope: { configuration: true; mountedData: boolean; mountedDataIdentity: string | null; mountedCount: number };
  report: ConfigValidationReport;
  migration?: import('./contractMigration').MigrationReport;
};
export function readTemporaryDiagnostic(value: unknown): TemporaryDiagnostic | undefined {
  const v = value as TemporaryDiagnostic;
  if (!v || v.schemaVersion !== 'cairnmap.temporary-validation.v1' || !Number.isFinite(Date.parse(v.exportedAt)) || !v.configuration || !v.validator || !v.scope || !v.report) return;
  if (typeof v.configuration.packageId !== 'string' || typeof v.configuration.projectId !== 'string' || !Number.isSafeInteger(v.configuration.revision) || !Number.isSafeInteger(v.configuration.contractRevision) || !/^[a-f0-9]{64}$/.test(v.configuration.configSha256)) return;
  if ([v.validator.rulesVersion,v.validator.fingerprint,v.validator.resourceFingerprint].some(item=>typeof item!=='string') || v.scope.configuration!==true || typeof v.scope.mountedData!=='boolean' || !Number.isSafeInteger(v.scope.mountedCount) || v.scope.mountedCount<0 || !(v.scope.mountedDataIdentity===null || typeof v.scope.mountedDataIdentity==='string')) return;
  if (v.report.schemaVersion!=='cairnmap.config-validation-report.v3' || typeof v.report.valid!=='boolean' || !Number.isFinite(Date.parse(v.report.createdAt)) || !Array.isArray(v.report.issues) || v.report.issues.length>100000) return;
  if (v.report.issues.some(issue=>!issue || !['error','warning'].includes(issue.severity) || [issue.code,issue.path,issue.message].some(item=>typeof item!=='string') || issue.affectedFeatures!==undefined && (!Array.isArray(issue.affectedFeatures) || issue.affectedFeatures.some(feature=>!feature || typeof feature.id!=='string' || feature.name!==undefined&&typeof feature.name!=='string')))) return;
  if (v.report.valid === v.report.issues.some(issue=>issue.severity==='error')) return;
  return {...v,migration:readMigrationReport(v.migration)};
}
export async function diagnosticMismatch(diagnostic: TemporaryDiagnostic, config: ConfigPackageV3, rawBytes: Uint8Array): Promise<string | undefined> {
  const recorded=diagnostic.configuration;
  if (recorded.contractRevision!==config.contractRevision) return `导出契约 c${recorded.contractRevision} 与当前导入契约 c${config.contractRevision} 不一致。`;
  if (recorded.packageId!==config.packageId || recorded.projectId!==config.projectId || recorded.revision!==config.revision || recorded.configSha256!==await sha256Bytes(rawBytes as BufferSource)) return '上次报告与导入配置的身份或内容摘要不一致。';
  if (diagnostic.validator.rulesVersion!==CONFIGURATION_RULES_VERSION || diagnostic.validator.fingerprint!==VALIDATOR_FINGERPRINT || diagnostic.validator.resourceFingerprint!==RESOURCE_FINGERPRINT) return '导出时的核验器或资源版本与当前版本不一致。';
}
