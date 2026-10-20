export type StudioTab = 'general' | 'features' | 'workflows';
import type { ConfigPackageV3 } from './types';
export type ClassTreeSession={classCode:string;baseline:ConfigPackageV3;staged:ConfigPackageV3;changes:string[]};
export type FeatureDraftScope = 'package' | 'category';
export type StudioEditingSession={draft:ConfigPackageV3|null;draftScope?:FeatureDraftScope;tree:ClassTreeSession|null;selectedId:string;editing:boolean;baseline:ConfigPackageV3;generalDrafts?:import('./GeneralRulesEditor').GeneralDrafts;lookupDraft?:import('./lookupTableTransaction').LookupTableDraft|null};

/** Recover migration/import drafts created before their scope was persisted. */
export function featureDraftScope(session?: StudioEditingSession): FeatureDraftScope {
  if (session?.draftScope) return session.draftScope;
  if (session?.draft && !session.tree && (
    session.draft.contractRevision !== session.baseline.contractRevision ||
    !session.draft.nodes.some(node => node.nodeId === session.selectedId)
  )) return 'package';
  return 'category';
}

/** An active edit must be explicitly saved or discarded before leaving it. */
export function canSwitchStudioTab(current: StudioTab, next: StudioTab, drafts: { feature: boolean; workflow: boolean; general?:boolean }): boolean {
  return current === next || (!drafts.feature && !drafts.workflow && !drafts.general);
}

export function workflowStudioUrl(href: string): string {
  const target = new URL(href);
  target.searchParams.set('workspace', 'config-studio');
  target.searchParams.set('tab', 'workflows');
  return target.toString();
}
