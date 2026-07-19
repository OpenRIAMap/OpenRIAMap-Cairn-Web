import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const lock = JSON.parse(fs.readFileSync(path.join(root, '.cairn/upstream.lock.json'), 'utf8'));
const impact = JSON.parse(fs.readFileSync(path.join(root, '.cairn/downstream-impact.json'), 'utf8'));
const compatibility = JSON.parse(fs.readFileSync(path.join(root, '.cairn/compatibility.json'), 'utf8'));
const errors = [];
if (lock.contractVersion !== impact.contractVersion || lock.contractVersion !== compatibility.reviewWorkflow.contractVersion) errors.push('contract versions are inconsistent');
if (!/^[0-9a-f]{40}$/.test(lock.commit)) errors.push('upstream lock must contain an immutable commit');
if (!compatibility.reviewWorkflow.localStatusIsNotFormalApproval) errors.push('local approval isolation is required');
if (errors.length) { console.error('Upstream contract import: FAIL'); errors.forEach((error) => console.error(`- ${error}`)); process.exitCode = 1; }
else console.log('Upstream contract import: PASS');
