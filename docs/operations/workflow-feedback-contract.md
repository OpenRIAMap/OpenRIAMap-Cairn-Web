# 工作流核验与远端反馈维护约定

本轮保持 c18，核验规则为 `cairnmap-c18-production-3`。配置 r 由正式发布服务分配；本机配置只使用保存检查点时间及正式基线 r。

## 反馈对照同步

用户可见的远端诊断以稳定 code 为身份。Web 的 `src/feedback/remoteFeedbackCatalog.json` 与 Pipeline 的 `vendor/feedback/remoteFeedbackCatalog.json` 必须逐字节一致；双方 `contract.json` 固定目录摘要。中文项必须提供说明，英文项允许留空并回退原始消息。未知 code 保留原文，不能被空翻译吞掉。

新增或改变审核、配置发布的用户可见 code 时，同时修改中文说明、可选英文说明和双方目录摘要；涉及新公共服务文件时同步扩展 `publicServices`。Pipeline 测试扫描公共服务的静态 code，缺少对照会失败。Web 的核验、预检、发布进度根据其所处配置环境的语言显示；代码、原始消息、地址、关联信息仍保留在原始详情中。翻译不改写报告及其签名/摘要。

## 工作流来源与最终准入

搜索返回字段解析使用主结构角色、scope、旧 target 的既有顺序。查询字段可按 Key 取并集，返回字段必须在所有实际来源中类型、基数与结构兼容。ID 是运行时系统字段；坐标系统字段不能误推为文本。

只有直连自由 JSON 控件、具有目标结构约束并在实际输出严格核验的未知项可转入报告的可选 `designNotes`。不能按工作流 ID 或 unknown 前缀豁免。普通报告与临时诊断包均保留说明；说明不参与警告确认，也不改变真实错误的准入。

## 预填与传送状态

一次性的来源搬迁工具和证据已移入 `scripts/config-tools/history` 及 `docs/90_roadmap-and-history`。正常预填副本、确认、失效重检及历史审计继续运行；剩余三条来源警告没有自动清除。

导航只排除明确 `Situation === false` 的 TPP/WRP。缺省仍可用。命名目标已停用时不能通过旧坐标回退恢复传送边。停用过滤发生在 hub、邻近候选和图生成之前；唯一 ID、Warp 键及正常表单/记录核验继续执行。可选状态开关设置默认 true 时，编辑缺省记录显示正常，明确 false 保留；未触碰的原字段不会被写成 true。

同源内核更新后必须生成 Web vendor 并复制至 Pipeline，核对 manifest 与 bundle 摘要，再生成 Worker、Dispatcher 更新包。不得只更新一端或复用上一规则补丁的预检凭据。已确认的 prod1/prod2 历史任务保留其原授权身份；恢复不获得新授权。

同步检查命令（在 Web 仓库运行）：

```sh
node scripts/config-tools/sync-feedback-catalog.mjs --pipeline <Pipeline仓库路径> --check
```

更新时去掉 `--check`，随后运行两侧测试并一起提交。
