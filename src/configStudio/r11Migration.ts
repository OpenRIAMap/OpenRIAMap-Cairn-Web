import type { ConfigPackageV3 } from './types';
import { migrateConfigToR10 } from './r10Migration';
import { migrateApplicationResources } from '../core/project/applicationResources';

export function migrateConfigToR11(value:ConfigPackageV3):{config:ConfigPackageV3;changes:string[]} {
  if(value.contractRevision>=11)return {config:structuredClone(value),changes:[]};
  const previous=value.contractRevision<10?migrateConfigToR10(value).config:structuredClone(value);
  if(!previous.application)throw Error('缺少可迁移的应用总体规则。');
  const config:ConfigPackageV3={...previous,contractRevision:11,revision:Math.max(previous.revision+1,7),application:migrateApplicationResources(previous.application)};
  return {config,changes:['将默认资源集中到来源组，保留差异世界与非默认投影参数；独立组数据／瓦片身份隔离。']};
}
