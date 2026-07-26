# CM_REVIEW_SUBMISSION_CONTRACTS_2

## Scope

Additive, UI-neutral Review contracts for a logical submission with immutable revisions, version-targeted package events, optimistic concurrency, and an application-owned control adapter.

## Included

- `ReviewSubmissionSnapshot`, `ReviewPackageRevision`, event and release-feed types;
- package-level lifecycle and action guards;
- state-version and revision-targeted idempotency helpers;
- `ReviewSubmissionAdapter` port;
- downstream-impact v2 declaration and contract test coverage.

## Excluded

- no `.tsx` edits, button binding, panel restyling, MapContainer, Mapping, or temporary-layer behavior changes;
- no RIA profile, repository, domain, COS, GitHub, SCF, pipeline, credential, or production-approval implementation;
- no browser-side authorization or direct external-service access.
