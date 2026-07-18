# Native RelayPackage Accept Action Contract

Patch: `ACTIONS_RELAY_ACCEPT_GUARDS_1`

## Purpose

`ACTIONS_RELAY_ACCEPT_GUARDS_1` hardens the write-capable Native RelayPackage accept stage. It keeps the `ACTIONS_RELAY_ACCEPT_1` behavior, but adds explicit safety guards for RelayPackage locations, data roots, target branches, commit paths, and workflow permissions.

This remains the write-capable counterpart of `ACTIONS_RELAY_PRECHECK_1`.

## Scope

The accept action may run the following chain:

```text
Native RelayPackage zip/dir
  -> validate accept guards
  -> validate Native RelayPackage
  -> run native relay local pipeline
  -> optionally write Data_Spilt / Picture / Media_Index_Spilt
  -> rebuild Data_Merge / Data_Index
  -> rebuild Media_Index_Merge
  -> verify generated outputs
  -> generate accept-report.json
  -> optionally create/push an accept branch commit
```

## Safety guards

The accept action enforces these repository-facing rules:

```text
RelayPackage input:
  docs/30_data-contracts/examples/native-relay-package-sample
  RelayPackages/pending
  RelayPackages/prechecked

Write-mode data root:
  OpenRIAMap-Data
  .cairnmap-tmp/native-relay-accept-data-root
  .cairnmap-actions/native-relay-accept/data-root-preview

Commit/push target branch:
  accept/native-relay/*
```

The following branches are rejected as commit or push targets:

```text
main
master
production
prod
release
gh-pages
```

The action also rejects path traversal, filesystem roots, and overlapping relay/data/output directories.

## Write and commit switches

The action is intentionally protected by separate switches:

```text
--write
  enables data-root writes through the local pipeline

--commit-changes
  enables git branch creation and commit after a successful write pipeline

--push
  enables pushing the accept branch after the commit
```

`--commit-changes` requires `--write`.

`--push` requires `--commit-changes`.

When `--commit-changes` is enabled, `--data-root` must be inside the repository checkout so that only repository-tracked data changes can be staged.

## Commit path guard

When changes are staged, only these children of `data_root` are allowed:

```text
Data_Spilt/
Picture/
Media_Index_Spilt/
Data_Merge/
Data_Index/
Media_Index_Merge/
```

Any staged file outside those child paths causes the git stage to fail before commit.

## Optional precheck linkage

The accept report can record:

```text
precheckReport
precheckRunId
```

This patch records those fields for traceability. It does not yet enforce that a matching precheck report exists or passed.

## Report outputs

The action writes:

```text
.cairnmap-actions/native-relay-accept/
  accept-report.json
  git-diff-summary.txt
  01_pipeline/
    pipeline-report.json
    01_apply/
      apply-report.json or dry-run-report.json
    02_feature_merge/
      build-report.json
    03_media_index/
      build-report.json
```

`accept-report.json` includes a `guards` block containing the checked relay path, data root, branch, and guard warning/error counts.

## Non-goals

`ACTIONS_RELAY_ACCEPT_GUARDS_1` does not:

```text
merge to main automatically
deploy the website
delete or archive the source RelayPackage
provide an Admin UI review button
enforce a passed precheck report
bypass Native RelayPackage validation
bypass the local pipeline verification steps
```
