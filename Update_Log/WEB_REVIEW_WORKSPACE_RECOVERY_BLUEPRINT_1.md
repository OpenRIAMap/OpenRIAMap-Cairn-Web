# Web 审核工作区恢复与模块准入蓝图 1

## 0. 结论与范围

本蓝图的三项需求均可实现，且不需要变更审核发布 Pipeline、SCF、COS、CAM 或审核 ZIP 契约。

本轮只调整 Web 的模块入口、动态代码分包、审核图层管理 UI 和三工作区的切换协调。审核包下载继续使用现有短时签名下载、浏览器内存缓存、长度及 SHA-256 校验；不会把审核 ZIP、图片、图层或草稿写入 `localStorage`。

`旧数据`保持为独立的按需分包功能，不纳入本蓝图的“测绘 / 测量 / 审核”三方互斥组。

## 1. 固定基线（生成前必须验证）

### 1.1 Web 实现基线

所有后续 Web 代码生成都必须在以下工作区执行，不能以旧 V5 分支、截图中的 Preview 版本或另一个工作区为起点：

```text
工作区：G:\RIAWebGIS\NewPRES\CairnMap_Codex\wt\ria-pkg-normalize-gate-recovery
分支：codex/ria-review-release-gate-recovery-1
提交：0f9db6d203aff8317b527898d53da3c51f1b4410
来源：origin/main（该提交即当前 origin/main）
```

该提交是已合并的 V5.1 主线，提交主题为 `Merge pull request #25 from OpenRIAMap/codex/ria-review-workflow-v5-main-baseline-1`。它包含当前主线的导航合并、工作区隔离、发布进度、统一确认层与归档工作流基础，必须完整保留。

在该提交之上，存在且必须保留一份尚未提交的“两项补强”覆盖层：

```text
文件：src/components/Review/ReviewStatusBoardPanel.tsx
HEAD blob：7b806c470c40e30814c9bcae5fe4296bde36a33a
工作区 blob：251d7f52462a64053c2413bd6f95b7c6bef49bd2
工作区 SHA-256：ab42d2cdf84648ad54341ace84a73533fa023222c8870d52a2a1587a18631a6d
覆盖层 diff SHA-256：a455736ea820a83436d8fcac88a5be95826e629b1879bbaadc8c8a5aa2ba725b
```

该覆盖层在发布确认失败时清除伪造的本地队列进度、回读权威 Release Gate，并将 `review-release-gate-changed`、锁冲突及旧决策锚点转成可操作提示。它不是本蓝图要回退或重写的内容。

生成开始前，必须逐项核对：

1. `git rev-parse HEAD` 必须是 `0f9db6d203aff8317b527898d53da3c51f1b4410`；
2. 工作区除上述 `ReviewStatusBoardPanel.tsx` 覆盖层及本蓝图产生的预期文件外不得有未知改动；
3. 覆盖层工作文件 hash 必须与本节一致；若不一致，停止生成并先汇报新的基线；
4. 生成报告必须先写出上述提交和覆盖层指纹，再写任何修改内容。

### 1.2 冻结的 Pipeline 参照（不在本轮变更范围）

Web 蓝图不得修改 Pipeline 工作区。作为联调参照，当前冻结版本为：

```text
Pipeline worktree：wt/review-workflow-v5-main-baseline
HEAD：7c3a4b3eba171c2635310fceda3e132d13efe827
Dispatcher SHA-256：733420406d3b0e701b25d88b1af581806e75e2ca14d26dc64fc0e14cf5c2f072
Archive Worker SHA-256：008ed8a50e91f6b9f6fd2caeaced8bae4ead4550b6bed27c86fd72340c6282da
```

Web 的本轮变更不得重新生成、覆盖或要求部署任何 Pipeline ZIP。

## 2. 已确认的回归根因

### 2.1 审核图层管理的九按钮被错误收缩

在当前 V5.1 主线中，`Mapping/core/MeasuringModule.tsx` 的审核工作区分支将状态灯操作移到审核包详情，仅留下“保存、临挂、导出、删除”四项。这与既有审核工作区的三行三列九按钮设计不一致。

旧布局的九项为：

| 行 | 按钮 |
| --- | --- |
| 1 | 保存 / 通过 / 打回 |
| 2 | 归档 / 要求修改 / 恢复待审 |
| 3 | 临挂 / 导出 / 删除 |

审核包详情页现有的下载、加载、预检与状态灯入口是需要保留的辅助入口，而非替代审核图层管理中的九按钮。

### 2.2 三个工作区没有原子切换边界

`MapContainer.tsx` 目前分别维护 `moduleMode`、测绘活跃态、测量活跃态、打开/关闭 signal 和待加载模块意图。部分入口在等待 `requestCloseAndClear()` 或分包加载完成之前就写入 `moduleMode` 或发出打开 signal，因此会产生：

- 审核状态下点测绘会提前进入 mapping 视图；
- 审核按钮与测绘下拉框被同一次点击同时唤起；
- 审核状态下测量按钮因条件渲染消失；
- 测量/测绘切换在确认框出现前已启动目标工具，取消后两个工具仍可能活跃。

这些是宿主协调问题，不应通过让 ReviewWorkspace 与 MappingWorkspace 共享 React 生命周期来解决。

### 2.3 审核入口没有独立分包及登录准入

当前审核入口复用了 `measuring` 分包的加载标志，且 `ReviewModule` 由 `MapContainer` 静态导入。它既无法准确说明“审核 + 测绘”依赖，也会在未登录时过早将审核 UI 置为活跃。

## 3. 目标架构

### 3.1 三工作区协调器

在 `MapContainer` 的宿主层新增一个可单元测试的协调器（建议 `workspaceTransitionCoordinator.ts`），作为测绘、测量、审核唯一入口。它维护：

```ts
type WorkspaceKind = 'runtime' | 'mapping' | 'measurement' | 'review';
type TransitionPhase = 'idle' | 'awaiting-source-confirmation' | 'preparing-target';
```

协调器是唯一能够：

- 请求关闭当前工作区；
- 递增 close/open signal；
- 更新 `moduleMode` / 当前工作区；
- 重置 `workspaceInstanceKey`；
- 请求分包加载；
- 允许审核工作区挂载的入口。

`MeasuringModule`、`Mtools` 的活跃事件只能向协调器报告真实状态；迟到的事件必须按 transition token 忽略，不能反向激活已退出的工作区。

### 3.2 原子切换协议

用户点击目标模块 `T` 时，依序执行：

1. 若已有过渡进行中，忽略重复点击，界面保持只读忙碌态；
2. 从协调器而不是组件显示状态取得当前源模块 `S`；
3. 若 `S` 为 `runtime`，直接进入目标准入检查；
4. 若 `S` 与 `T` 不同，先在 Portal 的最高层确认框中说明会清除源工作区的图层、删除标记、图片 URL、编辑器状态、临时挂载和未保存编辑；此时**不得**加载、挂载或打开目标模块；
5. 点击“继续编辑”时，完整保留 `S`，取消过渡，不改 `moduleMode`、signal、面板和下拉框；
6. 点击“放弃编辑并继续”或审核工作区的“保存新版本并继续”成功后，等待源模块完成清理与卸载，再进行 `T` 的分包/身份准入；
7. 目标准入通过后才发送目标 open signal、挂载目标 React 实例，并记录新的 active workspace；
8. 目标下载、身份检查或加载失败时停在 `runtime`，绝不恢复已放弃的源模块，也绝不留下半启动的目标模块。

审核工作区仍使用独立、keyed 的 `ReviewWorkspace` React 实例；普通测绘仍使用独立的 `MappingWorkspace` 实例。不得在已挂载的编辑器中把 `reviewWorkspace` 从 `false` 切换为 `true`。

### 3.3 固定入口呈现

桌面右上角模式面板始终保留三个稳定位置：

```text
测量工具 / 测绘 / 审核
```

它们均为协调器入口，不能由 `moduleMode === 'review'` 的条件渲染移除。审核活跃时：

- 测量、测绘按钮仍可见；点击时只发起切换确认；
- 测绘下拉框、编辑器和测量工具不会先行打开；
- 审核按钮仅表示审核活跃，不产生普通测绘下拉框；
- 旧数据开关与地图一般控件维持原有行为。

## 4. 审核图层管理：恢复三行三列九按钮

在 `Mapping/core/MeasuringModule.tsx` 的 `isReviewWorkspace` 分支恢复固定 `grid grid-cols-3` 布局，并保留现有审核包详情页。

| 按钮 | 行为 | 约束 |
| --- | --- | --- |
| 保存 | 将审核编辑导出为新的不可变审核修订版 | 仅 dirty 时可用；沿用当前远端修订保存和失败保留本地编辑的语义 |
| 通过 | 写入本地“通过”状态草稿 | 不直接发布；需在审核序列点击“保存状态”才提交 |
| 打回 | 收集原因后写入本地“打回”状态草稿 | 不直接写服务端 |
| 归档 | 写入本地“归档”状态草稿 | 不执行归档任务；仍由审核序列保存状态及发布流程决定 |
| 要求修改 | 收集原因后写入本地状态草稿 | 不直接写服务端 |
| 恢复待审 | 写入本地“待审核”状态草稿 | 不直接写服务端 |
| 临挂 | 沿用现有临时挂载和 ID 冲突检查 | 不跨审核/测绘实例残留；退出时完整清理 |
| 导出 | 沿用标准包导出入口 | 不绕过审核修订保存或上传约束 |
| 删除 | 沿用删除标记面板 | 仅作用于当前审核工作区 |

状态草稿通过单一的应用内事件/port 写入，审核图层管理与审核包详情页必须订阅同一个 submissionId 的草稿状态。任一入口修改状态后，另一个入口在当前会话立即反映；只有审核序列的“保存状态”允许持久化到审核服务。

不得恢复旧的 `window.confirm` / `window.prompt`。通过、打回、要求修改、归档和恢复待审继续使用统一的 Portal 确认/原因输入层，以避免被审核序列、详情页或发布进度面板遮挡。

## 5. 审核与测绘分包、缓存和登录门槛

### 5.1 分包模型

保留现有 `measuring` 存储键作为“测绘基础分包”的兼容标识，并在 `featureModuleStore` 加入 `review` 模块标识；不要清除已有用户的测绘启用记录。

建议新增 `entrypoints/reviewEntry.ts`，负责预加载 ReviewModule、ReviewWorkspace、审核详情/状态面板及其依赖。`MapContainer` 改为懒加载审核模块，避免审核 UI 落在初始主包中。

审核入口的依赖关系为：

```text
审核入口
  ├─ 测绘基础分包（现有 measuring loader）
  └─ 审核分包（新的 review loader）
```

首次点击审核时：

- 两者皆未就绪：显示单一确认框“需要下载审核与测绘分包”；
- 仅测绘未就绪：说明需要下载测绘分包；
- 仅审核未就绪：说明需要下载审核分包；
- 确认后按“测绘 → 审核”顺序加载，并使用同一加载遮罩显示阶段；
- 取消或任一加载失败：不切换工作区，不留下 review pending intent。

浏览器本地保留模式与现有测绘分包一致：只在 `ria_feature_modules_v1` 中按 app version 记录用户已启用以及成功加载的分包标识；实际代码由浏览器/Vite 缓存管理。审核会话、包 ZIP、图片 Blob、图层、删除标记及草稿均只存在于当次浏览器会话，刷新、离开审核或关闭标签页后清理。

### 5.2 登录门槛

分包全部加载完成后，且在创建 ReviewModule、ReviewWorkspace、审核序列或审核图层管理之前，调用 `openriamapGithubReviewAuth.getSession()`：

- `authenticated`：允许协调器完成审核入口；
- `anonymous` / `expired`：显示不可跳过的提示，明确要求在设置中登录；
- `unavailable`：显示身份服务不可用提示，不允许进入审核。

该提示没有关闭叉、背景点击或 Escape 关闭路径，只有一个“确认并前往设置”按钮。点击后关闭提示、打开设置面板并定位既有 `ReviewAuthSettingsSection`；不保留自动重试意图。用户完成登录后必须再次点击审核入口，届时重新做会话检查。

审核包下载仍在审核包详情内，继续使用服务端短时下载签名、长度和 SHA-256 校验。分包下载与审核 ZIP 下载是两条不同链路，不能混淆或共享持久化数据。

## 6. 实现文件边界

| 位置 | 修改职责 |
| --- | --- |
| `src/components/Map/MapContainer.tsx` | 接入唯一协调器、固定三个入口、移除提前写 mode/signal 的路径、延迟挂载审核模块、接入设置跳转 |
| `src/components/Map/workspaceTransitionCoordinator.ts`（新增） | 纯状态机、transition token、确认后的 source teardown 与 target readiness 编排 |
| `src/store/featureModuleStore.ts` | 增加 `review` 分包、兼容迁移既有 `measuring` / `legacy` 持久化结构、依赖加载和进度状态 |
| `src/entrypoints/reviewEntry.ts`（新增） | 审核 Web chunk 预加载入口 |
| `src/components/Common/FeatureModuleLoadingOverlay.tsx` | 增加审核分包和“测绘 → 审核”阶段文案 |
| `src/components/Mapping/core/MeasuringModule.tsx` | 恢复审核工作区九按钮；通过统一草稿 port 同步状态；不再把详情页作为状态操作的唯一入口 |
| `src/components/Review/ReviewModule.tsx` / `ReviewStatusBoardPanel.tsx` | 保持审核包详情功能，接入共享状态草稿刷新；完整保留未提交的 Release Gate 失败恢复补强 |
| `src/components/Review/ReviewConfirmationHost.tsx` 或新的宿主确认组件 | 以 Portal 提供不可被普通面板遮挡的切换确认、状态原因输入与登录门槛提示 |
| `src/components/Toolbar/*` | 仅在需要时抽取固定入口外观；不改变现有一般图层/旧数据控件语义 |

不得更改：`api/*` 审核认证和审核控制契约、Pipeline、COS/CAM/SCF 配置、审核 ZIP 格式、发布 Gate/归档协议。

## 7. 验收矩阵

### 7.1 UI 与状态草稿

1. 审核图层管理在桌面端固定展示三行三列九按钮，顺序与第 4 节完全一致；
2. 审核包详情仍保留下载、加载、预检、版本选择及状态操作；
3. 在任一入口设置通过/打回/要求修改/归档/恢复待审后，另一入口同步显示同一未保存状态；
4. 仅审核序列“保存状态”发生远端状态写入；九按钮不直接发布、归档或回滚数据；
5. 保存审核编辑成功生成新修订版，失败时工作区编辑不丢失。

### 7.2 三方互斥

对以下六个定向切换逐一验证：

```text
测绘 → 测量    测绘 → 审核
测量 → 测绘    测量 → 审核
审核 → 测绘    审核 → 测量
```

每一项均覆盖：

- 源工作区为空：可直接切换；
- 源工作区有图层、删除标记、图片或未保存编辑：先出现最高层确认；
- 选择“继续编辑”：源工作区、图层、按钮活跃态及下拉框原样保留，目标完全不挂载；
- 选择放弃：源先完整清理，再且仅再启动目标；
- 审核保存新版本成功后切换：新修订版成功保存，源审核实例销毁后再进入目标；
- 快速连点：只有首次 intent 生效，不产生并行确认框或双活模块；
- 三个入口始终可见，审核状态下测量按钮不得消失。

### 7.3 分包和身份

1. 新浏览器中首次点审核，显示准确的审核/测绘分包提示；确认后按依赖顺序加载；
2. 测绘已缓存但审核未缓存时，只加载审核分包；两者缓存后不重复提示；
3. 刷新后仅恢复分包启用标识，不恢复审核包、图层、图片 URL、删除标记或草稿；
4. 审核分包加载完成但未登录、会话过期或身份服务不可用时，审核 UI 不挂载；
5. 登录门槛提示只能“确认并前往设置”；登录成功后重新点审核才可进入；
6. 审核 ZIP 下载、SHA-256 校验、本地预检和置入审核工作区仍通过既有受控路径。

### 7.4 自动化与构建

实现时至少新增以下不依赖浏览器真实云端的测试：

- `workspaceTransitionCoordinator`：六方向切换、取消、保存、失败和迟到事件 token；
- `featureModuleStore`：旧存储迁移、review 依赖、加载失败和版本失效；
- 状态草稿同步：九按钮与详情入口使用一个 submission 草稿；
- 登录门槛：匿名、过期、不可用、已登录四种状态；
- 现有 `test:review-status-board`、`test:review-workspace-contracts`、`test:review-package-contract`、`test:review-package-profile-auth`、`test:review-auth-routes`；
- `npm run build` 与项目既有审核/数据源契约测试。

## 8. 生成纪律

1. 开始生成前先在报告中重复第 1 节 Web 基线和 Pipeline Dispatcher SHA；
2. 先为协调器、分包依赖和登录门槛编写测试，再接入 UI；
3. 不得为了恢复九按钮而回退 V5.1 的独立工作区、不可变修订保存、发布进度、Portal 确认或 Release Gate 补强；
4. 不得为了分包而引入审核数据持久化、浏览器云凭据或直接 COS 访问；
5. 每个生成阶段报告变更文件、基线验证和测试结果；如基线指纹漂移，停止而不是猜测性合并。
