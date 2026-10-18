// node_modules/.cache/cairnmap-legacy-v1/project-config/presets/building/classes/BUD.json
var BUD_default = {
  schemaVersion: "cairnmap.class.v1",
  projectId: "openriamap-ria",
  runtimeStatus: "active",
  classCode: "BUD",
  classKey: "building",
  sourceFeatureKey: "\u5EFA\u7B51",
  label: {
    "zh-CN": "\u5EFA\u7B51",
    en: "Building"
  },
  description: "\u5EFA\u7B51 class config-primary config. Runtime facade now resolves from preset Class config.",
  data: {
    typeField: "Type",
    classField: "Class",
    worldField: "World",
    defaultType: "Polygon",
    defaultClass: "BUD"
  },
  geometry: {
    type: "Polygon",
    sourceField: "Conpoints",
    axisOrder: "x,y,z",
    required: true
  },
  identity: {
    idField: "ID",
    nameField: "Name",
    displayNameField: "Name"
  },
  classification: {
    kindField: "Kind",
    skindField: "SKind",
    skind2Field: "SKind2",
    required: false,
    options: [
      {
        kind: "NOM",
        skind: "NOM",
        skind2: "",
        drawMode: "polygon",
        geom: "\u9762",
        label: {
          "zh-CN": "\u9ED8\u8BA4"
        },
        workflow: {
          visible: true
        },
        display: {
          ruleId: null
        }
      },
      {
        kind: "SPE",
        skind: "SPE",
        skind2: "",
        drawMode: "polygon",
        geom: "\u9762",
        label: {
          "zh-CN": "\u7279\u6B8A"
        },
        workflow: {
          visible: true
        },
        display: {
          ruleId: null
        }
      }
    ]
  },
  fields: [
    {
      key: "ID",
      label: {
        "zh-CN": "\u5EFA\u7B51ID"
      },
      type: "text",
      required: true,
      optional: false,
      sourceRuntimeField: "ID",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: true
      }
    },
    {
      key: "Name",
      label: {
        "zh-CN": "\u5EFA\u7B51\u540D"
      },
      type: "text",
      required: true,
      optional: false,
      sourceRuntimeField: "Name",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: true
      }
    },
    {
      key: "Kind",
      label: {
        "zh-CN": "\u5EFA\u7B51\u7C7B\u578B(Kind)"
      },
      type: "text",
      required: true,
      optional: false,
      sourceRuntimeField: "Kind",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "SKind",
      label: {
        "zh-CN": "\u5EFA\u7B51\u5B50\u7C7B\u578B(SKind)"
      },
      type: "text",
      required: true,
      optional: false,
      sourceRuntimeField: "SKind",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "SKind2",
      label: {
        "zh-CN": "\u5EFA\u7B51\u4E09\u7EA7\u5B50\u7C7B\u578B(SKind2)"
      },
      type: "text",
      required: false,
      optional: true,
      sourceRuntimeField: "SKind2",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "Situation",
      label: {
        "zh-CN": "\u72B6\u6001(Situation)"
      },
      type: "text",
      required: false,
      optional: true,
      sourceRuntimeField: "Situation",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "elevation",
      label: {
        "zh-CN": "\u9AD8\u5EA6(y)"
      },
      type: "number",
      required: false,
      optional: true,
      sourceRuntimeField: "elevation",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "height",
      label: {
        "zh-CN": "\u9AD8\u5EA6(height)"
      },
      type: "number",
      required: false,
      optional: true,
      sourceRuntimeField: "height",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    }
  ],
  groups: [],
  tags: {
    enabled: true,
    allowOther: true,
    items: [
      {
        key: "category",
        label: {
          "zh-CN": "\u5206\u7C7B(category)"
        },
        type: "text"
      },
      {
        key: "level",
        label: {
          "zh-CN": "\u7B49\u7EA7(level)"
        },
        type: "number"
      },
      {
        key: "status",
        label: {
          "zh-CN": "\u72B6\u6001(status)"
        },
        type: "text"
      },
      {
        key: "source",
        label: {
          "zh-CN": "\u6765\u6E90(source)"
        },
        type: "text"
      }
    ]
  },
  extensions: {
    enabled: true,
    allowOtherNamespaces: true,
    namespaces: []
  },
  display: {
    runtimeStatus: "active",
    sourceRuntimeFile: "src/components/Rules/rendering/featureRenderRules.ts",
    rules: [
      {
        id: "BUD-building-structure",
        runtimeStatus: "active",
        match: {
          classCode: "BUD"
        },
        profile: "buildingStructure",
        displayTier: "structure",
        geometry: {
          render: "polygonFillOutline"
        },
        label: {
          enabled: true,
          source: "Name",
          styleKey: "structure-label"
        },
        specialLogic: [
          {
            key: "buildingFloorBinding",
            mode: "optional"
          },
          {
            key: "largeGeometryStableAnchor",
            mode: "optional"
          }
        ],
        notes: "Config rule metadata. Rendering behavior is executed by featureRenderRules.ts.",
        algorithms: [
          {
            key: "buildingFloorBinding",
            mode: "registry"
          },
          {
            key: "largeGeometryStableAnchor",
            mode: "registry"
          },
          {
            key: "polygonCandidateAnchor",
            mode: "registry"
          },
          {
            key: "structureLowZoomPointLabel",
            mode: "registry"
          }
        ]
      }
    ]
  },
  card: {
    runtimeStatus: "active",
    layoutId: "building-card",
    sections: [
      {
        id: "main",
        title: "\u4E3B\u8981\u4FE1\u606F",
        slot: "mainRows"
      },
      {
        id: "other",
        title: "\u5176\u4ED6\u4FE1\u606F",
        slot: "otherRows",
        collapsedByDefault: true
      }
    ],
    fields: [],
    relations: [
      {
        key: "floorViewBinding",
        relationActionKey: "floorViewBinding",
        runtimeStatus: "active"
      }
    ],
    enhancements: [
      {
        key: "floorViewRelation",
        componentKey: "relationRows",
        relationActionKey: "floorViewBinding",
        runtimeStatus: "active"
      }
    ]
  },
  workflowBindings: [
    {
      workflowId: "building-workflow",
      default: true,
      runtimeStatus: "active",
      runtimeMode: "configPrimary"
    }
  ]
};

// node_modules/.cache/cairnmap-legacy-v1/project-config/presets/building/classes/FLR.json
var FLR_default = {
  schemaVersion: "cairnmap.class.v1",
  projectId: "openriamap-ria",
  runtimeStatus: "active",
  classCode: "FLR",
  classKey: "buildingFloor",
  sourceFeatureKey: "\u5EFA\u7B51\u697C\u5C42",
  label: {
    "zh-CN": "\u5EFA\u7B51\u697C\u5C42",
    en: "Building Floor"
  },
  description: "\u5EFA\u7B51\u697C\u5C42 class config-primary config. Runtime facade now resolves from preset Class config.",
  data: {
    typeField: "Type",
    classField: "Class",
    worldField: "World",
    defaultType: "Polygon",
    defaultClass: "FLR"
  },
  geometry: {
    type: "Polygon",
    sourceField: "Flrpoints",
    axisOrder: "x,y,z",
    required: true
  },
  identity: {
    idField: "ID",
    nameField: "Name",
    displayNameField: "Name"
  },
  classification: {
    kindField: "Kind",
    skindField: "SKind",
    skind2Field: "SKind2",
    required: false,
    options: [
      {
        kind: "NOM",
        skind: "NOM",
        skind2: "",
        drawMode: "polygon",
        geom: "\u9762",
        label: {
          "zh-CN": "\u9ED8\u8BA4"
        },
        workflow: {
          visible: true
        },
        display: {
          ruleId: null
        }
      },
      {
        kind: "SPE",
        skind: "SPE",
        skind2: "",
        drawMode: "polygon",
        geom: "\u9762",
        label: {
          "zh-CN": "\u7279\u6B8A"
        },
        workflow: {
          visible: true
        },
        display: {
          ruleId: null
        }
      }
    ]
  },
  fields: [
    {
      key: "ID",
      label: {
        "zh-CN": "\u697C\u5C42ID"
      },
      type: "text",
      required: true,
      optional: false,
      sourceRuntimeField: "ID",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: true
      }
    },
    {
      key: "Name",
      label: {
        "zh-CN": "\u697C\u5C42\u540D"
      },
      type: "text",
      required: true,
      optional: false,
      sourceRuntimeField: "Name",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: true
      }
    },
    {
      key: "NofFloor",
      label: {
        "zh-CN": "\u697C\u5C42\u540D(NofFloor)"
      },
      type: "text",
      required: true,
      optional: false,
      sourceRuntimeField: "NofFloor",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "Kind",
      label: {
        "zh-CN": "\u697C\u5C42\u7C7B\u578B(Kind)"
      },
      type: "text",
      required: true,
      optional: false,
      sourceRuntimeField: "Kind",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "SKind",
      label: {
        "zh-CN": "\u697C\u5C42\u5B50\u7C7B\u578B(SKind)"
      },
      type: "text",
      required: true,
      optional: false,
      sourceRuntimeField: "SKind",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "SKind2",
      label: {
        "zh-CN": "\u697C\u5C42\u4E09\u7EA7\u5B50\u7C7B\u578B(SKind2)"
      },
      type: "text",
      required: false,
      optional: true,
      sourceRuntimeField: "SKind2",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "BuildingID",
      label: {
        "zh-CN": "\u6240\u5C5E\u5EFA\u7B51(BuildingID)"
      },
      type: "text",
      required: true,
      optional: false,
      sourceRuntimeField: "BuildingID",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "Situation",
      label: {
        "zh-CN": "\u72B6\u6001(Situation)"
      },
      type: "text",
      required: false,
      optional: true,
      sourceRuntimeField: "Situation",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "elevation",
      label: {
        "zh-CN": "\u9AD8\u5EA6(y)"
      },
      type: "number",
      required: false,
      optional: true,
      sourceRuntimeField: "elevation",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "height",
      label: {
        "zh-CN": "\u9AD8\u5EA6(height)"
      },
      type: "number",
      required: false,
      optional: true,
      sourceRuntimeField: "height",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    }
  ],
  groups: [],
  tags: {
    enabled: true,
    allowOther: true,
    items: [
      {
        key: "category",
        label: {
          "zh-CN": "\u5206\u7C7B(category)"
        },
        type: "text"
      },
      {
        key: "level",
        label: {
          "zh-CN": "\u7B49\u7EA7(level)"
        },
        type: "number"
      },
      {
        key: "status",
        label: {
          "zh-CN": "\u72B6\u6001(status)"
        },
        type: "text"
      },
      {
        key: "source",
        label: {
          "zh-CN": "\u6765\u6E90(source)"
        },
        type: "text"
      }
    ]
  },
  extensions: {
    enabled: true,
    allowOtherNamespaces: true,
    namespaces: []
  },
  display: {
    runtimeStatus: "active",
    sourceRuntimeFile: "src/components/Rules/rendering/featureRenderRules.ts",
    rules: [
      {
        id: "FLR-indoor-unit",
        runtimeStatus: "active",
        match: {
          classCode: "FLR"
        },
        profile: "indoorUnit",
        displayTier: "indoor",
        geometry: {
          render: "polygonFillOutline"
        },
        label: {
          enabled: true,
          source: "Name",
          styleKey: "bubble-dark-label-13"
        },
        specialLogic: [
          {
            key: "buildingFloorBinding",
            mode: "optional"
          },
          {
            key: "floorViewBinding",
            mode: "optional"
          }
        ],
        notes: "Config rule metadata. Rendering behavior is executed by featureRenderRules.ts.",
        algorithms: [
          {
            key: "buildingFloorBinding",
            mode: "registry"
          },
          {
            key: "polygonCandidateAnchor",
            mode: "registry"
          }
        ]
      }
    ]
  },
  card: {
    runtimeStatus: "active",
    layoutId: "floor-unit-card",
    sections: [
      {
        id: "main",
        title: "\u4E3B\u8981\u4FE1\u606F",
        slot: "mainRows"
      },
      {
        id: "other",
        title: "\u5176\u4ED6\u4FE1\u606F",
        slot: "otherRows",
        collapsedByDefault: true
      }
    ],
    fields: [],
    relations: [
      {
        key: "floorViewBinding",
        relationActionKey: "floorViewBinding",
        runtimeStatus: "active"
      }
    ],
    enhancements: [
      {
        key: "floorViewRelation",
        componentKey: "relationRows",
        relationActionKey: "floorViewBinding",
        runtimeStatus: "active"
      }
    ]
  },
  workflowBindings: [
    {
      workflowId: "floor-workflow",
      default: true,
      runtimeStatus: "active",
      runtimeMode: "configPrimary"
    }
  ]
};

// node_modules/.cache/cairnmap-legacy-v1/project-config/presets/core-structures/classes/ISG.json
var ISG_default = {
  schemaVersion: "cairnmap.class.v1",
  projectId: "openriamap-ria",
  runtimeStatus: "active",
  classCode: "ISG",
  classKey: "genericPolygon",
  sourceFeatureKey: "\u5730\u7269\u9762",
  label: {
    "zh-CN": "\u5730\u7269\u9762",
    en: "Generic Polygon"
  },
  description: "\u5730\u7269\u9762 class config-primary config. Runtime facade now resolves from preset Class config.",
  data: {
    typeField: "Type",
    classField: "Class",
    worldField: "World",
    defaultType: "Polygon",
    defaultClass: "ISG"
  },
  geometry: {
    type: "Polygon",
    sourceField: "Conpoints",
    axisOrder: "x,y,z",
    required: true
  },
  identity: {
    idField: "ID",
    nameField: "Name",
    displayNameField: "Name"
  },
  classification: {
    kindField: "Kind",
    skindField: "SKind",
    skind2Field: "SKind2",
    required: false,
    options: [
      {
        kind: "NGF",
        skind: "LAD",
        skind2: "CON",
        drawMode: "polygon",
        geom: "\u9762",
        label: {
          "zh-CN": "\u5927\u9646"
        },
        workflow: {
          visible: true
        },
        display: {
          ruleId: null
        }
      },
      {
        kind: "NGF",
        skind: "LAD",
        skind2: "ISD",
        drawMode: "polygon",
        geom: "\u9762",
        label: {
          "zh-CN": "\u5C9B\u5C7F"
        },
        workflow: {
          visible: true
        },
        display: {
          ruleId: null
        }
      },
      {
        kind: "NGF",
        skind: "LAD",
        skind2: "SBC",
        drawMode: "polygon",
        geom: "\u9762",
        label: {
          "zh-CN": "\u6B21\u7EA7\u5927\u9646\u5206\u533A"
        },
        workflow: {
          visible: true
        },
        display: {
          ruleId: null
        }
      },
      {
        kind: "NGF",
        skind: "LAD",
        skind2: "RGC",
        drawMode: "polygon",
        geom: "\u9762",
        label: {
          "zh-CN": "\u4E09\u7EA7\u5927\u9646\u5206\u533A"
        },
        workflow: {
          visible: true
        },
        display: {
          ruleId: null
        }
      },
      {
        kind: "NGF",
        skind: "LAD",
        skind2: "PEN",
        drawMode: "polygon",
        geom: "\u9762",
        label: {
          "zh-CN": "\u534A\u5C9B"
        },
        workflow: {
          visible: true
        },
        display: {
          ruleId: null
        }
      },
      {
        kind: "NGF",
        skind: "LAD",
        skind2: "IST",
        drawMode: "polygon",
        geom: "\u9762",
        label: {
          "zh-CN": "\u5730\u5CE1"
        },
        workflow: {
          visible: true
        },
        display: {
          ruleId: null
        }
      },
      {
        kind: "NGF",
        skind: "LIS",
        skind2: "MTN",
        drawMode: "polygon",
        geom: "\u9762",
        label: {
          "zh-CN": "\u5C71\u533A"
        },
        workflow: {
          visible: true
        },
        display: {
          ruleId: null
        }
      },
      {
        kind: "NGF",
        skind: "LIS",
        skind2: "BSN",
        drawMode: "polygon",
        geom: "\u9762",
        label: {
          "zh-CN": "\u76C6\u5730"
        },
        workflow: {
          visible: true
        },
        display: {
          ruleId: null
        }
      },
      {
        kind: "NGF",
        skind: "LIS",
        skind2: "PLN",
        drawMode: "polygon",
        geom: "\u9762",
        label: {
          "zh-CN": "\u5E73\u539F"
        },
        workflow: {
          visible: true
        },
        display: {
          ruleId: null
        }
      },
      {
        kind: "NGF",
        skind: "WTB",
        skind2: "SEA",
        drawMode: "polygon",
        geom: "\u9762",
        label: {
          "zh-CN": "\u6D77\u6D0B"
        },
        workflow: {
          visible: true
        },
        display: {
          ruleId: null
        }
      },
      {
        kind: "NGF",
        skind: "WTB",
        skind2: "LKE",
        drawMode: "polygon",
        geom: "\u9762",
        label: {
          "zh-CN": "\u6E56\u6CCA"
        },
        workflow: {
          visible: true
        },
        display: {
          ruleId: null
        }
      },
      {
        kind: "NGF",
        skind: "WTB",
        skind2: "STR",
        drawMode: "polygon",
        geom: "\u9762",
        label: {
          "zh-CN": "\u6D77\u5CE1"
        },
        workflow: {
          visible: true
        },
        display: {
          ruleId: null
        }
      },
      {
        kind: "NGF",
        skind: "WTB",
        skind2: "EST",
        drawMode: "polygon",
        geom: "\u9762",
        label: {
          "zh-CN": "\u6CB3\u53E3"
        },
        workflow: {
          visible: true
        },
        display: {
          ruleId: null
        }
      },
      {
        kind: "ADM",
        skind: "DBZ",
        skind2: "L1",
        drawMode: "polygon",
        geom: "\u9762",
        label: {
          "zh-CN": "\u4E00\u7EA7\u884C\u653F\u533A"
        },
        workflow: {
          visible: true
        },
        display: {
          ruleId: null
        }
      },
      {
        kind: "ADM",
        skind: "DBZ",
        skind2: "L2",
        drawMode: "polygon",
        geom: "\u9762",
        label: {
          "zh-CN": "\u4E8C\u7EA7\u884C\u653F\u533A"
        },
        workflow: {
          visible: true
        },
        display: {
          ruleId: null
        }
      },
      {
        kind: "ADM",
        skind: "DBZ",
        skind2: "L3",
        drawMode: "polygon",
        geom: "\u9762",
        label: {
          "zh-CN": "\u4E09\u7EA7\u884C\u653F\u533A"
        },
        workflow: {
          visible: true
        },
        display: {
          ruleId: null
        }
      },
      {
        kind: "ADM",
        skind: "PLZ",
        skind2: "L1",
        drawMode: "polygon",
        geom: "\u9762",
        label: {
          "zh-CN": "\u4E00\u7EA7\u89C4\u5212\u884C\u653F\u533A"
        },
        workflow: {
          visible: true
        },
        display: {
          ruleId: null
        }
      },
      {
        kind: "ADM",
        skind: "PLZ",
        skind2: "L2",
        drawMode: "polygon",
        geom: "\u9762",
        label: {
          "zh-CN": "\u4E8C\u7EA7\u89C4\u5212\u884C\u653F\u533A"
        },
        workflow: {
          visible: true
        },
        display: {
          ruleId: null
        }
      },
      {
        kind: "ADM",
        skind: "PLZ",
        skind2: "L3",
        drawMode: "polygon",
        geom: "\u9762",
        label: {
          "zh-CN": "\u4E09\u7EA7\u89C4\u5212\u884C\u653F\u533A"
        },
        workflow: {
          visible: true
        },
        display: {
          ruleId: null
        }
      },
      {
        kind: "ADM",
        skind: "PLZ",
        skind2: "UP",
        drawMode: "polygon",
        geom: "\u9762",
        label: {
          "zh-CN": "\u672A\u5B9A\u89C4\u5212\u533A"
        },
        workflow: {
          visible: true
        },
        display: {
          ruleId: null
        }
      },
      {
        kind: "ADM",
        skind: "PLZ",
        skind2: "UC",
        drawMode: "polygon",
        geom: "\u9762",
        label: {
          "zh-CN": "\u672A\u5B9A\u5EFA\u8BBE\u533A"
        },
        workflow: {
          visible: true
        },
        display: {
          ruleId: null
        }
      }
    ]
  },
  fields: [
    {
      key: "ID",
      label: {
        "zh-CN": "\u5730\u7269\u9762ID"
      },
      type: "text",
      required: true,
      optional: false,
      sourceRuntimeField: "ID",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: true
      }
    },
    {
      key: "Name",
      label: {
        "zh-CN": "\u5730\u7269\u9762\u540D"
      },
      type: "text",
      required: true,
      optional: false,
      sourceRuntimeField: "Name",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: true
      }
    },
    {
      key: "Kind",
      label: {
        "zh-CN": "\u5730\u7269\u9762\u7C7B\u578B(Kind)"
      },
      type: "text",
      required: true,
      optional: false,
      sourceRuntimeField: "Kind",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "SKind",
      label: {
        "zh-CN": "\u5730\u7269\u9762\u5B50\u7C7B\u578B(SKind)"
      },
      type: "text",
      required: true,
      optional: false,
      sourceRuntimeField: "SKind",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "SKind2",
      label: {
        "zh-CN": "\u5730\u7269\u9762\u4E09\u7EA7\u5B50\u7C7B\u578B(SKind2)"
      },
      type: "text",
      required: false,
      optional: true,
      sourceRuntimeField: "SKind2",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "Situation",
      label: {
        "zh-CN": "\u72B6\u6001(Situation)"
      },
      type: "text",
      required: false,
      optional: true,
      sourceRuntimeField: "Situation",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    }
  ],
  groups: [
    {
      key: "tags",
      label: {
        "zh-CN": "tags\uFF08\u53EF\u9009\uFF1A\u7528\u4E8E\u7B5B\u9009/\u6E32\u67D3\u5DEE\u5206\uFF09"
      },
      type: "array",
      optional: true,
      minItems: 0,
      addButtonText: "\u6DFB\u52A0 tag",
      fields: [
        {
          key: "tagKey",
          label: {
            "zh-CN": "\u5B57\u6BB5\u540D"
          },
          type: "select",
          required: true,
          optional: false,
          sourceRuntimeField: "tagKey",
          scenes: {
            workflow: true,
            editor: true,
            infocard: true,
            search: false
          }
        },
        {
          key: "tagKeyOther",
          label: {
            "zh-CN": "\u5176\u4ED6\u5B57\u6BB5\u540D\uFF08\u5F53\u5B57\u6BB5\u540D=\u5176\u4ED6\u65F6\u586B\u5199\uFF09"
          },
          type: "text",
          required: false,
          optional: true,
          sourceRuntimeField: "tagKeyOther",
          scenes: {
            workflow: true,
            editor: true,
            infocard: true,
            search: false
          }
        },
        {
          key: "tagValue",
          label: {
            "zh-CN": "\u503C"
          },
          type: "text",
          required: true,
          optional: false,
          sourceRuntimeField: "tagValue",
          scenes: {
            workflow: true,
            editor: true,
            infocard: true,
            search: false
          }
        }
      ]
    },
    {
      key: "extensions",
      label: {
        "zh-CN": "extensions\uFF08\u53EF\u9009\uFF1A\u4EC5\u8BB0\u5F55\u4FE1\u606F\uFF0C\u4E0D\u53C2\u4E0E\u89C4\u5219\uFF09"
      },
      type: "array",
      optional: true,
      minItems: 0,
      addButtonText: "\u6DFB\u52A0\u6269\u5C55",
      fields: [
        {
          key: "extGroup",
          label: {
            "zh-CN": "\u7EC4/\u547D\u540D\u7A7A\u95F4(extGroup)"
          },
          type: "text",
          required: true,
          optional: false,
          sourceRuntimeField: "extGroup",
          scenes: {
            workflow: true,
            editor: true,
            infocard: true,
            search: false
          }
        },
        {
          key: "extKey",
          label: {
            "zh-CN": "\u5B57\u6BB5\u540D(extKey)"
          },
          type: "text",
          required: true,
          optional: false,
          sourceRuntimeField: "extKey",
          scenes: {
            workflow: true,
            editor: true,
            infocard: true,
            search: false
          }
        },
        {
          key: "extType",
          label: {
            "zh-CN": "\u503C\u7C7B\u578B"
          },
          type: "select",
          required: true,
          optional: false,
          defaultValue: "EXT_VALUE_TYPE_TEXT",
          sourceRuntimeField: "extType",
          scenes: {
            workflow: true,
            editor: true,
            infocard: true,
            search: false
          }
        },
        {
          key: "extValue",
          label: {
            "zh-CN": "\u503C(extValue)"
          },
          type: "text",
          required: true,
          optional: false,
          sourceRuntimeField: "extValue",
          scenes: {
            workflow: true,
            editor: true,
            infocard: true,
            search: false
          }
        }
      ]
    }
  ],
  tags: {
    enabled: true,
    allowOther: true,
    items: [
      {
        key: "category",
        label: {
          "zh-CN": "\u5206\u7C7B(category)"
        },
        type: "text"
      },
      {
        key: "level",
        label: {
          "zh-CN": "\u7B49\u7EA7(level)"
        },
        type: "number"
      },
      {
        key: "status",
        label: {
          "zh-CN": "\u72B6\u6001(status)"
        },
        type: "text"
      },
      {
        key: "source",
        label: {
          "zh-CN": "\u6765\u6E90(source)"
        },
        type: "text"
      }
    ]
  },
  extensions: {
    enabled: true,
    allowOtherNamespaces: true,
    namespaces: []
  },
  display: {
    runtimeStatus: "active",
    sourceRuntimeFile: "src/components/Rules/rendering/featureRenderRules.ts",
    rules: [
      {
        id: "ISG-generic-surface",
        runtimeStatus: "active",
        match: {
          classCode: "ISG"
        },
        profile: "largeGeoSurface",
        displayTier: "geoStructure",
        geometry: {
          render: "polygonFillOutline"
        },
        label: {
          enabled: true,
          source: "Name",
          styleKey: "gm-outline"
        },
        specialLogic: [
          {
            key: "largeGeometryStableAnchor",
            mode: "optional"
          },
          {
            key: "geoClassificationStyleBinding",
            mode: "optional"
          }
        ],
        notes: "Config rule metadata. Rendering behavior is executed by featureRenderRules.ts.",
        algorithms: [
          {
            key: "largeGeometryStableAnchor",
            mode: "registry"
          },
          {
            key: "polygonCandidateAnchor",
            mode: "registry"
          }
        ]
      }
    ]
  },
  card: {
    runtimeStatus: "active",
    layoutId: "generic-polygon-card",
    sections: [
      {
        id: "main",
        title: "\u4E3B\u8981\u4FE1\u606F",
        slot: "mainRows"
      },
      {
        id: "other",
        title: "\u5176\u4ED6\u4FE1\u606F",
        slot: "otherRows",
        collapsedByDefault: true
      }
    ],
    fields: [],
    relations: [],
    enhancements: []
  },
  workflowBindings: [
    {
      workflowId: "generic-polygon-workflow",
      default: true,
      runtimeStatus: "active",
      runtimeMode: "configPrimary"
    }
  ]
};

// node_modules/.cache/cairnmap-legacy-v1/project-config/presets/core-structures/classes/ISL.json
var ISL_default = {
  schemaVersion: "cairnmap.class.v1",
  projectId: "openriamap-ria",
  runtimeStatus: "active",
  classCode: "ISL",
  classKey: "genericLine",
  sourceFeatureKey: "\u5730\u7269\u7EBF",
  label: {
    "zh-CN": "\u5730\u7269\u7EBF",
    en: "Generic Line"
  },
  description: "\u5730\u7269\u7EBF class config-primary config. Runtime facade now resolves from preset Class config.",
  data: {
    typeField: "Type",
    classField: "Class",
    worldField: "World",
    defaultType: "Polyline",
    defaultClass: "ISL"
  },
  geometry: {
    type: "LineString",
    sourceField: "Linepoints",
    axisOrder: "x,y,z",
    required: true
  },
  identity: {
    idField: "ID",
    nameField: "Name",
    displayNameField: "Name"
  },
  classification: {
    kindField: "Kind",
    skindField: "SKind",
    skind2Field: "SKind2",
    required: false,
    options: [
      {
        kind: "NGF",
        skind: "WTR",
        skind2: "RVR",
        drawMode: "polyline",
        geom: "\u7EBF",
        label: {
          "zh-CN": "\u6CB3\u9053"
        },
        workflow: {
          visible: true
        },
        display: {
          ruleId: null
        }
      },
      {
        kind: "NGF",
        skind: "WTR",
        skind2: "CAN",
        drawMode: "polyline",
        geom: "\u7EBF",
        label: {
          "zh-CN": "\u8FD0\u6CB3"
        },
        workflow: {
          visible: true
        },
        display: {
          ruleId: null
        }
      },
      {
        kind: "NGF",
        skind: "BOD",
        skind2: "BDY",
        drawMode: "polyline",
        geom: "\u7EBF",
        label: {
          "zh-CN": "\u7279\u5B9A\u81EA\u7136\u5730\u7406\u8FB9\u754C\u7EBF"
        },
        workflow: {
          visible: true
        },
        display: {
          ruleId: null
        }
      },
      {
        kind: "NGF",
        skind: "BOD",
        skind2: "STC",
        drawMode: "polyline",
        geom: "\u7EBF",
        label: {
          "zh-CN": "\u6D77\u5CE1\u4E2D\u7EBF"
        },
        workflow: {
          visible: true
        },
        display: {
          ruleId: null
        }
      },
      {
        kind: "ADM",
        skind: "DBL",
        skind2: "LBD",
        drawMode: "polyline",
        geom: "\u7EBF",
        label: {
          "zh-CN": "\u884C\u653F\u533A\u8FB9\u754C"
        },
        workflow: {
          visible: true
        },
        display: {
          ruleId: null
        }
      },
      {
        kind: "ADM",
        skind: "PLL",
        skind2: "CBD",
        drawMode: "polyline",
        geom: "\u7EBF",
        label: {
          "zh-CN": "\u89C4\u5212\u533A\u8FB9\u754C"
        },
        workflow: {
          visible: true
        },
        display: {
          ruleId: null
        }
      }
    ]
  },
  fields: [
    {
      key: "ID",
      label: {
        "zh-CN": "\u7EBF\u8981\u7D20ID"
      },
      type: "text",
      required: true,
      optional: false,
      sourceRuntimeField: "ID",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: true
      }
    },
    {
      key: "Name",
      label: {
        "zh-CN": "\u7EBF\u8981\u7D20\u540D"
      },
      type: "text",
      required: true,
      optional: false,
      sourceRuntimeField: "Name",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: true
      }
    },
    {
      key: "Kind",
      label: {
        "zh-CN": "\u7EBF\u8981\u7D20\u7C7B\u578B(Kind)"
      },
      type: "text",
      required: true,
      optional: false,
      sourceRuntimeField: "Kind",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "SKind",
      label: {
        "zh-CN": "\u7EBF\u8981\u7D20\u5B50\u7C7B\u578B(SKind)"
      },
      type: "text",
      required: true,
      optional: false,
      sourceRuntimeField: "SKind",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "SKind2",
      label: {
        "zh-CN": "\u7EBF\u8981\u7D20\u4E09\u7EA7\u5B50\u7C7B\u578B(SKind2)"
      },
      type: "text",
      required: false,
      optional: true,
      sourceRuntimeField: "SKind2",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "Situation",
      label: {
        "zh-CN": "\u72B6\u6001(Situation)"
      },
      type: "text",
      required: false,
      optional: true,
      sourceRuntimeField: "Situation",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    }
  ],
  groups: [
    {
      key: "tags",
      label: {
        "zh-CN": "tags\uFF08\u53EF\u9009\uFF1A\u7528\u4E8E\u7B5B\u9009/\u6E32\u67D3\u5DEE\u5206\uFF09"
      },
      type: "array",
      optional: true,
      minItems: 0,
      addButtonText: "\u6DFB\u52A0 tag",
      fields: [
        {
          key: "tagKey",
          label: {
            "zh-CN": "\u5B57\u6BB5\u540D"
          },
          type: "select",
          required: true,
          optional: false,
          sourceRuntimeField: "tagKey",
          scenes: {
            workflow: true,
            editor: true,
            infocard: true,
            search: false
          }
        },
        {
          key: "tagKeyOther",
          label: {
            "zh-CN": "\u5176\u4ED6\u5B57\u6BB5\u540D\uFF08\u5F53\u5B57\u6BB5\u540D=\u5176\u4ED6\u65F6\u586B\u5199\uFF09"
          },
          type: "text",
          required: false,
          optional: true,
          sourceRuntimeField: "tagKeyOther",
          scenes: {
            workflow: true,
            editor: true,
            infocard: true,
            search: false
          }
        },
        {
          key: "tagValue",
          label: {
            "zh-CN": "\u503C"
          },
          type: "text",
          required: true,
          optional: false,
          sourceRuntimeField: "tagValue",
          scenes: {
            workflow: true,
            editor: true,
            infocard: true,
            search: false
          }
        }
      ]
    },
    {
      key: "extensions",
      label: {
        "zh-CN": "extensions\uFF08\u53EF\u9009\uFF1A\u4EC5\u8BB0\u5F55\u4FE1\u606F\uFF0C\u4E0D\u53C2\u4E0E\u89C4\u5219\uFF09"
      },
      type: "array",
      optional: true,
      minItems: 0,
      addButtonText: "\u6DFB\u52A0\u6269\u5C55",
      fields: [
        {
          key: "extGroup",
          label: {
            "zh-CN": "\u7EC4/\u547D\u540D\u7A7A\u95F4(extGroup)"
          },
          type: "text",
          required: true,
          optional: false,
          sourceRuntimeField: "extGroup",
          scenes: {
            workflow: true,
            editor: true,
            infocard: true,
            search: false
          }
        },
        {
          key: "extKey",
          label: {
            "zh-CN": "\u5B57\u6BB5\u540D(extKey)"
          },
          type: "text",
          required: true,
          optional: false,
          sourceRuntimeField: "extKey",
          scenes: {
            workflow: true,
            editor: true,
            infocard: true,
            search: false
          }
        },
        {
          key: "extType",
          label: {
            "zh-CN": "\u503C\u7C7B\u578B"
          },
          type: "select",
          required: true,
          optional: false,
          defaultValue: "EXT_VALUE_TYPE_TEXT",
          sourceRuntimeField: "extType",
          scenes: {
            workflow: true,
            editor: true,
            infocard: true,
            search: false
          }
        },
        {
          key: "extValue",
          label: {
            "zh-CN": "\u503C(extValue)"
          },
          type: "text",
          required: true,
          optional: false,
          sourceRuntimeField: "extValue",
          scenes: {
            workflow: true,
            editor: true,
            infocard: true,
            search: false
          }
        }
      ]
    }
  ],
  tags: {
    enabled: true,
    allowOther: true,
    items: [
      {
        key: "category",
        label: {
          "zh-CN": "\u5206\u7C7B(category)"
        },
        type: "text"
      },
      {
        key: "level",
        label: {
          "zh-CN": "\u7B49\u7EA7(level)"
        },
        type: "number"
      },
      {
        key: "status",
        label: {
          "zh-CN": "\u72B6\u6001(status)"
        },
        type: "text"
      },
      {
        key: "source",
        label: {
          "zh-CN": "\u6765\u6E90(source)"
        },
        type: "text"
      }
    ]
  },
  extensions: {
    enabled: true,
    allowOtherNamespaces: true,
    namespaces: []
  },
  display: {
    runtimeStatus: "active",
    sourceRuntimeFile: "src/components/Rules/rendering/featureRenderRules.ts",
    rules: [
      {
        id: "ISL-generic-line",
        runtimeStatus: "active",
        match: {
          classCode: "ISL"
        },
        profile: "networkLine",
        displayTier: "network",
        geometry: {
          render: "polyline"
        },
        label: {
          enabled: true,
          source: "Name",
          styleKey: "gm-outline"
        },
        specialLogic: [
          {
            key: "lineLabelPathBinding",
            mode: "optional"
          },
          {
            key: "lineClassificationStyleBinding",
            mode: "optional"
          }
        ],
        notes: "Config rule metadata. Rendering behavior is executed by featureRenderRules.ts.",
        algorithms: [
          {
            key: "lineLabelPathBinding",
            mode: "registry"
          },
          {
            key: "chainageSearchLineLabel",
            mode: "registry"
          }
        ]
      }
    ]
  },
  card: {
    runtimeStatus: "active",
    layoutId: "generic-line-card",
    sections: [
      {
        id: "main",
        title: "\u4E3B\u8981\u4FE1\u606F",
        slot: "mainRows"
      },
      {
        id: "other",
        title: "\u5176\u4ED6\u4FE1\u606F",
        slot: "otherRows",
        collapsedByDefault: true
      }
    ],
    fields: [],
    relations: [],
    enhancements: []
  },
  workflowBindings: [
    {
      workflowId: "generic-line-workflow",
      default: true,
      runtimeStatus: "active",
      runtimeMode: "configPrimary"
    }
  ]
};

// node_modules/.cache/cairnmap-legacy-v1/project-config/presets/core-structures/classes/ISP.json
var ISP_default = {
  schemaVersion: "cairnmap.class.v1",
  projectId: "openriamap-ria",
  runtimeStatus: "active",
  classCode: "ISP",
  classKey: "genericPoint",
  sourceFeatureKey: "\u5730\u7269\u70B9",
  label: {
    "zh-CN": "\u5730\u7269\u70B9",
    en: "Generic Point"
  },
  description: "\u5730\u7269\u70B9 class config-primary config. Runtime facade now resolves from preset Class config.",
  data: {
    typeField: "Type",
    classField: "Class",
    worldField: "World",
    defaultType: "Points",
    defaultClass: "ISP"
  },
  geometry: {
    type: "Point",
    sourceField: "coordinate",
    axisOrder: "x,y,z",
    required: true
  },
  identity: {
    idField: "ID",
    nameField: "Name",
    displayNameField: "Name"
  },
  classification: {
    kindField: "Kind",
    skindField: "SKind",
    skind2Field: "SKind2",
    required: false,
    options: [
      {
        kind: "NGF",
        skind: "SCP",
        skind2: "SPP",
        drawMode: "point",
        geom: "\u70B9",
        label: {
          "zh-CN": "\u7279\u5B9A\u81EA\u7136\u8981\u7D20\u70B9"
        },
        workflow: {
          visible: true
        },
        display: {
          ruleId: null
        }
      },
      {
        kind: "ADM",
        skind: "DBP",
        skind2: "LIP",
        drawMode: "point",
        geom: "\u70B9",
        label: {
          "zh-CN": "\u7279\u5B9A\u5730\u6807\u70B9"
        },
        workflow: {
          visible: true
        },
        display: {
          ruleId: null
        }
      },
      {
        kind: "ADM",
        skind: "PLP",
        skind2: "PLP",
        drawMode: "point",
        geom: "\u70B9",
        label: {
          "zh-CN": "\u89C4\u5212\u70B9"
        },
        workflow: {
          visible: true
        },
        display: {
          ruleId: null
        }
      },
      {
        kind: "ADM",
        skind: "PLP",
        skind2: "COP",
        drawMode: "point",
        geom: "\u70B9",
        label: {
          "zh-CN": "\u5EFA\u8BBE\u70B9"
        },
        workflow: {
          visible: true
        },
        display: {
          ruleId: null
        }
      },
      {
        kind: "ADM",
        skind: "DBP",
        skind2: "SHR",
        drawMode: "point",
        geom: "\u70B9",
        label: {
          "zh-CN": "\u5730\u6807\u70B9"
        },
        workflow: {
          visible: true
        },
        display: {
          ruleId: null
        }
      }
    ]
  },
  fields: [
    {
      key: "ID",
      label: {
        "zh-CN": "\u8981\u7D20\u70B9ID"
      },
      type: "text",
      required: true,
      optional: false,
      sourceRuntimeField: "ID",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: true
      }
    },
    {
      key: "Name",
      label: {
        "zh-CN": "\u8981\u7D20\u70B9\u540D"
      },
      type: "text",
      required: true,
      optional: false,
      sourceRuntimeField: "Name",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: true
      }
    },
    {
      key: "Kind",
      label: {
        "zh-CN": "\u8981\u7D20\u7C7B\u578B(Kind)"
      },
      type: "text",
      required: true,
      optional: false,
      sourceRuntimeField: "Kind",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "SKind",
      label: {
        "zh-CN": "\u8981\u7D20\u5B50\u7C7B\u578B(SKind)"
      },
      type: "text",
      required: true,
      optional: false,
      sourceRuntimeField: "SKind",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "SKind2",
      label: {
        "zh-CN": "\u8981\u7D20\u4E09\u7EA7\u5B50\u7C7B\u578B(SKind2)"
      },
      type: "text",
      required: false,
      optional: true,
      sourceRuntimeField: "SKind2",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "Situation",
      label: {
        "zh-CN": "\u72B6\u6001(Situation)"
      },
      type: "text",
      required: false,
      optional: true,
      sourceRuntimeField: "Situation",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "elevation",
      label: {
        "zh-CN": "\u9AD8\u5EA6(y)"
      },
      type: "number",
      required: false,
      optional: true,
      sourceRuntimeField: "elevation",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    }
  ],
  groups: [
    {
      key: "tags",
      label: {
        "zh-CN": "tags\uFF08\u53EF\u9009\uFF1A\u7528\u4E8E\u7B5B\u9009/\u6E32\u67D3\u5DEE\u5206\uFF09"
      },
      type: "array",
      optional: true,
      minItems: 0,
      addButtonText: "\u6DFB\u52A0 tag",
      fields: [
        {
          key: "tagKey",
          label: {
            "zh-CN": "\u5B57\u6BB5\u540D"
          },
          type: "select",
          required: true,
          optional: false,
          sourceRuntimeField: "tagKey",
          scenes: {
            workflow: true,
            editor: true,
            infocard: true,
            search: false
          }
        },
        {
          key: "tagKeyOther",
          label: {
            "zh-CN": "\u5176\u4ED6\u5B57\u6BB5\u540D\uFF08\u5F53\u5B57\u6BB5\u540D=\u5176\u4ED6\u65F6\u586B\u5199\uFF09"
          },
          type: "text",
          required: false,
          optional: true,
          sourceRuntimeField: "tagKeyOther",
          scenes: {
            workflow: true,
            editor: true,
            infocard: true,
            search: false
          }
        },
        {
          key: "tagValue",
          label: {
            "zh-CN": "\u503C"
          },
          type: "text",
          required: true,
          optional: false,
          sourceRuntimeField: "tagValue",
          scenes: {
            workflow: true,
            editor: true,
            infocard: true,
            search: false
          }
        }
      ]
    },
    {
      key: "extensions",
      label: {
        "zh-CN": "extensions\uFF08\u53EF\u9009\uFF1A\u4EC5\u8BB0\u5F55\u4FE1\u606F\uFF0C\u4E0D\u53C2\u4E0E\u89C4\u5219\uFF09"
      },
      type: "array",
      optional: true,
      minItems: 0,
      addButtonText: "\u6DFB\u52A0\u6269\u5C55",
      fields: [
        {
          key: "extGroup",
          label: {
            "zh-CN": "\u7EC4/\u547D\u540D\u7A7A\u95F4(extGroup)"
          },
          type: "text",
          required: true,
          optional: false,
          sourceRuntimeField: "extGroup",
          scenes: {
            workflow: true,
            editor: true,
            infocard: true,
            search: false
          }
        },
        {
          key: "extKey",
          label: {
            "zh-CN": "\u5B57\u6BB5\u540D(extKey)"
          },
          type: "text",
          required: true,
          optional: false,
          sourceRuntimeField: "extKey",
          scenes: {
            workflow: true,
            editor: true,
            infocard: true,
            search: false
          }
        },
        {
          key: "extType",
          label: {
            "zh-CN": "\u503C\u7C7B\u578B"
          },
          type: "select",
          required: true,
          optional: false,
          defaultValue: "EXT_VALUE_TYPE_TEXT",
          sourceRuntimeField: "extType",
          scenes: {
            workflow: true,
            editor: true,
            infocard: true,
            search: false
          }
        },
        {
          key: "extValue",
          label: {
            "zh-CN": "\u503C(extValue)"
          },
          type: "text",
          required: true,
          optional: false,
          sourceRuntimeField: "extValue",
          scenes: {
            workflow: true,
            editor: true,
            infocard: true,
            search: false
          }
        }
      ]
    }
  ],
  tags: {
    enabled: true,
    allowOther: true,
    items: [
      {
        key: "category",
        label: {
          "zh-CN": "\u5206\u7C7B(category)"
        },
        type: "text"
      },
      {
        key: "level",
        label: {
          "zh-CN": "\u7B49\u7EA7(level)"
        },
        type: "number"
      },
      {
        key: "status",
        label: {
          "zh-CN": "\u72B6\u6001(status)"
        },
        type: "text"
      },
      {
        key: "source",
        label: {
          "zh-CN": "\u6765\u6E90(source)"
        },
        type: "text"
      }
    ]
  },
  extensions: {
    enabled: true,
    allowOtherNamespaces: true,
    namespaces: []
  },
  display: {
    runtimeStatus: "active",
    sourceRuntimeFile: "src/components/Rules/rendering/featureRenderRules.ts",
    rules: [
      {
        id: "ISP-generic-point",
        runtimeStatus: "active",
        match: {
          classCode: "ISP"
        },
        profile: "poiPoint",
        displayTier: "poi",
        geometry: {
          render: "none"
        },
        label: {
          enabled: true,
          source: "Name",
          styleKey: "bubble-dark-label-14"
        },
        specialLogic: [
          {
            key: "genericPointIconBinding",
            mode: "optional"
          }
        ],
        notes: "Config rule metadata. Rendering behavior is executed by featureRenderRules.ts."
      }
    ]
  },
  card: {
    runtimeStatus: "active",
    layoutId: "generic-point-card",
    sections: [
      {
        id: "main",
        title: "\u4E3B\u8981\u4FE1\u606F",
        slot: "mainRows"
      },
      {
        id: "other",
        title: "\u5176\u4ED6\u4FE1\u606F",
        slot: "otherRows",
        collapsedByDefault: true
      }
    ],
    fields: [],
    relations: [],
    enhancements: []
  },
  workflowBindings: [
    {
      workflowId: "generic-point-workflow",
      default: true,
      runtimeStatus: "active",
      runtimeMode: "configPrimary"
    }
  ]
};

// node_modules/.cache/cairnmap-legacy-v1/project-config/presets/rail/classes/PFB.json
var PFB_default = {
  schemaVersion: "cairnmap.class.v1",
  projectId: "openriamap-ria",
  runtimeStatus: "active",
  classCode: "PFB",
  classKey: "platformFootprint",
  sourceFeatureKey: "\u7AD9\u53F0\u8F6E\u5ED3",
  label: {
    "zh-CN": "\u7AD9\u53F0\u8F6E\u5ED3",
    en: "Platform Footprint"
  },
  description: "\u7AD9\u53F0\u8F6E\u5ED3 class config-primary config. Runtime facade now resolves from preset Class config.",
  data: {
    typeField: "Type",
    classField: "Class",
    worldField: "World",
    defaultType: "Polygon",
    defaultClass: "PFB"
  },
  geometry: {
    type: "Polygon",
    sourceField: "Flrpoints",
    axisOrder: "x,y,z",
    required: true
  },
  identity: {
    idField: "ID",
    nameField: "Name",
    displayNameField: "Name"
  },
  classification: {
    kindField: "Kind",
    skindField: "SKind",
    skind2Field: "SKind2",
    required: false,
    options: []
  },
  fields: [
    {
      key: "ID",
      label: {
        "zh-CN": "\u7AD9\u53F0\u8F6E\u5ED3ID"
      },
      type: "text",
      required: true,
      optional: false,
      sourceRuntimeField: "ID",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: true
      }
    },
    {
      key: "Name",
      label: {
        "zh-CN": "\u7AD9\u53F0\u8F6E\u5ED3\u540D"
      },
      type: "text",
      required: true,
      optional: false,
      sourceRuntimeField: "Name",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: true
      }
    },
    {
      key: "LineID",
      label: {
        "zh-CN": "\u7EBF\u8DEFID(LineID)"
      },
      type: "text",
      required: true,
      optional: false,
      sourceRuntimeField: "LineID",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "elevation",
      label: {
        "zh-CN": "\u9AD8\u5EA6(y)"
      },
      type: "number",
      required: false,
      optional: true,
      sourceRuntimeField: "elevation",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "height",
      label: {
        "zh-CN": "\u9AD8\u5EA6(height)"
      },
      type: "number",
      required: false,
      optional: true,
      sourceRuntimeField: "height",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    }
  ],
  groups: [],
  tags: {
    enabled: true,
    allowOther: true,
    items: [
      {
        key: "category",
        label: {
          "zh-CN": "\u5206\u7C7B(category)"
        },
        type: "text"
      },
      {
        key: "level",
        label: {
          "zh-CN": "\u7B49\u7EA7(level)"
        },
        type: "number"
      },
      {
        key: "status",
        label: {
          "zh-CN": "\u72B6\u6001(status)"
        },
        type: "text"
      },
      {
        key: "source",
        label: {
          "zh-CN": "\u6765\u6E90(source)"
        },
        type: "text"
      }
    ]
  },
  extensions: {
    enabled: true,
    allowOtherNamespaces: true,
    namespaces: []
  },
  display: {
    runtimeStatus: "active",
    sourceRuntimeFile: "src/components/Rules/rendering/featureRenderRules.ts",
    rules: [
      {
        id: "PFB-platform-outline",
        runtimeStatus: "active",
        match: {
          classCode: "PFB"
        },
        profile: "geometryOnlyFallback",
        displayTier: "structure",
        geometry: {
          render: "polygonFillOutline"
        },
        label: {
          enabled: false,
          source: "Name",
          styleKey: "gm-outline"
        },
        specialLogic: [
          {
            key: "stationPlatformOutlineColorBinding",
            mode: "optional"
          }
        ],
        notes: "Config rule metadata. Rendering behavior is executed by featureRenderRules.ts.",
        algorithms: [
          {
            key: "railLineColorBinding",
            mode: "registry"
          },
          {
            key: "stationPlatformVisibilityBinding",
            mode: "registry"
          },
          {
            key: "polygonCandidateAnchor",
            mode: "registry"
          }
        ]
      }
    ]
  },
  card: {
    runtimeStatus: "active",
    layoutId: "platform-footprint-card",
    sections: [
      {
        id: "main",
        title: "\u4E3B\u8981\u4FE1\u606F",
        slot: "mainRows"
      },
      {
        id: "other",
        title: "\u5176\u4ED6\u4FE1\u606F",
        slot: "otherRows",
        collapsedByDefault: true
      }
    ],
    fields: [],
    relations: [],
    enhancements: [
      {
        key: "genericRelationLinks",
        componentKey: "relationRows",
        runtimeStatus: "active"
      }
    ]
  },
  workflowBindings: [
    {
      workflowId: "rail-platform-boundary-workflow",
      default: true,
      runtimeStatus: "active",
      runtimeMode: "specialComponentPrimary"
    }
  ]
};

// node_modules/.cache/cairnmap-legacy-v1/project-config/presets/rail/classes/PLF.json
var PLF_default = {
  schemaVersion: "cairnmap.class.v1",
  projectId: "openriamap-ria",
  runtimeStatus: "active",
  classCode: "PLF",
  classKey: "platform",
  sourceFeatureKey: "\u7AD9\u53F0",
  label: {
    "zh-CN": "\u7AD9\u53F0",
    en: "Platform"
  },
  description: "\u7AD9\u53F0 class config-primary config. Runtime facade now resolves from preset Class config.",
  data: {
    typeField: "Type",
    classField: "Class",
    worldField: "World",
    defaultType: "Points",
    defaultClass: "PLF"
  },
  geometry: {
    type: "Point",
    sourceField: "coordinate",
    axisOrder: "x,y,z",
    required: true
  },
  identity: {
    idField: "ID",
    nameField: "Name",
    displayNameField: "Name"
  },
  classification: {
    kindField: "Kind",
    skindField: "SKind",
    skind2Field: "SKind2",
    required: false,
    options: []
  },
  fields: [
    {
      key: "ID",
      label: {
        "zh-CN": "\u7AD9\u53F0ID"
      },
      type: "text",
      required: true,
      optional: false,
      sourceRuntimeField: "ID",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: true
      }
    },
    {
      key: "Name",
      label: {
        "zh-CN": "\u7AD9\u53F0\u540D\u79F0"
      },
      type: "text",
      required: true,
      optional: false,
      sourceRuntimeField: "Name",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: true
      }
    },
    {
      key: "elevation",
      label: {
        "zh-CN": "\u9AD8\u5EA6(y)"
      },
      type: "number",
      required: false,
      optional: true,
      sourceRuntimeField: "elevation",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "Situation",
      label: {
        "zh-CN": "\u7AD9\u53F0\u662F\u5426\u542F\u7528(Situation)"
      },
      type: "bool",
      required: true,
      optional: false,
      defaultValue: true,
      sourceRuntimeField: "Situation",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "Connect",
      label: {
        "zh-CN": "\u5916\u90E8\u8FDE\u63A5\u529F\u80FD(Connect)"
      },
      type: "bool",
      required: true,
      optional: false,
      defaultValue: true,
      sourceRuntimeField: "Connect",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    }
  ],
  groups: [
    {
      key: "lines",
      label: {
        "zh-CN": "\u7ECF\u884C\u7EBF\u8DEF lines"
      },
      type: "array",
      optional: false,
      minItems: 1,
      addButtonText: "\u6DFB\u52A0\u7EBF\u8DEF\u6761\u76EE",
      fields: [
        {
          key: "ID",
          label: {
            "zh-CN": "\u7EBF\u8DEFID"
          },
          type: "text",
          required: true,
          optional: false,
          sourceRuntimeField: "ID",
          scenes: {
            workflow: true,
            editor: true,
            infocard: true,
            search: true
          }
        },
        {
          key: "stationCode",
          label: {
            "zh-CN": "\u7AD9\u53F0\u7F16\u53F7(\u53EF\u9009)"
          },
          type: "number",
          required: false,
          optional: true,
          sourceRuntimeField: "stationCode",
          scenes: {
            workflow: true,
            editor: true,
            infocard: true,
            search: false
          }
        },
        {
          key: "stationDistance",
          label: {
            "zh-CN": "\u7EBF\u8DEF\u8DDD\u79BB(\u53EF\u9009)"
          },
          type: "number",
          required: false,
          optional: true,
          sourceRuntimeField: "stationDistance",
          scenes: {
            workflow: true,
            editor: true,
            infocard: true,
            search: false
          }
        },
        {
          key: "Avaliable",
          label: {
            "zh-CN": "\u53EF\u4F7F\u7528\u6027(Avaliable)"
          },
          type: "bool",
          required: true,
          optional: false,
          defaultValue: true,
          sourceRuntimeField: "Avaliable",
          scenes: {
            workflow: true,
            editor: true,
            infocard: true,
            search: false
          }
        },
        {
          key: "Overtaking",
          label: {
            "zh-CN": "\u8D8A\u884C(Overtaking)"
          },
          type: "bool",
          required: true,
          optional: false,
          defaultValue: false,
          sourceRuntimeField: "Overtaking",
          scenes: {
            workflow: true,
            editor: true,
            infocard: true,
            search: false
          }
        },
        {
          key: "getin",
          label: {
            "zh-CN": "\u53EF\u4E0A\u8F66(getin)"
          },
          type: "bool",
          required: true,
          optional: false,
          defaultValue: true,
          sourceRuntimeField: "getin",
          scenes: {
            workflow: true,
            editor: true,
            infocard: true,
            search: false
          }
        },
        {
          key: "getout",
          label: {
            "zh-CN": "\u53EF\u4E0B\u8F66(getout)"
          },
          type: "bool",
          required: true,
          optional: false,
          defaultValue: true,
          sourceRuntimeField: "getout",
          scenes: {
            workflow: true,
            editor: true,
            infocard: true,
            search: false
          }
        },
        {
          key: "NextOT",
          label: {
            "zh-CN": "\u4E0B\u4E00\u7AD9\u8D8A\u884C(NextOT)"
          },
          type: "bool",
          required: true,
          optional: false,
          defaultValue: false,
          sourceRuntimeField: "NextOT",
          scenes: {
            workflow: true,
            editor: true,
            infocard: true,
            search: false
          }
        }
      ]
    }
  ],
  tags: {
    enabled: true,
    allowOther: true,
    items: [
      {
        key: "category",
        label: {
          "zh-CN": "\u5206\u7C7B(category)"
        },
        type: "text"
      },
      {
        key: "level",
        label: {
          "zh-CN": "\u7B49\u7EA7(level)"
        },
        type: "number"
      },
      {
        key: "status",
        label: {
          "zh-CN": "\u72B6\u6001(status)"
        },
        type: "text"
      },
      {
        key: "source",
        label: {
          "zh-CN": "\u6765\u6E90(source)"
        },
        type: "text"
      }
    ]
  },
  extensions: {
    enabled: true,
    allowOtherNamespaces: true,
    namespaces: []
  },
  display: {
    runtimeStatus: "active",
    sourceRuntimeFile: "src/components/Rules/rendering/featureRenderRules.ts",
    rules: [
      {
        id: "PLF-platform-node",
        runtimeStatus: "active",
        match: {
          classCode: "PLF"
        },
        profile: "transportNode",
        displayTier: "transportNode",
        geometry: {
          render: "none"
        },
        label: {
          enabled: true,
          source: "Name",
          styleKey: "bubble-dark-label-14"
        },
        specialLogic: [
          {
            key: "stationPlatformVisibilityBinding",
            mode: "optional"
          },
          {
            key: "platformLineColorBinding",
            mode: "optional"
          },
          {
            key: "platformConnectVisibility",
            mode: "optional"
          }
        ],
        notes: "Config rule metadata. Rendering behavior is executed by featureRenderRules.ts.",
        algorithms: [
          {
            key: "stationPlatformVisibilityBinding",
            mode: "registry"
          }
        ]
      }
    ]
  },
  card: {
    runtimeStatus: "active",
    layoutId: "rail-platform-card",
    sections: [
      {
        id: "main",
        title: "\u4E3B\u8981\u4FE1\u606F",
        slot: "mainRows"
      },
      {
        id: "other",
        title: "\u5176\u4ED6\u4FE1\u606F",
        slot: "otherRows",
        collapsedByDefault: true
      }
    ],
    fields: [],
    relations: [],
    enhancements: [
      {
        key: "genericRelationLinks",
        componentKey: "relationRows",
        runtimeStatus: "active"
      }
    ]
  },
  workflowBindings: [
    {
      workflowId: "rail-platform-workflow",
      default: true,
      runtimeStatus: "active",
      runtimeMode: "specialComponentPrimary"
    }
  ]
};

// node_modules/.cache/cairnmap-legacy-v1/project-config/presets/rail/classes/RLE.json
var RLE_default = {
  schemaVersion: "cairnmap.class.v1",
  projectId: "openriamap-ria",
  runtimeStatus: "active",
  classCode: "RLE",
  classKey: "railLine",
  sourceFeatureKey: "\u94C1\u8DEF",
  label: {
    "zh-CN": "\u94C1\u8DEF",
    en: "Rail Line"
  },
  description: "\u94C1\u8DEF class config-primary config. Runtime facade now resolves from preset Class config.",
  data: {
    typeField: "Type",
    classField: "Class",
    worldField: "World",
    defaultType: "Polyline",
    defaultClass: "RLE"
  },
  geometry: {
    type: "LineString",
    sourceField: "PLpoints",
    axisOrder: "x,y,z",
    required: true
  },
  identity: {
    idField: "ID",
    nameField: "Name",
    displayNameField: "Name"
  },
  classification: {
    kindField: "Kind",
    skindField: "SKind",
    skind2Field: "SKind2",
    required: false,
    options: []
  },
  fields: [
    {
      key: "ID",
      label: {
        "zh-CN": "\u7EBF\u8DEFID"
      },
      type: "text",
      required: true,
      optional: false,
      sourceRuntimeField: "ID",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: true
      }
    },
    {
      key: "Name",
      label: {
        "zh-CN": "\u7EBF\u8DEF\u540D"
      },
      type: "text",
      required: true,
      optional: false,
      sourceRuntimeField: "Name",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: true
      }
    },
    {
      key: "bureau",
      label: {
        "zh-CN": "\u8DEF\u5C40\u4EE3\u7801"
      },
      type: "text",
      required: false,
      optional: true,
      sourceRuntimeField: "bureau",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "line",
      label: {
        "zh-CN": "\u7EBF\u8DEF\u7F16\u53F7"
      },
      type: "text",
      required: false,
      optional: true,
      sourceRuntimeField: "line",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "color",
      label: {
        "zh-CN": "\u6807\u51C6\u8272\u53F7(color)"
      },
      type: "text",
      required: true,
      optional: false,
      sourceRuntimeField: "color",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "direction",
      label: {
        "zh-CN": "\u65B9\u5411(direction)"
      },
      type: "select",
      required: true,
      optional: false,
      sourceRuntimeField: "direction",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "startplf",
      label: {
        "zh-CN": "\u8D77\u70B9\u7AD9\u53F0\u540D(startplf)"
      },
      type: "text",
      required: true,
      optional: false,
      sourceRuntimeField: "startplf",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "endplf",
      label: {
        "zh-CN": "\u7EC8\u70B9\u7AD9\u53F0\u540D(endplf)"
      },
      type: "text",
      required: true,
      optional: false,
      sourceRuntimeField: "endplf",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    }
  ],
  groups: [],
  tags: {
    enabled: true,
    allowOther: true,
    items: [
      {
        key: "category",
        label: {
          "zh-CN": "\u5206\u7C7B(category)"
        },
        type: "text"
      },
      {
        key: "level",
        label: {
          "zh-CN": "\u7B49\u7EA7(level)"
        },
        type: "number"
      },
      {
        key: "status",
        label: {
          "zh-CN": "\u72B6\u6001(status)"
        },
        type: "text"
      },
      {
        key: "source",
        label: {
          "zh-CN": "\u6765\u6E90(source)"
        },
        type: "text"
      }
    ]
  },
  extensions: {
    enabled: true,
    allowOtherNamespaces: true,
    namespaces: []
  },
  display: {
    runtimeStatus: "active",
    sourceRuntimeFile: "src/components/Rules/rendering/featureRenderRules.ts",
    rules: [
      {
        id: "RLE-rail-network-line",
        runtimeStatus: "active",
        match: {
          classCode: "RLE"
        },
        profile: "networkLine",
        displayTier: "network",
        geometry: {
          render: "polyline"
        },
        label: {
          enabled: true,
          source: "Name",
          styleKey: "rle-line-dynamic"
        },
        specialLogic: [
          {
            key: "railLineColorBinding",
            mode: "optional"
          },
          {
            key: "railDirectionVisibility",
            mode: "optional"
          },
          {
            key: "lineLabelPathBinding",
            mode: "optional"
          }
        ],
        notes: "Config rule metadata. Rendering behavior is executed by featureRenderRules.ts.",
        algorithms: [
          {
            key: "railLineColorBinding",
            mode: "registry"
          },
          {
            key: "lineLabelPathBinding",
            mode: "registry"
          },
          {
            key: "chainageSearchLineLabel",
            mode: "registry"
          }
        ]
      }
    ]
  },
  card: {
    runtimeStatus: "active",
    layoutId: "rail-line-card",
    sections: [
      {
        id: "main",
        title: "\u4E3B\u8981\u4FE1\u606F",
        slot: "mainRows"
      },
      {
        id: "other",
        title: "\u5176\u4ED6\u4FE1\u606F",
        slot: "otherRows",
        collapsedByDefault: true
      }
    ],
    fields: [],
    relations: [],
    enhancements: [
      {
        key: "genericRelationLinks",
        componentKey: "relationRows",
        runtimeStatus: "active"
      }
    ]
  },
  workflowBindings: [
    {
      workflowId: "rail-line-workflow",
      default: true,
      runtimeStatus: "active",
      runtimeMode: "specialComponentPrimary"
    }
  ]
};

// node_modules/.cache/cairnmap-legacy-v1/project-config/presets/road/classes/ROD.json
var ROD_default = {
  schemaVersion: "cairnmap.class.v1",
  projectId: "openriamap-ria",
  runtimeStatus: "active",
  classCode: "ROD",
  classKey: "road",
  sourceFeatureKey: "\u9053\u8DEF",
  label: {
    "zh-CN": "\u9053\u8DEF",
    en: "Road"
  },
  description: "\u9053\u8DEF class config-primary config. Runtime facade now resolves from preset Class config.",
  data: {
    typeField: "Type",
    classField: "Class",
    worldField: "World",
    defaultType: "Polyline",
    defaultClass: "ROD"
  },
  geometry: {
    type: "LineString",
    sourceField: "Linepoints",
    axisOrder: "x,y,z",
    required: true
  },
  identity: {
    idField: "ID",
    nameField: "Name",
    displayNameField: "Name"
  },
  classification: {
    kindField: "Kind",
    skindField: "SKind",
    skind2Field: "SKind2",
    required: false,
    options: [
      {
        kind: "NOM",
        skind: "",
        skind2: "",
        drawMode: "polyline",
        geom: "\u7EBF",
        label: {
          "zh-CN": "\u901A\u7528"
        },
        workflow: {
          visible: true
        },
        display: {
          ruleId: null
        }
      },
      {
        kind: "TUK",
        skind: "",
        skind2: "",
        drawMode: "polyline",
        geom: "\u7EBF",
        label: {
          "zh-CN": "\u91CD\u8981\u5E72\u7EBF"
        },
        workflow: {
          visible: true
        },
        display: {
          ruleId: null
        }
      },
      {
        kind: "PRI",
        skind: "",
        skind2: "",
        drawMode: "polyline",
        geom: "\u7EBF",
        label: {
          "zh-CN": "\u4E3B\u5E72\u7EBF"
        },
        workflow: {
          visible: true
        },
        display: {
          ruleId: null
        }
      },
      {
        kind: "SEC",
        skind: "",
        skind2: "",
        drawMode: "polyline",
        geom: "\u7EBF",
        label: {
          "zh-CN": "\u6B21\u5E72\u7EBF"
        },
        workflow: {
          visible: true
        },
        display: {
          ruleId: null
        }
      },
      {
        kind: "SED",
        skind: "",
        skind2: "",
        drawMode: "polyline",
        geom: "\u7EBF",
        label: {
          "zh-CN": "\u652F\u8DEF"
        },
        workflow: {
          visible: true
        },
        display: {
          ruleId: null
        },
        notes: "CM_ROD_CLASSIFICATION_FIX_1: \u652F\u8DEF\u7531 SEC \u6539\u4E3A SED\uFF0C\u907F\u514D\u4E0E\u6B21\u5E72\u7EBF SEC:: \u91CD\u590D\u3002"
      },
      {
        kind: "RES",
        skind: "",
        skind2: "",
        drawMode: "polyline",
        geom: "\u7EBF",
        label: {
          "zh-CN": "\u5C0F\u533A\u57DF\u9053\u8DEF"
        },
        workflow: {
          visible: true
        },
        display: {
          ruleId: null
        }
      },
      {
        kind: "SVS",
        skind: "",
        skind2: "",
        drawMode: "polyline",
        geom: "\u7EBF",
        label: {
          "zh-CN": "\u531D\u9053"
        },
        workflow: {
          visible: true
        },
        display: {
          ruleId: null
        }
      },
      {
        kind: "IDR",
        skind: "",
        skind2: "",
        drawMode: "polyline",
        geom: "\u7EBF",
        label: {
          "zh-CN": "\u5BA4\u5185\u9053\u8DEF"
        },
        workflow: {
          visible: true
        },
        display: {
          ruleId: null
        }
      },
      {
        kind: "SPE",
        skind: "",
        skind2: "",
        drawMode: "polyline",
        geom: "\u7EBF",
        label: {
          "zh-CN": "\u7279\u6B8A"
        },
        workflow: {
          visible: true
        },
        display: {
          ruleId: null
        }
      }
    ]
  },
  fields: [
    {
      key: "ID",
      label: {
        "zh-CN": "\u9053\u8DEFID"
      },
      type: "text",
      required: true,
      optional: false,
      sourceRuntimeField: "ID",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: true
      }
    },
    {
      key: "Name",
      label: {
        "zh-CN": "\u9053\u8DEF\u540D"
      },
      type: "text",
      required: true,
      optional: false,
      sourceRuntimeField: "Name",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: true
      }
    },
    {
      key: "Kind",
      label: {
        "zh-CN": "\u7C7B\u578B(Kind)"
      },
      type: "text",
      required: true,
      optional: false,
      sourceRuntimeField: "Kind",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "SKind",
      label: {
        "zh-CN": "\u5B50\u7C7B\u578B(SKind)"
      },
      type: "text",
      required: false,
      optional: true,
      sourceRuntimeField: "SKind",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "SKind2",
      label: {
        "zh-CN": "\u4E09\u7EA7\u5B50\u7C7B\u578B(SKind2)"
      },
      type: "text",
      required: false,
      optional: true,
      sourceRuntimeField: "SKind2",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "Level",
      label: {
        "zh-CN": "\u9053\u8DEF\u5C42\u7EA7(Level)"
      },
      type: "number",
      required: true,
      optional: false,
      sourceRuntimeField: "Level",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "Oneway",
      label: {
        "zh-CN": "\u662F\u5426\u5355\u5411(Oneway)"
      },
      type: "bool",
      required: true,
      optional: false,
      sourceRuntimeField: "Oneway",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "Enter",
      label: {
        "zh-CN": "\u662F\u5426\u53EF\u8FDB\u5165(Enter)"
      },
      type: "bool",
      required: false,
      optional: true,
      sourceRuntimeField: "Enter",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "Exit",
      label: {
        "zh-CN": "\u662F\u5426\u53EF\u79BB\u5F00(Exit)"
      },
      type: "bool",
      required: false,
      optional: true,
      sourceRuntimeField: "Exit",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "SelfJunction",
      label: {
        "zh-CN": "\u662F\u5426\u5141\u8BB8\u81EA\u4EA4(SelfJunction)"
      },
      type: "bool",
      required: false,
      optional: true,
      sourceRuntimeField: "SelfJunction",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "Speed",
      label: {
        "zh-CN": "\u9053\u8DEF\u901F\u5EA6(Speed)"
      },
      type: "number",
      required: false,
      optional: true,
      sourceRuntimeField: "Speed",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "Situation",
      label: {
        "zh-CN": "\u72B6\u6001(Situation)"
      },
      type: "text",
      required: false,
      optional: true,
      sourceRuntimeField: "Situation",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    }
  ],
  groups: [
    {
      key: "ConnectL",
      label: {
        "zh-CN": "\u663E\u5F0F\u8FDE\u63A5\u5173\u7CFB(ConnectL)"
      },
      type: "array",
      optional: true,
      minItems: 0,
      fields: [
        {
          key: "mode",
          label: {
            "zh-CN": "\u8FDE\u63A5\u65B9\u5F0F(mode)"
          },
          type: "select",
          required: true,
          optional: false,
          options: [
            {
              label: "\u7AEF\u70B9(endpoint)",
              value: "endpoint"
            },
            {
              label: "\u4E2D\u6BB5(middle)",
              value: "middle"
            }
          ],
          sourceRuntimeField: "mode",
          scenes: {
            workflow: true,
            editor: true,
            infocard: true,
            search: false
          }
        },
        {
          key: "tgt",
          label: {
            "zh-CN": "\u76EE\u6807\u9053\u8DEFID(tgt)"
          },
          type: "text",
          required: true,
          optional: false,
          sourceRuntimeField: "tgt",
          scenes: {
            workflow: true,
            editor: true,
            infocard: true,
            search: false
          }
        }
      ]
    },
    {
      key: "Blacklist",
      label: {
        "zh-CN": "\u9ED1\u540D\u5355(Blacklist)"
      },
      type: "array",
      optional: true,
      minItems: 0,
      fields: [
        {
          key: "tgt",
          label: {
            "zh-CN": "\u76EE\u6807\u9053\u8DEFID(tgt)"
          },
          type: "text",
          required: true,
          optional: false,
          sourceRuntimeField: "tgt",
          scenes: {
            workflow: true,
            editor: true,
            infocard: true,
            search: false
          }
        }
      ]
    },
    {
      key: "Mode",
      label: {
        "zh-CN": "\u5141\u8BB8\u51FA\u884C\u65B9\u5F0F(Mode)"
      },
      type: "array",
      optional: true,
      minItems: 0,
      fields: [
        {
          key: "code",
          label: {
            "zh-CN": "\u51FA\u884C\u65B9\u5F0F\u7F16\u7801(code)"
          },
          type: "text",
          required: true,
          optional: false,
          sourceRuntimeField: "code",
          scenes: {
            workflow: true,
            editor: true,
            infocard: true,
            search: false
          }
        }
      ]
    }
  ],
  tags: {
    enabled: true,
    allowOther: true,
    items: [
      {
        key: "category",
        label: {
          "zh-CN": "\u5206\u7C7B(category)"
        },
        type: "text"
      },
      {
        key: "level",
        label: {
          "zh-CN": "\u7B49\u7EA7(level)"
        },
        type: "number"
      },
      {
        key: "status",
        label: {
          "zh-CN": "\u72B6\u6001(status)"
        },
        type: "text"
      },
      {
        key: "source",
        label: {
          "zh-CN": "\u6765\u6E90(source)"
        },
        type: "text"
      }
    ]
  },
  extensions: {
    enabled: true,
    allowOtherNamespaces: true,
    namespaces: []
  },
  display: {
    runtimeStatus: "active",
    sourceRuntimeFile: "src/components/Rules/rendering/featureRenderRules.ts",
    rules: [
      {
        id: "ROD-road-network-line",
        runtimeStatus: "active",
        match: {
          classCode: "ROD"
        },
        profile: "networkLine",
        displayTier: "network",
        geometry: {
          render: "polyline"
        },
        label: {
          enabled: true,
          source: "Name",
          styleKey: "gm-bw-dynamic"
        },
        specialLogic: [
          {
            key: "roadLineStyleBinding",
            mode: "optional"
          },
          {
            key: "roadZoomVisibility",
            mode: "optional"
          },
          {
            key: "lineLabelPathBinding",
            mode: "optional"
          }
        ],
        notes: "Config rule metadata. Rendering behavior is executed by featureRenderRules.ts.",
        algorithms: [
          {
            key: "roadLineStyleBinding",
            mode: "registry"
          },
          {
            key: "lineLabelPathBinding",
            mode: "registry"
          },
          {
            key: "chainageSearchLineLabel",
            mode: "registry"
          }
        ]
      }
    ]
  },
  card: {
    runtimeStatus: "active",
    layoutId: "generic-line-card",
    sections: [
      {
        id: "main",
        title: "\u4E3B\u8981\u4FE1\u606F",
        slot: "mainRows"
      },
      {
        id: "other",
        title: "\u5176\u4ED6\u4FE1\u606F",
        slot: "otherRows",
        collapsedByDefault: true
      }
    ],
    fields: [],
    relations: [],
    enhancements: []
  },
  workflowBindings: [
    {
      workflowId: "road-workflow",
      default: true,
      runtimeStatus: "active",
      runtimeMode: "configPrimary"
    }
  ]
};

// node_modules/.cache/cairnmap-legacy-v1/project-config/presets/rail/classes/SBP.json
var SBP_default = {
  schemaVersion: "cairnmap.class.v1",
  projectId: "openriamap-ria",
  runtimeStatus: "active",
  classCode: "SBP",
  classKey: "stationBuildingPoint",
  sourceFeatureKey: "\u8F66\u7AD9\u5EFA\u7B51\u70B9",
  label: {
    "zh-CN": "\u8F66\u7AD9\u5EFA\u7B51\u70B9",
    en: "Station Building Point"
  },
  description: "\u8F66\u7AD9\u5EFA\u7B51\u70B9 class config-primary config. Runtime facade now resolves from preset Class config.",
  data: {
    typeField: "Type",
    classField: "Class",
    worldField: "World",
    defaultType: "Points",
    defaultClass: "SBP"
  },
  geometry: {
    type: "Point",
    sourceField: "coordinate",
    axisOrder: "x,y,z",
    required: true
  },
  identity: {
    idField: "ID",
    nameField: "Name",
    displayNameField: "Name"
  },
  classification: {
    kindField: "Kind",
    skindField: "SKind",
    skind2Field: "SKind2",
    required: false,
    options: []
  },
  fields: [
    {
      key: "ID",
      label: {
        "zh-CN": "\u8F66\u7AD9\u5EFA\u7B51\u70B9ID"
      },
      type: "text",
      required: true,
      optional: false,
      sourceRuntimeField: "ID",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: true
      }
    },
    {
      key: "Name",
      label: {
        "zh-CN": "\u8F66\u7AD9\u5EFA\u7B51\u540D"
      },
      type: "text",
      required: true,
      optional: false,
      sourceRuntimeField: "Name",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: true
      }
    },
    {
      key: "elevation",
      label: {
        "zh-CN": "\u9AD8\u5EA6(y)"
      },
      type: "number",
      required: false,
      optional: true,
      sourceRuntimeField: "elevation",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    }
  ],
  groups: [
    {
      key: "Floors",
      label: {
        "zh-CN": "\u5305\u542B\u697C\u5C42 Floors"
      },
      type: "array",
      optional: true,
      minItems: 0,
      addButtonText: "\u6DFB\u52A0\u697C\u5C42\u6761\u76EE",
      fields: [
        {
          key: "ID",
          label: {
            "zh-CN": "\u697C\u5C42ID"
          },
          type: "text",
          required: true,
          optional: false,
          sourceRuntimeField: "ID",
          scenes: {
            workflow: true,
            editor: true,
            infocard: true,
            search: true
          }
        },
        {
          key: "Group",
          label: {
            "zh-CN": "\u5206\u7EC4(Group)"
          },
          type: "text",
          required: false,
          optional: true,
          sourceRuntimeField: "Group",
          scenes: {
            workflow: true,
            editor: true,
            infocard: true,
            search: false
          }
        }
      ]
    },
    {
      key: "stations",
      label: {
        "zh-CN": "\u5305\u542B\u7AD9\u53F0 stations"
      },
      type: "array",
      optional: false,
      minItems: 1,
      addButtonText: "\u6DFB\u52A0\u7AD9\u53F0\u6761\u76EE",
      fields: [
        {
          key: "ID",
          label: {
            "zh-CN": "\u8F66\u7AD9ID"
          },
          type: "text",
          required: true,
          optional: false,
          sourceRuntimeField: "ID",
          scenes: {
            workflow: true,
            editor: true,
            infocard: true,
            search: true
          }
        }
      ]
    }
  ],
  tags: {
    enabled: true,
    allowOther: true,
    items: [
      {
        key: "category",
        label: {
          "zh-CN": "\u5206\u7C7B(category)"
        },
        type: "text"
      },
      {
        key: "level",
        label: {
          "zh-CN": "\u7B49\u7EA7(level)"
        },
        type: "number"
      },
      {
        key: "status",
        label: {
          "zh-CN": "\u72B6\u6001(status)"
        },
        type: "text"
      },
      {
        key: "source",
        label: {
          "zh-CN": "\u6765\u6E90(source)"
        },
        type: "text"
      }
    ]
  },
  extensions: {
    enabled: true,
    allowOtherNamespaces: true,
    namespaces: []
  },
  display: {
    runtimeStatus: "active",
    sourceRuntimeFile: "src/components/Rules/rendering/featureRenderRules.ts",
    rules: [
      {
        id: "SBP-station-building-point",
        runtimeStatus: "active",
        match: {
          classCode: "SBP"
        },
        profile: "poiPoint",
        displayTier: "poi",
        geometry: {
          render: "none"
        },
        label: {
          enabled: true,
          source: "Name",
          styleKey: "bubble-dark-label-14"
        },
        specialLogic: [
          {
            key: "stationBuildingPointFallback",
            mode: "optional"
          },
          {
            key: "hideIfSameIdExistsInClasses",
            mode: "optional",
            targetClasses: [
              "STB"
            ]
          }
        ],
        notes: "Config rule metadata. Rendering behavior is executed by featureRenderRules.ts.",
        algorithms: [
          {
            key: "buildingFloorBinding",
            mode: "registry"
          }
        ]
      }
    ]
  },
  card: {
    runtimeStatus: "active",
    layoutId: "standard-feature-card",
    sections: [
      {
        id: "main",
        title: "\u4E3B\u8981\u4FE1\u606F",
        slot: "mainRows"
      },
      {
        id: "other",
        title: "\u5176\u4ED6\u4FE1\u606F",
        slot: "otherRows",
        collapsedByDefault: true
      }
    ],
    fields: [],
    relations: [],
    enhancements: [
      {
        key: "genericRelationLinks",
        componentKey: "relationRows",
        runtimeStatus: "active"
      }
    ]
  },
  workflowBindings: [
    {
      workflowId: "rail-station-building-point-workflow",
      default: true,
      runtimeStatus: "active",
      runtimeMode: "specialComponentPrimary"
    }
  ]
};

// node_modules/.cache/cairnmap-legacy-v1/project-config/presets/rail/classes/STA.json
var STA_default = {
  schemaVersion: "cairnmap.class.v1",
  projectId: "openriamap-ria",
  runtimeStatus: "active",
  classCode: "STA",
  classKey: "station",
  sourceFeatureKey: "\u8F66\u7AD9",
  label: {
    "zh-CN": "\u8F66\u7AD9",
    en: "Station"
  },
  description: "\u8F66\u7AD9 class config-primary config. Runtime facade now resolves from preset Class config.",
  data: {
    typeField: "Type",
    classField: "Class",
    worldField: "World",
    defaultType: "Points",
    defaultClass: "STA"
  },
  geometry: {
    type: "Point",
    sourceField: "coordinate",
    axisOrder: "x,y,z",
    required: true
  },
  identity: {
    idField: "ID",
    nameField: "Name",
    displayNameField: "Name"
  },
  classification: {
    kindField: "Kind",
    skindField: "SKind",
    skind2Field: "SKind2",
    required: false,
    options: []
  },
  fields: [
    {
      key: "ID",
      label: {
        "zh-CN": "\u8F66\u7AD9ID"
      },
      type: "text",
      required: true,
      optional: false,
      sourceRuntimeField: "ID",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: true
      }
    },
    {
      key: "Name",
      label: {
        "zh-CN": "\u8F66\u7AD9\u540D"
      },
      type: "text",
      required: true,
      optional: false,
      sourceRuntimeField: "Name",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: true
      }
    },
    {
      key: "STBuilding",
      label: {
        "zh-CN": "\u8F66\u7AD9\u6240\u5C5E\u8F66\u7AD9\u5EFA\u4F53(STBuilding)"
      },
      type: "text",
      required: true,
      optional: false,
      sourceRuntimeField: "STBuilding",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "elevation",
      label: {
        "zh-CN": "\u9AD8\u5EA6(y)"
      },
      type: "number",
      required: false,
      optional: true,
      sourceRuntimeField: "elevation",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    }
  ],
  groups: [
    {
      key: "platforms",
      label: {
        "zh-CN": "\u5305\u542B\u7AD9\u53F0 platforms"
      },
      type: "array",
      optional: false,
      minItems: 1,
      addButtonText: "\u6DFB\u52A0\u7AD9\u53F0\u6761\u76EE",
      fields: [
        {
          key: "ID",
          label: {
            "zh-CN": "\u7AD9\u53F0ID"
          },
          type: "text",
          required: true,
          optional: false,
          sourceRuntimeField: "ID",
          scenes: {
            workflow: true,
            editor: true,
            infocard: true,
            search: true
          }
        }
      ]
    }
  ],
  tags: {
    enabled: true,
    allowOther: true,
    items: [
      {
        key: "category",
        label: {
          "zh-CN": "\u5206\u7C7B(category)"
        },
        type: "text"
      },
      {
        key: "level",
        label: {
          "zh-CN": "\u7B49\u7EA7(level)"
        },
        type: "number"
      },
      {
        key: "status",
        label: {
          "zh-CN": "\u72B6\u6001(status)"
        },
        type: "text"
      },
      {
        key: "source",
        label: {
          "zh-CN": "\u6765\u6E90(source)"
        },
        type: "text"
      }
    ]
  },
  extensions: {
    enabled: true,
    allowOtherNamespaces: true,
    namespaces: []
  },
  display: {
    runtimeStatus: "active",
    sourceRuntimeFile: "src/components/Rules/rendering/featureRenderRules.ts",
    rules: [
      {
        id: "STA-station-node",
        runtimeStatus: "active",
        match: {
          classCode: "STA"
        },
        profile: "transportNode",
        displayTier: "transportNode",
        geometry: {
          render: "none"
        },
        label: {
          enabled: true,
          source: "Name",
          styleKey: "bubble-dark-label-14"
        },
        specialLogic: [
          {
            key: "stationPlatformVisibilityBinding",
            mode: "optional"
          },
          {
            key: "stationPointColorBinding",
            mode: "optional"
          }
        ],
        notes: "Config rule metadata. Rendering behavior is executed by featureRenderRules.ts.",
        algorithms: [
          {
            key: "stationPlatformVisibilityBinding",
            mode: "registry"
          }
        ]
      }
    ]
  },
  card: {
    runtimeStatus: "active",
    layoutId: "rail-station-card",
    sections: [
      {
        id: "main",
        title: "\u4E3B\u8981\u4FE1\u606F",
        slot: "mainRows"
      },
      {
        id: "other",
        title: "\u5176\u4ED6\u4FE1\u606F",
        slot: "otherRows",
        collapsedByDefault: true
      }
    ],
    fields: [],
    relations: [],
    enhancements: [
      {
        key: "genericRelationLinks",
        componentKey: "relationRows",
        runtimeStatus: "active"
      }
    ]
  },
  workflowBindings: [
    {
      workflowId: "rail-station-workflow",
      default: true,
      runtimeStatus: "active",
      runtimeMode: "specialComponentPrimary"
    }
  ]
};

// node_modules/.cache/cairnmap-legacy-v1/project-config/presets/rail/classes/STB.json
var STB_default = {
  schemaVersion: "cairnmap.class.v1",
  projectId: "openriamap-ria",
  runtimeStatus: "active",
  classCode: "STB",
  classKey: "stationBuilding",
  sourceFeatureKey: "\u8F66\u7AD9\u5EFA\u7B51",
  label: {
    "zh-CN": "\u8F66\u7AD9\u5EFA\u7B51",
    en: "Station Building"
  },
  description: "\u8F66\u7AD9\u5EFA\u7B51 class config-primary config. Runtime facade now resolves from preset Class config.",
  data: {
    typeField: "Type",
    classField: "Class",
    worldField: "World",
    defaultType: "Polygon",
    defaultClass: "STB"
  },
  geometry: {
    type: "Polygon",
    sourceField: "Conpoints",
    axisOrder: "x,y,z",
    required: true
  },
  identity: {
    idField: "ID",
    nameField: "Name",
    displayNameField: "Name"
  },
  classification: {
    kindField: "Kind",
    skindField: "SKind",
    skind2Field: "SKind2",
    required: false,
    options: []
  },
  fields: [
    {
      key: "ID",
      label: {
        "zh-CN": "\u8F66\u7AD9\u5EFA\u7B51ID"
      },
      type: "text",
      required: true,
      optional: false,
      sourceRuntimeField: "ID",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: true
      }
    },
    {
      key: "Name",
      label: {
        "zh-CN": "\u8F66\u7AD9\u5EFA\u7B51\u540D"
      },
      type: "text",
      required: true,
      optional: false,
      sourceRuntimeField: "Name",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: true
      }
    },
    {
      key: "elevation",
      label: {
        "zh-CN": "\u9AD8\u5EA6(y)"
      },
      type: "number",
      required: false,
      optional: true,
      sourceRuntimeField: "elevation",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "height",
      label: {
        "zh-CN": "\u5EFA\u7B51\u9AD8\u5EA6(height)"
      },
      type: "number",
      required: false,
      optional: true,
      sourceRuntimeField: "height",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    }
  ],
  groups: [
    {
      key: "Floors",
      label: {
        "zh-CN": "\u5305\u542B\u697C\u5C42 Floors"
      },
      type: "array",
      optional: true,
      minItems: 0,
      addButtonText: "\u6DFB\u52A0\u697C\u5C42\u6761\u76EE",
      fields: [
        {
          key: "ID",
          label: {
            "zh-CN": "\u697C\u5C42ID"
          },
          type: "text",
          required: false,
          optional: true,
          sourceRuntimeField: "ID",
          scenes: {
            workflow: true,
            editor: true,
            infocard: true,
            search: true
          }
        },
        {
          key: "Group",
          label: {
            "zh-CN": "\u5206\u7EC4(Group)"
          },
          type: "text",
          required: false,
          optional: true,
          sourceRuntimeField: "Group",
          scenes: {
            workflow: true,
            editor: true,
            infocard: true,
            search: false
          }
        }
      ]
    }
  ],
  tags: {
    enabled: true,
    allowOther: true,
    items: [
      {
        key: "category",
        label: {
          "zh-CN": "\u5206\u7C7B(category)"
        },
        type: "text"
      },
      {
        key: "level",
        label: {
          "zh-CN": "\u7B49\u7EA7(level)"
        },
        type: "number"
      },
      {
        key: "status",
        label: {
          "zh-CN": "\u72B6\u6001(status)"
        },
        type: "text"
      },
      {
        key: "source",
        label: {
          "zh-CN": "\u6765\u6E90(source)"
        },
        type: "text"
      }
    ]
  },
  extensions: {
    enabled: true,
    allowOtherNamespaces: true,
    namespaces: []
  },
  display: {
    runtimeStatus: "active",
    sourceRuntimeFile: "src/components/Rules/rendering/featureRenderRules.ts",
    rules: [
      {
        id: "STB-station-structure",
        runtimeStatus: "active",
        match: {
          classCode: "STB"
        },
        profile: "stationStructure",
        displayTier: "structure",
        geometry: {
          render: "polygonFillOutline"
        },
        label: {
          enabled: true,
          source: "Name",
          styleKey: "structure-label"
        },
        specialLogic: [
          {
            key: "stationBuildingBinding",
            mode: "optional"
          },
          {
            key: "largeGeometryStableAnchor",
            mode: "optional"
          }
        ],
        notes: "Config rule metadata. Rendering behavior is executed by featureRenderRules.ts.",
        algorithms: [
          {
            key: "buildingFloorBinding",
            mode: "registry"
          },
          {
            key: "stationPlatformVisibilityBinding",
            mode: "registry"
          },
          {
            key: "largeGeometryStableAnchor",
            mode: "registry"
          },
          {
            key: "polygonCandidateAnchor",
            mode: "registry"
          },
          {
            key: "structureLowZoomPointLabel",
            mode: "registry"
          }
        ]
      }
    ]
  },
  card: {
    runtimeStatus: "active",
    layoutId: "rail-station-building-card",
    sections: [
      {
        id: "main",
        title: "\u4E3B\u8981\u4FE1\u606F",
        slot: "mainRows"
      },
      {
        id: "other",
        title: "\u5176\u4ED6\u4FE1\u606F",
        slot: "otherRows",
        collapsedByDefault: true
      }
    ],
    fields: [],
    relations: [
      {
        key: "floorViewBinding",
        relationActionKey: "floorViewBinding",
        runtimeStatus: "active"
      }
    ],
    enhancements: [
      {
        key: "genericRelationLinks",
        componentKey: "relationRows",
        runtimeStatus: "active"
      },
      {
        key: "floorViewRelation",
        componentKey: "relationRows",
        relationActionKey: "floorViewBinding",
        runtimeStatus: "active"
      }
    ]
  },
  workflowBindings: [
    {
      workflowId: "rail-station-building-workflow",
      default: true,
      runtimeStatus: "active",
      runtimeMode: "specialComponentPrimary"
    }
  ]
};

// node_modules/.cache/cairnmap-legacy-v1/project-config/presets/rail/classes/STF.json
var STF_default = {
  schemaVersion: "cairnmap.class.v1",
  projectId: "openriamap-ria",
  runtimeStatus: "active",
  classCode: "STF",
  classKey: "stationFloor",
  sourceFeatureKey: "\u8F66\u7AD9\u5EFA\u7B51\u697C\u5C42",
  label: {
    "zh-CN": "\u8F66\u7AD9\u5EFA\u7B51\u697C\u5C42",
    en: "Station Floor"
  },
  description: "\u8F66\u7AD9\u5EFA\u7B51\u697C\u5C42 class config-primary config. Runtime facade now resolves from preset Class config.",
  data: {
    typeField: "Type",
    classField: "Class",
    worldField: "World",
    defaultType: "Polygon",
    defaultClass: "STF"
  },
  geometry: {
    type: "Polygon",
    sourceField: "Flrpoints",
    axisOrder: "x,y,z",
    required: true
  },
  identity: {
    idField: "ID",
    nameField: "Name",
    displayNameField: "Name"
  },
  classification: {
    kindField: "Kind",
    skindField: "SKind",
    skind2Field: "SKind2",
    required: false,
    options: []
  },
  fields: [
    {
      key: "ID",
      label: {
        "zh-CN": "\u697C\u5C42ID"
      },
      type: "text",
      required: true,
      optional: false,
      sourceRuntimeField: "ID",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: true
      }
    },
    {
      key: "Name",
      label: {
        "zh-CN": "\u697C\u5C42\u540D"
      },
      type: "text",
      required: true,
      optional: false,
      sourceRuntimeField: "Name",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: true
      }
    },
    {
      key: "NofFloor",
      label: {
        "zh-CN": "\u697C\u5C42\u540D(NofFloor)"
      },
      type: "text",
      required: true,
      optional: false,
      sourceRuntimeField: "NofFloor",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "staBuildingID",
      label: {
        "zh-CN": "\u6240\u5C5E\u8F66\u7AD9\u5EFA\u7B51(staBuildingID)"
      },
      type: "text",
      required: true,
      optional: false,
      sourceRuntimeField: "staBuildingID",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "Situation",
      label: {
        "zh-CN": "\u72B6\u6001(Situation)"
      },
      type: "text",
      required: false,
      optional: true,
      sourceRuntimeField: "Situation",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "elevation",
      label: {
        "zh-CN": "\u9AD8\u5EA6(y)"
      },
      type: "number",
      required: false,
      optional: true,
      sourceRuntimeField: "elevation",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "height",
      label: {
        "zh-CN": "\u5C42\u9AD8(height)"
      },
      type: "number",
      required: false,
      optional: true,
      sourceRuntimeField: "height",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    }
  ],
  groups: [],
  tags: {
    enabled: true,
    allowOther: true,
    items: [
      {
        key: "category",
        label: {
          "zh-CN": "\u5206\u7C7B(category)"
        },
        type: "text"
      },
      {
        key: "level",
        label: {
          "zh-CN": "\u7B49\u7EA7(level)"
        },
        type: "number"
      },
      {
        key: "status",
        label: {
          "zh-CN": "\u72B6\u6001(status)"
        },
        type: "text"
      },
      {
        key: "source",
        label: {
          "zh-CN": "\u6765\u6E90(source)"
        },
        type: "text"
      }
    ]
  },
  extensions: {
    enabled: true,
    allowOtherNamespaces: true,
    namespaces: []
  },
  display: {
    runtimeStatus: "active",
    sourceRuntimeFile: "src/components/Rules/rendering/featureRenderRules.ts",
    rules: [
      {
        id: "STF-station-floor",
        runtimeStatus: "active",
        match: {
          classCode: "STF"
        },
        profile: "indoorUnit",
        displayTier: "indoor",
        geometry: {
          render: "polygonFillOutline"
        },
        label: {
          enabled: true,
          source: "Name",
          styleKey: "bubble-dark-label-13"
        },
        specialLogic: [
          {
            key: "stationFloorViewBinding",
            mode: "optional"
          }
        ],
        sourceRuntimeMatchText: "DEFAULT_FLOOR_VIEW.floorClass",
        notes: "Config-primary rule for station floor features. Runtime currently references DEFAULT_FLOOR_VIEW.floorClass in featureRenderRules.ts.",
        algorithms: [
          {
            key: "buildingFloorBinding",
            mode: "registry"
          },
          {
            key: "polygonCandidateAnchor",
            mode: "registry"
          }
        ]
      }
    ]
  },
  card: {
    runtimeStatus: "active",
    layoutId: "station-floor-card",
    sections: [
      {
        id: "main",
        title: "\u4E3B\u8981\u4FE1\u606F",
        slot: "mainRows"
      },
      {
        id: "other",
        title: "\u5176\u4ED6\u4FE1\u606F",
        slot: "otherRows",
        collapsedByDefault: true
      }
    ],
    fields: [],
    relations: [
      {
        key: "floorViewBinding",
        relationActionKey: "floorViewBinding",
        runtimeStatus: "active"
      }
    ],
    enhancements: [
      {
        key: "genericRelationLinks",
        componentKey: "relationRows",
        runtimeStatus: "active"
      },
      {
        key: "floorViewRelation",
        componentKey: "relationRows",
        relationActionKey: "floorViewBinding",
        runtimeStatus: "active"
      }
    ]
  },
  workflowBindings: [
    {
      workflowId: "rail-station-building-floor-workflow",
      default: true,
      runtimeStatus: "active",
      runtimeMode: "specialComponentPrimary"
    }
  ]
};

// node_modules/.cache/cairnmap-legacy-v1/project-config/presets/teleport/classes/TPP.json
var TPP_default = {
  schemaVersion: "cairnmap.class.v1",
  projectId: "openriamap-ria",
  runtimeStatus: "active",
  classCode: "TPP",
  classKey: "teleportPoint",
  sourceFeatureKey: "\u4F20\u9001\u70B9",
  label: {
    "zh-CN": "\u4F20\u9001\u70B9",
    en: "Teleport Point"
  },
  description: "\u4F20\u9001\u70B9 class config-primary config. Runtime facade now resolves from preset Class config.",
  data: {
    typeField: "Type",
    classField: "Class",
    worldField: "World",
    defaultType: "Points",
    defaultClass: "TPP"
  },
  geometry: {
    type: "Point",
    sourceField: "coordinate",
    axisOrder: "x,y,z",
    required: true
  },
  identity: {
    idField: "ID",
    nameField: "Name",
    displayNameField: "Name"
  },
  classification: {
    kindField: "Kind",
    skindField: "SKind",
    skind2Field: "SKind2",
    required: false,
    options: [
      {
        kind: "NOM",
        skind: "NOM",
        skind2: "",
        drawMode: "point",
        geom: "\u70B9",
        label: {
          "zh-CN": "\u9ED8\u8BA4"
        },
        workflow: {
          visible: true
        },
        display: {
          ruleId: null
        }
      },
      {
        kind: "SPE",
        skind: "SPE",
        skind2: "",
        drawMode: "point",
        geom: "\u70B9",
        label: {
          "zh-CN": "\u7279\u6B8A"
        },
        workflow: {
          visible: true
        },
        display: {
          ruleId: null
        }
      }
    ]
  },
  fields: [
    {
      key: "ID",
      label: {
        "zh-CN": "\u4F20\u9001\u70B9ID"
      },
      type: "text",
      required: true,
      optional: false,
      sourceRuntimeField: "ID",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: true
      }
    },
    {
      key: "Name",
      label: {
        "zh-CN": "\u4F20\u9001\u70B9\u540D"
      },
      type: "text",
      required: true,
      optional: false,
      sourceRuntimeField: "Name",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: true
      }
    },
    {
      key: "Kind",
      label: {
        "zh-CN": "\u7C7B\u578B(Kind)"
      },
      type: "text",
      required: true,
      optional: false,
      sourceRuntimeField: "Kind",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "SKind",
      label: {
        "zh-CN": "\u5B50\u7C7B\u578B(SKind)"
      },
      type: "text",
      required: false,
      optional: true,
      sourceRuntimeField: "SKind",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "SKind2",
      label: {
        "zh-CN": "\u4E09\u7EA7\u5B50\u7C7B\u578B(SKind2)"
      },
      type: "text",
      required: false,
      optional: true,
      sourceRuntimeField: "SKind2",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "hub",
      label: {
        "zh-CN": "\u67A2\u7EBD(hub)"
      },
      type: "text",
      required: false,
      optional: true,
      sourceRuntimeField: "hub",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "TGTWarp",
      label: {
        "zh-CN": "\u76EE\u6807Warp(TGTWarp)"
      },
      type: "text",
      required: false,
      optional: true,
      sourceRuntimeField: "TGTWarp",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "TGT_x",
      label: {
        "zh-CN": "\u76EE\u6807\u70B9X(TGT_x)"
      },
      type: "number",
      required: false,
      optional: true,
      sourceRuntimeField: "TGT_x",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "TGT_z",
      label: {
        "zh-CN": "\u76EE\u6807\u70B9Z(TGT_z)"
      },
      type: "number",
      required: false,
      optional: true,
      sourceRuntimeField: "TGT_z",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "elevation",
      label: {
        "zh-CN": "\u4F20\u9001\u70B9\u9AD8\u5EA6(y)"
      },
      type: "number",
      required: false,
      optional: true,
      sourceRuntimeField: "elevation",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "TGTelevation",
      label: {
        "zh-CN": "\u76EE\u6807\u70B9\u9AD8\u5EA6(TGTelevation)"
      },
      type: "number",
      required: false,
      optional: true,
      sourceRuntimeField: "TGTelevation",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    }
  ],
  groups: [],
  tags: {
    enabled: true,
    allowOther: true,
    items: [
      {
        key: "category",
        label: {
          "zh-CN": "\u5206\u7C7B(category)"
        },
        type: "text"
      },
      {
        key: "level",
        label: {
          "zh-CN": "\u7B49\u7EA7(level)"
        },
        type: "number"
      },
      {
        key: "status",
        label: {
          "zh-CN": "\u72B6\u6001(status)"
        },
        type: "text"
      },
      {
        key: "source",
        label: {
          "zh-CN": "\u6765\u6E90(source)"
        },
        type: "text"
      }
    ]
  },
  extensions: {
    enabled: true,
    allowOtherNamespaces: true,
    namespaces: []
  },
  display: {
    runtimeStatus: "active",
    sourceRuntimeFile: "src/components/Rules/rendering/featureRenderRules.ts",
    rules: [
      {
        id: "TPP-teleport-point",
        runtimeStatus: "active",
        match: {
          classCode: "TPP"
        },
        profile: "poiPoint",
        displayTier: "poi",
        geometry: {
          render: "none"
        },
        label: {
          enabled: true,
          source: "Name",
          styleKey: "bubble-dark-label-14"
        },
        specialLogic: [
          {
            key: "teleportPointBinding",
            mode: "optional"
          }
        ],
        notes: "Config rule metadata. Rendering behavior is executed by featureRenderRules.ts."
      }
    ]
  },
  card: {
    runtimeStatus: "active",
    layoutId: "teleport-point-card",
    sections: [
      {
        id: "main",
        title: "\u4E3B\u8981\u4FE1\u606F",
        slot: "mainRows"
      },
      {
        id: "other",
        title: "\u5176\u4ED6\u4FE1\u606F",
        slot: "otherRows",
        collapsedByDefault: true
      }
    ],
    fields: [],
    relations: [],
    enhancements: []
  },
  workflowBindings: [
    {
      workflowId: "teleport-workflow",
      default: true,
      runtimeStatus: "active",
      runtimeMode: "configPrimary"
    }
  ]
};

// node_modules/.cache/cairnmap-legacy-v1/project-config/presets/trade/classes/TRP.json
var TRP_default = {
  schemaVersion: "cairnmap.class.v1",
  projectId: "openriamap-ria",
  runtimeStatus: "active",
  classCode: "TRP",
  classKey: "tradePoint",
  sourceFeatureKey: "\u4EA4\u6613\u70B9",
  label: {
    "zh-CN": "\u4EA4\u6613\u70B9",
    en: "Trade Point"
  },
  description: "\u4EA4\u6613\u70B9 class config-primary config. Runtime facade now resolves from preset Class config.",
  data: {
    typeField: "Type",
    classField: "Class",
    worldField: "World",
    defaultType: "Points",
    defaultClass: "TRP"
  },
  geometry: {
    type: "Point",
    sourceField: "coordinate",
    axisOrder: "x,y,z",
    required: true
  },
  identity: {
    idField: "ID",
    nameField: "Name",
    displayNameField: "Name"
  },
  classification: {
    kindField: "Kind",
    skindField: "SKind",
    skind2Field: "SKind2",
    required: false,
    options: [
      {
        kind: "NOM",
        skind: "NOM",
        skind2: "",
        drawMode: "point",
        geom: "\u70B9",
        label: {
          "zh-CN": "\u9ED8\u8BA4"
        },
        workflow: {
          visible: true
        },
        display: {
          ruleId: null
        }
      },
      {
        kind: "SPE",
        skind: "SPE",
        skind2: "",
        drawMode: "point",
        geom: "\u70B9",
        label: {
          "zh-CN": "\u7279\u6B8A"
        },
        workflow: {
          visible: true
        },
        display: {
          ruleId: null
        }
      }
    ]
  },
  fields: [
    {
      key: "ID",
      label: {
        "zh-CN": "\u4EA4\u6613\u70B9ID"
      },
      type: "text",
      required: true,
      optional: false,
      sourceRuntimeField: "ID",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: true
      }
    },
    {
      key: "Name",
      label: {
        "zh-CN": "\u4EA4\u6613\u70B9\u540D"
      },
      type: "text",
      required: true,
      optional: false,
      sourceRuntimeField: "Name",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: true
      }
    },
    {
      key: "Kind",
      label: {
        "zh-CN": "\u7C7B\u578B(Kind)"
      },
      type: "text",
      required: true,
      optional: false,
      sourceRuntimeField: "Kind",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "SKind",
      label: {
        "zh-CN": "\u5B50\u7C7B\u578B(SKind)"
      },
      type: "text",
      required: false,
      optional: true,
      sourceRuntimeField: "SKind",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "SKind2",
      label: {
        "zh-CN": "\u4E09\u7EA7\u5B50\u7C7B\u578B(SKind2)"
      },
      type: "text",
      required: false,
      optional: true,
      sourceRuntimeField: "SKind2",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "Interaction",
      label: {
        "zh-CN": "\u4EA4\u4E92\u6A21\u5F0F(Interaction)"
      },
      type: "text",
      required: false,
      optional: true,
      sourceRuntimeField: "Interaction",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "Situation",
      label: {
        "zh-CN": "\u542F\u7528\u72B6\u51B5(Situation)"
      },
      type: "text",
      required: false,
      optional: true,
      sourceRuntimeField: "Situation",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "TradeJSON",
      label: {
        "zh-CN": "\u4EA4\u6613\u5217\u8868(Trade) JSON"
      },
      type: "text",
      required: false,
      optional: true,
      sourceRuntimeField: "TradeJSON",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "elevation",
      label: {
        "zh-CN": "\u9AD8\u5EA6(y)"
      },
      type: "number",
      required: false,
      optional: true,
      sourceRuntimeField: "elevation",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    }
  ],
  groups: [
    {
      key: "tags",
      label: {
        "zh-CN": "tags\uFF08\u53EF\u9009\uFF1A\u7528\u4E8E\u7B5B\u9009/\u6E32\u67D3\u5DEE\u5206\uFF09"
      },
      type: "array",
      optional: true,
      minItems: 0,
      addButtonText: "\u6DFB\u52A0 tag",
      fields: [
        {
          key: "tagKey",
          label: {
            "zh-CN": "\u5B57\u6BB5\u540D"
          },
          type: "select",
          required: true,
          optional: false,
          sourceRuntimeField: "tagKey",
          scenes: {
            workflow: true,
            editor: true,
            infocard: true,
            search: false
          }
        },
        {
          key: "tagKeyOther",
          label: {
            "zh-CN": "\u5176\u4ED6\u5B57\u6BB5\u540D\uFF08\u5F53\u5B57\u6BB5\u540D=\u5176\u4ED6\u65F6\u586B\u5199\uFF09"
          },
          type: "text",
          required: false,
          optional: true,
          sourceRuntimeField: "tagKeyOther",
          scenes: {
            workflow: true,
            editor: true,
            infocard: true,
            search: false
          }
        },
        {
          key: "tagValue",
          label: {
            "zh-CN": "\u503C"
          },
          type: "text",
          required: true,
          optional: false,
          sourceRuntimeField: "tagValue",
          scenes: {
            workflow: true,
            editor: true,
            infocard: true,
            search: false
          }
        }
      ]
    },
    {
      key: "extensions",
      label: {
        "zh-CN": "extensions\uFF08\u53EF\u9009\uFF1A\u4EC5\u8BB0\u5F55\u4FE1\u606F\uFF0C\u4E0D\u53C2\u4E0E\u89C4\u5219\uFF09"
      },
      type: "array",
      optional: true,
      minItems: 0,
      addButtonText: "\u6DFB\u52A0\u6269\u5C55",
      fields: [
        {
          key: "extGroup",
          label: {
            "zh-CN": "\u7EC4/\u547D\u540D\u7A7A\u95F4(extGroup)"
          },
          type: "text",
          required: true,
          optional: false,
          sourceRuntimeField: "extGroup",
          scenes: {
            workflow: true,
            editor: true,
            infocard: true,
            search: false
          }
        },
        {
          key: "extKey",
          label: {
            "zh-CN": "\u5B57\u6BB5\u540D(extKey)"
          },
          type: "text",
          required: true,
          optional: false,
          sourceRuntimeField: "extKey",
          scenes: {
            workflow: true,
            editor: true,
            infocard: true,
            search: false
          }
        },
        {
          key: "extType",
          label: {
            "zh-CN": "\u503C\u7C7B\u578B"
          },
          type: "select",
          required: true,
          optional: false,
          defaultValue: "EXT_VALUE_TYPE_TEXT",
          sourceRuntimeField: "extType",
          scenes: {
            workflow: true,
            editor: true,
            infocard: true,
            search: false
          }
        },
        {
          key: "extValue",
          label: {
            "zh-CN": "\u503C(extValue)"
          },
          type: "text",
          required: true,
          optional: false,
          sourceRuntimeField: "extValue",
          scenes: {
            workflow: true,
            editor: true,
            infocard: true,
            search: false
          }
        }
      ]
    }
  ],
  tags: {
    enabled: true,
    allowOther: true,
    items: [
      {
        key: "category",
        label: {
          "zh-CN": "\u5206\u7C7B(category)"
        },
        type: "text"
      },
      {
        key: "level",
        label: {
          "zh-CN": "\u7B49\u7EA7(level)"
        },
        type: "number"
      },
      {
        key: "status",
        label: {
          "zh-CN": "\u72B6\u6001(status)"
        },
        type: "text"
      },
      {
        key: "source",
        label: {
          "zh-CN": "\u6765\u6E90(source)"
        },
        type: "text"
      }
    ]
  },
  extensions: {
    enabled: true,
    allowOtherNamespaces: true,
    namespaces: []
  },
  display: {
    runtimeStatus: "active",
    sourceRuntimeFile: "src/components/Rules/rendering/featureRenderRules.ts",
    rules: [
      {
        id: "TRP-trade-point",
        runtimeStatus: "active",
        match: {
          classCode: "TRP"
        },
        profile: "poiPoint",
        displayTier: "poi",
        geometry: {
          render: "none"
        },
        label: {
          enabled: true,
          source: "Name",
          styleKey: "bubble-dark-label-14"
        },
        specialLogic: [
          {
            key: "tradePointCardBinding",
            mode: "optional"
          }
        ],
        notes: "Config rule metadata. Rendering behavior is executed by featureRenderRules.ts."
      }
    ]
  },
  card: {
    runtimeStatus: "active",
    layoutId: "trade-point-card",
    sections: [
      {
        id: "main",
        title: "\u4E3B\u8981\u4FE1\u606F",
        slot: "mainRows"
      },
      {
        id: "other",
        title: "\u5176\u4ED6\u4FE1\u606F",
        slot: "otherRows",
        collapsedByDefault: true
      }
    ],
    fields: [],
    relations: [],
    enhancements: [
      {
        key: "tradePointCard",
        componentKey: "trpTradeSection",
        dataPath: "TradeJSON",
        runtimeStatus: "active"
      }
    ]
  },
  workflowBindings: [
    {
      workflowId: "trade-point-workflow",
      default: true,
      runtimeStatus: "active",
      runtimeMode: "specialComponentPrimary"
    }
  ]
};

// node_modules/.cache/cairnmap-legacy-v1/project-config/presets/warp/classes/WRP.json
var WRP_default = {
  schemaVersion: "cairnmap.class.v1",
  projectId: "openriamap-ria",
  runtimeStatus: "active",
  classCode: "WRP",
  classKey: "warpPoint",
  sourceFeatureKey: "Warp\u70B9",
  label: {
    "zh-CN": "Warp\u70B9",
    en: "Warp Point"
  },
  description: "Warp\u70B9 class config-primary config. Runtime facade now resolves from preset Class config.",
  data: {
    typeField: "Type",
    classField: "Class",
    worldField: "World",
    defaultType: "Points",
    defaultClass: "WRP"
  },
  geometry: {
    type: "Point",
    sourceField: "coordinate",
    axisOrder: "x,y,z",
    required: true
  },
  identity: {
    idField: "ID",
    nameField: "Name",
    displayNameField: "Name"
  },
  classification: {
    kindField: "Kind",
    skindField: "SKind",
    skind2Field: "SKind2",
    required: false,
    options: [
      {
        kind: "NOM",
        skind: "NOM",
        skind2: "",
        drawMode: "point",
        geom: "\u70B9",
        label: {
          "zh-CN": "\u9ED8\u8BA4"
        },
        workflow: {
          visible: true
        },
        display: {
          ruleId: null
        }
      },
      {
        kind: "SPE",
        skind: "SPE",
        skind2: "",
        drawMode: "point",
        geom: "\u70B9",
        label: {
          "zh-CN": "\u7279\u6B8A"
        },
        workflow: {
          visible: true
        },
        display: {
          ruleId: null
        }
      }
    ]
  },
  fields: [
    {
      key: "ID",
      label: {
        "zh-CN": "Warp\u70B9ID"
      },
      type: "text",
      required: true,
      optional: false,
      sourceRuntimeField: "ID",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: true
      }
    },
    {
      key: "WRPointI2D",
      label: {
        "zh-CN": "Warp\u70B9\u6E38\u620F\u5185ID(WRPointI2D)"
      },
      type: "text",
      required: true,
      optional: false,
      sourceRuntimeField: "WRPointI2D",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "Name",
      label: {
        "zh-CN": "Warp\u70B9\u540D"
      },
      type: "text",
      required: true,
      optional: false,
      sourceRuntimeField: "Name",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: true
      }
    },
    {
      key: "Kind",
      label: {
        "zh-CN": "\u7C7B\u578B(Kind)"
      },
      type: "text",
      required: true,
      optional: false,
      sourceRuntimeField: "Kind",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "SKind",
      label: {
        "zh-CN": "\u5B50\u7C7B\u578B(SKind)"
      },
      type: "text",
      required: false,
      optional: true,
      sourceRuntimeField: "SKind",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "SKind2",
      label: {
        "zh-CN": "\u4E09\u7EA7\u5B50\u7C7B\u578B(SKind2)"
      },
      type: "text",
      required: false,
      optional: true,
      sourceRuntimeField: "SKind2",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "hub",
      label: {
        "zh-CN": "\u67A2\u7EBD(hub)"
      },
      type: "text",
      required: false,
      optional: true,
      sourceRuntimeField: "hub",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    },
    {
      key: "elevation",
      label: {
        "zh-CN": "\u9AD8\u5EA6(y)"
      },
      type: "number",
      required: false,
      optional: true,
      sourceRuntimeField: "elevation",
      scenes: {
        workflow: true,
        editor: true,
        infocard: true,
        search: false
      }
    }
  ],
  groups: [],
  tags: {
    enabled: true,
    allowOther: true,
    items: [
      {
        key: "category",
        label: {
          "zh-CN": "\u5206\u7C7B(category)"
        },
        type: "text"
      },
      {
        key: "level",
        label: {
          "zh-CN": "\u7B49\u7EA7(level)"
        },
        type: "number"
      },
      {
        key: "status",
        label: {
          "zh-CN": "\u72B6\u6001(status)"
        },
        type: "text"
      },
      {
        key: "source",
        label: {
          "zh-CN": "\u6765\u6E90(source)"
        },
        type: "text"
      }
    ]
  },
  extensions: {
    enabled: true,
    allowOtherNamespaces: true,
    namespaces: []
  },
  display: {
    runtimeStatus: "active",
    sourceRuntimeFile: "src/components/Rules/rendering/featureRenderRules.ts",
    rules: [
      {
        id: "WRP-warp-point",
        runtimeStatus: "active",
        match: {
          classCode: "WRP"
        },
        profile: "poiPoint",
        displayTier: "poi",
        geometry: {
          render: "none"
        },
        label: {
          enabled: true,
          source: "Name",
          styleKey: "bubble-dark-label-14"
        },
        specialLogic: [
          {
            key: "warpPointBinding",
            mode: "optional"
          }
        ],
        notes: "Config rule metadata. Rendering behavior is executed by featureRenderRules.ts."
      }
    ]
  },
  card: {
    runtimeStatus: "active",
    layoutId: "warp-point-card",
    sections: [
      {
        id: "main",
        title: "\u4E3B\u8981\u4FE1\u606F",
        slot: "mainRows"
      },
      {
        id: "other",
        title: "\u5176\u4ED6\u4FE1\u606F",
        slot: "otherRows",
        collapsedByDefault: true
      }
    ],
    fields: [],
    relations: [],
    enhancements: []
  },
  workflowBindings: [
    {
      workflowId: "warp-workflow",
      default: true,
      runtimeStatus: "active",
      runtimeMode: "configPrimary"
    }
  ]
};

// node_modules/.cache/cairnmap-legacy-v1/src/core/project/openriamapRiaClasses.ts
var OPENRIAMAP_RIA_CLASS_CONFIGS = [
  BUD_default,
  FLR_default,
  ISG_default,
  ISL_default,
  ISP_default,
  PFB_default,
  PLF_default,
  RLE_default,
  ROD_default,
  SBP_default,
  STA_default,
  STB_default,
  STF_default,
  TPP_default,
  TRP_default,
  WRP_default
];
function getOpenRIAMapClassConfigs() {
  return OPENRIAMAP_RIA_CLASS_CONFIGS;
}

// node_modules/.cache/cairnmap-legacy-v1/src/core/geometry/multipartGeometry.ts
var DEFAULT_GEOMETRY_Y = -64;
var isObject = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);
var numberOrNull = (value) => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
};
function canonicalGeometryField(type) {
  if (type === "Point") return "CoordP";
  if (type === "LineString") return "CoordL";
  return "CoordG";
}
function geometryTypeFromFeatureType(value) {
  const type = String(value ?? "").trim();
  if (type === "Points") return "Point";
  if (type === "Polyline") return "LineString";
  if (type === "Polygon") return "Polygon";
  return null;
}
function tupleToCoord(value) {
  if (!Array.isArray(value) || value.length !== 3) return null;
  const x = numberOrNull(value[0]);
  const y = numberOrNull(value[1]);
  const z = numberOrNull(value[2]);
  return x === null || y === null || z === null ? null : { x, y, z };
}
function legacyTupleToCoord(value) {
  if (Array.isArray(value)) {
    const x2 = numberOrNull(value[0]);
    const y2 = value.length >= 3 ? numberOrNull(value[1]) : DEFAULT_GEOMETRY_Y;
    const z2 = value.length >= 3 ? numberOrNull(value[2]) : numberOrNull(value[1]);
    return x2 === null || y2 === null || z2 === null ? null : { x: x2, y: y2, z: z2 };
  }
  if (!isObject(value)) return null;
  const x = numberOrNull(value.x);
  const z = numberOrNull(value.z);
  const y = numberOrNull(value.y);
  return x === null || z === null ? null : { x, y: y ?? DEFAULT_GEOMETRY_Y, z };
}
function coordinatesEqual(a, b) {
  return a.x === b.x && a.y === b.y && a.z === b.z;
}
function removeClosingCoordinate(ring) {
  if (ring.length >= 2 && coordinatesEqual(ring[0], ring[ring.length - 1])) return ring.slice(0, -1);
  return ring;
}
function normalizeRingCoordinates(ring) {
  const withoutConsecutiveDuplicates = ring.filter((coordinate, index) => index === 0 || !coordinatesEqual(ring[index - 1], coordinate));
  return removeClosingCoordinate(withoutConsecutiveDuplicates);
}
function parseCanonical(value, type) {
  if (!Array.isArray(value)) return null;
  if (type === "Point") {
    const parts2 = value.map(tupleToCoord);
    return parts2.every(Boolean) ? { type, parts: parts2 } : null;
  }
  if (type === "LineString") {
    const parts2 = value.map((part) => Array.isArray(part) ? part.map(tupleToCoord) : null);
    return parts2.every((part) => Array.isArray(part) && part.every(Boolean)) ? { type, parts: parts2 } : null;
  }
  const parts = value.map((part) => Array.isArray(part) ? part.map((ring) => Array.isArray(ring) ? normalizeRingCoordinates(ring.map(tupleToCoord).filter((coord) => Boolean(coord))) : null) : null);
  if (!parts.every((part) => Array.isArray(part) && part.length > 0 && part.every((ring) => Array.isArray(ring)))) return null;
  for (const component of value) {
    if (!Array.isArray(component)) return null;
    for (const ring of component) {
      if (!Array.isArray(ring) || ring.some((tuple) => !tupleToCoord(tuple))) return null;
    }
  }
  return { type, parts };
}
function parseLegacy(value, type) {
  if (type === "Point") {
    const coord = legacyTupleToCoord(value);
    return coord ? { type, parts: [coord] } : null;
  }
  if (!Array.isArray(value)) return null;
  const path = value.map(legacyTupleToCoord);
  if (!path.every(Boolean)) return null;
  if (type === "LineString") return { type, parts: [path] };
  return { type, parts: [[normalizeRingCoordinates(path)]] };
}
function stableGeometry(geometry) {
  return JSON.stringify(serializeMultipartGeometry(geometry));
}
function readMultipartGeometry(featureInfo, type, legacySourceField) {
  const info = isObject(featureInfo) ? featureInfo : {};
  const canonicalField = canonicalGeometryField(type);
  const hasCanonical = Object.prototype.hasOwnProperty.call(info, canonicalField);
  const canonical = hasCanonical ? parseCanonical(info[canonicalField], type) : null;
  if (hasCanonical && !canonical) return { geometry: null, source: "canonical", error: `${canonicalField} \u683C\u5F0F\u65E0\u6548` };
  const legacyCandidates = Array.from(new Set([
    legacySourceField,
    type === "Point" ? "coordinate" : void 0,
    type === "LineString" ? "PLpoints" : void 0,
    type === "LineString" ? "Linepoints" : void 0,
    type === "Polygon" ? "Conpoints" : void 0,
    type === "Polygon" ? "Flrpoints" : void 0
  ].filter((field) => Boolean(field))));
  const legacyEntries = legacyCandidates.filter((field) => Object.prototype.hasOwnProperty.call(info, field));
  const parsedLegacy = legacyEntries.map((field) => ({ field, geometry: parseLegacy(info[field], type) }));
  const invalidLegacy = parsedLegacy.find((entry) => !entry.geometry);
  if (invalidLegacy) return { geometry: null, source: "legacy", error: `${invalidLegacy.field} \u683C\u5F0F\u65E0\u6548` };
  const legacy = parsedLegacy[0]?.geometry ?? null;
  if (legacy && parsedLegacy.some((entry) => stableGeometry(entry.geometry) !== stableGeometry(legacy))) {
    return { geometry: null, source: "legacy", error: "geometry-field-conflict" };
  }
  if (canonical && legacy && stableGeometry(canonical) !== stableGeometry(legacy)) {
    return { geometry: null, source: "canonical", error: "geometry-field-conflict" };
  }
  if (canonical) return { geometry: canonical, source: "canonical" };
  if (legacy) return { geometry: legacy, source: "legacy" };
  return { geometry: null, source: "none" };
}
function serializeMultipartGeometry(geometry) {
  const tuple = (coord) => [coord.x, coord.y, coord.z];
  if (geometry.type === "Point") return geometry.parts.map(tuple);
  if (geometry.type === "LineString") return geometry.parts.map((part) => part.map(tuple));
  return geometry.parts.map((part) => part.map((ring) => normalizeRingCoordinates(ring).map(tuple)));
}

// node_modules/.cache/cairnmap-legacy-v1/src/legacyFilter.ts
var legacyDataDiagnostics = { unknown: 0, malformed: 0 };
function filterLegacyDataset(dataset) {
  return { ...dataset, features: dataset.features.filter((record) => {
    const definition = getOpenRIAMapClassConfigs().find((item) => item.classCode === record.Class);
    if (!definition) {
      legacyDataDiagnostics.unknown++;
      return false;
    }
    const options = definition.classification?.options ?? [];
    const actual = [record.Kind, record.SKind ?? record.Skind, record.SKind2 ?? record.Skind2].map((value) => String(value ?? ""));
    if (record.Class === "ROD" && actual[1] === "NOM" && (!actual[2] || actual[2] === "NOM") && !options.some((option2) => option2.kind === actual[0] && option2.skind === actual[1] && String(option2.skind2 ?? "") === actual[2])) {
      actual[1] = "";
      actual[2] = "";
    }
    const option = options.find((option2) => [option2.kind, option2.skind, option2.skind2].every((value, index) => String(value ?? "") === actual[index]));
    if (!option && (actual.some(Boolean) || definition.classification?.required)) {
      legacyDataDiagnostics.unknown++;
      return false;
    }
    const expected = option?.drawMode === "point" ? "Point" : option?.drawMode === "polyline" ? "LineString" : option?.drawMode === "polygon" ? "Polygon" : definition.geometry.type;
    if (geometryTypeFromFeatureType(record.Type) !== expected) {
      legacyDataDiagnostics.unknown++;
      return false;
    }
    try {
      const geometry = readMultipartGeometry(record, expected, definition.geometry.sourceField);
      if (!geometry.geometry || geometry.error) {
        legacyDataDiagnostics.malformed++;
        return false;
      }
    } catch {
      legacyDataDiagnostics.malformed++;
      return false;
    }
    return true;
  }) };
}
export {
  filterLegacyDataset,
  legacyDataDiagnostics
};
