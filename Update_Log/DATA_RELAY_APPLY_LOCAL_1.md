# DATA_RELAY_APPLY_LOCAL_1

## Objective

Introduce a reusable local Native RelayPackage dry-run apply prototype.

The toolchain can read a real local Native RelayPackage directory and caller-provided local FeatureData / Picture baselines, then generate comparison reports and preview outputs without writing back to official data.

## Changed Files

- `package.json`
- `project-config/schemas/relay/cairnmap.native-relay-dry-run-report.v1.schema.json`
- `scripts/relay/native-relay-apply-tools.mjs`
- `scripts/relay/compare-native-relay-package.mjs`
- `scripts/relay/apply-native-relay-package-dry-run.mjs`
- `docs/30_data-contracts/NativeRelayApplyLocalContract.md`
- `docs/40_maintenance/NativeRelayApplyLocalGuide.md`
- `Update_Log/DATA_RELAY_APPLY_LOCAL_1.md`

## Behavior Before

CairnMap had contract-level definitions for StorageProfile, FeatureData, Native RelayPackage, and MediaIndex.

Native RelayPackage samples could be validated, previewed, and metadata-refreshed, but there was no reusable local dry-run apply prototype that compared a package against a FeatureData/Picture baseline and generated staged preview outputs.

## Behavior After

Two local commands are available:

```powershell
npm run compare:native-relay-package
npm run dry-run:native-relay-apply
```

Both commands support external local paths through:

```text
--relay
--feature-data
--picture-root
--out
--project-id
```

The dry-run command generates:

```text
dry-run-report.json
feature-changes.json
delete-changes.json
picture-changes.json
Data_Spilt_preview/
Data_Spilt_delete_preview/
Picture_preview/
Media_Index_Spilt_preview/
Media_Index_Merge_preview/
```

## Compatibility Notes

This patch does not change the current frontend data or picture runtime.

It does not require Native RelayPackage to adopt operation arrays. It keeps the accepted package structure:

```text
INDEX.json
Delete.json
Review.json
Data_Spilt/
Picture/
Tool_Refresh/
```

It preserves current CairnMap nested paths such as `ISG/NGF`.

## Validation

Expected validation commands:

```powershell
npm run validate:project-config
npm run audit:project-config
npm run inspect:project-config
npm run validate:storage-profiles
npm run validate:feature-data-contract
npm run validate:native-relay-package
npm run validate:media-index-contract
npm run compare:native-relay-package
npm run dry-run:native-relay-apply
npx tsc -b
npm run build
```

`npm run build` may still fail in uploaded zip environments if `node_modules/.bin/vite` does not preserve executable permissions. In that case, run `npm ci` before the production build.

## Rollback Notes

Rollback by removing the new dry-run schema, relay apply scripts, maintenance/data-contract docs, npm scripts, and this update log.

No runtime data files or frontend modules are changed.

## Handoff Note

After this patch is accepted, the framework has a local dry-run apply prototype. The next logical step is a controlled local commit/apply tool or GitHub Actions precheck, but only after this dry-run behavior is reviewed against real local packages.
