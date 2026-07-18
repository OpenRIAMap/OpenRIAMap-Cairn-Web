# MediaIndex Contract Reference

Patch: `DATA_MEDIA_INDEX_WORLD_FIRST_BUILD_1`

## Purpose

`mediaIndexContract.json` declares how CairnMap represents media assets and feature-media bindings in the distributed framework.

This contract does not replace the current `Picture/` path rules, does not change the current frontend image runtime, and does not write image URLs into feature JSON.

## Config location

```text
project-config/packages/openriamap-ria/environment/mediaIndexContract.json
```

## Schema locations

```text
project-config/schemas/media/cairnmap.media-index-contract.v1.schema.json
project-config/schemas/media/cairnmap.media-asset.v1.schema.json
project-config/schemas/media/cairnmap.media-binding.v1.schema.json
project-config/schemas/media/cairnmap.media-index-merge.v1.schema.json
project-config/schemas/media/cairnmap.media-index-build-report.v1.schema.json
```

## Roots

MediaIndex is world-first. `projectId` is stored inside JSON metadata, not used as a directory segment.

```text
Media_Index_Spilt/
  assets/
  bindings/
    {worldId}/
      {classCode}/
        ...
          {featureId}.json

Media_Index_Merge/
  INDEX.json
  {worldId}/
    INDEX.json
    by-feature/
    assets/
```

Different projects should use different StorageProfile/baseUrl roots instead of sharing one MediaIndex root with projectId path prefixes.

## Asset record

A `MediaAsset` describes the media entity itself.

```json
{
  "schemaVersion": "cairnmap.media-asset.v1",
  "mediaId": "IMG_SAMPLE_AUNST_ISLAND_001",
  "mediaType": "image",
  "storageProfile": "media.github.currentOpenRIAMapDataPicture",
  "objectKey": "zth/ISG/NGF/ZNGFLADISD_aunst_island/ZNGFLADISD_aunst_island_1.webp",
  "mimeType": "image/webp",
  "status": "active"
}
```

`objectKey` is relative to the media storage profile root. For the current OpenRIAMap data repository, the media storage profile root is `Picture`, so the full native picture path remains:

```text
Picture/zth/ISG/NGF/ZNGFLADISD_aunst_island/ZNGFLADISD_aunst_island_1.webp
```

## Binding record

A `MediaBinding` describes which media assets belong to a feature.

```json
{
  "schemaVersion": "cairnmap.media-binding.v1",
  "featureRef": {
    "projectId": "openriamap-ria",
    "worldId": "zth",
    "classCode": "ISG",
    "kindPath": ["NGF"],
    "featureId": "ZNGFLADISD_aunst_island"
  },
  "media": [
    {
      "mediaId": "IMG_SAMPLE_AUNST_ISLAND_001",
      "role": "cover",
      "order": 1,
      "visible": true
    }
  ]
}
```

`kindPath` is optional, but it should be kept when the native CairnMap directory uses class/kind nesting such as `ISG/NGF`.

## Runtime intent

Future runtime behavior should be:

```text
featureRef
  -> Media_Index_Merge/{worldId}/by-feature/...
  -> mediaId list
  -> Media_Index_Merge/{worldId}/assets/{mediaId}.json
  -> storageProfile + objectKey
  -> final media URL
```

## Validation commands

```powershell
npm run validate:media-index-contract
npm run build:media-index-sample
npm run verify:media-index-sample
npm run build:media-index-full
npm run verify:media-index-full
```
