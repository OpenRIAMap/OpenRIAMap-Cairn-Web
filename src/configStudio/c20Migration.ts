import { stableConfigText } from '../configRuntime/configurationFingerprint';
import { businessJsonTemplateByField } from './businessJsonValidation';
import type { MigrationChange } from './contractMigration';
import type { CategoryNode, ConfigPackageV3, RenderLogicTemplate, RenderRuleExtensions, RenderLabelStyle } from './types';
import { VALUE_SCHEMA_TEMPLATES } from './valueSchema';

export type C20RetirementSource = {
  nodes?: CategoryNode[];
  engine?: ConfigPackageV3['engine'];
  renderDependencies?: { templates: RenderLogicTemplate[] };
};

type RetiredSetting = { path: string; before: unknown; message: string; unresolved?: boolean; remove: () => void };

export function visitC20RetiredSettings(source: C20RetirementSource, visit: (item: RetiredSetting) => void): void {
  const inspectPrecision = (extensions: Pick<RenderRuleExtensions, 'visibility'> | undefined, path: string) => {
    const spec = extensions?.visibility?.lineContainmentChoice;
    if (!spec || spec.precision === undefined) return;
    visit({ path: path + '/visibility/lineContainmentChoice/precision', before: spec.precision,
      message: spec.precision === 1000 ? '线路匹配沿用 X/Z 三位小数。' : '线路匹配统一为 X/Z 三位小数，原精度不同，主线和覆盖线选择可能变化。',
      remove: () => { delete spec.precision; } });
  };
  const inspectLabel = (label: Pick<RenderLabelStyle, 'fallbackValueFormats' | 'valueFormat'> | undefined, path: string) => {
    if (!label?.fallbackValueFormats) return;
    visit({ path: path + '/fallbackValueFormats', before: label.fallbackValueFormats,
      message: '回退来源采用缺省格式 ' + (label.valueFormat ?? 'plain') + '，NofFloor 始终按原值显示。',
      remove: () => { delete label.fallbackValueFormats; } });
  };
  for (const [templates, path] of [
    [source.engine?.renderTemplates, 'engine/renderTemplates'],
    [source.renderDependencies?.templates, 'renderDependencies/templates'],
  ] as const) for (const template of templates ?? []) inspectPrecision(template.modules.visibility, path + '/' + template.id + '/modules/visibility');
  for (const node of source.nodes ?? []) {
    const path = 'nodes/' + node.nodeId;
    for (const field of node.fields) {
      const at = path + '/fields/' + field.fieldId;
      if (field.valueSchema !== undefined) {
        const key = Object.prototype.hasOwnProperty.call(businessJsonTemplateByField, field.key) ? businessJsonTemplateByField[field.key] : undefined;
        const schema = key ? VALUE_SCHEMA_TEMPLATES[key].schema : undefined;
        const equivalent = schema !== undefined && stableConfigText(field.valueSchema) === stableConfigText(schema);
        visit({ path: at + '/valueSchema', before: field.valueSchema, unresolved: !equivalent,
          message: equivalent ? '字段仅声明 JSON 类型，内部结构改由业务核验。' : '此自定义 JSON 结构与已知业务格式不等价，请在原契约核对后再迁移。',
          remove: () => { delete field.valueSchema; } });
      }
      if (field.key === 'TGTcoordinate' && field.coordinateFormat !== undefined) {
        const equivalent = field.coordinateFormat === 'pointObject';
        visit({ path: at + '/coordinateFormat', before: field.coordinateFormat, unresolved: !equivalent,
          message: equivalent ? '目标坐标对象格式改由传送模块核验。' : '目标坐标使用了非标准格式，请核对后再迁移。',
          remove: () => { delete field.coordinateFormat; } });
      }
    }
    if (node.card?.mode === 'fields') for (const item of node.card.items) {
      const relation = item.relation;
      if (relation?.fallbackDisplay === undefined) continue;
      visit({ path: path + '/card/items/' + item.id + '/relation/fallbackDisplay', before: relation.fallbackDisplay,
        message: relation.fallbackDisplay === 'unknown' ? '关联目标查找失败时，改为显示原关联值。' : '关联目标查找失败时统一显示原关联值。',
        remove: () => { delete relation.fallbackDisplay; } });
    }
    for (const [geometry, profile] of Object.entries(node.geometryProfiles)) for (const rule of profile?.zoomPriority.rules ?? []) {
      const at = path + '/geometryProfiles/' + geometry + '/rules/' + rule.id;
      inspectPrecision(rule.logic?.overrides.visibility, at + '/logic/overrides/visibility');
      inspectPrecision(rule.extensions, at + '/extensions');
      inspectLabel(rule.label, at + '/label');
      for (const [index, row] of (rule.label?.mapping?.entries ?? []).entries()) inspectLabel(row.item, at + '/label/mapping/entries/' + index + '/item');
      for (const branch of rule.conditionalOverrides ?? []) {
        inspectPrecision(branch.extensions, at + '/conditionalOverrides/' + branch.id + '/extensions');
        inspectLabel(branch.label, at + '/conditionalOverrides/' + branch.id + '/label');
      }
    }
  }
}

export function migrateC20Settings(source: C20RetirementSource, changes: MigrationChange[]): void {
  visitC20RetiredSettings(source, item => {
    changes.push({ id: 'c19-c20:' + item.path, component: 'contract', path: item.path, before: structuredClone(item.before),
      message: item.message, kind: item.unresolved ? 'unresolved' : 'removed' });
    item.remove();
  });
}
