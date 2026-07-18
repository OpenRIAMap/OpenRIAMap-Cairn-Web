# DATA_FEATURE_REPO_CONTRACT_1

## Objective

Introduce the first FeatureData repository contract for the Cairn distributed framework.

This patch defines the target `Data_Spilt / Data_Merge / Data_Index` structure, adds contract schemas, adds a contract config file for the `openriamap-ria` package, and provides sample-only validation/build tools.

## Changed Files

```text
CairnMap-Web/project-config/packages/openriamap-ria/environment/featureDataContract.json
CairnMap-Web/project-config/schemas/data/cairnmap.feature-data.v1.schema.json
CairnMap-Web/project-config/schemas/data/cairnmap.feature-data-index.v1.schema.json
CairnMap-Web/scripts/feature-data/feature-data-sample-tools.mjs
CairnMap-Web/scripts/feature-data/validate-feature-data-contract.mjs
CairnMap-Web/scripts/feature-data/build-sample-feature-merge.mjs
CairnMap-Web/scripts/feature-data/verify-sample-feature-index.mjs
CairnMap-Web/docs/20_config-reference/FeatureDataContractReference.md
CairnMap-Web/docs/30_data-contracts/FeatureDataSplitMergeContract.md
CairnMap-Web/docs/30_data-contracts/examples/feature-data-sample/...
CairnMap-Web/package.json
CairnMap-Web/Update_Log/DATA_FEATURE_REPO_CONTRACT_1.md
```

## Behavior Before

The repository already had `CM_STORAGE_PROFILE_1`, which declared future storage locations for FeatureData, media, MediaIndex, and RelayPool.

However, there was no explicit FeatureData Split/Merge/Index contract in `project-config`, no FeatureData schema, and no sample validator proving the proposed repository structure.

## Behavior After

A new `featureDataContract.json` declares:

```text
Data_Spilt = official source data
Data_Merge = generated runtime cache
Data_Index = merge-index / chunk-manifest / data-version state
```

The patch also adds sample-only tools that validate a tiny fixture and build deterministic sample merge/index outputs under `.cairnmap-tmp/feature-data-sample/`.

## Compatibility Notes

This is a contract-only patch.

It does not modify:

```text
dataSources.json
sourceLinkModes.json
current Rules data loading
current Picture loading
current OpenRIAMap-Data files
current Data_Merge_Tool
```

The current site continues to read data through the existing `sourceLinkModes.json + dataSources.json + dat sourceMode` chain.

## Validation

Expected commands:

```powershell
npm run validate:project-config
npm run audit:project-config
npm run inspect:project-config
npm run validate:storage-profiles
npm run validate:feature-data-contract
npm run build:feature-merge-sample
npm run verify:feature-index-sample
npx tsc -b
npm run build
```

If `npm run build` is run against an uploaded zip with non-clean `node_modules`, it may still fail at `vite: Permission denied`. That is an environment/package extraction issue already observed before this patch.

## Rollback Notes

To roll back this patch, remove the new FeatureData contract files, scripts, docs, sample fixture, package scripts, and this Update_Log entry.

No runtime data loader or real data repository file is changed by this patch.

## Handoff Note

The next recommended patch is `CM_RELAY_PACKAGE_PROTOCOL_1` or `DATA_MEDIA_INDEX_CONTRACT_1`, depending on whether the workflow should define submission semantics first or media relationships first. If continuing strictly from the original queue, the next patch is `CM_RELAY_PACKAGE_PROTOCOL_1`.
