# MediaIndex sample

This sample is derived from the Native RelayPackage fixture introduced by `CM_RELAY_PACKAGE_PROTOCOL_1`.

It intentionally keeps the Native RelayPackage `Picture/` structure unchanged. The sample only adds MediaIndex records that can be built from the existing picture path and feature path.

Source feature:

```text
Data_Spilt/zth/ISG/NGF/ZNGFLADISD_aunst_island.json
```

Source picture:

```text
Picture/zth/ISG/NGF/ZNGFLADISD_aunst_island/ZNGFLADISD_aunst_island_1.webp
```

MediaIndex source records use the world-first layout:

```text
Media_Index_Spilt/assets/IMG_SAMPLE_AUNST_ISLAND_001.json
Media_Index_Spilt/bindings/zth/ISG/NGF/ZNGFLADISD_aunst_island.json
```

Generated merge output is written by `npm run build:media-index-sample` to `.cairnmap-tmp/media-index-sample/` and is not committed as runtime data.
