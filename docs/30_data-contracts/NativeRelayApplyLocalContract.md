# Native Relay Apply Local Contract

Patch ID: `DATA_RELAY_APPLY_LOCAL_1`

This document defines the first local apply prototype for CairnMap Native RelayPackage files.

The prototype is intentionally a dry-run toolchain. It can read real local package and data directories, but it does not write back to the official `Data_Spilt`, `Data_Merge`, `Picture`, `Media_Index_Spilt`, or `Media_Index_Merge` roots.

## 1. Scope

The local apply prototype accepts a Native RelayPackage directory with the existing CairnMap package shape:

```text
INDEX.json
Delete.json
Review.json
Data_Spilt/
Picture/
Tool_Refresh/
```

It compares that package against a caller-provided local FeatureData and Picture baseline.

## 2. Supported inputs

Default sample input:

```powershell
npm run compare:native-relay-package
npm run dry-run:native-relay-apply
```

External local input:

```powershell
node ./scripts/relay/apply-native-relay-package-dry-run.mjs `
  --relay "D:/RelayPackage_Aunst-639_zth_202605171818" `
  --feature-data "D:/OpenRIAMap-Data/Data_Spilt" `
  --picture-root "D:/OpenRIAMap-Data/Picture" `
  --out ".cairnmap-tmp/aunst-dry-run"
```

The relay package input should be an extracted package directory. Zip extraction remains outside this patch.

## 3. FeatureData layout detection

The tool accepts both project-aware and current native world-first split layouts.

Project-aware layout:

```text
Data_Spilt/openriamap-ria/zth/BUD/ZBUD_xxx.json
```

Native world-first layout:

```text
Data_Spilt/zth/BUD/ZBUD_xxx.json
Data_Spilt/zth/ISG/NGF/ZNGFLADISD_aunst_island.json
```

Nested `Kind` directories such as `ISG/NGF` are preserved. They are not treated as invalid paths.

## 4. Dry-run semantics

`Data_Spilt` files in the relay package are treated as upsert candidates.

The tool compares each package feature with the baseline FeatureData root and assigns one of:

```text
create
update
unchanged
```

`Delete.json` entries are treated as delete candidates. Missing delete targets are warnings, not fatal errors.

`Picture` files in the relay package are compared with the baseline Picture root and assigned one of:

```text
create
overwrite
unchanged
```

MediaIndex preview records are derived from the relay package `Picture/` paths. This does not modify the Native RelayPackage structure.

## 5. Output

The dry-run output root contains:

```text
dry-run-report.json
feature-changes.json
delete-changes.json
picture-changes.json
Data_Spilt_preview/
Data_Spilt_delete_preview/
Picture_preview/
Media_Index_Spilt_preview/
Media_Index_Merge_preview/
```

These files are preview artifacts only and must not be treated as official data until a future commit/apply patch implements controlled writeback.

## 6. Non-goals

This patch does not:

```text
write to official OpenRIAMap-Data
write to real Data_Spilt or Picture
rewrite Data_Merge
modify current frontend picture loading
call GitHub APIs
commit changes
trigger GitHub Actions
connect to the service-site submit UI
connect to an admin review UI
```

## 7. Relationship to previous contracts

This prototype reuses the established contract stack:

```text
StorageProfile
FeatureDataContract
Native RelayPackageProtocol
MediaIndexContract
```

It is the bridge from static contract definitions to a reusable local processing workflow.
