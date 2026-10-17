# 完整字段解析表

基准：契约 r11 / 修订 r7。共 178 种对象结构、1039 个命名字段位置。结构编号 t0/t1 只用于本手册内部跳转，不是配置文件字段。

必填性仅表示该类型分支的结构要求，额外语义仍由实际核验器检查。默认未出现的键不虚构实例值。类型路径是首次遍历入口，共用结构也可出现在其他位置。

| 编号 | 类型/首次入口 | 本包状态 |
| --- | --- | --- |
| [t0](#t0) | `ConfigPackageV3` | 实际出现 1 次 |
| [t1](#t1) | `LocalizedText` | 实际出现 2206 次 |
| [t2](#t2) | `ConfigEngineSettings` | 实际出现 1 次 |
| [t3](#t3) | `$.engine.world` | 实际出现 1 次 |
| [t4](#t4) | `$.engine.contextView` | 实际出现 1 次 |
| [t5](#t5) | `$.engine.screenGateDefaults` | 实际出现 1 次 |
| [t6](#t6) | `$.engine.interactionBaselines` | 实际出现 1 次 |
| [t7](#t7) | `GeometryInteractionBaseline` | 实际出现 3 次 |
| [t8](#t8) | `InteractionVisual` | 实际出现 15 次 |
| [t9](#t9) | `$.engine.interactionBaselines.Point.hover.symbol` | 实际出现 2 次 |
| [t10](#t10) | `$.engine.interactionBaselines.Point.hover.outline` | 实际出现 60 次 |
| [t11](#t11) | `$.engine.interactionBaselines.Point.hover.strokeColorBinding` | 契约支持但本包未出现 |
| [t12](#t12) | `$.engine.interactionBaselines.Point.hover.strokeColorBinding.entries[]` | 契约支持但本包未出现 |
| [t13](#t13) | `$.engine.interactionBaselines.Point.hover.strokeColorBinding` | 实际出现 305 次 |
| [t14](#t14) | `$.engine.interactionBaselines.Point.hover.strokeColorBinding` | 实际出现 96 次 |
| [t15](#t15) | `$.engine.interactionBaselines.Point.hover.strokeColorBinding` | 契约支持但本包未出现 |
| [t16](#t16) | `ClassificationPath` | 实际出现 417 次 |
| [t17](#t17) | `$.engine.interactionBaselines.Point.hover.strokeColorBinding` | 实际出现 18 次 |
| [t18](#t18) | `Record` | 实际出现 1 次 |
| [t19](#t19) | `Partial` | 契约支持但本包未出现 |
| [t20](#t20) | `RenderRuleExtensions` | 实际出现 201 次 |
| [t21](#t21) | `RenderScreenGate` | 实际出现 201 次 |
| [t22](#t22) | `$.engine.renderDefaults.Point.labelText` | 实际出现 201 次 |
| [t23](#t23) | `RenderLineLabelExtension` | 实际出现 51 次 |
| [t24](#t24) | `RenderAnchorExtension` | 实际出现 201 次 |
| [t25](#t25) | `$.engine.renderDefaults.Point.anchor.offsetPx` | 契约支持但本包未出现 |
| [t26](#t26) | `$.engine.renderDefaults.Point.anchor.candidateOffsetsPx[]` | 契约支持但本包未出现 |
| [t27](#t27) | `RenderPolygonCandidateExtension` | 实际出现 201 次 |
| [t28](#t28) | `RenderCollisionExtension` | 实际出现 201 次 |
| [t29](#t29) | `$.engine.renderDefaults.Point.collision.boundsAdjustment` | 实际出现 12 次 |
| [t30](#t30) | `RenderStabilityExtension` | 实际出现 201 次 |
| [t31](#t31) | `RenderDensityExtension` | 实际出现 201 次 |
| [t32](#t32) | `RenderFallbackExtension` | 实际出现 201 次 |
| [t33](#t33) | `RenderVisibilityExtension` | 实际出现 19 次 |
| [t34](#t34) | `$.engine.renderDefaults.Point.visibility.sameId` | 实际出现 2 次 |
| [t35](#t35) | `$.engine.renderDefaults.Point.visibility.coincidentPoint` | 实际出现 3 次 |
| [t36](#t36) | `$.engine.renderDefaults.Point.visibility.lineContainmentChoice` | 实际出现 8 次 |
| [t37](#t37) | `$.engine.renderDefaults.Point.visibility.activeContextMember` | 实际出现 6 次 |
| [t38](#t38) | `Partial` | 实际出现 30 次 |
| [t39](#t39) | `Partial` | 实际出现 60 次 |
| [t40](#t40) | `ConfigRegistries` | 实际出现 1 次 |
| [t41](#t41) | `$.registries.optionSets[]` | 契约支持但本包未出现 |
| [t42](#t42) | `SelectOption` | 实际出现 18 次 |
| [t43](#t43) | `ControlledRegistryItem` | 实际出现 87 次 |
| [t44](#t44) | `$.registries.cardLayouts[].optionSchema[]` | 契约支持但本包未出现 |
| [t45](#t45) | `LookupTable` | 实际出现 3 次 |
| [t46](#t46) | `$.lookupTables[].rows[]` | 实际出现 20 次 |
| [t47](#t47) | `TagFieldMetadata` | 实际出现 16 次 |
| [t48](#t48) | `OptionTable` | 实际出现 3 次 |
| [t49](#t49) | `$.lookupTables[].rows[].functionValue` | 实际出现 2 次 |
| [t50](#t50) | `$.lookupTables[].rows[].functionValue.returnPoints[]` | 实际出现 4 次 |
| [t51](#t51) | `ApplicationSettings` | 实际出现 1 次 |
| [t52](#t52) | `ApplicationWorld` | 实际出现 6 次 |
| [t53](#t53) | `ApplicationLabel` | 实际出现 19 次 |
| [t54](#t54) | `$.application.worlds[].center` | 实际出现 6 次 |
| [t55](#t55) | `ApplicationProjection` | 契约支持但本包未出现 |
| [t56](#t56) | `ApplicationTiles` | 契约支持但本包未出现 |
| [t57](#t57) | `ApplicationButtons` | 实际出现 1 次 |
| [t58](#t58) | `Record` | 实际出现 1 次 |
| [t59](#t59) | `ApplicationButton` | 实际出现 8 次 |
| [t60](#t60) | `CairnMapRuleButtonCriteria` | 实际出现 8 次 |
| [t61](#t61) | `$.application.buttons.items[].criteria.paths[]` | 实际出现 20 次 |
| [t62](#t62) | `CairnMapRuleButtonBehavior` | 实际出现 8 次 |
| [t63](#t63) | `CairnMapRuleButtonLinkedButton` | 契约支持但本包未出现 |
| [t64](#t64) | `ApplicationSourceSettings` | 实际出现 1 次 |
| [t65](#t65) | `$.application.sources.items[]` | 实际出现 2 次 |
| [t66](#t66) | `$.application.sources.github` | 实际出现 1 次 |
| [t67](#t67) | `$.application.sources.linkModes` | 实际出现 1 次 |
| [t68](#t68) | `$.application.sources.linkModes.items[]` | 实际出现 2 次 |
| [t69](#t69) | `ApplicationWorldGroups` | 实际出现 1 次 |
| [t70](#t70) | `ApplicationResourceGroup` | 实际出现 1 次 |
| [t71](#t71) | `ApplicationTileProfile` | 实际出现 1 次 |
| [t72](#t72) | `ApplicationAttribution` | 实际出现 1 次 |
| [t73](#t73) | `Record` | 实际出现 1 次 |
| [t74](#t74) | `ApplicationModules` | 实际出现 1 次 |
| [t75](#t75) | `$.application.modules.items[]` | 实际出现 8 次 |
| [t76](#t76) | `$.application.modules.players` | 实际出现 1 次 |
| [t77](#t77) | `ApplicationReview` | 实际出现 1 次 |
| [t78](#t78) | `$.application.review.auth` | 实际出现 1 次 |
| [t79](#t79) | `$.application.review.serverReferences` | 实际出现 1 次 |
| [t80](#t80) | `ApplicationPreferences` | 实际出现 1 次 |
| [t81](#t81) | `$.application.preferences.search` | 实际出现 1 次 |
| [t82](#t82) | `$.application.preferences.navigation` | 实际出现 1 次 |
| [t83](#t83) | `$.application.preferences.map` | 实际出现 1 次 |
| [t84](#t84) | `$.application.preferences.toolbar` | 实际出现 1 次 |
| [t85](#t85) | `CategoryNode` | 实际出现 95 次 |
| [t86](#t86) | `Partial` | 实际出现 95 次 |
| [t87](#t87) | `InheritanceControls` | 实际出现 95 次 |
| [t88](#t88) | `$.nodes[].receiveFromParent` | 契约支持但本包未出现 |
| [t89](#t89) | `$.nodes[].policies` | 实际出现 95 次 |
| [t90](#t90) | `FieldDefinition` | 实际出现 158 次 |
| [t91](#t91) | `$.nodes[].fields[].requiredWhen[]` | 契约支持但本包未出现 |
| [t92](#t92) | `$.nodes[].fields[].requiredWhen[]` | 契约支持但本包未出现 |
| [t93](#t93) | `$.nodes[].fields[].requiredWhen[]` | 契约支持但本包未出现 |
| [t94](#t94) | `$.nodes[].fields[].requiredWhen[]` | 实际出现 5 次 |
| [t95](#t95) | `$.nodes[].fields[].requiredWhen[]` | 实际出现 2 次 |
| [t96](#t96) | `$.nodes[].fields[].requiredWhen[]` | 实际出现 2 次 |
| [t97](#t97) | `$.nodes[].fields[].optionSource` | 契约支持但本包未出现 |
| [t98](#t98) | `$.nodes[].fields[].scenes` | 实际出现 70 次 |
| [t99](#t99) | `$.nodes[].fields[].reference` | 契约支持但本包未出现 |
| [t100](#t100) | `NodeFieldSettings` | 实际出现 16 次 |
| [t101](#t101) | `StructureRole` | 实际出现 4 次 |
| [t102](#t102) | `CategorySearch` | 实际出现 16 次 |
| [t103](#t103) | `$.nodes[].fieldSettings.search.subtitle` | 实际出现 16 次 |
| [t104](#t104) | `PrefillAudit` | 实际出现 180 次 |
| [t105](#t105) | `$.nodes[].fieldSettings.search.subtitle.prefillAudit.source` | 实际出现 180 次 |
| [t106](#t106) | `$.nodes[].fieldSettings.search.extension` | 实际出现 16 次 |
| [t107](#t107) | `Partial` | 实际出现 95 次 |
| [t108](#t108) | `GeometryProfile` | 实际出现 95 次 |
| [t109](#t109) | `$.nodes[].geometryProfiles.Point.style` | 契约支持但本包未出现 |
| [t110](#t110) | `GeometryStackPolicy` | 实际出现 201 次 |
| [t111](#t111) | `$.nodes[].geometryProfiles.Point.label` | 契约支持但本包未出现 |
| [t112](#t112) | `LabelCollisionPolicy` | 实际出现 201 次 |
| [t113](#t113) | `$.nodes[].geometryProfiles.Point.label.collision.metric` | 实际出现 24 次 |
| [t114](#t114) | `$.nodes[].geometryProfiles.Point.zoomPriority` | 实际出现 95 次 |
| [t115](#t115) | `ZoomPriorityRule` | 实际出现 201 次 |
| [t116](#t116) | `RenderRuleMatch` | 实际出现 201 次 |
| [t117](#t117) | `$.nodes[].geometryProfiles.Point.zoomPriority.rules[].when.zoom` | 实际出现 201 次 |
| [t118](#t118) | `RenderFieldGroup` | 实际出现 5 次 |
| [t119](#t119) | `$.nodes[].geometryProfiles.Point.zoomPriority.rules[].when.fields.items[]` | 契约支持但本包未出现 |
| [t120](#t120) | `RenderConditionFormula` | 实际出现 5 次 |
| [t121](#t121) | `$.nodes[].geometryProfiles.Point.zoomPriority.rules[].when.fields.formula.terms[]` | 实际出现 7 次 |
| [t122](#t122) | `$.nodes[].geometryProfiles.Point.zoomPriority.rules[].when.fields.formula.groups[]` | 契约支持但本包未出现 |
| [t123](#t123) | `RenderStyle` | 实际出现 201 次 |
| [t124](#t124) | `$.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.symbolOffsetPx` | 实际出现 6 次 |
| [t125](#t125) | `RenderPointIcon` | 实际出现 2 次 |
| [t126](#t126) | `RenderLabelStyle` | 实际出现 201 次 |
| [t127](#t127) | `RenderLabelVisualStyle` | 实际出现 201 次 |
| [t128](#t128) | `LabelStyleModifiers` | 契约支持但本包未出现 |
| [t129](#t129) | `Record` | 实际出现 6 次 |
| [t130](#t130) | `$.nodes[].geometryProfiles.Point.zoomPriority.rules[].interaction` | 契约支持但本包未出现 |
| [t131](#t131) | `GeometryInteractionTriggers` | 实际出现 95 次 |
| [t132](#t132) | `RenderRuleConditionalOverride` | 契约支持但本包未出现 |
| [t133](#t133) | `RenderPriority` | 实际出现 201 次 |
| [t134](#t134) | `AdvancedRenderRule` | 契约支持但本包未出现 |
| [t135](#t135) | `Record` | 实际出现 109 次 |
| [t136](#t136) | `$.nodes[].geometryProfiles.Point.zoomPriority.rules[].advanced.legacyRuntime` | 契约支持但本包未出现 |
| [t137](#t137) | `$.nodes[].geometryProfiles.Point.interaction` | 实际出现 95 次 |
| [t138](#t138) | `$.nodes[].geometryProfiles.Point.legacyDisplay` | 契约支持但本包未出现 |
| [t139](#t139) | `ContainmentBinding` | 契约支持但本包未出现 |
| [t140](#t140) | `$.nodes[].card` | 实际出现 90 次 |
| [t141](#t141) | `CardItem` | 实际出现 1134 次 |
| [t142](#t142) | `FieldDefinitionRef` | 契约支持但本包未出现 |
| [t143](#t143) | `$.nodes[].card.items[].inheritFrom` | 实际出现 868 次 |
| [t144](#t144) | `$.nodes[].card.items[].options` | 实际出现 244 次 |
| [t145](#t145) | `CardRelation` | 实际出现 23 次 |
| [t146](#t146) | `$.nodes[].card.remaining` | 实际出现 90 次 |
| [t147](#t147) | `$.nodes[].card` | 契约支持但本包未出现 |
| [t148](#t148) | `$.nodes[].card` | 实际出现 5 次 |
| [t149](#t149) | `$.nodes[].legacy` | 实际出现 89 次 |
| [t150](#t150) | `ContextBinding` | 契约支持但本包未出现 |
| [t151](#t151) | `ContextBindingEndpoint` | 契约支持但本包未出现 |
| [t152](#t152) | `WorkflowDefinition` | 实际出现 28 次 |
| [t153](#t153) | `$.workflows[].editor` | 实际出现 24 次 |
| [t154](#t154) | `$.workflows[].editor.backfill[]` | 契约支持但本包未出现 |
| [t155](#t155) | `$.workflows[].actor` | 实际出现 7 次 |
| [t156](#t156) | `WorkflowStep` | 实际出现 73 次 |
| [t157](#t157) | `WorkflowControl` | 实际出现 225 次 |
| [t158](#t158) | `WorkflowFieldSource` | 契约支持但本包未出现 |
| [t159](#t159) | `Pick` | 契约支持但本包未出现 |
| [t160](#t160) | `WorkflowValueCondition` | 实际出现 1 次 |
| [t161](#t161) | `$.workflows[].steps[].controls[].optionSource` | 契约支持但本包未出现 |
| [t162](#t162) | `SearchProfile` | 实际出现 37 次 |
| [t163](#t163) | `$.workflows[].steps[].controls[].search.coarse` | 契约支持但本包未出现 |
| [t164](#t164) | `WorkflowRepeatGroup` | 实际出现 8 次 |
| [t165](#t165) | `WorkflowGroupField` | 实际出现 18 次 |
| [t166](#t166) | `$.workflows[].steps[].controls[].tagsExtensions` | 实际出现 24 次 |
| [t167](#t167) | `$.workflows[].steps[].tagsExtensions` | 契约支持但本包未出现 |
| [t168](#t168) | `$.workflows[].steps[].drawing` | 实际出现 25 次 |
| [t169](#t169) | `WorkflowAuxiliaryPoint` | 契约支持但本包未出现 |
| [t170](#t170) | `$.workflows[].steps[].drawing.bindings[]` | 实际出现 4 次 |
| [t171](#t171) | `WorkflowOutput` | 实际出现 24 次 |
| [t172](#t172) | `WorkflowAssignment` | 实际出现 185 次 |
| [t173](#t173) | `$.workflows[].outputs[].geometry` | 实际出现 24 次 |
| [t174](#t174) | `$.workflows[].external` | 实际出现 4 次 |
| [t175](#t175) | `$.workflows[].legacy` | 实际出现 20 次 |
| [t176](#t176) | `ParityReport` | 实际出现 1 次 |
| [t177](#t177) | `ParityEntry` | 实际出现 36 次 |

<a id="t0"></a>

## t0 · ConfigPackageV3

首次类型入口：`$`。本包实例：`/`，完整 JSON 第 1–115848 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `schemaVersion` | `"cairnmap.config-package.v3"` | 必填 | 文件结构标记；固定字符串用于识别整包、应用设置或对齐报告。 | `"cairnmap.config-package.v3"`；行 2，Pointer `/schemaVersion` | 当前契约支持 |
| `contractRevision` | `3` / `4` / `5` / `6` / `7` / `8` / `9` / `10` / `11` | 必填 | 配置契约版本；控制结构兼容和迁移，当前为 11，不能用它冒充保存版本。 | `11`；行 3，Pointer `/contractRevision` | 当前契约支持 |
| `packageId` | string | 必填 | 整包稳定身份；本地历史与导入使用此标识区分配置包。 | `"cairnmap-config-v32-semantic"`；行 4，Pointer `/packageId` | 当前契约支持 |
| `projectId` | string | 必填 | 所属项目的稳定标识。 | `"openriamap-ria"`；行 5，Pointer `/projectId` | 当前契约支持 |
| `revision` | number | 必填 | 同一配置包的保存修订号；当前为 7，保存新版本须满足递增要求。 | `7`；行 6，Pointer `/revision` | 当前契约支持 |
| `displayName` | [LocalizedText [t1]](#t1) | 必填 | 整包显示名是 zh/en 对象；搜索延伸区域的同名键是显示胶囊名称的布尔值，须按对象判读。 | `{"zh":"V3.2：Post-C 完整配置工作台 r7","en":"V3.2 Post-C configurable application r7"}`；行 7，Pointer `/displayName` | 当前契约支持 |
| `sourceManifestSha256` | string | 可选 | 原始迁移来源清单的 SHA-256 摘要；不是整包当前内容的散列。 | 本包未写入 | 当前契约支持 |
| `engine` | [ConfigEngineSettings [t2]](#t2) | 可选 | 全局引擎默认设置，供分类渲染与交互解析。 | `{"world":{"field":"World","assignment":"activeWorld","required":true},"contextView":{"minZoom":6,"activationRadiusPx":70,"retainRadiusPx":120},"screen…（摘要）`；行 11，Pointer `/engine` | 当前契约支持 |
| `registries` | [ConfigRegistries [t40]](#t40) | 必填 | 可用布局、组件与受控能力的登记清单；登记不等于任意代码可执行。 | `{"cardLayouts":[{"id":"standard-feature-card","label":{"zh":"标准要素信息卡","en":""}},{"id":"generic-point-card","label":{"zh":"通用点要素信息卡","en":""}},{"id":"g…（摘要）`；行 223，Pointer `/registries` | 当前契约支持 |
| `lookupTables` | 数组＜[LookupTable [t45]](#t45)＞ | 可选 | 公共对照表数组；字段、信息卡和工作流可按表格 ID 引用。 | `[{"id":"teleport-hubs","label":{"zh":"所属枢纽区","en":""},"valueType":"string","functionKind":"teleportHub","rows":[{"value":"zthspawn","label":{"zh":"zth…（摘要）`；行 115555，Pointer `/lookupTables` | 当前契约支持 |
| `application` | [ApplicationSettings [t51]](#t51) | 可选 | 总体规则：世界、来源组、图层按钮、模块、审核及偏好。 | `{"schemaVersion":"cairnmap.application.v1","worlds":[{"id":"zth","prefix":"Z","numericCode":0,"label":{"zh":"零洲","en":""},"enabled":true,"default":tru…（摘要）`；行 114958，Pointer `/application` | 当前契约支持 |
| `nodes` | 数组＜[CategoryNode [t85]](#t85)＞ | 必填 | 分类节点数组；通过 path 和 children 表达分类树，而非把节点嵌套存储。 | `[{"nodeId":"class-bud","path":{"class":"BUD"},"classificationLabels":{"class":{"zh":"建筑","en":"Building"}},"children":["class-bud-nom","class-bud-spe"…（摘要）`；行 945，Pointer `/nodes` | 当前契约支持 |
| `contextBindings` | 数组＜[ContextBinding [t150]](#t150)＞ | 可选 | 旧式指定双方分类的上下文绑定；当前默认空数组，现用 fieldSettings.structure。 | `[]`；行 107988，Pointer `/contextBindings` | 旧关系保留；当前默认为空 |
| `workflows` | 数组＜[WorkflowDefinition [t152]](#t152)＞ | 必填 | 工作流定义数组；包含组合式采集、外部方案和专供编辑方案。 | `[{"id":"external-railway-integrated","label":{"zh":"铁路一体工作流","en":"railway-integrated"},"mode":"external","steps":[],"outputs":[],"external":{"compone…（摘要）`；行 107989，Pointer `/workflows` | 当前契约支持 |
| `parity` | [ParityReport [t176]](#t176) | 可选 | 与 V1 来源的迁移对齐凭证；不是地图数据或实际渲染规则。 | `{"schemaVersion":"cairnmap.v1-parity-report.v2","generatedAt":"2026-10-10T17:45:25.900Z","entries":[{"kind":"class","id":"BUD","source":"project-confi…（摘要）`；行 114668，Pointer `/parity` | 当前契约支持 |

<a id="t1"></a>

## t1 · LocalizedText

首次类型入口：`$.displayName`。本包实例：`/displayName`，完整 JSON 第 7–10 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `zh` | string | 必填 | 中文名称或说明；不能把实际存储值改写为此显示文本。 | `"V3.2：Post-C 完整配置工作台 r7"`；行 8，Pointer `/displayName/zh` | 当前契约支持 |
| `en` | string | 必填 | 英文名称或说明；空字符串在当前配置中很常见，具体显示依使用方回退。 | `"V3.2 Post-C configurable application r7"`；行 9，Pointer `/displayName/en` | 当前契约支持 |

<a id="t2"></a>

## t2 · ConfigEngineSettings

首次类型入口：`$.engine`。本包实例：`/engine`，完整 JSON 第 11–222 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `world` | [$.engine.world [t3]](#t3) | 必填 | 引擎的 World 写入约定，或功能行内的目标世界 ID。 | `{"field":"World","assignment":"activeWorld","required":true}`；行 12，Pointer `/engine/world` | 当前契约支持 |
| `contextView` | [$.engine.contextView [t4]](#t4) | 必填 | 主附属结构视角的全局激活门槛与距离。 | `{"minZoom":6,"activationRadiusPx":70,"retainRadiusPx":120}`；行 17，Pointer `/engine/contextView` | 当前契约支持 |
| `screenGateDefaults` | [$.engine.screenGateDefaults [t5]](#t5) | 必填 | 屏幕尺度门槛默认值；规则可继承或明确覆盖。 | `{"polygonMinScreenAreaPx":0,"lineMinScreenLengthPx":0}`；行 22，Pointer `/engine/screenGateDefaults` | 当前契约支持 |
| `interactionBaselines` | [$.engine.interactionBaselines [t6]](#t6) | 必填 | 点、线、面的全局交互外观基线。 | `{"Point":{"hover":{"enabled":false,"strokeColor":"#38bdf8","strokeWidth":3,"strokeOpacity":1,"fillColor":"#38bdf8","fillOpacity":0.1,"zIndexOffset":20…（摘要）`；行 26，Pointer `/engine/interactionBaselines` | 当前契约支持 |
| `paneDefaults` | [Record [t18]](#t18) | 必填 | 语义图层名称到实际绘制 pane 的默认映射。 | `{"overlay":"ria-overlay","overlay-top":"ria-overlay-top","point":"ria-point","point-top":"ria-point-top"}`；行 216，Pointer `/engine/paneDefaults` | 当前契约支持 |
| `renderDefaults` | [Partial [t19]](#t19) | 可选 | 按几何类型设置的渲染扩展默认值；规则局部值再覆盖。 | 本包未写入 | 当前契约支持 |

<a id="t3"></a>

## t3 · $.engine.world

首次类型入口：`$.engine.world`。本包实例：`/engine/world`，完整 JSON 第 12–16 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `field` | `"World"` | 必填 | 所引用的数据字段路径；不同位置的可用字段集由对应分类限定。 | `"World"`；行 13，Pointer `/engine/world/field` | 当前契约支持 |
| `assignment` | `"activeWorld"` | 必填 | 系统世界字段的赋值方式；activeWorld 表示当前活动世界。 | `"activeWorld"`；行 14，Pointer `/engine/world/assignment` | 当前契约支持 |
| `required` | `true` | 必填 | 是否必填；系统 World 设置中固定为 true，其他位置按控件或字段解释。 | `true`；行 15，Pointer `/engine/world/required` | 当前契约支持 |

<a id="t4"></a>

## t4 · $.engine.contextView

首次类型入口：`$.engine.contextView`。本包实例：`/engine/contextView`，完整 JSON 第 17–21 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `minZoom` | number | 必填 | 最小缩放边界；渲染原生规则为含端点，优先读取 when.zoom。 | `6`；行 18，Pointer `/engine/contextView/minZoom` | 当前契约支持 |
| `activationRadiusPx` | number | 必填 | 激活主结构上下文的屏幕距离，单位像素。 | `70`；行 19，Pointer `/engine/contextView/activationRadiusPx` | 当前契约支持 |
| `retainRadiusPx` | number | 必填 | 已激活主结构上下文的保留距离，单位像素。 | `120`；行 20，Pointer `/engine/contextView/retainRadiusPx` | 当前契约支持 |

<a id="t5"></a>

## t5 · $.engine.screenGateDefaults

首次类型入口：`$.engine.screenGateDefaults`。本包实例：`/engine/screenGateDefaults`，完整 JSON 第 22–25 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `polygonMinScreenAreaPx` | number | 可选 | 面要素投影到屏幕后的最小面积，单位 px²。 | `0`；行 23，Pointer `/engine/screenGateDefaults/polygonMinScreenAreaPx` | 当前契约支持 |
| `lineMinScreenLengthPx` | number | 可选 | 线要素投影到屏幕后的最小长度，单位 px。 | `0`；行 24，Pointer `/engine/screenGateDefaults/lineMinScreenLengthPx` | 当前契约支持 |

<a id="t6"></a>

## t6 · $.engine.interactionBaselines

首次类型入口：`$.engine.interactionBaselines`。本包实例：`/engine/interactionBaselines`，完整 JSON 第 26–215 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `Point` | [GeometryInteractionBaseline [t7]](#t7) | 必填 | 点几何配置键；与 LineString、Polygon 区分。 | `{"hover":{"enabled":false,"strokeColor":"#38bdf8","strokeWidth":3,"strokeOpacity":1,"fillColor":"#38bdf8","fillOpacity":0.1,"zIndexOffset":20,"forceSh…（摘要）`；行 27，Pointer `/engine/interactionBaselines/Point` | 当前契约支持 |
| `LineString` | [GeometryInteractionBaseline [t7]](#t7) | 必填 | 线几何配置键；最终记录可具有多个线部件。 | `{"hover":{"enabled":false,"strokeColor":"#38bdf8","strokeWidth":3,"strokeOpacity":1,"fillColor":"#38bdf8","fillOpacity":0.1,"zIndexOffset":20,"forceSh…（摘要）`；行 99，Pointer `/engine/interactionBaselines/LineString` | 当前契约支持 |
| `Polygon` | [GeometryInteractionBaseline [t7]](#t7) | 必填 | 面几何配置键；外部件与部件内孔环是两个层级。 | `{"hover":{"enabled":false,"strokeColor":"#38bdf8","strokeWidth":3,"strokeOpacity":1,"fillColor":"#38bdf8","fillOpacity":0.1,"zIndexOffset":20,"forceSh…（摘要）`；行 157，Pointer `/engine/interactionBaselines/Polygon` | 当前契约支持 |

<a id="t7"></a>

## t7 · GeometryInteractionBaseline

首次类型入口：`$.engine.interactionBaselines.Point`。本包实例：`/engine/interactionBaselines/Point`，完整 JSON 第 27–98 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `hover` | [InteractionVisual [t8]](#t8) | 必填 | 鼠标悬停状态的交互外观。 | `{"enabled":false,"strokeColor":"#38bdf8","strokeWidth":3,"strokeOpacity":1,"fillColor":"#38bdf8","fillOpacity":0.1,"zIndexOffset":20,"forceShowLabel":…（摘要）`；行 28，Pointer `/engine/interactionBaselines/Point/hover` | 当前契约支持 |
| `selected` | [InteractionVisual [t8]](#t8) | 必填 | 选中状态的外观；在工作流 geometry 中则表示固定几何类型。 | `{"enabled":true,"strokeColor":"#111827","strokeWidth":1,"strokeOpacity":1,"fillColor":"#3b82f6","fillOpacity":1,"symbol":{"kind":"pin","size":[26,26]}…（摘要）`；行 39，Pointer `/engine/interactionBaselines/Point/selected` | 当前契约支持 |
| `searchResult` | [InteractionVisual [t8]](#t8) | 必填 | 搜索命中状态的交互外观。 | `{"enabled":true,"strokeColor":"#111827","strokeWidth":1,"strokeOpacity":1,"fillColor":"#3b82f6","fillOpacity":1,"symbol":{"kind":"pin","size":[26,26]}…（摘要）`；行 57，Pointer `/engine/interactionBaselines/Point/searchResult` | 当前契约支持 |
| `editing` | [InteractionVisual [t8]](#t8) | 必填 | 编辑状态的交互外观。 | `{"enabled":false,"strokeColor":"#2563eb","strokeWidth":4,"strokeOpacity":1,"fillColor":"#2563eb","fillOpacity":0.1,"zIndexOffset":90,"forceShowLabel":…（摘要）`；行 75，Pointer `/engine/interactionBaselines/Point/editing` | 当前契约支持 |
| `deletionMarked` | [InteractionVisual [t8]](#t8) | 必填 | 标记删除状态的交互外观。 | `{"enabled":false,"strokeColor":"#ef4444","strokeWidth":4,"strokeOpacity":1,"fillColor":"#ef4444","fillOpacity":0.1,"zIndexOffset":100,"forceShowLabel"…（摘要）`；行 86，Pointer `/engine/interactionBaselines/Point/deletionMarked` | 当前契约支持 |
| `hitTolerancePx` | number | 必填 | 点击/命中的屏幕容差，单位像素。 | `0`；行 97，Pointer `/engine/interactionBaselines/Point/hitTolerancePx` | 当前契约支持 |

<a id="t8"></a>

## t8 · InteractionVisual

首次类型入口：`$.engine.interactionBaselines.Point.hover`。本包实例：`/engine/interactionBaselines/Point/hover`，完整 JSON 第 28–38 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `enabled` | boolean | 必填 | 启用标记；false 不等于删除定义，具体作用范围取决于所在模块。 | `false`；行 29，Pointer `/engine/interactionBaselines/Point/hover/enabled` | 当前契约支持 |
| `strokeColor` | string | 必填 | 交互覆盖的描边固定颜色。 | `"#38bdf8"`；行 30，Pointer `/engine/interactionBaselines/Point/hover/strokeColor` | 当前契约支持 |
| `strokeWidth` | number | 必填 | 交互描边宽度，单位像素。 | `3`；行 31，Pointer `/engine/interactionBaselines/Point/hover/strokeWidth` | 当前契约支持 |
| `strokeOpacity` | number | 必填 | 描边不透明度，0 为透明，1 为不透明。 | `1`；行 32，Pointer `/engine/interactionBaselines/Point/hover/strokeOpacity` | 当前契约支持 |
| `fillColor` | string | 可选 | 交互覆盖的固定填充色。 | `"#38bdf8"`；行 33，Pointer `/engine/interactionBaselines/Point/hover/fillColor` | 当前契约支持 |
| `fillOpacity` | number | 可选 | 填充不透明度，0 为透明，1 为不透明。 | `0.1`；行 34，Pointer `/engine/interactionBaselines/Point/hover/fillOpacity` | 当前契约支持 |
| `zIndexOffset` | number | 可选 | 在基础图层顺序上叠加的偏移量；不等于 Label 碰撞优先级。 | `20`；行 35，Pointer `/engine/interactionBaselines/Point/hover/zIndexOffset` | 当前契约支持 |
| `forceShowLabel` | boolean：true / false | 可选 | 此交互状态请求保留标签，不修改标签文字来源。 | `true`；行 36，Pointer `/engine/interactionBaselines/Point/hover/forceShowLabel` | 当前契约支持 |
| `labelPriority` | number | 可选 | 交互状态给 Label 的碰撞优先分数。 | `7000`；行 37，Pointer `/engine/interactionBaselines/Point/hover/labelPriority` | 当前契约支持 |
| `symbol` | [$.engine.interactionBaselines.Point.hover.symbol [t9]](#t9) | 可选 | 交互点标记配置；并非源几何坐标。 | `{"kind":"pin","size":[26,26]}`；行 46，Pointer `/engine/interactionBaselines/Point/selected/symbol` | 当前契约支持 |
| `outline` | [$.engine.interactionBaselines.Point.hover.outline [t10]](#t10) | 可选 | 交互覆盖的轮廓线描述。 | 本包未写入 | 当前契约支持 |
| `dashArray` | string | 可选 | 旧版自定义虚线长度字符串。 | `"8 6"`；行 117，Pointer `/engine/interactionBaselines/LineString/selected/dashArray` | 当前契约支持 |
| `strokeColorBinding` | [$.engine.interactionBaselines.Point.hover.strokeColorBinding [t11]](#t11) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding [t13]](#t13) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding [t14]](#t14) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding [t15]](#t15) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding [t17]](#t17) | 可选 | 交互描边颜色的取值方式，可按字段、关系或值对照求色。 | 本包未写入 | 当前契约支持 |

<a id="t9"></a>

## t9 · $.engine.interactionBaselines.Point.hover.symbol

首次类型入口：`$.engine.interactionBaselines.Point.hover.symbol`。本包实例：`/engine/interactionBaselines/Point/selected/symbol`，完整 JSON 第 46–52 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `kind` | `"circle"` / `"pin"` | 必填 | 分类路径第二级，或条件/控件的分支种类；依所在对象判读。 | `"pin"`；行 47，Pointer `/engine/interactionBaselines/Point/selected/symbol/kind` | 当前契约支持 |
| `radius` | number | 可选 | 圆形符号半径。 | 本包未写入 | 当前契约支持 |
| `size` | 固定数组 [number, number] | 可选 | 符号/文字尺寸或按钮尺寸；单位与数组结构见当前对象类型。 | `[26,26]`；行 48，Pointer `/engine/interactionBaselines/Point/selected/symbol/size` | 当前契约支持 |

<a id="t10"></a>

## t10 · $.engine.interactionBaselines.Point.hover.outline

首次类型入口：`$.engine.interactionBaselines.Point.hover.outline`。本包实例：`/nodes/66/geometryProfiles/LineString/zoomPriority/rules/0/extensions/interaction/selected/outline`，完整 JSON 第 73559–73563 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `color` | string | 必填 | 固定颜色文本；可用颜色语法仍须通过实际核验。 | `"#ffffff"`；行 73560，Pointer `/nodes/66/geometryProfiles/LineString/zoomPriority/rules/0/extensions/interaction/selected/outline/color` | 当前契约支持 |
| `width` | number | 必填 | 轮廓宽度或边界框宽度修正；具体由所在对象解释。 | `9`；行 73561，Pointer `/nodes/66/geometryProfiles/LineString/zoomPriority/rules/0/extensions/interaction/selected/outline/width` | 当前契约支持 |
| `opacity` | number | 必填 | 整体或局部不透明度；通常 0–1。 | `0.85`；行 73562，Pointer `/nodes/66/geometryProfiles/LineString/zoomPriority/rules/0/extensions/interaction/selected/outline/opacity` | 当前契约支持 |

<a id="t11"></a>

## t11 · $.engine.interactionBaselines.Point.hover.strokeColorBinding

首次类型入口：`$.engine.interactionBaselines.Point.hover.strokeColorBinding`。本包没有此结构的实际实例；可能是可选功能或兼容分支。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `mode` | `"valueMap"` | 必填 | 当前联合结构的分支选择器；先看 mode，再解释其余字段。 | 本包未写入 | 当前契约支持 |
| `field` | string | 必填 | 所引用的数据字段路径；不同位置的可用字段集由对应分类限定。 | 本包未写入 | 当前契约支持 |
| `entries` | 数组＜[$.engine.interactionBaselines.Point.hover.strokeColorBinding.entries[] [t12]](#t12)＞ | 必填 | 按值设色的逐行条目，或迁移对齐报告中的逐项记录。 | 本包未写入 | 当前契约支持 |
| `fallbackColor` | string | 必填 | 主颜色来源无效时使用的回退颜色。 | 本包未写入 | 当前契约支持 |

<a id="t12"></a>

## t12 · $.engine.interactionBaselines.Point.hover.strokeColorBinding.entries[]

首次类型入口：`$.engine.interactionBaselines.Point.hover.strokeColorBinding.entries[]`。本包没有此结构的实际实例；可能是可选功能或兼容分支。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `value` | string / number / `false` / `true` | 必填 | 最终存储值、条件比较值或常量；是否字符串须看当前类型声明。 | 本包未写入 | 当前契约支持 |
| `color` | string | 必填 | 固定颜色文本；可用颜色语法仍须通过实际核验。 | 本包未写入 | 当前契约支持 |

<a id="t13"></a>

## t13 · $.engine.interactionBaselines.Point.hover.strokeColorBinding

首次类型入口：`$.engine.interactionBaselines.Point.hover.strokeColorBinding`。本包实例：`/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/style/stroke`，完整 JSON 第 1194–1197 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `mode` | `"fixed"` | 必填 | 当前联合结构的分支选择器；先看 mode，再解释其余字段。 | `"fixed"`；行 1195，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/style/stroke/mode` | 当前契约支持 |
| `color` | string | 必填 | 固定颜色文本；可用颜色语法仍须通过实际核验。 | `"#111827"`；行 1196，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/style/stroke/color` | 当前契约支持 |

<a id="t14"></a>

## t14 · $.engine.interactionBaselines.Point.hover.strokeColorBinding

首次类型入口：`$.engine.interactionBaselines.Point.hover.strokeColorBinding`。本包实例：`/nodes/65/geometryProfiles/LineString/zoomPriority/rules/0/style/stroke`，完整 JSON 第 70751–70755 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `mode` | `"field"` | 必填 | 当前联合结构的分支选择器；先看 mode，再解释其余字段。 | `"field"`；行 70752，Pointer `/nodes/65/geometryProfiles/LineString/zoomPriority/rules/0/style/stroke/mode` | 当前契约支持 |
| `field` | string | 必填 | 所引用的数据字段路径；不同位置的可用字段集由对应分类限定。 | `"color"`；行 70753，Pointer `/nodes/65/geometryProfiles/LineString/zoomPriority/rules/0/style/stroke/field` | 当前契约支持 |
| `fallbackColor` | string | 可选 | 主颜色来源无效时使用的回退颜色。 | `"#111827"`；行 70754，Pointer `/nodes/65/geometryProfiles/LineString/zoomPriority/rules/0/style/stroke/fallbackColor` | 当前契约支持 |

<a id="t15"></a>

## t15 · $.engine.interactionBaselines.Point.hover.strokeColorBinding

首次类型入口：`$.engine.interactionBaselines.Point.hover.strokeColorBinding`。本包没有此结构的实际实例；可能是可选功能或兼容分支。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `mode` | `"external"` | 必填 | 当前联合结构的分支选择器；先看 mode，再解释其余字段。 | 本包未写入 | 当前契约支持 |
| `target` | [ClassificationPath [t16]](#t16) | 必填 | 目标分类范围，或输出赋值的目标字段路径；二者不能混用。 | 本包未写入 | 当前契约支持 |
| `targetIdField` | string | 必填 | 本记录中保存外部目标 ID 的字段。 | 本包未写入 | 当前契约支持 |
| `targetColorField` | string | 必填 | 外部目标记录中提供颜色的字段。 | 本包未写入 | 当前契约支持 |
| `fallbackColor` | string | 可选 | 主颜色来源无效时使用的回退颜色。 | 本包未写入 | 当前契约支持 |

<a id="t16"></a>

## t16 · ClassificationPath

首次类型入口：`$.engine.interactionBaselines.Point.hover.strokeColorBinding.target`。本包实例：`/nodes/0/path`，完整 JSON 第 948–950 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `class` | string | 必填 | 分类路径第一级 Class；此处键名小写，实际要素记录使用 Class。 | `"BUD"`；行 949，Pointer `/nodes/0/path/class` | 当前契约支持 |
| `kind` | string | 可选 | 分类路径第二级，或条件/控件的分支种类；依所在对象判读。 | `"NOM"`；行 2259，Pointer `/nodes/1/path/kind` | 当前契约支持 |
| `skind` | string | 可选 | 分类路径第三级；实际新要素记录使用 SKind。 | `"NOM"`；行 4376，Pointer `/nodes/3/path/skind` | 当前契约支持 |
| `skind2` | string | 可选 | 分类路径第四级；实际新要素记录使用 SKind2。 | `"CON"`；行 20158，Pointer `/nodes/18/path/skind2` | 当前契约支持 |

<a id="t17"></a>

## t17 · $.engine.interactionBaselines.Point.hover.strokeColorBinding

首次类型入口：`$.engine.interactionBaselines.Point.hover.strokeColorBinding`。本包实例：`/nodes/5/geometryProfiles/Polygon/zoomPriority/rules/1/style/stroke`，完整 JSON 第 6907–6911 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `mode` | `"relatedLine"` | 必填 | 当前联合结构的分支选择器；先看 mode，再解释其余字段。 | `"relatedLine"`；行 6908，Pointer `/nodes/5/geometryProfiles/Polygon/zoomPriority/rules/1/style/stroke/mode` | 当前契约支持 |
| `strategy` | `"featureRelation"` / `"platformFirstLine"` / `"stationFirstPlatform"` | 必填 | 关系取色或几何锚点的解析策略。 | `"featureRelation"`；行 6909，Pointer `/nodes/5/geometryProfiles/Polygon/zoomPriority/rules/1/style/stroke/strategy` | 当前契约支持 |
| `fallbackColor` | string | 可选 | 主颜色来源无效时使用的回退颜色。 | `"#4b5563"`；行 6910，Pointer `/nodes/5/geometryProfiles/Polygon/zoomPriority/rules/1/style/stroke/fallbackColor` | 当前契约支持 |

<a id="t18"></a>

## t18 · Record

首次类型入口：`$.engine.paneDefaults`。本包实例：`/engine/paneDefaults`，完整 JSON 第 216–221 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `overlay` | string | 必填 | 普通覆盖图层的 pane 名。 | `"ria-overlay"`；行 217，Pointer `/engine/paneDefaults/overlay` | 当前契约支持 |
| `overlay-top` | string | 必填 | 较高层覆盖图层的 pane 名。 | `"ria-overlay-top"`；行 218，Pointer `/engine/paneDefaults/overlay-top` | 当前契约支持 |
| `point` | string | 必填 | 点图层的 pane 名、交互触发标记或单点返回值，依所在对象判读。 | `"ria-point"`；行 219，Pointer `/engine/paneDefaults/point` | 当前契约支持 |
| `point-top` | string | 必填 | 较高层点图层的 pane 名。 | `"ria-point-top"`；行 220，Pointer `/engine/paneDefaults/point-top` | 当前契约支持 |

<a id="t19"></a>

## t19 · Partial

首次类型入口：`$.engine.renderDefaults`。本包没有此结构的实际实例；可能是可选功能或兼容分支。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `Point` | [RenderRuleExtensions [t20]](#t20) | 可选 | 点几何配置键；与 LineString、Polygon 区分。 | 本包未写入 | 当前契约支持 |
| `LineString` | [RenderRuleExtensions [t20]](#t20) | 可选 | 线几何配置键；最终记录可具有多个线部件。 | 本包未写入 | 当前契约支持 |
| `Polygon` | [RenderRuleExtensions [t20]](#t20) | 可选 | 面几何配置键；外部件与部件内孔环是两个层级。 | 本包未写入 | 当前契约支持 |

<a id="t20"></a>

## t20 · RenderRuleExtensions

首次类型入口：`$.engine.renderDefaults.Point`。本包实例：`/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions`，完整 JSON 第 1229–1295 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `screenGate` | [RenderScreenGate [t21]](#t21) | 可选 | 当前规则的屏幕尺度门槛设置。 | `{"mode":"inherit"}`；行 1230，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/screenGate` | 当前契约支持 |
| `pane` | `"auto"` / `"overlay"` / `"overlay-top"` / `"point"` / `"point-top"` | 可选 | 绘制 pane；控制真实绘制层级，不能代替碰撞分数。 | `"overlay-top"`；行 7007，Pointer `/nodes/5/geometryProfiles/Polygon/zoomPriority/rules/1/extensions/pane` | 当前契约支持 |
| `hitTolerancePx` | number | 可选 | 点击/命中的屏幕容差，单位像素。 | 本包未写入 | 当前契约支持 |
| `labelText` | [$.engine.renderDefaults.Point.labelText [t22]](#t22) | 可选 | 标签截断、多行、空文字和透明度处理。 | `{"maxChars":12,"suffix":"…","abbreviationEnabled":true,"emptyBehavior":"hide"}`；行 1249，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/labelText` | 当前契约支持 |
| `lineLabel` | [RenderLineLabelExtension [t23]](#t23) | 可选 | 沿线文字的候选、方向、曲线与回退设置。 | `{"profile":"strict-on-line","mode":"strictOnLine","anchorSamples":7,"candidateSpacing":200,"candidateMinSpacing":40,"candidateMax":48,"shortThresholdM…（摘要）`；行 47146，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel` | 当前契约支持 |
| `anchor` | [RenderAnchorExtension [t24]](#t24) | 可选 | 多部件锚点模式，或规则内详细锚点设置；先看它是字符串还是对象。 | `{"strategy":"interior","candidates":["C","N","S","E","W"],"requireInsideGeometry":true,"candidatePlacement":"aroundAnchor"}`；行 1233，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/anchor` | 当前契约支持 |
| `polygonCandidates` | [RenderPolygonCandidateExtension [t27]](#t27) | 可选 | 面要素标签候选的生成与筛选设置。 | `{"mode":"fixedInterior","preferPreviousCandidate":true}`；行 1245，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/polygonCandidates` | 当前契约支持 |
| `collision` | [RenderCollisionExtension [t28]](#t28) | 可选 | Label 碰撞角色或详细碰撞扩展；不控制真实几何层级。 | `{"collideWith":["symbol","requiredLabel","importantLabel","optionalLabel","softLabel"],"paddingPx":3,"hidePolicy":"abbreviateThenHide"}`；行 1255，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/collision` | 当前契约支持 |
| `stability` | [RenderStabilityExtension [t30]](#t30) | 可选 | 标签候选缓存、失效和抗跳动设置。 | `{"enabled":true,"cacheKey":"featureID+zoomBucket","zoomBucketSize":1,"freezeDuringPan":true,"recomputeOnMoveEnd":true,"recomputeOnZoomEnd":true,"hyste…（摘要）`；行 1278，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/stability` | 当前契约支持 |
| `density` | [RenderDensityExtension [t31]](#t31) | 可选 | 按屏幕网格控制标签/符号数量的策略。 | `{"mode":"override","enabled":true,"gridSizePx":104,"maxLabelsPerGrid":2,"reduceOrder":["hideSoftLabels","geometryOnly"],"preserveSelected":true,"prese…（摘要）`；行 1266，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/density` | 当前契约支持 |
| `fallback` | [RenderFallbackExtension [t32]](#t32) | 可选 | 回退策略对象，或默认启用按钮 ID 列表，依所在模块解释。 | `{"whenNoLabelText":"hideLabel","whenCollisionFailed":"hideLabel","whenRuleMissing":"geometryOnly","whenGeometryInvalid":"skip"}`；行 1289，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/fallback` | 当前契约支持 |
| `visibility` | [RenderVisibilityExtension [t33]](#t33) | 可选 | 关系可见性扩展，或附属结构显示策略。 | `{"mode":"activeContextMember","activeContextMember":{"bindingId":"structure-role-context","requireSelector":true}}`；行 7008，Pointer `/nodes/5/geometryProfiles/Polygon/zoomPriority/rules/1/extensions/visibility` | 当前契约支持 |
| `interaction` | [Partial [t38]](#t38) | 可选 | 本几何的命中触发器，或规则内交互外观覆盖。 | `{"selected":{"strokeColor":"#2196F3","strokeColorBinding":{"mode":"field","field":"color","fallbackColor":"#2196F3"},"strokeWidth":6,"dashArray":"","o…（摘要）`；行 73549，Pointer `/nodes/66/geometryProfiles/LineString/zoomPriority/rules/0/extensions/interaction` | 当前契约支持 |

<a id="t21"></a>

## t21 · RenderScreenGate

首次类型入口：`$.engine.renderDefaults.Point.screenGate`。本包实例：`/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/screenGate`，完整 JSON 第 1230–1232 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `mode` | `"inherit"` / `"override"` | 必填 | 当前联合结构的分支选择器；先看 mode，再解释其余字段。 | `"inherit"`；行 1231，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/screenGate/mode` | 当前契约支持 |
| `minScreenAreaPx` | number | 可选 | 最小屏幕面积，单位 px²；在候选设置中只限制标签候选。 | 本包未写入 | 当前契约支持 |
| `minScreenLengthPx` | number | 可选 | 最小屏幕线长，单位 px。 | 本包未写入 | 当前契约支持 |

<a id="t22"></a>

## t22 · $.engine.renderDefaults.Point.labelText

首次类型入口：`$.engine.renderDefaults.Point.labelText`。本包实例：`/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/labelText`，完整 JSON 第 1249–1254 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `maxChars` | number | 可选 | 标签最多保留的字符数。 | `12`；行 1250，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/labelText/maxChars` | 当前契约支持 |
| `minChars` | number | 可选 | 标签缩写或截断时最少保留字符数。 | 本包未写入 | 当前契约支持 |
| `multiline` | boolean：true / false | 可选 | 是否允许标签多行显示。 | 本包未写入 | 当前契约支持 |
| `maxLines` | number | 可选 | 标签最多显示行数。 | 本包未写入 | 当前契约支持 |
| `suffix` | string | 可选 | 截断后追加的字符，如省略号。 | `"…"`；行 1251，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/labelText/suffix` | 当前契约支持 |
| `abbreviationEnabled` | boolean：true / false | 可选 | 是否允许标签缩写处理。 | `true`；行 1252，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/labelText/abbreviationEnabled` | 当前契约支持 |
| `emptyBehavior` | `"hide"` / `"showID"` / `"showKind"` / `"placeholder"` | 可选 | 标签无有效文字时的处理分支。 | `"hide"`；行 1253，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/labelText/emptyBehavior` | 当前契约支持 |
| `opacity` | number | 可选 | 整体或局部不透明度；通常 0–1。 | 本包未写入 | 当前契约支持 |

<a id="t23"></a>

## t23 · RenderLineLabelExtension

首次类型入口：`$.engine.renderDefaults.Point.lineLabel`。本包实例：`/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel`，完整 JSON 第 47146–47213 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `profile` | `"inherit"` / `"standard"` / `"network"` / `"strict-on-line"` | 必填 | 沿线文字预设或主附属上下文显示预设；由所在对象区分。 | `"strict-on-line"`；行 47147，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/profile` | 当前契约支持 |
| `mode` | `"free"` / `"strictOnLine"` | 可选 | 当前联合结构的分支选择器；先看 mode，再解释其余字段。 | `"strictOnLine"`；行 47148，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/mode` | 当前契约支持 |
| `endpointPaddingRatio` | number | 可选 | 沿线标签距离端点的比例留白。 | `0.12`；行 47155，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/endpointPaddingRatio` | 当前契约支持 |
| `endpointPaddingMinPx` | number | 可选 | 沿线标签距离端点的最小像素留白。 | `40`；行 47156，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/endpointPaddingMinPx` | 当前契约支持 |
| `maxTurnAngleDeg` | number | 可选 | 候选位置允许的最大转角，单位度。 | `50`；行 47160，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/maxTurnAngleDeg` | 当前契约支持 |
| `minLengthPx` | number | 可选 | 候选所需的最小屏幕长度，单位像素。 | `90`；行 47159，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/minLengthPx` | 当前契约支持 |
| `textMode` | `"auto"` / `"rotatedLabel"` / `"textPath"` | 可选 | 自动、旋转文字或沿 SVG 路径文字的选择。 | `"auto"`；行 47161，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/textMode` | 当前契约支持 |
| `anchorSamples` | number | 可选 | 沿线锚点采样数量。 | `7`；行 47149，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/anchorSamples` | 当前契约支持 |
| `candidateSpacing` | number | 可选 | 沿线候选之间的间隔参数；由当前候选算法解释。 | `200`；行 47150，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/candidateSpacing` | 当前契约支持 |
| `candidateMinSpacing` | number | 可选 | 候选间隔的下限。 | `40`；行 47151，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/candidateMinSpacing` | 当前契约支持 |
| `candidateMax` | number | 可选 | 单次沿线候选数量上限。 | `48`；行 47152，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/candidateMax` | 当前契约支持 |
| `shortThresholdMultiplier` | number | 可选 | 判断短线文本适配的长度倍率。 | `2`；行 47153，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/shortThresholdMultiplier` | 当前契约支持 |
| `longMode` | `"evenSplit"` | 可选 | 长线候选分配方式，当前可选 evenSplit。 | `"evenSplit"`；行 47154，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/longMode` | 当前契约支持 |
| `preferPreviousCandidate` | boolean：true / false | 可选 | 优先复用上一次合法候选以减少跳动。 | `true`；行 47157，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/preferPreviousCandidate` | 当前契约支持 |
| `candidateHysteresisPx` | number | 可选 | 候选切换滞后距离，单位像素。 | `200`；行 47158，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/candidateHysteresisPx` | 当前契约支持 |
| `textPathMinLengthPx` | number | 可选 | 使用路径文字所需的最小屏幕长度。 | `140`；行 47162，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/textPathMinLengthPx` | 当前契约支持 |
| `textPathPaddingPx` | number | 可选 | 路径文字边缘留白，单位像素。 | `36`；行 47163，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/textPathPaddingPx` | 当前契约支持 |
| `textPathMaxAngleDeltaDeg` | number | 可选 | 路径相邻片段最大方向差，单位度。 | `50`；行 47164，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/textPathMaxAngleDeltaDeg` | 当前契约支持 |
| `textPathMaxTotalBendDeg` | number | 可选 | 文字覆盖路径允许的累计弯曲角度。 | `120`；行 47165，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/textPathMaxTotalBendDeg` | 当前契约支持 |
| `textPathPreferReadableDirection` | boolean：true / false | 可选 | 路径文字优先采用便于阅读的方向。 | `true`；行 47166，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/textPathPreferReadableDirection` | 当前契约支持 |
| `textPathFallback` | `"hide"` / `"rotatedLabel"` / `"svgStraightLabel"` | 可选 | 路径文字失败后的回退渲染方式。 | `"rotatedLabel"`；行 47167，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/textPathFallback` | 当前契约支持 |
| `textPathCollisionPaddingPx` | number | 可选 | 路径文字碰撞边界额外留白，单位像素。 | `10`；行 47168，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/textPathCollisionPaddingPx` | 当前契约支持 |
| `textPathLetterSpacingPx` | number | 可选 | 路径文字基础字间距，单位像素。 | `0.5`；行 47169，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/textPathLetterSpacingPx` | 当前契约支持 |
| `textPathCurvedLetterSpacingPx` | number | 可选 | 曲线路径文字使用的字间距，单位像素。 | `1.8`；行 47170，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/textPathCurvedLetterSpacingPx` | 当前契约支持 |
| `textPathCurvedSpacingMinBendDeg` | number | 可选 | 触发曲线字间距的最小弯曲角度。 | `30`；行 47171，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/textPathCurvedSpacingMinBendDeg` | 当前契约支持 |
| `orientationPolicy` | `"autoCjkUpright"` / `"alwaysTextPath"` / `"alwaysRotated"` | 可选 | 中日韩文字直立、始终路径文字或始终旋转的方向策略。 | `"autoCjkUpright"`；行 47172，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/orientationPolicy` | 当前契约支持 |
| `textPathVerticalAngleThresholdDeg` | number | 可选 | 判断路径适合竖排的角度门槛。 | `45`；行 47173，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/textPathVerticalAngleThresholdDeg` | 当前契约支持 |
| `textPathVerticalLengthRatio` | number | 可选 | 竖排路径可用长度与文本长度的比例门槛。 | `0.6`；行 47174，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/textPathVerticalLengthRatio` | 当前契约支持 |
| `candidateOrdering` | `"startToEnd"` / `"centerOut"` | 可选 | 候选按起终点顺序或从中心向外排列。 | `"centerOut"`；行 47175，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/candidateOrdering` | 当前契约支持 |
| `candidateWeightMode` | `"none"` / `"distanceToCenter"` | 可选 | 候选是否按距中心距离加权。 | 本包未写入 | 当前契约支持 |
| `candidateSwitchThreshold` | number | 可选 | 改选沿线候选所需的优势门槛。 | 本包未写入 | 当前契约支持 |
| `candidateReuseBonus` | number | 可选 | 旧沿线候选的复用评分加成。 | 本包未写入 | 当前契约支持 |
| `candidateViewportPreference` | boolean：true / false | 可选 | 沿线候选评分是否偏好当前视窗。 | 本包未写入 | 当前契约支持 |
| `candidateEdgePenalty` | number | 可选 | 沿线候选靠近视窗边缘的扣分。 | 本包未写入 | 当前契约支持 |
| `centerWeightMode` | `"none"` / `"distanceToCenter"` | 可选 | 中心选择的加权方式。 | `"distanceToCenter"`；行 47176，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/centerWeightMode` | 当前契约支持 |
| `centerSwitchThreshold` | number | 可选 | 中心位置切换门槛。 | `16`；行 47177，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/centerSwitchThreshold` | 当前契约支持 |
| `centerReuseBonus` | number | 可选 | 旧中心位置复用加分。 | `12`；行 47178，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/centerReuseBonus` | 当前契约支持 |
| `cjkVerticalRenderMode` | `"auto"` / `"legacyVertical"` / `"svgVertical"` | 可选 | 中日韩竖排实现方式。 | `"legacyVertical"`；行 47179，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/cjkVerticalRenderMode` | 当前契约支持 |
| `svgVerticalCjkMinLengthPx` | number | 可选 | SVG 中文竖排的最小屏幕长度。 | `24`；行 47180，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/svgVerticalCjkMinLengthPx` | 当前契约支持 |
| `svgVerticalCjkLetterSpacingPx` | number | 可选 | SVG 中文竖排字间距，单位像素。 | `1`；行 47181，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/svgVerticalCjkLetterSpacingPx` | 当前契约支持 |
| `advancedTextEnabled` | boolean：true / false | 可选 | 启用较复杂的沿线文字求解。 | `true`；行 47182，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/advancedTextEnabled` | 当前契约支持 |
| `advancedTextBudgetGroup` | `"network"` / `"none"` / `"surface"` | 可选 | 复杂文字求解所属的计算预算组。 | `"network"`；行 47183，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/advancedTextBudgetGroup` | 当前契约支持 |
| `advancedTextMaxLabels` | number | 可选 | 复杂文字求解允许处理的标签数量上限。 | 本包未写入 | 当前契约支持 |
| `advancedTextMaxCandidatesPerPass` | number | 可选 | 一次复杂求解可处理的候选数量上限。 | 本包未写入 | 当前契约支持 |
| `cjkGlyphRotationPolicy` | `"uprightWhenSteep"` / `"followLine"` / `"alwaysUpright"` | 可选 | 中文单字随线旋转或保持直立的策略。 | `"uprightWhenSteep"`；行 47184，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/cjkGlyphRotationPolicy` | 当前契约支持 |
| `cjkGlyphUprightAngleThresholdDeg` | number | 可选 | 中文单字保持直立的倾角门槛。 | `45`；行 47185，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/cjkGlyphUprightAngleThresholdDeg` | 当前契约支持 |
| `cjkGlyphPathMode` | `"auto"` / `"off"` / `"force"` | 可选 | 中文逐字沿线路径模式。 | `"auto"`；行 47186，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/cjkGlyphPathMode` | 当前契约支持 |
| `cjkGlyphSpacingPx` | number | 可选 | 中文逐字路径字间距，单位像素。 | `2`；行 47187，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/cjkGlyphSpacingPx` | 当前契约支持 |
| `cjkGlyphCollisionPaddingPx` | number | 可选 | 中文逐字碰撞边界留白，单位像素。 | `8`；行 47188，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/cjkGlyphCollisionPaddingPx` | 当前契约支持 |
| `cjkGlyphMinPathLengthPx` | number | 可选 | 中文逐字模式的最小路径长度。 | 本包未写入 | 当前契约支持 |
| `cjkGlyphMaxCount` | number | 可选 | 中文逐字模式的字数上限。 | `16`；行 47189，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/cjkGlyphMaxCount` | 当前契约支持 |
| `cjkGlyphMaxAngleDeltaDeg` | number | 可选 | 相邻中文单字路径方向差上限。 | 本包未写入 | 当前契约支持 |
| `cjkGlyphMaxTotalBendDeg` | number | 可选 | 中文逐字路径累计弯曲角度上限。 | 本包未写入 | 当前契约支持 |
| `cjkGlyphPreferReadableDirection` | boolean：true / false | 可选 | 中文逐字路径优先使用可读方向。 | 本包未写入 | 当前契约支持 |
| `cjkGlyphAllowTextPathFallback` | boolean：true / false | 可选 | 中文逐字失败后是否允许回退普通路径文字。 | `false`；行 47190，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/cjkGlyphAllowTextPathFallback` | 当前契约支持 |
| `textPathHalfLengthMultiplier` | number | 可选 | 文字路径半长度的放大倍率。 | `1.6`；行 47191，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/textPathHalfLengthMultiplier` | 当前契约支持 |
| `textPathMinHalfLengthWorld` | number | 可选 | 文字路径半长度的世界坐标下限。 | `160`；行 47192，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/textPathMinHalfLengthWorld` | 当前契约支持 |
| `textPathMaxHalfLengthWorld` | number | 可选 | 文字路径半长度的世界坐标上限。 | 本包未写入 | 当前契约支持 |
| `textPathMaxHalfLengthRatio` | number | 可选 | 半路径长度相对源路径长度的上限比例。 | `0.46`；行 47193，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/textPathMaxHalfLengthRatio` | 当前契约支持 |
| `textCollisionRectMode` | `"pathBox"` / `"textBox"` / `"compactTextBox"` | 可选 | 路径文字碰撞矩形的计算方式。 | `"compactTextBox"`；行 47194，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/textCollisionRectMode` | 当前契约支持 |
| `cjkGlyphCompactMode` | `"auto"` / `"off"` | 可选 | 中文逐字碰撞紧凑模式。 | `"auto"`；行 47195，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/cjkGlyphCompactMode` | 当前契约支持 |
| `cjkGlyphMinAdvanceScale` | number | 可选 | 中文逐字推进距离的最小缩放比例。 | `0.62`；行 47196，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/cjkGlyphMinAdvanceScale` | 当前契约支持 |
| `cjkGlyphFallbackMode` | `"hide"` / `"rotatedLabel"` / `"simpleLineLabel"` / `"textPathIfAllowed"` | 可选 | 中文逐字模式失败后的回退策略。 | `"simpleLineLabel"`；行 47197，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/cjkGlyphFallbackMode` | 当前契约支持 |
| `simpleFallbackEnabled` | boolean：true / false | 可选 | 是否允许简化的沿线文字回退。 | `true`；行 47198，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/simpleFallbackEnabled` | 当前契约支持 |
| `simpleFallbackRotate` | boolean：true / false | 可选 | 简化回退文字是否随线旋转。 | `true`；行 47199，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/simpleFallbackRotate` | 当前契约支持 |
| `repositionMode` | `"off"` / `"chainageSearch"` | 可选 | 碰撞后是否沿线尝试重新定位。 | `"chainageSearch"`；行 47200，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/repositionMode` | 当前契约支持 |
| `repositionAttemptsPerDirection` | number | 可选 | 沿线每个方向的重定位尝试次数。 | `3`；行 47201，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/repositionAttemptsPerDirection` | 当前契约支持 |
| `repositionStepMode` | `"labelSpan"` / `"fixedWorld"` / `"fixedPx"` | 可选 | 重定位步长按标签跨度、世界距离或屏幕像素计算。 | `"labelSpan"`；行 47202，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/repositionStepMode` | 当前契约支持 |
| `repositionFailure` | `"hide"` / `"simpleLineLabel"` | 可选 | 重定位全部失败后的处理。 | `"hide"`；行 47203，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/repositionFailure` | 当前契约支持 |
| `repositionStrictSvg` | boolean：true / false | 可选 | 重定位时是否限定严格 SVG 路径方案。 | `true`；行 47204，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/repositionStrictSvg` | 当前契约支持 |
| `avoidLineGeometry` | boolean：true / false | 可选 | 重定位时是否避让线几何。 | `false`；行 47205，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/avoidLineGeometry` | 当前契约支持 |
| `avoidPolygonGeometry` | boolean：true / false | 可选 | 重定位时是否避让面几何。 | `false`；行 47206，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/avoidPolygonGeometry` | 当前契约支持 |
| `avoidPointSymbols` | boolean：true / false | 可选 | 重定位时是否避让点符号。 | `true`；行 47207，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/avoidPointSymbols` | 当前契约支持 |
| `repositionCollisionScope` | 数组＜`"lineLabel"` / `"surfaceLabel"` / `"pointLabel"` / `"pointSymbol"` / `"requiredLabel"` / `"selectedLabel"` / `"searchResultLabel"`＞ | 可选 | 沿线重定位需要考虑的碰撞类别集合。 | 本包未写入 | 当前契约支持 |
| `viewportRectMode` | `"auto"` / `"rawMetrics"` / `"anchorNormalized"` | 可选 | 用于视窗判断的文字边界矩形计算方式。 | `"anchorNormalized"`；行 47208，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/viewportRectMode` | 当前契约支持 |
| `viewportCandidateMode` | `"off"` / `"stableFirstViewportFallback"` | 可选 | 视窗局部候选的回退策略。 | `"stableFirstViewportFallback"`；行 47209，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/viewportCandidateMode` | 当前契约支持 |
| `viewportCandidateBufferPx` | number | 可选 | 视窗候选缓冲距离，单位像素。 | `72`；行 47210，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/viewportCandidateBufferPx` | 当前契约支持 |
| `viewportCandidateMaxTargets` | number | 可选 | 视窗回退候选的目标数量上限。 | `1`；行 47211，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/viewportCandidateMaxTargets` | 当前契约支持 |
| `viewportCandidateMinIntervalPx` | number | 可选 | 视窗候选的最小屏幕间隔。 | `48`；行 47212，Pointer `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0/extensions/lineLabel/viewportCandidateMinIntervalPx` | 当前契约支持 |

<a id="t24"></a>

## t24 · RenderAnchorExtension

首次类型入口：`$.engine.renderDefaults.Point.anchor`。本包实例：`/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/anchor`，完整 JSON 第 1233–1244 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `candidatePlacement` | `"relativeToPlacement"` / `"aroundAnchor"` | 可选 | 候选相对既有方向偏移，或围绕几何锚点分布。 | `"aroundAnchor"`；行 1243，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/anchor/candidatePlacement` | 当前契约支持 |
| `strategy` | `"inherit"` / `"featureCenter"` / `"interior"` / `"visibleInterior"` / `"lineCenter"` / `"lineCandidates"` | 可选 | 关系取色或几何锚点的解析策略。 | `"interior"`；行 1234，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/anchor/strategy` | 当前契约支持 |
| `candidates` | 数组＜`"C"` / `"N"` / `"S"` / `"E"` / `"W"` / `"NE"` / `"NW"` / `"SE"` / `"SW"`＞ | 可选 | 允许尝试的方位候选集合。 | `["C","N","S","E","W"]`；行 1235，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/anchor/candidates` | 当前契约支持 |
| `offsetPx` | [$.engine.renderDefaults.Point.anchor.offsetPx [t25]](#t25) | 可选 | 屏幕像素偏移对象，含 x/y。 | 本包未写入 | 当前契约支持 |
| `candidateOffsetsPx` | 数组＜[$.engine.renderDefaults.Point.anchor.candidateOffsetsPx[] [t26]](#t26)＞ | 可选 | 可命名的额外屏幕候选偏移数组。 | 本包未写入 | 当前契约支持 |
| `allowOutsideGeometry` | boolean：true / false | 可选 | 是否允许标签候选位于源几何外侧。 | 本包未写入 | 当前契约支持 |
| `requireInsideGeometry` | boolean：true / false | 可选 | 是否要求标签候选位于源几何内部。 | `true`；行 1242，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/anchor/requireInsideGeometry` | 当前契约支持 |
| `preferViewportCenter` | boolean：true / false | 可选 | 候选是否偏好当前视窗中心。 | 本包未写入 | 当前契约支持 |

<a id="t25"></a>

## t25 · $.engine.renderDefaults.Point.anchor.offsetPx

首次类型入口：`$.engine.renderDefaults.Point.anchor.offsetPx`。本包没有此结构的实际实例；可能是可选功能或兼容分支。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `x` | number | 必填 | X 坐标或水平像素偏移；由所在坐标/偏移对象区分。 | 本包未写入 | 当前契约支持 |
| `y` | number | 必填 | 世界高度坐标或垂直像素偏移；地图平面第二轴通常是 z。 | 本包未写入 | 当前契约支持 |

<a id="t26"></a>

## t26 · $.engine.renderDefaults.Point.anchor.candidateOffsetsPx[]

首次类型入口：`$.engine.renderDefaults.Point.anchor.candidateOffsetsPx[]`。本包没有此结构的实际实例；可能是可选功能或兼容分支。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `name` | string | 必填 | 候选名称、署名名称等人类可读文本；不是稳定 ID。 | 本包未写入 | 当前契约支持 |
| `x` | number | 必填 | X 坐标或水平像素偏移；由所在坐标/偏移对象区分。 | 本包未写入 | 当前契约支持 |
| `y` | number | 必填 | 世界高度坐标或垂直像素偏移；地图平面第二轴通常是 z。 | 本包未写入 | 当前契约支持 |

<a id="t27"></a>

## t27 · RenderPolygonCandidateExtension

首次类型入口：`$.engine.renderDefaults.Point.polygonCandidates`。本包实例：`/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/polygonCandidates`，完整 JSON 第 1245–1248 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `weightMode` | `"none"` / `"distanceToCenter"` | 可选 | 候选加权方式。 | `"distanceToCenter"`；行 12046，Pointer `/nodes/10/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/polygonCandidates/weightMode` | 当前契约支持 |
| `weightedSwitchThreshold` | number | 可选 | 加权候选切换的优势门槛。 | `20`；行 12047，Pointer `/nodes/10/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/polygonCandidates/weightedSwitchThreshold` | 当前契约支持 |
| `reuseBonus` | number | 可选 | 复用旧候选的评分加成。 | `12`；行 12048，Pointer `/nodes/10/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/polygonCandidates/reuseBonus` | 当前契约支持 |
| `viewportPreference` | boolean：true / false | 可选 | 是否偏好位于当前视窗内的候选。 | `true`；行 12049，Pointer `/nodes/10/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/polygonCandidates/viewportPreference` | 当前契约支持 |
| `edgePenalty` | number | 可选 | 候选靠近视窗边缘的扣分。 | `8`；行 12050，Pointer `/nodes/10/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/polygonCandidates/edgePenalty` | 当前契约支持 |
| `mode` | `"inherit"` / `"none"` / `"fixedInterior"` / `"autoInteriorGrid"` / `"largeFeatureGrid"` / `"viewportAwareCandidateSet"` / `"gridByWorldUnits"` | 可选 | 当前联合结构的分支选择器；先看 mode，再解释其余字段。 | `"fixedInterior"`；行 1246，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/polygonCandidates/mode` | 当前契约支持 |
| `count` | number | 可选 | 候选生成数量。 | `9`；行 12052，Pointer `/nodes/10/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/polygonCandidates/count` | 当前契约支持 |
| `gridSize` | number | 可选 | 候选网格的尺度参数；单位须结合生成模式读取。 | 本包未写入 | 当前契约支持 |
| `gridMinSize` | number | 可选 | 候选网格最小尺度。 | 本包未写入 | 当前契约支持 |
| `maxCandidates` | number | 可选 | 候选总数量上限。 | `100`；行 12053，Pointer `/nodes/10/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/polygonCandidates/maxCandidates` | 当前契约支持 |
| `scanMax` | number | 可选 | 候选扫描/筛选预算上限。 | 本包未写入 | 当前契约支持 |
| `overflow` | `"rankedPrune"` / `"seededPrune"` | 可选 | 候选超额后的裁剪方式。 | 本包未写入 | 当前契约支持 |
| `preferPreviousCandidate` | boolean：true / false | 可选 | 优先复用上一次合法候选以减少跳动。 | `true`；行 1247，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/polygonCandidates/preferPreviousCandidate` | 当前契约支持 |
| `switchThreshold` | number | 可选 | 改选候选所需的优势门槛。 | `0.4`；行 12055，Pointer `/nodes/10/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/polygonCandidates/switchThreshold` | 当前契约支持 |
| `allowViewportFallback` | boolean：true / false | 可选 | 是否允许退回视窗局部候选。 | `true`；行 12056，Pointer `/nodes/10/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/polygonCandidates/allowViewportFallback` | 当前契约支持 |
| `minScreenAreaPx` | number | 可选 | 最小屏幕面积，单位 px²；在候选设置中只限制标签候选。 | `10000`；行 12057，Pointer `/nodes/10/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/polygonCandidates/minScreenAreaPx` | 当前契约支持 |
| `preferViewportCenter` | boolean：true / false | 可选 | 候选是否偏好当前视窗中心。 | `true`；行 12058，Pointer `/nodes/10/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/polygonCandidates/preferViewportCenter` | 当前契约支持 |

<a id="t28"></a>

## t28 · RenderCollisionExtension

首次类型入口：`$.engine.renderDefaults.Point.collision`。本包实例：`/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/collision`，完整 JSON 第 1255–1265 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `boundsAdjustment` | [$.engine.renderDefaults.Point.collision.boundsAdjustment [t29]](#t29) | 可选 | 碰撞边界的 x/y/width/height 修正。 | `{"y":-3.7,"width":3}`；行 1402，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/1/extensions/collision/boundsAdjustment` | 当前契约支持 |
| `collideWith` | 数组＜`"symbol"` / `"requiredLabel"` / `"importantLabel"` / `"optionalLabel"` / `"softLabel"` / `"geometry"`＞ | 可选 | 当前对象需要避让的对象类别。 | `["symbol","requiredLabel","importantLabel","optionalLabel","softLabel"]`；行 1256，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/collision/collideWith` | 当前契约支持 |
| `blocks` | 数组＜`"optionalLabel"` / `"softLabel"` / `"poiLabel"` / `"structureLabel"`＞ | 可选 | 当前对象会阻挡哪些类别的标签。 | 本包未写入 | 当前契约支持 |
| `allowOverlap` | boolean：true / false | 可选 | 是否允许重叠显示。 | 本包未写入 | 当前契约支持 |
| `paddingPx` | number | 可选 | 碰撞边界额外留白，单位像素。 | `3`；行 1263，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/collision/paddingPx` | 当前契约支持 |
| `hidePolicy` | `"hide"` / `"abbreviateThenHide"` / `"forceShow"` / `"showWithoutBlocking"` / `"geometryOnly"` | 可选 | 碰撞失败时隐藏、缩写、强显或仅几何等策略。 | `"abbreviateThenHide"`；行 1264，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/collision/hidePolicy` | 当前契约支持 |

<a id="t29"></a>

## t29 · $.engine.renderDefaults.Point.collision.boundsAdjustment

首次类型入口：`$.engine.renderDefaults.Point.collision.boundsAdjustment`。本包实例：`/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/1/extensions/collision/boundsAdjustment`，完整 JSON 第 1402–1405 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `x` | number | 可选 | X 坐标或水平像素偏移；由所在坐标/偏移对象区分。 | 本包未写入 | 当前契约支持 |
| `y` | number | 可选 | 世界高度坐标或垂直像素偏移；地图平面第二轴通常是 z。 | `-3.7`；行 1403，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/1/extensions/collision/boundsAdjustment/y` | 当前契约支持 |
| `width` | number | 可选 | 轮廓宽度或边界框宽度修正；具体由所在对象解释。 | `3`；行 1404，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/1/extensions/collision/boundsAdjustment/width` | 当前契约支持 |
| `height` | number | 可选 | 边界框高度修正，或绘制绑定返回有效高度。 | 本包未写入 | 当前契约支持 |

<a id="t30"></a>

## t30 · RenderStabilityExtension

首次类型入口：`$.engine.renderDefaults.Point.stability`。本包实例：`/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/stability`，完整 JSON 第 1278–1288 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `enabled` | boolean：true / false | 可选 | 启用标记；false 不等于删除定义，具体作用范围取决于所在模块。 | `true`；行 1279，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/stability/enabled` | 当前契约支持 |
| `cacheKey` | `"featureID"` / `"featureID+zoomBucket"` / `"featureID+mode"` / `"custom"` | 可选 | 稳定候选缓存的上下文组成。 | `"featureID+zoomBucket"`；行 1280，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/stability/cacheKey` | 当前契约支持 |
| `zoomBucketSize` | number | 可选 | 用于稳定缓存的 Zoom 分桶宽度。 | `1`；行 1281，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/stability/zoomBucketSize` | 当前契约支持 |
| `freezeDuringPan` | boolean：true / false | 可选 | 地图平移期间是否暂时保留旧候选。 | `true`；行 1282，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/stability/freezeDuringPan` | 当前契约支持 |
| `recomputeOnMoveEnd` | boolean：true / false | 可选 | 平移结束后是否重算候选。 | `true`；行 1283，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/stability/recomputeOnMoveEnd` | 当前契约支持 |
| `recomputeOnZoomEnd` | boolean：true / false | 可选 | 缩放结束后是否重新核验候选。 | `true`；行 1284，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/stability/recomputeOnZoomEnd` | 当前契约支持 |
| `hysteresisPx` | number | 可选 | 稳定位置的滞后距离，单位像素。 | `36`；行 1285，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/stability/hysteresisPx` | 当前契约支持 |
| `keepPreviousCandidate` | boolean：true / false | 可选 | 是否保留上一轮候选。 | `true`；行 1287，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/stability/keepPreviousCandidate` | 当前契约支持 |
| `keepPreviousAnchor` | boolean：true / false | 可选 | 是否保留上一轮几何锚点。 | `true`；行 1286，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/stability/keepPreviousAnchor` | 当前契约支持 |
| `invalidateWhen` | 数组＜`"zoomBucketChanged"` / `"featureGeometryChanged"` / `"featureTextChanged"` / `"modeChanged"` / `"worldChanged"` / `"labelOutOfViewport"` / `"collisionFailedRepeatedly"`＞ | 可选 | 触发候选缓存失效的事件集合。 | 本包未写入 | 当前契约支持 |

<a id="t31"></a>

## t31 · RenderDensityExtension

首次类型入口：`$.engine.renderDefaults.Point.density`。本包实例：`/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/density`，完整 JSON 第 1266–1277 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `enabled` | boolean：true / false | 可选 | 启用标记；false 不等于删除定义，具体作用范围取决于所在模块。 | `true`；行 1268，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/density/enabled` | 当前契约支持 |
| `mode` | `"inherit"` / `"override"` | 必填 | 当前联合结构的分支选择器；先看 mode，再解释其余字段。 | `"override"`；行 1267，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/density/mode` | 当前契约支持 |
| `gridSizePx` | number | 可选 | 密度网格边长，单位屏幕像素。 | `104`；行 1269，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/density/gridSizePx` | 当前契约支持 |
| `maxLabelsPerGrid` | number | 可选 | 每个密度网格允许的标签数量。 | `2`；行 1270，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/density/maxLabelsPerGrid` | 当前契约支持 |
| `maxSymbolsPerGrid` | number | 可选 | 每个密度网格允许的符号数量。 | `999`；行 6986，Pointer `/nodes/5/geometryProfiles/Polygon/zoomPriority/rules/1/extensions/density/maxSymbolsPerGrid` | 当前契约支持 |
| `reduceOrder` | 数组＜`"geometryOnly"` / `"hideSoftLabels"` / `"abbreviateOptionalLabels"` / `"hideOptionalLabels"` / `"hideSymbols"`＞ | 可选 | 超出密度预算时依次采用的降级步骤。 | `["hideSoftLabels","geometryOnly"]`；行 1271，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/density/reduceOrder` | 当前契约支持 |
| `importanceField` | string | 可选 | 从本记录读取重要程度的字段。 | 本包未写入 | 当前契约支持 |
| `preserveSelected` | boolean：true / false | 可选 | 密度降级时是否优先保留选中目标。 | `true`；行 1275，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/density/preserveSelected` | 当前契约支持 |
| `preserveRequired` | boolean：true / false | 可选 | 密度降级时是否优先保留必显标签。 | `true`；行 1276，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/density/preserveRequired` | 当前契约支持 |

<a id="t32"></a>

## t32 · RenderFallbackExtension

首次类型入口：`$.engine.renderDefaults.Point.fallback`。本包实例：`/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/fallback`，完整 JSON 第 1289–1294 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `whenNoLabelText` | `"showID"` / `"placeholder"` / `"hideLabel"` / `"showClassKind"` | 可选 | 没有可用标签文字时的回退处理。 | `"hideLabel"`；行 1290，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/fallback/whenNoLabelText` | 当前契约支持 |
| `whenCollisionFailed` | `"forceShow"` / `"hideLabel"` / `"abbreviate"` / `"showGeometryOnly"` | 可选 | 碰撞求解失败后的回退处理。 | `"hideLabel"`；行 1291，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/fallback/whenCollisionFailed` | 当前契约支持 |
| `whenRuleMissing` | `"geometryOnly"` / `"hidden"` / `"debugDefault"` / `"legacyDefault"` | 可选 | 没有适用规则时的回退；不能默认理解为一定隐藏。 | `"geometryOnly"`；行 1292，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/fallback/whenRuleMissing` | 当前契约支持 |
| `whenGeometryInvalid` | `"skip"` / `"showErrorMarker"` / `"debugOnly"` | 可选 | 源几何无效时的处理方式。 | `"skip"`；行 1293，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions/fallback/whenGeometryInvalid` | 当前契约支持 |

<a id="t33"></a>

## t33 · RenderVisibilityExtension

首次类型入口：`$.engine.renderDefaults.Point.visibility`。本包实例：`/nodes/5/geometryProfiles/Polygon/zoomPriority/rules/1/extensions/visibility`，完整 JSON 第 7008–7014 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `mode` | `"inherit"` / `"always"` / `"sameId"` / `"coincidentPoint"` / `"lineContainmentChoice"` / `"activeContextMember"` | 必填 | 当前联合结构的分支选择器；先看 mode，再解释其余字段。 | `"activeContextMember"`；行 7009，Pointer `/nodes/5/geometryProfiles/Polygon/zoomPriority/rules/1/extensions/visibility/mode` | 当前契约支持 |
| `sameId` | [$.engine.renderDefaults.Point.visibility.sameId [t34]](#t34) | 可选 | 根据相同 ID 的其他分类记录是否存在控制可见性。 | `{"target":{"class":"STB"},"sourceField":"ID","targetField":"ID","behavior":"hideIfExists"}`；行 90380，Pointer `/nodes/76/geometryProfiles/Point/zoomPriority/rules/0/extensions/visibility/sameId` | 当前契约支持 |
| `coincidentPoint` | [$.engine.renderDefaults.Point.visibility.coincidentPoint [t35]](#t35) | 可选 | 根据同位置目标点是否存在控制可见性。 | `{"target":{"class":"STA"},"behavior":"hideIfExists","precision":1000}`；行 69597，Pointer `/nodes/64/geometryProfiles/Point/zoomPriority/rules/1/extensions/visibility/coincidentPoint` | 当前契约支持 |
| `lineContainmentChoice` | [$.engine.renderDefaults.Point.visibility.lineContainmentChoice [t36]](#t36) | 可选 | 根据低/高 Zoom 与线覆盖关系选择展示线。 | `{"field":"direction","primaryValue":"3","overlayValues":["0","1","2","4"],"switchZoom":8,"precision":1000}`；行 70912，Pointer `/nodes/65/geometryProfiles/LineString/zoomPriority/rules/0/extensions/visibility/lineContainmentChoice` | 当前契约支持 |
| `activeContextMember` | [$.engine.renderDefaults.Point.visibility.activeContextMember [t37]](#t37) | 可选 | 仅在当前主结构与层级上下文中显示成员。 | `{"bindingId":"structure-role-context","requireSelector":true}`；行 7010，Pointer `/nodes/5/geometryProfiles/Polygon/zoomPriority/rules/1/extensions/visibility/activeContextMember` | 当前契约支持 |

<a id="t34"></a>

## t34 · $.engine.renderDefaults.Point.visibility.sameId

首次类型入口：`$.engine.renderDefaults.Point.visibility.sameId`。本包实例：`/nodes/76/geometryProfiles/Point/zoomPriority/rules/0/extensions/visibility/sameId`，完整 JSON 第 90380–90387 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `target` | [ClassificationPath [t16]](#t16) | 必填 | 目标分类范围，或输出赋值的目标字段路径；二者不能混用。 | `{"class":"STB"}`；行 90381，Pointer `/nodes/76/geometryProfiles/Point/zoomPriority/rules/0/extensions/visibility/sameId/target` | 当前契约支持 |
| `sourceField` | string | 可选 | 当前记录用于匹配关系的字段。 | `"ID"`；行 90384，Pointer `/nodes/76/geometryProfiles/Point/zoomPriority/rules/0/extensions/visibility/sameId/sourceField` | 当前契约支持 |
| `targetField` | string | 可选 | 目标记录用于匹配或筛选的字段。 | `"ID"`；行 90385，Pointer `/nodes/76/geometryProfiles/Point/zoomPriority/rules/0/extensions/visibility/sameId/targetField` | 当前契约支持 |
| `behavior` | `"hideIfExists"` / `"showIfExists"` | 必填 | 存在性判断行为，或按钮互斥/联动设置。 | `"hideIfExists"`；行 90386，Pointer `/nodes/76/geometryProfiles/Point/zoomPriority/rules/0/extensions/visibility/sameId/behavior` | 当前契约支持 |

<a id="t35"></a>

## t35 · $.engine.renderDefaults.Point.visibility.coincidentPoint

首次类型入口：`$.engine.renderDefaults.Point.visibility.coincidentPoint`。本包实例：`/nodes/64/geometryProfiles/Point/zoomPriority/rules/1/extensions/visibility/coincidentPoint`，完整 JSON 第 69597–69603 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `target` | [ClassificationPath [t16]](#t16) | 必填 | 目标分类范围，或输出赋值的目标字段路径；二者不能混用。 | `{"class":"STA"}`；行 69598，Pointer `/nodes/64/geometryProfiles/Point/zoomPriority/rules/1/extensions/visibility/coincidentPoint/target` | 当前契约支持 |
| `behavior` | `"hideIfExists"` / `"showIfExists"` | 必填 | 存在性判断行为，或按钮互斥/联动设置。 | `"hideIfExists"`；行 69601，Pointer `/nodes/64/geometryProfiles/Point/zoomPriority/rules/1/extensions/visibility/coincidentPoint/behavior` | 当前契约支持 |
| `targetField` | string | 可选 | 目标记录用于匹配或筛选的字段。 | `"Connect"`；行 91565，Pointer `/nodes/77/geometryProfiles/Point/zoomPriority/rules/2/extensions/visibility/coincidentPoint/targetField` | 当前契约支持 |
| `targetEquals` | string | 可选 | 目标记录指定字段需等于的文本值。 | 本包未写入 | 当前契约支持 |
| `targetNotEquals` | string | 可选 | 目标记录指定字段需不等于的文本值。 | `"false"`；行 91566，Pointer `/nodes/77/geometryProfiles/Point/zoomPriority/rules/2/extensions/visibility/coincidentPoint/targetNotEquals` | 当前契约支持 |
| `precision` | number | 可选 | 几何/位置比较精度参数。 | `1000`；行 69602，Pointer `/nodes/64/geometryProfiles/Point/zoomPriority/rules/1/extensions/visibility/coincidentPoint/precision` | 当前契约支持 |

<a id="t36"></a>

## t36 · $.engine.renderDefaults.Point.visibility.lineContainmentChoice

首次类型入口：`$.engine.renderDefaults.Point.visibility.lineContainmentChoice`。本包实例：`/nodes/65/geometryProfiles/LineString/zoomPriority/rules/0/extensions/visibility/lineContainmentChoice`，完整 JSON 第 70912–70923 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `field` | string | 必填 | 所引用的数据字段路径；不同位置的可用字段集由对应分类限定。 | `"direction"`；行 70913，Pointer `/nodes/65/geometryProfiles/LineString/zoomPriority/rules/0/extensions/visibility/lineContainmentChoice/field` | 当前契约支持 |
| `primaryValue` | string | 必填 | 低 Zoom 主要展示的字段值。 | `"3"`；行 70914，Pointer `/nodes/65/geometryProfiles/LineString/zoomPriority/rules/0/extensions/visibility/lineContainmentChoice/primaryValue` | 当前契约支持 |
| `overlayValues` | 数组＜string＞ | 必填 | 达到切换 Zoom 后可选的覆盖展示值集合。 | `["0","1","2","4"]`；行 70915，Pointer `/nodes/65/geometryProfiles/LineString/zoomPriority/rules/0/extensions/visibility/lineContainmentChoice/overlayValues` | 当前契约支持 |
| `switchZoom` | number | 必填 | 关系可见性策略切换所用的逻辑 Zoom。 | `8`；行 70921，Pointer `/nodes/65/geometryProfiles/LineString/zoomPriority/rules/0/extensions/visibility/lineContainmentChoice/switchZoom` | 当前契约支持 |
| `precision` | number | 可选 | 几何/位置比较精度参数。 | `1000`；行 70922，Pointer `/nodes/65/geometryProfiles/LineString/zoomPriority/rules/0/extensions/visibility/lineContainmentChoice/precision` | 当前契约支持 |

<a id="t37"></a>

## t37 · $.engine.renderDefaults.Point.visibility.activeContextMember

首次类型入口：`$.engine.renderDefaults.Point.visibility.activeContextMember`。本包实例：`/nodes/5/geometryProfiles/Polygon/zoomPriority/rules/1/extensions/visibility/activeContextMember`，完整 JSON 第 7010–7013 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `bindingId` | string | 可选 | 旧上下文绑定的稳定 ID；不是任意字段名。 | `"structure-role-context"`；行 7011，Pointer `/nodes/5/geometryProfiles/Polygon/zoomPriority/rules/1/extensions/visibility/activeContextMember/bindingId` | 当前契约支持 |
| `requireSelector` | boolean：true / false | 可选 | 是否必须存在有效层级选择才显示成员。 | `true`；行 7012，Pointer `/nodes/5/geometryProfiles/Polygon/zoomPriority/rules/1/extensions/visibility/activeContextMember/requireSelector` | 当前契约支持 |

<a id="t38"></a>

## t38 · Partial

首次类型入口：`$.engine.renderDefaults.Point.interaction`。本包实例：`/nodes/66/geometryProfiles/LineString/zoomPriority/rules/0/extensions/interaction`，完整 JSON 第 73549–73580 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `hover` | [Partial [t39]](#t39) | 可选 | 鼠标悬停状态的交互外观。 | 本包未写入 | 当前契约支持 |
| `selected` | [Partial [t39]](#t39) | 可选 | 选中状态的外观；在工作流 geometry 中则表示固定几何类型。 | `{"strokeColor":"#2196F3","strokeColorBinding":{"mode":"field","field":"color","fallbackColor":"#2196F3"},"strokeWidth":6,"dashArray":"","outline":{"co…（摘要）`；行 73550，Pointer `/nodes/66/geometryProfiles/LineString/zoomPriority/rules/0/extensions/interaction/selected` | 当前契约支持 |
| `searchResult` | [Partial [t39]](#t39) | 可选 | 搜索命中状态的交互外观。 | `{"strokeColor":"#2196F3","strokeColorBinding":{"mode":"field","field":"color","fallbackColor":"#2196F3"},"strokeWidth":6,"dashArray":"","outline":{"co…（摘要）`；行 73565，Pointer `/nodes/66/geometryProfiles/LineString/zoomPriority/rules/0/extensions/interaction/searchResult` | 当前契约支持 |
| `editing` | [Partial [t39]](#t39) | 可选 | 编辑状态的交互外观。 | 本包未写入 | 当前契约支持 |
| `deletionMarked` | [Partial [t39]](#t39) | 可选 | 标记删除状态的交互外观。 | 本包未写入 | 当前契约支持 |

<a id="t39"></a>

## t39 · Partial

首次类型入口：`$.engine.renderDefaults.Point.interaction.hover`。本包实例：`/nodes/66/geometryProfiles/LineString/zoomPriority/rules/0/extensions/interaction/selected`，完整 JSON 第 73550–73564 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `enabled` | boolean：true / false | 可选 | 启用标记；false 不等于删除定义，具体作用范围取决于所在模块。 | 本包未写入 | 当前契约支持 |
| `strokeColor` | string | 可选 | 交互覆盖的描边固定颜色。 | `"#2196F3"`；行 73551，Pointer `/nodes/66/geometryProfiles/LineString/zoomPriority/rules/0/extensions/interaction/selected/strokeColor` | 当前契约支持 |
| `strokeWidth` | number | 可选 | 交互描边宽度，单位像素。 | `6`；行 73557，Pointer `/nodes/66/geometryProfiles/LineString/zoomPriority/rules/0/extensions/interaction/selected/strokeWidth` | 当前契约支持 |
| `strokeOpacity` | number | 可选 | 描边不透明度，0 为透明，1 为不透明。 | 本包未写入 | 当前契约支持 |
| `fillColor` | string | 可选 | 交互覆盖的固定填充色。 | 本包未写入 | 当前契约支持 |
| `fillOpacity` | number | 可选 | 填充不透明度，0 为透明，1 为不透明。 | 本包未写入 | 当前契约支持 |
| `zIndexOffset` | number | 可选 | 在基础图层顺序上叠加的偏移量；不等于 Label 碰撞优先级。 | 本包未写入 | 当前契约支持 |
| `forceShowLabel` | boolean：true / false | 可选 | 此交互状态请求保留标签，不修改标签文字来源。 | 本包未写入 | 当前契约支持 |
| `labelPriority` | number | 可选 | 交互状态给 Label 的碰撞优先分数。 | 本包未写入 | 当前契约支持 |
| `symbol` | [$.engine.interactionBaselines.Point.hover.symbol [t9]](#t9) | 可选 | 交互点标记配置；并非源几何坐标。 | 本包未写入 | 当前契约支持 |
| `outline` | [$.engine.interactionBaselines.Point.hover.outline [t10]](#t10) | 可选 | 交互覆盖的轮廓线描述。 | `{"color":"#ffffff","width":9,"opacity":0.85}`；行 73559，Pointer `/nodes/66/geometryProfiles/LineString/zoomPriority/rules/0/extensions/interaction/selected/outline` | 当前契约支持 |
| `dashArray` | string | 可选 | 旧版自定义虚线长度字符串。 | `""`；行 73558，Pointer `/nodes/66/geometryProfiles/LineString/zoomPriority/rules/0/extensions/interaction/selected/dashArray` | 当前契约支持 |
| `strokeColorBinding` | [$.engine.interactionBaselines.Point.hover.strokeColorBinding [t11]](#t11) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding [t13]](#t13) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding [t14]](#t14) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding [t15]](#t15) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding [t17]](#t17) | 可选 | 交互描边颜色的取值方式，可按字段、关系或值对照求色。 | `{"mode":"field","field":"color","fallbackColor":"#2196F3"}`；行 73552，Pointer `/nodes/66/geometryProfiles/LineString/zoomPriority/rules/0/extensions/interaction/selected/strokeColorBinding` | 当前契约支持 |

<a id="t40"></a>

## t40 · ConfigRegistries

首次类型入口：`$.registries`。本包实例：`/registries`，完整 JSON 第 223–944 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `optionSets` | 数组＜[$.registries.optionSets[] [t41]](#t41)＞ | 可选 | 旧式共享选项登记；当前公共表使用 lookupTables。 | 本包未写入 | 兼容/迁移保留 |
| `cardLayouts` | 数组＜[ControlledRegistryItem [t43]](#t43)＞ | 必填 | 受控信息卡布局登记表。 | `[{"id":"standard-feature-card","label":{"zh":"标准要素信息卡","en":""}},{"id":"generic-point-card","label":{"zh":"通用点要素信息卡","en":""}},{"id":"generic-line-car…（摘要）`；行 224，Pointer `/registries/cardLayouts` | 当前契约支持 |
| `cardComponents` | 数组＜[ControlledRegistryItem [t43]](#t43)＞ | 必填 | 允许使用的代码信息卡组件登记表。 | `[{"id":"TRP","label":{"zh":"TRP 专用信息卡","en":"TRP special feature card"},"allowedClasses":["TRP"]}]`；行 331，Pointer `/registries/cardComponents` | 当前契约支持 |
| `displayProfiles` | 数组＜[ControlledRegistryItem [t43]](#t43)＞ | 必填 | 迁移/登记用的显示能力清单。 | `[{"id":"largeGeoSurface","label":{"zh":"Large geographic surface","en":""}},{"id":"networkLine","label":{"zh":"Network line","en":""}},{"id":"building…（摘要）`；行 343，Pointer `/registries/displayProfiles` | 当前契约支持 |
| `specialDisplayLogic` | 数组＜[ControlledRegistryItem [t43]](#t43)＞ | 必填 | 受控特殊显示能力的登记清单。 | `[{"id":"teleportPointBinding","label":{"zh":"传送点显示绑定","en":""},"allowedClasses":["TPP"]},{"id":"warpPointBinding","label":{"zh":"Warp点显示绑定","en":""},"…（摘要）`；行 401，Pointer `/registries/specialDisplayLogic` | 当前契约支持 |
| `workflowControls` | 数组＜[ControlledRegistryItem [t43]](#t43)＞ | 必填 | 受控工作流控件类型登记表。 | `[{"id":"text","label":{"zh":"Text input","en":""}},{"id":"textarea","label":{"zh":"Textarea input","en":""}},{"id":"number","label":{"zh":"Number inpu…（摘要）`；行 667，Pointer `/registries/workflowControls` | 当前契约支持 |
| `workflowBlocks` | 数组＜[ControlledRegistryItem [t43]](#t43)＞ | 必填 | 受控外部工作流单元登记表。 | `[{"id":"fieldInput","label":{"zh":"标准字段直灌","en":""}},{"id":"runtimeValue","label":{"zh":"公共值","en":""}},{"id":"relationSearch","label":{"zh":"通用关系搜索框"…（摘要）`；行 823，Pointer `/registries/workflowBlocks` | 当前契约支持 |

<a id="t41"></a>

## t41 · $.registries.optionSets[]

首次类型入口：`$.registries.optionSets[]`。本包没有此结构的实际实例；可能是可选功能或兼容分支。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `id` | string | 必填 | 当前对象的稳定标识；唯一性范围取决于对象类型。 | 本包未写入 | 当前契约支持 |
| `label` | [LocalizedText [t1]](#t1) | 必填 | 名称对象或 Label 样式对象；必须结合所在路径解读。 | 本包未写入 | 当前契约支持 |
| `options` | 数组＜[SelectOption [t42]](#t42)＞ | 必填 | 控件本地选项数组、组件设置对象等；不能跨对象套用。 | 本包未写入 | 当前契约支持 |

<a id="t42"></a>

## t42 · SelectOption

首次类型入口：`$.registries.optionSets[].options[]`。本包实例：`/nodes/65/fields/4/optionTable/rows/0`，完整 JSON 第 70587–70593 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `value` | string | 必填 | 最终存储值、条件比较值或常量；是否字符串须看当前类型声明。 | `"0"`；行 70588，Pointer `/nodes/65/fields/4/optionTable/rows/0/value` | 当前契约支持 |
| `label` | [LocalizedText [t1]](#t1) | 必填 | 名称对象或 Label 样式对象；必须结合所在路径解读。 | `{"zh":"下行","en":""}`；行 70589，Pointer `/nodes/65/fields/4/optionTable/rows/0/label` | 当前契约支持 |

<a id="t43"></a>

## t43 · ControlledRegistryItem

首次类型入口：`$.registries.cardLayouts[]`。本包实例：`/registries/cardLayouts/0`，完整 JSON 第 225–231 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `id` | string | 必填 | 当前对象的稳定标识；唯一性范围取决于对象类型。 | `"standard-feature-card"`；行 226，Pointer `/registries/cardLayouts/0/id` | 当前契约支持 |
| `label` | [LocalizedText [t1]](#t1) | 必填 | 名称对象或 Label 样式对象；必须结合所在路径解读。 | `{"zh":"标准要素信息卡","en":""}`；行 227，Pointer `/registries/cardLayouts/0/label` | 当前契约支持 |
| `allowedClasses` | 数组＜string＞ | 可选 | 组件允许服务的 Class 代码集合。 | `["TRP"]`；行 338，Pointer `/registries/cardComponents/0/allowedClasses` | 当前契约支持 |
| `optionSchema` | 数组＜[$.registries.cardLayouts[].optionSchema[] [t44]](#t44)＞ | 可选 | 受控组件可编辑选项的结构说明。 | 本包未写入 | 当前契约支持 |

<a id="t44"></a>

## t44 · $.registries.cardLayouts[].optionSchema[]

首次类型入口：`$.registries.cardLayouts[].optionSchema[]`。本包没有此结构的实际实例；可能是可选功能或兼容分支。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `key` | string | 必填 | 真实数据字段路径或重复组成员键；不等于 fieldId。 | 本包未写入 | 当前契约支持 |
| `label` | [LocalizedText [t1]](#t1) | 必填 | 名称对象或 Label 样式对象；必须结合所在路径解读。 | 本包未写入 | 当前契约支持 |
| `type` | `"number"` / `"boolean"` / `"text"` / `"select"` | 必填 | 数据类型，或受控组件选项的输入类型。 | 本包未写入 | 当前契约支持 |
| `options` | 数组＜string＞ | 可选 | 控件本地选项数组、组件设置对象等；不能跨对象套用。 | 本包未写入 | 当前契约支持 |

<a id="t45"></a>

## t45 · LookupTable

首次类型入口：`$.lookupTables[]`。本包实例：`/lookupTables/0`，完整 JSON 第 115556–115632 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `id` | string | 必填 | 当前对象的稳定标识；唯一性范围取决于对象类型。 | `"teleport-hubs"`；行 115557，Pointer `/lookupTables/0/id` | 当前契约支持 |
| `label` | [LocalizedText [t1]](#t1) | 必填 | 名称对象或 Label 样式对象；必须结合所在路径解读。 | `{"zh":"所属枢纽区","en":""}`；行 115558，Pointer `/lookupTables/0/label` | 当前契约支持 |
| `valueType` | `"string"` / `"number"` / `"boolean"` | 必填 | 对照表实际存储标量的类型；行内 value 仍用文本编码。 | `"string"`；行 115562，Pointer `/lookupTables/0/valueType` | 当前契约支持 |
| `functionKind` | `"none"` / `"speed"` / `"teleportHub"` / `"tagField"` | 必填 | 公共表功能值的用途：普通、速度、枢纽或标签字段定义。 | `"teleportHub"`；行 115563，Pointer `/lookupTables/0/functionKind` | 当前契约支持 |
| `rows` | 数组＜[$.lookupTables[].rows[] [t46]](#t46)＞ | 必填 | 公共表/本地表的行数组，或文字控件行高；以所在类型区分。 | `[{"value":"zthspawn","label":{"zh":"zthspawn","en":""},"functionValue":{"world":"zth","range":100,"returnPoints":[{"id":"zth_main_1","label":{"zh":"初生…（摘要）`；行 115564，Pointer `/lookupTables/0/rows` | 当前契约支持 |

<a id="t46"></a>

## t46 · $.lookupTables[].rows[]

首次类型入口：`$.lookupTables[].rows[]`。本包实例：`/lookupTables/0/rows/0`，完整 JSON 第 115565–115597 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `value` | string | 必填 | 最终存储值、条件比较值或常量；是否字符串须看当前类型声明。 | `"zthspawn"`；行 115566，Pointer `/lookupTables/0/rows/0/value` | 当前契约支持 |
| `label` | [LocalizedText [t1]](#t1) | 必填 | 名称对象或 Label 样式对象；必须结合所在路径解读。 | `{"zh":"zthspawn","en":""}`；行 115567，Pointer `/lookupTables/0/rows/0/label` | 当前契约支持 |
| `functionValue` | number / [TagFieldMetadata [t47]](#t47) / [$.lookupTables[].rows[].functionValue [t49]](#t49) | 可选 | 公共表的功能值，可为数字、枢纽参数或标签字段元数据。 | `{"world":"zth","range":100,"returnPoints":[{"id":"zth_main_1","label":{"zh":"初生水殿","en":""},"x":-644,"y":35,"z":-1562},{"id":"zth_main_1_1","label":{"…（摘要）`；行 115571，Pointer `/lookupTables/0/rows/0/functionValue` | 当前契约支持 |

<a id="t47"></a>

## t47 · TagFieldMetadata

首次类型入口：`$.lookupTables[].rows[].functionValue`。本包实例：`/lookupTables/2/rows/0/functionValue`，完整 JSON 第 115675–115678 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `kind` | `"tagField"` | 必填 | 分类路径第二级，或条件/控件的分支种类；依所在对象判读。 | `"tagField"`；行 115676，Pointer `/lookupTables/2/rows/0/functionValue/kind` | 当前契约支持 |
| `type` | `"number"` / `"text"` / `"select"` / `"bool"` | 必填 | 数据类型，或受控组件选项的输入类型。 | `"text"`；行 115677，Pointer `/lookupTables/2/rows/0/functionValue/type` | 当前契约支持 |
| `format` | `"plain"` / `"externalLink"` / `"date"` | 可选 | 字段/显示格式；只允许当前类型枚举中的受控格式。 | 本包未写入 | 当前契约支持 |
| `valueTable` | [OptionTable [t48]](#t48) | 可选 | 标签字段内部携带的本地选项表。 | 本包未写入 | 当前契约支持 |
| `valueTableId` | string | 可选 | 标签字段选项引用的公共表 ID。 | 本包未写入 | 当前契约支持 |

<a id="t48"></a>

## t48 · OptionTable

首次类型入口：`$.lookupTables[].rows[].functionValue.valueTable`。本包实例：`/nodes/65/fields/4/optionTable`，完整 JSON 第 70584–70644 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `valueType` | `"string"` / `"number"` / `"boolean"` | 必填 | 对照表实际存储标量的类型；行内 value 仍用文本编码。 | `"number"`；行 70585，Pointer `/nodes/65/fields/4/optionTable/valueType` | 当前契约支持 |
| `rows` | 数组＜[SelectOption [t42]](#t42)＞ | 必填 | 公共表/本地表的行数组，或文字控件行高；以所在类型区分。 | `[{"value":"0","label":{"zh":"下行","en":""}},{"value":"1","label":{"zh":"上行","en":""}},{"value":"2","label":{"zh":"其他","en":""}},{"value":"3","label":{"…（摘要）`；行 70586，Pointer `/nodes/65/fields/4/optionTable/rows` | 当前契约支持 |

<a id="t49"></a>

## t49 · $.lookupTables[].rows[].functionValue

首次类型入口：`$.lookupTables[].rows[].functionValue`。本包实例：`/lookupTables/0/rows/0/functionValue`，完整 JSON 第 115571–115596 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `world` | string | 必填 | 引擎的 World 写入约定，或功能行内的目标世界 ID。 | `"zth"`；行 115572，Pointer `/lookupTables/0/rows/0/functionValue/world` | 当前契约支持 |
| `range` | number | 必填 | 枢纽功能值的范围参数；保留现有 V1 功能语义。 | `100`；行 115573，Pointer `/lookupTables/0/rows/0/functionValue/range` | 当前契约支持 |
| `returnPoints` | 数组＜[$.lookupTables[].rows[].functionValue.returnPoints[] [t50]](#t50)＞ | 必填 | 枢纽的候选返回点数组。 | `[{"id":"zth_main_1","label":{"zh":"初生水殿","en":""},"x":-644,"y":35,"z":-1562},{"id":"zth_main_1_1","label":{"zh":"图书馆","en":""},"x":-760,"y":71,"z":-15…（摘要）`；行 115574，Pointer `/lookupTables/0/rows/0/functionValue/returnPoints` | 当前契约支持 |

<a id="t50"></a>

## t50 · $.lookupTables[].rows[].functionValue.returnPoints[]

首次类型入口：`$.lookupTables[].rows[].functionValue.returnPoints[]`。本包实例：`/lookupTables/0/rows/0/functionValue/returnPoints/0`，完整 JSON 第 115575–115584 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `id` | string | 必填 | 当前对象的稳定标识；唯一性范围取决于对象类型。 | `"zth_main_1"`；行 115576，Pointer `/lookupTables/0/rows/0/functionValue/returnPoints/0/id` | 当前契约支持 |
| `label` | [LocalizedText [t1]](#t1) | 必填 | 名称对象或 Label 样式对象；必须结合所在路径解读。 | `{"zh":"初生水殿","en":""}`；行 115577，Pointer `/lookupTables/0/rows/0/functionValue/returnPoints/0/label` | 当前契约支持 |
| `x` | number | 必填 | X 坐标或水平像素偏移；由所在坐标/偏移对象区分。 | `-644`；行 115581，Pointer `/lookupTables/0/rows/0/functionValue/returnPoints/0/x` | 当前契约支持 |
| `y` | number | 必填 | 世界高度坐标或垂直像素偏移；地图平面第二轴通常是 z。 | `35`；行 115582，Pointer `/lookupTables/0/rows/0/functionValue/returnPoints/0/y` | 当前契约支持 |
| `z` | number | 必填 | 世界 Z 平面坐标；不是几何图层 zLevel。 | `-1562`；行 115583，Pointer `/lookupTables/0/rows/0/functionValue/returnPoints/0/z` | 当前契约支持 |

<a id="t51"></a>

## t51 · ApplicationSettings

首次类型入口：`$.application`。本包实例：`/application`，完整 JSON 第 114958–115554 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `schemaVersion` | `"cairnmap.application.v1"` | 必填 | 文件结构标记；固定字符串用于识别整包、应用设置或对齐报告。 | `"cairnmap.application.v1"`；行 114959，Pointer `/application/schemaVersion` | 当前契约支持 |
| `worlds` | 数组＜[ApplicationWorld [t52]](#t52)＞ | 必填 | 可用世界数组；每个世界按来源组解析资源。 | `[{"id":"zth","prefix":"Z","numericCode":0,"label":{"zh":"零洲","en":""},"enabled":true,"default":true,"center":{"x":-643,"y":35,"z":-1562},"mapLink":"ht…（摘要）`；行 114960，Pointer `/application/worlds` | 当前契约支持 |
| `buttons` | [ApplicationButtons [t57]](#t57) | 必填 | 图层按钮及默认选择、互斥和状态保存设置。 | `{"storageKey":"cairnmap_rule_button_state_v1","legacyStorageKeys":["ria_rule_button_state_v1"],"maxActive":0,"fallback":["railway_new","road","natural…（摘要）`；行 115064，Pointer `/application/buttons` | 当前契约支持 |
| `sources` | [ApplicationSourceSettings [t64]](#t64) / [ApplicationWorldGroups [t69]](#t69) | 必填 | 数据读取设置；新配置使用 world-groups 来源组形式。 | `{"kind":"world-groups","defaultGroupId":"default","sharedInterfaceGroupId":"default","groups":[{"id":"default","label":{"zh":"默认共享来源","en":""},"enable…（摘要）`；行 115344，Pointer `/application/sources` | 当前契约支持 |
| `modules` | [ApplicationModules [t74]](#t74) | 必填 | 功能模块入口、加载策略与互斥关系。 | `{"items":[{"id":"mapping","enabled":true,"load":"lazy","exclusiveWith":["measurement","review"]},{"id":"measurement","enabled":true,"load":"lazy","exc…（摘要）`；行 115441，Pointer `/application/modules` | 当前契约支持 |
| `review` | [ApplicationReview [t77]](#t77) | 必填 | 审核功能开关、接口与服务器环境变量引用。 | `{"enabled":true,"provider":"github-cookie","protocol":"openriamap-review-v1","auth":{"start":"/api/auth/github/start","session":"/api/auth/github/sess…（摘要）`；行 115509，Pointer `/application/review` | 当前契约支持 |
| `preferences` | [ApplicationPreferences [t80]](#t80) | 必填 | 语言、搜索、导航、地图及工具栏默认偏好。 | `{"language":"zh","search":{"homepageLimit":35,"navigationLimit":30,"debounceMs":0},"navigation":{"transferWalkSpeed":3,"railRideSpeed":16,"transferCos…（摘要）`；行 115529，Pointer `/application/preferences` | 当前契约支持 |

<a id="t52"></a>

## t52 · ApplicationWorld

首次类型入口：`$.application.worlds[]`。本包实例：`/application/worlds/0`，完整 JSON 第 114961–114977 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `id` | string | 必填 | 当前对象的稳定标识；唯一性范围取决于对象类型。 | `"zth"`；行 114962，Pointer `/application/worlds/0/id` | 当前契约支持 |
| `prefix` | string | 必填 | 世界 ID 组装前缀或瓦片文件前缀，二者含义不同。 | `"Z"`；行 114963，Pointer `/application/worlds/0/prefix` | 当前契约支持 |
| `numericCode` | number | 必填 | 世界的数值编号。 | `0`；行 114964，Pointer `/application/worlds/0/numericCode` | 当前契约支持 |
| `label` | [ApplicationLabel [t53]](#t53) | 必填 | 名称对象或 Label 样式对象；必须结合所在路径解读。 | `{"zh":"零洲","en":""}`；行 114965，Pointer `/application/worlds/0/label` | 当前契约支持 |
| `enabled` | boolean | 必填 | 启用标记；false 不等于删除定义，具体作用范围取决于所在模块。 | `true`；行 114969，Pointer `/application/worlds/0/enabled` | 当前契约支持 |
| `default` | boolean | 必填 | 是否为该列表默认项；不是字段默认输入值。 | `true`；行 114970，Pointer `/application/worlds/0/default` | 当前契约支持 |
| `center` | [$.application.worlds[].center [t54]](#t54) | 必填 | 地图默认中心的世界 x/y/z 坐标。 | `{"x":-643,"y":35,"z":-1562}`；行 114971，Pointer `/application/worlds/0/center` | 当前契约支持 |
| `mapLink` | string | 必填 | 该世界对应的地图链接。 | `"https://satellite.ria.red/map/_zth/"`；行 114976，Pointer `/application/worlds/0/mapLink` | 当前契约支持 |
| `remoteWorldId` | string | 可选 | 来源服务使用的世界标签；省略时使用本地 world.id。 | 本包未写入 | 当前契约支持 |
| `dataSourceId` | string | 可选 | 旧式每世界直接绑定的数据源 ID；来源组模式下不得同时保存。 | 本包未写入 | 旧版兼容；来源组模式不可混写 |
| `projection` | [ApplicationProjection [t55]](#t55) | 可选 | 旧式世界投影显式配置；来源组模式以默认机制解析。 | 本包未写入 | 旧版兼容；来源组模式不可混写 |
| `tiles` | [ApplicationTiles [t56]](#t56) | 可选 | 瓦片来源设置；新配置通常位于来源组内。 | 本包未写入 | 旧版兼容；来源组模式不可混写 |
| `projectionOverride` | [ApplicationProjection [t55]](#t55) | 可选 | 特殊世界的投影覆写；普通世界无需列出默认矩阵。 | 本包未写入 | 当前契约支持 |

<a id="t53"></a>

## t53 · ApplicationLabel

首次类型入口：`$.application.worlds[].label`。本包实例：`/application/worlds/0/label`，完整 JSON 第 114965–114968 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `zh` | string | 必填 | 中文名称或说明；不能把实际存储值改写为此显示文本。 | `"零洲"`；行 114966，Pointer `/application/worlds/0/label/zh` | 当前契约支持 |
| `en` | string | 必填 | 英文名称或说明；空字符串在当前配置中很常见，具体显示依使用方回退。 | `""`；行 114967，Pointer `/application/worlds/0/label/en` | 当前契约支持 |

<a id="t54"></a>

## t54 · $.application.worlds[].center

首次类型入口：`$.application.worlds[].center`。本包实例：`/application/worlds/0/center`，完整 JSON 第 114971–114975 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `x` | number | 必填 | X 坐标或水平像素偏移；由所在坐标/偏移对象区分。 | `-643`；行 114972，Pointer `/application/worlds/0/center/x` | 当前契约支持 |
| `y` | number | 必填 | 世界高度坐标或垂直像素偏移；地图平面第二轴通常是 z。 | `35`；行 114973，Pointer `/application/worlds/0/center/y` | 当前契约支持 |
| `z` | number | 必填 | 世界 Z 平面坐标；不是几何图层 zLevel。 | `-1562`；行 114974，Pointer `/application/worlds/0/center/z` | 当前契约支持 |

<a id="t55"></a>

## t55 · ApplicationProjection

首次类型入口：`$.application.worlds[].projection`。本包没有此结构的实际实例；可能是可选功能或兼容分支。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `id` | `"dynmap-flat"` | 必填 | 当前对象的稳定标识；唯一性范围取决于对象类型。 | 本包未写入 | 当前契约支持 |
| `worldToMap` | 数组＜number＞ | 必填 | 世界坐标到地图投影的 9 项变换参数；普通世界不需手填。 | 本包未写入 | 当前契约支持 |
| `mapToWorld` | 数组＜number＞ | 必填 | 地图投影到世界坐标的 9 项反向参数；普通世界不需手填。 | 本包未写入 | 当前契约支持 |
| `mapzoomin` | number | 必填 | Dynmap 投影内部放大级数；与共享逻辑 Zoom 分开。 | 本包未写入 | 当前契约支持 |
| `mapzoomout` | number | 必填 | Dynmap 投影内部缩小级数；与共享逻辑 Zoom 分开。 | 本包未写入 | 当前契约支持 |
| `tileSize` | `128` | 必填 | Dynmap 投影瓦片尺寸；当前契约固定 128。 | 本包未写入 | 当前契约支持 |
| `tilescale` | number | 必填 | Dynmap 投影内部瓦片尺度参数。 | 本包未写入 | 当前契约支持 |

<a id="t56"></a>

## t56 · ApplicationTiles

首次类型入口：`$.application.worlds[].tiles`。本包没有此结构的实际实例；可能是可选功能或兼容分支。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `baseUrl` | string | 必填 | 数据访问/链接模式的根地址，或旧式瓦片地址。 | 本包未写入 | 当前契约支持 |
| `filteredBaseUrl` | string | 必填 | 旧式已过滤/代理瓦片地址；新模式由来源组代理注册解析。 | 本包未写入 | 当前契约支持 |
| `prefix` | string | 必填 | 世界 ID 组装前缀或瓦片文件前缀，二者含义不同。 | 本包未写入 | 当前契约支持 |
| `imageFormat` | `"jpg"` / `"png"` / `"webp"` | 必填 | 瓦片图片格式 jpg/png/webp。 | 本包未写入 | 当前契约支持 |
| `extraZoomLevels` | number | 必填 | 瓦片额外缩放级数；不改变逻辑 Zoom 的 0–8 范围。 | 本包未写入 | 当前契约支持 |
| `minNativeZoom` | number | 必填 | 原生瓦片下限，采用映射后的 Leaflet Zoom。 | 本包未写入 | 当前契约支持 |
| `maxNativeZoom` | number | 必填 | 原生瓦片上限，采用映射后的 Leaflet Zoom。 | 本包未写入 | 当前契约支持 |
| `attribution` | string | 必填 | 瓦片署名对象；旧格式也可能是 HTML 文本。 | 本包未写入 | 当前契约支持 |
| `maxRetries` | number | 必填 | 资源请求失败后的最大重试次数。 | 本包未写入 | 当前契约支持 |
| `retryDelay` | number | 必填 | 重试间隔，单位毫秒。 | 本包未写入 | 当前契约支持 |

<a id="t57"></a>

## t57 · ApplicationButtons

首次类型入口：`$.application.buttons`。本包实例：`/application/buttons`，完整 JSON 第 115064–115343 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `storageKey` | string | 必填 | 浏览器持久状态存储键；不是后端接口或数据仓库。 | `"cairnmap_rule_button_state_v1"`；行 115065，Pointer `/application/buttons/storageKey` | 当前契约支持 |
| `legacyStorageKeys` | 数组＜string＞ | 必填 | 仅用于读取旧浏览器状态的历史键名列表。 | `["ria_rule_button_state_v1"]`；行 115066，Pointer `/application/buttons/legacyStorageKeys` | 当前契约支持 |
| `maxActive` | number | 必填 | 同时启用图层按钮的数量上限。 | `0`；行 115069，Pointer `/application/buttons/maxActive` | 当前契约支持 |
| `fallback` | 数组＜string＞ | 必填 | 回退策略对象，或默认启用按钮 ID 列表，依所在模块解释。 | `["railway_new","road","natural_geo","settlement","planning","teleport_point","trade_point","building"]`；行 115070，Pointer `/application/buttons/fallback` | 当前契约支持 |
| `byWorld` | [Record [t58]](#t58) | 必填 | 以世界 ID 为键的默认启用按钮列表。 | `{}`；行 115080，Pointer `/application/buttons/byWorld` | 当前契约支持 |
| `items` | 数组＜[ApplicationButton [t59]](#t59)＞ | 必填 | 当前模块的项目数组；项目结构由所在类型说明。 | `[{"id":"railway_new","tone":"blue","iconKey":"train","defaultEnabled":true,"criteria":{"paths":[{"class":"PFB"},{"class":"PLF"},{"class":"RLE"},{"clas…（摘要）`；行 115081，Pointer `/application/buttons/items` | 当前契约支持 |

<a id="t58"></a>

## t58 · Record

首次类型入口：`$.application.buttons.byWorld`。本包实例：`/application/buttons/byWorld`，完整 JSON 第 115080–115080 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| 【自定义键】 | 数组＜string＞ | 按使用方约定 | 此对象是字典，键名可变；不代表任意位置均接受新属性。 | 见该对象实际内容 | 当前契约支持 |

<a id="t59"></a>

## t59 · ApplicationButton

首次类型入口：`$.application.buttons.items[]`。本包实例：`/application/buttons/items/0`，完整 JSON 第 115082–115126 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `id` | string | 必填 | 当前对象的稳定标识；唯一性范围取决于对象类型。 | `"railway_new"`；行 115083，Pointer `/application/buttons/items/0/id` | 当前契约支持 |
| `tone` | `"blue"` / `"green"` / `"cyan"` / `"purple"` / `"gray"` / `"orange"` / `"slate"` / `"red"` / `"teal"` / `"pink"` / `"amber"` / `"indigo"` | 必填 | 受控按钮配色方案键。 | `"blue"`；行 115084，Pointer `/application/buttons/items/0/tone` | 当前契约支持 |
| `iconKey` | string | 必填 | 受控 SVG 图标键；并非任意外部图片地址。 | `"train"`；行 115085，Pointer `/application/buttons/items/0/iconKey` | 当前契约支持 |
| `defaultEnabled` | boolean：true / false | 可选 | 按钮默认启用状态，仍受默认列表与状态恢复策略影响。 | `true`；行 115086，Pointer `/application/buttons/items/0/defaultEnabled` | 当前契约支持 |
| `criteria` | [CairnMapRuleButtonCriteria [t60]](#t60) | 必填 | 图层按钮筛选要素的分类范围。 | `{"paths":[{"class":"PFB"},{"class":"PLF"},{"class":"RLE"},{"class":"SBP"},{"class":"STA"},{"class":"STB"},{"class":"STF"}]}`；行 115087，Pointer `/application/buttons/items/0/criteria` | 当前契约支持 |
| `behavior` | [CairnMapRuleButtonBehavior [t62]](#t62) | 可选 | 存在性判断行为，或按钮互斥/联动设置。 | `{"exclusiveWith":[],"exclusiveGroup":null,"linkedButtons":[],"disableWhenEnabled":[],"enableWhenEnabled":[],"persistState":true}`；行 115112，Pointer `/application/buttons/items/0/behavior` | 当前契约支持 |
| `names` | [ApplicationLabel [t53]](#t53) | 必填 | 图层按钮的中英文显示名称。 | `{"zh":"铁路-新","en":""}`；行 115120，Pointer `/application/buttons/items/0/names` | 当前契约支持 |
| `size` | `28` / `36` / `44` | 必填 | 符号/文字尺寸或按钮尺寸；单位与数组结构见当前对象类型。 | `36`；行 115124，Pointer `/application/buttons/items/0/size` | 当前契约支持 |
| `group` | string | 必填 | 按钮视觉分组，或重复字段组定义。 | `"default"`；行 115125，Pointer `/application/buttons/items/0/group` | 当前契约支持 |

<a id="t60"></a>

## t60 · CairnMapRuleButtonCriteria

首次类型入口：`$.application.buttons.items[].criteria`。本包实例：`/application/buttons/items/0/criteria`，完整 JSON 第 115087–115111 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `paths` | 数组＜[$.application.buttons.items[].criteria.paths[] [t61]](#t61)＞ | 可选 | 分类路径范围数组；一行内部各层同时满足，多行之间取并集。 | `[{"class":"PFB"},{"class":"PLF"},{"class":"RLE"},{"class":"SBP"},{"class":"STA"},{"class":"STB"},{"class":"STF"}]`；行 115088，Pointer `/application/buttons/items/0/criteria/paths` | 当前契约支持 |
| `classCode` | 数组＜string＞ | 可选 | 旧式 Class 过滤列表或字段引用的 Class 目标；先看所属结构。 | 本包未写入 | 旧式分列过滤；新写入使用 paths |
| `kind` | 数组＜string＞ | 可选 | 分类路径第二级，或条件/控件的分支种类；依所在对象判读。 | 本包未写入 | 旧式分列过滤；新写入使用 paths |
| `skind` | 数组＜string＞ | 可选 | 分类路径第三级；实际新要素记录使用 SKind。 | 本包未写入 | 旧式分列过滤；新写入使用 paths |
| `skind2` | 数组＜string＞ | 可选 | 分类路径第四级；实际新要素记录使用 SKind2。 | 本包未写入 | 旧式分列过滤；新写入使用 paths |

<a id="t61"></a>

## t61 · $.application.buttons.items[].criteria.paths[]

首次类型入口：`$.application.buttons.items[].criteria.paths[]`。本包实例：`/application/buttons/items/0/criteria/paths/0`，完整 JSON 第 115089–115091 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `class` | string | 必填 | 分类路径第一级 Class；此处键名小写，实际要素记录使用 Class。 | `"PFB"`；行 115090，Pointer `/application/buttons/items/0/criteria/paths/0/class` | 当前契约支持 |
| `kind` | string | 可选 | 分类路径第二级，或条件/控件的分支种类；依所在对象判读。 | `"NGF"`；行 115163，Pointer `/application/buttons/items/2/criteria/paths/0/kind` | 当前契约支持 |
| `skind` | string | 可选 | 分类路径第三级；实际新要素记录使用 SKind。 | `"DBZ"`；行 115196，Pointer `/application/buttons/items/3/criteria/paths/0/skind` | 当前契约支持 |
| `skind2` | string | 可选 | 分类路径第四级；实际新要素记录使用 SKind2。 | 本包未写入 | 当前契约支持 |

<a id="t62"></a>

## t62 · CairnMapRuleButtonBehavior

首次类型入口：`$.application.buttons.items[].behavior`。本包实例：`/application/buttons/items/0/behavior`，完整 JSON 第 115112–115119 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `exclusiveWith` | 数组＜string＞ | 可选 | 与当前按钮/模块互斥的稳定 ID 列表。 | `[]`；行 115113，Pointer `/application/buttons/items/0/behavior/exclusiveWith` | 当前契约支持 |
| `exclusiveGroup` | null / string | 可选 | 互斥分组名称；同组按按钮算法限制共存。 | `null`；行 115114，Pointer `/application/buttons/items/0/behavior/exclusiveGroup` | 当前契约支持 |
| `linkedButtons` | 数组＜[CairnMapRuleButtonLinkedButton [t63]](#t63)＞ | 可选 | 当前按钮启用时对其他按钮执行的联动。 | `[]`；行 115115，Pointer `/application/buttons/items/0/behavior/linkedButtons` | 当前契约支持 |
| `disableWhenEnabled` | 数组＜string＞ | 可选 | 当前按钮启用时需关闭的其他按钮 ID 列表。 | `[]`；行 115116，Pointer `/application/buttons/items/0/behavior/disableWhenEnabled` | 当前契约支持 |
| `enableWhenEnabled` | 数组＜string＞ | 可选 | 当前按钮启用时需开启的其他按钮 ID 列表。 | `[]`；行 115117，Pointer `/application/buttons/items/0/behavior/enableWhenEnabled` | 当前契约支持 |
| `persistState` | boolean：true / false | 可选 | 是否保存按钮开关状态。 | `true`；行 115118，Pointer `/application/buttons/items/0/behavior/persistState` | 当前契约支持 |

<a id="t63"></a>

## t63 · CairnMapRuleButtonLinkedButton

首次类型入口：`$.application.buttons.items[].behavior.linkedButtons[]`。本包没有此结构的实际实例；可能是可选功能或兼容分支。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `targetId` | string | 必填 | 联动的目标按钮 ID。 | 本包未写入 | 当前契约支持 |
| `mode` | `"enableWhenThisEnabled"` / `"disableWhenThisEnabled"` / `"mirrorThisState"` | 必填 | 当前联合结构的分支选择器；先看 mode，再解释其余字段。 | 本包未写入 | 当前契约支持 |

<a id="t64"></a>

## t64 · ApplicationSourceSettings

首次类型入口：`$.application.sources`。本包实例：`/application/sources/groups/0/sources`，完整 JSON 第 115356–115425 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `storageKey` | string | 必填 | 浏览器持久状态存储键；不是后端接口或数据仓库。 | `"openriamap_formal_data_source_v1"`；行 115357，Pointer `/application/sources/groups/0/sources/storageKey` | 当前契约支持 |
| `defaultSourceId` | string | 必填 | 当前来源组内默认数据源 ID。 | `"formal-cos"`；行 115358，Pointer `/application/sources/groups/0/sources/defaultSourceId` | 当前契约支持 |
| `selectionMode` | `"fixed"` / `"user-select"` / `"user-select-on-failure"` | 必填 | 数据源选择方式：固定、用户可选或故障时可选。 | `"user-select"`；行 115359，Pointer `/application/sources/groups/0/sources/selectionMode` | 当前契约支持 |
| `retryOnFailure` | boolean | 必填 | 读取失败时是否允许重试。 | `true`；行 115360，Pointer `/application/sources/groups/0/sources/retryOnFailure` | 当前契约支持 |
| `items` | 数组＜[$.application.sources.items[] [t65]](#t65)＞ | 必填 | 当前模块的项目数组；项目结构由所在类型说明。 | `[{"id":"formal-cos","readerKind":"formal-release-v2","readerSchemaVersion":"openriamap.formal-release-reader.v2","rootUrl":"https://openriamap-cairn-d…（摘要）`；行 115361，Pointer `/application/sources/groups/0/sources/items` | 当前契约支持 |
| `github` | [$.application.sources.github [t66]](#t66) | 必填 | GitHub 访问适配所需的来源 ID 与仓库参数。 | `{"sourceIds":["formal-github"],"owner":"OpenRIAMap","repo":"OpenRIAMap-Cairn-Data","branch":"main"}`；行 115391，Pointer `/application/sources/groups/0/sources/github` | 当前契约支持 |
| `linkModes` | [$.application.sources.linkModes [t67]](#t67) | 必填 | GitHub Raw 兼容链接模式和默认项。 | `{"storageKey":"cairnmap_source_link_mode_v1","legacyStorageKeys":["ria_source_link_mode_v1"],"items":[{"id":"cdn639","label":{"zh":"CDN加速(639)","en":"…（摘要）`；行 115399，Pointer `/application/sources/groups/0/sources/linkModes` | 当前契约支持 |

<a id="t65"></a>

## t65 · $.application.sources.items[]

首次类型入口：`$.application.sources.items[]`。本包实例：`/application/sources/groups/0/sources/items/0`，完整 JSON 第 115362–115375 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `id` | string | 必填 | 当前对象的稳定标识；唯一性范围取决于对象类型。 | `"formal-cos"`；行 115363，Pointer `/application/sources/groups/0/sources/items/0/id` | 当前契约支持 |
| `label` | [ApplicationLabel [t53]](#t53) | 必填 | 名称对象或 Label 样式对象；必须结合所在路径解读。 | `{"zh":"正式数据源（COS）","en":""}`；行 115369，Pointer `/application/sources/groups/0/sources/items/0/label` | 当前契约支持 |
| `enabled` | boolean | 必填 | 启用标记；false 不等于删除定义，具体作用范围取决于所在模块。 | `true`；行 115373，Pointer `/application/sources/groups/0/sources/items/0/enabled` | 当前契约支持 |
| `selectable` | boolean | 必填 | 数据源是否作为可选入口显示。 | `true`；行 115374，Pointer `/application/sources/groups/0/sources/items/0/selectable` | 当前契约支持 |
| `readerKind` | `"formal-release-v2"` | 必填 | 数据读取器标识；当前仅正式发布读取器 formal-release-v2。 | `"formal-release-v2"`；行 115364，Pointer `/application/sources/groups/0/sources/items/0/readerKind` | 当前契约支持 |
| `readerSchemaVersion` | `"openriamap.formal-release-reader.v2"` | 必填 | 正式发布读取协议版本标记。 | `"openriamap.formal-release-reader.v2"`；行 115365，Pointer `/application/sources/groups/0/sources/items/0/readerSchemaVersion` | 当前契约支持 |
| `rootUrl` | string | 必填 | 正式数据仓库的根地址。 | `"https://openriamap-cairn-data-1433163128.cos.ap-shanghai.myqcloud.com"`；行 115366，Pointer `/application/sources/groups/0/sources/items/0/rootUrl` | 当前契约支持 |
| `mediaRootUrl` | string | 必填 | 媒体资源仓库的根地址。 | `"https://openriamap-cairn-media-1433163128.cos.ap-shanghai.myqcloud.com"`；行 115367，Pointer `/application/sources/groups/0/sources/items/0/mediaRootUrl` | 当前契约支持 |
| `transport` | `"direct"` / `"github-raw-compatible"` | 必填 | 直连或 GitHub Raw 兼容访问方式。 | `"direct"`；行 115368，Pointer `/application/sources/groups/0/sources/items/0/transport` | 当前契约支持 |

<a id="t66"></a>

## t66 · $.application.sources.github

首次类型入口：`$.application.sources.github`。本包实例：`/application/sources/groups/0/sources/github`，完整 JSON 第 115391–115398 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `sourceIds` | 数组＜string＞ | 必填 | 使用此 GitHub 适配的数据源 ID 列表。 | `["formal-github"]`；行 115392，Pointer `/application/sources/groups/0/sources/github/sourceIds` | 当前契约支持 |
| `owner` | string | 必填 | GitHub 仓库所有者。 | `"OpenRIAMap"`；行 115395，Pointer `/application/sources/groups/0/sources/github/owner` | 当前契约支持 |
| `repo` | string | 必填 | GitHub 仓库名称。 | `"OpenRIAMap-Cairn-Data"`；行 115396，Pointer `/application/sources/groups/0/sources/github/repo` | 当前契约支持 |
| `branch` | string | 必填 | GitHub 分支名称。 | `"main"`；行 115397，Pointer `/application/sources/groups/0/sources/github/branch` | 当前契约支持 |

<a id="t67"></a>

## t67 · $.application.sources.linkModes

首次类型入口：`$.application.sources.linkModes`。本包实例：`/application/sources/groups/0/sources/linkModes`，完整 JSON 第 115399–115424 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `storageKey` | string | 必填 | 浏览器持久状态存储键；不是后端接口或数据仓库。 | `"cairnmap_source_link_mode_v1"`；行 115400，Pointer `/application/sources/groups/0/sources/linkModes/storageKey` | 当前契约支持 |
| `legacyStorageKeys` | 数组＜string＞ | 必填 | 仅用于读取旧浏览器状态的历史键名列表。 | `["ria_source_link_mode_v1"]`；行 115401，Pointer `/application/sources/groups/0/sources/linkModes/legacyStorageKeys` | 当前契约支持 |
| `items` | 数组＜[$.application.sources.linkModes.items[] [t68]](#t68)＞ | 必填 | 当前模块的项目数组；项目结构由所在类型说明。 | `[{"id":"cdn639","label":{"zh":"CDN加速(639)","en":""},"baseUrl":"https://data.ozk639.top","default":true},{"id":"github_raw","label":{"zh":"Github Raw",…（摘要）`；行 115404，Pointer `/application/sources/groups/0/sources/linkModes/items` | 当前契约支持 |

<a id="t68"></a>

## t68 · $.application.sources.linkModes.items[]

首次类型入口：`$.application.sources.linkModes.items[]`。本包实例：`/application/sources/groups/0/sources/linkModes/items/0`，完整 JSON 第 115405–115413 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `id` | string | 必填 | 当前对象的稳定标识；唯一性范围取决于对象类型。 | `"cdn639"`；行 115406，Pointer `/application/sources/groups/0/sources/linkModes/items/0/id` | 当前契约支持 |
| `label` | [ApplicationLabel [t53]](#t53) | 必填 | 名称对象或 Label 样式对象；必须结合所在路径解读。 | `{"zh":"CDN加速(639)","en":""}`；行 115407，Pointer `/application/sources/groups/0/sources/linkModes/items/0/label` | 当前契约支持 |
| `baseUrl` | string | 必填 | 数据访问/链接模式的根地址，或旧式瓦片地址。 | `"https://data.ozk639.top"`；行 115411，Pointer `/application/sources/groups/0/sources/linkModes/items/0/baseUrl` | 当前契约支持 |
| `default` | boolean | 必填 | 是否为该列表默认项；不是字段默认输入值。 | `true`；行 115412，Pointer `/application/sources/groups/0/sources/linkModes/items/0/default` | 当前契约支持 |

<a id="t69"></a>

## t69 · ApplicationWorldGroups

首次类型入口：`$.application.sources`。本包实例：`/application/sources`，完整 JSON 第 115344–115440 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `kind` | `"world-groups"` | 必填 | 分类路径第二级，或条件/控件的分支种类；依所在对象判读。 | `"world-groups"`；行 115345，Pointer `/application/sources/kind` | 当前契约支持 |
| `defaultGroupId` | string | 必填 | 没有显式世界绑定时使用的默认来源组 ID。 | `"default"`；行 115346，Pointer `/application/sources/defaultGroupId` | 当前契约支持 |
| `sharedInterfaceGroupId` | string | 可选 | 审核/玩家等共享接口所属来源组的声明；当前不是多套后端切换器。 | `"default"`；行 115347，Pointer `/application/sources/sharedInterfaceGroupId` | 当前契约支持 |
| `groups` | 数组＜[ApplicationResourceGroup [t70]](#t70)＞ | 必填 | 来源组数组，或渲染条件命名组；由所在结构区分。 | `[{"id":"default","label":{"zh":"默认共享来源","en":""},"enabled":true,"sources":{"storageKey":"openriamap_formal_data_source_v1","defaultSourceId":"formal-c…（摘要）`；行 115348，Pointer `/application/sources/groups` | 当前契约支持 |
| `bindings` | [Record [t73]](#t73) | 必填 | 世界到来源组的映射，或绘制返回字段绑定数组。 | `{}`；行 115439，Pointer `/application/sources/bindings` | 当前契约支持 |

<a id="t70"></a>

## t70 · ApplicationResourceGroup

首次类型入口：`$.application.sources.groups[]`。本包实例：`/application/sources/groups/0`，完整 JSON 第 115349–115437 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `id` | string | 必填 | 当前对象的稳定标识；唯一性范围取决于对象类型。 | `"default"`；行 115350，Pointer `/application/sources/groups/0/id` | 当前契约支持 |
| `label` | [ApplicationLabel [t53]](#t53) | 必填 | 名称对象或 Label 样式对象；必须结合所在路径解读。 | `{"zh":"默认共享来源","en":""}`；行 115351，Pointer `/application/sources/groups/0/label` | 当前契约支持 |
| `enabled` | boolean | 必填 | 启用标记；false 不等于删除定义，具体作用范围取决于所在模块。 | `true`；行 115355，Pointer `/application/sources/groups/0/enabled` | 当前契约支持 |
| `sources` | [ApplicationSourceSettings [t64]](#t64) | 必填 | 数据读取设置；新配置使用 world-groups 来源组形式。 | `{"storageKey":"openriamap_formal_data_source_v1","defaultSourceId":"formal-cos","selectionMode":"user-select","retryOnFailure":true,"items":[{"id":"fo…（摘要）`；行 115356，Pointer `/application/sources/groups/0/sources` | 当前契约支持 |
| `dataPathTemplate` | string | 必填 | 相对数据根地址的世界子路径模板；空字符串表示直接使用根。 | `""`；行 115426，Pointer `/application/sources/groups/0/dataPathTemplate` | 当前契约支持 |
| `mediaPathTemplate` | string | 必填 | 相对媒体根地址的世界子路径模板；空字符串表示直接使用根。 | `""`；行 115427，Pointer `/application/sources/groups/0/mediaPathTemplate` | 当前契约支持 |
| `tiles` | [ApplicationTileProfile [t71]](#t71) | 必填 | 瓦片来源设置；新配置通常位于来源组内。 | `{"baseUrlTemplate":"https://satellite.ria.red/map/_{world}/tiles/world/","filteredAccess":"registered-proxy","proxyId":"ria-satellite","attribution":{…（摘要）`；行 115428，Pointer `/application/sources/groups/0/tiles` | 当前契约支持 |

<a id="t71"></a>

## t71 · ApplicationTileProfile

首次类型入口：`$.application.sources.groups[].tiles`。本包实例：`/application/sources/groups/0/tiles`，完整 JSON 第 115428–115436 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `baseUrlTemplate` | string | 必填 | 瓦片根地址模板，可用 {world} 代入远端世界标签。 | `"https://satellite.ria.red/map/_{world}/tiles/world/"`；行 115429，Pointer `/application/sources/groups/0/tiles/baseUrlTemplate` | 当前契约支持 |
| `filteredAccess` | `"direct"` / `"registered-proxy"` | 必填 | 瓦片使用直连或已注册代理。 | `"registered-proxy"`；行 115430，Pointer `/application/sources/groups/0/tiles/filteredAccess` | 当前契约支持 |
| `proxyId` | string | 可选 | 受控瓦片代理注册键；不能仅写新 ID 就创建服务器代理。 | `"ria-satellite"`；行 115431，Pointer `/application/sources/groups/0/tiles/proxyId` | 当前契约支持 |
| `legacyFilteredTemplate` | string | 可选 | 特殊旧瓦片代理模板的兼容保留值。 | 本包未写入 | 当前契约支持 |
| `prefix` | string | 可选 | 世界 ID 组装前缀或瓦片文件前缀，二者含义不同。 | 本包未写入 | 当前契约支持 |
| `imageFormat` | `"jpg"` / `"png"` / `"webp"` | 可选 | 瓦片图片格式 jpg/png/webp。 | 本包未写入 | 当前契约支持 |
| `extraZoomLevels` | number | 可选 | 瓦片额外缩放级数；不改变逻辑 Zoom 的 0–8 范围。 | 本包未写入 | 当前契约支持 |
| `minNativeZoom` | number | 可选 | 原生瓦片下限，采用映射后的 Leaflet Zoom。 | 本包未写入 | 当前契约支持 |
| `maxNativeZoom` | number | 可选 | 原生瓦片上限，采用映射后的 Leaflet Zoom。 | 本包未写入 | 当前契约支持 |
| `attribution` | [ApplicationAttribution [t72]](#t72) | 必填 | 瓦片署名对象；旧格式也可能是 HTML 文本。 | `{"name":"RIA Satellite","url":"https://satellite.ria.red"}`；行 115432，Pointer `/application/sources/groups/0/tiles/attribution` | 当前契约支持 |
| `maxRetries` | number | 可选 | 资源请求失败后的最大重试次数。 | 本包未写入 | 当前契约支持 |
| `retryDelay` | number | 可选 | 重试间隔，单位毫秒。 | 本包未写入 | 当前契约支持 |

<a id="t72"></a>

## t72 · ApplicationAttribution

首次类型入口：`$.application.sources.groups[].tiles.attribution`。本包实例：`/application/sources/groups/0/tiles/attribution`，完整 JSON 第 115432–115435 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `name` | string | 必填 | 候选名称、署名名称等人类可读文本；不是稳定 ID。 | `"RIA Satellite"`；行 115433，Pointer `/application/sources/groups/0/tiles/attribution/name` | 当前契约支持 |
| `url` | string | 可选 | 外部链接地址。 | `"https://satellite.ria.red"`；行 115434，Pointer `/application/sources/groups/0/tiles/attribution/url` | 当前契约支持 |
| `legacyText` | string | 可选 | 旧署名文本的兼容保留值。 | 本包未写入 | 当前契约支持 |

<a id="t73"></a>

## t73 · Record

首次类型入口：`$.application.sources.bindings`。本包实例：`/application/sources/bindings`，完整 JSON 第 115439–115439 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| 【自定义键】 | string | 按使用方约定 | 此对象是字典，键名可变；不代表任意位置均接受新属性。 | 见该对象实际内容 | 当前契约支持 |

<a id="t74"></a>

## t74 · ApplicationModules

首次类型入口：`$.application.modules`。本包实例：`/application/modules`，完整 JSON 第 115441–115508 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `items` | 数组＜[$.application.modules.items[] [t75]](#t75)＞ | 必填 | 当前模块的项目数组；项目结构由所在类型说明。 | `[{"id":"mapping","enabled":true,"load":"lazy","exclusiveWith":["measurement","review"]},{"id":"measurement","enabled":true,"load":"lazy","exclusiveWit…（摘要）`；行 115442，Pointer `/application/modules/items` | 当前契约支持 |
| `players` | [$.application.modules.players [t76]](#t76) | 必填 | 玩家位置接口与轮询设置。 | `{"endpoint":"/api/dynmap/_{world}/up/world/world/{timestamp}","directEndpoint":"https://satellite.ria.red/map/_{world}/up/world/world/{timestamp}","mo…（摘要）`；行 115501，Pointer `/application/modules/players` | 当前契约支持 |

<a id="t75"></a>

## t75 · $.application.modules.items[]

首次类型入口：`$.application.modules.items[]`。本包实例：`/application/modules/items/0`，完整 JSON 第 115443–115451 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `id` | `"mapping"` / `"measurement"` / `"navigation"` / `"search"` / `"review"` / `"players"` / `"settings"` / `"publicReleases"` | 必填 | 当前对象的稳定标识；唯一性范围取决于对象类型。 | `"mapping"`；行 115444，Pointer `/application/modules/items/0/id` | 当前契约支持 |
| `enabled` | boolean | 必填 | 启用标记；false 不等于删除定义，具体作用范围取决于所在模块。 | `true`；行 115445，Pointer `/application/modules/items/0/enabled` | 当前契约支持 |
| `load` | `"eager"` / `"lazy"` / `"preload"` | 必填 | 模块 eager/lazy/preload 加载方式。 | `"lazy"`；行 115446，Pointer `/application/modules/items/0/load` | 当前契约支持 |
| `exclusiveWith` | 数组＜`"mapping"` / `"measurement"` / `"navigation"` / `"search"` / `"review"` / `"players"` / `"settings"` / `"publicReleases"`＞ | 必填 | 与当前按钮/模块互斥的稳定 ID 列表。 | `["measurement","review"]`；行 115447，Pointer `/application/modules/items/0/exclusiveWith` | 当前契约支持 |

<a id="t76"></a>

## t76 · $.application.modules.players

首次类型入口：`$.application.modules.players`。本包实例：`/application/modules/players`，完整 JSON 第 115501–115507 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `endpoint` | string | 必填 | 玩家位置的代理请求地址模板。 | `"/api/dynmap/_{world}/up/world/world/{timestamp}"`；行 115502，Pointer `/application/modules/players/endpoint` | 当前契约支持 |
| `directEndpoint` | string | 必填 | 玩家位置的直连请求地址模板。 | `"https://satellite.ria.red/map/_{world}/up/world/world/{timestamp}"`；行 115503，Pointer `/application/modules/players/directEndpoint` | 当前契约支持 |
| `mode` | `"direct"` / `"proxy"` | 必填 | 当前联合结构的分支选择器；先看 mode，再解释其余字段。 | `"proxy"`；行 115504，Pointer `/application/modules/players/mode` | 当前契约支持 |
| `pollIntervalMs` | number | 必填 | 轮询间隔，单位毫秒。 | `5000`；行 115505，Pointer `/application/modules/players/pollIntervalMs` | 当前契约支持 |
| `requestTimeoutMs` | number | 必填 | 单次请求超时，单位毫秒。 | `10000`；行 115506，Pointer `/application/modules/players/requestTimeoutMs` | 当前契约支持 |

<a id="t77"></a>

## t77 · ApplicationReview

首次类型入口：`$.application.review`。本包实例：`/application/review`，完整 JSON 第 115509–115528 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `enabled` | boolean | 必填 | 启用标记；false 不等于删除定义，具体作用范围取决于所在模块。 | `true`；行 115510，Pointer `/application/review/enabled` | 当前契约支持 |
| `provider` | `"github-cookie"` | 必填 | 审核身份提供方式；当前受控 github-cookie。 | `"github-cookie"`；行 115511，Pointer `/application/review/provider` | 当前契约支持 |
| `protocol` | `"openriamap-review-v1"` | 必填 | 审核传输协议标记。 | `"openriamap-review-v1"`；行 115512，Pointer `/application/review/protocol` | 当前契约支持 |
| `auth` | [$.application.review.auth [t78]](#t78) | 必填 | 审核登录、会话查询与退出接口。 | `{"start":"/api/auth/github/start","session":"/api/auth/github/session","logout":"/api/auth/github/logout"}`；行 115513，Pointer `/application/review/auth` | 当前契约支持 |
| `control` | string | 必填 | 审核控制接口路径，或单个控件定义；结合路径区分。 | `"/api/review-control"`；行 115518，Pointer `/application/review/control` | 当前契约支持 |
| `workflow` | string | 必填 | 审核工作流接口路径，或旧继承策略标记。 | `"/api/review-workflow"`；行 115519，Pointer `/application/review/workflow` | 当前契约支持 |
| `publicReleases` | string | 必填 | 公开审核发布信息接口路径。 | `"/api/public-review-releases"`；行 115520，Pointer `/application/review/publicReleases` | 当前契约支持 |
| `serverReferences` | [$.application.review.serverReferences [t79]](#t79) | 必填 | 服务器环境变量名称引用；不是对应密钥的实际值。 | `{"oauthClientId":"CAIRN_GITHUB_OAUTH_CLIENT_ID","oauthRedirectUri":"CAIRN_GITHUB_OAUTH_REDIRECT_URI","sessionSigning":"CAIRN_SESSION_SIGNING_SECRET","…（摘要）`；行 115521，Pointer `/application/review/serverReferences` | 当前契约支持 |

<a id="t78"></a>

## t78 · $.application.review.auth

首次类型入口：`$.application.review.auth`。本包实例：`/application/review/auth`，完整 JSON 第 115513–115517 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `start` | string | 必填 | 启动身份登录的接口路径。 | `"/api/auth/github/start"`；行 115514，Pointer `/application/review/auth/start` | 当前契约支持 |
| `session` | string | 必填 | 查询当前会话的接口路径。 | `"/api/auth/github/session"`；行 115515，Pointer `/application/review/auth/session` | 当前契约支持 |
| `logout` | string | 必填 | 退出身份会话的接口路径。 | `"/api/auth/github/logout"`；行 115516，Pointer `/application/review/auth/logout` | 当前契约支持 |

<a id="t79"></a>

## t79 · $.application.review.serverReferences

首次类型入口：`$.application.review.serverReferences`。本包实例：`/application/review/serverReferences`，完整 JSON 第 115521–115527 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `oauthClientId` | string | 必填 | OAuth 客户端 ID 所用的服务器环境变量名。 | `"CAIRN_GITHUB_OAUTH_CLIENT_ID"`；行 115522，Pointer `/application/review/serverReferences/oauthClientId` | 当前契约支持 |
| `oauthRedirectUri` | string | 必填 | OAuth 回跳地址所用的服务器环境变量名。 | `"CAIRN_GITHUB_OAUTH_REDIRECT_URI"`；行 115523，Pointer `/application/review/serverReferences/oauthRedirectUri` | 当前契约支持 |
| `sessionSigning` | string | 必填 | 会话签名密钥所用的服务器环境变量名。 | `"CAIRN_SESSION_SIGNING_SECRET"`；行 115524，Pointer `/application/review/serverReferences/sessionSigning` | 当前契约支持 |
| `controlApiBase` | string | 必填 | 控制 API 根地址所用的服务器环境变量名。 | `"CAIRN_CONTROL_API_BASE"`；行 115525，Pointer `/application/review/serverReferences/controlApiBase` | 当前契约支持 |
| `brokerSecret` | string | 必填 | 代理调度共享密钥所用的服务器环境变量名。 | `"CAIRN_BROKER_TO_DISPATCHER_SECRET"`；行 115526，Pointer `/application/review/serverReferences/brokerSecret` | 当前契约支持 |

<a id="t80"></a>

## t80 · ApplicationPreferences

首次类型入口：`$.application.preferences`。本包实例：`/application/preferences`，完整 JSON 第 115529–115553 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `language` | `"zh"` / `"en"` | 必填 | 默认界面语言。 | `"zh"`；行 115530，Pointer `/application/preferences/language` | 当前契约支持 |
| `search` | [$.application.preferences.search [t81]](#t81) | 必填 | 分类搜索规则、工作流搜索控件参数或应用搜索偏好。 | `{"homepageLimit":35,"navigationLimit":30,"debounceMs":0}`；行 115531，Pointer `/application/preferences/search` | 当前契约支持 |
| `navigation` | [$.application.preferences.navigation [t82]](#t82) | 必填 | 路径规划全局参数。 | `{"transferWalkSpeed":3,"railRideSpeed":16,"transferCostFactor":1,"normalPlatformTransferCost":5}`；行 115536，Pointer `/application/preferences/navigation` | 当前契约支持 |
| `map` | [$.application.preferences.map [t83]](#t83) | 必填 | 地图交互与逻辑 Zoom 映射设置。 | `{"logicalInitialZoom":5,"leafletOffset":-3,"scrollWheelZoom":true,"doubleClickZoom":true,"dragging":true}`；行 115542，Pointer `/application/preferences/map` | 当前契约支持 |
| `toolbar` | [$.application.preferences.toolbar [t84]](#t84) | 必填 | 工具栏布局偏好。 | `{"position":"right","compact":false}`；行 115549，Pointer `/application/preferences/toolbar` | 当前契约支持 |

<a id="t81"></a>

## t81 · $.application.preferences.search

首次类型入口：`$.application.preferences.search`。本包实例：`/application/preferences/search`，完整 JSON 第 115531–115535 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `homepageLimit` | number | 必填 | 主页搜索结果数量上限。 | `35`；行 115532，Pointer `/application/preferences/search/homepageLimit` | 当前契约支持 |
| `navigationLimit` | number | 必填 | 导航搜索结果数量上限。 | `30`；行 115533，Pointer `/application/preferences/search/navigationLimit` | 当前契约支持 |
| `debounceMs` | number | 必填 | 搜索输入防抖延迟，单位毫秒。 | `0`；行 115534，Pointer `/application/preferences/search/debounceMs` | 当前契约支持 |

<a id="t82"></a>

## t82 · $.application.preferences.navigation

首次类型入口：`$.application.preferences.navigation`。本包实例：`/application/preferences/navigation`，完整 JSON 第 115536–115541 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `transferWalkSpeed` | number | 必填 | 换乘步行速度的默认数值。 | `3`；行 115537，Pointer `/application/preferences/navigation/transferWalkSpeed` | 当前契约支持 |
| `railRideSpeed` | number | 必填 | 铁路乘坐速度的默认数值。 | `16`；行 115538，Pointer `/application/preferences/navigation/railRideSpeed` | 当前契约支持 |
| `transferCostFactor` | number | 必填 | 换乘成本的全局倍率。 | `1`；行 115539，Pointer `/application/preferences/navigation/transferCostFactor` | 当前契约支持 |
| `normalPlatformTransferCost` | number | 必填 | 普通站台换乘的基础成本。 | `5`；行 115540，Pointer `/application/preferences/navigation/normalPlatformTransferCost` | 当前契约支持 |

<a id="t83"></a>

## t83 · $.application.preferences.map

首次类型入口：`$.application.preferences.map`。本包实例：`/application/preferences/map`，完整 JSON 第 115542–115548 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `logicalInitialZoom` | number | 必填 | 初次进入地图的逻辑 Zoom，范围 0–8。 | `5`；行 115543，Pointer `/application/preferences/map/logicalInitialZoom` | 当前契约支持 |
| `leafletOffset` | number | 必填 | 逻辑 Zoom 到 Leaflet Zoom 的偏移；Leaflet = 逻辑 + 偏移。 | `-3`；行 115544，Pointer `/application/preferences/map/leafletOffset` | 当前契约支持 |
| `scrollWheelZoom` | boolean | 必填 | 是否启用滚轮缩放。 | `true`；行 115545，Pointer `/application/preferences/map/scrollWheelZoom` | 当前契约支持 |
| `doubleClickZoom` | boolean | 必填 | 是否启用地图双击缩放。 | `true`；行 115546，Pointer `/application/preferences/map/doubleClickZoom` | 当前契约支持 |
| `dragging` | boolean | 必填 | 是否启用地图拖动。 | `true`；行 115547，Pointer `/application/preferences/map/dragging` | 当前契约支持 |

<a id="t84"></a>

## t84 · $.application.preferences.toolbar

首次类型入口：`$.application.preferences.toolbar`。本包实例：`/application/preferences/toolbar`，完整 JSON 第 115549–115552 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `position` | `"left"` / `"right"` | 必填 | 工具栏显示在左侧或右侧。 | `"right"`；行 115550，Pointer `/application/preferences/toolbar/position` | 当前契约支持 |
| `compact` | boolean | 必填 | 是否使用紧凑工具栏外观。 | `false`；行 115551，Pointer `/application/preferences/toolbar/compact` | 当前契约支持 |

<a id="t85"></a>

## t85 · CategoryNode

首次类型入口：`$.nodes[]`。本包实例：`/nodes/0`，完整 JSON 第 946–2254 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `nodeId` | string | 必填 | 分类节点稳定 ID；children 与字段引用通过它定位。 | `"class-bud"`；行 947，Pointer `/nodes/0/nodeId` | 当前契约支持 |
| `path` | [ClassificationPath [t16]](#t16) | 必填 | 完整且连续的分类路径；决定节点实际所在层级。 | `{"class":"BUD"}`；行 948，Pointer `/nodes/0/path` | 当前契约支持 |
| `classificationLabels` | [Partial [t86]](#t86) | 可选 | 各已填写分类层级的中英文名称。 | `{"class":{"zh":"建筑","en":"Building"}}`；行 951，Pointer `/nodes/0/classificationLabels` | 当前契约支持 |
| `children` | 数组＜string＞ | 必填 | 直接子节点 nodeId 列表；必须与实际 path 父子关系一致。 | `["class-bud-nom","class-bud-spe"]`；行 957，Pointer `/nodes/0/children` | 当前契约支持 |
| `inheritDown` | [InheritanceControls [t87]](#t87) | 可选 | 向后代传递字段、显示和信息卡设置的三个开关。 | `{"fields":true,"display":true,"card":true}`；行 961，Pointer `/nodes/0/inheritDown` | 当前契约支持 |
| `receiveFromParent` | [$.nodes[].receiveFromParent [t88]](#t88) | 可选 | 当前节点是否接收父级模块；不能用它屏蔽硬继承字段。 | 本包未写入 | 当前契约支持 |
| `policies` | [$.nodes[].policies [t89]](#t89) | 可选 | 旧版继承策略；当前解析优先使用 inheritDown。 | `{"fields":"overridable","display":"overridable","card":"overridable","workflow":"overridable"}`；行 966，Pointer `/nodes/0/policies` | 兼容/迁移保留 |
| `fields` | 数组＜[FieldDefinition [t90]](#t90)＞ | 必填 | 字段定义数组、字段条件组或继承字段开关；先看当前类型。 | `[{"fieldId":"BUD-Name","key":"Name","type":"string","cardinality":"single","input":"text","required":true,"validateExistingData":false,"labels":{"zh":…（摘要）`；行 972，Pointer `/nodes/0/fields` | 当前契约支持 |
| `fieldSettings` | [NodeFieldSettings [t100]](#t100) | 可选 | 随字段设计传递的主附属身份与搜索规则。 | `{"search":{"enabled":true,"queryFields":["Name","ID","Class"],"priority":1,"subtitle":{"mode":"classification"},"extension":{"mode":"none"}},"structur…（摘要）`；行 2233，Pointer `/nodes/0/fieldSettings` | 当前契约支持 |
| `geometryType` | `"Point"` / `"LineString"` / `"Polygon"` | 可选 | 当前分类选定的唯一几何类型。 | `"Polygon"`；行 1172，Pointer `/nodes/0/geometryType` | 当前契约支持 |
| `geometryProfiles` | [Partial [t107]](#t107) | 必填 | 按 Point/LineString/Polygon 索引的几何能力与显示规则。 | `{"Polygon":{"enabled":true,"allowMultipleParts":true,"anchor":"featureBbox","interaction":{"triggers":{"label":true,"point":false,"line":false,"bounda…（摘要）`；行 1173，Pointer `/nodes/0/geometryProfiles` | 当前契约支持 |
| `containment` | [ContainmentBinding [t139]](#t139) | 可选 | 旧版分类内包含关系；现代配置使用 fieldSettings.structure。 | 本包未写入 | 兼容/迁移保留 |
| `card` | [$.nodes[].card [t140]](#t140) / [$.nodes[].card [t147]](#t147) / [$.nodes[].card [t148]](#t148) | 可选 | 信息卡定义、继承开关或旧继承模式。 | `{"mode":"fields","items":[{"id":"BUD-classification-card","source":"Class","visible":true,"renderer":"text","section":"main","label":{"zh":"类型","en":"…（摘要）`；行 1581，Pointer `/nodes/0/card` | 当前契约支持 |
| `legacy` | [$.nodes[].legacy [t149]](#t149) | 可选 | 迁移来源及兼容元数据，不应作为新功能的主要入口。 | `{"classCode":"BUD","displayRuleIds":["BUD-building-structure"],"cardLayoutId":"building-card","source":{"schemaVersion":"cairnmap.class.v1","projectId…（摘要）`；行 1892，Pointer `/nodes/0/legacy` | 兼容/迁移保留 |

<a id="t86"></a>

## t86 · Partial

首次类型入口：`$.nodes[].classificationLabels`。本包实例：`/nodes/0/classificationLabels`，完整 JSON 第 951–956 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `class` | [LocalizedText [t1]](#t1) | 可选 | 分类路径第一级 Class；此处键名小写，实际要素记录使用 Class。 | `{"zh":"建筑","en":"Building"}`；行 952，Pointer `/nodes/0/classificationLabels/class` | 当前契约支持 |
| `kind` | [LocalizedText [t1]](#t1) | 可选 | 分类路径第二级，或条件/控件的分支种类；依所在对象判读。 | `{"zh":"NOM","en":""}`；行 2266，Pointer `/nodes/1/classificationLabels/kind` | 当前契约支持 |
| `skind` | [LocalizedText [t1]](#t1) | 可选 | 分类路径第三级；实际新要素记录使用 SKind。 | `{"zh":"默认","en":""}`；行 4387，Pointer `/nodes/3/classificationLabels/skind` | 当前契约支持 |
| `skind2` | [LocalizedText [t1]](#t1) | 可选 | 分类路径第四级；实际新要素记录使用 SKind2。 | `{"zh":"大陆","en":""}`；行 20173，Pointer `/nodes/18/classificationLabels/skind2` | 当前契约支持 |

<a id="t87"></a>

## t87 · InheritanceControls

首次类型入口：`$.nodes[].inheritDown`。本包实例：`/nodes/0/inheritDown`，完整 JSON 第 961–965 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `fields` | boolean | 必填 | 字段定义数组、字段条件组或继承字段开关；先看当前类型。 | `true`；行 962，Pointer `/nodes/0/inheritDown/fields` | 当前契约支持 |
| `display` | boolean | 必填 | 向下传递显示配置的开关或旧继承模式。 | `true`；行 963，Pointer `/nodes/0/inheritDown/display` | 当前契约支持 |
| `card` | boolean | 必填 | 信息卡定义、继承开关或旧继承模式。 | `true`；行 964，Pointer `/nodes/0/inheritDown/card` | 当前契约支持 |

<a id="t88"></a>

## t88 · $.nodes[].receiveFromParent

首次类型入口：`$.nodes[].receiveFromParent`。本包没有此结构的实际实例；可能是可选功能或兼容分支。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `fields` | boolean：true / false | 可选 | 字段定义数组、字段条件组或继承字段开关；先看当前类型。 | 本包未写入 | 当前契约支持 |
| `geometry` | boolean：true / false | 可选 | 当前绘制的几何类型、几何输入继承选项或输出几何设置。 | 本包未写入 | 当前契约支持 |
| `display` | boolean：true / false | 可选 | 向下传递显示配置的开关或旧继承模式。 | 本包未写入 | 当前契约支持 |
| `card` | boolean：true / false | 可选 | 信息卡定义、继承开关或旧继承模式。 | 本包未写入 | 当前契约支持 |

<a id="t89"></a>

## t89 · $.nodes[].policies

首次类型入口：`$.nodes[].policies`。本包实例：`/nodes/0/policies`，完整 JSON 第 966–971 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `fields` | `"sealed"` / `"overridable"` / `"localOnly"` | 必填 | 字段定义数组、字段条件组或继承字段开关；先看当前类型。 | `"overridable"`；行 967，Pointer `/nodes/0/policies/fields` | 当前契约支持 |
| `display` | `"sealed"` / `"overridable"` / `"localOnly"` | 必填 | 向下传递显示配置的开关或旧继承模式。 | `"overridable"`；行 968，Pointer `/nodes/0/policies/display` | 当前契约支持 |
| `card` | `"sealed"` / `"overridable"` / `"localOnly"` | 必填 | 信息卡定义、继承开关或旧继承模式。 | `"overridable"`；行 969，Pointer `/nodes/0/policies/card` | 当前契约支持 |
| `workflow` | `"sealed"` / `"overridable"` / `"localOnly"` | 可选 | 审核工作流接口路径，或旧继承策略标记。 | `"overridable"`；行 970，Pointer `/nodes/0/policies/workflow` | 当前契约支持 |

<a id="t90"></a>

## t90 · FieldDefinition

首次类型入口：`$.nodes[].fields[]`。本包实例：`/nodes/0/fields/0`，完整 JSON 第 973–996 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `fieldId` | string | 必填 | 字段稳定身份；同一有效分类内不同 key 不得共用它。 | `"BUD-Name"`；行 974，Pointer `/nodes/0/fields/0/fieldId` | 当前契约支持 |
| `key` | string | 必填 | 真实数据字段路径或重复组成员键；不等于 fieldId。 | `"Name"`；行 975，Pointer `/nodes/0/fields/0/key` | 当前契约支持 |
| `scope` | `"root"` / `"tags"` / `"extensions"` | 可选 | 字段根/标签/扩展分组，或编辑工作流适用范围等。 | `"tags"`；行 1072，Pointer `/nodes/0/fields/4/scope` | 当前契约支持 |
| `type` | `"string"` / `"number"` / `"boolean"` / `"enum"` / `"json"` / `"reference"` | 必填 | 数据类型，或受控组件选项的输入类型。 | `"string"`；行 976，Pointer `/nodes/0/fields/0/type` | 当前契约支持 |
| `cardinality` | `"single"` / `"multiple"` | 必填 | 字段值数量：single 单值，multiple 数组多值。 | `"single"`；行 977，Pointer `/nodes/0/fields/0/cardinality` | 当前契约支持 |
| `input` | `"text"` / `"select"` / `"json"` / `"textarea"` / `"toggle"` / `"featureSearch"` | 必填 | 字段定义建议的输入方式；实际工作流控件仍有自身配置。 | `"text"`；行 978，Pointer `/nodes/0/fields/0/input` | 当前契约支持 |
| `required` | boolean：true / false | 可选 | 是否必填；系统 World 设置中固定为 true，其他位置按控件或字段解释。 | `true`；行 979，Pointer `/nodes/0/fields/0/required` | 当前契约支持 |
| `validateExistingData` | boolean：true / false | 可选 | 是否将该字段约束用于已挂载的历史记录。 | `false`；行 980，Pointer `/nodes/0/fields/0/validateExistingData` | 当前契约支持 |
| `requiredWhen` | 数组＜[$.nodes[].fields[].requiredWhen[] [t91]](#t91) / [$.nodes[].fields[].requiredWhen[] [t92]](#t92) / [$.nodes[].fields[].requiredWhen[] [t93]](#t93) / [$.nodes[].fields[].requiredWhen[] [t94]](#t94) / [$.nodes[].fields[].requiredWhen[] [t95]](#t95) / [$.nodes[].fields[].requiredWhen[] [t96]](#t96)＞ | 可选 | 条件必填规则；字段和工作流使用不同的条件结构。 | `[{"kind":"fieldPresent","field":"TGTWarp","present":false}]`；行 94467，Pointer `/nodes/80/fields/7/requiredWhen` | 当前契约支持 |
| `labels` | [LocalizedText [t1]](#t1) | 必填 | 字段或分类的人类可读中英文标题。 | `{"zh":"建筑名","en":""}`；行 981，Pointer `/nodes/0/fields/0/labels` | 当前契约支持 |
| `description` | [LocalizedText [t1]](#t1) | 必填 | 字段中英文说明。 | `{"zh":"","en":""}`；行 985，Pointer `/nodes/0/fields/0/description` | 当前契约支持 |
| `options` | 数组＜[SelectOption [t42]](#t42)＞ | 可选 | 控件本地选项数组、组件设置对象等；不能跨对象套用。 | 本包未写入 | 当前契约支持 |
| `optionsTableId` | string | 可选 | 实时引用公共表 lookupTables[].id，不保存独立可编辑副本。 | 本包未写入 | 当前契约支持 |
| `optionTable` | [OptionTable [t48]](#t48) | 可选 | 当前模块本地对照表；含 valueType 和 rows。 | `{"valueType":"number","rows":[{"value":"0","label":{"zh":"下行","en":""}},{"value":"1","label":{"zh":"上行","en":""}},{"value":"2","label":{"zh":"其他","en"…（摘要）`；行 70584，Pointer `/nodes/65/fields/4/optionTable` | 当前契约支持 |
| `optionValueType` | `"string"` / `"number"` / `"boolean"` | 可选 | 选项保存为文本、数字或布尔值；value 文本会按此解释。 | `"number"`；行 70583，Pointer `/nodes/65/fields/4/optionValueType` | 当前契约支持 |
| `format` | `"boolean"` / `"plain"` / `"externalLink"` / `"date"` / `"json"` | 可选 | 字段/显示格式；只允许当前类型枚举中的受控格式。 | 本包未写入 | 当前契约支持 |
| `coordinateFormat` | `"coordP"` / `"pointObject"` / `"coordL"` / `"coordG"` | 可选 | JSON 字段声明的坐标结构，供绘制绑定及类型核验。 | `"pointObject"`；行 94625，Pointer `/nodes/80/fields/15/coordinateFormat` | 当前契约支持 |
| `optionSource` | [$.nodes[].fields[].optionSource [t97]](#t97) | 可选 | 旧 optionSets 的来源引用，原生 r8+ 不作为新公共表入口。 | 本包未写入 | 兼容/迁移保留 |
| `placeholder` | string | 可选 | 输入提示文字；不等于默认值，也不写入记录。 | 本包未写入 | 当前契约支持 |
| `defaultValue` | 任意 JSON（仍受模块语义约束） | 可选 | 初始输入值；类型须与字段或控件格式相容。 | 本包未写入 | 当前契约支持 |
| `emptyValue` | `"omit"` / `"preserve"` | 可选 | 字段空值保留或省略的声明。 | `"preserve"`；行 94326，Pointer `/nodes/80/fields/1/emptyValue` | 当前契约支持 |
| `sourceRuntimeField` | string | 可选 | 旧运行时字段映射提示。 | `"Name"`；行 989，Pointer `/nodes/0/fields/0/sourceRuntimeField` | 兼容/迁移保留 |
| `scenes` | [$.nodes[].fields[].scenes [t98]](#t98) | 可选 | 该字段的工作流、编辑、信息卡和搜索使用场景声明。 | `{"workflow":true,"editor":true,"infocard":true,"search":true}`；行 990，Pointer `/nodes/0/fields/0/scenes` | 当前契约支持 |
| `reference` | [$.nodes[].fields[].reference [t99]](#t99) | 可选 | 字段的关联记录查找声明。 | 本包未写入 | 当前契约支持 |
| `overrideOf` | string | 可选 | 明确替代继承字段时所对应的原字段 key。 | 本包未写入 | 当前契约支持 |
| `inheritance` | `"sealed"` / `"overridable"` / `"localOnly"` | 可选 | 字段 localOnly/overridable/sealed 模式，或搜索规则继承模式。 | 本包未写入 | 当前契约支持 |

<a id="t91"></a>

## t91 · $.nodes[].fields[].requiredWhen[]

首次类型入口：`$.nodes[].fields[].requiredWhen[]`。本包没有此结构的实际实例；可能是可选功能或兼容分支。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `kind` | `"always"` | 必填 | 分类路径第二级，或条件/控件的分支种类；依所在对象判读。 | 本包未写入 | 当前契约支持 |

<a id="t92"></a>

## t92 · $.nodes[].fields[].requiredWhen[]

首次类型入口：`$.nodes[].fields[].requiredWhen[]`。本包没有此结构的实际实例；可能是可选功能或兼容分支。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `kind` | `"zoomRange"` | 必填 | 分类路径第二级，或条件/控件的分支种类；依所在对象判读。 | 本包未写入 | 当前契约支持 |
| `min` | number | 可选 | 当前数值区间下限；单位取决于所在规则/指标。 | 本包未写入 | 当前契约支持 |
| `max` | number | 可选 | 当前数值区间上限；单位取决于所在规则/指标。 | 本包未写入 | 当前契约支持 |

<a id="t93"></a>

## t93 · $.nodes[].fields[].requiredWhen[]

首次类型入口：`$.nodes[].fields[].requiredWhen[]`。本包没有此结构的实际实例；可能是可选功能或兼容分支。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `kind` | `"bboxArea"` | 必填 | 分类路径第二级，或条件/控件的分支种类；依所在对象判读。 | 本包未写入 | 当前契约支持 |
| `min` | number | 可选 | 当前数值区间下限；单位取决于所在规则/指标。 | 本包未写入 | 当前契约支持 |
| `max` | number | 可选 | 当前数值区间上限；单位取决于所在规则/指标。 | 本包未写入 | 当前契约支持 |
| `scope` | `"part"` / `"feature"` | 必填 | 字段根/标签/扩展分组，或编辑工作流适用范围等。 | 本包未写入 | 当前契约支持 |

<a id="t94"></a>

## t94 · $.nodes[].fields[].requiredWhen[]

首次类型入口：`$.nodes[].fields[].requiredWhen[]`。本包实例：`/nodes/64/geometryProfiles/Point/zoomPriority/rules/2/when/fields/formula/terms/0/condition`，完整 JSON 第 69741–69745 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `kind` | `"fieldEquals"` | 必填 | 分类路径第二级，或条件/控件的分支种类；依所在对象判读。 | `"fieldEquals"`；行 69742，Pointer `/nodes/64/geometryProfiles/Point/zoomPriority/rules/2/when/fields/formula/terms/0/condition/kind` | 当前契约支持 |
| `field` | string | 必填 | 所引用的数据字段路径；不同位置的可用字段集由对应分类限定。 | `"Connect"`；行 69743，Pointer `/nodes/64/geometryProfiles/Point/zoomPriority/rules/2/when/fields/formula/terms/0/condition/field` | 当前契约支持 |
| `value` | string | 必填 | 最终存储值、条件比较值或常量；是否字符串须看当前类型声明。 | `"false"`；行 69744，Pointer `/nodes/64/geometryProfiles/Point/zoomPriority/rules/2/when/fields/formula/terms/0/condition/value` | 当前契约支持 |

<a id="t95"></a>

## t95 · $.nodes[].fields[].requiredWhen[]

首次类型入口：`$.nodes[].fields[].requiredWhen[]`。本包实例：`/nodes/65/geometryProfiles/LineString/zoomPriority/rules/6/when/fields/formula/terms/0/condition`，完整 JSON 第 72119–72126 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `kind` | `"fieldIn"` | 必填 | 分类路径第二级，或条件/控件的分支种类；依所在对象判读。 | `"fieldIn"`；行 72120，Pointer `/nodes/65/geometryProfiles/LineString/zoomPriority/rules/6/when/fields/formula/terms/0/condition/kind` | 当前契约支持 |
| `field` | string | 必填 | 所引用的数据字段路径；不同位置的可用字段集由对应分类限定。 | `"direction"`；行 72121，Pointer `/nodes/65/geometryProfiles/LineString/zoomPriority/rules/6/when/fields/formula/terms/0/condition/field` | 当前契约支持 |
| `values` | 数组＜string＞ | 必填 | 条件允许的比较值集合；严格比较时类型也须匹配。 | `["0","1"]`；行 72122，Pointer `/nodes/65/geometryProfiles/LineString/zoomPriority/rules/6/when/fields/formula/terms/0/condition/values` | 当前契约支持 |

<a id="t96"></a>

## t96 · $.nodes[].fields[].requiredWhen[]

首次类型入口：`$.nodes[].fields[].requiredWhen[]`。本包实例：`/nodes/80/fields/7/requiredWhen/0`，完整 JSON 第 94468–94472 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `kind` | `"fieldPresent"` | 必填 | 分类路径第二级，或条件/控件的分支种类；依所在对象判读。 | `"fieldPresent"`；行 94469，Pointer `/nodes/80/fields/7/requiredWhen/0/kind` | 当前契约支持 |
| `field` | string | 必填 | 所引用的数据字段路径；不同位置的可用字段集由对应分类限定。 | `"TGTWarp"`；行 94470，Pointer `/nodes/80/fields/7/requiredWhen/0/field` | 当前契约支持 |
| `present` | boolean | 必填 | 是否要求该字段具有有效值；0/false 不是空值。 | `false`；行 94471，Pointer `/nodes/80/fields/7/requiredWhen/0/present` | 当前契约支持 |

<a id="t97"></a>

## t97 · $.nodes[].fields[].optionSource

首次类型入口：`$.nodes[].fields[].optionSource`。本包没有此结构的实际实例；可能是可选功能或兼容分支。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `registryKey` | string | 必填 | 旧登记表中的稳定选项 ID。 | 本包未写入 | 当前契约支持 |
| `runtimeField` | string | 可选 | 旧运行时字段提示。 | 本包未写入 | 当前契约支持 |

<a id="t98"></a>

## t98 · $.nodes[].fields[].scenes

首次类型入口：`$.nodes[].fields[].scenes`。本包实例：`/nodes/0/fields/0/scenes`，完整 JSON 第 990–995 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `workflow` | boolean：true / false | 可选 | 审核工作流接口路径，或旧继承策略标记。 | `true`；行 991，Pointer `/nodes/0/fields/0/scenes/workflow` | 当前契约支持 |
| `editor` | boolean：true / false | 可选 | 工作流式编辑方案设置，或字段是否可在编辑场景使用。 | `true`；行 992，Pointer `/nodes/0/fields/0/scenes/editor` | 当前契约支持 |
| `infocard` | boolean：true / false | 可选 | 字段是否面向信息卡场景。 | `true`；行 993，Pointer `/nodes/0/fields/0/scenes/infocard` | 当前契约支持 |
| `search` | boolean：true / false | 可选 | 分类搜索规则、工作流搜索控件参数或应用搜索偏好。 | `true`；行 994，Pointer `/nodes/0/fields/0/scenes/search` | 当前契约支持 |

<a id="t99"></a>

## t99 · $.nodes[].fields[].reference

首次类型入口：`$.nodes[].fields[].reference`。本包没有此结构的实际实例；可能是可选功能或兼容分支。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `classCode` | string | 必填 | 旧式 Class 过滤列表或字段引用的 Class 目标；先看所属结构。 | 本包未写入 | 当前契约支持 |
| `matchField` | string | 必填 | 外部记录用于匹配的字段。 | 本包未写入 | 当前契约支持 |
| `displayField` | string | 可选 | 关联目标用于展示的字段。 | 本包未写入 | 当前契约支持 |

<a id="t100"></a>

## t100 · NodeFieldSettings

首次类型入口：`$.nodes[].fieldSettings`。本包实例：`/nodes/0/fieldSettings`，完整 JSON 第 2233–2253 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `structure` | [StructureRole [t101]](#t101) | 可选 | 通用主结构/附属结构身份，不限定对方 Class。 | `{"enabled":true,"role":"main"}`；行 2249，Pointer `/nodes/0/fieldSettings/structure` | 当前契约支持 |
| `search` | [CategorySearch [t102]](#t102) | 可选 | 分类搜索规则、工作流搜索控件参数或应用搜索偏好。 | `{"enabled":true,"queryFields":["Name","ID","Class"],"priority":1,"subtitle":{"mode":"classification"},"extension":{"mode":"none"}}`；行 2234，Pointer `/nodes/0/fieldSettings/search` | 当前契约支持 |

<a id="t101"></a>

## t101 · StructureRole

首次类型入口：`$.nodes[].fieldSettings.structure`。本包实例：`/nodes/0/fieldSettings/structure`，完整 JSON 第 2249–2252 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `enabled` | boolean | 必填 | 启用标记；false 不等于删除定义，具体作用范围取决于所在模块。 | `true`；行 2250，Pointer `/nodes/0/fieldSettings/structure/enabled` | 当前契约支持 |
| `role` | `"main"` / `"member"` | 必填 | 结构身份或 Label 碰撞角色；二者是不同概念。 | `"main"`；行 2251，Pointer `/nodes/0/fieldSettings/structure/role` | 当前契约支持 |
| `memberField` | string | 可选 | 主结构中可选的附属成员 ID 反向引用字段。 | `"Floors"`；行 93226，Pointer `/nodes/78/fieldSettings/structure/memberField` | 当前契约支持 |
| `hostField` | string | 可选 | 附属结构中指向主结构 ID 的必填字段。 | `"BuildingID"`；行 7805，Pointer `/nodes/5/fieldSettings/structure/hostField` | 当前契约支持 |
| `selectorField` | string | 可选 | 附属结构用于层级/楼层切换的必填字段。 | `"NofFloor"`；行 7806，Pointer `/nodes/5/fieldSettings/structure/selectorField` | 当前契约支持 |
| `visibility` | `"activeLevel"` / `"allMembers"` | 可选 | 关系可见性扩展，或附属结构显示策略。 | `"activeLevel"`；行 7807，Pointer `/nodes/5/fieldSettings/structure/visibility` | 当前契约支持 |

<a id="t102"></a>

## t102 · CategorySearch

首次类型入口：`$.nodes[].fieldSettings.search`。本包实例：`/nodes/0/fieldSettings/search`，完整 JSON 第 2234–2248 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `enabled` | boolean | 必填 | 启用标记；false 不等于删除定义，具体作用范围取决于所在模块。 | `true`；行 2235，Pointer `/nodes/0/fieldSettings/search/enabled` | 当前契约支持 |
| `inheritance` | `"sealed"` / `"overridable"` | 可选 | 字段 localOnly/overridable/sealed 模式，或搜索规则继承模式。 | 本包未写入 | 当前契约支持 |
| `queryFields` | 数组＜string＞ | 必填 | 可被主页/导航粗搜索匹配的字段路径列表。 | `["Name","ID","Class"]`；行 2236，Pointer `/nodes/0/fieldSettings/search/queryFields` | 当前契约支持 |
| `priority` | number | 可选 | 搜索排序值或渲染显示权重对象；按所在结构区分。 | `1`；行 2241，Pointer `/nodes/0/fieldSettings/search/priority` | 当前契约支持 |
| `subtitle` | [$.nodes[].fieldSettings.search.subtitle [t103]](#t103) | 必填 | 搜索结果副标题设置，或工作流页面副标题。 | `{"mode":"classification"}`；行 2242，Pointer `/nodes/0/fieldSettings/search/subtitle` | 当前契约支持 |
| `extension` | [$.nodes[].fieldSettings.search.extension [t106]](#t106) | 必填 | 搜索结果延伸区域的胶囊显示设置。 | `{"mode":"none"}`；行 2245，Pointer `/nodes/0/fieldSettings/search/extension` | 当前契约支持 |

<a id="t103"></a>

## t103 · $.nodes[].fieldSettings.search.subtitle

首次类型入口：`$.nodes[].fieldSettings.search.subtitle`。本包实例：`/nodes/0/fieldSettings/search/subtitle`，完整 JSON 第 2242–2244 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `mode` | `"field"` / `"classification"` / `"classificationField"` | 必填 | 当前联合结构的分支选择器；先看 mode，再解释其余字段。 | `"classification"`；行 2243，Pointer `/nodes/0/fieldSettings/search/subtitle/mode` | 当前契约支持 |
| `classificationLabel` | [LocalizedText [t1]](#t1) | 可选 | 搜索副标题当前分类的显示名覆写。 | `{"zh":"站台轮廓","en":""}`；行 69181，Pointer `/nodes/63/fieldSettings/search/subtitle/classificationLabel` | 当前契约支持 |
| `fallbackClassificationLabel` | [LocalizedText [t1]](#t1) | 可选 | 搜索副标题备用分类显示名。 | `{"zh":"楼层","en":""}`；行 7793，Pointer `/nodes/5/fieldSettings/search/subtitle/fallbackClassificationLabel` | 当前契约支持 |
| `field` | string | 可选 | 所引用的数据字段路径；不同位置的可用字段集由对应分类限定。 | `"BuildingID"`；行 7790，Pointer `/nodes/5/fieldSettings/search/subtitle/field` | 当前契约支持 |
| `valueMode` | `"reference"` / `"value"` / `"meaning"` | 可选 | 原值、意义对照或外部引用显示模式；不同模块枚举不同。 | `"reference"`；行 7791，Pointer `/nodes/5/fieldSettings/search/subtitle/valueMode` | 当前契约支持 |
| `referenceDisplayField` | string | 可选 | 字段值为目标 ID 时，从目标记录读取的展示字段，常用 Name。 | `"Name"`；行 7792，Pointer `/nodes/5/fieldSettings/search/subtitle/referenceDisplayField` | 当前契约支持 |
| `valueOptions` | 数组＜[SelectOption [t42]](#t42)＞ | 可选 | 搜索副标题或旧信息卡本地意义对照行。 | 本包未写入 | 当前契约支持 |
| `prefillAudit` | [PrefillAudit [t104]](#t104) | 可选 | 预填来源的审计指纹；只用于提醒陈旧，不建立运行时绑定。 | 本包未写入 | 当前契约支持 |

<a id="t104"></a>

## t104 · PrefillAudit

首次类型入口：`$.nodes[].fieldSettings.search.subtitle.prefillAudit`。本包实例：`/nodes/0/card/items/1/prefillAudit`，完整 JSON 第 1609–1618 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `source` | [$.nodes[].fieldSettings.search.subtitle.prefillAudit.source [t105]](#t105) | 必填 | 单次预填时的来源分类/字段审计记录，只提醒内容变化，不建立实时引用。 | `{"path":{"class":"BUD"},"fieldId":"BUD-registry-tags.nomenclator","key":"tags.nomenclator"}`；行 1610，Pointer `/nodes/0/card/items/1/prefillAudit/source` | 当前契约支持 |
| `fingerprint` | string | 必填 | 预填/来源内容的摘要，用于发现修改。 | `"field-v1-a7beef1ad8a57754"`；行 1617，Pointer `/nodes/0/card/items/1/prefillAudit/fingerprint` | 当前契约支持 |
| `confirmedFingerprint` | string | 可选 | 用户已确认的来源摘要。 | 本包未写入 | 当前契约支持 |

<a id="t105"></a>

## t105 · $.nodes[].fieldSettings.search.subtitle.prefillAudit.source

首次类型入口：`$.nodes[].fieldSettings.search.subtitle.prefillAudit.source`。本包实例：`/nodes/0/card/items/1/prefillAudit/source`，完整 JSON 第 1610–1616 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `path` | [ClassificationPath [t16]](#t16) | 必填 | 完整且连续的分类路径；决定节点实际所在层级。 | `{"class":"BUD"}`；行 1611，Pointer `/nodes/0/card/items/1/prefillAudit/source/path` | 当前契约支持 |
| `fieldId` | string | 必填 | 字段稳定身份；同一有效分类内不同 key 不得共用它。 | `"BUD-registry-tags.nomenclator"`；行 1614，Pointer `/nodes/0/card/items/1/prefillAudit/source/fieldId` | 当前契约支持 |
| `key` | string | 必填 | 真实数据字段路径或重复组成员键；不等于 fieldId。 | `"tags.nomenclator"`；行 1615，Pointer `/nodes/0/card/items/1/prefillAudit/source/key` | 当前契约支持 |

<a id="t106"></a>

## t106 · $.nodes[].fieldSettings.search.extension

首次类型入口：`$.nodes[].fieldSettings.search.extension`。本包实例：`/nodes/0/fieldSettings/search/extension`，完整 JSON 第 2245–2247 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `mode` | `"none"` / `"nameColorCapsule"` / `"lineChips"` | 必填 | 当前联合结构的分支选择器；先看 mode，再解释其余字段。 | `"none"`；行 2246，Pointer `/nodes/0/fieldSettings/search/extension/mode` | 当前契约支持 |
| `nameField` | string | 可选 | 当前记录中提供胶囊名称的字段。 | `"Name"`；行 72979，Pointer `/nodes/65/fieldSettings/search/extension/nameField` | 当前契约支持 |
| `displayName` | boolean：true / false | 可选 | 是否显示胶囊名称；这里是布尔值，不是整包 displayName 的中英文对象。 | `false`；行 72981，Pointer `/nodes/65/fieldSettings/search/extension/displayName` | 当前契约支持 |
| `colorField` | string | 可选 | 当前记录中提供胶囊颜色的字段。 | `"color"`；行 72980，Pointer `/nodes/65/fieldSettings/search/extension/colorField` | 当前契约支持 |
| `fallbackColor` | string | 可选 | 主颜色来源无效时使用的回退颜色。 | `"#999999"`；行 72982，Pointer `/nodes/65/fieldSettings/search/extension/fallbackColor` | 当前契约支持 |
| `lineChipSource` | `"platform"` / `"station"` / `"stationBuilding"` | 可选 | 关联线路胶囊索引入口：站台、站场或车站建筑。 | `"platform"`；行 69188，Pointer `/nodes/63/fieldSettings/search/extension/lineChipSource` | 当前契约支持 |

<a id="t107"></a>

## t107 · Partial

首次类型入口：`$.nodes[].geometryProfiles`。本包实例：`/nodes/0/geometryProfiles`，完整 JSON 第 1173–1580 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `Point` | [GeometryProfile [t108]](#t108) | 可选 | 点几何配置键；与 LineString、Polygon 区分。 | `{"enabled":true,"allowMultipleParts":true,"anchor":"featureBbox","interaction":{"triggers":{"label":true,"point":true,"line":false,"boundary":false,"i…（摘要）`；行 58278，Pointer `/nodes/52/geometryProfiles/Point` | 当前契约支持 |
| `LineString` | [GeometryProfile [t108]](#t108) | 可选 | 线几何配置键；最终记录可具有多个线部件。 | `{"enabled":true,"allowMultipleParts":true,"anchor":"featureBbox","interaction":{"triggers":{"label":true,"point":false,"line":true,"boundary":false,"i…（摘要）`；行 47083，Pointer `/nodes/39/geometryProfiles/LineString` | 当前契约支持 |
| `Polygon` | [GeometryProfile [t108]](#t108) | 可选 | 面几何配置键；外部件与部件内孔环是两个层级。 | `{"enabled":true,"allowMultipleParts":true,"anchor":"featureBbox","interaction":{"triggers":{"label":true,"point":false,"line":false,"boundary":false,"…（摘要）`；行 1174，Pointer `/nodes/0/geometryProfiles/Polygon` | 当前契约支持 |

<a id="t108"></a>

## t108 · GeometryProfile

首次类型入口：`$.nodes[].geometryProfiles.Point`。本包实例：`/nodes/0/geometryProfiles/Polygon`，完整 JSON 第 1174–1579 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `renderState` | `"enabled"` / `"unconfigured"` | 可选 | 显示是否已配置；unconfigured 与禁用几何能力不同。 | 本包未写入 | 当前契约支持 |
| `enabled` | boolean | 必填 | 启用标记；false 不等于删除定义，具体作用范围取决于所在模块。 | `true`；行 1175，Pointer `/nodes/0/geometryProfiles/Polygon/enabled` | 当前契约支持 |
| `allowMultipleParts` | boolean | 必填 | 该分类几何是否接受多部件；当前入口即时禁用尚有已知缺口，保存检查仍有效。 | `true`；行 1176，Pointer `/nodes/0/geometryProfiles/Polygon/allowMultipleParts` | 当前契约支持 |
| `anchor` | `"perPart"` / `"featureBbox"` | 可选 | 多部件锚点模式，或规则内详细锚点设置；先看它是字符串还是对象。 | `"featureBbox"`；行 1177，Pointer `/nodes/0/geometryProfiles/Polygon/anchor` | 当前契约支持 |
| `color` | string | 可选 | 固定颜色文本；可用颜色语法仍须通过实际核验。 | 本包未写入 | 旧版兼容；新写入放在规则内 |
| `style` | [$.nodes[].geometryProfiles.Point.style [t109]](#t109) | 可选 | 当前规则的几何外观，或 Label 的字体族/字号等样式。 | 本包未写入 | 旧版兼容；新写入放在规则内 |
| `geometryStack` | [GeometryStackPolicy [t110]](#t110) | 可选 | 真实几何的绘制层级 A，与碰撞 B 和显示权重 C 分开。 | 本包未写入 | 旧版兼容；新写入放在规则内 |
| `label` | [$.nodes[].geometryProfiles.Point.label [t111]](#t111) | 可选 | 名称对象或 Label 样式对象；必须结合所在路径解读。 | 本包未写入 | 旧版兼容；新写入放在规则内 |
| `zoomPriority` | [$.nodes[].geometryProfiles.Point.zoomPriority [t114]](#t114) | 必填 | 该几何的 Zoom 显示规则容器，核心成员为 rules。 | `{"rules":[{"id":"v1-structure-hidden--base","representation":"hidden","style":{"weight":1,"stroke":{"mode":"fixed","color":"#111827"},"fill":{"mode":"…（摘要）`；行 1187，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority` | 当前契约支持 |
| `interaction` | [$.nodes[].geometryProfiles.Point.interaction [t137]](#t137) | 可选 | 本几何的命中触发器，或规则内交互外观覆盖。 | `{"triggers":{"label":true,"point":false,"line":false,"boundary":false,"interior":false}}`；行 1178，Pointer `/nodes/0/geometryProfiles/Polygon/interaction` | 当前契约支持 |
| `legacyDisplay` | [$.nodes[].geometryProfiles.Point.legacyDisplay [t138]](#t138) | 可选 | 迁移用的旧显示来源索引。 | 本包未写入 | 兼容/迁移保留 |

<a id="t109"></a>

## t109 · $.nodes[].geometryProfiles.Point.style

首次类型入口：`$.nodes[].geometryProfiles.Point.style`。本包没有此结构的实际实例；可能是可选功能或兼容分支。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `weight` | number | 可选 | 几何描边宽度，单位屏幕像素。 | 本包未写入 | 当前契约支持 |
| `fillOpacity` | number | 可选 | 填充不透明度，0 为透明，1 为不透明。 | 本包未写入 | 当前契约支持 |
| `opacity` | number | 可选 | 整体或局部不透明度；通常 0–1。 | 本包未写入 | 当前契约支持 |
| `dashArray` | string | 可选 | 旧版自定义虚线长度字符串。 | 本包未写入 | 当前契约支持 |

<a id="t110"></a>

## t110 · GeometryStackPolicy

首次类型入口：`$.nodes[].geometryProfiles.Point.geometryStack`。本包实例：`/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/geometryStack`，完整 JSON 第 1222–1224 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `zLevel` | number | 必填 | 真实几何的基础绘制层级。 | `360`；行 1223，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/geometryStack/zLevel` | 当前契约支持 |
| `pane` | string | 可选 | 绘制 pane；控制真实绘制层级，不能代替碰撞分数。 | 本包未写入 | 当前契约支持 |
| `zIndexOffset` | number | 可选 | 在基础图层顺序上叠加的偏移量；不等于 Label 碰撞优先级。 | 本包未写入 | 当前契约支持 |

<a id="t111"></a>

## t111 · $.nodes[].geometryProfiles.Point.label

首次类型入口：`$.nodes[].geometryProfiles.Point.label`。本包没有此结构的实际实例；可能是可选功能或兼容分支。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `visible` | boolean | 必填 | 是否显示该 Label 或信息卡单元。 | 本包未写入 | 当前契约支持 |
| `anchor` | `"perPart"` / `"featureBbox"` | 必填 | 多部件锚点模式，或规则内详细锚点设置；先看它是字符串还是对象。 | 本包未写入 | 当前契约支持 |
| `conditions` | 数组＜[$.nodes[].fields[].requiredWhen[] [t91]](#t91) / [$.nodes[].fields[].requiredWhen[] [t92]](#t92) / [$.nodes[].fields[].requiredWhen[] [t93]](#t93) / [$.nodes[].fields[].requiredWhen[] [t94]](#t94) / [$.nodes[].fields[].requiredWhen[] [t95]](#t95) / [$.nodes[].fields[].requiredWhen[] [t96]](#t96)＞ | 必填 | 旧式条件数组；当前规则通常使用 when。 | 本包未写入 | 当前契约支持 |
| `collision` | [LabelCollisionPolicy [t112]](#t112) | 必填 | Label 碰撞角色或详细碰撞扩展；不控制真实几何层级。 | 本包未写入 | 当前契约支持 |

<a id="t112"></a>

## t112 · LabelCollisionPolicy

首次类型入口：`$.nodes[].geometryProfiles.Point.label.collision`。本包实例：`/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/label/collision`，完整 JSON 第 1215–1220 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `role` | `"ignore"` / `"soft"` / `"optional"` / `"important"` / `"required"` | 必填 | 结构身份或 Label 碰撞角色；二者是不同概念。 | `"soft"`；行 1216，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/label/collision/role` | 当前契约支持 |
| `basePriority` | number | 必填 | Label 碰撞基础分数，不等于图层 zLevel。 | `0`；行 1217，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/label/collision/basePriority` | 当前契约支持 |
| `collisionGroup` | string | 可选 | Label 参与碰撞的逻辑分组名称。 | `"structureLabel"`；行 1218，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/label/collision/collisionGroup` | 当前契约支持 |
| `hideWhenColliding` | boolean | 必填 | 碰撞时是否隐藏该 Label。 | `true`；行 1219，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/label/collision/hideWhenColliding` | 当前契约支持 |
| `densityLimit` | number | 可选 | 旧式碰撞密度限制参数。 | 本包未写入 | 当前契约支持 |
| `metric` | [$.nodes[].geometryProfiles.Point.label.collision.metric [t113]](#t113) | 可选 | 按面积、长度、部件数或字段值计算的指标贡献。 | `{"kind":"area","multiplier":1,"divisor":10,"rounding":"floor","min":0,"max":999}`；行 1342，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/1/label/collision/metric` | 当前契约支持 |
| `compatibility` | `"r5DisplayPriority"` | 可选 | 明确保留的旧版优先级合成行为标记。 | 本包未写入 | 当前契约支持 |

<a id="t113"></a>

## t113 · $.nodes[].geometryProfiles.Point.label.collision.metric

首次类型入口：`$.nodes[].geometryProfiles.Point.label.collision.metric`。本包实例：`/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/1/label/collision/metric`，完整 JSON 第 1342–1349 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `kind` | `"field"` / `"area"` / `"length"` / `"partCount"` | 必填 | 分类路径第二级，或条件/控件的分支种类；依所在对象判读。 | `"area"`；行 1343，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/1/label/collision/metric/kind` | 当前契约支持 |
| `field` | string | 可选 | 所引用的数据字段路径；不同位置的可用字段集由对应分类限定。 | 本包未写入 | 当前契约支持 |
| `multiplier` | number | 必填 | 指标贡献的乘数。 | `1`；行 1344，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/1/label/collision/metric/multiplier` | 当前契约支持 |
| `divisor` | number | 可选 | 指标贡献的正数除数；不可为零。 | `10`；行 1345，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/1/label/collision/metric/divisor` | 当前契约支持 |
| `rounding` | `"none"` / `"floor"` / `"round"` / `"ceil"` | 必填 | 指标结果保持原值或向下/就近/向上取整。 | `"floor"`；行 1346，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/1/label/collision/metric/rounding` | 当前契约支持 |
| `min` | number | 可选 | 当前数值区间下限；单位取决于所在规则/指标。 | `0`；行 1347，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/1/label/collision/metric/min` | 当前契约支持 |
| `max` | number | 可选 | 当前数值区间上限；单位取决于所在规则/指标。 | `999`；行 1348，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/1/label/collision/metric/max` | 当前契约支持 |

<a id="t114"></a>

## t114 · $.nodes[].geometryProfiles.Point.zoomPriority

首次类型入口：`$.nodes[].geometryProfiles.Point.zoomPriority`。本包实例：`/nodes/0/geometryProfiles/Polygon/zoomPriority`，完整 JSON 第 1187–1578 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `rules` | 数组＜[ZoomPriorityRule [t115]](#t115)＞ | 必填 | 有顺序的渲染规则数组；匹配不是自动平均或同时合并全部规则。 | `[{"id":"v1-structure-hidden--base","representation":"hidden","style":{"weight":1,"stroke":{"mode":"fixed","color":"#111827"},"fill":{"mode":"fixed","c…（摘要）`；行 1188，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules` | 当前契约支持 |

<a id="t115"></a>

## t115 · ZoomPriorityRule

首次类型入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[]`。本包实例：`/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0`，完整 JSON 第 1189–1302 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `id` | string | 必填 | 当前对象的稳定标识；唯一性范围取决于对象类型。 | `"v1-structure-hidden--base"`；行 1190，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/id` | 当前契约支持 |
| `when` | [RenderRuleMatch [t116]](#t116) | 可选 | 当前规则/模块生效条件；渲染、工作流和旧条件数组语法不同。 | `{"zoom":{"min":0,"max":2}}`；行 1296，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/when` | 当前契约支持 |
| `minZoom` | number | 可选 | 最小缩放边界；渲染原生规则为含端点，优先读取 when.zoom。 | 本包未写入 | 当前契约支持 |
| `maxZoom` | number | 可选 | 最大缩放边界；渲染原生规则为含端点，优先读取 when.zoom。 | 本包未写入 | 当前契约支持 |
| `representation` | `"point"` / `"geometry"` / `"hidden"` / `"labelOnly"` | 可选 | 命中规则时输出隐藏、几何、点符号或仅文字等显示种类。 | `"hidden"`；行 1191，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/representation` | 当前契约支持 |
| `style` | [RenderStyle [t123]](#t123) | 可选 | 当前规则的几何外观，或 Label 的字体族/字号等样式。 | `{"weight":1,"stroke":{"mode":"fixed","color":"#111827"},"fill":{"mode":"fixed","color":"#111827"},"fillOpacity":0.18,"strokeOpacity":0.45,"dashPreset"…（摘要）`；行 1192，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/style` | 当前契约支持 |
| `label` | [RenderLabelStyle [t126]](#t126) | 可选 | 此条规则的 Label 外观、来源、碰撞等设置；不是普通名称字符串。 | `{"visible":false,"style":{"family":"structure-label","size":12},"source":"Name","collision":{"role":"soft","basePriority":0,"collisionGroup":"structur…（摘要）`；行 1208，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/label` | 当前契约支持 |
| `interaction` | [$.nodes[].geometryProfiles.Point.zoomPriority.rules[].interaction [t130]](#t130) | 可选 | 本几何的命中触发器，或规则内交互外观覆盖。 | 本包未写入 | 旧版兼容 |
| `geometryStack` | [GeometryStackPolicy [t110]](#t110) | 可选 | 真实几何的绘制层级 A，与碰撞 B 和显示权重 C 分开。 | `{"zLevel":360}`；行 1222，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/geometryStack` | 当前契约支持 |
| `extensions` | [RenderRuleExtensions [t20]](#t20) | 可选 | 规则局部的类型化渲染扩展；在字段路径中则表示要素的扩展数据组。 | `{"screenGate":{"mode":"inherit"},"anchor":{"strategy":"interior","candidates":["C","N","S","E","W"],"requireInsideGeometry":true,"candidatePlacement":…（摘要）`；行 1229，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/extensions` | 当前契约支持 |
| `conditionalOverrides` | 数组＜[RenderRuleConditionalOverride [t132]](#t132)＞ | 可选 | 同一条 Zoom 规则内部的字段条件覆写数组。 | 本包未写入 | 当前契约支持 |
| `advanced` | [AdvancedRenderRule [t134]](#t134) | 可选 | 旧兼容渲染描述；新原生设置优先使用类型明确的 extensions。 | 本包未写入 | 当前契约支持 |
| `minExclusive` | number | 可选 | 旧版不含端点的最小 Zoom；新规则不应继续使用。 | 本包未写入 | 当前契约支持 |
| `maxExclusive` | number | 可选 | 旧版不含端点的最大 Zoom；新规则不应继续使用。 | 本包未写入 | 当前契约支持 |
| `labelRole` | `"ignore"` / `"soft"` / `"optional"` / `"important"` / `"required"` | 可选 | 旧版 Label 角色位置；新配置在 label.collision.role。 | 本包未写入 | 当前契约支持 |
| `priority` | [RenderPriority [t133]](#t133) | 可选 | 搜索排序值或渲染显示权重对象；按所在结构区分。 | `{"mode":"replace","base":0}`；行 1225，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/priority` | 当前契约支持 |

<a id="t116"></a>

## t116 · RenderRuleMatch

首次类型入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].when`。本包实例：`/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/when`，完整 JSON 第 1296–1301 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `zoom` | [$.nodes[].geometryProfiles.Point.zoomPriority.rules[].when.zoom [t117]](#t117) | 必填 | 原生渲染规则必需的含端点逻辑 Zoom 区间。 | `{"min":0,"max":2}`；行 1297，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/when/zoom` | 当前契约支持 |
| `fields` | [RenderFieldGroup [t118]](#t118) | 可选 | 字段定义数组、字段条件组或继承字段开关；先看当前类型。 | `{"op":"all","items":[],"formula":{"terms":[{"id":"C1","relation":"AND","condition":{"kind":"fieldEquals","field":"Connect","value":"false"}}],"express…（摘要）`；行 69733，Pointer `/nodes/64/geometryProfiles/Point/zoomPriority/rules/2/when/fields` | 当前契约支持 |

<a id="t117"></a>

## t117 · $.nodes[].geometryProfiles.Point.zoomPriority.rules[].when.zoom

首次类型入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].when.zoom`。本包实例：`/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/when/zoom`，完整 JSON 第 1297–1300 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `min` | number | 必填 | 当前数值区间下限；单位取决于所在规则/指标。 | `0`；行 1298，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/when/zoom/min` | 当前契约支持 |
| `max` | number | 必填 | 当前数值区间上限；单位取决于所在规则/指标。 | `2`；行 1299，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/when/zoom/max` | 当前契约支持 |

<a id="t118"></a>

## t118 · RenderFieldGroup

首次类型入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].when.fields`。本包实例：`/nodes/64/geometryProfiles/Point/zoomPriority/rules/2/when/fields`，完整 JSON 第 69733–69751 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `op` | `"all"` / `"any"` / `"not"` | 必填 | 字段条件树组合：all 全部、any 任一、not 否定。 | `"all"`；行 69734，Pointer `/nodes/64/geometryProfiles/Point/zoomPriority/rules/2/when/fields/op` | 当前契约支持 |
| `items` | 数组＜[$.nodes[].fields[].requiredWhen[] [t94]](#t94) / [$.nodes[].fields[].requiredWhen[] [t95]](#t95) / [$.nodes[].fields[].requiredWhen[] [t96]](#t96) / [RenderFieldGroup [t118]](#t118) / [$.nodes[].geometryProfiles.Point.zoomPriority.rules[].when.fields.items[] [t119]](#t119)＞ | 必填 | 当前模块的项目数组；项目结构由所在类型说明。 | `[]`；行 69735，Pointer `/nodes/64/geometryProfiles/Point/zoomPriority/rules/2/when/fields/items` | 当前契约支持 |
| `formula` | [RenderConditionFormula [t120]](#t120) | 可选 | 可见条件编号及手工组合表达式；最终编译为条件树。 | `{"terms":[{"id":"C1","relation":"AND","condition":{"kind":"fieldEquals","field":"Connect","value":"false"}}],"expression":"((C1))","manual":true}`；行 69736，Pointer `/nodes/64/geometryProfiles/Point/zoomPriority/rules/2/when/fields/formula` | 当前契约支持 |

<a id="t119"></a>

## t119 · $.nodes[].geometryProfiles.Point.zoomPriority.rules[].when.fields.items[]

首次类型入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].when.fields.items[]`。本包没有此结构的实际实例；可能是可选功能或兼容分支。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `kind` | `"fieldCompare"` | 必填 | 分类路径第二级，或条件/控件的分支种类；依所在对象判读。 | 本包未写入 | 当前契约支持 |
| `field` | string | 必填 | 所引用的数据字段路径；不同位置的可用字段集由对应分类限定。 | 本包未写入 | 当前契约支持 |
| `operator` | `"eq"` / `"ne"` / `"in"` / `"notIn"` / `"present"` / `"empty"` / `"gt"` / `"ge"` / `"lt"` / `"le"` | 必填 | 单个字段/槽位条件的比较操作符。 | 本包未写入 | 当前契约支持 |
| `value` | string / number / `false` / `true` | 可选 | 最终存储值、条件比较值或常量；是否字符串须看当前类型声明。 | 本包未写入 | 当前契约支持 |
| `values` | 数组＜string / number / `false` / `true`＞ | 可选 | 条件允许的比较值集合；严格比较时类型也须匹配。 | 本包未写入 | 当前契约支持 |

<a id="t120"></a>

## t120 · RenderConditionFormula

首次类型入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].when.fields.formula`。本包实例：`/nodes/64/geometryProfiles/Point/zoomPriority/rules/2/when/fields/formula`，完整 JSON 第 69736–69750 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `expression` | string | 必填 | 工作流组装公式或条件编号布尔公式；两者语法不同。 | `"((C1))"`；行 69748，Pointer `/nodes/64/geometryProfiles/Point/zoomPriority/rules/2/when/fields/formula/expression` | 当前契约支持 |
| `manual` | boolean：true / false | 可选 | 是否采用手工条件公式，暂停按行连接关系自动生成。 | `true`；行 69749，Pointer `/nodes/64/geometryProfiles/Point/zoomPriority/rules/2/when/fields/formula/manual` | 当前契约支持 |
| `terms` | 数组＜[$.nodes[].geometryProfiles.Point.zoomPriority.rules[].when.fields.formula.terms[] [t121]](#t121)＞ | 必填 | 具有稳定编号的原子条件行数组。 | `[{"id":"C1","relation":"AND","condition":{"kind":"fieldEquals","field":"Connect","value":"false"}}]`；行 69737，Pointer `/nodes/64/geometryProfiles/Point/zoomPriority/rules/2/when/fields/formula/terms` | 当前契约支持 |
| `groups` | 数组＜[$.nodes[].geometryProfiles.Point.zoomPriority.rules[].when.fields.formula.groups[] [t122]](#t122)＞ | 可选 | 来源组数组，或渲染条件命名组；由所在结构区分。 | 本包未写入 | 当前契约支持 |

<a id="t121"></a>

## t121 · $.nodes[].geometryProfiles.Point.zoomPriority.rules[].when.fields.formula.terms[]

首次类型入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].when.fields.formula.terms[]`。本包实例：`/nodes/64/geometryProfiles/Point/zoomPriority/rules/2/when/fields/formula/terms/0`，完整 JSON 第 69738–69746 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `id` | string | 必填 | 当前对象的稳定标识；唯一性范围取决于对象类型。 | `"C1"`；行 69739，Pointer `/nodes/64/geometryProfiles/Point/zoomPriority/rules/2/when/fields/formula/terms/0/id` | 当前契约支持 |
| `relation` | `"AND"` / `"OR"` / `"NOT"` | 必填 | 条件行连接关系 AND/OR/NOT，或信息卡关系显示配置。 | `"AND"`；行 69740，Pointer `/nodes/64/geometryProfiles/Point/zoomPriority/rules/2/when/fields/formula/terms/0/relation` | 当前契约支持 |
| `condition` | [$.nodes[].fields[].requiredWhen[] [t94]](#t94) / [$.nodes[].fields[].requiredWhen[] [t95]](#t95) / [$.nodes[].fields[].requiredWhen[] [t96]](#t96) / [$.nodes[].geometryProfiles.Point.zoomPriority.rules[].when.fields.items[] [t119]](#t119) | 必填 | 当前编号对应的实际字段比较条件。 | `{"kind":"fieldEquals","field":"Connect","value":"false"}`；行 69741，Pointer `/nodes/64/geometryProfiles/Point/zoomPriority/rules/2/when/fields/formula/terms/0/condition` | 当前契约支持 |

<a id="t122"></a>

## t122 · $.nodes[].geometryProfiles.Point.zoomPriority.rules[].when.fields.formula.groups[]

首次类型入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].when.fields.formula.groups[]`。本包没有此结构的实际实例；可能是可选功能或兼容分支。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `id` | string | 必填 | 当前对象的稳定标识；唯一性范围取决于对象类型。 | 本包未写入 | 当前契约支持 |
| `expression` | string | 必填 | 工作流组装公式或条件编号布尔公式；两者语法不同。 | 本包未写入 | 当前契约支持 |

<a id="t123"></a>

## t123 · RenderStyle

首次类型入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].style`。本包实例：`/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/style`，完整 JSON 第 1192–1207 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `symbolOffsetPx` | [$.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.symbolOffsetPx [t124]](#t124) | 可选 | 点符号相对其锚点的屏幕偏移，单位像素。 | `{"x":0,"y":3.7}`；行 1323，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/1/style/symbolOffsetPx` | 当前契约支持 |
| `symbolVisibility` | `"independent"` / `"withLabel"` | 可选 | 点符号独立显示还是随 Label 显示。 | `"withLabel"`；行 1328，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/1/style/symbolVisibility` | 当前契约支持 |
| `symbolAnchor` | `"geometry"` / `"label"` | 可选 | 符号以源几何或 Label 锚点为基准。 | `"label"`；行 1327，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/1/style/symbolAnchor` | 当前契约支持 |
| `pointShape` | `"circle"` / `"square"` / `"triangle"` / `"regular4"` / `"regular5"` / `"regular6"` | 可选 | 点符号几何外形。 | `"circle"`；行 1321，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/1/style/pointShape` | 当前契约支持 |
| `icon` | [RenderPointIcon [t125]](#t125) | 可选 | 外部图标描述；存在时覆盖普通点外形。 | `{"source":"iconUrl","size":[24,24],"anchor":[12,24],"fallback":"circle"}`；行 90278，Pointer `/nodes/76/geometryProfiles/Point/zoomPriority/rules/0/style/icon` | 当前契约支持 |
| `size` | number | 可选 | 符号/文字尺寸或按钮尺寸；单位与数组结构见当前对象类型。 | `4.5`；行 1322，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/1/style/size` | 当前契约支持 |
| `weight` | number | 可选 | 几何描边宽度，单位屏幕像素。 | `1`；行 1193，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/style/weight` | 当前契约支持 |
| `stroke` | [$.engine.interactionBaselines.Point.hover.strokeColorBinding [t11]](#t11) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding [t13]](#t13) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding [t14]](#t14) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding [t15]](#t15) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding [t17]](#t17) | 必填 | 描边颜色绑定方式。 | `{"mode":"fixed","color":"#111827"}`；行 1194，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/style/stroke` | 当前契约支持 |
| `fill` | [$.engine.interactionBaselines.Point.hover.strokeColorBinding [t11]](#t11) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding [t13]](#t13) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding [t14]](#t14) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding [t15]](#t15) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding [t17]](#t17) | 可选 | 填充颜色绑定方式。 | `{"mode":"fixed","color":"#111827"}`；行 1198，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/style/fill` | 当前契约支持 |
| `strokeOpacity` | number | 必填 | 描边不透明度，0 为透明，1 为不透明。 | `0.45`；行 1203，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/style/strokeOpacity` | 当前契约支持 |
| `fillOpacity` | number | 可选 | 填充不透明度，0 为透明，1 为不透明。 | `0.18`；行 1202，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/style/fillOpacity` | 当前契约支持 |
| `dashPreset` | `"solid"` / `"dash"` / `"dotDash"` / `"dotDotDash"` | 可选 | 实线、虚线或点划线预设。 | `"solid"`；行 1204，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/style/dashPreset` | 当前契约支持 |
| `lineCap` | `"round"` / `"square"` / `"butt"` | 可选 | 线端样式：平头、圆头或方头。 | `"round"`；行 1205，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/style/lineCap` | 当前契约支持 |
| `lineJoin` | `"round"` / `"miter"` / `"bevel"` | 可选 | 线段连接转角样式。 | `"round"`；行 1206，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/style/lineJoin` | 当前契约支持 |

<a id="t124"></a>

## t124 · $.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.symbolOffsetPx

首次类型入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.symbolOffsetPx`。本包实例：`/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/1/style/symbolOffsetPx`，完整 JSON 第 1323–1326 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `x` | number | 必填 | X 坐标或水平像素偏移；由所在坐标/偏移对象区分。 | `0`；行 1324，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/1/style/symbolOffsetPx/x` | 当前契约支持 |
| `y` | number | 必填 | 世界高度坐标或垂直像素偏移；地图平面第二轴通常是 z。 | `3.7`；行 1325，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/1/style/symbolOffsetPx/y` | 当前契约支持 |

<a id="t125"></a>

## t125 · RenderPointIcon

首次类型入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].style.icon`。本包实例：`/nodes/76/geometryProfiles/Point/zoomPriority/rules/0/style/icon`，完整 JSON 第 90278–90289 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `source` | string | 必填 | 信息卡字段来源、图标来源、预填来源或对齐文件位置；结合路径区分。 | `"iconUrl"`；行 90279，Pointer `/nodes/76/geometryProfiles/Point/zoomPriority/rules/0/style/icon/source` | 当前契约支持 |
| `size` | 固定数组 [number, number] | 必填 | 符号/文字尺寸或按钮尺寸；单位与数组结构见当前对象类型。 | `[24,24]`；行 90280，Pointer `/nodes/76/geometryProfiles/Point/zoomPriority/rules/0/style/icon/size` | 当前契约支持 |
| `anchor` | 固定数组 [number, number] | 必填 | 多部件锚点模式，或规则内详细锚点设置；先看它是字符串还是对象。 | `[12,24]`；行 90284，Pointer `/nodes/76/geometryProfiles/Point/zoomPriority/rules/0/style/icon/anchor` | 当前契约支持 |
| `fallback` | `"circle"` / `"hide"` | 必填 | 回退策略对象，或默认启用按钮 ID 列表，依所在模块解释。 | `"circle"`；行 90288，Pointer `/nodes/76/geometryProfiles/Point/zoomPriority/rules/0/style/icon/fallback` | 当前契约支持 |

<a id="t126"></a>

## t126 · RenderLabelStyle

首次类型入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].label`。本包实例：`/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/label`，完整 JSON 第 1208–1221 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `visible` | boolean | 必填 | 是否显示该 Label 或信息卡单元。 | `false`；行 1209，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/label/visible` | 当前契约支持 |
| `style` | [RenderLabelVisualStyle [t127]](#t127) | 可选 | 当前规则的几何外观，或 Label 的字体族/字号等样式。 | `{"family":"structure-label","size":12}`；行 1210，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/label/style` | 当前契约支持 |
| `font` | `"blue"` / `"whiteBlackOutline"` / `"capsule"` | 可选 | 旧 Label 字体枚举；新配置使用 label.style.family。 | 本包未写入 | 旧版兼容 |
| `size` | number | 可选 | 符号/文字尺寸或按钮尺寸；单位与数组结构见当前对象类型。 | 本包未写入 | 旧版兼容 |
| `italic` | boolean：true / false | 可选 | 文字斜体；新配置存放于 label.style.modifiers。 | 本包未写入 | 旧版兼容 |
| `underline` | boolean：true / false | 可选 | 文字下划线；新配置存放于 label.style.modifiers。 | 本包未写入 | 旧版兼容 |
| `source` | string | 可选 | 单一 Label 主来源字段，如 Name；组合来源改用 sourceMode 与 template。 | `"Name"`；行 1214，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/label/source` | 当前契约支持 |
| `sourceMode` | `"single"` / `"combined"` | 可选 | Label 采用单一字段还是组合文字来源。 | `"combined"`；行 71159，Pointer `/nodes/65/geometryProfiles/LineString/zoomPriority/rules/2/label/sourceMode` | 当前契约支持 |
| `template` | string | 可选 | Label 组合模板：双引号内为字段路径，其余为字面文字。 | `"\"bureau\"\"line\""`；行 71160，Pointer `/nodes/65/geometryProfiles/LineString/zoomPriority/rules/2/label/template` | 当前契约支持 |
| `fallbackSources` | 数组＜string＞ | 可选 | 主来源无文字时依序尝试的备用字段路径。 | `["NofFloor"]`；行 6938，Pointer `/nodes/5/geometryProfiles/Polygon/zoomPriority/rules/1/label/fallbackSources` | 当前契约支持 |
| `valueFormat` | `"plain"` / `"floorLabel"` | 可选 | 文字的受控格式化方式，例如楼层值格式。 | 本包未写入 | 当前契约支持 |
| `fallbackValueFormats` | [Record [t129]](#t129) | 可选 | 以备用字段路径为键的格式化方式映射。 | `{"NofFloor":"floorLabel"}`；行 6941，Pointer `/nodes/5/geometryProfiles/Polygon/zoomPriority/rules/1/label/fallbackValueFormats` | 当前契约支持 |
| `placement` | `"N"` / `"S"` / `"E"` / `"W"` / `"NE"` / `"NW"` / `"SE"` / `"SW"` / `"center"` / `"aboveLine"` / `"belowLine"` / `"near"` | 可选 | 标签相对锚点的方位或相对线的位置。 | `"E"`；行 1351，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/1/label/placement` | 当前契约支持 |
| `offsetY` | number | 可选 | Label 垂直方向屏幕偏移。 | `3.7`；行 1353，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/1/label/offsetY` | 当前契约支持 |
| `offsetX` | number | 可选 | Label 水平方向屏幕偏移。 | `11`；行 1352，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/1/label/offsetX` | 当前契约支持 |
| `withDot` | boolean：true / false | 可选 | Label 是否带装饰圆点；不等同于实际点几何。 | `true`；行 6820，Pointer `/nodes/5/geometryProfiles/Polygon/zoomPriority/rules/0/label/withDot` | 当前契约支持 |
| `dotAnchorMode` | `"anchorRight"` / `"inline"` | 可选 | 装饰圆点的位置规则。 | `"inline"`；行 6821，Pointer `/nodes/5/geometryProfiles/Polygon/zoomPriority/rules/0/label/dotAnchorMode` | 当前契约支持 |
| `collision` | [LabelCollisionPolicy [t112]](#t112) | 必填 | Label 碰撞角色或详细碰撞扩展；不控制真实几何层级。 | `{"role":"soft","basePriority":0,"collisionGroup":"structureLabel","hideWhenColliding":true}`；行 1215，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/label/collision` | 当前契约支持 |

<a id="t127"></a>

## t127 · RenderLabelVisualStyle

首次类型入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].label.style`。本包实例：`/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/label/style`，完整 JSON 第 1210–1213 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `family` | `"gm-bw"` / `"gm-outline"` / `"gm-wtb"` / `"structure-label"` / `"bubble-dark"` / `"rle-line-color"` / `"rle-pill-color"` | 必填 | 受控 Label 视觉族键，如 gm-outline、rle-pill-color。 | `"structure-label"`；行 1211，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/label/style/family` | 当前契约支持 |
| `size` | number | 必填 | 符号/文字尺寸或按钮尺寸；单位与数组结构见当前对象类型。 | `12`；行 1212，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/label/style/size` | 当前契约支持 |
| `modifiers` | [LabelStyleModifiers [t128]](#t128) | 可选 | 文字斜体、下划线、粗体等修饰集合。 | 本包未写入 | 当前契约支持 |
| `color` | [$.engine.interactionBaselines.Point.hover.strokeColorBinding [t11]](#t11) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding [t13]](#t13) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding [t14]](#t14) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding [t15]](#t15) / [$.engine.interactionBaselines.Point.hover.strokeColorBinding [t17]](#t17) | 可选 | 固定颜色文本；可用颜色语法仍须通过实际核验。 | `{"mode":"field","field":"color","fallbackColor":"#2563eb"}`；行 70766，Pointer `/nodes/65/geometryProfiles/LineString/zoomPriority/rules/0/label/style/color` | 当前契约支持 |

<a id="t128"></a>

## t128 · LabelStyleModifiers

首次类型入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].label.style.modifiers`。本包没有此结构的实际实例；可能是可选功能或兼容分支。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `italic` | boolean：true / false | 可选 | 文字斜体；新配置存放于 label.style.modifiers。 | 本包未写入 | 当前契约支持 |
| `underline` | boolean：true / false | 可选 | 文字下划线；新配置存放于 label.style.modifiers。 | 本包未写入 | 当前契约支持 |
| `bold` | boolean：true / false | 可选 | 文字粗体开关。 | 本包未写入 | 当前契约支持 |

<a id="t129"></a>

## t129 · Record

首次类型入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].label.fallbackValueFormats`。本包实例：`/nodes/5/geometryProfiles/Polygon/zoomPriority/rules/1/label/fallbackValueFormats`，完整 JSON 第 6941–6943 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| 【自定义键】 | `"plain"` / `"floorLabel"` | 按使用方约定 | 此对象是字典，键名可变；不代表任意位置均接受新属性。 | 见该对象实际内容 | 当前契约支持 |

<a id="t130"></a>

## t130 · $.nodes[].geometryProfiles.Point.zoomPriority.rules[].interaction

首次类型入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].interaction`。本包没有此结构的实际实例；可能是可选功能或兼容分支。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `triggers` | [GeometryInteractionTriggers [t131]](#t131) | 必填 | 可触发交互的命中区域集合。 | 本包未写入 | 当前契约支持 |

<a id="t131"></a>

## t131 · GeometryInteractionTriggers

首次类型入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].interaction.triggers`。本包实例：`/nodes/0/geometryProfiles/Polygon/interaction/triggers`，完整 JSON 第 1179–1185 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `point` | boolean：true / false | 可选 | 点图层的 pane 名、交互触发标记或单点返回值，依所在对象判读。 | `false`；行 1181，Pointer `/nodes/0/geometryProfiles/Polygon/interaction/triggers/point` | 当前契约支持 |
| `line` | boolean：true / false | 可选 | 是否允许线几何触发交互。 | `false`；行 1182，Pointer `/nodes/0/geometryProfiles/Polygon/interaction/triggers/line` | 当前契约支持 |
| `boundary` | boolean：true / false | 可选 | 是否允许面边界触发交互。 | `false`；行 1183，Pointer `/nodes/0/geometryProfiles/Polygon/interaction/triggers/boundary` | 当前契约支持 |
| `interior` | boolean：true / false | 可选 | 是否允许面内部触发交互。 | `false`；行 1184，Pointer `/nodes/0/geometryProfiles/Polygon/interaction/triggers/interior` | 当前契约支持 |
| `label` | boolean：true / false | 可选 | 名称对象或 Label 样式对象；必须结合所在路径解读。 | `true`；行 1180，Pointer `/nodes/0/geometryProfiles/Polygon/interaction/triggers/label` | 当前契约支持 |

<a id="t132"></a>

## t132 · RenderRuleConditionalOverride

首次类型入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].conditionalOverrides[]`。本包没有此结构的实际实例；可能是可选功能或兼容分支。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `id` | string | 必填 | 当前对象的稳定标识；唯一性范围取决于对象类型。 | 本包未写入 | 当前契约支持 |
| `when` | 数组＜[$.nodes[].fields[].requiredWhen[] [t91]](#t91) / [$.nodes[].fields[].requiredWhen[] [t92]](#t92) / [$.nodes[].fields[].requiredWhen[] [t93]](#t93) / [$.nodes[].fields[].requiredWhen[] [t94]](#t94) / [$.nodes[].fields[].requiredWhen[] [t95]](#t95) / [$.nodes[].fields[].requiredWhen[] [t96]](#t96)＞ | 必填 | 当前规则/模块生效条件；渲染、工作流和旧条件数组语法不同。 | 本包未写入 | 当前契约支持 |
| `representation` | `"point"` / `"geometry"` / `"hidden"` / `"labelOnly"` | 可选 | 命中规则时输出隐藏、几何、点符号或仅文字等显示种类。 | 本包未写入 | 当前契约支持 |
| `style` | [RenderStyle [t123]](#t123) | 可选 | 当前规则的几何外观，或 Label 的字体族/字号等样式。 | 本包未写入 | 当前契约支持 |
| `label` | [RenderLabelStyle [t126]](#t126) | 可选 | 名称对象或 Label 样式对象；必须结合所在路径解读。 | 本包未写入 | 当前契约支持 |
| `geometryStack` | [GeometryStackPolicy [t110]](#t110) | 可选 | 真实几何的绘制层级 A，与碰撞 B 和显示权重 C 分开。 | 本包未写入 | 当前契约支持 |
| `priority` | [RenderPriority [t133]](#t133) | 可选 | 搜索排序值或渲染显示权重对象；按所在结构区分。 | 本包未写入 | 当前契约支持 |
| `extensions` | [RenderRuleExtensions [t20]](#t20) | 可选 | 规则局部的类型化渲染扩展；在字段路径中则表示要素的扩展数据组。 | 本包未写入 | 当前契约支持 |

<a id="t133"></a>

## t133 · RenderPriority

首次类型入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].conditionalOverrides[].priority`。本包实例：`/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/priority`，完整 JSON 第 1225–1228 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `mode` | `"add"` / `"replace"` | 必填 | 当前联合结构的分支选择器；先看 mode，再解释其余字段。 | `"replace"`；行 1226，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/priority/mode` | 当前契约支持 |
| `base` | number | 可选 | 显示权重或优先分数的基础值。 | `0`；行 1227，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0/priority/base` | 当前契约支持 |
| `metric` | [$.nodes[].geometryProfiles.Point.label.collision.metric [t113]](#t113) | 可选 | 按面积、长度、部件数或字段值计算的指标贡献。 | `{"kind":"area","multiplier":1,"divisor":10,"rounding":"floor","min":0,"max":999}`；行 1361，Pointer `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/1/priority/metric` | 当前契约支持 |

<a id="t134"></a>

## t134 · AdvancedRenderRule

首次类型入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].advanced`。本包没有此结构的实际实例；可能是可选功能或兼容分支。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `predicates` | [Record [t135]](#t135) | 可选 | 旧兼容谓词信息，不是可执行 JavaScript。 | 本包未写入 | 当前契约支持 |
| `visibility` | [Record [t135]](#t135) | 可选 | 关系可见性扩展，或附属结构显示策略。 | 本包未写入 | 当前契约支持 |
| `geometry` | [Record [t135]](#t135) | 可选 | 当前绘制的几何类型、几何输入继承选项或输出几何设置。 | 本包未写入 | 当前契约支持 |
| `symbol` | [Record [t135]](#t135) | 可选 | 交互点标记配置；并非源几何坐标。 | 本包未写入 | 当前契约支持 |
| `label` | [Record [t135]](#t135) | 可选 | 名称对象或 Label 样式对象；必须结合所在路径解读。 | 本包未写入 | 当前契约支持 |
| `collision` | [Record [t135]](#t135) | 可选 | Label 碰撞角色或详细碰撞扩展；不控制真实几何层级。 | 本包未写入 | 当前契约支持 |
| `selection` | [Record [t135]](#t135) | 可选 | 旧兼容选中状态信息。 | 本包未写入 | 当前契约支持 |
| `specialLogic` | 数组＜string＞ | 可选 | 旧兼容特殊显示键列表。 | 本包未写入 | 当前契约支持 |
| `legacyRuntime` | [$.nodes[].geometryProfiles.Point.zoomPriority.rules[].advanced.legacyRuntime [t136]](#t136) | 可选 | 旧渲染执行器保留策略声明。 | 本包未写入 | 兼容/迁移保留 |

<a id="t135"></a>

## t135 · Record

首次类型入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].advanced.predicates`。本包实例：`/nodes/0/legacy/source`，完整 JSON 第 1898–2231 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| 【自定义键】 | 任意 JSON（仍受模块语义约束） | 按使用方约定 | 此对象是字典，键名可变；不代表任意位置均接受新属性。 | 见该对象实际内容 | 当前契约支持 |

<a id="t136"></a>

## t136 · $.nodes[].geometryProfiles.Point.zoomPriority.rules[].advanced.legacyRuntime

首次类型入口：`$.nodes[].geometryProfiles.Point.zoomPriority.rules[].advanced.legacyRuntime`。本包没有此结构的实际实例；可能是可选功能或兼容分支。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `preserveFallback` | boolean：true / false | 可选 | 旧渲染执行器是否保留回退行为。 | 本包未写入 | 当前契约支持 |
| `sourceRuleName` | string | 可选 | 旧规则来源名称。 | 本包未写入 | 当前契约支持 |

<a id="t137"></a>

## t137 · $.nodes[].geometryProfiles.Point.interaction

首次类型入口：`$.nodes[].geometryProfiles.Point.interaction`。本包实例：`/nodes/0/geometryProfiles/Polygon/interaction`，完整 JSON 第 1178–1186 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `triggers` | [GeometryInteractionTriggers [t131]](#t131) | 必填 | 可触发交互的命中区域集合。 | `{"label":true,"point":false,"line":false,"boundary":false,"interior":false}`；行 1179，Pointer `/nodes/0/geometryProfiles/Polygon/interaction/triggers` | 当前契约支持 |

<a id="t138"></a>

## t138 · $.nodes[].geometryProfiles.Point.legacyDisplay

首次类型入口：`$.nodes[].geometryProfiles.Point.legacyDisplay`。本包没有此结构的实际实例；可能是可选功能或兼容分支。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `ruleIds` | 数组＜string＞ | 必填 | 旧显示规则 ID 列表。 | 本包未写入 | 当前契约支持 |
| `profileIds` | 数组＜string＞ | 必填 | 旧显示预设 ID 列表。 | 本包未写入 | 当前契约支持 |
| `specialLogicKeys` | 数组＜string＞ | 必填 | 旧特殊显示逻辑键列表。 | 本包未写入 | 当前契约支持 |

<a id="t139"></a>

## t139 · ContainmentBinding

首次类型入口：`$.nodes[].containment`。本包没有此结构的实际实例；可能是可选功能或兼容分支。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `enabled` | boolean | 必填 | 启用标记；false 不等于删除定义，具体作用范围取决于所在模块。 | 本包未写入 | 当前契约支持 |
| `role` | `"parent"` / `"child"` | 可选 | 结构身份或 Label 碰撞角色；二者是不同概念。 | 本包未写入 | 当前契约支持 |
| `parentReferenceField` | string | 可选 | 旧附属结构指向主结构的字段。 | 本包未写入 | 当前契约支持 |
| `viewProfileKey` | string | 可选 | 旧上下文视图预设键。 | 本包未写入 | 当前契约支持 |

<a id="t140"></a>

## t140 · $.nodes[].card

首次类型入口：`$.nodes[].card`。本包实例：`/nodes/0/card`，完整 JSON 第 1581–1891 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `mode` | `"fields"` | 必填 | 当前联合结构的分支选择器；先看 mode，再解释其余字段。 | `"fields"`；行 1582，Pointer `/nodes/0/card/mode` | 当前契约支持 |
| `items` | 数组＜[CardItem [t141]](#t141)＞ | 必填 | 当前模块的项目数组；项目结构由所在类型说明。 | `[{"id":"BUD-classification-card","source":"Class","visible":true,"renderer":"text","section":"main","label":{"zh":"类型","en":""},"options":{"format":"c…（摘要）`；行 1583，Pointer `/nodes/0/card/items` | 当前契约支持 |
| `remaining` | [$.nodes[].card.remaining [t146]](#t146) | 可选 | 信息卡未明确列出的其余字段的显示规则。 | `{"enabled":true,"section":"other","includeSystem":true,"order":"record","hideWhenEmpty":false,"maxDepth":3,"maxArrayLength":50,"exclude":["CoordP","Co…（摘要）`；行 1853，Pointer `/nodes/0/card/remaining` | 当前契约支持 |

<a id="t141"></a>

## t141 · CardItem

首次类型入口：`$.nodes[].card.items[]`。本包实例：`/nodes/0/card/items/0`，完整 JSON 第 1584–1597 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `id` | string | 必填 | 当前对象的稳定标识；唯一性范围取决于对象类型。 | `"BUD-classification-card"`；行 1585，Pointer `/nodes/0/card/items/0/id` | 当前契约支持 |
| `fieldBinding` | [FieldDefinitionRef [t142]](#t142) | 可选 | 信息卡单元实时绑定字段设计的 nodeId+fieldId 引用。 | 本包未写入 | 当前契约支持 |
| `optionsFieldRef` | [FieldDefinitionRef [t142]](#t142) | 可选 | 仅对照表实时绑定到指定字段 nodeId+fieldId。 | 本包未写入 | 当前契约支持 |
| `optionsTableId` | string | 可选 | 实时引用公共表 lookupTables[].id，不保存独立可编辑副本。 | 本包未写入 | 当前契约支持 |
| `optionTable` | [OptionTable [t48]](#t48) | 可选 | 当前模块本地对照表；含 valueType 和 rows。 | 本包未写入 | 当前契约支持 |
| `optionValueType` | `"string"` / `"number"` / `"boolean"` | 可选 | 选项保存为文本、数字或布尔值；value 文本会按此解释。 | 本包未写入 | 当前契约支持 |
| `inheritFrom` | [$.nodes[].card.items[].inheritFrom [t143]](#t143) | 可选 | 信息卡继承来源的 nodeId+itemId 引用。 | `{"nodeId":"class-bud","itemId":"BUD-classification-card"}`；行 2710，Pointer `/nodes/1/card/items/0/inheritFrom` | 当前契约支持 |
| `prefillAudit` | [PrefillAudit [t104]](#t104) | 可选 | 预填来源的审计指纹；只用于提醒陈旧，不建立运行时绑定。 | `{"source":{"path":{"class":"BUD"},"fieldId":"BUD-registry-tags.nomenclator","key":"tags.nomenclator"},"fingerprint":"field-v1-a7beef1ad8a57754"}`；行 1609，Pointer `/nodes/0/card/items/1/prefillAudit` | 当前契约支持 |
| `source` | string | 必填 | 信息卡单元读取的本记录字段路径，如 direction 或 extensions.link.wiki。 | `"Class"`；行 1586，Pointer `/nodes/0/card/items/0/source` | 当前契约支持 |
| `fallbackSources` | 数组＜string＞ | 可选 | 主来源无文字时依序尝试的备用字段路径。 | `["Height"]`；行 92682，Pointer `/nodes/78/card/items/1/fallbackSources` | 当前契约支持 |
| `afterRemaining` | boolean：true / false | 可选 | 此信息卡单元排列在剩余字段区域之后。 | `true`；行 1809，Pointer `/nodes/0/card/items/10/afterRemaining` | 当前契约支持 |
| `visible` | boolean | 必填 | 是否显示该 Label 或信息卡单元。 | `true`；行 1587，Pointer `/nodes/0/card/items/0/visible` | 当前契约支持 |
| `renderer` | `"text"` / `"nameColorCapsule"` / `"lineChips"` / `"tag"` / `"colorCapsule"` / `"relationLink"` / `"media"` | 必填 | 信息卡单元受控显示器：文字、链接、胶囊、媒体等。 | `"text"`；行 1588，Pointer `/nodes/0/card/items/0/renderer` | 当前契约支持 |
| `section` | `"main"` / `"other"` | 可选 | 信息卡主要/其他信息分区。 | `"main"`；行 1589，Pointer `/nodes/0/card/items/0/section` | 当前契约支持 |
| `hideWhenEmpty` | boolean：true / false | 可选 | 值为空时是否隐藏当前信息卡单元或剩余字段。 | `true`；行 1603，Pointer `/nodes/0/card/items/1/hideWhenEmpty` | 当前契约支持 |
| `label` | [LocalizedText [t1]](#t1) | 可选 | 名称对象或 Label 样式对象；必须结合所在路径解读。 | `{"zh":"类型","en":""}`；行 1590，Pointer `/nodes/0/card/items/0/label` | 当前契约支持 |
| `labelMode` | `"field"` / `"override"` | 可选 | 旧信息卡标题来源模式；不等于新字段绑定本身。 | 本包未写入 | 当前契约支持 |
| `valueMode` | `"field"` / `"override"` | 可选 | 原值、意义对照或外部引用显示模式；不同模块枚举不同。 | 本包未写入 | 当前契约支持 |
| `valueOptions` | 数组＜[SelectOption [t42]](#t42)＞ | 可选 | 搜索副标题或旧信息卡本地意义对照行。 | 本包未写入 | 当前契约支持 |
| `options` | [$.nodes[].card.items[].options [t144]](#t144) | 可选 | 控件本地选项数组、组件设置对象等；不能跨对象套用。 | `{"format":"classification"}`；行 1594，Pointer `/nodes/0/card/items/0/options` | 当前契约支持 |
| `relation` | [CardRelation [t145]](#t145) | 可选 | 条件行连接关系 AND/OR/NOT，或信息卡关系显示配置。 | `{"targetMatchField":"ID","targetDisplayField":"Name","multiple":false,"fallbackDisplay":"raw","clickable":true,"targetRole":"main"}`；行 7055，Pointer `/nodes/5/card/items/1/relation` | 当前契约支持 |

<a id="t142"></a>

## t142 · FieldDefinitionRef

首次类型入口：`$.nodes[].card.items[].fieldBinding`。本包没有此结构的实际实例；可能是可选功能或兼容分支。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `nodeId` | string | 必填 | 分类节点稳定 ID；children 与字段引用通过它定位。 | 本包未写入 | 当前契约支持 |
| `fieldId` | string | 必填 | 字段稳定身份；同一有效分类内不同 key 不得共用它。 | 本包未写入 | 当前契约支持 |

<a id="t143"></a>

## t143 · $.nodes[].card.items[].inheritFrom

首次类型入口：`$.nodes[].card.items[].inheritFrom`。本包实例：`/nodes/1/card/items/0/inheritFrom`，完整 JSON 第 2710–2713 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `nodeId` | string | 必填 | 分类节点稳定 ID；children 与字段引用通过它定位。 | `"class-bud"`；行 2711，Pointer `/nodes/1/card/items/0/inheritFrom/nodeId` | 当前契约支持 |
| `itemId` | string | 必填 | 信息卡来源单元的稳定 ID。 | `"BUD-classification-card"`；行 2712，Pointer `/nodes/1/card/items/0/inheritFrom/itemId` | 当前契约支持 |

<a id="t144"></a>

## t144 · $.nodes[].card.items[].options

首次类型入口：`$.nodes[].card.items[].options`。本包实例：`/nodes/0/card/items/0/options`，完整 JSON 第 1594–1596 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `colorSource` | string | 可选 | 信息卡胶囊读取颜色的字段路径。 | `"color"`；行 72401，Pointer `/nodes/65/card/items/1/options/colorSource` | 当前契约支持 |
| `nameSource` | string | 可选 | 信息卡胶囊读取名称的字段路径。 | 本包未写入 | 当前契约支持 |
| `fallbackColor` | string | 可选 | 主颜色来源无效时使用的回退颜色。 | `"#999999"`；行 72402，Pointer `/nodes/65/card/items/1/options/fallbackColor` | 当前契约支持 |
| `tagColor` | string | 可选 | 信息卡标签的固定颜色。 | 本包未写入 | 当前契约支持 |
| `mediaSource` | `"picture-index"` / `"external-url"` | 可选 | 媒体来自图片索引还是外部 URL。 | 本包未写入 | 当前契约支持 |
| `lineChipSource` | `"platform"` / `"station"` / `"stationBuilding"` | 可选 | 关联线路胶囊索引入口：站台、站场或车站建筑。 | `"platform"`；行 69787，Pointer `/nodes/64/card/items/1/options/lineChipSource` | 当前契约支持 |
| `format` | `"boolean"` / `"plain"` / `"externalLink"` / `"date"` / `"enum"` / `"json"` / `"classification"` / `"world"` | 可选 | 字段/显示格式；只允许当前类型枚举中的受控格式。 | `"classification"`；行 1595，Pointer `/nodes/0/card/items/0/options/format` | 当前契约支持 |
| `linkText` | `"raw"` / `"href"` | 可选 | 外链显示原值或实际 href。 | `"href"`；行 1765，Pointer `/nodes/0/card/items/8/options/linkText` | 当前契约支持 |

<a id="t145"></a>

## t145 · CardRelation

首次类型入口：`$.nodes[].card.items[].relation`。本包实例：`/nodes/5/card/items/1/relation`，完整 JSON 第 7055–7062 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `targetRole` | `"main"` | 可选 | 按通用主结构身份找目标，当前可选 main。 | `"main"`；行 7061，Pointer `/nodes/5/card/items/1/relation/targetRole` | 当前契约支持 |
| `targetClassification` | [ClassificationPath [t16]](#t16) | 可选 | 信息卡关系显示的目标分类范围。 | `{"class":"ISG","kind":"NGF"}`；行 7086，Pointer `/nodes/5/card/items/2/relation/targetClassification` | 当前契约支持 |
| `targetMatchField` | string | 可选 | 关联目标记录的匹配字段。 | `"ID"`；行 7056，Pointer `/nodes/5/card/items/1/relation/targetMatchField` | 当前契约支持 |
| `targetDisplayField` | string | 可选 | 关联目标记录的显示字段。 | `"Name"`；行 7057，Pointer `/nodes/5/card/items/1/relation/targetDisplayField` | 当前契约支持 |
| `clickable` | boolean：true / false | 可选 | 关系目标是否可以点击定位或查看。 | `true`；行 7060，Pointer `/nodes/5/card/items/1/relation/clickable` | 当前契约支持 |
| `multiple` | boolean：true / false | 可选 | 当前关系是否多目标，或当前绘制页是否允许多部件/多点。 | `false`；行 7058，Pointer `/nodes/5/card/items/1/relation/multiple` | 当前契约支持 |
| `sourceValuePath` | string | 可选 | 关联值是数组/对象时，提取目标 ID 的内部路径。 | 本包未写入 | 当前契约支持 |
| `fallbackDisplay` | `"raw"` / `"unknown"` | 可选 | 目标不存在时显示原值或未知提示。 | `"raw"`；行 7059，Pointer `/nodes/5/card/items/1/relation/fallbackDisplay` | 当前契约支持 |

<a id="t146"></a>

## t146 · $.nodes[].card.remaining

首次类型入口：`$.nodes[].card.remaining`。本包实例：`/nodes/0/card/remaining`，完整 JSON 第 1853–1890 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `enabled` | boolean | 必填 | 启用标记；false 不等于删除定义，具体作用范围取决于所在模块。 | `true`；行 1854，Pointer `/nodes/0/card/remaining/enabled` | 当前契约支持 |
| `section` | `"main"` / `"other"` | 必填 | 信息卡主要/其他信息分区。 | `"other"`；行 1855，Pointer `/nodes/0/card/remaining/section` | 当前契约支持 |
| `includeSystem` | boolean | 必填 | 剩余字段中是否包含系统字段。 | `true`；行 1856，Pointer `/nodes/0/card/remaining/includeSystem` | 当前契约支持 |
| `exclude` | 数组＜string＞ | 可选 | 剩余字段中排除的字段路径。 | `["CoordP","CoordL","CoordG","Conpoints","Flrpoints","PLpoints","Linepoints","coordinate","UpdateTime","updateTime","UpdateBy","updateBy","Class","Kind…（摘要）`；行 1861，Pointer `/nodes/0/card/remaining/exclude` | 当前契约支持 |
| `hideWhenEmpty` | boolean：true / false | 可选 | 值为空时是否隐藏当前信息卡单元或剩余字段。 | `false`；行 1858，Pointer `/nodes/0/card/remaining/hideWhenEmpty` | 当前契约支持 |
| `order` | `"record"` / `"alphabetical"` | 可选 | 剩余字段按记录顺序或字母顺序排列。 | `"record"`；行 1857，Pointer `/nodes/0/card/remaining/order` | 当前契约支持 |
| `maxDepth` | number | 可选 | 剩余字段对象展开的深度上限。 | `3`；行 1859，Pointer `/nodes/0/card/remaining/maxDepth` | 当前契约支持 |
| `maxArrayLength` | number | 可选 | 剩余字段数组展开的项目数上限。 | `50`；行 1860，Pointer `/nodes/0/card/remaining/maxArrayLength` | 当前契约支持 |

<a id="t147"></a>

## t147 · $.nodes[].card

首次类型入口：`$.nodes[].card`。本包没有此结构的实际实例；可能是可选功能或兼容分支。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `mode` | `"layout"` | 必填 | 当前联合结构的分支选择器；先看 mode，再解释其余字段。 | 本包未写入 | 当前契约支持 |
| `layoutId` | string | 必填 | 受控信息卡布局 ID。 | 本包未写入 | 当前契约支持 |
| `options` | [Record [t135]](#t135) | 可选 | 控件本地选项数组、组件设置对象等；不能跨对象套用。 | 本包未写入 | 当前契约支持 |

<a id="t148"></a>

## t148 · $.nodes[].card

首次类型入口：`$.nodes[].card`。本包实例：`/nodes/85/card`，完整 JSON 第 99974–99977 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `mode` | `"component"` | 必填 | 当前联合结构的分支选择器；先看 mode，再解释其余字段。 | `"component"`；行 99975，Pointer `/nodes/85/card/mode` | 当前契约支持 |
| `componentKey` | string | 必填 | 已登记代码组件/外部工作流的稳定键。 | `"TRP"`；行 99976，Pointer `/nodes/85/card/componentKey` | 当前契约支持 |
| `options` | [Record [t135]](#t135) | 可选 | 控件本地选项数组、组件设置对象等；不能跨对象套用。 | 本包未写入 | 当前契约支持 |

<a id="t149"></a>

## t149 · $.nodes[].legacy

首次类型入口：`$.nodes[].legacy`。本包实例：`/nodes/0/legacy`，完整 JSON 第 1892–2232 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `classCode` | string | 必填 | 旧式 Class 过滤列表或字段引用的 Class 目标；先看所属结构。 | `"BUD"`；行 1893，Pointer `/nodes/0/legacy/classCode` | 当前契约支持 |
| `displayRuleIds` | 数组＜string＞ | 必填 | 分类对应的旧显示规则 ID 列表。 | `["BUD-building-structure"]`；行 1894，Pointer `/nodes/0/legacy/displayRuleIds` | 当前契约支持 |
| `cardLayoutId` | string | 可选 | 分类对应的旧信息卡布局 ID。 | `"building-card"`；行 1897，Pointer `/nodes/0/legacy/cardLayoutId` | 当前契约支持 |
| `specialCardKey` | string | 可选 | 分类对应的旧特殊信息卡组件键。 | 本包未写入 | 当前契约支持 |
| `source` | [Record [t135]](#t135) | 可选 | 信息卡字段来源、图标来源、预填来源或对齐文件位置；结合路径区分。 | `{"schemaVersion":"cairnmap.class.v1","projectId":"openriamap-ria","runtimeStatus":"active","classCode":"BUD","classKey":"building","sourceFeatureKey":…（摘要）`；行 1898，Pointer `/nodes/0/legacy/source` | 当前契约支持 |

<a id="t150"></a>

## t150 · ContextBinding

首次类型入口：`$.contextBindings[]`。本包没有此结构的实际实例；可能是可选功能或兼容分支。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `id` | string | 必填 | 当前对象的稳定标识；唯一性范围取决于对象类型。 | 本包未写入 | 当前契约支持 |
| `label` | [LocalizedText [t1]](#t1) | 必填 | 名称对象或 Label 样式对象；必须结合所在路径解读。 | 本包未写入 | 当前契约支持 |
| `host` | [ContextBindingEndpoint [t151]](#t151) | 必填 | 旧上下文关系的主结构端点。 | 本包未写入 | 当前契约支持 |
| `member` | [ContextBindingEndpoint [t151]](#t151) | 必填 | 旧上下文关系的附属结构端点。 | 本包未写入 | 当前契约支持 |
| `memberSelectorField` | string | 可选 | 旧上下文关系中成员的层级选择字段。 | 本包未写入 | 当前契约支持 |
| `enabled` | boolean | 必填 | 启用标记；false 不等于删除定义，具体作用范围取决于所在模块。 | 本包未写入 | 当前契约支持 |
| `profile` | `"default"` / `"keep-host-context"` / `"show-active-member-only"` | 必填 | 沿线文字预设或主附属上下文显示预设；由所在对象区分。 | 本包未写入 | 当前契约支持 |

<a id="t151"></a>

## t151 · ContextBindingEndpoint

首次类型入口：`$.contextBindings[].host`。本包没有此结构的实际实例；可能是可选功能或兼容分支。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `classification` | [ClassificationPath [t16]](#t16) | 必填 | 工作流输出或关系端点的分类范围。 | 本包未写入 | 当前契约支持 |
| `referenceField` | string | 必填 | 关系端点所持的对应记录引用字段。 | 本包未写入 | 当前契约支持 |

<a id="t152"></a>

## t152 · WorkflowDefinition

首次类型入口：`$.workflows[]`。本包实例：`/workflows/0`，完整 JSON 第 107990–108017 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `id` | string | 必填 | 当前对象的稳定标识；唯一性范围取决于对象类型。 | `"external-railway-integrated"`；行 107991，Pointer `/workflows/0/id` | 当前契约支持 |
| `label` | [LocalizedText [t1]](#t1) | 必填 | 名称对象或 Label 样式对象；必须结合所在路径解读。 | `{"zh":"铁路一体工作流","en":"railway-integrated"}`；行 107992，Pointer `/workflows/0/label` | 当前契约支持 |
| `mode` | `"external"` / `"composed"` | 必填 | 当前联合结构的分支选择器；先看 mode，再解释其余字段。 | `"external"`；行 107996，Pointer `/workflows/0/mode` | 当前契约支持 |
| `quickMapping` | boolean：true / false | 可选 | 是否允许此工作流从便捷测绘采集入口选用。 | `false`；行 113203，Pointer `/workflows/20/quickMapping` | 当前契约支持 |
| `editor` | [$.workflows[].editor [t153]](#t153) | 可选 | 工作流式编辑方案设置，或字段是否可在编辑场景使用。 | `{"enabled":true}`；行 108284，Pointer `/workflows/3/editor` | 当前契约支持 |
| `actor` | [$.workflows[].actor [t155]](#t155) | 可选 | 填写人页要求；运行时收集填写人。 | `{"required":true}`；行 113214，Pointer `/workflows/20/actor` | 当前契约支持 |
| `target` | [ClassificationPath [t16]](#t16) | 可选 | 目标分类范围，或输出赋值的目标字段路径；二者不能混用。 | `{"class":"ISG","kind":"NGF","skind":"LAD"}`；行 108101，Pointer `/workflows/3/target` | 当前契约支持 |
| `steps` | 数组＜[WorkflowStep [t156]](#t156)＞ | 必填 | 工作流页面数组，顺序即页面执行顺序。 | `[]`；行 107997，Pointer `/workflows/0/steps` | 当前契约支持 |
| `outputs` | 数组＜[WorkflowOutput [t171]](#t171)＞ | 必填 | 工作流输出要素数组；每个原生输出对应一张输出绘制页。 | `[]`；行 107998，Pointer `/workflows/0/outputs` | 当前契约支持 |
| `assignments` | 数组＜[WorkflowAssignment [t172]](#t172)＞ | 可选 | 输出组装规则数组；将槽位/公式结果写入真实数据字段。 | 本包未写入 | 当前契约支持 |
| `external` | [$.workflows[].external [t174]](#t174) | 可选 | 已完成外部工作流单元的受控入口配置。 | `{"componentKey":"railwayWorkflow","reason":"railway-integrated","coveredClassifications":[{"class":"RLE"}],"purpose":"capture"}`；行 107999，Pointer `/workflows/0/external` | 当前契约支持 |
| `legacy` | [$.workflows[].legacy [t175]](#t175) | 可选 | 迁移来源及兼容元数据，不应作为新功能的主要入口。 | `{"componentKey":"railwayWorkflow","source":{"coveredWorkflowIds":["rail-line-workflow"]}}`；行 108009，Pointer `/workflows/0/legacy` | 兼容/迁移保留 |

<a id="t153"></a>

## t153 · $.workflows[].editor

首次类型入口：`$.workflows[].editor`。本包实例：`/workflows/3/editor`，完整 JSON 第 108284–108286 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `enabled` | boolean | 必填 | 启用标记；false 不等于删除定义，具体作用范围取决于所在模块。 | `true`；行 108285，Pointer `/workflows/3/editor/enabled` | 当前契约支持 |
| `dedicated` | boolean：true / false | 可选 | 是否为专供再次编辑的工作流。 | `true`；行 113206，Pointer `/workflows/20/editor/dedicated` | 当前契约支持 |
| `scope` | [ClassificationPath [t16]](#t16) | 可选 | 字段根/标签/扩展分组，或编辑工作流适用范围等。 | `{"class":"STA"}`；行 113207，Pointer `/workflows/20/editor/scope` | 当前契约支持 |
| `backfill` | 数组＜[$.workflows[].editor.backfill[] [t154]](#t154)＞ | 可选 | 编辑工作流的显式数据回灌映射。 | 本包未写入 | 当前契约支持 |

<a id="t154"></a>

## t154 · $.workflows[].editor.backfill[]

首次类型入口：`$.workflows[].editor.backfill[]`。本包没有此结构的实际实例；可能是可选功能或兼容分支。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `slot` | string | 必填 | 工作流运行中的信息槽位名；不是最终记录字段名。 | 本包未写入 | 当前契约支持 |
| `target` | string | 必填 | 目标分类范围，或输出赋值的目标字段路径；二者不能混用。 | 本包未写入 | 当前契约支持 |

<a id="t155"></a>

## t155 · $.workflows[].actor

首次类型入口：`$.workflows[].actor`。本包实例：`/workflows/20/actor`，完整 JSON 第 113214–113216 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `required` | boolean | 必填 | 是否必填；系统 World 设置中固定为 true，其他位置按控件或字段解释。 | `true`；行 113215，Pointer `/workflows/20/actor/required` | 当前契约支持 |

<a id="t156"></a>

## t156 · WorkflowStep

首次类型入口：`$.workflows[].steps[]`。本包实例：`/workflows/3/steps/0`，完整 JSON 第 108107–108114 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `id` | string | 必填 | 当前对象的稳定标识；唯一性范围取决于对象类型。 | `"isg_ngf_lad-actor"`；行 108108，Pointer `/workflows/3/steps/0/id` | 当前契约支持 |
| `kind` | `"geometry"` / `"actor"` / `"form"` / `"tagsExtensions"` / `"special"` | 必填 | 分类路径第二级，或条件/控件的分支种类；依所在对象判读。 | `"actor"`；行 108109，Pointer `/workflows/3/steps/0/kind` | actor/form/geometry 为当前主用；其他枚举含兼容项 |
| `label` | [LocalizedText [t1]](#t1) | 必填 | 名称对象或 Label 样式对象；必须结合所在路径解读。 | `{"zh":"填写人","en":"Author"}`；行 108110，Pointer `/workflows/3/steps/0/label` | 当前契约支持 |
| `subtitle` | [LocalizedText [t1]](#t1) | 可选 | 搜索结果副标题设置，或工作流页面副标题。 | 本包未写入 | 当前契约支持 |
| `controls` | 数组＜[WorkflowControl [t157]](#t157)＞ | 可选 | 当前页的信息收集控件数组。 | `[{"id":"isg_ngf_lad-classification","kind":"classificationPicker","columns":1,"label":{"zh":"类型（Kind=NGF, SKind=LAD）","en":""},"classificationScope":{…（摘要）`；行 108122，Pointer `/workflows/3/steps/1/controls` | 当前契约支持 |
| `geometry` | 数组＜`"Point"` / `"LineString"` / `"Polygon"`＞ | 可选 | 当前绘制的几何类型、几何输入继承选项或输出几何设置。 | `["Polygon"]`；行 108222，Pointer `/workflows/3/steps/2/geometry` | 当前契约支持 |
| `outputId` | string | 可选 | 绘制页、系统分类控件或绑定所对应的工作流输出 ID。 | `"isg_ngf_lad-output-1"`；行 108221，Pointer `/workflows/3/steps/2/outputId` | 当前契约支持 |
| `geometryRole` | `"output"` / `"auxiliary"` | 可选 | 此绘制页是输出要素几何还是额外辅助绘制。 | `"output"`；行 108235，Pointer `/workflows/3/steps/2/geometryRole` | 当前契约支持 |
| `when` | [WorkflowValueCondition [t160]](#t160) | 可选 | 当前规则/模块生效条件；渲染、工作流和旧条件数组语法不同。 | `{"token":"F","operator":"empty"}`；行 112782，Pointer `/workflows/18/steps/3/when` | 当前契约支持 |
| `specialKey` | string | 可选 | 旧特殊工作流页面键。 | 本包未写入 | 当前契约支持 |
| `tagsExtensions` | [$.workflows[].steps[].tagsExtensions [t167]](#t167) | 可选 | 工作流标签与扩展固定单元的启用设置。 | 本包未写入 | 当前契约支持 |
| `drawing` | [$.workflows[].steps[].drawing [t168]](#t168) | 可选 | 当前绘制页的返回格式、槽位、条件与字段绑定设置。 | `{"enabledFromThisPage":true,"keepDrawingWhenBack":true,"multiple":true}`；行 108229，Pointer `/workflows/3/steps/2/drawing` | 当前契约支持 |
| `legacyPage` | [Record [t135]](#t135) | 可选 | 旧工作流页面内容的兼容保留信息。 | 本包未写入 | 兼容/迁移保留 |

<a id="t157"></a>

## t157 · WorkflowControl

首次类型入口：`$.workflows[].steps[].controls[]`。本包实例：`/workflows/3/steps/1/controls/0`，完整 JSON 第 108123–108139 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `optionTable` | [OptionTable [t48]](#t48) | 可选 | 当前模块本地对照表；含 valueType 和 rows。 | `{"valueType":"number","rows":[{"value":"0","label":{"zh":"下行","en":""}},{"value":"1","label":{"zh":"上行","en":""}},{"value":"2","label":{"zh":"其他","en"…（摘要）`；行 113730，Pointer `/workflows/22/steps/1/controls/4/optionTable` | 当前契约支持 |
| `optionsFieldRef` | [FieldDefinitionRef [t142]](#t142) | 可选 | 仅对照表实时绑定到指定字段 nodeId+fieldId。 | 本包未写入 | 当前契约支持 |
| `prefillAudit` | [PrefillAudit [t104]](#t104) | 可选 | 预填来源的审计指纹；只用于提醒陈旧，不建立运行时绑定。 | `{"source":{"path":{"class":"RLE"},"fieldId":"RLE-direction","key":"direction"},"fingerprint":"field-v1-c161763758c61745"}`；行 113720，Pointer `/workflows/22/steps/1/controls/4/prefillAudit` | 当前契约支持 |
| `prefillField` | string | 可选 | 单次预填后留下的本地目标字段提示，不是实时来源引用。 | 本包未写入 | 当前契约支持 |
| `id` | string | 必填 | 当前对象的稳定标识；唯一性范围取决于对象类型。 | `"isg_ngf_lad-classification"`；行 108124，Pointer `/workflows/3/steps/1/controls/0/id` | 当前契约支持 |
| `slot` | string | 可选 | 工作流运行中的信息槽位名；不是最终记录字段名。 | `"A"`；行 108142，Pointer `/workflows/3/steps/1/controls/1/slot` | 当前契约支持 |
| `valueNormalization` | `"number"` / `"none"` / `"trim"` / `"abbr"` | 可选 | 输入保存值处理：保留、去空白、简称或转数字。 | `"trim"`；行 108144，Pointer `/workflows/3/steps/1/controls/1/valueNormalization` | 当前契约支持 |
| `kind` | `"number"` / `"text"` / `"select"` / `"json"` / `"textarea"` / `"toggle"` / `"featureSearch"` / `"component"` / `"tagsExtensions"` / `"classificationPicker"` / `"coarseSearch"` / `"group"` / `"notice"` / `"runtimeValue"` | 必填 | 分类路径第二级，或条件/控件的分支种类；依所在对象判读。 | `"classificationPicker"`；行 108125，Pointer `/workflows/3/steps/1/controls/0/kind` | 当前契约支持 |
| `columns` | `3` / `2` / `1` | 必填 | 控件宽度档位：1 占整行，2 半行，3 三分之一行。 | `1`；行 108126，Pointer `/workflows/3/steps/1/controls/0/columns` | 当前契约支持 |
| `label` | [LocalizedText [t1]](#t1) | 必填 | 名称对象或 Label 样式对象；必须结合所在路径解读。 | `{"zh":"类型（Kind=NGF, SKind=LAD）","en":""}`；行 108127，Pointer `/workflows/3/steps/1/controls/0/label` | 当前契约支持 |
| `fieldSource` | [WorkflowFieldSource [t158]](#t158) | 可选 | 旧式字段来源快照和覆写列表；现代预填/绑定另有明确字段。 | 本包未写入 | 兼容/迁移保留 |
| `fieldFormat` | `"boolean"` / `"plain"` / `"externalLink"` / `"date"` / `"json"` | 可选 | 工作流控件的填写/显示格式提示。 | 本包未写入 | 当前契约支持 |
| `optionValueType` | `"string"` / `"number"` / `"boolean"` | 可选 | 选项保存为文本、数字或布尔值；value 文本会按此解释。 | `"number"`；行 113719，Pointer `/workflows/22/steps/1/controls/4/optionValueType` | 当前契约支持 |
| `requiredWhen` | 数组＜[WorkflowValueCondition [t160]](#t160)＞ | 可选 | 条件必填规则；字段和工作流使用不同的条件结构。 | 本包未写入 | 当前契约支持 |
| `options` | 数组＜[SelectOption [t42]](#t42)＞ | 可选 | 控件本地选项数组、组件设置对象等；不能跨对象套用。 | 本包未写入 | 当前契约支持 |
| `optionsTableId` | string | 可选 | 实时引用公共表 lookupTables[].id，不保存独立可编辑副本。 | 本包未写入 | 当前契约支持 |
| `optionSource` | [$.workflows[].steps[].controls[].optionSource [t161]](#t161) | 可选 | 旧 optionSets 的来源引用，原生 r8+ 不作为新公共表入口。 | 本包未写入 | 兼容/迁移保留 |
| `placeholder` | string | 可选 | 输入提示文字；不等于默认值，也不写入记录。 | `"仅建议使用字母/数字/下划线/短横线"`；行 108162，Pointer `/workflows/3/steps/1/controls/2/placeholder` | 当前契约支持 |
| `defaultValue` | 任意 JSON（仍受模块语义约束） | 可选 | 初始输入值；类型须与字段或控件格式相容。 | `""`；行 112589，Pointer `/workflows/18/steps/1/controls/3/defaultValue` | 当前契约支持 |
| `rows` | number | 可选 | 公共表/本地表的行数组，或文字控件行高；以所在类型区分。 | `4`；行 108200，Pointer `/workflows/3/steps/1/controls/5/rows` | 当前契约支持 |
| `search` | [SearchProfile [t162]](#t162) | 可选 | 分类搜索规则、工作流搜索控件参数或应用搜索偏好。 | `{"target":{"class":"ISG","kind":"NGF"},"queryFields":["ID","Name"],"displayTemplate":"{{ID}} ({{Name}})","returnField":"ID","matcher":"contains","minQ…（摘要）`；行 108382，Pointer `/workflows/4/steps/1/controls/4/search` | 当前契约支持 |
| `classificationScope` | [ClassificationPath [t16]](#t16) | 可选 | 系统分类控件可选择的分类范围。 | `{"class":"ISG","kind":"NGF","skind":"LAD"}`；行 108131，Pointer `/workflows/3/steps/1/controls/0/classificationScope` | 当前契约支持 |
| `outputId` | string | 可选 | 绘制页、系统分类控件或绑定所对应的工作流输出 ID。 | `"isg_ngf_lad-output-1"`；行 108136，Pointer `/workflows/3/steps/1/controls/0/outputId` | 当前契约支持 |
| `required` | boolean：true / false | 可选 | 是否必填；系统 World 设置中固定为 true，其他位置按控件或字段解释。 | `true`；行 108137，Pointer `/workflows/3/steps/1/controls/0/required` | 当前契约支持 |
| `when` | [WorkflowValueCondition [t160]](#t160) | 可选 | 当前规则/模块生效条件；渲染、工作流和旧条件数组语法不同。 | 本包未写入 | 当前契约支持 |
| `systemManaged` | boolean：true / false | 可选 | 编辑器维护的固定单元标记，如分类控件与标签扩展单元。 | `true`；行 108138，Pointer `/workflows/3/steps/1/controls/0/systemManaged` | 当前契约支持 |
| `group` | [WorkflowRepeatGroup [t164]](#t164) | 可选 | 按钮视觉分组，或重复字段组定义。 | `{"optional":true,"addLabel":{"zh":"添加显式连接关系（ConnectL，可选）","en":""},"itemFields":[{"key":"mode","label":{"zh":"连接方式","en":""},"kind":"select","required…（摘要）`；行 112092，Pointer `/workflows/17/steps/1/controls/9/group` | 当前契约支持 |
| `tagsExtensions` | [$.workflows[].steps[].controls[].tagsExtensions [t166]](#t166) | 可选 | 工作流标签与扩展固定单元的启用设置。 | `{"tagsEnabled":true,"extensionsEnabled":true}`；行 108211，Pointer `/workflows/3/steps/1/controls/6/tagsExtensions` | 当前契约支持 |
| `componentKey` | string | 可选 | 已登记代码组件/外部工作流的稳定键。 | 本包未写入 | 当前契约支持 |
| `legacyBlock` | [Record [t135]](#t135) | 可选 | 旧工作流区块的兼容信息。 | 本包未写入 | 兼容/迁移保留 |

<a id="t158"></a>

## t158 · WorkflowFieldSource

首次类型入口：`$.workflows[].steps[].controls[].fieldSource`。本包没有此结构的实际实例；可能是可选功能或兼容分支。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `nodeId` | string | 必填 | 分类节点稳定 ID；children 与字段引用通过它定位。 | 本包未写入 | 当前契约支持 |
| `fieldId` | string | 必填 | 字段稳定身份；同一有效分类内不同 key 不得共用它。 | 本包未写入 | 当前契约支持 |
| `snapshot` | [Pick [t159]](#t159) | 必填 | 旧字段来源的快照，不会自动代表当前实时字段定义。 | 本包未写入 | 当前契约支持 |
| `overrides` | 数组＜string＞ | 必填 | 旧字段来源快照允许覆写的属性名列表。 | 本包未写入 | 当前契约支持 |

<a id="t159"></a>

## t159 · Pick

首次类型入口：`$.workflows[].steps[].controls[].fieldSource.snapshot`。本包没有此结构的实际实例；可能是可选功能或兼容分支。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `placeholder` | string | 可选 | 输入提示文字；不等于默认值，也不写入记录。 | 本包未写入 | 当前契约支持 |
| `reference` | [$.nodes[].fields[].reference [t99]](#t99) | 可选 | 字段的关联记录查找声明。 | 本包未写入 | 当前契约支持 |
| `required` | boolean：true / false | 可选 | 是否必填；系统 World 设置中固定为 true，其他位置按控件或字段解释。 | 本包未写入 | 当前契约支持 |
| `key` | string | 必填 | 真实数据字段路径或重复组成员键；不等于 fieldId。 | 本包未写入 | 当前契约支持 |
| `type` | `"string"` / `"number"` / `"boolean"` / `"enum"` / `"json"` / `"reference"` | 必填 | 数据类型，或受控组件选项的输入类型。 | 本包未写入 | 当前契约支持 |
| `cardinality` | `"single"` / `"multiple"` | 必填 | 字段值数量：single 单值，multiple 数组多值。 | 本包未写入 | 当前契约支持 |
| `labels` | [LocalizedText [t1]](#t1) | 必填 | 字段或分类的人类可读中英文标题。 | 本包未写入 | 当前契约支持 |
| `options` | 数组＜[SelectOption [t42]](#t42)＞ | 可选 | 控件本地选项数组、组件设置对象等；不能跨对象套用。 | 本包未写入 | 当前契约支持 |
| `optionValueType` | `"string"` / `"number"` / `"boolean"` | 可选 | 选项保存为文本、数字或布尔值；value 文本会按此解释。 | 本包未写入 | 当前契约支持 |
| `format` | `"boolean"` / `"plain"` / `"externalLink"` / `"date"` / `"json"` | 可选 | 字段/显示格式；只允许当前类型枚举中的受控格式。 | 本包未写入 | 当前契约支持 |
| `defaultValue` | 任意 JSON（仍受模块语义约束） | 可选 | 初始输入值；类型须与字段或控件格式相容。 | 本包未写入 | 当前契约支持 |
| `requiredWhen` | 数组＜[$.nodes[].fields[].requiredWhen[] [t91]](#t91) / [$.nodes[].fields[].requiredWhen[] [t92]](#t92) / [$.nodes[].fields[].requiredWhen[] [t93]](#t93) / [$.nodes[].fields[].requiredWhen[] [t94]](#t94) / [$.nodes[].fields[].requiredWhen[] [t95]](#t95) / [$.nodes[].fields[].requiredWhen[] [t96]](#t96)＞ | 可选 | 条件必填规则；字段和工作流使用不同的条件结构。 | 本包未写入 | 当前契约支持 |
| `input` | `"text"` / `"select"` / `"json"` / `"textarea"` / `"toggle"` / `"featureSearch"` | 必填 | 字段定义建议的输入方式；实际工作流控件仍有自身配置。 | 本包未写入 | 当前契约支持 |

<a id="t160"></a>

## t160 · WorkflowValueCondition

首次类型入口：`$.workflows[].steps[].controls[].requiredWhen[]`。本包实例：`/workflows/18/steps/3/when`，完整 JSON 第 112782–112785 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `token` | string | 必填 | 工作流条件引用的先前槽位/系统值名称。 | `"F"`；行 112783，Pointer `/workflows/18/steps/3/when/token` | 当前契约支持 |
| `operator` | `"in"` / `"present"` / `"empty"` / `"equals"` | 必填 | 单个字段/槽位条件的比较操作符。 | `"empty"`；行 112784，Pointer `/workflows/18/steps/3/when/operator` | 当前契约支持 |
| `value` | string / number / `false` / `true` | 可选 | 最终存储值、条件比较值或常量；是否字符串须看当前类型声明。 | 本包未写入 | 当前契约支持 |
| `values` | 数组＜string / number / `false` / `true`＞ | 可选 | 条件允许的比较值集合；严格比较时类型也须匹配。 | 本包未写入 | 当前契约支持 |
| `all` | 数组＜[WorkflowValueCondition [t160]](#t160)＞ | 可选 | 工作流条件数组全部成立才通过；不能与其他条件写法混淆。 | 本包未写入 | 当前契约支持 |
| `any` | 数组＜[WorkflowValueCondition [t160]](#t160)＞ | 可选 | 工作流条件数组至少一个成立才通过。 | 本包未写入 | 当前契约支持 |

<a id="t161"></a>

## t161 · $.workflows[].steps[].controls[].optionSource

首次类型入口：`$.workflows[].steps[].controls[].optionSource`。本包没有此结构的实际实例；可能是可选功能或兼容分支。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `registryKey` | string | 必填 | 旧登记表中的稳定选项 ID。 | 本包未写入 | 当前契约支持 |

<a id="t162"></a>

## t162 · SearchProfile

首次类型入口：`$.workflows[].steps[].controls[].search`。本包实例：`/workflows/4/steps/1/controls/4/search`，完整 JSON 第 108382–108398 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `target` | [ClassificationPath [t16]](#t16) | 必填 | 目标分类范围，或输出赋值的目标字段路径；二者不能混用。 | `{"class":"ISG","kind":"NGF"}`；行 108383，Pointer `/workflows/4/steps/1/controls/4/search/target` | 当前契约支持 |
| `targetRole` | `"main"` | 可选 | 按通用主结构身份找目标，当前可选 main。 | `"main"`；行 111727，Pointer `/workflows/16/steps/1/controls/5/search/targetRole` | 当前契约支持 |
| `queryFields` | 数组＜string＞ | 可选 | 可被主页/导航粗搜索匹配的字段路径列表。 | `["ID","Name"]`；行 108387，Pointer `/workflows/4/steps/1/controls/4/search/queryFields` | 当前契约支持 |
| `displayTemplate` | string | 可选 | 搜索候选展示模板；使用 {{ID}} 等双花括号，占位语法不同于 Label。 | `"{{ID}} ({{Name}})"`；行 108391，Pointer `/workflows/4/steps/1/controls/4/search/displayTemplate` | 当前契约支持 |
| `returnField` | string | 可选 | 工作流搜索最终返回的目标字段。 | `"ID"`；行 108392，Pointer `/workflows/4/steps/1/controls/4/search/returnField` | 当前契约支持 |
| `matcher` | `"contains"` / `"prefix"` / `"token"` / `"fuzzy"` | 可选 | contains/prefix/token/fuzzy 等受控搜索匹配方式。 | `"contains"`；行 108393，Pointer `/workflows/4/steps/1/controls/4/search/matcher` | 当前契约支持 |
| `minQueryLength` | number | 可选 | 触发搜索所需的最少输入字符数。 | `1`；行 108394，Pointer `/workflows/4/steps/1/controls/4/search/minQueryLength` | 当前契约支持 |
| `maxResults` | number | 可选 | 搜索返回候选数量上限。 | `30`；行 108395，Pointer `/workflows/4/steps/1/controls/4/search/maxResults` | 当前契约支持 |
| `debounceMs` | number | 可选 | 搜索输入防抖延迟，单位毫秒。 | `180`；行 108396，Pointer `/workflows/4/steps/1/controls/4/search/debounceMs` | 当前契约支持 |
| `cacheScope` | `"world"` / `"loadedWorlds"` | 必填 | 搜索只在当前世界还是全部已加载世界中查找。 | `"world"`；行 108397，Pointer `/workflows/4/steps/1/controls/4/search/cacheScope` | 当前契约支持 |
| `mode` | `"feature"` / `"coarse"` | 可选 | 当前联合结构的分支选择器；先看 mode，再解释其余字段。 | 本包未写入 | 当前契约支持 |
| `searchFields` | 数组＜string＞ | 可选 | 工作流搜索控件使用的候选匹配字段。 | 本包未写入 | 当前契约支持 |
| `displayFields` | 数组＜string＞ | 可选 | 搜索候选展示字段列表。 | 本包未写入 | 当前契约支持 |
| `returnFields` | 数组＜string＞ | 可选 | 搜索候选返回字段的列表。 | 本包未写入 | 当前契约支持 |
| `coarse` | [$.workflows[].steps[].controls[].search.coarse [t163]](#t163) | 可选 | 搜索控件粗搜索的开关和显示设置。 | 本包未写入 | 当前契约支持 |

<a id="t163"></a>

## t163 · $.workflows[].steps[].controls[].search.coarse

首次类型入口：`$.workflows[].steps[].controls[].search.coarse`。本包没有此结构的实际实例；可能是可选功能或兼容分支。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `matcher` | `"contains"` / `"prefix"` / `"token"` / `"fuzzy"` | 必填 | contains/prefix/token/fuzzy 等受控搜索匹配方式。 | 本包未写入 | 当前契约支持 |
| `minQueryLength` | number | 必填 | 触发搜索所需的最少输入字符数。 | 本包未写入 | 当前契约支持 |
| `maxResults` | number | 必填 | 搜索返回候选数量上限。 | 本包未写入 | 当前契约支持 |
| `debounceMs` | number | 可选 | 搜索输入防抖延迟，单位毫秒。 | 本包未写入 | 当前契约支持 |

<a id="t164"></a>

## t164 · WorkflowRepeatGroup

首次类型入口：`$.workflows[].steps[].controls[].group`。本包实例：`/workflows/17/steps/1/controls/9/group`，完整 JSON 第 112092–112156 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `itemFields` | 数组＜[WorkflowGroupField [t165]](#t165)＞ | 必填 | 重复字段组中每个项目包含的子字段定义。 | `[{"key":"mode","label":{"zh":"连接方式","en":""},"kind":"select","required":true,"defaultValue":"endpoint","optionValueType":"string","optionTable":{"valu…（摘要）`；行 112098，Pointer `/workflows/17/steps/1/controls/9/group/itemFields` | 当前契约支持 |
| `storage` | `"object"` / `"scalar"` | 可选 | 重复组保存为对象数组还是纯值数组。 | `"object"`；行 113278，Pointer `/workflows/20/steps/1/controls/3/group/storage` | 当前契约支持 |
| `optional` | boolean：true / false | 可选 | 重复组是否允许零项。 | `true`；行 112093，Pointer `/workflows/17/steps/1/controls/9/group/optional` | 当前契约支持 |
| `minItems` | number | 可选 | 重复组至少需要多少项。 | `1`；行 113280，Pointer `/workflows/20/steps/1/controls/3/group/minItems` | 当前契约支持 |
| `addLabel` | [LocalizedText [t1]](#t1) | 可选 | 重复组添加一项按钮的中英文名称。 | `{"zh":"添加显式连接关系（ConnectL，可选）","en":""}`；行 112094，Pointer `/workflows/17/steps/1/controls/9/group/addLabel` | 当前契约支持 |

<a id="t165"></a>

## t165 · WorkflowGroupField

首次类型入口：`$.workflows[].steps[].controls[].group.itemFields[]`。本包实例：`/workflows/17/steps/1/controls/9/group/itemFields/0`，完整 JSON 第 112099–112128 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `optionTable` | [OptionTable [t48]](#t48) | 可选 | 当前模块本地对照表；含 valueType 和 rows。 | `{"valueType":"string","rows":[{"value":"endpoint","label":{"zh":"端点","en":""}},{"value":"middle","label":{"zh":"中段","en":""}}]}`；行 112109，Pointer `/workflows/17/steps/1/controls/9/group/itemFields/0/optionTable` | 当前契约支持 |
| `optionsFieldRef` | [FieldDefinitionRef [t142]](#t142) | 可选 | 仅对照表实时绑定到指定字段 nodeId+fieldId。 | 本包未写入 | 当前契约支持 |
| `prefillAudit` | [PrefillAudit [t104]](#t104) | 可选 | 预填来源的审计指纹；只用于提醒陈旧，不建立运行时绑定。 | 本包未写入 | 当前契约支持 |
| `prefillField` | string | 可选 | 单次预填后留下的本地目标字段提示，不是实时来源引用。 | 本包未写入 | 当前契约支持 |
| `key` | string | 必填 | 真实数据字段路径或重复组成员键；不等于 fieldId。 | `"mode"`；行 112100，Pointer `/workflows/17/steps/1/controls/9/group/itemFields/0/key` | 当前契约支持 |
| `label` | [LocalizedText [t1]](#t1) | 必填 | 名称对象或 Label 样式对象；必须结合所在路径解读。 | `{"zh":"连接方式","en":""}`；行 112101，Pointer `/workflows/17/steps/1/controls/9/group/itemFields/0/label` | 当前契约支持 |
| `kind` | `"number"` / `"text"` / `"select"` / `"json"` / `"textarea"` / `"toggle"` / `"featureSearch"` / `"coarseSearch"` | 必填 | 分类路径第二级，或条件/控件的分支种类；依所在对象判读。 | `"select"`；行 112105，Pointer `/workflows/17/steps/1/controls/9/group/itemFields/0/kind` | 当前契约支持 |
| `required` | boolean：true / false | 可选 | 是否必填；系统 World 设置中固定为 true，其他位置按控件或字段解释。 | `true`；行 112106，Pointer `/workflows/17/steps/1/controls/9/group/itemFields/0/required` | 当前契约支持 |
| `options` | 数组＜[SelectOption [t42]](#t42)＞ | 可选 | 控件本地选项数组、组件设置对象等；不能跨对象套用。 | 本包未写入 | 当前契约支持 |
| `optionsTableId` | string | 可选 | 实时引用公共表 lookupTables[].id，不保存独立可编辑副本。 | 本包未写入 | 当前契约支持 |
| `placeholder` | string | 可选 | 输入提示文字；不等于默认值，也不写入记录。 | `"检索道路（Name/ID），选择后写入ID"`；行 112137，Pointer `/workflows/17/steps/1/controls/9/group/itemFields/1/placeholder` | 当前契约支持 |
| `defaultValue` | 任意 JSON（仍受模块语义约束） | 可选 | 初始输入值；类型须与字段或控件格式相容。 | `"endpoint"`；行 112107，Pointer `/workflows/17/steps/1/controls/9/group/itemFields/0/defaultValue` | 当前契约支持 |
| `rows` | number | 可选 | 公共表/本地表的行数组，或文字控件行高；以所在类型区分。 | 本包未写入 | 当前契约支持 |
| `search` | [SearchProfile [t162]](#t162) | 可选 | 分类搜索规则、工作流搜索控件参数或应用搜索偏好。 | `{"target":{"class":"ROD"},"queryFields":["ID","Name"],"displayTemplate":"{{ID}} ({{Name}})","returnField":"ID","matcher":"contains","minQueryLength":1…（摘要）`；行 112138，Pointer `/workflows/17/steps/1/controls/9/group/itemFields/1/search` | 当前契约支持 |
| `optionValueType` | `"string"` / `"number"` / `"boolean"` | 可选 | 选项保存为文本、数字或布尔值；value 文本会按此解释。 | `"string"`；行 112108，Pointer `/workflows/17/steps/1/controls/9/group/itemFields/0/optionValueType` | 当前契约支持 |
| `fieldFormat` | `"boolean"` / `"plain"` / `"externalLink"` / `"date"` / `"json"` | 可选 | 工作流控件的填写/显示格式提示。 | 本包未写入 | 当前契约支持 |
| `fieldSource` | [WorkflowFieldSource [t158]](#t158) | 可选 | 旧式字段来源快照和覆写列表；现代预填/绑定另有明确字段。 | 本包未写入 | 兼容/迁移保留 |
| `requiredWhen` | 数组＜[WorkflowValueCondition [t160]](#t160)＞ | 可选 | 条件必填规则；字段和工作流使用不同的条件结构。 | 本包未写入 | 当前契约支持 |
| `valueNormalization` | `"number"` / `"none"` / `"trim"` / `"abbr"` | 可选 | 输入保存值处理：保留、去空白、简称或转数字。 | 本包未写入 | 当前契约支持 |

<a id="t166"></a>

## t166 · $.workflows[].steps[].controls[].tagsExtensions

首次类型入口：`$.workflows[].steps[].controls[].tagsExtensions`。本包实例：`/workflows/3/steps/1/controls/6/tagsExtensions`，完整 JSON 第 108211–108214 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `tagsEnabled` | boolean | 必填 | 是否开放标签输入。 | `true`；行 108212，Pointer `/workflows/3/steps/1/controls/6/tagsExtensions/tagsEnabled` | 当前契约支持 |
| `extensionsEnabled` | boolean | 必填 | 是否开放扩展输入。 | `true`；行 108213，Pointer `/workflows/3/steps/1/controls/6/tagsExtensions/extensionsEnabled` | 当前契约支持 |

<a id="t167"></a>

## t167 · $.workflows[].steps[].tagsExtensions

首次类型入口：`$.workflows[].steps[].tagsExtensions`。本包没有此结构的实际实例；可能是可选功能或兼容分支。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `tagsEnabled` | boolean | 必填 | 是否开放标签输入。 | 本包未写入 | 当前契约支持 |
| `extensionsEnabled` | boolean | 必填 | 是否开放扩展输入。 | 本包未写入 | 当前契约支持 |

<a id="t168"></a>

## t168 · $.workflows[].steps[].drawing

首次类型入口：`$.workflows[].steps[].drawing`。本包实例：`/workflows/3/steps/2/drawing`，完整 JSON 第 108229–108233 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `enabledFromThisPage` | boolean：true / false | 可选 | 进入绘制页时是否自动启用此绘制。 | `true`；行 108230，Pointer `/workflows/3/steps/2/drawing/enabledFromThisPage` | 当前契约支持 |
| `drawMode` | string | 可选 | 旧式绘制模式提示，须与固定点/线/面类型一致。 | 本包未写入 | 当前契约支持 |
| `allowBack` | boolean：true / false | 可选 | 此绘制页是否允许返回上一页。 | `true`；行 112803，Pointer `/workflows/18/steps/3/drawing/allowBack` | 当前契约支持 |
| `keepDrawingWhenBack` | boolean：true / false | 可选 | 返回信息页时保留最后离开绘制页的活动绘制状态。 | `true`；行 108231，Pointer `/workflows/3/steps/2/drawing/keepDrawingWhenBack` | 当前契约支持 |
| `pointSlot` | string | 可选 | 旧单点返回槽位；现代绘制使用 captureSlot 与 returnFormat。 | 本包未写入 | 兼容/迁移保留 |
| `auxiliaryPoints` | 数组＜[WorkflowAuxiliaryPoint [t169]](#t169)＞ | 可选 | 旧内嵌辅助点列表；现代额外绘制为独立 geometry 页。 | 本包未写入 | 兼容/迁移保留 |
| `captureSlot` | string | 可选 | 绘制返回写入的槽位名，还会派生 _X/_Y/_Z/_HEIGHT 等值。 | `"SOURCE_POINT_GEOMETRY"`；行 112748，Pointer `/workflows/18/steps/2/drawing/captureSlot` | 当前契约支持 |
| `returnFormat` | `"coordP"` / `"pointObject"` / `"coordL"` / `"coordG"` | 可选 | 绘制返回 CoordP/CoordL/CoordG 数组或单点 {x,y,z}。 | `"coordP"`；行 112749，Pointer `/workflows/18/steps/2/drawing/returnFormat` | 当前契约支持 |
| `multiple` | boolean：true / false | 可选 | 当前绘制页是否允许多部件/多点；与分类 allowMultipleParts 是两层设置，当前按钮联动尚有已知缺口。 | `true`；行 108232，Pointer `/workflows/3/steps/2/drawing/multiple` | 当前契约支持 |
| `heightSlot` | string | 可选 | 可选的高度输入槽位，必须对应有效数值输入。 | `"SOURCE_ELEVATION"`；行 112750，Pointer `/workflows/18/steps/2/drawing/heightSlot` | 当前契约支持 |
| `bindings` | 数组＜[$.workflows[].steps[].drawing.bindings[] [t170]](#t170)＞ | 可选 | 世界到来源组的映射，或绘制返回字段绑定数组。 | `[{"outputId":"tpp_teleport-output-1","target":"elevation","value":"height"}]`；行 112751，Pointer `/workflows/18/steps/2/drawing/bindings` | 当前契约支持 |

<a id="t169"></a>

## t169 · WorkflowAuxiliaryPoint

首次类型入口：`$.workflows[].steps[].drawing.auxiliaryPoints[]`。本包没有此结构的实际实例；可能是可选功能或兼容分支。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `id` | string | 必填 | 当前对象的稳定标识；唯一性范围取决于对象类型。 | 本包未写入 | 当前契约支持 |
| `slot` | string | 必填 | 工作流运行中的信息槽位名；不是最终记录字段名。 | 本包未写入 | 当前契约支持 |
| `label` | [LocalizedText [t1]](#t1) | 必填 | 名称对象或 Label 样式对象；必须结合所在路径解读。 | 本包未写入 | 当前契约支持 |
| `required` | boolean：true / false | 可选 | 是否必填；系统 World 设置中固定为 true，其他位置按控件或字段解释。 | 本包未写入 | 当前契约支持 |
| `when` | [WorkflowValueCondition [t160]](#t160) | 可选 | 当前规则/模块生效条件；渲染、工作流和旧条件数组语法不同。 | 本包未写入 | 当前契约支持 |

<a id="t170"></a>

## t170 · $.workflows[].steps[].drawing.bindings[]

首次类型入口：`$.workflows[].steps[].drawing.bindings[]`。本包实例：`/workflows/18/steps/2/drawing/bindings/0`，完整 JSON 第 112752–112756 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `outputId` | string | 必填 | 绘制页、系统分类控件或绑定所对应的工作流输出 ID。 | `"tpp_teleport-output-1"`；行 112753，Pointer `/workflows/18/steps/2/drawing/bindings/0/outputId` | 当前契约支持 |
| `target` | string | 必填 | 目标分类范围，或输出赋值的目标字段路径；二者不能混用。 | `"elevation"`；行 112754，Pointer `/workflows/18/steps/2/drawing/bindings/0/target` | 当前契约支持 |
| `value` | `"geometry"` / `"height"` | 必填 | 最终存储值、条件比较值或常量；是否字符串须看当前类型声明。 | `"height"`；行 112755，Pointer `/workflows/18/steps/2/drawing/bindings/0/value` | 当前契约支持 |

<a id="t171"></a>

## t171 · WorkflowOutput

首次类型入口：`$.workflows[].outputs[]`。本包实例：`/workflows/3/outputs/0`，完整 JSON 第 108239–108276 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `id` | string | 必填 | 当前对象的稳定标识；唯一性范围取决于对象类型。 | `"isg_ngf_lad-output-1"`；行 108240，Pointer `/workflows/3/outputs/0/id` | 当前契约支持 |
| `classification` | [ClassificationPath [t16]](#t16) | 必填 | 工作流输出或关系端点的分类范围。 | `{"class":"ISG","kind":"NGF","skind":"LAD"}`；行 108241，Pointer `/workflows/3/outputs/0/classification` | 当前契约支持 |
| `assignments` | 数组＜[WorkflowAssignment [t172]](#t172)＞ | 必填 | 输出组装规则数组；将槽位/公式结果写入真实数据字段。 | `[{"id":"isg_ngf_lad-assignment-Name-A","target":"Name","expression":"A"},{"id":"isg_ngf_lad-assignment-nomenclator-B","target":"tags.nomenclator","exp…（摘要）`；行 108246，Pointer `/workflows/3/outputs/0/assignments` | 当前契约支持 |
| `when` | [WorkflowValueCondition [t160]](#t160) | 可选 | 当前规则/模块生效条件；渲染、工作流和旧条件数组语法不同。 | 本包未写入 | 当前契约支持 |
| `geometry` | [$.workflows[].outputs[].geometry [t173]](#t173) | 必填 | 当前绘制的几何类型、几何输入继承选项或输出几何设置。 | `{"selected":"Polygon"}`；行 108273，Pointer `/workflows/3/outputs/0/geometry` | 当前契约支持 |

<a id="t172"></a>

## t172 · WorkflowAssignment

首次类型入口：`$.workflows[].outputs[].assignments[]`。本包实例：`/workflows/3/outputs/0/assignments/0`，完整 JSON 第 108247–108251 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `id` | string | 必填 | 当前对象的稳定标识；唯一性范围取决于对象类型。 | `"isg_ngf_lad-assignment-Name-A"`；行 108248，Pointer `/workflows/3/outputs/0/assignments/0/id` | 当前契约支持 |
| `target` | string | 必填 | 目标分类范围，或输出赋值的目标字段路径；二者不能混用。 | `"Name"`；行 108249，Pointer `/workflows/3/outputs/0/assignments/0/target` | 当前契约支持 |
| `expression` | string | 必填 | 工作流组装公式或条件编号布尔公式；两者语法不同。 | `"A"`；行 108250，Pointer `/workflows/3/outputs/0/assignments/0/expression` | 当前契约支持 |
| `when` | [WorkflowValueCondition [t160]](#t160) | 可选 | 当前规则/模块生效条件；渲染、工作流和旧条件数组语法不同。 | 本包未写入 | 当前契约支持 |

<a id="t173"></a>

## t173 · $.workflows[].outputs[].geometry

首次类型入口：`$.workflows[].outputs[].geometry`。本包实例：`/workflows/3/outputs/0/geometry`，完整 JSON 第 108273–108275 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `selected` | `"Point"` / `"LineString"` / `"Polygon"` | 必填 | 选中状态的外观；在工作流 geometry 中则表示固定几何类型。 | `"Polygon"`；行 108274，Pointer `/workflows/3/outputs/0/geometry/selected` | 当前契约支持 |
| `allowed` | 数组＜`"Point"` / `"LineString"` / `"Polygon"`＞ | 可选 | 粗搜索是否启用。 | 本包未写入 | 当前契约支持 |

<a id="t174"></a>

## t174 · $.workflows[].external

首次类型入口：`$.workflows[].external`。本包实例：`/workflows/0/external`，完整 JSON 第 107999–108008 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `componentKey` | string | 必填 | 已登记代码组件/外部工作流的稳定键。 | `"railwayWorkflow"`；行 108000，Pointer `/workflows/0/external/componentKey` | 当前契约支持 |
| `purpose` | `"capture"` / `"edit"` | 可选 | 外部方案用途：capture 采集，edit 专供编辑。 | `"capture"`；行 108007，Pointer `/workflows/0/external/purpose` | 当前契约支持 |
| `version` | number | 可选 | 受控外部方案版本。 | `1`；行 114659，Pointer `/workflows/27/external/version` | 当前契约支持 |
| `reason` | `"railway-integrated"` / `"station-integrated"` / `"trp-integrated"` | 必填 | 允许保留该外部方案的集成理由。 | `"railway-integrated"`；行 108001，Pointer `/workflows/0/external/reason` | 当前契约支持 |
| `coveredClassifications` | 数组＜[ClassificationPath [t16]](#t16)＞ | 可选 | 外部方案明确服务的分类范围列表。 | `[{"class":"RLE"}]`；行 108002，Pointer `/workflows/0/external/coveredClassifications` | 当前契约支持 |

<a id="t175"></a>

## t175 · $.workflows[].legacy

首次类型入口：`$.workflows[].legacy`。本包实例：`/workflows/0/legacy`，完整 JSON 第 108009–108016 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `runtimeMode` | string | 可选 | 旧工作流运行模式提示。 | `"registry-schema"`；行 108279，Pointer `/workflows/3/legacy/runtimeMode` | 当前契约支持 |
| `componentKey` | string | 可选 | 已登记代码组件/外部工作流的稳定键。 | `"railwayWorkflow"`；行 108010，Pointer `/workflows/0/legacy/componentKey` | 当前契约支持 |
| `output` | [Record [t135]](#t135) | 可选 | 旧外部工作流输出说明，不是现代 outputs 数组。 | 本包未写入 | 当前契约支持 |
| `source` | [Record [t135]](#t135) | 可选 | 信息卡字段来源、图标来源、预填来源或对齐文件位置；结合路径区分。 | `{"coveredWorkflowIds":["rail-line-workflow"]}`；行 108011，Pointer `/workflows/0/legacy/source` | 当前契约支持 |

<a id="t176"></a>

## t176 · ParityReport

首次类型入口：`$.parity`。本包实例：`/parity`，完整 JSON 第 114668–114957 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `schemaVersion` | `"cairnmap.v1-parity-report.v2"` | 必填 | 文件结构标记；固定字符串用于识别整包、应用设置或对齐报告。 | `"cairnmap.v1-parity-report.v2"`；行 114669，Pointer `/parity/schemaVersion` | 当前契约支持 |
| `sourceManifestSha256` | string | 可选 | 原始迁移来源清单的 SHA-256 摘要；不是整包当前内容的散列。 | 本包未写入 | 当前契约支持 |
| `entries` | 数组＜[ParityEntry [t177]](#t177)＞ | 必填 | 按值设色的逐行条目，或迁移对齐报告中的逐项记录。 | `[{"kind":"class","id":"BUD","source":"project-config class BUD","status":"resolved","fingerprint":"fnv1a-1f9ab3c1","details":"字段、分类、坐标、显示规则、信息卡及原始 V1 …（摘要）`；行 114671，Pointer `/parity/entries` | 当前契约支持 |
| `generatedAt` | string | 必填 | V1 对齐报告的生成时间。 | `"2026-10-10T17:45:25.900Z"`；行 114670，Pointer `/parity/generatedAt` | 当前契约支持 |

<a id="t177"></a>

## t177 · ParityEntry

首次类型入口：`$.parity.entries[]`。本包实例：`/parity/entries/0`，完整 JSON 第 114672–114679 行。

| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |
| --- | --- | --- | --- | --- | --- |
| `kind` | `"class"` / `"workflow"` / `"shared"` | 必填 | 分类路径第二级，或条件/控件的分支种类；依所在对象判读。 | `"class"`；行 114673，Pointer `/parity/entries/0/kind` | 当前契约支持 |
| `id` | string | 必填 | 当前对象的稳定标识；唯一性范围取决于对象类型。 | `"BUD"`；行 114674，Pointer `/parity/entries/0/id` | 当前契约支持 |
| `source` | string | 必填 | 信息卡字段来源、图标来源、预填来源或对齐文件位置；结合路径区分。 | `"project-config class BUD"`；行 114675，Pointer `/parity/entries/0/source` | 当前契约支持 |
| `status` | `"resolved"` / `"registryReference"` / `"unsupported"` | 必填 | V1 对齐项的迁移状态，而非要素审核状态。 | `"resolved"`；行 114676，Pointer `/parity/entries/0/status` | 当前契约支持 |
| `details` | string | 可选 | V1 对齐项的说明。 | `"字段、分类、坐标、显示规则、信息卡及原始 V1 契约均已建立可审计映射。"`；行 114678，Pointer `/parity/entries/0/details` | 当前契约支持 |
| `fingerprint` | string | 可选 | 预填/来源内容的摘要，用于发现修改。 | `"fnv1a-1f9ab3c1"`；行 114677，Pointer `/parity/entries/0/fingerprint` | 当前契约支持 |
