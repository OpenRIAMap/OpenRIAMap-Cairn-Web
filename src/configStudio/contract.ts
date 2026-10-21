/** Capability revision is distinct from the user's saved package revision. */
export const NATIVE_CONFIG_REVISION = 13 as const;
export function isNativeConfigRevision(value: unknown): value is 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 { return typeof value === 'number' && Number.isInteger(value) && value >= 5 && value <= 13; }
