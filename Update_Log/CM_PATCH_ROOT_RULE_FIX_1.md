# CM_PATCH_ROOT_RULE_FIX_1

## Objective
Correct the CairnMap patch-root convention after reviewing the integrated `CM_BASELINE_AUDIT_1` baseline package.

The accepted repository root for future patch packages is:

```text
CairnMap-Web
```

The required in-project update-log path is:

```text
CairnMap-Web/Update_Log/<PATCH_ID>.md
```

## Changed Files

```text
CairnMap-Web/docs/90_roadmap-and-history/CM_BASELINE_AUDIT_1.md
CairnMap-Web/Update_Log/CM_BASELINE_AUDIT_1.md
CairnMap-Web/Update_Log/CM_PATCH_ROOT_RULE_FIX_1.md
```

## Behavior Before
The integrated `CM_BASELINE_AUDIT_1` documents still contained several framework-protocol references to `OpenRIAMap-Web/Update_Log` and described `OpenRIAMap-Web/` as a patch-root alias.

## Behavior After
The framework-protocol references now use `CairnMap-Web/Update_Log` and explicitly reject `OpenRIAMap-Web/` as the target-root alias for future CairnMap patches.

## Compatibility Notes
This patch changes documentation and patch protocol wording only. It does not alter runtime code, project configuration, schemas, data loading, map behavior, or deployment behavior.

Historical filenames or older changelog entries that refer to old `OpenRIAMap-Web_*` package names are left untouched because they describe legacy baseline archives rather than the current patch-root requirement.

## Validation

```text
npm run validate:project-config  PASS
npm run audit:project-config     PASS
npm run inspect:project-config   PASS
npm run build                    NOT COMPLETED
```

`npm run build` still fails in the uploaded package environment at Vite execution because `node_modules/.bin/vite` is not executable in this extracted archive. This is inherited from the uploaded package state and is unrelated to this documentation-only patch.

## Rollback Notes
Remove this patch's update-log entry and revert the two `CM_BASELINE_AUDIT_1` documentation edits if the project intentionally returns to `OpenRIAMap-Web` as the target repository root.

## Handoff Note
All future CairnMap patch packages should use `CairnMap-Web` as the repository root in the patch file, README, manifest, validation summary, `changed-files/` tree, and in-project `Update_Log` path.
