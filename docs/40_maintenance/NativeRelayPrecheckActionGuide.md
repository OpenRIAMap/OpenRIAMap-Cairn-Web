# Native RelayPackage Precheck Action Guide

## Local smoke test

Run the precheck against the checked-in sample package:

```powershell
npm run action:native-relay-precheck
```

Run the precheck against a local RelayPackage zip:

```powershell
node .\scripts\actions\native-relay-precheck.mjs `
  --relay "D:/CairnTest/RelayPackage_Aunst-639_zth_202605171818.zip" `
  --out ".cairnmap-actions/native-relay-precheck" `
  --project-id "openriamap-ria"
```

The command is read-only. It always runs the local pipeline without `--write`.

## Optional dry-run baseline

If a local data root is available and should be used for comparison, pass:

```powershell
node .\scripts\actions\native-relay-precheck.mjs `
  --relay "D:/CairnTest/RelayPackage_Aunst-639_zth_202605171818.zip" `
  --data-root "D:/CairnTest/OpenRIAMap-Data" `
  --project-id "openriamap-ria"
```

This still does not write to the data root.

## GitHub Actions manual trigger

The workflow is:

```text
.github/workflows/native-relay-precheck.yml
```

Use the manual workflow inputs:

```text
relay_package_path: path to RelayPackage zip or directory inside the repository
project_id: openriamap-ria
data_root: optional comparison root
strict_worlds: false
```

The workflow uploads the artifact:

```text
native-relay-precheck
```

The main file to inspect is:

```text
precheck-report.json
```

## Expected success output

A passing run should end with:

```text
Final result: PASS
```

The report summary should show:

```text
validate-relay-package: PASS
dry-run-local-pipeline: PASS
writeEnabled: false
```

## Scope boundary

This action does not accept a RelayPackage. It does not write to a data repository, commit changes, open a pull request, merge branches, or deploy the website. Those behaviors belong to a later accept/action patch.
