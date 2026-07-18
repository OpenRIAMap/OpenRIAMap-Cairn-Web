# ACTIONS_RELAY_ACCEPT_1

## Objective

Add a protected GitHub Actions accept stage for Native RelayPackages. This stage can run the local relay pipeline in write mode and optionally commit/push accepted data changes to an accept branch.

## Changed Files

- `.github/workflows/native-relay-accept.yml`
- `scripts/actions/native-relay-accept.mjs`
- `scripts/actions/native-relay-accept-tools.mjs`
- `project-config/schemas/relay/cairnmap.native-relay-accept-report.v1.schema.json`
- `docs/30_data-contracts/NativeRelayAcceptActionContract.md`
- `docs/40_maintenance/NativeRelayAcceptActionGuide.md`
- `package.json`
- `Update_Log/ACTIONS_RELAY_ACCEPT_1.md`

## Behavior Before

The project had a read-only precheck workflow and a local pipeline, but no protected accept action wrapper for write-mode package acceptance or branch commit preparation.

## Behavior After

A new accept action can:

- validate a Native RelayPackage;
- run the local relay pipeline;
- write to a supplied data root only when `--write` is explicit;
- generate `accept-report.json` and `git-diff-summary.txt`;
- create a git commit only when `--commit-changes` is explicit;
- push the accept branch only when `--push` is explicit.

## Compatibility Notes

The default command remains safe and does not write data or commit changes. The workflow is manual-only in this patch and does not merge or deploy automatically.

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
npx tsc -b
```

## Rollback Notes

Remove the accept workflow, accept action scripts, accept schema, accept docs, package script, and this update log.

## Handoff Note

Next step: verify this accept action in a repository checkout with a temporary data root, then proceed toward a review/accept branch workflow policy or Admin UI integration.
