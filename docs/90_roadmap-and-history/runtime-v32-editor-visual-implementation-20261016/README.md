# 编辑器视效更新验收证据

对应 [实施与验收报告](../RuntimeV32_Editor_Visual_Refinement_Implementation_Report_2026-10-16.md)。

修改前资料完整保留在 [基线截图](../runtime-v32-editor-visual-20261016/README.md)。

## 实页截图

| 区域 | 修改后截图 |
| --- | --- |
| 参照：图层按钮／世界 | [按钮](reference-buttons-1440.png)、[世界](reference-worlds-1440.png) |
| 要素字段 | [1440 px](feature-fields-1440.png)、[390 px](feature-fields-390.png) |
| 原生渲染规则及 Label | [规则设置](feature-render-1440.png) |
| 信息卡与绑定 | [卡片项](feature-card-1440.png)、[600 px 字段绑定](bound-card-600.png) |
| 公共表格 | [390 px](lookup-table-390.png) |
| 工作流页面 | [页面及输入](workflow-pages-1440.png) |
| 重复组 | [1440 px](workflow-repeat-1440.png)、[390 px](workflow-repeat-390.png) |
| 绘制／组装 | [绘制返回和输出](workflow-drawing-1440.png)、[TPP 额外绘制](workflow-v3-tpp_teleport-1440.png) |
| 表达式构造器 | [公式整行编辑](workflow-expression-1440.png) |
| 长标签对齐 | [强制换行压力检查](wrapped-heading-alignment.png) |
| 原生浏览器缩放 | [要素 200%](native-zoom-feature-2.png)、[工作流 150%](native-zoom-workflow-1.5.png) |
| 生产构建 | [真实工作台入口](production-studio-1440.png) |

## 机器可读记录和日志

- [宽度／样式及关键操作矩阵](editor-visual-browser-result.json)：58 组测量，包含工作区、表格、TPP、外部工作流、公式宽度及运行预览样式比较。
- [绑定和解除绑定交互](editor-reference-browser-result.json)：6 项实际界面操作。
- [原生 Edge 缩放](editor-native-zoom-result.json)：100%、125%、150%、200%，要素／工作流共 8 组。
- [换行标签对齐](editor-alignment-result.json)：普通／强制换行共 6 组，同排输入顶部误差 0 px。
- [生产入口检查](production-studio-result.json)。
- [源码行为边界及受保护文件哈希](visual-boundary.json)。
- [独立完整配置核验日志](verify-config-v32.log)。
- [最终生产构建日志](build.log)：包含 prebuild 完整核验。

浏览器脚本位于 `scripts/config-tools/browser/editor_visual_acceptance.py`、`editor_reference_interactions.py`、`editor_native_zoom_acceptance.py`、`editor_alignment_acceptance.py`。复现时必须指定专用隔离 CDP profile；主矩阵脚本会放弃其中的查看草稿并清理该 profile 的界面偏好，不应指向用户正在使用的浏览器。对齐脚本可用 `CAIRNMAP_EDITOR_PAGE_URL` 指定真实生产入口。

源码审计脚本为 `scripts/config-tools/verify-editor-visual-boundary.mjs`，默认比较基线 `ebaf17b`。它是本轮专用审计工具，不是限制后续正常功能迭代的永久门禁。
