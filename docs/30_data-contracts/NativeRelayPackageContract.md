# Native RelayPackage Contract

Patch: `CM_RELAY_PACKAGE_PROTOCOL_1`

## Purpose

The Native RelayPackage contract formalizes the current CairnMap collaborative editing package format.

A package is a portable edit bundle. It contains complete feature JSON records for upsert, a delete table for deletion intent, picture files, metadata, and review feedback.

## Contract roots

| Root | Required | Meaning |
|---|---:|---|
| `INDEX.json` | yes | Package metadata and counters. |
| `Delete.json` | yes | Delete table. Empty `items` means no deletion. |
| `Review.json` | yes from this patch onward | Review/precheck feedback. |
| `Data_Spilt/` | yes | Complete feature records to add or overwrite. |
| `Picture/` | optional | Picture files to add or overwrite. |
| `Tool_Refresh/` | optional | Package-local helper scripts. |

## Feature upsert rule

Every JSON file under `Data_Spilt/{worldId}/{classCode}/.../{featureId}.json` is interpreted as the complete desired final state of that feature.

The validator checks that:

- `worldId` is registered in `worlds.json`.
- The numeric `World` field maps back to the same registered world.
- `classCode` is registered in class configs.
- The file name matches the registered ID field, normally `ID`.
- The JSON `Class` field matches the path class code.

This means the package does not need separate `addFeature` or `updateFeature` operations. The apply/review layer can decide whether a record is an addition or an overwrite by comparing the package against the target data repository.

## Delete rule

`Delete.json` contains destructive intent. A blank delete table is valid:

```json
{
  "deleteTime": "2026-05-17T10:18:08.525Z",
  "items": []
}
```

Future delete items should be explicit and human-readable:

```json
{
  "worldId": "zth",
  "classCode": "BUD",
  "featureId": "ZBUD_example",
  "path": "Data_Spilt/zth/BUD/ZBUD_example.json",
  "reason": "optional review note"
}
```

## Picture rule

Picture files keep the existing native layout:

```text
Picture/{worldId}/{classCode}/.../{featureId}/image.webp
```

`CM_RELAY_PACKAGE_PROTOCOL_1` does not convert pictures into MediaIndex records. MediaIndex remains a later patch.

## Review rule

`Review.json` carries precheck and review feedback. This avoids adding many package-level files while still providing a place for review status, warnings, errors, and decision notes.

## Sample package

The sample package is based on the uploaded `RelayPackage_Aunst-639_zth_202605171818.zip` and is stored at:

```text
docs/30_data-contracts/examples/native-relay-package-sample/
```

The sample intentionally preserves the native structure:

```text
Data_Spilt/
Picture/
Delete.json
INDEX.json
Tool_Refresh/
Review.json
```

## Tooling boundary

The included tools validate and preview the package. They do not apply the package to the real data repository.
