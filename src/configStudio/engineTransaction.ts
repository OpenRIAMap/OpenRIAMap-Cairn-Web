import { stableConfigText } from '../configRuntime/configurationFingerprint';
import type { ConfigEngineSettings, ConfigPackageV3 } from './types';

export type EngineSection = 'renderTemplates'|'densityGroups'|'common'|'interactionBaselines';
export type LegacyEngineDraft = { baseline: ConfigEngineSettings | undefined; value: ConfigEngineSettings; recovered?: EngineSection[] };
export type EngineDraft = LegacyEngineDraft & { section?: EngineSection; legacySource?: LegacyEngineDraft };
const commonKeys = ['world','contextView','screenGateDefaults','paneDefaults','missingRenderRule'] as const;
type RecoverableSection = 'common'|'interactionBaselines';

export function splitLegacyEngineDraft(current:ConfigEngineSettings, old:LegacyEngineDraft, section:RecoverableSection):EngineDraft {
  const value=structuredClone(current);
  const keys=section==='common'?commonKeys:['interactionBaselines'] as const;
  for(const key of keys){
    const before=structuredClone(old.baseline?.[key]), after=structuredClone(old.value[key]);
    if(key==='contextView'){
      if(before&&'minZoom' in before)delete before.minZoom;
      if(after&&'minZoom' in after)delete after.minZoom;
    }
    if(stableConfigText(before)===stableConfigText(after))continue;
    if(old.baseline&&stableConfigText(before)!==stableConfigText(current[key]))throw Error('新配置与旧草稿的原始基线有差异，请下载原件并逐项比较。');
    Object.assign(value,{[key]:after});
  }
  return {baseline:current,value,section,legacySource:old};
}

/** Engine saves replace only the engine, preserving every other module. */
export function prepareEngineCommit(current: ConfigPackageV3, draft: EngineDraft): ConfigPackageV3 {
  if (draft.section && current.engine && draft.baseline) {
    const engine = structuredClone(current.engine);
    const section = draft.section;
    if (section === 'renderTemplates' || section === 'densityGroups') {
      const before = new Map((draft.baseline[section] ?? []).map(item=>[item.id,item]));
      const after = new Map((draft.value[section] ?? []).map(item=>[item.id,item]));
      const latest = new Map((engine[section] ?? []).map(item=>[item.id,item]));
      for (const id of new Set([...before.keys(),...after.keys()])) {
        if (stableConfigText(before.get(id)) === stableConfigText(after.get(id))) continue;
        if (stableConfigText(before.get(id)) !== stableConfigText(latest.get(id))) throw Error('此设置已被其他编辑更新，请重新读取。');
        const item=after.get(id); if(item)latest.set(id,item); else latest.delete(id);
      }
      Object.assign(engine,{[section]:structuredClone([...latest.values()])});
    } else {
      const keys = section === 'common' ? commonKeys : ['interactionBaselines'] as const;
      for (const key of keys) {
        if (stableConfigText(draft.baseline[key]) !== stableConfigText(engine[key])) throw Error('此设置已被其他编辑更新，请重新读取。');
        Object.assign(engine,{[key]:structuredClone(draft.value[key])});
      }
    }
    return {...current,engine};
  }
  if (current.contractRevision>=19) throw Error('旧整引擎草稿需要单独处理，无法覆盖 c19 的独立模块。');
  if (stableConfigText(current.engine) !== stableConfigText(draft.baseline)) {
    throw Error('全局引擎已被其他编辑更新，请保留草稿并重新读取比较。');
  }
  return { ...current, engine: structuredClone(draft.value) };
}
