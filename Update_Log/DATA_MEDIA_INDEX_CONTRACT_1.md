# DATA_MEDIA_INDEX_CONTRACT_1

## Objective

Define the first MediaIndex data contract for CairnMap so media assets and feature-media bindings can be represented separately from feature JSON.

This patch introduces MediaIndex contract configuration, schemas, a sample fixture, local validation tools, sample merge tooling, and documentation.

## Changed Files

```text
project-config/packages/openriamap-ria/environment/mediaIndexContract.json
project-config/schemas/media/cairnmap.media-index-contract.v1.schema.json
project-config/schemas/media/cairnmap.media-asset.v1.schema.json
project-config/schemas/media/cairnmap.media-binding.v1.schema.json
project-config/schemas/media/cairnmap.media-index-merge.v1.schema.json
scripts/media-index/media-index-sample-tools.mjs
scripts/media-index/validate-media-index-contract.mjs
scripts/media-index/build-sample-media-index.mjs
scripts/media-index/verify-sample-media-index.mjs
docs/20_config-reference/MediaIndexContractReference.md
docs/30_data-contracts/MediaIndexContract.md
docs/30_data-contracts/examples/media-index-sample/
package.json
Update_Log/DATA_MEDIA_INDEX_CONTRACT_1.md
```

## Behavior Before

CairnMap had StorageProfile, FeatureData, and Native RelayPackage contracts, but it did not have a formal MediaIndex contract.

Current image handling was still represented by the existing `Picture/` structure and current frontend image path rules.

## Behavior After

CairnMap now has a contract-only MediaIndex layer:

```text
Media_Index_Spilt/
  assets/
  bindings/

Media_Index_Merge/
  {projectId}/{worldId}/
    INDEX.json
    by-feature/
    assets/
```

A sample MediaAsset and MediaBinding are provided using the existing Native RelayPackage sample image:

```text
Picture/zth/ISG/NGF/ZNGFLADISD_aunst_island/ZNGFLADISD_aunst_island_1.webp
```

The patch adds npm commands for contract validation and deterministic sample merge generation:

```powershell
npm run validate:media-index-contract
npm run build:media-index-sample
npm run verify:media-index-sample
```

## Compatibility Notes

This is a contract-only patch.

It does not:

```text
replace the current Picture/ path rules
change Native RelayPackage structure
require addMediaAsset/bindMedia operation arrays
modify Feature JSON
write image URLs into Feature JSON
change the frontend infocard image runtime
migrate images to object storage
write to OpenRIAMap-Data
```

`ISG/NGF` style nested paths are treated as valid CairnMap kind-path structure and are preserved through `kindPath` in MediaBinding.

## Validation

Executed validation:

```text
npm run validate:project-config        PASS
npm run audit:project-config           PASS
npm run inspect:project-config         PASS
npm run validate:storage-profiles      PASS
npm run validate:feature-data-contract PASS
npm run validate:native-relay-package  PASS
npm run validate:media-index-contract  PASS
npm run build:media-index-sample       PASS
npm run verify:media-index-sample      PASS
npx tsc -b                             PASS
git apply --check                      PASS
npm run build                          NOT COMPLETED
```

`npm run build` was not completed because the uploaded zip contains `node_modules/.bin/vite` without executable permission in the current environment:

```text
sh: 1: vite: Permission denied
```

Residual risk: production Vite build still needs confirmation after a clean local install:

```powershell
npm ci
npm run build
```

## Rollback Notes

To roll back this patch, remove the files listed in `Changed Files` and remove the three MediaIndex npm scripts from `package.json`.

No runtime data, current `Picture/` paths, frontend loader behavior, or Feature JSON files are changed.

## Handoff Note

This patch completes the fourth contract layer:

```text
StorageProfile              -> where storage lives
FeatureDataContract         -> how feature data is structured
Native RelayPackageProtocol -> how editable submission packages are shaped
MediaIndexContract          -> how media assets bind to features
```

The next recommended patch is `DATA_RELAY_APPLY_LOCAL_1`, which should locally apply a Native RelayPackage to `Data_Spilt`, `Picture`, and `Media_Index_Spilt`, then rebuild sample merge outputs without touching the live site runtime.
