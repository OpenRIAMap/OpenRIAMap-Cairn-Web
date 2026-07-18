# Native Relay Config Resolver Guide

Patch: `CM_NATIVE_RELAY_CONFIG_RESOLVER_1`

## Default validation

From the `CairnMap-Web` root:

```powershell
npm run validate:native-relay-config-resolver
```

This command validates:

```text
Native RelayPackage directory input
Native RelayPackage zip input with a wrapper folder
world/class/kind/featureId config resolution
Picture feature binding resolution
```

## Use a zip RelayPackage directly

The relay tools now accept `.zip` input:

```powershell
node ./scripts/relay/apply-native-relay-package-dry-run.mjs `
  --relay "D:/CairnTest/RelayPackage_Aunst-639_zth_202605171818.zip" `
  --feature-data "D:/CairnTest/OpenRIAMap-Data/Data_Spilt" `
  --picture-root "D:/CairnTest/OpenRIAMap-Data/Picture" `
  --out ".cairnmap-tmp/aunst-zip-dry-run"
```

The zip is extracted into:

```text
.cairnmap-tmp/relay-input/
```

The source zip is not changed.

## Use an extracted RelayPackage directory

```powershell
node ./scripts/relay/apply-native-relay-package-dry-run.mjs `
  --relay "D:/CairnTest/RelayPackage_Aunst-639_zth_202605171818" `
  --feature-data "D:/CairnTest/OpenRIAMap-Data/Data_Spilt" `
  --picture-root "D:/CairnTest/OpenRIAMap-Data/Picture" `
  --out ".cairnmap-tmp/aunst-dir-dry-run"
```

## Supported commands

The following commands now use the unified input resolver:

```text
npm run validate:native-relay-package
npm run preview:native-relay-package
npm run compare:native-relay-package
npm run dry-run:native-relay-apply
npm run refresh:native-relay-meta
```

`refresh:native-relay-meta --write` refuses zip input because it would only update the extracted temporary copy. Extract the package first if in-place metadata refresh is required.

## Why this exists before formal write/apply

Before adding `--write` or GitHub Actions accept behavior, all tools must agree on how to interpret:

```text
world id
class code
kind path
feature id
picture binding path
package root inside zip
```

This patch creates that shared resolver layer without changing real Data or Picture repositories.
