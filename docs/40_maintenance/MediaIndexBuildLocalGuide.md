# MediaIndex Full Build Local Guide

Patch: `DATA_MEDIA_INDEX_WORLD_FIRST_BUILD_1`

This guide explains how to rebuild the runtime `Media_Index_Merge` cache from source-side `Media_Index_Spilt` records.

## Default sample build

```powershell
npm run build:media-index-full
npm run verify:media-index-full
```

Default output is preview-only:

```text
.cairnmap-tmp/media-index-full/
  build-report.json
  Media_Index_Merge_preview/
    INDEX.json
    zth/
      INDEX.json
      assets/
      by-feature/
```

## Build an external temporary data repository

```powershell
node .\scripts\media-index\build-media-index-full.mjs `
  --split-root "D:/CairnTest/OpenRIAMap-Data-TEMP/Media_Index_Spilt" `
  --merge-root "D:/CairnTest/OpenRIAMap-Data-TEMP/Media_Index_Merge" `
  --project-id "openriamap-ria" `
  --write
```

Verify it:

```powershell
node .\scripts\media-index\verify-media-index-full.mjs `
  --split-root "D:/CairnTest/OpenRIAMap-Data-TEMP/Media_Index_Spilt" `
  --merge-root "D:/CairnTest/OpenRIAMap-Data-TEMP/Media_Index_Merge" `
  --project-id "openriamap-ria"
```

## Canonical layout

`Media_Index_Merge` is world-first:

```text
Media_Index_Merge/
  zth/
    INDEX.json
    assets/
    by-feature/
```

`projectId` is stored in JSON metadata but is not used as a directory layer. Different projects should use different StorageProfile/baseUrl roots.

## Safety

The command defaults to preview output. It writes to a real merge root only with `--write`.

The write root must not be inside:

```text
Media_Index_Spilt
.cairnmap-tmp report output
CairnMap-Web project root
```
