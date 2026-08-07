# CM_RIA_FORMAL_DATA_SOURCE_RUNTIME_1

## Scope

Integrates the merged generic `cairnmap.data-source-selection.v1` contract into the RIA application as a downstream-only formal-data reader. This change does not modify Review, RelayPackage handling, Mapping tools, MapContainer behaviour, or any Review button binding.

## Added

- Formal COS and GitHub-mirror release readers, plus an explicitly selected legacy GitHub compatibility reader.
- RIA runtime binding configuration in `.cairn/formal-data-source-runtime.json`, outside the frozen upstream showcase template.
- Formal release-chain validation for release set, world pointer, manifest, chunk catalog and world chunks.
- Source/release/world/schema-scoped Rule caches.
- Explicit Settings selector and global failure-recovery dialog using the existing card, button and blocking-modal visual system.
- Aborted/discarded stale reads on source switch; no automatic source fallback.
- Formal reader test and formal runtime configuration validation.

## Compatibility

The old `sourceLinkModes.json` selector is retained for existing legacy raw-data callers. It does not determine the selected formal runtime source. The selected legacy compatibility source reads its configured root directly, so no snapshot mixes a user-selected source with another source-link mode.

## Verification

- `npm run test:data-source-selection`
- `npm run test:formal-release-reader`
- `npm run validate:formal-data-source-runtime`
- `npm run validate:project-config`
- `npm run build`

Known non-blocking build warnings remain the pre-existing dynamic-import overlap and the bundle-size warning.
