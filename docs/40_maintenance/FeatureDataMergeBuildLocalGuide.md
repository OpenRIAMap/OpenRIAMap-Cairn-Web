# FeatureData Merge Build Local Guide

Patch ID: `DATA_MERGE_BUILD_LOCAL_1`

## Default validation run

From the `CairnMap-Web` root:

```powershell
npm run build:feature-merge-full
npm run verify:feature-merge-full
```

This uses the checked-in Native RelayPackage sample as a safe input and writes preview output to:

```text
.cairnmap-tmp/feature-merge-full/
```

## Build from a temporary Data repository

Use this after `DATA_RELAY_APPLY_COMMIT_1` has written a RelayPackage into a temporary `Data_Spilt` copy:

```powershell
node ./scripts/feature-data/build-feature-merge-full.mjs `
  --split-root "D:/CairnTest/OpenRIAMap-Data-TEMP/Data_Spilt" `
  --merge-root "D:/CairnTest/OpenRIAMap-Data-TEMP/Data_Merge" `
  --index-root "D:/CairnTest/OpenRIAMap-Data-TEMP/Data_Index" `
  --project-id "openriamap-ria" `
  --layout "native-world-first" `
  --write
```

Then verify:

```powershell
node ./scripts/feature-data/verify-feature-merge-full.mjs `
  --out ".cairnmap-tmp/feature-merge-full"
```

## Handling legacy/error world directories

The builder reads valid Cairn world ids such as:

```text
zth
eden
naraku
houtu
laputa
yunduan
```

It does not treat numeric legacy/error folders such as `0/` as normal worlds.

Default behavior:

```text
Data_Spilt/0/... -> skipped, warning recorded in build-report.json
```

Strict behavior:

```powershell
node ./scripts/feature-data/build-feature-merge-full.mjs --split-root ".../Data_Spilt" --strict-worlds
```

With `--strict-worlds`, any unregistered world directory fails the build.

## Safety notes

Do not run write mode against the production data repository until the same command has succeeded against a temporary copy.

The builder refuses unsafe roots such as filesystem roots or output roots inside the input `Data_Spilt` directory.
