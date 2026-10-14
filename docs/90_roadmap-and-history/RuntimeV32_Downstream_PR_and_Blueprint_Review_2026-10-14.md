# 下游 PR 发布与主体蓝图适配核查 — 2026-10-14

本轮完成下游集成分支推送、[PR #40](https://github.com/OpenRIAMap/OpenRIAMap-Cairn-Web/pull/40) 发布准备，以及 v0.3→v0.4 的主体适配核查。C 主体生成、D 回写与 V3 转正尚未执行，等待用户合并和下一命令。

## 1. 已交付基线

- 上游 PR #26 已由用户于 2026-10-14 合并，merge SHA：`e730bf0e4f5661e98176ad13a2a9f1fc180bc6bb`。
- 下游原 main：`0f075e4c3075e1210c812f90932c8a47abb1fbc9`；集成/验收/Node 24 提交为 `10330d5` / `7e8ae94` / `d2ab7b1`；下游 CI 适配为 `949644820814a0836b274584119e204da584fe3d`。
- 默认 r9/r5、真实下游审核/UI/数据状态、用户版本和恢复副本保持当前交付。配置 CI 使用 Node 24，39 组核验及 build，并执行 25 项下游契约检查；push 触发分支已改为实际下游分支。
- `9496448` 的 push / PR 两套 GitHub 核验及 Vercel 部署均成功；追加文档后最终状态以 PR 最新 head 的 checks 为准。分支发布和预览成功不等于用户已合并 main。

既有自动化、视觉和真实数据验收范围及限制见 [SYNC-01 报告](RuntimeV32_SYNC01_Execution_Report_2026-10-14.md)、[Node 24 修复报告](RuntimeV32_Node24_Deployment_Repair_2026-10-14.md)。本轮文档适配不冒充再次执行全部历史浏览器测试。

## 2. 主体需要的适配

| 范围 | 核查结果与蓝图修改 |
| --- | --- |
| 实施起点 | 以用户合并后的实际下游 main 冻结起点，统一 Node 24；升级配置契约/修订，保留显式包、恢复和暂存树；C、D、V3 转正分别处理 |
| 总体规则接入 | 现有环境 getter、数据源 controller、bindings、world 别名有静态初始化；新 application 必须接入真实消费者及代次/取消/缓存更新，不能只生成 JSON |
| 审核与退役源 | 保留同源 OAuth/nonce/HttpOnly/服务端角色契约；未启用模板需要独立合法分支。legacy-github 仍启用，建立现役/退役路径清单，先迁消费者再删除旧 schema/菜单/cache/fallback，保留正式镜像与传输能力 |
| 绘制与工作区 | DRAW 最后任务持续开启须与 transition token、清理/确认、身份门禁、分包重试共存；不能让绘制越过工作区、世界或来源边界 |
| 真实数据与通用关系 | COS 发布集合现场确认仍为 v19，495 条冻结记录可继续作基线。33 条旧分类/73 条缺关联保持诊断及严格保存边界；FLR/STF 字段、主反引和混合附属关系按真实记录迁移，不猜值 |
| 搜索与继承 | 主图/导航共用有效规则并更新搜索/关系索引；79 份子分类本地卡逐项迁移，保留特殊显示器；硬继承、一次性预填、显式表格绑定分清；英文空值不编造 |
| 表格、显示及验收 | 保留两个 hub 四个回城点与 WALK/HORSE 功能值，导航常量接入继续后置。楼层/线路既有差异成为真实数据验收项；RLE 新小胶囊按许可新增预期；ROD 排字仍暂缓 |
| 同步元数据 | 现有 upstream.lock 仍为旧审核契约源；不能把工作台范围覆盖冒称全仓库同步。C/D 按实际模块范围更新锁/manifest/override/impact 与原契约核验 |

上述结论及具体接入边界见[最终待确认蓝图 v0.4](RuntimeV32_Incremental_Revision_Blueprint_2026-10-13.md#17-v04当前下游基线适配与-c-实施准备)。本次没有改变主体功能目标。

## 3. 需求保留核验

v0.3 原样副本 SHA256：`37f370bf8fde5c130dac8c46e91c887837c8967df37bbb7ee13af845e9892fc1`。v0.1/v0.2 原样副本摘要也重新核对。

逐段程序比较确认：原第 1～4、6～14 节 **13 个功能章节逐字保留**；原有 **32 条验收行全部保留**，另增 8 条 ADAPT 验收。版本、当前状态、执行起点和同步阶段边界有明确修改；具体历史要求可回看 [v0.3 原文](RuntimeV32_Incremental_Revision_Blueprint_v0.3_History_2026-10-14.md)。活动蓝图的本地链接已检查，新证据固定 LF，历史副本保留原字节。

证据：[需求保留核对](runtime-v32-downstream-pr-review-20261014/blueprint-preservation.json)、[现场发布集合](runtime-v32-downstream-pr-review-20261014/live-release-set.json)、[首轮 PR 检查](runtime-v32-downstream-pr-review-20261014/initial-pr-checks.json)。

## 4. 下一执行门槛

用户合并 PR #40 后检查 v0.4，并明确下达在下游完成主体更新的命令。届时核实实际 merge SHA、固定当前数据/环境和新工作树，再实施 C；本轮到此准备完成，不自动开始 C/D。
