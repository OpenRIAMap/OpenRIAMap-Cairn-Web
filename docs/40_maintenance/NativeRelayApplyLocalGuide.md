# Native Relay Apply Local Guide

Patch ID: `DATA_RELAY_APPLY_LOCAL_1`

This guide explains how to use the local Native RelayPackage dry-run tools.

## 1. Compare a package

Run the default checked-in fixture:

```powershell
npm run compare:native-relay-package
```

Run against an external local package and data baseline:

```powershell
node ./scripts/relay/compare-native-relay-package.mjs `
  --relay "D:/RelayPackage_Aunst-639_zth_202605171818" `
  --feature-data "D:/OpenRIAMap-Data/Data_Spilt" `
  --picture-root "D:/OpenRIAMap-Data/Picture" `
  --out ".cairnmap-tmp/aunst-compare"
```

The compare command writes a report and summary files to the output directory but does not write any preview data directories other than report artifacts.

## 2. Run a dry-run apply

```powershell
npm run dry-run:native-relay-apply
```

With external local paths:

```powershell
node ./scripts/relay/apply-native-relay-package-dry-run.mjs `
  --relay "D:/RelayPackage_Aunst-639_zth_202605171818" `
  --feature-data "D:/OpenRIAMap-Data/Data_Spilt" `
  --picture-root "D:/OpenRIAMap-Data/Picture" `
  --out ".cairnmap-tmp/aunst-dry-run"
```

## 3. Output interpretation

`dry-run-report.json` is the primary machine-readable report.

`Data_Spilt_preview/` contains feature JSON files exactly as they would be staged for an upsert preview.

`Data_Spilt_delete_preview/` contains delete plan records for items from `Delete.json`.

`Picture_preview/` contains copied package picture files under the same object keys used by the Native RelayPackage.

`Media_Index_Spilt_preview/` and `Media_Index_Merge_preview/` contain derived MediaIndex records based on the `Picture/` paths.

## 4. Safety boundary

The tools only write to the `--out` directory. They must not write to the provided `--feature-data` or `--picture-root` directories.

A later patch may add controlled writeback, but that is outside `DATA_RELAY_APPLY_LOCAL_1`.
