# C 阶段来源与退役接口核对

现役来源为 formal-cos / formal-github 的 formal-release-v2；媒体根地址与几何发布版本分别保留。COS 与 GitHub 镜像并非同一时点版本，不自动回退或混用。来源切换仍需显式应用。

| 退役项 | 原消费者 | 处理与证据 |
| --- | --- | --- |
| legacy-github / legacy-merge-v1 | 来源菜单、worldRuleDatasetLoader | 正常配置、绑定、下拉中移除；读取器拒绝旧格式；旧 selection 仅提示确认现役源，不能拉取旧仓库 |
| 旧 Data_Merge HTTP 目录 | 导航/工作流集合加载、原 merge index/chunk builder | loadRuleItemsForWorld 统一读取正式发布；旧 index/chunk HTTP builder 删除；不再用旧 pub 清单回退 |
| 旧 Picture 仓库/公共目录探测 | pictureRules 信息卡 | 仅保留临时挂载图片和版本固定的 formal Media；正式无图或失败不会去旧仓库探测 |
| 旧 source/release/cache | worldRuleCache、来源控制器 | 非正式 reader schema 与 legacy-github 缓存拒绝；来源变化中止请求、清理相关缓存/内存；每个快照有 generation，迟到结果不进入当前 store |
| currentOpenRIAMapData / Picture / plannedOpenRIAMapData 存储声明 | contract-only 维护合同/示例 | 正常引用迁至 featureData.formal.current / media.formal.current / mediaIndex.formal.current；原样例保留，另建 formal-profile 示例。维护 Split 路径仍是本地暂存合同，不作为浏览器 HTTP 源 |
| 旧线路列表 | 默认关闭的旧代码入口 | 总体规则不提供此退役入口；现役铁路/传送/道路/步行导航保留。历史算法/fixture 保留，不因旧缓存启用 |

新 application schema 的数据读取器只接受 formal-release-v2，工作台没有退役来源设置。旧合同/历史 fixture 中的旧字符串仅作为来源证据；不将文本搜索命中当作现役消费者。

审核仍使用现役同源 GitHub Cookie/nonce、HttpOnly 会话及服务端角色判断。公开 API 路径可配置；部署依赖清单列出 api 实际读取的 CAIRN_* 环境引用名，浏览器包不含凭据。禁用/空接口的 session/login/logout/control/workflow/public 请求路径在网络调用前被阻断。引用名不会修改服务端环境；后端地址和凭据由部署环境设置。

存储、FeatureData、MediaIndex、RelayPackage 及项目装配校验通过。47 组配置核验与构建通过，证据 consumer-final-verify/build；原始媒体样例与 byte hashes 未覆盖。生产审核账号操作、生产 COS 跨域和外部瓦片服务并未因这些本地测试而自动成为已验收。

D 上游空置模板回写、V3 正式转正及导航功能表接入保留原执行边界，本次不执行。
