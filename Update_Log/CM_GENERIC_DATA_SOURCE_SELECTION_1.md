# CM_GENERIC_DATA_SOURCE_SELECTION_1

## Scope

Adds a generic, application-owned data-source selection framework. It is additive: no existing Mapping, Review, Workbench, case-template configuration, source-link mode, or button binding is modified.

## Added

- Machine-readable selection configuration parser with policy validation.
- Persistent explicit source selection with a monotonic generation per apply.
- Application-owned switch port lifecycle: abort stale reads, clear scoped cache, clear in-memory data, then reload the active world.
- Structured failure model for selection, pointer, manifest, chunk, media-index and network load stages.
- Style-preserving Settings selection section and blocking failure-recovery dialog built from existing UI primitives.
- Contract test and downstream-impact requirements for an application-owned data-source reader adapter.

## Safety rules

- The controller rejects automatic fallback.
- A failed request never changes the selected source by itself.
- A source change must be explicit; cancellation does not retry or switch.
- Applications must scope source-dependent caches by source identifier, release identifier, world identifier and reader schema version, and must not merge results from distinct sources in one load snapshot.

## Exclusions

No application profile, endpoint, repository identity, provider service, credential, deployment binding, data reader implementation, cloud access, Review UI change, MapContainer change, or button binding is included.

## Verification

- `npm run test:data-source-selection`
- `npm run test:review-workspace-contracts`
- `npm run validate:review-contract-boundary`
- `npm run validate:case-template`
- `npm run validate:project-config`
- `npm run build`

All passed locally. The existing bundle-size and dynamic-import warnings remain visible. `npm run lint` remains unavailable because the repository has no ESLint flat-config file while the locked ESLint major version requires one; no lint configuration was changed in this candidate.
