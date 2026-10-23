import {addC14ProfileDefaults} from './contractMigration';
import {initializeC15Profile} from './c15Migration';
import { r12RenderRule } from './r12Migration';
import type { ConfigPackageV3, GeometryKind, GeometryProfile, ZoomPriorityRule } from './types';
import { orderFactoryWorkflowForms } from './workflowFormMigration';
import { migrateFieldsToR8 } from './fieldMigration';
import { createDefaultGeometryProfile } from './v32Defaults';
import { renderRuleRange } from './renderRuleConditions';
import { migrateRenderRulesToR7 } from './renderRuleMigration';
import { createConfigPackageFromCurrentProject } from './legacyProjectAdapter';
export const newConfigId = (prefix: string) => `${prefix}-${globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`}`;
export function copyRenderRuleContent(source: ZoomPriorityRule, id = newConfigId('render')): ZoomPriorityRule {
  if (source.conditionalOverrides?.length) throw new Error('请先无损迁移旧条件分支，再复制完整规则内容。');
  const { id: _id, when: _when, minZoom: _min, maxZoom: _max, minExclusive: _mi, maxExclusive: _ma, conditionalOverrides: _branches, ...content } = structuredClone(source);
  return { ...content, id };
}
export function normalizeEditedRenderRule(rule: ZoomPriorityRule, revision: number): ZoomPriorityRule {
  if (revision < 7) return rule;
  const range = renderRuleRange(rule);
  const { minZoom, maxZoom, minExclusive: _mi, maxExclusive: _ma, conditionalOverrides: _branches, ...rest } = rule;
  return { ...rest, when: { ...rule.when, zoom: { min: minZoom ?? range.min, max: maxZoom ?? range.max } } };
}
export function createEditableConfigPackageFromCurrentProject(): ConfigPackageV3 {
  const source = createConfigPackageFromCurrentProject();
  const migration = migrateRenderRulesToR7(source);
  if (!migration.config) throw new Error(`原生 c7 工厂包迁移失败：${migration.issues.join('；')}`);
  const config=migrateFieldsToR8(migration.config);config.workflows=config.workflows.map(orderFactoryWorkflowForms);
  return { ...config, revision: source.revision + 2 };
}
export function editableGeometryProfile(geometry: GeometryKind, revision: number): GeometryProfile {
  const profile = createDefaultGeometryProfile(geometry);
  profile.zoomPriority.rules = profile.zoomPriority.rules.map(rule => normalizeEditedRenderRule(revision>=12?r12RenderRule(rule,geometry):rule, revision));
  if(revision>=14)addC14ProfileDefaults(profile,geometry);
  if(revision>=15)initializeC15Profile(profile,geometry);
  return profile;
}
export function prepareRenderRule(rule:ZoomPriorityRule,geometry:GeometryKind,revision:number):ZoomPriorityRule{
  const profile=createDefaultGeometryProfile(geometry);
  profile.zoomPriority.rules=[revision>=12?r12RenderRule(rule,geometry):rule];
  if(revision>=14)addC14ProfileDefaults(profile,geometry);
  if(revision>=15)initializeC15Profile(profile,geometry);
  return profile.zoomPriority.rules[0];
}
