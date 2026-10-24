export type StudioTab = 'general' | 'features' | 'workflows';
import type { ConfigPackageV3 } from './types';
import type { EngineDraft } from './engineTransaction';
import type { WorkflowEditingSession } from './WorkflowWorkbench';
export type ClassTreeSession={classCode:string;baseline:ConfigPackageV3;staged:ConfigPackageV3;changes:string[]};
export type PackageCandidate = { baseline: ConfigPackageV3; config: ConfigPackageV3; source: 'migration' | 'import' | 'recovery' | 'editing' };
export type FeatureDraftScope = 'package' | 'category';
export type StudioEditingSession={draft:ConfigPackageV3|null;draftScope?:FeatureDraftScope;tree:ClassTreeSession|null;selectedId:string;editing:boolean;baseline:ConfigPackageV3;generalDrafts?:import('./GeneralRulesEditor').GeneralDrafts;lookupDraft?:import('./lookupTableTransaction').LookupTableDraft|null;engineDraft?:EngineDraft|null;packageCandidate?:PackageCandidate|null;activeTab?:StudioTab;workflowSession?:WorkflowEditingSession|null;detailsByTab?:Partial<Record<StudioTab,string[]|number[]>>;categoryCreation?:import('./CategoryCreationPanel').CategoryCreationDraft|null;editorExpanded?:boolean;scenario?:import('./types').PreviewScenario};

export function hasStudioDraft(session?: StudioEditingSession): boolean {
  return Boolean(session && (session.draft || session.tree || session.editing || session.lookupDraft || session.engineDraft || session.packageCandidate || (session.workflowSession?.draft || session.workflowSession?.creation) || session.categoryCreation || Object.keys(session.generalDrafts ?? {}).length));
}

export function recoverPackageCandidate(session?: StudioEditingSession): PackageCandidate | null {
  if (session?.packageCandidate) return session.packageCandidate;
  return session?.draft && !session.tree && featureDraftScope(session) === 'package'
    ? { baseline: session.baseline, config: session.draft, source: 'recovery' }
    : null;
}

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
