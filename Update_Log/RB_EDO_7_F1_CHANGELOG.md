# RB_EDO_7_F1 Changelog

基线：OpenRIAMap-Web_RB_EDO_7.zip

## 修复内容

1. 测绘 panel 右上角开关按钮接入 DraggablePanel 展开态窗口控件区。
   - DraggablePanel 新增 `expandedHeaderActions` 可选插槽。
   - 测绘 panel 的“要素交互抑制 / 工具栏显示抑制”按钮不再挤在内容标题栏内。
   - 测绘 panel 使用隐藏的 `data-draggable-close` 代理关闭，视觉上的最小化 / 关闭按钮继续由 DraggablePanel 管理。

2. 修复绘图状态下要素交互抑制未完全生效的问题。
   - RuleDrivenLayer 在 declutter label 元数据中使用统一的 `effectiveFeatureClickPlan`。
   - 要素交互抑制开启且处于绘图添点状态时，普通 label / symbol / geometry 点击不再打开信息卡。
   - 删除要素选择与辅助线拾取等专用拾取模式保持可用。

## 不变范围

- 不修改测绘导入 / 导出业务逻辑。
- 不修改数据源、分享链接、Legacy、玩家、导航、BUD/STB label 体系。
- DraggablePanel 默认行为不变，`expandedHeaderActions` 未传入时不影响其他面板。
