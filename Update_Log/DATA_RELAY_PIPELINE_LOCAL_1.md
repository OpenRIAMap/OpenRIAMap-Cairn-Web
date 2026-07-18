# DATA_RELAY_PIPELINE_LOCAL_1

## Objective

Add a guarded local pipeline command that runs the Native RelayPackage apply, FeatureData merge rebuild, FeatureData merge verification, MediaIndex merge rebuild, and MediaIndex merge verification as one local workflow.

## Changed Files

- `scripts/relay/run-native-relay-local-pipeline.mjs`
- `scripts/relay/native-relay-pipeline-tools.mjs`
- `project-config/schemas/relay/cairnmap.native-relay-pipeline-report.v1.schema.json`
- `docs/30_data-contracts/NativeRelayLocalPipelineContract.md`
- `docs/40_maintenance/NativeRelayLocalPipelineGuide.md`
- `docs/30_data-contracts/MediaIndexContract.md`
- `docs/30_data-contracts/examples/media-index-sample/Media_Index_Spilt/bindings/openriamap-ria/zth/ISG/NGF/ZNGFLADISD_aunst_island.json` removed as a duplicate legacy sample path
- `package.json`
- `Update_Log/DATA_RELAY_PIPELINE_LOCAL_1.md`

## Behavior Before

The local maintenance workflow required multiple manual commands:

1. apply or dry-run a Native RelayPackage
2. build FeatureData merge output
3. verify FeatureData merge output
4. build MediaIndex merge output
5. verify MediaIndex merge output

The checked-in MediaIndex sample also still contained a duplicate legacy project-aware binding path, which caused `validate:media-index-contract` to report a duplicate feature binding when the latest baseline was checked from a clean extraction.

## Behavior After

A single local command can run the full local pipeline:

```text
npm run run:native-relay-local-pipeline
```

External write-mode usage:

```powershell
node ./scripts/relay/run-native-relay-local-pipeline.mjs `
  --relay "D:/CairnTest/RelayPackage_Aunst-639_zth_202605171818.zip" `
  --data-root "D:/CairnTest/OpenRIAMap-Data-TEMP" `
  --project-id "openriamap-ria" `
  --write
```

The command writes `pipeline-report.json` and stops if a dependent stage fails.

The MediaIndex sample now keeps only the canonical world-first binding path.

## Compatibility Notes

- Default mode remains dry-run and writes only preview/report output.
- Write mode requires explicit `--data-root`.
- The pipeline does not write Git commits, open pull requests, trigger deployment, or update admin review state.
- The MediaIndex builder still accepts old project-aware binding input paths with warnings, but the checked-in sample no longer contains a duplicate legacy path.

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
npx tsc -b
```

## Rollback Notes

Remove the new pipeline scripts, schema, docs, package script, and this update log entry. Restore the old duplicate MediaIndex sample file only if intentionally testing legacy project-aware duplicate detection.

## Handoff Note

This patch prepares the local workflow for a later GitHub Actions precheck. The next recommended patch is `ACTIONS_RELAY_PRECHECK_1`, which should call the local pipeline in dry-run mode and publish the pipeline report as a workflow artifact.
