# 当前配置的典型完整片段与读法

以下片段均按 Pointer 从完整 JSON 精确提取，没有为说明而补写绑定、默认值或字段。每个片段是一个完整对象，但 **不是可单独导入的整包**。本手册的“完整配置文件”是 current-full.config.json。

## 世界与共享资源

来源：`/application/worlds/0`，完整 JSON 第 114961–114977 行。

世界本身不再重复保存默认投影矩阵与瓦片地址。

```json
{
  "id": "zth",
  "prefix": "Z",
  "numericCode": 0,
  "label": {
    "zh": "零洲",
    "en": ""
  },
  "enabled": true,
  "default": true,
  "center": {
    "x": -643,
    "y": 35,
    "z": -1562
  },
  "mapLink": "https://satellite.ria.red/map/_zth/"
}
```

## 完整默认来源组

来源：`/application/sources/groups/0`，完整 JSON 第 115349–115437 行。

数据/媒体与瓦片链路在一组内共享，世界标签由模板代入。

```json
{
  "id": "default",
  "label": {
    "zh": "默认共享来源",
    "en": ""
  },
  "enabled": true,
  "sources": {
    "storageKey": "openriamap_formal_data_source_v1",
    "defaultSourceId": "formal-cos",
    "selectionMode": "user-select",
    "retryOnFailure": true,
    "items": [
      {
        "id": "formal-cos",
        "readerKind": "formal-release-v2",
        "readerSchemaVersion": "openriamap.formal-release-reader.v2",
        "rootUrl": "https://openriamap-cairn-data-1433163128.cos.ap-shanghai.myqcloud.com",
        "mediaRootUrl": "https://openriamap-cairn-media-1433163128.cos.ap-shanghai.myqcloud.com",
        "transport": "direct",
        "label": {
          "zh": "正式数据源（COS）",
          "en": ""
        },
        "enabled": true,
        "selectable": true
      },
      {
        "id": "formal-github",
        "readerKind": "formal-release-v2",
        "readerSchemaVersion": "openriamap.formal-release-reader.v2",
        "rootUrl": "https://raw.githubusercontent.com/OpenRIAMap/OpenRIAMap-Cairn-Data/main",
        "mediaRootUrl": "https://openriamap-cairn-media-1433163128.cos.ap-shanghai.myqcloud.com",
        "transport": "github-raw-compatible",
        "label": {
          "zh": "正式数据源（GitHub 镜像）",
          "en": ""
        },
        "enabled": true,
        "selectable": true
      }
    ],
    "github": {
      "sourceIds": [
        "formal-github"
      ],
      "owner": "OpenRIAMap",
      "repo": "OpenRIAMap-Cairn-Data",
      "branch": "main"
    },
    "linkModes": {
      "storageKey": "cairnmap_source_link_mode_v1",
      "legacyStorageKeys": [
        "ria_source_link_mode_v1"
      ],
      "items": [
        {
          "id": "cdn639",
          "label": {
            "zh": "CDN加速(639)",
            "en": ""
          },
          "baseUrl": "https://data.ozk639.top",
          "default": true
        },
        {
          "id": "github_raw",
          "label": {
            "zh": "Github Raw",
            "en": ""
          },
          "baseUrl": "https://raw.githubusercontent.com",
          "default": false
        }
      ]
    }
  },
  "dataPathTemplate": "",
  "mediaPathTemplate": "",
  "tiles": {
    "baseUrlTemplate": "https://satellite.ria.red/map/_{world}/tiles/world/",
    "filteredAccess": "registered-proxy",
    "proxyId": "ria-satellite",
    "attribution": {
      "name": "RIA Satellite",
      "url": "https://satellite.ria.red"
    }
  }
}
```

## 自然地物按钮

来源：`/application/buttons/items/2`，完整 JSON 第 115154–115185 行。

同一行的分类层级同时满足，多行之间取并集。

```json
{
  "id": "natural_geo",
  "tone": "green",
  "iconKey": "leaf",
  "defaultEnabled": true,
  "criteria": {
    "paths": [
      {
        "class": "ISG",
        "kind": "NGF"
      },
      {
        "class": "ISL",
        "kind": "NGF"
      }
    ]
  },
  "behavior": {
    "exclusiveWith": [],
    "exclusiveGroup": null,
    "linkedButtons": [],
    "disableWhenEnabled": [],
    "enableWhenEnabled": [],
    "persistState": true
  },
  "names": {
    "zh": "自然地理",
    "en": ""
  },
  "size": 36,
  "group": "default"
}
```

## RLE 方向字段

来源：`/nodes/65/fields/4`，完整 JSON 第 70560–70645 行。

fieldId 标识定义身份，key 是真实字段。行 value 是文本编码，valueType:number 决定实际保存数字。

```json
{
  "fieldId": "RLE-direction",
  "key": "direction",
  "type": "enum",
  "cardinality": "single",
  "input": "select",
  "required": true,
  "validateExistingData": false,
  "labels": {
    "zh": "方向(direction)",
    "en": ""
  },
  "description": {
    "zh": "",
    "en": ""
  },
  "sourceRuntimeField": "direction",
  "scenes": {
    "workflow": true,
    "editor": true,
    "infocard": true,
    "search": false
  },
  "optionValueType": "number",
  "optionTable": {
    "valueType": "number",
    "rows": [
      {
        "value": "0",
        "label": {
          "zh": "下行",
          "en": ""
        }
      },
      {
        "value": "1",
        "label": {
          "zh": "上行",
          "en": ""
        }
      },
      {
        "value": "2",
        "label": {
          "zh": "其他",
          "en": ""
        }
      },
      {
        "value": "3",
        "label": {
          "zh": "展示线",
          "en": ""
        }
      },
      {
        "value": "4",
        "label": {
          "zh": "联络线",
          "en": ""
        }
      },
      {
        "value": "5",
        "label": {
          "zh": "股道",
          "en": ""
        }
      },
      {
        "value": "6",
        "label": {
          "zh": "支线",
          "en": ""
        }
      },
      {
        "value": "7",
        "label": {
          "zh": "无方向联络线",
          "en": ""
        }
      }
    ]
  }
}
```

## RLE direction 信息卡实际状态

来源：`/nodes/65/card/items/4`，完整 JSON 第 72459–72480 行。

这里的 prefillAudit 只是单次预填来源审计，不能视为实时字段/对照绑定。请按真实键判断。

```json
{
  "id": "rail_line-card-direction-3",
  "source": "direction",
  "visible": true,
  "section": "main",
  "hideWhenEmpty": true,
  "renderer": "text",
  "label": {
    "zh": "方向",
    "en": ""
  },
  "prefillAudit": {
    "source": {
      "path": {
        "class": "RLE"
      },
      "fieldId": "RLE-direction",
      "key": "direction"
    },
    "fingerprint": "field-v1-c161763758c61745"
  }
}
```

## RLE Zoom 2–4 小胶囊

来源：`/nodes/65/geometryProfiles/LineString/zoomPriority/rules/2`，完整 JSON 第 71120–71333 行。

when.zoom 与 direction 条件同时成立；label.template 的双引号内是字段名。

```json
{
  "id": "r10-rle-code-pill-zoom2-4",
  "representation": "geometry",
  "style": {
    "weight": 3,
    "stroke": {
      "mode": "field",
      "field": "color",
      "fallbackColor": "#111827"
    },
    "strokeOpacity": 0.9,
    "dashPreset": "solid",
    "lineCap": "round",
    "lineJoin": "round"
  },
  "label": {
    "visible": true,
    "style": {
      "family": "rle-pill-color",
      "size": 11,
      "color": {
        "mode": "field",
        "field": "color",
        "fallbackColor": "#2563eb"
      }
    },
    "source": "Name",
    "collision": {
      "role": "important",
      "basePriority": 8,
      "collisionGroup": "networkLabel",
      "hideWhenColliding": true
    },
    "fallbackSources": [
      "ID"
    ],
    "placement": "center",
    "withDot": false,
    "offsetY": 0,
    "sourceMode": "combined",
    "template": "\"bureau\"\"line\""
  },
  "geometryStack": {
    "zLevel": 320
  },
  "priority": {
    "mode": "replace",
    "base": 4000
  },
  "extensions": {
    "screenGate": {
      "mode": "inherit"
    },
    "anchor": {
      "strategy": "lineCandidates",
      "candidates": [
        "E",
        "W",
        "N",
        "S",
        "NE",
        "NW",
        "SE",
        "SW"
      ]
    },
    "polygonCandidates": {},
    "lineLabel": {
      "profile": "strict-on-line",
      "mode": "strictOnLine",
      "anchorSamples": 7,
      "candidateSpacing": 180,
      "candidateMinSpacing": 40,
      "candidateMax": 32,
      "shortThresholdMultiplier": 2,
      "longMode": "evenSplit",
      "endpointPaddingRatio": 0.05,
      "endpointPaddingMinPx": 4,
      "preferPreviousCandidate": true,
      "candidateHysteresisPx": 180,
      "minLengthPx": 24,
      "maxTurnAngleDeg": 40,
      "textMode": "rotatedLabel",
      "textPathMinLengthPx": 120,
      "textPathPaddingPx": 30,
      "textPathMaxAngleDeltaDeg": 45,
      "textPathMaxTotalBendDeg": 100,
      "textPathPreferReadableDirection": true,
      "textPathFallback": "rotatedLabel",
      "textPathCollisionPaddingPx": 10,
      "textPathLetterSpacingPx": 0.5,
      "textPathCurvedLetterSpacingPx": 1.8,
      "textPathCurvedSpacingMinBendDeg": 30,
      "orientationPolicy": "autoCjkUpright",
      "textPathVerticalAngleThresholdDeg": 45,
      "textPathVerticalLengthRatio": 0.6,
      "candidateOrdering": "centerOut",
      "centerWeightMode": "distanceToCenter",
      "centerSwitchThreshold": 16,
      "centerReuseBonus": 12,
      "cjkVerticalRenderMode": "legacyVertical",
      "svgVerticalCjkMinLengthPx": 24,
      "svgVerticalCjkLetterSpacingPx": 1,
      "advancedTextEnabled": false,
      "advancedTextBudgetGroup": "none",
      "cjkGlyphRotationPolicy": "uprightWhenSteep",
      "cjkGlyphUprightAngleThresholdDeg": 45,
      "cjkGlyphPathMode": "off",
      "cjkGlyphSpacingPx": 2,
      "cjkGlyphCollisionPaddingPx": 8,
      "cjkGlyphMaxCount": 16,
      "cjkGlyphAllowTextPathFallback": false,
      "textPathHalfLengthMultiplier": 1.6,
      "textPathMinHalfLengthWorld": 160,
      "textPathMaxHalfLengthRatio": 0.46,
      "textCollisionRectMode": "compactTextBox",
      "cjkGlyphCompactMode": "off",
      "cjkGlyphMinAdvanceScale": 0.62,
      "cjkGlyphFallbackMode": "rotatedLabel",
      "simpleFallbackEnabled": true,
      "simpleFallbackRotate": true,
      "repositionMode": "off",
      "repositionAttemptsPerDirection": 3,
      "repositionStepMode": "labelSpan",
      "repositionFailure": "hide",
      "repositionStrictSvg": false,
      "avoidLineGeometry": false,
      "avoidPolygonGeometry": false,
      "avoidPointSymbols": true,
      "viewportRectMode": "anchorNormalized",
      "viewportCandidateMode": "stableFirstViewportFallback",
      "viewportCandidateBufferPx": 72,
      "viewportCandidateMaxTargets": 1,
      "viewportCandidateMinIntervalPx": 48
    },
    "labelText": {
      "maxChars": 12,
      "suffix": "…",
      "abbreviationEnabled": true,
      "emptyBehavior": "hide"
    },
    "collision": {
      "collideWith": [
        "requiredLabel",
        "importantLabel"
      ],
      "paddingPx": 4,
      "hidePolicy": "abbreviateThenHide"
    },
    "density": {
      "mode": "override",
      "enabled": false,
      "preserveSelected": true,
      "preserveRequired": true
    },
    "stability": {
      "enabled": true,
      "cacheKey": "featureID+zoomBucket",
      "zoomBucketSize": 1,
      "freezeDuringPan": true,
      "recomputeOnMoveEnd": true,
      "recomputeOnZoomEnd": true,
      "hysteresisPx": 36,
      "keepPreviousAnchor": true,
      "keepPreviousCandidate": true
    },
    "fallback": {
      "whenNoLabelText": "hideLabel",
      "whenCollisionFailed": "hideLabel",
      "whenRuleMissing": "geometryOnly",
      "whenGeometryInvalid": "skip"
    },
    "visibility": {
      "mode": "lineContainmentChoice",
      "lineContainmentChoice": {
        "field": "direction",
        "primaryValue": "3",
        "overlayValues": [
          "0",
          "1",
          "2",
          "4"
        ],
        "switchZoom": 8,
        "precision": 1000
      }
    }
  },
  "when": {
    "zoom": {
      "min": 2,
      "max": 4
    },
    "fields": {
      "op": "all",
      "items": [],
      "formula": {
        "terms": [
          {
            "id": "C1",
            "relation": "AND",
            "condition": {
              "kind": "fieldEquals",
              "field": "direction",
              "value": "3"
            }
          }
        ],
        "expression": "((C1))",
        "manual": true
      }
    }
  }
}
```

## 完整 TPP 工作流

来源：`/workflows/18`，完整 JSON 第 112511–112883 行。

包含自身几何与独立额外绘制；按页、返回槽位、启用条件和输出绑定逐项阅读。

```json
{
  "id": "v3-tpp_teleport",
  "label": {
    "zh": "传送点",
    "en": ""
  },
  "mode": "composed",
  "target": {
    "class": "TPP"
  },
  "steps": [
    {
      "id": "tpp_teleport-actor",
      "kind": "actor",
      "label": {
        "zh": "填写人",
        "en": "Author"
      }
    },
    {
      "id": "tpp_teleport-form",
      "kind": "form",
      "label": {
        "zh": "基本信息",
        "en": "Basic information"
      },
      "controls": [
        {
          "id": "tpp_teleport-classification",
          "kind": "classificationPicker",
          "columns": 1,
          "label": {
            "zh": "类型（Class=TPP）",
            "en": ""
          },
          "classificationScope": {
            "class": "TPP"
          },
          "outputId": "tpp_teleport-output-1",
          "required": true,
          "systemManaged": true
        },
        {
          "id": "tpp_teleport-Name-A",
          "slot": "A",
          "kind": "text",
          "valueNormalization": "trim",
          "columns": 1,
          "label": {
            "zh": "名称",
            "en": ""
          },
          "placeholder": "例如：主城传送柱-北门",
          "required": true
        },
        {
          "id": "tpp_teleport-abbr-H",
          "slot": "H",
          "kind": "text",
          "valueNormalization": "abbr",
          "columns": 1,
          "label": {
            "zh": "字符简称（用于ID）",
            "en": ""
          },
          "placeholder": "仅建议使用字母/数字/下划线/短横线",
          "required": true
        },
        {
          "id": "tpp_teleport-hub-B",
          "slot": "B",
          "kind": "text",
          "valueNormalization": "trim",
          "columns": 1,
          "label": {
            "zh": "所属枢纽区（可选，将写入 hub）",
            "en": ""
          },
          "defaultValue": ""
        },
        {
          "id": "tpp_teleport-Land-C",
          "slot": "C",
          "kind": "featureSearch",
          "valueNormalization": "trim",
          "columns": 1,
          "label": {
            "zh": "所属地理单元（可选，将写入 tags.Land）",
            "en": ""
          },
          "placeholder": "输入关键词检索：可匹配 Name / ID",
          "search": {
            "target": {
              "class": "ISG",
              "kind": "NGF"
            },
            "queryFields": [
              "ID",
              "Name"
            ],
            "displayTemplate": "{{ID}} ({{Name}})",
            "returnField": "ID",
            "matcher": "contains",
            "minQueryLength": 1,
            "maxResults": 30,
            "debounceMs": 180,
            "cacheScope": "world"
          }
        },
        {
          "id": "tpp_teleport-UAdm-D",
          "slot": "D",
          "kind": "featureSearch",
          "valueNormalization": "trim",
          "columns": 1,
          "label": {
            "zh": "所属聚落(地标点)（可选，将写入 tags.UAdm）",
            "en": ""
          },
          "placeholder": "输入关键词检索：可匹配 Name / ID",
          "search": {
            "target": {
              "class": "ISG",
              "kind": "ADM"
            },
            "queryFields": [
              "ID",
              "Name"
            ],
            "displayTemplate": "{{ID}} ({{Name}})",
            "returnField": "ID",
            "matcher": "contains",
            "minQueryLength": 1,
            "maxResults": 30,
            "debounceMs": 180,
            "cacheScope": "world"
          }
        },
        {
          "id": "tpp_teleport-UAdmG-E",
          "slot": "E",
          "kind": "featureSearch",
          "valueNormalization": "trim",
          "columns": 1,
          "label": {
            "zh": "所属聚落(区划)（可选，将写入 tags.UAdmG）",
            "en": ""
          },
          "placeholder": "输入关键词检索：可匹配 Name / ID",
          "search": {
            "target": {
              "class": "ISG",
              "kind": "ADM"
            },
            "queryFields": [
              "ID",
              "Name"
            ],
            "displayTemplate": "{{ID}} ({{Name}})",
            "returnField": "ID",
            "matcher": "contains",
            "minQueryLength": 1,
            "maxResults": 30,
            "debounceMs": 180,
            "cacheScope": "world"
          }
        },
        {
          "id": "tpp_teleport-wiki-G",
          "slot": "G",
          "kind": "text",
          "valueNormalization": "trim",
          "columns": 1,
          "label": {
            "zh": "wiki链接（可选，将写入 extensions.link.wiki）",
            "en": ""
          },
          "placeholder": "https://..."
        },
        {
          "id": "tpp_teleport-TGTWarp-F",
          "slot": "F",
          "kind": "featureSearch",
          "valueNormalization": "trim",
          "columns": 1,
          "label": {
            "zh": "目标Warp点(若有)（可选，将写入 TGTWarp；填写后将跳过“目标点坐标”页面）",
            "en": ""
          },
          "placeholder": "输入关键词检索：可匹配 Name 或 WRPointI2D",
          "search": {
            "target": {
              "class": "WRP"
            },
            "queryFields": [
              "ID",
              "Name"
            ],
            "displayTemplate": "{{ID}} ({{Name}})",
            "returnField": "ID",
            "matcher": "contains",
            "minQueryLength": 1,
            "maxResults": 30,
            "debounceMs": 180,
            "cacheScope": "world"
          }
        },
        {
          "id": "tpp_teleport-tail",
          "kind": "tagsExtensions",
          "columns": 1,
          "label": {
            "zh": "标签与扩展",
            "en": "Tags and extensions"
          },
          "systemManaged": true,
          "tagsExtensions": {
            "tagsEnabled": true,
            "extensionsEnabled": true
          }
        }
      ]
    },
    {
      "id": "tpp_teleport-geometry",
      "kind": "geometry",
      "outputId": "tpp_teleport-output-1",
      "geometry": [
        "Point"
      ],
      "label": {
        "zh": "起点坐标",
        "en": "Geometry"
      },
      "drawing": {
        "enabledFromThisPage": true,
        "keepDrawingWhenBack": true,
        "captureSlot": "SOURCE_POINT_GEOMETRY",
        "returnFormat": "coordP",
        "heightSlot": "SOURCE_ELEVATION",
        "bindings": [
          {
            "outputId": "tpp_teleport-output-1",
            "target": "elevation",
            "value": "height"
          }
        ],
        "multiple": true
      },
      "controls": [
        {
          "id": "tpp_teleport-elevation",
          "kind": "number",
          "slot": "SOURCE_ELEVATION",
          "columns": 1,
          "label": {
            "zh": "起点高度(y)",
            "en": ""
          }
        }
      ],
      "geometryRole": "output"
    },
    {
      "id": "extra-tpp_teleport-target-point",
      "kind": "geometry",
      "geometryRole": "auxiliary",
      "label": {
        "zh": "目标点坐标",
        "en": ""
      },
      "when": {
        "token": "F",
        "operator": "empty"
      },
      "geometry": [
        "Point"
      ],
      "controls": [
        {
          "id": "tpp_teleport-target-elevation",
          "kind": "number",
          "slot": "TARGET_ELEVATION",
          "columns": 1,
          "label": {
            "zh": "目标点高度(y)",
            "en": ""
          }
        }
      ],
      "drawing": {
        "enabledFromThisPage": true,
        "allowBack": true,
        "keepDrawingWhenBack": true,
        "captureSlot": "TARGET_POINT",
        "returnFormat": "pointObject",
        "multiple": false,
        "heightSlot": "TARGET_ELEVATION",
        "bindings": [
          {
            "outputId": "tpp_teleport-output-1",
            "target": "TGTcoordinate",
            "value": "geometry"
          },
          {
            "outputId": "tpp_teleport-output-1",
            "target": "TGTelevation",
            "value": "height"
          }
        ]
      }
    }
  ],
  "outputs": [
    {
      "id": "tpp_teleport-output-1",
      "classification": {
        "class": "TPP"
      },
      "assignments": [
        {
          "id": "tpp_teleport-assignment-Name-A",
          "target": "Name",
          "expression": "A"
        },
        {
          "id": "tpp_teleport-assignment-hub-B",
          "target": "hub",
          "expression": "B"
        },
        {
          "id": "tpp_teleport-assignment-Land-C",
          "target": "tags.Land",
          "expression": "C"
        },
        {
          "id": "tpp_teleport-assignment-UAdm-D",
          "target": "tags.UAdm",
          "expression": "D"
        },
        {
          "id": "tpp_teleport-assignment-UAdmG-E",
          "target": "tags.UAdmG",
          "expression": "E"
        },
        {
          "id": "tpp_teleport-assignment-TGTWarp-F",
          "target": "TGTWarp",
          "expression": "F"
        },
        {
          "id": "tpp_teleport-assignment-wiki-G",
          "target": "extensions.link.wiki",
          "expression": "G"
        },
        {
          "id": "tpp_teleport-assignment-id",
          "target": "ID",
          "expression": "join(\"_\",WorldPrefix+Class+Kind+Skind,H)"
        }
      ],
      "geometry": {
        "selected": "Point"
      }
    }
  ],
  "legacy": {
    "runtimeMode": "registry-schema",
    "source": {
      "schemaKey": "tpp_teleport"
    }
  }
}
```

## 出行方式公共表

来源：`/lookupTables/1`，完整 JSON 第 115633–115659 行。

前三列用于人类名称对照，functionValue 保留功能数值；使用方是否已经接入需看执行器。

```json
{
  "id": "road-travel-modes",
  "label": {
    "zh": "出行方式",
    "en": ""
  },
  "valueType": "string",
  "functionKind": "speed",
  "rows": [
    {
      "value": "WALK",
      "label": {
        "zh": "步行",
        "en": ""
      },
      "functionValue": 4.3
    },
    {
      "value": "HORSE",
      "label": {
        "zh": "马",
        "en": ""
      },
      "functionValue": 10
    }
  ]
}
```

## 铁路专供编辑工作流

来源：`/workflows/22`，完整 JSON 第 113627–113902 行。

quickMapping:false 和 editor.dedicated 将此方案与外部铁路采集入口分开。

```json
{
  "id": "v3-editor-rle",
  "label": {
    "zh": "铁路（专供编辑）",
    "en": ""
  },
  "mode": "composed",
  "quickMapping": false,
  "editor": {
    "enabled": true,
    "dedicated": true,
    "scope": {
      "class": "RLE"
    }
  },
  "target": {
    "class": "RLE"
  },
  "actor": {
    "required": true
  },
  "steps": [
    {
      "id": "edit-RLE-actor",
      "kind": "actor",
      "label": {
        "zh": "填写人",
        "en": ""
      }
    },
    {
      "id": "edit-RLE-form",
      "kind": "form",
      "label": {
        "zh": "编辑信息",
        "en": ""
      },
      "controls": [
        {
          "id": "edit-RLE-Name",
          "slot": "F1",
          "kind": "text",
          "columns": 1,
          "label": {
            "zh": "线路名",
            "en": ""
          },
          "required": true
        },
        {
          "id": "edit-RLE-bureau",
          "slot": "F2",
          "kind": "text",
          "columns": 1,
          "label": {
            "zh": "路局代码",
            "en": ""
          },
          "required": false
        },
        {
          "id": "edit-RLE-line",
          "slot": "F3",
          "kind": "text",
          "columns": 1,
          "label": {
            "zh": "线路编号",
            "en": ""
          },
          "required": false
        },
        {
          "id": "edit-RLE-color",
          "slot": "F4",
          "kind": "text",
          "columns": 1,
          "label": {
            "zh": "标准色号",
            "en": ""
          },
          "required": true
        },
        {
          "id": "edit-RLE-direction",
          "slot": "F5",
          "kind": "select",
          "columns": 1,
          "label": {
            "zh": "方向",
            "en": ""
          },
          "required": true,
          "optionValueType": "number",
          "prefillAudit": {
            "source": {
              "path": {
                "class": "RLE"
              },
              "fieldId": "RLE-direction",
              "key": "direction"
            },
            "fingerprint": "field-v1-c161763758c61745"
          },
          "optionTable": {
            "valueType": "number",
            "rows": [
              {
                "value": "0",
                "label": {
                  "zh": "下行",
                  "en": ""
                }
              },
              {
                "value": "1",
                "label": {
                  "zh": "上行",
                  "en": ""
                }
              },
              {
                "value": "2",
                "label": {
                  "zh": "其他",
                  "en": ""
                }
              },
              {
                "value": "3",
                "label": {
                  "zh": "展示线",
                  "en": ""
                }
              },
              {
                "value": "4",
                "label": {
                  "zh": "联络线",
                  "en": ""
                }
              },
              {
                "value": "5",
                "label": {
                  "zh": "股道",
                  "en": ""
                }
              },
              {
                "value": "6",
                "label": {
                  "zh": "支线",
                  "en": ""
                }
              },
              {
                "value": "7",
                "label": {
                  "zh": "无方向联络线",
                  "en": ""
                }
              }
            ]
          }
        },
        {
          "id": "edit-RLE-startplf",
          "slot": "F6",
          "kind": "text",
          "columns": 1,
          "label": {
            "zh": "起点站台名",
            "en": ""
          },
          "required": true
        },
        {
          "id": "edit-RLE-endplf",
          "slot": "F7",
          "kind": "text",
          "columns": 1,
          "label": {
            "zh": "终点站台名",
            "en": ""
          },
          "required": true
        },
        {
          "id": "edit-RLE-annotations",
          "kind": "tagsExtensions",
          "columns": 1,
          "label": {
            "zh": "标签与扩展",
            "en": ""
          },
          "systemManaged": true,
          "tagsExtensions": {
            "tagsEnabled": true,
            "extensionsEnabled": true
          }
        }
      ]
    },
    {
      "id": "edit-RLE-geometry",
      "kind": "geometry",
      "outputId": "edit-RLE-output",
      "geometry": [
        "LineString"
      ],
      "label": {
        "zh": "编辑几何",
        "en": ""
      },
      "drawing": {
        "enabledFromThisPage": true,
        "keepDrawingWhenBack": true,
        "allowBack": true,
        "multiple": true
      }
    }
  ],
  "outputs": [
    {
      "id": "edit-RLE-output",
      "classification": {
        "class": "RLE"
      },
      "geometry": {
        "selected": "LineString"
      },
      "assignments": [
        {
          "id": "edit-RLE-id",
          "target": "ID",
          "expression": "ID"
        },
        {
          "id": "edit-RLE-bind-Name",
          "target": "Name",
          "expression": "F1"
        },
        {
          "id": "edit-RLE-bind-bureau",
          "target": "bureau",
          "expression": "F2"
        },
        {
          "id": "edit-RLE-bind-line",
          "target": "line",
          "expression": "F3"
        },
        {
          "id": "edit-RLE-bind-color",
          "target": "color",
          "expression": "F4"
        },
        {
          "id": "edit-RLE-bind-direction",
          "target": "direction",
          "expression": "F5"
        },
        {
          "id": "edit-RLE-bind-startplf",
          "target": "startplf",
          "expression": "F6"
        },
        {
          "id": "edit-RLE-bind-endplf",
          "target": "endplf",
          "expression": "F7"
        }
      ]
    }
  ]
}
```
