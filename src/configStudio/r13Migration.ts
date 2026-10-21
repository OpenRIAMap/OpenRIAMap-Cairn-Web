import type { ConfigPackageV3 } from './types';
import { migrateConfigToR12 } from './r12Migration';
import { defaultNavigationSettings, defaultSharedRailwayRoles } from '../core/project/navigationDefinition';
import { valueSchemaTemplate } from './valueSchema';

export function migrateConfigToR13(value: ConfigPackageV3): {config:ConfigPackageV3;changes:string[];unresolved:string[]} {
  if(value.contractRevision>=13)return {config:structuredClone(value),changes:[],unresolved:[]};
  const previous=value.contractRevision<12?migrateConfigToR12(value):{config:structuredClone(value),changes:[],unresolved:[]};
  const config=previous.config,changes=[...previous.changes],unresolved=[...previous.unresolved];
  if(!config.application)throw Error('迁移需要现有总体规则。');
  const parameters=config.application.preferences.navigation;
  config.application.navigation=defaultNavigationSettings(parameters);
  config.application.preferences.railwayRoles=defaultSharedRailwayRoles();
  delete config.application.preferences.navigation;
  const templates:Record<string,Record<string,string>>={PLF:{lines:'rail-lines'},STA:{platforms:'rail-platforms'},STB:{Stations:'rail-stations',stations:'rail-stations'},SBP:{Stations:'rail-stations',stations:'rail-stations'},ROD:{Mode:'road-modes',ConnectL:'road-connections',Blacklist:'road-blacklist'},TPP:{TGTcoordinate:'target-point'}};
  for(const node of config.nodes)for(const field of node.fields){const template=templates[node.path.class]?.[field.key];if(template&&field.type==='json'&&field.cardinality==='single'&&!field.valueSchema){field.valueSchema=valueSchemaTemplate(template);changes.push(`${node.nodeId}/${field.key}：声明现有规范化器支持的复杂值结构。`);}}
  for(const id of ['teleport-hubs','road-travel-modes'])if(!config.lookupTables?.some(t=>t.id===id))unresolved.push(`缺少默认功能表 ${id}，请在候选中选择或补齐。`);
  config.contractRevision=13;config.revision++;
  changes.push('升级契约 r13；分别保存四组共享铁路角色与四组导航参与范围；原铁路数值保留。','传送／道路接入功能表直接引用。','通用鞘翅速度统一为40、步行4.317；传送旧32／4的耗时估算将变化。');
  return {config,changes,unresolved};
}
