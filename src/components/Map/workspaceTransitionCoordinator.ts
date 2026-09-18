/**
 * The host owns the lifetime boundary between the three authoring surfaces.
 *
 * This deliberately has no React, Leaflet or network dependency so an entry
 * click can be verified before any target UI is mounted.  In particular, a
 * target may only be activated after the source confirmation/cleanup and its
 * own admission checks have completed for the same transition token.
 */
export type WorkspaceKind = 'runtime' | 'mapping' | 'measurement' | 'review';
export type WorkspaceTransitionPhase = 'idle' | 'awaiting-source-confirmation' | 'preparing-target';

export type WorkspaceTransition = {
  token: number;
  source: WorkspaceKind;
  target: Exclude<WorkspaceKind, 'runtime'>;
  phase: WorkspaceTransitionPhase;
};

export type WorkspaceTransitionSnapshot = {
  active: WorkspaceKind;
  phase: WorkspaceTransitionPhase;
  pending: WorkspaceTransition | null;
};

export class WorkspaceTransitionCoordinator {
  private active: WorkspaceKind = 'runtime';
  private phase: WorkspaceTransitionPhase = 'idle';
  private pending: WorkspaceTransition | null = null;
  private nextToken = 0;

  snapshot(): WorkspaceTransitionSnapshot {
    return { active: this.active, phase: this.phase, pending: this.pending ? { ...this.pending } : null };
  }

  request(target: Exclude<WorkspaceKind, 'runtime'>): WorkspaceTransition | null {
    if (this.phase !== 'idle') return null;
    if (this.active === target) return { token: 0, source: target, target, phase: 'idle' };
    const phase: WorkspaceTransitionPhase = this.active === 'runtime'
      ? 'preparing-target'
      : 'awaiting-source-confirmation';
    const pending: WorkspaceTransition = {
      token: ++this.nextToken,
      source: this.active,
      target,
      phase,
    };
    this.phase = phase;
    this.pending = pending;
    return { ...pending };
  }

  confirmSourceCleared(token: number): boolean {
    if (!this.isPending(token) || this.phase !== 'awaiting-source-confirmation') return false;
    this.phase = 'preparing-target';
    this.pending = { ...this.pending!, phase: 'preparing-target' };
    return true;
  }

  cancel(token: number): boolean {
    if (!this.isPending(token)) return false;
    this.phase = 'idle';
    this.pending = null;
    return true;
  }

  activateTarget(token: number): boolean {
    if (!this.isPending(token) || this.phase !== 'preparing-target') return false;
    this.active = this.pending!.target;
    this.phase = 'idle';
    this.pending = null;
    return true;
  }

  failTarget(token: number): boolean {
    if (!this.isPending(token)) return false;
    this.active = 'runtime';
    this.phase = 'idle';
    this.pending = null;
    return true;
  }

  /** Records a normal user close without accepting a late event from another workspace. */
  reportInactive(workspace: Exclude<WorkspaceKind, 'runtime'>): boolean {
    if (this.phase !== 'idle' || this.active !== workspace) return false;
    this.active = 'runtime';
    return true;
  }

  private isPending(token: number): boolean {
    return Boolean(this.pending && this.pending.token === token);
  }
}
