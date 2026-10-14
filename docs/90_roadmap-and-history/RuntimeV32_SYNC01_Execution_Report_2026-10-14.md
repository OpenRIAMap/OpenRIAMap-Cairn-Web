# SYNC-01 步骤 1、2 执行与验收报告

日期：2026-10-14，Asia/Shanghai。范围为增量蓝图 v0.3 的 A、B 阶段。

上游 r9/r5 已发布到独立迁移分支并创建 PR；下游完成工作台覆盖、共享运行时整合、本地回退提交及限定范围的视觉/功能验收。没有合并两端 main，没有推送下游分支。阶段 C 的主体更新及阶段 D 的上游空置模板回写尚未开始。

## 1. 固定版本与入口

| 项目 | 固定值 |
| --- | --- |
| 上游仓库 | Ozstk639/CairnMap-Web |
| 上游 main 基线 | `5447e117a86d01f833bea012c1e0c09440489ff6` |
| 上游发布分支 | `codex/cm-config-runtime-v32-migration-20261007` |
| 上游最终发布 HEAD | `aa0bc688649dddc9fbc7ba55481e5ad5d312cc6a` |
| 上游 PR | [#26](https://github.com/Ozstk639/CairnMap-Web/pull/26) |
| 下游仓库 | OpenRIAMap/OpenRIAMap-Cairn-Web |
| 下游 main 基线 | `0f075e4c3075e1210c812f90932c8a47abb1fbc9`，执行后再次远端复核一致 |
| 下游集成分支 | `codex/ria-config-runtime-v32-integration-20261014` |
| 下游代码回退提交 | `10330d5f62a3d4db46911304b278183a3c371794` |
| 工作树 | `G:/RIAWebGIS/NewPRES/CairnMap_Codex/wt/ria-config-runtime-v32-integration-20261014` |
| 独立下游参考树 | `G:/RIAWebGIS/NewPRES/CairnMap_Codex/wt/ria-config-runtime-v32-baseline-20261014`，detached 固定基线 |

正在运行的本地入口：

- [下游工作台](http://127.0.0.1:5191/?workspace=config-studio&configMode=v3)
- [下游 V3 实验室](http://127.0.0.1:5191/?workspace=config-lab&configMode=v3)
- [下游正式 V1 页面](http://127.0.0.1:5191/)
- [固定下游 V1 参考页面](http://127.0.0.1:5190/)

工作台与实验室的应用默认值为契约 r9 / 配置 r5，无需首次上传。显式用户选择、自定义配置和恢复副本继续保留；主页面本轮仍运行 V1，没有执行 V3 转正。

默认资源 SHA256：`999d4afee9e1bfe9daf86639d95e2dae721d6c887cef3771fb1afa0d79df816e`。

## 2. 覆盖边界与下游保留情况

完整覆盖 `src/configStudio/**` 及 `src/components/Rules/configRuntime/**`，合计 91 个独占文件，包含全部编辑器、运行器、校验器、默认资源与适配器。按上游固定 main→r9/r5 的增量整合 40 个共享文件，并带入配置校验、冻结 fixture、浏览器验收脚本及历史蓝图。

最终 86 个独占文件的 Git blob 与上游冻结提交相同。其余 5 个有明确记录：

| 文件 | 差异 |
| --- | --- |
| ConfigLab.tsx | 工具条移至底部；桌面为缩放控件保留横向空间；窄屏自动换行并压缩说明，保留所有操作 |
| ConfigBootstrap.tsx | 桌面恢复副本提示横向避开地图缩放控件 |
| ConfigStudio.tsx | 仅删除尾部空白 |
| ColorBindingEditor.tsx | 仅删除多余文件尾空行 |
| RenderRuleExtensionsEditor.tsx | 仅删除多余文件尾空行 |

四处实际合并冲突位于 MapContainer、MeasuringModule、SettingsPanel、ruleDataStore，已逐项解决。下游工作区协调器、独立审核工作区、GitHub 身份门禁、发布记录入口、正式发布读取器、媒体读取器、数据源代次/取消/缓存/恢复机制继续保留。

对 `.cairn`、project-config、API、审核及数据核心等 **235 个受保护文件**逐一核对 Git blob，未发现意外变更。审核两个序列化文件只调整等价时间戳正则；ruleDataSources 只加入世界别名归一化。下游全部 **68 个原有 npm 脚本**保持原命令，依赖版本和 package-lock 原样保留。

完整清单见 [scope-audit.json](runtime-v32-sync01-execution-20261014/scope-audit.json)。浅克隆中缺少可用公共祖先，因此按固定快照作文件增量三方整合，没有把这一情况解释为两仓库历史无关。

## 3. 验收中修复的接入问题

1. **工作区首次启动即被关闭**：新挂载编辑器先广播初始空闲状态，下游协调器把它误当成用户关闭。现在仅处理实际激活后的关闭变化，保留原有切换确认、清理和互斥状态机。
2. **窄屏模块不可见风险**：测绘、测量与审核工作区主体移出仅桌面可见的工具栏祖先容器，继续按下游身份和状态机挂载。
3. **失败分包重试**：保留上游真实动态导入重试方式，并通过下游协调器恢复原操作，包含审核依赖的测绘分包。
4. **Lab 操作区遮挡**：截图检查发现上方工具条覆盖下游图层按钮及手机端菜单。重新定位并核验图层、测绘、审核、地图加减按钮的真实指针命中。
5. **既有发布记录导入被新增严格校验阻断**：当前正式数据包含旧分类尾码和缺失关联字段。新增下游桥接只接受与当前已加载发布数据语义完全相同的完整记录，并核验世界、Class、几何和标签/扩展结构；新 ID、内容改动、未发布输入或跨世界输入仍进入严格校验。创建和编辑保存校验未放宽。
6. **历史文件摘要受 Windows 换行影响**：冻结审计输入使用 LF 检出规则，保留原摘要；历史蓝图 v0.1/v0.2 的原始字节摘要也已核对。

第 5 项使用 5 个真实已发布异常样本建立了可离线运行的正/反向回归，并纳入 `verify:config-v32`。它不修改数据仓库，不补造关联，不修改用户记录。

## 4. 本轮自动化与实际浏览器验收

Node 20.14.0 下，最终 `npm run build` 通过，其 prebuild 执行 **39 组 `verify:config-v32`**。其中包含原有 38 组及本次已发布记录兼容回归。下游原有 **23 项回归/契约检查全部通过**；最后再次运行受影响的工作区协调器、分包和审核工作区契约，均通过。

| 验收 | 结果与证据 |
| --- | --- |
| 配置规范、校验、ZIP、渲染、碰撞、缓存、输出与编辑 | [39 组核验及最终构建日志](runtime-v32-sync01-execution-20261014/release-build.txt) |
| 下游审核、工作区、正式数据源、媒体、玩家轮询与合同配置 | [23 项结果](runtime-v32-sync01-execution-20261014/downstream-regression.json) |
| 17 个标准原生工作流 | 34 次实际控件填写/地图点击/提交，完整最终 record 等于冻结 V1；[结果](runtime-v32-sync01-execution-20261014/r9-final-native-workflow-matrix.json) |
| 原生工作流式再编辑 | 回灌、ID 模块、取消恢复、单图层替换、世界隔离；[结果](runtime-v32-sync01-execution-20261014/r9-final-workflow-edit-acceptance.json) |
| 铁路/车站专用再编辑 | RLE、STA、PLF、PFB、STB、SBP、STF 七类真实编辑，最终 record 对照 V1；[结果](runtime-v32-sync01-execution-20261014/r9-final-rail-edit-acceptance.json) |
| TRP 外部再编辑 | 3 种真实编辑、取消和世界暂停；按既有声明的字符串/数值高度归一化后对照 V1，不能称为未经归一化的 JSON 完全一致；[结果](runtime-v32-sync01-execution-20261014/r9-final-trp-edit-acceptance.json) |
| 工作台 | 四级选择、草稿切标签阻断、字段对照、英文空值、grip 排序、公式双击/撤销/重做；[结果](runtime-v32-sync01-execution-20261014/r9-final-studio-acceptance.json) |
| 默认配置与持久化 | 初次 r5、r2/r4 升级和恢复副本、显式旧版本、自定义版本、保存/刷新/恢复；[9 项结果](runtime-v32-sync01-execution-20261014/r9-final-default-acceptance.json) |
| 实际主应用 | 固定数据、搜索池、WRP 绘制提交、临时挂载开关、Label 点击信息卡、刷新清理、身份门禁、低 Zoom、390px；[结果](runtime-v32-sync01-execution-20261014/sync01-app-acceptance.json) |
| 冷/热分包启用与手机入口 | 单弹窗、取消保持禁用、启用后进入、版本变化重载，1440px/390px；[结果](runtime-v32-sync01-execution-20261014/r9-final-module-entry-result.json) |
| 原始上游 r9 与下游渲染层 | 同一完整真实数据、同一地图宿主与视口，分别比较 V1/V3 的 Label 位置/样式及路径，均相同；[结果](runtime-v32-sync01-execution-20261014/sync01-source-render-comparison.json) |
| 下游 V1 同步前后视觉 | 固定 1440×1000 城市/楼层视口 **0 个变化像素**；仅适用于该固定视口，[结果](runtime-v32-sync01-execution-20261014/sync01-v1-pixel-comparison.json) |

全部已列浏览器测试未记录未捕获运行异常。截图逐张视觉检查了桌面主图、楼层视图、手机布局、菜单和模块弹窗。用户自己的人工验收仍需用户执行，不能以自动操作替代用户确认。

## 5. 真实下游数据状态

固定数据来自 COS 正式版本 **19**，releaseId 为 `geometry-v1-aeb7cd1531696c31995cff53`。完整读取当前发布集合，仅有 `zth`，2 个区块、6 份发布响应、495 条要素：

`BUD 37 / FLR 19 / ISG 16 / PFB 62 / PLF 140 / RLE 41 / ROD 34 / STA 69 / STB 54 / STF 10 / TPP 6 / TRP 1 / WRP 6`。

固定下游 V1、集成 V1 和集成 V3 的加载数据与原始发布记录逐项相等，搜索池均保留全部 495 条。对每条记录在逻辑 Zoom 0–8 求值，共 **4455 次**；Class 根节点及几何均可解析，未发现非有限数值。全部 495 条原样已发布记录通过兼容导入。

数据本身仍有 **33 条旧分类路径值**（含 ROD 多余 NOM 尾级及 6 条旧测试分类记录），另有 **73 条缺失当前必填关联字段**。一般新数据的严格导入会拒绝这些记录；上述原样发布导入桥接保留它们，后续保存仍需按当前规范处理。没有修改或自动修补源数据。具体 ID 和原因见 [真实数据核验](runtime-v32-sync01-execution-20261014/real-data-runtime-audit.json)。

本轮读取的 GitHub 正式镜像为版本 16，与 COS 19 不同。测试没有自动回退到镜像，也没有把两个版本混用。固定基线的 `legacy-github` 兼容源目前仍可选，本轮保留基线政策；阶段 C 应据实际启用状态再次核定需要彻底废弃的接口。

## 6. 尚未覆盖或仍存在的限制

- **上游 Vercel 预览失败**。push 和 PR 的 GitHub 配置核验均成功；Vercel 状态为 FAILURE，使 PR 显示 UNSTABLE。本机 `vercel inspect --logs` 因登录 token 失效无法读取日志，真正的部署失败原因尚未确认。本轮没有合并 PR，也没有将该状态称为全绿。
- **COS 未允许 localhost 跨域**。读响应时未返回针对本地来源的 Access-Control-Allow-Origin。浏览器测试只在独立 CDP 9250 中回放所捕获的完整真实响应字节并附加本地跨域头，应用源地址、读取器和生产配置均未修改。普通本地浏览器访问 COS 的跨域可用性没有验收通过。
- **本地截图未载入外部卫星瓦片**。两侧均使用相同灰底，已比较要素和 UI；不能据此宣称真实底图服务、全部瓦片层级和远端可用性通过。
- **审核身份后端未在本地启动**。本轮验证了实际身份门禁、独立审核分包，以及下游模拟服务的审核/传输/授权契约；没有登录真实账号执行审核保存、提交、批准或发布。
- **V3 全面转正仍有验收任务**。实际城市视口中 V1 为 12 个 Label / 41 条绘制路径，V3 为 11 个 Label / 86 条路径；图中还可见楼层/线路 Label 表现差异。同数据受控宿主中的上游 r9 与下游结果一致，说明本轮保留了上游已交付效果，不能把这一结果解释为所有 V1/V3 显示已完全等同。阶段 C 保留真实楼层上下文、线路 Label、碰撞及新组合来源的复核任务。
- 构建仍有大分块和静态/动态导入提示；本次没有重新执行历史 5000 条数据的全部性能测量。npm ci 在当前 Node 20.14.0 有既有 eslint-visitor-keys 引擎提示，不影响本轮完成的核验与构建。

## 7. 人工检查与可重现运行

1. 打开工作台，确认默认 r9/r5；选 RLE 读取字段/信息卡，再进入工作流设计，检查未保存草稿切换阻断。
2. 打开实验室，检查下方工具条不遮挡图层与加减按钮；在桌面和窄屏启用/取消测绘与测量模块。
3. 选择标准点、线、面工作流，填写并绘制保存，再检查临时挂载启用/禁用、Label 点击卡片和刷新清理。
4. 检查铁路/车站编辑专用工作流未出现在便捷采集列表，编辑时按原记录回灌；TRP 使用登记的外部编辑方案。
5. 数据源方面，普通 localhost 的 COS 跨域限制会产生恢复弹窗。若自行改选正式 GitHub 镜像并使用 Github Raw 传输，注意本次观察到的镜像版本为 16，不能将其当作 COS 19 的验收。真实 COS/身份/底图应在对应服务允许的部署环境继续检查。

生产数据重现先运行 `python scripts/config-tools/browser/sync01_snapshot.py`，该操作只读远端、缓存本次真实响应。启动本地 5191 服务及独立 Edge CDP 9250 配置后设置：

```powershell
$env:CAIRNMAP_CDP_PORT = '9250'
$env:CAIRNMAP_APP_URL = 'http://127.0.0.1:5191'
$env:CAIRNMAP_ACCEPTANCE_OUT = '.cache/browser-acceptance'
python scripts/config-tools/browser/sync01_app_acceptance.py
python scripts/config-tools/browser/sync01_run_acceptance.py r9_final_module_entry_acceptance.py
```

其他 r9 浏览器验收可用同一 `sync01_run_acceptance.py` 入口。离线 CI 核验运行 `npm run verify:config-v32` 与 `npm run build`，无需访问正式数据源。

回退时可在独立工作树检出代码提交 `10330d5` 重现集成，或检出固定下游基线 `0f075e4` 查看同步前版本。后续合入时需要撤销同步，可用常规 revert 保留历史，不使用 reset --hard 或强推。

证据目录含 [execution-manifest.json](runtime-v32-sync01-execution-20261014/execution-manifest.json)，记录各证据摘要、固定 HEAD 和验收范围。v0.1/v0.2 历史副本摘要与原本一致。下一执行阶段为在这个下游分支上开展 v0.3 的 C 阶段，再按 D 阶段回写上游空置/未启用的模板状态。
