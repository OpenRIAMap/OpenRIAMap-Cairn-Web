# FeatureData Split / Merge / Index Contract

Patch: `DATA_FEATURE_REPO_CONTRACT_1`

## Purpose

The FeatureData contract formalizes how Cairn stores editable source features and generated runtime cache data.

The central rule is:

```text
Data_Spilt is the official source.
Data_Merge is a generated cache.
Data_Index records how source records map to merge chunks.
```

## Repository Shape

```text
FeatureData/
  Data_Spilt/
    {projectId}/
      {worldId}/
        {classCode}/
          {featureId}.json
  Data_Merge/
    {projectId}/
      {worldId}/
        INDEX.json
        {classCode}/
          INDEX.json
          chunk_000.json
  Data_Index/
    merge-index.json
    chunk-manifest.json
    data-version.json
```

## Data_Spilt

`Data_Spilt` is optimized for review, traceability, single-feature updates, and conflict detection. A future RelayPackage apply tool should write to `Data_Spilt` first, then rebuild affected merge outputs.

A source feature record must include a stable identity:

```json
{
  "projectId": "openriamap-ria",
  "worldId": "zth",
  "classCode": "BUD",
  "featureId": "ZBUD_example",
  "geometry": { "type": "Point", "coordinates": [0, 0] },
  "properties": {}
}
```

## Data_Merge

`Data_Merge` is optimized for browser runtime reads and CDN caching. It may be committed as generated output, but it should not become manually edited source data.

The minimum merge output is:

```text
world INDEX -> class INDEX -> chunk files
```

## Data_Index

### merge-index.json

Maps each feature to its source and generated chunk:

```json
{
  "features": {
    "BUD:ZBUD_example": {
      "projectId": "openriamap-ria",
      "worldId": "zth",
      "classCode": "BUD",
      "featureId": "ZBUD_example",
      "sourcePath": "Data_Spilt/openriamap-ria/zth/BUD/ZBUD_example.json",
      "mergeChunk": "Data_Merge/openriamap-ria/zth/BUD/chunk_000.json",
      "contentHash": "..."
    }
  }
}
```

### chunk-manifest.json

Records generated chunks and their hashes.

### data-version.json

Records the generation version and builder identity.

## Current Patch Boundary

`DATA_FEATURE_REPO_CONTRACT_1` only introduces the contract, schemas, sample fixture, and sample validation tools. It does not migrate the real OpenRIAMap-Data repository and does not alter the current site runtime loader.

## Future Patches

This contract prepares the ground for:

```text
CM_RELAY_PACKAGE_PROTOCOL_1
DATA_MEDIA_INDEX_CONTRACT_1
DATA_RELAY_APPLY_LOCAL_1
DATA_SPLIT_MERGE_INCREMENTAL_1
```
