export type CairnMapModuleMode = 'runtime' | 'mapping' | 'review';

export function isExclusiveModuleMode(mode: CairnMapModuleMode): boolean {
  return mode === 'mapping' || mode === 'review';
}
