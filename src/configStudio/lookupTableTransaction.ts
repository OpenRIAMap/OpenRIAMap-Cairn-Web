import type { ConfigPackageV3 } from './types';
import { stableConfigText } from './defaultConfigProvider';
import type { OptionsOwner } from './lookupTables';

export type LookupTableDraft = { baseline: ConfigPackageV3; value: ConfigPackageV3 };

/** Stable owner identities let a table rename merge without replacing a node. */
export function lookupReferenceOwners(config: ConfigPackageV3): Map<string, OptionsOwner> {
  const owners = new Map<string, OptionsOwner>();
  for (const node of config.nodes) {
    for (const field of node.fields) owners.set(JSON.stringify(['field', node.nodeId, field.fieldId]), field);
    if (node.card?.mode === 'fields') for (const item of node.card.items) owners.set(JSON.stringify(['card', node.nodeId, item.id]), item as OptionsOwner);
  }
  for (const workflow of config.workflows) for (const step of workflow.steps) for (const control of step.controls ?? []) {
    owners.set(JSON.stringify(['control', workflow.id, step.id, control.id]), control);
    for (const field of control.group?.itemFields ?? []) owners.set(JSON.stringify(['group', workflow.id, step.id, control.id, field.key]), field);
  }
  return owners;
}

export function lookupDraftSignature(config: ConfigPackageV3): string {
  return stableConfigText({ tables: config.lookupTables ?? [], references: [...lookupReferenceOwners(config)].filter(([, owner]) => owner.optionsTableId).map(([id, owner]) => [id, owner.optionsTableId]).sort(([a], [b]) => a!.localeCompare(b!)) });
}

/** Only tables and explicitly renamed references belong to this transaction. */
export function prepareLookupTableCommit(current: ConfigPackageV3, draft: LookupTableDraft): ConfigPackageV3 {
  if (stableConfigText(current.lookupTables) !== stableConfigText(draft.baseline.lookupTables)) throw Error('对照表活动版本已变化，请保留草稿并重新读取比较；未覆盖新版本。');
  const next = structuredClone(current), before = lookupReferenceOwners(draft.baseline), edited = lookupReferenceOwners(draft.value), live = lookupReferenceOwners(next);
  for (const [id, original] of before) {
    const replacement = edited.get(id);
    if (!replacement || replacement.optionsTableId === original.optionsTableId) continue;
    const target = live.get(id);
    if (!target || target.optionsTableId !== original.optionsTableId) throw Error(`对照引用已变化：${id}，请重新核验；未覆盖其他草稿。`);
    target.optionsTableId = replacement.optionsTableId;
  }
  next.lookupTables = structuredClone(draft.value.lookupTables);
  return next;
}
