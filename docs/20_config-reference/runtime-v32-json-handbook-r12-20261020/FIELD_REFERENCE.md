# r12 完整字段对照表

本表由当前 TypeScript 契约逐字段生成；结构编号仅用于阅读跳转。结构必填与语义核验均需通过。完整文件为 [current-full.config.json](current-full.config.json)，示例行号仅对应其原始字节。

<a id="t0"></a>

## t0 · ConfigPackageV3

首次入口：`$`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `schemaVersion` | `"cairnmap.config-package.v3"` | 必填 | 文件结构标记；固定字符串用于识别整包、应用设置或对齐报告。 | `/schemaVersion`；第 109512 行 |
| `contractRevision` | `3` / `4` / `5` / `6` / `7` / `8` / `9` / `10` / `11` / `12` | 必填 | 配置契约版本；控制结构兼容和迁移，当前为 11，不能用它冒充保存版本。 | `/contractRevision`；第 600 行 |
| `packageId` | string | 必填 | 整包稳定身份；本地历史与导入使用此标识区分配置包。 | `/packageId`；第 108488 行 |
| `projectId` | string | 必填 | 所属项目的稳定标识。 | `/projectId`；第 108779 行 |
| `revision` | number | 必填 | 同一配置包的保存修订号；当前为 7，保存新版本须满足递增要求。 | `/revision`；第 109511 行 |
| `displayName` | [LocalizedText (t1)](#t1) | 必填 | 整包显示名是 zh/en 对象；搜索延伸区域的同名键是显示胶囊名称的布尔值，须按对象判读。 | `/displayName`；第 601 行 |
| `sourceManifestSha256` | string | 可选 | 原始迁移来源清单的 SHA-256 摘要；不是整包当前内容的散列。 | 该分支在此候选中未使用 |
| `engine` | [ConfigEngineSettings (t2)](#t2) | 可选 | 全局引擎默认设置，供分类渲染与交互解析。 | `/engine`；第 605 行 |
| `registries` | [ConfigRegistries (t40)](#t40) | 必填 | 可用布局、组件与受控能力的登记清单；登记不等于任意代码可执行。 | `/registries`；第 108780 行 |
| `lookupTables` | 数组<[LookupTable (t45)](#t45)> | 可选 | 公共对照表数组；字段、信息卡和工作流可按表格 ID 引用。 | `/lookupTables`；第 817 行 |
| `application` | [ApplicationSettings (t51)](#t51) | 可选 | 总体规则：世界、来源组、图层按钮、模块、审核及偏好。 | `/application`；第 2 行 |
| `resources` | [$.resources (t85)](#t85) | 可选 | 版本化静态资源能力声明，不是数据源地址。 | `/resources`；第 109502 行 |
| `nodes` | 数组<[CategoryNode (t87)](#t87)> | 必填 | 分类节点数组；通过 path 和 children 表达分类树，而非把节点嵌套存储。 | `/nodes`；第 1110 行 |
| `contextBindings` | 数组<[ContextBinding (t172)](#t172)> | 可选 | 旧式指定双方分类的上下文绑定；当前默认空数组，现用 fieldSettings.structure。 | `/contextBindings`；第 599 行 |
| `workflows` | 数组<[WorkflowDefinition (t174)](#t174)> | 必填 | 工作流定义数组；包含组合式采集、外部方案和专供编辑方案。 | `/workflows`；第 109513 行 |
| `parity` | [ParityReport (t198)](#t198) | 可选 | 与 V1 来源的迁移对齐凭证；不是地图数据或实际渲染规则。 | `/parity`；第 108489 行 |

<a id="t1"></a>

## t1 · LocalizedText

首次入口：`$.displayName`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `zh` | string | 必填 | 中文名称或说明；不能把实际存储值改写为此显示文本。 | `/displayName/zh`；第 603 行 |
| `en` | string | 必填 | 英文名称或说明；空字符串在当前配置中很常见，具体显示依使用方回退。 | `/displayName/en`；第 602 行 |

<a id="t2"></a>

## t2 · ConfigEngineSettings

首次入口：`$.engine`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `world` | [$.engine.world (t3)](#t3) | 必填 | 引擎的 World 写入约定，或功能行内的目标世界 ID。 | `/engine/world`；第 811 行 |
| `contextView` | [$.engine.contextView (t4)](#t4) | 必填 | 主附属结构视角的全局激活门槛与距离。 | `/engine/contextView`；第 606 行 |
| `screenGateDefaults` | [$.engine.screenGateDefaults (t5)](#t5) | 必填 | 屏幕尺度门槛默认值；规则可继承或明确覆盖。 | `/engine/screenGateDefaults`；第 807 行 |
| `interactionBaselines` | [$.engine.interactionBaselines (t6)](#t6) | 必填 | 点、线、面的全局交互外观基线。 | `/engine/interactionBaselines`；第 611 行 |
| `paneDefaults` | [Record (t18)](#t18) | 必填 | 语义图层名称到实际绘制 pane 的默认映射。 | `/engine/paneDefaults`；第 801 行 |
| `renderDefaults` | [Partial (t19)](#t19) | 可选 | 按几何类型设置的渲染扩展默认值；规则局部值再覆盖。 | 该分支在此候选中未使用 |

<a id="t3"></a>

## t3 · $.engine.world

首次入口：`$.engine.world`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `field` | `"World"` | 必填 | 所引用的数据字段路径；不同位置的可用字段集由对应分类限定。 | `/engine/world/field`；第 813 行 |
| `assignment` | `"activeWorld"` | 必填 | 系统世界字段的赋值方式；activeWorld 表示当前活动世界。 | `/engine/world/assignment`；第 812 行 |
| `required` | `true` | 必填 | 是否必填；系统 World 设置中固定为 true，其他位置按控件或字段解释。 | `/engine/world/required`；第 814 行 |

<a id="t4"></a>

## t4 · $.engine.contextView

首次入口：`$.engine.contextView`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `minZoom` | number | 必填 | 最小缩放边界；渲染原生规则为含端点，优先读取 when.zoom。 | `/engine/contextView/minZoom`；第 608 行 |
| `activationRadiusPx` | number | 必填 | 激活主结构上下文的屏幕距离，单位像素。 | `/engine/contextView/activationRadiusPx`；第 607 行 |
| `retainRadiusPx` | number | 必填 | 已激活主结构上下文的保留距离，单位像素。 | `/engine/contextView/retainRadiusPx`；第 609 行 |

<a id="t5"></a>

## t5 · $.engine.screenGateDefaults

首次入口：`$.engine.screenGateDefaults`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `polygonMinScreenAreaPx` | number | 可选 | 面要素投影到屏幕后的最小面积，单位 px²。 | `/engine/screenGateDefaults/polygonMinScreenAreaPx`；第 809 行 |
| `lineMinScreenLengthPx` | number | 可选 | 线要素投影到屏幕后的最小长度，单位 px。 | `/engine/screenGateDefaults/lineMinScreenLengthPx`；第 808 行 |

<a id="t6"></a>

## t6 · $.engine.interactionBaselines

首次入口：`$.engine.interactionBaselines`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `Point` | [GeometryInteractionBaseline (t7)](#t7) | 必填 | 点几何配置键；与 LineString、Polygon 区分。 | `/engine/interactionBaselines/Point`；第 670 行 |
| `LineString` | [GeometryInteractionBaseline (t7)](#t7) | 必填 | 线几何配置键；最终记录可具有多个线部件。 | `/engine/interactionBaselines/LineString`；第 612 行 |
| `Polygon` | [GeometryInteractionBaseline (t7)](#t7) | 必填 | 面几何配置键；外部件与部件内孔环是两个层级。 | `/engine/interactionBaselines/Polygon`；第 742 行 |

<a id="t7"></a>

## t7 · GeometryInteractionBaseline

首次入口：`$.engine.interactionBaselines.Point`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `hover` | [InteractionVisual (t8)](#t8) | 必填 | 鼠标悬停状态的交互外观。 | `/engine/interactionBaselines/LineString/hover`；第 636 行 |
| `selected` | [InteractionVisual (t8)](#t8) | 必填 | 选中状态的外观；在工作流 geometry 中则表示固定几何类型。 | `/engine/interactionBaselines/LineString/selected`；第 658 行 |
| `searchResult` | [InteractionVisual (t8)](#t8) | 必填 | 搜索命中状态的交互外观。 | `/engine/interactionBaselines/LineString/searchResult`；第 647 行 |
| `editing` | [InteractionVisual (t8)](#t8) | 必填 | 编辑状态的交互外观。 | `/engine/interactionBaselines/LineString/editing`；第 624 行 |
| `deletionMarked` | [InteractionVisual (t8)](#t8) | 必填 | 标记删除状态的交互外观。 | `/engine/interactionBaselines/LineString/deletionMarked`；第 613 行 |
| `hitTolerancePx` | number | 必填 | 点击/命中的屏幕容差，单位像素。 | `/engine/interactionBaselines/LineString/hitTolerancePx`；第 635 行 |

<a id="t8"></a>

## t8 · InteractionVisual

首次入口：`$.engine.interactionBaselines.Point.hover`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `enabled` | boolean | 必填 | 启用标记；false 不等于删除定义，具体作用范围取决于所在模块。 | `/engine/interactionBaselines/LineString/deletionMarked/enabled`；第 614 行 |
| `strokeColor` | string | 必填 | 交互覆盖的描边固定颜色。 | `/engine/interactionBaselines/LineString/deletionMarked/strokeColor`；第 619 行 |
| `strokeWidth` | number | 必填 | 交互描边宽度，单位像素。 | `/engine/interactionBaselines/LineString/deletionMarked/strokeWidth`；第 621 行 |
| `strokeOpacity` | number | 必填 | 描边不透明度，0 为透明，1 为不透明。 | `/engine/interactionBaselines/LineString/deletionMarked/strokeOpacity`；第 620 行 |
| `fillColor` | string | 可选 | 交互覆盖的固定填充色。 | `/engine/interactionBaselines/LineString/deletionMarked/fillColor`；第 615 行 |
| `fillOpacity` | number | 可选 | 填充不透明度，0 为透明，1 为不透明。 | `/engine/interactionBaselines/LineString/deletionMarked/fillOpacity`；第 616 行 |
| `zIndexOffset` | number | 可选 | 在基础图层顺序上叠加的偏移量；不等于 Label 碰撞优先级。 | `/engine/interactionBaselines/LineString/deletionMarked/zIndexOffset`；第 622 行 |
| `forceShowLabel` | `false` / `true` | 可选 | 此交互状态请求保留标签，不修改标签文字来源。 | `/engine/interactionBaselines/LineString/deletionMarked/forceShowLabel`；第 617 行 |
| `labelPriority` | number | 可选 | 交互状态给 Label 的碰撞优先分数。 | `/engine/interactionBaselines/LineString/deletionMarked/labelPriority`；第 618 行 |
| `symbol` | [$.engine.interactionBaselines.Point.hover.symbol (t9)](#t9) | 可选 | 交互点标记配置；并非源几何坐标。 | `/engine/interactionBaselines/Point/searchResult/symbol`；第 714 行 |
| `outline` | [$.engine.interactionBaselines.Point.hover.outline (t10)](#t10) | 可选 | 交互覆盖的轮廓线描述。 | 该分支在此候选中未使用 |
| `dashArray` | string | 可选 | 旧版自定义虚线长度字符串。 | `/engine/interactionBaselines/LineString/searchResult/dashArray`；第 648 行 |
| `strokeColorBinding` | [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t11)](#t11) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t13)](#t13) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t14)](#t14) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t15)](#t15) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t17)](#t17) | 可选 | 交互描边颜色的取值方式，可按字段、关系或值对照求色。 | 该分支在此候选中未使用 |

<a id="t9"></a>

## t9 · $.engine.interactionBaselines.Point.hover.symbol

首次入口：`$.engine.interactionBaselines.Point.hover.symbol`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `kind` | `"circle"` / `"pin"` | 必填 | 分类路径第二级，或条件/控件的分支种类；依所在对象判读。 | `/engine/interactionBaselines/Point/searchResult/symbol/kind`；第 715 行 |
| `radius` | number | 可选 | 圆形符号半径。 | 该分支在此候选中未使用 |
| `size` | [number, number] | 可选 | 符号/文字尺寸或按钮尺寸；单位与数组结构见当前对象类型。 | `/engine/interactionBaselines/Point/searchResult/symbol/size`；第 716 行 |

<a id="t10"></a>

## t10 · $.engine.interactionBaselines.Point.hover.outline

首次入口：`$.engine.interactionBaselines.Point.hover.outline`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `color` | string | 必填 | 固定颜色文本；可用颜色语法仍须通过实际核验。 | `/nodes/66/geometryProfiles/LineString/zoomPriority/rules/0/extensions/interaction/searchResult/outline/color`；第 74220 行 |
| `width` | number | 必填 | 轮廓宽度或边界框宽度修正；具体由所在对象解释。 | `/nodes/66/geometryProfiles/LineString/zoomPriority/rules/0/extensions/interaction/searchResult/outline/width`；第 74222 行 |
| `opacity` | number | 必填 | 整体或局部不透明度；通常 0–1。 | `/nodes/66/geometryProfiles/LineString/zoomPriority/rules/0/extensions/interaction/searchResult/outline/opacity`；第 74221 行 |

<a id="t11"></a>

## t11 · $.engine.interactionBaselines.Point.hover.strokeColorBinding

首次入口：`$.engine.interactionBaselines.Point.hover.strokeColorBinding`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `mode` | `"valueMap"` | 必填 | 当前联合结构的分支选择器；先看 mode，再解释其余字段。 | 该分支在此候选中未使用 |
| `field` | string | 必填 | 所引用的数据字段路径；不同位置的可用字段集由对应分类限定。 | 该分支在此候选中未使用 |
| `entries` | 数组<[$.engine.interactionBaselines.Point.hover.strokeColorBinding.entries[] (t12)](#t12)> | 必填 | 按值设色的逐行条目，或迁移对齐报告中的逐项记录。 | 该分支在此候选中未使用 |
| `fallbackColor` | string | 必填 | 主颜色来源无效时使用的回退颜色。 | 该分支在此候选中未使用 |

<a id="t12"></a>

## t12 · $.engine.interactionBaselines.Point.hover.strokeColorBinding.entries[]

首次入口：`$.engine.interactionBaselines.Point.hover.strokeColorBinding.entries[]`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `value` | string / number / `false` / `true` | 必填 | 最终存储值、条件比较值或常量；是否字符串须看当前类型声明。 | 该分支在此候选中未使用 |
| `color` | string | 必填 | 固定颜色文本；可用颜色语法仍须通过实际核验。 | 该分支在此候选中未使用 |

<a id="t13"></a>

## t13 · $.engine.interactionBaselines.Point.hover.strokeColorBinding

首次入口：`$.engine.interactionBaselines.Point.hover.strokeColorBinding`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `mode` | `"fixed"` | 必填 | 当前联合结构的分支选择器；先看 mode，再解释其余字段。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/style/fill/mode`；第 1765 行 |
| `color` | string | 必填 | 固定颜色文本；可用颜色语法仍须通过实际核验。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/style/fill/color`；第 1764 行 |

<a id="t14"></a>

## t14 · $.engine.interactionBaselines.Point.hover.strokeColorBinding

首次入口：`$.engine.interactionBaselines.Point.hover.strokeColorBinding`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `mode` | `"field"` | 必填 | 当前联合结构的分支选择器；先看 mode，再解释其余字段。 | `/nodes/65/geometryProfiles/LineString/zoomPriority/rules/0/label/style/color/mode`；第 71488 行 |
| `field` | string | 必填 | 所引用的数据字段路径；不同位置的可用字段集由对应分类限定。 | `/nodes/65/geometryProfiles/LineString/zoomPriority/rules/0/label/style/color/field`；第 71487 行 |
| `fallbackColor` | string | 可选 | 主颜色来源无效时使用的回退颜色。 | `/nodes/65/geometryProfiles/LineString/zoomPriority/rules/0/label/style/color/fallbackColor`；第 71486 行 |

<a id="t15"></a>

## t15 · $.engine.interactionBaselines.Point.hover.strokeColorBinding

首次入口：`$.engine.interactionBaselines.Point.hover.strokeColorBinding`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `mode` | `"external"` | 必填 | 当前联合结构的分支选择器；先看 mode，再解释其余字段。 | 该分支在此候选中未使用 |
| `target` | [ClassificationPath (t16)](#t16) | 必填 | 目标分类范围，或输出赋值的目标字段路径；二者不能混用。 | 该分支在此候选中未使用 |
| `targetIdField` | string | 必填 | 本记录中保存外部目标 ID 的字段。 | 该分支在此候选中未使用 |
| `targetColorField` | string | 必填 | 外部目标记录中提供颜色的字段。 | 该分支在此候选中未使用 |
| `fallbackColor` | string | 可选 | 主颜色来源无效时使用的回退颜色。 | 该分支在此候选中未使用 |

<a id="t16"></a>

## t16 · ClassificationPath

首次入口：`$.engine.interactionBaselines.Point.hover.strokeColorBinding.target`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `class` | string | 必填 | 分类路径第一级 Class；此处键名小写，实际要素记录使用 Class。 | `/nodes/0/card/items/1/prefillAudit/source/path/class`；第 1141 行 |
| `kind` | string | 可选 | 分类路径第二级，或条件/控件的分支种类；依所在对象判读。 | `/nodes/1/path/kind`；第 3479 行 |
| `skind` | string | 可选 | 分类路径第三级；实际新要素记录使用 SKind。 | `/nodes/3/path/skind`；第 5608 行 |
| `skind2` | string | 可选 | 分类路径第四级；实际新要素记录使用 SKind2。 | `/nodes/18/path/skind2`；第 21552 行 |

<a id="t17"></a>

## t17 · $.engine.interactionBaselines.Point.hover.strokeColorBinding

首次入口：`$.engine.interactionBaselines.Point.hover.strokeColorBinding`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `mode` | `"relatedLine"` | 必填 | 当前联合结构的分支选择器；先看 mode，再解释其余字段。 | `/nodes/5/geometryProfiles/Polygon/zoomPriority/rules/1/style/fill/mode`；第 7594 行 |
| `strategy` | `"featureRelation"` / `"platformFirstLine"` / `"stationFirstPlatform"` | 必填 | 关系取色或几何锚点的解析策略。 | `/nodes/5/geometryProfiles/Polygon/zoomPriority/rules/1/style/fill/strategy`；第 7595 行 |
| `fallbackColor` | string | 可选 | 主颜色来源无效时使用的回退颜色。 | `/nodes/5/geometryProfiles/Polygon/zoomPriority/rules/1/style/fill/fallbackColor`；第 7593 行 |

<a id="t18"></a>

## t18 · Record

首次入口：`$.engine.paneDefaults`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `overlay` | string | 必填 | 普通覆盖图层的 pane 名。 | `/engine/paneDefaults/overlay`；第 802 行 |
| `overlay-top` | string | 必填 | 较高层覆盖图层的 pane 名。 | `/engine/paneDefaults/overlay-top`；第 803 行 |
| `point` | string | 必填 | 点图层的 pane 名、交互触发标记或单点返回值，依所在对象判读。 | `/engine/paneDefaults/point`；第 804 行 |
| `point-top` | string | 必填 | 较高层点图层的 pane 名。 | `/engine/paneDefaults/point-top`；第 805 行 |

<a id="t19"></a>

## t19 · Partial

首次入口：`$.engine.renderDefaults`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `Point` | [RenderRuleExtensions (t20)](#t20) | 可选 | 点几何配置键；与 LineString、Polygon 区分。 | 该分支在此候选中未使用 |
| `LineString` | [RenderRuleExtensions (t20)](#t20) | 可选 | 线几何配置键；最终记录可具有多个线部件。 | 该分支在此候选中未使用 |
| `Polygon` | [RenderRuleExtensions (t20)](#t20) | 可选 | 面几何配置键；外部件与部件内孔环是两个层级。 | 该分支在此候选中未使用 |

<a id="t20"></a>

## t20 · RenderRuleExtensions

首次入口：`$.engine.renderDefaults.Point`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `screenGate` | [RenderScreenGate (t21)](#t21) | 可选 | 当前规则的屏幕尺度门槛设置。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/screenGate`；第 1723 行 |
| `pane` | `"auto"` / `"overlay"` / `"overlay-top"` / `"point"` / `"point-top"` | 可选 | 绘制 pane；控制真实绘制层级，不能代替碰撞分数。 | `/nodes/5/geometryProfiles/Polygon/zoomPriority/rules/1/extensions/pane`；第 7531 行 |
| `hitTolerancePx` | number | 可选 | 点击/命中的屏幕容差，单位像素。 | 该分支在此候选中未使用 |
| `labelText` | [$.engine.renderDefaults.Point.labelText (t22)](#t22) | 可选 | 标签截断、多行、空文字和透明度处理。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/labelText`；第 1713 行 |
| `lineLabel` | [RenderLineLabelExtension (t23)](#t23) | 可选 | 沿线文字的候选、方向、曲线与回退设置。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel`；第 47404 行 |
| `anchor` | [RenderAnchorExtension (t24)](#t24) | 可选 | 多部件锚点模式，或规则内详细锚点设置；先看它是字符串还是对象。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/anchor`；第 1672 行 |
| `polygonCandidates` | [RenderPolygonCandidateExtension (t27)](#t27) | 可选 | 面要素标签候选的生成与筛选设置。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/polygonCandidates`；第 1719 行 |
| `collision` | [RenderCollisionExtension (t28)](#t28) | 可选 | Label 碰撞角色或详细碰撞扩展；不控制真实几何层级。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/collision`；第 1684 行 |
| `stability` | [RenderStabilityExtension (t30)](#t30) | 可选 | 标签候选缓存、失效和抗跳动设置。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/stability`；第 1726 行 |
| `density` | [RenderDensityExtension (t31)](#t31) | 可选 | 按屏幕网格控制标签/符号数量的策略。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/density`；第 1695 行 |
| `fallback` | [RenderFallbackExtension (t32)](#t32) | 可选 | 回退策略对象，或默认启用按钮 ID 列表，依所在模块解释。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/fallback`；第 1707 行 |
| `visibility` | [RenderVisibilityExtension (t33)](#t33) | 可选 | 关系可见性扩展，或附属结构显示策略。 | `/nodes/5/geometryProfiles/Polygon/zoomPriority/rules/1/extensions/visibility`；第 7550 行 |
| `interaction` | [Partial (t38)](#t38) | 可选 | 本几何的命中触发器，或规则内交互外观覆盖。 | `/nodes/66/geometryProfiles/LineString/zoomPriority/rules/0/extensions/interaction`；第 74216 行 |

<a id="t21"></a>

## t21 · RenderScreenGate

首次入口：`$.engine.renderDefaults.Point.screenGate`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `mode` | `"inherit"` / `"override"` | 必填 | 当前联合结构的分支选择器；先看 mode，再解释其余字段。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/screenGate/mode`；第 1724 行 |
| `minScreenAreaPx` | number | 可选 | 最小屏幕面积，单位 px²；在候选设置中只限制标签候选。 | 该分支在此候选中未使用 |
| `minScreenLengthPx` | number | 可选 | 最小屏幕线长，单位 px。 | 该分支在此候选中未使用 |

<a id="t22"></a>

## t22 · $.engine.renderDefaults.Point.labelText

首次入口：`$.engine.renderDefaults.Point.labelText`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `maxChars` | number | 可选 | 标签最多保留的字符数。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/labelText/maxChars`；第 1716 行 |
| `minChars` | number | 可选 | 标签缩写或截断时最少保留字符数。 | 该分支在此候选中未使用 |
| `multiline` | `false` / `true` | 可选 | 是否允许标签多行显示。 | 该分支在此候选中未使用 |
| `maxLines` | number | 可选 | 标签最多显示行数。 | 该分支在此候选中未使用 |
| `suffix` | string | 可选 | 截断后追加的字符，如省略号。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/labelText/suffix`；第 1717 行 |
| `abbreviationEnabled` | `false` / `true` | 可选 | 是否允许标签缩写处理。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/labelText/abbreviationEnabled`；第 1714 行 |
| `emptyBehavior` | `"hide"` / `"showID"` / `"showKind"` / `"placeholder"` | 可选 | 标签无有效文字时的处理分支。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/labelText/emptyBehavior`；第 1715 行 |
| `opacity` | number | 可选 | 整体或局部不透明度；通常 0–1。 | 该分支在此候选中未使用 |

<a id="t23"></a>

## t23 · RenderLineLabelExtension

首次入口：`$.engine.renderDefaults.Point.lineLabel`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `profile` | `"inherit"` / `"standard"` / `"network"` / `"strict-on-line"` | 必填 | 沿线文字预设或主附属上下文显示预设；由所在对象区分。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/profile`；第 47440 行 |
| `mode` | `"free"` / `"strictOnLine"` | 可选 | 当前联合结构的分支选择器；先看 mode，再解释其余字段。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/mode`；第 47437 行 |
| `endpointPaddingRatio` | number | 可选 | 沿线标签距离端点的比例留白。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/endpointPaddingRatio`；第 47433 行 |
| `endpointPaddingMinPx` | number | 可选 | 沿线标签距离端点的最小像素留白。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/endpointPaddingMinPx`；第 47432 行 |
| `maxTurnAngleDeg` | number | 可选 | 候选位置允许的最大转角，单位度。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/maxTurnAngleDeg`；第 47435 行 |
| `minLengthPx` | number | 可选 | 候选所需的最小屏幕长度，单位像素。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/minLengthPx`；第 47436 行 |
| `textMode` | `"auto"` / `"rotatedLabel"` / `"textPath"` | 可选 | 自动、旋转文字或沿 SVG 路径文字的选择。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/textMode`；第 47452 行 |
| `anchorSamples` | number | 可选 | 沿线锚点采样数量。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/anchorSamples`；第 47407 行 |
| `candidateSpacing` | number | 可选 | 沿线候选之间的间隔参数；由当前候选算法解释。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/candidateSpacing`；第 47415 行 |
| `candidateMinSpacing` | number | 可选 | 候选间隔的下限。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/candidateMinSpacing`；第 47413 行 |
| `candidateMax` | number | 可选 | 单次沿线候选数量上限。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/candidateMax`；第 47412 行 |
| `shortThresholdMultiplier` | number | 可选 | 判断短线文本适配的长度倍率。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/shortThresholdMultiplier`；第 47446 行 |
| `longMode` | `"evenSplit"` | 可选 | 长线候选分配方式，当前可选 evenSplit。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/longMode`；第 47434 行 |
| `preferPreviousCandidate` | `false` / `true` | 可选 | 优先复用上一次合法候选以减少跳动。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/preferPreviousCandidate`；第 47439 行 |
| `candidateHysteresisPx` | number | 可选 | 候选切换滞后距离，单位像素。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/candidateHysteresisPx`；第 47411 行 |
| `textPathMinLengthPx` | number | 可选 | 使用路径文字所需的最小屏幕长度。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/textPathMinLengthPx`；第 47464 行 |
| `textPathPaddingPx` | number | 可选 | 路径文字边缘留白，单位像素。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/textPathPaddingPx`；第 47465 行 |
| `textPathMaxAngleDeltaDeg` | number | 可选 | 路径相邻片段最大方向差，单位度。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/textPathMaxAngleDeltaDeg`；第 47460 行 |
| `textPathMaxTotalBendDeg` | number | 可选 | 文字覆盖路径允许的累计弯曲角度。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/textPathMaxTotalBendDeg`；第 47462 行 |
| `textPathPreferReadableDirection` | `false` / `true` | 可选 | 路径文字优先采用便于阅读的方向。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/textPathPreferReadableDirection`；第 47466 行 |
| `textPathFallback` | `"hide"` / `"rotatedLabel"` / `"svgStraightLabel"` | 可选 | 路径文字失败后的回退渲染方式。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/textPathFallback`；第 47456 行 |
| `textPathCollisionPaddingPx` | number | 可选 | 路径文字碰撞边界额外留白，单位像素。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/textPathCollisionPaddingPx`；第 47453 行 |
| `textPathLetterSpacingPx` | number | 可选 | 路径文字基础字间距，单位像素。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/textPathLetterSpacingPx`；第 47459 行 |
| `textPathCurvedLetterSpacingPx` | number | 可选 | 曲线路径文字使用的字间距，单位像素。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/textPathCurvedLetterSpacingPx`；第 47454 行 |
| `textPathCurvedSpacingMinBendDeg` | number | 可选 | 触发曲线字间距的最小弯曲角度。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/textPathCurvedSpacingMinBendDeg`；第 47455 行 |
| `orientationPolicy` | `"autoCjkUpright"` / `"alwaysTextPath"` / `"alwaysRotated"` / `"scriptAware"` | 可选 | 中日韩文字直立、始终路径文字或始终旋转的方向策略。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/orientationPolicy`；第 47438 行 |
| `textPathLengthMode` | `"fixed"` / `"actualText"` | 可选 | fixed 使用固定最小路径长度；actualText 使用实际文字宽度+每端留白。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/textPathLengthMode`；第 47458 行 |
| `textPathVerticalAngleThresholdDeg` | number | 可选 | 判断路径适合竖排的角度门槛。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/textPathVerticalAngleThresholdDeg`；第 47467 行 |
| `textPathVerticalLengthRatio` | number | 可选 | 竖排路径可用长度与文本长度的比例门槛。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/textPathVerticalLengthRatio`；第 47468 行 |
| `candidateOrdering` | `"startToEnd"` / `"centerOut"` | 可选 | 候选按起终点顺序或从中心向外排列。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/candidateOrdering`；第 47414 行 |
| `candidateWeightMode` | `"none"` / `"distanceToCenter"` | 可选 | 候选是否按距中心距离加权。 | 该分支在此候选中未使用 |
| `candidateSwitchThreshold` | number | 可选 | 改选沿线候选所需的优势门槛。 | 该分支在此候选中未使用 |
| `candidateReuseBonus` | number | 可选 | 旧沿线候选的复用评分加成。 | 该分支在此候选中未使用 |
| `candidateViewportPreference` | `false` / `true` | 可选 | 沿线候选评分是否偏好当前视窗。 | 该分支在此候选中未使用 |
| `candidateEdgePenalty` | number | 可选 | 沿线候选靠近视窗边缘的扣分。 | 该分支在此候选中未使用 |
| `centerWeightMode` | `"none"` / `"distanceToCenter"` | 可选 | 中心选择的加权方式。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/centerWeightMode`；第 47418 行 |
| `centerSwitchThreshold` | number | 可选 | 中心位置切换门槛。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/centerSwitchThreshold`；第 47417 行 |
| `centerReuseBonus` | number | 可选 | 旧中心位置复用加分。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/centerReuseBonus`；第 47416 行 |
| `cjkVerticalRenderMode` | `"auto"` / `"legacyVertical"` / `"svgVertical"` | 可选 | 中日韩竖排实现方式。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/cjkVerticalRenderMode`；第 47431 行 |
| `svgVerticalCjkMinLengthPx` | number | 可选 | SVG 中文竖排的最小屏幕长度。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/svgVerticalCjkMinLengthPx`；第 47450 行 |
| `svgVerticalCjkLetterSpacingPx` | number | 可选 | SVG 中文竖排字间距，单位像素。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/svgVerticalCjkLetterSpacingPx`；第 47449 行 |
| `advancedTextEnabled` | `false` / `true` | 可选 | 启用较复杂的沿线文字求解。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/advancedTextEnabled`；第 47406 行 |
| `advancedTextBudgetGroup` | `"network"` / `"none"` / `"surface"` | 可选 | 复杂文字求解所属的计算预算组。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/advancedTextBudgetGroup`；第 47405 行 |
| `advancedTextMaxLabels` | number | 可选 | 复杂文字求解允许处理的标签数量上限。 | 该分支在此候选中未使用 |
| `advancedTextMaxCandidatesPerPass` | number | 可选 | 一次复杂求解可处理的候选数量上限。 | 该分支在此候选中未使用 |
| `cjkGlyphRotationPolicy` | `"uprightWhenSteep"` / `"followLine"` / `"alwaysUpright"` | 可选 | 中文单字随线旋转或保持直立的策略。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/cjkGlyphRotationPolicy`；第 47428 行 |
| `cjkGlyphUprightAngleThresholdDeg` | number | 可选 | 中文单字保持直立的倾角门槛。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/cjkGlyphUprightAngleThresholdDeg`；第 47430 行 |
| `cjkGlyphPathMode` | `"auto"` / `"off"` / `"force"` | 可选 | 中文逐字沿线路径模式。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/cjkGlyphPathMode`；第 47427 行 |
| `cjkGlyphSpacingPx` | number | 可选 | 中文逐字路径字间距，单位像素。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/cjkGlyphSpacingPx`；第 47429 行 |
| `cjkGlyphCollisionPaddingPx` | number | 可选 | 中文逐字碰撞边界留白，单位像素。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/cjkGlyphCollisionPaddingPx`；第 47420 行 |
| `cjkGlyphMinPathLengthPx` | number | 可选 | 中文逐字模式的最小路径长度。 | 该分支在此候选中未使用 |
| `cjkGlyphMaxCount` | number | 可选 | 中文逐字模式的字数上限。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/cjkGlyphMaxCount`；第 47424 行 |
| `cjkGlyphMaxAngleDeltaDeg` | number | 可选 | 相邻中文单字路径方向差上限。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/cjkGlyphMaxAngleDeltaDeg`；第 47423 行 |
| `cjkGlyphMaxTotalBendDeg` | number | 可选 | 中文逐字路径累计弯曲角度上限。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/cjkGlyphMaxTotalBendDeg`；第 47425 行 |
| `cjkGlyphPreferReadableDirection` | `false` / `true` | 可选 | 中文逐字路径优先使用可读方向。 | 该分支在此候选中未使用 |
| `cjkGlyphAllowTextPathFallback` | `false` / `true` | 可选 | 中文逐字失败后是否允许回退普通路径文字。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/cjkGlyphAllowTextPathFallback`；第 47419 行 |
| `textPathHalfLengthMultiplier` | number | 可选 | 文字路径半长度的放大倍率。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/textPathHalfLengthMultiplier`；第 47457 行 |
| `textPathMinHalfLengthWorld` | number | 可选 | 文字路径半长度的世界坐标下限。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/textPathMinHalfLengthWorld`；第 47463 行 |
| `textPathMaxHalfLengthWorld` | number | 可选 | 文字路径半长度的世界坐标上限。 | 该分支在此候选中未使用 |
| `textPathMaxHalfLengthRatio` | number | 可选 | 半路径长度相对源路径长度的上限比例。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/textPathMaxHalfLengthRatio`；第 47461 行 |
| `textCollisionRectMode` | `"pathBox"` / `"textBox"` / `"compactTextBox"` | 可选 | 路径文字碰撞矩形的计算方式。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/textCollisionRectMode`；第 47451 行 |
| `cjkGlyphCompactMode` | `"auto"` / `"off"` | 可选 | 中文逐字碰撞紧凑模式。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/cjkGlyphCompactMode`；第 47421 行 |
| `cjkGlyphMinAdvanceScale` | number | 可选 | 中文逐字推进距离的最小缩放比例。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/cjkGlyphMinAdvanceScale`；第 47426 行 |
| `cjkGlyphFallbackMode` | `"hide"` / `"rotatedLabel"` / `"simpleLineLabel"` / `"textPathIfAllowed"` | 可选 | 中文逐字模式失败后的回退策略。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/cjkGlyphFallbackMode`；第 47422 行 |
| `simpleFallbackEnabled` | `false` / `true` | 可选 | 是否允许简化的沿线文字回退。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/simpleFallbackEnabled`；第 47447 行 |
| `simpleFallbackRotate` | `false` / `true` | 可选 | 简化回退文字是否随线旋转。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/simpleFallbackRotate`；第 47448 行 |
| `repositionMode` | `"off"` / `"chainageSearch"` | 可选 | 碰撞后是否沿线尝试重新定位。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/repositionMode`；第 47443 行 |
| `repositionAttemptsPerDirection` | number | 可选 | 沿线每个方向的重定位尝试次数。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/repositionAttemptsPerDirection`；第 47441 行 |
| `repositionStepMode` | `"labelSpan"` / `"fixedWorld"` / `"fixedPx"` | 可选 | 重定位步长按标签跨度、世界距离或屏幕像素计算。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/repositionStepMode`；第 47444 行 |
| `repositionFailure` | `"hide"` / `"simpleLineLabel"` | 可选 | 重定位全部失败后的处理。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/repositionFailure`；第 47442 行 |
| `repositionStrictSvg` | `false` / `true` | 可选 | 重定位时是否限定严格 SVG 路径方案。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/repositionStrictSvg`；第 47445 行 |
| `avoidLineGeometry` | `false` / `true` | 可选 | 重定位时是否避让线几何。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/avoidLineGeometry`；第 47408 行 |
| `avoidPolygonGeometry` | `false` / `true` | 可选 | 重定位时是否避让面几何。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/avoidPolygonGeometry`；第 47410 行 |
| `avoidPointSymbols` | `false` / `true` | 可选 | 重定位时是否避让点符号。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/avoidPointSymbols`；第 47409 行 |
| `repositionCollisionScope` | 数组<`"lineLabel"` / `"surfaceLabel"` / `"pointLabel"` / `"pointSymbol"` / `"requiredLabel"` / `"selectedLabel"` / `"searchResultLabel"`> | 可选 | 沿线重定位需要考虑的碰撞类别集合。 | 该分支在此候选中未使用 |
| `viewportRectMode` | `"auto"` / `"rawMetrics"` / `"anchorNormalized"` | 可选 | 用于视窗判断的文字边界矩形计算方式。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/viewportRectMode`；第 47473 行 |
| `viewportCandidateMode` | `"off"` / `"stableFirstViewportFallback"` | 可选 | 视窗局部候选的回退策略。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/viewportCandidateMode`；第 47472 行 |
| `viewportCandidateBufferPx` | number | 可选 | 视窗候选缓冲距离，单位像素。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/viewportCandidateBufferPx`；第 47469 行 |
| `viewportCandidateMaxTargets` | number | 可选 | 视窗回退候选的目标数量上限。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/viewportCandidateMaxTargets`；第 47470 行 |
| `viewportCandidateMinIntervalPx` | number | 可选 | 视窗候选的最小屏幕间隔。 | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/viewportCandidateMinIntervalPx`；第 47471 行 |

<a id="t24"></a>

## t24 · RenderAnchorExtension

首次入口：`$.engine.renderDefaults.Point.anchor`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `candidatePlacement` | `"relativeToPlacement"` / `"aroundAnchor"` | 可选 | 候选相对既有方向偏移，或围绕几何锚点分布。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/anchor/candidatePlacement`；第 1673 行 |
| `strategy` | `"inherit"` / `"featureCenter"` / `"interior"` / `"visibleInterior"` / `"lineCenter"` / `"lineCandidates"` | 可选 | 关系取色或几何锚点的解析策略。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/anchor/strategy`；第 1682 行 |
| `candidates` | 数组<`"C"` / `"N"` / `"S"` / `"E"` / `"W"` / `"NE"` / `"NW"` / `"SE"` / `"SW"`> | 可选 | 允许尝试的方位候选集合。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/anchor/candidates`；第 1674 行 |
| `offsetPx` | [$.engine.renderDefaults.Point.anchor.offsetPx (t25)](#t25) | 可选 | 屏幕像素偏移对象，含 x/y。 | 该分支在此候选中未使用 |
| `candidateOffsetsPx` | 数组<[$.engine.renderDefaults.Point.anchor.candidateOffsetsPx[] (t26)](#t26)> | 可选 | 可命名的额外屏幕候选偏移数组。 | 该分支在此候选中未使用 |
| `allowOutsideGeometry` | `false` / `true` | 可选 | 是否允许标签候选位于源几何外侧。 | 该分支在此候选中未使用 |
| `requireInsideGeometry` | `false` / `true` | 可选 | 是否要求标签候选位于源几何内部。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/anchor/requireInsideGeometry`；第 1681 行 |
| `preferViewportCenter` | `false` / `true` | 可选 | 候选是否偏好当前视窗中心。 | 该分支在此候选中未使用 |

<a id="t25"></a>

## t25 · $.engine.renderDefaults.Point.anchor.offsetPx

首次入口：`$.engine.renderDefaults.Point.anchor.offsetPx`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `x` | number | 必填 | X 坐标或水平像素偏移；由所在坐标/偏移对象区分。 | 该分支在此候选中未使用 |
| `y` | number | 必填 | 世界高度坐标或垂直像素偏移；地图平面第二轴通常是 z。 | 该分支在此候选中未使用 |

<a id="t26"></a>

## t26 · $.engine.renderDefaults.Point.anchor.candidateOffsetsPx[]

首次入口：`$.engine.renderDefaults.Point.anchor.candidateOffsetsPx[]`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `name` | string | 必填 | 候选名称、署名名称等人类可读文本；不是稳定 ID。 | 该分支在此候选中未使用 |
| `x` | number | 必填 | X 坐标或水平像素偏移；由所在坐标/偏移对象区分。 | 该分支在此候选中未使用 |
| `y` | number | 必填 | 世界高度坐标或垂直像素偏移；地图平面第二轴通常是 z。 | 该分支在此候选中未使用 |

<a id="t27"></a>

## t27 · RenderPolygonCandidateExtension

首次入口：`$.engine.renderDefaults.Point.polygonCandidates`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `weightMode` | `"none"` / `"distanceToCenter"` | 可选 | 候选加权方式。 | `/nodes/10/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/polygonCandidates/weightMode`；第 12312 行 |
| `weightedSwitchThreshold` | number | 可选 | 加权候选切换的优势门槛。 | `/nodes/10/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/polygonCandidates/weightedSwitchThreshold`；第 12313 行 |
| `reuseBonus` | number | 可选 | 复用旧候选的评分加成。 | `/nodes/10/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/polygonCandidates/reuseBonus`；第 12309 行 |
| `viewportPreference` | `false` / `true` | 可选 | 是否偏好位于当前视窗内的候选。 | `/nodes/10/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/polygonCandidates/viewportPreference`；第 12311 行 |
| `edgePenalty` | number | 可选 | 候选靠近视窗边缘的扣分。 | `/nodes/10/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/polygonCandidates/edgePenalty`；第 12303 行 |
| `mode` | `"inherit"` / `"none"` / `"fixedInterior"` / `"autoInteriorGrid"` / `"largeFeatureGrid"` / `"viewportAwareCandidateSet"` / `"gridByWorldUnits"` | 可选 | 当前联合结构的分支选择器；先看 mode，再解释其余字段。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/polygonCandidates/mode`；第 1720 行 |
| `count` | number | 可选 | 候选生成数量。 | `/nodes/10/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/polygonCandidates/count`；第 12302 行 |
| `gridSize` | number | 可选 | 候选网格的尺度参数；单位须结合生成模式读取。 | 该分支在此候选中未使用 |
| `gridMinSize` | number | 可选 | 候选网格最小尺度。 | 该分支在此候选中未使用 |
| `maxCandidates` | number | 可选 | 候选总数量上限。 | `/nodes/10/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/polygonCandidates/maxCandidates`；第 12304 行 |
| `scanMax` | number | 可选 | 候选扫描/筛选预算上限。 | 该分支在此候选中未使用 |
| `overflow` | `"rankedPrune"` / `"seededPrune"` | 可选 | 候选超额后的裁剪方式。 | 该分支在此候选中未使用 |
| `preferPreviousCandidate` | `false` / `true` | 可选 | 优先复用上一次合法候选以减少跳动。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/polygonCandidates/preferPreviousCandidate`；第 1721 行 |
| `switchThreshold` | number | 可选 | 改选候选所需的优势门槛。 | `/nodes/10/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/polygonCandidates/switchThreshold`；第 12310 行 |
| `allowViewportFallback` | `false` / `true` | 可选 | 是否允许退回视窗局部候选。 | `/nodes/10/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/polygonCandidates/allowViewportFallback`；第 12301 行 |
| `minScreenAreaPx` | number | 可选 | 最小屏幕面积，单位 px²；在候选设置中只限制标签候选。 | `/nodes/10/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/polygonCandidates/minScreenAreaPx`；第 12305 行 |
| `preferViewportCenter` | `false` / `true` | 可选 | 候选是否偏好当前视窗中心。 | `/nodes/10/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/polygonCandidates/preferViewportCenter`；第 12308 行 |

<a id="t28"></a>

## t28 · RenderCollisionExtension

首次入口：`$.engine.renderDefaults.Point.collision`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `boundsAdjustment` | [$.engine.renderDefaults.Point.collision.boundsAdjustment (t29)](#t29) | 可选 | 碰撞边界的 x/y/width/height 修正。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/1/extensions/collision/boundsAdjustment`；第 1795 行 |
| `collideWith` | 数组<`"symbol"` / `"requiredLabel"` / `"importantLabel"` / `"optionalLabel"` / `"softLabel"` / `"geometry"`> | 可选 | 当前对象需要避让的对象类别。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/collision/collideWith`；第 1685 行 |
| `blocks` | 数组<`"optionalLabel"` / `"softLabel"` / `"poiLabel"` / `"structureLabel"`> | 可选 | 当前对象会阻挡哪些类别的标签。 | 该分支在此候选中未使用 |
| `allowOverlap` | `false` / `true` | 可选 | 是否允许重叠显示。 | 该分支在此候选中未使用 |
| `paddingPx` | number | 可选 | 碰撞边界额外留白，单位像素。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/collision/paddingPx`；第 1693 行 |
| `hidePolicy` | `"hide"` / `"abbreviateThenHide"` / `"forceShow"` / `"showWithoutBlocking"` / `"geometryOnly"` | 可选 | 碰撞失败时隐藏、缩写、强显或仅几何等策略。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/collision/hidePolicy`；第 1692 行 |

<a id="t29"></a>

## t29 · $.engine.renderDefaults.Point.collision.boundsAdjustment

首次入口：`$.engine.renderDefaults.Point.collision.boundsAdjustment`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `x` | number | 可选 | X 坐标或水平像素偏移；由所在坐标/偏移对象区分。 | 该分支在此候选中未使用 |
| `y` | number | 可选 | 世界高度坐标或垂直像素偏移；地图平面第二轴通常是 z。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/1/extensions/collision/boundsAdjustment/y`；第 1797 行 |
| `width` | number | 可选 | 轮廓宽度或边界框宽度修正；具体由所在对象解释。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/1/extensions/collision/boundsAdjustment/width`；第 1796 行 |
| `height` | number | 可选 | 边界框高度修正，或绘制绑定返回有效高度。 | 该分支在此候选中未使用 |

<a id="t30"></a>

## t30 · RenderStabilityExtension

首次入口：`$.engine.renderDefaults.Point.stability`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `enabled` | `false` / `true` | 可选 | 启用标记；false 不等于删除定义，具体作用范围取决于所在模块。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/stability/enabled`；第 1728 行 |
| `cacheKey` | `"featureID"` / `"featureID+zoomBucket"` / `"featureID+mode"` / `"custom"` | 可选 | 稳定候选缓存的上下文组成。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/stability/cacheKey`；第 1727 行 |
| `zoomBucketSize` | number | 可选 | 用于稳定缓存的 Zoom 分桶宽度。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/stability/zoomBucketSize`；第 1735 行 |
| `freezeDuringPan` | `false` / `true` | 可选 | 地图平移期间是否暂时保留旧候选。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/stability/freezeDuringPan`；第 1729 行 |
| `recomputeOnMoveEnd` | `false` / `true` | 可选 | 平移结束后是否重算候选。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/stability/recomputeOnMoveEnd`；第 1733 行 |
| `recomputeOnZoomEnd` | `false` / `true` | 可选 | 缩放结束后是否重新核验候选。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/stability/recomputeOnZoomEnd`；第 1734 行 |
| `hysteresisPx` | number | 可选 | 稳定位置的滞后距离，单位像素。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/stability/hysteresisPx`；第 1730 行 |
| `keepPreviousCandidate` | `false` / `true` | 可选 | 是否保留上一轮候选。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/stability/keepPreviousCandidate`；第 1732 行 |
| `keepPreviousAnchor` | `false` / `true` | 可选 | 是否保留上一轮几何锚点。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/stability/keepPreviousAnchor`；第 1731 行 |
| `invalidateWhen` | 数组<`"zoomBucketChanged"` / `"featureGeometryChanged"` / `"featureTextChanged"` / `"modeChanged"` / `"worldChanged"` / `"labelOutOfViewport"` / `"collisionFailedRepeatedly"`> | 可选 | 触发候选缓存失效的事件集合。 | 该分支在此候选中未使用 |

<a id="t31"></a>

## t31 · RenderDensityExtension

首次入口：`$.engine.renderDefaults.Point.density`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `enabled` | `false` / `true` | 可选 | 启用标记；false 不等于删除定义，具体作用范围取决于所在模块。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/density/enabled`；第 1696 行 |
| `mode` | `"inherit"` / `"override"` | 必填 | 当前联合结构的分支选择器；先看 mode，再解释其余字段。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/density/mode`；第 1699 行 |
| `gridSizePx` | number | 可选 | 密度网格边长，单位屏幕像素。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/density/gridSizePx`；第 1697 行 |
| `maxLabelsPerGrid` | number | 可选 | 每个密度网格允许的标签数量。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/density/maxLabelsPerGrid`；第 1698 行 |
| `maxSymbolsPerGrid` | number | 可选 | 每个密度网格允许的符号数量。 | `/nodes/5/geometryProfiles/Polygon/zoomPriority/rules/1/extensions/density/maxSymbolsPerGrid`；第 7514 行 |
| `reduceOrder` | 数组<`"geometryOnly"` / `"hideSoftLabels"` / `"abbreviateOptionalLabels"` / `"hideOptionalLabels"` / `"hideSymbols"`> | 可选 | 超出密度预算时依次采用的降级步骤。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/density/reduceOrder`；第 1702 行 |
| `importanceField` | string | 可选 | 从本记录读取重要程度的字段。 | 该分支在此候选中未使用 |
| `preserveSelected` | `false` / `true` | 可选 | 密度降级时是否优先保留选中目标。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/density/preserveSelected`；第 1701 行 |
| `preserveRequired` | `false` / `true` | 可选 | 密度降级时是否优先保留必显标签。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/density/preserveRequired`；第 1700 行 |

<a id="t32"></a>

## t32 · RenderFallbackExtension

首次入口：`$.engine.renderDefaults.Point.fallback`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `whenNoLabelText` | `"showID"` / `"placeholder"` / `"hideLabel"` / `"showClassKind"` | 可选 | 没有可用标签文字时的回退处理。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/fallback/whenNoLabelText`；第 1710 行 |
| `whenCollisionFailed` | `"forceShow"` / `"hideLabel"` / `"abbreviate"` / `"showGeometryOnly"` | 可选 | 碰撞求解失败后的回退处理。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/fallback/whenCollisionFailed`；第 1708 行 |
| `whenRuleMissing` | `"geometryOnly"` / `"hidden"` / `"debugDefault"` / `"legacyDefault"` | 可选 | 没有适用规则时的回退；不能默认理解为一定隐藏。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/fallback/whenRuleMissing`；第 1711 行 |
| `whenGeometryInvalid` | `"skip"` / `"showErrorMarker"` / `"debugOnly"` | 可选 | 源几何无效时的处理方式。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/fallback/whenGeometryInvalid`；第 1709 行 |

<a id="t33"></a>

## t33 · RenderVisibilityExtension

首次入口：`$.engine.renderDefaults.Point.visibility`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `mode` | `"inherit"` / `"always"` / `"sameId"` / `"coincidentPoint"` / `"lineContainmentChoice"` / `"activeContextMember"` | 必填 | 当前联合结构的分支选择器；先看 mode，再解释其余字段。 | `/nodes/5/geometryProfiles/Polygon/zoomPriority/rules/1/extensions/visibility/mode`；第 7555 行 |
| `sameId` | [$.engine.renderDefaults.Point.visibility.sameId (t34)](#t34) | 可选 | 根据相同 ID 的其他分类记录是否存在控制可见性。 | `/nodes/76/geometryProfiles/Point/zoomPriority/rules/0/extensions/visibility/sameId`；第 90937 行 |
| `coincidentPoint` | [$.engine.renderDefaults.Point.visibility.coincidentPoint (t35)](#t35) | 可选 | 根据同位置目标点是否存在控制可见性。 | `/nodes/64/geometryProfiles/Point/zoomPriority/rules/1/extensions/visibility/coincidentPoint`；第 70106 行 |
| `lineContainmentChoice` | [$.engine.renderDefaults.Point.visibility.lineContainmentChoice (t36)](#t36) | 可选 | 根据低/高 Zoom 与线覆盖关系选择展示线。 | `/nodes/65/geometryProfiles/LineString/zoomPriority/rules/0/extensions/visibility/lineContainmentChoice`；第 71457 行 |
| `activeContextMember` | [$.engine.renderDefaults.Point.visibility.activeContextMember (t37)](#t37) | 可选 | 仅在当前主结构与层级上下文中显示成员。 | `/nodes/5/geometryProfiles/Polygon/zoomPriority/rules/1/extensions/visibility/activeContextMember`；第 7551 行 |

<a id="t34"></a>

## t34 · $.engine.renderDefaults.Point.visibility.sameId

首次入口：`$.engine.renderDefaults.Point.visibility.sameId`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `target` | [ClassificationPath (t16)](#t16) | 必填 | 目标分类范围，或输出赋值的目标字段路径；二者不能混用。 | `/nodes/76/geometryProfiles/Point/zoomPriority/rules/0/extensions/visibility/sameId/target`；第 90940 行 |
| `sourceField` | string | 可选 | 当前记录用于匹配关系的字段。 | `/nodes/76/geometryProfiles/Point/zoomPriority/rules/0/extensions/visibility/sameId/sourceField`；第 90939 行 |
| `targetField` | string | 可选 | 目标记录用于匹配或筛选的字段。 | `/nodes/76/geometryProfiles/Point/zoomPriority/rules/0/extensions/visibility/sameId/targetField`；第 90943 行 |
| `behavior` | `"hideIfExists"` / `"showIfExists"` | 必填 | 存在性判断行为，或按钮互斥/联动设置。 | `/nodes/76/geometryProfiles/Point/zoomPriority/rules/0/extensions/visibility/sameId/behavior`；第 90938 行 |

<a id="t35"></a>

## t35 · $.engine.renderDefaults.Point.visibility.coincidentPoint

首次入口：`$.engine.renderDefaults.Point.visibility.coincidentPoint`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `target` | [ClassificationPath (t16)](#t16) | 必填 | 目标分类范围，或输出赋值的目标字段路径；二者不能混用。 | `/nodes/64/geometryProfiles/Point/zoomPriority/rules/1/extensions/visibility/coincidentPoint/target`；第 70109 行 |
| `behavior` | `"hideIfExists"` / `"showIfExists"` | 必填 | 存在性判断行为，或按钮互斥/联动设置。 | `/nodes/64/geometryProfiles/Point/zoomPriority/rules/1/extensions/visibility/coincidentPoint/behavior`；第 70107 行 |
| `targetField` | string | 可选 | 目标记录用于匹配或筛选的字段。 | `/nodes/77/geometryProfiles/Point/zoomPriority/rules/2/extensions/visibility/coincidentPoint/targetField`；第 92188 行 |
| `targetEquals` | string | 可选 | 目标记录指定字段需等于的文本值。 | 该分支在此候选中未使用 |
| `targetNotEquals` | string | 可选 | 目标记录指定字段需不等于的文本值。 | `/nodes/77/geometryProfiles/Point/zoomPriority/rules/2/extensions/visibility/coincidentPoint/targetNotEquals`；第 92189 行 |
| `precision` | number | 可选 | 几何/位置比较精度参数。 | `/nodes/64/geometryProfiles/Point/zoomPriority/rules/1/extensions/visibility/coincidentPoint/precision`；第 70108 行 |

<a id="t36"></a>

## t36 · $.engine.renderDefaults.Point.visibility.lineContainmentChoice

首次入口：`$.engine.renderDefaults.Point.visibility.lineContainmentChoice`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `field` | string | 必填 | 所引用的数据字段路径；不同位置的可用字段集由对应分类限定。 | `/nodes/65/geometryProfiles/LineString/zoomPriority/rules/0/extensions/visibility/lineContainmentChoice/field`；第 71458 行 |
| `primaryValue` | string | 必填 | 低 Zoom 主要展示的字段值。 | `/nodes/65/geometryProfiles/LineString/zoomPriority/rules/0/extensions/visibility/lineContainmentChoice/primaryValue`；第 71466 行 |
| `overlayValues` | 数组<string> | 必填 | 达到切换 Zoom 后可选的覆盖展示值集合。 | `/nodes/65/geometryProfiles/LineString/zoomPriority/rules/0/extensions/visibility/lineContainmentChoice/overlayValues`；第 71459 行 |
| `switchZoom` | number | 必填 | 关系可见性策略切换所用的逻辑 Zoom。 | `/nodes/65/geometryProfiles/LineString/zoomPriority/rules/0/extensions/visibility/lineContainmentChoice/switchZoom`；第 71467 行 |
| `precision` | number | 可选 | 几何/位置比较精度参数。 | `/nodes/65/geometryProfiles/LineString/zoomPriority/rules/0/extensions/visibility/lineContainmentChoice/precision`；第 71465 行 |

<a id="t37"></a>

## t37 · $.engine.renderDefaults.Point.visibility.activeContextMember

首次入口：`$.engine.renderDefaults.Point.visibility.activeContextMember`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `bindingId` | string | 可选 | 旧上下文绑定的稳定 ID；不是任意字段名。 | `/nodes/5/geometryProfiles/Polygon/zoomPriority/rules/1/extensions/visibility/activeContextMember/bindingId`；第 7552 行 |
| `requireSelector` | `false` / `true` | 可选 | 是否必须存在有效层级选择才显示成员。 | `/nodes/5/geometryProfiles/Polygon/zoomPriority/rules/1/extensions/visibility/activeContextMember/requireSelector`；第 7553 行 |

<a id="t38"></a>

## t38 · Partial

首次入口：`$.engine.renderDefaults.Point.interaction`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `hover` | [Partial (t39)](#t39) | 可选 | 鼠标悬停状态的交互外观。 | 该分支在此候选中未使用 |
| `selected` | [Partial (t39)](#t39) | 可选 | 选中状态的外观；在工作流 geometry 中则表示固定几何类型。 | `/nodes/66/geometryProfiles/LineString/zoomPriority/rules/0/extensions/interaction/selected`；第 74232 行 |
| `searchResult` | [Partial (t39)](#t39) | 可选 | 搜索命中状态的交互外观。 | `/nodes/66/geometryProfiles/LineString/zoomPriority/rules/0/extensions/interaction/searchResult`；第 74217 行 |
| `editing` | [Partial (t39)](#t39) | 可选 | 编辑状态的交互外观。 | 该分支在此候选中未使用 |
| `deletionMarked` | [Partial (t39)](#t39) | 可选 | 标记删除状态的交互外观。 | 该分支在此候选中未使用 |

<a id="t39"></a>

## t39 · Partial

首次入口：`$.engine.renderDefaults.Point.interaction.hover`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `enabled` | `false` / `true` | 可选 | 启用标记；false 不等于删除定义，具体作用范围取决于所在模块。 | 该分支在此候选中未使用 |
| `strokeColor` | string | 可选 | 交互覆盖的描边固定颜色。 | `/nodes/66/geometryProfiles/LineString/zoomPriority/rules/0/extensions/interaction/searchResult/strokeColor`；第 74224 行 |
| `strokeWidth` | number | 可选 | 交互描边宽度，单位像素。 | `/nodes/66/geometryProfiles/LineString/zoomPriority/rules/0/extensions/interaction/searchResult/strokeWidth`；第 74230 行 |
| `strokeOpacity` | number | 可选 | 描边不透明度，0 为透明，1 为不透明。 | 该分支在此候选中未使用 |
| `fillColor` | string | 可选 | 交互覆盖的固定填充色。 | 该分支在此候选中未使用 |
| `fillOpacity` | number | 可选 | 填充不透明度，0 为透明，1 为不透明。 | 该分支在此候选中未使用 |
| `zIndexOffset` | number | 可选 | 在基础图层顺序上叠加的偏移量；不等于 Label 碰撞优先级。 | 该分支在此候选中未使用 |
| `forceShowLabel` | `false` / `true` | 可选 | 此交互状态请求保留标签，不修改标签文字来源。 | 该分支在此候选中未使用 |
| `labelPriority` | number | 可选 | 交互状态给 Label 的碰撞优先分数。 | 该分支在此候选中未使用 |
| `symbol` | [$.engine.interactionBaselines.Point.hover.symbol (t9)](#t9) | 可选 | 交互点标记配置；并非源几何坐标。 | 该分支在此候选中未使用 |
| `outline` | [$.engine.interactionBaselines.Point.hover.outline (t10)](#t10) | 可选 | 交互覆盖的轮廓线描述。 | `/nodes/66/geometryProfiles/LineString/zoomPriority/rules/0/extensions/interaction/searchResult/outline`；第 74219 行 |
| `dashArray` | string | 可选 | 旧版自定义虚线长度字符串。 | `/nodes/66/geometryProfiles/LineString/zoomPriority/rules/0/extensions/interaction/searchResult/dashArray`；第 74218 行 |
| `strokeColorBinding` | [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t11)](#t11) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t13)](#t13) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t14)](#t14) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t15)](#t15) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t17)](#t17) | 可选 | 交互描边颜色的取值方式，可按字段、关系或值对照求色。 | `/nodes/66/geometryProfiles/LineString/zoomPriority/rules/0/extensions/interaction/searchResult/strokeColorBinding`；第 74225 行 |

<a id="t40"></a>

## t40 · ConfigRegistries

首次入口：`$.registries`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `optionSets` | 数组<[$.registries.optionSets[] (t41)](#t41)> | 可选 | 旧式共享选项登记；当前公共表使用 lookupTables。 | 该分支在此候选中未使用 |
| `cardLayouts` | 数组<[ControlledRegistryItem (t43)](#t43)> | 必填 | 受控信息卡布局登记表。 | `/registries/cardLayouts`；第 108793 行 |
| `cardComponents` | 数组<[ControlledRegistryItem (t43)](#t43)> | 必填 | 允许使用的代码信息卡组件登记表。 | `/registries/cardComponents`；第 108781 行 |
| `displayProfiles` | 数组<[ControlledRegistryItem (t43)](#t43)> | 必填 | 迁移/登记用的显示能力清单。 | `/registries/displayProfiles`；第 108900 行 |
| `specialDisplayLogic` | 数组<[ControlledRegistryItem (t43)](#t43)> | 必填 | 受控特殊显示能力的登记清单。 | `/registries/specialDisplayLogic`；第 108958 行 |
| `workflowControls` | 数组<[ControlledRegistryItem (t43)](#t43)> | 必填 | 受控工作流控件类型登记表。 | `/registries/workflowControls`；第 109345 行 |
| `workflowBlocks` | 数组<[ControlledRegistryItem (t43)](#t43)> | 必填 | 受控外部工作流单元登记表。 | `/registries/workflowBlocks`；第 109224 行 |

<a id="t41"></a>

## t41 · $.registries.optionSets[]

首次入口：`$.registries.optionSets[]`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `id` | string | 必填 | 当前对象的稳定标识；唯一性范围取决于对象类型。 | 该分支在此候选中未使用 |
| `label` | [LocalizedText (t1)](#t1) | 必填 | 名称对象或 Label 样式对象；必须结合所在路径解读。 | 该分支在此候选中未使用 |
| `options` | 数组<[SelectOption (t42)](#t42)> | 必填 | 控件本地选项数组、组件设置对象等；不能跨对象套用。 | 该分支在此候选中未使用 |

<a id="t42"></a>

## t42 · SelectOption

首次入口：`$.registries.optionSets[].options[]`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `value` | string | 必填 | 最终存储值、条件比较值或常量；是否字符串须看当前类型声明。 | `/nodes/65/fields/4/optionTable/rows/0/value`；第 71167 行 |
| `label` | [LocalizedText (t1)](#t1) | 必填 | 名称对象或 Label 样式对象；必须结合所在路径解读。 | `/nodes/65/fields/4/optionTable/rows/0/label`；第 71163 行 |

<a id="t43"></a>

## t43 · ControlledRegistryItem

首次入口：`$.registries.cardLayouts[]`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `id` | string | 必填 | 当前对象的稳定标识；唯一性范围取决于对象类型。 | `/registries/cardComponents/0/id`；第 108786 行 |
| `label` | [LocalizedText (t1)](#t1) | 必填 | 名称对象或 Label 样式对象；必须结合所在路径解读。 | `/registries/cardComponents/0/label`；第 108787 行 |
| `allowedClasses` | 数组<string> | 可选 | 组件允许服务的 Class 代码集合。 | `/registries/cardComponents/0/allowedClasses`；第 108783 行 |
| `optionSchema` | 数组<[$.registries.cardLayouts[].optionSchema[] (t44)](#t44)> | 可选 | 受控组件可编辑选项的结构说明。 | 该分支在此候选中未使用 |

<a id="t44"></a>

## t44 · $.registries.cardLayouts[].optionSchema[]

首次入口：`$.registries.cardLayouts[].optionSchema[]`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `key` | string | 必填 | 真实数据字段路径或重复组成员键；不等于 fieldId。 | 该分支在此候选中未使用 |
| `label` | [LocalizedText (t1)](#t1) | 必填 | 名称对象或 Label 样式对象；必须结合所在路径解读。 | 该分支在此候选中未使用 |
| `type` | `"number"` / `"boolean"` / `"text"` / `"select"` | 必填 | 数据类型，或受控组件选项的输入类型。 | 该分支在此候选中未使用 |
| `options` | 数组<string> | 可选 | 控件本地选项数组、组件设置对象等；不能跨对象套用。 | 该分支在此候选中未使用 |

<a id="t45"></a>

## t45 · LookupTable

首次入口：`$.lookupTables[]`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `id` | string | 必填 | 当前对象的稳定标识；唯一性范围取决于对象类型。 | `/lookupTables/0/id`；第 820 行 |
| `label` | [LocalizedText (t1)](#t1) | 必填 | 名称对象或 Label 样式对象；必须结合所在路径解读。 | `/lookupTables/0/label`；第 821 行 |
| `valueType` | `"string"` / `"number"` / `"boolean"` | 必填 | 对照表实际存储标量的类型；行内 value 仍用文本编码。 | `/lookupTables/0/valueType`；第 893 行 |
| `functionKind` | `"none"` / `"speed"` / `"teleportHub"` / `"tagField"` | 必填 | 公共表功能值的用途：普通、速度、枢纽或标签字段定义。 | `/lookupTables/0/functionKind`；第 819 行 |
| `rows` | 数组<[$.lookupTables[].rows[] (t46)](#t46)> | 必填 | 公共表/本地表的行数组，或文字控件行高；以所在类型区分。 | `/lookupTables/0/rows`；第 825 行 |

<a id="t46"></a>

## t46 · $.lookupTables[].rows[]

首次入口：`$.lookupTables[].rows[]`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `value` | string | 必填 | 最终存储值、条件比较值或常量；是否字符串须看当前类型声明。 | `/lookupTables/0/rows/0/value`；第 857 行 |
| `label` | [LocalizedText (t1)](#t1) | 必填 | 名称对象或 Label 样式对象；必须结合所在路径解读。 | `/lookupTables/0/rows/0/label`；第 853 行 |
| `functionValue` | number / [TagFieldMetadata (t47)](#t47) / [$.lookupTables[].rows[].functionValue (t49)](#t49) | 可选 | 公共表的功能值，可为数字、枢纽参数或标签字段元数据。 | `/lookupTables/0/rows/0/functionValue`；第 827 行 |

<a id="t47"></a>

## t47 · TagFieldMetadata

首次入口：`$.lookupTables[].rows[].functionValue`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `kind` | `"tagField"` | 必填 | 分类路径第二级，或条件/控件的分支种类；依所在对象判读。 | `/lookupTables/2/rows/0/functionValue/kind`；第 932 行 |
| `type` | `"number"` / `"text"` / `"select"` / `"bool"` | 必填 | 数据类型，或受控组件选项的输入类型。 | `/lookupTables/2/rows/0/functionValue/type`；第 933 行 |
| `format` | `"plain"` / `"externalLink"` / `"date"` | 可选 | 字段/显示格式；只允许当前类型枚举中的受控格式。 | 该分支在此候选中未使用 |
| `valueTable` | [OptionTable (t48)](#t48) | 可选 | 标签字段内部携带的本地选项表。 | 该分支在此候选中未使用 |
| `valueTableId` | string | 可选 | 标签字段选项引用的公共表 ID。 | 该分支在此候选中未使用 |

<a id="t48"></a>

## t48 · OptionTable

首次入口：`$.lookupTables[].rows[].functionValue.valueTable`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `valueType` | `"string"` / `"number"` / `"boolean"` | 必填 | 对照表实际存储标量的类型；行内 value 仍用文本编码。 | `/nodes/65/fields/4/optionTable/valueType`；第 71219 行 |
| `rows` | 数组<[SelectOption (t42)](#t42)> | 必填 | 公共表/本地表的行数组，或文字控件行高；以所在类型区分。 | `/nodes/65/fields/4/optionTable/rows`；第 71161 行 |

<a id="t49"></a>

## t49 · $.lookupTables[].rows[].functionValue

首次入口：`$.lookupTables[].rows[].functionValue`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `world` | string | 必填 | 引擎的 World 写入约定，或功能行内的目标世界 ID。 | `/lookupTables/0/rows/0/functionValue/world`；第 851 行 |
| `range` | number | 必填 | 枢纽功能值的范围参数；保留现有 V1 功能语义。 | `/lookupTables/0/rows/0/functionValue/range`；第 828 行 |
| `returnPoints` | 数组<[$.lookupTables[].rows[].functionValue.returnPoints[] (t50)](#t50)> | 必填 | 枢纽的候选返回点数组。 | `/lookupTables/0/rows/0/functionValue/returnPoints`；第 829 行 |

<a id="t50"></a>

## t50 · $.lookupTables[].rows[].functionValue.returnPoints[]

首次入口：`$.lookupTables[].rows[].functionValue.returnPoints[]`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `id` | string | 必填 | 当前对象的稳定标识；唯一性范围取决于对象类型。 | `/lookupTables/0/rows/0/functionValue/returnPoints/0/id`；第 831 行 |
| `label` | [LocalizedText (t1)](#t1) | 必填 | 名称对象或 Label 样式对象；必须结合所在路径解读。 | `/lookupTables/0/rows/0/functionValue/returnPoints/0/label`；第 832 行 |
| `x` | number | 必填 | X 坐标或水平像素偏移；由所在坐标/偏移对象区分。 | `/lookupTables/0/rows/0/functionValue/returnPoints/0/x`；第 836 行 |
| `y` | number | 必填 | 世界高度坐标或垂直像素偏移；地图平面第二轴通常是 z。 | `/lookupTables/0/rows/0/functionValue/returnPoints/0/y`；第 837 行 |
| `z` | number | 必填 | 世界 Z 平面坐标；不是几何图层 zLevel。 | `/lookupTables/0/rows/0/functionValue/returnPoints/0/z`；第 838 行 |

<a id="t51"></a>

## t51 · ApplicationSettings

首次入口：`$.application`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `schemaVersion` | `"cairnmap.application.v1"` | 必填 | 文件结构标记；固定字符串用于识别整包、应用设置或对齐报告。 | `/application/schemaVersion`；第 396 行 |
| `worlds` | 数组<[ApplicationWorld (t52)](#t52)> | 必填 | 可用世界数组；每个世界按来源组解析资源。 | `/application/worlds`；第 494 行 |
| `buttons` | [ApplicationButtons (t57)](#t57) | 必填 | 图层按钮及默认选择、互斥和状态保存设置。 | `/application/buttons`；第 3 行 |
| `sources` | [ApplicationSourceSettings (t64)](#t64) / [ApplicationWorldGroups (t69)](#t69) | 必填 | 数据读取设置；新配置使用 world-groups 来源组形式。 | `/application/sources`；第 397 行 |
| `modules` | [ApplicationModules (t74)](#t74) | 必填 | 功能模块入口、加载策略与互斥关系。 | `/application/modules`；第 283 行 |
| `review` | [ApplicationReview (t77)](#t77) | 必填 | 审核功能开关、接口与服务器环境变量引用。 | `/application/review`；第 376 行 |
| `preferences` | [ApplicationPreferences (t80)](#t80) | 必填 | 语言、搜索、导航、地图及工具栏默认偏好。 | `/application/preferences`；第 351 行 |

<a id="t52"></a>

## t52 · ApplicationWorld

首次入口：`$.application.worlds[]`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `id` | string | 必填 | 当前对象的稳定标识；唯一性范围取决于对象类型。 | `/application/worlds/0/id`；第 503 行 |
| `prefix` | string | 必填 | 世界 ID 组装前缀或瓦片文件前缀，二者含义不同。 | `/application/worlds/0/prefix`；第 510 行 |
| `numericCode` | number | 必填 | 世界的数值编号。 | `/application/worlds/0/numericCode`；第 509 行 |
| `label` | [ApplicationLabel (t53)](#t53) | 必填 | 名称对象或 Label 样式对象；必须结合所在路径解读。 | `/application/worlds/0/label`；第 504 行 |
| `enabled` | boolean | 必填 | 启用标记；false 不等于删除定义，具体作用范围取决于所在模块。 | `/application/worlds/0/enabled`；第 502 行 |
| `default` | boolean | 必填 | 是否为该列表默认项；不是字段默认输入值。 | `/application/worlds/0/default`；第 501 行 |
| `center` | [$.application.worlds[].center (t54)](#t54) | 必填 | 地图默认中心的世界 x/y/z 坐标。 | `/application/worlds/0/center`；第 496 行 |
| `mapLink` | string | 必填 | 该世界对应的地图链接。 | `/application/worlds/0/mapLink`；第 508 行 |
| `remoteWorldId` | string | 可选 | 来源服务使用的世界标签；省略时使用本地 world.id。 | 该分支在此候选中未使用 |
| `dataSourceId` | string | 可选 | 旧式每世界直接绑定的数据源 ID；来源组模式下不得同时保存。 | 该分支在此候选中未使用 |
| `projection` | [ApplicationProjection (t55)](#t55) | 可选 | 旧式世界投影显式配置；来源组模式以默认机制解析。 | 该分支在此候选中未使用 |
| `tiles` | [ApplicationTiles (t56)](#t56) | 可选 | 瓦片来源设置；新配置通常位于来源组内。 | 该分支在此候选中未使用 |
| `projectionOverride` | [ApplicationProjection (t55)](#t55) | 可选 | 特殊世界的投影覆写；普通世界无需列出默认矩阵。 | 该分支在此候选中未使用 |

<a id="t53"></a>

## t53 · ApplicationLabel

首次入口：`$.application.worlds[].label`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `zh` | string | 必填 | 中文名称或说明；不能把实际存储值改写为此显示文本。 | `/application/buttons/items/0/names/zh`；第 56 行 |
| `en` | string | 必填 | 英文名称或说明；空字符串在当前配置中很常见，具体显示依使用方回退。 | `/application/buttons/items/0/names/en`；第 55 行 |

<a id="t54"></a>

## t54 · $.application.worlds[].center

首次入口：`$.application.worlds[].center`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `x` | number | 必填 | X 坐标或水平像素偏移；由所在坐标/偏移对象区分。 | `/application/worlds/0/center/x`；第 497 行 |
| `y` | number | 必填 | 世界高度坐标或垂直像素偏移；地图平面第二轴通常是 z。 | `/application/worlds/0/center/y`；第 498 行 |
| `z` | number | 必填 | 世界 Z 平面坐标；不是几何图层 zLevel。 | `/application/worlds/0/center/z`；第 499 行 |

<a id="t55"></a>

## t55 · ApplicationProjection

首次入口：`$.application.worlds[].projection`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `id` | `"dynmap-flat"` | 必填 | 当前对象的稳定标识；唯一性范围取决于对象类型。 | 该分支在此候选中未使用 |
| `worldToMap` | 数组<number> | 必填 | 世界坐标到地图投影的 9 项变换参数；普通世界不需手填。 | 该分支在此候选中未使用 |
| `mapToWorld` | 数组<number> | 必填 | 地图投影到世界坐标的 9 项反向参数；普通世界不需手填。 | 该分支在此候选中未使用 |
| `mapzoomin` | number | 必填 | Dynmap 投影内部放大级数；与共享逻辑 Zoom 分开。 | 该分支在此候选中未使用 |
| `mapzoomout` | number | 必填 | Dynmap 投影内部缩小级数；与共享逻辑 Zoom 分开。 | 该分支在此候选中未使用 |
| `tileSize` | `128` | 必填 | Dynmap 投影瓦片尺寸；当前契约固定 128。 | 该分支在此候选中未使用 |
| `tilescale` | number | 必填 | Dynmap 投影内部瓦片尺度参数。 | 该分支在此候选中未使用 |

<a id="t56"></a>

## t56 · ApplicationTiles

首次入口：`$.application.worlds[].tiles`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `baseUrl` | string | 必填 | 数据访问/链接模式的根地址，或旧式瓦片地址。 | 该分支在此候选中未使用 |
| `filteredBaseUrl` | string | 必填 | 旧式已过滤/代理瓦片地址；新模式由来源组代理注册解析。 | 该分支在此候选中未使用 |
| `prefix` | string | 必填 | 世界 ID 组装前缀或瓦片文件前缀，二者含义不同。 | 该分支在此候选中未使用 |
| `imageFormat` | `"jpg"` / `"png"` / `"webp"` | 必填 | 瓦片图片格式 jpg/png/webp。 | 该分支在此候选中未使用 |
| `extraZoomLevels` | number | 必填 | 瓦片额外缩放级数；不改变逻辑 Zoom 的 0–8 范围。 | 该分支在此候选中未使用 |
| `minNativeZoom` | number | 必填 | 原生瓦片下限，采用映射后的 Leaflet Zoom。 | 该分支在此候选中未使用 |
| `maxNativeZoom` | number | 必填 | 原生瓦片上限，采用映射后的 Leaflet Zoom。 | 该分支在此候选中未使用 |
| `attribution` | string | 必填 | 瓦片署名对象；旧格式也可能是 HTML 文本。 | 该分支在此候选中未使用 |
| `maxRetries` | number | 必填 | 资源请求失败后的最大重试次数。 | 该分支在此候选中未使用 |
| `retryDelay` | number | 必填 | 重试间隔，单位毫秒。 | 该分支在此候选中未使用 |

<a id="t57"></a>

## t57 · ApplicationButtons

首次入口：`$.application.buttons`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `storageKey` | string | 必填 | 浏览器持久状态存储键；不是后端接口或数据仓库。 | `/application/buttons/storageKey`；第 281 行 |
| `legacyStorageKeys` | 数组<string> | 必填 | 仅用于读取旧浏览器状态的历史键名列表。 | `/application/buttons/legacyStorageKeys`；第 277 行 |
| `maxActive` | number | 必填 | 同时启用图层按钮的数量上限。 | `/application/buttons/maxActive`；第 280 行 |
| `fallback` | 数组<string> | 必填 | 回退策略对象，或默认启用按钮 ID 列表，依所在模块解释。 | `/application/buttons/fallback`；第 5 行 |
| `byWorld` | [Record (t58)](#t58) | 必填 | 以世界 ID 为键的默认启用按钮列表。 | `/application/buttons/byWorld`；第 4 行 |
| `items` | 数组<[ApplicationButton (t59)](#t59)> | 必填 | 当前模块的项目数组；项目结构由所在类型说明。 | `/application/buttons/items`；第 15 行 |

<a id="t58"></a>

## t58 · Record

首次入口：`$.application.buttons.byWorld`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| 可变字典键 | 数组<string> | 依使用方 | 仅该字典允许可变键；不表示其他结构可任意添加键。 | — |

<a id="t59"></a>

## t59 · ApplicationButton

首次入口：`$.application.buttons.items[]`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `id` | string | 必填 | 当前对象的稳定标识；唯一性范围取决于对象类型。 | `/application/buttons/items/0/id`；第 53 行 |
| `tone` | `"blue"` / `"green"` / `"cyan"` / `"purple"` / `"gray"` / `"orange"` / `"slate"` / `"red"` / `"teal"` / `"pink"` / `"amber"` / `"indigo"` | 必填 | 受控按钮配色方案键。 | `/application/buttons/items/0/tone`；第 59 行 |
| `iconKey` | string | 必填 | 受控 SVG 图标键；并非任意外部图片地址。 | `/application/buttons/items/0/iconKey`；第 52 行 |
| `defaultEnabled` | `false` / `true` | 可选 | 按钮默认启用状态，仍受默认列表与状态恢复策略影响。 | `/application/buttons/items/0/defaultEnabled`；第 50 行 |
| `criteria` | [CairnMapRuleButtonCriteria (t60)](#t60) | 必填 | 图层按钮筛选要素的分类范围。 | `/application/buttons/items/0/criteria`；第 25 行 |
| `behavior` | [CairnMapRuleButtonBehavior (t62)](#t62) | 可选 | 存在性判断行为，或按钮互斥/联动设置。 | `/application/buttons/items/0/behavior`；第 17 行 |
| `names` | [ApplicationLabel (t53)](#t53) | 必填 | 图层按钮的中英文显示名称。 | `/application/buttons/items/0/names`；第 54 行 |
| `size` | `28` / `36` / `44` | 必填 | 符号/文字尺寸或按钮尺寸；单位与数组结构见当前对象类型。 | `/application/buttons/items/0/size`；第 58 行 |
| `group` | string | 必填 | 按钮视觉分组，或重复字段组定义。 | `/application/buttons/items/0/group`；第 51 行 |

<a id="t60"></a>

## t60 · CairnMapRuleButtonCriteria

首次入口：`$.application.buttons.items[].criteria`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `paths` | 数组<[$.application.buttons.items[].criteria.paths[] (t61)](#t61)> | 可选 | 分类路径范围数组；一行内部各层同时满足，多行之间取并集。 | `/application/buttons/items/0/criteria/paths`；第 26 行 |
| `classCode` | 数组<string> | 可选 | 旧式 Class 过滤列表或字段引用的 Class 目标；先看所属结构。 | 该分支在此候选中未使用 |
| `kind` | 数组<string> | 可选 | 分类路径第二级，或条件/控件的分支种类；依所在对象判读。 | 该分支在此候选中未使用 |
| `skind` | 数组<string> | 可选 | 分类路径第三级；实际新要素记录使用 SKind。 | 该分支在此候选中未使用 |
| `skind2` | 数组<string> | 可选 | 分类路径第四级；实际新要素记录使用 SKind2。 | 该分支在此候选中未使用 |

<a id="t61"></a>

## t61 · $.application.buttons.items[].criteria.paths[]

首次入口：`$.application.buttons.items[].criteria.paths[]`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `class` | string | 必填 | 分类路径第一级 Class；此处键名小写，实际要素记录使用 Class。 | `/application/buttons/items/0/criteria/paths/0/class`；第 28 行 |
| `kind` | string | 可选 | 分类路径第二级，或条件/控件的分支种类；依所在对象判读。 | `/application/buttons/items/2/criteria/paths/0/kind`；第 101 行 |
| `skind` | string | 可选 | 分类路径第三级；实际新要素记录使用 SKind。 | `/application/buttons/items/3/criteria/paths/0/skind`；第 134 行 |
| `skind2` | string | 可选 | 分类路径第四级；实际新要素记录使用 SKind2。 | 该分支在此候选中未使用 |

<a id="t62"></a>

## t62 · CairnMapRuleButtonBehavior

首次入口：`$.application.buttons.items[].behavior`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `exclusiveWith` | 数组<string> | 可选 | 与当前按钮/模块互斥的稳定 ID 列表。 | `/application/buttons/items/0/behavior/exclusiveWith`；第 21 行 |
| `exclusiveGroup` | null / string | 可选 | 互斥分组名称；同组按按钮算法限制共存。 | `/application/buttons/items/0/behavior/exclusiveGroup`；第 20 行 |
| `linkedButtons` | 数组<[CairnMapRuleButtonLinkedButton (t63)](#t63)> | 可选 | 当前按钮启用时对其他按钮执行的联动。 | `/application/buttons/items/0/behavior/linkedButtons`；第 22 行 |
| `disableWhenEnabled` | 数组<string> | 可选 | 当前按钮启用时需关闭的其他按钮 ID 列表。 | `/application/buttons/items/0/behavior/disableWhenEnabled`；第 18 行 |
| `enableWhenEnabled` | 数组<string> | 可选 | 当前按钮启用时需开启的其他按钮 ID 列表。 | `/application/buttons/items/0/behavior/enableWhenEnabled`；第 19 行 |
| `persistState` | `false` / `true` | 可选 | 是否保存按钮开关状态。 | `/application/buttons/items/0/behavior/persistState`；第 23 行 |

<a id="t63"></a>

## t63 · CairnMapRuleButtonLinkedButton

首次入口：`$.application.buttons.items[].behavior.linkedButtons[]`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `targetId` | string | 必填 | 联动的目标按钮 ID。 | 该分支在此候选中未使用 |
| `mode` | `"enableWhenThisEnabled"` / `"disableWhenThisEnabled"` / `"mirrorThisState"` | 必填 | 当前联合结构的分支选择器；先看 mode，再解释其余字段。 | 该分支在此候选中未使用 |

<a id="t64"></a>

## t64 · ApplicationSourceSettings

首次入口：`$.application.sources`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `storageKey` | string | 必填 | 浏览器持久状态存储键；不是后端接口或数据仓库。 | `/application/sources/groups/0/sources/storageKey`；第 478 行 |
| `defaultSourceId` | string | 必填 | 当前来源组内默认数据源 ID。 | `/application/sources/groups/0/sources/defaultSourceId`；第 411 行 |
| `selectionMode` | `"fixed"` / `"user-select"` / `"user-select-on-failure"` | 必填 | 数据源选择方式：固定、用户可选或故障时可选。 | `/application/sources/groups/0/sources/selectionMode`；第 477 行 |
| `retryOnFailure` | boolean | 必填 | 读取失败时是否允许重试。 | `/application/sources/groups/0/sources/retryOnFailure`；第 476 行 |
| `items` | 数组<[$.application.sources.items[] (t65)](#t65)> | 必填 | 当前模块的项目数组；项目结构由所在类型说明。 | `/application/sources/groups/0/sources/items`；第 420 行 |
| `github` | [$.application.sources.github (t66)](#t66) | 必填 | GitHub 访问适配所需的来源 ID 与仓库参数。 | `/application/sources/groups/0/sources/github`；第 412 行 |
| `linkModes` | [$.application.sources.linkModes (t67)](#t67) | 必填 | GitHub Raw 兼容链接模式和默认项。 | `/application/sources/groups/0/sources/linkModes`；第 450 行 |

<a id="t65"></a>

## t65 · $.application.sources.items[]

首次入口：`$.application.sources.items[]`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `id` | string | 必填 | 当前对象的稳定标识；唯一性范围取决于对象类型。 | `/application/sources/groups/0/sources/items/0/id`；第 423 行 |
| `label` | [ApplicationLabel (t53)](#t53) | 必填 | 名称对象或 Label 样式对象；必须结合所在路径解读。 | `/application/sources/groups/0/sources/items/0/label`；第 424 行 |
| `enabled` | boolean | 必填 | 启用标记；false 不等于删除定义，具体作用范围取决于所在模块。 | `/application/sources/groups/0/sources/items/0/enabled`；第 422 行 |
| `selectable` | boolean | 必填 | 数据源是否作为可选入口显示。 | `/application/sources/groups/0/sources/items/0/selectable`；第 432 行 |
| `readerKind` | `"formal-release-v2"` | 必填 | 数据读取器标识；当前仅正式发布读取器 formal-release-v2。 | `/application/sources/groups/0/sources/items/0/readerKind`；第 429 行 |
| `readerSchemaVersion` | `"openriamap.formal-release-reader.v2"` | 必填 | 正式发布读取协议版本标记。 | `/application/sources/groups/0/sources/items/0/readerSchemaVersion`；第 430 行 |
| `rootUrl` | string | 必填 | 正式数据仓库的根地址。 | `/application/sources/groups/0/sources/items/0/rootUrl`；第 431 行 |
| `mediaRootUrl` | string | 必填 | 媒体资源仓库的根地址。 | `/application/sources/groups/0/sources/items/0/mediaRootUrl`；第 428 行 |
| `transport` | `"direct"` / `"github-raw-compatible"` | 必填 | 直连或 GitHub Raw 兼容访问方式。 | `/application/sources/groups/0/sources/items/0/transport`；第 433 行 |

<a id="t66"></a>

## t66 · $.application.sources.github

首次入口：`$.application.sources.github`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `sourceIds` | 数组<string> | 必填 | 使用此 GitHub 适配的数据源 ID 列表。 | `/application/sources/groups/0/sources/github/sourceIds`；第 416 行 |
| `owner` | string | 必填 | GitHub 仓库所有者。 | `/application/sources/groups/0/sources/github/owner`；第 414 行 |
| `repo` | string | 必填 | GitHub 仓库名称。 | `/application/sources/groups/0/sources/github/repo`；第 415 行 |
| `branch` | string | 必填 | GitHub 分支名称。 | `/application/sources/groups/0/sources/github/branch`；第 413 行 |

<a id="t67"></a>

## t67 · $.application.sources.linkModes

首次入口：`$.application.sources.linkModes`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `storageKey` | string | 必填 | 浏览器持久状态存储键；不是后端接口或数据仓库。 | `/application/sources/groups/0/sources/linkModes/storageKey`；第 474 行 |
| `legacyStorageKeys` | 数组<string> | 必填 | 仅用于读取旧浏览器状态的历史键名列表。 | `/application/sources/groups/0/sources/linkModes/legacyStorageKeys`；第 471 行 |
| `items` | 数组<[$.application.sources.linkModes.items[] (t68)](#t68)> | 必填 | 当前模块的项目数组；项目结构由所在类型说明。 | `/application/sources/groups/0/sources/linkModes/items`；第 451 行 |

<a id="t68"></a>

## t68 · $.application.sources.linkModes.items[]

首次入口：`$.application.sources.linkModes.items[]`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `id` | string | 必填 | 当前对象的稳定标识；唯一性范围取决于对象类型。 | `/application/sources/groups/0/sources/linkModes/items/0/id`；第 455 行 |
| `label` | [ApplicationLabel (t53)](#t53) | 必填 | 名称对象或 Label 样式对象；必须结合所在路径解读。 | `/application/sources/groups/0/sources/linkModes/items/0/label`；第 456 行 |
| `baseUrl` | string | 必填 | 数据访问/链接模式的根地址，或旧式瓦片地址。 | `/application/sources/groups/0/sources/linkModes/items/0/baseUrl`；第 453 行 |
| `default` | boolean | 必填 | 是否为该列表默认项；不是字段默认输入值。 | `/application/sources/groups/0/sources/linkModes/items/0/default`；第 454 行 |

<a id="t69"></a>

## t69 · ApplicationWorldGroups

首次入口：`$.application.sources`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `kind` | `"world-groups"` | 必填 | 分类路径第二级，或条件/控件的分支种类；依所在对象判读。 | `/application/sources/kind`；第 491 行 |
| `defaultGroupId` | string | 必填 | 没有显式世界绑定时使用的默认来源组 ID。 | `/application/sources/defaultGroupId`；第 399 行 |
| `sharedInterfaceGroupId` | string | 可选 | 审核/玩家等共享接口所属来源组的声明；当前不是多套后端切换器。 | `/application/sources/sharedInterfaceGroupId`；第 492 行 |
| `groups` | 数组<[ApplicationResourceGroup (t70)](#t70)> | 必填 | 来源组数组，或渲染条件命名组；由所在结构区分。 | `/application/sources/groups`；第 400 行 |
| `bindings` | [Record (t73)](#t73) | 必填 | 世界到来源组的映射，或绘制返回字段绑定数组。 | `/application/sources/bindings`；第 398 行 |

<a id="t70"></a>

## t70 · ApplicationResourceGroup

首次入口：`$.application.sources.groups[]`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `id` | string | 必填 | 当前对象的稳定标识；唯一性范围取决于对象类型。 | `/application/sources/groups/0/id`；第 404 行 |
| `label` | [ApplicationLabel (t53)](#t53) | 必填 | 名称对象或 Label 样式对象；必须结合所在路径解读。 | `/application/sources/groups/0/label`；第 405 行 |
| `enabled` | boolean | 必填 | 启用标记；false 不等于删除定义，具体作用范围取决于所在模块。 | `/application/sources/groups/0/enabled`；第 403 行 |
| `sources` | [ApplicationSourceSettings (t64)](#t64) | 必填 | 数据读取设置；新配置使用 world-groups 来源组形式。 | `/application/sources/groups/0/sources`；第 410 行 |
| `dataPathTemplate` | string | 必填 | 相对数据根地址的世界子路径模板；空字符串表示直接使用根。 | `/application/sources/groups/0/dataPathTemplate`；第 402 行 |
| `mediaPathTemplate` | string | 必填 | 相对媒体根地址的世界子路径模板；空字符串表示直接使用根。 | `/application/sources/groups/0/mediaPathTemplate`；第 409 行 |
| `tiles` | [ApplicationTileProfile (t71)](#t71) | 必填 | 瓦片来源设置；新配置通常位于来源组内。 | `/application/sources/groups/0/tiles`；第 480 行 |

<a id="t71"></a>

## t71 · ApplicationTileProfile

首次入口：`$.application.sources.groups[].tiles`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `baseUrlTemplate` | string | 必填 | 瓦片根地址模板，可用 {world} 代入远端世界标签。 | `/application/sources/groups/0/tiles/baseUrlTemplate`；第 485 行 |
| `filteredAccess` | `"direct"` / `"registered-proxy"` | 必填 | 瓦片使用直连或已注册代理。 | `/application/sources/groups/0/tiles/filteredAccess`；第 486 行 |
| `proxyId` | string | 可选 | 受控瓦片代理注册键；不能仅写新 ID 就创建服务器代理。 | `/application/sources/groups/0/tiles/proxyId`；第 487 行 |
| `legacyFilteredTemplate` | string | 可选 | 特殊旧瓦片代理模板的兼容保留值。 | 该分支在此候选中未使用 |
| `prefix` | string | 可选 | 世界 ID 组装前缀或瓦片文件前缀，二者含义不同。 | 该分支在此候选中未使用 |
| `imageFormat` | `"jpg"` / `"png"` / `"webp"` | 可选 | 瓦片图片格式 jpg/png/webp。 | 该分支在此候选中未使用 |
| `extraZoomLevels` | number | 可选 | 瓦片额外缩放级数；不改变逻辑 Zoom 的 0–8 范围。 | 该分支在此候选中未使用 |
| `minNativeZoom` | number | 可选 | 原生瓦片下限，采用映射后的 Leaflet Zoom。 | 该分支在此候选中未使用 |
| `maxNativeZoom` | number | 可选 | 原生瓦片上限，采用映射后的 Leaflet Zoom。 | 该分支在此候选中未使用 |
| `attribution` | [ApplicationAttribution (t72)](#t72) | 必填 | 瓦片署名对象；旧格式也可能是 HTML 文本。 | `/application/sources/groups/0/tiles/attribution`；第 481 行 |
| `maxRetries` | number | 可选 | 资源请求失败后的最大重试次数。 | 该分支在此候选中未使用 |
| `retryDelay` | number | 可选 | 重试间隔，单位毫秒。 | 该分支在此候选中未使用 |

<a id="t72"></a>

## t72 · ApplicationAttribution

首次入口：`$.application.sources.groups[].tiles.attribution`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `name` | string | 必填 | 候选名称、署名名称等人类可读文本；不是稳定 ID。 | `/application/sources/groups/0/tiles/attribution/name`；第 482 行 |
| `url` | string | 可选 | 外部链接地址。 | `/application/sources/groups/0/tiles/attribution/url`；第 483 行 |
| `legacyText` | string | 可选 | 旧署名文本的兼容保留值。 | 该分支在此候选中未使用 |

<a id="t73"></a>

## t73 · Record

首次入口：`$.application.sources.bindings`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| 可变字典键 | string | 依使用方 | 仅该字典允许可变键；不表示其他结构可任意添加键。 | — |

<a id="t74"></a>

## t74 · ApplicationModules

首次入口：`$.application.modules`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `items` | 数组<[$.application.modules.items[] (t75)](#t75)> | 必填 | 当前模块的项目数组；项目结构由所在类型说明。 | `/application/modules/items`；第 284 行 |
| `players` | [$.application.modules.players (t76)](#t76) | 必填 | 玩家位置接口与轮询设置。 | `/application/modules/players`；第 343 行 |

<a id="t75"></a>

## t75 · $.application.modules.items[]

首次入口：`$.application.modules.items[]`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `id` | `"mapping"` / `"measurement"` / `"navigation"` / `"search"` / `"review"` / `"players"` / `"settings"` / `"publicReleases"` | 必填 | 当前对象的稳定标识；唯一性范围取决于对象类型。 | `/application/modules/items/0/id`；第 291 行 |
| `enabled` | boolean | 必填 | 启用标记；false 不等于删除定义，具体作用范围取决于所在模块。 | `/application/modules/items/0/enabled`；第 286 行 |
| `load` | `"eager"` / `"lazy"` / `"preload"` | 必填 | 模块 eager/lazy/preload 加载方式。 | `/application/modules/items/0/load`；第 292 行 |
| `exclusiveWith` | 数组<`"mapping"` / `"measurement"` / `"navigation"` / `"search"` / `"review"` / `"players"` / `"settings"` / `"publicReleases"`> | 必填 | 与当前按钮/模块互斥的稳定 ID 列表。 | `/application/modules/items/0/exclusiveWith`；第 287 行 |

<a id="t76"></a>

## t76 · $.application.modules.players

首次入口：`$.application.modules.players`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `endpoint` | string | 必填 | 玩家位置的代理请求地址模板。 | `/application/modules/players/endpoint`；第 345 行 |
| `directEndpoint` | string | 必填 | 玩家位置的直连请求地址模板。 | `/application/modules/players/directEndpoint`；第 344 行 |
| `mode` | `"direct"` / `"proxy"` | 必填 | 当前联合结构的分支选择器；先看 mode，再解释其余字段。 | `/application/modules/players/mode`；第 346 行 |
| `pollIntervalMs` | number | 必填 | 轮询间隔，单位毫秒。 | `/application/modules/players/pollIntervalMs`；第 347 行 |
| `requestTimeoutMs` | number | 必填 | 单次请求超时，单位毫秒。 | `/application/modules/players/requestTimeoutMs`；第 348 行 |

<a id="t77"></a>

## t77 · ApplicationReview

首次入口：`$.application.review`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `enabled` | boolean | 必填 | 启用标记；false 不等于删除定义，具体作用范围取决于所在模块。 | `/application/review/enabled`；第 383 行 |
| `provider` | `"github-cookie"` | 必填 | 审核身份提供方式；当前受控 github-cookie。 | `/application/review/provider`；第 385 行 |
| `protocol` | `"openriamap-review-v1"` | 必填 | 审核传输协议标记。 | `/application/review/protocol`；第 384 行 |
| `auth` | [$.application.review.auth (t78)](#t78) | 必填 | 审核登录、会话查询与退出接口。 | `/application/review/auth`；第 377 行 |
| `control` | string | 必填 | 审核控制接口路径，或单个控件定义；结合路径区分。 | `/application/review/control`；第 382 行 |
| `workflow` | string | 必填 | 审核工作流接口路径，或旧继承策略标记。 | `/application/review/workflow`；第 394 行 |
| `publicReleases` | string | 必填 | 公开审核发布信息接口路径。 | `/application/review/publicReleases`；第 386 行 |
| `serverReferences` | [$.application.review.serverReferences (t79)](#t79) | 必填 | 服务器环境变量名称引用；不是对应密钥的实际值。 | `/application/review/serverReferences`；第 387 行 |

<a id="t78"></a>

## t78 · $.application.review.auth

首次入口：`$.application.review.auth`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `start` | string | 必填 | 启动身份登录的接口路径。 | `/application/review/auth/start`；第 380 行 |
| `session` | string | 必填 | 查询当前会话的接口路径。 | `/application/review/auth/session`；第 379 行 |
| `logout` | string | 必填 | 退出身份会话的接口路径。 | `/application/review/auth/logout`；第 378 行 |

<a id="t79"></a>

## t79 · $.application.review.serverReferences

首次入口：`$.application.review.serverReferences`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `oauthClientId` | string | 必填 | OAuth 客户端 ID 所用的服务器环境变量名。 | `/application/review/serverReferences/oauthClientId`；第 390 行 |
| `oauthRedirectUri` | string | 必填 | OAuth 回跳地址所用的服务器环境变量名。 | `/application/review/serverReferences/oauthRedirectUri`；第 391 行 |
| `sessionSigning` | string | 必填 | 会话签名密钥所用的服务器环境变量名。 | `/application/review/serverReferences/sessionSigning`；第 392 行 |
| `controlApiBase` | string | 必填 | 控制 API 根地址所用的服务器环境变量名。 | `/application/review/serverReferences/controlApiBase`；第 389 行 |
| `brokerSecret` | string | 必填 | 代理调度共享密钥所用的服务器环境变量名。 | `/application/review/serverReferences/brokerSecret`；第 388 行 |

<a id="t80"></a>

## t80 · ApplicationPreferences

首次入口：`$.application.preferences`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `language` | `"zh"` / `"en"` | 必填 | 默认界面语言。 | `/application/preferences/language`；第 352 行 |
| `search` | [$.application.preferences.search (t81)](#t81) | 必填 | 分类搜索规则、工作流搜索控件参数或应用搜索偏好。 | `/application/preferences/search`；第 366 行 |
| `navigation` | [$.application.preferences.navigation (t82)](#t82) | 必填 | 路径规划全局参数。 | `/application/preferences/navigation`；第 360 行 |
| `map` | [$.application.preferences.map (t83)](#t83) | 必填 | 地图交互与逻辑 Zoom 映射设置。 | `/application/preferences/map`；第 353 行 |
| `toolbar` | [$.application.preferences.toolbar (t84)](#t84) | 必填 | 工具栏布局偏好。 | `/application/preferences/toolbar`；第 371 行 |

<a id="t81"></a>

## t81 · $.application.preferences.search

首次入口：`$.application.preferences.search`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `homepageLimit` | number | 必填 | 主页搜索结果数量上限。 | `/application/preferences/search/homepageLimit`；第 368 行 |
| `navigationLimit` | number | 必填 | 导航搜索结果数量上限。 | `/application/preferences/search/navigationLimit`；第 369 行 |
| `debounceMs` | number | 必填 | 搜索输入防抖延迟，单位毫秒。 | `/application/preferences/search/debounceMs`；第 367 行 |

<a id="t82"></a>

## t82 · $.application.preferences.navigation

首次入口：`$.application.preferences.navigation`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `transferWalkSpeed` | number | 必填 | 换乘步行速度的默认数值。 | `/application/preferences/navigation/transferWalkSpeed`；第 364 行 |
| `railRideSpeed` | number | 必填 | 铁路乘坐速度的默认数值。 | `/application/preferences/navigation/railRideSpeed`；第 362 行 |
| `transferCostFactor` | number | 必填 | 换乘成本的全局倍率。 | `/application/preferences/navigation/transferCostFactor`；第 363 行 |
| `normalPlatformTransferCost` | number | 必填 | 普通站台换乘的基础成本。 | `/application/preferences/navigation/normalPlatformTransferCost`；第 361 行 |

<a id="t83"></a>

## t83 · $.application.preferences.map

首次入口：`$.application.preferences.map`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `logicalInitialZoom` | number | 必填 | 初次进入地图的逻辑 Zoom，范围 0–8。 | `/application/preferences/map/logicalInitialZoom`；第 357 行 |
| `leafletOffset` | number | 必填 | 逻辑 Zoom 到 Leaflet Zoom 的偏移；Leaflet = 逻辑 + 偏移。 | `/application/preferences/map/leafletOffset`；第 356 行 |
| `scrollWheelZoom` | boolean | 必填 | 是否启用滚轮缩放。 | `/application/preferences/map/scrollWheelZoom`；第 358 行 |
| `doubleClickZoom` | boolean | 必填 | 是否启用地图双击缩放。 | `/application/preferences/map/doubleClickZoom`；第 354 行 |
| `dragging` | boolean | 必填 | 是否启用地图拖动。 | `/application/preferences/map/dragging`；第 355 行 |

<a id="t84"></a>

## t84 · $.application.preferences.toolbar

首次入口：`$.application.preferences.toolbar`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `position` | `"left"` / `"right"` | 必填 | 工具栏显示在左侧或右侧。 | `/application/preferences/toolbar/position`；第 373 行 |
| `compact` | boolean | 必填 | 是否使用紧凑工具栏外观。 | `/application/preferences/toolbar/compact`；第 372 行 |

<a id="t85"></a>

## t85 · $.resources

首次入口：`$.resources`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `iconLibraries` | 数组<[$.resources.iconLibraries[] (t86)](#t86)> | 必填 | 本包所需图库的固定版本和清单摘要；Pinhead v25，不允许浮动 latest。 | `/resources/iconLibraries`；第 109503 行 |

<a id="t86"></a>

## t86 · $.resources.iconLibraries[]

首次入口：`$.resources.iconLibraries[]`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `library` | `"pinhead"` | 必填 | 图库标识；本版仅 pinhead。 | `/resources/iconLibraries/0/library`；第 109505 行 |
| `version` | string | 必填 | 受控外部方案版本。 | `/resources/iconLibraries/0/version`；第 109507 行 |
| `manifestSha256` | string | 必填 | 固定资源清单 SHA-256；必须匹配随 Web 发布的能力。 | `/resources/iconLibraries/0/manifestSha256`；第 109506 行 |

<a id="t87"></a>

## t87 · CategoryNode

首次入口：`$.nodes[]`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `nodeId` | string | 必填 | 分类节点稳定 ID；children 与字段引用通过它定位。 | `/nodes/0/nodeId`；第 2414 行 |
| `path` | [ClassificationPath (t16)](#t16) | 必填 | 完整且连续的分类路径；决定节点实际所在层级。 | `/nodes/0/path`；第 2415 行 |
| `classificationLabels` | [Partial (t88)](#t88) | 可选 | 各已填写分类层级的中英文名称。 | `/nodes/0/classificationLabels`；第 1427 行 |
| `children` | 数组<string> | 必填 | 直接子节点 nodeId 列表；必须与实际 path 父子关系一致。 | `/nodes/0/children`；第 1423 行 |
| `inheritDown` | [InheritanceControls (t89)](#t89) | 可选 | 向后代传递字段、显示和信息卡设置的三个开关。 | `/nodes/0/inheritDown`；第 2068 行 |
| `receiveFromParent` | [$.nodes[].receiveFromParent (t90)](#t90) | 可选 | 当前节点是否接收父级模块；不能用它屏蔽硬继承字段。 | 该分支在此候选中未使用 |
| `policies` | [$.nodes[].policies (t91)](#t91) | 可选 | 旧版继承策略；当前解析优先使用 inheritDown。 | `/nodes/0/policies`；第 2418 行 |
| `fields` | 数组<[FieldDefinition (t92)](#t92)> | 必填 | 字段定义数组、字段条件组或继承字段开关；先看当前类型。 | `/nodes/0/fields`；第 1454 行 |
| `fieldSettings` | [NodeFieldSettings (t102)](#t102) | 可选 | 随字段设计传递的主附属身份与搜索规则。 | `/nodes/0/fieldSettings`；第 1433 行 |
| `geometryType` | `"Point"` / `"LineString"` / `"Polygon"` | 可选 | 当前分类选定的唯一几何类型。 | `/nodes/0/geometryType`；第 2067 行 |
| `geometryProfiles` | [Partial (t109)](#t109) | 必填 | 按 Point/LineString/Polygon 索引的几何能力与显示规则。 | `/nodes/0/geometryProfiles`；第 1654 行 |
| `containment` | [ContainmentBinding (t161)](#t161) | 可选 | 旧版分类内包含关系；现代配置使用 fieldSettings.structure。 | 该分支在此候选中未使用 |
| `card` | [$.nodes[].card (t162)](#t162) / [$.nodes[].card (t169)](#t169) / [$.nodes[].card (t170)](#t170) | 可选 | 信息卡定义、继承开关或旧继承模式。 | `/nodes/0/card`；第 1112 行 |
| `legacy` | [$.nodes[].legacy (t171)](#t171) | 可选 | 迁移来源及兼容元数据，不应作为新功能的主要入口。 | `/nodes/0/legacy`；第 2073 行 |

<a id="t88"></a>

## t88 · Partial

首次入口：`$.nodes[].classificationLabels`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `class` | [LocalizedText (t1)](#t1) | 可选 | 分类路径第一级 Class；此处键名小写，实际要素记录使用 Class。 | `/nodes/0/classificationLabels/class`；第 1428 行 |
| `kind` | [LocalizedText (t1)](#t1) | 可选 | 分类路径第二级，或条件/控件的分支种类；依所在对象判读。 | `/nodes/1/classificationLabels/kind`；第 2711 行 |
| `skind` | [LocalizedText (t1)](#t1) | 可选 | 分类路径第三级；实际新要素记录使用 SKind。 | `/nodes/3/classificationLabels/skind`；第 4839 行 |
| `skind2` | [LocalizedText (t1)](#t1) | 可选 | 分类路径第四级；实际新要素记录使用 SKind2。 | `/nodes/18/classificationLabels/skind2`；第 20549 行 |

<a id="t89"></a>

## t89 · InheritanceControls

首次入口：`$.nodes[].inheritDown`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `fields` | boolean | 必填 | 字段定义数组、字段条件组或继承字段开关；先看当前类型。 | `/nodes/0/inheritDown/fields`；第 2071 行 |
| `display` | boolean | 必填 | 向下传递显示配置的开关或旧继承模式。 | `/nodes/0/inheritDown/display`；第 2070 行 |
| `card` | boolean | 必填 | 信息卡定义、继承开关或旧继承模式。 | `/nodes/0/inheritDown/card`；第 2069 行 |

<a id="t90"></a>

## t90 · $.nodes[].receiveFromParent

首次入口：`$.nodes[].receiveFromParent`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `fields` | `false` / `true` | 可选 | 字段定义数组、字段条件组或继承字段开关；先看当前类型。 | 该分支在此候选中未使用 |
| `geometry` | `false` / `true` | 可选 | 当前绘制的几何类型、几何输入继承选项或输出几何设置。 | 该分支在此候选中未使用 |
| `display` | `false` / `true` | 可选 | 向下传递显示配置的开关或旧继承模式。 | 该分支在此候选中未使用 |
| `card` | `false` / `true` | 可选 | 信息卡定义、继承开关或旧继承模式。 | 该分支在此候选中未使用 |

<a id="t91"></a>

## t91 · $.nodes[].policies

首次入口：`$.nodes[].policies`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `fields` | `"sealed"` / `"overridable"` / `"localOnly"` | 必填 | 字段定义数组、字段条件组或继承字段开关；先看当前类型。 | `/nodes/0/policies/fields`；第 2421 行 |
| `display` | `"sealed"` / `"overridable"` / `"localOnly"` | 必填 | 向下传递显示配置的开关或旧继承模式。 | `/nodes/0/policies/display`；第 2420 行 |
| `card` | `"sealed"` / `"overridable"` / `"localOnly"` | 必填 | 信息卡定义、继承开关或旧继承模式。 | `/nodes/0/policies/card`；第 2419 行 |
| `workflow` | `"sealed"` / `"overridable"` / `"localOnly"` | 可选 | 审核工作流接口路径，或旧继承策略标记。 | `/nodes/0/policies/workflow`；第 2422 行 |

<a id="t92"></a>

## t92 · FieldDefinition

首次入口：`$.nodes[].fields[]`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `fieldId` | string | 必填 | 字段稳定身份；同一有效分类内不同 key 不得共用它。 | `/nodes/0/fields/0/fieldId`；第 1461 行 |
| `key` | string | 必填 | 真实数据字段路径或重复组成员键；不等于 fieldId。 | `/nodes/0/fields/0/key`；第 1463 行 |
| `scope` | `"root"` / `"tags"` / `"extensions"` | 可选 | 字段根/标签/扩展分组，或编辑工作流适用范围等。 | `/nodes/0/fields/4/scope`；第 1564 行 |
| `type` | `"string"` / `"number"` / `"boolean"` / `"enum"` / `"json"` / `"reference"` | 必填 | 数据类型，或受控组件选项的输入类型。 | `/nodes/0/fields/0/type`；第 1476 行 |
| `cardinality` | `"single"` / `"multiple"` | 必填 | 字段值数量：single 单值，multiple 数组多值。 | `/nodes/0/fields/0/cardinality`；第 1456 行 |
| `input` | `"text"` / `"select"` / `"json"` / `"textarea"` / `"toggle"` / `"featureSearch"` | 必填 | 字段定义建议的输入方式；实际工作流控件仍有自身配置。 | `/nodes/0/fields/0/input`；第 1462 行 |
| `required` | `false` / `true` | 可选 | 是否必填；系统 World 设置中固定为 true，其他位置按控件或字段解释。 | `/nodes/0/fields/0/required`；第 1468 行 |
| `validateExistingData` | `false` / `true` | 可选 | 是否将该字段约束用于已挂载的历史记录。 | `/nodes/0/fields/0/validateExistingData`；第 1477 行 |
| `requiredWhen` | 数组<[$.nodes[].fields[].requiredWhen[] (t93)](#t93) / [$.nodes[].fields[].requiredWhen[] (t94)](#t94) / [$.nodes[].fields[].requiredWhen[] (t95)](#t95) / [$.nodes[].fields[].requiredWhen[] (t96)](#t96) / [$.nodes[].fields[].requiredWhen[] (t97)](#t97) / [$.nodes[].fields[].requiredWhen[] (t98)](#t98)> | 可选 | 条件必填规则；字段和工作流使用不同的条件结构。 | `/nodes/80/fields/7/requiredWhen`；第 95275 行 |
| `labels` | [LocalizedText (t1)](#t1) | 必填 | 字段或分类的人类可读中英文标题。 | `/nodes/0/fields/0/labels`；第 1464 行 |
| `description` | [LocalizedText (t1)](#t1) | 必填 | 字段中英文说明。 | `/nodes/0/fields/0/description`；第 1457 行 |
| `options` | 数组<[SelectOption (t42)](#t42)> | 可选 | 控件本地选项数组、组件设置对象等；不能跨对象套用。 | 该分支在此候选中未使用 |
| `optionsTableId` | string | 可选 | 实时引用公共表 lookupTables[].id，不保存独立可编辑副本。 | 该分支在此候选中未使用 |
| `optionTable` | [OptionTable (t48)](#t48) | 可选 | 当前模块本地对照表；含 valueType 和 rows。 | `/nodes/65/fields/4/optionTable`；第 71160 行 |
| `optionValueType` | `"string"` / `"number"` / `"boolean"` | 可选 | 选项保存为文本、数字或布尔值；value 文本会按此解释。 | `/nodes/65/fields/4/optionValueType`；第 71221 行 |
| `format` | `"boolean"` / `"plain"` / `"externalLink"` / `"date"` / `"json"` | 可选 | 字段/显示格式；只允许当前类型枚举中的受控格式。 | 该分支在此候选中未使用 |
| `coordinateFormat` | `"coordP"` / `"pointObject"` / `"coordL"` / `"coordG"` | 可选 | JSON 字段声明的坐标结构，供绘制绑定及类型核验。 | `/nodes/80/fields/15/coordinateFormat`；第 95411 行 |
| `optionSource` | [$.nodes[].fields[].optionSource (t99)](#t99) | 可选 | 旧 optionSets 的来源引用，原生 r8+ 不作为新公共表入口。 | 该分支在此候选中未使用 |
| `placeholder` | string | 可选 | 输入提示文字；不等于默认值，也不写入记录。 | 该分支在此候选中未使用 |
| `defaultValue` | JSON | 可选 | 初始输入值；类型须与字段或控件格式相容。 | 该分支在此候选中未使用 |
| `emptyValue` | `"omit"` / `"preserve"` | 可选 | 字段空值保留或省略的声明。 | `/nodes/80/fields/1/emptyValue`；第 95123 行 |
| `sourceRuntimeField` | string | 可选 | 旧运行时字段映射提示。 | `/nodes/0/fields/0/sourceRuntimeField`；第 1475 行 |
| `scenes` | [$.nodes[].fields[].scenes (t100)](#t100) | 可选 | 该字段的工作流、编辑、信息卡和搜索使用场景声明。 | `/nodes/0/fields/0/scenes`；第 1469 行 |
| `reference` | [$.nodes[].fields[].reference (t101)](#t101) | 可选 | 字段的关联记录查找声明。 | 该分支在此候选中未使用 |
| `overrideOf` | string | 可选 | 明确替代继承字段时所对应的原字段 key。 | 该分支在此候选中未使用 |
| `inheritance` | `"sealed"` / `"overridable"` / `"localOnly"` | 可选 | 字段 localOnly/overridable/sealed 模式，或搜索规则继承模式。 | 该分支在此候选中未使用 |

<a id="t93"></a>

## t93 · $.nodes[].fields[].requiredWhen[]

首次入口：`$.nodes[].fields[].requiredWhen[]`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `kind` | `"always"` | 必填 | 分类路径第二级，或条件/控件的分支种类；依所在对象判读。 | 该分支在此候选中未使用 |

<a id="t94"></a>

## t94 · $.nodes[].fields[].requiredWhen[]

首次入口：`$.nodes[].fields[].requiredWhen[]`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `kind` | `"zoomRange"` | 必填 | 分类路径第二级，或条件/控件的分支种类；依所在对象判读。 | 该分支在此候选中未使用 |
| `min` | number | 可选 | 当前数值区间下限；单位取决于所在规则/指标。 | 该分支在此候选中未使用 |
| `max` | number | 可选 | 当前数值区间上限；单位取决于所在规则/指标。 | 该分支在此候选中未使用 |

<a id="t95"></a>

## t95 · $.nodes[].fields[].requiredWhen[]

首次入口：`$.nodes[].fields[].requiredWhen[]`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `kind` | `"bboxArea"` | 必填 | 分类路径第二级，或条件/控件的分支种类；依所在对象判读。 | 该分支在此候选中未使用 |
| `min` | number | 可选 | 当前数值区间下限；单位取决于所在规则/指标。 | 该分支在此候选中未使用 |
| `max` | number | 可选 | 当前数值区间上限；单位取决于所在规则/指标。 | 该分支在此候选中未使用 |
| `scope` | `"part"` / `"feature"` | 必填 | 字段根/标签/扩展分组，或编辑工作流适用范围等。 | 该分支在此候选中未使用 |

<a id="t96"></a>

## t96 · $.nodes[].fields[].requiredWhen[]

首次入口：`$.nodes[].fields[].requiredWhen[]`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `kind` | `"fieldEquals"` | 必填 | 分类路径第二级，或条件/控件的分支种类；依所在对象判读。 | `/nodes/64/geometryProfiles/Point/zoomPriority/rules/2/when/fields/formula/terms/0/condition/kind`；第 70298 行 |
| `field` | string | 必填 | 所引用的数据字段路径；不同位置的可用字段集由对应分类限定。 | `/nodes/64/geometryProfiles/Point/zoomPriority/rules/2/when/fields/formula/terms/0/condition/field`；第 70297 行 |
| `value` | string | 必填 | 最终存储值、条件比较值或常量；是否字符串须看当前类型声明。 | `/nodes/64/geometryProfiles/Point/zoomPriority/rules/2/when/fields/formula/terms/0/condition/value`；第 70299 行 |

<a id="t97"></a>

## t97 · $.nodes[].fields[].requiredWhen[]

首次入口：`$.nodes[].fields[].requiredWhen[]`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `kind` | `"fieldIn"` | 必填 | 分类路径第二级，或条件/控件的分支种类；依所在对象判读。 | `/nodes/65/geometryProfiles/LineString/zoomPriority/rules/6/when/fields/formula/terms/0/condition/kind`；第 72701 行 |
| `field` | string | 必填 | 所引用的数据字段路径；不同位置的可用字段集由对应分类限定。 | `/nodes/65/geometryProfiles/LineString/zoomPriority/rules/6/when/fields/formula/terms/0/condition/field`；第 72700 行 |
| `values` | 数组<string> | 必填 | 条件允许的比较值集合；严格比较时类型也须匹配。 | `/nodes/65/geometryProfiles/LineString/zoomPriority/rules/6/when/fields/formula/terms/0/condition/values`；第 72702 行 |

<a id="t98"></a>

## t98 · $.nodes[].fields[].requiredWhen[]

首次入口：`$.nodes[].fields[].requiredWhen[]`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `kind` | `"fieldPresent"` | 必填 | 分类路径第二级，或条件/控件的分支种类；依所在对象判读。 | `/nodes/80/fields/7/requiredWhen/0/kind`；第 95278 行 |
| `field` | string | 必填 | 所引用的数据字段路径；不同位置的可用字段集由对应分类限定。 | `/nodes/80/fields/7/requiredWhen/0/field`；第 95277 行 |
| `present` | boolean | 必填 | 是否要求该字段具有有效值；0/false 不是空值。 | `/nodes/80/fields/7/requiredWhen/0/present`；第 95279 行 |

<a id="t99"></a>

## t99 · $.nodes[].fields[].optionSource

首次入口：`$.nodes[].fields[].optionSource`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `registryKey` | string | 必填 | 旧登记表中的稳定选项 ID。 | 该分支在此候选中未使用 |
| `runtimeField` | string | 可选 | 旧运行时字段提示。 | 该分支在此候选中未使用 |

<a id="t100"></a>

## t100 · $.nodes[].fields[].scenes

首次入口：`$.nodes[].fields[].scenes`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `workflow` | `false` / `true` | 可选 | 审核工作流接口路径，或旧继承策略标记。 | `/nodes/0/fields/0/scenes/workflow`；第 1473 行 |
| `editor` | `false` / `true` | 可选 | 工作流式编辑方案设置，或字段是否可在编辑场景使用。 | `/nodes/0/fields/0/scenes/editor`；第 1470 行 |
| `infocard` | `false` / `true` | 可选 | 字段是否面向信息卡场景。 | `/nodes/0/fields/0/scenes/infocard`；第 1471 行 |
| `search` | `false` / `true` | 可选 | 分类搜索规则、工作流搜索控件参数或应用搜索偏好。 | `/nodes/0/fields/0/scenes/search`；第 1472 行 |

<a id="t101"></a>

## t101 · $.nodes[].fields[].reference

首次入口：`$.nodes[].fields[].reference`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `classCode` | string | 必填 | 旧式 Class 过滤列表或字段引用的 Class 目标；先看所属结构。 | 该分支在此候选中未使用 |
| `matchField` | string | 必填 | 外部记录用于匹配的字段。 | 该分支在此候选中未使用 |
| `displayField` | string | 可选 | 关联目标用于展示的字段。 | 该分支在此候选中未使用 |

<a id="t102"></a>

## t102 · NodeFieldSettings

首次入口：`$.nodes[].fieldSettings`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `structure` | [StructureRole (t103)](#t103) | 可选 | 通用主结构/附属结构身份，不限定对方 Class。 | `/nodes/0/fieldSettings/structure`；第 1449 行 |
| `search` | [CategorySearch (t104)](#t104) | 可选 | 分类搜索规则、工作流搜索控件参数或应用搜索偏好。 | `/nodes/0/fieldSettings/search`；第 1434 行 |

<a id="t103"></a>

## t103 · StructureRole

首次入口：`$.nodes[].fieldSettings.structure`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `enabled` | boolean | 必填 | 启用标记；false 不等于删除定义，具体作用范围取决于所在模块。 | `/nodes/0/fieldSettings/structure/enabled`；第 1450 行 |
| `role` | `"main"` / `"member"` | 必填 | 结构身份或 Label 碰撞角色；二者是不同概念。 | `/nodes/0/fieldSettings/structure/role`；第 1451 行 |
| `memberField` | string | 可选 | 主结构中可选的附属成员 ID 反向引用字段。 | `/nodes/78/fieldSettings/structure/memberField`；第 92799 行 |
| `hostField` | string | 可选 | 附属结构中指向主结构 ID 的必填字段。 | `/nodes/5/fieldSettings/structure/hostField`；第 7106 行 |
| `selectorField` | string | 可选 | 附属结构用于层级/楼层切换的必填字段。 | `/nodes/5/fieldSettings/structure/selectorField`；第 7108 行 |
| `visibility` | `"activeLevel"` / `"allMembers"` | 可选 | 关系可见性扩展，或附属结构显示策略。 | `/nodes/5/fieldSettings/structure/visibility`；第 7109 行 |

<a id="t104"></a>

## t104 · CategorySearch

首次入口：`$.nodes[].fieldSettings.search`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `enabled` | boolean | 必填 | 启用标记；false 不等于删除定义，具体作用范围取决于所在模块。 | `/nodes/0/fieldSettings/search/enabled`；第 1435 行 |
| `inheritance` | `"sealed"` / `"overridable"` | 可选 | 字段 localOnly/overridable/sealed 模式，或搜索规则继承模式。 | 该分支在此候选中未使用 |
| `queryFields` | 数组<string> | 必填 | 可被主页/导航粗搜索匹配的字段路径列表。 | `/nodes/0/fieldSettings/search/queryFields`；第 1440 行 |
| `priority` | number | 可选 | 搜索排序值或渲染显示权重对象；按所在结构区分。 | `/nodes/0/fieldSettings/search/priority`；第 1439 行 |
| `subtitle` | [$.nodes[].fieldSettings.search.subtitle (t105)](#t105) | 必填 | 搜索结果副标题设置，或工作流页面副标题。 | `/nodes/0/fieldSettings/search/subtitle`；第 1445 行 |
| `extension` | [$.nodes[].fieldSettings.search.extension (t108)](#t108) | 必填 | 搜索结果延伸区域的胶囊显示设置。 | `/nodes/0/fieldSettings/search/extension`；第 1436 行 |

<a id="t105"></a>

## t105 · $.nodes[].fieldSettings.search.subtitle

首次入口：`$.nodes[].fieldSettings.search.subtitle`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `mode` | `"field"` / `"classification"` / `"classificationField"` | 必填 | 当前联合结构的分支选择器；先看 mode，再解释其余字段。 | `/nodes/0/fieldSettings/search/subtitle/mode`；第 1446 行 |
| `classificationLabel` | [LocalizedText (t1)](#t1) | 可选 | 搜索副标题当前分类的显示名覆写。 | `/nodes/63/fieldSettings/search/subtitle/classificationLabel`；第 68829 行 |
| `fallbackClassificationLabel` | [LocalizedText (t1)](#t1) | 可选 | 搜索副标题备用分类显示名。 | `/nodes/5/fieldSettings/search/subtitle/fallbackClassificationLabel`；第 7094 行 |
| `field` | string | 可选 | 所引用的数据字段路径；不同位置的可用字段集由对应分类限定。 | `/nodes/5/fieldSettings/search/subtitle/field`；第 7098 行 |
| `valueMode` | `"reference"` / `"value"` / `"meaning"` | 可选 | 原值、意义对照或外部引用显示模式；不同模块枚举不同。 | `/nodes/5/fieldSettings/search/subtitle/valueMode`；第 7101 行 |
| `referenceDisplayField` | string | 可选 | 字段值为目标 ID 时，从目标记录读取的展示字段，常用 Name。 | `/nodes/5/fieldSettings/search/subtitle/referenceDisplayField`；第 7100 行 |
| `valueOptions` | 数组<[SelectOption (t42)](#t42)> | 可选 | 搜索副标题或旧信息卡本地意义对照行。 | 该分支在此候选中未使用 |
| `prefillAudit` | [PrefillAudit (t106)](#t106) | 可选 | 预填来源的审计指纹；只用于提醒陈旧，不建立运行时绑定。 | 该分支在此候选中未使用 |

<a id="t106"></a>

## t106 · PrefillAudit

首次入口：`$.nodes[].fieldSettings.search.subtitle.prefillAudit`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `source` | [$.nodes[].fieldSettings.search.subtitle.prefillAudit.source (t107)](#t107) | 必填 | 单次预填时的来源分类/字段审计记录，只提醒内容变化，不建立实时引用。 | `/nodes/0/card/items/1/prefillAudit/source`；第 1137 行 |
| `fingerprint` | string | 必填 | 预填/来源内容的摘要，用于发现修改。 | `/nodes/0/card/items/1/prefillAudit/fingerprint`；第 1136 行 |
| `confirmedFingerprint` | string | 可选 | 用户已确认的来源摘要。 | 该分支在此候选中未使用 |

<a id="t107"></a>

## t107 · $.nodes[].fieldSettings.search.subtitle.prefillAudit.source

首次入口：`$.nodes[].fieldSettings.search.subtitle.prefillAudit.source`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `path` | [ClassificationPath (t16)](#t16) | 必填 | 完整且连续的分类路径；决定节点实际所在层级。 | `/nodes/0/card/items/1/prefillAudit/source/path`；第 1140 行 |
| `fieldId` | string | 必填 | 字段稳定身份；同一有效分类内不同 key 不得共用它。 | `/nodes/0/card/items/1/prefillAudit/source/fieldId`；第 1138 行 |
| `key` | string | 必填 | 真实数据字段路径或重复组成员键；不等于 fieldId。 | `/nodes/0/card/items/1/prefillAudit/source/key`；第 1139 行 |

<a id="t108"></a>

## t108 · $.nodes[].fieldSettings.search.extension

首次入口：`$.nodes[].fieldSettings.search.extension`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `mode` | `"none"` / `"nameColorCapsule"` / `"lineChips"` | 必填 | 当前联合结构的分支选择器；先看 mode，再解释其余字段。 | `/nodes/0/fieldSettings/search/extension/mode`；第 1437 行 |
| `nameField` | string | 可选 | 当前记录中提供胶囊名称的字段。 | `/nodes/65/fieldSettings/search/extension/nameField`；第 71037 行 |
| `displayName` | `false` / `true` | 可选 | 是否显示胶囊名称；这里是布尔值，不是整包 displayName 的中英文对象。 | `/nodes/65/fieldSettings/search/extension/displayName`；第 71034 行 |
| `colorField` | string | 可选 | 当前记录中提供胶囊颜色的字段。 | `/nodes/65/fieldSettings/search/extension/colorField`；第 71033 行 |
| `fallbackColor` | string | 可选 | 主颜色来源无效时使用的回退颜色。 | `/nodes/65/fieldSettings/search/extension/fallbackColor`；第 71035 行 |
| `lineChipSource` | `"platform"` / `"station"` / `"stationBuilding"` | 可选 | 关联线路胶囊索引入口：站台、站场或车站建筑。 | `/nodes/63/fieldSettings/search/extension/lineChipSource`；第 68819 行 |

<a id="t109"></a>

## t109 · Partial

首次入口：`$.nodes[].geometryProfiles`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `Point` | [GeometryProfile (t110)](#t110) | 可选 | 点几何配置键；与 LineString、Polygon 区分。 | `/nodes/52/geometryProfiles/Point`；第 58588 行 |
| `LineString` | [GeometryProfile (t110)](#t110) | 可选 | 线几何配置键；最终记录可具有多个线部件。 | `/nodes/39/geometryProfiles/LineString`；第 47354 行 |
| `Polygon` | [GeometryProfile (t110)](#t110) | 可选 | 面几何配置键；外部件与部件内孔环是两个层级。 | `/nodes/0/geometryProfiles/Polygon`；第 1655 行 |

<a id="t110"></a>

## t110 · GeometryProfile

首次入口：`$.nodes[].geometryProfiles.Point`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `renderState` | `"enabled"` / `"unconfigured"` | 可选 | 显示是否已配置；unconfigured 与禁用几何能力不同。 | 该分支在此候选中未使用 |
| `enabled` | boolean | 必填 | 启用标记；false 不等于删除定义，具体作用范围取决于所在模块。 | `/nodes/0/geometryProfiles/Polygon/enabled`；第 1658 行 |
| `allowMultipleParts` | boolean | 必填 | 该分类几何是否接受多部件；当前入口即时禁用尚有已知缺口，保存检查仍有效。 | `/nodes/0/geometryProfiles/Polygon/allowMultipleParts`；第 1656 行 |
| `anchor` | `"perPart"` / `"featureBbox"` | 可选 | 多部件锚点模式，或规则内详细锚点设置；先看它是字符串还是对象。 | `/nodes/0/geometryProfiles/Polygon/anchor`；第 1657 行 |
| `color` | string | 可选 | 固定颜色文本；可用颜色语法仍须通过实际核验。 | 该分支在此候选中未使用 |
| `style` | [$.nodes[].geometryProfiles.Point.style (t111)](#t111) | 可选 | 当前规则的几何外观，或 Label 的字体族/字号等样式。 | 该分支在此候选中未使用 |
| `geometryStack` | [GeometryStackPolicy (t112)](#t112) | 可选 | 真实几何的绘制层级 A，与碰撞 B 和显示权重 C 分开。 | 该分支在此候选中未使用 |
| `label` | [$.nodes[].geometryProfiles.Point.label (t113)](#t113) | 可选 | 名称对象或 Label 样式对象；必须结合所在路径解读。 | 该分支在此候选中未使用 |
| `zoomPriority` | [$.nodes[].geometryProfiles.Point.zoomPriority (t116)](#t116) | 必填 | 该几何的 Zoom 显示规则容器，核心成员为 rules。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority`；第 1668 行 |
| `interaction` | [$.nodes[].geometryProfiles.Point.interaction (t159)](#t159) | 可选 | 本几何的命中触发器，或规则内交互外观覆盖。 | `/nodes/0/geometryProfiles/Polygon/interaction`；第 1659 行 |
| `legacyDisplay` | [$.nodes[].geometryProfiles.Point.legacyDisplay (t160)](#t160) | 可选 | 迁移用的旧显示来源索引。 | 该分支在此候选中未使用 |

<a id="t111"></a>

## t111 · $.nodes[].geometryProfiles.Point.style

首次入口：`$.nodes[].geometryProfiles.Point.style`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `weight` | number | 可选 | 几何描边宽度，单位屏幕像素。 | 该分支在此候选中未使用 |
| `fillOpacity` | number | 可选 | 填充不透明度，0 为透明，1 为不透明。 | 该分支在此候选中未使用 |
| `opacity` | number | 可选 | 整体或局部不透明度；通常 0–1。 | 该分支在此候选中未使用 |
| `dashArray` | string | 可选 | 旧版自定义虚线长度字符串。 | 该分支在此候选中未使用 |

<a id="t112"></a>

## t112 · GeometryStackPolicy

首次入口：`$.nodes[].geometryProfiles.Point.geometryStack`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `zLevel` | number | 必填 | 真实几何的基础绘制层级。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/geometryStack/zLevel`；第 1739 行 |
| `pane` | string | 可选 | 绘制 pane；控制真实绘制层级，不能代替碰撞分数。 | 该分支在此候选中未使用 |
| `zIndexOffset` | number | 可选 | 在基础图层顺序上叠加的偏移量；不等于 Label 碰撞优先级。 | 该分支在此候选中未使用 |

<a id="t113"></a>

## t113 · $.nodes[].geometryProfiles.Point.label

首次入口：`$.nodes[].geometryProfiles.Point.label`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `visible` | boolean | 必填 | 是否显示该 Label 或信息卡单元。 | 该分支在此候选中未使用 |
| `anchor` | `"perPart"` / `"featureBbox"` | 必填 | 多部件锚点模式，或规则内详细锚点设置；先看它是字符串还是对象。 | 该分支在此候选中未使用 |
| `conditions` | 数组<[$.nodes[].fields[].requiredWhen[] (t93)](#t93) / [$.nodes[].fields[].requiredWhen[] (t94)](#t94) / [$.nodes[].fields[].requiredWhen[] (t95)](#t95) / [$.nodes[].fields[].requiredWhen[] (t96)](#t96) / [$.nodes[].fields[].requiredWhen[] (t97)](#t97) / [$.nodes[].fields[].requiredWhen[] (t98)](#t98)> | 必填 | 旧式条件数组；当前规则通常使用 when。 | 该分支在此候选中未使用 |
| `collision` | [LabelCollisionPolicy (t114)](#t114) | 必填 | Label 碰撞角色或详细碰撞扩展；不控制真实几何层级。 | 该分支在此候选中未使用 |

<a id="t114"></a>

## t114 · LabelCollisionPolicy

首次入口：`$.nodes[].geometryProfiles.Point.label.collision`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `role` | `"ignore"` / `"soft"` / `"optional"` / `"important"` / `"required"` | 必填 | 结构身份或 Label 碰撞角色；二者是不同概念。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/label/collision/role`；第 1747 行 |
| `basePriority` | number | 必填 | Label 碰撞基础分数，不等于图层 zLevel。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/label/collision/basePriority`；第 1744 行 |
| `collisionGroup` | string | 可选 | Label 参与碰撞的逻辑分组名称。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/label/collision/collisionGroup`；第 1745 行 |
| `hideWhenColliding` | boolean | 必填 | 碰撞时是否隐藏该 Label。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/label/collision/hideWhenColliding`；第 1746 行 |
| `densityLimit` | number | 可选 | 旧式碰撞密度限制参数。 | 该分支在此候选中未使用 |
| `metric` | [$.nodes[].geometryProfiles.Point.label.collision.metric (t115)](#t115) | 可选 | 按面积、长度、部件数或字段值计算的指标贡献。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/1/label/collision/metric`；第 1860 行 |
| `compatibility` | `"r5DisplayPriority"` | 可选 | 明确保留的旧版优先级合成行为标记。 | 该分支在此候选中未使用 |

<a id="t115"></a>

## t115 · $.nodes[].geometryProfiles.Point.label.collision.metric

首次入口：`$.nodes[].geometryProfiles.Point.label.collision.metric`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `kind` | `"field"` / `"area"` / `"length"` / `"partCount"` | 必填 | 分类路径第二级，或条件/控件的分支种类；依所在对象判读。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/1/label/collision/metric/kind`；第 1862 行 |
| `field` | string | 可选 | 所引用的数据字段路径；不同位置的可用字段集由对应分类限定。 | 该分支在此候选中未使用 |
| `multiplier` | number | 必填 | 指标贡献的乘数。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/1/label/collision/metric/multiplier`；第 1865 行 |
| `divisor` | number | 可选 | 指标贡献的正数除数；不可为零。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/1/label/collision/metric/divisor`；第 1861 行 |
| `rounding` | `"none"` / `"floor"` / `"round"` / `"ceil"` | 必填 | 指标结果保持原值或向下/就近/向上取整。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/1/label/collision/metric/rounding`；第 1866 行 |
| `min` | number | 可选 | 当前数值区间下限；单位取决于所在规则/指标。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/1/label/collision/metric/min`；第 1864 行 |
| `max` | number | 可选 | 当前数值区间上限；单位取决于所在规则/指标。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/1/label/collision/metric/max`；第 1863 行 |

<a id="t116"></a>

## t116 · $.nodes[].geometryProfiles.Point.zoomPriority

首次入口：`$.nodes[].geometryProfiles.Point.zoomPriority`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `rules` | 数组<[ZoomPriorityRule (t117)](#t117)> | 必填 | 有顺序的渲染规则数组；匹配不是自动平均或同时合并全部规则。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules`；第 1669 行 |

<a id="t117"></a>

## t117 · ZoomPriorityRule

首次入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[]`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `id` | string | 必填 | 当前对象的稳定标识；唯一性范围取决于对象类型。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/id`；第 1741 行 |
| `when` | [RenderRuleMatch (t118)](#t118) | 可选 | 当前规则/模块生效条件；渲染、工作流和旧条件数组语法不同。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/when`；第 1777 行 |
| `minZoom` | number | 可选 | 最小缩放边界；渲染原生规则为含端点，优先读取 when.zoom。 | 该分支在此候选中未使用 |
| `maxZoom` | number | 可选 | 最大缩放边界；渲染原生规则为含端点，优先读取 when.zoom。 | 该分支在此候选中未使用 |
| `representation` | `"point"` / `"geometry"` / `"hidden"` / `"labelOnly"` | 可选 | 命中规则时输出隐藏、几何、点符号或仅文字等显示种类。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/representation`；第 1760 行 |
| `style` | [RenderStyle (t125)](#t125) | 可选 | 当前规则的几何外观，或 Label 的字体族/字号等样式。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/style`；第 1761 行 |
| `label` | [RenderLabelStyle (t147)](#t147) | 可选 | 此条规则的 Label 外观、来源、碰撞等设置；不是普通名称字符串。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/label`；第 1742 行 |
| `interaction` | [$.nodes[].geometryProfiles.Point.zoomPriority.rules[].interaction (t152)](#t152) | 可选 | 本几何的命中触发器，或规则内交互外观覆盖。 | 该分支在此候选中未使用 |
| `geometryStack` | [GeometryStackPolicy (t112)](#t112) | 可选 | 真实几何的绘制层级 A，与碰撞 B 和显示权重 C 分开。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/geometryStack`；第 1738 行 |
| `extensions` | [RenderRuleExtensions (t20)](#t20) | 可选 | 规则局部的类型化渲染扩展；在字段路径中则表示要素的扩展数据组。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions`；第 1671 行 |
| `conditionalOverrides` | 数组<[RenderRuleConditionalOverride (t154)](#t154)> | 可选 | 同一条 Zoom 规则内部的字段条件覆写数组。 | 该分支在此候选中未使用 |
| `advanced` | [AdvancedRenderRule (t156)](#t156) | 可选 | 旧兼容渲染描述；新原生设置优先使用类型明确的 extensions。 | 该分支在此候选中未使用 |
| `minExclusive` | number | 可选 | 旧版不含端点的最小 Zoom；新规则不应继续使用。 | 该分支在此候选中未使用 |
| `maxExclusive` | number | 可选 | 旧版不含端点的最大 Zoom；新规则不应继续使用。 | 该分支在此候选中未使用 |
| `labelRole` | `"ignore"` / `"soft"` / `"optional"` / `"important"` / `"required"` | 可选 | 旧版 Label 角色位置；新配置在 label.collision.role。 | 该分支在此候选中未使用 |
| `priority` | [RenderPriority (t155)](#t155) | 可选 | 搜索排序值或渲染显示权重对象；按所在结构区分。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/priority`；第 1756 行 |

<a id="t118"></a>

## t118 · RenderRuleMatch

首次入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].when`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `zoom` | [$.nodes[].geometryProfiles.Point.zoomPriority.rules[].when.zoom (t119)](#t119) | 必填 | 原生渲染规则必需的含端点逻辑 Zoom 区间。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/when/zoom`；第 1778 行 |
| `fields` | [RenderFieldGroup (t120)](#t120) | 可选 | 字段定义数组、字段条件组或继承字段开关；先看当前类型。 | `/nodes/64/geometryProfiles/Point/zoomPriority/rules/2/when/fields`；第 70290 行 |

<a id="t119"></a>

## t119 · $.nodes[].geometryProfiles.Point.zoomPriority.rules[].when.zoom

首次入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].when.zoom`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `min` | number | 必填 | 当前数值区间下限；单位取决于所在规则/指标。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/when/zoom/min`；第 1780 行 |
| `max` | number | 必填 | 当前数值区间上限；单位取决于所在规则/指标。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/when/zoom/max`；第 1779 行 |

<a id="t120"></a>

## t120 · RenderFieldGroup

首次入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].when.fields`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `op` | `"all"` / `"any"` / `"not"` | 必填 | 字段条件树组合：all 全部、any 任一、not 否定。 | `/nodes/64/geometryProfiles/Point/zoomPriority/rules/2/when/fields/op`；第 70307 行 |
| `items` | 数组<[$.nodes[].fields[].requiredWhen[] (t96)](#t96) / [$.nodes[].fields[].requiredWhen[] (t97)](#t97) / [$.nodes[].fields[].requiredWhen[] (t98)](#t98) / [RenderFieldGroup (t120)](#t120) / [$.nodes[].geometryProfiles.Point.zoomPriority.rules[].when.fields.items[] (t121)](#t121)> | 必填 | 当前模块的项目数组；项目结构由所在类型说明。 | `/nodes/64/geometryProfiles/Point/zoomPriority/rules/2/when/fields/items`；第 70306 行 |
| `formula` | [RenderConditionFormula (t122)](#t122) | 可选 | 可见条件编号及手工组合表达式；最终编译为条件树。 | `/nodes/64/geometryProfiles/Point/zoomPriority/rules/2/when/fields/formula`；第 70291 行 |

<a id="t121"></a>

## t121 · $.nodes[].geometryProfiles.Point.zoomPriority.rules[].when.fields.items[]

首次入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].when.fields.items[]`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `kind` | `"fieldCompare"` | 必填 | 分类路径第二级，或条件/控件的分支种类；依所在对象判读。 | 该分支在此候选中未使用 |
| `field` | string | 必填 | 所引用的数据字段路径；不同位置的可用字段集由对应分类限定。 | 该分支在此候选中未使用 |
| `operator` | `"eq"` / `"ne"` / `"in"` / `"notIn"` / `"present"` / `"empty"` / `"gt"` / `"ge"` / `"lt"` / `"le"` | 必填 | 单个字段/槽位条件的比较操作符。 | 该分支在此候选中未使用 |
| `value` | string / number / `false` / `true` | 可选 | 最终存储值、条件比较值或常量；是否字符串须看当前类型声明。 | 该分支在此候选中未使用 |
| `values` | 数组<string / number / `false` / `true`> | 可选 | 条件允许的比较值集合；严格比较时类型也须匹配。 | 该分支在此候选中未使用 |

<a id="t122"></a>

## t122 · RenderConditionFormula

首次入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].when.fields.formula`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `expression` | string | 必填 | 工作流组装公式或条件编号布尔公式；两者语法不同。 | `/nodes/64/geometryProfiles/Point/zoomPriority/rules/2/when/fields/formula/expression`；第 70292 行 |
| `manual` | `false` / `true` | 可选 | 是否采用手工条件公式，暂停按行连接关系自动生成。 | `/nodes/64/geometryProfiles/Point/zoomPriority/rules/2/when/fields/formula/manual`；第 70293 行 |
| `terms` | 数组<[$.nodes[].geometryProfiles.Point.zoomPriority.rules[].when.fields.formula.terms[] (t123)](#t123)> | 必填 | 具有稳定编号的原子条件行数组。 | `/nodes/64/geometryProfiles/Point/zoomPriority/rules/2/when/fields/formula/terms`；第 70294 行 |
| `groups` | 数组<[$.nodes[].geometryProfiles.Point.zoomPriority.rules[].when.fields.formula.groups[] (t124)](#t124)> | 可选 | 来源组数组，或渲染条件命名组；由所在结构区分。 | 该分支在此候选中未使用 |

<a id="t123"></a>

## t123 · $.nodes[].geometryProfiles.Point.zoomPriority.rules[].when.fields.formula.terms[]

首次入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].when.fields.formula.terms[]`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `id` | string | 必填 | 当前对象的稳定标识；唯一性范围取决于对象类型。 | `/nodes/64/geometryProfiles/Point/zoomPriority/rules/2/when/fields/formula/terms/0/id`；第 70301 行 |
| `relation` | `"AND"` / `"OR"` / `"NOT"` | 必填 | 条件行连接关系 AND/OR/NOT，或信息卡关系显示配置。 | `/nodes/64/geometryProfiles/Point/zoomPriority/rules/2/when/fields/formula/terms/0/relation`；第 70302 行 |
| `condition` | [$.nodes[].fields[].requiredWhen[] (t96)](#t96) / [$.nodes[].fields[].requiredWhen[] (t97)](#t97) / [$.nodes[].fields[].requiredWhen[] (t98)](#t98) / [$.nodes[].geometryProfiles.Point.zoomPriority.rules[].when.fields.items[] (t121)](#t121) | 必填 | 当前编号对应的实际字段比较条件。 | `/nodes/64/geometryProfiles/Point/zoomPriority/rules/2/when/fields/formula/terms/0/condition`；第 70296 行 |

<a id="t124"></a>

## t124 · $.nodes[].geometryProfiles.Point.zoomPriority.rules[].when.fields.formula.groups[]

首次入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].when.fields.formula.groups[]`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `id` | string | 必填 | 当前对象的稳定标识；唯一性范围取决于对象类型。 | 该分支在此候选中未使用 |
| `expression` | string | 必填 | 工作流组装公式或条件编号布尔公式；两者语法不同。 | 该分支在此候选中未使用 |

<a id="t125"></a>

## t125 · RenderStyle

首次入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].style`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `symbolOffsetPx` | [$.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.symbolOffsetPx (t126)](#t126) | 可选 | 点符号相对其锚点的屏幕偏移，单位像素。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/1/style/symbolOffsetPx`；第 1916 行 |
| `symbolVisibility` | `"independent"` / `"withLabel"` | 可选 | 点符号独立显示还是随 Label 显示。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/1/style/symbolVisibility`；第 1920 行 |
| `symbolAnchor` | `"geometry"` / `"label"` | 可选 | 符号以源几何或 Label 锚点为基准。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/1/style/symbolAnchor`；第 1915 行 |
| `pointShape` | `"circle"` / `"square"` / `"triangle"` / `"regular4"` / `"regular5"` / `"regular6"` | 可选 | 点符号几何外形。 | `/nodes/52/geometryProfiles/Point/zoomPriority/rules/0/style/pointShape`；第 58704 行 |
| `pointSymbol` | [$.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.pointSymbol (t127)](#t127) / [$.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.pointSymbol (t129)](#t129) / [$.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.pointSymbol (t138)](#t138) | 可选 | 点外观唯一活动分支：shape / icon / externalImage；不能与旧点外观字段并存。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/1/style/pointSymbol`；第 1895 行 |
| `icon` | [RenderPointIcon (t146)](#t146) | 可选 | 外部图标描述；存在时覆盖普通点外形。 | 该分支在此候选中未使用 |
| `size` | number | 可选 | 符号/文字尺寸或按钮尺寸；单位与数组结构见当前对象类型。 | `/nodes/52/geometryProfiles/Point/zoomPriority/rules/0/style/size`；第 58705 行 |
| `weight` | number | 可选 | 几何描边宽度，单位屏幕像素。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/style/weight`；第 1775 行 |
| `stroke` | [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t11)](#t11) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t13)](#t13) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t14)](#t14) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t15)](#t15) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t17)](#t17) | 可选 | 描边颜色绑定方式。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/style/stroke`；第 1770 行 |
| `fill` | [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t11)](#t11) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t13)](#t13) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t14)](#t14) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t15)](#t15) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t17)](#t17) | 可选 | 填充颜色绑定方式。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/style/fill`；第 1763 行 |
| `strokeOpacity` | number | 可选 | 描边不透明度，0 为透明，1 为不透明。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/style/strokeOpacity`；第 1774 行 |
| `fillOpacity` | number | 可选 | 填充不透明度，0 为透明，1 为不透明。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/style/fillOpacity`；第 1767 行 |
| `dashPreset` | `"solid"` / `"dash"` / `"dotDash"` / `"dotDotDash"` | 可选 | 实线、虚线或点划线预设。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/style/dashPreset`；第 1762 行 |
| `lineCap` | `"round"` / `"square"` / `"butt"` | 可选 | 线端样式：平头、圆头或方头。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/style/lineCap`；第 1768 行 |
| `lineJoin` | `"round"` / `"miter"` / `"bevel"` | 可选 | 线段连接转角样式。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/style/lineJoin`；第 1769 行 |

<a id="t126"></a>

## t126 · $.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.symbolOffsetPx

首次入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.symbolOffsetPx`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `x` | number | 必填 | X 坐标或水平像素偏移；由所在坐标/偏移对象区分。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/1/style/symbolOffsetPx/x`；第 1917 行 |
| `y` | number | 必填 | 世界高度坐标或垂直像素偏移；地图平面第二轴通常是 z。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/1/style/symbolOffsetPx/y`；第 1918 行 |

<a id="t127"></a>

## t127 · $.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.pointSymbol

首次入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.pointSymbol`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `kind` | `"shape"` | 必填 | 分类路径第二级，或条件/控件的分支种类；依所在对象判读。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/1/style/pointSymbol/kind`；第 1896 行 |
| `shape` | [BasePointStyle (t128)](#t128) | 必填 | 基础点样式或图标底板形状，具体枚举见当前结构。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/1/style/pointSymbol/shape`；第 1897 行 |

<a id="t128"></a>

## t128 · BasePointStyle

首次入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.pointSymbol.shape`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `pointShape` | `"circle"` / `"square"` / `"triangle"` / `"regular4"` / `"regular5"` / `"regular6"` | 必填 | 点符号几何外形。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/1/style/pointSymbol/shape/pointShape`；第 1905 行 |
| `size` | number | 必填 | 符号/文字尺寸或按钮尺寸；单位与数组结构见当前对象类型。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/1/style/pointSymbol/shape/size`；第 1906 行 |
| `weight` | number | 必填 | 几何描边宽度，单位屏幕像素。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/1/style/pointSymbol/shape/weight`；第 1912 行 |
| `lineCap` | `"round"` / `"square"` / `"butt"` | 必填 | 线端样式：平头、圆头或方头。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/1/style/pointSymbol/shape/lineCap`；第 1903 行 |
| `lineJoin` | `"round"` / `"miter"` / `"bevel"` | 必填 | 线段连接转角样式。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/1/style/pointSymbol/shape/lineJoin`；第 1904 行 |
| `stroke` | [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t11)](#t11) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t13)](#t13) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t14)](#t14) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t15)](#t15) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t17)](#t17) | 必填 | 描边颜色绑定方式。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/1/style/pointSymbol/shape/stroke`；第 1907 行 |
| `fill` | [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t11)](#t11) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t13)](#t13) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t14)](#t14) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t15)](#t15) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t17)](#t17) | 必填 | 填充颜色绑定方式。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/1/style/pointSymbol/shape/fill`；第 1898 行 |
| `strokeOpacity` | number | 必填 | 描边不透明度，0 为透明，1 为不透明。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/1/style/pointSymbol/shape/strokeOpacity`；第 1911 行 |
| `fillOpacity` | number | 必填 | 填充不透明度，0 为透明，1 为不透明。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/1/style/pointSymbol/shape/fillOpacity`；第 1902 行 |

<a id="t129"></a>

## t129 · $.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.pointSymbol

首次入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.pointSymbol`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `kind` | `"icon"` | 必填 | 分类路径第二级，或条件/控件的分支种类；依所在对象判读。 | 该分支在此候选中未使用 |
| `icon` | [$.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.pointSymbol.icon (t130)](#t130) / [$.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.pointSymbol.icon (t136)](#t136) | 必填 | 外部图标描述；存在时覆盖普通点外形。 | 该分支在此候选中未使用 |
| `fallback` | [BasePointStyle (t128)](#t128) | 必填 | 回退策略对象，或默认启用按钮 ID 列表，依所在模块解释。 | 该分支在此候选中未使用 |

<a id="t130"></a>

## t130 · $.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.pointSymbol.icon

首次入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.pointSymbol.icon`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `mode` | `"single"` | 必填 | 当前联合结构的分支选择器；先看 mode，再解释其余字段。 | 该分支在此候选中未使用 |
| `item` | [IconItem (t131)](#t131) | 必填 | 该保存值使用的完整图标组合及独立定位。 | 该分支在此候选中未使用 |

<a id="t131"></a>

## t131 · IconItem

首次入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.pointSymbol.icon.item`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `library` | `"pinhead"` | 必填 | 图库标识；本版仅 pinhead。 | 该分支在此候选中未使用 |
| `id` | string | 必填 | 当前对象的稳定标识；唯一性范围取决于对象类型。 | 该分支在此候选中未使用 |
| `sizePx` | number | 必填 | 图标为正方形 CSS px；图片为 width/height 对象。 | 该分支在此候选中未使用 |
| `foreground` | [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t11)](#t11) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t13)](#t13) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t14)](#t14) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t15)](#t15) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t17)](#t17) | 必填 | 图标前景色，采用五种共用取色模式。 | 该分支在此候选中未使用 |
| `foregroundOpacity` | number | 必填 | 图标前景透明度，0–1。 | 该分支在此候选中未使用 |
| `plate` | [$.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.pointSymbol.icon.item.plate (t132)](#t132) | 可选 | 可选图标底板；缺省为无底板。 | 该分支在此候选中未使用 |
| `placement` | [SymbolPlacement (t133)](#t133) | 必填 | 标签相对锚点的方位或相对线的位置。 | 该分支在此候选中未使用 |

<a id="t132"></a>

## t132 · $.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.pointSymbol.icon.item.plate

首次入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.pointSymbol.icon.item.plate`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `shape` | `"circle"` / `"pin"` / `"square"` / `"roundedRect"` | 必填 | 基础点样式或图标底板形状，具体枚举见当前结构。 | 该分支在此候选中未使用 |
| `paddingPx` | number | 必填 | 碰撞边界额外留白，单位像素。 | 该分支在此候选中未使用 |
| `radiusPx` | number | 可选 | 底板圆角 CSS px。 | 该分支在此候选中未使用 |
| `fill` | [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t11)](#t11) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t13)](#t13) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t14)](#t14) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t15)](#t15) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t17)](#t17) | 必填 | 填充颜色绑定方式。 | 该分支在此候选中未使用 |
| `stroke` | [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t11)](#t11) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t13)](#t13) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t14)](#t14) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t15)](#t15) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t17)](#t17) | 必填 | 描边颜色绑定方式。 | 该分支在此候选中未使用 |
| `strokeWidthPx` | number | 必填 | 底板外框描边宽度 CSS px。 | 该分支在此候选中未使用 |
| `fillOpacity` | number | 必填 | 填充不透明度，0 为透明，1 为不透明。 | 该分支在此候选中未使用 |
| `strokeOpacity` | number | 必填 | 描边不透明度，0 为透明，1 为不透明。 | 该分支在此候选中未使用 |

<a id="t133"></a>

## t133 · SymbolPlacement

首次入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.pointSymbol.icon.item.placement`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `anchor` | [$.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.pointSymbol.icon.item.placement.anchor (t134)](#t134) | 必填 | 多部件锚点模式，或规则内详细锚点设置；先看它是字符串还是对象。 | `/nodes/76/geometryProfiles/Point/zoomPriority/rules/0/style/pointSymbol/image/presentation/placement/anchor`；第 90997 行 |
| `offsetPx` | [$.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.pointSymbol.icon.item.placement.offsetPx (t135)](#t135) | 必填 | 屏幕像素偏移对象，含 x/y。 | `/nodes/76/geometryProfiles/Point/zoomPriority/rules/0/style/pointSymbol/image/presentation/placement/offsetPx`；第 91002 行 |

<a id="t134"></a>

## t134 · $.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.pointSymbol.icon.item.placement.anchor

首次入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.pointSymbol.icon.item.placement.anchor`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `mode` | `"custom"` / `"center"` / `"topCenter"` / `"bottomCenter"` / `"leftCenter"` / `"rightCenter"` / `"topLeft"` / `"topRight"` / `"bottomLeft"` / `"bottomRight"` | 必填 | 当前联合结构的分支选择器；先看 mode，再解释其余字段。 | `/nodes/76/geometryProfiles/Point/zoomPriority/rules/0/style/pointSymbol/image/presentation/placement/anchor/mode`；第 90998 行 |
| `x` | number | 可选 | X 坐标或水平像素偏移；由所在坐标/偏移对象区分。 | `/nodes/76/geometryProfiles/Point/zoomPriority/rules/0/style/pointSymbol/image/presentation/placement/anchor/x`；第 90999 行 |
| `y` | number | 可选 | 世界高度坐标或垂直像素偏移；地图平面第二轴通常是 z。 | `/nodes/76/geometryProfiles/Point/zoomPriority/rules/0/style/pointSymbol/image/presentation/placement/anchor/y`；第 91000 行 |

<a id="t135"></a>

## t135 · $.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.pointSymbol.icon.item.placement.offsetPx

首次入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.pointSymbol.icon.item.placement.offsetPx`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `x` | number | 必填 | X 坐标或水平像素偏移；由所在坐标/偏移对象区分。 | `/nodes/76/geometryProfiles/Point/zoomPriority/rules/0/style/pointSymbol/image/presentation/placement/offsetPx/x`；第 91003 行 |
| `y` | number | 必填 | 世界高度坐标或垂直像素偏移；地图平面第二轴通常是 z。 | `/nodes/76/geometryProfiles/Point/zoomPriority/rules/0/style/pointSymbol/image/presentation/placement/offsetPx/y`；第 91004 行 |

<a id="t136"></a>

## t136 · $.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.pointSymbol.icon

首次入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.pointSymbol.icon`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `mode` | `"valueMap"` | 必填 | 当前联合结构的分支选择器；先看 mode，再解释其余字段。 | 该分支在此候选中未使用 |
| `field` | string | 必填 | 所引用的数据字段路径；不同位置的可用字段集由对应分类限定。 | 该分支在此候选中未使用 |
| `entries` | 数组<[$.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.pointSymbol.icon.entries[] (t137)](#t137)> | 必填 | 按值设色的逐行条目，或迁移对齐报告中的逐项记录。 | 该分支在此候选中未使用 |

<a id="t137"></a>

## t137 · $.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.pointSymbol.icon.entries[]

首次入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.pointSymbol.icon.entries[]`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `value` | string / number / `false` / `true` | 必填 | 最终存储值、条件比较值或常量；是否字符串须看当前类型声明。 | 该分支在此候选中未使用 |
| `item` | [IconItem (t131)](#t131) | 必填 | 该保存值使用的完整图标组合及独立定位。 | 该分支在此候选中未使用 |

<a id="t138"></a>

## t138 · $.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.pointSymbol

首次入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.pointSymbol`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `kind` | `"externalImage"` | 必填 | 分类路径第二级，或条件/控件的分支种类；依所在对象判读。 | `/nodes/76/geometryProfiles/Point/zoomPriority/rules/0/style/pointSymbol/kind`；第 91013 行 |
| `image` | [$.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.pointSymbol.image (t139)](#t139) / [$.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.pointSymbol.image (t142)](#t142) / [$.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.pointSymbol.image (t143)](#t143) / [$.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.pointSymbol.image (t144)](#t144) | 必填 | 唯一活动图片来源，四选一。 | `/nodes/76/geometryProfiles/Point/zoomPriority/rules/0/style/pointSymbol/image`；第 90992 行 |
| `fallback` | [BasePointStyle (t128)](#t128) | 必填 | 回退策略对象，或默认启用按钮 ID 列表，依所在模块解释。 | `/nodes/76/geometryProfiles/Point/zoomPriority/rules/0/style/pointSymbol/fallback`；第 90975 行 |

<a id="t139"></a>

## t139 · $.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.pointSymbol.image

首次入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.pointSymbol.image`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `mode` | `"fixed"` | 必填 | 当前联合结构的分支选择器；先看 mode，再解释其余字段。 | 该分支在此候选中未使用 |
| `url` | string | 必填 | 外部链接地址。 | 该分支在此候选中未使用 |
| `presentation` | [ImagePresentation (t140)](#t140) | 必填 | 当前图片项的独立宽高与锚点/局部偏移。 | 该分支在此候选中未使用 |

<a id="t140"></a>

## t140 · ImagePresentation

首次入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.pointSymbol.image.presentation`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `sizePx` | [$.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.pointSymbol.image.presentation.sizePx (t141)](#t141) | 必填 | 图标为正方形 CSS px；图片为 width/height 对象。 | `/nodes/76/geometryProfiles/Point/zoomPriority/rules/0/style/pointSymbol/image/presentation/sizePx`；第 91007 行 |
| `placement` | [SymbolPlacement (t133)](#t133) | 必填 | 标签相对锚点的方位或相对线的位置。 | `/nodes/76/geometryProfiles/Point/zoomPriority/rules/0/style/pointSymbol/image/presentation/placement`；第 90996 行 |

<a id="t141"></a>

## t141 · $.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.pointSymbol.image.presentation.sizePx

首次入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.pointSymbol.image.presentation.sizePx`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `width` | number | 必填 | 轮廓宽度或边界框宽度修正；具体由所在对象解释。 | `/nodes/76/geometryProfiles/Point/zoomPriority/rules/0/style/pointSymbol/image/presentation/sizePx/width`；第 91009 行 |
| `height` | number | 必填 | 边界框高度修正，或绘制绑定返回有效高度。 | `/nodes/76/geometryProfiles/Point/zoomPriority/rules/0/style/pointSymbol/image/presentation/sizePx/height`；第 91008 行 |

<a id="t142"></a>

## t142 · $.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.pointSymbol.image

首次入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.pointSymbol.image`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `mode` | `"fieldUrl"` | 必填 | 当前联合结构的分支选择器；先看 mode，再解释其余字段。 | `/nodes/76/geometryProfiles/Point/zoomPriority/rules/0/style/pointSymbol/image/mode`；第 90994 行 |
| `field` | string | 必填 | 所引用的数据字段路径；不同位置的可用字段集由对应分类限定。 | `/nodes/76/geometryProfiles/Point/zoomPriority/rules/0/style/pointSymbol/image/field`；第 90993 行 |
| `presentation` | [ImagePresentation (t140)](#t140) | 必填 | 当前图片项的独立宽高与锚点/局部偏移。 | `/nodes/76/geometryProfiles/Point/zoomPriority/rules/0/style/pointSymbol/image/presentation`；第 90995 行 |

<a id="t143"></a>

## t143 · $.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.pointSymbol.image

首次入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.pointSymbol.image`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `mode` | `"externalFieldUrl"` | 必填 | 当前联合结构的分支选择器；先看 mode，再解释其余字段。 | 该分支在此候选中未使用 |
| `targetIdField` | string | 必填 | 本记录中保存外部目标 ID 的字段。 | 该分支在此候选中未使用 |
| `targetUrlField` | string | 必填 | 外部目标要素存储 URL 的字段路径；手工填写，不扫描目标数据。 | 该分支在此候选中未使用 |
| `presentation` | [ImagePresentation (t140)](#t140) | 必填 | 当前图片项的独立宽高与锚点/局部偏移。 | 该分支在此候选中未使用 |

<a id="t144"></a>

## t144 · $.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.pointSymbol.image

首次入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.pointSymbol.image`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `mode` | `"valueMap"` | 必填 | 当前联合结构的分支选择器；先看 mode，再解释其余字段。 | 该分支在此候选中未使用 |
| `field` | string | 必填 | 所引用的数据字段路径；不同位置的可用字段集由对应分类限定。 | 该分支在此候选中未使用 |
| `entries` | 数组<[$.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.pointSymbol.image.entries[] (t145)](#t145)> | 必填 | 按值设色的逐行条目，或迁移对齐报告中的逐项记录。 | 该分支在此候选中未使用 |

<a id="t145"></a>

## t145 · $.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.pointSymbol.image.entries[]

首次入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.pointSymbol.image.entries[]`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `value` | string / number / `false` / `true` | 必填 | 最终存储值、条件比较值或常量；是否字符串须看当前类型声明。 | 该分支在此候选中未使用 |
| `url` | string | 必填 | 外部链接地址。 | 该分支在此候选中未使用 |
| `presentation` | [ImagePresentation (t140)](#t140) | 必填 | 当前图片项的独立宽高与锚点/局部偏移。 | 该分支在此候选中未使用 |

<a id="t146"></a>

## t146 · RenderPointIcon

首次入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.icon`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `source` | string | 必填 | 信息卡字段来源、图标来源、预填来源或对齐文件位置；结合路径区分。 | 该分支在此候选中未使用 |
| `size` | [number, number] | 必填 | 符号/文字尺寸或按钮尺寸；单位与数组结构见当前对象类型。 | 该分支在此候选中未使用 |
| `anchor` | [number, number] | 必填 | 多部件锚点模式，或规则内详细锚点设置；先看它是字符串还是对象。 | 该分支在此候选中未使用 |
| `fallback` | `"circle"` / `"hide"` | 必填 | 回退策略对象，或默认启用按钮 ID 列表，依所在模块解释。 | 该分支在此候选中未使用 |

<a id="t147"></a>

## t147 · RenderLabelStyle

首次入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].label`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `visible` | boolean | 必填 | 是否显示该 Label 或信息卡单元。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/label/visible`；第 1754 行 |
| `style` | [RenderLabelVisualStyle (t148)](#t148) | 可选 | 当前规则的几何外观，或 Label 的字体族/字号等样式。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/label/style`；第 1750 行 |
| `font` | `"blue"` / `"whiteBlackOutline"` / `"capsule"` | 可选 | 旧 Label 字体枚举；新配置使用 label.style.family。 | 该分支在此候选中未使用 |
| `size` | number | 可选 | 符号/文字尺寸或按钮尺寸；单位与数组结构见当前对象类型。 | 该分支在此候选中未使用 |
| `italic` | `false` / `true` | 可选 | 文字斜体；新配置存放于 label.style.modifiers。 | 该分支在此候选中未使用 |
| `underline` | `false` / `true` | 可选 | 文字下划线；新配置存放于 label.style.modifiers。 | 该分支在此候选中未使用 |
| `source` | string | 可选 | 单一 Label 主来源字段，如 Name；组合来源改用 sourceMode 与 template。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/label/source`；第 1749 行 |
| `sourceMode` | `"single"` / `"combined"` | 可选 | Label 采用单一字段还是组合文字来源。 | `/nodes/65/geometryProfiles/LineString/zoomPriority/rules/2/label/sourceMode`；第 71863 行 |
| `template` | string | 可选 | Label 组合模板：双引号内为字段路径，其余为字面文字。 | `/nodes/65/geometryProfiles/LineString/zoomPriority/rules/2/label/template`；第 71873 行 |
| `fallbackSources` | 数组<string> | 可选 | 主来源无文字时依序尝试的备用字段路径。 | `/nodes/5/geometryProfiles/Polygon/zoomPriority/rules/1/label/fallbackSources`；第 7570 行 |
| `valueFormat` | `"plain"` / `"floorLabel"` | 可选 | 文字的受控格式化方式，例如楼层值格式。 | 该分支在此候选中未使用 |
| `fallbackValueFormats` | [Record (t151)](#t151) | 可选 | 以备用字段路径为键的格式化方式映射。 | `/nodes/5/geometryProfiles/Polygon/zoomPriority/rules/1/label/fallbackValueFormats`；第 7573 行 |
| `placement` | `"N"` / `"S"` / `"E"` / `"W"` / `"NE"` / `"NW"` / `"SE"` / `"SW"` / `"center"` / `"aboveLine"` / `"belowLine"` / `"near"` | 可选 | 标签相对锚点的方位或相对线的位置。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/1/label/placement`；第 1872 行 |
| `offsetY` | number | 可选 | Label 垂直方向屏幕偏移。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/1/label/offsetY`；第 1871 行 |
| `offsetX` | number | 可选 | Label 水平方向屏幕偏移。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/1/label/offsetX`；第 1870 行 |
| `withDot` | `false` / `true` | 可选 | Label 是否带装饰圆点；不等同于实际点几何。 | `/nodes/5/geometryProfiles/Polygon/zoomPriority/rules/0/label/withDot`；第 7464 行 |
| `dotAnchorMode` | `"anchorRight"` / `"inline"` | 可选 | 装饰圆点的位置规则。 | `/nodes/5/geometryProfiles/Polygon/zoomPriority/rules/0/label/dotAnchorMode`；第 7457 行 |
| `collision` | [LabelCollisionPolicy (t114)](#t114) | 必填 | Label 碰撞角色或详细碰撞扩展；不控制真实几何层级。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/label/collision`；第 1743 行 |

<a id="t148"></a>

## t148 · RenderLabelVisualStyle

首次入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].label.style`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `family` | `"gm-bw"` / `"gm-outline"` / `"gm-wtb"` / `"structure-label"` / `"bubble-dark"` / `"rle-line-color"` / `"rle-pill-color"` / `"custom_pill_1"` | 必填 | 受控 Label 视觉族键，如 gm-outline、rle-pill-color。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/label/style/family`；第 1751 行 |
| `size` | number | 必填 | 符号/文字尺寸或按钮尺寸；单位与数组结构见当前对象类型。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/label/style/size`；第 1752 行 |
| `modifiers` | [LabelStyleModifiers (t149)](#t149) | 可选 | 文字斜体、下划线、粗体等修饰集合。 | 该分支在此候选中未使用 |
| `color` | [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t11)](#t11) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t13)](#t13) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t14)](#t14) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t15)](#t15) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t17)](#t17) | 可选 | 固定颜色文本；可用颜色语法仍须通过实际核验。 | `/nodes/65/geometryProfiles/LineString/zoomPriority/rules/0/label/style/color`；第 71485 行 |
| `pill` | [CustomPillSettings (t150)](#t150) | 可选 | custom_pill_1 的完整九项设置；字号唯一保存在 style.size。 | 该分支在此候选中未使用 |

<a id="t149"></a>

## t149 · LabelStyleModifiers

首次入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].label.style.modifiers`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `italic` | `false` / `true` | 可选 | 文字斜体；新配置存放于 label.style.modifiers。 | 该分支在此候选中未使用 |
| `underline` | `false` / `true` | 可选 | 文字下划线；新配置存放于 label.style.modifiers。 | 该分支在此候选中未使用 |
| `bold` | `false` / `true` | 可选 | 文字粗体开关。 | 该分支在此候选中未使用 |

<a id="t150"></a>

## t150 · CustomPillSettings

首次入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].label.style.pill`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `lineHeightRatio` | number | 必填 | 行高/字号比例，0<r≤10。 | 该分支在此候选中未使用 |
| `paddingYRatio` | number | 必填 | 上下各一侧内边距/字号比例，0≤r≤10。 | 该分支在此候选中未使用 |
| `paddingXRatio` | number | 必填 | 左右各一侧内边距/字号比例，0≤r≤10。 | 该分支在此候选中未使用 |
| `radiusRatio` | number | 必填 | 请求圆角/字号比例，0≤r≤10；实际圆角不超过宽高的一半。 | 该分支在此候选中未使用 |
| `textColor` | [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t11)](#t11) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t13)](#t13) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t14)](#t14) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t15)](#t15) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t17)](#t17) | 必填 | 胶囊文字色，五种共用取色模式。 | 该分支在此候选中未使用 |
| `backgroundColor` | [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t11)](#t11) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t13)](#t13) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t14)](#t14) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t15)](#t15) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t17)](#t17) | 必填 | 胶囊背景色，五种共用取色模式。 | 该分支在此候选中未使用 |
| `strokeColor` | [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t11)](#t11) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t13)](#t13) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t14)](#t14) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t15)](#t15) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding (t17)](#t17) | 必填 | 交互覆盖的描边固定颜色。 | 该分支在此候选中未使用 |
| `strokeWidth` | number | 必填 | 交互描边宽度，单位像素。 | 该分支在此候选中未使用 |

<a id="t151"></a>

## t151 · Record

首次入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].label.fallbackValueFormats`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| 可变字典键 | `"plain"` / `"floorLabel"` | 依使用方 | 仅该字典允许可变键；不表示其他结构可任意添加键。 | — |

<a id="t152"></a>

## t152 · $.nodes[].geometryProfiles.Point.zoomPriority.rules[].interaction

首次入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].interaction`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `triggers` | [GeometryInteractionTriggers (t153)](#t153) | 必填 | 可触发交互的命中区域集合。 | 该分支在此候选中未使用 |

<a id="t153"></a>

## t153 · GeometryInteractionTriggers

首次入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].interaction.triggers`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `point` | `false` / `true` | 可选 | 点图层的 pane 名、交互触发标记或单点返回值，依所在对象判读。 | `/nodes/0/geometryProfiles/Polygon/interaction/triggers/point`；第 1665 行 |
| `line` | `false` / `true` | 可选 | 是否允许线几何触发交互。 | `/nodes/0/geometryProfiles/Polygon/interaction/triggers/line`；第 1664 行 |
| `boundary` | `false` / `true` | 可选 | 是否允许面边界触发交互。 | `/nodes/0/geometryProfiles/Polygon/interaction/triggers/boundary`；第 1661 行 |
| `interior` | `false` / `true` | 可选 | 是否允许面内部触发交互。 | `/nodes/0/geometryProfiles/Polygon/interaction/triggers/interior`；第 1662 行 |
| `label` | `false` / `true` | 可选 | 名称对象或 Label 样式对象；必须结合所在路径解读。 | `/nodes/0/geometryProfiles/Polygon/interaction/triggers/label`；第 1663 行 |

<a id="t154"></a>

## t154 · RenderRuleConditionalOverride

首次入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].conditionalOverrides[]`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `id` | string | 必填 | 当前对象的稳定标识；唯一性范围取决于对象类型。 | 该分支在此候选中未使用 |
| `when` | 数组<[$.nodes[].fields[].requiredWhen[] (t93)](#t93) / [$.nodes[].fields[].requiredWhen[] (t94)](#t94) / [$.nodes[].fields[].requiredWhen[] (t95)](#t95) / [$.nodes[].fields[].requiredWhen[] (t96)](#t96) / [$.nodes[].fields[].requiredWhen[] (t97)](#t97) / [$.nodes[].fields[].requiredWhen[] (t98)](#t98)> | 必填 | 当前规则/模块生效条件；渲染、工作流和旧条件数组语法不同。 | 该分支在此候选中未使用 |
| `representation` | `"point"` / `"geometry"` / `"hidden"` / `"labelOnly"` | 可选 | 命中规则时输出隐藏、几何、点符号或仅文字等显示种类。 | 该分支在此候选中未使用 |
| `style` | [RenderStyle (t125)](#t125) | 可选 | 当前规则的几何外观，或 Label 的字体族/字号等样式。 | 该分支在此候选中未使用 |
| `label` | [RenderLabelStyle (t147)](#t147) | 可选 | 名称对象或 Label 样式对象；必须结合所在路径解读。 | 该分支在此候选中未使用 |
| `geometryStack` | [GeometryStackPolicy (t112)](#t112) | 可选 | 真实几何的绘制层级 A，与碰撞 B 和显示权重 C 分开。 | 该分支在此候选中未使用 |
| `priority` | [RenderPriority (t155)](#t155) | 可选 | 搜索排序值或渲染显示权重对象；按所在结构区分。 | 该分支在此候选中未使用 |
| `extensions` | [RenderRuleExtensions (t20)](#t20) | 可选 | 规则局部的类型化渲染扩展；在字段路径中则表示要素的扩展数据组。 | 该分支在此候选中未使用 |

<a id="t155"></a>

## t155 · RenderPriority

首次入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].conditionalOverrides[].priority`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `mode` | `"add"` / `"replace"` | 必填 | 当前联合结构的分支选择器；先看 mode，再解释其余字段。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/priority/mode`；第 1758 行 |
| `base` | number | 可选 | 显示权重或优先分数的基础值。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/priority/base`；第 1757 行 |
| `metric` | [$.nodes[].geometryProfiles.Point.label.collision.metric (t115)](#t115) | 可选 | 按面积、长度、部件数或字段值计算的指标贡献。 | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/1/priority/metric`；第 1882 行 |

<a id="t156"></a>

## t156 · AdvancedRenderRule

首次入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].advanced`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `predicates` | [Record (t157)](#t157) | 可选 | 旧兼容谓词信息，不是可执行 JavaScript。 | 该分支在此候选中未使用 |
| `visibility` | [Record (t157)](#t157) | 可选 | 关系可见性扩展，或附属结构显示策略。 | 该分支在此候选中未使用 |
| `geometry` | [Record (t157)](#t157) | 可选 | 当前绘制的几何类型、几何输入继承选项或输出几何设置。 | 该分支在此候选中未使用 |
| `symbol` | [Record (t157)](#t157) | 可选 | 交互点标记配置；并非源几何坐标。 | 该分支在此候选中未使用 |
| `label` | [Record (t157)](#t157) | 可选 | 名称对象或 Label 样式对象；必须结合所在路径解读。 | 该分支在此候选中未使用 |
| `collision` | [Record (t157)](#t157) | 可选 | Label 碰撞角色或详细碰撞扩展；不控制真实几何层级。 | 该分支在此候选中未使用 |
| `selection` | [Record (t157)](#t157) | 可选 | 旧兼容选中状态信息。 | 该分支在此候选中未使用 |
| `specialLogic` | 数组<string> | 可选 | 旧兼容特殊显示键列表。 | 该分支在此候选中未使用 |
| `legacyRuntime` | [$.nodes[].geometryProfiles.Point.zoomPriority.rules[].advanced.legacyRuntime (t158)](#t158) | 可选 | 旧渲染执行器保留策略声明。 | 该分支在此候选中未使用 |

<a id="t157"></a>

## t157 · Record

首次入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].advanced.predicates`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| 可变字典键 | JSON | 依使用方 | 仅该字典允许可变键；不表示其他结构可任意添加键。 | — |

<a id="t158"></a>

## t158 · $.nodes[].geometryProfiles.Point.zoomPriority.rules[].advanced.legacyRuntime

首次入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].advanced.legacyRuntime`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `preserveFallback` | `false` / `true` | 可选 | 旧渲染执行器是否保留回退行为。 | 该分支在此候选中未使用 |
| `sourceRuleName` | string | 可选 | 旧规则来源名称。 | 该分支在此候选中未使用 |

<a id="t159"></a>

## t159 · $.nodes[].geometryProfiles.Point.interaction

首次入口：`$.nodes[].geometryProfiles.Point.interaction`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `triggers` | [GeometryInteractionTriggers (t153)](#t153) | 必填 | 可触发交互的命中区域集合。 | `/nodes/0/geometryProfiles/Polygon/interaction/triggers`；第 1660 行 |

<a id="t160"></a>

## t160 · $.nodes[].geometryProfiles.Point.legacyDisplay

首次入口：`$.nodes[].geometryProfiles.Point.legacyDisplay`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `ruleIds` | 数组<string> | 必填 | 旧显示规则 ID 列表。 | 该分支在此候选中未使用 |
| `profileIds` | 数组<string> | 必填 | 旧显示预设 ID 列表。 | 该分支在此候选中未使用 |
| `specialLogicKeys` | 数组<string> | 必填 | 旧特殊显示逻辑键列表。 | 该分支在此候选中未使用 |

<a id="t161"></a>

## t161 · ContainmentBinding

首次入口：`$.nodes[].containment`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `enabled` | boolean | 必填 | 启用标记；false 不等于删除定义，具体作用范围取决于所在模块。 | 该分支在此候选中未使用 |
| `role` | `"parent"` / `"child"` | 可选 | 结构身份或 Label 碰撞角色；二者是不同概念。 | 该分支在此候选中未使用 |
| `parentReferenceField` | string | 可选 | 旧附属结构指向主结构的字段。 | 该分支在此候选中未使用 |
| `viewProfileKey` | string | 可选 | 旧上下文视图预设键。 | 该分支在此候选中未使用 |

<a id="t162"></a>

## t162 · $.nodes[].card

首次入口：`$.nodes[].card`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `mode` | `"fields"` | 必填 | 当前联合结构的分支选择器；先看 mode，再解释其余字段。 | `/nodes/0/card/mode`；第 1383 行 |
| `items` | 数组<[CardItem (t163)](#t163)> | 必填 | 当前模块的项目数组；项目结构由所在类型说明。 | `/nodes/0/card/items`；第 1113 行 |
| `remaining` | [$.nodes[].card.remaining (t168)](#t168) | 可选 | 信息卡未明确列出的其余字段的显示规则。 | `/nodes/0/card/remaining`；第 1384 行 |

<a id="t163"></a>

## t163 · CardItem

首次入口：`$.nodes[].card.items[]`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `id` | string | 必填 | 当前对象的稳定标识；唯一性范围取决于对象类型。 | `/nodes/0/card/items/0/id`；第 1115 行 |
| `fieldBinding` | [FieldDefinitionRef (t164)](#t164) | 可选 | 信息卡单元实时绑定字段设计的 nodeId+fieldId 引用。 | 该分支在此候选中未使用 |
| `optionsFieldRef` | [FieldDefinitionRef (t164)](#t164) | 可选 | 仅对照表实时绑定到指定字段 nodeId+fieldId。 | 该分支在此候选中未使用 |
| `optionsTableId` | string | 可选 | 实时引用公共表 lookupTables[].id，不保存独立可编辑副本。 | 该分支在此候选中未使用 |
| `optionTable` | [OptionTable (t48)](#t48) | 可选 | 当前模块本地对照表；含 valueType 和 rows。 | 该分支在此候选中未使用 |
| `optionValueType` | `"string"` / `"number"` / `"boolean"` | 可选 | 选项保存为文本、数字或布尔值；value 文本会按此解释。 | 该分支在此候选中未使用 |
| `inheritFrom` | [$.nodes[].card.items[].inheritFrom (t165)](#t165) | 可选 | 信息卡继承来源的 nodeId+itemId 引用。 | `/nodes/1/card/items/0/inheritFrom`；第 2430 行 |
| `prefillAudit` | [PrefillAudit (t106)](#t106) | 可选 | 预填来源的审计指纹；只用于提醒陈旧，不建立运行时绑定。 | `/nodes/0/card/items/1/prefillAudit`；第 1135 行 |
| `source` | string | 必填 | 信息卡单元读取的本记录字段路径，如 direction 或 extensions.link.wiki。 | `/nodes/0/card/items/0/source`；第 1125 行 |
| `fallbackSources` | 数组<string> | 可选 | 主来源无文字时依序尝试的备用字段路径。 | `/nodes/78/card/items/1/fallbackSources`；第 92544 行 |
| `afterRemaining` | `false` / `true` | 可选 | 此信息卡单元排列在剩余字段区域之后。 | `/nodes/0/card/items/10/afterRemaining`；第 1331 行 |
| `visible` | boolean | 必填 | 是否显示该 Label 或信息卡单元。 | `/nodes/0/card/items/0/visible`；第 1126 行 |
| `renderer` | `"text"` / `"nameColorCapsule"` / `"lineChips"` / `"tag"` / `"colorCapsule"` / `"relationLink"` / `"media"` | 必填 | 信息卡单元受控显示器：文字、链接、胶囊、媒体等。 | `/nodes/0/card/items/0/renderer`；第 1123 行 |
| `section` | `"main"` / `"other"` | 可选 | 信息卡主要/其他信息分区。 | `/nodes/0/card/items/0/section`；第 1124 行 |
| `hideWhenEmpty` | `false` / `true` | 可选 | 值为空时是否隐藏当前信息卡单元或剩余字段。 | `/nodes/0/card/items/1/hideWhenEmpty`；第 1129 行 |
| `label` | [LocalizedText (t1)](#t1) | 可选 | 名称对象或 Label 样式对象；必须结合所在路径解读。 | `/nodes/0/card/items/0/label`；第 1116 行 |
| `labelMode` | `"field"` / `"override"` | 可选 | 旧信息卡标题来源模式；不等于新字段绑定本身。 | 该分支在此候选中未使用 |
| `valueMode` | `"field"` / `"override"` | 可选 | 原值、意义对照或外部引用显示模式；不同模块枚举不同。 | 该分支在此候选中未使用 |
| `valueOptions` | 数组<[SelectOption (t42)](#t42)> | 可选 | 搜索副标题或旧信息卡本地意义对照行。 | 该分支在此候选中未使用 |
| `options` | [$.nodes[].card.items[].options (t166)](#t166) | 可选 | 控件本地选项数组、组件设置对象等；不能跨对象套用。 | `/nodes/0/card/items/0/options`；第 1120 行 |
| `relation` | [CardRelation (t167)](#t167) | 可选 | 条件行连接关系 AND/OR/NOT，或信息卡关系显示配置。 | `/nodes/5/card/items/1/relation`；第 6717 行 |

<a id="t164"></a>

## t164 · FieldDefinitionRef

首次入口：`$.nodes[].card.items[].fieldBinding`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `nodeId` | string | 必填 | 分类节点稳定 ID；children 与字段引用通过它定位。 | 该分支在此候选中未使用 |
| `fieldId` | string | 必填 | 字段稳定身份；同一有效分类内不同 key 不得共用它。 | 该分支在此候选中未使用 |

<a id="t165"></a>

## t165 · $.nodes[].card.items[].inheritFrom

首次入口：`$.nodes[].card.items[].inheritFrom`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `nodeId` | string | 必填 | 分类节点稳定 ID；children 与字段引用通过它定位。 | `/nodes/1/card/items/0/inheritFrom/nodeId`；第 2432 行 |
| `itemId` | string | 必填 | 信息卡来源单元的稳定 ID。 | `/nodes/1/card/items/0/inheritFrom/itemId`；第 2431 行 |

<a id="t166"></a>

## t166 · $.nodes[].card.items[].options

首次入口：`$.nodes[].card.items[].options`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `colorSource` | string | 可选 | 信息卡胶囊读取颜色的字段路径。 | `/nodes/65/card/items/1/options/colorSource`；第 70754 行 |
| `nameSource` | string | 可选 | 信息卡胶囊读取名称的字段路径。 | 该分支在此候选中未使用 |
| `fallbackColor` | string | 可选 | 主颜色来源无效时使用的回退颜色。 | `/nodes/65/card/items/1/options/fallbackColor`；第 70755 行 |
| `tagColor` | string | 可选 | 信息卡标签的固定颜色。 | 该分支在此候选中未使用 |
| `mediaSource` | `"picture-index"` / `"external-url"` | 可选 | 媒体来自图片索引还是外部 URL。 | 该分支在此候选中未使用 |
| `lineChipSource` | `"platform"` / `"station"` / `"stationBuilding"` | 可选 | 关联线路胶囊索引入口：站台、站场或车站建筑。 | `/nodes/64/card/items/1/options/lineChipSource`；第 69502 行 |
| `format` | `"boolean"` / `"plain"` / `"externalLink"` / `"date"` / `"enum"` / `"json"` / `"classification"` / `"world"` | 可选 | 字段/显示格式；只允许当前类型枚举中的受控格式。 | `/nodes/0/card/items/0/options/format`；第 1121 行 |
| `linkText` | `"raw"` / `"href"` | 可选 | 外链显示原值或实际 href。 | `/nodes/0/card/items/8/options/linkText`；第 1291 行 |

<a id="t167"></a>

## t167 · CardRelation

首次入口：`$.nodes[].card.items[].relation`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `targetRole` | `"main"` | 可选 | 按通用主结构身份找目标，当前可选 main。 | `/nodes/5/card/items/1/relation/targetRole`；第 6723 行 |
| `targetClassification` | [ClassificationPath (t16)](#t16) | 可选 | 信息卡关系显示的目标分类范围。 | `/nodes/5/card/items/2/relation/targetClassification`；第 6751 行 |
| `targetMatchField` | string | 可选 | 关联目标记录的匹配字段。 | `/nodes/5/card/items/1/relation/targetMatchField`；第 6722 行 |
| `targetDisplayField` | string | 可选 | 关联目标记录的显示字段。 | `/nodes/5/card/items/1/relation/targetDisplayField`；第 6721 行 |
| `clickable` | `false` / `true` | 可选 | 关系目标是否可以点击定位或查看。 | `/nodes/5/card/items/1/relation/clickable`；第 6718 行 |
| `multiple` | `false` / `true` | 可选 | 当前关系是否多目标，或当前绘制页是否允许多部件/多点。 | `/nodes/5/card/items/1/relation/multiple`；第 6720 行 |
| `sourceValuePath` | string | 可选 | 关联值是数组/对象时，提取目标 ID 的内部路径。 | 该分支在此候选中未使用 |
| `fallbackDisplay` | `"raw"` / `"unknown"` | 可选 | 目标不存在时显示原值或未知提示。 | `/nodes/5/card/items/1/relation/fallbackDisplay`；第 6719 行 |

<a id="t168"></a>

## t168 · $.nodes[].card.remaining

首次入口：`$.nodes[].card.remaining`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `enabled` | boolean | 必填 | 启用标记；false 不等于删除定义，具体作用范围取决于所在模块。 | `/nodes/0/card/remaining/enabled`；第 1385 行 |
| `section` | `"main"` / `"other"` | 必填 | 信息卡主要/其他信息分区。 | `/nodes/0/card/remaining/section`；第 1420 行 |
| `includeSystem` | boolean | 必填 | 剩余字段中是否包含系统字段。 | `/nodes/0/card/remaining/includeSystem`；第 1416 行 |
| `exclude` | 数组<string> | 可选 | 剩余字段中排除的字段路径。 | `/nodes/0/card/remaining/exclude`；第 1386 行 |
| `hideWhenEmpty` | `false` / `true` | 可选 | 值为空时是否隐藏当前信息卡单元或剩余字段。 | `/nodes/0/card/remaining/hideWhenEmpty`；第 1415 行 |
| `order` | `"record"` / `"alphabetical"` | 可选 | 剩余字段按记录顺序或字母顺序排列。 | `/nodes/0/card/remaining/order`；第 1419 行 |
| `maxDepth` | number | 可选 | 剩余字段对象展开的深度上限。 | `/nodes/0/card/remaining/maxDepth`；第 1418 行 |
| `maxArrayLength` | number | 可选 | 剩余字段数组展开的项目数上限。 | `/nodes/0/card/remaining/maxArrayLength`；第 1417 行 |

<a id="t169"></a>

## t169 · $.nodes[].card

首次入口：`$.nodes[].card`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `mode` | `"layout"` | 必填 | 当前联合结构的分支选择器；先看 mode，再解释其余字段。 | 该分支在此候选中未使用 |
| `layoutId` | string | 必填 | 受控信息卡布局 ID。 | 该分支在此候选中未使用 |
| `options` | [Record (t157)](#t157) | 可选 | 控件本地选项数组、组件设置对象等；不能跨对象套用。 | 该分支在此候选中未使用 |

<a id="t170"></a>

## t170 · $.nodes[].card

首次入口：`$.nodes[].card`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `mode` | `"component"` | 必填 | 当前联合结构的分支选择器；先看 mode，再解释其余字段。 | `/nodes/85/card/mode`；第 99924 行 |
| `componentKey` | string | 必填 | 已登记代码组件/外部工作流的稳定键。 | `/nodes/85/card/componentKey`；第 99923 行 |
| `options` | [Record (t157)](#t157) | 可选 | 控件本地选项数组、组件设置对象等；不能跨对象套用。 | 该分支在此候选中未使用 |

<a id="t171"></a>

## t171 · $.nodes[].legacy

首次入口：`$.nodes[].legacy`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `classCode` | string | 必填 | 旧式 Class 过滤列表或字段引用的 Class 目标；先看所属结构。 | `/nodes/0/legacy/classCode`；第 2075 行 |
| `displayRuleIds` | 数组<string> | 必填 | 分类对应的旧显示规则 ID 列表。 | `/nodes/0/legacy/displayRuleIds`；第 2076 行 |
| `cardLayoutId` | string | 可选 | 分类对应的旧信息卡布局 ID。 | `/nodes/0/legacy/cardLayoutId`；第 2074 行 |
| `specialCardKey` | string | 可选 | 分类对应的旧特殊信息卡组件键。 | 该分支在此候选中未使用 |
| `source` | [Record (t157)](#t157) | 可选 | 信息卡字段来源、图标来源、预填来源或对齐文件位置；结合路径区分。 | `/nodes/0/legacy/source`；第 2079 行 |

<a id="t172"></a>

## t172 · ContextBinding

首次入口：`$.contextBindings[]`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `id` | string | 必填 | 当前对象的稳定标识；唯一性范围取决于对象类型。 | 该分支在此候选中未使用 |
| `label` | [LocalizedText (t1)](#t1) | 必填 | 名称对象或 Label 样式对象；必须结合所在路径解读。 | 该分支在此候选中未使用 |
| `host` | [ContextBindingEndpoint (t173)](#t173) | 必填 | 旧上下文关系的主结构端点。 | 该分支在此候选中未使用 |
| `member` | [ContextBindingEndpoint (t173)](#t173) | 必填 | 旧上下文关系的附属结构端点。 | 该分支在此候选中未使用 |
| `memberSelectorField` | string | 可选 | 旧上下文关系中成员的层级选择字段。 | 该分支在此候选中未使用 |
| `enabled` | boolean | 必填 | 启用标记；false 不等于删除定义，具体作用范围取决于所在模块。 | 该分支在此候选中未使用 |
| `profile` | `"default"` / `"keep-host-context"` / `"show-active-member-only"` | 必填 | 沿线文字预设或主附属上下文显示预设；由所在对象区分。 | 该分支在此候选中未使用 |

<a id="t173"></a>

## t173 · ContextBindingEndpoint

首次入口：`$.contextBindings[].host`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `classification` | [ClassificationPath (t16)](#t16) | 必填 | 工作流输出或关系端点的分类范围。 | 该分支在此候选中未使用 |
| `referenceField` | string | 必填 | 关系端点所持的对应记录引用字段。 | 该分支在此候选中未使用 |

<a id="t174"></a>

## t174 · WorkflowDefinition

首次入口：`$.workflows[]`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `id` | string | 必填 | 当前对象的稳定标识；唯一性范围取决于对象类型。 | `/workflows/0/id`；第 109525 行 |
| `label` | [LocalizedText (t1)](#t1) | 必填 | 名称对象或 Label 样式对象；必须结合所在路径解读。 | `/workflows/0/label`；第 109526 行 |
| `mode` | `"external"` / `"composed"` | 必填 | 当前联合结构的分支选择器；先看 mode，再解释其余字段。 | `/workflows/0/mode`；第 109538 行 |
| `quickMapping` | `false` / `true` | 可选 | 是否允许此工作流从便捷测绘采集入口选用。 | `/workflows/20/quickMapping`；第 114775 行 |
| `editor` | [$.workflows[].editor (t175)](#t175) | 可选 | 工作流式编辑方案设置，或字段是否可在编辑场景使用。 | `/workflows/3/editor`；第 109619 行 |
| `actor` | [$.workflows[].actor (t177)](#t177) | 可选 | 填写人页要求；运行时收集填写人。 | `/workflows/20/actor`；第 114721 行 |
| `target` | [ClassificationPath (t16)](#t16) | 可选 | 目标分类范围，或输出赋值的目标字段路径；二者不能混用。 | `/workflows/3/target`；第 109806 行 |
| `steps` | 数组<[WorkflowStep (t178)](#t178)> | 必填 | 工作流页面数组，顺序即页面执行顺序。 | `/workflows/0/steps`；第 109540 行 |
| `outputs` | 数组<[WorkflowOutput (t193)](#t193)> | 必填 | 工作流输出要素数组；每个原生输出对应一张输出绘制页。 | `/workflows/0/outputs`；第 109539 行 |
| `assignments` | 数组<[WorkflowAssignment (t194)](#t194)> | 可选 | 输出组装规则数组；将槽位/公式结果写入真实数据字段。 | 该分支在此候选中未使用 |
| `external` | [$.workflows[].external (t196)](#t196) | 可选 | 已完成外部工作流单元的受控入口配置。 | `/workflows/0/external`；第 109515 行 |
| `legacy` | [$.workflows[].legacy (t197)](#t197) | 可选 | 迁移来源及兼容元数据，不应作为新功能的主要入口。 | `/workflows/0/legacy`；第 109530 行 |

<a id="t175"></a>

## t175 · $.workflows[].editor

首次入口：`$.workflows[].editor`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `enabled` | boolean | 必填 | 启用标记；false 不等于删除定义，具体作用范围取决于所在模块。 | `/workflows/3/editor/enabled`；第 109620 行 |
| `dedicated` | `false` / `true` | 可选 | 是否为专供再次编辑的工作流。 | `/workflows/20/editor/dedicated`；第 114725 行 |
| `scope` | [ClassificationPath (t16)](#t16) | 可选 | 字段根/标签/扩展分组，或编辑工作流适用范围等。 | `/workflows/20/editor/scope`；第 114727 行 |
| `backfill` | 数组<[$.workflows[].editor.backfill[] (t176)](#t176)> | 可选 | 编辑工作流的显式数据回灌映射。 | 该分支在此候选中未使用 |

<a id="t176"></a>

## t176 · $.workflows[].editor.backfill[]

首次入口：`$.workflows[].editor.backfill[]`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `slot` | string | 必填 | 工作流运行中的信息槽位名；不是最终记录字段名。 | 该分支在此候选中未使用 |
| `target` | string | 必填 | 目标分类范围，或输出赋值的目标字段路径；二者不能混用。 | 该分支在此候选中未使用 |

<a id="t177"></a>

## t177 · $.workflows[].actor

首次入口：`$.workflows[].actor`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `required` | boolean | 必填 | 是否必填；系统 World 设置中固定为 true，其他位置按控件或字段解释。 | `/workflows/20/actor/required`；第 114722 行 |

<a id="t178"></a>

## t178 · WorkflowStep

首次入口：`$.workflows[].steps[]`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `id` | string | 必填 | 当前对象的稳定标识；唯一性范围取决于对象类型。 | `/workflows/3/steps/0/id`；第 109676 行 |
| `kind` | `"geometry"` / `"actor"` / `"form"` / `"tagsExtensions"` / `"special"` | 必填 | 分类路径第二级，或条件/控件的分支种类；依所在对象判读。 | `/workflows/3/steps/0/kind`；第 109677 行 |
| `label` | [LocalizedText (t1)](#t1) | 必填 | 名称对象或 Label 样式对象；必须结合所在路径解读。 | `/workflows/3/steps/0/label`；第 109678 行 |
| `subtitle` | [LocalizedText (t1)](#t1) | 可选 | 搜索结果副标题设置，或工作流页面副标题。 | 该分支在此候选中未使用 |
| `controls` | 数组<[WorkflowControl (t179)](#t179)> | 可选 | 当前页的信息收集控件数组。 | `/workflows/3/steps/1/controls`；第 109684 行 |
| `geometry` | 数组<`"Point"` / `"LineString"` / `"Polygon"`> | 可选 | 当前绘制的几何类型、几何输入继承选项或输出几何设置。 | `/workflows/3/steps/2/geometry`；第 109793 行 |
| `outputId` | string | 可选 | 绘制页、系统分类控件或绑定所对应的工作流输出 ID。 | `/workflows/3/steps/2/outputId`；第 109803 行 |
| `geometryRole` | `"output"` / `"auxiliary"` | 可选 | 此绘制页是输出要素几何还是额外辅助绘制。 | `/workflows/3/steps/2/geometryRole`；第 109796 行 |
| `when` | [WorkflowValueCondition (t182)](#t182) | 可选 | 当前规则/模块生效条件；渲染、工作流和旧条件数组语法不同。 | `/workflows/18/steps/3/when`；第 114398 行 |
| `specialKey` | string | 可选 | 旧特殊工作流页面键。 | 该分支在此候选中未使用 |
| `tagsExtensions` | [$.workflows[].steps[].tagsExtensions (t189)](#t189) | 可选 | 工作流标签与扩展固定单元的启用设置。 | 该分支在此候选中未使用 |
| `drawing` | [$.workflows[].steps[].drawing (t190)](#t190) | 可选 | 当前绘制页的返回格式、槽位、条件与字段绑定设置。 | `/workflows/3/steps/2/drawing`；第 109788 行 |
| `legacyPage` | [Record (t157)](#t157) | 可选 | 旧工作流页面内容的兼容保留信息。 | 该分支在此候选中未使用 |

<a id="t179"></a>

## t179 · WorkflowControl

首次入口：`$.workflows[].steps[].controls[]`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `optionTable` | [OptionTable (t48)](#t48) | 可选 | 当前模块本地对照表；含 valueType 和 rows。 | `/workflows/22/steps/1/controls/4/optionTable`；第 115285 行 |
| `optionsFieldRef` | [FieldDefinitionRef (t164)](#t164) | 可选 | 仅对照表实时绑定到指定字段 nodeId+fieldId。 | 该分支在此候选中未使用 |
| `prefillAudit` | [PrefillAudit (t106)](#t106) | 可选 | 预填来源的审计指纹；只用于提醒陈旧，不建立运行时绑定。 | `/workflows/22/steps/1/controls/4/prefillAudit`；第 115347 行 |
| `prefillField` | string | 可选 | 单次预填后留下的本地目标字段提示，不是实时来源引用。 | 该分支在此候选中未使用 |
| `id` | string | 必填 | 当前对象的稳定标识；唯一性范围取决于对象类型。 | `/workflows/3/steps/1/controls/0/id`；第 109692 行 |
| `slot` | string | 可选 | 工作流运行中的信息槽位名；不是最终记录字段名。 | `/workflows/3/steps/1/controls/1/slot`；第 109711 行 |
| `valueNormalization` | `"number"` / `"none"` / `"trim"` / `"abbr"` | 可选 | 输入保存值处理：保留、去空白、简称或转数字。 | `/workflows/3/steps/1/controls/1/valueNormalization`；第 109712 行 |
| `kind` | `"number"` / `"text"` / `"select"` / `"json"` / `"textarea"` / `"toggle"` / `"featureSearch"` / `"component"` / `"tagsExtensions"` / `"classificationPicker"` / `"coarseSearch"` / `"group"` / `"notice"` / `"runtimeValue"` | 必填 | 分类路径第二级，或条件/控件的分支种类；依所在对象判读。 | `/workflows/3/steps/1/controls/0/kind`；第 109693 行 |
| `columns` | `3` / `2` / `1` | 必填 | 控件宽度档位：1 占整行，2 半行，3 三分之一行。 | `/workflows/3/steps/1/controls/0/columns`；第 109691 行 |
| `label` | [LocalizedText (t1)](#t1) | 必填 | 名称对象或 Label 样式对象；必须结合所在路径解读。 | `/workflows/3/steps/1/controls/0/label`；第 109694 行 |
| `fieldSource` | [WorkflowFieldSource (t180)](#t180) | 可选 | 旧式字段来源快照和覆写列表；现代预填/绑定另有明确字段。 | 该分支在此候选中未使用 |
| `fieldFormat` | `"boolean"` / `"plain"` / `"externalLink"` / `"date"` / `"json"` | 可选 | 工作流控件的填写/显示格式提示。 | 该分支在此候选中未使用 |
| `optionValueType` | `"string"` / `"number"` / `"boolean"` | 可选 | 选项保存为文本、数字或布尔值；value 文本会按此解释。 | `/workflows/22/steps/1/controls/4/optionValueType`；第 115346 行 |
| `requiredWhen` | 数组<[WorkflowValueCondition (t182)](#t182)> | 可选 | 条件必填规则；字段和工作流使用不同的条件结构。 | 该分支在此候选中未使用 |
| `options` | 数组<[SelectOption (t42)](#t42)> | 可选 | 控件本地选项数组、组件设置对象等；不能跨对象套用。 | 该分支在此候选中未使用 |
| `optionsTableId` | string | 可选 | 实时引用公共表 lookupTables[].id，不保存独立可编辑副本。 | 该分支在此候选中未使用 |
| `optionSource` | [$.workflows[].steps[].controls[].optionSource (t183)](#t183) | 可选 | 旧 optionSets 的来源引用，原生 r8+ 不作为新公共表入口。 | 该分支在此候选中未使用 |
| `placeholder` | string | 可选 | 输入提示文字；不等于默认值，也不写入记录。 | `/workflows/3/steps/1/controls/2/placeholder`；第 109722 行 |
| `defaultValue` | JSON | 可选 | 初始输入值；类型须与字段或控件格式相容。 | `/workflows/18/steps/1/controls/3/defaultValue`；第 114155 行 |
| `rows` | number | 可选 | 公共表/本地表的行数组，或文字控件行高；以所在类型区分。 | `/workflows/3/steps/1/controls/5/rows`；第 109760 行 |
| `search` | [SearchProfile (t184)](#t184) | 可选 | 分类搜索规则、工作流搜索控件参数或应用搜索偏好。 | `/workflows/4/steps/1/controls/4/search`；第 109952 行 |
| `classificationScope` | [ClassificationPath (t16)](#t16) | 可选 | 系统分类控件可选择的分类范围。 | `/workflows/3/steps/1/controls/0/classificationScope`；第 109686 行 |
| `outputId` | string | 可选 | 绘制页、系统分类控件或绑定所对应的工作流输出 ID。 | `/workflows/3/steps/1/controls/0/outputId`；第 109698 行 |
| `required` | `false` / `true` | 可选 | 是否必填；系统 World 设置中固定为 true，其他位置按控件或字段解释。 | `/workflows/3/steps/1/controls/0/required`；第 109699 行 |
| `when` | [WorkflowValueCondition (t182)](#t182) | 可选 | 当前规则/模块生效条件；渲染、工作流和旧条件数组语法不同。 | 该分支在此候选中未使用 |
| `systemManaged` | `false` / `true` | 可选 | 编辑器维护的固定单元标记，如分类控件与标签扩展单元。 | `/workflows/3/steps/1/controls/0/systemManaged`；第 109700 行 |
| `group` | [WorkflowRepeatGroup (t186)](#t186) | 可选 | 按钮视觉分组，或重复字段组定义。 | `/workflows/17/steps/1/controls/9/group`；第 113707 行 |
| `tagsExtensions` | [$.workflows[].steps[].controls[].tagsExtensions (t188)](#t188) | 可选 | 工作流标签与扩展固定单元的启用设置。 | `/workflows/3/steps/1/controls/6/tagsExtensions`；第 109773 行 |
| `componentKey` | string | 可选 | 已登记代码组件/外部工作流的稳定键。 | 该分支在此候选中未使用 |
| `legacyBlock` | [Record (t157)](#t157) | 可选 | 旧工作流区块的兼容信息。 | 该分支在此候选中未使用 |

<a id="t180"></a>

## t180 · WorkflowFieldSource

首次入口：`$.workflows[].steps[].controls[].fieldSource`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `nodeId` | string | 必填 | 分类节点稳定 ID；children 与字段引用通过它定位。 | 该分支在此候选中未使用 |
| `fieldId` | string | 必填 | 字段稳定身份；同一有效分类内不同 key 不得共用它。 | 该分支在此候选中未使用 |
| `snapshot` | [Pick (t181)](#t181) | 必填 | 旧字段来源的快照，不会自动代表当前实时字段定义。 | 该分支在此候选中未使用 |
| `overrides` | 数组<string> | 必填 | 旧字段来源快照允许覆写的属性名列表。 | 该分支在此候选中未使用 |

<a id="t181"></a>

## t181 · Pick

首次入口：`$.workflows[].steps[].controls[].fieldSource.snapshot`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `placeholder` | string | 可选 | 输入提示文字；不等于默认值，也不写入记录。 | 该分支在此候选中未使用 |
| `reference` | [$.nodes[].fields[].reference (t101)](#t101) | 可选 | 字段的关联记录查找声明。 | 该分支在此候选中未使用 |
| `required` | `false` / `true` | 可选 | 是否必填；系统 World 设置中固定为 true，其他位置按控件或字段解释。 | 该分支在此候选中未使用 |
| `key` | string | 必填 | 真实数据字段路径或重复组成员键；不等于 fieldId。 | 该分支在此候选中未使用 |
| `type` | `"string"` / `"number"` / `"boolean"` / `"enum"` / `"json"` / `"reference"` | 必填 | 数据类型，或受控组件选项的输入类型。 | 该分支在此候选中未使用 |
| `cardinality` | `"single"` / `"multiple"` | 必填 | 字段值数量：single 单值，multiple 数组多值。 | 该分支在此候选中未使用 |
| `labels` | [LocalizedText (t1)](#t1) | 必填 | 字段或分类的人类可读中英文标题。 | 该分支在此候选中未使用 |
| `options` | 数组<[SelectOption (t42)](#t42)> | 可选 | 控件本地选项数组、组件设置对象等；不能跨对象套用。 | 该分支在此候选中未使用 |
| `optionValueType` | `"string"` / `"number"` / `"boolean"` | 可选 | 选项保存为文本、数字或布尔值；value 文本会按此解释。 | 该分支在此候选中未使用 |
| `format` | `"boolean"` / `"plain"` / `"externalLink"` / `"date"` / `"json"` | 可选 | 字段/显示格式；只允许当前类型枚举中的受控格式。 | 该分支在此候选中未使用 |
| `defaultValue` | JSON | 可选 | 初始输入值；类型须与字段或控件格式相容。 | 该分支在此候选中未使用 |
| `requiredWhen` | 数组<[$.nodes[].fields[].requiredWhen[] (t93)](#t93) / [$.nodes[].fields[].requiredWhen[] (t94)](#t94) / [$.nodes[].fields[].requiredWhen[] (t95)](#t95) / [$.nodes[].fields[].requiredWhen[] (t96)](#t96) / [$.nodes[].fields[].requiredWhen[] (t97)](#t97) / [$.nodes[].fields[].requiredWhen[] (t98)](#t98)> | 可选 | 条件必填规则；字段和工作流使用不同的条件结构。 | 该分支在此候选中未使用 |
| `input` | `"text"` / `"select"` / `"json"` / `"textarea"` / `"toggle"` / `"featureSearch"` | 必填 | 字段定义建议的输入方式；实际工作流控件仍有自身配置。 | 该分支在此候选中未使用 |

<a id="t182"></a>

## t182 · WorkflowValueCondition

首次入口：`$.workflows[].steps[].controls[].requiredWhen[]`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `token` | string | 必填 | 工作流条件引用的先前槽位/系统值名称。 | `/workflows/18/steps/3/when/token`；第 114400 行 |
| `operator` | `"in"` / `"present"` / `"empty"` / `"equals"` | 必填 | 单个字段/槽位条件的比较操作符。 | `/workflows/18/steps/3/when/operator`；第 114399 行 |
| `value` | string / number / `false` / `true` | 可选 | 最终存储值、条件比较值或常量；是否字符串须看当前类型声明。 | 该分支在此候选中未使用 |
| `values` | 数组<string / number / `false` / `true`> | 可选 | 条件允许的比较值集合；严格比较时类型也须匹配。 | 该分支在此候选中未使用 |
| `all` | 数组<[WorkflowValueCondition (t182)](#t182)> | 可选 | 工作流条件数组全部成立才通过；不能与其他条件写法混淆。 | 该分支在此候选中未使用 |
| `any` | 数组<[WorkflowValueCondition (t182)](#t182)> | 可选 | 工作流条件数组至少一个成立才通过。 | 该分支在此候选中未使用 |

<a id="t183"></a>

## t183 · $.workflows[].steps[].controls[].optionSource

首次入口：`$.workflows[].steps[].controls[].optionSource`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `registryKey` | string | 必填 | 旧登记表中的稳定选项 ID。 | 该分支在此候选中未使用 |

<a id="t184"></a>

## t184 · SearchProfile

首次入口：`$.workflows[].steps[].controls[].search`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `target` | [ClassificationPath (t16)](#t16) | 必填 | 目标分类范围，或输出赋值的目标字段路径；二者不能混用。 | `/workflows/4/steps/1/controls/4/search/target`；第 109964 行 |
| `targetRole` | `"main"` | 可选 | 按通用主结构身份找目标，当前可选 main。 | `/workflows/16/steps/1/controls/5/search/targetRole`；第 113312 行 |
| `queryFields` | 数组<string> | 可选 | 可被主页/导航粗搜索匹配的字段路径列表。 | `/workflows/4/steps/1/controls/4/search/queryFields`；第 109959 行 |
| `displayTemplate` | string | 可选 | 搜索候选展示模板；使用 {{ID}} 等双花括号，占位语法不同于 Label。 | `/workflows/4/steps/1/controls/4/search/displayTemplate`；第 109955 行 |
| `returnField` | string | 可选 | 工作流搜索最终返回的目标字段。 | `/workflows/4/steps/1/controls/4/search/returnField`；第 109963 行 |
| `matcher` | `"contains"` / `"prefix"` / `"token"` / `"fuzzy"` | 可选 | contains/prefix/token/fuzzy 等受控搜索匹配方式。 | `/workflows/4/steps/1/controls/4/search/matcher`；第 109956 行 |
| `minQueryLength` | number | 可选 | 触发搜索所需的最少输入字符数。 | `/workflows/4/steps/1/controls/4/search/minQueryLength`；第 109958 行 |
| `maxResults` | number | 可选 | 搜索返回候选数量上限。 | `/workflows/4/steps/1/controls/4/search/maxResults`；第 109957 行 |
| `debounceMs` | number | 可选 | 搜索输入防抖延迟，单位毫秒。 | `/workflows/4/steps/1/controls/4/search/debounceMs`；第 109954 行 |
| `cacheScope` | `"world"` / `"loadedWorlds"` | 必填 | 搜索只在当前世界还是全部已加载世界中查找。 | `/workflows/4/steps/1/controls/4/search/cacheScope`；第 109953 行 |
| `mode` | `"feature"` / `"coarse"` | 可选 | 当前联合结构的分支选择器；先看 mode，再解释其余字段。 | 该分支在此候选中未使用 |
| `searchFields` | 数组<string> | 可选 | 工作流搜索控件使用的候选匹配字段。 | 该分支在此候选中未使用 |
| `displayFields` | 数组<string> | 可选 | 搜索候选展示字段列表。 | 该分支在此候选中未使用 |
| `returnFields` | 数组<string> | 可选 | 搜索候选返回字段的列表。 | 该分支在此候选中未使用 |
| `coarse` | [$.workflows[].steps[].controls[].search.coarse (t185)](#t185) | 可选 | 搜索控件粗搜索的开关和显示设置。 | 该分支在此候选中未使用 |

<a id="t185"></a>

## t185 · $.workflows[].steps[].controls[].search.coarse

首次入口：`$.workflows[].steps[].controls[].search.coarse`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `matcher` | `"contains"` / `"prefix"` / `"token"` / `"fuzzy"` | 必填 | contains/prefix/token/fuzzy 等受控搜索匹配方式。 | 该分支在此候选中未使用 |
| `minQueryLength` | number | 必填 | 触发搜索所需的最少输入字符数。 | 该分支在此候选中未使用 |
| `maxResults` | number | 必填 | 搜索返回候选数量上限。 | 该分支在此候选中未使用 |
| `debounceMs` | number | 可选 | 搜索输入防抖延迟，单位毫秒。 | 该分支在此候选中未使用 |

<a id="t186"></a>

## t186 · WorkflowRepeatGroup

首次入口：`$.workflows[].steps[].controls[].group`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `itemFields` | 数组<[WorkflowGroupField (t187)](#t187)> | 必填 | 重复字段组中每个项目包含的子字段定义。 | `/workflows/17/steps/1/controls/9/group/itemFields`；第 113712 行 |
| `storage` | `"object"` / `"scalar"` | 可选 | 重复组保存为对象数组还是纯值数组。 | `/workflows/20/steps/1/controls/3/group/storage`；第 114840 行 |
| `optional` | `false` / `true` | 可选 | 重复组是否允许零项。 | `/workflows/17/steps/1/controls/9/group/optional`；第 113770 行 |
| `minItems` | number | 可选 | 重复组至少需要多少项。 | `/workflows/20/steps/1/controls/3/group/minItems`；第 114838 行 |
| `addLabel` | [LocalizedText (t1)](#t1) | 可选 | 重复组添加一项按钮的中英文名称。 | `/workflows/17/steps/1/controls/9/group/addLabel`；第 113708 行 |

<a id="t187"></a>

## t187 · WorkflowGroupField

首次入口：`$.workflows[].steps[].controls[].group.itemFields[]`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `optionTable` | [OptionTable (t48)](#t48) | 可选 | 当前模块本地对照表；含 valueType 和 rows。 | `/workflows/17/steps/1/controls/9/group/itemFields/0/optionTable`；第 113721 行 |
| `optionsFieldRef` | [FieldDefinitionRef (t164)](#t164) | 可选 | 仅对照表实时绑定到指定字段 nodeId+fieldId。 | 该分支在此候选中未使用 |
| `prefillAudit` | [PrefillAudit (t106)](#t106) | 可选 | 预填来源的审计指纹；只用于提醒陈旧，不建立运行时绑定。 | 该分支在此候选中未使用 |
| `prefillField` | string | 可选 | 单次预填后留下的本地目标字段提示，不是实时来源引用。 | 该分支在此候选中未使用 |
| `key` | string | 必填 | 真实数据字段路径或重复组成员键；不等于 fieldId。 | `/workflows/17/steps/1/controls/9/group/itemFields/0/key`；第 113715 行 |
| `label` | [LocalizedText (t1)](#t1) | 必填 | 名称对象或 Label 样式对象；必须结合所在路径解读。 | `/workflows/17/steps/1/controls/9/group/itemFields/0/label`；第 113717 行 |
| `kind` | `"number"` / `"text"` / `"select"` / `"json"` / `"textarea"` / `"toggle"` / `"featureSearch"` / `"coarseSearch"` | 必填 | 分类路径第二级，或条件/控件的分支种类；依所在对象判读。 | `/workflows/17/steps/1/controls/9/group/itemFields/0/kind`；第 113716 行 |
| `required` | `false` / `true` | 可选 | 是否必填；系统 World 设置中固定为 true，其他位置按控件或字段解释。 | `/workflows/17/steps/1/controls/9/group/itemFields/0/required`；第 113741 行 |
| `options` | 数组<[SelectOption (t42)](#t42)> | 可选 | 控件本地选项数组、组件设置对象等；不能跨对象套用。 | 该分支在此候选中未使用 |
| `optionsTableId` | string | 可选 | 实时引用公共表 lookupTables[].id，不保存独立可编辑副本。 | 该分支在此候选中未使用 |
| `placeholder` | string | 可选 | 输入提示文字；不等于默认值，也不写入记录。 | `/workflows/17/steps/1/controls/9/group/itemFields/1/placeholder`；第 113750 行 |
| `defaultValue` | JSON | 可选 | 初始输入值；类型须与字段或控件格式相容。 | `/workflows/17/steps/1/controls/9/group/itemFields/0/defaultValue`；第 113714 行 |
| `rows` | number | 可选 | 公共表/本地表的行数组，或文字控件行高；以所在类型区分。 | 该分支在此候选中未使用 |
| `search` | [SearchProfile (t184)](#t184) | 可选 | 分类搜索规则、工作流搜索控件参数或应用搜索偏好。 | `/workflows/17/steps/1/controls/9/group/itemFields/1/search`；第 113752 行 |
| `optionValueType` | `"string"` / `"number"` / `"boolean"` | 可选 | 选项保存为文本、数字或布尔值；value 文本会按此解释。 | `/workflows/17/steps/1/controls/9/group/itemFields/0/optionValueType`；第 113740 行 |
| `fieldFormat` | `"boolean"` / `"plain"` / `"externalLink"` / `"date"` / `"json"` | 可选 | 工作流控件的填写/显示格式提示。 | 该分支在此候选中未使用 |
| `fieldSource` | [WorkflowFieldSource (t180)](#t180) | 可选 | 旧式字段来源快照和覆写列表；现代预填/绑定另有明确字段。 | 该分支在此候选中未使用 |
| `requiredWhen` | 数组<[WorkflowValueCondition (t182)](#t182)> | 可选 | 条件必填规则；字段和工作流使用不同的条件结构。 | 该分支在此候选中未使用 |
| `valueNormalization` | `"number"` / `"none"` / `"trim"` / `"abbr"` | 可选 | 输入保存值处理：保留、去空白、简称或转数字。 | 该分支在此候选中未使用 |

<a id="t188"></a>

## t188 · $.workflows[].steps[].controls[].tagsExtensions

首次入口：`$.workflows[].steps[].controls[].tagsExtensions`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `tagsEnabled` | boolean | 必填 | 是否开放标签输入。 | `/workflows/3/steps/1/controls/6/tagsExtensions/tagsEnabled`；第 109775 行 |
| `extensionsEnabled` | boolean | 必填 | 是否开放扩展输入。 | `/workflows/3/steps/1/controls/6/tagsExtensions/extensionsEnabled`；第 109774 行 |

<a id="t189"></a>

## t189 · $.workflows[].steps[].tagsExtensions

首次入口：`$.workflows[].steps[].tagsExtensions`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `tagsEnabled` | boolean | 必填 | 是否开放标签输入。 | 该分支在此候选中未使用 |
| `extensionsEnabled` | boolean | 必填 | 是否开放扩展输入。 | 该分支在此候选中未使用 |

<a id="t190"></a>

## t190 · $.workflows[].steps[].drawing

首次入口：`$.workflows[].steps[].drawing`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `enabledFromThisPage` | `false` / `true` | 可选 | 进入绘制页时是否自动启用此绘制。 | `/workflows/3/steps/2/drawing/enabledFromThisPage`；第 109789 行 |
| `drawMode` | string | 可选 | 旧式绘制模式提示，须与固定点/线/面类型一致。 | 该分支在此候选中未使用 |
| `allowBack` | `false` / `true` | 可选 | 此绘制页是否允许返回上一页。 | `/workflows/18/steps/3/drawing/allowBack`；第 114368 行 |
| `keepDrawingWhenBack` | `false` / `true` | 可选 | 返回信息页时保留最后离开绘制页的活动绘制状态。 | `/workflows/3/steps/2/drawing/keepDrawingWhenBack`；第 109790 行 |
| `pointSlot` | string | 可选 | 旧单点返回槽位；现代绘制使用 captureSlot 与 returnFormat。 | 该分支在此候选中未使用 |
| `auxiliaryPoints` | 数组<[WorkflowAuxiliaryPoint (t191)](#t191)> | 可选 | 旧内嵌辅助点列表；现代额外绘制为独立 geometry 页。 | 该分支在此候选中未使用 |
| `captureSlot` | string | 可选 | 绘制返回写入的槽位名，还会派生 _X/_Y/_Z/_HEIGHT 等值。 | `/workflows/18/steps/2/drawing/captureSlot`；第 114335 行 |
| `returnFormat` | `"coordP"` / `"pointObject"` / `"coordL"` / `"coordG"` | 可选 | 绘制返回 CoordP/CoordL/CoordG 数组或单点 {x,y,z}。 | `/workflows/18/steps/2/drawing/returnFormat`；第 114340 行 |
| `multiple` | `false` / `true` | 可选 | 当前绘制页是否允许多部件/多点；与分类 allowMultipleParts 是两层设置，当前按钮联动尚有已知缺口。 | `/workflows/3/steps/2/drawing/multiple`；第 109791 行 |
| `heightSlot` | string | 可选 | 可选的高度输入槽位，必须对应有效数值输入。 | `/workflows/18/steps/2/drawing/heightSlot`；第 114337 行 |
| `bindings` | 数组<[$.workflows[].steps[].drawing.bindings[] (t192)](#t192)> | 可选 | 世界到来源组的映射，或绘制返回字段绑定数组。 | `/workflows/18/steps/2/drawing/bindings`；第 114328 行 |

<a id="t191"></a>

## t191 · WorkflowAuxiliaryPoint

首次入口：`$.workflows[].steps[].drawing.auxiliaryPoints[]`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `id` | string | 必填 | 当前对象的稳定标识；唯一性范围取决于对象类型。 | 该分支在此候选中未使用 |
| `slot` | string | 必填 | 工作流运行中的信息槽位名；不是最终记录字段名。 | 该分支在此候选中未使用 |
| `label` | [LocalizedText (t1)](#t1) | 必填 | 名称对象或 Label 样式对象；必须结合所在路径解读。 | 该分支在此候选中未使用 |
| `required` | `false` / `true` | 可选 | 是否必填；系统 World 设置中固定为 true，其他位置按控件或字段解释。 | 该分支在此候选中未使用 |
| `when` | [WorkflowValueCondition (t182)](#t182) | 可选 | 当前规则/模块生效条件；渲染、工作流和旧条件数组语法不同。 | 该分支在此候选中未使用 |

<a id="t192"></a>

## t192 · $.workflows[].steps[].drawing.bindings[]

首次入口：`$.workflows[].steps[].drawing.bindings[]`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `outputId` | string | 必填 | 绘制页、系统分类控件或绑定所对应的工作流输出 ID。 | `/workflows/18/steps/2/drawing/bindings/0/outputId`；第 114330 行 |
| `target` | string | 必填 | 目标分类范围，或输出赋值的目标字段路径；二者不能混用。 | `/workflows/18/steps/2/drawing/bindings/0/target`；第 114331 行 |
| `value` | `"geometry"` / `"height"` | 必填 | 最终存储值、条件比较值或常量；是否字符串须看当前类型声明。 | `/workflows/18/steps/2/drawing/bindings/0/value`；第 114332 行 |

<a id="t193"></a>

## t193 · WorkflowOutput

首次入口：`$.workflows[].outputs[]`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `id` | string | 必填 | 当前对象的稳定标识；唯一性范围取决于对象类型。 | `/workflows/3/outputs/0/id`；第 109671 行 |
| `classification` | [ClassificationPath (t16)](#t16) | 必填 | 工作流输出或关系端点的分类范围。 | `/workflows/3/outputs/0/classification`；第 109663 行 |
| `assignments` | 数组<[WorkflowAssignment (t194)](#t194)> | 必填 | 输出组装规则数组；将槽位/公式结果写入真实数据字段。 | `/workflows/3/outputs/0/assignments`；第 109636 行 |
| `when` | [WorkflowValueCondition (t182)](#t182) | 可选 | 当前规则/模块生效条件；渲染、工作流和旧条件数组语法不同。 | 该分支在此候选中未使用 |
| `geometry` | [$.workflows[].outputs[].geometry (t195)](#t195) | 必填 | 当前绘制的几何类型、几何输入继承选项或输出几何设置。 | `/workflows/3/outputs/0/geometry`；第 109668 行 |

<a id="t194"></a>

## t194 · WorkflowAssignment

首次入口：`$.workflows[].outputs[].assignments[]`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `id` | string | 必填 | 当前对象的稳定标识；唯一性范围取决于对象类型。 | `/workflows/3/outputs/0/assignments/0/id`；第 109639 行 |
| `target` | string | 必填 | 目标分类范围，或输出赋值的目标字段路径；二者不能混用。 | `/workflows/3/outputs/0/assignments/0/target`；第 109640 行 |
| `expression` | string | 必填 | 工作流组装公式或条件编号布尔公式；两者语法不同。 | `/workflows/3/outputs/0/assignments/0/expression`；第 109638 行 |
| `when` | [WorkflowValueCondition (t182)](#t182) | 可选 | 当前规则/模块生效条件；渲染、工作流和旧条件数组语法不同。 | 该分支在此候选中未使用 |

<a id="t195"></a>

## t195 · $.workflows[].outputs[].geometry

首次入口：`$.workflows[].outputs[].geometry`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `selected` | `"Point"` / `"LineString"` / `"Polygon"` | 必填 | 选中状态的外观；在工作流 geometry 中则表示固定几何类型。 | `/workflows/3/outputs/0/geometry/selected`；第 109669 行 |
| `allowed` | 数组<`"Point"` / `"LineString"` / `"Polygon"`> | 可选 | 粗搜索是否启用。 | 该分支在此候选中未使用 |

<a id="t196"></a>

## t196 · $.workflows[].external

首次入口：`$.workflows[].external`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `componentKey` | string | 必填 | 已登记代码组件/外部工作流的稳定键。 | `/workflows/0/external/componentKey`；第 109516 行 |
| `purpose` | `"capture"` / `"edit"` | 可选 | 外部方案用途：capture 采集，edit 专供编辑。 | `/workflows/0/external/purpose`；第 109522 行 |
| `version` | number | 可选 | 受控外部方案版本。 | `/workflows/27/external/version`；第 116176 行 |
| `reason` | `"railway-integrated"` / `"station-integrated"` / `"trp-integrated"` | 必填 | 允许保留该外部方案的集成理由。 | `/workflows/0/external/reason`；第 109523 行 |
| `coveredClassifications` | 数组<[ClassificationPath (t16)](#t16)> | 可选 | 外部方案明确服务的分类范围列表。 | `/workflows/0/external/coveredClassifications`；第 109517 行 |

<a id="t197"></a>

## t197 · $.workflows[].legacy

首次入口：`$.workflows[].legacy`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `runtimeMode` | string | 可选 | 旧工作流运行模式提示。 | `/workflows/3/legacy/runtimeMode`；第 109628 行 |
| `componentKey` | string | 可选 | 已登记代码组件/外部工作流的稳定键。 | `/workflows/0/legacy/componentKey`；第 109531 行 |
| `output` | [Record (t157)](#t157) | 可选 | 旧外部工作流输出说明，不是现代 outputs 数组。 | 该分支在此候选中未使用 |
| `source` | [Record (t157)](#t157) | 可选 | 信息卡字段来源、图标来源、预填来源或对齐文件位置；结合路径区分。 | `/workflows/0/legacy/source`；第 109532 行 |

<a id="t198"></a>

## t198 · ParityReport

首次入口：`$.parity`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `schemaVersion` | `"cairnmap.v1-parity-report.v2"` | 必填 | 文件结构标记；固定字符串用于识别整包、应用设置或对齐报告。 | `/parity/schemaVersion`；第 108777 行 |
| `sourceManifestSha256` | string | 可选 | 原始迁移来源清单的 SHA-256 摘要；不是整包当前内容的散列。 | 该分支在此候选中未使用 |
| `entries` | 数组<[ParityEntry (t199)](#t199)> | 必填 | 按值设色的逐行条目，或迁移对齐报告中的逐项记录。 | `/parity/entries`；第 108490 行 |
| `generatedAt` | string | 必填 | V1 对齐报告的生成时间。 | `/parity/generatedAt`；第 108776 行 |

<a id="t199"></a>

## t199 · ParityEntry

首次入口：`$.parity.entries[]`。

| 字段 | 类型/枚举/子结构 | 结构要求 | 中文解析 | 完整文件定位 |
| --- | --- | --- | --- | --- |
| `kind` | `"class"` / `"workflow"` / `"shared"` | 必填 | 分类路径第二级，或条件/控件的分支种类；依所在对象判读。 | `/parity/entries/0/kind`；第 108495 行 |
| `id` | string | 必填 | 当前对象的稳定标识；唯一性范围取决于对象类型。 | `/parity/entries/0/id`；第 108494 行 |
| `source` | string | 必填 | 信息卡字段来源、图标来源、预填来源或对齐文件位置；结合路径区分。 | `/parity/entries/0/source`；第 108496 行 |
| `status` | `"resolved"` / `"registryReference"` / `"unsupported"` | 必填 | V1 对齐项的迁移状态，而非要素审核状态。 | `/parity/entries/0/status`；第 108497 行 |
| `details` | string | 可选 | V1 对齐项的说明。 | `/parity/entries/0/details`；第 108492 行 |
| `fingerprint` | string | 可选 | 预填/来源内容的摘要，用于发现修改。 | `/parity/entries/0/fingerprint`；第 108493 行 |
