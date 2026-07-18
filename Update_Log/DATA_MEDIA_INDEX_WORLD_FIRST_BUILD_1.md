# DATA_MEDIA_INDEX_WORLD_FIRST_BUILD_1

## Objective

Unify MediaIndex around a world-first directory layout and add a local full build/verify tool for `Media_Index_Spilt -> Media_Index_Merge`.

## Changed Files

- `project-config/packages/openriamap-ria/environment/mediaIndexContract.json`
- `project-config/schemas/media/cairnmap.media-index-merge.v1.schema.json`
- `project-config/schemas/media/cairnmap.media-index-build-report.v1.schema.json`
- `scripts/media-index/media-index-build-tools.mjs`
- `scripts/media-index/build-media-index-full.mjs`
- `scripts/media-index/verify-media-index-full.mjs`
- `scripts/media-index/media-index-sample-tools.mjs`
- `scripts/media-index/verify-sample-media-index.mjs`
- `scripts/relay/native-relay-apply-tools.mjs`
- `scripts/relay/native-relay-write-tools.mjs`
- `docs/30_data-contracts/MediaIndexContract.md`
- `docs/30_data-contracts/MediaIndexBuildLocalContract.md`
- `docs/40_maintenance/MediaIndexBuildLocalGuide.md`
- `docs/30_data-contracts/examples/media-index-sample/`
- `package.json`

## Behavior Before

MediaIndex examples and RelayPackage apply outputs used project-aware binding and merge paths such as `bindings/openriamap-ria/zth/...` and `Media_Index_Merge/openriamap-ria/zth/...`.

## Behavior After

MediaIndex source bindings and merge output are world-first:

```text
Media_Index_Spilt/bindings/zth/...
Media_Index_Merge/zth/...
```

The builder can read legacy project-aware binding input with a warning but always emits world-first merge output.

## Compatibility Notes

`projectId` remains inside JSON metadata. Project separation is handled by distinct StorageProfile/baseUrl/repository roots rather than a projectId directory layer inside MediaIndex.

## Validation

Expected checks:

```text
npm run validate:media-index-contract
npm run build:media-index-sample
npm run verify:media-index-sample
npm run build:media-index-full
npm run verify:media-index-full
npx tsc -b
```

## Rollback Notes

Revert this patch to return MediaIndex examples and apply outputs to project-aware paths. Existing world-first output can be deleted and rebuilt from source records.

## Handoff Note

After this patch, the local data maintenance chain is: Native RelayPackage apply, FeatureData merge build, MediaIndex merge build. The next logical layer is automation/precheck orchestration, not another data-shape correction.
