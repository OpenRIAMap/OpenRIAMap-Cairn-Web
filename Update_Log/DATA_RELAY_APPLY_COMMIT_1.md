# DATA_RELAY_APPLY_COMMIT_1

## Objective

Add a protected local write mode for applying CairnMap Native RelayPackages into target `Data_Spilt`, `Picture`, and `Media_Index_Spilt` roots.

## Changed Files

```text
scripts/relay/apply-native-relay-package.mjs
scripts/relay/native-relay-write-tools.mjs
scripts/relay/native-relay-apply-tools.mjs
project-config/schemas/relay/cairnmap.native-relay-apply-report.v1.schema.json
docs/30_data-contracts/NativeRelayApplyCommitContract.md
docs/40_maintenance/NativeRelayApplyCommitGuide.md
package.json
Update_Log/DATA_RELAY_APPLY_COMMIT_1.md
```

## Behavior Before

Native RelayPackage tooling could compare and dry-run apply packages, including directory and zip package inputs, but it could not write target data roots.

## Behavior After

The new `apply:native-relay-package` command supports report-only mode by default and protected write mode with explicit `--write`.

Write mode can apply package feature JSON, picture files, and generated MediaIndex source records into caller-provided target roots.

## Compatibility Notes

The existing dry-run and compare commands remain unchanged. The new apply command uses the same input resolver and config-driven Native RelayPackage resolver.

This patch does not change frontend runtime loading, mapping module import/export behavior, `Data_Merge`, or `Media_Index_Merge`.

## Validation

Expected validation commands:

```powershell
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
npx tsc -b
```

Protected write validation should be run only against a temporary copied data root.

## Rollback Notes

Remove the changed files listed above and remove the `apply:native-relay-package` script from `package.json`.

## Handoff Note

The next logical patch is a local merge/build tool for rebuilding or updating `Data_Merge` and `Media_Index_Merge` after a protected apply write.
