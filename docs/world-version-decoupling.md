# 世界版本 v3 配套

本轮与 Pipeline 的世界独立编号协议配套。先部署支持 v2/v3 的 Web 和四个 SCF 消费端，再由维护者显式初始化；部署代码不会自动调号。

- `current/worlds/_release-set.json` 的 v3 `worldBindings` 是唯一权威。世界投影尚未补齐时，不混用旧投影与新集合。
- 读取世界自己的 `dataReleaseId`、清单摘要与 `worldVersion`。其他世界发布不会使该世界的读取失效。
- 保留 c17 的来源 ID、`readerKind` 和 `readerSchemaVersion` 配置结构。它们表示已注册的读取器族；内部另用 `effectiveReaderProtocol` 区分 v3 缓存语义。
- 编号可以从 24 降到 1。相同快照及内容摘要的缓存可复用，更新绑定元数据；不以数字大小判断新旧。
- `设置 → 世界数据版本 → 数据发布身份 → 调拨当前版本` 仅维护者显示。预检、确认和进度读取均经既有登录 Broker；挂载控件不调用新服务。
- 初始化一次建立当前已发布世界的 24 号过渡基线。随后后土 `houtu`、奈落 `naraku`、伊甸 `eden` 逐一调到 `1`，每项完成后再处理下一项；零洲及全局批次保留 24。
- 旧发布历史的 `formalVersion` 保持批次含义，界面显示“发布批次”，不修改旧签名包。新的发布记录另列世界版本变化。
- 当前生成不修改线上编号、不发布配置、不提升 c17。

完整 SCF、CAM、环境变量、初始化及恢复步骤见 Pipeline 仓库
`docs/world-version-decoupling-deployment.md`。激活 v3 后不要单独回退 Web 或手工改某个世界 JSON。

验证：`npm run test:world-versions`、既有正式数据／图片及审核接口回归、`npm run verify:ci`、`npm run build`。
真实控件的隔离浏览器验收：`scripts/config-tools/browser/world_version_acceptance.py`，使用本机临时浏览器和服务端模拟，不写生产。
