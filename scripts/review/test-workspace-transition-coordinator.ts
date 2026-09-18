import assert from 'node:assert/strict';
import test from 'node:test';

import { WorkspaceTransitionCoordinator, type WorkspaceKind } from '../../src/components/Map/workspaceTransitionCoordinator';

const authoringWorkspaces: Exclude<WorkspaceKind, 'runtime'>[] = ['mapping', 'measurement', 'review'];

function enter(coordinator: WorkspaceTransitionCoordinator, target: Exclude<WorkspaceKind, 'runtime'>) {
  const transition = coordinator.request(target);
  assert.ok(transition);
  assert.notEqual(transition.token, 0);
  if (transition.source !== 'runtime') assert.equal(coordinator.confirmSourceCleared(transition.token), true);
  assert.equal(coordinator.activateTarget(transition.token), true);
}

test('all six directed authoring transitions are gated before target activation', () => {
  for (const source of authoringWorkspaces) {
    for (const target of authoringWorkspaces) {
      if (source === target) continue;
      const coordinator = new WorkspaceTransitionCoordinator();
      enter(coordinator, source);
      const transition = coordinator.request(target);
      assert.ok(transition, `${source} -> ${target} should start`);
      assert.equal(transition.source, source);
      assert.equal(transition.phase, 'awaiting-source-confirmation');
      assert.equal(coordinator.snapshot().active, source, 'target cannot become active before confirmation');
      assert.equal(coordinator.confirmSourceCleared(transition.token), true);
      assert.equal(coordinator.snapshot().active, source, 'cleanup itself cannot mount the target');
      assert.equal(coordinator.activateTarget(transition.token), true);
      assert.equal(coordinator.snapshot().active, target);
    }
  }
});

test('cancelling a source confirmation preserves the original workspace', () => {
  const coordinator = new WorkspaceTransitionCoordinator();
  enter(coordinator, 'mapping');
  const transition = coordinator.request('review');
  assert.ok(transition);
  assert.equal(coordinator.cancel(transition.token), true);
  assert.equal(coordinator.snapshot().active, 'mapping');
  assert.equal(coordinator.snapshot().phase, 'idle');
});

test('failed target admission ends at runtime and stale source events are ignored', () => {
  const coordinator = new WorkspaceTransitionCoordinator();
  enter(coordinator, 'review');
  const transition = coordinator.request('measurement');
  assert.ok(transition);
  assert.equal(coordinator.confirmSourceCleared(transition.token), true);
  assert.equal(coordinator.failTarget(transition.token), true);
  assert.equal(coordinator.snapshot().active, 'runtime');
  assert.equal(coordinator.reportInactive('review'), false);
  assert.equal(coordinator.snapshot().active, 'runtime');
});

test('a second click cannot race an active transition', () => {
  const coordinator = new WorkspaceTransitionCoordinator();
  enter(coordinator, 'measurement');
  const first = coordinator.request('mapping');
  assert.ok(first);
  assert.equal(coordinator.request('review'), null);
  assert.equal(coordinator.confirmSourceCleared(first.token), true);
  assert.equal(coordinator.activateTarget(first.token), true);
  assert.equal(coordinator.snapshot().active, 'mapping');
});

test('re-clicking an active entry is a local toggle and never starts a transition', () => {
  const coordinator = new WorkspaceTransitionCoordinator();
  enter(coordinator, 'mapping');
  const reClick = coordinator.request('mapping');
  assert.ok(reClick);
  assert.equal(reClick.token, 0);
  assert.equal(reClick.source, 'mapping');
  assert.equal(coordinator.snapshot().active, 'mapping');
  assert.equal(coordinator.snapshot().phase, 'idle');
  assert.equal(coordinator.snapshot().pending, null);
});

console.log('Workspace transition coordinator test: PASS');
