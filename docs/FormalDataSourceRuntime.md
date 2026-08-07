# RIA Formal Data Source Runtime

## Ownership boundary

`CairnMap-Web` owns the generic selection controller, explicit-apply lifecycle, Settings section and failure-recovery dialog. This downstream package owns only the RIA reader bindings in `.cairn/formal-data-source-runtime.json`.

The generic layer contains no RIA endpoint, repository, COS or GitHub identity. The existing `sourceLinkModes.json` remains a separate compatibility setting for legacy raw-data consumers.

## Reader chain

For `formal-cos` and `formal-github`, one world load uses one immutable snapshot chain:

1. `current/worlds/_release-set.json`
2. `current/worlds/<worldId>.json`
3. the pointer's world manifest
4. the manifest's chunk catalog objects
5. the catalog's world-level `data-merge/<worldId>/<worldId>-chunk-NNN.json` objects

The reader validates schema, world identity and release identity at every link. It returns the wrapped feature `record` values so existing Mapping consumers receive the same record shape as before.

## Source selection safety

- Default: `formal-cos`.
- A user must explicitly apply a different source.
- A selection apply increments a generation, aborts active source reads, clears only Rule-data caches and in-memory Rule datasets, then reloads the current world.
- Failed requests do not select, persist or fall back to another source. The user can cancel, retry the same source or explicitly apply a different source in the recovery dialog.
- Cache identities include `sourceId`, `releaseId`, `worldId` and `readerSchemaVersion`. Results from different sources or releases are never composed into one world dataset.

## Config changes

Add or modify a source only in the downstream runtime config. Every selectable source requires exactly one binding with a matching `readerKind`, an HTTPS `rootUrl`, and a reader schema version. `automaticFallback` must remain `false` and `requireExplicitApply` must remain `true`.

`legacy-github` is a deliberately separate reader that reads `Data_Merge` from its binding root. It does not inherit the old source-link mode, so a selected runtime source remains unambiguous.

Validate the downstream-only configuration with `npm run validate:formal-data-source-runtime`.
