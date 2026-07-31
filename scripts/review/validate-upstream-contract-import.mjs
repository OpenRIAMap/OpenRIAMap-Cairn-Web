import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const lock = JSON.parse(fs.readFileSync(path.join(root, '.cairn/upstream.lock.json'), 'utf8'));
const impact = JSON.parse(fs.readFileSync(path.join(root, '.cairn/downstream-impact.json'), 'utf8'));
const compatibility = JSON.parse(fs.readFileSync(path.join(root, '.cairn/compatibility.json'), 'utf8'));
const candidatePath = path.join(root, '.cairn/upstream-candidate.json');
const candidate = fs.existsSync(candidatePath) ? JSON.parse(fs.readFileSync(candidatePath, 'utf8')) : null;
const errors = [];
const stableContractVersionsMatch = lock.contractVersion === impact.contractVersion && lock.contractVersion === compatibility.reviewWorkflow.contractVersion;
const validLocalCandidate = candidate?.schemaVersion === 'cairn.upstream-candidate.v1'
  && candidate.status === 'local-unmerged'
  && candidate.baseLockedCommit === lock.commit
  && /^[0-9a-f]{40}$/.test(candidate.candidateCommit ?? '')
  && candidate.contractVersion === impact.contractVersion
  && lock.contractVersion === compatibility.reviewWorkflow.contractVersion;
if (!stableContractVersionsMatch && !validLocalCandidate) errors.push('contract versions are inconsistent');
if (candidate && !validLocalCandidate) errors.push('upstream candidate overlay is invalid');
if (!/^[0-9a-f]{40}$/.test(lock.commit)) errors.push('upstream lock must contain an immutable commit');
if (!compatibility.reviewWorkflow.localStatusIsNotFormalApproval) errors.push('local approval isolation is required');
if (errors.length) { console.error('Upstream contract import: FAIL'); errors.forEach((error) => console.error(`- ${error}`)); process.exitCode = 1; }
else console.log('Upstream contract import: PASS');
