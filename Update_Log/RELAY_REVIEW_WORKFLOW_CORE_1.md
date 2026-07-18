# RELAY_REVIEW_WORKFLOW_CORE_1

## Objective

Introduce the repository-side RelayPackage review workflow core by combining review status protocol, inbox layout contract, and optional precheck/accept status synchronization.

## Changed Files

- Added `scripts/review/relay-review-status-tools.mjs`
- Added `scripts/review/init-relay-review-status.mjs`
- Added `scripts/review/update-relay-review-status.mjs`
- Added `scripts/review/validate-relay-review-status.mjs`
- Added `scripts/review/list-relay-review-inbox.mjs`
- Added `scripts/review/sync-relay-review-report.mjs`
- Added `project-config/schemas/relay/cairnmap.relay-review-status.v1.schema.json`
- Added `project-config/schemas/relay/cairnmap.relay-review-inbox.v1.schema.json`
- Added `project-config/packages/openriamap-ria/environment/relayReviewWorkflow.json`
- Added `docs/30_data-contracts/RelayReviewStatusContract.md`
- Added `docs/30_data-contracts/RelayReviewInboxLayout.md`
- Added `docs/40_maintenance/RelayReviewWorkflowGuide.md`
- Added `docs/30_data-contracts/examples/relay-review-workflow-sample/`
- Updated `scripts/actions/native-relay-precheck.mjs`
- Updated `scripts/actions/native-relay-precheck-tools.mjs`
- Updated `scripts/actions/native-relay-accept.mjs`
- Updated `scripts/actions/native-relay-accept-tools.mjs`
- Updated `.github/workflows/native-relay-precheck.yml`
- Updated `.github/workflows/native-relay-accept.yml`
- Updated `package.json`

## Behavior Before

Precheck and accept actions produced reports but there was no standard repository-side review-status sidecar, no formal RelayPackages inbox layout, and no optional linkage between action reports and review state.

## Behavior After

The repository now has a review workflow core:

- `review-status.json` records package status.
- `RelayPackages/{pending,prechecked,accepted,rejected,failed,archived}` is documented as the standard review inbox layout.
- Precheck and accept actions can optionally update a review-status sidecar when `--update-review-status` and `--review-status-path` are explicitly supplied.
- New review scripts initialize, update, validate, list, and sync review workflow artifacts.

## Compatibility Notes

This patch does not add Admin UI, does not automatically move packages between inbox buckets, does not merge or deploy data, and does not change the default safety behavior of precheck or accept actions. Status writes are opt-in only.

## Validation

Expected validation commands:

```text
npm run validate:project-config
npm run audit:project-config
npm run inspect:project-config
npm run validate:storage-profiles
npm run validate:feature-data-contract
npm run validate:native-relay-package
npm run validate:native-relay-config-resolver
npm run validate:media-index-contract
npm run compare:native-relay-package
npm run dry-run:native-relay-apply
npm run apply:native-relay-package
npm run build:feature-merge-full
npm run verify:feature-merge-full
npm run build:media-index-full
npm run verify:media-index-full
npm run run:native-relay-local-pipeline
npm run action:native-relay-precheck
npm run action:native-relay-accept
npm run validate:native-relay-accept-guards
npm run init:relay-review-status
npm run update:relay-review-status
npm run validate:relay-review-status
npm run list:relay-review-inbox
npm run sync:relay-review-report
npx tsc -b
```

## Rollback Notes

Remove the added review scripts, schemas, docs, sample inbox, package scripts, and optional review-status arguments from precheck/accept actions.

## Handoff Note

This patch prepares the backend review workflow for later Admin UI work. The next logical patch can be a read-only Admin review module or a review-flow enhancement that explicitly moves/copies packages between review buckets.
