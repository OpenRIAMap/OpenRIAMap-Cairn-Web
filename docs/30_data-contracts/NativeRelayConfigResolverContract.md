# Native Relay Config Resolver Contract

Patch: `CM_NATIVE_RELAY_CONFIG_RESOLVER_1`

## Objective

This contract defines the shared Node-side resolver used by Native RelayPackage validation, preview, compare, and dry-run apply tools.

The resolver keeps script-side package interpretation aligned with the current Mapping module import behavior while adding stricter Cairn config validation before future write/apply stages.

## Input Modes

The resolver accepts both:

```text
--relay /path/to/RelayPackageDir
--relay /path/to/RelayPackage.zip
```

For `.zip` input, the package is extracted to:

```text
.cairnmap-tmp/relay-input/<zip-name>-<content-hash>/
```

The original zip is never modified.

## Mapping Module Compatibility

The input resolver follows the same Native RelayPackage recognition rules as `src/components/Mapping/core/relayPackageParser.ts`:

```text
ignore .DS_Store
ignore __MACOSX
support a single wrapper root directory
recognize INDEX.json
recognize Delete.json
recognize Data_Spilt/
recognize Picture/
recognize Tool_Refresh/
```

After the package root is resolved, scripts continue using normal filesystem reads.

## Config-driven Resolution

The resolver interprets Native RelayPackage paths against Cairn config:

```text
worldId      -> project-config/packages/openriamap-ria/environment/worlds.json
classCode    -> project-config/presets/*/classes/*.json
feature ID   -> class identity.idField
Class field  -> class data.classField
World field  -> class data.worldField + worlds.numericCode
kindPath     -> class classification kind/skind/skind2 fields
Picture path -> same featureRef model as Data_Spilt
```

## Supported Native Paths

Feature JSON:

```text
Data_Spilt/{worldId}/{classCode}/{featureId}.json
Data_Spilt/{worldId}/{classCode}/{kindPath...}/{featureId}.json
```

Picture files:

```text
Picture/{worldId}/{classCode}/{featureId}/{imageFile}
Picture/{worldId}/{classCode}/{kindPath...}/{featureId}/{imageFile}
```

For example:

```text
Data_Spilt/zth/ISG/NGF/ZNGFLADISD_aunst_island.json
Picture/zth/ISG/NGF/ZNGFLADISD_aunst_island/ZNGFLADISD_aunst_island_1.webp
```

resolves to:

```json
{
  "projectId": "openriamap-ria",
  "worldId": "zth",
  "classCode": "ISG",
  "kindPath": ["NGF"],
  "featureId": "ZNGFLADISD_aunst_island"
}
```

## Safety Rules

Zip input is handled as temporary input only:

```text
no write-back to the zip
no write-back to formal Data_Spilt
no write-back to formal Picture
no write-back to formal Media_Index_Spilt
zip-slip paths are rejected
absolute zip entry paths are rejected
.. path segments are rejected
```

## Boundary

This patch does not add formal write/apply behavior. It only makes existing validation, preview, compare, and dry-run tools use a safer and more config-driven package resolver.
