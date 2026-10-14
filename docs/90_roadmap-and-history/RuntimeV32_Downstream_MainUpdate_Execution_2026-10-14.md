# 下游主体更新执行记录

用户已批准增量蓝图 v0.4。实施基线为用户合并 PR #40 后的 `0fa9b98c47bc7107a6b53922f335795203f575a3`，与 PR 最终代码树 `5eb400e` 相同。独立工作树 `wt/ria-config-runtime-v32-subject-20261014`，分支 `codex/ria-config-runtime-v32-subject-20261014`。

Node 24.21.0 / npm 11.19.0 下锁文件安装、合并基线的 39 组核验及 build 已通过。原 V1、r9/r5、历史蓝图/fixture 和已发布数据保留。

本轮范围为 C：UI/FORM、DRAW、契约/迁移、INHERIT/PREFILL、REL/SEARCH、TABLE、LABEL、APP 及下游真实验收。D 回写、V3 正式转正、导航表消费者替换不在本次执行范围。

| 主题 | 状态 | 证据/提交 |
| --- | --- | --- |
| 合并基线冻结 | 完成 | 0fa9b98；`.cache/main-update/baseline-build.txt` |
| 新契约及默认迁移 | 待实施 | |
| UI-01/02 与 FORM-01～04 | 第一批完成，最终全编辑器复核待后续模块 | b64f21c；21 个编辑器柔性布局；真实控件宽度、双导航、三态、搜索关闭及标签零行验收通过，39 组核验/build 通过 |
| DRAW-01/02 | 完成，最终全量回归保留 | 40 组核验/build 通过；17 个原生工作流、34 份最终 record 与冻结 V1 fixture 完全一致；真实地图 TPP 目标点→主点→信息页回退/撤销/重画后，主坐标与目标坐标/高度独立保留。证据 `.cache/main-update/subject-native-workflow-matrix.json`、`subject-drawing-session.json`、`draw-verify.txt`、`draw-build.txt` |
| INHERIT-01 / PREFILL-01 | 待实施 | |
| REL-01 / SEARCH-01 | 待实施 | |
| TABLE-01 | 待实施 | |
| LABEL-01 | 待实施 | |
| APP-01 与退役接口 | 待实施 | |
| 全量、浏览器、真实数据和服务验收 | 待实施 | |

每个主题独立本地提交并执行 `npm run verify:config-v32` 和 `npm run build`，保留实际结果。未验收的服务与人工项不写成通过。
