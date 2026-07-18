# Native Relay Local Pipeline Guide

Patch: `DATA_RELAY_PIPELINE_LOCAL_1`

## What this tool does

`run-native-relay-local-pipeline.mjs` combines the local RelayPackage apply and rebuild commands into one guarded workflow.

It is intended for local verification before the same logic is moved into GitHub Actions or an admin review flow.

## Dry-run example

```powershell
node .\scripts\relay\run-native-relay-local-pipeline.mjs `
  --relay "D:/CairnTest/RelayPackage_Aunst-639_zth_202605171818.zip" `
  --data-root "D:/CairnTest/OpenRIAMap-Data-TEMP" `
  --project-id "openriamap-ria"
```

This does not write to `Data_Merge` or `Media_Index_Merge`. It writes reports and preview outputs under `.cairnmap-tmp/native-relay-local-pipeline`.

## Write example

```powershell
node .\scripts\relay\run-native-relay-local-pipeline.mjs `
  --relay "D:/CairnTest/RelayPackage_Aunst-639_zth_202605171818.zip" `
  --data-root "D:/CairnTest/OpenRIAMap-Data-TEMP" `
  --project-id "openriamap-ria" `
  --write
```

Write mode applies the RelayPackage and then rebuilds both derived caches:

```text
Data_Merge/
Data_Index/
Media_Index_Merge/
```

## Recommended clean test

Before testing write mode, use a temporary data root, not the formal data repository.

```powershell
Remove-Item "D:/CairnTest/OpenRIAMap-Data-TEMP" -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force "D:/CairnTest/OpenRIAMap-Data-TEMP/Data_Spilt" | Out-Null
New-Item -ItemType Directory -Force "D:/CairnTest/OpenRIAMap-Data-TEMP/Picture" | Out-Null
New-Item -ItemType Directory -Force "D:/CairnTest/OpenRIAMap-Data-TEMP/Media_Index_Spilt" | Out-Null
```

Then run the write pipeline command above.

## Expected Aunst sample result

For the Aunst sample package, the output should include a PASS result similar to:

```text
Final result: PASS
```

The report should show:

```text
apply features create/update/unchanged/delete: 39/0/0/0
feature merge processed/chunks: 39/4
media assets/bindings/worlds: 1/1/1
```

## Important safety notes

- `--write` requires an explicit `--data-root`.
- `--data-root` must not overlap `.cairnmap-tmp` output.
- `--data-root` must not overlap the RelayPackage input.
- The tool does not commit changes to Git.
- The tool does not trigger deployment.
- The tool does not change admin review status.

## Next automation step

After this local pipeline is stable, the next natural patch is a read-only GitHub Actions precheck:

```text
ACTIONS_RELAY_PRECHECK_1
```

That later workflow should call this pipeline without `--write` and publish `pipeline-report.json` as an artifact.
