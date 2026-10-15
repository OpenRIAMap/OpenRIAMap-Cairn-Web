import { subscribeApplication } from '@/core/project/applicationRuntime';
import type React from 'react';
import type { CairnMapRuleButtonBehavior, CairnMapRuleButtonCriteria } from '../../../core/project/environmentTypes';
import { getOpenRIAMapRuleButtonsConfig } from '../../../core/project/openriamapRiaEnvironment';
import { resolveRuleButtonIcon } from './ruleButtonIconRegistry';

/**
 * 规则图层“分组开关”运行配置 adapter。
 *
 * CM_CFG_1B 起：按钮定义主源为
 * project-config/packages/openriamap-ria/environment/ruleButtons.json。
 *
 * 这里保持旧导出 API 不变，供 RuleButtonPanel / ruleButtonFilter / ruleButtonState 继续使用。
 */

export type RuleButtonCriteria = {
  paths?:CairnMapRuleButtonCriteria['paths'];
  /** featureInfo.Class（优先读取 record.meta.className） */
  Class?: string[];
  /**
   * 归一化 Kind（根据要素表自动映射）：
   * - Point: PointKind / PointSKind / PointSKind2
   * - Polyline: PLineKind / PLineSKind / PLineSKind2
   * - Polygon: PGonKind / PGonSKind / PGonSKind2
   * - Building: BuildingKind / BuildingSKind
   * - Floor: FloorKind / FloorSKind
   * - fallback: Kind / SKind / SKind2
   */
  Kind?: string[];
  SKind?: string[];
  SKind2?: string[];
};

export type RuleButtonTone = import('../../../core/project/buttonVisualCatalog').ButtonTone;

export type RuleButtonDef = {
  id: string;
  label: string;
  /** ToolIconButton 的 tone */
  tone: RuleButtonTone;
  icon: React.ReactNode;
  criteria: RuleButtonCriteria;

  /**
   * 互斥规则：当开启本按钮时，若这些按钮当前为开启状态，则会被强制关闭。
   * - 只需要在一侧声明即可（非必须对称）
   */
  exclusiveWith?: string[];

  /**
   * CairnMap JSON 侧行为扩展。
   * - CM_CFG_1B 仅轻量接入，不改变当前默认行为。
   */
  behavior?: CairnMapRuleButtonBehavior;

  /** 配置层默认是否开启；实际 fallback 仍优先使用 defaults.fallback。 */
  defaultEnabled?: boolean;
};

function asStringArray(values: string[] | undefined): string[] | undefined {
  if (!Array.isArray(values)) return undefined;
  const out = values.map((value) => String(value ?? '').trim()).filter(Boolean);
  return out.length > 0 ? out : undefined;
}

function toLegacyCriteria(criteria: CairnMapRuleButtonCriteria | undefined): RuleButtonCriteria {
  return {
    paths:criteria?.paths,
    Class: asStringArray(criteria?.classCode),
    Kind: asStringArray(criteria?.kind),
    SKind: asStringArray(criteria?.skind),
    SKind2: asStringArray(criteria?.skind2),
  };
}

let ruleButtonsConfig = getOpenRIAMapRuleButtonsConfig();

/**
 * 预设按钮：与当前“铁路/地标/玩家”相同的按钮风格与尺寸（ToolIconButton）。
 */
export let RULE_BUTTON_DEFS: RuleButtonDef[] = ruleButtonsConfig.items.map((item) => {
  const behavior = item.behavior ?? {};
  return {
    id: item.id,
    label: item.label,
    tone: item.tone,
    icon: resolveRuleButtonIcon(item.iconKey),
    criteria: toLegacyCriteria(item.criteria),
    exclusiveWith: asStringArray(behavior.exclusiveWith),
    behavior,
    defaultEnabled: item.defaultEnabled,
  };
});

/** 全局开关策略。 */
export let RULE_BUTTON_POLICY = {
  /** 同时开启的最大按钮数（<=0 视为不限制） */
  maxActive: Number(ruleButtonsConfig.policy?.maxActive ?? 0),
};

/** localStorage 新 key。 */
export let RULE_BUTTON_STATE_STORAGE_KEY =
  String(ruleButtonsConfig.storageKey ?? '').trim() || 'cairnmap_rule_button_state_v1';

/** localStorage 旧 key，用于从 OpenRIAMap/RIA 迁移到 CairnMap。 */
export let RULE_BUTTON_STATE_LEGACY_STORAGE_KEYS: string[] = Array.isArray(ruleButtonsConfig.legacyStorageKeys)
  ? ruleButtonsConfig.legacyStorageKeys.map((key) => String(key ?? '').trim()).filter(Boolean)
  : [];

function uniqueKnownIds(ids: string[] | undefined): string[] {
  const known = new Set(RULE_BUTTON_DEFS.map((def) => def.id));
  const seen = new Set<string>();
  const out: string[] = [];
  for (const id of ids ?? []) {
    const key = String(id ?? '').trim();
    if (!key || seen.has(key) || !known.has(key)) continue;
    seen.add(key);
    out.push(key);
  }
  return out;
}

let inferredDefaultEnabledIds = RULE_BUTTON_DEFS
  .filter((def) => def.defaultEnabled !== false)
  .map((def) => def.id);

/** 每个世界的默认开启状态。 */
export let DEFAULT_ACTIVE_RULE_BUTTONS_BY_WORLD: Record<string, string[] | undefined> = Object.fromEntries(
  Object.entries(ruleButtonsConfig.defaults?.byWorld ?? {}).map(([worldId, ids]) => [worldId, uniqueKnownIds(ids)]),
);

/** fallback 默认开启状态；优先使用 JSON defaults.fallback。 */
export let DEFAULT_ACTIVE_RULE_BUTTONS_FALLBACK: string[] =
  uniqueKnownIds(ruleButtonsConfig.defaults?.fallback).length > 0
    ? uniqueKnownIds(ruleButtonsConfig.defaults?.fallback)
    : uniqueKnownIds(inferredDefaultEnabledIds);

subscribeApplication(()=>{
  ruleButtonsConfig=getOpenRIAMapRuleButtonsConfig();
  RULE_BUTTON_DEFS=ruleButtonsConfig.items.map(item=>({id:item.id,label:item.label,tone:item.tone,icon:resolveRuleButtonIcon(item.iconKey),criteria:toLegacyCriteria(item.criteria),exclusiveWith:asStringArray(item.behavior?.exclusiveWith),behavior:item.behavior,defaultEnabled:item.defaultEnabled}));
  RULE_BUTTON_POLICY={maxActive:Number(ruleButtonsConfig.policy?.maxActive??0)};
  RULE_BUTTON_STATE_STORAGE_KEY=ruleButtonsConfig.storageKey??'cairnmap_rule_button_state_v1';RULE_BUTTON_STATE_LEGACY_STORAGE_KEYS=ruleButtonsConfig.legacyStorageKeys??[];
  DEFAULT_ACTIVE_RULE_BUTTONS_BY_WORLD=Object.fromEntries(Object.entries(ruleButtonsConfig.defaults?.byWorld??{}).map(([id,ids])=>[id,uniqueKnownIds(ids)]));
  DEFAULT_ACTIVE_RULE_BUTTONS_FALLBACK=ruleButtonsConfig.defaults?.fallback!==undefined?uniqueKnownIds(ruleButtonsConfig.defaults.fallback):uniqueKnownIds(ruleButtonsConfig.items.filter(item=>item.defaultEnabled!==false).map(item=>item.id));
});
