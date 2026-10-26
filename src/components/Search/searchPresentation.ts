import type {FeatureRecord} from '@/components/Rules/rendering/renderPrimitives';
import {pickIdFieldValue} from '@/components/Rules/rendering/renderPrimitives';
import {getRuntimeConfiguration} from '@/configRuntime/runtimeDataView';
import {classificationDisplayName} from '@/configStudio/classificationPresentation';
import {recordCategory} from '@/configStudio/multipartPolicy';
import {resolveNodeFieldSettings} from '@/configStudio/nodeFieldSettings';
export function getRuleCategoryName(record:FeatureRecord):string{return classificationDisplayName(getRuntimeConfiguration(),recordCategory(record.featureInfo));}
export function buildBuildingNameIndex(records:FeatureRecord[]):Map<string,string>{const config=getRuntimeConfiguration(),result=new Map<string,string>();if(!config)return result;for(const record of records){const structure=resolveNodeFieldSettings(config,recordCategory(record.featureInfo)).value.structure;if(structure?.enabled&&structure.role==='main'){const name=getRuleDisplayName(record);result.set(String(record.featureInfo.ID??''),name.name);}}return result;}
export function getRuleCategoryLabelWithParent(record:FeatureRecord,parents?:Map<string,string>|null):string{const config=getRuntimeConfiguration(),label=getRuleCategoryName(record);if(!config||!parents)return label;const structure=resolveNodeFieldSettings(config,recordCategory(record.featureInfo)).value.structure;if(!structure?.enabled||structure.role!=='member')return label;const id=String(record.featureInfo[structure.hostField??'']??''),name=parents.get(id);return name?label+'('+name+')':label;}
export function isRuleBlacklisted(record:FeatureRecord):boolean{const config=getRuntimeConfiguration();return Boolean(config&&resolveNodeFieldSettings(config,recordCategory(record.featureInfo)).value.search?.enabled===false);}
export function getRulePriorityIndex(record:FeatureRecord):number{const config=getRuntimeConfiguration();return config?resolveNodeFieldSettings(config,recordCategory(record.featureInfo)).value.search?.priority??100:100;}
export function getRuleDisplayName(r: FeatureRecord): { name: string; rawName: string; idValue: string; idField: string } {
  const fi: any = r?.featureInfo ?? {};
  const tags: any = (fi?.tags ?? fi?.Tags ?? {}) as any;
  const cls = String(r?.meta?.Class ?? fi?.Class ?? '').trim();

  const picked = pickIdFieldValue(fi, cls);
  const idField = String((picked as any)?.idField ?? '').trim();
  const idValue = String((picked as any)?.idValue ?? '').trim();

  const keyMap = (() => {
    const m = new Map<string, string>();
    if (!fi || typeof fi !== 'object') return m;
    for (const k of Object.keys(fi)) m.set(String(k).toLowerCase(), k);
    return m;
  })();

  const tryGet = (k: string) => {
    const v = fi?.[k];
    return v === null || v === undefined ? '' : String(v).trim();
  };
  const tryGetTags = (k: string) => {
    const v = tags?.[k];
    return v === null || v === undefined ? '' : String(v).trim();
  };
  const tryGetCI = (k: string) => {
    const direct = tryGet(k) || tryGetTags(k);
    if (direct) return direct;
    const realKey = keyMap.get(String(k).toLowerCase());
    return realKey ? (tryGet(realKey) || tryGetTags(realKey)) : '';
  };

  // 1) 由 xxxID 推导 xxxName
  let rawName = '';
  if (idField) {
    const derivedNameKey = idField.replace(/ID$/i, 'Name');
    rawName = tryGetCI(derivedNameKey);
    if (!rawName && derivedNameKey && derivedNameKey[0]) {
      const cap = derivedNameKey[0].toUpperCase() + derivedNameKey.slice(1);
      rawName = tryGetCI(cap);
    }
  }

  // 2) 常见字段兜底
  if (!rawName) {
    const commonKeys = [
      'lineName',
      'Name',
      'Name',
      'BuildingName',
      'Name',
      'name',
    ];
    for (const k of commonKeys) {
      rawName = tryGetCI(k);
      if (rawName) break;
    }
  }

  // 3) 扫描任意 *Name：优先选择存在同前缀 *ID 配对的 Name
  if (!rawName) {
    const keys = fi && typeof fi === 'object' ? Object.keys(fi) : [];
    const nameKeys = keys.filter((k) => /name$/i.test(k) && !/(kindname|skindname|classkey)$/i.test(k));

    const scored = nameKeys
      .map((k) => {
        const pairIdKey = k.replace(/name$/i, 'ID');
        const hasPairId = tryGet(pairIdKey) ? 1 : 0;
        return { k, hasPairId };
      })
      .sort((a, b) => (b.hasPairId - a.hasPairId) || a.k.localeCompare(b.k));

    for (const it of scored) {
      const v = tryGet(it.k);
      if (v) {
        rawName = v;
        break;
      }
    }
  }

  const name = rawName ? rawName : idValue ? `${cls} ${idValue}` : `${cls}`;
  return { name, rawName, idValue, idField };
}

/**
 * Extract Kind/SKind/SKind2 triplet with the same compatibility logic as SearchBar.
 * - BUD: Kind/SKind
 * - FLR/STF: Kind/SKind
 * - Otherwise: Point/PLine/PGon* fields based on geometry type, falling back to Kind/SKind/SKind2.
 */
