import { validateConfigPackage } from '../configStudio/runtime';
import type { ConfigPackageV3 } from '../configStudio/types';
import kernel from '../../vendor/configuration-r11/manifest.json';
import catalogue from '../configStudio/pinhead-capabilities.generated.json';
import type { ConfigurationIdentity } from './formalConfiguration';
import type { ValidationReceipt } from './formalCache';

export const VALIDATOR_FINGERPRINT = kernel.sha256;
export const RESOURCE_FINGERPRINT = catalogue.manifestSha256;
export async function sha256Bytes(value: BufferSource): Promise<string> {
  return [...new Uint8Array(await crypto.subtle.digest('SHA-256', value))].map(byte => byte.toString(16).padStart(2, '0')).join('');
}
export function receiptFor(identity: ConfigurationIdentity): ValidationReceipt {
  return { configSha256: identity.configSha256, contractRevision: identity.contractRevision, validatorFingerprint: VALIDATOR_FINGERPRINT, resourceFingerprint: RESOURCE_FINGERPRINT };
}
export function receiptMatches(identity: ConfigurationIdentity, receipt?: ValidationReceipt): boolean {
  const expected = receiptFor(identity);
  return !!receipt && Object.entries(expected).every(([key, value]) => receipt[key as keyof ValidationReceipt] === value);
}
/** Shared worker/fallback verifier. A receipt never bypasses content hashing. */
export async function decodeVerifiedConfiguration(identity: ConfigurationIdentity, bytes: Uint8Array, receipt?: ValidationReceipt): Promise<ConfigPackageV3> {
  if (await sha256Bytes(bytes as BufferSource) !== identity.configSha256) throw Error('正式配置字节摘要不符，已阻止启用。');
  const config = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)) as ConfigPackageV3;
  if (config.packageId !== identity.packageId || config.projectId !== identity.projectId || config.revision !== identity.revision || config.contractRevision !== identity.contractRevision) throw Error('正式配置与发布身份不一致。');
  if (!receiptMatches(identity, receipt)) {
    const report = validateConfigPackage(config);
    if (!report.valid) throw Error('正式配置核验未通过：' + report.issues.filter(issue => issue.severity === 'error').slice(0, 4).map(issue => issue.message).join('；'));
  }
  return config;
}
