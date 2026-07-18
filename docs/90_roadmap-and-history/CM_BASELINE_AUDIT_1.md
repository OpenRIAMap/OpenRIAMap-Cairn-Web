# CM_BASELINE_AUDIT_1

## Objective

This audit fixes the real implementation baseline before the `CAIRN_DIST_FRAMEWORK_1` distributed framework patches begin.

It records the current Web package, the current Data package, the existing configuration/runtime chain, available validation commands, and the compatibility risks that must be preserved by later patches.

This patch intentionally does not change runtime logic, configuration contracts, TypeScript behavior, package scripts, schemas, data source files, or UI behavior.

## Source Packages Inspected

| Package | Observed root | Notes |
|---|---|---|
| `CairnMap-Web_ENH_2B.zip` | `CairnMap-Web/` | Current Web source baseline. The patch package uses `CairnMap-Web/` as the target root. Do not use `OpenRIAMap-Web/` as a target-root alias for future CairnMap patches. |
| `OpenRIAMap-Data.zip` | `OpenRIAMap-Data/` | Current Data repository baseline. Used for compatibility audit only; no Data files are changed by this patch. |
| `CAIRN_DIST_FRAMEWORK_1_FULL_HANDOFF.*` | handoff package | Framework blueprint, patch queue, and packaging rules. |

## Web Repository Baseline

Observed root after extraction:

```text
CairnMap-Web/
```

Relevant top-level directories:

```text
.git/                 present in uploaded package, ignored for patch generation
node_modules/         present in uploaded package, ignored for patch generation
Update_Log/           present
docs/                 present
project-config/       present
public/               present
scripts/              present
src/                  present
README/               present
```

Non-vendored file count used for patch baseline: `580` files after excluding `.git`, `node_modules`, and `dist`.

### Existing Update_Log State

`Update_Log/` already exists in the Web package. Later patches must add their own in-project log entry under:

```text
CairnMap-Web/Update_Log/<PATCH_ID>.md
```

For this patch, the required entry is:

```text
CairnMap-Web/Update_Log/CM_BASELINE_AUDIT_1.md
```

### Existing Project Config Structure

The current baseline already uses the config-first package/preset structure:

```text
project-config/
  assemblies/
  packages/
  presets/
  schemas/
```

The RIA environment configuration is currently located at:

```text
project-config/packages/openriamap-ria/environment/
  dataSources.json
  ruleButtons.json
  searchProfiles.json
  sourceLinkModes.json
  worlds.json
```

The currently configured worlds reported by the config inspector are:

```text
zth, naraku, houtu, eden, laputa, yunduan
```

The current class count reported by the config inspector is `16`.

## Current Runtime Data Source Chain

The current Rules data chain is still the legacy-compatible `dat` chain, not the new `StorageProfile` abstraction.

### Environment Declaration

`project-config/packages/openriamap-ria/environment/dataSources.json` declares each world with:

```json
{
  "sourceMode": "dat",
  "pictureSourceMode": "dat"
}
```

### Source Link Modes

`project-config/packages/openriamap-ria/environment/sourceLinkModes.json` currently defines two raw-compatible link modes:

```text
cdn639       -> https://data.ozk639.top          default
github_raw   -> https://raw.githubusercontent.com
```

Runtime selection is stored under:

```text
cairnmap_source_link_mode_v1
```

with legacy storage key compatibility for:

```text
ria_source_link_mode_v1
```

### Runtime Resolution

The current data root is hard-coded through the OpenRIAMap data repository resolver:

```text
owner:  OpenRIAMap
repo:   OpenRIAMap-Data
branch: main
```

The current runtime resolves:

```text
Data_Merge base -> {rawCompatibleBaseUrl}/OpenRIAMap/OpenRIAMap-Data/main/Data_Merge
Picture base    -> {rawCompatibleBaseUrl}/OpenRIAMap/OpenRIAMap-Data/main/Picture
```

Important implementation files:

```text
src/components/Rules/data/ruleDataSources.ts
src/components/Rules/data/sourceLinkModes.ts
src/components/Rules/data/sourceConfig.ts
src/components/Rules/data/sourceResolver.ts
src/components/Rules/data/dataRepositoryReader.ts
src/components/Rules/data/worldRuleDatasetLoader.ts
src/components/Rules/cardrules/pictureRules.ts
```

### Current Load Behavior

Current flow:

```text
dataSources.json
  -> sourceMode / pictureSourceMode
  -> sourceLinkModes selected raw-compatible base
  -> OpenRIAMap/OpenRIAMap-Data/main/Data_Merge
  -> world INDEX.json
  -> class/kind INDEX.json
  -> chunk_*.json
  -> world cache
```

Current picture flow:

```text
feature ID
  -> pictureSourceMode
  -> OpenRIAMap/OpenRIAMap-Data/main/Picture
  -> world/class/kind?/INDEX.json
  -> relative file path
  -> picture file URL
```

This is the compatibility chain that `CM_STORAGE_PROFILE_1` must not break.

## Current Relay / Mapping State

The Web baseline already contains a RelayPackage-oriented mapping workflow. Relevant files include:

```text
src/components/Mapping/core/relayPackageDraft.ts
src/components/Mapping/core/relayPackageParser.ts
src/components/Mapping/core/relayPackageSerializer.ts
src/components/Mapping/core/relayPackageToolRefresh.ts
src/components/Mapping/panels/FeaturePictureBindingPanel.tsx
```

The current RelayPackage semantics are still aligned with the old Data repository protocol:

```text
RelayPackage/
  INDEX.json
  Delete.json
  Data_Spilt/
  Picture/
```

The current semantics are create / overwrite / delete, with pictures treated as feature-attached resources rather than independent media objects.

The future `CAIRN_DIST_FRAMEWORK_1` protocol expands this toward generic operations such as `addFeature`, `updateFeature`, `deleteFeature`, `addMediaAsset`, `bindMedia`, and `unbindMedia`. Later patches must bridge old RelayPackage semantics instead of deleting the existing workflow abruptly.

## Data Repository Baseline

Observed root after extraction:

```text
OpenRIAMap-Data/
```

Observed top-level structure:

```text
Data_Spilt/
Data_Merge/
Picture/
Data_Merge_Tool/
docs/
README.md
```

Observed file counts:

```text
Data_Spilt       1012 files
Data_Merge        163 files
Picture           128 files
Data_Merge_Tool   168 files
Total non-git    1477 files
```

The Data repository is not only a protocol sketch. Its README identifies it as a formal maintenance repository covering:

```text
Data_Spilt
Data_Merge
Picture
Data_Merge_Tool
RelayPackage
cold archive workflow
```

Current Data repository semantics:

```text
Data_Spilt = source layer, one feature per file
Data_Merge = Web runtime read/cache layer, generated by Data_Merge_Tool
Picture = feature-attached picture resources by feature ID
Data_Merge_Tool = formal maintenance, validation, rebuild, archive, and push entry
```

Compatibility implication:

```text
Future FeatureData / MediaIndex / RelayPackage patches must migrate from or bridge this existing Data repository shape. They must not assume a blank repository or an already-existing new MediaIndex layout.
```

## Available NPM Scripts

Relevant scripts observed in `package.json`:

```text
npm run validate:project-config
npm run audit:class-config
npm run audit:display-config
npm run audit:schema-format
npm run audit:format-executors
npm run audit:render-format-final
npm run audit:card-config
npm run audit:workflow-config
npm run audit:package-assembly
npm run audit:legacy-definition
npm run audit:project-config
npm run inspect:project-config
npm run build
```

## Validation Results

Validation was run against the uploaded Web baseline.

```text
npm run validate:project-config  PASS
npm run audit:project-config     PASS
npm run inspect:project-config   PASS
```

`npm run build` was attempted and did not complete in the uploaded-package environment.

First attempt:

```text
npm run build
sh: 1: vite: Permission denied
```

After marking the uploaded `node_modules/.bin/vite` executable for local diagnosis, the build progressed to Rollup loading and then failed because the uploaded `node_modules` tree lacks the platform optional dependency:

```text
Error: Cannot find module @rollup/rollup-linux-x64-gnu
```

Additional environment note:

```text
package.json engines: Node 20.x
observed runtime during failed build: Node.js v22.16.0
```

Conclusion:

```text
The three config/audit/inspection checks passed. Production build is not validated from this uploaded archive because the vendored node_modules tree is not a clean install for the current runtime environment. Re-run build after npm ci / npm install in a clean Node 20 environment.
```

## Patch Generation Method Used

This patch was generated using the required baseline-safe method:

```text
1. Extract uploaded Web package.
2. Extract uploaded Data package for audit only.
3. Create a clean patch baseline excluding .git, node_modules, and dist.
4. Add only audit documentation and the in-project Update_Log entry.
5. Generate patch from clean baseline vs modified working tree.
6. Package patch, README, manifest, validation summary, and changed-files.
```

This avoids relying on the uploaded `.git` working tree state.

## Landing Points for Next Patch

Recommended next patch:

```text
CM_STORAGE_PROFILE_1
```

Safe landing files likely include:

```text
project-config/packages/openriamap-ria/environment/storageProfiles.json
project-config/schemas/environment/storageProfiles.schema.json
src/core/project/storage/
scripts/validate-storage-profiles.mjs
docs/20_config-reference/StorageProfilesReference.md
CairnMap-Web/Update_Log/CM_STORAGE_PROFILE_1.md
```

Boundary for `CM_STORAGE_PROFILE_1`:

```text
Introduce the StorageProfile contract and validator only.
Do not replace the existing data reading chain yet.
Do not break sourceLinkModes, dataSources.json, Data_Merge loading, Picture loading, or the temporary mounted RelayPackage workflow.
```

## Compatibility Risks to Preserve

1. Current browser runtime reads `OpenRIAMap/OpenRIAMap-Data/main/Data_Merge` through raw-compatible link modes.
2. Current picture loading reads `OpenRIAMap/OpenRIAMap-Data/main/Picture` and expects feature-attached picture indexes.
3. Current Data repository uses `Data_Spilt`, `Data_Merge`, `Picture`, and `Data_Merge_Tool` with old RelayPackage semantics.
4. Current mapping workflow can parse and serialize old RelayPackage structures.
5. Future MediaIndex and generic RelayPackage design must be introduced as an abstraction layer, not as a breaking deletion of old package handling.
6. Static frontend must not store long-lived secrets.
7. RIA / OpenRIAMap must remain a preset; new storage abstractions must not hard-code RIA as Cairn Core.

## Handoff Note

After this patch, the implementation baseline is fixed for the distributed framework migration.

Proceed to `CM_STORAGE_PROFILE_1` only after applying this audit patch or otherwise preserving its findings in the working repository.
