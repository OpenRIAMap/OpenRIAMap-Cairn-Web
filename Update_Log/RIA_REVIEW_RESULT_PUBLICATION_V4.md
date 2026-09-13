# RIA 审核结果发布与公开记录 v4

## 前端工作流

- 发布前检查与发布允许已通过、已归档、已打回、要求修改的已保存状态灯；恢复待审始终被排除。
- 已通过项继续进入正式数据发布；其余三种结果为仅归档的结果发布。
- 发布记录已从审核序列内部移出，成为右上模式面板和移动端抽屉均可打开的公开只读页面。
- 每个审核包独立显示版本、状态、要素/删除/图片数量与单独下载；打回和要求修改的多行意见完整保留。新页面不提供“下载全部包”。

## 交互与布局

- 打回、要求修改改用可输入多行的审核意见覆盖框，不再使用单行浏览器 prompt。
- 所有审核操作、确认和意见框通过 Portal 直挂 `document.body`，使用高于任何可拖动面板的 z-index，修复确认/进度框被浮动面板遮挡的问题。
- 规则图层面板和模式面板可以分别收起为独立图标；玩家显示开关移入规则图层面板。
- 桌面和移动端均隐藏旧铁路、旧地标图层入口；路径规划仅展示新铁路、新传送、道路与步行模式。

## 公共接口与配置

新增无登录读取的同源 API：

- `GET /api/public-review-releases?limit=20`
- `GET /api/public-review-releases?releaseId=<releaseId>`
- `POST /api/public-review-releases`，请求一个公开记录中列明的单审核包临时下载 URL。

接口只通过既有 Vercel Broker 使用 `CAIRN_CONTROL_API_BASE` 与
`CAIRN_BROKER_TO_DISPATCHER_SECRET` 请求 Dispatcher；不读取浏览器登录
cookie、不暴露 COS key，也不需要新增 Vercel 环境变量。仍要求现有
`CAIRN_REVIEW_AUTOMATION_ENABLED=true` 和
`CAIRN_REVIEW_AUTOMATION_STAGE=staging` 仅继续约束审核写入操作；本公开
只读接口不受这两个门槛限制，但仍受 Broker 到 Dispatcher 的服务端签名、
已完成发布状态及已归档包范围约束。
