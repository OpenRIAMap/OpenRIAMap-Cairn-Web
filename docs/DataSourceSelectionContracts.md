# Data Source Selection Contracts

`dataSourceSelection` is a generic, application-owned capability for choosing a data reader without embedding a deployment target in CairnMap-Web. Its machine-readable selection configuration has schema version `cairnmap.data-source-selection.v1` and is parsed by `parseDataSourceSelectionConfig`.

## Contract

- `DataSourceDefinition` supplies an identifier, display label and application-owned `readerKind`.
- `DataSourceSelectionPolicy` defines one enabled default source, `fixed`, `user-select` or `user-select-on-failure` selection, explicit application, no automatic fallback, and source-dependent cache clearing. The parser rejects `requireExplicitApply: false` and `automaticFallback: true`.
- `DataSourceSwitchPort` is implemented by the application. It aborts stale reads, clears only source-dependent caches, clears in-memory datasets and reloads the active world.
- `DataSourceSelectionFailure` names the failed source, load stage, optional world and a user-safe message. It never changes the active source.

The controller persists the selected identifier only after an explicit application request. It increments a generation on every apply (including a retry of the same source), then invokes the switch port in this order:

1. abort stale reads;
2. clear source-dependent cache entries;
3. clear in-memory datasets; and
4. reload the active world.

Any load that began on an earlier generation must be aborted or discarded by the application-owned reader. Automatic fallback is intentionally prohibited: a recovery dialog may present eligible sources, but the user must choose and explicitly apply one.

## UI integration

`DataSourceSelectionSection` and `DataSourceRecoveryDialog` deliberately reuse the existing Settings card, select, button and blocking-modal primitives. Applications provide labels and source definitions; these components do not know endpoint URLs, credentials, repository identities or provider-specific storage.

The application must mount the recovery dialog outside any closable settings surface so a request failure can be recovered even when Settings is closed. The dialog cancel path retains the current source and performs no hidden retry or switch. `DataSourceSelectionSection` may expose application-owned, selected-source supplemental settings via `renderSupplemental`; the generic component supplies selection state only and must not interpret endpoint, provider, repository or credential details.

## Downstream requirements

An application integration provides reader adapters for each `readerKind`, a concrete persistence key, scoped cache key components (`sourceId`, transport identity, release identifier, world identifier and reader schema version), and a failure-to-dialog bridge. It must validate that the configured default source is enabled and preserve one source snapshot per world load; data from distinct sources or transports must not be mixed in the same snapshot.
