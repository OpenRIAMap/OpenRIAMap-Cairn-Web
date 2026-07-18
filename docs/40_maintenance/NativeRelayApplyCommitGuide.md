# Native Relay Apply Commit Guide

Patch ID: `DATA_RELAY_APPLY_COMMIT_1`

## Default dry-run behavior

The protected apply command defaults to report-only behavior:

```powershell
npm run apply:native-relay-package
```

This reads the checked-in sample package and writes only reports under `.cairnmap-tmp/`.

## Dry-run with an external package

```powershell
node ./scripts/relay/apply-native-relay-package.mjs `
  --relay "D:/CairnTest/RelayPackage_Aunst-639_zth_202605171818.zip" `
  --feature-data "D:/CairnTest/OpenRIAMap-Data/Data_Spilt" `
  --picture-root "D:/CairnTest/OpenRIAMap-Data/Picture" `
  --media-index-root "D:/CairnTest/OpenRIAMap-Data/Media_Index_Spilt" `
  --out ".cairnmap-tmp/aunst-apply-dry"
```

Expected behavior:

```text
Write mode: disabled
Target write: skipped
Final result: DRY_RUN_ONLY
```

## Protected write test

Use a copied temporary data repository, not the official data repository, for first validation:

```powershell
node ./scripts/relay/apply-native-relay-package.mjs `
  --relay "D:/CairnTest/RelayPackage_Aunst-639_zth_202605171818.zip" `
  --feature-data "D:/CairnTest/OpenRIAMap-Data-TEMP/Data_Spilt" `
  --picture-root "D:/CairnTest/OpenRIAMap-Data-TEMP/Picture" `
  --media-index-root "D:/CairnTest/OpenRIAMap-Data-TEMP/Media_Index_Spilt" `
  --out ".cairnmap-tmp/aunst-apply-write" `
  --write `
  --backup
```

Expected for the Aunst sample against an empty test baseline:

```text
Feature create/update/unchanged/delete: 39/0/0/0
Pictures to copy/unchanged: 1/0
Media assets/bindings planned: 1/1
Final result: PASS
```

Expected target writes:

```text
39 feature JSON files under Data_Spilt
1 picture file under Picture
1 MediaAsset JSON under Media_Index_Spilt/assets
1 MediaBinding JSON under Media_Index_Spilt/bindings
```

## Safety options

```text
--write           Enables real target writes.
--backup          Backs up overwritten or deleted files into the report output root.
--no-overwrite    Fails if a feature, picture, or MediaIndex record would be overwritten.
--strict-delete   Fails if Delete.json references a missing target.
```

## What this command does not do

```text
It does not rebuild Data_Merge.
It does not rebuild Media_Index_Merge.
It does not commit to Git.
It does not call GitHub APIs.
It does not update Admin Review state.
```

Run a later merge/build tool after write mode if runtime cache outputs are needed.
