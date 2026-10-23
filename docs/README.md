# CairnMap 文档索引

本目录按照使用场景重新分类。普通配置编辑者建议先阅读 `00_quick-start/`，需要深入维护配置结构时再阅读后续分册。

## 快速入口

- `00_quick-start/ConfigEditingManual.md`：配置编辑总手册，说明“要改什么、去哪里改、改完怎么检查”。
- `00_quick-start/ConfigAuthoringChecklist.md`：每次修改配置前后的核验清单。
- `00_quick-start/ConfigGlossary.md`：常用术语表。

## 配置编辑分册

- `10_authoring-guides/ClassConfigEditingGuide.md`：Class 配置编辑。
- `10_authoring-guides/SharedConfigEditingGuide.md`：Shared 配置编辑。
- `10_authoring-guides/WorkflowConfigEditingGuide.md`：Workflow 配置编辑。
- `10_authoring-guides/EnvironmentConfigEditingGuide.md`：Environment 配置编辑。
- `10_authoring-guides/PresetAuthoringGuide.md`：Preset 配置包编写。
- `10_authoring-guides/AssemblyEditingGuide.md`：Assembly 加载配置编辑。

## 配置包参考

- [r12 完整 JSON 人工阅读手册与候选](20_config-reference/runtime-v32-json-handbook-r12-20261020/README.md)：完整候选、200种结构/1121项中文字段解析及新图标/图片/胶囊范例；尚未发布。
- [本轮实现、验收与部署交付](90_roadmap-and-history/point-label-startup-v12-20261020/REPORT.md)。

- [当前 V3.2 完整 JSON 对照手册（r11/r7）](20_config-reference/runtime-v32-json-handbook-r11-r7-20261017/README.md)：当前完整配置副本、中文全字段表、实例行号索引及离线阅读器。下列项目包文档用于 V1 分文件来源体系，阅读当前 V3 整包请先使用此手册。
- `20_config-reference/ProjectConfigPackage.md`：项目配置包说明。
- `20_config-reference/ProjectPackageStructure.md`：项目包目录结构说明。
- `20_config-reference/PresetAssembly.md`：Preset 与 assembly 组装说明。

## Runtime 边界

- `30_runtime-contracts/RenderFormatRuntime.md`：Render / format runtime 说明。
- `30_runtime-contracts/CardRuntime.md`：Card runtime 说明。
- `30_runtime-contracts/WorkflowRuntime.md`：Workflow runtime 说明。
- `30_runtime-contracts/WorkflowComponentExecutorContracts.md`：Workflow component executor 契约。

## 校验与审计

- `40_validation-and-audit/ConfigValidationGuide.md`：`validate:project-config` 使用说明。
- `40_validation-and-audit/ClassConfigAudit.md`：Class 配置审计说明。
- `40_validation-and-audit/DisplayConfigAudit.md`：Display 配置审计说明。
- `40_validation-and-audit/SchemaFormatAudit.md`：Schema / format 审计说明。
- `40_validation-and-audit/RenderFormatFinalAudit.md`：Render format final 审计说明。
- `40_validation-and-audit/FinalCleanupHardAudit.md`：最终 hard audit 说明。

## Legacy 兼容

- `50_legacy-compatibility/LegacyCompatibility.md`：Legacy TS 兼容边界。
- `50_legacy-compatibility/CardLegacyCompatibility.md`：Card legacy 兼容边界。
- `50_legacy-compatibility/WorkflowLegacyCompatibility.md`：Workflow legacy 兼容边界。

## 路线与历史

- [契约与逐级迁移更新要求](20_config-reference/ContractUpdates.md)：修改配置工作台、升级契约及生成 SCF 核验器前必读。
- [c14 交付、验证与部署说明](20_config-reference/ContractC14Delivery.md)：本轮逐级迁移、Halo、编辑折叠及部署后验收顺序。

- `90_roadmap-and-history/FrameworkExtractionRoadmap.md`：CairnMap 配置抽出路线与阶段记录。
