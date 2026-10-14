# 下游主体更新执行记录

用户已批准增量蓝图 v0.4。实施基线为用户合并 PR #40 后的 `0fa9b98c47bc7107a6b53922f335795203f575a3`，与 PR 最终代码树 `5eb400e` 相同。独立工作树 `wt/ria-config-runtime-v32-subject-20261014`，分支 `codex/ria-config-runtime-v32-subject-20261014`。

Node 24.21.0 / npm 11.19.0 下锁文件安装、合并基线的 39 组核验及 build 已通过。原 V1、r9/r5、历史蓝图/fixture 和已发布数据保留。

本轮范围为 C：UI/FORM、DRAW、契约/迁移、INHERIT/PREFILL、REL/SEARCH、TABLE、LABEL、APP 及下游真实验收。D 回写、V3 正式转正、导航表消费者替换不在本次执行范围。

| 主题 | 状态 | 证据/提交 |
| --- | --- | --- |
| 合并基线冻结 | 完成 | 0fa9b98；`.cache/main-update/baseline-build.txt` |
| 新契约及默认迁移 | 完成，契约 r10 / 默认配置包 r6 已统一交付 | 严格 schema、r9→r10 迁移差异；旧 r9/r5 默认、fixture、摘要保留 |
| UI-01/02 与 FORM-01～04 | 完成，最终 60 组宽度／缩放等效布局通过 | b64f21c；21 个编辑器柔性布局；真实控件宽度、双导航、三态、搜索关闭及标签零行验收通过，39 组核验/build 通过 |
| DRAW-01/02 | 完成，最终 34 次页面提交及 TPP 回退通过 | 40 组核验/build 通过；17 个原生工作流、34 份最终 record 与冻结 V1 fixture 完全一致；真实地图 TPP 目标点→主点→信息页回退/撤销/重画后，主坐标与目标坐标/高度独立保留。证据 `.cache/main-update/subject-native-workflow-matrix.json`、`subject-drawing-session.json`、`draw-verify.txt`、`draw-build.txt` |
| INHERIT-01 / PREFILL-01 | 完成；搜索副标题同类能力随后接入 | 父字段身份/定义/类型/名称/对照固定继承；稳定卡片来源继承与本地布局分离。迁移前后 79 份子卡可见项来源/名称/对照/显示器/关系不变；新建/导入、接收开关与副本绕过阻断、编译缓存通过。清除、独立副本变化警告、逐版本确认及真实编辑器五宽度测试通过；工作流表格依赖随草稿原子保存，严格导入及冲突阻断通过。42 组核验/build，证据 `.cache/main-update/inherit-verify.txt`、`inherit-build.txt`、`r10-inheritance-migration.json`、`subject-inheritance-acceptance.json` |
| REL-01 / SEARCH-01 | 完成，真实 App 与主图／预览 BUD/STB 层级切换通过 | 44 组核验/build；FLR→BUD/STB、反向引用、世界隔离、歧义阻断、0 层级、点击/楼层上下文和严格新输出通过。主图/导航共享搜索配置；缓存 COS 495 条记录中 433 条原有可搜索记录的资格及副标题完全一致。真实生产搜索控件对数据快照替换即时更新，无需切世界或重输查询；跨分类工作流/信息卡和原子保存目标检查通过。证据 `.cache/main-update/search-verify.txt`、`search-build.txt`、`search-data-audit.json`、`subject-search-acceptance.json`。搜索设置默认向下继承并允许子级本地细化，可显式选择固定继承；主/附属身份按字段设计固定继承。受控响应回放不作为生产 COS 跨域成功证据 |
| TABLE-01 | 完成，新默认种子含两表及四返回点 | r10 严格契约；V1 两表/四返回点；显式绑定、解除副本、ID 事务改名、引用删除阻断、字段/工作流/重复组解析和一次性预填；分类依赖信封与 ZIP 冲突/往返通过。41 组核验/build；五宽度实际控件验收及无原始 JSON 编辑通过，证据 `.cache/main-update/table-verify.txt`、`table-build.txt`、`subject-table-acceptance.json` |
| LABEL-01 | 完成组合来源和专项显示验收；整图已延期的差异见交付报告 | 45 组核验/build；安全独立模板、转义/预算、空/对象回退、0/false、冻结编译缓存和未知字段阻断通过。27 组实际 RLE Zoom/方向渲染计划验证：2–4 的 direction=3 新增 11px bureau+line 颜色胶囊，其他区间/方向文字及样式保持原意。旧 V1 fixture 保留。证据 `.cache/main-update/label-verify.txt`、`label-build.txt` |
| APP-01 与退役接口 | 完成六模块及真实消费者、退役合同清理和最终包；服务验收另列限制 | 三工作区、独立持久草稿/核验保存/冲突保护、全包核验/ZIP；实际世界/投影/三种瓦片/Zoom、按钮样式和同一互斥联动状态机、世界来源绑定/transport/media、注册分包加载和入口、搜索数量/延迟、玩家接口/轮询、工具栏均接入活动应用设置。审核使用原同源 Cookie/nonce/服务端授权边界；禁用/空接口专项测试请求为 0，不模拟登录。现役数据/媒体读取器替换旧 pub/dat/legacy-merge 消费链；旧 source/cache 阻断且提示显式确认来源。46 组核验通过；编译兼容修正后生产构建通过，六模块五宽度/保存隔离/刷新/草稿阻断真实 UI 通过。证据 `.cache/main-update/application-build.txt`（含已修正的编译失败）、`application-build-final.txt`、`subject-application-acceptance.json`。真实账号审核写入和生产 CORS 未验收；服务端凭据引用随部署配置，浏览器不修改服务端环境变量 |
| 分类/继承/表单交叉复核 | 完成 | 单分类替换保留子卡稳定来源和布局；固定角色/搜索模块导入冲突及显式修正；新增子级/整树替换只刷新系统分类控件，不修改用户工作流；组合 Label 模板字段改名与依赖检查；复杂标签值只读保留，窄对照行握柄。47 组核验/build、表格与信息卡实际 UI 回归通过。实际服务端引用与 api 环境名逐项对照，未加入凭据值。证据 `.cache/main-update/transaction-final-verify.txt`、`transaction-final-build.txt` |
| 全量、浏览器、真实数据和服务验收 | 本地与受控页面验收完成；整图差异及外部服务未宣称通过 | 48 组核验/build、5 项原合同；完整数据、工作流、交互、默认升级及 ZIP 导入证据见最终交付目录 |

每个主题独立本地提交并执行 `npm run verify:config-v32` 和 `npm run build`，保留实际结果。未验收的服务与人工项不写成通过。

## 2026-10-15 最终消费者补齐

世界代码/前缀/编号映射接入 17 个旧采集组件（包含保留的铁路、车站、TRP 外部方案）；新增世界使用同一活动 application 定义，禁用世界不再由 Cookie/分享链接自动进入。总体规则保存阻断尚未完成的工作区转换。导航原有四参数（3 / 16 / 1 / 5）移至偏好模块并接入实际计算器，默认行为不变；WALK/HORSE 与所属枢纽功能表的导航消费者替换仍留待专门任务。

最终候选的 48 组核验、TypeScript 与生产构建通过，证据 `.cache/main-update/final-ui-build.txt`。真实铁路/车站七分类再编辑、TRP 三个特殊编辑记录及取消状态通过；STF 的冻结 fixture 引用外部 `ZSTB_A`，测试为其提供独立父记录，不更改七份预期输出或放宽新记录校验。

## 2026-10-15 显示与最终 UI 回归

完整真实城市对照发现通用层级自然排序导致默认楼层变化，已复用 V1 的楼层顺序与层级名称算法。实际溯东站 V1/V3 均为 `2F / 1F / B1F / B2F`，默认 2F；任意非楼层层级保留原值。BUD/STB 主结构的主图/验证器、零层级和手机选择事件通过。RLE 背景胶囊不再被 SVG-only 限制错误隐藏，2–4 的 11px 代码与既有 5–8 名称胶囊真实测试 54 组通过。

最终嵌套编辑器检查补齐验证器样例选择、绘制槽位/名称、表达式固定文本、重复组元数据的容器换行；60 组真实编辑器宽度/缩放等效布局通过。125/150% 为 CSS 视口与像素密度的等效检查，未声称操作浏览器原生缩放菜单。48 组核验、TypeScript 与生产构建通过：`.cache/main-update/display-final-build.txt`。

真实整图仍存在 RLE 低 Zoom 沿线文字资格和地理面 Label 候选/碰撞等差异；计数包含不可见、离屏与点击代理图形，不能作为像素一致证据。代码胶囊是用户许可新增，SVG 胶囊恢复与默认楼层已专项修复；其余已延期的渲染问题保留在最终报告，不据此宣布 V3 已与 V1 整图完全一致或转正。

## C 本地交付

最终 r10/r6 默认资源、JSON/ZIP、验收摘要、文件哈希、受控页面证据及简略人工步骤位于 [runtime-v32-downstream-mainupdate-20261014/README.md](runtime-v32-downstream-mainupdate-20261014/README.md)。本轮主体实现收尾，进入人工验收；剩余整图显示差异和生产服务检查逐项明示，不作为 V3 转正通过证明。提交仅在本地，未推送、未执行 D、未替换导航功能表消费者、未写生产数据。
