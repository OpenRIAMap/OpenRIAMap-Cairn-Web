import assert from 'node:assert/strict';
import test from 'node:test';

import { FEATURE_MODULE_DEPENDENCIES, normalizePersistedFeatureModuleState } from '../../src/store/featureModuleStore';

test('review bundle declares the mapping base bundle as its only prerequisite', () => {
  assert.deepEqual(FEATURE_MODULE_DEPENDENCIES.review, ['measuring']);
  assert.deepEqual(FEATURE_MODULE_DEPENDENCIES.measuring, []);
  assert.deepEqual(FEATURE_MODULE_DEPENDENCIES.legacy, []);
});

test('a pre-review persisted marker migrates without changing existing mapping or legacy choices', () => {
  const migrated = normalizePersistedFeatureModuleState(JSON.stringify({
    appVersion: '0.1.0',
    modules: {
      measuring: { enabledByUser: true, lastLoadedVersion: '0.1.0' },
      legacy: { enabledByUser: true, lastLoadedVersion: '0.1.0' },
    },
  }));
  assert.ok(migrated);
  assert.equal(migrated.modules.measuring.enabledByUser, true);
  assert.equal(migrated.modules.legacy.enabledByUser, true);
  assert.deepEqual(migrated.modules.review, { enabledByUser: false, lastLoadedVersion: null });
});

test('invalid persistence fails closed', () => {
  assert.equal(normalizePersistedFeatureModuleState('{not-json'), null);
  assert.equal(normalizePersistedFeatureModuleState(null), null);
});

console.log('Feature module contract test: PASS');
