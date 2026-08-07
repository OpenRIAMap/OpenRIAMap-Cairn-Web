import {
  createDataSourceSelectionController,
  createDataSourceSelectionFailure,
  isDataSourceSelectionAllowed,
  parseDataSourceSelectionConfig,
  validateDataSourceSelectionConfig,
  type DataSourceSelectionStorage,
} from '../../src/core/dataSourceSelection';

class MemoryStorage implements DataSourceSelectionStorage {
  private readonly values = new Map<string, string>();

  read(storageKey: string): string | null {
    return this.values.get(storageKey) ?? null;
  }

  write(storageKey: string, value: string): void {
    this.values.set(storageKey, value);
  }
}

function expect(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

async function expectReject(action: () => Promise<unknown>, fragment: string): Promise<void> {
  try {
    await action();
  } catch (error) {
    expect(String((error as Error).message).includes(fragment), `expected error fragment: ${fragment}`);
    return;
  }
  throw new Error(`expected rejection: ${fragment}`);
}

const sources = [
  { id: 'primary', label: 'Primary source', readerKind: 'release-v2' },
  { id: 'alternate', label: 'Alternate source', readerKind: 'release-v2' },
] as const;

const userSelectOnFailurePolicy = {
  defaultSourceId: 'primary',
  selectionMode: 'user-select-on-failure' as const,
  requireExplicitApply: true,
  automaticFallback: false as const,
  clearCacheOnApply: 'source-dependent' as const,
  retryOnFailure: true,
};

validateDataSourceSelectionConfig(sources, userSelectOnFailurePolicy);
expect(!isDataSourceSelectionAllowed(userSelectOnFailurePolicy, 'settings'), 'failure-only policy unexpectedly allows settings selection');
expect(isDataSourceSelectionAllowed(userSelectOnFailurePolicy, 'failure'), 'failure-only policy did not allow recovery selection');

const parsedConfig = parseDataSourceSelectionConfig({
  schemaVersion: 'cairnmap.data-source-selection.v1',
  storageKey: 'test-selection',
  sources,
  policy: userSelectOnFailurePolicy,
});
expect(parsedConfig.sources.length === 2 && parsedConfig.policy.defaultSourceId === 'primary', 'config parser mismatch');
try {
  parseDataSourceSelectionConfig({ ...parsedConfig, policy: { ...parsedConfig.policy, automaticFallback: true } });
  throw new Error('automatic fallback config unexpectedly parsed');
} catch (error) {
  expect(String((error as Error).message).includes('automaticFallback-must-be-false'), 'invalid config error mismatch');
}

const storage = new MemoryStorage();
const controller = createDataSourceSelectionController({
  sources,
  policy: userSelectOnFailurePolicy,
  storage,
  storageKey: 'test-selection',
});
const calls: string[] = [];
const switchPort = {
  abortStaleLoads: () => calls.push('abort'),
  clearSourceDependentCache: () => calls.push('cache'),
  clearInMemoryDatasets: () => calls.push('memory'),
  reloadCurrentWorld: () => calls.push('reload'),
};

await expectReject(() => controller.apply('alternate', 'settings', switchPort), 'selection-not-allowed:settings');
expect(controller.getState().sourceId === 'primary', 'blocked selection changed the active source');

const applied = await controller.apply('alternate', 'failure', switchPort);
expect(applied.previousSourceId === 'primary', 'previous source mismatch');
expect(applied.state.sourceId === 'alternate' && applied.state.generation === 1, 'applied state mismatch');
expect(calls.join(',') === 'abort,cache,memory,reload', 'switch lifecycle order mismatch');
expect(storage.read('test-selection')?.includes('alternate'), 'selection was not persisted');

const failure = createDataSourceSelectionFailure({ sourceId: 'alternate', stage: 'chunk', message: 'request timed out', worldId: 'world-a' });
expect(failure.sourceId === 'alternate' && failure.stage === 'chunk' && failure.retryAllowed, 'failure model mismatch');

const fixedStorage = new MemoryStorage();
const fixedController = createDataSourceSelectionController({
  sources,
  policy: { ...userSelectOnFailurePolicy, selectionMode: 'fixed' },
  storage: fixedStorage,
  storageKey: 'fixed-selection',
});
await expectReject(() => fixedController.apply('alternate', 'failure', switchPort), 'selection-not-allowed:failure');
expect(fixedController.getState().sourceId === 'primary', 'fixed policy changed active source');

console.log('Data source selection contract test: PASS');
