# DATA_MERGE_BUILD_LOCAL_1

## Objective

Introduce a local full rebuild tool that converts config-registered `Data_Spilt` feature JSON into `Data_Merge` runtime cache files and `Data_Index` metadata.

## Changed Files

- `scripts/feature-data/feature-merge-build-tools.mjs`
- `scripts/feature-data/build-feature-merge-full.mjs`
- `scripts/feature-data/verify-feature-merge-full.mjs`
- `project-config/schemas/data/cairnmap.feature-merge-build-report.v1.schema.json`
- `docs/30_data-contracts/FeatureDataMergeBuildLocalContract.md`
- `docs/40_maintenance/FeatureDataMergeBuildLocalGuide.md`
- `package.json`
- `Update_Log/DATA_MERGE_BUILD_LOCAL_1.md`

## Behavior Before

The repository had FeatureData contracts, Native RelayPackage dry-run/apply tools, and MediaIndex contracts, but no local tool for rebuilding `Data_Merge` and `Data_Index` from `Data_Spilt` after applying a RelayPackage.

## Behavior After

A new local full rebuild tool can scan `Data_Spilt`, group valid feature JSON by config-registered `worldId` and `classCode`, generate class chunks, class indexes, world/root indexes, and `Data_Index` metadata.

The tool defaults to preview output. It writes target `Data_Merge` and `Data_Index` roots only when `--write` is explicitly supplied.

Unregistered world directories such as `0/` are treated as skipped leftovers, not valid worlds. They are reported as warnings by default and become errors with `--strict-worlds`.

## Compatibility Notes

This patch does not modify frontend runtime loading, existing `sourceLinkModes.json`, current `dataSources.json`, real `OpenRIAMap-Data`, GitHub workflows, or deployment configuration.

The generated `Data_Merge/{worldId}/{classCode}/INDEX.json` and `chunk_001.json` structure is aligned with the current CairnMap Data_Merge shape.

## Validation

Expected commands:

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
npm run build:feature-merge-full
npm run verify:feature-merge-full
npx tsc -b
```

## Rollback Notes

Remove the files listed above and remove the `build:feature-merge-full` and `verify:feature-merge-full` scripts from `package.json`.

## Handoff Note

Next recommended patch after local validation is `DATA_MEDIA_INDEX_BUILD_LOCAL_1` or a controlled integration patch that chains `apply:native-relay-package` and `build:feature-merge-full` on a temporary data repository.
