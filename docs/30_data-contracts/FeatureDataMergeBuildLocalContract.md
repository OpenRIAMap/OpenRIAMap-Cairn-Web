# FeatureData Merge Build Local Contract

Patch ID: `DATA_MERGE_BUILD_LOCAL_1`

## Purpose

This contract defines the local full rebuild step that converts CairnMap `Data_Spilt` source data into `Data_Merge` runtime cache files and `Data_Index` metadata.

The patch is intentionally limited to a full rebuild builder. It does not implement incremental merge, Git commits, GitHub Actions, Admin review, or frontend runtime switching.

## Input

The builder reads a local `Data_Spilt` root.

Supported layouts:

```text
native-world-first:
  Data_Spilt/{worldId}/{classCode}/{kindPath...}/{featureId}.json

project-aware:
  Data_Spilt/{projectId}/{worldId}/{classCode}/{kindPath...}/{featureId}.json
```

The default resolver mode is `auto`. In auto mode, a first path segment equal to the project id is treated as `project-aware`; otherwise paths are treated as `native-world-first`.

## World directory rule

Only `worldId` values registered in `project-config/packages/openriamap-ria/environment/worlds.json` are valid build inputs.

Error leftovers such as `Data_Spilt/0/` are not treated as normal worlds. They are skipped and recorded in `build-report.json` by default. With `--strict-worlds`, any unregistered world directory causes the build to fail.

## Output

The builder generates:

```text
Data_Merge/
  INDEX.json
  {worldId}/
    INDEX.json
    {classCode}/
      INDEX.json
      chunk_001.json
      chunk_002.json

Data_Index/
  merge-index.json
  chunk-manifest.json
  data-version.json
```

`Data_Merge/{worldId}/{classCode}/INDEX.json` follows the current CairnMap runtime-friendly structure:

```json
{
  "version": 1,
  "itemCount": 39,
  "updatedAt": "1970-01-01T00:00:00.000Z",
  "items": ["FEATURE_ID"],
  "chunkSize": 200,
  "chunkCount": 1,
  "chunks": [
    {
      "file": "chunk_001.json",
      "itemCount": 39,
      "items": ["FEATURE_ID"]
    }
  ]
}
```

Each chunk file is a JSON array of full feature records.

## Data_Index

`merge-index.json` maps feature references to source paths, merge chunks, and content hashes.

`chunk-manifest.json` records each generated chunk, its feature count, and content hash.

`data-version.json` records the full rebuild metadata and builder version.

## Safety mode

The builder always creates preview output by default. Real output roots are written only when `--write` is explicitly supplied.

Dry-run/default output:

```text
.cairnmap-tmp/feature-merge-full/
  build-report.json
  Data_Merge_preview/
  Data_Index_preview/
```

Write mode output is controlled by explicit command-line paths:

```text
--merge-root <Data_MergeDir>
--index-root <Data_IndexDir>
--write
```

## Non-goals

This patch does not:

- implement incremental merge;
- build `Media_Index_Merge`;
- modify frontend data loading;
- call Git or GitHub APIs;
- trigger deployment;
- migrate `OpenRIAMap-Data` into a new repository layout.
