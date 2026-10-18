# V3 配置体系转正实施报告

日期：2026-10-17。依据 `RuntimeV32_Production_Promotion_Blueprint_v0.1_2026-10-17.md`。本轮代码及本地验收已完成；线上 SCF/CAM/OAuth 与正式切换尚未执行，不能视为已经上线。

## 交付位置

- Web：`wt/ria-config-runtime-v32-subject-20261014`，分支 `codex/ria-config-runtime-v32-subject-20261014`，本轮基线 `5b3e9c2`。
- Pipeline：`wt/pipeline-config-production-20261017`，分支 `codex/pipeline-config-production-20261017`，基线 `7fe4ec5df6cdf66cd7df5c3f489ca05e3f3ba4ba`。
- 上述 Pipeline 基线从旧工作区复制并保留的 r3 导入核验改动仍在，没有覆盖旧工作区。继承差分备份保存在工作区根部 `migration-runs/pipeline-config-production-inherited-wip.patch`。
- 本轮未推送 PR，未改写正式数据，未执行云部署。完整变更保留在以上两个工作树，供审查。

## 蓝图落实

| 项目 | 最终行为与证据 |
| --- | --- |
| MAIN-01 | 主页面直接加载正式 V3 配置，初始为原始 r11/r7。线上通过受控 API 获取权威索引；原始字节、完整身份及结构/语义核验通过后才启用。本地 Studio 选择不会影响正式页面。 |
| 会话与缓存 | 已加载的正式配置在会话内固定；新版本提示刷新。可信缓存保存原始正文，不把编译结果冒充原始摘要文件。索引读取失败不会转回 V1。 |
| V1-01 | 独立 `/legacy-v1/` 入口及加载确认。冻结源码、编译后 JS/CSS、测绘与状态命名空间；正常构建仅安装逐文件验证的冻结产物，不用当前依赖重新编译 V1。取消加载返回原页面。 |
| BUNDLE-01 | 配置编辑、测绘、V1 各自按需加载。实际浏览器首次主页面仅请求主入口和 vendor-main JS，不预先请求 Studio、MeasuringModule 或 V1 UI。 |
| STUDIO-01 | 去掉 V1 重生成入口、手填修订号和阶段性说明；区分本地导入、保存、试运行与正式发布。专用全局核验才可解锁“整包下载/上传”，模块核验不能解锁。 |
| REV-01 | 本地自动修订、跨标签页导出锁、持久历史冲突检查；服务端单调唯一预留、幂等任务及候选重新确认。冻结 seed 与可前进的 current 索引分开核验，未来 r8 索引不会因 seed 固定检查而阻断构建。 |
| AUTH-01 | 发布用途独立 OAuth state/nonce、浏览器绑定、短期 HttpOnly cookie，绑定内容与完整基线。组权限在可信服务端实时查询，上传配置不能改变发布目标或授权。 |
| 发布链路 | 共享纯 Node r11 验证核心；候选上传、异步重验、Control 确认、不可变 release、Map 部署检查、CAS 激活、索引镜像和可重试回执。已有 r3 导入兼容继续保留。 |
| Map 增量更新 | 固定仓库、分支和配置路径白名单，使用 base_tree、空 replaceRoots、force=false；保留代码、数据与历史。基线比较使用完整发布身份，包含同字节回滚场景。 |
| 审核与 Relay | 新上传预留及执行 pin 关联配置身份/规则版本；再次核验与最终执行重验。审核语义回执同时按配置身份和数据版本隔离；临时存储错误可重试。命令行 Relay 工具改读已发布 V3 配置，历史示例明确使用其冻结基线。 |
| PART-01 | 分类禁止多部件时，完整编辑器部件选择/加/减禁用，快捷工作流添加部件也禁用；内洞保持独立可用。保存仍核验完整几何，不截断草稿。折叠设置面板不会丢失内洞。 |

## 冻结基线与文件格式

- r11/r7 原始 JSON SHA-256：`982e1c0b6dc004dd90ee1ff92cd502dfb0f77a9ef4c53bb5a707a2c188460d7e`。
- 95 节点、28 工作流、3 张公共表；正文未因本轮发布元数据而修改。
- 首版 manifest SHA-256：`8818876914ba81dcc8318c0da4ef8977fd5729821e750666efb425871ded6fad`。
- 首版原始 ZIP：248639 字节；元数据位于独立 identity、release、manifest 文件，正文保持 UTF-8 可读 JSON。
- V1 基线为 `5b3e9c2`；编译冻结清单共 113 个运行文件，摘要见 `legacy-v1/runtime-manifest.json`。另保留冻结的只读过滤核验模块，干净检出也可复查数据。
- 共享 Node 核心包含 135 个来源输入，生成物 828085 字节；具体 SHA 与来源散列见两仓库的 `vendor/configuration-r11/manifest.json`。
- 旧审计、修复报告、r11/r7 JSON 阅读手册及先前冻结包未重写。新增内容在本目录单独归档。

## 实际数据检查

只读来源为零洲正式数据 release `geometry-v1-aeb7cd1531696c31995cff53`，formalVersion 19，共 495 条记录。浏览器 QA 使用该发布原样捕获的六个 JSON 对象，通过本地只读代理绕过 localhost 的跨域限制；没有伪造或改写业务记录。

| 检查 | 结果 |
| --- | --- |
| 可展示记录 | 489 条。 |
| ROD 历史 NOM 占位兼容 | 27 条仅在运行视图中归一化；源记录保留，未来精确分类优先。 |
| 未登记历史测试分类 | 6 条：`Test1`、`FLRtest`、`TEST2`、`Test3`、`Test4`、`Test5`。逐条隔离并在设置页提示，不阻断其余数据。 |
| 冻结 V1 对照 | 同样保留 489 条，未知 6 条，损坏几何 0 条。 |
| 已有数据上下文配置核验 | 0 项配置问题；不等同于所有旧记录满足新建规则。 |
| 严格新提交核验 | 79 条需要处理：上述未知分类 6 条；63 条 STA 缺 `STBuilding`；10 条 STF 缺 `staBuildingID`，同时缺主结构关联。 |

这些关联字段在现有 r7 中为必填，但明确 `validateExistingData=false`，因此历史记录可继续读取；重新提交时必须满足新规则。本轮没有猜测其建筑关联，也没有自动修改数据或放松提交校验。完整 ID 清单和诊断见本目录 `strict-incoming-audit.json`。

## 测试结果

| 工序 | 结果 |
| --- | --- |
| 原有 V3.2 核验链 | 57 个 npm 检查入口通过，含 5130 个原有渲染计划、34 个 V1 完整记录、23 次编辑转换、28 个工作流与 16 个 Class 树往返。 |
| Zoom/Label 生命周期 | 5985 次探测通过；479 个缩小后必须移除标签的场景通过；仅保留已批准的 RLE Zoom 2–4 差异。 |
| 原修复门 | 71/71 预期通过；67 个错误在四道边界阻断；21 类坏包/预算/取消负例及四代历史 JSON/ZIP 兼容通过。 |
| 生产核心新增检查 | 正式身份和字节、未知路径视图、单部件内洞、原始包、私有 COS 索引代理、OAuth 用途隔离、未来 r8 current 镜像构建预检查与 Relay 跟随读取通过。 |
| 前端 | TypeScript、生产构建通过；按需模块契约 3 项、原审核 auth 路由、39 条 Relay 示例和执行保护检查通过。 |
| Pipeline | 最终 175/175 测试通过，含并发、权限撤回、不同身份同字节、CAS 竞争、部署等待、镜像局部提交、回执补写、审核 pin 与首版登记。 |
| SCF | 部署/CAM 模板验证通过，四个标准 ZIP 已生成；文件摘要见 `scf-package-manifest.json`。 |
| 浏览器 | 7 项主流程检查、2 项完整测绘/工作流检查通过；包括实际保存一个单部件双环 Polygon、390px 弹窗和 Escape 退出。最终执行无应用 Runtime 异常。 |

对应可复跑入口：`npm run build`、`npm run test:production-runtime`、Pipeline `npm test`、`npm run build:scf-zips`，以及 `scripts/config-tools/browser/production_promotion_acceptance.py`、`production_multipart_acceptance.py`。浏览器脚本要求专用隔离 profile 和 `CAIRNMAP_QA_ISOLATED=1`。

## 正式启用前仍需完成

1. 取得已有部署入口或本地受控凭据引用，核对实际 SCF alias、CAM 策略、GitHub App 权限及当前配置指针。当前可见本地记录没有可用腾讯云凭据或 App 私钥；公开指针请求为 403，不能据此当作“对象不存在”。
2. 通过现有 Control 审核执行固定 r11/r7 首版登记，再一致开启权威读取与审核配置 pin，避免 Dispatcher/Worker 混合状态接新任务。
3. 在真实环境完成 fresh OAuth、Maintainers/非成员、撤权、签名 PUT/CORS、部署等待、CAS 并发和回执恢复联调。本地替身测试及只读数据代理不能代替它们。
4. 对 73 条历史关联缺失记录安排人工核对。它们不阻断当前展示；开始重新提交这些记录前应补齐关联。

Pipeline 中 `docs/configuration-production-deployment.md` 已提供精确目录、开关、首版审批/登记、启用顺序和恢复操作。本轮没有声称已经完成这些线上步骤。

## 简略人工验收

1. 打开本地 `/?workspace=config-studio`，确认初始整包按键禁用；读取一个分类后只做模块核验，整包仍禁用；保存/放弃后做左侧“全局核验”，应可打开整包窗口。
2. 关闭或按 Escape 退出窗口，再核验下载，确认无需填写修订号；重新打开正式主页面，仍显示正式 r7，而非刚下载的本地版本。
3. 在设置中打开旧渲染入口，先取消，再重新启用；应进入独立 V1 页面并显示兼容标记，可返回正式地图。
4. 使用测试配置把面分类设为禁止多部件，确认部件选择/加/减不可用，内洞仍可新增、编辑、删除；折叠再展开并保存后仍是一个部件、多个环。

本地生产预览端口为 5202。Studio 可直接进入；地图浏览器验收的数据传输使用 5203 只读快照代理，未接入线上发布 API。
