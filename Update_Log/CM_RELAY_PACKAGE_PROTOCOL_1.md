# CM_RELAY_PACKAGE_PROTOCOL_1

## Objective

Formalize the CairnMap Native RelayPackage protocol using the current lightweight collaborative editing package shape.

This patch treats `INDEX.json + Delete.json + Data_Spilt + Picture + Tool_Refresh` as the native package structure and adds `Review.json` for review/precheck feedback. It does not replace the package with `featureOps`, `mediaOps`, or other operation arrays.

## Changed Files

```text
project-config/packages/openriamap-ria/environment/relayPackageProtocol.json
project-config/schemas/relay/cairnmap.native-relay-protocol.v1.schema.json
project-config/schemas/relay/cairnmap.native-relay-index.v1.schema.json
project-config/schemas/relay/cairnmap.native-relay-delete.v1.schema.json
project-config/schemas/relay/cairnmap.native-relay-review.v1.schema.json
scripts/relay/native-relay-package-tools.mjs
scripts/relay/validate-native-relay-package.mjs
scripts/relay/preview-native-relay-package.mjs
scripts/relay/refresh-native-relay-meta.mjs
docs/20_config-reference/RelayPackageProtocolReference.md
docs/30_data-contracts/NativeRelayPackageContract.md
docs/30_data-contracts/examples/native-relay-package-sample/
src/core/project/environmentTypes.ts
src/core/project/openriamapRiaEnvironment.ts
package.json
Update_Log/CM_RELAY_PACKAGE_PROTOCOL_1.md
```

## Behavior Before

The project had StorageProfile and FeatureData contracts, but no formal native RelayPackage contract in `project-config`.

Relay packages existed as practical editing bundles, but their `INDEX.json`, `Delete.json`, feature upsert records, picture files, and review state were not described by a project-level protocol file or local validation tools.

## Behavior After

The project now has a contract-only native RelayPackage protocol.

Native package semantics are:

```text
Data_Spilt JSON files = complete upsert records
Delete.json items = delete feature references
Picture files = native media add/replace payload
INDEX.json = package metadata and export version record
Review.json = review/precheck/decision feedback
```

The reference sample package is stored under `docs/30_data-contracts/examples/native-relay-package-sample/` and is based on `RelayPackage_Aunst-639_zth_202605171818.zip`.

## Compatibility Notes

This patch intentionally avoids the previously considered operation-array protocol.

The native package root remains editable and compact. It does not require `relay-package.json`, `manifest.json`, `featureOps`, `mediaOps`, or `relationOps`.

The active frontend data loading chain is unchanged. Existing runtime behavior still uses `sourceLinkModes.json + dataSources.json + Data_Merge`.

`World: 0` remains valid for the `zth` world because it is resolved through `worlds.json`. Nested paths such as `ISG/NGF` are valid native classification paths, not schema errors.

## Validation

Required validation commands:

```powershell
npm run validate:project-config
npm run audit:project-config
npm run inspect:project-config
npm run validate:storage-profiles
npm run validate:feature-data-contract
npm run validate:native-relay-package
npm run preview:native-relay-package
npm run refresh:native-relay-meta
npx tsc -b
```

`npm run build` should also be attempted, but uploaded zip baselines have repeatedly shown `node_modules/.bin/vite` permission issues. If that persists, run `npm ci` in a clean local environment before production build validation.

## Rollback Notes

Rollback is limited to removing the files added by this patch and reverting `package.json`, `environmentTypes.ts`, and `openriamapRiaEnvironment.ts` to the previous baseline.

No real data repository files are modified.

## Handoff Note

Next recommended patch: `DATA_MEDIA_INDEX_CONTRACT_1`.

The MediaIndex contract should build on this native package protocol by defining how future `Picture` payloads can be represented as media assets and feature-media bindings. It should not retroactively complicate the native RelayPackage structure.
