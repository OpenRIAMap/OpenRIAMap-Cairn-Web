# MediaIndex Contract

Patch: `DATA_MEDIA_INDEX_WORLD_FIRST_BUILD_1`

## Position

MediaIndex separates image/media relationships from feature JSON while keeping the native CairnMap `Picture/` tree unchanged.

Native RelayPackage remains simple:

```text
INDEX.json
Delete.json
Review.json
Data_Spilt/
Picture/
Tool_Refresh/
```

MediaIndex records are derived from native picture paths and feature paths. Feature JSON still does not store final image URLs.

## Project separation policy

MediaIndex now uses a **world-first** directory layout. `projectId` remains in JSON metadata, but it is not a directory layer.

Different projects should be separated by different `StorageProfile` roots / base URLs / repository roots, rather than by mixing multiple projects under one `Media_Index_Merge/{projectId}/...` root.

## Source layer

```text
Media_Index_Spilt/
  assets/
    IMG_*.json
  bindings/
    {worldId}/
      {classCode}/
        ...
          {featureId}.json
```

The source layer is reviewable and editable, similar to `Data_Spilt`.

## Merge layer

```text
Media_Index_Merge/
  INDEX.json
  {worldId}/
    INDEX.json
    assets/
      {mediaId}.json
    by-feature/
      {classCode}/
        ...
          {featureId}.json
```

The merge layer is a runtime cache. It can be regenerated from `Media_Index_Spilt`.

## Native RelayPackage compatibility

The sample is derived from the Native RelayPackage sample introduced by `CM_RELAY_PACKAGE_PROTOCOL_1`.

Source feature:

```text
Data_Spilt/zth/ISG/NGF/ZNGFLADISD_aunst_island.json
```

Source picture:

```text
Picture/zth/ISG/NGF/ZNGFLADISD_aunst_island/ZNGFLADISD_aunst_island_1.webp
```

MediaIndex records:

```text
Media_Index_Spilt/assets/IMG_SAMPLE_AUNST_ISLAND_001.json
Media_Index_Spilt/bindings/zth/ISG/NGF/ZNGFLADISD_aunst_island.json
```

Runtime merge records:

```text
Media_Index_Merge/zth/INDEX.json
Media_Index_Merge/zth/assets/IMG_SAMPLE_AUNST_ISLAND_001.json
Media_Index_Merge/zth/by-feature/ISG/NGF/ZNGFLADISD_aunst_island.json
```

## Invariants

1. Feature JSON must not store final image URLs.
2. Native RelayPackage `Picture/` remains valid.
3. `objectKey` is relative to the media storage profile root.
4. `kindPath` preserves current CairnMap class/kind directory nesting.
5. At most one visible `cover` image should exist per feature binding.
6. `Media_Index_Merge` is cache output, not manually maintained source.
7. New MediaIndex output must be world-first.

## Legacy compatibility

Older preview data may contain project-aware binding paths:

```text
Media_Index_Spilt/bindings/zth/...
```

`DATA_MEDIA_INDEX_WORLD_FIRST_BUILD_1` can read this legacy input with a warning, but it always writes canonical world-first output:

```text
Media_Index_Merge/zth/...
```
