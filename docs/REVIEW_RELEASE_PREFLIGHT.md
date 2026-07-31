# Review Release Preflight Contract

`ReviewReleasePreflightCore` is a pure, UI-neutral comparison between a
candidate revision delta and an application-supplied current release snapshot.
It does not read a ZIP file, network location, repository, bucket, credential,
or deployment service.

## Provider boundary

An application implements `ReviewReleasePreflightPort` and
`ReviewReleaseSnapshotProvider`. The core receives only:

- immutable package identity and byte/hash attestation;
- candidate upserts and deletes;
- a point-in-time current release snapshot containing feature identities and,
  when available, content hashes.

The browser may use this core for immediate feedback. A trusted application
adapter must run the same comparison against an authoritative snapshot before
it authorizes a release. A worker must re-run it before changing a current
pointer.

## Outcomes

- `blocked`: invalid input, duplicate identities, an absent delete target, an
  ambiguous delete target, or an invalid current snapshot.
- `warning-confirmation-required`: a changed base release, an existing upsert
  target, a valid destructive delete, missing source fingerprints, or overlap
  with another selected candidate.
- `ready`: no blocker or confirmation-worthy warning.

A changed release alone is never a blocker. Delete target resolution uses
`(worldId, classCode, featureId)`; a delete which supplies only an ID is
blocked if the current snapshot contains more than one matching target.

## Release Gate

`ReviewReleaseGateSnapshot` models a provider-owned, durable single-flight
release lease. It is intentionally a contract only: core UI code must not
implement a process-local lock or assume a deployment provider.
