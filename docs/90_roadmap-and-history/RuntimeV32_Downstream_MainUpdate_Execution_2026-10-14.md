# 下游主体更新执行记录

用户已批准增量蓝图 v0.4。实施基线为用户合并 PR #40 后的 `0fa9b98c47bc7107a6b53922f335795203f575a3`，与 PR 最终代码树 `5eb400e` 相同。独立工作树 `wt/ria-config-runtime-v32-subject-20261014`，分支 `codex/ria-config-runtime-v32-subject-20261014`。

Node 24.21.0 / npm 11.19.0 下锁文件安装、合并基线的 39 组核验及 build 已通过。原 V1、r9/r5、历史蓝图/fixture 和已发布数据保留。

本轮范围为 C：UI/FORM、DRAW、契约/迁移、INHERIT/PREFILL、REL/SEARCH、TABLE、LABEL、APP 及下游真实验收。D 回写、V3 正式转正、导航表消费者替换不在本次执行范围。

| 主题 | 状态 | 证据/提交 |
| --- | --- | --- |
| 合并基线冻结 | 完成 | 0fa9b98；`.cache/main-update/baseline-build.txt` |
| 新契约及默认迁移 | r10 模型及继承迁移完成；角色/搜索/总体规则与最终默认种子待后续主题 | 严格 schema、r9→r10 迁移差异；旧 r9/r5 默认、fixture、摘要保留 |
| UI-01/02 与 FORM-01～04 | 第一批完成，最终全编辑器复核待后续模块 | b64f21c；21 个编辑器柔性布局；真实控件宽度、双导航、三态、搜索关闭及标签零行验收通过，39 组核验/build 通过 |
| DRAW-01/02 | 完成，最终全量回归保留 | 40 组核验/build 通过；17 个原生工作流、34 份最终 record 与冻结 V1 fixture 完全一致；真实地图 TPP 目标点→主点→信息页回退/撤销/重画后，主坐标与目标坐标/高度独立保留。证据 `.cache/main-update/subject-native-workflow-matrix.json`、`subject-drawing-session.json`、`draw-verify.txt`、`draw-build.txt` |
| INHERIT-01 / PREFILL-01 | 完成；搜索副标题同类能力随后接入 | 父字段身份/定义/类型/名称/对照固定继承；稳定卡片来源继承与本地布局分离。迁移前后 79 份子卡可见项来源/名称/对照/显示器/关系不变；新建/导入、接收开关与副本绕过阻断、编译缓存通过。清除、独立副本变化警告、逐版本确认及真实编辑器五宽度测试通过；工作流表格依赖随草稿原子保存，严格导入及冲突阻断通过。42 组核验/build，证据 `.cache/main-update/inherit-verify.txt`、`inherit-build.txt`、`r10-inheritance-migration.json`、`subject-inheritance-acceptance.json` |
| REL-01 / SEARCH-01 | 关系及搜索模型、运行索引、编辑、迁移和跨分类入口完成；最终地图验收保留 | 44 组核验/build；FLR→BUD/STB、反向引用、世界隔离、歧义阻断、0 层级、点击/楼层上下文和严格新输出通过。主图/导航共享搜索配置；缓存 COS 495 条记录中 433 条原有可搜索记录的资格及副标题完全一致。真实生产搜索控件对数据快照替换即时更新，无需切世界或重输查询；跨分类工作流/信息卡和原子保存目标检查通过。证据 `.cache/main-update/search-verify.txt`、`search-build.txt`、`search-data-audit.json`、`subject-search-acceptance.json`。搜索设置默认向下继承并允许子级本地细化，可显式选择固定继承；主/附属身份按字段设计固定继承。受控响应回放不作为生产 COS 跨域成功证据 |
| TABLE-01 | 完成模型、编辑与执行接入；新版默认迁移随后统一交付 | r10 严格契约；V1 两表/四返回点；显式绑定、解除副本、ID 事务改名、引用删除阻断、字段/工作流/重复组解析和一次性预填；分类依赖信封与 ZIP 冲突/往返通过。41 组核验/build；五宽度实际控件验收及无原始 JSON 编辑通过，证据 `.cache/main-update/table-verify.txt`、`table-build.txt`、`subject-table-acceptance.json` |
| LABEL-01 | 解析、编辑、运行与迁移完成；最终默认包及视觉验收随后统一交付 | 45 组核验/build；安全独立模板、转义/预算、空/对象回退、0/false、冻结编译缓存和未知字段阻断通过。27 组实际 RLE Zoom/方向渲染计划验证：2–4 的 direction=3 新增 11px bureau+line 颜色胶囊，其他区间/方向文字及样式保持原意。旧 V1 fixture 保留。证据 `.cache/main-update/label-verify.txt`、`label-build.txt` |
| APP-01 与退役接口 | 待实施 | |
| 全量、浏览器、真实数据和服务验收 | 待实施 | |

每个主题独立本地提交并执行 `npm run verify:config-v32` 和 `npm run build`，保留实际结果。未验收的服务与人工项不写成通过。
