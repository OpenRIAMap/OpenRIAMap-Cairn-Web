# Native Relay Local Pipeline Contract

Patch: `DATA_RELAY_PIPELINE_LOCAL_1`

## Purpose

The Native Relay local pipeline is a single local entry point for the data-maintenance sequence that was previously executed as separate commands.

It runs the following stages in order:

```text
Native RelayPackage zip/dir
  -> apply or dry-run apply
  -> build Data_Merge and Data_Index
  -> verify Data_Merge and Data_Index
  -> build Media_Index_Merge
  -> verify Media_Index_Merge
  -> pipeline-report.json
```

## Scope

This contract covers only a local filesystem pipeline. It does not create Git commits, open pull requests, update review status, trigger deployment, or call a remote API.

## Command

```powershell
node ./scripts/relay/run-native-relay-local-pipeline.mjs `
  --relay "D:/CairnTest/RelayPackage_Aunst-639_zth_202605171818.zip" `
  --data-root "D:/CairnTest/OpenRIAMap-Data-TEMP" `
  --project-id "openriamap-ria" `
  --write
```

The npm alias is:

```text
npm run run:native-relay-local-pipeline
```

## Directory assumptions

When `--data-root` is supplied, the pipeline resolves these child roots:

```text
{data-root}/Data_Spilt
{data-root}/Picture
{data-root}/Media_Index_Spilt
{data-root}/Data_Merge
{data-root}/Data_Index
{data-root}/Media_Index_Merge
```

## Default dry-run mode

Without `--write`, the pipeline generates previews under:

```text
.cairnmap-tmp/native-relay-local-pipeline/
  01_apply/
  02_feature_merge/
  03_media_index/
  pipeline-report.json
```

The default dry-run command uses the checked-in Native RelayPackage sample when no external `--relay` is supplied.

## Write mode

Write mode requires an explicit `--data-root`.

When `--write` is supplied, the pipeline may write only under the specified data root:

```text
Data_Spilt/
Picture/
Media_Index_Spilt/
Data_Merge/
Data_Index/
Media_Index_Merge/
```

Write mode refuses to run if `--data-root` overlaps the report output root or the RelayPackage input root.

## Pipeline report

The pipeline writes:

```text
pipeline-report.json
```

with schema version:

```text
cairnmap.native-relay-pipeline-report.v1
```

The report records:

- input paths and mode
- resolved data roots
- stage status
- stdout/stderr tails from child commands
- apply summary
- feature merge summary
- media index summary
- warnings and errors

## Final status

`finalStatus` is `PASS` only when every stage exits successfully. If a stage fails, the pipeline stops subsequent dependent stages and records the failed step in `errors`.
