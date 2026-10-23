/** One capability source for UI, codecs, migrations and the vendored Node validator.
 * Configuration revision (r) and contract revision (c) are separate identities. */
export const NATIVE_CONFIG_REVISION = 14 as const;
export const CONTRACT_CAPABILITIES = {
  latest: NATIVE_CONFIG_REVISION,
  native: [5,6,7,8,9,10,11,12,13,14],
  activation: [6,7,8,9,10,11,12,13,14],
  category: [9,10,11,12,13,14],
  workflow: [5,6,7,8,9,10,11,12,13,14],
  publication: [11,12,13,14],
  migration: { baseline: 13, previousVersions: 5, steps: [[13,14]] },
} as const;
export type NativeContractRevision = typeof CONTRACT_CAPABILITIES.native[number];
export type CategoryContractRevision = typeof CONTRACT_CAPABILITIES.category[number];
export const formatConfigRevision = (value: number) => `r${value}`;
export const formatContractRevision = (value: number) => `c${value}`;
export const migrationMinimumRevision = (target:number=NATIVE_CONFIG_REVISION) => Math.max(CONTRACT_CAPABILITIES.migration.baseline,target-CONTRACT_CAPABILITIES.migration.previousVersions);
export const supportsContract = (capability: 'native'|'activation'|'category'|'workflow'|'publication', value: unknown): boolean =>
  typeof value === 'number' && (CONTRACT_CAPABILITIES[capability] as readonly number[]).includes(value);
export function isNativeConfigRevision(value: unknown): value is NativeContractRevision { return supportsContract('native', value); }
export function assertKnownMigrationInput(value: number): void {
  if (![3,4,...CONTRACT_CAPABILITIES.native].includes(value)) throw Error(`未知契约 ${formatContractRevision(value)}，不能迁移或降级。`);
}
