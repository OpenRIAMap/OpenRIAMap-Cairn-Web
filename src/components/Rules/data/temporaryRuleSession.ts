/**
 * Ephemeral bridge from the mapping editor to RuleDrivenLayer.
 *
 * It intentionally has no storage-provider dependency: mapping data disappears
 * on browser refresh, module unmount, or an explicit workspace switch.  The
 * module-level object lets the map renderer and editor cooperate during one
 * browser process without leaking a draft to another login/session.
 */
export type TemporaryRuleSource = {
  uid: string;
  worldId: string;
  label?: string;
  enabled: boolean;
  items: any[];
  picturesById?: Record<string, any[]>;
};

type TemporaryRuleSession = {
  sources: Record<string, TemporaryRuleSource[]>;
  overrideIds: Record<string, string[]>;
  deleteIds: Record<string, string[]>;
  sourceRevision: string;
  overrideRevision: string;
  deleteRevision: string;
};

const session: TemporaryRuleSession = {
  sources: {}, overrideIds: {}, deleteIds: {}, sourceRevision: '', overrideRevision: '', deleteRevision: '',
};

function revision(): string { return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }
function cloneSources(value: Record<string, TemporaryRuleSource[]>): Record<string, TemporaryRuleSource[]> { return { ...value }; }
function cloneIds(value: Record<string, string[]>): Record<string, string[]> { return { ...value }; }

export function readTemporaryRuleSources(): Record<string, TemporaryRuleSource[]> { return cloneSources(session.sources); }
export function readTemporaryRuleSourcesForWorld(worldId: string): TemporaryRuleSource[] { return Array.isArray(session.sources[worldId]) ? session.sources[worldId] : []; }
export function readTemporaryRuleOverrideIds(): Record<string, string[]> { return cloneIds(session.overrideIds); }
export function readTemporaryRuleOverrideIdsForWorld(worldId: string): Set<string> { return new Set((session.overrideIds[worldId] ?? []).map((value) => String(value).trim()).filter(Boolean)); }
export function readTemporaryRuleDeleteIds(): Record<string, string[]> { return cloneIds(session.deleteIds); }
export function readTemporaryRuleDeleteIdsForWorld(worldId: string): Set<string> { return new Set((session.deleteIds[worldId] ?? []).map((value) => String(value).trim()).filter(Boolean)); }
export function temporaryRuleRevisions(): Pick<TemporaryRuleSession, 'sourceRevision' | 'overrideRevision' | 'deleteRevision'> { return { sourceRevision: session.sourceRevision, overrideRevision: session.overrideRevision, deleteRevision: session.deleteRevision }; }
export function hasEnabledTemporaryRuleSources(): boolean { return Object.values(session.sources).some((entries) => entries.some((entry) => entry?.enabled)); }

export function writeTemporaryRuleSources(value: Record<string, TemporaryRuleSource[]>): string { session.sources = cloneSources(value); session.sourceRevision = revision(); return session.sourceRevision; }
export function writeTemporaryRuleOverrideIds(value: Record<string, string[]>): string { session.overrideIds = cloneIds(value); session.overrideRevision = revision(); return session.overrideRevision; }
export function writeTemporaryRuleDeleteIds(value: Record<string, string[]>): string { session.deleteIds = cloneIds(value); session.deleteRevision = revision(); return session.deleteRevision; }
export function bumpTemporaryRuleSourcesRevision(): string { session.sourceRevision = revision(); return session.sourceRevision; }
export function bumpTemporaryRuleOverrideIdsRevision(): string { session.overrideRevision = revision(); return session.overrideRevision; }
export function bumpTemporaryRuleDeleteIdsRevision(): string { session.deleteRevision = revision(); return session.deleteRevision; }

/** Removes all editor-owned preview records; base rule caches remain untouched. */
export function clearTemporaryRuleSession(): void {
  session.sources = {};
  session.overrideIds = {};
  session.deleteIds = {};
  session.sourceRevision = revision();
  session.overrideRevision = revision();
  session.deleteRevision = revision();
}
