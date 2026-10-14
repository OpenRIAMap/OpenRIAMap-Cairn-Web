import { getApplicationSettings, applicationWorld, subscribeApplication } from '@/core/project/applicationRuntime';
import { getOpenRIAMapDataSourcesConfig } from '../../../core/project/openriamapRiaEnvironment';
import { loadWorldRuleDataset } from '@/components/Rules/data/worldRuleDatasetLoader';

/**
 * 规则驱动图层的数据源清单（按 worldId 管理）。
 *
 * 兼容目标：
 * - 旧链路：继续使用 baseUrl + files 从 public 目录读取 JSON
 * - 新链路：通过 sourceMode 标记该 world 的主显示来源（pub/dat）
 *
 * 说明：
 * - 当前 Navigation / 工作流搜索等旧模块仍依赖 baseUrl + files，因此这些字段继续保留。
 * - RuleDrivenLayer / 新 Rules 主显示链路会优先按 sourceMode 走新的 world 级数据集加载。
 */

export type WorldRuleDataSource = {
  /** 旧 public JSON 数据根目录（兼容旧模块） */
  baseUrl: string;
  /** 旧 public JSON 文件列表（兼容旧模块） */
  files: string[];
  /** 新链路主来源：pub=public，dat=Data 仓库 */
  sourceMode?: 'pub' | 'dat';
  /** 图片主来源：默认与 sourceMode 一致 */
  pictureSourceMode?: 'pub' | 'dat';
};

function buildRuleDataSources(): Record<string, WorldRuleDataSource> {
  const config = getOpenRIAMapDataSourcesConfig();
  const out: Record<string, WorldRuleDataSource> = {};
  for (const item of config.items) {
    const worldId = String(item.worldId ?? '').trim();
    if (!worldId) continue;
    out[worldId] = {
      baseUrl: item.baseUrl,
      files: Array.isArray(item.files) ? item.files : [],
      sourceMode: item.sourceMode,
      pictureSourceMode: item.pictureSourceMode,
    };
  }
  return out;
}

export let RULE_DATA_SOURCES: Record<string, WorldRuleDataSource> = buildRuleDataSources();


export function normalizeRuleSourceWorldId(worldId:string):string {
  const raw=String(worldId??'').trim(),worlds=getApplicationSettings().worlds;
  return worlds.find(world=>world.id.toLowerCase()===raw.toLowerCase()||world.prefix.toLowerCase()===raw.toLowerCase()||String(world.numericCode)===raw||world.label.zh===raw||world.label.en&&world.label.en===raw)?.id??(raw||applicationWorld('').id);
}
export async function loadRuleItemsForWorld(worldId:string,_opt?:{fetcher?:(url:string)=>Promise<any[]>}):Promise<any[]> {
  return (await loadWorldRuleDataset(normalizeRuleSourceWorldId(worldId))).features;
}

subscribeApplication(()=>{RULE_DATA_SOURCES=buildRuleDataSources();});
