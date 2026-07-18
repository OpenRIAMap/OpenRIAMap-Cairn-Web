# Relay Review Status Contract

`RELAY_REVIEW_WORKFLOW_CORE_1` adds a sidecar status file for Native RelayPackage review workflows.

## Purpose

`review-status.json` records where a RelayPackage is in the review lifecycle. It does not replace `INDEX.json`, `Delete.json`, or `Review.json` inside the package. It is a repository-side review record that can be updated by Actions, command-line tools, or a later Admin UI.

## Status file

```text
review-status.json
```

Required schema version:

```json
{
  "schemaVersion": "cairnmap.relay-review-status.v1"
}
```

Core fields:

```json
{
  "packageId": "RelayPackage_Aunst-639_zth_202605171818",
  "projectId": "openriamap-ria",
  "worldId": "zth",
  "status": "pending",
  "currentStage": "created",
  "precheck": {
    "status": "NOT_RUN",
    "runId": null,
    "reportPath": null
  },
  "accept": {
    "status": "NOT_RUN",
    "runId": null,
    "reportPath": null
  },
  "review": {
    "decision": null,
    "reviewer": null,
    "comment": null
  },
  "history": []
}
```

## Statuses

Allowed status values:

```text
pending
precheck_running
prechecked
precheck_failed
accepted
accept_failed
rejected
changes_requested
archived
```

Primary success path:

```text
pending -> prechecked -> accepted -> archived
```

Failure paths:

```text
pending -> precheck_failed
prechecked -> accept_failed
```

Manual review paths:

```text
pending/prechecked -> rejected
pending/prechecked -> changes_requested
```

## Action synchronization

Precheck and accept actions support optional status synchronization:

```text
--review-status-path <review-status.json>
--review-package-root <RelayPackage review root>
--update-review-status
```

By default, actions do not update status files. This preserves the previous safety model. Status writes happen only when `--update-review-status` is explicitly supplied.
