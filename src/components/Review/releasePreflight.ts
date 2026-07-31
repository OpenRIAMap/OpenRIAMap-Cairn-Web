import type {
  ReviewPreflightFinding,
  ReviewPreflightFindingCode,
  ReviewReleaseCandidate,
  ReviewReleaseFeatureReference,
  ReviewReleasePreflightReport,
  ReviewReleasePreflightRequest,
} from './contracts';

const SAFE_SEGMENT = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/;

function keyOf(feature: Pick<ReviewReleaseFeatureReference, 'worldId' | 'classCode' | 'featureId'>): string {
  return `${feature.worldId}\u0000${feature.classCode}\u0000${feature.featureId}`;
}

function compareFeature(left: ReviewReleaseFeatureReference, right: ReviewReleaseFeatureReference): number {
  return keyOf(left).localeCompare(keyOf(right));
}

function validFeature(feature: ReviewReleaseFeatureReference): boolean {
  return SAFE_SEGMENT.test(feature.worldId)
    && SAFE_SEGMENT.test(feature.classCode)
    && SAFE_SEGMENT.test(feature.featureId);
}

function finding(
  code: ReviewPreflightFindingCode,
  severity: ReviewPreflightFinding['severity'],
  message: string,
  target?: ReviewPreflightFinding['target'],
): ReviewPreflightFinding {
  return { code, severity, message, ...(target ? { target } : {}) };
}

function candidateKeySet(candidate: ReviewReleaseCandidate): Set<string> {
  return new Set(candidate.upserts.map(keyOf));
}

function findDeleteTargets(
  features: readonly ReviewReleaseFeatureReference[],
  deletion: ReviewReleaseCandidate['deletes'][number],
): ReviewReleaseFeatureReference[] {
  return features.filter((feature) => feature.featureId === deletion.featureId
    && (!deletion.worldId || feature.worldId === deletion.worldId)
    && (!deletion.classCode || feature.classCode === deletion.classCode));
}

/**
 * Pure, deterministic review-release preflight. It deliberately accepts a
 * provider-supplied release snapshot instead of reading any data source. The
 * application adapter decides how that snapshot is obtained.
 */
export function preflightReviewRelease(request: ReviewReleasePreflightRequest): ReviewReleasePreflightReport {
  const findings: ReviewPreflightFinding[] = [];
  const { candidate, snapshot } = request;
  const snapshotFeatures = [...snapshot.features].sort(compareFeature);
  const snapshotIndex = new Map<string, ReviewReleaseFeatureReference>();

  for (const feature of snapshotFeatures) {
    if (!validFeature(feature)) {
      findings.push(finding('SOURCE_SNAPSHOT_UNAVAILABLE', 'blocker', 'The release snapshot contains an invalid feature identity.'));
      continue;
    }
    const key = keyOf(feature);
    if (snapshotIndex.has(key)) findings.push(finding('SOURCE_SNAPSHOT_UNAVAILABLE', 'blocker', 'The release snapshot contains duplicate feature identities.', feature));
    else snapshotIndex.set(key, feature);
  }

  if (candidate.baseReleaseId && candidate.baseReleaseId !== snapshot.releaseId) {
    findings.push(finding('BASE_RELEASE_CHANGED', 'warning', 'The package was prepared against a different release. It will be evaluated against the current snapshot.'));
  }

  const seenUpserts = new Set<string>();
  for (const upsert of [...candidate.upserts].sort(compareFeature)) {
    if (!validFeature(upsert)) {
      findings.push(finding('PACKAGE_INVALID', 'blocker', 'An upsert has an invalid feature identity.', upsert));
      continue;
    }
    const key = keyOf(upsert);
    if (seenUpserts.has(key)) {
      findings.push(finding('UPSERT_DUPLICATE', 'blocker', 'The package contains duplicate upserts for one feature identity.', upsert));
      continue;
    }
    seenUpserts.add(key);
    const current = snapshotIndex.get(key);
    if (current) {
      findings.push(finding('UPSERT_OVERWRITES_CURRENT', 'warning', 'This upsert will overwrite the current feature with the same world, class, and ID.', upsert));
      if (!current.contentSha256 || !upsert.contentSha256) findings.push(finding('SOURCE_FINGERPRINT_UNAVAILABLE', 'warning', 'The current or candidate feature lacks a content fingerprint, so a potential overwrite cannot be compared exactly.', upsert));
    }
  }

  const deleteKeys = new Set<string>();
  for (const deletion of candidate.deletes) {
    if (!SAFE_SEGMENT.test(deletion.featureId)
      || (deletion.worldId !== undefined && !SAFE_SEGMENT.test(deletion.worldId))
      || (deletion.classCode !== undefined && !SAFE_SEGMENT.test(deletion.classCode))) {
      findings.push(finding('PACKAGE_INVALID', 'blocker', 'A delete entry has an invalid feature identity.', deletion));
      continue;
    }
    const matches = findDeleteTargets(snapshotFeatures, deletion);
    if (matches.length === 0) {
      findings.push(finding('DELETE_TARGET_MISSING', 'blocker', 'The delete entry does not resolve to a feature in the current release snapshot.', deletion));
      continue;
    }
    if (matches.length > 1) {
      findings.push(finding('DELETE_TARGET_AMBIGUOUS', 'blocker', 'The delete entry resolves to multiple current features. Specify world and class.', deletion));
      continue;
    }
    const target = matches[0];
    const key = keyOf(target);
    if (deleteKeys.has(key)) findings.push(finding('UPSERT_DUPLICATE', 'blocker', 'The package contains duplicate delete entries for one feature identity.', target));
    else deleteKeys.add(key);
    findings.push(finding('DELETE_EXISTING_TARGET', 'warning', 'This delete entry resolves to an existing current feature and requires confirmation.', target));
  }

  const selectedKeys = candidateKeySet(candidate);
  for (const other of request.selectedCandidates ?? []) {
    for (const otherUpsert of other.upserts) {
      if (selectedKeys.has(keyOf(otherUpsert))) findings.push(finding('BATCH_TARGET_OVERLAP', 'warning', 'Another selected package updates the same feature identity. The release order must be confirmed.', otherUpsert));
    }
    // Two selected packages deleting the same current feature cannot both be
    // applied, regardless of their order. Stop this in review rather than
    // allowing the second delete to reach the Worker as an avoidable failure.
    for (const otherDeletion of other.deletes) {
      const matches = findDeleteTargets(snapshotFeatures, otherDeletion);
      if (matches.length === 1 && deleteKeys.has(keyOf(matches[0]))) {
        findings.push(finding('BATCH_DELETE_TARGET_OVERLAP', 'blocker', 'Another selected package deletes the same current feature. Select or revise only one deletion.', matches[0]));
      }
    }
  }

  const blockers = findings.filter((entry) => entry.severity === 'blocker').length;
  const warnings = findings.filter((entry) => entry.severity === 'warning').length;
  const decision = blockers > 0 ? 'blocked' : warnings > 0 ? 'warning-confirmation-required' : 'ready';
  return {
    schemaVersion: 'cairn.review-release-preflight.v1',
    decision,
    package: request.package,
    source: { snapshotId: snapshot.snapshotId, releaseId: snapshot.releaseId, capturedAt: snapshot.capturedAt },
    findings,
    summary: { created: candidate.upserts.filter((entry) => !snapshotIndex.has(keyOf(entry))).length, updated: candidate.upserts.filter((entry) => snapshotIndex.has(keyOf(entry))).length, deleted: deleteKeys.size, warnings, blockers },
  };
}

/** Stable serialisation for adapter-owned report hashing and confirmation binding. */
export function serializeReviewReleasePreflightReport(report: ReviewReleasePreflightReport): string {
  return JSON.stringify({
    schemaVersion: report.schemaVersion,
    decision: report.decision,
    package: report.package,
    source: report.source,
    findings: [...report.findings].sort((left, right) => `${left.code}:${JSON.stringify(left.target ?? {})}`.localeCompare(`${right.code}:${JSON.stringify(right.target ?? {})}`)),
    summary: report.summary,
  });
}
