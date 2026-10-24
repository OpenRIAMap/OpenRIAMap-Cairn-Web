import { readableClassification } from '../configRuntime/classificationCompatibility';
import { classificationPathKey, pathMatchesScope, validateConfigPackage } from './runtime';
import { syncSystemClassification } from './systemClassification';
import type { ConfigPackageV3, ConfigValidationIssue, ConfigValidationReport, MountedFeatureRecord } from './types';

/** A removed definition must not silently make mounted data disappear. This
 * comparison belongs to the local editing transaction, not the c15 document. */
export function categoryDeletionIssues(baseline: ConfigPackageV3, candidate: ConfigPackageV3, records: MountedFeatureRecord[]): ConfigValidationIssue[] {
  const remaining = new Set(candidate.nodes.map(node => classificationPathKey(node.path)));
  const removed = baseline.nodes.filter(node => !remaining.has(classificationPathKey(node.path)));
  if (!removed.length) return [];
  const groups = new Map<string, ConfigValidationIssue>();
  for (const record of records) {
    const raw = { class: String(record.Class ?? ''), ...(record.Kind ? { kind: String(record.Kind) } : {}),
      ...((record.SKind ?? record.Skind) ? { skind: String(record.SKind ?? record.Skind) } : {}),
      ...((record.SKind2 ?? record.Skind2) ? { skind2: String(record.SKind2 ?? record.Skind2) } : {}) };
    const path = readableClassification(baseline, raw) ?? raw;
    if (!removed.some(node => pathMatchesScope(path, node.path)) || readableClassification(candidate, raw)) continue;
    const key = classificationPathKey(path);
    const group = groups.get(key) ?? { severity: 'error' as const, code: 'mounted-category-deleted',
      path: 'mounted/' + key, message: `分类 ${key} 仍有挂载要素，不能保存删除后的配置；请先完成数据迁移。`,
      affectedFeatures: [], count: 0 };
    group.affectedFeatures!.push({ id: String(record.ID ?? ''), name: String(record.Name ?? record.ID ?? '') });
    group.count = (group.count ?? 0) + 1;
    groups.set(key, group);
  }
  return [...groups.values()];
}

export function withCategoryDeletionIssues(report: ConfigValidationReport, baseline: ConfigPackageV3, candidate: ConfigPackageV3, records: MountedFeatureRecord[]): ConfigValidationReport {
  const extra = categoryDeletionIssues(baseline, candidate, records);
  if (!extra.length) return report;
  return { ...report, valid: false, issues: [...report.issues, ...extra], ...(report.summary ? { summary: {
    ...report.summary, mountedData: report.summary.mountedData + extra.length,
    affectedFeatures: report.summary.affectedFeatures + extra.reduce((sum, issue) => sum + (issue.count ?? 0), 0),
  } } : {}) };
}

/** Build an isolated candidate, never mutate the active package or cascade
 * into data, workflows, tables, buttons, navigation or other business rules. */
export function prepareCategoryDeletion(config: ConfigPackageV3, nodeId: string, records: MountedFeatureRecord[] = []) {
  const selected = config.nodes.find(node => node.nodeId === nodeId);
  if (!selected) throw Error('要删除的分类已不存在，请重新选择。');
  const nodes = config.nodes.filter(node => pathMatchesScope(node.path, selected.path));
  const ids = new Set(nodes.map(node => node.nodeId));
  const next = structuredClone(config);
  next.nodes = next.nodes.filter(node => !ids.has(node.nodeId)).map(node => ({ ...node, children: node.children.filter(id => !ids.has(id)) }));
  const candidate = syncSystemClassification(next);
  const report = withCategoryDeletionIssues(validateConfigPackage(candidate, records), config, candidate, records);
  return { config: candidate, selectedId: nodeId, nodes, report, occupied: categoryDeletionIssues(config, candidate, records) };
}
