import type { ConfigPackageV3 } from './types';
import { migrateV31Package, migrateV4Package, migrateV5Package } from './package';
import { compileConfigRuntime, validateConfigPackage } from './runtime';
import { canonicalDictionaries } from './dictionaryContract';
export {configPreflightStats as configActivationStats} from './runtime';
/** One validation boundary for persisted packages and runtime activation.
 * Import/edit may retain a diagnostic draft, but never bypass this boundary. */
export function prepareConfigForActivation(value: ConfigPackageV3): ConfigPackageV3 {
  if (!value || value.schemaVersion !== 'cairnmap.config-package.v3') throw new Error('无法启用：配置包结构或 schemaVersion 无效。');
  let config = structuredClone(value);
  if (config.contractRevision === 3) config = migrateV31Package(config);
  if (config.contractRevision === 4) config = migrateV4Package(config);
  if (config.contractRevision === 5) config = migrateV5Package(config);
  if (![6,7,8,9,10,11].includes(config.contractRevision)) throw new Error(`无法启用：未知的原生契约 revision ${config.contractRevision}。`);
  const report = validateConfigPackage(config);
  if (!report.valid) throw new Error(`无法保存或启用无效配置：${report.issues.filter(issue => issue.severity === 'error').slice(0,5).map(issue => `${issue.path}：${issue.message}`).join('；')}`);
  // Normalisation must never erase a conflict before the shared boundary sees
  // it (e.g. a live dictionary reference plus contradictory local rows).
  config=canonicalDictionaries(config);
  return compileConfigRuntime(config, true);
}
