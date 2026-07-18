# RelayPackage Protocol Reference

Patch: `CM_RELAY_PACKAGE_PROTOCOL_1`

This reference defines the CairnMap Native RelayPackage protocol for the current Cairn distributed framework implementation.

The protocol intentionally keeps the existing editable package shape instead of replacing it with a complex operation-array format.

## Contract status

`CM_RELAY_PACKAGE_PROTOCOL_1` is contract-only.

It adds schemas, documentation, a real native sample package, and local validation/preview tools. It does not connect the main site UI, does not call GitHub APIs, and does not write into the official data repository.

## Native package shape

```text
RelayPackage/
  INDEX.json
  Delete.json
  Review.json
  Data_Spilt/
    {worldId}/
      {classCode}/
        {featureId}.json
        {kind}/
          {featureId}.json
  Picture/
    {worldId}/
      {classCode}/
        {featureId}/
          image files
        {kind}/
          {featureId}/
            image files
  Tool_Refresh/
```

## Semantics

| Area | Meaning |
|---|---|
| `Data_Spilt` | Complete feature JSON records to upsert into the target data repository. A record may be new or may overwrite an existing feature after review. |
| `Delete.json` | Delete table. Items in this file express deletion intent. Empty `items` means no deletion. |
| `Picture` | Media files to add or replace under the native picture path. |
| `INDEX.json` | Package metadata, operator, notes, export timestamp, package version, and counters. |
| `Review.json` | Review/precheck feedback and decision record added by this patch. |
| `Tool_Refresh` | Optional helper tools shipped with a package. They remain package-local and are not part of the frontend runtime. |

## Why native relay does not use operation arrays

The current package design is already suitable for collaborative editing because the package contains final editable JSON records. Reviewers can inspect or directly edit the exact records that will be upserted. Delete intent is separated into `Delete.json`, which keeps destructive operations explicit.

Therefore, native v1 does not require files such as:

```text
relay-package.json
manifest.json
featureOps[]
mediaOps[]
relationOps[]
```

Those may remain a future generic abstraction, but they are not part of `CM_RELAY_PACKAGE_PROTOCOL_1`.

## Metadata fields

`INDEX.json` currently supports the existing fields:

```json
{
  "schemaVersion": "1.0.0",
  "operator": "Aunst-639",
  "note": "...",
  "version": "draft-20260517-181808",
  "packageVersion": "draft-20260517-181808",
  "exportedAt": "2026-05-17T10:18:08.525Z",
  "featureCount": 39,
  "pictureCount": 1,
  "deleteCount": 0
}
```

Future packages may add optional fields such as:

```json
{
  "projectId": "openriamap-ria",
  "worldId": "zth",
  "baseDataVersion": "data-version-at-export",
  "packageStatus": "pending"
}
```

`baseDataVersion` is recommended for future conflict detection, but it is not mandatory in this patch because existing packages may use `version` / `packageVersion` as their available version record.

## Review.json

`Review.json` is the only new package-level file introduced by this patch.

```json
{
  "schemaVersion": "cairnmap.native-relay-review.v1",
  "status": "pending",
  "reviewer": null,
  "reviewedAt": null,
  "decision": null,
  "notes": [],
  "precheck": {
    "status": "not-run",
    "warnings": [],
    "errors": []
  },
  "history": []
}
```

Allowed status values:

```text
draft
pending
prechecked
accepted
rejected
skipped
applied
archived
```

## Registered world and class interpretation

Native RelayPackage paths are interpreted using the existing CairnMap registration system.

For example, `worlds.json` maps `zth` to numeric world code `0`, so feature records with `"World": 0` are valid under `Data_Spilt/zth/...`.

Class directories such as `ISG/NGF` are also valid when they follow the registered class and kind system. `ISG` is the class code and `NGF` is the first classification directory for records whose `Kind` is `NGF`.

## Scripts

```powershell
npm run validate:native-relay-package
npm run preview:native-relay-package
npm run refresh:native-relay-meta
```

Optional package root:

```powershell
npm run validate:native-relay-package -- --package docs/30_data-contracts/examples/native-relay-package-sample
```

`refresh:native-relay-meta` writes refreshed metadata to `.cairnmap-tmp/native-relay-package-sample/` by default. Use `--write` only when intentionally updating the target package `INDEX.json`.

## Compatibility boundary

This patch does not change active site data loading. The site still uses the existing `sourceLinkModes.json + dataSources.json + Data_Merge` runtime chain.
