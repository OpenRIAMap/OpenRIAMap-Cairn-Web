import {
  parseReviewPackageBlob,
  validateParsedReviewPackage,
} from '../../src/components/Review/package';
import { OPENRIAMAP_RIA_RELAY_PROFILE } from '../../src/components/Mapping/core/openriamapRiaRelayProfile';
import { buildRelayPackageZip } from '../../src/components/Mapping/core/relayPackageSerializer';
import { createEmptyRelayPackageDraft } from '../../src/components/Mapping/core/relayPackageDraft';
import { openriamapReviewSubmissionTransport } from '../../src/components/Review/openriamapReviewSubmissionTransport';

const draft = createEmptyRelayPackageDraft();
draft.meta.packageVersion = 'submission-test';
draft.deleteMarks = [{ ID: 'old-feature', Name: 'Old feature', worldId: 'zth', classCode: 'BUD' }];
const blob = await buildRelayPackageZip({
  currentWorldId: 'zth',
  operator: 'tester',
  note: 'RIA profile contract test',
  draft,
  layers: [{
    id: 1,
    mode: 'point',
    color: '#fff',
    coords: [],
    visible: true,
    jsonInfo: { subType: 'BUD', featureInfo: { ID: 'new-feature', Class: 'BUD', World: 'zth', Name: 'New feature' } },
  }],
});
const parsed = await parseReviewPackageBlob(blob, OPENRIAMAP_RIA_RELAY_PROFILE);
const strict = validateParsedReviewPackage(parsed, OPENRIAMAP_RIA_RELAY_PROFILE, 'strict-submission');
if (!strict.valid || !parsed.paths.includes('Review.json') || !parsed.paths.includes('Data_Spilt/zth/BUD/new-feature.json')) {
  throw new Error(`RIA profile package contract failed: ${strict.errors.map((entry) => entry.code).join(',')}`);
}
if (parsed.reviewMarker?.status !== 'pending' || parsed.reviewMarker?.submissionMode !== 'review-submission-v2') throw new Error('RIA review marker is not pending-only');

const originalFetch = globalThis.fetch;
const calls: Array<{ input: string; init?: RequestInit }> = [];
globalThis.fetch = (async (input: URL | RequestInfo, init?: RequestInit) => {
  calls.push({ input: String(input), init });
  if (String(input) === '/api/review-control') {
    const body = JSON.parse(String(init?.body));
    if (body.operation === 'revision-upload-request') {
      return new Response(JSON.stringify({ accepted: true, upload: { method: 'PUT', url: 'https://example.invalid/upload', headers: { 'Content-MD5': 'XUFAKrxLKna5cZ2REBfFkg==' }, key: 'RelayPackages/submissions/s/r.zip', expiresInSeconds: 60 } }), { status: 200 });
    }
    return new Response(JSON.stringify({ accepted: true, submission: { submissionId: 'submission-test' } }), { status: 200 });
  }
  return new Response(null, { status: 200 });
}) as typeof fetch;
try {
  const request = {
    submissionId: 'submission-test', revisionId: 'submission-test-r1', requestId: 'request-test', correlationId: 'correlation-test', idempotencyKey: 'submission-test:revision:upload',
    byteLength: 22, sha256: 'a'.repeat(64), contentMd5: 'XUFAKrxLKna5cZ2REBfFkg==', packageName: 'test.zip', expectedStateVersion: 0,
  };
  const grant = await openriamapReviewSubmissionTransport.requestRevisionUpload(request);
  await openriamapReviewSubmissionTransport.uploadRevision(grant, new Blob(['test']));
  const completed = await openriamapReviewSubmissionTransport.completeRevisionUpload(request);
  if (!completed.accepted || calls.filter((call) => call.input === '/api/review-control').length !== 2 || !calls.some((call) => call.input === 'https://example.invalid/upload')) throw new Error('RIA transport mapping failed');
} finally {
  globalThis.fetch = originalFetch;
}

console.log('Review package profile and auth seam test: PASS');
