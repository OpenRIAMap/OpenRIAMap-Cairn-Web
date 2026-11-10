import { BUILTIN_DENSITY_GROUP_NAMES, C19_GEOMETRIES } from './c19Render';
import type { EngineDraft } from './engineTransaction';
import { classificationPathKey, resolveGeometryProfile } from './runtime';
import type { ConfigEngineSettings, ConfigPackageV3, GeometryKind, GeometryProfile, RenderLogicModules, ZoomPriorityRule } from './types';

export type RegistrySection = 'renderTemplates' | 'densityGroups';
type RuleReference = { classification: string; geometry: GeometryKind; ruleId: string; zoom: string };
export type RegistryReference = RuleReference & { source: string; via: string };
export type RegistryUsage = { saved: Map<string, RegistryReference[]>; effective: Map<string, RegistryReference[]> };
type CollisionModule = RenderLogicModules['collision'];

export function registryItemProtected(section: RegistrySection, id: string): boolean {
  return section === 'densityGroups' && Object.prototype.hasOwnProperty.call(BUILTIN_DENSITY_GROUP_NAMES, id);
}

function addReference(index: Map<string, RegistryReference[]>, id: string, reference: RegistryReference) {
  const rows = index.get(id);
  if (rows) rows.push(reference);
  else index.set(id, [reference]);
}

function groupReferences(collision: CollisionModule | undefined, add: (id: string, via: string) => void) {
  if (collision?.groupId) add(collision.groupId, '所属密度组');
  for (const [targets, title] of [[collision?.collision?.blocks, '阻挡标签对象'], [collision?.collision?.collideWith, '检测碰撞对象']] as const) {
    for (const target of new Set(targets)) if (target.startsWith('group:')) add(target.slice(6), title);
  }
}

export function registryUsage(config: ConfigPackageV3, engine: ConfigEngineSettings, section: RegistrySection, includeEffective = true): RegistryUsage {
  const saved = new Map<string, RegistryReference[]>();
  const effective = new Map<string, RegistryReference[]>();
  const profileOwners = new Map<GeometryProfile, string>();
  const templates = new Map((engine.renderTemplates ?? []).map(item => [item.id, item]));
  const ruleReference = (classification: string, geometry: GeometryKind, rule: ZoomPriorityRule): RuleReference => ({
    classification, geometry, ruleId: rule.id,
    zoom: rule.when ? `${rule.when.zoom.min}–${rule.when.zoom.max}` : '',
  });
  for (const node of config.nodes) {
    const path = classificationPathKey(node.path);
    for (const geometry of C19_GEOMETRIES) {
      const profile = node.geometryProfiles[geometry];
      if (!profile) continue;
      profileOwners.set(profile, path);
      for (const rule of profile.zoomPriority.rules) {
        const row = ruleReference(path, geometry, rule);
        if (section === 'renderTemplates') {
          if (rule.logic?.templateId) addReference(saved, rule.logic.templateId, { ...row, source: path, via: '规则引用模板' });
        } else {
          groupReferences(rule.logic?.overrides.collision, (id, via) => addReference(saved, id, { ...row, source: path, via: '规则覆写 · ' + via }));
        }
      }
    }
  }
  if (section === 'densityGroups') for (const template of templates.values()) {
    const source = (template.name.zh || template.name.en || template.id) + ' · ' + template.id;
    groupReferences(template.modules.collision, (id, via) => addReference(saved, id, {
      classification: '', geometry: template.geometry, ruleId: '', zoom: '', source, via: '模板 · ' + via,
    }));
  }
  if (includeEffective) for (const node of config.nodes) {
    const path = classificationPathKey(node.path);
    for (const geometry of C19_GEOMETRIES) {
      const profile = resolveGeometryProfile(config, node.path, geometry);
      if (!profile?.enabled || profile.renderState === 'unconfigured') continue;
      const owner = profileOwners.get(profile) ?? path;
      for (const rule of profile.zoomPriority.rules) {
        if (rule.representation === 'hidden') continue;
        const row = ruleReference(path, geometry, rule);
        const template = templates.get(rule.logic?.templateId ?? '');
        if (section === 'renderTemplates') {
          if (template?.geometry === geometry) addReference(effective, template.id, { ...row, source: owner, via: '规则采用模板' });
        } else {
          const local = rule.logic?.overrides.collision;
          const inherited = template?.geometry === geometry ? template : undefined;
          const source = local || !inherited ? owner : `${owner} → ${inherited.name.zh || inherited.name.en || inherited.id}`;
          groupReferences(local ?? inherited?.modules.collision, (id, via) => addReference(effective, id, { ...row, source, via }));
        }
      }
    }
  }
  return { saved, effective };
}

export function assertRegistryRemovals(config: ConfigPackageV3, draft: EngineDraft) {
  const section = draft.section;
  if (!config.engine || (section !== 'renderTemplates' && section !== 'densityGroups')) return;
  const kept = new Set((draft.value[section] ?? []).map(item => item.id));
  const removed = (draft.baseline?.[section] ?? []).filter(item => !kept.has(item.id));
  if (!removed.length) return;
  const { saved } = registryUsage(config, config.engine, section, false);
  for (const item of removed) {
    const name = item.name.zh || item.name.en || item.id;
    if (registryItemProtected(section, item.id)) throw Error('内置密度组受保护：' + name);
    const references = saved.get(item.id);
    if (references?.length) throw Error(`「${name}」仍有引用：${references.map(ref => [ref.source, ref.ruleId, ref.via].filter(Boolean).join(' / ')).join('；')}`);
  }
}
