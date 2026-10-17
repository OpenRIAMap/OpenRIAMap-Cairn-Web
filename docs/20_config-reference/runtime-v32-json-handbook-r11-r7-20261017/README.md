# 当前 V3.2 配置 JSON 人工阅读与解析手册

基准：**契约 r11 / 保存修订 r7**，日期 2026-10-17。以当前下游应用默认配置为准。

这套手册用于在不打开编辑器的情况下，对照阅读完整配置文件。它记录当前已经实现的文件结构和解析方式，不把已讨论但尚未实现的功能写成既有能力。

## 1. 先打开哪一份文件

| 文件 | 用法 |
| --- | --- |
| [handbook.html](handbook.html) | 推荐阅读入口。离线打开即可查看指南、中文字段表、实例索引和带行号的完整 JSON；支持检索及 JSON Pointer 定位。 |
| [current-full.config.json](current-full.config.json) | **完整、无删减、可被现有导入器识别的当前默认 JSON**。与应用默认文件逐字节一致，不添加注释或虚构示例值。 |
| [FIELD_REFERENCE.md](FIELD_REFERENCE.md) | 全字段解析表。包含类型、结构必填性、枚举/子结构、中文意义、兼容状态及实际例子的行号。 |
| [EXAMPLES.md](EXAMPLES.md) | 从本文件精确摘出的典型片段及读法，含 RLE 方向、线路胶囊、TPP、公共表、按钮和来源组。片段不是独立整包。 |
| [INSTANCE_INDEX.md](INSTANCE_INDEX.md) | 当前所有分类、工作流、公共表、世界和按钮的 ID、JSON 路径及行号。 |
| [reference-data.json](reference-data.json) | 阅读器使用的机器可读字段表及定位索引，不是应用配置。 |
| [handbook-manifest.json](handbook-manifest.json) | 本手册的基准、来源代码摘要及交付文件摘要，用于日后辨认适用版本。 |

本版完整 JSON：115848 行，3538283 字节；包含 95 个分类节点、16 个 Class、28 个工作流、3 张公共表。字段表覆盖当前类型契约的 178 种对象结构、1039 个命名字段位置，其中 139 种结构在本份默认 JSON 中实际出现。

默认 JSON SHA-256：`982e1c0b6dc004dd90ee1ff92cd502dfb0f77a9ef4c53bb5a707a2c188460d7e`。

## 2. 与 V1 分文件配置的对照

V1 按项目/预设、Class、共享显示、共享信息卡、工作流和环境分文件。当前 V3 将作者可编辑的设置汇集在同一个 JSON 整包中，通过稳定 ID 引用。**分类节点仍组成树，但 JSON 内是平铺数组。**

| V1 阅读习惯 | 当前整包位置 | 读法 |
| --- | --- | --- |
| Class 的分类与字段定义 | `nodes[]` → `path`、`classificationLabels`、`fields` | 先找到完整分类路径，再读本地字段及继承规则。 |
| Class 显示规则与 shared/display | `nodes[].geometryProfiles`；`engine` 提供默认值 | 先看几何类型，再看 `zoomPriority.rules[]`。 |
| shared/card 与 Class 的信息卡 | `nodes[].card`；组件清单在 `registries` | 普通卡以 `mode: "fields"` 逐项声明，专用卡使用受控组件。 |
| workflow 调度/组装 | `workflows[]` | 先分 composed/external，再读 steps 和 outputs。 |
| 世界、瓦片、数据源、图层按钮 | `application` | 当前主要使用来源组共享链路，各世界只保留必要身份与布局。 |
| 多处共用的枚举/功能表 | `lookupTables[]` | 用表格 ID 引用，行中的显示名与保存值分开。 |
| 运行时组件/预设登记 | `registries` | 这是允许使用的能力清单，不是任意函数定义。 |
| 迁移来源核对 | `parity`、局部 `legacy` | 用于追溯，不替代实际原生规则。 |

旧手册中的 `project-config/assemblies`、`shared/*`、`classes/*.json` 路径依然适合阅读 V1 来源，但不能当作本份 V3 整包的内部键名。

## 3. JSON 的人工阅读约定

| 写法 | 含义 | 常见误读 |
| --- | --- | --- |
| `{ ... }` | 一个对象；同一层键属于同一个模块 | 缩进相近不代表两个对象互相继承。 |
| `[ ... ]` | 有序数组 | 工作流页、规则和按钮数组顺序可能影响行为，不宜随意排序。 |
| `"3"` | 文本 | 不等于数字 `3`。表格行 value 有意使用文本编码。 |
| `3` | 数字 | 条件严格比较、数值计算时类型有意义。 |
| `true` / `false` | 布尔值 | 字符串 `"false"` 不是关闭。 |
| `[]` / `{}` | 明确保留的空数组/对象 | 不等于没有该键；是否允许空值由模块决定。 |
| 缺省键 | 此处未显式设置 | 可能继承、使用默认或不启用，不能统一解释为 false。 |
| `null` | 显式空值 | 可选不代表允许 null；除非对应类型明确允许，否则不要填写。 |

正式 JSON 不支持注释、尾随逗号或省略号。本手册的解释位于旁边的表格，不写入应用 JSON。修改了 ZIP 内部 JSON 后，原 manifest 的字节数和 SHA 就失效；不要直接替换 ZIP 内容后继续使用旧摘要，应重新通过编辑器导出。

### 定位写法

文中 `nodes[]`、`fields[]` 是“数组中的一项”的阅读占位，不是文件里真的有一个名为 `[]` 的键。实例索引提供的是确定位置，例如 `$.nodes[12].fields[4]`。

阅读器另支持标准 JSON Pointer：`/nodes/12/fields/4`。数组从 **0** 开始编号；空 Pointer 代表根对象。键内 `/` 编码为 `~1`、`~` 编码为 `~0`。

行号仅对应本手册所附的完整 JSON；在其他编辑器重新格式化后，优先按稳定 ID 和路径寻找，不依赖旧行号。

## 4. 整包的第一层

| 键 | 中文意义 | 当前读法 |
| --- | --- | --- |
| `schemaVersion` | 整包结构标记 | 固定 `cairnmap.config-package.v3`。 |
| `contractRevision` | 契约兼容版本 | 当前 `11`，决定迁移和允许结构。 |
| `packageId` | 配置包身份 | 本地版本归在同一包之下。 |
| `projectId` | 项目身份 | 不负责选择单个世界数据源。 |
| `revision` | 保存修订号 | 当前 `7`，与契约版本独立。 |
| `displayName` | 包显示名 | `zh`、`en` 双语对象。 |
| `engine` | 全局引擎默认 | 世界字段、上下文距离、交互、pane 及扩展默认。 |
| `registries` | 受控能力登记 | 布局/组件/工作流单元等稳定键。 |
| `nodes` | 分类树节点 | 当前 95 个，按 path 和 children 连接。 |
| `contextBindings` | 旧式上下文关系 | 当前 `[]`，不代表主附属结构功能消失。 |
| `workflows` | 工作流 | 当前 28 个，包括采集与编辑方案。 |
| `parity` | V1 对齐凭证 | 用于追溯迁移内容。 |
| `application` | 总体规则 | 世界、来源组、图层按钮、模块、审核、偏好。 |
| `lookupTables` | 公共表 | 所属枢纽区、出行方式、标准标签字段。 |

## 5. 分类：先确定“在哪一层”，再读设置

一个节点的 `path` 最多四级：`class → kind → skind → skind2`，不允许跳过中间层。只有 Class 的节点负责 Class 级配置；选择到 Kind 后，创建的下一层就是 SKind。

| 键 | 意义 | 人工核对 |
| --- | --- | --- |
| `nodeId` | 节点稳定 ID | 不等于分类代码；引用和 children 要用完整 nodeId。 |
| `path` | 分类身份 | 代码保存在这里，名称改变不应改变代码。 |
| `classificationLabels` | 各层中文/英文名 | 不是字段 labels；只给分类层级命名。 |
| `children` | 直接子节点 ID | 必须正好对应 path 中下一层的实际节点，不能指向孙节点。 |
| `inheritDown` | 向下传递开关 | fields/card 与 display 的行为不同，见下节。 |
| `receiveFromParent` | 当前节点接收选项 | 不能屏蔽已经固定硬继承的字段。 |
| `fields` | 本地字段定义 | 不是“所有有效字段”的自动展开清单；还须看祖先。 |
| `fieldSettings` | 字段设计附属规则 | 主附属身份与分类搜索设置。 |
| `geometryType` | 固定几何类型 | Point、LineString 或 Polygon。 |
| `geometryProfiles` | 对应几何能力/渲染 | 当前通常只启用与 geometryType 相同的一种。 |
| `card` | 本地信息卡 | 子级缺省时由继承与合成规则得到最终卡。 |

配置路径内使用 `class/kind/skind/skind2` 小写键。实际要素数据记录使用 `Class/Kind/SKind/SKind2`；旧记录还可能兼容 `Skind/Skind2`。不要手动把这些不同场景的大小写统一。

### 继承如何读取

1. 沿当前 path 找到从 Class 到当前节点的祖先链。
2. 字段按 `key` 合成。r10+ 的父级向下字段与 `sealed` 字段属于固定继承，子级不能用另一个同名定义取代；`localOnly` 不向下传递。
3. 显示按 `inheritDown.display`、本地 geometryType/profile 与接收规则解析。后代本地配置可替代允许软继承的显示设置；不能只看父级有没有 rules。
4. 信息卡按当前硬继承规则合成；`inheritFrom: {nodeId,itemId}` 标识来源单元。来源字段、名称和对照保持同步，子级仍可维护允许独立的显示器、顺序与分区。
5. 旧 `policies` 用于兼容；当前解析优先使用 `inheritDown`。

“本地字段未出现”不等于字段不存在。“子级出现了同名字段”也不保证其定义有权覆盖父级。

## 6. 字段定义：key、fieldId、显示名称分开读

| 键 | 读法 |
| --- | --- |
| `key` | 实际记录字段路径，如 `Name`、`direction`、`extensions.link.wiki`。点号表达嵌套路径。 |
| `fieldId` | 稳定身份，如 `RLE-direction`，被实时绑定引用。不同 key 不可在同一有效分类中共用 fieldId。 |
| `type` | string 文本 / number 数字 / boolean 布尔 / enum 枚举 / json JSON / reference 关联。 |
| `cardinality` | single 单值；multiple 数组多值。与几何多部件不是同一个开关。 |
| `labels`、`description` | 中英文名称和说明；不改写真实存储值。 |
| `input`、`format` | 建议输入方式及受控格式；工作流预填后有自己的控件设置。 |
| `required`、`requiredWhen` | 必填约束；`validateExistingData` 决定是否额外检查已挂载旧记录。 |
| `coordinateFormat` | JSON 字段专用的 CoordP/CoordL/CoordG 或 pointObject 结构声明。 |
| `optionTable` | 本地对照表，具有 valueType 与 rows。 |
| `optionsTableId` | 直接引用公共表；同一来源变化后使用方读取有效内容。 |
| `optionValueType` | enum/select 最终保存值类型；与表格 valueType 相容。 |
| `inheritance` | sealed 固定继承；overridable 可覆盖；localOnly 本层使用。 |

`tags`、`extensions` 不是两个合成的根字段定义；定义的是 `tags.xxx` 或 `extensions.xxx.yyy` 这样的完整路径，scope 可另外标出其分组。

字段契约仍保留部分旧 `defaultValue/placeholder/requiredWhen/reference/scenes`。字段表会列出它们，是因为读取旧配置不能丢失这些信息；不要由“类型仍允许”推断当前编辑器每个页面都会提供同样的输入框。

## 7. 对照：文字“3”如何保存成数字 3

| 位置 | 例子 | 意义 |
| --- | --- | --- |
| `optionTable.valueType` | `"number"` | 真实标量类型。 |
| `optionTable.rows[].value` | `"3"` | 行键使用文本编码，便于统一保存。 |
| `optionTable.rows[].label.zh` | `"展示线"` | 给人看的名称。 |
| 实际记录 `direction` | `3` | 按 number 类型保存的实际值。 |

因此，RLE 的 direction 行键为字符串 `"3"` 是正常结构，不代表实际记录应保存字符串 `"3"`。不要把名称“展示线”写回 direction 数据值。

### 四种来源关系

| 文件结构 | 模式 | 是否随来源更新 |
| --- | --- | --- |
| 本地 `optionTable` | 自填或预填后的副本 | 否，可继续本地编辑。 |
| `optionsTableId` | 绑定公共表 | 是。 |
| `optionsFieldRef: {nodeId,fieldId}` | 绑定字段的对照表 | 是。 |
| 信息卡 `fieldBinding: {nodeId,fieldId}` | 绑定字段设计 | 是，相关标题/来源/格式等按实际字段绑定规则解析。 |

预填后的 `prefillAudit` 只保留核验用指纹，提醒可能过期，**不是**实时引用。解除绑定时复制当前有效内容成为可编辑本地表；缺失来源、歧义 fieldId 或不兼容的值类型会阻断核验。

同一个使用项不可同时保留互相冲突的绑定来源与本地对照行。不要只删除一个表 ID、却把其他来源引用留在对象里。

## 8. 公共表与功能值

当前三张公共表：

| ID | 名称 | 主要内容 |
| --- | --- | --- |
| `teleport-hubs` | 所属枢纽区 | 存储值、名称与枢纽功能参数。 |
| `road-travel-modes` | 出行方式 | 存储值、名称与速度等功能数值。 |
| `standard-tag-fields` | 标准标签字段 | 标签字段键、名称及对应输入类型元数据。 |

`functionKind` 决定 functionValue 是普通数字、枢纽对象还是标签字段元数据。字段/信息卡/工作流的名称对照主要使用 value、label；功能模块是否已经读取 functionValue，要看对应执行器，不能仅因表格存在就推断路径规划已自动改为读取它。

标准标签表内的 `functionValue.type` 是标签输入类型；如果为 select，可另外携带 valueTable/valueTableId。自定义“其他字段”是输入通道，不需要伪装成这张固定表中的不可删除字段。

## 9. 几何、多部件与坐标返回

| 位置 | 意义 |
| --- | --- |
| `nodes[].geometryType` | 该分类固定为点、线或面。 |
| `geometryProfiles.<几何>.enabled` | 该几何能力是否启用。 |
| `geometryProfiles.<几何>.allowMultipleParts` | 该分类是否接受多个几何部件。 |
| `geometryProfiles.<几何>.anchor` | 完整要素中心 featureBbox，或各部件中心 perPart。 |
| `workflows[].steps[].drawing.multiple` | 当前绘制页是否允许多部件/多点。 |
| 字段 `cardinality` | 数据字段是否是多值数组；不是几何部件数。 |

**当前实际限制：** 分类单部件限制在原生组合式工作流最终记录检查时生效，但“多部件开关／添加部件＋”尚未在所有入口按最终分类即时禁用。工作流页的“添加部件”主要受自身 drawing.multiple 控制。此手册只记录该缺口，本次未修改应用功能。默认 95 个已启用几何配置目前全部允许多部件。

以下是坐标数据结构示意，**不是本默认文件中新增的配置记录**。三元组统一为 `[x,y,z]`，其中 y 是高度：

```json
{
  "CoordP": [[100, 64, 200], [110, 64, 210]],
  "CoordL": [[[100, 64, 200], [110, 64, 210]]],
  "CoordG": [[[[100, 64, 200], [110, 64, 200], [110, 64, 210]]]],
  "pointObject": { "x": 100, "y": 64, "z": 200 }
}
```

| 格式 | 嵌套含义 |
| --- | --- |
| CoordP | 点数组，每个点一个三元组。 |
| CoordL | 部件数组 → 每个部件的点数组 → 三元组。 |
| CoordG | 部件数组 → 每个部件的环数组 → 每个环的点数组 → 三元组；第一个环是外环，其后是孔环。 |
| pointObject | 仅一个 `{x,y,z}` 点，不能同时宣称允许多点。 |

TPP 的额外目标点可以用 pointObject 返回并绑定到 TGtcoordinate；它与 TPP 自身几何点是不同绘制页。不得把 pointObject 的一层对象结构当作标准 CoordP 数组。

## 10. 渲染规则：先 Zoom，后条件，再看效果

读取顺序：`geometryProfiles.<几何>.zoomPriority.rules[] → when.zoom → when.fields → representation/style/label/extensions`。

当前含 when 的原生规则采用**数组后面的匹配规则优先**。所以“无额外字段条件的基础规则在前，特定条件分支在后”是有意的安排，不是必然的重复错误。V1 旧读入分支还有兼容逻辑，不能只移动数组而不重新核验。

| 键 | 含义 |
| --- | --- |
| `when.zoom.min/max` | 含两端的逻辑 Zoom 区间，当前逻辑范围 0–8。 |
| `when.fields` | 仅非分类字段的组合条件；分类范围已经由所在节点决定。 |
| `representation` | hidden 隐藏 / geometry 源几何 / point 点表示 / labelOnly 仅文字等。 |
| `style` | 几何描边、填充、线型、符号等。 |
| `label` | 文字内容来源、外观、碰撞角色等。 |
| `extensions` | 本规则的沿线、锚点、候选、可见性、缓存、密度及回退策略。 |
| `conditionalOverrides` | 同一规则内的旧条件分支覆写，仍须一起阅读。 |

`renderState: "unconfigured"` 表示显示尚未设计，不等于几何能力被禁用。不能通过删掉低 Zoom 规则来假定低 Zoom 一定隐藏；还须检查无匹配时的实际回退策略。

### 三个独立的“优先级”

| 区域 | 典型路径 | 作用 |
| --- | --- | --- |
| A 几何层级 | `geometryStack.zLevel`、pane、zIndexOffset | 真实几何画在哪个层，谁覆盖谁。 |
| B Label 碰撞 | `label.collision.role/basePriority/metric` | 标签碰撞时保留谁。 |
| C 显示权重 | `priority.mode/base/metric` | 当前显示优先权的分数贡献。 |

三个位置同样可能出现数字，不能互相代替。面积/长度/字段指标可含 multiplier、divisor、rounding、min/max；field 指标必须指向存在的单值数值字段或数值枚举。

### 字段组合条件

`formula.terms[]` 将条件命名为 C1/C2；`formula.expression` 决定 AND/OR/NOT 与括号关系。优先级为 NOT → AND → OR。`manual: true` 时以手工公式为准，不再按 relation 行连接自动生成。

`((C1))` 与 `C1` 在布尔意义上相同，额外括号常来自旧条件树迁移，单个条件并不需要它们。若删除 C1 行，还必须修复引用它的公式。不要只因为公式存在就忽略 terms 中实际字段和值。

## 11. 三种不同公式不要混用

| 场景 | 文件位置 | 正确例子 | 引号意义 |
| --- | --- | --- | --- |
| Label 组合文字 | `label.template` | `"bureau""line"` | 模板双引号内部是字段路径；相邻片段直接连接，无需 +。 |
| 工作流输出组装 | `assignments[].expression` | `join("_",WorldPrefix,Class,A)` | 引号内部是字面文字；无引号的 A 是槽位/系统 token。 |
| 渲染条件公式 | `when.fields.formula.expression` | `C1 AND NOT C2` | C1/C2 是条件编号，不是字段名，也不是工作流槽位。 |

搜索控件 `displayTemplate` 另用 `{{ID}} ({{Name}})` 双花括号，不属于以上三种。

JSON 中存储带双引号的 Label 模板时，还需要 JSON 字符串转义。因此实际 JSON 为 `"template": "\"bureau\"\"line\""`。解码后的模板才是 `"bureau""line"`。

工作流表达式是受控小语言，不执行 JavaScript。`+` 是文本连接；数值运算使用 add/subtract/multiply/divide。所有可用函数及含义列在本手册后附的函数表。

## 12. 信息卡怎样读

先看 card.mode：

| mode | 意义 | 后续看哪里 |
| --- | --- | --- |
| fields | 普通逐字段信息卡 | items 与 remaining。 |
| layout | 使用受控布局 | layoutId 与 options。 |
| component | 使用受控代码组件 | componentKey；当前保留 TRP 专用能力。 |

普通单元读取 `source → fallbackSources → renderer → label/section/visible/hideWhenEmpty → 对照/引用`。

| 单元字段 | 意义 |
| --- | --- |
| `id` | 单元稳定身份；本地与合成后均须无歧义。 |
| `source` | 当前记录字段路径，不是 nodeId/fieldId。 |
| `renderer` | text 普通文字、tag 标签、nameColorCapsule 名称颜色胶囊、lineChips 关联线路等。 |
| `label` | 单元本地中英文标题。 |
| `fieldBinding` | 整个字段设计的实时引用，信息卡专用。 |
| `optionsFieldRef` / `optionsTableId` | 只绑定对照表。 |
| `optionTable` | 本地可编辑对照副本。 |
| `inheritFrom` | 硬继承单元的来源。 |
| `remaining` | 其余未显式列出的字段如何展示；不是任意字段都自动获得意义映射。 |

当前 RLE.direction 单元带有 prefillAudit，不能仅凭该审计标记就认为它已实时绑定方向对照。请按实际是否存在 fieldBinding/optionsFieldRef/optionsTableId/optionTable 判断。EXAMPLES 中保留这一实际状态，不人为补写绑定。

关系胶囊 `lineChipSource` 的显示名称是：platform 当前站台（向下一层关联）、station 当前站场（向下二层关联）、stationBuilding 当前车站建筑（向下三层关联）；文件仍保存这些稳定英文键。

## 13. 主附属结构与搜索

`fieldSettings.structure`：先看 enabled，再看 role。

| role | 必要设置 | 含义 |
| --- | --- | --- |
| main | memberField 可选 | 主结构可保留指向附属成员的反向字段，但不限制附属 Class。 |
| member | hostField、selectorField 必填 | 附属结构按字段指向任意合法主结构 ID，按另一个字段标识层级。 |

搜索在 `fieldSettings.search`：queryFields 决定可匹配字段；subtitle 决定灰色副标题；extension 决定胶囊延伸区域。开启搜索时 Name/ID 属于基础来源，额外字段可以加入。

subtitle.mode 为 classification / classificationField / field；后两种使用 field。valueMode 为 value 原值 / meaning 本地意义 / reference 把值作为 ID 查目标字段。referenceDisplayField 常为 Name，目标可能跨多种主结构分类。

meaning 需要有效的值到名称对照。extension.mode 为 none / nameColorCapsule / lineChips；关联线路重复分段会按既有索引合并，不通过复制显示多个相同胶囊实现。

## 14. 工作流：控件槽位不等于输出字段

先看 mode：composed 是组合式，external 是受控成品外部单元。`quickMapping !== false`、非 dedicated、且非 external edit 的方案才进入便捷测绘采集选择。

组合式工作流按以下链路读取：

```text
steps[] 的页面顺序
  → controls[] 收集输入，写入 slot
  → geometry 页采集实际坐标/额外绘制
  → outputs[] 按 assignment.expression 组装
  → 写入 assignment.target 对应记录字段
  → 核验并提交整个输出批次
```

| 位置 | 读法 |
| --- | --- |
| `actor` | 填写人要求；actor 页在第一步。 |
| `steps[].kind` | 当前主要 actor/form/geometry；旧 tagsExtensions 页面被迁移为信息页内固定单元。 |
| `controls[].id` | 控件稳定身份。 |
| `controls[].slot` | 运行时槽位，如 A、F、TARGET_POINT。 |
| `controls[].kind` | text/number/select/toggle/group/featureSearch/classificationPicker/tagsExtensions 等。 |
| `controls[].columns` | 1 整行 / 2 半行 / 3 三分之一行。 |
| `valueNormalization` | 保留、trim、abbr、number 等值处理。 |
| `controls[].when` | 控件启用条件，引用先前槽位。 |
| `steps[].when` / `outputs[].when` | 绘制页与输出的启用条件。 |
| `drawing.bindings[]` | 将绘制的 geometry 或有效 height 写入目标输出字段。 |
| `outputs[].classification` | 目标分类范围；系统分类控件可在此范围内选择最终类别。 |
| `outputs[].assignments[]` | target 是记录字段，expression 是槽位/受控公式。 |

同一输出目标字段存在多条写入时，核验必须能证明互斥；无条件重复或不能证明互斥会阻断。不同输出的同名字段分别计算。系统维护的世界、分类、时间和几何字段不要再用普通赋值重写。

### 重复字段组

storage 为 object 时输出 `[ { "mode": "endpoint", "tgt": "目标ID" } ]` 形式；storage 为 scalar 时输出 `[ "目标ID" ]` 形式，并且只允许一个 key 为空的子字段。mode/tgt/code 等是重复组内部的真实成员键，不是新的根字段。

### 条件、额外绘制和返回

工作流条件使用 token/operator/value/values，或 all/any 条件树；和渲染条件的 C1/C2 不是同一结构。空白与未填按该条件执行器判断，0/false 不视为未填。

输出绘制页通过 outputId 绑定输出；额外绘制页使用 `geometryRole: "auxiliary"`，通过 captureSlot 与 bindings 进入输出。返回信息页时保留最后离开的绘制页状态；再次经过另一绘制页会切换活动绘制。

标签与扩展是信息页内不可删除、可移动的 tagsExtensions 固定单元，默认内容可以是空。不要为它另造一个新根字段或旧式独立页面。

## 15. 编辑用方案与外部方案

editor.enabled 表示可用于再次编辑；editor.scope 给出适用分类范围。标准转换要求三页、一个输出几何绘制、没有额外绘制且没有条件启用的输入模块。转换时会去掉仅用于 ID 组装的输入，增加顶部完整 ID 输入，并将已有要素值回灌。

editor.dedicated 与 quickMapping:false 可使某方案仅供编辑，不出现在便捷采集选择中。铁路/车站采集继续由成品外部方案承担，对应 Class 的编辑方案单独保留。

external.purpose 区分 capture/edit。编辑型外部 TRP 是已经完成的方案，不在打开时再按普通信息卡临时推导。componentKey 是已登记单元键，写一个新字符串不会自动生成执行器。

## 16. 世界、来源组和瓦片

当前 application.sources 使用 `kind: "world-groups"`。

```text
本地世界 id
  → bindings[世界id]，缺省使用 defaultGroupId
  → groups[] 中对应来源组
  → 组内 sources 的正式数据/媒体链路
  → 组内 tiles 的瓦片模板
  → remoteWorldId 或本地 id 代入 {world}
```

默认一个共享来源组，bindings 当前为空。未来可增加来源组，让指定世界群使用另一套数据、媒体与瓦片链路；未绑定世界继续走默认组。不要同时往同一世界再写旧 dataSourceId/projection/tiles。

| 字段 | 人工阅读要点 |
| --- | --- |
| worlds[].id | 应用内部世界身份。 |
| worlds[].remoteWorldId | 服务器路径标签，可选；不改变应用内部 ID。 |
| worlds[].prefix/numericCode | ID 组装前缀和世界数值编号。 |
| sources.groups[].sources.items | 当前组内正式数据源选项。 |
| rootUrl/mediaRootUrl | 数据与媒体根地址。 |
| dataPathTemplate/mediaPathTemplate | 根地址下的相对世界路径；当前为空代表直接使用根，不是额外空目录。 |
| tiles.baseUrlTemplate | 例如 `.../_{world}/tiles/world/`，按远端标签代入。 |
| tiles.filteredAccess/proxyId | 直连或已部署的受控同源代理；新增服务器代理仍需部署注册。 |
| sources.sharedInterfaceGroupId | 当前共享接口组声明；现有解析器不会因此生成多套审核或玩家后端。 |

当前数据读取协议仍限正式发布读取器；“允许多个服务器来源组”不意味着已经支持任意 Dynmap 原始要素接口或自动创建跨域代理。

### 共享 Zoom 与默认投影

`preferences.map.logicalInitialZoom` 使用逻辑 Zoom；`Leaflet Zoom = 逻辑 Zoom + leafletOffset`，当前偏移 -3。渲染规则的 2–4 是逻辑 Zoom，不是瓦片原生编号。

普通世界省略投影矩阵，运行时使用 dynmap-flat 固定默认。瓦片额外缩放、原生上下限和重试参数位于组内 tiles，省略成员按 DEFAULT_TILE_SETTINGS 解析：prefix=flat、imageFormat=jpg、extraZoomLevels=2、minNativeZoom=-2、maxNativeZoom=3、maxRetries=3、retryDelay=1000ms。只有特殊投影才保留 projectionOverride。

## 17. 图层按钮、模块和审核

图层按钮读取 `application.buttons.items[]`，名称/尺寸/分组和 ID 保存在同一个对象中。criteria.paths 每行含连续 Class/Kind/SKind/SKind2 范围：**同行取 AND，多行取 OR**。例如 natural_geo 两行分别为 ISG/NGF 与 ISL/NGF。

behavior 中 exclusiveWith/exclusiveGroup 控制互斥；linkedButtons 控制有方向的状态联动；persistState 控制浏览器状态保存。storageKey 是浏览器键，legacyStorageKeys 仅用于旧键迁移，不是服务器接口。

modules 控制入口、加载方式和互斥，review 控制审核协议及接口。review.serverReferences 保存服务器环境变量的名称，配置文件不应包含对应密钥值。

**当前完整副本是下游真实默认状态，审核 enabled=true 且接口路径已设置，不是上游空接口模板。** 不能把它误认成已经完成上游清空适配的样例。

## 18. 字段表怎样使用

1. 先用实例索引找到节点/工作流和 JSON 行号。
2. 判断所在对象类型，例如 GeometryProfile、RenderLabelStyle、WorkflowControl。
3. 在 FIELD_REFERENCE 中查该类型的表，逐键对照中文解释。
4. 如果值是另一个对象，沿“类型/子结构”链接进入下一张表。
5. `必填` 仅表示该结构分支的类型必需项；语义核验还会检查引用、互斥、类型和当前契约要求。`可选` 不代表所有场景都可省略。
6. 标有“契约支持但本包未出现”的结构是备用或兼容能力，不是完整 JSON 漏了内容。表中的实例路径可能显示 Point，是类型遍历首次到达位置；同一结构也可复用在线和面上。

表内“本包示例”均来自所附原始 JSON 的真实值与真实位置；不将默认值当作未出现字段的实际值。

## 19. 人工修改与核验

| 修改内容 | 同时核对 |
| --- | --- |
| 改字段 key/fieldId | 工作流 target、对照/字段绑定、信息卡 source、渲染条件及指标、搜索路径。 |
| 改字段类型/对照值 | optionValueType/valueType、控件返回类型、组数组结构、输出公式。 |
| 改分类路径或子树 | children、所有分类范围引用、编辑方案 scope、来源节点引用。 |
| 改渲染 Zoom/顺序 | 基础覆盖、特例后置、空档回退、Label 和几何显隐。 |
| 删表格/字段来源 | 所有 optionsTableId/optionsFieldRef/fieldBinding。 |
| 改工作流页/槽位 | 条件只能使用已可用的值，captureSlot 派生值、输出绑定与 ID 依赖。 |
| 改世界/来源组 | ID 唯一、默认项存在、bindings 有效、地址模板与代理确实可用。 |

人工编辑后建议先作为新文件导入编辑器，查看导入报告，分别核验修改模块，再核验整包并重新导出。不要仅凭 JSON 语法正确就认为可启用。

当前核验分为结构、模块语义、跨模块引用/类型以及导出/启用边界。错误会阻断；警告需要人工确认。未知动态 JSON 结果可能只能警告，不代表静态检查能证明任意运行值都合法。

版本兼容：旧 r8–r11 **整包**可读取并迁移；r9 的单分类/树文件缺完整上下文时，须先导入旧整包、升级，再重新导出分类。未知未来契约不能通过改 contractRevision 数字强行读入。未知历史保留原文用于诊断，不会自动成为活动配置。

## 20. 本手册边界与维护

本次只生成文档、完整配置副本与只读阅读器，不修改默认配置、编辑器运行逻辑或上一次发现的多部件入口缺口。当前本地浏览器另存的活动版本可能不同；本手册始终以 manifest 中指定的应用默认 JSON 为基准。

手册由实际 TypeScript 契约、原生结构检查表和完整默认 JSON 交叉生成。更新配置后运行 `node scripts/config-tools/generate-runtime-json-handbook.mjs` 生成；运行同一命令加 `--check` 可确认来源、字段覆盖、实例定位和交付文件未失配。

不能通过手改字段表来添加应用能力。新增能力仍要先更新实际类型、验证和解析代码，再重新生成手册。

## 21. 工作流表达式函数表

| 函数 | 中文功能 | 写法 | 解析 |
| --- | --- | --- | --- |
| `join` | 可选段拼接 | `join("_",A,B)` | 以分隔符连接非空片段，保留 0 和 false。 |
| `coalesce` | 首个非空值 | `coalesce(A,B)` | 取首个非空值，0 和 false 不跳过。 |
| `text` | 转为文本 | `text(A)` | 以受控方式将值转换为文本。 |
| `number` | 转为数字 | `number(A)` | 返回有效有限数字，无效值报错。 |
| `trim` | 去除两端空白 | `trim(A)` | 返回去除两端空白后的文本。 |
| `upper` | 转大写 | `upper(A)` | 将文本转换为大写。 |
| `lower` | 转小写 | `lower(A)` | 将文本转换为小写。 |
| `abs` | 绝对值 | `abs(A)` | 返回有限数字的绝对值。 |
| `round` | 四舍五入 | `round(A)` | 将有限数字四舍五入为整数。 |
| `add` | 数值加法 | `add(A,B)` | 按数值相加；+ 仍保持原有文本拼接。 |
| `subtract` | 数值减法 | `subtract(A,B)` | 按数值相减。 |
| `multiply` | 数值乘法 | `multiply(A,B)` | 按数值相乘。 |
| `divide` | 数值除法 | `divide(A,B)` | 按数值相除；除以零报错。 |
| `point` | 单点坐标对象 | `point(A)` | 将一个点的 CoordP 数组变为 {x,y,z}；多点报错。绘制返回格式已提供直接选择。 |
| `x` | 首点 X | `x(A)` | 读取坐标对象或规范几何数组的首点 x。 |
| `y` | 首点 Y | `y(A)` | 读取坐标对象或规范几何数组的首点 y。 |
| `z` | 首点 Z | `z(A)` | 读取坐标对象或规范几何数组的首点 z。 |

系统 token 包括 ID、World、WorldPrefix、Class、Kind、Skind、Skind2、Creator；多个输出还提供按输出编号后缀的系统值，如 ID_1。普通输入槽位来自当前工作流自身定义。ID 是可变化的组装值，不可用它证明两个 ID 写入条件永远互斥。

## 22. 当前文件的一级位置

| 区块 | JSON Pointer | 完整 JSON 行号 |
| --- | --- | --- |
| `schemaVersion` | `/schemaVersion` | 2–2 |
| `contractRevision` | `/contractRevision` | 3–3 |
| `packageId` | `/packageId` | 4–4 |
| `projectId` | `/projectId` | 5–5 |
| `revision` | `/revision` | 6–6 |
| `displayName` | `/displayName` | 7–10 |
| `engine` | `/engine` | 11–222 |
| `registries` | `/registries` | 223–944 |
| `nodes` | `/nodes` | 945–107987 |
| `contextBindings` | `/contextBindings` | 107988–107988 |
| `workflows` | `/workflows` | 107989–114667 |
| `parity` | `/parity` | 114668–114957 |
| `application` | `/application` | 114958–115554 |
| `lookupTables` | `/lookupTables` | 115555–115847 |

完整分类与工作流清单见 [INSTANCE_INDEX.md](INSTANCE_INDEX.md)。全部结构与枚举见 [FIELD_REFERENCE.md](FIELD_REFERENCE.md)。
