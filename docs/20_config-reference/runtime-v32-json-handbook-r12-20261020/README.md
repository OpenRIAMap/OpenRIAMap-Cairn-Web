# 配置 JSON 人工阅读手册 · 契约 r12

日期：2026-10-20。基于已注册正式配置 r9/契约 r11 生成的**未发布审查候选**；本地候选建议修订 r10，线上修订仍由发布端按历史自动分配。正式站点不会因阅读或下载本手册切换。

| 文件 | 用途 |
| --- | --- |
| [current-full.config.json](current-full.config.json) | 完整、无删减、可导入的 r12 候选；与审查 ZIP 的 config.json 字节一致。 |
| [FIELD_REFERENCE.md](FIELD_REFERENCE.md) | 全部 200 种对象结构、1121 个字段位置的类型、中文解释、必填性和 JSON Pointer/行号。 |
| [EXAMPLES.md](EXAMPLES.md) | 图标单项/映射、四种图片、五种取色、胶囊、英文贴线完整子对象。 |
| [INSTANCE_INDEX.md](INSTANCE_INDEX.md) | 分类、规则、工作流及总体设置的稳定 ID 和行号。 |
| [schema.json](schema.json) | 应用实际使用的结构 schema 副本，语义错误仍须通过编辑器/共享核验。 |
| [manifest.json](manifest.json) | 精确字节、来源与输出摘要。 |

完整 JSON SHA-256：`555369d1609c6e4f01dceeb898616458c9b9295c121ef5fd6d0d1474f216282b`。当前共 95 节点、28 工作流。

## 从第一层开始阅读

| 路径 | 作用与顺序 |
| --- | --- |
| schemaVersion / contractRevision | 整包标记仍为 cairnmap.config-package.v3；12 表示消费端须具备新增能力。 |
| packageId / projectId / revision | 包/项目身份与内容修订；revision 和契约版本互相独立。 |
| engine | 共用默认；逐规则 extensions 按原有继承/覆盖逻辑生效。 |
| application | 世界、来源组、世界路径模板、瓦片、共享 Zoom、按钮和模块；r12 未更换数据仓库。 |
| resources | Pinhead 固定版本与摘要，不是世界数据链路。 |
| nodes[] | 分类路径、字段、几何能力、规则和信息卡；children 用 nodeId 连接。 |
| lookupTables[] | 公共保存值/显示名；绑定为引用，预填为可编辑副本。 |
| workflows[] | 输入步骤、控件、组合输出及字段引用。 |
| parity | 历史对齐凭证，不替代可执行规则。 |

先找 node.path 的 Class/Kind/SKind/SKind2，再查 geometryProfiles.Point/LineString/Polygon 和 zoomPriority.rules。规则数组仍是**最后命中的完整规则生效**。分类字段不重复放进业务字段组合条件。旧信息卡、工作流、数据来源和表格的详细阅读法见[历史完整手册](../runtime-v32-json-handbook-r11-r7-20261017/README.md)；本版字段表覆盖当前整个契约，不需依赖历史字段表拼接。

## 点外观与定位

style.pointSymbol.kind 只允许 shape/icon/externalImage 一个活动分支。基础形状放 shape；图标放 icon；图片放 image。图标或图片统一在该规则末尾放 fallback，完整基础形状但不能再次包含图标/图片。旧 style.pointShape/icon/size/weight/stroke/fill 等不能与 pointSymbol 并存。symbolOffsetPx、symbolVisibility、symbolAnchor 继续放 style 外层。

图标 sizePx 为 1–512；图片 width/height 为 1–2048 CSS px。opacity 为 0–1；描边为 0–72。每个映射行分别保存自己的尺寸、锚点和局部偏移；fallback 属于整个规则，不属于每行。锚点中心/边角或 custom 的 x/y 相对图片左上角；正局部 X 向右、Y 向下。该局部调整只移动图标/图片，不移动 Label、不改变回退位置；整体符号 XY 与 Label 原有关系保持。

图片 URL 接受安全 http/https 或同源相对路径，禁止脚本/data 协议和凭据。外部ID来源仅在当前已加载数据源/世界查找唯一 ID，重复/缺失/无 URL/加载失败走统一回退；不凭空请求其他服务器。pending 状态保留 Label，不画回退来回闪烁；确认失败再画回退。

## 图库与颜色

Pinhead v25（npm15.25.0）固定2318项 SVG、分类和索引；CC0许可随包保留。resources.iconLibraries 中版本与清单 SHA 必须与 Web/核验器一致，未知能力阻断。界面两页弹窗仅确认后保存，取消/Esc放弃内部草稿。

固定/本字段/字段值映射/外部要素字段/关联线路共五种取色，适用于描边、填色、图标前景/底板和胶囊三个颜色。映射保存值严格区分文本、数字和布尔，0/false 不是空值；重复值、错类型、失效引用会核验阻断。

## 自定义胶囊与贴线扩展

custom_pill_1 的唯一字号在 label.style.size，6–72px。pill 保存四个比例、三个 RenderColorBinding、strokeWidth（0–72px）；没有第二份字号。行高比例>0且≤10，其余比例0–10；0保留。内边距/圆角按字号乘比例再取整；行高为乘积；外框每边增加描边宽度，实际圆角≤宽高的一半。字重700、字体沿用地图；旧线路颜色胶囊比例未修改。

scriptAware 令英文/数字/空格连续沿线，中文保留直立规则；CJK字数/紧凑推进只影响中文。actualText 根据真实字宽和每端留白判断路径，fixed 继续固定阈值。普通/急弯字距仍采用原有阈值算法，不引入字形两两碰撞优化。严格 SVG+chainageSearch 失败必须明确 hide 或合法 SVG 回退，不能同时声明无效 HTML 回退。候选/标签/字形总预算、重定位次数仍有效；只缓存字体文本度量，不持久化视口坐标。

## 核验、预览与启动记录

“显示第n行”“显示效果”和 Name 中/英/回退只向验证器的临时样例注入值，不写 JSON/ZIP/工作台草稿/真实要素。映射与整组条件是独立选择域，共同求值；按实际最后命中覆盖处理条件互斥。无解与预算内未判定严格区分；只有可证明的结构/值域矛盾阻断。

启动只比对 Web 静态身份，原始字节+精确身份+核验记录可持久化；完整索引每次本地重新整理。核验记录须同时匹配字节、契约、核验内核和资源指纹，不能替代编辑后的全局核验。普通启动/焦点不请求 SCF；审核模块打开或中继包上传才查 SCF/Web 一致性，不一致阻断该业务、保留地图和草稿。中继包采集版本不同本身不构成拒绝理由。

## 手工阅读与兼容

JSON 不支持注释、尾逗号或省略号；缺键、空数组、null 含义不同，不得用 null 填任意可选项。数组顺序与稳定 ID 有业务意义。ZIP修改后必须重新生成 manifest摘要，建议经编辑器导出。r8–r11历史 JSON/ZIP仍可导入；显式迁移到r12草稿，经完整核验保存生效。旧 hide 图片回退不擅自替换为圆点，必须人工确认。

部署顺序为兼容r11/r12的 Pipeline核验能力→Web代码与静态图库→通过现有发布入口更新配置。下载候选不会自动发布。
