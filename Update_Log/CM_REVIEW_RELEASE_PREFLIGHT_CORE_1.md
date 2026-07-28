# CM_REVIEW_RELEASE_PREFLIGHT_CORE_1

## 2026-07-29 follow-up

- Added the generic `BATCH_DELETE_TARGET_OVERLAP` blocker. Two selected
  packages that delete the same current feature are now stopped during review,
  before a second delete could reach an external Worker.
- This remains a pure generic contract change; it adds no RIA profile,
  provider, repository, endpoint, credential, UI, or button-binding coupling.

## Scope

Adds generic, non-UI review-release preflight contracts and a deterministic
pure comparison core. The change preserves the existing Review Workbench,
Mapping module, temporary-layer behavior, dirty guard, Relay reader and
application-owned adapters.

## Added capabilities

- Provider-neutral current-release snapshot and preflight port contracts.
- Structured blocker/warning findings for delete resolution, same-ID overwrite,
  base release drift, missing fingerprints and selected-batch overlap.
- Generic release Gate snapshot contract for an application-owned durable
  single-flight publisher.
- Stable report serialisation for an adapter-owned report hash.

## Exclusions

No application profile, storage service, repository, endpoint, credential,
deployment provider, formal production approval, UI button binding, `.tsx`
layout change, or browser-to-private-service path is included.

## Verification

- `npm run test:review-workspace-contracts`
- `npm run validate:review-contract-boundary`
- `npm run build`

All passed locally. The existing Vite bundle-size and dynamic-import warnings
remain visible and are unrelated to this change.
