# CM_STORAGE_PROFILE_1

## Objective
Introduce the first `StorageProfile` configuration contract for the Cairn distributed framework while preserving the current CairnMap service-site data loading behavior.

This patch declares future storage profiles for:

```text
featureData
media
mediaIndex
relayPool
```

It does not replace the existing `sourceLinkModes.json` + `dataSources.json` runtime chain.

## Changed Files

```text
CairnMap-Web/project-config/packages/openriamap-ria/environment/storageProfiles.json
CairnMap-Web/project-config/schemas/environment/cairnmap.storage-profiles.v1.schema.json
CairnMap-Web/src/core/project/environmentTypes.ts
CairnMap-Web/src/core/project/openriamapRiaEnvironment.ts
CairnMap-Web/scripts/validate-project-config.mjs
CairnMap-Web/scripts/validate-storage-profiles.mjs
CairnMap-Web/package.json
CairnMap-Web/docs/20_config-reference/StorageProfilesReference.md
CairnMap-Web/Update_Log/CM_STORAGE_PROFILE_1.md
```

## Behavior Before
The project had environment contracts for worlds, source link modes, data sources, rule buttons, and search profiles, but it had no unified profile layer describing the future locations of FeatureData, media, MediaIndex, or RelayPool storage.

The current data runtime was based on:

```text
sourceLinkModes.json
dataSources.json
OpenRIAMap-Data/Data_Merge
OpenRIAMap-Data/Picture
```

## Behavior After
The project now includes `storageProfiles.json` and a schema/validator/type bridge for it.

The declared profiles describe:

```text
featureData.github.currentOpenRIAMapData
media.github.currentOpenRIAMapDataPicture
mediaIndex.github.plannedOpenRIAMapData
relayPool.github.plannedCairnMapRelayPool
```

The TypeScript environment facade can expose the config through `getOpenRIAMapStorageProfilesConfig()` for future runtime and audit use.

## Compatibility Notes
This is a contract-only patch. It intentionally does not modify:

```text
project-config/packages/openriamap-ria/environment/dataSources.json
project-config/packages/openriamap-ria/environment/sourceLinkModes.json
Rules data loading
map rendering
picture loading
RelayPackage submission
admin review behavior
Data_Spilt or Data_Merge files
```

All profiles keep `compatibility.currentRuntimeReplacement` as `false`, and all writes remain disabled. Current website behavior should therefore remain unchanged.

## Validation

```text
npm run validate:project-config
npm run audit:project-config
npm run inspect:project-config
npm run validate:storage-profiles
npm run build
```

Validation result for this package:

```text
npm run validate:project-config      PASS
npm run audit:project-config         PASS
npm run inspect:project-config       PASS
npm run validate:storage-profiles    PASS
npm run build                        NOT COMPLETED
```

`npm run build` did not complete in the uploaded archive environment because the extracted `node_modules/.bin/vite` entry is not executable in this container package state. This is inherited from the uploaded baseline. A clean local install should rerun `npm ci` or `npm install` before production-build verification.

## Rollback Notes
To roll back this patch, remove the added `storageProfiles.json`, its schema, validator script, reference documentation, and this update log. Then revert the small TypeScript export additions, the `validate-project-config.mjs` schema-version registration, and the `package.json` script entry.

Because this patch does not replace runtime loading, rollback should not require data migration.

## Handoff Note
The next framework patch can safely build on this contract. Recommended next steps are either `DATA_FEATURE_REPO_CONTRACT_1` for formalizing `Data_Spilt`/`Data_Merge` repository semantics, or `CM_RELAY_PACKAGE_PROTOCOL_1` for defining generic user submission operations.
