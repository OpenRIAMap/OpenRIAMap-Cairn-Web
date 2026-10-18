# 编辑器视效现状检查记录

2026-10-16，基线 `ebaf17b`，契约 r11／配置 r7。

对应方案：[前端视效整理蓝图 v0.1](../RuntimeV32_Editor_Visual_Refinement_Blueprint_2026-10-16.md)。

本文件记录修改前的实页状态，不是实施后的验收报告。浏览器使用单独的隔离 profile，入口为本地 5193 开发应用的 `subject-ui-acceptance.html?mode=general&resources=1`，加载实际 ConfigStudio 组件和应用默认包，没有保存所读取的草稿。该入口不挂载主图的完整真实要素池，截图用于布局检查。

## 参照页面

- [图层按钮](02-reference-layer-button.png)：条目有明确的 ID 头部、真实预览、参数区和分隔线；显示内容每条独立成块。
- [世界与地图](03-reference-worlds.png)：世界名称是条目头，属性标签和输入纵向一致，同级条目间距清楚。

## 要素设计

- [字段设计](05-feature-fields.png)：字段有第一行四项和第二行操作，但相邻字段及内部参数区整体依赖浅细框；列表身份和分区有改进空间。
- [渲染规则与 Label](06-feature-render-rule.png)：约 653 px 编辑栏内，Label 来源复合子区和普通参数共同占网格，出现不均匀空白；标签和输入基线不统一。
- [信息卡](07-feature-information-card.png)：显示字段的问号落在输入框下方；卡片项缺少与按钮／世界一致的条目头，旗标、对照和操作条分散。
- [600 px 新增分类与验证器](15-category-create-600.png)：新增分类字段可以换行，但验证器与编辑区域的高度分配存在重叠，掩盖了部分编辑区顶部。

## 工作流设计

- [工作流概览](09-workflow-overview.png)：页面、控件、填写设置使用相似的浅细边框；“必填”旗标、默认值、普通字段共享栅格，行高不一致。
- [重复组子字段](11-workflow-repeat-children-wide.png)：已经有 mode 等子字段标题，应保留；仍需统一组、子字段、参数分区的边界强度和旗标行排布，减少多层套框。
- [绘制与输出组装](12-workflow-drawing.png)：返回槽位、说明、开关和高度选择混用一排；输出 assignment 需要更清楚的条目身份和参数分区。
- [公式构造器](13-workflow-expression.png)：上方字段／函数区域很宽，下方公式框却只占约 173 px，帮助外壳未承接所需伸展宽度。
- [390 px 重复组](14-workflow-repeat-390.png)：未复现整页水平超宽，但多层内缩、头部控件纵向堆叠导致识别效率及空间利用不足。

## 实测尺寸

| 项目 | 实测结果 |
| --- | --- |
| 工作流整体水平宽度 | 1440、900、600、390 px 视口下，文档 scrollWidth 与 clientWidth 相同 |
| 局部 label | 部分重复组标签单元在 1440／900 px 下超宽约 4 px；600 px 下仍有个别发生 |
| 公式构造器 | 构造器宽 1271 px；公式 textarea 宽 173 px；其帮助外壳宽 194 px |
| 窄窗验证器 | 600×1000 下验证器框约 y=244–644，编辑框约 y=605–955，发生约 38 px 重叠 |

尺寸原始记录：

- [工作流宽度记录](workflow-layout-observations.json)
- [公式宽度记录](expression-layout-observations.json)
- [预览内部布局记录](preview-layout-observations.json)
- [验证器与编辑栏外框记录](preview-sibling-layout-observations.json)

截图中远端瓦片未加载和底图提示不作为本轮视觉缺陷或显示能力判定；本轮未修改网络、数据和渲染逻辑。未执行产品构建或将此检查冒充全套功能回归。
