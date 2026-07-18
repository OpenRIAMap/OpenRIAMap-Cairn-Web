# Native RelayPackage Accept Action Guide

Patch: `ACTIONS_RELAY_ACCEPT_GUARDS_1`

## Local dry-run

This command validates the sample RelayPackage and runs the accept wrapper without writing to a data root:

```powershell
npm run action:native-relay-accept
```

Expected result:

```text
Write mode: disabled
Commit changes: disabled
Push changes: disabled
Final result: PASS
```

The default command is intentionally safe. It does not write, commit, or push.

## Guard validation

Run the guard self-check:

```powershell
npm run validate:native-relay-accept-guards
```

This confirms the default accept configuration satisfies the safety policy:

```text
RelayPackage: docs/30_data-contracts/examples/native-relay-package-sample
Data root: .cairnmap-actions/native-relay-accept/data-root-preview
Target branch: accept/native-relay/local-run
Final result: PASS
```

## Accepted repository roots

The accept action is stricter than the local pipeline. It only accepts RelayPackages inside approved repository roots:

```text
docs/30_data-contracts/examples/native-relay-package-sample
RelayPackages/pending
RelayPackages/prechecked
```

Write-mode data roots are also allowlisted:

```text
OpenRIAMap-Data
.cairnmap-tmp/native-relay-accept-data-root
.cairnmap-actions/native-relay-accept/data-root-preview
```

External paths such as `D:/CairnTest/...` are still useful for lower-level local pipeline testing, but the accept action is intentionally restricted because it is the workflow-facing entry point.

## Local write test against an allowed temporary data root

Use the repo-local temporary data root below, not a production data root:

```powershell
New-Item -ItemType Directory -Force ".cairnmap-tmp/native-relay-accept-data-root" | Out-Null

node .\scripts\actions\native-relay-accept.mjs `
  --relay "docs/30_data-contracts/examples/native-relay-package-sample" `
  --data-root ".cairnmap-tmp/native-relay-accept-data-root" `
  --project-id "openriamap-ria" `
  --out ".cairnmap-actions/native-relay-accept" `
  --target-branch "accept/native-relay/local-write-smoke" `
  --write
```

The command writes through the local pipeline and generates:

```text
.cairnmap-actions/native-relay-accept/accept-report.json
.cairnmap-actions/native-relay-accept/git-diff-summary.txt
.cairnmap-actions/native-relay-accept/01_pipeline/pipeline-report.json
```

## Commit to an accept branch

Only use this when the data root is inside the current repository checkout and the target branch starts with `accept/native-relay/`:

```powershell
node .\scripts\actions\native-relay-accept.mjs `
  --relay "RelayPackages/pending/RelayPackage_Aunst-639_zth_202605171818.zip" `
  --data-root "OpenRIAMap-Data" `
  --project-id "openriamap-ria" `
  --write `
  --commit-changes `
  --target-branch "accept/native-relay/manual-test"
```

To push the branch as well:

```powershell
node .\scripts\actions\native-relay-accept.mjs `
  --relay "RelayPackages/pending/RelayPackage_Aunst-639_zth_202605171818.zip" `
  --data-root "OpenRIAMap-Data" `
  --project-id "openriamap-ria" `
  --write `
  --commit-changes `
  --push `
  --target-branch "accept/native-relay/manual-test"
```

The guards reject `main`, `master`, `production`, `prod`, `release`, and `gh-pages` as commit/push targets.

## Optional precheck linkage

The accept report may record the related precheck artifact path or GitHub Actions run id:

```powershell
node .\scripts\actions\native-relay-accept.mjs `
  --relay "RelayPackages/prechecked/RelayPackage_Aunst-639_zth_202605171818.zip" `
  --data-root "OpenRIAMap-Data" `
  --precheck-report ".cairnmap-actions/native-relay-precheck/precheck-report.json" `
  --precheck-run-id "123456789" `
  --target-branch "accept/native-relay/manual-test"
```

This patch records the linkage but does not yet require a successful precheck report. That requirement belongs in a later review-flow patch.

## GitHub Actions workflow

The workflow file is:

```text
.github/workflows/native-relay-accept.yml
```

It supports manual `workflow_dispatch` inputs:

```text
relay_package_path
project_id
data_root
target_branch
precheck_report_path
precheck_run_id
strict_worlds
write_changes
commit_changes
push_changes
```

The workflow permissions are intentionally narrow:

```yaml
permissions:
  contents: write
  actions: read
```

Recommended safe sequence:

1. Run `native-relay-precheck.yml` first.
2. Run `native-relay-accept.yml` with `write_changes=false` to produce an accept dry-run artifact.
3. Run with `write_changes=true`, `commit_changes=false` to confirm write-mode reporting in a controlled test data root.
4. Only then run with `commit_changes=true` and optionally `push_changes=true`.

## Artifact contents

The workflow uploads:

```text
.cairnmap-actions/native-relay-accept/
```

This folder contains the accept report, child pipeline reports, guard results, and git diff summary.
