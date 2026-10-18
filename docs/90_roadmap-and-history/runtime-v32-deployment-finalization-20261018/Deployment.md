# V3 正式部署收尾：SCF 更新后交接

日期：2026-10-18。本文接续统一执行蓝图 v1.0，记录已交付代码与用户报告的 SCF 部署状态。2026-10-17 的转正报告及其证据清单保留为历史快照；后续部署顺序以本说明为准。

## 当前进度

| 函数 | 实际调用别名及版本（用户报告） |
| --- | --- |
| cairn-review-archive-worker | staging → 6 |
| cairn-github-mirror-worker | staging → 14 |
| cairn-pipeline-worker | staging → 36 |
| cairn-pipeline-dispatcher | staging → 30 |

用户已报告 CAM 更新，Worker / Dispatcher 已添加配置发布与读取两个变量。本次没有 SCF 管理凭据，不能独立读取云端角色、触发器、包摘要或变量值；按上一阶段要求，两个变量应继续保持 `false`，首次启用时间保持空置。用户已切换上述别名，不再重复要求切回旧版本。

Web 分支包含此前已批准、尚未进入 main 的 65 个配置体系依赖提交，以及正式转正和本轮收尾差分。它们需要一并进入 PR，不能只提交最后一次来源适配差分。Pipeline 源码与四个交付 ZIP 对应。

## 已核验

- 对照交付源码快照重新逐文件计算 SHA-256：Web 1602 个、Pipeline 175 个文件一致。本次只新增交接文档和只读证据，不修改已交付的运行代码。
- 交付阶段使用 Node24.19.0 完成 Web 全量 build/prebuild、配置契约和来源/媒体/状态回归；浏览器 6 项检查通过，运行异常 0 项，包括 390px 窄屏。
- Pipeline 在 Node20.19.0 下 180/180 项测试通过，部署清单及 SCF 包核验通过。四个 ZIP 各 980 个文件，逐文件 SHA/CRC 和根 handler、实现模块导入通过。
- 交付阶段 COS、官方 Raw、CDN 实际读取均得到同一 v20 / 478 条数据，严格数据核验通过。部署后本次 COS 与 CDN 的 release-set 仍为同一 v20；Raw 本次请求超时，不能据此认定镜像失效，也没有回退旧 v16 目录。
- r11/r7 冻结首版保持原始字节：config SHA `982e1c0b6dc004dd90ee1ff92cd502dfb0f77a9ef4c53bb5a707a2c188460d7e`；ZIP 248639 字节，SHA `73f1eecb895e80e2ee188e47f8d030202dab8447862faaf9b50a77642eed5a9e`。
- 提交前额外核对 Git 暂存区字节，发现冻结 V1 的 `filter.ts` 与快照 `manifest.json` 会被换行转换。使用两条精确 `-text` 属性保留其原始字节；冻结文件本身和运行逻辑没有修改，避免新检出代码时摘要失配。

`validation-summary.json` 是交付阶段 A 的历史结果，其部署/PR 标志不能代替本节的后续状态。`readiness.json`、`routing-cors.json` 为本次只读检查；它们没有云端写入或成功登录证据。

## 合并与部署后必须检查

1. 用户合并 Web / Pipeline 配套 PR，等待实际 Web 部署。Web 的 `CAIRN_CONFIGURATION_PUBLICATION_ENABLED`、`CAIRN_CONFIGURATION_RUNTIME_ENABLED` 暂时保持 `false`。
2. 正式域名目前主页面可达，但会话 API、公开审核发布 API、配置 API 和静态配置地址均返回同一 HTML。新静态配置尚未部署符合当前阶段；已有 API 的 HTML 响应则尚未通过检查，不能解释成有效会话或 SCF 成功。合并部署后必须复查 API 正文类型与实际路由；如仍返回 HTML，先排查 Vercel 函数部署与 rewrite。GitHub 中最新 Production 部署记录仍对应 main `0fa9b98c47bc7107a6b53922f335795203f575a3`；直连该 Vercel 部署地址本次网络失败，不能据此确认实际函数状态。
3. 补充 Control 桶 `openriamap-cairn-control-1433163128` 的配置上传 CORS：精确 Origin `https://cairn.ria9.top`、方法 `PUT`、允许请求头 `Content-Type`、`x-cos-meta-sha256`。保留其他既有规则。本次 OPTIONS 返回 `403 AccessForbidden / CORSResponse`，明确说明当前规则不接受这组预检。CAM 更新不等于 CORS 已完成，不开放公共写。
4. 检查 `/api/configuration` 的 JSON 状态、`/configuration/current.json` 的完整身份、不可变首版 JSON/ZIP 的正文摘要。不能将 HTTP200 HTML 视为就绪。
5. 在维护窗口暂停新上传、审批、数据及配置发布，保留在途任务。使用有权限的运维入口读取 Data `current/configuration.json` 的实际基线；公开 403 不能当作不存在。已有其他原生活动配置时禁止用 seed 覆盖。
6. 按 Pipeline 的 `docs/configuration-production-deployment.md` 完成受控首版登记：仅 SCF 侧先开发布、读取仍关闭；上传原始 seed ZIP，经 Control 审批产生 bootstrap 任务。本文不执行登记或直接改活动指针。
7. 登记及回执成功后，再为 Dispatcher / Worker 配置同一真实 UTC 启用时间、同时打开读取与发布开关，发布新数字版本并更新 staging 别名。Web 先开权威读取、核对 identity，再开发布入口。
8. 最后进行真实 OAuth / Team、签名上传、审核 / 发布、规则切换与重试恢复联调，通过后恢复入口。本地替身、公开 GET、OPTIONS 和源码比对均不能代替这些云端验收。

## 四个 SCF 交付包

| 包 | SHA-256 |
| --- | --- |
| Dispatcher | `78e45d7f8bf39336623e96efb4b0ba3d1da8c76cd2f9b280a993c43ab573b80b` |
| Worker | `eb8158dd17e5f4acfc016ec6a24e3deafb632a58e0ff0344264a5cba6fb92fa3` |
| Mirror | `678e4f19b6f4f962555989a4768f5bd07f44435ad7dc422241c6eb7b1bdf0a4d` |
| Archive | `0659afbc1529a1519d6019fc915e89e80528d0128a507359cc08fb941fc46fe8` |

SCF 使用 Nodejs20.19，Web / Vercel 使用 Node24。保留现有审核 staging 与触发关系。本次不重放数据修复包、不重新同步 v20、不改变当前配置活动指针。
