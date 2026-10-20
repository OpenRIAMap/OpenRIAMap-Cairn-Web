import assert from 'node:assert/strict';
import fs from 'node:fs';
import { featureDraftScope, type StudioEditingSession } from '../../src/configStudio/studioSession';
import { migrateConfigToR12 } from '../../src/configStudio/r12Migration';
import type { ConfigPackageV3 } from '../../src/configStudio/types';

const baseline = JSON.parse(fs.readFileSync('src/configStudio/defaults/r11-r7.config.json', 'utf8')) as ConfigPackageV3;
const draft = migrateConfigToR12(baseline).config;
const session: StudioEditingSession = { baseline, draft, tree: null, selectedId: '', editing: true };

assert.equal(featureDraftScope(session), 'package', 'the previously stranded migration session must recover without a selected category');
assert.equal(featureDraftScope({ ...session, selectedId: draft.nodes[0].nodeId }), 'package', 'reviewing a category must not turn a whole-package migration into a category transaction');
assert.equal(featureDraftScope({ ...session, draftScope: 'package' }), 'package', 'new whole-package sessions preserve their explicit scope');
assert.equal(featureDraftScope({ ...session, baseline: draft, selectedId: 'missing-category' }), 'package', 'an isolated whole-package import without a resolvable selection must retain an exit');
assert.equal(featureDraftScope({ ...session, baseline: draft, selectedId: draft.nodes[0].nodeId }), 'category', 'ordinary category drafts must retain their category scope');
assert.equal(featureDraftScope({ ...session, tree: { baseline, staged: draft, classCode: baseline.nodes[0].path.class, changes: [] } }), 'category', 'a Class-tree edit keeps its existing inner/outer transaction controls');
assert.equal(featureDraftScope(undefined), 'category');
assert.equal(baseline.contractRevision, 11, 'scope recovery does not activate or mutate the saved baseline');
assert.equal(draft.contractRevision, 12);
console.log('r12 Studio session recovery: 7 scope cases passed.');
