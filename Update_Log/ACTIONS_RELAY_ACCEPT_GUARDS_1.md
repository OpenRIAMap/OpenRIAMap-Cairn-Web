# ACTIONS_RELAY_ACCEPT_GUARDS_1

## Objective
Harden the Native RelayPackage accept action before moving toward review status and Admin workflows.

## Changed Files
- `.github/workflows/native-relay-accept.yml`
- `scripts/actions/native-relay-action-guards.mjs`
- `scripts/actions/native-relay-accept.mjs`
- `scripts/actions/native-relay-accept-tools.mjs`
- `project-config/schemas/relay/cairnmap.native-relay-accept-guards.v1.schema.json`
- `project-config/schemas/relay/cairnmap.native-relay-accept-report.v1.schema.json`
- `docs/30_data-contracts/NativeRelayAcceptActionContract.md`
- `docs/40_maintenance/NativeRelayAcceptActionGuide.md`
- `package.json`

## Behavior Before
The accept action supported dry-run, write, commit, and push modes, but the production-facing guard policy was still broad. It did not centrally enforce allowlisted RelayPackage roots, allowlisted write data roots, protected branch rejection, or commit path validation.

## Behavior After
The accept action now validates a shared guard policy before running the accept pipeline. It enforces approved RelayPackage roots, approved write-mode data roots, `accept/native-relay/*` commit/push branches, protected branch rejection, and staged commit path validation. The GitHub Actions workflow also declares narrower permissions and accepts optional precheck linkage fields.

## Compatibility Notes
The lower-level local pipeline still supports external temporary paths for local engineering tests. The accept action is intentionally stricter because it is the workflow-facing entry point. Default accept dry-run remains safe and passes with the built-in sample package.

## Validation
Expected validation includes:

```text
npm run validate:native-relay-accept-guards
npm run action:native-relay-accept
npx tsc -b
```

Guard smoke tests should confirm that illegal data roots and illegal target branches fail, while default dry-run and allowed write-no-commit modes pass.

## Rollback Notes
Rollback by removing the guard module, removing the `validate:native-relay-accept-guards` package script, and restoring `native-relay-accept-tools.mjs` and `native-relay-accept.yml` to the previous `ACTIONS_RELAY_ACCEPT_1` behavior.

## Handoff Note
This patch prepares the accept workflow for later `RELAY_REVIEW_STATUS_PROTOCOL_1` and `ACTIONS_RELAY_REVIEW_FLOW_1`. It does not yet enforce a passed precheck report or update RelayPackage review status.
