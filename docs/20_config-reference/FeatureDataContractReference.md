# FeatureData Contract Reference

Patch: `DATA_FEATURE_REPO_CONTRACT_1`

This document describes the contract introduced for the Cairn distributed framework FeatureData repository. It is a contract reference only. The current website continues to use the existing `sourceLinkModes.json + dataSources.json + dat sourceMode` runtime chain.

## Config File

```text
project-config/packages/openriamap-ria/environment/featureDataContract.json
```

The file declares the target FeatureData structure for future data tooling:

```text
Data_Spilt = source of truth
Data_Merge = runtime cache
Data_Index = merge/index/version state
```

## Roots

| Key | Meaning |
|---|---|
| `splitRoot` | Source-data root. Current target value: `Data_Spilt`. |
| `mergeRoot` | Generated runtime-cache root. Current target value: `Data_Merge`. |
| `indexRoot` | Generated index/version root. Current target value: `Data_Index`. |

## Storage Profile Linkage

The contract references `storageProfiles.json` rather than hard-coding repository access in the runtime:

```text
featureData -> featureData.github.currentOpenRIAMapData
media       -> media.github.currentOpenRIAMapDataPicture
mediaIndex  -> mediaIndex.github.plannedOpenRIAMapData
relayPool   -> relayPool.github.plannedCairnMapRelayPool
```

This keeps the future internal/external repository switch behind the StorageProfile layer.

## Split Source Layout

```text
Data_Spilt/{projectId}/{worldId}/{classCode}/{featureId}.json
```

Each source feature record must carry at least:

```text
projectId
worldId
classCode
featureId
geometry
properties
```

## Merge Runtime Layout

```text
Data_Merge/{projectId}/{worldId}/INDEX.json
Data_Merge/{projectId}/{worldId}/{classCode}/INDEX.json
Data_Merge/{projectId}/{worldId}/{classCode}/chunk_000.json
```

`Data_Merge` is not manually authored source data. It is a generated runtime cache.

## Index Files

```text
Data_Index/merge-index.json
Data_Index/chunk-manifest.json
Data_Index/data-version.json
```

`merge-index.json` maps `classCode:featureId` to source path, merge chunk, and content hash.

`chunk-manifest.json` lists chunk path, feature count, and content hash.

`data-version.json` records data version, generation time, source profile, merge strategy, and builder version.

## Validation Commands

```powershell
npm run validate:feature-data-contract
npm run build:feature-merge-sample
npm run verify:feature-index-sample
```

These commands operate on the bundled sample fixture and temporary outputs only. They do not modify the real OpenRIAMap-Data repository.

## Boundary

This patch does not replace current runtime data loading. It prepares the FeatureData contract for later patches such as RelayPackage apply tools, full merge builders, and incremental Split -> Merge generation.
