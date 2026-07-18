# ACTIONS_RELAY_PRECHECK_1

## Objective

Add a read-only GitHub Actions precheck workflow for Native RelayPackage submissions. The workflow validates a package and runs the local relay pipeline in dry-run mode, then uploads precheck artifacts for review.

## Changed Files

- `.github/workflows/native-relay-precheck.yml`
- `scripts/actions/native-relay-precheck.mjs`
- `scripts/actions/native-relay-precheck-tools.mjs`
- `project-config/schemas/relay/cairnmap.native-relay-precheck-report.v1.schema.json`
- `docs/30_data-contracts/NativeRelayPrecheckActionContract.md`
- `docs/40_maintenance/NativeRelayPrecheckActionGuide.md`
- `package.json`
- `Update_Log/ACTIONS_RELAY_PRECHECK_1.md`

## Behavior Before

Native RelayPackage validation and local dry-run pipeline execution were available as local commands, but there was no dedicated action wrapper or GitHub Actions workflow for precheck artifacts.

## Behavior After

A new command is available:

```text
npm run action:native-relay-precheck
```

The command validates a RelayPackage, runs `run-native-relay-local-pipeline` without `--write`, and writes:

```text
.cairnmap-actions/native-relay-precheck/precheck-report.json
```

A manual GitHub Actions workflow can invoke the same precheck and upload the output directory as an artifact.

## Compatibility Notes

This patch is read-only. It does not write Data_Spilt, Picture, Media_Index_Spilt, Data_Merge, Data_Index, or Media_Index_Merge. It does not create commits, PRs, merges, or deployments.

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
npx tsc -b
```

## Rollback Notes

Remove the added action script files, workflow file, report schema, documentation files, package script entry, and this update log.

## Handoff Note

The next logical patch is an accept workflow design that uses the local pipeline in protected write mode after explicit review approval. This patch should remain a read-only precheck baseline.
