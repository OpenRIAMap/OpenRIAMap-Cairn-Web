import assert from 'node:assert/strict';
import { nextPlayerPollDelayMs } from '../../src/lib/playerPollingPolicy';

assert.equal(nextPlayerPollDelayMs(0), 5_000);
assert.equal(nextPlayerPollDelayMs(2), 5_000);
assert.equal(nextPlayerPollDelayMs(3), 10_000);
assert.equal(nextPlayerPollDelayMs(4), 20_000);
assert.equal(nextPlayerPollDelayMs(99), 60_000);

console.log('Player polling policy test: PASS');
