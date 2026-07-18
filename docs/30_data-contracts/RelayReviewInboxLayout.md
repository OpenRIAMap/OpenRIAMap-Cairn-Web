# Relay Review Inbox Layout

`RELAY_REVIEW_WORKFLOW_CORE_1` defines a repository-side layout for managing RelayPackage review state.

## Recommended structure

```text
RelayPackages/
  pending/
  prechecked/
  accepted/
  rejected/
  failed/
  archived/
```

A package review record should use a stable package directory:

```text
RelayPackages/
  pending/
    RelayPackage_Aunst-639_zth_202605171818/
      package.zip
      review-status.json
      reports/
        precheck-report.json
        pipeline-report.json
```

For repository samples, the package directory may contain only `review-status.json` and report placeholders, while `review-status.json.package.path` points to an existing package sample.

## Bucket meanings

| Bucket | Meaning |
|---|---|
| `pending` | Package is waiting for precheck or human review. |
| `prechecked` | Precheck passed and the package is ready for accept review. |
| `accepted` | Package has passed accept flow and is ready for merge/release handling. |
| `rejected` | Reviewer rejected the package. |
| `failed` | Automation failed and requires investigation. |
| `archived` | Historical package record retained for audit. |

## Safety rule

This patch does not automatically move packages between buckets. Movement should be explicit and can be implemented by a later review-flow or Admin patch.
