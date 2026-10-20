import { stableConfigText } from '../configRuntime/configurationFingerprint';
import type { ConfigEngineSettings, ConfigPackageV3 } from './types';

export type EngineDraft = { baseline: ConfigEngineSettings | undefined; value: ConfigEngineSettings };

/** Engine saves replace only the engine, preserving every other module. */
export function prepareEngineCommit(current: ConfigPackageV3, draft: EngineDraft): ConfigPackageV3 {
  if (stableConfigText(current.engine) !== stableConfigText(draft.baseline)) {
    throw Error('全局引擎已被其他编辑更新，请保留草稿并重新读取比较。');
  }
  return { ...current, engine: structuredClone(draft.value) };
}
