# c18 工作台与运行升级

本轮从正式 r151/c17 迁移；正式配置 r、契约 c、数据发布批次、世界内容版本仍是独立身份。代码支持历史正式契约及 c18，部署代码不会自动发布或迁移正式配置。

## 使用变化

- 分类、表格、引擎、总体规则和工作流成功核验保存后，生成带时间和父链的本机编辑检查点。自动缓存与下载不增加正式 r。审计位于可选 `reports/edit-audit.json`，可展开保存前后差异；正式包没有此附件仍能读取。
- 导入接力稿保留来源审计。未保存候选的临时包携带其来源快照，不伪造已通过核验的检查点。上传时服务端分配正式 r；协商修改字节后重新确认身份及摘要。精确发布内容在最终 Web 上确认后，本机才结束这轮未上传审计并使用新基线；期间出现新输入或内容不一致则保留工作区。
- 搜索改为顶部“搜索设置（软继承）”；包含关系归入显示与交互。字段是信息卡、显示和搜索传播的前置条件。解除传播保留有效副本，重建前比较后代，差异阻断且不部分修改。
- 主结构拥有自己的楼层最小 Zoom。未达阈值的主结构不进入楼层候选计算。包含关系仅控制可见性，几何、图标、Label 和交互沿用命中渲染规则；未绑定主结构的附属要素由独立显示开关决定。
- 功能范围统一使用四级分类的 `+` 并集减 `−` 并集。绘制输出的 self 精确项另行并入，减项只作用末端范围。工作流实际填写仍使用原平铺类型下拉框。
- 世界快捷清单独立保存及排序；关闭采集入口不关闭已有要素的编辑路由。停用或删除工作流会移除对应快捷清单引用。每个绘制输出都有独立分类和 tags/extensions 控件。
- 文本离焦或明确执行动作前提交。无效原文保存在工作区并阻断动作，不能丢弃原文后保存旧值。折叠排序手柄仅在关闭时可拖动；箭头不跨当前容器。
- 公告和关于使用受限富文本，图片上传/链接可分别控制。实验室只保留独立版本池、导入与编辑交接，不读取旁边的草稿；原始数据缓存仍按来源身份共享。
- 运行配置激活不删除其他世界持久缓存；读取失败时可明确使用同来源的完整本地版本，保持“未确认远端”状态。普通启动不增加 SCF 核验。

## 范围调用者台账

| 调用者 | 编辑与运行边界 |
| --- | --- |
| 图层按钮 | `LayerButtonsEditor`、`buttonClassification`、`buttonRuleFilter` |
| 导航与共享铁路角色 | `NavigationSettingsEditor`、`navigationDefinition`、`navigationRuntime`、`navigationValidation` |
| 编辑工作流 | `WorkflowEditingSettings`、`workflowEditing` 的选路、回填与最终保存 |
| 绘制分类与专用角色/引用 | `WorkflowClassificationGroupEditor`、`ExternalBindingsEditor`、`workflowClassificationGroup`、`externalBindings` |
| 搜索 | `NodeFieldSettingsEditor`、搜索 profile 及运行筛选 |
| 外部取色与信息卡关联 | `ColorBindingEditor`、`V3CardEditor`、`configPackageAdapter`、`cardInteractions` |
| 全部调用者 | `classificationScope.ts` 共用集合解析，Web/Pipeline 同源内核核验 |

选中哪个分类进行编辑、从精确分类预填字段等单点选择不属于功能范围，不增加加减条件。

## 部署

1. 先部署 Pipeline 配套四个 SCF ZIP，沿用现有环境变量、角色及触发器。新内核同时读 c17/c18，旧任务规则身份不重写。
2. 再部署本 Web PR。Vercel 使用仓库要求的 Node 24；构建仅运行现有离线生产门禁，不联系 SCF。
3. 确认 Web 与 SCF 配套后，在工作台导入本轮 c18 候选，查看迁移/内容修正报告，核验并保存整包候选，再全局核验、登录、服务端核验和确认发布。
4. 若正式基线已变化，重新从最新正式配置迁移并应用内容修正；不能覆盖后续编辑。不要预设下一正式 r 必为 152，以服务端保留结果为准。
5. 世界调拨与正式数据无须重跑；不重置 zth25、eden/naraku/houtu1，也不重发历史采集包。

服务端预检新增 `pending-v2` 能力协商。新页面等待同一个确定性核验任务；旧页面得到有明确原因的等待阻断。后台临时读取错误可重试，真实内容错误仍阻断。不得取消 Gate、签名或最终基线校验以消除等待。

## 验证入口

`npm run verify:ci`、`npm run build`；增量回归为 `npm run test:c18`。`scripts/config-tools/browser/c18-*-acceptance.py` 在隔离 Edge 和本机 Vite 上执行交互/IndexedDB 验收，接受 `CAIRNMAP_CDP_PORT`、`CAIRNMAP_APP_URL`、`CAIRNMAP_ACCEPTANCE_OUT`。测试 HTML 不属于生产构建入口。

`scripts/config-tools/prepare-c18-configuration.ts` 从仓库固定的 r151/c17 原件产生本轮候选与独立内容修正报告。当前特定修正为三个 FLR 可见规则、两个 TPP 枢纽下拉和一个 ROD 出行方式下拉；通用契约迁移不擅自给其他配置替换这些业务内容。
