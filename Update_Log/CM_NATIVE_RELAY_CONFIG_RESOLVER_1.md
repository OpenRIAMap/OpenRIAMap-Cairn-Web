# CM_NATIVE_RELAY_CONFIG_RESOLVER_1

## Objective

Add a config-driven Native RelayPackage resolver and safe zip/directory input resolver for the Node-side relay toolchain.

This keeps script-side package interpretation aligned with the current Mapping module import behavior while preparing for future protected write/apply tooling.

## Changed Files

- `scripts/relay/native-relay-input-resolver.mjs`
- `scripts/relay/native-relay-config-resolver.mjs`
- `scripts/relay/validate-native-relay-config-resolver.mjs`
- `scripts/relay/native-relay-apply-tools.mjs`
- `scripts/relay/native-relay-package-tools.mjs`
- `scripts/relay/validate-native-relay-package.mjs`
- `scripts/relay/preview-native-relay-package.mjs`
- `scripts/relay/refresh-native-relay-meta.mjs`
- `scripts/relay/compare-native-relay-package.mjs`
- `scripts/relay/apply-native-relay-package-dry-run.mjs`
- `docs/30_data-contracts/NativeRelayConfigResolverContract.md`
- `docs/40_maintenance/NativeRelayConfigResolverGuide.md`
- `package.json`

## Behavior Before

Relay dry-run tools accepted extracted Native RelayPackage directories only.

Package path interpretation was compatible with the Native RelayPackage structure, but feature and picture references were still mostly inferred from directory shape inside each script.

## Behavior After

Relay tools accept either Native RelayPackage directories or `.zip` packages.

Zip input is extracted safely into `.cairnmap-tmp/relay-input/<zip-name>-<hash>/`, with `.DS_Store` and `__MACOSX` ignored, single wrapper roots supported, and unsafe zip paths rejected.

Feature and picture paths are resolved through a shared config-driven resolver using:

- `worlds.json`
- registered class configs
- class identity fields
- class data fields
- classification kind/skind/skind2 fields

Existing validation, preview, compare, and dry-run apply commands now use the unified resolver path.

## Compatibility Notes

This patch does not change Native RelayPackage structure.

It does not change the Mapping module import/export behavior, but the Node-side resolver intentionally follows the same marker/root-prefix detection model used by `src/components/Mapping/core/relayPackageParser.ts`.

`refresh:native-relay-meta --write` refuses `.zip` input because write mode would only mutate the extracted temporary copy.

## Validation

Expected validation commands:

```powershell
npm run validate:project-config
npm run audit:project-config
npm run inspect:project-config
npm run validate:storage-profiles
npm run validate:feature-data-contract
npm run validate:native-relay-package
npm run validate:native-relay-config-resolver
npm run validate:media-index-contract
npm run compare:native-relay-package
npm run dry-run:native-relay-apply
npx tsc -b
```

`npm run build` may still fail in uploaded zip environments if `node_modules/.bin/vite` is not executable. In that case, run `npm ci` locally before `npm run build`.

## Rollback Notes

Remove the new resolver scripts, restore the modified relay scripts and `package.json`, and remove this update log and resolver documentation.

No real Data, Picture, Data_Merge, or MediaIndex files are modified by this patch.

## Handoff Note

This patch should be the last resolver-safety layer before a future protected write/apply patch such as `DATA_RELAY_APPLY_COMMIT_1`.
