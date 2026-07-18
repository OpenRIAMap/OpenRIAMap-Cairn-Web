# Relay Review Workflow Guide

This guide describes the command-line workflow introduced by `RELAY_REVIEW_WORKFLOW_CORE_1`.

## Initialize a status file

```powershell
npm run init:relay-review-status
```

This writes:

```text
.cairnmap-tmp/relay-review-workflow/review-status.json
```

## Validate a status file

```powershell
npm run validate:relay-review-status
```

## Update a status file manually

```powershell
npm run update:relay-review-status -- --status prechecked
```

Manual review decisions are also supported:

```powershell
npm run update:relay-review-status -- --decision reject --reviewer "reviewer-name" --comment "Not ready"
```

## List the sample inbox

```powershell
npm run list:relay-review-inbox
```

This writes:

```text
.cairnmap-tmp/relay-review-workflow/relay-review-inbox-list.json
```

## Sync a report into the review package

```powershell
npm run sync:relay-review-report -- --report .cairnmap-actions/native-relay-precheck/precheck-report.json
```

If no report path is provided, the command creates a small sample report for smoke testing.

## Optional action status sync

Precheck:

```powershell
npm run action:native-relay-precheck -- \
  --review-status-path .cairnmap-tmp/relay-review-workflow/review-status.json \
  --update-review-status
```

Accept:

```powershell
npm run action:native-relay-accept -- \
  --review-status-path .cairnmap-tmp/relay-review-workflow/review-status.json \
  --update-review-status
```

Actions do not update review status unless `--update-review-status` is explicitly supplied.
