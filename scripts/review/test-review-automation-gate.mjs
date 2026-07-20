import assert from 'node:assert/strict';
import { requireReviewAutomation, reviewAutomationEnabled } from '../../api/_reviewAutomation.mjs';

function response() {
  return {
    statusCode: null,
    payload: null,
    status(value) { this.statusCode = value; return this; },
    json(value) { this.payload = value; return this; },
  };
}

assert.equal(reviewAutomationEnabled({}), false);
assert.equal(reviewAutomationEnabled({ CAIRN_REVIEW_AUTOMATION_ENABLED: 'false' }), false);
assert.equal(reviewAutomationEnabled({ CAIRN_REVIEW_AUTOMATION_ENABLED: 'true' }), true);
const blocked = response();
assert.equal(requireReviewAutomation(blocked, {}), false);
assert.equal(blocked.statusCode, 503);
assert.deepEqual(blocked.payload, { error: 'review-automation-disabled' });
const allowed = response();
assert.equal(requireReviewAutomation(allowed, { CAIRN_REVIEW_AUTOMATION_ENABLED: 'true' }), true);
assert.equal(allowed.statusCode, null);
console.log('Review automation gate: PASS');
