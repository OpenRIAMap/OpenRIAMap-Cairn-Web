# StorageProfiles Reference

Patch: `CM_STORAGE_PROFILE_1`

## Purpose

`storageProfiles.json` introduces the first storage-location contract for the Cairn distributed framework.

This patch does **not** replace the existing service-site data loading chain. The current runtime still reads world data through:

```text
project-config/packages/openriamap-ria/environment/sourceLinkModes.json
project-config/packages/openriamap-ria/environment/dataSources.json
OpenRIAMap-Data/Data_Merge
OpenRIAMap-Data/Picture
```

The StorageProfile layer is a forward-compatible declaration layer for later FeatureData, MediaIndex, RelayPackage, admin review, and automation patches.

## File Location

```text
CairnMap-Web/project-config/packages/openriamap-ria/environment/storageProfiles.json
```

Schema:

```text
CairnMap-Web/project-config/schemas/environment/cairnmap.storage-profiles.v1.schema.json
```

Validator:

```text
npm run validate:storage-profiles
```

## Contract Boundary

`CM_STORAGE_PROFILE_1` is a contract-only patch.

It may declare where the following repositories or storage areas live:

```text
featureData
media
mediaIndex
relayPool
```

It must not make the current website switch from `dataSources.json` to StorageProfile-based loading.

Runtime replacement is reserved for later patches after the relevant adapters and compatibility tests exist.

## Config Shape

Top-level shape:

```json
{
  "schemaVersion": "cairnmap.storage-profiles.v1",
  "projectId": "openriamap-ria",
  "runtimeStatus": "contract-only",
  "defaults": {
    "featureData": "featureData.github.currentOpenRIAMapData",
    "media": "media.github.currentOpenRIAMapDataPicture",
    "mediaIndex": "mediaIndex.github.plannedOpenRIAMapData",
    "relayPool": "relayPool.github.plannedCairnMapRelayPool"
  },
  "profiles": []
}
```

Each profile should include:

```json
{
  "id": "featureData.github.currentOpenRIAMapData",
  "role": "featureData",
  "kind": "github-repo",
  "mode": "external",
  "owner": "Ozstk639",
  "repo": "OpenRIAMap-Data",
  "branch": "main",
  "root": "",
  "paths": {
    "splitRoot": "Data_Spilt",
    "mergeRoot": "Data_Merge"
  }
}
```

## Roles

| Role | Meaning |
|---|---|
| `featureData` | Formal feature JSON repository. Future source: `Data_Spilt`; runtime cache: `Data_Merge`. |
| `media` | Actual image or media object storage. Current compatibility target: `Picture`. |
| `mediaIndex` | Future media asset and feature-media binding index area. |
| `relayPool` | Future RelayPackage submission and review repository. |

## Kinds

Supported `kind` values are reserved as:

```text
internal-path
github-repo
raw-compatible
object-storage
api
database
```

`CM_STORAGE_PROFILE_1` uses `github-repo` because the current and planned repositories are GitHub-backed.

Future patches may activate `raw-compatible`, `object-storage`, `api`, or `database` only after the matching adapter, validation, and documentation exist.

## Modes

| Mode | Meaning |
|---|---|
| `internal` | The storage root is inside the current web repository. |
| `external` | The storage root is in another repository or external storage location. |
| `planned` | The profile is reserved but not yet active. |

The current OpenRIAMap feature and picture profiles are external because they point to `OpenRIAMap-Data` rather than the web source package.

## Current Compatibility Rule

The current active website behavior remains:

```text
sourceLinkModes.json selects the raw-compatible base URL.
dataSources.json keeps per-world sourceMode: dat.
Rules loading continues to resolve Data_Merge and Picture with the existing logic.
```

Therefore every profile added by this patch declares:

```json
{
  "compatibility": {
    "currentRuntimeReplacement": false
  }
}
```

Write operations are also disabled in this patch:

```json
{
  "write": {
    "enabled": false
  }
}
```

## Validation Rules

`npm run validate:storage-profiles` checks:

1. `storageProfiles.json` exists and parses.
2. The schema file exists and parses.
3. The schema version is `cairnmap.storage-profiles.v1`.
4. Profile IDs are unique.
5. Required roles are present: `featureData`, `media`, `mediaIndex`, `relayPool`.
6. Defaults point to existing profile IDs.
7. GitHub repository profiles include `owner`, `repo`, and `branch`.
8. Role-specific path requirements exist.
9. Contract-only profiles do not accidentally enable writes.
10. The patch does not claim to replace the current data runtime.

## Future Migration Path

Recommended sequence after this patch:

```text
CM_STORAGE_PROFILE_1
  -> DATA_FEATURE_REPO_CONTRACT_1
  -> CM_RELAY_PACKAGE_PROTOCOL_1
  -> DATA_MEDIA_INDEX_CONTRACT_1
  -> DATA_RELAY_APPLY_LOCAL_1
  -> CM_SERVICE_SUBMIT_MODULE_1
  -> CM_ADMIN_REVIEW_MODULE_1
```

The key principle is that StorageProfile starts as a declaration layer. Actual reads and writes should move behind adapters only after the FeatureData, RelayPackage, MediaIndex, and validation layers are stable.
