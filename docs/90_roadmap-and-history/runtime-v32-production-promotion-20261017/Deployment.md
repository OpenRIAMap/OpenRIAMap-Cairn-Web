# r11 配置正式运行与发布接入

本轮已实现并本地核验。本文是部署执行说明；截至 2026-10-17，尚未执行云端部署、CAM 策略写入、正式指针切换或 Map 仓库推送。实际 SCF alias、现有指针和 GitHub App 安装权限仍需通过现有运维入口核对。

## 固定边界

- Web/Map：`OpenRIAMap/OpenRIAMap-Cairn-Web`，`main`。
- Control：`OpenRIAMap/OpenRIAMap-Cairn-Control`，`main`。
- 可信绑定：`deployment/configuration-production-binding.json`；浏览器上传的配置不能改变发布目标。
- Team：`OpenRIAMap/cairn-maintainers` 的 active member 或 maintainer。准备、再次核验、确认及发布前均实时查询，不使用客户端角色或缓存角色授权。
- SCF 保持 `ap-shanghai`、`Nodejs20.19`、既有四个函数和角色。Web/Vercel 使用 Node `24.x`。
- 规则核心：`vendor/configuration-r11/manifest.json` 记录版本、生成物 SHA-256 和来源清单；由 Web 的同一 TypeScript 核心生成，不带 React、Leaflet 或 Zustand。

## 数据与文件位置

| 位置 | 用途 |
| --- | --- |
| Control COS `ConfigPackages/config-{requestId}/package.zip` | 临时签名授权上传的候选包。 |
| Control COS `review/config-packages/` | 发布状态、修订号高水位、幂等预留、租约、配置上下文和审核语义回执。 |
| Control Git `config-package-authorizations/{jobId}.json` | 维护者确认及其内容、基线、规则与报告摘要。 |
| Data COS `config-releases/{releaseId}/` | 不可变 `config.json`、`manifest.json`、`package.zip`、`release.json`。 |
| Data COS `current/configuration.json` | 唯一正式活动索引；带完整 identity，使用 ETag 条件更新。 |
| Web Git `public/configuration/releases/{configSha256}/` | 供地图读取的不可变镜像文件。 |
| Web Git `public/configuration/current.json` | 活动索引镜像。正式线上读取以服务端签名代理取得的 COS 权威索引为准。 |

Web Git 写入使用 `base_tree`、`replaceRoots: []`、非强制 ref 更新。允许路径仅为上述配置文件。不会替换应用代码、数据目录、V1 兼容文件或其他历史版本。

## 部署前检查

1. 在现有 CI/运维环境核对四个 SCF 的实际源码版本、alias、角色、环境变量及 COS 触发器。当前本地模板不能证明线上已部署。
2. 核对 GitHub App 可读取该 Team，并可向固定 Web 和 Control 仓库写入内容。沿用现有私钥/令牌的受控引用；不把密钥加入配置 JSON、ZIP 或提交记录。
3. 合并 `deployment/cam-policies/` 对 Dispatcher、Worker 的窄范围增量。先通过 `npm run validate:deployment` 与 `npm run validate:scf`。不修改 COS bucket ACL，不扩大其他两个角色权限。
4. Control bucket 对实际 Web origin 配置签名上传所需 CORS：PUT，允许 `Content-Type`、`x-cos-meta-sha256`。`Content-Length` 由 Blob 请求自动提供且参与签名。候选包上限 64 MiB，签名有效期 300 秒。
5. 核对现有 API Gateway `/v1/review-intents` 与 HMAC secret；正式索引读取也经此签名链路。公开请求 `current/configuration.json` 返回 403 不能证明对象不存在，应使用有权限的运维读操作。

## 先部署，后启用

1. 暂停新审核上传、审批和发布入口，保留在途任务、上传预留和历史证据。记录明确的启用时间；切换期间不要让 Dispatcher 与 Worker 使用不同的启用状态接收新任务。
2. 部署 Web 代码及静态 r11/r7 文件，暂设 Web 的发布/权威读取开关为 false。此时主地图使用登记的 seed，本地编辑版本保持独立。
3. 生成并部署四份 SCF ZIP，先保留原开关为 false。核对 ZIP SHA、handler、运行时和角色绑定，再切换相应 alias。
4. 仅在 SCF 侧打开 `CAIRN_CONFIGURATION_PUBLICATION_ENABLED=true`，保留 `CAIRN_CONFIGURATION_RUNTIME_ENABLED=false`，完成下述首版登记。
5. 登记成功且回执完整后，在 Dispatcher、Worker 同时配置 `CAIRN_CONFIGURATION_RUNTIME_ENABLED=true`，并设置真实切换时间 `CAIRN_CONFIGURATION_ACTIVATED_AT`。该时间用于界定历史无配置 pin 任务；不能填未经核对的示例时间。
6. Web 设置 `CAIRN_CONFIGURATION_RUNTIME_ENABLED=true`，通过 `CAIRN_CONTROL_API_BASE` 和 `CAIRN_BROKER_TO_DISPATCHER_SECRET` 读取权威索引；随后打开 `CAIRN_CONFIGURATION_PUBLICATION_ENABLED=true`。配置发布独立于现有审核 staging 开关，不更改审核部署门。
7. 分别验证非成员阻断、有效成员成功、权限撤回后阻断、并发发布、部署等待和回执修复，再恢复审核入口。

Web 还沿用 `CAIRN_SESSION_SIGNING_SECRET`、GitHub OAuth client/secret/redirect URI。新发布用途使用独立的短期 HttpOnly cookie 和签名 state，不复用审核 cookie 授权。

## 首版 r11/r7 登记

仅接受 `deployment/configuration-production-seed.json` 固定的原始包：JSON SHA 为 `982e1c0b6dc004dd90ee1ff92cd502dfb0f77a9ef4c53bb5a707a2c188460d7e`，原包 248639 字节。不要重新压缩，也不要用 Studio 新导出的 r8 代替首版包。

1. 有权限地读取现有 `current/configuration.json`，记录其 manifest SHA；如果有完整 identity，计算同一规范化协议的 identity SHA。真正不存在时两者才可为 null。旧 contract r3 指针也必须明确记录预期 manifest。
2. 将 Web seed 原始包放到 Control COS `ConfigPackages/v3-r11-r7-seed/package.zip`。
3. 运行以下本地生成器，准备待审核材料。命令不会执行任何云写入：

   ```text
   npm run config:bootstrap-job -- --actor LOGIN --out-dir LOCAL_DIRECTORY --expected-manifest-sha256 OLD_MANIFEST_SHA --expected-identity-sha256 OLD_IDENTITY_SHA
   ```

   对于不存在的对应摘要，省略该参数。生成记录初始状态为 PENDING，不能直接执行。
4. 经现有 Control 审查后，将批准记录以 APPROVED 状态合入 `configuration-bootstrap/v3-r11-r7.json`，记录合并 commit。记录中的 actor 必须是届时仍有效的 Maintainers 成员。
5. 再次运行生成器并提供 `--control-commit MERGED_COMMIT`，取得 `job.json`；由现有运维入口放到 Control 的任务请求队列。新 kind 为 `configuration-bootstrap`。
6. Worker 验证合并可达性、批准记录、实时 Team、完整 ZIP 和固定 seed 摘要，检查 Web 已部署该 JSON，写入不可变 Data release，最后 CAS 活动索引。不会覆盖 seed 的冻结 Web 发布元数据。
7. 重复任务复用同一登记；预期基线不符、Map 未部署、未批准或非成员均阻断。已有其他原生发布身份时禁止再登记 seed，不能把此入口当作回滚命令。失败时检查实际权威索引和任务状态，不能通过重新设 null 强行覆盖。

## 日常发布、失败与恢复

- Studio 专用全局核验绑定完整内容、数据上下文、正式基线身份及规则版本。模块草稿必须先保存或放弃。
- 本地下载修订号与服务端预留号分开；服务端发现修订号需要调整时生成新候选并要求重新登录确认。并发预留允许留号，不复用已占用号。
- 发布顺序为：签名上传 → Worker 重新核验 → 维护者确认 → 不可变 COS/Git 准备 → Web 部署字节核对 → ETag CAS 启用 → 镜像活动索引与回执。
- 未部署时保留旧指针，20 秒后排队重试；最多 60 次部署检查。查询进度也可重试等待中的任务。
- 启用后回执/镜像失败为 `active-receipt-pending`，不标成未发布。Worker 有限自动补写，查询进度可再次排队；恢复不再次启用。迟到回执按当前权威索引修复镜像，不能长期把新版本镜像成旧版本。
- COS 与 Git 不提供跨系统原子事务；权威索引决定实际生效版本，镜像采用可验证的最终一致性。
- 新审核上传预留、再次核验和执行任务使用完整配置 pin。旧规则或旧基线报告不得批准新发布；启用前的无 pin 历史任务仅走明确时间界限内的兼容分支。Relay 包不增加未知协议字段。
- 后续更换验证语义时须升级规则版本，并为在途 pin 保留相应旧核心，不能仅换代码而沿用原规则版本冒充同一校验。

## 本地复核

```text
npm test
npm run validate:deployment
npm run validate:scf
npm run build:scf-zips
```

截至本轮最终回归，175 项 Pipeline 测试通过；其中包括并发修订、同字节不同发布身份、真实 ZIP 语义重验、Map 文件白名单与 ref 竞争、审核回执数据版本隔离、首版登记和启用后补写。测试中的 COS、GitHub 和部署响应为受控替身，不能代替上述真实云端联调。
