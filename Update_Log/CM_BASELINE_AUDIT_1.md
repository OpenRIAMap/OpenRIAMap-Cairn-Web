# CM_BASELINE_AUDIT_1

## Objective

Record the real current Web/Data baseline before implementing the `CAIRN_DIST_FRAMEWORK_1` distributed framework patches.

This patch is documentation-only. It does not change runtime behavior, TypeScript logic, configuration files, schemas, package scripts, UI components, or data files.

## Changed Files

```text
CairnMap-Web/docs/90_roadmap-and-history/CM_BASELINE_AUDIT_1.md
CairnMap-Web/Update_Log/CM_BASELINE_AUDIT_1.md
```

## Behavior Before

The project already had a config-first Web baseline and an existing external Data repository, but the exact handoff baseline for the distributed framework migration was not recorded inside the Web repository.

Important unrecorded facts included:

```text
- Web package root is CairnMap-Web in the uploaded archive.
- Update_Log already exists.
- RIA environment config is under project-config/packages/openriamap-ria/environment/.
- Current world data source mode is dat.
- Current Data_Merge and Picture URLs are resolved through sourceLinkModes.
- Current Data repository already contains Data_Spilt, Data_Merge, Picture, Data_Merge_Tool, and old RelayPackage semantics.
- Current validation/audit scripts pass, while production build requires a clean install environment.
```

## Behavior After

The baseline is now documented in-project.

Future patches can refer to:

```text
CairnMap-Web/docs/90_roadmap-and-history/CM_BASELINE_AUDIT_1.md
```

for the current source structure, data loading chain, Data repository compatibility requirements, validation results, and next safe patch landing points.

No application behavior changes.

## Compatibility Notes

This patch intentionally preserves all existing behavior.

Later patches must preserve compatibility with:

```text
- sourceLinkModes.json
- dataSources.json
- Data_Merge runtime loading
- Picture runtime loading
- old RelayPackage parsing/serialization
- Data_Merge_Tool-oriented Data repository semantics
```

The next recommended patch is `CM_STORAGE_PROFILE_1`, but it should introduce the StorageProfile contract without replacing the current data loading chain in the same patch.

## Validation

Commands run against the uploaded Web baseline:

```text
npm run validate:project-config  PASS
npm run audit:project-config     PASS
npm run inspect:project-config   PASS
```

Production build check:

```text
npm run build  NOT COMPLETED
```

Reason:

```text
The uploaded node_modules tree is not a clean install for the current execution environment.
Initial failure: sh: 1: vite: Permission denied
Diagnostic retry after chmod: missing @rollup/rollup-linux-x64-gnu optional dependency
```

Residual risk:

```text
Full Vite production build still needs confirmation after npm ci / npm install in a clean Node 20 environment.
```

## Rollback Notes

Rollback is safe and simple because this is documentation-only.

Remove:

```text
CairnMap-Web/docs/90_roadmap-and-history/CM_BASELINE_AUDIT_1.md
CairnMap-Web/Update_Log/CM_BASELINE_AUDIT_1.md
```

No generated runtime state, config migration, package-lock change, or data mutation is involved.

## Handoff Note

Use this audit as the fixed baseline for subsequent distributed framework implementation.

Recommended next patch:

```text
CM_STORAGE_PROFILE_1
```

Boundary for next patch:

```text
Introduce StorageProfile configuration, schema, docs, and validator only.
Do not replace current sourceLinkModes / Data_Merge / Picture runtime loading yet.
```
