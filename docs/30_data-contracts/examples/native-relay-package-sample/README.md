# Native RelayPackage Sample

Patch: `CM_RELAY_PACKAGE_PROTOCOL_1`

This sample is derived from `RelayPackage_Aunst-639_zth_202605171818.zip` and preserves the native CairnMap package shape.

It is not an operation-array package. It contains complete feature JSON records under `Data_Spilt`, media files under `Picture`, deletion intent in `Delete.json`, package metadata in `INDEX.json`, package-local refresh tools under `Tool_Refresh`, and review feedback in `Review.json`.

Validate it with:

```powershell
npm run validate:native-relay-package
npm run preview:native-relay-package
npm run refresh:native-relay-meta
```

The refresh command writes default output to `.cairnmap-tmp/native-relay-package-sample/` and does not mutate this sample unless `--write` is passed explicitly.
