# Native Relay Apply Commit Contract

Patch ID: `DATA_RELAY_APPLY_COMMIT_1`

## Purpose

This contract defines the protected local write mode for CairnMap Native RelayPackage application.
It extends the existing dry-run apply chain with an explicit `--write` mode that can write an accepted package into local target data roots.

The command remains safe by default. Without `--write`, it only produces reports and does not modify target data.

## Inputs

The apply command accepts either a Native RelayPackage directory or a `.zip` package:

```powershell
node ./scripts/relay/apply-native-relay-package.mjs `
  --relay "D:/CairnTest/RelayPackage_Aunst-639_zth_202605171818.zip" `
  --feature-data "D:/CairnTest/OpenRIAMap-Data/Data_Spilt" `
  --picture-root "D:/CairnTest/OpenRIAMap-Data/Picture" `
  --media-index-root "D:/CairnTest/OpenRIAMap-Data/Media_Index_Spilt" `
  --out ".cairnmap-tmp/aunst-apply-report"
```

The command uses the same Native RelayPackage input resolver introduced by `CM_NATIVE_RELAY_CONFIG_RESOLVER_1`. It supports directory input, zip input, single root-folder wrapped zips, and ignores `.DS_Store` / `__MACOSX` artifacts.

## Write Mode

Write mode is enabled only by adding:

```powershell
--write
```

Without `--write`, the command produces:

```text
apply-report.json
 dry-run-report.json
feature-writes.json
picture-writes.json
media-index-writes.json
backup-manifest.json
```

but does not write target roots.

With `--write`, the command may write:

```text
Data_Spilt/
Picture/
Media_Index_Spilt/
```

It does not write:

```text
Data_Merge/
Media_Index_Merge/
Git commits
GitHub Actions state
Admin review state
```

## Target Write Semantics

### Feature JSON

Relay package `Data_Spilt` files are interpreted as complete upsert payloads.

```text
create    -> write new feature JSON
update    -> overwrite feature JSON and record old/new hash
unchanged -> skip
```

Delete items from `Delete.json` are applied only when the target file exists.
Missing delete targets are recorded as skipped unless strict delete mode is requested.

### Picture Files

Relay package `Picture` files are copied into the target picture root.

```text
create    -> copy file
overwrite -> overwrite file and record old/new hash
unchanged -> skip
```

### MediaIndex

The media plan produced by the dry-run chain is written into:

```text
Media_Index_Spilt/assets/{mediaId}.json
Media_Index_Spilt/bindings/{worldId}/{classCode}/{kindPath...}/{featureId}.json
```

This initializes the source-side MediaIndex records. It does not build the runtime `Media_Index_Merge` cache.

## Safety Rules

The command enforces these rules in write mode:

1. `--write` is required for target changes.
2. `--feature-data`, `--picture-root`, and `--media-index-root` must be explicitly provided.
3. Target roots must not overlap the RelayPackage input root.
4. Target roots must not overlap the report output root.
5. Target roots must not be inside `.cairnmap-tmp/relay-input`.
6. Target paths must stay under their declared root.
7. Dry-run errors stop the write phase.
8. `--backup` copies overwritten/deleted target files into the output report directory.
9. `--no-overwrite` blocks feature, picture, and MediaIndex overwrite writes.
10. `--strict-delete` turns missing delete targets into fatal errors.

## Report Files

The output root contains:

```text
apply-report.json
 dry-run-report.json
feature-writes.json
delete-writes.json
picture-writes.json
media-index-writes.json
backup-manifest.json
```

`apply-report.json` uses schema:

```text
project-config/schemas/relay/cairnmap.native-relay-apply-report.v1.schema.json
```

## Boundary

This patch intentionally does not rebuild `Data_Merge` or `Media_Index_Merge`. Those runtime caches should be handled by a later local build patch.
