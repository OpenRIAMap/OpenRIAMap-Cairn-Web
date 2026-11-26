import type {ConfigPackageV3} from '@/configStudio/types';
import {recordCategory} from '@/configStudio/multipartPolicy';
import {resolveNodeFieldSettings} from '@/configStudio/nodeFieldSettings';
import {readRecordPath} from '@/configStudio/runtime';
import {assertStructureTargets} from '@/configStudio/structureCommit';
import type {MetadataIssue} from '@/core/audit/contributionContract.mjs';

type RecordInfo = Record<string, unknown>;
type DeleteMark = {ID: string; worldId?: string; classCode?: string};

export function mappingRecordWorld(config: ConfigPackageV3, value: unknown): string {
  const raw = String(value ?? '').trim();
  if (!raw) return raw;
  return config.application?.worlds.find(world =>
    [world.id, world.prefix, String(world.numericCode), world.label.zh, world.label.en]
      .some(alias => alias !== undefined && alias.toLowerCase() === raw.toLowerCase()))?.id ?? raw;
}

function identity(config: ConfigPackageV3, record: RecordInfo): string {
  return JSON.stringify([mappingRecordWorld(config, record.World), record.ID]);
}

function group(config: ConfigPackageV3, records: readonly RecordInfo[]): Map<string, RecordInfo[]> {
  const groups = new Map<string, RecordInfo[]>();
  for (const raw of records) {
    const record = raw.featureInfo && typeof raw.featureInfo === 'object' ? raw.featureInfo as RecordInfo : raw;
    const key = identity(config, record);
    const rows = groups.get(key) ?? [];
    rows.push(record);
    groups.set(key, rows);
  }
  return groups;
}

/** Saved local edits replace their formal version, never genuine duplicates. */
export function effectiveMappingRecords(config: ConfigPackageV3, formal: readonly RecordInfo[], saved: readonly RecordInfo[], deletes: readonly DeleteMark[] = []): RecordInfo[] {
  const baseline = group(config, formal);
  for (const [key, rows] of baseline) {
    const remaining = rows.filter(record => !deletes.some(mark => Boolean(mark.worldId && mark.classCode)
      && mappingRecordWorld(config, mark.worldId) === mappingRecordWorld(config, record.World)
      && mark.classCode === record.Class && mark.ID === record.ID));
    if (remaining.length) baseline.set(key, remaining);
    else baseline.delete(key);
  }
  for (const [key, local] of group(config, saved)) {
    const current = baseline.get(key) ?? [];
    // Keep ambiguity visible to the existing validators. A cross-Class write
    // is not a classification edit within one feature's Class.
    baseline.set(key, current.length <= 1 && local.length === 1 && (!current.length || current[0].Class === local[0].Class)
      ? local : [...current, ...local]);
  }
  return [...baseline.values()].flat();
}

/** Recheck only actual package writes against the final effective world pool. */
export function assertExportStructureTargets(config: ConfigPackageV3, written: readonly RecordInfo[], formal: readonly RecordInfo[], deletes: readonly DeleteMark[], loadedWorlds: readonly string[]): void {
  if (config.contractRevision < 10) return;
  const final = effectiveMappingRecords(config, formal, written, deletes);
  const index = group(config, final);
  const ready = new Set(loadedWorlds.map(world => mappingRecordWorld(config, world)));
  const issues: MetadataIssue[] = [];
  for (const record of written) {
    const worldId = mappingRecordWorld(config, record.World), featureId = String(record.ID ?? '');
    const issue = (field: string, value: unknown, code: string, message: string) => issues.push({
      worldId, classCode: String(record.Class ?? ''), featureId, field, value, code, message,
      path: `Data_Spilt/${worldId}/${String(record.Class ?? '')}/${featureId}.json`,
    });
    const matches = index.get(identity(config, record)) ?? [];
    if (matches.length !== 1) {
      issue('ID', record.ID, 'mapping-record-id-ambiguous', `要素 ${featureId} 在同世界存在重复 ID 或跨 Class 冲突，不能自动选择版本。`);
      continue;
    }
    const role = resolveNodeFieldSettings(config, recordCategory(record)).value.structure;
    if (!role?.enabled || role.role !== 'member') continue;
    const field = role.hostField ?? '', target = readRecordPath(record, field);
    if (!ready.has(worldId)) {
      issue(field, target, 'mapping-structure-world-not-ready', `附属 ${featureId} 的世界 ${worldId} 数据尚未就绪，请先载入该世界后重试。`);
      continue;
    }
    try {
      assertStructureTargets(config, [record], final.filter(other => other !== record));
    } catch {
      const targets = index.get(identity(config, {World: record.World, ID: target})) ?? [];
      const reason = !targets.length ? '不存在' : targets.length > 1 ? '不唯一' : '未启用主结构身份';
      issue(field, target, 'mapping-structure-target-invalid', `附属 ${featureId} 的主结构 ${String(target)} ${reason}；请修正引用或恢复对应主结构后重新生成标准包。`);
    }
  }
  if (issues.length) throw Object.assign(new Error(`主附属关系复核未通过：${issues.map(issue => issue.message).slice(0, 5).join('\n')}`), {issues});
}
