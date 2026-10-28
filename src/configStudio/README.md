# 配置工作台核心说明

修改本模块前先阅读 [契约更新要求](../../docs/20_config-reference/ContractUpdates.md)。它是后续人工和 AI 更新工作台的维护约定。

## 测绘结构的唯一入口

- 部件和内洞只能通过既有“多部件和内洞设置”修改。Runner、Host、Session 不得新增添加部件/孔环按钮、快捷参数或第二套几何拼接状态；测试便利不构成新增产品入口的授权。
- `NativeDrawingSession` 归档主编辑器的完整草稿和部件/内洞编辑目标；`getTempPoints()` 只是当前活动路径，不能充当整个要素。完整快照采用替换语义，重复捕获不得追加结构。
- Runner 通过既有 `drawingAllowsParts` 将实际分类/消费者政策传给原编辑器，不用完整模式旧选择或第一个候选猜测；禁止多部件仍允许原规则支持的内洞。恢复不截断不兼容草稿，正式输出继续核验。
- 编号显示的只读限制须覆盖原工具、撤销/键盘和最后写回；工具自身的正常事务不得被结构锁误伤。换任务前保留/处理当前工具事务，布局变化不丢草稿。
- 工作台试运行保留已有样例/坐标入口，但同样没有结构快捷按钮。旧内嵌辅助点只整理成既有独立辅助绘制页，不在运行中写回配置或升级契约。
- 任何入口变化都应对应已批准蓝图条目，并交付入口差异清单。回归以唯一入口、真实完整几何和最终记录往返为准，不能把实现中意外出现的按钮反推为需求。

## c17：内部图片库与显式图片来源

- 固定图片保存 `image.sourceForm`，字段分类映射每行保存 `entries[i].sourceForm`，值为 `url`／`library`。为表示历史配置，TS 属性可省略，但 c17 结构及语义核验要求它必填；旧契约禁止写入。不得从 URL 前缀推断或重新指定来源形式。
- `imageLibrary.ts` 是 Web、构建目录扫描及共享 Node 内核的纯路径策略；`c17Migration.ts` 由统一相邻迁移注册表调用。c16→c17 为旧固定图片／映射行补 `url`，保留地址、参数和其他内容；普通读取、缓存恢复及保存不迁移。
- `ImageReferenceEditor` 管理来源形式及各形式的临时输入；`ImageLibraryPicker` 只选图片，确认原子写入标记与地址，取消不修改外部表单。行键复用现有稳定预览身份，大小、锚点、偏移、Halo 和全局回退仍独立。
- 图片放在 `public/image-library/`，无需维护索引。`scripts/image-library-plugin.mjs` 在构建／开发时自动扫描，通过虚拟模块提供文件名和地址；添加图片后正常部署 Web 即可。不要为目录枚举增加 SCF 接口，也不要把图片内联进配置包。
- `library` 路径格式由共享规则核验，文件是否已部署只影响编辑提示和运行回退，不作为服务端联网核验条件。URL 模式即使指向同一目录也必须保持 URL 意图。参见 [图片库维护与使用](../../docs/20_config-reference/ImageLibrary.md)。

## 契约更新要求

- 配置修订使用 `rN`，契约使用 `cN`；内部 `revision`、`contractRevision` 保持数字。身份展示和能力门禁取 `contract.ts`，不把标题、编辑范围和正式发布范围混用。
- c13 起采用相邻版本迁移。每次升级在 `contractMigration.ts` 注册 `cN → cN+1`，覆盖 package、node、classTree、workflow；无变化组件也要登记。完整包复用组件转换，不维护另一份相似实现。
- 每一步以源版完整结构为输入，完成目标版结构后再进入下一步；有非法结构时停止。只允许目标及此前五版，且不早于 c13。未知、反向、超窗和缺步骤都明确拒绝。
- 必填设置填保守默认，可选设置省略并报告待补充；无法安全推导的业务绑定不编造值。删除必须来自明确的废弃清单，其他内容、0、false、ID、顺序和继承关系保留。
- 不修改原件、保存基线或真实要素。导入原件和迁移报告保留在单份当前工作区附件；报告清除不清配置、不清核验错误。组件迁移只作用于导入范围与声明依赖。
- 读取分类、读取已恢复草稿、普通区域保存、地图启动和继续编辑缓存不升级契约。整包升级必须明确触发；导入自动迁移在入口声明目标并形成隔离候选。未完成区域先保存或放弃，不丢草稿。
- UI、schema、默认值、新建模板、继承、字段／资源依赖、导入导出、预览、正式渲染、核验器和 Pipeline 必须同步；新增属性不能只加到表单。
- 新增颜色属性复用五种取色模式，加入绑定遍历和映射约束；图像变化进入资源缓存键、实际画布与锚点补偿、碰撞及裁切边界、失败回退。
- 迁移不得逐跳累加配置修订或继承旧核验凭据，不使用网络、时钟和不稳定随机 ID 决定转换结果。索引重新计算；核验记录只在身份和内容完全匹配时复用。
- 每次提交相邻版本夹具，执行窗口内迁移链、全部组件往返、组件与整包等价、重复迁移、防降级、原件未变及实际浏览器操作测试。
- 完整回归进入 PR CI。生产 build 保留离线生成物／正式配置检查，不访问 SCF，不重复跑完整测试矩阵。共享核验器变更必须生成同源 SCF 包并提供部署说明。

## 当前入口

`ConfigStudio.tsx` 管理区域草稿和整包候选；`workspaceController.ts`／`workspaceStorage.ts` 管理显式恢复的单份检查点。分类和 Class 树使用 `categoryArtifact.ts`，工作流使用 `workflowArtifact.ts`，完整包使用 `package.ts`。`nativeContractValidation.ts` 检查结构，`runtime.ts` 执行语义核验。

`HaloEditor.tsx` 复用颜色控件；`halo.ts` 定义范围和默认值；`iconComposition.ts` 是图标合成入口；普通地图通过 `configPackageAdapter.ts` 和 `RuleDrivenLayer.tsx` 使用同样配置。`MigrationNotices.tsx` 展示可清除的来源提示，不授予保存／发布资格。

折叠状态按字段／规则／信息卡的稳定 ID 保存，是编辑界面状态，不写入业务配置。

## c15 结构与运行入口

- 几何能力仅在 profile 保留 `allowMultipleParts`；每条完整规则必须保存 `multipartAnchor` 和 `interaction.triggers`。不得写回已废弃的 profile.anchor／interaction。
- 面几何 Halo 使用 `{enabled,widthPx,color,showInner}`。内侧开关只适用于面几何；基础点、Icon、图片的 Halo 不接受该属性。`showInner:true` 在不透明填色上也可见。
- 所有圆形走 SVG，输入小数直接使用。c14→c15 转换旧值为旧版实际半径并报告；新输入不再取整。零尺寸圆形不绘制符号、Halo 或几何点击面。
- 基础形状使用 `configShapeMarker.ts`／`convexHaloRing.ts` 的直接空心环带，线面复用投影路径遮罩，图片使用独立 SVG 矩形；原内容不被 Halo 二次涂色。尺寸、占用和命中使用 `pointSymbolMetrics.ts`。
- c15 output 使用 `classificationGroup.selectors[]`，每行 `{id,mode:'self'|'leafDescendants',path}`，整组仍只有一个固定 geometry.selected。`workflowClassificationGroup.ts` 是候选、共同字段和资格的公共入口；不能回退到组内第一条路径。
- 采集、导入、再编辑和共享 Node 核验允许有有效几何的精确父节点；只有 leafDescendants 展开要求结构末端。历史契约保持原有资格。
- 工作流设计折叠由 `WorkflowFold.tsx` 管理。业务 ID 优先；没有业务 ID 的行使用单独 UI 身份，随同一个显式检查点恢复，不写入配置或配置散列。实际运行器表单保持正常展开。
- `migratePackageToC14()` 永远只到 c14；本轮新增 `migratePackageToC15()`。新建、复制、执行方式／显示类型切换同样必须产生完整目标结构，不能靠再次迁移掩盖工厂遗漏。

## c15 工作流分类修正维护要求

- 四级 Class／Kind／SKind／SKind2 选框只用于工作台设计端指定分类组范围。实际填写、试运行和工作流式编辑统一用一个类型下拉框，列出最后一级代号（名称），内部仍绑定完整路径。不要根据候选深度再生成四级填写表单。
- `workflowCategoryOptions.ts` 负责稳定顺序和同名消歧；`WorkflowClassificationSelect.tsx` 复用实际表单样式。编辑端必须传入编辑计划的真实候选集合，不能只在保存时拒绝范围外选项。
- `workflowOutputFields()` 只是共同字段建议。绑定资格分析实际供值及各候选字段约束，不能用类型／format／schema 的 JSON 相等或字段交集代替值兼容性检查。
- `workflowSupplyValidation.ts` 按实际条件检查必填供值，包括系统值、组装、绘制对象的子字段、默认值和人工标签。`workflowConditionCoverage.ts` 做有界符号覆盖分析；超出预算返回未知警告，不用几个试填样本伪造证明。
- `fieldValueValidation.ts` 是 c15 实际提交和纯 Node 入站共用的字段值／格式检查；历史契约保留旧行为。明确非法值阻断，动态未知的配置结果警告并在实际保存时核验。
- 回归必须包含真实运行器中 Kind／SKind／SKind2 末端混合的单下拉框，实际填写、地图采集和再编辑；只测试设计器或者内核不能证明填写交互符合要求。


## c16：原生配置与专用能力边界

- 正式入口禁止依赖 `src/legacy`、旧格式／分类清单、全局旧编辑 Schema、旧渲染表和旧卡片表。`npm run test:c16` 以真实生产模块图核验间接依赖；类型和中性几何／系统字段工具放在 Common 独立文件中。历史 c6 工厂与 c10/c11 导入使用冻结数据，不初始化旧清单。
- 完整测绘通过 `fullEditor.ts` 使用编辑路由、计划、控件和核验；四级选择树仅用于完整模式。新建使用手填 ID、控件默认值与创建信息，不能伪造原记录走修改逻辑；快捷工作流仍使用平铺选项。
- 外部组件以 `externalCapabilities.ts` 的业务角色声明算法最小契约，分类组保存在 `external.roleBindings`。不得以 Class 代号、中文 subType 或“第一个符合的工作流”决定角色；多候选必须明确选择。
- `external.referenceBindings` 保存关联范围和搜索参数，或引用确切的 workflowId/bindingId。编辑器与组件卡片复用显式来源，丢失／循环／返回值歧义均应显示具体原因。当前世界与已加载世界严格区分，不自动下载其他世界。
- `nativeRecordSubmission.ts` 是专用采集和完整模式新建的统一边界，负责合法值、完整几何、系统信息及重复 ID；专用阶段算法和控件位于各专用模块内部，不可复制全站分类字段目录充当另一份权威。
- c15→c16 同一迁移步骤覆盖整包、分类、Class 树和工作流；只更改显式绑定及相应引用。普通工作流、样式、字段、共享铁路角色和导航范围保持；迁移不发布、不修改正式要素。
- `resolveConfiguredFeatureCard` 为桌面和移动端唯一卡片解析入口。组件键表示代码能力，不能按记录 Class 静默选择旧卡片。无效绑定只阻断对应操作并保留原始记录。
