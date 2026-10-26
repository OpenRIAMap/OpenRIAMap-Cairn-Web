import type {ConfigPackageV3} from '@/configStudio/types';
import {resolveEffectiveFields} from '@/configStudio/runtime';
import {recordCategory} from '@/configStudio/multipartPolicy';
// CairnMap LEGACY CLEANUP: card field rendering helpers only.
// Do not add new Class-level card layouts here.
import type { FeatureRecord } from '@/components/Rules/rendering/renderPrimitives';
import type { CardInteractiveValue } from './cardInteractions';
import type { RailNewIndex } from '../../Navigation/railNewIndex';

export type CardColorChip = {
  kind: 'colorChip';
  color: string;
  text: string;
};

export type CardLineChips = {
  kind: 'lineChips';
  items: Array<{ name: string; color: string; text?: string }>;
};

/** A compact neutral tag used by declarative V3 cards. */
export type CardTag = {
  kind: 'tag';
  text: string;
  color?: string;
};

export type CardRichValue = CardColorChip | CardLineChips | CardTag | CardInteractiveValue;

export type CardRow = {
  label: string;
  value: any;
  usedPaths?: string[];
};

export type InfoSections = {
  /** 主要信息（默认直接展示） */
  mainRows: CardRow[];
  /** 其他信息（默认收起，用户可展开） */
  otherRows: CardRow[];
};

export function buildInfoSectionsForFeature(
  feature: FeatureRecord,
  _railIndex?: RailNewIndex | null,
  _options?: { disableFieldRules?: boolean;configuration?:ConfigPackageV3 },
): InfoSections {
  // Explicit raw/unparsed section only. Configured cards use V3CardRenderer.
  // A missing native layout must never revive a Class-specific legacy schema.
  const labels=new Map((_options?.configuration?resolveEffectiveFields(_options.configuration,recordCategory(feature.featureInfo)):[]).map(field=>[field.key,field.labels.zh||field.labels.en||field.key]));
  const rows:CardRow[]=[];
  const visit=(value:unknown,path:string)=>{if(value===undefined)return;if(value&&typeof value==='object'&&!Array.isArray(value)&&['tags','extensions'].some(prefix=>path===prefix||path.startsWith(prefix+'.'))){for(const [key,item]of Object.entries(value))visit(item,path+'.'+key);}else rows.push({label:labels.get(path)??path,value,usedPaths:[path]});};
  for(const [key,value]of Object.entries(feature.featureInfo??{}))visit(value,key);
  return {mainRows:[],otherRows:rows};
}

// 兼容旧调用：仍保留拼接后的版本
export function buildInfoRowsForFeature(feature: FeatureRecord): CardRow[] {
  const { mainRows, otherRows } = buildInfoSectionsForFeature(feature, null);
  return [...mainRows, ...otherRows];
}

function pickFirstString(fi: any, candidates: string[]): string {
  for (const k of candidates) {
    const s = String(fi?.[k] ?? '').trim();
    if (s) return s;
  }
  return '';
}

// =========================
// 标题（Name 字段）解析
// =========================
export function pickFeatureDisplayName(feature?: FeatureRecord | null): string {
  if (!feature) return '';
  const fi: any = feature.featureInfo ?? {};

  const direct = pickFirstString(fi, ['Name', 'name', 'staName']);
  if (direct) return direct;

  for (const k of Object.keys(fi)) {
    if (!/name$/i.test(k)) continue;
    const s = String(fi?.[k] ?? '').trim();
    if (s) return s;
  }

  const cls = String(feature?.meta?.Class ?? '').trim();
  const id = String(feature?.meta?.idValue ?? '').trim();
  if (cls || id) return `${cls || 'Feature'}${id ? `: ${id}` : ''}`;
  return '';
}
