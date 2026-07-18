# Native RelayPackage Precheck Action Contract

## Purpose

`ACTIONS_RELAY_PRECHECK_1` defines a read-only CI precheck for Native RelayPackage submissions. The precheck validates a RelayPackage and runs the existing local relay pipeline in dry-run mode so reviewers can inspect whether a package is structurally valid before any write, commit, merge, or deployment step exists.

This contract is intentionally limited to precheck behavior. It does not accept, apply, merge, or publish package contents.

## Input

The action accepts a Native RelayPackage directory or `.zip` path that is available in the GitHub Actions checkout.

Required input:

```text
relay_package_path
```

Optional inputs:

```text
project_id       default: openriamap-ria
data_root        optional dry-run comparison root if available in the runner checkout
strict_worlds    default: false
```

## Processing stages

The precheck runs these stages:

```text
Native RelayPackage path
  -> validate-native-relay-package
  -> run-native-relay-local-pipeline in dry-run mode
  -> copy child reports
  -> write precheck-report.json
```

The local pipeline remains in dry-run mode. The precheck command must not pass `--write` to the pipeline.

## Output

The default output directory is:

```text
.cairnmap-actions/native-relay-precheck/
```

Expected files:

```text
precheck-report.json
pipeline-report.json
apply-report.json
feature-merge-build-report.json
media-index-build-report.json
02_pipeline/
```

The GitHub workflow uploads this directory as an artifact named:

```text
native-relay-precheck
```

## Write policy

This patch is read-only. It must not write any production data directories:

```text
Data_Spilt/
Picture/
Media_Index_Spilt/
Data_Merge/
Data_Index/
Media_Index_Merge/
```

It must not create commits, open pull requests, merge branches, or trigger deployment.

## Failure behavior

The precheck fails when:

```text
RelayPackage validation fails
Local dry-run pipeline fails
An unsupported write mode is requested
Precheck output overlaps unsafe paths
```

Warnings, including legacy MediaIndex path normalization warnings, are preserved in `precheck-report.json` but are not fatal unless the child command fails.

## Relationship to later patches

This action is the preflight step for a future accept workflow. The later accept workflow may use the same local pipeline, but only after explicit reviewer approval and with protected write/commit semantics.
