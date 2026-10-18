/** Snapshot protocol: sorted object keys, original array order, JSON scalars.
 * Hash original file bytes separately; this fingerprint identifies UI content. */
export function stableConfigText(value: unknown): string {
  if (Array.isArray(value)) return '['+value.map(item=>stableConfigText(item)??'null').join(',')+']';
  if (value && typeof value==='object') {const record=value as Record<string,unknown>;return '{'+Object.keys(record).sort().filter(key=>record[key]!==undefined).map(key=>JSON.stringify(key)+':'+stableConfigText(record[key])).join(',')+'}';}
  return JSON.stringify(value);
}
