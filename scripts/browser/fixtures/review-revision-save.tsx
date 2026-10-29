// Isolated fixture: the real panel, with in-memory service ports and no network.
import React from 'react';
import { createRoot } from 'react-dom/client';
import '../../../src/styles/index.css';
import { ReviewStatusBoardPanel } from '../../../src/components/Review/ReviewStatusBoardPanel';

const scenario = new URLSearchParams(location.search).get('scenario') ?? 'local-revision';
const actor = { principalId: 'reviewer-test', roles: ['maintainer'] };
const entry = { submissionId: 'test-submission', state: 'approved', decisionRevisionId: 'r1', decisionAction: 'approve', updatedAt: '2026-10-30T00:00:00Z', updatedBy: actor };
let remote: any = { schemaVersion: 'cairn.review-status-board.v1', boardVersion: 7, entries: [entry], updatedAt: entry.updatedAt };
let reads = 0;
const result = document.createElement('output'); result.id = 'save-result'; document.body.append(result);
const submission: any = { submissionId: entry.submissionId, state: 'pending', packageName: 'Revision regression', currentRevisionId: 'r2', revisions: ['r1', 'r2'].map(revisionId => ({ revisionId, createdAt: entry.updatedAt, package: { featureCount: 1, deleteCount: revisionId === 'r2' ? 1 : 0, pictureCount: 0 } })) };
const adapter: any = {
  listSubmissions: async () => [submission],
  getStatusBoard: async () => {
    reads++;
    if (reads === 2 && scenario === 'remote-revision') remote = { ...remote, boardVersion: 8, entries: [{ ...entry, decisionRevisionId: 'r3' }] };
    if (reads === 2 && scenario === 'remote-state') remote = { ...remote, boardVersion: 8, entries: [{ ...entry, state: 'pending', decisionAction: 'reopen' }] };
    return structuredClone(remote);
  },
  saveStatusBoard: async (request: any) => {
    if (scenario === 'version-race') remote.boardVersion++;
    if (request.expectedBoardVersion !== remote.boardVersion) throw Error('fixture-board-version-conflict');
    if (request.entries[0].decisionRevisionId !== 'r2') throw Error('fixture-new-revision-lost');
    remote = { ...remote, boardVersion: remote.boardVersion + 1, entries: structuredClone(request.entries) };
    result.textContent = JSON.stringify({ revision: remote.entries[0].decisionRevisionId, expectedBoardVersion: request.expectedBoardVersion });
    return { board: structuredClone(remote), accepted: true, differences: [] };
  },
};
const auth: any = { getSession: async () => ({ status: 'authenticated', ...actor }) };
const releaseControl: any = { getReleaseGate: async () => ({ state: 'idle', gateVersion: 1 }) };
createRoot(document.getElementById('root')!).render(<ReviewStatusBoardPanel auth={auth} submissionAdapter={adapter} releaseControl={releaseControl}
  onDownloadRevision={() => {}} onLoadRevision={() => {}} onLocalPrecheck={() => ({ decision: 'ready' }) as any} isRevisionCached={() => true} onClose={() => {}} />);
